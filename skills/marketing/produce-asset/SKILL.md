---
name: produce-asset
description: "Turns a brief-graphic artifact into render-ready prompts + an asset manifest. Tool-agnostic by design — emits prompts tuned for your chosen image engine (Midjourney / DALL·E / Imagen / Figma / designer); the stack holds no API keys and runs no render engines. Use when a design brief exists and you need production-ready prompts. Not for the copy that goes in the asset (use write-copy), the brief itself (use brief-graphic), or publishing the rendered asset (use publish-social)."
argument-hint: "[design-brief slug or path]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.50-1.50"
---

# Produce Asset — Render-Ready Prompt + Manifest Orchestrator

*Production skill. Converts a brief-graphic artifact into a render-ready prompt + asset manifest the operator can run through any image-gen tool, vector tool, or human designer.*

**Core Question:** "Can any downstream tool (Midjourney / DALL·E / Imagen / Claude Design / Figma / human designer) produce the right asset from this prompt without a single follow-up question?"

> Tool-agnostic by design — the stack emits render-ready prompts + a manifest and holds no API keys; you run the prompt through your own image engine. See [`references/format-conventions.md`](references/format-conventions.md) for the manifest + prompt schema.

## Critical Gates — Read First

Non-negotiable constraints — brief 04 § Production Principle + § Anti-patterns:

1. **Tool-agnostic by design.** This stack does not call image-gen APIs, Figma MCP, or any external rendering service — by design, it holds no API keys. The output is a prompt + manifest you run through your own engine. If an upstream caller passes `--publish` or `--api-render`, return `BLOCKED — this stack emits render-ready prompts; it does not call render engines. Run the emitted prompt through your engine.` No silent fall-throughs.
2. **No hallucinated logos or brand marks.** If `brand/BRAND.md` or `brand/DESIGN.md` references a logo asset that doesn't exist on disk, the prompt MUST instruct the renderer to leave the logo slot as a solid-color placeholder, NEVER to generate a stand-in logo. Critic Gate 3 enforces.
3. **Aspect ratio + safe zones are spec, not suggestion.** Every prompt carries the platform-aware aspect ratio (1:1 / 4:5 / 9:16 / 16:9 / OOH custom) + safe-zone definition from the brief-graphic artifact. The renderer must produce on-spec output or the asset gets rejected at the manifest's verification step. No silent aspect overrides.
4. **Copy-to-render preserved verbatim.** When the brief carries copy slots (headline, CTA, captions), the prompt instructs the renderer to render the exact strings — no synonymizing, no "improving" the copy, no font substitutions that compromise legibility. The brief is the source of truth for what the asset says.

## Inputs

| Artifact | Required? | What it provides |
|----------|-----------|------------------|
| `.forsvn/artifacts/mkt/design-briefs/[slug].md` (or lp-brief asset-slot) | **required** | Per-asset spec: concept direction, platform, aspect, safe zones, copy slots, type scale, contrast, file format, image-gen prompt seed (if brief-graphic populated it) |
| `brand/BRAND.md` | **required** | Voice, archetype, sacred elements (do-not-touch rails for the renderer) |
| `brand/DESIGN.md` | **required** | Color tokens (hex + token name), type scale, motion permissions if asset is animated, surface conventions (paper / matte / glass-if-permitted) |
| Target platforms | optional | Defaults to the brief's `target_platforms`; can be overridden if producing for a subset |
| Render-mode hint | optional | Default: `export-mode` — the prompt is tuned for hand-off to your chosen engine (image-gen API / Figma / human designer) |

If `brand/BRAND.md` or `brand/DESIGN.md` is missing → return `NEEDS_CONTEXT` and defer to `create-brand`.
If the brief-graphic artifact is missing → return `NEEDS_CONTEXT` and defer to `brief-graphic`.

## Output

Primary artifact: `.forsvn/artifacts/mkt/produced-assets/[slug]/manifest.md` — single-file manifest listing every slot the brief defined, with status (prompt-ready / rendered / approved), file paths for the rendered asset (filled in by the operator after rendering), and verification checklist (aspect, safe zones, legibility, brand-mark fidelity).

Per-slot prompts: `.forsvn/artifacts/mkt/produced-assets/[slug]/prompts/[slot-id].md` — one file per asset slot the brief defined. Each file carries the render-ready prompt body, platform spec injection, copy-to-render, anti-patterns, and (optional) reference-image suggestions.

Full template + field definitions: [`references/format-conventions.md`](references/format-conventions.md).

## Quality Gate

Single critic agent runs before delivery — `agents/critic-agent.md` enforces brief 04 spec compliance:

- [ ] Every slot in the brief has a corresponding `prompts/[slot-id].md` (no orphan slots, no extra slots beyond what the brief defined)
- [ ] Every prompt carries the brief's aspect ratio + safe-zone definition verbatim
- [ ] Every prompt instructs the renderer to NEVER hallucinate logos / brand marks; placeholder rule active when assets don't exist on disk
- [ ] Every prompt carries copy-to-render verbatim from the brief (no synonyms, no "improvements")
- [ ] EXIF / aspect overrides explicitly forbidden in the prompt
- [ ] Manifest's verification checklist matches the brief's spec gates (aspect, safe zones, legibility, brand-mark fidelity, color fidelity)

Critic FAIL → re-dispatch prompt-author-agent with specific feedback (max 2 cycles). Critic PASS twice with operator override → log override via `scripts/eval/log-critic-override.ts` per D8 contract.

