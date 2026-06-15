# Worked Example — App-Preview Brief End-to-End

> Generic fictional product (`Tideline` — a focus timer app, fictional). App Store iOS preview surface. Full pipeline: Pre-Dispatch warm-start → Layer 1 intake PROCEED → Layer 1.5 parallel → Layer 2 platform-format + critic PASS → deliver. Includes a FAIL-handling cycle 2 variant and a `--fast` variant at the end.

This walkthrough is illustrative. The fictional product is invented for this example only; no real product or brand is referenced. Operators should adapt the shape to their own feature + screenshots.

---

## Setup (fictional)

**Product:** `Tideline` — a focus timer app for desktop and mobile.

**Feature:** "Surge mode" — when the user starts a focus session, the app dims everything except the active task and shows a rising tide visual that fills proportional to elapsed time. Session ends → tide stays full, "Save session" CTA appears.

**Surface target:** App Store iOS preview.

**Brand:**
- `brand/BRAND.md` exists — Tideline's archetype is "Calm Operator" (technical, restrained, no urgency theater)
- `brand/DESIGN.md` exists — accent color `#0F4C5C`, surface `#F4F1EB`, text primary `#1A1B23`, radius.md `12px`, type body-strong `Inter 600`

**Screenshots supplied (4 files in `screenshots/`):**

- `01-home.png` (1290×2796) — task list with "Start surge" CTA at bottom
- `02-tap.png` (1290×2796) — finger glyph on CTA, dim beginning
- `03-active.png` (1290×2796) — full surge mode, tide visual at 30%, dimmed task list visible behind
- `04-done.png` (1290×2796) — session complete, tide at 100%, "Save session" button replaces "Start surge"

**Slug:** `tideline-surge-mode-app-store-ios`

---

## Pre-Dispatch (warm-start)

The operator's prompt: "Brief the App Store iOS preview for Surge mode. Screenshots in `screenshots/`. Brand artifacts in place. US market."

Orchestrator reads:

- `brand/BRAND.md` → archetype "Calm Operator", brand_mode = `company`, voice "technical, restrained"
- `brand/DESIGN.md` → tokens loaded (accent `#0F4C5C`, surface `#F4F1EB`, text `#1A1B23`, radius.md 12px, type Inter 600)
- `research/icp-research.md` → market US, audience "professionals seeking focus protection" (informs caption register)
- `screenshots/` directory listed — 4 files matching expected names
- No prior `docs/forsvn/artifacts/marketing/app-preview-brief/tideline-surge-mode-app-store-ios/` — first run

All 6 dimensions resolve. Warm Start summary:

```
Found:
- feature → "Surge mode — the focus timer dims everything except the active task and shows a rising tide while the session runs"
- screenshots → 4 files in screenshots/, labels inferred (resting / interaction-start / interaction-result / end-state)
- surface → app-store (iOS)
- brand_mode → company (from BRAND.md)
- market → US
- brand_source → brand-md

Need before dispatching: confirm flow order — S01 → S02 → S03 → S04 reads as
[resting → tap → result → end-state]. Looks right; any adjustment?
```

Operator: "Yes, proceed."

Dispatch.

---

## Layer 1 — intake-validator-agent

```markdown
## Source Inventory

| ID | Path | State label | Format | Resolution | Brand fidelity check |
|----|------|-------------|--------|------------|----------------------|
| S01 | screenshots/01-home.png | resting | png | 1290×2796 | match — DESIGN.md tokens detected |
| S02 | screenshots/02-tap.png | interaction-start | png | 1290×2796 | match |
| S03 | screenshots/03-active.png | interaction-result | png | 1290×2796 | match |
| S04 | screenshots/04-done.png | end-state | png | 1290×2796 | match |

## Feature Promise (1 feature, ≤2 sentences)

Surge mode: the focus timer dims everything except the active task and
shows a rising tide visual while the session runs.

## Flow Order

S01 → S02 → S03 → S04  (resting → interaction-start → interaction-result → end-state)

## Target Surface

app-store (iOS) — locked.

## Brand Source

brand-md — both BRAND.md and DESIGN.md supplied; tokens lifted.

## Gate Verdict

PROCEED

## Change Log
- All 4 states present; canonical labels; brand artifacts complete; verdict PROCEED.
```

---

## Layer 1.5 — parallel

### flow-slicer-agent → `crop-map.md`

