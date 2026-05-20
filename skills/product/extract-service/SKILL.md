---
name: extract-service
description: "Extracts repeated operational mechanics (SDK / API / file-system / network logic copy-pasted across handlers or actions) into a shared service layer — produces a stepwise migration plan, then applies it caller-by-caller with verification at each step. Produces `.forsvn/artifacts/product/extract-service/[date]-[slug].md`. Two-layer separation: Actions keep the why/when, the service layer holds the how. Not for behavioral cleanup or dead code (use clean-code) or designing a system from scratch (use architect-system). For a quality review after migrating, see review-work."
argument-hint: "[file or directory with the repeated logic]"
allowed-tools: Read Edit Write Grep Glob Bash
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.75-2"
promptSignals:
  phrases:
    - "extract a service"
    - "service layer"
    - "repeated logic"
    - "copy-pasted across handlers"
    - "duplicated SDK calls"
    - "shared operational logic"
    - "extract this into a helper"
    - "deduplicate the API calls"
  allOf:
    - [extract, service]
    - [repeated, logic]
    - [duplicated, callers]
  anyOf:
    - "extract-service"
    - "service layer"
    - "shared mechanics"
    - "copy-pasted"
    - "duplicated across"
  noneOf:
    - "dead code"
    - "system design"
    - "write documentation"
  minScore: 6
routing:
  intent-tags:
    - service-extraction
    - structural-refactor
    - deduplication
    - service-layer
    - caller-migration
  position: horizontal
  lifecycle: snapshot
  produces:
    - .forsvn/artifacts/product/extract-service/[date]-[slug].md
  consumes: []
  requires: []
  defers-to:
    - skill: clean-code
      when: "the ask is behavioral cleanup, dead code, or AI slop removal — not structural extraction of repeated mechanics"
    - skill: architect-system
      when: "designing a system or service from scratch, not refactoring existing code into layers"
    - skill: review-work
      when: "the migration is done and the operator wants a fresh-eyes quality review"
  parallel-with: []
  interactive: true
  estimated-complexity: medium
---

# Extract Service — Service-Layer Extraction Orchestrator

*Productivity — Multi-agent orchestration. Lifts repeated operational mechanics out of N callers into one shared service layer, then migrates every caller across with verification at each step — without changing observable behavior.*

**Core Question:** "Is this purely structural — same behavior, fewer copies of the same 'how'?"

[Read `references/playbook.md` [PLAYBOOK] for why this skill exists, the Service Layer Architecture methodology, and when NOT to extract.]

## When To Use

- The same operational mechanics — SDK setup, API calls, file-system access, network/retry logic, auth boilerplate — are copy-pasted across 2+ handlers, actions, or route files.
- A bug in that logic has to be fixed in N places, or already was fixed in some-but-not-all.
- Onboarding is slowed because "how we call X" lives in a dozen near-identical blocks.
- Standalone — no upstream gate required.

## When NOT To Use

- Only **one** caller has the logic — there is nothing to deduplicate yet. Extracting now is premature abstraction (Critical Gate G6). Wait for the second real caller.
- The repeated code is orchestration/domain logic (the *why/when*), not operational mechanics (the *how*) — a shared service would have to encode business rules, which leaks the layers (Critical Gate G7).
- Behavioral cleanup, dead code, AI slop, unused deps — that is `clean-code`.
- No test coverage AND behavior preservation matters — write tests first (see [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "When NOT to extract").
- Pre-existing test/build failures unrelated to the extraction — BLOCKED until the baseline is green (Critical Gate G8).

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — this skill is `budget: standard`. Mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) auto-downgrades to the Single-Agent Fallback for ≤3-caller scopes; `--fast` forces single-agent regardless. **Safety gates supersede `--fast`:** all 8 Critical Gates fire on every run, in every mode.
1. Read `.agents/manifest.json` for a prior extract-service run against the same scope; surface staleness if one exists.
2. Read `.forsvn/experience/technical.md` for prior conventions notes.

## Pre-Dispatch

Run the Pre-Dispatch protocol ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)).

**Needed dimensions:** the file(s)/dir holding the repeated logic, how many callers share it, what the shared mechanics are (the "how"), the tech stack + test runner, conventions to preserve.

**Read order:**
1. Codebase scan: package manifest, test config, lint config, framework hints (CLAUDE.md, `.editorconfig`).
2. The named target — confirm the repeated block actually recurs across ≥2 callers (G6).
3. Experience: `.forsvn/experience/technical.md`.

