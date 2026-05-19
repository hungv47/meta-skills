---
title: User-Flow — Report Template
lifecycle: canonical
status: stable
produced_by: user-flow
load_class: PROCEDURE
---

# Report Template

**Load when:** Layer 2b critic PASS → Assembly. Save the per-flow artifact to `.agents/skill-artifacts/product/flow/<flow-name>.md`. Re-run of same flow: rename existing `<flow-name>.md` → `<flow-name>.v[N].md`, create new `<flow-name>.md` with incremented version. Multi-flow products: run once per flow — each creates its own file. After any run yielding ≥2 **distinct slugs** (excluding `.v[N]` versioned files) in the directory, orchestrator auto-creates/updates `.agents/skill-artifacts/product/flow/index.md` (template below). Versioned files sit next to live ones and are excluded from slug count and index.

---

## Per-flow file

Baseline required frontmatter: `skill`, `version`, `date`, `status`, `flow_name`, `platforms`.
Step 7.5 additions (manifest-sync conformance; backfilled going forward): `lifecycle`, `produced_by`, `provenance`.

```markdown
---
skill: user-flow
version: 1
date: {{today}}
status: done | done_with_concerns | blocked | needs_context
flow_name: [slug, matches filename]
platforms: [macOS, iOS, web-desktop, ...]
# Step 7.5 fields (artifact-graph hardening; backfilled going forward):
lifecycle: pipeline
produced_by: user-flow
provenance:
  skill: user-flow
  run_date: {{today}}
  input_artifacts:
    - research/product-context.md
    - brand/DESIGN.md  # if present
---

# User Flow: [Flow Name]

## Context
- **Product:** [product/feature]
- **User:** [role/persona]
- **Goal:** [single user goal]
- **Platforms:** [explicit list — e.g., macOS 13+, iOS 17+, web-desktop]
- **Flow type:** [linear/branching/cyclical/hub-and-spoke]

## Target Platforms & Surfaces

Matrix of every surface the flow occupies. Surfaces not listed are explicitly out of scope. Primary surface per platform marked ★.

| Platform | Primary surface ★ | Other surfaces in scope | Out-of-scope surfaces (explicit) |
|----------|-------------------|-------------------------|----------------------------------|
| [platform] | ★ [surface] | [surface · surface · ...] | [surface · surface · ...] |

### Cross-platform channels in scope
- [ ] Email / SMS / Push / Calendar / Clipboard / In-app / Third-party chat *(check all that apply; pull from catalog)*

## Flow Diagram

​```mermaid
graph TD
    [diagram here]
