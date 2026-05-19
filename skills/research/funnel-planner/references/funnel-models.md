# Funnel Models

Detailed breakdown of common funnel frameworks and when to use each.

---

## AARRR (Pirate Metrics)

Developed by Dave McClure for startups and growth-focused businesses.

### Stages

| Stage | Definition | Key Question | Typical Metrics |
|-------|------------|--------------|-----------------|
| **Acquisition** | How do users find you? | Where do they come from? | Visitors, signups, traffic sources |
| **Activation** | Do users have a great first experience? | Did they reach the "aha moment"? | Activation rate, time to value, onboarding completion |
| **Retention** | Do users come back? | Are they forming habits? | D1/D7/D30 retention, churn rate, session frequency |
| **Revenue** | Do users pay? | Are they valuable? | Conversion rate, ARPU, LTV |
| **Referral** | Do users tell others? | Are they advocates? | Referral rate, NPS, viral coefficient |

### Best For

- SaaS products
- Mobile apps
- Subscription businesses
- Products with free-to-paid conversion
- Growth-stage companies

### Stage Details

#### Acquisition
Users discover your product through various channels.

**Metrics to track:**
- Unique visitors
- Signup rate (visitors → signups)
- Cost per acquisition by channel
- Channel mix and attribution

**Common channels:**
- Paid (Search, Social, Display)
- Organic (SEO, Content)
- Referral (Word of mouth, Affiliates)
- Direct (Brand awareness)

#### Activation
Users experience core value for the first time.

**What counts as "activated":**
- Completed onboarding
- Used key feature
- Achieved first success/outcome
- Reached predefined milestone

**Metrics to track:**
- Activation rate (signups → activated)
- Time to activate
- Onboarding completion steps
- Feature adoption in first session

**Warning signs:**
- High signup, low activation = onboarding problem
- Long time to activate = unclear value proposition

#### Retention
Users return and form habits.

**Cohort timeframes:**
| Period | What it measures |
|--------|------------------|
| D1 | Immediate value |
| D7 | Early habit formation |
| D30 | Medium-term retention |
| D90+ | True stickiness |

**Metrics to track:**
- Retention curves by cohort
- Churn rate
- Session frequency
- Feature stickiness

**Retention segments:**
- Power users (daily)
- Regular users (weekly)
- Casual users (monthly)
- Churned (no activity)

#### Revenue
Users convert to paying customers.

**Conversion paths:**
- Freemium → Paid
- Trial → Paid
- Subscription tiers
- Usage-based pricing

**Metrics to track:**
- Free-to-paid conversion rate
- Trial conversion rate
- ARPU / ARPPU
- Revenue per cohort
- Expansion revenue

#### Referral
Users become advocates and bring others.

**Referral mechanics:**
- Direct invites
- Social sharing
- Affiliate programs
- User-generated content

**Metrics to track:**
- Referral rate (users who refer / total users)
- Viral coefficient (invites sent × conversion rate)
- NPS (Net Promoter Score)
- Referral conversion rate

**Viral loop:**
```
Users → Invites → New Signups → Activations → More Users → More Invites
```

### AARRR Drop-off Diagnostics

| Drop-off Point | Diagnostic Question | Typical Interventions |
|----------------|---------------------|----------------------|
| **Visit → Signup abandoned** | Targeting/messaging problem? Trust gap? | Social proof, clearer value prop, simpler signup |
| **Signup → Activation stalled** | Onboarding friction? Time-to-value too long? | Streamline onboarding, guided tour, quick wins |
| **Activation → Not returning** | First value unclear? No habit trigger? | Value reinforcement, notification timing, use case education |
| **Active → Declining** | Feature fatigue? Competition? Life change? | Feature education, check-in, competitive differentiation |
| **Active → Dormant** | Value not sustained? Need evolved? | Re-engagement content, new feature highlight |
| **Dormant → Churned** | Prevention failed? | Reactivation campaign (see churn cohorts) |
| **Revenue → Downgrade** | ROI not realized? Budget constraint? | ROI review, right-size offer, payment flexibility |
| **Active → No referral** | Not delighted? No mechanism? | NPS follow-up, simplify referral, incentivize |

