---
type: operator-playbook
domain: ai-era-discoverability
schema_version: 1
last_verified: 2026-05-09
verifier: hungv47
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: draft
---

# Operator Playbook — AI-Era Discoverability

Loads when a user is building a product that AI agents, LLMs, or automated workflows might discover, reference, or purchase. Zeno Rocha (practitioner source), founder of Resend, identified a concrete failure mode: standard web-rendered pricing pages (with JS-based sliders, dynamic content) are unreadable by AI agents. His fix: ship `/pricing.md` and `/docs.md` as static Markdown mirrors, with HTTP content negotiation (`Accept: text/markdown`) so agents and LLMs can parse cleanly. This is not a hypothetical — Resend, Auth0, and WorkOS had all shipped machine-readable pricing pages by March 2026.

Discover should use this frame to challenge web-only documentation strategies when the product's buyers, evaluators, or users include AI agents.

---

## 1. Core Frame

"Agents were getting confused by our pricing. Turns out JS-based sliders are not the best way for them to parse things. So today I'm shipping resend.com/pricing.md. Plus, content negotiation (Accept: text/markdown). Pricing is now machine-readable for AI agents and LLMs." [pattern-derived]

The broader post notes that the pattern is gaining traction across developer-facing products: Auth0, Resend, and WorkOS all published `.md` equivalents for pricing. The thesis: **if your product's documentation or pricing exists only as rendered HTML with JavaScript-driven UI, an AI agent cannot reliably extract the information needed to recommend, integrate, or purchase your product.**

**This frame fires when:** user is building a developer tool, API product, or B2B SaaS; mentions documentation, pricing pages, or discoverability; or is thinking about how AI-native buyers will evaluate their product. Also fires when user mentions "LLM-friendly" or "agent-first" product design.

---

## 2. Opinionated Rules

**Rule 1: Ship /pricing.md alongside /pricing.**

The problem Zeno diagnosed: "JS-based sliders are not the best way for [agents] to parse things." [pattern-derived]

A Markdown file at `/pricing.md` serves as a static, parseable mirror of the pricing page. It should contain: plan names, prices, features per plan, billing frequency, and a contact path for enterprise. No JavaScript required to read it.

Counter-case: Consumer apps where the pricing decision is made by a human user, not an AI agent. If your product is not used in automated workflows or evaluated by AI-assisted research, the urgency is lower — but not zero, since AI-assisted research by human buyers (asking Claude/GPT before purchasing) is now standard.

---

**Rule 2: Ship /docs.md or equivalent machine-readable documentation.**

Same pattern applied to documentation. If your docs require JavaScript to render (SPAs, interactive code samples, drawer navigation), an agent following your integration path will fail at the documentation step.

Counter-case: Large documentation sites (10K+ pages) where a single `/docs.md` file would be unmanageably large. In that case, per-section `.md` files or an OpenAPI spec (for APIs) serve the same function.

---

**Rule 3: Implement content negotiation (Accept: text/markdown).**

Returning Markdown when the `Accept: text/markdown` header is present allows programmatic tools to request the clean version without hardcoding the `/pricing.md` URL. This is the protocol-level solution; `/pricing.md` as a static file is the pragmatic shortcut.

Counter-case: Products serving exclusively human users who don't interact via HTTP clients. For API products and developer tools, content negotiation is a first-class concern.

---

**Rule 4: Treat machine-readability as a distribution channel.**

The implicit thesis of Zeno's post: if an AI agent can parse your pricing and docs, it can recommend your product when the right question is asked. If it can't parse your pricing, it will recommend a competitor whose pricing is legible.

"The idea of pricing for agents is getting traction." [pattern-derived] The proof: Auth0 (`auth0.com/pricing.md`), Resend (`resend.com/pricing.md`), WorkOS (`workos.com/pricing.md`) all shipped this pattern.

Counter-case: Products in categories where AI agents are not in the research/purchase path. Consumer apps sold directly in the App Store, products sold via word-of-mouth, or products with a sales-only motion (no self-serve evaluation) have lower urgency.

---

## 3. Numeric Thresholds & Patterns

| Implementation | Complexity | Impact |
|---|---|---|
| `/pricing.md` static file | Low (hours) | High — makes pricing legible to any agent or LLM |
| `/docs.md` static mirror | Medium (depends on doc size) | High for developer tools |
| `Accept: text/markdown` content negotiation | Medium (server config) | Enables programmatic discovery without hardcoded URLs |
| OpenAPI spec | internal | Replaces `/docs.md` for REST API products |
| Per-page `.md` mirrors | Medium | Scales better than monolithic `/docs.md` for large sites |

Real-world adopters as of March 2026: Auth0, Resend, WorkOS. [pattern-derived]

---

## 4. Pushback Patterns

**Pattern 1 — "Our docs site is built on [modern SPA framework]"**

