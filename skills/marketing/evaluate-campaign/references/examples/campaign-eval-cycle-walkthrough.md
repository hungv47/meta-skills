---
title: Campaign-Eval — End-to-End Cycle Walkthrough (3-channel launch, blended-CAC laundering caught)
lifecycle: canonical
status: stable
produced_by: evaluate-campaign
load_class: EXAMPLE
---

# Campaign-Eval — End-to-End Cycle Walkthrough

**Load when:** an operator (human or agent) wants a complete trace of one evaluate-campaign cycle — Pre-Dispatch hard-block check → Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 Recommendation → Layer 3 Critic → the produced eval artifact in full → the `results.tsv` row → the Critic Verdict (PASS) → a FAIL→fix variant → completion status.

All numbers below are **illustrative synthetic data** for a fictional FORSVN launch campaign. They are plausible, not real. The point is the shape of the artifact and the discipline of the gates, not the figures.

---

## Scenario

- **Loop:** `.forsvn/loops/forsvn-launch/` (already scaffolded by `/run-pipeline`).
- **Campaign:** `forsvn-launch-q3` — the FORSVN desktop-app launch push, three channels run together as one campaign.
- **Source plan:** `docs/forsvn/artifacts/marketing/campaign-plan.md` (objective: net-new trial signups; channel mix: paid-social + organic-shortform + lifecycle-email).
- **Primary metric** (from `program.md`): **net-new trial signups**. Loop confidence floor: ≥ 14-day window AND ≥ $1,500 paid spend.
- **Product economics** (from `context.md`): FORSVN is **$19/mo**; target payback ≤ 2 months; an organic baseline runs ~12 trials/week with no campaign.
- **Window:** 2026-07-01 → 2026-07-21 (21 days).
- **Channels + fully-loaded spend** (media + production + tooling):
  - Meta paid-social: $2,400 media + $600 creative production = **$3,000**
  - Organic short-form (TikTok + Reels, 11 posts): no media; **$450** allocated editor effort (labeled estimate)
  - Lifecycle email (1 send to the existing 3,100-person trial-finisher list): **$0** media, ~$50 tooling
  - **Total fully-loaded spend: $3,500.**
- **Operator invocation:** `/evaluate-campaign forsvn-launch forsvn-launch-q3 2026-07-01..2026-07-21` with the 6 Cold Start dimensions filled inline.

---

## Step 0 — Pre-Dispatch (hard-block check + read order)

Orchestrator runs the hard-block table from [`procedures/pre-dispatch.md`](../procedures/pre-dispatch.md) BEFORE any cold-start questioning:

