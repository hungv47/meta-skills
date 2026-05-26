---
name: discover
description: "Conversational discovery that turns a vague idea, feature, or task into shared clarity — adapts from quick scoping (3-5 questions) to deep multi-round interviews, then produces inline decisions or an optional saved spec. Use to clarify requirements before building. Not for multi-perspective debate (use debate-agents), decomposing work (use breakdown-tasks), or diagnosing a metric decline (use diagnose)."
argument-hint: "[idea, feature, or task to clarify]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
metadata:
  version: "3.3.0"
  budget: fast
  estimated-cost: "$0.03-0.10"
---

# Discover — Conversational

Transform vague ideas into shared clarity through adaptive conversation. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Methodology (conversation-IS-the-alignment, blunt-peer stance, equal-weight rule, resolution-exit-not-patience-exit) + when NOT to use: [`references/playbook.md`](references/playbook.md).

**Core philosophy:** Just talk with your agent. Close the gap between stated requirements and true needs through conversation — not documents, formal phases, or plan mode.

**Core question:** What would we silently get wrong if we just started building?

## How It Works

1. You describe what you want.
2. The agent scans context and assesses complexity (silently).
3. Questions begin — adaptive to what's needed.
4. Conversation continues until mutual clarity.
5. Build directly, or save a spec/contract if needed.

No plan mode. No pipeline stages. No mandatory artifacts. **The conversation IS the alignment.**

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode resolution** ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)). `budget: fast`; Adaptive Depth auto-calibrates Light / Medium / Deep. Operator overrides: "quick scope" / "deep interview" / "just ask 3 questions". `--fast` collapses to Light depth — skips operator-craft stance load, skips idea-critic gate, skips 5 mandatory spec sections on save (`light_spec: true`). Mode declared (not emit-and-wait) when depth signals are unambiguous.
- Run Step 1 Context Gathering per [`references/procedures/context-gathering.md`](references/procedures/context-gathering.md) — scan codebase + `.forsvn/artifacts/` + experience docs + learned rules + out-of-scope + project CLAUDE.md. **Anything found = question you don't ask.**
- Load operator-craft stance (3 playbooks: ceo-cognitive-patterns + yc-six-forcing-questions + minimalist-entrepreneur) for non-trivial work. Match founder-domain frames against product-context per the matrix in `context-gathering.md`.

## Adaptive Depth

| Signal | Depth | Behavior |
|---|---|---|
| Clear task, existing codebase, well-defined scope | **Light** (3-5 questions) | Surface assumptions, lock scope, go |
| Feature with some ambiguity, multiple approaches | **Medium** (5-10 questions) | Explore key decisions, probe edge cases |
| Vague idea, greenfield, "I want to build X" | **Deep** (multi-round) | Challenge premise, interview across zones, iterate |

"That's enough, let's build" skips ahead — agent notes current clarity level. Override: "quick scope", "deep interview", "just ask 3 questions".

## Execution

### Step 1 — Context Gathering (silent)

Per [`references/procedures/context-gathering.md`](references/procedures/context-gathering.md). Scan + load operator-craft stance + load founder-domain frame (only when product-context matches the matrix).

### Step 2 — Premise Check (for non-trivial work)

Challenge with 3 quick questions before diving in:

1. **Right problem?** Restate the outcome in one sentence. Watch solution-framing vs problem-framing: "We need notifications" (solution) vs "Users miss time-sensitive events" (problem).
2. **What if we did nothing?** Real, measurable pain today? If nobody's complaining, probe why this surfaced now.
3. **What already exists?** Map the request against existing code/tooling. If 60% exists, scope is 40% of what was described.

Weak premise → say so. Suggest reframing — advise, don't block.

**Framing checkpoint** after the user's first substantive answer:

- **Language precision** — concrete or hiding behind buzzwords ("AI-powered", "seamless", "platform")?
- **Real vs hypothetical** — describing what IS or what MIGHT? Past behavior beats future predictions.
- **Hidden assumptions** — what's taken for granted that could be wrong? State it back.

