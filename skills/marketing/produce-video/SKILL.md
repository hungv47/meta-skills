---
name: produce-video
description: "Produces a multi-runtime export bundle for a short-form video from a brief-shortform artifact (or a hand-written video-brief matching the schema). Export-mode v1 — no rendering runtime is invoked. Always emits: a canonical runtime-agnostic `manifest.md`, per-shot prompt files under `scenes/`, a HyperFrames scaffold under `hyperframes/`, a Remotion scaffold under `remotion/`, and a `vercel-ai-cli.md` README for piping per-shot prompts through Vercel AI CLI / Hyx / Freepik / any image-gen tool the operator has installed. The operator picks the downstream runtime. Produces `.forsvn/artifacts/mkt/produced-videos/[slug]/{manifest.md,scenes/,hyperframes/,remotion/,vercel-ai-cli.md}`. Not for writing the brief itself (use brief-shortform). Not for rendering audio (TTS spec only — operator pipes through their own TTS tool). Not for publishing the rendered video (future publish-social)."
argument-hint: "[brief-shortform slug or path] [--platforms tiktok,reels,...]"
allowed-tools: Read Edit Write Grep Glob Bash
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.75-2.00"
promptSignals:
  phrases:
    - "produce video"
    - "render video"
    - "video manifest"
    - "video from brief"
    - "make the video"
    - "build the video"
    - "hyperframes scaffold"
    - "remotion scaffold"
    - "render-ready video"
    - "video export bundle"
  allOf:
    - [produce, video]
    - [render, video, brief]
    - [video, manifest]
  anyOf:
    - "produce-video"
    - "video render"
    - "hyperframes export"
    - "remotion export"
    - "video scaffold"
  noneOf:
    - "short-form brief"
    - "shoot brief"
    - "publish"
    - "evaluate"
  minScore: 6
routing:
  intent-tags:
    - video-production
    - video-export
    - render-handoff
  position: production
  lifecycle: pipeline
  produces:
    - .forsvn/artifacts/mkt/produced-videos/[slug]/manifest.md
    - .forsvn/artifacts/mkt/produced-videos/[slug]/scenes/[shot-id].md
    - .forsvn/artifacts/mkt/produced-videos/[slug]/hyperframes/scaffold.html
    - .forsvn/artifacts/mkt/produced-videos/[slug]/remotion/scaffold.tsx
    - .forsvn/artifacts/mkt/produced-videos/[slug]/vercel-ai-cli.md
  consumes:
    - .forsvn/artifacts/mkt/short-form-brief/[slug]/brief.md
    - .forsvn/artifacts/mkt/short-form-brief/[slug]/variants/[platform].md
    - brand/BRAND.md
    - brand/DESIGN.md
  requires:
    - brand/BRAND.md
    - brand/DESIGN.md
    - upstream brief-shortform artifact OR hand-written video-brief matching the schema
  defers-to:
    - skill: brief-shortform
      when: "no short-form-brief artifact exists yet for the target video"
    - skill: create-brand
      when: "no brand tokens defined yet"
    - skill: write-copy
      when: "the copy to render on-screen is missing or weak"
  parallel-with: []
  interactive: true
  estimated-complexity: medium
---

# Produce Video — Multi-Runtime Export Bundle Orchestrator

*Production skill. Converts a brief-shortform artifact into a multi-runtime export bundle: canonical manifest + per-shot prompts + HyperFrames scaffold + Remotion scaffold + Vercel AI CLI README. The operator picks the downstream runtime.*

**Core Question:** "Could any downstream runtime (HyperFrames / Remotion / Vercel AI CLI / Hyx / Freepik / a human editor) produce the right video from this bundle without a single follow-up question?"

> v1 export-mode only — no rendering runtime is invoked. See [`references/format-conventions.md`](references/format-conventions.md) for the manifest + per-shot prompt + scaffold schemas. See [`references/video-brief-schema.md`](references/video-brief-schema.md) for the input contract.

## Critical Gates — Read First

Non-negotiable constraints — brief 04 § Production Principle + § Anti-patterns:

