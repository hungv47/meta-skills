---
title: LP-Brief Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: lp-brief
load_class: PROCEDURE
---

# LP-Brief Dispatch Mechanics

> Full dispatch + critic + approval-gate procedure. Cited from SKILL.md "Dispatch Protocol", "Layer 1" through "Layer 5", and "Approval Gate 1/2/3" sections. Body retains the Routing Logic 3-route step lists + the user-facing Approval Gate presentation blocks + Layer 5 critic verdict logic; this procedure file holds the full per-layer dispatch tables + the user-response handling tables for the 3 approval gates + single-agent fallback.

## How to spawn a sub-agent

1. **Read** agent instruction file — include FULL content in Agent prompt
2. **Append** context (digest excerpts, prior layer outputs, asset slot list, etc.)
3. **Resolve** all file paths to absolute (rooted at skill directory)
4. **Pass upstream artifacts by content** — orchestrator reads `research/icp-research.md`, `research/product-context.md`, campaign artifacts, prior briefs, and provided page/evidence notes FIRST and includes excerpts; sub-agents don't read these directly
5. If **critic feedback** exists, append with `## Critic Feedback — Address Every Point`

### Single-agent fallback

If multi-agent dispatch is unavailable, execute layers sequentially. **Approval gates remain — single-agent mode does not bypass user gates.** All 3 Approval Gates (1 hypothesis selection / 2 architecture approval / 3 final brief acceptance) fire regardless of dispatch mode.

## Layer 1: Parallel Foundation dispatch table

Spawn **IN PARALLEL** (Route A/B):

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Evidence-Anchor Agent | page identity + tier + current page state/evidence (if present) + ICP | — |
| Brand-Anchor Agent | full BRAND.md + DESIGN.md + page identity | — |

Wait for both — outputs feed Layer 1.5.

## Layer 1.5: Hypothesis dispatch

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Hypothesis Agent | evidence digest + brand digest + page tier + campaign context | `references/hypothesis-rubric.md`, `references/conversion-principles.md` |

Output: 3 candidates, each scored 3Q (Visual / Falsifiable / Uniquely Ours).

## Approval Gate 1 — Hypothesis Selection (user-response handling)

**STOP.** Present 3 hypothesis candidates per the body's presentation block. User response handling:

| User response | Action |
|---|---|
| "A" / "B" / "C" | Proceed to Layer 2 with that hypothesis |
| "Revise X" | Re-dispatch hypothesis-agent with feedback |
| "None of these" | Ask one clarifying question, regenerate |
| "Stop" | Save candidates, exit BLOCKED |

## Layer 2: Architecture dispatch

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Architecture Agent | approved hypothesis + brand digest + evidence digest + tier | `references/surface-rhythm.md`, `references/section-templates.md` |

Output: surface rhythm plan + section list + ASCII diagram + scroll velocity notes (where eye accelerates/decelerates/pauses).

## Approval Gate 2 — Architecture Approval (user-response handling)

**STOP.** Present architecture per the body's presentation block. User response handling:

| User response | Action |
|---|---|
| "Approve" | Proceed to Layer 3 |
| "Revise X" | Re-dispatch architecture-agent with feedback (max 1 revise cycle here) |
| "Reject" | Return to Layer 1.5 to pick a different hypothesis OR exit BLOCKED |

## Layer 3: Section Spec dispatch (then Asset Slots in 3.5)

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Section-Spec Agent | architecture + evidence digest + brand digest + ICP objections + VoC | `references/section-templates.md`, `references/conversion-principles.md`, `references/failure-modes.md` |

## Layer 3.5: Asset Slots dispatch (after section-spec)

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Asset-Slot Agent | architecture + section-spec output (canonical source of slot IDs) + brand digest | `references/_shared/design-brief/asset-types.md` |

**Asset-slot-agent runs AFTER section-spec, not in parallel** because slot IDs originate in section-spec's per-section asset references. Parallel execution would guarantee ID drift between section-spec's slot references and asset-slot-agent's slot definitions.

## Layer 4: Hand-Off Composition dispatch

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Hand-Off Agent | full assembled brief (architecture + section spec + asset slots) + `target_handoff` (specialty targets, may be null) + detected_stack (framework + motion library, auto-detected from repo) | `references/handoff-formats.md`; `references/design-handoff-prompting.md` (opening-prompt protocol — pass when `target_handoff` lists a design tool) |

**Output (always):** `handoff-implementation.md` — universal coding-agent prompt block (Claude Code / Cursor / Codex / Opus / Gemini / GPT). Stack auto-detected at write time; falls back to pure HTML/CSS/Vanilla JS. Motion stack from `brand/DESIGN.md` or GSAP+ScrollTrigger+Lenis default. Contains verbatim Asset Placeholder Rule so coding agents never invent stock-photo URLs.

