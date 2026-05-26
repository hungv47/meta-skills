---
name: brief-app-preview
description: "Produces production-ready briefs for app onboarding, App Store preview, and feature-demo videos from supplied UI screenshots. Defines the feature promise, cropped UI beats, interaction choreography, captions, motion rules, platform specs, and asset manifest. Use when screenshots exist and the goal is to show a product feature in action. Not for generic short-form social videos (use brief-shortform) or rendering the video (use produce-video)."
argument-hint: "[feature name] [--surface app-store|onboarding|website|social] [--screenshots path/to/dir]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$2-4"
---

# App-Preview Brief — Orchestrator

*Production-grade brief for one feature, proven through cropped UI beats from supplied screenshots. Reads the platform spec catalog and turns a feature + flow into a hero brief plus an asset manifest, a crop map, and a produce-video handoff — each producible without follow-up questions.*

**Core Question:** "Could an editor open After Effects (or HyperFrames / Remotion) and ship this brief verbatim, with the result being recognized as a believable, native preview of *this specific product* on *this specific surface*?"

> Why this skill exists, philosophy, when NOT to use it, the 6 hard gates, and the distinction from `brief-shortform`: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

---

## Critical Gates — Read First

Non-negotiable constraints before dispatching any agent:

1. **Screenshots are required. No invented UI.** Every beat references a supplied source file. Missing screenshots → `NEEDS_CONTEXT`, not a generic video plan.
2. **One feature per brief.** Multi-feature requests become multiple briefs. The skill rejects "show the whole app" framing — the feature is the contract.
3. **Each beat must prove one user-visible action or state change.** Hover, idle drift, "establishing" beats fail. Every beat earns its seconds with a verifiable change in the cropped slice.
4. **Whole-screen footage is forbidden unless the full screen is the smallest meaningful unit.** Default is component / region crop. Full-screen is an exception with a written justification, not a fallback.
5. **Captions support the beat; they do not explain the whole product.** A caption attached to one beat states what *that* beat proves — not the feature's marketing pitch.
6. **Motion specs must preserve source UI styling: colors, radius, type, spacing.** Synthetic glow, invented gradients, recolored components → critic FAIL.

---

## Quality Gate

Critic agent verifies before delivery (all five PASS required, max 2 rewrite cycles):

- [ ] **Screenshot grounding** — every beat names a real source file + crop rectangle (or component selector); zero invented UI; brand colors / type / spacing match source
- [ ] **Component-level focal beats** — no whole-screen tours; each beat crops to the region that proves the action; full-screen beats have a written one-line justification
- [ ] **Beat clarity** — every beat proves exactly one user-visible action or state change; idle / hover / "show off the UI" beats fail
- [ ] **Brand fidelity** — motion + caption + pointer specs respect `brand/BRAND.md` voice + `brand/DESIGN.md` tokens when supplied, or carry a `brand_source: cold-start-hint` flag
- [ ] **Platform fit** — output respects the target surface's hard constraints (App Store policy, onboarding-card autoplay rules, website embed muting, social aspect/captioning); platform-format-agent's hard rules satisfied

Full 5-sub-critic rubric (Grounding / Component Focus / Beat Clarity / Brand Fidelity / Platform Fit) + binary verdicts + Rewrite Routing Table live in `agents/critic-agent.md`.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PROCEDURE] — load ICP + BRAND.md context, confirm screenshots are accessible, identify target surface, check `brand/DESIGN.md` freshness.

| Artifact | Source | Required? |
|---|---|---|
| Screenshots directory (≥2 per screen/state; resting + interaction + result + optional variant) | Operator-supplied | **Hard-required** (Critical Gate 1) — `NEEDS_CONTEXT` if missing |
| `brand/BRAND.md` | create-brand | Soft-required — proceeds with `brand_source: cold-start-hint` flag if missing; critic warns on motion specs that contradict typical brand discipline |
| `brand/DESIGN.md` | create-brand | Soft-required — same cold-start handling as BRAND.md; tokens (color hex, radius, type scale) lifted into motion-spec output when present |
| `research/icp-research.md` | research-icp | Optional — informs caption register and feature framing |
| Prior `.forsvn/artifacts/mkt/app-preview-brief/[slug]/` | this skill | Optional — re-run with `--rev=N` to preserve prior brief |