1. **Export-mode floor.** v1 does NOT invoke HyperFrames render, `npx remotion render`, Vercel AI CLI, or any other runtime. The output is the bundle (manifest + scenes + scaffolds + README) — the operator runs it through their chosen runtime. If an upstream caller passes `--publish`, `--render`, or `--auto-run`, return `BLOCKED` with a one-line "render/publish modes deferred to v2" message. No silent fall-throughs.
2. **Schema-and-CTA compliance.** The canonical `manifest.md` must validate against `references/video-brief-schema.md` (all required fields, valid aspect, shot durations sum to total length). The CTA copy must appear verbatim in the final shot's `on_screen_text` AND the manifest's top-level `cta` field. Critic Gate 1 enforces.
3. **Brand-mark fidelity.** No hallucinated logos. Every per-shot prompt cites brand assets from `brand/DESIGN.md` only — solid-color placeholder when an asset is missing, NEVER an invented logo. Critic Gate 2 enforces.
4. **Caption-pace floor.** On-screen text density per shot ≤ 3 words per second of shot duration. Critic Gate 3 enforces. Falsifiable without rendering: `words(on_screen_text) ÷ duration_seconds ≤ 3.0`.

## Inputs

| Artifact | Required? | What it provides |
|----------|-----------|------------------|
| `.forsvn/artifacts/mkt/short-form-brief/[slug]/brief.md` (or `variants/[platform].md`) | **required** (primary path) | Hook · shot list · on-screen text choreography · audio plan · caption · CTA · aspect · length · production notes |
| Hand-written video-brief matching `references/video-brief-schema.md` | **alt path** | Same fields as the brief-shortform output — schema-validated at pre-dispatch |
| `brand/BRAND.md` | **required** | Voice, archetype, sacred elements (do-not-touch rails for runtime + TTS) |
| `brand/DESIGN.md` | **required** | Color tokens (hex + name), type scale, motion permissions, surface conventions |
| Target platforms | optional | Defaults to the brief's `hero_platform` + `variants`; can be overridden |

If `brand/BRAND.md` or `brand/DESIGN.md` is missing → return `NEEDS_CONTEXT` and defer to `create-brand`.
If neither a brief-shortform artifact nor a schema-compliant video-brief is found → return `NEEDS_CONTEXT` and defer to `brief-shortform`.

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

All 5 outputs always emitted. Operator picks the downstream runtime — skill never invokes one. Full template + field definitions: [`references/format-conventions.md`](references/format-conventions.md).

## Quality Gate

Single critic agent runs before delivery — `agents/critic-agent.md` enforces brief 04 spec compliance against 4 dimensions:

- [ ] **Gate 1 — Schema-and-CTA:** manifest validates against `video-brief-schema.md`; per-shot durations sum to total length; CTA copy present verbatim in BOTH the final shot's `on_screen_text` AND the manifest's `cta` field
- [ ] **Gate 2 — Brand-mark fidelity:** every per-shot prompt cites brand tokens from `brand/DESIGN.md` only; no fabricated hex / token names; placeholder rule active for missing assets; sacred elements from `brand/BRAND.md` respected
- [ ] **Gate 3 — Caption-pace:** for every shot, `words(on_screen_text) ÷ duration_seconds ≤ 3.0`; flagged shots get a fix instruction (shorten copy OR extend duration)
- [ ] **Gate 4 — Narrative arc:** shot 1 reads as a hook; middle shots build (problem → mechanism / proof / contrast); final shot closes with CTA. Soft check — FAILs are warnings, not blocks (brief 04 quality bar without sacrificing v1 ship-ability)

Critic FAIL on Gate 1 / 2 / 3 → re-dispatch prompt-author-agent with specific feedback (max 2 cycles). Critic FAIL on Gate 4 only → ship `done_with_concerns` with arc concerns pinned. Critic PASS twice with operator override → log override via `scripts/eval/log-critic-override.ts` per D8 contract.

## Chain Position

**Previous:** `brief-shortform` (required — the upstream brief), `create-brand` (required — brand tokens), `research-icp` (recommended — VoC for narration tone) | **Next:** operator runs the chosen scaffold through their runtime; rendered video feeds future `evaluate-content` / `evaluate-shortform` cycles inside an eval loop.

**Re-run triggers:** brief-shortform re-emitted, brand/DESIGN.md tokens updated, target platforms changed, operator wants a different runtime emphasis (re-run with `--rev=N` to preserve prior bundle).

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Prompt Author | 1 | `agents/prompt-author-agent.md` | Per-shot prompt (visual + OST + voice spec) + HyperFrames scaffold + Remotion scaffold + vercel-ai-cli README; assembles the full bundle |
| Critic | 2 (final) | `agents/critic-agent.md` | 4 dimensions: Schema-and-CTA / Brand-mark fidelity / Caption-pace / Narrative arc |

