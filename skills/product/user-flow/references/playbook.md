---
title: User-Flow Playbook
lifecycle: canonical
status: stable
produced_by: user-flow
load_class: PLAYBOOK
---

# User-Flow Playbook

## Why this skill exists

A feature isn't designed until you can walk a user through it on every surface it ships on, with every edge case mapped. Most "design" stops at happy-path mockups: 6 sunny-day screens, no error states, no platform-native touchpoints (widget, Live Activity, notification reply, Quick Settings tile), no edge cases for "user lost connection mid-checkout." Implementation then discovers all of it the hard way.

This skill exists to do the un-glamorous work: enumerate every screen + every decision + every edge state, name every platform × surface in scope (no "cross-platform" cop-out), wireframe core screens + per-surface mini-frames, validate happy path against Miller's threshold, fail closed on dead-end errors. Multi-agent orchestration (6 agents across 3 layers — structure + edge-case parallel; diagram + wireframe parallel; validation → critic sequential) ensures coverage before delivery. One file per flow at `.agents/skill-artifacts/product/flow/<flow-name>.md`; auto-index when ≥2 flows exist.

The output is `pipeline` lifecycle (per-flow regenerated on re-run; versioned via `.v[N]` rename); the index is also `pipeline` (regenerated from directory contents on each run).

## Methodology

**Platforms + surfaces enumerated BEFORE Layer 1 dispatch.** Mandatory gate. Without explicit enumeration (from the catalog in `platform-touchpoints.md`), wireframe size, entry triggers, and per-surface edge states are all guesses. "Cross-platform" is a refusal to enumerate — explicitly rejected.

**Structure + edge-case in parallel, then merge, then diagram + wireframe in parallel.** Edge cases inform wireframes (a screen with 5 edge states is structurally different from one with 1). Wireframes inform diagrams (the diagram-agent uses wireframe layout to decide node shapes). Layer ordering is non-negotiable.

**Critic-agent runs full rubric, not a thin check.** Surface coverage matrix, per-surface mini-frames at native dimensions, decision points with ≥2 labeled exits, Miller-threshold compliance, dead-end error check, wireframe-vs-structure drift check. FAIL re-dispatches the named agent; max 2 cycles.

**One flow per file. No pooling.** A "FLOW.md" containing checkout + onboarding + password-reset drifts within a week. Each run produces `<flow-name>.md`; index gets auto-regenerated when there are ≥2 files.

**Re-run is rename-and-replace.** Existing `<flow>.md` → `<flow>.v[N].md`; new `<flow>.md` written. Versioned files sit beside the live one and are excluded from index slug count.

## Principles

- **The 7 Critical Gates are the contract.** No Layer 1 before platforms + surfaces. Reject "cross-platform" as a platform. No diagrams before structure. No skipping edge cases. Challenge >7 happy-path steps (Miller). One flow = one file. Stale product context (>30 days) misaligns flows.
- **Every decision point has ≥2 labeled exits.** Dead-end errors fail the critic. Recovery actions always present (retry / back / contact support / alternative).
- **Wireframe-structure parity.** Wireframe CTAs must match the structure-agent's actions column exactly. Drift fails the critic.
- **Per-surface mini-frame per declared surface.** Native dimensions from `platform-touchpoints.md`. Multi-state surfaces (Dynamic Island compact/expanded, widget small/medium/large) get one mini-frame per state.
- **Per-surface edge states beyond generic 5.** Each declared surface has specific failure modes (Live Activity 8h ceiling, widget refresh budget, PWA state loss on iOS, deep-link fallback) — pulled from the "Edge states to check" column of the catalog.
- **2-3 critical edge variants, not edge-per-screen.** Wireframing every edge state creates 30 frames of noise; pick high-impact only.
- **Source citation.** Cite UX heuristics / research / patterns with URLs; flag unattributable claims `[UNVERIFIED]`.

## When NOT to use this skill

- **Visual brand identity** — use `/brand-system`.
- **Technical API design** — use `/system-architecture`.
- **Task decomposition from an existing flow** — use `/task-breakdown`.
- **Scoping unclear requirements** — use `/discover` first; come back when the feature is bounded.
- **Landing-page architecture** (single-page surfaces, not multi-step product flows) — use `/lp-brief`.

## History / origin

- **v4.0.0 baseline:** 6 agents, 3-layer execution (Layer 1 parallel structure+edge-case, Layer 2a parallel diagram+wireframe, Layer 2b sequential validation→critic), 7 Critical Gates locked, mandatory platforms+surfaces gate inside Pre-Dispatch, per-surface mini-frame + edge-state requirements, surface coverage matrix in critic rubric.
- **v6 Phase 2 Wave 1 refactor (May 17, 2026, still v4.0.0):**
  - Body trimmed 457 → target ≤250 lines per the v6 program.
  - Warm/Cold Pre-Dispatch prompts extracted to `pre-dispatch-prompts.md`.
  - Anti-Patterns body section (~13 patterns) extracted to `anti-patterns.md`.
  - Worked Example (food-delivery checkout) extracted to `examples/checkout-walkthrough.md`.
  - Artifact Template (per-flow file + index.md, ~183 lines!) extracted to `report-template.md` — the largest single-section extraction in the v6 program.
  - Mode-resolver wired with safety-gates-supersede-`--fast` per the 7 Critical Gates + mandatory platforms+surfaces gate.
  - Before-Starting check + Artifact Contract block added per Step 7.5.
  - The 7 Critical Gates + Quality Gate + Multi-Agent Architecture (Manifest + Routing Logic + Dispatch Protocol + Layer 1 + Merge + Layer 2a + 2b + Critic Gate) preserved verbatim in body — these ARE behavior, not docs.
  - No version bump — refactor lands on product-skills 2.0 base as a commit, not a release.

## Further reading

- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — 13-pattern failure catalog + when to defer
- [`pre-dispatch-prompts.md`](pre-dispatch-prompts.md) [PROCEDURE] — Warm + Cold prompts + platforms+surfaces gate
- [`report-template.md`](report-template.md) [PROCEDURE] — per-flow artifact template (15+ sections) + index.md auto-generation rule + filename + version-increment
- [`examples/checkout-walkthrough.md`](examples/checkout-walkthrough.md) [EXAMPLE] — food-delivery checkout (multi-platform, 13 surfaces, all 6 agents)
- [`platform-touchpoints.md`](platform-touchpoints.md) — surface catalog (13 platforms + cross-platform channels): entry triggers, flow roles, native dimensions, per-surface edge states (pre-existing, unchanged; agents consume directly)
- [`research-checklist.md`](research-checklist.md) — pre-design research methods, IA, content strategy (pre-existing, unchanged; structure + edge-case agents consume)
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (standard-tier skill; `--fast` runs Single-Agent Fallback but still enforces 7 Critical Gates + mandatory platforms+surfaces gate per the safety-gates-supersede rule)
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec
