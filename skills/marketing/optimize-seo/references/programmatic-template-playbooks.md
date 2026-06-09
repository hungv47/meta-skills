# The 12 Programmatic SEO Playbooks

The canonical taxonomy of programmatic-SEO page types (Route C). This is the
**playbook-selection** layer: which template archetype fits a keyword cluster and
the available data assets. For template *design* (HTML structure, schema generation,
the 60%-unique-content threshold, data-defensibility tiers): `programmatic-seo.md`.
The two are consumed together by `programmatic-template-agent` — this file selects the
archetype, `programmatic-seo.md` builds it.

> **Selection rule:** never start from "we want pages at scale." Start from a keyword
> cluster with a repeating search pattern AND a data asset that fills the template
> uniquely per page. A playbook with no defensible data per page is a thin-content
> farm — Google's Helpful Content system targets exactly that. Match the playbook to
> your assets (table at the bottom), then pressure-test value-per-page before committing.

The 12 playbooks, in canonical order:

1. Templates
2. Curation
3. Conversions
4. Comparisons
5. Examples
6. Locations
7. Personas
8. Integrations
9. Glossary
10. Translations
11. Directory
12. Profiles

---

## 1. Templates

- **Search pattern:** `[type] template`, `free [type] template`
- **Example queries:** "resume template", "invoice template", "pitch deck template"
- **Why it works:** high intent (the searcher needs it now), shareable/linkable as an
  asset, natural for product-led companies.
- **Value bar:** actually usable templates (not previews); multiple variations per type;
  quality comparable to paid options; frictionless download/use flow.
- **URL structure:** `/templates/[type]/` or `/templates/[category]/[type]/`

## 2. Curation

- **Search pattern:** `best [category]`, `top [N] [things]`
- **Example queries:** "best website builders", "top 10 CRM software", "best free design tools"
- **Why it works:** comparison shoppers seeking guidance, high commercial intent,
  evergreen when updated.
- **Value bar:** genuine evaluation criteria; real testing or expertise; a visible
  last-updated date; not affiliate-driven rankings.
- **URL structure:** `/best/[category]/` or `/[category]/best/`

## 3. Conversions

- **Search pattern:** `[X] to [Y]`, `[amount] [unit] in [unit]`
- **Example queries:** "$10 USD to GBP", "100 kg to lbs", "PDF to Word"
- **Why it works:** instant utility, extremely high search volume, repeat-usage potential.
- **Value bar:** accurate real-time data; fast functional tool; related conversions
  suggested; mobile-friendly.
- **URL structure:** `/convert/[from]-to-[to]/` or `/[from]-to-[to]-converter/`

## 4. Comparisons

- **Search pattern:** `[X] vs [Y]`, `[X] alternative`
- **Example queries:** "webflow vs wordpress", "notion vs coda", "figma alternatives"
- **Why it works:** high purchase intent, clear search pattern, scales with the
  competitor set.
- **Value bar:** honest balanced analysis; actual feature-comparison data; a clear
  recommendation by use case; updated when products change.
- **URL structure:** `/compare/[x]-vs-[y]/` or `/[x]-vs-[y]/`
- *See also: Route D (Competitor Pages) for the head-to-head framework in depth.*

## 5. Examples

- **Search pattern:** `[type] examples`, `[category] inspiration`
- **Example queries:** "saas landing page examples", "email subject line examples",
  "portfolio website examples"
- **Why it works:** research-phase traffic, highly shareable, natural for design/creative
  tools.
- **Value bar:** real high-quality examples; screenshots or embeds; categorization/
  filtering; analysis of why each works.
- **URL structure:** `/examples/[type]/` or `/[type]-examples/`

## 6. Locations

- **Search pattern:** `[service/thing] in [location]`
- **Example queries:** "coworking spaces in san diego", "dentists in austin",
  "best restaurants in brooklyn"
- **Why it works:** local intent is massive, scales with geography, natural for
  marketplaces/directories.
- **Value bar:** actual local data (not just a swapped city name); local providers listed;
  location-specific insight (pricing, regulations); map integration helps.
- **URL structure:** `/[service]/[city]/` or `/locations/[city]/[service]/`

## 7. Personas

