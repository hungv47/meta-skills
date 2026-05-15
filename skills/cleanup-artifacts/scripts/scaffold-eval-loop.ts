#!/usr/bin/env bun
// GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root.
// scaffold-eval-loop — create a loop-centered workspace for measurable work.
// See references/_shared/eval-loop-spec.md for the full contract.
//
// Usage:
//   bun /path/to/scaffold-eval-loop.ts "<loop name or slug>" [--domain marketing|product|research] [--no-sync] [project-root]
//
// --domain is accepted for backward-compatible command lines but loops now live
// in a domain-neutral workspace: skills-resources/loops/<slug>.

import { existsSync, mkdirSync, writeFileSync, lstatSync, realpathSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);

const domainIdx = args.indexOf("--domain");
const domain = domainIdx !== -1 && args[domainIdx + 1] ? args[domainIdx + 1] : "marketing";
if (!["marketing", "product", "research"].includes(domain)) {
  console.error(`Invalid --domain ${JSON.stringify(domain)}. Expected one of: marketing, product, research`);
  process.exit(1);
}

const noSync = args.includes("--no-sync");
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--domain");
const name = positional[0];
if (!name) {
  console.error('Usage: scaffold-eval-loop.ts "<loop name or slug>" [--domain marketing|product|research] [--no-sync] [project-root]');
  process.exit(1);
}

const ROOT = realpathSync(positional[1] ? positional[1] : process.cwd());
const TODAY = new Date().toISOString().slice(0, 10);

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleize(value: string): string {
  return value
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function yamlString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function writeIfMissing(path: string, content: string, created: string[], skipped: string[]): void {
  if (existsSync(path)) {
    if (lstatSync(path).isSymbolicLink()) {
      console.error(`Refusing to write through symlink: ${relative(ROOT, path)}`);
      process.exit(1);
    }
    skipped.push(relative(ROOT, path));
    return;
  }
  writeFileSync(path, content);
  created.push(relative(ROOT, path));
}

function assertNotSymlink(path: string): void {
  if (existsSync(path) && lstatSync(path).isSymbolicLink()) {
    console.error(`Refusing to use symlinked path: ${relative(ROOT, path)}`);
    process.exit(1);
  }
}

function assertExistingDirectorySafe(path: string): void {
  if (!existsSync(path)) return;
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) {
    console.error(`Refusing to use symlinked path: ${relative(ROOT, path)}`);
    process.exit(1);
  }
  if (!stat.isDirectory()) {
    console.error(`Expected directory path: ${relative(ROOT, path)}`);
    process.exit(1);
  }
}

const slug = slugify(name);
if (!slug) {
  console.error(`Could not derive a valid slug from ${JSON.stringify(name)}`);
  process.exit(1);
}

const title = titleize(name);
const skillsResources = join(ROOT, "skills-resources");
assertExistingDirectorySafe(skillsResources);
mkdirSync(skillsResources, { recursive: true });
const loopRoot = join(skillsResources, "loops");
assertExistingDirectorySafe(loopRoot);
mkdirSync(loopRoot, { recursive: true });
const loopDir = join(loopRoot, slug);
assertNotSymlink(loopDir);
const realLoopRoot = realpathSync(loopRoot);
const projectedLoopDir = resolve(loopRoot, slug);
if (projectedLoopDir !== realLoopRoot && !projectedLoopDir.startsWith(`${realLoopRoot}${sep}`)) {
  console.error("Refusing to create loop outside skills-resources/loops.");
  process.exit(1);
}
const created: string[] = [];
const skipped: string[] = [];

mkdirSync(loopDir, { recursive: true });
assertNotSymlink(loopDir);
const realLoopDir = realpathSync(loopDir);
if (realLoopDir !== realLoopRoot && !realLoopDir.startsWith(`${realLoopRoot}${sep}`)) {
  console.error("Refusing to create loop outside skills-resources/loops.");
  process.exit(1);
}
for (const subdir of ["strategy", "execution", "evals"]) {
  mkdirSync(join(loopDir, subdir), { recursive: true });
}

