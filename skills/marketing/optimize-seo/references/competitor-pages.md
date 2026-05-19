# Competitor Comparison Pages Reference

Templates, keyword targeting, and operational framework for comparison and alternative pages.

---

## Keyword Targeting Matrix

| Format | Primary Keywords | Secondary Keywords |
|--------|-----------------|-------------------|
| Singular alternative | `[competitor] alternative` | `replace [competitor]`, `instead of [competitor]` |
| Plural alternatives | `[competitor] alternatives`, `tools like [competitor]` | `best [competitor] alternatives [year]` |
| Direct comparison | `[your product] vs [competitor]` | `[your product] or [competitor]`, `[your product] compared to [competitor]` |
| Third-party comparison | `[comp A] vs [comp B]` | `[comp A] or [comp B]`, `[comp A] compared to [comp B]` |

### Priority Order for Creation

1. **Direct comparison** pages for your top 3 competitors (highest conversion intent)
2. **Alternative** pages for each competitor (capture "leaving" traffic)
3. **Category roundup** page: "Best [category] tools in [year]" (capture research traffic)
4. **Third-party comparisons** only if you have domain authority to rank (otherwise waste of effort)

---

## Page Templates

### Direct Comparison: `/vs/[competitor]`

```markdown
# [Your Product] vs [Competitor]: Honest Comparison ([Year])

[40-60 word TL;DR with direct recommendation and key differentiator.
Be specific — "Choose X if you need Y, choose Z if you need W."]

## Quick Comparison

| | [Your Product] | [Competitor] |
|---|---|---|
| **Best for** | [specific use case] | [specific use case] |
| **Price starts at** | $[X]/mo | $[X]/mo |
| **Free plan** | Yes/No | Yes/No |
| **[Key differentiator 1]** | [specific detail] | [specific detail] |
| **[Key differentiator 2]** | [specific detail] | [specific detail] |
| **[Key differentiator 3]** | [specific detail] | [specific detail] |
| **G2 Rating** | [X.X/5] | [X.X/5] |

## Where [Your Product] Wins

### [Use Case 1]
[2-3 paragraphs. Be specific — name features, show screenshots
or data. Include a customer quote if available.]

### [Use Case 2]
[Same format]

## Where [Competitor] Wins

[Be honest. Acknowledge their genuine strengths. This builds trust
and makes your advantages more credible (Pratfall Effect).]

### [Area where they're genuinely better]
[Honest assessment]

## What Real Users Say

> "[Quote from a user who switched from competitor to you]"
> — [Name, Role, Company] via [G2/review source]

> "[Quote from a user who chose competitor over you — and what
> they found]"
> — [Source]

## Who Should Choose [Your Product]

- You need [specific capability]
- You value [specific attribute]
- Your team is [specific context]

## Who Should Choose [Competitor]

- You need [specific capability they do better]
- You're already invested in [their ecosystem]
- [Other honest reason]

## How to Switch from [Competitor]

1. [Step 1 — make it sound easy]
2. [Step 2]
3. [Step 3]

Average migration time: [X hours/days]
```

### Alternative Page: `/alternatives/[competitor]`

```markdown
# Best [Competitor] Alternatives in [Year]

[40-60 word summary: why people leave [competitor] and what
to look for in an alternative.]

## Why People Switch from [Competitor]

Based on [source — G2 reviews, Reddit threads, support data]:
1. **[Reason 1]** — [specific detail with quote if available]
2. **[Reason 2]** — [specific detail]
3. **[Reason 3]** — [specific detail]

## Top [N] Alternatives to [Competitor]

### 1. [Your Product] — Best for [specific use case]

[2-3 paragraphs. Lead with the use case where you win.
Be specific about features, pricing, differentiators.]

**Pricing:** $[X]/mo | **Free plan:** Yes/No
**Best for:** [specific audience]
**Switch from [competitor] in:** [timeframe]

### 2. [Alternative B] — Best for [different use case]

[Fair assessment. If another tool is genuinely better for
a different use case, say so. Credibility over rankings.]

### 3. [Alternative C] — Best for [yet another use case]

[Same format]

## Comparison Table

| Feature | [Your Product] | [Alt B] | [Alt C] | [Competitor] |
|---------|---|---|---|---|
| Price | $X | $Y | $Z | $W |
| [Feature 1] | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ |
```

---

## Centralized Competitor Data Architecture

Maintain a single source of truth that all comparison pages read from:

```markdown
# Competitor Data: [Competitor Name]

**Last verified:** [date]
**Pricing page:** [URL]

## Pricing
| Plan | Price | Key Limits |
|------|-------|-----------|
| Free | $0 | [limits] |
| Pro | $X/mo | [limits] |
| Enterprise | Custom | [limits] |

## Key Features
| Feature | Available? | Notes |
|---------|-----------|-------|
| [Feature 1] | Yes/No/Partial | [specifics] |

## Ratings
| Platform | Rating | Reviews |
|----------|--------|---------|
| G2 | X.X/5 | [N] reviews |
| Capterra | X.X/5 | [N] reviews |

## Known Weaknesses (from reviews)
1. [Weakness] — Pattern basis: internal research synthesis.
2. [Weakness] — Pattern basis: internal research synthesis.

## Known Strengths
1. [Strength] — Pattern basis: internal research synthesis.
2. [Strength] — Pattern basis: internal research synthesis.
```

**Update triggers:**
- Competitor changes pricing → update within 1 week
- Competitor launches major feature → update within 2 weeks
- Quarterly → verify all data is current
- Annually → full refresh of all competitor profiles

---

## Internal Linking Structure

```
/compare (hub)
├── /vs/competitor-a
├── /vs/competitor-b
├── /vs/competitor-c
├── /alternatives/competitor-a
├── /alternatives/competitor-b
└── /alternatives/competitor-c
```

**Linking rules:**
- Hub page links to all comparison and alternative pages
- Each comparison page links back to hub + 2-3 related comparisons
- Each alternative page links to the direct comparison page for that competitor
- Blog posts mentioning competitors link to the relevant comparison page
- Pricing page links to top comparison pages (high-intent internal link)
