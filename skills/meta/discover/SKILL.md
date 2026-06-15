---
name: discover
description: "Conversational discovery that turns a vague idea, feature, or task into shared clarity — adapts from quick scoping (3-5 questions) to deep multi-round interviews, then produces inline decisions or an optional saved spec. Use to clarify requirements before building. Not for multi-perspective debate (use debate-agents), decomposing work (use breakdown-tasks), or diagnosing a metric decline (use diagnose)."
argument-hint: "[idea, feature, or task to clarify]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
metadata:
  version: "1.0.1"
  budget: fast
  estimated-cost: "$0.03-0.10"
---

# Discover — Conversational

<!-- BUDGET_EXCEPTION: Entry-point conversational skill documents all three depth tiers (Light / Medium / Deep) in one body. Compacting below ~2,500 tokens removes structural meaning. Auto-downgrade routes simple invocations to Light; only Medium/Deep depth loads the procedural references. -->

Transform vague ideas into shared clarity through adaptive conversation. Capability metadata + load map: [`routing.yaml`](routing.yaml). Methodology (conversation-IS-the-alignment, blunt-peer stance, equal-weight rule, resolution-exit-not-patience-exit) + when NOT to use: [`references/playbook.md`](references/playbook.md).

**Core philosophy:** Just talk with your agent. Close the gap between stated requirements and true needs through conversation — not documents, formal phases, or plan mode.

**Core question:** What would we silently get wrong if we just started building?

## How It Works

You describe what you want → agent scans context + assesses complexity silently → adaptive questions begin → conversation continues to mutual clarity → build directly or save a spec. No plan mode. No pipeline stages. No mandatory artifacts. **The conversation IS the alignment.**

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode resolution** ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)). `budget: fast`; Adaptive Depth auto-calibrates Light / Medium / Deep. Overrides: "quick scope" / "deep interview" / "just ask 3 questions". `--fast` collapses to Light depth — skips operator-craft stance load, skips idea-critic gate, skips 5 mandatory spec sections on save (`light_spec: true`).
- Run **Step 1 Context Gathering** per [`references/procedures/context-gathering.md`](references/procedures/context-gathering.md) — scan codebase + `docs/forsvn/artifacts/` + experience docs + learned rules + out-of-scope + project CLAUDE.md. **Anything found = question you don't ask.**
- Load **operator-craft stance** (3 playbooks: ceo-cognitive-patterns + yc-six-forcing-questions + minimalist-entrepreneur) for non-trivial work; match founder-domain frames per the matrix in `context-gathering.md`.

## Adaptive Depth

| Signal | Depth | Behavior |
|---|---|---|
| Clear task, existing codebase, well-defined scope | **Light** (3-5 questions) | Surface assumptions, lock scope, go |
| Feature with some ambiguity, multiple approaches | **Medium** (5-10 questions) | Explore key decisions, probe edge cases |
| Vague idea, greenfield, "I want to build X" | **Deep** (multi-round) | Challenge premise, interview across zones, iterate until the Step 6 concreteness gate passes |

Depth sets the question ceiling; the Step 6 concreteness gate sets the exit. Deep is multi-round until the gate passes — not question-count-bounded. Light/Medium ceilings stand: at ceiling with open dimensions, ask per-dimension sign-off, wrap `done_with_concerns`. A fully-concrete brief passes the gate on round one — no extra grilling. "That's enough, let's build" triggers the sign-off ask, not a silent skip.

## Execution

Per [`references/procedures/orchestration-steps.md`](references/procedures/orchestration-steps.md) (full step-by-step including Premise Check, Mode Detection, Idea Critic Gate, Adaptive Coverage Zones, Conversation, Clarity Check, Output):

