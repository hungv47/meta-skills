---
title: Video Brief Schema — produce-video input contract
lifecycle: canonical
status: stable
produced_by: produce-video
provenance:
  extracted_from: implementation-roadmap/execution-evaluation/brief-pack/04-production-layer.md § produce-video + decisions.md § D14 sub-decisions 3 + 5
  extracted_at: 2026-05-19
consumers: produce-video SKILL.md + agents/prompt-author-agent.md + agents/critic-agent.md
load_class: PROCEDURE
---

# Video Brief Schema — produce-video input contract

> The canonical input contract for produce-video. Two modes:
>
> - **shortform mode** — the primary path. Producer: `brief-shortform`. The brief-shortform hero output is a superset of this schema (its 14-section body carries every field plus brief-shortform-specific extras we ignore). Operators may also hand-write a brief matching this schema directly when bypassing brief-shortform.
> - **app-preview mode** — added in WS4. Producer: `brief-app-preview`. The input is the brief's `handoff-produce-video.md` artifact (the per-shot table is the spec; `brief.md` is human context). See § App-Preview Mode Extension below.
>
> The mode is discriminated by the input brief's `type` frontmatter field: `type: video-brief` OR brief-shortform's output → shortform mode; `type: produce-video-input` (the handoff file) OR `type: app-preview-brief` → app-preview mode. Pre-dispatch reads the discriminator and applies the matching field map + validation rules.

## Required fields

The brief MUST carry every field below or produce-video returns `NEEDS_CONTEXT` at pre-dispatch.

| Field | Type | Source (in brief-shortform output) | Notes |
|---|---|---|---|
| `slug` | kebab-case string | frontmatter `slug` | Stable identifier; matches bundle path |
| `angle` | free text | frontmatter `angle` + body § "What This Brief Bets On" | One-line video premise |
| `hero_platform` | enum | frontmatter `hero_platform` | One of: `tiktok` / `reels` / `shorts` / `linkedin` / `x` |
| `aspect` | string | derived from `hero_platform` + body § "Format Specification" | One of: `9:16` / `1:1` / `16:9` / `4:5` / `custom-WxH` |
| `length_seconds` | integer | body § "Format Specification" (e.g., "60s") | Total video length; per-shot durations must sum to this |
| `shots[]` | list | body § "Storyboard" (shot list or scene list) | One entry per shot; see "Per-shot shape" below |
| `cta` | string | body § "CTA" | The exact CTA copy; appears verbatim in final shot + manifest top-level |
| `caption` | string | body § "Caption" | Platform-side caption metadata (not on-screen) |
| `brand_mode` | enum | frontmatter `brand_mode` | `founder` or `company` |
| `production_mode` | enum | frontmatter `production_mode` | `live-action` / `motion-graphic` / `mixed` |
| `market` | string | frontmatter `market` | Region for narration accent / locale |

## Optional fields

| Field | Type | Source | Notes |
|---|---|---|---|
| `variants[]` | list | frontmatter `variants` | Other platforms — produce-video can target one variant per invocation if `--platforms` overrides |
| `audio_plan` | object | body § "Audio Plan" | Music track name + start/end + ducking; defaults to "operator-supplied" if absent |
| `narration_lines[]` | per-shot list | body § "Audio Plan" or per-shot in Storyboard | TTS narration text per shot; absent = silent video |
| `production_notes` | free text | body § "Production Notes" | Renderer hints (e.g., "shot 3 needs animated text reveal") |
| `success_criteria` | free text | body § "Success Criteria" | Read by future evaluate-shortform; not used by produce-video itself |

## Brand frame inputs (soft-required, not brief fields)

Beyond the brief, shortform mode reads brand artifacts by **logical slot** (resolved at pre-dispatch, not carried in brief frontmatter):

| Slot | Required? | What it provides | On absence |
|---|---|---|---|
| `brand/BRAND.md` | required | Voice, archetype, sacred elements | `NEEDS_CONTEXT` → `create-brand` |
| `brand/DESIGN.md` | required | Color tokens (hex + name), type scale, motion permissions | `NEEDS_CONTEXT` → `create-brand` |
| `brand/FRAME.md` | **soft-required** | Frame direction — delivery-surface safe areas (title-safe / action-safe % insets), type-at-distance floors, on-screen pacing / hold times, bumper + lower-third layout. Matched by **canonical path + section headings** (per `create-brand/references/frame-direction.md` § Cross-stack note), NOT by parsing frontmatter. | Record `frame_direction: absent` in manifest provenance; fall back to `brand/DESIGN.md` + `brand/CREATIVE-DIRECTION.md` tokens. Never silent — same degradation mechanics as `realized-surface-grounding.md`. |

