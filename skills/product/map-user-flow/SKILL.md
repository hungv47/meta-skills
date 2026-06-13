---
name: map-user-flow
description: "Maps multi-step in-product flows — screens, decisions, transitions, platform-native touchpoints (dock, menu bar, widgets, notifications, Live Activity), edge cases, and error states for a feature or user journey. Use when designing or auditing a feature spanning multiple screens, states, or platforms. Not for visual brand design (use create-brand), landing-page architecture (use brief-landing-page), or technical architecture (use architect-system)."
argument-hint: "[feature or flow to map]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.20-0.50"
---

# User Flow Design — Orchestrator

*Design Step 2 of 2. Maps navigation paths, decisions, edge cases, platform-native touchpoints, and screen transitions into a validated flow (Mermaid + ASCII wireframes + per-surface mini-frames).*

**Core Question:** "Can the user complete their goal without thinking — on every surface of every platform it ships on?"

> Why, methodology, principles, history: `references/playbook.md` [PLAYBOOK].

## When To Use

Design / redesign / audit a feature with multiple screens / decisions / states / platforms, or map a new platform-native surface (widget, Live Activity, watch app) into an existing flow.

**Not for:** brand (`/create-brand`) · API (`/architect-system`) · decomposition (`/breakdown-tasks`) · scoping (`/discover`) · single-page landing (`/brief-landing-page`).

## Critical Gates — Read First

Gate 1 (platforms+surfaces) fires **before** Pre-Dispatch — wireframe size, entry triggers, per-surface edge states all depend on it.

1. **No Layer 1 before platforms + surfaces enumerated** (`references/platform-touchpoints.md`).
2. **Reject "cross-platform".** Enumerate explicitly from the 13-platform list.
3. **No diagrams before structure.**
4. **No skipping edge cases.** Error / empty / loading / permission / offline + per-surface edge states.
5. **Challenge >7 happy-path steps** (Miller).
6. **One flow = one file.**
7. **Stale product context (>30 days)** → re-run `research-icp`.

Full rationale + 13-platform list + critic-FAIL handling: [`references/procedures/gates-and-rubric.md`](references/procedures/gates-and-rubric.md) [PROCEDURE].

## Quality Gate

Critic (`agents/critic-agent.md`) runs the full rubric. Non-negotiable PASS:

- Platforms + surfaces enumerated; every platform × surface has entry + mini-frame + per-surface edge state (dimensions match `references/platform-touchpoints.md`)
- Every decision point ≥2 labeled exits; no dead-end errors
- Happy path ≤7 steps; ≤3 primary actions per screen
- Every core screen: ASCII wireframe + 2-4 sentence Description; CTAs match structure actions
- 2-3 critical edge-state variants included

## Before Starting

Apply `references/_shared/before-starting-check.md` [PLAYBOOK]. `budget: standard`; `--fast` forces Single-Agent Fallback per `references/_shared/mode-resolver.md` [PROCEDURE]. **Safety gates supersede `--fast`.**
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | research-icp | Recommended (>30d → re-run) |
| `.forsvn/experience/{audience,technical,goals}.md` | any | Recommended |
| `implementation-roadmap/canonical-paths.md` | architect-system | Optional |
| `brand/{DESIGN,BRAND}.md` | create-brand | Optional |

## Pre-Dispatch

**Dimensions:** feature, role/persona, goal, platforms (explicit), surfaces per platform, primary surface, constraints (auth + min OS). Read order + Warm/Cold Start prompts (with platforms+surfaces gate) + write-back + brief-context contract: `references/procedures/pre-dispatch.md` · `references/pre-dispatch-prompts.md` [PROCEDURE].

## Artifact Contract

- **Path:** `.forsvn/artifacts/product-map-user-flow-<YYYY-MM-DD>-<flow-name>.md` (flat v2; one file per flow; index auto-generated at ≥2 slugs). **Lifecycle:** `pipeline`.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `stack: product`, `review_surface: html` (FIRE preview while `decision_state: pending`), `decision_state`, `flow_name`, `platforms`, plus manifest-sync `lifecycle`, `produced_by`, `provenance`. v2 schema: `references/_shared/artifact-contract-template.md`.
- **Required sections + per-flow template + index.md + filename + version-increment:** [`references/report-template.md`](references/report-template.md) [PROCEDURE].
- **Consumed by:** `architect-system`, `breakdown-tasks`, `forsvn`, `review-work`.

## Tooling

Upstream [`tool-redirect.md`](references/_shared/tool-redirect.md).

## Routing + Dispatch

Single route, full stack. Flows >15 screens auto-split via structure-agent sub-flow decomposition. **Pipeline:** Step 0 → L1 ∥ (structure ∥ edge-case) → Merge → L2a ∥ (diagram ∥ wireframe) → L2b seq (validation → critic). Critic FAIL re-dispatches (max 2 cycles).

Agent manifest, spawn mechanics, dispatch tables, Single-Agent Fallback: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) · [`references/dispatch-protocol.md`](references/dispatch-protocol.md). Worked example: [`references/examples/checkout-walkthrough.md`](references/examples/checkout-walkthrough.md) [EXAMPLE].

## Anti-Patterns

13-pattern catalog (happy-path-only edge cases, generic screen names, wireframe drift, "cross-platform" creep) + when-to-defer + critic-FAIL: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN].

## Chain Position

Prev: `create-brand` (optional). Next: `architect-system` → `breakdown-tasks`. **Defer to:** `discover`, `create-brand`, `breakdown-tasks`. **Re-run on:** feature changes, new research, usability failures.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — flow specified for all declared platforms with structure, wireframes, edge states, per-surface coverage; critic PASS.
- **DONE_WITH_CONCERNS** — flow complete but surfaces under-specified (e.g., widget refresh budget unverified, Live Activity ceiling not modeled); flagged inline.
- **BLOCKED** — feature scope unclear or contradictory across platforms.
- **NEEDS_CONTEXT** — `research/product-context.md` missing; recommend `research-icp`.
