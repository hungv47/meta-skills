---
last_verified: 2026-06-13
verifier: audit-wave3
churn: high
---

# Bluesky — publish-social platform ref

> Hard rules + algorithm signals + anti-patterns for Bluesky drafts. **Not backed by platform-intelligence catalog (D13)** — v1 template only; expand when Bluesky is added to the catalog.

## Char Cap

- **Post body:** 300 chars hard limit
- **No native thread feature** as of vintage date (chains via reply-to-self)

## Hashtags

- **Count:** 1-3 max. Discovery on Bluesky is feed-algorithm-light; hashtags help niche discovery but aren't load-bearing like on IG.
- **Position:** inline OR end of post.

## Media

- **Image:** up to 4 images per post; up to 1MB per image; JPG / PNG / GIF
- **Aspect:** flexible; 1:1 (1000×1000) renders cleanly
- **Video:** not natively supported as of vintage date (link-out only)
- **Alt text:** REQUIRED culturally (Bluesky norm); operator should populate alt text for accessibility

## CTA

- **Truncation point:** 300 chars (full visible)
- **Position:** anywhere; constrained by char cap

## Algorithm Signals (sparse — template only)

Bluesky's feed is algorithmically minimal (chronological by default; custom feeds available). Distribution mechanics:

- **Replies + reposts** are the primary discovery mechanism.
- **Custom feed inclusion:** appearing in popular custom feeds = significant boost (algorithm-equivalent on Bluesky).
- **Quote-posting** (similar to X quote-tweet) drives discovery.
- **Following counts low** — Bluesky still small (~10M users 2026); micro-network dynamics.

**Note:** more detail when Bluesky is promoted to the platform-intelligence catalog. v1 template only.

## Anti-Patterns

- **Missing alt text on images:** Bluesky community heavily values accessibility; missing alt text gets called out.
- **Cross-platform copy-paste from X without context:** Bluesky audience is more skeptical of "X refugees" who don't adapt voice.
- **Engagement-bait:** less penalized algorithmically than other platforms but socially uncool; tank reputation.
- **Link-stuffing:** posts with multiple links underperform.

## Formatter Implementation Notes

- 300-char hard cap is tight; flag if write-social body exceeds.
- Alt text required for images — flag if produce-asset manifest doesn't provide alt text.
- No native thread; if write-social body is thread-structured, emit each thread post as a separate Bluesky post with reply-to-self link (operator manually chains).
- Custom-feed targeting NOT in scope for v1.

## Scheduler Compatibility

- **Buffer:** limited (Bluesky support added 2024; may require premium tier)
- **Hootsuite:** no native Bluesky integration as of vintage date
- **Typefully:** no
- **Generic CSV:** yes; some Bluesky-specific schedulers (Skylight, Skydeck) use custom imports

## v1 Limitations

This ref ships template-only. Algorithm signals + custom-feed mechanics deepen when Bluesky is added to the platform-intelligence catalog in a future slice. Until then, formatter applies char cap + alt-text reminder + the 4 anti-patterns listed.
