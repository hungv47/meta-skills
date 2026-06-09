---
title: brief-product-ui — Worked Example
lifecycle: canonical
status: stable
produced_by: brief-product-ui
load_class: EXAMPLE
---

# Worked Example: Team Billing Dashboard

**Load when:** the operator needs an anchor for what a full brief-product-ui run looks like —
intake through critic, all 9 artifact sections illustrated, including a realistic FAIL→fix cycle.

---

## Invocation

```
/brief-product-ui
> Design the UI for our team billing dashboard feature.
```

## Step 0 — Intake

Skill finds `map-user-flow` artifact at
`.forsvn/artifacts/product/flow/team-billing-dashboard-2026-06-01.md`.
Parseable: 4 screens declared (Billing Overview, Manage Plan, Payment Methods, Invoices).
Brand source: FORSVN house tokens (dark default; Signal Lime `#B7FF6E` state-cue only; matte).
Target engine: coding-agent (no design-tool connected). **GO.**

No invented screens permitted from this point — every spec section must trace back to the flow.

## Layer 1 (parallel)

Three agents run simultaneously.

**screen-inventory-agent** returns:

- 4 flow-traced screens + 3 surface variants (no-payment-method, payment-failed, empty Invoices)
- One flag: flow declares "add card" as a modal — confirmed in flow edge states, not a new screen
- Table excerpt:

  | Screen | Flow trace | Purpose | Primary surface |
  |---|---|---|---|
  | Billing Overview | screen: billing-overview | Current plan + usage summary | web-desktop |
  | Manage Plan | screen: manage-plan | Upgrade / downgrade | web-desktop |
  | Payment Methods | screen: payment-methods / state: no-payment-method | Card management | web-desktop |
  | Invoices | screen: invoices / state: empty | Download history | web-desktop |

**component-system-agent** returns:

Primitives (8): `Badge`, `Button`, `Icon`, `Skeleton`, `Divider`, `Tag`, `Link`, `Toast`.

Composites (5):
- `PlanCard` — reused on Billing Overview + Manage Plan; contains `Badge` (active state) + usage meter
- `UsageMeter` — progress bar + label; used inside `PlanCard`
- `InvoiceRow` — reused on Invoices list; contains `Tag` (status) + `Link` (download)
- `PaymentMethodCard` — reused on Payment Methods; contains `Badge` (default card)
- `EmptyState` — reused on Invoices (empty) + Payment Methods (no-payment-method)

Reuse map: 5 of 5 composites appear on ≥2 screens — no per-screen one-offs.

**token-application-agent** returns:

Token map excerpt:

| Element | Token | Surface/state notes |
|---|---|---|
| Page background | `color.bg.base` (`ink-950`) | All screens |
| Section surface | `color.bg.elevated` (`ink-900`) | Cards, panels |
| Primary CTA ("Upgrade") | `color.action.primary` → `signal-lime.500` | Resting only |
| Active plan badge | `color.accent.active` → `signal-lime.500` | Current plan `PlanCard` only |
| Payment-failed banner | `color.feedback.error` → `red.600` | payment-failed state |
| Body text | `color.text.primary` (`ink-50`) | |
| Secondary text | `color.text.secondary` (`ink-400`) | |
| Focus ring | `color.focus` → `signal-lime.500` | All interactive elements |
| Border radius (card) | `radius.card` (`6px`) | |
| Spacing unit | `space.4` (`16px`) base grid | |

Signal Lime appears in exactly 3 places: active plan badge, primary CTA resting state, focus ring.
No raw hex values — all token references.

## Merge step

Cross-reference checks before layout pass:
- ✓ All 4 flow screens inventoried; all edge states (no-payment-method, payment-failed, empty Invoices) traced
- ✓ All composites reused across ≥2 screens; primitive list bounded (8)
- ✓ No raw hex/px in token map — all named tokens

Proceed to layout and state pass.

## Layout & State

**layout-state-agent** returns:

Grid + density: 12-column at 1280px max, 24px gutters; 2-column split on Billing Overview
(summary left, PlanCard right); single column on Invoices. Data-dashboard density: compact
row height `48px`, section padding `space.6` (`24px`).

Skeleton loading: all 4 screens use `Skeleton` primitives at actual content dimensions —
no spinner-only treatment. `PlanCard` skeleton: 2 rect blocks (title + meter). `InvoiceRow`
skeleton: 3 rect blocks (date / amount / status).

Empty Invoices state: `EmptyState` component, icon `receipt`, heading "No invoices yet",
body "Your invoices will appear here after your first billing cycle." No CTA (no action available).

Payment-failed treatment: full-width `Toast` (error variant) pinned top of Billing Overview —
not a modal interruption. Body: "Your last payment failed. [Update payment method →]" Link
navigates to Payment Methods screen.

