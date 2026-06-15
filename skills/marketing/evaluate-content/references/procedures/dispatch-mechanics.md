---
title: Content-Eval Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: evaluate-content
load_class: PROCEDURE
---

# Content-Eval Dispatch Mechanics

> Full dispatch + critic + side-effects procedure. Cited from SKILL.md "Dispatch" section. Body retains the 8-step Dispatch procedure summary; this file holds the full per-agent dispatch tables + critic revision-cycle semantics + critic-override invocation + `append-loop-result.ts` helper invocation + manifest-sync invocation.

## How to spawn a sub-agent

1. **Read** agent instruction file — include FULL content in Agent prompt
2. **Append** context (resolved cycle number + loop slug + primary-platform tag + read-order outputs from Pre-Dispatch + measurement evidence excerpts + prior cycle context from `results.tsv` (same-platform rows) + relevant strategy/execution artifacts + source write-social artifact content)
3. **Resolve** all file paths to absolute (rooted at skill directory)
4. **Pass upstream artifacts by content** — orchestrator reads `program.md`, `context.md`, `results.tsv`, latest `strategy/`/`execution/`/`evals/` files + source write-social artifact FIRST and includes excerpts; sub-agents don't re-read these directly
5. If **critic feedback** exists (Layer 3 revision cycle), append with `## Critic Feedback — Address Every Point`

### Single-agent fallback

If multi-agent dispatch is unavailable, execute layers sequentially per the same Layer 1 → Layer 2 → Layer 3 order. Approval gates do NOT apply to evaluate-content (no user-facing approval gates — the verdict is critic-gated, not user-gated). The critic revision cycle stays — single-agent mode runs all 4 agents in sequence with the critic gating before side effects.

## Layer 1: Parallel ingest + diagnosis

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Metric Ingest Agent | program.md (primary metric definition + guardrails + primary-platform scope) + context.md (baselines) + primary-platform tag + measurement evidence (current cycle value + source + window + reach + engagement breakdown) + results.tsv (prior cycles of same platform) + source write-social artifact path | — |
| Diagnosis Agent | Metric Ingest output (from Layer-1 sibling, waited-on) + program.md hypothesis + execution delta (from execution/) + primary-platform scope + source write-social artifact (hook, format, CTA, platform framing, hypothesis) + user-behavior evidence (comments, sentiment, dwell, click-quality) + canonical research (icp-research.md, BRAND.md) | `references/rubric.md` (for Engagement-Quality + Platform-Fit signal expectations) |

**Note on Layer 1 dependency:** Diagnosis consumes Metric Ingest's packet (primary-platform verification, engagement breakdown, reach). Metric Ingest can run independently; Diagnosis waits for the packet before scoring. In single-agent mode, this collapses to sequential.

## Layer 2: Recommendation

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Recommendation Agent | Layer 1 outputs (Metric Ingest + Diagnosis) + program.md guardrails + prior cycles' verdicts (same platform) + primary-platform tag | `references/rubric.md` (for routing-rule alignment) |

Output: proposed verdict (`keep | discard | watch | blocked`) + Confidence level (`high | medium | low | blocked`) + primary-platform tag (echoed from Metric Ingest) + Decision sentence (includes the primary platform) + Next Cycle Recommendation (component-granular Keep/Discard/Watch/Route-next-work-to lines) + Engagement-Quality Decision block (quality_read + vanity_caution) + Results Row (8-column TSV with primary platform in description) + Learning Promotion proposal (yes/no with platform/format-scoped lesson + expiry).

## Layer 3: Critic

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Critic Agent | Full assembled eval artifact + Results Row proposal + Learning Promotion proposal + Layer 1 outputs + Layer 2 outputs + primary-platform tag + source write-social artifact path | `references/rubric.md` (canonical 7-dim 0-10 rubric — MUST load before scoring) |

Critic enforces the 7-dimension rubric (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Engagement-Quality Discrimination / Platform-Fit / Ledger Correctness, each 0-10) + 3-tier verdict (PASS ≥49 AND no dim <6 / PASS_WITH_CONCERNS ≥42 AND no dim <6 + confidence/confounders surfaced / FAIL <42 OR any dim <6 OR any Hard Fail) + 12 Hard Fails (see critic-agent.md § Hard Fails — covers no loop / no metric source-window / missing primary-platform or wrong-lane content / cross-platform contamination / improvement without baseline / fabricated numbers / invalid ledger status / missing primary-platform in ledger description / vanity-spike learning promotion / unreadable source artifact / vanity-spike keep / low-reach keep claim).

### Revision cycle (1 cycle max)

