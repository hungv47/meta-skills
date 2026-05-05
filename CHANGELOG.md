# Meta Skills — Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning is [SemVer](https://semver.org/spec/v2.0.0.html) — major.minor.patch.

This file tracks stack-level releases. SKILL.md files describe current behavior; this file documents what changed and when.

---

## [1.0.0] - 2026-05-05

Initial public release. Process-layer skills that wrap around any domain skill — improving input quality, decision quality, or output quality.

### Added

**Skills (4)**

- `discover` — Conversational discovery, adaptive depth (3-5 questions for clear tasks, multi-round interviews for vague ideas). Optional `.agents/spec.md` save. Cross-stack — invoked before any non-trivial build.
- `agents-panel` — Multi-perspective debate (3 agents × 3 rounds) or poll (10 agents × 1 pass) on a specific decision. Standalone or sub-routine for other skills hitting complex forks.
- `task-breakdown` — Decomposes architecture/spec into buildable tasks with stable IDs, deps, acceptance criteria, autonomy classification (AFK / HITL). Produces `.agents/tasks.md`. Execution protocol for downstream consumers ships separately at `references/execution-protocol.md`.
- `fresh-eyes` — Independent post-implementation review with dynamic agent spawning (reviewer + resolver). Auto-triggers for security, auth, crypto, money, PII.

**Architectural patterns**

- **Pre-Dispatch protocol** — canonical spec at `references/pre-dispatch-protocol.md` governing every skill in the stack (and across research/marketing/product). Cold Start (3-7 bundled questions, one round-trip) when context is missing; Warm Start (summary + optional probe) when artifacts/experience cover what's needed. `discover` exempt — IS the multi-round interview.
- **Experience layer** (`.agents/experience/{domain}.md`) — append-only Q&A substrate written by every skill on cold-start, read before asking. Domains flexible (product, audience, business, brand, goals are starters; new domains added when topics are orthogonal). Most-recent-wins read; append-only write preserves audit trail across user pivots.
- **Status protocol** — every skill emits explicit `DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT` status. Artifact frontmatter `status:` field uses the same values. Mandated by root `CLAUDE.md`.
- **Multi-agent orchestration** — every skill except `discover` uses Layer 1 (parallel) → Layer 2 (sequential) → Critic gate (PASS/FAIL with max 2 rewrite cycles).
- **Learned rules** — `.agents/meta/learned-rules.md` accumulates user corrections across sessions; meta-skills read relevant rules before dispatching.

**Cross-stack capabilities**

- `agents-panel` can be invoked as a sub-routine by any skill hitting a multi-perspective decision point (typical callers: `prioritize`, `system-architecture`, `discover`).
- `task-breakdown` consumes `architecture/system-architecture.md`, `.agents/spec.md`, `.agents/product/flow/*.md` from product-skills.
- `fresh-eyes` runs after any domain skill — system-architecture, task-breakdown, code-cleanup, raw implementation.
