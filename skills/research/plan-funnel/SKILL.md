---
name: plan-funnel
description: "Models business funnels with numeric targets — works backward from revenue goals to required traffic, conversion rates, and unit economics. Produces `.forsvn/artifacts/meta/records/targets-*.md`. For campaign planning, see plan-campaign."
argument-hint: "[revenue target or business goal]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
license: MIT
metadata:
  author: hungv47
  version: "4.0.0"
  budget: standard
  estimated-cost: "$0.30-0.80"
  refactor_history:
    - refactored_at: 2026-05-17
      refactored_for: implementation-roadmap v6 Phase 2 Wave 2 (body-diet + playbook ref + chain hardening, structural target-setting skill)
      body_before: 382
      body_after: 108
      body_delta_pct: -71.7
      note: |
        Body-only line counts (frontmatter excluded). Hard-gate semantics preserved
        verbatim (prioritize-*.md missing → NEEDS_CONTEXT, no INTERVIEW substitute).
        Cross-stack contract preserved BYTE-IDENTICAL (consumed by campaign-plan +
        future eval-loop dashboards):
          - 6 Critical Gates
          - Frontmatter (skill, version, date, status)
          - Target Table column schema (8 columns)
          - Channel → Funnel Stage Map schema (5 columns + 9-channel reference)
          - Three-Outcome Validation table (Business/Brand/Community)
          - Validation block (Anti-Patterns + 70% Test + LTV:CAC Check)
          - Baselines paragraph (verbatim — downstream skills grep for the phrase)
          - Completion Status verdicts
        Agent Manifest + Route A/B/C semantics unchanged; mechanics extracted to ref.
        5 existing data-catalog refs (benchmarks, funnel-models, stress-tests,
        unit-economics, anti-patterns) untouched. 6 sub-agents (agents/) untouched.
        Bulk movement to refs:
          - Philosophy + improvement-factor table + 9-channel ref + when-NOT-to-use → playbook
          - Hard-gate prompt + read order + Cold/Warm Start + write-back map + growth-motion ID + staleness check → procedures/pre-dispatch
          - Route Selection + Layer 1/2 spawn details + merge step + critic gate routing + single-agent fallback + post-write side effects + chain position + skill deference → procedures/dispatch-mechanics
          - Artifact Template (71 lines) + column schemas + date/number/citation/cycle-index format → format-conventions
          - Worked Example (42 lines) → examples/funnel-planner-walkthrough
          - Body Anti-Patterns (16 lines) → DELETED (already in comprehensive references/anti-patterns.md)
promptSignals:
  phrases:
    - "funnel model"
    - "model the funnel"
    - "unit economics"
    - "growth targets"
    - "ltv cac"
    - "revenue target"
    - "how much traffic do we need"
  allOf:
    - [funnel, model]
    - [growth, target]
  anyOf:
    - "ltv"
    - "cac"
    - "conversion rate"
    - "revenue target"
    - "traffic target"
    - "growth model"
    - "unit economics"
  noneOf:
    - "market size"
    - "competitor"
    - "what should we build"
    - "diagnose"
  minScore: 6
routing:
  intent-tags:
    - funnel-modeling
    - target-setting
    - unit-economics
    - growth-targets
    - ltv-cac
    - plg-funnel
    - slg-funnel
    - growth-motion
  position: pipeline
  lifecycle: snapshot
  produces:
    - .forsvn/artifacts/meta/records/targets-*.md
  consumes:
    - product-context.md
    - .forsvn/artifacts/meta/sketches/prioritize-*.md
  requires:
    - .forsvn/artifacts/meta/sketches/prioritize-*.md
  defers-to: []
  parallel-with: []
  interactive: false
  estimated-complexity: medium
---

# Funnel Planner — Orchestrator

*Strategy — Step 3 of 4. Sets data-driven targets for each prioritized initiative.*

**Core Question:** "Do the numbers actually work?"

[Read [`references/playbook.md`](references/playbook.md) [PLAYBOOK] for why this skill exists, the improvement-factor calibration table, the 9-channel reference, growth-motion identification, three-outcome philosophy, and when NOT to use.]

---

## Critical Gates — Read First

