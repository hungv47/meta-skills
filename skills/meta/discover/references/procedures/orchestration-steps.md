---
title: Discover — Orchestration Steps (full detail)
lifecycle: canonical
status: stable
load_class: PROCEDURE
---

# Orchestration Steps

Full step-by-step procedure for `/discover`. The SKILL.md body carries one-line summaries; this file carries the load-bearing detail. Load when the operator's depth resolves to Medium or Deep, or when running the resolution-exit gate.

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

## Step 6 — Clarity Check

When clarity is sufficient to build:

1. Summarize key decisions.
2. Note remaining open questions and their impact.
3. **Playbook-citation self-check** — verify the recommendation cited at least one applicable operator-playbook frame when one was loaded. If a founder-domain frame was loaded but no rule from it surfaced, either cite it, explain why it doesn't apply, or revisit the recommendation.
4. **Verdict assignment** — state the explicit verdict before asking to build:
   - **Idea-stage:** `VALIDATED` / `NEEDS_MORE_VALIDATION` / `PIVOT`.
   - **Plan-review:** `BUILD_AS_PROPOSED` / `CHERRY-PICK_EXPANSIONS` / `EXPAND_BEYOND_PROPOSED` / `HOLD_AS_PROPOSED` / `HOLD_WITH_RISK_NOTES` / `CUT_TO_MINIMUM` / `CUT_AGGRESSIVELY`, mapped to the chosen plan-review-mode.
   The verdict is not optional. **Single verdict, two surfaces:** if the spec is saved (Step 7), the same verdict persists verbatim to `## Verdict`.
5. Ask: "Ready to build, or go deeper on anything?"

### Resolution-exit condition

Replaces "if the user says go, go." The session exits when the decision tree is *resolved*, not when the user runs out of patience. **Resolved** means ALL THREE:

1. Every load-bearing branch has a recommended answer with a cited reason (operator-playbook rule, prior artifact, evidence surfaced this session, or explicit defer-with-trigger).
2. Every Premise Challenge premise has the user's stance recorded (accepted / rejected / deferred — not silently passed over).
3. At least one piece of evidence surfaced that wasn't already in the user's head at the start. If you can't name what this session changed, you didn't grill — you transcribed.

**Clauses 2 and 3 are N/A** for:
- Light-depth sessions (clause 1 only)
- Contract-format saves (Premise Challenge doesn't apply — scope-locking, not idea-validating)
- Plan-review HOLD SCOPE mode (execution-risk surfacing, not premise re-litigation)
- Premise-skipped sessions (clause 2 N/A; note "Premise Challenge skipped" once)

**Operator override is allowed; silent exit is not.** "Ship it" with unresolved branches → log them inline under `Open branches (operator-overridden):`. If saved (Step 7), set `status: done_with_concerns` and persist under spec `## Open Branches (operator-overridden)`.
