# Verdicts store — `.forsvn/learning/verdicts.tsv` (C2/L1)

The append-only corpus of human review decisions. Every decision through any
write-back chokepoint appends exactly one row: the verdict as structured,
queryable training data. This is the **seed corn** of the self-improving loop —
**WS-L is the only reader** (L3 dashboard, L4 shrinkage recall, L5 telemetry),
via `forsvn-preview/lib/query-verdicts.ts`. Capture before analysis: the producer
ships first; a dashboard over an empty table is the inversion the roadmap forbids.

Sibling store contract: [`performance-data.md`](performance-data.md) (operator-fed
channel performance). This one is **plugin-written**, one row per decision.

## Location & lifecycle

- Path: `.forsvn/learning/verdicts.tsv` (machine-state under `.forsvn/`, **not** an
  artifact — exempt from the artifact contract, like `.forsvn/performance/`).
- **Tracked by git** (durable knowledge, local-first, no PII beyond the operator's
  own notes). Do **not** gitignore it — it is the learning corpus. Contrast: the C4
  `.forsvn/inbox` signal is transient and *is* gitignored.
- **Append-only.** Re-reviewing an artifact appends a NEW row — the history *is* the
  signal. No dedupe at write; a "current verdict" view (latest `ts` per `artifact_id`)
  is the reader's job (`query-verdicts.ts --current`).
- **Never hand-edit.** Adding a column is a `schema_version` bump + a `_dev/`
  migration script, exactly as `performance-data.md` mandates — never a hand-rewrite.
- Local-first: the file never leaves the machine. The only sanctioned egress is
  `forsvn learnings export` (L6 — `bin/learnings.ts`), which redacts the free-text
  `note` column by default and emits a portable bundle the operator carries **by
  hand** (no network). Round-trip with `forsvn learnings import`. The hosted mirror
  that would sync that bundle (`bin/lib/hosted-learnings.ts`) is **dormant (gated
  G3, OFF)** — no network, no billing. Egress lib: `forsvn-preview/lib/portable-ledger.ts`.

## Schema (v2 — the stable contract WS-L consumes)

Line 1 is the version header; line 2 is the tab-separated column header; data rows
follow. v2 added the L2 edit-delta columns (`body_sha`, `edit_classes`) after the
C2 set; upgrade a v1 store with `_dev/migrate-verdicts-v1-to-v2.ts --write`.

```
# schema_version: 2
ts	artifact_id	skill	stack	decision_state	decision_reason	dimensions_flagged	note	review_latency_ms	surface	body_sha	edit_classes
2026-06-20T10:14:02Z	forsvn-brand-identity	create-brand	marketing	denied	wrong-claim		hook overclaims the metric	48210	cli	sha256:9f2a…	softened_claim;cut_filler
2026-06-20T10:31:55Z	conquis-desktop-hero-v3	write-copy	marketing	approved					12030	web	sha256:1c4d…	
```

**Columns (12, fixed order):**

| Column | Meaning |
|---|---|
| `ts` | ISO-8601 UTC, seconds precision (`YYYY-MM-DDThh:mm:ssZ`). |
| `artifact_id` | Frontmatter `id` (**KEY**). |
| `skill` | Producing skill (**KEY**). |
| `stack` | `meta` \| `research` \| `marketing` \| `product`. |
| `decision_state` | `approved` \| `denied` \| `suggested` (**KEY**). Never `pending`/`not_required`. |
| `decision_reason` | C1 enum value, or `""` (only on a non-approve). |
| `dimensions_flagged` | Optional critic-dimension axis, or `""`. **No producer today** — all four decision writers emit `""`. L5 keys its suspect-dimension threshold on the populated `decision_reason` enum instead (the live rejection axis); this column is a forward-compatible slot if a per-critic-dimension producer is ever added. |
| `note` | First line of the reviewer comment, TSV-escaped, or `""`. |
| `review_latency_ms` | Integer ms open→decide, or `""` when unknown (never `0`). |
| `surface` | `cli` \| `tty` \| `web` \| `proof`. |
| `body_sha` | `sha256:<hex>` of the **produced body** (frontmatter excluded), or `""`. L2. |
| `edit_classes` | `;`-joined subset of the edit-type enum (below), or `""` (clean approve). L2. |

- **Keys:** `artifact_id`, `skill`, `decision_state`. A row missing any key is
  **rejected by the reader and must never be written** — the writer
  (`appendVerdict`) skips a keyless row with a one-line stderr warning.
- **TSV-safety:** every cell has tabs/newlines/CRs collapsed to single spaces at
  write time. Cells may be empty (`""`); a cell never contains a literal tab.

## Edit-delta capture (L2)

`body_sha` + `edit_classes` turn a bare `approve` into a signal-rich record: *what*
the operator changed before approving. Captured at the decision chokepoint
(`forsvn-preview/lib/edit-delta.ts`), written onto the **same row** the C2 wire
appends — never a sidecar.

- **`body_sha`** is the `sha256:` of the *produced* body — the serve-time (pending,
  pre-edit) artifact the skill emitted. It is also stamped into the decided
  artifact's frontmatter (via the existing decision writer — **no second `.md`
  writer**), so a later read can confirm the diff was against the real produced
  text and dedupe re-reviews. On a clean approve it matches the body; on an edited
  decision it records the *pre-edit* produced identity (intended).
