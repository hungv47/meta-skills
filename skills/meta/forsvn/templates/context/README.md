---
kind: context-root
lifecycle: canonical
read-by: all marketing + product + research skills (pre-dispatch)
written-by: /forsvn (autodraft) + user (review and edit)
---

# `.forsvn/context/` — Shared Product Context

The 12-section product-marketing context read before any skill dispatch. Prevents repeated cold-start questions across skills.

## Files

- `product-context.md` — the canonical 12-section document (created on first `/forsvn` invocation; user reviews and edits)

## The 12 Sections (per brief 01)

1. Product overview
2. Target audience
3. Personas and buying roles
4. Problems and pain points
5. Competitive landscape
6. Differentiation
7. Objections and anti-personas
8. Switching dynamics
9. Customer language
10. Brand voice
11. Proof points
12. Goals

## Authoring Protocol

1. `/forsvn` autodrafts from `README.md`, `package.json`, `brand/BRAND.md`, `research/icp-research.md`, `research/market-research.md`, landing pages — whichever exist.
2. Drafts land with frontmatter `status: draft, source: autodraft`.
3. Marked `status: canonical` only after user review.
4. Skills must check `status:` and treat `draft` as "ask the user to confirm before generating."

## What This Is Not

This is a **summary for dispatch**, not a replacement for canonical research. `research/icp-research.md` and `research/market-research.md` remain the deep sources. `context/product-context.md` is the operational digest.