```markdown
## Crop Map

| Beat | Source ID | Crop type | Crop rectangle / selector | Region purpose | Justification |
|------|-----------|-----------|---------------------------|----------------|---------------|
| B1 | S01 | component | [240, 1820, 810, 220] | affordance-at-rest — "Start surge" button + tagline | Whole-screen would dilute the affordance; the button + its label is the smallest meaningful unit |
| B2 | S02 | component | [240, 1820, 810, 220] | affordance-mid-action — same button being tapped | Same crop as B1 so the editor can crossfade in place (continuity) |
| B3 | S03 | region | [0, 200, 1290, 1800] | state-change-panel — task list collapses + tide reveals | Multi-component change; component-only on tide would miss the list collapse, vice versa |
| B4 | S03 | region | [0, 200, 1290, 1800] | state-change-panel — tide rises through hold | Same crop as B3; internal motion (tide 30%→90%) carries the beat |
| B5 | S04 | component | [240, 1820, 810, 220] | feedback-element — "Save session" CTA appears in the same button slot | Same rectangle as B1/B2 — closes the visual loop on the affordance |

## Reading Notes
- Crop rectangles in source-screenshot pixels (origin: top-left)
- All 5 beats use component or region; zero full-screen beats — no justification required this run

## Source Path Index

| ID | Path | Resolution |
|---|---|---|
| S01 | screenshots/01-home.png | 1290×2796 |
| S02 | screenshots/02-tap.png | 1290×2796 |
| S03 | screenshots/03-active.png | 1290×2796 |
| S04 | screenshots/04-done.png | 1290×2796 |

## Change Log
- Three of five beats reuse the [240, 1820, 810, 220] rect (continuity in place on the affordance)
- B3 + B4 expand to region for the state-change reveal + hold; same rect for both to maintain stillness across the hold
```

### interaction-storyboard-agent → Beat Sequence

```markdown
## Beat Sequence

**Surface:** app-store
**Total length:** 18.0 seconds
**Pacing rule applied:** App Store iOS — prove one feature in 15-30s, first-second hook, descriptive (non-pitch) captions

### Beat Table

| # | Time | Source ID(s) | Interaction verb | What proves | Caption (text only) | Caption hold |
|---|------|--------------|------------------|-------------|---------------------|--------------|
| B1 | 0:00–0:02 | S01 | rest | The "Start surge" affordance is present and labeled | "Tap to begin a surge" | 0:00–0:02 |
| B2 | 0:02–0:03 | S02 | tap | The user taps the affordance | — | — |
| B3 | 0:03–0:08 | S03 | reveal | Surge mode activates: dim overlay rises, tide appears | "Everything else dims" | 0:03–0:06 |
| B4 | 0:08–0:14 | S03 | hold | Tide rises through the session; internal motion 30%→90% | "One pull on your attention" | 0:08–0:12 |
| B5 | 0:14–0:18 | S04 | settle | Session ends; tide stays, "Save session" appears in the same slot | "Save what you did" | 0:14–0:18 |

### Beat-by-Beat Justification

- **B1 (rest):** Affordance exists; viewer knows what to expect.
- **B2 (tap):** User causes the change; proof of agency.
- **B3 (reveal):** The feature engages; its signature behavior (dim + tide) is visible.
- **B4 (hold):** The duration is real; internal motion (tide rising) prevents dead time.
- **B5 (settle):** Loop closes; the "Save" CTA tells the viewer what to do next.

### On-Screen Text Choreography

- **0:00–0:02 — "Tap to begin a surge"** — caption-band (locked by platform-format-agent), Inter 600
- **0:03–0:06 — "Everything else dims"** — caption-band, Inter 600
- **0:08–0:12 — "One pull on your attention"** — caption-band, Inter 600
- **0:14–0:18 — "Save what you did"** — caption-band, Inter 600

All 4 captions: ≤6 words; hold ≥2s; descriptive present tense.

## Pacing Annotations

- **First-second hook:** B1 reads in 1.0s (button + label visible)
- **Mid-sequence energy:** B3 (reveal) at 0:03 — state change lands inside the 3s window
- **Hold beat:** B4 covers 6 seconds with internal motion (tide 30%→90%) — meets Gate 3 requirement
- **Loop end:** Not applicable for App Store (non-looping); B5's settle is the natural close

## Change Log
- 5 beats, 18s total. 4 captions, all descriptive. No performance claims, no comparisons, no pricing.
```

### motion-spec-agent → Motion Spec

