---
name: plan-interviewer
description: "Interviews the user to clarify a vague idea into a concrete spec — asks probing questions, identifies gaps, and produces a structured PRD. Produces `.agents/spec.md`. Not for breaking an existing spec into tasks (use task-breakdown) or designing technical architecture (use system-architecture)."
argument-hint: "[idea or feature to specify]"
license: MIT
metadata:
  author: hungv47
  version: "2.0.0"
routing:
  intent-tags:
    - requirements
    - interview
    - spec-writing
    - idea-clarification
    - scope-definition
    - clarify
    - assumptions
    - contract
    - scope
  position: pipeline
  produces:
    - spec.md
  consumes:
    - product-context.md
    - design/user-flow.md
  requires: []
  defers-to:
    - skill: problem-analysis
      when: "diagnosing a metric decline, not clarifying a build spec"
    - skill: system-architecture
      when: "spec is clear, need technical design"
  parallel-with: []
  interactive: true
  estimated-complexity: medium
---

# Plan Interviewer — Orchestrator

*Productivity — Multi-agent orchestration. Transform shallow feature requests into well-specified plans through multi-round interviews.*

**Core Question:** "What haven't we thought of yet?"

**Core Philosophy:** "Interview until you have 95% confidence about what the user actually wants, not what they think they should want."

The gap between stated requirements and true needs is where most failed projects begin. Every agent in this skill contributes to closing that gap:
- **challenger-agent** detects should-want framing at the premise level
- **interviewer-agent** tracks confidence and uses intent-alignment techniques to surface actual needs
- **synthesis-agent** includes a confidence assessment in the spec
- **critic-agent** verifies confidence was genuinely achieved, not just declared

## Inputs Required
- A feature request, problem description, or existing plan/spec file to refine
- Access to AskUserQuestion tool for multi-round interviews

## Output
- Spec file at user-designated path (default: `.agents/spec.md`)

## Chain Position
Previous: none | Next: `task-breakdown` or `system-architecture`

### Skill Deference
- **Have a FEATURE or PRODUCT to specify?** → Use this skill (Route A/B).
- **Have a clear task but need to lock scope before building?** → Use Route C (Quick Scope) — 5 questions + contract, no full interview.
- **Have a declining METRIC to diagnose** (X is at Y, should be Z)? → Use `problem-analysis` (from research-skills) instead.

**Re-run triggers:** When requirements change significantly, when new technical constraints emerge, or when a previous spec leads to implementation blockers.

---

## Multi-Agent Architecture

### Agent Roster

| Agent | File | Focus |
|-------|------|-------|
| codebase-scanner-agent | `agents/codebase-scanner-agent.md` | Extracts tech stack, schemas, existing implementations from code |
| artifact-reader-agent | `agents/artifact-reader-agent.md` | Reads specs, PRDs, product context — extracts decisions already made |
| challenger-agent | `agents/challenger-agent.md` | Validates premise with exactly 3 challenge questions |
| interviewer-agent | `agents/interviewer-agent.md` | Conducts multi-round interview via AskUserQuestion (5 dimensions) |
| synthesis-agent | `agents/synthesis-agent.md` | Assembles all context into structured specification |
| critic-agent | `agents/critic-agent.md` | Quality gate review, dimension coverage, decision completeness |
| scope-contract-agent | `agents/scope-contract-agent.md` | Generates 4-part contract (GOAL/CONSTRAINTS/FORMAT/FAILURE) for Route C |

### Execution Layers

```
Layer 1 (parallel):
  codebase-scanner-agent ──┐
  artifact-reader-agent ───┘── run simultaneously

Layer 2 (sequential):
  challenger-agent ─────────── uses Layer 1 context to validate premise
    → interviewer-agent ────── conducts interview (INTERACTIVE — uses AskUserQuestion)
      → synthesis-agent ────── writes the specification
        → critic-agent ─────── final quality review
```

### Dispatch Protocol

1. **Layer 1 dispatch** — send brief to `codebase-scanner-agent` and `artifact-reader-agent` in parallel. They extract what the codebase and existing artifacts already answer.
2. **Challenger dispatch** — send brief + Layer 1 outputs to `challenger-agent`. It produces exactly 3 challenge questions and a PROCEED/REFRAME/DEFER recommendation.
3. **User confirmation** — present challenger's questions to the user. If REFRAME, present the alternative framing. If user confirms proceed, continue. If DEFER, stop and explain.
4. **Interviewer dispatch** — send all context to `interviewer-agent`. It conducts interview rounds via **AskUserQuestion**, covering all 5 dimensions, skipping questions already answered by Layer 1. Rounds continue until the interviewer-agent reaches 95% confidence (typically 3-7 rounds). Confidence is tracked per-dimension and drives the stopping condition — not round count.
5. **Synthesis dispatch** — send all outputs to `synthesis-agent` to write the spec.
6. **Critic review** — send spec to `critic-agent`.
7. **Revision loop** — if critic returns FAIL, re-dispatch affected agents. Maximum 2 rounds.
8. **Save** — write spec to user-designated path (default: `.agents/spec.md`).

### Routing Rules

