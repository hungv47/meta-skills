# Pre-Dispatch — Write Longform

[PROCEDURE] — Cold Start, Missing-Input Hard Blocks, write-back map. Loaded at Pre-Dispatch entry.

## Needed dimensions

| Dimension | Required | If missing |
|-----------|----------|------------|
| **topic** | hard | BLOCK — ask |
| **ownable thesis** | hard | BLOCK — ask: what ONE non-obvious claim should this piece defend? (a topic without a thesis is a how-to → write-copy) |
| **target reader** | hard | BLOCK — ask: role + awareness stage |
| piece-type (blog / pillar / essay) | recommended | default pillar; note assumption |
| target length | recommended | default to "as long as the argument needs"; flag if a fixed count is imposed |
| search intent (SEO-anchored?) | recommended | proceed non-SEO; if SEO, recommend pairing with optimize-seo's topic map |
| proprietary angle | recommended | the research agent searches for it; if none found → may BLOCK as not-pillar-worthy |

## Cold Start (when context is thin)

Ask up to 5, stopping when the three hard dimensions resolve:

1. What's the topic, and who's the reader (role + how much do they already know)?
2. What ONE non-obvious thing should this piece argue — the claim a reader takes away?
3. What can YOU bring that the first page of Google can't — a frame, your own data, hard-won experience, a contrarian take?
4. Is this SEO-anchored (targeting a search term) or a standalone essay?
5. Blog post, pillar page, or essay — and any length target?

## Missing-Input Hard Blocks (never proceed)

1. **No topic / no thesis** → ask. A topic with no ownable argument is a how-to; route to `write-copy` if the user wants that.
2. **No target reader** → ask. Reader-fit can't be scored without it.
3. **No proprietary angle findable** (after research) → `BLOCKED` / `DONE_WITH_CONCERNS`: be honest that the topic may not support a pillar; offer a how-to via write-copy instead. Never pad a consensus piece to "make it work."
4. **A fixed word count with no argument to fill it** → flag: length follows the argument; don't pad to a count.

## Write-back map (experience layer)

On completion, persist to `docs/forsvn/experience/marketing/*.md` (append-only):
- `Longform — owned theses` = theses this product has published (so future pieces don't repeat or contradict).
- `Longform — proprietary frames` = coined frames/models reused across pieces (consistency).
- `Longform — consensus baselines` = the consensus maps gathered (reused, not re-researched).

## `--fast` behavior

research-lite → outline → single draft, no rewrite loop. **Does NOT skip** the three hard blocks, the research-before-outline order, the cited-or-marked gate, or the Originality floor.
