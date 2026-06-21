---
title: Plan-Budget — End-to-End Walkthrough (Route B, $6,000/mo across 4 channels)
lifecycle: canonical
status: stable
produced_by: plan-budget
load_class: EXAMPLE
---

# Plan-Budget — End-to-End Walkthrough

**Load when:** an operator (human or agent) wants a complete trace of how a Route B allocation gets produced — Pre-Dispatch (CAC sourcing classification) → Layer 1 allocator solo → Layer 2 sequential (constraint-checker → critic) → artifact. This is the premium-bar worked example: a real $6,000/mo split across 4 channels with marginal-CAC curves, a hypothesis lane, a binding floor, per-channel reallocation triggers, a constraint bounce, and a critic PASS — plus a cycle-2 FAIL on a fabricated CAC at the end.

All numbers below are a synthetic operating scenario for illustration, not a real account.

---

## Scenario

A B2B SaaS founder (project-management tool, $40/mo, ~28-month average retention → LTV ≈ $1,120 at ~70% gross margin) has run paid for one quarter and now has real CAC data in `measure-results`. They want to allocate **$6,000/mo** for the next **3 months**, objective **acquisition**.

- **Selected channel set** (from `campaign-plan.md`): Meta, Google Search, LinkedIn Ads, newsletter sponsorships.
- **Sourced CACs** (`.forsvn/performance/*.tsv`, 90-day windows):
  - Meta: CAC $95, current spend ~$2,000/mo, signal: CAC rising slowly (was $82 last window) → **at/just past the knee**.
  - Google Search (non-branded): CAC $70, current spend ~$1,200/mo, signal: flat, impression share 45% → **below the knee** (room to scale).
  - LinkedIn Ads: CAC $210, current spend ~$1,800/mo, signal: stable → **at the knee** (high but on-objective for B2B).
  - Newsletter sponsorships: **no measured CAC** — never run a placement. **Unsourced.**
- **LTV:** $1,120 (sourced: pricing × margin × retention from `product-context.md`).
- **Constraints:** max-concentration cap 50%; min-viable floors per `marginal-return-model.md` §5.

---

## Step 0 — Pre-Dispatch (CAC sourcing classification)

Orchestrator reads `campaign-plan.md` (the 4-channel set + §0 vetoes), `.forsvn/performance/{meta,google,linkedin}.tsv` (state `sufficient` for Meta + Google, `sparse`→treated-sourced for LinkedIn with the count noted), and `product-context.md` (LTV).

Classification:

| Channel | CAC | Source | Class |
|---|---|---|---|
| Meta | $95 | measure-results (meta.tsv, n=11) | sourced |
| Google Search | $70 | measure-results (google.tsv, n=14) | sourced |
| LinkedIn | $210 | measure-results (linkedin.tsv, n=8) | sourced |
| Newsletter | — | none | **unsourced → hypothesis lane** |

Run-level `cac_sourcing: mixed` (one hypothesis lane). Not a hard block — three channels are sourced, so the run proceeds.

§0 veto check (from campaign-plan): newsletter's launch-channel pack §0 says "no existing list AND no budget for sponsored placement → wrong channel." The founder HAS budget for a sponsored placement (that's what the hypothesis lane funds), so the veto does **not** fire. Recorded.

---

## Step 1 — Layer 1 dispatch (allocator solo)

Allocator spawned with the inputs + `marginal-return-model.md` + `performance-data.md` + `anti-patterns.md`.