**Diagnostic Tree: Signup → Activation Stall**

```
User signed up but not activated
 │
 ├─► Never returned after signup?
 │ │
 │ ├─► Email delivered? → Check deliverability
 │ │
 │ └─► Email opened? → Improve subject/timing
 │
 ├─► Returned but didn't complete onboarding?
 │ │
 │ ├─► Where did they drop? → Simplify that step
 │ │
 │ └─► How long was session? → Too complex, simplify
 │
 └─► Completed onboarding but no first action?
 │
 ├─► Did they find the core feature? → Better guidance
 │
 └─► Did they understand the value? → Clearer messaging
```

---

## PLG Funnel (Product-Led Growth)

Product is the primary acquisition and conversion engine. Users discover, try, and buy through the product itself.

### Stages

| Stage | Definition | Key Question | Typical Metrics |
|-------|------------|--------------|-----------------|
| **Visitor** | Arrives at site/product page | How did they find us? | Unique visitors, traffic sources, landing page conversion |
| **Free User** | Signs up for free tier/trial | Did they sign up? | Signup rate, cost per signup, channel attribution |
| **Activated** | Reaches the "aha moment" | Did they experience core value? | Activation rate, time to activate, feature adoption |
| **Converted** | Becomes paying customer | Did they hit the paywall and convert? | Free-to-paid %, trial conversion rate, time to convert |
| **Expanded** | Upgrades or increases usage | Are they getting more value? | Expansion revenue %, seat growth, tier upgrades |
| **Advocate** | Refers others, creates content | Are they bringing new users? | Referral rate, NPS, viral coefficient, UGC volume |

### Best For

- SaaS with self-serve signup
- Freemium products
- Developer tools
- Collaboration tools (network effects)
- Products where value is obvious in first session

### Key Metrics

| Metric | Formula | Healthy Range |
|--------|---------|---------------|
| Signup rate | Visitors → Free Users | 2-10% (depends on traffic quality) |
| Activation rate | Free Users → Activated | 20-40% |
| internal | Activated → Converted | 2-5% (freemium), 15-25% (free trial) |
| Expansion rate | Revenue from upgrades / Starting MRR | >5% monthly |
| Viral coefficient | Invites × invite conversion rate | >0.5 (self-sustaining >1.0) |

### PLG-Specific Anti-Patterns

| internal | Symptom | Fix |
|-------------|---------|-----|
| **Vanity free users** | High signups, <10% activation | Fix onboarding, reduce time to value |
| **Premature paywall** | Low signup → high churn after trial | Move paywall later, expand free tier |
| **No expansion motion** | Flat ARPU over time | Add usage-based pricing, team tiers |
| **Viral loop missing** | Zero organic growth from existing users | Add sharing mechanics, referral incentives |
| **PLG without product readiness** | Product can't sell itself | Fix UX first; PLG requires excellent self-serve experience |

### PLG Drop-off Diagnostics

| Drop-off Point | Diagnostic Question | Typical Interventions |
|----------------|---------------------|----------------------|
| **Visitor → No signup** | Value prop unclear? Too much friction? | Simplify signup, show product in action, reduce form fields |
| **Signup → No activation** | Onboarding too complex? Aha moment unclear? | Guided tour, progressive onboarding, quick wins |
| **Activated → No conversion** | Free tier too generous? Paywall unclear? | Value gating, usage limits, upgrade prompts |
| **Converted → No expansion** | No additional value tiers? No team features? | Usage-based pricing, team plans, premium features |
| **Active → No referral** | No sharing mechanism? Not delightful enough? | Invite flows, referral rewards, collaboration features |

### Channel Alignment for PLG

PLG motions favor channels that drive product discovery and self-serve adoption:

| Channel | PLG Role | Typical Tactic |
|---------|----------|----------------|
| Search engines/GEO | Primary acquisition | Problem-aware content, how-to guides |
| Forums/Communities | Activation + Advocacy | Threading, community engagement, UGC |
| Social media | Awareness + Referral | Organic content, user stories, UGC amplification |
| Mailbox | Activation + Expansion | Onboarding sequences, feature announcements |
| Store/Listing platforms | Acquisition | ASO, G2/Capterra profiles, review management |
| Bounty/Info platforms | Acquisition | Referral programs, affiliate campaigns |

---

## SLG Funnel (Sales-Led / Performance Growth)

Outbound and paid channels drive acquisition. Sales team or performance marketing converts.

### Stages

| Stage | Definition | Key Question | Typical Metrics |
|-------|------------|--------------|-----------------|
| **Impression** | Sees ad, content, or outreach | Did they notice us? | Impressions, reach, CPM |
| **Click** | Engages with the touchpoint | Did they click/respond? | CTR, CPC, response rate |
| **Lead** | Provides contact information | Did they express interest? | CPL, lead volume, form completion rate |
| **MQL** | Meets marketing qualification criteria | Are they a good fit? | MQL rate, lead score, engagement score |
| **SQL** | Sales accepts and engages | Is there real opportunity? | MQL→SQL %, response time, meeting booked rate |
| **Opportunity** | Active deal in pipeline | Are they evaluating us? | Pipeline value, deal velocity, stage progression |
| **Closed-Won** | Signs contract / purchases | Did we win the deal? | Win rate, ACV, sales cycle length, CAC |

### Best For

- B2B enterprise sales
- High-ACV products (>$10K/year)
- Complex products requiring demos
- Regulated industries
- Products with long evaluation cycles

### Key Metrics

| Metric | Formula | Healthy Range |
|--------|---------|---------------|
| CPL | Total spend / Leads | Varies by industry ($5-500) |
| MQL→SQL rate | SQLs / MQLs | 15-30% |
| Win rate | Closed-Won / Opportunities | 15-30% (enterprise), 30-50% (SMB) |
| ACV | Annual contract value | Depends on market |
| Sales cycle | Days from lead to close | 30-90 (SMB), 90-360 (enterprise) |
| CAC payback | Months to recoup CAC | <12 months ideal |

### SLG-Specific Anti-Patterns

| internal | Symptom | Fix |
|-------------|---------|-----|
| **High CPL, low SQL** | Spending on leads that don't convert | Tighten targeting, improve lead scoring |
| **Long cycle, no nurture** | Leads go cold between MQL and SQL | Build nurture sequences, content for each stage |
| **No sales enablement** | Reps create their own materials | Build battle cards, one-pagers, demo scripts |
| **Vanity MQLs** | High MQL count, low pipeline | Tighten MQL criteria, align marketing-sales definitions |
| **Channel concentration** | 80%+ of leads from one channel | Diversify channels, test new acquisition paths |

### SLG Drop-off Diagnostics

| Drop-off Point | Diagnostic Question | Typical Interventions |
|----------------|---------------------|----------------------|
| **Low impressions** | Wrong channels? Budget too low? | Channel testing, budget reallocation |
| **Impression → No click** | Creative not compelling? Targeting off? | A/B test creatives, refine audience targeting |
| **Click → No lead** | Landing page friction? Message mismatch? | LP optimization, message match audit |
| **Lead → No MQL** | Wrong audience? Lead scoring too strict? | Adjust scoring, improve targeting |
| **MQL → No SQL** | Sales follow-up slow? Lead quality poor? | SLA for follow-up, tighten MQL criteria |
| **SQL → No close** | Competitor winning? Pricing? | Win/loss analysis, competitive positioning |

### Channel Alignment for SLG

SLG motions favor channels that drive outbound reach and direct response:

| Channel | SLG Role | Typical Tactic |
|---------|----------|----------------|
| Search engines/GEO | Lead generation | Search ads (Google, Bing), retargeting |
| Social media | Lead generation + Awareness | Paid ads (Meta, LinkedIn, X), UGC amplification |
| Mailbox | Nurture + Conversion | Outbound email sequences, newsletters, transactional |
| SMS | Conversion + Re-engagement | Transaction SMS, campaign SMS, follow-ups |
| News | Awareness + Trust | PR articles, guest-postings, press releases |
| IRL | Relationship + Conversion | Events, conferences, OOH, Point of Sales |
| Forums/Communities | Awareness + Trust | Paid ads (Reddit), sponsored posts |
| Store/Listing platforms | Lead generation | Paid placements, review management |
| Bounty/Info platforms | Lead generation | Incentive campaigns, affiliate deals |

