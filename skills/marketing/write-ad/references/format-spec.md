---
type: format-spec
schema_version: 1
last_verified: 2026-05-11
verifier: hungv47
note: Meta's component-level char caps occasionally shift (esp. headline visible-window on new placements). The figures below reflect Meta Advertising Standards at v0.1 of this doc. Re-verify on next ad-copy invocation by checking https://www.facebook.com/business/help/980593475366490 (Meta's ad-spec reference).
---

# Per-Network Ad Format Spec (v0.2)

Character caps + visible-window economics, **one section per `network`**. `agents/format-checker.md` (hard-gate) and `agents/composer.md` (drafting discipline) read **only the section for the resolved `network`** (`meta | google-ads | tiktok-ads | linkedin-ads`) — never stack two networks' caps in one artifact (Critical Gate 2). Each network section is self-contained: its hard caps + the banned-phrase pointer (`policy-floor.md` has the matching per-network policy).

Caps shift; each section carries its own re-verify trigger. Meta is the reference depth (§Meta below); Google/TikTok/LinkedIn carry the load-bearing caps the format-checker enforces.

---

# Network: Meta (Facebook + Instagram)

> Scope: Meta paid ads — Facebook Feed, Instagram Feed, Stories, Reels (organic-style placements). Audience Network and Messenger have their own variations; if operator targets those, re-verify before draft.

## 1. Component Hard Caps

| Component | Hard cap | Visible-window (mobile feed) | Notes |
|-----------|----------|-------------------------------|-------|
| **Primary text** | 3,000 chars | First **~125 chars** before "...See more" | Body of the ad. Visible-window is where hook + anchor must land. |
| **Headline** | 40 chars | First **~27 chars** truncates on smaller mobile placements | Bolded line under image/video. ≤27 chars = always-visible. |
| **Description** | 30 chars | Often invisible on Instagram; visible on Facebook desktop and some feed placements | Often hidden entirely — don't rely on it carrying load. |
| **Display URL** | n/a | Truncates to ~30 chars in display | Auto-generated from destination domain. |
| **CTA button** | Meta-provided menu | n/a | Picked from a menu, not free text. Examples: "Learn More", "Shop Now", "Start Free Trial", "Sign Up", "Download". |

---

## 2. Visible-Window Economy

The 125-char visible-window in primary text is where most users decide whether to engage. The hook + anchor + value must land before the "...See more" truncation point.

| Position in 125 chars | Recommended content |
|-----------------------|---------------------|
| Chars 0-30 | Hook clause — prospect-side observation, sharp question (non-rhetorical), specific number |
| Chars 30-80 | Anchor proof — named entity / measured outcome / named research |
| Chars 80-125 | Value bridge — what this means for the reader (1 short clause) |
| Chars 125+ | Backup detail — longer story, additional proof, deeper context (for users who tap "...See more") |

**Composer drafting check:** if you can't fit hook + anchor in 125 chars, your hook is too long OR your anchor is too verbose. Tighten before extending.

---

## 3. Headline Discipline

Headlines under 27 chars are always-visible across all Meta placements. Headlines 28-40 chars truncate on smaller mobile placements (Instagram Stories, Reels overlays). Headlines >40 chars auto-reject.

| Headline length | Where it shows | Recommended for |
|-----------------|----------------|-----------------|
| ≤20 chars | All placements, always visible | Brand-led headlines, CTA-led headlines |
| 21-27 chars | All placements, always visible | Value-led headlines with one specific |
| 28-40 chars | Desktop feed always; truncates on mobile | Acceptable for desktop-heavy campaigns; risky for mobile-first |
| >40 chars | **Auto-reject** | — |

---

## 4. Description Spec

Description is the most-often-invisible component — many placements skip it entirely (Instagram Feed, Stories). When it does show, it's heavily truncated.

**Don't:** put load-bearing claims in description.
**Do:** use description for a one-line restatement of CTA or a complementary value framing (in case it does show).

| Description length | Visibility |
|--------------------|-------------|
| ≤25 chars | Always visible when description is shown |
| 26-30 chars | Hard-cap edge; risky truncation |
| >30 chars | **Auto-reject** |

