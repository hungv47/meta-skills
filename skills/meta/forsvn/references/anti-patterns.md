# Anti-Patterns — /forsvn

- More than 2 clarifying questions — hand off to `/discover` instead. Presenting two close candidates counts toward the cap.
- Silent dispatch — invoking the routed leaf without the one-line announcement naming it and why. The announcement is what makes a misroute interruptible.
- Printing a hand-off and stopping when classification was confident. The old contract — it's how "brief the landing page first, then build" loaded context but never invoked the leaf. Confident classification → record → announce → invoke via the Skill tool.
- Auto-firing on a coin flip. Two candidates scoring close → present both; the operator picks.
- Skipping the routing record write, or writing it after the Skill call. The record lands before invocation (`status: dispatched`, `dispatched-by: forsvn`); resume and crash-recovery depend on it.
- Treating `/forsvn` as a brainstorming chat. Every invocation produces a dispatch, a candidate choice, or a written artifact.
- Dispatching domain work without reading the relevant `references/chains/<domain>.md`.
- Re-asking a question already answered in `docs/forsvn/experience/`. Grep first.
- Bypassing the brand check on marketing dispatch.
