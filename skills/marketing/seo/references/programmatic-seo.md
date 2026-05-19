# Programmatic SEO Reference

Template design patterns, implementation guide, and quality control for pages at scale.

---

## Playbook Deep Dives

### Pattern 1: Integration Pages (Zapier model)

**URL:** `/integrations/[pattern-derived]`
**Search intent:** "[Your product] [tool] integration" or "[tool A] + [tool B]"
**Data needed:** Integration features, setup steps, use cases

**Template structure:**
```
H1: [Your Product] + [Tool] Integration
H2: What you can do (3-5 use cases with specifics)
H2: How to set up (step-by-step)
H2: Popular workflows (2-3 examples)
H2: Pricing (what's included, what costs extra)
H2: Alternatives (if this integration doesn't fit)
```

**Unique value per page:** Each integration page must include specific workflows, specific features available through that integration, and specific setup steps. If two integration pages could be the same after swapping the tool name, they're too thin.

### Pattern 2: Comparison Pages (G2 model)

**URL:** `/vs/[competitor]` or `/compare/[pattern-derived]-vs-[pattern-derived]`
**Search intent:** "[Tool A] vs [Tool B]", "[competitor] alternative"
**Data needed:** Feature comparisons, pricing, review data, use case fit

**Template structure:**
```
H1: [Tool A] vs [Tool B]: [Year] Comparison
TL;DR: 40-60 word recommendation
Comparison table: 8-12 specific features
H2: Best for [use case 1] — [winner and why]
H2: Best for [use case 2] — [winner and why]
H2: Pricing comparison
H2: What real users say (review quotes)
H2: Our recommendation
```

**Unique value per page:** Specific feature comparisons, use-case-based recommendations, real user quotes. Generic "both are great tools" is thin content.

### Pattern 3: Location Pages (local services model)

**URL:** `/[service]-in-[city]`
**Search intent:** "[service] in [city]", "[service] near me"
**Data needed:** Location-specific info, local stats, area-specific features

**Template structure:**
```
H1: [Service] in [City]
H2: What we offer in [City] (specific to this location)
H2: [City]-specific stats or context
H2: How it works (localized process)
H2: Pricing in [City] (if location-dependent)
H2: Coverage area (map or list)
```

**Unique value per page:** City-specific stats, local context, localized pricing. If you can't add location-specific value beyond the city name, don't create the page.

### Pattern 4: Glossary Pages (HubSpot model)

**URL:** `/glossary/[term]`
**Search intent:** "What is [term]", "[term] definition", "[term] meaning"
**Data needed:** Definitions, examples, related terms

**Template structure:**
```
H1: What is [Term]?
40-60 word definition (AI-citable)
H2: How [term] works (with example)
H2: Why [term] matters
H2: [Term] vs [related term] (disambiguation)
H2: Related terms (internal links to other glossary pages)
```

**Unique value per page:** Clear definition, practical example, disambiguation from similar terms. If the definition is one sentence with no additional value, it's thin content.

---

## Template Design Principles

### Variable vs. Unique Content

Every pSEO page is a mix of template (shared structure) and unique content (specific to that entity).

| Component | Template (shared) | Unique (per page) |
|-----------|-------------------|-------------------|
| Page structure | Same H1-H6 hierarchy | Different |
| Navigation | Same header/footer | Same |
| CTA | Same or similar | May vary |
| Core content | Structure and prompts | All content text |
| Data | Schema/format | Actual values |
| Internal links | Link structure pattern | Specific linked pages |

**Rule of thumb:** If >60% of a page's visible content is identical to other pages in the set, it's too thin. Each page needs enough unique content to justify its existence.

### Enrichment Strategies

When your base data isn't enough for a full page:

| Strategy | How | Example |
|----------|-----|---------|
| **Cross-reference** | Combine data from multiple sources | Integration page + reviews + use cases |
| **Computed insights** | Derive new information from raw data | "Most popular workflows" from usage data |
| **User-generated** | Let users add content | Reviews, ratings, community tips |
| **Editorial layer** | Add human-written analysis on top of data | "Our take" section, recommendations |
| **Related content** | Link to relevant non-pSEO content | Blog posts, guides, case studies |

---

## Indexation Strategy

Not every generated page should be indexed. Quality control prevents Google's Helpful Content Update from flagging your site.

### Indexation Decision Tree

```
Page has unique value beyond template? → No → noindex
 → Yes ↓
Page matches a real search intent? → No → noindex
 → Yes ↓
Page has enough content (>300 words unique)? → No → noindex or consolidate
 → Yes → index
```

### Monitoring Indexation Health

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Indexation rate | >80% of submitted pages | 50-80% | <50% |
| Crawl errors | <1% of pages | 1-5% | >5% |
| Avg. traffic per pSEO page | >10 sessions/month | 1-10 | 0 (dead pages) |
| Pages with 0 traffic (90 days) | <20% of indexed | 20-50% | >50% |

**If indexation rate drops:** Check Search Console for "Discovered — currently not indexed" or "Crawled — currently not indexed." These indicate Google found the pages but chose not to index them — usually a quality signal.

---

## Technical Implementation Notes

### URL Generation
- Slugify entity names: lowercase, hyphens, no special characters
- Handle duplicates: if two entities would produce the same slug, add disambiguation
- Redirect old URLs if entities are renamed or merged

### Internal Linking at Scale
- Every pSEO page links to its hub/category page
- Every pSEO page links to 3-5 related pSEO pages (algorithmically chosen by relevance)
- Hub pages paginate or use infinite scroll for large sets (don't list 10,000 links on one page)

### Schema at Scale
- Generate schema dynamically from the same data source as page content
- Use the appropriate schema type per playbook pattern (Product for comparisons, HowTo for integrations, FAQPage for glossary)
- Validate a sample of pages monthly (not just the template)
