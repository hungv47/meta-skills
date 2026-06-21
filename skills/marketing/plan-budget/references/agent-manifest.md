# Plan-Budget Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Allocator | 1 (solo) | `agents/allocator.md` | Builds the Sourcing Ledger, fits each channel's marginal-CAC curve position, proposes the dollar split by equalizing marginal return subject to floors, and drafts reallocation triggers. Routes unsourced channels into capped hypothesis lanes — never invents a CAC. |
| Constraint Checker | 2 (sequential, hard-gate) | `agents/constraint-checker.md` | Bounds the proposal: min-viable floors, the §0 channel-fit veto, the concentration cap, the mixed-objective pool split, and the absolute no-autonomous-spend gate. PASS / REVISION_REQUIRED / HARD_STOP. |
| Critic | 2 (sequential, gate) | `agents/critic.md` | 7-dim quantitative rubric scoring; PASS/FAIL with a scorecard and agent-routed rewrite feedback. |

## Routes

### Route A — quick (≤3 channels, operator-supplied CACs)

```
1. Pre-Dispatch (per procedures/pre-dispatch.md) — classify each CAC as sourced | unsourced
2. LAYER 1 — allocator SOLO (sourcing ledger + marginal curve + split + triggers)
3. LAYER 2 — SEQUENTIAL: constraint-checker → critic
4. Constraint-checker REVISION_REQUIRED → re-dispatch allocator (does NOT consume critic cycle)
4a. Constraint-checker HARD_STOP → escalate to user (a fired §0 veto / a spend-shaped action)
5. Critic FAIL → re-dispatch per the critic's Rewrite Routing (max 2 cycles)
6. Write the artifact (allocation + marginal-return rationale + reallocation triggers)
7. Deliver the allocation + the reallocation triggers inline
```

### Route B — full (campaign-plan + measure-results grounded)

```
1. Pre-Dispatch: read campaign-plan.md (selected channel set + §0 vetoes) + .forsvn/performance/*.tsv (sourced CAC per channel)
2. Execute Route A with the grounded inputs; sourced-CAC count drives sourced | mixed | hypothesis-only labeling
3. Deliver; the artifact's cac_sourcing field records the grounding quality
```

### Route C — called by another skill

```
1. Read the calling skill's context (budget + objective + selected channels)
2. Reuse a cached docs/forsvn/artifacts/marketing/plan-budget/ allocation if fresh; else run Route B
3. Return the allocation (per-channel weight + triggers) to the calling skill
```

## 7-Dim Critic Rubric

Total ≥49/70 AND every dim ≥6 = PASS. Total 49-55 with all dims ≥6 = `DONE_WITH_CONCERNS`. Any dim <6 = FAIL. Full bands: `references/rubric.md`.

1. **Input integrity** — every CAC/LTV sourced; unsourced channels are capped hypothesis lanes, not number-backed allocations; stale CACs flagged.
2. **Marginal-return soundness** — split driven by next-dollar (marginal) CAC with equalize-marginal-return logic visible; even-split-without-reason = auto-fail.
3. **Diminishing-returns respect** — saturated (past-knee) channels throttled; knee positions identified with a signal.
4. **Floor + veto compliance** — no sub-floor slivers; no channel funded against a fired §0 veto without an override + reason.
5. **Concentration balance** — top channel within the concentration cap; single-channel risk reasoned.
6. **Reallocation triggers** — every channel has a falsifiable trigger (CAC threshold + window + destination); budget-event trigger present.
7. **Objective fit** — channels weighted to the objective (acquisition / retention / mixed pool split); return basis explicit.

## Pattern Catalogs

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/rubric.md` | critic | 7-dim band definitions + pass gate. |
| `references/marginal-return-model.md` | allocator | Saturation curve, marginal-CAC estimation bands, min-viable floors, LTV:CAC guardrail. |
| `references/_shared/performance-data.md` | allocator | Sourced-CAC read contract from the measure-results performance store. |
| `references/anti-patterns.md` | critic, constraint-checker, allocator | Section 1 Allocation (7) + Section 2 Input integrity (4) + Section 3 Process (3), each with a detection rule. |
| `references/examples/plan-budget-walkthrough.md` | allocator, critic | The end-to-end worked allocation + scorecard. |

Full mechanics: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
