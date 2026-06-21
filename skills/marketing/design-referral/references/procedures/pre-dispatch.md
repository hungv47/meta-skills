# Pre-Dispatch — Design Referral

[PROCEDURE] — Cold Start, Missing-Input Hard Blocks, write-back map. Loaded at Pre-Dispatch entry.

## Needed dimensions

| Dimension | Required | If missing |
|-----------|----------|------------|
| **retention/PMF evidence** | hard | BLOCK — a referral loop on a leaky product spreads churn. Ask for retention evidence; none → `BLOCKED`, recommend fixing retention first |
| **share-worthy moment** | hard | BLOCK — ask: what value moment would a user want to share / could the loop fire after? |
| **loop-type** | recommended | default to collaborative-native if the product is multiplayer; else recommend one + state why |
| **unit economics (CAC-to-beat, LTV, margin)** | recommended | proceed; if no CAC to bound the incentive → `NEEDS_CONTEXT`, recommend measure-results |
| incentive idea | optional | the economist recommends one |

## Cold Start (when context is thin)

Ask up to 5, stopping when the two hard dimensions resolve:

1. Do users stick around — is there retention evidence (cohort retention, repeat usage)? (the precondition)
2. What value moment would a user genuinely want to share, or that the loop could fire right after?
3. Is the product multiplayer (does getting value involve other people)? (decides collaborative-native vs. incentivized)
4. What does it currently cost you to acquire a user via paid? (the CAC the incentive must beat)
5. What's the rough margin / LTV per user? (so the reward fits the economics)

## Missing-Input Hard Blocks (never proceed)

1. **No retention evidence** → `BLOCKED`. Referral spreads churn on a leaky product. Fix retention (design-lifecycle) first.
2. **No share moment** → ask. A loop with no value-realized trigger converts near zero.
3. **No unit economics** → `NEEDS_CONTEXT`. The incentive can't be bounded without a CAC/LTV. Recommend measure-results / product-context.
4. **Payout/disbursement requested** → BLOCK. This skill designs; it never moves money. Not config-toggleable.

## Write-back map (experience layer)

On completion, persist to `docs/forsvn/experience/marketing/*.md` (append-only):
- `Referral — share trigger` = the value moment the loop fires after.
- `Referral — CAC to beat` = the CAC the incentive was bounded against (reused, not re-asked).
- `Referral — projected K + basis` = the computed K and its input bases.

## `--fast` behavior

One loop variant, K-math + economics inline, no rewrite loop. **Does NOT skip** the retention precondition, the two hard blocks, the CPAU<CAC computation, or the no-payout gate.
