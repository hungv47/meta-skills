#!/usr/bin/env bun
// GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root.
// forsvn-preview — local preview server for review-surface HTML twins.
// Spawns a CSRF-protected Bun.serve() on 127.0.0.1, opens the browser to the
// HTML preview, blocks until POST /done writes the decision back to MD
// frontmatter, archives the HTML, and exits.
//
// Contract: references/review-surface-design.md § 3 (v2) + html-output-critic
// rubric check #6 (v2 — postback allowed only to /done with documented payload).
//
// Usage:
//   bun scripts/forsvn-preview.ts .forsvn/artifacts/mkt-create-brand-2026-05-26-x.html
//
// Exit codes:
//   0   decision recorded
//   1   user-error (file missing, decision_state not pending, dirty tree, etc.)
//   2   server error (port bind, IO)
//   124 idle timeout (no Done click within 10 min)

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, statSync, realpathSync, copyFileSync, unlinkSync } from "node:fs";
import { join, dirname, basename, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";

const HOST = "127.0.0.1";
const IDLE_TIMEOUT_MS = 10 * 60 * 1000;
const ARCHIVE_REL = ".forsvn/artifacts/.archive";
const TOKEN_BYTES = 16;                      // = 32 hex chars in the wire format
const MAX_ROOT_WALK_DEPTH = 12;              // upper bound when probing for .git/.forsvn

// The chrome assets (tokens.css, chrome.css, chrome.js) are bundled alongside
// the CLI — at the repo root in source, at the skill folder when the skill is
// packaged via sync-skill-support. A skill-emitted artifact like
// `<userProject>/brand/BRAND.html` references `./tokens.css`, which the
// browser resolves to a URL the user's project doesn't have on disk. When
// the project-rooted lookup misses, fall back to serving the bundled asset
// by basename so the form chrome loads without forcing every emitter to
// copy assets next to its artifact.
const CLI_INSTALL_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BUNDLED_CHROME_DIR = join(CLI_INSTALL_ROOT, "references", "_html");
const BUNDLED_CHROME_ASSETS = new Set(["tokens.css", "chrome.css", "chrome.js", "base.html"]);

const VALID_DECISIONS = ["approved", "denied", "suggested"] as const;
type Decision = typeof VALID_DECISIONS[number];

type Payload = {
  token: string;
  decision_state: Decision;
  comments?: string;
  variant?: string;
};

// --- Entry --------------------------------------------------------------

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const flagJson = args.includes("--json");
  const flagNoOpen = args.includes("--no-open");
  const positional = args.filter((a) => !a.startsWith("--"));

  if (positional.length !== 1) {
    err(`usage: bun scripts/forsvn-preview.ts <path-to-html> [--no-open] [--json]`);
    return 1;
  }
  const htmlPath = resolve(positional[0]);
  if (!htmlPath.endsWith(".html")) {
    err(`expected an .html file, got ${htmlPath}`);
    return 1;
  }
  const mdPath = htmlPath.replace(/\.html$/, ".md");
  if (!existsSync(htmlPath)) {
    err(`HTML preview not found: ${htmlPath}`);
    return 1;
  }
  if (!existsSync(mdPath)) {
    err(`sibling .md not found: ${mdPath}`);
    return 1;
  }

  const projectRoot = findProjectRoot(htmlPath);

  // Refuse if the target .md has uncommitted changes — we're about to rewrite
  // it, so the caller should commit or stash first to keep the diff legible.
  if (gitIsDirty(projectRoot, mdPath)) {
    err(`target file has uncommitted changes; commit or stash before previewing: ${relative(projectRoot, mdPath)}`);
    return 1;
  }

  const mdSource = readFileSync(mdPath, "utf8");
  const fm = parseFrontmatter(mdSource);
  if (!fm) {
    err(`could not read frontmatter from ${mdPath}`);
    return 1;
  }
  if (fm.decision_state !== "pending") {
    err(`decision_state is ${JSON.stringify(fm.decision_state ?? "<unset>")}, not "pending" — refusing to start.`);
    return 1;
  }

  const htmlSource = readFileSync(htmlPath, "utf8");
  const token = randomBytes(TOKEN_BYTES).toString("hex");

  const server = Bun.serve({
    hostname: HOST,
    port: 0,
    fetch: makeHandler({ htmlSource, htmlPath, mdPath, token, projectRoot }),
  });

  const port = (server as { port?: number }).port ?? 0;
  // Browser opens at the mirrored HTML URL so the HTML's relative <link>/<script>
  // hrefs resolve to real file paths under the project root.
  const htmlUrlPath = "/" + relative(projectRoot, htmlPath).split(sep).join("/");
  const url = `http://${HOST}:${port}${htmlUrlPath}`;
  log(`forsvn preview · serving ${relative(projectRoot, htmlPath)} at ${url}`);
  log(`csrf token = ${token.slice(0, 8)}…  (full token wired into page config)`);
  log(`security · bound to 127.0.0.1 only; local-trust model — any process on this host can read the token from GET ${htmlUrlPath} and POST a decision. Don't run on shared boxes.`);

  if (!flagNoOpen) openBrowser(url);

  // The shutdown handler set in makeHandler() resolves this promise once
  // POST /done lands a valid payload (or rejects on idle timeout).
  const result = await new Promise<{ ok: true; payload: Payload } | { ok: false; reason: "timeout" }>((resolve) => {
    state.resolve = resolve;
    state.idleTimer = setTimeout(() => {
      log(`idle timeout — shutting down after ${IDLE_TIMEOUT_MS / 1000}s with no decision`);
      resolve({ ok: false, reason: "timeout" });
    }, IDLE_TIMEOUT_MS);
  });

  // Graceful stop — let any in-flight response (including the deferred /done
  // resolve) drain before the socket closes.
  await server.stop();

  if (!result.ok) {
    if (flagJson) console.log(JSON.stringify({ ok: false, reason: result.reason }));
    return 124;
  }

  // Apply mutations after the server stops so failure leaves the world
  // unchanged. Order: rewrite MD → archive HTML → manifest-sync.
  const today = new Date().toISOString().slice(0, 10);
  const updated = applyDecision(mdSource, {
    decision_state: result.payload.decision_state,
    reviewed_at: today,
    reviewer: "operator",
  }, result.payload.comments);
  writeFileSync(mdPath, updated, "utf8");
  log(`md updated → decision_state: ${result.payload.decision_state}, reviewed_at: ${today}`);

  const archivedRel = archiveHtml(projectRoot, htmlPath);
  log(`html archived → ${archivedRel}`);

  runManifestSync(projectRoot);

  if (flagJson) {
    console.log(JSON.stringify({
      ok: true,
      decision_state: result.payload.decision_state,
      reviewed_at: today,
      md: relative(projectRoot, mdPath),
      archived: archivedRel,
      comments: result.payload.comments ?? null,
      variant: result.payload.variant ?? null,
    }));
  } else {
    log(`done · decision: ${result.payload.decision_state}`);
  }
  return 0;
}

