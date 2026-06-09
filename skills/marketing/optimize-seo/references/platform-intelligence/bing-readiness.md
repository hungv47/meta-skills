# Bing Readiness — the AI-search control surface

Bing is the search backend that powers a large share of AI-answer products, so Bing
indexing and submission are the **control surface** for AI-citation work — not a
Microsoft-only afterthought. This reference gates Route B (AI SEO / AEO): before
recommending AI-citation tactics, confirm the content is actually reachable in the index
the AI products query.

> The fact most SEO practitioners miss: several major AI search products do not use Google
> as their search backend. **ChatGPT Search, Perplexity, and Microsoft Copilot retrieve
> from Bing.** Google AI Overview and Gemini use Google's index; Grok uses its own web
> search. If a site is optimized for Google only, it can be effectively invisible to the
> Bing-backed AI products — three of the major surfaces — no matter how strong its Google
> rankings are.

## Which backend each AI surface uses

| AI surface | Search backend | Implication |
|---|---|---|
| Google AI Overview | Google index | Rank in Google; citation-readiness (see `geo-citation-readiness-checklist.md`) |
| Gemini (standalone) | Google index | Same as Google organic + GEO |
| ChatGPT Search | **Bing** | Bing indexing/submission is the lever |
| Perplexity | **Bing** + its own index | Bing indexing + clear extractable answers |
| Microsoft Copilot | **Bing** | Bing indexing is the lever |
| Grok | Its own web search | Rank in general web results; not Bing- or Google-specific |

API-mode models with no live retrieval (e.g. a base model answering from training data
only) cite by brand presence in the training corpus, not by current indexing — that is the
slower brand-building path, separate from this surface.

## Why Bing gates AI-citation work

If a page is not in Bing's index, the Bing-backed AI products cannot retrieve or cite it —
so AI-citation recommendations for those surfaces are wasted effort until Bing indexing is
confirmed. This is the AI-search analogue of Critical Gate 2: do not optimize for citations
on a page the answer engine cannot reach. Bing query stats also serve as a free **proxy
signal** for ChatGPT/Perplexity/Copilot visibility — movement there foreshadows movement in
those products.

## The readiness checklist

Confirm all of these before recommending Bing-backed AI-citation tactics in Route B:

1. **Site verified** in Bing Webmaster Tools.
2. **Sitemap submitted** to Bing.
3. **IndexNow enabled** so Bing (and Yandex) are notified instantly when content is
   published or updated — closing the lag between publish and AI-retrievability.
4. **High-priority URLs submitted** individually to Bing on publish.
5. **Bing query stats monitored** as a proxy for Bing-backed AI-product visibility.

A page that fails 1-3 is not yet a candidate for ChatGPT/Perplexity/Copilot citation
recommendations — fix indexing first, then optimize for extraction.

## IndexNow

IndexNow is a protocol for instantly notifying participating search engines (Bing, Yandex)
that a URL was added, updated, or deleted, instead of waiting for the next crawl. For
AI search it matters because the gap between "published" and "in Bing's index" is the gap
between "live" and "citable by the Bing-backed AI products." Enabling IndexNow shortens that
gap. After publishing or materially updating a high-priority page, fire an IndexNow
notification and submit the URL to Bing directly.

## How this feeds Route B

Route B sequence for any Bing-backed surface:

1. **Crawl/index gate (Google side)** — the existing technical-audit prerequisite
   (Critical Gate 2 / anti-pattern #13): the page must be crawlable and indexable.
2. **Bing readiness gate (this file)** — verify the 5-item checklist so the page is in the
   index the Bing-backed AI products query.
3. **Citation-readiness** — apply `geo-citation-readiness-checklist.md` so that, once
   retrieved, the page yields an extractable, quotable unit.

Only after 1 and 2 hold do AI-citation recommendations for ChatGPT/Perplexity/Copilot carry
weight. For Google AI Overview and Gemini, step 2 is the Google-side equivalent (already
covered by the technical audit) plus citation-readiness.

**Source grounding:** the backend mapping, the Bing-as-control-surface insight, the
readiness steps, and IndexNow's role derive from the searchstack AEO/GEO reference. Verify
current backend partnerships before over-claiming — AI-search plumbing shifts (Critical
Gate 3: source recency).
