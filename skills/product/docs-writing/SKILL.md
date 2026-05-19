---
name: docs-writing
description: "Generates documentation from a codebase — READMEs, API references, setup guides, runbooks, architecture docs, ship logs, and release notes (CHANGELOG entries + GitHub Release bodies enforcing the agent-skills CHANGELOG convention) with consistent structure and terminology. Produces documentation files in the project. Ship log mode writes a plain-language product snapshot to research/product-context.md. Release-notes mode appends to CHANGELOG.md and optionally emits a GitHub Release body draft. Not for specifying what to build (use discover) or restructuring code (use code-cleanup). For task decomposition, see task-breakdown."
argument-hint: "[codebase or project to document]"
allowed-tools: Read Grep Glob Bash
license: MIT
metadata:
  author: hungv47
  version: "3.2.0"
  budget: standard
  estimated-cost: "$0.10-0.40"
  refactor_history:
    - refactored_at: 2026-05-17
      refactored_for: implementation-roadmap v6 Phase 2 Wave 1 (slot 6 — mixed; 6 standard critical gates + multi-agent architecture preserved in body; 4 specialized routes extracted to modes/)
      body_before: 452
      body_after: 183
      body_delta_pct: -59.5
      note: body-only line counts (frontmatter excluded). 9 new refs (playbook, pre-dispatch-prompts, anti-patterns, report-template, examples/api-readme-walkthrough, modes/{sync,ship-log,release-notes,audit}). Routes C/D/E + audit mode extracted to per-mode refs.
promptSignals:
  phrases:
    - "write documentation"
    - "write a readme"
    - "api reference"
    - "setup guide"
    - "runbook"
    - "document this"
    - "release notes"
    - "changelog entry"
    - "what changed in this version"
    - "write the release"
  allOf:
    - [write, documentation]
    - [api, reference]
  anyOf:
    - "documentation"
    - "readme"
    - "docs"
    - "guide"
    - "runbook"
    - "reference"
    - "release notes"
    - "changelog"
  noneOf:
    - "code cleanup"
    - "refactor"
    - "dead code"
  minScore: 6
routing:
  intent-tags:
    - documentation
    - readme
    - api-reference
    - setup-guide
    - runbook
    - ship-log
    - product-context
  position: horizontal
  lifecycle: canonical
  produces:
    - product-context.md
  consumes:
    - product-context.md
  requires: []
  defers-to:
    - skill: discover
      when: "need a spec for what to build, not docs for what exists"
    - skill: code-cleanup
      when: "need code quality improvements, not documentation"
  parallel-with:
    - code-cleanup
  interactive: false
  estimated-complexity: medium
---

# Technical Writer — Orchestrator

*Productivity — Multi-agent orchestration. Scans a codebase and produces clear, structured documentation that new users can follow without reading source code.*

**Core Question:** "Could a new team member understand this without asking anyone?"

[Read `references/playbook.md` [PLAYBOOK] to understand why this skill exists, methodology, principles, documentation types catalog, audience types, file importance ranking, when NOT to use.]

## When To Use

- Codebase needs new docs or a refresh (README, user guide, API reference, config guide, tutorial).
- After PRs that modify env vars, API routes, or configuration (use Route C — sync).
- Need a product snapshot for cross-stack context (use Route D — ship log; writes canonical `research/product-context.md`).
- Need a CHANGELOG entry for an imminent release (use Route E — release notes).
- Auditing existing docs for staleness (use audit mode; no writing).

## When NOT To Use

- Specifying what to build → `/discover`.
- Restructuring code for readability → `/code-cleanup`.
- Visual brand identity for docs site → `/brand-system`.
- Single-page conversion surface (landing page) → `/lp-brief`.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — this skill is `budget: standard`. Mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) applies the canonical heuristics. `--fast` flag forces Single-Agent Fallback. **Safety gates supersede `--fast`:** the 6 standard critical gates (or route-specific gates for Routes D + E) fire on every run, regardless of mode.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory (default route writes to project; Route D writes to `research/product-context.md`; Route E appends to `CHANGELOG.md`).
2. Read `.agents/manifest.json` for prior docs-writing runs against the same target; surface staleness signals.
3. Read `skills-resources/experience/technical.md` for prior doc conventions (voice, formatting preferences).
4. Read project context: existing README, CLAUDE.md, `research/product-context.md`, `package.json#description` — all available context before scanning code.

## Pre-Dispatch

Run the Pre-Dispatch protocol ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE]).

**Needed dimensions:** audience (end-user / developer / operator / mixed), doc type (readme / user-guide / api-reference / config-guide / tutorial / ship-log / release-notes), codebase path, fresh write or update existing.

**Read order:**
1. Codebase scan: existing README, docs/, package manifest, framework hints.
2. Experience: `skills-resources/experience/technical.md` for prior doc conventions.

**Prompts:** see [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] for Warm Start, Cold Start, route-locked Pre-Dispatch (Routes D + E override Q1+Q2), write-back rules.

