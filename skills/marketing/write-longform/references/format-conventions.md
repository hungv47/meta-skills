# Format Conventions — Write Longform

[PROCEDURE] — artifact template, frontmatter, the source-ledger schema. Loaded at artifact-assembly time.

## Output path

```
docs/forsvn/artifacts/marketing/write-longform/[piece-type]-[date]-[slug].md
```

`[piece-type]` ∈ `blog | pillar | essay`. Pipeline lifecycle — re-run on thesis change, new evidence, or a search-intent shift.

## Frontmatter (required — validate-artifacts --strict)

```yaml
---
skill: write-longform
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: md
id: write-longform-<slug>
type: pipeline
keywords: [longform, pillar, content, blog, <topic-keyword>]
decision_state: not_required
review_tool: inline
reviewed_at:
reviewer:
piece_type:                   # blog | pillar | essay
thesis:                       # the ownable claim the piece defends (string)
word_count:                   # integer
critic_total:                 # integer /49
originality_score:            # integer /7 — the anti-collapse floor result (must be ≥5 for done)
---
```

The four base required + the two v2 mandatories (`stack`, `review_surface`) + the v3 instruction core (`id`, `type`, `keywords`). `piece_type`, `thesis`, `word_count`, `critic_total`, `originality_score` are skill-specific selection fields `evaluate-content` / `optimize-seo` read.

## Body section order

1. `## Source Ledger` — the research agent's Evidence Ledger (every claim → source/tag), kept with the artifact so claims are auditable.
2. `## Consensus Baseline` — what the first page of search already says (the originality is measured against this).
3. `## Outline` — the committed argument spine + sections (so structure is reviewable).
4. `## Piece` — the full draft (the deliverable).
5. `## Critic Scorecard` — 7-dim table + total + the Originality-floor result + hard-gate checklist.
6. `## Rationale` — assembly notes + any DONE_WITH_CONCERNS flags + the humanmaxxing handoff note.

## Source-ledger schema (load-bearing — evaluate-content + the cited-or-marked gate read it)

The `## Source Ledger` table:

| Column | Required | Meaning |
|--------|----------|---------|
| # | yes | claim id, referenced inline in the Piece |
| Claim | yes | the statement it backs |
| Evidence | yes | data / study / example / expert view |
| Source / tag | yes | real citation OR `[author-assertion]` / `[pattern-derived]` |
| Strength | yes | strong / moderate / weak |

A claim in the Piece with no ledger # and no inline `[tag]` is a contract violation — the critic FAILs it (cited-or-marked hard gate).

## Cross-stack contract

Schema changes require an atomic update of this file's "Source-ledger schema" + "Frontmatter" sections AND the `evaluate-content` consumer (it reads `thesis`, `critic_total`, `originality_score`, and the Source Ledger to score the published piece).
