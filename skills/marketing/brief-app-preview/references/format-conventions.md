# Format Conventions

> Loaded by the orchestrator and every craft agent to write artifacts in the canonical structure. Schema changes here require atomic update of `produce-video`'s `video-brief-schema.md` extension (WS4) and the cross-stack contract note in `SKILL.md` § Artifact Contract.

---

## §1 — `brief.md` Template

Path: `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/brief.md`

### Frontmatter (verbatim field order)

```yaml
---
type: app-preview-brief
role: hero
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: md         # html | md | none
decision_state: not_required # pending | approved | denied | suggested | not_required
review_tool: inline        # proof | inline | roughdraft | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
date: [YYYY-MM-DD]
slug: [slug]
feature: [free text — 1 feature only]
surface: app-store | onboarding | website | social
brand_mode: founder | company
market: [region]
screenshot_count: [int — total unique source files referenced]
beat_count: [int — beats in the sequence]
total_length_seconds: [number]
aspect: 9:16 | 1:1 | 16:9 | 4:5 | 2:3
brand_source: brand-md | cold-start-hint
critic_passes: [grounding, component-focus, beat-clarity, brand-fidelity, platform-fit]
critic_loop_count: [1 | 2]
---
```

### Body section headers (verbatim, in order)

```markdown
## TL;DR for the Editor
## Feature Promise
## Source Inventory
## Beat Sequence
## Crop / Mask Plan
## Interaction Choreography
## Motion Spec
## Caption Pack
## Pointer + Audio Plan
## Platform Spec
## What NOT To Do
## Handoff to produce-video
```

12 sections. The headers are verbatim (case, spacing, punctuation). Adding or renaming a section breaks the consumer contract with `produce-video` and the review tooling.

### Per-section format rules

**§ TL;DR for the Editor** — 3-5 bullets. The first bullet states the feature; the second names the surface; the third gives total length and beat count; the fourth flags brand_source.

**§ Feature Promise** — 1-2 sentences. Names the feature, what it does for the user. Written by intake-validator-agent and carried forward verbatim.

**§ Source Inventory** — table from intake-validator-agent's output: ID / path / state label / format / resolution / brand-fidelity check.

**§ Beat Sequence** — table from interaction-storyboard-agent's output: # / time / source ID(s) / interaction verb / what proves / caption / caption hold.

**§ Crop / Mask Plan** — table from flow-slicer-agent's output: beat / source ID / crop type / crop rectangle or selector / region purpose / justification.

**§ Interaction Choreography** — beat-by-beat justification from interaction-storyboard-agent + on-screen text choreography.

**§ Motion Spec** — table + source token inventory + source fidelity statement, from motion-spec-agent.

**§ Caption Pack** — every caption with timing, hold duration, OST scan status (PASS / FAIL with phrase if FAIL). Pulled from interaction-storyboard-agent + platform-format-agent OST scan.

**§ Pointer + Audio Plan** — pointer style + audio plan table, from motion-spec-agent.

**§ Platform Spec** — surface lock + compliance check + caption band geometry, from platform-format-agent.

**§ What NOT To Do** — 4-7 bullets. Skill-level + brief-specific anti-patterns. Pulled from `references/anti-patterns.md` + critic-agent's most-common patterns surfaced this run.

**§ Handoff to produce-video** — reference: see `handoff-produce-video.md`.

---

## §2 — `crop-map.md` Template

Path: `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/crop-map.md`

```markdown
---
type: app-preview-crop-map
slug: [slug]
brief: brief.md
beat_count: [N]
---

# Crop Map — [feature]

## Beat Table

| Beat | Source ID | Crop type | Crop rectangle / selector | Region purpose | Justification |
|------|-----------|-----------|---------------------------|----------------|---------------|
| ... | ... | ... | ... | ... | ... |

## Reading Notes
- Crop rectangles in source-screenshot pixels (origin: top-left)
- Component selectors only when source format has named nodes
- `full-screen` is the EXCEPTION — every full-screen row carries a justification

## Source Path Index

| ID | Path | Resolution |
|---|---|---|
| ... | ... | ... |
```

---

## §3 — `assets.md` Template

Path: `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/assets.md`

```markdown
---
type: app-preview-asset-manifest
slug: [slug]
brief: brief.md
asset_count: [N]
brand_source: brand-md | cold-start-hint
---

# Asset Manifest — [feature]

## Screenshots

| Asset ID | Path | Used in beats | State |
|---|---|---|---|
| S01 | [path] | B1, B2 | resting / interaction-start |
| ... | ... | ... | ... |

## Audio (planned)

| Asset ID | Type | Used in beats | Source |
|---|---|---|---|
| audio-tap | UI tap | B2 | operator-supplied or empty |
| ... | ... | ... | ... |

## Brand Tokens

| Token | Source | Used in |
|---|---|---|
| color.accent | brand/DESIGN.md | pointer, caption highlights |
| ... | ... | ... |

## Gaps

[Bulleted list of operator-supplied gaps that don't block delivery but need attention before render — e.g., "audio-whoosh not supplied; produce-video will default to silence for B3"]
```

