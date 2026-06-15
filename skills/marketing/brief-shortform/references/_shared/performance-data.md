<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Performance Data — Store, Ledger, and Read Contract

> The local-first per-channel performance layer under `.forsvn/performance/`. Operator-fed snapshots of real post results, a publish ledger anchoring post↔artifact attribution, and the three-state read contract producing skills consume at generation time. Cite this file; do not re-implement the rules.

All example rows in this file are **synthetic** — invented platforms-shaped data for illustration, never real account metrics.

## Purpose

Producing skills (`write-social`, `write-ad`, `brief-shortform`, `plan-campaign`) have historically generated from platform-intelligence priors alone — blind to what actually performed on the operator's own channels. This layer gives them grounded history: `evaluate-content`'s metric-ingest pass already normalizes operator-supplied native analytics into Metric Packets; this contract defines where fully-keyed packets accumulate, how a published post traces back to the artifact that produced it, and how much data must exist before "our own numbers" may outweigh priors.

**v1 scope:** TSV files, operator-fed imports only. No live platform APIs (connectors layer onto the same store later). SQLite is explicitly deferred — it is a v2 optimization locked behind the data-layer dogfood criterion, not a v1 concern. Schema migrations run via a `_dev/` script only; never hand-rewrite a store file's shape.

## Placement Decision — why a sibling layer, not a loops extension

`.forsvn/loops/<slug>/results.tsv` already exists (see `eval-loop-spec.md`) and looks adjacent, so the placement is a deliberate decision, recorded here:

- **Loops are per-initiative; channel history is cross-initiative.** A loop ledger answers "did cycle 3 of the pricing-page loop beat cycle 2?" — scoped to one measurable surface, retired when the initiative closes. Channel history answers "what works on LinkedIn for this account?" — it must survive every initiative and accumulate across all of them. Folding channel history into a loop folder would either fragment it per-loop (unusable for cross-loop reads) or turn one loop into a fake "channel loop" (violating the one-loop-per-measurable-initiative rule).
- **One-way flow, two stores.** Loop evals whose Metric Packet carries the full snapshot key (platform, post id/URL, measurement window) append to the channel store *in addition to* their loop's `results.tsv`. Keyless loop rows stay in `results.tsv` only — they remain valid cycle evidence but can never enter channel sufficiency counts. There are never two independent writers of the same fact: metric-ingest (and keyed loop evals routed through it) is the single append path into the channel store.
- **Different consumers.** `results.tsv` is read by the loop's own next cycle. The channel store is read by producing skills at generation time, across every future initiative.

Hence: `.forsvn/performance/` is a **sibling state-root layer** beside `canonical/`, `artifacts/`, `experience/`, and `loops/`.

**Performance data is data, not artifacts.** Rows are operator-fed measurements, not skill-produced reviewable Markdown. The layer is therefore exempt from the artifact contract: `validate-artifacts` and `lint-artifact-paths` do not walk it (their cohort is `.forsvn/{canonical,artifacts,experience}`), and `manifest-sync` does not index it. The store is **git-tracked** — durable operator data in a private repo — and is `.publicignore`-fenced (all of `.forsvn/` is) so it never ships to the public mirror.

## Store Layout

```text
.forsvn/performance/
├── ledger.tsv          # post↔artifact attribution ledger (all platforms)
├── <platform>.tsv      # one snapshot file per channel: linkedin.tsv, instagram.tsv, x.tsv, …
└── thresholds.json     # optional — the single operator override key (see Read Contract)
```

Both TSV kinds start with a **`schema_version` header line**, then a tab-separated column header:

```text
# schema_version: 1
platform	post_id	measurement_window	imported_at	…
```

A store file missing the `schema_version` line is malformed; the query helper refuses it with an actionable message rather than guessing.

### Snapshot files — `<platform>.tsv`

**Append-only.** One row per (post, measurement window) import. Rows are never edited or deleted; corrections are re-imports.

