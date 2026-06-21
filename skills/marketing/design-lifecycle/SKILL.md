---
name: design-lifecycle
description: "Designs lifecycle / email-automation flows — onboarding, activation, winback, churn-save — as multi-step trigger, message, timing, and branch maps anchored to an activation metric, with suppression rules and a quantitative critic gate. Use for retention email/notification automation against a real list + product. Not for one-off broadcast copy (use write-copy), cold outreach (use write-outreach), organic social (use write-social), or paid-ad creative (use write-ad)."
argument-hint: "[flow-type + activation-metric + trigger, e.g. 'onboarding / first-project-created / signup']"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-2"
---

# Design Lifecycle — Orchestrator

*Retention — designs a lifecycle automation flow (onboarding / activation / winback / churn-save) as a trigger→message→timing→branch map anchored to one activation metric, scored by a quantitative critic. Capability metadata: [`routing.yaml`](routing.yaml). Methodology, philosophy, scope: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].*

**Core question:** "Does every message in this flow move the user toward ONE named activation metric, fire on a real product event, and stop sending the moment the user already did the thing?"

## Critical Gates — read first

1. **Name the activation metric BEFORE writing any message.** A lifecycle flow that isn't anchored to a measurable activation event ("created first project", "invited a teammate", "second session within 7 days") is a broadcast, not a flow. No metric → BLOCK and ask one question.
2. **Every send is event-triggered, never time-only-spray.** Each step declares its trigger (product event OR elapsed-time-since-event) AND its **suppression rule** — the condition under which the user EXITS the flow (they already activated, unsubscribed, converted, or a higher-priority flow took over). A flow with no exit condition is spam.
3. **One flow, one job, one metric per artifact.** Onboarding ≠ winback ≠ churn-save. Cross-purpose flows run the skill once per job. The flow-architect refuses to stack two activation metrics in one map.
4. **No PII, no list purchase, no consent bypass.** The flow targets an OWNED, consented list. It never assumes a bought list, never writes a step that bypasses unsubscribe, never sends to non-consented addresses. This is a hard gate, not a critic dim.
5. **The flow is a design, not a send.** This skill produces the flow map + per-step copy + measurement plan. It NEVER connects to an ESP or sends mail — publishing is human-owned + out of scope (see Guardrails in `references/playbook.md`).

## Quality Gate — 6 dimensions

Full rubric + Pass/Fail bands + per-dim scoring: [`references/rubric.md`](references/rubric.md) [PROCEDURE]. Critic agent: [`agents/critic.md`](agents/critic.md).

- **Gate:** Total ≥30/42 AND every dim ≥4/7. Below either → FAIL, route to the named agent, max 2 rewrite cycles.
- Dimensions: **Activation-fit** · **Trigger/Suppression soundness** · **Timing discipline** · **Branch logic** · **Per-step copy quality** · **Measurability**.

## Before Starting

Per [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Recommended context:

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | research-icp | Recommended — the product's "aha" + activation event + value moment |
| `research/icp-research.md` | research-icp | Recommended — persona, churn drivers, the job the user hired the product for |
| `brand/BRAND.md` | create-brand | Recommended — voice anchors + banned-language for the per-step copy |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | Optional — the email/Mailbox channel's role in the broader GTM |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). **Needed dimensions:** flow-type (onboarding / activation / winback / churn-save) · activation-metric (the ONE event the flow drives) · entry-trigger (the product event or signup that starts the flow) · available product events (what the product can actually fire) · list-channel (email / push / in-app) · voice source. Missing activation-metric OR entry-trigger → hard-block, ask one question. Full Cold Start + Missing-Input Hard Blocks: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `budget: deep`. `--fast` collapses to a single inline pass (one flow path, no branch enumeration, no rewrite loop). **`--fast` does NOT skip** Cold Start, Critical Gates 1-5, or the consent/PII hard gate.

## Agents + Routes

4 sub-agents (flow-architect → copy → measurement → critic) across Layer 1 architecture → Layer 2 copy+measurement → critic gate. Two routes — A (compose a new flow), B (called by another skill, e.g. plan-campaign building the Mailbox channel). Full manifest + dispatch graph: [`references/agent-manifest.md`](references/agent-manifest.md) [PROCEDURE].

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/design-lifecycle/[flow-type]-[date]-[slug].md`
- **Lifecycle:** `pipeline` — re-run on activation-metric change, new product event, or churn-driver shift.
- **Frontmatter + body section order + the flow-map table schema:** [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].
- **Consumed by:** `measure-results` (the flow's per-step activation lift closes the loop), `evaluate-content` (per-step copy scoring).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any flow ships: time-only spray, no suppression rule, vanity-metric anchor (opens not activation), every-step-same-CTA, winback-as-discount-reflex, onboarding longer than the activation window, ignoring the unsubscribe gradient.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (references/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — flow map + per-step copy + measurement plan written, critic PASS.
- **DONE_WITH_CONCERNS** — flow complete but with a thin product-event inventory or an estimated activation baseline; flagged in the artifact.
- **BLOCKED** — flow-type and activation-metric imply different flows; needs a user scope decision.
- **NEEDS_CONTEXT** — no activation metric definable (product has no measurable value moment); recommend `research-icp` / product-context first.

## Worked Example

End-to-end onboarding flow (B2B SaaS, activation = "first project shared with a teammate within 14 days", 5-step event-triggered map + 2 branches + suppression rules + measurement plan + critic PASS cycle 1, with a cycle-0 FAIL the critic caught): [`references/examples/lifecycle-walkthrough.md`](references/examples/lifecycle-walkthrough.md) [EXAMPLE].

## References

- `references/{playbook, rubric, format-conventions, anti-patterns, agent-manifest}.md`
- `references/procedures/pre-dispatch.md` [PROCEDURE]
- `references/examples/lifecycle-walkthrough.md` [EXAMPLE]
- `agents/{flow-architect, copy, measurement, critic}.md`
- `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, marketing-foundations}.md`
