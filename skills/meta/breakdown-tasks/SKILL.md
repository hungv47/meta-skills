---
name: breakdown-tasks
description: "Decomposes a spec or architecture into buildable tasks with acceptance criteria, dependencies, and risk-first implementation order, for AI agents or human engineers. Produces `.forsvn/artifacts/meta/tasks.md`. Use once requirements are clear and you need an execution plan. Not for clarifying unclear requirements (use discover) or designing architecture (use architect-system). For code review after building, see review-work."
argument-hint: "[spec or architecture to decompose]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "2.0.0"
  budget: standard
  estimated-cost: "$0.15-0.50"
---

# Task Breakdown — Orchestrator

*Productivity — Multi-agent orchestration. Break architecture into executable tasks; consumers implement them one at a time.*

**Core Question:** "Can an engineer pick up any single task and ship it independently?"

[Read `references/playbook.md` [PLAYBOOK] to understand methodology (risk-first ordering, vertical slices, stable IDs forever, multi-agent dispatch rationale), principles, when NOT to use.]

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — load [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. `budget: standard` default. **Auto-downgrade to fast** when decomposition is small (<10 tasks expected, single feature, no upstream artifacts) → Single-Agent Fallback path below. **Auto-escalate to deep** when scope is multi-feature roadmap with cross-feature dependencies (engages full Multi-Agent + likely revision loop). Emit:
   ```
   Resolved mode: <fast|standard|deep> (<reason>). Run as <mode>? [Y / fast / standard / deep]
   ```
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches inventory.
2. Read `architecture/system-architecture.md` + `.forsvn/artifacts/meta/specs/*.md` + every `.forsvn/artifacts/product/flow/*.md`. If none exist AND conversation has no source → recommend `/discover` or `/architect-system` first.
3. Read existing `.forsvn/artifacts/meta/tasks.md` if present — re-run behavior (additive vs snapshot) decision lives in [`references/task-format.md`](references/task-format.md) §"Re-run behavior".
4. No `experience/` dimension read — task-breakdown is project-specific, not user-profile-driven.

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta/tasks.md` (single file, edited in place across runs)
- **Lifecycle:** `pipeline` (re-edited as work progresses; not a dated snapshot. Full re-decomposition snapshots prior version to `tasks.v[N].md` per task-format.md re-run behavior)
- **Frontmatter fields:** `skill`, `version`, `date`, `status`, `stack` (=meta), `review_surface` (=md), `decision_state`, `review_tool`, `reviewed_at`, `reviewer`. Full schema + Status Index + Shared Context + Task block format: [`references/task-format.md`](references/task-format.md) [PROCEDURE].
- **Required sections:** Status Index (the source-of-truth table for resume protocol), Shared Context (architectural decisions every task references), Tasks (sibling `###` blocks with stable IDs).
- **Consumed by:** fresh engineering sessions (Claude Code / coding agents / human devs) running the Resume Protocol from [`references/execution-protocol.md`](references/execution-protocol.md); orchestrators batching AFK tasks; operator (status visibility); fresh-eyes (scope-drift detection against UNPLANNED changes).
- **Eval workspace:** none — task-breakdown produces a plan, not a measurable initiative.
- **Review:** This `pipeline` artifact carries the review machinery but `decision_state` defaults to `not_required` — most runs are regenerable drafts. The `## Review Gate` block and review fields ship in the template so the operator or a loop can opt a run into review by setting `decision_state: pending`. Field semantics: [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md); review procedure: [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md).

## Pre-Dispatch

Run the Pre-Dispatch protocol ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE]) before dispatching agents.

**Needed dimensions:** source (architecture / spec / conversation), scope mode (FULL / LOCKED / MINIMAL), autonomy bias (mostly AFK / mixed / mostly HITL), audience (AI agent / human dev / mixed).

**Warm Start** (architecture or spec exists, scope clear from upstream):

