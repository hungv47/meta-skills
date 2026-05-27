# Agent Manifest — optimize-seo

> Load when the orchestrator is preparing dispatch and needs the full per-agent focus + layer assignment. Per-route dispatch composition lives in `procedures/dispatch-mechanics.md` § "Per-route Layer 1 dispatch".

15 sub-agents across two layers.

## Layer 1 — Parallel domain agents

| Agent | File | Mode(s) | Focus |
|-------|------|---------|-------|
| crawl-agent | `agents/crawl-agent.md` | Technical Audit, Full | Crawlability, indexation, robots.txt, sitemaps, canonicals |
| foundations-agent | `agents/foundations-agent.md` | Technical Audit, Full | CWV, mobile, HTTPS, URL structure, on-page optimization |
| content-quality-agent | `agents/content-quality-agent.md` | Technical Audit, Full | E-E-A-T, thin content, duplicate detection, content gaps |
| authority-agent | `agents/authority-agent.md` | Technical Audit, Full | Backlink profile, internal linking, link equity |
| ai-structure-agent | `agents/ai-structure-agent.md` | AI SEO, Full | Schema, heading hierarchy, answer passages, structured data |
| ai-presence-agent | `agents/ai-presence-agent.md` | AI SEO, Full | AI crawler access, llms.txt, citation monitoring, AEO |
| programmatic-template-agent | `agents/programmatic-template-agent.md` | Programmatic | Template design, URL architecture, defensibility |
| programmatic-quality-agent | `agents/programmatic-quality-agent.md` | Programmatic | Thin page detection, quality gates, monitoring plan |
| comparison-page-agent | `agents/comparison-page-agent.md` | Competitor Pages | Page format, content architecture, comparison matrices |
| aso-keyword-agent | `agents/aso-keyword-agent.md` | ASO | Keyword research for App Store, Play Store, G2, Capterra |
| aso-listing-agent | `agents/aso-listing-agent.md` | ASO | Title, subtitle, description, screenshots, preview video |
| aso-reviews-agent | `agents/aso-reviews-agent.md` | ASO | Review sentiment, response templates, rating improvement |
| aso-competitive-agent | `agents/aso-competitive-agent.md` | ASO | Competitor listing comparison, feature matrix positioning |

## Layer 2 — Sequential critic chain

| Agent | File | Mode(s) | Focus |
|-------|------|---------|-------|
| prioritization-agent | `agents/prioritization-agent.md` | All | Impact × effort ranking of all findings; Quick Wins → Strategic Investments → Low-Hanging Fruit → Backlog; P1 (Week 1-2) / P2 (Month 1) / P3 (Month 2-3) / P4 (Ongoing); dependencies mapped so no action precedes its prerequisite |
| critic-agent | `agents/critic-agent.md` | All | 10-item quality gate — specific fixes, no vague language, actionability. Canonical 10-item list + 11-row Rewrite Routing Table live here. Verdict binary (PASS / FAIL). Max 2 rewrite cycles — on FAIL the critic names the agent to re-dispatch |

## Per-route composition

| Route | Layer 1 (parallel) | Layer 2 (sequential) |
|---|---|---|
| **A** Technical Audit | crawl + foundations + content-quality + authority | prioritization → critic |
| **B** AI SEO | ai-structure + ai-presence | prioritization → critic |
| **C** Programmatic | programmatic-template + programmatic-quality | prioritization → critic |
| **D** Competitor Pages | comparison-page | prioritization → critic |
| **E** Full SEO | crawl + foundations + content-quality + authority + ai-structure + ai-presence | prioritization → critic |
| **F** ASO | aso-keyword + aso-listing + aso-reviews + aso-competitive | prioritization → critic |

**Route E produces TWO artifacts:** `seo-audit.md` + `seo-ai.md` (per `format-conventions.md`). Each gets its own prioritization + critic pass.
