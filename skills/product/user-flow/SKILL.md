---
name: user-flow
description: "Maps multi-step in-product flows — screens, decisions, transitions, platform-native touchpoints (dock, menu bar, widgets, notifications, Live Activity, etc.), edge cases, and error states for features or user journeys. Produces `.agents/skill-artifacts/product/flow/<flow-name>.md` (one file per flow) plus an auto-generated `index.md` when ≥2 flows exist. Not for visual brand design (use brand-system) or landing-page architecture (use lp-brief). For technical architecture, see system-architecture. For task decomposition, see task-breakdown."
argument-hint: "[feature or flow to map]"
allowed-tools: Read Grep Glob Bash
license: MIT
metadata:
  author: hungv47
  version: "4.0.0"
  budget: standard
  estimated-cost: "$0.20-0.50"
  refactor_history:
    - refactored_at: 2026-05-17
      refactored_for: implementation-roadmap v6 Phase 2 Wave 1 (slot 5 — mixed; 7 Critical Gates + mandatory platforms+surfaces gate + multi-agent architecture preserved in body per safety contract)
      body_before: 457
      body_after: 195
      body_delta_pct: -57.3
      note: body-only line counts (frontmatter excluded). 5 new refs (playbook, pre-dispatch-prompts, anti-patterns, report-template, examples/checkout-walkthrough). Artifact Template (183 lines) was the largest single-section extraction in v6 program.
promptSignals:
  phrases:
    - "user flow"
    - "screen flow"
    - "journey map"
    - "ux flow"
    - "wireframe flow"
    - "map the screens"
  allOf:
    - [user, flow]
    - [screen, map]
  anyOf:
    - "flow"
    - "journey"
    - "wireframe"
    - "screen"
    - "ux"
    - "transition"
  noneOf:
    - "brand identity"
    - "api design"
    - "database schema"
  minScore: 6
routing:
  intent-tags:
    - user-flow
    - screen-mapping
    - ux-flow
    - journey-mapping
    - wireframe-flow
  position: pipeline
  lifecycle: pipeline
  produces:
    - .agents/skill-artifacts/product/flow/[flow-name].md
    - .agents/skill-artifacts/product/flow/index.md  # auto-generated when ≥2 flows exist
  consumes:
    - product-context.md
  requires: []
  # brand/DESIGN.md and brand/BRAND.md are documented as Optional Artifacts in body — read if present, never gated.
  defers-to:
    - skill: brand-system
      when: "need visual identity, not screen flows"
    - skill: system-architecture
      when: "need technical API design, not user-facing flow"
  parallel-with: []
  interactive: false
  estimated-complexity: medium
---

# User Flow Design — Orchestrator

*Design — Step 2 of 2. Maps navigation paths, decisions, edge cases, platform-native touchpoints, and screen transitions into a validated flow diagram.*

**Core Question:** "Can the user complete their goal without thinking — on every surface of every platform it ships on?"

[Read `references/playbook.md` [PLAYBOOK] to understand why this skill exists, methodology, principles, when NOT to use.]

## When To Use

- Designing a feature with multiple screens / decisions / states / platforms.
- Redesigning an existing flow (new research, usability failures, new user roles).
- Auditing a shipped flow for missing edge cases or surface coverage gaps.
- Mapping a new platform-native surface (widget, Live Activity, watch app) into an existing flow.

## When NOT To Use

- Visual brand identity → `/brand-system`.
- Technical API design → `/system-architecture`.
- Task decomposition from existing flow → `/task-breakdown`.
- Scoping unclear requirements → `/discover` first.
- Single-page landing surface → `/lp-brief`.

## Critical Gates — Read First

*Why this block precedes "Before Starting": the mandatory platforms+surfaces gate (Gate 1) must fire before any Pre-Dispatch question or Layer 1 dispatch — wireframe size, entry triggers, and per-surface edge states are not inferable without it. Other product skills can defer their gate check until after context-loading; this one cannot.*

