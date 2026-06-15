# Example — SEO Technical Audit (Route A) Walkthrough

> A worked end-to-end example showing Pre-Dispatch resolution, Layer 1 parallel dispatch, merge, prioritization, critic PASS, and artifact delivery for the most common entry route (Technical Audit).

For Route B (AI SEO), Route C (Programmatic), Route D (Competitor Pages), Route E (Full), Route F (ASO) — the mechanics are identical, only the dispatched Layer 1 agents + reference catalogs differ. See `references/[mode].md` for each mode's domain knowledge.

---

## Scenario

SaaS company, Next.js site, first SEO audit. User says:

> Our organic traffic dropped 30% last quarter. We've never audited SEO. We sell project management software for engineering teams.

---

## Step 1 — Mode determination (orchestrator)

Two strong signals point to Route A:
- "Traffic dropped" → underperformance, foundational issue likely
- "Never been audited" → no AI-citation work possible until crawler access is verified (Critical Gate 2)

**Route A — Technical Audit selected.** Mode locked: `audit`.

---

## Step 2 — Pre-Dispatch resolution

Reading order per `procedures/pre-dispatch.md`:

- `research/icp-research.md` → exists. Resolves Q3 audience. Search behavior: "evaluation-stage searches for 'project management for engineering teams', comparison-tier queries with competitor names, technical evaluation queries (API integrations, time tracking, Gantt)."
- `docs/forsvn/artifacts/marketing/campaign-plan.md` → exists. Resolves IMC pillars.
- `research/product-context.md` → exists. Resolves category.
- Q1 mode → "audit" (from diagnosis)
- Q2 site → "https://example.com" (from user)
- Q3 audience → resolved from research-icp
- Q4 geo+language → check `docs/forsvn/experience/audience.md`. Found: "US-en primary, secondary Tier 1 EU." → resolved.

**All four dimensions resolved. Warm Start, no Cold Start needed.** Orchestrator announces:

```
All four dimensions resolved from artifacts. Dispatching Route A (Technical Audit) for example.com.
```

---

## Step 3 — Pre-writing object

```yaml
site_url: "https://example.com"
site_type: "SaaS"
cms_framework: "Next.js"
mode: "audit"
known_issues: "30% organic traffic drop last quarter, never been audited"
icp_data: "Engineering team leads + IC engineers; eval-stage searches for PM tools with API integrations and time tracking; comparison-tier queries with Jira/Linear/Asana"
competitors: ["jira.atlassian.com", "linear.app", "asana.com"]
brand_name: "Acme PM"
category: "project-management-software"
```

---

## Step 4 — Layer 1 dispatch (parallel)

Four agents dispatched simultaneously per Route A. Each receives the pre-writing object + absolute path to `references/technical-audit.md`.

### crawl-agent finds

```
- Issue: robots.txt line 8 blocks /resources/ (47 indexed guides)
- Impact: 47 guide pages deindexed, ~2,300 sessions/month lost (cross-referenced with GSC drop date)
- Evidence: robots.txt fetched 2026-05-18 14:32 UTC, line 8: `Disallow: /resources/`. GSC "Pages excluded by robots.txt" shows 47 URLs under /resources/.
- Fix: Replace `Disallow: /resources/` with `Disallow: /resources/internal/` (preserves the original intent of blocking internal-only guides while exposing public ones).
- Priority: Critical
```

### foundations-agent finds

```
- Issue: LCP is 4.2s on /pricing (hero image 2.4MB PNG)
- Impact: Fails CWV (threshold: <2.5s), poor mobile experience on highest-intent page (pricing pages convert at 2-4x other pages — Princeton 2025 CWV-conversion study)
- Evidence: PageSpeed Insights run 2026-05-18: LCP 4.2s, hero.png is 2.4MB, currently <img> not next/image.
- Fix: Convert hero.png to WebP via next/image, add priority loading. Expected: ~180KB, LCP <2s.
- Priority: Critical
```

### content-quality-agent finds

```
- Issue: 23 integration pages average 142 words unique content each
- Impact: Helpful Content Update risk — thin pSEO pages can drag down domain quality (HCU rolled out 2023-09 + 2024-03 + 2025-08; documented penalty pattern for thin-template farms)
- Evidence: Crawled /integrations/* on 2026-05-18; pages average 142 words after stripping shared template (header, footer, sidebar, CTA boilerplate). 23 of 27 integration pages are below the 200-word threshold.
- Fix: Add 2-3 unique workflows + setup steps per integration page. Target 600+ unique words. Prioritize top 5 by current traffic (jira, slack, github, linear, asana).
- Priority: High
```

### authority-agent finds

```
- Issue: /pricing has 0 internal links from blog posts (12 posts mention pricing)
- Impact: Highest-intent page has no internal link equity from content; blog drives ~40% of organic sessions per GSC
- Evidence: Internal link audit via Screaming Frog 2026-05-18: /pricing has 47 internal links (all from navigation + footer); 0 from blog post body content. 12 posts mention pricing by string-match.
- Fix: Add contextual links to /pricing from 12 blog posts that mention pricing. Use anchor text variants ("pricing plans", "Acme PM pricing", "see pricing"); avoid identical anchor on every link.
- Priority: Medium
```

