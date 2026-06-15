---
title: SEO/AEO-Eval Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: evaluate-seo
load_class: PROCEDURE
---

# SEO/AEO-Eval Dispatch Mechanics

> Full dispatch + critic + side-effects procedure. Cited from SKILL.md "Dispatch" section. Body retains the 8-step Dispatch summary; this file holds the full per-agent dispatch tables + critic revision-cycle semantics + critic-override invocation + `append-loop-result.ts` helper invocation + manifest-sync invocation.

## How to spawn a sub-agent

1. **Read** agent instruction file — include FULL content in the Agent prompt
2. **Append** context (resolved cycle number + loop slug + cluster+surface tag + read-order outputs from Pre-Dispatch + ranking/visibility evidence excerpts + the lag floor + known core-update dates + prior cycle context from `results.tsv` (same cluster+surface rows) + source optimize-seo/monitor-aeo artifact content)
3. **Resolve** all file paths to absolute (rooted at the skill directory)
4. **Pass upstream artifacts by content** — orchestrator reads `program.md`, `context.md`, `results.tsv`, latest `strategy/`/`execution/`/`evals/` files + source SEO/AEO artifact FIRST and includes excerpts; sub-agents don't re-read these directly
5. If **critic feedback** exists (Layer 3 revision cycle), append with `## Critic Feedback — Address Every Point`

### Single-agent fallback

If multi-agent dispatch is unavailable, execute layers sequentially per the same Layer 1 → Layer 2 → Layer 3 order. There are no user-facing approval gates — the verdict is critic-gated. The critic revision cycle stays.

## Layer 1: Parallel ingest + diagnosis

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Metric Ingest Agent | program.md (primary metric + guardrails + lag floor + cluster/surface scope) + context.md (baselines) + cluster+surface tag + measurement evidence (current value + source + window + visibility breakdown) + known core-update dates + results.tsv (prior cycles) + source SEO/AEO artifact path | — |
| Diagnosis Agent | Metric Ingest output (waited-on packet: visibility breakdown, window-vs-floor, core updates) + program.md hypothesis + the source change (on-page/technical/AEO) + cluster/surface scope + rank-tracker/GSC/AEO behavioral signals + canonical research (icp-research.md, product-context.md) | `references/rubric.md` (for Visibility-Signal + Lag & Volatility signal expectations) |

**Note on Layer 1 dependency:** Diagnosis consumes Metric Ingest's packet (cluster/surface verification, visibility breakdown, window-vs-floor, core updates). Metric Ingest can run independently; Diagnosis waits for the packet before scoring. In single-agent mode, this collapses to sequential.

## Layer 2: Recommendation

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Recommendation Agent | Layer 1 outputs (Metric Ingest + Diagnosis) + program.md guardrails + the lag floor + prior cycles' verdicts (same cluster+surface) + cluster+surface tag | `references/rubric.md` (for routing-rule alignment) |

Output: proposed verdict (`keep | discard | watch | blocked`) + Confidence (`high | medium | low | blocked`) + cluster+surface tag (echoed from Metric Ingest) + Decision sentence (includes the cluster + surface + window) + Next Cycle Recommendation (target-granular Keep/Discard/Watch/Route-next-work-to lines) + Visibility-Quality Decision block (meaningful_read + vanity_caution) + Lag & Volatility Gate (PASS or CAP-WATCH) + Results Row (8-column TSV with cluster+surface+window in description) + Learning Promotion proposal (yes/no with keyword/surface-scoped lesson + next-core-update expiry).

## Layer 3: Critic

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Critic Agent | Full assembled eval artifact + Results Row proposal + Learning Promotion proposal + Layer 1 outputs + Layer 2 outputs + cluster+surface tag + source SEO/AEO artifact path | `references/rubric.md` (canonical 7-dim 0-10 rubric — MUST load before scoring) |

Critic enforces the 7-dimension rubric (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Visibility-Signal Discrimination / Lag & Volatility Discipline / Ledger Correctness, each 0-10) + 3-tier verdict (PASS ≥49 AND no dim <6 / PASS_WITH_CONCERNS ≥42 AND no dim <6 + confidence/confounders surfaced / FAIL <42 OR any dim <6 OR any Hard Fail) + 12 Hard Fails (see critic-agent.md § Hard Fails — covers no loop / no metric source-window / unreadable source artifact / missing-cluster-surface or wrong-lane / cross-cluster contamination / fabricated ranking data / invalid ledger status / missing cluster-surface in ledger description / vanity-spike learning promotion / no-baseline improvement / vanity-spike keep / sub-lag-floor-or-core-update keep).

### Revision cycle (1 cycle max)