- **No Layer 1 before platforms + surfaces enumerated.** See `references/platform-touchpoints.md`. Wireframe size, entries, edge states all depend on it.
- **Reject "cross-platform" as a platform.** Enumerate: macOS, iOS, iPadOS, Android, Windows, web-desktop, web-mobile, watchOS, tvOS, visionOS, CarPlay, Android Auto, Linux.
- **No diagrams before structure.** Diagram-agent needs structure + edge-case outputs first.
- **No skipping edge cases.** Error/empty/loading/permission/offline + per-surface edge states for every screen and surface.
- **Challenge >7 happy-path steps.** Miller's threshold. Every step must justify itself.
- **One flow = one file.** No pooling. Each run writes `.agents/skill-artifacts/product/flow/<flow-name>.md`.
- **Stale product context (>30 days) misaligns flows.** Recommend re-running `icp-research`.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — this skill is `budget: standard`. Mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) applies the canonical heuristics (≤3 sentences / single-topic clear-scope / multi-artifact). `--fast` flag forces Single-Agent Fallback (multi-agent unavailable also routes there). **Safety gates supersede `--fast`:** the 7 Critical Gates + mandatory platforms+surfaces gate fire on every run, regardless of mode.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory.
2. Read `.agents/manifest.json` for prior flow files at this slug + cross-flow staleness.
3. Read `skills-resources/experience/{audience,technical,goals}.md` for product, audience, and platform history.

## Quality Gate

**Critic agent** runs full rubric (see `agents/critic-agent.md`). Non-negotiable PASS checks:

- Platforms + per-platform surfaces explicitly enumerated (no "cross-platform")
- Every platform × surface has entry + mini-frame + per-surface edge state (Surface Coverage Map complete)
- Mini-frame dimensions match `references/platform-touchpoints.md`
- Every decision point has ≥2 labeled exits; no dead-end errors
- Happy path ≤7 steps; ≤3 primary actions per screen
- Every core screen has ASCII wireframe + 2-4 sentence Description; wireframe CTAs match structure actions
- 2-3 critical edge-state variants included

## Pre-Dispatch

Run the Pre-Dispatch protocol ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE]). user-flow has a **mandatory platforms+surfaces gate** before any Layer 1 dispatch — that gate sits inside Pre-Dispatch's question set.

**Needed dimensions:** feature, role/persona, goal (success state), platforms (explicit list, never "cross-platform"), surfaces per platform, primary surface per platform, constraints (auth + min OS versions).

**Read order:**
1. Pipeline: `research/product-context.md` for product/audience grounding. `brand/DESIGN.md` (optional — components, tokens). `brand/BRAND.md` (optional — voice, terminology).
2. Experience: `skills-resources/experience/{audience,technical,goals}.md` for product, audience, and platform history.
3. Catalog: `references/platform-touchpoints.md` for the canonical platform/surface list.

If `research/product-context.md` `date` is >30 days old, recommend re-running `icp-research` to refresh.

**Prompts:** see [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] for Warm Start, Cold Start (with the mandatory platforms+surfaces gate inside), write-back rules, and the brief-context contract passed to all agents.

## Artifact Contract

- **Path:** `.agents/skill-artifacts/product/flow/<flow-name>.md` (one file per flow); `.agents/skill-artifacts/product/flow/index.md` auto-generated when ≥2 distinct slugs exist (excluding `.v[N]` versioned files).
- **Lifecycle:** `pipeline` (regenerated on re-run via rename-and-replace).
- **Frontmatter fields (baseline):** `skill`, `version`, `date`, `status` (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), `flow_name` (matches filename slug), `platforms` (explicit list). **Step 7.5 additions** (manifest-sync conformance; backfilled going forward): `lifecycle`, `produced_by`, `provenance`.
- **Required sections:** Context, Target Platforms & Surfaces, Flow Diagram, Per-Surface Entry Points, Screen Inventory, Screen Wireframes, Per-Surface Mini-Frames, Critical Edge-State Variants, Coverage Map, Surface Coverage Map, Edge Cases Handled, Per-Surface Edge States, Validation Summary. Sub-flows + Next Step when applicable.
- **Consumed by:** `system-architecture` (reads every flow for API design), `task-breakdown` (reads flows to scope decomposition), `orchestrate-product` (reads index.md for state detection), `fresh-eyes` (post-implementation verification).
- Full per-flow template + index.md template + filename + version-increment rule: [`references/report-template.md`](references/report-template.md) [PROCEDURE].