**Output (optional, per `target_handoff`):** one additional `handoff-{target}.md` per listed specialty target (`claude-design` / `figma` / `designer`).

## Layer 5: Critic Gate (parallel) dispatch + merge

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Conversion Critic | full brief | `references/conversion-principles.md`, `references/section-templates.md` |
| Brand-Voice Critic | full brief + brand digest | `references/failure-modes.md` |

Both run in parallel. Orchestrator merges reports.

### Verdict logic (max 2 cycles total; binary PASS/FAIL per critic; NOTEs are advisory)

| Cycle 1 outcome | Action |
|---|---|
| Both PASS | DONE — write brief |
| Mixed or both FAIL | Re-dispatch each agent named in failing critics' Failures Summary `fix direction` field. (Critics emit per-FAIL routing — orchestrator does not hardcode it.) Combine feedback per receiving agent. Cycle 2. |

| Cycle 2 outcome | Action |
|---|---|
| Both PASS | DONE — write brief |
| Either or both FAIL | DONE_WITH_CONCERNS — write brief with all FAIL notes pinned at **top** of `brief.md` under `## Concerns` above body. Critic scores in frontmatter. User sees failing reports at Approval Gate 3 and decides: ship, revise manually, or kill. |

DONE_WITH_CONCERNS is the floor. No silent FAIL outputs — every critic concern visible in the artifact.

### Per-FAIL routing comes from critics, not from the orchestrator

Each FAIL includes `fix direction` naming the responsible agent (section-spec for copy/structure/checklist, asset-slot for asset, handoff for hand-off-only, brand-anchor for digest correction). Orchestrator follows that direction; do NOT assume failure-class → agent mappings.

## Approval Gate 3 — Final Brief Acceptance (user-response handling)

**STOP.** Present the full brief + critic merge per the body's presentation block. User response handling:

| User response | Action |
|---|---|
| "Approve" | Write brief to `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/brief.md` (with version subfolder if rev). Status DONE. |
| "Revise X" | Re-dispatch named layer with feedback (1 cycle) |
| "Reject" | Save as `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/rejected.md`, exit BLOCKED |

## Routing diagram (full Route A pipeline, end-to-end)

```
Step 0 (Pre-Dispatch: hard gates + needed dimensions + read order + Warm/Cold start)
  ↓
L1 PARALLEL: evidence-anchor + brand-anchor
  ↓
L1.5: hypothesis-agent → 3 candidates 3Q-scored
  ↓
★ Gate 1 (Hypothesis Selection — user picks A/B/C, revises, or kills)
  ↓
L2: architecture-agent → surface rhythm + section list + ASCII + scroll velocity
  ↓
★ Gate 2 (Architecture Approval — user approves, revises 1 cycle, or rejects back to L1.5)
  ↓
L3: section-spec-agent → per-section spec
  ↓
L3.5: asset-slot-agent → named asset slots (consumes section-spec slot IDs — SEQUENTIAL not parallel)
  ↓
L4: handoff-agent → handoff-implementation.md (always) + handoff-{target}.md (optional per target_handoff)
  ↓
L5 PARALLEL: conversion-critic + brand-voice-critic → merge verdict
  ↓
[Cycle 1: both PASS → DONE | mixed/both FAIL → re-dispatch per critic fix direction → Cycle 2 → DONE or DONE_WITH_CONCERNS]
  ↓
★ Gate 3 (Final Brief Acceptance — user approves, revises 1 cycle, or rejects to BLOCKED)
  ↓
Write artifacts to docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/
```

Route B uses the same dispatch — Layer 1 evidence-anchor additionally reads current page state and any post-launch evidence. Route C (`--rev=N`) reads prior brief at `v[N-1]/brief.md` BEFORE L1, runs L1 to diff prior brief against fresh inputs, continues Route A/B from L1.5.

## Conventions

- **Source citation:** Cite sources for conversion principles (CP-IDs) and brand rules (G-IDs). When critic outputs cite a CP-ID or G-ID, the brief location MUST be cited as well — no "feels off" verdicts.
- **Context loaded:** Include which upstream artifacts were read (with versions/dates) in the brief frontmatter `shared_skill_chain` field. Creates audit trail for downstream skills.
- **Slot ID provenance:** Section-spec-agent creates slot IDs; asset-slot-agent consumes them. Slot IDs are immutable within a single brief run — renaming requires re-dispatch of section-spec-agent.
- **Stack detection at write time:** handoff-agent runs stack detection (check package.json + framework configs) at write time before composing the implementation prompt. Never asks the user. Falls back to pure HTML/CSS/Vanilla JS when no framework detected.
- **Asset Placeholder Rule lifted verbatim:** handoff-agent lifts the canonical Asset Placeholder Rule from `references/handoff-formats.md` into every implementation prompt. Brand-voice critic G8b FAILs if paraphrased.
