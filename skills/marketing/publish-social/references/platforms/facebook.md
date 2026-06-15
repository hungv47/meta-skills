---
last_verified: 2026-06-13
verifier: audit-wave3
churn: high
---

# Facebook — publish-social platform ref

> Hard rules + algorithm signals + anti-patterns for Facebook (Pages) drafts. **Not backed by platform-intelligence catalog (D13)** — algorithm signals here are minimal v1 template; expand when FB is added to the catalog in a future slice.

## Char Cap

- **Post body:** 63206 chars hard limit (Facebook's max; effectively unbounded for practical use)
- **Comment:** 8000 chars

## Hashtags

- **Count:** 1-2 max. Higher counts have NO performance benefit on FB (unlike IG/TT). Algorithm largely ignores them.
- **Position:** end of post.
- **Use case:** FB hashtags are mostly cosmetic; brand-tracking purposes only.

## Media

- **Image:** 1.91:1 (1200×630) for link-preview-style; 1:1 (1080×1080) for square; ≤4MB; JPG / PNG
- **Carousel:** up to 10 images / videos via Meta Ads Manager; not native in organic post UI
- **Video:** up to 240 min; 1080p; MP4; supports vertical 9:16 and horizontal 16:9
- **Reels (FB Reels):** 9:16 (1080×1920); up to 90s

## CTA

- **Truncation point:** first ~80 chars visible in mobile feed before "...See more" cutoff
- **Position:** CTA must lie within first 80 chars OR be the entire post (rare)
- **Hook lands first:** first line gets full visibility; subsequent lines truncated

## Algorithm Signals (sparse — template only)

FB algorithm prioritizes:
- **Meaningful interactions** (comments + reactions) > Likes
- **Family + friends content > Page content** (Page reach has declined since 2018)
- **Video > text** in feed prioritization
- **Engagement bait penalized** (vote-based prompts, like-baiting)

**Note:** more detail when FB is promoted to the platform-intelligence catalog. v1 publish-social ships template-only for FB.

## Anti-Patterns

- **Engagement-bait:** "LIKE if you agree, SHARE if you don't" — explicit Facebook policy violation (algorithmic suppression since 2017).
- **Vote-based prompts:** "React 😀 for yes, 😢 for no" — same penalty.
- **External links above-the-fold:** FB suppresses link-as-first-content; suggest "link in comments" workaround.
- **Cross-platform watermarks** (IG / TT logos visible): algorithmic suppression.
- **Identical post within 24h:** FB dedupes same-text posts to same Page.

## Formatter Implementation Notes

- Body length largely unconstrained for FB; do NOT trim aggressively.
- Cross-check first 80 chars contain hook + CTA.
- For FB Reels, route to produce-video cross-check (9:16, ≤90s).
- Preserve line breaks (FB renders literally, like LinkedIn).

## Scheduler Compatibility

- **Buffer:** yes (FB-native via Meta Business Suite API)
- **Hootsuite:** yes (FB-native)
- **Typefully:** no
- **Generic CSV:** yes

## v1 Limitations

This ref ships template-only. Algorithm signals + anti-patterns deepen when FB is added to the platform-intelligence catalog in a future slice (D13.B or later). Until then, formatter applies char cap + hashtag rules + CTA truncation + the 5 anti-patterns listed; richer hook taxonomy / algorithm-tier detail not yet wired.
