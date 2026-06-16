#!/usr/bin/env bun
// forsvn-web — the persistent localhost WORKSPACE SERVER for the FORSVN human
// surface (the two-panel web shell that replaces the Tauri desktop shell on the
// human side). Evolves the one-shot `forsvn-preview` review server into a
// long-lived process that:
//   • reads `.forsvn/index/manifest.json` and serves the artifact index + views,
//   • writes human review decisions back to artifact frontmatter (atomic,
//     hash-guarded — the same contract as `/forsvn:review`),
//   • streams on-disk changes over a WebSocket so the shell re-indexes live,
//   • (P2) proxies suggest-only collab to Proof.
//
// Loopback-only, local-first, no telemetry. The browser only ever talks to its
// own origin: in dev, Vite (5173) proxies /api + /ws here; in prod this process
// serves the built SPA and the API from one origin — so no CORS is needed and a
// cross-origin page cannot read the session token or forge a same-origin POST.

import { randomBytes, timingSafeEqual } from "node:crypto";
import { spawnSync } from "node:child_process";
import { watch, existsSync, readFileSync, statSync, type FSWatcher } from "node:fs";
import { join, extname, normalize, sep, isAbsolute } from "node:path";
import { homedir } from "node:os";
import type { ServerWebSocket } from "bun";
import { findProjectRoot, openArtifact, exportArtifact, readArtifact, readField } from "../lib/collab";
import { startProofServer, type ProofServerHandle } from "../lib/proof-server";
import { ProofClient } from "../lib/proof-client";
import {
  loadManifest,
  manifestExists,
  listAll,
  getArtifact,
  connections,
  loadProject,
  writeDecision,
  syncManifest,
  ConflictError,
  NotFoundError,
  VALID_DECISIONS,
} from "../lib/workspace";

const HOST = "127.0.0.1";
const DEFAULT_PORT = 4317;

// Free-tier license status — mirrors `forsvn_core::FREE` + the desktop
// `free_status()` (monetization-build-spec §4/§6). The web server is fail-safe to
// free: it holds no second Ed25519 verifier and no provisioned public key, so the
// honest current status is free. See GET /api/license.
const FREE_LICENSE_STATUS = {
  state: "none",
  plan: "free",
  revalidate_due: false,
  entitlements: { watermark_free: false, hosted_backend: false, unlimited_workspaces: false, seats: 1 },
} as const;

interface Args {
  root: string;
  port: number;
  spaDir: string | null;
  open: boolean;
}

const VALUE_FLAGS = new Set(["--port", "--spa"]);

function parseArgs(argv: string[]): Args {
  // Positionals are the non-flag args that AREN'T the value of a value-flag
  // (`--port 4319` → 4319 is not the root). The space form and the `=` form
  // both work; the `=` form consumes no following token.
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const name = a.split("=")[0];
      if (VALUE_FLAGS.has(name) && !a.includes("=")) i++; // skip the consumed value
      continue;
    }
    positional.push(a);
  }
  const value = (name: string): string | undefined => {
    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.slice(name.length + 1);
    const i = argv.indexOf(name);
    return i >= 0 && i + 1 < argv.length && !argv[i + 1].startsWith("--") ? argv[i + 1] : undefined;
  };
  const rootArg = positional[0] ?? process.cwd();
  let root: string;
  try {
    root = findProjectRoot(rootArg);
  } catch {
    root = rootArg; // no .forsvn/ above — serve it anyway; the API surfaces "no manifest"
  }
  return {
    root,
    port: Number(value("--port")) || DEFAULT_PORT,
    spaDir: value("--spa") ?? null,
    open: argv.includes("--open"),
  };
}

function gitUserEmail(root: string): string | null {
  const r = spawnSync("git", ["config", "user.email"], { cwd: root, encoding: "utf8" });
  const email = (r.stdout || "").trim();
  return r.status === 0 && email.length > 0 ? email : null;
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

// --- responses ---------------------------------------------------------------

const NO_STORE = { "cache-control": "no-store" };

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...NO_STORE, ...headers },
  });
}

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8",
};

