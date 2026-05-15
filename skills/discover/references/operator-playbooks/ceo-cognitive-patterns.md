---
type: operator-playbook
domain: ceo-cognitive-patterns
load_when: every_nontrivial_discover_invocation
schema_version: 1
last_verified: 2026-05-09
verifier: hungv47
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: draft
---

# Operator Playbook — CEO Cognitive Patterns

This playbook loads on **every** non-trivial discover invocation regardless of domain. The 18 patterns codified below are not a checklist — they are **thinking instincts**, the cognitive moves that separate 10x CEOs from competent managers [pattern-derived]. They shape *how discover sees* the user's plan, not what discover asks. When the user opens with a feature, an architecture, a launch plan, a hiring decision, a pricing question, or a scope debate, this playbook is the lens.

> *"These are not checklist items. They are thinking instincts — the cognitive moves that separate 10x CEOs from competent managers. Let them shape your perspective throughout the review. Don't enumerate them; internalize them."* [pattern-derived]

The playbook's load-bearing claim: *every* user input is an opportunity to apply 1-3 of these instincts. The art is selecting the right ones for the moment — not running all 18.

---

## 1. Core Frame

Two strands hold the 18 patterns together:

1. **Decision posture** — most decisions deserve speed (two-way doors); a few deserve slowness (irreversible, high-magnitude). Almost every founder gets the ratio backwards: too slow on reversible decisions, too fast on irreversible ones. Patterns 1, 2, 6, 9, 11 calibrate this.

2. **Subtraction discipline** — the central operator instinct is choosing what NOT to do. Jobs cut Apple's product line from 350 to 10. Rams asked whether each pixel earned its place. Patterns 4, 7, 17 carry this discipline. Most plans fail by additive bloat, not by missing pieces.

The patterns are not all-on at once. Discover should pick 1-3 per session — match by situation, not by completeness.

---

## 2. The 18 Cognitive Instincts

Each instinct is presented with: the named operator, the cognitive move (pattern-derived), when it fires in discover, a worked example, and counter-cases (when this instinct does NOT apply).

### Pattern 1 — Classification Instinct (Bezos: One-Way vs. Two-Way Doors)

**Operator:** Jeff Bezos.

**The cognitive move:** *"Categorize every decision by reversibility x magnitude (Bezos one-way/two-way doors). Most things are two-way doors; move fast."* [pattern-derived]

A two-way door is a reversible decision — you can walk back through it. A one-way door is irreversible. Bezos's rule: most decisions are two-way doors and deserve speed; treating them as one-way doors creates organizational sclerosis.

**When it fires in discover:** User is agonizing over a decision. The first move is to classify it. If two-way, the agony itself is the bug — push to ship and learn. If one-way, the agony is appropriate — slow down and gather more info.

**Worked example:** User asks discover to help choose between two pricing models for an early-stage SaaS. Discover applies Pattern 1: pricing is a two-way door — you can change pricing in 4 weeks. Architecture choices that lock you into a tier structure are closer to one-way. Discover's response: *"This is a two-way door — pick one, ship for 4 weeks, change if it's wrong. The cost of waiting is greater than the cost of being wrong."*

**Counter-cases:** Big public price drops (hard to walk back without churning customers); founder equity splits (functionally one-way once vesting starts); fundraising terms (one-way until next round). The instinct is *classify first* — not *always move fast*.

### Pattern 2 — Paranoid Scanning (Grove: Only the Paranoid Survive)

**Operator:** Andy Grove (Intel).

**The cognitive move:** *"Continuously scan for strategic inflection points, cultural drift, talent erosion, process-as-proxy disease (Grove: 'Only the paranoid survive')."* [pattern-derived]

Strategic inflection points are moments where the rules of the game change — the 10x change Grove described. They look like noise until they're not.

**When it fires in discover:** User is describing a market, competitive landscape, or technology trend with confident equilibrium framing. Discover asks: *what 10x change in input could invalidate this plan?*

**Worked example:** User describes a roadmap built on the assumption that LLM API prices stay steady. Pattern 2 fires: that's an inflection-point assumption. Discover surfaces: *"What's the plan if API prices drop 10x in 18 months? That's not paranoia — that's 'has happened twice in two years.'"*

**Counter-cases:** Mature, low-volatility domains (e.g., commodity hardware distribution) where inflection-point scanning produces noise without signal. Don't impose paranoid scanning on a deli.

