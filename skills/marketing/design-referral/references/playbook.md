# Playbook — Design Referral

[PLAYBOOK] — why this skill exists, philosophy, scope boundary, what it pulls from elsewhere. Loaded on demand.

## Why this skill exists

Referral is the other half of the moat's back half (with retention). A founder with retention/PMF leaves the cheapest acquisition channel on the table if they have no disciplined way to design a referral loop. The base-model answer to "add a referral program" is "give $10 for each friend" — which routinely loses money (the incentive costs more than the CAC it replaces), fires the ask at the wrong moment (signup, before value), and reports "it went viral" with no K-factor decomposition. This skill owns the **viral/referral loop design discipline**: real loop math, CAC-bounded incentive economics, a value-triggered ask, and a falsifiable mechanic.

It is the referral counterpart to `design-lifecycle` (retention). Together they cover the retention+referral disciplines the stack was missing.

## Philosophy

1. **Compute K, never assert it.** K = invites-per-active-user × conversion-per-invite. The whole craft is knowing which lever a change pulls. An asserted "this'll go viral" is the tell of a loop that won't.
2. **Cycle time is the second multiplier.** Compounding needs K *and* a short cycle. A collaborative-native loop (the share is the product action) wins on both; an incentivized "tell a friend" loop is slower and lower-i.
3. **The incentive must beat the CAC it replaces.** A referral loop is an acquisition channel. If the all-in incentive cost per acquired user exceeds paid CAC, it's a worse channel. Credit/free-time beats cash on margin.
4. **Trigger after value.** The ask fires the moment the user got what they came for. Before that, c collapses.
5. **Guard the abuse vector.** Self-referral, fake accounts, incentive farming — name the vector and the guard. Reward on the qualified action, not the click.
6. **Design, never disburse.** The skill outputs a loop design. It never moves money, never pays a reward — payout is human-owned and out of scope.

## Scope boundary — when NOT to use

| Situation | Use instead |
|-----------|-------------|
| Paid-ad creative | `write-ad` |
| Channel-mix / which channels to use | `plan-campaign` |
| Lifecycle email flows (onboarding/winback) | `design-lifecycle` |
| Affiliate / partnership / influencer outreach | `write-outreach` |
| Product has no retention (users churn) | fix retention first — a referral loop spreads churn |

## What it pulls from elsewhere

- **`research/product-context.md`** — the value moment (the share trigger) + unit economics (LTV, margin) the incentive must fit.
- **`research/icp-research.md`** — who the user would refer and the social context (does this product get talked about?).
- **`design-lifecycle` artifacts** — the activation event the referral trigger fires after.
- **`.forsvn/performance/*.tsv`** — measured CAC the incentive must beat.

## What consumes it

- **`measure-results`** — reads the loop's measured K + payback to close the loop.
- **`plan-campaign`** — referral as a selected channel in the GTM.

## Hard guardrails

- **No autonomous payout.** Never disburses a reward or moves money.
- **Retention precondition.** Refuses to design a loop on a product with no retention evidence.
- **No fake scarcity.** Manufactured limits are banned.
- **No skill count** stated. **No gradient/glow** in any example.

## History

- v1.0.0 — initial build (WS-K K5, referral discipline). Built to the premium bar via path (b) of G-discipline: ships with a worked example (`references/examples/referral-walkthrough.md`) carrying real K-factor + payback math that clears the 6-dimension critic.
