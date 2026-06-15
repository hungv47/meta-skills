---
title: Ad-Eval Cycle Walkthrough (cold-traffic, creative-fatigue keep→watch)
lifecycle: canonical
status: stable
produced_by: evaluate-ad
load_class: EXAMPLE
---

# Worked Example — cold-traffic ad cycle, real metrics, critic PASS

A faithful end-to-end run. All numbers are **illustrative synthetic data** for a launched Meta ad — not a real account. The point is the exact shape: the 4-agent flow, the produced artifact (every frontmatter field + all 8 body sections), the 8-column ledger row, and the critic verdict with the two ad-specific domain gates checked.

Loop context (illustrative): a FORSVN-style local-first founder tool. `program.md` primary metric = **ROAS**; guardrail = `frequency > 3.5 → fatigue review`; confidence floor = `$50/ad-group + ~10k impressions`.

## 1. Operator invocation + inputs

```
/evaluate-ad forsvn-cold-launch cold-traffic 2026-06-01..2026-06-14
```

Inputs it consumes (all illustrative):

- **Loop:** `forsvn-cold-launch` (`.forsvn/loops/forsvn-cold-launch/`)
- **Audience-temp:** `cold-traffic` (one cycle = one temp — Gate 3)
- **Source ad-copy artifact:** `docs/forsvn/artifacts/marketing/write-ad/cold-traffic-2026-05-28-quiet-capture.md` (hook: "Your best work happens before you remember to log it"; offer: 14-day local trial)
- **Metric window:** 2026-06-01 → 2026-06-14 (14 days)
- **Primary metric + source:** ROAS = **2.4×** · Meta Ads Manager (7d-click), Triple Whale cross-check
- **Spend window:** $1,820 over 14d, lookalike-2% ad-group, ~118k impressions

## 2. Pre-dispatch validation

Hard-blocks (run BEFORE Cold Start, per `_shared/pre-dispatch-protocol.md`):

- `program.md` + `context.md` present and read → **pass** (Gate 1; not `NEEDS_CONTEXT`).
- Measurement evidence present (primary metric value + window + source) → **pass** (Gate 2).
- Metrics are ad-group-scoped to one lookalike-2% cold audience — no blended full-campaign export → **pass** (Gate 4, no mixed-audience BLOCK).
- `results.tsv` is the standard 8-col schema → **pass** (no custom 10+ col hand-edit warning).

Cold Start: **not triggered** — all 6 bundled questions (loop · audience-temp · source ad-copy path · window · primary metric value/baseline · spend window) are already resolved by the invocation. Cycle number = `last results.tsv cycle + 1` = **cycle 2** (cycle 1 was the launch baseline, ROAS 2.1×, same cold-traffic temp).

## 3. The 4-agent flow

**Layer 1 (parallel) — Metric Ingest + Diagnosis.** Metric Ingest normalizes the operator packet; Diagnosis reads the source ad-copy hypothesis + the normalized packet.

Representative normalized metric packet (Metric Ingest output, illustrative):

```yaml
primary_metric: { name: ROAS, value: 2.4, baseline: 2.1, units: "x", window: "2026-06-01..2026-06-14 (14d)" }
spend: { amount: 1820, currency: USD, window_days: 14, ad_group: "lal-2%-cold" }
impressions: 118000
ctr: { value: 1.1, baseline: 1.6, units: "%", trend: "-31% over window" }
cpa: { value: 41.50, baseline: 38.00, units: USD }
frequency_at_close: 3.8
conversions: 44
source: "Meta Ads Manager (7d-click) + Triple Whale cross-check"
audience_temp: cold-traffic
comparability: same_temp_same_offer   # baseline = cycle 1, also cold-traffic
confounders: ["iOS 7d-click attribution gap", "optimizer past learning phase by d4"]
spend_floor_met: true                 # > $50/ad-group AND > 10k impressions
```

**Layer 2 — Recommendation.** ROAS improved (2.4× vs 2.1×), comparable baseline (same temp/offer), guardrails: frequency 3.8 > 3.5 threshold → fatigue-review triggered. CTR fell 31% across the window. Verdict resolves to **watch** (not `keep`): the ROAS lift is real but riding a fatiguing creative — frequency over guardrail + CTR slope negative. Next-cycle route: refresh the **hook** component only (CTR decay localizes to first-impression engagement, not offer/LP).

**Layer 3 — Critic.** Enforces the 7-dim rubric + ad-specific Hard Fails. Verdict in §6 below.

## 4. The produced eval artifact (rendered in full)

Written to `.forsvn/loops/forsvn-cold-launch/evals/2026-06-14-cycle-2.md`:

```markdown
---
skill: evaluate-ad
version: 1
date: 2026-06-14
status: done_with_concerns
summary: "forsvn-cold-launch cold-traffic cycle 2 ad evaluation"
purpose: "Post-launch evidence snapshot for a Meta-ad eval loop, scoped to one audience-temperature"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current ad cycle"
do_not_use_when: "Authoring next-cycle creative without reading the latest loop context and results"
upstream: ".forsvn/loops/forsvn-cold-launch/program.md, context.md, strategy/, execution/, docs/forsvn/artifacts/marketing/write-ad/cold-traffic-2026-05-28-quiet-capture.md, metric source"
downstream: "results.tsv, learnings.md, write-ad next-cycle brief"
provenance:
  skill: evaluate-ad
  run_date: 2026-06-14
  input_artifacts:
    - docs/forsvn/artifacts/marketing/write-ad/cold-traffic-2026-05-28-quiet-capture.md
    - brand/BRAND.md
    - research/icp-research.md
  output_eval: null
---

# forsvn-cold-launch Cold-Traffic Cycle 2 Evaluation

## Verdict

- Status: watch
- Confidence: medium
- Audience-Temp: cold-traffic
- Primary metric: ROAS = 2.4× vs 2.1× (cycle 1, cold-traffic baseline)
- Decision: Cold-traffic ROAS lifted to 2.4×, but frequency 3.8 over the 3.5 guardrail plus a -31% CTR slope flags incipient creative fatigue — watch, refresh hook next cycle.

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| ROAS (primary) | 2.4× | 2.1× | 06-01→06-14 (14d, $1,820) | Meta Ads Manager 7d-click + Triple Whale | iOS 7d-click attribution gap; cross-check within 6% |
| CTR | 1.1% | 1.6% | 06-01→06-14 (14d) | Meta Ads Manager | -31% slope across window — fatigue indicator |
| CPA | $41.50 | $38.00 | 06-01→06-14 (14d) | Meta Ads Manager | rising with frequency, expected under fatigue |
| Frequency | 3.8 | 2.6 | at 06-14 close | Meta Ads Manager | over 3.5 program.md guardrail |
| Spend | $1,820 | $1,540 | 14d, lal-2% cold ad-group | Meta Ads Manager | above confidence floor ($50 + ~10k imp) |
| Conversions | 44 | 41 | 06-01→06-14 (14d) | Meta + Triple Whale | 7d-click; view-through excluded |

## What Changed This Cycle

- Source ad-copy artifact: `docs/forsvn/artifacts/marketing/write-ad/cold-traffic-2026-05-28-quiet-capture.md`
- Creative/offer/audience/bid-strategy delta from prior cycle: no creative change — cycle 1's winning variant ran unchanged into cycle 2 (same hook, hero, offer, lal-2% cold audience, lowest-cost bid). The only change is cumulative exposure (frequency 2.6 → 3.8). This makes cycle 2 a clean fatigue read — performance shift is exposure-driven, not creative-driven.

## Diagnosis

### Likely Drivers

- ROAS held/lifted because the offer + landing page still convert the cold clicks that arrive; the funnel below the click is stable.
- CTR decay (-31%) is driven by repeat exposure to the same hook on a saturating cold audience, not by audience mismatch — the hook still works on first impression, just not on the 4th.

### Confounders

- iOS 7d-click attribution gap: a slice of conversions under-reported; Triple Whale cross-check lands within 6%, so the ROAS direction is trustworthy but the absolute value carries a band.
- Optimizer exited its learning phase by ~d4; cycle-1 baseline included learning-phase noise, so part of the apparent ROAS lift may be cycle-1 understatement, not cycle-2 strength.

### Creative-Fatigue Signals

- frequency_at_close: 3.8
- frequency_threshold: 3.5 (from program.md guardrail)
- ctr_slope_over_window: -31% (1.6% → 1.1%)
- negative_feedback_proxy: not available from this Ads Manager export
- fatigue_observed: yes
- recommended_refresh: hook

### Audience-Match Signals

- declared_audience_temp: cold-traffic
- meta_audience_in_metrics: lookalike-2% (cold), ad-group "lal-2%-cold"
- temp_match: yes
- match_quality: strong

## Next Cycle Recommendation

- Keep: offer (14-day local trial) + landing page + hero — funnel-below-click is converting; do not touch.
- Discard: nothing wholesale — this is a refresh, not a kill.
- Watch: ROAS trend (the lift may partly be cycle-1 learning-phase understatement); frequency ceiling.
- Route next work to: write-ad (`--rev=3`, hook-only refresh scope; seed hypothesis: "same offer/hero, new cold-open hook to reset CTR on the saturating lal-2% audience").

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
2	2026-06-14	evals/2026-06-14-cycle-2.md	ROAS	2.4x	2.1x	watch	cold-traffic ROAS 2.4x over 14d — keep offer+LP, refresh hook per frequency 3.8 fatigue
```

## Learning Promotion

