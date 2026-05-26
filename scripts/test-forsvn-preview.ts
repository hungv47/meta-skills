#!/usr/bin/env bun
// test-forsvn-preview — end-to-end test for the forsvn-preview CLI.
//
// Covers (expanded per WS-V2 acceptance gate § 8 #1):
//   - happy path: 200 on good token, MD frontmatter rewritten, HTML archived
//   - refuse cases: missing .md, decision_state ≠ pending, dirty tree
//   - protocol: 403 bad token, 400 malformed payload, 409 duplicate /done
//   - path traversal: /assets/../escape attempt returns 403
//
// Each scenario gets its own temp project root so they don't interfere.
//
// Usage: bun scripts/test-forsvn-preview.ts   (exits 0 on pass, 1 on fail)

import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync, appendFileSync, unlinkSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { tmpdir } from "node:os";
import { spawn, type ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PREVIEW = join(__dirname, "forsvn-preview.ts");

const results: { name: string; ok: boolean; message?: string }[] = [];

await run("happy path: 200 + frontmatter + archive", happyPath);
await run("refuse: missing .md sibling", refuseMissingMd);
await run("refuse: decision_state ≠ pending", refuseWrongState);
await run("refuse: target file is dirty", refuseDirtyTree);
await run("protocol: 400 on malformed payload (missing decision_state)", malformedPayload);
await run("protocol: 409 on duplicate POST /done after success", duplicatePost);
await run("path traversal: ../escape outside projectRoot is rejected", traversalReject);
await run("relative paths: HTML's <link href=\"../tokens.css\"> resolves to a real file", relativePathServing);

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}${r.message ? ` — ${r.message}` : ""}`);
if (failed.length === 0) {
  console.log(`[test-forsvn-preview] PASS — ${results.length} scenarios`);
  process.exit(0);
}
console.error(`[test-forsvn-preview] FAIL — ${failed.length}/${results.length} scenarios failed`);
process.exit(1);

// =========================================================================
// scenarios
// =========================================================================

async function happyPath(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);

  assertEq(typeof cfg.token, "string", "token should be string");
  assertEq(cfg.token.length, 32, "token should be 32-char hex");
  assertMatches(cfg.endpoint, /^http:\/\/127\.0\.0\.1:\d+\/done$/, "endpoint should be localhost /done");

  // Bad token → 403
  const bad = await postDone(url, { token: "0".repeat(32), decision_state: "approved" });
  assertEq(bad.status, 403, "bad token should yield 403");

  // Good payload → 200 then CLI exits 0
  const good = await postDone(url, { token: cfg.token, decision_state: "approved", comments: "looks good\nship it" });
  assertEq(good.status, 200, "good payload should yield 200");

  const exit = await onExit(child, 8000);
  assertEq(exit.code, 0, `CLI should exit 0; stderr=${ctx.stderrBuf.text.slice(-200)}`);

  const summary = JSON.parse(ctx.stdoutBuf.text.trim().split(/\r?\n/).filter(Boolean).pop() ?? "{}");
  assertEq(summary.ok, true, "summary.ok");
  assertEq(summary.decision_state, "approved", "summary.decision_state");

  const updatedMd = readFileSync(ctx.mdPath, "utf8");
  assertMatches(updatedMd, /^decision_state:\s*approved$/m, "frontmatter decision_state");
  assertMatches(updatedMd, /^reviewed_at:\s*\d{4}-\d{2}-\d{2}$/m, "frontmatter reviewed_at");
  assertMatches(updatedMd, /^reviewer:\s*operator$/m, "frontmatter reviewer");
  assertMatches(updatedMd, /## Reviewer notes/, "Reviewer notes block");
  assertMatches(updatedMd, /looks good/, "comment body");

  const archived = join(ctx.root, ".forsvn", "artifacts", ".archive", `${ctx.slug}.html`);
  if (!existsSync(archived)) throw new Error(`archive not at ${archived}`);
  if (existsSync(ctx.htmlPath)) throw new Error(`original ${ctx.htmlPath} should be gone`);
  ctx.cleanup();
}

async function refuseMissingMd(): Promise<void> {
  const ctx = setupProject({ omitMd: true });
  const exit = await runCliOneShot(ctx, [ctx.htmlPath, "--no-open", "--json"], 5000);
  assertEq(exit.code, 1, `expected exit 1 for missing md; got ${exit.code}`);
  assertMatches(ctx.stderrBuf.text, /sibling \.md not found/, "stderr should mention missing md");
  ctx.cleanup();
}

async function refuseWrongState(): Promise<void> {
  const ctx = setupProject({ decisionState: "approved" });
  const exit = await runCliOneShot(ctx, [ctx.htmlPath, "--no-open", "--json"], 5000);
  assertEq(exit.code, 1, `expected exit 1 for non-pending state; got ${exit.code}`);
  assertMatches(ctx.stderrBuf.text, /not "pending"/, "stderr should explain non-pending refusal");
  ctx.cleanup();
}

async function refuseDirtyTree(): Promise<void> {
  const ctx = setupProject();
  // Dirty the seeded MD so git status --porcelain reports a modification.
  appendFileSync(ctx.mdPath, "\nextra line\n");
  const exit = await runCliOneShot(ctx, [ctx.htmlPath, "--no-open", "--json"], 5000);
  assertEq(exit.code, 1, `expected exit 1 for dirty tree; got ${exit.code}`);
  assertMatches(ctx.stderrBuf.text, /uncommitted changes/, "stderr should explain dirty refusal");
  ctx.cleanup();
}

async function malformedPayload(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);

  // Missing decision_state — should 400, server stays up.
  const r1 = await postDone(url, { token: cfg.token });
  assertEq(r1.status, 400, "missing decision_state should 400");

  // Invalid JSON body.
  const r2 = await fetch(`${url}done`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  });
  assertEq(r2.status, 400, "invalid JSON should 400");

  // Recover with a good payload so the CLI can exit cleanly.
  const r3 = await postDone(url, { token: cfg.token, decision_state: "denied" });
  assertEq(r3.status, 200, "good payload after malformed should still 200");
  const exit = await onExit(child, 8000);
  assertEq(exit.code, 0, `CLI should exit 0 after recovery; stderr=${ctx.stderrBuf.text.slice(-200)}`);
  ctx.cleanup();
}

async function duplicatePost(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);

  const r1 = await postDone(url, { token: cfg.token, decision_state: "suggested" });
  assertEq(r1.status, 200, "first /done should 200");

  // Second POST may race with shutdown — but if it lands, must be 409, never 200.
  let r2: Response | null = null;
  try { r2 = await postDone(url, { token: cfg.token, decision_state: "approved" }); }
  catch { /* server already stopped — acceptable */ }
  if (r2) {
    if (r2.status === 200) throw new Error(`second /done returned 200 — duplicate decision race not guarded`);
    if (r2.status !== 409) throw new Error(`second /done returned ${r2.status}; expected 409 or connection-refused`);
  }

  const exit = await onExit(child, 8000);
  assertEq(exit.code, 0, `CLI should exit 0; stderr=${ctx.stderrBuf.text.slice(-200)}`);
  ctx.cleanup();
}

async function traversalReject(): Promise<void> {
  const ctx = setupProject();
  // A file under projectRoot is fetchable at its mirrored URL path; a file
  // OUTSIDE projectRoot must not be reachable even via decoded `../` escapes.
  const insideRel = ".forsvn/artifacts/sibling.txt";
  writeFileSync(join(ctx.root, insideRel), "inside-project");
  const outside = join(dirname(ctx.root), `outside-${Date.now()}.txt`);
  writeFileSync(outside, "do not serve");

  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);

  try {
    // Inside the project at its real URL path — must be readable (sanity).
    const inside = await fetch(`${url}${insideRel}`);
    if (inside.status !== 200) throw new Error(`project-rooted file should be readable at /${insideRel}; got ${inside.status}`);

    // Escape via decoded `..` — must NOT serve the outside file.
    const escape = await fetch(`${url}..%2F${encodeURIComponent(basename(outside))}`);
    if (escape.status === 200) throw new Error(`/.. traversal returned 200 — path-traversal guard failed`);
    if (escape.status !== 403 && escape.status !== 404) throw new Error(`/.. traversal returned ${escape.status}; expected 403 or 404`);

    // Exit cleanly so the test runner can move on.
    await postDone(url, { token: cfg.token, decision_state: "approved" });
    const exit = await onExit(child, 8000);
    assertEq(exit.code, 0, `CLI should exit 0`);
  } finally {
    try { unlinkSync(outside); } catch {}
    ctx.cleanup();
  }
}

async function relativePathServing(): Promise<void> {
  // Mirrors the exemplar layout: HTML at <root>/references/_html/exemplars/foo.html
  // with `<link href="../tokens.css">`, where tokens.css lives at
  // <root>/references/_html/tokens.css. This exercises the relative-URL flow
  // browsers use — `..` from the HTML's URL must resolve to a real file under
  // the project root.
  const ctx = setupExemplarLayout();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);

  try {
    // The CLI's banner URL ends with the htmlUrlPath; we extract just the
    // origin for sibling fetches.
    const origin = url.replace(/\/$/, "");

    // Browser would resolve `../tokens.css` from /references/_html/exemplars/foo.html
    // to /references/_html/tokens.css — assert that's served.
    const tokens = await fetch(`${origin}/references/_html/tokens.css`);
    assertEq(tokens.status, 200, `tokens.css should be served at the documented relative path; got ${tokens.status}`);
    const body = await tokens.text();
    assertMatches(body, /relative-path-test/, "served tokens.css should contain test marker");

    // Done so the CLI can exit.
    const cfg = await fetchPreviewConfig(url);
    await postDone(url, { token: cfg.token, decision_state: "approved" });
    const exit = await onExit(child, 8000);
    assertEq(exit.code, 0, `CLI should exit 0; stderr=${ctx.stderrBuf.text.slice(-200)}`);
  } finally {
    ctx.cleanup();
  }
}

// =========================================================================
// helpers
// =========================================================================

type Ctx = {
  root: string;
  slug: string;
  mdPath: string;
  htmlPath: string;
  stdoutBuf: { text: string };
  stderrBuf: { text: string };
  cleanup: () => void;
};

function setupProject(opts: { omitMd?: boolean; decisionState?: string } = {}): Ctx {
  const root = mkdtempSync(join(tmpdir(), "forsvn-preview-test-"));
  const slug = "mkt-create-brand-2026-05-26-pure-void";
  const mdPath = join(root, ".forsvn", "artifacts", `${slug}.md`);
  const htmlPath = join(root, ".forsvn", "artifacts", `${slug}.html`);
  const state = opts.decisionState ?? "pending";
  const md = `---