## Chain Position

Prev: `brand-system` (optional — design tokens). Next: implementation. Related: `system-architecture` (API design), `task-breakdown` (decomposition), `discover` (specs).

**Re-run triggers:** significant feature changes, new research, usability failures, new user roles.

**Deference:** `discover` if requirements unclear · `brand-system` for design tokens · `task-breakdown` for decomposition.

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Structure | 1 parallel | `agents/structure-agent.md` | Entries, screens, decisions, exits, flow type, **surface entry map** |
| Edge Case | 1 parallel | `agents/edge-case-agent.md` | Error/empty/loading/permission/offline + **per-surface edge states** |
| Diagram | 2a parallel | `agents/diagram-agent.md` | Mermaid flowchart, 5 node shapes, annotations |
| Wireframe | 2a parallel | `agents/wireframe-agent.md` | ASCII wireframe per core screen + edge variants + **per-surface mini-frames** |
| Validation | 2b seq | `agents/validation-agent.md` | Miller's threshold, ≤3 actions/screen, integrity, **surface coverage** |
| Critic | 2b final | `agents/critic-agent.md` | Full rubric PASS/FAIL + **surface coverage matrix** |

### Shared references (read by agents)

- `references/research-checklist.md` — pre-design research methods, IA, content strategy
- `references/platform-touchpoints.md` — surface catalog (13 platforms + cross-platform channels): entry triggers, flow roles, native dimensions, per-surface edge states

## Routing Logic

Single route — all flows use the full stack. Flows >15 screens auto-split via structure-agent's sub-flow decomposition. Pipeline: Step 0 (interview + gated enumeration) → **Layer 1 parallel** (structure + edge-case) → Merge → **Layer 2a parallel** (diagram + wireframe) → **Layer 2b sequential** (validation → critic). Critic FAIL re-dispatches named agents (max 2 cycles). Deliver to `.agents/skill-artifacts/product/flow/<flow-name>.md`; update `index.md` if ≥2 flows.

## Dispatch Protocol

### How to spawn a sub-agent

