# Format Conventions — SEO Artifacts

> Load this when writing or reading `docs/forsvn/artifacts/marketing/seo-[mode].md`. Conventions are contract-level — schema changes break downstream `write-copy` consumption and operator action plans.

---

## Artifact path

```
docs/forsvn/artifacts/marketing/seo-[mode].md
```

Where `[mode]` = `audit` | `ai` | `programmatic` | `competitor` | `aso`.

Full SEO (Route E, Technical + AI combined) writes to `seo-audit.md` AND `seo-ai.md` as two separate artifacts.

**Re-run convention:** before re-writing, rename existing artifact to `seo-[mode].v[N].md` and create new with incremented version. Operators compare versions to track recommendation completion + effectiveness.

---

## Frontmatter

```yaml
---
skill: optimize-seo
mode: audit | ai | programmatic | competitor | aso
version: [integer; starts at 1; increment on re-run]
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
---
```

All five fields are REQUIRED. `mode` must match the actual mode dispatched (not "full" — Route E splits into two artifacts).

---

## Body template

```markdown
# SEO: [Mode Name]

**Date:** [today]
**Skill:** seo
**Mode:** [Technical Audit | AI SEO | Programmatic SEO | Competitor Pages | ASO]
**Product:** [from product-context.md, or "[product] (no product-context.md)" if missing]

## Diagnosis

[Why this mode was chosen. What's the current situation? 2-4 sentences.]

## Findings

[Mode-specific findings from Layer 1 agents — merged by section. One H3 per agent.]

### [Section from Agent 1]

[Agent 1's findings — Issue / Impact / Evidence / Fix per finding]

### [Section from Agent 2]

[Agent 2's findings]

[Continue for all Layer 1 agents in the active mode]

## Priority Actions

| # | Action | Category | Impact | Effort | Timeline |
|---|--------|----------|--------|--------|----------|
| 1 | [action] | Quick Win | H | L | [Week 1-2] |
| 2 | [action] | Strategic | H | H | [Month 1] |

## Implementation Plan

### Phase 1: Immediate (Week 1-2)
[Quick wins — High Impact, Low Effort]

### Phase 2: Short-term (Month 1)
[Strategic investments — High Impact, High Effort]

### Phase 3: Medium-term (Month 2-3)
[Low-Hanging Fruit + remaining items]

### Phase 4: Ongoing
[Maintenance, monitoring, re-audit triggers]

## Dependencies

| Action | Depends On | Why |
|--------|-----------|-----|
| [action] | [prerequisite] | [reason] |

## Metrics to Track

| Metric | Current | Target | Check Frequency |
|--------|---------|--------|----------------|
| [metric] | [value] | [value] | [frequency] |

## Next Step

[What to do after implementing — re-audit timeline, experiment to run, etc.]

> On re-run: rename existing artifact to `seo-[mode].v[N].md` and create new with incremented version.
```

---

## Finding format

Every finding (in every Findings sub-section) follows this contract:

```markdown
- Issue: [what's wrong — be specific, name the page/template/file]
- Impact: [why it matters — quantified where possible: "47 pages deindexed, ~2,300 sessions/month lost"; not "some pages affected"]
- Evidence: [URL, metric, GSC screenshot path, or specific content cited — not "based on our analysis"]
- Fix: [exact instruction implementable without further research — name the file, the line, the change]
- Priority: Critical | High | Medium | Low
```

The critic enforces Issue/Impact/Evidence/Fix as mandatory (gate 1). Missing any field → FAIL → re-dispatch to source agent.

**Hedge language is banned in Findings.** Critic catches: "consider," "might want to," "could potentially," "it may help to," "think about." Direct: "Do X because Y."

### Retrieval-layer finding extension (AI-SEO mode only)

When the finding is a retrieval-layer recommendation (Route B or E, produced by `ai-structure-agent` or `ai-presence-agent` per `references/retrieval-layer-seo.md`), the finding adds six more required fields beyond Issue/Impact/Evidence/Fix/Priority:

```markdown
- Query: [the specific search/chat query the chunk would surface for]
- Target page: [exact URL of the page that will own the answer chunk]
- Extraction unit: [first paragraph under H2 'X' / FAQ entry titled 'Y' / comparison-table row 'Z']
- Source/corroboration gap: [primary URL the chunk needs to cite + third-party host that needs corroboration]
- Measurement query: [exact query to re-test post-fix; often the monitor-aeo persona-prefixed query]
- Expected citation behavior: [cited verbatim in Perplexity / pulled into AI Overview reference block / surfaced in ChatGPT search run with verify-resolving URL]
- Evidence class: [observed-test | single-run | unavailable | public-doc | practitioner-inference | hypothesis] (per `references/_shared/evidence-classes.md`)
```

