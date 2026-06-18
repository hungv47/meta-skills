# Format Conventions — produce-ooh

## Artifact frontmatter (11 fields — v3 contract)

```yaml
skill: produce-ooh
version: 1
date: YYYY-MM-DD
stack: marketing
type: execution
id: ooh-<ooh_type>-<slug>
review_surface: md
status: done | done_with_concerns | blocked | needs_context
ooh_type: billboard | transit | poster | wrap
execution_mode: brief-only | assisted | direct   # per execution-fork.md (this skill specs; an engine renders)
keywords: [ooh, out-of-home, <ooh_type>, billboard]
```

Conforms to `references/_shared/artifact-contract-template.md`.

## Body sections (in order)

1. **`## Concept`** — the one idea · the dominant visual device · the line · why it earns the glance.
2. **`## OOH Spec`** — dimensions · aspect · bleed · resolution/DPI · minimum type size (with the distance math) · contrast pair · safe margins. Trace dimensions to the vendor template.
3. **`## Copy`** — the line(s), within the placement's word ceiling (≤7 for highway).
4. **`## Render Manifest`** — render-ready prompt + asset slots (logo / image / type). Pixels come from an operator-connected engine (`references/_shared/execution-fork.md`); record `execution_mode`.
5. **`## Production Notes`** — substrate/material · lighting (backlit changes contrast) · lead time.
6. **`## Critic Verdict`** — 6-row table (5 dims + total).

## Rules
- Letter-height rule of thumb: ~1 inch per 10 ft of viewing distance; increase for traffic speed.
- Nothing critical in the bleed; route detail to a destination, not the board.
- The vendor template is the source of truth for size/bleed/DPI — never guess.
