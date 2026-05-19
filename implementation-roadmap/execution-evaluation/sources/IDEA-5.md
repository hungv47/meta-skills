# Playbook Imports — Corey Haines Marketing Skills Stack

> **STATUS: SUPERSEDED** (2026-05-16). Execution plan moved to `ROADMAP.md` §7 (E7). Decisions on open questions recorded in `DECISIONS.md`. Source material retained for reference.

**Source:** `github.com/coreyhaines31/marketingskills` (18.6k stars, v2.0.0, MIT)
**Investigation date:** 2026-05-15
**Method:** All 34 skills read in full (SKILL.md + references)

---

## Overview

The repo ships 34 skills following the agentskills.io spec, organized as a Claude Code plugin. Each skill is a `SKILL.md` (under 500 lines) with optional `references/` subdirectory for deep dives. The repo also ships 51 zero-dependency Node.js CLI tools and 10+ integration guides.

This document catalogs the patterns worth importing, adapted to our multi-agent orchestration architecture (parallel specialists → critic gate, complexity routing, completion status protocol).

---

## 1. Keystone Context: Product-Marketing File (HIGH)

### What It Is

Every skill in the repo starts by reading `.agents/product-marketing.md` before asking any questions. This file is created by the `product-marketing` skill, which auto-drafts from the codebase (reads README, landing pages, `package.json`, etc.) and then the user reviews/fills gaps.

### Our Gap

Currently each of our skills cold-starts with domain-specific questions. Users answer the same questions across different skills. There is no shared context layer that skills read before dispatching.

### Playbook Reference

`product-marketing-context` / `product-marketing/SKILL.md`

12-section structure:
1. Product Overview (one-liner + category + platform + pricing)
2. Target Audience (who buys, who uses, who decides)
3. Personas (JTBD roles: User, Champion, Decision Maker, Financial Buyer, Technical Influencer)
4. Problems & Pain Points (functional, emotional, social)
5. Competitive Landscape (3-5 competitors with positioning)
6. Differentiation (unique claims, unfair advantages)
7. Objections & Anti-Personas (common reasons not to buy + who would never buy)
8. Switching Dynamics (JTBD Four Forces: Push, Pull, Habit, Anxiety)
9. Customer Language (verbatim quotes, not polished descriptions)
10. Brand Voice (formality, personality, banned words, examples)
11. Proof Points (stats, case studies, awards, integrations)
12. Goals (current targets, north-star metric)

### Implementation Plan

**New shared context layer:** Create `.agents/product-context.md` (or reuse/expand `experience/product.md`) with a similar 12-section structure.

| Step | Action | Effort | In Our Stack |
|------|--------|--------|-------------|
| 1 | Define schema: 12 sections, YAML frontmatter for machine-readability | 1hr | Add to `meta-skills/references/pre-dispatch-protocol.md` |
| 2 | Write acquisition script that auto-drafts from common sources (README, package.json, landing page URL) | 2-3hr | New reference or tool in meta-skills |
| 3 | Add "Before Starting" check to every marketing/product skill: read context file → if missing, ask to create | 3-5hr per pack | Modify existing SKILL.md cold-start sections |
| 4 | Integration: eval-loop learnings propagate back to context file | 2hr | Wire into `quality-feedback-protocol.md` |

**Auto-draft sources** (mapped to sections):
- `README.md` → Product Overview, Goals
- `package.json` → Product Overview (name, description, version)
- Landing page (fetch URL) → Positioning, Differentiation, Target Audience
- `research/product-context.md` → Problems, Competitive Landscape (if exists)
- `brand/BRAND.md` → Brand Voice, Proof Points

**Priority:** HIGH — this is the highest-leverage single change. It eliminates redundant cold starts across all skills and creates a single source of truth for positioning.

---

## 2. AI-SEO: Machine-Readable Pricing for AI Agents (HIGH)

### What It Is

The `ai-seo` skill optimizes content for AI search engines (Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, Copilot). Its most original insight: AI agents need a `/pricing.md` file because they can't parse JavaScript-rendered pricing pages.

### Playbook Reference

`ai-seo/SKILL.md` — Three Pillars:
- **Structure:** Make extractable (definition blocks, step-by-step, comparison tables, FAQ schema)
- **Authority:** Make citable (cite sources +40% citation rate, add statistics +37%, add quotations +30% — per Princeton GEO research)
- **Presence:** Be where AI looks (bot-by-bot robots.txt analysis: GPTBot vs PerplexityBot vs ClaudeBot)