```markdown
## Motion Spec

**Brand source:** brand-md
**Source token inventory:**
- color.accent → #0F4C5C (DESIGN.md)
- color.surface → #F4F1EB (DESIGN.md)
- color.text.primary → #1A1B23 (DESIGN.md)
- radius.md → 12px (DESIGN.md)
- type.body-strong → Inter 600 (DESIGN.md)

### Per-Beat Motion Table

| # | Mask transform | Pointer / interaction overlay | Caption appearance | Transition into next | Timing function |
|---|----------------|------------------------------|--------------------|-----------------------|-----------------|
| B1 | static [240, 1820, 810, 220] | none | fade-in 0.2s, hold 1.8s; Inter 600 28px; color #1A1B23; band background #F4F1EB scrim 92% | crossfade-in-place to B2 over 0.15s | standard ease-out |
| B2 | static, same rect | solid-circle 64px at crop-relative (430, 110), accent #0F4C5C, tap ripple 80→160px over 0.3s | (no caption) | hard-cut to B3 (state change IS the cut) | — |
| B3 | mask expand [240, 1820, 810, 220] → [0, 200, 1290, 1800] over 0.4s ease-out | none | fade-in 0.2s, hold 2.6s; same type spec | crossfade to B4 over 0.2s | standard ease-out |
| B4 | static [0, 200, 1290, 1800]; internal motion: tide rises 30%→90% over 5.5s linear | none | fade-in 0.2s, hold 3.6s; same type spec | crossfade to B5 over 0.2s | linear (matches tide) |
| B5 | mask contract back to [240, 1820, 810, 220] over 0.3s ease-in | solid-circle 64px at crop-relative (640, 180) accent, suggestive (no ripple — "Save" CTA is presented, not pressed) | fade-in 0.2s, hold 3.6s; same type spec | end (settle-out 0.4s) | standard ease-in |

### Pointer / Interaction Overlay Spec

- **Pointer style:** solid-circle 64px (iOS touch surface)
- **Pointer color:** #0F4C5C (DESIGN.md accent)
- **Tap ripple:** 80→160px over 0.3s, opacity 60%→0%
- **Pointer fade in / out:** 0.15s either side of tap beats
- **Drag / scroll:** not used this brief

### Mask / Crop Transform Catalog (used in this brief)

| Transform | Where | Spec |
|---|---|---|
| static | B1, B2, B4 | no transform |
| crossfade-in-place | B1→B2 | source swap from S01 to S02 within same rect, 0.15s linear |
| hard-cut | B2→B3 | instant; state change is the cut |
| expand | B3 (entry) | from [240,1820,810,220] to [0,200,1290,1800] over 0.4s ease-out |
| contract | B5 (entry) | from [0,200,1290,1800] to [240,1820,810,220] over 0.3s ease-in |

### Caption Appearance Spec

- Type: Inter 600 28px (DESIGN.md type.body-strong, scaled for 1290px source width)
- Color: #1A1B23 (DESIGN.md text.primary)
- Band background: #F4F1EB scrim at 92% opacity (DESIGN.md surface)
- Animation: fade-in 0.2s ease-out → hold → fade-out 0.15s ease-in (crossfade 0.2s when consecutive)

### Audio Plan

| # | Audio cue | Source |
|---|-----------|--------|
| B1 | (silence — viewer is in the App Store environment, system ambient) | — |
| B2 | UI tap (system-style) | system-default |
| B3 | low rising whoosh (matches dim + tide reveal) | operator-supplied or empty — defaults to silence if not supplied |
| B4 | (silence; tide is visual) | — |
| B5 | UI confirm chime (subtle, ≤200ms) | operator-supplied or empty |

Audio default for App Store iOS: on. Brief proceeds with audio plan; produce-video will render with silence on B3/B5 if no audio assets supplied.

## Source Fidelity Statement

| Fidelity check | Status |
|---|---|
| Colors used in masks / overlays match DESIGN.md tokens or source-sampled values | PASS — 5 tokens, all DESIGN.md-mapped |
| Border radius on caption band / pointer matches DESIGN.md radius.md | PASS — caption band 12px radius |
| No synthetic glow, no invented gradients, no recolored source components | PASS — pointer is solid accent, no gradient |
| Caption type weight respects DESIGN.md type scale | PASS — Inter 600 = DESIGN.md type.body-strong |
| Pointer color is the accent token (not brand primary on dim overlay) | PASS — #0F4C5C accent, legible on F4F1EB scrim |

## Change Log
- All token references resolve to DESIGN.md
- No invented UI; no recoloring; no synthetic effects
- Audio plan is conservative — defaults to silence where assets aren't supplied
```

---

## Layer 2a — platform-format-agent

