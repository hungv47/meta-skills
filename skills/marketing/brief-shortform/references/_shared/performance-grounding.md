<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Performance Grounding — producer read step

> The pre-generation step that grounds marketing producers (`write-social`, `write-ad`, `brief-shortform`, `plan-campaign`) in the operator's own channel history before they generate. Cite this file from the producer; the full store/ledger/read rules live in `performance-data.md`.

## The step

Before generating, for **each target channel**, run the mirrored query helper (never re-derive sufficiency from raw rows — the helper owns the decay window + state):

```bash
bun scripts/query-performance.ts <platform> --json     # write-ad adds --placement paid
```

The helper emits a continuous **`weight = n / (n + k)`** (n = eligible in-window rows,
k = prior strength, default 8) alongside a 3-state `state` label and a `guidance` line.
**`weight` is the value you blend with**; the state label is a human-readable bucket.
Own-data does not snap on at a hard row count — it blends in smoothly, so a small sample
*structurally cannot* move the prior much:

| n (eligible rows) | weight | What it means |
|---|---|---|
| 0 | 0.00 | pure prior — no own data; platform-intelligence priors only |
| 2 | 0.20 | anecdote-weight — colors examples, never overrides priors |
| 8 | 0.50 | own-data and prior weigh equally (the former hard floor) |
| 24 | 0.75 | own-data leads account-specific calls |
| large | →1.00 | own-data dominates |

**Blend rule.** For an account-specific call (which format / topic / hook / channel works
for *this* account): `effective = weight × own-data direction + (1 − weight) × prior`.
Below `weight 0.5` (n < k) the own-data finding is **anecdote-weight** — it may color
examples, never override priors. Platform-mechanics calls (length caps, format rules,
distribution) always stay with the priors regardless of weight.

The 3-state label still buckets the curve for legibility (the Recall blocks below cite it):
`empty` = weight 0, `sparse` = weight below 0.5, `sufficient` = weight ≥ 0.5. A filtered
subset (`--format` / `--placement`) below the floor is anecdote-weight even inside a
`sufficient` channel — the helper flags it. The paid filter never returns organic rows
and vice versa. `k` is read from `.forsvn/performance/thresholds.json` (`shrinkage_k`,
default 8); a per-invocation `--k N` overrides it.

## The recall line (required output)

Grounding that is only *obeyed* is invisible — the operator can't tell the producer remembered. So the producer must **show the recall** in its output, the same way the Legibility block shows which pack it applied. This is the "it remembers and improves" surface; do not bury it in reasoning. Emit a **Recall** line (extend the grounding/Legibility surface you already emit — not a new top-level section) with two parts, by state:

### `sufficient` (weight ≥ 0.5)
```
**Recall — your own history**
- linkedin: 11 measured posts (90d, weight 0.58) — text posts out-engage carousels for you (n=11). This draft leans text-first, blended at your own-data weight.
- Open question this run probes: does a sub-8am post lift reach? (pack §8 Open Questions) — measure it to close the loop.
```

### `sparse` (weight below 0.5)
```
**Recall — your own history**
- linkedin: 3 measured posts (weight 0.27) — too few to call a pattern (anecdote-weight). Mostly priors; your data only colors examples.
- Open question to start closing: which hook type holds attention for you? (pack §8) — this run begins building that signal.
```

### `empty` (weight 0)
```
**Recall — your own history**
- linkedin: no measured posts yet (weight 0) — using platform priors only.
- Open question to start closing: <one from the pack's Open Questions> — measure this run to begin your own signal.
```

Rules:
- **Real `n` and `weight`, never fabricated.** Both come straight from the helper (`eligible_rows`, `weight`). Report both in the Recall line so the blend is checkable. `empty`/`sparse` say so plainly — an invented "your data shows…" on a near-empty store is a lie and a gate failure of this convention (mirrors legibility rule 2).
- **Blend at `weight`, don't snap.** The own-data half restates the helper's account-specific finding as direction blended at `weight` (the two hard rules below still bind); `weight < 0.5` is anecdote-weight (color examples only). Cite `n` + `weight` so it's checkable.
- **One open question, cited.** Read the loaded pack's `## Open Questions` section and name **one** unknown as the experiment this run probes — prefer the one the store can't yet answer (so the run is *building* the data that would). Cite the pack section (`pack §8`). No pack / no Open Questions section → drop the open-question part (don't fabricate one); keep the own-data part. This line is **mandatory every run** — exploration must not die as exploitation gets smoother.
- **Mirror to frontmatter.** Producers already carrying `pack_verified` / `applied_tactics` add `own_data_state` (`empty | sparse | sufficient`), `own_data_n` (integer), and `own_data_weight` (the blended `weight`) so a reviewer (and `measure-results`) can read the recall without re-parsing the body.

## Two hard rules

- **Direction, not element lists.** Data narrows the search; it never becomes a prescriptive shot / hook / element checklist. The U12 creativity loosening applies to data-derived guidance too — the producer still creates.
- **Brand floor outranks performance data — always.** A top performer that violates a brand / safety / claims floor is **not adopted**; it is distilled as "performs but violates floor — not adopted" in `docs/forsvn/experience/marketing/` (`performance-learnings.md`). Performance evidence never relaxes a floor.

Full store layout, snapshot key, ledger lifecycle, decay window, and precedence: `performance-data.md`.
