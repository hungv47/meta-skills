# Loop Models — Design Referral

[PLAYBOOK] — the loop-type library + the K-factor and cycle-time math the loop-architect draws on. Each model is a structure, not a template.

## The growth math (the spine)

**K-factor:** `K = i × c`
- `i` = invites sent per active user (over the loop's relevant window)
- `c` = conversion rate per invite (invite → activated new user)

**Interpretation:**
- **K ≥ 1** — each user brings ≥1 new user who repeats: self-sustaining virality. Rare; usually only collaborative-native loops hit it.
- **0.3 ≤ K < 1** — a real growth assist. Not self-sustaining alone, but it meaningfully lowers blended CAC: a fraction of every cohort is free.
- **0.15 ≤ K < 0.3** — marginal. Worth it only if the incentive is cheap (credit) and the cycle is fast.
- **K < 0.15 with a costly incentive** — kill candidate. The reward spend isn't buying enough invites/conversions.

**Cycle time** `T` = time for one full loop (a new user reaching their own value moment and inviting). Compounding scales with K *and* `1/T`. Always state both — a K of 0.5 at T=3 days compounds far faster than K=0.7 at T=60 days.

**Amplification (intuition, not a forecast):** for K<1, the loop multiplies a seed cohort by roughly `1/(1−K)` over many cycles — K=0.5 ≈ 2x the seeded users eventually; K=0.3 ≈ 1.43x. Use this to size the assist, never as a promise; real loops decay (saturation, list fatigue).

---

## Model 1 — Collaborative-native (reach for this first)

**Mechanic:** using the product *requires* pulling someone in — a shared doc, a multiplayer board, a split bill, a standup teammates read. The invite IS the core action.

**Why it's the strongest:** `i` is high by construction (the user can't get full value alone), `T` is near-instant (the invite happens in the value flow), and the incentive can be **zero** — the value is the incentive. Dropbox-folder-share, Calendly-booking-link, Figma-multiplayer, Splitwise.

**When:** any product where value is multiplayer. If yours is, design this loop before considering a paid incentive.

**Falsifiable mechanic:** "X% of users who reach <core action> invite ≥1 collaborator; Y% of collaborators activate."

---

## Model 2 — Double-sided incentive (the classic)

**Mechanic:** both referrer and referee get a reward (Dropbox: both get space; PayPal: both get cash). Symmetric, fair-feeling, drives both i (referrer motivated) and c (referee arrives with a gift).

**Cost:** two rewards per conversion. Justified only when both sides genuinely need the nudge AND margin supports it. Prefer product-denominated rewards (credit, free time) over cash.

**When:** single-player product, healthy margin, the audience values the reward.

---

## Model 3 — One-sided incentive

**Mechanic:** only one side is rewarded — referrer-only (drives i) or referee-only (drives c). Half the cost of double-sided.

**When:** tight margin, or when only one lever is weak (e.g. users already love the product so referrers don't need paying — reward only the referee to raise c).

---

## Model 4 — Milestone / tiered

**Mechanic:** rewards unlock at N successful referrals (refer 3 → a month free; refer 10 → swag). Concentrates spend on power-referrers and gamifies.

**Cost:** back-loaded — you pay only for high performers. Risk: most users never hit the first tier, so i from the median user is low. Pair with a small first-tier to seed motion.

**When:** you have an enthusiastic power-user segment and want to amplify them specifically.

---

## Mechanic copy (raises i and c)

- **Share prompt (i):** fires at the value moment, names the realized value + the easy share + the reward. NOT a persistent "Invite friends!" banner.
- **Invite message (i→c):** framed as the friend's recommendation, pre-filled but editable, states the referee reward.
- **Referee landing (c):** continuous with the invite — confirms the value + the reward immediately. A cold generic landing leaks c.

## Falsifiable-mechanic requirement

Every loop ships ONE testable statement of its i and c (e.g. "30% of activated users send ≥1 invite; 20% of invites activate → K=0.06" — and if that's the honest estimate, the loop is a kill candidate and the design says so). This is what `measure-results` tests against reality.
