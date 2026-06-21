# Copy Rules — Design Lifecycle

[PROCEDURE] — the per-step copy contract the copy agent enforces. Loaded at Layer-2 copy dispatch.

## The four non-negotiables

1. **One CTA per step.** A step asks for exactly one action. Two asks split attention and measurably lower the step's activation contribution. Need two asks → split into two steps or flag to the architect.
2. **Value before ask.** Every message delivers something — a shortcut, proof, a removed obstacle, a relevant tip — BEFORE it asks for the activation action. "Just checking in" with no payload is banned.
3. **Reference the trigger.** A behavior-triggered step names the behavior: "You created a project — here's how to share it in 10 seconds." A generic blast wastes the trigger.
4. **Brand voice, not generic SaaS-cheerful.** Pull anchors from BRAND.md. Default exclamation-point cheeriness reads as a form letter and, in churn-save, confirms the cancel.

## Subject / preview discipline (email)

- Subject earns the open by promising the value, not the brand. "Your first shared project is 10 seconds away" beats "Getting started with [Product]".
- Preview text continues the subject; never let it default to "View in browser".
- No false urgency ("LAST CHANCE" when it isn't), no clickbait the body doesn't pay off.

## CTA mapping by flow position

| Position | CTA points at |
|----------|---------------|
| Onboarding early | the next micro-step toward activation |
| Onboarding late | the activation action directly |
| Activation | the specific unblock |
| Winback | the value moment (NOT a discount) |
| Churn-save | the smallest viable save (downgrade > discount) |

## Banned copy moves

- **Value-free check-in** — "Just following up!" / "Still there?" with no payload.
- **Multi-CTA** — two competing buttons in one step.
- **Discount reflex** — opening winback or churn-save with a coupon.
- **Guilt** — "Are you sure you want to lose everything?" in churn-save.
- **Generic-cheerful** — ignoring BRAND.md voice anchors.
- **Vanity subject** — optimizing the subject for opens at the cost of setting up a value the body doesn't deliver.

## Voice-trace requirement

Each step's copy must trace to ≥1 brand voice anchor (named in the Voice Check section). If BRAND.md is absent, the copy agent uses product-context tone notes and flags the run `DONE_WITH_CONCERNS` for thin voice grounding — it never invents a voice.