// --- HTTP handler -------------------------------------------------------

type HandlerArgs = {
  htmlSource: string;
  htmlPath: string;
  mdPath: string;
  token: string;
  projectRoot: string;
};

const state: {
  resolve?: (v: { ok: true; payload: Payload } | { ok: false; reason: "timeout" }) => void;
  idleTimer?: ReturnType<typeof setTimeout>;
} = {};

function makeHandler(args: HandlerArgs): (req: Request) => Promise<Response> {
  const { htmlSource, htmlPath, mdPath, token, projectRoot } = args;
  // The HTML is served at the URL path that mirrors its location under the
  // project root — so an exemplar at references/_html/exemplars/foo.html is
  // served at /references/_html/exemplars/foo.html, and its `<link
  // href="../tokens.css">` resolves naturally to
  // /references/_html/tokens.css. Any other GET path is served from the
  // project root (with realpath guard) so the chrome assets the HTML loads
  // get found at the relative paths it actually declares.
  const htmlUrlPath = "/" + relative(projectRoot, htmlPath).split(sep).join("/");
  const canonicalProjectRoot = realpathSync(projectRoot);

  return async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const noStore = { "Cache-Control": "no-store" };

    // GET / → 302 to the HTML's mirrored URL. Cheap convenience for the
    // CLI banner + browser bookmarks; the real entry point is htmlUrlPath.
    if (req.method === "GET" && url.pathname === "/") {
      return new Response(null, { status: 302, headers: { ...noStore, Location: htmlUrlPath } });
    }

    if (req.method === "GET" && url.pathname === htmlUrlPath) {
      const injected = injectPreviewConfig(htmlSource, {
        token,
        port: url.port,
        endpoint: `${url.origin}/done`,
        mdPath: relative(projectRoot, mdPath),
      });
      return new Response(injected, { headers: { ...noStore, "Content-Type": "text/html; charset=utf-8" } });
    }

    // Any other GET serves a file under the project root. Required so the
    // HTML's `<link href="../tokens.css">` (which the browser resolves to
    // /references/_html/tokens.css) actually finds the file. Realpath guard
    // bounds reads to the project root — no escape via symlinks or `..`.
    if (req.method === "GET") {
      const rel = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
      if (rel.length === 0 || rel.includes("\0")) {
        return new Response("forbidden", { status: 403, headers: noStore });
      }
      const abs = resolve(projectRoot, rel);
      const insideProject = existsSync(abs) && !statSync(abs).isDirectory();
      if (insideProject) {
        const canonical = realpathSync(abs);
        if (canonical !== canonicalProjectRoot && !canonical.startsWith(canonicalProjectRoot + sep)) {
          return new Response("forbidden", { status: 403, headers: noStore });
        }
        const body = readFileSync(canonical);
        return new Response(body, { headers: { ...noStore, "Content-Type": guessMime(canonical) } });
      }
      // Project-rooted lookup missed. If the request is for a bundled chrome
      // asset by basename (tokens.css / chrome.css / chrome.js / base.html),
      // serve it from the CLI's install dir so skill-emitted previews like
      // `<userProject>/brand/BRAND.html` with `<link href="./tokens.css">`
      // resolve cleanly without forcing every emitter to co-locate assets.
      const base = basename(rel);
      if (BUNDLED_CHROME_ASSETS.has(base)) {
        const bundled = join(BUNDLED_CHROME_DIR, base);
        if (existsSync(bundled) && !statSync(bundled).isDirectory()) {
          const body = readFileSync(bundled);
          return new Response(body, { headers: { ...noStore, "Content-Type": guessMime(bundled) } });
        }
      }
      return new Response("not found", { status: 404, headers: noStore });
    }

    if (req.method === "POST" && url.pathname === "/done") {
      // One-shot: if a prior /done already won, return 409 instead of letting
      // duplicate clicks race the same promise.
      if (!state.resolve) {
        return jsonResp(409, { error: "decision already recorded" }, noStore);
      }

      let body: unknown;
      try { body = await req.json(); }
      catch { return jsonResp(400, { error: "invalid JSON body" }, noStore); }

      const raw = body as Record<string, unknown>;
      if (typeof raw.token !== "string" || !constantTimeEqual(raw.token, token)) {
        return jsonResp(403, { error: "bad token" }, noStore);
      }
      if (typeof raw.decision_state !== "string" || !(VALID_DECISIONS as readonly string[]).includes(raw.decision_state)) {
        return jsonResp(400, { error: `decision_state must be ${VALID_DECISIONS.join(" | ")}` }, noStore);
      }
      const parsed: Payload = {
        token,
        decision_state: raw.decision_state as Decision,
      };
      if (typeof raw.comments === "string" && raw.comments.trim().length > 0) {
        parsed.comments = raw.comments.trim();
      }
      if (typeof raw.variant === "string" && raw.variant.trim().length > 0) {
        parsed.variant = raw.variant.trim();
      }

      // Claim the slot now so any concurrent POST returns 409 above. Defer the
      // resolve so the browser sees the 200 before server.stop() fires.
      const resolveFn = state.resolve;
      state.resolve = undefined;
      queueMicrotask(() => {
        if (state.idleTimer) clearTimeout(state.idleTimer);
        resolveFn({ ok: true, payload: parsed });
      });
      return jsonResp(200, { ok: true }, noStore);
    }

    return new Response("not found", { status: 404, headers: noStore });
  };
}

