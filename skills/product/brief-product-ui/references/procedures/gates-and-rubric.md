# Critical Gates + Critic Rubric — Full Detail

Cited by `SKILL.md` "Critical Gates" and "Quality Gate". **Source of truth for the 8-checkpoint
critic rubric (CP-01…CP-08).** Read before any Layer 1 dispatch — gates fire on every run; `--fast`
does **not** bypass them (see `references/_shared/mode-resolver.md` § safety-gates-supersede).

## Why the intake gate precedes "Before Starting"

The flow is the contract. Without a validated `map-user-flow` artifact there is no screen list to
design against, so the intake gate (Gate 1) must fire before any Pre-Dispatch question — exactly as
`brief-app-preview` gates on supplied screenshots. A skill that designs screens the flow never
declared is inventing product, not specifying it.

## The 5 Critical Gates

1. **No design before a validated flow.** A parseable `map-user-flow` artifact must exist. Absent →
   `NEEDS_CONTEXT` (recommend `/map-user-flow`). Never design from a prose feature description.
2. **No invented screens.** Every screen, state, and surface in the spec traces to a flow
   screen / state / edge. Flow gaps are reported back, not silently filled.
3. **Spec, never render.** This skill emits a portable spec; it does not call image-gen or design
   APIs. `--render` / `--api` → `BLOCKED — this skill emits a buildable spec; it does not render UI.
   Drive the spec through a connected design tool via the handoff fork.` This is the identity
   differentiator from external renderers (impeccable / hallmark / stitch / frontend-design).
4. **Tokens, not raw values.** Every color / space / type / radius references a DESIGN token, never
   a raw hex/px. When the house brand is the source, FORSVN brand rules hold (dark default; Signal
   Leaf `#74B36B` <10%, state-cue only; matte not glass; no purple/blue AI gradients). Tokens absent
   → set `brand_source: cold-start-hint` and proceed with named placeholders, never inventing a palette.
5. **Every state gets a visual treatment.** Every interactive element specifies its full state set;
   every screen's empty / loading / error has a concrete visual spec, never "show an error."

## Quality Gate — the 8-Checkpoint Critic Rubric (CP-01 → CP-08)

The critic (`agents/critic-agent.md`) evaluates each checkpoint **binary PASS/FAIL**. Any FAIL fails
the gate and re-dispatches the named agent. All 8 must PASS to ship.

1. **CP-01 Flow grounding** — every screen traces to a `map-user-flow` screen/state; zero invented
   screens; every flow edge / empty / loading / error state has a visual treatment. *(→ screen-inventory-agent)*
2. **CP-02 Component reuse & hierarchy** — components named and reused across screens (no per-screen
   one-offs); composition hierarchy explicit; primitive count bounded and listed. *(→ component-system-agent)*
3. **CP-03 Token fidelity** — every color/space/type/radius references a DESIGN token (no raw hex/px);
   FORSVN brand rules honored when the house brand is the source; `brand_source: cold-start-hint`
   flag present when tokens are absent. *(→ token-application-agent)*
4. **CP-04 Layout system** — explicit grid + spacing rhythm + density + responsive/adaptive behavior
   per surface; no ad-hoc spacing. *(→ layout-state-agent)*
5. **CP-05 State coverage** — every interactive element specifies the full state set
   (default/hover/active/focus/disabled); every screen's empty/loading/error has a visual spec, not
   just "show error." *(→ layout-state-agent)*
6. **CP-06 Accessibility floor** — contrast ratios stated; focus order defined; touch-target minimums
   met; reduced-motion fallback specified. *(→ layout-state-agent)*
7. **CP-07 Handoff readiness** — buildable by a tool/agent without a follow-up question; the handoff
   block names the target engine + mode (tool-redirect + execution-fork). *(→ handoff-agent)*
8. **CP-08 No-render discipline** — the artifact is a SPEC, not rendered UI; `--render`/`--api` were
   refused with `BLOCKED`. The identity guarantee. *(→ handoff-agent re-asserts the no-render boundary;
   the `--render`/`--api` refusal itself is an orchestrator pre-dispatch gate, not a rewrite path)*

## Critic FAIL handling

The critic returns the failing CP-IDs, each with a specific fix and the named agent to re-dispatch
(routing column above). Max 2 rewrite cycles. After 2 FAILs, deliver with critic annotations and
flag `status: DONE_WITH_CONCERNS`. Verdict is binary per checkpoint — no "conditional pass."
