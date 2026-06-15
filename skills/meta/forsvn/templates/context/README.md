---
kind: context-root
lifecycle: canonical
read-by: all marketing + product + research skills (pre-dispatch)
written-by: /forsvn (autodraft) + user (review and edit)
---

# `.forsvn/context/` — Working Context Root

The **canonical product context now lives in the TRUTH layer at `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`** (promoted 2026-05-30 — "replace, not coexist"), read before any skill dispatch to prevent repeated cold-start questions. This `context/` dir holds only ad-hoc working notes that have not hardened into a canonical source.

## Files

- `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` — the canonical product context (autodrafted on first `/forsvn` invocation; user reviews and promotes to `status: done`)

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

1. `/forsvn` autodrafts `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` from `README.md`, `package.json`, `brand/BRAND.md`, `research/icp-research.md`, `research/market-research.md`, landing pages — whichever exist.
2. Drafts land with `status: needs_context` (unratified).
3. Promoted to `status: done` (canonical) only after user review.
4. Skills must check `status:` and treat anything other than `done` as "ask the user to confirm before generating."

## What This Is Not

This is a **summary for dispatch**, not a replacement for canonical research. `research/icp-research.md` and `research/market-research.md` remain the deep sources. `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` is the operational digest.