### Our Gap

We have no AI visibility optimization in our marketing stack. `seo` covers traditional SEO (keywords, on-page, technical) but not AI search visibility. For the projects in `biz/` (syncthis, metaprev, conquis), this is increasingly relevant as AI agents browse pricing/docs.

### Implementation Plan

| Step | Action | Effort | Recommendation |
|------|--------|--------|---------------|
| 1 | Create `ai-seo` as new marketing skill | 3-5hr | New skill, `deep` budget. Covers: AI visibility audit, content block patterns, bot-by-bot analysis, machine-readable file generation. |
| 2 | Add AI visibility section to existing `seo` skill | 1-2hr | Lower effort, narrower scope. Add as a section within seo's existing audit framework. |

**Recommended:** New skill. The methodology is distinct enough from traditional SEO (different crawlers, different ranking signals, different optimization techniques) that bundling it dilutes both.

### Key Patterns to Import

- **Machine-readable fallback files**: Generate `/pricing.md`, `/docs/llms.txt`, structured data JSON for AI agent consumption
- **AI visibility audit matrix**: Query × platform × extraction-success table
- **Content structure patterns**: Definition blocks (extractable), step-by-step (ranked), comparison tables (cited)
- **Robots.txt bot-by-bot**: Granular allow/deny per AI crawler, not blanket allow/deny

---

## 3. Copy Editing — Seven Sweeps Framework (MEDIUM)

### What It Is

The `copy-editing` skill performs seven sequential editing passes (sweeps), each with a specific focus, with back-checking between sweeps:

1. **Clarity** — Can reader understand?
2. **Voice and Tone** — Consistent personality?
3. **So What** — Every claim answers "why care?"
4. **Prove It** — Every claim has evidence
5. **Specificity** — Concrete enough to be compelling
6. **Heightened Emotion** — Does it make reader feel?
7. **Zero Risk** — Remove every barrier to action

Plus Expert Panel Scoring (3-5 personas, 1-10, revise, re-score) and word-level checks (cut: very, really, utilize, leverage, etc.).

### Our Gap

Our `humanize` skill focuses on stripping AI patterns and compressing text. Our `copywriting` skill generates from scratch. Neither provides a **structured systematic editing pass** over existing copy. The Seven Sweeps fills a gap between generation and humanization — it's a quality gate for copy before the final polish pass.

### Implementation Plan

| Step | Action | Effort |
|------|--------|--------|
| 1 | Add Seven Sweeps as an optional critic-gate mode in `copywriting` (post-generation, pre-humanize) | 1-2hr |
| 2 | Create `references/seven-sweeps.md` in copywriting with framework details back-checking protocol, word-level rules) | 1hr |
| 3 | Add Expert Panel Scoring as optional high-stakes mode (for landing page hero copy, ad headlines) | 2hr |

**Why not a new skill:** The framework is a procedure, not a domain. It belongs inside copywriting as an optional deeper quality pass.

**Priority:** MEDIUM. High impact but dependent on a copywriting skill that already exists. Do after the keystone context (item 1) and any pending roadmap items.

---

## 4. Customer Research — Digital Watering Hole + Confidence Labeling (MEDIUM)

### What It Is

The `customer-research` skill has two modes: analyze existing assets OR gather new research from online sources. Its standout patterns:

- **Digital Watering Hole playbook**: per-ICP-type source guide (B2B SaaS → Reddit/G2/HN; B2C → App Store reviews/Reddit lifestyle subs; Enterprise → LinkedIn/analyst reports)
- **Confidence level labeling**: Every finding tagged High/Medium/Low based on source count and consistency
- **Sample bias checks**: Online reviewers skew power users, support tickets skew problems, Reddit skews technical
- **Minimum viable sample**: Don't draw conclusions from <5 independent data points per segment

### Our Gap

Our `icp-research` skill builds personas from audience data but doesn't have rigorous source quality tagging or the Digital Watering Hole methodology. The confidence labeling would upgrade our research artifacts from "here's what we found" to "here's what we found and how sure we are."

### Implementation Plan