### Pattern 3 — Inversion Reflex (Munger)

**Operator:** Charlie Munger.

**The cognitive move:** *"For every 'how do we win?' also ask 'what would make us fail?' (Munger)."* [pattern-derived]

Inversion is forcing a reverse trace: what would have to be true for this plan to fail catastrophically? Failure modes you can name are failure modes you can avoid.

**When it fires in discover:** User is presenting a plan optimistically (the win path). Discover applies inversion: *"Now invert it — what would have to happen for this to fail badly?"* Output should produce 3-5 named failure modes.

**Worked example:** User pitches launching a new SaaS feature next month. Pattern 3 fires. Discover asks: *"Inverting — what kills this launch? (1) Existing customers churn because the feature complicates the core flow. (2) Support volume spikes 5x because of an edge case. (3) The feature works but no one uses it because the discovery surface is wrong."* Each failure mode becomes a pre-mortem checkpoint.

**Counter-cases:** Discovery / exploration phases where inverting too early kills momentum. Apply after a direction is chosen, not while choosing.

### Pattern 4 — Focus As Subtraction (Jobs)

**Operator:** Steve Jobs.

**The cognitive move:** *"Primary value-add is what to *not* do. Jobs went from 350 products to 10. Default: do fewer things, better."* [pattern-derived]

Focus is subtraction, not selection. The unit of work is *what's removed*, not what's added.

**When it fires in discover:** Plan contains >3 user-facing initiatives, >5 features in MVP, or "we'll also" language. Discover's question: *"What gets cut?"* — not *"is the prioritization right?"*

**Worked example:** User describes an MVP with 8 features. Pattern 4 fires. Discover: *"Pick 1. Cut 7. The 1 you'd defend with your career — that's the MVP. The other 7 either get built later because users demand them, or they were never going to matter."*

**Counter-cases:** Two-sided platforms where multiple features are load-bearing for v1 (marketplaces need supply + demand mechanics simultaneously). Cutting too aggressively breaks the value prop. Subtraction is the default — but defaults can be overridden with reason.

### Pattern 5 — People-First Sequencing (Horowitz / Hastings)

**Operators:** Ben Horowitz, Reed Hastings.

**The cognitive move:** *"People, products, profits — always in that order (Horowitz). Talent density solves most other problems (Hastings)."* [pattern-derived]

Order matters: the team determines the product determines the profit. Skipping ahead — building a product before the people are right — produces fragile outputs.

**When it fires in discover:** User is debating product/strategy/process while skipping over team gaps. Discover redirects: *"Before we discuss the product roadmap — is the team right for the product you're describing?"*

**Worked example:** User wants to build an AI consumer app. Their team is two backend engineers, no consumer designer, no growth person. Pattern 5 fires. Discover: *"You've described a consumer-app product but your team is configured for B2B SaaS infrastructure. The fastest fix isn't a different roadmap — it's a different team. People → product → profit, in that order."*

**Counter-cases:** Solo founders with no team to optimize. The frame still applies (you ARE the team, your skill set determines the product) but the lever shifts from hiring to learning or co-founding.

### Pattern 6 — Speed Calibration (Bezos: 70% Information)

**Operator:** Jeff Bezos.

**The cognitive move:** *"Fast is default. Only slow down for irreversible + high-magnitude decisions. 70% information is enough to decide (Bezos)."* [pattern-derived]

Bezos's published principle: most decisions should be made with about 70% of the information you wish you had. Waiting for 90% means being slow.

**When it fires in discover:** User is asking discover to help them gather more data before deciding. Discover challenges the premise: *what's the cost of deciding now with 70%?*

**Worked example:** User wants to do 6 weeks of customer research before picking between two product directions. Pattern 6 fires. Discover: *"What's the irreversibility / magnitude classification? If two-way and medium magnitude — pick now with 70%, ship for 8 weeks, learn from real signal. 6 weeks of research will likely produce less signal than 8 weeks of shipping."*

**Counter-cases:** One-way doors with high magnitude (firing a co-founder, a multi-year platform bet, a hostile acquisition). For those, 70% is too little. Pattern 6 is calibration, not blanket speed advocacy.

### Pattern 7 — Proxy Skepticism (Bezos: Day 1)

**Operator:** Jeff Bezos.

**The cognitive move:** *"Are our metrics still serving users or have they become self-referential? (Bezos Day 1)."* [pattern-derived]

