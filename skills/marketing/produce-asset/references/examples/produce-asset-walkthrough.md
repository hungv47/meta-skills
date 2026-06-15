# Worked Example — "launch-og" brief → manifest + prompts

Operator ask: *"Produce the assets for the launch OG brief."* (`/produce-asset launch-og`)

## Pre-Dispatch

Brief resolved at `docs/forsvn/artifacts/marketing/design-briefs/launch-og.md` (2 slots: `og-main` 1.91:1, `ig-teaser` 4:5). `brand/BRAND.md` + `brand/DESIGN.md` present. Target platforms inherited from the brief (`og`, `instagram`); render-mode default `export-mode`; session `tool_targets.image` unset → one tool-target ask → operator picks **tool-agnostic**.

## Dispatch

**Prompt Author** (per slot, sequential):

- `prompts/og-main.md` — prompt seed from the brief verbatim; aspect `1.91:1 (1200×630)`; safe zone "title block ≤ 60% width, 48px inset" copied verbatim; copy slot headline `"Ship the loop, not the slides"` quoted as an exact string; brand tokens by hex from DESIGN.md; **logo file missing on disk → solid `#004700` placeholder slot named, no invented mark**.
- `prompts/ig-teaser.md` — same discipline at 4:5 (1080×1350).

**Critic** on the assembled manifest:

| Check | Result |
|---|---|
| Every brief slot has `prompts/[slot-id].md`, no orphans/extras | PASS (2/2) |
| Aspect + safe zones verbatim per prompt | PASS |
| No hallucinated logos; placeholder rule applied | PASS (placeholder noted in manifest) |
| Copy-to-render verbatim | PASS (exact-string quotes) |
| No EXIF/aspect overrides | PASS |
| Manifest verification checklist mirrors the brief's spec gates | PASS |

PASS first cycle → no re-dispatch.

## Output

`docs/forsvn/artifacts/marketing/produced-assets/launch-og/manifest.md` (frontmatter: `skill: produce-asset`, `slug: launch-og`, `source_brief`, `target_platforms: [og, instagram]`, `slot_count: 2`, provenance `input_artifacts` = brief + BRAND.md + DESIGN.md, `output_eval: null`) + the two per-slot prompts.

**Execution fork** (category `image`, registry: 0 verified engines) → **Brief-only**: manifest checklist handed to the operator; rendered output re-ingests via the return-leg for `evaluate-asset`.

**Completion:** DONE — manifest + 2 prompts written, critic PASS, gates green.

## What this example pins

- Missing logo produced a **placeholder slot**, never a generated stand-in (Gate 2).
- Headline copied as an exact string — no synonymizing (Gate 4).
- The skill emitted prompts + manifest only; no render engine was called (Gate 1).
