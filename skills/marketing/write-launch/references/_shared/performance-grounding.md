<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Performance Grounding — producer read step

> The pre-generation step that grounds marketing producers (`write-social`, `write-ad`, `brief-shortform`, `plan-campaign`) in the operator's own channel history before they generate. Cite this file from the producer; the full store/ledger/read rules live in `performance-data.md`.

## The step

Before generating, for **each target channel**, run the mirrored query helper (never re-derive sufficiency from raw rows — the helper owns the decay window + state):

```bash
bun scripts/query-performance.ts <platform> --json     # write-ad adds --placement paid
```

Obey the emitted `state` + `guidance`:

| State | Behavior |
|---|---|
| `empty` | Platform-intelligence priors only. Say so in the output: "no own data yet — using priors." |
| `sparse` (1 to floor−1) | Own data is **anecdote** — it may color examples, never override priors or shift budget weighting. Two posts are not a trend. |
| `sufficient` (≥ floor) | Own data **wins account-specific calls** (which format / topic / hook / channel works for *this* account); platform-intelligence priors keep platform-mechanics calls (length caps, format rules, distribution). |

A filtered subset (`--format` / `--placement`) below the floor is anecdote-weight even inside a `sufficient` channel — the helper flags it. The paid filter never returns organic rows and vice versa.

## Two hard rules

- **Direction, not element lists.** Data narrows the search; it never becomes a prescriptive shot / hook / element checklist. The U12 creativity loosening applies to data-derived guidance too — the producer still creates.
- **Brand floor outranks performance data — always.** A top performer that violates a brand / safety / claims floor is **not adopted**; it is distilled as "performs but violates floor — not adopted" in `docs/forsvn/experience/marketing/` (`performance-learnings.md`). Performance evidence never relaxes a floor.

Full store layout, snapshot key, ledger lifecycle, decay window, and precedence: `performance-data.md`.
