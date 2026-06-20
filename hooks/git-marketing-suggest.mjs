#!/usr/bin/env node
/**
 * git-marketing-suggest — OPT-IN event trigger (C6): git push = marketing moment.
 *
 * On a feature push, prints a SUGGESTION-ONLY block naming 2–3 distribution moves
 * and the existing producer for each (changelog tweet → write-social, community
 * reply → write-social, changelog/PH-update line → write-launch). It NEVER drafts,
 * invokes a producer, or publishes — it nudges; the human tags /forsvn to act, and
 * publish always stops for a human (the publish-gate contract is absolute).
 *
 * Opt-in + non-load-bearing: wire it as a git hook only if you want the nudge —
 * typing `/forsvn` after a ship is the portable path and works without this.
 *   Install (pre-push):  ln -s ../../hooks/git-marketing-suggest.mjs .git/hooks/pre-push
 *   (or call it from an existing pre-push/post-commit hook)
 *
 * Detection: a "feature push" = ≥1 commit subject matching feat|feature|launch|
 * ship|release (conventional-commit-ish) in the pushed range. Reads the range from
 * git, or from --commits "<newline-separated subjects>" (for tests / manual use).
 *
 * Output goes to stderr (so it never pollutes a hook's stdout contract); exit 0
 * ALWAYS (a suggestion must never block or fail a push).
 */

import { execSync } from "node:child_process";

const FEATURE_RE = /\b(feat|feature|launch|ship|release|add)\b/i;

function arg(name) {
  const i = process.argv.indexOf(name);
  return i !== -1 && i + 1 < process.argv.length ? process.argv[i + 1] : undefined;
}

function commitSubjects() {
  const injected = arg("--commits");
  if (injected !== undefined) return injected.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  // Best-effort: commits on this branch not yet on origin/main (the "about to push" set).
  for (const range of ["origin/main..HEAD", "main..HEAD", "HEAD~5..HEAD"]) {
    try {
      const out = execSync(`git log --format=%s ${range}`, { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }).trim();
      if (out) return out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    } catch { /* try the next range */ }
  }
  return [];
}

function main() {
  const subjects = commitSubjects();
  const featurey = subjects.filter((s) => FEATURE_RE.test(s));
  if (featurey.length === 0) return; // not a feature push — say nothing

  const headline = featurey[0].replace(/^(\w+)(\([^)]*\))?!?:\s*/, ""); // strip a conventional-commit prefix
  const lines = [
    `[forsvn] You shipped: "${headline}" — 3 distribution moves (suggestion-only; nothing publishes without you):`,
    `  1. Changelog tweet      → /write-social   (announce the change; ground in query-performance recall)`,
    `  2. Community reply       → /write-social   (a relevant Reddit/HN/X thread — native, not promotional)`,
    `  3. Changelog / PH update → /write-launch   (the launch-channel update line)`,
    `Tag /forsvn to draft these as reviewable artifacts. Each drafts to decision_state: pending — publish always stops for you.`,
  ];
  process.stderr.write(lines.join("\n") + "\n");
}

try { main(); } catch { /* a nudge must never fail a push */ }
process.exit(0);