Vague framing produces precise-looking nonsense. Fix before proceeding. Skip premise check when: task is clearly scoped, user is continuing a prior decision, or context makes the premise obviously sound.

### Step 2.5 — Mode Detection (Idea Stage vs Plan Review)

One-shot read of the user's first substantive turn.

- **Idea-stage** — unstructured idea, no prior plan. → Step 2.7 (Idea Critic Gate).
- **Plan-review** — user brings existing plan/spec/sketch/ADR + wants to test it. Signals: linking/pasting an artifact, "review this plan", "is this the right scope". → mode-pick below; idea-critic does NOT fire.

Ambiguous → ask one question, recommend the read you think is more likely with one line of reason. Don't over-invest; user can correct mid-session.

**Plan-Review: 4-Mode Framework.** When mode is `plan-review`, user picks one of four sub-modes upfront via `AskUserQuestion` — SCOPE EXPANSION / SELECTIVE EXPANSION / HOLD SCOPE / SCOPE REDUCTION — once, locked for the session. Mode sets review posture and **locks the Step 7 Verdict vocabulary**. Full framework + postures + mode-pick mechanics + equal-weight rule + mode→verdict mapping: [`references/procedures/plan-review-modes.md`](references/procedures/plan-review-modes.md).

### Step 2.7 — Idea Critic Gate (idea-stage only)

Dispatch the idea-critic agent ONCE before opening coverage zones. Full contract + on-PROCEED + on-PUSH_BACK + skip conditions: [`references/procedures/idea-critic-dispatch.md`](references/procedures/idea-critic-dispatch.md). The agent ([`agents/idea-critic.md`](agents/idea-critic.md)) scores against 5 red + 5 green flags. **Threshold: ≥2 red OR <2 green → PUSH_BACK.**

### Step 3 — Adaptive Coverage Zones

Identify 3-5 zones that matter for THIS problem (not 5 fixed dimensions).

- Product feature: Problem validation → Solution clarity → Technical risks → Success criteria
- Business strategy: Problem clarity → Options landscape → Tradeoffs → Validation path
- Marketing initiative: Audience fit → Channel strategy → Messaging → Measurement
- Infrastructure/devops: Requirements → Constraints → Failure modes → Rollout plan
- Design task: User needs → Information architecture → Interaction patterns → Edge states

State zones upfront: "Here's what I think we need clarity on: [zones]. Anything to add or remove?" Zones are a compass, not a checklist.

### Step 4 — Conversation

Run interview techniques per [`references/procedures/interview-techniques.md`](references/procedures/interview-techniques.md) — Why Chains, Past Behavior Probes, Daily Use Visualization, Forced Tradeoffs, Failed Attempt Archaeology, Success Criteria Grounding, Should-Want Detection. Pacing: 2-4 questions per round, batch on one branch.

**Communication discipline** per [`references/procedures/communication-discipline.md`](references/procedures/communication-discipline.md). Banned phrases ("interesting approach", "many ways to think about this", "you might want to consider"). Take-a-position rule ("I think X because Y. What would change my mind: Z."). Always-recommend rule (every question carries an LLM-recommended answer with one-line reason). Pushback patterns (vague market, social proof, platform-before-wedge, undefined terms, growth-without-unit-economics).

Domain-specific extended probing → load [`references/question-bank.md`](references/question-bank.md) lazily, only when a coverage zone hits the listed domains.

### Step 5 — Complex Decision Points → Agent Room

When a decision genuinely needs more than one perspective (architecture choice, strategic direction, design tradeoff with no clear winner), invoke `debate-agents` as a sub-routine.

**Invoke when** — 2+ viable approaches with non-obvious tradeoffs; decision is expensive to reverse; you want to pressure-test thinking. **How** — frame the specific decision ("WebSocket push or polling for this use case?"), include context. Panel debates, returns recommendation, conversation continues. **Do NOT invoke when** — clear best answer from context, user has a strong preference, choice is easily reversible.

### Step 6 — Clarity Check

When clarity is sufficient to build:

