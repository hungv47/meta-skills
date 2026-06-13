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
const PREVIEW = join(__dirname, "..", "bin", "forsvn-preview.ts");

const results: { name: string; ok: boolean; message?: string }[] = [];

await run("happy path: 200 + frontmatter + archive", happyPath);
await run("refuse: missing .md sibling", refuseMissingMd);
await run("refuse: decision_state ≠ pending", refuseWrongState);
await run("refuse: target file is dirty", refuseDirtyTree);
await run("protocol: 400 on malformed payload (missing decision_state)", malformedPayload);
await run("protocol: 409 on duplicate POST /done after success", duplicatePost);
await run("path traversal: ../escape outside projectRoot is rejected", traversalReject);
await run("relative paths: HTML's <link href=\"../tokens.css\"> resolves to a real file", relativePathServing);
await run("bundled assets: chrome assets load for a user-project preview with no co-located assets", bundledChromeAssetsFallback);
await run("list: --json buckets pending vs decided, excludes .archive + non-decision", listJsonBuckets);
await run("list: --state pending filters to the pending bucket only", listStateFilter);
await run("list: refuses with exit 1 when no .forsvn/artifacts under root", listNoArtifacts);
await run("list: prefers .forsvn over a closer .git ancestor (nested-repo drift)", listPrefersForsvnOverGit);
await run("list: human-readable output, invalid --state rejected, argValue flag-guard", listHumanAndArgGuards);
await run("tier: piped stdout and stderr carry zero ANSI escape bytes", pipedStreamsNoAnsi);
await run("headless: piped stdin is refused — no fabricated decision", headlessRefusesPipedStdin);
await run("form: served HTML carries the a11y contract; mirror gate aria-hidden; bar pinned", formA11yContract);
await run("protocol: /done rejects not_required and pending with 400", doneRejectsNonDecisions);
await run("conflict: /done refused when the artifact changed on disk since render", doneConflictRehash);
await run("G1: missing Review Gate warns on the banner and proceeds; gate_warning rides preview-config", g1GateWarnAndProceed);
await run("G1: a well-formed Review Gate serves silently (no warn, gate_warning null)", g1NoWarnWhenGatePresent);
await run("G2: deciding the seeded sample prints the one-time aha block (human mode only)", g2SeededSampleAha);
await run("G4: notify appends the inbox grammar line; duplicate push is an idempotent skip", g4NotifyAppendAndSkip);
await run("G4: a state change is a new event — notify appends again", g4NotifyStateChangeAppends);
await run("G5: --json decision object carries additive next_pending and stays the final stdout line", g5JsonNextPending);
await run("G5: human write-back offers the next pending artifact; empty queue says queue clear", g5HumanNextHint);
await run("md mode: --md renders a legible terminal preview, read-only, zero ANSI when piped", mdModePreview);
await run("md mode: --md refuses to combine with --json/--headless/--html", mdModeFlagGuard);
await run("U9 theme: boot script precedes the stylesheets; segment present; chrome.js persists the override", u9ThemeBootAndPersistence);
await run("U9 logo: brand glyphs served via bundled fallback; chrome references both theme variants", u9LogoAssets);
await run("U9 typeset: no raw markdown syntax or frontmatter YAML leaks into the rendered body; no artifact path in the visible chrome", u9NoRawLeak);
await run("U9 annotations: ride POST /done additively, persist into the review record, surface in --json", u9AnnotationsRoundTrip);
await run("U9 annotations: malformed array is a 400 — nothing written", u9AnnotationsRejected);
await run("U9 edit: POST /edit saves the body (frontmatter intact), moves the conflict basis, re-renders the twin", u9EditSave);
await run("U9 edit: stale on-disk hash is a 409 and bad token a 403 — nothing written", u9EditConflictAndToken);
await run("U9 suggestions: preview-config carries the additive seam (empty) + pending_count; card logic shipped", u9SuggestionSeam);
await run("U9 confirm: /done 200 body names the next pending artifact by title — never a path", u9DoneNextPending);

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
  assertMatches(ctx.stderrBuf.text, /Markdown artifact not found/, "stderr should mention missing md");
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

  // Second POST may race with the graceful shutdown that the first POST kicked
  // off. Three acceptable outcomes: 409 (server still up, slot already claimed),
  // connection refused (server has closed the listener), or hung connection
  // that we abort. The one outcome we forbid is 200 — that would mean two
  // valid decisions landed for one preview session.
  let r2: Response | null = null;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 1500);
  try {
    r2 = await fetch(`${url}done`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: cfg.token, decision_state: "approved" }),
      signal: ac.signal,
    });
  } catch { /* connection refused or aborted — acceptable */ }
  clearTimeout(t);
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

// --- list subcommand (PP-3 — report pending/decided state) ----------------

