# Format Conventions — design-minigame

## Artifact frontmatter (11 fields — v3 contract)

```yaml
skill: design-minigame
version: 1
date: YYYY-MM-DD
stack: marketing
type: execution
id: minigame-<game_type>-<slug>
review_surface: md
status: done | done_with_concerns | blocked | needs_context
game_type: spin-wheel | quiz | scratch-card | playable-ad | advent-calendar
capture_mode: email | none
keywords: [minigame, gamification, <game_type>, lead-gen]
```

Conforms to `references/_shared/artifact-contract-template.md`.

## Body sections (in order)

1. **`## Concept`** — the game · the marketing goal · the success metric.
2. **`## Mechanic`** — the one action · win condition · outcome set with **honest odds** · replay/virality hook · fairness/anti-cheat note.
3. **`## Reward Economics`** — prize tiers · per-tier odds · expected cost (tiers × odds × plays) · redemption cap/budget.
4. **`## Funnel`** — entry → play → value-exchange capture (at the claim, not the gate) → next step (the goal CTA). State `capture_mode`.
5. **`## Compliance Flags`** — sweepstakes/lottery jurisdiction · T&Cs · age gate · "no purchase necessary" (surfaced, not legal advice).
6. **`## Build Notes`** — states (idle/playing/win/lose/claimed) · accessibility (keyboard, reduced-motion, non-color states) · server-decided outcomes for costed prizes.
7. **`## Measurement Hooks`** — plays · completion rate · capture rate · redemption · downstream conversion (what `measure-results` reads).
8. **`## Critic Verdict`** — 6-row table (5 dims + total).

## Rules
- Odds are stated and real; never faked (anti-pattern 1, auto-BLOCK).
- Capture comes after the fun, framed as a value-exchange.
- Every prize must be honorable at the capped redemption volume.
