# Example — prioritize Walkthrough

> Worked example showing the full Route A flow on a 2-root-cause acquisition + activation case. Use to calibrate when in doubt about initiative generation, force-ranking discipline, ICE scoring evidence, cut-line drawing, or the Out-of-Scope file format. The artifact at the end is the canonical shape per `format-conventions.md`.

---

## Inputs

**Hard gate:** `id:diagnose` resolves (diagnosis artifact present) → PASS, dispatch proceeds.

**Root cause from diagnose:**
- (1) Ad targeting brought low-intent visitors after Q1 targeting change (~55% of gap)
- (2) Homepage redesign lost trust signals (~35% of gap)
- Residual (~10%): seasonal noise + minor copy regressions

**Business profile (from `research/product-context.md` + `experience/business.md`):**
- B2B SaaS, growth stage
- 3-person growth team (1 PM, 2 engineers)
- No budget ceiling
- Prior attempts: none for this root cause

---

## Route Selection

- `--fast` flag? No.
- User identified candidate approaches in advance? No — wants generation + ranking.

→ **Route A — Full Analysis**.

---

## Layer 1 — research-agent

Validates the root cause via WebSearch:
- "ad targeting quality case study b2b saas" → 2 case studies (Drift, Gong) showing 2-3x conversion lift from lookalike + intent-keyword shift
- "homepage trust signals conversion case study" → 2 case studies (Basecamp, ConvertKit) showing 15-30% bounce reduction from logo/testimonial restoration

Constraint summary: 3-person growth team, no budget ceiling, no prior attempts, 14-day target window for first ship.

---

## Layer 1.5 — Parallel Dispatch

**initiative-generator-agent** produces 6 standard initiatives:

1. Restore + Refine Paid Targeting (S)
2. Restore Homepage Social Proof (S)
3. Landing Page per Ad Group (M)
4. Homepage A/B: Old vs New (S)
5. Intent-Qualifying Ad Creative (M)
6. Dedicated Onboarding for Paid Visitors (L)

**unconventional-agent** produces 1 unconventional initiative:

- U1. Pixel Sharing with Complementary SaaS (M)

**Merge:** 7 initiatives total. Effort mix check: 3S, 2M (+1M from U1), 1L = passes (3S ≥2, 3M ≥2, 1L ≥1).

**User feedback gate:** Operator says "U1 is interesting but we don't have a partner relationship — keep it for now, may park. #6 is too ambitious right now."

→ pass merged + feedback to Layer 2.

---

## Layer 2 — Sequential

### Step 1: ranking-agent

Force-ranks all 7. The "if you could only do ONE" prompt:

| Rank | Initiative | Reason |
|---|---|---|
| 1 | Restore + Refine Paid Targeting | Fastest fix for biggest root cause (55% of gap) |
| 2 | Restore Homepage Social Proof | Fast, addresses second root cause (35%) |
| 3 | Homepage A/B: Old vs New | Definitive answer on redesign impact |
| 4 | Landing Page per Ad Group | Higher effort but compounds with #1 |
| 5 | Intent-Qualifying Ad Creative | Interesting but less certain |
| 6 | Pixel Sharing (U1) | Unconventional, needs partner |
| 7 | Dedicated Onboarding for Paid | Too complex for current team |

### Step 2: ice-scoring-agent

Scores all 7 with evidence:

| Rank | Initiative | I | C | E | ICE | Key Evidence |
|---|---|---|---|---|---|---|
| 1 | Restore Paid Targeting | 8 | 8 | 9 | 25 | I:8 — paid is 60% of traffic, old targeting converted at 3.5% vs 1.2% now |
| 2 | Restore Social Proof | 7 | 7 | 9 | 23 | C:7 — Wayback shows old page had logos+testimonial that new page removed |
| 3 | Homepage A/B | 6 | 9 | 7 | 22 | C:9 — direct comparison eliminates guessing about redesign impact |
| 4 | LP per Ad Group | 7 | 6 | 5 | 18 | I:7 — message match lifts are well-documented (CXL: 20-50% improvement) |
| 5 | Intent Ad Creative | 5 | 4 | 6 | 15 | C:4 — no precedent with our audience, hypothesis only |
| 6 | Pixel Sharing | 4 | 3 | 5 | 12 | C:3 — requires finding willing partner, untested |
| 7 | Paid Onboarding | 7 | 3 | 3 | 13 | E:3 — needs eng + dynamic content, 4+ weeks |

**Differentiation check:** 7 distinct ICE totals (25, 23, 22, 18, 15, 12, 13) — passes (no more than 2 sharing a total).

### Step 3: cut-line-agent

**Interview prompt:** "How many can you execute well simultaneously?"
**Operator:** "Two at most. Sarah owns paid, James owns the homepage."

Draws cut line:

- **2 Proceed** (Restore Paid Targeting, Restore Social Proof)
- **2 Park** (Homepage A/B, LP per Ad Group)
- **3 Kill** (Intent Ad Creative, Pixel Sharing, Paid Onboarding)

Validates owners + target metrics + kill criteria for each Proceed.

### Step 4: critic-agent

9-point quality gate run (gate names + order mirror `agents/critic-agent.md` exactly):

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | Root cause anchor | PASS | Both Proceeds reference the specific root cause in their hypothesis |
| 2 | Specific mechanics | PASS | Each mechanic is an action sequence (pull list → build lookalike → A/B test), not a category |
| 3 | Anti-generic test | PASS | Every initiative carries an Anti-generic check tied to the specific root cause |
| 4 | Effort mix | PASS | 3S, 3M, 1L across the combined list |
| 5 | Evidence-backed ICE | PASS | Every score has a one-sentence justification in Key Evidence |
| 6 | Differentiated scores | PASS | 7 distinct ICE totals (25, 23, 22, 18, 15, 13, 12) — no more than 2 sharing a total |
| 7 | Force-rank ceiling | PASS | #1-ranked (Restore Paid Targeting) carries the highest ICE (25); rank order agrees with ICE order |
| 8 | Cut line ≤3 | PASS | 2 Proceeds (within ≤3) |
| 9 | Proceed validation | PASS | Both Proceeds have owner + target metric with baseline + kill criteria |

> The critic does **not** score cross-stack schema conformance or Out-of-Scope file writes — those are operator-review / post-write responsibilities (see `anti-patterns.md`), demonstrated in **Post-write side effects** below.

→ **PASS.** Ship artifact + write 3 Out-of-Scope files.

---

## Final Artifact

`docs/forsvn/artifacts/meta/sketches/prioritize-2026-05-18.md`:

```markdown
---
skill: prioritize
version: 1
date: 2026-05-18
status: done
---

# Solution Design

**Root Cause:** (1) Ad targeting quality (~55%), (2) Homepage trust/clarity (~35%)

## Phase 1: Initiatives

### 1. Restore + Refine Paid Targeting — Effort: S
**Hypothesis:** If we revert to original targeting and add a converters lookalike, then paid conversion returns to ≥3%, because the current broad targeting is bringing visitors outside our ICP.
**Mechanic:** Pull last 90d converters list → create 1% lookalike in Meta → A/B test current broad vs. lookalike targeting → 7-day test at $50/day per variant.
**Target Metric:** Paid visitor-to-signup rate
**Anti-generic check:** Only relevant because our specific targeting change caused the quality drop.

### 2. Restore Homepage Social Proof — Effort: S
**Hypothesis:** If we add back customer logos + testimonial above the fold, then homepage bounce rate drops to ≤40%, because the redesign removed the trust signals that were on the old page.
**Mechanic:** Screenshot old homepage via Wayback Machine → identify removed trust elements → add 3 customer logos + 1 short testimonial quote to new hero section → deploy.
**Target Metric:** Homepage bounce rate
**Anti-generic check:** Only relevant because our specific redesign removed these elements.

[...5 more initiatives, same format]

## Phase 2: Prioritization

### Forced Ranking (gut + evidence)

1. Restore + Refine Paid Targeting — fastest fix for biggest root cause
2. Restore Homepage Social Proof
3. Homepage A/B: Old vs New
4. Landing Page per Ad Group
5. Intent-Qualifying Ad Creative
6. Pixel Sharing (U1)
7. Dedicated Onboarding for Paid

### ICE Scoring

| Rank | Initiative | I | C | E | ICE | Key Evidence |
|------|-----------|---|---|---|-----|-------------|
| 1 | Restore Paid Targeting | 8 | 8 | 9 | 25 | I:8 — paid is 60% of traffic, old targeting converted at 3.5% vs 1.2% now |
| 2 | Restore Social Proof | 7 | 7 | 9 | 23 | C:7 — Wayback shows old page had logos+testimonial that new page removed |
| 3 | Homepage A/B | 6 | 9 | 7 | 22 | C:9 — direct comparison eliminates guessing about redesign impact |
| 4 | LP per Ad Group | 7 | 6 | 5 | 18 | I:7 — message match lifts are well-documented (CXL: 20-50% improvement) |
| 5 | Intent Ad Creative | 5 | 4 | 6 | 15 | C:4 — no precedent with our audience, hypothesis only |
| 6 | Pixel Sharing | 4 | 3 | 5 | 12 | C:3 — requires finding willing partner, untested |
| 7 | Paid Onboarding | 7 | 3 | 3 | 13 | E:3 — needs eng + dynamic content, 4+ weeks |

### Decisions

| Initiative | Decision | Owner | Target Metric (Baseline) | Kill Criteria |
|------------|----------|-------|-------------------------|---------------|
| Restore Paid Targeting | Proceed | Sarah | Paid conversion: 1.2% | Stop if <2% after 10 days |
| Restore Social Proof | Proceed | James | Homepage bounce: 52% | Stop if >48% after 7 days |
| Homepage A/B | Park | — | — | — |
| LP per Ad Group | Park | — | — | — |
| Intent Ad Creative | Kill | — | — | Reason: Too uncertain; paid targeting fix addresses the same root cause more directly |
| Pixel Sharing | Kill | — | — | Reason: Requires partner development; revisit if standard approaches underperform |
| Paid Onboarding | Kill | — | — | Reason: Too complex for current team capacity |

**Cut line:** 2 initiatives proceeding. Team capacity: 3-person growth team, Sarah on paid + James on homepage.

## Next Step

Run `plan-funnel` to set numeric targets for the proceeding initiatives.
If any "Proceed" initiative requires a technical build, also run `architect-system` (from the `forsvn-dev` package) with these initiatives as context.
```

