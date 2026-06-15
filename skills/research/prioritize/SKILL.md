---
name: prioritize
description: "Brainstorms strategic solutions when the problem or goal is already clear — generates initiatives, force-ranks them, scores trade-offs with evidence-backed ICE, and draws a cut line with kill criteria. Use when you know the problem and need to decide what to build or pursue first. Not for diagnosing what the problem is (use diagnose) or engineering task lists (use breakdown-tasks). For numeric targets after prioritizing, see plan-funnel; for technical architecture of chosen initiatives, see architect-system."
argument-hint: "[problem or goal to solve]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.1.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Solution Design — Orchestrator

*Strategy — Step 2 of 4. Brainstorms strategic solutions to a confirmed problem, surfaces unconventional tactics, and ranks them with evidence-backed scoring against explicit trade-offs.*

**Core Question:** "What's the highest-impact thing we can do about this?"

[Read [`references/playbook.md`](references/playbook.md) [PLAYBOOK] for why this skill exists, the anti-generic test, forced-ranking ceiling, ≤3 cut-line philosophy, churn special case, unconventional-scan rationale, and when NOT to use.]

---

## Critical Gates — Read First

1. **Every initiative hypothesis MUST name the root cause.** Generic growth ideas generate low-impact, unfocused initiatives. If the hypothesis "because" clause doesn't reference the confirmed root cause / problem, the initiative is untethered.
2. **Force-rank BEFORE scoring — ranking prevents "everything is a 6."** The forced ranking sets the ceiling for ICE scores. If you ranked it #1, its ICE should be highest.
3. **Anti-generic test is mandatory — "would this help ANY company?"** Delete the root cause reference from an initiative. If it still makes sense for any company, it's generic. Rewrite.
4. **≤3 initiatives above cut line — force the constraint.** More than 3 active initiatives means none get full attention. Surface trade-offs honestly; parked initiatives have their turn after the current batch ships.

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: deep`; `--fast` forces Route B (skip unconventional-agent) with critic gate collapsed to single pass. **Hard gate (Critical Gates above) STILL enforced under `--fast`** — safety gates supersede mode-resolver downgrade.
   Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory (`docs/forsvn/artifacts/meta/sketches/prioritize-*.md`) and Out-of-Scope path (`docs/forsvn/artifacts/meta/out-of-scope/`).
2. Read `.forsvn/index/manifest.json` — find the matching `diagnose-*.md` (required) and prior `prioritize-*.md` (if any). Check freshness (>30 days surfaces a warning).
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — hard-gate enforcement, read order, Cold/Warm Start prompts, staleness check, constraint interview, Out-of-Scope persistence on write all there.

---

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/meta-prioritize-<YYYY-MM-DD>-<slug>.md` (flat v2; one per root cause; re-run renames prior with `.v[N]`)
- **Lifecycle:** `sketch` · **Review surface:** `none` (decision_state: not_required)
- **Frontmatter:** `skill`, `version`, `date`, `status`, `stack`=meta, `review_surface`=none
- **Body sections (cross-stack contract):** Phase 1 Initiatives (5-10 + 2-4 unconventional) · Phase 2 (Forced Ranking, ICE Scoring, Decisions) · Cut line · Next Step
- **Side effects on PASS:** one file per Kill written to `docs/forsvn/artifacts/meta/out-of-scope/[name].md`; experience write-back is **NONE** (initiatives are project-specific, not stable profile state)

Full schemas, consumer map, and cross-stack load-bearing field list: [`references/procedures/artifact-contract.md`](references/procedures/artifact-contract.md) [PROCEDURE].

---

## Agent Manifest

