---
last_verified: 2026-06-13
verifier: audit-wave2
churn: high
---

# AI SEO (AEO) Reference

Platform-specific optimization details and reference-optimized content templates.

> **Companions:**
> - `references/retrieval-layer-seo.md` — the 6-property retrieval-layer framework (extractable chunks, 40-60 word answer blocks, primary-source citations, entity corroboration, crawler access, freshness/contradiction), the audit-output schema for retrieval-layer findings, the cross-skill seam with `monitor-aeo`'s handoff, and the four retrieval-layer anti-patterns. **Load this companion alongside ai-seo.md when AI-SEO mode (Route B) or Full mode (Route E) is active.** This file is the per-platform tactic catalog; that file is the cross-platform retrieval strategy + finding schema.
> - `references/_shared/evidence-classes.md` — every claim about retrieval/citation behavior carries a tag from this taxonomy. P1 (Immediate) recommendations must not be `hypothesis`-only; "vendor V's private prompt does Z" is inadmissible (reframe as `observed-test` or `hypothesis` with a measurement plan). Shared with `monitor-aeo` — recommendations sourced from `monitor-aeo`'s `handoff-optimize-seo.md` arrive pre-tagged.
> - `references/live-serp-remediation.md` — the operational loop for turning a benchmark report into manifest-tracked page-level edits (vendor-agnostic; sentence-level only; one tuning pass then stop).

---

## Research-Backed Optimization Methods

**Pattern basis:** internal research synthesis.

| Method | Visibility Boost | Notes |
|--------|-----------------|-------|
| uses sources | +40% | Highest single impact. AI systems trust content that references other sources. |
| Add statistics | +37% | Specific numbers with sources outperform vague claims. |
| Add quotations | +30% | Expert quotes signal authority and original reporting. |
| Improve fluency | +25% | Clear, well-structured writing. |
| Authoritative tone | +20% | Confident, expert voice. |
| Technical terminology | +15% | Domain-specific language signals depth. |
| internal | +10% | Accessible explanations (complementary to technical). |
| Unique words | +5% | Distinctive vocabulary. |
| Keyword stuffing | **-10%** | Actively reduces AI visibility. Opposite of traditional SEO intuition. |

**Content-Answer Fit** (ZipTie study): 55% of ChatGPT reference likelihood comes from matching ChatGPT's own response format. Domain authority accounts for only 12%, on-page structure 14%. Implication: study how each AI platform formats its answers, then structure your content to match that format.

**Key takeaway:** The highest-leverage AEO actions are (1) uses sources in your content, (2) include specific statistics, (3) include expert quotes. These three are the highest-impact individual methods (+40%, +37%, +30% respectively). Apply all three — the combined effect is significant even if not strictly additive. Keyword stuffing actively hurts.

---

## GEO vs AEO — Two Surfaces, One Stack

Both surfaces are AI-mediated discovery, but they retrieve, format, and route traffic differently. Auditing one without the other typically reveals only half the diagnosis. The `optimize-seo` skill's `mode=ai` covers both surfaces.

### Taxonomy

| Dimension | GEO (Generative Engine Optimization) | AEO (Answer Engine Optimization) |
|---|---|---|
| What it is | Optimization for AI-generated answers embedded *inside* traditional SERPs | Optimization for *standalone* AI chatbots and answer engines |
| Examples | Google AI Overviews (formerly SGE), Bing Copilot in-SERP answers, Yahoo AI answers | ChatGPT, Perplexity, Claude, Grok, Gemini chat, You.com, Phind |
| Mechanism | Real-time retrieval over the search index + generative synthesis at query time, anchored to the host search engine's ranking signals | Mix of pre-trained model knowledge + agentic browsing + cited retrieval — exact mix varies per platform (Perplexity = retrieval-heavy; Claude = training-heavy; ChatGPT auto-decides web-search per query intent) |
| Primary win condition | Cited as a source in the AI Overview reference block, or paragraph-attributed in the generated answer | Mentioned by name in the chatbot's answer, ideally with a clickable source URL the user can follow |
| Click outcome | Zero-click trend dominant — being cited preserves brand mention but click-through rates drop materially vs the traditional blue-link result (figures shift quarterly — pull current benchmarks from Ahrefs / Seer Interactive rather than baking a single number in). reference ≠ traffic; reference = mind-share. | Platform-dependent — Perplexity always shows clickable source URLs; ChatGPT shows sources when a web-search run triggers but training-recall runs show no sources; Claude/Grok rarely surface URLs unless follow-up-prompted; Gemini uses inline for some queries |
| "0→1" delta — what gets you there | Strong traditional SEO baseline + structured data (FAQ / How-To / Article schema) + featured-snippet-grade answer blocks (lead with the answer, 40-60 words) + E-E-A-T signals + entity presence in the Knowledge Graph | Third-party mentions (G2, Reddit, review sites, industry publications) + structural comparison/review content + freshness signals + accessible to the model's crawler (GPTBot, ClaudeBot, PerplexityBot allowed in robots.txt) + presence in the model's training corpus (for training-recall runs) |