Proxy disease: a metric that started as a measure of value becomes a target itself, divorced from value. *Process-as-proxy* is its institutional form — a process that started serving customers becomes a self-referential ritual.

**When it fires in discover:** User uses a metric (MAU, NPS, signups, MRR-growth-rate) without connecting it to a customer-felt outcome. Discover asks: *"What does this metric mean for the actual user experience? If it goes up 50%, what changed in someone's life?"*

**Worked example:** User wants to optimize signup conversion rate from 4% to 6%. Pattern 7 fires. Discover: *"What happens to the 6%? If your activation rate (people who actually use the product after signup) is 8%, doubling signups gets you nowhere. Is signup conversion still the right metric, or has it become self-referential?"*

**Counter-cases:** Late-stage scaling where metrics are well-validated and incremental optimization is the job. Don't second-guess metrics in the *one* place they should be trusted.

### Pattern 8 — Narrative Coherence

**Operator:** Generic operator instinct (referenced in gstack-plan-ceo-review without single attribution).

**The cognitive move:** *"Hard decisions need clear framing. Make the 'why' legible, not everyone happy."* [pattern-derived]

The operator job on hard decisions is not consensus — it's clarity. The team can disagree with a decision and still execute well if the *why* is legible. Conversely, a hidden why produces silent dissent that erodes execution.

**When it fires in discover:** User is making a hard call (cutting a project, firing someone, pivoting). Discover asks: *"Can you state the why in one sentence that holds up under scrutiny? If not, the decision isn't ready to communicate yet."*

**Worked example:** User decides to sunset a product line. Pattern 8 fires. Discover: *"What's the one-sentence why? 'It wasn't growing fast enough' is not a why — that's a metric. 'We're concentrating engineering on the highest-leverage product, which means cutting X' is a why. The first version produces dissent; the second produces alignment with disagreement."*

**Counter-cases:** Decisions that don't need to be communicated (pure-execution work, internal optimizations). Don't manufacture narratives for invisible decisions.

### Pattern 9 — Temporal Depth / Regret Minimization (Bezos at 80)

**Operator:** Jeff Bezos.

**The cognitive move:** *"Think in 5-10 year arcs. Apply regret minimization for major bets (Bezos at age 80)."* [pattern-derived]

Bezos's framework: imagine yourself at age 80 looking back on this decision. Will you regret making this bet? Will you regret NOT making it? The asymmetry usually clarifies the right answer.

**When it fires in discover:** User is deciding on a multi-year commitment (career direction, founding a company, major life-shaping bet). Discover: *"Imagine you at 80 looking back. Which version regrets this — the one who tried, or the one who didn't?"*

**Worked example:** User is debating quitting their job to build a product full-time. Pattern 9 fires. Discover: *"This is a 5-10 year arc, not a quarter. The Bezos test: at 80, do you regret quitting and failing, or do you regret never trying? Most people's answer is asymmetric — and that asymmetry IS the answer."*

**Counter-cases:** Operational decisions on short horizons (this week's sprint, next month's launch). Pattern 9 is for life-shape bets, not tactical execution.

### Pattern 10 — Founder-Mode Bias (Chesky / Graham)

**Operators:** Brian Chesky (Airbnb), Paul Graham (essay: "Founder Mode," Sept 2024).

**The cognitive move:** *"Deep involvement isn't micromanagement if it expands (not constrains) the team's thinking (Chesky/Graham)."* [pattern-derived]

Graham's "Founder Mode" essay made the public case that the conventional wisdom — "hire great people and get out of their way" — is wrong for founders. Deep involvement that *expands* what the team thinks is possible is different from *micromanagement* that constrains them.

**When it fires in discover:** User describes hands-off delegation framed as "trusting the team" — but their gut tells them something is wrong. Discover asks: *"Are you delegating because trust is the right move, or because you've absorbed conventional wisdom that founders should step back? Founder-mode says: stay deep when staying deep expands what's possible."*

**Worked example:** User is the founder, has hired a PM, and feels the PM's roadmap is too conservative. Conventional wisdom: trust the PM. Pattern 10 fires. Discover: *"You hired the PM to multiply your output, not replace your taste. Push the roadmap — not via override, but via vision pressure. 'What would have to be true for this to be 10x more ambitious?' Founder mode means staying in the room."*

**Counter-cases:** Domains where the founder genuinely lacks expertise and is dragging down quality (e.g., a non-engineer founder mandating engineering decisions). Founder-mode isn't a license to override expertise.

