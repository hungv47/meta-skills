---
title: Format Conventions — produce-video bundle schemas
lifecycle: canonical
status: stable
produced_by: produce-video
provenance:
  extracted_from: implementation-roadmap/execution-evaluation/brief-pack/04-production-layer.md § produce-video + decisions.md § D14 sub-decisions 1, 2, 6, 7
  extracted_at: 2026-05-19
consumers: produce-video SKILL.md + 2 agents (prompt-author / critic) + downstream runtimes (HyperFrames / Remotion / text-to-lottie / Manim / Vercel AI CLI / Higgsfield / Invideo / HeyGen / video-use / human editors)
load_class: PROCEDURE
---

# Format Conventions — produce-video

> Schemas in this file are cross-stack contracts. Renaming a section, reordering fields, or changing a frontmatter key requires atomic update of downstream consumers (runtimes + future evaluate-shortform/-content skills that score produced videos against the brief's hypothesis).

## Artifact tree

```
docs/forsvn/artifacts/marketing/produced-videos/
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
    ├── vercel-ai-cli.md
    └── post.md
```

`[slug]` matches the upstream brief-shortform slug (or the hand-written video-brief's slug). Per-runtime subdirs isolate runtime-specific supporting files if either runtime grows them later. The canonical `manifest.md` and `scenes/` stay at top level — every runtime references back to them. `post.md` is the terminal assemble → grade → subtitle stage (the post lane, routed to `video-use` / ffmpeg); production-lane selection logic is the skill reference `production-lanes.md`.

---

## Manifest schema (`manifest.md`)

The manifest carries 12 frontmatter fields in shortform mode + 3 added fields in app-preview mode (`mode`, `surface`, `brand_source`). The `mode` field discriminates the rest. Aspects supported: `9:16` / `1:1` / `16:9` / `4:5` / `custom-WxH` for shortform; same set plus `2:3` for app-preview.

```markdown
---
skill: produce-video
version: 1
date: [today]
status: done | done_with_concerns | blocked | needs_context
mode: shortform | app-preview        # WS4 — discriminator; required
slug: [matches upstream brief slug]
source_brief: [docs/forsvn/artifacts/marketing/brief-shortform/[slug]/brief.md OR variants path OR hand-written video-brief path OR docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/handoff-produce-video.md]
target_platforms: [list — e.g., tiktok, reels, shorts]    # shortform mode
surface: [app-store | onboarding | website | social]      # app-preview mode only — omit in shortform
aspect: [9:16 | 1:1 | 16:9 | 4:5 | 2:3 | custom-WxH]
length_seconds: [N]
shot_count: [N]
cta: "[exact CTA copy from brief — verbatim]"             # shortform required; app-preview may be "(none)"
brand_source: brand-md | cold-start-hint                  # app-preview mode only — omit in shortform
provenance:
  skill: produce-video
  run_date: [today]
  input_artifacts:
    - [source_brief path]
    - brand/BRAND.md       # both modes
    - brand/DESIGN.md      # both modes (or annotated "absent — cold-start-hint" when brand_source: cold-start-hint)
    - [docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/assets.md]  # app-preview mode only
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

**Why this works** (opening framing — the bet carried through from the brief's `## What This Brief Bets On`; product-fit per `_shared/why-this-works-convention.md`. Rides the header, NOT a new H2 — preserves the reorder-sensitive section spine.)
- The bet: [the one core wager this video makes — the hook / arc / lane choice that must land; falsifiable, so `evaluate-shortform` can test it next cycle]
- For this product: [a load-bearing shot or structure choice → the ICP pain / VoC phrase / positioning it serves — name the source: the brief's bet, `ICP.md`, `PRODUCT-CONTEXT.md`]
- For this product: [a second load-bearing choice → its product-specific reason]
- The differentiator: [why this script wouldn't work verbatim for a competitor — the Competitor-Swap angle]

[No ICP/brand foundation, or a cold-start brief → the convention's Partial/Absent state; never fabricate a pain, VoC quote, or positioning claim. This is product-fit, not channel-fit (algorithm/format reasoning is the brief's legibility block, not here).]

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

**Recommended lane for this script:** [lane] — [one-line why, from `production_mode` + brand-fit]. Selection logic: `production-lanes.md`.

Pick ONE production lane (the bundle supports all five; engines + prerequisites: `render-engines.md` § Video engines):

1. **code-render** (deterministic, brand-exact, no cloud key) — HyperFrames: open `hyperframes/scaffold.html`, `hyperframes preview` → `hyperframes render`; Remotion: open `remotion/scaffold.tsx`, `npx remotion preview` → `npx remotion render`; Lottie for a looping vector asset
2. **explainer** (deterministic) — Manim for a math / algorithm / formal-diagram walkthrough *(deferred lane — confirm the need before standing up the LaTeX toolchain)*
3. **generative** (stochastic, operator-connected) — follow `vercel-ai-cli.md` to pipe each shot's prompt through `ai video` / Higgsfield / Invideo; on-screen copy stays off the frame (burned in post)
4. **avatar** (stochastic, operator-connected) — HeyGen renders a presenter from the narration script + a STYLE block
5. **post** (terminal — closes every lane) — follow `post.md` to assemble the shots, color-grade, and burn subtitles via `video-use` / ffmpeg

A human editor / motion designer can take the bundle directory as the spec for any lane.

## Re-run

If the brief changes or the runtime choice changes: re-run `produce-video` with `--rev=N` to write to `docs/forsvn/artifacts/marketing/produced-videos/[slug]/v[N]/...` and preserve the prior bundle.

## Operator Next Steps

1. Pick a runtime from the table above
2. Run the chosen scaffold (or pipe scenes through your image-gen CLI)
3. Mark the verification checklist for each shot after rendering
4. When all shots verified on-spec, the produced video is ready for evaluate-shortform / evaluate-content
```

---

## Per-shot prompt schema (`scenes/[shot-id].md`)

Frontmatter carries the same 7 fields in both modes; app-preview adds 5 mode-specific fields below the common block. The `mode` field on the shot mirrors the manifest's discriminator.

```markdown
---
skill: produce-video
version: 1
date: [today]
mode: shortform | app-preview              # WS4 — mirrors manifest.mode
shot_id: [shot-1 | shot-2 | ...]
shot_index: [1 | 2 | ...]
duration_seconds: [N]
platform: [primary target platform from manifest]     # shortform mode
surface: [app-store | onboarding | website | social]  # app-preview mode (replaces platform)
# --- app-preview-only fields (omit in shortform mode) ---
source_screenshot: [project-relative path to screenshot]
crop_rect: "[x, y, w, h]"                  # source-pixel rectangle OR named-component selector string
mask_transform: static | crossfade-in-place | hard-cut | mask-expand | mask-contract | composite
interaction_verb: rest | tap | drag | scroll | type | toggle | reveal | hold | settle | transition
pointer_spec: none | "{style, color_hex, color_token, position_crop_relative: {x,y}, ripple: {start_px, end_px, duration_s} | null}"
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
**Generative video (AI-CLI `ai video` / Higgsfield / Invideo):** prompt: paste "Visual Prompt" body verbatim + `[aspect]` + `[duration_seconds]s`; on-screen text: NONE (burned in post); iterations: `1`
**Avatar (HeyGen):** presenter script: the shot's narration verbatim; STYLE: framing + wardrobe + background token from `brand/DESIGN.md`
(Per-lane dialect: `production-lanes.md`.)

## Change Log (cycle 2+ only)

| Field | Before | After | Reason (from critic feedback) |
|---|---|---|---|
| [field] | [original] | [revised] | [specific gate from critic] |
```

---

## App-Preview Mode — Body Section Additions

When `mode: app-preview`, the manifest's body uses the same 9 required sections as shortform PLUS the following adjustments:

- **Shot List** — table gains 4 columns appended after `Voice / Narration`: `Source Screenshot` / `Crop Rect` / `Mask Transform` / `Interaction Verb`. Pointer + caption-band live in the per-shot prompt file; the manifest's row carries only their presence.
- **Audio Plan** — narration is `present: false` by default for app-preview; the section reduces to the per-beat audio table (UI tap / whoosh / confirm chime) from the handoff. TTS spec block omitted unless the companion `brief.md` § Pointer + Audio Plan supplied narration text.
- **Verification Checklist** — per-shot gates change to 5 app-preview gates: *(1)* Aspect matches handoff (no silent override) — *(2)* Duration matches handoff — *(3)* Source screenshot renders at crop rect with no rescale drift — *(4)* Pointer color resolves to a DESIGN.md token or `(cold-start-sampled)` — *(5)* Caption band geometry honored.
- **Concerns** — pinned at top when `brand_source: cold-start-hint` even on status `done`. The cold-start posture is a permanent provenance note for the rendered video.

The per-shot prompt schema's required body sections (Visual Prompt / On-Screen Text / Voice / Audio / Brand Tokens / Anti-Patterns / Renderer Hints / Change Log) carry forward unchanged in shape; app-preview content patterns are:

- **Visual Prompt** — DOES NOT describe a synthesized image. Instead it describes the **composition operation**: source screenshot file + crop rectangle + mask transform + interaction overlay. No "lighting / mood" line; no "camera / motion" line; the screenshot is the visual. The body reads as a stage direction, not an image-gen prompt.
- **On-Screen Text** — same verbatim rule; caption text is read from the handoff's `caption_text` column. Position field carries `caption_band.position` (e.g., `bottom-quarter`) rather than the shortform's `top-third / center / bottom-third`.
- **Brand Tokens** — `pointer_spec.color_hex` + `caption_band` background token MUST be cited. When `brand_source: cold-start-hint`, the token name may be the literal `(cold-start-sampled)` with the hex sampled from the source screenshot — never a fabricated token.
- **Renderer Hints** — REQUIRED in app-preview mode (not optional like shortform). Both Remotion and HyperFrames hints must be populated because both scaffolds need crop/mask/pointer semantics.

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

To shrink that blank-`<Sequence>` gap, each scene starts from a **brand-tokenized fill pattern** the prompt-author emits inline — a `<TextCard>` / `<MotionGraphic>` skeleton already wired to the `BRAND` tokens and the shot's on-screen text, not a bare `<div>`. For richer reusable scene blocks the operator MAY pull from a Remotion component registry (a `npx shadcn add …`-style copy-in) — but name that capability **generically and re-theme to `brand/DESIGN.md`**: the emitted scaffold names no third-party registry and declares no such dependency, because hardcoding one would couple this runtime to one vendor and break the tool-agnostic contract.

---

## App-Preview Mode — HyperFrames scaffold patterns

When `mode: app-preview`, the HyperFrames scaffold carries the same single-file structure as shortform PLUS the following per-scene additions inside `<script type="application/json" id="hf-scenes">`:

```json
{
  "meta": { "slug", "aspect", "length_seconds", "fps": 30, "mode": "app-preview", "surface": "app-store" },
  "scenes": [
    {
      "id": "shot-1",
      "duration_seconds": N,
      "source_screenshot": "screenshots/01-home.png",
      "crop_rect": [x, y, w, h],
      "mask_transform": "static" | "crossfade-in-place" | "hard-cut" | "mask-expand" | "mask-contract" | "composite",
      "mask_keyframes": [   // only when mask_transform is mask-expand / mask-contract / composite
        { "t_s": 0.0, "rect": [x, y, w, h] },
        { "t_s": 0.4, "rect": [x2, y2, w2, h2] }
      ],
      "interaction_verb": "tap",
      "pointer_spec": {
        "style": "solid-circle",
        "size_px": 64,
        "color_hex": "#0F4C5C",
        "color_token": "color.accent",
        "position_crop_relative": {"x": 430, "y": 110},
        "ripple": {"start_px": 80, "end_px": 160, "duration_s": 0.3}
      },
      "caption_band": {"position": "bottom-quarter", "height_px": 480, "safe_area_inset_px": 120},
      "on_screen_text": [{ "text": "Tap to begin a surge", "entry_s": 0.0, "exit_s": 2.0 }],
      "audio": { "music": "none", "sfx": [], "default_state": "on" }
    }
  ]
}
```

The HyperFrames runtime maps these to:

- **`source_screenshot` → `<img src>` layer** inside the stage, naturally sized; the operator may set `image-rendering: -webkit-optimize-contrast` on the layer to preserve crisp UI edges at scale.
- **`crop_rect` + `mask_transform: static` → CSS `overflow: hidden` + `transform: scale(K) translate(-x, -y)`** on the stage container, where K is derived from output-width ÷ crop-width. For `mask_transform: mask-expand` / `mask-contract` / composite, the operator drives the transform via `element.animate()` (waapi) using `mask_keyframes` as the keyframe stops, with `currentTime` slaved to HyperFrames' `hf-seek` events. See `references/_shared/production-pattern.md` for the seek-driven pattern.
- **`mask_transform: crossfade-in-place` → 2 stacked `<img>` layers**, top layer `opacity` waapi-animated from 1→0 across the `duration_s` (or sub-window) named in the spec.
- **`mask_transform: hard-cut` → instantaneous `<img src>` swap** at the beat boundary; no animation.
- **`pointer_spec` → absolutely-positioned `<div>`** inside the cropped stage, sized + colored per spec; `ripple` rendered as a second `<div>` with waapi-animated `width` / `height` / `opacity` keyframes.
- **`caption_band` → fixed-position `<div>`** at `bottom: safe_area_inset_px`, height `height_px`, with the caption text rendered inside per the existing brand-token type rules. Fade-in/fade-out via waapi.

The scaffold uses **waapi adapter patterns** (see project-level `waapi` skill if available) for all motion, ensuring deterministic seek behavior under HyperFrames' frame-by-frame render loop. Programmatic `setTimeout` / `setInterval` are FORBIDDEN — they cannot seek.

---

## App-Preview Mode — Remotion scaffold patterns

When `mode: app-preview`, the Remotion scaffold carries the same single-file structure as shortform PLUS the following adjustments to the `SCENES` array and the per-scene render component:

```tsx
const SCENES: Scene[] = [
  {
    id: 'shot-1',
    durationSeconds: 2.0,
    mode: 'app-preview',
    sourceScreenshot: 'screenshots/01-home.png',
    cropRect: [240, 1820, 810, 220],        // [x, y, w, h] in source pixels
    maskTransform: 'static',
    maskKeyframes: null,                    // present only for mask-expand / mask-contract / composite
    interactionVerb: 'rest',
    pointerSpec: null,                      // or { style, sizePx, colorHex, colorToken, positionCropRelative, ripple }
    captionBand: { position: 'bottom-quarter', heightPx: 480, safeAreaInsetPx: 120 },
    onScreenText: [{ text: 'Tap to begin a surge', entryS: 0.0, exitS: 2.0 }],
    audio: { music: 'none', sfx: [], defaultState: 'on' },
  },
  // ... shot-2 through shot-N
];

// App-preview scene renderer — operator fills in this component
const AppPreviewScene: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Crop scale: output width ÷ crop width
  const [cropX, cropY, cropW, cropH] = scene.cropRect as [number, number, number, number];
  const scale = width / cropW;

  // Interpolated rect for mask-expand / mask-contract
  const currentRect =
    scene.maskKeyframes != null
      ? interpolateRect(scene.maskKeyframes, frame / fps)
      : scene.cropRect;

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: BRAND.surface}}>
      <img
        src={scene.sourceScreenshot}
        style={{
          position: 'absolute',
          left: -currentRect[0] * scale,
          top: -currentRect[1] * scale,
          width: `auto`,
          height: `auto`,
          transform: `scale(${width / currentRect[2]})`,
          transformOrigin: 'top left',
          imageRendering: 'crisp-edges',
        }}
      />
      {scene.pointerSpec && <Pointer spec={scene.pointerSpec} scale={scale} />}
      {scene.onScreenText.map((t, i) => (
        <CaptionBand key={i} band={scene.captionBand} text={t} frame={frame} fps={fps} />
      ))}
    </AbsoluteFill>
  );
};
```

The Remotion scaffold maps the spec to:

- **`source_screenshot` → `<img>`** with absolute positioning and CSS transform-driven crop (same math as HyperFrames; Remotion's deterministic frame loop replaces waapi).
- **`mask_transform: static` → fixed `cropRect`**; `mask-expand` / `mask-contract` / composite → frame-interpolated rect via a helper like `interpolateRect(keyframes, currentTimeSeconds)` that linearly interpolates each of `[x, y, w, h]` between keyframe stops.
- **`mask_transform: crossfade-in-place` → 2 stacked `<img>` layers** with opacity driven by `interpolate(frame, [start, end], [1, 0])` from Remotion's standard utility.
- **`mask_transform: hard-cut` → switch the `<img src>` instantly** at the beat boundary; the Sequence boundary IS the cut.
- **`pointer_spec` → `<Pointer>` component** (operator fills) rendered as an absolutely-positioned div sized + colored per spec; ripple uses Remotion's `interpolate(frame, [tapStart, tapStart + 0.3 * fps], [80, 160])` for the radius and `[0.6, 0]` for the opacity.
- **`caption_band` → `<CaptionBand>` component** absolutely positioned at the band's safe-area inset; text fades in/out via Remotion's `interpolate`.
- **Composition dimensions** derive from `aspect`: `9:16` → 1080×1920; `2:3` → 1080×1620; `1:1` → 1080×1080.

Both runtimes thus reach **functional parity** for app-preview output: crop scaling, mask transforms, pointer glyph + ripple, caption band, and seek-driven animation. The choice between them is operator preference (Remotion is React-component-first; HyperFrames is single-file HTML-first), not capability.

---

## Vercel AI CLI README schema (`vercel-ai-cli.md`)

Plain markdown how-to with these sections:

1. **Option A — Vercel AI CLI (`npx ai`):** copy-pasteable bash loop that iterates over `scenes/shot-*.md`, extracts the `## Visual Prompt` body, and pipes to `npx ai image generate` with the manifest's aspect
2. **Option B — Hyx / Freepik / other image-gen CLI:** instructions to adapt the loop to whatever CLI the operator has installed
3. **Option C — Manual paste (Midjourney / DALL·E / Imagen / Claude Design):** instructions to copy-paste each `## Visual Prompt` body
4. **Option D — Generative video (the generative lane):** for shots that need motion-from-prompt rather than a still, pipe the Visual Prompt through `ai video` / Higgsfield / Invideo (`render-engines.md` § Video engines) → one clip per shot. On-screen copy stays OFF the frame — it is burned in `post.md`. Stochastic: score each clip on the return-leg.
5. **Assembly section:** the final assemble → grade → subtitle stage is `post.md` (video-use / ffmpeg); this README's per-shot stills/clips feed it. (HyperFrames / Remotion render their own composition directly.)
6. **Audio (TTS) section:** points to ElevenLabs / OpenAI TTS / Coqui / Piper / macOS `say` for narration generation, references the manifest's TTS spec

