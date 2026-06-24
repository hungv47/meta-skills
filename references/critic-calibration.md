---
title: Critic Calibration — the calibrate-before-ship gate for the forsvn-slop LLM critic
lifecycle: canonical
status: stable
produced_by: meta-skills (FOR-55 / S6; consumed by forsvn-slop critic-agent.md, calibrate-critic.ts, the registry)
consumers: forsvn-slop/critic-agent.md, forsvn-slop/scripts/calibrate-critic.ts, forsvn-slop/registry/antipatterns.mjs, _dev/test-critic-calibration.ts
load_class: PLAYBOOK
---

# Critic Calibration

**The subjective tier of the FORSVN slop detector earns the right to speak per rule, not as a tier.** A
`tier:'llm'` antipattern rule fires through the critic ONLY after it clears a judge-variance bound on the
S6 golden corpus. An un-calibrated rule is gated OFF — never shipped advisory-with-low-confidence. This is
the operationalization of the program's deepest risk: detector authority is asymmetric, so the subjective
tier must never speak with the deterministic tier's certainty (slop-detector.md §2.1; decisions.md D-26).

---

## Why per-rule calibration

Marketing quality is partly subjective. A confident-but-wrong "this hook is weak" insults the writer and,
after two or three such calls, the operator mutes the detector forever. The deterministic scanner (S2) earns
authority with exit codes and a golden net; the critic (S6) cannot borrow that authority — it must prove,
rule by rule, that its judgment is *stable enough to trust*. A rule that flips between `advise` and `silent`
run-to-run, or that fires confidently on copy that's actually fine, is gated off until its prompt improves.

## The measurement

For each `tier:'llm'` rule, the calibration tool runs the critic **N = 8 times per golden fixture** at a
fixed temperature (1.0 — independent-sample run-to-run variation is the signal we measure), recording
`advise` or `silent` each run. From those runs, per rule:

- **per-fixture advise-rate** `p_i = (# advise runs) / N` for fixture *i*.
- **variance** `= mean over ALL fixtures of min(p_i, 1 − p_i)`. Range `[0, 0.5]`. A unanimous fixture (all 8
  runs agree) contributes 0; a 4/4 coin-flip contributes 0.5. This is genuine run-to-run instability.
- **margin** `= mean(p_i over should-advise fixtures) − mean(p_i over should-stay-silent fixtures)`. Range
  `[−1, 1]`. This is the rule's separating power: how much more often it advises on copy that genuinely
  exhibits the tell than on copy that only superficially resembles it.

## The ship rule

```
shippable = margin > 2 × variance   AND   margin ≥ 0.5
```

Both clauses are load-bearing, and together they catch both failure modes:

- A **unanimous-but-wrong** rule (false-advises on should-stay-silent fixtures) has low variance but also low
  margin → gated by `margin ≥ 0.5`.
- A **right-on-average-but-unstable** rule (flips run-to-run) has high variance → gated by `margin > 2 × variance`.

`shippable:true` → the rule's id goes in `CALIBRATED_LLM_IDS` (registry/antipatterns.mjs) → `r.calibrated = true`
→ the critic fires it. `shippable:false` → gated off.

## Corpus minimums

Each rule needs **≥5 should-advise + ≥5 should-stay-silent** golden fixtures, under
`tests/goldens/critic-llm/{should-advise,should-stay-silent}/<ruleId>/*.md`. The path encodes the expectation
(no per-fixture sidecar — matches the S2 should-flag/should-pass convention). Five per side gives an advise-rate
resolution of 0.2, finer than the 0.5 margin bound.

The should-stay-silent set MUST include the **false-positive guards**: a deliberate single aphorism, a real
measured stat WITH cohort scoping, a hook whose body genuinely delivers, real urgency backed by a date — and,
per rule, **at least one fixture that plants the tell inside a testimonial / blockquote** (filename contains
`testimonial` or `quote`). The critic excludes those spans before judging; the fixture pins that it does.

## The report (pinned artifact)

`calibrate-critic.ts` writes `tests/goldens/critic-llm/calibration-report.json` — checked in like
`tests/goldens/baselines.json`, compared by shape + thresholds, never byte-equality:

```json
{
  "schema": "critic-calibration/v1",
  "calibratedAt": null,
  "runs": 8,
  "temperature": 1.0,
  "rules": {
    "mkt-hook-no-pattern-interrupt": {
      "variance": 0, "margin": 0, "shippable": false,
      "fixtures": { "advise": 5, "silent": 5 }
    }
    // … one row per tier:'llm' rule
  }
}
```

`calibratedAt: null` + every `shippable:false` is the **ship-state default**: the critic is built and tested,
but the subjective tier is silent until the operator calibrates. (A real run stamps `calibratedAt` with a date
passed in via `--at`, since the tool cannot read the clock deterministically.)

## Operator workflow

Calibration makes real LLM calls, so it is **operator-run, never gate-wired**:

```bash
# 1. Measure (N=8 per fixture, all rules). Writes/updates the pinned report.
bun forsvn-slop/scripts/calibrate-critic.ts --at 2026-06-24

# 2. For each rule that came back shippable:true, add its id to CALIBRATED_LLM_IDS in
#    forsvn-slop/registry/antipatterns.mjs — in the SAME commit that re-pins the report.

# 3. The deterministic gate enforces agreement (zero LLM):
bun _dev/test-critic-calibration.ts
```

The gate test asserts: report schema, `margin > 2×variance && margin ≥ 0.5` for every `shippable:true` rule,
`CALIBRATED_LLM_IDS` (via `getCalibratedLlmRules()`) === the report's shippable set, and rule-count parity
(registry `tier:'llm'` == per-rule questions in `critic-agent.md` == golden rule-folders). So the report and
the registry can never silently drift.

## Re-calibration trigger

Re-run `calibrate-critic.ts` whenever:

- a rule's falsifiable question in `critic-agent.md` changes (a new prompt is a new rule, behaviorally), or
- the golden corpus grows for that rule (new fixtures shift the margin/variance), or
- the model used to run the critic changes.

A re-run is the calibration equivalent of `--rebaseline`: it re-pins the report deliberately. A rule that
was shippable can become un-shippable after a prompt edit — that's the gate working, not a regression to paper over.

## Operator-run live checks (not gate-wired)

Two stronger checks need LLM calls and live in `calibrate-critic.ts`, not the deterministic gate:

- **De-anchoring check** (`--check-anchoring`): run the critic K times with `deterministicFindings=[]` and K
  times with an adversarially-planted array that mislabels a clean hook as "weak"; the per-rule advise/silent
  distribution on the planted run must stay within the rule's calibrated variance of the empty run. Planting
  cannot shift the STEP-1 verdict beyond run-to-run noise — proof the de-anchoring fence holds.
- **Advisory live-check**: every finding the critic emits, parsed and run through `criticFinding()`, carries
  `advisory:true` — including a fixture that would carry the catalog `[block]`
  (`mkt-claim-hypothetical-as-measured`). The deterministic gate already pins this on `criticFinding()`; the
  live check confirms the prompt never tries to emit otherwise.

## Related refs

- [[anti-sycophancy]] — the verdict stance every per-rule call follows.
- [[thin-critic-rubric]] — PASS / REVISE / BLOCK; the banned conditional-pass pseudo-verdicts.
- [[evaluation-loop-rubric]] — §6 falsifiability: each advise/silent verdict needs named next-band evidence, not a vibe.
- [[marketing-antipatterns]] — the catalog the 10 `tier:'llm'` rules live in.
