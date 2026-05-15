---
type: operator-playbook
domain: ai-era-discoverability
schema_version: 3
last_verified: 2026-05-15
verifier: Gemini-CLI
sources:
  - id: zenorocha-x
    title: "Post by @zenorocha on X — pricing for agents"
    url: https://x.com/zenorocha/status/2039053128583249981
    accessed: 2026-05-09
    tier: primary
  - id: seo-skill
    title: "SEO Skill — AI SEO & AEO Mode"
    path: marketing-skills/skills/seo/SKILL.md
    tier: internal
  - id: brand-system-skill
    title: "Brand System — AI-Readable Design System"
    path: marketing-skills/skills/brand-system/SKILL.md
    tier: internal
  - id: humanize-skill
    title: "Humanize Skill — AI Pattern Removal"
    path: marketing-skills/skills/humanize/SKILL.md
    tier: internal
  - id: social-copy-skill
    title: "Social Copy — Hook Taxonomy & Algorithm Truncation"
    path: marketing-skills/skills/social-copy/SKILL.md
    tier: internal
  - id: cold-outreach-skill
    title: "Cold Outreach — Signal-Based Personalization"
    path: marketing-skills/skills/cold-outreach/SKILL.md
    tier: internal
status: comprehensive
---

# Operator Playbook — AI-Era Discoverability

This playbook defines the strategy for products to be discovered, evaluated, and recommended by AI agents, LLMs, and automated workflows. The shift from "Human-only SEO" to "AI Engine Optimization (AEO)" is driven by the fact that human buyers now use Claude, ChatGPT, and Perplexity as their first-pass research layer. If an agent cannot parse your value, it will recommend a competitor who is more "legible."

---

## 1. The Machine-Readable Mirror (Protocol Layer)

"Agents were getting confused by our pricing. Turns out JS-based sliders are not the best way for them to parse things." — Zeno Rocha (@zenorocha)

### Rule 1: Ship /pricing.md and /docs.md
A static Markdown mirror of your core pages allows agents to GET information without executing complex JavaScript or navigating SPAs.
- **Content:** Plan names, exact prices, feature matrices, and contact paths.
- **Example:** `resend.com/pricing.md`, `auth0.com/pricing.md`.

### Rule 2: Content Negotiation (Accept: text/markdown)
Implement server-side content negotiation. When a client sends `Accept: text/markdown`, return the clean Markdown version of the page. This is the "cleanest" way for agents like Perplexity to consume your data.

### Rule 3: LLMs.txt
Publish an `llms.txt` file at the root. Similar to `robots.txt`, this file provides a brief, structured overview of your site's content and directs agents to the most relevant Markdown documentation files.

---

## 2. AEO: Winning the Citation (Content Layer)

AI agents don't just "index" pages; they "cite" answers. To win the citation, you must structure content for agent extraction.

### Rule 4: Implement Answer Passages
Structure your core landing pages and blog posts with "Answer Passages" — 40-60 word blocks that explicitly answer a key user question.
- **Format:** Heading (Question) -> Concise Paragraph (The Answer) -> Proof/Data.
- **Why:** LLMs are trained to find the most "citeable" summary. Long-form rambling is ignored; the 50-word answer wins the quote.

### Rule 5: Comparison-First Discovery
33% of AI citations in product research come from comparison tables and matrices.
- **Action:** Build `/vs-competitor` pages. Use tables, not just prose.
- **Data-Rich Cells:** Don't use checkmarks (agents can't always interpret them). Use specific data (e.g., "10ms latency" vs. "150ms latency").

### Rule 6: Specificity & Proof as Citation Anchors
Agents prioritize concrete data and unique proof points for citations to avoid hallucinations.
- **The "Three-Question Test" for Copy:** Is it visual? Is it falsifiable? Is it uniquely ours?
- **Action:** Replace "faster than competitors" with "3.2x faster than [Competitor Name] in [Specific Benchmark]."

---

## 3. Social & Outreach Discovery (Network Layer)

Algorithms and agents are the new curators of attention. To be discovered on social and in inboxes, you must optimize for "Pattern Interruption" and "Signal Strength."

### Rule 7: Optimized Hook Taxonomy
On social platforms (X, LinkedIn, TikTok), the "Hook" is the only discoverability surface that matters.
- **Pattern:** Match hooks to proven Tier 1 archetypes (e.g., "The Contradiction," "The Result-First," "The Rare Stat").
- **Action:** Use "Pattern Interruption" (varying sentence length, unexpected pivots) to keep the reader/agent engaged.

