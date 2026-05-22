---
title: Discover Playbook
lifecycle: canonical
status: stable
produced_by: discover
load_class: PLAYBOOK
---

# Discover Playbook

## Why this skill exists

The gap between "stated requirements" and "true needs" is where projects fail silently. The user describes what they think they want; the agent builds what was described; the artifact ships and is technically correct but solves the wrong problem. The cost compounds — every downstream skill (system-architecture, task-breakdown, implementation) inherits the bad framing, and you don't discover the miss until weeks later when the operator says "this works but it doesn't feel right."

Discover exists to close that gap through *conversation* — not formal phases, not plan mode, not a 500-line spec nobody reads. Talk until clear, then build. The skill's job is to surface what the user would silently get wrong, push back on weak premises, and produce shared clarity. The artifact is optional; the alignment is the output.

The cost is real but small (sonnet, ~$0.03-0.10 per session). The asymmetry vs shipping the wrong thing makes it the default before any non-trivial build.

## Methodology

**Conversation IS the alignment, not a step toward it.** Decisions live in chat by default. Saving a spec is optional — only when the user asks, the session is ending and decisions would be lost, output is needed by someone outside the conversation, or a natural milestone is reached. Most sessions end without writing anything. That's correct.

**Adaptive depth — auto-calibrated, never mode-switched.** A clear task with an existing codebase gets 3-5 questions; a vague greenfield idea gets multi-round interview; a feature with some ambiguity sits in between. The skill reads signals from the request (codebase context, idea framing, operator language) and picks depth before asking anything. The user can override ("quick scope", "deep interview", "just ask 3 questions") but the default is the right answer most of the time.

**Two jobs, two modes — never silently mixed.** Idea-stage (user brings unstructured idea, no prior plan) routes through the Idea Critic Gate (Step 2.7) that scores demand-side validation. Plan-review (user brings existing plan/spec/sketch and wants to test it) skips idea-critic and runs the 4-Mode Framework — SCOPE EXPANSION / SELECTIVE EXPANSION / HOLD SCOPE / SCOPE REDUCTION — picked once and locked for the session. Mixing produces mush; the body's Step 2.5 enforces detection upfront.

**Premise challenge before solution generation.** Three questions before diving in: Right problem? Do-nothing baseline? What already exists? Weak premises produce precise-looking nonsense — the framing-checkpoint after the user's first substantive answer catches buzzwords, hypothetical vs real behavior, and hidden assumptions. The skill says so before moving on; doesn't block, advises.

**The blunt-peer stance is load-bearing.** Banned phrases enforce it: no "interesting approach," no "many ways to think about this," no "you might want to consider," no "that could work," no "I can see why you'd think that." These are sycophantic hedges, not analysis. The blunt-peer rule means: take a position on every answer, state what evidence would change your mind, recommend a choice on every question. "I think X because Y. What would change my mind: Z." Two sentences. If you can't name what would change your mind, your position isn't a position — it's a guess wearing a position's clothes. Asking without recommending offloads the thinking onto the user.

**Equal-weight rule (operator-grade discover).** When generating Implementation Alternatives, do NOT default to the smaller/safer option in the recommendation just because it feels cautious. AI compresses implementation; the rewrite often serves the stated outcome better than the patch. Recommend whichever serves the goal — and say so explicitly with a reason. The Step 2.5 plan-review SCOPE EXPANSION / SCOPE REDUCTION modes apply this rule literally.

**Resolution-exit, not patience-exit.** The session exits when the decision tree is *resolved* — not when the user runs out of patience. Resolved means: every load-bearing branch has a recommended answer with a cited reason; every Premise Challenge premise has the user's stance recorded; at least one piece of evidence has surfaced that wasn't already in the user's head at the start. If you can't name what this session changed, you didn't grill — you transcribed. The 3-clause condition has N/A cases for Light-depth, Contract-format saves, Plan-review HOLD SCOPE mode, and Premise-skipped sessions.

## Principles

- **Just talk.** No plan mode, no formal phases, no mandatory artifacts. Conversation context > documents.
- **The blunt peer wins.** State disagreements directly. Praise outcomes, never intentions. Agreement doesn't need to be performed.
- **Past behavior beats future predictions.** "What are users doing today?" reveals real needs; "What might they want?" reveals aspirations.
- **Forced tradeoffs reveal priorities.** "If you could only keep 2 of these 4 features…" surfaces what's actually load-bearing.
- **Failed attempts are gold.** "Have you tried this before? What was wrong?" — past failures contain the constraints the user has internalized.
- **Take the position OR figure out what evidence you'd need to.** Asking without recommending is offloading.
- **Operator-craft stance is read first** (every non-trivial invocation): ceo-cognitive-patterns + yc-six-forcing-questions + minimalist-entrepreneur. Stance, not checklist. Trivial scoping skips it.
- **Founder-domain frames load only on product-context match.** Match by job-shape, not keyword. B2B-SaaS founder asking pricing questions loads both b2b-saas-bootstrap.md AND pricing-defaults.md.
- **The best reward for a good answer is a harder follow-up, not praise.**

