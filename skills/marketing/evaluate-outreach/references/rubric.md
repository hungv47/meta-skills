---
type: rubric
schema_version: 1
last_verified: 2026-06-01
verifier: hungv47
revision_status: provisional v0.1
---

# Outreach-Eval Rubric (v0.1)

7-dimension rubric for post-send outreach evaluation. Used by `agents/critic-agent.md` to gate the cycle artifact before it writes a ledger row. **Provisional v0.1 — mandatory revision after cycles 2-3.**

**Pass gate, scoring scale, the < 6 asymmetry, PASS_WITH_CONCERNS, and the universal Hard Fails** are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) [PROCEDURE] § 1–§ 3. This file is the domain instrument — the 7 dimensions below (5 shared + 2 outreach-specific) with their domain-specialized band tables and the outreach-specific Hard Fails.

## Revision Triggers

The universal revision triggers and the mandatory-revision-after-cycles-2-3 rule are in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 5. Domain-specific triggers for the outreach-eval rubric:

- A channel changes what is measurable (a platform deprecates open tracking, or a regime changes the compliance bar).
- A new outreach channel enters the loop with a different deliverability model.

---

## 1. Loop Fit (0-10)

Does the artifact write inside an existing loop AND evaluate the loop's surface AND the cycle's declared channel + segment?

| Band | Description |
|------|-------------|
| 9-10 | `.forsvn/loops/[slug]/program.md` + `context.md` present and read; cycle scoped to the loop's primary metric and the operator-declared channel + segment; cycle number resolves from `last results.tsv cycle + 1`; no scope drift |
| 7-8 | Loop present and scope clean; cycle number correct; minor read-order skip but no contamination |
| 5-6 | Loop present but read-order incomplete; cycle scoped correctly but channel/segment validation implicit |
| 3-4 | Loop missing context.md OR scope drifted to an adjacent channel; channel+segment tag absent |
| 0-2 | No existing loop OR cycle writes to wrong loop directory OR the channel/segment contradicts program.md scope |

**Auto-fail conditions:**