| Condition | Route |
|-----------|-------|
| No codebase exists (greenfield) | codebase-scanner-agent returns NO CODEBASE; all questions valid |
| No artifacts exist | artifact-reader-agent returns NO ARTIFACTS; interview from scratch |
| Challenger recommends REFRAME | Present reframing to user; proceed on confirmation |
| Challenger recommends DEFER | Stop; explain what should happen instead |
| User says "skip the questions, just write it" | Use Layer 1 context + challenger only; synthesize without interview |
| Critic PASS | Save and deliver |
| Critic FAIL | Re-dispatch cited agents with feedback |
| Task is well-defined, user says "scope"/"preflight" | **Route C: Quick Scope** (see below) |

---

## Route C: Quick Scope

*Lightweight scope-locking for clear tasks. Produces a 4-part contract instead of a full spec.*

**When to use:** The task is well-defined (not a vague idea), but the implementer needs to surface hidden assumptions and lock down success criteria before building. Triggered by "scope this", "preflight", "lock scope", or when estimated-complexity is light.

**Core Question:** "What would I silently get wrong if I just started coding?"

### Execution

```
1. LAYER 1 — Dispatch IN PARALLEL:
   - codebase-scanner-agent (reuse) ──┐
   - artifact-reader-agent (reuse) ───┘── extract existing context

2. EXPERIENCE CHECK:
   - Read `.agents/experience/{domain}.md` if it exists
   - Narrow questions to things NOT already answered

3. CLARIFYING QUESTIONS (INTERACTIVE):
   - Generate 5 questions ranked by impact
   - Pick from highest-impact categories for THIS task:
     Scope, Tech choices, Edge cases, Performance, Integration, UX, Existing patterns
   - For each: state the default assumption, ask the question, explain why it matters
   - Use AskUserQuestion — wait for answers
   - If user skips a question, use default assumption and note it

4. DISPATCH:
   - scope-contract-agent → 4-part contract (GOAL/CONSTRAINTS/FORMAT/FAILURE)
   - Includes verification template for the implementing agent

5. EXPERIENCE FLYWHEEL:
   - Append Q&A to `.agents/experience/{domain}.md`
   - Format: ## {Task Name} — Decisions ({date})
   - Each entry: Q, A, Rationale (why this matters for future tasks)
   - Effect: each run adds context → future runs need fewer questions

6. RETURN:
   - Inline contract + verification template (no spec.md artifact)
   - Hand off to next skill with contract as scope lock
```

### Route C Configuration

| Parameter | Default | Override example |
|-----------|---------|-----------------|
| question_count | 5 | "ask 3 questions" (range: 3-7) |
| contract_template | standard | "minimal contract" (GOAL + FAILURE only) |
| strict | true | "soft mode — report failures but don't block" |

### Route C Edge Cases

- **User says "just do it"**: List assumptions as a comment and proceed. Skip questions, optionally do a minimal contract (GOAL + FAILURE only).
- **All questions answered by context**: Skip to contract generation. Note that context was sufficient.
- **FAILURE conditions conflict with GOAL**: Flag the contradiction and ask which takes priority.
- **Task is trivial**: Say so. Suggest skipping the contract or using minimal template.
- **Experience doc already has answers**: Only ask questions NOT already answered. May reduce to 1-2 new questions.

---

## Critical Gates

Before delivering, the critic-agent verifies ALL of these pass:

- [ ] All 5 interview dimensions explored (Technical, UX, Business Logic, Architecture, Security)
- [ ] Spec contains concrete decisions, not open-ended options
- [ ] Edge cases documented with explicit handling strategies
- [ ] Open questions list is empty or explicitly deferred with rationale
- [ ] Confidence assessment reaches 95% overall (no dimension below 80%)

**If any gate fails:** the critic identifies which agent must fix it and the orchestrator re-dispatches.

---

## Single-Agent Fallback

When context window is constrained or the feature is simple:

1. Skip multi-agent dispatch
2. Check for existing codebase context and artifacts
3. Challenge the premise (3 questions: right problem? what if nothing? what exists?)
4. Conduct interview using AskUserQuestion (2-4 questions per round, all 5 dimensions, tracking confidence per dimension until 95% overall)
5. Write specification using the Spec File Format below
6. Run Critical Gates as self-review
7. Save to `.agents/spec.md`

---

## AskUserQuestion Tool Usage

**This skill is interactive.** The interviewer-agent uses AskUserQuestion for every question round.

Structure questions for maximum clarity:
- 2-4 questions per invocation
- Each question has 2-4 concrete options
- Options represent real tradeoffs, not obvious choices
- Include brief description explaining implications of each option
- State which option you recommend and why

**Example:**
```
Question: "When a background sync fails, how should we handle it?"
Options:
1. Silent retry (3x with backoff) — User unaware, but may see stale data
2. Toast notification — User informed but may be annoyed
3. Badge indicator — Subtle, user can investigate when ready
4. Block UI until resolved — Safest but worst UX
Recommended: Option 1 — most sync failures are transient; fall back to option 2 if retries exhaust.
```

---

## Interview Dimensions (all 5 required)

