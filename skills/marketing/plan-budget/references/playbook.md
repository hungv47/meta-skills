---
type: playbook
schema_version: 1
last_verified: 2026-06-21
verifier: hungv47
---

# Plan-Budget Playbook

Why this skill exists, the allocation philosophy, the scope boundary, when NOT to use it, what it pulls from elsewhere.

[PLAYBOOK] — durable context; loaded when the orchestrator needs the why behind a decision.

## Why this skill exists

It answers the decision *above* ad-writing: "I have $X/mo — where does it go?" `plan-campaign` selects *which* channels; `write-ad` writes the creative; `measure-results` scores what happened. None of them allocates *dollars* across the selected channels with CAC/LTV math and marginal-return reasoning. That is the gap plan-budget fills — the natural apex of the paid-ads depth: once a founder has real spend across multiple networks, allocation beats creative for ROI.

## The allocation philosophy — marginal return, honestly

Two principles, both load-bearing:

1. **Allocate on marginal return, not average CAC.** The only question for the next dollar is "where does *this* dollar earn most?" — which is each channel's marginal CAC at its current spend, on its diminishing-returns curve. A channel cheap on average but saturated has an expensive marginal CAC. The optimum equalizes marginal return across channels, subject to floors, the concentration cap, and §0 vetoes. Model: `references/marginal-return-model.md`.

2. **Never fabricate the inputs.** An allocation is only as honest as its CAC/LTV numbers. Every number is sourced (measure-results, operator-supplied + labeled, or a cited benchmark) or it does not enter the math. An unsourced channel is a capped *hypothesis lane* buying data, never a number-backed allocation. Zero sourced inputs → `NEEDS_CONTEXT`. This is the same anti-fabrication discipline `research-icp` (VoC gate) and `write-ad` (substantiation floor) enforce — a number in a deliverable must trace to a real source.

The combination is the premium bar: a base model asked "how should I split my budget?" will volunteer an even split or an average-CAC ranking. plan-budget refuses both — it computes marginal return, respects diminishing returns and floors, and never invents a CAC.

## Multi-agent orchestration

Three sub-agents over allocate → constraint-check → critic:

- **allocator** — builds the sourcing ledger, fits curve positions, proposes the split by equalizing marginal return, drafts triggers.
- **constraint-checker** — a hard gate: floors, the §0 channel-fit veto, the concentration cap, the mixed-objective pool split, and the absolute no-autonomous-spend gate (PASS / REVISION_REQUIRED / HARD_STOP).
- **critic** — the 7-dim quantitative rubric.

This is not a single prompt. The constraint-checker exists because the allocator optimizes and the optimizer must be *bounded* before a human sees it (floors and vetoes are not negotiable); the critic exists because "looks rigorous" is not "is sound."

## Scope boundary — what plan-budget is NOT

| It does | It does NOT | Use instead |
|---|---|---|
| Allocate dollars across selected channels | Select which channels to use at all | `plan-campaign` |
| Reason about CAC/LTV + marginal return | Set numeric funnel / conversion targets | `plan-funnel` |
| Produce a spend plan + reallocation triggers | Write the per-channel ad creative | `write-ad` |
| Predict marginal CACs | Score what actually happened | `measure-results` |
| Output a plan a human executes | Move money / connect an ad manager / spend | (no skill — spend is human-owned) |

**The collapse test:** if the output is a channel-selection table with no dollar allocation and no marginal CAC, it has collapsed into `plan-campaign` and should not ship — enrich plan-campaign instead. plan-budget earns its place only by adding the dollar math `plan-campaign` doesn't do.

## When NOT to use it

- **No real spend / no sourced CAC yet.** With no paid history and no operator CACs, there is nothing to allocate honestly. The skill returns `NEEDS_CONTEXT` and points to running ads + `measure-results` first. Building an allocation engine for traffic that doesn't exist is procrastination dressed as rigor.
- **One channel only.** Allocation across one channel is trivial; just spend to the channel's saturation knee. plan-budget is for ≥2 channels competing for a fixed budget.
- **Channel selection still open.** Run `plan-campaign` first; plan-budget allocates across an *already-selected* set.

## What it pulls from elsewhere

- **measure-results** `.forsvn/performance/*.tsv` — the sourced-CAC substrate (read contract: `references/_shared/performance-data.md`).
- **plan-campaign** `campaign-plan.md` — the selected channel set + per-channel `network` + the launch-channel pack §0 vetoes the constraint-checker enforces.
- **research-icp** / **product-context** — LTV inputs (pricing × margin × retention) and the objective framing.

## The no-spend invariant

plan-budget produces a *plan*. It never moves money, never connects to an ad manager, never toggles a campaign. The publish/spend gate is hard-stopped for a human (`gate_class: review`). This is not config-toggleable — spend / publish / irreversible actions stop for a human, always. The reallocation triggers tell the operator *when* to re-invoke; the operator, not the skill, enters every dollar.

## History

- **v1.0.0 (2026-06-21)** — initial build (roadmap WS-K / K2 / FOR-28). Shipped via the G-discipline gate's worked-example path: the $6,000/mo 4-channel allocation in `references/examples/plan-budget-walkthrough.md` clears the premium bar (real marginal-CAC math across ≥3 channels a base model wouldn't produce, plus the anti-fabrication discipline).