- **Search pattern:** `[product] for [audience]`, `[solution] for [role/industry]`
- **Example queries:** "payroll software for agencies", "crm for real estate",
  "project management for freelancers"
- **Why it works:** speaks to the searcher's exact context, higher conversion than
  generic pages, scales with personas.
- **Value bar:** genuine persona-specific content; relevant features highlighted;
  testimonials from that segment; use cases specific to the audience.
- **URL structure:** `/for/[persona]/` or `/solutions/[industry]/`

## 8. Integrations

- **Search pattern:** `[your product] [other product] integration`, `[product] + [product]`
- **Example queries:** "slack asana integration", "zapier airtable", "hubspot salesforce sync"
- **Why it works:** captures users of other products, high intent, scales with the
  integration ecosystem.
- **Value bar:** real integration details; setup instructions; use cases for the
  combination; a working integration (not vaporware).
- **URL structure:** `/integrations/[product]/` or `/connect/[product]/`

## 9. Glossary

- **Search pattern:** `what is [term]`, `[term] definition`, `[term] meaning`
- **Example queries:** "what is pSEO", "api definition", "what does crm stand for"
- **Why it works:** top-of-funnel awareness, establishes expertise, natural internal-
  linking opportunities. Also strong for GEO/AEO — definition pages are citation-ready
  (see `geo-citation-readiness-checklist.md`).
- **Value bar:** clear accurate definitions; examples and context; related terms linked;
  more depth than a dictionary.
- **URL structure:** `/glossary/[term]/` or `/learn/[term]/`

## 10. Translations

- **Search pattern:** the same content in multiple languages
- **Example queries:** "qué es pSEO", "was ist SEO", "マーケティングとは"
- **Why it works:** opens new markets, lower competition in many languages, multiplies
  content reach.
- **Value bar:** quality translation (not raw machine translation); cultural localization;
  hreflang implemented; native-speaker review.
- **URL structure:** `/[lang]/[page]/` (e.g. `/es/`, `/de/`)

## 11. Directory

- **Search pattern:** `[category] tools`, `[type] software`, `[category] companies`
- **Example queries:** "ai copywriting tools", "email marketing software", "crm companies"
- **Why it works:** research-phase capture, link-building magnet, natural for aggregators/
  reviewers.
- **Value bar:** comprehensive coverage; useful filtering/sorting; details per listing
  (not just names); regular updates.
- **URL structure:** `/directory/[category]/` or `/[category]-directory/`

## 12. Profiles

- **Search pattern:** `[person/company name]`, `[entity] + [attribute]`
- **Example queries:** "stripe ceo", "airbnb founding story", "elon musk companies"
- **Why it works:** informational-intent traffic, builds topical authority, natural for
  B2B/news/research.
- **Value bar:** accurate sourced information; regularly updated; unique insight or
  aggregation; not a Wikipedia rehash.
- **URL structure:** `/people/[name]/` or `/companies/[name]/`

---

## Choosing a playbook — match to your assets

| If the site has... | Consider... |
|---|---|
| Proprietary data | Directory, Profiles (+ a linkable-asset stats page — see `linkable-asset-playbook.md`) |
| Product with integrations | Integrations |
| Design/creative product | Templates, Examples |
| Multi-segment audience | Personas |
| Local presence | Locations |
| Tool or utility product | Conversions |
| Content/expertise | Glossary, Curation |
| International potential | Translations |
| Competitor landscape | Comparisons |

## Combining playbooks

Layering multiplies coverage when each layer adds a defensible data dimension:

- **Locations + Personas** — "marketing agencies for startups in Austin"
- **Curation + Locations** — "best coworking spaces in San Diego"
- **Integrations + Personas** — "Slack for sales teams"
- **Glossary + Translations** — multi-language educational content

Stop layering when a dimension stops adding unique data — combinatorial pages with no
per-cell value are the fastest route to a thin-content penalty.

## Route C output — what the agent returns

A Route C run names a **2-3 playbook shortlist** for the cluster, each with: the matched
search pattern, the data asset that fills it uniquely, the value-per-page check, and the
URL structure. It then runs each candidate through the data-defensibility hierarchy in
`programmatic-seo.md` and the linkable-asset build/skip decision in
`linkable-asset-playbook.md` where a proprietary-data play is in scope.