Retrieval-layer findings missing any of Query / Target page / Extraction unit / Measurement query / Expected citation behavior / Evidence class → critic FAIL → re-dispatch to source agent. The 5 base fields remain mandatory across all modes; the 6 extension fields only fire for retrieval-layer findings in AI-SEO mode.

---

## Priority Actions — force ranking rule

`prioritization-agent` produces a single force-ranked list (numbered #1 → #N). Flat "High priority" lists are critic-FAIL.

Quadrant categories (label each action):
- **Quick Win** — High Impact, Low Effort
- **Strategic** — High Impact, High Effort
- **Low-Hanging Fruit** — Medium Impact, Low Effort
- **Backlog** — Low Impact or any-impact / Very High Effort

Phases:
- **P1 — Immediate** (Week 1-2): Quick Wins
- **P2 — Short-term** (Month 1): Strategic Investments
- **P3 — Medium-term** (Month 2-3): Low-Hanging Fruit + remaining actionable
- **P4 — Ongoing**: maintenance, monitoring, re-audit cadence

Dependencies MUST be mapped — no action recommended before its prerequisite (critic gate 6).

---

## Metrics to Track — per-mode defaults

The Metrics table varies by mode. Suggested baseline metrics:

| Mode | Required Metrics |
|---|---|
| Technical Audit | Organic sessions, indexed pages, CWV scores (LCP/INP/CLS), crawl errors |
| AI SEO | Citation appearances per platform (ChatGPT/Perplexity/Gemini), AI crawler access status, third-party presence (G2/Capterra reviews) |
| Programmatic SEO | Indexed pages per template, average unique-content word count, Helpful Content Update risk score |
| Competitor Pages | Rankings for comparison queries, share-of-voice, internal link equity to comparison pages |
| ASO | Keyword rankings (top 10 / top 50), conversion rate (impression → install), rating, review velocity |

Operators may add custom metrics. Agents recommend frequency: monthly for AI SEO + ASO, quarterly for Technical + Programmatic.

---

## Status semantics

- **done** — selected mode executed end-to-end, recommendations specific and prioritized, critic PASS within 2 cycles
- **done_with_concerns** — analysis delivered but with data gaps (rank tracker unavailable, GSC not connected, competitor data scraped at low confidence); recommendations annotated with `[CONFIDENCE: low]` tags
- **blocked** — site/property inaccessible (auth wall, robots block, no URL provided); cannot scan. State exactly what's blocked + what unblocks it.
- **needs_context** — audience or product context missing for relevance scoring; recommend running `research-icp` OR proceed with explicit scope reduction (e.g., "Technical Audit only — no audience-relevance scoring")

---

## Reference paths

Agents read mode-specific reference files (passed at dispatch, not read by orchestrator):

- `references/technical-audit.md` — Strategic audit template + CWV thresholds + URL structure + internal linking + architecture deliverables (Technical Audit mode)
- `references/technical-crawler-checklist.md` — Per-URL 12-check technical ledger + vendor-agnostic crawler-tool adapter (Technical Audit + Full modes)
- `references/ai-seo.md` — Platform-specific AI optimization + citation data + AEO techniques + monitoring tools + llms.txt spec (AI SEO mode)
- `references/retrieval-layer-seo.md` — 6-property retrieval framework + per-finding schema extension + `monitor-aeo` handoff consumption (AI SEO + Full modes)
- `references/live-serp-remediation.md` — Vendor-agnostic remediation loop + resumable manifest spec (AI SEO + Full modes when a benchmark report is supplied)
- `references/_shared/evidence-classes.md` — Shared evidence taxonomy (canonical at `skills/marketing/_shared/evidence-classes.md`); every retrieval/citation claim carries a tag
- `references/programmatic-seo.md` — pSEO template patterns + implementation (Programmatic mode)
- `references/competitor-pages.md` — Comparison page templates + keyword targeting (Competitor Pages mode)
- `references/schema-reference.md` — Schema types + implementation contexts + validation (AI SEO + all modes that touch structured data)
- `references/aso.md` — App Store / Play Store + marketplace SEO for G2 / Capterra / Product Hunt (ASO mode)
