<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Critic Override Protocol

Shared procedure for the evaluation skills — `evaluate-ad`, `evaluate-campaign`,
`evaluate-content`, `evaluate-landing-page`. When an operator ships a cycle
despite a critic FAIL, the override is logged so repeated pushback becomes a
counted rubric-revision signal instead of silently eroding the quality bar.

## When to log

Log an override when the operator **explicitly chooses to ship despite a critic
FAIL**, or accepts a `pass-with-concerns` verdict the rubric flagged. The
override log is the only mechanism that turns repeated operator pushback into a
rubric-revision signal — see `quality-feedback-protocol.md` (sibling of this file)
§ Critic Override Log and `quality-dashboard-spec.md`
§ Rubric Metrics.

**Log the override before doing anything else** — before writing the eval
artifact, before appending the `results.tsv` ledger row, before reporting
completion.

## How to log

```bash
bun scripts/log-critic-override.ts \
  --skill <evaluate-ad | evaluate-campaign | evaluate-content | evaluate-landing-page> \
  --dimension "<failed rubric dimension>" \
  --artifact "<project-relative path to the eval artifact under review>" \
  --critic-verdict <fail|pass-with-concerns> \
  --operator-decision <ship|revise|ignore> \
  --reason "<one sentence — why the override is justified>" \
  --follow-up "<none|watch metric|revise rubric|extract shared rubric>"
```

<!-- lint:reference-ok skill-local packaged copy; resolves in consuming skills, not at canonical -->
The invoking skill passes its own name as `--skill` and runs its packaged copy at `scripts/log-critic-override.ts` (synced from the maintainer original via `sync-skill-support`). The script appends a dated
block to `docs/forsvn/artifacts/meta/records/critic-overrides.md`.

## Escalation

After **three valid overrides on the same `skill:dimension` pair**, the rubric
should be revised — escalation is handled by the quality dashboard's
`rubrics[skill:dimension].action` field (see `quality-dashboard-spec.md`). This
is the D8 contract: an override is not a free pass, it is a counted signal.

## Two rules an override never relaxes

1. **An override never promotes a contested cycle to `keep`.** The ledger row
   status in `results.tsv` reflects the actual cycle outcome — pick `watch` or
   `discard` if the underlying evidence does not support `keep`.
2. **No override → FAIL stands.** If the operator does NOT override and the
   critic FAILs, the default rule holds: return `BLOCKED`, do not append the
   ledger row.

Only after the override is logged may the cycle proceed.
