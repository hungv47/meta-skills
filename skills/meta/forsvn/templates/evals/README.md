---
kind: evals-root
lifecycle: snapshot
read-by: /forsvn (dashboard build), generative skills (learn from past evals)
written-by: evaluation skills, critic agents, fresh-eyes
---

# `.forsvn/evals/` — Evaluation Snapshots + Critic Override Log

Dated snapshots of evaluations performed against artifacts. Separate from `loops/<slug>/evals/` — those are scoped to a single loop. This folder holds **standalone** evals: one-off critic runs, fresh-eyes reviews, post-launch audits.

## Layout

```
evals/
├── snapshots/
│   └── YYYY-MM-DD-<artifact-slug>-<rubric>.md
├── critic-overrides/
│   └── YYYY-MM-DD-<artifact-slug>.md
└── fresh-eyes/
    └── YYYY-MM-DD-<work-slug>.md
```

## Snapshot Frontmatter

```yaml
---
evaluated: <path to artifact>
rubric: <rubric-name or skill-name>
score: <0-10 or pass/fail>
status: done | done_with_concerns
critic-passed: true | false
---
```

## Critic Override Log

When the user overrides a critic's verdict ("ship it anyway"), the override is logged here with reasoning. Future evals can learn from override patterns — e.g., critic chronically over-flags X dimension on Y type of artifact.

## Fresh-Eyes Reports

Independent post-implementation reviews triggered by the `review-work` skill. Distinct from inline critic runs because they happen *after* code/artifact is committed and merged.

## Dashboard Aggregation

`/forsvn dashboard` reads this folder + `loops/*/evals/` + artifact frontmatter `status:` to render the quality view. No state lives in `dashboard/` — it is fully derived.