skill: create-brand
version: 1
date: 2026-05-26
status: done
stack: mkt
lifecycle: canonical
summary: "Synthetic test artifact"
decision_state: ${state}
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
  <header class="topbar"><span class="decision-pill" data-state="${state}">${state}</span></header>
  <aside class="left-controls"></aside>
  <main class="stage">stage</main>
  <footer class="footer"><a href="roughdraft://open?path=x"></a></footer>
  <script type="application/json" id="preview-config">{"static":true}</script>
  <script type="application/json" id="artifact-data">{"decision_state":"${state}","skill":"create-brand","stack":"mkt"}</script>
</body>
</html>`;
  writeAt(htmlPath, html);
  if (!opts.omitMd) writeAt(mdPath, md);

  // Seed a tiny git repo so the project-root + dirty-tree checks have ground
  // truth. Without this, gitIsDirty refuses to start (per the v2 fixes).
  bunGit(root, ["init", "--quiet"]);
  bunGit(root, ["config", "user.email", "test@example.com"]);
  bunGit(root, ["config", "user.name", "test"]);
  bunGit(root, ["add", "."]);
  bunGit(root, ["commit", "--quiet", "-m", "seed"]);

  const ctx: Ctx = {
    root, slug, mdPath, htmlPath,
    stdoutBuf: { text: "" },
    stderrBuf: { text: "" },
    cleanup: () => { try { rmSync(root, { recursive: true, force: true }); } catch {} },
  };
  return ctx;
}

function setupExemplarLayout(): Ctx {
  const root = mkdtempSync(join(tmpdir(), "forsvn-preview-rel-"));
  const slug = "exemplar";
  // tokens.css one level above the HTML, mirrors references/_html/exemplars/foo.html
  // → references/_html/tokens.css.
  const tokensPath = join(root, "references", "_html", "tokens.css");
  const mdPath = join(root, "references", "_html", "exemplars", `${slug}.md`);
  const htmlPath = join(root, "references", "_html", "exemplars", `${slug}.html`);
  writeAt(tokensPath, "/* relative-path-test marker */\n:root { --x: 1; }\n");
  writeAt(mdPath, `---