---

## §4 — `handoff-produce-video.md` Template

Path: `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/handoff-produce-video.md`

```markdown
---
type: produce-video-input
source_brief: docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/brief.md
surface: [app-store | onboarding | website | social]
aspect: [aspect]
total_length_seconds: [N.N]
audio_default: [on | off]
shot_count: [N]
brand_source: [brand-md | cold-start-hint]
---

# Handoff to produce-video — [feature]

## Per-Shot Specification

| shot_id | source_id(s) | crop_rect / selector | mask_transform | pointer | caption_text | caption_band | duration_s |
|---------|--------------|----------------------|----------------|---------|--------------|--------------|------------|
| shot-01 | [ID] | [rect] | [transform] | [pointer spec] | [caption] | [band coords] | [N] |
| ... | ... | ... | ... | ... | ... | ... | ... |

## Caption Band Geometry

- Position: [bottom-quarter | bottom-center | center-baseline | upper-third]
- Height: [px @ source width]
- Safe-area inset: [px above / below active edge]

## Asset References

- Screenshots: see `assets.md` § Screenshots
- Audio: see `assets.md` § Audio (planned)
- Brand tokens: see `assets.md` § Brand Tokens

## Constraints (re-stated for produce-video)

- Length lock: [N]s
- Aspect lock: [aspect]
- Audio default: [on | off]
- OST scan: PASS (zero forbidden phrases) — re-scan on any caption rewrite
- Brand fidelity: every motion property maps to a token or source-sampled value

## Status

- Brief: status from `brief.md` frontmatter
- Critic: pass count + loop count from `brief.md` frontmatter
- Operator action: run through `produce-video [slug]` to emit the multi-runtime bundle
```

---

## §5 — Crop rectangle notation

Source-screenshot pixels, origin top-left:

```
[x, y, w, h]
- x: distance from source's left edge in pixels
- y: distance from source's top edge in pixels
- w: rectangle width in pixels
- h: rectangle height in pixels
```

Example: `[120, 180, 850, 520]` on a 1290×2796 source = a rectangle starting 120px from the left, 180px from the top, 850 wide, 520 tall.

Crop-relative coordinates (used in motion spec for pointer position within a crop): `crop-relative (x, y)` where x and y are pixels from the crop's top-left corner.

---

## §6 — Interaction-verb canonical set

Beat sequences must use one of these verbs per beat. Custom verbs FAIL Gate 3.

| Verb | Meaning |
|---|---|
| rest | Affordance at rest; nothing in motion |
| tap | Pointer or finger presses; binary press |
| drag | Pointer moves with contact held; continuous |
| scroll | Viewport translates; user moves through content |
| type | Keyboard input; characters appear |
| toggle | Binary state flip |
| reveal | New element appears (sheet, drawer, overlay, toast) |
| hold | State sustains with visible internal motion |
| settle | Animation ends; layout finishes |
| transition | One screen leaves, another enters |

---

## §7 — State label canonical set

Screenshots must be labeled with one of these. Custom labels are allowed if they follow the same flow-position semantics, but the canonical set is preferred for cross-skill consistency.

| Label | Meaning |
|---|---|
| resting | Screen as first seen; no interaction in progress |
| interaction-start | Moment of the user's action |
| interaction-result | Screen mid-response (loading, animating) |
| end-state | Settled result, ready for next interaction |
| variant-A / variant-B | Alternative result paths |
| error-state | Failure path captured intentionally |

---

## §8 — Cross-stack contract checkpoints

Schema changes that require atomic edits across files:

1. **Frontmatter field order or set in `brief.md`** → also update `produce-video`'s `video-brief-schema.md` extension (WS4) and the cross-stack note in `SKILL.md` § Artifact Contract.
2. **Body section headers in `brief.md`** → produce-video consumers may match sections by heading; never silently rename or reorder.
3. **Handoff column set in `handoff-produce-video.md`** → produce-video's prompt-author-agent parses these columns; column rename / removal breaks the consumer.
4. **Interaction-verb canonical set (§6)** → interaction-grammar.md and Gate 3 in critic-agent.md both cite this set; update in sync.
5. **State label canonical set (§7)** → intake-validator-agent's Source Inventory format cites this set; update in sync.
