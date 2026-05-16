<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

# Pre-Dispatch Protocol

> Canonical spec for how every skill in the stack handles the moment between *user invocation* and *agent dispatch*. Every SKILL.md points here.

## Purpose

Two failure modes this protocol prevents:

1. **Skill fabricates from thin context** — user gives a one-liner, skill doesn't ask, output reflects assumptions instead of intent. Quality fails silently.
2. **Skill grills the user** — every invocation feels like a tax form; user disengages or works around the skill. Friction fails loudly.

Solution: each skill calibrates a **Pre-Dispatch** moment that is **bounded** (3-5 questions max), **decision-relevant** (every Q changes the output), **bundled** (one round-trip, not socratic), and **amortized** (answers persist in `skills-resources/experience/` so the next skill never re-asks).

---

## The Two Flows

Every skill invocation routes to exactly one of these:

### Cold Start
*Triggered when:* none of the needed dimensions are resolvable from pipeline artifacts (`research/`, `brand/`, `architecture/`, `.agents/skill-artifacts/`) OR `skills-resources/experience/`.

The skill emits a **single bundled prompt** with:

1. **One-sentence framing** — what the skill is and what it needs to start. Not marketing copy.
2. **Bootstrap nudge** (optional, only if relevant upstream skill exists) — "Run `<upstream>` first for richer output, or answer below to proceed without."
3. **Numbered question list** — 3-5 max. Multiple-choice where possible (faster than open-ended). All visible at once.
4. **Contract** — "Answer 1-N in one response. I'll confirm what I heard, then dispatch."

### Warm Start
*Triggered when:* most or all needed dimensions are resolvable.

The skill emits a **single short summary**:

1. **Reflection** — "Found X (from artifact A), Y (from experience/audience.md). Here's what I'll use."
2. **Override invitation** — "Anything to correct, or proceed?"
3. **Missing-dimension probes** — at most 1-2 if minor dimensions weren't found, asked inline.

If the user says proceed (or stays silent past one beat), dispatch.

---

## The Substrate: `skills-resources/experience/`

The growing source of truth. Skills **read before asking**, **write after the user answers**.

If the folder is missing in a project, bootstrap it before cold-start write-back:

```bash
bun scripts/bootstrap-experience.ts
```

The helper creates `skills-resources/experience/README.md` plus starter domain files (`audience.md`, `brand.md`, `business.md`, `content.md`, `goals.md`, `patterns.md`, `product.md`, `technical.md`). Skills may still create additional domain files when a question does not fit an existing one.

### Format

One markdown file per knowledge domain. Append-only Q+A blocks, newest at bottom:

```markdown
## Audience — primary persona
**Asked by:** campaign-plan · 2026-05-05
**Q:** Who's the primary buyer? (role + company size)
**A:** Engineering managers at mid-size SaaS companies (50-200 engineers)

## Audience — pain points (primary)
**Asked by:** copywriting · 2026-05-06
**Q:** Top 1-2 pains the buyer articulates?
**A:** "Status updates eat my morning" / "Can't see what shipped this week"
```

When skills read, they take the **most recent entry** for each `## H2 key`. Older entries stay as audit trail (the user can see the history if they pivoted).

### Domains are flexible

Suggested starter domains — these are not exhaustive, not required, not forbidden to add to:

- `product.md` — what it does, who buys it, pricing, differentiator, proof points, voice intuition
- `audience.md` — primary persona, secondary persona, pains, language, habitats
- `business.md` — growth motion (PLG/SLG/Hybrid), revenue model, current funnel state, team size, budget tier
- `brand.md` — running brand notes (lighter than canonical `brand/BRAND.md`)
- `goals.md` — quarter focus, active campaigns, what success looks like

**Add new domains when a question is genuinely orthogonal to existing files.** Examples that have come up: `marketing.md`, `sales.md`, `technical.md`, `content.md`, `design.md`, `operations.md`. **Prefer reusing an existing domain over creating a new one** — fragmentation reduces the amortization benefit. If unsure, add to `business.md` and split later if it grows large enough to warrant its own file.

### Staleness