| Column | Meaning |
|---|---|
| `platform` | channel key — must match the filename (`linkedin.tsv` rows say `linkedin`) |
| `post_id` | native platform post id, or the post URL when the platform exposes no id — **key component** |
| `measurement_window` | `YYYY-MM-DD..YYYY-MM-DD` (start..end) — **key component** |
| `imported_at` | ISO-8601 timestamp of the import — collision tiebreaker, not a key component |
| `ledger_id` | joining ledger row id, or empty for ledger-less backfill |
| `artifact_id` | producing artifact's stable `id`, or empty |
| `format` | `text \| image \| carousel \| video \| …` — query filter |
| `placement` | `paid \| organic` — query filter |
| `metric` | primary metric name (e.g. `engagement_rate`) |
| `value` | primary metric value |
| `baseline` | comparison value, or empty |
| `reach` | reach/impressions |
| `likes` `saves` `shares` `comments` | the mandatory 4-way engagement split (vanity vs meaningful — see metric-ingest) |
| `attribution_confidence` | `high \| medium \| low \| none \| blocked` — from the Metric Packet (see Join Rule) |
| `comparability` | `comparable \| partially_comparable \| not_comparable` — from the Metric Packet |
| `source` | `native platform analytics \| third-party dashboard \| operator-supplied` |
| `notes` | free text; no tabs/newlines |

**Snapshot key = (platform, post_id, measurement_window).** Rules:

- **Full-key collision → latest `imported_at` wins.** Re-importing the same window with corrected numbers appends a new row; queries and sufficiency counting use only the newest row per key. Older rows remain as history.
- **A later window is a new snapshot, not a collision.** Both windows stay valid history (a post measured at day 7 and day 30 is two rows, both queryable).
- **Keyless rows are rejected at read time.** A row missing any key component never counts toward sufficiency and never appears in query results — the helper lists it as rejected so it can be fixed at the source.

### Ledger — `ledger.tsv`

**Append-only**, like the snapshot files. One row per lifecycle event; the **latest row per `ledger_id` is the current state**.

| Column | Meaning |
|---|---|
| `ledger_id` | unique slug, recommended `<platform>-<YYYY-MM-DD>-<slug>` |
| `artifact_id` | the producing artifact's stable `id` (the `docs/forsvn/artifacts/` frontmatter `id`) |
| `platform` | target channel |
| `status` | `exported \| live \| measured` |
| `event_date` | `YYYY-MM-DD` of this lifecycle event |
| `post_url` | empty until known; written at first import |
| `format` | as declared at export |
| `placement` | `paid \| organic` |
| `notes` | free text; no tabs/newlines |

Synthetic example:

```text
# schema_version: 1
ledger_id	artifact_id	platform	status	event_date	post_url	format	placement	notes
examplenet-2099-01-05-demo-launch	write-social-demo-launch	examplenet	exported	2099-01-05		text	organic	synthetic example
examplenet-2099-01-05-demo-launch	write-social-demo-launch	examplenet	live	2099-01-07	https://example.invalid/p/123	text	organic	first import joined
examplenet-2099-01-05-demo-launch	write-social-demo-launch	examplenet	measured	2099-01-14	https://example.invalid/p/123	text	organic	day-7 window imported
```

## Ledger Lifecycle and Join Rule

```text
exported ──(first import: metric-ingest joins, writes live + post_url)──▶ live ──(snapshot lands)──▶ measured
```

- **`exported`** — written when content is exported/published (the publish-side skill writes this row; wiring lives in the consuming skills, not here).
- **`exported → live` is owned by metric-ingest.** At the **first import** for a post, metric-ingest appends the `live` row carrying the now-known `post_url`. The `measured` row follows once the snapshot is appended (usually the same import pass).
- **Every import names its ledger id or artifact id.** The operator (or the loop eval) supplies which exported row this measurement belongs to.
- **Ambiguous matches are refused, never guessed.** If the named artifact id matches more than one `exported` ledger row on that platform, the import is refused with the candidate `exported` rows listed by platform + export date; the operator picks the right `ledger_id` and re-runs.
- **Ledger-less imports are allowed — at `attribution_confidence: none`.** Historical backfill (posts published before this layer existed) appends snapshots with empty `ledger_id`/`artifact_id` and confidence `none`. They are real channel history; they just can't claim which artifact produced them.
- **A joined row with no URL stays `low`.** A ledger join without a verifiable `post_url` caps `attribution_confidence` at `low` regardless of metric quality.

`attribution_confidence` gates **artifact-level attribution claims** ("this brief's hook drove the lift"), not channel-level reads — see the sufficiency rules below.

## Read Contract — empty / sparse / sufficient

**The query helper computes and emits the state; producers never compute sufficiency themselves.** A producing skill runs the helper per target channel and obeys the emitted state — it does not re-derive thresholds from raw rows.

