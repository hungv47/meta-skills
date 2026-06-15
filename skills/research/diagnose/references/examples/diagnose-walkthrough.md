# Example — diagnose Walkthrough

> Worked example showing the full Route B flow on a signup-decline case. Use to calibrate when in doubt about Cold Start interviewing, tree-building, external-factor scanning, hypothesis ranking, the Data Gathering Pause, or verdict + root cause statement format. The artifact at the end is the canonical shape per `format-conventions.md`.

---

## Inputs (from Cold Start)

**User:** "Our signups are declining."

**Pre-Dispatch interview** (the 4 questions from `procedures/pre-dispatch.md` Cold Start):
- "What's the current signup rate?" → "About 200/week, down from 350/week"
- "When did it start?" → "About 8 weeks ago"
- "Any changes around that time?" → "We launched a new homepage and changed our ad targeting"
- (Q4 Tried) → "We rolled back some of the ad creative changes but it didn't help."

**Problem statement** (Phase 1 entry):
> Weekly signups are 200 instead of 350, a gap of 43%. Started: ~8 weeks ago. Inflection point: homepage launch + ad targeting change (~simultaneous).

---

## Route Selection

- `--fast` flag? No.
- Single clear hypothesis already in mind? No — user named two candidates but wants discovery.

→ **Route B — Full Analysis**.

---

## Layer 1 — Parallel Dispatch

Both agents spawn simultaneously.

**tree-builder-agent output:**

```
Math Tree

Weekly signups declining (200 → 350 target)
├── Traffic volume declining (fewer people arriving)
│   ├── Paid traffic: ad targeting change reduced volume/quality
│   ├── Organic traffic: SEO impact from homepage redesign
│   └── Referral/direct: brand or word-of-mouth decline
├── Conversion rate declining (same traffic, fewer signups)
│   ├── Homepage redesign reduced clarity/trust
│   ├── Signup flow friction increased
│   └── Value proposition no longer resonates
└── Measurement change (signups happening but not counted)
    ├── Tracking code broken on new homepage
    └── Attribution model changed

MECE Check:
- Mutually Exclusive: Traffic volume vs. conversion rate vs. measurement are independent
- Collectively Exhaustive: All signup decline must come from fewer visitors, lower conversion, or miscounting
```

Critical: the "Measurement change" branch is included even though the user didn't mention tracking — Critic Gate 4 (MECE) catches missing measurement branches as a gap. This is the branch that explains 100% of the gap when true.

**external-check-agent output:**

| Factor | Finding | Status |
|---|---|---|
| Competitor launch | Searched "[competitor] launch 2026 Q1" — no launches found | Ruled Out |
| Market/seasonal shift | Searched "SaaS signup trends Q1 2026" — no industry-wide decline reported | Ruled Out |
| Platform/algorithm change | Searched "Google algorithm update Feb 2026" — no major update in period | Ruled Out |
| Regulatory/policy change | No relevant changes found | Ruled Out |
| Technology change | No relevant changes found | Ruled Out |
| Macro-economic conditions | Searched "SaaS spending Q1 2026" — stable | Ruled Out |

No external factors confirmed — proceed with internal analysis.

**Merge:** Tree used as-is (no external branches needed). Pass merged tree + external scan to hypothesis-agent.

---

## Layer 2 — Sequential

### Step 1: hypothesis-agent

3 hypotheses, ranked by testability (speed × potential gap):

1. **Tracking broken** — Priority: HIGH
   - **If** the homepage redesign broke tracking, **then** GA4 shows a drop while DB signups remain stable, **because** the new template may not include the tracking script.
   - Deciding data: GA4 signups vs DB signups, 8-week comparison.
   - Potential gap explained: ~100% if true. Test time: 1 hour.
2. **Ad targeting reduced quality** — Priority: HIGH
   - **If** the targeting change brought low-intent visitors, **then** paid conversion dropped while organic held steady, **because** broader targeting reaches people outside the ICP.
   - Potential gap explained: ~50%. Test time: 2 hours.