Experience entries are timestamped. Skills warn when reading an entry **>30 days old** if its dimension is high-stakes (audience, growth motion, goals). User can override or refresh.

### Append vs override

User-driven contradiction (e.g., "we pivoted from SMB to enterprise") → **append a new entry**. Don't delete the old one. The skill reads the most recent, but the audit trail stays. Append-only is the substrate's safety guarantee.

---

## Cold-Start Authoring Rules

Every cold-start question in this protocol passes all five checks:

1. **Output-changing.** If both possible answers lead to the same dispatch, **delete the question**. Cosmetic curiosity never makes the cut.
2. **Concrete, not abstract.** "What's your goal?" → "Acquire trial signups, drive feature launch awareness, or warm cold leads?" Multiple-choice when the answer space is finite.
3. **Bounded count.** **Max 5.** If a skill genuinely needs more, that's a `discover` job, not a Pre-Dispatch.
4. **Bundled, not socratic.** All questions visible in one message. Asked as a numbered list. User answers in one response.
5. **Decision-ranked.** First question changes the most about the output; last question is finest-grained. Reader's eye should move from "everything" to "details."

### Banned patterns

- "Should I proceed?" — confirmation theater
- "What's important to you?" — extracts no decision
- Multi-round drilling ("And what about X? And Y?") — that's discover's job
- Asking what an artifact already answers
- Verbose preamble ("Before we get started, I want to understand...") — just ask
- Open-ended where multiple-choice would do

---

## Warm-Start Summary Format

Short, structured, one beat:

```
Found:
- product.md → "ProjectSync, async project visibility for engineers, $20/seat"
- audience.md → "Engineering managers, mid-size SaaS, 50-200 engineers"
- business.md → "PLG, $0-$50K MRR"

Proceeding with these. Anything to override, or shall I dispatch?
```

If the user doesn't override within their next message, dispatch. Don't re-prompt.

### When to add an inline probe

Only when the missing dimension is decision-critical AND not derivable from what was found. One probe max. Format inline, not as a separate prompt:

> Found product/audience/business. One question before I dispatch: **what's the campaign goal — acquire leads, drive trial, or launch a feature?**

If you'd ask 2+ probes, the run is closer to a cold start. Bias toward cold-starting if mixed.

---

## Read-Before-Ask, Write-After-Ask Loop

```
1. Skill resolves needed dimensions:
   a) Pipeline artifacts (research/, brand/, etc.) — existing behavior
   b) skills-resources/experience/*.md — read most-recent entries
2. Compute (needed) - (found) = missing dimensions
3. Choose flow:
   - missing == 0          → Warm start (summary, optional probe)
   - 1 ≤ missing ≤ 5       → Cold start (bundled question prompt)
   - missing > 5           → Recommend `discover` first; offer to proceed degraded
4. After user answers (cold or probe):
   - For each answered Q, append a Q+A block to the mapped domain file
   - Then dispatch agents
```

The mapping from question → domain is declared per-question in the **per-skill registry** below. If the registry says `domain: audience`, the answer goes to `skills-resources/experience/audience.md`. If a skill needs a domain not yet in the user's experience folder, the file gets created on first write.

---

## Bootstrap Recommendation

For users running their first skill (no experience files exist), include this line at the top of the cold-start prompt only if the upstream skill exists:

> *Tip: running `discover` first builds out experience/ comprehensively in one session. Or answer below to proceed with this skill's specific dimensions.*

The user keeps agency. Most users will answer the 3-5 questions and move on; some will route to `discover` for a richer foundation.

---

## Per-Skill Question Registry

Each entry: skill → cold-start question list with mapped domain. Skills with hard gates (e.g., funnel-planner requires prioritize.md) skip the registry and recommend the upstream first. Domain mappings are **suggestions**, not contracts — if the user has reorganized into different domains, write to the closest existing one.

### research-skills

**icp-research**
1. Product in one sentence — what it does, who pays for it. → `product`
2. Primary buyer — role + company size + B2B/B2C. → `audience`
3. Top 1-2 pain points the buyer articulates (verbatim if possible). → `audience`
4. Geo focus (US/EU/global/specific). → `audience`
5. Time-constrained or comprehensive? (Quick ICP / Full ICP) → routing only, not stored

