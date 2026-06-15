---
last_verified: 2026-06-13
verifier: audit-wave3
churn: high
---

# YouTube — publish-social platform ref

> Hard rules + algorithm signals + anti-patterns for YouTube description + Shorts. Cross-references `references/_shared/platform-intelligence/shorts.md` (D13 canonical, covers Shorts lens).

## Char Cap

- **Title:** 100 chars hard limit
- **Description:** 5000 chars hard limit
- **Tags (video-level, separate from description hashtags):** 500 chars total across all tags

## Hashtags

- **In description:** 3-5 recommended; first 3 surface above video title as clickable links
- **In title:** 1-3 max; counted toward title char cap
- **On video itself (separate tag field):** up to 15 tags; not visible to viewers but used by algorithm

## Media

- **Thumbnail:** 16:9 (1280×720) recommended (renders sharp at all sizes); ≤2MB; JPG / PNG
- **Video (long-form):** 16:9 (1920×1080) standard; up to 12h on verified accounts
- **Shorts:** 9:16 (1080×1920); up to 60s; MP4

## CTA

- **Truncation point:** first 100-150 chars of description visible in search preview; ~157 chars in mobile suggested-video sidebar
- **Position:** CTA must lie in first 100-150 chars of description
- **In-video CTA:** out of publish-social scope (handled by produce-video upstream)

## Description Convention

YouTube description has three zones:

1. **Above-the-fold (first 100-150 chars):** hook + CTA; visible everywhere
2. **Mid-description:** value summary, timestamps if applicable, links, related content
3. **Bottom:** hashtags (3-5), social-channel links, sponsor mentions if applicable

For Shorts, description is shorter (typically 100-300 chars); same above-the-fold rules apply.

## Algorithm Signals (D13 platform-intelligence)

Cross-reference `references/_shared/platform-intelligence/shorts.md` for Shorts; long-form signals differ:

**Shorts:**
- **Watch-time-to-completion** is dominant. Hook in first 1-2 seconds; loop-able structure boosts replay count.
- **Swipe-through rate** (viewers continuing to next Short) negatively correlated with quality.
- **Comments + shares** boost.

**Long-form:**
- **Click-through rate (CTR) on thumbnail + title.** First 24-48 hours = algorithmic verdict.
- **Average view duration (AVD).** >60% AVD = strong signal.
- **Watch-time momentum:** comments + likes within first hour boost.
- **End-screen / suggested-video click-through** drives session length signal.

## Anti-Patterns

- **Clickbait disconnect:** thumbnail / title promises what video doesn't deliver = CTR-then-bounce = algorithmic penalty.
- **Tags spamming:** 500-char tag field stuffed with irrelevant terms = quality-signal penalty.
- **Description wall-of-text:** no formatting / no line breaks underperforms.
- **External links above-the-fold:** YouTube penalizes external-link-as-first-content.
- **Re-uploaded content** from another platform with no native re-cutting (e.g., TikTok 9:16 video posted as 16:9 with letterbox): algorithm flags as low-quality.

## Formatter Implementation Notes

- Description above-the-fold (first 100-150 chars) is the only auto-cap-enforced section in critic dim 3.
- For Shorts, cross-check produce-video manifest for 9:16 + ≤60s duration.
- Tags field (separate from description hashtags) emitted as a separate `## Tags (video field)` section in the per-platform draft.
- Title goes in frontmatter `title:` field; description body goes in `## Body` section.

## Scheduler Compatibility

- **Buffer:** limited (YouTube native scheduling via Buffer requires premium tier)
- **Hootsuite:** yes (YouTube native via Google account auth)
- **Typefully:** no
- **Generic CSV:** yes; description in `body` field; title not native to generic CSV (note in README)
