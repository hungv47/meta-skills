---
name: extract-service
description: "Extracts repeated operational mechanics (SDK, API, file-system, or network logic copy-pasted across handlers or actions) into a shared service layer — produces a stepwise migration plan, then applies it caller-by-caller with verification at each step. Use when the same \"how\" recurs across 2+ callers. Not for behavioral cleanup or dead code (use clean-code) or designing a system from scratch (use architect-system). For a quality review after migrating, see review-work."
argument-hint: "[file or directory with the repeated logic]"
allowed-tools: Read Edit Write Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.75-2"
---

# Extract Service — Service-Layer Extraction Orchestrator

*Multi-agent. Lifts repeated operational mechanics (SDK / API / file-system / network logic copy-pasted across handlers) out of N callers into one shared service layer, then migrates caller-by-caller with verification — no observable behavior change.*

**Core Question:** "Is this purely structural — same behavior, fewer copies of the same 'how'?"

> Why, methodology, when NOT to extract: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## When To Use

- Same operational mechanics (SDK setup, API calls, file-system access, network/retry logic, auth boilerplate) copy-pasted across 2+ handlers, actions, or route files.
- Bug had to be fixed in N places, or was fixed in some-but-not-all.

**When NOT:** 1 caller (G6); orchestration/domain logic not mechanics (G7); behavioral cleanup → `clean-code`; new system design → `architect-system`; no tests AND behavior must be preserved → write tests first; red baseline → BLOCKED (G8). Exits: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN].

## Critical Gates — Read First

Critic verifies all 8 before any change. **G1-5** = clean-code's 5 Golden Rules (preserve behavior · small incremental steps · check existing conventions · verify after each caller · rollback awareness). **G6-8** extract-service-specific:

- **G6 Extraction threshold** — <2 real callers → `NEEDS_CONTEXT`.
- **G7 Two-layer purity** — service holds only the shared *how*; orchestration + domain rules stay in callers.
- **G8 Baseline-green** — red tests/build → `BLOCKED`.

**Operator-approval gate (plan → apply):** plan shown IN FULL; ask `Apply this migration? [y/N]`. **No code edited until operator confirms.** `N`/no response → plan-only `DONE`, stop. Not skipped under `--fast`. Full text + critic-FAIL recovery: [`references/procedures/critical-gates.md`](references/procedures/critical-gates.md) [PROCEDURE].

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK]:

| Artifact | Source | Use |
|---|---|---|
| `.forsvn/index/manifest.json` | (any) | Check prior run, staleness |
| `docs/forsvn/experience/technical.md` | (any) | Prior conventions |
| `architecture/system-architecture.md` | architect-system | Service-layer placement |

## Mode + Pre-Dispatch + Dispatch

`budget: standard` — auto-downgrades to Single-Agent Fallback for ≤3-caller scopes; `--fast` forces single-agent (safety gates still fire). Per `references/_shared/mode-resolver.md`.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

**Pre-Dispatch** (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]) — needed dimensions: target, caller count, mechanics that repeat, tech stack + test runner, conventions. Confirm ≥2 callers via grep (G6) before scan. Cold Start: ask which mechanics repeat + roughly how many callers. Write back to `docs/forsvn/experience/technical.md`.

**Dispatch** — 4 sub-agents (scanner → planner → migration → critic) across 3 layers + operator-approval gate. Roster + layers + protocol + routing + Single-Agent Fallback: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. TS walkthrough: [`references/examples/extraction-walkthrough.md`](references/examples/extraction-walkthrough.md) [EXAMPLE].

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/product-extract-service-<YYYY-MM-DD>-<slug>.md` (flat v2; re-run same slug same day → `.v[N]`).
- **Lifecycle:** `snapshot`.
- **Frontmatter:** `skill`, `version`, `date`, `status` (DONE/DONE_WITH_CONCERNS/BLOCKED/NEEDS_CONTEXT), `stack` (=product), `review_surface` (=none — `decision_state: not_required`), `lifecycle`, `produced_by`, `provenance`. Schema: [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md).
- **Two halves:** Migration Plan (interface + caller order, pre-approval) + Applied Migration (per-caller results + critic verdict, post-apply). Plan-only ships just the first.
- **Consumed by:** `review-work`, `clean-artifacts`, operator. Template: [`references/report-template.md`](references/report-template.md) [PROCEDURE].

## Anti-Patterns

Re-read before any change that smells off: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — extracting at 1 caller; service with `if (caller === 'x')`; batch-migrating; domain rules sliding into the service.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — plan approved, every caller migrated, behavior preserved (tests + build PASS), critic PASS. Also DONE when operator declined the approval gate and a plan-only artifact shipped.
- **DONE_WITH_CONCERNS** — applied but verification skipped (no test suite, uncovered callers, manual), or a subset migrated and rest flagged pending.
- **BLOCKED** — pre-existing test/build failure (G8); or critic FAIL with offending caller not cleanly revertible.
- **NEEDS_CONTEXT** — <2 callers (G6); or *how*/*why-when* split ambiguous.

## Next Step

`/review-work` for a fresh-eyes review of migrated code. **Re-run triggers:** 3rd+ caller appears; interface needs a new param; prior run stopped with callers pending.

## References

- `references/{playbook, service-layer-pattern, migration-checklist, anti-patterns, report-template}.md`
- `references/procedures/{critical-gates, dispatch-mechanics}.md`
- `references/examples/extraction-walkthrough.md`
- `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, manifest-spec, anti-sycophancy, artifact-contract-template}.md`
