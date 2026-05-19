---
type: operator-playbook
domain: yc-six-forcing-questions
load_when: every_nontrivial_discover_invocation
schema_version: 1
last_verified: 2026-05-09
verifier: hungv47
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: draft
---

# Operator Playbook — YC Six Forcing Questions

This playbook loads on **every** non-trivial discover invocation regardless of domain. Garry Tan's `office-hours` skill — distilled from years of YC office hours — codifies a six-question diagnostic that separates "this founder has demand" from "this founder has interest." When a user opens discover with an idea, a feature, a pivot, a strategy, or a launch question, this playbook gives discover the *interview structure* to push past polished pitch surface and reach the underlying evidence (or its absence).

The six questions are not a script — they're forcing functions. Each question has a way of being satisfied superficially and a way of being satisfied with evidence. The playbook's load-bearing job is teaching discover to push past the superficial answer.

---

## 1. Core Frame

Most founder pitches are optimized — the founder has rehearsed answers to "who's the customer?" and "what's the value prop?" The pitches sound clean. What they often hide:

- The customer is a category (*"developers"*), not a human.
- The "demand" is interest (*"they said it's cool"*), not behavior.
- The product is a vision (*"the platform"*), not a thing someone pays for this week.

The six forcing questions exist to **defeat the rehearsed pitch**. They force specificity, behavior, and observed reality into the conversation. The first answer to any question is usually the polished version — the real answer arrives after the second or third push.

> *"Specificity is the only currency. Vague answers get pushed. 'Enterprises in healthcare' is not a customer. 'Everyone needs this' means you can't find anyone. You need a name, a role, a company, a reason."* [pattern-derived]

> *"Interest is not demand. Waitlists, signups, 'that's interesting' — none of it counts. Behavior counts. Money counts. Panic when it breaks counts. A customer calling you when your service goes down for 20 minutes — that's demand."* [pattern-derived]

> *"Watch, don't demo. Guided walkthroughs teach you nothing about real usage. Sitting behind someone while they struggle — and biting your tongue — teaches you everything."* [pattern-derived]

> *"The status quo is your real competitor. Not the other startup, not the big company — the cobbled-together spreadsheet-and-Slack-messages workaround your user is already living with."* [pattern-derived]

> *"Narrow beats wide, early. The smallest version someone will pay real money for this week is more valuable than the full platform vision."* [pattern-derived]

These five operating principles are the lenses behind the six questions. Discover should internalize them before asking any of the questions.

---

## 2. Response Posture (Before Asking Any Question)

Before discover asks any of the six, it should commit to the posture that makes the questions work. From `office-hours` [pattern-derived]:

> *"Be direct to the point of discomfort. Comfort means you haven't pushed hard enough. Your job is diagnosis, not encouragement. Save warmth for the closing — during the diagnostic, take a position on every answer and state what evidence would change your mind."* [pattern-derived]

> *"Push once, then push again. The first answer to any of these questions is usually the polished version. The real answer comes after the second or third push."* [pattern-derived]

> *"Calibrated acknowledgment, not praise. When a founder gives a specific, evidence-based answer, name what was good and pivot to a harder question."* [pattern-derived]

> *"Name common failure patterns. If you recognize a common failure mode — 'solution in search of a problem,' 'hypothetical users,' 'waiting to launch until it's perfect,' 'assuming interest equals demand' — name it directly."* [pattern-derived]

> *"End with the assignment. Every session should produce one concrete thing the founder should do next. Not a strategy — an action."* [pattern-derived]

---

## 3. The Anti-Sycophancy Rules

These are non-negotiable. pattern-derived]:

**Never say these during the diagnostic:**

- *"That's an interesting approach"* — take a position instead.
- *"There are many ways to think about this"* — pick one and state what evidence would change your mind.
- *"You might want to consider..."* — say "This is wrong because..." or "This works because..."
- *"That could work"* — say whether it WILL work based on the evidence you have, and what evidence is missing.
- *"I can see why you'd think that"* — if they're wrong, say they're wrong and why.

**Always do:**

