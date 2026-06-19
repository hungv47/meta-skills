---
title: Run Launch — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: run-launch
load_class: ANTI-PATTERN
---

# Anti-Patterns

Load at critique time and before any step transition.

## 1. Fusing a step into the orchestrator

**Pattern:** the runner "saves a dispatch" by writing the campaign plan / the asset brief / the
launch copy itself instead of dispatching the step's leaf skill.

**Why it fails:** single-responsibility skills are what keep each step independently critic-gated;
inlined work bypasses the leaf's own gates and its quality rubric (orchestrate, don't fuse).

**Instead:** every step dispatches its leaf (`research-icp`, `plan-campaign`, `brief-*`,
`write-launch`/`write-social`, `publish-social`, `measure-results`); the runner owns only
sequencing, the pack narration, and the bundle. (Reading the pack §5/§6 to *narrate* the
run-of-show at an unwired step is narration, not fusing — it writes no leaf artifact.)

## 2. Auto-publishing

**Pattern:** the publish step pushes the post / schedules the launch because the copy "looks done",
or treats `publish-social` Direct mode as implicit approval.

**Why it fails:** humans own publication (architecture §9.2, D-8); an auto-published launch ships
unreviewed copy and can trip a channel's §4 guards (e.g. a vote-ask) with no human in the loop.

**Instead:** the publish step emits the cross-post copy + dispatch plan `decision_state: pending`
and stops; the human publishes. No auto-publish, ever.

## 3. Faking a pack binding

**Pattern:** narrating "tailored for Product Hunt" at step 2 or 6 as if `plan-campaign` /
`publish-social` bound the launch pack — when they don't.

**Why it fails:** it's the exact lie the legibility convention exists to prevent (Hard Rule 2) —
a "tailored" claim with no real binding. It also hides the S3.2/S3.3 work that still needs doing.

**Instead:** narrate the **transparent degrade** — say the leaf doesn't bind the launch pack yet,
and that the runner read the pack §N directly to ground the step (launch-chain-spec § Degrade).

## 4. A black-box run

**Pattern:** running the chain end to end and presenting only the final bundle — no per-step
narration of which pack tactic was applied or what the launch is betting on.

**Why it fails:** D-8 allows orchestration **only because it is legible**; an opaque runner is the
autopilot the strategy warns against. Invisible expertise earns no trust (legibility convention).

**Instead:** every step narrates its applied play (legibility) + the launch's bet (why-this-works);
the bundle shows the run-of-show, not just the result.

## 5. Cloning the runner per channel

**Pattern:** forking `run-launch` into `run-ph-launch`, `run-reddit-launch`, … to vary channel
tactics.

**Why it fails:** D-6/D-7 — cloning re-pays the expensive orchestration machinery to vary the ~20%
a pack already isolates. The channel difference is data (the pack), not code.

**Instead:** one runner, pack-driven. A new channel = a new `launch-channel` pack (S3.2), not a new
skill.

## 6. Closing without measure

**Pattern:** declaring the launch done at publish — never dispatching `measure-results`, so nothing
is written back to the pack.

**Why it fails:** the loop is the point (D-9 close-the-loop). Without the write-back the next launch
on this channel starts from a blank page, and the launch's bet is never tested.

**Instead:** no measure handoff → the loop is **open**; flag `DONE_WITH_CONCERNS` and name the
missing return-leg. `measure-results` owns the pack write-back + the performance row.

## 7. Multiple channels in one run

**Pattern:** running one `run-launch` for "Product Hunt + Reddit + X" at once, mixing run-of-shows.

**Why it fails:** each channel's pack is per-channel, with its own §4 guards, timing, and §5
playbook; one bundle can't stay coherent across them (the bundle-coherence gate fails).

**Instead:** one run per channel (each grounded in its own pack, each closing its own loop). A
multi-channel launch picks channels in `plan-campaign`, then runs the runner once per channel.
