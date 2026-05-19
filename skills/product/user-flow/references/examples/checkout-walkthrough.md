---
title: User-Flow — Worked Example
lifecycle: canonical
status: stable
produced_by: user-flow
load_class: EXAMPLE
---

# Worked Example: Food-Delivery Checkout (Multi-Platform)

**Load when:** triangulating to a target — operator wants to know what a full user-flow run looks like end-to-end with all 6 agents + 13-surface matrix, or the orchestrator needs an anchor for output shape + critic decisions.

---

## Invocation

```
/user-flow
> Map the checkout flow for our food-delivery app. We ship on iOS,
> Android, and web.
```

## Step 0 — Interview (Cold Start)

Pre-Dispatch prompts the operator for the 5 dimensions. Operator answers:

- **Q1 — Feature/flow name:** `checkout`
- **Q2 — Role + goal:** logged-in customer, medium-frequency, technical-skill low. Goal: "complete order with chosen payment + delivery address in ≤5 steps."
- **Q3 — Platforms (mandatory gate):** `iOS 17+`, `iPadOS 17+`, `Android 13+`, `web-desktop`, `web-mobile`. (Operator initially said "cross-platform" — orchestrator rejected, asked for explicit enumeration.)
- **Q4 — Surfaces per platform + primary (mandatory gate):** picked from `platform-touchpoints.md` catalog — 13 surfaces total:
  - iOS: app (★), Lock-screen widget, Dynamic Island (compact + expanded), Live Activity, Apple Pay
  - iPadOS: app (★), Stage Manager split-view
  - Android: app (★), Quick Settings tile, notification + inline reply, Google Pay
  - web-desktop: site (★)
  - web-mobile: site (★), URL routing, Web Push, OAuth redirect, PWA install, Add-to-Home-Screen
- **Q5 — Constraints:** auth = logged-in only (guest checkout out of scope); Apple Pay + Google Pay + card payment methods; minimum order $10; Live Activity required throughout pending → in-transit → delivered states.

Write-back: `technical.md` updated with "supported platforms" + min OS versions. Audience persona was already in `audience.md` so no update.

Flow type confirmed by structure-agent later: branching.

## Layer 1 (parallel)

**Structure-agent** returns:
- 6 core screens: Cart Review → Shipping Address → Shipping Method → Payment Selection → Order Review → Order Confirmation
- 3 decision points: (a) cart minimum met? (b) shipping address has restrictions? (c) payment method requires biometric?
- 3 exits: confirmed order, abandoned cart, error redirect to home
- 13-row Per-Surface Entry Matrix — every platform × surface with entry trigger, auth requirement, pre-loaded state, first screen, handback target

**Edge-case-agent** returns:
- Standard 5-category coverage per screen (error/empty/loading/permission/offline)
- Per-surface edge states pulled from catalog:
  - **Live Activity:** 8h ceiling → falls back to push notification; user dismisses → flow continues on next app open
  - **Quick Settings tile (Android):** desync → tile shows stale order status, requires app refresh
  - **Web Push:** denied → fallback to in-page polling
  - **PWA (iOS):** state loss on background eviction → flow checkpoint stored to IndexedDB on each step
  - **Universal link fallback:** if iOS Universal Link fails (app not installed), fall through to web-mobile

## Merge step

Cross-reference checks before Layer 2 dispatch:
- ✓ Every screen has edge coverage (6/6 screens covered for 5 categories)
- ✓ Every platform × surface has an entry-matrix row (13/13)
- ✓ Every platform × surface has a per-surface edge-state row (13/13)

Proceed to Layer 2a.

## Layer 2a (parallel)

**Diagram-agent** returns Mermaid `graph TD` with 9 nodes (6 screens + 3 decision diamonds) + 3 stadium nodes (start + 3 exits). All edges labeled. 5 node shapes used consistently.

**Wireframe-agent** returns:
- 6 core-screen wireframes — mobile (34ch wide) for iOS/Android app + web-mobile; desktop (68ch) for web-desktop + iPadOS Stage Manager
- 2 critical edge variants: "Cart minimum not met" (Cart Review) + "Payment biometric prompt failed" (Payment Selection)
- 13 per-surface mini-frames at native dimensions:
  - iOS Lock-screen widget: 4×2 grid
  - Dynamic Island compact (160×54pt) + expanded (full-width)
  - Live Activity (full-width, 3 states: pending / in-transit / delivered)
  - Apple Pay sheet (modal, full-width)
  - iPadOS Stage Manager split-view (variable width, design for 50/50 default)
  - Android Quick Settings tile (square, 4×4 grid)
  - Notification (collapsed + expanded with inline reply)
  - Google Pay sheet (similar to Apple Pay)
  - Web-desktop site (full-width, max 1280px)
  - Web-mobile site (single column)
  - PWA install banner (top sheet)
  - Add-to-Home-Screen prompt (browser-controlled, screenshot of expected dialog)
  - OAuth redirect (provider's surface; user's browser)

## Layer 2b (sequential)

**Validation-agent** runs:
- Happy path length: 5 steps (Cart Review → Address → Method → Payment → Confirmation). **PASS** (under Miller's 7).
- ≤3 actions per screen: PASS (Cart Review has 3 actions: edit qty / checkout / save for later)
- Surface coverage: 13/13 surfaces have entry + mini-frame + edge state. **PASS.**
- Dead ends: 0. Every error has a recovery path.
- Wireframe-structure parity: PASS (no drift between actions and CTAs).

**Critic-agent** runs full rubric:
- Surface coverage matrix complete: ✓
- Per-surface mini-frames at native dimensions: ✓
- Decision points each have ≥2 labeled exits: ✓
- Miller compliance + ≤3 actions/screen: ✓
- Wireframes have 2-4 sentence Descriptions: ✓
- Critical edge variants picked on impact: ✓ (2 of 6 screens)
- Source citations present + URLs: ✓
- **Score: 4.8 / 5.0 — PASS.**

## Deliver

`.agents/skill-artifacts/product/flow/checkout.md` written. Slug confirmed `checkout`. Frontmatter includes baseline fields + Step 7.5 additions (lifecycle, produced_by, provenance).

No `index.md` created yet (only one flow file at this slug). Index will auto-generate on the second distinct slug (e.g., when operator runs `/user-flow` next for `onboarding`).

`status: done`.

## Lessons embedded

- **Why "cross-platform" was rejected at Q3:** the surfaces under "cross-platform" don't exist — there's no widget on "cross-platform," no Live Activity, no Quick Settings tile. The catalog forces enumeration. The flow's 13-surface matrix is the proof.
- **Why per-surface edge states matter:** "Live Activity 8h ceiling" is not a generic error. The user's order pending → in-transit → delivered states can span >8h (slow restaurants, traffic), at which point Live Activity disappears mid-flow. Treating it as "network error" would miss the platform-specific failure mode entirely.
- **Why iPadOS Stage Manager split-view got its own mini-frame:** even though iPadOS Stage Manager is a window state, not a separate surface, the wireframe at 50/50 width is fundamentally different from full-width iPad app. The catalog explicitly lists Stage Manager states.
- **Why the Universal Link fallback was modeled in edge cases:** if iOS Universal Link fails (app not installed when restaurant sends "order ready" link), the user falls to web-mobile mid-flow. Without modeling this, the web-mobile mini-frame would be incomplete (no entry from external trigger).
- **Why 2 critical edge variants instead of one per screen:** "Cart minimum not met" and "Payment biometric prompt failed" are the highest-impact failure modes. The remaining 30+ edge states are covered in the Per-Surface Edge States table without dedicated wireframes — the table is denser and more navigable than 30 ASCII frames.
