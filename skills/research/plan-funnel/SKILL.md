---
name: plan-funnel
description: "Models business funnels with numeric targets — works backward from a revenue goal to the required traffic, conversion rates, and unit economics, with every target carrying a baseline and justification. Use to set growth targets, model an LTV:CAC funnel, or check whether the numbers behind a plan actually work. Not for prioritizing what to build (use prioritize) or diagnosing a metric decline (use diagnose). For channel-level campaign planning, see plan-campaign."
argument-hint: "[revenue target or business goal]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.30-0.80"
---

# Funnel Planner — Orchestrator

*Strategy — Step 3 of 4. Numeric funnel + unit-economics model: rates, traffic, sensitivity bands. Drives downstream channel-mix + budget decisions.*

**Core Question:** "Do the numbers actually work?"

> Philosophy, improvement-factor calibration, 9-channel reference, growth-motion ID, when NOT to use: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

---

## Critical Gates — Read First

Six hard gates (fire under `--fast` too — full detail in [`references/procedures/critical-gates.md`](references/procedures/critical-gates.md) [PROCEDURE]):

1. Numeric baseline on every target — zero TBDs; benchmarks OK with confidence flag.
2. Justification cited — baseline + improvement factor + reasoning, no naked numbers.
3. 70% test — partial achievement must still be valuable (higher/lower/binary rules).
4. LTV:CAC ≥ 3:1 for acquisition, else explicit Pricing Health Signals flag.
5. Growth motion identified — PLG / SLG / Hybrid drives model + channel-mix.
6. Three-outcome validation — Business (required), Brand, Community; N/A needs justification.

## Quality Gate

Critic 4-point rubric (pass-all): numeric baselines · justified targets · 70% test · LTV:CAC. FAIL → rewrite loop, max 2 cycles, then `done_with_concerns` with failures pinned as Known Issues.

---

## Before Starting

Per [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK]:

| Artifact | Source | Required? |
|---|---|---|
| `docs/forsvn/artifacts/meta/sketches/prioritize-*.md` | prioritize | **Hard gate** — missing → NEEDS_CONTEXT |
| Prior `targets-*.md` (same initiative) | self | Optional — enables Route C delta |
| `.forsvn/index/manifest.json` | manifest-sync | Recommended — >30d warns |
| Industry baselines | `references/benchmarks.md` | Fallback when user lacks rates |

**Mode** (`standard`): `--fast` forces Route C if conditions hold, else Route B (no critic). Hard gates still enforced. `references/_shared/mode-resolver.md` [PROCEDURE]. **Pre-Dispatch** (hard-gate, read order, Cold/Warm Start, staleness, growth-motion ID, write-back): `references/procedures/pre-dispatch.md` [PROCEDURE].
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

---

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/meta-plan-funnel-<YYYY-MM-DD>-targets-<slug>.md` (flat v2; re-run renames prior `.v[N]`)
- **Lifecycle:** `snapshot` · **review_surface:** `none`
- **Frontmatter:** `skill`, `version`, `date`, `status`, `stack` (=meta), `review_surface` (=none)
- **Required sections (cross-stack contract):** Funnel Stages · Target Table · Channel → Funnel Stage Map · Three-Outcome Validation · Validation · Baselines
- **Side effects:** append baselines + growth motion + unit economics to `experience/business.md` (mandatory on PASS / done_with_concerns)
- **Consumed by:** `plan-campaign`, `run-pipeline`, future re-runs (delta detection)

Full schema: [`references/procedures/contract.md`](references/procedures/contract.md) + [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

---

## Agents + Dispatch

6 sub-agents (full focus in `agents/`):

- **L1 parallel:** model-selection (model + stage map + channel-to-stage), baseline-collector (rates, benchmarks, unit-economics)
- **L2 sequential:** target-setter (targets + improvement factors + sensitivity bands) → sanity-check (6-pattern subset) → stress-test (revenue, 70%, ownership, measurement) → critic (4-point Quality Gate, max 2 rewrite cycles)

Three routes — A Full (`--deep` OR 3+ initiatives across 2+ models: L1 parallel → merge → L2 seq) · B Standard default (known model, 1-2 initiatives: target → sanity → critic) · C Fast Bump (`--fast` + ≤3 sentences + single initiative + prior `targets-*.md`: target-setter only).

Spawn mechanics, merge, critic FAIL routing, fallbacks, side effects, chain position: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

---

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 10-pattern catalog (vanity metrics, feature factory, sandbagging, aspirational math, orphan owners, input traps, unit-economics blind spots, cross-stack contract drift, +2). Sanity-check scans 6; critic reads all. Re-read before ship.

---

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — model selected, baselines collected, targets stress-tested, critic PASS
- **DONE_WITH_CONCERNS** — targets computed but baselines thin/estimated, or critic loop cap hit (failures pinned as Known Issues)
- **BLOCKED** — no baseline data AND LTV:CAC <3:1; needs business-model fix first (defer to `diagnose`)
- **NEEDS_CONTEXT** — `prioritize-*.md` missing OR baselines absent; recommend `prioritize` (hard-gated, no INTERVIEW substitute)

## Next Step

On PASS, hand the artifact to `plan-campaign` for channel-mix execution. On drift or new initiatives, re-run for delta detection.

---

## References

- Worked example: [`references/examples/funnel-planner-walkthrough.md`](references/examples/funnel-planner-walkthrough.md) [EXAMPLE]
- Procedures: `references/procedures/{critical-gates, contract, pre-dispatch, dispatch-mechanics}.md`
- Shared: `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol, artifact-contract-template}.md`
- Data catalogs: `funnel-models.md`, `benchmarks.md`, `unit-economics.md`, `stress-tests.md`, `format-conventions.md`
- Agents in `agents/`; `critic-agent.md` holds the canonical rubric. Stack conventions: `research-skills/CLAUDE.md`.