3. **Homepage reduced conversion** — Priority: MEDIUM
   - **If** the new homepage is less clear, **then** all-source conversion dropped equally, **because** the design lacks social proof.
   - Potential gap explained: ~40%. Test time: 1 day.

Ranking rationale: hypothesis 1 is fastest to test AND would explain 100% if true → highest expected value. Hypothesis 2 second because paid vs organic comparison is fast. Hypothesis 3 last because requires bounce-rate analysis across cohorts.

### Step 2: data-mapper-agent

| # | Hypothesis | Deciding Data | Source | Owner |
|---|---|---|---|---|
| 1 | Tracking broken | GA4 signups vs DB signups, 8-week comparison | GA4 Events + Production DB | Engineering |
| 2 | Ad targeting | Paid vs organic conversion rate, before/after | GA4 → Acquisition → Traffic source → Conversion | Marketing (paid) |
| 3 | Homepage conversion | Bounce rate by source, before/after | GA4 → Pages → Homepage → Bounce rate | Product/Design |

### Step 3: Data Gathering Pause (INTERACTIVE CHECKPOINT)

Orchestrator presents data requirements to user. User returns with data:

- "Checked DB vs GA4 — both show the same drop. Tracking is fine."
- "Paid traffic conversion dropped from 3.5% to 1.2%. Organic is still at 4.1%."
- "Homepage bounce rate increased from 35% to 52% for all traffic."

### Step 4: verdict-agent output

| # | Hypothesis | Verdict | Evidence | Gap |
|---|---|---|---|---|
| 1 | Tracking broken | **Rejected** | GA4 and DB both show 200/week. Tracking is correct. | 0% |
| 2 | Ad targeting reduced quality | **Confirmed** | Paid conversion dropped 66% (3.5% → 1.2%). Organic stable at 4.1%. | ~55% |
| 3 | Homepage reduced conversion | **Confirmed** | Bounce rate up 17pts across ALL sources. | ~35% |

**Root Cause Statement:**

> **Root Cause 1 (~55% of gap):** Ad targeting change brought low-intent visitors, evidenced by paid conversion dropping 66% while organic held steady. The broader targeting reaches people outside the ICP.
>
> **Root Cause 2 (~35% of gap):** Homepage redesign reduced trust/clarity, evidenced by bounce rate rising 17 points across all traffic sources. The new page likely lacks the social proof or clear value prop of the old design.
>
> **Unexplained (~10%):** Minor variance, possibly seasonal. No action needed.

Gap percentages sum to ~100% (55 + 35 + 10) — Critic Gate 10 passes.

### Step 5: critic-agent

10-point quality gate run:

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | Problem statement has two numbers | PASS | "200 instead of 350" |
| 2 | Logic tree 2-3 levels, ≥3 leaves | PASS | 3 branches × 2-3 leaves each, 2 levels |
| 3 | Each leaf is a testable cause | PASS | Every leaf names a mechanism (e.g., "Tracking code broken on new homepage") |
| 4 | MECE | PASS | Volume / conversion / measurement are independent; covers all signup decline modes |
| 5 | If/Then/Because format | PASS | All 3 hypotheses have all 3 clauses |
| 6 | "Then" names specific metric | PASS | "GA4 shows a drop", "paid conversion dropped", "all-source conversion dropped equally" |
| 7 | Named data source | PASS | Tool → Report → Metric path on all 3 |
| 8 | Ranked by testability | PASS | Speed-to-data × potential gap explained order honored |
| 9 | Verdicts cite evidence | PASS | All 3 verdicts cite specific numbers |
| 10 | Gap percentages sum to ~100% | PASS | 55 + 35 + 10 = 100% |

→ **PASS.** Ship artifact.

---

## Final Artifact

