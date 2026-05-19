# Executive Brief — FORSVN Agent Stack

## Mandate

Turn the current skill collection into a coherent agent system: one front door, shared memory, clean skill names, real execution paths, and a feedback loop that makes every later run better than the last.

The implementation agent must not start by renaming files or adding skills. It must first interview the user and lock the product decisions below.

## First Move — Interview Before Implementation

Ask the user:
- What should ship first: `/forsvn`, `.forsvn` state, skill renaming, evaluation loops, or production skills?
- Should `/forsvn` be the default front door while direct skill calls remain supported?
- Is `/forsvn` allowed to be the branded exception to verb-first naming?
- Should old skill names remain as aliases during migration?
- What is the canonical state path: `.forsvn/`, `skills-resources/`, or `.forsvn/` with legacy import from `skills-resources/`?
- Which user journey matters most: "I don't know where to start", "make assets", "evaluate results", or "clean up my stack"?

The interview output must be a one-page decision memo: locked scope, non-goals, naming policy, state path, migration plan, acceptance checks.

## Product Thesis

The current stack has strong specialist skills but weak system shape. Users must know which skill to call, repeat context across skills, manually bridge brief → execution → eval, and remember where artifacts live.

The better product is:

1. `/forsvn` understands intent and routes the user.
2. Shared context prevents repeated cold starts.
3. Verb-first skill names make actions obvious.
4. Every artifact has provenance and a canonical home.
5. Production skills create real outputs, not just briefs.
6. Evaluation skills turn real-world results into reusable learning.

## Implementation Assumption

Assume nothing in this roadmap has been implemented.

Some source files contain old labels like `STATUS: COMPLETE` or `SUPERSEDED`. Ignore those for planning. Treat them as historical notes from prior consolidation attempts, not as implementation truth.

The implementation agent must verify repo state before editing, but it should not skip an idea just because the source file claims it was done.

## Source Coverage

This brief pack consolidates all ideas from:
- `IDEA-2.md` — copy/ad upgrades, Pangram, self-improvement gaps
- `IDEA-3.md` — service extraction and fresh-eyes closeout
- `IDEA-4*.md` — production, evaluation, feedback architecture
- `IDEA-5.md` — product context, AI SEO, Seven Sweeps, ICP rigor, programmatic SEO
- `ideas.md` new items — `/forsvn`, `.forsvn`, skill audit, humanmaxxing, platform-specific strategy, verb-first naming

These briefs describe the desired product architecture and backlog. They are not proof that files exist or that any work has landed.

## Brief Pack

- `01-foundation-forsvn-state.md` — `/forsvn`, interview protocol, shared context, `.forsvn`, experience layer
- `02-skill-surface-naming.md` — verb-first naming, aliases, SKILL.md cleanup, frontmatter audit
- `03-capability-upgrades.md` — copy, ads, research, SEO, platform strategy, humanmaxxing
- `04-production-layer.md` — produce assets/video, publish social, human approval gates
- `05-evaluation-learning-loop.md` — eval skills, dashboards, critic overrides, provenance, cross-skill learning
- `06-operator-quality-integrations.md` — fresh-eyes, service extraction, code cleanup, Pangram/API integrations
- `07-source-coverage-map.md` — explicit mapping from every source file to the brief pack

## Recommended Implementation Order

1. Interview and lock decisions.
2. Build minimal `/forsvn` router with backward-compatible direct skill calls.
3. Establish canonical state/artifact model.
4. Add aliases and verb-first naming.
5. Clean skill surfaces and frontmatter.
6. Add capability upgrades that do not require external APIs.
7. Add production skills with preview/export fallback.
8. Add eval and learning propagation.
9. Add external integrations.

## Non-Goals

- Do not rename everything without aliases.
- Do not force full automation before manual/export workflows work.
- Do not add external API dependencies to the core path.
- Do not scatter artifacts across multiple state roots without a migration rule.
- Do not let `/forsvn` become a passive brainstorming skill. It must route, dispatch, resume, or create a concrete artifact.
