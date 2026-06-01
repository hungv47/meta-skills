#!/usr/bin/env bun
// lint-artifact-paths — verify every file under the `.forsvn/` home matches the
// v3 by-stack layered grammar.
//
// Allowed shapes:
//   .forsvn/canonical/<stack>/<UPPER-NAME>.md             (curated truth)
//   .forsvn/artifacts/<stack>/<skill>-<YYYY-MM-DD>-<slug>.md|html
//   .forsvn/experience/<stack>/<name>.md                  (dated or plain topic)
//     stacks: meta · research · marketing · product
//   <layer>/<stack>/.archive/<anything>                   (archived; not validated)
//
// Anything else under these layers is a violation (e.g. a loose file at a layer
// root, an old flat `<stack>-<skill>-...` name, or an `mkt` folder).
//
// Usage:
//   bun skills/bin/lint-artifact-paths.ts            (lint cwd)
//   bun skills/bin/lint-artifact-paths.ts --root /path

import { readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { isLayeredPath } from "./lib/path-parser";

const ROOT = (() => {
  const idx = process.argv.indexOf("--root");
  if (idx > -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return process.cwd();
})();
const LAYER_DIRS = [".forsvn/canonical", ".forsvn/artifacts", ".forsvn/experience"];

const existing = LAYER_DIRS.map((d) => join(ROOT, d)).filter((d) => existsSync(d));
if (existing.length === 0) {
  console.log("lint-artifact-paths: no .forsvn/{canonical,artifacts,experience}/ layers; nothing to lint.");
  process.exit(0);
}

const violations: string[] = [];
for (const dir of existing) walk(dir);

if (violations.length === 0) {
  console.log("[lint-artifact-paths] OK — all files match the by-stack layered grammar.");
  process.exit(0);
}

console.error(`[lint-artifact-paths] FAIL — ${violations.length} violation(s):`);
for (const v of violations) console.error(`  - ${v}`);
console.error(`\nFix: place files at <layer>/<stack>/... (run \`bun _dev/migrate-artifacts-flat.ts --apply\` to convert legacy flat paths).`);
process.exit(1);

function walk(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    const rel = relative(ROOT, abs).split("\\").join("/");
    if (rel.includes("/.archive/") || entry.name === ".archive") continue;
    if (entry.isDirectory()) {
      walk(abs);
      continue;
    }
    if (!entry.isFile()) continue;
    if (entry.name.toLowerCase() === "readme.md") continue;
    if (!(entry.name.endsWith(".md") || entry.name.endsWith(".html"))) continue;
    if (!isLayeredPath(rel)) violations.push(rel);
  }
}