| State | Condition (per channel) | Producer behavior |
|---|---|---|
| `empty` | 0 eligible rows in the decay window | Platform-intelligence priors only. Say so: "no own data yet — using priors." |
| `sparse` | 1 to (floor − 1) eligible rows | Own data is **anecdote** — it may color examples, never override priors. Two posts are not a trend. |
| `sufficient` | ≥ floor eligible rows (default floor: **8**) | Own data **wins account-specific questions**; priors keep platform-mechanics questions (see Precedence). |

**Eligible row** = fully keyed, latest-`imported_at` per key, `measurement_window` end within the **90-day decay window** of the query date, and `comparability` ≠ `not_comparable`. Rows at `attribution_confidence: none` **do count** toward sufficiency — they are real channel measurements; confidence gates artifact attribution, not channel reads.

**Operator override — one key.** `.forsvn/performance/thresholds.json` may set exactly one key:

```json
{ "sufficient_floor": 8 }
```

The helper reads it (integer ≥ 1); a per-query `--floor N` flag overrides it for one invocation. There are no other tunables in v1.

**This floor is not metric-ingest's floor.** Metric-ingest's sample-size floor gates **per-post reach** (is this one post's reach big enough to trust its rate?). The read-side floor here gates **rows per channel** (are there enough measured posts to call a pattern?). Same vocabulary (`comparability`, `attribution_confidence`), two different numbers — never conflate them.

### Lane reachability — why v1 lanes are coarse

Sufficiency is computed **per channel**. `format` and `placement` (paid/organic) are **query filters, not lanes**. The arithmetic:

- Solo-operator cadence is realistically 1–3 posts per channel per week → **~12–36 measured posts per channel per 90 days**.
- Per-channel lane: an 8-row floor needs ~0.6 posts/week — **reachable within the first quarter** of disciplined importing.
- If lanes were platform × format × placement (say 4 formats × 2 placements = 8 lanes), clearing 8 rows per lane needs **64 posts per channel per 90 days ≈ 5+ posts/week** — unreachable; the `sufficient` state would never fire and the layer would be dead weight.

So v1 keeps the lane coarse. A filtered query (e.g. `--placement paid`) still reports the channel-level state plus the filtered row count; when the filtered subset falls below the floor, the helper flags it — treat the filtered ranking as anecdote even inside a `sufficient` channel. Cross-channel synthesis is deferred to the distillation layer.

## Precedence — own data vs priors

When the state is `sufficient`:

- **Own data wins account-specific questions.** What format, topic, hook style, posting pattern performs *for this account on this channel* — the store outranks generic priors.
- **Platform-intelligence priors keep platform-mechanics questions.** Hard platform constraints and algorithm mechanics (length caps, format requirements, distribution rules — `references/platform-intelligence/`) are not voteable by 8 rows of one account's history. If own data favors something a prior caps, the prior wins on the mechanics and own data wins on the angle.

Priors carry their own staleness valve (`last_verified` > 90 days → flag), independent of this store's decay window.

## Brand-Floor Supremacy

**Brand, safety, and claims floors outrank performance data — always.** Data reshapes anything *above* the floor; it never reshapes the floor. A top-performing post that violates a brand/safety/claims floor is not adopted as a pattern: distill it as **"performs but violates floor — not adopted"** (in `docs/forsvn/experience/marketing/`, with the evidence cited), so the finding is preserved without the floor eroding. This is the same rule that governs rubric evolution: performance evidence never re-tightens or relaxes a floor.

## Query Helper

`query-performance.ts` is the single read path (internal `_dev/` tooling until its first consumer wires it; promoted into each consuming skill's scripts dir via the `SUPPORT_SCRIPTS` sync map at that point — it never ships consumer-less). It owns: schema-header validation, keyless-row rejection, latest-`imported_at` dedupe, the decay window, the state computation, and top/bottom-N ranking with `format`/`placement` filters. An empty store is a typed empty result, not an error — first-run is a normal state.

## Ownership

This contract owns the store layout, key, lifecycle, join rule, thresholds, precedence, and floor-supremacy rules. The write paths (publish-side ledger rows, metric-ingest store appends) and read paths (producer grounding steps) live in the consuming skills and cite this file. It versions with the skills that cite it (no standalone version field).