`docs/forsvn/canonical/research/DIAGNOSE.md`:

```markdown
---
skill: diagnose
version: 1
date: 2026-05-18
status: done
stack: research
review_surface: none
id: diagnose
type: canonical
keywords: [diagnose, root-cause, hypothesis-tree, metric-decline, if-then-because]
---

# Problem Analysis

## Phase 1: Problem Definition

### Problem Statement

Weekly signups are 200 instead of 350, a gap of 43%.
Started: ~8 weeks ago. Inflection point: homepage launch + ad targeting change (~simultaneous).

### Logic Tree

Math Tree

​```
Weekly signups declining (200 → 350 target)
├── Traffic volume declining (fewer people arriving)
│   ├── Paid traffic: ad targeting change reduced volume/quality
│   ├── Organic traffic: SEO impact from homepage redesign
│   └── Referral/direct: brand or word-of-mouth decline
├── Conversion rate declining (same traffic, fewer signups)
│   ├── Homepage redesign reduced clarity/trust
│   ├── Signup flow friction increased
│   └── Value proposition no longer resonates
└── Measurement change (signups happening but not counted)
    ├── Tracking code broken on new homepage
    └── Attribution model changed
​```

### MECE Check

- Mutually Exclusive: Traffic volume vs. conversion rate vs. measurement are independent
- Collectively Exhaustive: All signup decline must come from fewer visitors, lower conversion, or miscounting

### External Factor Scan

| Factor | Finding | Status |
|--------|---------|--------|
| Competitor launch | Searched "[competitor] launch 2026 Q1" — no launches found | Ruled Out |
| Market/seasonal shift | Searched "SaaS signup trends Q1 2026" — no industry-wide decline reported | Ruled Out |
| Platform/algorithm change | Searched "Google algorithm update Feb 2026" — no major update in period | Ruled Out |
| Regulatory/policy change | No relevant changes found | Ruled Out |
| Technology change | No relevant changes found | Ruled Out |
| Macro-economic conditions | Searched "SaaS spending Q1 2026" — stable | Ruled Out |

## Phase 2: Hypotheses (Ranked by Testability)

### 1. Tracking broken — Priority: HIGH
**If** the homepage redesign broke tracking, **then** GA4 shows a drop while DB signups remain stable, **because** the new template may not include the tracking script.
- **Deciding data:** GA4 signups vs DB signups, 8-week comparison
- **Source:** GA4 Events + Production DB
- **Owner:** Engineering
- **Confirming:** GA4 shows 200/week, DB shows 350/week (mismatch)
- **Rejecting:** GA4 and DB both show 200/week (match — tracking is fine)
- **Potential gap explained:** ~100% if true

### 2. Ad targeting reduced quality — Priority: HIGH
**If** the targeting change brought low-intent visitors, **then** paid conversion dropped while organic held steady, **because** broader targeting reaches people outside the ICP.
- **Deciding data:** Paid vs organic conversion rate, before/after
- **Source:** GA4 → Acquisition → Traffic source → Conversion
- **Owner:** Marketing (paid)
- **Confirming:** Paid conversion drops significantly while organic stable
- **Rejecting:** Both paid and organic drop equally (different cause)
- **Potential gap explained:** ~50%

### 3. Homepage reduced conversion — Priority: MEDIUM
**If** the new homepage is less clear, **then** all-source conversion dropped equally, **because** the design lacks social proof.
- **Deciding data:** Bounce rate by source, before/after
- **Source:** GA4 → Pages → Homepage → Bounce rate
- **Owner:** Product/Design
- **Confirming:** Bounce rate rises across all sources
- **Rejecting:** Bounce rate stable across sources (homepage is not the issue)
- **Potential gap explained:** ~40%

## Phase 3: Root Cause Verdict

### Verdict Table

| # | Hypothesis | Verdict | Evidence | Gap |
|---|-----------|---------|----------|-----|
| 1 | Tracking broken | Rejected | GA4 and DB both show 200/week. Tracking is correct. | 0% |
| 2 | Ad targeting reduced quality | Confirmed | Paid conversion dropped 66% (3.5% → 1.2%). Organic stable at 4.1%. | ~55% |
| 3 | Homepage reduced conversion | Confirmed | Bounce rate up 17pts across ALL sources. | ~35% |

### Root Cause Statement

**Root Cause 1 (~55% of gap):** Ad targeting change brought low-intent visitors, evidenced by paid conversion dropping 66% while organic held steady. The broader targeting reaches people outside the ICP.

**Root Cause 2 (~35% of gap):** Homepage redesign reduced trust/clarity, evidenced by bounce rate rising 17 points across all traffic sources. The new page likely lacks the social proof or clear value prop of the old design.

**Unexplained (~10%):** Minor variance, possibly seasonal. No action needed.

## Next Step

Run `prioritize` targeting:
1. Ad targeting — restore old targeting + add converters lookalike
2. Homepage — restore trust signals and clarify value proposition
```