---

## 5. Hashtags and Emoji

| Element | Rule |
|---------|------|
| **Hashtags in body** | 0 hashtags. Meta doesn't reward paid-ad hashtags the way organic does. Wasted chars. |
| **Hashtags in caption (organic crosspost)** | Different rules — see `brief-shortform` or `write-social` for organic. |
| **Emoji in headline** | 0-2 emoji. 3+ reads as low-effort. |
| **Emoji in primary text** | 1-2 emoji as stop-cues are fine. 5+ in primary text is excessive. |
| **All-caps** | Banned in headlines (Meta auto-reject). Use sparingly in primary text (1 word max, for emphasis). |

---

## 6. CTA Button — Meta Menu

Meta provides a fixed menu of CTA buttons. Composer specifies the CTA verb in copy AND picks the corresponding button.

Common buttons:
- **Learn More** — soft, awareness-tier
- **Shop Now** — DTC ecom
- **Start Free Trial** — SaaS / subscription apps
- **Sign Up** — lead gen
- **Download** — app install (paired with App Store / Google Play link)
- **Get Offer** — promo codes
- **Book Now** — service / appointment
- **Contact Us** — high-trust placement
- **Apply Now** — applications (job, credit, etc. — subject to Special Ad Category)

**Match check:** the CTA verb in the ad copy should align with the button. If the in-copy verb is "Start your free trial" but the button is "Learn More", the message-match fails (the LP probably wants "Start Free Trial" too).

---

## 7. Placement-Specific Variations

Most ad-copy v1 invocations target Feed (FB + IG). For other placements:

| Placement | Variations from Feed |
|-----------|----------------------|
| **Stories (FB + IG)** | No headline display; primary text overlays the visual; description always invisible |
| **Reels (FB + IG)** | Similar to Stories — primary text + CTA only; headline + description not surfaced |
| **Right Column (FB Desktop)** | Headline + image + small CTA; primary text minimal |
| **Audience Network** | Variable — depends on third-party placement; safer to draft for Feed and let Meta auto-adapt |
| **Messenger** | Different rules — escalate to operator |

**Ad-copy v1 default:** draft for Feed (FB + IG). Stories / Reels variants need separate copy passes — out of scope for v1.

---

## 8. Quick Char-Cap Cheat Sheet (Composer reference)

```
Primary text: 3,000 hard | ~125 visible
Headline: 40 hard | ≤27 always-visible
Description: 30 hard | ≤25 if shown (often hidden)
Hashtags: 0 in body
Emoji: 1 max as stop-cue
All-caps: Banned in headlines
```

---

# Network: Google Ads (Responsive Search Ads)

Search ads are **typed at the moment of intent** — caps are tight and the asset model is combinatorial (Google mixes your assets), so every headline must stand alone. Re-verify against Google Ads RSA specs on next invocation.

## Component Hard Caps

| Component | Hard cap | Count | Notes |
|---|---|---|---|
| **Headline** | **30 chars** each | up to **15** | Google assembles ≤3 into the shown ad; each must read standalone. Pin sparingly. |
| **Description** | **90 chars** each | up to **4** | ≤2 typically shown. Lead with the benefit + a proof token. |
| **Display path** | **15 chars** each | **2** | Vanity path after the domain (`/free-trial`); not the real URL. |
| **Final URL** | n/a | 1 | The real destination. |

- **Always-on RSA discipline:** ≥8–10 distinct headlines + ≥3 descriptions, each a *different* angle (benefit / proof / offer / mechanism / objection); near-duplicate assets get "Low" Ad Strength and waste the combinatorial engine.
- **Pinning:** pin only when a legal/brand line MUST appear (e.g. a disclaimer in headline-1); over-pinning collapses RSA to a static ad and kills Ad Strength.
- **Banned (auto-disapprove / FORMAT_FAIL):** ALL-CAPS words, repeated/gimmicky punctuation (`!!!`, `F-R-E-E`), trademark misuse, unsubstantiated superlatives ("best", "#1") without on-page proof, phone numbers in headlines. Full list: `policy-floor.md` § Google.

