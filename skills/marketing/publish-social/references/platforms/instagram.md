---
last_verified: 2026-06-13
verifier: audit-wave3
churn: high
---

# Instagram — publish-social platform ref

> Hard rules + algorithm signals + anti-patterns for formatting Instagram drafts. Cross-references `references/_shared/platform-intelligence/reels.md` (D13 canonical, covers IG Reels lens).

## Char Cap

- **Caption:** 2200 chars hard limit
- **Bio:** 150 chars (out of v1 scope)
- **Comment:** 2200 chars (out of v1 scope)

## Hashtags

- **Count:** up to 30 (combined caption + first comment). Algorithm-current: 3-5 highly-targeted outperforms 30 broad.
- **Position:** bottom of caption (after 5+ blank lines) OR first comment immediately after post publishes. Never inline mid-paragraph.
- **Banned hashtags:** IG maintains a rotating banned list — algorithm suppresses posts using them. Cross-check current spec before use.

## Media

- **Single image (post):** 1:1 (1080×1080) / 4:5 (1080×1350) / 16:9 (1080×608). 4:5 portrait preferred for feed real estate.
- **Carousel:** up to 10 images / videos per post; same aspect ratios
- **Reels:** 9:16 (1080×1920); up to 90s; MP4
- **Stories:** 9:16 (1080×1920); up to 60s; out of v1 scope (Stories don't paste cleanly into schedulers; usually live-posted)
- **File size:** up to 30MB per image; up to 4GB per video

## CTA

- **Truncation point:** ~125 chars before "...more" link on mobile feed
- **Position:** CTA must lie within first 125 chars OR be the entire caption (rare for IG)
- **Hook lands first:** first line is the only visible part to scrollers — must hook in 50 chars or less

## Hashtag Stack Convention

Two valid placements:

1. **Caption-bottom stack:** body → 5 blank newlines (or `.`, `.`, `.` separator) → hashtag stack. Visible if user expands caption.
2. **First-comment stack:** hashtags posted as the first comment immediately after publishing. Cleaner caption; same algorithm weight.

Operator preference; formatter can use either. Default: caption-bottom for narrative posts; first-comment for visual-only posts.

## Algorithm Signals (D13 platform-intelligence)

Cross-reference `references/_shared/platform-intelligence/reels.md` (IG Reels). Feed-post signals overlap heavily:

- **Saves and shares > Likes** for algorithmic boost. Educational / list / "save for later" posts outperform pure-aesthetic.
- **Reels favored over feed posts** in algorithm distribution as of vintage date.
- **Watch time** is the dominant signal on Reels.
- **Comments-within-1-hour** boost feed-post reach.
- **External link clicks** (link-in-bio) are tracked but don't boost reach.

## Anti-Patterns

- **Link in caption:** IG does NOT render captions as clickable; "link in bio" pattern is convention but → anti-pattern #5 in master list (operator must update bio).
- **Mass-tagging:** >10 @-mentions per post = spam classifier hit.
- **Hashtag stuffing:** >30 hashtags = invalid post (rejected).
- **Banned-hashtag use:** algorithmic suppression (shadowban).
- **Same-caption copy across multiple posts:** algorithm dedupes; second post gets near-zero reach.
- **Engagement-bait:** "double-tap if you agree" / "comment YES" — penalized.
- **Watermarks from other platforms** (TikTok logo visible on Reels): algorithm suppresses cross-posted content with visible watermarks.

## Formatter Implementation Notes

- Default to caption-bottom hashtag stack (5 blank lines separator).
- Flag explicit operator instruction to use first-comment stack via write-social artifact.
- Cross-check first 125 chars contain the hook + CTA (or first portion of CTA).
- For Reels, route to produce-video manifest cross-check (9:16 aspect required).
- For carousel, route to produce-asset manifest cross-check (up to 10 slots).

## Scheduler Compatibility

- **Buffer:** yes (IG native via Meta Business Suite API)
- **Hootsuite:** yes (IG native)
- **Typefully:** no (X-only)
- **Generic CSV:** yes; some long-tail tools require IG Business account auth
