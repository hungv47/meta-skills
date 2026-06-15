# Example — SEO-Eval Cycle Walkthrough (apparent bump → `watch`)

> One worked end-to-end run of `evaluate-seo`: operator invocation, pre-dispatch validation, the 4-agent flow, the produced cycle artifact in full, the `results.tsv` row, and the Critic verdict. The signature move is the **lag-and-volatility gate**: an apparent ranking bump on a short window is downgraded from `keep` to `watch`. All numbers are **illustrative / synthetic** — they show shape, not real FORSVN data.

---

## Scenario

FORSVN's eval loop `forsvn-org-serp` tracks the landing site's organic SERP. Two weeks ago `optimize-seo` shipped an on-page change to the `ai work capture` cluster page (added an H2 answering "what is agentic work capture" + an internal link from the homepage). The operator now wants to score it.

> /evaluate-seo forsvn-org-serp "ai work capture / organic-serp" "target-keyword avg position"

Inputs supplied: loop slug `forsvn-org-serp`; cluster+surface `ai work capture · organic-serp`; source artifact `docs/forsvn/artifacts/marketing/optimize-seo/2026-05-30-ai-work-capture.md`; window `2026-05-30 → 2026-06-12` (13 days); primary metric `avg position 9.4 → 6.1` from Google Search Console (pulled 2026-06-13).

---

## Pre-Dispatch validation

Per `references/procedures/pre-dispatch.md` + `_shared/pre-dispatch-protocol.md`:

- `.forsvn/loops/forsvn-org-serp/program.md` + `context.md` → **present, read.** Primary metric = target-keyword avg position. **Lag floor declared: ≥28 days.** Guardrails: no thin-content, brand voice intact. (Gate 1 ✓)
- Measurement evidence → GSC pull dated 2026-06-13, position + clicks + impressions + CTR. (Gate 2 ✓)
- Source artifact → `optimize-seo/2026-05-30-ai-work-capture.md` exists + readable. (Gate 3 ✓)
- One cluster + surface → `ai work capture · organic-serp`. AI-answer reads are out of scope this cycle. (Gate 4 ✓)
- **Window vs lag floor → 13 days vs 28-day floor: BELOW.** The operator's stated intent is to claim the bump as a `keep`. Pre-dispatch **warns**: "13-day window is below the 28-day lag floor; Critic Hard Fail #12 will block a `keep`. Expect `watch`." (Gate 6 pre-warning)
- Cycle number → last `results.tsv` cycle is 2 → this is **cycle 3**.

Warm Start: all dimensions resolved from artifacts, no Cold Start questions needed.

---

## Multi-agent flow

Dispatch per `references/agent-manifest.md`: Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 (Recommendation) → Layer 3 (Critic).

**Layer 1 — Metric Ingest** normalizes the visibility packet (meaningful-vs-vanity split + lag-floor check mandatory):

```yaml
cluster_surface: "ai work capture · organic-serp"
primary_metric: { name: "target-keyword avg position", current: 6.1, baseline: 9.4, source: "GSC", pull_date: 2026-06-13 }
window: { start: 2026-05-30, end: 2026-06-12, days: 13, lag_floor: 28, meets_floor: false }
meaningful_visibility:
  avg_position: { current: 6.1, baseline: 9.4 }      # apparent +3.3
  organic_clicks: { current: 41, baseline: 38 }      # +3 — flat within noise
  conversions: { current: 0, baseline: 0 }
vanity_signals:
  impressions: { current: 2180, baseline: 1490 }     # +46%
  ctr: { current: "1.9%", baseline: "2.6%" }         # DOWN despite higher position
volatility: "position swung 5.2–8.9 day-to-day across the window"
core_update_overlap: "none confirmed in window"
caveats: ["13d < 28d floor", "GSC ~2-3 day data lag", "daily position variance ~±2"]
```

**Layer 1 — Diagnosis** ties the packet to the source change's hypothesis: the H2 + internal link plausibly lifted position, but clicks are flat (+3, inside noise) and CTR *fell* — the apparent rank gain has not converted to traffic. Position is volatile (5.2–8.9 daily), so the 6.1 average rests on a handful of good days inside a churning window.

**Layer 2 — Recommendation** applies the lag/volatility gate: the window (13d) is below the 28-day floor AND position is volatile AND clicks are flat — so the move is **noise, not a validated win**. Proposes `watch`, re-measure after the window reaches the floor; route the next on-page target (CTR, not position) to `optimize-seo`; no learning promotion.