---

## Step 5 — Merge into artifact template

Orchestrator merges per `references/format-conventions.md`. Four agents → four H3 sections under `## Findings`. Frontmatter populated. Diagnosis written.

---

## Step 6 — Prioritization

`prioritization-agent` produces:

**Quick Wins:**
1. Fix robots.txt /resources/ block (Critical, 5 minutes) — recovers 47 deindexed pages
2. Add internal links to /pricing from 12 blog posts (Medium impact, 2 hours)

**Strategic Investments:**
3. Convert hero images to WebP across site (Critical, 1-2 days)
4. Enrich 23 integration pages with unique content (High, 2-3 weeks; prioritize top 5)

**Dependencies mapped:**
- Action #1 has no prerequisites.
- Action #3 should run before action #4 (CWV fixes improve all pages including integration pages).

---

## Step 7 — Critic gate

`critic-agent` evaluates against the 10-item checklist:

```
## Verdict: PASS

### Quality Gate Checklist
- [x] Every finding has Issue, Impact, Evidence, and Fix fields
- [x] Every Fix is specific enough to implement without further research
- [x] No vague language: "consider," "might want to," "could potentially"
- [x] Priority actions are ranked (not a flat list)
- [x] Implementation phases have timelines
- [x] Dependencies are mapped
- [x] Mode-appropriate coverage (all 4 Technical Audit layers covered)
- [x] AI SEO recommendations: N/A (Route A — not AI SEO mode)
- [x] Technical specs reference correct thresholds (CWV LCP <2.5s cited)
- [x] Source recency: data and recommendations reflect current standards (HCU rollouts cited, Princeton 2025 CWV study)

### Strengths
- Every finding has dated evidence (crawl date, GSC date, PageSpeed run date) — meets gate 10 (source recency) at the evidence level, not just the recommendation level
- Fix for robots.txt preserves the original intent (block internal-only) rather than just removing the directive — shows the agent reasoned about why the block existed

### Minor Suggestions (non-blocking)
- authority-agent's anchor-text variant suggestion could be more specific — provide 5-7 actual variants the writer can rotate
```

---

## Step 8 — Deliver

Artifact written to `docs/forsvn/artifacts/marketing/seo-audit.md`. Frontmatter:

```yaml
---
skill: optimize-seo
mode: audit
version: 1
date: 2026-05-18
status: done
---
```

Operator receives:

```
DONE — seo audit complete. Artifact at `docs/forsvn/artifacts/marketing/seo-audit.md`.

4 Critical findings prioritized. Quick wins (P1, Week 1-2): robots.txt fix + internal link build.
Strategic (P2, Month 1): WebP conversion. P3 (Month 2-3): integration page enrichment.

Re-audit cadence: quarterly for Technical Audit (next: 2026-08-18).
```

---

## What if the critic had FAILED?

Example: critic catches "Consider improving meta descriptions" in authority-agent's output (gate 3 hedge-language).

```
## Verdict: FAIL

### Failures

#### Failure 1
**Section:** Findings → Authority
**Source agent:** authority-agent
**Problem:** Recommendation reads "Consider improving meta descriptions on blog posts." Hedge language ("consider") violates gate 3. Also missing specific page list, current vs. target lengths, expected CTR impact.
**Specific fix:** Replace with: "Update meta descriptions on 12 blog posts that link to /pricing. Current descriptions average 87 chars (truncated in SERPs). Rewrite to 145-160 chars each with primary keyword + CTA. Expected SERP CTR lift 0.5-1pp based on industry benchmarks."
**Re-dispatch to:** authority-agent
```

Orchestrator re-dispatches authority-agent ONLY with the per-agent feedback. Layer 1 merge runs again with the revised authority section + the 3 other agents' original outputs (unchanged). prioritization-agent re-runs. critic-agent re-evaluates. PASS → deliver. After 2 FAIL cycles → deliver with `[REVIEWER NOTE: authority section did not fully resolve after 2 cycles]` and warn operator.

---

## --fast variant of this scenario

Same scenario, `--fast` flag passed:

1. Pre-Dispatch: same Warm Start resolution (still ask Cold Start if any of the 4 dimensions unresolved — `--fast` doesn't skip Cold Start)
2. Dispatch ONE agent: foundations-agent (first agent in Route A Layer 1 list)
3. foundations-agent writes the artifact directly — covers CWV + on-page + URL structure
4. NO prioritization, NO critic
5. End: "Ran in --fast mode; rerun without the flag for full critique."

`--fast` Route A returns a foundations-only audit. Operator may invoke again without `--fast` for the full 4-agent dispatch + critic gate. The `--fast` artifact still uses the same frontmatter + body template + Critical Gates 1-4 self-enforcement.
