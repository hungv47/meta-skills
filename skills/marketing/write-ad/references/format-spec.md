---
type: format-spec
schema_version: 1
last_verified: 2026-05-11
verifier: hungv47
note: Meta's component-level char caps occasionally shift (esp. headline visible-window on new placements). The figures below reflect Meta Advertising Standards at v0.1 of this doc. Re-verify on next ad-copy invocation by checking https://www.facebook.com/business/help/980593475366490 (Meta's ad-spec reference).
---

# Meta Ad Format Spec (v0.1)

Character caps + visible-window economics for Meta paid ads (Facebook + Instagram). Used by `agents/format-checker.md` (hard-gate) and `agents/composer.md` (drafting discipline).

> Scope: Meta paid ads only — Facebook Feed, Instagram Feed, Stories, Reels (organic-style placements). Audience Network and Messenger have their own variations; if operator targets those, re-verify before draft.

---

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

**Last verified:** 2026-05-11 (v0.1). Re-verify trigger: next ad-copy invocation OR Meta announces new placement / cap change.
