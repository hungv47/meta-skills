# YouTube Shorts — Platform Reference

Cited mechanics, format specs, and failure modes for YouTube Shorts.

---

## Format Specs (mechanical)

| Spec | Value | Source |
|---|---|---|
| Aspect ratio | 9:16 (1080×1920) | YouTube Help — Shorts Specs |
| Length range | 15-60s | YouTube Help — Shorts |
| Title length | 100 chars | YouTube Help — Shorts |
| Resolution min | 720p; 1080p recommended | YouTube Help |

**Source-doc URLs (verify and record `last_updated`):**
- YouTube Help — Shorts Specs: https://support.google.com/youtube (Shorts section — verify URLs)
- YouTube Creator Insider — recent updates: YouTube channel and YouTube blog posts
- Google Search Central — YouTube Shorts ranking guidance

---

## Algorithm Signals (cited mechanics)

| Signal | Value | Source |
|---|---|---|
| Swipe-through rate | core ranking signal | YouTube Creator Insider |
| Loop rate | core ranking signal — replays count | YouTube Creator Insider |
| Shares | core ranking signal | YouTube Creator Insider |
| Sub-30% completion outcome | distribution choke — capped views | Creator-tool guidance + third-party reporting |

**Loop rate is unique to Shorts:** the platform actively rewards content that loops cleanly. Brief skill should always end on a loop-friendly final frame.

---

## Native Patterns

- **Quick tip or hack** format
- **Clip from long-form content** (cross-promotion to channel's main feed)
- **Behind-the-scenes** for creator-channel audiences
- **Trending format remix** (formats migrate from TikTok 2-4 weeks later, then go YouTube-native)
- **Educational with text overlay** — strong format
- **Loop-friendly endings** — the final frame should match the opening enough that the loop doesn't feel jarring

---

## Caption / Text Overlay Norms

- Title is the primary discovery surface (100 chars) — much more weighted than TikTok caption
- Description (5,000 chars) is secondary — fewer viewers read it
- Burned-in captions still mandatory for sound-off viewers

---

## Hashtag / Discovery Mechanics

- Hashtags less critical than YouTube long-form (where keywords drive discovery)
- 1-3 hashtags in the title or description
- "#Shorts" is sometimes used to signal format but is no longer required (YouTube auto-detects)

---

## CTA Placement Conventions

- **End-card CTA** ("subscribe for part 2", "watch full version") — most common
- **Pinned comment CTA** with link to long-form
- **Channel-page CTA** ("more like this on the channel")
- Direct-conversion CTAs underperform — Shorts is discovery, not conversion surface

---

## Failure Modes ("don't do this on Shorts")

- **No loop** — final frame jarringly different from opening; loops awkwardly
- **Title without hook** — unlike TikTok where caption is secondary, Shorts title carries discovery weight
- **Trying to be TikTok** — copy-pasting TikTok format usually underperforms; subtle differences in pacing matter
- **No burned-in captions**
- **Sub-30% completion** — kills distribution

---

## Market Variants

- **Global YouTube Shorts:** more uniform than TikTok across markets — YouTube algorithm less geo-fragmented
- **VN Shorts:** parallel to TikTok presence; some creators publish to both
- **B2B EN Shorts:** thinner but rising — LinkedIn is still primary B2B short-form

---

## Verification Checklist

- [ ] YouTube Help Shorts pages resolve and `last_updated` checked
- [ ] YouTube Creator Insider channel checked for recent updates
- [ ] Loop rate still in effect as ranking signal (no policy change)
- [ ] Update `mechanics_sources_verified[]` in artifact frontmatter