This is additive — it adds no required brief field and changes no per-shot shape, so no schema consumer's contract is affected. The frame inputs feed per-shot prompt composition (safe-area placement, type sizing, hold timing), not field validation.

## Per-shot shape (`shots[]` entries)

Each shot in the brief's Storyboard MUST yield this shape:

| Field | Type | Required? | Notes |
|---|---|---|---|
| `shot_index` | integer | yes | 1-based |
| `duration_seconds` | number | yes | Per-shot; sums to `length_seconds` |
| `visual` | string | yes | One-line visual description from brief's Storyboard |
| `on_screen_text[]` | list of `{text, position, entry_s, exit_s}` | optional | If brief specifies on-screen text choreography per shot, use it. Otherwise empty list. |
| `narration` | string \| null | optional | TTS narration text for this shot; null if shot is silent |
| `audio` | object | optional | Per-shot music/SFX cues; falls back to global `audio_plan` |
| `role` | string | optional | One-word role: `hook` / `problem` / `mechanism` / `proof` / `contrast` / `cta`. Used by Gate 4 narrative-arc check |

## Brief-shortform field map

How brief-shortform's hero brief sections map to schema fields:

| brief-shortform body section | Schema fields filled |
|---|---|
| § TL;DR for the Producer | (skipped — meta) |
| § What This Brief Bets On | `angle` (combined with frontmatter) |
| § Audience & Voice | TTS voice tone defaults (used by prompt-author) |
| § Format Specification | `aspect`, `length_seconds` |
| § Hook | `shots[0].visual`, `shots[0].on_screen_text[]`, `shots[0].role: "hook"` |
| § Storyboard | `shots[1..N-1].visual`, `shots[1..N-1].duration_seconds`, `shots[1..N-1].role` |
| § On-Screen Text Choreography | `shots[*].on_screen_text[]` cross-walk |
| § Audio Plan | `audio_plan`, `shots[*].narration`, `shots[*].audio` |
| § Caption | `caption` |
| § CTA | `cta` (and final shot's `on_screen_text` + `role: "cta"`) |
| § Production Notes | `production_notes` |
| § What NOT To Do | (passed through to per-shot anti-patterns) |
| § Success Criteria | `success_criteria` |
| § Variant Roadmap | (skipped — handled at orchestrator level via `--platforms`) |

## Hand-written brief minimum

If an operator bypasses brief-shortform and hand-writes a brief, the minimum viable shape is:

```markdown
---
type: video-brief
slug: [kebab-case]
angle: [one-line premise]
hero_platform: tiktok | reels | shorts | linkedin | x
aspect: 9:16 | 1:1 | 16:9 | 4:5 | custom-WxH
length_seconds: [N]
cta: "[exact CTA copy]"
caption: "[platform-side caption]"
brand_mode: founder | company
production_mode: live-action | motion-graphic | mixed
market: [region]
---

# Video Brief — [slug]

## Shots

| # | Duration (s) | Visual | On-Screen Text | Narration | Role |
|---|---|---|---|---|---|
| 1 | [N] | [one-line visual] | "[text]" | "[narration OR none]" | hook |
| 2 | [N] | [...] | "[...]" | [...] | problem |
| ... | ... | ... | ... | ... | ... |
| N | [N] | [...] | "[verbatim CTA]" | [...] | cta |

## Audio Plan

[Track name, music start/end, ducking, narration voice spec]

## Production Notes (optional)

[Renderer hints]
```

The hand-written form is validated against the same field requirements as the brief-shortform-derived form. Missing fields → `NEEDS_CONTEXT` at pre-dispatch.

---

## App-Preview Mode Extension

App-preview mode replaces the narrative shot list with a screenshot-driven beat list — each beat is a crop of a real UI screenshot plus an interaction overlay. The input is **`brief-app-preview`'s `handoff-produce-video.md`** artifact at `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/handoff-produce-video.md`. The companion `brief.md` is human context only — `handoff-produce-video.md` is the produce-video spec.

### App-preview required fields

The handoff frontmatter MUST carry:

| Field | Type | Source (in handoff frontmatter) | Notes |
|---|---|---|---|
| `type` | constant | frontmatter `type` | MUST be `produce-video-input` |
| `source_brief` | project-relative path | frontmatter `source_brief` | Path to the companion `brief.md` for traceability |
| `surface` | enum | frontmatter `surface` | One of: `app-store` / `onboarding` / `website` / `social` |
| `aspect` | string | frontmatter `aspect` | One of: `9:16` / `1:1` / `16:9` / `4:5` / `2:3` |
| `total_length_seconds` | number | frontmatter `total_length_seconds` | Total video length; sums of per-shot `duration_s` must equal this |
| `audio_default` | enum | frontmatter `audio_default` | `on` or `off` — surface-driven default; produce-video respects it |
| `shot_count` | integer | frontmatter `shot_count` | Count of rows in the per-shot table |
| `brand_source` | enum | frontmatter `brand_source` | `brand-md` (canonical brand artifacts present) or `cold-start-hint` (brief proceeded with warn-flag) |

The handoff also requires the **Per-Shot Specification** table with one row per shot.

### App-preview per-shot shape (handoff table rows)

Each row in the handoff's `## Per-Shot Specification` table MUST carry:

| Field | Type | Required? | Notes |
|---|---|---|---|
| `shot_id` | string | yes | `shot-01`, `shot-02`, ..., zero-padded for stable sort |
| `source_id(s)` | string | yes | Screenshot IDs (e.g., `S01`, `S03→S04`); resolve via `assets.md` § Screenshots |
| `crop_rect / selector` | string | yes | Either `[x, y, w, h]` in source-screenshot pixels (origin top-left) OR a named component selector |
| `mask_transform` | string | yes | One of: `static` / `crossfade-in-place` / `hard-cut` / `mask-expand` / `mask-contract` — OR a composite (e.g., `crossfade-in-place at entry; static during`) |
| `pointer` | string \| `none` | yes | Pointer spec (e.g., `solid-circle 64px @ (430, 110) accent, tap-ripple 80→160px over 0.3s`) OR `none` |
| `caption_text` | string \| `—` | yes | Verbatim caption text OR `—` for caption-less beats (e.g., a `tap` beat with no caption) |
| `caption_band` | string | yes | Band position + height (e.g., `bottom-quarter @ 480h`); empty if `caption_text == —` |
| `duration_s` | number | yes | Per-shot duration in seconds; sums to `total_length_seconds` exactly |

The handoff also carries a `## Caption Band Geometry` block (position + height_px + safe_area_inset_px) and an `## Asset References` block (pointers to `assets.md`).

### App-preview field map (handoff → schema)

How the handoff artifact maps to the schema's canonical per-shot shape:

| Handoff column | Schema field | Notes |
|---|---|---|
| `shot_id` | `shot_id` (derived: `shot-01` → `shot-1` for filename) | The handoff zero-pads; filename strips the zero (`scenes/shot-1.md`, not `shot-01.md`) — keep one convention across the bundle |
| `duration_s` | `duration_seconds` | Direct |
| `source_id(s)` + `crop_rect / selector` | `visual` | Composed: `"<source paths> cropped to <rect> with <mask_transform>"` |
| `caption_text` + `caption_band` | `on_screen_text[]` | One entry: `{ text, position: <caption_band.position>, entry_s: <beat start>, exit_s: <beat end> }`. Caption-less beats (`—`) yield empty `on_screen_text[]` |
| `pointer` | (new field) `pointer_spec` | App-preview-only — see § App-preview-only fields below |
| (handoff frontmatter) `surface` | (new field) `surface` | App-preview-only — drives platform compliance |
| (handoff frontmatter) `audio_default` | `audio_plan.default_state` | `on` / `off`; produce-video renders silence on beats where no audio asset is supplied |
| (handoff frontmatter) `brand_source` | (new field) `brand_source` | `brand-md` / `cold-start-hint`; surfaces in the manifest concerns block when `cold-start-hint` |
| (no CTA field in handoff) | `cta` | App-preview briefs do not carry a CTA copy by default. Set to `(none)` in manifest unless operator supplied a final-shot CTA caption via `caption_text` on the closing beat. See § App-preview CTA semantics below |
| (no `narration` in handoff per default) | `narration` | App-preview defaults to silent narration; if the brief supplies narration in companion `brief.md` § Pointer + Audio Plan, prompt-author lifts it |

### App-preview-only fields (schema extension)

Mode-specific per-shot fields that have no shortform analog:

| Field | Type | Required? | Notes |
|---|---|---|---|
| `source_screenshot` | project-relative path | yes | Resolved from `source_id(s)` via the handoff's `## Asset References` → `assets.md` § Screenshots; must exist on disk |
| `crop_rect` | `[x, y, w, h]` ints \| named-selector string | yes | Either pixel rect or component selector; carries forward into the manifest's per-shot row |
| `mask_transform` | enum string | yes | `static` / `crossfade-in-place` / `hard-cut` / `mask-expand` / `mask-contract` / composite; runtime scaffolds branch on this value |
| `interaction_verb` | enum string | yes | One of the canonical 10-verb set (`rest` / `tap` / `drag` / `scroll` / `type` / `toggle` / `reveal` / `hold` / `settle` / `transition`); custom verbs FAIL at pre-dispatch — see `brief-app-preview/references/interaction-grammar.md` § 1 |
| `pointer_spec` | object \| `none` | yes | `{ style, color_token, color_hex, position_crop_relative: {x,y}, ripple: {start_px, end_px, duration_s} \| null }` OR literal `none` |
| `caption_band` | object | optional | `{ position: enum, height_px: int, safe_area_inset_px: int }`; if absent, falls back to the handoff frontmatter's `## Caption Band Geometry` block (one band shared across the video) |
| `surface` (manifest-level) | enum | yes | `app-store` / `onboarding` / `website` / `social`; platform compliance gates depend on this |
| `brand_source` (manifest-level) | enum | yes | `brand-md` / `cold-start-hint`; pinned at top of manifest as a concern when `cold-start-hint` |

The schema's existing `audio_plan`, `production_notes`, `success_criteria`, and `variants[]` fields remain available; app-preview briefs typically populate `production_notes` (per-beat audio assets supplied / missing) and leave `variants[]` empty (one surface per brief).

### App-preview CTA semantics

`brief-app-preview` does NOT require a CTA copy — app-preview briefs prove a feature; "what to do next" is the App Store / surface chrome, not the video's on-screen text. Mapping:

- If the closing beat (highest `shot_id`) has a `caption_text` that reads like a CTA (e.g., "Save what you did"), use that string verbatim as `manifest.cta` and Gate 1's CTA-verbatim check applies to the closing beat's `on_screen_text`.
- If the closing beat has no caption OR a caption that isn't a CTA, set `manifest.cta` to `(none)` and Gate 1's CTA-verbatim check is **skipped for app-preview mode** (the check is not applicable, not violated).
- Gate 4 (narrative arc) likewise softens for app-preview: the close test becomes "final beat is `settle` or `transition` with a clear end-state," not "final beat carries the CTA."

### App-preview validation rules (added to general rules below)

At pre-dispatch, in addition to general rules 1-3 below, produce-video MUST verify for app-preview mode:

A. **`type == produce-video-input`** in handoff frontmatter. Otherwise the input is misrouted — return `NEEDS_CONTEXT` and ask the operator to point at the handoff file, not `brief.md`.

B. **All app-preview required frontmatter fields present.** Missing → `NEEDS_CONTEXT` with the specific missing field.

C. **`surface` is one of the 4 supported values.** Other values → `NEEDS_CONTEXT`.

D. **`aspect` is one of the 5 supported app-preview values** (`9:16` / `1:1` / `16:9` / `4:5` / `2:3`). Note: `2:3` is app-preview-only (some App Store assets); the shortform set does not include it.

E. **`total_length_seconds ≤ 90`.** Same v1 short-form cap as shortform mode.

F. **Per-shot `duration_s` non-empty AND ∑duration_s == total_length_seconds.** Exact equality. Off-by-one → `NEEDS_CONTEXT`.

G. **Every `source_id` in the per-shot table resolves to an `assets.md` row** with a valid screenshot path; every path must exist on disk. Missing path → `NEEDS_CONTEXT` (do NOT fabricate; the screenshot is the source of truth).

H. **Every `interaction_verb` is in the canonical 10-verb set.** Custom verbs → `NEEDS_CONTEXT` and defer to `brief-app-preview` (the brief should have caught this at its Gate 3).

I. **Every `mask_transform` is in the canonical transform set.** Custom transforms (e.g., "swoop", "glitch") → `NEEDS_CONTEXT`.

J. **Every pointer `color_hex` and color token cited in `pointer_spec` exists in `brand/DESIGN.md`.** Same brand-mark fidelity rule as shortform Gate 2; no synthetic neon, no invented hex.

K. **`brand_source` matches the project state.** If `brand_source: brand-md` but `brand/BRAND.md` or `brand/DESIGN.md` is missing on disk → `NEEDS_CONTEXT` (the upstream brief lied about brand state). If `brand_source: cold-start-hint`, produce-video proceeds with `done_with_concerns` and pins the cold-start posture in the manifest's `## Concerns` block.

### App-preview brand-token fallback

Shortform mode hard-fails (Gate 2) on missing brand tokens. App-preview mode has a softer floor because `brand_source: cold-start-hint` is a legitimate state — `brief-app-preview` warned-and-proceeded upstream. The fallback:

- `brand_source: brand-md` → standard Gate 2 hard-FAIL on fabricated hex / token names.
- `brand_source: cold-start-hint` → Gate 2 still hard-FAILs on fabricated hex (you cannot make up colors), but allows the per-shot prompts to cite `source-sampled` hex with the literal token name `(cold-start-sampled)` and a note in the manifest's `## Concerns` block: "Brand artifacts absent at brief time; pointer/caption colors sampled from source screenshots. Reconcile by running create-brand and re-running the brief."

---

## Validation rules

At pre-dispatch, produce-video MUST verify (rules 1-3 are mode-agnostic; rules 4-7 apply to shortform mode; app-preview adds rules A-K above):

1. **All required fields present for the discriminated mode.** Missing → `NEEDS_CONTEXT` with the specific missing field.
2. **`aspect` is one of the supported values for the mode.** `youtube` long-form aspect (16:9 at >60s length) → `BLOCKED` per SKILL.md (long-form is parked).
3. **`length_seconds` (shortform) or `total_length_seconds` (app-preview) ≤ 90.** v1 targets short-form. Long-form is parked.
4. **(shortform)** `shots[]` non-empty AND ∑duration_seconds == length_seconds. Exact equality. Off-by-one → `NEEDS_CONTEXT`.
5. **(shortform)** `cta` non-empty. Empty CTA → `NEEDS_CONTEXT` (defer to brief-shortform to fill). **App-preview exception:** see § App-preview CTA semantics — `cta` may be `(none)` and Gate 1's CTA check is skipped.
6. **(shortform)** Final shot's `role` is `cta` OR final shot's `on_screen_text` contains the `cta` string. Otherwise → `NEEDS_CONTEXT`. **App-preview exception:** soft close test — final beat is `settle` or `transition`.
7. **`brand_mode` (shortform) or `brand_source` (app-preview) resolved.** Required for TTS defaults (shortform) or concern-block emission (app-preview).

## Cross-stack contract

Schema changes here REQUIRE atomic update of:
- `produce-video/SKILL.md` Inputs section (both modes)
- `produce-video/agents/prompt-author-agent.md` Input Contract
- `produce-video/agents/critic-agent.md` Gate 1 checks + mode-aware gate behaviour
- `produce-video/references/format-conventions.md` Manifest schema + app-preview scaffold patterns
- `produce-video/references/anti-patterns.md` if a new anti-pattern emerges
- **App-preview mode only:** `brief-app-preview/references/format-conventions.md` § Cross-stack contract checkpoint #3 (handoff column set) MUST be updated atomically when this file's app-preview field map changes.

If brief-shortform's output ever drifts from this schema's shortform required fields, OR if brief-app-preview's `handoff-produce-video.md` schema drifts, the field map(s) in this file MUST be updated in the same commit to keep the bridge consistent.

## Promotion path (deferred)

This schema lives inside produce-video. When a second consumer (future `evaluate-video` skill) lands, promote to top-level `references/video-brief-schema.md` and link from all consumers. Until then, the schema stays skill-local per D14 sub-decision #3. The app-preview extension lives in the same file rather than a sibling ref per the WS4 single-unified-schema decision (2026-05-23).