**market-research**
1. Category/niche in one phrase. → `product`
2. Geo + time horizon (current state / forward-looking). → `business`
3. Why now? (decision this needs to inform) → `goals`
4. 3-5 known competitors (or "I want you to find them"). → `business`
5. B2B/B2C. → `audience`

**diagnose** (already gated on metric+current+target — keep existing Step 0)
1. Metric name (specific). → `goals`
2. Current value + measurement period. → `goals`
3. Target value + deadline. → `goals`
4. What you've tried (1-2 things). → `goals`

**prioritize** — *no cold start. Hard-gated on `.agents/skill-artifacts/meta/records/diagnose-*.md`. Cold path: recommend `diagnose` first.*

**funnel-planner** — *no cold start. Hard-gated on `.agents/skill-artifacts/meta/sketches/prioritize-*.md`. Cold path: recommend `prioritize` first.*

### marketing-skills

**brand-system**
1. Product in one sentence. → `product`
2. Audience (1-line). → `audience`
3. Competitive landscape — 3-5 names, what they're known for. → `business`
4. Voice intuition — 3 adjectives or 1 reference brand. → `brand`
5. Aesthetic intuition — 3 visual references (URLs, brands, moodboard hints). → `brand`

**copywriting**
1. Surface — landing page / email / social post / headline / CTA / etc. → routing only
2. Audience (or "use icp-research.md"). → `audience` if novel
3. The one shift — what should the reader believe after reading? → `goals` (campaign-specific)
4. Unique proof — what can you say nobody else can? → `product`
5. Unique Mechanism — proprietary "how" that makes the offer different and better. → `product`
6. Traffic source (if landing page or email). → routing only

**ad-copy**
1. Audience temperature — retargeting / cold traffic. → routing only
2. Offer — destination + value prop. → `product`
3. Creative format — dedicated / repurposed-UGC. → routing only
4. Conversion event — trial-start / purchase / lead / install / view-content. → `goals`
5. Production model — in-house / affiliate-creator / external-freelance. → routing only
6. Proof — named customers, measured outcomes, named research, specific numbers. → `product`
7. Transmutation goal — AI UGC/VSSL / native static / AI animation / advertorial pre-lander / strategist choose. → routing only
8. Competitor pattern — hooks, tone, proof type, offer promise, or visual convention. → `business` if reusable
9. LP description — 1-2 sentences on destination promise and action. → routing only

**campaign-plan**
1. Campaign goal — acquire leads / drive trial / launch / revenue / awareness. → `goals`
2. Audience (or "use icp-research.md"). → `audience` if novel
3. Growth motion — PLG / SLG / Hybrid. → `business`
4. Duration + cadence — 30/60/90 days, posts per week. → `goals`
5. Constraints — team size, budget tier, channels you can't use. → `business`

**humanize**
1. Target voice — 3 adjectives OR a reference brand OR `brand/BRAND.md`. → `brand` if novel
2. Preserve register? (e.g., keep formal if technical) → routing only
3. Compression target — light (10-15%) / moderate (20-30%) / heavy (30%+). → routing only
4. Detector mode — off / proxy-only / external if configured. → routing only
5. Protected tokens — names, numbers, claims, URLs, citations, disclaimers that must survive unchanged. → routing only

**vn-tone**
1. Target register — báo chí / semi-casual / bro / pop-marketing. → routing
2. Dialect — north / south / neutral. → routing
3. Subvariant (only if bro selected) — bro-otofun / bro-voz. → routing

**lp-brief**
1. Page route + tier — e.g., "/pricing, Tier 1 (primary)". → routing
2. Hypothesis — what's the redesign trying to prove? → `goals`
3. Existing audit available? — yes (Route B) / no (Route A). → routing
4. Goal — leads / signups / purchases / demos. → `goals`

**seo**
1. Mode — audit / ai / programmatic / competitor / aso. → routing
2. Site or property — domain or app store listing. → input
3. Audience (or "use icp-research.md"). → `audience` if novel
4. Geographic + language scope. → `audience`

