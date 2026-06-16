---
title: Discover — Output Formats (Spec + Contract)
lifecycle: canonical
status: stable
produced_by: discover
load_class: PROCEDURE
---

# Output Formats

**Load when:** Step 7 Output — operator asks to save, session is ending and decisions would be lost, output is needed by someone outside this conversation, OR a natural milestone is reached and user confirms saving.

**Default: conversation context.** Most sessions end without writing anything. Decisions live in chat. The next skill (system-architecture, task-breakdown, direct implementation) reads everything discussed.

---

## Format selection

| Trigger | Format | Frontmatter |
|---|---|---|
| Medium/Deep depth, strategic calls being made, a persisted spec others *read* (not a fresh agent resuming the work) | **Operator-grade spec** (5 mandatory sections) | `light_spec: false` (default) |
| Light depth (Adaptive Depth row 1: clear task, well-defined scope, existing codebase) | **Compact spec** (5 sections skipped) | `light_spec: true` |
| Scope-locking before building | **Contract format** (separate template) | n/a — emitted inline |
| Converged session + next consumer is a **fresh agent / future session** (not the operator continuing in-context, not a downstream in-context skill) | **Handoff plan** (path-free, clipboard-ready) | n/a — emitted inline |

**Mandatory-sections rule:** the 5 mandatory sections (Premise Challenge / Dream State Mapping / Implementation Alternatives / Temporal Interrogation / Verdict) apply at Medium/Deep depth. Light-depth saves explicitly skip them. Contracts explicitly skip Premise Challenge + Dream State Mapping (scope-locking, not idea-validating); Implementation Alternatives + Temporal Interrogation + Verdict (in `BUILD_AS_PROPOSED` / `CUT_TO_MINIMUM` shape) DO apply when a contract is generated downstream of the operator-grade spec format.

**Concreteness Checklist rule:** the `## Concreteness Checklist` (Step 6 gate state — six core requirement dimensions, each `concrete` or `open — signed off`) appears in **both** spec formats. It is gate output, not a depth-gated rigor section, so it is not one of the 5 and Light-depth saves do not skip it. Any `open — signed off` row forces frontmatter `status: done_with_concerns`. A spec with a dimension that is neither `concrete` nor `open — signed off` is an invalid wrap — the Step 6 gate blocks saving it ([`orchestration-steps.md`](orchestration-steps.md) § "Concreteness gate").

---

## Operator-grade spec format (Medium/Deep depth)

