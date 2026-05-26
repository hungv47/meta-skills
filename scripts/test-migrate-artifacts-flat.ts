#!/usr/bin/env bun
// test-migrate-artifacts-flat — integration test for the migration script.
//
// Spins up a synthetic project root, runs the migration in --apply mode,
// asserts file rename, frontmatter rewrite, cross-artifact reference update,
// and migration-report.json shape.
//
// Usage: bun scripts/test-migrate-artifacts-flat.ts   (exits 0 on pass, 1 on fail)

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATE = join(__dirname, "migrate-artifacts-flat.ts");

const root = mkdtempSync(join(tmpdir(), "migrate-test-"));
try {
  // Initialize git so the dirty-tree check has something real to read.
  exec("git", ["init", "-q"], root);
  exec("git", ["config", "user.email", "test@test"], root);
  exec("git", ["config", "user.name", "test"], root);

  writeAt(root, ".forsvn/artifacts/meta/records/2026-05-26-fresh-eyes.md", `---
skill: review-work
version: 1
date: 2026-05-26
status: done
review_state: changes_requested
review_tool: roughdraft
lifecycle: snapshot
---

# Fresh eyes
`);
  writeAt(root, ".forsvn/artifacts/mkt/copy/hero-conquis-v3.md", `---
skill: write-copy
version: 1
date: 2026-05-26
status: done
lifecycle: pipeline
upstream: ".forsvn/artifacts/meta/records/2026-05-26-fresh-eyes.md"
---

# Hero copy
`);
  // Already-flat file should be skipped.
  writeAt(root, ".forsvn/artifacts/product-map-user-flow-2026-05-26-checkout.md", `---
skill: map-user-flow
version: 1
date: 2026-05-26
status: done
stack: product
review_surface: md
---
`);
  // Archive file should be left alone.
  writeAt(root, ".forsvn/artifacts/.archive/old-thing.md", `---\nskill: old\n---\n`);

  exec("git", ["add", "-A"], root);
  exec("git", ["commit", "-q", "-m", "fixtures"], root);

  // Dry-run first.
  const dry = spawnSync("bun", [MIGRATE, "--root", root], { encoding: "utf8" });
  if (dry.status !== 0) {
    console.error("dry-run failed:\n" + dry.stderr);
    process.exit(1);
  }
  assert(dry.stdout.includes("DRY-RUN"), "dry-run banner present");
  assert(dry.stdout.includes("planned renames: 2"), "dry-run plans 2 renames");
  assert(dry.stdout.includes("already flat"), "already-flat artifact skipped");
  assert(dry.stdout.includes("archive"), "archive artifact skipped");

  // Apply.
  const apply = spawnSync("bun", [MIGRATE, "--apply", "--root", root], { encoding: "utf8" });
  if (apply.status !== 0) {
    console.error("apply failed:\n" + apply.stderr + "\n" + apply.stdout);
    process.exit(1);
  }
  assert(apply.stdout.includes("APPLY"), "apply banner present");

  // Files moved.
  const newFreshEyes = ".forsvn/artifacts/meta-review-work-2026-05-26-fresh-eyes.md";
  const newHero = ".forsvn/artifacts/mkt-write-copy-2026-05-26-hero-conquis-v3.md";
  assert(existsSync(join(root, newFreshEyes)), "fresh-eyes moved");
  assert(existsSync(join(root, newHero)), "hero copy moved");
  assert(!existsSync(join(root, ".forsvn/artifacts/meta/records/2026-05-26-fresh-eyes.md")), "old fresh-eyes gone");

  // Frontmatter rewritten — fresh-eyes had review_state: changes_requested.
  const newFreshEyesContent = readFileSync(join(root, newFreshEyes), "utf8");
  assert(newFreshEyesContent.includes("decision_state: suggested"), "review_state migrated to decision_state: suggested");
  assert(!newFreshEyesContent.includes("review_state:"), "old review_state line gone");
  assert(newFreshEyesContent.includes("stack: meta"), "stack injected on fresh-eyes");
  assert(newFreshEyesContent.includes("review_surface: md"), "review_surface injected on fresh-eyes");

  // Cross-artifact reference updated.
  const newHeroContent = readFileSync(join(root, newHero), "utf8");
  assert(newHeroContent.includes(newFreshEyes), "hero copy upstream rewritten to new path");
  assert(!newHeroContent.includes("meta/records/2026-05-26-fresh-eyes.md"), "old path gone from hero upstream");

  // Migration report written.
  const today = new Date().toISOString().slice(0, 10);
  const reportPath = join(root, `migration-report-${today}.json`);
  assert(existsSync(reportPath), "migration report written");
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  assertEq(report.mode, "apply");
  assert(Array.isArray(report.rows), "report.rows is array");
  assert(report.rows.length === 2, `report.rows length === 2 (got ${report.rows.length})`);

  console.log("migrate-artifacts-flat integration test: PASS");
} finally {
  rmSync(root, { recursive: true, force: true });
}

function writeAt(root: string, rel: string, content: string): void {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

function exec(cmd: string, args: string[], cwd: string): void {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8" });
  if (r.status !== 0) {
    console.error(`${cmd} ${args.join(" ")} failed: ${r.stderr}`);
    process.exit(1);
  }
}

function assert(cond: unknown, msg: string): void {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

function assertEq<T>(got: T, expected: T): void {
  if (JSON.stringify(got) !== JSON.stringify(expected)) {
    console.error(`FAIL: expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);
    process.exit(1);
  }
}
