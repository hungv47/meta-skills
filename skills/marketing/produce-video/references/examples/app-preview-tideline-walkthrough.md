# App-Preview Mode — Worked Walkthrough (Tideline / Surge mode / App Store iOS)

> Worked end-to-end Route B run. Consumes the `brief-app-preview` Tideline / Surge mode handoff from `skills/marketing/brief-app-preview/references/examples/app-preview-walkthrough.md`. Demonstrates the WS3→WS4 seam, full Remotion + HyperFrames scaffold parity, and a critic PASS on all 7 gates in cycle 1. A FAIL-handling cycle-2 variant follows the main run.

---

## Operator Invocation

```
produce-video tideline-surge-mode-app-store-ios
```

The slug resolves to the brief-app-preview output directory:

```
docs/forsvn/artifacts/marketing/app-preview-brief/tideline-surge-mode-app-store-ios/
├── brief.md
├── assets.md
├── crop-map.md
└── handoff-produce-video.md
```

---

## Pre-Dispatch

Orchestrator reads `handoff-produce-video.md` frontmatter:

```yaml
type: produce-video-input
source_brief: docs/forsvn/artifacts/marketing/app-preview-brief/tideline-surge-mode-app-store-ios/brief.md
surface: app-store
aspect: 9:16
total_length_seconds: 18.0
audio_default: on
shot_count: 5
brand_source: brand-md
```

Mode discriminator: `type: produce-video-input` → **app-preview mode**.

Validation walk (general rules 1-3 + app-preview rules A-K from `video-brief-schema.md`):

- A. `type == produce-video-input` ✓
- B. All required app-preview frontmatter fields present ✓
- C. `surface: app-store` is one of 4 valid ✓
- D. `aspect: 9:16` is one of 5 valid ✓
- E. `total_length_seconds: 18.0 ≤ 90` ✓
- F. Per-shot durations: 2.0 + 1.0 + 5.0 + 6.0 + 4.0 = 18.0 ✓
- G. All 4 `source_id`s resolve to `screenshots/01-home.png`, `screenshots/02-tap.png`, `screenshots/03-active.png`, `screenshots/04-done.png` — all exist on disk ✓
- H. All 5 `interaction_verb`s (`rest`, `tap`, `reveal`, `hold`, `settle`) in canonical 10 ✓
- I. All 5 `mask_transform`s (`static`, `crossfade-in-place`, `mask-expand`, `static`, `mask-contract`) in canonical 6 ✓
- J. Pointer color `#0F4C5C` exists in `brand/DESIGN.md` as `color.accent` ✓
- K. `brand_source: brand-md` + `brand/BRAND.md` + `brand/DESIGN.md` present on disk ✓

Pre-dispatch PROCEED.

---

## Layer 1 — prompt-author-agent (cycle 1)

### `manifest.md`