### Pattern 11 — Wartime Awareness (Horowitz)

**Operator:** Ben Horowitz.

**The cognitive move:** *"Correctly diagnose peacetime vs wartime. Peacetime habits kill wartime companies (Horowitz)."* [pattern-derived]

Horowitz's distinction: peacetime CEOs grow markets, build culture, optimize processes. Wartime CEOs survive existential threats, make hard cuts fast, suspend consensus. Applying peacetime habits during wartime is fatal — and vice versa.

**When it fires in discover:** Plan is operating under one mode but the situation has shifted. Discover diagnoses: *"Are we in peacetime or wartime right now? If runway is <12 months and revenue is flat, that's wartime. If you have 36 months of runway and a growing user base, that's peacetime. The right plan differs by mode."*

**Worked example:** User wants to do a 6-week design system redesign. Discover checks runway: 9 months. Pattern 11 fires. Discover: *"That's a wartime calendar — a 6-week design system redesign is a peacetime initiative. Wartime move: revenue or pipeline this quarter. The redesign is correct work, wrong time."*

**Counter-cases:** Mistaking one for the other in either direction. Don't run a profitable, growing company on wartime panic — it kills culture and burns talent. Don't run a near-default-dead company on peacetime perfectionism — it runs out of money.

### Pattern 12 — Courage Accumulation

