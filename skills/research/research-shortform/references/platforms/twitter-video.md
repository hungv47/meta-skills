# X (Twitter) Video — Platform Reference (opt-in)

Cited mechanics for native X video. Opt-in platform — runs only when user requests via `--platforms x` or `--all`.

---

## Format Specs (mechanical)

| Spec | Value | Source |
|---|---|---|
| Aspect ratios | 16:9, 1:1, 9:16 | X Business — Video Specs |
| Duration | 0:01-2:20 (free) / up to 4 hours (Premium) | X Business — Video Specs |
| Resolution min | 1280×720 | X Business — Video Specs |
| File size cap | 512MB | X Business — Video Specs |
| Captions | recommended (sound-off viewers — universal short-form rule) | X Business |

**Source-doc URLs:**
- X Business — Video Specs: https://business.x.com (verify section URLs at run-time)
- X Help Center — Video upload guidelines

---

## Algorithm Signals

X video discovery is harder to characterize because the platform is text-first. Observed signals:

| Signal | Value | Source |
|---|---|---|
| Native video reach | outperforms linked YouTube clips | X creator guidance + observed creator data |
| Hook window | ~3-5s before scroll | Creator anecdote (no formal X doc) |
| Engagement signal mix | replies + reposts > likes for distribution | X creator guidance |

**X is fundamentally different:** it's relationship-driven, not algorithmic-distribution-driven. A small follower count with engaged replies outperforms a large account with passive likes.

---

## Native Patterns

- **Quick tip (15-30s)** — punchy, single insight
- **Breakdown / explainer (60-90s)** — threads + video combinations
- **Reaction / response video** — quote-tweet with video reply
- **Behind-the-scenes** — founder-mode content thrives here

---

## Caption / Text Overlay Norms

- Tweet text accompanying video: ≤280 chars (or 25,000 with Premium)
- First line of tweet text is the hook (visible before "Show more" if long)
- Burned-in captions on video still recommended

---

## CTA Placement Conventions

- **Reply-prompt** ("what's your take?") drives engagement signal
- **Quote-tweet prompt** ("share this with…")
- Link-in-thread or in-bio common for conversion

---

## Failure Modes

- **Linked YouTube clip instead of native upload** — algorithm penalizes off-platform links
- **No tweet text accompanying video** — viewers scroll past videos without context tweet
- **Generic CTA** — fails to drive replies/reposts
- **Long video without thread** — single 4-minute video less effective than a 60s clip + thread

---

## When to opt in

X video makes sense for:
- Founder-mode thought leadership
- Industry commentary / hot takes
- Tech-and-creator audiences (X has stronger dev/founder presence than IG/TikTok)

X video is weaker for:
- B2C consumer brands (smaller audience overlap)
- Visual-first niches (fashion, food, travel — IG/TikTok dominant)

---

## Verification Checklist

- [ ] X Business pages resolve and `last_updated` checked
- [ ] No major platform policy change since last verification
- [ ] Update `mechanics_sources_verified[]` in artifact frontmatter
