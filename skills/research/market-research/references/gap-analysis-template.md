# Gap Analysis & Opportunity Scoring

Framework for synthesizing market research into prioritized opportunities. Raw research data becomes actionable through structured gap identification and scoring.

## Gap Identification Process

### Step 1: Collect Signals

Gather gap signals from all research phases:

| Signal Type | Source | What to Look For |
|-------------|--------|-----------------|
| **User complaints** | Reviews, forums, support threads | "I wish...", "Why can't...", "The worst part is..." |
| **Switching reasons** | G2 reviews, Reddit threads | "We switched because...", "Moved from X to Y because..." |
| **Feature requests** | Product forums, GitHub issues | Most upvoted/requested features that don't exist |
| **Workarounds** | Tutorials, Stack Overflow, Reddit | Manual processes that should be automated |
| **Competitor blind spots** | Feature matrix gaps | Capabilities no one offers or all handle poorly |
| **Pricing friction** | Review complaints, forum discussions | "Too expensive for...", "Not worth it unless..." |
| **Positioning overlaps** | Competitor positioning analysis | Areas where everyone clusters, leaving edges open |

### Step 2: Categorize Gaps

Sort each signal into one of four gap types:

| Gap Type | Definition | Example |
|----------|-----------|---------|
| **Underserved Segment** | A user group that existing solutions poorly serve | Solo developers priced out of team-oriented tools |
| **Feature Gap** | A capability users need that's missing or poorly implemented | No tool offers multi-repo context in code review |
| **Trend Gap** | A market shift creating needs that incumbents haven't addressed | AI-native workflows replacing legacy integrations |
| **Positioning Gap** | A positioning space that no competitor occupies | No "developer-first" option in an enterprise-dominated market |

### Step 3: Validate Each Gap

Before scoring, validate that each gap is real (not just your assumption):

| Validation Check | Question | Red Flag |
|-----------------|----------|----------|
| **Demand evidence** | Do users actually want this? | Gap identified only from feature matrix, no user signal |
| **Willingness to pay** | Would users pay for this? | Users want it but call it "table stakes" (expects it free) |
| **Timing** | Is the market ready? | Technology exists but adoption barriers are high |
| **Persistence** | Will this gap remain? | A major player announced this feature for next quarter |
| **Fit** | Can you credibly fill this gap? | Gap exists but requires capabilities outside your team's expertise |

## Opportunity Scoring

### Scoring Dimensions

Score each opportunity 1-5 on four dimensions:

| Dimension | 1 | 3 | 5 |
|-----------|---|---|---|
| **Demand Evidence** | Single blog post or guess | Multiple forum threads or a few reviews | Strong signal from multiple independent sources + quantified demand |
| **Competition** | Multiple well-funded competitors actively building this | 1-2 competitors with partial solutions | No competitor addresses this; workarounds dominate |
| **Window** | Competitor launching this quarter | 12-18 months before likely competitive response | 24+ months — structural barrier to competitor entry |
| **Fit** | Requires entirely new capabilities | Adjacent to current strengths, moderate stretch | Direct extension of existing product and team strengths |

### Scoring Table

| # | Opportunity | Demand (1-5) | Competition (1-5) | Window (1-5) | Fit (1-5) | Total | Notes |
|---|------------|-------------|-------------------|-------------|----------|-------|-------|
| 1 | [Opportunity] | [Score + evidence] | [Score + evidence] | [Score + evidence] | [Score + evidence] | [Sum] | [Key risk] |

### Ranking Rules

1. **Total score breaks most ties** — highest total = highest priority
2. **Demand is the tiebreaker** — equal totals → higher demand score wins
3. **Zero on any dimension is disqualifying** — a perfect-fit opportunity with no demand evidence is still a guess
4. **Flag any score of 1** — an opportunity with a 1 in any dimension needs a clear mitigation plan

## Risk Assessment

For each top opportunity, document:

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Competitor response** | How likely a competitor builds this in 6 months | Market impact if they do | Speed advantage, structural moat, or differentiation angle |
| **Demand misjudgment** | How confident are we in demand evidence | Wasted effort if demand is lower | Minimum viable test before full commitment |
| **Execution complexity** | Technical or operational difficulty | Timeline and cost overrun | Staged approach, de-risk with prototype |
| **Market timing** | Risk of being too early or too late | Adoption barriers or competitive closure | Signals to watch for timing adjustment |

## Output Format

### Top 3 Opportunities (Template)

#### Opportunity 1: [Name]

**Statement:** [One sentence describing the opportunity]

**Evidence:**
- [Source 1]: [What it shows]
- [Source 2]: [What it shows]
- [Source 3]: [What it shows]

**Scores:** Demand: [X] | Competition: [X] | Window: [X] | Fit: [X] | **Total: [X]**

**Window:** [How long this opportunity stays open and why]

**Risk level:** [Low/Medium/High] — [Primary risk and mitigation]

**Why now:** [What makes this timely — trend, competitor gap, technology enabler]

**Next step:** [Specific action to validate or capture this opportunity]