### Technical Implementation
- Data flow edge cases (What happens when X fails mid-operation?)
- State management boundaries (Where does this state live?)
- Concurrency considerations (What if two users do this simultaneously?)
- Migration paths, performance cliffs

### UX & Interaction Design
- Error recovery flows, loading/empty/error states
- Undo/redo expectations, accessibility edge cases
- Mobile-first considerations

### Business Logic & Domain
- Edge case ownership, audit/compliance needs
- Multi-tenancy implications, internationalization

### Architecture & Tradeoffs
- Consistency vs availability, coupling concerns
- Testability, observability
- Implementation foresight (decisions to resolve NOW, not at 2am during build)

### Security & Privacy
- Trust boundaries, data exposure, rate limiting

---

## Spec File Format

```markdown
---
skill: plan-interviewer
version: 1
date: {{today}}
status: draft
---

# [Feature Name] Specification

## Problem Statement
[1-2 paragraphs on what we're solving and why]

## Decided Approach
[High-level approach with key architectural decisions]

## Key Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| [Topic]  | [What] | [Why]     |

## Edge Cases
- **[Scenario]**: [How we handle it]

## Out of Scope
- [What we're explicitly NOT doing]

## Open Questions
- [ ] [Anything still unresolved]

## Implementation Notes
[Technical details, gotchas, dependencies]

## Confidence Assessment
| Dimension | Confidence | Key Basis |
|-----------|-----------|-----------|
| [dimension] | [%] | [primary evidence] |

## Intent Alignment Summary
[Where stated requirements differed from actual needs, or "No intent gaps detected"]
```

---

## Anti-Patterns

| Anti-Pattern | Problem | INSTEAD |
|--------------|---------|---------|
| Leading questions | "Don't you think we should use WebSockets?" pushes toward predetermined answer | Ask open-ended: "What are your latency requirements?" |
| Accepting the first answer | Surface-level answers miss hidden constraints | Probe deeper: "Why that approach?" and "What would change your mind?" |
| Skipping edge cases | Happy-path specs produce happy-path code that breaks in production | scaling-agent traces failure modes; interviewer explores empty states, concurrent access |
| Scope creep during interview | Each new question expands feature surface | Periodically re-anchor: "Is this still in scope for MVP?" |
| Asking questions the codebase answers | "What framework?" when package.json is right there | codebase-scanner-agent extracts facts first; interviewer skips answered questions |
| Options instead of decisions | Spec says "could use X or Y" | synthesis-agent writes concrete decisions only; undecided items go to Open Questions |
| Accepting should-want answers at face value | User says what sounds "correct" rather than what they actually need | Probe intent: "Walk me through how you'd use this on a typical day" and "What have you tried before?" |

---

## Worked Example

**User:** "I want to build a habit tracker app."

**Layer 1 (parallel):**
- `codebase-scanner-agent` → NO CODEBASE (greenfield)
- `artifact-reader-agent` → NO ARTIFACTS

**Challenger (3 questions):**
1. Right problem? "Outcome: users build consistent habits. A habit tracker is the most direct path."
2. What if nothing? "Users currently use spreadsheets — friction causes abandonment."
3. What exists? "Greenfield — no existing code." → Recommendation: PROCEED

**Interviewer (5 rounds, AskUserQuestion, confidence: 40%→55%→75%→88%→96%):**
- Round 1 (Scope): Personal only, mobile-first PWA, 4-week MVP [confidence: 40% — broad strokes only]
- Round 2 (Users): Health-conscious 25-35, switching from spreadsheets [55% — but "switching from spreadsheets" triggered intent probe: "What specifically frustrates you about spreadsheets?" → revealed real need is VISUAL PROGRESS, not tracking per se]
- Round 3 (Features): Add habit → check off → see streak. Configurable reminders. [75% — intent aligned: progress visualization is core, not just checkboxes]
- Round 4 (Edge cases): Streak resets on miss (history preserved), user's local timezone [88%]
- Round 5 (Technical): Email magic link auth, offline sync on reconnect [96% — stopping]

**Synthesis:** Spec with 14 concrete decisions, 3 deferred items, and intent alignment note: "User initially framed as 'habit tracker' but probing revealed the core need is visual progress feedback — tracking is the mechanism, not the value."

**Critic:** PASS — all 5 gates pass, all 5 dimensions covered.

**Artifact saved to `.agents/spec.md`.**

---

## Before Starting

### Step 0: Product Context
Check for `.agents/product-context.md`. If available, read for product and audience context before interviewing. If missing, plan-interviewer works standalone.

### Optional Artifacts
| Artifact | Source | Benefit |
|----------|--------|---------|
| `.agents/product-context.md` | icp-research (from `hungv47/marketing-skills`) | Product context prevents redundant interview questions |
| `.agents/problem-analysis.md` | problem-analysis (from `hungv47/research-skills`) | Root cause context when feature solves a diagnosed problem |

---

## Artifact Template

On re-run: rename existing artifact to `spec.v[N].md` and create new with incremented version.

Save to user-designated path (default: `.agents/spec.md`) using the Spec File Format above.

---

## References
- **`references/question-bank.md`** — Extended list of probing questions by domain
