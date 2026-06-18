---
name: event-runofshow
description: "Produce a minute-by-minute run-of-show (cue sheet) for a live marketing event — webinar, launch event, AMA, demo day, product reveal, conference talk. Segments + timing + owners + technical cues + contingencies. Not for the campaign around the event (use plan-campaign), the launch-day social sequence (use the launch chain / publish-social), or a recorded video (use brief-shortform/produce-video)."
argument-hint: "<event-type> <duration> [--date <when>] [--audience <who>] [--goal <outcome>]"
allowed-tools: Read Write Bash Grep Glob
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.40-1.10"
---

# Event Run-of-Show — Cue Sheet Builder

3 agents (segment-planner → logistics-director → critic) turn an event brief into a **minute-by-minute run-of-show**: every segment timed, owned, cued, and de-risked. The artifact a host, producer, and AV operator all run from, the same row at the same second. Method: [`references/agent-manifest.md`](references/agent-manifest.md).

**Core question:** If the host froze, could anyone on the team pick up the next 90 seconds from this sheet alone?

## Critical Gates — load first

1. **Timed to the minute.** Every segment has a start time + duration; the total equals the event length (no "we'll figure it out live").
2. **One owner per segment.** Every row names who's driving (host / guest / producer / AV). No orphan segments.
3. **Cue the transitions, not just the content.** The risky moments are the handoffs (intro→demo, demo→Q&A); spec the cue + the fallback.
4. **A contingency for every single point of failure.** Demo breaks, guest no-shows, tech fails, Q&A goes silent — each has a written fallback.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Resolve via ≤4 Cold Start questions only what's unstated:

| Dimension | Why |
|---|---|
| Event type + total duration | the spine of the timing budget |
| Audience + goal (the one outcome) | what every segment must serve |
| Cast (host, guests, demo driver) | who can own segments |
| Platform + tech (live stream / in-person / hybrid) | which cues + failure modes apply |

Mode per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md). `budget: standard`. `--fast` → segments + timing only, skip the deep contingency layer; **never** skips owner assignment (the safety floor). Per the mode-resolver, `--fast` does drop the critic gate.

## Quality Gate — 5 dimensions

Full rubric: [`references/agent-manifest.md`](references/agent-manifest.md) § Rubric.

- [ ] Timing integrity — durations sum to the event length; buffer built in
- [ ] Ownership — every segment has exactly one driver
- [ ] Cue clarity — transitions + technical cues are explicit and executable
- [ ] Goal service — each segment traces to the event's one outcome (no filler)
- [ ] Contingency coverage — every SPOF has a written fallback

Pass ≥35/50 AND no dim 0. FAIL twice → `BLOCKED`.

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/event-runofshow/[event]-[YYYY-MM-DD]-[slug].md`. **Lifecycle:** `execution`.
- **Frontmatter (10):** `skill`, `version`, `date`, `stack`, `type`, `id`, `review_surface`, `status`, `event_type`, `keywords`.
- **Body:** Event header (goal · cast · platform · total runtime) · The run-of-show table (start · duration · segment · owner · content · cue · fallback) · Pre-show checklist · Contingency playbook · Critic verdict. Full contract: [`references/format-conventions.md`](references/format-conventions.md).

## Routing + Dispatch

Sequential graph (segment-planner → logistics-director → critic): [`references/agent-manifest.md`](references/agent-manifest.md).

## Chain Position

**Prev:** `plan-campaign` (the campaign the event sits in) OR a raw event idea. **Next:** `publish-social` for the promo sequence; `measure-results` after, on the event's channel. **Re-run:** schedule change, cast change, format pivot.

**Deference:** the campaign around the event → `plan-campaign`; the social promo → launch chain / `publish-social`; a recorded video → `brief-shortform` / `produce-video`.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 7 patterns (unbudgeted time, orphan segment, uncued transition, filler-without-goal, no-contingency, host-only-knows, over-scripted-to-stiffness). Re-read before ship.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (references/_shared/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — full run-of-show, timing sums, owners + cues + contingencies, critic ≥35.
- **DONE_WITH_CONCERNS** — delivered; critic 25-34 OR an unresolved tech/cast unknown (flagged).
- **BLOCKED** — critic FAIL twice; missing event type/duration; cast undefined.
- **NEEDS_CONTEXT** — no event brief; recommend defining type + duration + goal first.

## Worked Example

A 45-minute product-launch webinar (welcome → problem → live demo → customer story → offer → Q&A → close), with the demo-fails + silent-Q&A contingencies: [`references/examples/runofshow-walkthrough.md`](references/examples/runofshow-walkthrough.md).
