# Frameworks: Cold-Email Copywriting Library

Named copywriting frameworks for the **message body** — the persuasion arc inside the structure. Frameworks are *thinking patterns, not templates*: they teach what a body needs to do, not what to paste. Reword every example to the prospect's world; the swap-test (see § Quality below) rejects anything a competitor could send unchanged.

**How this relates to `structures.md`.** `structures.md` picks the *shape* of the message from **signal strength** (O→P→P→A for a strong observable signal, Q→V→A when no signal exists, etc.). This file picks the *persuasion arc* from **the reader's decision profile and seniority**. They compose: a signal-4 services touch can run an O→P→P→A *structure* whose body follows a **PAS** *arc*. When `saraev-four-step.md` is selected (touch 1 to a zero-trust stranger), it supplies both shape and arc and these frameworks step aside.

The strategist selects from this library via the framework-selector hook (SKILL.md § Pre-Dispatch). One framework per message — mixing arcs produces the "observation → question → proof → story" mush the structure rules already ban.

---

## The library

Each entry: **structure** (the arc), **best-for** (when it wins), and a **worked example** (generic — rewrite to the prospect).

### PAS — Problem, Agitate, Solution

- **Structure:** Name a pain the prospect feels → amplify its real cost/consequence → present the solution + a soft CTA.
- **Best for:** Problem-aware but not solution-aware prospects. The default workhorse when you know the pain and have proof. Mid-level operators who own the pain day-to-day.
- **Example:**
  > Most heads of sales at your stage lose ~5 hours a week rebuilding CRM reports by hand — time not spent coaching reps, and forecasts that reach the board already stale. We auto-generate the same reports in real time; one ops team cut reporting time 80%. Worth a look?

### BAB — Before, After, Bridge

- **Structure:** Paint the current painful state → paint the ideal future state → position your product as the bridge between them.
- **Best for:** Transformation offers with a clean before/after. Emotional decision-makers who buy the outcome, not the spec.
- **Example:**
  > Right now your reps probably source their own leads — feast one quarter, famine the next. Picture qualified leads landing daily on autopilot, reps selling full-time. That gap is what we close; one customer added 40% pipeline in 90 days. Can I show you how?

### QVC — Question, Value, CTA

- **Structure:** One targeted pain question → one line of value → one direct next step.
- **Best for:** C-suite and brevity-obsessed readers who skim on mobile. Qualifies interest in three sentences.
- **Example:**
  > Are your SDRs spending more time researching than selling? We automate prospect research so reps stay in conversations — clients book 3x more meetings per rep. Worth ten minutes?

### AIDA — Attention, Interest, Desire, Action

- **Structure:** Hook (stat or contrarian line) → connect to their specific challenge → social proof / outcome → clear CTA.
- **Best for:** Data-driven readers and high-ticket pitches backed by strong numbers. Leans on a real, owned stat.
- **Example:**
  > Teams in your category lose ~30% of leads to manual outreach. Given your growth this quarter, pipeline velocity is likely top of mind. One customer cut time-to-contact 60% on our platform. Worth fifteen minutes?

### PPP — Praise, Picture, Push

- **Structure:** A genuine, specific compliment → a picture of how things could be better → a gentle push to act.
- **Best for:** Senior prospects who respond to relationship-building. **Requires a real trigger** — fake praise is the fastest delete.
- **Example:**
  > Your talk on SDR ramp time was sharp — the "hidden cost of onboarding" framing especially. What if ramp halved? Our in-inbox coach scores reps' emails live from day one. Open to a quick chat?

### Star-Story-Solution

- **Structure:** Introduce a character (a real customer) → tell their challenge as a short narrative → reveal the result your product drove.
- **Best for:** When you have a strong, named customer-success story. Humanizes the pitch; memorable for relationship-driven buyers.
- **Example:**
  > A VP Sales at a Series B ran 5 SDRs against a rival's 20 and was losing on volume. Her team adopted our prospecting tool and sent personalized email at 3x pace without dropping quality — they out-booked the rival's whole team in 90 days. Happy to share how it maps to your setup.

### SCQ — Situation, Complication, Question

- **Structure:** State their current reality → introduce the complication that reality creates → ask the question that speaks to the resulting need (optional: a one-line answer).
- **Best for:** Consultative selling. Mirrors how professionals brief leadership; lands with analytical, deliberate buyers.
- **Example:**
  > Your team doubled this year. That usually means onboarding is eating into selling time. How are you handling ramp for the new hires?

### ACCA — Awareness, Comprehension, Conviction, Action

- **Structure:** Contrarian awareness hook → explain the benefit plainly → provide proof (conviction) → strong CTA.
- **Best for:** Analytical, evidence-first buyers — engineers, CFOs, ops leaders who need a reason before a meeting.
- **Example:**
  > Most teams measure rep *activity*. The top performers measure rep *efficiency*. When one team switched, they booked 40% more meetings with fewer emails. Worth seeing the method?

### 3Cs — Compliment, Case Study, CTA

- **Structure:** A specific compliment → a directly relevant case study → a low-bar CTA.
- **Best for:** Agency and services outreach where a comparable case study does the heavy lifting. Brief.
- **Example:**
  > Big fan of what you've shipped this year. We just built the same kind of system for a peer in your space — cut their turnaround in half. Have a couple more ideas. Interested?

### Mouse Trap

