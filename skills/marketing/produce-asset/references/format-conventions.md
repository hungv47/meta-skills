---
title: Format Conventions — produce-asset manifest + per-slot prompt schema
lifecycle: canonical
status: stable
produced_by: produce-asset
provenance:
  extracted_from: implementation-roadmap/execution-evaluation/brief-pack/04-production-layer.md § produce-asset + sources/IDEA-4a-execution-production.md § 1
  extracted_at: 2026-05-19
consumers: produce-asset SKILL.md + 2 agents (prompt-author / critic) + downstream rendering tools (Midjourney / DALL·E / Imagen / Claude Design / Figma / human designer)
load_class: PROCEDURE
---

# Format Conventions — produce-asset

> Schemas in this file are cross-stack contracts. Renaming a section, reordering fields, or changing a frontmatter key requires atomic update of downstream consumers (renderers + future evaluate-content/-ad skills that score produced assets against the brief's hypothesis).

## Artifact tree

```
docs/forsvn/artifacts/marketing/produced-assets/
└── [slug]/
    ├── manifest.md
    └── prompts/
        ├── [slot-id-1].md
        ├── [slot-id-2].md
        └── ...
```

`[slug]` matches the upstream brief-graphic slug (or the lp-brief asset-slot parent slug if invoked from inside a landing-page brief). Per-slot prompt filenames use the slot ID from the brief.

---

## Manifest schema (`manifest.md`)

```markdown
---
skill: produce-asset
version: 1
date: [today]
status: done | done_with_concerns | blocked | needs_context
slug: [matches upstream brief slug]
source_brief: [docs/forsvn/artifacts/marketing/design-briefs/[slug].md OR lp-brief asset-slot path]
target_platforms: [list, e.g., instagram-carousel, linkedin-doc, og-card]
slot_count: [N]
provenance:
  skill: produce-asset
  run_date: [today]
  input_artifacts:
    - [source_brief path]
    - brand/BRAND.md
    - brand/DESIGN.md
  output_eval: null  # set when a downstream eval cycle scores the rendered assets
---

# Produced-Asset Manifest — [slug]

**Source brief:** [path]
**Target platforms:** [comma-separated list]
**Slot count:** [N]
**Status:** [done | done_with_concerns | blocked | needs_context]

## Slots

| Slot ID | Platform | Aspect | Prompt File | Rendered File (operator fills) | Verified |
|---|---|---|---|---|---|
| [slot-id-1] | [platform] | [aspect] | `prompts/[slot-id-1].md` | _operator-supplied path or URL_ | [ ] |
| [slot-id-2] | [platform] | [aspect] | `prompts/[slot-id-2].md` | _operator-supplied path or URL_ | [ ] |

## Verification Checklist (per slot — operator fills after each render)

For each slot, mark each spec gate after the rendered asset is reviewed:

### [slot-id-1]
- [ ] Aspect ratio matches the brief (no silent override by renderer)
- [ ] Safe zones honored (no critical content under platform UI overlays)
- [ ] Legibility passes contrast floor from the brief (AA / AAA as specified)
- [ ] No hallucinated logos or brand marks (placeholder used where assets don't exist)
- [ ] Color fidelity matches brand tokens (renderer didn't silently shift hex)

### [slot-id-2]
[Same five gates]

## Operator Next Steps

1. Open each prompt file under `prompts/` and run through your chosen renderer:
   - Image-gen tools (Midjourney / DALL·E / Imagen / Claude Design): paste the prompt body, run, save the output
   - Figma / human designer: pass the prompt file as the spec
2. Save the rendered asset to `docs/forsvn/artifacts/marketing/produced-assets/[slug]/rendered/[slot-id].[ext]` (or any path you prefer; update the manifest's "Rendered File" column with the path)
3. Mark the verification checklist for each slot after reviewing the rendered output
4. When all slots are verified, the produced assets are ready for downstream eval cycles (future `evaluate-content` / `evaluate-ad` inside an eval-loop)

## Re-run

If the brief changes or a slot needs a sharpened prompt: re-run `produce-asset` with `--rev=N` to write to `docs/forsvn/artifacts/marketing/produced-assets/[slug]/v[N]/...` and preserve prior versions.
```

---

## Per-slot prompt schema (`prompts/[slot-id].md`)

```markdown
---
skill: produce-asset
version: 1
date: [today]
slot_id: [slot-id]
platform: [target-platform]
aspect_ratio: [from brief — 1:1, 4:5, 9:16, 16:9, custom]
---

# Render Prompt — [Slot ID]

## Render-Ready Prompt

[The full prompt body. Renderer-agnostic — subject → composition → style → lighting → color → type → copy placement → anti-patterns. See agents/prompt-author-agent.md § Prompt body conventions.]

## Platform Spec (verbatim — do not override)

- **Aspect ratio:** [from brief]
- **Safe zones:** [from brief — top/bottom platform-chrome reservations]
- **Type scale:** [from brand/DESIGN.md]
- **Contrast floor:** [from brief — e.g., AAA on body, AA on supporting]
- **File format:** [PNG / JPG / SVG / etc.]
- **Resolution:** [pixel dimensions]

## Copy to Render (verbatim — no synonymizing)

- **Headline:** "[exact string from brief]"
- **Subhead:** "[exact string from brief]"
- **CTA:** "[exact string from brief]"
- **Body:** "[exact string from brief]"

## Brand Tokens (verbatim — no fabrication)

- **Primary color:** [hex] (token: [name from DESIGN.md])
- **Accent colors:** [hex list with token names]
- **Primary type:** [font family, weight]
- **Surface:** [paper / matte / glass — glass only if DESIGN.md permits]

## Anti-Patterns (must be in every prompt)

DO NOT:
- Generate a logo if no logo asset exists on disk — leave the logo slot as a solid-color placeholder of the brand's primary color
- Override the aspect ratio (Midjourney: respect `--ar`; DALL·E: respect the size parameter; human designer: respect the spec)
- Substitute copy strings (renderer is a typesetter, not a copywriter)
- Strip EXIF or override sRGB/color profile silently
- Add watermarks unless the brief explicitly requested them
- Output every variant — render the single composition described; the operator will request variants explicitly if needed

## Realized-Surface Anchor (required)

[The realized surface this asset is designed against, carried through from the brief's reference-direction: path/URL + what was taken (composition / light / type / density / grading), fed into the Engine Dialect (`--sref` / edit base). If the brief recorded none, copy its explicit fallback verbatim: `No realized surface available — designing from DESIGN.md + CREATIVE-DIRECTION.md tokens only`. Never omitted, never silent — see `references/_shared/realized-surface-grounding.md`.]

## Engine Dialect (required — per-engine controls + craft)

[The bound `tool_targets.image` engine's dialect, OR a multi-engine hints table when tool-agnostic (≥3 families). Speak real controls + the text-in-image routing caveat; route copy-critical slots to a strong-text engine. Spellings are a snapshot — verify current syntax. Full dialect: `references/_shared/image-engine-dialects.md`. Examples:]

**Midjourney (v7):** `--ar [aspect] --style raw --stylize [0-1000]`; style ref `--sref [url] --sw [0-1000]`; subject lock `--oref [url] --ow [0-1000]`; negative `--no [x]`. Weak in-image text → typeset copy separately or route elsewhere.
**OpenAI `gpt-image-1`:** `size` `[1024x1024 | 1536x1024 | 1024x1536]`; `quality` `[low|medium|high]`; `background` `[transparent|opaque]`. Strong text → prefer for copy-heavy / alpha slots.
**Imagen 4 (Vertex AI):** `aspectRatio` `[1:1 | 3:4 | 4:3 | 9:16 | 16:9]`; `negativePrompt`; disable default LLM prompt-enhancement for exact brand control.
**Headless HTML + `@font-face`:** pixel-exact copy + exact hex; the floor for copy-critical OG/social cards (`references/_shared/render-engines.md`).
```

---

## Field semantics

### Manifest

| Field | Type | Notes |
|---|---|---|
| `skill` | kebab-case | Always `produce-asset` |
| `version` | integer | Artifact version (increment on `--rev=N` re-run) |
| `date` | ISO YYYY-MM-DD | Original creation date; do not update on edits in place |
| `status` | enum | `done` / `done_with_concerns` / `blocked` / `needs_context` per Completion Status Protocol |
| `slug` | kebab-case | Matches upstream brief slug |
| `source_brief` | project-relative path | Single brief; for lp-brief asset-slots, points to the slot-specific prompt file |
| `target_platforms` | list of strings | Subset of platforms the brief defined |
| `slot_count` | integer | Number of prompt files under `prompts/` |
| `provenance` | block (generation variant) | Required per D8 contract; see `references/_shared/artifact-contract-template.md` |

### Per-slot prompt

| Field | Type | Notes |
|---|---|---|
| `skill` | kebab-case | Always `produce-asset` |
| `version` | integer | Mirrors manifest version |
| `date` | ISO YYYY-MM-DD | Same as manifest |
| `slot_id` | kebab-case | Stable identifier (e.g., `ig-carousel-slide-1`, `linkedin-doc-cover`) |
| `platform` | kebab-case | Specific platform key (e.g., `instagram-carousel`, `og-card`) |
| `aspect_ratio` | string | E.g., `1:1`, `4:5`, `9:16`, `16:9`, `1.91:1`, `custom-1234x567` |

---

## Required body sections (cross-stack contract)

In order. Renaming or reordering breaks downstream consumers + critic.

### Manifest

1. **Header block** (Source brief / Target platforms / Slot count / Status)
2. **Slots table** (6 columns: Slot ID / Platform / Aspect / Prompt File / Rendered File / Verified)
3. **Verification Checklist** (per slot, 5 spec gates each)
4. **Operator Next Steps** (numbered list)
5. **Re-run** (1-line note on `--rev=N` semantics)

### Per-slot prompt

1. **Render-Ready Prompt** (the universal renderer body)
2. **Platform Spec (verbatim)**
3. **Copy to Render (verbatim)**
4. **Brand Tokens (verbatim)**
5. **Anti-Patterns (DO NOT list)**
6. **Realized-Surface Anchor** (required; cites the brief's pulled surface + what was taken, or copies the explicit fallback line — never omitted, never silent)
7. **Engine Dialect** (required; the bound engine's dialect, or a multi-engine hints table when tool-agnostic — never a stub line)
8. **Change Log** (cycle 2+ only; lists every edit traced to a critic gate)

---

## Path safety

- Slugs must be kebab-case, `^[a-z0-9][a-z0-9-]{0,79}$`.
- Slot IDs must be kebab-case, same regex.
- No path traversal in any field. Manifest's `Rendered File` column accepts operator-supplied paths but the produce-asset skill never reads them (operator-managed).

## Date / Resolution conventions

- Date: ISO `YYYY-MM-DD` in frontmatter; in body text use the same format for consistency.
- Resolution: state pixel dimensions explicitly when the platform has a canonical size (e.g., IG square = 1080×1080); use "aspect-only" when the renderer chooses (e.g., Midjourney with `--ar 1:1` outputs at its current default).
- Hex: 6-character lowercase with `#` prefix (`#74b36b`, not `#74B36B` or `74b36b`).
