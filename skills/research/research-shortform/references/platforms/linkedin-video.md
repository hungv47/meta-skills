# LinkedIn Video — Platform Reference (opt-in)

Cited mechanics for LinkedIn native video. Opt-in platform — runs only when user requests via `--platforms linkedin` or `--all`.

---

## Format Specs (mechanical)

| Spec | Value | Source |
|---|---|---|
| Aspect ratios | 16:9, 1:1, 9:16 | LinkedIn Marketing Solutions — Video Specs |
| Duration | 3s-10min (1-2min optimal for engagement) | LinkedIn Marketing Solutions |
| Resolution min | 720p; 1080p recommended | LinkedIn Marketing Solutions |
| Captions | required — most viewers watch without sound | LinkedIn Marketing Solutions |

**Source-doc URLs:**
- LinkedIn Marketing Solutions — Video specs and best practices
- LinkedIn Engineering / Product blogs for any feed-ranking updates

---

## Algorithm Signals (cited mechanics)

| Signal | Value | Source |
|---|---|---|
| Optimal length | <90s for retention | LinkedIn Marketing Solutions guidance |
| 3s retention determinacy | first 3s determines up to 65% of total retention | LinkedIn Marketing Solutions |
| Captions impact | +29% engagement, +32% longer retention vs. uncaptioned | LinkedIn Marketing Solutions |
| Sound-off viewing | majority watch without sound (universal short-form rule) | LinkedIn Marketing Solutions |

**Burned-in captions are mandatory.** LinkedIn's auto-captions are unreliable; producer must burn captions in.

**Caption styling spec (from LinkedIn guidance):**
- 1-2 lines per frame
- 42 chars per line max
- 2-4 seconds on screen per line

---

## Native Patterns

- **Talking head insight** — single camera, single message, professional framing
- **Explainer with graphics** — kinetic-type or text overlays
- **Event / interview clip** — repurposed from longer content
- **Product demo** — software, B2B services
- **Behind-the-scenes** — but professionally framed (vs. TikTok's casual BTS)

---

## Caption / Text Overlay Norms

- LinkedIn post caption: 3,000 chars max (first 2-3 lines visible before "see more")
- First 200 chars of caption carry the hook — front-load
- Hashtags 3-5, professional ones (no creator-platform hashtags)
- Burned-in captions on video required (per algorithm signal data above)

---

## CTA Placement Conventions

- **Comment-prompt CTA** ("what's your take?", "share your experience") — drives engagement signal
- **Connection-request CTA** ("follow for more on [topic]")
- **Reshare-prompt CTA** ("send this to someone leading their team's [topic]")
- Direct link-in-comments common (LinkedIn deprioritizes external links in main post)

---

## Failure Modes ("don't do this on LinkedIn")

- **Casual/bro tone in B2B context** — register mismatch
- **TikTok-watermarked or platform-jokey video** — feels off-platform
- **No burned-in captions** — costs the +29% engagement
- **Length over 90s without strong reason** — retention drops sharply past 90s
- **Generic professional fluff** ("excited to announce…", "thrilled to share…") — fails brand-fit
- **Sales-pitch CTA** — LinkedIn audience pushes back hard on naked sales

---

## Market Variants

- **VN LinkedIn:** smaller user base, but B2B + professional buyers concentrated here. báo chí or semi-professional register works best
- **US LinkedIn:** highest LinkedIn density; founder + B2B SaaS thrives here
- **EN B2B globally:** LinkedIn is the dominant B2B short-form surface — pair with X video for founder-mode reach

---

## When to opt in

LinkedIn video makes sense for:
- B2B SaaS + enterprise software
- Founder thought leadership for professional audiences
- Recruitment / employer branding
- Industry commentary

LinkedIn video is weaker for:
- B2C consumer brands (smaller audience overlap)
- Casual / bro-mode creator content (register mismatch)

---

## Verification Checklist

- [ ] LinkedIn Marketing Solutions pages resolve and `last_updated` checked
- [ ] +29% / +32% caption engagement numbers still cited in current docs (verify on each refresh)
- [ ] No major feed-ranking change since last verification
- [ ] Update `mechanics_sources_verified[]` in artifact frontmatter
