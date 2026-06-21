# Playbook — Design Lifecycle

[PLAYBOOK] — why this skill exists, its philosophy, scope boundary, and what it pulls from elsewhere. Loaded on demand, not on every invocation.

## Why this skill exists

FORSVN's stack was front-loaded on acquisition (launch, ads, social, SEO) and near-empty on **retention** — the moat's back half. Acquisition gets a user in the door; lifecycle gets them to the value moment and keeps them. A founder with a real list and a real product, but a flat activation curve, has no skill that designs the trigger→message→timing→branch automation that turns signups into activated users. `write-copy` writes a great welcome email; it does not design the *flow* — the suppression rules, the branch on observed behavior, the activation-lift measurement — that makes a sequence work instead of spam.

This skill is the retention counterpart to `plan-campaign` (acquisition planning) and `write-ad` (acquisition creative). It owns the **lifecycle automation design discipline**.

## Philosophy

1. **Activation is the only goal.** Every lifecycle flow chases one named, measurable activation metric. Opens and clicks are diagnostics that tell you *where* a flow breaks; they are never the objective. A flow with great open rates and no activation lift is a failure.
2. **Suppression is the discipline.** The line between a flow and spam is the exit condition: the moment a user does the thing, they stop hearing about it. Every step declares when the user leaves the flow. A flow without exits is spam by construction.
3. **Trigger on behavior the product can observe.** Branches and steps fire on real product events (created a project, invited a teammate, went dormant) — never on a guessed persona trait the system can't see.
4. **Timing tracks the window, not the calendar.** A flow lives inside the window where its activation actually happens. Sends after the window are nags.
5. **Prove it with a control.** Activation rises for many reasons; only a holdout isolates the flow's contribution. No control → a directional claim, honestly labeled — never a causal one.
6. **Design, never send.** This skill produces the flow map, the copy, and the measurement plan. It never connects to an ESP, never sends mail, never touches a consented list. Publishing is human-owned and out of scope.

## Scope boundary — when NOT to use

| Situation | Use instead |
|-----------|-------------|
| One-off broadcast / newsletter issue | `write-copy` (or `write-social` for the post) |
| Cold outbound to people who never opted in | `write-outreach` |
| Organic social post | `write-social` |
| Paid-ad creative | `write-ad` |
| The newsletter *channel* strategy (own-send + sponsored placement) | the `newsletter` launch-channel pack via `plan-campaign` |
| No measurable activation event exists yet | `research-icp` / product-context first — define the value moment, then return |

## What it pulls from elsewhere

- **`research/product-context.md`** — the product's value moment / "aha" → the activation metric anchor.
- **`research/icp-research.md`** — churn drivers + the job the user hired the product for → flow framing + the winback/churn-save angle.
- **`brand/BRAND.md`** — voice anchors + banned language → the copy agent's voice check.
- **`docs/forsvn/artifacts/marketing/campaign-plan.md`** — Route B: when plan-campaign selects the Mailbox channel, it calls this skill to design the actual flow.

## What consumes it

- **`measure-results`** — reads the flow's activation-lift result (per the measurement plan) to close the loop.
- **`evaluate-content`** — can score the per-step copy in isolation.

## Hard guardrails

- **No autonomous send.** The skill never connects an ESP, never sends mail, never imports a list. It outputs a design a human implements.
- **Consent + PII.** The flow targets an owned, consented list; it never assumes a bought list, never bypasses unsubscribe, never stores PII it shouldn't. Hard gate, not a critic dim.
- **No skill count** stated anywhere user/agent-facing.
- **No gradient/glow** in any rendered example.

## History

- v1.0.0 — initial build (WS-K K5, retention discipline). Built to the premium bar via path (b) of the G-discipline gate: ships with a worked example (`references/examples/lifecycle-walkthrough.md`) that clears the 6-dimension critic.
