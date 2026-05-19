# TikTok — Platform Reference

Cited mechanics, format specs, and known failure modes for TikTok in-feed video. Every number uses a source. Refresh source-doc verification at every research run.

---

## Format Specs (mechanical, slow-changing)

| Spec | Value | Source |
|---|---|---|
| Aspect ratio | 9:16 (1080×1920) | TikTok Creator Portal — Video Specs |
| Length range | 15s–10min (15-60s optimal for distribution) | TikTok Creator Portal |
| File size cap | 287MB max | TikTok Creator Portal |
| Resolution min | 720p | TikTok Creator Portal |
| Safe area — top | 150px (username/follow button) | TikTok Creator Portal — UI Overlay |
| Safe area — bottom | 270px (buttons + caption) | TikTok Creator Portal — UI Overlay |
| Safe area — sides | 40px | TikTok Creator Portal — UI Overlay |
| Caption length | 4,000 chars (50-80 visible before truncation) | TikTok Creator Portal |

**Source-doc URLs (verify and record `last_updated` at each research run):**
- TikTok Creator Portal — Video Specs: https://www.tiktok.com/business/creativecenter/video-specs (verify `last_updated`)
- TikTok Creator Portal — Algorithm Updates: https://newsroom.tiktok.com/ (latest algo announcement)

---

## Algorithm Signals (cited mechanics)

| Signal | Value | Source |
|---|---|---|
| Hook window | 1-2s before swipe-away | TikTok Creator Portal + creator-tools docs |
| Pattern interrupt cadence | every 3-5s for retention | TikTok Creator Portal — retention guidance |
| Mid-video retention checkpoints | 15s, 30s | TikTok Creator Portal |
| Completion threshold for distribution | ~70% completion rate to break out of seed audience | TikTok creator-tool guidance + third-party trend reporting |
| Sub-70% completion outcome | rarely breaks 10k views in tested niches | Third-party trend reporting (corroborated) |
| Watch time signals | full watch + replay weighted | TikTok creator dashboard descriptions |

**Saves vs. shares vs. likes:**
- Saves are heavily rewarded (signal of "I want to come back to this") → favor save-prompts
- Shares matter but less than saves on TikTok (vs. LinkedIn where share is dominant)
- Likes are baseline — they're necessary but don't drive distribution alone

---

## Native Patterns (observed conventions)

- **Hook in first 1 second** with text on screen + verbal opening + visual interrupt simultaneously (the "3-Second Rule" triad — hits in opening second, not over 3 seconds spread)
- **Pattern interrupt at 3-second mark** — visual change, jump cut, or new framing
- **Fast cuts, movement, energy** — static talking head loses retention
- **Trending sounds boost reach** — audio carries algorithmic weight (verify per-track in `audio-trend-agent`)
- **Green screen for educational content** — shows source material behind speaker
- **Talking head + b-roll combo** — reduces "talking-head fatigue" past 8s
- **Before/after reveals** — split-screen or sequential

---

## Caption / Text Overlay Norms

- **Caption text:** 4000 char limit; first 50-80 visible. Critical info goes in first 80 chars.
- **Text overlay:** burned-in captions for accessibility (85%+ watch without sound — applies to all platforms but TikTok especially since the platform's native captions are unreliable)
- **Overlay rules:** max 2 lines, 3-5 words per line, bold sans-serif, black outline for legibility, color-highlight key terms

---

## Hashtag / Discovery Mechanics

- 3-5 hashtags optimal (more dilutes signal)
- Mix of: 1 broad (high-volume), 2 niche (mid-volume topic-specific), 1-2 trending (current moment)
- Hashtag-stuffing penalized — keep tight

---

## CTA Placement Conventions

- **Overlay CTA at 0:20-0:25** in 60s videos — high observed frequency in high-save samples
- **Caption CTA** as backup (last line of caption, often with arrow ↓)
- **Save-prompt** outperforms follow-prompt and link-in-bio in most niches
- End-card not used — TikTok ends abruptly; viewers swipe before any post-content frame

---

## Failure Modes ("don't do this on TikTok")

- **Burying the hook past 1.5s** — viewers swipe before the hook lands
- **Static talking head past 8s** without cut, framing change, or b-roll — retention drops
- **Generic openers** ("hey guys", "in this video", "today I want to talk about") — proven slop
- **No burned-in captions** — costs viewers in low-sound environments
- **Posting with watermark from another platform** — algorithm may detect and downrank (anecdotal but widely reported)
- **Long captions stuffed with hashtags** — looks spammy; truncates the substance
- **Trending audio used past peak** — audio decay drags reach (use `audio-trend-agent` to gate)

---

## Market Variants

- **VN TikTok:** higher tolerance for direct sales pitches; live-shopping native; "POV" hooks dominant in creator content
- **US TikTok:** parasocial-founder content over-indexed; pattern interrupts at 1-2s critical
- **SEA TikTok:** music-driven trend audio with stronger half-life than US (longer trends)
- (Audience-fit-agent applies these in register selection)

---

## Verification Checklist (run at each research refresh)

- [ ] TikTok Creator Portal — Video Specs URL still resolves and `last_updated` within 90d
- [ ] TikTok Creator Portal — Algorithm Updates page checked for new posts
- [ ] Newsroom for any 2026 algo announcement that supersedes prior guidance
- [ ] Update `mechanics_sources_verified[]` in artifact frontmatter with current `last_updated` dates