1. **Every target MUST have a numeric baseline — zero "TBD" values.** Targets without baselines are arbitrary guesses. If the user lacks data, use industry benchmarks with confidence flagging.
2. **Every target MUST cite justification — no naked numbers.** "Achieve 5% conversion" needs: baseline (current 3.2%), improvement factor (20% lift), reasoning (no optimization done yet, fixing known broken page).
3. **70% test is mandatory — partial achievement must still be valuable.** If hitting 70% of a target is meaningless, the target is wrong. Apply context rules for metric type (higher-is-better, lower-is-better, binary).
4. **LTV:CAC ≥ 3:1 required for acquisition targets — or explicitly flagged.** Setting aggressive acquisition targets when unit economics are unhealthy means you lose money faster.
5. **Growth motion MUST be explicitly identified** — PLG, SLG, or Hybrid. The funnel model selection depends on the growth motion. PLG → PLG Funnel or AARRR. SLG → SLG Funnel or TOFU-MOFU-BOFU. Hybrid → both with clear primary/supplementary designation.
6. **Three-outcome validation required** — every funnel must account for Business (revenue), Brand (awareness), and Community (engagement). Business must be Covered. Brand and Community may be N/A with justification. Gaps without justification are flagged.

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: standard`; `--fast` forces Route C (Fast Bump) if conditions hold, otherwise Route B with critic-gate skipped. **Hard gate (Critical Gates above) STILL enforced under `--fast`** — safety gates supersede mode-resolver downgrade.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory (`.forsvn/artifacts/meta/records/targets-*.md`).
2. Read `.agents/manifest.json` — find the matching `prioritize-*.md` (required) and `targets-*.md` (prior, if any). Check freshness (>30 days surfaces a warning).
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — hard-gate enforcement, read order, Cold/Warm Start prompts, staleness check, growth-motion identification, write-back map all there.

---

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta/records/targets-[YYYY-MM-DD].md` (one per initiative-set; re-run renames prior to `targets.v[N].md` and increments)
- **Lifecycle:** `snapshot` (per `agent-skills/CLAUDE.md` taxonomy)
- **Frontmatter fields:** `skill`, `version` (integer, increment on re-run), `date` (ISO-8601), `status` (per Completion Status block below)
- **Required sections (in order — cross-stack contract):** Funnel Stages · Target Table · Channel → Funnel Stage Map · Three-Outcome Validation · Validation · Baselines (full schemas in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE])
- **Optional sections (append only when applicable):** Aspirational Target Flags · Pricing Health Signals · Known Issues · Change Log
- **Side effects:** append baselines + growth motion + unit economics to `experience/business.md` per Write-back map in `procedures/pre-dispatch.md` (stable user-profile state worth carrying forward; mandatory on PASS or done_with_concerns)
- **Consumed by:** `plan-campaign` (channel-level execution); downstream measurement (eval-loop dashboards when one exists); future `plan-funnel` re-runs (delta detection)
- **Cross-stack OUTPUT contract:** Target Table column schema + section order are load-bearing for downstream consumers — schema changes require atomic update of `plan-campaign` and `run-eval-loop` (per `anti-patterns.md` row "Cross-stack contract drift")

---

## Agent Manifest

| # | Agent | Layer | Focus |
|---|-------|-------|-------|
| 1 | [model-selection-agent](agents/model-selection-agent.md) | L1 (parallel) | Funnel model selection, stage mapping, channel-to-stage mapping |
| 2 | [baseline-collector-agent](agents/baseline-collector-agent.md) | L1 (parallel) | Baseline metrics collection, benchmark context, unit economics snapshot |
| 3 | [target-setter-agent](agents/target-setter-agent.md) | L2 (sequential) | Numeric target setting with improvement factors + justifications |
| 4 | [sanity-check-agent](agents/sanity-check-agent.md) | L2 (sequential) | Anti-pattern scan — 6 checks with pass/fail per target (subset of the 10-pattern catalog in `references/anti-patterns.md`) |
| 5 | [stress-test-agent](agents/stress-test-agent.md) | L2 (sequential) | 4 stress tests per target (revenue, 70%, ownership, measurement) |
| 6 | [critic-agent](agents/critic-agent.md) | L2 (final) | 4-point quality gate (numeric baselines, justified targets, 70% test, LTV:CAC). Max 2 rewrite cycles |

---

## Routing + Dispatch

Three routes; chosen at Pre-Dispatch and echoed in the Warm Start confirmation (operator can override):

