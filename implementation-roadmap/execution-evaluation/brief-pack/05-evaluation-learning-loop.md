# Brief 05 — Evaluation and Learning Loop

## Goal

Make the stack improve from real-world results. A second run should be better because the system reads previous artifacts, eval data, and promoted learnings.

## Core Loop

1. Skill creates an artifact.
2. Artifact is used in the real world.
3. User or integration provides results.
4. Eval skill scores performance against the original hypothesis.
5. High-confidence findings are promoted to experience.
6. Quality metrics update the dashboard.
7. Future skills read the relevant learnings before dispatch.

Evaluation does not require full automation. Manual metric entry is acceptable and should be the default first version.

## Eval Skills

Add or refine:
- `evaluate-ad` — CTR, CPA, ROAS, frequency, fatigue
- `evaluate-content` — engagement, scroll, click-through, conversion, qualitative feedback
- `evaluate-campaign` — reach, leads, revenue, CAC, channel breakdown
- research artifact eval — downstream usefulness after repeated consumption

Each evaluator should read the source artifact and score against that artifact's stated hypothesis, not generic best practices.

## Rubrics

Move rubrics into references where possible.

Required:
- short-form eval rubric on disk
- ad eval rubric
- content eval rubric
- campaign eval rubric
- shared critic/rubric conventions

Rubric revision trigger:
- more than 3 consecutive scores within 1 point
- more than 3 operator overrides on the same dimension
- platform behavior changes what is measurable

## Quality Dashboard

Track per skill:
- date
- skill
- invocation count
- critic pass count
- critic fail count
- average rewrite cycles
- average rubric score

Keep it simple: TSV or JSON under the canonical state root.

## Critic Introspection

When an operator accepts work a critic rejected, log:
- skill
- run
- failed dimension
- operator reason if given
- timestamp

Repeated overrides mean the critic may be wrong. Flag the rubric for recalibration.

## Provenance

Every artifact should include provenance frontmatter:

```yaml
provenance:
  skill: write-copy
  run_date: 2026-05-19
  input_artifacts:
    - .forsvn/context/product.md
  output_eval:
    - .forsvn/evals/pricing-page/2026-06-01-cycle-1.md
```

This enables artifact → eval → learning → next run.

## Promotion to Experience

Promote findings only when:
- 3 consecutive `keep` ratings appear across separate cycles, or
- the user explicitly says the finding is reusable

Do not promote:
- any item marked `discard`
- unresolved `watch` items
- weak findings without source context

## Acceptance Checks

- Eval skills can run with manually entered metrics.
- Findings are tied back to source artifacts.
- Reusable findings show up in future pre-dispatch context.
- Critic override patterns create rubric revision warnings.
- Dashboard gives a quick view of quality trends.
