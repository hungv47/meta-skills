# Inputs & Outputs — Produce Video

Detailed input contracts (per mode) and output bundle structure for `produce-video`. Loaded at pre-dispatch (mode detection) and at output-template assembly.

## Mode Detection

Mode auto-detected from the input brief's frontmatter `type` field at pre-dispatch.

- `type: brief-shortform` (or a hand-written video-brief matching `references/video-brief-schema.md`) → **shortform mode**.
- `type: brief-app-preview` (with companion `handoff-produce-video.md`) → **app-preview mode**.

## Inputs — Shortform Mode

| Artifact | Required? | What it provides |
|---|---|---|
| `docs/forsvn/artifacts/marketing/brief-shortform/[slug]/brief.md` (or `variants/[platform].md`) | **required** (primary path) | Hook · shot list · on-screen text · audio plan · caption · CTA · aspect · length · production notes |
| Hand-written video-brief matching `references/video-brief-schema.md` | **alt path** | Same fields, schema-validated at pre-dispatch |
| `brand/BRAND.md` | **required** | Voice, archetype, sacred elements (do-not-touch rails for runtime + TTS) |
| `brand/DESIGN.md` | **required** | Color tokens (hex + name), type scale, motion permissions, surface conventions |
| Target platforms | optional | Defaults to brief's `hero_platform` + `variants`; can be overridden |

**NEEDS_CONTEXT triggers:**
- Missing `brand/BRAND.md` or `brand/DESIGN.md` → defer to `create-brand`.
- No brief-shortform artifact AND no schema-compliant video-brief → defer to `brief-shortform`.

## Inputs — App-Preview Mode

| Artifact | Required? | What it provides |
|---|---|---|
| `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/handoff-produce-video.md` | **required** (primary path) | Per-shot spec (shot_id · source_id(s) · crop_rect · mask_transform · pointer · caption_text · caption_band · duration_s); frontmatter (surface · aspect · total_length_seconds · audio_default · shot_count · brand_source) |
| `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/brief.md` | **required** (companion) | Human context; narration text if any; brand-source rationale |
| `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/assets.md` | **required** (companion) | Source-ID-to-path map for screenshots, audio assets, brand tokens |
| `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/crop-map.md` | optional | Detailed crop justifications |
| Source screenshot files | **required** | Every `source_id` resolves to a file on disk; Gate 5 verifies existence |
| `brand/BRAND.md` | **soft-required** | Used when `brand_source: brand-md`; skipped when `cold-start-hint` |
| `brand/DESIGN.md` | **soft-required** | Used when `brand_source: brand-md`; cold-start samples colors from source screenshots and cites `(cold-start-sampled)` |

**NEEDS_CONTEXT triggers:**
- Handoff says `brand_source: brand-md` but brand files absent → upstream lied about brand state; defer to `create-brand` or re-run `brief-app-preview` with `brand_source: cold-start-hint`.
- `source_id` doesn't resolve to a file → defer to `brief-app-preview`.

## Output — Bundle Structure

Bundle root: `docs/forsvn/artifacts/marketing/produced-videos/[slug]/`

```
manifest.md                 # canonical runtime-agnostic contract (always emitted)
scenes/
  [shot-id].md              # per-shot prompt files (visual + OST + voice spec)
hyperframes/
  scaffold.html             # HyperFrames composition scaffold + scenes JSON inlined
remotion/
  scaffold.tsx              # Remotion composition scaffold
vercel-ai-cli.md            # README — pipe scenes/ through `npx ai` / generative video / image-gen
post.md                     # assemble → color-grade → subtitle stage (post lane; video-use / ffmpeg)
```

All 6 outputs always emitted (vercel-ai-cli.md collapses in app-preview mode; post.md collapses to assembly + caption burn-in there). The stack never invokes a runtime — it recommends a production lane (`../production-lanes.md`) and the operator picks via the execution fork. Full template + field definitions: [`../format-conventions.md`](../format-conventions.md).

## Chain Position

- **Previous:** `brief-shortform` (shortform mode) OR `brief-app-preview` (app-preview mode); `create-brand` (required for `brand_source: brand-md`; skipped when cold-start); `research-icp` (recommended — VoC for narration tone, shortform mode).
- **Next:** operator runs the chosen scaffold through their runtime; rendered video feeds future `evaluate-content` / `evaluate-shortform` cycles.
- **Re-run triggers:** upstream brief re-emitted; `brand/DESIGN.md` tokens updated; target platforms/surface changed; operator wants different runtime emphasis (re-run with `--rev=N` to preserve prior bundle).
