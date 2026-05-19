# Anti-Patterns — diagnose

> 13 named anti-patterns that kill diagnostic validity. Each includes detection, why it fails, the fix, and the agent responsible for catching it (verified against `agents/critic-agent.md` Failure Routing table). Critic-load reference — re-read before any output ships.

---

## 1. Too-Shallow Tree

**What it is:** Stopping at one level produces branches that are categories, not testable causes.

**Detection:**
- Tree has only 1 level (root → branches, no leaves).
- Each "leaf" is a category like "Acquisition" or "Activation" rather than a mechanism.
- You couldn't look up any leaf in a specific data source.

**Why it fails:** Categories aren't testable; they're labels. data-mapper-agent has nothing to map; verdict-agent has nothing to verdict.

**Fix:** Always decompose to at least 2 levels (Critic Gate 2). The leaf should be something you can look up in a specific data source — e.g., "checkout page load time exceeds 5s on mobile" not "performance issues."

**Owned by:** tree-builder-agent (generation) + critic-agent (Gate 2 catch).

---

## 2. Overlapping Branches

**What it is:** Fixing Branch A would automatically fix Branch B — the tree is not mutually exclusive.

**Detection:**
- "If I fix A, does B still exist?" test fails.
- Two branches describe the same root mechanism in different words.

**Why it fails:** Hypothesis effort gets duplicated; gap percentages double-count.

**Fix:** Restructure until each branch is independently testable. The Watanabe framework (`references/watanabe-framework.md`) has examples of common overlap patterns.

**Owned by:** tree-builder-agent + critic-agent (Gate 4 catch — MECE).

---

## 3. Restatements as Causes

**What it is:** "Conversion is low because conversion dropped" restates the problem instead of naming a mechanism.

**Detection:**
- Leaf phrasing tautological — restates the metric in slightly different words.
- The leaf doesn't answer "what specifically changed and why?"

**Why it fails:** Restatements are unfalsifiable — there's no mechanism to test.

**Bad example:**
> Leaf 2b: "Conversion rate is low"

**Good example:**
> Leaf 2b: "Checkout page load time exceeds 5s on mobile per Lighthouse audit; users abandon at the payment step"

**Fix:** Every leaf must name a mechanism — what specifically changed and why. Critic Gate 3 enforces.

**Owned by:** tree-builder-agent + critic-agent (Gate 3 catch).

---

## 4. Missing Measurement Branch

**What it is:** Most trees cover demand-side and supply-side but forget instrumentation errors.

**Detection:**
- No "measurement" or "tracking" branch in the tree.
- All branches assume the metric itself is accurately measured.

**Why it fails:** When the metric is broken (pixel fired wrong, tracking code regressed, attribution model changed), 100% of the gap is explained by the measurement issue — but the tree never even checks. Teams spend weeks "fixing" a non-existent business problem.

**Fix:** Always include a "measurement/tracking" branch as one of the top-level branches. It's the fastest to test and explains 100% of the gap when true.

**Owned by:** tree-builder-agent + critic-agent (Gate 4 catch — MECE: missing branch is a gap).

---

## 5. Single Tree Type for Everything

**What it is:** Using a Math tree when the metric doesn't decompose by formula, or an Issue tree when a Math tree would be cleaner.

**Detection:**
- Tree type is "Math" but the metric isn't formulaic (e.g., "team morale" decomposed by formula).
- Tree type is "Issue" but the metric has a clean formula (e.g., MRR = customers × ARPU, both formulaic).

**Why it fails:** Wrong tree type produces awkward branches that obscure the real causes.

**Fix:** Match tree type to problem shape per `references/watanabe-framework.md`. If the metric has a formula, use a math tree (decompose each factor). If multi-factor without a formula, use an issue tree. If binary cause path, use yes-no.

**Owned by:** tree-builder-agent (choose tree type at dispatch entry).

---

## 6. Unfalsifiable Hypotheses

**What it is:** "If onboarding is bad, then users churn" — "bad" has no measurable threshold; "users churn" has no specific metric.

**Detection:**
- "then" clause lacks a specific metric or direction.
- "if" clause uses qualitative language ("bad", "poor", "weak") without quantitative threshold.
- You can't define what "wrong" looks like.