---

## AIDA

Classic marketing funnel for persuasion and purchase decisions.

### Stages

| Stage | Definition | User Mindset | Goal |
|-------|------------|--------------|------|
| **Awareness** | They know you exist | "I've heard of this" | Get noticed |
| **Interest** | They're curious | "This might be useful" | Engage and educate |
| **Desire** | They want it | "I want this" | Build want and urgency |
| **Action** | They buy/convert | "I'm doing it" | Remove friction |

### Best For

- E-commerce
- Direct-to-consumer brands
- One-time purchase products
- Advertising and campaigns
- Short sales cycles

### Stage Details

#### Awareness
User becomes aware of your brand or product.

**Tactics:**
- Brand advertising
- Content marketing
- Social media presence
- PR and media coverage
- Influencer partnerships

**Metrics:**
- Impressions
- Reach
- Brand recall
- Share of voice

#### Interest
User engages and learns more.

**Tactics:**
- Educational content
- Product demos
- Comparison guides
- Email capture
- Retargeting

**Metrics:**
- Time on site
- Pages per session
- Email signups
- Content engagement
- Return visits

#### Desire
User develops preference and intent.

**Tactics:**
- Social proof (reviews, testimonials)
- Case studies
- Limited offers
- Personalization
- Emotional appeals

**Metrics:**
- Add to cart rate
- Wishlist additions
- Product page engagement
- Demo requests
- Intent signals

#### Action
User completes purchase or conversion.

**Tactics:**
- Clear CTAs
- Simplified checkout
- Urgency triggers
- Risk reversal (guarantees)
- Multiple payment options

**Metrics:**
- Conversion rate
- Cart abandonment
- Checkout completion
- Average order value

### AIDA Drop-off Diagnostics

| Drop-off Point | Diagnostic Question | Typical Interventions |
|----------------|---------------------|----------------------|
| **No Awareness** | Reaching wrong audience? Channel mismatch? | Audience research, channel testing, messaging clarity |
| **Awareness → No Interest** | Message not resonating? Wrong positioning? | A/B test messaging, refine value prop, better targeting |
| **Interest → No Desire** | Not enough proof? Trust gap? Price concern? | Social proof, testimonials, risk reversal, comparisons |
| **Desire → No Action** | Friction too high? Urgency lacking? | Simplify checkout, add urgency, reduce risk |
| **Action → Cart abandonment** | Hidden costs? Complexity? Trust at payment? | Transparent pricing, guest checkout, trust badges |
| **Action → Bounce at payment** | Payment issues? Security concerns? | Multiple payment options, security reassurance |

**Diagnostic Tree: Interest → Desire Stall**

```
User engaged with content but didn't express purchase intent
 │
 ├─► Did they view product/pricing pages?
 │ │
 │ ├─► No → Content not moving them down funnel
 │ │ └─► Add CTAs, create bridge content
 │ │
 │ └─► Yes → Something on those pages stopped them
 │ │
 │ ├─► Price page bounce? → Price objection
 │ │ └─► Add social proof, ROI calc
 │ │
 │ └─► Product page bounce? → Trust/fit objection
 │ └─► Add testimonials, comparisons
 │
 └─► Did they return multiple times?
 │
 ├─► Yes → Considering but need push
 │ └─► Retargeting, email nurture, urgency
 │
 └─► No → Lost interest or found alternative
 └─► Win-back content, competitive positioning
```

---

## TOFU-MOFU-BOFU

Content marketing funnel based on buyer journey stages.

### Stages

