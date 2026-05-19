---
name: optimize-seo
description: "Audits and plans search visibility — keyword research, on-page optimization, technical SEO, link building strategy, and AI search optimization. Produces `.forsvn/artifacts/mkt/seo-[mode].md`. Not for landing-page construction/conversion brief work (use brief-landing-page) or writing copy (use write-copy)."
argument-hint: "[url or mode]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
license: MIT
metadata:
  author: hungv47
  version: "2.0.0"
  budget: deep
  estimated-cost: "$2-5"
  refactor_history:
    - version: "2.0.0 → 2.0.0"
      date: 2026-05-18
      slot: "v6 Phase 2 Wave 1 — marketing-stack slot 3/14"
      note: "Body 558→165 (-70.4%) + 6 new refs. See references/playbook.md 'Refactor history' for full detail."
promptSignals:
  phrases:
    - "seo audit"
    - "keyword research"
    - "search ranking"
    - "search optimization"
    - "app store optimization"
    - "aso"
  allOf:
    - [seo, audit]
    - [keyword, research]
  anyOf:
    - "seo"
    - "keyword"
    - "ranking"
    - "backlink"
    - "search"
    - "aso"
    - "aeo"
  noneOf:
    - "landing page audit"
    - "cro"
  minScore: 6
routing:
  intent-tags:
    - seo-audit
    - ai-seo
    - programmatic-seo
    - keyword-research
    - search-optimization
    - competitor-seo
    - aso
    - app-store-optimization
    - marketplace-seo
    - aeo
    - agent-engine-optimization
  position: horizontal
  lifecycle: pipeline
  produces:
    - .forsvn/artifacts/mkt/seo-[mode].md
    # mode = audit | ai | programmatic | competitor | aso
  consumes:
    - product-context.md
    - icp-research.md
    - .forsvn/artifacts/mkt/campaign-plan.md
  requires: []
  defers-to:
    - skill: write-copy
      when: "need to write headlines/copy for SEO-targeted pages"
    - skill: brief-landing-page
      when: "building or evaluating landing pages for conversion, not search"
  parallel-with:
    - lp-brief
  interactive: false
  estimated-complexity: heavy
---

# SEO — Orchestrator

*Communication — Horizontal. Covers the full SEO surface: technical foundations, AI/agent engine optimization, programmatic page generation, app store optimization, and competitor comparison content.*

**Core Question:** "How do we get found — by both search engines and AI models?"

> Why this skill exists, when NOT to use it, 10-item quality gate summary, six routes by mode: `references/playbook.md` [PLAYBOOK].

## Philosophy

SEO mixes hard technical constraints (CWV thresholds, character limits, schema validation) with strategic judgment. Platform specs are constraints; strategic recommendations are defaults with deviation context. **Specific > Vague > Comprehensive > Generic** — every recommendation names exact page, exact change, expected impact.

---

## Critical Gates

Before delivering, all must hold:

1. **Every recommendation names exact page, exact change, expected impact.** No "consider" / "you might."
2. **AI SEO is additive, not alternative.** No point optimizing for AI citations if crawlers can't reach content.
3. **Source recency.** AI platform behavior shifts fast — verify no deprecated practices, outdated crawlers, stale metrics.
4. **Mode is diagnosis-driven**, not a generic "do SEO" deliverable.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PROCEDURE] — load product context, check artifact staleness (>30 days → recommend re-run upstream).

| Artifact | Source | Required? |
|---|---|---|
| `icp-research.md` | icp-research | Recommended — audience search behavior drives strategy |
| `campaign-plan.md` | campaign-plan | Optional — pillars inform topic clusters |
| `product-context.md` | icp-research | Optional — positioning context |

---

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** mode (audit / ai / programmatic / competitor / aso), site or property, audience, geographic + language scope.

Full read-order + Cold Start prompt + Warm Start prompt + write-back map + Chain Position + Skill Deference + IMC Coordination table: `references/procedures/pre-dispatch.md` [PROCEDURE].

---

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — auto-downgrade for ≤3 sentences + no prior artifacts; `--fast` flag skips Layer 2 (no prioritization, no critic) and runs single-agent. **`--fast` does NOT skip Cold Start or Critical Gates 1-4.**

---

## Agent Manifest

| Agent | File | Layer | Mode(s) | Focus |
|-------|------|-------|---------|-------|
| crawl-agent | `agents/crawl-agent.md` | 1 (parallel) | Technical Audit, Full | Crawlability, indexation, robots.txt, sitemaps, canonicals |
| foundations-agent | `agents/foundations-agent.md` | 1 (parallel) | Technical Audit, Full | CWV, mobile, HTTPS, URL structure, on-page optimization |
| content-quality-agent | `agents/content-quality-agent.md` | 1 (parallel) | Technical Audit, Full | E-E-A-T, thin content, duplicate detection, content gaps |
| authority-agent | `agents/authority-agent.md` | 1 (parallel) | Technical Audit, Full | Backlink profile, internal linking, link equity |
| ai-structure-agent | `agents/ai-structure-agent.md` | 1 (parallel) | AI SEO, Full | Schema, heading hierarchy, answer passages, structured data |
| ai-presence-agent | `agents/ai-presence-agent.md` | 1 (parallel) | AI SEO, Full | AI crawler access, llms.txt, citation monitoring, AEO |
| programmatic-template-agent | `agents/programmatic-template-agent.md` | 1 (parallel) | Programmatic | Template design, URL architecture, defensibility |
| programmatic-quality-agent | `agents/programmatic-quality-agent.md` | 1 (parallel) | Programmatic | Thin page detection, quality gates, monitoring plan |
| comparison-page-agent | `agents/comparison-page-agent.md` | 1 | Competitor Pages | Page format, content architecture, comparison matrices |
| aso-keyword-agent | `agents/aso-keyword-agent.md` | 1 (parallel) | ASO | Keyword research for App Store, Play Store, G2, Capterra |
| aso-listing-agent | `agents/aso-listing-agent.md` | 1 (parallel) | ASO | Title, subtitle, description, screenshots, preview video |
| aso-reviews-agent | `agents/aso-reviews-agent.md` | 1 (parallel) | ASO | Review sentiment, response templates, rating improvement |
| aso-competitive-agent | `agents/aso-competitive-agent.md` | 1 (parallel) | ASO | Competitor listing comparison, feature matrix positioning |
| prioritization-agent | `agents/prioritization-agent.md` | 2 (sequential) | All | Impact × effort ranking of all findings |
| critic-agent | `agents/critic-agent.md` | 2 (sequential) | All | 10-item quality gate — specific fixes, no vague language, actionability |

