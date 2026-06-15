# Example — Full ICP Walkthrough (Route B)

> Load when an operator is learning the skill OR when synthesis-agent needs to see a worked example of the dispatch → critic → PASS arc end-to-end. This example traces the original SKILL.md worked example with the same 10-gate critic verdict expanded inline. Preserved from the original SKILL.md verbatim where possible — the persona narrative, VoC quotes, and habitat map are illustrative not prescriptive (per the creative-skill ref pattern).

---

## Brief

> "Research my ICP for a project management tool aimed at engineering teams."

---

## Step 0: Pre-Dispatch

**Auto-scan** of README.md + pricing page + /docs returned:

- Product: ProjectSync — async project visibility for engineering teams
- Buyer: Engineering managers at mid-size SaaS companies
- Problem: Hours lost to status updates nobody reads
- Pricing: $12/seat/mo, free for teams ≤5

Warm Start prompt emitted; user confirmed and added:
- Geo focus: US + EU
- Route: B (Full ICP — comprehensive research needed for launch)

Generated `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` with 8 sections (Product, Buyer, Problem, Differentiator, Social Proof, Model, Voice, Primary CTA) + Canonical Terminology table (terms: `project`, `update`, `team`, `seat`). Saved.

---

## Step 1: Scope Interview

- "Who?" → Engineering managers at mid-size SaaS companies (50-200 engineers)
- "What decisions?" → Messaging and channel strategy for launch
- "B2B/B2C?" → B2B, US and EU

**Route confirmed:** B (Full ICP)

---

## Layer 1: Parallel Dispatch

Three agents dispatched simultaneously (one Agent tool call per agent, all in one message).

### Persona Agent returns:

> ### Persona 1: The Overwhelmed EM
> **Demographics:** 30-38, Engineering Manager, B2B SaaS, 50-200 engineers
> **Goals:** (1) Ship on schedule without burning out the team. (2) Give leadership visibility without micromanaging.
> **Frustrations:** "I spend more time telling people what I did than actually doing it." "Our standups are 45 minutes of reading Jira tickets aloud."
> **Day-in-the-life:** Monday 9am — Sarah opens Slack to 47 unread messages, half status updates she needs to compile for her VP by 10am.

### VoC Collector Agent returns:

> 18 quotes across 5 categories from r/ExperiencedDevs, r/engineeringmanagers, G2, Twitter, LinkedIn. Key mechanism quote: "No single tool shows me what my team actually shipped this week — I have to check Jira, GitHub, and Slack separately and piece it together." — r/ExperiencedDevs, weekly-update thread, 2025-10-22

### Habitat Agent returns:

> | Platform | Community | Density | Engagement | Role |
> |----------|-----------|---------|-----------|------|
> | Reddit | r/ExperiencedDevs | H | Engager | Trust |
> | Reddit | r/engineeringmanagers | M | Lurker | Trust |
> | LinkedIn | #engineeringmanagement feed | M | Creator | Discovery |
> | Twitter/X | #engmanagement | L | Lurker | Discovery |
> | Slack | Rands Leadership Slack | H | Engager | Trust |

5 named communities with H/M/L density and Lurker/Engager/Creator engagement. Critical Gate 2 satisfied.

---

## Layer 2: Sequential Dispatch

### 1. Pain Analysis Agent

Receives persona + VoC output. Returns:

> #### 1. Status Update Theater — hours lost compiling updates nobody reads
> - **Level:** Surface → Hidden (spreadsheet workarounds) → Emotional (fear of looking disorganized)
> - **Trigger:** Monday 9am — VP expects status email by 10am
> - **Impact:** 6-8 hrs/week on reporting. Career: EMs who can't show visibility get passed over.
> - **Mechanism:** No single system aggregates team activity. The EM becomes the human integration layer.

Two more pains follow (Standup Fatigue, Visibility Without Micromanagement).

### 2. Decision Psychology Agent

Receives pain analysis output. Returns:

> - **Trigger:** Promoted to manage second team — reporting overhead doubles
> - **Research path:** 1st Reddit (r/ExperiencedDevs) → 2nd G2 comparisons → 3rd free trial
> - **Key biases:** Status-quo bias (invested in current Jira setup), loss aversion (fear of losing data in migration)
> - **Objections:** (1) "We already have Jira" — root: sunk cost + status-quo bias. (2) "My team won't adopt another tool" — root: diffusion of responsibility. (3) "How is this different from Monday.com?" — root: category fatigue.

Named biases (loss aversion, status-quo bias) with manifestation. Objections traced to psychological roots. Critical Gate 4 + critic Gate 4 satisfied.

### 3. Synthesis Agent

Receives ALL upstream (persona + VoC + habitat + pain + psychology). Merges into complete ICP artifact matching the `format-conventions.md` Artifact Template. Adds the Top 3 Emotional Drivers section by triangulating across VoC + pain + psychology:

> ## Top 3 Emotional Drivers
> 1. **Fear of being perceived as unable to scale** — EMs who can't produce visibility for leadership fear being passed over for promotion or labeled as "not ready for director."
>    - Quote: "My skip-level keeps asking me for updates I can't produce fast enough" — r/engineeringmanagers, promo-cycle thread, 2025-09-08
>    - Quote: "I got feedback that I 'lack strategic visibility' and I don't even know what that means" — r/ExperiencedDevs, mentorship thread, 2025-10-14
> 2. **Resentment of work that adds no value** — Compiling updates is labor that creates no artifact, no progress, no learning. The disconnect between effort and output drives a specific kind of burnout.
>    - Quote: "I spent my whole Sunday catching up on status email I should have written Friday" — Twitter, 2025-11-02
>    - Quote: "If I could outsource one part of my job it would be telling people what my team did" — Rands Leadership Slack, #ems channel, 2025-08-30
> 3. **Pride in protecting the team's focus time** — EMs identify as shields. Anything that breaks their team's flow (random pings, repeated questions) feels like a personal failure.
>    - Quote: "My job is to make sure nobody on my team has to think about Jira" — r/engineeringmanagers, hiring-philosophy thread, 2025-11-19
>    - Quote: "I'll absorb 10 extra meetings if it means my engineers get 4 uninterrupted hours" — LinkedIn post, 2025-10-03

Each driver traced to 2+ quotes with platform attribution. Critic Gate 3 satisfied.

### 4. Critic Gate → PASS

All 10 gates pass:

- **Gate 1 (VoC Evidence Integrity):** PASS — All quotes attributed to specific communities (r/ExperiencedDevs, not just Reddit) with dates and context.
- **Gate 2 (Habitat Specificity):** PASS — 5 named communities with H/M/L density and Lurker/Engager/Creator engagement.
- **Gate 3 (Emotional Driver Traceability):** PASS — Exactly 3 drivers, each traced to 2+ attributed quotes.
- **Gate 4 (Decision Psychology Specificity):** PASS — Named biases (status-quo, loss aversion); 3 objections with psychological roots.
- **Gate 5 (Quote Volume & Coverage):** PASS — 18 quotes across 5 categories spanning 5 platforms.
- **Gate 6 (Persona Constraint):** PASS — 1 persona (within max of 2).
- **Gate 7 (Brief Alignment):** PASS — Engineering managers + mid-size SaaS + B2B + US+EU matches brief.
- **Gate 8 (Confidence Labels Complete):** PASS — every finding carries `[Confidence: H|M|L | sources: N]`; no unresolved `L` shipped.
- **Gate 9 (Sample Bias Acknowledged):** PASS — Sample Bias section present and specific to this 5-platform dataset (not a generic disclaimer).
- **Gate 10 (≥5 Sources per Persona):** PASS — persona drawn from 5 named communities across 5 platforms, clearing the 5-source floor.

Artifact delivered to `docs/forsvn/canonical/research/ICP.md`.

---

## Post-write side effects

Per `procedures/dispatch-mechanics.md`:

1. Wrote `docs/forsvn/canonical/research/ICP.md` with frontmatter + Persona 1 + Top 3 Emotional Drivers + Red Flags + Next Step.
2. Updated `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` Product / Buyer / Problem / Differentiator / Voice sections (canonical mirror per Write-back map Q1).
3. Experience write-back:
   - `experience/product.md` ← `Product — one-line: "ProjectSync — async project visibility for engineering teams"`
   - `experience/audience.md` ← `Audience — primary persona: "Engineering Manager, 30-38, B2B SaaS, 50-200 engineers"`, `Audience — pain points (primary): "Status Update Theater, Standup Fatigue, Visibility Without Micromanagement"`, `Audience — geo focus: "US + EU"`
   - Q5 (Route = B) NOT persisted.

---

## What this example traces

- All 4 Critical Gates fired (Gate 1 evidence-only, Gate 2 habitat specificity, Gate 3 max-2 personas — 1 used here, Gate 4 product-context staleness check passed during Pre-Dispatch).
- All 10 critic gates traced through to PASS.
- Layer 1 parallel → Layer 2 sequential dispatch arc.
- Pre-Dispatch Warm Start path (auto-scan + 2 Cold Start questions only).
- Cross-stack contract preserved (Habitat Map 5-column schema, Top 3 Emotional Drivers section, Next Step block).
- Canonical mirror to `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` per the foundational role.

---

## What this example does NOT show

- **Critic FAIL → rewrite cycle.** All 10 gates passed on first dispatch. For a FAIL walkthrough, see `agents/critic-agent.md` § "FAIL example."
- **Route A (Quick ICP).** This walkthrough used Route B. Route A would skip habitat-agent + decision-psychology-agent and annotate the artifact with the omissions per `format-conventions.md` § "Route A (Quick ICP) artifact differences."
- **Route C (called by another skill).** A campaign-plan invocation would read `docs/forsvn/canonical/research/ICP.md` and check freshness; if <30 days, return existing; if >30 days, warn and recommend re-run.
- **`--fast` mode.** Would auto-route to Route A if context is sufficient for Warm Start; would still emit Cold Start questions if context is thin (Critical Gate 1 floor).
- **Multi-persona artifact.** This example shipped 1 persona. A multi-persona artifact has the same structure repeated as `## Persona 2:` with optional `## Segment Rationale` documenting who was cut.

---

## Reading the critic verdict format

The critic-agent output structure (per `agents/critic-agent.md`) is:

```markdown
## Verdict: [PASS / FAIL]

## Evaluation

### Gate 1: VoC Evidence Integrity
- Status: [PASS / FAIL]
- [Assessment details]

[... gates 2-7 ...]

## [If FAIL] Fix Instructions

### Fix 1: [Specific problem]
- **What's wrong:** [...]
- **Where:** [section + line reference]
- **Re-dispatch to:** [agent name]
- **Fix instruction:** [...]

## [If PASS] Artifact Notes
- [Strengths worth noting]
- [Minor suggestions that don't block PASS]
```

Verdict is binary — no "PASS with reservations." Either all 10 gates pass or the verdict is FAIL.
