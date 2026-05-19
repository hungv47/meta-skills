---
name: prioritize
description: "Brainstorms and prioritizes strategic solutions when the problem or goal is already clear — generates options, scores trade-offs, and recommends a path forward. Produces `.agents/skill-artifacts/meta/sketches/prioritize-*.md`. Not for diagnosing what the problem is (use diagnose) or engineering task lists (use task-breakdown). For setting numeric targets after prioritizing, see funnel-planner. For technical architecture of chosen initiatives, see system-architecture."
argument-hint: "[problem or goal to solve]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
license: MIT
metadata:
  author: hungv47
  version: "2.0.0"
  budget: deep
  estimated-cost: "$1-3"
  refactor_history:
    - refactored_at: 2026-05-18
      refactored_for: implementation-roadmap v6 Phase 2 Wave 2 (body-diet + playbook ref + chain hardening, structural option-ranking skill)
      body_before: 435
      body_after: 112
      body_delta_pct: -74.3
      note: |
        Body-only line counts (frontmatter excluded). Hard-gate semantics preserved
        verbatim (diagnose-*.md missing → NEEDS_CONTEXT, no INTERVIEW substitute).
        Cross-stack contract preserved BYTE-IDENTICAL (consumed by funnel-planner +
        campaign-plan + system-architecture):
          - 4 Critical Gates
          - Frontmatter (skill, version, date, status)
          - Phase 1 initiative format (### N. [Name] — Effort: S/M/L + Hypothesis +
            Mechanic + Target Metric + Anti-generic check)
          - Phase 2 Forced Ranking section
          - ICE Scoring table column schema (Rank | Initiative | I | C | E | ICE |
            Key Evidence) + differentiation rule
          - Decisions table column schema (Initiative | Decision | Owner |
            Target Metric (Baseline) | Kill Criteria)
          - Cut line declaration mandatory line
          - Next Step block (verbatim — downstream grep)
          - Out-of-Scope Persistence file format (Decided / Context / Decision /
            Revisit if) — preserved verbatim from original SKILL.md
          - Completion Status verdicts
        Agent Manifest + Route A/B semantics unchanged; mechanics extracted to ref.
        6 existing data-catalog refs (ice-scoring-rubric, initiative-planning,
        initiative-types, churn-playbook, churn-cancel-flow-templates,
        churn-health-score-guide) untouched. 7 sub-agents (agents/) untouched.
        Bulk movement to refs:
          - Philosophy + ICE evidence rules + forced-ranking ceiling + ≤3 cut-line
            philosophy + churn special case + unconventional-scan rationale +
            when-NOT-to-use → playbook
          - Hard-gate prompt + read order + Cold/Warm Start + constraint interview
            + write-back map + staleness check → procedures/pre-dispatch
          - Route Selection + Layer 1/1.5/2 spawn details + merge step + user
            feedback gate + critic FAIL routing + single-agent fallback +
            Out-of-Scope Persistence write-back + chain position + skill deference
            → procedures/dispatch-mechanics
          - Artifact Template (63 lines) + Phase 1 + Phase 2 + Decisions + Next Step
            schema + Out-of-Scope file format + date/number/citation format →
            format-conventions
          - Worked Example (97 lines) → examples/prioritize-walkthrough
          - Body Anti-Patterns (16 lines, 8 patterns) → anti-patterns (NEW —
            extracted + expanded with detection + bad/good examples + agent
            ownership)
promptSignals:
  phrases:
    - "what to build first"
    - "what should we build next"
    - "which to build first"
    - "prioritize initiatives"
    - "ice score"
    - "which solution"
    - "strategic options"
    - "rank the options"
  allOf:
    - [what, build, prioritize]
    - [solution, prioritize]
    - [initiative, rank]
  anyOf:
    - "prioritize"
    - "ice"
    - "initiative"
    - "solution"
    - "trade-off"
  noneOf:
    - "market research"
    - "buyer persona"
  minScore: 6
routing:
  intent-tags:
    - prioritize
    - prioritization
    - ice-scoring
    - initiative-planning
    - strategic-options
  position: pipeline
  lifecycle: sketch
  produces:
    - .agents/skill-artifacts/meta/sketches/prioritize-*.md
  consumes:
    - product-context.md
    - market-research.md
    - .agents/skill-artifacts/meta/records/diagnose-*.md
  requires: []
  defers-to:
    - skill: discover
      when: "need to clarify HOW to build, not WHAT to pursue"
    - skill: system-architecture
      when: "need technical design, not strategic prioritization"
  parallel-with: []
  interactive: false
  estimated-complexity: heavy
---

# Solution Design — Orchestrator

*Strategy — Step 2 of 4. Brainstorms targeted solutions and ranks them with evidence-backed scoring.*

**Core Question:** "What's the highest-impact thing we can do about this?"