```markdown
## Platform Lock

**Target surface:** app-store
**Surface platform:** iOS
**Aspect locked:** 9:16 at 1080×1920 (downstream scale from 1290×2796 source)
**Total length locked:** 18.0s (within 15-30s App Store iOS window)
**Audio default:** on
**Caption band geometry locked:** bottom 1/4 (480px-tall band at 1080×1920 output), 120px above iOS home-bar safe area

### Surface Compliance Check

| Rule | Spec | This brief | Status |
|------|------|------------|--------|
| Length window | App Store iOS: 15-30s | 18.0s | PASS |
| Aspect ratio | 9:16 at 1080×1920 minimum | 9:16, source 1290×2796 (scales cleanly to 1080×1920) | PASS |
| Audio policy | System tap permitted, no music with copyright | System tap + optional whoosh + optional confirm; all generative/empty defaults | PASS |
| Caption requirement | Not required but recommended | 4 captions present, all descriptive | PASS |
| Performance-claim policy | No "saves X," "fastest," "Y% better," etc. | OST scan: "Tap to begin a surge," "Everything else dims," "One pull on your attention," "Save what you did" — zero forbidden phrases | PASS |
| Platform UI capture policy | No third-party platform UI shown | All 4 screenshots are Tideline's own UI; no Settings, no iMessage, no other apps | PASS |
| Safe-area insets | iOS portrait: 60px top (status bar), 120px bottom (home-bar) | Caption band 120px above home-bar; no overlay enters status area | PASS |
| File format target | .mov H.264 or HEVC, ≤500 MB, ≥1080p | (downstream — produce-video) | NOTE |

### Asset Manifest

| Asset ID | Type | Path | Used in | Source / state |
|----------|------|------|---------|----------------|
| S01 | screenshot | screenshots/01-home.png | B1, B2 (crop) | resting / interaction-start |
| S02 | screenshot | screenshots/02-tap.png | B2 (source swap) | interaction-start |
| S03 | screenshot | screenshots/03-active.png | B3, B4 | interaction-result |
| S04 | screenshot | screenshots/04-done.png | B5 | end-state |
| audio-tap | audio | (system-default) | B2 | UI tap cue |
| audio-whoosh | audio | (empty — operator-supplied if available) | B3 | reveal cue |
| audio-confirm | audio | (empty — operator-supplied if available) | B5 | confirm chime |
| token-accent | brand-token | DESIGN.md color.accent (#0F4C5C) | pointer, mask | brand-md |
| token-text | brand-token | DESIGN.md color.text.primary (#1A1B23) | caption | brand-md |
| token-surface | brand-token | DESIGN.md color.surface (#F4F1EB) | caption band | brand-md |
| token-radius | brand-token | DESIGN.md radius.md (12px) | caption band, pointer | brand-md |
| token-type | brand-token | DESIGN.md type.body-strong (Inter 600) | caption | brand-md |

### Caption Band Geometry

- Position: bottom-quarter
- Height: 480px at 1080×1920 output (rescales from source caption-band 320px @ 1290 width)
- Safe-area inset: 120px above iOS home-bar safe area

### Handoff to produce-video

```yaml
---
type: produce-video-input
source_brief: docs/forsvn/artifacts/marketing/app-preview-brief/tideline-surge-mode-app-store-ios/brief.md
surface: app-store
aspect: 9:16
total_length_seconds: 18.0
audio_default: on
shot_count: 5
brand_source: brand-md
---
```

| shot_id | source_id(s) | crop_rect / selector | mask_transform | pointer | caption_text | caption_band | duration_s |
|---------|--------------|----------------------|----------------|---------|--------------|--------------|------------|
| shot-01 | S01 | [240, 1820, 810, 220] | static | none | "Tap to begin a surge" | bottom-quarter @ 480h | 2.0 |
| shot-02 | S01→S02 (crossfade-in-place 0.15s); S02 | [240, 1820, 810, 220] | crossfade-in-place at entry; static during | solid-circle 64px @ (430, 110) accent, tap-ripple 80→160px over 0.3s | — | — | 1.0 |
| shot-03 | S03 | expand [240, 1820, 810, 220] → [0, 200, 1290, 1800] over 0.4s ease-out | mask-expand | none | "Everything else dims" | bottom-quarter | 5.0 |
| shot-04 | S03 | [0, 200, 1290, 1800] | static; internal tide motion 30%→90% linear over 5.5s | none | "One pull on your attention" | bottom-quarter | 6.0 |
| shot-05 | S03→S04 (crossfade 0.2s); S04 | contract [0, 200, 1290, 1800] → [240, 1820, 810, 220] over 0.3s ease-in | mask-contract | solid-circle 64px @ (640, 180) accent, suggestive (no ripple) | "Save what you did" | bottom-quarter | 4.0 |

## Change Log
- All 8 compliance checks PASS
- OST scan zero forbidden phrases
- 5-shot handoff packaged for produce-video; column completeness verified
```

