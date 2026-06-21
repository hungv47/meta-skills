# Flow Patterns — Design Lifecycle

[PLAYBOOK] — the per-flow-type pattern library the flow-architect draws on. Each pattern is a SPINE, not a template — the architect adapts it to the product's real events and activation window.

## The shared spine rule

Every flow, regardless of type, obeys: **entry trigger → N event-gated steps inside the window → exits at every step**. The differences below are the *intent* of each step, not a change to that contract.

---

## 1. Onboarding (signup → activation)

**Entry:** signup / first login. **Job:** reach the activation metric. **Window:** the empirical activation window (the time by which most users who ever activate have activated — typically 7–14 days; measure, don't guess).

| Step intent | Typical trigger | Fires only if |
|-------------|-----------------|---------------|
| Welcome + the ONE next action | signup + 0–1h | always (entry) |
| Value-moment nudge | created account but not the activation event, +24–48h | not yet activated |
| Friction removal | started the activation path, didn't finish, +behavior | stalled mid-path |
| Social / teammate pull (if multi-player) | core action done, +1–2d | activation event still open |
| Last-chance + human-touch offer | end of window, not activated | not activated, not unsubscribed |

**Suppression:** activated (the headline exit) · converted to paid · unsubscribed · frequency cap. The activation exit is the most important — the day-5 "still stuck?" must NOT reach a user who activated on day 1.

**Falsifiable anti-pattern:** any step that can fire after the activation event. Detection: scan each step's "fires only if" against the activation exit.

---

## 2. Activation (stalled before the "aha")

**Entry:** signed up but stalled at a known threshold before the value moment. **Job:** cross that specific threshold. **Window:** short — a stalled user cools fast.

| Step intent | Typical trigger |
|-------------|-----------------|
| Diagnose the stall point (name it) | stalled at X for +Nh |
| Targeted unblock (the 1 thing) | still stalled at X |
| Alternative path to the same value | unblock didn't land |
| Human-touch offer (call / concierge) | still stalled at window end |

**Suppression:** crossed the threshold · churned · unsubscribed. **Anti-pattern:** generic re-onboarding instead of unblocking the *specific* stall — wastes the diagnostic the activation flow exists for.

---

## 3. Winback (dormant → reactivate)

**Entry:** dormant N days past the user's *normal* usage cadence (cadence-relative, not a fixed calendar). **Job:** reactivate a lapsed — not churned — user. **Window:** 2–3 touches, then stop; a 6-email winback to a dead address hurts deliverability.

| Step intent | Typical trigger |
|-------------|-----------------|
| "We noticed" + the value moment they're missing | dormant N days |
| What's new since they left (specific) | no return after step 1 |
| Re-onboard the value moment / final pulse | no return after step 2 |

**Suppression:** returned (used the product) · unsubscribed · marked dead. **Falsifiable anti-pattern:** leading with a discount. Detection: step-1 CTA is a coupon → flag. Discount-led winback teaches users to lapse for discounts and erodes price integrity. A discount, if used at all, comes last, not first.

---

## 4. Churn-save (cancel/downgrade → reverse or soften)

**Entry:** cancellation or downgrade event. **Job:** reverse or soften the cancel. **Window:** immediate — the save window closes fast after the decision.

| Step intent | Typical trigger |
|-------------|-----------------|
| Acknowledge + the no-guilt exit door | cancel/downgrade fired |
| Surface the specific unrealized value OR the specific friction | acknowledged, not re-engaged |
| Targeted save offer — **downgrade before discount** | still leaving |
| Graceful exit + win-back seed | left anyway |

**Suppression:** reversed the cancel · completed the leave · unsubscribed. **Anti-pattern:** the reflexive discount as step 1. Order of save offers: pause/downgrade plan → resolve the specific friction → (only then) discount. Guilt-tripping ("are you sure you want to lose all this?") confirms the cancel; never use it.

---

## Cross-pattern rules

- **One activation metric per flow.** Don't bolt a winback onto an onboarding flow.
- **Exits before sends.** Enumerate the four standing exits first, then add steps.
- **Cadence-relative dormancy** for winback — a daily-active user dormant 7 days is lapsing; a monthly user at 7 days is fine.
- **Downgrade beats discount** in churn-save — a downgraded user is retained; a discounted user is a margin loss who often still churns.