[Read [`references/playbook.md`](references/playbook.md) [PLAYBOOK] for why this skill exists, the anti-generic test, forced-ranking ceiling, ≤3 cut-line philosophy, churn special case, unconventional-scan rationale, and when NOT to use.]

---

## Critical Gates — Read First

1. **Every initiative hypothesis MUST name the root cause.** Generic growth ideas produce low-impact, unfocused initiatives. If the hypothesis "because" clause doesn't reference the confirmed root cause, the initiative is untethered.
2. **Force-rank BEFORE scoring — ranking prevents "everything is a 6."** The forced ranking sets the ceiling for ICE scores. If you ranked it #1, its ICE should be highest.
3. **Anti-generic test is mandatory — "would this help ANY company?"** Delete the root cause reference from an initiative. If it still makes sense for any company, it's generic. Rewrite.
4. **≤3 initiatives above cut line — force the constraint.** More than 3 active initiatives means none get full attention. Parked initiatives have their turn after the current batch ships.

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: deep`; `--fast` forces Route B (skip unconventional-agent) with critic gate collapsed to single pass. **Hard gate (Critical Gates above) STILL enforced under `--fast`** — safety gates supersede mode-resolver downgrade.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory (`.agents/skill-artifacts/meta/sketches/prioritize-*.md`) and Out-of-Scope path (`.agents/skill-artifacts/meta/out-of-scope/`).
2. Read `.agents/manifest.json` — find the matching `diagnose-*.md` (required) and prior `prioritize-*.md` (if any). Check freshness (>30 days surfaces a warning).
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — hard-gate enforcement, read order, Cold/Warm Start prompts, staleness check, constraint interview, Out-of-Scope persistence on write all there.

---

## Artifact Contract

- **Path:** `.agents/skill-artifacts/meta/sketches/prioritize-[YYYY-MM-DD].md` (one per root cause; re-run renames prior to `prioritize.v[N].md` and increments)
- **Lifecycle:** `sketch` (per `agent-skills/CLAUDE.md` taxonomy)
- **Frontmatter fields:** `skill`, `version` (integer, increment on re-run), `date` (ISO-8601), `status` (per Completion Status below)
- **Required body sections (in order — cross-stack contract):** Phase 1 (Initiatives, 5-10 + 2-4 unconventional) · Phase 2 (Forced Ranking, ICE Scoring table, Decisions table) · Cut line declaration · Next Step block (full schemas in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE])
- **Optional sections (append only when applicable):** Known Issues · Revisited Out-of-Scope · Change Log
- **Side effects (mandatory on PASS or done_with_concerns per `procedures/dispatch-mechanics.md`):**
  - Write one file per Kill to `.agents/skill-artifacts/meta/out-of-scope/[kebab-name].md` (format: Decided / Context / Decision / Revisit if — preserved verbatim from original SKILL.md)
  - Rename any prior `prioritize-*.md` for the same root cause to `prioritize.v[N].md`
  - **Experience write-back: NONE.** Original SKILL.md explicitly states "prioritize doesn't seed dimensions to experience/ — initiatives are project-specific tactics, not stable user-profile state." Preserved here verbatim.
- **Consumed by:** `funnel-planner` (Target Metric per Proceed initiative feeds Target Table baselines); `campaign-plan` (Decision = Proceed filters which initiatives need campaign briefs); `system-architecture` (Mechanic per Proceed feeds technical scoping); future `prioritize` re-runs (revisited Out-of-Scope detection)
- **Cross-stack OUTPUT contract:** Phase 1 initiative format + ICE Scoring table schema + Decisions table schema + Cut line statement + Next Step block + Out-of-Scope file format are all load-bearing — schema changes require atomic update of consumers (per `anti-patterns.md` row "Cross-stack contract drift")

---

## Agent Manifest

| # | Agent | Layer | Focus |
|---|-------|-------|-------|
| 1 | [research-agent](agents/research-agent.md) | L1 | Root cause validation, case studies via WebSearch, constraint summary |
| 2 | [initiative-generator-agent](agents/initiative-generator-agent.md) | L1.5 (parallel) | 5-10 standard initiatives with Hypothesis/Mechanic/Target Metric/Anti-generic check |
| 3 | [unconventional-agent](agents/unconventional-agent.md) | L1.5 (parallel) | 2-4 asymmetric/non-obvious tactics with risk assessments |
| 4 | [ranking-agent](agents/ranking-agent.md) | L2 (sequential) | Strict 1-through-N forced ranking with reasoning per rank |
| 5 | [ice-scoring-agent](agents/ice-scoring-agent.md) | L2 (sequential) | Evidence-backed ICE scores + differentiation check (no >2 sharing a total) |
| 6 | [cut-line-agent](agents/cut-line-agent.md) | L2 (sequential) | Proceed/Park/Kill decisions, capacity assessment, Proceed validation |
| 7 | [critic-agent](agents/critic-agent.md) | L2 (final) | 8-point quality gate (full rubric + failure routing in `agents/critic-agent.md`). Max 2 rewrite cycles |

---

## Routing + Dispatch

Two routes; chosen at Pre-Dispatch and echoed in the Warm Start confirmation (operator can override):

| Route | When | Graph |
|---|---|---|
| **A — Full Analysis** (default) | Any non-trivial solution design | research → (initiative-generator + unconventional in parallel) → merge + user feedback gate → ranking → ice-scoring → cut-line → critic |
| **B — Quick Design** | User has candidate approaches; speed > breadth; OR `--fast` flag | research → initiative-generator → ranking → ice-scoring → cut-line → critic (skip unconventional-agent + Layer 1.5 user feedback gate) |

Mechanics (Route Selection table, Layer 1/1.5/2 spawn details, merge step + user feedback gate, critic FAIL routing, single-agent fallback, post-write side effects, Out-of-Scope Persistence file format, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — 8-pattern catalog (covered by critic gates 1-8 in `agents/critic-agent.md`) plus 2 cross-cutting failures (cross-stack contract drift + out-of-scope persistence skipped) caught by operator review and post-write side effects respectively.

---

## Completion Status

Every run ends with explicit status:

- **DONE** — initiatives generated, ICE-scored, ranked, cut-line drawn (≤3 above), kill criteria attached, critic PASS
- **DONE_WITH_CONCERNS** — ranking complete but with sizing/impact uncertainty flagged at item level (e.g., effort estimates speculative, ICE inputs from interview not data); OR critic loop cap reached with surfaceable gate failures (pinned at top as Known Issues)
- **BLOCKED** — `.agents/skill-artifacts/meta/records/diagnose-*.md` missing AND no other root-cause source available; STOP gate per Critical Gate semantics — recommend `diagnose` first (hard-gated, no INTERVIEW substitute)
- **NEEDS_CONTEXT** — diagnose available but `research/product-context.md` missing for impact estimation; recommend `icp-research`

---

## References

| Reference | Load class | Use For |
|---|---|---|
| [playbook.md](references/playbook.md) | PLAYBOOK | Why this skill exists, anti-generic test, forced-ranking ceiling, ≤3 cut-line philosophy, churn special case, unconventional-scan rationale, when NOT to use |
| [_shared/before-starting-check.md](references/_shared/before-starting-check.md) | PLAYBOOK | Pre-Pre-Dispatch read pattern (canonical at `references/`, synced) |
| [_shared/mode-resolver.md](references/_shared/mode-resolver.md) | PROCEDURE | `--fast` / `--deep` behavior contract |
| [_shared/pre-dispatch-protocol.md](references/_shared/pre-dispatch-protocol.md) | PROCEDURE | Canonical Pre-Dispatch spec |
| [_shared/hypothesis-framework.md](references/_shared/hypothesis-framework.md) | PROCEDURE | If/Then/Because structure and templates by initiative type (use Framing B — Predictive) |
| [procedures/pre-dispatch.md](references/procedures/pre-dispatch.md) | PROCEDURE | Hard-gate enforcement, read order, Cold/Warm Start prompts, staleness check, constraint interview, write-back map |
| [procedures/dispatch-mechanics.md](references/procedures/dispatch-mechanics.md) | PROCEDURE | Route A/B details, Layer 1/1.5/2 spawn mechanics, merge step + user feedback gate, critic FAIL routing, Out-of-Scope Persistence, chain position, skill deference |
| [format-conventions.md](references/format-conventions.md) | PROCEDURE | Artifact template, Phase 1 initiative format, ICE Scoring + Decisions table schemas, Cut line declaration, Next Step block, Out-of-Scope file format |
| [examples/prioritize-walkthrough.md](references/examples/prioritize-walkthrough.md) | EXAMPLE | Full Route A walkthrough on a 2-root-cause acquisition + activation case |
| [anti-patterns.md](references/anti-patterns.md) | ANTI-PATTERN | 8 named anti-patterns + cross-stack drift + out-of-scope persistence skipped, with detection + examples + fixes + agent ownership |
| [initiative-types.md](references/initiative-types.md) | data catalog | Hero vs Support classification |
| [ice-scoring-rubric.md](references/ice-scoring-rubric.md) | data catalog | Detailed scoring calibration with scored examples |
| [initiative-planning.md](references/initiative-planning.md) | data catalog | Detailed execution planning for complex initiatives |
| [churn-playbook.md](references/churn-playbook.md) | data catalog | Cancel flow, dunning, health scores, exit-reason mapping (when root cause is churn) |
| [churn-cancel-flow-templates.md](references/churn-cancel-flow-templates.md) | data catalog | Email templates for cancel flow + dunning sequences |
| [churn-health-score-guide.md](references/churn-health-score-guide.md) | data catalog | Health score implementation + calibration |
| `research-skills/CLAUDE.md` | reference | Stack-level conventions (Pre-Dispatch Protocol, Complexity Routing, Multi-Agent Skills) |