---

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** feature name (1-2 sentences of intent), screenshot inventory (paths + state labels), flow order, target surface (app-store | onboarding | website | social), brand mode (founder | company), market.

Full read-order + Warm Start + Cold Start (5-question bundled) + write-back map + hard-block conditions: `references/procedures/pre-dispatch.md` [PROCEDURE].

---

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — auto-downgrade for ≤3 sentences AND no screenshots-yet (resolves to `NEEDS_CONTEXT`, since gate 1 is hard); `--fast` flag skips Layer 2 (no critic, no platform-format pass) and runs Layer 1 + 1.5 via single-agent fallback. **`--fast` does NOT skip Cold Start or Critical Gates 1-6.**

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Intake Validator Agent | 1 (parallel) | `agents/intake-validator-agent.md` | Confirms screenshot inventory, per-state labels, feature intent (1 feature only), flow order, target surface, missing assets |
| Flow Slicer Agent | 1.5 (parallel) | `agents/flow-slicer-agent.md` | Selects the UI component or region that proves each beat; produces `crop-map.md` |
| Interaction Storyboard Agent | 1.5 (parallel) | `agents/interaction-storyboard-agent.md` | Builds beat sequence: focal slice → interaction → result → transition; one action per beat |
| Motion Spec Agent | 1.5 (parallel) | `agents/motion-spec-agent.md` | Defines pointer/tap, mask/crop, caption, transition, and timing rules; preserves source UI styling |
| Platform Format Agent | 2 (sequential) | `agents/platform-format-agent.md` | Maps output to App Store / onboarding / website / social hard constraints; emits final asset manifest + handoff |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Five sub-critics (grounding / component focus / beat clarity / brand fidelity / platform fit); routes failures; max 2 cycles |

---

## Routing + Dispatch

Single route — the skill always runs Layer 1 + Layer 1.5 + Layer 2. Multi-surface invocations are rejected at pre-dispatch (one feature × one surface per run; re-invoke for additional surfaces).

```
1. Pre-Dispatch (warm-start scan + cold-start if needed) — per procedures/pre-dispatch.md
2. LAYER 1 SEQUENTIAL: intake-validator-agent (hard gate — must PASS before Layer 1.5)
3. LAYER 1.5 IN PARALLEL: flow-slicer-agent, interaction-storyboard-agent, motion-spec-agent
4. LAYER 2 SEQUENTIAL:
   - platform-format-agent (emits asset manifest + produce-video handoff)
   - critic-agent (5-sub-critic gate; FAIL → re-dispatch named source agent)
5. Critic FAIL → re-dispatch (max 2 cycles); after cycle 2, ship done_with_concerns
6. Deliver brief + assets + crop-map + handoff-produce-video
```

