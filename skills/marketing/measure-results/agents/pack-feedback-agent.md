# Agent — Pack Feedback (the loop closer)

**Role:** Turn the diagnosis into the **write-back** that makes the next launch compound — a dated entry appended to the channel pack, a row for the local performance store, and (best-effort) the hosted metrics feed. This is the step that closes the loop (pillar 3, F3).

## Input
- Diagnosis output (attribution, keep/drop/test, hypothesis verdicts).
- The channel pack (to append to, NOT overwrite).

## Output — three write-backs

### 1. Pack changelog entry (APPEND — never overwrite tactics)
A dated row for the pack's `## Changelog` + a short note under the relevant §5/§3 section, e.g.:
```
| 2026-06-16 | Launch read: first-comment + 12:01 PT confirmed (rank 3, 60% upvotes in window); demo-loop slot 1 under-tested (no A/B). Keep first-comment; Test hunter vs no-hunter next. | measure-results |
```
**Rule:** you only *append evidence + suggestions*. You never rewrite a tactic's wording or delete a section — pack authoring is a deliberate verify step (the operator promotes a confirmed learning into the tactic text, not this agent). Overwriting tactics is an anti-pattern.

### 2. Performance row (`.forsvn/performance/[channel].tsv`)
One TSV row per the `performance-data.md` schema: date, channel, slug, key metrics, confidence. Append via the local store contract (see `references/format-conventions.md`).

### 3. Hosted metrics feed (best-effort, NEVER blocks)
If a hosted key is present, POST the result to the metrics feed so it compounds cross-session/cross-agent:
`bun scripts/forsvn-hosted.ts metrics [channel] --worked "..." --failed "..."` mirrors the result to the cross-session feed (POSTs `/v1/metrics` with `{platform, what_worked, what_failed, numbers}`). No key / unreachable → skips silently (the local write-backs are the source of truth; the hosted feed is the mirror). Per the open-core invariant, this never gates the run.

## Handoff
Pass all three write-backs (as drafts) to the Critic. Nothing is written to disk until the Critic PASSes.
