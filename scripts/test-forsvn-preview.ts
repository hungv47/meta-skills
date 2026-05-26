#!/usr/bin/env bun
// test-forsvn-preview — end-to-end test for the forsvn-preview CLI.
//
// Spawns a temp project root with a synthetic MD + HTML twin, runs
// scripts/forsvn-preview.ts against it with --no-open --json, scrapes the
// printed URL/token, posts a synthetic decision, asserts:
//   - MD frontmatter updated (decision_state, reviewed_at, reviewer)
//   - HTML moved to .forsvn/artifacts/.archive/
//   - CLI exits 0 with a JSON summary on stdout
//
// Usage: bun scripts/test-forsvn-preview.ts   (exits 0 on pass, 1 on fail)

import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PREVIEW = join(__dirname, "forsvn-preview.ts");
const REPO_ROOT = dirname(__dirname);

const root = mkdtempSync(join(tmpdir(), "forsvn-preview-test-"));
let pass = 0;
let fail = 0;

try {
  // Synthetic MD + HTML twin under a flat path.
  const slug = "mkt-create-brand-2026-05-26-pure-void";
  const mdPath = join(root, ".forsvn", "artifacts", `${slug}.md`);
  const htmlPath = join(root, ".forsvn", "artifacts", `${slug}.html`);
  const md = `---
skill: create-brand
version: 1
date: 2026-05-26
status: done
stack: mkt
lifecycle: canonical
summary: "Synthetic test artifact"
decision_state: pending
review_surface: html
review_tool: roughdraft
---

# FORSVN Brand (test)

Body text.
`;
  const html = `<!doctype html>
<html data-stack="water">
<head><title>preview · create-brand · 2026-05-26</title></head>
<body>
  <header class="topbar"><span class="decision-pill" data-state="pending">pending</span></header>
  <aside class="left-controls"></aside>
  <main class="stage">stage</main>
  <footer class="footer"><a href="roughdraft://open?path=x"></a></footer>
  <script type="application/json" id="preview-config">{"static":true}</script>
  <script type="application/json" id="artifact-data">{"decision_state":"pending","skill":"create-brand","stack":"mkt"}</script>
</body>
</html>`;
  writeAt(mdPath, md);
  writeAt(htmlPath, html);

  // The CLI checks for a .git or .forsvn marker to find the project root and
  // checks for uncommitted changes via `git status --porcelain`. Initialize a
  // tiny repo and commit the seed so the dirty-tree check passes.
  const git = (args: string[]) => spawnSyncJson("git", ["-C", root, ...args]);
  git(["init", "--quiet"]);
  git(["config", "user.email", "test@example.com"]);
  git(["config", "user.name", "test"]);
  git(["add", "."]);
  git(["commit", "--quiet", "-m", "seed"]);

  // Spawn the CLI with --no-open --json so it doesn't try to launch a browser
  // and prints a structured summary on success.
  const child = spawn("bun", [PREVIEW, htmlPath, "--no-open", "--json"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });

  // Buffer both streams from the start so we can scan history, not just future data.
  const stdoutBuf = { text: "" };
  const stderrBuf = { text: "" };
  child.stdout.on("data", (b) => { stdoutBuf.text += b.toString(); });
  child.stderr.on("data", (b) => { stderrBuf.text += b.toString(); });

  // Wait for the CLI to print the URL banner (`log()` writes to stdout).
  const banner = await waitForMatch(stdoutBuf, /serving .* at (http:\/\/[\d.:]+\/)/, 10000);
  const url = banner.match[1];
  const html2 = await (await fetch(url)).text();
  const cfgMatch = html2.match(/<script type="application\/json" id="preview-config">([\s\S]*?)<\/script>/);
  if (!cfgMatch) throw new Error("preview-config not injected into served HTML");
  const cfg = JSON.parse(cfgMatch[1]);
  assert(typeof cfg.token === "string" && cfg.token.length === 32, "preview-config.token should be 32-char hex");
  assert(cfg.endpoint && cfg.endpoint.endsWith("/done"), "preview-config.endpoint should target /done");

  // Bad token → 403.
  const bad = await fetch(`${url}done`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: "0".repeat(32), decision_state: "approved" }),
  });
  assert(bad.status === 403, `expected 403 on bad token, got ${bad.status}`);

  // Good token → 200, then CLI exits.
  const good = await fetch(`${url}done`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: cfg.token, decision_state: "approved", comments: "looks good\nship it" }),
  });
  assert(good.status === 200, `expected 200 on good payload, got ${good.status}`);

  const exit = await onExit(child, 8000);
  assert(exit.code === 0, `CLI should exit 0, got ${exit.code}; stderr=${stderrBuf.text}`);

  // Parse the structured JSON summary from stdout.
  const summary = JSON.parse(stdoutBuf.text.trim().split(/\r?\n/).filter(Boolean).pop() ?? "{}");
  assert(summary.ok === true, `summary.ok should be true, got ${JSON.stringify(summary)}`);
  assert(summary.decision_state === "approved", `summary.decision_state should be approved, got ${summary.decision_state}`);

  // MD frontmatter updated.
  const updatedMd = readFileSync(mdPath, "utf8");
  assert(/^decision_state:\s*approved$/m.test(updatedMd), "MD should have decision_state: approved");
  assert(/^reviewed_at:\s*\d{4}-\d{2}-\d{2}$/m.test(updatedMd), "MD should have reviewed_at: YYYY-MM-DD");
  assert(/^reviewer:\s*operator$/m.test(updatedMd), "MD should have reviewer: operator");
  assert(/## Reviewer notes/.test(updatedMd), "MD body should have a Reviewer notes block");
  assert(/looks good/.test(updatedMd), "MD body should contain the submitted comment");

  // HTML archived.
  const archived = join(root, ".forsvn", "artifacts", ".archive", `${slug}.html`);
  assert(existsSync(archived), `HTML should be archived to ${archived}`);
  assert(!existsSync(htmlPath), `original HTML at ${htmlPath} should be gone`);

  pass++;
  console.log(`[test-forsvn-preview] PASS — end-to-end decision flow (${pass} assertion group${pass === 1 ? "" : "s"})`);
} catch (e) {
  fail++;
  console.error(`[test-forsvn-preview] FAIL — ${e instanceof Error ? e.message : String(e)}`);
  if (e instanceof Error && e.stack) console.error(e.stack);
} finally {
  rmSync(root, { recursive: true, force: true });
}

