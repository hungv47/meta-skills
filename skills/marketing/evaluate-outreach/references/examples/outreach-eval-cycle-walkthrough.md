---
title: Outreach Eval — End-to-End Cycle Walkthrough (email / founders, deliverability-gated watch)
lifecycle: canonical
status: stable
produced_by: evaluate-outreach
load_class: EXAMPLE
---

# Outreach Eval — End-to-End Cycle Walkthrough

**Load when:** an operator (human or agent) wants a complete trace of one evaluate-outreach
cycle — Pre-Dispatch hard-blocks → Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2
(Recommendation) → Layer 3 (Critic) → side effects. This run shows the case the skill exists
for: **reply quality looks fine, but the deliverability/compliance gate caps the verdict at
`watch`.** A reply-winning sequence that is burning the sending domain does NOT earn `keep`
(Critic Hard Fail #12). All numbers are synthetic-but-plausible and **illustrative only.**

Brand context where it surfaces (the rendered review surface): FORSVN Forest Shadow `#0A120D`
background, Leaf `#74B36B` accent on the "ready"/keep cue — never Signal Lime.

---

## Scenario

- **Loop:** `forsvn-cold-email-2026q2` (an existing eval loop — `program.md` + `context.md` present).
- **Channel + segment:** `email` · founders-at-seed-to-A-dev-tools (one channel, one segment — Gate 4).
- **Source sequence:** `docs/forsvn/artifacts/marketing/write-outreach/email-2026-05-18-founders-close-loop.md` (a 3-step sequence that actually shipped).
- **Window:** 2026-05-20 → 2026-06-03 (14 days), 1,180 sends.
- **Primary metric:** positive-reply rate. Baseline (prior cycle, same channel+segment): 0.7%.
- **Reply tool:** Smartlead (reply categories + bounce + spam-complaint). Meetings: HubSpot CRM.
- **Operator invocation:** `/evaluate-outreach forsvn-cold-email-2026q2 "email / founders" positive-reply-rate`

---

## Step 0 — Pre-Dispatch (hard-blocks first, then warm-start)

Hard-blocks checked BEFORE Cold Start (SKILL.md "Pre-Dispatch"):

1. `program.md` + `context.md` present → not `NEEDS_CONTEXT`.
2. Sequence shipped + reply data exists → not a draft, so not routed to `write-outreach`.
3. Source write-outreach artifact readable → not `BLOCKED`.
4. Channel+segment tag supplied (`email / founders`) → not `BLOCKED`.
5. Deliverability/compliance evidence supplied (bounce, spam-complaint, opt-out) → not `BLOCKED`.

Warm-start read-order log:

```
Read: program.md (primary metric = positive-reply rate; guardrail = bounce < 3%, spam < 0.1%)
Read: context.md (ICP = seed→A dev-tools founders; offer = close-loop audit)
Read: results.tsv (last cycle = 1 → this cycle = 2)
Read: write-outreach/email-2026-05-18-founders-close-loop.md (3-step sequence + hypothesis)
Operator-supplied: Smartlead export + HubSpot meetings + opt-out log
```

Cycle number resolves to **2** (`last results.tsv cycle + 1`).

---

## Step 1 — Layer 1 (Metric Ingest + Diagnosis IN PARALLEL)

Orchestrator spawns both Layer-1 agents in one message; Diagnosis reads Metric Ingest's
normalized output.

**Metric Ingest returns** (normalized, every reply category broken out — never a blended count):

```
channel_segment: email / founders
primary_metric: positive-reply rate = 1.1%  (baseline 0.7%)
sends: 1,180  | window: 2026-05-20→2026-06-03 (14d)
replies (Smartlead):
  positive: 13 (1.1%)  | meeting-booked: 6 (0.5%)  | qualified-lead: 4 (0.3%)
  neutral: 9  | negative: 5  | auto-reply: 22  | opt-out/unsubscribe: 14 (1.2%)
deliverability:
  bounce rate: 6.4%  (guardrail < 3%)   <-- RED FLAG
  spam-complaint rate: 0.34% (guardrail < 0.1%)  <-- RED FLAG
  sender reputation: degrading (Google Postmaster "Medium", was "High")
compliance: opt-out honored within 24h = yes; CAN-SPAM footer present = yes
caveats: list purchased 2026-05-15 (cold, low-freshness); single sender domain, mid-warmup
```

**Diagnosis returns** (connects metrics to the sequence hypothesis):

- Reply-quality read: 6 meetings + 4 qualified from 1,180 sends is a genuine lift over baseline —
  the step-1 opener (names the prospect's recent fundraise) is doing real work.
- Deliverability read: 6.4% bounce + 0.34% spam + reputation slipping to "Medium" = the **purchased
  list** is poisoning the domain. The replies are real but the cost is a burning sender.
- Cross-channel context: a parallel LinkedIn-DM test ran the same offer (0.9% positive-reply) —
  CONTEXT ONLY, not a verdict input (Gate 4).
- Confounder: single sender domain still in warmup; bounce is partly warmup but 6.4% is far past
  any warmup-explainable band.

---

## Step 2 — Layer 2 (Recommendation)

Recommendation consumes Layer 1, applies the Decision Rules + the deliverability/compliance gate:

- Reply quality alone would support `keep` (positive-reply 1.1% vs 0.7%, 6 meetings).
- **But** bounce 6.4% (> 3% guardrail) + spam 0.34% (> 0.1% guardrail) + reputation degrading is a
  deliverability red flag → the gate **caps the verdict at `watch`** (cannot be `keep` — Hard Fail #12).
- Routing: the defect is the **list**, not the copy. Route next work to `research-icp` (replace the
  purchased list with a verified, opted-in source), NOT to `write-outreach` (the opener is working).
- Confidence: **medium** — strong reply signal, but the list confounder + mid-warmup domain mean the
  positive-reply lift is not yet cleanly attributable to the sequence.

---

## Step 3 — The PRODUCED eval artifact (written in full)

Saved to `.forsvn/loops/forsvn-cold-email-2026q2/evals/2026-06-03-cycle-2.md`:

```markdown
---
skill: evaluate-outreach
version: 1
date: 2026-06-03
status: done_with_concerns
summary: "email-founders cycle 2 outreach evaluation"
purpose: "Post-send reply-quality + deliverability snapshot for an outreach eval loop, scoped to one channel + segment"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current outreach cycle"
do_not_use_when: "Authoring next-cycle sequence copy without reading the latest loop context and results"
upstream: ".forsvn/loops/forsvn-cold-email-2026q2/program.md, context.md, docs/forsvn/artifacts/marketing/write-outreach/email-2026-05-18-founders-close-loop.md, reply-data source"
downstream: "results.tsv, learnings.md, write-outreach next-cycle sequence"
provenance:
  skill: evaluate-outreach
  run_date: 2026-06-03
  input_artifacts:
    - docs/forsvn/artifacts/marketing/write-outreach/email-2026-05-18-founders-close-loop.md
    - research/icp-research.md
    - brand/BRAND.md
  output_eval: null
---

# [Email-Founders] Cycle 2 Evaluation

## Verdict

- Status: watch
- Confidence: medium
- Channel / Segment: email · founders (seed→A dev-tools)
- Primary metric: positive-reply rate = 1.1% vs 0.7%
- Decision: email / founders — replies improved (6 meetings, 4 qualified) but bounce 6.4% + spam 0.34% are burning the domain, so hold at watch and fix the list before scaling.

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| positive-reply rate | 1.1% | 0.7% | 2026-05-20→06-03 (14d, 1,180 sends) | Smartlead | list purchased 05-15 (cold) |
| positive-reply rate (raw) | 13 | 8 | same | Smartlead | — |
| meetings booked | 6 (0.5%) | 4 | same | HubSpot CRM | 1 from a known warm intro — slight skew |
| qualified leads | 4 (0.3%) | 3 | same | HubSpot CRM | operator-tagged |
| bounce rate | 6.4% | 2.1% | same | Smartlead | guardrail < 3% — RED FLAG |
| spam-complaint rate | 0.34% | 0.06% | same | Smartlead | guardrail < 0.1% — RED FLAG |
| opt-out / unsubscribe | 1.2% (14) | 0.9% | same | Smartlead | all honored within 24h |
| sends | 1,180 | 1,050 | same | Smartlead | single sender domain, mid-warmup |

## What Changed This Cycle

- Source write-outreach artifact: `docs/forsvn/artifacts/marketing/write-outreach/email-2026-05-18-founders-close-loop.md`
- Subject/opener/value-prop/CTA/step delta from prior cycle: opener rewritten to name the
  prospect's recent fundraise (was a generic "saw your launch"); CTA unchanged (1-line interest
  question); step 3 break-up email added. List source switched from the prior warm referral list
  to a purchased list — the change that drove both the reply lift AND the deliverability collapse.

## Diagnosis

### Reply-Quality Signals

- meaningful_replies: 23 absolute (positive 13 + meeting-booked 6 + qualified 4) = 1.9% of sent
- vanity_signals: open rate ~41%, auto-replies 22, raw reply count 53 — not counted toward the verdict
- meaningful_to_vanity_read: strong — the verdict rests on 6 booked meetings, not opens
- objection_patterns: 3 replies cited "we already built this in-house" — a positioning signal for
  write-outreach, not a deliverability issue

### Deliverability & Compliance

- bounce_read: red-flag — 6.4% is > 2x the 3% guardrail; the purchased list is full of stale addresses
- spam_signal: red-flag — 0.34% is > 3x the 0.1% guardrail; recipients are marking cold sends as spam
- compliance_read: compliant — opt-outs honored within 24h, CAN-SPAM footer present, no GDPR breach
- domain_risk: YES — this sequence is actively degrading sender reputation (Postmaster High→Medium).
  Scaling it would risk blacklisting the sending domain. This is why the verdict cannot be keep.

### Cross-Channel Context

- linkedin-dm (same offer, parallel test): 0.9% positive-reply — CONTEXT ONLY, not a verdict input.

### Confounders

- Purchased list (cold, low-freshness) confounds both the reply lift and the bounce spike.
- Single sender domain still in warmup — inflates bounce somewhat, but not to 6.4%.
- One of the 6 meetings traces to a known warm intro, slightly skewing the meeting count.

## Next Cycle Recommendation

- Keep: the fundraise-naming opener (it earned the meeting lift — preserve it verbatim).
- Discard: the purchased list — it is the root cause of the deliverability red flag.
- Watch: positive-reply rate on the SAME opener once a clean list is in place (isolate the variable).
- Route next work to: research-icp (verified, opted-in founder list) — NOT write-outreach (copy is fine).

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
2	2026-06-03	evals/2026-06-03-cycle-2.md	positive-reply rate	1.1%	0.7%	watch	email / founders — 1.1% positive-reply, 6 meetings, but bounce 6.4% + spam 0.34% burning domain; fix list via research-icp before scaling
```

## Learning Promotion

- Promote to `learnings.md`: no
- Lesson: (not promoted — confidence is medium and status is watch, not keep/discard; Critic Hard
  Fail #9 forbids promoting a non-high-confidence/non-keep lesson)
- Expiry / caveat: re-evaluate after the list is replaced; if positive-reply holds on a clean list,
  the fundraise-naming opener becomes a promotable lesson next cycle
```

---

## Step 4 — Layer 3 (Critic verdict — PASS)

Critic scores the 7-dim rubric (5 shared + 2 outreach-specific). Pass gate (shared rubric §2):
aggregate ≥ 49/70 AND every per-dim ≥ 6.

```
- loop_fit: 9 — program.md + context.md + results.tsv read; cycle 2 scoped to email / founders; no drift
- metric_integrity: 9 — positive-reply rate + baseline + window + 1,180 sends; full categorized reply breakdown
- attribution_honesty: 8 — sends stated; purchased-list + warmup + warm-intro-skew confounders all named; confidence medium (calibrated)
- decision_discipline: 9 — verdict respects the deliverability gate (watch, not keep); routing to research-icp (list fix), not write-outreach
- reply_quality_discrimination: 9 — meaningful-vs-vanity read computed; verdict rests on 6 meetings, opens excluded
- deliverability_and_compliance: 9 — bounce 6.4% + spam 0.34% thresholded against guardrails, named as red flags, capped the verdict; opt-out honored
- ledger_correctness: 10 — one row via append-loop-result.ts; 8 columns; status=watch; description carries "email / founders"
```

**Aggregate: 63/70. Every per-dim ≥ 6. Domain gate (Deliverability & Compliance) checked: the red
flag correctly blocked `keep` (Hard Fail #12 NOT triggered because the verdict is `watch`, not `keep`).
Verdict: PASS.** This is the point of the skill — strong replies did not buy a `keep` while the
domain was burning.

---

## Step 5 — Side effects (executed in order, critic PASS)

1. Write eval artifact at `.forsvn/loops/forsvn-cold-email-2026q2/evals/2026-06-03-cycle-2.md`.
2. Append exactly one ledger row:

```bash
bun scripts/append-loop-result.ts "forsvn-cold-email-2026q2" \
  --artifact evals/2026-06-03-cycle-2.md \
  --metric "positive-reply rate" --value "1.1%" --baseline "0.7%" \
  --status "watch" \
  --description "email / founders — 1.1% positive-reply, 6 meetings, but bounce 6.4% + spam 0.34% burning domain; fix list via research-icp before scaling"
```

3. learnings.md: **no update** (watch + medium confidence fails the promotion gate).
4. `bun scripts/manifest-sync.ts`.

**Completion Status: DONE_WITH_CONCERNS** — artifact + row written, critic PASS, but confidence is
medium and the deliverability red flag is material (the loop must not scale this sequence until the
list is fixed).

---

## FAIL → fix variant (the Hard Fail #12 trap)

Suppose Recommendation had instead proposed **`keep`** ("1.1% positive-reply beats baseline, 6
meetings booked — keep and scale"), treating bounce 6.4% as "a bit high but fine."

Critic cycle 1:

```
- deliverability_and_compliance: 2 — a keep rests on strong replies while bounce 6.4% + spam 0.34% are red flags (domain-burning). Hard Fail #12.
```

A single per-dim < 6 is a FAIL regardless of aggregate (shared rubric §2, the < 6 asymmetry); the
Hard Fail forces FAIL outright. **Revise once:** Recommendation re-scopes the verdict to `watch`,
moves the deliverability red flag into the gate, and routes the list fix to `research-icp`. Critic
cycle 2 re-scores → PASS (the Step-4 scorecard). If it had still failed after the one revision, the
orchestrator writes **no ledger row** and returns `BLOCKED` (all side effects are all-or-nothing).

If the operator insisted on shipping `keep` despite the FAIL, the override is logged BEFORE any
write (`bun scripts/log-critic-override.ts --skill evaluate-outreach …`) — and even then an override
**never** promotes the cycle to `keep` and never relaxes the deliverability/compliance gate; a
no-override FAIL still returns `BLOCKED`.