---

## Routing Logic — Mode-Based Dispatch

### Step 1: Determine Mode

Diagnose first, then enter the right mode.

| Situation | Mode | Route |
|-----------|------|-------|
| Technical issues / traffic dropped / never audited | **Technical Audit** | Route A |
| Want citations from ChatGPT / Perplexity / AI search | **AI SEO (AEO)** | Route B |
| Structured data, want to generate pages at scale | **Programmatic SEO** | Route C |
| Rank for competitor comparison queries | **Competitor Pages** | Route D |
| Comprehensive SEO strategy | **Full SEO** (Technical + AI) | Route E |
| Distribute via app stores / listings (App Store, Play Store, G2, Capterra, Product Hunt) | **ASO** | Route F |

Modes can run sequentially. **Start with Technical Audit if never audited** — no point optimizing for AI citations if crawlers can't reach content (Critical Gate 2).

### Step 2: Per-route Dispatch

| Route | Layer 1 (parallel) | Layer 2 (sequential) |
|---|---|---|
| **A** Technical Audit | crawl + foundations + content-quality + authority | prioritization → critic |
| **B** AI SEO | ai-structure + ai-presence | prioritization → critic |
| **C** Programmatic | programmatic-template + programmatic-quality | prioritization → critic |
| **D** Competitor Pages | comparison-page | prioritization → critic |
| **E** Full SEO | crawl + foundations + content-quality + authority + ai-structure + ai-presence | prioritization → critic |
| **F** ASO | aso-keyword + aso-listing + aso-reviews + aso-competitive | prioritization → critic |

**Route E produces TWO artifacts:** `seo-audit.md` + `seo-ai.md` (per `references/format-conventions.md` [PROCEDURE]).

Full pre-writing object schema, 8-step Multi-Agent Dispatch flow, Single-Agent Fallback, `--fast` execution path: `references/procedures/dispatch-mechanics.md` [PROCEDURE].

---

## Layer 2 — Prioritization + Critic

`prioritization-agent` force-ranks findings: Quick Wins → Strategic Investments → Low-Hanging Fruit → Backlog. Phases P1 (Week 1-2) / P2 (Month 1) / P3 (Month 2-3) / P4 (Ongoing). Dependencies mapped — no action recommended before its prerequisite.

`critic-agent` evaluates against the **10-item quality gate** (canonical list in `agents/critic-agent.md`; summary in `references/playbook.md`). Verdict binary (PASS / FAIL). **Max 2 rewrite cycles** — on FAIL the critic names the agent to re-dispatch per the 11-row Rewrite Routing Table.

---

## Artifact Contract

Output path: `.forsvn/artifacts/mkt/seo-[mode].md` (mode ∈ {audit, ai, programmatic, competitor, aso}). On re-run, rename existing to `seo-[mode].v[N].md` and create new with incremented version.

Frontmatter (REQUIRED): `skill: optimize-seo`, `mode`, `version` (int), `date`, `status`.

Body sections (REQUIRED): Diagnosis / Findings / Priority Actions / Implementation Plan / Dependencies / Metrics to Track / Next Step.

Full template + finding format (Issue / Impact / Evidence / Fix / Priority) + per-mode metrics defaults: `references/format-conventions.md` [PROCEDURE].

---

## Anti-Patterns

13 patterns (9 SEO-specific + 4 cross-cutting marketing-stack) with detection rules, bad/good examples, and per-pattern agent ownership verified against critic-agent.md Rewrite Routing: `references/anti-patterns.md` [ANTI-PATTERN].

Most common in practice: "Consider improving" (gate 3 hedge-language), "Do SEO" without diagnosis (no mode chosen), Ignoring third-party presence for AI SEO (gate 8 — third-party drives ~6.5x more AI citations than owned).

---

## Completion Status

Every run ends with explicit status:

- **DONE** — selected mode executed end-to-end, recommendations specific and prioritized, critic PASS within 2 cycles
- **DONE_WITH_CONCERNS** — analysis delivered with data gaps (rank tracker unavailable, GSC not connected, low-confidence competitor data); recommendations annotated
- **BLOCKED** — site/property inaccessible (auth wall, robots block, no URL provided); cannot scan. State exactly what's blocked + what unblocks.
- **NEEDS_CONTEXT** — audience or product context missing for relevance scoring; recommend `research-icp` or proceed with explicit scope reduction

---

## Worked Example

End-to-end Route A walkthrough (Pre-Dispatch → parallel Layer 1 → merge → prioritization → critic PASS → deliver → FAIL handling → `--fast` variant): `references/examples/seo-walkthrough.md` [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/seo-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch, not orchestrator): `references/{technical-audit, ai-seo, programmatic-seo, competitor-pages, schema-reference, aso}.md`
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol}.md`
- **Agents:** 15 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 10-item quality gate + 11-row Rewrite Routing Table.