| Stage | Definition | Content Goal | Content Types |
|-------|------------|--------------|---------------|
| **TOFU** (Top of Funnel) | Awareness | Educate on problem | Blog posts, videos, infographics, social |
| **MOFU** (Middle of Funnel) | Consideration | Educate on solutions | Ebooks, webinars, case studies, comparisons |
| **BOFU** (Bottom of Funnel) | Decision | Enable purchase | Demos, trials, consultations, pricing |

### Best For

- B2B companies
- Long sales cycles
- Complex products
- Content-driven acquisition
- Lead nurturing

### Stage Details

#### TOFU (Top of Funnel)
Attract visitors with valuable, educational content.

**User intent:**
- Problem unaware → Problem aware
- Researching broadly
- Not ready to buy

**Content types:**
| Format | Purpose | Lead capture |
|--------|---------|--------------|
| Blog posts | SEO, education | Low |
| Social posts | Awareness, engagement | None |
| Videos | Education, brand | Low |
| Infographics | Shareability | None |
| Podcasts | Thought leadership | Low |

**Metrics:**
- Traffic
- Social shares
- Time on content
- Email signups

#### MOFU (Middle of Funnel)
Nurture leads with solution-focused content.

**User intent:**
- Solution aware
- Comparing options
- Building consideration set

**Content types:**
| Format | Purpose | Lead capture |
|--------|---------|--------------|
| Ebooks/Guides | Deep education | High (gated) |
| Webinars | Demonstration | High |
| Case studies | Social proof | Medium |
| Comparison guides | Positioning | Medium |
| Email sequences | Nurturing | Already captured |

**Metrics:**
- Lead quality (MQL)
- Content downloads
- Webinar attendance
- Email engagement
- Return visits

#### BOFU (Bottom of Funnel)
Convert leads with decision-enabling content.

**User intent:**
- Product aware
- Ready to decide
- Need final push

**Content types:**
| Format | Purpose | Conversion |
|--------|---------|------------|
| Free trials | Hands-on experience | Direct |
| Demos | Personalized showing | Direct |
| Pricing pages | Enable decision | Direct |
| ROI calculators | Justify investment | Direct |
| Consultations | Answer objections | Direct |

**Metrics:**
- SQL rate
- Demo requests
- Trial signups
- Proposal requests
- Win rate

### TOFU-MOFU-BOFU Drop-off Diagnostics

| Drop-off Point | Diagnostic Question | Typical Interventions |
|----------------|---------------------|----------------------|
| **No TOFU traffic** | Content not ranking? Distribution weak? | SEO audit, content promotion, channel expansion |
| **TOFU → No engagement** | Content not resonating? Wrong topics? | Content quality, topic research, format testing |
| **TOFU → No lead capture** | No CTAs? Wrong offers? | Add lead magnets, improve CTAs, gate valuable content |
| **MOFU: Lead not progressing** | Nurture not working? Content gaps? | Email sequence audit, content mapping, personalization |
| **MOFU → No MQL** | Wrong lead scoring? Content not educating? | Adjust scoring, create comparison content |
| **MQL → No SQL** | Sales follow-up slow? Lead quality poor? | SLA for follow-up, tighten MQL criteria |
| **BOFU: SQL not converting** | Sales process issues? Competitor winning? | Win/loss analysis, sales enablement, competitive intel |
| **BOFU → No close** | Pricing? Decision maker not engaged? | Executive engagement, ROI justification, negotiation |

**Diagnostic Tree: MOFU Lead Not Progressing**

```
Lead captured but not engaging with MOFU content
 │
 ├─► Are nurture emails being opened?
 │ │
 │ ├─► No → Deliverability or subject line issue
 │ │ └─► Check spam, A/B test subjects
 │ │
 │ └─► Yes → Content not compelling enough
 │ │
 │ ├─► Clicks but no action? → CTA/landing issue
 │ │
 │ └─► No clicks? → Content relevance issue
 │ └─► Segment better, personalize
 │
 └─► Are they visiting site independently?
 │
 ├─► Yes → Progressing outside email
 │ └─► Adjust attribution, check other channels
 │
 └─► No → Not actively considering
 └─► Different nurture cadence, re-qualification
```

**Diagnostic Tree: MQL → SQL Conversion Problem**

