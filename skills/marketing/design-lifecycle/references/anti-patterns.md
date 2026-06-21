# Anti-Patterns — Design Lifecycle

[ANTI-PATTERN] — failure modes the orchestrator + critic guard against. Re-read before any flow ships. Each is falsifiable with a detection rule.

---

## 1. Time-only spray

**Symptom:** Every step fires on elapsed time with no product-event gate and no suppression.
**Why it fails:** The user who activated on day 1 still receives the day-5 "still stuck?" nag. The flow can't tell who already did the thing.
**Detection:** Any step whose Trigger is purely time-based AND whose Suppression cell does not include the activation event.
**Owned by:** flow-architect (suppression cell required) + critic (Trigger/Suppression dim).

---

## 2. No exit condition

**Symptom:** No step has a suppression cell that removes an activated/converted user.
**Why it fails:** Spam by construction — the flow keeps sending after the goal is met. Erodes deliverability and trust.
**Detection:** The four standing exits (activated / converted / unsubscribed / frequency-cap) are not all present in the Exit Summary.
**Owned by:** flow-architect + critic (hard gate — automatic FAIL).

---

## 3. Vanity-metric anchor

**Symptom:** The flow's success is defined as opens or clicks, not activation.
**Why it fails:** A flow with 60% opens and zero activation lift is a failure dressed as a win. Opens are a diagnostic, not the goal.
**Detection:** The Primary Metric is an engagement metric, not activation lift over a control.
**Owned by:** measurement + critic (Measurability dim).

---

## 4. Every-step-same-CTA

**Symptom:** Five steps all ending "Upgrade now" (or all "Invite a teammate").
**Why it fails:** The CTA must track the user's place in the activation journey; a fixed CTA ignores where they are.
**Detection:** ≥2 steps share the identical CTA without a behavioral reason.
**Owned by:** copy + critic (Per-step copy dim).

---

## 5. Winback-as-discount-reflex

**Symptom:** The dormant-user flow opens with a coupon.
**Why it fails:** Teaches users to lapse for discounts and erodes price integrity. The value moment, not the discount, is what reactivates a *lapsed* (not churned) user.
**Detection:** Step-1 CTA of a winback or churn-save flow is a discount/coupon.
**Owned by:** copy + flow-architect + critic.

---

## 6. Onboarding longer than the activation window

**Symptom:** A 21-day onboarding flow when activation empirically happens within 5 days.
**Why it fails:** Sends after the window are nags to users who either already activated (suppression should have caught them) or never will (the window closed).
**Detection:** Flow length > the stated activation window.
**Owned by:** flow-architect + critic (Timing dim).

---

## 7. Branching on guessed traits

**Symptom:** A branch splits on "is a power user" / "is price-sensitive" — traits the product can't observe.
**Why it fails:** The branch can't actually fire; it's wishful segmentation, not a flow.
**Detection:** A branch condition references a trait absent from the product's event inventory.
**Owned by:** flow-architect + critic (Branch dim).

---

## 8. Pre/post presented as causal lift

**Symptom:** "Activation rose 8 points after we launched the flow" with no holdout.
**Why it fails:** Activation rises for many reasons (product changes, seasonality, cohort mix). Without a control, the flow's contribution is unknown.
**Detection:** A causal lift claim with no holdout design AND no "directional only" label.
**Owned by:** measurement + critic (Measurability dim).

---

## 9. Autonomous send (scope violation)

**Symptom:** The output instructs connecting an ESP / importing a list / scheduling a real send.
**Why it fails:** This skill is a *design*. Sending is human-owned + out of scope; consent and publish gates are not config-toggleable.
**Detection:** Any instruction to send, connect a vendor, or import a list.
**Owned by:** critic (hard gate — automatic FAIL).
