# Evaluate-Asset Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Metric Ingest | 1 (parallel) | `agents/metric-ingest-agent.md` | Confirms the asset is re-ingested + viewable; normalizes dimensions, format, engine, execution_mode, primary metric, baseline, and the brief's acceptance criteria (hard/soft). |
| Diagnosis | 1 (parallel; reads Metric Ingest output) | `agents/diagnosis-agent.md` | Checks the render against the brief's acceptance criteria (composition, copy slots, aspect ratio) + render-quality signals + brand-fit (palette, Leaf <10%, type, logo). |
| Recommendation | 2 | `agents/recommendation-agent.md` | Chooses keep / discard / watch / blocked + next-cycle action (re-render via produce-asset · fix the spec via brief-graphic · fix tokens via create-brand). |
| Critic | 3 | `agents/critic-agent.md` | Enforces the 7-dim rubric, return-leg discipline, brief-fidelity honesty, brand-fit integrity, ledger correctness, no fabricated visual claims. |

## Dispatch

1. Resolve loop path + next cycle number + asset/variant scope. Cycle number is `last results.tsv cycle + 1`.
2. **Layer 1 parallel:** Metric Ingest + Diagnosis. Metric Ingest confirms re-ingest + reads `program.md` guardrails; Diagnosis reads the source brief's acceptance criteria + the attached render + Layer-1's normalized packet.
3. **Layer 2:** Recommendation consumes Layer 1 outputs; proposes verdict + next-cycle action + ledger row + learning promotion.
4. **Layer 3:** Critic validates artifact, ledger row, learning update against the 7-dim rubric.
5. Critic FAIL → revise once. Still failing → write no ledger row, return `BLOCKED`.
6. Write eval artifact + append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning ONLY when Critic allows it.
8. Run `bun scripts/manifest-sync.ts`.

Side effects are ALL-OR-NOTHING on critic FAIL. Full per-layer dispatch tables + critic revision-cycle semantics + critic-override protocol: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).

## Critic 7-Dim Rubric

Full rubric (5 shared + 2 asset-specific) in [`rubric.md`](rubric.md). Shared frame in `references/_shared/evaluation-loop-rubric.md`.

Hard Fails:

- Scoring the prompt instead of the re-ingested render (Critical Gate 2 + Critic Hard Fail #2).
- A `keep` on a render missing a hard acceptance criterion (Critical Gate 5 + dim Brief-Fidelity Discrimination).
- Off-brand / broken render kept (dim Render-Quality & Brand-Fit).
- Missing source brief or fabricated acceptance criteria.
- Fabricated / hallucinated visual detail.
- Scope drift to produce-asset re-rendering (Critical Gate 8 + dim Decision Discipline).
- Lane drift into evaluate-shortform / evaluate-landing-page / evaluate-content territory (Critical Gate 4).

## Critic Override Protocol

Operator ships despite a critic FAIL → **log the override BEFORE writing the artifact or appending the ledger row**:

```bash
bun scripts/log-critic-override.ts --skill evaluate-asset …
```

Override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Three overrides → rubric-revision escalation. Full protocol: [`_shared/critic-override-protocol.md`](_shared/critic-override-protocol.md).
