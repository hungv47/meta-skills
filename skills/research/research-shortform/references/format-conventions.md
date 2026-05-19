---
title: Short-Form Research — Format Conventions
lifecycle: canonical
status: stable
produced_by: short-form-research
load_class: PROCEDURE
---

# Format Conventions

**Load when:** synthesis-agent is composing the artifact OR critic agent is verifying citation/sample-size formatting. These conventions are enforced by critic rubrics #1 + #2.

---

## Date format

All dates ISO 8601 (`YYYY-MM-DD`). No locale variants, no "May 17, 2026" prose. Frontmatter date fields + inline `last_updated` citations both use this format.

## URL handling

**Preserve query parameters.** Don't strip `?si=` (TikTok share-id), `?utm_source=`, or other platform tracking — they're part of the canonical URL and breaking them sometimes breaks the link.

**Use the platform's canonical form when possible:**
- TikTok: `https://www.tiktok.com/@username/video/[id]`
- Reels: `https://www.instagram.com/reel/[shortcode]/`
- Shorts: `https://www.youtube.com/shorts/[id]`
- X video: `https://x.com/username/status/[id]`
- LinkedIn video: `https://www.linkedin.com/posts/[username]_[slug]-activity-[id]`

## Citation format (numerical claims)

Inline cite at point of claim, not in a footnote:

```
"70% completion threshold ([TikTok Creator Portal — Algorithm Updates, last_updated 2026-04-12](url))"
```

Pattern: `"<claim> ([<source name> — <doc title>, last_updated <YYYY-MM-DD>](<url>))"`.

For video-ID citations:

```
"credential-flash archetype in 0–1.5s ([TikTok video by @username, 2026-05-08](url))"
```

Pattern: `"<observation> ([<platform> video by <handle>, <posted YYYY-MM-DD>](<url>))"`.

## Sample-size flag

Always declared with flag, never just a number:

- `SAMPLE: OK (n=12)` — n≥8
- `SAMPLE: LOW_SAMPLE (n=5)` — n=3-7, brief skill carries warning
- `SAMPLE: INSUFFICIENT_DATA (n=2)` — n<3, no pattern claims, only observed examples

Flag placement: at the end of each Per-Platform Findings section, on its own line.

## Per-platform section order

Always in this order (skip absent platforms; never reorder):

1. TikTok
2. Instagram Reels
3. YouTube Shorts
4. X video (opt-in)
5. LinkedIn video (opt-in)

Downstream parsers (`brief-shortform`, `evaluate-shortform`) read sections positionally — reordering breaks them.

## Frontmatter field order

Per the Output Artifact Structure block in SKILL.md body. Required fields:

```yaml
type: short-form-research
status: done | done_with_concerns | blocked | needs_context
date: YYYY-MM-DD
topic: <free text>
market: <region or 'global'>
platforms_analyzed: [list]
platform_mechanics_date: YYYY-MM-DD
mechanics_sources_verified: [list of {source, url, last_updated}]
trend_signals_date: YYYY-MM-DD
sample_size_per_platform: {per-platform: {n, flag}}
icp_referenced: yes | no — using cold-start audience hint
```

## Body section headers (verbatim)

The 8 body sections appear in this order with these exact headers (downstream parsers match on H2):

1. `## TL;DR`
2. `## Audience Fit`
3. `## Per-Platform Findings`
4. `## Cross-Platform Comparison`
5. `## Trending Audio` (conditional — only if TikTok or Reels in scope)
6. `## Recommendations for short-form-brief`
7. `## Open Risks & Caveats`
8. `## What This Research Doesn't Cover`

Per-platform subsections under §3 use H3 with the platform name (e.g., `### TikTok`).

## When critic catches a format violation

Critic FAIL → re-dispatch synthesis-agent with the specific format rule cited. Format violations are rubric #1 (citation) or rubric #2 (sample-size flag) failures — both are usually one-shot fixes; do not loop past cycle 1 for format-only issues.
