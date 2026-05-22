---
name: discover
description: "Conversational discovery that turns a vague idea, feature, or task into shared clarity — adapts from quick scoping (3-5 questions) to deep multi-round interviews, then produces inline decisions or an optional saved spec. Use to clarify requirements before building. Not for multi-perspective debate (use debate-agents), decomposing work (use breakdown-tasks), or diagnosing a metric decline (use diagnose)."
argument-hint: "[idea, feature, or task to clarify]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
metadata:
  version: "3.2.1"
  budget: fast
  estimated-cost: "$0.03-0.10"
---

# Discover — Conversational

*Meta — Transform vague ideas into shared clarity through adaptive conversation.*

**Core Philosophy:** "Just talk with your agent." Close the gap between stated requirements and true needs through conversation — not documents, formal phases, or plan mode.

**Core Question:** "What would we silently get wrong if we just started building?"

[Read `references/playbook.md` [PLAYBOOK] to understand methodology (conversation-IS-the-alignment, blunt-peer stance, equal-weight rule, resolution-exit-not-patience-exit), principles, when NOT to use.]

## How It Works

1. You describe what you want
2. The agent scans context and assesses complexity (silently)
3. Questions begin — adaptive to what's needed
4. Conversation continues until mutual clarity
5. Build directly, or save a spec/contract if needed