process.exit(fail > 0 ? 1 : 0);

// --- helpers ------------------------------------------------------------

function writeAt(absPath: string, body: string): void {
  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, body);
}

function assert(cond: unknown, message: string): void {
  if (!cond) throw new Error(`assertion failed: ${message}`);
}

function waitForMatch(buf: { text: string }, re: RegExp, timeoutMs: number): Promise<{ match: RegExpMatchArray }> {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    const tick = (): void => {
      const m = buf.text.match(re);
      if (m) { resolve({ match: m }); return; }
      if (Date.now() - t0 > timeoutMs) {
        reject(new Error(`timed out waiting for ${re} after ${timeoutMs}ms; buffer=${JSON.stringify(buf.text.slice(-200))}`));
        return;
      }
      setTimeout(tick, 50);
    };
    tick();
  });
}

function onExit(child: import("node:child_process").ChildProcess, timeoutMs: number): Promise<{ code: number | null }> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      try { child.kill("SIGKILL"); } catch {}
      reject(new Error(`child did not exit within ${timeoutMs}ms`));
    }, timeoutMs);
    child.on("exit", (code) => {
      clearTimeout(timer);
      resolve({ code });
    });
  });
}

function spawnSyncJson(cmd: string, args: string[]): void {
  // Best-effort runner for tiny git seed steps; failures bubble up via the
  // main flow (e.g. git status returning non-clean fails the dirty check).
  const r = Bun.spawnSync({ cmd: [cmd, ...args], stdout: "pipe", stderr: "pipe" });
  if (r.exitCode !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} exited ${r.exitCode}: ${new TextDecoder().decode(r.stderr)}`);
  }
}
