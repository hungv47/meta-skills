# Worked Example — B2B SaaS Project Management Tool (Route B)

> End-to-end campaign-plan walkthrough — Pre-Dispatch → Layer 1 (pillar) → Layer 2 (angle → channel → timeline → launch) → critic gate → artifact.

[EXAMPLE] — load on first-time skill-author orientation or when reviewer needs to ground-check a dispatch decision.

For 5 additional verticals (DTC, agency, B2B service, consumer marketplace, info product), see [`../examples.md`](../examples.md).

---

## Setup

**Product:** Async-first project management SaaS for engineering teams. $40/mo per seat, 14-day free trial.

**Audience:** Engineering managers at 50-200 person companies. Awareness distribution: 60% Problem Aware (know status meetings are inefficient), 30% Solution Aware (researching async tools), 10% Product Aware (comparing competitors).

**Goal:** Drive 500 trial signups in 60 days.

**Growth motion:** PLG. Product self-serve via 14-day trial; signups drive activation, not sales conversations.

**Team:** 3-person marketing team (1 PM, 1 content, 1 paid). Budget: $20k/mo paid social experimentation.

**Constraints:** No competitor-naming in content (legal). No "AI-powered" framing (founder mandate). Cadence target: 5-7 pieces/week.

---

## Step 0 — Pre-Dispatch (orchestrator)

Reads `research/product-context.md` + `research/icp-research.md` + `docs/forsvn/experience/business.md`. Resolves 5 of 6 dimensions from artifacts; probes for campaign goal + cadence + constraints (the constraint detail above came from Cold Start question 5).

**Confirm beat:**
```
Confirmed for dispatch:
- Product: Async-first PM SaaS, $40/seat, 14-day trial
- Audience: Eng managers, 50-200 person co's, status-meeting-tax pain
- Campaign goal: 500 trial signups in 60 days
- Growth motion: PLG (product self-serve via trial)
- Duration + cadence: 60 days, 5-7 pieces/week
- Constraints: no competitor names, no "AI-powered", 3-person team, $20k/mo paid

Dispatching pillar-agent (Layer 1). Will sequence angle → channel → timeline → launch → critic.
```

Orchestrator writes Growth Motion section inline before dispatching:

```markdown
## Growth Motion
- **Motion:** PLG
- **Primary acquisition lever:** product (14-day free trial drives signup → activation)
- **Channel weighting rationale:** PLG favors Search/AEO (intent capture), Forums/Communities (peer recommendation), Social organic (proof + showcase). De-weights paid Mailbox + IRL (low ROI for self-serve trial CTR at this price point).
```

---

## Layer 1 — Pillar Agent

Returns 4 pillars (within 3-5 range):

| # | Pillar | Type | % | Stage | Evidence |
|---|--------|------|---|-------|---------|
| 1 | "The meeting tax" | Problem | 35% | Problem Aware | VoC: "I spend 12 hours/week in status meetings"; pain quote from ICP §3.2 |
| 2 | "Async-first shipping" | Transformation | 30% | Solution Aware | Aspiration quote: "want async like Linear has"; ICP §4.1 buying criteria |
| 3 | "Teams who switched" | Trust | 25% | Product Aware | Top buying criterion: "case studies of engineering teams"; ICP §5.3 |
| 4 | "The async-first movement" | Social | 10% | All | Trend signal: "async-first" Google search +180% YoY |

Pillar % sums to 100. Each row names an ICP evidence source. Critic-agent's Gate 2 ("Pillar evidence") will pass.

---

## Layer 2, Step 1 — Angle Agent

Returns 12 angles across 4 pillars (3 per pillar, all scoring ≥15/25). Sample:

| # | Angle | Hook | Stage | Trigger | Score | Class | Pillar |
|---|---|---|---|---|---|---|---|
| 1 | "12 hrs/week lost to status theater" | Data | Problem Aware | Fear | 22 | Shareable | The meeting tax |
| 2 | "Why your standup is your slowest meeting" | Contrarian | Problem Aware | Curiosity | 19 | Authoritative | The meeting tax |
| 3 | "The hidden cost of synchronous coordination" | Story | Problem Aware | Fear | 17 | Authoritative | The meeting tax |
| 4 | "How to ship 2x without hiring" | How-to | Solution Aware | Greed | 20 | Searchable | Async-first shipping |
| 5 | "The async-first checklist (no tools required)" | How-to | Solution Aware | Belonging | 18 | Searchable | Async-first shipping |
| 6 | "Why Stripe's PR template works asynchronously" | Story | Solution Aware | Pride | 16 | Authoritative | Async-first shipping |
| 7 | "Engineering team at [redacted] cut meetings 60%" | Story | Product Aware | Hope | 21 | Conversational | Teams who switched |
| 8 | "Before/after: 8 hours/week back per engineer" | Data | Product Aware | Greed | 19 | Shareable | Teams who switched |
| 9 | "Why we switched after 3 years on Jira" | Story | Product Aware | Curiosity | 17 | Conversational | Teams who switched |
| 10 | "The async-first principles 100+ teams ship by" | Authority | All | Belonging | 20 | Authoritative | The async-first movement |
| 11 | "Async week: 5-day challenge" | Listicle | All | Belonging | 18 | Shareable | The async-first movement |
| 12 | "GitLab, Automattic, Doist: how async at scale works" | Story | All | Pride | 17 | Authoritative | The async-first movement |

