# Incentive Economics — Design Referral

[PROCEDURE] — the CPAU + payback contract the incentive-economist enforces. Loaded at Layer-2 economics dispatch.

## The core inequality

A referral loop is acquisition. It is worth running only if:

```
CPAU < CAC_displaced   AND   CPAU < margin contribution it buys
```

- **CPAU (cost per acquired user)** = total incentive cost to acquire one new activated user, including both sides of a double-sided reward and the conversion drag.
- **CAC_displaced** = the paid CAC the loop replaces (measured from `.forsvn/performance/*.tsv` or a labeled benchmark).

If CPAU ≥ CAC_displaced, the loop is a worse channel than paid — verdict REDESIGN (shrink the reward, switch to one-sided, or change the form) or kill. Never ship a loss-making loop.

## Computing CPAU

For a double-sided loop:

```
CPAU = (referrer_reward / conversion_per_invite) + referee_reward
```

The `/ conversion_per_invite` term is the conversion drag: you pay the referrer reward per *successful* referral, but invites that don't convert still consumed referrer effort — price on the conversion. Example: $20 referrer + $20 referee at 0.95 referee-activation = $20/0.95 + $20 = $41.05 CPAU. Against a $28 paid CAC, that loop loses money.

For one-sided (referrer-only): `CPAU = referrer_reward / conversion_per_invite`.
For collaborative-native (no reward): `CPAU ≈ 0` (the cost is product marginal cost of the extra seat, often near-zero).

## Reward form — margin matters

| Form | True cost to you | Use when |
|------|-----------------|----------|
| **Product credit / free time** | marginal cost (often ≈0) | default — denominated in your product |
| **Feature unlock** | ≈0 | the unlocked feature is already built |
| **Cash** | face value | only when the audience won't value product-denominated rewards |
| **Swag** | COGS + fulfillment | milestone/power-referrer tiers, brand-building |

A month of free service at $8 marginal cost is a far better $96-face-value reward than $96 cash. Always prefer product-denominated unless the audience genuinely won't act on it.

## Payback horizon

State when the referred cohort's margin covers its reward:

```
payback (cycles or months) = CPAU / (monthly margin per referred user)
```

A reward that takes 8 months to pay back on a product with 3-month median retention is underwater — flag it. Short payback (≤ the median retention window) is the bar.

## Fraud guards (always named)

| Vector | Guard |
|--------|-------|
| Self-referral | Reward on a verified *paid* or distinct-device/email activation, not signup |
| Fake accounts | One reward per verified payment method; velocity cap per referrer |
| Incentive farming | Reward on the qualified action (activate/pay), not the click; cap rewards/period |
| Reward stacking | One reward per referee; no chaining a referee into an immediate referrer for the same incentive |

A loop with no named fraud vector + guard fails the Fraud/abuse dimension.
