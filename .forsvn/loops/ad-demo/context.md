---
skill: run-eval-loop
version: 1
date: 2026-05-19
status: done
summary: "Ad Demo loop context — synthetic baselines + measurement assumptions"
purpose: "Frozen context for the Ad Demo loop: baselines, audience-temp scopes, measurement assumptions"
lifecycle: loop-context
use_when: "Reading prior baselines + measurement assumptions before scoring a new cycle"
do_not_use_when: "As authoritative for non-Ad-Demo loops — context is synthetic"
upstream: "synthetic baseline data for D15.B infrastructure proof"
downstream: "evaluate-ad cycles writing into evals/"
---

# Ad Demo Context

## Why this loop exists

Workstream D slice 2 (D15.B in `implementation-roadmap/execution-evaluation/decisions.md`) needed an end-to-end infrastructure proof for `evaluate-ad`. Following the D8 `lp-demo` precedent, a synthetic loop was scaffolded to:

1. Validate the 4-agent dispatch (Metric Ingest + Diagnosis + Recommendation + Critic) ships clean artifacts.
2. Exercise the 7-dim rubric on a single synthetic cycle.
3. Confirm the ledger row schema (8 columns + audience-temp in description) appends correctly via `bun scripts/append-loop-result.ts`.
4. Demonstrate audience-temp-scoped learning promotion to `learnings.md`.
5. Prove generation-provenance frontmatter wiring (D8 contract).

**Important:** The values throughout this loop are synthetic. Do not treat them as benchmark data for real campaigns.

## Synthetic baseline

Notional cycle 0 (not materialized in `results.tsv` — pre-loop baseline):

- Vertical: subscription-app, $19/mo
- Audience: cold-traffic, lookalike-2% of paying customers
- Creative: abstract-benefit hook ("Unlock your potential with AI"), generic hero (gradient + product screenshot), generic CTA ("Start Free Trial")
- Window: 14 days, $1,200 spend, ~85k impressions
- ROAS: 1.8×
- CTR: 0.9%
- CPA: $24
- Frequency at close: 2.1
- Conversions: 50 trial-starts

## Measurement assumptions

- **Source:** Meta Ads Manager export, 1d-click + 1d-view attribution window (iOS-ATT default).
- **Window:** 14-day cycle is the minimum confidence window; cycles shorter than 14 days flag confidence as `low`.
- **Spend floor:** $50/ad-group AND ~10k impressions = confidence floor. Below either = auto-cap confidence at `low`.
- **iOS-ATT:** ~30% of cold-traffic conversions are unattributable on iOS post-14.5. Flagged as a default confounder.
- **Comparability:** baselines must come from the same audience-temp prior cycle. Cross-temp comparison is a Critic Hard Fail.

## Audience-temp scope

- **cold-traffic** (cycles 1, 3, 5, ...): lookalike audiences, interest stacks, prospecting placements. Hooks emphasize problem-aware curiosity. Creative-fatigue threshold: frequency 3.0.
- **retargeting** (cycles 2, 4, 6, ...): 30-day site visitors, 14-day add-to-cart, engagement custom audiences. Hooks emphasize urgency + objection-handling. Creative-fatigue threshold: frequency 4.5.

(In real campaigns, both temps can run concurrently; cycle numbers are sequential, audience-temp lives in the ledger description.)

## Frozen Context (canonical)

- `brand/BRAND.md` — voice, archetype, sacred elements
- `research/icp-research.md` — audience traits, pain points, language patterns
- Source ad-copy artifact for cycle 1: `.forsvn/artifacts/mkt/ad-copy/cold-traffic-2026-05-15-paint-pourer.md` (synthetic — does not exist on disk; cycle 1 evaluator pretends it does for infrastructure proof)

## Known limitations

This loop is single-cycle. Cycles 2-3 would normally trigger the rubric-revision review per `references/rubric.md` § Revision Triggers — for D15.B infrastructure proof we ship cycle 1 only and document the next-cycle hypothesis in the eval artifact.