1. Summarize key decisions.
2. Note remaining open questions and their impact.
3. **Playbook-citation self-check** — verify the recommendation cited at least one applicable operator-playbook frame when one was loaded. If a founder-domain frame was loaded but no rule from it surfaced, either cite it, explain why it doesn't apply, or revisit the recommendation.
4. **Verdict assignment** — state the explicit verdict before asking to build:
   - **Idea-stage:** `VALIDATED` / `NEEDS_MORE_VALIDATION` / `PIVOT`.
   - **Plan-review:** `BUILD_AS_PROPOSED` / `CHERRY-PICK_EXPANSIONS` / `EXPAND_BEYOND_PROPOSED` / `HOLD_AS_PROPOSED` / `HOLD_WITH_RISK_NOTES` / `CUT_TO_MINIMUM` / `CUT_AGGRESSIVELY`, mapped to the chosen plan-review-mode.
   The verdict is not optional. **Single verdict, two surfaces:** if the spec is saved (Step 7), the same verdict persists verbatim to `## Verdict`.
5. Ask: "Ready to build, or go deeper on anything?"

**Resolution-exit condition** (replaces "if the user says go, go"): the session exits when the decision tree is *resolved*, not when the user runs out of patience. Resolved means ALL THREE:

1. Every load-bearing branch has a recommended answer with a cited reason (operator-playbook rule, prior artifact, evidence surfaced this session, or explicit defer-with-trigger).
2. Every Premise Challenge premise has the user's stance recorded (accepted / rejected / deferred — not silently passed over).
3. At least one piece of evidence surfaced that wasn't already in the user's head at the start. If you can't name what this session changed, you didn't grill — you transcribed.

