---
name: produce-ooh
description: "Produce an out-of-home (OOH) advertising brief + render-ready spec for billboards, transit, posters, and building wraps — built around the 3-second read, legibility at distance/speed, one message, and per-placement format/production specs. Emits a brief + render manifest (no pixels — an operator-connected engine renders). Not for digital/social ad creative (use write-ad / brief-graphic / produce-asset), nor the media buy/campaign (use plan-campaign)."
argument-hint: "<ooh-type> <message-or-brief> [--placement <context>] [--dimensions <wxh>] [--distance <viewing>]"
allowed-tools: Read Write Bash Grep Glob
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.40-1.20"
---

# Produce OOH — Out-of-Home Spec Builder

3 agents (concept → spec-and-legibility → critic) turn a message into an **OOH-ready brief + render manifest**: one idea, legible in 3 seconds at distance/speed, specced to the placement's real dimensions and production constraints. Like `produce-asset`, this emits a brief + render-ready prompt + manifest — **it holds no API keys and renders no pixels** (an operator-connected engine does that via `references/_shared/execution-fork.md`). Method: [`references/agent-manifest.md`](references/agent-manifest.md).

**Core question:** Read at 60 mph from 200 feet in under 3 seconds — does one message land?

## Critical Gates — load first

1. **One message.** OOH is a single idea — a brand, an offer, or a line. Two messages = zero messages.
2. **The 3-second read.** Legible at the placement's real viewing distance + speed. ≤7 words is the working ceiling for a highway board.
3. **Contrast + scale over detail.** Big type, high contrast, minimal copy; no small print, no QR-as-the-CTA on a moving placement.
4. **Brand-anchored.** FORSVN: Forest Shadow / Leaf accent, matte, no gradients/glass; the brand reads even at a glance.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Resolve via ≤4 Cold Start questions only what's unstated:

| Dimension | Why |
|---|---|
| OOH type (billboard / transit / poster / wrap) | drives dimensions + the read budget |
| The one message + the goal | the single idea everything serves |
| Placement context (highway / station / street / building) | viewing distance + dwell time |
| Brand assets (`brand/BRAND.md`, logo, fonts) | on-brand legibility |

Mode per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md). `budget: standard`. `--fast` → concept + core spec, skip the production-note depth; **never** skips the legibility check (the safety floor). Per the mode-resolver, `--fast` does drop the critic gate.

## Quality Gate — 5 dimensions

Full rubric: [`references/agent-manifest.md`](references/agent-manifest.md) § Rubric.

- [ ] 3-second read — one message, legible at the stated distance/speed (≤7 words for fast placements)
- [ ] Single idea — no competing messages
- [ ] Legibility — type size, contrast, safe margins meet the placement spec
- [ ] Format fidelity — correct dimensions, bleed, resolution, file spec for the medium
- [ ] Brand fidelity — on-brand, matte, accent discipline

Pass ≥35/50 AND no dim 0. FAIL twice → `BLOCKED`.

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/produce-ooh/[ooh-type]-[YYYY-MM-DD]-[slug].md`. **Lifecycle:** `execution`.
- **Frontmatter (11):** `skill`, `version`, `date`, `stack`, `type`, `id`, `review_surface`, `status`, `ooh_type`, `execution_mode`, `keywords`.
- **Body:** Concept (the one idea + visual) · The OOH spec (dimensions · bleed · resolution · type sizes · contrast · safe margins) · Copy (≤word-ceiling) · Render manifest (prompt + asset slots) · Production notes (substrate, lighting, lead time) · Critic verdict.
- **Render:** emits a render-ready prompt + manifest; pixels come from an operator-connected engine (`references/_shared/execution-fork.md`). Full contract: [`references/format-conventions.md`](references/format-conventions.md).

## Routing + Dispatch

Sequential graph (concept → spec-and-legibility → critic): [`references/agent-manifest.md`](references/agent-manifest.md).

## Chain Position

**Prev:** `plan-campaign` (the campaign + media context) OR `create-brand`. **Next:** the operator-connected render engine; `measure-results` if the OOH carries a trackable code/URL. **Re-run:** new placement, dimension change, message pivot.

**Deference:** digital/social ad creative → `write-ad` / `brief-graphic` / `produce-asset`; the media buy/plan → `plan-campaign`; a motion/video placement → `brief-shortform` / `produce-video`.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 7 patterns (two-messages, too-many-words, low-contrast, small-print, QR-on-fast-placement, wrong-dimensions, off-brand). Re-read before ship.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (references/_shared/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — concept + spec + manifest, passes the 3-second read, critic ≥35.
- **DONE_WITH_CONCERNS** — delivered; critic 25-34 OR an unresolved placement/dimension unknown (flagged).
- **BLOCKED** — critic FAIL twice; OOH type or dimensions undefined.
- **NEEDS_CONTEXT** — no message or placement; recommend defining the one idea + the placement first.

## Worked Example

A highway billboard for a $9 launch (one line, ≤6 words, Leaf-on-Forest-Shadow, 14×48 ft spec + the small-print + QR contingencies): [`references/examples/ooh-walkthrough.md`](references/examples/ooh-walkthrough.md).
