# Evaluate-Campaign Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Metric Ingest | 1 (parallel) | `agents/metric-ingest-agent.md` | Normalizes primary metric, baseline, window, total spend, per-channel rollup table, source caveats, attribution model. |
| Diagnosis | 1 (parallel; reads Metric Ingest output) | `agents/diagnosis-agent.md` | Connects metrics to the plan-campaign artifact's hypothesis (objective, channel mix, budget split, sequencing) + channel-mix causation signals + unit-economics signals. |
| Recommendation | 2 | `agents/recommendation-agent.md` | Chooses keep / discard / watch / blocked + next-cycle action (reallocate budget · cut a rider channel · fix paid unit economics · route back to plan-campaign with revised channel mix). |
| Critic | 3 | `agents/critic-agent.md` | Enforces the 7-dim rubric, evidence discipline, loop boundary, ledger correctness, no fabricated analytics. |

## Dispatch

1. Resolve loop path + next cycle number + campaign scope. Cycle number is `last results.tsv cycle + 1` unless the user explicitly names a cycle with no existing eval artifact.
2. **Layer 1 parallel:** Metric Ingest + Diagnosis. Metric Ingest reads operator metrics + channel rollup + `program.md` guardrails; Diagnosis reads the source plan-campaign artifact's hypothesis + Layer-1's normalized metrics (Diagnosis waits for Metric Ingest's output, then runs).
3. **Layer 2:** Recommendation consumes Layer 1 outputs; proposes verdict + next-cycle action + ledger row + learning promotion.
4. **Layer 3:** Critic validates artifact, ledger row, learning update against the 7-dim rubric.
5. Critic FAIL → revise once. Still failing → write no ledger row, return `BLOCKED`.
6. Write eval artifact + append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning ONLY when Critic allows it.
8. Run `bun scripts/manifest-sync.ts`.

Side effects are ALL-OR-NOTHING on critic FAIL. Full per-layer dispatch tables + critic revision-cycle semantics + critic-override protocol: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).

## Critic 7-Dim Rubric

Full rubric (5 shared dims + 2 campaign-specific) in [`rubric.md`](rubric.md). Shared frame (pass gate, scoring scale, universal Hard Fails, falsifiability discipline) in `references/_shared/evaluation-loop-rubric.md`.

Hard Fails:

- Rider-channel contamination of the verdict (Critical Gate 5).
- Blended-CAC laundering of an underwater paid channel (dim Unit-Economics Discipline).
- Missing source plan-campaign artifact.
- Fabricated revenue attribution.
- Scope drift into asset-level eval (Critical Gate 2) or campaign re-planning (Critical Gate 8).

## Critic Override Protocol

Operator ships despite a critic FAIL → **log the override BEFORE writing the artifact or appending the ledger row**:

```bash
bun scripts/log-critic-override.ts --skill evaluate-campaign …
```

Override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Three overrides within rolling window → rubric-revision escalation. Full protocol: [`_shared/critic-override-protocol.md`](_shared/critic-override-protocol.md).