No plan mode. No pipeline stages. No mandatory artifacts. The conversation IS the alignment.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — load [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. `budget: fast` default; Adaptive Depth below auto-calibrates between Light (fast) / Medium (standard) / Deep multi-round. Operator overrides: "quick scope" / "deep interview" / "just ask 3 questions". `--fast` collapses to Light depth — skips operator-craft stance load (per context-gathering.md trivial-scoping rule), skips idea-critic gate (per Step 2.7 trivial-scoping skip condition), skips 5 mandatory spec sections on save (per output-formats.md `light_spec: true`). Mode declared (not emit-and-wait) when adaptive depth is unambiguous from input signals; emit-and-wait only when depth signals conflict.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches inventory.
2. Run Step 1 Context Gathering per [`references/procedures/context-gathering.md`](references/procedures/context-gathering.md) [PROCEDURE] — scan codebase + `.forsvn/artifacts/` + experience docs + learned rules + out-of-scope + project CLAUDE.md. Anything found = question you don't ask.
3. Load operator-craft stance (3 playbooks: ceo-cognitive-patterns + yc-six-forcing-questions + minimalist-entrepreneur) for non-trivial work. Match founder-domain frames against product-context per the matrix in context-gathering.md.

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta/specs/<slug>.md` (per-spec slug, working drafts — created only when user asks to save)
- **Lifecycle:** `spec` (working draft, edited iteratively until promoted to task-breakdown or system-architecture)
- **Frontmatter fields:** `skill`, `version`, `date`, `status`, `mode` (idea-stage / plan-review), `plan-review-mode` (when mode=plan-review), `light_spec` (true for compact format). Full template: [`references/procedures/output-formats.md`](references/procedures/output-formats.md) [PROCEDURE].
- **Required sections (Medium/Deep depth):** Premise Challenge / Dream State Mapping / Decided Approach / Implementation Alternatives (min 2-3) / Temporal Interrogation / Key Decisions / Edge Cases / Failure Conditions / Out of Scope / Open Questions / Open Branches (operator-overridden, only if status=done_with_concerns) / Implementation Notes / Verdict. **Light-depth saves skip the 5 mandatory sections** (Premise Challenge / Dream State Mapping / Implementation Alternatives / Temporal Interrogation / Verdict don't apply); use compact format with frontmatter `light_spec: true`.
- **Consumed by:** operator (decision audit trail); `breakdown-tasks` (decomposes the Decided Approach + Key Decisions); `architect-system` (designs the technical surface); `review-work` (scope-drift detection against MISSING/UNPLANNED changes).
- **Side effect (idea-stage only):** spawns `agents/idea-critic.md` once at Step 2.7 per [`references/procedures/idea-critic-dispatch.md`](references/procedures/idea-critic-dispatch.md) [PROCEDURE].
- **Eval workspace:** none — discover produces a spec, not a measurable initiative.

## Adaptive Depth

The skill auto-calibrates based on signals it reads from the request:

| Signal | Depth | Behavior |
|---|---|---|
| Clear task, existing codebase, well-defined scope | **Light** (3-5 questions) | Surface assumptions, lock scope, go |
| Feature with some ambiguity, multiple approaches | **Medium** (5-10 questions) | Explore key decisions, probe edge cases |
| Vague idea, greenfield, "I want to build X" | **Deep** (multi-round) | Challenge premise, interview across zones, iterate |

The agent reads the situation. "That's enough, let's build" skips ahead — agent notes current clarity level. **Override:** "quick scope", "deep interview", "just ask 3 questions".

## Execution

### Step 1: Context Gathering (silent, before asking anything)

Per [`references/procedures/context-gathering.md`](references/procedures/context-gathering.md) [PROCEDURE]. Scan codebase + artifacts + experience docs + learned rules + out-of-scope + project CLAUDE.md. Load operator-craft stance (3 playbooks, every non-trivial invocation). Load founder-domain frame (only when product-context matches the matrix).

### Step 2: Premise Check (for non-trivial work)

Challenge the premise with 3 quick questions before diving in:

1. **Right problem?** Restate the outcome in one sentence. Is the proposed approach the most direct path? Watch solution-framing vs problem-framing: "We need notifications" (solution) vs "Users miss time-sensitive events" (problem).
2. **What if we did nothing?** Real, measurable pain today? If nobody's complaining, probe why this surfaced now.
3. **What already exists?** Map the request against existing code and tooling. If 60% exists, scope is 40% of what was described.

If the premise is weak, say so. Suggest reframing — don't block; advise and let the user decide.

**Framing checkpoint** after the user's first substantive answer — verify before continuing:
- **Language precision:** Key terms defined concretely, or hiding behind buzzwords ("AI-powered", "seamless", "platform")?
- **Real vs hypothetical:** Describing what IS happening or what MIGHT happen? Past behavior beats future predictions.
- **Hidden assumptions:** What's the user taking for granted that could be wrong? State it back.

Vague framing produces precise-looking nonsense. Fix it before proceeding.

**Skip premise check when:** task is clearly scoped ("add a dark mode toggle"), user is continuing a prior decision, or context makes the premise obviously sound.

### Step 2.5: Mode Detection — Idea Stage vs Plan Review

After the premise check, classify which job discover is doing this session. The two jobs are different enough that mixing them produces mush.

**Idea-stage** — user brings an unstructured idea ("I want to build X," "thinking about a feature where…"). No prior plan, sketch, or spec the conversation is anchored to. Proceed to Step 2.7 (Idea Critic Gate) before opening coverage zones.

**Plan-review** — user brings an existing plan/spec/sketch/ADR/proposal and wants to test it. Signals: linking or pasting an existing artifact, saying "review this plan," "should we expand/cut this," "is this the right scope," or pasting a numbered plan. Proceed to mode-pick below before coverage zones; idea-critic does NOT fire.

**Detection is a one-shot read of the user's first substantive turn.** If ambiguous, ask one question — chat format, recommend the read you think is more likely, one line of reason. Don't over-invest in detection; the user can correct mid-session and discover re-anchors.

#### Plan-Review: 4-Mode Framework

When mode is `plan-review`, ask the user to pick one of four sub-modes upfront — once. Lock for the session.

| Mode | Posture | When to recommend |
|---|---|---|
| **SCOPE EXPANSION** | Build the cathedral. Push scope up. Surface every reasonable expansion; recommend rebuild over patch when the rewrite is small and the existing scope undersells the goal. | User signals "I want to make this great," there's strong evidence the proposed scope is too small for the stated outcome, AI compresses implementation enough that a bigger rewrite is feasible. |
| **SELECTIVE EXPANSION** | Hold scope as baseline. Surface expansions individually for cherry-pick. | User has a concrete plan they trust but is open to specific extensions. Default for "review my plan and tell me what's missing." |
| **HOLD SCOPE** | Make it bulletproof. Interrogate the existing plan for hidden risks, missing edge cases, premise weakness, implementation traps. | User has shipped pressure or strong scope conviction; the question is execution quality, not scope debate. |
| **SCOPE REDUCTION** | Ruthless minimum-viable cut. Identify what's load-bearing for the stated outcome; propose cuts to everything else. | Time/budget pressure, MVP framing, "what's the smallest version that ships," or evidence the plan has padding masking the core. |

**Mode-pick mechanics:** Use `AskUserQuestion` with the 4 options. Pick a recommendation based on the signals above; mark `(Recommended)`; put the one-line reason in `description`. Common variants ("expand cautiously," "cut to v0 then expand later") map back to one of the four with a quick clarifying read.

**Equal-weight rule (load-bearing):** When the user picks SCOPE EXPANSION or SCOPE REDUCTION, do NOT default to the "smaller, safer" option in alternatives generation just because it feels cautious. AI compresses implementation; the rewrite often serves the stated outcome better than the patch. Recommend whichever serves the goal — and say so explicitly.

**Mode locks Step 7 Verdict.** SCOPE EXPANSION / SELECTIVE EXPANSION → `BUILD_AS_PROPOSED` / `CHERRY-PICK_EXPANSIONS` / `EXPAND_BEYOND_PROPOSED`. HOLD SCOPE → `HOLD_AS_PROPOSED` / `HOLD_WITH_RISK_NOTES`. SCOPE REDUCTION → `CUT_TO_MINIMUM` / `CUT_AGGRESSIVELY`. Idea-stage sessions (no plan-review-mode) → `VALIDATED` / `NEEDS_MORE_VALIDATION` / `PIVOT` per the idea-critic rubric.

### Step 2.7: Idea Critic Gate (idea-stage only)

When mode is `idea-stage`, dispatch the idea-critic agent ONCE before opening coverage zones. Full dispatch contract + on-PROCEED + on-PUSH_BACK behavior + skip conditions: [`references/procedures/idea-critic-dispatch.md`](references/procedures/idea-critic-dispatch.md) [PROCEDURE]. The agent ([`agents/idea-critic.md`](agents/idea-critic.md)) scores idea-statement against 5 red + 5 green flags. Threshold: ≥2 red OR <2 green → PUSH_BACK.

### Step 3: Adaptive Coverage Zones

Identify **3-5 coverage zones** that matter for THIS problem (not 5 fixed dimensions).

- **Product feature:** Problem validation → Solution clarity → Technical risks → Success criteria
- **Business strategy:** Problem clarity → Options landscape → Tradeoffs → Validation path
- **Marketing initiative:** Audience fit → Channel strategy → Messaging → Measurement
- **Infrastructure/devops:** Requirements → Constraints → Failure modes → Rollout plan
- **Design task:** User needs → Information architecture → Interaction patterns → Edge states

State zones upfront: "Here's what I think we need clarity on: [zones]. Anything to add or remove?" Zones are a compass, not a checklist. Some problems need 2 zones deep; others 5 touched lightly.

### Step 4: Conversation

Run interview techniques + question delivery per [`references/procedures/interview-techniques.md`](references/procedures/interview-techniques.md) [PROCEDURE] — Why Chains, Past Behavior Probes, Daily Use Visualization, Forced Tradeoffs, Failed Attempt Archaeology, Success Criteria Grounding, Should-Want Detection, question formats (assumption-surfacing vs options), pacing (2-4 questions per round, batch on one branch).

**Communication discipline** — per [`references/procedures/communication-discipline.md`](references/procedures/communication-discipline.md) [PROCEDURE]. Banned phrases ("interesting approach", "many ways to think about this", "you might want to consider", "that could work", "I can see why you'd think that"). Take-a-position rule ("I think X because Y. What would change my mind: Z."). Always-recommend rule (every question carries an LLM-recommended answer with one-line reason). Pushback patterns (vague market, social proof, platform-before-wedge, undefined terms, growth-without-unit-economics) — push back with the rigorous version.

For domain-specific extended probing questions (data/state, errors, UX, security, performance, integration, business logic, intent alignment), load [`references/question-bank.md`](references/question-bank.md) lazily — only when a coverage zone hits one of those domains.

### Step 5: Complex Decision Points → Agent Room

When a decision genuinely needs more than one perspective — architecture choice, strategic direction, design tradeoff with no clear winner — invoke `debate-agents` as a sub-routine.

**When to invoke:** Two+ viable approaches with non-obvious tradeoffs; decision is expensive to reverse; you're uncertain and want to pressure-test your thinking. **How:** Frame the specific decision ("WebSocket push or polling for this use case?"), include context. Panel debates, returns recommendation, conversation continues. **When NOT to invoke:** clear best answer from context; user already has a strong preference; choice is easily reversible.

### Step 6: Clarity Check

When clarity is sufficient to build:

1. Summarize key decisions
2. Note remaining open questions and their impact
3. **Playbook-citation self-check** — verify the recommendation cited at least one applicable operator-playbook frame when one was loaded. If a founder-domain frame was loaded but no rule from it surfaced, either cite the relevant rule, explain why the frame doesn't apply here, or revisit the recommendation.
4. **Verdict assignment** — state the explicit verdict before asking the user to build:
   - **Idea-stage:** `VALIDATED` / `NEEDS_MORE_VALIDATION` / `PIVOT` based on idea-critic outcome + alternatives clarity
   - **Plan-review:** one of `BUILD_AS_PROPOSED` / `CHERRY-PICK_EXPANSIONS` / `EXPAND_BEYOND_PROPOSED` / `HOLD_AS_PROPOSED` / `HOLD_WITH_RISK_NOTES` / `CUT_TO_MINIMUM` / `CUT_AGGRESSIVELY`, mapped to the chosen plan-review-mode
   
   The verdict is not optional. **Single verdict, two surfaces:** if the spec is saved (Step 7), this same verdict persists verbatim to the `## Verdict` section of the saved artifact.
5. Ask: "Ready to build, or go deeper on anything?"

**Resolution-exit condition** (replaces "if the user says go, go"): the session exits when the decision tree is *resolved* — not when the user runs out of patience. Resolved means **all three** are true:

1. Every load-bearing branch has a recommended answer with a cited reason (operator-playbook rule, prior artifact, evidence surfaced this session, or explicit defer-with-trigger).
2. Every Premise Challenge premise has the user's stance recorded (accepted / rejected / deferred — not silently passed over).
3. At least one piece of evidence has surfaced that wasn't already in the user's head at the start. If you can't name what this session changed, you didn't grill — you transcribed.

**Clauses 2 and 3 are N/A** for: Light-depth sessions (clause 1 only); Contract-format saves (Premise Challenge doesn't apply — scope-locking not idea-validating); Plan-review HOLD SCOPE mode (execution-risk surfacing, not premise re-litigation); Premise-skipped sessions (clause 2 N/A; note "Premise Challenge skipped" once and proceed).

**Operator override is allowed; silent exit is not.** If operator says "ship it" with unresolved branches, log them inline under `Open branches (operator-overridden):` (conversation, lowercase). If saved (Step 7), set `status: done_with_concerns` and persist under spec `## Open Branches (operator-overridden)` (Title Case template heading).

### Step 7: Output

**Default: conversation context.** Decisions live in chat. Save only when: user explicitly asks, session is ending and decisions would be lost, output is needed by someone outside this conversation, OR natural milestone reached and user confirms saving.

Full output formats (operator-grade spec template with 5 mandatory sections, Light-depth compact format, Contract format with Writing good clauses + Verification template, out-of-scope persistence to `.forsvn/artifacts/meta/out-of-scope/`, experience doc append to `.forsvn/experience/{domain}.md`): [`references/procedures/output-formats.md`](references/procedures/output-formats.md) [PROCEDURE].

## Context Resolution Order

When discover (or any downstream skill) needs prior decisions:

1. **Conversation context** — same session, decisions in chat
2. **Artifact on disk** — previous session saved a spec or contract
3. **Discovery** — ask the user or scan the codebase

Downstream skills don't REQUIRE artifacts as files. They need decisions known, from whatever source.

## Configuration

| Parameter | Default | Override example |
|---|---|---|
| depth | auto (Adaptive Depth) | "quick scope" / "deep interview" / "ask 3 questions" |
| mode | auto-detected (Step 2.5) | "treat this as a plan review" / "fresh idea, ignore the existing spec" |
| plan-review-mode | user-picked when mode = plan-review | "expand the scope" / "hold scope, find risks" / "cut to minimum" / "cherry-pick expansions" |
| output | conversation | "save to spec" / "write a contract" / "save answers" |
| zones | auto (3-5 based on problem) | "focus on technical risks and UX" |
| idea-critic | auto-on for idea-stage | "skip the idea critic" (records override in spec frontmatter) |

## Anti-Patterns + Edge Cases

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 10 interview anti-patterns + 7 resolution/exit anti-patterns (silent exit on override, false resolution, two verdicts, verdict-skipping, mode-mixing, plan-review-mode drift, padding) + 4 output anti-patterns (default-to-save, light-depth-with-mandatory-sections, defaulting-to-safer-alternative, single-alternative-without-flag) + 12 edge cases. Re-read before any answer-handling moment that smells off — banned-phrase reach, soft-NEEDS_CONTEXT, scope-creep, false-resolution exit.

## Skill Deference

- **FEATURE or TASK to clarify?** → this skill
- **Declining METRIC to diagnose?** → `diagnose`
- **Multi-perspective debate on a decision?** → `debate-agents` (or invoke as sub-routine here at Step 5)
- **Know what to build, need technical design?** → `architect-system`
- **Decompose into tasks?** → `breakdown-tasks`

## Chain Position

**Previous:** none (or any skill that surfaces a need for clarification)
**Next:** `architect-system`, `breakdown-tasks`, or direct implementation
**Re-run triggers:** requirements change significantly, new constraints emerge, or implementation reveals the spec was wrong.

## Completion Status

Every run ends with explicit status:

- **DONE** — discovery converged, decision is clear (optionally saved as `.forsvn/artifacts/meta/specs/*.md` if user asked)
- **DONE_WITH_CONCERNS** — decision made but with non-blocking open questions or explicit caveats; flagged inline (and pinned to spec frontmatter if saved). Also fires when operator overrides resolution-exit (Open Branches section non-empty).
- **BLOCKED** — irreconcilable conflict in user inputs or scope; needs human resolution before any path forward
- **NEEDS_CONTEXT** — user cannot answer key questions; recommend upstream skill (icp-research, market-research, diagnose) or external consultation

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill, methodology, principles, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — fast/standard/deep ↔ Light/Medium/Deep depth mapping
- [`references/procedures/context-gathering.md`](references/procedures/context-gathering.md) [PROCEDURE] — Step 1 scan targets + operator-craft stance load + founder-domain frame matrix
- [`references/procedures/communication-discipline.md`](references/procedures/communication-discipline.md) [PROCEDURE] — banned phrases + take-a-position + always-recommend + pushback patterns
- [`references/procedures/interview-techniques.md`](references/procedures/interview-techniques.md) [PROCEDURE] — Why Chains, Past Behavior, Daily Use, Forced Tradeoffs, Failed Attempt, Success Criteria, Should-Want Detection + question formats + pacing
- [`references/procedures/idea-critic-dispatch.md`](references/procedures/idea-critic-dispatch.md) [PROCEDURE] — Step 2.7 dispatch (Input Contract, on-PROCEED, on-PUSH_BACK, skip conditions)
- [`references/procedures/output-formats.md`](references/procedures/output-formats.md) [PROCEDURE] — operator-grade spec + Light-depth compact + Contract format + Writing good clauses + Verification template + out-of-scope persistence + experience doc append
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — interview + resolution-exit + output anti-patterns + 12 edge cases
- [`references/question-bank.md`](references/question-bank.md) — extended probing questions by domain (lazy-loaded only when a coverage zone hits one of the listed domains)
- [`references/example-contracts.md`](references/example-contracts.md) — worked contract examples
- [`references/operator-playbooks/`](references/operator-playbooks/) — 9 practitioner-grade frames (3 always-on stance + 6 founder-domain loaded on product-context match)
- [`agents/idea-critic.md`](agents/idea-critic.md) — single sub-agent dispatched in Step 2.7 on idea-stage sessions
- `agent-skills/CLAUDE.md` §"Artifact Placement" — lifecycle taxonomy (umbrella dependency, not shipped under `npx skills add` standalone install; the `spec` lifecycle this skill emits is fully documented inline in the Artifact Contract block above — no separate link needed)
