<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: Brand Narrative Tension
lifecycle: canonical
status: stable
produced_by: brand-system
load_class: REFERENCE
---

# Brand Narrative Tension

> Checks that protect a BRAND.md from collapsing into either sterile corporate prose or melodrama. Owned upstream by **strategy-agent** (sustainability + creator/corporate fit) and **personality-agent** (progress-through-struggle, comeback arc, when true). Enforced as FAIL gates by **critic-agent**.

The Origin Story, Values, Personality, and Voice sections all carry an implicit promise: *this is who we are*. The danger lives at both ends. A brand that smooths every edge reads sterile and forgettable. A brand that manufactures struggle to look authentic burns trust the first time the audience checks the receipts.

Narrative tension is the discipline of choosing which truths to surface — and refusing to invent the ones that don't exist.

---

## The 5 Tension Dimensions

Each dimension names a fork. Strategy-agent or personality-agent picks a side **based on the brief**, not as a stylistic preference. If the brief doesn't support either side, the section says so and routes to a Cold Start question rather than guessing.

### 1. Curated promise vs lived reality

**The fork:** Does the brand's surface (origin story, values, voice) match what the team can *demonstrate* — public commits, response times, refund policies, support transcripts, founder behavior in interviews?

| Healthy | Unhealthy |
|---|---|
| Promise is narrower than capability ("we ship on Fridays" — verified by changelog) | Promise is broader than capability ("we obsess over every detail" — denied by recent ship logs) |
| Origin Story names the constraint that's still true (small team, no VC, opinionated scope) | Origin Story claims a constraint that quietly stopped being true two years ago |

**Strategy-agent decision:** Before writing the Origin Story or Values section, scan the brief for any claim the team would have to *defend* publicly six months from now. If a claim is aspirational rather than current, mark it `[ASPIRATIONAL: needs honest framing]` and re-write so the line describes what's true *now* and what the team is building toward — separately.

**Anti-pattern:** publishing as fact what is actually intent.

---

### 2. Public persona sustainability

**The fork:** Does the brand demand a public persona the operator(s) can sustain at the brand's stated cadence, for years?

This is the question almost no brand book asks, and the question most under-resourced brands fail on within a year. A "transparent, in-public" brand requires someone to actually be in public, often, with a stable voice. A "high-energy, contrarian" brand requires someone whose comment-section temperament tolerates pile-ons. A "deeply technical, no-fluff" brand requires sustained writing or speaking capacity.

| Healthy | Unhealthy |
|---|---|
| The operator's actual default rhythm matches the brand's promised rhythm | The brand promises a rhythm the operator can sustain for 90 days, not 900 |
| Persona is recognizable across surfaces (LinkedIn → docs → newsletter) without effort | Persona changes register every place the operator shows up — masks slip |
| Brand explicitly leaves room for off-camera time, family, recovery | Brand implicitly demands always-on visibility |

**Strategy-agent decision:** In the Pre-Dispatch Cold Start, surface the question — *who will be the public voice, at what cadence, for how long?* If the answer doesn't exist, the persona claim doesn't ship. If the answer is "the founder, weekly, indefinitely," the strategy section names that constraint and the brand commits to a register the founder actually uses.

**Anti-pattern:** scripting a public figure the team cannot sustainably perform.

---

### 3. Progress through struggle — when true

**The fork:** If the brand's origin involves genuine constraint, failure, or recovery, is that story load-bearing — or is it being added because "founder origin stories sell"?

This is where many brand books go wrong in the same direction: they bolt on a contrived adversity beat ("we almost went broke," "I was burned out and rebuilt from zero") to satisfy a perceived narrative shape. Audiences read it as costume drama within two paragraphs.

| Healthy | Unhealthy |
|---|---|
| Struggle is specific, dated, and supported by evidence the audience can verify | Struggle is hand-wavy ("rough year," "tough times") with no anchor |
| The progress part is recent enough to still be in motion — not a 10-year-old victory lap | The progress part is a closed arc that no longer informs current decisions |
| The brand is comfortable saying "we got lucky here" or "we didn't earn this part" | Every gain attributed to grit; no luck, no privilege, no help acknowledged |

**Personality-agent decision:** If the brief genuinely contains a constraint-and-progress arc, the Personality / Emotional Journey sections can use it as a backbone — *and* must name the part that wasn't earned (timing, prior connections, capital, a generous early customer). If the brief contains no such arc, **do not invent one.** A brand can be excellent without trauma.

**Anti-pattern:** retrofitted hero's journey on a brand whose actual story is "we noticed a gap, we built carefully, it worked."

---

### 4. Comeback / return arc — when relevant

**The fork:** Is this a brand returning from a public failure, retirement, pivot, or hiatus — or is "return" rhetoric being used as a styling device?

A genuine comeback brand has different stakes than a debut brand: the audience is partly composed of people who watched the prior version, and the new brand has to acknowledge what changed rather than pretend the prior chapter didn't happen.

| Healthy | Unhealthy |
|---|---|
| Brand names the prior version, what stopped working, and what's different now | Brand pretends the prior chapter didn't exist; rewrites history |
| Returns at a different scale or scope ("smaller and sharper," "narrower audience") | Returns claiming everything is the same, just better |
| Acknowledges audience members who left and why | Treats the audience as continuous when it isn't |

