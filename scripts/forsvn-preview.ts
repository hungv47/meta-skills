#!/usr/bin/env bun
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

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, statSync, realpathSync } from "node:fs";
import { join, dirname, basename, resolve, relative } from "node:path";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";

const HOST = "127.0.0.1";
const IDLE_TIMEOUT_MS = 10 * 60 * 1000;
const ARCHIVE_REL = ".forsvn/artifacts/.archive";
const VALID_DECISIONS = new Set(["approved", "denied", "suggested"]);

type Payload = {
  token: string;
  decision_state: "approved" | "denied" | "suggested";
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
  const mdPath = htmlPath.replace(/\.html$/, ".md");

  if (!htmlPath.endsWith(".html")) {
    err(`expected an .html file, got ${htmlPath}`);
    return 1;
  }
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
  const token = randomBytes(16).toString("hex");

  const server = Bun.serve({
    hostname: HOST,
    port: 0,
    fetch: makeHandler({ htmlSource, htmlPath, mdPath, token, projectRoot }),
  });

  const port = (server as { port?: number }).port ?? 0;
  const url = `http://${HOST}:${port}/`;
  log(`forsvn preview · serving ${relative(projectRoot, htmlPath)} at ${url}`);
  log(`csrf token = ${token.slice(0, 8)}…  (full token wired into page config)`);

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

  server.stop(true);

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
  const htmlDir = dirname(htmlPath);

  return async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const noStore = { "Cache-Control": "no-store" };

    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      const injected = injectPreviewConfig(htmlSource, {
        token,
        port: url.port,
        endpoint: `${url.origin}/done`,
        mdPath: relative(projectRoot, mdPath),
      });
      return new Response(injected, { headers: { ...noStore, "Content-Type": "text/html; charset=utf-8" } });
    }

    if (req.method === "GET" && url.pathname.startsWith("/assets/")) {
      // Serve sibling static files (chrome.css, chrome.js, tokens.css) relative
      // to the HTML's directory. Resolve and verify the result stays inside.
      const assetRel = url.pathname.replace(/^\/assets\//, "");
      const assetAbs = resolve(htmlDir, assetRel);
      if (!assetAbs.startsWith(realpathSync(htmlDir))) {
        return new Response("forbidden", { status: 403, headers: noStore });
      }
      if (!existsSync(assetAbs) || statSync(assetAbs).isDirectory()) {
        return new Response("not found", { status: 404, headers: noStore });
      }
      const body = readFileSync(assetAbs);
      return new Response(body, { headers: { ...noStore, "Content-Type": guessMime(assetAbs) } });
    }

    if (req.method === "POST" && url.pathname === "/done") {
      let body: unknown;
      try { body = await req.json(); }
      catch { return jsonResp(400, { error: "invalid JSON body" }, noStore); }

      const payload = body as Partial<Payload>;
      if (typeof payload.token !== "string" || !constantTimeEqual(payload.token, token)) {
        return jsonResp(403, { error: "bad token" }, noStore);
      }
      if (typeof payload.decision_state !== "string" || !VALID_DECISIONS.has(payload.decision_state)) {
        return jsonResp(400, { error: "decision_state must be approved | denied | suggested" }, noStore);
      }
      const ok: Payload = {
        token,
        decision_state: payload.decision_state as Payload["decision_state"],
      };
      if (typeof payload.comments === "string" && payload.comments.trim().length > 0) {
        ok.comments = payload.comments.trim();
      }
      if (typeof payload.variant === "string" && payload.variant.trim().length > 0) {
        ok.variant = payload.variant.trim();
      }

      // Defer the resolve until after the response goes out, so the browser
      // sees a 200 before the server stops.
      queueMicrotask(() => {
        if (state.idleTimer) clearTimeout(state.idleTimer);
        state.resolve?.({ ok: true, payload: ok });
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
  if (tagRe.test(html)) {
    return html.replace(tagRe, `<script type="application/json" id="preview-config">${escapeForScript(json)}</script>`);
  }
  // Fallback: insert before </body>.
  return html.replace(/<\/body>/i, `<script type="application/json" id="preview-config">${escapeForScript(json)}</script>\n</body>`);
}

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
  const dest = join(archiveDir, basename(htmlPath));
  renameSync(htmlPath, dest);
  return relative(projectRoot, dest);
}

function runManifestSync(projectRoot: string): void {
  const script = join(projectRoot, "scripts", "manifest-sync.ts");
  if (!existsSync(script)) {
    log(`(manifest-sync skipped — ${relative(projectRoot, script)} not found)`);
    return;
  }
  const result = spawnSync("bun", [script, projectRoot], { stdio: "inherit" });
  if (result.status !== 0) {
    log(`(manifest-sync exited ${result.status}; check logs)`);
  }
}

function findProjectRoot(startPath: string): string {
  let dir = dirname(resolve(startPath));
  for (let i = 0; i < 12; i++) {
    if (existsSync(join(dir, ".git")) || existsSync(join(dir, ".forsvn"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return dirname(resolve(startPath));
}

function gitIsDirty(projectRoot: string, filePath: string): boolean {
  const rel = relative(projectRoot, filePath);
  const result = spawnSync("git", ["-C", projectRoot, "status", "--porcelain", "--", rel], { encoding: "utf8" });
  if (result.status !== 0) return false;
  return result.stdout.trim().length > 0;
}

function openBrowser(url: string): void {
  const cmd =
    process.platform === "darwin" ? "open" :
    process.platform === "win32" ? "start" :
    "xdg-open";
  try {
    spawn(cmd, [url], { stdio: "ignore", detached: true }).unref();
  } catch (e) {
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
