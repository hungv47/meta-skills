---
name: preflight
description: "Surface assumptions and define success criteria before building. Phase 0: scope mode (EXPAND/HOLD/REDUCE). Phase 1: ask 5 clarifying questions ranked by impact. Phase 2: write a contract (GOAL/CONSTRAINTS/FORMAT/FAILURE/NOT IN SCOPE/EXISTING). Not for vague ideas needing discovery (use plan-interviewer). Not for trivial tasks."
argument-hint: "[task or feature to scope]"
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
routing:
  intent-tags:
    - clarify
    - assumptions
    - contract
    - scope
  position: horizontal
  produces: []
  consumes: []
  requires: []
  defers-to:
    - skill: plan-interviewer
      when: "user has a vague idea that needs multi-round discovery, not an existing task to scope"
  parallel-with: []
  interactive: true
  estimated-complexity: light
---

# Preflight

*Meta — Methodology. Surface your assumptions, then lock down success criteria before building.*

**Core Question:** "What would I silently get wrong if I just started coding?"

## Critical Gates — Read First

1. **Never skip Phase 1 for non-trivial tasks** — even if the user says "just build it," hidden assumptions are the #1 cause of rework. Ask the questions.
2. **FAILURE clauses are the key innovation** — they prevent the builder from taking shortcuts they'd otherwise rationalize. Every contract MUST have specific failure conditions.
3. **5 questions, not 20** — the constraint forces prioritization. Ask the questions where a different answer would MOST change your approach.
4. **Wait for answers before Phase 2** — never generate the contract from assumptions alone.

## Philosophy

The most expensive agent failures are silent assumption failures — confidently building the wrong thing because you assumed REST when they meant GraphQL, or assumed a new file when they wanted to extend an existing one. Preflight makes assumptions visible and fixable before they're expensive.

The FAILURE clause front-loads reasoning about what "done" means. Without it, agents silently cut corners they'd avoid if failure modes were explicit.

## Inputs Required
- A task or feature description from the user

## Output
- Phase 0: Scope mode selection (EXPAND/HOLD/REDUCE) (inline)
- Phase 1: 5 clarifying questions with answers (inline)
- Phase 2: A validated contract (GOAL/CONSTRAINTS/FORMAT/FAILURE/NOT IN SCOPE/EXISTING) (inline)
- Phase 3: Hand-off with verification template for the implementing agent (inline)
- Optional: Experience doc append at `.agents/experience/{domain}.md` (see Phase 1, Step 5)

No persistent artifact is produced by default — output lives in the conversation context and is consumed by the next skill in the chain. This is intentional: preflight scopes a task, it doesn't produce a standalone deliverable.

## Chain Position
- **Before:** Any domain skill — system-architecture, task-breakdown, code-cleanup, content-create, etc.
- **After:** Optionally after plan-interviewer (preflight scopes a specific task from the broader spec)

Re-run triggers: scope change, contradictory requirements discovered during build

## Skill Deference
- **plan-interviewer:** User doesn't know WHAT to build → plan-interviewer (multi-round discovery). User knows WHAT but needs to scope HOW → preflight.
- **Together:** plan-interviewer first (produce spec.md), then preflight on individual features within the spec.

---

## Phase 0: Scope Mode Selection

Before asking questions, establish the ambition level for this task. Ask the user:

> "What's the ambition level for this task?"
> - **EXPAND** — Dream big. Explore what this could become. Questions will probe "what else could this do?"
> - **HOLD** — Execute the stated scope with maximum rigor. Questions will probe "is this exactly right?"
> - **REDUCE** — Strip to minimum viable. Questions will probe "what can we cut?"

If the user doesn't pick, default to **HOLD**. The scope mode frames all Phase 1 questions:
- **EXPAND**: bias questions toward opportunity ("What if this also handled X?", "Have you considered Y?")
- **HOLD**: bias questions toward precision ("Is this exactly what you mean by X?", "Does this include Y or not?")
- **REDUCE**: bias questions toward elimination ("Do we actually need X?", "What's the minimum that ships value?")

---

## Phase 1: Surface Assumptions (from Reverse Prompting)

### 1. Receive the task

Read the user's task description. Do NOT start implementing. Analyze what you'd need to know to do this well.

### 2. Check for prior context (2-5 minutes max)

Before asking questions, do a quick scan for answers that already exist. Don't spend more than 5 minutes here — this is a narrowing step, not a research step.

- Check `.agents/` for relevant artifacts (spec.md, system-architecture.md, product-context.md)
- Check `.agents/experience/{domain}.md` for answers from prior preflight runs
- Check `.agents/meta/learned-rules.md` for relevant corrections from prior runs — include any applicable rules in your question generation and contract writing
- Skim `CLAUDE.md` for project conventions
- Glance at existing code for obvious patterns that answer your questions implicitly

If prior context answers 3+ of your potential questions, you may reduce question_count accordingly. This narrows your questions to things NOT already answered by the codebase.

### 3. Generate 5 questions

