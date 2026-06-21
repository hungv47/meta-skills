# Anti-Patterns — Design Referral

[ANTI-PATTERN] — failure modes the orchestrator + critic guard against. Re-read before any loop ships. Each is falsifiable with a detection rule.

---

## 1. Asserted K without math

**Symptom:** "This loop will go viral (K≈1.2)" with no i × c decomposition.
**Why it fails:** K is a product of two measurable levers. An asserted K hides which lever is weak and is almost always optimistic.
**Detection:** The K-Factor Math section lacks a separate `i` and `c` with labeled bases.
**Owned by:** loop-architect + critic (hard gate — automatic FAIL).

---

## 2. Ignoring cycle time

**Symptom:** A high K celebrated on a 60-day cycle.
**Why it fails:** Compounding scales with K AND 1/cycle-time. A slow cycle barely compounds even at high K.
**Detection:** No cycle time stated, or a viral claim made without the K × cycle contrast.
**Owned by:** loop-architect + critic (Cycle-time dim).

---

## 3. Incentive costs more than CAC

**Symptom:** CPAU ≥ the paid CAC the loop displaces.
**Why it fails:** The loop is a more expensive acquisition channel than paid — a loss wearing a growth-hack costume.
**Detection:** CPAU (computed) ≥ cac_to_beat.
**Owned by:** incentive-economist + critic (hard gate — automatic FAIL).

---

## 4. Trigger on signup, not value

**Symptom:** The referral ask fires at signup, before the user got value.
**Why it fails:** A user who hasn't seen value won't credibly recommend — conversion-per-invite (c) collapses.
**Detection:** The share trigger has no value-realized precondition (a named activation/aha event).
**Owned by:** loop-architect + mechanic-copy + critic (Trigger dim).

---

## 5. Referral on a leaky product

**Symptom:** A referral loop on a product users churn from.
**Why it fails:** Referral amplifies whatever the product does. On a leaky product it spreads churn faster and burns goodwill.
**Detection:** No retention evidence in the brief; the loop ships anyway.
**Owned by:** loop-architect + critic (hard gate — retention precondition, automatic FAIL).

---

## 6. Fraud-blind incentive

**Symptom:** Reward pays on signup with no named abuse vector or guard.
**Why it fails:** Self-referral, fake accounts, and incentive farming drain the budget and produce zero real users.
**Detection:** No abuse vector named, or reward fires on click/signup rather than a qualified action.
**Owned by:** incentive-economist + critic (Fraud/abuse dim).

---

## 7. Fake scarcity

**Symptom:** "Only 3 invites left!" when there's no real limit.
**Why it fails:** Manufactured urgency erodes trust; users notice and the loop's word-of-mouth turns negative.
**Detection:** A scarcity claim in the mechanic copy with no real underlying constraint.
**Owned by:** mechanic-copy + critic (Mechanic dim).

---

## 8. Double-sided reflex

**Symptom:** Two rewards per conversion when only one side needed the nudge.
**Why it fails:** Doubles CPAU for no incremental conversion — burns margin.
**Detection:** A double-sided reward with no evidence both sides need motivating (e.g. users already love the product → referrer needs no cash).
**Owned by:** incentive-economist + critic (Incentive economics dim).

---

## 9. Autonomous payout (scope violation)

**Symptom:** The output instructs disbursing a reward / moving money / connecting a payout system.
**Why it fails:** Payout is human-owned + out of scope; spend/irreversible actions hard-stop for a human and are not config-toggleable.
**Detection:** Any instruction to pay, disburse, or move money.
**Owned by:** critic (hard gate — automatic FAIL).
