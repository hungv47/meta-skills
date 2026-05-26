---
name: produce-video
description: "Turn a brief-shortform or brief-app-preview into a multi-runtime export bundle — manifest, per-shot prompts, HyperFrames + Remotion scaffolds, Vercel AI CLI README. Two modes: shortform (social/promo) and app-preview (screenshot-driven product demo). Tool-agnostic — emits scaffolds + prompts; does NOT invoke render engines. Not for writing the brief (use brief-shortform / brief-app-preview) or publishing (use publish-social)."
argument-hint: "[brief slug or path] [--platforms tiktok,reels,...] [--surface app-store,onboarding,...]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.2.0"
  budget: standard
  estimated-cost: "$0.75-2.00"
---

# Produce Video — Multi-Runtime Export Bundle Orchestrator

Converts an upstream brief (brief-shortform OR brief-app-preview handoff) into a multi-runtime export bundle: canonical manifest + per-shot prompts + HyperFrames scaffold + Remotion scaffold + Vercel AI CLI README. **Operator picks the downstream runtime.** Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 2 routes + 4/7 critic gates: [`references/agent-manifest.md`](references/agent-manifest.md).

**Two modes** (discriminated by input brief frontmatter — see [`references/video-brief-schema.md`](references/video-brief-schema.md) § App-Preview Mode Extension):

- **shortform** — social/promo video from brief-shortform (or schema-compliant hand-written video-brief). Hook-driven, narrative arc, CTA-anchored.
- **app-preview** — screenshot-driven product demo from brief-app-preview's `handoff-produce-video.md`. Composition over real UI screenshots, no synthesis.

**Core question:** Could any downstream runtime (HyperFrames / Remotion / Vercel AI CLI / Hyx / Freepik / a human editor) produce the right video from this bundle without a single follow-up question?

## Critical Gates — load first

Non-negotiable. Shared production-skill contract canonical in [`references/_shared/production-pattern.md`](references/_shared/production-pattern.md):

1. **Tool-agnostic by design.** This stack does NOT invoke HyperFrames render, `npx remotion render`, Vercel AI CLI, or any other runtime — by design, holds no API keys. Output is the bundle (manifest + scenes + scaffolds + README) you run through your own runtime. Caller passes `--publish`, `--render`, or `--auto-run` → return `BLOCKED — this stack emits render-ready prompts; it does not call render engines. Run the emitted prompt through your engine.` No silent fall-throughs.
2. **Schema-and-CTA compliance.** Canonical `manifest.md` must validate against `references/video-brief-schema.md` (all required fields, valid aspect, shot durations sum to total length). CTA copy must appear verbatim in the final shot's `on_screen_text` AND the manifest's top-level `cta` field. Critic Gate 1 enforces.
3. **Brand-mark fidelity.** No hallucinated logos. Every per-shot prompt cites brand assets from `brand/DESIGN.md` only — solid-color placeholder when an asset is missing, NEVER an invented logo. Critic Gate 2 enforces.
4. **Caption-pace floor.** On-screen text density per shot ≤ 3 words per second of shot duration. Critic Gate 3 enforces. Falsifiable without rendering: `words(on_screen_text) ÷ duration_seconds ≤ 3.0`.

## Inputs

Mode auto-detected from brief frontmatter `type` field at pre-dispatch.

### Shortform mode

| Artifact | Required? | What it provides |
|---|---|---|
| `.forsvn/artifacts/mkt/brief-shortform/[slug]/brief.md` (or `variants/[platform].md`) | **required** (primary path) | Hook · shot list · on-screen text · audio plan · caption · CTA · aspect · length · production notes |
| Hand-written video-brief matching `references/video-brief-schema.md` | **alt path** | Same fields, schema-validated at pre-dispatch |
| `brand/BRAND.md` | **required** | Voice, archetype, sacred elements (do-not-touch rails for runtime + TTS) |
| `brand/DESIGN.md` | **required** | Color tokens (hex + name), type scale, motion permissions, surface conventions |
| Target platforms | optional | Defaults to brief's `hero_platform` + `variants`; can be overridden |

