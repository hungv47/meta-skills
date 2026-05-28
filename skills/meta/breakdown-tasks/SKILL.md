---
name: breakdown-tasks
description: "Decomposes a spec or architecture into buildable tasks with acceptance criteria, dependencies, and risk-first implementation order, for AI agents or human engineers. Produces `.forsvn/artifacts/meta/tasks.md`. Use once requirements are clear and you need an execution plan. Not for clarifying unclear requirements (use discover) or designing architecture (use architect-system). For code review after building, see review-work."
argument-hint: "[spec or architecture to decompose]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.15-0.50"
---

# Task Breakdown — Orchestrator

*Productivity — multi-agent orchestration. Break architecture into executable tasks; consumers implement one at a time.*

**Core Question:** "Can an engineer pick up any single task and ship it independently?"

> Methodology (risk-first, vertical slices, stable IDs, multi-agent rationale), principles, when NOT to use: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

**Capabilities surfaced:** decompose, task-breakdown, sprint-plan, work-breakdown, acceptance criteria, task dependencies, implementation order, risk-first ordering.

## Critical Gates

Critic-agent verifies ALL before delivery:

- [ ] Every task has exactly ONE acceptance test
- [ ] No task depends on something not yet defined
- [ ] Risky/uncertain work is front-loaded
- [ ] All external config is in Prerequisites, not buried in tasks
- [ ] A junior dev could verify each acceptance criterion
- [ ] No task requires unstated knowledge
- [ ] Tasks are vertical slices (each delivers a testable increment through all layers); horizontal-only needs explicit justification

**On fail:** critic names the agent; orchestrator re-dispatches with feedback. Max 2 rounds; round >2 → DONE_WITH_CONCERNS.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK]:

| # | Action |
|---|---|
| 0 | Mode resolve per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md). Default `standard`. Downgrade to `fast` (<10 tasks, single feature, no upstream) → Single-Agent Fallback. Escalate to `deep` for multi-feature roadmaps with cross-feature deps. |
| 1 | Read `implementation-roadmap/canonical-paths.md` if present. |
| 2 | Read `architecture/system-architecture.md` + `.forsvn/artifacts/meta/specs/*.md` + `.forsvn/artifacts/product/flow/*.md`. None + no source in chat → recommend `/discover` or `/architect-system`. |
| 3 | Read existing `.forsvn/artifacts/meta/tasks.md` — re-run behavior in [`references/task-format.md`](references/task-format.md) §"Re-run behavior". |
| 4 | No `experience/` read — project-specific. |

## Pre-Dispatch

Per [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE]. Warm/Cold Start prompts, dimensions, write-back: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Multi-Agent Architecture

5 agents, 2 layers (decomposer + dependency-mapper parallel → ordering → acceptance → critic). Agent Roster, Execution Layers, 6-step Dispatch Protocol, Routing Rules, Single-Agent Fallback: [`references/procedures/multi-agent-dispatch.md`](references/procedures/multi-agent-dispatch.md) [PROCEDURE].

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta/tasks.md` (single file; edited in place; full re-decomposition snapshots prior to `tasks.v[N].md`)
- **Lifecycle:** `pipeline`
- **Frontmatter:** `skill`, `version`, `date`, `status`, `stack` (=meta), `review_surface` (=md), `decision_state`, `review_tool`, `reviewed_at`, `reviewer`. Schema + Status Index + Shared Context + task-block format: [`references/task-format.md`](references/task-format.md) [PROCEDURE].
- **Required sections:** Status Index (source-of-truth for resume), Shared Context (decisions every task references), Tasks (sibling `###` blocks, stable IDs).
- **Consumed by:** fresh engineering sessions running Resume Protocol from [`references/execution-protocol.md`](references/execution-protocol.md); orchestrators batching AFK; operator; fresh-eyes.
- **Review:** `decision_state: not_required` default — most runs are regenerable drafts. Semantics: [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md); procedure: [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md).

## Execution Hand-off

**Planner, not runner.** After `tasks.md` ships, the next consumer owns execution. Do not re-run this skill to implement. Operating manual: [`references/execution-protocol.md`](references/execution-protocol.md) (Resume, Per-Task, Update/Remove/Reopen, Concurrency, Staleness, Coding Rules).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — re-read before any task that smells off.

## Worked Example

[`references/examples/decompose-walkthrough.md`](references/examples/decompose-walkthrough.md) [EXAMPLE] — Todo app, end-to-end Layer 1 + Layer 2 + critic PASS.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

Every run ends with explicit status:
- **DONE** — tasks decomposed, sized, ordered, deps + criteria written; critic PASS round 1 or 2
- **DONE_WITH_CONCERNS** — complete but sizing/dep/criteria ambiguity, or critic FAILed round 2
- **BLOCKED** — work too large/under-specified; needs scope reduction or further discovery
- **NEEDS_CONTEXT** — missing spec/architecture/product-context; recommend `discover` or `architect-system`

## Next Step

Hand off `tasks.md` to implementing agent/dev with the Resume Protocol pointer. Do not re-invoke for the same scope unless re-decomposing.

## References

- `references/`: `playbook.md` [PLAYBOOK], `task-format.md` [PROCEDURE], `execution-protocol.md`, `anti-patterns.md` [ANTI-PATTERN], `{sizing-examples, dependency-patterns, acceptance-criteria}.md`
- `references/procedures/{multi-agent-dispatch, pre-dispatch}.md` [PROCEDURE]
- `references/examples/decompose-walkthrough.md` [EXAMPLE]
- `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol, reviewable-artifact-contract, roughdraft-review-protocol}.md`