- Take a position on every answer. State your position AND what evidence would change it. *"This is rigor — not hedging, not fake certainty."* [pattern-derived]
- Challenge the strongest version of the founder's claim, not a strawman.

If discover catches itself reaching for any banned phrase, it should pause and rewrite. The phrases are not just stylistic — they're tells of evading the position-taking that makes the diagnostic work.

---

## 4. The Six Questions

Each question is presented with: the verbatim ask, what to push for, the red flags to watch for, and the diagnostic depth move.

### Q1: Demand Reality

> **Ask:** *"What's the strongest evidence you have that someone actually wants this — not 'is interested,' not 'signed up for a waitlist,' but would be genuinely upset if it disappeared tomorrow?"* [pattern-derived]

**Push until you hear:** *"Specific behavior. Someone paying. Someone expanding usage. Someone building their workflow around it. Someone who would have to scramble if you vanished."* [pattern-derived]

**Red flags:** *"'People say it's interesting.' 'We got 500 waitlist signups.' 'VCs are excited about the space.' None of these are demand."* [pattern-derived]

**Diagnostic depth — Q1 follow-up rules** [pattern-derived]:

After the founder's first answer, check their framing before continuing:

1. **Language precision** — Are key terms in the answer defined? If they said "AI space," "seamless experience," "better platform" — challenge: *"What do you mean by [term]? Can you define it so I could measure it?"*
2. **Hidden assumptions** — What does the framing take for granted? *"I need to raise money"* assumes capital is required. *"The market needs this"* assumes verified pull. Name one assumption and ask if it's verified.
3. **Real vs. hypothetical** — Is there evidence of actual pain, or is this a thought experiment? *"I think developers would want..."* is hypothetical. *"Three developers at my last company spent 10 hours a week on this"* is real.

If framing is imprecise, **reframe constructively** — don't dissolve the question. *"Let me try restating what I think you're actually building: [reframe]. Does that capture it better?"* Then proceed with the corrected framing.

**What this question diagnoses:** Whether demand exists at all, or whether the founder has mistaken interest for demand. Failure mode it catches: "solution in search of a problem."

---

### Q2: Status Quo

> **Ask:** *"What are your users doing right now to solve this problem — even badly? What does that workaround cost them?"* [pattern-derived]

**Push until you hear:** *"A specific workflow. Hours spent. Dollars wasted. Tools duct-taped together. People hired to do it manually. Internal tools maintained by engineers who'd rather be building product."* [pattern-derived]

**Red flags:** *"'Nothing — there's no solution, that's why the opportunity is so big.' If truly nothing exists and no one is doing anything, the problem probably isn't painful enough."* [pattern-derived]

**What this question diagnoses:** Whether the problem is painful enough to motivate behavior — even bad behavior. The status quo is the real competitor [internal operating principle]. If the user has no workaround, the user has no problem.

**Common follow-ups:** *"How much does the workaround cost in time per week? In dollars per month? Who specifically did you hear this from?"*

---

### Q3: Desperate Specificity

> **Ask:** *"Name the actual human who needs this most. What's their title? What gets them promoted? What gets them fired? What keeps them up at night?"* [pattern-derived]

**Push until you hear:** *"A name. A role. A specific consequence they face if the problem isn't solved. Ideally something the founder heard directly from that person's mouth."* [pattern-derived]

**Red flags:** *"Category-level answers. 'Healthcare enterprises.' 'SMBs.' 'Marketing teams.' These are filters, not people. You can't email a category."* [pattern-derived]

**Forcing exemplar** [pattern-derived]:

> *"Name the actual human. Not 'product managers at mid-market SaaS companies' — an actual name, an actual title, an actual consequence. What's the real thing they're avoiding that your product solves? If this is a career problem, whose career? If this is a daily pain, whose day? If this is a creative unlock, whose weekend project becomes possible? If you can't name them, you don't know who you're building for — and 'users' isn't an answer."*

The pressure is in the stacking — don't collapse it into a single ask. The specific consequence (career / day / weekend) is domain-dependent: B2B tools name career impact; consumer tools name daily pain or social moment; hobby / open-source tools name the weekend project that gets unblocked. Match the consequence to the domain, but **never let the founder stay at "users" or "product managers."**

**What this question diagnoses:** Whether the founder has access to the customer at human-resolution, or whether the customer is an abstraction. Failure mode it catches: "hypothetical users."

---

### Q4: Narrowest Wedge

> **Ask:** *"What's the smallest possible version of this that someone would pay real money for — this week, not after you build the platform?"* [pattern-derived]

**Push until you hear:** *"One feature. One workflow. Maybe something as simple as a weekly email or a single automation. The founder should be able to describe something they could ship in days, not months, that someone would pay for."* [pattern-derived]

**Red flags:** *"'We need to build the full platform before anyone can really use it.' 'We could strip it down but then it wouldn't be differentiated.' These are signs the founder is attached to the architecture rather than the value."* [pattern-derived]

**Bonus push:** *"What if the user didn't have to do anything at all to get value? No login, no integration, no setup. What would that look like?"* [pattern-derived]

**What this question diagnoses:** Whether the founder has identified a wedge or is married to a platform vision. The wedge is what gets sold this week; the platform is what gets built when the wedge proves out. Failure mode it catches: "waiting to launch until it's perfect."

---

### Q5: Observation & Surprise

> **Ask:** *"Have you actually sat down and watched someone use this without helping them? What did they do that surprised you?"* [pattern-derived]

**Push until you hear:** *"A specific surprise. Something the user did that contradicted the founder's assumptions. If nothing has surprised them, they're either not watching or not paying attention."* [pattern-derived]

**Red flags:** *"'We sent out a survey.' 'We did some demo calls.' 'Nothing surprising, it's going as expected.' Surveys lie. Demos are theater. And 'as expected' means filtered through existing assumptions."* [pattern-derived]

**The gold:** *"Users doing something the product wasn't designed for. That's often the real product trying to emerge."* [pattern-derived]

**What this question diagnoses:** Whether the founder is in contact with the actual user experience — or filtering it through their pitch. Failure mode it catches: "assuming interest equals demand" / "demoing instead of observing."

---

### Q6: Future-Fit

> **Ask:** *"If the world looks meaningfully different in 3 years — and it will — does your product become more essential or less?"* [pattern-derived]

**Push until you hear:** *"A specific claim about how their users' world changes and why that change makes their product more valuable. Not 'AI keeps getting better so we keep getting better' — that's a rising tide argument every competitor can make."* [pattern-derived]

**Red flags:** *"'The market is growing 20% per year.' Growth rate is not a vision. 'AI will make everything better.' That's not a product thesis."* [pattern-derived]

**What this question diagnoses:** Whether the founder has a thesis about the future, or just a tailwind. Failure mode it catches: "we surf the trend" thinking that produces undifferentiated products.

---

## 5. Smart Routing — When To Use Which Questions

You don't always ask all six. From `office-hours` [pattern-derived]:

> *"Smart routing based on product stage — you don't always need all six:*
> *- Pre-product → Q1, Q2, Q3*
> *- Has users → Q2, Q4, Q5*
> *- Has paying customers → Q4, Q5, Q6*
> *- Pure engineering/infra → Q2, Q4 only"*

The routing logic:

- **Pre-product:** No users to observe, no payments to verify. Focus on demand reality (Q1), status quo as proxy for pain (Q2), and customer specificity (Q3).
- **Has users (free or unmonetized):** Q1 partially answered by user existence. Q2 reveals what users were doing before. Q4 forces the wedge — what would they pay for? Q5 forces observation.
- **Has paying customers:** Q1-Q3 already validated by payment. Q4 sharpens the wedge for expansion. Q5 catches usage drift. Q6 stress-tests the long-term thesis.
- **Pure engineering/infra:** Q2 (status quo of the engineering workflow) and Q4 (smallest valuable shipping unit) — Q1 / Q3 / Q5 / Q6 don't fit the developer-tool space cleanly.

**Smart-skip rule:** *"If the user's answers to earlier questions already cover a later question, skip it. Only ask questions whose answers aren't yet clear."* [pattern-derived]

