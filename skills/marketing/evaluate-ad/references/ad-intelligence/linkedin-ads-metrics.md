---
type: ad-intelligence
surface: linkedin-ads-metrics
schema_version: 1
last_verified: 2026-06-20
verifier: hungv47
source_basis: "LinkedIn Campaign Manager reporting + Lead Gen Form docs (business.linkedin.com) synthesized with practitioner B2B paid diagnosis; convention-level thresholds tagged [pattern-derived]."
status: draft
---

# LinkedIn Ads — Metric Set (eval loop)

Loaded by `evaluate-ad` when `network: linkedin-ads`. LinkedIn is **expensive and low-CTR by nature**; the only metric that matters is **cost per qualified lead / pipeline**, never CTR or CPL alone. Audiences are small, so the failure mode is **frequency burn**, not creative variety. One network (+ targeting-mode) per cycle.

## Primary metrics (ingest these)

| Metric | What it tells you | Guardrail / read |
|---|---|---|
| **CTR (sponsored)** | engagement | low absolute is normal (~0.3–0.5%); don't panic on a "low" CTR |
| **Lead-Gen-Form CVR** | form completion rate | high CVR but low quality is the LGF trap — read with downstream quality |
| **Cost per lead (CPL)** | raw lead cost | misleading alone — junk leads are cheap |
| **Cost per *qualified* lead / per opportunity** | the real outcome | **the keep/kill axis** — judge here, never on CPL/CTR |
| **CPC** | click cost | expect $5–$15+; sanity-check the math, not a target |
| **Frequency** | impressions per account/person | the fatigue driver on small audiences |

## Diagnosis signals (small-audience economics)

- **High LGF CVR, low qualified-lead rate** → the form caught low-intent one-tappers; recommend an LP with an intent filter for high-ACV, or tighter targeting.
- **Rising frequency + rising CPL** → audience fatigue (small pool); refresh creative or expand the segment, don't just raise bids. [pattern-derived]
- **Good CTR, no pipeline** → wrong audience or unbacked claim; check targeting-mode + the substantiation floor.
- **CPL fine but cost-per-opportunity bad** → lead quality problem; the eval should flag the LGF↔LP tradeoff, not the creative.

## Keep / kill

Keep while cost-per-qualified-lead ≤ target; kill/rework when it exceeds target across enough signal to trust (B2B volume is low — give it more time than Meta before judging). [pattern-derived] Never kill on CTR or CPL in isolation.

## Source basis

CTR norms, Lead Gen Form mechanics, and the CPL-vs-qualified-lead distinction are from LinkedIn Campaign Manager docs; the small-audience fatigue model and keep/kill thresholds are `[pattern-derived]` practitioner convention. Re-verify on next linkedin-ads cycle.
