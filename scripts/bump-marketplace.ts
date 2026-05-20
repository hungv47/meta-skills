#!/usr/bin/env bun
// Bump .claude-plugin/marketplace.json metadata.version.
//
// Run in the same commit that ships the release. `plugin.json` `version` and
// `CHANGELOG.md` entries are updated separately (see CLAUDE.md § Releasing).
//
// The version edit is a surgical regex replace — does not reformat the rest
// of marketplace.json.
//
// Usage:
//   bun scripts/bump-marketplace.ts <patch|minor|major> "<one-line summary>"

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const [, , bumpKind, summary] = process.argv;

if (!bumpKind || !summary) {
  console.error(
    'Usage: bun scripts/bump-marketplace.ts <patch|minor|major> "<one-line summary>"',
  );
  process.exit(1);
}
if (!["patch", "minor", "major"].includes(bumpKind)) {
  console.error(`Invalid bump kind: ${bumpKind} (expected patch|minor|major)`);
  process.exit(1);
}

const root = resolve(import.meta.dir, "..");
const mfPath = resolve(root, ".claude-plugin/marketplace.json");

const mfRaw = readFileSync(mfPath, "utf8");
const versionRe = /("version"\s*:\s*")(\d+)\.(\d+)\.(\d+)(")/;
const match = mfRaw.match(versionRe);
if (!match) {
  console.error("Could not find a version string in marketplace.json");
  process.exit(1);
}
const [, prefix, majS, minS, patS, suffix] = match;
const maj = Number(majS);
const min = Number(minS);
const pat = Number(patS);
const current = `${maj}.${min}.${pat}`;

const next =
  bumpKind === "major"
    ? `${maj + 1}.0.0`
    : bumpKind === "minor"
      ? `${maj}.${min + 1}.0`
      : `${maj}.${min}.${pat + 1}`;

// Report the consolidated plugin's own version alongside the catalog bump.
// (Pre-2.0 this read four per-stack plugin.json files; the consolidation left
// a single .claude-plugin/plugin.json.)
const pluginVersion = JSON.parse(
  readFileSync(resolve(root, ".claude-plugin/plugin.json"), "utf8"),
).version;

writeFileSync(mfPath, mfRaw.replace(versionRe, `${prefix}${next}${suffix}`));

console.log(`marketplace  ${current} → ${next}  (${summary})`);
console.log(`  plugin.json  ${pluginVersion}`);