- **Trigger:** User describes a documentation site that is JavaScript-rendered, requires interaction to navigate, or uses dynamic sliders/toggles for pricing.
- **BAD response:** "That's fine — most users can read it."
- **GOOD response:** "Zeno Rocha (Resend founder) diagnosed this specifically: 'Agents were getting confused by our pricing. Turns out JS-based sliders are not the best way for them to parse things.' The fix is low-effort — ship a `/pricing.md` static mirror that any agent or LLM can GET without executing JavaScript. Auth0, Resend, and WorkOS all shipped this by early 2026. What does your current pricing page look like to a system that can't execute JavaScript?"
- **Pattern basis:** internal research synthesis.

---

**Pattern 2 — "We don't need to worry about AI agents — our buyers are humans"**

- **Trigger:** User dismisses machine-readable docs as irrelevant because their sales motion is human-to-human.
- **BAD response:** "Fair point — focus on what your human buyers need."
- **GOOD response:** "Human buyers increasingly use Claude/GPT/Perplexity as a first-pass research tool before contacting sales. If your pricing or docs aren't parseable by those tools, you won't appear in the answer when someone asks 'what's the best tool for X?' Machine-readability is now part of SEO equivalent for AI-era discovery — not just for agent buyers, but for human buyers using agents to research."
- **Pattern basis:** internal research synthesis.

---

**Pattern 3 — "Our pricing is too complex for a Markdown file"**

- **Trigger:** User argues that pricing complexity makes a static Markdown mirror impractical.
- **BAD response:** "Complex pricing is hard to simplify — maybe link to the pricing page from docs."
- **GOOD response:** "Complex pricing is exactly the situation where a machine-readable mirror matters most. If an agent can't parse your pricing, it will either approximate wrong or not recommend you. A `/pricing.md` doesn't need to be a perfect replica — it needs to contain: plan names, prices, key feature differences, and a path to contact. Even a simplified version is better than an unreadable JavaScript-rendered slider. Which aspects of your pricing are genuinely impossible to represent in Markdown?"
- **Pattern basis:** internal research synthesis.

---

**Pattern 4 — "We have an API — we'll just publish an OpenAPI spec"**

- **Trigger:** User plans to rely on OpenAPI/Swagger for machine-readable documentation for an API product.
- **BAD response:** "OpenAPI is perfect — that covers discoverability."
- **GOOD response:** "OpenAPI covers the API contract. It doesn't cover pricing, use-case documentation, or getting-started guides — which is what an agent needs when deciding whether to recommend or integrate your product. Both layers matter: OpenAPI for the technical spec, `/pricing.md` and `/docs.md` mirrors for the discovery and evaluation layer."
- **Pattern basis:** internal research synthesis.

---

## 5. Anti-Patterns

**Anti-pattern 1: JavaScript-only pricing.** Serving pricing exclusively as a JS-rendered page with dynamic sliders, toggles, or calculators that require script execution to show accurate prices. Detection: `curl https://yoursite.com/pricing` returns HTML without readable price tables. [pattern-derived]

**Anti-pattern 2: SPA documentation without static fallback.** Docs built as a single-page application where all content is injected by JavaScript. Detection: `curl https://docs.yoursite.com/getting-started` returns an empty shell HTML. [zenorocha-x — pattern derivation]

**Anti-pattern 3: No machine-readable pricing in a developer-facing product.** Building an API, SDK, or developer tool without a static pricing endpoint. Detection: user can't describe what an AI agent would see when it GETs their pricing URL. [pattern-derived]

**Anti-pattern 4: Conflating "AI discoverability" with SEO only.** Optimizing for search engine indexing (robots.txt, sitemaps) without considering LLM/agent parsing, which uses different access patterns. Detection: user describes their discoverability strategy as purely SEO without addressing `text/markdown` content or static Markdown mirrors. [pattern-derived]

---

## 6. Open Questions / Known Unknowns

- This source is thin. Zeno Rocha's original post is 2 tweets + 3 external URL examples. There is no data on whether shipping `/pricing.md` measurably improves AI-assisted discovery or conversion. The claim is directionally sound but empirically unverified.
- The content negotiation approach (`Accept: text/markdown`) is technically correct but not a web standard. Whether major AI agents (Claude, GPT, Perplexity) consistently send this header vs. parsing raw HTML is unknown. The fallback of a static `/pricing.md` URL sidesteps this uncertainty.
- The "pricing for agents" pattern is documented as gaining traction as of March 2026 among developer-facing SaaS. Adoption timeline and whether this becomes a standard expectation (like `robots.txt`) is unknown.
- Scope of docs that need Markdown mirrors is not defined. For products with large doc sites, a selective approach (getting-started, pricing, API reference) may be more practical than full site mirroring. No guidance on prioritization in the source.
- Consumer apps (mobile, App Store distributed) are not addressed. The playbook is implicitly scoped to web-accessible products with pricing pages and documentation sites.

---

## 7. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-09 | Initial draft | hungv47 |
