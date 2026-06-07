# Component Patterns — Catalog & Reuse Heuristics

> Domain-knowledge reference for the component-system-agent (CP-02). Read before constructing the
> component taxonomy; pull from this catalog first, introduce a new pattern only when the catalog
> has no match and the flow clearly requires it.

---

## 1. Three-Tier Catalog

**Tier 1 — Primitives** (UI atoms; no nesting of other components):

`Button` · `IconButton` · `Input` (text / search / number) · `Select` · `Checkbox` · `RadioGroup` ·
`Toggle` · `Badge` · `Avatar` · `Icon` · `Tag` · `Tooltip` · `Divider` · `Spinner` · `ProgressBar` ·
`Label` · `Link` · `Skeleton`

**Tier 2 — Composites** (named grouping of ≥2 primitives with a defined visual contract):

`Card` · `ListRow` · `TableRow` / `DataGrid` · `Form` · `FormField` (Label + Input + error hint) ·
`SearchBar` (Input + Icon + clear Button) · `FilterBar` · `Modal` · `ModalHeader` ·
`Toast` / `SnackBar` · `AlertBanner` · `EmptyState` (Icon + headline + body + optional CTA) ·
`TabBar` · `NavRail` · `Breadcrumb` · `Pagination` · `ContextMenu` · `DropdownMenu` ·
`Avatar + name` composite (`UserChip`) · `DatePicker` · `CommandPalette`

**Tier 3 — Screen Templates** (composites assembled into a full-screen layout shell shared by ≥2 screens):

`ListDetailShell` · `FormShell` · `DashboardShell` · `ModalSheet` · `SettingsPane` ·
`OnboardingStep` · `EmptyScreenShell`

---

## 2. Reuse Heuristics

**Promote to Composite** when ≥2 primitives co-occur on ≥2 screens in the same structural arrangement.

**Promote to Screen Template** when ≥2 screens share the same outer shell (chrome, nav bar,
content-zone arrangement, action-bar placement).

**Rule of Three:** when a component needs a third distinct variant, extract it as one shared
component with typed props — not a third one-off. Two variants → props/states on the same component.
Three distinct usage patterns → the abstraction boundary is overdue.

**Specialize only when the difference is structural** (different slot count, different action model,
different interaction contract). Mark specializations with a `--modifier` suffix (e.g., `Card--compact`)
and note the structural reason in the Reuse Map's Notes column. Cosmetic differences (color, spacing,
elevation) are token-application-agent territory — not a new component.

---

## 3. Bounded Primitive Count

A typical product feature requires **8–15 primitives**. Flag the spec for CP-02 review if:

- Primitive count exceeds **15** — suggests redundant atoms or unexploded composites.
- A primitive appears on exactly one screen and cannot be folded into a composite — likely a one-off
  (anti-pattern #4 in `references/anti-patterns.md`).
- Checkbox, Radio, Toggle, and Switch appear as four separate entries — consolidate to the narrowest
  set the flow actually requires; name the structural difference only if interaction contracts differ.

State the primitive count explicitly in the Component System output so the critic can verify it.

---

## 4. Composition Hierarchy

Express nesting one level at a time — what a composite contains, not the full recursive tree:

```
Screen Template  →  names the Composites it assembles + the screens it covers
Composite        →  names the Primitives it nests (+ any nested Composites)
Primitive        →  leaf; no components nested inside
```

**Reuse Map table format** (one row per component, every component in the table):

| Component | Type | Used on screens | Variants / props | Notes |
|-----------|------|-----------------|------------------|-------|
| Button | Primitive | All | `variant: primary\|ghost\|destructive` | — |
| EmptyState | Composite | List, Search | `showCTA: bool` | CTA absent on read-only screens |
| ListDetailShell | Template | List, Detail | — | Shared chrome; content zone differs |

No blank "Used on screens" cells — a component with no screen mapping does not belong in the spec.

---

## 5. State-Bearing vs. Static Components

**State-bearing** — carry interaction states that layout-state-agent (CP-05) must specify:
`Button` (idle / hover / pressed / disabled / loading) · `Input` (empty / focused / filled /
error / disabled) · `Toggle` / `Checkbox` / `RadioGroup` (on / off / indeterminate / disabled) ·
`Modal` (closed / open / closing) · `Toast` (entering / visible / exiting) · `Select` (closed /
open / selected) · `DataGrid` (loading / empty / populated / row-selected) · `CommandPalette`
(closed / open / querying / no-results)

**Static / presentational** — no interaction states; token-application-agent (CP-03) handles only
appearance: `Divider` · `Avatar` · `Icon` · `Badge` · `Tag` · `Label` · `Skeleton` · `Breadcrumb` ·
`ProgressBar` (non-interactive variant)

When writing the Component System section, annotate state-bearing composites and templates with
`[state-bearing]` so layout-state-agent can pick them up without re-reading the full taxonomy.
