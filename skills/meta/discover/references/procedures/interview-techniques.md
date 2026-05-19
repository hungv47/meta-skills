---
title: Discover — Interview Techniques + Question Delivery
lifecycle: canonical
status: stable
produced_by: discover
load_class: PROCEDURE
---

# Interview Techniques + Question Delivery

**Load when:** Step 4 Conversation — the orchestrator is constructing questions for any round. Use these techniques naturally; don't announce them.

---

## Interview techniques

**Why Chains** — drill past surface answers.
- "We need real-time updates." → "Why real-time?" → "Users check every few minutes." → "So 30s polling works?" → "Actually, yes."

**Past Behavior Probes** — past behavior reveals real needs; future descriptions reveal aspirations.
- "What are you/users doing today to solve this?"

**Daily Use Visualization** — concrete usage, not abstract feature lists.
- "Walk me through a typical day where you'd use this. What triggers you to open it?"

**Forced Tradeoffs** — forced choices reveal true priorities.
- "If you could only keep 2 of these 4 features, which 2?"

**Failed Attempt Archaeology** — past failures contain internalized constraints.
- "Have you tried this before? Used a tool for it? What was wrong?"

**Success Criteria Grounding** — concrete success picture, not vague outcome.
- "If this ships and works perfectly, what's the first thing you'd notice is different?"

**Should-Want Detection** — watch for the user telling you what sounds "correct" rather than what they actually need:
- Overly formal or buzzword-heavy language
- Features described from elsewhere without connection to specific pain
- Quick, confident answers to complex questions (real complexity produces hesitation)
- Answers that don't connect to any user story or past experience

When detected, switch to probing actual needs (Past Behavior Probes + Failed Attempt Archaeology).

## Question delivery — two tools

**`AskUserQuestion` tool** — clickable options with descriptions.
- Best for 2-4 concrete choices with real tradeoffs
- Mark recommended option ("(Recommended)" suffix); recommendation reason in `description`
- Use `preview` for comparing code/architecture
- Use `multiSelect: true` for non-exclusive choices
- "Other" is always available for free text

**Chat questions** — plain conversational.
- Best when answer space is wide open or you're following a thread deeper (why chains, past behavior, premise challenges)

Most sessions mix both. Concrete options → tool; exploring → just ask.

## Pacing

- 2-4 questions per round
- Each targets 2-4 decision points with real tradeoffs
- State which choice you recommend and why (see `communication-discipline.md` §"Always recommend while asking")
- Batch up to 4 questions **on one decision-tree branch** into a single AskUserQuestion call (depth-first dependency-walk — batching is the *width* at each node, not a shortcut around the walk; questions whose answers depend on a yet-unresolved upstream branch wait their turn)
- Briefly acknowledge answers each round; track clarity internally

## Question formats

### Assumption-surfacing format (best for scoping — makes silent assumptions visible)

```
Q1 (highest impact): Should this be a REST API or GraphQL?
My default assumption: REST, since the existing codebase uses Express.
Why it matters: GraphQL would require adding apollo-server and
restructuring the resolver layer — completely different implementation path.
```

Maps naturally to `AskUserQuestion` with 2 options: "REST (Recommended)" + alternative, rationale in descriptions. Chat works fine too — use judgment.

### Options format (best for design decisions with clear tradeoffs)

```
Question: "When a background sync fails, how should we handle it?"
Options:
1. Silent retry (3x with backoff) — User unaware, but may see stale data
2. Toast notification — User informed but may be annoyed
3. Badge indicator — Subtle, user can investigate when ready
Recommended: Option 1 — most sync failures are transient
```

Natural fit for `AskUserQuestion` — options become clickable choices with tradeoff descriptions.

## Depth-format pairing

At **Light depth** (scoping): prefer assumption-surfacing — it's the key innovation that prevents silent assumption failures.

At **Medium / Deep depth**: mix both formats per question. Assumption-surfacing for the load-bearing scoping decisions; options format for design tradeoffs with clear alternatives.

## Question routing by domain

For specific question banks per domain (data/state, errors, UX, security, performance, integration, business logic, intent alignment), load [`../question-bank.md`](../question-bank.md) — domain-indexed extended probing questions. The question-bank is LAZY (load only when a coverage zone hits one of those domains), not always-on.