**Why it fails:** Unfalsifiable hypotheses can't be rejected — they're always "kind of true" depending on interpretation.

**Bad example:**
> If onboarding is bad, then users churn, because they don't see value.

**Good example:**
> If onboarding completion rate stays below 40%, then trial-to-paid stays below 3%, because users haven't reached the activation moment that justifies the price.

**Fix:** Every "then" clause must name a specific metric and direction (Critic Gate 6). Every hypothesis must define what rejection looks like.

**Owned by:** hypothesis-agent + critic-agent (Gates 5 + 6 catch).

---

## 7. Testing Everything at Once

**What it is:** Running 5 tests simultaneously makes it impossible to attribute results.

**Detection:**
- Hypotheses listed without ranking.
- Data Gathering Pause attempts to gather data for all hypotheses in one batch.

**Why it fails:** When multiple changes ship simultaneously, attribution is destroyed. Even if the metric moves, you don't know which hypothesis was right.

**Fix:** Rank by testability (speed-to-data × potential-gap-explained) per Critic Gate 8. Test sequentially — fast eliminations narrow the field for the harder tests.

**Owned by:** hypothesis-agent + critic-agent (Gate 8 catch).

---

## 8. Confirmation Bias in Evidence Selection

**What it is:** Choosing only data sources likely to confirm the hypothesis.

**Detection:**
- The "Source" field only lists sources where the hypothesis would look true.
- "Confirming" and "Rejecting" criteria are asymmetric (one is rigorous, the other is "if not, then maybe").

**Why it fails:** You'll always Confirm; no learning happens.

**Fix:** Every hypothesis must define both Confirming AND Rejecting evidence BEFORE gathering data. data-mapper-agent enforces both sub-fields in the data map.

**Owned by:** data-mapper-agent + hypothesis-agent + critic-agent (flagged in Observations as "no unfalsifiable hypotheses" — per the Additional Checks list in `agents/critic-agent.md`).

---

## 9. Premature Verdicts

**What it is:** Declaring "Confirmed" after seeing one data point that loosely supports the hypothesis.

**Detection:**
- Verdict column says Confirmed; Evidence column says "seems likely" or cites a single weak data point.
- Multiple plausible interpretations of the same evidence; verdict picks the one matching the hypothesis.

**Why it fails:** False positives compound — downstream prioritize generates initiatives against a wrong root cause; funnel-planner sets targets that won't move because the cause is misidentified.

**Bad example:**
> Verdict: Confirmed. Evidence: "Bounce rate dropped after homepage change."

**Good example:**
> Verdict: Confirmed. Evidence: "Wayback Machine shows old homepage had 3 customer logos + testimonial in hero section; new homepage has none. Heatmap data shows new-homepage users scrolling 2.3x more before clicking signup CTA, consistent with trust-rebuilding behavior. Bounce rate dropped from 52% to 40% within 7 days of trust signal restoration on the A/B variant."

**Fix:** Every verdict requires evidence that specifically matches or contradicts the "then" clause (Critic Gate 9). "Seems likely" is not Confirmed; Inconclusive is a valid verdict.

**Owned by:** verdict-agent + critic-agent (Gate 9 catch).

---

## 10. Confusing Correlation with Causation

**What it is:** "Signups dropped when we changed the homepage, so the homepage caused it."

**Detection:**
- Verdict cites timeline coincidence as proof of mechanism.
- The "because" clause from Phase 2 is not referenced in the verdict reasoning.

**Why it fails:** Correlation identifies candidates; causation requires mechanism. Many things change at the same time; not all are causal.

**Fix:** Check whether the "because" clause explains the data. Look for an A/B-like comparison (segments unaffected by the change should not show the same drop). Run external-check-agent to rule out coincident external factors.

**Owned by:** verdict-agent + critic-agent (flagged in Observations as "correlation-as-causation").

---

## 11. Skipping the "Because" Clause

**What it is:** Omitting the mechanism explanation in the hypothesis.

**Detection:**
- Hypothesis reads "If X, then Y" with no "because" clause.
- Mechanism is implicit and undocumented.

**Why it fails:** When the hypothesis is rejected, you have no idea why — what specifically didn't hold. Without the "because", you can't learn from negative results.

**Fix:** All three clauses required (Critic Gate 5). The "because" explains why the cause produces the effect.