**Clauses 2 and 3 are N/A** for: Light-depth sessions (clause 1 only); Contract-format saves (Premise Challenge doesn't apply — scope-locking, not idea-validating); Plan-review HOLD SCOPE mode (execution-risk surfacing, not premise re-litigation); Premise-skipped sessions (clause 2 N/A; note "Premise Challenge skipped" once).

**Operator override is allowed; silent exit is not.** "Ship it" with unresolved branches → log them inline under `Open branches (operator-overridden):`. If saved (Step 7), set `status: done_with_concerns` and persist under spec `## Open Branches (operator-overridden)`.

### Step 7 — Output

**Default: conversation context.** Decisions live in chat. Save only when: user explicitly asks · session is ending and decisions would be lost · output is needed by someone outside this conversation · natural milestone reached AND user confirms saving.

Full output formats (operator-grade spec with 5 mandatory sections, Light-depth compact, Contract format with Writing-good-clauses + Verification template, out-of-scope persistence, experience doc append): [`references/procedures/output-formats.md`](references/procedures/output-formats.md).

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta-discover-<YYYY-MM-DD>-<slug>.md` (flat v2 grammar; working draft, created only when user asks to save).
- **Lifecycle:** `spec` — working draft, edited iteratively until promoted to task-breakdown or system-architecture.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `stack` (=meta), `review_surface` (=md), `decision_state`, `review_tool`, `reviewed_at`, `reviewer`, `mode` (idea-stage / plan-review), `plan-review-mode` (when applicable), `light_spec` (true for compact format). Full template: [`references/procedures/output-formats.md`](references/procedures/output-formats.md).
- **Required sections (Medium/Deep):** Premise Challenge · Dream State Mapping · Decided Approach · Implementation Alternatives (min 2-3) · Temporal Interrogation · Key Decisions · Edge Cases · Failure Conditions · Out of Scope · Open Questions · Open Branches (operator-overridden, only if `status: done_with_concerns`) · Implementation Notes · Verdict. **Light-depth saves skip 5 mandatory sections** (Premise Challenge, Dream State Mapping, Implementation Alternatives, Temporal Interrogation, Verdict) — compact format with `light_spec: true`.
- **Consumed by:** operator (audit trail) · `breakdown-tasks` (decomposes Decided Approach + Key Decisions) · `architect-system` · `review-work` (scope-drift detection).
- **Side effect (idea-stage only):** spawns `agents/idea-critic.md` once at Step 2.7.
- **Review-gated:** `decision_state` defaults to `pending` (enum: `pending \| approved \| denied \| suggested \| not_required`). `status` and `decision_state` are independent. Field semantics: [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md); procedure: [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md).

## Context Resolution Order

When discover (or any downstream skill) needs prior decisions:

1. **Conversation context** — same session, decisions in chat.
2. **Artifact on disk** — previous session saved a spec or contract.
3. **Discovery** — ask the user or scan the codebase.

Downstream skills don't REQUIRE artifacts as files. They need decisions known, from whatever source.

## Configuration

| Parameter | Default | Override example |
|---|---|---|
| depth | auto | "quick scope" / "deep interview" / "ask 3 questions" |
| mode | auto-detected (Step 2.5) | "treat this as a plan review" / "fresh idea, ignore the existing spec" |
| plan-review-mode | user-picked when mode = plan-review | "expand the scope" / "hold scope, find risks" / "cut to minimum" / "cherry-pick expansions" |
| output | conversation | "save to spec" / "write a contract" / "save answers" |
| zones | auto (3-5) | "focus on technical risks and UX" |
| idea-critic | auto-on for idea-stage | "skip the idea critic" (records override in spec frontmatter) |

## Anti-Patterns + Edge Cases

Read [`references/anti-patterns.md`](references/anti-patterns.md) before any answer-handling moment that smells off — 10 interview anti-patterns + 7 resolution/exit (silent exit on override, false resolution, two verdicts, verdict-skipping, mode-mixing, plan-review-mode drift, padding) + 4 output (default-to-save, light-depth-with-mandatory-sections, defaulting-to-safer-alternative, single-alternative-without-flag) + 12 edge cases.

## Skill Deference

- FEATURE or TASK to clarify → this skill.
- Declining METRIC to diagnose → `diagnose`.
- Multi-perspective debate on a decision → `debate-agents` (or invoke at Step 5).
- Know what to build, need technical design → `architect-system`.
- Decompose into tasks → `breakdown-tasks`.

## Chain Position

**Previous:** none (or any skill that surfaces a need for clarification). **Next:** `architect-system`, `breakdown-tasks`, or direct implementation.

**Re-run triggers:** requirements change significantly, new constraints emerge, or implementation reveals the spec was wrong.

## Completion Status

- **DONE** — discovery converged, decision is clear (optionally saved if user asked).
- **DONE_WITH_CONCERNS** — decision made but non-blocking open questions or explicit caveats; flagged inline (and pinned to spec frontmatter if saved). Also fires when operator overrides resolution-exit (Open Branches section non-empty).
- **BLOCKED** — irreconcilable conflict in user inputs or scope; needs human resolution.
- **NEEDS_CONTEXT** — user cannot answer key questions; recommend upstream skill (research-icp, research-market, diagnose) or external consultation.

## References

- [`references/playbook.md`](references/playbook.md) — why, methodology, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md), [`mode-resolver.md`](references/_shared/mode-resolver.md), [`reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md), [`roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md)
- [`references/procedures/context-gathering.md`](references/procedures/context-gathering.md), [`communication-discipline.md`](references/procedures/communication-discipline.md), [`interview-techniques.md`](references/procedures/interview-techniques.md), [`idea-critic-dispatch.md`](references/procedures/idea-critic-dispatch.md), [`output-formats.md`](references/procedures/output-formats.md), [`plan-review-modes.md`](references/procedures/plan-review-modes.md)
- [`references/anti-patterns.md`](references/anti-patterns.md), [`question-bank.md`](references/question-bank.md), [`example-contracts.md`](references/example-contracts.md)
- [`references/operator-playbooks/`](references/operator-playbooks/) — 9 practitioner-grade frames (3 always-on stance + 6 founder-domain loaded on product-context match)
- [`agents/idea-critic.md`](agents/idea-critic.md) — single sub-agent dispatched in Step 2.7 on idea-stage sessions
