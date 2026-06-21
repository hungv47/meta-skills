---
title: Plan-Budget — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: plan-budget
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** the orchestrator dispatches agents (Layer 1 + Layer 2) and assembles the artifact. Companion to `agent-manifest.md` (the agent table + routes) — this file covers spawn mechanics, the orchestrator-written sections, the rewrite loop, chain position, and re-run triggers.

---

## Spawn order

```
LAYER 1 (solo):
  allocator  — agents/allocator.md
             + inputs (budget, objective, horizon, channel set, cac_by_channel, ltv_by_channel, current_spend, constraints)
             + references/marginal-return-model.md
             + references/_shared/performance-data.md   (sourced-CAC read)
             + references/anti-patterns.md

LAYER 2 (sequential):
  constraint-checker  — agents/constraint-checker.md + the allocator's proposal + constraints + channel_vetoes
       PASS              → continue to critic
       REVISION_REQUIRED → re-dispatch allocator with the violations (does NOT consume a critic cycle)
       HARD_STOP         → escalate to the user (fired §0 veto / spend-shaped action); do not auto-resolve
  critic              — agents/critic.md + the post-constraint allocation + inputs + cac_sourcing + constraint_verdict
       PASS  → orchestrator writes the artifact
       FAIL  → re-dispatch per the critic's Rewrite Routing (max 2 cycles); cycle 3 → auto-surface
```

## Orchestrator-written sections

The agents produce the analysis; the orchestrator assembles the artifact in the fixed section order (`format-conventions.md` § "Body section order"):

- `## Inputs` — written by the orchestrator from the resolved Pre-Dispatch dimensions.
- `## Sourcing Ledger`, `## Marginal-Return Reasoning`, `## Allocation`, `## Reallocation Triggers` — from the allocator's output (after the constraint-checker + critic passes).
- `## Constraints Applied` — from the constraint-checker's PASS verdict (floors that bound, the concentration cap, any §0-veto override + reason).
- `## Risks & Concerns` — the orchestrator collects: any hypothesis lane, thin saturation data, a `DONE_WITH_CONCERNS` driver, a stale-CAC flag.

## The rewrite loop

- **Constraint REVISION_REQUIRED** routes back to the allocator and does **not** consume a critic cycle (it is a bounds fix, not a quality fail).
- **Critic FAIL** consumes a cycle and routes per the critic's Rewrite Routing table (most failures → allocator; floor/veto/concentration → constraint-checker then allocator; multi-dim → orchestrator re-runs from the allocator).
- **Max 2 critic rewrite cycles.** On cycle 3, the critic returns `PASS_WITH_CONCERNS` with the scorecard and an auto-surface banner — the operator decides whether to ship or escalate to manual rework.
- **HARD_STOP never loops.** A fired §0 veto or a spend-shaped action escalates to the human immediately; the loop resumes only after the human's decision is fed back.

## Single-agent fallback

Under `--fast` or the session's single-agent profile (`references/_shared/execution-policy.md`), the orchestrator runs the three roles inline in one pass: a coarse-band allocation, a single constraint sweep, one critic pass. The Critical Gates, the CAC-fabrication ban, the floors/vetoes, and the critic floor still fire — `--fast` reduces orchestration weight, never the integrity floor.

## Chain position

```
plan-campaign (selects channels) ──▶ plan-budget (allocates dollars) ──▶ write-ad (per-channel creative)
                                            ▲                                      │
                                            └──────── measure-results ◀────────────┘
                                              (feeds sourced CAC; closes the loop on predicted marginal CACs)
```

plan-budget reads `plan-campaign`'s selected channel set + §0 vetoes upstream and `measure-results`' performance store for sourced CACs; it feeds `write-ad` per-channel spend context and `plan-campaign` per-channel execution weight downstream. `measure-results` later closes the loop: did the allocation's predicted marginal CACs hold?

## Re-run triggers

Re-invoke plan-budget when:

- A **CAC update** lands (a new measure-results snapshot moves a channel's sourced CAC).
- The **budget changes** ±20% (the saturation knees shift; the optimum moves).
- **plan-campaign reselects** the channel set (a channel added or dropped).
- A **reallocation trigger fires** (a channel's measured CAC breaches its planned threshold for the trigger window).
- A **hypothesis lane resolves** (it cleared or missed its promotion target — promote to an allocation lane or cut it).

## Skill deference

- "Which channels should I even use?" → `plan-campaign` (selection, not allocation).
- "What CAC / conversion-rate target should I hit?" → `plan-funnel` (numeric targets, not allocation).
- "Write the ad for channel X" → `write-ad`.
- "How did the channels actually perform?" → `measure-results`.
- "Move the budget in Ads Manager" → **no skill does this** — spend is human-owned; plan-budget outputs a plan the human enters.