```markdown
---
skill: discover
version: 1
date: {{today}}
status: done | done_with_concerns | blocked | needs_context
stack: meta
review_surface: md         # html | md | none
decision_state: pending    # pending | approved | denied | suggested | not_required
review_tool: inline        # proof | inline | roughdraft | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
mode: idea-stage | plan-review
plan-review-mode: scope-expansion | selective-expansion | hold-scope | scope-reduction  # only when mode = plan-review
light_spec: false
---

# [Feature Name] Specification

## Premise Challenge

State of premises the user must agree with before solution generation. Each line names a premise and the user's stance:

- **Right problem?** [The actual outcome being optimized for, restated in one sentence — not the proposed solution.]
- **Outcome vs proxy?** [What is the user-visible outcome, not the metric proxy. Example: "user keeps their place in the document on reload" vs "we add session storage".]
- **Do nothing?** [What happens if we ship nothing — measurable pain today, or hypothetical?]
- **What partially solves this?** [Existing code, tools, or processes that already cover some of the surface. Re-scope from that delta, not from zero.]
- **Distribution path?** [For new artifacts — CLI, library, mobile app: how will users actually get it? If "we'll figure that out" — flag and scope distribution before build.]

If a premise was challenged and adjusted during the session, record the adjustment here. If a premise was uncomfortable for the user but they confirmed it — record that too.

## Dream State Mapping

Three-column delta — forces forward-time thinking before locking architecture:

| CURRENT STATE | THIS PLAN (proposed) | 12-MONTH IDEAL |
|---|---|---|
| [What exists today, including pain] | [What this spec ships] | [What "great" looks like a year out] |

The 12-month column is the corrective lens — if "this plan" looks orthogonal to "12-month ideal," the proposed plan is locally rational but globally wrong. Surface the gap before building.

## Decided Approach

[High-level approach with key decisions]

## Implementation Alternatives (MANDATORY — minimum 2-3 distinct approaches)

Equal-weight presentation. Do NOT default to the smaller, safer option in the recommendation row just because it's smaller — recommend whichever serves the stated outcome (often the rewrite, given AI compresses implementation).

| Alternative | Effort | Risk | Pros | Cons | Reuses Existing |
|---|---|---|---|---|---|
| **A. Minimum-viable** | S/M | Low | [pros] | [cons] | [what existing code/system this leverages] |
| **B. Ideal architecture** | M/L | Med | [pros] | [cons] | [reuse story] |
| **C. [optional middle ground]** | M | Med | [pros] | [cons] | [reuse story] |

**Recommended: [A or B or C]** — [one-paragraph reason, citing the stated outcome and the equal-weight rule]

If only one alternative was generated, this section MUST flag the reason: "Only one viable path because [hard constraint X]." Premature single-option lock-in is the failure mode this section exists to prevent.

## Temporal Interrogation

Walk forward through implementation time and surface ambiguities the implementer will hit at each stage. Resolve them HERE in the spec, not during build.

- **Hour 1 (foundations / scaffold):** [What unblocks setup? File paths, package boundaries, schema baseline. Ambiguities to lock now.]
- **Hour 2-3 (core logic):** [What's the load-bearing logic? What edge cases will the implementer ask about?]
- **Hour 4-5 (integration):** [How does this slot into existing systems? Auth, routing, data flow? Where will integration assumptions break?]
- **Hour 6+ (polish / tests / docs):** [What's the test strategy? What docs need to land? What's the "done" bar beyond "works on happy path"?]

Each row that the spec leaves unresolved gets carried into the build as an unprompted decision the implementer will make alone. Resolve them now.

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| [Topic] | [What] | [Why] |

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

## Concreteness Checklist

Step 6 gate state at wrap. Each of the six core requirement dimensions is `concrete` or `open — signed off`; only signed-off rows carry a sign-off note. Any `open — signed off` row → frontmatter `status` MUST be `done_with_concerns`.

| Dimension | State | Resolution / sign-off note |
|---|---|---|
| Problem | concrete | [the decision or section that made it concrete] |
| Audience | concrete | |
| Constraints | concrete | |
| Success criteria | concrete | |
| Scope | concrete | |
| Anti-goals | open — signed off | [operator's per-dimension sign-off, verbatim or paraphrased, with what would close it] |

## Open Branches (operator-overridden)

Only present when the session exited via operator override on the resolution-exit condition (Step 6). Each entry is a load-bearing decision-tree branch the operator chose to skip — separate from Open Questions (general unresolved items). If this section is non-empty, frontmatter `status` MUST be `done_with_concerns`.

**Branch vs. question** (routing rule): a *branch* is a decision-tree node where discover offered a recommended answer and the operator chose not to ratify it. A *question* is an unresolved item where no recommendation was made (insufficient context, deferred to a future session, scope-out-of-bounds). When in doubt: did discover offer a recommendation this session? Yes → branch. No → question.

- [Branch description] — [what would have resolved it: more evidence, a follow-up session, a decision the operator deferred]

## Implementation Notes

[Technical details, gotchas, dependencies]

## Verdict

One line, mode-mapped:

- **Idea-stage** (mode: idea-stage) — `VALIDATED` (idea-critic PROCEED + alternatives clear) / `NEEDS_MORE_VALIDATION` (idea-critic PUSH_BACK; demand evidence still missing) / `PIVOT` (the right problem is adjacent to the originally-stated one — see Premise Challenge)
- **Plan-review** (mode: plan-review) — based on the chosen plan-review-mode:
  - `BUILD_AS_PROPOSED` — plan stands as-is
  - `CHERRY-PICK_EXPANSIONS` — plan stands plus the named expansions in Implementation Alternatives B/C
  - `EXPAND_BEYOND_PROPOSED` — recommend a strictly larger plan (SCOPE EXPANSION mode only)
  - `HOLD_AS_PROPOSED` — keep scope, no expansions; risk-notes attached (HOLD SCOPE mode)
  - `HOLD_WITH_RISK_NOTES` — keep scope but flag execution risks the spec must address
  - `CUT_TO_MINIMUM` — strip to load-bearing core (SCOPE REDUCTION mode)
  - `CUT_AGGRESSIVELY` — recommend cuts even beyond the user's framing

The Verdict line maps to the Completion Status Protocol — `VALIDATED` / `BUILD_AS_PROPOSED` etc. → `done`; verdicts with caveats → `done_with_concerns`; `NEEDS_MORE_VALIDATION` → `needs_context`; irreconcilable inputs → `blocked`.

## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
```

**Single verdict, two surfaces:** the verdict stated in conversation at Step 6 persists verbatim to the `## Verdict` section of the saved artifact — same enum, stated once in conversation, recorded once in artifact. There are not two verdicts.

---

## Light-depth compact spec format

Light scoping (Adaptive Depth row 1: clear task, well-defined scope, existing codebase) skips the 5 mandatory sections explicitly. Compact format:

```markdown
---
skill: discover
version: 1
date: {{today}}
status: done | done_with_concerns | blocked | needs_context
stack: meta
review_surface: md         # html | md | none
decision_state: pending    # pending | approved | denied | suggested | not_required
review_tool: inline        # proof | inline | roughdraft | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
mode: idea-stage | plan-review
light_spec: true
---

# [Feature Name] Specification

## Problem Statement
[One paragraph]

## Decided Approach
[High-level approach]

## Key Decisions
| Decision | Choice | Rationale |
|---|---|---|

## Edge Cases
- [Scenario]: [Handling]

## Open Questions
- [ ] [Unresolved items]

## Concreteness Checklist

- Problem: concrete
- Audience: concrete
- Constraints: concrete
- Success criteria: concrete
- Scope: concrete
- Anti-goals: open — signed off ([operator's per-dimension sign-off])

## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
```