**App-preview mode note.** Options A-C all describe image-generation pipelines, which do NOT apply to app-preview mode — the "visual" is a real screenshot already on disk, not a prompt for a synthesizer. When `mode: app-preview`, the Vercel AI CLI README's body collapses to a single section:

> **App-preview mode** — this bundle composes real UI screenshots from `assets.md` § Screenshots, not synthesized images. There is no image-gen step. Use the HyperFrames scaffold (`hyperframes/scaffold.html`) or the Remotion scaffold (`remotion/scaffold.tsx`) to render. The audio (TTS) section below still applies if the brief included narration.

The TTS section follows unchanged.

---

## Post-Production stage schema (`post.md`)

The terminal stage — assemble the rendered shots into the final graded, captioned export.
This is the **post lane** (`production-lanes.md`); preferred engine `video-use`
(`render-engines.md` § Video engines), fallback plain ffmpeg / DaVinci / Premiere. The stack
**never invokes the editor** — `post.md` is the spec the operator runs via the execution fork.
Plain markdown how-to, five sections:

1. **Assembly** — the shot order + per-shot source (from the manifest Shot List); cut on shot boundaries; per-shot durations sum to `length_seconds`. For real-footage shots, cut on **word boundaries** from a transcript (video-use), never mid-word.
2. **Color grade** — the look named as `brand/DESIGN.md` tokens → an ASC-CDL / `.cube` LUT. No invented colors; grade toward the brand's primary/surface, never a generic teal-orange preset.
3. **Subtitles / on-screen text** — burn the brief's **verbatim** strings (Gate 1 still applies); applied **LAST** in the filter chain, after every overlay (else overlays hide captions). Master SRT uses output-timeline offsets.
4. **Audio** — music track + ducking + narration from the manifest Audio Plan; 30ms fades at every segment boundary (else audible pops at cuts).
5. **Export** — container/codec + the manifest `aspect` → resolution; no silent aspect/duration override; preserve sRGB.