**Layer 3 — Critic** scores the 7-dim rubric (below).

---

## Produced eval artifact (in full)

Written to `.forsvn/loops/forsvn-org-serp/evals/2026-06-13-cycle-3.md`:

```markdown
---
skill: evaluate-seo
version: 1
date: 2026-06-13
status: done_with_concerns
summary: "ai-work-capture-organic-serp cycle 3 seo/aeo evaluation"
purpose: "Post-change visibility-delta snapshot for an SEO/AEO eval loop, scoped to one keyword cluster + surface over a lag-respecting window"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current SEO/AEO cycle"
do_not_use_when: "Applying on-page fixes or authoring content without reading the latest loop context and results"
upstream: ".forsvn/loops/forsvn-org-serp/program.md, context.md, docs/forsvn/artifacts/marketing/optimize-seo/2026-05-30-ai-work-capture.md, GSC"
downstream: "results.tsv, learnings.md, optimize-seo / monitor-aeo next-cycle target"
provenance:
  skill: evaluate-seo
  run_date: 2026-06-13
  input_artifacts:
    - docs/forsvn/artifacts/marketing/optimize-seo/2026-05-30-ai-work-capture.md
    - research/icp-research.md
  output_eval: null
---

# AI Work Capture · Organic-SERP Cycle 3 Evaluation

## Verdict

- Status: watch
- Confidence: low
- Cluster / Surface: ai work capture · organic-serp
- Primary metric: target-keyword avg position = 6.1 vs 9.4 baseline (window: 13 days vs 28-day floor — BELOW)
- Decision: Apparent +3.3 position gain on the `ai work capture · organic-serp` cluster over a 13-day window is below the 28-day lag floor and rests on a volatile SERP with flat clicks — watch, re-measure at day 28.

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| target-keyword avg position | 6.1 | 9.4 | 2026-05-30→06-12 (13d) | GSC | 13d < 28d floor; daily swing 5.2–8.9 |
| organic clicks | 41 | 38 | 13d | GSC | +3 within noise band |
| impressions (vanity) | 2,180 | 1,490 | 13d | GSC | +46% — not a ranking gain |
| ctr | 1.9% | 2.6% | 13d | GSC | DOWN despite higher position |
| ai-citation inclusion | n/a | n/a | — | — | out of scope (organic-serp cycle) |
| organic conversions | 0 | 0 | 13d | GSC | no movement |

## What Changed This Cycle

- Source artifact: `docs/forsvn/artifacts/marketing/optimize-seo/2026-05-30-ai-work-capture.md`
- On-page change since prior cycle: added an H2 answering "what is agentic work capture" to the cluster page + a homepage internal link to it. Hypothesis: stronger topical match + internal authority lifts the target-keyword position.

## Diagnosis

### Visibility-Signal Read

- meaningful_visibility: position 9.4→6.1 (apparent +3.3); clicks 38→41 (+3, flat); conversions 0→0
- vanity_signals: impressions 1,490→2,180 (+46%); the +46% is the page surfacing for more long-tail queries, not a target-keyword win
- meaningful_to_vanity_read: weak — the only real movement is an impression rise (vanity); clicks flat and CTR fell

### Lag & Volatility Check

- window_vs_lag_floor: below (13 days vs 28-day floor)
- volatility_read: volatile — daily position swung 5.2–8.9; the 6.1 average leans on a few good days
- core_update_overlap: none confirmed in the window
- short_window_caution: a 13-day move on a volatile SERP is inside the noise band and routinely reverts; this is not yet a validated gain

### Cross-Surface Context

- ai-answers: not measured this cycle — CONTEXT ONLY, not a verdict input

### Confounders

- GSC ~2-3 day data lag (window end-edge soft); daily position variance ±2; impression rise may be SERP-feature volatility, not relevance

## Next Cycle Recommendation

- Keep: nothing yet — the gain is unconfirmed
- Discard: nothing — do not revert; the change is plausibly directionally right
- Watch: hold the change; re-measure the same cluster+surface at the 28-day floor (≈2026-06-27)
- Route next work to: optimize-seo — the live problem is CTR (1.9%, down), so target the title/meta description for the cluster page, not another position play

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
3	2026-06-13	evals/2026-06-13-cycle-3.md	target-keyword avg position	6.1	9.4	watch	ai work capture / organic-serp / 13d — apparent position 9.4->6.1 but below 28d lag floor, volatile SERP, clicks flat — watch, re-measure at day 28
```

