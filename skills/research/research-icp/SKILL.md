---
name: research-icp
description: "Builds ideal customer profiles and buyer personas from real voice-of-customer evidence — analyzes demographics, pain points, jobs-to-be-done, decision psychology, and online habitat for a target market. Use to define who you're talking to before messaging, channel, or positioning work. Foundational: its output feeds 13+ downstream skills. Not for competitive positioning (use prioritize) or campaign planning (use plan-campaign). For brand identity from audience data, see create-brand; for market sizing, see research-market."
argument-hint: "[product or target market]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "3.1.0"
  budget: deep
  estimated-cost: "$1-3"
---

# ICP Research — Orchestrator

Foundational skill for all stacks. Coordinates sub-agents to build audience intelligence from real research, not assumptions. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Why this skill exists, creative-vs-structural framing, 7-gate quality summary: [`references/playbook.md`](references/playbook.md).

**Core question:** Who exactly are we talking to and what keeps them up at night?

## Critical Gates — load first

Non-negotiable before any agent dispatches:

1. **No guessed personas — VoC or interview evidence only.** Every attribute traces to product context, brief, user input, or VoC quotes. Fabricated personas mislead 13+ downstream skills.
2. **Don't skip habitat mapping.** IMC planning needs specific community names with density and engagement type. "They're on LinkedIn" is not actionable.
3. **Max 2 personas.** More dilutes focus. If 4+ segments surface, force-rank by revenue potential; document cuts in Segment Rationale.
4. **Stale product context (>30 days) → recommend re-run.** If `research/product-context.md` `Date` is older than 30 days, warn and recommend re-run. Proceeding → note "stale product context" in artifact header.
5. **≥5 independent sources per persona** ([`references/confidence-and-bias.md`](references/confidence-and-bias.md) § 3). Below 5 → `Hypothesis Mode` + `Confidence: L`; critic returns NEEDS_CONTEXT; voc-collector gathers more (or operator invokes `--hypothesis-mode` with override logged).
6. **Every finding carries a confidence label** (`confidence-and-bias.md` § 1). Pains, biases, objections, trust signals, emotional drivers — all carry inline `[Confidence: H | M | L | sources: N]`. `L` findings must be promoted, moved to Red Flags as hypotheses, or dropped — never shipped as findings.
7. **Sample Bias section is mandatory** (`confidence-and-bias.md` § 2). Name source-type mix, dataset-specific skews, mitigations applied, known gaps. Critic Gate 9 enforces specificity — generic disclaimers FAIL.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode resolution** ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)). `budget: deep`. `--fast` collapses to Route A (skips habitat-agent + decision-psychology-agent) IF Warm Start has sufficient context; critic gate collapses to single pass. **Cold Start STILL fires under `--fast`** when context is missing — `--fast` does NOT authorize hallucinating personas (Critical Gate 1 floor).
- Read `.forsvn/index/manifest.json` — find any prior `research/icp-research.md` (re-run signal) and check `research/product-context.md` staleness (Gate 4).
- Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) — auto-scan, Warm/Cold Start, 5-question Cold Start prompt, read order, Write-back map.

## Quality Gate — critic checklist (gates 1-9)

Gate 10 (Brief Alignment) is critic-agent-only. Full 10-gate rubric in `agents/critic-agent.md`.

- [ ] Every VoC quote includes platform name and traces to a real source (not agent-generated)
- [ ] Each persona has a habitat map with specific channels and supporting evidence. Aim for 3+; document why if fewer.
- [ ] Each emotional driver traces to at least 2 specific quotes
- [ ] Decision psychology names specific cognitive biases and objections (not generic "they need trust")
- [ ] At least 15 VoC quotes across categories
- [ ] Maximum 2 personas
- [ ] Every finding carries `[Confidence: H | M | L | sources: N]` per `references/confidence-and-bias.md`. No unresolved `L` shipped.
- [ ] Sample Bias section present and specific to this dataset. Generic disclaimers FAIL.
- [ ] Each persona meets the ≥5 independent-sources floor. Below 5 → NEEDS_CONTEXT (or `--hypothesis-mode` with logged override).

## Artifact Contract

