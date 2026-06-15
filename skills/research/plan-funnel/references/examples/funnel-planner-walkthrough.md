# Example — funnel-planner Walkthrough

> Worked example showing the full Route A flow on a 2-initiative SaaS case. Use to calibrate when in doubt about agent dispatch, target-setter improvement factors, sanity-check pass criteria, or critic gate evaluation. The artifact at the end is the canonical shape per `format-conventions.md`.

---

## Inputs

**Prior artifact:** `docs/forsvn/artifacts/meta/sketches/prioritize-q1.md`

Initiatives above the cut line:
- Restore Paid Targeting (Proceed)
- Restore Social Proof (Proceed)

**Business profile (from `research/product-context.md` + `experience/business.md`):**
- B2B SaaS, growth stage, retention-dependent economics
- Growth motion: SLG (paid + outbound primary, sales-assisted closing)
- Active channels: Search/GEO, Social media (paid), Mailbox

**Hard-gate check:** prioritize-*.md exists → PASS, dispatch proceeds.

---

## Route Selection

- `--deep` flag? No.
- 3+ initiatives spanning 2+ funnel models? No (2 initiatives, both SaaS/AARRR).
- Input ≤3 sentences + single initiative + prior targets exist? No (2 initiatives).

→ **Route B** (Standard Path). But this walkthrough uses **Route A** to show the full mechanics.

---

## Layer 1 — Parallel Dispatch

Both agents spawn simultaneously.

### model-selection-agent output

- **Growth motion:** SLG (confirmed from experience/business.md)
- **Funnel model:** AARRR (selected over SLG Funnel because the business has retention-dependent economics — Retention + Referral are load-bearing stages)
- **Stage definitions:**
  - Acquisition: paid visitor → site
  - Activation: site visit → signup
  - Retention: signup → active week-4
  - Referral: active user → referral sent
  - Revenue: active → paid conversion
- **Initiative mapping:**
  - Restore Paid Targeting → **Acquisition** stage
  - Restore Social Proof → **Activation** stage (the bounce-rate fix lives at the entry-to-signup step)
- **Channel mapping:** Search/GEO → Acquisition + Activation (primary); Social media (paid) → Acquisition; Mailbox → Retention.

### baseline-collector-agent output

- **Paid conversion (visitor → signup):** 1.2% (user data, High confidence — last 30 days)
- **Homepage bounce rate:** 52% (user data, High confidence — analytics last 30 days)
- **Weekly signups:** 200 (user data, High confidence)
- **Benchmarks (B2B SaaS):**
  - Paid visitor signup rate: good = 3-5%, median = 2-3% (source: `references/benchmarks.md`)
  - Homepage bounce rate: good = 30-40%, median = 40-55%
- **Unit economics:**
  - LTV: $1,800
  - CAC: $120
  - **Ratio: 15:1** (healthy, well above the 3:1 floor)
  - Payback: 4 months (healthy)

### Layer 1 Merge

Both initiatives have stage mapping + numeric baseline → no re-dispatch needed. Pass merged output to Layer 2.

---

## Layer 2 — Sequential

### Step 1: target-setter-agent

| Initiative | Metric | Baseline | Benchmark (Good) | Target | Variance vs. Benchmark | Improvement Factor | Justification | Owner |
|---|---|---|---|---|---|---|---|---|
| Restore Paid Targeting | Paid visitor signup rate | 1.2% | 3-5% | **3.0%** | within range | 150% lift | Was 3.5% before targeting change broke; conservative recovery with lookalike audience. "Major redesign / restoring known-broken" scenario per `playbook.md`. | Sarah |
| Restore Social Proof | Homepage bounce rate | 52% | 30-40% | **40%** | at top of range | 23% reduction | Old homepage was 35%; restoring trust signals should recover most of the gap. "Basic optimization" + "major fix" scenario. | James |
| Overall | Weekly signups | 200 | — | **300** | n/a (combined) | 50% lift | Combined effect: paid fix yields ~225 from paid stream (150 baseline + 75 from rate lift); bounce fix lifts conversion on all sources. | Sarah (owner) |