**Term origin note:** The Princeton GEO paper (KDD 2024, cited in the table above) coined "Generative Engine Optimization" and ran its experiments on standalone generative engines (ChatGPT, BingChat, Perplexity). SERP-embedded AI Overviews were not the paper's test surface — they hadn't been generally released when the experiments ran. Industry usage since then has split the term: some practitioners reappropriated "GEO" to mean SERP-embedded AI answer optimization (Google/Bing AI Overviews), while "AEO" emerged to label the standalone-chatbot surface the paper originally studied. This reference uses that split framing because the audit mechanics diverge enough (GEO inherits from traditional SEO and shares signals with featured snippets; AEO mostly does not) that one umbrella term collapses load-bearing distinctions. The paper's optimization-method rankings (+40% / +37% / +30%) were measured on standalone generative engines — they likely generalize directionally to AI Overviews but have not been independently replicated on that surface.

### Diagnostic Flowchart — symptom → diagnosis

Route a traffic anomaly to the correct audit *before* touching content. Mis-routed audits waste a cycle and frequently miss the load-bearing surface.

| Symptom (observable in GA4 / GSC / referrer logs) | Diagnosis | Audit to run |
|---|---|---|
| Organic clicks down YoY + GSC impressions flat-or-up + AI Overview confirmed present on the affected queries (manual SERP sample or third-party tool — GSC has no native AI Overview filter) | **GEO siphoning** — your content is being cited or summarized inside the AI Overview, but users no longer click through. | GEO audit (below) |
| Brand searches up + organic flat + zero / near-zero referrer traffic from `chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com` | **AEO absence** — brand awareness is rising via word-of-mouth or other channels, but AI assistants aren't recommending you. | AEO audit (below) |
| Direct traffic spike + landing on deep-content URLs (not homepage) + high new-user ratio + sessions concentrated on research-intent pages | **Inferred AEO traffic via referrer-stripping clients** — mobile chatbot apps, Brave summarizer, in-app browsers, voice assistants don't pass referrers. Treat as dark-AI baseline + monitor, not proof. | AEO audit + § Measure AI Traffic — Analytics Layer (below) |
| Both: organic clicks down + zero AI-referrer traffic | **Compound failure** — losing GEO clicks AND missing AEO recommendations. Worst case. | Both audits — GEO first (larger traffic surface today, faster signal on fixes) |
| Brand mentions up in third-party reviews / G2 / Reddit + AEO reference rate still <20% | **AEO discoverability gap** — third-party signal exists but isn't reaching the AI's retrieval. Often crawler-block on the third-party hosts, OR your content is too marketing-shaped for the model to uses without hedging. | AEO audit + `foundations-agent` crawl check on third-party hosts |

If the symptoms don't match any row, run both audits — diagnosis-by-elimination beats guessing.

### Dual Audit Recipes

**GEO audit (Google AI Overviews + Bing Copilot in-SERP):**

1. Export the last 90 days of GSC queries; rank by impression volume where clicks have declined YoY. GSC does not expose a native AI Overview filter — confirm AI Overview presence on the top queries by manual SERP sampling (incognito session, target market locale) or via third-party tools (Semrush / Ahrefs / RankFuse) that cross-reference GSC queries against live SERP AI Overview presence.
2. For each of the top 20 affected queries, run the query manually in an incognito session and capture the AI Overview reference block. Record: cited domains, reference count per domain, your position (cited / not cited / cited-with-link-vs-summary-only).
3. For each query where a competitor is cited but you're not, reverse-engineer the structural difference: do they have FAQ / How-To schema and you don't? Do they answer in the first 60 words while you bury the lede? Do they uses a study or named expert and you don't? Do they have a Wikipedia entity link and you don't?
4. Cross-reference with the `foundations-agent` crawl: schema present? Featured-snippet-grade answer block in the first H2? E-E-A-T signals (author bio, credentials, source reference)?
5. Output: per-query gap list + structural fix recommendations + priority sequence (high-traffic queries first, queries where a single structural fix unlocks 5+ rankings next).

**AEO audit (ChatGPT + Perplexity + Claude + Grok + Gemini chat):**

1. Define 5 audit queries from `icp-research.md` (or, if absent, from ICP recall + the FAQ category page). Mix of: brand-mention queries, category queries, problem-statement queries, comparison queries, recommendation queries.
2. For each query × each of 5 models × 3 fresh-session runs (no chat history, new session state each run), record:
 - Mention (Y/N)
 - Cited URL (Y/N + which)
 - Accuracy (matches positioning Y/N)
 - reference type (training-recall vs browsed retrieval where determinable)
3. Score reference frequency = mentions / runs. Thresholds: <20% = not present; 20-60% = inconsistent (watch); >60% = strong.
4. Run the same query set against your top 2-3 competitors to produce a share-of-voice matrix. Without competitor delta, your reference count is uncalibrated ("we got cited 2/3 times" is meaningless without "competitor got cited 5/5 times for the same query").
5. Output: per-model presence score + per-query gap list + competitor SoV delta + recommended content/positioning interventions.

