#!/usr/bin/env bun
// One-shot Phase 1.2 migration. Inserts an empty slow-update fence into every
// SKILL.md that does not already carry one. The fence sits above the closing
// sections (Completion Status / References) so it is the last procedural
// surface a reader sees before the contract terminus.
//
// Run order (preferred targets, in priority):
//   1. Line above `## Completion Status` — present in nearly every skill.
//   2. Line above `## References` — fallback when Completion Status absent.
//   3. End of file — last-resort fallback.
//
// The seeded fence is INTENTIONALLY empty — see `references/slow-update-fence.md`
// anti-pattern #1 ("treating the fence as a junk drawer"). Operators populate
// it via deliberate slow-update PRs, not at migration time.
//
// Idempotent: skips files that already have a SLOW_UPDATE_START marker.
//
// Usage:
//   bun scripts/seed-slow-update-fences.ts            # dry-run (lists targets)
//   bun scripts/seed-slow-update-fences.ts --apply    # write changes

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOMAINS = ["meta", "research", "marketing", "product"];

const FENCE_BLOCK = `## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

`;

type Target = {
  path: string;
  insertBefore: number; // line index
  anchor: string;
};

function findInsertionPoint(lines: string[]): { idx: number; anchor: string } {
  for (let i = 0; i < lines.length; i += 1) {
    if (/^##\s+Completion(\s+Status)?\b/i.test(lines[i])) return { idx: i, anchor: "Completion" };
  }
  for (let i = 0; i < lines.length; i += 1) {
    if (/^##\s+References/i.test(lines[i])) return { idx: i, anchor: "References" };
  }
  return { idx: lines.length, anchor: "end-of-file" };
}

function gatherTargets(): Target[] {
  const targets: Target[] = [];
  for (const domain of DOMAINS) {
    const domainDir = join(ROOT, "skills", domain);
    if (!existsSync(domainDir)) continue;
    for (const id of readdirSync(domainDir)) {
      const path = join(domainDir, id, "SKILL.md");
      if (!existsSync(path)) continue;
      const raw = readFileSync(path, "utf-8");
      if (/<!--\s*SLOW_UPDATE_START\s*-->/.test(raw)) continue;
      const lines = raw.split("\n");
      const { idx, anchor } = findInsertionPoint(lines);
      targets.push({ path, insertBefore: idx, anchor });
    }
  }
  return targets;
}

function applyTarget(target: Target): void {
  const raw = readFileSync(target.path, "utf-8");
  const lines = raw.split("\n");
  // Trim trailing blank line(s) before the insertion so we do not double-blank.
  let insertAt = target.insertBefore;
  while (insertAt > 0 && lines[insertAt - 1].trim() === "") insertAt -= 1;
  const before = lines.slice(0, insertAt).join("\n");
  const after = lines.slice(insertAt).join("\n");
  // The fence block already ends with a blank line; preserve a blank before it.
  const sep = before.length > 0 && !before.endsWith("\n") ? "\n\n" : "\n";
  const next = `${before}${sep}${FENCE_BLOCK}${after}`;
  writeFileSync(target.path, next);
}

function main(): void {
  const apply = process.argv.includes("--apply");
  const targets = gatherTargets();
  console.log(`[seed-fences] ${targets.length} SKILL.md file(s) need a fence.`);
  for (const t of targets) {
    const rel = t.path.replace(`${ROOT}/`, "");
    console.log(`  ${apply ? "[apply]" : "[dry]"} ${rel}  (insert above: ${t.anchor})`);
  }
  if (!apply) {
    console.log(`\n[seed-fences] Dry run. Pass --apply to write changes.`);
    return;
  }
  for (const t of targets) applyTarget(t);
  console.log(`\n[seed-fences] Wrote ${targets.length} file(s).`);
}

main();