Missing `brand/BRAND.md` or `brand/DESIGN.md` → `NEEDS_CONTEXT`, defer to `create-brand`. No brief-shortform artifact AND no schema-compliant video-brief → `NEEDS_CONTEXT`, defer to `brief-shortform`.

### App-preview mode

| Artifact | Required? | What it provides |
|---|---|---|
| `.forsvn/artifacts/mkt/app-preview-brief/[slug]/handoff-produce-video.md` | **required** (primary path) | Per-shot spec (shot_id · source_id(s) · crop_rect · mask_transform · pointer · caption_text · caption_band · duration_s); frontmatter (surface · aspect · total_length_seconds · audio_default · shot_count · brand_source) |
| `.forsvn/artifacts/mkt/app-preview-brief/[slug]/brief.md` | **required** (companion) | Human context; narration text if any; brand-source rationale |
| `.forsvn/artifacts/mkt/app-preview-brief/[slug]/assets.md` | **required** (companion) | Source-ID-to-path map for screenshots, audio assets, brand tokens |
| `.forsvn/artifacts/mkt/app-preview-brief/[slug]/crop-map.md` | optional | Detailed crop justifications |
| Source screenshot files | **required** | Every `source_id` resolves to a file on disk; Gate 5 verifies existence |
| `brand/BRAND.md` | **soft-required** | Used when `brand_source: brand-md`; skipped when `cold-start-hint` |
| `brand/DESIGN.md` | **soft-required** | Used when `brand_source: brand-md`; cold-start samples colors from source screenshots and cites `(cold-start-sampled)` |

Handoff says `brand_source: brand-md` but brand files absent → `NEEDS_CONTEXT` (upstream lied about brand state; defer to `create-brand` or re-run `brief-app-preview` with `brand_source: cold-start-hint`). `source_id` doesn't resolve to a file → `NEEDS_CONTEXT`, defer to `brief-app-preview`.

## Output

Bundle root: `.forsvn/artifacts/mkt/produced-videos/[slug]/`

```
manifest.md                 # canonical runtime-agnostic contract (always emitted)
scenes/
  [shot-id].md              # per-shot prompt files (visual + OST + voice spec)
hyperframes/
  scaffold.html             # HyperFrames composition scaffold + scenes JSON inlined
remotion/
  scaffold.tsx              # Remotion composition scaffold
vercel-ai-cli.md            # README — how to pipe scenes/ through `npx ai` / `vercel ai`
```

All 5 outputs always emitted (vercel-ai-cli.md collapsed in app-preview mode). You pick the downstream runtime — the stack never invokes one. Full template + field definitions: [`references/format-conventions.md`](references/format-conventions.md).

## Quality Gate

Single critic agent runs before delivery. Mode-aware gate set:

- **Shortform — 4 gates:** Schema-and-CTA · Brand-mark fidelity · Caption-pace · Narrative arc (Gate 4 is soft — FAIL → warning).
- **App-preview — 7 gates:** above 4 (mode-aware) + Gate 5 Screenshot grounding (hard FAIL) + Gate 6 Interaction-vocabulary + mask-transform compliance (hard FAIL) + Gate 7 Pointer-and-caption-band fidelity (hard FAIL).

Critic FAIL on any hard gate (Gates 1/2/3 + 5/6/7 in app-preview) → re-dispatch prompt-author-agent with specific feedback (max 2 cycles). Critic FAIL on Gate 4 only → ship `done_with_concerns`. Full per-gate rubric: [`references/agent-manifest.md`](references/agent-manifest.md).

## Chain Position

**Previous:** `brief-shortform` (shortform mode) OR `brief-app-preview` (app-preview mode), `create-brand` (required for `brand_source: brand-md`; skipped when cold-start), `research-icp` (recommended — VoC for narration tone, shortform mode). **Next:** operator runs the chosen scaffold through their runtime; rendered video feeds future `evaluate-content` / `evaluate-shortform` cycles.

**Re-run triggers:** upstream brief re-emitted, `brand/DESIGN.md` tokens updated, target platforms/surface changed, operator wants different runtime emphasis (re-run with `--rev=N` to preserve prior bundle).

