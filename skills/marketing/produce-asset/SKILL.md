---
name: produce-asset
description: "Turns a brief-graphic artifact into render-ready prompts + an asset manifest. Tool-agnostic by design — emits prompts tuned for your chosen image engine (Midjourney / DALL·E / Imagen / Figma / designer); the stack holds no API keys and runs no render engines. Use when a design brief exists and you need production-ready prompts. Not for the copy that goes in the asset (use write-copy), the brief itself (use brief-graphic), or publishing the rendered asset (use publish-social)."
argument-hint: "[brief-graphic slug or path]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.1.1"
  budget: standard
  estimated-cost: "$0.50-1.50"
---

# Produce Asset — Render-Ready Prompt + Manifest Orchestrator

*Production skill. Converts brief-graphic → render-ready prompts + asset manifest.*

**Core Question:** "Can any downstream tool produce the right asset from this prompt without follow-up?"

> Tool-agnostic — emits prompts + manifest, no API keys. **No output variation** (VERBATIM, tier C — `_shared/options-selection.md`): "more" = a manifest re-run.

## Critical Gates — Read First

Non-negotiable. Full text: `references/procedures/critical-gates.md` [PROCEDURE].

1. **Tool-agnostic.** No image-gen APIs / Figma MCP. `--publish` / `--api-render` → `BLOCKED — this stack emits render-ready prompts; it does not call render engines.`
2. **No hallucinated logos / brand marks.** Missing logo on disk → solid-color placeholder slot, never a stand-in. Critic Gate 3.
3. **Aspect ratio + safe zones are spec.** Brief's aspect (1:1 / 4:5 / 9:16 / 16:9 / OOH) + safe zones verbatim into every prompt. No silent overrides.
4. **Copy-to-render verbatim.** Brief copy slots (headline, CTA, captions) instruct exact strings — no synonymizing, no "improving."

## Before Starting

**Required:** the brief — `docs/forsvn/artifacts/marketing/design-briefs/[slug].md` (or a brief-landing-page asset-slot) — plus `brand/BRAND.md` + `brand/DESIGN.md`. Brief missing → `NEEDS_CONTEXT` (defer to brief-graphic); brand files missing → `NEEDS_CONTEXT` (defer to create-brand).

## Pre-Dispatch (Cold Start)

Resolve from the brief + brand files first; ask once (bundled) only for what's missing:

1. **Brief** — brief-graphic slug or path. → routing only
2. **Target platforms** — defaults to the brief's `target_platforms`. → routing only
3. **Render-mode hint** — default `export-mode`. → routing only

## Quality Gate

Critic (`agents/critic-agent.md`) verifies brief 04 spec compliance:

- [ ] Every brief slot has `prompts/[slot-id].md` — no orphans, no extras
- [ ] Aspect + safe zones verbatim per prompt
- [ ] Hallucinated-logo prohibition + placeholder rule active
- [ ] Copy-to-render verbatim; EXIF / aspect overrides absent
- [ ] Manifest verification checklist matches the brief's spec gates (aspect, safe zones, legibility, brand-mark + color fidelity)

Auto-fail: any invented brand mark or non-verbatim copy slot. FAIL → re-dispatch prompt-author with feedback (max 2 cycles, then `BLOCKED`). PASS twice with operator override → log via `scripts/log-critic-override.ts` per D8 contract.

## Agents + Dispatch

2 agents, sequential: **Prompt Author** (`agents/prompt-author-agent.md`) per slot → **Critic** (`agents/critic-agent.md`) on assembled manifest. Single route (export-mode). Pseudocode, re-run triggers, chain position: `references/procedures/dispatch-mechanics.md` [PROCEDURE]. Shared 2-agent pattern: `references/_shared/production-pattern.md` § 4.

## Artifact Contract

- **Manifest:** `docs/forsvn/artifacts/marketing/produced-assets/[slug]/manifest.md`
- **Per-slot prompts:** `docs/forsvn/artifacts/marketing/produced-assets/[slug]/prompts/[slot-id].md`
- **Lifecycle:** `pipeline` (regenerated; not canonical)
- **Frontmatter:** manifest — `skill/version/date/status/slug/source_brief/target_platforms/slot_count/provenance`; per-slot prompt — `skill/version/date/slot_id/platform/aspect_ratio`
- **Provenance:** `input_artifacts` = brief-graphic + `brand/BRAND.md` + `brand/DESIGN.md`. `output_eval: null` until eval scores rendered asset.
- **Cross-stack:** consumed by downstream renderers + future `evaluate-content` / `evaluate-ad`. Schema changes require atomic update with brief-graphic + brief-landing-page — never silently drift.

Full template + per-slot prompt schema: `references/format-conventions.md` [PROCEDURE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 5 orchestrator (skip brief read, hallucinate logos, silent aspect overrides, copy synonymizing, render-mode misroute) + 4 cross-cutting marketing-stack rows.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

End with one status:

- `DONE` — manifest + all per-slot prompts written, critic passed, Critical Gates green
- `DONE_WITH_CONCERNS` — delivered, secondary issues flagged (e.g., thin reference-image suggestion)
- `NEEDS_CONTEXT` — brief-graphic OR brand files missing, or target platforms undefined
- `BLOCKED` — `--publish` / `--api-render` requested, OR critic FAILed twice

## Execution

Offer the registry-gated fork (category `image`) — **Brief-only**: run the prompts, mark the manifest checklist (feeds `evaluate-asset`); **Assisted/Direct**: render via a verified engine. See `_shared/execution-fork.md`; record `execution_mode`. For Assisted/Direct multi-slot runs, batch-check the render surface first (`_shared/capability-preflight.md`).
At brief-binding, bind the `image` target tool — inherit `tool_targets` or ask once per `references/_shared/tool-target.md`; prompt dialect tunes to it, tool-agnostic stays the default.

## References

- `references/procedures/{critical-gates, dispatch-mechanics}.md`
- `references/{format-conventions, anti-patterns}.md`
- `references/_shared/{production-pattern, eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, anti-sycophancy, artifact-contract-template}.md`
- `references/_shared/execution-policy.md` — session execution profile
- Upstream: `skills/marketing/{brief-graphic, create-brand}/`

## Worked Example

A 2-slot brief → manifest + verbatim prompts, placeholder-logo discipline, critic PASS, Brief-only fork: [`references/examples/produce-asset-walkthrough.md`](references/examples/produce-asset-walkthrough.md) [EXAMPLE].