Mechanics (how to spawn agents, parallel/sequential tables, single-agent fallback, critic routing, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Artifact Contract

- **Output root:** `.forsvn/artifacts/mkt/app-preview-brief/[slug]/`
- **Files (4):** `brief.md` · `assets.md` · `crop-map.md` · `handoff-produce-video.md`
- **Lifecycle:** `pipeline` — one artifact set per (feature, surface, market); re-run on feature pivot or surface change
- **Frontmatter fields (brief.md):** `type`, `role`, `status`, `decision_state`, `review_tool`, `reviewed_at`, `reviewer`, `date`, `slug`, `feature`, `surface`, `brand_mode`, `market`, `screenshot_count`, `beat_count`, `total_length_seconds`, `aspect`, `brand_source`, `critic_passes[]`, `critic_loop_count` (full schema in `references/format-conventions.md`)
- **Body sections (brief.md, 12, in order):** TL;DR for the Editor · Feature Promise · Source Inventory · Beat Sequence · Crop / Mask Plan · Interaction Choreography · Motion Spec · Caption Pack · Pointer + Audio Plan · Platform Spec · What NOT To Do · Handoff to produce-video
- **Consumed by:** `produce-video` (via `handoff-produce-video.md`) — emits the runtime scaffolds; never `brief-shortform`, never `publish-social`
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers (verbatim)" + `produce-video`'s `video-brief-schema.md` extension for app-preview inputs (WS4 will land that extension)
- **Review:** This `pipeline` artifact carries the review machinery but `decision_state` defaults to `not_required`. Operator opts a run into review by setting `decision_state: pending`. Field semantics: `references/_shared/reviewable-artifact-contract.md`; review procedure: `references/_shared/roughdraft-review-protocol.md`. Review machinery applies to `brief.md` only — not to `assets.md`, `crop-map.md`, or `handoff-produce-video.md`.

Full template + per-section format rules + crop-rectangle notation + interaction-verb glossary: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Output Artifact Structure (frontmatter spec)

`.forsvn/artifacts/mkt/app-preview-brief/[slug]/brief.md` — full template lives in `references/format-conventions.md` §1. Frontmatter:

```yaml
---
type: app-preview-brief
role: hero
status: done | done_with_concerns | blocked | needs_context
decision_state: not_required # pending | approved | denied | suggested | not_required
review_tool: roughdraft    # roughdraft | inline | none
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

The four `decision_state` / `review_tool` / `reviewed_at` / `reviewer` fields are the human-review layer per `references/_shared/reviewable-artifact-contract.md`. This is a `pipeline` artifact → `decision_state` defaults to `not_required`.

---

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships. Five sub-critic clusters (Grounding / Component Focus / Beat Clarity / Brand Fidelity / Platform Fit) + 4 cross-cutting marketing-stack rows (cross-stack contract drift, brand-system absent → token fabrication, skill-deference miss, artifact schema drift).

Most common in practice: whole-screen tours (Gate 4), idle "establishing" beats with no action (Gate 3), synthetic glow / invented gradients (Gate 6), App Store policy violations (platform-format-agent's hard rules), captions that explain the product instead of the beat (Gate 5).

---

## Completion Status

- **DONE** — all 5 critics PASS within ≤2 cycles. Brief + assets + crop-map + handoff produced; all 4 files written.
- **DONE_WITH_CONCERNS** — loop cap reached; remaining FAILs surfaceable as warnings. Concerns pinned at top of `brief.md`.
- **BLOCKED** — `--render` / `--publish` / `--auto-run` requested (this stack emits briefs; produce-video emits scaffolds; neither calls render engines); critic FAILed twice on Gate 1 or 6; target surface unsupported (only the four canonical surfaces are accepted).
- **NEEDS_CONTEXT** — screenshots missing (Gate 1); multi-feature request not split; target surface not derivable; brand artifacts AND ICP both absent AND feature framing too thin to proceed.

---

## Chain Position

**Previous:** create-brand (recommended — brand tokens), research-icp (optional — VoC), product team / design team (supplies screenshots) | **Next:** `produce-video` consumes `handoff-produce-video.md` and emits the multi-runtime export bundle; operator runs the chosen scaffold through HyperFrames / Remotion / their AI CLI of choice.

**Re-run triggers:** feature pivot, surface change, screenshot inventory updated, brand/DESIGN.md tokens updated, operator wants a different surface pass (re-run with `--surface=...` and a new slug).

---

## Worked Example

End-to-end walkthrough (Pre-Dispatch warm-start → Layer 1 intake → Layer 1.5 parallel → Layer 2 platform-format + critic PASS → deliver; plus FAIL-handling cycle 2 variant + `--fast` variant) on a fictional generic SaaS app for the App Store preview surface: [`references/examples/app-preview-walkthrough.md`](references/examples/app-preview-walkthrough.md) [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/app-preview-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by craft agents at dispatch, not orchestrator): `references/{platform-specs, interaction-grammar}.md`
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, reviewable-artifact-contract, roughdraft-review-protocol}.md`
- **Agents:** 6 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 5-sub-critic gate + Rewrite Routing Table.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