// --- Helpers ------------------------------------------------------------

function injectPreviewConfig(html: string, config: { token: string; port: string | number; endpoint: string; mdPath: string }): string {
  const json = JSON.stringify(config);
  const tagRe = /<script type="application\/json" id="preview-config">[\s\S]*?<\/script>/;
  if (!tagRe.test(html)) {
    throw new Error("HTML preview is missing <script id=\"preview-config\"> placeholder — emitter is non-compliant");
  }
  return html.replace(tagRe, `<script type="application/json" id="preview-config">${escapeForScript(json)}</script>`);
}

// Escape the </script close-tag (HTML5 parser ignores everything else inside
// <script type="application/json">; U+2028/U+2029 are valid JSON and parse
// fine via JSON.parse in modern browsers — no defensive escape needed).
function escapeForScript(json: string): string {
  return json.replace(/<\/script/gi, "<\\/script");
}

function parseFrontmatter(source: string): Record<string, string> | null {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const out: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

function applyDecision(source: string, updates: Record<string, string>, comments: string | undefined): string {
  const match = source.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)(\r?\n|$)/);
  if (!match) {
    throw new Error("expected frontmatter at top of file");
  }
  const [, openFence, body, closeFence, afterFence] = match;
  const lines = body.split(/\r?\n/);

  const seen = new Set<string>();
  const updatedLines = lines.map((line) => {
    const km = line.match(/^([a-zA-Z_][\w-]*)\s*:/);
    if (!km) return line;
    const key = km[1];
    if (key in updates) {
      seen.add(key);
      return `${key}: ${updates[key]}`;
    }
    return line;
  });

  for (const key of Object.keys(updates)) {
    if (!seen.has(key)) updatedLines.push(`${key}: ${updates[key]}`);
  }

  let rest = source.slice(match[0].length);
  if (comments) {
    const block = renderCommentBlock(comments, updates.reviewed_at, updates.reviewer);
    rest = appendCommentBlock(rest, block);
  }
  return openFence + updatedLines.join("\n") + closeFence + afterFence + rest;
}

