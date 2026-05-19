---
title: Short-Form Eval — Format Conventions
lifecycle: canonical
status: stable
produced_by: short-form-eval
load_class: PROCEDURE
---

# Format Conventions

**Load when:** pattern-extractor or eval-runner is composing the artifact OR critic is verifying citation/score-justification/pattern-block formatting. These conventions are enforced by critic rubrics #1, #2, #3.

---

## Date format

All dates ISO 8601 (`YYYY-MM-DD`). No locale variants. Frontmatter `date:` + cycle filename (`[YYYY-MM-DD]-cycle-N.md`) + inline citations all use this format.

## URL handling

**Preserve query parameters.** Don't strip `?si=` (TikTok share-id), `?utm_source=`, or other platform tracking — they're part of the canonical URL.

**Use the platform's canonical form** (same as `short-form-research/format-conventions.md`):
- TikTok: `https://www.tiktok.com/@username/video/[id]`
- Reels: `https://www.instagram.com/reel/[shortcode]/`
- Shorts: `https://www.youtube.com/shorts/[id]`
- X video: `https://x.com/username/status/[id]`
- LinkedIn video: `https://www.linkedin.com/posts/[username]_[slug]-activity-[id]`

## Citation format (numerical claims)

Inline cite at point of claim, never in a footnote:

```
"saves/likes ratio 0.34 ([post panel screenshot 2026-05-09 09:14, archived at <path>](path))"
```

Pattern: `"<claim> ([<source description, YYYY-MM-DD timestamp>, archived at <path>](<url-or-path>))"`.

For URL-only citations (post body content quoted, etc.):

```
"opening line 'Three things nobody told me about...' ([source post](url))"
```

## Rubric score format

Always declared as `[score]/3 — [one-sentence falsifiable justification]`. Examples:

```
brief-fidelity: 2/3 — Hook archetype matched (credential-flash); pacing diverged 0-1.5s vs brief's 0-3s. Falsifiable: brief explicitly said 0-3s window.
hook-strength-vs-platform-intel: 3/3 — Credential-flash matched catalog dominant archetype (n=12 OK in TikTok §3). Falsifiable: catalog row TikTok hook archetypes.
pattern-log-entry-shape: 3/3 — Block has Claim+Evidence+Refutability+Expiry per `format-conventions.md`. Falsifiable: section §5 inspection.
platform-signal-freshness-flag: 2/3 — Catalog `trend_signals_date: 2026-04-21` (16d ago, warn-window not exceeded). Falsifiable: catalog frontmatter.
author-discretion: 2/3 — Eval-runner's read: post landed despite caption length mismatch. Lower weight per playbook principle. Falsifiable: subjective by design.
```

The justification must be **falsifiable** — naming what evidence would change the score. "Vibes-based" justifications fail critic rubric #2.

## Pattern-log entry shape (canonical 4-line block)

The §5 Pattern-Log Entry MUST use this exact shape — no free-form prose:

```markdown
### Pattern: [short name, kebab-case]

**Claim:** [what this cycle suggests is true — one sentence, specific, platform-tagged]

**Evidence:** [URLs, metrics, citations — bullet list with sources]

**Refutability:** [what would prove this wrong in a future cycle — one sentence, concrete condition]

**Expiry:** [conditions or timeframe after which this claim should be re-tested — e.g., "catalog refresh," "30 days," "next cycle on this brief tier"]
```

Critic rubric #3 inspects this block. Free-form prose patterns FAIL → re-dispatch pattern-extractor.

## Cycle index

Always declared in:
1. **Filename:** `[YYYY-MM-DD]-cycle-N.md`
2. **Frontmatter:** `cycle: N`
3. **`results.tsv`** row (handled by `append-loop-result.ts`)

The three must agree. Mismatch → critic FAIL → re-dispatch.

## Frontmatter field order

Per the Output Artifact Structure block in SKILL.md body. Required fields (in order):

```yaml
type: short-form-eval
status: done | done_with_concerns | blocked | needs_context
date: YYYY-MM-DD
cycle: N
loop: <slug>
post_url: <url>
brief_path: <path>
catalog_path: <path>
catalog_freshness: fresh | warn | stale
topic: <from brief>
market: <from brief>
platform: tiktok | reels | shorts | x | linkedin
rubric_version: "0.1"
rubric_status: provisional
weighting: cycle-1-70-obs-30-score | cycle-2-plus-balanced
scores: {brief-fidelity, hook-strength-vs-platform-intel, pattern-log-entry-shape, platform-signal-freshness-flag, author-discretion}
```

## Body section headers (verbatim)

The 7 body sections appear in this order with these exact headers (downstream consumers match on H2):

1. `## TL;DR`
2. `## Observation`
3. `## Brief vs Observed`
4. `## Rubric Scores (v0.1, provisional)`
5. `## Pattern-Log Entry`
6. `## Open Risks & Caveats`
7. `## Recommendations for next cycle / catalog`

## When critic catches a format violation

Critic FAIL → re-dispatch the named source agent with the specific format rule cited. Format violations are usually one-shot fixes; do not loop past cycle 1 for format-only issues.