​```

**Annotations:**
1. [Node]: [implementation detail or business rule]

## Per-Surface Entry Points

One row per platform × surface from the matrix above.

| Platform | Surface | Entry trigger | Pre-loaded state | Auth required | First screen in flow | Handback when flow ends |
|----------|---------|--------------|-------------------|----------------|----------------------|--------------------------|
| [platform] | [surface] | [concrete trigger from catalog] | [data loaded before UI shows] | [yes/no/optional] | [screen name] | [where focus/state goes] |

## Screen Inventory

| # | Screen | Purpose | Actions | Next States |
|---|--------|---------|---------|-------------|
| 1 | [concrete name] | [why it exists] | [user actions] | [where each action leads] |

## Screen Wireframes

*Low-fidelity ASCII layouts — one per core screen. Shows regions and hierarchy, not brand design. Pair with `brand-system` for visual tokens.*

### Screen 1: [Name]

**Primary actions (≤3):** [action 1] · [action 2] · [action 3]
**Description:** [2-4 sentences — content/data, visual priority, mood. Designer-ready.]

​```
┌──────────────────────────────────────┐
│ [ wireframe ]                        │
└──────────────────────────────────────┘
​```

[Repeat for every screen in the inventory]

## Per-Surface Mini-Frames

*One ASCII mini-frame per selected surface, rendered at the surface's native dimensions. See `references/platform-touchpoints.md` for dimensions per surface.*

### [Platform] — [Surface name] ([native dimensions])

**Why this surface carries this flow:** [one line]

​```
┌──────────────────────────────┐
│  [ mini-frame ]              │
└──────────────────────────────┘
​```

[Repeat for every selected surface from the matrix. For multi-state surfaces (Dynamic Island compact/expanded, widget small/medium/large), include a mini-frame per state.]

## Critical Edge-State Variants

*2-3 high-stakes edge states across the whole flow — not one per screen.*

**Variant: [Screen — State]**

**Why this variant matters:** [one line]

​```
┌──────────────────────────────────────┐
│ [ variant wireframe ]                │
└──────────────────────────────────────┘
​```

## Coverage Map

| # | Screen | Wireframed | Edge variant(s) |
|---|--------|------------|-----------------|
| 1 | [name] | ✓ | — or [state] |

## Surface Coverage Map

| Platform | Surface | Entry defined ✓ | Mini-frame ✓ | Edge states ✓ |
|----------|---------|-----------------|--------------|----------------|
| [platform] | [surface] | ✓ | ✓ | ✓ |

## Edge Cases Handled

| State | Screen(s) | Handling |
|-------|-----------|----------|
| Error | [screens] | [recovery path] |
| Empty | [screens] | [placeholder/onboarding] |
| Loading | [screens] | [skeleton/spinner] |
| Permission | [screens] | [upgrade/redirect] |

## Per-Surface Edge States

Surface-specific failure modes that generic error/empty/loading don't capture. Pull candidates from the "Edge states to check" column of `references/platform-touchpoints.md` for each declared surface.

| Platform | Surface | Edge state | Handling |
|----------|---------|------------|----------|
| [platform] | [surface] | [surface-specific failure mode] | [recovery path] |

## Validation Summary

- Happy path length: [N steps]
- Decision points: [N total]
- Error recovery paths: [N total]
- Dead ends: 0
- Platforms × surfaces covered: [N]
- Surfaces with mini-frames: [N / total]
- Surfaces with per-surface edge states: [N / total]

## Sub-flows

- [Sub-flow name] → see `.agents/skill-artifacts/product/flow/[slug]-[sub].md`

## Next Step

Hand off to implementation. Pair with `brand-system` for visual design tokens if not already created.
```

## `index.md` (auto-generated when ≥2 flow files exist)

```markdown
---
skill: user-flow
type: index
date: {{today}}
---

# Product Flow Index

Generated from the files in this directory. Update whenever a flow file is added, renamed, or versioned.

## Flows

| File | Flow | Platforms | Last updated | Version | Status |
|------|------|-----------|--------------|---------|--------|
| [flow-slug.md](./flow-slug.md) | [Flow name] | [platforms] | [date] | [n] | [draft/done] |

## Platform coverage at a glance

| Platform | Flows touching this platform |
|----------|-------------------------------|
| [platform] | [slug · slug · ...] |
```

## Required vs. optional sections

- **Required (baseline):** Context, Target Platforms & Surfaces (matrix + cross-platform channels), Flow Diagram, Per-Surface Entry Points, Screen Inventory, Screen Wireframes, Per-Surface Mini-Frames, Critical Edge-State Variants, Coverage Map, Surface Coverage Map, Edge Cases Handled, Per-Surface Edge States, Validation Summary.
- **Required when applicable:** Sub-flows (omit if no decomposition), Next Step.

## Filename + version-increment rule

- **First run a given flow:** `<flow-name>.md` (slug derived from brief — e.g., "checkout flow" → `checkout.md`; orchestrator confirms if ambiguous).
- **Re-run same flow:** rename existing `<flow-name>.md` → `<flow-name>.v[N].md` (increment N from highest existing version, default v1); create new `<flow-name>.md` with `version: N+1` frontmatter.
- **Sub-flow split:** structure-agent's auto-split for flows >15 screens names sub-flows `<flow-name>-<sub-slug>.md`.
- **Versioned files excluded from index:** `<flow-name>.v[N].md` files are historical trail; index lists only live `<flow-name>.md` files.

## Cross-skill propagation

Downstream consumers:
- `system-architecture` — reads every flow file in the directory; flows inform API endpoint design and feature decomposition.
- `task-breakdown` — reads flows to scope decomposition (one task per screen × surface combination as a baseline).
- `orchestrate-product` — reads `index.md` for state detection ("flows mapped" signal).
- `fresh-eyes` (post-implementation) — reads flows to verify implementation matches the designed flow + edge states.
