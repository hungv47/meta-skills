---
type: ad-intelligence
surface: google-ads-metrics
schema_version: 1
last_verified: 2026-06-20
verifier: hungv47
source_basis: "Google Ads reporting + Quality Score / Impression Share documentation (support.google.com/google-ads) synthesized with practitioner search diagnosis; convention-level thresholds tagged [pattern-derived]."
status: draft
---

# Google Ads — Metric Set (eval loop)

Loaded by `evaluate-ad` when `network: google-ads`. Search doesn't "fatigue" like a Meta creative — the failure modes are **auction pressure** and **relevance decay**, not ad-frequency burnout. The metric-ingest + diagnosis agents read this set; the audience-temp scoping rule generalizes to **one network (+ intent-tier) per cycle**.

## Primary metrics (ingest these)

| Metric | What it tells you | Guardrail / read |
|---|---|---|
| **Quality Score (1–10)** | the cost lever per keyword | <5 = overpaying; diagnose which component (expected CTR / ad relevance / LP experience) is dragging |
| **Search Impression Share** | % of available impressions you won | low IS = you're capped; check the *reason* below |
| **Search lost IS (budget)** | impressions lost to budget | high = scale budget on a profitable campaign before touching creative |
| **Search lost IS (rank)** | impressions lost to Ad Rank | high = a Quality-Score / bid problem, not a budget one |
| **CTR** | headline pull on the query | judged *per intent-tier* — branded CTR ≫ non-branded; never compare across tiers |
| **Conversion rate + CPA / ROAS** | the business outcome | the keep/kill axis; CTR without conversions = wrong traffic |
| **Ad Strength** | RSA asset diversity | "Poor"/"Average" = add distinct headlines/angles |

## Diagnosis signals (not "fatigue" — relevance + auction)

- **CTR fine, conversions poor** → query/LP mismatch or wrong intent-tier (you bought research traffic). Fix targeting/negatives, not copy.
- **Impression share dropping at flat budget** → rank erosion (competitor entered / Quality Score fell). Improve relevance; don't just raise bids.
- **High lost-IS-budget on positive ROAS** → a scale signal, not a creative signal — the eval should recommend budget, not a rewrite.
- **Ad Strength "Poor"** → asset-diversity problem; recommend more distinct headlines (the write-ad ≥8-angle rule).

## Keep / kill (per intent-tier)

Keep when CPA ≤ target AND impression share has headroom. Kill/rework a non-branded keyword when CPA > target across ≥~15–30 conversions of signal (not on 2–3 conversions — too little data). [pattern-derived] Branded terms are near-always kept (cheap defense).

## Source basis

Quality Score components, Impression-Share metrics (incl. lost-IS-budget vs rank), and the relevance-vs-auction diagnosis are from Google Ads Help; conversion-count minimums and keep/kill thresholds are `[pattern-derived]` practitioner convention. Re-verify on next google-ads cycle.
