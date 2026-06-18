# Worked Example — "launch-og" brief → manifest + a real filled-in prompt

Operator ask: *"Produce the assets for the launch OG brief."* (`/produce-asset launch-og`)

> Brand below is an **illustrative fictional brand** ("Relay", a dev-tool) — concrete so the
> filled prompt is real, not a brand canon. Your run uses your own `brand/DESIGN.md`.

## Pre-Dispatch

Brief resolved at `docs/forsvn/artifacts/marketing/design-briefs/launch-og.md` (2 slots: `og-main` 1.91:1, `ig-teaser` 4:5). `brand/BRAND.md` + `brand/DESIGN.md` present; the brief's reference-direction cited the shipped `relay.dev` landing hero as the realized surface. Target platforms inherited from the brief (`og`, `instagram`); render-mode default `export-mode`; session `tool_targets.image` unset → one tool-target ask → operator binds **gpt-image-1** (the OG card is copy-exact; in-image text legibility is load-bearing).

## Dispatch — Prompt Author (per slot, sequential)

### Filled-in prompt: `og-main` (the real artifact, not a template)

```markdown
---
skill: produce-asset
version: 1
date: 2026-06-18
slot_id: og-main
platform: og-card
aspect_ratio: 1.91:1
---

# Render Prompt — og-main

## Render-Ready Prompt

A 1200×630 Open Graph card announcing a developer-tool launch. Single focal composition:
the product wordmark lockup sits on the left two-thirds against an even pine field under a
soft top-down key light; the right third is quiet negative space for the link-preview crop.
Flat, matte, editorial — no gradients, no glass, no 3D bevel. Foreground: the headline in a
large grotesque display weight, with a single thin sand-accent underline rule beneath the
product name. Background: an even pine wash with a barely-there 4% corner vignette to hold
the type. Not photographic — this is a typographic brand card. Composition: focal hierarchy
= headline first, product name second, accent rule third; headline baseline on the lower
rule-of-thirds line; nothing critical in the outer 30px (OG crop-safe); the right-third void
is intentional, not empty.

## Platform Spec (verbatim — do not override)

- **Aspect ratio:** 1.91:1
- **Safe zones:** center-safe 1200×600; outer 30px may be cropped by the link preview
- **Type scale:** headline 64pt / product name 32pt / accent rule 2pt (from brand/DESIGN.md)
- **Contrast floor:** AAA on headline, AA on supporting
- **File format:** PNG sRGB
- **Resolution:** 1200×630

## Copy to Render (verbatim — no synonymizing)

- **Headline:** "Ship the loop, not the slides"
- **Subhead:** [none]
- **CTA:** [none]
- **Body:** [none]

## Brand Tokens (verbatim — no fabrication)

- **Primary color:** #1b4d3e (token: pine)
- **Accent colors:** #e8d5a8 (token: sand)
- **Primary type:** Söhne — semibold (headline), regular (product name)
- **Surface:** matte

## Anti-Patterns (must be in every prompt)

DO NOT:
- Generate a logo if no logo asset exists on disk — leave the logo slot as a solid #1b4d3e placeholder
- Override the aspect ratio (respect 1.91:1)
- Substitute copy strings (renderer is a typesetter, not a copywriter)
- Strip EXIF or override sRGB silently
- Add watermarks unless the brief requested them
- Output multiple variants — render the single composition described

## Realized-Surface Anchor (required)

Designed against the shipped **relay.dev landing hero** (screenshot in the brief's
reference-direction). Taken: the pine field + sand hairline rule, the left-weighted type
lockup, the matte no-gradient treatment, and the generous right-side negative space. The card
matches the live hero's *taste*, not only its hexes.

## Engine Dialect (required)

Bound engine: **gpt-image-1** — chosen because the card is copy-exact and OG text legibility
is load-bearing (Midjourney's weak in-image text would be a liability here).
- `size: 1536x1024` (nearest to 1.91:1; final-crop to 1200×630)
- `quality: high`
- `background: opaque`
- Fallback (no key): the **headless HTML + @font-face** floor — author the card in HTML with
  the brand @font-face block, screenshot at 1200×630 for pixel-exact copy. (Stylized
  alternative: Midjourney `--ar 191:100 --style raw --sref <relay.dev hero>` with copy
  typeset as a separate layer.)

## Change Log (only on cycle 2+)

[none — first cycle]
```

`prompts/ig-teaser.md` follows the same discipline at 4:5 (1080×1350), re-anchored to the same realized surface, same `gpt-image-1` dialect.

## Critic on the assembled manifest (9 gates)

| Check | Result |
|---|---|
| G1 Slot coverage — `prompts/[slot-id].md` for each, no orphans/extras | PASS (2/2) |
| G2 Brand-mark fidelity — placeholder rule, no hallucinated logo | PASS (`#1b4d3e` placeholder named) |
| G3 Aspect + safe zones verbatim | PASS |
| G4 Copy-to-render verbatim | PASS (exact-string quote) |
| G5 Brand-token fidelity — hex + token name | PASS |
| G6 Anti-pattern DO-NOT list present | PASS |
| G7 Manifest verification checklist mirrors brief spec gates | PASS |
| **G8 Realized-Surface Anchor present** | PASS (relay.dev hero cited + what was taken) |
| **G9 Engine Dialect + Composition** | PASS (gpt-image-1 dialect, non-stub; focal hierarchy named) |

PASS first cycle → no re-dispatch.

## Output

`docs/forsvn/artifacts/marketing/produced-assets/launch-og/manifest.md` (frontmatter: `skill: produce-asset`, `slug: launch-og`, `source_brief`, `target_platforms: [og, instagram]`, `slot_count: 2`, provenance `input_artifacts` = brief + BRAND.md + DESIGN.md, `output_eval: null`) + the two per-slot prompts.

**Execution fork** (category `image`, registry: gpt-image-1 verified) → **Assisted/Direct** available; if the operator declines, **Brief-only** hands the manifest checklist over and the rendered output re-ingests via the return-leg for `evaluate-asset` — scored against the *same* relay.dev surface.

**Completion:** DONE — manifest + 2 prompts written, critic PASS (9/9), gates green.

## What this example pins

- A **real filled-in prompt**, not a bracketed template — every section populated with concrete values.
- **Realized-Surface Anchor** carried from the brief into the prompt + fed to the dialect (Gate 8).
- **Engine Dialect** picked the strong-text engine *because* the slot is copy-exact, named the fallback floor (Gate 9) — not a stub `--ar` line.
- **Composition** named (focal hierarchy, rule-of-thirds baseline, the right-third void as intentional negative space) — not "nice layout".
- Missing logo → **placeholder slot**, never a generated stand-in (Gate 2). Headline copied as an exact string (Gate 4). Prompts + manifest only; no render engine called by the stack (Gate 1).
