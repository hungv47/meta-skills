---
title: Discover — Step 2.7 Idea Critic Dispatch
lifecycle: canonical
status: stable
produced_by: discover
load_class: PROCEDURE
---

# Step 2.7 — Idea Critic Gate Dispatch

**Load when:** mode is `idea-stage` (per Step 2.5 detection) AND skip-conditions don't fire. Single-shot agent dispatch — does NOT loop per turn. Output gates whether discover proceeds to Step 3 Coverage Zones.

---

## When to dispatch

Run the idea-critic agent ONCE before opening coverage zones, when:
- Mode is `idea-stage` (user brought unstructured idea, no prior plan)
- Skip conditions (below) do NOT fire

The agent scores the user's substantive idea-statement against 5 red flags and 5 green flags ([`../../agents/idea-critic.md`](../../agents/idea-critic.md)), returns `PROCEED` or `PUSH_BACK` with cited flags.

## Dispatch

Call the agent via the `Agent` tool, passing all three Input Contract fields the agent declares:

| Field | Content |
|---|---|
| **`idea-statement`** | The user's substantive description of what they want to build, post-Premise Check. A one-paragraph summary of the user's first turn after the framing checkpoint, paraphrased faithfully — NOT the user's whole transcript. |
| **`context-gathered`** | The orchestrator's serialized findings from Step 1: codebase signals worth flagging, relevant `docs/forsvn/experience/{domain}.md` Q&A, prior specs/sketches on the same idea if any, the operator-craft stance load already loaded by Step 1, and the founder-domain frame match if any. |
| **`mode`** | Literal string `idea-stage`. |

The agent is single-shot — do not re-invoke per turn. Output is structured:

- `## Red Flags Detected`
- `## Green Flags Detected`
- `## Score`
- `## Verdict` (PROCEED or PUSH_BACK)
- `## Push-Back Routing` (questions to ask the user if PUSH_BACK)
- `## Change Log`

Threshold: **≥2 red OR <2 green → PUSH_BACK**. Otherwise PROCEED.

## On PROCEED

1. Acknowledge any green flags inline ("the manual-loved-by-few signal is strong here")
2. Note any single red flag as a watch-item (it didn't cross threshold but stays surfaced)
3. Continue to Step 3 Adaptive Coverage Zones

## On PUSH_BACK

1. Do NOT proceed to coverage zones / alternatives generation
2. Surface the cited flags to the user in plain language
3. Read the agent's `## Push-Back Routing` output section and ask those questions to the user (one round)
4. Treat the responses as new `idea-statement` input
5. Re-run idea-critic at most once after the user's clarifying answers
6. If still PUSH_BACK after one re-run, surface explicitly:

> "The idea is currently failing the demand-side validation rubric — recommend pausing here to gather evidence (manual-solve a few people, observe the community for complaints, find paid alternatives) before scoping further. Want to keep going with the rubric flagged, or pause?"

The user can override; discover proceeds with `status: done_with_concerns` baked into the spec frontmatter if saved.

## Skip conditions

Skip idea-critic when ANY of:

- **Mode is `plan-review`** — wrong rubric for the input (rubric scores idea-stage demand validation, not plan scope)
- **User explicitly says "skip the idea critic" / "I've already validated this"** — record the override in the conversation log so the spec frontmatter records it
- **Trivial scoping** (Light depth — feature add to existing codebase) — the rubric is designed for blank-slate ideas, not feature scope inside an established product

## Anti-pattern: re-invoking per turn

The agent is single-shot for a reason — re-invoking after every user response produces noise (the rubric is calibrated to a single idea-statement, not to incremental answers). The "at most one re-run after clarifying answers" rule (step 5 above) is the hard ceiling. If the rubric still PUSH_BACKs after one re-run, the right move is operator-decision (pause vs proceed-with-flag), NOT another re-invoke.