Think about what assumptions you'd silently make if you just started coding. Turn those assumptions into questions. Prioritize by impact — ask the questions where a different answer would most change your implementation.

Pick the 2-3 categories with the highest impact for THIS task, then draw your 5 questions from them. Don't try to cover all categories — depth over breadth:
- **Scope** — what's in vs out? ("Should this handle X or is that a separate task?")
- **Tech choices** — which tools/patterns? ("REST or GraphQL? New service or extend existing?")
- **Edge cases** — what happens when things break? ("What should happen if the API is down?")
- **Performance** — what scale? ("Are we talking 100 users or 100K?")
- **Integration** — what touches this? ("Does this need to work with the existing auth system?")
- **UX** — what does the user see? ("Should errors show a toast or inline message?")
- **Existing patterns** — follow or diverge? ("The codebase uses X pattern — should I match it or is this a chance to improve?")

For each question:
1. State the assumption you'd make if not asked
2. Ask the question
3. Explain why the answer matters

Example:
```
Q1 (highest impact): Should this be a REST API or GraphQL?
My default assumption: REST, since the existing codebase uses Express.
Why it matters: GraphQL would require adding apollo-server and restructuring
the resolver layer — completely different implementation path.
```

### 4. Wait for answers

Do not proceed until the user answers all 5 questions. If they skip a question, use your default assumption and note it explicitly.

### 5. Record answers and build the experience flywheel

For repeat task domains (e.g., "build another API endpoint", "add another page"), record answers to avoid re-asking in future tasks. This creates a compounding knowledge base.

**If an experience doc exists** (`.agents/experience/{domain}.md`), read it first in Step 2 and narrow your questions to things NOT already answered.

**After getting answers**, append the Q&A to `.agents/experience/{domain}.md`:

```markdown
## {Task Name} — Decisions ({date})

Q: {question}
A: {user's answer}
Rationale: {why this matters for future tasks}
```

**The flywheel effect:** Each preflight adds context → future preflights need fewer questions → output quality improves immediately. After 3-4 runs in the same domain, you may only need 1-2 new questions instead of 5.

Skip this step only if the project doesn't use experience docs or the task is a one-off.

---

## Phase 2: Define the Contract (from Prompt Contracts)

### 6. Generate the contract

Using the task description + user's answers from Phase 1, write a 4-part contract:

```markdown
## Contract

SCOPE MODE: [EXPAND | HOLD | REDUCE]

GOAL: [What does success look like? Include a measurable metric.]

CONSTRAINTS:
- [Hard limit 1 — technology, scope, or resource constraint]
- [Hard limit 2]
- [Hard limit 3]

FORMAT:
- [Exact output shape — files, structure, what's included]
- [File naming and organization]
- [What to include — types, tests, docs]

FAILURE (any of these = not done):
- [Specific failure condition 1]
- [Specific failure condition 2]
- [Edge case that must be handled]
- [Quality bar that must be met]

NOT IN SCOPE:
- [Explicitly excluded item 1 — with rationale]
- [Explicitly excluded item 2 — with rationale]

EXISTING (leverage these):
- [Existing code, pattern, or asset that should be reused — from Step 2 context scan]
- [Existing convention or config that constrains the approach]
```

#### Writing good GOAL statements:
- Include a number: "handles 50K req/sec" not "handles high traffic"
- Be specific: "returns results in <200ms p95" not "is fast"
- Define the user-visible outcome: "user can filter by date, status, and assignee" not "add filtering"

#### Writing good CONSTRAINTS:
- Only hard limits — things that are NOT negotiable
- Technology: "no external dependencies", "must use existing ORM"
- Scope: "under 200 lines", "single file", "no new database tables"
- Compatibility: "must work with Node 18+", "backwards compatible with v2 API"

#### Writing good FORMAT:
- Exact file structure: "single file: `rate_limiter.py`" not "a Python file"
- What to include: "type hints on all public methods", "5+ pytest tests"
- What to exclude: "no comments explaining obvious code", "no README"

#### Writing good FAILURE clauses:
Think about how the task could "technically work" but actually be wrong:
- Missing edge case: "no test for empty input"
- Performance miss: "latency exceeds 1ms on synthetic load"
- Silent failure: "swallows errors without logging"
- Incomplete: "doesn't handle the concurrent access case"
- Over-engineered: "adds abstraction layers not required by GOAL"

### 7. Validate the contract

Before proceeding, check that the contract is:
- **Complete** — all 4 sections filled out
- **Consistent** — CONSTRAINTS don't contradict GOAL
- **Testable** — every FAILURE condition can be mechanically verified
- **Scoped** — GOAL is achievable within the CONSTRAINTS

Present the contract to the user for approval. If anything is ambiguous, ask.

---

## Phase 3: Hand-Off and Contract Enforcement

Preflight is complete once the contract is validated and approved. The implementing skill (system-architecture, task-breakdown, or raw coding) takes over from here.

### 8. Hand off the contract

