---
name: produce-video
description: "Turn a brief-shortform or brief-app-preview into a multi-runtime export bundle — manifest, per-shot prompts, production-lane scaffolds, and a post (assemble · grade · subtitle) stage. Two modes: shortform (social/promo) and app-preview (screenshot-driven product demo). Tool-agnostic — emits scaffolds + prompts and routes a script to a production lane; does NOT invoke render engines. Not for writing the brief (use brief-shortform / brief-app-preview) or publishing (use publish-social)."
argument-hint: "[brief slug or path] [--platforms tiktok,reels,...] [--surface app-store,onboarding,...]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.0.2"
  budget: standard
  estimated-cost: "$0.75-2.00"
---

# Produce Video — Multi-Runtime Export Bundle Orchestrator

Converts a `brief-shortform` OR `brief-app-preview` handoff into a runtime-agnostic export bundle. **Recommends a production lane; the operator picks the engine** ([`production-lanes.md`](references/production-lanes.md)). Capability metadata: `routing.yaml`. Agent table + 2 routes + 4/7 critic gates: `references/agent-manifest.md`.

**Two modes** (auto-detected from brief frontmatter `type`; schema in `references/video-brief-schema.md` § App-Preview):

- **shortform** — social/promo from `brief-shortform`. Hook-driven, narrative arc, CTA-anchored.
- **app-preview** — screenshot-driven product demo from `brief-app-preview`'s `handoff-produce-video.md`. Composition over real UI; no synthesis.

**Core question:** Could any downstream runtime produce the right video from this bundle without a follow-up question?

## Critical Gates — load first

Non-negotiable. Canonical: `references/_shared/production-pattern.md`.

1. **Tool-agnostic.** Stack does NOT invoke any runtime — holds no API keys. `--publish` / `--render` / `--auto-run` → `BLOCKED — emits render-ready prompts; does not call render engines.`
2. **Schema-and-CTA** (Gate 1). `manifest.md` validates against `video-brief-schema.md` (required fields, valid aspect, shot durations sum to total length). CTA verbatim in final shot's `on_screen_text` AND manifest top-level `cta`.
3. **Brand-mark fidelity** (Gate 2). No hallucinated logos. Every per-shot prompt cites assets from `brand/DESIGN.md` only — solid-color placeholder when missing, NEVER invented logo.
4. **Caption-pace floor** (Gate 3). `words(on_screen_text) ÷ duration_seconds ≤ 3.0` per shot.

## Inputs & Output

Input tables, `NEEDS_CONTEXT` triggers, bundle tree, chain + re-run triggers: `references/procedures/inputs-and-outputs.md`.

- **Shortform inputs:** `brief-shortform` artifact (or schema-compliant video-brief) + `brand/BRAND.md` + `brand/DESIGN.md` + **soft-required** `brand/FRAME.md` (frame direction; path + heading match). Absent → flag `frame_direction: absent`, fall back to DESIGN/CREATIVE-DIRECTION tokens (never silent). Slot table + degradation: [`video-brief-schema.md`](references/video-brief-schema.md) § Brand frame inputs.
- **App-preview inputs:** `handoff-produce-video.md` + companion `brief.md` + `assets.md` + source screenshots on disk. Brand files soft-required (skip when `brand_source: cold-start-hint`).
- **Bundle:** `docs/forsvn/artifacts/marketing/produced-videos/[slug]/` — always emits `manifest.md` + `scenes/[shot-id].md` + `hyperframes/scaffold.html` + `remotion/scaffold.tsx` + `vercel-ai-cli.md` + `post.md` (post stage).

## Quality Gate & Routing

Two routes by brief `type` at pre-dispatch (graphs + dispatch in [`agent-manifest.md`](references/agent-manifest.md)). Single critic before delivery: **Shortform — 4 gates** (Schema-and-CTA · Brand-mark · Caption-pace · Narrative arc [soft]); **App-preview — 7 gates** (+ Screenshot grounding · Interaction-vocab/mask-transform · Pointer/caption-band, all hard). Hard FAIL → re-dispatch prompt-author (max 2 cycles); Gate 4 FAIL → `DONE_WITH_CONCERNS`. Rubric + failures: [`quality-gate.md`](references/procedures/quality-gate.md).

## Artifact Contract

- **Root + lifecycle:** `docs/forsvn/artifacts/marketing/produced-videos/[slug]/`, `pipeline`.
- **Manifest frontmatter (12):** `skill` · `version` · `date` · `status` · `slug` · `source_brief` · `target_platforms` · `aspect` · `length_seconds` · `shot_count` · `cta` · `provenance`.
- **Per-shot frontmatter (7):** `skill` · `version` · `date` · `shot_id` · `shot_index` · `duration_seconds` · `platform`.
- **Provenance:** `input_artifacts` = brief path + `BRAND.md` + `DESIGN.md` (+ `FRAME.md` when present) + `frame_direction` flag; `output_eval: null` until downstream `evaluate-shortform`/`evaluate-content`.
- **Cross-stack:** schema changes update `format-conventions.md` + `video-brief-schema.md` + upstream `brief-shortform` atomically.

Canonical: `references/_shared/artifact-contract-template.md`. Field defs + scaffolds: `references/format-conventions.md`. Brief-to-schema map: `references/video-brief-schema.md`.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 6 orchestrator · 3 app-preview · 4 cross-cutting.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- `DONE` — bundle written; critic PASS on all hard gates.
- `DONE_WITH_CONCERNS` — bundle written; Gate 4 (soft) FAIL or single secondary issue. Concerns pinned atop manifest.
- `NEEDS_CONTEXT` — brief missing AND no schema-compliant video-brief; or brand files missing; or aspect/length not derivable.
- `BLOCKED` — `--publish`/`--render`/`--auto-run` requested; or critic FAILed twice on any hard gate.

## Execution

Offer the registry-gated fork (category `video`) — **Brief-only**: run the scaffold + per-shot checklist (feeds `evaluate-shortform`); **Assisted/Direct**: render via a verified engine ([execution-fork.md](references/_shared/execution-fork.md); record `execution_mode`). Multi-shot Assisted/Direct: batch-check the render surface first ([capability-preflight.md](references/_shared/capability-preflight.md)). Bind the `video` target tool at brief-binding — inherit `tool_targets` or ask once (`references/_shared/tool-target.md`); tool-agnostic default. Session profile (single/multi): `references/_shared/execution-policy.md`.

## Worked Example

App-preview Route B (Tideline / App Store iOS handoff → 5-shot bundle + critic PASS): [`references/examples/app-preview-tideline-walkthrough.md`](references/examples/app-preview-tideline-walkthrough.md).
