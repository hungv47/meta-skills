# Meta Skills — Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning is [SemVer](https://semver.org/spec/v2.0.0.html) — major.minor.patch.

This file tracks stack-level releases. SKILL.md files describe current behavior; this file documents what changed and when.

---

## [2.2.0] - 2026-05-07

Manifest spec + sync script — derived `.agents/manifest.json` state index. `start-meta` reads manifest first.

### Added

- `references/manifest-spec.md` — canonical contract for `.agents/manifest.json`, the derived state index that lets every skill in the stack discover, evaluate, and collaborate around artifacts without re-scanning the filesystem. Defines artifact frontmatter contract (`skill`, `version`, `date`, `status`, optional `stale_after_days` + `summary`), the manifest schema (artifacts + experience maps), Read/Write protocols for consumers and producers, status-aware consumption rules, and per-artifact-type staleness defaults.
- `scripts/manifest-sync.ts` — Bun TypeScript sync script (~170 lines, no deps). Walks `.agents/`, `research/`, `brand/`, `architecture/`, parses frontmatter, computes per-artifact staleness, counts experience entries, writes `.agents/manifest.json`. Idempotent, self-healing — running twice produces identical output. Skills call it as their last step after producing an artifact.

### Changed

- `start-meta` SKILL.md — Step 1 (Cross-Stack State Detection) now reads `.agents/manifest.json` first with a status-aware lookup table (`done`, `done_with_concerns`, `blocked`/`needs_context`, `stale`, `frontmatter_present: false`). Per-path filesystem scan demoted to fallback for fresh projects. Anti-pattern entry added: "Don't ignore the manifest." Added `side-effects: [manifest-sync]` to the skill's routing block.
- `CLAUDE.md` — added "Manifest Spec" section pointing skill authors at the contract and frontmatter obligations.

---

## [2.1.0] - 2026-05-06

Cross-stack orchestrator added.

### Added

- `start-meta` — Cross-stack orchestrator and top-level entry point. Reads project state across `research/`, `brand/`, `architecture/`, `.agents/`, and `.agents/experience/*.md`, classifies the user's intent into research / marketing / product / process / cross-stack, and either defers to a stack orchestrator (`/start-research`, `/start-marketing`, `/start-product`) or proposes a process meta-skill (`discover`, `agents-panel`, `task-breakdown`, `fresh-eyes`). For genuinely cross-stack work (e.g., "launch a new product feature"), proposes a 2–3 hop path with one-line rationale per step — capped at 3 hops; longer paths surface that the project is too vague and recommend `/discover` first. Never auto-invokes — always prints the `/skill-name` for the user to type. Persists a breadcrumb to `.agents/experience/meta-workflow.md`. Standard budget, ~$0.10–0.30 per run. Pipeline catalog lives in `references/workflow-graph.md`.

### Migration note (re-litigation of `navigate`)

`start-meta` revisits territory that v3 → v4 retired (`navigate`, with Status + Orchestrate modes). The unlock conditions are explicit: (1) per-stack scoping — each `/start-X` only knows its own pipeline; `start-meta` only routes between stacks, not within them; (2) user-invoked entry point — anti-runaway guard restated in every starter; never auto-invokes; (3) state detection + bundled scoping question + foundation gating — jobs the ambient agent router doesn't do. Empirical risk acknowledged: if users only invoke `/start-X` on first install and never mid-project, the orchestration premise is hollow and these become read-once skills. Adoption needs to be tracked.

### Changed

- Plugin `keywords` extended with `cross-stack` to surface the meta-orchestrator capability.

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
