---
skill: run-eval-loop
version: 1
date: 2026-05-20
status: done
summary: "Campaign Demo measurable improvement loop — multi-channel campaign eval infra proof"
purpose: "Operating program for a measurable strategy -> execution -> evaluation loop for a multi-channel marketing campaign; synthetic loop scaffolded as D20 infrastructure proof for evaluate-campaign"
lifecycle: loop
use_when: "Coordinating repeated plan-campaign authorship, launch, evaluation, and keep/discard decisions for a multi-channel campaign — one cycle = the whole campaign across all channels"
do_not_use_when: "Single-ad performance (use a loop with write-ad + evaluate-ad); single organic post (write-social + evaluate-content); landing-page CRO (brief-landing-page + evaluate-landing-page); short-form video (brief-shortform + evaluate-shortform)"
upstream: "operator intent, plan-campaign source artifact, CRM + ad-platform + analytics exports, prior cycle baselines"
downstream: "plan-campaign next-cycle plan, write-ad / write-social when a channel's creative is the bottleneck, run-eval-loop when the metric contract needs redefinition"
---

# Campaign Demo Program

## Goal

Demonstrate the end-to-end evaluate-campaign loop infrastructure on a synthetic multi-channel campaign cycle. Proves: provenance frontmatter wired (D8 contract) → manual-metric-entry path → critic-override log capability → quality-dashboard capability → experience-promotion rule (campaign-type/channel-mix-scoped).

This is an INFRASTRUCTURE PROOF loop, not a real campaign loop. The values in `evals/2026-05-20-cycle-1.md` are synthetic placeholders calibrated to exercise the 7-dim rubric — specifically the two campaign-specific dims (Channel-Mix Discrimination + Unit-Economics Discipline). Real-campaign cycles should scaffold a fresh loop.

## Measurable Surface

A single synthetic 4-week launch campaign for a fictional vertical (subscription-app, $19/mo) running on four channels: paid-social (Meta ads), organic-linkedin, content-seo, and an email send to the existing trial list. One cycle = the whole campaign across all four channels — the per-channel breakdown is the campaign-eval's distinctive artifact element. The campaign tests a 4-channel launch mix against a prior single-quarter launch baseline.

## Primary Metric

**Net-new paid subscribers (campaign-driven)** — synthetic baseline 120 from a prior comparable multi-channel launch campaign (notional cycle 0). Cycle 1 measures whether the 4-channel mix produced more campaign-driven net-new subscribers than the baseline launch — where "campaign-driven" explicitly EXCLUDES conversions a rider channel borrowed from pre-existing warm demand.

Secondary metrics surfaced in the Evidence table: reach, leads, conversions, revenue (first-month MRR added), blended CAC, paid CAC, total fully-loaded spend.

## Guardrail Metrics

- **Rider-channel guard:** a `keep` requires the genuine `driver` channels to carry the net-new lift. Conversions from a `rider` channel (a channel that converted warm demand pre-dating the campaign) do NOT count toward campaign-driven net-new. Counting borrowed credit is a guardrail FAIL.
- **Unit-economics guard:** blended CAC and paid CAC are reported as distinct numbers. A `keep` that rests on a healthy blended CAC while paid CAC alone is underwater vs the $19/mo price (payback target ≤ 3 months) is flagged — the campaign may keep while the paid channel is routed for a fix.
- **Baseline comparability:** the baseline must come from a comparable campaign type AND a comparable channel mix (a multi-channel launch does not compare to an always-on retargeting campaign).
- **Sample floor:** total fully-loaded spend < ~$2,000 or a single-week window = confidence auto-capped at `low`.

## Mutable Surface

Agents may change between cycles: channel mix, budget split across channels, sequencing, per-channel creative direction, offer framing, audience segment. Frozen between cycles unless explicitly tested: the product ($19/mo subscription), the primary metric definition (campaign-driven net-new subscribers), the attribution model (last-click via CRM, with its bias acknowledged).

## Frozen Context

- Canonical brand/research constraints stay authoritative — see `brand/BRAND.md` and `research/icp-research.md`.
- Source plan-campaign artifact lives at `.forsvn/artifacts/mkt/campaign-plan.md` (synthetic — does not exist on disk; cycle 1 evaluator pretends it does for infrastructure proof).
- External execution systems (CRM, Meta Ads dashboard, web analytics) remain outside this folder; this loop stores strategy, execution references, evals, and learning decisions only.

## Cycle Protocol

1. Read `context.md`, `learnings.md`, prior `results.tsv`, and the latest artifacts in `strategy/`, `execution/`, and `evals/`.
2. Produce or revise one bounded strategy or execution artifact for the next cycle.
3. Run or ingest an evaluation snapshot after the measurement window closes via `/evaluate-campaign`. One cycle = the whole campaign across all channels.
4. Record the cycle in `results.tsv` with status `keep`, `discard`, `watch`, or `blocked` — description MUST include the campaign tag.
5. Promote only campaign-type/channel-mix-scoped, evidence-backed lessons to `learnings.md` (high-confidence + status keep/discard).

## Promotion Rule

- `keep` — clear primary-metric improvement vs a comparable-campaign-type baseline, the lift carried by genuine `driver` channels (not a rider channel's borrowed credit), confidence ≥ medium.
- `discard` — worse result OR a guardrail failed OR the whole campaign's unit economics are underwater with no plausible fix, AND the result plausibly tied to the cycle.
- `watch` — positive or mixed signal but underpowered (spend below floor), weak baseline, material confounders, or a mixed channel-mix read.
- `blocked` — missing primary metric / source / window, an incomplete channel rollup, contradictory data, OR no proof the campaign actually launched.
