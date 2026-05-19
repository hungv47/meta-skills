#!/usr/bin/env bun
// Bump .claude-plugin/marketplace.json metadata.version and rewrite the README
// "Per-stack release notes" line with today's date + the provided summary.
//
// Run in the same umbrella commit that bumps submodule pointers, so the
// catalog version, README, and pointers move together. Per-stack plugin.json
// versions and CHANGELOG entries are bumped inside each submodule separately.
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
const readmePath = resolve(root, "README.md");

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

// Local-time YYYY-MM-DD (the "sv" locale gives ISO format) — avoids the UTC
// edge case where running the script just after local midnight writes
// yesterday's date to the README.
const today = new Date().toLocaleDateString("sv");

// Read everything before mutating anything — fail fast if a submodule is
// missing or a file is unreadable, rather than crashing mid-write with
// marketplace.json already bumped.
const readme = readFileSync(readmePath, "utf8");
const lines = readme.split("\n");
const readmeIdx = lines.findIndex((l) =>
  l.startsWith("Per-stack release notes"),
);

const stacks = [
  "research-skills",
  "marketing-skills",
  "product-skills",
  "meta-skills",
];
const stackVersions = stacks.map((s) => {
  const p = JSON.parse(
    readFileSync(resolve(root, s, ".claude-plugin/plugin.json"), "utf8"),
  );
  return `  ${s.padEnd(18)} ${p.version}`;
});

// All reads succeeded — now write.
writeFileSync(mfPath, mfRaw.replace(versionRe, `${prefix}${next}${suffix}`));

if (readmeIdx === -1) {
  console.warn(
    "Warning: did not find a 'Per-stack release notes' line in README.md — marketplace.json was bumped but README was not updated.",
  );
} else {
  lines[readmeIdx] = `Per-stack release notes (updated ${today} — ${summary}):`;
  writeFileSync(readmePath, lines.join("\n"));
}

console.log(`marketplace  ${current} → ${next}`);
console.log(stackVersions.join("\n"));
console.log(`README updated for ${today}: ${summary}`);
