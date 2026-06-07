# Artifact Format Conventions — Full Detail

Source of truth for the brief-product-ui artifact schema. Cited by `SKILL.md` "Artifact Contract."

## Filename + path

`.forsvn/artifacts/product/brief-product-ui-<YYYY-MM-DD>-<slug>.md` — by-stack v3 layered grammar
(`<stack>/<skill>-<date>-<slug>`), `stack: product`. One file per feature. The slug is the feature
name in kebab-case (matches the source flow's slug where possible). Re-runs increment `version`.

## Frontmatter

```yaml
---
skill: brief-product-ui
version: 1                      # integer artifact schema version; increments on re-run
date: <YYYY-MM-DD>
status: done | done_with_concerns | blocked | needs_context
stack: product
type: spec
id: brief-product-ui-<slug>
keywords: [ui, <feature>, <surfaces…>]
review_surface: html           # FIRE preview via forsvn-preview while pending
decision_state: pending        # pending → approved/denied (human-owned)
source_flow: <path to the map-user-flow artifact this consumes>
brand_source: house | <brand name> | cold-start-hint
lifecycle: pipeline
produced_by: brief-product-ui
provenance:
  skill: brief-product-ui
  run_date: <YYYY-MM-DD>
  input_artifacts: [<flow path>, brand/DESIGN.md, brand/BRAND.md]
  config_sources: []
  output_eval: null
---
```

The `## Review Gate` block is **plugin-rendered** (forsvn-preview), not skill-authored.

## Required sections (9, in order)

1. **TL;DR** — 2-4 sentences: feature, surfaces, component count, brand source, build target. The
   one-paragraph answer to the Core Question.
2. **Screen Inventory** — every screen/state, each with its flow trace (CP-01). Table:
   `Screen | Flow trace (screen/state/edge) | Purpose | Primary surface`.
3. **Component System** — the component taxonomy + cross-screen reuse map + composition hierarchy +
   bounded primitive list (CP-02). Name each component once; mark reuse.
4. **Token Application Map** — DESIGN tokens applied per surface/per state; no raw hex/px (CP-03).
   Table: `Element | Token (color/space/type/radius) | Surface/state notes`.
5. **Per-Screen Layout Spec** — grid + spacing rhythm + density + responsive/adaptive behavior per
   surface (CP-04). One block per screen.
6. **Interaction & State Spec** — per interactive element: default/hover/active/focus/disabled +
   motion; per screen: empty/loading/error visual treatment (CP-05). No "show error."
7. **Accessibility Notes** — contrast ratios, focus order, touch-target minimums, reduced-motion
   fallback (CP-06).
8. **Handoff** — upstream tool-redirect choice + terminal execution-fork block + a buildable prompt
   per target engine (CP-07). Names the engine + mode; sets `execution_mode`.
9. **What NOT To Render** — the explicit no-render boundary (CP-08): this is a spec; the
   listed renders/decisions belong to the chosen build surface, not this artifact.

A missing or empty required section FAILs the corresponding checkpoint at the critic gate.