Don't apply Premise Challenge or Dream State Mapping to a "add a dark mode toggle" scope — the rigor structure is for Medium/Deep work where the user is making strategic calls. The Concreteness Checklist stays even here: it is the Step 6 gate state, and Light depth runs the gate too — any `open — signed off` line forces `status: done_with_concerns`.

---

## Contract format (scope-locking)

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

### Writing good contract clauses

**GOAL** — include a number: "handles 50K req/sec" not "handles high traffic". User-visible outcome: "user can filter by date, status, assignee" not "add filtering".

**CONSTRAINTS** — only hard, non-negotiable limits. Technology: "must use existing ORM". Scope: "under 200 lines, single file". Compatibility: "backwards compatible with v2 API".

**FORMAT** — exact file structure: "single file: `rate_limiter.py`" not "a Python file". Include: "type hints on all public methods, 5+ tests". Exclude: "no comments explaining obvious code".

**FAILURE** — the key innovation. How could this "technically work" but be wrong?
- Missing edge case: "no test for empty input"
- Performance miss: "latency exceeds 1ms on synthetic load"
- Silent failure: "swallows errors without logging"
- Incomplete: "doesn't handle concurrent access"
- Over-engineered: "adds abstraction layers not required by GOAL"

### Verification template (include when handing off to an implementing agent)

```markdown
## Contract Verification

- [ ] FAILURE 1: {condition} → VERIFIED: {how you confirmed it passes}
- [ ] FAILURE 2: {condition} → VERIFIED: {how you confirmed it passes}
- [ ] GOAL metric met: {evidence}
- [ ] All CONSTRAINTS respected: {confirmation}
- [ ] FORMAT matches spec: {confirmation}
```

---

## Handoff plan format (fresh-agent transfer)

**When:** the session converged and the next consumer is a *different* agent or a *future* session — **not** the operator continuing in this conversation (decisions live in chat), and **not** a downstream in-context skill (`architect-system` / `breakdown-tasks` read the conversation directly). Triggered by "hand this off" / "write a handoff" / "prep this for another agent" — or a session ending with work a fresh agent will resume. The discriminator is *who picks this up next*: a context that wasn't in this conversation.

**Not the operator-grade spec; not breakdown-tasks.** The spec is a *descriptive audit-trail* of a converged decision (premise / dream-state / alternatives), written for the operator. `breakdown-tasks` is a *sized eng-task graph* (acceptance criteria, dependencies, risk-order → `tasks.md`) for execution. A handoff plan is a *forward-looking, path-free work-transfer packet*: where we are, what's locked, the next concrete actions, and the minimal context a fresh agent needs to not re-ask or redo. Its next-actions are **coarse — skill/decision-level** ("run `architect-system` in a fresh session on the data model", "validate pricing with 3 customers"), not sized tasks. The receiving agent runs `breakdown-tasks` when it needs an execution graph.

**Path-free + clipboard-ready.** Write it so it can be pasted into a fresh session with no filesystem assumptions. Reference prior decisions and artifacts by *content*, not only by path — if a path is load-bearing, state what it contains so the handoff stands alone. **Emitted inline by default** (like Contract); persist into the spec's Implementation Notes or a saved file only if the operator asks.

```markdown
## Handoff — [Goal in one line]

**Outcome:** [what success looks like — one sentence, user-visible.]
**Status:** converged | converged-with-open-branches · **Depth reached:** Light | Medium | Deep

### Decisions locked (do NOT re-litigate)
- [Decision] — [one-line rationale]

### Where we are
[2-4 sentences: what's decided, what already exists, what's been tried. Name the prior pain or constraint so the fresh agent starts from the delta, not from zero.]

### Next actions (ordered)
1. [Concrete next step — skill or decision level, not a sized task] → [done signal]
2. [...]

### Open branches / unresolved
- [Branch] — [what would resolve it: evidence, a decision, a follow-up session]

### Context a fresh agent needs
- **Read:** [artifact / file] — [what it contains and why it matters]
- **Don't redo:** [what's already settled, or tried-and-rejected]
- **Gotchas:** [non-obvious constraints]
```

If the session exited with operator-overridden branches or signed-off-open dimensions (Step 6), carry them verbatim into **Open branches / unresolved** — a handoff that hides unresolved branches makes the fresh agent re-discover them.

---

## Out-of-scope persistence (institutional memory)

When features are explicitly scoped out, write to `docs/forsvn/artifacts/meta/out-of-scope/[kebab-case-name].md`:

```markdown
# [Feature/Approach Name]
**Decided:** [date]
**Context:** [what was being discussed when this was scoped out]
**Decision:** Not pursuing because [reason from conversation]
**Revisit if:** [condition that would change the decision]
```

Create the directory if missing. Prevents future sessions from re-asking decided questions.

## Experience doc append (learning flywheel)

Append Q&A to `docs/forsvn/experience/{domain}.md` after each session:

```markdown
## {Task Name} — Decisions ({date})

Q: {question}
A: {user's answer}
Rationale: {why this matters for future tasks}
```

Flywheel: each session adds context → future sessions need fewer questions → quality improves immediately.
