---
name: discover
description: "Conversational discovery — adapts from quick scoping (3-5 questions) to deep interviews (multi-round). Talk until we're clear, then build. Produces inline decisions; optionally saves spec.md or scope contract. Not for multi-perspective debate (use agents-panel). Not for decomposing work (use task-breakdown). Not for diagnosing a known metric decline or root-causing a problem (use diagnose)."
argument-hint: "[idea, feature, or task to clarify]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "3.2.1"
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
    - references/operator-playbooks/*.md
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
- **Learned rules**: `.agents/skill-artifacts/meta/records/learned-rules.md` for behavior corrections
- **Out-of-scope decisions**: `.agents/skill-artifacts/meta/out-of-scope/` — don't re-ask about rejected approaches unless user raises them
- **Project conventions**: skim `CLAUDE.md`

Anything found here is a question you don't ask.

**Operator-craft stance load** (every non-trivial invocation, regardless of domain):

Read these three before the first question — they shape *how* you push back, not *what* you ask:

- `references/operator-playbooks/ceo-cognitive-patterns.md` — 18 named instincts (Bezos / Grove / Munger / Jobs / Horowitz / Hastings / Altman / Rams). Stance, not checklist.
- `references/operator-playbooks/yc-six-forcing-questions.md` — Q1-Q6 demand-reality framework with smart routing by product stage.
- `references/operator-playbooks/minimalist-entrepreneur.md` — processize-before-productize, sell-before-scale, red/green-flags rubric.

Trivial scoping (clear task, existing codebase, well-defined scope per the Light depth row) skips this load — the playbooks earn their token cost on Medium/Deep work where the user is making strategic calls.

**Founder-domain frame load** (only when product-context matches):

Match the product-context against these frames; load the matching one:

| Trigger | Frame |
|---|---|
| Consumer mobile/web app, app-store distribution, $0→$50M growth questions | `references/operator-playbooks/consumer-app-growth.md` |
| Physical product / DTC e-commerce / Shopify-stack brand | `references/operator-playbooks/dtc-brand-100m.md` |
| B2B SaaS for human/team users (not pure infra) | `references/operator-playbooks/b2b-saas-bootstrap.md` |
| Founder has shipped before; second-time discipline questions | `references/operator-playbooks/second-time-founder-discipline.md` |
| Pricing / monetization questions, free-tier debate | `references/operator-playbooks/pricing-defaults.md` |
| AI agent discoverability, LLM-readable docs/pricing surfaces | `references/operator-playbooks/ai-era-discoverability.md` |

Match by *job-shape*, not keyword — a B2B-SaaS founder asking pricing questions loads both `b2b-saas-bootstrap.md` and `pricing-defaults.md`. No match → no founder-domain frame loaded; the operator-craft stance covers it.

If a frame's `last_verified` exceeds 90 days, flag it inline ("frame may be stale; verify before relying on numeric thresholds") but still apply the stance.

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

### Step 2.5: Mode Detection — Idea Stage vs Plan Review

After the premise check, classify which job discover is doing this session. The two jobs are different enough that mixing them produces mush.

**Idea stage** — the user is bringing an unstructured idea: "I want to build X," "I have an idea for a tool that…", "thinking about a feature where…". No prior plan, sketch, or spec the conversation is anchored to. Discover proceeds to Step 2.7 (Idea Critic Gate) before opening coverage zones.

**Plan review** — the user is bringing an existing plan, spec, sketch, ADR, or detailed proposal and wants to test it. Signal includes: linking or pasting an existing artifact (`.agents/skill-artifacts/meta/specs/*`, `.agents/skill-artifacts/meta/sketches/*`, an ADR, a design doc, a Linear ticket body), saying "review this plan," "should we expand/cut this," "is this the right scope," or pasting a numbered/structured plan into the conversation. Discover proceeds to mode-pick (below) before coverage zones; idea-critic does NOT fire (it scores idea-stage demand validation, not plan scope).

**Detection is a one-shot read of the user's first substantive turn.** If ambiguous, ask one question: "Is this a fresh idea you want to scope, or an existing plan you want me to review?" — chat format, recommend the read you think is more likely, one line of reason. Don't over-invest in detection; the user can correct mid-session and discover re-anchors.

#### Plan-Review: 4-Mode Framework

When mode is `plan-review`, ask the user to pick one of four sub-modes upfront — once. Lock for the session. Do not silently drift between modes; if the user wants to switch, they say so, and discover re-anchors.

| Mode | Posture | When to recommend |
|---|---|---|
| **SCOPE EXPANSION** | Build the cathedral. Push scope up. Surface every reasonable expansion; recommend rebuild over patch when the rewrite is small and the existing scope undersells the goal. | User signals "I want to make this great," there's strong evidence the proposed scope is too small for the stated outcome, AI compresses implementation enough that a bigger rewrite is feasible. |
| **SELECTIVE EXPANSION** | Hold scope as the baseline. Surface expansions individually for cherry-pick. User accepts/rejects each one on its own merits. | User has a concrete plan they trust but is open to specific extensions. Default for "review my plan and tell me what's missing." |
| **HOLD SCOPE** | Make it bulletproof. Don't expand or reduce — interrogate the existing plan for hidden risks, missing edge cases, premise weakness, implementation traps. | User has shipped pressure or strong scope conviction; the question is execution quality, not scope debate. |
| **SCOPE REDUCTION** | Ruthless minimum-viable cut. Identify what's actually load-bearing for the stated outcome and propose cuts to everything else. Recommend cuts even when the user seems committed to a feature. | Time/budget pressure, MVP framing, "what's the smallest version of this that ships," or evidence the plan has padding masking the core. |

**Mode-pick mechanics:** Use `AskUserQuestion` with the 4 options. Pick a recommendation based on the signals above; mark it `(Recommended)` in the label; put the one-line reason in `description`. The user can pick "Other" with custom framing — common variants ("expand cautiously," "cut to v0 then expand later") map back to one of the four with a quick clarifying read.

**Equal-weight rule (load-bearing):** When the user picks SCOPE EXPANSION or SCOPE REDUCTION, do NOT default to the "smaller, safer" option in alternatives generation just because it feels cautious. AI compresses implementation; the rewrite often serves the stated outcome better than the patch. Recommend whichever serves the goal — and say so explicitly with a reason.

**Mode locks Step 7 Verdict.** The Verdict section in saved artifacts (Step 7) maps to the chosen mode:
- SCOPE EXPANSION / SELECTIVE EXPANSION → `BUILD_AS_PROPOSED` / `CHERRY-PICK_EXPANSIONS` / `EXPAND_BEYOND_PROPOSED`
- HOLD SCOPE → `HOLD_AS_PROPOSED` / `HOLD_WITH_RISK_NOTES`
- SCOPE REDUCTION → `CUT_TO_MINIMUM` / `CUT_AGGRESSIVELY`

For idea-stage sessions (no mode), Verdict maps to `VALIDATED` / `NEEDS_MORE_VALIDATION` / `PIVOT` per the idea-critic rubric.

### Step 2.7: Idea Critic Gate (idea-stage only)

When mode is `idea-stage`, run the idea-critic agent ONCE before opening coverage zones. The agent scores the user's substantive idea-statement against 5 red flags and 5 green flags ([`agents/idea-critic.md`](agents/idea-critic.md)), returns PROCEED or PUSH_BACK with cited flags.

**How to dispatch:** Call the agent via the Agent tool, passing all three Input Contract fields the agent declares:

- **`idea-statement`** — the user's substantive description of what they want to build, post-Premise Check (a one-paragraph summary of the user's first turn after the framing checkpoint, paraphrased faithfully — not the user's whole transcript).
- **`context-gathered`** — the orchestrator's serialized findings from §Step 1 (codebase signals worth flagging, relevant `.agents/experience/{domain}.md` Q&A, prior specs/sketches on the same idea if any, the operator-craft stance load already loaded by Step 1, and the founder-domain frame match if any).
- **`mode`** — literal string `idea-stage`.

The agent is single-shot — do not re-invoke per turn. Output is structured (Red Flags Detected / Green Flags Detected / Score / Verdict / Push-Back Routing / Change Log).

**On PROCEED:** Acknowledge any green flags inline ("the manual-loved-by-few signal is strong here"), note any single red flag as a watch-item (it didn't cross threshold but stays surfaced), and continue to Step 3 Adaptive Coverage Zones.

**On PUSH_BACK:** Do NOT proceed to coverage zones / alternatives generation. Surface the cited flags to the user in plain language, then read the agent's `## Push-Back Routing` output section and ask those questions to the user (one round). Treat the responses as new idea-statement input. Re-run idea-critic at most once after the user's clarifying answers. If still PUSH_BACK after one re-run, surface explicitly: "the idea is currently failing the demand-side validation rubric — recommend pausing here to gather evidence (manual-solve a few people, observe the community for complaints, find paid alternatives) before scoping further. Want to keep going with the rubric flagged, or pause?" The user can override; discover proceeds with `status: done_with_concerns` baked into the spec frontmatter if saved.

**Skip idea-critic when:**
- Mode is `plan-review` — wrong rubric for the input
- User explicitly says "skip the idea critic" / "I've already validated this" — record the override in the conversation log so the spec frontmatter records it
- Trivial scoping (Light depth — feature add to existing codebase) — the rubric is designed for blank-slate ideas, not feature scope inside an established product

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

**Banned phrases** — these are sycophantic hedges, not analysis. Never use:
- "interesting approach"
- "many ways to think about this"
- "you might want to consider"
- "that could work"
- "I can see why you'd think that"

If you find yourself reaching for one of these, you're avoiding the work of taking a position. Take the position instead. The user wants a blunt peer, not a yes-man.

**Take a position on every answer.** Don't restate what the user said as if it's insight. Don't list options without weighing them. State what you think AND state what evidence would change your mind. "I think X because Y. What would change my mind: Z." Two sentences. The "what would change my mind" part is non-negotiable — it's how the user knows your position is honest, not theatrical. If you can't name what would change your mind, your position isn't a position; it's a guess wearing a position's clothes.

**Always recommend while asking.** Every `AskUserQuestion` you emit carries an LLM-recommended answer with a one-line reason. Mark the recommendation with "(Recommended)" in the option label; put the reason in the option's `description`. Same rule for chat-format questions: state which option you recommend and why, in the same message. If you cannot recommend, you don't understand the question well enough to ask it — figure out what evidence you'd need to recommend, and ask for *that* first. Asking without recommending is offloading the thinking onto the user.

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
3. **Playbook-citation self-check**: before asking "ready to build?", verify — did the recommendation cite at least one applicable operator-playbook frame when one was loaded? If a founder-domain frame was loaded but no rule from it surfaced in the recommendation, you've ignored loaded context. Either cite the relevant rule, explain why the frame doesn't apply here, or revisit the recommendation. The frames exist to be *used*, not just read.
4. **Verdict assignment** — state the explicit verdict before asking the user to build:
   - Idea-stage: `VALIDATED` / `NEEDS_MORE_VALIDATION` / `PIVOT` based on the idea-critic outcome and alternatives clarity.
   - Plan-review: one of `BUILD_AS_PROPOSED` / `CHERRY-PICK_EXPANSIONS` / `EXPAND_BEYOND_PROPOSED` / `HOLD_AS_PROPOSED` / `HOLD_WITH_RISK_NOTES` / `CUT_TO_MINIMUM` / `CUT_AGGRESSIVELY`, mapped to the chosen plan-review-mode.
   The verdict is not optional — operator-grade discover ends on a clear decisional output. If you cannot pick one, the conversation isn't done; surface what's missing and continue.
   **Single verdict, two surfaces:** if the spec is saved (Step 7), this same verdict persists verbatim to the `## Verdict` section of the saved artifact — same enum, stated once in conversation, recorded once in artifact. There are not two verdicts; conversation Verdict and spec Verdict are one decision rendered in two places.
5. Ask: "Ready to build, or go deeper on anything?"

If the user says go, go. Don't pad.

### Step 7: Output

**Default: conversation context.** Decisions live in chat. The next skill (system-architecture, task-breakdown, direct implementation) reads everything discussed.

**Optional save points** — produce when:
- User explicitly asks ("save this to a spec")
- Session is ending and decisions would be lost
- Output is needed by someone outside this conversation
- Natural milestone reached and user confirms saving

**Save point formats:**

**Operator-grade spec format** (medium/deep depth — handoff to others, strategic calls being made). Includes 5 mandatory sections (Premise Challenge / Dream State Mapping / Implementation Alternatives / Temporal Interrogation / Verdict) — they are the operator-grade rigor structure and apply to every spec save AT MEDIUM/DEEP DEPTH.

**Light-depth exception** (compact spec format, frontmatter `light_spec: true`): light scoping (Adaptive Depth row 1: clear task, well-defined scope, existing codebase) skips the 5 mandatory sections explicitly and uses the compact format described after the heavyweight template below. Don't apply Premise Challenge or Dream State Mapping to a "add a dark mode toggle" scope — the rigor structure is for medium/deep work where the user is making strategic calls. Light specs use Problem Statement / Decided Approach / Key Decisions / Edge Cases / Open Questions only.

**Contract format** (scope-locking, separate template after the spec format) — the Contract format is unchanged from prior versions; Premise Challenge and Dream State Mapping do not apply (contracts are scope-locking, not idea-validating). Implementation Alternatives, Temporal Interrogation, and Verdict (in `BUILD_AS_PROPOSED` / `CUT_TO_MINIMUM` shape) DO apply when a contract is generated downstream of the operator-grade spec format.

```markdown
---
skill: discover
version: 1
date: {{today}}
status: done | done_with_concerns | blocked | needs_context
mode: idea-stage | plan-review
plan-review-mode: scope-expansion | selective-expansion | hold-scope | scope-reduction  # only when mode = plan-review
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
```

**Mandatory-sections rule (recap of the front-loaded scope):** the 5 mandatory sections above apply at medium/deep depth. Light-depth saves use the compact format described in the front matter of this Step (frontmatter `light_spec: true`); contract saves use the Contract format below — Premise Challenge and Dream State Mapping do not apply to contracts (scope-locking, not idea-validating).

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
| mode | auto-detected (Step 2.5) | "treat this as a plan review" / "fresh idea, ignore the existing spec" |
| plan-review-mode | user-picked when mode = plan-review | "expand the scope" / "hold scope, find risks" / "cut to minimum" / "cherry-pick expansions" |
| output | conversation | "save to spec" / "write a contract" / "save answers" |
| zones | auto (3-5 based on problem) | "focus on technical risks and UX" |
| idea-critic | auto-on for idea-stage | "skip the idea critic" (records override in spec frontmatter) |

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
- **`references/operator-playbooks/`** — Practitioner-grade operator frames loaded during Step 1 Context Gathering. 9 docs:
  - **Operator-craft (always-on stance)** — `ceo-cognitive-patterns.md` (18 named instincts) · `yc-six-forcing-questions.md` (Q1-Q6 demand reality) · `minimalist-entrepreneur.md` (processize → productize, sell-before-scale, red/green-flags rubric)
  - **Founder-domain (load on product-context match)** — `consumer-app-growth.md` · `dtc-brand-100m.md` · `b2b-saas-bootstrap.md` · `second-time-founder-discipline.md` · `pricing-defaults.md` · `ai-era-discoverability.md`
- **`agents/idea-critic.md`** — Single sub-agent dispatched in Step 2.7 on idea-stage sessions. Scores idea-statement against 5 red + 5 green flags; returns PROCEED or PUSH_BACK with cited flags. Threshold: ≥2 red OR <2 green → PUSH_BACK. Discover does not proceed to coverage zones / alternatives generation while PUSH_BACK is unresolved.