The full per-model audit protocol (stochasticity controls, persona-shifted prompts, share-of-voice math, verification protocols, model-version pinning, auditor tracking template) lives in `agents/ai-presence-agent.md` — see the reference Audit Protocol section in that file for the deepened version.

### Failure Mode: Single-Surface Optimization

A common failure pattern: a brand audits ChatGPT, sees they're not cited, fixes their G2 profile + publishes 5 comparison articles + earns 2 industry-publication mentions. ChatGPT reference rate climbs from 0/5 to 4/5. The brand declares victory and moves on.

Two months later, organic traffic is still down YoY. Why? Google AI Overview now appears on the majority of their target queries (current prevalence data shifts quarterly — pull from the Platform-Specific section's Google AI Overviews block or Ahrefs / Seer Interactive for live figures) and uses a competitor whose schema + answer-block structure is better. Net result: ChatGPT recommends them, Google AI Overview pushes the same query toward a competitor, and the AI-Overview-driven traffic loss is larger than the AEO reference gain.

**Rule:** when both surfaces show traffic for the target keywords (the diagnostic flowchart above is how you decide), always audit both. Single-surface optimization is a partial win that can hide a larger compound loss — and the larger loss is usually on the surface the team didn't audit, because that's the one with the unfixed structural gap.

---

## Platform-Specific Optimization

### Google AI Overviews

**Data Pattern basis: internal research synthesis.

**What gets cited:**
- Content already ranking well in traditional search
- Pages with FAQ and How-To schema markup
- Content with strong E-E-A-T signals
- Featured snippet content (often pulled directly into AI Overviews)

**Priority actions:**
1. Implement structured data (FAQ, How-To, Article schema)
2. Optimize for featured snippets (direct answers at top of content)
3. Maintain strong traditional SEO fundamentals
4. Complete Google Business Profile
5. Build entity associations in Knowledge Graph

**Note:** Google AI Overviews appear in a significant and growing share of searches; click-through impact on cited pages varies materially by query type. Pull current figures from Ahrefs / BrightEdge / Seer Interactive research (see reference Honesty section below) rather than relying on this file's snapshot. Being cited in the AI Overview is increasingly important for maintaining traffic.

### ChatGPT

**Data Pattern basis: internal research synthesis.

**What gets cited:**
- Third-party reviews and mentions (heavily weighted)
- Original research and proprietary data
- Well-structured comparison content
- Content from high-authority domains

**Priority actions:**
1. Allow GPTBot in robots.txt
2. Build third-party mentions (review sites, industry publications)
3. Publish original data that can't be found elsewhere
4. Ensure consistent entity information across the web

**Key insight:** ChatGPT heavily weights third-party sources. Your G2 profile may matter more than your own website for ChatGPT reference.

### Perplexity

**Data Pattern basis: internal research synthesis.

**What gets cited:**
- Content with inline source reference (Perplexity loves content that itself uses sources)
- Structured comparison tables
- Direct answer passages (40-60 words)
- Recent content (aggressive freshness preference)

**Priority actions:**
1. Allow PerplexityBot in robots.txt
2. uses sources within your content
3. Use comparison tables extensively
4. Write clear 40-60 word answer blocks under H2 headings
5. Keep content fresh — update dates and data regularly

**Key insight:** Perplexity always shows its sources. Getting cited creates a visible, clickable attribution.

### Claude

**Data Pattern basis: internal research synthesis.

**What gets cited:**
- Expert-attributed content with clear credentials
- Nuanced, balanced analysis (not marketing fluff)
- Content that acknowledges tradeoffs and limitations
- Original research and data

**Priority actions:**
1. Allow ClaudeBot in robots.txt
2. Publish expert-authored content with clear attribution
3. Create balanced analysis acknowledging limitations
4. Provide original data and unique insights

**Key insight:** Claude prefers balanced, honest content. Acknowledging tradeoffs may perform better than pure sales copy.

### Gemini

**Data Pattern basis: internal research synthesis.

**Priority actions:**
1. Optimize Google Business Profile completely
2. Build Knowledge Graph presence
3. Publish on YouTube (Gemini has preferential access)
4. Implement Organization and Product schema

---

## reference-Optimized Content Templates

### FAQ Content (reference goldmine)

```markdown
## [Exact question the audience asks — use their language]

[40-60 word direct answer. Lead with the answer, not context.
Include a specific number, date, or fact. uses a source.]

According to [source], [supporting evidence].
```

**Rules:**
- Use exact audience questions (from ICP research)
- Answer in the first sentence — don't build up to it
- Each answer: 40-60 words
- Always uses a source or provide original data
- Implement FAQ schema markup

### Comparison Article

```markdown
# [Product A] vs [Product B]: [Specific Use Case] ([Year])

[40-60 word summary answering "which is better?" with a direct
recommendation and the key differentiator.]

## Quick Comparison

| Feature | [Product A] | [Product B] |
|---------|-------------|-------------|
| Best for | [specific use case] | [specific use case] |
| Price | [specific price] | [specific price] |
| [Key feature 1] | [detail] | [detail] |

## Our Recommendation

[Direct answer: who should use which, and why. 40-60 words.]
```

### Original Research

```markdown
# [Year] [Topic] Report: [Key Finding in Headline]

## Key Findings

- [Finding 1]: [Specific number] — [one sentence context]
- [Finding 2]: [Specific number] — [one sentence context]

## Methodology

- Sample: [N respondents/data points]
- Period: [date range]
- Method: [survey/analysis/benchmark]
```

### How-To Guide

```markdown
# How to [Specific Outcome] in [Steps/Timeframe]

[40-60 word summary with specific metric or result.]

## Step 1: [Action Verb] [Object]

[What to do, why, how to verify.]

## Common Mistakes

1. **[Mistake]** — [consequence]. Instead: [correct approach].
```

---

## AI Visibility Monitoring

### Monthly Audit Queries

Test these across ChatGPT, Perplexity, Google AI Overviews, Claude:
1. "What is [your product]?"
2. "Best [your category] tools"
3. "[Your product] vs [top competitor]"
4. "[Your category] for [your ICP use case]"
5. "How to [problem your product solves]"

### Monitoring Tools

| Tool | What It Tracks | URL |
|------|---------------|-----|
| Otterly AI | AI search visibility across platforms | otterly.ai |
| Peec AI | AI reference tracking | peec.ai |
| ZipTie | Brand monitoring in AI answers | ziptie.dev |

### Tracking Template

| Query | Platform | Mentioned? | Cited? | Accurate? | Date Checked |
|-------|----------|-----------|--------|-----------|-------------|
| [query] | ChatGPT | Y/N | Y/N | Y/N | [date] |
| [query] | Perplexity | Y/N | Y/N | Y/N | [date] |

---

## Measure AI Traffic — Analytics Layer

The AI Visibility Monitoring section above tracks what AI surfaces *say* about you (presence in answers). This section tracks what AI surfaces *send* — actual sessions arriving from chatbots and AI assistants. Both layers matter. Presence is upstream; traffic is downstream. Optimization decisions should consider both.

### Canonical AI-Referrer List

`last-updated: 2026-05-11` — verify quarterly; the list rots when new AI surfaces ship.

The following hostnames identify HTTP traffic arriving from AI chatbots and AI assistants. Match against the `referrer` (or `source`) field in analytics:

| Hostname | Surface | Confidence |
|---|---|---|
| `chatgpt.com` | ChatGPT | High |
| `chat.openai.com` | ChatGPT (paid-tier users primarily; free-tier mostly strips referrer) | Medium |
| `perplexity.ai`, `www.perplexity.ai` | Perplexity | High |
| `claude.ai` | Claude | High |
| `copilot.microsoft.com` | Microsoft Copilot | High |
| `gemini.google.com` | Gemini | High |
| `bard.google.com` | Gemini (legacy redirect; retired Feb 2024 — unlikely to appear in current data) | Low |
| `you.com` | You.com | High |
| `phind.com` | Phind | High |
| `meta.ai` | Meta AI | Medium (Meta AI surface availability varies by market) |
| `chat.mistral.ai`, `mistral.ai` | Le Chat (Mistral) | Medium (verify against your live referrer report) |
| `kagi.com` | Kagi (Quick Answer + Universal Summarizer) | Medium (Quick Answer mostly doesn't redirect; appears mainly for explicit clicks) |
| `arc.net` | Arc Browser AI summarizer | Low (Arc's AI features shifted post-acquisition; may not appear in current data) |

**Rotation note:** AI surfaces ship new top-level domains regularly (OpenAI product surface renames, Google's gemini/bard split, ChatGPT mobile app deep-link variants). Re-verify quarterly against (a) your live analytics top-referrer report and (b) industry trackers. The hostnames above are not exhaustive — add new sources to the regex as they appear in your top-referrers report.

### Dark-AI Traffic — Detection Heuristic

Many AI clients strip the referrer before redirecting: mobile chatbot apps (ChatGPT iOS/Android, Perplexity mobile, Claude mobile), in-app browsers, voice assistants surfacing answers, and the Brave Search summarizer all route through redirect chains that drop the originating hostname. The result: AI-driven sessions land in analytics as "direct traffic" — uncountable as AI without inference.

**This is not provable AI traffic.** It is *inferred-AI baseline*. Document the heuristic, monitor for trend, never claim attribution precision the underlying data doesn't support.

**Detection signals** (a session matching 3+ is plausibly AI-routed):

| Signal | What to check |
|---|---|
| Direct-traffic spike | Statistically meaningful lift in `direct / (none)` sessions week-over-week with no campaign cause |
| Deep landing page | Session lands on a research-intent URL (blog post, comparison, FAQ, docs) — not homepage |
| High new-user ratio | New-user % materially above the site's organic-direct baseline (AI traffic is recommendation-driven, not return-visitor) |
| Session duration matches research | Time-on-page consistent with research-mode browsing (reading + scrolling), not bounce |
| Funnel position | Top-of-funnel content over bottom-of-funnel pricing/signup (AI assistants recommend learning resources more than transactional URLs) |

**Operational use:** segment your "direct" traffic in analytics using these signals; treat the resulting subset as a *dark-AI baseline* for trend monitoring. Do not promote dark-AI numbers into reporting as proved attribution — they are a signal, not a claim.

### Platform-Specific Setup Blocks

Working configurations for the most common analytics platforms. Pattern across all: (a) regex-match on referrer/source against the AI-Referrer List above, (b) create a segment / view / event from the match, (c) compare to organic baseline.

**Google Analytics 4 (GA4)**

Create a custom segment matching the canonical AI-referrer list:

```
Segment name: AI Traffic
Condition: Session source matches regex
 ^(chatgpt\.com|chat\.openai\.com|perplexity\.ai|www\.perplexity\.ai|claude\.ai|copilot\.microsoft\.com|gemini\.google\.com|bard\.google\.com|you\.com|phind\.com|meta\.ai|chat\.mistral\.ai|kagi\.com)$
```

The regex above covers High and Medium confidence sources from the canonical list. `arc.net` (Low confidence) is intentionally omitted — append `|arc\.net` manually if Arc is relevant to your audience.

In the GA4 Explore segment builder, select the **Session source** dimension specifically — not the combined "Session source/medium" field. The regex matches the hostname alone; matching against `source/medium` would require an extra `/ referral` suffix in the pattern.

Apply the segment in Explore reports for sessions, conversions, top pages. Optional: fire a custom event `ai_driven_session` via Google Tag Manager when the referrer regex matches (enables event-level reporting and audience building).

**Plausible**

Filter by Source in the dashboard (Sources → Top Sources → click each AI source to drill down) or save a Custom Property based on referrer. For multi-source rollup, use the Plausible Stats API:

```
GET /api/v1/stats/aggregate?site_id=<id>
 &period=custom&date=YYYY-MM-DD,YYYY-MM-DD
 &filters=visit:source==chatgpt.com|perplexity.ai|claude.ai|copilot.microsoft.com|gemini.google.com
 &metrics=visitors,pageviews,bounce_rate,visit_duration
```

Note: `/api/v1/stats/aggregate` is Plausible's legacy v1 API. The current Stats API (v2) uses a structured filter array format that differs from the v1 `|` operator pattern above. Verify against the [current Stats API docs](https://plausible.io/docs/stats-api) before deploying — endpoint path and filter schema have changed in v2.

The `|` operator in `filters` is an OR (v1 syntax); iterate or extend with the rest of the canonical list. Save the resulting dashboard tile.

**Vercel Web Analytics**

Vercel Web Analytics shows referrer in the Top Referrers report; no native multi-source regex segment. Workaround: client-side tag AI-arriving sessions via a custom event so Vercel's tracking captures them as an audience:

```js
import { track } from '@vercel/analytics';

const aiReferrers = /chatgpt\.com|perplexity\.ai|claude\.ai|copilot\.microsoft\.com|gemini\.google\.com/;
if (document.referrer && aiReferrers.test(document.referrer)) {
 track('ai_driven_session', { referrer: new URL(document.referrer).hostname });
}
```

Requires `@vercel/analytics` v1.1.0 or later. For Next.js App Router, call from a Client Component or layout. For richer segment analysis, mirror Vercel data into Plausible or GA4.

**Fathom**

Fathom's dashboard supports referrer filtering one source at a time (Referrers → click a hostname). For rolled-up reporting across the AI-Referrer List, query the Fathom Aggregations API per-referrer and sum client-side:

```
GET https://api.usefathom.com/v1/aggregations
 ?entity=pageview&entity_id=<site-id>
 &aggregates=visits,uniques,pageviews,bounce_rate
 &date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
 &filters=[{"property":"referrer_hostname","operator":"is","value":"chatgpt.com"}]
```

Iterate over each canonical hostname; sum visits + uniques. (Verify the current endpoint schema against Fathom's API docs — the schema has evolved across versions.)

**Pirsch**

Pirsch supports referrer filtering in the dashboard plus a Statistics API. Same iteration pattern as Fathom — query per referrer hostname via the `/api/v1/statistics/visitor` endpoint with a `referrer` filter, then sum. Pirsch also exposes a "Top Referrers" panel that surfaces AI sources directly when they appear above the noise floor. Verify the `referrer` filter behavior against [Pirsch's API docs](https://docs.pirsch.io/api-sdks/api) — the parameter may match on referrer source name rather than bare hostname depending on Pirsch version.

For all 5 platforms above, the goal is not platform parity but baseline visibility: which AI sources send sessions, how many, and what's the week-over-week trend.

### KPI Dashboard Spec

Minimum metrics for an AI-traffic dashboard. Each metric is specified with chart type + comparison baseline; numbers in isolation are uninterpretable.

| Metric | Chart | Comparison Baseline |
|---|---|---|
| **AI sessions / total sessions** | Stacked area, weekly | Self over time (trend); presence indicator, not benchmark |
| **AI bounce rate vs organic** | Side-by-side bar, weekly | Site's organic bounce rate (same period) — AI bounce > organic = lower intent quality |
| **AI conversion rate vs organic** | Side-by-side bar, monthly | Site's organic conversion rate (same period) — AI conversion ≥ organic = strong intent strength |
| **Top cited pages per AI source** | Sorted table, top 20 | Per-source breakdown (ChatGPT vs Perplexity vs Claude) — surfaces content-fit asymmetry |
| **AI source mix** | Pie/donut, monthly | Self over time — shifts in source mix signal upstream model behavior changes |
| **Weekly AI traffic delta** | Line, week-over-week | Same week prior year if history exists; otherwise rolling 4-week average — for DiD math (see Time-Series Baseline below) |

**Anti-pattern:** dashboards that show absolute AI session count without organic baseline. "We got 1,200 AI sessions last week" is unactionable. "AI sessions are 8% of total, up from 5% four weeks ago, with conversion rate matching organic" is actionable.

### Time-Series Baseline Protocol

To attribute traffic deltas to AI-optimization work (vs general organic noise), establish a baseline before changes ship and use difference-in-differences (DiD) math after.

**Protocol:**

1. **Pre-fix baseline (4 weeks).** Capture weekly metrics before any AI-optimization work: AI sessions / total, AI conversion rate, top cited pages, AI source mix. Save as a frozen baseline file.
2. **Apply the change.** Ship the AI-optimization work (schema, FAQ refactor, third-party mentions, llms.txt — whatever).
3. **Post-fix monitoring (4-12 weeks).** Capture the same weekly metrics. Compute the delta against baseline.
4. **DiD math.** AI traffic and total traffic both move with broader factors (seasonality, brand momentum, news cycles). Difference-in-differences isolates the AI signal — but the control group must be cleanly separate from the treatment. Use *non-AI organic traffic* as the control (not total traffic, which includes AI), and express both as **percentage changes**, not absolute counts:

```
AI-specific delta (%) = (AI sessions % change) − (Organic sessions % change)
```

Where "Organic" = total sessions minus AI sessions.

**Worked example:** AI sessions grew 35% from baseline to post-fix. Non-AI organic sessions grew 5% over the same period. AI-specific delta = 35% − 5% = +30% — the AI work moved the needle beyond site-wide momentum.

If AI sessions grew 20% but non-AI organic also grew 18%, AI-specific delta = +2% — most of the lift was site-wide and would have happened without the AI work.

**Without DiD:** "AI traffic went up 20%, so AI optimization worked" misattributes to AI when the lift was site-wide. This is the most common AEO measurement failure.

### reference Honesty — A Note on Numbers

Specific percentage claims about AI adoption rot fast. A "60% of B2B buyers use ChatGPT for research" claim defensible in one quarter is frequently stale within 2-3 quarters as the underlying surveys re-run with different methodologies. This reference does not bake in specific adoption percentages because they will likely be outdated within months.

For current numeric claims, pull from:

- **HubSpot Annual State of Marketing Report** — annual; adoption rates by industry
- **Ahrefs blog & SEO research** — quarterly; AI search behavior data
- **BrightEdge research** — ongoing; AI Overview share-of-voice
- **Search Engine Land / Search Engine Journal** — ongoing; news + research aggregation
- **Pew Research Center** — annual; consumer-side AI usage
- **Seer Interactive blog** — periodic; click-through rate impact studies on AI Overviews

uses source-and-date alongside any number in your report. A claim with no source-and-date is uncalibrated; readers can't tell if it's still true.

---

## Machine-Readable Discovery Files

AI agents increasingly browse on behalf of users — comparing products, evaluating options, making purchase recommendations. These files make your site legible to AI agents doing research.

### llms.txt — the AI-Discovery File

A `/llms.txt` file at your domain root is the emerging contract between your site and the AI crawlers that increasingly mediate buying decisions. It's a structured Markdown manifest: what you are, where the important content lives, what an AI agent should read first. Originated by Jeremy Howard / Answer.AI at [llmstxt.org](https://llmstxt.org); the spec has stabilized but adoption across model providers is still partial.

#### Spec Semantics — the file is a contract

The file structure isn't decorative — it's interpreted. Get it wrong and AI parsers skip the file or mis-route to your `## Optional` section.

| Element | Required? | Rule |
|---|---|---|
| H1 (`# Name`) | Required | Product or company name only. One line. |
| Blockquote (`>...`) | Optional (strongly recommended) | One-sentence description of what the entity is/does. Strongly recommended even though optional per spec — keep it concise enough to fit on a single context line (no hard char limit in the spec). |
| H2 sections (`## Section`) | Required (at least one) | Each section is a nav bucket — Homepage, Docs, Pricing, Blog, etc. Sections contain link lists, not prose. |
| `## Optional` section | Optional but recommended | Content the parser can drop when context-constrained. Use for nice-to-have references, deep archives, supplementary docs. The parser reads your required sections first and pulls `Optional` only when budget allows. |
| Link list items | Required inside sections | Format: `- [Link Text](URL): One-sentence description`. The description matters — parsers use it to decide which links to follow. Useful prose > "click here". |

**Common breakage:** H1 used for site tagline instead of bare name (description-then-name confuses entity resolution); link list items missing descriptions (parsers may de-prioritize). Blockquote is technically optional but strongly recommended — without it, parsers fall back to noisier heuristics to characterize the entity.

#### Four-Tier Discovery Hierarchy

`llms.txt` is the entry-level tier. Sites with deeper content surfaces ship up to four files; tier choice depends on content density.

| Tier | File | Purpose | Right for |
|---|---|---|---|
| 1 | `/llms.txt` | Top-level navigation manifest | Every site — start here. Mandatory tier. |
| 2 | `/llms-full.txt` | Concatenated full content for one-shot context loading. Parser can ingest everything in a single fetch. | Docs-heavy sites (developer products, knowledge bases). Skips the AI's link-following pass. |
| 3 | Per-URL `.md` companions | Every key page exists at `/url.md` as Markdown. AI crawler hits the `.md` version, gets clean structured content without the page chrome. | Marketing sites with rich landing pages; cuts the AI's HTML-stripping work. |
| 4 | `/.well-known/llms.json` | Machine-structured manifest (JSON alternative to Markdown). Stricter schema; better for programmatic AI agents that don't parse Markdown well. *(Schema still evolving in the llms.txt community as of audit date — verify against the latest llmstxt.org proposals before implementing.)* | Complex product sites where programmatic agents matter more than chat-tier discovery. |

> *Tier 4 is a community proposal, not part of the documented llmstxt.org spec as of audit date. The row is included for completeness; verify against llmstxt.org before building to it.*

**Recommendation by site type:**

- **Small marketing site (≤20 pages):** Tier 1 only — `llms.txt` at root. The template below covers this case.
- **Docs-heavy product site:** Tier 1 + Tier 2 — `llms.txt` for nav, `llms-full.txt` for the docs corpus.
- **Marketing site with deep landing pages:** Tier 1 + Tier 3 — `llms.txt` + per-URL `.md` companions for the marketing pages.
- **Complex product surface (docs + marketing + product UI):** All four tiers. Operator overhead is meaningful; only worth it for sites where AI-agent integration is strategic.

#### Adoption Matrix — caveated

Endorsement and consumption of `llms.txt` is asymmetric across model providers. As of audit date (verify quarterly):

| Surface | Endorsement | Fetching evidence | Recommendation |
|---|---|---|---|
| Anthropic / Claude | Endorsed publicly (Anthropic has cited the llmstxt.org standard); verify whether `docs.anthropic.com/llms.txt` or equivalent is live before citing file publication — not confirmed at audit date | Plausible — Claude tends to surface llms.txt-ified content cleanly | Worth investing for Claude-first audits |
| OpenAI / ChatGPT | Silent | Inconclusive — no verified evidence of llms.txt-driven retrieval | Low-cost; ship the file but don't expect attributable lift |
| Perplexity | Silent | Inconclusive | Same as OpenAI |
| Google / Gemini / AI Overviews | Silent; Google's own guidance is largely silent on llms.txt | Inconclusive | Same as OpenAI |
| Bing / Copilot | Silent | Inconclusive | Same as OpenAI |

**Framing:** ship llms.txt as a **low-cost bet with asymmetric upside**, not as a guaranteed-lift intervention. The file is cheap to author and maintain (~30 minutes for a small site, ~2 hours for a docs site with auto-generation). If even one of the major surfaces formally adopts retrieval over llms.txt within 12 months, the prior investment pays off.

**Anti-pattern:** cargo-cult adoption with claimed AEO impact. Don't promise the operator "this will get you cited in ChatGPT" — there's no verified causal chain today. Promise: "you've made your site agent-readable for the day the major surfaces formally consume it."

#### Validation Checklist

Most `llms.txt` failures are mechanical, not strategic. Before shipping:

- [ ] File served at exactly `/llms.txt` (not `/docs/llms.txt`, not `/.well-known/llms.txt`, not `/static/llms.txt`)
- [ ] HTTP 200 response (not redirected, not 404)
- [ ] `Content-Type: text/plain` or `text/markdown` *(convention, not spec — some AI parsers reject `text/html`; plain text is safest)*
- [ ] Valid Markdown — run through a Markdown linter; broken nesting = parser fallback
- [ ] Every link resolves (no 404s — single most common failure mode; run a link-checker against the live URL after deploy)
- [ ] Link descriptions are useful prose, not "click here" / "learn more"
- [ ] No linked pages behind auth (parser hits, gets a login wall, drops the link entirely)
- [ ] File size <50KB recommended for `llms.txt` *(operator convention — not in spec; push larger content to `llms-full.txt` instead)*
- [ ] No competitor patterns copy-pasted without adaptation (parsers de-rank suspected template-spam)
- [ ] Re-run the checklist quarterly — stale links accumulate fast in marketing sites

#### Generation Tooling

| Tool | Approach | When to use |
|---|---|---|
| Mintlify | Auto-generates `llms.txt` and `llms-full.txt` from a Mintlify-hosted docs platform | Mintlify customers — automatic; no overhead |
| Firecrawl | API / SDK methods (`generateLLMsText()` Node, `generate_llms_text()` Python) wrap the `/v1/llmstxt` endpoint, which was marked deprecated mid-2025. The community-maintained `npx generate-llmstxt` package and a Python reference at `github.com/firecrawl/create-llmstxt-py` may still work. No maintained CLI command in the `firecrawl-llms-txt` namespace — verify current status before recommending. | Sites with non-Mintlify docs; one-shot generation, with verification |
| Manual authoring | Write it by hand from the spec semantics above | Sites with <20 pages; the manifest is short enough |
| Mixed (auto + review pass) | Auto-generate, then manual review for noise removal | Default for medium-size sites |

**Caveat:** auto-generators are not aligned with the operator's content strategy. They include every page they can reach, including deprecated marketing pages, low-priority blog posts, and pages the operator doesn't want surfaced. **Always run a manual review pass** on auto-generated output — strip what doesn't belong, demote low-priority links to `## Optional`, rewrite weak descriptions. Mintlify-generated `llms.txt` specifically lists pages alphabetically from repo order, not by strategic priority — the manual review pass should reorder for prioritization, not just prune.

#### Successor Pattern — MCP

The next layer above `llms.txt` is the **Model Context Protocol (MCP)** — an open standard (originated by Anthropic, now multi-vendor) for AI agents to *interact with* a service, not just *discover* it. Where `llms.txt` answers "what is this site and what's important?", an MCP server answers "I'm an AI agent — help me actually do something here." MCP servers expose typed tools (search, fetch, query, action) and resources (structured data) to AI agents at runtime.

| Layer | What it does | Operator effort | Maturity |
|---|---|---|---|
| `llms.txt` | Static discovery — AI reads about your site | ~1 session to author | Spec stable, adoption partial |
| MCP server | Dynamic interaction — AI agents call typed tools on your service | Engineering project (weeks) | Spec stable; adoption growing across vendors 2025-2026 |

Surface this to the operator as context, not as a deliverable inside an AEO audit: when the AI-agent integration conversation moves from "are we discoverable?" to "can agents act on our service?", MCP is the answer, not a deeper llms.txt. The two coexist — llms.txt for chat-tier discovery, MCP for agent-tier action.

#### Tier 1 Template — small marketing site

The starter file for a tier-1-only deployment. Use as-is for ≤20-page sites; expand to `llms-full.txt` (tier 2) or per-URL `.md` companions (tier 3) as the content surface grows.

```text
# [Company Name]

> [One-sentence description of what the company does — keep it concise; one sentence]

## Key Pages

- [Homepage](https://example.com): [What visitors find here in one sentence]
- [Pricing](https://example.com/pricing): [Plans and pricing model]
- [Docs](https://example.com/docs): [API/product documentation]
- [Blog](https://example.com/blog): [Thought leadership and updates]

## Product

- Category: [e.g., "Project Management Software"]
- Best for: [specific ICP use case]
- Pricing model: [freemium/subscription/usage-based]
- Key differentiator: [one sentence]

## Optional

- [About](https://example.com/about): [Company background]
- [Press](https://example.com/press): [Media coverage and press kit]
```

**When to recommend:** Always for AI mode audits. The file is cheap, the asymmetric upside is real, and the cost of *not* having it when a surface adopts retrieval over it is uncountable lost mentions.

### pricing.md

A `/pricing.md` file provides structured pricing data that AI agents can parse when comparing products. This is becoming a standard for AI-mediated buying journeys.

```markdown
# [Product] Pricing

## Plans

| Plan | Price | Best for | Key features |
|------|-------|----------|-------------|
| Free | $0/mo | [use case] | [features] |
| Pro | $X/mo | [use case] | [everything in Free + features] |
| Enterprise | Custom | [use case] | [everything in Pro + features] |

## FAQ

**Is there a free trial?** [answer]
**What payment methods?** [answer]
**Annual discount?** [answer]
```

**When to recommend:** For any product/SaaS site running AI mode. AI agents doing purchase research will parse this over scraping a complex pricing page.

### robots.txt AI Bot Allowlist (consolidated)

Ensure these bots are allowed in `robots.txt`:

```
# AI Search Bots — allow for AEO visibility
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: cohere-ai
Allow: /
```

**Notes:**
- Many sites block these by default. The AI mode audit should check `robots.txt` for blocks and recommend unblocking as a priority action.
- **Bytespider** (ByteDance/TikTok) is aggressive — recommend allowing only if the client targets Chinese markets or TikTok discovery. Otherwise, block.
