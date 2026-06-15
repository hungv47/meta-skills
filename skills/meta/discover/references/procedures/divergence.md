---
title: Discover — Divergence Pass (generative ideation)
lifecycle: canonical
status: stable
produced_by: discover
load_class: PROCEDURE
---

# Divergence Pass (Step 2.6)

**Load when:** an idea-stage session resolves to **Deep** depth **and** the solution space is open —
the user brought a problem/goal with no committed solution, or signals exploration ("not sure what to
build", "what are my options", "brainstorm this"). Also load when the operator forces it. The one
generative pass in an otherwise convergent skill: produce *breadth of candidate directions* before
narrowing to one to clarify.

**Default is OFF.** discover is convergent by design. Divergence is the exception, gated below — most
sessions skip it and go Premise Check → idea-critic → zones as usual.

---

## When it fires

| Situation | Behavior |
|---|---|
| Deep depth + **open solution space** (problem/goal stated, no committed solution) | **Auto-fire** the pass. |
| Deep depth + user brought a **committed solution** | **Offer once**, don't force: "Want me to generate alternative directions first, or clarify this one?" Proceed on their answer. |
| Operator says "brainstorm this" / "explore options first" / "diverge" | **Force on** (any depth except Light). |
| Operator says "I know what I want, just clarify" | **Force off** — record the skip once, like an idea-critic skip. |
| **Light** depth (clear task, well-defined scope, existing codebase) | **Never fires.** Divergence overhead exceeds value on a scoped task. |
| **Plan-review** mode | **Never fires** — there's a plan already; use the 4-Mode Framework. |

Never auto-hijack a committed idea — offer, don't impose. The user owns whether the solution space is
open. A **declined offer or a forced-off skip is recorded once** in the session (like an idea-critic
skip), so the wrap-up shows divergence was considered, not silently passed over.

---

## Not Premise Check, not idea-critic, not debate-agents

The three adjacent moves divergence is most often confused with — keep them distinct:

- **Premise Check (Step 2)** *reframes the stated thing* ("Right problem?"). Divergence *generates
  alternatives to it*. A weak premise is a *trigger* for divergence, not the same move.
- **Idea-critic (Step 2.7)** is *evaluative* — scores demand-side validation of the chosen direction
  (PROCEED / PUSH_BACK). Divergence is *generative* — breadth, judgment suspended. **Order:** diverge →
  converge to a direction → idea-critic scores *that* direction. Divergence runs *before* 2.7.
- **debate-agents (Step 5)** *pressure-tests between known* options. Divergence *produces* the options.
  Divergence **feeds** debate-agents: generate many → shortlist → invoke Step 5 only when the shortlist
  has non-obvious tradeoffs and the choice is expensive to reverse.

---

## Generation discipline (so it isn't slop)

The failure mode is listing three obvious variations of the stated idea. Enforce:

1. **Force-quota across explicit divergence axes.** Generate candidates that differ on a *dimension*,
   not in wording. Axes to push on:
   - **Different user** — same problem, a different buyer/segment.
   - **Different wedge** — a narrower entry point into the same space.
   - **Different mechanism** — a different way to deliver the outcome (automation vs concierge vs
     marketplace vs content).
   - **Do-nothing / manual** — the non-software or Wizard-of-Oz version (often the real baseline).
   - **Adjacent problem** — the neighboring pain that may be more acute than the stated one.
2. **Suspend judgment during generation.** No ranking, no "but that won't work" mid-generation.
   Breadth first; evaluation is a separate phase. Mixing them collapses the set to the safe option.
3. **Then converge.** Cluster near-duplicates, drop the genuinely weak, and recommend a shortlist with
   the blunt-peer stance ("I'd pursue B and C because Y; A is a trap because Z"). Take a position.

---

## Candidate-set format (inline)

Emitted inline in conversation (not a saved artifact). Compact table, then a recommended shortlist:

```markdown
## Directions

| # | Direction | Core bet | Who it's for | Why it could win | Why it could fail |
|---|---|---|---|---|---|
| 1 | [one line] | [the load-bearing assumption] | [specific user] | [edge] | [risk] |
| … | | | | | |

**Shortlist: [#, #]** — [one paragraph: why these survive, why the rest don't. Name the axis each
strong one wins on. Blunt-peer: recommend, don't hedge.]
```

Aim for 5-8 raw directions before converging; fewer than 4 usually means the axes weren't pushed.

---

## Convergence handoff (rejoin the normal flow)

Once the user picks (or ratifies the recommended shortlist down to one direction):

- The **chosen direction** becomes the idea-statement that flows into **Step 2.7 idea-critic** and
  **Step 3 coverage zones** — divergence rejoins the convergent pipeline; it does not replace it.
- A still-live 2-3 way shortlist with real tradeoffs → optionally invoke **Step 5 debate-agents** to
  narrow.
- The shortlist needs a **scored ranking**, or the operator asks "rank these" → hand off to
  **`prioritize` (ideation mode)**: the chosen goal becomes the ranking anchor, and the candidates get
  force-ranked + evidence-scored per [`../_shared/idea-ranking-core.md`](../_shared/idea-ranking-core.md).
  The inline blunt-peer shortlist above remains the right call for light cases — hand off only when the
  set warrants real scoring.

## Feeds the wrap-up (Step 6/7 + the handoff plan)

Divergence output has three existing sinks (see `output-formats.md`) — invent no new artifact:

- **Chosen direction + why** → Step 6 Key Decisions; the handoff plan's "Decisions locked" / "Where we
  are"; the spec's "Decided Approach".
- **Parked / rejected directions + why-parked** → the handoff plan's "Open branches / unresolved" and
  "Context a fresh agent needs → Don't redo"; the existing `docs/forsvn/artifacts/meta/out-of-scope/`
  institutional-memory file (see output-formats.md § Out-of-scope persistence). A fresh agent must not
  re-explore what this session already ruled out.
- **The shortlist** → the operator-grade spec's existing "Implementation Alternatives (min 2-3)"
  section. Divergence is where those alternatives come from honestly, instead of being back-filled.

---

## Anti-patterns

- **Premature convergence.** Recommending before the set is generated. The whole point is breadth
  first; if you ranked while generating, you didn't diverge.
- **Anchoring on the stated idea.** Producing N reworded versions of what the user already said. Each
  candidate must win on a *different axis* or it's not a candidate.
- **Diverging a scoped task.** Firing on Light depth or a committed, well-understood build. Overhead
  exceeds value; just clarify and go.
- **Divergence theatre.** Generating throwaway options to look thorough, then steering to the
  pre-decided one. If the shortlist was decided before generation, skip the pass and say so.
- **Never converging.** Leaving the user with 8 options and no recommendation. Generation is half the
  job; the blunt-peer recommendation is the other half.
