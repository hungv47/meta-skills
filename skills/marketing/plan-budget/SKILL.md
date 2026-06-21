---
name: plan-budget
description: "Allocates a paid-marketing budget across channels — CAC/LTV-aware mix, marginal-return reasoning, min-viable-spend floors, and reallocation triggers, with a quantitative critic gate. Use when you have $X/mo and must decide where it goes. Not for channel selection (use plan-campaign), numeric funnel targets (use plan-funnel), per-channel ad copy (use write-ad), or scoring past results (use measure-results)."
argument-hint: "[total budget] [objective: acquisition | retention | mixed] [known CACs per channel]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-2"
---

# Plan Budget — Orchestrator

Allocates a fixed paid budget across already-selected channels: CAC/LTV-aware mix, marginal-return reasoning over diminishing-returns curves, min-viable-spend floors, and explicit reallocation triggers. Multi-agent allocate → constraint-check → critic pipeline. Capability metadata lives in [`routing.yaml`](routing.yaml). Agent table + 3 routes + 7-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology, marginal-return model, scope boundary, history: [`references/playbook.md`](references/playbook.md).

**Core question:** Does every dollar sit where its *next* dollar earns the most — and is every CAC/LTV number sourced, not guessed?

## Critical Gates — load first

1. **Never fabricate CAC or LTV.** Every channel's CAC/LTV is sourced (`measure-results` `.forsvn/performance/*.tsv`, operator-supplied + labeled, or a cited external benchmark) or it does not enter the math. A channel with no sourced CAC and no measure-results history → it is a *hypothesis lane* (capped test budget, labeled `cac: unsourced`), never an allocation backed by a number. Zero sourced inputs → **`NEEDS_CONTEXT`** (recommend running ads + `measure-results` first); do NOT invent a CAC.
2. **Hard-block Pre-Dispatch inputs.** Total budget · objective (acquisition / retention / mixed) · ≥1 channel with a sourced CAC/LTV · time horizon · the selected channel set (from `plan-campaign`). Missing any → BLOCK and ask one question. Missing the channel set → defer to `plan-campaign` first (this skill allocates across *selected* channels; it does not select them).
3. **Marginal return, not average.** Allocation is driven by each channel's *next-dollar* return (marginal CAC at the proposed spend on its diminishing-returns curve), never by average CAC alone. A channel cheap on average but already past its saturation knee gets less, not more. Even-split-without-reason is an automatic critic FAIL.
4. **Every channel respects its floor and its §0 veto.** Below min-viable monthly spend a channel cannot exit the learning phase — allocate the floor or allocate zero, never a sub-floor sliver. Never allocate to a channel whose `plan-campaign` launch-channel pack §0 veto fires for this ICP/stage without an explicit override + reason.
5. **No autonomous spend — ever.** Output is a *plan*. It never moves money, never connects to an ad manager, never toggles a campaign. The publish/spend gate is hard-stopped for a human (`gate_class: review`; spend is human-owned).

## Quality Gate — 7 dimensions

Full rubric + Pass/Fail bands: [`references/rubric.md`](references/rubric.md). Critic logic + rewrite routing: [`agents/critic.md`](agents/critic.md).

- **Gate:** Total ≥49/70 AND every dim ≥6. Total 49-55 with all dims ≥6 = PASS as `DONE_WITH_CONCERNS`. Any dim <6 = FAIL.
- The seven dims: Input integrity (sourced CAC/LTV) · Marginal-return soundness · Diminishing-returns respect · Floor + veto compliance · Concentration balance · Reallocation triggers · Objective fit. Max 2 rewrite cycles; cycle 3 auto-surfaces with the scorecard.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Recommended context:

| Artifact | Source | Required? |
|---|---|---|
| `.forsvn/performance/*.tsv` | measure-results | **Strongly recommended** — sourced CAC per channel; the substrate that keeps Gate 1 honest |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | **Recommended** — the selected channel set + per-channel `network` + §0 vetoes |
| `research/icp-research.md` | research-icp | Recommended — LTV inputs (retention shape, ACV, payback tolerance) |
| `research/product-context.md` | research-icp | Recommended — pricing / margin for LTV; objective framing |
| `docs/forsvn/experience/{business,product}.md` | (any skill) | Optional — persisted CACs / prior allocations |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). Needed dimensions: total budget (monthly) · objective (acquisition / retention / mixed) · time horizon (allocation period in months) · selected channel set (from campaign-plan or operator) · per-channel CAC (sourced — value + source label) · per-channel LTV or payback ceiling · per-channel current spend + observed saturation signal (optional but sharpens the curve) · constraints (channels off-limits, max-concentration cap, min-viable floors if non-default).

