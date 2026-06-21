# Measurement — Design Lifecycle

[PROCEDURE] — the instrumentation + decision-rule contract the measurement agent enforces. Loaded at Layer-2 measurement dispatch.

## Primary metric: activation lift over a control

The flow's value = `activation-rate(flow cohort) − activation-rate(holdout)` within the activation window. Not opens. Not clicks. Not "engagement". Activation lift, or it didn't happen.

- **Holdout:** a randomized slice of eligible users that receives no flow (or the prior flow, if replacing one). Sized so a meaningful lift is readable.
- **"Activated":** the exact event + window, matching the flow-architect's anchor byte-for-byte. A mismatch between the architect's metric and the measurement's metric is a critic FAIL.

## When the list is too small to A/B

A holdout needs enough users in each arm to read a lift above noise. If the eligible population can't support that:

1. Say so explicitly.
2. Downgrade the claim to **directional pre/post**: compare activation rate in the period before vs. after the flow, and **label it correlational** — confounded by product changes, seasonality, cohort mix.
3. Never present a pre/post delta as a causal lift. This is the single most common measurement lie and the critic FAILs it.

## Per-step diagnostics

Opens / clicks / step-completion localize WHERE a flow breaks — they are not the goal. Each step gets a healthy/unhealthy band:

| Signal | Healthy | Unhealthy → action |
|--------|---------|--------------------|
| Open rate | within the channel's norm | far below → subject problem (copy agent) |
| Click rate | step CTA gets engagement | high opens, no clicks → body/CTA problem (copy) |
| Step-completion | users do the step action | clicks but no completion → product friction (architect: add an unblock step) |
| Activation contribution | step correlates with downstream activation | none → step is overhead (architect: cut it) |

Every diagnostic must be an event the product/ESP can actually emit. A diagnostic on an unobservable event is a defect.

## Decision rules (every flow ships with all three)

- **Iterate-this-step:** a per-step signal below its floor → re-dispatch the owning agent (subject → copy; friction → architect).
- **Kill the flow:** no activation lift over control after the full window AND ≥ the minimum cohort → the flow is sending overhead that erodes deliverability and trust; stop it.
- **Scale:** lift ≥ target over control, holding across ≥2 cohorts → roll to 100%, retire the holdout (or keep a small permanent control).

## Deliverability floor (always)

Whatever the metric, the flow respects: honest unsubscribe, frequency cap, suppression of activated/converted/dead addresses, and no link-bombing. A flow that wins activation but tanks domain reputation is a net loss the kill rule must catch.
