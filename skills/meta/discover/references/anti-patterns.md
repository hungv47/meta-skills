---
title: Discover — Anti-Patterns + Edge Cases
lifecycle: canonical
status: stable
produced_by: discover
load_class: ANTI-PATTERN
---

# Anti-Patterns + Edge Cases

**Load when:** the orchestrator is about to ask a question that smells off (leading, surface-level, codebase-answerable), OR is about to accept a should-want answer at face value, OR an edge case fires. Re-read at any moment of doubt.

---

## Interview anti-patterns

| Anti-Pattern | Problem | Instead |
|---|---|---|
| Leading questions | "Don't you think we should use WebSockets?" pushes toward a predetermined answer | Ask open-ended: "What are your latency requirements?" |
| Accepting the first answer | Surface-level answers miss hidden constraints | Probe deeper: "Why that approach?" and "What would change your mind?" |
| Asking questions the codebase answers | "What framework?" when package.json is right there | Context scan first; skip answered questions |
| Options instead of decisions | "We could use X or Y" doesn't resolve anything | Push for concrete choices; undecided items go to Open Questions |
| Accepting should-want at face value | User says what sounds "correct" rather than actual need | Use intent alignment techniques (Past Behavior Probes + Failed Attempt Archaeology) to probe real needs |
| Skipping edge cases | Happy-path specs produce code that breaks in production | Explore failure modes, concurrent access, empty states |
| Scope creep during interview | Each new question expands feature surface | Periodically re-anchor: "Is this still in scope?" |
| Announcing techniques | "I'm now using the Why Chain technique" breaks conversational flow | Just ask the question naturally |
| Giant plans nobody reads | Producing a 500-line spec that gets rubber-stamped | Conversation-first; artifacts only when genuinely needed |
| Fixed dimensions for every problem | Security & Privacy for a CSS refactor wastes time | Adaptive zones based on what matters for THIS problem |

## Resolution / exit anti-patterns

| Anti-Pattern | Problem | Instead |
|---|---|---|
| Silent exit on operator override | Operator says "ship it" and discover skips the resolution-exit check — the audit trail of skipped branches disappears | Operator override is ALLOWED; silent exit is NOT. Log skipped branches under `Open branches (operator-overridden):` (conversation) + `## Open Branches (operator-overridden)` (spec); set `status: done_with_concerns` if saved. |
| False resolution | Calling the session "done" when load-bearing branches weren't recommended-and-cited | The 3-clause resolution-exit condition is the gate (Step 6). If you can't name what this session changed, you didn't grill — you transcribed. |
| Two verdicts | Stating one verdict in conversation and a different one in the saved spec | Single verdict, two surfaces. The conversation Verdict and spec `## Verdict` are one decision rendered in two places. |
| Verdict-skipping | Ending the session without an explicit verdict ("ready to build?" without naming `VALIDATED` / `BUILD_AS_PROPOSED` / etc.) | Verdict is not optional — operator-grade discover ends on a clear decisional output. If you cannot pick one, the conversation isn't done; surface what's missing and continue. |
| Mode-mixing | Treating an idea-stage session as plan-review (skipping idea-critic) OR a plan-review session as idea-stage (running idea-critic on a scope question) | Step 2.5 detection is one-shot but correctable. If ambiguous, ask the one-line detection question and lock the mode before opening coverage zones. |
| Plan-review-mode drift | User picks SCOPE EXPANSION at Step 2.5 but the alternatives quietly drift toward conservative cuts | Locked for the session. If user wants to switch, they say so and discover re-anchors. |
| Padding | Restating what the user said as if it's insight | Take a position. If you can't recommend, you don't understand the question well enough to ask it. |

## Output anti-patterns

| Anti-Pattern | Problem | Instead |
|---|---|---|
| Default-to-save | Writing a spec when the conversation context was sufficient | Save only when: user asks, session is ending and decisions would be lost, output needed by someone outside, OR natural milestone reached and user confirms. Most sessions end without writing anything. |
| 5 mandatory sections on Light-depth saves | Applying Premise Challenge to "add a dark mode toggle" — overhead exceeds value | Light-depth uses the compact format (`light_spec: true`). The 5 mandatory sections are for Medium/Deep depth only. |
| Defaulting to the smaller/safer alternative | "Recommend Option A because it's smaller" without weighing whether A serves the stated outcome | Equal-weight rule (load-bearing). AI compresses implementation; the rewrite often serves the stated outcome better. Recommend whichever serves the goal — and say so explicitly with a reason. |
| Single Implementation Alternative without flagging | Only one viable path generated, no acknowledgment that this is unusual | If only one alternative was generated, that section MUST flag "Only one viable path because [hard constraint X]." Premature single-option lock-in is the failure mode this section exists to prevent. |

## Edge cases (operational, not anti-patterns)

| Edge Case | Handling |
|---|---|
| **"Just do it"** | List assumptions inline and start building. Skip questions; mention critical assumptions briefly. |
| **"Skip questions"** | Context scan only, summarize what you know, proceed. |
| **"Save this"** | Write `docs/forsvn/artifacts/meta/specs/*.md` or emit contract format inline per [`procedures/output-formats.md`](procedures/output-formats.md). |
| **All questions answered by context** | Skip to clarity check. Note context was sufficient. |
| **Contradictory answers** | Flag it. One follow-up to resolve. |
| **Task changes mid-conversation** | Re-assess whether prior answers still apply. 1-2 new questions if scope shifted. Don't restart. |
| **Experience doc has answers** | Read `docs/forsvn/experience/{domain}.md` first. Only ask what's not answered. |
| **Task is trivial** | Say so. Suggest skipping discovery. |
| **"That's enough"** | Respect it. Note current clarity level and unexplored zones. |
| **Operator-playbook frame is stale** (>90 days `last_verified`) | Flag inline ("frame may be stale; verify before relying on numeric thresholds") but still apply the stance. |
| **Idea-critic PUSH_BACK after one re-run** | Surface: "the idea is currently failing the demand-side validation rubric — recommend pausing to gather evidence." Operator can override; record in spec frontmatter `status: done_with_concerns`. |
| **Premise check fires but user disagrees with the framing** | Record the disagreement in the Premise Challenge section (user's stance: rejected, with reason). Don't paper over. |
