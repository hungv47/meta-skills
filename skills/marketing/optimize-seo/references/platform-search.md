---
name: platform-search
type: domain-catalog
load-class: DOMAIN
loaded-by: ai-presence-agent, programmatic-template-agent, comparison-page-agent, aso-keyword-agent, aso-listing-agent
canonical-source: references/platform-intelligence/ (repo root)
---

# Platform-Specific Search

Platform search is not Google search. TikTok search, YouTube search, LinkedIn search, App Store search, and the AI-SERP citation surfaces (ChatGPT / Perplexity / Google AI Overviews) each have their own ranking signals, format constraints, and bot policies. This catalog maps `optimize-seo` agents to the relevant sections of the top-level `references/platform-intelligence/` catalog so platform-aware recommendations are grounded in real signals, not generic SEO theory.

The canonical platform catalog is at top-level `references/platform-intelligence/{tiktok,reels,shorts,linkedin,x,youtube}.md`. The mirror at `references/_shared/platform-intelligence/` is what agents read at dispatch.

## Agent-to-section map

### `ai-presence-agent` (AI SEO / AEO mode)

Reads §3 Algorithm Signals + §4 Anti-Patterns from these platforms:

- **`_shared/platform-intelligence/linkedin.md` §3** — LinkedIn's algorithm rewards in-app dwell time and re-share velocity. AI engines (ChatGPT, Perplexity) cite LinkedIn posts when the author's headline maps to a domain-expert signal. Recommend: long-form text posts (1300+ chars) with concrete numbers + named cohorts in the first 120 chars.
- **`_shared/platform-intelligence/x.md` §3** — X's For You ranking weights early-engagement velocity and reply quality. AI engines cite X posts more often when threads have 3+ replies from accounts with verified-expert markers. §4 Anti-Patterns lists explicit bait (vague hooks, no-payoff cliffhangers) that AI engines deprioritize as low-citation-value.

**Output framing for ai-presence-agent:** "Citation-worthy platform-native content" recommendations cite the platform's §3 Algorithm Signals and §4 Anti-Patterns explicitly — not just "post on LinkedIn."

### `programmatic-template-agent` (Programmatic SEO mode)

Reads §2 Format Constraints + §3 Algorithm Signals from:

- **`_shared/platform-intelligence/youtube.md` §2 + §3** — YouTube descriptions allow 5000 chars with the first 157 visible above-fold. Tags are deprioritized post-2022 algorithm shift; description keyword density + closed-caption transcript text drive search ranking. For programmatic video pages (one per template variant), the description template must front-load the keyword in the visible window and include a CC transcript snippet.
- **`_shared/platform-intelligence/tiktok.md` §2** — TikTok search rewards on-screen text + caption keyword match; programmatic templates that auto-generate captions need the target keyword in both the on-screen text track AND the caption body, not just one.

**Output framing for programmatic-template-agent:** "Per-template platform-channel addendum" — when a programmatic page targets a platform-native distribution surface, the template includes the platform's §2 format spec as a hard constraint.

### `comparison-page-agent` (Competitor Pages mode)

Reads §3 Algorithm Signals from:

- **`_shared/platform-intelligence/linkedin.md` §3** — LinkedIn comparison content (carousel docs, "X vs Y" text posts) gets distribution when the author has a domain expertise signal AND the post format matches the algorithm's preferred dwell-time targets. For comparison pages with a LinkedIn distribution plan, recommend: 8-12 slide carousel (not text post) with explicit side-by-side framing on slides 2-4.
- **`_shared/platform-intelligence/youtube.md` §3** — Comparison videos rank for "X vs Y" queries when title front-loads the comparison + chapter markers segment the matrix. Recommend chapter-marker template aligned with comparison-page section structure.

**Output framing for comparison-page-agent:** Cross-surface recommendation — if comparison page is anchored on owned site, distribution sidecars on LinkedIn + YouTube follow the platform §3 spec.

### `aso-keyword-agent` + `aso-listing-agent` (ASO mode)

Read §1 Hook Taxonomy + §2 Format Constraints from:

- **`_shared/platform-intelligence/tiktok.md` §1 + §2** — App preview videos on the App Store / Play Store benefit from TikTok-style hook archetypes (Callout Cliffhanger, POV, Pattern Interrupt) in the first 3 seconds. §2 Format Constraints inform the 30-second preview length budget and on-screen text rules.
- **`_shared/platform-intelligence/reels.md` §1** — Reels-style preview videos for App Store listings translate well when the hook is a Tier 1 archetype. Map directly: an App Store preview video hook = a Reels Tier 1 hook with a 30-second container.

**Output framing for aso-keyword-agent + aso-listing-agent:** App Store screenshot copy and preview-video hooks cite platform-intelligence Tier 1 archetypes when proposing the listing's first 3 seconds + screenshot 1.

## What this catalog does NOT cover

- Google search ranking signals — those live in `references/ai-seo.md` (AI SEO surfaces) and `references/technical-audit.md` (foundations).
- Schema markup — `references/schema-reference.md`.
- App Store algorithm internals (keyword indexing, conversion rate, install velocity) — `references/aso.md` is the canonical ASO playbook.
- Platform-native production briefs (which `brief-shortform` produces) — this skill consumes the same platform-intelligence catalog from a different angle (search visibility, not creative direction).

## When to read this catalog

Each named agent above reads the relevant `_shared/platform-intelligence/[platform].md` section directly when its mode is active. The orchestrator does not need to load all sections — pre-dispatch determines mode, mode determines which agents fire, and each agent loads only its required sections.

For modes that don't touch platform-native search surfaces (Technical Audit, Foundations), platform-search.md is not loaded.
