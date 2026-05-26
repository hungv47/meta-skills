---
name: write-docs
description: "Generate documentation from a codebase — READMEs, API references, setup guides, runbooks, architecture docs, ship logs, release notes (CHANGELOG + GitHub Release bodies). Not for specifying what to build (use discover), restructuring code (use clean-code), or task decomposition (use breakdown-tasks)."
argument-hint: "[codebase or project to document]"
allowed-tools: Read Grep Glob Bash
metadata:
  version: "3.3.0"
  budget: standard
  estimated-cost: "$0.10-0.40"
---

# Technical Writer — Orchestrator

Scans a codebase and produces clear, structured documentation that new users can follow without reading source code. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 5 routes + 6 standard critical gates + Single-Agent Fallback: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology + documentation types catalog + audience types + file importance ranking: [`references/playbook.md`](references/playbook.md).

**Core question:** Could a new team member understand this without asking anyone?

## When To Use

- Codebase needs new docs or a refresh (README, user guide, API reference, config guide, tutorial).
- After PRs that modify env vars, API routes, or configuration (Route C — Sync).
- Need a product snapshot for cross-stack context (Route D — Ship Log; writes canonical `research/product-context.md`).
- Need a CHANGELOG entry for an imminent release (Route E — Release Notes).
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

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode resolution** ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)). `budget: standard`. `--fast` forces Single-Agent Fallback. **Safety gates supersede `--fast`.**
- Read `.forsvn/index/manifest.json` for prior docs-writing runs against the same target; surface staleness signals.
- Read `.forsvn/experience/technical.md` for prior doc conventions (voice, formatting preferences).
- Read project context: existing README, CLAUDE.md, `research/product-context.md`, `package.json#description` — all available context before scanning code.

## Pre-Dispatch

Run [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md). Needed dimensions: audience (end-user / developer / operator / mixed), doc type (readme / user-guide / api-reference / config-guide / tutorial / ship-log / release-notes), codebase path, fresh write or update existing.

Read order: codebase scan (existing README, docs/, package manifest, framework hints) → `.forsvn/experience/technical.md` (prior doc conventions).

Warm Start + Cold Start + route-locked Pre-Dispatch (Routes D + E override Q1+Q2) + Write-back rules: [`references/pre-dispatch-prompts.md`](references/pre-dispatch-prompts.md).

## Artifact Contract

- **Path (default route):** project files — `README.md`, `docs/<topic>.md`, or specified location.
- **Path (Route C — Sync):** in-place updates to existing docs with `<!-- synced: YYYY-MM-DD -->` markers.
- **Path (Route D — Ship Log):** `research/product-context.md` (canonical cross-stack artifact; pre-write merge-mode check required).
- **Path (Route E — Release Notes):** `CHANGELOG.md` (prepend new entry); optionally also GitHub Release body draft to stdout via `--gh-release`.
- **Path (Audit Mode):** no writes — produces audit report inline.
- **Lifecycle:** varies by doc-type — see [`references/report-template.md`](references/report-template.md) "Lifecycle by doc-type" (README/User Guide/Config/Tutorial/Ship Log = canonical; API Reference = pipeline; Release Notes = snapshot).
- **Frontmatter (baseline):** `skill`, `version`, `date`, `status`, `stack` (=product), `review_surface` (=md by default; project-level canonical docs may opt into `html` for FIRE-themed preview), `decision_state`, `audience`, `doc-type`. Backfilled additions: `lifecycle`, `produced_by`, `provenance`. v2 schema in [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md).
- **Consumed by:** all 12+ downstream skills (Ship Log → `research/product-context.md` feeds create-brand, write-copy, optimize-seo, architect-system, etc.); users on `/plugin update` (Release Notes → CHANGELOG.md); `clean-code` + `review-work` + `architect-system` (read docs for drift detection).

Full templates + filename + version-increment rule: [`references/report-template.md`](references/report-template.md).

## Multi-Agent + Single-Agent

6 agents in 2 layers. Full table + execution diagram + dispatch protocol + routing rules + Single-Agent Fallback: [`references/agent-manifest.md`](references/agent-manifest.md).

## Chain Position

Previous: none | Next: none (standalone). Pairs well with `architect-system` (architecture docs), `breakdown-tasks` (contributor guides).

**Re-run triggers:** after PRs that modify environment variables, API routes, or configuration; after major version releases; when new features ship without documentation updates.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before delivering any doc that smells off — 7-pattern catalog (restating code, missing prerequisites, wall of text, documenting internals, "see code for details"). Route-specific anti-patterns + critic-FAIL handling + when-to-defer guidance also live there.

## Completion Status

- **DONE** — docs written for the requested audience and doc-type, staleness checks passed, critic PASS.
- **DONE_WITH_CONCERNS** — written but some areas thin (advanced features under-documented, code samples stub-only, examples missing); flagged in artifact.
- **BLOCKED** — codebase too large or contradictory for in-scope coverage; needs scope reduction.
- **NEEDS_CONTEXT** — audience or doc-type not specified and can't be inferred from codebase; ask the user.

## Next Step

Documentation complete. Run `/review-work` for quality review. Run `/optimize-seo` if docs are public-facing.