- **`edit_classes`** is a `;`-joined subset of this **closed** enum (adding a type is
  a `schema_version` bump):

  | Label | Meaning |
  |---|---|
  | `softened_claim` | hedged/qualified an overclaim (`guarantees` → `helps`) |
  | `cut_filler` | removed throat-clearing / redundancy, no meaning change |
  | `swapped_cta` | replaced or re-pointed the call to action |
  | `fixed_fact` | corrected a wrong name/number/date/URL/claim |
  | `voice_change` | re-toned for brand voice (not meaning) |
  | `restructured` | moved/reordered sections or hook (structure, not wording) |
  | `tightened_specificity` | added a concrete mechanism/proof the draft left vague |
  | `other` | a real (>threshold) edit none of the above fit |

**Capture discipline.**
- **Advisory, never gating.** Classification degrades to `edit_classes: []` (+ an
  advisory `note`) on any failure and never blocks or rolls back the decision —
  the same best-effort contract as `appendVerdict`/`postMetrics`.
- **Sub-threshold deltas are dropped.** A net change below `edit_delta_min_chars`
  (default **12**, set in `.forsvn/config.json`) records `edit_classes: []` — typos
  and whitespace are not learning. Classification runs over the surviving diff
  hunks only.
- **Deterministic, local-first.** Classification is an in-process heuristic over the
  diff (NOT an LLM/subprocess call): the review CLI runs synchronously and must
  never block or hit the network on the decision path. The labels are a prior, not
  a verdict.
- **Reconciliation (the spec's "snapshot at emit").** Producers emit Markdown
  directly — there is no central emit-time writer to stamp `body_sha`. The
  sanctioned writer (`forsvn-preview`) instead records the produced-body sha at the
  decision chokepoint (its first authoritative touch of the body), into both the
  verdict row and the decided artifact's frontmatter. The CLI/TTY surfaces carry
  full `body_sha` + `edit_classes`; the Proof-export surface carries `body_sha`
  today (its `edit_classes` is a follow-on — the diff is available there).

## Producer / consumer

- **Producer (the only writer):** `appendVerdict(root, Verdict)` in
  `forsvn-preview/lib/verdicts.ts`. Wired at every human-decision chokepoint — the
  CLI serve + headless TTY (`forsvn-preview.ts`, surface `cli`/`tty`), the web/desktop
  workspace server (`workspace.ts`, surface `web`), and the Proof export
  (`collab.ts`, surface `proof`). The append runs **after** the canonical
  frontmatter write and is fire-and-forget: a verdict failure logs one stderr line
  and never rolls back or fails the decision.
- **Consumer (the only reader):** `forsvn-preview/lib/query-verdicts.ts` — validates
  the header, rejects keyless rows, answers per-skill / per-reason / per-decision
  tallies and per-`(skill, stack)` deny-rate, returns a typed empty result on an
  absent store (exit 0), and exits 1 only on a contract violation. It also emits the
  **L4 shrinkage `weight` per dimension** (`per_dimension_weight[skill][reason] = {n,
  weight}`, `weight = n/(n+k)`) by importing the single `_dev/shrinkage.ts` definition —
  the same formula L3's `priors.json` carries; `k` is `--k` > `thresholds.json`
  `shrinkage_k` > 8. WS-L registers a per-skill mirror in `SUPPORT_SCRIPTS` when it
  builds L3; until then the canonical copy lives in `forsvn-preview/lib/`.

Producers never re-derive header validation, keyless rejection, or dedupe — that all
lives in `query-verdicts.ts`.

## Derived siblings — `priors.json` (L3) and the quality dashboard

`verdicts.tsv` is the raw corpus; **`priors.json` is its distillate**. L3
(`_dev/distill-priors.ts`) reads the corpus through `query-verdicts.ts` (the single
reader — never a second store reader) and writes two outputs:

- `.forsvn/learning/priors.json` — the machine-facing, generation-time distillate,
  keyed `"<skill>:<dimension>"`, each entry carrying `prior` (direction, never a
  prescriptive checklist), `n`, `weight = n/(n+k)` (the L4 shrinkage weight, from the
  single `_dev/shrinkage.ts` definition), `direction`, `sources[]` (auditable pointers
  back into the corpus), `floor`, `signal`, and `last_updated`.
- `docs/forsvn/artifacts/meta/records/quality-dashboard.json` — the human-facing
  trend index, written through the existing `_dev/update-quality-dashboard.ts` (L3 is
  its first caller; no second dashboard writer is added).

**`priors.json` is a PURE derivation — never hand-edit it** (same discipline as
`manifest.json`). Every write is a full regenerate from the corpus; `distill-priors.ts
--check` asserts it is fresh (it joins the pre-merge gate via L7). A human who wants to
change a prior fixes the **evidence** (a verdict / override), not the file. Like
`verdicts.tsv`, `priors.json` is **tracked by git** as durable learning by default;
gitignore it only if a project prefers to treat it as transient derived state.

**Dimension axis (the L3/L5/L7 deviation).** The spec keys priors on
`dimensions_flagged[]`, but that column has no producer (all writers emit `""`), so L3
keys the dimension on the populated `decision_reason` enum + the L2 `edit_classes`
(mapped to a reason-space dimension). Every prior records `signal` so the deviation is
legible. A prior below the per-dimension min-n is omitted (anecdote — the dormancy
discipline at the dimension grain); a `floor: true` dimension is listed for visibility
but is never adoptable.

**The dormancy gate (G-data).** `distill-priors.ts` refuses to write either file over
an empty / below-threshold corpus: it exits 0, writes nothing, and prints the dormancy
reason. A dashboard or prior over an empty table is the classic inversion the roadmap
forbids — the corpus must exist first.

## Retention

None yet — append forever. The L7 learning-hygiene guard
(`_dev/check-learning-hygiene.ts`, WARN-first; small-n / staleness / floor-contradiction
/ Goodhart canary) marks stale priors and experience findings later; this store does
not decay rows, and L7 only *marks* — the human prunes.
