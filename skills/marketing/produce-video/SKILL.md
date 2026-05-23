---
name: produce-video
description: "Turns a brief-shortform artifact OR a brief-app-preview handoff (or a schema-matching video-brief) into a multi-runtime export bundle — a runtime-agnostic manifest, per-shot prompts, HyperFrames and Remotion scaffolds, and a CLI README. Two modes: shortform (social/promo video) and app-preview (screenshot-driven product demo). Tool-agnostic by design — emits scaffolds + prompts tuned for your chosen video engine; the stack holds no API keys and runs no render runtime. Use when a short-form or app-preview brief exists and you need a production-ready bundle. Not for writing the brief itself (use brief-shortform or brief-app-preview) or publishing the rendered video (use publish-social)."
argument-hint: "[brief slug or path] [--platforms tiktok,reels,...] [--surface app-store,onboarding,...]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.1.0"
  budget: standard
  estimated-cost: "$0.75-2.00"
---

# Produce Video — Multi-Runtime Export Bundle Orchestrator

*Production skill. Converts an upstream brief (brief-shortform OR brief-app-preview handoff) into a multi-runtime export bundle: canonical manifest + per-shot prompts + HyperFrames scaffold + Remotion scaffold + Vercel AI CLI README. The operator picks the downstream runtime.*

**Two modes** (discriminated by input brief frontmatter — see `references/video-brief-schema.md` § App-Preview Mode Extension):

- **shortform** — social/promo video from brief-shortform (or schema-compliant hand-written video-brief). Hook-driven, narrative arc, CTA-anchored.
- **app-preview** — screenshot-driven product demo from brief-app-preview's `handoff-produce-video.md`. Composition over real UI screenshots, no synthesis.

**Core Question:** "Could any downstream runtime (HyperFrames / Remotion / Vercel AI CLI / Hyx / Freepik / a human editor) produce the right video from this bundle without a single follow-up question?"

> Tool-agnostic by design — the stack emits the export bundle and holds no API keys; you run it through your own rendering runtime. See [`references/format-conventions.md`](references/format-conventions.md) for the manifest + per-shot prompt + scaffold schemas. See [`references/video-brief-schema.md`](references/video-brief-schema.md) for the input contract.

## Critical Gates — Read First

Non-negotiable constraints — brief 04 § Production Principle + § Anti-patterns. The shared production-skill contract (tool-agnostic export-mode floor, brand-mark fidelity, lean 2-agent dispatch, pipeline lifecycle) is canonical in [`references/_shared/production-pattern.md`](references/_shared/production-pattern.md) [PROCEDURE]:

1. **Tool-agnostic by design.** This stack does not invoke HyperFrames render, `npx remotion render`, Vercel AI CLI, or any other runtime — by design, it holds no API keys. The output is the bundle (manifest + scenes + scaffolds + README) you run through your own runtime. If an upstream caller passes `--publish`, `--render`, or `--auto-run`, return `BLOCKED — this stack emits render-ready prompts; it does not call render engines. Run the emitted prompt through your engine.` No silent fall-throughs.
2. **Schema-and-CTA compliance.** The canonical `manifest.md` must validate against `references/video-brief-schema.md` (all required fields, valid aspect, shot durations sum to total length). The CTA copy must appear verbatim in the final shot's `on_screen_text` AND the manifest's top-level `cta` field. Critic Gate 1 enforces.
3. **Brand-mark fidelity.** No hallucinated logos. Every per-shot prompt cites brand assets from `brand/DESIGN.md` only — solid-color placeholder when an asset is missing, NEVER an invented logo. Critic Gate 2 enforces.
4. **Caption-pace floor.** On-screen text density per shot ≤ 3 words per second of shot duration. Critic Gate 3 enforces. Falsifiable without rendering: `words(on_screen_text) ÷ duration_seconds ≤ 3.0`.

## Inputs

The accepted input depends on mode. Mode is auto-detected from the brief's frontmatter `type` field at pre-dispatch.

### Shortform mode

| Artifact | Required? | What it provides |
|----------|-----------|------------------|
| `.forsvn/artifacts/mkt/short-form-brief/[slug]/brief.md` (or `variants/[platform].md`) | **required** (primary path) | Hook · shot list · on-screen text choreography · audio plan · caption · CTA · aspect · length · production notes |
| Hand-written video-brief matching `references/video-brief-schema.md` | **alt path** | Same fields as the brief-shortform output — schema-validated at pre-dispatch |
| `brand/BRAND.md` | **required** | Voice, archetype, sacred elements (do-not-touch rails for runtime + TTS) |
| `brand/DESIGN.md` | **required** | Color tokens (hex + name), type scale, motion permissions, surface conventions |
| Target platforms | optional | Defaults to the brief's `hero_platform` + `variants`; can be overridden |