v1 is intentionally lean: sequential prompt-author → critic. Mirrors D11 produce-asset pattern. Per-shot parallelism is a v2 surface (decision D14 sub-decision #4); narrative coherence in long videos is parked (brief 04 targets short-form).

## Routing + Dispatch

Single route in v1:

```
ROUTE A (export-mode):
  1. Pre-Dispatch — locate brief-shortform artifact (or schema-compliant video-brief);
     read brand/BRAND.md + brand/DESIGN.md; validate against video-brief-schema.md
  2. Dispatch: prompt-author-agent (assembles full bundle: manifest + scenes/ + hyperframes/ + remotion/ + vercel-ai-cli.md)
  3. Dispatch: critic-agent on the assembled bundle
  4. Critic FAIL on Gate 1/2/3 → re-dispatch prompt-author-agent with feedback (max 2 cycles)
  5. Critic FAIL on Gate 4 only → ship done_with_concerns
  6. Critic PASS → write bundle to .forsvn/artifacts/mkt/produced-videos/[slug]/
  7. Return bundle path + shot count + runtime choices ("Run hyperframes/scaffold.html through `hyperframes preview`, OR remotion/scaffold.tsx through `npx remotion preview`, OR pipe scenes/ through your image-gen CLI per vercel-ai-cli.md.")
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

[`references/anti-patterns.md`](references/anti-patterns.md). Re-read before any bundle ships. 6 orchestrator-level patterns (skipping brief read, hallucinating logos, silent aspect overrides, copy synonymizing, render-mode misroute, padding shot durations to hit length) + 4 cross-cutting marketing-stack rows (cross-stack contract drift, brand-system absent → token fabrication, skill-deference miss, artifact schema drift).

Most common in practice: hallucinated logos (Gate 2), caption-pace overshoot on hook shots (Gate 3), and inventing CTAs the brief didn't specify.

## Completion Status

End with one status:

- `DONE` — manifest + scenes/ + hyperframes/ + remotion/ + vercel-ai-cli.md written, critic PASS on all 4 gates
- `DONE_WITH_CONCERNS` — bundle written; critic FAILed only on Gate 4 (narrative arc — soft) OR on a single secondary issue. Concerns pinned at top of manifest
- `NEEDS_CONTEXT` — brief-shortform artifact missing AND no schema-compliant video-brief supplied; OR brand files missing; OR aspect/length not derivable from brief
- `BLOCKED` — `--publish` / `--render` / `--auto-run` requested (deferred to v2); critic FAILed twice on Gate 1/2/3

## Next Step

Operator runs the chosen scaffold through their runtime:

- **HyperFrames:** `hyperframes preview manifest.md` (uses inlined scenes JSON) or `hyperframes render hyperframes/scaffold.html`
- **Remotion:** `npx remotion preview remotion/scaffold.tsx` or `npx remotion render remotion/scaffold.tsx`
- **Vercel AI CLI / Hyx / Freepik / any image-gen tool:** follow `vercel-ai-cli.md` to pipe per-shot prompts through the installed tool, then assemble with their preferred editor

After rendering, operator marks the manifest's verification checklist for each shot. When all shots are verified on-spec, the produced video is ready for downstream eval cycles.

## References

- **Shared:** `references/_shared/{eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, anti-sycophancy, artifact-contract-template}.md` (synced via `scripts/sync-skill-support.mjs` — currently broken for 2.0 layout per D8 finding; this skill lists them as expected dependencies for when sync is fixed)
- **Frameworks** (`references/`): `format-conventions.md` (manifest + per-shot prompt + scaffold schemas), `video-brief-schema.md` (input contract + brief-shortform field map), `anti-patterns.md` (6 orchestrator + 4 cross-cutting rows)
- **Agents (`agents/`):** 2 agents — see Agent Manifest above
- **Upstream:** `skills/marketing/brief-shortform/` (the brief this skill consumes); `skills/marketing/create-brand/` (brand tokens this skill respects)

## Worked Example (deferred)

End-to-end Route A walkthrough (TikTok hero brief → bundle with 5 shots + critic PASS) is deferred to a follow-up — v1 ships the skill scaffold; worked examples land when the first real produce-video run completes in a project.
