<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

# Quality Dashboard Spec

> Lightweight cross-skill quality telemetry for critic gates, eval loops, operator overrides, and rubric calibration.

## Purpose

The quality dashboard answers four questions:

1. Which skills are failing critic gates most often?
2. Which dimensions repeatedly cause rewrites?
3. Which eval loops are producing keep/discard/watch signals?
4. Which rubrics are being overridden often enough to need revision?

It is intentionally small. It is not analytics infrastructure, and it does not replace loop-specific `results.tsv` ledgers.

## Location

```text
.agents/skill-artifacts/meta/records/quality-dashboard.json
```

Create the dashboard only when the Quality Feedback Protocol threshold is met:

- a second eval-loop result exists in the project;
- a critic override is logged;
- a fresh-eyes review finds a repeated rubric or post-humanize regression issue;
- the user asks for quality tracking.

## Schema

```json
{
  "schema_version": 1,
  "updated": "YYYY-MM-DD",
  "skills": {
    "skill-name": {
      "invocations": 12,
      "critic_pass": 8,
      "critic_fail": 3,
      "done_with_concerns": 1,
      "avg_rewrite_cycles": 0.7,
      "avg_rubric_score": "52/70",
      "dominant_fail_dimension": "claim substantiation",
      "last_updated": "YYYY-MM-DD"
    }
  },
  "loops": {
    "loop-slug": {
      "latest_cycle": 3,
      "latest_status": "keep",
      "primary_metric": "conversion_rate",
      "latest_value": "3.4%",
      "quality_risk": "low",
      "next_action": "Carry pricing proof pattern into cycle 4",
      "last_updated": "YYYY-MM-DD"
    }
  },
  "rubrics": {
    "skill-name:dimension": {
      "overrides": 2,
      "last_review": "YYYY-MM-DD",
      "action": "watch"
    }
  }
}
```

Allowed `quality_risk`: `low`, `medium`, `high`.

Allowed rubric `action`: `watch`, `revise`, `extract-shared-rubric`.

## Update Rules

### Skill Metrics

Update `skills[skill-name]` after:

- a critic PASS/FAIL;
- a `DONE_WITH_CONCERNS` delivery;
- a fresh-eyes finding about a skill's output quality;
- a post-humanize regression check that reverts or weakens an artifact.

Aggregate counts are cumulative. `avg_rewrite_cycles` and `avg_rubric_score` are recalculated from the new observation plus the existing aggregate. If the precise old sample count is unknown, keep the existing average and update only counts plus `dominant_fail_dimension`.

### Loop Metrics

Update `loops[loop-slug]` after a `results.tsv` row is appended or an evaluation artifact changes the loop decision.

The dashboard row is a compact pointer. The loop folder remains authoritative for evidence, confidence notes, artifacts, and ledger history.

### Rubric Metrics

Update `rubrics[skill-name:dimension]` when:

- the operator ships despite a critic FAIL;
- a fresh-eyes review finds a false positive or missed issue in the rubric;
- the same dimension causes repeated rewrite loops without improving real-world outcomes.

If a dimension has 3 valid operator overrides without a rubric revision, set `action: revise`. If the dimension appears across 3 or more skills with the same checks, set `action: extract-shared-rubric`.

## Helper

Use the helper instead of hand-editing when possible:

```bash
bun scripts/update-quality-dashboard.ts \
  --skill ad-copy \
  --invocations 1 \
  --critic-pass 1 \
  --critic-fail 0 \
  --done-with-concerns 0 \
  --rewrite-cycles 1 \
  --rubric-score 56/70 \
  --dominant-fail-dimension none
```

Loop update:

```bash
bun scripts/update-quality-dashboard.ts \
  --loop pricing-page \
  --latest-cycle 3 \
  --latest-status keep \
  --primary-metric conversion_rate \
  --latest-value 3.4% \
  --quality-risk low \
  --next-action "Carry proof placement into cycle 4"
```

Rubric override update:

```bash
bun scripts/update-quality-dashboard.ts \
  --rubric ad-copy:specificity \
  --overrides 1 \
  --action watch
```

## Non-Goals

- Do not store raw evaluator notes here.
- Do not duplicate `results.tsv`.
- Do not turn the dashboard into a project database.
- Do not promote dashboard observations directly into `.agents/experience/`; use the Quality Feedback Protocol promotion criteria first.
