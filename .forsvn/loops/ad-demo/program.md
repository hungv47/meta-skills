---
skill: run-eval-loop
version: 1
date: 2026-05-19
status: done
summary: "Ad Demo measurable improvement loop — Meta paid-ad eval infra proof"
purpose: "Operating program for a measurable strategy -> execution -> evaluation loop for Meta paid-ad creative; synthetic loop scaffolded as D15.B infrastructure proof for evaluate-ad"
lifecycle: loop
use_when: "Coordinating repeated ad-copy authorship, launch, evaluation, and keep/discard decisions for a Meta paid-ad campaign — one audience-temperature per cycle"
do_not_use_when: "Non-Meta paid platforms (Google RSA / LinkedIn Ads / TikTok Ads — reserved for future expansion); organic social copy (use a separate loop with write-social + evaluate-content); landing-page CRO work (use a separate loop with brief-landing-page + evaluate-landing-page)"
upstream: "operator intent, write-ad source artifacts, Meta Ads Manager metrics, prior cycle baselines"
downstream: "write-ad next-cycle creative, plan-campaign channel-mix retrospective, brief-landing-page when LP-bottleneck signal surfaces"
---

# Ad Demo Program

## Goal

Demonstrate the end-to-end evaluate-ad loop infrastructure on a synthetic Meta paid-ad cycle. Proves: provenance frontmatter wired (D8 contract) → manual-metric-entry path → critic-override log capability → quality-dashboard capability → experience-promotion rule (audience-temp-scoped).

This is an INFRASTRUCTURE PROOF loop, not a real campaign loop. The values in `evals/2026-05-19-cycle-1.md` are synthetic placeholders calibrated to exercise the 7-dim rubric. Real-campaign cycles should scaffold a fresh loop.

## Measurable Surface

A single synthetic Meta cold-traffic ad campaign for a fictional vertical (subscription-app, $19/mo). Hero: hook + headline + primary text + CTA testing concrete-noun framing against abstract-benefit baseline. One audience-temperature per cycle — cycle 1 is `cold-traffic`.

## Primary Metric

**ROAS (return on ad spend)** — synthetic baseline 1.8× from prior cold-traffic cycle (notional cycle 0). Cycle 1 measures the impact of a refreshed hook on ROAS while holding hero, offer, audience, and bid-strategy constant.

Secondary metrics surfaced in Evidence table: CTR, CPA, frequency, spend, conversions.

## Guardrail Metrics

- **Frequency cap (cold-traffic):** > 3.0 = fatigue warn; > 3.5 = guardrail FAIL even if ROAS improved.
- **CPA ceiling:** > $28 = guardrail FAIL (synthetic baseline: $22).
- **Spend confidence floor:** spend < $50/ad-group OR impressions < 10k = confidence auto-capped at `low`.
- **iOS-ATT attribution window note:** 1d-click + 1d-view default; cycles spanning attribution-window changes must flag confounder.

## Mutable Surface

Agents may change between cycles: hook copy, headline copy, primary text framing, hero image / video, CTA verb. Frozen between cycles unless explicitly tested: audience targeting, bid strategy, placements, offer ($19/mo subscription), landing page.

## Frozen Context

- Canonical brand/research constraints stay authoritative — see `brand/BRAND.md` and `research/icp-research.md`.
- Source ad-copy artifact lives at `.forsvn/artifacts/mkt/ad-copy/cold-traffic-2026-05-15-paint-pourer.md` (synthetic).
- External execution systems (Meta Ads Manager, Triple Whale, Northbeam) remain outside this folder; this loop stores strategy, execution references, evals, and learning decisions only.

## Cycle Protocol

1. Read `context.md`, `learnings.md`, prior `results.tsv`, and the latest artifacts in `strategy/`, `execution/`, and `evals/` (scoped to the same audience-temperature).
2. Produce or revise one bounded strategy or execution artifact for the next cycle's audience-temp.
3. Run or ingest an evaluation snapshot after the measurement window closes via `/evaluate-ad`. One cycle = one audience-temp.
4. Record the cycle in `results.tsv` with status `keep`, `discard`, `watch`, or `blocked` — description MUST include the audience-temp tag.
5. Promote only audience-temp-scoped, evidence-backed lessons to `learnings.md` (high-confidence + status keep/discard).

## Promotion Rule

- `keep` — clear metric improvement vs same-audience-temp baseline, guardrails passing (frequency below cap, CPA below ceiling), confidence ≥ medium, no creative-fatigue signal (or borderline + holds-stable).
- `discard` — worse result OR guardrail failed OR severe creative-fatigue (CTR halved + frequency > 1.5× threshold), AND change plausibly tied to the cycle.
- `watch` — positive or mixed signal but underpowered (spend below floor), weak baseline, material confounders, or borderline fatigue.
- `blocked` — missing primary metric / source / window, contradictory data, mixed-audience metric ingest, broken tracking, OR no proof the cycle's creative actually shipped.
