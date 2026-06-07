---
name: run-pipeline
description: "Orchestrates a closed-loop initiative across named stages — research → brief → FORK → execute → ingest → evaluate → learn — each stage a leaf skill, pausing at the execution fork and the human review gate. Superset of run-eval-loop: shares the same .forsvn/loops/[slug]/ tree and adds pipeline.md, the resumable stage program. Use to thread a full produce-and-measure loop end to end. Not for eval-only setup (use run-eval-loop), one-shot artifacts (use the leaf skill), or debate (use debate-agents)."
argument-hint: "[initiative name + asset type, e.g. 'launch hero image' or 'founder outbound sequence'] [--category image|video|design|publish|research]"
allowed-tools: Read Write Edit Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.20-0.90"
---

# Run Pipeline — Closed-Loop Orchestrator

*Meta process skill. Threads the four-stage spine into one resumable loop — sequences leaf skills, stops at every gate, records the loop tree; it does NOT do each stage's work. Orchestrate, don't fuse (CLOSED-LOOP.md §2): single-responsibility skills stay testable; the merge happens here.*

**Core Question:** "Can a future agent resume this from one loop folder — the live stage, the gate it waits on, what shipped — instead of re-deriving the chain?"

> Stage model, gate rules, loop-tree contract: [`references/pipeline-spec.md`](references/pipeline-spec.md) [SPEC]. Shares the schema in [`references/_shared/eval-loop-spec.md`](references/_shared/eval-loop-spec.md).

## Critical Gates

1. **Orchestrate, don't fuse.** Never inline a leaf skill's work. Each stage dispatches its skill (`research-*`, `brief-*`/`write-*`, `produce-*`, `evaluate-*`); this skill owns only sequencing + `pipeline.md`.
2. **Stop at every gate — never auto-approve.** Execute pauses for the **execution fork** ([`references/_shared/execution-fork.md`](references/_shared/execution-fork.md)); brief/execute outputs land as `decision_state: pending` for the human (architecture §9.2). Guard this here, not in the leaf.
3. **Fork is registry-gated.** At the execute stage, query the tool registry ([`references/_shared/tool-registry-spec.md`](references/_shared/tool-registry-spec.md)) via `list_tools(category)`. 0 verified → **Brief-only** only; ≥1 → offer Assisted/Direct. Degrade cleanly — no dead ends.
4. **Close the loop.** The evaluate stage scores the **re-ingested real asset** (return-leg §6), not the brief. No ingest → the loop is open; flag it.
5. **Shared tree, no new store.** State lives in `.forsvn/loops/[slug]/` (`pipeline.md` + `results.tsv` + `learnings.md`). No database.

## Quality Gate

Critic (`agents/critic-agent.md`) PASS/FAIL:

- [ ] **Stage integrity** — all 6 stages named; each maps to a real leaf skill or a gate; current-stage pointer present.
- [ ] **Gate discipline** — execute + brief stages marked with their gate; no stage auto-approves.
- [ ] **Resumability** — `pipeline.md` alone tells a fresh agent the live stage + next action.
- [ ] **Schema integrity** — `results.tsv` 8-col header matches the evaluate-* contract; shares the eval-loop tree.
- [ ] **Loop closure** — ingest stage present so the evaluator scores the shipped asset.

FAIL → revise `pipeline.md` once, re-score.

## Before Starting

| Check | Source | Why |
|---|---|---|
| Prior loop folder | `.forsvn/loops/[slug]/` | Resume (read `pipeline.md` **Current stage**), don't re-scaffold |
| Verified engines | `list_tools(category)` | Decides the execute-stage fork options |
| Manifest fresh | `.forsvn/index/manifest.json` | Stale → `bun bin/manifest-sync.ts` |

Full: [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK].

## Pre-Dispatch

Warm/Cold Start + scaffold: [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md). Cold Start needs: initiative name, asset category, primary metric, the measurable surface. Mode: [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md); `budget: standard`, `--fast` collapses Layer 1 to single-agent + skips Critic revision on clean PASS. **`--fast` does NOT skip** the 5 Critical Gates.

## Dispatch

Scaffold via `bun scripts/scaffold-pipeline.ts "<name>" [--category <cat>]` (writes `pipeline.md` + the shared loop tree; idempotent). Then per cycle: read state → dispatch the current stage's leaf skill → **stop at its gate** → on approval, advance **Current stage** + log the transition. At execute, apply the fork; at ingest, `forsvn-preview attach`; at evaluate, the matching `evaluate-*` appends a `results.tsv` row. Full sequence + resume rules: [`references/pipeline-spec.md`](references/pipeline-spec.md).

## Agent Manifest

| Agent (`agents/*.md`) | Layer | Focus |
|---|---|---|
| Pipeline Architect | 1 | Stage plan: which leaf skill per stage, category, gates, current pointer |
| Critic | 2 | Quality Gate above |

## Artifact Contract

Loop folder (shares the eval-loop tree; adds `pipeline.md`):

```text
.forsvn/loops/[slug]/
├── pipeline.md      # lifecycle: loop — stage program + current-stage pointer (THIS skill owns)
├── strategy/        # per-cycle brief/strategy artifacts
├── execution/       # per-cycle execution outputs (decision_state: pending)
├── evals/           # per-cycle eval snapshots (evaluate-* siblings)
├── results.tsv      # 8-column ledger (shared with run-eval-loop)
└── learnings.md     # lifecycle: learning; append-only
```

Frontmatter per [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md). **Cross-stack contract:** `results.tsv` schema changes ripple to `_shared/eval-loop-spec.md` — evaluate-* siblings consume it.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — pipeline scaffolded/resumed; stages mapped; current stage + next gate clear.
- **DONE_WITH_CONCERNS** — pipeline exists but a stage lacks a leaf skill, or the loop is open (no ingest).
- **NEEDS_CONTEXT** — missing initiative surface, asset category, or metric.
- **BLOCKED** — filesystem/scaffold failure or conflicting loop state.

## Next Step

Dispatch the **Current stage**'s leaf skill; on the human's gate decision, advance the pointer and log the transition. `run-eval-loop` remains the eval-only entry point — `run-pipeline` is the superset that also drives brief → execute → ingest.