If `brand/BRAND.md` or `brand/DESIGN.md` is missing → return `NEEDS_CONTEXT` and defer to `create-brand`.
If neither a brief-shortform artifact nor a schema-compliant video-brief is found → return `NEEDS_CONTEXT` and defer to `brief-shortform`.

### App-preview mode

| Artifact | Required? | What it provides |
|----------|-----------|------------------|
| `.forsvn/artifacts/mkt/app-preview-brief/[slug]/handoff-produce-video.md` | **required** (primary path) | Per-shot specification (shot_id / source_id(s) / crop_rect / mask_transform / pointer / caption_text / caption_band / duration_s); frontmatter (surface / aspect / total_length_seconds / audio_default / shot_count / brand_source) |
| `.forsvn/artifacts/mkt/app-preview-brief/[slug]/brief.md` | **required** (companion) | Human context; narration text if any; brand-source rationale |
| `.forsvn/artifacts/mkt/app-preview-brief/[slug]/assets.md` | **required** (companion) | Source-ID-to-path map for screenshots, audio assets, brand tokens |
| `.forsvn/artifacts/mkt/app-preview-brief/[slug]/crop-map.md` | optional (companion) | Detailed crop justifications; redundant with handoff |
| Source screenshot files | **required** | Every `source_id` resolves to a file on disk; Gate 5 verifies existence |
| `brand/BRAND.md` | **soft-required** | Used when `brand_source: brand-md`; skipped when `cold-start-hint` |
| `brand/DESIGN.md` | **soft-required** | Used when `brand_source: brand-md`; cold-start mode samples colors from source screenshots and cites `(cold-start-sampled)` |

If the handoff frontmatter says `brand_source: brand-md` but the brand files are absent → return `NEEDS_CONTEXT` (the upstream brief lied about brand state; defer to `create-brand` or re-run `brief-app-preview` with `brand_source: cold-start-hint`).
If a `source_id` in the handoff doesn't resolve to a file on disk → return `NEEDS_CONTEXT` and defer to `brief-app-preview`.
If neither a brief-app-preview handoff nor a brief-shortform brief is supplied → return `NEEDS_CONTEXT` and defer to the appropriate brief skill based on the operator's intent.

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

All 5 outputs always emitted. You pick the downstream runtime — the stack never invokes one. Full template + field definitions: [`references/format-conventions.md`](references/format-conventions.md).

## Quality Gate

Single critic agent runs before delivery — `agents/critic-agent.md` enforces spec compliance against a mode-aware gate set:

**Shortform mode — 4 gates:**

- [ ] **Gate 1 — Schema-and-CTA:** manifest validates against `video-brief-schema.md`; per-shot durations sum to total length; CTA copy present verbatim in BOTH the final shot's `on_screen_text` AND the manifest's `cta` field
- [ ] **Gate 2 — Brand-mark fidelity:** every per-shot prompt cites brand tokens from `brand/DESIGN.md` only; no fabricated hex / token names; placeholder rule active for missing assets; sacred elements from `brand/BRAND.md` respected
- [ ] **Gate 3 — Caption-pace:** for every shot, `words(on_screen_text) ÷ duration_seconds ≤ 3.0`; flagged shots get a fix instruction (shorten copy OR extend duration)
- [ ] **Gate 4 — Narrative arc:** shot 1 reads as a hook; middle shots build (problem → mechanism / proof / contrast); final shot closes with CTA. Soft check — FAILs are warnings, not blocks

**App-preview mode — 7 gates** (1-4 above in mode-aware form, plus 3 new hard FAILs):

- [ ] **Gate 5 — Screenshot grounding (hard FAIL):** every `source_screenshot` path exists on disk; every Visual Prompt is a composition operation (not a synthesis prompt); crop rectangles match the handoff; no invented UI
- [ ] **Gate 6 — Interaction-vocabulary + mask-transform compliance (hard FAIL):** every `interaction_verb` is in the canonical 10; every `mask_transform` is in the canonical 6; verb-duration coherence
- [ ] **Gate 7 — Pointer-and-caption-band fidelity (hard FAIL):** pointer color cited (hex + token OR `(cold-start-sampled)`); pointer position crop-relative and inside the crop rect; caption-band geometry matches the handoff; no synthetic effects (gradient / glow / neon)

