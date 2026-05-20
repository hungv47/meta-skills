---
title: Extract-Service Playbook
lifecycle: canonical
status: stable
produced_by: extract-service
load_class: PLAYBOOK
---

# Extract-Service Playbook

## Why this skill exists

Operational mechanics get copy-pasted. A team wires up an SDK client once, then the next handler needs it, so the block gets pasted; the third handler pastes again. Soon "how we create a sandbox" or "how we call the payments API" lives in a dozen near-identical copies. The cost is not the duplication itself — it is what the duplication does next. A bug in the mechanics has to be fixed N times. Someone fixes it in three of twelve. The copies drift. Onboarding slows because there is no single answer to "how do we call X."

`clean-code` does not solve this: its scope is *behavioral* cleanup — dead code, AI slop, unused deps — not the *structural* job of lifting shared mechanics into a layer. `architect-system` does not solve it either: it designs systems from scratch, it does not refactor existing callers. The gap is concrete and narrow, and it has a known recipe: extract one block, replace one caller, verify, migrate the rest one at a time.

This skill exists to run that recipe safely. The extraction is purely structural — same behavior, fewer copies of the same *how*. The 8 Critical Gates (clean-code's 5 golden rules + 3 extract-service-specific) make every step verifiable and reversible.

## Methodology

**Scan first, plan second, gate third, apply fourth — never invert.** scanner-agent finds what repeats and draws the layer line. planner-agent designs the interface and the step sequence. The operator approves. Only then does migration-agent touch code. A plan built on a half-scan picks the wrong layer line; an apply that runs before approval removes the operator's veto.

**The layer line is the whole job.** Service Layer Architecture is a two-layer separation: callers (Actions, handlers) own the *why/when* — which resource, which branch, which policy; the service owns the *how* — client setup, request shaping, retries, I/O. Extract the *how*. Leave the *why/when*. A service that needs a flag to branch behavior by caller has the line in the wrong place — see [`service-layer-pattern.md`](service-layer-pattern.md).

**One caller at a time.** The migration's safety comes from each step being independently green and independently revertible. Extract the module, verify it builds, then migrate caller 1 and verify, caller 2 and verify. First red → revert that one caller, stop. Never batch. Never push past a failure.

**Behavior preservation is non-negotiable.** Every caller, after migration, does exactly what it did before — same return shape, same errors, same side-effect ordering. If the test suite cannot verify that for a caller, the run is `DONE_WITH_CONCERNS` and the report says which caller was not checked. Don't paper over the gap.

**Drift is reported, not normalized.** When the scan finds callers that have silently diverged, that is surfaced to the operator. The default is always to preserve each caller's current behavior. A drift is only "fixed" if the operator sees it flagged — and then it ships as a separate, labeled change, never folded into the migration.

## Principles

- **The 8 Critical Gates are the contract.** Gates 1-5 are clean-code's golden rules verbatim (extract-service edits code, so it carries the same safety contract). Gates 6-8 are extraction-specific: extraction threshold, two-layer purity, baseline-green. All 8 fire under `--fast` and supersede mode-resolver downgrade.
- **The operator-approval gate is the veto.** The plan is shown in full; no code is edited until the operator answers `y`. `N` ships the plan as a `DONE` artifact — a plan-only outcome is a legitimate, useful result, not a failure.
- **Two callers is the floor.** One caller is not a duplication; it is one place. Extracting at one caller is premature abstraction — G6 returns `NEEDS_CONTEXT`.
- **Standalone — no upstream gate.** extract-service reads only source code; no spec or architecture artifact required. Composable with any project state.
- **No test suite → DONE_WITH_CONCERNS.** Migrate with typecheck + build, flag the unverified callers. Don't ship clean-looking output that hides risk.
- **Pre-existing failures → BLOCKED.** Without a green baseline, the per-caller verification signal is meaningless. Pause until the baseline is fixed.

## When NOT to extract

The skill stops — `NEEDS_CONTEXT` or a "don't extract" recommendation — in these situations:

- **One caller.** Nothing to deduplicate. Wait for the second real caller (G6).
- **The repeat is domain logic, not mechanics.** Two blocks that look alike but encode different *why/when* are two policies, not one service. Extracting forces a flag-bag (G7).
- **No test coverage AND behavior matters.** You cannot verify preservation. Write tests first.
- **The mechanics are still changing fast.** Extracting a moving target means re-designing the interface every week. Let it settle.
- **Code that won't change again.** If nobody will touch these callers, the duplication costs nothing — the extraction does not pay off.

## History / origin

- **v1.0.0 (D21, 2026-05-20):** new skill, Workstream F slice 2. Sourced from IDEA-3 § Code Structure (the michaelshimeles `code-structure` Service Layer Architecture pattern) and brief 06 § Code Cleanup and Service Extraction. IDEA-3's standing verdict — "new skill candidate, distinct from code-cleanup's behavioral scope" — was confirmed at the D21 interview (round 15). Locked: standalone skill (not a clean-code mode); v1 deliverable is plan + gated caller-by-caller apply. 4-agent shape (scanner → planner → migration → critic) with an operator-approval gate between plan and apply. budget `standard`.

## Further reading

- [`service-layer-pattern.md`](service-layer-pattern.md) [PLAYBOOK] — the two-layer pattern: Actions vs service, explicit params, structured returns, how to draw the layer line
- [`migration-checklist.md`](migration-checklist.md) [PROCEDURE] — the caller-by-caller migration recipe template
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes + When NOT to extract + When the critic FAILs
- [`report-template.md`](report-template.md) [PROCEDURE] — artifact frontmatter + Migration Plan / Applied Migration section template
- [`examples/extraction-walkthrough.md`](examples/extraction-walkthrough.md) [EXAMPLE] — TypeScript service extraction end-to-end
- `_shared/mode-resolver.md` — `--fast` behavior (`standard`-tier skill; `--fast` runs the Single-Agent Fallback but still enforces all 8 gates per the safety-gates-supersede rule)
- `_shared/pre-dispatch-protocol.md` — canonical Pre-Dispatch spec