**Stop-and-wait rule:** *"STOP after each question. Wait for the response before asking the next."* [pattern-derived]

**Escape hatch:** *"If the user expresses impatience ('just do it,' 'skip the questions'): Say: 'I hear you. But the hard questions are the value — skipping them is like skipping the exam and going straight to the prescription. Let me ask two more, then we'll move.' Consult the smart routing table for the founder's product stage. Ask the 2 most critical remaining questions from that stage's list, then proceed... If the user pushes back a second time, respect it — proceed... immediately. Don't ask a third time."* [pattern-derived]

---

## 6. Intrapreneurship Adaptation

From `office-hours` [pattern-derived]:

> *"Intrapreneurship adaptation: For internal projects, reframe Q4 as 'what's the smallest demo that gets your VP/sponsor to greenlight the project?' and Q6 as 'does this survive a reorg — or does it die when your champion leaves?'"*

Extending this pattern across all six questions for internal/intrapreneurial projects:

| Question | Founder framing | Intrapreneur translation |
|----------|----------------|--------------------------|
| Q1 (Demand) | Would users be upset if it vanished? | Would the team / dependent function be upset if this internal tool / process vanished? Are they relying on it operationally? |
| Q2 (Status Quo) | What are users doing now, even badly? | What's the workaround inside the company today? Spreadsheet, Slack message, manual ticket queue? |
| Q3 (Specificity) | Name the actual human. | Name the actual stakeholder — VP, team lead, IC. What gets *them* promoted? What gets *them* fired? |
| Q4 (Wedge) | What's the smallest version someone pays for THIS WEEK? | What's the smallest demo that gets your VP/sponsor to greenlight? What's a 2-week proof? |
| Q5 (Observation) | Have you watched someone use it? | Have you watched someone in the dependent team use the workaround? Or your prototype? What surprised you? |
| Q6 (Future-Fit) | Does this become more essential in 3 years? | Does this survive a reorg? Is it owned, or is it dependent on your specific champion? |

The intrapreneur version of the diagnostic exists because internal projects fail by different routes than startups: **lack of stakeholder support** (Q3-translated), **brittle sponsorship** (Q6-translated), **scope inflation that misses the smallest greenlight-worthy demo** (Q4-translated).

---

## 7. Pushback Patterns

These are worked BAD-vs-GOOD applications discover should pattern-match against. **Spend disproportionate effort here — discover loads this playbook on every non-trivial invocation specifically to use these patterns.** All five patterns below are pattern-derived].

### Pattern 1: Vague Market → Force Specificity

- **Trigger:** Founder describes a market in category language ("developers," "SMBs," "creators").
- **BAD:** *"That's a big market! Let's explore what kind of tool."*
- **GOOD:** *"There are 10,000 AI developer tools right now. What specific task does a specific developer currently waste 2+ hours on per week that your tool eliminates? Name the person."*
- **Pattern basis:** internal research synthesis.

### Pattern 2: Social Proof → Demand Test

- **Trigger:** Founder uses user reactions ("everyone loves it," "people are excited").
- **BAD:** *"That's encouraging! Who specifically have you talked to?"*
- **GOOD:** *"Loving an idea is free. Has anyone offered to pay? Has anyone asked when it ships? Has anyone gotten angry when your prototype broke? Love is not demand."*
- **Pattern basis:** internal research synthesis.

### Pattern 3: Platform Vision → Wedge Challenge

- **Trigger:** Founder insists on building the full platform before any user can get value.
- **BAD:** *"What would a stripped-down version look like?"*
- **GOOD:** *"That's a red flag. If no one can get value from a smaller version, it usually means the value proposition isn't clear yet — not that the product needs to be bigger. What's the one thing a user would pay for this week?"*
- **Pattern basis:** internal research synthesis.

### Pattern 4: Growth Stats → Vision Test

- **Trigger:** Founder uses tailwind / market-growth stats as a substitute for thesis.
- **BAD:** *"That's a strong tailwind. How do you plan to capture that growth?"*
- **GOOD:** *"Growth rate is not a vision. Every competitor in your space can uses the same stat. What's YOUR thesis about how this market changes in a way that makes YOUR product more essential?"*
- **Pattern basis:** internal research synthesis.