**Warm Start** — the operator named the file/caller set: confirm the caller count by grep, then proceed. **Cold Start** — vague invocation ("dedupe this"): ask which mechanics repeat and roughly how many callers, before scanning. Write resolved dimensions back to `.forsvn/experience/technical.md` per the Pre-Dispatch protocol.

## Critical Gates

Before applying any change, the critic-agent verifies all 8 gates. Gates 1-5 are clean-code's **5 Golden Rules**, inherited verbatim — extract-service edits code, so it carries the same safety contract. Gates 6-8 are extract-service-specific.

1. **Preserve behavior** — every caller, after migration, produces the same observable behavior. If you can't verify it, don't make the change.
2. **Small incremental steps** — extract one block, migrate **one caller**, verify, then the next. Never batch-migrate callers. Never combine the extraction with a feature change.
3. **Check existing conventions first** — read the codebase's module layout, naming, error-handling, and return-shape patterns. The service layer matches them.
4. **Verify after each caller** — run tests / type-check / build after **every single caller migration**. Red → revert that caller, stop, reassess.
5. **Rollback awareness** — commit before starting; note the hash. Each caller migration is its own revertible step.
6. **Extraction threshold** — do NOT extract for fewer than 2 real callers of the repeated mechanics. One caller → `NEEDS_CONTEXT`, recommend not extracting (premature-abstraction guard).
7. **Two-layer purity** — the service layer holds only the shared *how* (operational mechanics). Orchestration and domain rules — the *why/when* — stay in the callers. No business logic leaks into the service. See [`references/service-layer-pattern.md`](references/service-layer-pattern.md).
8. **Baseline-green** — if the test suite or build is already failing before any change, return `BLOCKED`. Per-caller verification is meaningless against a red baseline.

**Operator-approval gate (between plan and apply):** the planner-agent's migration plan is shown to the operator IN FULL — the service interface, the caller list, the migration order — and the orchestrator asks `Apply this migration? [y/N]`. **No code is edited until the operator confirms.** `N` / no response → deliver the plan as a `DONE` artifact (plan-only outcome) and stop. This gate is non-negotiable and is not skipped under `--fast`.

**If any Critical Gate fails:** the critic identifies the specific caller/change that violated it and recommends reverting that step. Never silently bypass — the gates are the safety contract. Full failure-handling flow: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] "When the critic FAILs."

## Multi-Agent Architecture

### Agent Roster

| Agent | File | Focus |
|-------|------|-------|
| scanner-agent | `agents/scanner-agent.md` | Finds the repeated operational mechanics; classifies shared *how* vs caller-resident *why/when*; enumerates every caller |
| planner-agent | `agents/planner-agent.md` | Designs the service interface (explicit params, structured returns); produces the stepwise caller-by-caller migration plan |
| migration-agent | `agents/migration-agent.md` | Executes the approved plan: extract block → replace one caller → verify → next; stops on first red |
| critic-agent | `agents/critic-agent.md` | 8-gate compliance, per-caller behavior preservation, service-design quality |

### Execution Layers

```
Layer 1:
  scanner-agent ──────────── locate repeated mechanics, classify layers, list callers

Layer 2 (sequential):
  planner-agent ──────────── design service interface + migration plan
    → ── OPERATOR-APPROVAL GATE ── [y/N] before any code edit ──
      → migration-agent ───── extract block; migrate caller 1 → verify → caller 2 → verify → …

Layer 3:
  critic-agent ───────────── 8-gate review of the completed migration
```

### Dispatch Protocol