Interaction states (5 per interactive element):

| State | Treatment |
|---|---|
| Default | token `color.action.primary` fill |
| Hover | `color.action.primary-hover` (lime, 12% darker) |
| Active | `color.action.primary-pressed` (lime, 20% darker) |
| Focus | `color.focus` ring, `2px` offset |
| Disabled | `color.action.disabled`, no pointer |

Accessibility floor: all text passes WCAG AA (ink-50 on ink-950 = 15:1). Focus order:
page landmark → section heading → first interactive element, left-to-right then top-to-bottom.
All tap targets `≥44×44px`. Reduced-motion: `UsageMeter` fill animates only when
`prefers-reduced-motion: no-preference`; otherwise renders at final value instantly.

## Handoff

Execution-fork: **category design** → target engine is a coding agent.
No design-tool session — spec is portable as-is.

Build prompt delivered:

> Using the brief-product-ui artifact at
> `.forsvn/artifacts/product/brief-product-ui-2026-06-07-team-billing-dashboard.md`,
> implement the Team Billing Dashboard. Reference §Screen Inventory for the 4 screens,
> §Component System for the 13 components (8 primitives + 5 composites), §Token Application Map
> for all color/space/type assignments, §Per-Screen Layout Spec for grid + density, and
> §Interaction & State Spec for the 5 interactive states per element.
> Do not invent tokens — every value must resolve to a token from the map.

`execution_mode: brief-only` (portable spec; the coding agent builds from it — target recorded in provenance, not the enum). No design-tool redirect needed.

## Critic Gate

Critic runs all 8 checkpoints. Initial pass:

| CP | Checkpoint | Result |
|---|---|---|
| CP-01 | Flow grounding | PASS |
| CP-02 | Component reuse & hierarchy | PASS |
| CP-03 | Token fidelity | **FAIL** |
| CP-04 | Layout system | PASS |
| CP-05 | State coverage | PASS |
| CP-06 | Accessibility floor | PASS |
| CP-07 | Handoff readiness | PASS |
| CP-08 | No-render discipline | PASS |

**CP-03 FAIL detail:** in the Interaction & State Spec, the `Button` hover state was written
as `background: #B7FF6E` — a raw hex, not a token reference. Violates the "tokens not raw values"
rule (Gate 4 / CP-03).

**Fix cycle:** critic re-dispatches `token-application-agent` on the hover state row.
Agent replaces `#B7FF6E` with `color.action.primary-hover`. Critic re-evaluates CP-03:
no raw values remain in the spec. **PASS.**

Final verdict: **8/8 PASS. Gate cleared.**

## --fast note

With `--fast`, Layer 1 collapses to a single sequential pass (screen-inventory → component-system
→ token-application in order, not parallel). The intake gate and all 8 critic checkpoints still
run — `--fast` compresses orchestration weight, not correctness. Expect ~40% faster wall-clock
at the cost of inter-agent cross-referencing depth (component reuse signal is weaker when
component-system-agent hasn't seen the full screen inventory simultaneously).

## Abbreviated artifact sections (output shape)

Below are compressed illustrations of each of the 9 required sections — not the full artifact.

**§1 TL;DR**
> Team Billing Dashboard UI spec: 4 screens (Billing Overview, Manage Plan, Payment Methods,
> Invoices), 13 components (8 primitives + 5 composites), FORSVN house tokens (dark default,
> Signal Lime state-cue only), target engine: coding-agent.

**§2 Screen Inventory** — 4-row table as shown in Layer 1 above.

**§3 Component System** — primitives list (8) + composites (5) + reuse map, as shown above.

**§4 Token Application Map** — element × token table, as shown above.

**§5 Per-Screen Layout Spec** — one block per screen: grid, spacing rhythm, density, responsive
behavior. (Billing Overview: 12-col / 24px gutters / 2-col split. Invoices: single-col / compact rows.)

**§6 Interaction & State Spec** — 5-state table per interactive element + empty/loading/error
visual treatment per screen. (Payment-failed: full-width error Toast, not modal.)

**§7 Accessibility Notes** — contrast ratios stated (15:1 body text), focus order defined,
44px touch targets, reduced-motion fallback on `UsageMeter`.

**§8 Handoff** — execution-fork: coding-agent build prompt, `execution_mode: brief-only` (target
engine `coding-agent` recorded in provenance), references specific §§ the agent must consume. No design-tool redirect.

**§9 What NOT To Render** — this artifact is a spec. Visual rendering, component styling,
responsive breakpoint implementation, and the decision-capture surface belong to the build
surface and the forsvn-preview review module respectively. The skill emits plain Markdown only.
