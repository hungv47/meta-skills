# Playbook — Why SEO Exists

> Load this when you want to teach the skill to a new operator, when you're deciding whether to run this skill at all, or when downstream content production is generating assets against an unsourced search-visibility picture.

---

## Core Question

> **"How do we get found — by both search engines and AI models?"**

seo is the horizontal search-visibility orchestrator. Its single job: turn a fuzzy "we need SEO" ask into a mode-correct, evidence-backed, force-ranked action plan that operators can ship without a second consulting engagement. Five modes (audit / ai / programmatic / competitor / aso) cover the full search surface — pick the right one, dispatch the right agents, deliver a critic-passed plan.

---

## Why this skill exists at all

Five failure modes it prevents:

1. **"Do SEO" without diagnosis.** Generic checklist work without identifying whether the problem is technical, content, authority, or AI-visibility produces unranked findings, no priority, no measurable outcome. The mode-based routing forces diagnosis FIRST — pick the right mode, dispatch only relevant agents.
2. **Hedge-language deliverables.** "Consider improving meta descriptions" gives the operator nothing to act on. Critical Gate 1 + critic gate 3 forbid hedge language; every recommendation names exact page, exact change, expected impact.
3. **AI SEO as substitute for technical SEO.** Optimizing for ChatGPT citations on a site GPTBot can't crawl is theater. Critical Gate 2 enforces "AI SEO is additive, not alternative" — Technical Audit runs first if foundations are broken.
4. **Source-recency blindness.** AI platform behavior shifts in weeks; algorithms shift in quarters. Citing 2022 best practices for 2026 search produces decisions against a search engine that doesn't exist. Critical Gate 3 + critic gate 10 force source-recency checks.
5. **One-and-done audits.** SEO is ongoing — issues resurface, competitors shift, algorithms update. Anti-pattern catalog + chain position rules force re-run triggers (technical quarterly, AI monthly, after core updates, when entering new keyword territories).

The structural answer is the **10-item quality gate** (in `agents/critic-agent.md`) — every gate maps to a specific re-dispatch agent per the Rewrite Routing table, and PASS is binary.

---

## Philosophy

SEO mixes hard technical constraints (CWV thresholds, character limits, schema validation) with strategic judgment (which pillars matter, which competitors to comparison-target). Platform specs are constraints; strategic recommendations are defaults with deviation context.

**Specific > Vague > Comprehensive > Generic.**

Every recommendation names exact page, exact change, expected impact. The skill ships six routes (A–F) that scale agent depth to mode — agents read the route to know which dispatch graph they belong to.

---

## When NOT to use this skill

- **Building or evaluating landing pages for conversion.** That's `brief-landing-page` (construction) or `evaluate-landing-page` (post-launch). seo is search-visibility-side; lp-brief is conversion-side. They're parallel-with peers, not substitutes.
- **Writing the actual copy for SEO-targeted pages.** That's `write-copy` — seo defines structure, keywords, and intent; copywriting writes the headlines, body, CTAs. seo defers downstream.
- **Channel mix and content calendar from market signals.** That's `plan-campaign` — seo informs which content pillars have search demand; campaign-plan decides which pillars to invest in.
- **Quick "what's our domain authority" name-check.** A 1-line "give me our DR score" doesn't warrant the 15-agent orchestration. Use the relevant single agent directly or WebSearch.

---

## The 10-item quality gate

Lives in `agents/critic-agent.md`. Summary (full criteria + Rewrite Routing in the agent file):

