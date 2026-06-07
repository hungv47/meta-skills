# ICE Scoring Rubric

Calibration guide for scoring initiatives on Impact, Confidence, and Ease.

---

## Overview

ICE scoring is a prioritization framework from Sean Ellis's growth hacking methodology. Each initiative is scored 1-10 on three dimensions, then ranked by total score.

**Formula:** ICE Score = Impact + Confidence + Ease (sum, not product — avoids extreme weighting)

Some teams use the product (I × C × E) instead. Either works, just be consistent. The sum is more forgiving and prevents a single low score from killing an otherwise good idea.

---

## Dimension 1: Impact

*"If this works, how much will it move the target metric?"*

| Score | Label | What It Means | Example |
|-------|-------|---------------|---------|
| 1-3 | Low | Minor improvement, barely noticeable | +1-2% improvement on a secondary metric |
| 4-6 | Medium | Meaningful improvement, worth noting | +5-15% on target metric, or solves a real pain point |
| 7-8 | High | Significant improvement, changes the trajectory | +20-50% on target metric, unlocks a new channel |
| 9-10 | Transformative | Step change, fundamentally different outcome | 2x+ improvement, opens entirely new growth vector |

**Calibration tips:**
- Score against the *specific target metric*, not general "growth"
- Consider both magnitude and duration — a permanent 5% lift > a temporary 20% spike
- Be honest about the delta between "best case" and "likely case." Score for likely case.

---

## Dimension 2: Confidence

*"How sure are we that this will work?"*

| Score | Label | What It Means | Example |
|-------|-------|---------------|---------|
| 1-3 | Guess | No data, no precedent, pure gut feeling | "I think this could work because..." |
| 4-6 | Informed opinion | Some supporting data or analogies | Competitor did something similar, partial test results |
| 7-8 | internal | Direct data supports this approach | Past A/B test won, user research confirms demand |
| 9-10 | internal | Strong evidence, proven playbook | Exact tactic worked before in same context, industry benchmark |

**Calibration tips:**
- Ask: "What evidence would move my confidence up or down by 2 points?"
- Distinguish between confidence in the *approach* vs. confidence in the *execution*
- First-time tactics should rarely score above 5 unless backed by strong user research
- Prior success in a *different* context = 5-6, not 8-9

---

## Dimension 3: Ease

*"How easy is this to execute?"* **Score on AI-assisted effort, not raw human-team weeks** — see `skills/CLAUDE.md` § "Effort compression." AI compresses build time, so a feature build that reads as "weeks" for a human team is hours-to-days AI-assisted. Reserve the low band for what AI can't compress (human/external coordination, real-world validation windows).

| Score | Label | What It Means (AI-assisted effort) | Example |
|-------|-------|---------------|---------|
| 1-3 | Hard | Gated by human/external coordination, not by code — AI can't compress it | New enterprise sales motion (6-mo cycle, legal/security); anything blocked on a partner or approval |
| 4-6 | Moderate | A real build AI-assisted in days, with design/validation iteration | A multi-surface feature needing UX iteration + a validation window |
| 7-8 | Easy | A bounded build AI compresses to hours/days | Native connector/integration, in-app guided flow, schema-mapping logic |
| 9-10 | Trivial | Config/copy, no real build | Copy change, feature-flag flip, configuration tweak |

**Calibration tips:**
- Score AI-assisted effort: a feature/connector build is Ease 7-8 (days AI-assisted), not 2-3 ("a month of engineering"). A build that fixes the primary root cause should not score below a trivial tweak.
- The low band (1-3) is for human/external coordination and real-world time — AI does not compress a 6-month sales cycle or a partner negotiation.
- Account for review/approval cycles and real dependencies — a task that requires 3 teams to align is not easy.
- Consider opportunity cost — what else could the team do instead?

---

## Scoring Process

### Step 1: Individual Scoring

Each person scores independently before discussion. This prevents anchoring bias.

### Step 2: Discuss Outliers

Where scores differ by 3+ points, discuss why. Often reveals hidden information or assumptions.

### Step 3: Align on Final Score

Agree on a single score per dimension. Document the reasoning, not just the number.

### Step 4: Rank and Cut

Sort by total ICE score. Draw a line based on available capacity — top initiatives above the line proceed to planning.

---

## Scored Examples

### Example 1: SEO Content Hub (30 articles targeting bottom-funnel keywords)

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Impact | 7 | Could drive +30% organic signups based on keyword volume analysis |
| Confidence | 6 | Competitors rank for these terms; we have domain authority. Haven't tested this specific approach. |
| Ease | 4 | Needs content writer, SEO specialist, 3-month timeline to see results |
| **Total** | **17** | |

### Example 2: Referral Program (give $20 credit for referring a new customer)

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Impact | 6 | Based on industry benchmarks, ~10% of users refer. Could add 500 users/month. |
| Confidence | 5 | Standard tactic but we don't know our users' referral propensity yet |
| Ease | 7 | Simple to build, mostly in-product. 2-week eng sprint. |
| **Total** | **18** | |

### Example 3: Homepage Copy Rewrite (A/B test new value proposition)

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Impact | 5 | Could improve signup conversion by 10-20% but only affects homepage visitors |
| Confidence | 7 | We have VoC data showing current messaging doesn't resonate. Clear hypothesis. |
| Ease | 9 | Copy only. One person, 2-3 days, no eng needed. |
| **Total** | **21** | |

### Example 4: Enterprise Sales Motion (hire SDR, build outbound pipeline)

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Impact | 9 | Enterprise deals are 10x ACV. 5 deals would double revenue. |
| Confidence | 3 | We've never sold enterprise. No playbook, no case studies, different buyer. |
| Ease | 2 | Hire new role, build collateral, 6+ month sales cycle, legal/security requirements |
| **Total** | **14** | |

---

## Common Pitfalls

1. **Scoring everything 5-7** — If all scores cluster in the middle, the ranking is meaningless. Force differentiation by asking "Is this really as easy as X?" or "Would we bet money on this?"

2. **Confidence ≠ Enthusiasm** — "I'm excited about this" is not the same as "I have evidence this works." Separate feelings from data.

3. **Ignoring negative ease** — Some initiatives actively make other things harder (tech debt, support burden). Factor in total cost, not just direct effort.

4. **Not revisiting scores** — ICE scores should be updated as you learn more. A 5 confidence can become a 7 after a successful small test.

5. **Ease on human-team weeks** — Scoring a build Ease 2-3 because it's "a month of engineering." Score AI-assisted effort; a feature/connector build is days (Ease 7-8). A trivial high-Ease tweak outscoring the primary-root-cause build is a red flag — re-check Ease realism and Impact weighting, not a result to ship.