writeIfMissing(
  join(loopDir, "program.md"),
  `---\nskill: eval-loop\nversion: 1\ndate: ${TODAY}\nstatus: needs_context\nsummary: ${yamlString(`${title} measurable improvement loop`)}\npurpose: "Operating program for a measurable strategy -> execution -> evaluation loop"\nlifecycle: loop\nuse_when: "Coordinating repeated strategy, content/marketing execution, evaluation, and keep/discard decisions for this initiative"\ndo_not_use_when: "The work has no observable metric or the metric cannot be attributed to this loop"\nupstream: "operator intent, prior artifacts, metric baseline"\ndownstream: "strategy skills, marketing/content execution skills, evaluation skills"\n---\n\n# ${title} Program\n\n## Goal\n\nTBD.\n\n## Measurable Surface\n\nTBD. Name the asset, campaign, channel, page, sequence, or content series this loop owns.\n\n## Primary Metric\n\nTBD. Choose one decision metric. Examples: conversion rate, CTR, qualified replies, completion rate, saves, signups, revenue.\n\n## Guardrail Metrics\n\n- TBD.\n\n## Mutable Surface\n\nTBD. Name what agents may change between cycles: copy, offer, targeting, creative angle, sequence order, CTA, post format, etc.\n\n## Frozen Context\n\n- Canonical brand/research constraints stay authoritative unless explicitly refreshed.\n- External execution systems remain outside this folder; this loop stores strategy, produced marketing/content assets, evals, and learning decisions.\n\n## Cycle Protocol\n\n1. Read \`context.md\`, \`learnings.md\`, prior \`results.tsv\`, and the latest artifacts in \`strategy/\`, \`execution/\`, and \`evals/\`.\n2. Produce or revise one bounded strategy or execution artifact.\n3. Run or ingest an evaluation snapshot after the measurement window closes.\n4. Record the cycle in \`results.tsv\` with status \`keep\`, \`discard\`, \`watch\`, or \`blocked\`.\n5. Promote only reusable, evidence-backed lessons to \`learnings.md\`.\n\n## Promotion Rule\n\n- \`keep\` — clear metric improvement, useful simplification, or strong qualitative signal with adequate sample.\n- \`discard\` — worse result, confounded test, or added complexity without measurable upside.\n- \`watch\` — promising but underpowered; needs another cycle before changing defaults.\n- \`blocked\` — missing data, attribution, execution proof, or measurement window.\n`,
  created,
  skipped
);

writeIfMissing(
  join(loopDir, "context.md"),
  `---\nskill: eval-loop\nversion: 1\ndate: ${TODAY}\nstatus: needs_context\nsummary: ${yamlString(`Context substrate for ${title}`)}\npurpose: "Loop-local assumptions, constraints, baselines, and links to canonical artifacts"\nlifecycle: loop-context\nuse_when: "Before any strategy, execution, or evaluation step inside this loop"\ndo_not_use_when: "Canonical brand, research, or architecture artifacts conflict; refresh this context first"\nupstream: "research/, brand/, architecture/, .agents/experience/"\ndownstream: "program.md, strategy artifacts, execution artifacts, eval artifacts"\n---\n\n# ${title} Context\n\n## Canonical Inputs\n\n| Source | What to use | Freshness / caveat |\n|---|---|---|\n| TBD | TBD | TBD |\n\n## Baseline\n\n| Metric | Value | Window | Source |\n|---|---:|---|---|\n| TBD | TBD | TBD | TBD |\n\n## Audience / Segment\n\nTBD.\n\n## Offer / Message Hypothesis\n\nTBD.\n\n## Constraints\n\n- TBD.\n\n## Open Questions\n\n- TBD.\n`,
  created,
  skipped
);

writeIfMissing(
  join(loopDir, "learnings.md"),
  `---\nskill: eval-loop\nversion: 1\ndate: ${TODAY}\nstatus: needs_context\nsummary: ${yamlString(`Promoted learnings for ${title}`)}\npurpose: "Reusable evidence-backed lessons from completed loop cycles"\nlifecycle: learning\nuse_when: "Before creating new strategy or execution artifacts for this loop or adjacent loops"\ndo_not_use_when: "A lesson is contradicted by newer evidence or marked expired"\nupstream: "evals/, results.tsv"\ndownstream: "future strategy, execution, and evaluation cycles"\n---\n\n# ${title} Learnings\n\nPromote lessons here only after an eval artifact and \`results.tsv\` row support them.\n\n## Active Lessons\n\n_None yet._\n\n## Expired / Refuted Lessons\n\n_None yet._\n`,
  created,
  skipped
);

writeIfMissing(
  join(loopDir, "results.tsv"),
  "cycle\tdate\tartifact\tprimary_metric\tvalue\tbaseline\tstatus\tdescription\n",
  created,
  skipped
);

const scriptDir = dirname(fileURLToPath(import.meta.url));
const syncPath = join(scriptDir, "manifest-sync.ts");
if (!noSync && existsSync(syncPath)) {
  try {
    const sync = Bun.spawnSync(["bun", syncPath, ROOT], { stdout: "pipe", stderr: "pipe" });
    if (sync.exitCode !== 0) {
      console.error(sync.stderr.toString());
      process.exit(sync.exitCode || 1);
    }
    process.stdout.write(sync.stdout.toString());
  } catch (err) {
    console.warn(`manifest-sync skipped: ${(err as Error).message}. Run it manually with:\n  bun ${relative(ROOT, syncPath)}`);
  }
}

console.log(`scaffold-eval-loop: ${relative(ROOT, loopDir)}`);
if (created.length) console.log(`created:\n${created.map((p) => `  - ${p}`).join("\n")}`);
if (skipped.length) console.log(`already existed:\n${skipped.map((p) => `  - ${p}`).join("\n")}`);
