---
name: write-docs
description: "Generate documentation from a codebase — READMEs, API references, setup guides, runbooks, architecture docs, ship logs, release notes (CHANGELOG + GitHub Release bodies). Not for specifying what to build (use discover), restructuring code (use clean-code), or task decomposition (use breakdown-tasks)."
argument-hint: "[codebase or project to document]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.10-0.40"
---

# Technical Writer — Orchestrator

Scans a codebase and generates clear, structured documentation — READMEs, API references, setup guides, runbooks, ship logs, release notes — with consistent terminology so a new team member can follow without reading source code. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 5 routes + Single-Agent Fallback: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology + doc-type catalog + audience types + file importance ranking: [`references/playbook.md`](references/playbook.md).

**Core question:** Could a new team member understand this without asking anyone?

## When To Use

- Codebase needs new docs or a refresh (README, user guide, API reference, config guide, tutorial, runbook).
- After PRs that modify env vars, API routes, or configuration (Route C — Sync).
- Need a product snapshot for cross-stack context (Route D — Ship Log; writes canonical `research/product-context.md`).
- Need a CHANGELOG entry or release notes for an imminent release (Route E).
- Auditing existing docs for staleness (Audit mode; no writing).

## When NOT To Use

- Specifying what to build → `/discover`.
- Restructuring code for readability → `/clean-code`.
- Visual brand identity for docs site → `/create-brand`.
- Single-page conversion surface (landing page) → `/brief-landing-page`.

## Critical Gates — 6 standard

All 6 fire under `--fast`, Single-Agent Fallback, and dry-run. Routes D + E REPLACE these with their own — see the respective mode refs.

1. Every user-facing feature has a documentation section.
2. Setup steps are numbered with expected outcomes after each step.
3. A new user could follow Getting Started independently without reading source code.
4. Code examples compile/run — no pseudocode unless explicitly labeled.
5. Configuration options list defaults and valid values.
6. Troubleshooting covers errors visible in the codebase's error handling.

Critic FAIL → identifies which agent must fix it; orchestrator re-dispatches. Full failure-handling flow: [`references/anti-patterns.md`](references/anti-patterns.md) "When the critic FAILs."

## Before Starting + Pre-Dispatch

Full procedure (before-starting checks, mode resolution, dimensions, read order, Warm/Cold Start, route-locked Pre-Dispatch for D + E, write-back rules): [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Needed dimensions: **audience** (end-user / developer / operator / mixed), **doc-type** (readme / user-guide / api-reference / config-guide / tutorial / ship-log / release-notes / runbook), codebase path, fresh-write vs update-existing.

## Artifact Contract

Per-route paths, lifecycle-by-doc-type, frontmatter baseline, and downstream consumers: [`references/procedures/artifact-paths.md`](references/procedures/artifact-paths.md). Full templates + filename + version-increment rule: [`references/report-template.md`](references/report-template.md).

## Multi-Agent + Single-Agent

6 agents in 2 layers. Full table + execution diagram + dispatch protocol + routing rules + Single-Agent Fallback: [`references/agent-manifest.md`](references/agent-manifest.md).

## Chain Position

Previous: none | Next: none (standalone). Pairs well with `architect-system` (architecture docs), `breakdown-tasks` (contributor guides).

**Re-run triggers:** after PRs that modify environment variables, API routes, or configuration; after major version releases; when new features ship without documentation updates.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before delivering any doc that smells off — 7-pattern catalog (restating code, missing prerequisites, wall of text, documenting internals, "see code for details"). Route-specific anti-patterns + critic-FAIL handling + when-to-defer guidance also live there.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — docs written for the requested audience and doc-type, staleness checks passed, critic PASS.
- **DONE_WITH_CONCERNS** — written but some areas thin (advanced features under-documented, code samples stub-only, examples missing); flagged in artifact.
- **BLOCKED** — codebase too large or contradictory for in-scope coverage; needs scope reduction.
- **NEEDS_CONTEXT** — audience or doc-type not specified and can't be inferred from codebase; ask the user.

## Next Step

Documentation complete. Run `/review-work` for quality review. Run `/optimize-seo` if docs are public-facing.