1. **Read** the agent instruction file — include FULL content in the Agent prompt.
2. **Append** context (product, user, goal, platform, constraints) per [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] "Context to pass to all agents."
3. **Resolve paths to absolute** (rooted at this skill's directory).
4. **Pass upstream artifacts by content**: orchestrator reads `.agents/skill-artifacts/` files and includes excerpts; sub-agents don't read artifact files directly.
5. On critic FAIL, append feedback under `## Critic Feedback — Address Every Point`.

### Conventions

- **Source citation:** Cite UX heuristics/research/patterns; include URLs; flag unattributable claims `[UNVERIFIED]`.
- **Context loaded:** Artifact body lists which upstream artifacts were read + versions/dates (audit trail).

### Layer 1: Parallel Foundation

Spawn **IN PARALLEL** (wait for both — outputs feed merge and Layer 2):

| Agent | Instruction File | Pass These Inputs | Reference Files |
|-------|-----------------|-------------------|-----------------|
| Structure Agent | `agents/structure-agent.md` | brief (product + user + goal + platforms + surface matrix + constraints) | `references/research-checklist.md`, `references/platform-touchpoints.md` |
| Edge Case Agent | `agents/edge-case-agent.md` | brief (product + user + goal + platforms + surface matrix + constraints) | `references/research-checklist.md`, `references/platform-touchpoints.md` |

### Merge step

Combine structure + edge-case outputs into a unified flow model:

- **Structure:** flow classification, entry points, platform-surface entry matrix, core screens (name/purpose/actions/responses), decisions, exits, transitions.
- **Edge-case:** error/empty/loading/permission/offline per screen, back/cancel paths, per-surface platform edge states (app not running, widget stale, refresh throttled, notification grouping, deep-link fallback, etc.).

**Cross-reference checks before Layer 2:** (1) every screen has edge coverage; (2) every platform × surface has an entry-matrix row; (3) every platform × surface has a per-surface edge-state row. Flag failures before dispatching Layer 2.

### Layer 2a: Parallel Rendering

Spawn **IN PARALLEL** (both consume merged Layer 1 output; wait for both before Layer 2b):

| Agent | Instruction File | Pass These Inputs | Reference Files |
|-------|-----------------|-------------------|-----------------|
| Diagram Agent | `agents/diagram-agent.md` | brief + merged structure + edge cases | none |
| Wireframe Agent | `agents/wireframe-agent.md` | brief + platforms + surface matrix + merged structure + edge cases | `references/platform-touchpoints.md` (per-surface native dimensions) |

### Layer 2b: Sequential Chain

Dispatch **ONE AT A TIME, IN ORDER:**

| Step | Agent | Instruction File | Receives |
|------|-------|-----------------|----------|
| 1 | Validation Agent | `agents/validation-agent.md` | Structure + edge cases + diagram + wireframes |
| 2 | Critic Agent | `agents/critic-agent.md` | Complete flow (all outputs merged + validation results) |

### Critic Gate

- **PASS:** Deliver artifact per [`references/report-template.md`](references/report-template.md) [PROCEDURE].
- **FAIL:** Re-dispatch named agent(s) with feedback per [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "When the critic FAILs." Max 2 cycles. After 2 failures, deliver with critic annotations and flag to user (status: DONE_WITH_CONCERNS).

For an annotated full walkthrough (food-delivery checkout, 13 surfaces, all 6 agents + critic decisions): [`references/examples/checkout-walkthrough.md`](references/examples/checkout-walkthrough.md) [EXAMPLE].

## Single-Agent Fallback

If multi-agent dispatch is unavailable or mode-resolver downgrades to `fast`, execute agent instructions sequentially in-context: Layer 1 (structure → edge cases) → Layer 2 (diagram + wireframes → validation) → critic. The 7 Critical Gates + mandatory platforms+surfaces gate fire in fallback mode regardless — safety contract is mode-independent.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. 13-pattern catalog — re-read before dispatching any layer that smells off (happy-path-only edge-case output, generic screen names, wireframe-structure drift, "cross-platform" creeping back in, edge-state-skipping). When-to-defer guidance + critic-FAIL handling also live there.

## Completion Status

Every run ends with explicit status:

- **DONE** — flow specified for all declared platforms with structure, wireframes, edge states, and per-surface coverage; critic PASS.
- **DONE_WITH_CONCERNS** — flow complete but with platform surfaces under-specified (e.g., widget refresh budget unverified, Live Activity ceiling not modeled); flagged inline.
- **BLOCKED** — feature scope unclear or contradictory across declared platforms; needs user clarification before flow can converge.
- **NEEDS_CONTEXT** — `research/product-context.md` missing for audience grounding; recommend `icp-research` or interview the user.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why, methodology, principles, when NOT to use, history
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE] — canonical Pre-Dispatch spec
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior + safety-gates-supersede contract
- [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] — Warm + Cold prompts + platforms+surfaces gate + brief-context contract
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 13-pattern catalog + when to defer + critic-FAIL handling
- [`references/report-template.md`](references/report-template.md) [PROCEDURE] — per-flow template + index.md template + filename + version-increment
- [`references/examples/checkout-walkthrough.md`](references/examples/checkout-walkthrough.md) [EXAMPLE] — food-delivery checkout (13 surfaces, multi-platform) end-to-end
- [`references/platform-touchpoints.md`](references/platform-touchpoints.md) — surface catalog (13 platforms + cross-platform channels): entry triggers, flow roles, native dimensions, per-surface edge states (pre-existing, agents consume)
- [`references/research-checklist.md`](references/research-checklist.md) — pre-design research methods, IA, content strategy (pre-existing, agents consume)
- `scripts/generate_flow.py` — generate Mermaid diagrams programmatically for complex / multi-variant flows
