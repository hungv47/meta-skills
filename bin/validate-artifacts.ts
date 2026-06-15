#!/usr/bin/env bun
// validate-artifacts — strict frontmatter validation for the `.forsvn/` home.
//
// Enforces the v3 artifact contract (references/artifact-contract-template.md)
// across all three layers — canonical/ artifacts/ experience/ — each by stack:
//   required (all):  skill, version (integer), date (YYYY-MM-DD), status (enum)
//   v2 mandatory:    stack (enum meta|research|marketing|product), review_surface (enum)
//   v3 instruction:  type (enum), keywords (non-empty list), id (non-empty slug)
//   no legacy `review_state` (renamed to decision_state in v2); `mkt` stack is rejected (use `marketing`)
//   decision_state, if present, must be a valid enum value
//
// Modes:
//   (default)  warn-only — prints issues, exits 0 (advisory)
//   --strict   fails the gate — exits 1 if any artifact is non-conforming
//
// Usage:
//   bun skills/bin/validate-artifacts.ts --strict
//   bun skills/bin/validate-artifacts.ts --strict --root /path/to/project
//
// The layered path grammar itself is checked by lint-artifact-paths.ts; this
// script validates the *contents* of each artifact's frontmatter.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { resolveTier, hintLine } from "../forsvn-preview/lib/mono";
import { ARTIFACT_HOME, STATE_HOME, HOME_RE } from "./lib/path-parser";

const STRICT = process.argv.includes("--strict");
const ROOT = (() => {
  const i = process.argv.indexOf("--root");
  if (i > -1 && process.argv[i + 1]) return process.argv[i + 1];
  return process.cwd();
})();
// Cohort: the three artifact-contract layers only, under both homes (new
// ARTIFACT_HOME + legacy STATE_HOME) so validation spans the state-root
// migration. `.forsvn/performance/` is deliberately exempt — operator-fed
// channel-performance data (TSV snapshots + publish ledger), not artifacts;
// see references/performance-data.md.
const LAYER_DIRS = [
  `${STATE_HOME}/canonical`, `${STATE_HOME}/artifacts`, `${STATE_HOME}/experience`,
  `${ARTIFACT_HOME}/canonical`, `${ARTIFACT_HOME}/artifacts`, `${ARTIFACT_HOME}/experience`,
];
const INTERNAL_ARTIFACT_PATH_RE = new RegExp(`^${HOME_RE}/(canonical|artifacts|experience)/`);
const ARTIFACTS_LAYER_PREFIXES = [`${STATE_HOME}/artifacts/`, `${ARTIFACT_HOME}/artifacts/`];

const STATUS = new Set(["done", "done_with_concerns", "blocked", "needs_context"]);
const STACK = new Set(["meta", "research", "marketing", "product"]);
const SURFACE = new Set(["html", "md", "none"]);
const DECISION = new Set(["pending", "approved", "denied", "suggested", "not_required"]);
// review_tool — how a gated artifact is reviewed. `proof` (collaborative-doc
// sub-type, ADR 2026-06-08) joins the original three. A `proof` artifact MUST
// carry a `proof_slug` binding to its working doc.
const REVIEW_TOOL = new Set(["roughdraft", "inline", "none", "proof"]);
// collab_state — lifecycle of a Proof-backed collaborative doc.
const COLLAB_STATE = new Set(["drafting", "in_review", "exported"]);
const TYPE = new Set([
  "canonical", "plan", "spec", "decision", "experience", "pipeline", "snapshot",
  "review", "brief", "strategy", "execution", "evaluation", "loop", "learning", "registry",
]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}/;
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

const existingLayers = LAYER_DIRS.map((d) => join(ROOT, d)).filter((d) => existsSync(d));
if (existingLayers.length === 0) {
  console.log("validate-artifacts: no {docs/forsvn,.forsvn}/{canonical,artifacts,experience}/ layers; nothing to validate.");
  process.exit(0);
}

type Issue = { file: string; problems: string[] };
type ArtifactRecord = { rel: string; fm: string; id: string | null; problems: string[]; warnings: string[] };
const EDGE_FIELDS = ["upstream", "downstream", "supersedes", "superseded_by", "references"];
const records: ArtifactRecord[] = [];
let checked = 0;

for (const dir of existingLayers) walk(dir);