```
Found:
- architecture → "[1-line summary]"
- declared scope → "[FULL | LOCKED | MINIMAL, from spec or conversation]"

Proceeding with these. Override scope mode or autonomy bias, or proceed?
```

**Cold Start** (no upstream artifacts, no session context):

```
task-breakdown decomposes work into buildable tasks with stable IDs, deps,
acceptance criteria, and autonomy classification. Before I dispatch:

1. **Source** — paste the architecture/spec, name a file path, or describe
   the work in 2-3 paragraphs. Defer to `/discover` first if requirements
   are still fuzzy — task-breakdown won't conduct an interview.
2. **Scope mode** — FULL (capture everything), LOCKED (build exactly what's
   spec'd, flag gaps but don't add), or MINIMAL (actively cut to MVP)?
3. **Autonomy bias** — mostly AFK, mixed, or mostly HITL?
4. **Audience** — AI agents, human devs, or both?

Answer 1-4 in one response. I'll decompose.
```

**Write-back:** none. Task lists are project-specific, not user-profile.

## Multi-Agent Architecture

### Agent Roster

| Agent | File | Focus |
|---|---|---|
| decomposer-agent | `agents/decomposer-agent.md` | Splits features into atomic, right-sized tasks |
| dependency-mapper-agent | `agents/dependency-mapper-agent.md` | Maps dependency graph, finds hidden dependencies |
| ordering-agent | `agents/ordering-agent.md` | Merges tasks + deps into risk-first ordered list |
| acceptance-agent | `agents/acceptance-agent.md` | Writes precise, verifiable acceptance criteria |
| critic-agent | `agents/critic-agent.md` | Quality gate review, sizing check, coverage trace |

### Execution Layers

```
Layer 1 (parallel):
  decomposer-agent ────────┐
  dependency-mapper-agent ──┘── run simultaneously

Layer 2 (sequential):
  ordering-agent ──────────── merges task list + dependency graph
    → acceptance-agent ────── writes criteria for ordered tasks
      → critic-agent ─────── final quality review
```

### Dispatch Protocol

