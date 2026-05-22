---
name: research-icp
description: "Builds ideal customer profiles and buyer personas from real voice-of-customer evidence — analyzes demographics, pain points, jobs-to-be-done, decision psychology, and online habitat for a target market. Use to define who you're talking to before messaging, channel, or positioning work. Foundational: its output feeds 13+ downstream skills. Not for competitive positioning (use prioritize) or campaign planning (use plan-campaign). For brand identity from audience data, see create-brand; for market sizing and competitor landscape, see research-market."
argument-hint: "[product or target market]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "3.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# ICP Research — Orchestrator

*Communication — Step 1 of 4. Foundational skill for all stacks. Coordinates sub-agents to build audience intelligence from real research, not assumptions.*

**Core Question:** "Who exactly are we talking to and what keeps them up at night?"

[Read [`references/playbook.md`](references/playbook.md) [PLAYBOOK] for why this skill exists, the creative-vs-structural framing, 7-gate quality summary, foundational-role inventory across 4 stacks, and when NOT to use.]

---

## Critical Gates — Read First

Non-negotiable constraints before dispatching any agent:
1. **No guessed personas — VoC or interview evidence only.** Every attribute traces to product context, brief, user input, or VoC quotes. Fabricated personas mislead 13+ downstream skills.
2. **Don't skip habitat mapping.** IMC planning needs specific community names with density and engagement type. "They're on LinkedIn" is not actionable.
3. **Max 2 personas.** More dilutes focus for 13+ downstream skills. If research reveals 4+ segments, force-rank by revenue potential.
4. **Stale product context (>30 days) → recommend re-running.** If `research/product-context.md` `Date` field is older than 30 days, warn and recommend re-run. If user proceeds, note "stale product context" in artifact header.
5. **≥5 independent sources per persona.** Per [`references/confidence-and-bias.md`](references/confidence-and-bias.md) § 3 — total count of independent sources contributing to a persona across pains + biases + objections + trust signals must be ≥5. Below 5 → persona is `Hypothesis Mode` with `Confidence: L`, critic returns NEEDS_CONTEXT, voc-collector gathers more (or operator invokes `--hypothesis-mode` with override logged).
6. **Every finding carries a confidence label.** Pains, biases, objections, trust/distrust signals, and emotional drivers all carry inline `[Confidence: H | M | L | sources: N]` tags per [`references/confidence-and-bias.md`](references/confidence-and-bias.md) § 1. Findings labeled `L` MUST be promoted (collect more sources), moved to Red Flags as hypotheses, or dropped — never shipped as findings.
7. **Sample Bias section is mandatory.** Per [`references/confidence-and-bias.md`](references/confidence-and-bias.md) § 2 — artifact must name source-type mix, known skews specific to this dataset (not generic disclaimers), mitigations applied, and known gaps. Critic Gate 9 enforces specificity.

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK].

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: deep`; `--fast` collapses to Route A (Quick ICP) IF sufficient context exists for Warm Start (skips habitat-agent + decision-psychology-agent); critic gate collapses to single pass. **Cold Start STILL fires under `--fast`** when context is missing — `--fast` does NOT authorize hallucinating personas (Critical Gate 1 floor; safety gates supersede mode-resolver downgrade).
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output paths match canonical inventory (`research/icp-research.md` + `research/product-context.md`, both `canonical` lifecycle).
2. Read `.forsvn/index/manifest.json` — find any prior `research/icp-research.md` (re-run signal) and check `research/product-context.md` staleness (Critical Gate 4).
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — auto-scan first, then Warm/Cold Start, 5-question Cold Start prompt, read order, Write-back map (Q1 → product.md AND research/product-context.md as canonical; Q2-Q4 → audience.md; Q5 routing-only — verbatim from original SKILL.md) all there.

---

## Quality Gate

Critic agent verifies before delivery — body checklist below is the 9-bullet operator reminder for gates 1-9; Gate 10 (Brief Alignment, renumbered) is critic-agent-only. Full 10-gate rubric in `agents/critic-agent.md`:
- [ ] Every VoC quote includes platform name and traces to a real source (not agent-generated)
- [ ] Each persona has a habitat map with specific channels and supporting evidence. Aim for 3+; document why if fewer.
- [ ] Each emotional driver traces to at least 2 specific quotes
- [ ] Decision psychology names specific cognitive biases and objections (not generic "they need trust")
- [ ] At least 15 VoC quotes across categories
- [ ] Maximum 2 personas
- [ ] Every finding (pain / bias / objection / trust signal / driver) carries `[Confidence: H | M | L | sources: N]` tag per [`references/confidence-and-bias.md`](references/confidence-and-bias.md). No unresolved `L` findings shipped.
- [ ] Sample Bias section present and specific to this dataset (source-type mix, named skews, mitigations applied, known gaps). Generic disclaimers FAIL.
- [ ] Each persona meets the ≥5 independent-sources floor per [`references/confidence-and-bias.md`](references/confidence-and-bias.md) § 3. Below 5 → NEEDS_CONTEXT (or `--hypothesis-mode` with logged override).

---

## Artifact Contract

- **Path:** `research/icp-research.md` (canonical, top-level) + `research/product-context.md` (canonical foundational record — research-icp IS the producer)
- **Lifecycle:** `canonical` (per `agent-skills/CLAUDE.md` taxonomy — edited in place by humans, kept forever; on re-run rename prior to `research/icp-research.v[N].md` and increment)
- **Frontmatter fields:** `skill`, `version` (integer artifact version, increment on re-run), `date` (ISO-8601), `status` (per Completion Status below)
- **Required body sections (in order — cross-stack contract):** Persona 1 (Demographics + Pain Profile + Decision Psychology + Habitat Map) · Persona 2 (if applicable, max 2) · Top 3 Emotional Drivers · Red Flags · Next Step (full schema + 60+ line Artifact Template in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE])
- **Optional sections (append only when applicable):** Segment Rationale (when 3+ segments surfaced and 2 were cut per Critical Gate 3) · Known Issues (when critic FAILed twice and artifact ships with annotations)
- **Side effects (mandatory on PASS or done_with_concerns per `procedures/dispatch-mechanics.md`):**
  - Write `research/icp-research.md` (canonical audience record)
  - Write or update `research/product-context.md` (8-section schema + Canonical Terminology — canonical foundational record)
  - Experience write-back per `procedures/pre-dispatch.md` Write-back map: Q1 (Product) → `experience/product.md` AND mirror to `research/product-context.md` Product section (canonical foundational role); Q2 (Buyer) + Q3 (Pains) + Q4 (Geo) → `experience/audience.md`. **Q5 (Route) is NOT persisted** — routing-only. Preserved verbatim from original SKILL.md.
  - Rename any prior `research/icp-research.md` to `research/icp-research.v[N].md` on re-run
- **Required Artifacts** (per `format-conventions.md`):

  | Artifact | Source | If Missing |
  |----------|--------|------------|
  | `product-context.md` | research-icp | **INTERVIEW** for 8 product dimensions, save to `research/product-context.md`. |

- **Optional Artifacts** (per `format-conventions.md`):

  | Artifact | Source | Benefit |
  |----------|--------|---------|
  | `diagnose.md` | diagnose (hungv47/research-skills) | Problem context sharpens audience research |

- **Consumed by:** plan-campaign (personas + habitat for channel mix); create-brand (voice + emotional drivers + red flags); write-copy (target reader + pain + voice + objections); brief-landing-page (personas + decision psychology); brief-graphic (personas + red flags); write-ad (Pain Profile + objections + trust signals); write-outreach (demographics + decision psychology trigger + research path); research-shortform / brief-shortform (habitat + emotional drivers); humanmaxxing / optimize-seo / polish-vn (voice + canonical terminology); write-social (personas + voice + emotional drivers)
- **Cross-stack OUTPUT contract:** Artifact Template structure + Habitat Map 5-column schema + Top 3 Emotional Drivers section + Next Step block + product-context.md 8-section schema are all load-bearing — schema changes require atomic update of 13 downstream consumers (per `anti-patterns.md` row "Cross-stack contract drift")

---

## Chain Position

**Previous:** none (or any skill needing audience context — Route C) | **Next:** `plan-campaign`, `create-brand` (marketing-skills).

**Foundational role:** Creates `research/product-context.md`, used by 13+ downstream skills across all 4 stacks (comms, strategy, prod, design). Run first for significantly better downstream output.

**Re-run triggers (operator judgment):** Audience pivot, new market entry, major product changes, or quarterly for active products.

### Skill Deference
- Competitive analysis / market sizing → `research-market`
- Campaign planning from personas → `plan-campaign`
- Brand identity using audience data → `create-brand`
- Diagnose a business problem (not audience) → `diagnose`

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Persona Agent | 1 (parallel) | `agents/persona-agent.md` | Demographics, role, goals, frustrations — builds persona cards |
| VoC Collector Agent | 1 (parallel) | `agents/voc-collector-agent.md` | Voice-of-customer quote collection from multiple platforms |
| Habitat Agent | 1 (parallel) | `agents/habitat-agent.md` | Platform/community mapping — where the ICP lives online |
| Pain Analysis Agent | 2 (sequential) | `agents/pain-analysis-agent.md` | Surface → Hidden → Emotional pain classification from VoC evidence |
| Decision Psychology Agent | 2 (sequential) | `agents/decision-psychology-agent.md` | Trigger events, research behavior, cognitive biases, objections |
| Synthesis Agent | 2 (sequential) | `agents/synthesis-agent.md` | Merges all fragments into coherent ICP profile |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Quality gate — PASS/FAIL evaluation with rewrite routing |

---

## Routing + Dispatch

Three routes; chosen at Pre-Dispatch (Cold Start Q5 or auto-inferred per `procedures/pre-dispatch.md` § "Route Selection"):

| Route | When | Graph |
|---|---|---|
| **B — Full ICP** (default) | Comprehensive audience research; messaging + channel + positioning decisions | L1 parallel (persona + VoC + habitat) → L2 sequential (pain → psychology → synthesis → critic) |
| **A — Quick ICP** | Single persona, known audience, time-constrained; OR `--fast` with sufficient Warm Start context | L1 parallel (persona + VoC, skip habitat) → L2 sequential (pain → synthesis → critic, skip decision-psychology) |
| **C — Called by Another Skill** | Invoked by plan-campaign, create-brand, write-copy, ... | Read context from caller's artifacts; check `research/icp-research.md` freshness — Fresh (<30 days) return existing; Stale (>30 days) warn caller + recommend re-run; Missing → run Route B |

Mechanics (6-step Dispatch Protocol, single-agent fallback, Layer 1/2 spawn details, critic FAIL routing per Rewrite Routing Table, post-write side effects, chain position, mode-resolver interaction) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — 12-pattern catalog (7 from original body's Anti-Patterns section expanded with detection + bad/good examples + verified agent ownership against agents/critic-agent.md Rewrite Routing Table) plus 5 cross-cutting failures (hallucination under `--fast`, canonical product-context.md mirror skip, Q5 routing-persistence, cross-stack contract drift, write-back skipped/partial) caught at orchestrator or operator level.

---

## Completion Status

Every run ends with explicit status:

- **DONE** — full ICP synthesized, critic PASS, all 5-7 dimensions populated with quoted evidence
- **DONE_WITH_CONCERNS** — critic PASS but Route A (Quick ICP) used so habitat/decision-psychology omitted, OR VoC quote density thin (flagged in artifact)
- **BLOCKED** — irreconcilable persona contradictions surfaced (e.g., two distinct buyers with no merge path); needs user scope decision
- **NEEDS_CONTEXT** — `research/product-context.md` missing AND user can't describe product/audience; recommend interview sub-flow (`discover`) first

---

## References

| Reference | Load class | Use For |
|---|---|---|
| [playbook.md](references/playbook.md) | PLAYBOOK | Why this skill exists, creative-vs-structural framing, 7-gate summary, foundational-role inventory, when NOT to use |
| [_shared/before-starting-check.md](references/_shared/before-starting-check.md) | PLAYBOOK | Pre-Pre-Dispatch read pattern (canonical at `references/`, synced) |
| [_shared/mode-resolver.md](references/_shared/mode-resolver.md) | PROCEDURE | `--fast` / `--deep` behavior contract |
| [_shared/pre-dispatch-protocol.md](references/_shared/pre-dispatch-protocol.md) | PROCEDURE | Canonical Pre-Dispatch spec |
| [_shared/confidence-labeling.md](references/_shared/confidence-labeling.md) | PROCEDURE | Canonical H/M/L confidence label, scoring rubric, source-independence + L-resolution rules (this skill's ICP application is in `confidence-and-bias.md`) |
| [procedures/pre-dispatch.md](references/procedures/pre-dispatch.md) | PROCEDURE | Auto-scan + Warm/Cold Start, 5-question Cold Start prompt, read order, Write-back map (verbatim), Cold-Start-under-`--fast`, staleness check, Route Selection |
| [procedures/dispatch-mechanics.md](references/procedures/dispatch-mechanics.md) | PROCEDURE | 6-step Dispatch Protocol, single-agent fallback, Layer 1/2 spawn details, Critic Gate FAIL routing, post-write side effects, chain position, skill deference, mode-resolver interaction |
| [format-conventions.md](references/format-conventions.md) | PROCEDURE | Artifact Template (60+ lines), Step 0 product-context.md 8-section schema + Canonical Terminology, Step 1 Scope Interview, Required/Optional Artifacts tables, Route A annotation, date/number/citation format, 13 cross-stack consumers reference |
| [examples/icp-walkthrough.md](references/examples/icp-walkthrough.md) | EXAMPLE | Full Route B walkthrough on engineering-manager ICP case (all 7 critic gates traced through to PASS) |
| [anti-patterns.md](references/anti-patterns.md) | ANTI-PATTERN | 12 named anti-patterns (7 from original body + 5 cross-cutting) with detection + bad/good examples + verified agent ownership against critic-agent.md Rewrite Routing Table |
| [voice-of-customer.md](references/voice-of-customer.md) | data catalog | VoC collection patterns, quote categories, platform tips (voc-collector-agent) |
| [customer-interviews.md](references/customer-interviews.md) | data catalog | Win/loss interview methodology, support ticket analysis (voc-collector-agent) |
| [habitat-mapping.md](references/habitat-mapping.md) | data catalog | Density definitions, engagement types, cross-persona analysis (habitat-agent) |
| [icp-to-imc-handoff.md](references/icp-to-imc-handoff.md) | data catalog | How to package outputs for IMC planning (synthesis-agent) |
| `research-skills/CLAUDE.md` | reference | Stack-level conventions (Pre-Dispatch Protocol, Complexity Routing, Multi-Agent Skills) |

### Sub-Agent Instructions (agents/)
- [agents/persona-agent.md](agents/persona-agent.md) — Demographics, role, goals, frustrations — persona card builder
- [agents/voc-collector-agent.md](agents/voc-collector-agent.md) — VoC quote collection from multiple platforms
- [agents/habitat-agent.md](agents/habitat-agent.md) — Platform/community mapping with density and engagement
- [agents/pain-analysis-agent.md](agents/pain-analysis-agent.md) — Surface → Hidden → Emotional pain classification
- [agents/decision-psychology-agent.md](agents/decision-psychology-agent.md) — Triggers, biases, objections, trust/distrust signals
- [agents/synthesis-agent.md](agents/synthesis-agent.md) — Merges fragments into coherent ICP artifact
- [agents/critic-agent.md](agents/critic-agent.md) — Quality gate — PASS/FAIL with rewrite routing
- [agents/_template.md](agents/_template.md) — Reusable template for creating new agent files
