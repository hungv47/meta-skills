#!/usr/bin/env bun
// test-review-fixtures — integration test for the review layer in manifest-sync.ts.
//
// Builds a throwaway project root with synthetic artifacts covering the four
// review cases (no review fields / pending / CriticMarkup in body / invalid
// review_state), runs `manifest-sync` against it, and asserts the manifest.
//
// Usage: bun scripts/test-review-fixtures.ts   (exits 0 on pass, 1 on fail)

import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const MANIFEST_SYNC = new URL("manifest-sync.ts", import.meta.url).pathname;

const FIXTURES: Record<string, string> = {
  // 1. No review fields → review_state must default to not_required.
  "no-review.md": `---
skill: test-skill
version: 1
date: 2026-05-22
status: done
---

# No Review Fields

An artifact written before the review layer existed. Must index unchanged.
`,
  // 2. Pending review → review_state round-trips.
  "pending-review.md": `---
skill: test-skill
version: 1
date: 2026-05-22
status: done
review_state: pending
review_tool: roughdraft
---

# Pending Review

## Review Gate
- [ ] Approve
- [ ] Reject
- [ ] Suggest changes
`,
  // 3. CriticMarkup + a body horizontal rule must not confuse frontmatter parsing.
  "criticmarkup-body.md": `---
skill: test-skill
version: 1
date: 2026-05-22
status: done
review_state: changes_requested
review_tool: roughdraft
reviewed_at: 2026-05-22
reviewer: operator
---

# CriticMarkup In Body

This line has {>>a review comment<<}{id="c1" by="operator" at="2026-05-22T00:00:00.000Z"} inline.
A suggested edit: {~~old phrasing~>new phrasing~~}{id="s1" by="operator" at="2026-05-22T00:00:00.000Z"}.

---

Text after a Markdown horizontal rule — the parser must not read this as frontmatter.
`,
  // 4. Invalid review_state → normalized to not_required, with a warning.
  "invalid-review.md": `---
skill: test-skill
version: 1
date: 2026-05-22
status: done
review_state: totally-bogus
---

# Invalid Review State
`,
};

const EXPECT: Record<string, { review_state: string; review_tool: string; reviewer: string }> = {
  "no-review.md": { review_state: "not_required", review_tool: "", reviewer: "" },
  "pending-review.md": { review_state: "pending", review_tool: "roughdraft", reviewer: "" },
  "criticmarkup-body.md": { review_state: "changes_requested", review_tool: "roughdraft", reviewer: "operator" },
  "invalid-review.md": { review_state: "not_required", review_tool: "", reviewer: "" },
};

const root = mkdtempSync(join(tmpdir(), "review-fixtures-"));
const failures: string[] = [];

try {
  const artifactsDir = join(root, ".forsvn", "artifacts", "meta");
  mkdirSync(artifactsDir, { recursive: true });
  for (const [name, body] of Object.entries(FIXTURES)) {
    writeFileSync(join(artifactsDir, name), body);
  }

  const run = spawnSync("bun", [MANIFEST_SYNC, root], { encoding: "utf8" });
  if (run.status !== 0) {
    failures.push(`manifest-sync exited ${run.status} (expected 0)\n${run.stderr}`);
  }

  // The invalid review_state must surface a warning, not a crash.
  if (!/unknown review_state .*invalid-review\.md|invalid-review\.md.*unknown review_state/.test(run.stderr)) {
    failures.push(`expected an "unknown review_state" warning for invalid-review.md; stderr was:\n${run.stderr}`);
  }

  const manifestPath = join(root, ".forsvn", "index", "manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  for (const [name, want] of Object.entries(EXPECT)) {
    const key = `.forsvn/artifacts/meta/${name}`;
    const entry = manifest.artifacts[key];
    if (!entry) {
      failures.push(`${name}: not indexed (key ${key} missing from manifest)`);
      continue;
    }
    for (const field of ["review_state", "review_tool", "reviewer"] as const) {
      if (entry[field] !== want[field]) {
        failures.push(`${name}: ${field} = ${JSON.stringify(entry[field])}, expected ${JSON.stringify(want[field])}`);
      }
    }
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(`test-review-fixtures FAILED: ${failures.length} assertion(s).\n`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("test-review-fixtures passed: 4 review cases index correctly (no-review, pending, criticmarkup-body, invalid).");
