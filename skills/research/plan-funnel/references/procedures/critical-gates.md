# Procedure — Critical Gates (plan-funnel)

> Load before any agent ships output. These six gates supersede every other instruction in this skill. Hard gates fire under `--fast` too — safety gates supersede the mode-resolver downgrade.

---

## 1. Every target MUST have a numeric baseline — zero "TBD" values

Targets without baselines are arbitrary guesses. If the user lacks data, use industry benchmarks from `references/benchmarks.md` with explicit confidence flagging (`benchmark-derived`, low/medium/high confidence). Naked "TBD" placeholders fail the critic.

## 2. Every target MUST cite justification — no naked numbers

"Achieve 5% conversion" alone is unacceptable. The justified form is:

- **Baseline:** current 3.2% (source: GA4 last 30 days)
- **Improvement factor:** 20% lift (per `playbook.md` calibration table)
- **Reasoning:** no optimization done yet, fixing known broken page

Every numeric target carries baseline + improvement-factor + reasoning. The critic auto-fails on naked numbers.

## 3. 70% test — partial achievement must still be valuable

If hitting 70% of a target is meaningless, the target is wrong. Apply context rules per metric type:

- **Higher-is-better** (conversion, traffic, revenue): 70% of target is still directional progress
- **Lower-is-better** (CAC, churn): 70% reduction must still beat baseline materially
- **Binary** (feature shipped, integration live): reframe as a leading metric — the binary cannot pass the 70% test

Critic fails any target where the 70% case is "nothing happened."

## 4. LTV:CAC ≥ 3:1 required for acquisition targets — or explicitly flagged

Setting aggressive acquisition targets when unit economics are unhealthy means the company loses money faster. If LTV:CAC < 3:1:

- Flag the gap explicitly in the artifact (Pricing Health Signals section)
- Defer to `diagnose` if the unit economics need surgery before targets make sense
- Document the business-model assumption that would have to change for these targets to be safe

## 5. Growth motion MUST be explicitly identified — PLG, SLG, or Hybrid

The funnel model selection depends on the growth motion:

- **PLG** → PLG Funnel or AARRR
- **SLG** → SLG Funnel or TOFU-MOFU-BOFU
- **Hybrid** → both with clear primary/supplementary designation (channel-mix splits across motions)

Models live in `references/funnel-models.md`. Picking the wrong model misrepresents the channel-mix and the sensitivity surface.

## 6. Three-outcome validation required

Every funnel must account for:

- **Business** (revenue) — must be Covered
- **Brand** (awareness) — may be N/A with justification
- **Community** (engagement) — may be N/A with justification

Gaps without justification are flagged by the critic. See `format-conventions.md` for the Three-Outcome Validation section schema.