- `program.md` + `context.md` present → **not** `NEEDS_CONTEXT`. ✓
- Thing under eval is the whole campaign, not a single ad/post/page/video → no sibling reroute. ✓
- Measurement evidence supplied (primary metric value + window + source) → not `BLOCKED`. ✓
- Per-channel rollup complete for all 3 channels → not `BLOCKED`. ✓
- Campaign tag `forsvn-launch-q3` declared → not `BLOCKED` (Hard Fail #3 avoided). ✓
- Source plan-campaign artifact path readable → not `BLOCKED` (Hard Fail #10 avoided). ✓
- `results.tsv` is the standard 8-column schema → standard helper usable. ✓

Read order: `program.md` → `context.md` → `results.tsv` (last cycle = cycle 0 baseline, so this is **cycle 1**) → latest `strategy/` + `execution/` files → source plan-campaign artifact → no per-asset eval artifacts in the loop yet → `brand/BRAND.md` + `research/icp-research.md`.

Warm-start summary emitted:

```
Found:
- loop: .forsvn/loops/forsvn-launch/
- campaign: forsvn-launch-q3
- primary metric: net-new trial signups
- baseline/prior result: 168 trials (cycle 0, organic-only 21-day baseline)
- source plan-campaign artifact: docs/forsvn/artifacts/marketing/campaign-plan.md
- current evidence window: 2026-07-01..2026-07-21 (21d), source: Convex analytics + Meta dashboard + CRM
- channels in rollup: paid-social, organic-shortform, lifecycle-email
- total spend (fully loaded): $3,500

Proceeding to evaluate cycle 1 (campaign: forsvn-launch-q3).
```

**Write-back: none.** evaluate-campaign never writes to `experience/`; loop state lives in the loop dir.

---

## Step 1 — Layer 1 dispatch (Metric Ingest + Diagnosis, parallel)

**Metric Ingest** (`agents/metric-ingest-agent.md`) normalizes the operator packet into a falsifiable metric set — blended CAC and paid CAC kept **distinct**, per-channel rollup mandatory, attribution model named:

```
primary_metric: net-new trial signups = 372 (window 2026-07-01..2026-07-21, source: Convex analytics)
baseline: 168 net-new trials (cycle 0, organic-only 21-day window — comparable channel-light baseline; flagged not fully comparable: cycle 1 added paid + email)
attribution_model: last-click (Meta + UTM) — bias flagged: over-credits final touch
total_spend_fully_loaded: $3,500
net_new_after_rider_exclusion: 372 − 96 (email, rider) = 276 campaign-driven net-new
blended_CAC: $3,500 ÷ 276 = $12.68
paid_CAC (paid-social only): $3,000 ÷ 84 = $35.71   ← reported DISTINCT from blended
per-channel rollup: complete (3/3 channels)
caveats: 21-day window above the 14-day floor; email is an existing-list send (rider candidate)
```

**Diagnosis** (`agents/diagnosis-agent.md`) reads the plan's hypothesis + Metric Ingest's packet, classifies each channel driver/rider/mixed, and computes unit-economics signals:

```
plan_hypothesis: paid-social scales reach; organic-shortform compounds; email re-activates list
channel_mix_read:
  - organic-shortform = DRIVER (96 net-new trials; +60% vs the organic-only baseline weekly run-rate; no media)
  - paid-social = MIXED (84 net-new; real net-new but paid CAC $35.71 → payback ~1.9mo at $19/mo, right at the 2mo edge)
  - lifecycle-email = RIDER (96 conversions, but recipients were already-warm trial-finishers in-funnel pre-campaign; last-click over-credits the email)
rider_channels_excluded: lifecycle-email's 96 conversions removed from campaign-driven net-new (276 stands)
breakdown_completeness: yes — all 3 channels present
unit_economics_read: MIXED — blended $12.68 looks healthy, but paid-social alone is at the payback edge; organic carries the blend
confounders: a concurrent FORSVN landing-page refresh shipped 2026-07-05 (could lift all channels); summer seasonality minor
```

---

## Step 2 — Layer 2 dispatch (Recommendation)

**Recommendation** (`agents/recommendation-agent.md`) consumes both Layer 1 outputs and proposes verdict + smallest-correct next action + ledger row + learning-promotion call:

```
verdict: keep (campaign-level — organic + paid both produced honest net-new above baseline)
confidence: medium (21-day single-cycle window; one concurrent confounder; baseline not fully comparable)
keep: organic-shortform (driver, zero media, best CAC); paid-social at current budget (mixed, at payback edge — watch, do not scale yet)
discard: none
watch: paid-social payback — re-check at cycle 2 before scaling budget
route_next_work_to: plan-campaign --rev=2 (budget-reallocation scope only — shift +$500 to organic, hold paid flat; NOT a full re-plan)
learning_promotion: yes — "for the $19/mo subscription ICP, an existing-list email send is a rider, not a campaign driver; exclude its conversions from net-new" (generalizes beyond this campaign)
```

---

## Step 3 — Produced eval artifact (written in full after Critic PASS)

Saved to `.forsvn/loops/forsvn-launch/evals/2026-07-22-cycle-1.md`:

```markdown
---
skill: evaluate-campaign
version: 1
date: 2026-07-22
status: done_with_concerns
summary: "forsvn-launch-q3 cycle 1 campaign evaluation"
purpose: "Post-launch evidence snapshot for a multi-channel campaign eval loop, scored across all channels as one aggregate"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current campaign cycle"
do_not_use_when: "Re-planning next-cycle campaign strategy without reading the latest loop context and results"
upstream: ".forsvn/loops/forsvn-launch/program.md, context.md, strategy/, execution/, docs/forsvn/artifacts/marketing/campaign-plan.md, metric source"
downstream: "results.tsv, learnings.md, plan-campaign next-cycle plan"
provenance:
  skill: evaluate-campaign
  run_date: 2026-07-22
  input_artifacts:
    - docs/forsvn/artifacts/marketing/campaign-plan.md
    - brand/BRAND.md
    - research/icp-research.md
  output_eval: null
---

# forsvn-launch-q3 Cycle 1 Evaluation

## Verdict

- Status: keep
- Confidence: medium
- Campaign: forsvn-launch-q3
- Primary metric: net-new trial signups = 372 (276 campaign-driven after rider exclusion) vs 168 baseline
- Decision: Keep forsvn-launch-q3 — organic-shortform drove net-new at zero media and paid-social cleared baseline; route a budget-reallocation (not a re-plan) to plan-campaign --rev=2.

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| net-new trial signups | 372 | 168 | 2026-07-01..2026-07-21 (21d) | Convex analytics | 96 are email-rider; 276 campaign-driven |
| reach / impressions | 218,000 | 41,000 | 21d, $3,500 spend | Meta + platform analytics | organic reach un-deduped across platforms |
| leads | 372 | 168 | 21d | Convex analytics | trial-start = the lead event here |
| conversions / new customers | 372 | 168 | 21d | CRM | post-trial paid conversion not yet measurable |
| revenue | $1,748 (illus.) | $790 (illus.) | 21d | CRM (MRR booked) | early MRR only; net of organic baseline |
| blended CAC | $12.68 | n/a (organic-only) | 21d, $3,500 | computed | $3,500 ÷ 276 campaign-driven |
| paid CAC | $35.71 | n/a | 21d, $3,000 | computed | paid-social only — DISTINCT from blended |
| total spend (fully loaded) | $3,500 | $0 | 21d | operator-supplied | media $2,400 + production $600 + effort $450 + tooling $50 |

## What Changed This Cycle

- Source plan-campaign artifact: `docs/forsvn/artifacts/marketing/campaign-plan.md`
- Objective/channel-mix/budget-split/sequencing delta from prior cycle: cycle 0 was an organic-only baseline; cycle 1 added paid-social ($3,000 fully loaded) + a lifecycle-email send to the existing trial-finisher list. Budget split paid-heavy. Landing-page refresh shipped mid-window (confounder).

## Diagnosis

### Likely Drivers

- Organic short-form carried the net-new lift (96 trials, no media) — the strongest signal in the mix, consistent with the plan's "organic compounds" hypothesis.
- Paid-social produced real net-new (84) but at a CAC near the payback ceiling — a mixed, not a strong, result.

### Channel-Mix Signals

| Channel | Spend / Effort | Reach | Leads | Conversions | Revenue | CAC | Role |
|---|---:|---:|---:|---:|---:|---:|---|
| organic-shortform | $450 (effort est.) | 142,000 | 96 | 96 | $608 (illus.) | $4.69 (allocated effort) | driver |
| paid-social | $3,000 | 71,000 | 84 | 84 | $532 (illus.) | $35.71 | mixed |
| lifecycle-email | $50 tooling | 3,100 | 96 | 96 | $608 (illus.) | n/a — warm list | rider |

- channel_mix_read: organic-shortform drove net-new at the lowest CAC; paid-social added net-new but at the payback edge; lifecycle-email converted already-warm trial-finishers who pre-dated the campaign.
- rider_channels_excluded: lifecycle-email's 96 conversions are NOT counted as campaign-driven net-new (last-click over-credits an existing-list send to in-funnel users). Campaign-driven net-new = 276.
- breakdown_completeness: yes — all 3 channels that received spend/effort appear.

### Unit-Economics Signals

- blended_CAC: $12.68 (fully-loaded $3,500 ÷ 276 campaign-driven net-new)
- paid_CAC: $35.71 (paid-social $3,000 ÷ 84 paid net-new) — reported distinct from blended
- payback_period: paid-social ≈ 1.9 months at $19/mo (right at the 2-month target ceiling); organic effectively immediate
- ltv_cac_ratio: not yet measurable (post-trial retention pending)
- revenue_attribution_note: revenue figures are early MRR, net of the ~12-trials/week organic baseline; treat as a lower bound, not a campaign trophy
- unit_economics_read: mixed

### Confounders

- Concurrent FORSVN landing-page refresh shipped 2026-07-05 (could lift all channels — un-isolated)
- Baseline (cycle 0) was organic-only and not fully comparable to a 3-channel cycle — comparison flagged
- Minor summer seasonality; last-click attribution over-credits the email rider

## Next Cycle Recommendation

- Keep: organic-shortform (driver, lowest CAC); paid-social at current budget
- Discard: none
- Watch: paid-social payback — re-measure at cycle 2 before any budget scale-up
- Route next work to: plan-campaign --rev=2 (budget-reallocation scope: +$500 to organic, hold paid flat)

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
1	2026-07-22	evals/2026-07-22-cycle-1.md	net-new trial signups	276	168	keep	forsvn-launch-q3 276 campaign-driven net-new trials vs 168 baseline — keep organic driver + paid at $35.71 CAC, exclude email rider, watch paid payback
```

## Learning Promotion

- Promote to `learnings.md`: yes
- Lesson: For the $19/mo subscription ICP, an existing-list email send to in-funnel trial-finishers is a rider, not a campaign driver — exclude its conversions from campaign-driven net-new.
- Expiry / caveat: holds while the email targets a pre-campaign warm list; retest if the email targets cold/net-new segments or if the attribution model changes from last-click to multi-touch.
```

---

## Step 4 — Append the ledger row (after Critic PASS)

```bash
bun scripts/append-loop-result.ts "forsvn-launch" \
  --artifact evals/2026-07-22-cycle-1.md \
  --metric "net-new trial signups" --value "276" --baseline "168" \
  --status "keep" \
  --description "forsvn-launch-q3 276 campaign-driven net-new trials vs 168 baseline — keep organic driver + paid at \$35.71 CAC, exclude email rider, watch paid payback"
```

`forsvn-launch-q3` (the campaign tag) is present in the description — Hard Fail #8 avoided. Then `bun scripts/manifest-sync.ts` refreshes the manifest.

---

## Step 5 — Critic Verdict (PASS)

The Critic (`agents/critic-agent.md`) scores the 7-dim rubric. Aggregate ≥ 49 AND every per-dim ≥ 6 → PASS (here PASS_WITH_CONCERNS because confidence is medium with a live confounder):

```markdown
## Critic Verdict

- verdict: PASS_WITH_CONCERNS
- score: 58/70
- per_dim:
  - loop_fit: 9 — program.md + context.md + results.tsv read; cycle scoped to the whole campaign across all 3 channels; cycle number = last cycle + 1
  - metric_integrity: 8 — primary metric + baseline + window + total fully-loaded spend present; per-channel rollup complete for all 3 channels
  - attribution_honesty: 8 — last-click model named and its bias flagged; concurrent landing-page refresh + non-fully-comparable baseline both surfaced
  - decision_discipline: 9 — keep matches the packet; routing to plan-campaign --rev=2 is a narrow budget-reallocation, not a re-plan
  - channel_mix_discrimination: 9 — all 3 channels in the breakdown; email classified rider and its 96 conversions excluded from the 276 net-new
  - unit_economics_discipline: 8 — blended $12.68 and paid $35.71 reported distinct; payback stated against the $19/mo price; no laundering
  - ledger_correctness: 7 — one 8-col row appended via the helper; campaign tag present; description slightly verbose
- required_fixes:
  - none
- concerns:
  - medium confidence on a 21-day single cycle with a concurrent landing-page refresh — re-confirm paid payback at cycle 2 before scaling
- hard_fails_triggered:
  - none
```

PASS → side effects execute in order: write artifact → append ledger row → promote learning (Critic approved) → manifest-sync.

---

## FAIL → fix variant (blended-CAC laundering caught, then corrected)

Suppose Recommendation had instead claimed `keep` on the **blended** $12.68 while treating paid-social as a winner and **not** showing the $35.71 paid CAC as a distinct line. Critic cycle 1 scores **unit_economics_discipline: 4** — a single-dim FAIL even with a healthy aggregate:

```markdown
## Critic Verdict

- verdict: FAIL
- score: 51/70
- per_dim:
  - ...
  - unit_economics_discipline: 4 — keep rests on blended $12.68; paid CAC alone ($35.71, ~1.9mo payback at the ceiling) is not shown as a distinct line; an at-edge paid channel is laundered through the blend
  - ...
- required_fixes:
  - Split the one blended CAC into blended ($12.68) AND paid-only ($35.71); state paid-social payback against the $19/mo price; downgrade paid-social from "winner" to "mixed / watch"
- concerns:
  - none
- hard_fails_triggered:
  - #11 (keep resting on blended CAC while paid CAC is at/over the payback target without a distinct paid-CAC line)
```

Orchestrator re-dispatches **Recommendation** (Hard Fail #11 is a unit-economics dim) with the `required_fixes`. The revised recommendation reports both CAC numbers distinctly, reclassifies paid-social as `mixed` with a `watch`, and routes a budget-reallocation. Critic cycle 2: unit_economics_discipline 8, aggregate 58/70 → **PASS_WITH_CONCERNS** — the artifact shown above. (If cycle 2 had still FAILed, no ledger row is written and the cycle returns `BLOCKED`.)

---

## Completion Status: DONE_WITH_CONCERNS

Artifact written, one ledger row appended, learning promoted, manifest synced, Critic PASS_WITH_CONCERNS. Flagged risk: medium confidence on a 21-day single cycle with a concurrent landing-page refresh — re-confirm paid-social payback at cycle 2 before scaling its budget. A clean (no-confounder, comparable-baseline, high-confidence) cycle would instead close **DONE**.