| Critic outcome | Action |
|---|---|
| PASS or PASS_WITH_CONCERNS | Proceed to side effects (Critic Override Logging fires BEFORE side effect #2 if operator overrides on PASS_WITH_CONCERNS) |
| FAIL on first pass | Revise once — re-dispatch the agent(s) named in critic's `required_fixes`: Recommendation Agent for verdict/learning/routing/gate errors; Metric Ingest Agent for metric-integrity/cluster-verification/visibility-breakdown/window errors; Diagnosis Agent for attribution-honesty/visibility-quality/lag-volatility errors |
| FAIL after revision | Return BLOCKED with the missing-evidence list. **Write NO ledger row, NO learning promotion, NO eval artifact** (or write with `status: blocked` for audit trail per format-conventions). Operator may override via Critic Override Protocol — see below. |

### Critic Override Protocol (when operator ships despite FAIL or accepts PASS_WITH_CONCERNS)

When the operator explicitly decides to ship despite a critic FAIL OR accept a `pass-with-concerns` verdict, **log the override before any side effect fires**. The override log is the only mechanism that turns repeated operator pushback into a rubric-revision signal.

```bash
bun scripts/log-critic-override.ts \
  --skill evaluate-seo \
  --dimension "<failed rubric dimension>" \
  --artifact "<project-relative path to the eval artifact under review>" \
  --critic-verdict <fail|pass-with-concerns> \
  --operator-decision <ship|revise|ignore> \
  --reason "<one sentence — why the override is justified>" \
  --follow-up "<none|watch metric|revise rubric|extract shared rubric>"
```

The script appends a dated block to `docs/forsvn/artifacts/meta/records/critic-overrides.md`. After three valid overrides on the same `evaluate-seo:<dimension>` pair, the rubric should be revised (escalation handled by the dashboard's `rubrics[skill:dimension].action` field — see `_shared/quality-dashboard-spec.md`).

Only after the override is logged may side effect #2 (ledger append) proceed. The ledger row status MUST reflect actual cycle evidence — operator override does NOT promote a contested cycle to `keep`, and **never relaxes the lag gate**: a sub-window or core-update-confounded cycle stays at `watch` or `blocked`.

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
  --description "<one sentence — include cluster + surface + window>"
```

The helper validates the 8-column standard schema. Custom 10+ column loops require hand-edit (see `format-conventions.md` § "Known limitation — custom schemas") — flag affected loops to the eval-loop owner BEFORE manual append.

3. **Update `learnings.md`** ONLY if critic approved promotion (high-confidence `keep`/`discard` over a lag-respecting window AND lesson reusable beyond this exact keyword AND keyword/surface-scoped with a next-core-update expiry). Critic Hard Fail #9 enforces — promotion from low-confidence-or-blocked-or-vanity-or-sub-window evidence triggers FAIL and skips this step.
4. **Run manifest sync:**

```bash
bun scripts/manifest-sync.ts
```

## 8-step Dispatch procedure (summary — full per-layer + side-effects above)

1. Resolve loop path + next cycle number + cluster+surface scope. Cycle number is `last results.tsv cycle + 1`.
2. Layer 1 parallel: Metric Ingest + Diagnosis (Diagnosis waits on Metric Ingest's packet).
3. Layer 2: Recommendation consumes Layer 1 outputs and proposes verdict, visibility-quality decision, lag/volatility gate, next-cycle target, ledger row, learning promotion.
4. Layer 3: Critic validates artifact against the 7-dim rubric in `references/rubric.md`.
5. If Critic FAIL, revise once. If still failing, write no ledger row and return `BLOCKED` (or trigger Critic Override Protocol if operator chooses to ship).
6. Write eval artifact and append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning only when Critic allows it.
8. Run manifest sync.

## Conventions

- **Cycle number resolution:** `last results.tsv cycle + 1`. Override only when the user explicitly names a cycle that has no existing eval artifact.
- **Source citation:** Every metric value cites its source + a dated pull (GSC / Ahrefs / Semrush / AEO monitor / operator-supplied). Critic Hard Fail #6 catches fabricated values.
- **Confidence honesty:** Confidence is one of `high | medium | low | blocked`. Sub-lag-floor, volatile-SERP, and low-confidence findings ship as `watch` or `blocked`, not `keep`. Critic dimension "Attribution Honesty" + "Lag & Volatility Discipline" enforce.
- **Visibility-quality discipline:** Visibility is always the meaningful-vs-vanity breakdown. An impression / keyword-count spike never earns `keep`. Critic Hard Fail #11 enforces.
- **Lag/volatility discipline:** The window is always checked against the lag floor; a sub-floor or core-update-confounded move caps the verdict at watch/blocked. Critic Hard Fail #12 enforces — this gate is never relaxed, even by override.
- **Cluster/surface discipline:** One cycle = one keyword cluster + surface. Critical Gate 4 + Critic Hard Fail #5 enforce. Secondary clusters/surfaces are Cross-Surface Context, never verdict input.
- **Boundary respect:** Recommendations route next work (e.g., "Route next work to: optimize-seo — add FAQ schema to the cluster page, hold the title"). Do NOT propose specific on-page edits in detail — that's optimize-seo's job. Critical Gate 8 + Critic dimension "Decision Discipline" enforce.
- **Target-granular recommendations:** Name the specific target to change (which keyword | which page element | which AEO question), not "redo the SEO."
- **Learning promotion conservatism:** Default to NOT promote (most SEO cycles land on `watch`). Criteria: high-confidence + status keep/discard + window met the lag floor + lesson reusable beyond this exact keyword + keyword/surface-scoped + a next-core-update expiry.
- **Side effects ALL-OR-NOTHING on critic FAIL:** If critic FAILs after revision (and no override), skip ALL 4 side effects. Return BLOCKED with the missing-evidence list. If operator overrides, the override-log invocation fires BEFORE side effect #2; side effects #1, #2, #4 then proceed; side effect #3 (learning promotion) still requires critic PASS approval.