Pass the approved contract to the next skill or implementation step. The contract becomes the implementing agent's spec:
- **GOAL**: The thing to optimize for
- **CONSTRAINTS**: Boundaries that cannot be crossed
- **FORMAT**: Exact shape of the output
- **FAILURE**: Conditions that must be actively prevented

### 9. Verification template (for the implementing agent)

Include this verification template with the hand-off. The implementing agent runs it before delivering:

```markdown
## Contract Verification

- [ ] FAILURE 1: {condition} → VERIFIED: {how you confirmed it passes}
- [ ] FAILURE 2: {condition} → VERIFIED: {how you confirmed it passes}
- [ ] FAILURE 3: {condition} → VERIFIED: {how you confirmed it passes}
- [ ] GOAL metric met: {evidence}
- [ ] All CONSTRAINTS respected: {confirmation}
- [ ] FORMAT matches spec: {confirmation}
```

### 10. Contract status format

The implementing agent delivers with this status:

```
Contract status: ALL PASS

GOAL: ✓ {metric achieved — show evidence}
CONSTRAINTS: ✓ {all respected}
FORMAT: ✓ {matches spec}
FAILURE conditions: ✓ {all verified — none triggered}
```

If any condition failed:

```
Contract status: 1 FAILURE

GOAL: ✓
CONSTRAINTS: ✓
FORMAT: ✓
FAILURE conditions: 1 of 4 failed
  - FAILED: "latency <1ms on 50K requests" — achieved 1.3ms
  - Reason: {why it failed}
  - Options: {what could fix it}
```

---

## Example Contracts

### API endpoint:
```
GOAL: GET /users endpoint returning paginated results, handling 10K concurrent connections.

CONSTRAINTS:
- Express.js, existing Prisma ORM
- No new dependencies
- Under 80 lines (route + controller)

FORMAT:
- Route in routes/users.ts
- Controller in controllers/users.ts
- 5 tests in __tests__/users.test.ts
- OpenAPI JSDoc on the route

FAILURE:
- No pagination (limit/offset at minimum)
- No input validation on query params
- Returns 500 on invalid input instead of 400
- No test for empty results
- No test for invalid page number
```

### React component:
```
GOAL: Reusable DataTable component supporting sort, filter, and pagination for up to 10K rows without lag.

CONSTRAINTS:
- React 18+, TypeScript, no external table libraries
- Must accept generic row type via generics
- Virtualized rendering for 1K+ rows

FORMAT:
- components/DataTable/DataTable.tsx (component)
- components/DataTable/DataTable.types.ts (types)
- components/DataTable/DataTable.test.tsx (tests)
- Storybook story showing 3 variants

FAILURE:
- Scrolling lags on 5K rows
- Sort doesn't handle mixed types (strings vs numbers)
- Filter doesn't debounce (fires on every keystroke)
- No empty state
- Generic type not inferred from data prop
```

---

## When to Use

- Infrastructure code (rate limiters, caches, queues)
- API endpoints and services
- Anything that will be hard to fix later
- Tasks where quality matters more than speed
- When you want to prevent "it technically works but..." outcomes

## When NOT to Use

- Quick prototypes ("just get something working")
- Trivial tasks where a contract would be more text than the code itself
- Urgent hotfixes where speed matters more than perfection
- Tasks with extremely detailed specs already provided
- Exploratory tasks where requirements are still forming (use plan-interviewer instead)

## Configuration

| Parameter | Default | Override example |
|-----------|---------|-----------------|
| question_count | 5 | "ask 3 questions" or "7 questions" (range: 3-7) |
| contract_template | standard | "minimal contract" (GOAL + FAILURE only) or "detailed" (adds rationale per clause) |
| verify | true | "skip verification" |
| strict | true | "soft mode — report failures but don't block" |
| experience_doc | none | "save answers to `.agents/experience/api.md`" |

## Edge Cases

- **User says "just do it"**: Respect it. List your assumptions as a comment and proceed. Skip Phase 1, optionally do a lightweight Phase 2 (GOAL + FAILURE only).
- **All questions already answered by context**: Skip to Phase 2. Note that you reviewed context and found no ambiguities.
- **User provides incomplete contract**: Fill in missing sections with reasonable defaults and confirm with the user before proceeding.
- **FAILURE conditions conflict with GOAL**: Flag the contradiction. Ask which takes priority.
- **Can't verify a FAILURE condition**: Note it as "UNVERIFIABLE" and explain why. Suggest how the user can verify manually.
- **Task is trivial**: Say so. Suggest skipping the contract or using a minimal version (GOAL + FAILURE only).
- **User answers are contradictory**: Flag the contradiction. Ask one follow-up to resolve it.
- **Task changes after questions**: Re-assess whether your answers still apply. Ask 1-2 new questions if the scope shifted significantly. Don't restart from scratch.
- **Experience doc already has answers**: Read `.agents/experience/{domain}.md` first. Only ask questions NOT already answered. Append new Q&As after the user responds.
