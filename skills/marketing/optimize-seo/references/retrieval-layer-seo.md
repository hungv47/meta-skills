---
last_verified: 2026-06-13
verifier: audit-wave2
churn: high
---

# Retrieval-Layer SEO

> Load when AI-SEO mode (Route B) or Full mode (Route E) is active. This reference upgrades the AI-SEO mode from "produce content AI might cite" to "produce **extraction units** AI retrieval can actually lift." Pair with `references/ai-seo.md` (platform-specific tactics, monitoring) and `references/_shared/evidence-classes.md` (every retrieval claim is tagged).

The AI surfaces (ChatGPT search runs, Perplexity, Claude with web search, Gemini, AI Overviews, Bing Copilot) don't read a page top-to-bottom. They retrieve a *chunk* — a heading + first paragraph, a table cell, a list item, a Q&A pair — score it for answer-fit, and either lift it verbatim, paraphrase it, or skip it. Optimizing for retrieval ≠ optimizing for ranking. Both matter; this reference covers the retrieval half.

---

## The retrieval-layer framework

Six properties make a content unit retrieval-grade. A finding in AI-SEO mode names which property is missing on which page; a recommendation specifies the rewrite.

### 1. Extractable answer chunks under specific headings

The unit AI retrieval actually lifts is *heading + immediately-following paragraph*. A page where the first paragraph after every H2 is throat-clearing ("In this post we'll discuss...") is invisible at the retrieval layer even if the page ranks.

**Rule:** every H2 on a page targeting a retrievable query is a question the audience asks (matching their phrasing, not your taxonomy), and the first paragraph below it answers in 40-60 words, leading with the answer.

| Topic complexity | Answer block target |
|---|---|
| Simple definition ("what is X?") | 20-40 words |
| Standard explainer / how-to step | 40-60 words |
| Technical / multi-part answer | 60-100 words with sub-bullets after the lead sentence |

**Detection check:** highlight the first sentence after each H2. If it doesn't independently answer the H2's question, the chunk is not retrieval-grade.

### 2. Direct answer blocks (40-60 words) where appropriate

The 40-60 word band is the sweet spot for Perplexity-style retrieval, Claude in-context citation, and Google featured-snippet pull. Shorter blocks risk losing context; longer blocks get truncated mid-thought and skipped.

Direct answer blocks belong at:

- The first H2 of the page (the page-level question)
- Each FAQ entry
- The top of comparison sections ("which is better?")
- The top of how-to steps ("what does step N accomplish?")

A direct answer block includes one of: a specific number, a specific date, a specific named entity, or a specific cited fact. Generic answers ("it depends on your needs") fail the property even if the word count is right.

### 3. Primary-source citations and original data

AI surfaces reward content that itself cites sources, and they distinguish primary sources (the entity that produced the data) from aggregators (the entity that re-reported it).

