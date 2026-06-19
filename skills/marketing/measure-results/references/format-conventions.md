# Format Conventions — measure-results

## Artifact frontmatter (12 fields, verbatim — v3 artifact contract)

```yaml
skill: measure-results
version: 1                      # artifact-schema version (integer)
date: YYYY-MM-DD
stack: marketing
type: evaluation
id: measure-<channel>-<slug>    # stable kebab id, unique
review_surface: md
status: done | done_with_concerns | blocked | needs_context
channel: producthunt | x | reddit | facebook | linkedin | ...
pack_verified: <YYYY-MM-DD or none>   # the channel pack's last_verified (legibility)
applied_tactics: [<tactic>, ...]      # tactics the read attributed against (empty if no pack)
keywords: [measure, <channel>, launch, loop]
```

Conforms to `references/_shared/artifact-contract-template.md`. `validate-artifacts --strict` enforces it.

## Body sections (in order)

1. **`## Results`** — the normalized metrics table (metric · value · unit · vs-expected · confidence) + a `Gaps` line for missing metrics.
2. **`## What Worked`** — each line: tactic (pack §) + the supporting number + confidence class.
3. **`## What Failed`** — symmetric; skipped §5 steps / hit §4 anti-patterns / missed targets, each costed.
4. **`## Keep / Drop / Test`** — concrete next-launch actions; Test items phrased as hypotheses.
5. **`## Hypothesis Verdicts`** — each launch hypothesis: confirmed / refuted / inconclusive + number.
6. **`## Pack Write-Back`** — the exact changelog row(s) appended to the channel pack (mirrors the on-disk append).
7. **`## Legibility`** — pack loaded + `last_verified` + attributed tactics, or the transparent-degrade statement (no pack).
8. **`## Critic Verdict`** — 6-row table (5 dims + total).

## Pack write-back (the loop closer)

On critic PASS, **append** (never overwrite) to the channel pack
`references/platform-intelligence/[channel].md` <!-- lint:reference-ok exemplary per-channel pack path ([channel] = producthunt|x|reddit|…) -->:
- a `## Changelog` row: `| YYYY-MM-DD | Launch read: <one line — what confirmed/refuted, the number> | measure-results |`
- optionally a short evidence note under the relevant §5/§3 heading, clearly marked as a launch observation (not a rewrite of the tactic).

Then run `node _dev/sync-skill-support.mjs` so the appended pack mirrors into consumers. Promoting a confirmed learning into the tactic *text* is a deliberate operator verify step — not automated here (anti-pattern 8).

## Performance row (local store)

Append one row to `.forsvn/performance/[channel].tsv` per the schema in
`references/_shared/performance-data.md` (date, channel, slug, metric columns, confidence). This is operator-fed data, exempt from the artifact contract.

## Hosted metrics feed (best-effort)

Mirror the result to the cross-session metrics feed with `bun scripts/forsvn-hosted.ts metrics [channel] --worked "..." --failed "..." [--numbers '{"reach":1200}']` (POSTs `/v1/metrics` with `{platform, what_worked, what_failed, numbers}`) so it compounds cross-session. Inert without a key / unreachable → skips silently — the local write-back is the source of truth, the feed is the mirror. Never blocks (anti-pattern 7).
