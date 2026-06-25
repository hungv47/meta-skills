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
//   bun scripts/forsvn-preview.ts .forsvn/artifacts/marketing-create-brand-2026-05-26-x.html
//
// Exit codes:
//   0   decision recorded
//   1   user-error (file missing, decision_state not pending, dirty tree, etc.)
//   2   server error (port bind, IO)
//   124 idle timeout (no Done click within 10 min)

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, statSync, realpathSync, copyFileSync, unlinkSync, readdirSync, appendFileSync } from "node:fs";
import { join, dirname, basename, resolve, relative, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { renderArtifactToHtml } from "../lib/render";
import { atomicWrite, splitDoc, normalizeBody, unifiedDiff, renderSuggestedEditBlock } from "../lib/collab";
import { pickReviewSurface, loadLongFormThreshold } from "../lib/route-surface";
import { captureEditDelta, loadEditDeltaMinChars, joinEditClasses } from "../lib/edit-delta";
import {
  resolveTier,
  dim,
  artifactRow,
  queueHeading,
  hintLine,
  resultLine,
  refusalLine,
  REFUSAL_EXIT,
  bannerBlock,
  warnLine,
  nextPendingHint,
  stateGlyph,
  DECISION_STATES,
  type DecisionState,
  type RefusalVariant,
  type Tier,
} from "../lib/mono";
import { renderMarkdownTerm } from "../lib/md-term";
import { initialState, step, promptIntro } from "../lib/tty-prompt";
import { DECISION_REASONS, isDecisionReason, type DecisionReason } from "../lib/decision-reason";
import { appendVerdict, verdictTs } from "../lib/verdicts";
// Type-only: erased at runtime, so it creates NO load-time dependency on forsvn-slop
// (the runtime seam is the guarded dynamic import in loadSlopSeam below).
import type { Suggestion } from "../../forsvn-slop/suggestions";

const DECISION_ENUM = new Set<string>(DECISION_STATES);

const HOST = "127.0.0.1";
const IDLE_TIMEOUT_MS = 10 * 60 * 1000;
// The artifacts home moved out of .forsvn/ into docs/forsvn/ (artifact-home
// relocation). Single write-target home (prefer the new one, fall back to the
// legacy one) — used when we need ONE directory to write under, e.g. the archive
// root. The project-discovery marker stays `.forsvn/`.
function resolveArtifactsDir(projectRoot: string): string {
  const moved = join(projectRoot, "docs", "forsvn", "artifacts");
  return existsSync(moved) ? moved : join(projectRoot, ".forsvn", "artifacts");
}

// Both artifact homes that may hold this project's review queue. The manifest
// walkers (manifest-sync.ts / sync.rs ARTIFACT_ROOTS) union both so indexing
// spans the migration; the review CLI must scan both too — otherwise a
// not-yet-migrated project's queue under .forsvn/artifacts goes invisible the
// moment docs/forsvn/artifacts exists (the desktop creates it on open). Returns
// only the homes present on disk.
function resolveArtifactsDirs(projectRoot: string): string[] {
  return [
    join(projectRoot, "docs", "forsvn", "artifacts"),
    join(projectRoot, ".forsvn", "artifacts"),
  ].filter((dir) => existsSync(dir));
}
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
const BUNDLED_CHROME_DIR = join(CLI_INSTALL_ROOT, "assets", "_html");
const BUNDLED_CHROME_ASSETS = new Set([
  "tokens.css", "chrome.css", "chrome.js", "base.html", "fonts.css",
  // U9 chrome: the real brand glyphs (theme-swapped by chrome.css — cream on
  // dark surfaces, forest on light, per BRAND.md § Logo Color Combinations).
  "logo-glyph-cream.svg", "logo-glyph-forest.svg",
]);
// Self-hosted woff2 files referenced by fonts.css as `./fonts/<name>` — same
// fallback as above but namespaced under fonts/ so an arbitrary project file
// can't shadow a font (and vice versa). Extension-pinned to .woff2.
const BUNDLED_FONT_RE = /(?:^|\/)fonts\/([a-z0-9-]+\.woff2)$/;

const VALID_DECISIONS = ["approved", "denied", "suggested"] as const;
type Decision = typeof VALID_DECISIONS[number];

// U9 collab bar: Marker + Comment annotations ride the decision POST
// additively and persist into the artifact's review record so agents can
// read them back. Validated server-side (kind enum + length caps).
type Annotation = { kind: "marker" | "comment"; quote: string; body?: string };
const ANNOTATIONS_MAX = 100;
const ANNOTATION_QUOTE_MAX = 2000;
const ANNOTATION_BODY_MAX = 5000;

type Payload = {
  token: string;
  decision_state: Decision;
  decision_reason?: DecisionReason;
  comments?: string;
  variant?: string;
  annotations?: Annotation[];
};

type ServeResult = { ok: true; payload: Payload } | { ok: false; reason: "timeout" | "quit" };

// --- Entry --------------------------------------------------------------

async function main(): Promise<number> {
  const args = process.argv.slice(2);

  // Subcommand dispatch. `list` reports pending/decided artifacts (the PP-3
  // "report state" surface an agent reads before serving a review); a bare
  // artifact path (back-compat) serves one artifact's review UI and blocks for
  // the decision. A real artifact path always ends in .md/.html, never the
  // literal "list", so the dispatch is unambiguous.
  if (args[0] === "list") {
    return listMode(args.slice(1));
  }
  if (args[0] === "attach") {
    return attachMode(args.slice(1));
  }
  if (args[0] === "notify") {
    return notifyMode(args.slice(1));
  }

  const flagJson = args.includes("--json");
  const flagNoOpen = args.includes("--no-open");
  // Headless review is OPT-IN via the explicit flag — never inferred from
  // piped stdio or browser-open failure (the e2e suite spawns with piped
  // stdio and --no-open and must keep hitting the plain serve path).
  // Auto-detection heuristics are a follow-up.
  const flagHeadless = args.includes("--headless");
  // Preview-mode chooser (terminal seam). Three modes per review:
  //   --html  serve the designed review webapp (default — behavior unchanged)
  //   --md    render the Markdown right here in the terminal (read-only)
  //   Proof   iterative collab editing — `forsvn-collab open <artifact.md>`
  //           (separate CLI; see docs/runbooks/collaborative-docs.md)
  // The chooser's full UX (visual/webapp form) lands after the OD design pass;
  // this is the flag seam only.
  const flagMd = args.includes("--md");
  const flagHtml = args.includes("--html");
  const positional = args.filter((a) => !a.startsWith("--"));

  if (positional.length !== 1 || (flagMd && (flagHtml || flagHeadless || flagJson))) {
    err(`usage: forsvn-preview <path-to-artifact.md|.html> [--html | --md] [--no-open] [--headless] [--json]`);
    err(`       forsvn-preview list [--root <dir>] [--state pending|decided|all] [--json]`);
    err(`       forsvn-preview attach <artifact.md> <file-or-url> [--picked] [--root <dir>] [--json]`);
    err(`       forsvn-preview notify <artifact.md> [--root <dir>]`);
    err(`preview modes:`);
    err(`  --html     serve the designed review webapp on 127.0.0.1 (default)`);
    err(`  --md       render the Markdown in the terminal — read-only preview, no decision capture`);
    err(`  (collab)   iterative Proof editing: forsvn-collab open <artifact.md> — see docs/runbooks/collaborative-docs.md`);
    if (flagMd) err(`note: --md is a read-only view — it does not combine with --html, --headless, or --json`);
    return 1;
  }
  const outTier = resolveTier(process.stdout);
  const input = resolve(positional[0]);
  let mdPath: string;
  let htmlPath: string;
  if (input.endsWith(".md")) {
    mdPath = input;
    htmlPath = input.replace(/\.md$/, ".html");
  } else if (input.endsWith(".html")) {
    htmlPath = input;
    mdPath = input.replace(/\.html$/, ".md");
  } else {
    refuse("precondition", `expected an .md or .html file, got ${input}`, "pass the artifact's .md (or its .html twin)");
    return REFUSAL_EXIT.precondition;
  }
  if (!existsSync(mdPath)) {
    refuse("precondition", `Markdown artifact not found: ${mdPath}`, "check the path, or re-run the emitting skill to regenerate it");
    return REFUSAL_EXIT.precondition;
  }

  // --md: terminal Markdown preview. Read-only — no git-dirty gate, no
  // pending gate (viewing never mutates, so a decided artifact is viewable
  // too). Decision capture stays on the serve/headless paths.
  if (flagMd) {
    const source = readFileSync(mdPath, "utf8");
    const cols = process.stdout.columns ?? 80;
    console.log(renderMarkdownTerm(source, outTier, { width: cols }));
    console.log("");
    console.log(dim("read-only preview — to decide, re-run without --md (serves the review webapp)", outTier));
    return 0;
  }

  const projectRoot = findProjectRoot(htmlPath);

  // Refuse if the target .md has uncommitted changes — we're about to rewrite
  // it, so the caller should commit or stash first to keep the diff legible.
  if (gitIsDirty(projectRoot, mdPath)) {
    refuse("precondition", `target file has uncommitted changes: ${relative(projectRoot, mdPath)}`, "commit or stash the artifact before previewing");
    return REFUSAL_EXIT.precondition;
  }

  const mdSource = readFileSync(mdPath, "utf8");
  const fm = parseFrontmatter(mdSource);
  if (!fm) {
    refuse("precondition", `could not read frontmatter from ${mdPath}`, "fix the frontmatter block, then re-serve");
    return REFUSAL_EXIT.precondition;
  }
  if (fm.decision_state !== "pending") {
    refuse("precondition", `decision_state is ${JSON.stringify(fm.decision_state ?? "<unset>")}, not "pending" — refusing to start`, "already decided — nothing to do; emit a new pending artifact to re-review");
    return REFUSAL_EXIT.precondition;
  }

  // The human-owned gate survives headless: the TTY prompt requires a real
  // interactive stdin. Piped/non-interactive stdin is refused pre-loop —
  // no fabricated decision, ever (spec node I0).
  if (flagHeadless && !process.stdin.isTTY) {
    refuse("non-interactive", "refusing to capture a decision — stdin is not interactive", "re-run --headless from a real TTY, or tunnel the port (ssh -L) and use the browser form");
    return REFUSAL_EXIT["non-interactive"];
  }

  // The plugin owns rendering: (re)generate the HTML twin from the Markdown
  // so the preview always reflects the current artifact. This replaces the
  // old per-skill "hand-build the HTML" step (the renderReviewSurface fiction).
  console.log(dim("rendering HTML twin…", outTier));
  renderArtifactToHtml(mdPath, BUNDLED_CHROME_DIR, relative(projectRoot, mdPath));

  // G1 — render-time Review Gate check (after pre-flight, before serve).
  // Warn-and-proceed, never refuse, never silent: the pinned DecisionBar is
  // the only interactive capture point, so a missing in-body gate echo costs
  // orientation, not capability — the operator must KNOW the preview is
  // partial, then decide anyway. The same fact rides into preview-config as
  // the additive `gate_warning` field (the webapp NoticeStrip's data seam).
  const gateWarning = reviewGateWarning(mdSource, basename(mdPath));
  if (gateWarning) {
    console.log(warnLine(
      gateWarning,
      "the pinned decision bar still captures your decision; add the block per\nreferences/artifact-contract-template.md to restore the in-body mirror",
      outTier,
    ));
  }

  // C5 — auto-routed review surface: the operator never picks a review tool. This
  // one-shot surface is inline; when the artifact is long-form (or explicitly
  // review_tool: proof) the router prefers Proof, so point at the turn-by-turn
  // path instead of silently serving inline. Advisory only — we still serve the
  // inline review below (never a dead end), and /forsvn:collab is the explicit
  // Proof escape hatch.
  if (
    pickReviewSurface(
      { review_tool: fm.review_tool, review_surface: fm.review_surface },
      { bodyLength: splitDoc(mdSource).body.length, longFormThreshold: loadLongFormThreshold(projectRoot) },
    ) === "proof"
  ) {
    console.log(dim(
      "long-form artifact — /forsvn:collab opens it in Proof for turn-by-turn editing; serving the inline review here.",
      outTier,
    ));
  }

  const token = randomBytes(TOKEN_BYTES).toString("hex");
  // Session state is MUTABLE because POST /edit (the workbench's Edit mode)
  // legitimately rewrites the artifact body mid-serve: after a successful
  // edit the conflict-guard basis moves to the saved bytes and the twin is
  // re-rendered, so the decision still applies to exactly what the human
  // read last. External (out-of-band) changes still 409.
  const session: ServeSession = {
    htmlSource: readFileSync(htmlPath, "utf8"),
    // Conflict-guard basis: the decision applies to the bytes the human READ.
    mdHash: createHash("sha256").update(mdSource).digest("hex"),
    gateWarning,
    // The chrome strip's "N pending" crumb (additive preview-config field).
    pendingCount: scanPendingCount(projectRoot),
    // S4 — deterministic slop suggestion cards (main() is async; the seam is too).
    suggestions: await computeSuggestions(mdSource, relative(projectRoot, mdPath)),
  };

  let server: ReturnType<typeof Bun.serve>;
  try {
    server = Bun.serve({
      hostname: HOST,
      port: 0,
      fetch: makeHandler({ session, htmlPath, mdPath, token, projectRoot }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    refuse("bind", `could not bind ${HOST}: ${msg}`, "port 0 pre-empts collisions, so this is a genuine failure — check sandbox/firewall restrictions, then re-run");
    return REFUSAL_EXIT.bind;
  }

  const port = (server as { port?: number }).port ?? 0;
  // Browser opens at the mirrored HTML URL so the HTML's relative <link>/<script>
  // hrefs resolve to real file paths under the project root.
  const htmlUrlPath = "/" + relative(projectRoot, htmlPath).split(sep).join("/");
  const url = `http://${HOST}:${port}${htmlUrlPath}`;
  // BannerBlock — the serving line stays one unbroken line: the e2e suite
  // scrapes the URL from it and humans copy-paste it. Headless adds the
  // tunnel hint and hands off to the TTY prompt ("or decide here:").
  for (const line of bannerBlock({
    variant: flagHeadless ? "headless" : "gui",
    servingLine: `serving ${relative(projectRoot, htmlPath)} at ${url}`,
    csrfPreview: token.slice(0, 8),
    trustHint: `bound to 127.0.0.1 only; local-trust model — any process on this host can read the token from GET ${htmlUrlPath} and POST a decision. Don't run on shared boxes.`,
    tunnelHint: `ssh -L ${port}:127.0.0.1:${port} <remote-host>`,
  }, outTier)) {
    console.log(line);
  }

  if (!flagNoOpen && !flagHeadless) openBrowser(url);

  // C2/L1 — review latency: the open→decide span, stamped onto the verdict row.
  const serveStartedAt = Date.now();

  // The shutdown handler set in makeHandler() resolves this promise once a
  // decision lands — POST /done OR the TTY prompt; both race for the same
  // single-shot resolve (first wins, the loser is torn down before any
  // mutation). Idle timeout re-arms on every TTY keypress.
  let promptCleanup: (() => void) | undefined;
  let result: ServeResult;
  try {
    result = await new Promise<ServeResult>((resolveServe) => {
      state.resolve = resolveServe;
      state.arm = () => {
        if (state.idleTimer) clearTimeout(state.idleTimer);
        state.idleTimer = setTimeout(() => {
          resolveServe({ ok: false, reason: "timeout" });
        }, IDLE_TIMEOUT_MS);
      };
      state.arm();

      if (flagHeadless) {
        const claimSlot = (): typeof state.resolve => {
          // Same one-shot claim discipline as POST /done: take the slot or
          // lose the race; the losing channel never reaches the write path.
          if (!state.resolve) return undefined;
          const r = state.resolve;
          state.resolve = undefined;
          if (state.idleTimer) clearTimeout(state.idleTimer);
          return r;
        };
        promptCleanup = startTtyPrompt({
          tier: outTier,
          meta: { name: basename(mdPath), skill: fm.skill ?? "?", state: "pending", excerpt: fm.summary },
          activity: () => { if (state.resolve) state.arm?.(); },
          decide: (decision_state, comment, reason) => {
            const r = claimSlot();
            if (!r) return;
            r({ ok: true, payload: {
              token,
              decision_state,
              ...(reason && decision_state !== "approved" ? { decision_reason: reason } : {}),
              ...(comment ? { comments: comment } : {}),
            } });
          },
          quit: () => {
            const r = claimSlot();
            if (!r) return;
            r({ ok: false, reason: "quit" });
          },
        });
      }
    });
  } finally {
    // Raw mode is restored on EVERY exit path — decision, quit, timeout,
    // and anything thrown — or the operator's shell is left unusable.
    promptCleanup?.();
  }

  // Force-close: stop accepting connections AND drop any in-flight/half-open socket
  // immediately. A graceful `server.stop()` instead can wedge process teardown when a
  // duplicate POST races the shutdown — it resolves while leaving a socket Bun still
  // tracks, so the subsequent process.exit(0) hangs (~30s until SIGKILL), which the e2e
  // duplicate-POST scenario surfaces intermittently under load. The deferred /done 200
  // was already handed to the socket before this. forsvn-web.ts force-closes likewise.
  server.stop(true);

  if (!result.ok && result.reason === "quit") {
    // q: world unchanged — no write, decision_state stays pending.
    if (flagJson) console.log(JSON.stringify({ ok: false, reason: "quit" }));
    return 0;
  }

  if (!result.ok) {
    refuse("timeout", `no decision after ${IDLE_TIMEOUT_MS / 60000} minutes — exiting`, "nothing was written; decision_state is still pending; re-serve any time");
    if (flagJson) console.log(JSON.stringify({ ok: false, reason: result.reason }));
    return REFUSAL_EXIT.timeout;
  }

  // Apply mutations after the server stops so failure leaves the world
  // unchanged. Order: rewrite MD → archive HTML → manifest-sync.
  const today = new Date().toISOString().slice(0, 10);
  const decisionUpdates: Record<string, string> = {
    decision_state: result.payload.decision_state,
    reviewed_at: today,
    reviewer: "operator",
  };
  // The option-picker (CLOSED-LOOP.md §6): the picked variant was captured but
  // never persisted ("accepted but ignored"). Record it as `asset_picked` so the
  // canonical choice survives in frontmatter and is indexed for downstream skills.
  if (result.payload.variant) decisionUpdates.asset_picked = result.payload.variant;
  // C1: the reason chip rides into frontmatter (applyDecision upserts any key).
  // Only ever set on a non-approve decision (the /done + TTY paths both gate it).
  if (result.payload.decision_reason) decisionUpdates.decision_reason = result.payload.decision_reason;
  // Re-read from disk, not the serve-time snapshot: a workbench Edit save may
  // have legitimately rewritten the body mid-serve (the /done conflict guard
  // already proved the decision applies to these exact bytes).
  const finalSource = readFileSync(mdPath, "utf8");
  // On an approve over an artifact that carried a prior reason (a re-decision),
  // clear it so the contract invariant holds (reason iff denied/suggested).
  if (result.payload.decision_state === "approved" && /^decision_reason:\s*\S/m.test(finalSource)) {
    decisionUpdates.decision_reason = "";
  }

  // L2 — edit-delta capture: snapshot the produced body's identity and classify
  // whatever the operator changed before deciding. `mdSource` is the serve-time
  // (pending, pre-edit) body the producer emitted; `finalSource` carries any
  // in-place workbench edit. This runs on EVERY decision (incl. approve — an
  // "approved with edits" is the second-richest signal after a deny). Advisory:
  // a degraded classify yields [] and never blocks the write-back.
  const producedBody = splitDoc(mdSource).body;
  const editedBody = splitDoc(finalSource).body;
  const delta = captureEditDelta(producedBody, editedBody, loadEditDeltaMinChars(projectRoot));
  // Record the produced-body sha on the decided artifact (existing writer — no new
  // .md writer). Lets a later read confirm the diff was against the real produced
  // text and dedupe re-reviews. On a clean approve it matches the body; on an
  // edited decision it records the pre-edit produced identity (intended).
  decisionUpdates.body_sha = delta.body_sha;

  let updated = applyDecision(finalSource, decisionUpdates, result.payload.comments, result.payload.annotations);

  // C3 — inline-edit diff round-trip: if the operator edited the body in-place
  // (the workbench Edit mode advanced finalSource past the served mdSource) on a
  // non-approve decision, persist the exact correction as a unified diff beneath
  // `## Reviewer notes` so the producing agent reads the literal fix, not just a
  // prose comment. Reformat-only noise is normalized out (no spurious diff).
  if (result.payload.decision_state !== "approved") {
    if (normalizeBody(producedBody) !== normalizeBody(editedBody)) {
      const block = renderSuggestedEditBlock(unifiedDiff(producedBody, editedBody));
      updated = /^## Reviewer notes\b/m.test(updated)
        ? updated.replace(/\s*$/, "") + "\n" + block
        : updated.replace(/\s*$/, "") + `\n\n## Reviewer notes\n_operator · ${today}_\n${block}`;
    }
  }
  writeFileSync(mdPath, updated, "utf8");

  // C2/L1 — the learning wire: append one verdict row AFTER the canonical write.
  // Best-effort + keyless-safe inside appendVerdict (never fails the decision).
  // L2 rides the SAME row: body_sha + edit_classes (a degraded classify appends an
  // advisory diagnostic to the note, never overwriting the operator comment).
  const operatorNote = (result.payload.comments ?? "").split(/\r?\n/)[0] ?? "";
  appendVerdict(projectRoot, {
    ts: verdictTs(),
    artifact_id: fm.id ?? "",
    skill: fm.skill ?? "",
    stack: fm.stack ?? "",
    decision_state: result.payload.decision_state,
    decision_reason: result.payload.decision_reason ?? "",
    dimensions_flagged: "",                       // reserved for L5
    note: [operatorNote, delta.note].filter(Boolean).join(" · "),
    review_latency_ms: String(Date.now() - serveStartedAt),
    surface: flagHeadless ? "tty" : "cli",
    body_sha: delta.body_sha,
    edit_classes: joinEditClasses(delta.edit_classes),
  });

  const archivedRel = archiveHtml(projectRoot, htmlPath);

  runManifestSync(projectRoot);

  // G5 — next-pending affordance: re-scan the queue AFTER the write-back so
  // the just-decided artifact is already out of the pending bucket. A read-only
  // named hint, never auto-chaining (one artifact per serve stays the
  // invariant). `undefined` = no .forsvn/artifacts queue around this artifact
  // (e.g. a canonical brand emit) — say nothing rather than lie about a queue.
  const nextPending = scanNextPending(projectRoot);

  if (flagJson) {
    // ResultLine(json): the decision object is the FINAL stdout line — nothing
    // prints after it (manifest-sync stdio is captured above). The G5 fact
    // rides INSIDE the object as the additive `next_pending` field; the
    // human-mode hint never prints in --json mode (a trailing line would
    // break consumers that pop() the last stdout line).
    console.log(JSON.stringify({
      ok: true,
      decision_state: result.payload.decision_state,
      reviewed_at: today,
      md: relative(projectRoot, mdPath),
      archived: archivedRel,
      comments: result.payload.comments ?? null,
      variant: result.payload.variant ?? null,
      asset_picked: result.payload.variant ?? null,
      annotations: result.payload.annotations ?? null,
      next_pending: nextPending
        ? { path: nextPending.path, skill: nextPending.skill, stack: nextPending.stack, date: nextPending.date }
        : null,
    }));
  } else {
    // ResultLine(human) — one line closes the loop; the frontmatter rewrite
    // and archive it reports are the single statement of what happened.
    console.log("");
    console.log(resultLine("human", result.payload.decision_state, outTier));
    // G2 — the one-time first-run "aha": fires only on the run that decides
    // the SEEDED SAMPLE artifact (matched by its well-known frontmatter `id`,
    // not a counter or state file — the sample is decided exactly once, so
    // the block fires exactly once). Plain text, no banner art: the calm is
    // the brand; the content is the aha.
    if (fm.id === SEEDED_SAMPLE_ID) {
      console.log("");
      console.log("that was the whole loop: an agent produced this artifact, you decided,");
      console.log("and the decision just rode back into the file the agent reads next.");
      console.log(hintLine("try it on real work: run /forsvn in any repo you work in.", outTier));
    }
    if (nextPending !== undefined) {
      console.log("");
      for (const line of nextPendingHint(
        nextPending === null ? null : { path: nextPending.path, meta: [nextPending.stack ?? "?", nextPending.skill ?? "?", (nextPending.date ?? "").slice(5) || "?"] },
        outTier,
      )) {
        console.log(line);
      }
    }
  }
  return 0;
}

// G2 — the seeded sample's well-known frontmatter id. The first-run bootstrap
// (J1 P-07: `/forsvn` scaffolds `.forsvn/` and seeds one guaranteed-valid
// pending sample) MUST stamp this id on the sample artifact; the aha block
// above keys on it and on nothing else.
const SEEDED_SAMPLE_ID = "forsvn-sample";

// G5 — top pending artifact after a decision. Returns `undefined` when the
// project has no .forsvn/artifacts tree at all (no queue concept), `null`
// when the queue exists but is empty (explicit "queue clear"), else the top
// pending entry in `list` order (newest date first, then path).
// `excludePath` (project-relative posix) lets the /done responder name the
// next artifact BEFORE the just-decided one is rewritten on disk.
function scanNextPending(projectRoot: string, excludePath?: string): ArtifactEntry | null | undefined {
  const dirs = resolveArtifactsDirs(projectRoot);
  if (dirs.length === 0) return undefined;
  try {
    const pending = dirs
      .flatMap((dir) => scanArtifacts(dir, projectRoot))
      .filter((e) => e.decision_state === "pending")
      .filter((e) => !excludePath || e.path !== excludePath);
    return pending.length > 0 ? pending[0] : null;
  } catch {
    // A broken queue scan must never take down a recorded decision.
    return undefined;
  }
}

// U9 — the chrome strip's pending count (additive preview-config field).
// `undefined` when the project has no queue concept; the chrome shows
// nothing rather than lying about a queue.
function scanPendingCount(projectRoot: string): number | undefined {
  const dirs = resolveArtifactsDirs(projectRoot);
  if (dirs.length === 0) return undefined;
  try {
    return dirs
      .flatMap((dir) => scanArtifacts(dir, projectRoot))
      .filter((e) => e.decision_state === "pending").length;
  } catch {
    return undefined;
  }
}

// G1 — does the artifact carry a usable `## Review Gate` block? Returns the
// warn reason when the heading is missing or its section parses to zero
// checkbox lines; null when the gate echo will render fine.
function reviewGateWarning(mdSource: string, name: string): string | null {
  const m = mdSource.match(/^#{1,6}[ \t]+Review Gate[ \t]*$/im);
  if (!m) {
    return `no "## Review Gate" block found in ${name} — preview renders without the gate echo`;
  }
  const after = mdSource.slice((m.index ?? 0) + m[0].length);
  const section = after.split(/^#{1,6}[ \t]+\S/m)[0];
  const boxes = section.match(/^\s*[-*]\s+\[[ xX]\]/gm);
  if (!boxes || boxes.length === 0) {
    return `the "## Review Gate" block in ${name} has no checkbox lines — preview renders without the gate echo`;
  }
  return null;
}

// --- list subcommand ----------------------------------------------------
// Reports the review state of every artifact under .forsvn/artifacts/ —
// the PP-3 "report pending/decided state" surface. Read-only: no git check,
// no rendering, no server. An agent calls `list --json` to discover what is
// awaiting a human decision before serving a specific artifact for review.
// Self-contained — does NOT depend on forsvn-mcp or the forsvn-skills bin
// (forsvn-preview is a separately published, self-sufficient plugin).

const DECIDED_STATES = new Set<string>(VALID_DECISIONS);

type ArtifactEntry = {
  id: string | null;
  path: string;            // project-relative, posix-separated
  title: string | null;    // display identity (the UI never shows paths)
  skill: string | null;
  stack: string | null;
  date: string | null;
  type: string | null;
  decision_state: string;
  review_surface: string | null;
  summary: string | null;
};

async function listMode(args: string[]): Promise<number> {
  const flagJson = args.includes("--json");
  const rootArg = argValue(args, "--root");
  const stateExplicit = argValue(args, "--state") !== undefined;
  const stateArg = (argValue(args, "--state") ?? "all").toLowerCase();
  if (!["pending", "decided", "all"].includes(stateArg)) {
    err(`--state must be pending | decided | all (got ${JSON.stringify(stateArg)})`);
    return 1;
  }

  const startDir = rootArg ? resolve(rootArg) : process.cwd();
  const projectRoot = findProjectRootFromDir(startDir);
  const dirs = resolveArtifactsDirs(projectRoot);
  if (dirs.length === 0) {
    refuse("precondition", `no docs/forsvn/artifacts (or legacy .forsvn/artifacts) under ${projectRoot}`, "run inside a FORSVN project or pass --root <dir>");
    return REFUSAL_EXIT.precondition;
  }

  const entries = dirs.flatMap((dir) => scanArtifacts(dir, projectRoot));
  const pending = entries.filter((e) => e.decision_state === "pending");
  const decided = entries.filter((e) => DECIDED_STATES.has(e.decision_state));

  if (flagJson) {
    // `other` keeps the counts honest: an artifact with a non-pending,
    // non-decided decision_state (e.g. `not_required`) is tracked in `total`
    // but appears in neither actionable bucket — surface it instead of letting
    // total − pending − decided silently disagree.
    const out: { ok: true; project_root: string; counts: Record<string, number>; pending?: ArtifactEntry[]; decided?: ArtifactEntry[] } = {
      ok: true,
      project_root: projectRoot,
      counts: {
        pending: pending.length,
        decided: decided.length,
        other: entries.length - pending.length - decided.length,
        total: entries.length,
      },
    };
    if (stateArg === "pending" || stateArg === "all") out.pending = pending;
    if (stateArg === "decided" || stateArg === "all") out.decided = decided;
    console.log(JSON.stringify(out));
    return 0;
  }

  // Human-readable: spec §5 P-01 row grammar through the mono module.
  // Decisions are human-owned — this view is for the operator (and for an
  // agent narrating what's queued).
  const outTier = resolveTier(process.stdout);
  const width = process.stdout.columns ?? 120;
  const others = entries.filter((e) => e.decision_state !== "pending" && !DECIDED_STATES.has(e.decision_state));
  const padTo = Math.max(0, ...pending.map((e) => e.path.length));
  const rowOf = (e: ArtifactEntry, pad: number): string => artifactRow({
    state: (DECISION_ENUM.has(e.decision_state) ? e.decision_state : "pending") as DecisionState,
    path: e.path,
    meta: [e.stack ?? "?", e.skill ?? "?", (e.date ?? "").slice(5) || "?"],
    excerpt: e.summary ?? "",
  }, outTier, { padTo: pad, width });

  if (!stateExplicit) {
    // Default view (J3-W1): pending expanded, decided collapsed behind the
    // dim-suffix hint. Zero pending → zero message, stop (no decided section).
    console.log(queueHeading("pending", pending.length, outTier));
    if (pending.length === 0) {
      console.log(hintLine("nothing awaiting review", outTier));
      return 0;
    }
    for (const e of pending) console.log(rowOf(e, padTo));
    console.log("");
    console.log(queueHeading("decided", decided.length, outTier, "use --state all to show"));
    return 0;
  }

  let printedGroup = false;
  const gap = (): void => { if (printedGroup) console.log(""); printedGroup = true; };
  if (stateArg === "pending" || stateArg === "all") {
    gap();
    console.log(queueHeading("pending", pending.length, outTier));
    if (pending.length === 0) console.log(hintLine("nothing awaiting review", outTier));
    for (const e of pending) console.log(rowOf(e, padTo));
  }
  if (stateArg === "decided" || stateArg === "all") {
    gap();
    const decidedPad = Math.max(0, ...decided.map((e) => e.path.length));
    console.log(queueHeading("decided", decided.length, outTier));
    if (decided.length === 0) console.log(hintLine("none yet", outTier));
    for (const e of decided) console.log(rowOf(e, decidedPad));
  }
  if (stateArg === "all" && others.length > 0) {
    // `not_required` (and any unknown-state) entries surface only in the full
    // view; each row carries its own `○ not_required` badge, dim.
    gap();
    const otherPad = Math.max(0, ...others.map((e) => e.path.length));
    for (const e of others) console.log(rowOf(e, otherPad));
  }
  return 0;
}

// --- attach subcommand (the return-leg, CLOSED-LOOP.md §6) ----------------
// Re-ingest a rendered asset (a file or a deployed URL) back onto its artifact:
// the loop only closes when the REAL output re-enters the graph so the evaluator
// scores what shipped and downstream skills (write-social, write-ad) reference
// the asset, not the brief. A file is copied into `.forsvn/assets/<id>/` (custody
// + a stable, id-keyed home that survives an artifact move); the repo-relative
// path (or the URL verbatim) is appended to the flat `assets:` frontmatter list.
// `--picked` records it as the canonical option-picker choice (`asset_picked:`).
// Self-contained, headless, additive — the desktop drag-drop is a thin trigger
// over this same mechanic. Decisions stay human-owned; this attaches, never approves.

const ASSETS_REL = ".forsvn/assets";

async function attachMode(args: string[]): Promise<number> {
  const flagJson = args.includes("--json");
  const picked = args.includes("--picked");
  const rootArg = argValue(args, "--root");
  // Positionals = non-flag tokens, excluding the value consumed by `--root <dir>`
  // (space form). `--root=<dir>` and `--json`/`--picked` start with `-` already.
  const positional: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("-")) continue;
    if (i > 0 && args[i - 1] === "--root") continue;
    positional.push(args[i]);
  }
  if (positional.length !== 2) {
    err(`usage: forsvn-preview attach <artifact.md> <file-or-url> [--picked] [--root <dir>] [--json]`);
    return 1;
  }
  const [artifactArg, source] = positional;
  const mdPath = resolve(artifactArg);
  if (!mdPath.endsWith(".md")) { err(`expected an .md artifact, got ${mdPath}`); return 1; }
  if (!existsSync(mdPath)) { err(`artifact not found: ${mdPath}`); return 1; }

  const projectRoot = rootArg ? findProjectRootFromDir(resolve(rootArg)) : findProjectRoot(mdPath);
  const mdSource = readFileSync(mdPath, "utf8");
  const fm = parseFrontmatter(mdSource);
  if (!fm) { err(`could not read frontmatter from ${mdPath}`); return 1; }
  const id = fm.id;
  if (!id) { err(`artifact has no \`id\` in frontmatter — cannot key its asset folder`); return 1; }

  // Resolve the asset reference: a URL is recorded verbatim; a file is taken
  // into custody under .forsvn/assets/<id>/ and recorded as a repo-relative path.
  const isUrl = /^https?:\/\//i.test(source);
  let ref: string;
  if (isUrl) {
    ref = source;
  } else {
    const src = resolve(source);
    if (!existsSync(src) || !statSync(src).isFile()) { err(`asset file not found: ${src}`); return 1; }
    const destDir = join(projectRoot, ASSETS_REL, id);
    mkdirSync(destDir, { recursive: true });
    let dest = join(destDir, basename(src));
    // Never silently overwrite a prior re-ingest of the same name (and don't
    // self-copy when re-attaching a file already in custody).
    if (existsSync(dest) && resolve(dest) !== src) {
      const ext = extname(dest);
      dest = join(destDir, `${basename(dest, ext)}.${new Date().toISOString().replace(/[:.]/g, "-")}${ext}`);
    }
    if (resolve(dest) !== src) copyFileSync(src, dest);
    ref = relative(projectRoot, dest).split(sep).join("/");
  }

  const current = readAssetsList(fm);
  const next = current.includes(ref) ? current : [...current, ref];
  const updates: Record<string, string> = { assets: serializeList(next) };
  if (picked) updates.asset_picked = ref;
  // applyDecision is a generic frontmatter upserter (replace-or-append per key);
  // no comments here — attach is additive, not a decision.
  const updated = applyDecision(mdSource, updates, undefined);
  writeFileSync(mdPath, updated, "utf8");
  runManifestSync(projectRoot);

  if (flagJson) {
    console.log(JSON.stringify({
      ok: true,
      artifact: relative(projectRoot, mdPath),
      id,
      asset: ref,
      kind: isUrl ? "url" : "file",
      assets: next,
      asset_picked: picked ? ref : (fm.asset_picked ?? null),
    }));
  } else {
    log(`attached → ${ref}${picked ? "  (picked: canonical)" : ""}`);
    log(`assets now: ${next.join(", ")}`);
  }
  return 0;
}

function readAssetsList(fm: Record<string, string>): string[] {
  const raw = (fm.assets ?? "").trim();
  if (!raw) return [];
  const inner = raw.startsWith("[") && raw.endsWith("]") ? raw.slice(1, -1) : raw;
  return inner.split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
}

function serializeList(items: string[]): string {
  return `[${items.join(", ")}]`;
}

// --- notify subcommand (G4 — the agent's post-push signal) -----------------
// `forsvn-preview notify <artifact.md>` is what an agent fires after pushing
// an artifact when no app is running. Two effects, both one line: append an
// event to `.forsvn/inbox` and print a ResultLine to stdout. The inbox is a
// journal, not state — `list` remains the truth; the file is transient signal
// (gitignored, safe to truncate).
//
// Inbox line grammar (the T-0 row grammar with a timestamp prefix, so
// `tail -f` reads as a pending list accruing in time):
//   <ISO-8601Z> <glyph> <state>  <path>  <skill> · "<excerpt>"
// A log file is a non-TTY consumer: ALWAYS tier-3 ASCII — zero escape bytes,
// ASCII glyphs, ASCII ellipsis. The stdout ResultLine uses the same plain
// grammar (flow S-07).
//
// Idempotency (the dedupe rule): before appending, read the inbox tail — if
// the most recent line for the same artifact already records the same
// decision_state, skip the append and say so. A re-push that reset a decided
// artifact back to `pending` is a NEW event and appends. Append-only otherwise.

const INBOX_REL = ".forsvn/inbox";
const INBOX_PATH_PAD = 24;
const INBOX_EXCERPT_MAX = 60;

async function notifyMode(args: string[]): Promise<number> {
  const rootArg = argValue(args, "--root");
  const positional: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("-")) continue;
    if (i > 0 && args[i - 1] === "--root") continue;
    positional.push(args[i]);
  }
  if (positional.length !== 1) {
    err(`usage: forsvn-preview notify <artifact.md> [--root <dir>]`);
    return 1;
  }
  const mdPath = resolve(positional[0]);
  if (!mdPath.endsWith(".md")) {
    refuse("precondition", `expected an .md artifact, got ${mdPath}`, "notify signals the Markdown artifact the agent just pushed");
    return REFUSAL_EXIT.precondition;
  }
  if (!existsSync(mdPath)) {
    refuse("precondition", `artifact not found: ${mdPath}`, "check the path — notify fires after the artifact is written");
    return REFUSAL_EXIT.precondition;
  }
  const fm = parseFrontmatter(readFileSync(mdPath, "utf8"));
  if (!fm || !fm.decision_state) {
    refuse("precondition", `artifact carries no decision_state — nothing to signal`, "only decision-tracked artifacts ride the inbox; see references/artifact-contract-template.md");
    return REFUSAL_EXIT.precondition;
  }

  const projectRoot = rootArg ? findProjectRootFromDir(resolve(rootArg)) : findProjectRootFromDir(dirname(mdPath));
  const state = fm.decision_state;
  // ASCII state glyph, tier-independent (the inbox is always tier 3; the
  // stdout line mirrors the same grammar). Unknown states keep their word
  // with the neutral `*` glyph — rendered, never dropped.
  const glyph = DECISION_ENUM.has(state) ? stateGlyph(state as DecisionState, 3) : "*";
  const rel = inboxPathOf(projectRoot, mdPath);
  const inboxPath = join(projectRoot, INBOX_REL);

  // Tail check — most recent line for the same artifact path.
  if (existsSync(inboxPath)) {
    const lines = readFileSync(inboxPath, "utf8").split("\n").filter((l) => l.trim().length > 0);
    for (let i = lines.length - 1; i >= 0; i--) {
      const parts = lines[i].split(/\s+/);
      if (parts.length < 4) continue;          // unrecognized line — skip, never crash
      const [, , lineState, linePath] = parts;
      if (linePath !== rel) continue;
      if (lineState === state) {
        console.log(`${glyph} ${state} already recorded in ${INBOX_REL} for ${rel} — skipped`);
        return 0;
      }
      break; // most recent event for this artifact differs — a new event, append
    }
  }

  const excerptRaw = (fm.summary ?? "").replace(/\s+/g, " ").trim();
  const excerpt = excerptRaw.length > INBOX_EXCERPT_MAX ? `${excerptRaw.slice(0, INBOX_EXCERPT_MAX - 3)}...` : excerptRaw;
  const ts = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  const line = `${ts} ${glyph} ${state}  ${rel.padEnd(INBOX_PATH_PAD)}  ${fm.skill ?? "?"} · "${excerpt}"`;
  mkdirSync(dirname(inboxPath), { recursive: true });
  appendFileSync(inboxPath, `${line}\n`, "utf8");
  console.log(`${glyph} ${state} recorded in ${INBOX_REL} — the operator will see it on next tail/list`);

  // C4 — ambient signal: on the pending 0→N crossing, fire ONE local OS
  // notification (the void→has-work edge). Coalesced to the standing count, never
  // one ping per artifact. Best-effort: a notify failure never fails the push.
  maybeNotifyPending(projectRoot);
  return 0;
}

const INBOX_STATE_REL = ".forsvn/inbox.state";

// The 0→N notification predicate (pure, exported for the edge tests): notify only
// on the void→has-work crossing — a prior count of 0 and a current count > 0.
// Re-runs that keep the count > 0, or leave it at 0, do not ping (avoids noise).
export function pendingEdge(prev: number, after: number): boolean {
  return prev === 0 && after > 0;
}

// The 0→N edge detector + local notifier. Reads the last-notified pending count
// from .forsvn/inbox.state, recomputes the standing count, and fires a single
// local OS notification only on the crossing. Re-runs that don't change the count
// never reach here (the dedupe path returns before the append). Entirely
// best-effort — wrapped so an ambient-signal failure can never disturb the push.
function maybeNotifyPending(projectRoot: string): void {
  try {
    const after = scanPendingCount(projectRoot);
    if (after === undefined) return; // no artifacts queue around here — say nothing
    const statePath = join(projectRoot, INBOX_STATE_REL);
    let prev = 0;
    if (existsSync(statePath)) {
      const n = parseInt(readFileSync(statePath, "utf8").trim(), 10);
      if (Number.isFinite(n)) prev = n;
    }
    writeFileSync(statePath, String(after), "utf8");
    if (pendingEdge(prev, after)) fireReviewNotification(after);
  } catch {
    // ambient signal is a courtesy; never let it disturb the push
  }
}

// When a review decision empties the queue, clear the notification baseline so a
// later genuine void→has-work push pings again. maybeNotifyPending (the only other
// writer) runs at push time where pending is always ≥1, so it can only ever RAISE
// the baseline; without this reset the prev===0 edge never recurs after the first
// push. Best-effort — a courtesy signal must never disturb a decision.
export function resetInboxBaselineIfEmpty(projectRoot: string): void {
  try {
    if (scanPendingCount(projectRoot) === 0) {
      writeFileSync(join(projectRoot, INBOX_STATE_REL), "0", "utf8");
    }
  } catch {
    // ambient signal is a courtesy; never let it disturb the decision
  }
}

// Local-OS notification via the platform-native CLI (no new dependency). Spawned
// detached and unref'd so it never blocks; errors (no notifier on PATH) are
// swallowed — the inbox row is the durable signal, the ping is the courtesy.
// Message reports the STANDING pending count, never one ping per artifact.
// FORSVN_NO_NOTIFY=1 suppresses the actual spawn (tests + headless/CI contexts).
function fireReviewNotification(count: number): void {
  if (process.env.FORSVN_NO_NOTIFY) return;
  const title = "FORSVN";
  const body = `${count} artifact${count === 1 ? "" : "s"} awaiting review`;
  try {
    if (process.platform === "darwin") {
      const script = `display notification ${JSON.stringify(body)} with title ${JSON.stringify(title)}`;
      spawn("osascript", ["-e", script], { detached: true, stdio: "ignore" }).unref();
    } else if (process.platform === "linux") {
      spawn("notify-send", [title, body], { detached: true, stdio: "ignore" }).unref();
    }
    // Windows: deferred (Phase 2).
  } catch {
    // no notifier on PATH — swallow; the inbox row is the durable signal
  }
}

// Inbox paths read like the flow's journal examples: relative to the artifact
// home (`product/spec.md`) when the artifact lives under .forsvn/artifacts/,
// project-relative otherwise. Posix separators always.
function inboxPathOf(projectRoot: string, mdPath: string): string {
  const rel = relative(projectRoot, mdPath).split(sep).join("/");
  for (const p of ["docs/forsvn/artifacts/", ".forsvn/artifacts/"]) if (rel.startsWith(p)) return rel.slice(p.length);
  return rel;
}

function scanArtifacts(dir: string, projectRoot: string): ArtifactEntry[] {
  const out: ArtifactEntry[] = [];
  const walk = (current: string): void => {
    for (const dirent of readdirSync(current, { withFileTypes: true })) {
      // Skip archived decision records and any dot-dir (e.g. .archive) — the
      // archive holds resolved HTML twins + prior decisions, not live state.
      if (dirent.name.startsWith(".")) continue;
      const abs = join(current, dirent.name);
      if (dirent.isDirectory()) { walk(abs); continue; }
      if (!dirent.isFile() || !dirent.name.endsWith(".md")) continue;
      let fm: Record<string, string> | null;
      try { fm = parseFrontmatter(readFileSync(abs, "utf8")); }
      catch { continue; }
      // Only artifacts that actually carry a decision_state are reviewable.
      if (!fm || !fm.decision_state) continue;
      out.push({
        id: fm.id ?? null,
        path: relative(projectRoot, abs).split(sep).join("/"),
        title: fm.title ?? null,
        skill: fm.skill ?? null,
        stack: fm.stack ?? null,
        date: fm.date ?? null,
        type: fm.type ?? null,
        decision_state: fm.decision_state,
        review_surface: fm.review_surface ?? null,
        summary: fm.summary ?? null,
      });
    }
  };
  walk(dir);
  // Deterministic order: newest date first, then path. Stable for --json
  // consumers and human scanning alike.
  out.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.path.localeCompare(b.path));
  return out;
}

function argValue(args: string[], name: string): string | undefined {
  const eq = args.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const i = args.indexOf(name);
  // Reject any following token that is itself a flag (single OR double dash) —
  // `--root --json` or `--state -x` must not silently consume the next flag as
  // the value. A real path/state value never starts with `-` (use `--root=…`
  // for the pathological case).
  if (i > -1 && i + 1 < args.length && !args[i + 1].startsWith("-")) return args[i + 1];
  return undefined;
}

function findProjectRootFromDir(startDir: string): string {
  // List-mode root finder. Prefer the nearest ancestor with a `.forsvn/` — that
  // is the artifact home we actually want. `.git` is only a fallback: in a
  // nested-repo layout (e.g. a wrapper repo containing the FORSVN project),
  // keying on `.git` would stop at the parent repo and list the wrong project.
  // Read-only, but wrong-silently is worse than erroring, so anchor on the real
  // signal. (Serve mode uses `findProjectRoot` instead — it needs the git root
  // for its dirty-check, so it weights `.git` equally; the divergence is
  // intentional. See the note on `findProjectRoot`.)
  let dir = resolve(startDir);
  let gitFallback: string | null = null;
  for (let i = 0; i < MAX_ROOT_WALK_DEPTH; i++) {
    if (existsSync(join(dir, ".forsvn"))) return dir;
    if (gitFallback === null && existsSync(join(dir, ".git"))) gitFallback = dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return gitFallback ?? resolve(startDir);
}

// --- HTTP handler -------------------------------------------------------

// ── slop suggestion seam (FOR-53 / S4) ──────────────────────────────────────────────
// The deterministic slop scanner (scan-core.mjs) and the finding→card mapper
// (suggestions.ts) live in the sibling forsvn-slop module. BOTH are loaded behind a
// GUARDED dynamic import so this preview stays fully functional (suggestions: []) when
// forsvn-slop is absent — byte-identical to the pre-S4 inert seam. scanText is async; the
// mapper is pure. Cached after first resolve.
type SeamScan = (text: string, opts: { file?: string }) => Promise<{ findings: unknown[] }>;
type SeamMap = (findings: unknown[], body: string) => Suggestion[];
let slopSeam: { scanText: SeamScan; findingsToSuggestions: SeamMap } | null | undefined;

async function loadSlopSeam() {
  if (slopSeam !== undefined) return slopSeam;
  try {
    const [core, mapper] = await Promise.all([
      import("../../forsvn-slop/lib/scan-core.mjs"),
      import("../../forsvn-slop/suggestions"),
    ]);
    slopSeam = {
      scanText: (core as { scanText: SeamScan }).scanText,
      findingsToSuggestions: (mapper as { findingsToSuggestions: SeamMap }).findingsToSuggestions,
    };
  } catch {
    slopSeam = null; // forsvn-slop not installed → inert seam (suggestions stay [])
  }
  return slopSeam;
}

// Compute the suggestion cards for an artifact source. NEVER throws — any scan or mapper
// failure degrades to no cards, never a broken page.
async function computeSuggestions(mdSource: string, file: string): Promise<Suggestion[]> {
  try {
    const seam = await loadSlopSeam();
    if (!seam) return [];
    const { findings } = await seam.scanText(mdSource, { file });
    return seam.findingsToSuggestions(findings, splitDoc(mdSource).body);
  } catch {
    return [];
  }
}

// Append a dismissal row via the sibling forsvn-slop ledger writer, behind a guarded
// dynamic import so the preview never hard-depends on forsvn-slop at module load. The
// writer is itself keyless-safe and non-throwing; this wrapper adds absence-safety.
async function recordDismissal(
  projectRoot: string,
  row: { ts: string; artifact_id: string; ruleId: string; surface: string; scope: "exception" | "rule-wrong" },
): Promise<void> {
  try {
    const { appendDismissal } = await import("../../forsvn-slop/dismissals");
    appendDismissal(projectRoot, row);
  } catch {
    /* forsvn-slop absent or write failed — best-effort, the request is unaffected */
  }
}

// Mutable per-serve session: POST /edit moves the conflict-guard basis to the
// saved bytes and swaps in the re-rendered twin; everything else reads it.
type ServeSession = {
  htmlSource: string;
  mdHash: string;              // sha256 of the .md the human last READ (conflict guard)
  gateWarning: string | null;  // G1 — additive preview-config field (notice-strip data seam)
  pendingCount: number | undefined; // U9 — chrome strip crumb (additive)
  suggestions: Suggestion[];   // S4 — deterministic slop cards; [] when forsvn-slop absent
};

type HandlerArgs = {
  session: ServeSession;
  htmlPath: string;
  mdPath: string;
  token: string;
  projectRoot: string;
};

const state: {
  resolve?: (v: ServeResult) => void;
  idleTimer?: ReturnType<typeof setTimeout>;
  arm?: () => void;   // (re)arms the idle timer; TTY keypresses call it
} = {};

// Exported so the endpoint surface (POST /edit, /done, /dismiss) is unit-testable in
// isolation with synthetic Requests + a temp session, without spinning the full serve
// path (git-clean precondition, browser open, idle wait). See tests/dismiss.test.ts.
export function makeHandler(args: HandlerArgs): (req: Request) => Promise<Response> {
  const { session, htmlPath, mdPath, token, projectRoot } = args;
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
      const injected = injectPreviewConfig(session.htmlSource, {
        token,
        port: url.port,
        endpoint: `${url.origin}/done`,
        mdPath: relative(projectRoot, mdPath),
        gate_warning: session.gateWarning,
        // U9 additive fields: the chrome strip's pending count, and the agent
        // suggestion seam — populated by the S4 deterministic slop mapper
        // (computeSuggestions); [] when forsvn-slop is absent. See
        // references/review-surface-design.md § suggestions.
        ...(session.pendingCount !== undefined ? { pending_count: session.pendingCount } : {}),
        suggestions: session.suggestions,
        // C1: the reason-chip enum, sourced from lib/decision-reason.ts so the
        // browser chrome builds chips without a second hardcoded copy of the list.
        decision_reasons: DECISION_REASONS,
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
      // asset by basename (tokens.css / chrome.css / chrome.js / base.html /
      // fonts.css) or a self-hosted font (fonts/<name>.woff2), serve it from
      // the CLI's install dir so skill-emitted previews like
      // `<userProject>/brand/BRAND.html` with `<link href="./tokens.css">`
      // resolve cleanly without forcing every emitter to co-locate assets.
      const base = basename(rel);
      const fontMatch = BUNDLED_FONT_RE.exec(rel);
      const bundled = fontMatch
        ? join(BUNDLED_CHROME_DIR, "fonts", fontMatch[1])
        : BUNDLED_CHROME_ASSETS.has(base)
          ? join(BUNDLED_CHROME_DIR, base)
          : null;
      if (bundled && existsSync(bundled) && !statSync(bundled).isDirectory()) {
        const body = readFileSync(bundled);
        return new Response(body, { headers: { ...noStore, "Content-Type": guessMime(bundled) } });
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
        // The POST-accepted set is exactly approved/denied/suggested —
        // `not_required` and `pending` exist in the schema enum but are never
        // valid decisions to record.
        return jsonResp(400, { error: `decision_state must be ${VALID_DECISIONS.join(" | ")}` }, noStore);
      }

      // Conflict guard (flow-recommended /done re-hash): if the artifact's
      // bytes changed on disk between render and decide, refuse — the human
      // approved what they READ (the session basis, which a workbench Edit
      // save legitimately advances), not what is now on disk. Nothing is
      // written, decision_state stays pending, and the server stays up so a
      // re-serve can review the current file.
      let currentHash: string | null = null;
      try {
        currentHash = createHash("sha256").update(readFileSync(mdPath, "utf8")).digest("hex");
      } catch {
        currentHash = null; // unreadable/deleted counts as changed
      }
      if (currentHash !== session.mdHash) {
        return jsonResp(409, { error: "file changed on disk since this form was rendered — nothing was written; re-serve to review the current file" }, noStore);
      }
      const parsed: Payload = {
        token,
        decision_state: raw.decision_state as Decision,
      };
      // C1 reason chip: valid only on a non-approve decision and only when it
      // matches the enum. A reason on an approve, or an unknown value, is a 400 —
      // nothing written. Absent/empty on a non-approve is allowed (see guardrails).
      if (raw.decision_reason !== undefined && raw.decision_reason !== "") {
        if (typeof raw.decision_reason !== "string" || !isDecisionReason(raw.decision_reason)) {
          return jsonResp(400, { error: `decision_reason must be one of ${DECISION_REASONS.join(" | ")}` }, noStore);
        }
        if (raw.decision_state === "approved") {
          return jsonResp(400, { error: "decision_reason is not valid on an approved decision" }, noStore);
        }
        parsed.decision_reason = raw.decision_reason;
      }
      if (typeof raw.comments === "string" && raw.comments.trim().length > 0) {
        parsed.comments = raw.comments.trim();
      }
      if (typeof raw.variant === "string" && raw.variant.trim().length > 0) {
        parsed.variant = raw.variant.trim();
      }
      // U9 — annotations ride the decision additively. Strictly validated:
      // a malformed array is a 400 (nothing written), never silently dropped.
      if (raw.annotations !== undefined) {
        const parsedAnnotations = parseAnnotations(raw.annotations);
        if (parsedAnnotations === null) {
          return jsonResp(400, { error: `annotations must be an array of { kind: marker|comment, quote, body? } (max ${ANNOTATIONS_MAX})` }, noStore);
        }
        if (parsedAnnotations.length > 0) parsed.annotations = parsedAnnotations;
      }

      // G5 in the webapp confirmation: name the next pending artifact in the
      // 200 body (additive), excluding the one being decided right now —
      // title + skill + stack + date only, never a path.
      const np = scanNextPending(projectRoot, relative(projectRoot, mdPath).split(sep).join("/"));
      const nextPendingLite = np === undefined
        ? undefined
        : np === null
          ? null
          : { title: np.title, skill: np.skill, stack: np.stack, date: np.date };

      // Claim the slot now so any concurrent POST returns 409 above. Defer the
      // resolve so the browser sees the 200 before server.stop() fires.
      const resolveFn = state.resolve;
      state.resolve = undefined;
      queueMicrotask(() => {
        if (state.idleTimer) clearTimeout(state.idleTimer);
        resolveFn({ ok: true, payload: parsed });
      });
      return jsonResp(200, {
        ok: true,
        ...(nextPendingLite !== undefined ? { next_pending: nextPendingLite } : {}),
      }, noStore);
    }

    // U9 — POST /edit: the workbench's Edit mode saves the MARKDOWN BODY back
    // to the artifact. Same security discipline as /done: localhost bind,
    // constant-time token check, on-disk re-hash 409 conflict guard, atomic
    // byte-fidelity write (lib/collab.ts atomicWrite — temp + same-dir rename).
    // The frontmatter block is preserved verbatim; only the body is replaced.
    // Human-only by construction; this endpoint never records a decision.
    if (req.method === "POST" && url.pathname === "/edit") {
      let body: unknown;
      try { body = await req.json(); }
      catch { return jsonResp(400, { error: "invalid JSON body" }, noStore); }
      const raw = body as Record<string, unknown>;
      if (typeof raw.token !== "string" || !constantTimeEqual(raw.token, token)) {
        return jsonResp(403, { error: "bad token" }, noStore);
      }
      if (typeof raw.body_md !== "string") {
        return jsonResp(400, { error: "body_md (string) is required — the Markdown body to save" }, noStore);
      }
      if (raw.body_md.length > EDIT_BODY_MAX_BYTES) {
        return jsonResp(400, { error: `body_md exceeds ${EDIT_BODY_MAX_BYTES} bytes` }, noStore);
      }

      // Conflict guard: the edit applies on top of the bytes the human read.
      let currentSource: string;
      try {
        currentSource = readFileSync(mdPath, "utf8");
      } catch {
        return jsonResp(409, { error: "file changed on disk since this form was rendered — nothing was written; re-serve to review the current file" }, noStore);
      }
      const currentHash = createHash("sha256").update(currentSource).digest("hex");
      if (currentHash !== session.mdHash) {
        return jsonResp(409, { error: "file changed on disk since this form was rendered — nothing was written; re-serve to review the current file" }, noStore);
      }

      // Splice: frontmatter block verbatim + the new body, byte-for-byte.
      const fmMatch = currentSource.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
      const fmBlock = fmMatch ? fmMatch[0] : "";
      const nextSource = fmBlock + raw.body_md;
      try {
        atomicWrite(mdPath, nextSource);
      } catch (e) {
        return jsonResp(500, { error: `could not write the artifact: ${e instanceof Error ? e.message : String(e)}` }, noStore);
      }

      // Move the session basis to the saved bytes + re-render the twin so a
      // reload shows exactly what is now on disk.
      session.mdHash = createHash("sha256").update(nextSource).digest("hex");
      session.gateWarning = reviewGateWarning(nextSource, basename(mdPath));
      try {
        renderArtifactToHtml(mdPath, BUNDLED_CHROME_DIR, relative(projectRoot, mdPath));
        session.htmlSource = readFileSync(htmlPath, "utf8");
      } catch {
        // The save landed; a re-render failure only degrades the reload.
      }
      // Recompute the slop cards against the saved bytes so an accepted card (whose match
      // is now gone) vanishes on reload, and any newly-introduced slop surfaces.
      session.suggestions = await computeSuggestions(nextSource, relative(projectRoot, mdPath));
      if (state.arm) state.arm(); // editing is activity — re-arm the idle timer
      return jsonResp(200, { ok: true, md_hash: session.mdHash }, noStore);
    }

    // S4 — POST /dismiss: the human dismissed a suggestion card. Appends ONE
    // override-ledger row (the FOR-56 >=3-dismissals signal) and does nothing else.
    // Security mirrors /edit (localhost bind, constant-time token), but it is SIMPLER:
    // no /done one-shot guard, no conflict hash, no artifact write. The artifact_id is
    // read SERVER-SIDE from the on-disk frontmatter (config.artifact_id is not injected
    // and a client value would be spoofable). Never throws — a dismissal must never fail
    // the page; appendDismissal is itself keyless-safe and non-throwing.
    if (req.method === "POST" && url.pathname === "/dismiss") {
      let body: unknown;
      try { body = await req.json(); }
      catch { return jsonResp(400, { error: "invalid JSON body" }, noStore); }
      const raw = body as Record<string, unknown>;
      if (typeof raw.token !== "string" || !constantTimeEqual(raw.token, token)) {
        return jsonResp(403, { error: "bad token" }, noStore);
      }
      if (typeof raw.ruleId !== "string" || !raw.ruleId.trim()) {
        return jsonResp(400, { error: "ruleId (non-empty string) is required" }, noStore);
      }
      // scope enum SoT: forsvn-slop/lib/dismissal-scope.ts (DISMISSAL_SCOPES). Restated minimally
      // here (the only value that COUNTS toward rule revision is 'rule-wrong'; a missing/invalid
      // scope fail-safes to 'exception') so the preview never load-depends on forsvn-slop. FOR-56.
      const scope = raw.scope === "rule-wrong" ? "rule-wrong" : "exception";
      let artifactId = "";
      try { artifactId = parseFrontmatter(readFileSync(mdPath, "utf8"))?.id ?? ""; }
      catch { /* unreadable frontmatter → empty id; appendDismissal then skips the row */ }
      await recordDismissal(projectRoot, {
        ts: verdictTs(),
        artifact_id: artifactId,
        ruleId: raw.ruleId.trim(),
        surface: "web",
        scope,
      });
      if (state.arm) state.arm(); // dismissing is activity — re-arm the idle timer
      return jsonResp(200, { ok: true }, noStore);
    }

    return new Response("not found", { status: 404, headers: noStore });
  };
}

const EDIT_BODY_MAX_BYTES = 2 * 1024 * 1024;

// Validate the additive `annotations` array. Returns null when the shape is
// invalid (caller 400s); trims + caps individual fields.
function parseAnnotations(raw: unknown): Annotation[] | null {
  if (!Array.isArray(raw) || raw.length > ANNOTATIONS_MAX) return null;
  const out: Annotation[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const a = item as Record<string, unknown>;
    if (a.kind !== "marker" && a.kind !== "comment") return null;
    if (typeof a.quote !== "string" || a.quote.trim().length === 0) return null;
    const ann: Annotation = {
      kind: a.kind,
      quote: a.quote.trim().slice(0, ANNOTATION_QUOTE_MAX),
    };
    if (a.body !== undefined) {
      if (typeof a.body !== "string") return null;
      const b = a.body.trim().slice(0, ANNOTATION_BODY_MAX);
      if (b.length > 0) ann.body = b;
    }
    out.push(ann);
  }
  return out;
}

// --- TTY prompt wiring (P-04 headless review) -----------------------------
// The pure state machine lives in lib/tty-prompt.ts; this only binds it to
// raw stdin. It never calls the write path: a decision/quit resolves the
// same single-shot promise as POST /done via the callbacks, so the existing
// post-stop applyDecision/archive/manifest-sync sequence runs exactly once.

type TtyPromptOpts = {
  tier: Tier;
  meta: { name: string; skill: string; state: string; excerpt?: string };
  activity: () => void;
  decide: (decision_state: Decision, comment?: string, reason?: DecisionReason) => void;
  quit: () => void;
};

function startTtyPrompt(opts: TtyPromptOpts): () => void {
  const stdin = process.stdin as NodeJS.ReadStream & { setRawMode?: (b: boolean) => void };
  for (const line of promptIntro(opts.meta, opts.tier, process.stdout.columns ?? 80)) {
    console.log(line);
  }

  let machine = initialState();
  let settled = false;
  const onData = (chunk: Buffer): void => {
    opts.activity(); // any keypress resets the idle timer
    for (const key of chunk.toString("utf8")) {
      if (settled) return;
      const r = step(machine, key, opts.tier);
      machine = r.state;
      if (r.write) process.stdout.write(r.write);
      if (r.outcome) {
        settled = true;
        if (r.outcome.kind === "quit") opts.quit();
        else opts.decide(r.outcome.decision_state, r.outcome.comment, r.outcome.reason);
        return;
      }
    }
  };

  stdin.setRawMode?.(true);
  stdin.resume();
  stdin.on("data", onData);

  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    stdin.off("data", onData);
    try { stdin.setRawMode?.(false); } catch { /* stdin may already be gone */ }
    stdin.pause();
  };
}

// --- Helpers ------------------------------------------------------------

function injectPreviewConfig(html: string, config: { token: string; port: string | number; endpoint: string; mdPath: string; gate_warning: string | null; pending_count?: number; suggestions?: unknown[]; decision_reasons?: readonly string[] }): string {
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

function applyDecision(source: string, updates: Record<string, string>, comments: string | undefined, annotations?: Annotation[]): string {
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
  if (comments || (annotations && annotations.length > 0)) {
    const block = renderCommentBlock(comments, updates.reviewed_at, updates.reviewer, annotations);
    rest = appendCommentBlock(rest, block);
  }
  return openFence + updatedLines.join("\n") + closeFence + afterFence + rest;
}

function renderCommentBlock(comments: string | undefined, reviewedAt: string, reviewer: string, annotations?: Annotation[]): string {
  let out = `\n\n## Reviewer notes\n_${reviewer} · ${reviewedAt}_\n`;
  if (comments) {
    const lines = comments.split(/\r?\n/).map((l) => l.trimEnd());
    while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
    out += `\n${lines.map((l) => `> ${l}`).join("\n")}\n`;
  }
  // U9 — Marker/Comment annotations persist with the reviewer notes so the
  // producing agent reads them back from the same record as the decision.
  if (annotations && annotations.length > 0) {
    out += `\n### Annotations\n`;
    for (const a of annotations) {
      const quote = a.quote.replace(/\s+/g, " ").trim();
      out += a.kind === "comment" && a.body
        ? `- **comment** — "${quote}": ${a.body.replace(/\s+/g, " ").trim()}\n`
        : `- **${a.kind}** — "${quote}"\n`;
    }
  }
  return out;
}

function appendCommentBlock(body: string, block: string): string {
  // If a "## Reviewer notes" already exists, append a separator + new block
  // beneath it; otherwise just append at the end.
  if (/^## Reviewer notes\b/m.test(body)) return body.replace(/\s*$/, "") + "\n" + block;
  return body.replace(/\s*$/, "") + block;
}

function archiveHtml(projectRoot: string, htmlPath: string): string {
  // Co-home the archived twin with the artifact it belongs to: an artifact still
  // under the legacy .forsvn/ home archives under .forsvn/, not the new home, so a
  // mid-migration project's audit trail doesn't split across homes. resolveArtifactsDir's
  // global preference is only the fallback when htmlPath isn't under a recognized home.
  const legacyArtifacts = join(projectRoot, ".forsvn", "artifacts");
  const movedArtifacts = join(projectRoot, "docs", "forsvn", "artifacts");
  const home = htmlPath.startsWith(legacyArtifacts + sep)
    ? legacyArtifacts
    : htmlPath.startsWith(movedArtifacts + sep)
      ? movedArtifacts
      : resolveArtifactsDir(projectRoot);
  const archiveDir = join(home, ".archive");
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

// Serve-mode root finder. Deliberately distinct from `findProjectRootFromDir`
// (the list-mode resolver): serve needs the *git* root because it runs the
// dirty-tree check (gitIsDirty) and serves assets relative to it, so `.git`
// counts equally with `.forsvn` and it starts from the artifact FILE's dir. The
// list resolver instead prefers `.forsvn` (the artifact home) and ignores git.
// The two intentionally differ; in the supported single-root layout (root has
// both) they agree. Keep them in sync only on the shared MAX_ROOT_WALK_DEPTH.
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
  if (path.endsWith(".woff2")) return "font/woff2";
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

// RefusalLine to stderr — reason + exit code + recovery hint, never silent.
// The tier resolves against stderr independently of stdout, so a redirected
// log never receives escape bytes even while stdout is a live TTY.
function refuse(variant: RefusalVariant, reason: string, recovery: string): void {
  console.error(refusalLine(variant, reason, recovery, resolveTier(process.stderr)));
}

// --- Run ----------------------------------------------------------------

if (import.meta.main) {
  main().then((code) => { process.exit(code); }).catch((e) => {
    // One actionable line by default; full stack only under FORSVN_DEBUG. A raw
    // trace on an installed user's terminal reads as "the plugin is broken"
    // rather than "something went wrong rendering/serving this one artifact".
    const msg = e instanceof Error ? e.message : String(e);
    err(`could not preview this artifact: ${msg}`);
    err(`(re-run with FORSVN_DEBUG=1 for the full stack)`);
    if (process.env.FORSVN_DEBUG && e instanceof Error && e.stack) console.error(e.stack);
    process.exit(2);
  });
}
