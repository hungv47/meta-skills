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

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, statSync, realpathSync, copyFileSync, unlinkSync, readdirSync } from "node:fs";
import { join, dirname, basename, resolve, relative, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { renderArtifactToHtml } from "../lib/render";
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
  DECISION_STATES,
  type DecisionState,
  type RefusalVariant,
  type Tier,
} from "../lib/mono";
import { initialState, step, promptIntro } from "../lib/tty-prompt";

const DECISION_ENUM = new Set<string>(DECISION_STATES);

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
const BUNDLED_CHROME_DIR = join(CLI_INSTALL_ROOT, "assets", "_html");
const BUNDLED_CHROME_ASSETS = new Set(["tokens.css", "chrome.css", "chrome.js", "base.html"]);

const VALID_DECISIONS = ["approved", "denied", "suggested"] as const;
type Decision = typeof VALID_DECISIONS[number];

type Payload = {
  token: string;
  decision_state: Decision;
  comments?: string;
  variant?: string;
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

  const flagJson = args.includes("--json");
  const flagNoOpen = args.includes("--no-open");
  // Headless review is OPT-IN via the explicit flag — never inferred from
  // piped stdio or browser-open failure (the e2e suite spawns with piped
  // stdio and --no-open and must keep hitting the plain serve path).
  // Auto-detection heuristics are a follow-up.
  const flagHeadless = args.includes("--headless");
  const positional = args.filter((a) => !a.startsWith("--"));

  if (positional.length !== 1) {
    err(`usage: forsvn-preview <path-to-artifact.md|.html> [--no-open] [--headless] [--json]`);
    err(`       forsvn-preview list [--root <dir>] [--state pending|decided|all] [--json]`);
    err(`       forsvn-preview attach <artifact.md> <file-or-url> [--picked] [--root <dir>] [--json]`);
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

  const htmlSource = readFileSync(htmlPath, "utf8");
  const token = randomBytes(TOKEN_BYTES).toString("hex");
  // Conflict-guard basis: the decision applies to the bytes the human READ.
  const mdHash = createHash("sha256").update(mdSource).digest("hex");

  let server: ReturnType<typeof Bun.serve>;
  try {
    server = Bun.serve({
      hostname: HOST,
      port: 0,
      fetch: makeHandler({ htmlSource, htmlPath, mdPath, token, projectRoot, mdHash }),
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
          decide: (decision_state, comment) => {
            const r = claimSlot();
            if (!r) return;
            r({ ok: true, payload: { token, decision_state, ...(comment ? { comments: comment } : {}) } });
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

  // Graceful stop — let any in-flight response (including the deferred /done
  // resolve) drain before the socket closes.
  await server.stop();

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
  const updated = applyDecision(mdSource, decisionUpdates, result.payload.comments);
  writeFileSync(mdPath, updated, "utf8");

  const archivedRel = archiveHtml(projectRoot, htmlPath);

  runManifestSync(projectRoot);

  if (flagJson) {
    // ResultLine(json): the decision object is the FINAL stdout line — nothing
    // prints after it (manifest-sync stdio is captured above).
    console.log(JSON.stringify({
      ok: true,
      decision_state: result.payload.decision_state,
      reviewed_at: today,
      md: relative(projectRoot, mdPath),
      archived: archivedRel,
      comments: result.payload.comments ?? null,
      variant: result.payload.variant ?? null,
      asset_picked: result.payload.variant ?? null,
    }));
  } else {
    // ResultLine(human) — one line closes the loop; the frontmatter rewrite
    // and archive it reports are the single statement of what happened.
    console.log("");
    console.log(resultLine("human", result.payload.decision_state, outTier));
  }
  return 0;
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
  const artifactsDir = join(projectRoot, ".forsvn", "artifacts");
  if (!existsSync(artifactsDir) || !statSync(artifactsDir).isDirectory()) {
    refuse("precondition", `no .forsvn/artifacts under ${projectRoot}`, "run inside a FORSVN project or pass --root <dir>");
    return REFUSAL_EXIT.precondition;
  }

  const entries = scanArtifacts(artifactsDir, projectRoot);
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

type HandlerArgs = {
  htmlSource: string;
  htmlPath: string;
  mdPath: string;
  token: string;
  projectRoot: string;
  mdHash: string;   // sha256 of the .md at render time (conflict guard)
};

const state: {
  resolve?: (v: ServeResult) => void;
  idleTimer?: ReturnType<typeof setTimeout>;
  arm?: () => void;   // (re)arms the idle timer; TTY keypresses call it
} = {};

function makeHandler(args: HandlerArgs): (req: Request) => Promise<Response> {
  const { htmlSource, htmlPath, mdPath, token, projectRoot, mdHash } = args;
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
        // The POST-accepted set is exactly approved/denied/suggested —
        // `not_required` and `pending` exist in the schema enum but are never
        // valid decisions to record.
        return jsonResp(400, { error: `decision_state must be ${VALID_DECISIONS.join(" | ")}` }, noStore);
      }

      // Conflict guard (flow-recommended /done re-hash): if the artifact's
      // bytes changed on disk between render and decide, refuse — the human
      // approved what they READ, not what is now on disk. Nothing is written,
      // decision_state stays pending, and the server stays up so a re-serve
      // can review the current file.
      let currentHash: string | null = null;
      try {
        currentHash = createHash("sha256").update(readFileSync(mdPath, "utf8")).digest("hex");
      } catch {
        currentHash = null; // unreadable/deleted counts as changed
      }
      if (currentHash !== mdHash) {
        return jsonResp(409, { error: "file changed on disk since this form was rendered — nothing was written; re-serve to review the current file" }, noStore);
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

// --- TTY prompt wiring (P-04 headless review) -----------------------------
// The pure state machine lives in lib/tty-prompt.ts; this only binds it to
// raw stdin. It never calls the write path: a decision/quit resolves the
// same single-shot promise as POST /done via the callbacks, so the existing
// post-stop applyDecision/archive/manifest-sync sequence runs exactly once.

type TtyPromptOpts = {
  tier: Tier;
  meta: { name: string; skill: string; state: string; excerpt?: string };
  activity: () => void;
  decide: (decision_state: Decision, comment?: string) => void;
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
        else opts.decide(r.outcome.decision_state, r.outcome.comment);
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