1. **Scan** — dispatch `scanner-agent` on the Pre-Dispatch target. It returns the repeated-mechanics block, the *how*/*why-when* split, and the full caller list. If <2 callers → `NEEDS_CONTEXT` (G6), stop.
2. **Baseline check** — run the test suite + build once. Red → `BLOCKED` (G8), stop.
3. **Plan** — dispatch `planner-agent` with the scan. It returns the service interface design + the ordered, per-caller migration plan with a verification step per caller.
4. **Operator-approval gate** — present the full plan; ask `Apply this migration? [y/N]`. `N`/no response → write the plan-only artifact, `DONE`, stop.
5. **Migrate** — dispatch `migration-agent`. It creates the backup commit, extracts the service block, then migrates callers **one at a time**, running the verification step after each. First red → revert that caller, stop, report.
6. **Critic review** — dispatch `critic-agent` on the completed migration. FAIL → revert the specific offending caller per [`references/anti-patterns.md`](references/anti-patterns.md), re-run verification.
7. **Assembly** — compile the migration report per [`references/report-template.md`](references/report-template.md) [PROCEDURE]. Save to `.forsvn/artifacts/product/extract-service/[date]-[slug].md`.

### Routing Rules

| Condition | Route |
|-----------|-------|
| Scanner finds <2 callers | `NEEDS_CONTEXT` — recommend not extracting (G6); stop |
| Baseline test/build red | `BLOCKED` (G8); stop |
| Operator answers `N` at the approval gate | Write plan-only artifact; `DONE`; stop |
| Per-caller verification fails | Revert that caller; stop; remaining callers stay un-migrated |
| Critic PASS | Assemble report; deliver |
| Critic FAIL | Revert the specific offending caller; re-run verification |
| Callers remain after a session | Artifact records migrated vs pending; a follow-up run resumes |

For an annotated before/after walkthrough (TypeScript — repeated sandbox-creation logic across GitHub Actions handlers): [`references/examples/extraction-walkthrough.md`](references/examples/extraction-walkthrough.md) [EXAMPLE].

## Single-Agent Fallback

Used when mode-resolver downgrades to `fast` (≤3-caller scope or `--fast` flag):

1. Skip multi-agent dispatch.
2. Scan the target — confirm ≥2 callers (G6) and a green baseline (G8).
3. Design the service interface and write the migration plan.
4. **Operator-approval gate still fires** — show the plan, get `[y/N]`.
5. Create the backup commit; extract the block; migrate callers one at a time, verifying after each.
6. Self-review against all 8 Critical Gates.
7. Save the artifact.

The 8 Critical Gates + the operator-approval gate fire in fallback mode regardless — the safety contract is mode-independent.

## Artifact Contract

- **Path:** `.forsvn/artifacts/product/extract-service/[date]-[slug].md` (re-run same slug same day → append `-v[N]`).
- **Lifecycle:** `snapshot` (dated, immutable record of one extraction run).
- **Frontmatter fields:** `skill`, `version`, `date`, `status` (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT), `lifecycle`, `produced_by`, `provenance`.
- **One artifact, two halves:** the **Migration Plan** (service interface + caller order — written before the approval gate) and the **Applied Migration** report (per-caller results + validation + critic verdict — appended after). A plan-only outcome ships just the first half.
- **Consumed by:** `review-work` (when reviewing migration-touched code), `clean-artifacts` (filename staleness scan), operator (history audit).
- Full template: [`references/report-template.md`](references/report-template.md) [PROCEDURE].

## Chain Position

Previous: none | Next: `/review-work` for a fresh-eyes review of the migrated code.

**Re-run triggers:** a third+ caller of the same mechanics appears later; the service interface needs a new param; a prior run stopped with callers still pending.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any change that smells off — extracting at 1 caller, a service that needs an `if (caller === 'x')` branch, batch-migrating callers, domain rules sliding into the service. The "When NOT to extract" exit conditions live there too.

## Completion Status

Every run ends with explicit status:

- **DONE** — plan approved and every caller migrated, behavior preserved (tests + build PASS), critic PASS. **Also DONE** when the operator declined the approval gate and a plan-only artifact shipped.
- **DONE_WITH_CONCERNS** — migration applied but some verification was skipped (no test suite, uncovered callers, manual verification required), or a subset of callers migrated and the rest are flagged pending; report says what wasn't checked.
- **BLOCKED** — pre-existing test/build failure (G8); or critic FAILed and the offending caller could not be cleanly reverted.
- **NEEDS_CONTEXT** — fewer than 2 callers found (G6); or the *how*/*why-when* split is ambiguous (mixed concerns, no clear shared mechanics); ask the operator before scanning further.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why, methodology, when NOT to extract, history
- [`references/service-layer-pattern.md`](references/service-layer-pattern.md) [PLAYBOOK] — the two-layer pattern: Actions (why/when) vs service (how), explicit params, structured returns
- [`references/migration-checklist.md`](references/migration-checklist.md) [PROCEDURE] — the caller-by-caller migration recipe template
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes + When NOT to extract + When the critic FAILs
- [`references/report-template.md`](references/report-template.md) [PROCEDURE] — artifact frontmatter + Migration Plan / Applied Migration section template
- [`references/examples/extraction-walkthrough.md`](references/examples/extraction-walkthrough.md) [EXAMPLE] — TypeScript service extraction end-to-end
- **Shared:** `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, manifest-spec, anti-sycophancy, artifact-contract-template}.md` — synced via `scripts/sync-skill-support.mjs` (currently broken for the 2.0 layout; listed as expected dependencies for when sync is fixed, per the D13/D19 finding)