```
Leads hitting MQL threshold but not converting to SQL
 │
 ├─► Is sales following up quickly?
 │ │
 │ ├─► No → SLA violation
 │ │ └─► Implement SLA, automate routing
 │ │
 │ └─► Yes → Quality or qualification issue
 │ │
 │ ├─► Sales rejecting leads? → MQL criteria too loose
 │ │ └─► Tighten scoring, add qualification
 │ │
 │ └─► Leads not responding? → Timing or channel issue
 │ └─► Multi-channel outreach, timing optimization
 │
 └─► What's the rejection reason pattern?
 │
 ├─► "Not decision maker" → Targeting issue
 │
 ├─► "No budget" → Qualification issue
 │
 └─► "Not interested" → Lead quality or timing issue
```

---

## Custom Funnels

When standard models don't fit.

### When to Customize

- Multiple products/lines
- Complex user journeys
- Marketplace dynamics (two-sided)
- Hybrid business models
- Industry-specific stages

### Building a Custom Funnel

1. **Map the actual user journey**
 - Interview customers
 - Analyze behavior data
 - Identify key decision points

2. **Define stage entry criteria**
 - What action moves someone to this stage?
 - What data captures this?

3. **Choose stage metrics**
 - What indicates success at this stage?
 - What indicates failure/drop-off?

4. **Validate with data**
 - Do users actually follow this path?
 - Are stages distinct and meaningful?

### Example: Marketplace Funnel

For a two-sided marketplace:

**Supply side (Sellers):**
```
Discover → Apply → Onboard → First Sale → Active → Power Seller
```

**Demand side (Buyers):**
```
Visit → Browse → First Purchase → Repeat Purchase → Loyal
```

**Platform metrics:**
- Liquidity (supply meeting demand)
- Match rate
- Time to first transaction

---

## Funnel Model Comparison

| Aspect | PLG | SLG | AARRR | AIDA | internal |
|--------|-----|-----|-------|------|----------------|
| Focus | Product as growth engine | Outbound + paid performance | Product + Growth | Marketing + Sales | Content + Leads |
| Stages | 6 | 7 | 5 | 4 | 3 |
| Primary motion | Self-serve adoption | Outreach + conversion | Product lifecycle | Campaign | Buyer journey |
| Best metric | Activation rate | Win rate / CAC | Retention | Conversion | Lead quality |
| Optimization | Product UX, onboarding | Targeting, sales process | Product changes | Messaging | Content strategy |
| Team ownership | Product/Growth | Sales/Performance Marketing | Growth/Product | Marketing | Marketing/Content |
| Channel emphasis | SEO, community, forums, referral | Paid ads, email, IRL, SMS, PR | All channels | internal | internal |

---

## Choosing the Right Model

Ask these questions:

| Question | If Yes → Model |
|----------|----------------|
| Does the product sell itself with minimal human touch? | **PLG** |
| Is there a free tier or freemium model? | **PLG** or AARRR |
| Is the ACV >$10K and requires demos/sales? | **SLG** |
| Does the business rely on outbound and paid channels? | **SLG** |
| Is retention critical to unit economics? | AARRR |
| Is the purchase decision quick (<1 week)? | AIDA |
| Is the sales cycle long (>30 days)? | TOFU-MOFU-BOFU or **SLG** |
| Is content the main acquisition channel? | internal |
| Is it a one-time purchase? | AIDA |
| Is there a human sales team closing deals? | **SLG** or TOFU-MOFU-BOFU |

### Hybrid Models

Many businesses combine models:
- **PLG + SLG:** Self-serve for SMB + sales-assisted for enterprise (common in SaaS). Track both funnels independently with shared revenue targets.
- **PLG + AARRR:** PLG funnel stages map closely to AARRR. Use PLG when the motion is explicitly product-led; use AARRR for general product analytics.
- **SLG + TOFU-MOFU-BOFU:** SLG for outbound, TOFU-MOFU-BOFU for inbound content. Common in B2B with both marketing and sales motions.

When choosing a hybrid, designate one model as primary (for target-setting) and the other as supplementary (for diagnostics).