## Routing

Two routes — discriminated by input brief's `type` at pre-dispatch. Full route graphs + dispatch steps: [`references/agent-manifest.md`](references/agent-manifest.md).

## Artifact Contract

- **Bundle root:** `.forsvn/artifacts/mkt/produced-videos/[slug]/`
- **Lifecycle:** `pipeline` (regenerated on re-run).
- **Manifest frontmatter (12 fields):** `skill` · `version` · `date` · `status` · `slug` · `source_brief` · `target_platforms` · `aspect` · `length_seconds` · `shot_count` · `cta` · `provenance` (generation-variant per `references/_shared/artifact-contract-template.md`).
- **Per-shot prompt frontmatter (7 fields):** `skill` · `version` · `date` · `shot_id` · `shot_index` · `duration_seconds` · `platform`.
- **Generation provenance required.** `input_artifacts` lists the brief path + `brand/BRAND.md` + `brand/DESIGN.md`. `output_eval: null` until downstream `evaluate-shortform` / `evaluate-content`.
- **Cross-stack contract:** consumed by downstream runtimes (HyperFrames / Remotion / Vercel AI CLI / operator-chosen tool) + future `evaluate-shortform` / `evaluate-content` cycles. Schema changes require atomic update across `format-conventions.md` + `video-brief-schema.md` + upstream `brief-shortform` if its output drifts.

Full template + field definitions + scaffold conventions: [`references/format-conventions.md`](references/format-conventions.md). Input contract + brief-shortform-to-schema field map: [`references/video-brief-schema.md`](references/video-brief-schema.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before bundle ships. 6 orchestrator (skipping brief read, hallucinating logos, silent aspect overrides, copy synonymizing, render-mode misroute, padding shot durations to hit length) + 3 app-preview-specific (inventing UI / Gate-5 violations, custom interaction verbs and mask transforms, synthetic pointer/caption-band effects) + 4 cross-cutting (cross-stack contract drift, brand-system absent → token fabrication, skill-deference miss, artifact schema drift).

Most common (shortform): hallucinated logos (Gate 2), caption-pace overshoot on hook shots (Gate 3), inventing CTAs the brief didn't specify. Most common (app-preview): invented UI elements (Gate 5), synthetic pointer effects (Gate 7), drift between handoff and per-shot prompt (Gate 5).

## Completion Status

- `DONE` — manifest + scenes/ + hyperframes/ + remotion/ + vercel-ai-cli.md written, critic PASS on all 4 gates.
- `DONE_WITH_CONCERNS` — bundle written; critic FAILed only on Gate 4 (narrative arc — soft) OR on a single secondary issue. Concerns pinned at top of manifest.
- `NEEDS_CONTEXT` — brief-shortform/brief-app-preview artifact missing AND no schema-compliant video-brief; OR brand files missing; OR aspect/length not derivable.
- `BLOCKED` — `--publish` / `--render` / `--auto-run` requested (this stack emits render-ready prompts; does not call render engines); critic FAILed twice on Gate 1/2/3 or any app-preview hard gate.

## Next Step

Operator runs the chosen scaffold through their runtime:

- **HyperFrames:** `hyperframes preview manifest.md` (uses inlined scenes JSON) or `hyperframes render hyperframes/scaffold.html`.
- **Remotion:** `npx remotion preview remotion/scaffold.tsx` or `npx remotion render remotion/scaffold.tsx`.
- **Vercel AI CLI / Hyx / Freepik / any image-gen tool** (shortform only): follow `vercel-ai-cli.md` to pipe per-shot prompts, then assemble with their editor.

After rendering, operator marks the manifest's verification checklist per shot. When all shots are verified on-spec, the produced video is ready for downstream eval cycles.

## Worked Example

App-preview Route B walkthrough using brief-app-preview's Tideline / Surge mode / App Store iOS handoff → bundle with 5 shots + critic PASS, demonstrating Remotion + HyperFrames scaffold parity: [`references/examples/app-preview-tideline-walkthrough.md`](references/examples/app-preview-tideline-walkthrough.md). Shortform Route A walkthrough deferred.
