---
name: run-pipeline
description: "Orchestrates a closed-loop marketing/content initiative end to end — each stage a leaf skill — pausing at the execution fork and the human review gate. Use to thread a produce-and-measure loop, or --eval-only to scaffold just the loop workspace (improvement loop, experiment ledger) in .forsvn/loops/[slug]/. Not for one-shot artifacts (use the leaf skill) or debate (use debate-agents)."
argument-hint: "[initiative name + asset type, e.g. 'launch hero image' or 'founder outbound sequence'] [--category image|video|design|publish|research] [--eval-only]"
allowed-tools: Read Write Edit Grep Glob Bash
disable-model-invocation: true
metadata:
  version: "1.2.0"
  budget: standard
  estimated-cost: "$0.20-0.90"
---

# Run Pipeline — Closed-Loop Orchestrator

*Meta process skill. Threads the staged spine into one resumable loop — sequences leaf skills, stops at every gate, records the loop tree; it does NOT do each stage's work. Orchestrate, don't fuse (CLOSED-LOOP.md §2).*

**Core Question:** "Can a future agent resume this from one loop folder — the live stage, the gate it waits on, what shipped — instead of re-deriving the chain?"

> Stage model, gate rules, loop-tree contract: [`references/pipeline-spec.md`](references/pipeline-spec.md) [SPEC]. Shares the schema in `_shared/eval-loop-spec.md`.

## Critical Gates

1. **Orchestrate, don't fuse.** Each stage dispatches its leaf skill (`research-*`, `brief-*`/`write-*`, `produce-*`, `evaluate-*`); this skill owns only sequencing + `pipeline.md`.
2. **Stop at every gate — never auto-approve.** Execute pauses for the **execution fork** (`_shared/execution-fork.md`); brief/execute outputs land `decision_state: pending` (architecture §9.2). Guard this here, not in the leaf.
3. **Fork is registry-gated.** `list_tools(category)` per `_shared/tool-registry-spec.md`: 0 verified → **Brief-only**; ≥1 → offer Assisted/Direct. Degrade cleanly.
4. **Close the loop.** Evaluate scores the **re-ingested real asset** (return-leg §6), not the brief. No ingest → open loop; flag it.
5. **Shared tree, no new store.** State lives in `.forsvn/loops/[slug]/`. No database.

## Quality Gate

Critic (`agents/critic-agent.md`) PASS/FAIL:

- [ ] **Stage integrity** — all 6 stages named, each maps to a real leaf skill or gate; current-stage pointer present.
- [ ] **Gate discipline** — execute + brief stages marked with their gate; no auto-approve.
- [ ] **Resumability** — `pipeline.md` alone tells a fresh agent the live stage + next action.
- [ ] **Schema integrity** — `results.tsv` 8-col header matches the evaluate-* contract.
- [ ] **Loop closure** — ingest stage present so the evaluator scores the shipped asset.

FAIL → revise `pipeline.md` once, re-score. Eval-only runs are gated by the Eval Loop Critic instead (`agents/eval-loop-critic-agent.md`, all dimensions ≥ 8/10).

## Before Starting

Prior loop folder in `.forsvn/loops/[slug]/` → resume (read **Current stage**), don't re-scaffold. Verified engines (`list_tools`) decide the fork options. Manifest stale → `bun bin/manifest-sync.ts`. Full: `references/_shared/before-starting-check.md` [PLAYBOOK].

## Pre-Dispatch

Warm/Cold Start: `references/_shared/pre-dispatch-protocol.md`. Cold Start needs: initiative name, asset category, primary metric, the measurable surface (eval-only adds mutable/frozen surface + baseline — see the mode reference). Mode: `references/_shared/mode-resolver.md`; `--fast` collapses Layer 1 + skips Critic revision on clean PASS, **never** the 5 Critical Gates.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Dispatch

Scaffold via `bun scripts/scaffold-pipeline.ts "<name>" [--category <cat>]` (idempotent). Per cycle: read state → dispatch the current stage's leaf → **stop at its gate** → on approval, advance **Current stage** + log the transition. At execute, the fork; at ingest, `forsvn-preview attach`; at evaluate, the matching `evaluate-*` appends a `results.tsv` row. Full sequence + resume rules: `references/pipeline-spec.md`.

## Eval-Only Mode

`--eval-only` (or an eval-scaffold ask: improvement loop, experiment ledger, loop workspace) scaffolds/resumes the loop workspace **without** `pipeline.md` or the execute/ingest stages, via `scripts/scaffold-eval-loop.ts`. Gates, cold-start bundle, agents, loop-file conventions, upgrade path: [`references/eval-only-mode.md`](references/eval-only-mode.md) [PROCEDURE]. Per-cycle scoring still routes to the matching `evaluate-*` sibling.

## Agent Manifest

| Agent (`agents/*.md`) | Mode | Focus |
|---|---|---|
| Pipeline Architect → Critic | full loop | Stage plan → Quality Gate above |
| Loop Architect + Metric Designer → Scope Guard → Eval Loop Critic | eval-only | Loop contract + measurement plan → boundary + rubric |

## Artifact Contract

Loop folder layout (`pipeline.md` is the one artifact THIS skill owns; eval-only creates the same tree minus it): `references/pipeline-spec.md` § Shared loop tree. Frontmatter per `_shared/artifact-contract-template.md`. **Cross-stack contract:** `results.tsv` schema changes ripple to `_shared/eval-loop-spec.md` — evaluate-* siblings consume it.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — fusing a stage, auto-approving a gate, closing a loop without ingest, metric-less loops, skill-centered folders, hand-edited ledgers.

## Worked Example

"Launch hero image" end to end, plus the eval-only entry on the same tree: [`references/examples/closed-loop-walkthrough.md`](references/examples/closed-loop-walkthrough.md) [EXAMPLE].

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — pipeline (or eval-only loop) scaffolded/resumed; current stage + next gate clear.
- **DONE_WITH_CONCERNS** — a stage lacks a leaf skill, the loop is open (no ingest), or the metric/baseline is weak.
- **NEEDS_CONTEXT** — missing initiative surface, asset category, or metric.
- **BLOCKED** — filesystem/scaffold failure or conflicting loop state.

## Next Step

Dispatch the **Current stage**'s leaf skill; on the human's gate decision, advance the pointer and log the transition. Eval-only loops: dispatch the cycle's strategy or brief-* skill, then the matching evaluate-* sibling — `keep` rows promote into `learnings.md`.