Critic FAIL on any hard gate (Gates 1/2/3 + 5/6/7 in app-preview) → re-dispatch prompt-author-agent with specific feedback (max 2 cycles). Critic FAIL on Gate 4 only → ship `done_with_concerns` with arc concerns pinned. Critic PASS twice with operator override → log override via `scripts/eval/log-critic-override.ts` per D8 contract.

## Chain Position

**Previous:** `brief-shortform` (shortform mode — the upstream brief) OR `brief-app-preview` (app-preview mode — emits the handoff), `create-brand` (required for `brand_source: brand-md`; skipped when cold-start), `research-icp` (recommended — VoC for narration tone, shortform mode) | **Next:** operator runs the chosen scaffold through their runtime; rendered video feeds future `evaluate-content` / `evaluate-shortform` cycles inside an eval loop.

**Re-run triggers:** upstream brief re-emitted, brand/DESIGN.md tokens updated, target platforms/surface changed, operator wants a different runtime emphasis (re-run with `--rev=N` to preserve prior bundle).

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Prompt Author | 1 | `agents/prompt-author-agent.md` | Per-shot prompt (visual + OST + voice spec) + HyperFrames scaffold + Remotion scaffold + vercel-ai-cli README; assembles the full bundle |
| Critic | 2 (final) | `agents/critic-agent.md` | 4 dimensions: Schema-and-CTA / Brand-mark fidelity / Caption-pace / Narrative arc |

Intentionally lean: sequential prompt-author → critic. Mirrors the shared production pattern ([`references/_shared/production-pattern.md`](references/_shared/production-pattern.md) § 4). Per-shot parallelism and long-video narrative coherence are out of scope — this skill targets short-form.

## Routing + Dispatch

Two routes — discriminated by the input brief's `type` frontmatter at pre-dispatch:

```
ROUTE A — shortform mode (export):
  1. Pre-Dispatch — locate brief-shortform artifact (or schema-compliant video-brief);
     read brand/BRAND.md + brand/DESIGN.md; validate against video-brief-schema.md
     (general validation rules 1-3 + shortform rules 4-7)
  2. Dispatch: prompt-author-agent (assembles full bundle in shortform mode)
  3. Dispatch: critic-agent on the assembled bundle (Gates 1-4)
  4. Critic FAIL on Gate 1/2/3 → re-dispatch prompt-author-agent with feedback (max 2 cycles)
  5. Critic FAIL on Gate 4 only → ship done_with_concerns
  6. Critic PASS → write bundle to .forsvn/artifacts/mkt/produced-videos/[slug]/
  7. Return bundle path + shot count + runtime choices

ROUTE B — app-preview mode (export):
  1. Pre-Dispatch — locate brief-app-preview's handoff-produce-video.md (or accept brief.md and
     resolve the sibling handoff); read companion brief.md + assets.md; verify every source_id
     resolves to a file on disk; validate against video-brief-schema.md
     (general validation rules 1-3 + app-preview rules A-K).
     If brand_source: brand-md → read brand/BRAND.md + brand/DESIGN.md.
     If brand_source: cold-start-hint → skip brand-file read, sample colors per-beat from source screenshots.
  2. Dispatch: prompt-author-agent (assembles full bundle in app-preview mode — composition-operation
     prompts, full Remotion + HyperFrames scaffold parity, collapsed vercel-ai-cli.md)
  3. Dispatch: critic-agent on the assembled bundle (Gates 1-7; Gates 5/6/7 are app-preview-only hard FAILs)
  4. Critic FAIL on any hard gate → re-dispatch prompt-author-agent with feedback (max 2 cycles)
  5. Critic FAIL on Gate 4 only → ship done_with_concerns
  6. Critic PASS → write bundle to .forsvn/artifacts/mkt/produced-videos/[slug]/
  7. Return bundle path + shot count + 2 runtime choices ("Run hyperframes/scaffold.html through
     `hyperframes preview`, OR remotion/scaffold.tsx through `npx remotion preview`.
     Vercel AI CLI does NOT apply in app-preview — visuals are real screenshots.")
```

## Artifact Contract