| # | Agent | Layer | Focus |
|---|-------|-------|-------|
| 1 | [research-agent](agents/research-agent.md) | L1 | Root cause validation, case studies via WebSearch, constraint summary |
| 2 | [initiative-generator-agent](agents/initiative-generator-agent.md) | L1.5 ‖ | 5-10 standard initiatives with Hypothesis/Mechanic/Target Metric/Anti-generic check |
| 3 | [unconventional-agent](agents/unconventional-agent.md) | L1.5 ‖ | 2-4 asymmetric/non-obvious tactics with risk assessments |
| 4 | [ranking-agent](agents/ranking-agent.md) | L2 seq | Strict 1-through-N forced ranking with reasoning per rank |
| 5 | [ice-scoring-agent](agents/ice-scoring-agent.md) | L2 seq | Evidence-backed ICE scores + differentiation check (no >2 sharing a total) |
| 6 | [cut-line-agent](agents/cut-line-agent.md) | L2 seq | Proceed/Park/Kill decisions, capacity assessment, Proceed validation |
| 7 | [critic-agent](agents/critic-agent.md) | L2 final | 9-point quality gate (rubric + failure routing in agent file). Max 2 rewrite cycles |

---

## Routing + Dispatch

Two routes; chosen at Pre-Dispatch and echoed in the Warm Start confirmation (operator can override):

| Route | When |
|---|---|
| **A — Full Analysis** (default) | Any non-trivial solution design |
| **B — Quick Design** | User has candidate approaches; speed > breadth; OR `--fast` flag |

Entry mode is orthogonal to route: **root-cause** (default, diagnose-gated) vs **ideation** (input is a candidate set — discover shortlist, debate output, or a "generate ideas and rank them" ask; the diagnose gate is replaced by a stated ranking anchor and Phase 1 may expand at volume). Resolution + mechanics: `references/procedures/pre-dispatch.md` § Entry-mode resolution.

Mechanics (route graphs, Layer 1/1.5/2 spawn details, merge step + user feedback gate, critic FAIL routing, single-agent fallback, post-write side effects, Out-of-Scope Persistence file format, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — 8-pattern catalog (mapped onto the critic's 9-point quality gate in `agents/critic-agent.md`) plus 2 cross-cutting failures (cross-stack contract drift + out-of-scope persistence skipped).

---

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

Every run ends with explicit status:

- **DONE** — initiatives generated, ICE-scored, ranked, cut-line drawn (≤3 above), kill criteria attached, critic PASS
- **DONE_WITH_CONCERNS** — ranking complete but with sizing/impact uncertainty flagged at item level (e.g., effort estimates speculative, ICE inputs from interview not data); OR critic loop cap reached with surfaceable gate failures (pinned at top as Known Issues)
- **BLOCKED** — root-cause mode: `id:diagnose` unresolvable (no diagnose artifact in the manifest) AND no other root-cause source available; STOP gate per Critical Gate semantics — recommend `diagnose` first (hard-gated, no INTERVIEW substitute). Ideation mode: no ranking anchor obtainable
- **NEEDS_CONTEXT** — diagnose available but `id:product-context` unresolvable for impact estimation; recommend `research-icp`

## Next Step

After cut line is drawn: feed Proceed initiatives forward — `plan-funnel` (numeric targets per initiative), `plan-campaign` (campaign briefs for Proceed items), `architect-system` (technical scoping per Mechanic). Re-run `prioritize` when new root cause surfaces or after a batch ships.

---

## References

- `references/playbook.md` — why this exists, anti-generic test, ≤3 cut-line philosophy, churn special case, when NOT to use
- `references/procedures/{pre-dispatch, dispatch-mechanics, artifact-contract}.md` — read-order + hard gates · route graphs + side effects · full contract + consumer map
- `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol, hypothesis-framework, artifact-contract-template}.md`
- `references/format-conventions.md` — Phase 1 format, ICE/Decisions table schemas, Cut line, Next Step, Out-of-Scope file format
- `references/anti-patterns.md` — 8 named anti-patterns + cross-stack drift + out-of-scope persistence skipped
- `references/examples/prioritize-walkthrough.md` — full Route A walkthrough on a 2-root-cause acquisition + activation case
- Data catalogs: `initiative-types.md` · `ice-scoring-rubric.md` · `initiative-planning.md` · `churn-{playbook, cancel-flow-templates, health-score-guide}.md`
- `research-skills/CLAUDE.md` — stack-level conventions