LTV:CAC check: 15:1 → healthy. Pricing health: no signals flagged this cycle.

### Step 2: sanity-check-agent

Anti-pattern scan (from `references/anti-patterns.md`):
- **Vanity metrics?** No — all targets connect to revenue (signups → paid conversion → MRR).
- **Feature factory?** No — targets measure outcomes, not shipping.
- **Sandbagging?** No — 150% lift on paid and 23% bounce reduction are above-organic.
- **Orphan owners?** No — Sarah and James named per target.
- **Input traps?** No — measuring signup rate and bounce, not activity counts.
- **Ignoring unit economics?** No — LTV:CAC checked at 15:1, healthy.

→ **All pass.** No re-dispatch.

### Step 3: stress-test-agent

Per `references/stress-tests.md`, 4 tests per target:

| Target | Revenue test | 70% test | Ownership test | Measurement test |
|---|---|---|---|---|
| Paid 3.0% | PASS (signups → revenue direct) | PASS (2.5% still meaningful — 100% recovery from 1.2%) | PASS (Sarah) | PASS (weekly via analytics) |
| Bounce 40% | PASS (lower bounce → more signups → revenue) | PASS (43% bounce still meaningful recovery from 52%) | PASS (James) | PASS (weekly via analytics) |
| Signups 300 | PASS (signups are direct revenue input) | PASS (270 signups still 35% lift from 200) | PASS (Sarah owns combined) | PASS (weekly) |

→ All pass.

### Step 4: critic-agent

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | Numeric baselines | PASS | Zero TBD values; all 3 baselines from user data with High confidence |
| 2 | Justified targets | PASS | Every target cites baseline + improvement factor + reasoning (broken-recovery scenario for paid; major-fix for bounce) |
| 3 | 70% test | PASS | All 3 targets pass per stress-test-agent |
| 4 | LTV:CAC | PASS | 15:1 ratio, payback 4 mo — well above 3:1 floor |

→ **PASS.** Ship artifact.

---

## Final Artifact

`docs/forsvn/artifacts/meta/records/targets-2026-05-17.md`:

```markdown
---
skill: plan-funnel
version: 1
date: 2026-05-17
status: done
---

# Targets

**Growth Motion:** SLG
**Funnel Model:** AARRR

## Funnel Stages

| Stage | Definition | Key Metric | Mapped Initiatives |
|-------|------------|------------|-------------------|
| Acquisition | Paid visitor → site | Paid visitor count | Restore Paid Targeting |
| Activation | Site visit → signup | Signup rate, bounce rate | Restore Social Proof |
| Retention | Signup → active week-4 | Week-4 active rate | (none this cycle) |
| Referral | Active user → referral sent | Referrals/active user | (none this cycle) |
| Revenue | Active → paid conversion | Free→paid conversion | (none this cycle) |

## Target Table

| Initiative | Metric | Baseline | Benchmark (Good) | Target | Variance vs. Benchmark | Justification | Owner |
|-----------|--------|----------|-------------------|--------|----------------------|---------------|-------|
| Restore Paid Targeting | Paid visitor signup rate | 1.2% | 3-5% (B2B SaaS median) | 3.0% | within range | Was 3.5% before targeting change broke; conservative recovery with lookalike (major-fix scenario) | Sarah |
| Restore Social Proof | Homepage bounce rate | 52% | 30-40% (B2B SaaS) | 40% | at top of range | Old homepage was 35%; restoring trust signals should recover most of gap (basic-opt + major-fix) | James |
| Overall | Weekly signups | 200 | — | 300 | n/a | Combined effect: paid fix (150→225 from paid) + bounce fix (all sources) | Sarah (owner) |

## Channel → Funnel Stage Map

| Channel | Primary Stage | Secondary Stage | Key Metric | Budget Type |
|---------|--------------|-----------------|------------|-------------|
| Search engines / GEO | Acquisition | Activation | CTR, CPL | Both |
| Social media (paid) | Acquisition | — | CPL, paid signup rate | Paid |
| Mailbox | Retention | — | Email-active rate | Organic |

**9-Channel Reference:** Search engines/GEO, Store/Listing platforms, Bounty/Info platforms, News, Forums/Communities, Social media, IRL (OOH/Events/POS), Mailbox (email), SMS.

## Three-Outcome Validation

| Outcome | Metric(s) | Current | Target | Status |
|---------|-----------|---------|--------|--------|
| **Business** | Paid signup rate, weekly signups, MRR | 1.2% / 200 / $X | 3.0% / 300 / $Y | Covered |
| **Brand** | Branded search volume | 1,200/mo | (no change) | Gap — recommend adding before next cycle |
| **Community** | — | — | — | N/A — B2B enterprise with no user community; engagement tracked via product analytics |

## Validation

### Anti-Patterns: None detected. All targets have baselines, single owners, revenue connection.
### 70% Test: Hitting 70% (2.5% paid rate, 43% bounce, 270 signups) still represents meaningful recovery from 200 weekly signups.
### LTV:CAC Check: 15:1 ratio (LTV $1,800, CAC $120). Healthy even if CAC rises 50%.

## Baselines

Every target in this table is also the baseline for downstream measurement. Keep these numbers authoritative — if the underlying metric drifts >20%, update this table before reusing baselines elsewhere. Stale baselines produce misleading lift targets.
```

