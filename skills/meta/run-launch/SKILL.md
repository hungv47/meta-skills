---
name: run-launch
description: "Run one channel's launch end to end as ONE legible bundle — for Product Hunt, Reddit, or any launch-channel pack. Resolves the channel pack, sequences the existing leaf skills, narrates each step's applied play, stops at the human gate, never auto-publishes. Use when you want the whole launch orchestrated, not just one piece. Not the copy bundle alone (write-launch), the run-of-show alone (plan-campaign), or a generic produce-and-measure loop (run-pipeline)."
argument-hint: "<channel> [topic-or-brief-path] [--social] [--fast|--deep]"
allowed-tools: Read Write Edit Grep Glob Bash
disable-model-invocation: true
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.20-0.90"
---

# Run Launch — Per-Channel Launch Orchestrator

*Meta process skill. Threads the per-channel launch chain into ONE legible, gated launch — resolves the pack, sequences the leaf skills, narrates each applied play, stops at the human gate. Orchestrate, don't fuse; never auto-publish (D-8).*

**Core question:** "Did this ship as ONE coherent, channel-native bundle — each step's applied play visible, the pack named — stopping at the human gate, never auto-published?"

> The 7 steps, per-step pack binding, the unwired-leaf degrade, the bundle contract: [launch-chain-spec.md](references/launch-chain-spec.md) [SPEC]. Pack contract: [`CONTRACT.md`](references/_shared/platform-intelligence/CONTRACT.md).

## Critical Gates

1. **Orchestrate, don't fuse.** Each step dispatches its leaf (`research-icp`, `plan-campaign`, `brief-graphic`/`brief-shortform`, `write-launch`/`write-social`, `publish-social`, `measure-results`); this skill owns only sequencing, pack narration, and the bundle.
2. **Pack-resolved or transparent degrade.** Resolve the pack; narrate `pack_verified`. No pack → general principles only, stated as such; never fake tailoring.
3. **Stop at every gate; never auto-publish.** Every step lands `decision_state: pending` (architecture §9.2). The publish step hands to `publish-social` (its own registry-gated fork) and stops; the human publishes (D-8).
4. **Legible, not autopilot.** Every step narrates its applied play + the launch's bet. Never a black box (D-8).
5. **Close the loop.** End at `measure-results`, which writes back into the pack. No measure handoff = open loop → `DONE_WITH_CONCERNS`.

## Quality Gate — 5 dimensions

Critic (`agents/bundle-critic-agent.md`) PASS/FAIL — all 5 must PASS:

- [ ] **Chain integrity** — 7 steps named; each maps to a real leaf or gate; current-step pointer present.
- [ ] **Pack legibility** — `pack_verified` narrated; bound steps cite their pack §N; unwired steps degrade transparently.
- [ ] **Gate discipline** — each step `decision_state: pending`; publish never auto-publishes.
- [ ] **Bundle coherence** — ONE deliverable; run-of-show consistent; required artifacts present or flagged; one channel per run.
- [ ] **Loop closure** — the `measure-results` handoff present; else flag the open loop.

## Before Starting

Resume a prior bundle for this channel+slug under `docs/forsvn/artifacts/marketing/launch/` (read **Current step**). Resolve the pack via the soft client ([`_shared/hosted-pack-client.md`](references/_shared/hosted-pack-client.md)) — current pack if a hosted key serves fresher, else the local `_shared/platform-intelligence/` mirror. Full: [`_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK].

## Pre-Dispatch

[`_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md). Cold Start needs: channel, product/topic, `brand_mode`, launch goal. Mode: [`_shared/mode-resolver.md`](references/_shared/mode-resolver.md); `--fast` skips planning/revision on clean PASS, **never** the 5 gates or no-auto-publish. Profile: [`_shared/execution-policy.md`](references/_shared/execution-policy.md).

## Dispatch

Per cycle: read state → resolve the pack → dispatch the **current step**'s leaf → **stop at its gate** → on approval, advance **Current step**, log the transition, narrate the next applied play. The copy step routes to `write-launch` for a `launch-channel` pack, `write-social` for a feed channel (`--social` forces the feed path). The unwired steps (plan, publish) degrade transparently — read the pack directly, don't rewire those leaves (S3.2/S3.3). Full sequence: [launch-chain-spec.md](references/launch-chain-spec.md).

2 agents (`agents/*.md`): **Launch Architect** (resolve pack → plan the 7-step chain mapped to leaves + per-step legibility + the bet) → **Bundle Critic** (the Quality Gate). Each leaf runs its own agents; this skill never inlines that work.

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/launch/[channel]-[YYYY-MM-DD]-run-[slug].md` (the **run record**, distinct from `write-launch`'s copy bundle). **Lifecycle:** `pipeline`.
- **Body (in order):** the 7-step run-of-show table (step · leaf · pack §N · artifact · gate/status) · [Legibility block](references/_shared/legibility-convention.md) · [Why this works](references/_shared/why-this-works-convention.md) · Critic verdict (5-row) · Anti-patterns.
- Frontmatter per [`_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md) + `pack_verified` / `applied_tactics`. **Cross-stack:** the loop closes through `measure-results`, which owns the pack write-back + `.forsvn/performance/[channel].tsv`.

## Chain Position

**Deference:** copy bundle alone → `write-launch`; single post → `write-social`; run-of-show alone → `plan-campaign`; generic loop → `run-pipeline`; post-launch read → `measure-results`. One channel per run.

## Anti-Patterns

[anti-patterns.md](references/anti-patterns.md) [ANTI-PATTERN] — fuse a step · auto-publish · fake a pack binding · black-box run · clone per channel · close without measure · multi-channel in one run.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet (populate via the slow-update workflow — references/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — bundle assembled; 7 steps mapped + narrated; pack resolved; current step clear; `measure-results` handoff present.
- **DONE_WITH_CONCERNS** — a step lacks a leaf, the loop is open, the pack is stale, or a step degraded to general principles.
- **NEEDS_CONTEXT** — missing channel, product/topic, `brand_mode`, or goal.
- **BLOCKED** — no pack and the operator declines the degrade; an unresolved leaf `GUARD_FAIL`.

## Worked Example

Product Hunt end to end, legibility narration visible: [walkthrough](references/examples/launch-run-walkthrough.md) [EXAMPLE].
