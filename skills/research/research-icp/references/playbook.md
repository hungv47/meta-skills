# Playbook — Why ICP Research Exists

> Load this when you want to teach the skill to a new operator, when you're deciding whether to run this skill at all, or when a downstream skill is producing generic output and you suspect the upstream personas are guessed rather than evidenced.

---

## Core Question

> **"Who exactly are we talking to and what keeps them up at night?"**

icp-research is Communication Step 1 of 4 and the foundational skill across all 4 stacks. Its single job: turn a fuzzy market description into a defensible audience profile — 1-2 personas with named demographics, evidenced pain, mapped habitats, decision-psychology specifics — that 13+ downstream skills (campaign-plan, brand-system, copywriting, lp-brief, ad-copy, short-form-research, design-brief, humanmaxxing, seo, social-copy, cold-outreach, vn-tone, ...) read for audience context.

---

## Why this skill exists at all

Three failure modes it prevents:

1. **Guessed personas.** Without VoC evidence, teams invent "Sarah, 34, EM" because it sounds right. Every attribute traces to product context, brief, user input, or VoC quotes (Critical Gate 1). Fabricated personas mislead every downstream skill.
2. **Habitat hand-waving.** "They're on LinkedIn" is not actionable for IMC planning. Critical Gate 2 forces named communities with density and engagement type — without this, campaign-plan can't pick a primary channel and short-form-research can't pick a platform-set.
3. **Persona proliferation.** Research that surfaces 4 segments gets shipped as 4 personas, diluting focus for 13+ downstream skills. Critical Gate 3 caps at 2 max with revenue-based forced ranking — the cut isn't editorial, it's load-bearing.

The structural answer is the **10-point quality gate** (in `agents/critic-agent.md`) — every gate maps to a specific re-dispatch agent, and PASS is binary.

---

## Philosophy

Research structure, not rigid formula. Minimums for channels, quotes, and platforms ensure thoroughness — they're not arbitrary. If overwhelming evidence surfaces in 2 channels, a third isn't needed. Let evidence dictate depth. Orchestrator dispatches specialists per concern; critic ensures every section meets the bar.

This is a **creative-leaning skill** (per `implementation-roadmap/refactor/stacks/research.md`). The synthesis side (interview synthesis methodology, jobs-to-be-done framing, evidence chain) is structural and gated. The narrative side (how a persona reads, voice of the day-in-the-life paragraph, emotional driver phrasing) is craft — refs are opinions and examples, not rules. The 10-gate critic checks craft floor (specificity, attribution, traceability) but doesn't enforce a house-style ceiling on the narrative.

---

## When NOT to use this skill

- **Competitive analysis or market sizing.** That's `research-market` — TAM/SAM/SOM, competitor landscape, whitespace. icp-research is audience-side only.
- **Campaign planning from existing personas.** That's `plan-campaign` — channel mix, calendar, IMC plan. icp-research feeds it; doesn't replace it.
- **Brand identity from audience data.** That's `create-brand` — BRAND.md, voice, positioning, archetype. Reads icp-research output; doesn't duplicate it.
- **Diagnosing a business problem.** That's `diagnose` — metric gap, root cause, logic tree. Different question shape: "what's broken" vs "who are we talking to."
- **Re-running personas every quarter without new VoC.** Recycling stale research without re-validation is anti-pattern #6. Re-run when the audience has actually shifted (new market entry, product pivot, sales-call signal that prior personas miss).

---

## The 10-point quality gate

Lives in `agents/critic-agent.md`. Summary (full criteria + Rewrite Routing Table in the agent file):

| # | Gate | Owned by re-dispatch |
|---|---|---|
| 1 | VoC Evidence Integrity — every quote has platform + specific community, real-person voice, attribution | voc-collector-agent |
| 2 | Habitat Specificity — named communities with density (H/M/L) + engagement type; 3+ per persona or explain why fewer | habitat-agent |
| 3 | Emotional Driver Traceability — exactly 3 drivers in Top 3; each traced to 2+ quotes with attribution | synthesis-agent |
| 4 | Decision Psychology Specificity — named cognitive biases + how each manifests for THIS persona; objections have psychological roots | decision-psychology-agent |
| 5 | Quote Volume & Coverage — 15+ unique quotes distributed across categories, spanning multiple platforms | voc-collector-agent |
| 6 | Persona Constraint — max 2 personas (automatic FAIL if 3+) | persona-agent |
| 7 | Brief Alignment — product, audience, geo, and decisions match the user's stated brief | persona-agent + orchestrator |
| 8 | Confidence Labels Complete — every finding carries `[Confidence: H/M/L \| sources: N]`; no unresolved `L` shipped | synthesis-agent |
| 9 | Sample Bias Acknowledged — dataset-specific skews named with mitigations (not generic disclaimers) | synthesis-agent + voc-collector-agent |
| 10 | ≥5 Sources per Persona — each persona clears the ≥5 independent-sources floor (else NEEDS_CONTEXT) | voc-collector-agent |

The body Quality Gate checklist (9 bullets in SKILL.md) is a body-load reminder of gates 1-6 and 8-10; Gate 7 (Brief Alignment) is critic-agent-only — it needs the originating brief. Max 2 rewrite cycles. After 2 FAIL cycles → deliver with annotations and flag "ICP scored below quality gate — manual review recommended on [specific sections]."