Then a **Self-verify** checklist (re-ingest the rendered cut and score *that* — the return-leg, not the spec):

- [ ] Duration == manifest `length_seconds` (no silent trim/pad)
- [ ] Aspect == manifest `aspect`
- [ ] On-screen text verbatim + legible (subtitles applied last)
- [ ] Grade reads as brand tokens, not a generic preset
- [ ] No audible pops at cuts; music ducks under narration

**Engine routing.** `video-use` (`ELEVENLABS_API_KEY` + ffmpeg) does transcribe → word-boundary cut → grade → subtitle → self-verify in one pass. No key → assemble + caption with plain ffmpeg, or hand the spec to DaVinci / Premiere / Final Cut.

**App-preview mode.** Post collapses to assembly + caption burn-in only: there is no spoken footage to transcribe (unless the brief supplied narration), and the "shots" are already-composed screenshot crops from the HyperFrames/Remotion scaffold. Grade is usually a no-op (the UI is already on-brand); subtitles are the caption-band text, burned last.

---

## Field semantics

### Manifest

| Field | Type | Mode | Notes |
|---|---|---|---|
| `skill` | kebab-case | both | Always `produce-video` |
| `version` | integer | both | Artifact version (increment on `--rev=N` re-run) |
| `date` | ISO YYYY-MM-DD | both | Original creation date; do not update on edits in place |
| `status` | enum | both | `done` / `done_with_concerns` / `blocked` / `needs_context` per Completion Status Protocol |
| `mode` | enum | both | `shortform` or `app-preview`; required from WS4 onward |
| `slug` | kebab-case | both | Matches upstream brief slug |
| `source_brief` | project-relative path | both | The brief-shortform hero/variant; OR hand-written video-brief; OR app-preview's `handoff-produce-video.md` |
| `target_platforms` | list of strings | shortform | Subset of platforms the brief defined |
| `surface` | enum | app-preview | One of `app-store` / `onboarding` / `website` / `social`; replaces `target_platforms` |
| `aspect` | string | both | One of `9:16` / `1:1` / `16:9` / `4:5` / `custom-WxH`; app-preview also accepts `2:3` |
| `length_seconds` | integer | both | Total video length; per-shot durations sum to this exactly |
| `shot_count` | integer | both | Number of files under `scenes/` |
| `cta` | string | both | Exact CTA copy from brief; appears verbatim in final shot. App-preview may be `(none)` |
| `brand_source` | enum | app-preview | `brand-md` or `cold-start-hint`; pinned in Concerns when cold-start |
| `provenance` | block (generation variant) | both | Required per D8 contract; see `references/_shared/artifact-contract-template.md` |

