---
name: discover
description: "Conversational discovery — adapts from quick scoping (3-5 questions) to deep interviews (multi-round). Talk until we're clear, then build. Produces inline decisions; optionally saves spec.md or scope contract. Not for multi-perspective debate (use agents-panel). Not for decomposing work (use task-breakdown). Not for diagnosing a known metric decline or root-causing a problem (use diagnose)."
argument-hint: "[idea, feature, or task to clarify]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "3.0.0"
  budget: fast
  estimated-cost: "$0.03-0.10"
promptSignals:
  phrases:
    - "what should we build"
    - "help me think through"
    - "i have an idea"
    - "scope this"
    - "what do we need"
    - "clarify requirements"
  allOf:
    - [scope, definition]
    - [clarify, requirements]
  anyOf:
    - "requirements"
    - "idea"
    - "scope"
    - "clarify"
    - "spec"
    - "preflight"
    - "assumptions"
  noneOf:
    - "market research"
    - "competitive analysis"
    - "competitor"
    - "root cause"
    - "metric decline"
    - "why is"
    - "diagnose"
  minScore: 6
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
    - preflight
  position: horizontal
  lifecycle: spec
  produces:
    - skill-artifacts/meta/specs/*.md
  consumes:
    - product-context.md
    - skill-artifacts/product/flow/*.md
  requires: []
  defers-to:
    - skill: diagnose
      when: "diagnosing a metric decline, not clarifying a build spec"
    - skill: system-architecture
      when: "spec is clear, need technical design"
    - skill: agents-panel
      when: "complex decision needs multi-perspective debate, not interview"
  parallel-with: []
  interactive: true
  estimated-complexity: medium
---

# Discover

*Meta — Conversational. Transform vague ideas into shared clarity through adaptive conversation.*

**Core Philosophy:** "Just talk with your agent." Close the gap between stated requirements and true needs through conversation — not documents, formal phases, or plan mode.

**Core Question:** "What would we silently get wrong if we just started building?"

---

## How It Works

1. You describe what you want
2. The agent scans context and assesses complexity (silently)
3. Questions begin — adaptive to what's needed
4. Conversation continues until mutual clarity
5. Build directly, or save a spec/contract if needed

No plan mode. No pipeline stages. No mandatory artifacts. The conversation IS the alignment.

---

## Adaptive Depth

The skill auto-calibrates based on signals it reads from the request:

| Signal | Depth | Behavior |
|--------|-------|----------|
| Clear task, existing codebase, well-defined scope | **Light** (3-5 questions) | Surface assumptions, lock scope, go |
| Feature with some ambiguity, multiple approaches | **Medium** (5-10 questions) | Explore key decisions, probe edge cases |
| Vague idea, greenfield, "I want to build X" | **Deep** (multi-round) | Challenge premise, interview across zones, iterate |

The agent reads the situation. "That's enough, let's build" skips ahead — agent notes current clarity level.

**Override:** "quick scope", "deep interview", "just ask 3 questions".

---

## Execution

### Step 1: Context Gathering (silent, before asking anything)

Scan for answers that already exist. A few minutes max — this narrows questions, not a research step.

- **Codebase**: `package.json`, schemas, entry points, relevant existing implementations (Glob/Grep/Read — not a separate agent)
- **Artifacts**: `.agents/` for existing specs, architecture docs, product context
- **Experience docs**: `.agents/experience/{domain}.md` for answers from prior sessions
- **Learned rules**: `.agents/skill-artifacts/meta/learned-rules.md` for behavior corrections
- **Out-of-scope decisions**: `.agents/skill-artifacts/meta/out-of-scope/` — don't re-ask about rejected approaches unless user raises them
- **Project conventions**: skim `CLAUDE.md`

Anything found here is a question you don't ask.

### Step 2: Premise Check (for non-trivial work)

Challenge the premise with 3 quick questions before diving in:

1. **Right problem?** Restate the outcome in one sentence. Is the proposed approach the most direct path? Watch solution-framing vs problem-framing: "We need notifications" (solution) vs "Users miss time-sensitive events" (problem).

2. **What if we did nothing?** Real, measurable pain today? If nobody's complaining, probe why this surfaced now.

3. **What already exists?** Map the request against existing code and tooling. If 60% exists, scope is 40% of what was described.

If the premise is weak, say so. Suggest reframing — don't block; advise and let the user decide.

**Framing checkpoint** — after the user's first substantive answer, verify before continuing:
- **Language precision:** Key terms defined concretely, or hiding behind buzzwords ("AI-powered", "seamless", "platform")?
- **Real vs hypothetical:** Describing what IS happening or what MIGHT happen? Past behavior beats future predictions.
- **Hidden assumptions:** What's the user taking for granted that could be wrong? State it back.

Vague framing produces precise-looking nonsense. Fix it before proceeding.

**Skip premise check when:** task is clearly scoped ("add a dark mode toggle"), user is continuing a prior decision, or context makes the premise obviously sound.

### Step 3: Adaptive Coverage Zones

Identify **3-5 coverage zones** that matter for THIS problem (not 5 fixed dimensions).

- **Product feature:** Problem validation → Solution clarity → Technical risks → Success criteria
- **Business strategy:** Problem clarity → Options landscape → Tradeoffs → Validation path
- **Marketing initiative:** Audience fit → Channel strategy → Messaging → Measurement
- **Infrastructure/devops:** Requirements → Constraints → Failure modes → Rollout plan
- **Design task:** User needs → Information architecture → Interaction patterns → Edge states

State zones upfront: "Here's what I think we need clarity on: [zones]. Anything to add or remove?" User can adjust.

Zones are a compass, not a checklist. Some problems need 2 zones deep; others 5 touched lightly. Let the conversation guide it.

### Communication Discipline

During diagnostic questioning:
- No affirmation before probing — no "Great!", "That makes sense!", "Solid approach" before the next question
- State disagreements directly: "That approach has a problem: [X]" not "That's interesting, though..."
- If the user's answer reveals a weak premise, say so before moving on
- Praise completed outcomes only, never stated intentions
- Agreement doesn't need to be performed — just proceed

**Pushback patterns** — push back with the rigorous version:

*Vague market:*
- BAD: "That's a big market! Let's explore what kind of tool."
- GOOD: "There are thousands of tools in that space. What specific task does a specific person waste 2+ hours on per week that yours eliminates? Name the person."

*Social proof as substitute for evidence:*
- BAD: "That's great validation! Let's build on that momentum."
- GOOD: "Likes and signups are interest, not demand. How many people have paid you money or done real work to solve this problem without your product?"

*Platform vision before wedge:*
- BAD: "That's ambitious! Let's map out the phases."
- GOOD: "Platforms are built from wedges, not designed top-down. What is the single smallest thing you could ship that one specific person would pay for today?"

*Undefined terms:*
- BAD: "AI-powered is definitely trending. Let's think about the AI features."
- GOOD: "What specifically does 'AI-powered' mean in your product? What input goes in, what output comes out, and why can't the user do it themselves in 5 minutes?"

*Growth stats without unit economics:*
- BAD: "200% growth is impressive! How do you plan to scale?"
- GOOD: "200% growth of what base? What does each user cost to acquire, and what do they pay you? Growth without unit economics is just spending."

The best reward for a good answer is a harder follow-up, not praise.

### Step 4: Conversation

Use proven interview techniques naturally. Don't announce them — just ask.

**Why Chains** — "Why this approach specifically?" → drill past surface answers. "We need real-time updates." → "Why real-time?" → "Users check every few minutes." → "So 30s polling works?" → "Actually, yes."

**Past Behavior Probes** — "What are you/users doing today to solve this?" Past behavior reveals real needs; future descriptions reveal aspirations.

**Daily Use Visualization** — "Walk me through a typical day where you'd use this. What triggers you to open it?"

**Forced Tradeoffs** — "If you could only keep 2 of these 4 features, which 2?" Forced choices reveal true priorities.

**Failed Attempt Archaeology** — "Have you tried this before? Used a tool for it? What was wrong?"

**Success Criteria Grounding** — "If this ships and works perfectly, what's the first thing you'd notice is different?"

**Should-Want Detection** — watch for:
- Overly formal or buzzword-heavy language
- Features described from elsewhere without connection to specific pain
- Quick, confident answers to complex questions (real complexity produces hesitation)
- Answers that don't connect to any user story or past experience

When detected, switch to probing actual needs.

**Question Delivery:** two tools — use whichever fits.

**`AskUserQuestion` tool** — clickable options with descriptions. Best for 2-4 concrete choices with real tradeoffs. Mark recommended option ("(Recommended)" suffix). Use `preview` for comparing code/architecture; `multiSelect: true` for non-exclusive choices. "Other" is always available for free text.

**Chat questions** — plain conversational. Best when answer space is wide open or you're following a thread deeper (why chains, past behavior, premise challenges).

Most sessions mix both. Concrete options → tool; exploring → just ask.

**Pacing:**
- 2-4 questions per round
- Each targets 2-4 decision points with real tradeoffs
- State which choice you recommend and why
- Batch up to 4 independent questions into a single AskUserQuestion call
- Briefly acknowledge answers each round; track clarity internally

**Question formats** (use whichever fits the question):

*Assumption-surfacing format* (best for scoping — makes silent assumptions visible):
```
Q1 (highest impact): Should this be a REST API or GraphQL?
My default assumption: REST, since the existing codebase uses Express.
Why it matters: GraphQL would require adding apollo-server and
restructuring the resolver layer — completely different implementation path.
```
Maps naturally to AskUserQuestion with 2 options: "REST (Recommended)" + alternative, rationale in descriptions. Chat works fine too — use judgment.

*Options format* (best for design decisions with clear tradeoffs):
```
Question: "When a background sync fails, how should we handle it?"
Options:
1. Silent retry (3x with backoff) — User unaware, but may see stale data
2. Toast notification — User informed but may be annoyed
3. Badge indicator — Subtle, user can investigate when ready
Recommended: Option 1 — most sync failures are transient
```
Natural fit for AskUserQuestion — options become clickable choices with tradeoff descriptions.

At light depth (scoping), prefer assumption-surfacing — it's the key innovation that prevents silent assumption failures. Deeper depths: mix both formats per question.

### Step 5: Complex Decision Points → Agent Room

When a decision genuinely needs more than one perspective — architecture choice, strategic direction, design tradeoff with no clear winner — invoke `agents-panel` as a sub-routine.

**When to invoke:**
- Two+ viable approaches with non-obvious tradeoffs
- Decision is expensive to reverse
- You're uncertain and want to pressure-test your thinking

**How:** Frame the specific decision ("WebSocket push or polling for this use case?"), include context. Panel debates, returns a recommendation, conversation continues.

**When NOT to invoke:**
- Clear best answer from context
- User already has a strong preference
- Choice is easily reversible

### Step 6: Clarity Check

When clarity is sufficient to build:

1. Summarize key decisions
2. Note remaining open questions and their impact
3. Ask: "Ready to build, or go deeper on anything?"

If the user says go, go. Don't pad.

### Step 7: Output

**Default: conversation context.** Decisions live in chat. The next skill (system-architecture, task-breakdown, direct implementation) reads everything discussed.

**Optional save points** — produce when:
- User explicitly asks ("save this to a spec")
- Session is ending and decisions would be lost
- Output is needed by someone outside this conversation
- Natural milestone reached and user confirms saving

**Save point formats:**

**Spec** (for complex features, handoff to others):
```markdown
---
skill: discover
version: 1
date: {{today}}
status: done | done_with_concerns | blocked | needs_context
---

# [Feature Name] Specification

## Problem Statement
[What we're solving and why]

## Decided Approach
[High-level approach with key decisions]

## Key Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| [Topic]  | [What] | [Why]     |

## Edge Cases
- **[Scenario]**: [How we handle it]

## Failure Conditions
Any of these = not done:
- [Specific condition that would make this feature "technically working" but wrong]
- [Edge case that must be handled — not a nice-to-have]
- [Quality bar that must be met — e.g., "latency under 200ms", "works offline"]

## Out of Scope
- [Explicitly NOT doing]

## Open Questions
- [ ] [Unresolved items]

## Implementation Notes
[Technical details, gotchas, dependencies]
```

**Contract** (for scope-locking before building):
```markdown
## Contract

GOAL: [What does success look like? Include a measurable metric.]

CONSTRAINTS:
- [Hard limit 1 — not negotiable]
- [Hard limit 2]

FORMAT:
- [Exact output shape — files, structure]

FAILURE (any of these = not done):
- [Specific failure condition 1]
- [Edge case that must be handled]
- [Quality bar that must be met]

NOT IN SCOPE:
- [Explicitly excluded — with rationale]
```

**Writing good contract clauses:**

*GOAL* — include a number: "handles 50K req/sec" not "handles high traffic". User-visible outcome: "user can filter by date, status, assignee" not "add filtering".

*CONSTRAINTS* — only hard, non-negotiable limits. Technology: "must use existing ORM". Scope: "under 200 lines, single file". Compatibility: "backwards compatible with v2 API".

*FORMAT* — exact file structure: "single file: `rate_limiter.py`" not "a Python file". Include: "type hints on all public methods, 5+ tests". Exclude: "no comments explaining obvious code".

*FAILURE* — the key innovation. How could this "technically work" but be wrong?
- Missing edge case: "no test for empty input"
- Performance miss: "latency exceeds 1ms on synthetic load"
- Silent failure: "swallows errors without logging"
- Incomplete: "doesn't handle concurrent access"
- Over-engineered: "adds abstraction layers not required by GOAL"

**Verification template** (include when handing off to an implementing agent):
```markdown
## Contract Verification

- [ ] FAILURE 1: {condition} → VERIFIED: {how you confirmed it passes}
- [ ] FAILURE 2: {condition} → VERIFIED: {how you confirmed it passes}
- [ ] GOAL metric met: {evidence}
- [ ] All CONSTRAINTS respected: {confirmation}
- [ ] FORMAT matches spec: {confirmation}
```

**Out-of-scope persistence** (institutional memory):
When features are explicitly scoped out, write to `.agents/skill-artifacts/meta/out-of-scope/[kebab-case-name].md`:
```markdown
# [Feature/Approach Name]
**Decided:** [date]
**Context:** [what was being discussed when this was scoped out]
**Decision:** Not pursuing because [reason from conversation]
**Revisit if:** [condition that would change the decision]
```
Create the directory if missing. Prevents future sessions from re-asking decided questions.

**Experience doc** (learning flywheel):
Append Q&A to `.agents/experience/{domain}.md` after each session:
```markdown
## {Task Name} — Decisions ({date})

Q: {question}
A: {user's answer}
Rationale: {why this matters for future tasks}
```

Flywheel: each session adds context → future sessions need fewer questions → quality improves immediately.

---

## Context Resolution Order

When discover (or any downstream skill) needs prior decisions:

1. **Conversation context** — same session, decisions in chat
2. **Artifact on disk** — previous session saved a spec or contract
3. **Discovery** — ask the user or scan the codebase

Downstream skills don't REQUIRE artifacts as files. They need decisions known, from whatever source.

---

## Anti-Patterns

| Anti-Pattern | Problem | Instead |
|--------------|---------|---------|
| Leading questions | "Don't you think we should use WebSockets?" pushes toward a predetermined answer | Ask open-ended: "What are your latency requirements?" |
| Accepting the first answer | Surface-level answers miss hidden constraints | Probe deeper: "Why that approach?" and "What would change your mind?" |
| Asking questions the codebase answers | "What framework?" when package.json is right there | Context scan first; skip answered questions |
| Options instead of decisions | "We could use X or Y" doesn't resolve anything | Push for concrete choices; undecided items go to Open Questions |
| Accepting should-want at face value | User says what sounds "correct" rather than actual need | Use intent alignment techniques to probe real needs |
| Skipping edge cases | Happy-path specs produce code that breaks in production | Explore failure modes, concurrent access, empty states |
| Scope creep during interview | Each new question expands feature surface | Periodically re-anchor: "Is this still in scope?" |
| Announcing techniques | "I'm now using the Why Chain technique" breaks conversational flow | Just ask the question naturally |
| Giant plans nobody reads | Producing a 500-line spec that gets rubber-stamped | Conversation-first; artifacts only when genuinely needed |
| Fixed dimensions for every problem | Security & Privacy for a CSS refactor wastes time | Adaptive zones based on what matters for THIS problem |

---

## Configuration

| Parameter | Default | Override example |
|-----------|---------|-----------------|
| depth | auto | "quick scope" / "deep interview" / "ask 3 questions" |
| output | conversation | "save to spec" / "write a contract" / "save answers" |
| zones | auto (3-5 based on problem) | "focus on technical risks and UX" |

---

## Edge Cases

- **"Just do it"**: List assumptions inline and start building. Skip questions; mention critical assumptions briefly.
- **"Skip questions"**: Context scan only, summarize what you know, proceed.
- **"Save this"**: Write `.agents/skill-artifacts/meta/specs/*.md` or emit contract format inline.
- **All questions answered by context**: Skip to clarity check. Note context was sufficient.
- **Contradictory answers**: Flag it. One follow-up to resolve.
- **Task changes mid-conversation**: Re-assess whether prior answers still apply. 1-2 new questions if scope shifted. Don't restart.
- **Experience doc has answers**: Read `.agents/experience/{domain}.md` first. Only ask what's not answered.
- **Task is trivial**: Say so. Suggest skipping discovery.
- **"That's enough"**: Respect it. Note current clarity level and unexplored zones.

---

## Skill Deference

- **FEATURE or TASK to clarify?** → this skill.
- **Declining METRIC to diagnose?** → `diagnose`.
- **Multi-perspective debate on a decision?** → `agents-panel`.
- **Know what to build, need technical design?** → `system-architecture`.
- **Decompose into tasks?** → `task-breakdown`.

---

## Chain Position

Previous: none (or any skill that surfaces a need for clarification)
Next: `system-architecture`, `task-breakdown`, or direct implementation

**Re-run triggers:** requirements change significantly, new constraints emerge, or implementation reveals the spec was wrong.

## Next Step

Run `task-breakdown` to decompose scoped work into buildable tasks. Run `system-architecture` for technical design. Run `icp-research` if audience needs further definition.

---

## Completion Status

Every run ends with explicit status:
- **DONE** — discovery converged, decision is clear (optionally saved as `.agents/skill-artifacts/meta/specs/*.md` if user asked)
- **DONE_WITH_CONCERNS** — decision made but with non-blocking open questions or explicit caveats; flagged inline (and pinned to spec frontmatter if saved)
- **BLOCKED** — irreconcilable conflict in user inputs or scope; needs human resolution before any path forward
- **NEEDS_CONTEXT** — user cannot answer key questions; recommend upstream skill (icp-research, market-research, diagnose) or external consultation

---

## References

- **`references/question-bank.md`** — Extended probing questions by domain (data/state, errors, UX, security, performance, integration, business logic, intent alignment)