1. **Confirm scope mode** — FULL / LOCKED / MINIMAL. Default LOCKED if finished spec provided, MINIMAL if MVP mentioned.
2. **Extract Shared Context** — list architectural decisions every task references (routes, schema shape, key data models, auth approach, third-party service boundaries, deployment target). Source from `architecture/system-architecture.md` or conversation. Writes to the artifact's `## Shared Context` section so tasks reference without repeating or diverging.
3. **Layer 1 dispatch** — brief + scope mode + Shared Context → `decomposer-agent` and `dependency-mapper-agent` in parallel.
4. **Layer 2 sequential chain** — both outputs → `ordering-agent` → `acceptance-agent` → `critic-agent`.
5. **Revision loop** — if critic FAILs, re-dispatch ONLY the cited agents with feedback. Max 2 rounds. If still FAILs at round 2 → status DONE_WITH_CONCERNS or escalate (decomposition itself is wrong; more rounds won't fix it).
6. **Assembly** — merge into the artifact format per [`references/task-format.md`](references/task-format.md) [PROCEDURE]. Seed each task block with `**History:**` entry (`{{today}} · task-breakdown · created`). Save to `.forsvn/artifacts/meta/tasks.md`.

### Routing Rules

| Condition | Route |
|---|---|
| Scope mode MINIMAL | decomposer-agent actively cuts features before decomposing |
| Scope mode FULL | decomposer-agent captures everything; defer cuts to after |
| Scope mode LOCKED | decomposer-agent follows spec exactly; flags gaps but doesn't add |
| Critic PASS | Assemble and deliver |
| Critic FAIL | Re-dispatch cited agents with feedback |
| Revision round > 2 | Deliver with critic's remaining issues noted (DONE_WITH_CONCERNS) |

## Critical Gates

Before delivering, the critic-agent verifies ALL of these pass:

- [ ] Every task has exactly ONE acceptance test
- [ ] No task depends on something not yet defined
- [ ] Risky/uncertain work is front-loaded
- [ ] All external config is in Prerequisites, not buried in tasks
- [ ] A junior dev could verify each acceptance criterion
- [ ] No task requires unstated knowledge to complete
- [ ] Tasks are vertical slices (each delivers a testable increment through all layers). Horizontal-only tasks require explicit justification.

**On gate fail:** critic identifies the agent to fix; orchestrator re-dispatches with specific feedback per Dispatch Protocol step 5.

## Single-Agent Fallback (mode == fast OR <10 tasks expected)

When context is constrained or decomposition is simple:

1. Skip multi-agent dispatch
2. Confirm scope mode
3. Decompose using Task Format + Sizing Rules in [`references/task-format.md`](references/task-format.md) [PROCEDURE]
4. Map dependencies inline; order risk-first
5. Write acceptance criteria per task (templates: [`references/acceptance-criteria.md`](references/acceptance-criteria.md))
6. Run Critical Gates checklist as self-review
7. Save to `.forsvn/artifacts/meta/tasks.md`

## Execution Hand-off

`breakdown-tasks` is a **planner**, not a runner. After `tasks.md` ships, whatever picks it up next — fresh Claude Code session, coding agent, human dev — owns execution. Do **not** re-run this skill to implement tasks.

The operating manual for consumers of `tasks.md` lives at [`references/execution-protocol.md`](references/execution-protocol.md). It covers: Resume Protocol, Per-Task Protocol, Update/Remove/Reopen, Concurrency model, Staleness check, Coding Rules / When Stuck / Scope Change. Agents implementing tasks read that file top-to-bottom before claiming the first row.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any task that smells off.

## Worked Example

See [`references/examples/decompose-walkthrough.md`](references/examples/decompose-walkthrough.md) [EXAMPLE] — Todo app decomposed end-to-end through Layer 1 (parallel decomposer + dependency-mapper with hidden-dep detection) + Layer 2 (ordering → acceptance → critic PASS) + final `tasks.md` artifact format.

## Completion Status

Every run ends with explicit status:
- **DONE** — all tasks decomposed, sized, ordered with deps, acceptance criteria written; critic PASS first or second round
- **DONE_WITH_CONCERNS** — decomposition complete but: sizing ambiguity, fuzzy dependencies, acceptance criteria the user should sanity-check, OR critic FAILed at round 2 with remaining issues noted
- **BLOCKED** — work too large or under-specified to decompose; needs scope reduction or further discovery
- **NEEDS_CONTEXT** — missing spec, architecture, or product-context; recommend `discover` or `architect-system` first

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill, methodology, principles, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — fast/standard/deep semantics
- [`references/task-format.md`](references/task-format.md) [PROCEDURE] — full tasks.md schema (Status Index, task blocks, status field, transition rules, Sizing Rules, Autonomy classification, Content Rules, PM Feedback Format, re-run behavior)
- [`references/sizing-examples.md`](references/sizing-examples.md) — right-sized vs wrong-sized worked examples
- [`references/dependency-patterns.md`](references/dependency-patterns.md) — dependency shapes + hidden dep detection
- [`references/acceptance-criteria.md`](references/acceptance-criteria.md) — acceptance criteria templates by task type
- [`references/execution-protocol.md`](references/execution-protocol.md) — operating manual for consumers of `tasks.md` (read by implementing agents, not task-breakdown itself)
- [`references/examples/decompose-walkthrough.md`](references/examples/decompose-walkthrough.md) [EXAMPLE] — Todo app worked example
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — decomposition + orchestration failure modes
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE] — canonical Pre-Dispatch contract
- `agent-skills/CLAUDE.md` §"Artifact Placement" — lifecycle taxonomy (umbrella dependency; not shipped under `npx skills add` standalone install; the `pipeline` lifecycle this skill emits is fully documented inline above)
