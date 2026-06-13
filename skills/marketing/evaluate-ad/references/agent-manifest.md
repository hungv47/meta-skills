# Evaluate-Ad Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Metric Ingest | 1 (parallel) | `agents/metric-ingest-agent.md` | Normalizes primary metric, baseline, spend, window, frequency, audience-temp tag, source caveats. |
| Diagnosis | 1 (parallel; reads Metric Ingest output) | `agents/diagnosis-agent.md` | Connects metrics to the ad-copy artifact's hypothesis (hook, audience-temp framing, CTA) + creative-fatigue signals + audience-match signals. |
| Recommendation | 2 | `agents/recommendation-agent.md` | Chooses keep / discard / watch / blocked + next-cycle action (rotate creative · refresh hook · shift budget · kill · route back to write-ad with revised brief). |
| Critic | 3 | `agents/critic-agent.md` | Enforces the 7-dim rubric, evidence discipline, loop boundary, ledger correctness, no fabricated analytics. |

## Dispatch

1. Resolve loop path + next cycle number + audience-temp scope. Cycle number is `last results.tsv cycle + 1`.
2. **Layer 1 parallel:** Metric Ingest + Diagnosis. Metric Ingest reads operator metrics + `program.md` guardrails; Diagnosis reads source ad-copy artifact's hypothesis + Layer-1's normalized metrics.
3. **Layer 2:** Recommendation consumes Layer 1 outputs; proposes verdict + next-cycle action + ledger row + learning promotion.
4. **Layer 3:** Critic validates artifact, ledger row, learning update against the 7-dim rubric.
5. Critic FAIL → revise once. Still failing → write no ledger row, return `BLOCKED`.
6. Write eval artifact + append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning ONLY when Critic allows it.
8. Run `bun scripts/manifest-sync.ts`.

Side effects are ALL-OR-NOTHING on critic FAIL. Full per-layer dispatch tables + critic revision-cycle semantics + critic-override protocol: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).

## Critic 7-Dim Rubric

Full rubric (5 shared + 2 ad-specific) in [`rubric.md`](rubric.md). Shared frame in `references/_shared/evaluation-loop-rubric.md`.

Hard Fails:

- Mixed-audience contamination (Critical Gate 4 + dim Audience-Temp Fidelity).
- Confidence inflation on low-spend windows (Critical Gate 6 + dim Attribution Honesty).
- Scope drift to write-ad authorship (Critical Gate 7 + dim Decision Discipline).
- Missing source ad-copy artifact.
- Fabricated attribution.

## Critic Override Protocol

Operator ships despite a critic FAIL → **log the override BEFORE writing the artifact or appending the ledger row**:

```bash
bun scripts/log-critic-override.ts --skill evaluate-ad …
```

Override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Three overrides → rubric-revision escalation. Full protocol: [`_shared/critic-override-protocol.md`](_shared/critic-override-protocol.md).