| Critic outcome | Action |
|---|---|
| PASS or PASS_WITH_CONCERNS | Proceed to side effects (Critic Override Logging fires BEFORE side effect #2 if operator overrides on PASS_WITH_CONCERNS) |
| FAIL on first pass | Revise once — re-dispatch the agent(s) named in critic's `required_fixes`: Recommendation Agent for verdict/learning/routing errors; Metric Ingest Agent for metric-integrity/primary-platform-verification/engagement-breakdown errors; Diagnosis Agent for attribution-honesty/engagement-quality/platform-fit errors |
| FAIL after revision | Return BLOCKED with missing-evidence list. **Write NO ledger row, NO learning promotion, NO eval artifact** (or write with `status: blocked` for audit trail per format-conventions). Operator may override via Critic Override Protocol — see below. |

### Critic Override Protocol (when operator ships despite FAIL or accepts PASS_WITH_CONCERNS)

When the operator explicitly decides to ship despite a critic FAIL OR accept a `pass-with-concerns` verdict the rubric flagged, **log the override before any side effect fires**. The override log is the only mechanism that turns repeated operator pushback into a rubric-revision signal.

```bash
bun scripts/log-critic-override.ts \
  --skill evaluate-content \
  --dimension "<failed rubric dimension>" \
  --artifact "<project-relative path to the eval artifact under review>" \
  --critic-verdict <fail|pass-with-concerns> \
  --operator-decision <ship|revise|ignore> \
  --reason "<one sentence — why the override is justified>" \
  --follow-up "<none|watch metric|revise rubric|extract shared rubric>"
```

The script appends a dated block to `docs/forsvn/artifacts/meta/records/critic-overrides.md`. After three valid overrides on the same `evaluate-content:<dimension>` pair, the rubric should be revised (escalation handled by the dashboard's `rubrics[skill:dimension].action` field — see `_shared/quality-dashboard-spec.md`).

Only after the override is logged may side effect #2 (ledger append) proceed. The ledger row status MUST reflect actual cycle evidence — operator override does NOT promote a contested cycle to `keep`; pick `watch` or `discard` if the underlying evidence does not support `keep`.

## Side effects (executed in order, ONLY after critic PASS or PASS_WITH_CONCERNS + override logged if applicable)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` per `format-conventions.md` template
2. **Append ledger row** via validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include primary-platform tag>"
```

The helper validates the 8-column standard schema. Custom 10+ column loops require hand-edit (see `format-conventions.md` § "Known limitation — custom schemas") — flag affected loops to the eval-loop owner BEFORE manual append.

3. **Update `learnings.md`** ONLY if critic approved promotion (high-confidence `keep`/`discard` AND lesson reusable beyond this exact content piece AND platform/format-scoped). Critic Hard Fail #9 enforces — promotion from low-confidence-or-blocked-or-vanity-spike evidence triggers FAIL and skips this step entirely.
4. **Run manifest sync:**

```bash
bun scripts/manifest-sync.ts
```

## 8-step Dispatch procedure (summary — full per-layer + side-effects above)

1. Resolve loop path + next cycle number + primary-platform scope. Cycle number is `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact.
2. Layer 1 parallel: Metric Ingest + Diagnosis (Diagnosis waits on Metric Ingest's packet).
3. Layer 2: Recommendation consumes Layer 1 outputs and proposes verdict, engagement-quality decision, next-cycle routing, ledger row, learning promotion.
4. Layer 3: Critic validates artifact against the 7-dim rubric in `references/rubric.md`.
5. If Critic FAIL, revise once. If still failing, write no ledger row and return `BLOCKED` (or trigger Critic Override Protocol if operator chooses to ship).
6. Write eval artifact and append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning only when Critic allows it.
8. Run manifest sync.

## Conventions

- **Cycle number resolution:** `last results.tsv cycle + 1`. Override only when the user explicitly names a cycle that has no existing eval artifact. Cross-platform cycles share the cycle counter (cycle 3 linkedin, cycle 4 instagram); primary-platform disambiguation lives in the ledger description.
- **Source citation:** Every metric value cites its source tool (native platform analytics / third-party dashboard / operator-supplied). Critic Hard Fail #2 catches missing source.
- **Confidence honesty:** Confidence is one of `high | medium | low | blocked`. Low-confidence findings ship as `watch` or `blocked`, not `keep`. Low-reach windows are auto-capped at `low` confidence regardless of metric strength. Critic dimension "Attribution Honesty" enforces.
- **Primary-platform discipline:** One cycle = one primary platform. Critical Gate 5 + Critic Hard Fail #4 enforce. Secondary-platform metrics are Cross-Platform Context, never verdict input.
- **Engagement-quality discipline:** Engagement is always the 4-way breakdown. A vanity-heavy headline metric never earns `keep`. Critic Hard Fail #11 enforces.
- **Boundary respect:** Recommendations route next work (e.g., "Route next work to: write-social --rev=N+1 with hypothesis: hook under-delivered on save rate — revise hook only, hold format+CTA"). Do NOT propose specific copy/visual changes — that's write-social's / produce-asset's job. Critical Gate 8 + Critic dimension "Decision Discipline" enforce.
- **Component-granular recommendations:** Name the specific component to change (hook | format | visual | CTA), not "redo the content." Decision Discipline rubric dim drops the score on plan-level maximalism.
- **Learning promotion conservatism:** Default to NOT promote. Promotion criteria: high-confidence + status keep/discard + lesson reusable beyond this exact content piece + platform/format-scoped. When in doubt, leave the finding in the cycle artifact only.
- **Side effects ALL-OR-NOTHING on critic FAIL:** If critic FAILs after revision (and no override), skip ALL 4 side effects. Don't write a partial artifact, don't append a row, don't promote a lesson, don't sync the manifest. Return BLOCKED with the missing-evidence list. If operator overrides, the override-log invocation fires BEFORE side effect #2; side effects #1, #2, #4 then proceed; side effect #3 (learning promotion) still requires critic PASS approval.
