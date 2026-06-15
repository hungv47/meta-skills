#!/usr/bin/env bun
// GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root.
// scaffold-pipeline — materialize a staged closed-loop pipeline in the shared
// loop tree (CLOSED-LOOP.md §7). scaffold-pipeline is the SUPERSET of run-pipeline:
// it threads research → brief → FORK → execute → ingest → evaluate → learn, where
// each stage is a leaf skill and transitions pause for the execution fork (§4) and
// the human review gate (never auto-approved). It SHARES run-pipeline's loop-tree
// schema — `.forsvn/loops/<slug>/` with `results.tsv` (same 8-col ledger) +
// `learnings.md` + the stage dirs — and adds one artifact it owns: `pipeline.md`,
// the staged program + the resumable current-stage pointer.
//
// Idempotent: never clobbers an existing file (so it layers onto a loop that
// run-pipeline already scaffolded). Local-only; no network.
//
// Usage:
//   bun /path/to/scaffold-pipeline.ts "<pipeline name or slug>" [--category image|video|design|publish|research|analytics] [project-root]

import { existsSync, mkdirSync, writeFileSync, realpathSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const categoryIdx = args.indexOf("--category");
const category = categoryIdx !== -1 ? args[categoryIdx + 1] : "";
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--category");
const name = positional[0];
if (!name) {
  console.error('Usage: scaffold-pipeline.ts "<pipeline name or slug>" [--category <cat>] [project-root]');
  process.exit(1);
}
const ROOT = realpathSync(positional[1] ? positional[1] : process.cwd());
const TODAY = new Date().toISOString().slice(0, 10);

const slug = name.trim().toLowerCase().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const title = name.trim().replace(/[-_]+/g, " ").replace(/\s+/g, " ").split(" ").map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
// Quote when the value would otherwise be mis-parsed as YAML: flow indicators
// (`[`/`{`), the `[pipeline]`-prefix summaries, or `:`/`#`/quote chars.
const yamlString = (s: string) => (/[:#"'[\]{}]/.test(s) ? JSON.stringify(s) : s);

// The 6 named stages (CLOSED-LOOP §7). Each maps to a leaf-skill family; the
// fork + review-gate columns mark where the orchestrator MUST stop for a human.
const STAGES = [
  { n: 1, stage: "research", skill: "research-* (icp/market/platform/shortform)", gate: "—" },
  { n: 2, stage: "brief", skill: "brief-* / write-*", gate: "review gate" },
  { n: 3, stage: "execute", skill: "FORK → brief-only | assisted | direct", gate: "fork + review gate" },
  { n: 4, stage: "ingest", skill: "forsvn-preview attach (return-leg §6)", gate: "—" },
  { n: 5, stage: "evaluate", skill: "evaluate-* sibling", gate: "—" },
  { n: 6, stage: "learn", skill: "promote → learnings.md", gate: "—" },
];

const loopDir = join(ROOT, ".forsvn", "loops", slug);
mkdirSync(loopDir, { recursive: true });
for (const sub of ["strategy", "execution", "evals"]) mkdirSync(join(loopDir, sub), { recursive: true });

const created: string[] = [];
const skipped: string[] = [];
function writeIfAbsent(path: string, body: string): void {
  if (existsSync(path)) { skipped.push(path); return; }
  writeFileSync(path, body);
  created.push(path);
}

const stageRows = STAGES.map((s) => `| ${s.n} | ${s.stage} | ${s.skill} | pending | ${s.gate} |`).join("\n");

writeIfAbsent(
  join(loopDir, "pipeline.md"),
  `---
skill: run-pipeline
version: 1
date: ${TODAY}
status: needs_context
stack: meta
type: loop
id: pipeline-${slug}
keywords: [pipeline, ${slug}, closed-loop, orchestration, stages]
lifecycle: loop
loop: ${slug}
summary: ${yamlString(`[pipeline] ${title} closed-loop orchestration`)}
purpose: "Staged research → brief → execute → ingest → evaluate → learn program; the resumable record of which stage is live and what gate it waits on."
use_when: "Driving or resuming the ${title} closed loop across stages"
do_not_use_when: "A single one-shot artifact with no execute/evaluate cycle (use the leaf skill directly)"
review_surface: none
decision_state: not_required
upstream: "operator intent, tool-registry, prior loop learnings"
downstream: "run-pipeline, the per-stage leaf skills, evaluate-* siblings"
---

# ${title} — Pipeline

**Goal:** TBD.
**Asset category:** ${category || "TBD"}  (gates the execution fork via \`list_tools\`)

## Stages

| # | stage | skill | status | gate |
|---|---|---|---|---|
${stageRows}

**Current stage:** 1 (research)

## Gate rules (CLOSED-LOOP §4, §7)

- The orchestrator **stops at every gate** — it never auto-approves. Execute pauses
  for the fork (Brief-only default; Assisted/Direct only when an engine is
  \`verified\` in the tool registry); brief/execute outputs land as \`decision_state:
  pending\` artifacts the human approves in the review stream.
- State lives in this tree (\`pipeline.md\` + \`results.tsv\` + \`learnings.md\`) — no new
  database. To resume, read **Current stage** and the latest artifacts under
  \`strategy/\`, \`execution/\`, \`evals/\`.

## Transition log

_Append one line per stage transition: \`<date> stage N→M · <gate outcome> · <artifact>\`._
`,
);

writeIfAbsent(
  join(loopDir, "learnings.md"),
  `---
skill: run-pipeline
version: 1
date: ${TODAY}
status: needs_context
stack: meta
type: learning
id: pipeline-${slug}-learnings
keywords: [pipeline, ${slug}, learnings]
lifecycle: learning
loop: ${slug}
summary: ${yamlString(`Promoted learnings for ${title}`)}
purpose: "Reusable evidence-backed lessons from completed pipeline cycles"
use_when: "Before the next cycle's brief stage"
review_surface: none
decision_state: not_required
---

# ${title} Learnings

Promote a lesson only after an eval artifact + a \`results.tsv\` row support it.

## Active Lessons

_None yet._
`,
);

// Shared with run-pipeline: the 8-column ledger (same header — cross-stack
// contract with the evaluate-* siblings; see eval-loop-spec.md).
writeIfAbsent(
  join(loopDir, "results.tsv"),
  "cycle\tdate\tartifact\tprimary_metric\tvalue\tbaseline\tstatus\tdescription\n",
);

if (created.length) console.log(`created:\n${created.map((p) => `  - ${p}`).join("\n")}`);
if (skipped.length) console.log(`already existed:\n${skipped.map((p) => `  - ${p}`).join("\n")}`);
console.log(`pipeline loop ready: ${join(".forsvn", "loops", slug)}`);