| Step | Action | Effort |
|------|--------|--------|
| 1 | Add confidence labeling to `icp-research` output: every finding gets High/Medium/Low tag with rationale | 1hr |
| 2 | Add Digital Watering Hole sources to icp-research pre-dispatch questions | 1hr |
| 3 | Add sample bias checks as critic-gate dimension in icp-research | 1hr |

**Priority:** MEDIUM. Low-effort improvements to an existing high-value skill. Confidence labeling alone makes research artifacts more actionable.

---

## 5. Programmatic SEO — 12 Playbook Taxonomy (MEDIUM)

### What It Is

The `programmatic-seo` skill defines 12 playbooks for creating SEO-driven pages at scale:

1. Templates, Curation, Conversions, Comparisons, Examples
2. Locations, Personas, Integrations, Glossary
3. Translations, Directory, Profiles

Plus a proprietary data hierarchy: Proprietary > Product-derived > User-generated > Licensed > Public.

### Our Gap

Our `seo` skill covers traditional SEO audits and strategy but doesn't have a programmatic SEO framework. The FORSVN landing page already uses programmatic SEO (industries, workflows, use-cases, comparisons routes) but there's no skill to generate/maintain those.

### Implementation Plan

| Step | Action | Effort |
|------|--------|--------|
| 1 | Add programmatic SEO section to existing `seo` skill | 2hr |
| 2 | Include the 12-playbook taxonomy as a reference table | 1hr |
| 3 | Add URL structure rules (subfolders not subdomains) and internal linking patterns (hub-and-spoke) | 1hr |

**Priority:** MEDIUM. Practical addition to seo. The FORSVN site already has programmatic SEO pages; having a skill to maintain them is useful.

---

## 6. Reference File Pattern (LOW — Process)

### What It Is

Every skill keeps its SKILL.md under 500 lines by splitting deep content into `references/` files (2-5 per skill on average). The main file is the playbook; references are the encyclopedia.

### Our Assessment

We already follow this pattern partially. Our `deep`-budget skills tend to be longer. But the principle is worth encoding explicitly:
- SKILL.md = playbook (what to do, in what order)
- `references/` = depth (why, examples, templates, edge cases)

**No implementation needed** — just awareness for future skill creation.

---

## 7. Tool Integration Tables (LOW — Optional)

### What It Is

Most skills include a table of relevant third-party tools with links to integration guides. E.g., `email-sequence` lists Customer.io, Mailchimp, Nitrosend, Resend, SendGrid, Kit with per-tool notes.

### Evaluation

Low-value for our stack. Our skills are instruction-only (write briefs, generate copy, evaluate). The tool integrations belong in project-specific docs, not in the skill files. Skip.

---

## Implementation Priority

| # | Initiative | Effort | Impact | Dependencies | Recommendation |
|---|-----------|--------|--------|------------|---------------|
| 1 | Keystone product-context file | 2-3 days shared | **Highest** — eliminates redundant cold starts across all skills | None | New reference + modify all SKILL.md cold starts |
| 2 | AI-SEO skill | 3-4hr | **High** — growing relevance, distinct methodology from traditional SEO | #1 for product context | New marketing skill or section in seo |
| 3 | Seven Sweeps in copywriting | 2-3hr | Medium — deeper quality gate | copywriting exists | Reference + critic mode |
| 4 | Confidence labeling + Digital Watering Hole in icp-research | 2hr | Medium — more rigorous research artifacts | icp-research exists | Reference + critic dim |
| 5 | Programmatic SEO section in seo | 2hr | Medium — fills methodology gap | seo exists | Reference section |

**All five are independent; items 2-5 don't block on item 1.**

## Blockers

None. All implementations are skill modifications/additions with no external dependencies.

## Cross-references

- IDEA-2: Ad/copy skill upgrades (Argument Engineering, 6 Necessary Beliefs, etc.) — compatible, operates on different dimensions
- IDEA-3: Code structure / fresh-eyes closeout workflow — independent, no overlap
- IDEA-4: Production, Evaluation & Feedback architecture — item 1's shared context feeds into the feedback loop design

---

## Decision Needed

1. **Keystone context file**: Should this live at `.agents/product-context.md` (new) or be folded into the existing `experience/product.md`? The former is cleaner for the "auto-draft from codebase" pattern; the latter avoids yet another artifact surface.
2. **AI-SEO**: New skill or section within seo? New skill keeps methodology clean but adds surface area.
