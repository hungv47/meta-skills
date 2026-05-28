#!/usr/bin/env bun
// validate-artifacts — strict frontmatter validation for `.forsvn/artifacts/`.
//
// Enforces the v2 artifact contract (references/artifact-contract-template.md):
//   required:  skill, version (integer), date (YYYY-MM-DD), status (enum)
//   v2 mandatory: stack (enum), review_surface (enum)
//   no legacy `review_state` field (renamed to decision_state in v2)
//   decision_state, if present, must be a valid enum value
//
// Modes:
//   (default)  warn-only — prints issues, exits 0 (advisory)
//   --strict   fails the gate — exits 1 if any artifact is non-conforming
//
// Usage:
//   bun scripts/validate-artifacts.ts --strict
//   bun scripts/validate-artifacts.ts --strict --root /path/to/project
//
// The flat-path grammar itself is checked by lint-artifact-paths.ts; this script
// validates the *contents* of each artifact's frontmatter.

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const STRICT = process.argv.includes("--strict");
const ROOT = (() => {
  const i = process.argv.indexOf("--root");
  if (i > -1 && process.argv[i + 1]) return process.argv[i + 1];
  return process.cwd();
})();
const ARTIFACT_DIR = join(ROOT, ".forsvn/artifacts");

const STATUS = new Set(["done", "done_with_concerns", "blocked", "needs_context"]);
const STACK = new Set(["meta", "mkt", "product", "research"]);
const SURFACE = new Set(["html", "md", "none"]);
const DECISION = new Set(["pending", "approved", "denied", "suggested", "not_required"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}/;

if (!existsSync(ARTIFACT_DIR)) {
  console.log("validate-artifacts: .forsvn/artifacts/ does not exist; nothing to validate.");
  process.exit(0);
}

type Issue = { file: string; problems: string[] };
const issues: Issue[] = [];
let checked = 0;

walk(ARTIFACT_DIR);

function walk(dir: string): void {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name);
    const rel = relative(ROOT, abs).split("\\").join("/");
    if (rel.startsWith(".forsvn/artifacts/.archive")) continue;
    if (e.isDirectory()) {
      walk(abs);
      continue;
    }
    if (!e.isFile() || !e.name.endsWith(".md")) continue;
    validate(abs, rel);
  }
}

function field(fm: string, key: string): string | null {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, "").trim();
}

function validate(abs: string, rel: string): void {
  checked++;
  const txt = readFileSync(abs, "utf-8");
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  const problems: string[] = [];
  if (!m) {
    problems.push("no frontmatter block");
    issues.push({ file: rel, problems });
    return;
  }
  const fm = m[1];

  // required
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
  else if (!STACK.has(stack)) problems.push(`\`stack\` invalid: "${stack}" (expected ${[...STACK].join(" | ")})`);
  const surface = field(fm, "review_surface");
  if (surface === null) problems.push("missing `review_surface` (v2 mandatory)");
  else if (!SURFACE.has(surface)) problems.push(`\`review_surface\` invalid: "${surface}" (expected ${[...SURFACE].join(" | ")})`);

  // legacy field must be gone
  if (/^review_state:/m.test(fm)) problems.push("legacy `review_state` present — rename to `decision_state`");

  // decision_state enum (optional field)
  const decision = field(fm, "decision_state");
  if (decision !== null && decision !== "" && !DECISION.has(decision))
    problems.push(`\`decision_state\` invalid: "${decision}" (expected ${[...DECISION].join(" | ")})`);

  if (problems.length) issues.push({ file: rel, problems });
}

if (issues.length === 0) {
  console.log(`[validate-artifacts] OK — ${checked} artifact(s) conform to the v2 contract.`);
  process.exit(0);
}

const tag = STRICT ? "FAIL" : "WARN";
console.error(`[validate-artifacts] ${tag} — ${issues.length}/${checked} artifact(s) non-conforming:`);
for (const i of issues) {
  console.error(`  ${i.file}`);
  for (const p of i.problems) console.error(`    - ${p}`);
}
process.exit(STRICT ? 1 : 0);