- **Step 1** — Context Gathering (silent) per [`procedures/context-gathering.md`](references/procedures/context-gathering.md).
- **Step 2** — Premise Check (non-trivial work): restate outcome, "what if we did nothing?", what already exists. Framing checkpoint after first answer. Skip when scoped / continuing / obviously sound.
- **Step 2.5** — Mode Detection (Idea Stage vs Plan Review) one-shot read; on ambiguity, ask one question. Plan-Review uses 4-Mode Framework picked once via `AskUserQuestion` and locks Step 7 verdict vocabulary — see [`procedures/plan-review-modes.md`](references/procedures/plan-review-modes.md).
- **Step 2.6** — Divergence Pass (idea-stage, **conditional**). Generative ideation *before* convergence — fires only on **Deep depth + open solution space** (or operator "brainstorm this"); **never on Light** or plan-review; *offered not forced* when a committed solution was brought. Generates 5-8 candidate directions across explicit axes (judgment suspended), converges to a recommended shortlist, then rejoins Step 2.7. Distinct from Premise Check (reframe), idea-critic (evaluate), debate-agents (pressure-test known options — divergence *feeds* it). Full: [`procedures/divergence.md`](references/procedures/divergence.md).
- **Step 2.7** — Idea Critic Gate (idea-stage only). One dispatch of [`agents/idea-critic.md`](agents/idea-critic.md) scored against 5 red + 5 green flags. **Threshold: ≥2 red OR <2 green → PUSH_BACK.** Full contract: [`procedures/idea-critic-dispatch.md`](references/procedures/idea-critic-dispatch.md).
- **Step 3** — Adaptive Coverage Zones (3-5 zones for THIS problem, not 5 fixed dimensions). State zones upfront. Zone library by domain (product feature, business strategy, marketing initiative, infra/devops, design task) in [`procedures/orchestration-steps.md`](references/procedures/orchestration-steps.md).
- **Step 4** — Conversation: interview techniques per [`procedures/interview-techniques.md`](references/procedures/interview-techniques.md); communication discipline (banned phrases, take-a-position rule, always-recommend rule, pushback patterns) per [`procedures/communication-discipline.md`](references/procedures/communication-discipline.md); domain probing via lazy [`references/question-bank.md`](references/question-bank.md) loads.
- **Step 5** — Complex Decision Points → invoke `debate-agents` as sub-routine when 2+ viable approaches with non-obvious tradeoffs + decision expensive to reverse. Not when clear best answer / strong preference / easily reversible.
- **Step 6** — Clarity Check + **Concreteness gate**: six core requirement dimensions (problem, audience, constraints, success criteria, scope, anti-goals) each marked `concrete` or `open`; **wrap is blocked while any is `open`** unless the operator signs off on that specific dimension — sign-off is per-dimension, never blanket; no downstream handoff while the gate fails. Then summarize decisions, **playbook-citation self-check**, **verdict assignment** (idea-stage: `VALIDATED` / `NEEDS_MORE_VALIDATION` / `PIVOT`; plan-review: one of 7 verdicts mapped to chosen mode). **Resolution-exit** (replaces patience-exit) per [`procedures/orchestration-steps.md`](references/procedures/orchestration-steps.md) § "Resolution-exit" — 3 conditions, with N/A clauses for Light / Contract / HOLD SCOPE / Premise-skipped sessions. Operator override allowed; silent exit is not — signed-off dimensions + unresolved branches log inline + persist (`## Concreteness Checklist`, `## Open Branches (operator-overridden)`) with `status: done_with_concerns`.
- **Step 7** — Output. Default: conversation context. Save only when explicitly asked / session ending / external consumer / natural milestone + confirmation. Formats: operator-grade spec (5 mandatory sections), Light-depth compact, Contract format, Handoff plan (path-free, when a fresh agent/session is the next consumer). Full: [`procedures/output-formats.md`](references/procedures/output-formats.md).

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/meta-discover-<YYYY-MM-DD>-<slug>.md` (flat v2; working draft, only on user save).
- **Lifecycle:** `spec` — iterated until promoted to task-breakdown or system-architecture.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `stack` (=meta), `review_surface` (=md), `decision_state`, `review_tool`, `reviewed_at`, `reviewer`, `mode`, `plan-review-mode`, `light_spec`. Full template: [`procedures/output-formats.md`](references/procedures/output-formats.md).
- **Required sections (Medium/Deep):** Premise Challenge · Dream State Mapping · Decided Approach · Implementation Alternatives (min 2-3) · Temporal Interrogation · Key Decisions · Edge Cases · Failure Conditions · Out of Scope · Open Questions · Concreteness Checklist (both formats — Step 6 gate state) · Open Branches (only if `done_with_concerns`) · Implementation Notes · Verdict. **Light-depth saves skip 5 sections** (Premise Challenge, Dream State Mapping, Implementation Alternatives, Temporal Interrogation, Verdict) — compact format `light_spec: true`.
- **Consumed by:** operator (audit trail) · `breakdown-tasks` · `architect-system` · `review-work` (scope-drift detection).
- **Side effect (idea-stage only):** spawns `agents/idea-critic.md` once at Step 2.7.


## Context Resolution Order

When discover (or any downstream skill) needs prior decisions: (1) conversation context, (2) artifact on disk, (3) discovery — ask or scan. Downstream skills don't require files; they need decisions known, from any source.

## Configuration

Full configuration table (depth, mode, plan-review-mode, output, zones, idea-critic): [`references/configuration.md`](references/configuration.md).

## Anti-Patterns + Edge Cases

[`references/anti-patterns.md`](references/anti-patterns.md) — 10 interview + 7 resolution/exit + 4 output + 12 edge cases. Read before any answer-handling moment that smells off.

## Skill Deference

- FEATURE / TASK to clarify → this skill.
- Declining METRIC → `diagnose`.
- Multi-perspective debate → `debate-agents` (or Step 5 sub-routine).
- Know what to build, need design → `architect-system`.
- Decompose into tasks → `breakdown-tasks`.

## Chain Position

**Previous:** none (or any skill that surfaces a need for clarification). **Next:** `architect-system`, `breakdown-tasks`, or direct implementation. **Re-run:** requirements change significantly, new constraints, or implementation reveals the spec was wrong.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — discovery converged, decision clear (optionally saved).
- **DONE_WITH_CONCERNS** — decision made but non-blocking open questions or explicit caveats; flagged inline (and pinned to spec frontmatter if saved). Also fires when operator overrides resolution-exit (Open Branches section non-empty) or signs off an open dimension (Concreteness Checklist shows `open — signed off`).
- **BLOCKED** — irreconcilable conflict in inputs or scope; needs human resolution.
- **NEEDS_CONTEXT** — user cannot answer key questions; recommend upstream skill (research-icp, research-market, diagnose).

## References

- [`references/playbook.md`](references/playbook.md) — why, methodology, when NOT to use
- [`_shared/`](references/_shared/) — before-starting-check, mode-resolver
- [`procedures/`](references/procedures/) — context-gathering, communication-discipline, interview-techniques, divergence (Step 2.6 generative pass), idea-critic-dispatch, output-formats, plan-review-modes, **orchestration-steps** (full Step 2-7 detail), **resolution-exit conditions**
- [`references/anti-patterns.md`](references/anti-patterns.md), [`question-bank.md`](references/question-bank.md), [`example-contracts.md`](references/example-contracts.md), [`configuration.md`](references/configuration.md)
- [`references/operator-playbooks/`](references/operator-playbooks/) — 9 practitioner-grade frames (3 always-on stance + 6 founder-domain on product-context match)
- [`agents/idea-critic.md`](agents/idea-critic.md) — sub-agent dispatched at Step 2.7 idea-stage