- **Bundle root:** `.forsvn/artifacts/mkt/produced-videos/[slug]/`
- **Canonical manifest:** `manifest.md`
- **Per-shot prompts:** `scenes/[shot-id].md`
- **Runtime scaffolds:** `hyperframes/scaffold.html`, `remotion/scaffold.tsx`
- **Runtime README:** `vercel-ai-cli.md`
- **Lifecycle:** `pipeline` (regenerated by re-running; not canonical)
- **Frontmatter (manifest):** 12 fields — `skill` / `version` / `date` / `status` / `slug` / `source_brief` / `target_platforms` / `aspect` / `length_seconds` / `shot_count` / `cta` / `provenance` (generation-variant per `references/_shared/artifact-contract-template.md`)
- **Frontmatter (per-shot prompt):** 7 fields — `skill` / `version` / `date` / `shot_id` / `shot_index` / `duration_seconds` / `platform`
- **Generation provenance:** required. `input_artifacts` lists the brief-shortform path + `brand/BRAND.md` + `brand/DESIGN.md`. `output_eval: null` until a downstream evaluate-shortform / evaluate-content cycle scores the rendered video.
- **Cross-stack contract:** consumed by downstream runtimes (HyperFrames / Remotion / Vercel AI CLI / operator-chosen tool) + future `evaluate-shortform` / `evaluate-content` cycles. Schema changes require atomic update across format-conventions.md + video-brief-schema.md + upstream brief-shortform if its output ever drifts.

Full template + field definitions + scaffold conventions: [`references/format-conventions.md`](references/format-conventions.md). Input contract + brief-shortform-to-schema field map: [`references/video-brief-schema.md`](references/video-brief-schema.md).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md). Re-read before any bundle ships. 6 orchestrator-level patterns (skipping brief read, hallucinating logos, silent aspect overrides, copy synonymizing, render-mode misroute, padding shot durations to hit length) + 3 app-preview-specific patterns (inventing UI / Gate-5 violations, custom interaction verbs and mask transforms, synthetic pointer/caption-band effects) + 4 cross-cutting marketing-stack rows (cross-stack contract drift, brand-system absent → token fabrication, skill-deference miss, artifact schema drift).

Most common in practice (shortform): hallucinated logos (Gate 2), caption-pace overshoot on hook shots (Gate 3), inventing CTAs the brief didn't specify. Most common in practice (app-preview): invented UI elements (Gate 5), synthetic pointer effects (Gate 7), drift between handoff and per-shot prompt (Gate 5).

## Completion Status

End with one status:

- `DONE` — manifest + scenes/ + hyperframes/ + remotion/ + vercel-ai-cli.md written, critic PASS on all 4 gates
- `DONE_WITH_CONCERNS` — bundle written; critic FAILed only on Gate 4 (narrative arc — soft) OR on a single secondary issue. Concerns pinned at top of manifest
- `NEEDS_CONTEXT` — brief-shortform artifact missing AND no schema-compliant video-brief supplied; OR brand files missing; OR aspect/length not derivable from brief
- `BLOCKED` — `--publish` / `--render` / `--auto-run` requested (this stack emits render-ready prompts; it does not call render engines — run the emitted prompt through your engine); critic FAILed twice on Gate 1/2/3

## Next Step

Operator runs the chosen scaffold through their runtime:

- **HyperFrames:** `hyperframes preview manifest.md` (uses inlined scenes JSON) or `hyperframes render hyperframes/scaffold.html`
- **Remotion:** `npx remotion preview remotion/scaffold.tsx` or `npx remotion render remotion/scaffold.tsx`
- **Vercel AI CLI / Hyx / Freepik / any image-gen tool:** follow `vercel-ai-cli.md` to pipe per-shot prompts through the installed tool, then assemble with their preferred editor

After rendering, operator marks the manifest's verification checklist for each shot. When all shots are verified on-spec, the produced video is ready for downstream eval cycles.

## References

- **Shared:** `references/_shared/{production-pattern, eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, anti-sycophancy, artifact-contract-template}.md` (synced via `scripts/sync-skill-support.mjs`)
- **Frameworks** (`references/`): `format-conventions.md` (manifest + per-shot prompt + scaffold schemas for both modes), `video-brief-schema.md` (input contract — shortform field map + App-Preview Mode Extension), `anti-patterns.md` (6 orchestrator + 3 app-preview + 4 cross-cutting rows), `examples/app-preview-tideline-walkthrough.md` (worked WS3→WS4 seam)
- **Agents (`agents/`):** 2 agents — see Agent Manifest above
- **Upstream:** `skills/marketing/brief-shortform/` (shortform mode), `skills/marketing/brief-app-preview/` (app-preview mode), `skills/marketing/create-brand/` (brand tokens this skill respects)

## Worked Example

App-preview Route B walkthrough using brief-app-preview's Tideline / Surge mode / App Store iOS handoff → bundle with 5 shots + critic PASS, demonstrating Remotion + HyperFrames scaffold parity. See [`references/examples/app-preview-tideline-walkthrough.md`](references/examples/app-preview-tideline-walkthrough.md). Shortform Route A walkthrough still deferred.
