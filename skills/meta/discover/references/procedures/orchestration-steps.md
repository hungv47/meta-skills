---
title: Discover — Orchestration Steps (full detail)
lifecycle: canonical
status: stable
load_class: PROCEDURE
---

# Orchestration Steps

Full step-by-step procedure for `/discover`. The SKILL.md body carries one-line summaries; this file carries the load-bearing detail. Load when the operator's depth resolves to Medium or Deep, or when running the Step 6 concreteness / resolution-exit gate (the gate runs at every depth, Light included).

---

## Step 2 — Premise Check (non-trivial work)

Challenge with 3 quick questions before diving in:

1. **Right problem?** Restate the outcome in one sentence. Watch solution-framing vs problem-framing: "We need notifications" (solution) vs "Users miss time-sensitive events" (problem).
2. **What if we did nothing?** Real, measurable pain today? If nobody's complaining, probe why this surfaced now.
3. **What already exists?** Map the request against existing code/tooling. If 60% exists, scope is 40% of what was described.

Weak premise → say so. Suggest reframing — advise, don't block.

**Framing checkpoint** after the user's first substantive answer:

- **Language precision** — concrete, or hiding behind buzzwords ("AI-powered", "seamless", "platform")?
- **Real vs hypothetical** — describing what IS or what MIGHT? Past behavior beats future predictions.
- **Hidden assumptions** — what's taken for granted that could be wrong? State it back.

Vague framing produces precise-looking nonsense. Fix before proceeding. **Skip premise check when:** task is clearly scoped, user is continuing a prior decision, or context makes the premise obviously sound.

---

## Step 2.5 — Mode Detection (Idea Stage vs Plan Review)

One-shot read of the user's first substantive turn.

- **Idea-stage** — unstructured idea, no prior plan. → Step 2.7 (Idea Critic Gate).
- **Plan-review** — user brings existing plan/spec/sketch/ADR + wants to test it. Signals: linking/pasting an artifact, "review this plan", "is this the right scope". → mode-pick below; idea-critic does NOT fire.

Ambiguous → ask one question, recommend the read you think is more likely with one line of reason. Don't over-invest; user can correct mid-session.

**Plan-Review: 4-Mode Framework.** When mode is `plan-review`, user picks one of four sub-modes upfront via `AskUserQuestion` — SCOPE EXPANSION / SELECTIVE EXPANSION / HOLD SCOPE / SCOPE REDUCTION — once, locked for the session. Mode sets review posture and **locks the Step 7 Verdict vocabulary**. Full framework + postures + mode-pick mechanics + equal-weight rule + mode→verdict mapping: [`plan-review-modes.md`](plan-review-modes.md).

---

## Step 2.7 — Idea Critic Gate (idea-stage only)

Dispatch the idea-critic agent ONCE before opening coverage zones. Full contract + on-PROCEED + on-PUSH_BACK + skip conditions: [`idea-critic-dispatch.md`](idea-critic-dispatch.md). The agent ([`../../agents/idea-critic.md`](../../agents/idea-critic.md)) scores against 5 red + 5 green flags. **Threshold: ≥2 red OR <2 green → PUSH_BACK.**

---

## Step 3 — Adaptive Coverage Zones

Identify 3-5 zones that matter for THIS problem (not 5 fixed dimensions). Zone library by domain:

- **Product feature:** Problem validation → Solution clarity → Technical risks → Success criteria
- **Business strategy:** Problem clarity → Options landscape → Tradeoffs → Validation path
- **Marketing initiative:** Audience fit → Channel strategy → Messaging → Measurement
- **Infrastructure/devops:** Requirements → Constraints → Failure modes → Rollout plan
- **Design task:** User needs → Information architecture → Interaction patterns → Edge states

State zones upfront: "Here's what I think we need clarity on: [zones]. Anything to add or remove?" Zones are a compass, not a checklist.

---

## Step 6 — Clarity Check + Concreteness Gate

When clarity looks sufficient to build:

1. Summarize key decisions.
2. **Concreteness checklist** — state the six core requirement dimensions with their current marks (gate below). The gate decides whether wrap is allowed.
3. Note remaining open questions and their impact.
4. **Playbook-citation self-check** — verify the recommendation cited at least one applicable operator-playbook frame when one was loaded. If a founder-domain frame was loaded but no rule from it surfaced, either cite it, explain why it doesn't apply, or revisit the recommendation.
5. **Verdict assignment** — state the explicit verdict before asking to build:
   - **Idea-stage:** `VALIDATED` / `NEEDS_MORE_VALIDATION` / `PIVOT`.
   - **Plan-review:** `BUILD_AS_PROPOSED` / `CHERRY-PICK_EXPANSIONS` / `EXPAND_BEYOND_PROPOSED` / `HOLD_AS_PROPOSED` / `HOLD_WITH_RISK_NOTES` / `CUT_TO_MINIMUM` / `CUT_AGGRESSIVELY`, mapped to the chosen plan-review-mode.
   The verdict is not optional. **Single verdict, two surfaces:** if the spec is saved (Step 7), the same verdict persists verbatim to `## Verdict`.
