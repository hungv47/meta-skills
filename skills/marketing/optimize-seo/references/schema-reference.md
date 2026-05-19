# Schema Markup Reference

Schema types, implementation contexts, and validation guide.

---

## Priority Schema Types

Implement in this order based on typical impact:

### Tier 1: High Impact

#### FAQPage
```json
{
 "@context": "https://schema.org",
 "@type": "FAQPage",
 "mainEntity": [
 {
 "@type": "Question",
 "name": "What is [topic]?",
 "acceptedAnswer": {
 "@type": "Answer",
 "text": "[40-60 word answer]"
 }
 }
 ]
}
```
**Use on:** FAQ pages, knowledge base articles, any page with Q&A content.
**AI impact:** Directly feeds Google AI Overviews and helps AI models parse Q&A structure.

#### Article / BlogPosting
```json
{
 "@context": "https://schema.org",
 "@type": "Article",
 "headline": "[Title]",
 "author": {
 "@type": "Person",
 "name": "[Author Name]",
 "url": "[Author profile URL]"
 },
 "datePublished": "[ISO date]",
 "dateModified": "[ISO date]",
 "publisher": {
 "@type": "Organization",
 "name": "[Company]"
 }
}
```
**Use on:** Blog posts, guides, reports.
**AI impact:** Author attribution + dates help AI models assess authority and freshness.

#### HowTo
```json
{
 "@context": "https://schema.org",
 "@type": "HowTo",
 "name": "How to [outcome]",
 "step": [
 {
 "@type": "HowToStep",
 "name": "[Step title]",
 "text": "[Step description]"
 }
 ]
}
```
**Use on:** Tutorial content, setup guides, process documentation.

### Tier 2: Important

#### Product
```json
{
 "@context": "https://schema.org",
 "@type": "Product",
 "name": "[Product Name]",
 "description": "[Description]",
 "offers": {
 "@type": "Offer",
 "price": "[X]",
 "priceCurrency": "USD"
 },
 "aggregateRating": {
 "@type": "AggregateRating",
 "ratingValue": "[X.X]",
 "reviewCount": "[N]"
 }
}
```
**Use on:** Product pages, pricing pages.

#### BreadcrumbList
```json
{
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [
 {
 "@type": "ListItem",
 "position": 1,
 "name": "Home",
 "item": "https://example.com"
 },
 {
 "@type": "ListItem",
 "position": 2,
 "name": "[Section]",
 "item": "https://example.com/section"
 }
 ]
}
```
**Use on:** Every page with breadcrumb navigation.

### Tier 3: Situational

#### Organization
```json
{
 "@context": "https://schema.org",
 "@type": "Organization",
 "name": "[Company]",
 "url": "[URL]",
 "logo": "[Logo URL]",
 "sameAs": [
 "[Twitter URL]",
 "[LinkedIn URL]",
 "[GitHub URL]"
 ]
}
```
**Use on:** Homepage, about page. Helps AI models build entity associations.

#### SoftwareApplication
```json
{
 "@context": "https://schema.org",
 "@type": "SoftwareApplication",
 "name": "[App Name]",
 "applicationCategory": "[Category]",
 "operatingSystem": "[OS]",
 "offers": {
 "@type": "Offer",
 "price": "[X]",
 "priceCurrency": "USD"
 }
}
```
**Use on:** Software product pages, app store landing pages.

#### LocalBusiness
**Use on:** Local business pages. Include address, phone, hours, geo coordinates.

#### Event
**Use on:** Webinar pages, conference pages, live event listings.

---

## Combining Schema with practitioner source

When a page needs multiple schema types (common), use `practitioner source`:

```json
{
 "@context": "https://schema.org",
 "practitioner source": [
 {
 "@type": "Article",
 "headline": "...",
 "author": { "@type": "Person", "name": "..." }
 },
 {
 "@type": "BreadcrumbList",
 "itemListElement": [...]
 },
 {
 "@type": "FAQPage",
 "mainEntity": [...]
 }
 ]
}
```

**Common combinations:**
- Blog post: Article + BreadcrumbList + FAQPage (if has FAQ section)
- Product page: Product + BreadcrumbList + FAQPage
- Homepage: Organization + WebSite

---

## Implementation by Context

| Context | How to Implement | Notes |
|---------|-----------------|-------|
| **Static HTML** | Inline `<script type="application/ld+json">` in `<head>` | Most reliable — always server-rendered |
| **React / Next.js** | SSR or `<Head>` component with JSON-LD string | Must be server-rendered — client-only JS may not be crawled |
| **CMS (WordPress)** | Plugin (Yoast, RankMath, AIOSEO) or custom `wp_head` action | Plugins inject via JS — verify with Rich Results Test, not view-source |
| **CMS (Webflow)** | Custom code embed in page `<head>` | Static injection — reliable |
| **Programmatic pages** | Generate JSON-LD dynamically from the same data source as page content | Validate a sample, not just the template |

**Critical caveat:** CMS plugins (Yoast, AIOSEO, RankMath) often inject JSON-LD via client-side JavaScript. This means:
- `curl` / web fetch will NOT see the schema in raw HTML
- You MUST verify schema with Google Rich Results Test or browser DevTools
- Don't flag "missing schema" based on raw HTML alone during audits

---

## Validation

### Tools
1. **Google Rich Results Test** — definitive for Google's interpretation
2. **Schema.org Validator** — checks syntax against schema.org spec
3. **Google Search Console → Enhancements** — shows schema errors across your whole site

### Validation Checklist
- [ ] No missing required properties (test shows all green)
- [ ] Dates in ISO 8601 format (`2026-03-17`)
- [ ] URLs are absolute, not relative
- [ ] Content in schema matches visible page content (no hidden/different text)
- [ ] No warnings in Rich Results Test
- [ ] Search Console shows no schema errors

### Common Mistakes
- **Missing required fields** — each schema type has required vs. optional properties
- **Schema-content mismatch** — schema says price is $99 but page shows $129
- **Invalid date formats** — use `2026-03-17`, not `March 17, 2026`
- **Relative URLs** — use `https://example.com/page`, not `/page`
- **Invisible content** — schema describing content not visible on the page (Google penalty risk)

---

## Schema and AI Visibility

Content with proper schema shows 30-40% higher AI visibility (estimated). Schema helps AI models in two ways:

1. **Explicit structure:** AI models can parse the content type, author, date, and relationships without guessing
2. **Search engine pipeline:** Google AI Overviews and Gemini directly consume structured data from the search index

**Priority for AI visibility:**
1. FAQPage (direct Q&A extraction)
2. Article with author (authority signals)
3. HowTo (step extraction)
4. Product (entity information)
5. Organization (brand entity)