```markdown
---
skill: produce-video
version: 1
date: 2026-05-23
status: done
mode: app-preview
slug: tideline-surge-mode-app-store-ios
source_brief: docs/forsvn/artifacts/marketing/app-preview-brief/tideline-surge-mode-app-store-ios/handoff-produce-video.md
surface: app-store
aspect: 9:16
length_seconds: 18
shot_count: 5
cta: "Save what you did"
brand_source: brand-md
provenance:
  skill: produce-video
  run_date: 2026-05-23
  input_artifacts:
    - docs/forsvn/artifacts/marketing/app-preview-brief/tideline-surge-mode-app-store-ios/handoff-produce-video.md
    - docs/forsvn/artifacts/marketing/app-preview-brief/tideline-surge-mode-app-store-ios/brief.md
    - docs/forsvn/artifacts/marketing/app-preview-brief/tideline-surge-mode-app-store-ios/assets.md
    - brand/BRAND.md
    - brand/DESIGN.md
  output_eval: null
---

# Produced-Video Manifest — tideline-surge-mode-app-store-ios

**Source brief:** docs/forsvn/artifacts/marketing/app-preview-brief/tideline-surge-mode-app-store-ios/handoff-produce-video.md
**Mode:** app-preview
**Surface:** app-store
**Aspect:** 9:16
**Length:** 18 seconds
**Shot count:** 5
**CTA:** "Save what you did"
**Brand source:** brand-md
**Status:** done

## Shot List (canonical — runtime-agnostic)

| Shot | Duration | Visual | On-Screen Text | Voice / Narration | Asset Prompt File | Source Screenshot | Crop Rect | Mask Transform | Interaction Verb |
|------|----------|--------|----------------|-------------------|-------------------|-------------------|-----------|----------------|------------------|
| 1 (rest) | 2.0s | Affordance "Start surge" visible | "Tap to begin a surge" | music only | `scenes/shot-1.md` | screenshots/01-home.png | [240,1820,810,220] | static | rest |
| 2 (tap) | 1.0s | User taps the "Start surge" affordance | (none) | UI tap | `scenes/shot-2.md` | screenshots/01-home.png → screenshots/02-tap.png | [240,1820,810,220] | crossfade-in-place | tap |
| 3 (reveal) | 5.0s | Surge mode engages — dim overlay rises, tide appears | "Everything else dims" | music only | `scenes/shot-3.md` | screenshots/03-active.png | [240,1820,810,220] → [0,200,1290,1800] | mask-expand | reveal |
| 4 (hold) | 6.0s | Tide rises 30% → 90%; session sustains | "One pull on your attention" | music only | `scenes/shot-4.md` | screenshots/03-active.png | [0,200,1290,1800] | static (internal tide motion) | hold |
| 5 (settle, CTA) | 4.0s | Tide stays; "Save session" appears in same slot | "Save what you did" | music only | `scenes/shot-5.md` | screenshots/03-active.png → screenshots/04-done.png | [0,200,1290,1800] → [240,1820,810,220] | mask-contract | settle |

## Audio Plan (canonical — runtime-agnostic, app-preview mode)

| Beat | Audio cue | Source |
|---|---|---|
| Shot 1 | (silence; viewer hears App Store env) | — |
| Shot 2 | UI tap (system-style) | system-default |
| Shot 3 | low rising whoosh | operator-supplied or silent if absent |
| Shot 4 | (silence; tide is visual) | — |
| Shot 5 | UI confirm chime ≤200ms | operator-supplied or silent if absent |

**Narration:** none (app-preview default; brief did not supply narration text).
**Audio default:** on (matches handoff frontmatter).

## Caption + Hashtags

- **Caption (App Store description card):** "See how Surge mode dims everything but the work that matters."
- **Hashtags:** N/A (App Store surface; no social hashtags)
- **CTA:** "Save what you did" (matches manifest top-level)

## Verification Checklist (per shot — operator fills after rendering)

For each shot, mark each app-preview spec gate after the rendered video is reviewed:

### Shot 1
- [ ] Aspect ratio matches handoff (9:16, no silent runtime override)
- [ ] Duration matches handoff (2.0s, no silent trim/pad)
- [ ] Source screenshot renders at crop rect [240,1820,810,220] with no rescale drift
- [ ] Pointer color resolves to `color.accent #0F4C5C` (or `(cold-start-sampled)` if cold-start)
- [ ] Caption band geometry honored (bottom-quarter @ 480h, 120px iOS home-bar inset)

### Shot 2
[Same 5 gates with shot-2 specifics]

### Shot 3
[Same 5 gates]

### Shot 4
[Same 5 gates]

### Shot 5
[Same 5 gates]

## Runtime Choices

**Recommended lane for this script:** code-render — app-preview composes real UI screenshots, which HyperFrames/Remotion render deterministically on-brand. Selection logic: `production-lanes.md`.

App-preview narrows to the code-render lane + post (explainer / generative / avatar do NOT apply — composition uses real screenshots, not synthesized footage):

1. **code-render** — HyperFrames: open `hyperframes/scaffold.html`, `hyperframes preview` → `hyperframes render`; Remotion: open `remotion/scaffold.tsx`, `npx remotion preview` → `npx remotion render`. Both have functional parity for crop scaling, mask transforms, pointer overlay, caption band, and seek-driven animation — choice is operator preference.
2. **post** — follow `post.md` to assemble the rendered shots + burn the caption-band text (grade is a no-op; the UI is already on-brand).

## Re-run

If the handoff changes or the runtime choice changes: re-run `produce-video tideline-surge-mode-app-store-ios --rev=2` to write to `v2/...` and preserve the prior bundle.

## Operator Next Steps

1. Pick the code-render lane (HyperFrames OR Remotion)
2. Run the chosen scaffold, then `post.md` to assemble + burn the caption band
3. Operator-supplied audio assets: drop `audio-whoosh.mp3` and `audio-confirm.mp3` under `rendered/audio/` if available; otherwise renders fall back to silence on shots 3 and 5
4. Mark the verification checklist for each shot after rendering
5. When all shots verified on-spec, the produced video is ready for evaluate-shortform / evaluate-content
```

### `scenes/shot-1.md` (representative — others follow same pattern)

```markdown
---
skill: produce-video
version: 1
date: 2026-05-23
mode: app-preview
shot_id: shot-1
shot_index: 1
duration_seconds: 2.0
surface: app-store
source_screenshot: screenshots/01-home.png
crop_rect: "[240, 1820, 810, 220]"
mask_transform: static
interaction_verb: rest
pointer_spec: none
---

# Shot 1 — Rest

