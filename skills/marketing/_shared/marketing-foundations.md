# Marketing Foundations

Shared reference for all marketing skills. Canonical definitions of channels, funnel stages, quality vocabulary, and pipeline contracts. All marketing skills should reference this file for consistent terminology.

---

## 9-Channel Framework

The complete channel map for growth. Every marketing skill that references channels should use these exact names and definitions.

| # | Channel | Organic Tactics | Paid Tactics | Typical Funnel Role |
|---|---------|----------------|--------------|---------------------|
| 1 | **Search engines/AEO** | SEO, AEO (AI search optimization) | Search ads, Shopping ads | Acquisition (intent capture) |
| 2 | **Store/Listing platforms** | ASO (App Store/Play Store), G2/Capterra profiles, Product Hunt | Apple Search ads, sponsored listings | Acquisition (marketplace discovery) |
| 3 | **Bounty/Info platforms** | Referral programs, affiliate networks | Incentive campaigns, paid referrals | Acquisition (incentivized) |
| 4 | **News** | Earned press, contributed articles | Paid PR, guest-postings, press releases | Awareness + Trust |
| 5 | **Forums/Communities** | Threading (Reddit, HN, Quora), community engagement | Reddit ads, forum sponsorships | Awareness + Trust + Advocacy |
| 6 | **Social media** | Organic brand, affiliate, UGC, internal UGC | Paid ads (Meta, X, LinkedIn, TikTok), boosted posts | Full funnel |
| 7 | **IRL** | Events, conferences, meetups, word of mouth | OOH, Point of Sales, event sponsorships | Awareness + Relationship |
| 8 | **Mailbox** | Transactional emails, newsletters, onboarding | Gmail Sponsored Promotions | Nurture + Conversion |
| 9 | **SMS** | Transactional SMS, order updates | Paid SMS campaigns | Conversion + Re-engagement |

---

## Funnel Stage Vocabulary

Use these exact stage names across all skills for consistency:

| Stage | Buyer State | Content Job | Key Metric |
|-------|-----------|-------------|-----------|
| **Unaware** | Doesn't know the problem exists | Create awareness of the problem | Reach, impressions |
| **Problem Aware** | Knows the problem, not the solutions | Validate the pain, introduce solution category | Engagement, time on page |
| **Solution Aware** | Knows solutions exist, evaluating options | Differentiate, demonstrate value | Clicks, signups, demo requests |
| **Product Aware** | Knows your product, hasn't decided | Overcome objections, provide proof | Trials, add-to-cart |
| **Most Aware** | Ready to buy, needs final nudge | Reduce friction, urgency, deal | Conversions, purchases |

---

## Content Quality Standards

### The 3Q Test (applies to all content)

Every piece of content must pass:

1. **Visual** — Can you picture it? (Concrete imagery > abstract claims)
2. **Falsifiable** — Can it be proven or disproven? (Specific > vague)
3. **Uniquely Ours** — Could only we say this? (Differentiated > generic)

### Hook Quality

- Hook ≤ 8 words OR within platform character limit
- Must lead with the audience's problem, not the brand's solution
- Uses audience language (from VoC research), not brand jargon

### CTA Formula

`[Action verb] + [What they get]`

Bad: "Learn More", "Click Here", "Submit"
Good: "Start your free trial", "Get the template", "See your score"

---

## Voice of Customer (VoC) Principles

Applies to all content skills that reference audience language:

1. **Buyer words, not brand words.** Use the exact language from ICP research, community listening, and review mining.
2. **Pain before solution.** Lead with the problem the audience recognizes, not the feature you built.
3. **Specificity wins.** "Cut PR review time from 3 days to 4 hours" > "Speed up code review."
4. **Emotional triggers over rational features.** "Stop losing your best engineers to review fatigue" > "Automated code review platform."

---

## Growth Motion Context

All marketing decisions should be informed by the business's growth motion:

| Motion | Key Channels | Content Focus | Conversion Path |
|--------|-------------|---------------|----------------|
| **PLG** (Product-Led Growth) | Search, Communities, Store/Listing, Mailbox | Self-serve education, use-case demos, comparison | Free trial → activation → upgrade |
| **SLG** (Sales-Led Growth) | Social (paid), IRL, Mailbox, News | Trust signals, case studies, ROI proof | Lead → demo → proposal → close |
| **Hybrid** | All channels, weighted by segment | Segment-specific messaging | PLG path for SMB, SLG path for enterprise |

---

## Content Classification

| Type | Purpose | Lifespan | Distribution |
|------|---------|----------|-------------|
| **Searchable** | Capture existing demand | Evergreen (compounds) | Blog, YouTube, SEO, Quora |
| **Shareable** | Create new demand | Spike and decay | Social, email, KOLs, communities |

A healthy content mix needs both. Searchable builds slow but compounds. Shareable spikes but requires constant production.

---

## Skill Pipeline Contracts

How marketing skills connect — each skill's output feeds the next:

```
icp-research (research-skills)
  └─ product-context.md → consumed by ALL skills below
  └─ icp-research.md → consumed by campaign-plan, copywriting, content-research

brand-system → BRAND.md + DESIGN.md → consumed by copywriting, humanize, design-brief, lp-brief

content-research (research-skills)
  └─ content-research.md → consumed by campaign-plan, copywriting, lp-brief

campaign-plan → campaign-plan.md → consumed by lp-brief, cold-outreach, seo

copywriting → content/[slug].copy.md → consumed by humanize, vn-tone
humanize → content/[slug].humanized.md → final-stage polish
vn-tone → content/[slug].vn-tone.md → Vietnamese register polish

lp-brief → .forsvn/artifacts/mkt/lp-brief/[slug]/brief.md → owns landing-page construction + conversion-principles gate; consumed by design-brief (per asset slot) and external designer/image-gen
lp-eval → .forsvn/loops/[slug]/evals/[date]-cycle-N.md → owns post-launch landing-page evidence scoring; consumes eval-loop workspace and appends results.tsv
design-brief → .forsvn/artifacts/mkt/design-briefs/[slug].md → consumed by external designer or image-gen tool
seo → seo-[mode].md → consumed by copywriting (SEO content), campaign-plan

cold-outreach → .forsvn/artifacts/mkt/cold-outreach/[slug].md → standalone outbound execution
```

---

## Artifact Versioning Convention

All marketing skills follow the same re-run protocol:

1. On re-run: rename existing artifact to `[name].v[N].md`
2. Create new artifact with incremented version number
3. Reference prior version for comparison/progress tracking

---

## Cross-Skill Vocabulary

| Term | Definition | Used By |
|------|-----------|---------|
| **Pillar** | A core messaging theme (3-5 per brand) | campaign-plan |
| **Angle** | A specific perspective within a pillar (3D: hook × trigger × stage) | campaign-plan, copywriting |
| **Hook** | The opening line/visual that captures attention | copywriting, cold-outreach |
| **CTA** | Call-to-action: specific next step for the audience | copywriting, lp-brief |
| **VoC** | Voice of Customer: authentic audience language | icp-research, copywriting |
| **3Q Test** | Visual + Falsifiable + Uniquely Ours quality gate | copywriting |
| **Route** | Execution path within a skill (A/B/C/D) | seo, copywriting, lp-brief |
| **Critic gate** | Quality checkpoint: PASS/FAIL with max 2 rewrite cycles | All skills |
