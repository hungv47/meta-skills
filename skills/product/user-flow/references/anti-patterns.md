---
title: User-Flow — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: user-flow
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** critic-agent fires (Step 2 of Layer 2b), or any moment the orchestrator is about to dispatch a layer that smells off — happy-path-only edge-case output, generic screen names, wireframe-structure drift, edge-state-skipping, "cross-platform" creeping back in. Re-read at every doubt.

---

## Failure mode catalog

**Happy path only** — Flows break at the first error. INSTEAD: Edge-case-agent maps error/empty/loading/permission/offline for every screen.

**Generic screen names** — "Step 1", "Step 2" tell nobody anything. INSTEAD: Concrete names matching dev/design vocabulary — "Payment Method Selection", "Order Review."

**Unlabeled edges / wrong shapes** — Bare `-->` connections and mixed-up shapes break diagrams. INSTEAD: Every edge has a present-tense label (`-->|"Clicks Submit"|`); 5 shapes used consistently — rectangle=screen, diamond=decision, stadium=start/end, hexagon=process, parallelogram=I/O.

**Dead-end errors** — "Something went wrong" with no recovery path. INSTEAD: Every error state leads to a recovery action (retry, back, contact support, alternative).

**Overloaded screens** — 5+ primary actions creates decision paralysis. INSTEAD: ≤3 primary actions per screen; split or move to navigation.

**Vague decision conditions** — "If appropriate" is not implementable. INSTEAD: Exact rules a developer can code — `cart.subtotal >= 10.00`, `user.role === 'admin'`.

**Skipping validation** — Assuming structure is correct without tracing paths. INSTEAD: Validation-agent traces every path from every entry to an exit, checking orphans and dead ends.

**Flow tables without wireframes / wireframing every edge** — A screen inventory is not a screen; wireframing every edge state creates 30 frames of noise. INSTEAD: One wireframe per core screen + 2-3 critical edge variants picked on impact.

**"Cross-platform" as a platform answer** — Collapses platform-specific surface decisions into nothing. macOS, iOS, and Android surfaces are different — a flow on "cross-platform" has no defined surface set. INSTEAD: Enumerate every platform. "Cross-platform" is a refusal to enumerate.

**Pooling many flows into one file** — One `FLOW.md` for checkout + onboarding + password reset drifts quickly. INSTEAD: One flow per file at `.agents/skill-artifacts/product/flow/<flow-name>.md`. Use `index.md` for the catalog view.

**Skipping per-surface coverage** — Picking surfaces at Step 0 but only wireframing main screens, or treating "widget refresh budget exhausted" / "Live Activity 8h ceiling hit" / "universal link fell back to web" as generic "network errors." Each declared surface has specific layout constraints and specific failure modes. INSTEAD: One mini-frame per selected surface at its native dimensions, plus a per-surface edge-state table — both pulled from `references/platform-touchpoints.md`.

**Drift between wireframe and structure inventory** — Wireframe shows 5 CTAs when the structure-agent listed 2 actions. INSTEAD: Wireframe CTAs must match the structure actions column exactly.

**Wireframes without descriptions** — An ASCII frame + CTA label gives layout but not intent. INSTEAD: Each screen has a 2-4 sentence Description covering content/data, visual priority, and mood. "Shows information" is not a description — name the actual content, hierarchy, and mood.

## When to defer instead of mapping a flow

- **Requirements are fuzzy** — defer to `/discover`. A flow against unclear requirements maps a hallucination.
- **Visual brand identity needed** — defer to `/brand-system`. user-flow is layout + interaction, not visual tokens.
- **Technical API design needed** — defer to `/system-architecture`. Wireframe regions don't define endpoint contracts.
- **Single-page conversion surface** (landing page, ad LP) — defer to `/lp-brief`. user-flow rubrics are for multi-step product flows, not single-screen persuasion architectures.

## When the critic FAILs

The critic-agent identifies which agent's output failed which gate, and the orchestrator re-dispatches that agent with feedback under `## Critic Feedback — Address Every Point`. Max 2 cycles. After 2 failures, deliver with critic annotations + flag to user (status: DONE_WITH_CONCERNS).

Never silently bypass a critic FAIL — the 7 Critical Gates + surface coverage matrix are the safety contract.
