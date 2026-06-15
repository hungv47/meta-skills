---
title: Copywriting — End-to-End Walkthrough (Route B, full-page landing copy)
lifecycle: canonical
status: stable
produced_by: copywriting
load_class: EXAMPLE
---

# Copywriting — End-to-End Walkthrough

**Load when:** an operator (human or agent) wants a complete trace of how a Route B (full-page landing copy) artifact gets produced — Pre-Dispatch → Layer 1 parallel section writers → Merge → variant-agent → Layer 2 sequential craft refiners → critic PASS → deliver.

This walkthrough covers Route B (operator slash-command for a full landing page). Route A (single key line) dispatches one Layer 1 agent + critic only — short snippet at the end. Route C (called by lp-brief or campaign-plan) follows Route B mechanics but skips the standalone artifact file (calling skill embeds copy + annotations directly in its own artifact) — short snippet at the end.

---

## Scenario

- **Input:** Landing page for StatusZero, a tool that replaces standups with async status updates.
- **Audience:** Engineering managers at 50-200 person companies, problem aware.
- **Traffic:** LinkedIn ads (cold).
- **Operator invocation:** `/write-copy` for full landing page, with the 7-question Cold Start answers inline.

---

## Step 0 — Pre-Dispatch

Orchestrator reads in order:

1. `references/research-workflow.md` → 4-phase argument research SOP (Research Doc → Avatar & Offer Brief → Belief Engineering → Unique Mechanism)
2. `research/icp-research.md` → CFO + engineering-manager personas; VoC pain phrase "status theater" used 9x in interviews
3. `research/product-context.md` → voice adjectives "direct, technical, dry"; Unique Mechanism "async status broadcast" persisted
4. No `docs/forsvn/artifacts/marketing/campaign-plan.md` (standalone landing page, not part of broader campaign)

**Resolved Cold Start answers (operator confirmed warm-start summary):**

1. **Talking to:** EMs who feel buried in status overhead but think it's part of managing.
2. **Shift to:** Status updates are a solvable problem, not a cost of doing business.
3. **Only we can say:** Internal data shows 12 hrs/week lost to status theater.
4. **Unique Mechanism:** Async status broadcast — engineer commits a status snippet into PR description, tool aggregates to a daily team digest with no meeting.
5. **Traffic context:** LinkedIn ad click — cold, haven't searched, hook must interrupt.

**Write-back:** voice adjectives already in product-context.md; Unique Mechanism already persisted; shift + belief sequence new — appended to experience/goals.md (`Goals — copy shift: landing`, `Goals — copy belief sequence: landing`).

---

## Step 1 — Layer 1 dispatch (parallel)

Orchestrator spawns 4 agents in one message (multiple Agent tool calls):

**Hook Agent receives** brief + pre-writing + reads `headline-formulas.md` + `research-workflow.md` + `emotional-triggers.md` (TOF) + `belief-disruption.md` (problem-aware, not unaware, but reads for tribal-belonging lever).

**Hook Agent returns** 5 headline variations + recommendation:

> Selected: "Your team loses 12 hours a week to status updates nobody reads." (V:5 F:5 U:4 — avg 4.7)
> Cut alternative: "Stop running standups. Ship faster." — abstract benefit, fails V:3 F:2.
> Alternative A: "I cut meetings 80%. Output doubled." (V:4 F:4 U:3) — story hook variant.
> Alternative B: "Standups are theater. Here's what teams ship without them." (V:4 F:3 U:4) — disruption variant.

**Body Agent receives** brief + pre-writing + reads `page-sections.md` + `research-workflow.md`.

**Body Agent returns** Problem (status theater pain — quantified at 12 hrs/week per pre-writing Q3) + Solution (async status broadcast — Unique Mechanism named in second sentence) + How It Works (3 steps: commit to PR → aggregator runs → daily digest at 9am). Body Agent chose Awareness-building narrative (Problem → Solution → How It Works) because audience is problem-aware (per pre-writing Q1) — Direct-Response 6 Necessary Beliefs would over-persuade.

**CTA Agent receives** brief + pre-writing.

**CTA Agent returns** Hero CTA ("See how teams ship without status theater →" — V:4 F:3 U:4) + Mid-page CTA ("Try StatusZero with your team this week") + Final CTA ("Start your free 14-day trial — no credit card") with risk reversal.

**Social Proof Agent receives** brief + pre-writing + available proof points + reads `page-sections.md` + `discovery-story.md` + `lead-magnet-stack.md` (FOMO layer 1-2).

