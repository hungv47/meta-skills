---
type: ad-intelligence
surface: tiktok-ads-metrics
schema_version: 1
last_verified: 2026-06-20
verifier: hungv47
source_basis: "TikTok Ads Manager reporting (ads.tiktok.com/help) synthesized with practitioner short-form paid diagnosis; convention-level thresholds tagged [pattern-derived]."
status: draft
---

# TikTok Ads — Metric Set (eval loop)

Loaded by `evaluate-ad` when `network: tiktok-ads`. TikTok creative **fatigues fast** and the leading indicators are *view-through* metrics that move before CPA stabilizes — diagnose the hook on hold rate, not just cost. One network per cycle.

## Primary metrics (ingest these)

| Metric | What it tells you | Guardrail / read |
|---|---|---|
| **Thumbstop (3s view rate)** | did the hook stop the scroll | the leading creative metric; low = the first frame/line failed |
| **6-second view rate / hold rate** | did they stay past the hook | predicts winners before CPA does |
| **CTR** | pull to the destination | secondary on TikTok (lower-intent platform) |
| **CVR + CPA** | the business outcome | the keep/kill axis, but read it *with* hold rate |
| **Frequency** | impressions per user | fatigue driver — TikTok burns faster than Meta |
| **GMV / ROAS (if Shop/commerce)** | revenue outcome | only where commerce tracking exists |

## Diagnosis signals (fatigue is fast)

- **High thumbstop, low hold** → strong hook, weak middle; recommend a new body, keep the hook.
- **Low thumbstop** → the hook/first frame failed; the whole creative needs a new hook (TikTok testing is hook-first).
- **CPA decay + rising frequency** → creative fatigue (fast on TikTok); recommend a refresh, not a bid change. [pattern-derived]
- **Good view metrics, poor CVR** → LP/offer mismatch, not creative; don't rewrite the hook.

## Keep / kill

Keep a creative while hold rate + CPA hold; rotate **before** fatigue (frequency climbing + CPA drifting up from peak). TikTok rewards a *refresh cadence* of new hooks over squeezing one evergreen ad. [pattern-derived] Judge on a few days of signal — TikTok moves fast, but ≤1 day is noise.

## Source basis

Thumbstop / hold-rate / view-rate definitions are from TikTok Ads Manager; the hook-first diagnosis, fast-fatigue refresh cadence, and keep/kill thresholds are `[pattern-derived]` practitioner convention. Re-verify on next tiktok-ads cycle.