---

## Layer 2b — critic-agent

```markdown
## Verdict
PASS

## Score Card
| # | Gate | PASS / FAIL | Evidence |
|---|---|---|---|
| 1 | Screenshot grounding — no invented UI | PASS | every beat row in B-table cites S01-S04; crop-map has rect per beat; motion-spec Source Token Inventory all DESIGN.md-mapped |
| 2 | Component-level focal beats — no whole-screen tours | PASS | crop-map shows 0 full-screen beats; 3 component + 2 region; continuity-in-place on B1/B2/B5 (same rect [240,1820,810,220]) |
| 3 | Beat clarity — one action per beat | PASS | every beat names one canonical verb (rest/tap/reveal/hold/settle); B4 hold has internal motion (tide 30→90%); zero tour beats |
| 4 | Brand fidelity — source UI styling preserved | PASS | 5 tokens lifted from DESIGN.md; Source Fidelity Statement all-PASS; no synthetic glow, no recoloring; pointer is accent solid-circle |
| 5 | Platform fit — surface compliance, OST policy clean | PASS | compliance table 8/8 PASS; OST scan zero forbidden phrases; caption band geometry clears iOS home-bar safe area |

## On FAIL — Re-dispatch
N/A — PASS on all 5 gates, cycle 1.

## Change Log
- Single-cycle PASS; no rewrite needed.
```

Orchestrator writes the 4 artifacts. `DONE`. critic_loop_count: 1.

---

## FAIL-handling variant (illustrative)

Imagine motion-spec-agent first-pass added a gradient to the pointer:

```yaml
Pointer color: radial-gradient(#0F4C5C, #00FFFF)  # synthetic neon
```

Critic FAIL on Gate 4:

```markdown
## Verdict
FAIL

## On FAIL — Re-dispatch
Agent to re-dispatch: motion-spec-agent
Specific feedback:
- Gate 4 (brand fidelity) FAIL — pointer color is `radial-gradient(#0F4C5C, #00FFFF)`. The `#00FFFF` cyan is not in DESIGN.md's Source Token Inventory and is not sampled from any source screenshot. Synthetic — anti-pattern AP-11.
- Rewrite: pointer color is the solid accent token `#0F4C5C`. No gradient.
```

Cycle 2: motion-spec-agent rewrites with `pointer color: #0F4C5C`. Critic re-scores. PASS. `DONE` with critic_loop_count: 2.

---

## `--fast` variant

Operator runs `/brief-app-preview surge-mode --surface app-store --fast`.

Pre-Dispatch still runs (Cold Start fires if dimensions are missing). All 6 dimensions resolve. Single-agent fallback writes the entire brief in one output — same structure, but:

- No parallel Layer 1.5 (one agent does all four sections)
- No critic-agent (Gate 4 / Gate 5 verification missing)
- Surface Compliance Check still runs (Critical Gate 5 is non-negotiable)
- OST performance-claim scan still runs

Result: `DONE_WITH_CONCERNS` with the `fast-mode-no-critic` flag pinned at the top of `brief.md`. Operator should run full pipeline for the first brief of a feature; `--fast` is for known-good repeats.

---

## What this example illustrates

1. **First-second hook** — B1's caption "Tap to begin a surge" + the visible affordance reads in <1s.
2. **Continuity in place** — B1, B2, B5 share crop `[240, 1820, 810, 220]`; the editor crossfades on the affordance without breaking eye position.
3. **Component-then-region-then-component** — B1/B2 component (affordance), B3/B4 region (state-change), B5 component (settled affordance). Zero full-screen beats.
4. **Hold with internal motion** — B4's 6s hold is sustained by the tide rising 30→90%. No dead time.
5. **App Store-policy-clean captions** — every caption is descriptive present tense; zero performance claims, zero superlatives.
6. **Brand fidelity via tokens** — every visual property in the motion spec maps to a DESIGN.md token.

The same shape generalizes to onboarding cards (shorter, audio-off), website embeds (longer, audio-off, loopable), and social cutdowns (audio-on, vertical, first-second hook critical). The 6 hard gates and 5 critic gates are surface-invariant; only the platform-format-agent's compliance check differs per surface.