**Marginal-CAC estimation** (per model §3 — average CAC × the band multiplier for the channel's curve position):

| Channel | Avg CAC | Curve position (signal) | Band multiplier | **Marginal CAC** |
|---|---|---|---|---|
| Google Search | $70 | below knee (flat, 45% IS) | ×1.05 | **~$74** |
| Meta | $95 | at/just past knee (CAC rising $82→$95) | ×1.4 | **~$133** |
| LinkedIn | $210 | at knee (stable) | ×1.3 | **~$273** |
| Newsletter | unknown | hypothesis | — | unknown |

**Allocation logic (equalize marginal return, model §4):** Google has the cheapest marginal CAC ($74) and room below its knee → it absorbs the most, pushing spend until its marginal CAC rises toward Meta's. Meta holds near its knee (don't accelerate the rising-CAC trend — anti-pattern #5). LinkedIn is expensive marginally ($273) but its LTV:CAC at marginal is still $1,120/$273 ≈ **4.1:1** — comfortably above the 3:1 guardrail (model §6), and it's the on-objective B2B channel — so it earns its floor-plus, not zero. Newsletter gets a capped hypothesis lane (its min-viable floor: one placement ≈ $500) to *buy data*.

**LTV:CAC @ marginal guardrail check:** Google 15.1:1, Meta 8.4:1, LinkedIn 4.1:1 — all > 3:1; every allocation-lane channel's next dollar is profitable.

**Proposed allocation (allocator draft):**

| Channel | Spend | % | Lane | Marginal CAC @ spend | Exp. new customers | LTV:CAC @ marginal |
|---|---|---|---|---|---|---|
| Google Search | $2,600 | 43% | allocation | ~$88 (risen up its curve) | ~30 | 12.7:1 |
| Meta | $1,900 | 32% | allocation | ~$133 | ~14 | 8.4:1 |
| LinkedIn | $1,000 (FLOOR... see note) | 17% | allocation | ~$273 | ~4 | 4.1:1 |
| Newsletter | $500 (TEST CAP) | 8% | hypothesis | unknown | learning only | — |
| **Total** | **$6,000** | **100%** | | | | |

**Allocator self-flag:** LinkedIn's min-viable floor is **$2,000** (model §5 — LinkedIn floor CPCs are high). The draft put it at $1,000, *below its floor*. The allocator catches this in self-check and notes it but — for the trace — let the constraint-checker formally bounce it, to show the gate working.

**Reallocation triggers (drafted):**
- Google: if measured CAC > $96 (1.3× planned marginal $74... using planned marginal) sustained 2 weeks → it's hit its knee; stop scaling, hold spend.
- Meta: if measured CAC > $173 (1.3× $133) sustained 2 weeks → past knee; cut $400 to Google.
- LinkedIn: if measured CAC > $355 (1.3× $273) sustained 2 weeks → cut to floor or pause; reallocate to Google.
- Newsletter (hypothesis): if the placement's CAC ≤ $150 after $500 spent → promote to an allocation lane next cycle; if CAC > $300 or unmeasurable → cut the lane.
- Budget event: if total budget changes ±20% → re-run (the knees shift).

---

## Step 2 — Layer 2: constraint-checker

Constraint-checker bounds the draft against floors, the §0 veto, the concentration cap, the pool split (n/a — pure acquisition), and the no-spend gate.

**Constraint Verdict: REVISION_REQUIRED**

### Violations
1. **Min-viable floor** — LinkedIn: allocated $1,000, but LinkedIn's min-viable floor is $2,000 (model §5). A $1,000 LinkedIn allocation is a sub-floor sliver (anti-pattern #6) — below this, the 8-row sample can't grow enough to read a trend. **Fix:** raise LinkedIn to its $2,000 floor or set it to zero; this acquisition objective + 4.1:1 LTV:CAC justifies funding it, so raise to floor and pull the $1,000 from Google (Google is still below its knee but $1,600 keeps it the largest allocation).

Re-dispatch: allocator with this violation.

(Concentration cap OK — Google at 43% < 50%. No-spend gate OK — output is a plan. Sum = $6,000 OK.)

---

## Step 3 — allocator re-dispatch (constraint fix, no critic cycle consumed)

**Revised allocation:**

| Channel | Spend | % | Lane | Marginal CAC @ spend | Exp. new customers | LTV:CAC @ marginal |
|---|---|---|---|---|---|---|
| Google Search | $1,600 | 27% | allocation | ~$80 | ~20 | 14.0:1 |
| Meta | $1,900 | 32% | allocation | ~$133 | ~14 | 8.4:1 |
| LinkedIn | $2,000 (FLOOR) | 33% | allocation | ~$273 | ~7 | 4.1:1 |
| Newsletter | $500 (TEST CAP) | 8% | hypothesis | unknown | learning only | — |
| **Total** | **$6,000** | **100%** | | | | |

Triggers updated for the new spends. Constraint-checker re-run → **PASS** (LinkedIn at floor; top channel LinkedIn 33% < 50% cap; sum $6,000; no §0 veto fires; output is a plan).

---

## Step 4 — Layer 2: critic (7-dim rubric)

**Overall Verdict: PASS**

| Dimension | Score | Min | Notes |
|---|---|---|---|
| Input integrity | 9 | 6 | Meta/Google/LinkedIn CACs sourced to measure-results with row counts; newsletter correctly a capped hypothesis lane, not an invented number; LTV sourced. |
| Marginal-return soundness | 9 | 6 | Every dollar traces to a marginal-CAC reason; Google (cheapest marginal) scaled until rising toward Meta's; not an even split. |
| Diminishing-returns respect | 8 | 6 | Meta held at its knee (rising-CAC signal respected, not accelerated); Google scaled because it's below-knee with a flat signal; LinkedIn at-knee. One point off: Google's exact knee is inferred from impression share, not a fitted curve. |
| Floor + veto compliance | 9 | 6 | LinkedIn raised to its $2,000 floor (no sub-floor sliver); newsletter §0 veto checked and did not fire (budget for a placement exists). |
| Concentration balance | 8 | 6 | Top channel (LinkedIn) at 33% < 50% cap; risk reasoned — no single channel dominates; spread across 3 sourced channels + 1 test. |
| Reallocation triggers | 9 | 6 | Every channel has a falsifiable trigger (CAC threshold + 2-week window + destination); newsletter has promote/kill; budget-event trigger present. |
| Objective fit | 8 | 6 | Acquisition: all channels weighted on new-logo LTV:CAC, all > 3:1; LinkedIn kept despite high CAC because it's the on-objective B2B channel and clears the guardrail. |

**Total: 60/70** (threshold 49; every dim ≥6) → **PASS**.

The critic scored this allocation **once** — `critic_total: 60/70`. The constraint-driven revision in Step 3 did not consume a critic cycle (it was a floor fix, re-checked by the constraint-checker, not re-scored). Verdict driver: strongest = Input integrity + Marginal-return (9); the run never fabricated a CAC and never even-split.

---

## Step 5 — Artifact written

`docs/forsvn/artifacts/marketing/plan-budget/2026-06-21-acquisition-6k.md`, frontmatter `cac_sourcing: mixed`, `critic_total: 60/70`, `status: done`, body in the fixed section order. Delivered inline: the allocation table + the reallocation triggers + the one concern (newsletter is a data-buying hypothesis lane, not a customer-acquisition allocation — promote or cut next cycle).

---

## Appendix — cycle-2 FAIL trace (fabricated CAC)

A counter-example showing the Gate-1 ban firing. Same scenario, but the operator has **never** run Google and supplies no number; the allocator (incorrectly) assigns Google a "$70, seems typical for B2B search" CAC and gives it a $2,600 number-backed allocation.

**Critic — Overall Verdict: FAIL**

| Dimension | Score | Min | Notes |
|---|---|---|---|
| Input integrity | **2** | 6 | Google's $70 CAC has source label `unsourced` — it's an invented "seems typical" number backing a $2,600 allocation. **Auto-fail** (anti-pattern #8, Gate 1). |

**Rewrite Feedback:**
1. **Input integrity** — Google: CAC $70 is unsourced (no measure-results row, no operator number, no cited benchmark). **Fix:** move Google to a capped hypothesis lane (its $1,000 floor as a test budget with a CAC target + spend ceiling), OR drop it from this allocation and reallocate to the sourced channels. Never give an unsourced channel a number-backed allocation. **Re-dispatch:** allocator.

The verdict is FAIL regardless of the other dimensions' scores — a single dim < 6 fails the whole allocation. The fix is structural (hypothesis lane), never "find a plausible CAC."
