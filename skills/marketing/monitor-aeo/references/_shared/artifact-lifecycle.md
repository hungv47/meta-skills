<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Artifact Lifecycle — Snapshot Directory Pattern

> Shared convention for skills whose output is a **dated, re-runnable measurement** rather than a one-shot deliverable. Consumers: any skill that produces a series of comparable runs over time (e.g. `monitor-aeo`). Load this when designing a skill's artifact contract that needs trend diffing across runs.

A one-shot skill writes a single artifact, rewritten in place on re-run. A **measurement** skill writes a series: each run must stay comparable to prior runs so the operator can read what changed. That requires two kinds of file with two different lifecycles — and a directory shape that keeps them straight.

---

## The two lifecycles

| Lifecycle | Files | Behavior |
|---|---|---|
| **Rewritten-in-place** | the human-readable report, the locked inputs (e.g. `query-set.md`), the downstream handoff | Overwritten each run. Prior copies live in **git history**, not in the tree. One current version on disk. |
| **Append-only snapshot** | the machine-readable per-run record (`snapshots/*.json`) | Never overwritten. One file per run date (+ mode). The accumulated series IS the trend data. Trend computation reads the snapshot directory, ordered by filename. |

The split exists because the report answers *"what's true now?"* (you only want the latest) while the snapshots answer *"what changed?"* (you need every prior point). Putting trend data in the rewritten report would lose history on the first re-run; putting the report in the append-only set would litter the tree with stale prose.

---

## Directory shape

```
artifacts/[skill]/[slug]/
  report.md                              # rewritten in place
  [locked-inputs].md                     # rewritten in place (e.g. query-set.md)
  [handoff].md                           # rewritten in place (optional)
  snapshots/
    YYYY-MM-DD-[mode].json               # append-only, one per run date × mode
    YYYY-MM-DD-[mode].json
```

- `[slug]` — a stable, kebab-cased identifier for the subject (e.g. a domain `example.com` → `example-com`). The same subject re-runs into the same `[slug]` directory so its snapshots accumulate.
- `snapshots/YYYY-MM-DD-[mode].json` — the date is the run date; `[mode]` distinguishes snapshot kinds when a skill emits several per run. Filenames sort lexicographically into chronological order, so trend code can `readdir` + sort without parsing.

---

## Snapshot rules

1. **One snapshot file per (date, mode).** A second run on the same date for the same mode overwrites that date's file — a date is the unit, not the invocation. This keeps "one set per date" true and trend deltas unambiguous.
2. **Self-describing envelope.** Each snapshot carries `schema_version`, `subject`, `date`, and a run-window range so a reader can interpret it without the report. Schema stability is contract-level: changing a snapshot's shape breaks trend computation against every prior snapshot.
3. **Per-mode trend isolation.** Trend computes within a snapshot mode only — a measurement of kind X trends against prior kind-X snapshots, never against kind Y. Mixing modes in a delta is a category error.
4. **First-run is explicit.** With no prior snapshot, the report's trend section reads `n/a — first snapshot`; trend activates at the second run.
5. **Commit per run.** Because the rewritten files rely on git history for their diffs, the operator commits after each run; an uncommitted re-run silently loses the prior report (the snapshots survive regardless, being append-only).

---

## When NOT to use this pattern

- **One-shot artifacts** (a brand, a plan, a brief) — they have one correct current state; a snapshot series adds noise. Use a single rewritten-in-place artifact.
- **Outputs with no comparable re-run** — if two runs aren't meaningfully diffable (different scope each time), the snapshot directory buys nothing.