### Per-shot prompt

| Field | Type | Mode | Notes |
|---|---|---|---|
| `skill` | kebab-case | both | Always `produce-video` |
| `version` | integer | both | Mirrors manifest version |
| `date` | ISO YYYY-MM-DD | both | Same as manifest |
| `mode` | enum | both | Mirrors manifest.mode |
| `shot_id` | kebab-case | both | Stable identifier: `shot-1`, `shot-2`, ... |
| `shot_index` | integer | both | 1-based index matching shot_id suffix |
| `duration_seconds` | number | both | Per-shot duration; sums across all shots = manifest.length_seconds |
| `platform` | kebab-case | shortform | Primary target platform from manifest |
| `surface` | enum | app-preview | App-preview surface from manifest; replaces `platform` |
| `source_screenshot` | project-relative path | app-preview | Path to the source UI screenshot (must exist on disk) |
| `crop_rect` | `[x,y,w,h]` ints \| selector string | app-preview | Source-pixel rect OR named component selector |
| `mask_transform` | enum | app-preview | `static` / `crossfade-in-place` / `hard-cut` / `mask-expand` / `mask-contract` / `composite` |
| `interaction_verb` | enum | app-preview | One of the 10 canonical verbs from `brief-app-preview/references/interaction-grammar.md` § 1 |
| `pointer_spec` | object \| `none` | app-preview | Pointer style + color + position + ripple, OR literal `none` for non-pointer beats |

