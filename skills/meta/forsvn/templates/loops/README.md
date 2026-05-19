---
kind: loops-root
lifecycle: loop
read-by: /forsvn (resume), eval-loop, evaluation skills
written-by: eval-loop (scaffold), generative + evaluation skills (per-cycle)
---

# `.forsvn/loops/` — Measurable Strategy → Execution → Evaluation Cycles

Each measurable initiative gets a folder. Inside, the loop is the unit of iteration — not the skill.

Replaces the previously planned `.forsvn/loops/`. Same contract per `references/eval-loop-spec.md`, new home.

## Layout

```
loops/
└── <loop-slug>/
    ├── program.md      # loop operating contract (hypothesis, success metric, cadence)
    ├── context.md      # local assumptions, baselines, constraints
    ├── strategy/       # plans, hypotheses, briefs, test designs
    ├── execution/      # publish-ready assets
    ├── evals/          # post-execution metric snapshots, scoring
    ├── results.tsv     # compact keep/discard/watch/blocked ledger
    └── learnings.md    # promoted reusable lessons (eventually graduate to ../experience/patterns.md)
```

## When to Create a Loop

Create when ALL three hold:
1. There is a **measurable outcome** (CTR, conversion, replies, signups, watch-through).
2. The work is **iterative** — at least two cycles planned.
3. The result will **inform future strategy** — not a one-off launch.

If any fails, use `artifacts/<initiative>/` instead. Don't loop-scaffold for one-shots.

## Loop Slug Convention

`<surface>-<focus>` — e.g., `tiktok-launch-hook`, `cold-email-warm-list`, `lp-pricing-headline`. Reads as a sentence.

## Results.tsv Format

Tab-separated, append-only. Columns:

```
cycle	date	hypothesis	verdict	confidence	notes
1	2026-05-19	short hooks beat long	keep	high	3-word hooks +28% completion
2	2026-05-26	emoji hurts trust	discard	medium	null result, n too low
```

Verdicts: `keep` | `discard` | `watch` | `blocked`.

## Promotion to Pattern

Entries with verdict `keep` + confidence `high`, recurring across ≥2 loops, get promoted to `../experience/patterns.md`. Done by `/forsvn` or the relevant eval skill.

See `references/eval-loop-spec.md` for the full contract.