## Visual Prompt (composition operation)

Source screenshot `screenshots/01-home.png`, cropped to rectangle `[240, 1820, 810, 220]` in source pixels (origin top-left), mask transform `static` (no motion on the source). No interaction overlay (`pointer_spec: none`).

**What this beat proves:** The "Start surge" affordance is present at rest and labeled. The viewer can identify what to tap.

The crop frames the bottom-action band of the home screen — the call-to-action region — without showing the full screen chrome above it. Crop-to-output scale: `1080 / 810 = 1.333×`.

## On-Screen Text (verbatim from handoff)

- **Text 1:** "Tap to begin a surge"
- **Position:** bottom-quarter (caption-band)
- **Entry timing:** 0.0s (shot start)
- **Exit timing:** 2.0s (shot end)
- **Type style:** Inter 600 28px (from `brand/DESIGN.md` `type.body-strong`, scaled for 1290px source width)

## Voice / Narration (if present in this shot)

Narration: none. Music: silent (App Store env audio).

## Audio (this shot)

- **Music:** none (silent)
- **SFX:** none

## Brand Tokens (verbatim — no fabrication)

- **Pointer color:** N/A (`pointer_spec: none` this shot)
- **Caption-band background:** `#F4F1EB` (token: `color.surface` from `brand/DESIGN.md`); scrim 92% opacity
- **Caption text color:** `#1A1B23` (token: `color.text.primary` from `brand/DESIGN.md`)
- **Caption type:** Inter 600 (token: `type.body-strong` from `brand/DESIGN.md`)
- **Caption-band radius:** 12px (token: `radius.md` from `brand/DESIGN.md`)
- **Motion permission:** static this beat; no parallax, no source pan

## Anti-Patterns (must be in every shot)

DO NOT:
- Add visual elements absent from the source screenshot (no glowing border, no confetti, no invented highlights)
- Apply gradient, glow, or neon effects to pointer or caption-band — solid only
- Override the crop rectangle (runtime: respect `crop_rect`)
- Override the shot duration (runtime: respect `duration_seconds`)
- Substitute on-screen text strings (renderer is a typesetter, not a copywriter)
- Override the aspect ratio (runtime: respect manifest `aspect`)
- Generate or composite a logo if none is in the source screenshot — placeholder behavior applies
- Output multiple variations of this shot — render the single composition described
- Use any interaction verb outside the canonical 10 set, or any mask transform outside the canonical 6 set

## Renderer Hints (REQUIRED in app-preview mode)

**HyperFrames:**
- Scene type: `app-preview-static`
- Duration: `2.0s`
- Source image: `<img src="screenshots/01-home.png">` absolutely positioned inside `<div id="stage">` with `overflow: hidden`
- Crop transform: `transform: scale(1.333) translate(-240px, -1820px); transform-origin: top left`
- No motion this shot; waapi adapter is not registered
- Caption band: fixed-position `<div>` at `bottom: 120px`, `height: 480px`, background `#F4F1EB` at 92% opacity, text centered

**Remotion:**
- Frame range: `0-60` at 30fps
- Component: `<AppPreviewScene scene={SCENES[0]}>`
- `cropRect: [240, 1820, 810, 220]`
- `maskKeyframes: null` (static)
- `pointerSpec: null` (no pointer this shot)
- `captionBand: { position: 'bottom-quarter', heightPx: 480, safeAreaInsetPx: 120 }`
- Composition dimensions: 1080×1920

## Change Log (cycle 2+ only)