Cold Start (7-question) + Missing-Input Hard Blocks (5 conditions) + the sourced-vs-unsourced CAC classification: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `budget: deep`. `--fast` collapses the allocator's curve-fitting to a coarser three-band (under/at/over saturation) pass and skips the second constraint sweep. **`--fast` does NOT skip** Cold Start, Critical Gates 1-5, Missing-Input Hard Blocks, the CAC-fabrication ban, or the critic floor.
Session execution profile (single-vs-multi): inherit per [`references/_shared/execution-policy.md`](references/_shared/execution-policy.md).

## Routes

Three routes — A (quick: ≤3 channels, operator-supplied CACs), B (full: campaign-plan + measure-results grounded), C (called by another skill — reuses a cached allocation or runs Route B if stale). Full dispatch graphs: [`references/agent-manifest.md`](references/agent-manifest.md).

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/plan-budget/[date]-[slug].md` (allocation table + marginal-return rationale + reallocation triggers). Single artifact per run; overwrite on re-run unless version preservation via `[date]-[slug].v[N].md`.
- **Lifecycle:** `pipeline` — re-run on a CAC update, a budget change, a new channel selection, or a fired reallocation trigger.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `stack: marketing`, `review_surface`, the v3 instruction core (`id`, `type`, `keywords`) + domain fields `total_budget`, `objective`, `horizon_months`, `channels`, `cac_sourcing` (`sourced | mixed | hypothesis-only`), `critic_total`. Per-field rules: [`references/format-conventions.md`](references/format-conventions.md).
- **Consumed by:** `plan-campaign` (per-channel execution weight), `write-ad` (per-network spend context), `measure-results` (closes the loop — did the allocation's predicted CACs hold?).
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Field values" — never silently drift.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before any allocation ships. Section 1 — Allocation (even-split-without-reason · sunk-cost doubling-down · average-CAC instead of marginal · over-concentration · ignoring channel saturation · sub-floor slivers · allocating into a §0-veto channel). Section 2 — Input integrity (fabricated CAC · stale CAC shipped silently · unsourced external benchmark dressed as own data · LTV inflated to justify a channel). Section 3 — Process (no reallocation trigger · objective-mismatch allocation · collapsing into plan-campaign). Each row carries a falsifiable detection rule the critic applies.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — allocation across the selected channels with marginal-return rationale + reallocation triggers, critic PASS, every CAC/LTV sourced.
- **DONE_WITH_CONCERNS** — delivered with a flagged risk (one hypothesis lane on an unsourced CAC, thin saturation data, total 49-55 with all dims ≥6) named in the artifact.
- **BLOCKED** — total budget, objective, time horizon, or the selected channel set missing and unresolvable.
- **NEEDS_CONTEXT** — zero sourced CAC inputs and no `measure-results` history; recommend running ads + `measure-results` first, OR `plan-campaign` to select channels. Never fabricate a CAC to proceed.

## Execution

This skill **never spends**. The allocation is a brief for a human to enter into the ad managers themselves. No Assisted/Direct execution fork — there is no render or publish step. The reallocation triggers tell the operator *when* to re-invoke (a channel's measured CAC breaches its trigger, the budget changes, or `plan-campaign` reselects channels).

## Worked Example

End-to-end Route B (a real $6,000/mo split across 4 channels — Meta / Google Search / LinkedIn / newsletter — with marginal-CAC curves, two channels at their saturation knee, one hypothesis lane on an unsourced CAC, a min-viable floor binding on LinkedIn, per-channel reallocation triggers, constraint-checker bounce on an over-concentration cap, critic PASS 60/70) + a cycle-2 FAIL (fabricated CAC) trace: [`references/examples/plan-budget-walkthrough.md`](references/examples/plan-budget-walkthrough.md).