---

## Foundational role across all 4 stacks

icp-research creates **two canonical artifacts** that 13+ downstream skills read:

1. **`docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`** (`id: product-context`) — the cross-stack canonical record (product, buyer, problem, differentiator, social proof, model, voice, primary CTA, canonical terminology). Created on first run, updated on re-run. Consumed by: campaign-plan, brand-system, copywriting, humanmaxxing, lp-brief, design-brief, ad-copy, cold-outreach, vn-tone, social-copy, seo, short-form-research, short-form-brief.
2. **`docs/forsvn/canonical/research/ICP.md`** (`id: icp-research`) — the audience profile (1-2 personas with pain + habitat + decision psychology + emotional drivers + red flags). Consumed by: campaign-plan, brand-system, copywriting, lp-brief, design-brief, ad-copy, cold-outreach.

Both are **canonical** lifecycle (`docs/forsvn/canonical/` layer, not pipeline output). Edited in place on re-run; the integer `version:` increments and prior versions live in git history (no `.v[N].md` siblings under `canonical/`).

**Re-run triggers (operator judgment, not auto-emitted):** audience pivot, new market entry, major product changes, or quarterly for active products. Stale product context (>30 days) triggers an operator warning per Critical Gate 4 — but the operator decides whether to proceed or re-run upstream.

---

## Creative side vs structural side

The skill has two distinct surfaces:

**Structural (gated, evidence-required):**
- Persona demographics + pain attribution (every pain traces to 2+ quotes)
- Habitat map (named communities, density, engagement)
- Decision psychology (specific cognitive biases with manifestation)
- Quote volume + platform diversity (15+ across categories)

**Creative (opinion-driven, craft floor only):**
- Persona name/archetype phrasing ("The Overwhelmed EM" vs "Sarah, 34, EM")
- Day-in-the-life narrative
- Emotional driver phrasing (the *naming* of the psychological motivation, not the evidence backing it)
- Red flag language (positioning critique that triggers skepticism)

The 10-gate critic enforces the structural side. The creative side is judged on whether it READS as written by someone who actually heard the customer (not a generic AI summary). Operator-level acceptance, not gated.

---

## When the critic returns FAIL

Max 2 rewrite cycles. The critic's Fix Instructions name the specific gate (1 of 7), the failure, and the agent to re-dispatch per the Rewrite Routing Table in `agents/critic-agent.md`. Re-dispatch ONLY the named agent with critic feedback appended.

If fix affects downstream agents (e.g., voc-collector re-runs → pain-analysis + synthesis must re-run too), re-run the chain from the fixed agent forward. Otherwise run only the named agent.

After 2 FAIL cycles → deliver with a "Known Issues" annotation. Don't loop. The escape valve preserves momentum; the operator can re-run with sharper VoC sources if the critic was right about evidence thinness.

---

## Skill deference

| Situation | Defer to |
|---|---|
| Competitive landscape / market sizing | `research-market` |
| Channel mix and calendar from personas | `plan-campaign` |
| Brand identity using audience data | `create-brand` |
| Diagnosing a metric gap (not audience) | `diagnose` (research-skills) |

---

## Refactor history

- **2026-05-18 (v6 Phase 2 Wave 2):** body refactored 485 → 162 lines (-66.5%, 323 lines saved — ties prioritize at #3 absolute reduction in v6 program). 6 new refs: this playbook, `procedures/pre-dispatch.md`, `procedures/dispatch-mechanics.md`, `format-conventions.md`, `examples/icp-walkthrough.md`, `anti-patterns.md` (newly extracted from body's 7 anti-patterns + expanded with detection + bad/good examples + verified agent ownership against `agents/critic-agent.md` Rewrite Routing Table). Existing 4 data-catalog refs (voice-of-customer, customer-interviews, habitat-mapping, icp-to-imc-handoff) untouched. 7 sub-agents (`agents/`) untouched — including the canonical quality gate in critic-agent.md. **Creative-leaning ref pattern applied** per `implementation-roadmap/refactor/stacks/research.md` § "Creative-skill ref pattern" — synthesis side gated strictly, narrative side framed as opinions/examples. Cross-stack contract preserved BYTE-IDENTICAL (consumed by 13+ skills):
  - 4 Critical Gates
  - Frontmatter
  - Quality Gate 6-bullet checklist
  - Agent Manifest 7-agent table
  - Routes A/B/C
  - Layer 1 + Layer 2 dispatch tables
  - Write-back 5-row map (Q1 → product.md + docs/forsvn/canonical/product/PRODUCT-CONTEXT.md as canonical; Q2-Q4 → audience.md; Q5 routing-only — preserved verbatim from original SKILL.md per anti-smuggle rule)
  - Required Artifacts table (`PRODUCT-CONTEXT.md` INTERVIEW for 8 product dimensions if missing)
  - Optional Artifacts table (diagnose.md problem context benefit)
  - Step 0 PRODUCT-CONTEXT.md schema (8 sections + Canonical Terminology subsection)
  - Artifact Template (60+ lines: 1-2 Persona sections + Pain Profile + Decision Psychology + Habitat Map + Top 3 Emotional Drivers + Red Flags + Next Step + version-rename note)
  - Completion Status 4-tier
  - Chain Position + Skill Deference
