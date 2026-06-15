# Multi-Agent Dispatch — breakdown-tasks

Procedural detail extracted from SKILL.md for `budget: standard` and `deep` runs. The orchestrator loads this at Layer 1 dispatch entry.

## Agent Roster

| Agent | File | Focus |
|---|---|---|
| decomposer-agent | `agents/decomposer-agent.md` | Splits features into atomic, right-sized tasks |
| dependency-mapper-agent | `agents/dependency-mapper-agent.md` | Maps dependency graph, finds hidden dependencies |
| ordering-agent | `agents/ordering-agent.md` | Merges tasks + deps into risk-first ordered list |
| acceptance-agent | `agents/acceptance-agent.md` | Writes precise, verifiable acceptance criteria |
| critic-agent | `agents/critic-agent.md` | Quality gate review, sizing check, coverage trace |

## Execution Layers

```
Layer 1 (parallel):
  decomposer-agent ────────┐
  dependency-mapper-agent ──┘── run simultaneously

Layer 2 (sequential):
  ordering-agent ──────────── merges task list + dependency graph
    → acceptance-agent ────── writes criteria for ordered tasks
      → critic-agent ─────── final quality review
```

## Dispatch Protocol

1. **Confirm scope mode** — FULL / LOCKED / MINIMAL. Default LOCKED if finished spec provided, MINIMAL if MVP mentioned.
2. **Extract Shared Context** — list architectural decisions every task references (routes, schema shape, key data models, auth approach, third-party service boundaries, deployment target). Source from `architecture/system-architecture.md` or conversation. Writes to the artifact's `## Shared Context` section so tasks reference without repeating or diverging.
3. **Layer 1 dispatch** — brief + scope mode + Shared Context → `decomposer-agent` and `dependency-mapper-agent` in parallel.
4. **Layer 2 sequential chain** — both outputs → `ordering-agent` → `acceptance-agent` → `critic-agent`.
5. **Revision loop** — if critic FAILs, re-dispatch ONLY the cited agents with feedback. Max 2 rounds. If still FAILs at round 2 → status DONE_WITH_CONCERNS or escalate (decomposition itself is wrong; more rounds won't fix it).
6. **Assembly** — merge into the artifact format per [`../task-format.md`](../task-format.md) [PROCEDURE]. Seed each task block with `**History:**` entry (`{{today}} · task-breakdown · created`). Save to `docs/forsvn/artifacts/meta/tasks.md`.

## Routing Rules

| Condition | Route |
|---|---|
| Scope mode MINIMAL | decomposer-agent actively cuts features before decomposing |
| Scope mode FULL | decomposer-agent captures everything; defer cuts to after |
| Scope mode LOCKED | decomposer-agent follows spec exactly; flags gaps but doesn't add |
| Critic PASS | Assemble and deliver |
| Critic FAIL | Re-dispatch cited agents with feedback |
| Revision round > 2 | Deliver with critic's remaining issues noted (DONE_WITH_CONCERNS) |

## Single-Agent Fallback (mode == fast OR <10 tasks expected)

When context is constrained or decomposition is simple:

1. Skip multi-agent dispatch
2. Confirm scope mode
3. Decompose using Task Format + Sizing Rules in [`../task-format.md`](../task-format.md) [PROCEDURE]
4. Map dependencies inline; order risk-first
5. Write acceptance criteria per task (templates: [`../acceptance-criteria.md`](../acceptance-criteria.md))
6. Run Critical Gates checklist as self-review (see SKILL.md)
7. Save to `docs/forsvn/artifacts/meta/tasks.md`
