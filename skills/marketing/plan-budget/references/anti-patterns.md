---
type: anti-patterns
schema_version: 1
last_verified: 2026-06-21
verifier: hungv47
---

# Anti-Patterns — Plan-Budget

Failure modes the orchestrator, constraint-checker, and critic guard against. Each row carries a **falsifiable detection rule** a critic can mechanically apply. Re-read before any allocation ships.

[ANTI-PATTERN] — load at allocator dispatch, constraint-check, and critic.

---

## Section 1 — Allocation Anti-Patterns

### 1. Even split without reason

**Symptom:** "$1,500 each across 4 channels." Equal dollars, no marginal-return justification.

**Why it fails:** Equal spend ignores that channels have different marginal CACs and different saturation positions. The cheapest-marginal channel is starved; the saturated one is over-fed. It is the single most common allocation failure and the laziest.

**Detection rule:** allocations within ±5% of equal across all channels AND fewer than one marginal-return sentence per channel → FAIL (Marginal-return soundness auto-fail).

**Owned by:** allocator (marginal-return reasoning) + critic (Marginal-return soundness).

---

### 2. Sunk-cost doubling-down

**Symptom:** "We've already spent $10K on channel X, we can't pull back now." Past spend justifies future spend.

**Why it fails:** Sunk cost is irrelevant to the next dollar's marginal return. A channel's history does not change where the *next* dollar earns most. Doubling down on a saturated channel because of prior investment burns budget.

**Detection rule:** any channel's allocation justified by prior/cumulative spend rather than its forward marginal CAC → FAIL.

**Owned by:** allocator (allocate forward) + critic (Marginal-return soundness).

---

### 3. Average CAC instead of marginal

**Symptom:** Budget poured into the channel with the lowest *average* CAC, ignoring that it's past its saturation knee.

**Why it fails:** Average CAC is backward-looking. A channel cheap on average but saturated has an expensive marginal CAC — the next dollar there is wasteful. Allocating on average systematically over-funds saturated channels.

**Detection rule:** the highest-allocated channel is the lowest-average-CAC channel AND its curve position is "past the knee" with no marginal recomputation → FAIL (Diminishing-returns auto-fail).

**Owned by:** allocator (marginal computation) + critic (Marginal-return soundness + Diminishing-returns respect).

---

### 4. Over-concentration

**Symptom:** One channel holds 70-90% of the budget because it has the best marginal CAC right now.

**Why it fails:** Best marginal return does not exempt concentration risk. One channel's policy change, account suspension, or sudden saturation can zero the whole program. Best-CAC-today is not a hedge against single-channel failure.

**Detection rule:** top channel > the concentration cap (default 50%) with no operator-set higher cap and no override reason → REVISION_REQUIRED → if shipped, FAIL (Concentration balance).

**Owned by:** constraint-checker (concentration cap) + critic (Concentration balance).

---

### 5. Ignoring channel saturation

**Symptom:** A channel showing rising CAC / falling delivery over recent windows gets *more* budget.

**Why it fails:** A worsening saturation signal means the channel is past its knee — its marginal CAC is climbing. Adding budget accelerates the waste. The signal was visible in `measure-results` and ignored.

**Detection rule:** a channel with a documented worsening saturation signal (rising CAC trend or falling impression share in the performance store) receives a higher allocation than its prior cycle → FAIL.

**Owned by:** allocator (saturation read) + critic (Diminishing-returns respect).

---

### 6. Sub-floor slivers

**Symptom:** A $200 allocation on a channel whose min-viable floor is $1,000.

**Why it fails:** Below its floor a channel can't exit the learning phase — the spend buys noise, not a readable CAC. A sliver is worse than zero: it consumes budget and produces uninterpretable data.

**Detection rule:** any non-zero allocation below the channel's min-viable floor (per `marginal-return-model.md` §5 or an operator override) → REVISION_REQUIRED → if shipped, FAIL (Floor + veto compliance auto-fail).

**Owned by:** allocator (floor-or-zero) + constraint-checker (floor backstop) + critic (Floor + veto compliance).

---

### 7. Allocating into a §0-veto channel

**Symptom:** Budget funds a channel whose `plan-campaign` launch-channel pack §0 "When NOT to Launch Here" veto fires for this ICP/stage (e.g. newsletter with no list and no sponsored-placement budget) with no override reason.

**Why it fails:** The §0 veto is the channel-fit gate. Funding a channel that fails its own fit veto spends into a structurally wrong channel; the CAC will be bad for a reason the veto already named.

**Detection rule:** a funded channel whose loaded §0 veto fires for the declared ICP/stage AND no explicit override + reason is recorded → HARD_STOP (human decides) → if shipped without the override, FAIL.

**Owned by:** constraint-checker (§0 veto HARD_STOP) + critic (Floor + veto compliance).

---

## Section 2 — Input-Integrity Anti-Patterns

### 8. Fabricated CAC

