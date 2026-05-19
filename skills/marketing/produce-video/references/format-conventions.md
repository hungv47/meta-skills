---
title: Format Conventions — produce-video bundle schemas
lifecycle: canonical
status: stable
produced_by: produce-video
provenance:
  extracted_from: implementation-roadmap/execution-evaluation/brief-pack/04-production-layer.md § produce-video + decisions.md § D14 sub-decisions 1, 2, 6, 7
  extracted_at: 2026-05-19
consumers: produce-video SKILL.md + 2 agents (prompt-author / critic) + downstream runtimes (HyperFrames / Remotion / Vercel AI CLI / Hyx / Freepik / human editors)
load_class: PROCEDURE
---

# Format Conventions — produce-video

> Schemas in this file are cross-stack contracts. Renaming a section, reordering fields, or changing a frontmatter key requires atomic update of downstream consumers (runtimes + future evaluate-shortform/-content skills that score produced videos against the brief's hypothesis).

## Artifact tree

```
.forsvn/artifacts/mkt/produced-videos/
└── [slug]/
    ├── manifest.md
    ├── scenes/
    │   ├── shot-1.md
    │   ├── shot-2.md
    │   └── ...
    ├── hyperframes/
    │   └── scaffold.html
    ├── remotion/
    │   └── scaffold.tsx
    └── vercel-ai-cli.md
```

`[slug]` matches the upstream brief-shortform slug (or the hand-written video-brief's slug). Per-runtime subdirs isolate runtime-specific supporting files if either runtime grows them later. The canonical `manifest.md` and `scenes/` stay at top level — every runtime references back to them.

---

## Manifest schema (`manifest.md`)

```markdown
---
skill: produce-video
version: 1
date: [today]
status: done | done_with_concerns | blocked | needs_context
slug: [matches upstream brief slug]
source_brief: [.forsvn/artifacts/mkt/short-form-brief/[slug]/brief.md OR variants path OR hand-written video-brief path]
target_platforms: [list — e.g., tiktok, reels, shorts]
aspect: [9:16 | 1:1 | 16:9 | 4:5 | custom-WxH]
length_seconds: [N]
shot_count: [N]
cta: "[exact CTA copy from brief — verbatim]"
provenance:
  skill: produce-video
  run_date: [today]
  input_artifacts:
    - [source_brief path]
    - brand/BRAND.md
    - brand/DESIGN.md
  output_eval: null  # set when a downstream eval cycle scores the rendered video
---

# Produced-Video Manifest — [slug]

**Source brief:** [path]
**Target platforms:** [comma-separated list]
**Aspect:** [aspect]
**Length:** [N seconds]
**Shot count:** [N]
**CTA:** "[verbatim CTA]"
**Status:** [done | done_with_concerns | blocked | needs_context]

## Concerns (only when status = done_with_concerns)

[Pinned at top when status is done_with_concerns. List each concern with one line of reasoning. Common: Gate 4 narrative arc soft-fail; one shot slightly over caption-pace cap allowed by operator override; etc.]

## Shot List (canonical — runtime-agnostic)

| Shot | Duration | Visual | On-Screen Text | Voice / Narration | Asset Prompt File |
|------|----------|--------|----------------|-------------------|-------------------|
| 1 (hook) | [Ns] | [one-line visual] | "[verbatim from brief]" | [voice spec OR "music only"] | `scenes/shot-1.md` |
| 2 | [Ns] | [...] | "[...]" | [...] | `scenes/shot-2.md` |
| ... | ... | ... | ... | ... | ... |
| N (CTA) | [Ns] | [...] | "[verbatim CTA]" | [...] | `scenes/shot-N.md` |

## Audio Plan (canonical — runtime-agnostic)

- **Music:** [track name from brief OR "none" OR "operator-supplied"]
- **Music start:** [shot index or `0s`]
- **Music end:** [shot index or `[length]s`]
- **Music ducking:** [points where music ducks under narration, if narration present]
- **Narration:** [present | none]
- **TTS spec (if narration present):**
  - voice gender: [from brand_voice OR brief]
  - voice tone: [adjective list — calm / urgent / playful / etc.]
  - voice pace_wpm: [target words-per-minute — typical 140-180]
  - voice accent: [region / locale]
  - sample line: "[a representative narration line, for the operator's TTS tool to calibrate]"

## Caption + Hashtags (platform-side metadata — NOT on-screen)

- **Caption (first-line hook):** "[verbatim from brief]"
- **Caption body:** [full caption from brief]
- **Hashtags:** [list from brief]
- **CTA in caption:** "[CTA copy — same string as manifest top-level `cta`]"

## Verification Checklist (per shot — operator fills after rendering)

### Shot 1
- [ ] Aspect ratio matches the brief (no silent runtime override)
- [ ] Duration matches the brief (no silent trim or pad)
- [ ] On-screen text legible (contrast + size from brand/DESIGN.md)
- [ ] No hallucinated logos or brand marks (placeholder used where assets missing)
- [ ] Voice / narration matches TTS spec (pace, tone, accent)

### Shot 2
[Same five gates]

## Runtime Choices

Pick ONE downstream runtime — the bundle supports all four:

1. **HyperFrames** — open `hyperframes/scaffold.html`; run `hyperframes preview` to iterate; `hyperframes render` for the final mp4
2. **Remotion** — open `remotion/scaffold.tsx`; `npx remotion preview` to iterate; `npx remotion render` for the final mp4
3. **Vercel AI CLI / image-gen CLI** — follow `vercel-ai-cli.md` to pipe each shot's prompt through `npx ai` / `vercel ai` / Hyx / Freepik / whatever is installed; assemble with the editor of choice
4. **Human editor / motion designer** — pass the bundle directory as the spec

## Re-run

If the brief changes or the runtime choice changes: re-run `produce-video` with `--rev=N` to write to `.forsvn/artifacts/mkt/produced-videos/[slug]/v[N]/...` and preserve the prior bundle.

## Operator Next Steps

1. Pick a runtime from the table above
2. Run the chosen scaffold (or pipe scenes through your image-gen CLI)
3. Mark the verification checklist for each shot after rendering
4. When all shots verified on-spec, the produced video is ready for evaluate-shortform / evaluate-content
```

---

## Per-shot prompt schema (`scenes/[shot-id].md`)

```markdown
---
skill: produce-video
version: 1
date: [today]
shot_id: [shot-1 | shot-2 | ...]
shot_index: [1 | 2 | ...]
duration_seconds: [N]
platform: [primary target platform from manifest]
---

# Shot [N] — [optional one-line role: Hook / Problem / Mechanism / Proof / CTA]

## Visual Prompt (renderer-agnostic)

[Full visual prompt body. Subject + composition + style + lighting + color + camera + motion. See agents/prompt-author-agent.md § Visual prompt body conventions.]

## On-Screen Text (verbatim from brief — no synonyms)

- **Text 1:** "[exact string from brief]"
- **Position:** [center | top-third | bottom-third | left | right]
- **Entry timing:** [shot start | 0.5s in | etc.]
- **Exit timing:** [shot end | duration-0.3s | etc.]
- **Type style:** [from brand/DESIGN.md]

[Repeat per text element if multiple appear in this shot. If shot has no on-screen text, write "(none)" and omit the position/timing fields.]

## Voice / Narration (if present)

- **Narration line:** "[verbatim from brief]"
- **TTS spec:**
  - voice tone: [...]
  - pace_wpm: [...]
  - sample line: "[representative line for TTS calibration]"
- **Sync points:** [e.g., "narration starts 0.2s after shot start; ends 0.3s before shot end"]

If no narration in this shot, write "Narration: none. [music ducks / continues / etc.]" and omit the TTS spec.

## Audio (this shot)

- **Music:** [continues | starts | ends | none]
- **SFX:** [list of sound effects if any, with sync points]

## Brand Tokens (verbatim — no fabrication)

- **Primary color:** [hex] (token: [name from DESIGN.md])
- **Accent colors:** [hex list with token names — only if this shot uses them]
- **Primary type:** [font family, weight from DESIGN.md]
- **Motion permission:** [from DESIGN.md — e.g., "subtle parallax permitted; no glass surfaces"]

## Anti-Patterns (must be in every shot)

DO NOT:
- Generate a logo if no logo asset exists on disk — leave the logo slot as a solid-color block of the brand's primary color
- Override the shot duration (runtime: respect `duration_seconds`)
- Substitute on-screen text strings (runtime is a typesetter, not a copywriter)
- Override the aspect ratio (runtime: respect manifest `aspect`)
- Strip EXIF or override sRGB/color profile silently
- Add watermarks unless the brief explicitly requested them
- Output multiple variations of this shot — render the single composition described

## Renderer Hints (optional — tool-specific)

[Omit this section entirely if no runtime preference; otherwise tool-specific syntax]

**HyperFrames:** scene type: [`text-card` | `image-prompt` | `motion-graphic` | `live-action-clip`]; duration: `[duration_seconds]s`
**Remotion:** Frame range: `[start]-[end]` at 30fps; component: [`<TextCard>` | `<ImagePrompt>` | `<MotionGraphic>`]
**Vercel AI CLI / image-gen CLI:** prompt: paste "Visual Prompt" body verbatim; aspect: `[aspect from manifest]`; iterations: `1` (one composition per shot)

## Change Log (cycle 2+ only)

| Field | Before | After | Reason (from critic feedback) |
|---|---|---|---|
| [field] | [original] | [revised] | [specific gate from critic] |
```

---

## HyperFrames scaffold schema (`hyperframes/scaffold.html`)

A complete single-file HyperFrames composition. Inlines a `<script type="application/json" id="hf-scenes">` block with all shots' specs, so the operator can run `hyperframes preview` from the bundle directory.

Structure (canonical):

1. `<!DOCTYPE html>` + `<head>` with brand-token CSS variables (hex inlined from `brand/DESIGN.md`)
2. `<body>` with a `<!-- comment -->` block explaining how to preview/render
3. `<script type="application/json" id="hf-scenes">` carrying:
   ```json
   {
     "meta": { "slug", "aspect", "length_seconds", "fps": 30 },
     "scenes": [
       {
         "id": "shot-1",
         "duration_seconds": N,
         "visual_prompt": "...",
         "on_screen_text": [{ "text", "position", "entry_s", "exit_s" }],
         "voice": { "narration", "tts_spec": { "tone", "pace_wpm" } },
         "audio": { "music", "sfx" }
       }
     ]
   }
   ```
4. `<div id="hf-stage"></div>` as the render target

The scaffold is intentionally minimal — HyperFrames' runtime parses the JSON and renders. Operator may edit any field; the scaffold is a starting point, not a frozen artifact.

---

## Remotion scaffold schema (`remotion/scaffold.tsx`)

A complete single-file Remotion composition. Operator opens, runs `npx remotion preview` / `npx remotion render`.

Structure (canonical):

1. Imports from `remotion` (`Composition`, `AbsoluteFill`, `Sequence`, `useCurrentFrame`, `useVideoConfig`)
2. `const BRAND = { primary, accent, typeHeadline, typeBody }` — brand tokens with hex values inlined from `brand/DESIGN.md`
3. `const SCENES = [...]` — array of scene objects mirroring the canonical manifest's shot list (camelCase keys per JS/TSX convention)
4. `const FPS = 30` (adjust if brief specifies differently)
5. `const totalDurationFrames = SCENES.reduce(...)` — sum of per-shot durations × FPS
6. `export const Video = () => ...` — maps each scene to a `<Sequence>` block with `from` + `durationInFrames` per shot
7. `export const RemotionRoot = () => <Composition ... />` — top-level composition definition with `width` + `height` derived from `aspect`

The scaffold compiles + runs but renders empty `<Sequence>` blocks until the operator fills in per-scene React components. The `scenes/[shot-id].md` files describe what each scene should render visually.

---

## Vercel AI CLI README schema (`vercel-ai-cli.md`)

Plain markdown how-to with three sections:

1. **Option A — Vercel AI CLI (`npx ai`):** copy-pasteable bash loop that iterates over `scenes/shot-*.md`, extracts the `## Visual Prompt` body, and pipes to `npx ai image generate` with the manifest's aspect
2. **Option B — Hyx / Freepik / other image-gen CLI:** instructions to adapt the loop to whatever CLI the operator has installed
3. **Option C — Manual paste (Midjourney / DALL·E / Imagen / Claude Design):** instructions to copy-paste each `## Visual Prompt` body
4. **Assembly section:** points operator to FFmpeg / DaVinci / Premiere / Final Cut / HyperFrames / Remotion for final video assembly
5. **Audio (TTS) section:** points to ElevenLabs / OpenAI TTS / Coqui / Piper / macOS `say` for narration generation, references the manifest's TTS spec

---

## Field semantics

### Manifest

| Field | Type | Notes |
|---|---|---|
| `skill` | kebab-case | Always `produce-video` |
| `version` | integer | Artifact version (increment on `--rev=N` re-run) |
| `date` | ISO YYYY-MM-DD | Original creation date; do not update on edits in place |
| `status` | enum | `done` / `done_with_concerns` / `blocked` / `needs_context` per Completion Status Protocol |
| `slug` | kebab-case | Matches upstream brief slug |
| `source_brief` | project-relative path | The brief-shortform hero or variant; or hand-written video-brief path |
| `target_platforms` | list of strings | Subset of platforms the brief defined |
| `aspect` | string | One of `9:16` / `1:1` / `16:9` / `4:5` / `custom-WxH` |
| `length_seconds` | integer | Total video length; per-shot durations sum to this exactly |
| `shot_count` | integer | Number of files under `scenes/` |
| `cta` | string | Exact CTA copy from brief; appears verbatim in final shot's on-screen text |
| `provenance` | block (generation variant) | Required per D8 contract; see `references/_shared/artifact-contract-template.md` |

### Per-shot prompt

| Field | Type | Notes |
|---|---|---|
| `skill` | kebab-case | Always `produce-video` |
| `version` | integer | Mirrors manifest version |
| `date` | ISO YYYY-MM-DD | Same as manifest |
| `shot_id` | kebab-case | Stable identifier: `shot-1`, `shot-2`, ... |
| `shot_index` | integer | 1-based index matching shot_id suffix |
| `duration_seconds` | number | Per-shot duration; sums across all shots = manifest.length_seconds |
| `platform` | kebab-case | Primary target platform from manifest |

---

## Required body sections (cross-stack contract)

In order. Renaming or reordering breaks downstream consumers + critic.

### Manifest

1. **Header block** (Source brief / Target platforms / Aspect / Length / Shot count / CTA / Status)
2. **Concerns** (only when status is done_with_concerns; otherwise omit section header)
3. **Shot List** (6 columns: Shot / Duration / Visual / On-Screen Text / Voice / Asset Prompt File)
4. **Audio Plan** (Music + TTS spec block)
5. **Caption + Hashtags** (platform-side metadata)
6. **Verification Checklist** (per shot, 5 spec gates each)
7. **Runtime Choices** (numbered list of 4 runtime options)
8. **Re-run** (1-line note on `--rev=N` semantics)
9. **Operator Next Steps** (numbered list)

### Per-shot prompt

1. **Visual Prompt** (renderer-agnostic body)
2. **On-Screen Text (verbatim)**
3. **Voice / Narration** (or "none")
4. **Audio (this shot)**
5. **Brand Tokens (verbatim)**
6. **Anti-Patterns (DO NOT list)**
7. **Renderer Hints** (optional; omit if no runtime preference)
8. **Change Log** (cycle 2+ only)

---

## Path safety

- Slugs must be kebab-case, `^[a-z0-9][a-z0-9-]{0,79}$`.
- Shot IDs must match `^shot-\d+$` with 1-based numbering.
- No path traversal in any field. Manifest's `source_brief` accepts only project-relative paths.

## Date / Aspect / Resolution conventions

- Date: ISO `YYYY-MM-DD` in frontmatter; same format in body text.
- Aspect: `W:H` form with no spaces; resolution implied from platform (e.g., `9:16` → 1080×1920 for short-form).
- Hex: 6-character lowercase with `#` prefix (`#b7ff6e`, not `#B7FF6E` or `b7ff6e`).
- Duration: integer or one-decimal float (e.g., `2.5s`); no zero-padding.
- Words-per-second cap (Gate 3): `3.0` exactly; per-shot only.