- Promote to `learnings.md`: no
- Lesson: (not promoted) — confidence is medium and status is `watch`; the fatigue read is real but the creative-specific hook insight won't generalize yet, and a `watch` cycle is below the promotion bar (high-confidence keep/discard only).
- Expiry / caveat: revisit promotion after cycle 3 confirms whether the hook refresh resets CTR — if it does, promote the audience-temp-scoped fatigue trigger ("cold lal-2% saturates near frequency 3.5–4.0; refresh hook, not offer"), not the specific hook copy.
```

## 5. The ledger row (exact 8-column order)

Appended via the validated helper (do NOT hand-append):

```bash
bun scripts/append-loop-result.ts "forsvn-cold-launch" \
  --artifact evals/2026-06-14-cycle-2.md \
  --metric "ROAS" --value "2.4x" --baseline "2.1x" \
  --status "watch" \
  --description "cold-traffic ROAS 2.4x over 14d — keep offer+LP, refresh hook per frequency 3.8 fatigue"
```

Resulting row (columns in order `cycle date artifact primary_metric value baseline status description`):

```tsv
2	2026-06-14	evals/2026-06-14-cycle-2.md	ROAS	2.4x	2.1x	watch	cold-traffic ROAS 2.4x over 14d — keep offer+LP, refresh hook per frequency 3.8 fatigue
```

`status` is `watch` (∈ `keep|discard|watch|blocked`); `description` is one tab-free sentence and carries the `cold-traffic` audience-temp tag.

## 6. Critic verdict — PASS

Aggregate 60/70, every dim ≥ 6 → **PASS** (pass gate: aggregate ≥ 49 AND every per-dim ≥ 6). The two signature ad-specific gates are checked explicitly:

```
- loop_fit: 9 — program.md + context.md + results.tsv read; cycle 2 scoped to cold-traffic matching program.md; cycle number resolved from last row + 1
- metric_integrity: 9 — ROAS named with units; value + baseline same units; 14d window + dates + spend stated; source named; frequency_at_close + CPA + conversions present
- attribution_honesty: 8 — DOMAIN GATE (attribution on low spend): spend $1,820 > $50 floor AND ~118k imp > 10k → confidence floor met, so `medium` is honestly calibrated, NOT inflated; iOS-ATT + optimizer-learning confounders both named; Triple Whale cross-check banded
- decision_discipline: 9 — verdict `watch` matches the packet (improved metric but guardrail breach), not the diagnosis story; routing is hook-only to write-ad (component granularity), not "rewrite campaign"
- audience_temp_fidelity: 10 — declared cold-traffic; source ad-copy artifact cold-traffic; Ads Manager source field confirms lal-2% cold ad-group; one cycle = one temp; no mixed-audience signal
- creative_fatigue_awareness: 9 — DOMAIN GATE (creative fatigue): frequency_at_close 3.8 vs 3.5 guardrail AND CTR slope -31% — two falsifiable inputs; rotation named at component granularity (hook), not campaign
- ledger_correctness: 8 — exactly one row via append-loop-result.ts; 8 columns; status `watch` in vocab; description one sentence, no tabs, carries cold-traffic tag
```

Both ad-specific Hard Fails are clear: no confidence inflation on low spend (#11 — floor met, so `keep` would even have been permissible had frequency not breached), and fatigue is evidenced not asserted (#12 — frequency + slope surfaced).

### Brief FAIL → fix variant (teaches the low-spend gate)

Same packet, but suppose spend were **$38 over 3 days** (~7k impressions) and the operator still claimed `status: keep` on the 2.4× ROAS. Critic FAILs:

```
- attribution_honesty: 4 — Hard Fail #11: spend $38 < $50 floor AND ~7k imp < 10k, yet status = keep. Signal is noise; ROAS lift is unfalsifiable at this spend.
```

Fix on the single revision pass: cap confidence at `low` and downgrade status to `watch` (cannot reach `keep` below the floor). Re-scored → PASS. (A no-override FAIL that is not fixed writes **no ledger row** and returns `BLOCKED`.)

## 7. Completion status

**DONE_WITH_CONCERNS** — eval artifact written, one ledger row appended, manifest sync run, critic PASS. The `_WITH_CONCERNS` qualifier (not plain `DONE`) is correct because confidence is `medium` and the fatigue confounder is material: the ROAS lift is real but riding a creative that is fatiguing, so the cycle ships with a flagged risk to monitor rather than a clean keep.

## What this example pins

- The orchestrator ran 4 agents (Metric Ingest + Diagnosis parallel → Recommendation → Critic); the verdict followed the **metric packet**, not the diagnosis narrative.
- A guardrail breach demoted an improving metric from `keep` to `watch` — decision discipline over the good-news story.
- Both signature domain gates fired: **attribution honesty** (low-spend floor) and **creative-fatigue** (frequency + CTR-slope, component-granular refresh).
- The ledger row is the 8-col schema, audience-temp-tagged, appended only on critic PASS.
- A `watch` + `medium`-confidence cycle does **not** promote a learning — promotion is high-confidence keep/discard only.
