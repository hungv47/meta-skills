---
type: model
schema_version: 1
last_verified: 2026-06-21
verifier: hungv47
source_basis: standard marketing-economics (diminishing-returns / saturation-curve) literature + paid-channel operating norms; channel knee defaults are [pattern-derived] operating priors, not account measurements
---

# Marginal-Return Model

The curve model the allocator reads to translate sourced CAC + current spend + saturation signal into a *next-dollar* (marginal) CAC per channel, and to know each channel's min-viable floor. Cite this file; do not re-derive the curve in the agent prose.

All channel-knee and floor defaults below are **operating priors** — `[pattern-derived]`, not measurements of any account. Real measured saturation signal (from `measure-results`) overrides a default whenever it exists.

---

## 1. Why marginal, not average

- **Average CAC** = total spend ÷ total customers. Backward-looking; tells you what the channel *did* cost on average.
- **Marginal CAC** = the cost of the *next* customer at the current spend level. It is the only number that answers "should the next dollar go here?"

On a diminishing-returns curve, marginal CAC ≥ average CAC, and the gap widens as you climb past the saturation knee. A channel cheap on average but past its knee has an expensive marginal CAC — the next dollar there is wasteful even though the channel "looks cheap." **Allocate on marginal CAC.**

---

## 2. The saturation curve

Each paid channel converts spend → customers along an S-then-concave curve with three regions:

| Region | Marginal CAC behavior | Allocation implication |
|---|---|---|
| **Below the knee** (under-funded) | Marginal CAC near or below average; still buying efficiently | A channel here with cheap marginal CAC absorbs more budget |
| **At the knee** (efficient frontier) | Marginal CAC ≈ the channel's steady-state CAC | Hold near here — the efficient operating point |
| **Past the knee** (saturated) | Marginal CAC rising steeply above average | Throttle — the next dollar is the most expensive dollar in the plan |

The **knee** is the spend level where marginal CAC starts rising materially above average. Past it, doubling spend more-than-doubles CAC.

---

## 3. Estimating marginal CAC without a full curve

You rarely have a fitted curve. Estimate marginal CAC from three inputs:

1. **Average CAC** (sourced).
2. **Current spend vs the channel's typical knee** (where on the curve the channel sits).
3. **A saturation signal** if available (rising CAC over recent windows, falling delivery/impression share, frequency creep on retargeting).

Heuristic bands (use when no fitted curve exists):

| Position (from signal or current-spend-vs-knee) | Marginal CAC estimate |
|---|---|
| Clearly below the knee, signal flat/improving | marginal ≈ average × 1.0–1.1 |
| At the knee, signal stable | marginal ≈ average × 1.2–1.4 |
| Past the knee, signal worsening (CAC rising / delivery falling) | marginal ≈ average × 1.6–2.5+ |

State which band you used and the signal that placed the channel there. These multipliers are `[pattern-derived]` priors — when `measure-results` shows the actual CAC-vs-spend trend, fit to that instead.

---

## 4. The allocation step (equalize marginal return)

For a fixed budget across allocation-lane channels:

1. Start each channel at its min-viable floor (a channel that can't clear its floor is floor-or-zero).
2. Allocate the next dollar to the channel with the **lowest current marginal CAC**.
3. As a channel absorbs budget, recompute its marginal CAC (it rises along the curve).
4. Stop when the budget is exhausted OR every active channel's marginal CAC has converged (equal-marginal-return optimum).
5. Apply the concentration cap and §0 vetoes (constraint-checker bounds these).

The optimum: **the marginal return of the last dollar is equal across channels**, subject to floors, the concentration cap, and vetoes.

---

## 5. Min-viable monthly floors (defaults)

Below its floor a channel cannot exit the learning phase, so its CAC data is noise — allocate the floor or allocate zero, never a sub-floor sliver. Defaults (operator may override upward):

| Channel type | Min-viable monthly floor (`[pattern-derived]` prior) | Reason |
|---|---|---|
| Meta / TikTok paid social | ~$1,500/mo | learning-phase conversion volume (≈50 optimization events/week needs material spend) |
| Google Search | ~$1,000/mo | enough auction entries to read intent-tier CPCs |
| LinkedIn Ads | ~$2,000/mo | high floor CPCs — below this, sample size is too small to read |
| Newsletter (sponsored placements) | ~$500/mo or one placement | a single placement is the atomic unit; below it there's no test |
| Owned/organic (no paid floor) | n/a | not a paid-spend lane; excluded from this skill's allocation |

These are priors. A channel where `measure-results` shows a stable CAC at lower spend can have its floor lowered with that evidence cited.

---

## 6. LTV and the LTV:CAC guardrail

LTV (or a payback ceiling) bounds how high a marginal CAC may rise before a channel's next dollar is unprofitable:

- **LTV:CAC ≥ 3:1** is the common healthy-unit-economics target; **a marginal CAC that pushes LTV:CAC below ~1:1 means the next dollar loses money** — stop funding there regardless of the channel's average.
- For a **payback-period** objective, use the payback ceiling instead: a marginal CAC whose payback exceeds the operator's tolerance (e.g. >12 months) caps that channel.
- For a **retention** objective, the "return" is retained-revenue lift, not new-logo LTV — compute marginal return on the retained-revenue curve.

Never inflate LTV to justify a channel — LTV is a sourced input (pricing × margin × retention from `research-icp`/`product-context`), not a free parameter.

---

## 7. What this model does NOT do

- It does not select channels (that's `plan-campaign`).
- It does not set numeric funnel/conversion targets (that's `plan-funnel`).
- It does not move money (this skill never spends).
- It does not invent a CAC — an unsourced channel is a hypothesis lane, not a curve.

## Ownership

This model owns the curve, the marginal-CAC estimation bands, the min-viable floors, and the LTV:CAC guardrail. It versions with the plan-budget skill (no standalone version field). Defaults are revised via the rubric's mandatory-revision trigger #1 (planned vs measured marginal CAC drift).
