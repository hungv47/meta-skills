# Market Sizing Guide

Methods for estimating TAM, SAM, and SOM with appropriate confidence levels. Market sizing is directional, not precise — the goal is order-of-magnitude understanding, not false precision.

## Definitions

| Term | Definition | Example |
|------|-----------|---------|
| **TAM** (Total Addressable Market) | Total revenue opportunity if you captured 100% of the market | All spend on code review tools globally |
| **SAM** (Serviceable Addressable Market) | Portion of TAM you can realistically reach with your business model | Code review tools for mid-market SaaS teams in English-speaking markets |
| **SOM** (Serviceable Obtainable Market) | Portion of SAM you can realistically capture in 1-3 years | Mid-market SaaS teams using GitHub who would adopt AI code review |

## Method 1: Top-Down (from analyst reports)

Start with published market data and narrow down.

### Process
1. Find a market report that covers your category or a parent category
2. Apply filters to narrow: geography, segment, pricing model
3. Calculate your slice based on the filters

### Search Patterns
| Goal | Query |
|------|-------|
| Market reports | `"[market] market size [year]" report` |
| Analyst data | `"[market]" TAM OR "total addressable" [year]` |
| Industry reports | `site:statista.com "[market]" OR site:grandviewresearch.com "[market]"` |
| Press coverage of reports | `"[market] market" "$" billion OR million [year]` |

### Strengths & Weaknesses
- **Strength:** Fast, leverages professional research, credible with investors
- **Weakness:** Category definitions rarely match your product exactly, reports may be 6-18 months old, methodology is opaque

### Confidence Calibration
| Situation | Confidence |
|-----------|-----------|
| Multiple reports agree within 20% | High |
| One report, reputable source | Medium |
| Report covers parent category, you're extrapolating a subset | Low |
| No reports exist for this specific category | Very Low — switch to bottom-up |

## Method 2: Bottom-Up (from user counts)

Build up from individual customers and transactions.

### Process
1. Estimate the number of potential customers in your target segment
2. Estimate average revenue per customer
3. Multiply: TAM = # customers × average revenue

### Data Sources for Customer Counts
| Source | How to Use |
|--------|-----------|
| **LinkedIn** | Search job titles + company filters for buyer count |
| **Industry associations** | Often publish member counts or industry census data |
| **Government data** | Census Bureau, BLS for business counts by NAICS code |
| **Competitor data** | Published customer counts × inverse market share estimate |
| **Platform data** | GitHub orgs, Slack workspaces, etc. as proxy for addressable accounts |

### Search Patterns
| Goal | Query |
|------|-------|
| Business counts | `"number of [business type]" [country] [year]` |
| Segment sizing | `"[industry] companies" [country] statistics [year]` |
| Job title counts | `"how many [job title]" [country]` |
| Platform user counts | `"[platform] users" OR "[platform] developers" [year] statistics` |

### Strengths & Weaknesses
- **Strength:** Based on observable data, directly tied to your product's actual target
- **Weakness:** Requires many assumptions, each adding uncertainty; easy to inflate

## Triangulation

Use BOTH methods and compare. The gap between top-down and bottom-up estimates reveals your assumption quality.

| Scenario | What It Means | Action |
|----------|--------------|--------|
| Top-down ≈ Bottom-up (within 2x) | Estimates are reasonably aligned | Report with medium-high confidence |
| Top-down >> Bottom-up (>5x) | Your segment is smaller than the category, or bottom-up misses segments | Check: are you being too narrow in bottom-up? |
| Bottom-up >> Top-down (>5x) | Market reports may use a narrower definition, or bottom-up assumptions are inflated | Check: are your revenue-per-customer assumptions too high? |

## Presenting Market Size

### Do
- State the method used (top-down, bottom-up, or both)
- uses sources with dates
- Show your math/assumptions
- Express as ranges, not point estimates ("$2-4B" not "$3.2B")
- Flag confidence level

### Don't
- Present a single precise number without methodology
- Use TAM when you mean SAM (investors notice)
- Mix timeframes (2023 report for 2026 projections without noting the gap)
- Extrapolate growth rates beyond 3 years
- Ignore that your product may create a new category not covered by existing reports

## Template

```markdown
### Market Size

**Method:** [Top-down / Bottom-up / Triangulated]

**TAM:** $[X-Y]B — [Category] globally
- Pattern basis: internal research synthesis.
- Assumptions: [What's included/excluded]

**SAM:** $[X-Y]M — [Your accessible segment]
- Filters applied: [Geography, segment, model]
- Calculation: [Show math]

**SOM:** $[X-Y]M — [Realistic 1-3 year capture]
- Basis: [Competitor benchmarks, growth rate, capacity]
- Assumptions: [Market share %, penetration rate]

**Confidence:** [High/Medium/Low]
**Key uncertainty:** [The assumption most likely to be wrong]
```
