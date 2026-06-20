# run-plan — Anti-Patterns

Failure modes the executor must never exhibit. Each is a hard stop, not a style note.

- **Running an unapproved plan.** `status != approved` (especially `proposed`) → refuse and report;
  a human approves before step 1. The executor never self-approves.
- **Publishing, or advancing past a publish gate.** A `publish` step STOPS the run unconditionally —
  hand to the human, publish nothing, do not advance. There is no `--force`.
- **Letting config downgrade a gate.** `.forsvn/config.json` can only tighten the run (fewer steps,
  budget caps). A key that tries to set a step to `auto`/`review` is ignored by the loader; a publish
  gate is hard-coded per capability.
- **Auto-ratifying an artifact.** Every dispatched leaf's output stays `decision_state: pending`. The
  executor approves nothing — review is human-owned (architecture §9.2).
- **Black-boxing a step.** Every advance narrates `▸ Step n/N /<skill> — <play>`; every stop narrates
  `■ …`. No silent transitions.
- **Fusing a step's work.** The executor dispatches each step's leaf skill (which runs its own agents
  and critic); it never inlines that work itself. Orchestrate, don't fuse.
- **Ignoring a governor stop.** A `max-steps` / `checkpoint` / `domain-jump` / `budget` stop ends the
  run and waits for the human — it is not a warning to step over.
- **Treating an unknown gate as `auto`.** A missing/unrecognized gate on either the plan row or the
  capability resolves to `review`, never `auto` (fail-safe toward human review).
