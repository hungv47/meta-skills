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

## The recall line (required output)

Grounding that is only *obeyed* is invisible — the operator can't tell the producer remembered. So the producer must **show the recall** in its output, the same way the Legibility block shows which pack it applied. This is the "it remembers and improves" surface; do not bury it in reasoning. Emit a **Recall** line (extend the grounding/Legibility surface you already emit — not a new top-level section) with two parts, by state:

### `sufficient` (≥ floor)
```
**Recall — your own history**
- linkedin: 11 measured posts (90d) — text posts out-engage carousels for you (n=11). This draft leans text-first, per your own data.
- Open question this run probes: does a sub-8am post lift reach? (pack §8 Open Questions) — measure it to close the loop.
```

### `sparse` (1 to floor−1)
```
**Recall — your own history**
- linkedin: 3 measured posts — too few to call a pattern (anecdote). Using priors; your data only colors examples.
- Open question to start closing: which hook type holds attention for you? (pack §8) — this run begins building that signal.
```

### `empty` (0 rows)
```
**Recall — your own history**
- linkedin: no measured posts yet — using platform priors only.
- Open question to start closing: <one from the pack's Open Questions> — measure this run to begin your own signal.
```

Rules:
- **Real `n`, never fabricated.** The count comes from the helper's `eligibleRows`. `empty`/`sparse` say so plainly — an invented "your data shows…" on a near-empty store is a lie and a gate failure of this convention (mirrors legibility rule 2).
- **State X as direction, not a checklist.** The own-data half restates the helper's account-specific finding as direction (the two hard rules below still bind); cite the count so it's checkable.
- **One open question, cited.** Read the loaded pack's `## Open Questions` section and name **one** unknown as the experiment this run probes — prefer the one the store can't yet answer (so the run is *building* the data that would). Cite the pack section (`pack §8`). No pack / no Open Questions section → drop the open-question part (don't fabricate one); keep the own-data part.
- **Mirror to frontmatter.** Producers already carrying `pack_verified` / `applied_tactics` add `own_data_state` (`empty | sparse | sufficient`) and `own_data_n` (integer) so a reviewer (and `measure-results`) can read the recall without re-parsing the body.

## Two hard rules

- **Direction, not element lists.** Data narrows the search; it never becomes a prescriptive shot / hook / element checklist. The U12 creativity loosening applies to data-derived guidance too — the producer still creates.
- **Brand floor outranks performance data — always.** A top performer that violates a brand / safety / claims floor is **not adopted**; it is distilled as "performs but violates floor — not adopted" in `docs/forsvn/experience/marketing/` (`performance-learnings.md`). Performance evidence never relaxes a floor.

Full store layout, snapshot key, ledger lifecycle, decay window, and precedence: `performance-data.md`.
