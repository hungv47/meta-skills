# Critical Gates + Quality Rubric — Full Detail

Cited by `SKILL.md` "Critical Gates" and "Quality Gate" sections. Read in full before any Layer 1 dispatch — gates fire on every run regardless of mode (`--fast` does **not** bypass them; see `references/_shared/mode-resolver.md` § safety-gates-supersede).

## Why this block precedes "Before Starting"

The mandatory platforms+surfaces gate (Gate 1) must fire before any Pre-Dispatch question or Layer 1 dispatch — wireframe size, entry triggers, and per-surface edge states are not inferable without it. Other product skills can defer their gate check until after context-loading; this one cannot.

## The 7 Critical Gates

1. **No Layer 1 before platforms + surfaces enumerated.** See `../platform-touchpoints.md`. Wireframe size, entries, edge states all depend on it.
2. **Reject "cross-platform" as a platform.** Enumerate explicitly: macOS, iOS, iPadOS, Android, Windows, web-desktop, web-mobile, watchOS, tvOS, visionOS, CarPlay, Android Auto, Linux.
3. **No diagrams before structure.** Diagram-agent needs structure + edge-case outputs first.
4. **No skipping edge cases.** Error / empty / loading / permission / offline + per-surface edge states for every screen and surface.
5. **Challenge >7 happy-path steps.** Miller's threshold. Every step must justify itself.
6. **One flow = one file.** No pooling. Each run writes `docs/forsvn/artifacts/product-map-user-flow-<YYYY-MM-DD>-<slug>.md`.
7. **Stale product context (>30 days) misaligns flows.** Recommend re-running `research-icp` before proceeding.

## Quality Gate — Critic Rubric (PASS checks)

The critic agent (`agents/critic-agent.md`) runs the full rubric. All checks below are non-negotiable PASS conditions:

- Platforms + per-platform surfaces explicitly enumerated (no "cross-platform")
- Every platform × surface has entry + mini-frame + per-surface edge state (Surface Coverage Map complete)
- Mini-frame dimensions match `../platform-touchpoints.md`
- Every decision point has ≥2 labeled exits; no dead-end errors
- Happy path ≤7 steps; ≤3 primary actions per screen
- Every core screen has ASCII wireframe + 2-4 sentence Description; wireframe CTAs match structure actions
- 2-3 critical edge-state variants included

## Critic FAIL handling

Re-dispatch named agent(s) with feedback per `../anti-patterns.md` § "When the critic FAILs." Max 2 cycles. After 2 failures, deliver with critic annotations and flag to user (status: `DONE_WITH_CONCERNS`).