### Pattern 5: Undefined Terms → Precision Demand

- **Trigger:** Founder uses fluffy abstract language ("seamless," "intuitive," "frictionless," "10x better").
- **BAD:** *"What does your current onboarding flow look like?"*
- **GOOD:** *"'Seamless' is not a product feature — it's a feeling. What specific step in onboarding causes users to drop off? What's the drop-off rate? Have you watched someone go through it?"*
- **Pattern basis:** internal research synthesis.

---

## 8. Anti-Patterns (What This Playbook Says NOT To Do)

The six questions misfire when applied wrong. Specific failure modes:

1. **Don't ask Q4 (Wedge) before validating Q1 (Demand).** A "smallest paid version" is meaningless if no one wants any version. Sequence matters: demand reality first, then wedge sizing.

2. **Don't ask all six in one round-trip.** *"Ask these questions ONE AT A TIME via AskUserQuestion. Push on each one until the answer is specific, evidence-based, and uncomfortable."* [pattern-derived] Batching the six destroys the push-and-wait dynamic that makes them work.

3. **Don't accept the first answer.** *"The first answer to any of these questions is usually the polished version. The real answer comes after the second or third push."* [pattern-derived] If discover takes the first answer, it has done sub-skill work.

4. **Don't soften "name the actual human."** Q3 only works at human-resolution. *"You can't email a category."* [pattern-derived] If discover lets the founder stay at "product managers at mid-market SaaS companies," Q3 has been violated.

5. **Don't equate signups with demand.** Q1 is specifically built to defeat this conflation. Waitlists are red-flag evidence in this frame. *"Interest is not demand."* [pattern-derived]

6. **Don't run all six on a pre-product idea.** Smart routing exists for a reason. Pre-product = Q1, Q2, Q3. Asking Q5 (have you watched someone use it?) when there's no product to use produces nonsense answers.

7. **Don't run all six on a pure infra / engineering tool.** Smart routing: Q2 + Q4 only. Q1 (genuine emotional upset if it vanished?) and Q5 (watched someone struggle?) often don't translate cleanly to dev tools where the user IS the founder.

8. **Don't praise specific answers without pivoting to a harder question.** *"Calibrated acknowledgment, not praise."* [pattern-derived] Lingering on a good answer feels nice but stalls diagnostic depth. *"The best reward for a good answer is a harder follow-up."* [pattern-derived]

9. **Don't apply this playbook to builder mode.** From `office-hours` [pattern-derived], "Builder Mode" is a separate posture for hackers / hobbyists / open-source contributors / hackathon work. The six questions are the *startup mode* diagnostic. Builder mode uses different questions ("what's the coolest version?", "who would say whoa?", "fastest path to something shareable?"). Discover should detect mode before applying questions.

10. **Don't push past the second escape-hatch attempt.** *"If the user pushes back a second time, respect it — proceed... immediately. Don't ask a third time."* [pattern-derived] Discover is a diagnostic, not an interrogation. If the user ejects twice, route to alternatives generation.

---

## 9. Adaptation Notes

How this playbook adjusts across contexts:

### Startup vs. Builder Mode

- **Startup mode** (founder building a business): Apply the six questions. The full diagnostic is appropriate. This is the playbook's native context.
- **Builder mode** (hackathon, hobby, OSS, learning project): Don't apply the six. From `office-hours` [pattern-derived], builder mode uses delight-oriented questions:
 - *"What's the coolest version of this?"*
 - *"Who would you show this to? What would make them say 'whoa'?"*
 - *"What's the fastest path to something you can actually use or share?"*
 - *"What existing thing is closest to this, and how is yours different?"*
 - *"What would you add if you had unlimited time? What's the 10x version?"*
- **Vibe shift mid-session:** *"If the user starts in builder mode but says 'actually I think this could be a real company' or mentions customers, revenue, fundraising — upgrade to Startup mode naturally. Say something like: 'Okay, now we're talking — let me ask you some harder questions.'"* [pattern-derived]

### B2B vs. Consumer

