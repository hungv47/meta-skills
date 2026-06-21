# Format Conventions — Design Lifecycle

[PROCEDURE] — artifact template, frontmatter, the flow-map table schema. Loaded at artifact-assembly time.

## Output path

```
docs/forsvn/artifacts/marketing/design-lifecycle/[flow-type]-[date]-[slug].md
```

`[flow-type]` ∈ `onboarding | activation | winback | churn-save`. Pipeline lifecycle — re-run on activation-metric change, new product event, or churn-driver shift.

## Frontmatter (required — validate-artifacts --strict)

```yaml
---
skill: design-lifecycle
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: md            # html | md | none
id: design-lifecycle-<slug>
type: pipeline
keywords: [lifecycle, retention, <flow-type>, activation, email-flow]
decision_state: not_required  # pending | approved | denied | suggested | not_required
review_tool: inline           # proof | inline | roughdraft | none
reviewed_at:                  # empty until reviewed
reviewer:                     # empty until reviewed
flow_type:                    # onboarding | activation | winback | churn-save
activation_metric:            # the ONE event the flow drives (string)
critic_total:                 # integer /42 — consumed by measure-results
---
```

The four base required (`skill`, `version`, `date`, `status`) + the two v2 mandatories (`stack`, `review_surface`) + the v3 instruction core (`id`, `type`, `keywords`). `flow_type`, `activation_metric`, `critic_total` are skill-specific selection fields downstream (`measure-results`) reads.

## Body section order

1. `## Activation Anchor` — metric + baseline + why (from flow-architect)
2. `## Flow Map` — the trigger→message→timing→branch→suppression table
3. `## Branch Logic`
4. `## Step Copy` — per-step subject/body/CTA (from copy agent)
5. `## Measurement Plan` — primary metric + holdout + per-step diagnostics + decision rules (from measurement agent)
6. `## Exit & Suppression Summary`
7. `## Critic Scorecard` — the 6-dim table + total + hard-gate checklist
8. `## Rationale` — the orchestrator's assembly notes + any DONE_WITH_CONCERNS flags

## Flow-map table schema (load-bearing — measure-results reads it)

| Column | Required | Meaning |
|--------|----------|---------|
| Step | yes | ordinal |
| Trigger | yes | product event OR time-since-event |
| Delay | yes | elapsed time before send |
| Branch | yes | which path arm (main / branch-A / …) |
| Step intent | yes | what the step is FOR |
| Suppression | yes | the exit condition for this step |

A row missing the Trigger or Suppression cell is a contract violation — the critic FAILs it.

## Cross-stack contract

Schema changes (new column, new frontmatter field) require an atomic update of this file's "Flow-map table schema" + "Frontmatter" sections AND the `measure-results` consumer (it reads `activation_metric` + `critic_total` + the flow-map activation rows).
