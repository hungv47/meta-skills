# Rubric — Design Lifecycle (6 dimensions)

[PROCEDURE] — the critic's quantitative scoring contract. Loaded at critic dispatch.

**Gate:** Total ≥30/42 AND every dimension ≥4/7 AND all four hard gates pass (see `agents/critic.md` § Hard Gates). Total 30–34 with all dims ≥4 ships as `DONE_WITH_CONCERNS`. Any dim <4, or any hard gate failing, = FAIL.

## The 6 dimensions

### 1. Activation-fit (/7)
Does every step advance or unblock ONE named, measurable activation metric?

| Band | Description |
|------|-------------|
| 6-7 | Every step traces to the single activation metric; the metric is event-defined with a window; no step chases a vanity proxy |
| 4-5 | Metric is named and most steps serve it; 1 step drifts toward engagement-for-its-own-sake |
| 0-3 | Metric undefined or a vanity proxy (opens); steps are a generic drip |

### 2. Trigger/Suppression soundness (/7)
Is every step event/windowed-time triggered, with a real exit?

| Band | Description |
|------|-------------|
| 6-7 | Every step has a concrete trigger AND a suppression cell; the four standing exits (activated/converted/unsubscribed/frequency-cap) are all present |
| 4-5 | Triggers present; suppression present but one exit case is thin |
| 0-3 | Time-only spray; any step missing suppression — the flow can re-send to an activated user |

### 3. Timing discipline (/7)
Do flow length + delays fit the activation/usage window?

| Band | Description |
|------|-------------|
| 6-7 | Flow lives inside the window where activation actually happens; delays are justified against the window |
| 4-5 | Mostly fits; one delay is arbitrary |
| 0-3 | Onboarding outlives its window; nag cadence; delays unjustified |

### 4. Branch logic (/7)
Do branches split on product-observable behavior and resolve cleanly?

| Band | Description |
|------|-------------|
| 6-7 | Branches split on real observable events; each arm re-merges or terminates with an exit |
| 4-5 | Branches are observable but one arm's resolution is vague |
| 0-3 | Branches on guessed traits the product can't fire on, or dead-end with no exit |

### 5. Per-step copy quality (/7)
One CTA/step, value before ask, brand voice, behavior-referenced.

| Band | Description |
|------|-------------|
| 6-7 | Every step: one CTA, delivers value before asking, in brand voice, references the triggering behavior |
| 4-5 | Mostly clean; one step is value-thin or off-voice |
| 0-3 | Multi-CTA steps, value-free check-ins, generic-cheerful voice, or discount-reflex on winback/churn-save |

### 6. Measurability (/7)
Activation lift over a control (or honest directional downgrade) + a kill rule.

| Band | Description |
|------|-------------|
| 6-7 | Primary metric is activation lift over a holdout (or honestly downgraded to directional with a stated reason); per-step diagnostics emittable; kill + iterate rules present |
| 4-5 | Lift defined; control present; missing an explicit kill rule |
| 0-3 | Vanity anchor; pre/post presented as causal; no kill rule; unobservable metric |

## Scoring note

The rubric scores a **design**, not a sent campaign. "Measurability" scores whether the plan *can* prove lift, not whether lift was observed (the flow hasn't run). The critic never rewards a flow for projected numbers — only for a sound, falsifiable measurement design.