---

## Required body sections (cross-stack contract)

In order. Renaming or reordering breaks downstream consumers + critic. Both modes share the 9 / 8 section spines below; app-preview differences are noted inline.

### Manifest

1. **Header block** (Source brief / Mode / Target platforms or Surface / Aspect / Length / Shot count / CTA / Status / Brand source [app-preview]) **+ a `**Why this works**` opening framing** per [`_shared/why-this-works-convention.md`](_shared/why-this-works-convention.md): the bet (falsifiable) + 2-4 load-bearing script choices traced to a product-fit source (the brief's `## What This Brief Bets On`, `ICP.md`, `PRODUCT-CONTEXT.md`) — Competitor-Swap-clean, carried through from brief-shortform, never fabricated. Placed in the opening (the convention's brief-style exception) so the rationale layer rides section 1 and the reorder-sensitive 9-section spine is unchanged — not a new H2.
2. **Concerns** (always pinned at top when `brand_source: cold-start-hint`; otherwise only when status is done_with_concerns)
3. **Shot List** — shortform: 6 columns (Shot / Duration / Visual / On-Screen Text / Voice / Asset Prompt File). App-preview: 10 columns (Shot / Duration / Visual / On-Screen Text / Voice / Asset Prompt File / Source Screenshot / Crop Rect / Mask Transform / Interaction Verb)
4. **Audio Plan** — Music + TTS spec block (shortform); per-beat audio table (app-preview, TTS optional)
5. **Caption + Hashtags** (platform-side metadata; app-preview may omit hashtags since the surface is non-social)
6. **Verification Checklist** — shortform: 5 gates per shot. App-preview: 5 different gates per shot (aspect / duration / crop fidelity / pointer color / caption-band geometry)
7. **Runtime Choices** (recommended-lane line + numbered list of 5 production lanes shortform; app-preview narrows to lanes 1 code-render + 5 post, with explainer/generative/avatar marked non-applicable — visuals are real screenshots)
8. **Re-run** (1-line note on `--rev=N` semantics)
9. **Operator Next Steps** (numbered list)

