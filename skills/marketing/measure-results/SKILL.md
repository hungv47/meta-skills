---
name: measure-results
description: "Ingest a launch/campaign's real post-publish results for ONE channel, produce a structured what-worked/what-failed read against that channel's playbook pack, and feed a dated entry back into the pack so the next launch compounds. Closes the metrics loop (pillar 3). Not for scoring a single organic post in an eval loop (use evaluate-content), paid-ad results (use evaluate-ad), short-form video (use evaluate-shortform), or landing-page CRO (use evaluate-landing-page)."
argument-hint: "<channel> <results-paste-or-path> [--slug <campaign>] [--launch-artifact <path>]"
allowed-tools: Read Write Bash Grep Glob
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.40-1.20"
---

# Measure Results — Loop Closer

4 agents (metric-ingest → diagnosis → pack-feedback → critic) turn a channel's real launch results into a structured read **and a dated entry written back into that channel's playbook pack**, so the next launch on the channel starts from evidence, not a blank page. Capability: [`routing.yaml`](routing.yaml). Agents + rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Method: [`references/playbook.md`](references/playbook.md).

**Core question:** Which specific pack tactic earned (or cost) the result — and what should the next launch on this channel keep, drop, or test?

## Critical Gates — load first

1. **One channel per run.** Multi-channel results = one run per channel (the pack is per-channel). 
2. **Pack-grounded or transparent.** Diagnose against the channel's pack (§3 signals, §5 playbook); if no pack covers the channel, say so and produce a general read — never fake channel attribution (legibility convention).
3. **Evidence, not vibes.** Every "what worked" names the tactic + the number that supports it. No number → it's a hypothesis, labelled as one.
4. **Loop write-back is the point.** A run that produces a read but writes nothing back to the pack/performance store has not closed the loop.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

| Input | Source | Required? |
|---|---|---|
| Channel results (paste or path) | operator | **Hard** — the numbers to read |
| Channel pack | `references/_shared/platform-intelligence/[channel].md` | Rec — the tactics to attribute against |
| Launch artifact | `plan-campaign` / launch chain comms plan | Rec — the hypotheses being tested |
| `.forsvn/performance/*.tsv` | prior runs | Opt — trend context |

Mode per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md). `budget: standard`. `--fast` → ingest + read, skip the trend layer; **never** skips the pack write-back or the critic. Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

## Quality Gate — 5 dimensions

Full rubric: [`references/rubric.md`](references/rubric.md).

- [ ] Attribution — each result traced to a named pack tactic / ranking signal (not "it went well")
- [ ] Falsifiability — claims carry the supporting number; hypotheses labelled
- [ ] Honesty — failures named as plainly as wins (anti-sycophancy)
- [ ] Actionability — a concrete keep/drop/test for the next launch
- [ ] Write-back fidelity — the pack entry + performance row are accurate and dated

Pass ≥35/50 AND no dim 0. FAIL twice → `BLOCKED`, no write-back.

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/measure-results/[channel]-[YYYY-MM-DD]-[slug].md`. **Lifecycle:** `evaluation`.
- **Frontmatter (12):** `skill`, `version`, `date`, `stack`, `type`, `id`, `review_surface`, `status`, `channel`, `pack_verified`, `applied_tactics`, `keywords`.
- **Body:** Results table (metric · value · vs-expected) · What worked (tactic + number) · What failed · Keep/Drop/Test · Pack write-back block · Critic verdict.
- **Side effects (on critic PASS):** append a dated entry to the channel pack changelog (`references/format-conventions.md` § Pack write-back); append a row to `.forsvn/performance/[channel].tsv`; if a hosted key is present, mirror the result to the cross-session metrics feed (`bun scripts/forsvn-hosted.ts metrics [channel] --worked "..." --failed "..."` — POSTs `/v1/metrics`, best-effort, inert without a key, never blocks). Full contract: [`references/format-conventions.md`](references/format-conventions.md).

## Routing + Dispatch

Sequential graph (metric-ingest → diagnosis → pack-feedback → critic). Dispatch + revision cycle: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Chain Position

**Prev:** the launch chain (`plan-campaign` / `publish-social`) OR a raw results paste. **Next:** the next launch on this channel reads the updated pack (loop closed). **Re-run:** new results, corrected numbers, a second channel.

**Deference:** single organic post in a loop → `evaluate-content`; paid ad → `evaluate-ad`; short-form video → `evaluate-shortform`; landing page → `evaluate-landing-page`.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 8 patterns (vanity-metric-only, sycophantic read, unattributed win, no write-back, multi-channel-in-one-run, faked attribution without a pack, hosted-post-blocks-run, overwriting pack tactics instead of appending). Re-read before write-back.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (references/_shared/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — read produced, critic ≥35, pack + performance write-back done.
- **DONE_WITH_CONCERNS** — delivered; critic 25-34 OR a stale/absent pack (read shipped, attribution caveated).
- **BLOCKED** — critic FAIL twice; no usable numbers; channel pack write would overwrite (needs operator).
- **NEEDS_CONTEXT** — no results provided; recommend re-running after the launch has data.

## Worked Example

Product Hunt launch read (rank 3, 412 upvotes → which §5 tactics earned it → keep/drop/test → pack changelog entry + hosted feed): [`references/examples/measure-walkthrough.md`](references/examples/measure-walkthrough.md).