- **Structure:** One observation + one binary value-prop question. One to two sentences, total.
- **Best for:** Maximum brevity; an impulsive, curiosity-driven reply. Mobile-first channels (LinkedIn DM, SMS).
- **Example:**
  > Looks like you're hiring reps. Want a more granular read on how they're ramping on email?

### Justin Michael Method

- **Structure:** Trigger / pain → solution hint → binary CTA. One to three sentences, no intro line.
- **Best for:** High-velocity SDR motions, mobile-optimized, deliberately polarizing. Spend ≤1 minute on personalization; use persona/industry-level signals, or quote the prospect's own words from a talk or interview when they're a top-tier target.
- **Example:**
  > Saw you're scaling outbound. Most teams at that point drown in unqualified replies before they fix routing. Want the 2-minute fix?

### Vanilla Ice Cream

- **Structure:** Observation → problem/insight → credibility → solution → call-to-conversation. Five parts, plainly sequenced.
- **Best for:** A universal "base" arc that works across channels and personas when you're unsure which sharper framework fits.
- **Example:**
  > You're posting a lot about attribution gaps. That usually means marketing and sales are crediting the same deals differently. We've untangled this for three ops teams in your stage — typically two weeks to a clean model. Worth comparing notes?

### PASTOR — Problem, Amplify, Story, Testimony, Offer, Response

- **Structure:** Problem → amplify its cost → story of someone who faced it → testimony/proof → the offer → the response you want.
- **Best for:** Longer-form messages and **multi-email sequences** — consulting, education, complex B2B. Each element can carry across separate touches rather than crowding one email.
- **Example (distributed across a sequence):** Touch 1 = Problem + Amplify; touch 2 = Story + Testimony; touch 3 = Offer + Response. No single email tries to do all six.

---

## Framework selector (decision logic)

The strategist runs this in Pre-Dispatch. **Inputs:** recipient *seniority*, decision *profile* (data-driven / emotional / brevity-obsessed), and relationship *warmth* (cold / warm-adjacent / referral). **Output:** the top 2-3 candidate frameworks + a one-line reason, from which it commits to one.

| Signal | Pulls toward |
|---|---|
| **Seniority — C-suite / founder** | QVC, Mouse Trap, SCQ (respect their time; consultative if a real complication exists) |
| **Seniority — mid-level operator** | PAS, ACCA, BAB (they own the pain; pain-first or transformation arcs land) |
| **Profile — data-driven** | AIDA, ACCA, SCQ (lead with a stat or evidence chain; needs an owned number) |
| **Profile — emotional / outcome-buyer** | BAB, Star-Story-Solution, PPP (paint the after; story over spec) |
| **Profile — brevity-obsessed** | QVC, Mouse Trap, Justin Michael (≤3 sentences, binary ask) |
| **Warmth — cold, zero trust** | defer to `saraev-four-step.md`; else PAS / AIDA with hard proof |
| **Warmth — warm-adjacent / referral** | PPP, 3Cs, Star-Story-Solution (lead with the relationship or the named case) |
| **Sequence — multi-email** | PASTOR (spread the six beats across touches) |

**Resolution rule (signal-based starting point, not a mandate):** intersect the rows that apply. The framework appearing in the most relevant rows is the default pick — if a better read of this specific prospect points elsewhere, trust it and note the departure in the change log. Ties break toward the shorter arc for cold/high-seniority, the richer arc for warm/emotional. If no row fits cleanly, fall back to **PAS** (problem-aware default) or **Vanilla Ice Cream** (universal base). Record the chosen framework + the two runners-up + the one-line reason in the strategist change log.

**Worked selection.** Recipient = VP Eng (mid-level→senior), profile = data-driven, warmth = cold with a real signal (a conference talk you can quote). Rows hit: data-driven → {AIDA, ACCA, SCQ}; mid-level → {PAS, ACCA, BAB}; cold-with-proof → {PAS, AIDA}. **ACCA** appears in two data-relevant rows and suits an evidence-first engineer → pick ACCA, runners-up AIDA / SCQ, reason "analytical buyer, needs proof before a meeting; contrarian hook fits the quotable talk."

---

## Quality — competitor swap test

Every proof line and value claim in the body must pass the **competitor swap test** before the message ships: if a direct competitor could send the same line without lying, the claim is generic and does no work. This is the same independent auto-fail the copy skills apply — full procedure, swappable-vs-defensible examples, and annotation contract in [`../_shared/copy-validation-rubric.md`](../_shared/copy-validation-rubric.md) (shared across the write-\* skills). In outreach the swap subject is the *sender*: "could a rival vendor send this proof line truthfully?" A swappable proof line ("trusted by leading teams") fails regardless of how the framework reads; tie it to a named client, an owned number, or a proprietary mechanism. The critic enforces this inside its Specificity dimension (`agents/critic.md` § 5).

---

## Rules that apply to every framework

- **One framework per message.** Mixing arcs is the same failure as mixing structures — pick one, commit, cut the rest.
- **The example is a pattern, not paste.** Rewrite every line to the prospect's world; a body that survives the prospect's name being swapped out is a template, and templates get the swap-test auto-fail.
- **Proof must be specific or absent.** A framework with a hollow proof slot ("many clients saw results") is worse than the same framework with that slot cut.
- **Reader's world dominates.** Whatever the arc, the first line after the salutation is about them, not you (the You > me ratio gate still applies).
- **Framework serves the message, not the reverse.** If none fit, write freeform under the structure rules. Frameworks are tools.
