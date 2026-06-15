---
last_verified: 2026-06-13
verifier: audit-wave3
churn: high
---

# TikTok — publish-social platform ref

> Hard rules + algorithm signals + anti-patterns for TikTok caption. Cross-references `references/_shared/platform-intelligence/tiktok.md` (D13 canonical).

## Char Cap

- **Caption:** 2200 chars hard limit
- **Comment:** 150 chars

## Hashtags

- **Count:** 3-5 recommended; algorithm down-weights >10 due to spam-signal heuristics
- **Position:** end of caption; trending hashtag mix encouraged (1-2 trending + 2-3 niche)
- **For You Page (FYP) tags:** `#fyp`, `#foryou`, `#foryoupage` — currently neutral signal (was boost in 2020-2021); operator may include as low-cost

## Media

- **Video:** 9:16 (1080×1920) hard requirement (1:1 / 16:9 allowed but underperform); up to 10 min; MP4
- **Cover image:** auto-extracted by TikTok; operator can pick frame inside the app
- **Image post:** up to 35 images per post (carousel); 9:16 or 1:1; 1080×1920 / 1080×1080

## CTA

- **Truncation point:** ~150 chars before "...more" cutoff on mobile feed
- **Position:** CTA must lie within first 150 chars
- **In-video CTA:** typically more important than caption CTA on TikTok; handled by produce-video upstream

## Algorithm Signals (D13 platform-intelligence)

Cross-reference `references/_shared/platform-intelligence/tiktok.md`. Summary:

- **Completion rate** is the dominant ranking signal — videos viewed to the end get massive boost.
- **Re-watches** boost more than likes.
- **Comments + shares** boost; "send to friend" share = highest weight.
- **First 1-2 seconds = make-or-break.** Hook must land instantly; "intro" videos with logo / brand-card opener get scrolled past.
- **Sound trends:** using a trending sound (vs original audio) can 5-10x reach for emerging accounts; risk-free.
- **For You Page (FYP) algorithm rewards niche-consistency.** Accounts that stick to a niche outperform "general content" accounts.

## Anti-Patterns

- **TikTok logo / watermark from another platform** (e.g., re-uploaded from IG with IG watermark): algorithmically suppressed.
- **First 1-2 seconds wasted on brand intro:** scroll-past rate spikes.
- **Engagement-bait:** "follow for part 2" — currently down-weighted.
- **Caption-only content:** TikTok is video-first; text-heavy captions underperform pure visual storytelling.
- **Over-tagging:** >10 hashtags = spam signal.
- **External link spam in caption:** TikTok suppresses link-in-bio prompts mid-caption (link-in-bio at end is fine).

## Formatter Implementation Notes

- Cross-check produce-video manifest: must be 9:16 (or 1:1 with note); duration ≤10 min.
- For TikTok carousel image-post, cross-check produce-asset manifest: up to 35 slots.
- CTA position vs 150-char truncation enforced by critic dim 3.
- Trending-sound recommendation NOT in scope for v1 (would require real-time TikTok trend API).

## Scheduler Compatibility

- **Buffer:** limited (TikTok native scheduling requires Business account + premium tier)
- **Hootsuite:** yes (TikTok native, requires Business account)
- **Typefully:** no
- **Generic CSV:** yes; many TikTok-specific schedulers (Sprout, Later) use custom imports — generic CSV is a starting point