## Artifact Contract

- **Path (default route):** project files — `README.md`, `docs/<topic>.md`, or specified location.
- **Path (Route C — Sync):** in-place updates to existing docs with `<!-- synced: YYYY-MM-DD -->` markers.
- **Path (Route D — Ship Log):** `research/product-context.md` (canonical cross-stack artifact; pre-write merge-mode check required).
- **Path (Route E — Release Notes):** `CHANGELOG.md` (prepend new entry); optionally also GitHub Release body draft to stdout via `--gh-release`.
- **Path (Audit Mode):** no writes — produces audit report inline.
- **Lifecycle:** varies by doc-type — see [`references/report-template.md`](references/report-template.md) [PROCEDURE] "Lifecycle by doc-type" table (README/User Guide/Config/Tutorial/Ship Log = canonical; API Reference = pipeline; Release Notes = snapshot).
- **Frontmatter fields (baseline):** `skill`, `version`, `date`, `status` (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), `audience`, `doc-type`. **Step 7.5 additions** (manifest-sync conformance; backfilled going forward): `lifecycle`, `produced_by`, `provenance`.
- **Consumed by:** all 12+ downstream skills (Ship Log → `research/product-context.md` feeds brand-system, copywriting, seo, system-architecture, etc.), users on `/plugin update` (Release Notes → CHANGELOG.md), `code-cleanup` + `fresh-eyes` + `system-architecture` (read docs for drift detection).
- Full templates + filename + version-increment rule: [`references/report-template.md`](references/report-template.md) [PROCEDURE].

## Chain Position

Previous: none | Next: none (standalone).

Pairs well with: `system-architecture` (for architecture docs), `task-breakdown` (for contributor guides).

**Re-run triggers:** after PRs that modify environment variables, API routes, or configuration; after major version releases; when new features ship without documentation updates.

## Critical Gates

Before delivering, the critic-agent verifies ALL of these pass (default route + README + User Guide + API Reference + Config Guide + Tutorial + Audit + Sync routes):

- [ ] Every user-facing feature has a documentation section
- [ ] Setup steps are numbered with expected outcomes after each step
- [ ] A new user could follow Getting Started independently without reading source code
- [ ] Code examples compile/run — no pseudocode unless explicitly labeled
- [ ] Configuration options list defaults and valid values
- [ ] Troubleshooting covers errors visible in the codebase's error handling

**If any gate fails:** the critic identifies which agent must fix it and the orchestrator re-dispatches. Full failure-handling flow: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "When the critic FAILs."

**Route-specific gates:** Routes D (Ship Log) + E (Release Notes) REPLACE the standard checklist with their own — see the respective mode refs. Routes C (Sync) + Audit inherit the standard checklist (their per-mode refs document additional critic *focus* heuristics, not new FAIL gates).

**Safety supersedes `--fast`:** all gates fire under `--fast`, Single-Agent Fallback, and dry-run modes. Mode-resolver's safety-gates-supersede contract applies.

## Multi-Agent Architecture

### Agent Roster

| Agent | File | Focus |
|-------|------|-------|
| scanner-agent | `agents/scanner-agent.md` | Maps project structure, file importance ranking, existing docs inventory |
| concept-extractor-agent | `agents/concept-extractor-agent.md` | Reads key files, extracts features, setup requirements, error patterns |
| audience-profiler-agent | `agents/audience-profiler-agent.md` | Identifies audience, calibrates vocabulary and depth |
| writer-agent | `agents/writer-agent.md` | Writes the documentation from extracted concepts for the profiled audience |
| staleness-checker-agent | `agents/staleness-checker-agent.md` | Compares documentation against current codebase for accuracy |
| critic-agent | `agents/critic-agent.md` | Quality gate review, audience calibration check, staleness integration |

### Execution Layers

```
Layer 1 (parallel):
  scanner-agent ──────────────┐
  concept-extractor-agent ────┤── run simultaneously
  audience-profiler-agent ────┘

Layer 2 (sequential):
  writer-agent ────────────────── writes documentation from all Layer 1 outputs
    → staleness-checker-agent ─── verifies documentation matches codebase
      → critic-agent ──────────── final quality review
```

### Dispatch Protocol

