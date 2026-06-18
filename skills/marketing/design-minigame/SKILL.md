---
name: design-minigame
description: "Design a marketing mini-game / interactive — spin-the-wheel, quiz, scratch-card, playable ad, advent-calendar — for engagement, lead capture, or virality. Produces a game-design spec: the mechanic + win condition, the reward economics, the data-capture value exchange, and the conversion funnel. Honest by construction (no fake-win dark patterns). Not for building the game's code (that's an engineering task), nor a static ad/asset (use write-ad / brief-graphic / produce-asset)."
argument-hint: "<game-type> <goal> [--reward <incentive>] [--placement <where>] [--capture <email|none>]"
allowed-tools: Read Write Bash Grep Glob
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.40-1.20"
---

# Design Mini-Game — Interactive Spec Builder

3 agents (mechanic-designer → reward-and-funnel → critic) turn a marketing goal into a **playable mini-game spec**: one dead-simple mechanic, sustainable reward economics, an honest value-exchange for the data, and the conversion path out. The spec an engineer or a no-code tool builds from. Method: [`references/agent-manifest.md`](references/agent-manifest.md).

**Core question:** Is it fun in one action, honest in its odds, and does it hand off to a real next step — or is it a dark-pattern email trap?

## Critical Gates — load first

1. **Serves a marketing goal.** Lead capture, engagement, or virality — named, with the metric. A game with no goal is a toy.
2. **One action to fun.** The core loop is one obvious action (spin, pick, scratch). Friction before the first hit of fun kills it.
3. **Honest by construction.** Real odds, real prizes, no fake "you won!" then a paywall. Dark patterns are a hard FAIL (and a legal/brand risk).
4. **Has a funnel.** The game ends in a real next step (claim → email value-exchange → offer), not a dead end or a forced wall.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Resolve via ≤4 Cold Start questions only what's unstated:

| Dimension | Why |
|---|---|
| Game type + the marketing goal | the mechanic + the success metric |
| The reward/incentive | drives participation + the economics |
| Placement (landing / email / social / event kiosk) | constraints + the funnel target |
| Data capture (email? none?) | the value-exchange + compliance |

Mode per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md). `budget: standard`. `--fast` → mechanic + funnel sketch, skip the deep reward-economics model; **never** skips the honesty check (the safety floor). Per the mode-resolver, `--fast` does drop the critic gate.

## Quality Gate — 5 dimensions

Full rubric: [`references/agent-manifest.md`](references/agent-manifest.md) § Rubric.

- [ ] Goal fit — the mechanic serves the named marketing goal + metric
- [ ] One-action fun — the core loop is instantly playable; minimal pre-fun friction
- [ ] Honest mechanics — real odds, real prizes, no dark patterns
- [ ] Reward economics — the incentive is enticing AND sustainable (cost/redemption modelled)
- [ ] Funnel — a real value-exchange capture + a next step out

Pass ≥35/50 AND no dim 0. FAIL twice → `BLOCKED`.

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/design-minigame/[game-type]-[YYYY-MM-DD]-[slug].md`. **Lifecycle:** `execution`.
- **Frontmatter (11):** `skill`, `version`, `date`, `stack`, `type`, `id`, `review_surface`, `status`, `game_type`, `capture_mode`, `keywords`.
- **Body:** Concept (game + goal + metric) · Mechanic (the loop · win condition · odds) · Reward economics (prizes · odds · cost model · redemption cap) · Funnel (entry → play → capture value-exchange → next step) · Build notes (states, accessibility, anti-cheat) · Critic verdict. Full contract: [`references/format-conventions.md`](references/format-conventions.md).

## Routing + Dispatch

Sequential graph (mechanic-designer → reward-and-funnel → critic): [`references/agent-manifest.md`](references/agent-manifest.md).

## Chain Position

**Prev:** `plan-campaign` (the campaign the game sits in) OR `create-brand`. **Next:** an engineer / no-code tool builds it; `measure-results` after, on the placement's channel. **Re-run:** new game type, reward change, goal pivot.

**Deference:** building the game's code → engineering (out of this stack's scope); a static ad/asset → `write-ad` / `brief-graphic` / `produce-asset`; the campaign → `plan-campaign`.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 7 patterns (fake-win-dark-pattern, friction-before-fun, broken-prize-economics, no-funnel, gambling-regulation-blind, inaccessible, off-brand). Re-read before ship.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (references/_shared/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — mechanic + economics + funnel, honest by construction, critic ≥35.
- **DONE_WITH_CONCERNS** — delivered; critic 25-34 OR an unresolved prize-cost / compliance unknown (flagged).
- **BLOCKED** — critic FAIL twice; dark pattern unremovable; goal undefined.
- **NEEDS_CONTEXT** — no goal or reward; recommend defining the goal + incentive first.

## Worked Example

A spin-the-wheel for a launch email-list (real odds, capped prize budget, email value-exchange, the dark-pattern + prize-economics guards): [`references/examples/minigame-walkthrough.md`](references/examples/minigame-walkthrough.md).