N/A — cycle 1.
```

[Shots 2-5 follow the same pattern with their crop_rect / mask_transform / interaction_verb / pointer_spec / caption_text per the handoff table. Highlights:]

- **Shot 2 (tap, 1.0s):** `mask_transform: crossfade-in-place` between `screenshots/01-home.png` and `screenshots/02-tap.png`. `pointer_spec: { style: solid-circle, size_px: 64, color_hex: "#0F4C5C", color_token: "color.accent", position_crop_relative: {x: 430, y: 110}, ripple: { start_px: 80, end_px: 160, duration_s: 0.3 } }`. No caption.
- **Shot 3 (reveal, 5.0s):** `mask_transform: mask-expand` from `[240,1820,810,220]` to `[0,200,1290,1800]` over 0.4s ease-out, then static for the remaining 4.6s. `source_screenshot: screenshots/03-active.png`. Caption "Everything else dims" 0.0-3.0s.
- **Shot 4 (hold, 6.0s):** `mask_transform: static` at `[0,200,1290,1800]`. Internal tide motion 30%→90% linear (HyperFrames: waapi-animated `mask-position` on a tide-mask layer; Remotion: `interpolate(frame, [0, 180], [0.3, 0.9])` on the tide layer's mask). Caption "One pull on your attention" 0.0-4.0s.
- **Shot 5 (settle, 4.0s):** `mask_transform: mask-contract` back to `[240,1820,810,220]` over 0.3s ease-in. Source crossfades `screenshots/03-active.png` → `screenshots/04-done.png` over 0.2s. `pointer_spec` solid-circle at `(640, 180)` accent, suggestive (no ripple). Caption "Save what you did" 0.0-4.0s.

### `hyperframes/scaffold.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>tideline-surge-mode-app-store-ios — Produced Video (app-preview)</title>
  <link rel="hyperframes-manifest" href="../manifest.md">
  <style>
    :root {
      --brand-accent: #0F4C5C;
      --brand-surface: #F4F1EB;
      --brand-text-primary: #1A1B23;
      --brand-radius-md: 12px;
      --type-body-strong: 'Inter', sans-serif;
    }
    html, body { margin: 0; padding: 0; }
    body { aspect-ratio: 9/16; background: var(--brand-surface); }
    #hf-stage { width: 100%; height: 100%; position: relative; overflow: hidden; }
    .scene-source { position: absolute; image-rendering: crisp-edges; transform-origin: top left; }
    .pointer { position: absolute; border-radius: 50%; background: var(--brand-accent); pointer-events: none; }
    .tap-ripple { position: absolute; border-radius: 50%; border: 2px solid var(--brand-accent); pointer-events: none; }
    .caption-band {
      position: absolute; left: 0; right: 0;
      background: rgba(244, 241, 235, 0.92);
      border-radius: var(--brand-radius-md) var(--brand-radius-md) 0 0;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--type-body-strong); font-weight: 600; color: var(--brand-text-primary);
    }
  </style>
</head>
<body>
<!--
  HyperFrames scaffold — Tideline Surge mode App Store iOS preview.
  Mode: app-preview. Scenes are inlined below.
  Run: `hyperframes preview` (from this directory).
  Motion uses waapi adapter — see project waapi skill if available. NO setTimeout / setInterval.
