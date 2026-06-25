# slop-dismissals.tsv — the override-ledger store contract (S7 / FOR-56)

The dedicated, append-only ledger of human dismissals of slop suggestion cards. It is the
self-correction signal: the detector counts *rule-wrong* dismissals per rule and flags a
mis-firing rule for a human to revise. It is **separate from `verdicts.tsv`** — a "dismissed"
row could never live there (`query-verdicts` rejects any `decision_state` outside
`{approved,denied,suggested}`), so reusing it would pollute per-skill deny analytics. Sibling
contract: [`verdicts-data.md`](verdicts-data.md) (whose `dimensions_flagged` stays *unproduced* —
S7 reads this separate store, it does not become that column's producer).

## Location & ownership

- **Path:** `.forsvn/learning/slop-dismissals.tsv` (tracked by git — durable override corpus,
  local-first; never leaves the machine).
- **Sole producer:** `forsvn-slop/dismissals.ts` (`appendDismissal`), driven by the
  forsvn-preview `POST /dismiss` endpoint when a human clicks a card's Dismiss / Rule's-wrong chip.
- **Sole reader:** `forsvn-slop/lib/rule-dismissals.ts` (via `forsvn-slop/bin/rule-health.ts`).
  Do not add a second raw reader; do not point `query-verdicts` at it (wrong path/header/columns).

## Schema

`# schema_version: 2` then the tab-separated column header, then append-only rows.

| Column | Meaning |
|---|---|
| `ts` | ISO-8601 UTC second (`verdictTs()` format), stamped server-side |
| `artifact_id` | frontmatter `id`, read **server-side** (KEY — a keyless row is skipped, never written, rejected on read) |
| `ruleId` | the dismissed antipattern id, e.g. `mkt-slop-em-dash-overuse` (KEY) |
| `surface` | `web` \| `cli` \| `tty` |
| `scope` | `exception` \| `rule-wrong` — the v2 column (FOR-56) |

`scope` semantics (single-source enum: `forsvn-slop/lib/dismissal-scope.ts`):

- **`exception`** — this artifact is a legitimate one-off (a quote/testimonial/legal line, a
  deliberate choice). Recorded for the taste corpus, **never** counted toward revision. This is
  the **fail-safe default**: a missing or out-of-enum `scope` reads as `exception`, so an
  ambiguous dismissal can never auto-flag a rule.
- **`rule-wrong`** — the rule itself mis-fires. **Counted** toward the revision threshold.

**v1 back-compat:** a `# schema_version: 1` store (4 columns, no `scope`) is read with every row
defaulting to `exception` — harmless, nothing auto-flags. The reader accepts 1 or 2; an unknown
version, a missing header, or a column header missing a required key is a contract error (exit 1).

## The auto-flag threshold (volatility-keyed, distinct-artifact-gated)

A rule flags for revision only past **both** a count and a distinct-artifact span, keyed on the
rule's `volatility` (read from `forsvn-slop/registry/antipatterns.mjs`; an absent registry /
unknown rule defaults to `stable`):

| volatility | rule-wrong count | across distinct artifacts |
|---|--:|--:|
| `stable` | ≥ 3 | ≥ 3 |
| `trend` | ≥ 5 | ≥ 4 |

The distinct-artifact span is **always** required, so one contentious artifact re-dismissed N
times can never auto-flag either tier. The window is the trailing 90 days. A thin rule carries a
shrinkage weight `n/(n+k)` (the one `_dev/shrinkage.ts` formula) so a 3-dismissal flag reads as a
nudge, not a verdict.

## What auto-flag does — and never does

A flagged rule routes a human via two existing rails, and **nothing else**:

1. a `suspect-dimensions/v1` entry (signal `ruleId`), and
2. `bun _dev/update-quality-dashboard.ts --rubric slop:<ruleId> --overrides <n> --action watch`,
   which flips the rubric `watch → revise` at the unchanged `≥3` ladder.

It **never** edits, disables, or re-weights the rule — the human owns the rule edit in
`registry/antipatterns.mjs` (detect ≠ fix; decisions human-owned). The report lives at
`docs/forsvn/artifacts/meta/records/rule-health.md`; `--check` is WARN-first (exit 0) and honest
on an empty/absent store (the normal state until real dismissals accrue).