// --- main --------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));
const TOKEN = randomBytes(32).toString("hex");

// One artifact-change broadcast topic for every connected shell.
const WS_TOPIC = "ws";

// --- Proof co-edit (P2): one doc-server per workspace, started lazily ---------
// The workspace server is the single trusted local writer of canonical .md and
// the operator-side holder of the Proof session. Agents reach Proof only through
// the suggest-only forsvn-mcp tools (collab_read/suggest/comment/events); there
// is no accept tool anywhere (collab_guard.rs), and the agent never gets the
// ownerSecret. This server proxies open/events/export for the human surface.

let proofHandle: ProofServerHandle | null = null;
let proofStarting: Promise<ProofServerHandle> | null = null;

/** Where the Proof SDK lives. Honor FORSVN_PROOF_DIR (startProofServer reads it);
 *  else fall back to proof-setup's default `~/proof-sdk` if it's a valid install,
 *  so co-edit "just works" after a one-time `proof-setup` without exporting env. */
function proofDirOpt(): string | undefined {
  if (process.env.FORSVN_PROOF_DIR) return undefined;
  const def = join(homedir(), "proof-sdk");
  return existsSync(join(def, "server", "index.ts")) && existsSync(join(def, "node_modules")) ? def : undefined;
}

async function ensureProof(): Promise<ProofServerHandle> {
  if (proofHandle) {
    proofHandle.touch();
    return proofHandle;
  }
  if (proofStarting) return proofStarting;
  proofStarting = startProofServer({ projectRoot: args.root, proofDir: proofDirOpt() })
    .then((h) => {
      proofHandle = h;
      proofStarting = null;
      return h;
    })
    .catch((e) => {
      proofStarting = null;
      throw e;
    });
  return proofStarting;
}

/** A human-readable hint when Proof can't start (most often: not installed). */
function proofHint(e: unknown): string {
  const msg = String(e instanceof Error ? e.message : e);
  if (/no Proof install|FORSVN_PROOF_DIR|not a Proof SDK|no node_modules/.test(msg)) {
    return `Co-edit needs the Proof doc-server. Run \`bun skills/forsvn-preview/bin/proof-setup.ts\` once (or set FORSVN_PROOF_DIR). (${msg})`;
  }
  return msg;
}

/** Resolve an id-or-path route param to its absolute on-disk artifact path. */
function artifactAbsPath(idOrPath: string): string | null {
  const man = loadManifest(args.root);
  const rel = man.artifacts[idOrPath] ? idOrPath : man.by_id[idOrPath];
  return rel ? join(args.root, rel) : null;
}

/** Reject a mutation whose Origin/Host isn't loopback (defense-in-depth atop the
 *  same-origin token). A browser always sends Origin on a cross-site POST; a
 *  loopback origin is the only one a same-origin shell produces. */
function isLoopbackOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser client (curl, the CLI) — token still required
  try {
    const h = new URL(origin).hostname;
    return h === "127.0.0.1" || h === "localhost" || h === "[::1]" || h === "::1";
  } catch {
    return false;
  }
}

function checkToken(req: Request): boolean {
  const t = req.headers.get("x-forsvn-token") ?? "";
  return t.length > 0 && constantTimeEqual(t, TOKEN);
}

/** Serve a built-SPA file (prod path). Returns null when there's no SPA dir or
 *  the target escapes it / doesn't exist (caller falls through to index.html). */
function serveSpaFile(pathname: string): Response | null {
  if (!args.spaDir) return null;
  const rel = normalize(pathname === "/" ? "/index.html" : pathname).replace(/^\/+/, "");
  if (isAbsolute(rel) || rel.split(sep).includes("..")) return null;
  const file = join(args.spaDir, rel);
  if (!existsSync(file) || !statSync(file).isFile()) return null;
  const body = readFileSync(file);
  return new Response(body, { headers: { "content-type": MIME[extname(file)] ?? "application/octet-stream" } });
}