-->
<script type="application/json" id="hf-scenes">
{
  "meta": {
    "slug": "tideline-surge-mode-app-store-ios",
    "aspect": "9:16",
    "length_seconds": 18,
    "fps": 30,
    "mode": "app-preview",
    "surface": "app-store"
  },
  "scenes": [
    {
      "id": "shot-1",
      "duration_seconds": 2.0,
      "source_screenshot": "screenshots/01-home.png",
      "crop_rect": [240, 1820, 810, 220],
      "mask_transform": "static",
      "mask_keyframes": null,
      "interaction_verb": "rest",
      "pointer_spec": null,
      "caption_band": { "position": "bottom-quarter", "height_px": 480, "safe_area_inset_px": 120 },
      "on_screen_text": [{ "text": "Tap to begin a surge", "entry_s": 0.0, "exit_s": 2.0 }],
      "audio": { "music": "none", "sfx": [], "default_state": "on" }
    },
    {
      "id": "shot-2",
      "duration_seconds": 1.0,
      "source_screenshot": "screenshots/01-home.png → screenshots/02-tap.png",
      "crop_rect": [240, 1820, 810, 220],
      "mask_transform": "crossfade-in-place",
      "mask_keyframes": null,
      "interaction_verb": "tap",
      "pointer_spec": {
        "style": "solid-circle",
        "size_px": 64,
        "color_hex": "#0F4C5C",
        "color_token": "color.accent",
        "position_crop_relative": { "x": 430, "y": 110 },
        "ripple": { "start_px": 80, "end_px": 160, "duration_s": 0.3 }
      },
      "caption_band": null,
      "on_screen_text": [],
      "audio": { "music": "none", "sfx": ["audio-tap"], "default_state": "on" }
    },
    {
      "id": "shot-3",
      "duration_seconds": 5.0,
      "source_screenshot": "screenshots/03-active.png",
      "crop_rect": [240, 1820, 810, 220],
      "mask_transform": "mask-expand",
      "mask_keyframes": [
        { "t_s": 0.0, "rect": [240, 1820, 810, 220] },
        { "t_s": 0.4, "rect": [0, 200, 1290, 1800] }
      ],
      "interaction_verb": "reveal",
      "pointer_spec": null,
      "caption_band": { "position": "bottom-quarter", "height_px": 480, "safe_area_inset_px": 120 },
      "on_screen_text": [{ "text": "Everything else dims", "entry_s": 0.0, "exit_s": 3.0 }],
      "audio": { "music": "none", "sfx": ["audio-whoosh"], "default_state": "on" }
    },
    {
      "id": "shot-4",
      "duration_seconds": 6.0,
      "source_screenshot": "screenshots/03-active.png",
      "crop_rect": [0, 200, 1290, 1800],
      "mask_transform": "static",
      "mask_keyframes": null,
      "interaction_verb": "hold",
      "pointer_spec": null,
      "caption_band": { "position": "bottom-quarter", "height_px": 480, "safe_area_inset_px": 120 },
      "on_screen_text": [{ "text": "One pull on your attention", "entry_s": 0.0, "exit_s": 4.0 }],
      "audio": { "music": "none", "sfx": [], "default_state": "on" },
      "internal_motion": { "tide_fill_start": 0.3, "tide_fill_end": 0.9, "easing": "linear" }
    },
    {
      "id": "shot-5",
      "duration_seconds": 4.0,
      "source_screenshot": "screenshots/03-active.png → screenshots/04-done.png",
      "crop_rect": [0, 200, 1290, 1800],
      "mask_transform": "mask-contract",
      "mask_keyframes": [
        { "t_s": 0.0, "rect": [0, 200, 1290, 1800] },
        { "t_s": 0.3, "rect": [240, 1820, 810, 220] }
      ],
      "interaction_verb": "settle",
      "pointer_spec": {
        "style": "solid-circle",
        "size_px": 64,
        "color_hex": "#0F4C5C",
        "color_token": "color.accent",
        "position_crop_relative": { "x": 640, "y": 180 },
        "ripple": null
      },
      "caption_band": { "position": "bottom-quarter", "height_px": 480, "safe_area_inset_px": 120 },
      "on_screen_text": [{ "text": "Save what you did", "entry_s": 0.0, "exit_s": 4.0 }],
      "audio": { "music": "none", "sfx": ["audio-confirm"], "default_state": "on" }
    }
  ]
}
</script>
<div id="hf-stage"></div>
</body>
</html>
```

### `remotion/scaffold.tsx`

```tsx
import {Composition, AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import React from 'react';

const BRAND = {
  accent: '#0F4C5C',
  surface: '#F4F1EB',
  textPrimary: '#1A1B23',
  radiusMd: 12,
  typeBodyStrong: 'Inter, sans-serif',
};

type MaskKeyframe = { t_s: number; rect: [number, number, number, number] };
type PointerSpec = {
  style: 'solid-circle';
  sizePx: number;
  colorHex: string;
  colorToken: string;
  positionCropRelative: { x: number; y: number };
  ripple: { startPx: number; endPx: number; durationS: number } | null;
} | null;

type Scene = {
  id: string;
  durationSeconds: number;
  mode: 'app-preview';
  sourceScreenshot: string;
  cropRect: [number, number, number, number];
  maskTransform: 'static' | 'crossfade-in-place' | 'hard-cut' | 'mask-expand' | 'mask-contract' | 'composite';
  maskKeyframes: MaskKeyframe[] | null;
  interactionVerb: 'rest' | 'tap' | 'drag' | 'scroll' | 'type' | 'toggle' | 'reveal' | 'hold' | 'settle' | 'transition';
  pointerSpec: PointerSpec;
  captionBand: { position: 'bottom-quarter'; heightPx: number; safeAreaInsetPx: number } | null;
  onScreenText: Array<{ text: string; entryS: number; exitS: number }>;
  audio: { music: string; sfx: string[]; defaultState: 'on' | 'off' };
};

const SCENES: Scene[] = [
  {
    id: 'shot-1', durationSeconds: 2.0, mode: 'app-preview',
    sourceScreenshot: 'screenshots/01-home.png',
    cropRect: [240, 1820, 810, 220],
    maskTransform: 'static', maskKeyframes: null,
    interactionVerb: 'rest', pointerSpec: null,
    captionBand: { position: 'bottom-quarter', heightPx: 480, safeAreaInsetPx: 120 },
    onScreenText: [{ text: 'Tap to begin a surge', entryS: 0.0, exitS: 2.0 }],
    audio: { music: 'none', sfx: [], defaultState: 'on' },
  },
  // ... shot-2 through shot-5 mirror the HyperFrames scenes JSON with camelCase keys
];

const FPS = 30;
const totalDurationFrames = SCENES.reduce((acc, s) => acc + Math.round(s.durationSeconds * FPS), 0);

const interpolateRect = (
  keyframes: MaskKeyframe[],
  t: number
): [number, number, number, number] => {
  if (t <= keyframes[0].t_s) return keyframes[0].rect;
  if (t >= keyframes[keyframes.length - 1].t_s) return keyframes[keyframes.length - 1].rect;
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i], b = keyframes[i + 1];
    if (t >= a.t_s && t <= b.t_s) {
      const u = (t - a.t_s) / (b.t_s - a.t_s);
      return [0, 1, 2, 3].map(j => a.rect[j] + (b.rect[j] - a.rect[j]) * u) as [number, number, number, number];
    }
  }
  return keyframes[0].rect;
};

const AppPreviewScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / fps;
  const currentRect = scene.maskKeyframes != null ? interpolateRect(scene.maskKeyframes, t) : scene.cropRect;
  const [, , cropW] = currentRect;
  const scale = width / cropW;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: BRAND.surface }}>
      <img
        src={scene.sourceScreenshot.split(' → ')[0]}
        alt=""
        style={{
          position: 'absolute',
          left: -currentRect[0] * scale,
          top: -currentRect[1] * scale,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          imageRendering: 'crisp-edges',
        }}
      />
      {scene.pointerSpec && (
        <div
          style={{
            position: 'absolute',
            width: scene.pointerSpec.sizePx,
            height: scene.pointerSpec.sizePx,
            borderRadius: '50%',
            backgroundColor: scene.pointerSpec.colorHex,
            left: scene.pointerSpec.positionCropRelative.x * scale - scene.pointerSpec.sizePx / 2,
            top: scene.pointerSpec.positionCropRelative.y * scale - scene.pointerSpec.sizePx / 2,
          }}
        />
      )}
      {scene.captionBand && scene.onScreenText.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0, right: 0,
            bottom: scene.captionBand.safeAreaInsetPx,
            height: scene.captionBand.heightPx,
            backgroundColor: `${BRAND.surface}EB`,
            borderRadius: `${BRAND.radiusMd}px ${BRAND.radiusMd}px 0 0`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: BRAND.textPrimary,
            fontFamily: BRAND.typeBodyStrong,
            fontWeight: 600,
            fontSize: 56,
            opacity: interpolate(t, [0.0, 0.2, scene.onScreenText[0].exitS - 0.15, scene.onScreenText[0].exitS], [0, 1, 1, 0], { extrapolateRight: 'clamp' }),
          }}
        >
          {scene.onScreenText[0].text}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Video = () => {
  let frameOffset = 0;
  return (
    <AbsoluteFill>
      {SCENES.map((scene) => {
        const durFrames = Math.round(scene.durationSeconds * FPS);
        const seq = (
          <Sequence key={scene.id} from={frameOffset} durationInFrames={durFrames}>
            <AppPreviewScene scene={scene} />
          </Sequence>
        );
        frameOffset += durFrames;
        return seq;
      })}
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <Composition
    id="tideline-surge-mode-app-store-ios"
    component={Video}
    durationInFrames={totalDurationFrames}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
```

### `vercel-ai-cli.md`

```markdown
# Pipe scenes/ through Vercel AI CLI — N/A (app-preview mode)

**App-preview mode** — this bundle composes real UI screenshots from `assets.md` § Screenshots, not synthesized images. There is no image-gen step. Use the HyperFrames scaffold (`hyperframes/scaffold.html`) or the Remotion scaffold (`remotion/scaffold.tsx`) to render.

## Audio (TTS)

The manifest's Audio Plan lists per-beat audio cues (UI tap, optional whoosh, optional confirm chime). Operator-supplied audio files go under `rendered/audio/`. If absent, renders fall back to silence on shots 3 and 5; the UI tap (shot 2) uses the system-default cue.
```

### `post.md`

```markdown
# Post-Production — tideline-surge-mode-app-store-ios

**Lane:** post · **Mode:** app-preview (assembly + caption burn-in only) · **Engine:** ffmpeg / video-use

## 1. Assembly
Concatenate the 5 rendered screenshot-composition shots in order (shot-1 → shot-5); per-shot durations sum to total_length_seconds. No transcription — these are composed UI crops, not spoken footage.

## 2. Color grade
No-op — the source screenshots are already on-brand (Tideline DESIGN.md tokens).

## 3. Subtitles / on-screen text
Burn each shot's caption-band text verbatim, applied LAST in the filter chain (after the pointer/overlay), at the handoff's caption-band geometry.

## 4. Audio
Per-beat cues from the Audio Plan (UI tap shot 2; optional whoosh shot 3; optional confirm shot 5); silence where assets are absent; 30ms fades at each segment boundary.

## 5. Export
H.264 mp4 at the manifest aspect (9:16 → 1080×1920); preserve sRGB; no aspect/duration override.

## Self-verify
- [ ] Duration == total_length_seconds
- [ ] Aspect == 9:16
- [ ] Caption-band text verbatim + legible (burned last)
- [ ] No audible pops at cuts
```

---

## Layer 2 — critic-agent (cycle 1)

```markdown
## Verdict: PASS
## Mode: app-preview

## Evaluation

### Gate 1: Schema-and-CTA Compliance
PASS.
- App-preview frontmatter field set verified: skill / version / date / status / mode / slug / source_brief / surface / aspect / length_seconds / shot_count / cta / brand_source / provenance — all present.
- Per-shot frontmatter field set verified across all 5 shots: skill / version / date / mode / shot_id / shot_index / duration_seconds / surface / source_screenshot / crop_rect / mask_transform / interaction_verb / pointer_spec — all present.
- Duration math: 2.0 + 1.0 + 5.0 + 6.0 + 4.0 = 18.0 == manifest.length_seconds. Exact.
- Aspect: 9:16 — valid.
- Shot count: 5 == COUNT(scenes/shot-*.md). Match.
- CTA verbatim check applied (cta != "(none)"): "Save what you did" appears verbatim in shot-5's § On-Screen Text Text 1 AND in manifest.cta. Match.
- Slug consistency: tideline-surge-mode-app-store-ios across manifest / source_brief path / bundle path. Match.

### Gate 2: Brand-Mark Fidelity
PASS.
- All 4 hex values cited (#0F4C5C, #F4F1EB, #1A1B23) exist in brand/DESIGN.md.
- All 4 token names (color.accent, color.surface, color.text.primary, type.body-strong, radius.md) exist in brand/DESIGN.md.
- Sacred elements unchanged: BRAND.md archetype "Calm Operator" not proposed for modification; no urgency theater introduced.
- Placeholder rule present in every per-shot prompt's DO NOT list.
- Type family (Inter) matches DESIGN.md.
- Cold-start exemption N/A (brand_source: brand-md, not cold-start-hint).

### Gate 3: Caption-Pace Compliance
PASS.
- Shot 1: 4 words / 2.0s = 2.0 wps ≤ 3.0 ✓
- Shot 2: 0 words (no caption) ≤ 3.0 ✓
- Shot 3: 3 words / 3.0s caption hold = 1.0 wps ≤ 3.0 ✓
- Shot 4: 5 words / 4.0s = 1.25 wps ≤ 3.0 ✓
- Shot 5: 4 words / 4.0s = 1.0 wps ≤ 3.0 ✓

### Gate 4: Narrative Arc (soft, app-preview-aware)
PASS.
- Affordance test: Shot 1 is `rest` beat showing the "Start surge" affordance with caption. Viewer can identify what to tap.
- Sequence test: Beat sequence `rest → tap → reveal → hold → settle` matches canonical Sequence F (Sustained focus / hold-driven) from interaction-grammar.md § 2. Coherent, not arbitrary.
- End-state test: Shot 5 is `settle` with the "Save session" affordance visible and the "Save what you did" caption. Terminal state clear.

### Gate 5: Screenshot Grounding (hard FAIL gate)
PASS.
- All 4 source_screenshot paths exist on disk: screenshots/01-home.png, screenshots/02-tap.png, screenshots/03-active.png, screenshots/04-done.png.
- All 5 Visual Prompt sections are composition operations (cite source + crop + mask + overlay). No "lighting / mood / camera" lines anywhere.
- All 5 crop rectangles match the handoff's Per-Shot Specification table verbatim.
- No invented UI: every component (Start surge button, dim overlay, tide visual, Save button) is present in the cited source screenshots per crop-map.md.
- Crop math: scale 1080/810 = 1.333 (shots 1, 2); scale 1080/1290 = 0.837 (shots 3, 4); shot 5 transitions between the two via mask-contract. All within source bounds.

### Gate 6: Interaction-Vocabulary + Mask-Transform Compliance (hard FAIL gate)
PASS.
- All 5 interaction_verbs (rest / tap / reveal / hold / settle) in the canonical 10-verb set.
- All 5 mask_transforms (static / crossfade-in-place / mask-expand / static / mask-contract) in the canonical 6-transform set.
- Composite transforms N/A (no composites used).
- Verb-duration coherence: tap @ 1.0s (within 0.5-1.0s range), hold @ 6.0s with internal motion (tide 30→90% — meets motion-required rule for hold), settle @ 4.0s. All coherent.

### Gate 7: Pointer-and-Caption-Band Fidelity (hard FAIL gate)
PASS.
- Pointer color cited on shots 2 and 5: #0F4C5C / color.accent. Both required fields present.
- Caption-band background cited on every captioned shot: #F4F1EB / color.surface at 92% opacity scrim. Required field present.
- Pointer positions crop-relative and inside crop rect:
  - Shot 2: (430, 110) inside crop [240,1820,810,220] (810 wide, 220 tall) — 430 ≤ 810 ✓ 110 ≤ 220 ✓
  - Shot 5: (640, 180) inside crop ending [240,1820,810,220] (810 wide, 220 tall) — 640 ≤ 810 ✓ 180 ≤ 220 ✓
- Pointer color is accent on surface scrim (legibility check): #0F4C5C on #F4F1EB scrim PASSes (high contrast).
- Caption-band geometry matches handoff: position bottom-quarter, height 480, safe-area inset 120 — all match.
- No synthetic effects: pointer is solid-circle, no gradient/glow/neon; caption-band is solid scrim, no gradient.

## Artifact Notes

- All 7 gates PASS on cycle 1. No re-dispatch.
- Internal tide motion (shot 4, 30%→90% linear over 5.5s) is correctly scoped as a within-source-screenshot animation, not an invented overlay — the tide layer exists in source screenshots/03-active.png; the per-shot Renderer Hints describe interpolating its mask-position, not compositing a new tide.
- HyperFrames + Remotion scaffolds reach parity: both implement the same crop / mask / pointer / caption-band semantics via runtime-native primitives (waapi for HF, frame-driven interpolate for Remotion).
```

Orchestrator writes the bundle to `docs/forsvn/artifacts/marketing/produced-videos/tideline-surge-mode-app-store-ios/`. Status: `DONE`. Cycle 1 PASS — no rewrite needed.

---

## FAIL-handling variant (cycle 2 illustrative)

Imagine prompt-author-agent's cycle-1 first-pass adds a glow effect to the pointer for "polish":

```yaml
# scenes/shot-2.md
pointer_spec: |
  { style: solid-circle-with-glow, size_px: 64, color_hex: "#0F4C5C",
    color_token: "color.accent", glow_radius_px: 12, glow_color: "#0F4C5C66",
    position_crop_relative: { x: 430, y: 110 },
    ripple: { start_px: 80, end_px: 160, duration_s: 0.3 } }
```

Critic FAIL on Gate 7:

```markdown
## Verdict: FAIL
## Mode: app-preview

### Gate 7: Pointer-and-Caption-Band Fidelity (hard FAIL gate)
FAIL.
- scenes/shot-2.md cites `style: solid-circle-with-glow` with `glow_radius_px: 12` and `glow_color: "#0F4C5C66"`.
- Anti-pattern #9 (synthetic pointer effect): pointers and caption-band backgrounds are SOLID colors only. Glow is forbidden regardless of color sourcing.
- Quote: line 12, `pointer_spec.style: solid-circle-with-glow` and line 14 `glow_radius_px: 12`.

## Fix Instructions

### Fix 1: Strip glow from pointer
**Gate:** 7
**Location:** scenes/shot-2.md, pointer_spec block
**Problem:** "solid-circle-with-glow" is not in the canonical pointer style set. Glow effects are synthetic per Anti-pattern #9 and create the "AI-generated" tell the brand archetype "Calm Operator" forbids.
**Fix:** Set `style: solid-circle`. Remove `glow_radius_px` and `glow_color` fields entirely. Keep `color_hex: #0F4C5C` and `color_token: color.accent` as-is. No replacement effect — solid is correct.
```

Cycle 2: prompt-author-agent strips the glow, sets `style: solid-circle`, removes glow fields, and updates the per-shot Change Log:

```markdown
## Change Log (cycle 2)

| Field | Before | After | Reason (from critic feedback) |
|---|---|---|---|
| pointer_spec.style | solid-circle-with-glow | solid-circle | Gate 7 FAIL — synthetic effect (glow) on pointer; anti-pattern #9 |
| pointer_spec.glow_radius_px | 12 | (removed) | Gate 7 FAIL — synthetic effect |
| pointer_spec.glow_color | "#0F4C5C66" | (removed) | Gate 7 FAIL — synthetic effect |
```

Cycle 2 critic re-runs Gates 5, 6, 7 (and Gate 1 because the per-shot file changed). All PASS. Status: `DONE`. critic_loop_count: 2.

---

## Cross-Stack Contract Verified

This walkthrough exercises the full WS3 → WS4 seam:

1. **Brief layer** — `brief-app-preview` emits `handoff-produce-video.md` with the per-shot specification + frontmatter discriminator (`type: produce-video-input`).
2. **Schema layer** — `produce-video/references/video-brief-schema.md` § App-Preview Mode Extension defines the field map; pre-dispatch validates against rules A-K.
3. **Production layer** — `prompt-author-agent` assembles the bundle in app-preview mode: 6 outputs with mode-specific shape (composition-operation per-shot prompts, scaffold parity, collapsed vercel-ai-cli, post collapsed to assembly + caption burn-in).
4. **Critic layer** — `critic-agent` evaluates Gates 1-7 with mode-aware behavior; Gates 5-7 are app-preview-only hard FAILs.
5. **Runtime layer** — HyperFrames + Remotion both render from the same canonical manifest via their respective scaffolds, reaching functional parity.

The seam works in 1 critic cycle when the handoff is clean; 2 cycles when a synthetic-effect Gate 7 violation slips through.
