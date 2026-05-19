# Instagram Reels — Platform Reference

Cited mechanics, format specs, and known failure modes for Reels. platform leadership's January 2025 ranking-signal post is the load-bearing source for current algo behavior.

---

## Format Specs (mechanical)

| Spec | Value | Source |
|---|---|---|
| Aspect ratio | 9:16 (1080×1920) | Meta Creator — Reels Specs |
| Length range | 15s–15min (30-90s sweet spot) | Meta Creator — Reels Specs |
| Resolution min | 720p; 1080p recommended | Meta Creator — Reels Specs |
| Safe area — top | 250px | Meta Creator — UI Overlay |
| Safe area — bottom | 400px (larger than TikTok — buttons + comments preview) | Meta Creator — UI Overlay |
| Cover image | 9:16, shown in feed as 4:5 crop | Meta Creator — Reels Cover |
| Caption length | 2,200 chars (first 125 visible before truncation) | Meta Creator |

**Source-doc URLs (verify and record `last_updated`):**
- Meta Creator — Reels Specs: https://creators.instagram.com/reels (verify section URLs at run-time)
- platform leadership's ranking-signal posts (Threads, Instagram, Meta blog) — most recent post supersedes older

---

## Algorithm Signals (cited mechanics)

| Signal | Value | Source |
|---|---|---|
| Watch time | **#1 ranking signal** (platform leadership's Jan 2025) | platform leadership's — Threads/Instagram post Jan 2025 |
| Originality Score | recycled clips penalized; original audio favored | platform leadership's Jan 2025 |
| 3s drop-off | up to 50% of viewers lost in first 3s | Meta Creator — retention guidance + third-party data |
| 3s hold rate threshold | >60% → outperforms <40% by 5-10× total reach | Third-party data (a third-party benchmark / third-party cohort trend reporting) |
| Reshares | weighted heavily for distribution | platform leadership's Jan 2025 |

**Originality penalty specifics:**
- TikTok-watermarked Reels are detected and downranked
- Audio reused beyond a creator's own catalog (i.e., trending audio from elsewhere) gets less Originality weight
- Brief skill must use original audio OR a track confirmed-fresh in this niche

---

## Native Patterns

- **First 3s decides retention** — hold rate above 60% is the threshold for breaking out of seed audience
- **Trending audio + original spin** (caveat: Originality Score may penalize naked trending-audio reuse — combine with original visual treatment)
- **Tutorial with text overlay** — high-engagement format
- **Transition-based reveals** — match-cut reveals dominate creator content
- **Talking head + b-roll** — same pattern as TikTok
- **Repurposed TikTok (without watermark)** — works but loses Originality weight

---

## Caption / Text Overlay Norms

- Caption length 2,200 chars, first 125 visible — front-load value
- Text overlay required for sound-off viewers (85%+ industry rule)
- Overlay style: bold sans-serif, black outline, max 2 lines, 3-5 words per line

---

## Hashtag / Discovery Mechanics

- 3-5 relevant hashtags (in caption or comments)
- platform leadership's has indicated hashtags carry less weight than they used to — they're discovery-aid, not ranking-driver
- Niche hashtags > broad ones for Reels reach

---

## CTA Placement Conventions

- **End-card CTA** more common than overlay (vs. TikTok's mid-video overlay)
- **Caption CTA** as last line, often with arrow ↓
- **Reshare-prompt** ("send this to someone who…") performs well due to reshare weighting

---

## Failure Modes ("don't do this on Reels")

- **TikTok watermark visible** — Originality penalty; downranked
- **Trending audio used as-is without original visual treatment** — Originality penalty
- **Static visual past 3s** — exceeds drop-off window
- **No burned-in captions** — sound-off viewers churn
- **Caption stuffed with link-in-bio CTAs** — Reels caption isn't the conversion surface; end-card or overlay is

---

## Market Variants

- **VN Reels:** Reels less dominant than TikTok in VN; brief skill should weight TikTok > Reels in this market
- **US Reels:** parity with TikTok in many niches; Originality bias may favor Reels for company-mode brands
- **B2B EN Reels:** smaller but engaged; LinkedIn often a parallel surface

---

## Verification Checklist

- [ ] Meta Creator Reels page resolves and `last_updated` checked
- [ ] Most recent platform leadership's post (Threads / Instagram / blog) read for any updates to ranking signals
- [ ] Originality Score still in effect (no policy reversal)
- [ ] Update `mechanics_sources_verified[]` in artifact frontmatter