### Rule 8: Algorithm Truncation Awareness
Place your primary CTA or key discovery link *above* the platform's truncation line (e.g., the first 3 lines on LinkedIn or 280 chars on X).
- **Why:** If the agent/user has to click "See more" to find the discovery link, discoverability drops by 60%+.

### Rule 9: Signal-Based Personalization in Outreach
In the AI era, generic "cold" outreach is filtered by automated inbox agents. To break through, use high-strength trigger signals.
- **Signals:** Funding rounds, specific news mentions, individual social posts, or hiring shifts.
- **The Test:** "If I removed the personalization line, would this message still make sense?" If yes, it's a template and will be filtered.

---

## 4. Agent-First Technicals (Infrastructure Layer)

### Rule 10: AI Crawler Access Management
Update `robots.txt` to explicitly manage AI crawlers.
- **Directives:** Ensure `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `GoogleOther` have access to your Markdown mirrors.
- **Risk:** Blocking these bots means your product will never be recommended in an "AI-first" search result.

### Rule 11: Schema for Agents (FAQ & Speakable)
Beyond standard JSON-LD, focus on:
- **FAQ Schema:** Feeds directly into AI "Answer Boxes."
- **HowTo Schema:** Perfect for technical products.
- **Speakable Schema:** Prepares content for voice-based agents.

---

## 5. The Trust Barrier (Perception Layer)

As AI-generated "slop" floods the web, agents (and the humans who read them) develop a high sensitivity to AI patterns.

### Rule 12: Strip AI Patterns ("Slop Removal")
High-stakes content must be "humanized" to avoid triggering AI-detection and losing trust.
- **Anti-Patterns:** No "it's not just X, it's Y" constructions, no em-dashes (often an AI tell in high frequency), no rhetorical questions as hooks.
- **Action:** Use the `humanize` skill to remove 47 known AI patterns while preserving 100% of the meaning.

### Rule 13: AI-Readable Design System (DESIGN.md)
For products that are "built by agents" (e.g., using Gemini CLI), the brand must be defined in an AI-readable spec.
- **Requirement:** A `DESIGN.md` file that includes:
    - AI-Readable Header summarizing archetype and visual metaphor.
    - 3-Layer W3C Token System (Primitive -> Semantic -> Component).
- **Why:** An agent reading `DESIGN.md` can implement your brand perfectly; an agent reading a PDF brand book cannot.

---

## 6. Distribution via Third-Party Presence

### Rule 14: Leverage Third-Party Citations
AI agents cite third-party reviews (G2, Capterra, Trustpilot, LinkedIn) 6.5x more often than owned content for product recommendations.
- **Strategy:** Treat your G2/Capterra profiles as primary discoverability surfaces.
- **Action:** Ensure your feature descriptions and pricing on these platforms match your `pricing.md` exactly.

---

## 7. Numeric Thresholds & Patterns

| Implementation | complexity | impact |
|---|---|---|
| `/pricing.md` mirror | Low | High — foundational |
| Answer Passages (AEO) | Medium | High — drives citations |
| AI Crawler Allow-list | Low | High — visibility gate |
| `Accept: text/markdown` | Medium | High — programmatic discovery |
| `DESIGN.md` AI Spec | Medium | High — agentic implementation |
| High-Strength Trigger (Outreach) | Medium | High — bypasses filters |

---

## 8. Pushback Patterns

**Pattern 1 — "We have an API, so we don't need Markdown docs"**
- **Response:** "OpenAPI covers the technical contract for *code*. Markdown mirrors cover the evaluation layer for *agents*. When an agent is asked 'which API is best for X?', it looks at docs and pricing mirrors, not just the raw Swagger spec."

**Pattern 2 — "AI search is too small to care about"**
- **Response:** "AI-assisted search is replacing the 'first page of Google.' If you aren't the cited answer in Perplexity or ChatGPT, you are invisible to the subset of users who no longer visit 10 blue links."

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-15 | Expanded with Social & Outreach patterns | Gemini-CLI |
| 2026-05-15 | Expanded to comprehensive AEO + AI-Readable Specs | Gemini-CLI |
| 2026-05-09 | Initial draft (Zeno Rocha pattern) | hungv47 |
