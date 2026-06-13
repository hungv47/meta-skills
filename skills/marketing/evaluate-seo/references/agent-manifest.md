# Evaluate-SEO Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Metric Ingest | 1 (parallel) | `agents/metric-ingest-agent.md` | Normalizes primary metric, baseline, window (vs lag floor), visibility breakdown, keyword-cluster+surface tag, known core-update dates, source caveats. |
| Diagnosis | 1 (parallel; reads Metric Ingest output) | `agents/diagnosis-agent.md` | Connects metrics to the optimize-seo / monitor-aeo change's hypothesis + visibility-signal read + lag & volatility check (window vs floor, core-update overlap) + cross-surface context. |
| Recommendation | 2 | `agents/recommendation-agent.md` | Chooses keep / discard / watch / blocked + next-cycle target (optimize-seo on-page · monitor-aeo tracking · write-copy depth), applying the lag/volatility gate. |
| Critic | 3 | `agents/critic-agent.md` | Enforces the 7-dim rubric, evidence discipline, loop boundary, ledger correctness, the lag-and-volatility gate, no fabricated ranking data. |

## Dispatch

1. Resolve loop path + next cycle number + cluster+surface scope. Cycle number is `last results.tsv cycle + 1`.
2. **Layer 1 parallel:** Metric Ingest + Diagnosis. Metric Ingest reads operator metrics + `program.md` guardrails + the lag floor; Diagnosis reads the source change's hypothesis + Layer-1's normalized metrics.
3. **Layer 2:** Recommendation consumes Layer 1 outputs; proposes verdict + next-cycle target + ledger row + learning promotion + the lag/volatility gate.
4. **Layer 3:** Critic validates artifact, ledger row, learning update against the 7-dim rubric.
5. Critic FAIL → revise once. Still failing → write no ledger row, return `BLOCKED`.
6. Write eval artifact + append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning ONLY when Critic allows it.
8. Run `bun scripts/manifest-sync.ts`.

Side effects are ALL-OR-NOTHING on critic FAIL. Full per-layer dispatch tables + critic revision-cycle semantics + critic-override protocol: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).

## Critic 7-Dim Rubric

Full rubric (5 shared + 2 SEO-specific) in [`rubric.md`](rubric.md). Shared frame in `references/_shared/evaluation-loop-rubric.md`.

Hard Fails:

- Impression / keyword-count vanity read as success (Critical Gate 5 + dim Visibility-Signal Discrimination).
- A `keep` on a sub-lag-floor window or a core-update-confounded move (Critical Gate 6 + dim Lag & Volatility Discipline).
- Cross-cluster/surface contamination of the verdict (Critical Gate 4).
- Missing source optimize-seo / monitor-aeo artifact.
- Fabricated ranking / click / citation data.
- Scope drift to optimize-seo fixes (Critical Gate 8 + dim Decision Discipline).
- Lane drift into evaluate-content / evaluate-ad / optimize-seo territory.

## Critic Override Protocol

Operator ships despite a critic FAIL → **log the override BEFORE writing the artifact or appending the ledger row**:

```bash
bun scripts/log-critic-override.ts --skill evaluate-seo …
```

Override never promotes a contested cycle to `keep`, and never relaxes the lag gate. A no-override FAIL still returns `BLOCKED`. Three overrides → rubric-revision escalation. Full protocol: [`_shared/critic-override-protocol.md`](_shared/critic-override-protocol.md).
