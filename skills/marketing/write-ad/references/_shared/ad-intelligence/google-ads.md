<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: ad-intelligence
surface: google-ads-search
schema_version: 1
last_verified: 2026-06-20
verifier: hungv47
source_basis: "Google Ads RSA + Quality Score documentation (support.google.com/adspolicy, support.google.com/google-ads) synthesized with practitioner search-account structure; raw source ledger intentionally omitted from the public skill package. Mechanics tagged [pattern-derived] where they encode practitioner convention rather than a single cited line."
status: draft
---

# Google Ads (Search / RSA) — Ad-Intelligence Surface

Per-network reference for **paid search** on Google Ads — Responsive Search Ads (RSA). Loaded by `write-ad` when `network: google-ads`. Search is bought **at the moment of intent**: the user typed a query, so the lever is *matching the asset to the intent tier*, not interrupting a scroll. The strategist branches on **intent-tier** (§0), not audience-temp.

> Scope: Search RSAs (the indie ICP's first Google move). Performance Max, Display, Shopping, and YouTube are different surfaces — deferred (Open Questions §6).

---

## 0. Framing axis — intent-tier (the strategist branch)

Replaces Meta's warm/cold audience-temp. The query's intent tier sets the angle, the bid, and the proof the copy must carry:

| intent-tier | The query looks like | Copy job | Bid posture |
|---|---|---|---|
| **branded** | your brand name (± "login", "pricing", "reviews") | defend the spot, restate the offer, pre-empt competitors bidding on you | cheap clicks, high CVR — protect even at low volume |
| **non-branded** | the problem / category ("time tracking app", "invoice software") | win on the differentiated mechanism + a proof token; the searcher is comparing | the volume tier; where most budget + most RSA testing goes |
| **competitor** | a rival's brand name | honest comparison angle (no trademark in copy — see policy); "switching from X?" framing | expensive, low Quality Score on the rival's term — use sparingly, watch CPA |
| **generic / research** | broad, early ("how to invoice clients") | educate → soft CTA (lead magnet / guide), not a hard buy | low intent; often better served by content, not search ads — veto candidate |

The strategist picks ONE intent-tier per artifact (mirrors one-audience-temp-per-artifact). A single RSA stuffing branded + competitor angles dilutes Ad Strength and message-match.

---

## 1. Pre-conditions — is paid search the move here?

Paid search is **demand capture**, not demand creation: it only works when people are already searching for the problem. [pattern-derived]

| Condition | Why it gates |
|---|---|
| There is real search volume for the non-branded category | no volume → no clicks to buy; the channel can't manufacture intent (that's social's job) — **veto** |
| The landing page matches the query's promise (message-match) | Google's Quality Score "landing-page experience" component punishes a mismatch with higher CPCs |
| Unit economics survive the category CPC | competitive non-branded terms can run $3–$15+/click; if LTV can't absorb the CPA at a realistic CVR, search loses money — **veto** |
| Conversion tracking is live before spend | without it you optimize blind; Smart Bidding needs conversion signal to function |

If volume is absent OR the LP doesn't match OR CPC > viable CPA, say so and recommend `plan-campaign` (channel re-selection) — do not draft. This is the channel-fit veto for paid search.

---

## 2. Campaign structure — the two-campaign baseline

The practitioner default is **two campaigns**, never one mixed: [pattern-derived]

1. **Brand campaign** — your branded terms only. Cheap, high CVR, defends against competitors bidding on your name. Small budget cap; near-always positive ROAS.
2. **Non-brand campaign** — the category/problem terms. The real test surface: tight ad groups (one theme per group), exact + phrase match, aggressive **negative-keyword hygiene** to keep irrelevant queries out.

- **Ad group = one intent theme.** "invoice software" and "expense tracking" are different ad groups with different RSAs — never one group spanning both (kills relevance, the Quality Score lever).
- **One RSA per ad group, ≥8–10 distinct headlines + ≥3 descriptions**, each a *different* angle (benefit / proof / offer / mechanism / objection). Near-duplicate assets earn "Poor"/"Average" Ad Strength and waste Google's combinatorial mixing.
- **Pin only when forced** (a legal/brand line that must always appear). Over-pinning collapses the RSA to a near-static ad and forfeits Ad Strength.

---

## 3. Quality Score, conversion event + bidding

**Quality Score (1–10)** is the cost lever — higher QS → lower CPC for the same position. Three components, each separately improvable:

| QS component | What moves it | Copy/structure lever |
|---|---|---|
| **Expected CTR** | the headline's pull on this query | put the query's keyword in ≥1 headline; lead with the specific benefit |
| **Ad relevance** | how well the ad matches the ad-group theme | tight one-theme ad groups; keyword echoed in copy |
| **Landing-page experience** | match + speed + clarity of the LP | LP headline mirrors the ad's promise; fast load |

- **Conversion event:** optimize to the *real* business event (trial-start / qualified-lead / purchase), not a click or a pageview. A micro-conversion (newsletter signup) as the optimization target trains Smart Bidding toward cheap, low-value actions. [pattern-derived]
- **Bidding:** start Manual CPC or Maximize Conversions only **after** conversion tracking has signal; switch to Target CPA/ROAS once ≥~15–30 conversions give the algorithm a base. Target CPA set below a realistic floor starves delivery (it can't find conversions that cheap).
- **Match types + negatives:** exact for proven converters, phrase for discovery; mine the search-terms report weekly and add negatives — unmanaged broad match is how search budgets leak.

---

## 4. Anti-patterns (falsifiable — the critic applies each detection rule)

| Anti-pattern | Detection rule (critic-applicable) | Why it fails |
|---|---|---|
| **Near-duplicate RSA assets** | ≥2 headlines share >70% tokens, or <8 distinct headlines | "Poor" Ad Strength; Google can't test combinations |
| **Mixed-intent ad group** | one ad group's keywords span ≥2 unrelated themes | tanks ad relevance → higher CPC |
| **Over-pinning** | ≥4 of 15 headlines pinned, or all to position 1 | collapses RSA to static; forfeits Ad Strength |
| **Optimizing to a micro-conversion** | conversion action = pageview/newsletter, not the real business event | trains bidding toward cheap, low-value clicks |
| **No negative keywords on a broad/phrase campaign** | negative list empty after spend started | budget leaks to irrelevant queries |
| **Unsubstantiated superlative** | "best"/"#1"/"world's leading" with no on-page cited ranking | Google editorial REVISION; no proof |
| **Branded + competitor in one RSA** | one artifact mixes intent-tiers | dilutes message-match + Quality Score |
| **Target CPA set below the proven floor** | tCPA < observed CPA with <15 conversions of history | starves delivery; ad stops serving |

A surface claim that just says "write compelling headlines" is a fortune cookie — every row above is a detection rule a critic can run against a draft.

---

## 5. Source basis

Google Ads RSA mechanics, Ad Strength, Quality Score components, Smart Bidding minimums, and editorial/trademark policy are synthesized from Google Ads Help + Advertising Policies (`support.google.com/google-ads`, `support.google.com/adspolicy`) and practitioner search-account structure. Conventions that encode practitioner judgment (the two-campaign baseline, the ≥8-headline rule, the micro-conversion warning) are tagged `[pattern-derived]` rather than attributed to a single cited line. Re-verify caps/policy on next google-ads invocation.

---

## 6. Open Questions (deferred — do not author yet)

- **Performance Max / Demand Gen** — different asset model + less query control; deferred until an indie user needs it.
- **YouTube ads** — video surface, separate mechanics; deferred (the K1 guardrail).
- **Shopping / Merchant Center** — feed-driven, ecom-specific; out of the indie SaaS ICP's first moves.