| # | Gate | Owned by re-dispatch |
|---|---|---|
| 1 | Every finding has Issue, Impact, Evidence, and Fix fields | producing agent (crawl / foundations / content-quality / authority / ai-structure / ai-presence / programmatic-* / comparison-page / aso-*) |
| 2 | Every Fix is specific enough to implement without further research | producing agent |
| 3 | No vague language ("consider," "might want to," "could potentially") | producing agent |
| 4 | Priority actions are force-ranked (single #1, #2, #3 — not flat "High priority" list) | prioritization-agent |
| 5 | Implementation phases have specific timelines (Week 1-2, Month 1, etc.) | prioritization-agent |
| 6 | Dependencies are mapped — no action recommended before its prerequisite | prioritization-agent |
| 7 | Mode-appropriate coverage (all relevant audit areas covered for active mode) | orchestrator (re-merge) |
| 8 | AI SEO recommendations are platform-specific, not generic | ai-structure-agent + ai-presence-agent |
| 9 | Technical specs cite correct thresholds (CWV LCP <2.5s, INP <200ms, CLS <0.1, etc.) | foundations-agent + producing agent |
| 10 | Source recency: recommendations reflect current standards | producing agent |

Plus per-section validation checks (in critic-agent.md Domain Instructions). The most important is the **hedge-language catch** (Critical Gate 1 + critic gate 3) — explicitly the most common failure mode in practice; the critic catches it every cycle.

Max 2 rewrite cycles per `procedures/dispatch-mechanics.md`. After 2 FAIL cycles → deliver with unresolved-items note.

---

## Six routes by mode

Mode drives route, route drives agent depth.

| Route | Mode | Trigger | Agents dispatched |
|---|---|---|---|
| **A** | Technical Audit | "Traffic dropped", "Never audited", "Technical SEO review" | crawl + foundations + content-quality + authority → prioritization → critic |
| **B** | AI SEO (AEO) | "Citations from ChatGPT/Perplexity", "AI search visibility", "AEO" | ai-structure + ai-presence → prioritization → critic |
| **C** | Programmatic SEO | "Page templates at scale", "Programmatic SEO", "pSEO from structured data" | programmatic-template + programmatic-quality → prioritization → critic |
| **D** | Competitor Pages | "Rank for comparison queries", "vs. competitor pages" | comparison-page → prioritization → critic |
| **E** | Full SEO | "Comprehensive SEO strategy", "Full audit + AI" | crawl + foundations + content-quality + authority + ai-structure + ai-presence → prioritization → critic |
| **F** | ASO | "App Store Optimization", "Google Play listing", "G2/Capterra/Product Hunt SEO" | aso-keyword + aso-listing + aso-reviews + aso-competitive → prioritization → critic |

Modes can run sequentially. **Start with Technical Audit if never audited** — no point optimizing for AI citations if crawlers can't reach content (Critical Gate 2).

---

## Foundational role for Marketing track

seo is one of three search-visibility orchestrators in the marketing-skills stack (alongside `plan-campaign` for channel mix and `brief-landing-page` for conversion-focused page work). It's `horizontal` — invokable independently or post-campaign-plan when SEO is the active channel.

seo creates `docs/forsvn/artifacts/marketing/seo-[mode].md` — the **per-mode SEO action record** that operators ship against, `write-copy` reads for page-level keyword targets, and downstream re-audits compare against (rename existing artifact to `seo-[mode].v[N].md` and create new with incremented version). Re-run triggers: quarterly for Technical Audit, monthly for AI SEO, after Google core updates, when entering new keyword territories.

---

## Skill deference

| Situation | Defer to |
|---|---|
| Production copy for comparison pages or SEO-targeted content | `write-copy` (after SEO defines structure/keywords) |
| Content pillar prioritization from market signals | `plan-campaign` (SEO supplies search demand inputs) |
| Conversion-focused landing-page construction | `brief-landing-page` (marketing-skills) |
| Post-launch landing-page evaluation inside an eval-loop | `evaluate-landing-page` (marketing-skills) |

### Coordination with IMC Plan

When `campaign-plan.md` exists, seo and the IMC coordinate by pillar (not by skill — both can own pillars). Detail in `procedures/pre-dispatch.md`. Core rule: don't let SEO keyword data override IMC audience insights (or vice versa). On conflict, audience pain wins.

---

## When the critic returns FAIL

Max 2 rewrite cycles. The critic's Failure block names the section, the source agent, the problem, the specific fix, and the agent to re-dispatch per the Rewrite Routing Table in `agents/critic-agent.md`. Re-dispatch ONLY the named agent(s) with the critic's per-agent feedback as the `feedback` field — don't re-run the full pipeline.

After 2 FAIL cycles → deliver with unresolved-items note and warn the operator: "Artifact delivered with quality notes — some items could not be resolved in 2 cycles." The escape valve preserves momentum; operator can re-run with sharper inputs if the critic was right about evidence thinness.

---

## Refactor history

- **2026-05-18 (v6 Phase 2 Wave 1 — marketing-stack slot 3/14):** body refactored 558 → 165 lines (-70.4%, 393 lines saved). 6 new refs: this playbook, `procedures/pre-dispatch.md`, `procedures/dispatch-mechanics.md`, `format-conventions.md`, `examples/seo-walkthrough.md`, `anti-patterns.md` (newly extracted from body's 9 anti-patterns + expanded with detection + bad/good examples + verified agent ownership against `agents/critic-agent.md` Rewrite Routing Table). Existing 6 data-catalog refs (ai-seo, aso, competitor-pages, programmatic-seo, schema-reference, technical-audit) untouched. 15 sub-agents (`agents/`) untouched — including the canonical 10-item quality gate in critic-agent.md. Cross-stack contract preserved BYTE-IDENTICAL (consumed by `write-copy` for keyword-driven content; consumed by operators for action plans):
  - 4 Critical Gates
  - Frontmatter (skill, mode, version, date, status)
  - 6 routes (A–F) covering 5 modes + Full
  - 15-agent manifest (4 Technical Audit L1 + 2 AI SEO L1 + 2 Programmatic L1 + 1 Comparison L1 + 4 ASO L1 + 2 sequential L2)
  - Quality Gate 10-bullet checklist
  - Layer 1 + Layer 2 dispatch tables
  - Artifact Template (Diagnosis / Findings / Priority Actions / Implementation Plan with 4 phases / Dependencies / Metrics / Next Step)
  - Critic Gate Max-2-cycles pseudocode semantics
  - Required + Optional Artifacts tables
  - Completion Status 4-tier
  - Chain Position + Skill Deference + Coordination with IMC + Re-run triggers
  - Write-back 3-row map (Q3 audience → audience.md search behavior; Q4 geo+language → audience.md geo + language scope; Q1+Q2 mode+site not persisted — run-specific — preserved verbatim from original SKILL.md lines 168-174 per anti-smuggle rule)