- No `.forsvn/loops/[slug]/program.md` (Critic Hard Fail #1)
- No channel+segment tag (Critic Hard Fail #4)

---

## 2. Metric Integrity (0-10)

Is the primary metric, value, baseline, window, source, sends, reply breakdown, and unit-comparability explicit and falsifiable?

| Band | Description |
|------|-------------|
| 9-10 | Primary metric named with units; current + baseline in same units; window has start + end + N days; source named (outreach tool / CRM / operator-supplied); sends stated; replies reported as the categorized breakdown (positive / meeting / qualified / neutral / negative / auto / opt-out) |
| 7-8 | All primary fields present; one secondary field implicit |
| 5-6 | Primary metric + value + baseline present but window or source partial; unit comparability not explicit |
| 3-4 | Missing baseline OR window OR source — and the cycle still claimed `keep` |
| 0-2 | Fabricated values OR replies reported as a single blended count with no breakdown OR no source |

**Auto-fail conditions:**

- No current primary metric value, source, or window; OR the cycle scored a draft (Critic Hard Fail #2)
- Any fabricated number (Critic Hard Fail #6)

---

## 3. Attribution Honesty (0-10)

Are sample size (sends), comparability, guardrails, and confounders stated without overclaiming?

| Band | Description |
|------|-------------|
| 9-10 | Sends stated; baseline comparability explicit (same channel / same segment / comparable window); confounders enumerated (sender warmup, list freshness/source, seasonality, domain age, single-step vs multi-step attribution, a big-logo reply skewing the read); confidence matches evidence |
| 7-8 | Most caveats present; one material confounder missing; confidence well-calibrated |
| 5-6 | Caveats present but confidence inflated (claimed `high` on tiny sends) |
| 3-4 | Major gap unaddressed (warmup not flagged AND improvement claimed) OR confidence drastically inflated |
| 0-2 | Improvement claimed without any baseline comparability OR confidence `high` on an uncalibrated source |

**Auto-fail conditions:**

- Claimed improvement without baseline OR baseline from a different channel / segment (Critic Hard Fail #10)

---

## 4. Decision Discipline (0-10)

Does the keep/discard/watch/blocked verdict follow Recommendation's Decision Rules — driven by the reply-quality read + deliverability gate, not the diagnosis story?

| Band | Description |
|------|-------------|
| 9-10 | Verdict matches the reply-quality read + deliverability/compliance gate; routing is to the smallest correct next skill (write-outreach subject-only vs research-icp list fix) at the right granularity; decision sentence is one sentence with the channel + segment |
| 7-8 | Verdict matches; routing correct but slightly over-broad |
| 5-6 | Verdict matches but decision sentence multi-sentence or omits channel+segment; routing right domain, wrong specificity |
| 3-4 | Verdict drifts from the read (compelling reply quotes → `keep` despite a deliverability red flag) OR routing to a non-existent / inappropriate skill |
| 0-2 | Verdict invents data OR routing to "redo the whole outreach program" |

**Auto-fail conditions:**

- Status outside `{keep, discard, watch, blocked}` (Critic Hard Fail #7)

---

## 5. Reply-Quality Discrimination (0-10)

Was meaningful reply (positive / meeting-booked / qualified-lead) distinguished from vanity (opens / clicks / raw replies / auto-replies)? Was a vanity spike refused as success?

| Band | Description |
|------|-------------|
| 9-10 | Replies reported as the categorized breakdown; meaningful-vs-vanity read computed; the verdict rests on meaningful replies; a vanity-heavy result (high opens, zero meetings) was named as vanity and did not earn `keep`; reply sentiment, if cited, quotes actual replies |
| 7-8 | Breakdown present + read computed; verdict rests on meaningful replies; minor slip |
| 5-6 | Breakdown present but the meaningful-vs-vanity read is implicit; verdict happens to be right |
| 3-4 | Replies treated as one blended count; an open-rate spike read as partial success |
| 0-2 | A `keep` rests on a vanity spike (high opens / raw replies, zero meaningful) OR reply sentiment was fabricated |

**Auto-fail conditions:**

- `keep` resting on a vanity headline (Critic Hard Fail #11)
- Fabricated reply-sentiment claim (Critic Hard Fail #6)

---

## 6. Deliverability & Compliance (0-10)

Were bounce rate, spam-complaint rate, sender reputation, AND opt-out/CAN-SPAM/GDPR/ToS compliance assessed? Did a red flag block a keep?

| Band | Description |
|------|-------------|
| 9-10 | Bounce + spam-complaint rate + sender reputation stated against safe thresholds; compliance (opt-out honored, regime status) assessed; a deliverability or compliance red flag was named and capped the verdict at watch/discard; domain/account risk surfaced plainly |
| 7-8 | Both assessed; verdict respects the gate; one minor slip — a borderline bounce rate not explicitly thresholded but verdict correct |
| 5-6 | Deliverability OR compliance assessed but not both; the gate carried implicitly |
| 3-4 | Deliverability or compliance assessed only as "seems fine"; an elevated bounce / unhonored opt-out went unflagged |
| 0-2 | A `keep` rests on strong replies while bounce/spam was elevated OR opt-outs were not honored (domain-burning / non-compliant) |

**Auto-fail conditions:**

- `keep` despite a deliverability red flag or compliance violation (Critic Hard Fail #12)
- No deliverability/compliance evidence supplied (Critic Hard Fail #2 — missing required evidence)

---

## 7. Ledger Correctness (0-10)

Exactly one valid `results.tsv` row, schema-compliant, channel+segment tagged?

| Band | Description |
|------|-------------|
| 9-10 | Exactly one row appended via `append-loop-result.ts`; 8 columns; status ∈ `{keep, discard, watch, blocked}`; description one sentence with no tabs; description includes the channel + segment tag; artifact path relative to loop folder |
| 7-8 | One row appended; schema-compliant; description has the channel+segment but is slightly verbose |
| 5-6 | One row appended but description missing the channel+segment explicitly (implicit only) |
| 3-4 | Row schema drift (extra column, tab in description, status off-spec) |
| 0-2 | Multiple rows appended OR row appended despite critic FAIL OR row contains a fabricated value |

**Auto-fail conditions:**

- Ledger row status outside `keep | discard | watch | blocked` (Critic Hard Fail #7)
- Ledger description missing the channel+segment tag (Critic Hard Fail #8)
- Multiple rows appended for one cycle

---

## Falsifiability summary

A dim score is only valid if the evaluator can name **what evidence would have moved the score one band** — the discipline is canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 6. Per-dimension examples:

- Loop Fit 8 → 9: surface latest learnings.md in the read-order log.
- Metric Integrity 7 → 9: add the categorized reply breakdown.
- Attribution Honesty 6 → 8: flag the sender-warmup confounder explicitly.
- Decision Discipline 6 → 8: tighten routing from "rewrite the sequence" to "write-outreach subject-only revision".
- Reply-Quality 7 → 9: compute the meaningful-vs-vanity read and rest the verdict on meetings booked.
- Deliverability & Compliance 6 → 8: state the bounce rate against a safe threshold and confirm opt-out was honored.
- Ledger Correctness 8 → 10: include the channel + segment tag verbatim in the description.

If you can't name the next-band evidence, you're scoring vibes, not the rubric.

## Score justification format

For each per-dim score in the Critic Verdict, include 1 sentence of rationale tied to the artifact's actual content (the requirement + the "scoreless verdict = Hard Fail" rule are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 7). Example:

```
- loop_fit: 9 — program.md + context.md + results.tsv read; cycle scoped to email / founders-segment
- metric_integrity: 8 — positive-reply rate + baseline + window + 1,200 sends; reply breakdown present
- attribution_honesty: 8 — sends stated; list-freshness confounder named; warmup not surfaced
- decision_discipline: 9 — verdict matches reply-quality + deliverability gate; routing to write-outreach opener-only revision is narrow
- reply_quality_discrimination: 9 — meaningful-vs-vanity read computed; keep rests on 11 booked meetings, not opens
- deliverability_and_compliance: 8 — bounce 1.8% under threshold; opt-out honored; reputation healthy
- ledger_correctness: 10 — one row; description includes "email / founders"; 8 columns clean
```

Scoreless verdicts (PASS without per-dim breakdown) are themselves a Hard Fail signal — the rubric exists to make the verdict falsifiable.
