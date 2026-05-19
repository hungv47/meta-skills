# Production / Execution Layer

> **STATUS: SUPERSEDED** (2026-05-16). Execution plan moved to `ROADMAP.md` §4 (E4 — DEFERRED). Source material retained for reference when production skills are revisited.

## The Gap

The stack has extensive strategy and briefing skills for visual assets, short-form video, and social copy — but **zero skills that produce the actual output**. Every asset-producing skill stops at a brief/spec:

| Skill | Produces | Execution Gap |
|---|---|---|
| `design-brief` | Graphic design brief with image-gen prompt | No skill renders the visual |
| `short-form-brief` | Video brief with shot list, audio plan | No skill produces the video |
| `social-copy` | Platform-formatted copy | No skill posts to the platform |
| `ad-copy` | Ad copy with char caps, CTAs | No skill creates the ad in Meta Ads Manager |
| `copywriting` | Headlines, hooks, body copy | No skill places it on a page |

## Proposed Skills

Three new skills — one per production medium. Independent, can build in any order.

---

## 1. Visual Asset Production (`asset-produce`)

### What It Does

Takes a `design-brief` output and produces the actual visual asset using available tools:
- **Image generation** via GPT-4o/image generation models or Midjourney API
- **Figma document creation** via Figma MCP (if available)
- **SVG/vector generation** via programmatic tools for logos, icons, illustrations

### Skill Architecture

- **Budget**: `standard` (some multi-agent work for quality control)
- **Pre-dispatch**: reads the design-brief artifact, extracts concept direction, platform specs (aspect ratio, safe zones), color tokens, copy to render
- **Tools layer** (choose by available MCP/API):
  - Image gen model (DALL-E / Imagen / Midjourney API)
  - Figma MCP (create Figma file, set frames, place assets, set type)
  - Programmatic SVG/vector rendering for repeatable components
- **Quality gate**: render a preview, check against brief specs (aspect ratio, legibility, color fidelity). If off-spec, regenerate with specific feedback.
- **Output**: saves to `skills-resources/marketing/design-briefs/[slug]/assets/` with platform-named files (e.g., `ig-story.png`, `linkedin-doc.png`)

### Implementation Steps

1. Scaffold skill at `marketing-skills/skills/asset-produce/`
2. Define pre-dispatch questions: "which design-brief artifact?", "which platforms?", "image gen tool available?"
3. Implement image-gen agent — routes to available model, passes prompt from design-brief + visual spec injection
4. Implement optionally Figma MCP agent — creates frames, sets tokens, places assets
5. Implement quality gate — visual spec compliance check
6. Add reference: `references/asset-production-anti-patterns.md` (don't add watermarks, don't compress quality, don't hallucinate brand assets)

### Anti-patterns

- Don't produce every variant — let the user pick which platforms from the brief
- Don't hallucinate logos or brand marks that don't exist — if the brief references something not in a local file, flag it
- Don't strip EXIF or override aspect ratios without warning

---

## 2. Social Posting (`social-publish`)

### What It Does

Takes a `social-copy` output (or `short-form-brief` for video) and publishes it to the target platform:
- **Typefully API** for Twitter/X (draft or publish)
- **Browser automation** for platforms without APIs (LinkedIn, Instagram, YouTube)
- **Platform SDKs** where available (TikTok API, LinkedIn API, etc.)

### Skill Architecture

- **Budget**: `fast` (single-agent, procedural — the complexity is in API auth, not reasoning)
- **Pre-dispatch**: reads the social-copy artifact, extracts platform, copy variants, media attachments
- **Auth layer**: stores platform credentials in environment variables or a config file. If not configured, produces a publish-ready file instead.
- **Execution modes**:
  - `publish` — posts live (requires credentials)
  - `draft` — creates a draft/saves to platform (requires credentials)
  - `export` — produces a text file with platform-native formatting (no credentials needed)
- **Safety gate**: confirm before publish. "Publish to Twitter: 'Your hook here...'? [y/N]"
- **Output**: confirmation URL or saved file

### Implementation Steps

1. Scaffold skill at `marketing-skills/skills/social-publish/`
2. Implement Typefully agent (Twitter/X)
3. Implement browser-automation agent for LinkedIn (most requested platform)
4. Implement export mode (formatted text file with platform spec)
5. Add safety confirmation gate
6. Add reference: `references/platform-credentials.md` with setup instructions

### Platform Priority

1. Twitter/X (Typefully API — simplest)
2. LinkedIn (browser automation — most requested for B2B)
3. Instagram (browser or API)
4. YouTube (API or browser)
5. TikTok (API)

---

## 3. Short-Form Video Production (`video-produce`)

### What It Does

Takes a `short-form-brief` and produces the actual video using:
- **HyperFrames** for motion-graphic / text-animated videos
- **Remotion** (if available) for React-based video composition
- **Browser automation** for screen recordings with voiceover

### Skill Architecture

- **Budget**: `deep` (video production is expensive in tokens + compute)
- **Pre-dispatch**: reads short-form-brief artifact (hook, shot list, on-screen text, audio plan, captions, CTA)
- **Rendering layer**: routes to available video tool:
  - HyperFrames: scaffold a `.html` composition, add text overlays, transitions, timing
  - Remotion: scaffold a React composition with audio track
  - Browser recording: navigate pages, record with voiceover
- **Voiceover**: uses `hyperframes-media` for Kokoro TTS or Whisper transcription
- **Caption sync**: burns captions into video using timed text
- **Output**: saves video file to `skills-resources/marketing/short-form/[slug]/[date]-output.mp4`

### Implementation Steps

1. Scaffold skill at `marketing-skills/skills/video-produce/`
2. Implement HyperFrames route — takes shot list → creates timed composition
3. Implement TTS integration for voiceover
4. Implement caption burn-in from brief's caption section
5. Add quality gate — check duration matches brief spec, check text legibility, check CTA visibility
6. Add reference: `references/video-production-tooling.md`

### Caveats

- Video production is expensive (token-wise). First version should produce a preview-quality render and let the user opt into full render.
- HyperFrames must be installed. If not, fall back to a detailed render script that the user can run manually.
- Remotion is optional — don't require it.

---

## Cross-Cutting: Human Review Gate

All three skills include a mandatory human review step before the output is considered "final." The review gate:

1. **Produces output** — renders the asset, posts a draft, or creates a video
2. **Shows the user** — displays a preview (image, video thumbnail, or draft URL)
3. **Waits for confirmation** — "Approve? [y/N/reject with feedback]"
4. **On reject** — takes user feedback, regenerates with specific changes, shows again
5. **On approve** — marks as final, saves to the artifact tree

This prevents the execution layer from producing garbage without oversight while keeping the iteration fast.
