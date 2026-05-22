# Plan-Review: 4-Mode Framework [PROCEDURE]

When `discover` runs in `plan-review` mode (Step 2.5 — the user brought an
existing plan/spec/sketch to test), the user picks one of four sub-modes
upfront, once, locked for the session. The mode sets the review posture and
locks the Step 7 Verdict vocabulary.

| Mode | Posture | When to recommend |
|---|---|---|
| **SCOPE EXPANSION** | Build the cathedral. Push scope up. Surface every reasonable expansion; recommend rebuild over patch when the rewrite is small and the existing scope undersells the goal. | User signals "I want to make this great," there's strong evidence the proposed scope is too small for the stated outcome, AI compresses implementation enough that a bigger rewrite is feasible. |
| **SELECTIVE EXPANSION** | Hold scope as baseline. Surface expansions individually for cherry-pick. | User has a concrete plan they trust but is open to specific extensions. Default for "review my plan and tell me what's missing." |
| **HOLD SCOPE** | Make it bulletproof. Interrogate the existing plan for hidden risks, missing edge cases, premise weakness, implementation traps. | User has shipped pressure or strong scope conviction; the question is execution quality, not scope debate. |
| **SCOPE REDUCTION** | Ruthless minimum-viable cut. Identify what's load-bearing for the stated outcome; propose cuts to everything else. | Time/budget pressure, MVP framing, "what's the smallest version that ships," or evidence the plan has padding masking the core. |

**Mode-pick mechanics:** Use `AskUserQuestion` with the 4 options. Pick a recommendation based on the signals above; mark `(Recommended)`; put the one-line reason in `description`. Common variants ("expand cautiously," "cut to v0 then expand later") map back to one of the four with a quick clarifying read.

**Equal-weight rule (load-bearing):** When the user picks SCOPE EXPANSION or SCOPE REDUCTION, do NOT default to the "smaller, safer" option in alternatives generation just because it feels cautious. AI compresses implementation; the rewrite often serves the stated outcome better than the patch. Recommend whichever serves the goal — and say so explicitly.

**Mode locks Step 7 Verdict.** SCOPE EXPANSION / SELECTIVE EXPANSION → `BUILD_AS_PROPOSED` / `CHERRY-PICK_EXPANSIONS` / `EXPAND_BEYOND_PROPOSED`. HOLD SCOPE → `HOLD_AS_PROPOSED` / `HOLD_WITH_RISK_NOTES`. SCOPE REDUCTION → `CUT_TO_MINIMUM` / `CUT_AGGRESSIVELY`. Idea-stage sessions (no plan-review-mode) → `VALIDATED` / `NEEDS_MORE_VALIDATION` / `PIVOT` per the idea-critic rubric.