**Social Proof Agent returns** Logo bar (4 tech companies — Linear, Vercel, Stripe, Ramp) + 2 testimonials with metrics ("Saved my team 14 hours/week" — Engineering Director, Vercel; "Replaced our 9am standup permanently" — VP Eng, Linear) + key stat ("Teams using StatusZero ship 1.8x more story points per sprint").

All 4 return.

---

## Step 2 — Merge (orchestrator assembles)

Orchestrator slots Layer 1 outputs into the **Awareness-building narrative** template (body-agent chose this architecture):

| Section | Owner | Content |
|---------|-------|---------|
| Hero | Hook + CTA | "Your team loses 12 hours a week to status updates nobody reads." + sub-head + Hero CTA |
| Social Proof Bar | Social Proof | Linear / Vercel / Stripe / Ramp logos |
| Problem | Body | Status theater section (12 hrs/week loss) |
| Solution | Body | Async status broadcast section (Unique Mechanism named) |
| How It Works | Body | 3-step explainer |
| Testimonials | Social Proof | Vercel ED + Linear VP Eng |
| Mid-Page CTA | CTA | "Try StatusZero with your team this week" |
| Key Stats | Social Proof | "1.8x more story points per sprint" |
| Final CTA + Risk Reversal | CTA | "Start your free 14-day trial — no credit card" |

Merge is deterministic — no creative synthesis. Hook-anchored: body's Problem section was already aligned (12 hrs/week matches Hero's claim); no conflict resolution needed.

---

## Step 3 — Dispatch variant-agent

Orchestrator dispatches variant-agent with assembled document as `upstream`.

**variant-agent returns** A/B alternatives for high-leverage sections:

- **Hero — Variant B:** "I cut meetings 80%. Output doubled." (story hook vs. selected data hook) — Hypothesis: cold LinkedIn audience may respond better to first-person specific outcome than third-person aggregate stat. Test priority: high.
- **Final CTA — Variant B:** "Try StatusZero free — no credit card, cancel anytime" (specificity vs. risk-first framing). Hypothesis: cold audience needs risk-reversal language up-front, not buried. Test priority: medium.

Variants APPENDED to artifact in `## A/B Variants` section (do not replace originals).

---

## Step 4 — Layer 2 dispatch (sequential)

### 4a — voice-agent

voice-agent receives merged + varianted document. Strips 3 AI patterns:
- Removed em-dash in Solution section (replaced with comma)
- Removed "leverage" in How It Works step 2 (replaced with "use")
- Removed "industry-leading" in Social Proof Bar caption (deleted)
- Tone adjusted to "direct, technical, dry" per voice adjectives.

Returns modified document + change log (3 edits).

### 4b — psychology-agent

psychology-agent receives voice-agent output + reads `emotional-triggers.md`.

**Trigger density count:**
- Identity Validation ("Your team" — EM identity) ✓
- Productive Discomfort ("12 hours a week... nobody reads" — surfaces hidden cost) ✓
- Aspiration+Believability ("ship 1.8x more story points" — measurable + plausible) ✓

3 triggers fired — within 3-4 target band. NO ADD needed.

Adds 2 "which means..." bridges to features in How It Works section (Specificity pass on body). Strengthens emotion in Problem section by quantifying the meta-cost ("12 hrs/week × $150/hr fully-loaded = $94k/year/team in pure status theater").

Returns modified document + change log (3 edits).

### 4c — zero-risk-agent

zero-risk-agent receives psychology-agent output.

