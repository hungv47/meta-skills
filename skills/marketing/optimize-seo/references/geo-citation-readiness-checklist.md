# GEO Citation-Readiness Checklist

How content earns citations in **generative answer surfaces** — Google AI Overview
(Gemini), ChatGPT Search, Perplexity, Copilot, Gemini, Grok — as distinct from ranking
in the organic SERP.

> **Why this is a separate score.** The organic on-page score asks "will this page rank?"
> The citation-readiness score asks "once a page is in the retrieval set, will the model
> *extract a quotable unit* from it?" A page can rank #3 organically and never get cited
> because the answer is buried in a 3,000-word essay. GEO rewards extractable structure,
> not length. Run this checklist *after* the page can be crawled and ranks in the relevant
> index (Google for AI Overview/Gemini; Bing for ChatGPT/Perplexity/Copilot — see
> `platform-intelligence/bing-readiness.md`).

## How retrieved-citation models choose what to quote

Retrieval-grounded surfaces (AI Overview, Perplexity, ChatGPT Search, Copilot, Gemini,
Grok) search an index in real time, pull relevant pages, then generate an answer citing
the pages they could extract a clean unit from. They favor:

- short, factual paragraphs (2-3 sentences) that stand alone as a quote
- specific numbers and data points (with a named source and a year)
- clear one-sentence definitions a model can lift verbatim
- tables and structured data
- FAQ blocks with concise answers that match conversational queries
- page freshness (recently updated content)
- valid JSON-LD that tells the model what the page is about

They do **not** reward pure domain authority with no relevant extractable content, or
long "SEO content" that buries the answer.

> Note: training-data citations (e.g. an API-mode model answering with no live retrieval)
> are won over months by brand presence in the crawl corpus — third-party mentions,
> well-structured docs, listicles. Formatting helps the retrieved path; brand-building
> helps the training-data path. This checklist is the retrieved-path lever.

## The checklist

A page is citation-ready when it passes all of these. Each is pass/fail per page;
record failures as findings in the standard `Issue / Impact / Evidence / Fix / Priority`
format (`format-conventions.md`).

1. **Answer-first opening.** The page's core answer appears in the first paragraph as
   one or two self-contained sentences — not after a 200-word preamble.
2. **One fact per item.** Lists and FAQ answers carry a single extractable claim each;
   no compound sentences that bundle three facts a model can't cleanly split.
3. **Short paragraphs.** Body paragraphs are 2-3 sentences. A model lifts a paragraph as
   a citation unit; long paragraphs get skipped or truncated.
4. **Definition block.** Where the page targets a "what is X" intent, there is a clean
   one-sentence definition near the top that a model can quote verbatim.
5. **Specific numbers, attributed.** Statistics carry a named source and a year inline
   (`(Source: <name>, <year>)`). Vague modifiers ("many", "most experts") are not citable.
   Do not invent precise figures — attribute analyst- or vendor-reported numbers to their
   source rather than stating an unsourced precise number.
6. **Table for comparison/quantitative data.** Comparison, pricing, or ranking data lives
   in an HTML table (4+ rows). Models cite table rows as discrete data points.
7. **FAQ block matching real queries.** A 4-6 question FAQ phrased the way users ask
   conversationally, each with a direct 1-2 sentence answer.
8. **Valid structured data.** `Article` schema present; `FAQPage` schema present when an
   FAQ block exists. JSON-LD validates.
9. **Freshness signal.** A visible last-updated date and genuinely current content
   (stale numbers fail #5).
10. **Heading-as-question structure.** Section headings phrase the question the section
    answers, so the model can map a heading to a query and extract the body beneath it.

## Citation-ready content template

```markdown
## What is [concept]?

[Concept] is [one-sentence definition with a specific number].
[One sentence of context]. [One sentence with a specific, attributed fact].

### How [concept] works

1. **Step one** — [concise explanation]
2. **Step two** — [concise explanation]

### [Concept] costs

| Item | Cost | Notes |
|------|------|-------|
| ...  | $X   | ...   |

### FAQ

**Q: [exact question users ask]?**
A: [direct 1-2 sentence answer]. (Source: [name], [year])
```

This format works because the definition is extractable as a citation, numbered steps
match how models structure responses, tables provide discrete citable data points, and
the FAQ matches conversational AI queries directly.

## Relationship to the organic on-page score

| Dimension | Organic on-page score | GEO citation-readiness |
|---|---|---|
| Question it answers | Will it rank? | Once retrieved, will it be quoted? |
| Rewards | Depth, links, keyword coverage, authority | Extractable structure, specificity, freshness |
| Length | Longer often helps | Length is neutral; burying the answer hurts |
| Win condition | Position in the SERP | A citation in the answer box |

A page should pass both. They are complementary, not substitutes — Critical Gate 2:
AI/answer optimization is additive, never an alternative to crawlability.

**Source grounding:** the 3-channel model (SEO / GEO / AEO), the retrieved-vs-training
citation split, and the citation-ready format derive from the searchstack AEO/GEO
reference. Adapt the specifics to the page; do not over-claim guaranteed lift.
