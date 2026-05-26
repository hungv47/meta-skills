#!/usr/bin/env bun
// test-manifest-sync — integration test for the v2 manifest-sync pipeline.
//
// Spins up a temp project root, drops a mix of flat v2 artifacts, legacy
// nested artifacts, and a co-located HTML twin, then runs manifest-sync.ts
// against it and asserts the produced manifest.json + warnings.
//
// Usage: bun scripts/test-manifest-sync.ts   (exits 0 on pass, 1 on fail)

import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST_SYNC = join(__dirname, "manifest-sync.ts");

const root = mkdtempSync(join(tmpdir(), "manifest-sync-test-"));
try {
  // Flat v2 artifact — gated, with HTML twin.
  writeAt(root, ".forsvn/artifacts/mkt-create-brand-2026-05-26-pure-void.md", `---
skill: create-brand
version: 1
date: 2026-05-26
status: done
stack: mkt
skills_involved: [research-icp, create-brand]
lifecycle: canonical
summary: "Pure Void palette + Bricolage typography"
purpose: "Canonical FORSVN brand identity"
use_when: "Any FORSVN-facing voice or visual work"
decision_state: pending
review_surface: html
review_tool: roughdraft
---

# FORSVN Brand
`);
  writeAt(root, ".forsvn/artifacts/mkt-create-brand-2026-05-26-pure-void.html", `<!doctype html><html data-stack="water"><head><title>preview</title></head><body></body></html>`);

  // Flat v2 artifact — md only, no decision required.
  writeAt(root, ".forsvn/artifacts/meta-review-work-2026-05-26-fresh-eyes.md", `---
skill: review-work
version: 1
date: 2026-05-26
status: done
stack: meta
review_surface: none
lifecycle: snapshot
---

# Fresh Eyes
`);

  // Legacy nested artifact carrying the old review_state field — should
  // migrate with a warning.
  writeAt(root, ".forsvn/artifacts/meta/specs/legacy-spec.md", `---
skill: discover
version: 1
date: 2026-05-13
status: done
review_state: changes_requested
review_tool: roughdraft
lifecycle: spec
---

# Legacy Spec
`);

  // Legacy artifact with no review fields at all — defaults to not_required + none.
  writeAt(root, ".forsvn/artifacts/research/research-shortform/legacy-research.md", `---
skill: research-shortform
version: 1
date: 2026-05-01
status: done
lifecycle: pipeline
---

# Legacy research
`);

  const result = spawnSync("bun", [MANIFEST_SYNC, root], { encoding: "utf8" });
  if (result.status !== 0) {
    console.error("manifest-sync failed:", result.stderr);
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(join(root, ".forsvn/index/manifest.json"), "utf8"));
  const flatBrand = manifest.artifacts[".forsvn/artifacts/mkt-create-brand-2026-05-26-pure-void.md"];
  assert(flatBrand, "flat v2 mkt artifact indexed");
  assertEq(flatBrand.stack, "mkt");
  assertEq(flatBrand.skills_involved, ["research-icp", "create-brand"]);
  assertEq(flatBrand.decision_state, "pending");
  assertEq(flatBrand.review_surface, "html"); // co-located .html twin detected even though frontmatter also says html
  assertEq(flatBrand.produced_by, "create-brand");

  const flatReview = manifest.artifacts[".forsvn/artifacts/meta-review-work-2026-05-26-fresh-eyes.md"];
  assert(flatReview, "flat v2 meta snapshot indexed");
  assertEq(flatReview.stack, "meta");
  assertEq(flatReview.decision_state, "not_required");
  assertEq(flatReview.review_surface, "none");

  const legacySpec = manifest.artifacts[".forsvn/artifacts/meta/specs/legacy-spec.md"];
  assert(legacySpec, "legacy nested artifact indexed");
  assertEq(legacySpec.stack, "meta");
  assertEq(legacySpec.decision_state, "suggested"); // migrated from changes_requested
  assertEq(legacySpec.review_surface, "md"); // no html twin, decision is gated

  const legacyResearch = manifest.artifacts[".forsvn/artifacts/research/research-shortform/legacy-research.md"];
  assert(legacyResearch, "legacy pipeline artifact indexed");
  assertEq(legacyResearch.stack, "research");
  assertEq(legacyResearch.decision_state, "not_required");
  assertEq(legacyResearch.review_surface, "none");

  // The HTML twin must NOT appear as a separate artifact entry.
  assert(
    !(".forsvn/artifacts/mkt-create-brand-2026-05-26-pure-void.html" in manifest.artifacts),
    "html twin not indexed as artifact",
  );

  // Warning about legacy review_state migration should appear on stderr.
  const stderr = result.stderr + result.stdout;
  assert(stderr.includes("legacy review_state"), "legacy review_state warning emitted");

  console.log("manifest-sync integration test: PASS");
} finally {
  rmSync(root, { recursive: true, force: true });
}

function writeAt(root: string, rel: string, content: string): void {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

function assert(cond: unknown, msg: string): void {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

function assertEq<T>(got: T, expected: T): void {
  const a = JSON.stringify(got);
  const b = JSON.stringify(expected);
  if (a !== b) {
    console.error(`FAIL: expected ${b}, got ${a}`);
    process.exit(1);
  }
}