1. **Layer 1 dispatch** — send brief to all three Layer 1 agents in parallel.
2. **Writer dispatch** — send all Layer 1 outputs to `writer-agent`. It produces the documentation following `references/doc-template.md` (or the route-specific template in Routes D + E), calibrated for the audience.
3. **Staleness check** — send writer output + codebase facts to `staleness-checker-agent`. It verifies every claim in the docs matches the current codebase.
4. **Critic review** — send documentation + staleness results to `critic-agent`. Default + Routes A/B/C/audit apply the 6 standard critical gates; Routes D + E apply mode-specific gates.
5. **Revision loop** — if critic returns FAIL, re-dispatch affected agents per [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Maximum 2 rounds.
6. **Save** — write documentation to the route-specified path.

### Routing Rules

| Condition | Route |
|-----------|-------|
| User specifies audience | audience-profiler-agent uses it directly (no inference needed) |
| User says "document this" (no type) | audience-profiler defaults to User Guide (developers) or README (library) |
| User says "audit docs" / "check documentation" / "are docs up to date" | **Audit mode** — see [`references/modes/audit.md`](references/modes/audit.md) [PROCEDURE]; skip writer-agent |
| User says "sync docs", "update docs", or `--sync` | **Route C: Post-Change Sync** — see [`references/modes/sync.md`](references/modes/sync.md) [PROCEDURE] |
| User says "ship log", "product context", "what does this app do", or `--ship-log` | **Route D: Ship Log** — see [`references/modes/ship-log.md`](references/modes/ship-log.md) [PROCEDURE]; writes canonical `research/product-context.md` with merge-mode check |
| User says "release notes", "changelog entry", "what changed in this version", or `--release-notes <version>` | **Route E: Release Notes** — see [`references/modes/release-notes.md`](references/modes/release-notes.md) [PROCEDURE]; CHANGELOG entry + convention-enforcing critic gates |
| Monorepo detected | scanner-agent identifies package boundaries; writer produces per-package docs |
| Critic PASS | Save and deliver |
| Critic FAIL | Re-dispatch cited agents with feedback (max 2 rounds) |

For an annotated default-route walkthrough (Node.js REST API README, all 6 agents + staleness loop + critic decisions): [`references/examples/api-readme-walkthrough.md`](references/examples/api-readme-walkthrough.md) [EXAMPLE].

## Single-Agent Fallback

Used when mode-resolver downgrades to `fast` (small project: <20 files, context-constrained, or `--fast` flag):

1. Skip multi-agent dispatch.
2. Scan project structure and identify key files using the 7-rank importance system (see playbook).
3. Read 5-10 highest-ranked files.
4. Determine audience (developer, end-user, operator).
5. Write documentation following `references/doc-template.md`.
6. Cross-check env vars, setup steps, and API endpoints against code.
7. Run Critical Gates as self-review.
8. Save to project root or specified location per [`references/report-template.md`](references/report-template.md) [PROCEDURE].

The 6 standard critical gates fire in fallback mode regardless — safety contract is mode-independent. Route-specific gates (Routes D + E) also fire when those routes are invoked under `--fast`.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. 7-pattern catalog — re-read before delivering any doc that smells off (restating code, missing prerequisites, wall of text, documenting internals, "see code for details"). Route-specific anti-patterns + critic-FAIL handling + when-to-defer guidance also live there.

## Completion Status

Every run ends with explicit status:

- **DONE** — docs written for the requested audience and doc-type, staleness checks passed, critic PASS.
- **DONE_WITH_CONCERNS** — docs written but some areas thin (advanced features under-documented, code samples stub-only, examples missing); flagged in artifact.
- **BLOCKED** — codebase too large or contradictory for in-scope coverage; needs scope reduction before continuing.
- **NEEDS_CONTEXT** — audience or doc-type not specified and can't be inferred from codebase; ask the user.

## Next Step

Documentation complete. Run `/fresh-eyes` for quality review. Run `/seo` if docs are public-facing.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why, methodology, principles, documentation types catalog, audience types, file importance ranking, when NOT to use, history
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE] — canonical Pre-Dispatch spec
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior + safety-gates-supersede contract
- [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md) [PROCEDURE] — Warm + Cold prompts + route-locked Pre-Dispatch variants
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 7-pattern catalog + route-specific anti-patterns + critic-FAIL handling
- [`references/report-template.md`](references/report-template.md) [PROCEDURE] — default frontmatter + lifecycle by doc-type + filename + version-increment
- [`references/modes/sync.md`](references/modes/sync.md) [PROCEDURE] — Route C: Post-Change Sync (git diff → targeted updates)
- [`references/modes/ship-log.md`](references/modes/ship-log.md) [PROCEDURE] — Route D: Ship Log (canonical `research/product-context.md` + merge-mode check + ship-log critic gates)
- [`references/modes/release-notes.md`](references/modes/release-notes.md) [PROCEDURE] — Route E: Release Notes (CHANGELOG + GH Release + 9 convention-enforcing critic gates)
- [`references/modes/audit.md`](references/modes/audit.md) [PROCEDURE] — Audit mode (staleness-only, no writes, security-priority ranking)
- [`references/doc-template.md`](references/doc-template.md) — default writer-template (pre-existing, writer-agent consumes)
- [`references/ship-log-template.md`](references/ship-log-template.md) — ship-log writer-template (pre-existing, writer-agent consumes in Route D)
- [`references/examples/api-readme-walkthrough.md`](references/examples/api-readme-walkthrough.md) [EXAMPLE] — Node.js REST API README end-to-end
