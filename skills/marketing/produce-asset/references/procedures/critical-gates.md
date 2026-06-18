# Critical Gates — produce-asset (full)

Non-negotiable constraints from brief 04 § Production Principle + § Anti-patterns. The shared production-skill contract (tool-agnostic export-mode floor, brand-mark fidelity, lean 2-agent dispatch, pipeline lifecycle) is canonical in [`../_shared/production-pattern.md`](../_shared/production-pattern.md).

## 1. Tool-agnostic by design

This stack does not call image-gen APIs, Figma MCP, or any external rendering service — by design, it holds no API keys. The output is a prompt + manifest you run through your own engine.

If an upstream caller passes `--publish` or `--api-render`, return:

> `BLOCKED — this stack emits render-ready prompts; it does not call render engines. Run the emitted prompt through your engine.`

**There is no `/produce-graphic` verb** — `produce-asset` is the closest skill and it does not render. The engines that actually turn the prompt into pixels (OpenDesign / Paper / Gemini), their prerequisites, the always-available headless HTML + `@font-face` fallback, and the render→show→iterate checkpoint for brand-critical output: [`../_shared/render-engines.md`](../_shared/render-engines.md). Rendering happens through the operator's own connected engine via the `execution-fork.md` Assisted/Direct path — batch-checked first by `capability-preflight.md`.

No silent fall-throughs.

## 2. No hallucinated logos or brand marks

If `brand/BRAND.md` or `brand/DESIGN.md` references a logo asset that doesn't exist on disk, the prompt MUST instruct the renderer to leave the logo slot as a solid-color placeholder, NEVER to generate a stand-in logo. Critic Gate 3 enforces.

## 3. Aspect ratio + safe zones are spec, not suggestion

Every prompt carries the platform-aware aspect ratio (1:1 / 4:5 / 9:16 / 16:9 / OOH custom) + safe-zone definition from the brief-graphic artifact. The renderer must produce on-spec output or the asset gets rejected at the manifest's verification step. No silent aspect overrides.

## 4. Copy-to-render preserved verbatim

When the brief carries copy slots (headline, CTA, captions), the prompt instructs the renderer to render the exact strings — no synonymizing, no "improving" the copy, no font substitutions that compromise legibility. The brief is the source of truth for what the asset says.

## Brief-first + closing the loop (entry/exit bookends)

These are not numbered gates — they are the entry and exit conditions that make the brief binding, shared across the producing skills via `../_shared/execution-fork.md` § "Closing the loop".

- **Brief-first (entry).** No prompts/manifest before a brief exists. Invoked without a `brief-graphic` / `brief-landing-page` slot artifact → `NEEDS_CONTEXT` (defer to `brief-graphic`). Never synthesize prompts from a bare ask or token docs alone — the brief is the spec.
- **Grounded-and-dialected (authoring).** Realized-surface grounding is mandatory *in the prompt*, not only at the exit: every per-slot prompt carries the **Realized-Surface Anchor** (the brief's pulled surface, or its explicit fallback line — never silent) and a non-stub **Engine Dialect** keyed to the bound `image` target. Enforced by critic Gates 8–9; depth in [`../_shared/image-engine-dialects.md`](../_shared/image-engine-dialects.md) + [`../_shared/realized-surface-grounding.md`](../_shared/realized-surface-grounding.md). These are quality gates layered on top of the four safety gates above, not new safety gates.
- **Check-then-accept (exit, Assisted/Direct).** When the operator picks Assisted/Direct and a real render is produced, the render is **not "done" until scored against the brief *and* its realized surface** — `evaluate-asset` inside an eval loop, or an explicit squint-test against the cited realized surface (`../_shared/realized-surface-grounding.md`) for a quick pass. Score the re-ingested render, never the prompt. Off-brief output is not accepted or committed — it routes back to the brief or a re-render.
