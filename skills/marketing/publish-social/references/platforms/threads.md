---
last_verified: 2026-06-13
verifier: audit-wave3
churn: high
---

# Threads — publish-social platform ref

> Hard rules + algorithm signals + anti-patterns for Meta Threads drafts. **Not backed by platform-intelligence catalog (D13)** — v1 template only.

## Char Cap

- **Post body:** 500 chars hard limit
- **Native thread support:** chain via reply-to-self; up to 25 posts per chain

## Hashtags

- **Count:** 1-3 max. Threads added hashtag support late (2024); discovery weight still moderate.
- **Position:** inline OR end of post.

## Media

- **Image:** 1:1 (1080×1080) / 4:5 (1080×1350) / 1.91:1 (1200×630); up to 8MB; JPG / PNG
- **Carousel:** up to 10 images per post
- **Video:** up to 5 min; 9:16 / 1:1 / 16:9; ≤500MB

## CTA

- **Truncation point:** 500 chars (full visible — no truncation)
- **Position:** anywhere

## Algorithm Signals (sparse — template only)

Threads algorithm cross-promotes from Instagram heavily (shared Meta account base):

- **Engagement velocity** (first 30-60 min) signals algorithm.
- **Replies > Likes** (similar to X-like dynamic).
- **Cross-posting from IG**: tagged automatic-cross-post posts get slight reach boost vs Threads-native.
- **Reposts** drive distribution.

**Note:** richer signals deepen when Threads is added to the platform-intelligence catalog.

## Anti-Patterns

- **Pure IG copy-paste:** Threads users explicitly dislike "this was clearly an IG caption" content; underperforms socially.
- **Engagement-bait:** Meta-wide policy applies; algorithmic suppression.
- **Cross-platform watermarks:** same as IG / TikTok rules.
- **Mass-tagging:** Meta dedupes mass-mention posts at the network level (your @-mention gets the boost, not the original post).

## Formatter Implementation Notes

- 500-char cap is comfortable for short posts; thread-up if write-social body exceeds.
- For thread chains, number posts `1/N`, `2/N` like X (but native reply-to-self chains; not symbol-marked).
- Cross-check media against IG specs (Meta-shared media constraints).

## Scheduler Compatibility

- **Buffer:** yes (added 2024)
- **Hootsuite:** yes (added 2024)
- **Typefully:** no
- **Generic CSV:** yes

## v1 Limitations

Template-only. Deeper Threads-specific guidance lands when the platform is added to platform-intelligence catalog.