## History / origin

- **v3.2.1 (current):** mature multi-step interview protocol. Step 2.5 mode-detection + plan-review 4-mode framework added. Step 2.7 idea-critic gate. Step 6 resolution-exit condition with 3-clause + N/A cases. Operator-grade spec format with 5 mandatory sections (Premise Challenge / Dream State Mapping / Implementation Alternatives / Temporal Interrogation / Verdict). Light-depth exception for compact specs. Contract format separate. 9 operator-playbooks under `references/operator-playbooks/` (ceo-cognitive-patterns / yc-six-forcing-questions / minimalist-entrepreneur as always-on stance; 6 founder-domain frames loaded on product-context match).
- **Phase 1E+ refactor (May 16, 2026, still v3.2.1):** body trimmed 611 → ~240 lines per the v6 program. Output formats (operator-grade spec template + Light-depth compact + Contract format + Writing good clauses + Verification + out-of-scope persistence + experience doc append) extracted to `procedures/output-formats.md`. Interview techniques (Why Chains / Past Behavior / Daily Use / Forced Tradeoffs / Failed Attempt / Success Criteria / Should-Want Detection + Question delivery + Question formats + Pacing) extracted to `procedures/interview-techniques.md`. Communication Discipline (banned phrases + take-a-position rule + always-recommend rule + pushback patterns) extracted to `procedures/communication-discipline.md`. Step 2.7 idea-critic dispatch details extracted to `procedures/idea-critic-dispatch.md`. Step 1 context-gathering + operator-craft stance load matrix + founder-domain frame matrix extracted to `procedures/context-gathering.md`. Anti-Patterns + Edge Cases extracted to `anti-patterns.md`. The 9 operator-playbooks + question-bank + example-contracts + idea-critic agent ALL unchanged. No behavior change — pure body-diet + chain hardening. No version bump — refactor lands on the meta-skills 2.0 base as a commit, not a release.

## When NOT to use this skill

- **Metric decline or root-cause** → `diagnose`. Different rubric — diagnose is hypothesis-driven causal analysis on a known-bad metric; discover is forward-looking scope/idea clarification.
- **Multi-perspective debate on a decision** → `debate-agents`. Discover INVOKES agents-panel as sub-routine (Step 5) when a single decision needs multiple perspectives; the broader conversation stays in discover.
- **Decompose a known scope into tasks** → `breakdown-tasks`. Discover ends when scope is clear; task-breakdown takes it from there.
- **Technical design when scope is locked** → `architect-system`. Discover doesn't design; it scopes.
- **Trivial work** (typo, log line, config tweak) — discovery overhead exceeds value. Just do it.
- **You already know what to build** — skip discover; go to system-architecture or task-breakdown directly.

## Further reading

- [`question-bank.md`](question-bank.md) — extended probing questions by domain (data/state, errors, UX, security, performance, integration, business logic, intent alignment)
- [`example-contracts.md`](example-contracts.md) — worked contract examples
- [`operator-playbooks/`](operator-playbooks/) — 9 practitioner-grade frames (3 always-on stance + 6 founder-domain loaded on product-context match)
- [`procedures/context-gathering.md`](procedures/context-gathering.md) [PROCEDURE] — Step 1 scan targets + operator-craft stance load + founder-domain frame matrix
- [`procedures/communication-discipline.md`](procedures/communication-discipline.md) [PROCEDURE] — banned phrases + take-a-position rule + always-recommend rule + pushback patterns
- [`procedures/interview-techniques.md`](procedures/interview-techniques.md) [PROCEDURE] — Why Chains / Past Behavior / Daily Use / Forced Tradeoffs / Failed Attempt / Success Criteria / Should-Want Detection + Question delivery + Question formats + Pacing
- [`procedures/idea-critic-dispatch.md`](procedures/idea-critic-dispatch.md) [PROCEDURE] — Step 2.7 dispatch details (Input Contract, on-PROCEED, on-PUSH_BACK, skip conditions)
- [`procedures/output-formats.md`](procedures/output-formats.md) [PROCEDURE] — operator-grade spec template + Light-depth compact format + Contract format + Writing good clauses + Verification template + out-of-scope persistence + experience doc append
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — 10 interview anti-patterns + edge cases
- [`agents/idea-critic.md`](../agents/idea-critic.md) — single sub-agent dispatched in Step 2.7 on idea-stage sessions
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) [PROCEDURE] — fast/standard/deep semantics (Light/Medium/Deep depth map)
