---
name: design-referral
description: "Designs referral / viral loops — loop mechanics, K-factor + cycle-time math, incentive economics (CAC-bounded), and a falsifiable trigger — with a quantitative critic gate. Use when a product with retention wants a referral or word-of-mouth loop. Not for paid-ad creative (use write-ad), channel-mix strategy (use plan-campaign), lifecycle email flows (use design-lifecycle), or affiliate/partnership outreach (use write-outreach)."
argument-hint: "[loop-type + the shareable moment + incentive idea, e.g. 'double-sided / after first shared report / 1 month free']"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-2"
---

# Design Referral — Orchestrator

*Referral — designs a viral / referral loop as loop mechanics + K-factor and cycle-time math + CAC-bounded incentive economics + a falsifiable trigger, scored by a quantitative critic. Capability metadata: [`routing.yaml`](routing.yaml). Methodology, philosophy, scope: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].*

**Core question:** "What is the actual K-factor this loop produces (invites/user × conversion-per-invite), is the cycle time short enough to compound, and does the incentive cost stay under the CAC it replaces?"

## Critical Gates — read first

1. **Compute K, don't assert it.** K = (invites sent per active user) × (conversion rate per invite). A loop without this math is a wish. Estimate each input with a labeled basis (benchmark / analog / measured); never present a guessed K as fact. K ≥ 1 = viral; 0.3–1 = a real assist that lowers blended CAC; < 0.15 with a costly incentive = kill.
2. **Cycle time is half the engine.** Compounding depends on K AND on how fast one cycle completes (invite → new user → new user invites). A K of 0.5 at a 3-day cycle beats a K of 0.7 at a 60-day cycle. Both must be stated.
3. **The incentive must be CAC-bounded.** Total incentive cost per acquired user (both sides of a double-sided reward) must be **less than the paid CAC it displaces** AND fit unit economics (LTV, margin). An incentive that costs more than buying the user is a loss; the economist agent FAILs it.
4. **The trigger fires at a real share-worthy moment.** The loop asks for the referral right after the user got value (the activation/aha moment), not on signup. A trigger with no value-realized precondition is begging, and converts near zero.
5. **No fraud-blind loop, no fake scarcity, no autonomous payout.** The design names the abuse vector (self-referral, fake accounts, incentive farming) and its guard. It never fabricates scarcity. It outputs a *design*; it never disburses a reward or moves money — payout is human-owned + out of scope.

## Quality Gate — 6 dimensions

Full rubric + Pass/Fail bands: [`references/rubric.md`](references/rubric.md) [PROCEDURE]. Critic agent: [`agents/critic.md`](agents/critic.md).

- **Gate:** Total ≥30/42 AND every dim ≥4/7. Below either → FAIL, route to the named agent, max 2 rewrite cycles.
- Dimensions: **Loop-math soundness** · **Cycle-time realism** · **Incentive economics** · **Trigger placement** · **Mechanic falsifiability** · **Fraud/abuse guard**.

## Before Starting

Per [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Recommended context:

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | research-icp | Recommended — the value moment (the share trigger) + unit economics |
| `research/icp-research.md` | research-icp | Recommended — who the user would refer + the social context |
| `docs/forsvn/artifacts/marketing/design-lifecycle/*.md` | design-lifecycle | Optional — the activation event the referral trigger fires after |
| `.forsvn/performance/*.tsv` | measure-results | Optional — measured CAC the incentive must beat |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). **Needed dimensions:** product has retention/PMF (HARD precondition — a leaky product virally spreads churn) · the share-worthy moment (the trigger) · loop-type (one-sided / double-sided / milestone / collaborative-native) · unit economics (CAC-to-beat, LTV, margin) · incentive idea (or "recommend one"). Missing retention-evidence OR no share moment → BLOCK. Full Cold Start + Missing-Input Hard Blocks: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `budget: deep`. `--fast` collapses to a single inline pass (one loop variant, K-math + economics inline, no rewrite loop). **`--fast` does NOT skip** Cold Start, Critical Gates 1-5, the retention precondition, or the no-payout gate.

## Agents + Routes

4 sub-agents (loop-architect → incentive-economist + mechanic-copy → critic) across Layer 1 loop design → Layer 2 economics + mechanic → critic gate. Two routes — A (design a new loop), B (called by another skill). Full manifest + dispatch graph: [`references/agent-manifest.md`](references/agent-manifest.md) [PROCEDURE].

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/design-referral/[loop-type]-[date]-[slug].md`
- **Lifecycle:** `pipeline` — re-run on incentive change, measured-K update, or unit-economics shift.
- **Frontmatter + body order + the K-factor math block schema:** [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].
- **Consumed by:** `measure-results` (the loop's measured K + payback close the loop), `plan-campaign` (referral as a selected channel).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any loop ships: asserted-K-without-math, ignoring cycle time, incentive-costs-more-than-CAC, trigger-on-signup-not-value, referral-on-a-leaky-product, fraud-blind incentive, fake scarcity, double-sided reward that breaks margin.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (references/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — loop mechanics + K/cycle math + incentive economics + trigger + fraud guard written, critic PASS.
- **DONE_WITH_CONCERNS** — loop complete but with estimated (not measured) K inputs or thin unit economics; flagged in the artifact.
- **BLOCKED** — product lacks retention evidence (referral would spread churn); needs a retention/PMF decision first.
- **NEEDS_CONTEXT** — no unit economics available to bound the incentive; recommend `measure-results` / product-context first.

## Worked Example

End-to-end double-sided loop (B2B reporting tool, K computed from labeled inputs, 3 loop variants compared on K × cycle-time × incentive-cost, CAC-bounded reward, fraud guard, critic PASS with a cycle-0 FAIL the critic caught): [`references/examples/referral-walkthrough.md`](references/examples/referral-walkthrough.md) [EXAMPLE].

## References

- `references/{playbook, rubric, format-conventions, anti-patterns, agent-manifest, loop-models, incentive-economics}.md`
- `references/procedures/pre-dispatch.md` [PROCEDURE]
- `references/examples/referral-walkthrough.md` [EXAMPLE]
- `agents/{loop-architect, incentive-economist, mechanic-copy, critic}.md`
- `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, marketing-foundations}.md`