**Owned by:** hypothesis-agent + critic-agent (Gate 5 catch).

---

## 12. Ignoring Inconclusive Results

**What it is:** Marking ambiguous evidence as "Rejected" to simplify the analysis.

**Detection:**
- Three hypotheses Rejected, none Confirmed, none Inconclusive.
- Root cause statement forced from weak evidence rather than declaring "cannot be determined."

**Why it fails:** Skipping Inconclusive hides the data gap. Downstream prioritize generates initiatives against a manufactured root cause; teams ship work that won't move the metric.

**Fix:** Inconclusive is a valid verdict. It means more data is needed. Specify what data, from where, owned by whom. The Inconclusive Handling rule in `procedures/dispatch-mechanics.md` determines whether the analysis can proceed.

The 3-strikes escalation rule (in `agents/critic-agent.md` Additional Checks) catches this: if 3+ hypotheses are Rejected with none Confirmed or Inconclusive, the verdict-agent MUST escalate — state "cannot be determined", recommend reframing or new data. Otherwise critic-FAIL with re-dispatch to verdict-agent.

**Owned by:** verdict-agent + critic-agent (3-strikes escalation check).

---

## 13. Gap Percentages That Don't Add Up

**What it is:** Root causes explain 140% of the gap (double-counting) or only 30% (missing causes).

**Detection:**
- Sum of Root Cause percentages + Unexplained percentage ≠ ~100%.
- Two root causes with overlapping mechanisms double-counting the same effect.

**Why it fails:** 140% means causes are overlapping (MECE violation); 30% means the analysis is incomplete (missing causes — downstream prioritize will rank initiatives against an incomplete picture).

**Fix:** Percentages should roughly sum to 100%. Re-check for overlapping branches (back to Critic Gate 4) or missed causes (back to Critic Gate 4). The Unexplained line is mandatory — even 0% gets written as `**Unexplained (~0%):** All identified causes confirmed against the gap.`

**Owned by:** verdict-agent + critic-agent (Gate 10 catch).

---

## Cross-stack contract drift (not in numbered list — operator review responsibility)

The Phase 1 (Problem Statement + Logic Tree code-fence + MECE Check + 6-row External Factor Scan) + Phase 2 hypothesis format (6 sub-fields per hypothesis) + Phase 3 Verdict Table column schema (`# | Hypothesis | Verdict | Evidence | Gap`) + Root Cause Statement format + Next Step block are cross-stack contracts consumed by prioritize (root cause statement feeds Initiative hypothesis "because" clauses), funnel-planner (root cause baselines feed Target Table), and campaign-plan (root cause + Verdicts filter which initiatives need channel-level execution).

**Drift modes:**
- Renaming a column in the Verdict Table.
- Reordering Phases.
- Adding or removing the External Factor Scan rows.
- Changing the Logic Tree code-fence character set.
- Substituting "Confirmed/Rejected/Inconclusive" with other strings.

**Owned by:** operator review against `references/format-conventions.md` before shipping any schema change. The 10-point critic gate inspects content within the schema but does NOT inspect schema drift — that's an operator-level integration check. If schema-drift catching matters more, that's a v6.3.0 enhancement to add an 11th gate.

---

## Goals write-back skipped or partial

**What it is:** Q1-Q3 don't get appended to `experience/goals.md` after PASS, OR Q4 gets persisted by mistake.

**Detection:**
- Artifact ships PASS but `experience/goals.md` has no new entry.
- `experience/goals.md` has a "Tried:" entry (Q4 should NEVER persist — diagnostic-specific only).

**Why it fails:** No persistence means downstream prioritize and funnel-planner re-ask for the metric / baseline / target. Wrong persistence (Q4) pollutes experience with stale diagnostic detail.

**Fix:** Post-write side effect mandatory on PASS — append Q1 (Metric) + Q2 (Current) + Q3 (Target) to `experience/goals.md` per `procedures/pre-dispatch.md` Write-back map. Q4 (Tried) is NOT persisted — lives in diagnose.md snapshot only. The original SKILL.md is explicit about Q4 not persisting.

**Owned by:** Post-write side effects (in `procedures/dispatch-mechanics.md`). Note: the 10-point critic gate does NOT catch this — gates inspect the artifact body, not on-disk side-effect files. Operator-level integration check.