**Symptom:** A channel gets a number-backed allocation on a CAC that was invented because "it seemed reasonable" — no measure-results row, no operator number, no cited benchmark.

**Why it fails:** This is the Gate-1 hard ban. A fabricated CAC produces an allocation that looks rigorous but is fiction; the operator spends real money on a made-up number. The whole skill's value is *honest* allocation.

**Detection rule:** any allocation-lane channel whose CAC source label is `unsourced` (or absent) → FAIL (Input integrity auto-fail). The fix is a hypothesis lane or dropping the channel — never a number.

**Owned by:** allocator (sourcing ledger) + critic (Input integrity).

---

### 9. Stale CAC shipped silently

**Symptom:** A CAC from a measure-results snapshot >90 days old is used in the math as if current, with no staleness flag.

**Why it fails:** Channel CACs drift as auctions, creative, and audiences change. A 4-month-old CAC may be off by a multiple. Using it silently grounds the whole allocation in stale economics.

**Detection rule:** a CAC whose source snapshot's measurement window ends >90 days before the run date, used with no staleness flag in the Sourcing Ledger → FAIL (Input integrity auto-fail).

**Owned by:** allocator (staleness flag) + critic (Input integrity).

---

### 10. Unsourced external benchmark dressed as own data

**Symptom:** An industry-average CAC from a blog post is entered as if it were the operator's measured CAC, with no "benchmark, not yours" caveat.

**Why it fails:** External benchmarks are priors, not your account's reality. Treating a benchmark as own data hides the uncertainty and over-weights a channel the account has never actually run.

**Detection rule:** a CAC whose source is an external benchmark but is presented in the Sourcing Ledger without the `external-benchmark` label and a caveat → drop to Input integrity ≤6 (caveat present) or FAIL (presented as own data).

**Owned by:** allocator (source labeling) + critic (Input integrity).

---

### 11. LTV inflated to justify a channel

**Symptom:** LTV is bumped up (longer retention assumption, higher margin) specifically to make a channel's LTV:CAC clear the 3:1 bar.

**Why it fails:** LTV is a sourced input (pricing × margin × retention from research-icp/product-context), not a free parameter. Inflating it to rescue a channel is reverse-engineering the answer.

**Detection rule:** an LTV value used for one channel that exceeds the sourced product-level LTV with no per-channel justification (e.g. a genuinely higher-value cohort) → FAIL (Input integrity).

**Owned by:** allocator (LTV sourcing) + critic (Input integrity + Objective fit).

---

## Section 3 — Process Anti-Patterns

### 12. No reallocation trigger

**Symptom:** A static allocation table with no rule for when to shift budget — "spend this and see."

**Why it fails:** Allocations are predictions; measured CAC will diverge from planned. Without a falsifiable trigger (a CAC threshold + a window + where freed budget goes), the plan can't respond to reality and goes stale the first time a channel's CAC breaches plan.

**Detection rule:** zero falsifiable reallocation triggers in the artifact (no measured-CAC threshold + window per channel) → FAIL (Reallocation triggers auto-fail).

**Owned by:** allocator (triggers) + critic (Reallocation triggers).

---

### 13. Objective-mismatch allocation

**Symptom:** Pure-acquisition channels funded against a stated retention objective (or vice versa), with no flag; or a `mixed` objective allocated across the merged channel set with no acquisition/retention pool split.

**Why it fails:** The marginal-return basis differs by objective (new-logo CAC vs retained-revenue lift). Allocating against the objective optimizes the wrong return and the operator gets a plan that doesn't serve their goal.

**Detection rule:** a channel weighted opposite to the stated objective with no flag, OR `objective: mixed` with no pool split before equalization → FAIL (Objective fit auto-fail).

**Owned by:** allocator (objective weighting) + critic (Objective fit).

---

### 14. Collapsing into plan-campaign

**Symptom:** The output is a channel-selection table ("use Meta + Google + newsletter") with no dollar allocation, no marginal-return math, no CAC — i.e. it re-did `plan-campaign`'s job.

**Why it fails:** plan-budget exists to allocate *dollars* across *already-selected* channels with CAC/LTV math. If it collapses into "which channels," it duplicates plan-campaign and adds nothing — the exact reason the premium bar would reject it.

**Detection rule:** the artifact selects or deselects channels but contains no per-channel dollar allocation with a marginal CAC → BLOCKED/redirect to plan-campaign (this isn't a plan-budget output at all).

**Owned by:** orchestrator (scope boundary) + critic (the whole rubric is moot without an allocation).

---

## Cross-skill ownership note

Patterns #8-9 (input integrity) mirror the stack-wide anti-fabrication rule (`research-icp` VoC gate, `write-ad` substantiation floor): a number used in a deliverable must trace to a real source. Pattern #14 mirrors `plan-campaign`'s own "don't collapse into a sibling" guard (campaign-plan ↛ plan-funnel) — same rationale: a skill that duplicates a sibling fails the premium bar.