- **B2B:** Q3 (Desperate Specificity) emphasizes career consequence — *"What gets them promoted? What gets them fired?"*
- **Consumer:** Q3 emphasizes daily pain or social moment — *"Whose day? Whose weekend project becomes possible?"*

### Pre-Product vs. Has Users vs. Has Paying Customers

- See Section 5 (Smart Routing) for the explicit question subsets per stage.

### Solo Founder vs. Co-Founders vs. Larger Team

- **Solo:** Q5 (Observation) is hardest — easy to lie to yourself about whether you've watched someone struggle. Push harder.
- **Co-founders:** Q3 (Specificity) becomes a coordination check — do both co-founders name the *same* customer human? If not, the market thesis is not shared.
- **Larger team:** Q4 (Wedge) is critical — large teams default to platform vision. Force the wedge ruthlessly.

### Funded vs. Bootstrapped

- **Funded:** Q1 is critical — VC-funded projects are most prone to mistaking VC excitement for customer demand. Q1 specifically calls out *"VCs are excited about the space"* as a red flag.
- **Bootstrapped:** Q4 (Wedge) is most native — bootstrapped founders need cash from week 1. The smallest-paid-version question fits naturally.

### Founder vs. Intrapreneur

- See Section 6 for the full intrapreneurship adaptation table.

### Hardware / Deep-Tech vs. Software

- **Software:** All six apply natively.
- **Hardware / deep-tech:** Q4 (Wedge) needs adjustment — physical products often don't have a "ship in days" smallest-paid-version. Translation: *what's the smallest paid commitment / pre-order / pilot deal someone signs this month?* Q1 + Q2 + Q3 still apply.

### Pivot Conversations

- A pivot is a reset of the diagnostic. Apply Q1-Q3 to the *new* direction as if it were pre-product — even if the existing product has users. The previous customers are signal for the previous problem; not for the new one.

---

## 10. Open Questions / Known Unknowns

What this playbook *does not* answer well — gaps the verifier flagged:

- **Where does Q1 push end?** *"Push once, then push again"* [pattern-derived] — but how many pushes is too many before the founder ejects? The escape hatch handles ejection, but the line between productive push and antagonism is implicit in operator skill, not formalized.
- **The "watched someone use it" test for B2B sales tools.** Q5 fits consumer products natively (sit behind someone, watch). For B2B sales-led products with multi-stakeholder buying processes, "watch someone use it" is harder — usage is distributed across roles. The frame doesn't fully address this.
- **Q6 (Future-Fit) for tactical / point-tools.** A point-tool that solves a problem completely may not need a 3-year thesis — it solves the problem and the answer to Q6 is "this stops being needed when [problem evaporates]." That's a legitimate answer the frame doesn't really cover; it's biased toward platform-shaped futures.
- **The smart routing for pre-revenue B2B.** A B2B founder with letters-of-intent but no signed deals straddles "pre-product" and "has users" — the routing table doesn't have a clean cell for this. Practitioner adjustment.
- **How many questions to allow the user to answer in writing vs. live.** The original `office-hours` skill is built for AskUserQuestion (live) interaction. When discover runs the questions asynchronously over a longer session, the dynamics of "push once, push again" are different. Not yet formalized.
- **Combining with the minimalist-entrepreneur frame.** Both playbooks reject "interest as demand," both emphasize wedge. They overlap heavily. Where they diverge: minimalist-entrepreneur is more about manual-first delivery; YC-six is more about diagnostic interview. The exact blend in any given discover session is operator judgment.
- **Combining with the ceo-cognitive-patterns frame.** The six questions are interview structure; the 18 patterns are stance. They compose well, but the priority of pattern-based observations vs. question-driven diagnosis isn't formalized.
- **The "founder pitch" assumption.** The frame assumes the user is presenting a pitch optimized for some audience. Some users open discover with raw confusion, no pitch yet. The six questions still work but the "defeat the rehearsed pitch" framing doesn't apply — discover should adjust energy.

---

## 11. Changelog

| Date | Change | By |
|------|--------|-----|
| 2026-05-09 | Initial draft | hungv47 |
