#!/usr/bin/env bun
// lint-artifact-paths — verify every artifact under `.forsvn/artifacts/`
// matches the v2 flat-filename grammar.
//
// Allowed shapes under `.forsvn/artifacts/`:
//   <stack>-<skill>-<YYYY-MM-DD>-<slug>.md       (the canonical flat form)
//   <stack>-<skill>-<YYYY-MM-DD>-<slug>.html     (review-surface preview, while pending)
//   .archive/<anything>                            (archived; not validated)
//
// Anything else is a violation. After the WS-3 migration runs, this should
// return zero violations on the repo.
//
// Usage:
//   bun scripts/lint-artifact-paths.ts            (lint cwd)
//   bun scripts/lint-artifact-paths.ts --root /path

import { readdirSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { FLAT_FILENAME_RE } from "./lib/path-parser";

const ROOT_ARG = (() => {
  const idx = process.argv.indexOf("--root");
  if (idx > -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return process.cwd();
})();
const ROOT = ROOT_ARG;
const ARTIFACT_DIR = join(ROOT, ".forsvn/artifacts");

if (!existsSync(ARTIFACT_DIR)) {
  console.log("lint-artifact-paths: .forsvn/artifacts/ does not exist; nothing to lint.");
  process.exit(0);
}

const violations: string[] = [];
walk(ARTIFACT_DIR);

if (violations.length === 0) {
  console.log("[lint-artifact-paths] OK — all artifacts match flat-filename grammar.");
  process.exit(0);
}

console.error(`[lint-artifact-paths] FAIL — ${violations.length} violation(s):`);
for (const v of violations) console.error(`  - ${v}`);
console.error(`\nFix: run \`bun scripts/migrate-artifacts-flat.ts --apply\` to convert legacy paths.`);
process.exit(1);

function walk(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    const rel = relative(ROOT, abs).split("\\").join("/");
    if (rel.startsWith(".forsvn/artifacts/.archive")) continue;
    if (entry.isDirectory()) {
      walk(abs);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!(entry.name.endsWith(".md") || entry.name.endsWith(".html"))) continue;
    if (!FLAT_FILENAME_RE.test(rel)) {
      violations.push(rel);
    }
  }
}
