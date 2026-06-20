# `run-plan` — the approved-plan executor (A4)

The source of truth for how `run-plan` walks an **approved** `plan.md`. It is the executor behind
the two trust contracts: (1) a legible plan shows **before** it runs (A3 produced it; a human
approved it), and (2) publish / spend / external / irreversible steps **always stop for a human**.
`run-plan` auto-advances only *between* those gates, inside the A6 governor envelope.

- **Reads:** `.forsvn/runs/<slug>/plan.md` (A3, machine-state — schema owned by `bin/plan.ts`).
- **Writes:** nothing of its own — it moves the plan's step `status` / `current_step` via `bin/plan.ts`
  and lets each dispatched leaf write its artifact (`decision_state: pending`). It never publishes,
  never approves, never hand-edits the plan's machine fields.
- **Calls:** `bin/lib/governor.ts` (A6) before each step; the capability index (built by
  `bin/build-capability-index.ts`) for the live `gate_class` + `domain`.

## Preconditions (refuse otherwise)

1. A plan exists at `.forsvn/runs/<slug>/plan.md`. Absent → `NEEDS_CONTEXT` (point at `/forsvn` to plan it).
2. `status == approved`. Any other status (`proposed`, `running`, `done`, `abandoned`) → STOP.
   `proposed` is the common case: **a human must approve before step 1.** `run-plan` never self-approves.

## The executor loop

Per ready step (every `depends_on` is `done`), in `depends_on` order:

```text
read plan  (bun bin/plan.ts show <slug>)
for the next ready step S:
  gate = stricter_of( S.gate , capability_index[S.skill].gate_class )   # default review; never auto
  if gate == publish:
      narrate "■ Step n/N /<skill> — publish gate: human required (nothing published)."
      STOP                                  # do not dispatch, do not advance, publish nothing
  gov = governor.check(step_index = done_count,
                       running_domain = chain_domain,
                       next_domain    = capability_index[S.skill].domain,
                       cost_so_far, next_cost)        # bun bin/lib/governor.ts check …
  if gov == STOP:
      narrate "■ governor stop (<reason>) — human required."
      STOP
  # gate ∈ {auto, review} AND governor proceeds:
  dispatch S.skill(S.args)                  # the leaf runs its own agents + critic
  artifact.decision_state = pending         # NEVER auto-ratify
  narrate "▸ Step n/N /<skill> — <applied play / why>"
  bun bin/plan.ts set-status <slug> S done
  bun bin/plan.ts advance <slug>
loop until: a publish gate, a governor stop, or no ready step (plan complete)
```

### The stricter-gate rule (defense in depth)

A step's effective gate is the **stricter** of two sources: the plan row's `gate` (A3/A5 filled it
from `gate_class` at plan time) and the capability's **live** `gate_class` (read now from the index).
If either says `publish`, the step is a publish stop. This means a plan authored before a capability
was reclassified to `publish` still stops correctly. A missing/unknown gate on either side resolves to
`review` — **never** `auto`.

### Domains for the governor

- `chain_domain` (running domain) = the plan's primary **execution** domain — the domain of its
  terminal (last non-`meta`, non-`research`) target step. A research producer prefix does not set it.
- `next_domain` = the next step's capability `domain`, from the index.
- The governor re-confirms only a `marketing ↔ product` jump; a normal `research → marketing` funnel
  proceeds, and `meta` orchestration steps never trip it (see `bin/lib/governor.ts`).

## Governor config — `.forsvn/config.json` (A6)

Net-new, all keys optional; conservative defaults when the file is absent. Machine-state config under
`.forsvn/` (like `execution-profile.json`), exempt from the artifact contract.

```jsonc
{
  "governor": {
    "max_steps": 6,                 // hard stop after N auto-advances
    "checkpoint_every": 3,          // pause + summarize every N steps
    "domain_jump_reconfirm": true,  // marketing <-> product mid-chain re-confirms
    "max_cost_usd": null            // null = no budget cap; else STOP before the sum exceeds it
  }
}
```

**Hard rule:** no key in this file can set or downgrade a step's gate. `loadGovernorConfig` reads ONLY
the four envelope knobs above and **drops every other key** — so a `gate_override` (or any such key)
is silently ignored. Publish gates are hard-coded per capability (`gate_class`, A4); the governor can
only make a run *more* restrictive, never less. This is the same publish contract as "no accept tool
over MCP" (`crates/forsvn-mcp/tests/collab_guard.rs`), enforced from the executor side.

## Worked example

Plan `summer-hero` (approved), three steps:

| id | step | skill | gate | status |
|----|------|-------|------|--------|
| s1 | Research ICP | /research-icp | auto | pending |
| s2 | Write hero | /write-copy | review | pending |
| s3 | Post to X | /publish-social | publish | blocked |

`run-plan summer-hero`:

```text
(status: approved ✓)
▸ Step 1/3 /research-icp — auto producer: ICP for indie-SaaS founders (decision_state: pending)
▸ Step 2/3 /write-copy — review: drafted the pricing hero off the ICP wedge (decision_state: pending)
■ Step 3/3 /publish-social — publish gate: human required (nothing published).
STOP — 2 steps advanced, 0 published. The human reviews the artifacts and publishes from the review surface.
```

If `summer-hero` were still `status: proposed`, `run-plan` prints
`BLOCKED — plan not approved (status: proposed); a human must approve before step 1` and runs nothing.