// --- Phase 1 graph integrity (cross-artifact) -------------------------------
// Runs after every artifact is collected, so it can see the full id + path set.
const knownPaths = new Set(records.map((r) => r.rel));
const idOwners = new Map<string, string[]>();
for (const r of records) {
  if (r.id) idOwners.set(r.id, [...(idOwners.get(r.id) ?? []), r.rel]);
}
// id uniqueness — a stable id resolves to exactly one artifact, else id→path breaks.
for (const r of records) {
  if (r.id && (idOwners.get(r.id)?.length ?? 0) > 1) {
    const others = idOwners.get(r.id)!.filter((p) => p !== r.rel);
    r.problems.push(`duplicate \`id: ${r.id}\` — also used by ${others.join(", ")}. ids must be unique.`);
  }
}
// internal edge integrity + id-authoring enforcement. An edge token that names
// an internal `.forsvn/{canonical,artifacts,experience}/` artifact BY PATH is
// rejected two ways, because path-authored internal edges silently break on a
// move (the manifest resolves paths at build time only — a moved target leaves
// the referrer's path string dangling, and the edge drops with no warning):
//   (a) resolves to an existing artifact → must be authored by that artifact's
//       stable `id` instead (move-safe; the documented contract — see
//       artifact-contract-template § "Graph edges are authored by id").
//   (b) does not resolve → broken reference (moved/renamed/typo).
// External refs (ids, skill names, ../_biz-ops, skills/…, archived paths) are
// kept literal and never flagged. `_dev/migrate-edges-to-id.ts` converts (a).
const pathToId = new Map<string, string>();
for (const r of records) {
  if (r.id) pathToId.set(r.rel, r.id);
}
for (const r of records) {
  for (const key of EDGE_FIELDS) {
    for (const tok of edgeTokens(r.fm, key)) {
      if (!looksLikeInternalArtifactPath(tok)) continue;
      if (knownPaths.has(tok)) {
        const targetId = pathToId.get(tok);
        const hint = targetId ? `author it by its stable id \`${targetId}\`` : "give the target a stable \`id\` and author the edge by id";
        r.problems.push(`\`${key}\` → "${tok}" is a path-authored internal edge (breaks on a move) — ${hint}. Run \`bun _dev/migrate-edges-to-id.ts\`.`);
      } else {
        r.problems.push(`\`${key}\` → "${tok}" is an internal artifact path that does not resolve (moved/renamed? author by a stable \`id\`)`);
      }
    }
  }
}

const issues: Issue[] = records.filter((r) => r.problems.length).map((r) => ({ file: r.rel, problems: r.problems }));

function walk(dir: string): void {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name);
    const rel = relative(ROOT, abs).split("\\").join("/");
    if (rel.includes("/.archive/")) continue;
    if (e.isDirectory()) {
      walk(abs);
      continue;
    }
    if (!e.isFile() || !e.name.endsWith(".md")) continue;
    if (e.name.toLowerCase() === "readme.md") continue;
    validate(abs, rel);
  }
}

function edgeTokens(fm: string, key: string): string[] {
  const raw = field(fm, key);
  if (!raw) return [];
  const inner = (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'")) ? raw.slice(1, -1) : raw;
  return inner.split(",").map((s) => s.trim()).filter(Boolean);
}

function looksLikeInternalArtifactPath(tok: string): boolean {
  return INTERNAL_ARTIFACT_PATH_RE.test(tok) && !tok.includes("/.archive/");
}

function field(fm: string, key: string): string | null {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, "").trim();
}

function listLen(fm: string, key: string): number | null {
  const raw = field(fm, key);
  if (raw === null) return null;
  if (raw.startsWith("[") && raw.endsWith("]")) {
    const body = raw.slice(1, -1).trim();
    if (body.length === 0) return 0;
    return body.split(",").map((s) => s.trim()).filter(Boolean).length;
  }
  // tolerate comma-separated scalar form
  return raw.split(",").map((s) => s.trim()).filter(Boolean).length;
}