---

## Post-write side effects (after artifact write)

1. **Experience write-back** (per `procedures/pre-dispatch.md` Write-back map):
   - `experience/business.md`: append `Growth motion: SLG (confirmed)` + `Funnel baselines: Acquisition paid signup rate = 1.2% (user data, High, 2026-05-17), Activation bounce rate = 52% (user data, High, 2026-05-17), Weekly signups = 200 (user data, High, 2026-05-17)` + `Unit economics: LTV=$1,800, CAC=$120, ratio=15:1, payback=4 mo (date: 2026-05-17)`.
   - `experience/goals.md`: append `Outcomes: Business=Covered, Brand=Gap, Community=N/A (B2B no user community)`.
2. **Prior artifact rename:** if a prior `targets-*.md` existed for this initiative-set, rename to `targets.v[N-1].md` before this run writes (handled by `procedures/dispatch-mechanics.md`).

Manifest sync + eval-loop results.tsv append are pipeline-wide responsibilities per `research-skills/CLAUDE.md` § "Manifest Spec" — funnel-planner's body-diet refactor preserves the original SKILL.md scope, which did not include these calls. Deferred to v6.3.0.

---

## What this example demonstrates

- The hard gate enforces upstream rigor (we didn't ask "what should we set targets for?" — we read prioritize-*.md).
- Route A vs B trade-off is real: this case is borderline (2 initiatives, single funnel model — Route B would have shipped the same numbers in less time).
- The improvement factor table in `playbook.md` calibrates the target-setter — "major fix / restoring known-broken" is a 30-50% lift band, which is why 1.2% → 3.0% (150% lift) is defensible despite being above the typical "no optimization yet" 20-30% band.
- The 70% test catches binary-ish targets early (here, all 3 targets are graceful at 70%).
- LTV:CAC 15:1 means the skill is permissive on acquisition aggressiveness. A 2:1 LTV:CAC would have flipped Gate 4 to FAIL and routed back to target-setter to soften.
- Three-Outcome Validation surfaces the Brand gap without blocking the artifact — operator can choose to fill it next cycle.

---

## What this example deliberately doesn't show

- **Route C (Fast Bump):** see `procedures/dispatch-mechanics.md`. The flow is: read prior `targets-*.md`, apply delta, write — no L1, no critic.
- **Critic FAIL loop:** see `procedures/dispatch-mechanics.md` Critic Gate section. Max 2 cycles, then ship `done_with_concerns`.
- **Hybrid growth motion:** would change funnel model selection (designate one primary; document both); rest of the flow is identical.
- **Aspirational target** (>1.5x above good-tier benchmark): adds a row to the Aspirational Target Flags optional section. Justification must be stronger.