**cold-outreach**
1. Channel — email / LinkedIn / Twitter DM / other. → routing
2. Target persona — role + company profile. → `audience`
3. Trigger or signal — why is now the right moment for this prospect? → routing
4. Offer — what specifically are you proposing? → `goals`
5. Proof — one specific client + number (revenue, %, time saved). → `product`

**design-brief**
1. Asset type — OG image / IG carousel / banner / hero / OOH / etc. → routing
2. Downstream route — image-gen / vector-tool / designer-handoff / template-pack. → routing
3. Brand reference — `brand/DESIGN.md` OR 3 adjectives. → `brand` if novel
4. Copy/headline if any. → input
5. Constraints — dimensions, deadline, must-include elements. → routing

### product-skills

**code-cleanup**
1. Codebase path / repo. → input
2. Cleanup intent — dead code / unused deps / asset / refactor. → routing
3. Test suite available? → routing
4. Conventions to preserve — naming, file structure, patterns to NOT touch. → `technical` (new domain ok)

**docs-writing**
1. Audience — end-user / developer / operator / mixed. → routing
2. Doc type — readme / user-guide / api-reference / config-guide / tutorial / ship-log. → routing
3. Codebase path. → input
4. Update existing or write fresh? → routing

**machine-cleanup**
1. Scope — dotfolders / caches / packages / all. → routing
2. Aggressiveness — conservative (skip ambiguous) / moderate / aggressive (suggest more). → routing
3. Excluded paths — anything off-limits to scan. → routing

**system-architecture**
1. Spec/PRD reference — file path or paste. → input
2. Scale targets — users / RPS / data volume. → `technical`
3. Constraints — budget tier / team skills / latency / compliance. → `technical`
4. Deployment context — greenfield / brownfield / migration. → `technical`

**user-flow**
1. Feature name. → input
2. Role/persona using it. → `audience`
3. Goal — what is the user trying to accomplish? → `goals`
4. Platforms — enumerate (macOS / iOS / web-desktop / etc.). → `technical`
5. Surfaces per platform if non-obvious. → `technical`

### meta-skills

**agents-panel**
1. Problem to debate/poll — one paragraph. → input
2. Mode — debate / poll. → routing
3. Number of agents (default 3 debate / 10 poll). → routing
4. Rounds (debate only, default 3). → routing

**discover** — *N/A. discover IS the multi-round interview. The Pre-Dispatch protocol applies to skills that aren't discover.*

**fresh-eyes**
1. Diff or branch reference. → input
2. Risk class — security / performance / correctness / all. → routing
3. Prior reviewer feedback (if any). → input

**task-breakdown**
1. Source — architecture doc path / spec path / conversation context. → routing
2. Scope mode — mvp / full / spike. → routing
3. Autonomy bias — mostly AFK / mixed AFK+HITL / mostly HITL. → routing
4. Target audience for tasks — AI agents / human devs / mixed. → routing

---

## Anti-Patterns (Skill Authors)

1. **Inlining the protocol verbatim** in SKILL.md. Each skill points here; doesn't repeat the spec.
2. **Adding a 6th cold-start question.** If you need it, the dimension belongs in `discover`'s scope or in an upstream skill.
3. **Asking before reading experience/.** The substrate exists to amortize cost. Read first, ask second.
4. **Skipping the write-back.** Cold-start answers MUST persist to experience/. Otherwise the substrate doesn't grow.
5. **Forcing exact domain names.** If the user has organized into different domains than the registry suggests, write to the closest existing match. Don't recreate the schema.
6. **Asking warm-start probes about state already summarized.** If the summary block already shows it, the user knows it's there.

---

## Telemetry / Self-Correction

Per the existing learned-rules system (`.agents/skill-artifacts/meta/records/learned-rules.md`), if a user repeatedly corrects a Pre-Dispatch question ("you should ask X instead of Y"), append a learned rule. Future invocations of that skill prefer the corrected question. The protocol is the spec; learned-rules is the per-user override.
