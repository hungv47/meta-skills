---
kind: dashboard-root
lifecycle: derived
read-by: user
written-by: /forsvn dashboard (regenerated, never hand-edited)
---

# `.forsvn/dashboard/` — Quality Dashboard (Read-Only)

Generated views over `context/`, `experience/`, `artifacts/`, `loops/`, `evals/`, `routing/`. No source-of-truth state lives here.

## Files

```
dashboard/
├── overview.md         # one-page state of every initiative
├── quality.md          # critic scores, override frequency, fresh-eyes findings
├── velocity.md         # artifacts/week, cycle time per initiative
└── stale.md            # artifacts older than 30 days without follow-up
```

## Regeneration

`/forsvn dashboard` rebuilds all files from scratch. Hand-edits are overwritten — do not edit.

## What the Dashboard Surfaces

- Initiatives with `status: blocked` or `done_with_concerns` that haven't been touched.
- Critic-override patterns (which rubric dimension users override most — signals miscalibration).
- Loops with `verdict: watch` entries older than 14 days (probably need a decision).
- Artifacts marked `status: draft` for >7 days (probably abandoned or forgotten).

## When to Regenerate

- Before kicking off a planning session.
- Before publishing a release.
- Weekly cadence if running an active loop program.