## Chain Position

**Previous:** `brief-graphic` (required — the per-asset brief), `create-brand` (required — brand tokens) | **Next:** operator runs the emitted prompts through their chosen renderer; rendered asset feeds future `evaluate-content` / `evaluate-ad` cycles inside a loop.

**Re-run triggers:** brief-graphic re-emitted, brand/DESIGN.md tokens updated, target platforms changed, operator rejected a rendered asset and wants a sharpened prompt.

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Prompt Author | 1 | `agents/prompt-author-agent.md` | Per-slot prompt with platform spec injection, anti-pattern reminders, copy verbatim |
| Critic | 2 (final) | `agents/critic-agent.md` | Spec compliance: aspect, safe zones, brand-mark fidelity, copy verbatim, EXIF/aspect-override forbiddance |

Intentionally lean: sequential prompt-author → critic. No parallel Layer 1, no merge step, no variant agent. The work IS the prompt + manifest, not multi-perspective synthesis — deeper orchestration is not warranted.

## Routing + Dispatch

Single route:

```
ROUTE A (export-mode):
  1. Pre-Dispatch — read brief-graphic artifact + brand/BRAND.md + brand/DESIGN.md
  2. Dispatch: prompt-author-agent for EACH slot in the brief (sequential or parallel, operator choice via --parallel flag)
  3. Dispatch: critic-agent on the assembled manifest + all prompts
  4. Critic FAIL → re-dispatch prompt-author-agent for the failing slot(s) with feedback (max 2 cycles)
  5. Critic PASS → write manifest.md + prompts/[slot-id].md files
  6. Return manifest path + slot count + operator's next-step instruction ("Run the prompts through your chosen renderer; mark the manifest's verification checklist when each slot is on-spec.")
```

## Artifact Contract

- **Manifest path:** `.forsvn/artifacts/mkt/produced-assets/[slug]/manifest.md`
- **Per-slot prompts:** `.forsvn/artifacts/mkt/produced-assets/[slug]/prompts/[slot-id].md`
- **Lifecycle:** `pipeline` (regenerated by re-running; not canonical)
- **Frontmatter (manifest):** 9 fields — `skill` / `version` / `date` / `status` / `slug` / `source_brief` / `target_platforms` / `slot_count` / `provenance` (generation-variant per `references/_shared/artifact-contract-template.md`)
- **Frontmatter (per-slot prompt):** 6 fields — `skill` / `version` / `date` / `slot_id` / `platform` / `aspect_ratio`
- **Generation provenance:** required. `input_artifacts` lists the brief-graphic path + `brand/BRAND.md` + `brand/DESIGN.md`. `output_eval: null` until a downstream eval cycle scores the rendered asset.
- **Cross-stack contract:** consumed by downstream rendering tools (operator-chosen) + future `evaluate-content` / `evaluate-ad` cycles when produced assets are scored against the brief's hypothesis. Schema changes require atomic update across upstream callers (brief-graphic, lp-brief) — never silently drift.

Full template + field definitions + per-slot prompt schema: [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md). Re-read before any prompt ships. 5 orchestrator-level patterns (skipping brief read, hallucinating logos, silent aspect overrides, copy synonymizing, render-mode misroute) + 4 cross-cutting marketing-stack rows (cross-stack contract drift, brand-system absent → token fabrication, skill-deference miss, artifact schema drift).

Most common in practice: copy synonymizing (Critical Gate 4) and hallucinated logos (Critical Gate 2).

## Completion Status

End with one status:

- `DONE` — manifest + all per-slot prompts written, critic passed, brief 04 Critical Gates all green
- `DONE_WITH_CONCERNS` — manifest delivered but critic flagged secondary issues (e.g., one slot's reference-image suggestion was thin)
- `NEEDS_CONTEXT` — brief-graphic artifact missing OR brand/BRAND.md / brand/DESIGN.md missing OR target platforms not defined
- `BLOCKED` — `--publish` / `--api-render` requested (this stack emits render-ready prompts; it does not call render engines — run the emitted prompt through your engine); critic FAILed twice on spec compliance

## Next Step

Operator runs the emitted prompts through their chosen renderer (Midjourney / DALL·E / Imagen / Claude Design / Figma / human designer). After each render, operator marks the manifest's verification checklist for that slot. When all slots are verified on-spec, the rendered assets are ready for downstream eval cycles (future `evaluate-content` / `evaluate-ad` inside a loop).

## References

- **Shared:** `references/_shared/{eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, anti-sycophancy, artifact-contract-template}.md` (synced via `scripts/sync-skill-support.mjs` — currently broken for 2.0 layout per D8 finding; this skill lists them as expected dependencies for when sync is fixed)
- **Frameworks** (`references/`): `format-conventions.md` (manifest + per-slot prompt schema), `anti-patterns.md` (5 orchestrator + 4 cross-cutting rows)
- **Agents (`agents/`):** 2 agents — see Agent Manifest above
- **Upstream:** `skills/marketing/brief-graphic/` (the brief this skill consumes); `skills/marketing/create-brand/` (brand tokens this skill respects)

## Worked Example (deferred)

End-to-end Route A walkthrough (Instagram carousel from a brief-graphic artifact through manifest + 5 per-slot prompts + critic PASS) is deferred to a follow-up — v1 ships the skill scaffold; worked examples land when the first real produce-asset run completes in a project.