- Adds "No credit card required" near Hero CTA (conversion-point)
- Adds "Cancel anytime" near Final CTA (conversion-point)
- Does NOT add risk-reversal to Mid-Page CTA (it's an info-grab, not a conversion-point)

Returns modified document + change log (2 edits).

### 4d — critic-agent

critic-agent receives zero-risk output + reads `emotional-triggers.md` for trigger density gate.

**Verdict: PASS**

| Key line | V | F | U | Avg | Notes |
|---|---|---|---|---|---|
| Hero headline | 5 | 5 | 4 | 4.7 | Concrete number, named subject, almost-unique (competitors could approximate 10-15 hrs claim) |
| Hero sub-head | 4 | 4 | 4 | 4.0 | Sub-head pivots to Unique Mechanism — good U |
| Hero CTA | 4 | 3 | 4 | 3.7 | Specific verb + benefit; could be more falsifiable (no number) |
| Problem section first line | 5 | 5 | 4 | 4.7 | Quantified pain |
| Solution section first line | 4 | 4 | 5 | 4.3 | Unique Mechanism named — full U |
| How It Works step 1 | 5 | 4 | 4 | 4.3 | Visual ("commit to PR") |
| Testimonial 1 (Vercel ED) | 4 | 5 | 5 | 4.7 | Named entity + named metric + named company |
| Testimonial 2 (Linear VP) | 4 | 5 | 5 | 4.7 | Same |
| Key stat | 5 | 5 | 4 | 4.7 | "1.8x more story points" — concrete + plausible |
| Final CTA | 4 | 4 | 4 | 4.0 | Risk-reversal embedded |

**Average V/F/U: 4.4 (≥3.5 PASS).** No single dimension <3.0 on any line. Trigger density: 3 (within 3-4 target). Authenticity filter: all 6 pass.

PASS verdict + annotated artifact returned.

---

## Step 5 — Write artifact

Orchestrator writes single artifact to `docs/forsvn/artifacts/marketing/content/statuszero-landing.copy.md`:

- Frontmatter: `skill: write-copy`, `version: 1`, `date: 2026-05-18`, `status: done`
- Descriptive metadata block (Date / Skill / Audience / Awareness Stage / Traffic Source)
- Pre-Writing 5-item block (verbatim from Cold Start answers)
- Section-by-section copy (Hero → Social Proof Bar → Problem → Solution → How It Works → Testimonials → Mid-Page CTA → Key Stats → Final CTA)
- Each key line annotated (Selected + Rule + Score + Cut alternative + Alternatives A & B)
- A/B Variants section (Hero Variant B + Final CTA Variant B with hypotheses + test priorities)

---

## Step 6 — Next Step

"Run `humanmaxxing` on the artifact to refine voice and compress" — copywriting's terminal pointer (humanmaxxing would catch any residual AI patterns the Authenticity filter missed; for TOF/cold LinkedIn traffic, additional humanmaxxing pass is recommended even after critic PASS).

**Completion Status: DONE** — full landing page copy, critic PASS at 4.4 average, A/B variants generated for hero + final CTA, ready for design hand-off.

---

## Cycle-2 FAIL variant (if critic had returned FAIL)

If critic cycle 1 had scored, say, Hero headline at V:5 F:5 U:2 — single-dim FAIL on Uniqueness ("Your team loses 12 hours a week to status updates nobody reads" is too close to generic productivity-loss copy any tool could sign — competitor swap test: "Your team loses 12 hours a week to Slack notifications nobody reads" still works for an entirely different tool). Critic re-dispatch: hook-agent with feedback "Hero U:2 — Competitor Swap Test fails. Rewrite anchoring on async status broadcast Unique Mechanism so a competitor without that mechanism can't sign the headline."

Hook-agent cycle 2 returns: "Your engineers waste 12 hours a week on status that lives in a meeting. Make it live in a PR." (V:5 F:4 U:5 — avg 4.7). Competitor Swap Test passes (only a tool with the PR-embedded mechanism can sign this).

Critic cycle 2: PASS at 4.5 average. Ship.

If cycle 2 had also FAILed on a different dimension (e.g., trigger density dropped to 2 from re-anchoring on mechanism), orchestrator surfaces: "Copy scored 4.2 average after 2 cycles — manual review recommended on Hero. Trigger density 2/4 (WEAK)." Status: `DONE_WITH_CONCERNS`.

---

## Route A (single key line) — short snippet

**Scenario:** Operator asks for just a hero headline for the StatusZero landing (not full page).

- **Step 1:** Pre-Dispatch (same as Route B).
- **Step 2:** Dispatch hook-agent ONLY (Route A skips body + cta + social-proof + variant + voice + psychology + zero-risk). hook-agent returns 5 variations + recommendation.
- **Step 3:** Dispatch critic-agent on hook-agent's output.
- **Step 4:** critic PASS at V:5 F:5 U:4. Ship single-line artifact with Selected + Cut alternative + Alternatives A & B + V/F/U scores.
- **Completion Status: DONE.**

---

## Route C (called by lp-brief) — short snippet

**Scenario:** lp-brief invokes copywriting Route C for the StatusZero landing's hero section (lp-brief has already locked the page architecture + hypothesis + per-section spec).

- **Step 1:** Pre-Dispatch reads lp-brief's artifact at `docs/forsvn/artifacts/marketing/brief-landing-page/statuszero/brief.md` — extracts audience + voice + Unique Mechanism + the one shift + traffic source per-section. No AskUserQuestion mid-flow.
- **Step 2:** Dispatch hook-agent + cta-agent in parallel (Route C picks the agents lp-brief's per-section spec named — for hero section: headline + sub-head + hero CTA).
- **Step 3:** Dispatch critic-agent. PASS.
- **Step 4:** Return annotated hero copy directly to lp-brief (NO standalone artifact file written by copywriting in Route C; lp-brief embeds copy + annotations in its own artifact at `docs/forsvn/artifacts/marketing/brief-landing-page/statuszero/v1/brief.md`).
- **Completion Status: DONE.**