## Learning Promotion

- Promote to `learnings.md`: no
- Lesson: (none — sub-lag-floor window + low confidence + watch status cannot promote)
- Expiry / caveat: n/a
```

---

## Results row (exact column order)

Appended via the validated helper (8 columns: `cycle  date  artifact  primary_metric  value  baseline  status  description`):

```bash
bun scripts/append-loop-result.ts "forsvn-org-serp" \
  --artifact evals/2026-06-13-cycle-3.md \
  --metric "target-keyword avg position" --value "6.1" --baseline "9.4" \
  --status "watch" \
  --description "ai work capture / organic-serp / 13d — apparent position 9.4->6.1 but below 28d lag floor, volatile SERP, clicks flat — watch, re-measure at day 28"
```

The `ai work capture / organic-serp / 13d` prefix is the mandatory cluster + surface + window tag (Critic Hard Fail #8 if missing).

---

## Critic verdict (the lag gate checked)

Pass gate (`_shared/evaluation-loop-rubric.md` § 2): PASS = aggregate ≥ 49/70 AND every per-dim ≥ 6.

```
VERDICT: PASS  (aggregate 60/70, all per-dim ≥ 6)

- loop_fit: 9 — program.md + context.md + results.tsv read; cycle 3 scoped to "ai work capture" / organic-serp; no drift
- metric_integrity: 9 — avg position + baseline + 13-day window checked vs the 28-day floor; meaningful-vs-vanity breakdown present; GSC source + pull date named
- attribution_honesty: 8 — no core update in window; GSC lag + daily variance flagged; confidence: low matches the evidence
- decision_discipline: 9 — verdict follows the read + lag gate; routing to optimize-seo targets CTR (the real problem), one sentence, cluster+surface+window present
- visibility_signal_discrimination: 9 — +46% impressions named as vanity and excluded; verdict rests on flat clicks + falling CTR, not the impression rise
- lag_and_volatility_discipline: 8 — 13d < 28d floor stated; volatile SERP (5.2–8.9) read; the gate capped the verdict at watch (Hard Fail #12 would have fired on a keep)
- ledger_correctness: 8 — one row via append-loop-result.ts; 8 columns clean; description carries the cluster+surface+window tag

DOMAIN GATE — Lag & Volatility: the apparent +3.3 position gain was NOT promoted to keep.
13-day window is below the 28-day lag floor AND the SERP is volatile → capped at `watch`.
This is the point of the gate: a short-window bump is noise, not a validated win.
```

The Critic **passes** the artifact (it is correctly scored + honestly capped) — but the *cycle verdict it certifies is `watch`, not `keep`*. PASS here means "the evaluation is sound," not "the change is validated." Side effects run in order: write artifact → append the one ledger row → no learning promotion → `bun scripts/manifest-sync.ts`.

---

## FAIL → fix variant

Suppose the Recommendation agent had ignored the gate and proposed `keep` on the same 13-day data ("position 9.4→6.1, ship it"):

```
VERDICT: FAIL

- lag_and_volatility_discipline: 2 — a `keep` rests on a 13-day window below the 28-day floor on a
  volatile SERP. Critic Hard Fail #12. The single sub-6 score forces FAIL regardless of aggregate.
- visibility_signal_discrimination: 4 — the +46% impression rise is read as supporting evidence; clicks are flat.
```

Per the all-or-nothing rule (`agent-manifest.md` Dispatch step 5): **revise once.** The revision recomputes the gate (13d < 28d → cannot keep), downgrades to `watch`, and re-scores — yielding the PASS above. Had the revision still claimed `keep`, no `results.tsv` row would be written and the skill returns `BLOCKED`. An operator override (`bun scripts/log-critic-override.ts --skill evaluate-seo …`) could ship a `PASS_WITH_CONCERNS`, but it can **never** promote the contested cycle to `keep` or relax the lag gate.

---

## Completion status

**DONE_WITH_CONCERNS** — eval artifact written, one ledger row appended, Critic PASS — but `status: watch` at `confidence: low`, window below the lag floor, on a volatile SERP. The bump is recorded, not validated; the loop re-measures the same cluster+surface at the 28-day floor.
