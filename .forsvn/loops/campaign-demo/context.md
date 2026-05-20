---
skill: run-eval-loop
version: 1
date: 2026-05-20
status: done
summary: "Campaign Demo loop context — synthetic baselines + measurement assumptions"
purpose: "Frozen context for the Campaign Demo loop: baselines, channel set, measurement assumptions"
lifecycle: loop-context
use_when: "Reading prior baselines + measurement assumptions before scoring a new cycle"
do_not_use_when: "As authoritative for non-Campaign-Demo loops — context is synthetic"
upstream: "synthetic baseline data for D20 infrastructure proof"
downstream: "evaluate-campaign cycles writing into evals/"
---

# Campaign Demo Context

## Why this loop exists

Workstream D slice 4 (D20 in `implementation-roadmap/execution-evaluation/decisions.md`) needed an end-to-end infrastructure proof for `evaluate-campaign`. Following the D8 `lp-demo`, D15 `ad-demo`, and D19 `content-demo` precedents, a synthetic loop was scaffolded to:

1. Validate the 4-agent dispatch (Metric Ingest + Diagnosis + Recommendation + Critic) ships clean artifacts.
2. Exercise the 7-dim rubric on a single synthetic cycle — especially the two campaign-specific dims (Channel-Mix Discrimination + Unit-Economics Discipline).
3. Confirm the ledger row schema (8 columns + campaign tag in description) appends correctly via `bun scripts/append-loop-result.ts`.
4. Demonstrate campaign-type/channel-mix-scoped learning promotion to `learnings.md`.
5. Prove generation-provenance frontmatter wiring (D8 contract).

**Important:** The values throughout this loop are synthetic. Do not treat them as benchmark data for real campaigns.

## Synthetic baseline

Notional cycle 0 (not materialized in `results.tsv` — pre-loop baseline):

- Vertical: subscription-app, $19/mo (~$15.20/mo gross contribution at ~80% margin)
- Campaign type: multi-channel product-launch campaign, 4-week window
- Prior launch (Q4): paid-social + organic-linkedin + email mix, no content-seo channel
- Net-new paid subscribers (campaign-driven): 120
- Blended CAC (fully loaded): ~$58
- Payback target: ≤ 3 months of gross contribution (≈ ≤ $45.60 CAC for a clean pass)

## Measurement assumptions

- **Source:** CRM for subscriber counts + revenue; Meta Ads dashboard for paid spend + reach; web analytics for organic reach + content-seo leads.
- **Window:** a 4-week launch window is the standard measurement cycle for a launch campaign (the acquisition curve is largely spent by week 4).
- **Attribution model:** last-click via the CRM. Known bias: under-credits top-of-funnel channels (content-seo) and over-credits bottom-of-funnel last touches (email to a warm list). The evaluator must flag this bias, not smooth it.
- **Spend floor:** total fully-loaded spend < ~$2,000 = confidence auto-capped at `low`.
- **Comparability:** baselines must come from a comparable campaign type AND a comparable channel mix. A multi-channel launch does not compare to an always-on retargeting campaign. A non-comparable baseline is a Critic Hard Fail.
- **Driver vs rider:** a channel is a `driver` if it created net-new demand the campaign generated; a `rider` if it converted warm demand that pre-dated the campaign. Rider conversions are excluded from campaign-driven net-new.
- **CAC:** blended CAC = fully-loaded total spend ÷ campaign-driven net-new. Paid CAC = paid-channel spend ÷ paid-channel net-new. The two are reported as distinct numbers — never collapsed.

## Channel set (cycle 1)

The campaign ran on four channels — every one appears in the cycle's per-channel breakdown table:

- **paid-social** — Meta ads, net-new prospecting. Media spend.
- **organic-linkedin** — organic posts. Effort-allocated cost (content production time).
- **content-seo** — blog/SEO articles. Effort-allocated cost.
- **email** — a send to the existing trial-user list. Effort-allocated cost. This channel is a candidate `rider` — the trial users it reached were already in-funnel before the campaign launched.

## Frozen Context (canonical)

- `brand/BRAND.md` — voice, archetype, sacred elements
- `research/icp-research.md` — audience traits, pain points, channel concentration
- `research/product-context.md` — the $19/mo price + margin used for payback math
- Source plan-campaign artifact for cycle 1: `.forsvn/artifacts/mkt/campaign-plan.md` (synthetic — does not exist on disk; cycle 1 evaluator pretends it does for infrastructure proof)

## Known limitations

This loop is single-cycle. Cycles 2-3 would normally trigger the rubric-revision review per `references/rubric.md` § Revision Triggers — for D20 infrastructure proof we ship cycle 1 only and document the next-cycle hypothesis in the eval artifact.