### Per-shot prompt

1. **Visual Prompt** — shortform: renderer-agnostic synthesis prompt body. App-preview: composition operation (source + crop + mask transform + interaction overlay); no synthesis prompt.
2. **On-Screen Text (verbatim)**
3. **Voice / Narration** (or "none"; app-preview defaults to "none" unless brief supplied narration)
4. **Audio (this shot)**
5. **Brand Tokens (verbatim)** — app-preview MUST cite pointer color + caption-band background; `(cold-start-sampled)` token name allowed when `brand_source: cold-start-hint`
6. **Anti-Patterns (DO NOT list)**
7. **Renderer Hints** — shortform: optional. **App-preview: REQUIRED** (both Remotion + HyperFrames hints populated; runtime needs crop/mask/pointer semantics regardless of operator's runtime choice)
8. **Change Log** (cycle 2+ only)

---

## Path safety

- Slugs must be kebab-case, `^[a-z0-9][a-z0-9-]{0,79}$`.
- Shot IDs must match `^shot-\d+$` with 1-based numbering.
- No path traversal in any field. Manifest's `source_brief` accepts only project-relative paths.

## Date / Aspect / Resolution conventions

- Date: ISO `YYYY-MM-DD` in frontmatter; same format in body text.
- Aspect: `W:H` form with no spaces; resolution implied from platform (e.g., `9:16` → 1080×1920 for short-form).
- Hex: 6-character lowercase with `#` prefix (`#74b36b`, not `#74B36B` or `74b36b`).
- Duration: integer or one-decimal float (e.g., `2.5s`); no zero-padding.
- Words-per-second cap (Gate 3): `3.0` exactly; per-shot only.