skill: create-brand
version: 1
date: 2026-05-26
status: done
stack: mkt
lifecycle: canonical
summary: "Synthetic relative-path test"
decision_state: pending
review_surface: html
---

Body.
`);
  writeAt(htmlPath, `<!doctype html>
<html data-stack="water">
<head>
  <title>exemplar · create-brand · 2026-05-26</title>
  <link rel="stylesheet" href="../tokens.css">
</head>
<body>
  <header class="topbar"><span class="decision-pill" data-state="pending">pending</span></header>
  <aside class="left-controls"></aside>
  <main class="stage">stage</main>
  <footer class="footer"><a href="roughdraft://open?path=x"></a></footer>
  <script type="application/json" id="preview-config">{"static":true}</script>
  <script type="application/json" id="artifact-data">{"decision_state":"pending","skill":"create-brand","stack":"mkt"}</script>
</body>
</html>`);

  bunGit(root, ["init", "--quiet"]);
  bunGit(root, ["config", "user.email", "test@example.com"]);
  bunGit(root, ["config", "user.name", "test"]);
  bunGit(root, ["add", "."]);
  bunGit(root, ["commit", "--quiet", "-m", "seed"]);

  return {
    root, slug, mdPath, htmlPath,
    stdoutBuf: { text: "" },
    stderrBuf: { text: "" },
    cleanup: () => { try { rmSync(root, { recursive: true, force: true }); } catch {} },
  };
}

function startCli(ctx: Ctx, args: string[]): ChildProcess {
  const child = spawn("bun", [PREVIEW, ...args], {
    cwd: ctx.root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout!.on("data", (b) => { ctx.stdoutBuf.text += b.toString(); });
  child.stderr!.on("data", (b) => { ctx.stderrBuf.text += b.toString(); });
  return child;
}

async function runCliOneShot(ctx: Ctx, args: string[], timeoutMs: number): Promise<{ code: number | null }> {
  const child = startCli(ctx, args);
  return onExit(child, timeoutMs);
}

async function waitForUrl(ctx: Ctx): Promise<string> {
  const banner = await waitForMatch(ctx.stdoutBuf, /serving .* at (http:\/\/[\d.:]+\/)/, 10000);
  return banner.match[1];
}

async function fetchPreviewConfig(url: string): Promise<{ token: string; port: string; endpoint: string; mdPath: string }> {
  const html = await (await fetch(url)).text();
  const cfgMatch = html.match(/<script type="application\/json" id="preview-config">([\s\S]*?)<\/script>/);
  if (!cfgMatch) throw new Error("preview-config not injected into served HTML");
  return JSON.parse(cfgMatch[1]);
}

async function postDone(url: string, body: object): Promise<Response> {
  return fetch(`${url}done`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function writeAt(absPath: string, body: string): void {
  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, body);
}

function bunGit(cwd: string, args: string[]): void {
  const r = Bun.spawnSync({ cmd: ["git", "-C", cwd, ...args], stdout: "pipe", stderr: "pipe" });
  if (r.exitCode !== 0) throw new Error(`git ${args.join(" ")} exited ${r.exitCode}: ${new TextDecoder().decode(r.stderr)}`);
}

function assertEq<T>(actual: T, expected: T, name: string): void {
  if (actual !== expected) throw new Error(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function assertMatches(text: string, re: RegExp | string, name: string): void {
  const m = typeof re === "string" ? text.includes(re) : re.test(text);
  if (!m) throw new Error(`${name}: expected match for ${re}, got ${JSON.stringify(text.slice(0, 200))}`);
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

function onExit(child: ChildProcess, timeoutMs: number): Promise<{ code: number | null }> {
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

async function run(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (e) {
    results.push({ name, ok: false, message: e instanceof Error ? e.message : String(e) });
  }
}
