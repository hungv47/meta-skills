---
type: ad-intelligence
surface: tiktok-ads
schema_version: 1
last_verified: 2026-06-20
verifier: hungv47
source_basis: "TikTok Ads Manager + Advertising Policies (ads.tiktok.com/help) synthesized with practitioner short-form paid structure (Spark Ads, creator whitelisting, thumbstop discipline); raw source ledger intentionally omitted from the public skill package. Convention-level mechanics tagged [pattern-derived]."
status: draft
---

# TikTok Ads — Ad-Intelligence Surface

Per-network reference for **paid TikTok**. Loaded by `write-ad` when `network: tiktok-ads`. TikTok is a **native-content** auction: the feed is sound-on, full-screen, and brutal on anything that reads like an ad. The ad text is short; the **first ~3 seconds (thumbstop)** carry the buy. The strategist branches on **spark-mode** (§0) and keeps Meta's warm/cold only loosely (TikTok paid is cold-dominant).

> Scope: In-feed video ads + Spark Ads (boosted organic/creator posts). The indie ICP's first TikTok move. Search Ads, Carousel, and TikTok Shop are deferred (§6).

---

## 0. Framing axis — spark-mode + hook taxonomy (the strategist branch)

| spark-mode | What it is | When it wins |
|---|---|---|
| **Spark (boosted)** | paid amplification of a real organic/creator post (keeps the handle, comments, likes) | the default for trust — native by construction; inherits organic caption caps + social proof |
| **In-feed (dark)** | a standalone ad not tied to a public post | needed for evergreen offers, multiple variants, or when no organic post fits |

Cross-cutting **hook taxonomy** (the first line/3 seconds — pick one per variant):

| Hook type | Shape | Best for |
|---|---|---|
| **problem-aware** | name the pain in the viewer's words ("POV: your invoices are 3 weeks late") | warm-ish, category-aware viewers |
| **scroll-stopper / pattern-interrupt** | unexpected visual/claim in frame 1 | cold, broad reach |
| **creator-authority** | "I tried X for 30 days" from a real face | trust transfer via the creator |
| **demonstration** | the product doing the thing in the first second | tangible/visual products |

One hook archetype per variant (mirrors write-ad's 3-distinct-angles rule).

---

## 1. Pre-conditions — is paid TikTok the move here?

| Condition | Why it gates |
|---|---|
| You have (or can get) **native-feeling video** | TikTok punishes repurposed polished TV/Meta creative; without native footage the channel underperforms — **veto** until creative exists |
| The offer survives a **cold, entertainment-first** audience | TikTok intent is low; high-consideration B2B with a long sales cycle usually fits LinkedIn/Search better — **veto candidate** |
| A creator/UGC source is available (for Spark) OR a founder willing to be on camera | faces + native voice are the unlock; a logo-on-motion-graphic ad dies |
| Unit economics absorb a top-of-funnel CPA | TikTok is awareness-leaning; attribution is messier — budget for it as reach, not last-click |

If there's no native creative and no creator/founder willing on camera, recommend building organic/UGC first (or `plan-campaign`) — do not draft a polished-ad script. This is the channel-fit veto.

---

## 2. Campaign structure

- **Spark-first for trust, in-feed for scale.** Start by boosting the best-performing organic/creator post (Spark) before authoring dark in-feed variants. [pattern-derived]
- **Creator whitelisting (Spark Ads authorization):** to run a creator's post as your ad you need their authorization code — the post stays on their handle, you pay for reach. Disclosure is mandatory (policy).
- **Hook-led variant set:** hero + 2 variants, each a *different hook archetype* (§0) over the same offer — TikTok testing is hook-first, not body-first.
- **Sound-on by default:** captions/on-screen text reinforce, but the audio (voiceover / trending sound) carries; a silent-optimized cut underperforms.

---

## 3. Conversion event + bidding

| Lever | Guidance |
|---|---|
| **Optimization event** | optimize to the real event (Complete Registration / Purchase) once the pixel has signal; early on, a higher-funnel event (Add to Cart / View Content) gathers data faster, then graduate |
| **Thumbstop as the leading metric** | the 3-second/6-second view rate + hold rate predict winners *before* CPA stabilizes — diagnose creative on hold rate, not just CPA. [pattern-derived] |
| **Learning phase** | like Meta, the algorithm needs ~conversions/week per ad group to exit learning; too many tiny ad groups starve it |
| **Creative volume** | TikTok fatigues fast — plan a creative refresh cadence (new hooks), not a single evergreen ad |

---

## 4. Anti-patterns (falsifiable — the critic applies each detection rule)

| Anti-pattern | Detection rule (critic-applicable) | Why it fails |
|---|---|---|
| **Repurposed polished creative** | the script reads as TV/Meta voiceover ("Introducing the revolutionary…") | non-native; TikTok suppresses + viewers skip |
| **Hook buried past frame 1** | the hook/claim isn't in the first line / first ~3s | the thumbstop is lost; no view = no buy |
| **Silent-optimized cut** | copy/concept assumes muted viewing | TikTok is sound-on; the audio carries |
| **Missing paid-partnership disclosure** | creator content run as paid with no disclosure | policy + FTC FORMAT_FAIL |
| **Emoji-only / no real text** | ad text is only emoji | policy FORMAT_FAIL |
| **Guaranteed-results / before-after** | "guaranteed results", restricted before/after body claims | restricted-industry policy fail |
| **One hook reused across variants** | hero + variants share the same hook archetype | no real test; TikTok testing is hook-first |
| **Single evergreen ad, no refresh plan** | no creative-refresh cadence noted | fast fatigue → CPA decay |

"Make a viral TikTok" is a fortune cookie. Each row is a detection rule a critic runs against a script.

---

## 5. Source basis

Spark Ads / creator-authorization mechanics, thumbstop + hold-rate diagnosis, the native mandate, and the disclosure/restricted-industry rules are synthesized from TikTok Ads Manager + Advertising Policies (`ads.tiktok.com/help`) and practitioner short-form paid structure. Convention-level mechanics (Spark-first, hook-led testing, thumbstop-before-CPA) are tagged `[pattern-derived]`. Re-verify caps/policy on next tiktok-ads invocation.

---

## 6. Open Questions (deferred — do not author yet)

- **TikTok Shop / Shopping Ads** — commerce-feed surface; deferred until an ecom user needs it.
- **Search Ads (TikTok search)** — emerging surface, different intent model; deferred.
- **Carousel / Image ads** — minor on a video-first platform; out of scope for v1.