---

## Out-of-Scope files written (3, one per Kill)

`docs/forsvn/artifacts/meta/out-of-scope/intent-qualifying-ad-creative.md`:

```markdown
# Intent-Qualifying Ad Creative
**Decided:** 2026-05-18
**Context:** Root cause was (1) ad targeting quality, (2) homepage trust signals. Goal: recover paid conversion to ≥3%.
**Decision:** Killed because too uncertain; paid targeting fix addresses the same root cause more directly.
**Revisit if:** Paid targeting fix lands at <2.5% conversion AND root cause persists.
```

`docs/forsvn/artifacts/meta/out-of-scope/pixel-sharing.md`:

```markdown
# Pixel Sharing
**Decided:** 2026-05-18
**Context:** Root cause was (1) ad targeting quality, (2) homepage trust signals. Goal: recover paid conversion to ≥3%.
**Decision:** Killed because requires partner development; revisit if standard approaches underperform.
**Revisit if:** Standard initiatives ship but conversion stays below 2.5% AND a complementary SaaS partner becomes available.
```

`docs/forsvn/artifacts/meta/out-of-scope/dedicated-onboarding-for-paid-visitors.md`:

```markdown
# Dedicated Onboarding for Paid Visitors
**Decided:** 2026-05-18
**Context:** Root cause was (1) ad targeting quality, (2) homepage trust signals. Goal: recover paid conversion to ≥3%.
**Decision:** Killed because too complex for current team capacity (4+ weeks eng work).
**Revisit if:** Team grows to 5+ engineers AND paid conversion stabilizes at ≥3% so onboarding becomes the bottleneck.
```

---

## Post-write side effects

1. **Out-of-Scope persistence:** 3 files written per above. `discover` and `forsvn` will see these on their next run.
2. **Prior artifact rename:** none this run (version 1, no prior `prioritize-*.md`). On a re-run, the prior file would be renamed to `prioritize.v1.md`.

**No experience write-back.** Original SKILL.md is explicit: prioritize doesn't seed dimensions to experience/ — initiatives are project-specific tactics, not stable user-profile state. Constraint Interview answers feed dispatch as in-context input only.

---

## What this example demonstrates

- The hard gate enforces upstream rigor — we didn't ask "what initiatives should we generate?" We read `diagnose-*.md`.
- Force-ranking before scoring creates differentiation — the #1 rank's ICE (25) is the ceiling and the spread is clear (25→23→22→18→15→13→12).
- The Layer 1.5 user feedback gate caught U1's "we don't have a partner" — that signal flowed into the cut-line decision (Park, not Proceed).
- The cut-line-agent enforced the ≤3 rule — 2 Proceed, 2 Park, 3 Kill. Operator's "we can handle 2 at most" capacity constraint mattered.
- Every Proceed has owner + metric + baseline + kill criteria. James + Sarah named; baselines set; "Stop if <2% after 10 days" is testable.
- Kill criteria on every Kill row have the `Reason:` prefix that Out-of-Scope file writes parse.
- The Next Step block points to funnel-planner verbatim — chain handoff detection works.

---

## What this example deliberately doesn't show

- **Route B (Quick Design):** see `procedures/dispatch-mechanics.md`. The flow is: skip unconventional-agent, skip Layer 1.5 user feedback gate, otherwise identical.
- **Critic FAIL loop:** see `procedures/dispatch-mechanics.md` Critic Gate section. Max 2 cycles, then ship `done_with_concerns` with Known Issues section.
- **Churn root cause:** when diagnose identifies churn, initiative-generator-agent loads `references/churn-playbook.md` and produces 5 churn-archetype initiatives in addition to the standard set. See `references/churn-playbook.md` for the archetypes.
- **Revisiting an Out-of-Scope kill:** if a future prioritize run reconsiders Pixel Sharing because a partner becomes available, the out-of-scope file gets a `**Revisited:** [date]` line appended; the new prioritize-*.md has a "Revisited Out-of-Scope" section per `format-conventions.md`.
