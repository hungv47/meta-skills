# Evaluate-Outreach Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Metric Ingest | 1 (parallel) | `agents/metric-ingest-agent.md` | Normalizes primary metric, baseline, sends, window, reply breakdown, channel+segment tag, deliverability + compliance evidence, source caveats. |
| Diagnosis | 1 (parallel; reads Metric Ingest output) | `agents/diagnosis-agent.md` | Connects metrics to the write-outreach sequence's hypothesis (subject, opener, CTA, step) + reply-quality signals + deliverability/compliance + cross-channel context. |
| Recommendation | 2 | `agents/recommendation-agent.md` | Chooses keep / discard / watch / blocked + next-cycle action (revise subject · reorder steps · fix the list via research-icp), applying the deliverability/compliance gate. |
| Critic | 3 | `agents/critic-agent.md` | Enforces the 7-dim rubric, evidence discipline, loop boundary, ledger correctness, the deliverability/compliance gate, no fabricated reply data. |

## Dispatch

1. Resolve loop path + next cycle number + channel+segment scope. Cycle number is `last results.tsv cycle + 1`.
2. **Layer 1 parallel:** Metric Ingest + Diagnosis. Metric Ingest reads operator metrics + `program.md` guardrails + deliverability/compliance evidence; Diagnosis reads the source write-outreach hypothesis + Layer-1's normalized metrics.
3. **Layer 2:** Recommendation consumes Layer 1 outputs; proposes verdict + next-cycle action + ledger row + learning promotion + the deliverability/compliance gate.
4. **Layer 3:** Critic validates artifact, ledger row, learning update against the 7-dim rubric.
5. Critic FAIL → revise once. Still failing → write no ledger row, return `BLOCKED`.
6. Write eval artifact + append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning ONLY when Critic allows it.
8. Run `bun scripts/manifest-sync.ts`.

Side effects are ALL-OR-NOTHING on critic FAIL. Full per-layer dispatch tables + critic revision-cycle semantics + critic-override protocol: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).

## Critic 7-Dim Rubric

Full rubric (5 shared + 2 outreach-specific) in [`rubric.md`](rubric.md). Shared frame in `references/_shared/evaluation-loop-rubric.md`.

Hard Fails:

- Open-rate / raw-reply vanity read as success (Critical Gate 6 + dim Reply-Quality Discrimination).
- A `keep` despite a deliverability red flag or compliance violation (dim Deliverability & Compliance).
- Cross-channel/segment contamination of the verdict (Critical Gate 4).
- Scoring a draft (not-sent) sequence (Critical Gate 2).
- Missing source write-outreach artifact.
- Fabricated reply / bounce / compliance data.
- Scope drift to write-outreach authorship (Critical Gate 8 + dim Decision Discipline).

## Critic Override Protocol

Operator ships despite a critic FAIL → **log the override BEFORE writing the artifact or appending the ledger row**:

```bash
bun scripts/log-critic-override.ts --skill evaluate-outreach …
```

Override never promotes a contested cycle to `keep`, and never relaxes the deliverability/compliance gate. A no-override FAIL still returns `BLOCKED`. Three overrides → rubric-revision escalation. Full protocol: [`_shared/critic-override-protocol.md`](_shared/critic-override-protocol.md).
