---
skill: run-eval-loop
version: 1
date: 2026-05-19
status: done
summary: "Content Demo loop context — synthetic baselines + measurement assumptions"
purpose: "Frozen context for the Content Demo loop: baselines, primary-platform scope, measurement assumptions"
lifecycle: loop-context
use_when: "Reading prior baselines + measurement assumptions before scoring a new cycle"
do_not_use_when: "As authoritative for non-Content-Demo loops — context is synthetic"
upstream: "synthetic baseline data for D19 infrastructure proof"
downstream: "evaluate-content cycles writing into evals/"
---

# Content Demo Context

## Why this loop exists

Workstream D slice 3 (D19 in `implementation-roadmap/execution-evaluation/decisions.md`) needed an end-to-end infrastructure proof for `evaluate-content`. Following the D8 `lp-demo` and D15 `ad-demo` precedents, a synthetic loop was scaffolded to:

1. Validate the 4-agent dispatch (Metric Ingest + Diagnosis + Recommendation + Critic) ships clean artifacts.
2. Exercise the 7-dim rubric on a single synthetic cycle.
3. Confirm the ledger row schema (8 columns + primary-platform in description) appends correctly via `bun scripts/append-loop-result.ts`.
4. Demonstrate platform/format-scoped learning promotion to `learnings.md`.
5. Prove generation-provenance frontmatter wiring (D8 contract).

**Important:** The values throughout this loop are synthetic. Do not treat them as benchmark data for real content.

## Synthetic baseline

Notional cycle 0 (not materialized in `results.tsv` — pre-loop baseline):

- Vertical: subscription-app, $19/mo
- Platform: LinkedIn (organic)
- Content type: carousel (8 slides)
- Creative: generic-benefit slide 1 ("3 ways to work smarter"), generic CTA ("Learn more")
- Window: 7 days, ~1,900 reach
- Save rate: 1.2% (≈23 saves)
- Engagement breakdown: 240 likes, 23 saves, 5 shares, 6 comments
- Click-through: 0.5%

## Measurement assumptions

- **Source:** native LinkedIn post analytics.
- **Window:** 7-day cycle is the standard measurement window for organic LinkedIn content (the platform's distribution tail is largely spent by day 5-7).
- **Reach floor:** reach < ~1,000 = confidence auto-capped at `low`.
- **Comparability:** baselines must come from the same platform AND the same content type. A carousel cycle does not compare to a text-post baseline. Cross-platform comparison is a Critic Hard Fail.
- **Vanity vs meaningful:** likes + impressions are vanity; saves + shares + comments + click-through are meaningful. The verdict rests on meaningful engagement.

## Primary-platform scope

- **linkedin** (cycle 1, ...): the primary platform for this loop. Organic carousel content; the ICP (subscription-app buyers) concentrates here.
- Secondary platforms (e.g., Instagram) may carry the same content — their metrics appear as Cross-Platform Context in the cycle artifact and never drive the verdict. A genuine Instagram evaluation would be its own cycle with `instagram` as the primary platform.

## Frozen Context (canonical)

- `brand/BRAND.md` — voice, archetype, sacred elements
- `research/icp-research.md` — audience traits, pain points, language patterns
- Source write-social artifact for cycle 1: `.forsvn/artifacts/mkt/copy/linkedin-2026-05-12-job-title-hook.md` (synthetic — does not exist on disk; cycle 1 evaluator pretends it does for infrastructure proof)

## Known limitations

This loop is single-cycle. Cycles 2-3 would normally trigger the rubric-revision review per `references/rubric.md` § Revision Triggers — for D19 infrastructure proof we ship cycle 1 only and document the next-cycle hypothesis in the eval artifact.