| Route | When | Graph |
|---|---|---|
| **A — Full Analysis** | `--deep` flag OR 3+ initiatives spanning 2+ funnel models | L1 parallel (model-selection + baseline-collector) → merge → L2 sequential (target-setter → sanity-check → stress-test → critic) |
| **B — Standard Path** (default) | Modal: known/inferable model, 1-2 initiatives, baselines available | target-setter → sanity-check → critic (skip L1 + stress-test) |
| **C — Fast Bump** (auto-downgrade) | Input ≤3 sentences AND single initiative AND prior `targets-*.md` exists for same initiative | target-setter only (read prior, apply delta, write — no critic gate) |

Mechanics (Route Selection table, Layer 1/2 spawn details, merge step, critic FAIL routing, single-agent fallback, post-write side effects, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — 10-pattern catalog (vanity metrics, feature factory, sandbagging, aspirational math, orphan owners, input traps, ignoring unit economics, and 3 more) with detection + bad/good examples + fixes. The sanity-check-agent scans a 6-pattern subset; the critic reads the full catalog.

---

## Completion Status

Every run ends with explicit status:

- **DONE** — model selected, baselines collected, targets computed and stress-tested, critic PASS
- **DONE_WITH_CONCERNS** — targets computed but baseline data was thin or estimated (assumptions explicit in artifact, sanity-check flags noted); OR critic loop cap reached with surfaceable gate failures (pinned at top of artifact as Known Issues)
- **BLOCKED** — no usable baseline data AND unit economics blocking (LTV:CAC <3:1) — proposed targets would worsen the problem; needs business-model fix first (defer to `diagnose`)
- **NEEDS_CONTEXT** — `prioritize.md` missing OR baseline metrics absent; recommend `prioritize` first (hard-gated upstream — no INTERVIEW substitute for the prioritize side; baselines may be interviewed for current funnel state)

---

## References

| Reference | Load class | Use For |
|---|---|---|
| [playbook.md](references/playbook.md) | PLAYBOOK | Why this skill exists, improvement-factor calibration, 9-channel ref, growth-motion ID, when NOT to use |
| [_shared/before-starting-check.md](references/_shared/before-starting-check.md) | PLAYBOOK | Pre-Pre-Dispatch read pattern (canonical at `references/`, synced) |
| [_shared/mode-resolver.md](references/_shared/mode-resolver.md) | PROCEDURE | `--fast` / `--deep` behavior contract |
| [_shared/pre-dispatch-protocol.md](references/_shared/pre-dispatch-protocol.md) | PROCEDURE | Canonical Pre-Dispatch spec |
| [procedures/pre-dispatch.md](references/procedures/pre-dispatch.md) | PROCEDURE | Hard-gate enforcement, read order, Cold/Warm Start prompts, staleness check, growth-motion ID, write-back map |
| [procedures/dispatch-mechanics.md](references/procedures/dispatch-mechanics.md) | PROCEDURE | Route A/B/C details, Layer 1/2 spawn mechanics, critic routing, single-agent fallback, post-write side effects, chain position, skill deference |
| [format-conventions.md](references/format-conventions.md) | PROCEDURE | Artifact template, Target Table schema, Channel→Stage Map schema, Three-Outcome Validation, date/number/citation/cycle-index format |
| [examples/funnel-planner-walkthrough.md](references/examples/funnel-planner-walkthrough.md) | EXAMPLE | Full Route A walkthrough on a 2-initiative SaaS case |
| [funnel-models.md](references/funnel-models.md) | data catalog | Stage definitions, PLG/SLG/AARRR/AIDA/TOFU-MOFU-BOFU model selection |
| [benchmarks.md](references/benchmarks.md) | data catalog | Industry benchmarks by stage (2025-2026) |
| [unit-economics.md](references/unit-economics.md) | data catalog | LTV:CAC, payback formulas |
| [stress-tests.md](references/stress-tests.md) | data catalog | Target validation questions (revenue, 70%, ownership, measurement) |
| [anti-patterns.md](references/anti-patterns.md) | ANTI-PATTERN | 10 named anti-patterns with detection + examples + fixes |
| `research-skills/CLAUDE.md` | reference | Stack-level conventions (Pre-Dispatch Protocol, Complexity Routing, Multi-Agent Skills) |
