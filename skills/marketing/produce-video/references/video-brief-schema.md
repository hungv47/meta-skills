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

> The canonical input contract for produce-video. The primary producer is `brief-shortform` — the brief-shortform output is a superset of this schema (its 14-section hero body carries every field we need plus brief-shortform-specific extras we ignore). Operators may also hand-write a brief matching this schema directly when bypassing brief-shortform.

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

## Validation rules

At pre-dispatch, produce-video MUST verify:

1. **All required fields present.** Missing → `NEEDS_CONTEXT` with the specific missing field.
2. **`aspect` is one of the supported values.** `youtube` long-form aspect (16:9 at >60s length) → `BLOCKED` per SKILL.md (long-form is parked).
3. **`length_seconds ≤ 90`.** v1 targets short-form. Long-form is parked.
4. **`shots[]` non-empty AND ∑duration_seconds == length_seconds.** Exact equality. Off-by-one → `NEEDS_CONTEXT`.
5. **`cta` non-empty.** Empty CTA → `NEEDS_CONTEXT` (defer to brief-shortform to fill).
6. **Final shot's `role` is `cta` OR final shot's `on_screen_text` contains the `cta` string.** Otherwise → `NEEDS_CONTEXT` (the brief is missing a close).
7. **`brand_mode` and `market` resolved.** Required for TTS defaults.

## Cross-stack contract

Schema changes here REQUIRE atomic update of:
- `produce-video/SKILL.md` Inputs section
- `produce-video/agents/prompt-author-agent.md` Input Contract
- `produce-video/agents/critic-agent.md` Gate 1 checks
- `produce-video/references/format-conventions.md` Manifest schema
- `produce-video/references/anti-patterns.md` if a new anti-pattern emerges

If brief-shortform's output ever drifts from this schema's required fields, the field map in this file MUST be updated in the same commit to keep the bridge consistent.

## Promotion path (deferred)

This schema lives inside produce-video for v1. When a second consumer (future `evaluate-video` skill) lands, promote to top-level `references/video-brief-schema.md` and link from both consumers. Until then, single-consumer schema stays skill-local per D14 sub-decision #3.
