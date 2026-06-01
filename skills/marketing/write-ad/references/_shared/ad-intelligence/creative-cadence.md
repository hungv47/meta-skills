<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: ad-intelligence
surface: creative-cadence
schema_version: 1
last_verified: 2026-05-10
verifier: hungv47
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: seedbank # pre-staged for ad-copy skill build
---

# Creative Cadence — Volume, Speed, Allocation

Per-surface reference for **paid-ad creative cadence**: testing rhythm, kill speed, budget split, and the dedicated-creative vs repurposed-content distinction.

> Scope: paid social creative pipeline, Meta primary. Thresholds are starting heuristics, not benchmarks. Calibrate against the account's own winner-vs-loser distribution.

---

## 1. Compounding Claim

Creative fatigue kills scaled paid accounts even when audience, channel, and product are right. The operational answer is:

- high creative variant volume
- fast loser detection
- a protected test budget
- dedicated ad creative instead of lightly repurposed organic content

Treat the numbers below as calibration defaults. The directional pattern is load-bearing; the exact thresholds are account-specific.

---

## 2. Creative Volume

| Step | Detail |
|---|---|
| 1. Master brief | One brief covering target audience, pain points, desired action, proof, and emotional triggers |
| 2. Generate angles | `50+/month` for modest accounts; `100+/week` only when spend, production capacity, and tracking can support it |
| 3. Run with test budget | Keep test spend separate from scale spend |
| 4. Pause underperformers | Use an early rule, then review account-specific false positives |
| 5. Scale survivors | Promote winners into scale campaigns across the audiences/platforms they fit |
| 6. Expect a low hit rate | A small winner pool funds the account; most variants should die quickly |

**Calibration rule:** if production cannot sustain the chosen cadence for 4 consecutive weeks, lower cadence or externalize production. A cadence the team cannot keep is not an operating system.

---

## 3. Kill Speed

| Threshold | Action |
|---|---|
| CTR < `1.5%` after `48h` | Starting auto-pause heuristic |
| Clear loser after first signal window | Kill in **3 days, not 3 weeks** |

**Synthesized rule:** pause weak creative quickly, but fit the threshold to the account. If historical winners cluster at 0.8% CTR, a 1.5% threshold will kill everything.

**Operator workflow:**

1. Build a first-pass auto-pause rule in Meta Ads Manager.
2. Within 30 days, log winner-vs-loser CTR distribution from the account.
3. Adjust threshold so it kills the bottom ~70-80% of variants in 48h and leaves the top ~20-30% alive for more signal.

---

## 4. Budget Split

| Allocation | Bucket | Purpose |
|---|---|---|
| `80%` | proven winners | scale spend; where revenue compounds |
| `20%` | new tests | variant pipeline feeding the winner pool |

**When to deviate:**

- **Early-stage paid account (<90 days):** use a higher test allocation, often 40-50%, until there are 5+ proven winners.
- **Creative fatigue cluster:** if multiple long-running winners decay at once, temporarily shift test allocation up to 30-40%.
- **Tiny budget:** avoid over-splitting. Fewer variants with cleaner reads beat many underpowered tests.

---

## 5. Dedicated Ad Creative vs Repurposed UGC

| Approach | Typical ceiling risk | Why |
|---|---|---|
| Repurposed influencer UGC | Hits a ceiling earlier | The product may be too subtle for paid placement even if the content works organically |
| Dedicated ad creative | Scales better when execution is strong | The entire video communicates the product, so the creative itself becomes targeting |

### Dedicated Creative Pattern

- Direct product value in the first 5 seconds.
- Product action is visible, not implied.
- Captions or visual proof carry the core value even with sound off.
- Hook is outcome-led and specific enough to make the viewer self-select.

**Principle:** the entire creative is about the product, not a lifestyle scene with a product cameo. The difference is not aesthetic; it changes how much spend the account can absorb before performance flattens.

When `write-ad` emits a brief, include `creative_format: dedicated | repurposed-UGC` and attach a ceiling warning to `repurposed-UGC` when the account's scale target is high.

---

## 6. Affiliate-Creator Production Model

High cadence is hard to sustain with in-house production only. For accounts that need sustained volume, consider a dedicated ad-creator or affiliate-creator lane.

| Element | Detail |
|---|---|
| Creator type | Dedicated **ad creators**, not the same as organic influencers |
| Compensation | Percentage of revenue or performance-linked incentive when attribution supports it |
| Operations | Affiliate platform, creator group, clear submission QA |
| Creative direction | Give constraints and proof points; let creators vary hooks and formats |

**Operator implication:** in-house-only creative production typically caps the pipeline at 5-15 variants/week. Sustained 50+ variants/month or 100+ variants/week is structurally hard without externalized production.

---

## 7. Failure Modes

| Pattern | Symptom | Root cause |
|---|---|---|
| Creative fatigue without volume to refresh | Account scales, plateaus, then declines | Volume too low to replace fatiguing winners |
| 3-week kill window instead of 3-day | Losers burn budget long after signal is clear | No auto-pause rule; review cycle too slow |
| Optimizing engagement instead of cost-per-conversion | Dashboard looks healthy while revenue does not track | CPM/CTR are leading indicators; conversion cost is lagging truth |
| Repurposed UGC pushed into scale campaign | Spend ceiling appears despite product-market fit | Format too subtle for paid placement |
| In-house-only production with high scale target | Test bucket starves; winner bench stays small | Production capacity caps variant volume |
| Treating thresholds as universal benchmarks | Rule kills everything or nothing | Account-specific CTR distribution differs from defaults |

---

## 8. Confidence Notes

The directional pattern is consistent across the internal research synthesis: high creative volume + fast kill speed + tiered budget allocation + dedicated-format creative. Numeric thresholds vary by account, category, attribution quality, and creative production capacity.

## 9. Source Basis

Internal research synthesis. Raw source ledger intentionally omitted from the public skill package.