## Cheat sheet
```
Headline: 30 hard ×15 (each standalone; ≥8 distinct angles)
Description: 90 hard ×4 (≥3 distinct)
Path: 15 hard ×2
Banned: ALLCAPS · !!! · "#1"/"best" w/o proof · TM misuse
```

---

# Network: TikTok Ads

TikTok rewards **native-not-polished**; ad text is short and the first ~3 seconds (thumbstop) carry the load. Spark Ads (boosted organic) inherit the **organic caption caps**, not the in-feed ad caps. Re-verify against TikTok Ads Manager specs on next invocation.

## Component Hard Caps

| Component | Hard cap | Notes |
|---|---|---|
| **Ad text (in-feed)** | **1–100 chars** | Some placements truncate ~ first line; front-load the hook. Emoji allowed, not emoji-only. |
| **Spark Ad caption** | organic caption cap (**~2,200 chars**, ~100 visible) | Inherits the boosted post's caption; the same front-load rule applies. |
| **CTA** | menu | Picked from TikTok's CTA menu (e.g. "Shop Now", "Sign Up", "Download"). |
| **Brand / app name** | platform-set | Display name pulled from the account/app, not free text. |

- **Disclosure (hard):** creator/whitelisted content used as paid **must** carry the paid-partnership disclosure; omitting it is a policy + FTC fail.
- **Native mandate (format-checker soft-to-hard):** ad text that reads like a TV voiceover ("Introducing the revolutionary…") gets REVISION_REQUIRED — TikTok copy is spoken-first, hook-led.
- **Banned (FORMAT_FAIL):** emoji-only text, prohibited/restricted-industry claims, fabricated metrics, before/after that implies guaranteed results. Full list: `policy-floor.md` § TikTok.

## Cheat sheet
```
Ad text: 1–100 hard (front-load the hook; not emoji-only)
Spark: inherits organic caption (~2,200 hard / ~100 visible)
Disclosure: paid-partnership REQUIRED on creator content
Banned: emoji-only · restricted-industry · "guaranteed results"
```

---

# Network: LinkedIn Ads (Single Image / Sponsored Content)

B2B, high CPC — copy earns its cost only with a **substantiated claim** and a job-relevant frame. Intro text truncates early; the headline does the standalone work. Re-verify against LinkedIn Campaign Manager specs on next invocation.

## Component Hard Caps

| Component | Truncation (front-load before this) | Hard cap | Notes |
|---|---|---|---|
| **Intro text** | **~150 chars** before "…see more" | **600 chars** | Hook + the substantiated claim must land in the first ~150. |
| **Headline** | **~70 chars** always-visible | **200 chars** | The standalone line under the image; ≤70 = always shown. |
| **Description** | — | **70 chars** | Often suppressed on feed; don't put load-bearing claims here. |
| **CTA** | menu | — | Menu (e.g. "Learn More", "Download", "Register", "Request Demo"). |

- **B2B claim-substantiation floor (hard):** a quantified business claim ("cut onboarding 40%") needs an on-page source / case study or it FORMAT_FAILs — LinkedIn's audience + policy both punish unbacked ROI claims.
- **Lead-gen-form vs LP:** native Lead Gen Forms lift CVR but cost lead quality; note the tradeoff in rationale (the surface covers when each wins).
- **Banned (FORMAT_FAIL):** unsubstantiated ROI/income claims, restricted-industry targeting violations, ALL-CAPS headlines, personal-attribute targeting misuse. Full list: `policy-floor.md` § LinkedIn.

## Cheat sheet
```
Intro: ~150 visible / 600 hard (claim in the first 150)
Headline: ~70 always-visible / 200 hard
Description: 70 hard (often suppressed)
Banned: unbacked ROI/income claims · ALLCAPS headline
```

---

**Last verified:** 2026-06-20 (v0.2 — multi-network). Re-verify trigger: next ad-copy invocation on a given network OR that network announces a cap/policy change. Per-network re-verify URLs live in each section.