**Personality-agent decision:** If the brief involves a return, the Emotional Journey's "first encounter" touchpoint needs to handle returning visitors AND first-time visitors — they're meeting different products. If the brief involves no return, omit this dimension. **Comeback rhetoric on a debut brand reads as borrowed gravitas.**

**Anti-pattern:** styling a debut as a return because returns sound earned.

---

### 5. Creator-led brand vs corporate control fit

**The fork:** Is the brand voice driven by a named human, by a team's collective voice, or by a company's institutional voice? Which fits the audience's habit of engagement?

This is a fit question, not a quality ranking. Creator-led brands compound differently from team-led brands compound differently from institutional brands. The brand book has to choose, and the visual system, voice, and Digital Touchpoints all change based on the choice.

| Mode | When to use | When NOT to use |
|---|---|---|
| **Creator-led** | One human is the public engine; audience knows their face/voice; the product is a natural extension of their work | Team is plural and rotates; founder doesn't want to be the brand; product outgrows one voice |
| **Team-collective** | Multiple named voices appear publicly (founders, leads, engineers); voice is consistent across them | Only one person actually shows up; rest of the team is invisible — pretending otherwise breaks |
| **Institutional** | Company is plural enough that no single voice represents it; audience expects an institutional register | Audience expects a human; institutional voice reads as evasion |

**Strategy-agent decision:** Pick one and write the Voice attributes, tone range, and Digital Touchpoints to that mode. If the answer is "creator-led but we want institutional polish later," name the transition plan explicitly — *which surfaces hold the creator voice, which surfaces speak institutionally, what triggers the shift.* Don't ship a brand that can't tell you who's speaking.

**Anti-pattern:** Voice section that reads creator-led, Digital Touchpoints that read institutional, with no plan for which is true.

---

## The 4 Critic Questions

Critic-agent runs these against the merged BRAND.md. Each FAILs with a specific re-dispatch target.

### Q1. Does the brand demand a persona the operator cannot sustain?

**Check:** Cross-reference Voice attributes + Digital Touchpoints + Brand Mark sections against any Pre-Dispatch context on the operator (named founder, team size, public-speaking history, prior content cadence). If the brand promises a rhythm that the operator's track record can't support, **FAIL** and re-dispatch strategy-agent to narrow the promise.

**FAIL signal:** Voice says "ships in public weekly"; brief says "1-person team, founder posts quarterly."

### Q2. Are values expressed as real tradeoffs?

**Check:** This is already canonical (anti-patterns.md #2). Narrative tension extends it: every value's "X over Y" must survive the *would-the-team-actually-say-Y-out-loud* test. "Speed over polish" only works if the team is willing to publicly defend shipping unpolished work. "Transparency over comfort" only works if the team has actually published an uncomfortable thing.

**FAIL signal:** Values look "X over Y" shaped but the Y has never been acted on publicly.

### Q3. Is community resonance specific, or just "impact" language?

**Check:** Search the merged BRAND.md for "community," "impact," "people," "lives," "world." Each occurrence must name a specific group and a specific change. Generic resonance language ("we want to make an impact on the world") is sterile and forgettable.

**FAIL signal:** Two or more occurrences of generic impact language without a named group + named change.

### Q4. Is the narrative exploiting pain instead of earning trust?

**Check:** If the Origin Story or Emotional Journey leans on adversity, the adversity must be:
- (a) the operator's own, not the audience's pain styled as the operator's
- (b) specific enough to verify (dated, named)
- (c) connected to what the brand *does differently because of it*, not just what it *feels about it*

Brands that surface audience trauma as a *brand voice flex* ("we know what you're going through") without product-level evidence of that knowledge fail this gate. So do brands that import founder-trauma rhetoric onto a product that has no actual connection to it.

**FAIL signal:** Pain narrative present without specificity, ownership, or product-level consequence.

---

## When This Reference Does NOT Apply

- **Quick Brand (Route A)** — narrative tension checks Q3 and Q4 still run (cheap to enforce), but the Origin Story / Comeback / Creator-led dimensions are deferred to Route B. Quick Brand uses the simpler version: "if the line isn't true now, don't ship it."
- **B2B institutional brands with no public face** — Dimensions 2, 3, 5 fold into "is the institutional voice consistent?" Skip the persona-sustainability check; institutions don't have personas in the same sense.
- **White-label / OEM brands** — Most of this file is moot; the brand isn't expressing identity to end users. Run Q2 only.

---

## Cross-references

- `references/brand-archetypes.md` — archetype selection happens first; narrative tension is the *honesty layer* applied to whichever archetype is chosen.
- `references/brand-voice.md` — voice attributes inherit the creator-led / team-collective / institutional decision made here.
- `references/anti-patterns.md` — patterns 2 (generic values), 14 (upstream context skipped) overlap with this file's checks.
- `agents/critic-agent.md` — Quality Gate Checklist (BRAND.md narrative tension subsection) wires the 4 critic questions as FAIL gates.
- `agents/strategy-agent.md` — Domain Instructions § Narrative Tension Ownership names dimensions 1, 2, 5 as strategy's responsibility.
- `agents/personality-agent.md` — Domain Instructions § Narrative Tension Ownership names dimensions 3, 4 (conditional — only when the brief supports them).