async function listJsonBuckets(): Promise<void> {
  const ctx = setupListProject();
  try {
    const r = await runList(ctx.root, ["--json"]);
    assertEq(r.code, 0, `list --json should exit 0; stderr=${r.stderr.slice(-200)}`);
    const j = JSON.parse(r.stdout.trim());
    assertEq(j.ok, true, "list ok");
    // a (pending) + b (approved) + c (denied) are decision-tracked; the
    // no-decision artifact and the .archive entry are excluded.
    assertEq(j.counts.total, 3, "total counts only decision-tracked, live artifacts");
    assertEq(j.counts.other, 0, "no unknown-state artifacts in this fixture");
    assertEq(j.counts.pending + j.counts.decided + j.counts.other, j.counts.total, "counts reconcile");
    assertEq(j.pending.length, 1, "one pending");
    assertEq(j.decided.length, 2, "two decided (approved + denied)");
    assertEq(j.pending[0].id, "a", "pending entry id");
    assertEq(j.pending[0].decision_state, "pending", "pending state");
    assertMatches(j.pending[0].path, /^\.forsvn\/artifacts\//, "path is project-relative posix");
    const decidedIds = j.decided.map((e: { id: string }) => e.id).sort();
    assertEq(decidedIds.join(","), "b,c", "decided ids");
    // .archive must never surface as live state.
    const allPaths = [...j.pending, ...j.decided].map((e: { path: string }) => e.path);
    if (allPaths.some((p: string) => p.includes("/.archive/"))) throw new Error("archived artifact leaked into list");
  } finally {
    ctx.cleanup();
  }
}

async function listStateFilter(): Promise<void> {
  const ctx = setupListProject();
  try {
    const r = await runList(ctx.root, ["--state", "pending", "--json"]);
    assertEq(r.code, 0, `list --state pending should exit 0; stderr=${r.stderr.slice(-200)}`);
    const j = JSON.parse(r.stdout.trim());
    assertEq(j.pending.length, 1, "pending bucket present");
    if ("decided" in j) throw new Error("--state pending should omit the decided bucket");
    assertEq(j.counts.decided, 2, "counts still report decided total");
  } finally {
    ctx.cleanup();
  }
}

async function listNoArtifacts(): Promise<void> {
  const root = mkdtempSync(join(tmpdir(), "forsvn-preview-empty-"));
  try {
    // Anchor the root here (no .forsvn/artifacts) and point --root at it so the
    // walk can't drift into a real project above tmpdir.
    const r = await runList(root, ["--root", root, "--json"]);
    assertEq(r.code, 1, `expected exit 1 when no artifacts dir; got ${r.code}`);
    assertMatches(r.stderr, /no \.forsvn\/artifacts/, "stderr explains missing artifacts dir");
  } finally {
    try { rmSync(root, { recursive: true, force: true }); } catch {}
  }
}

async function listHumanAndArgGuards(): Promise<void> {
  const ctx = setupListProject();
  try {
    // 1. Human-readable (no --json): exits 0 and prints the bucket labels.
    const human = await runList(ctx.root, []);
    assertEq(human.code, 0, `human-readable list should exit 0; stderr=${human.stderr.slice(-200)}`);
    assertMatches(human.stdout, /pending \(\d\)/, "human output shows the pending bucket header");
    assertMatches(human.stdout, /decided \(\d\)/, "human output shows the decided bucket header");

    // 2. Invalid --state is rejected with exit 1.
    const bad = await runList(ctx.root, ["--state", "bogus", "--json"]);
    assertEq(bad.code, 1, `--state bogus should exit 1; got ${bad.code}`);
    assertMatches(bad.stderr, /--state must be/, "stderr explains the valid --state values");

    // 3. argValue flag-guard: `--root --json` must NOT consume --json as the root
    // value — root falls back to cwd (the fixture), and --json is still honored,
    // so we get valid JSON rather than a path-resolution against "--json".
    const guarded = await runList(ctx.root, ["--root", "--json"]);
    assertEq(guarded.code, 0, `--root --json should fall back to cwd and exit 0; stderr=${guarded.stderr.slice(-200)}`);
    const j = JSON.parse(guarded.stdout.trim());
    assertEq(j.ok, true, "flag-guard: --json still recognized, JSON emitted");
    // Root fell back to cwd (the fixture) — proven by finding the fixture's 3
    // decision-tracked artifacts, not by string-comparing the symlink-resolved
    // path. If --json had been consumed as the root value, this would not be JSON.
    assertEq(j.counts.total, 3, "flag-guard: resolved to the fixture root, not '--json'");
  } finally {
    ctx.cleanup();
  }
}

async function listPrefersForsvnOverGit(): Promise<void> {
  // Layout: gp/.forsvn/artifacts/...  +  gp/parent/.git  +  gp/parent/child/
  // Running from child must walk PAST parent/.git to find gp/.forsvn — keying on
  // the closer .git would error (gp's artifacts never found). Read-only, but
  // wrong-silently is worse than erroring, so this pins the preference.
  const gp = mkdtempSync(join(tmpdir(), "forsvn-preview-nested-"));
  try {
    writeAt(join(gp, ".forsvn", "artifacts", "meta", "x.md"), `---\nid: x\nstack: meta\ndecision_state: pending\n---\n# x\n`);
    mkdirSync(join(gp, "parent", ".git"), { recursive: true });
    mkdirSync(join(gp, "parent", "child"), { recursive: true });
    // No --root: resolution must come from the cwd walk.
    const out = { text: "" };
    const errb = { text: "" };
    const child = spawn("bun", [PREVIEW, "list", "--json"], { cwd: join(gp, "parent", "child"), stdio: ["ignore", "pipe", "pipe"] });
    child.stdout!.on("data", (b) => { out.text += b.toString(); });
    child.stderr!.on("data", (b) => { errb.text += b.toString(); });
    const { code } = await onExit(child, 8000);
    assertEq(code, 0, `should resolve gp/.forsvn and exit 0; stderr=${errb.text.slice(-200)}`);
    const j = JSON.parse(out.text.trim());
    assertEq(j.pending.length, 1, "found the pending artifact under gp/.forsvn");
    assertEq(j.pending[0].id, "x", "the gp artifact, not a parent-repo one");
  } finally {
    try { rmSync(gp, { recursive: true, force: true }); } catch {}
  }
}

async function headlessRefusesPipedStdin(): Promise<void> {
  // --headless requires a real interactive stdin (the human-owned gate). A
  // piped/non-interactive stdin is refused pre-loop with a RefusalLine —
  // non-zero exit, no fabricated decision, no file mutation. Headless stays
  // OPT-IN: every other scenario in this suite spawns with piped stdio and
  // must keep hitting the plain serve path.
  const ctx = setupProject();
  const exit = await runCliOneShot(ctx, [ctx.htmlPath, "--no-open", "--headless", "--json"], 5000);
  assertEq(exit.code, 1, `expected exit 1 for piped-stdin headless; got ${exit.code}`);
  assertMatches(ctx.stderrBuf.text, /stdin is not interactive/, "refusal names the reason");
  assertMatches(ctx.stderrBuf.text, /exit 1/, "refusal carries the exit code");
  assertMatches(ctx.stderrBuf.text, /real TTY|browser form/, "refusal carries a recovery hint");
  const md = readFileSync(ctx.mdPath, "utf8");
  assertMatches(md, /^decision_state:\s*pending$/m, "decision_state untouched — nothing written");
  ctx.cleanup();
}

async function formA11yContract(): Promise<void> {
  // U5 (spec §7): the served twin must carry the accessibility floor in its
  // structure — radiogroup semantics, aria-disabled Done with the describedby
  // hint, role=status/alert outcome regions, focusable stage, and the in-body
  // Review Gate mirror aria-hidden. The pinned bar + activation guard are
  // pinned at the asset level (fixed positioning in chrome.css; the
  // localhost-/done guard in chrome.js).
  const ctx = setupProject();
  // Give the artifact a Review Gate section so the mirror-gate marking renders.
  const md = readFileSync(ctx.mdPath, "utf8") + `\n## Review Gate\n\n- [ ] Approve\n- [ ] Deny\n- [ ] Suggest changes\n\n## After\n\nTail.\n`;
  writeFileSync(ctx.mdPath, md);
  bunGit(ctx.root, ["add", "."]);
  bunGit(ctx.root, ["commit", "--quiet", "-m", "gate"]);

  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  try {
    const html = await (await fetch(url)).text();
    assertMatches(html, /<main class="stage" tabindex="0" aria-label="Artifact body">/, "stage is a labeled, focusable scroll region");
    assertMatches(html, /role="radiogroup"/, "radiogroup role");
    assertMatches(html, /aria-labelledby="decision-label"/, "radiogroup labelled by the DECISION label");
    assertMatches(html, /aria-required="true"/, "radiogroup required");
    assertMatches(html, /aria-disabled="true" aria-describedby="decision-done-hint"/, "Done starts aria-disabled with the why");
    assertMatches(html, /pick a decision first/, "describedby hint copy");
    assertMatches(html, /role="status"/, "confirmation region present");
    assertMatches(html, /role="alert"/, "alert region present");
    assertMatches(html, /<ul class="mirror-gate" aria-hidden="true">/, "Review Gate mirror is aria-hidden");

    const origin = url.match(/^(http:\/\/[\d.:]+)\//)![1];
    const htmlDir = url.slice(origin.length).replace(/\/[^/]*$/, "");
    const chromeCss = await (await fetch(`${origin}${htmlDir}/chrome.css`)).text();
    assertMatches(chromeCss, /\.decision-capture \{[^}]*position: fixed/, "DecisionBar is pinned (fixed positioning)");
    assertMatches(chromeCss, /min-height: 44px/, "44px hit-area floor present");
    const chromeJs = await (await fetch(`${origin}${htmlDir}/chrome.js`)).text();
    assertMatches(chromeJs, /decision-capture stays inert/, "activation guard survived the refit");
    assertMatches(chromeJs, /127\\\.0\\\.0\\\.1\|localhost/, "localhost-/done endpoint regex intact");
    if (/server rejected/.test(chromeJs)) throw new Error("forbidden vocabulary: chrome.js still says 'rejected'");

    const cfg = await fetchPreviewConfig(url);
    await postDone(url, { token: cfg.token, decision_state: "approved" });
    const exit = await onExit(child, 8000);
    assertEq(exit.code, 0, `CLI should exit 0; stderr=${ctx.stderrBuf.text.slice(-200)}`);
  } finally {
    ctx.cleanup();
  }
}

async function doneRejectsNonDecisions(): Promise<void> {
  // The POST-accepted set is exactly approved/denied/suggested. The schema
  // enum's other two values are never recordable decisions: `not_required`
  // never enters the queue, and `pending` is the state being left.
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  try {
    for (const bad of ["not_required", "pending", "rejected"]) {
      const r = await postDone(url, { token: cfg.token, decision_state: bad });
      assertEq(r.status, 400, `decision_state=${bad} should 400`);
    }
    const good = await postDone(url, { token: cfg.token, decision_state: "approved" });
    assertEq(good.status, 200, "valid decision still lands after rejections");
    const exit = await onExit(child, 8000);
    assertEq(exit.code, 0, `CLI should exit 0; stderr=${ctx.stderrBuf.text.slice(-200)}`);
  } finally {
    ctx.cleanup();
  }
}

async function doneConflictRehash(): Promise<void> {
  // Flow-recommended /done re-hash guard: the decision applies to the bytes
  // the human read. Mutate the .md after render → a valid POST is refused
  // with the conflict copy, nothing is written, decision_state stays pending.
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  try {
    appendFileSync(ctx.mdPath, "\nAn out-of-band edit after render.\n");
    const r = await postDone(url, { token: cfg.token, decision_state: "approved" });
    assertEq(r.status, 409, `conflict POST should 409; got ${r.status}`);
    const body = await r.json() as { error?: string };
    assertMatches(body.error ?? "", /changed on disk/, "conflict reason names the cause");
    assertMatches(body.error ?? "", /nothing was written/, "conflict reason carries recovery");
    const md = readFileSync(ctx.mdPath, "utf8");
    assertMatches(md, /^decision_state:\s*pending$/m, "frontmatter untouched");
    if (/## Reviewer notes/.test(md)) throw new Error("conflict must not append reviewer notes");
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    await new Promise((r) => setTimeout(r, 200));
    ctx.cleanup();
  }
}

async function pipedStreamsNoAnsi(): Promise<void> {
  // The §4.3 tier gate resolves per destination stream: every spawn here uses
  // piped stdio, so BOTH streams must be tier 3 — zero \x1b bytes, ever.
  const ctx = setupListProject();
  try {
    // stdout: human list (rows + headings) through the mono renderer.
    const human = await runList(ctx.root, []);
    assertEq(human.code, 0, `human list should exit 0; stderr=${human.stderr.slice(-200)}`);
    if (/\x1b/.test(human.stdout)) throw new Error(`piped stdout contains ANSI escapes: ${JSON.stringify(human.stdout.slice(0, 120))}`);
    const all = await runList(ctx.root, ["--state", "all"]);
    if (/\x1b/.test(all.stdout)) throw new Error("piped stdout (--state all) contains ANSI escapes");
  } finally {
    ctx.cleanup();
  }
  // stderr: a RefusalLine (missing artifacts dir) on a redirected stream.
  const empty = mkdtempSync(join(tmpdir(), "forsvn-preview-ansi-"));
  try {
    const r = await runList(empty, ["--root", empty]);
    assertEq(r.code, 1, `refusal should exit 1; got ${r.code}`);
    if (/\x1b/.test(r.stderr)) throw new Error(`piped stderr contains ANSI escapes: ${JSON.stringify(r.stderr.slice(0, 120))}`);
    assertMatches(r.stderr, /no \.forsvn\/artifacts/, "refusal reason present");
    assertMatches(r.stderr, /exit 1/, "refusal carries its exit code");
    assertMatches(r.stderr, /--root/, "refusal carries a recovery hint");
  } finally {
    try { rmSync(empty, { recursive: true, force: true }); } catch {}
  }
}

// --- U10 G-gap scenarios (flow: map-user-flow-2026-06-11-review-round-trip) ---

async function g1GateWarnAndProceed(): Promise<void> {
  // Variant 1 (missing heading): the stock fixture has no `## Review Gate` —
  // serve must warn on the banner (warn-and-proceed, never refuse, never
  // silent) and carry the same fact into preview-config as `gate_warning`.
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx); // proves it proceeded to serve
  try {
    assertMatches(ctx.stdoutBuf.text, /warning: no "## Review Gate" block found/, "tier-3 warn line on the piped banner");
    assertMatches(ctx.stdoutBuf.text, /pinned decision bar still captures/, "warn carries the capability reassurance");
    assertMatches(ctx.stdoutBuf.text, /artifact-contract-template\.md/, "warn carries the recovery pointer");
    if (/\x1b/.test(ctx.stdoutBuf.text)) throw new Error("piped warn carries ANSI escapes");
    const cfg = await fetchPreviewConfig(url) as { token: string; gate_warning?: string | null };
    assertMatches(cfg.gate_warning ?? "", /no "## Review Gate" block/, "gate_warning rides preview-config (NoticeStrip data seam)");
    await postDone(url, { token: cfg.token, decision_state: "approved" });
    const exit = await onExit(child, 8000);
    assertEq(exit.code, 0, "decision still lands despite the warn");
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    ctx.cleanup();
  }

  // Variant 2 (malformed): heading present but zero checkbox lines → the
  // malformed-block warn fires instead.
  const ctx2 = setupProject();
  const md = readFileSync(ctx2.mdPath, "utf8") + `\n## Review Gate\n\nprose only, no checkboxes\n`;
  writeFileSync(ctx2.mdPath, md);
  bunGit(ctx2.root, ["add", "."]);
  bunGit(ctx2.root, ["commit", "--quiet", "-m", "malformed gate"]);
  const child2 = startCli(ctx2, [ctx2.htmlPath, "--no-open", "--json"]);
  const url2 = await waitForUrl(ctx2);
  try {
    assertMatches(ctx2.stdoutBuf.text, /has no checkbox lines/, "malformed-gate warn variant");
    const cfg2 = await fetchPreviewConfig(url2);
    await postDone(url2, { token: cfg2.token, decision_state: "approved" });
    await onExit(child2, 8000);
  } finally {
    try { child2.kill("SIGKILL"); } catch {}
    ctx2.cleanup();
  }
}

async function g1NoWarnWhenGatePresent(): Promise<void> {
  const ctx = setupProject();
  const md = readFileSync(ctx.mdPath, "utf8") + `\n## Review Gate\n\n- [ ] Approve\n- [ ] Deny\n- [ ] Suggest changes\n`;
  writeFileSync(ctx.mdPath, md);
  bunGit(ctx.root, ["add", "."]);
  bunGit(ctx.root, ["commit", "--quiet", "-m", "gate"]);
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  try {
    if (/warning:/.test(ctx.stdoutBuf.text)) throw new Error(`well-formed gate must not warn: ${ctx.stdoutBuf.text.slice(0, 200)}`);
    const cfg = await fetchPreviewConfig(url) as { token: string; gate_warning?: string | null };
    assertEq(cfg.gate_warning, null, "gate_warning null when the gate renders fine");
    await postDone(url, { token: cfg.token, decision_state: "approved" });
    const exit = await onExit(child, 8000);
    assertEq(exit.code, 0, "clean serve exits 0");
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    ctx.cleanup();
  }
}

async function g2SeededSampleAha(): Promise<void> {
  // Human mode, seeded-sample id → the one-time three-line aha block lands
  // between the ResultLine and the next hint, ending in the /forsvn call to
  // action. Keyed on the sample's frontmatter id — no counter, no state file.
  const ctx = setupProject();
  stampSeededSampleId(ctx);
  const child = startCli(ctx, [ctx.htmlPath, "--no-open"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  await postDone(url, { token: cfg.token, decision_state: "approved" });
  const exit = await onExit(child, 8000);
  try {
    assertEq(exit.code, 0, "decision recorded");
    assertMatches(ctx.stdoutBuf.text, /that was the whole loop/, "aha line 1");
    assertMatches(ctx.stdoutBuf.text, /rode back into the file the agent reads next/, "aha line 2");
    assertMatches(ctx.stdoutBuf.text, /run \/forsvn in any repo/, "aha ends on the single next action");
    const ahaIdx = ctx.stdoutBuf.text.indexOf("that was the whole loop");
    const resultIdx = ctx.stdoutBuf.text.indexOf("approved · written to frontmatter");
    if (resultIdx === -1 || ahaIdx < resultIdx) throw new Error("aha must follow the ResultLine");
  } finally {
    ctx.cleanup();
  }

  // --json mode: the aha never prints — the decision object stays the final line.
  const ctx2 = setupProject();
  stampSeededSampleId(ctx2);
  const child2 = startCli(ctx2, [ctx2.htmlPath, "--no-open", "--json"]);
  const url2 = await waitForUrl(ctx2);
  const cfg2 = await fetchPreviewConfig(url2);
  await postDone(url2, { token: cfg2.token, decision_state: "approved" });
  await onExit(child2, 8000);
  try {
    if (/whole loop/.test(ctx2.stdoutBuf.text)) throw new Error("aha leaked into --json mode");
    const last = ctx2.stdoutBuf.text.trim().split(/\r?\n/).pop() ?? "";
    const j = JSON.parse(last);
    assertEq(j.ok, true, "final stdout line is still the decision JSON");
  } finally {
    ctx2.cleanup();
  }
}

function stampSeededSampleId(ctx: Ctx): void {
  const md = readFileSync(ctx.mdPath, "utf8").replace(/^skill: create-brand$/m, "skill: create-brand\nid: forsvn-sample");
  writeFileSync(ctx.mdPath, md);
  bunGit(ctx.root, ["add", "."]);
  bunGit(ctx.root, ["commit", "--quiet", "-m", "seed sample id"]);
}

async function g4NotifyAppendAndSkip(): Promise<void> {
  const ctx = setupProject();
  try {
    // First push: one ResultLine out, one inbox line in.
    const r1 = await runPreview(ctx.root, ["notify", ctx.mdPath]);
    assertEq(r1.code, 0, `notify should exit 0; stderr=${r1.stderr.slice(-200)}`);
    assertMatches(r1.stdout, /\* pending recorded in \.forsvn\/inbox/, "stdout ResultLine");
    const inboxPath = join(ctx.root, ".forsvn", "inbox");
    if (!existsSync(inboxPath)) throw new Error("inbox not created");
    const lines1 = readFileSync(inboxPath, "utf8").trim().split("\n");
    assertEq(lines1.length, 1, "exactly one event line");
    // Grammar: ISO-8601Z · ascii glyph · state word · path · skill · "excerpt".
    assertMatches(lines1[0], /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z \* pending {2}\S+\.md\s+create-brand · "Synthetic test artifact"$/, "inbox line grammar");
    if (/\x1b/.test(lines1[0])) throw new Error("inbox line carries ANSI escapes");
    if (/[^\x20-\x7e]/.test(lines1[0].replace(/[·]/g, ""))) throw new Error(`non-ASCII structural bytes in inbox line: ${JSON.stringify(lines1[0])}`);
    // Path is artifact-home-relative (the `.forsvn/artifacts/` prefix stripped).
    assertMatches(lines1[0], new RegExp(` ${ctx.slug}\\.md`), "path relative to the artifact home");

    // Duplicate push, same state → idempotent skip; the journal is unchanged.
    const r2 = await runPreview(ctx.root, ["notify", ctx.mdPath]);
    assertEq(r2.code, 0, "idempotent skip still exits 0");
    assertMatches(r2.stdout, /already recorded/, "stdout names the skip");
    const lines2 = readFileSync(inboxPath, "utf8").trim().split("\n");
    assertEq(lines2.length, 1, "no duplicate appended");
  } finally {
    ctx.cleanup();
  }
}

async function g4NotifyStateChangeAppends(): Promise<void> {
  const ctx = setupProject();
  try {
    await runPreview(ctx.root, ["notify", ctx.mdPath]);
    // The artifact gets decided, then re-pushed: a NEW event, appends.
    setDecisionState(ctx, "approved");
    const r2 = await runPreview(ctx.root, ["notify", ctx.mdPath]);
    assertEq(r2.code, 0, "state-change notify exits 0");
    assertMatches(r2.stdout, /\[ok\] approved recorded/, "approved rides the [ok] ascii glyph");
    const inboxPath = join(ctx.root, ".forsvn", "inbox");
    let lines = readFileSync(inboxPath, "utf8").trim().split("\n");
    assertEq(lines.length, 2, "state change appended");
    assertMatches(lines[1], /\[ok\] approved/, "latest event records the new state");
    // A re-push that RESET the decision back to pending is again a new event.
    setDecisionState(ctx, "pending");
    await runPreview(ctx.root, ["notify", ctx.mdPath]);
    lines = readFileSync(inboxPath, "utf8").trim().split("\n");
    assertEq(lines.length, 3, "reset-to-pending appended (journal, not state)");
    assertMatches(lines[2], /\* pending/, "reset event recorded");
  } finally {
    ctx.cleanup();
  }
}

function setDecisionState(ctx: Ctx, state: string): void {
  const md = readFileSync(ctx.mdPath, "utf8").replace(/^decision_state: .*$/m, `decision_state: ${state}`);
  writeFileSync(ctx.mdPath, md);
}

async function g5JsonNextPending(): Promise<void> {
  const ctx = setupProject();
  seedSecondPending(ctx);
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  await postDone(url, { token: cfg.token, decision_state: "approved" });
  const exit = await onExit(child, 8000);
  try {
    assertEq(exit.code, 0, "decision recorded");
    // The last-stdout-line contract survives: the FINAL line is the decision
    // object, and the G5 fact rides INSIDE it — no trailing human hint.
    const last = ctx.stdoutBuf.text.trim().split(/\r?\n/).pop() ?? "";
    const j = JSON.parse(last);
    assertEq(j.ok, true, "final line parses as the decision object");
    assertEq(j.decision_state, "approved", "decision intact");
    if (!j.next_pending) throw new Error("next_pending missing from the decision object");
    assertEq(j.next_pending.path, ".forsvn/artifacts/marketing/write-copy-2026-05-25-next-one.md", "next_pending names the remaining pending artifact");
    assertEq(j.next_pending.skill, "write-copy", "next_pending.skill");
    assertEq(j.next_pending.stack, "marketing", "next_pending.stack");
    if (/next pending:/.test(ctx.stdoutBuf.text)) throw new Error("human-mode hint leaked into --json mode");
  } finally {
    ctx.cleanup();
  }
}

async function g5HumanNextHint(): Promise<void> {
  // (a) another artifact still pending → the named, read-only next hint.
  const ctx = setupProject();
  seedSecondPending(ctx);
  const child = startCli(ctx, [ctx.htmlPath, "--no-open"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  await postDone(url, { token: cfg.token, decision_state: "suggested" });
  const exit = await onExit(child, 8000);
  try {
    assertEq(exit.code, 0, "decision recorded");
    assertMatches(ctx.stdoutBuf.text, /next pending: \* \.forsvn\/artifacts\/marketing\/write-copy-2026-05-25-next-one\.md/, "next-pending line names the artifact");
    assertMatches(ctx.stdoutBuf.text, /review it: \/forsvn:review/, "re-invoke hint present");
    if (/whole loop/.test(ctx.stdoutBuf.text)) throw new Error("aha fired on a non-sample artifact");
  } finally {
    ctx.cleanup();
  }

  // (b) queue empty after the decision → explicit queue clear, never silence.
  const ctx2 = setupProject();
  const child2 = startCli(ctx2, [ctx2.htmlPath, "--no-open"]);
  const url2 = await waitForUrl(ctx2);
  const cfg2 = await fetchPreviewConfig(url2);
  await postDone(url2, { token: cfg2.token, decision_state: "approved" });
  const exit2 = await onExit(child2, 8000);
  try {
    assertEq(exit2.code, 0, "decision recorded");
    assertMatches(ctx2.stdoutBuf.text, /pending \(0\) — queue clear/, "explicit queue-clear line");
  } finally {
    ctx2.cleanup();
  }
}

function seedSecondPending(ctx: Ctx): void {
  writeAt(join(ctx.root, ".forsvn", "artifacts", "marketing", "write-copy-2026-05-25-next-one.md"), `---
skill: write-copy
version: 1
date: 2026-05-25
status: done
stack: marketing
id: next-one
type: copy
decision_state: pending
review_surface: html
summary: "The next artifact in the queue"
---

# Next One
`);
  bunGit(ctx.root, ["add", "."]);
  bunGit(ctx.root, ["commit", "--quiet", "-m", "second pending"]);
}

async function mdModePreview(): Promise<void> {
  const ctx = setupProject();
  try {
    const r = await runPreview(ctx.root, [ctx.mdPath, "--md"]);
    assertEq(r.code, 0, `--md should exit 0; stderr=${r.stderr.slice(-200)}`);
    if (/\x1b/.test(r.stdout)) throw new Error("piped --md output carries ANSI escapes");
    assertMatches(r.stdout, /fields folded/, "frontmatter folded into the compact header");
    if (/^decision_state: pending$/m.test(r.stdout)) throw new Error("raw YAML leaked into the terminal preview");
    assertMatches(r.stdout, /FORSVN Brand \(test\)/, "body heading rendered");
    assertMatches(r.stdout, /read-only preview/, "read-only chooser hint at the tail");
    // Read-only: nothing was served, nothing was written.
    const md = readFileSync(ctx.mdPath, "utf8");
    assertMatches(md, /^decision_state:\s*pending$/m, "artifact untouched");
  } finally {
    ctx.cleanup();
  }
}

async function mdModeFlagGuard(): Promise<void> {
  const ctx = setupProject();
  try {
    for (const extra of ["--json", "--headless", "--html"]) {
      const r = await runPreview(ctx.root, [ctx.mdPath, "--md", extra]);
      assertEq(r.code, 1, `--md ${extra} should exit 1; got ${r.code}`);
      assertMatches(r.stderr, /usage: forsvn-preview/, "usage block on the guard");
      assertMatches(r.stderr, /--md is a read-only view/, "guard names the why");
    }
  } finally {
    ctx.cleanup();
  }
}

// --- U9 review-webapp scenarios (design pass revision 2, 2026-06-12) --------

async function u9ThemeBootAndPersistence(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  try {
    const html = await (await fetch(url)).text();
    // No flash-of-wrong-theme: the inline boot script reads the stored choice
    // BEFORE any stylesheet link.
    const bootIdx = html.indexOf("forsvn-theme");
    const cssIdx = html.indexOf('rel="stylesheet"');
    if (bootIdx === -1) throw new Error("theme boot script missing from served HTML");
    if (cssIdx === -1) throw new Error("stylesheets missing");
    if (bootIdx > cssIdx) throw new Error("theme boot script must precede the stylesheets (flash-of-wrong-theme)");
    // The strip's quiet auto/dark/light segment.
    assertMatches(html, /class="theme-seg" role="group" aria-label="Theme"/, "theme segment present");
    assertMatches(html, /data-set="system"/, "auto option");
    assertMatches(html, /data-set="dark"/, "dark option");
    assertMatches(html, /data-set="light"/, "light option");

    const origin = url.match(/^(http:\/\/[\d.:]+)\//)![1];
    const htmlDir = url.slice(origin.length).replace(/\/[^/]*$/, "");
    const chromeJs = await (await fetch(`${origin}${htmlDir}/chrome.js`)).text();
    assertMatches(chromeJs, /localStorage\.setItem\(THEME_KEY, mode\)/, "explicit choice persists");
    assertMatches(chromeJs, /localStorage\.removeItem\(THEME_KEY\)/, "system choice clears the override");
    const tokensCss = await (await fetch(`${origin}${htmlDir}/tokens.css`)).text();
    assertMatches(tokensCss, /prefers-color-scheme: light/, "system preference drives the default theme");
    assertMatches(tokensCss, /\[data-theme="light"\]/, "explicit light override tokens present");
    if (/B7FF6E/i.test(tokensCss)) throw new Error("retired Signal Lime leaked into tokens.css");

    const cfg = await fetchPreviewConfig(url);
    await postDone(url, { token: cfg.token, decision_state: "approved" });
    await onExit(child, 8000);
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    ctx.cleanup();
  }
}

async function u9LogoAssets(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  try {
    const html = await (await fetch(url)).text();
    assertMatches(html, /logo-glyph-cream\.svg/, "cream glyph referenced (dark surfaces)");
    assertMatches(html, /logo-glyph-forest\.svg/, "forest glyph referenced (light surfaces)");
    if (/class="field">F</.test(html)) throw new Error("placeholder F tile survived — the real glyph must replace it");

    const origin = url.match(/^(http:\/\/[\d.:]+)\//)![1];
    const htmlDir = url.slice(origin.length).replace(/\/[^/]*$/, "");
    // Served via the bundled-asset fallback (no co-located copy in the fixture).
    const cream = await fetch(`${origin}${htmlDir}/logo-glyph-cream.svg`);
    assertEq(cream.status, 200, `cream glyph should serve; got ${cream.status}`);
    assertEq(cream.headers.get("content-type"), "image/svg+xml", "svg mime");
    assertMatches(await cream.text(), /FDFACC/i, "cream glyph carries the cream fill");
    const forest = await fetch(`${origin}${htmlDir}/logo-glyph-forest.svg`);
    assertEq(forest.status, 200, `forest glyph should serve; got ${forest.status}`);
    assertMatches(await forest.text(), /004700/i, "forest glyph carries the Deep Forest fill");

    const cfg = await fetchPreviewConfig(url);
    await postDone(url, { token: cfg.token, decision_state: "approved" });
    await onExit(child, 8000);
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    ctx.cleanup();
  }
}

async function u9NoRawLeak(): Promise<void> {
  const ctx = setupProject();
  // Give the artifact markdown-heavy content: headings, bold, a table, a gate.
  const md = readFileSync(ctx.mdPath, "utf8") +
    `\n## Findings\n\nSome **bold** and *italic* text with \`code\`.\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n## Review Gate\n\n- [ ] Check one\n`;
  writeFileSync(ctx.mdPath, md);
  bunGit(ctx.root, ["add", "."]);
  bunGit(ctx.root, ["commit", "--quiet", "-m", "md-rich body"]);

  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  try {
    const html = await (await fetch(url)).text();
    // Rendered body must carry no literal markdown syntax…
    if (/^##\s/m.test(html)) throw new Error("literal '## ' heading syntax leaked into the served body");
    if (/\*\*bold\*\*/.test(html)) throw new Error("literal '**' bold syntax leaked");
    assertMatches(html, /<h2>Findings<\/h2>/, "headings are headings");
    assertMatches(html, /<strong>bold<\/strong>/, "bold renders as <strong>");
    assertMatches(html, /<th>a<\/th>/, "table renders as a table");
    // …and no raw frontmatter YAML: the YAML line shape never appears outside
    // the JSON blobs (JSON encodes it as "decision_state":"pending").
    if (/^decision_state:\s/m.test(html)) throw new Error("raw frontmatter YAML leaked into the page");
    // Frontmatter becomes the eyebrow identity line: stack · skill · date.
    assertMatches(html, /class="eyebrow">marketing · create-brand · 2026-05-26/, "eyebrow identity line (legacy mkt normalizes to marketing)");
    // The gate renders as the sealed checklist, read-only.
    assertMatches(html, /<section class="gate" id="gate-echo">/, "gate echo section");
    assertMatches(html, /read-only echo — decide below/, "gate read-only label");
    // No artifact path in the visible chrome: the file's relative path may
    // appear ONLY inside the preview-config JSON (the edit-source seam).
    const visible = html
      .replace(/<script type="application\/json" id="preview-config">[\s\S]*?<\/script>/, "")
      .replace(/<script type="application\/json" id="artifact-data">[\s\S]*?<\/script>/, "");
    if (visible.includes(ctx.slug + ".md") || visible.includes(".forsvn/artifacts/")) {
      throw new Error("artifact path leaked into the visible chrome");
    }

    const cfg = await fetchPreviewConfig(url);
    await postDone(url, { token: cfg.token, decision_state: "approved" });
    await onExit(child, 8000);
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    ctx.cleanup();
  }
}

async function u9AnnotationsRoundTrip(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  const annotations = [
    { kind: "marker", quote: "Body text." },
    { kind: "comment", quote: "FORSVN Brand", body: "tighten this headline — name the wedge" },
  ];
  const r = await postDone(url, { token: cfg.token, decision_state: "suggested", comments: "see annotations", annotations });
  assertEq(r.status, 200, "decision with annotations lands");
  const exit = await onExit(child, 8000);
  try {
    assertEq(exit.code, 0, "CLI exits 0");
    // The review record carries the annotations exactly where reviewer notes go.
    const md = readFileSync(ctx.mdPath, "utf8");
    assertMatches(md, /^decision_state:\s*suggested$/m, "decision recorded");
    assertMatches(md, /## Reviewer notes/, "reviewer notes block present");
    assertMatches(md, /### Annotations/, "annotations section present");
    assertMatches(md, /- \*\*marker\*\* — "Body text\."/, "marker annotation persisted");
    assertMatches(md, /- \*\*comment\*\* — "FORSVN Brand": tighten this headline — name the wedge/, "comment annotation persisted with its body");
    // The agent-readable JSON result line carries them additively.
    const last = ctx.stdoutBuf.text.trim().split(/\r?\n/).pop() ?? "";
    const j = JSON.parse(last);
    assertEq(j.ok, true, "final stdout line is the decision object");
    assertEq(Array.isArray(j.annotations), true, "annotations array in JSON");
    assertEq(j.annotations.length, 2, "both annotations in JSON");
    assertEq(j.annotations[1].body, "tighten this headline — name the wedge", "comment body intact");
  } finally {
    ctx.cleanup();
  }
}

async function u9AnnotationsRejected(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  try {
    for (const bad of [
      "not-an-array",
      [{ kind: "delete-everything", quote: "x" }],
      [{ kind: "marker" }],                       // missing quote
      [{ kind: "comment", quote: "q", body: 42 }], // non-string body
    ]) {
      const r = await postDone(url, { token: cfg.token, decision_state: "approved", annotations: bad });
      assertEq(r.status, 400, `malformed annotations (${JSON.stringify(bad).slice(0, 40)}) should 400`);
    }
    const md = readFileSync(ctx.mdPath, "utf8");
    assertMatches(md, /^decision_state:\s*pending$/m, "nothing written on the 400s");
    const good = await postDone(url, { token: cfg.token, decision_state: "approved" });
    assertEq(good.status, 200, "clean decision still lands");
    await onExit(child, 8000);
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    ctx.cleanup();
  }
}

async function u9EditSave(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  try {
    const before = readFileSync(ctx.mdPath, "utf8");
    const fmBlock = before.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)![0];
    const newBody = "\n# FORSVN Brand (test)\n\nEdited body — saved from the reading column.\n";
    const r = await fetch(`${url}edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: cfg.token, body_md: newBody }),
    });
    assertEq(r.status, 200, `edit save should 200; got ${r.status}`);
    const j = await r.json() as { ok: boolean; md_hash?: string };
    assertEq(j.ok, true, "edit response ok");
    assertEq(typeof j.md_hash, "string", "edit response carries the new conflict basis");

    const after = readFileSync(ctx.mdPath, "utf8");
    assertEq(after.startsWith(fmBlock), true, "frontmatter preserved verbatim");
    assertMatches(after, /Edited body — saved from the reading column\./, "body replaced");
    assertMatches(after, /^decision_state:\s*pending$/m, "edit never records a decision");

    // The twin re-rendered: a reload serves the edited content.
    const reloaded = await (await fetch(url)).text();
    assertMatches(reloaded, /Edited body — saved from the reading column\./, "served twin reflects the edit");

    // The conflict basis moved: a decision on the edited bytes still lands.
    const done = await postDone(url, { token: cfg.token, decision_state: "approved" });
    assertEq(done.status, 200, "decision after edit lands (hash basis advanced)");
    const exit = await onExit(child, 8000);
    assertEq(exit.code, 0, "CLI exits 0");
    const final = readFileSync(ctx.mdPath, "utf8");
    assertMatches(final, /^decision_state:\s*approved$/m, "decision written onto the edited file");
    assertMatches(final, /Edited body — saved from the reading column\./, "edit survived the decision write-back");
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    ctx.cleanup();
  }
}

async function u9EditConflictAndToken(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  try {
    // Bad token → 403, nothing written.
    const forged = await fetch(`${url}edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "0".repeat(32), body_md: "\nforged\n" }),
    });
    assertEq(forged.status, 403, "bad token should 403");

    // External out-of-band change → 409, nothing written.
    appendFileSync(ctx.mdPath, "\nAn out-of-band edit after render.\n");
    const stale = await fetch(`${url}edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: cfg.token, body_md: "\nstale save attempt\n" }),
    });
    assertEq(stale.status, 409, `stale edit should 409; got ${stale.status}`);
    const body = await stale.json() as { error?: string };
    assertMatches(body.error ?? "", /changed on disk/, "conflict names the cause");
    const md = readFileSync(ctx.mdPath, "utf8");
    if (/stale save attempt|forged/.test(md)) throw new Error("a refused edit reached the file");
    assertMatches(md, /An out-of-band edit after render\./, "the external change is what's on disk");
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    await new Promise((r) => setTimeout(r, 200));
    ctx.cleanup();
  }
}

async function u9SuggestionSeam(): Promise<void> {
  const ctx = setupProject();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  try {
    const cfg = await fetchPreviewConfig(url) as { token: string; suggestions?: unknown[]; pending_count?: number };
    if (!Array.isArray(cfg.suggestions)) throw new Error("preview-config must carry the additive suggestions seam");
    assertEq(cfg.suggestions.length, 0, "suggestions seam is empty until the Proof-collab bridge populates it");
    assertEq(typeof cfg.pending_count, "number", "pending_count rides preview-config");

    const origin = url.match(/^(http:\/\/[\d.:]+)\//)![1];
    const htmlDir = url.slice(origin.length).replace(/\/[^/]*$/, "");
    const chromeJs = await (await fetch(`${origin}${htmlDir}/chrome.js`)).text();
    assertMatches(chromeJs, /no agent can apply this — only you/, "ownership copy shipped");
    assertMatches(chromeJs, /config\.suggestions/, "cards render from the config seam");
    assertMatches(chromeJs, /Accept into text/, "accept affordance shipped");

    await postDone(url, { token: cfg.token, decision_state: "approved" });
    await onExit(child, 8000);
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    ctx.cleanup();
  }
}

async function u9DoneNextPending(): Promise<void> {
  const ctx = setupProject();
  seedSecondPending(ctx);
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);
  const cfg = await fetchPreviewConfig(url);
  try {
    const r = await postDone(url, { token: cfg.token, decision_state: "approved" });
    assertEq(r.status, 200, "decision lands");
    const j = await r.json() as { ok: boolean; next_pending?: { title?: string | null; skill?: string; path?: string } | null };
    if (j.next_pending === undefined) throw new Error("/done 200 body must name the next pending artifact (additive)");
    if (j.next_pending === null) throw new Error("expected a named next pending, got queue-clear");
    assertEq(j.next_pending.skill, "write-copy", "next pending names the artifact by identity");
    if ("path" in (j.next_pending as object)) throw new Error("the /done response must not carry a path — title + skill + stack + date only");
    await onExit(child, 8000);
  } finally {
    try { child.kill("SIGKILL"); } catch {}
    ctx.cleanup();
  }
}

// Generic one-shot runner for subcommands/modes that exit on their own.
async function runPreview(root: string, args: string[]): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const out = { text: "" };
  const errb = { text: "" };
  const child = spawn("bun", [PREVIEW, ...args], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout!.on("data", (b) => { out.text += b.toString(); });
  child.stderr!.on("data", (b) => { errb.text += b.toString(); });
  const { code } = await onExit(child, 8000);
  return { code, stdout: out.text, stderr: errb.text };
}

function setupListProject(): { root: string; cleanup: () => void } {
  const root = mkdtempSync(join(tmpdir(), "forsvn-preview-list-"));
  const art = (rel: string, fm: Record<string, string>): void => {
    const lines = Object.entries(fm).map(([k, v]) => `${k}: ${v}`).join("\n");
    writeAt(join(root, ".forsvn", "artifacts", rel), `---\n${lines}\n---\n\n# artifact\n`);
  };
  art("meta/forsvn-2026-05-30-a.md", { skill: "forsvn", stack: "meta", date: "2026-05-30", id: "a", type: "plan", decision_state: "pending", review_surface: "md" });
  art("marketing/create-brand-2026-05-29-b.md", { skill: "create-brand", stack: "marketing", date: "2026-05-29", id: "b", type: "brief", decision_state: "approved", review_surface: "html" });
  art("product/map-user-flow-2026-05-28-c.md", { skill: "map-user-flow", stack: "product", date: "2026-05-28", id: "c", type: "flow", decision_state: "denied" });
  // No decision_state → not reviewable → excluded.
  art("meta/no-decision.md", { skill: "forsvn", stack: "meta", date: "2026-05-27", id: "d", type: "note" });
  // Archived twin → must be excluded from live state.
  writeAt(join(root, ".forsvn", "artifacts", ".archive", "old.md"), `---\nskill: x\nid: archived\ndecision_state: pending\n---\n# old\n`);
  return { root, cleanup: () => { try { rmSync(root, { recursive: true, force: true }); } catch {} } };
}

async function runList(root: string, args: string[]): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const out = { text: "" };
  const errb = { text: "" };
  const child = spawn("bun", [PREVIEW, "list", ...args], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout!.on("data", (b) => { out.text += b.toString(); });
  child.stderr!.on("data", (b) => { errb.text += b.toString(); });
  const { code } = await onExit(child, 8000);
  return { code, stdout: out.text, stderr: errb.text };
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
  // NB: these fixtures intentionally use the RETIRED `stack: mkt` value to assert
  // the renderer's legacy alias (STACK_TO_ELEMENT keeps `mkt`→water alongside the
  // current `marketing`→water). New artifacts use `marketing`; do not "fix" these.
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

async function bundledChromeAssetsFallback(): Promise<void> {
  // Reproduces the reviewer's flagged scenario: a skill emits a canonical
  // preview at <userProject>/brand/BRAND.html that references `./tokens.css`,
  // but the user's project has no tokens.css co-located with the artifact.
  // The CLI must fall back to its bundled chrome assets so the form chrome
  // still loads.
  const ctx = setupCanonicalBrandLayout();
  const child = startCli(ctx, [ctx.htmlPath, "--no-open", "--json"]);
  const url = await waitForUrl(ctx);

  try {
    const origin = url.replace(/\/$/, "");
    // The browser resolves `./tokens.css` from /brand/BRAND.html → /brand/tokens.css.
    // tokens.css does NOT exist at <userProject>/brand/tokens.css; CLI must serve
    // the bundled copy from its install dir.
    const tokens = await fetch(`${origin}/brand/tokens.css`);
    assertEq(tokens.status, 200, `bundled tokens.css should be served via fallback; got ${tokens.status}`);
    const body = await tokens.text();
    // Sanity: should be the real tokens.css, not an empty 200.
    assertMatches(body, /--font-head|--stage-bg/, "served tokens.css should look like the real chrome tokens");

    // Sibling assets too — same flow.
    const chromeCss = await fetch(`${origin}/brand/chrome.css`);
    assertEq(chromeCss.status, 200, `bundled chrome.css should be served via fallback; got ${chromeCss.status}`);
    const chromeJs = await fetch(`${origin}/brand/chrome.js`);
    assertEq(chromeJs.status, 200, `bundled chrome.js should be served via fallback; got ${chromeJs.status}`);

    // An unknown-basename request should still 404 — fallback is closed-set.
    const random = await fetch(`${origin}/brand/whatever-not-bundled.txt`);
    assertEq(random.status, 404, "non-bundled asset should still 404");

    const cfg = await fetchPreviewConfig(url);
    await postDone(url, { token: cfg.token, decision_state: "approved" });
    const exit = await onExit(child, 8000);
    assertEq(exit.code, 0, `CLI should exit 0; stderr=${ctx.stderrBuf.text.slice(-200)}`);
  } finally {
    ctx.cleanup();
  }
}

function setupCanonicalBrandLayout(): Ctx {
  // Mimics a `create-brand` canonical emit: brand/BRAND.html (top-level
  // canonical root, NOT under .forsvn/artifacts) with `./tokens.css` style
  // hrefs and no chrome assets in the user's project tree.
  const root = mkdtempSync(join(tmpdir(), "forsvn-preview-bundled-"));
  const mdPath = join(root, "brand", "BRAND.md");
  const htmlPath = join(root, "brand", "BRAND.html");
  writeAt(mdPath, `---
skill: create-brand
version: 1
date: 2026-05-26
status: done
stack: mkt
lifecycle: canonical
summary: "Canonical brand identity (test fixture)"
decision_state: pending
review_surface: html
---

# Brand
`);
  writeAt(htmlPath, `<!doctype html>
<html data-stack="water">
<head>
  <title>BRAND · create-brand · 2026-05-26</title>
  <link rel="stylesheet" href="./tokens.css">
  <link rel="stylesheet" href="./chrome.css">
</head>
<body>
  <header class="topbar"><span class="decision-pill" data-state="pending">pending</span></header>
  <aside class="left-controls"></aside>
  <main class="stage">stage</main>
  <footer class="footer"><a href="roughdraft://open?path=x"></a></footer>
  <script type="application/json" id="preview-config">{"static":true}</script>
  <script type="application/json" id="artifact-data">{"decision_state":"pending","skill":"create-brand","stack":"mkt"}</script>
  <script src="./chrome.js"></script>
</body>
</html>`);

  bunGit(root, ["init", "--quiet"]);
  bunGit(root, ["config", "user.email", "test@example.com"]);
  bunGit(root, ["config", "user.name", "test"]);
  bunGit(root, ["add", "."]);
  bunGit(root, ["commit", "--quiet", "-m", "seed"]);

  return {
    root, slug: "BRAND", mdPath, htmlPath,
    stdoutBuf: { text: "" },
    stderrBuf: { text: "" },
    cleanup: () => { try { rmSync(root, { recursive: true, force: true }); } catch {} },
  };
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