- **Paths:** `research/icp-research.md` (canonical audience record) + `research/product-context.md` (canonical foundational record — research-icp IS the producer).
- **Lifecycle:** `canonical` — edited in place by humans; on re-run rename prior to `research/icp-research.v[N].md` and increment.
- **Frontmatter:** `skill`, `version` (integer artifact version), `date` (ISO-8601), `status`, `stack` (=research), `review_surface` (=html — gated canonical artifact gets the EARTH-themed HTML preview while `decision_state: pending`), `decision_state`. See [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md) for the v2 schema.
- **Required body sections (in order — cross-stack contract):** Persona 1 (Demographics + Pain Profile + Decision Psychology + Habitat Map) · Persona 2 (if applicable, max 2) · Top 3 Emotional Drivers · Red Flags · Next Step. Full template (60+ lines): [`references/format-conventions.md`](references/format-conventions.md).
- **Optional sections:** Segment Rationale (3+ segments surfaced, 2 cut per Gate 3) · Known Issues (critic FAILed twice and artifact ships with annotations).
- **Side effects (mandatory on PASS / done_with_concerns):**
  - Write `research/icp-research.md`.
  - Write or update `research/product-context.md` (8-section schema + Canonical Terminology).
  - Experience write-back per `procedures/pre-dispatch.md` Write-back map: Q1 → `experience/product.md` + mirror to `research/product-context.md` Product section; Q2/Q3/Q4 → `experience/audience.md`. **Q5 (Route) is NOT persisted — routing only.**
  - Rename any prior `research/icp-research.md` to `research/icp-research.v[N].md` on re-run.
- **Consumed by:** plan-campaign · create-brand · write-copy · brief-landing-page · brief-graphic · write-ad · write-outreach · research-shortform · brief-shortform · humanmaxxing · optimize-seo · polish-vn · write-social.
- **Cross-stack OUTPUT contract:** Artifact Template structure + Habitat Map 5-column schema + Top 3 Emotional Drivers + Next Step block + product-context.md 8-section schema are load-bearing — schema changes require atomic update of 13 downstream consumers (`anti-patterns.md` row "Cross-stack contract drift").

## Chain Position

**Previous:** none (or any skill needing audience context — Route C) | **Next:** `plan-campaign`, `create-brand`.

**Foundational role:** Creates `research/product-context.md` consumed by 13+ downstream skills. Run first for significantly better downstream output.

**Re-run triggers:** audience pivot, new market entry, major product changes, quarterly for active products.

**Skill deference:** competitive analysis / market sizing → `research-market`. Campaign planning from personas → `plan-campaign`. Brand identity using audience data → `create-brand`. Business-problem diagnosis → `diagnose`.

## Routing + Dispatch

Three routes (A / B / C) — chosen at Pre-Dispatch (Cold Start Q5 or auto-inferred per `procedures/pre-dispatch.md § Route Selection`). Agent table + route graphs + pattern-catalog map: [`references/agent-manifest.md`](references/agent-manifest.md). Full 6-step Dispatch Protocol + single-agent fallback + critic FAIL routing: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before output ships — 12 named anti-patterns (7 from original body + 5 cross-cutting: hallucination under `--fast`, canonical product-context.md mirror skip, Q5 routing-persistence, cross-stack contract drift, write-back skipped/partial). Detection + bad/good examples + verified agent ownership against `critic-agent.md` Rewrite Routing Table.

## Completion Status

- **DONE** — full ICP synthesized, critic PASS, all 5-7 dimensions populated with quoted evidence.
- **DONE_WITH_CONCERNS** — critic PASS but Route A used (habitat/decision-psychology omitted), OR VoC quote density thin (flagged in artifact).
- **BLOCKED** — irreconcilable persona contradictions (e.g., two distinct buyers with no merge path); needs user scope decision.
- **NEEDS_CONTEXT** — `research/product-context.md` missing AND user can't describe product/audience; recommend `/discover` first.

## References

- [`references/playbook.md`](references/playbook.md) — why, creative-vs-structural framing, foundational-role inventory, when NOT to use
- [`references/agent-manifest.md`](references/agent-manifest.md) — agent table, 3 routes, pattern-catalog map
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md), [`mode-resolver.md`](references/_shared/mode-resolver.md), [`pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md), [`confidence-labeling.md`](references/_shared/confidence-labeling.md)
- [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md), [`dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md)
- [`references/format-conventions.md`](references/format-conventions.md), [`anti-patterns.md`](references/anti-patterns.md), [`confidence-and-bias.md`](references/confidence-and-bias.md)
- Pattern catalogs: [`voice-of-customer.md`](references/voice-of-customer.md), [`customer-interviews.md`](references/customer-interviews.md), [`habitat-mapping.md`](references/habitat-mapping.md), [`icp-to-imc-handoff.md`](references/icp-to-imc-handoff.md)
- Walkthrough: [`references/examples/icp-walkthrough.md`](references/examples/icp-walkthrough.md)