---

## Post-write side effects

1. **Goals write-back** per `procedures/pre-dispatch.md` Write-back map:
   - `experience/goals.md`: append `Goals — diagnostic metric: Weekly signups` + `Goals — baseline: 200/week (May 2026)` + `Goals — target: 350/week`.
   - Q4 (Tried — "rolled back some ad creative changes, no impact") NOT persisted; lives in diagnose.md snapshot only per original SKILL.md.
2. **Prior artifact rename:** none this run (version 1).

---

## What this example demonstrates

- Cold Start always fires (even though "signups declining" sounded clear, the orchestrator extracted the metric / current / target / tried triplet via the 4 questions).
- Tree-builder includes the Measurement branch even though the user didn't mention tracking — Critic Gate 4 enforces MECE, and Measurement is a common missing branch.
- External-factor scan ran even though the user pre-identified internal causes — Critical Gate 2 demands it; in this case all 6 factors Ruled Out, but the scan was visible compliance.
- Hypothesis ranking puts the fast + high-explanation Tracking hypothesis first — testing it took 1 hour and ruled it out cleanly, letting the remaining two hypotheses get focused attention.
- The Data Gathering Pause is interactive — the orchestrator paused and waited for user data; verdicts that would have come without the Pause would have been speculation.
- Gap percentages sum to exactly 100% (55 + 35 + 10) — Critic Gate 10 passes; downstream prioritize gets a complete picture.
- Goals write-back includes only Q1-Q3 — Q4 (Tried) is diagnostic-specific and lives in the snapshot artifact only.

---

## What this example deliberately doesn't show

- **Route A (Quick Diagnosis):** see `procedures/dispatch-mechanics.md`. The flow is: skip tree-builder + external-check, hypothesis-agent runs on a single user-named hypothesis, data-mapper + Data Gathering Pause + verdict + critic identical.
- **Critic FAIL loop:** see `procedures/dispatch-mechanics.md` Critic Gate section. Max 2 cycles, then ship `done_with_concerns` with Known Issues section.
- **Inconclusive verdict:** if hypothesis 1 had landed Inconclusive instead of Rejected (e.g., GA4 unavailable), the Inconclusive Handling rule would have determined whether to resolve before proceeding. >50% gap explained = must resolve; this hypothesis at ~100% gap-if-true would have been "must resolve" — BLOCKED status with data request.
- **3-strikes escalation:** if all 3 hypotheses had Rejected with no Confirmed/Inconclusive, the verdict-agent would have escalated ("cannot be determined; recommend reframing"). Forcing a root cause from weak evidence is a critic-FAIL trigger.
- **External factors Confirmed:** if competitor launch had landed Confirmed, an "External Factors" branch would have been added to the tree at Layer 1 merge, and a 4th hypothesis would have been generated for the external cause.
