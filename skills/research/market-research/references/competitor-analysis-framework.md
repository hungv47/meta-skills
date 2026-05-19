# Competitor Analysis Framework

Structured methodology for evaluating competitors across multiple dimensions. Feature matrices alone miss the dynamics that determine competitive threat level.

## Evaluation Dimensions

### 1. Feature Matrix

Build a comparison matrix covering:

| Category | What to Compare |
|----------|----------------|
| **Table stakes** | Features every competitor has — absence here is disqualifying |
| **Differentiators** | Features only 1-2 competitors offer — potential moats |
| **Emerging** | Features being built or beta — signals direction |
| **Missing** | Features users request that nobody provides — opportunity signals |

**Scoring:**
- ✅ Full support — feature is mature, documented, actively maintained
- 🟡 Partial — feature exists but limited, beta, or poorly reviewed
- ❌ Not available — no evidence of this capability

**Pattern basis:** internal research synthesis.

### 2. Pricing Models

| Element | What to Capture |
|---------|----------------|
| **Structure** | Per seat, per usage, flat rate, hybrid |
| **Free tier** | Exists? Limits? Enough to evaluate? |
| **Entry price** | Lowest paid tier — what you get |
| **Scaling** | How price grows with usage/team size |
| **Enterprise** | Custom pricing? Required for which features? |
| **Hidden costs** | Overages, required add-ons, implementation fees |

**Search patterns:**
- `site:[competitor].com/pricing`
- `"[competitor] pricing [year]"` — for historical changes
- `"[competitor]" pricing "per seat" OR "per user" OR "usage-based"`
- G2/Capterra listings often show pricing when the competitor doesn't publish it

### 3. Positioning Analysis

For each competitor, extract:

| Element | Source |
|---------|--------|
| **Tagline** | Homepage hero |
| **Primary benefit** | Above-the-fold messaging |
| **Target audience** | Explicitly stated or implied |
| **Proof points** | Logos, numbers, testimonials on homepage |
| **Category claim** | How they define the category they're in |

**Positioning map construction:**
1. List the 3-4 dimensions buyers actually compare on (from review sites and forums)
2. Pick the 2 most differentiating as axes
3. Plot competitors based on their actual positioning, not your assessment of their product quality
4. Identify empty quadrants — these are positioning white space candidates

Common axis pairs:
- Price vs. Complexity (works for most B2B SaaS)
- SMB vs. Enterprise (works when market spans segments)
- Breadth vs. Depth (works for platform vs. point solution markets)
- Self-serve vs. Sales-led (works for GTM strategy analysis)

### 4. Growth Signal Detection

| Signal | Where to Find | What It Means |
|--------|--------------|---------------|
| **Funding rounds** | Crunchbase, TechCrunch | Runway and investor confidence |
| **Team growth** | LinkedIn company page (employee count over time) | Expanding or contracting |
| **Job postings** | Careers page, LinkedIn jobs | Which teams are growing → product direction |
| **Hiring for your niche** | Job descriptions mentioning your feature area | They're coming for your space |
| **Tech stack changes** | Job postings, blog posts | Platform evolution signals |
| **Conference presence** | Speaker lists, sponsor pages | Market positioning investment |
| **Content velocity** | Blog post frequency, social posting cadence | Marketing investment level |
| **Product updates** | Changelog, release notes, Product Hunt launches | Feature velocity and direction |

**Search patterns:**
- `site:crunchbase.com "[competitor]"`
- `site:linkedin.com/company/[competitor]`
- `"[competitor]" hiring OR "we're hiring" OR careers`
- `"[competitor]" "series" OR "raised" OR "funding"`

### 5. Community Assessment

| Metric | How to Measure | What It Indicates |
|--------|---------------|------------------|
| **Community size** | Members/followers across platforms | Reach and awareness |
| **Activity level** | Posts/comments per week | Engagement health |
| **Sentiment ratio** | Positive:Negative:Neutral in recent discussions | User satisfaction |
| **Response time** | How fast official accounts respond | Support investment |
| **User-generated content** | Tutorials, blog posts, videos by users | Organic advocacy level |
| **Share of voice** | % of category mentions that include this competitor | Mindshare dominance |

**Pattern basis:** internal research synthesis.

## Threat Level Assessment

Combine dimensions into an overall threat assessment:

| Threat Level | Criteria |
|-------------|----------|
| **Critical** | Same segment, well-funded, growing fast, strong community, heading toward your differentiation |
| **High** | Same segment, moderate resources, good product, could expand into your niche |
| **Medium** | Adjacent segment, strong product, not currently targeting your users |
| **Low** | Different segment, limited resources, or stagnant growth |
| **Watch** | Early-stage or adjacent player that could become a threat with a pivot or funding round |

The most dangerous competitors are often rated "Medium" — adjacent players with resources who haven't entered your space yet but easily could.