const server = Bun.serve({
  hostname: HOST,
  port: args.port,
  async fetch(req, srv) {
    const url = new URL(req.url);
    const { pathname } = url;

    // WebSocket upgrade — live disk-change stream.
    if (pathname === "/ws") {
      if (srv.upgrade(req)) return undefined as unknown as Response;
      return new Response("expected websocket", { status: 426 });
    }

    // ---- API ----
    if (pathname.startsWith("/api/")) {
      // License status is workspace-independent (it's about the operator's license,
      // not the project), so it answers even before a manifest exists.
      if (!manifestExists(args.root) && pathname !== "/api/workspace" && !pathname.startsWith("/api/license")) {
        return json(503, { error: "no .forsvn/index/manifest.json in this workspace yet" });
      }

      // GET /api/license — server-authoritative license status (build-spec §4/§6).
      // The offline verifier is forsvn-core (Rust, in the desktop binary); the web
      // server keeps no second verifier and no embedded key, so it reports the
      // honest current state: free. This is the seam — once the backend + a
      // forsvn-core-backed read exist (§9 steps 5–7), the real tier resolves here.
      if (req.method === "GET" && pathname === "/api/license") {
        return json(200, FREE_LICENSE_STATUS);
      }

      // POST /api/license/activate — the ONE network egress besides revalidation
      // (§6). Proxies a pasted key to the license backend's /activate (Ed25519
      // signer), then caches the signed file. The backend is operator-gated and
      // not deployed (§9 step 6), so this returns "not configured" — never a fake
      // success. The proxy call slots in where this 501 is.
      if (req.method === "POST" && pathname === "/api/license/activate") {
        if (!isLoopbackOrigin(req)) return json(403, { error: "cross-origin request refused" });
        if (!checkToken(req)) return json(403, { error: "bad or missing session token" });
        return json(501, {
          error:
            "Activation backend not configured yet — stand up the license backend (build-spec §9 step 6) and wire its URL here.",
        });
      }

      // GET /api/workspace — the transport probe + session bootstrap. Same-origin
      // readable only (no permissive CORS header), so the token never leaks to a
      // cross-origin page.
      if (req.method === "GET" && pathname === "/api/workspace") {
        const hasManifest = manifestExists(args.root);
        return json(200, {
          name: args.root.split(sep).filter(Boolean).slice(-1)[0] ?? args.root,
          root: args.root,
          gitEmail: gitUserEmail(args.root),
          hasManifest,
          token: TOKEN,
        });
      }

      // GET /api/projects — v0 is single-root; the switcher lists this one.
      if (req.method === "GET" && pathname === "/api/projects") {
        try {
          return json(200, [loadProject(args.root)]);
        } catch (e) {
          return json(200, []);
        }
      }

      // GET /api/artifacts — the full stream (the shell filters client-side).
      if (req.method === "GET" && pathname === "/api/artifacts") {
        return json(200, listAll(loadManifest(args.root)));
      }

      // /api/artifacts/:id  (+ /links · /decision · /collab/open|events|export)
      const m = pathname.match(
        /^\/api\/artifacts\/([^/]+)(\/links|\/decision|\/collab\/open|\/collab\/events|\/collab\/export)?$/,
      );
      if (m) {
        const id = decodeURIComponent(m[1]);
        const sub = m[2];

        if (req.method === "GET" && !sub) {
          try {
            return json(200, getArtifact(args.root, loadManifest(args.root), id));
          } catch (e) {
            return e instanceof NotFoundError ? json(404, { error: e.message }) : json(500, { error: String(e) });
          }
        }

        if (req.method === "GET" && sub === "/links") {
          const man = loadManifest(args.root);
          const path = man.artifacts[id] ? id : man.by_id[id];
          const entry = path ? man.artifacts[path] : undefined;
          return json(200, entry ? connections(man, entry.id) : { references: [], referenced_by: [], upstream: [], downstream: [] });
        }

        if (req.method === "POST" && sub === "/decision") {
          if (!isLoopbackOrigin(req)) return json(403, { error: "cross-origin request refused" });
          if (!checkToken(req)) return json(403, { error: "bad or missing session token" });
          let body: Record<string, unknown>;
          try {
            body = (await req.json()) as Record<string, unknown>;
          } catch {
            return json(400, { error: "invalid JSON body" });
          }
          if (typeof body.decision !== "string" || !(VALID_DECISIONS as readonly string[]).includes(body.decision)) {
            return json(400, { error: `decision must be ${VALID_DECISIONS.join(" | ")}` });
          }
          try {
            const view = writeDecision(args.root, id, {
              decision: body.decision as (typeof VALID_DECISIONS)[number],
              reviewer: typeof body.reviewer === "string" ? body.reviewer : "",
              reviewedAt:
                typeof body.reviewedAt === "string" && body.reviewedAt
                  ? body.reviewedAt
                  : new Date().toISOString().slice(0, 10),
              comment: typeof body.comment === "string" ? body.comment : "",
              expectedHash: typeof body.expectedHash === "string" ? body.expectedHash : null,
            });
            // The write changed the file (and re-indexed) — nudge every shell.
            srv.publish(WS_TOPIC, JSON.stringify({ type: "disk_changed", paths: [view.path] }));
            return json(200, view);
          } catch (e) {
            if (e instanceof ConflictError) return json(409, { error: e.message });
            if (e instanceof NotFoundError) return json(404, { error: e.message });
            return json(500, { error: String(e) });
          }
        }

        // POST …/collab/open — bind the artifact to a Proof working doc and return
        // the loopback editor URL. The doc-server is started lazily + reused.
        if (req.method === "POST" && sub === "/collab/open") {
          if (!isLoopbackOrigin(req)) return json(403, { error: "cross-origin request refused" });
          if (!checkToken(req)) return json(403, { error: "bad or missing session token" });
          const abs = artifactAbsPath(id);
          if (!abs) return json(404, { error: "artifact not found" });
          try {
            const handle = await ensureProof();
            const r = await openArtifact(new ProofClient(handle.baseUrl), handle.baseUrl, abs);
            // openArtifact wrote proof_slug/collab_state to the .md; re-index here
            // (its own runManifestSync targets scripts/, absent in the dev repo).
            syncManifest(args.root);
            srv.publish(WS_TOPIC, JSON.stringify({ type: "disk_changed", paths: [abs] }));
            return json(200, { slug: r.slug, editorUrl: r.editorUrl, created: r.created });
          } catch (e) {
            return json(503, { error: proofHint(e) });
          }
        }

        // GET …/collab/events — presence + the pending suggest/comment feed
        // (read-only; the human accepts inside the Proof editor, never here).
        if (req.method === "GET" && sub === "/collab/events") {
          if (!proofHandle) return json(200, { connected: false, events: [] });
          const abs = artifactAbsPath(id);
          if (!abs) return json(404, { error: "artifact not found" });
          let slug = "";
          try {
            slug = readField(readArtifact(abs).text, "proof_slug") ?? "";
          } catch {
            /* unreadable — treat as not connected */
          }
          if (!slug) return json(200, { connected: false, events: [] });
          proofHandle.touch();
          try {
            const after = url.searchParams.get("after");
            const q = `?limit=100${after ? `&after=${encodeURIComponent(after)}` : ""}`;
            const res = await fetch(`${proofHandle.baseUrl}/documents/${slug}/events/pending${q}`);
            const body = (await res.json().catch(() => ({}))) as { events?: unknown[] };
            return json(200, { connected: true, events: Array.isArray(body.events) ? body.events : [] });
          } catch {
            return json(200, { connected: false, events: [] });
          }
        }

        // POST …/collab/export — pull the accepted Markdown back to canonical with
        // decision_state + collab_state: exported (operator-only write, hash-guarded).
        if (req.method === "POST" && sub === "/collab/export") {
          if (!isLoopbackOrigin(req)) return json(403, { error: "cross-origin request refused" });
          if (!checkToken(req)) return json(403, { error: "bad or missing session token" });
          const abs = artifactAbsPath(id);
          if (!abs) return json(404, { error: "artifact not found" });
          let body: Record<string, unknown>;
          try {
            body = (await req.json()) as Record<string, unknown>;
          } catch {
            return json(400, { error: "invalid JSON body" });
          }
          if (typeof body.decision !== "string" || !(VALID_DECISIONS as readonly string[]).includes(body.decision)) {
            return json(400, { error: `decision must be ${VALID_DECISIONS.join(" | ")}` });
          }
          const decision = body.decision as (typeof VALID_DECISIONS)[number];
          const reviewer = typeof body.reviewer === "string" && body.reviewer.trim() ? body.reviewer.trim() : undefined;
          try {
            const handle = await ensureProof();
            const out = await exportArtifact(new ProofClient(handle.baseUrl), abs, { decision, reviewer });
            syncManifest(args.root);
            const view = getArtifact(args.root, loadManifest(args.root), id);
            srv.publish(WS_TOPIC, JSON.stringify({ type: "disk_changed", paths: [view.path] }));
            return json(200, { view, bodyChanged: out.bodyChanged });
          } catch (e) {
            const msg = String(e instanceof Error ? e.message : e);
            // exportArtifact throws a plain Error on the open→export hash mismatch.
            if (/hash mismatch|changed since/i.test(msg)) return json(409, { error: msg });
            return json(500, { error: proofHint(e) });
          }
        }
      }

      return json(404, { error: "unknown endpoint" });
    }

    // ---- SPA (prod) ----
    const spa = serveSpaFile(pathname);
    if (spa) return spa;
    // SPA fallback (client-side routing) when a dir is configured.
    if (args.spaDir) {
      const index = serveSpaFile("/index.html");
      if (index) return index;
    }
    return new Response(
      "FORSVN workspace server is running.\nThe SPA is served by the Vite dev server in development (run `bun run dev` in desktop/).\n",
      { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  },
  websocket: {
    open(ws: ServerWebSocket) {
      ws.subscribe(WS_TOPIC);
    },
    message() {
      /* the shell never sends; the server only broadcasts */
    },
    close(ws: ServerWebSocket) {
      ws.unsubscribe(WS_TOPIC);
    },
  },
});

// --- filesystem watcher → WS broadcast ---------------------------------------
// Watch the knowledge home + the index so an agent push or a re-index reaches the
// shell. Debounced: a single agent write touches the .md, then manifest-sync
// rewrites two index files — collapse the burst into one frame.

const watchers: FSWatcher[] = [];
let debounce: ReturnType<typeof setTimeout> | null = null;
const pending = new Set<string>();

function broadcast(): void {
  debounce = null;
  const paths = [...pending];
  pending.clear();
  server.publish(WS_TOPIC, JSON.stringify({ type: "disk_changed", paths }));
}

function onFsEvent(rel: string | null): void {
  if (rel) pending.add(rel);
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(broadcast, 150);
}

for (const dir of [join(args.root, "docs", "forsvn"), join(args.root, ".forsvn", "index")]) {
  if (!existsSync(dir)) continue;
  try {
    const w = watch(dir, { recursive: true }, (_event, filename) => {
      if (filename && !filename.toString().endsWith(".tmp")) onFsEvent(filename.toString());
    });
    watchers.push(w);
  } catch {
    /* recursive watch unsupported here — live updates degrade to manual refresh */
  }
}

async function shutdown(): Promise<void> {
  for (const w of watchers) w.close();
  await proofHandle?.stop().catch(() => {});
  server.stop(true);
  process.exit(0);
}
process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

const baseUrl = `http://${HOST}:${server.port}`;
console.log(`[forsvn-web] workspace server on ${baseUrl}`);
console.log(`[forsvn-web] root: ${args.root}`);
console.log(`[forsvn-web] manifest: ${manifestExists(args.root) ? "present" : "MISSING — run manifest-sync"}`);
if (!args.spaDir) console.log(`[forsvn-web] SPA: dev mode — start Vite in desktop/ (bun run dev)`);

if (args.open) {
  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawnSync(opener, [baseUrl], { stdio: "ignore" });
}