function validate(abs: string, rel: string): void {
  checked++;
  const txt = readFileSync(abs, "utf-8");
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  const problems: string[] = [];
  const warnings: string[] = [];
  if (!m) {
    problems.push("no frontmatter block");
    records.push({ rel, fm: "", id: null, problems, warnings });
    return;
  }
  const fm = m[1];

  // required (all)
  if (!field(fm, "skill")) problems.push("missing `skill`");
  const version = field(fm, "version");
  if (version === null) problems.push("missing `version`");
  else if (!/^\d+$/.test(version)) problems.push(`\`version\` must be an integer (got "${version}")`);
  const date = field(fm, "date");
  if (date === null) problems.push("missing `date`");
  else if (!DATE_RE.test(date)) problems.push(`\`date\` must be YYYY-MM-DD (got "${date}")`);
  const status = field(fm, "status");
  if (status === null) problems.push("missing `status`");
  else if (!STATUS.has(status)) problems.push(`\`status\` invalid: "${status}" (expected ${[...STATUS].join(" | ")})`);

  // v2 mandatory
  const stack = field(fm, "stack");
  if (stack === null) problems.push("missing `stack` (v2 mandatory)");
  else if (stack === "mkt") problems.push("`stack: mkt` is retired — use `marketing`");
  else if (!STACK.has(stack)) problems.push(`\`stack\` invalid: "${stack}" (expected ${[...STACK].join(" | ")})`);
  const surface = field(fm, "review_surface");
  if (surface === null) problems.push("missing `review_surface` (v2 mandatory)");
  else if (!SURFACE.has(surface)) problems.push(`\`review_surface\` invalid: "${surface}" (expected ${[...SURFACE].join(" | ")})`);

  // v3 instruction core
  const type = field(fm, "type");
  if (type === null) problems.push("missing `type` (v3 instruction core)");
  else if (!TYPE.has(type)) problems.push(`\`type\` invalid: "${type}" (expected ${[...TYPE].join(" | ")})`);
  const id = field(fm, "id");
  if (id === null || id === "") problems.push("missing `id` (v3 stable identity)");
  else if (!ID_RE.test(id)) problems.push(`\`id\` must be a kebab slug (got "${id}")`);
  const kw = listLen(fm, "keywords");
  if (kw === null) problems.push("missing `keywords` (v3 instruction core)");
  else if (kw === 0) problems.push("`keywords` must be a non-empty list");

  // legacy field must be gone
  if (/^review_state:/m.test(fm)) problems.push("legacy `review_state` present — rename to `decision_state`");

  // decision_state enum (optional field)
  const decision = field(fm, "decision_state");
  if (decision !== null && decision !== "" && !DECISION.has(decision))
    problems.push(`\`decision_state\` invalid: "${decision}" (expected ${[...DECISION].join(" | ")})`);

  // Silent-skip hazard (spec P-09): an artifacts-layer file with NO
  // decision_state is invisible to the review scanner — it never queues, and
  // nobody is told. Warn-only by design: experience/ and canonical/ docs
  // legitimately carry no decision_state, and several live artifacts-layer
  // records predate the field, so this must never count toward --strict's
  // exit-1 set. Scoped to .forsvn/artifacts/ only.
  if ((decision === null || decision === "") && ARTIFACTS_LAYER_PREFIXES.some((p) => rel.startsWith(p)))
    warnings.push("missing `decision_state` — the review scanner will silently skip this artifact; emit `decision_state: pending` to make it reviewable");

  // review_tool enum (optional field)
  const reviewTool = field(fm, "review_tool");
  if (reviewTool !== null && reviewTool !== "" && !REVIEW_TOOL.has(reviewTool))
    problems.push(`\`review_tool\` invalid: "${reviewTool}" (expected ${[...REVIEW_TOOL].join(" | ")})`);

  // collaborative-doc sub-type (ADR 2026-06-08): collab_state enum + the
  // proof_slug binding is required whenever the doc is Proof-backed, else the
  // manifest can't resolve the working doc and the MCP proxy has nothing to hit.
  const collabState = field(fm, "collab_state");
  if (collabState !== null && collabState !== "" && !COLLAB_STATE.has(collabState))
    problems.push(`\`collab_state\` invalid: "${collabState}" (expected ${[...COLLAB_STATE].join(" | ")})`);
  if (reviewTool === "proof") {
    const slug = field(fm, "proof_slug");
    if (slug === null || slug === "") problems.push("`review_tool: proof` requires a `proof_slug` binding");
  }

  records.push({ rel, fm, id, problems, warnings });
}

// Findings render per spec P-09: one finding per line, path-first. Warn-only
// findings carry the ⚠ glyph and never affect the exit code (tier-resolved
// against the destination stream; piped consumers get plain ASCII).
const errTier = resolveTier(process.stderr);
const warnGlyph = errTier === 2 ? "⚠" : "warn:";
const warned = records.filter((r) => r.warnings.length > 0);

function printWarnings(): void {
  for (const r of warned) {
    for (const w of r.warnings) console.error(`  ${warnGlyph} ${r.rel} ${w}`);
  }
}

if (issues.length === 0) {
  printWarnings();
  console.log(`[validate-artifacts] OK — ${checked} artifact(s) conform to the v3 contract.`);
  process.exit(0);
}

const tag = STRICT ? "FAIL" : "WARN";
console.error(`[validate-artifacts] ${tag} — ${issues.length}/${checked} artifact(s) non-conforming:`);
for (const i of issues) {
  for (const p of i.problems) console.error(`  ${i.file} ${p}`);
}
printWarnings();
console.error(hintLine("fix frontmatter · not reviewable until valid", errTier));
process.exit(STRICT ? 1 : 0);
