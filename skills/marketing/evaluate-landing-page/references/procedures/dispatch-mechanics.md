---
title: LP-Eval Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: lp-eval
load_class: PROCEDURE
---

# LP-Eval Dispatch Mechanics

> Full dispatch + critic + side-effects procedure. Cited from SKILL.md "Dispatch" section. Body retains the 8-step Dispatch procedure summary; this file holds the full per-agent dispatch tables + critic revision-cycle semantics + `append-loop-result.ts` helper invocation + manifest-sync invocation.

## How to spawn a sub-agent

1. **Read** agent instruction file — include FULL content in Agent prompt
2. **Append** context (resolved cycle number + loop slug + read-order outputs from Pre-Dispatch + measurement evidence excerpts + prior cycle context from `results.tsv` + relevant strategy/execution artifacts)
3. **Resolve** all file paths to absolute (rooted at skill directory)
4. **Pass upstream artifacts by content** — orchestrator reads `program.md`, `context.md`, `results.tsv`, latest `strategy/`/`execution/`/`evals/` files FIRST and includes excerpts; sub-agents don't read these directly
5. If **critic feedback** exists (Layer 3 revision cycle), append with `## Critic Feedback — Address Every Point`

### Single-agent fallback

If multi-agent dispatch is unavailable, execute layers sequentially per the same Layer 1 → Layer 2 → Layer 3 order. Approval gates do NOT apply to lp-eval (no user-facing approval gates — verdict is critic-gated, not user-gated). The critic revision cycle stays — single-agent mode runs all 4 agents in sequence with the critic gating before side effects.

## Layer 1: Parallel ingest + diagnosis

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Metric Ingest Agent | program.md (primary metric definition + guardrails) + context.md (baselines) + measurement evidence (current cycle value + source + window) + results.tsv (prior cycles) | — |
| Diagnosis Agent | metric-ingest outputs + page hypothesis (from strategy/) + execution delta (from execution/) + traffic/source context + user behavior evidence (heatmaps/recordings/form-funnel/sales notes) | — |

Wait for both — outputs feed Layer 2.

## Layer 2: Recommendation

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Recommendation Agent | Layer 1 outputs (metric-ingest + diagnosis) + program.md guardrails + prior cycles' verdicts | — |

Output: proposed verdict (`keep | discard | watch | blocked`) + Confidence level (`high | medium | low | blocked`) + Decision sentence + Next Cycle Recommendation (scoped Keep/Discard/Watch/Route-next-work-to lines) + Results Row (8-column TSV) + Learning Promotion proposal (yes/no with lesson + expiry).

## Layer 3: Critic

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Critic Agent | Full assembled eval artifact + Results Row proposal + Learning Promotion proposal + Layer 1 outputs + Layer 2 outputs | — |

Critic enforces the 6-dimension rubric (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Boundary Control / Ledger Correctness, each 0-10) + 4-tier verdict (PASS ≥48 with no dim <7 / PASS_WITH_CONCERNS ≥42 with no dim <6 + confidence/confounders surfaced / FAIL <42 or any dim <6 or any Hard Fail) + 7 Hard Fails (no existing loop / no metric source-window / claimed improvement without baseline / generic heuristic as evidence / fabricated numbers-logos-testimonials / invalid ledger status / low-confidence learning promotion).

### Revision cycle (1 cycle max)

| Critic outcome | Action |
|---|---|
| PASS or PASS_WITH_CONCERNS | Proceed to side effects |
| FAIL on first pass | Revise once — re-dispatch the agent(s) named in critic's `required_fixes` (recommendation-agent for verdict/learning errors; metric-ingest-agent for metric-integrity errors; diagnosis-agent for attribution-honesty errors) |
| FAIL after revision | Return BLOCKED with missing-evidence list. **Write NO ledger row, NO learning promotion.** Eval artifact is NOT written (or is written with `status: blocked` for audit trail). |

## Side effects (executed in order, ONLY after critic PASS or PASS_WITH_CONCERNS)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` per `format-conventions.md` template
2. **Append ledger row** via validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence without tabs>"
```

The helper validates the 8-column standard schema. Custom 10+ column loops require hand-edit (see `format-conventions.md` § "Known limitation — custom schemas") — flag affected loops to the eval-loop owner BEFORE manual append.

3. **Update `learnings.md`** ONLY if critic approved promotion (high-confidence `keep`/`discard` AND lesson reusable beyond this exact page state). Critic Hard Fail #7 enforces — promotion from low-confidence-or-blocked evidence triggers FAIL and skips this step entirely.
4. **Run manifest sync:**

```bash
bun scripts/manifest-sync.ts
```

## 8-step Dispatch procedure (summary — full per-layer + side-effects above)

1. Resolve loop path and next cycle number. Cycle number is `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact.
2. Layer 1 parallel: Metric Ingest + Diagnosis.
3. Layer 2: Recommendation consumes both Layer 1 outputs and proposes verdict, next actions, ledger row, and learning promotion.
4. Layer 3: Critic validates artifact, ledger row, and learning update.
5. If Critic FAIL, revise once. If still failing, write no ledger row and return `BLOCKED` with missing evidence.
6. Write eval artifact and append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning only when Critic allows it.
8. Run manifest sync.

## Conventions

- **Cycle number resolution:** `last results.tsv cycle + 1`. Override only when the user explicitly names a cycle that has no existing eval artifact (out-of-order evaluation of a missed cycle — rare but valid).
- **Source citation:** Every metric value cites its source tool (GA4 / Mixpanel / Posthog / Hotjar / manual operator notes). Critic Hard Fail #2 catches missing source.
- **Confidence honesty:** Confidence is one of `high | medium | low | blocked`. Low-confidence findings ship as `watch` or `blocked`, not `keep`. Critic dimension "Attribution Honesty" enforces.
- **Boundary respect:** Recommendations route next work (e.g., "Route next work to: lp-brief --rev=N+1 with hypothesis: [...]"). Do NOT propose specific copy/layout/asset changes — that's lp-brief's job. Critical Gate 6 + Critic dimension "Boundary Control" enforce.
- **Learning promotion conservatism:** Default to NOT promote. Promotion criteria: high-confidence + status keep/discard + lesson reusable beyond this exact page state. When in doubt, leave the finding in the cycle artifact only — don't pollute the durable `learnings.md`.
- **Side effects ALL-OR-NOTHING on critic FAIL:** If critic FAILs after revision, skip ALL 4 side effects. Don't write a partial artifact, don't append a row, don't promote a lesson, don't sync the manifest. Return BLOCKED with the missing-evidence list.