**Operator:** Generic operator instinct (gstack-plan-ceo-review attribution to Horowitz's "the struggle").

**The cognitive move:** *"Confidence comes *from* making hard decisions, not before them. 'The struggle IS the job.'"* [pattern-derived]

Founders often wait to feel confident before deciding. The order is reversed: confidence is the *output* of having made hard decisions, not the *input*. Waiting to feel ready means never deciding.

**When it fires in discover:** User says "I'm not ready," "I don't feel confident yet," "I want to be sure before…" Discover: *"You won't feel ready before. You'll feel ready after. Confidence comes from doing the hard thing — not from preparing to do it."*

**Worked example:** User is delaying firing an underperformer because they "don't feel confident in the decision yet." Pattern 12 fires. Discover: *"You're waiting for a feeling that arrives only on the other side. Make the decision well-grounded in evidence — confidence will follow once you've done it. The struggle IS the job."*

**Counter-cases:** Genuinely under-informed decisions where more information would change the answer. Pattern 12 is about emotional readiness vs. epistemic readiness — they're different. Don't conflate them.

### Pattern 13 — Willfulness As Strategy (Altman)

**Operator:** Sam Altman.

**The cognitive move:** *"Be intentionally willful. The world yields to people who push hard enough in one direction for long enough. Most people give up too early (Altman)."* [pattern-derived]

Altman's framing: willfulness is a deployable strategy. Most goals fail not because they're impossible but because the founder gives up before they would have worked. Sustained pressure in one direction is rarer than the world thinks.

**When it fires in discover:** User is reconsidering a hard problem they've been pushing on for <12 months because progress is slow. Discover: *"Slow progress is normal at this stage. Are you giving up because the evidence says you should — or because it's hard? Most people give up too early."*

**Worked example:** User is 8 months into a B2B sales motion with 2 customers and considering pivoting. Pattern 13 fires. Discover: *"8 months and 2 customers in B2B is below the median, but not in the giving-up zone. Willfulness check: what would the next 6 months look like if you went harder, not different? Pivot or persist is a strategic question — but at 8 months, persist usually wins."*

**Counter-cases:** Genuinely dead ideas. Willfulness is not stubbornness. If the underlying assumption is wrong (problem doesn't exist, market is too small, customers aren't the buyers you thought), willfulness compounds losses. Pattern 3 (inversion) is the cross-check.

### Pattern 14 — Leverage Obsession (Altman)

**Operator:** Sam Altman.

**The cognitive move:** *"Find the inputs where small effort creates massive output. Technology is the ultimate leverage — one person with the right tool can outperform a team of 100 without it (Altman)."* [pattern-derived]

Leverage is the multiplier — the input where 1x effort produces 10x or 100x output. Altman's specific claim: technology (and now AI) is the highest-leverage input available, larger than capital or labor.

**When it fires in discover:** User is debating where to spend the next month's effort. Discover asks: *"Which option has the highest leverage? Not the highest expected value — the highest leverage. The 1x input that produces 10x output."*

**Worked example:** User is debating between (a) 4 weeks doing manual customer outreach and (b) 4 weeks building an AI-powered onboarding flow. Pattern 14 fires. Discover: *"What's the leverage on each? (a) 100 outreaches → maybe 5 customers, manual. (b) Onboarding flow → if it works, 1000 customers can self-serve. Which one compounds? B has more leverage but more execution risk. The right answer depends on validation status — but 'highest leverage' is the question to ask."*

**Counter-cases:** Premature leverage-seeking. If you don't yet know what works, optimizing for leverage is optimizing in the dark. Validate first, then leverage. The minimalist-entrepreneur frame's "manual first" is the explicit pre-condition.

### Pattern 15 — Hierarchy As Service (Rams)

**Operator:** Dieter Rams.

**The cognitive move:** *"Every interface decision answers 'what should the user see first, second, third?' Respecting their time, not prettifying pixels."* [pattern-derived]

Visual hierarchy is not aesthetic — it's an answer to the question *what's most important?* Every UI element either earns its place in the hierarchy or it doesn't.

**When it fires in discover:** User is describing a UI / dashboard / page layout. Discover asks: *"What does the user need to see first? What's second? What's third? If you can't answer in 30 seconds, the hierarchy is wrong."*

**Worked example:** User describes a settings page with 14 sections. Pattern 15 fires. Discover: *"Rank them. Top 3 are 80% of usage; bottom 11 are 20%. The page should reflect that ratio. If everything is equally prominent, the user has to do the ranking — which means they don't, which means they leave."*

**Counter-cases:** Power-user interfaces where the user *has* mastered the hierarchy and visual flatness IS the feature (e.g., Vim, Emacs, professional DAWs). Hierarchy-as-service applies to first-time-user-friendly interfaces; expert tools have different rules.

### Pattern 16 — Edge Case Paranoia (Design)

**Operator:** Generic design-engineering instinct (gstack-plan-ceo-review).

**The cognitive move:** *"What if the name is 47 chars? Zero results? Network fails mid-action? First-time user vs power user? Empty states are features, not afterthoughts."* [pattern-derived]

Edge cases are the difference between a product that *demos well* and a product that *holds up in production*. Empty states, error states, max-length inputs, slow networks — these are first-class design surfaces, not cleanup work.

**When it fires in discover:** Plan describes happy path without naming edge cases. Discover: *"Trace the empty state. The error state. The max-input state. The slow-network state. If you can't describe each in one sentence, those are the design holes the user will fall into first."*

**Worked example:** User describes a search-driven UI. Pattern 16 fires. Discover: *"Edge cases: zero results — what does the user see? 1 result vs 100 — same component? Mid-typing — instant results or debounced? Network drops mid-search — error visible or silently broken? These are the four states that decide whether the search feels good."*

**Counter-cases:** Pre-MVP pure prototypes where the goal is to test if anyone wants the thing. Spending time on edge cases before validating demand is misplaced rigor.

### Pattern 17 — Subtraction Default (Rams)

**Operator:** Dieter Rams (also: Jobs).

**The cognitive move:** *"'As little design as possible' (Rams). If a UI element doesn't earn its pixels, cut it. Feature bloat kills products faster than missing features."* [pattern-derived]

Pattern 4 (Focus as Subtraction) applies at the strategic level; Pattern 17 applies at the design / element level. Each pixel, each element, each option is on probation — does it earn its place?

**When it fires in discover:** Plan adds a UI element, a configuration option, a setting, a tooltip, a new button. Discover: *"Does it earn its pixels? If you removed it, what would the user lose — concretely? If you can't name a concrete loss, cut it."*

**Worked example:** User wants to add a tooltip to explain a feature. Pattern 17 fires. Discover: *"If the feature needs a tooltip to be understood, the feature itself is wrong. Two options: (a) make the feature self-explanatory, (b) cut the feature. Tooltip is a third option, but it's the worst of the three — it adds clutter to compensate for unclear UX."*

**Counter-cases:** Power-user features where every element is intentional and the user *wants* the density (Bloomberg terminal, Sublime Text, Excel). Subtraction-default applies to first-touch UX; expert tools earn complexity.

### Pattern 18 — Design For Trust

**Operator:** Generic operator/design instinct (gstack-plan-ceo-review).

**The cognitive move:** *"Every interface decision either builds or erodes user trust. Pixel-level intentionality about safety, identity, and belonging."* [pattern-derived]

Trust is the cumulative output of thousands of micro-decisions. A misaligned font weight, an inconsistent color, an opaque error message — each erodes trust by 1%. Compounded across the experience, trust gaps become churn.

**When it fires in discover:** Plan touches a high-stakes user moment — first sign-in, payment, data deletion, billing change, security setting, identity action. Discover: *"At this moment, what does the user need to feel? Safe? Confident? In control? Then design backwards from that feeling, pixel by pixel."*

**Worked example:** User is designing a "delete account" flow. Pattern 18 fires. Discover: *"What does the user need to feel here? Confident the deletion is real, that nothing else got deleted, that they can recover if they change their mind in 24h. Each of those is a design decision — confirmation copy, deletion preview, soft-delete window. If any is missing, trust erodes."*

**Counter-cases:** Extremely transactional / commodity flows where trust is already established and over-designing the moment creates friction (e.g., a familiar user re-doing a known action). Don't insert trust-building friction where it's already built.

---

## 3. Routing Rules — Which Instinct To Lead With

You don't run all 18 in any single discover session. Pick 1-3 by situation:

| Discover situation | Lead instincts |
|--------------------|----------------|
| User agonizing over a decision | 1 (Classification), 6 (Speed Calibration), 12 (Courage Accumulation) |
| User confident about a plan | 3 (Inversion), 7 (Proxy Skepticism), 16 (Edge Case Paranoia) |
| User adding scope / features | 4 (Focus as Subtraction), 17 (Subtraction Default) |
| User cutting / sunsetting | 8 (Narrative Coherence), 9 (Temporal Depth) |
| Strategy under threat / runway | 11 (Wartime Awareness) — diagnose peacetime vs. wartime first |
| Team / hiring / org structure | 5 (People-First Sequencing), 10 (Founder-Mode Bias) |
| Multi-year commitment | 9 (Regret Minimization), 13 (Willfulness as Strategy) |
| Choosing where to invest effort | 14 (Leverage Obsession) |
| UI / design / interface decisions | 15 (Hierarchy as Service), 16 (Edge Case Paranoia), 17 (Subtraction Default), 18 (Design for Trust) |
| Metrics / OKR / measurement debate | 7 (Proxy Skepticism) |
| Hard decision the team will hate | 8 (Narrative Coherence) |
| Market / competitive analysis | 2 (Paranoid Scanning), 3 (Inversion) |
| User about to give up | 13 (Willfulness as Strategy) — but cross-check with 3 (Inversion) |

**Cross-cutting rule:** Patterns 1 + 6 (classification + speed calibration) form the chassis. They apply to almost every decision. Add 1-2 situational instincts on top.

---

## 4. Pushback Patterns

These are worked BAD-vs-GOOD applications discover should pattern-match against. **Spend disproportionate effort here — discover loads this playbook on every non-trivial invocation specifically to use these patterns.**

### Pattern A: Reversibility Confusion

- **Trigger:** User is agonizing over a decision discover can immediately classify as a two-way door.
- **BAD:** "That's a tough call — let me help you think through both options carefully."
- **GOOD:** "Wait — classify first. This is a two-way door: you can change pricing in 4 weeks if it's wrong. The cost of agonizing is greater than the cost of being wrong. Pick now, ship for 4 weeks, change if needed. Save the agony for irreversible bets."
- **Pattern basis:** internal research synthesis.

### Pattern B: Optimism Without Inversion

- **Trigger:** User pitches a plan with confidence. Discover should feel the absence of pre-mortem.
- **BAD:** "That sounds well-reasoned. What's the next step?"
- **GOOD:** "Now invert — what would have to happen for this to fail badly? Name three concrete failure modes. If you can't, the plan isn't ready. The win path is one path; the failure paths are usually three or four, and the ones you can't name are the ones that get you."
- **Pattern basis:** internal research synthesis.

### Pattern C: Vanity Metric Drift

- **Trigger:** User uses a metric (signups, MAU, NPS, MRR-growth-rate) without connecting to user-felt outcome.
- **BAD:** "Got it — let's optimize for that metric."
- **GOOD:** "Pause on the metric. What does it mean for the actual user? If signup conversion goes 4% → 6%, what changes in someone's life? If you can't answer, the metric has become self-referential — Bezos's Day-1 disease. The right metric tracks a customer-felt outcome, not a funnel position."
- **Pattern basis:** internal research synthesis.

### Pattern D: Peacetime Habits in Wartime

- **Trigger:** User describes a slow, polished initiative while operating under existential pressure (short runway, churning customers, missed targets).
- **BAD:** "Let's plan the design system migration — it's important infrastructure."
- **GOOD:** "What's the runway right now? If it's <12 months and revenue is flat, this is wartime. A design system migration is a peacetime initiative — correct work, wrong time. Wartime move: revenue or pipeline this quarter. Diagnose the war first, then pick work."
- **Pattern basis:** internal research synthesis.

### Pattern E: False Delegation

- **Trigger:** User has stepped back from a domain in the name of "trusting the team," but their instinct is telling them something is off.
- **BAD:** "Sounds like the team has it — what else can I help with?"
- **GOOD:** "Why did you step back? If it was 'founders should trust the team,' that's conventional wisdom — and Graham's Founder Mode essay says it's wrong. Founder mode means staying deep where staying deep *expands* what the team thinks is possible, not constrains it. Are you pushing the roadmap or accepting it? That's a different question than whether you trust the PM."
- **Pattern basis:** internal research synthesis.

### Pattern F: Bloat By Addition

- **Trigger:** User describes a plan that adds features / settings / options / pages without asking what gets cut.
- **BAD:** "Let's prioritize the additions by impact and effort."
- **GOOD:** "What gets cut? Adding 5 things is half the answer. The other half is what's removed. Jobs went 350 → 10. The unit of work is subtraction — what's the 7 we cut so the 1 we keep is sharp?"
- **Pattern basis:** internal research synthesis.

### Pattern G: Premature Surrender

- **Trigger:** User is considering pivoting / quitting on a hard problem they've been pushing on for <12 months.
- **BAD:** "Pivoting is a strong move when the data says so — let me help you plan."
- **GOOD:** "Hold — willfulness check. Most people give up too early. 8 months on a B2B motion is below median traction but not in the giving-up zone. Two questions: (a) is the underlying assumption still right? (Apply inversion.) (b) Have you actually pushed harder, or just longer? Same intensity for longer is not the same as willfulness."
- **Pattern basis:** internal research synthesis.

---

## 5. Anti-Patterns (What This Playbook Says NOT To Do)

The 18 patterns are a kit, not a hammer. Misapplications:

1. **Don't apply wartime instincts in peacetime.** Wartime cuts during peacetime burn culture and talent. Pattern 11 is *diagnostic* before it's *prescriptive*.

2. **Don't enumerate the 18 to the user.** *"Let them shape your perspective throughout the review. Don't enumerate them; internalize them."* [pattern-derived] The patterns are stance, not show-and-tell. The user should never see "Applying Pattern 13 — Willfulness as Strategy" in discover output.

3. **Don't apply leverage-seeking before validation.** Pattern 14 (Leverage Obsession) compounds losses if the underlying assumption is wrong. Validate the assumption first (cross with minimalist-entrepreneur frame), then optimize for leverage.

4. **Don't apply willfulness to dead ideas.** Pattern 13 is not stubbornness. If inversion (Pattern 3) reveals the underlying assumption is wrong, willfulness compounds the loss. Cross-check before persisting.

5. **Don't apply edge-case paranoia to pre-MVP prototypes.** Pattern 16 produces premature rigor when the goal is "test if anyone wants this." Edge cases earn focus once demand is validated, not before.

6. **Don't apply hierarchy-as-service to expert / power-user tools.** Pattern 15 + 17 are first-touch-UX defaults. Expert tools (Vim, Bloomberg, professional DAWs) earn density. Don't over-simplify in the name of subtraction.

7. **Don't conflate epistemic readiness with emotional readiness.** Pattern 12 (Courage Accumulation) addresses emotional waiting. If the user genuinely lacks information, more information would change the answer — that's not Pattern 12 territory.

8. **Don't run all 18 in any session.** Pick 1-3 by situation. Running all 18 produces noise that drowns the signal of any one.

9. **Don't apply founder-mode bias outside founder context.** Pattern 10 is for founders. A non-founding executive applying founder-mode often crosses into actual micromanagement. Position matters.

10. **Don't apply paranoid scanning to mature, low-volatility domains.** Pattern 2 produces noise without signal in equilibrium markets. The instinct is for inflection-point-prone domains.

---

## 6. Adaptation Notes

How the playbook adjusts across contexts:

### Founder vs. Operator vs. Intrapreneur

- **Founder:** All 18 apply. Pattern 10 (Founder-Mode Bias) is most native here.
- **Operator (employee, exec):** Pattern 10 doesn't apply directly. Patterns 4, 7, 11, 14 are the core kit. Don't import founder-mode at non-founder roles.
- **Intrapreneur:** Translate "wartime" → "exec sponsor losing patience"; "willfulness" → "champion-survival across reorgs"; "people-first" → "stakeholder-mapping before scoping." The instincts hold; the names of the actors shift.

### Early-Stage vs. Late-Stage

- **Early-stage:** Patterns 1 (Classification), 6 (Speed), 13 (Willfulness), 14 (Leverage) dominate. Most decisions are two-way doors; speed wins.
- **Late-stage:** Patterns 2 (Paranoid Scanning), 7 (Proxy Skepticism), 8 (Narrative Coherence), 11 (Wartime Awareness) dominate. The stakes of one-way doors compound; rigor wins.

### B2B vs. Consumer

- **B2B:** Pattern 5 (People-First) and Pattern 8 (Narrative Coherence) are most load-bearing — sales motion is people-and-narrative-driven.
- **Consumer:** Patterns 15 (Hierarchy), 16 (Edge Cases), 17 (Subtraction), 18 (Design for Trust) are most load-bearing — the product IS the experience.

### Engineering-Heavy vs. Design-Heavy

- **Engineering-heavy domains:** Patterns 1, 3, 6, 14 dominate. The work is decision-making under uncertainty.
- **Design-heavy domains:** Patterns 15, 16, 17, 18 dominate. The work is decision-making at the pixel level.

### Solo vs. Team

- **Solo:** Pattern 5 (People-First) translates to "you are the team" — your skill set determines product. Pattern 14 (Leverage) is the highest-impact instinct (technology multiplies one person more than it multiplies a team).
- **Team:** Pattern 5 applies natively. Pattern 10 (Founder-Mode) becomes critical once headcount > 10.

### Peacetime vs. Wartime (the cross-cutting axis)

- **Peacetime:** Patterns 4, 7, 9, 14 dominate — patient subtraction, long-horizon thinking, leverage.
- **Wartime:** Patterns 1, 3, 6, 8, 11 dominate — decisive classification, inversion, speed, narrative, war-mode operating tempo.
- The diagnostic itself (am I in peace or war?) is Pattern 11. Run it first; it gates everything else.

---

## 7. Open Questions / Known Unknowns

What this playbook *does not* answer well — gaps the verifier flagged:

- **Calibrating "70% information."** Bezos's rule (Pattern 6) is qualitative. There's no public framework for measuring information completeness — practitioners eyeball it. Discover users will ask "but how do I know I'm at 70%?" and the playbook has no quantitative answer.
- **Wartime/peacetime threshold.** Pattern 11's diagnosis is qualitative. *How short* is "short runway"? <12 months is the gstack default but the actual threshold depends on burn rate, revenue trajectory, and the cost of wartime moves themselves. Operator judgment.
- **Willfulness vs. stubbornness boundary.** Pattern 13 says push hard; Pattern 3 says invert and check. The exact decision rule for *when* willfulness becomes stubbornness is not formalized — it's a learned-pattern call.
- **Founder-mode applicability outside startups.** Pattern 10 is articulated for startup founders. How much it generalizes to mature companies, BUs inside large orgs, or non-CEO founders is contested.
- **Subtraction default in marketplace / network-effects products.** Patterns 4 and 17 work cleanly for single-sided products. For multi-sided platforms, "subtract" can break the network effect. The playbook doesn't fully address this.
- **Trust-as-design quantification.** Pattern 18 says trust compounds at the pixel level — but there's no quantitative model for *how much* trust each design element earns or erodes. Practitioners measure churn / NPS as proxies; the playbook itself doesn't formalize.
- **Paranoid-scanning false-positive rate.** Pattern 2 produces signal in inflection-point-prone domains. In equilibrium markets, it produces noise. The frame doesn't include a diagnostic for when paranoid scanning is the right tool.
- **The 18 weren't curated by a single named operator with veto power.** They're a synthesis from gstack's plan-ceo-review skill, attributing to multiple operators. The synthesis is high-quality but not adversarially reviewed by, e.g., Bezos or Horowitz themselves. Treat as practitioner consensus, not gospel.

---

## 8. Changelog

| Date | Change | By |
|------|--------|-----|
| 2026-05-09 | Initial draft | hungv47 |