function renderCommentBlock(comments: string, reviewedAt: string, reviewer: string): string {
  const lines = comments.split(/\r?\n/).map((l) => l.trimEnd());
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  const indented = lines.map((l) => `> ${l}`).join("\n");
  return `\n\n## Reviewer notes\n_${reviewer} · ${reviewedAt}_\n\n${indented}\n`;
}

function appendCommentBlock(body: string, block: string): string {
  // If a "## Reviewer notes" already exists, append a separator + new block
  // beneath it; otherwise just append at the end.
  if (/^## Reviewer notes\b/m.test(body)) return body.replace(/\s*$/, "") + "\n" + block;
  return body.replace(/\s*$/, "") + block;
}

function archiveHtml(projectRoot: string, htmlPath: string): string {
  const archiveDir = join(projectRoot, ARCHIVE_REL);
  if (!existsSync(archiveDir)) mkdirSync(archiveDir, { recursive: true });

  // If a prior archive exists for this slug, append the current ISO timestamp
  // so we never silently overwrite a previous decision record.
  let dest = join(archiveDir, basename(htmlPath));
  if (existsSync(dest)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const name = basename(htmlPath).replace(/\.html$/, "");
    dest = join(archiveDir, `${name}.${stamp}.html`);
  }

  try {
    renameSync(htmlPath, dest);
  } catch (e: unknown) {
    // EXDEV — cross-filesystem rename (rare but happens when the archive dir
    // is on a different mount). Fall back to copy+unlink.
    if ((e as NodeJS.ErrnoException)?.code === "EXDEV") {
      copyFileSync(htmlPath, dest);
      unlinkSync(htmlPath);
    } else {
      throw e;
    }
  }
  return relative(projectRoot, dest);
}

function runManifestSync(projectRoot: string): void {
  const script = join(projectRoot, "scripts", "manifest-sync.ts");
  if (!existsSync(script)) {
    log(`(manifest-sync skipped — ${relative(projectRoot, script)} not found)`);
    return;
  }
  // Capture stdio so the sub-process output doesn't interleave with the
  // CLI's structured logs (which break --json consumers that pop() the last
  // stdout line).
  const result = spawnSync("bun", [script, projectRoot], { encoding: "utf8" });
  if (result.status !== 0) {
    log(`(manifest-sync exited ${result.status}; stderr: ${(result.stderr || "").slice(0, 200)})`);
  }
}

function findProjectRoot(startPath: string): string {
  let dir = dirname(resolve(startPath));
  for (let i = 0; i < MAX_ROOT_WALK_DEPTH; i++) {
    if (existsSync(join(dir, ".git")) || existsSync(join(dir, ".forsvn"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return dirname(resolve(startPath));
}

function gitIsDirty(projectRoot: string, filePath: string): boolean {
  const rel = relative(projectRoot, filePath);
  // Files outside any git checkout (or in a directory git refuses to operate on)
  // skip the dirty check — there's no working-tree contract to honor.
  const check = spawnSync("git", ["-C", projectRoot, "rev-parse", "--is-inside-work-tree"], { encoding: "utf8" });
  if (check.status !== 0) return false;
  // Files ignored by .gitignore (e.g. .forsvn/artifacts/ in some setups) also
  // skip — git won't report them as dirty regardless of disk state, so the
  // check would silently no-op. Better to be explicit and skip them.
  const ignored = spawnSync("git", ["-C", projectRoot, "check-ignore", "--quiet", rel], { encoding: "utf8" });
  if (ignored.status === 0) return false;
  const result = spawnSync("git", ["-C", projectRoot, "status", "--porcelain", "--", rel], { encoding: "utf8" });
  // If git itself errored on a tracked, non-ignored path, treat as dirty so
  // the caller fails closed rather than silently bypassing the safety check.
  if (result.status !== 0) return true;
  return result.stdout.trim().length > 0;
}

function openBrowser(url: string): void {
  const cmd =
    process.platform === "darwin" ? "open" :
    process.platform === "win32" ? "start" :
    "xdg-open";
  // spawn can throw synchronously on a malformed cmd path (rare with literal
  // strings); the async ENOENT case fires as an 'error' event we don't wait on.
  try {
    spawn(cmd, [url], { stdio: "ignore", detached: true }).unref();
  } catch {
    log(`(could not open browser automatically; visit ${url} manually)`);
  }
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function guessMime(path: string): string {
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (path.endsWith(".json")) return "application/json; charset=utf-8";
  if (path.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function jsonResp(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function log(msg: string): void { console.log(`[forsvn-preview] ${msg}`); }
function err(msg: string): void { console.error(`[forsvn-preview] ${msg}`); }

// --- Run ----------------------------------------------------------------

if (import.meta.main) {
  main().then((code) => { process.exit(code); }).catch((e) => {
    err(`unexpected: ${e instanceof Error ? e.stack ?? e.message : String(e)}`);
    process.exit(2);
  });
}
