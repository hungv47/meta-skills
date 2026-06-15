---
name: brief-app-preview
description: "Produces production-ready briefs for app onboarding, App Store preview, and feature-demo videos from supplied UI screenshots. Defines the feature promise, cropped UI beats, interaction choreography, captions, motion rules, platform specs, and asset manifest. Use when screenshots exist and the goal is to show a product feature in action. Not for generic short-form social videos (use brief-shortform) or rendering the video (use produce-video)."
argument-hint: "[feature name] [--surface app-store|onboarding|website|social] [--screenshots path/to/dir]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.1.0"
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
- [ ] **Brand fidelity** — motion + caption + pointer specs respect `brand/BRAND.md` voice + `brand/DESIGN.md` tokens + `brand/CREATIVE-DIRECTION.md` motion/pacing direction when supplied, or carry a `brand_source: cold-start-hint` flag. (The operator screenshots are themselves the realized surface — design the motion against what the UI actually shows; `references/_shared/realized-surface-grounding.md`.)
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
| `brand/CREATIVE-DIRECTION.md` | create-brand | Optional — house motion/pacing direction; informs beat rhythm + pointer feel when present |
| `research/icp-research.md` | research-icp | Optional — informs caption register and feature framing |
| Prior `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/` | this skill | Optional — re-run with `--rev=N` to preserve prior brief |

---

## Pre-Dispatch + Mode

Canonical Pre-Dispatch (`references/_shared/pre-dispatch-protocol.md`). Dimensions: feature name, screenshot inventory, flow order, target surface, brand mode, market. Full read-order + Cold Start (5-question bundled) + hard-block conditions: `references/procedures/pre-dispatch.md`. Mode resolution per `references/_shared/mode-resolver.md`; `--fast` skips Layer 2 (no critic, no platform-format) — does **NOT** skip Cold Start or Critical Gates 1-6.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.
At brief-binding, bind the `video` target tool — inherit `tool_targets` or ask once per `references/_shared/tool-target.md`; tool-agnostic stays the default.

---

## Agent Manifest + Routing

6 sub-agents: Layer 1 intake-validator (hard gate) → Layer 1.5 parallel (flow-slicer, interaction-storyboard, motion-spec) → Layer 2 sequential (platform-format → critic 5-sub-critic gate, max 2 rewrite cycles). One feature × one surface per run. Full per-agent focus + dispatch pseudocode + spawn mechanics + critic routing + single-agent fallback + chain position + skill deference: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Artifact Contract

- **Output root:** `docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/`
- **Files (4):** `brief.md` · `assets.md` · `crop-map.md` · `handoff-produce-video.md`
- **Lifecycle:** `pipeline` — one artifact set per (feature, surface, market); re-run on feature pivot or surface change
- **Frontmatter fields (brief.md):** `type`, `role`, `status`, `decision_state`, `review_tool`, `reviewed_at`, `reviewer`, `date`, `slug`, `feature`, `surface`, `brand_mode`, `market`, `screenshot_count`, `beat_count`, `total_length_seconds`, `aspect`, `brand_source`, `critic_passes[]`, `critic_loop_count`
- **Body sections (brief.md, 12, in order):** TL;DR for the Editor · Feature Promise · Source Inventory · Beat Sequence · Crop / Mask Plan · Interaction Choreography · Motion Spec · Caption Pack · Pointer + Audio Plan · Platform Spec · What NOT To Do · Handoff to produce-video
- **Consumed by:** `produce-video` (via `handoff-produce-video.md`) — emits the runtime scaffolds; never `brief-shortform`, never `publish-social`
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers (verbatim)" + `produce-video`'s `video-brief-schema.md` extension for app-preview inputs (WS4 will land that extension)


Full template + frontmatter spec + per-section format rules + crop-rectangle notation + interaction-verb glossary: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE]. The `decision_state` / `review_tool` / `reviewed_at` / `reviewer` fields are the human-review layer rendered by the forsvn-preview review module. Pipeline default: `decision_state: not_required`.

---

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 5 sub-critic clusters + 4 cross-cutting marketing-stack rows. Re-read before any output ships.

---

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


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

End-to-end walkthrough + FAIL cycle 2 + `--fast` variant: [`references/examples/app-preview-walkthrough.md`](references/examples/app-preview-walkthrough.md) [EXAMPLE].

## References

- `references/playbook.md`, `format-conventions.md`, `anti-patterns.md`
- `references/procedures/{pre-dispatch, dispatch-mechanics}.md`
- `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol}.md`
- Domain catalogs (loaded by craft agents at dispatch): `references/{platform-specs, interaction-grammar}.md`
- 6 sub-agents in `agents/`; `critic-agent.md` holds the canonical 5-sub-critic gate
