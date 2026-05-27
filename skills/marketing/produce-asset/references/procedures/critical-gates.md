# Critical Gates — produce-asset (full)

Non-negotiable constraints from brief 04 § Production Principle + § Anti-patterns. The shared production-skill contract (tool-agnostic export-mode floor, brand-mark fidelity, lean 2-agent dispatch, pipeline lifecycle) is canonical in [`../_shared/production-pattern.md`](../_shared/production-pattern.md).

## 1. Tool-agnostic by design

This stack does not call image-gen APIs, Figma MCP, or any external rendering service — by design, it holds no API keys. The output is a prompt + manifest you run through your own engine.

If an upstream caller passes `--publish` or `--api-render`, return:

> `BLOCKED — this stack emits render-ready prompts; it does not call render engines. Run the emitted prompt through your engine.`

No silent fall-throughs.

## 2. No hallucinated logos or brand marks

If `brand/BRAND.md` or `brand/DESIGN.md` references a logo asset that doesn't exist on disk, the prompt MUST instruct the renderer to leave the logo slot as a solid-color placeholder, NEVER to generate a stand-in logo. Critic Gate 3 enforces.

## 3. Aspect ratio + safe zones are spec, not suggestion

Every prompt carries the platform-aware aspect ratio (1:1 / 4:5 / 9:16 / 16:9 / OOH custom) + safe-zone definition from the brief-graphic artifact. The renderer must produce on-spec output or the asset gets rejected at the manifest's verification step. No silent aspect overrides.

## 4. Copy-to-render preserved verbatim

When the brief carries copy slots (headline, CTA, captions), the prompt instructs the renderer to render the exact strings — no synonymizing, no "improving" the copy, no font substitutions that compromise legibility. The brief is the source of truth for what the asset says.