**Source-class weighting (operator heuristic, supported by the Princeton GEO/AEO study's +40% "uses sources" lift):**

| Source class | Examples | Retrieval weight |
|---|---|---|
| **Primary / source-of-record** | The originating study, the platform's own announcement, the company's filed earnings, the regulator's published rule, your own first-party research | Highest. AI surfaces will often cite the primary even when you're the page they found. |
| **Expert publication** | Peer-reviewed papers, industry-recognized research firms (Forrester, Gartner, IDC reports), reputable trade journals | High. Cited as authority. |
| **Aggregator / secondary** | A blog post summarizing someone else's research, a roundup article, a news site re-reporting a vendor announcement | Medium. Useful for context, easily de-prioritized in retrieval. |
| **Self-reference without external corroboration** | Your own blog post citing your own pricing page | Lowest. Reads as self-promotion to retrieval scorers; rarely lifted. |

**Application:** for every retrievable claim on the page, cite the primary or expert source by name + URL + date. Replace aggregator-only chains with primary links when reachable. Add at least one source-cited claim per H2 section on AI-SEO-targeted pages.

### 4. Entity corroboration across high-quality third-party sources

The single-page view is incomplete. AI surfaces build entity confidence from *cross-source corroboration* — does the same claim about your brand / product / category appear on G2, Capterra, an industry publication, a reputable independent review, a Wikipedia entry?

Owned-content optimization caps at the ceiling third-party corroboration sets. If only your site says "we're the leading X for Y," the AI weights the claim accordingly. If G2 + Capterra + a TechCrunch article + a Reddit thread all corroborate, the claim carries.

**The cross-skill seam:** `monitor-aeo`'s `ai-citations` mode produces a cited-domain inventory per query × provider (in the snapshot JSON under `cited_domains`). `optimize-seo` consumes that inventory to find which third-party hosts are doing the corroboration today — and which the competitor has that the brand doesn't.

Recommendations in this dimension name *which third-party surface to invest in* and *which claim needs corroboration there*. Generic "build third-party presence" is not enough.

### 5. Crawler access checks

A retrieval-grade chunk on a page the AI crawler can't reach is invisible. Before any retrieval-layer recommendation, `ai-presence-agent` must confirm crawler access for the relevant AI surface:

- `robots.txt` allows the crawler (GPTBot, ClaudeBot, PerplexityBot, GoogleOther, Bingbot, Applebot-Extended, cohere-ai)
- `X-Robots-Tag` HTTP header doesn't override
- No JavaScript-only rendering for the answer block (server-side render at least the heading + first paragraph)
- No auth wall, geo-block, or paywall on the AI-SEO target pages
- Sitemap exposes the target pages and crawler can fetch the sitemap

A retrieval-layer recommendation issued without a crawler-access check is a critic FAIL — it asks the operator to spend hours on content the AI will never read.

### 6. Freshness and contradiction handling

AI surfaces increasingly weight content freshness (visible publish/update date, recent statistics, named recent events). They also penalize internal contradictions — same brand claiming two different things across two pages cuts retrieval confidence.

**Freshness rules:**

- Every retrieval-target page carries a visible *last-updated* date in the body (not just the CMS metadata; the model often reads the rendered text)
- Statistics carry a year and a source ("47% in 2025 per [source]") — naked numbers age out
- Date-sensitive claims ("the current version is X") are reviewed quarterly; stale claims demote the entire page in retrieval

**Contradiction handling:**

- A single canonical answer per question, per brand. If two pages answer the same Q differently, pick one canonical, redirect the other, or rewrite to align.
- Cross-page facts (pricing, integrations, company stats) live in one canonical block reused via include / partial / canonical reference — not retyped per page.
- When the brand position changes (new pricing, new feature, retired product), the audit names every page that still asserts the old position and the rewrite plan.

---

## Audit output schema — per-finding

When ai-structure-agent or ai-presence-agent emits a retrieval-layer finding, the finding includes these fields beyond the standard Issue/Impact/Evidence/Fix/Priority:

| Field | What it captures |
|---|---|
| **Query** | The specific search/chat query the chunk would surface for (e.g., "how does conquis sync notes across devices") — not a generic topic |
| **Target page** | Exact URL of the page that will own the answer chunk |
| **Extraction unit** | What unit to create or fix: "first paragraph under H2 'Sync mechanics'", "FAQ entry titled 'Does Conquis work offline?'", "comparison table row for 'Offline support'" |
| **Source/corroboration gap** | Which source the chunk needs to cite (primary URL + name) AND which third-party surface needs to corroborate the claim (G2, Reddit thread, industry publication) — distinct from owned-page fixes |
| **Exact rewrite location** | `path/to/page.mdx`, H2 anchor, line number when known; or "create new H2 between sections X and Y" when the unit doesn't exist yet |
| **Measurement query** | The exact query to re-test post-fix to confirm citation behavior changed (often the same as Query above, but may be the persona-prefixed variant from `monitor-aeo`'s query-set) |
| **Expected citation behavior** | "Cited verbatim in Perplexity answer" / "Pulled into Google AI Overview reference block" / "Surfaced in ChatGPT search run with verify-resolving URL" — concrete, falsifiable |
| **Evidence class** | One of `public-doc` / `observed-test` / `single-run` / `practitioner-inference` / `hypothesis` per `references/_shared/evidence-classes.md` |

**Critic enforcement (gate addition in `agents/critic-agent.md`):** retrieval-layer findings missing any of Query / Target page / Extraction unit / Measurement query / Expected citation behavior / Evidence class are FAIL; re-dispatch to the originating agent (ai-structure-agent for chunk/schema findings; ai-presence-agent for third-party corroboration findings).

---

## Evidence-class labeling

Every claim a retrieval-layer recommendation makes about provider behavior carries an evidence class. The taxonomy is documented in `references/_shared/evidence-classes.md`; the rules below specialize it for AI-SEO recommendations.

| Claim shape | Required class minimum |
|---|---|
| "Adding X causes Y citation behavior" as a P1 (Immediate) recommendation | `observed-test` from `monitor-aeo` handoff OR a `public-doc` source |
| "Provider P weights Z" as a general strategy direction | `public-doc` if available; `practitioner-inference` allowed when paired with the `observed-test` rows it generalizes from |
| "If we ship X, we expect Y outcome" | `hypothesis` with an explicit measurement plan and re-check window |
| "Vendor V's private prompt does Z" | **Inadmissible.** Vendor system prompts are not publicly verifiable. Reframe as observed retrieval behavior (`observed-test`) or as a `hypothesis` to test. |
| "It's been reported that ChatGPT cites G2 6.5× more than owned content for B2B SaaS" | `practitioner-inference` unless the source is a `public-doc` (vendor statement, peer-reviewed study); industry blog summaries are not `public-doc`. |

A recommendation that depends on a `hypothesis` cell may still ship — but it ships **as a hypothesis with a test plan**, not as a confident prescription. The critic checks: P1 recommendations must not be `hypothesis`-only.

---

## Reading a `monitor-aeo` handoff

When `handoff-optimize-seo.md` arrives from `monitor-aeo`, the retrieval-layer audit treats it as the primary `observed-test` input. The handoff structure (per `monitor-aeo/references/format-conventions.md`):

| Handoff section | optimize-seo use |
|---|---|
| Provider × query citation matrix | Tells you which surfaces already cite (skip; protect) vs miss (target; investigate retrieval gap). Each cell tagged `observed-test` or `single-run` or `unavailable`. |
| Cited-domain inventory per query | Identifies the third-party hosts doing the corroboration work today. Feeds the "source/corroboration gap" field in retrieval-layer findings. |
| Competitor cited-domain share | Per-cell delta — where do competitors get cited and you don't? Drives the third-party investment priority. |
| Strategy Questions | Cells where `monitor-aeo` saw something interpretable but stopped at the measurement boundary. `optimize-seo` answers these as `practitioner-inference` or `hypothesis`. |

The retrieval-layer audit produces recommendations that *act on* the handoff — not duplicate it. If `monitor-aeo` already named the gap, `optimize-seo` names the page, the extraction unit, and the rewrite.

---

## Anti-patterns (retrieval-layer-specific)

The four below extend the SEO-wide list in `references/anti-patterns.md` (entries #14-17). The full anti-pattern reference is the authoritative copy.

### A. Markdown / llms.txt theater without crawlable content quality

Shipping `/llms.txt`, `/llms-full.txt`, per-URL `.md` companions, and the four-tier discovery hierarchy is not a substitute for retrieval-grade content. A site with perfect llms.txt and walls-of-prose body content will not be cited.

**Test:** before recommending llms.txt expansion, verify the underlying pages pass the 6-property retrieval framework. If they don't, fix the content first.

### B. Entity mentions from low-quality sources presented as authority

Adding "as mentioned by [low-traffic blog]" to a page does not corroborate the claim for retrieval — and in some cases demotes the host page by associating it with a low-quality citation chain.

**Test:** every cited corroboration carries a source-class weighting per § 3 above. Aggregator-only chains are flagged for replacement.

### C. Long prose sections that cannot be extracted independently

A 2,000-word essay under one H2 is not retrievable. The first paragraph might pull, but the body has no extraction structure. Subdivide into H3-anchored chunks with their own answer blocks.

**Test:** for each H2 section longer than 400 words, demand at least one H3 sub-anchor with its own 40-60 word answer block, OR convert the section into a list / table / Q&A structure that retrieval can decompose.

### D. AI SEO work before technical crawl/index issues are fixed

Retrieval-layer optimization on a page the crawler can't reach is wasted. AI-SEO mode that begins without confirming Technical Audit gate-pass (per `references/playbook.md` Critical Gate 2) is critic FAIL.

**Test:** ai-presence-agent's crawler access audit must show GREEN for the target page's relevant crawlers before retrieval-layer findings ship. If RED, the audit reports the blocker and recommends Route A (Technical Audit) first.

---

## Cross-references

- `references/ai-seo.md` — platform-specific tactics (Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini), the GEO vs AEO taxonomy, the Princeton optimization-method table, the canonical AI-referrer list, llms.txt spec, monitoring tools. **This file is the strategy/measurement-vocabulary layer; ai-seo.md is the per-platform tactic catalog.**
- `references/_shared/evidence-classes.md` — the shared evidence taxonomy. Every retrieval-layer claim carries a tag from this file.
- `references/live-serp-remediation.md` — the operational loop for taking handoff evidence → page-level edits → verification rescan.
- `references/technical-crawler-checklist.md` — the technical gate every AI-SEO target page must pass before retrieval-layer recommendations are valid.
- `agents/ai-structure-agent.md` — owns retrieval-layer findings about chunkability, answer blocks, schema, source citations on owned pages.
- `agents/ai-presence-agent.md` — owns retrieval-layer findings about crawler access, third-party corroboration, llms.txt, freshness across the cited-domain inventory.
- `agents/critic-agent.md` — enforces the per-finding schema (Query / Target page / Extraction unit / Measurement query / Expected citation behavior / Evidence class) and the evidence-class-by-priority gate.
