# Agent Manifest — Design Lifecycle

[PROCEDURE] — agent table, dispatch graph, routes, critic loop. Loaded at Layer-1 dispatch entry.

## Agents

| Agent | Layer | Reads | Produces |
|-------|-------|-------|----------|
| **flow-architect** | 1 (solo) | `references/flow-patterns.md`, `references/anti-patterns.md`, product-context, ICP | Activation Anchor + Flow Map + Branch Logic + Exit Summary |
| **copy** | 2 (sequential after architect) | architect map, `references/copy-rules.md`, BRAND.md | Per-step Step Copy + Voice Check |
| **measurement** | 2 (parallel with copy) | architect map, `references/measurement.md` | Primary Metric + Holdout + Per-step diagnostics + Decision Rules |
| **critic** | 3 (gate) | assembled flow, `references/rubric.md`, `references/anti-patterns.md` | PASS / FAIL + scorecard + named re-dispatch |

## Dispatch graph

```
Pre-Dispatch (orchestrator) — resolve flow-type, activation-metric, entry-trigger, product events
        │
   Layer 1: flow-architect  → Activation Anchor + Flow Map + Branches + Exits
        │
   Layer 2 (parallel):
        ├── copy        → per-step copy (reads architect map)
        └── measurement → metric + holdout + diagnostics + decision rules
        │
   Assemble (orchestrator) → full flow document
        │
   Layer 3: critic → 6-dim scorecard + 4 hard gates
        │
   PASS → write artifact   |   FAIL → re-dispatch named agent (max 2 cycles)
```

## Routes

- **Route A — compose.** Default. Full Pre-Dispatch → 4-agent pipeline → critic gate → artifact. Used when the operator asks to design a lifecycle flow directly.
- **Route B — called by another skill.** `plan-campaign` selecting the Mailbox channel calls design-lifecycle to design the actual flow for that channel. The caller supplies flow-type + the campaign's activation goal; design-lifecycle runs Layers 1–3 and returns the flow map + measurement plan for embedding. No re-interrogation of context the caller already has.

## Critic loop

- Critic returns PASS or FAIL. FAIL names the offending dimension/gate, the exact fix, and the agent to re-dispatch.
- **Max 2 rewrite cycles.** After cycle 2, if still failing, ship `DONE_WITH_CONCERNS` with the unresolved failure documented in the artifact, OR `BLOCKED` if a hard gate can't be satisfied (e.g. no measurable activation event exists).
- Hard-gate failures (suppression / consent / single-metric / no-send) are not score-able — any one fails the whole flow regardless of total.

## `--fast` behavior

Single inline pass: one flow path (no branch enumeration), architect + copy + measurement folded into one generation, no rewrite loop. **Does NOT skip:** Cold Start, the activation-metric/entry-trigger hard block, or the consent/PII gate.