Every angle names its parent pillar. No orphan angles. Critic Gate "Internal Consistency 1" will pass.

---

## Layer 2, Step 2 — Channel Agent

Evaluates all 9 channels against PLG priority + habitat data. Returns:

| Channel | Type | Angle | Role | Cadence |
|---------|------|-------|------|---------|
| Search engines/AEO | Owned | #4 "How to ship 2x without hiring" + #10 "Async-first principles" | Primary | 2 articles/week |
| Social media (LinkedIn) | Rented | #1 "12 hrs/week lost to status theater" | Primary | 3 posts/week |
| Social media (X/Twitter) | Rented | #7 "Teams who switched" | Secondary | 5 posts/week |
| Forums/Communities (HN, r/engineering_management) | Borrowed | #2 "Why your standup is your slowest meeting" | Supporting | 1 thread/week |
| Mailbox (newsletter) | Owned | #4 + #5 "Async-first checklist" | Secondary | 1 email/week |

**Skipped (with rationale, all 4 remaining channels):**
- Store/Listing platforms: Skipped — PLG signup is direct, no app-store dependency
- Bounty/Info platforms: Skipped — B2B SaaS doesn't fit Whop/Zagged consumer ecosystem; consult `distribution-models/clipping-and-live.md` for criteria
- News: Skipped — PR-driven; campaign too short (60 days) for press cycle; reconsider in Sustain phase
- IRL: Skipped — budget allocation doesn't support event activation; high CAC vs PLG trial
- SMS: Skipped — B2B trial signup, no SMS opt-in workflow

All 9 channels accounted for. Critic Gate 7 + anti-pattern #7 ("Skipping the 9-channel evaluation") will pass.

---

## Orchestrator writes Channel Execution Briefs inline

| Channel | Objective | Tactic | Budget Type | Success Metric | Owner | First Milestone |
|---|---|---|---|---|---|---|
| Search engines/AEO | Capture "async PM tool" intent traffic | Google Search ads on bottom-funnel keywords + SEO content for "async-first" how-to terms | Paid + Organic | CTR ≥ 1.5% paid; SEO traffic ≥ 2k/mo by W6 | Paid marketer | First paid campaign live by W2; first SEO article published by W1 |
| LinkedIn | Authority + Problem-Aware reach | Founder POV posts + data-driven carousels on meeting tax | Organic + Paid amp | Engagement rate ≥ 3% organic; CPL ≤ $40 paid | Content lead | First post live by W1; first paid amp by W3 |
| X/Twitter | Conversation + Product-Aware proof | Threads on customer stories + reply engagement in async community | Organic | Followers +25% by W8; thread CTR ≥ 2% | PM | First thread by W1; first customer reply by W2 |
| Forums (HN, Reddit) | Peer validation + community trust | High-quality response in async-tool discussions; no product mention until asked | Bartered (time) | 1 top-comment HN thread by W4; 3 Reddit upvotes >50 | PM | First response by W1; HN post by W4 |
| Mailbox (newsletter) | Solution-Aware nurture | Weekly "async-first principles" series + product progress | Organic | Open rate ≥ 35%; CTR to trial ≥ 8% | Content lead | First newsletter by W1; trial-CTA optimized by W3 |

---

## Layer 2, Step 3 — Timeline Agent

Returns 3 phases over 60 days, cadence 5-7 pieces/week across all channels:

| Phase | Weeks | Content Focus | Pillar Mix |
|---|---|---|---|
| **Pre-launch** | W1-W3 | Problem content — meeting tax, hidden costs of sync | Pillar 1 (40%), Pillar 4 (20%), Pillar 2 (40%) |
| **Launch** | W4-W5 | Transformation + product proof | Pillar 2 (40%), Pillar 3 (50%), Pillar 1 (10%) |
| **Sustain** | W6-W8 (60d total) | Trust + social — case studies, community proof | Pillar 3 (40%), Pillar 4 (30%), Pillar 1 (15%), Pillar 2 (15%) |

Cadence calibration: 5-7 pieces/week × 3 channels primary + 2 secondary = ~6-8 pieces/week realistic for 3-person team. Within capacity. Pillar rotation: no pillar dominates >2 consecutive weeks. Critic Gate 9 + 10 + 11 will pass.

---

## Layer 2, Step 4 — Launch Sequencing Agent

Returns 5-phase ORB sequence:

| Phase | Timing | Channels | Action |
|---|---|---|---|
| Internal | T-4w | Owned (team Slack, advisors) | Brief team + advisors on campaign theme; capture quotes for content |
| Email list alpha | T-2w | Owned (newsletter) | Soft-launch "meeting tax" series to existing list; gather early reactions |
| Partner posts | T-1w | Rented (X/LinkedIn) | 3 partner posts (advisors + alpha users) seeding "async-first" angle |
| Public launch | Day 0 | Rented (LinkedIn + X) + Owned (SEO + newsletter) | Full launch — Pillar 1 hero post on LinkedIn, X thread, newsletter blast |
| PR + paid amp | T+1w | Borrowed (HN, podcast pitch) + Paid (Search, LinkedIn amp) | HN Show-HN post if traction; paid campaigns activate for amplification |

ORB order honored (Owned → Rented → Borrowed). Critic Gate 11 will pass.

---

## Critic Agent → PASS

Returns:

```markdown
## Verdict: PASS

### Quality Checklist
- [x] 3-5 pillars, each with ICP evidence (4 pillars, all sourced)
- [x] 3+ angles per pillar, each passing 3Q test (12 angles, all ≥15/25)
- [x] Angles scored ≥15/25 (lowest score 16)
- [x] Each channel has ONE specific angle (no "content about productivity")
- [x] Channel selection based on ICP habitat data (PLG priority lens applied + skip rationale on all 4 skipped channels)
- [x] Owned channels prioritized (ORB framework — owned launches first)
- [x] Timeline has 3 phases (Pre-launch / Launch / Sustain)
- [x] Content mix percentages realistic for team capacity (6-8 pieces/week for 3-person team)
- [x] Pillar rotation visible in calendar (no pillar >2 consecutive weeks)
- [x] Launch sequence follows ORB (Internal → Email alpha → Partner → Public → PR + paid)

### Internal Consistency Check
- [x] Every angle traces back to a pillar (verified per row)
- [x] Every channel assignment traces back to habitat data (verified per row)
- [x] Timeline phases match awareness progression (Pre-launch=Problem, Launch=Trans+Trust, Sustain=Trust+Social)
- [x] Launch sequence matches channel activation order (Owned ships first; paid last)

### Notes
Strong PLG plan. Pillar 4 ("The async-first movement") is the weakest at 10% — could be cut to a 3-pillar plan if team capacity gets tighter, but currently it adds Belonging-trigger angles that the other pillars don't. Worth keeping for the launch + sustain phases specifically.
```

---

## Orchestrator writes artifact

Per `format-conventions.md`. Frontmatter:

```yaml
---
skill: plan-campaign
version: 1
date: 2026-05-18
status: done
campaign_name: "Async-first PM tool — Q2 trial drive"
goal: "500 trial signups in 60 days"
audience: "Engineering managers, 50-200 person companies"
growth_motion: PLG
team_size: 3
budget_tier: "$20k/mo paid"
duration_days: 60
---
```

Status: `done` — full critic PASS on cycle 1, no carry-over concerns.

Delivered to user with one-line summary: "Campaign plan for 500 trial signups in 60 days, PLG motion, 4 pillars + 12 angles + 5 selected channels + ORB launch sequence. Critic PASS cycle 1."

---

## Cycle-2 FAIL hypothetical (if critic had failed)

If critic-agent had returned (hypothetically):

> **Verdict: FAIL**
>
> Failure 1:
> - Component: angles
> - Issue: Angle #2 ("Why your standup is your slowest meeting") and Angle #3 ("The hidden cost of synchronous coordination") are both Contrarian-leaning Problem-Aware angles for the same pillar — Hook Type diversity within Pillar 1 is too low (2 of 3 angles overlap).
> - Fix: re-derive Pillar 1's angles with 3 distinct Hook Types (Data + Contrarian + Story/How-to mix). Specifically: keep #1 (Data); replace #3 with a How-to angle ("How to replace your standup in 3 weeks").
> - Agent to re-dispatch: **angle-agent**

Orchestrator re-dispatches angle-agent with the Critic Feedback appended; angle-agent returns revised angles for Pillar 1; orchestrator re-assembles + re-dispatches critic-agent. Cycle 2 PASS → ship as `done`.

---

## Route C snippet — campaign-plan called by lp-brief

When `brief-landing-page` calls campaign-plan via Route C (read-then-fall-through-to-Route-B):

1. lp-brief invokes orchestrator with: "Need campaign context for landing page on async-first messaging."
2. Orchestrator reads `docs/forsvn/artifacts/marketing/campaign-plan.md` — present + date 2026-05-18 (today) → return.
3. lp-brief extracts: Pillar 2 ("Async-first shipping") + Angle #4 ("How to ship 2x without hiring") + Channel "Search engines" → uses these to anchor hypothesis + section spec.
4. lp-brief writes its brief at `docs/forsvn/artifacts/marketing/brief-landing-page/async-shipping-lp/brief.md` with `consumed: [docs/forsvn/artifacts/marketing/campaign-plan.md]` in frontmatter.

If campaign-plan.md were missing or stale (>30 days), Route C falls through to Route B (run full campaign-plan first) — lp-brief waits.