6. Ask: "Ready to build, or go deeper on anything?" — only once the gate passes.

### Concreteness gate (the wrap condition)

The wrap condition is a six-dimension concreteness checklist. Track the six core requirement dimensions from Step 3 onward, marking each `concrete` or `open` as answers land:

| Dimension | `concrete` means |
|---|---|
| **Problem** | One-sentence problem statement, problem-framed (not solution-framed), ratified by the user |
| **Audience** | Who hits this — a named persona, segment, or user class; not "users" |
| **Constraints** | Hard limits enumerated (tech, time, compatibility, budget) — or an explicit "no hard constraints" |
| **Success criteria** | An observable / measurable done-signal; not "works well" |
| **Scope** | What this iteration includes, bounded — re-scoped from what already exists (Step 2) |
| **Anti-goals** | What we are explicitly NOT doing — at least one entry, or an explicit ratified "none" |

These six are NOT the Step 3 coverage zones. Zones adapt per-problem and shape the questions; the six dimensions are invariant and gate the exit. A zone answer typically marks one or more dimensions concrete.

**Wrap is BLOCKED while any dimension is `open`.** Two exits only:

1. **Resolve it** — keep interviewing. Questions stay Socratic, one or two at a time per Step 4 discipline: the gate governs WHEN wrap is allowed, never question style or batch size.
2. **Per-dimension operator sign-off** — the operator explicitly signs off on that specific, named dimension. A blanket "good enough, just wrap it" is NOT a sign-off: respond by listing the open dimensions and asking for sign-off on each by name ("Constraints and anti-goals are still open — sign off on each, or keep going?"). Each signed-off dimension is recorded `open — signed off`; the session exits with `status: done_with_concerns` (same status semantics as operator-overridden branches).

**No handoff while the gate fails.** discover does not hand off to `architect-system`, `breakdown-tasks`, or direct implementation with a dimension that is `open` and not signed off — there is no "mostly concrete" handoff. In-context handoff requires the gate passed in conversation; cross-session handoff requires a saved spec whose `## Concreteness Checklist` shows every dimension `concrete` or `open — signed off` ([`output-formats.md`](output-formats.md)). This is a hard block, not advice.

**No artificial grilling.** The gate measures state, not effort. A brief that arrives with all six dimensions already concrete passes on round one — confirm the checklist in the Step 6 summary and wrap. Depth interacts with the gate per SKILL.md § Adaptive Depth: Deep runs multi-round until the gate passes (not question-count-bounded); Light/Medium keep their question ceilings — hitting a ceiling with open dimensions triggers the per-dimension sign-off ask, then wraps `done_with_concerns`.

### Resolution-exit condition (quality floor under the gate)

Replaces "if the user says go, go." The concreteness gate is the wrap condition; resolution-exit is the quality floor beneath it. The session exits when the decision tree is *resolved*, not when the user runs out of patience. **Resolved** means ALL THREE:

1. Every load-bearing branch has a recommended answer with a cited reason (operator-playbook rule, prior artifact, evidence surfaced this session, or explicit defer-with-trigger).
2. Every Premise Challenge premise has the user's stance recorded (accepted / rejected / deferred — not silently passed over).
3. At least one piece of evidence surfaced that wasn't already in the user's head at the start. If you can't name what this session changed, you didn't grill — you transcribed.

**Clauses 2 and 3 are N/A** for:
- Light-depth sessions (clause 1 only)
- Contract-format saves (Premise Challenge doesn't apply — scope-locking, not idea-validating)
- Plan-review HOLD SCOPE mode (execution-risk surfacing, not premise re-litigation)
- Premise-skipped sessions (clause 2 N/A; note "Premise Challenge skipped" once)

**Operator override is allowed; silent exit is not.** Override takes the per-dimension sign-off form above — never a blanket waiver. "Ship it" with unresolved branches → log them inline under `Open branches (operator-overridden):`. If saved (Step 7), set `status: done_with_concerns` and persist under spec `## Open Branches (operator-overridden)`; signed-off-open dimensions persist in the spec's `## Concreteness Checklist`.
