---
title: LP-Brief Anti-Patterns
lifecycle: canonical
status: stable
produced_by: lp-brief
load_class: ANTI-PATTERN
---

# LP-Brief Anti-Patterns

> Re-read before any brief ships. The first 12 patterns are lp-brief-specific failure modes extracted from the body. The last 4 are cross-cutting marketing-stack patterns. Ownership column cites by **CP-ID** (conversion critic — 13 well-named principle IDs from `conversion-principles.md`) or **G-ID** (brand-voice critic — 9 well-named gates G1-G8b from `agents/brand-voice-critic-agent.md`) — NOT integer "Gate N" labels (both critics use letter+number naming, so direct ID references are accurate).

## Section 1 — LP-brief pipeline patterns (12)

### 1. Pretending heuristic review is CRO

**Pattern:** Treating a best-practice teardown of an existing page as "post-launch optimization" because no analytics evidence exists yet. Output presents itself as CRO-grade recommendation.

**Why it fails:** Construction-time best-practice gating (lp-brief's job) is structurally different from measurement-driven optimization (lp-eval's job). A best-practice teardown without measurement evidence can confidently recommend the wrong direction — the data might show the "conversion best practice" is actively hurting THIS audience. Heuristics are priors, not posteriors.

**Instead:** Build with the conversion rubric (CP-01 → CP-13) inside this brief; after launch, use real analytics/recordings/experiment evidence in `evaluate-landing-page` inside an existing eval-loop. Then feed the resulting eval into the next `lp-brief --rev=N` cycle.

**Owned by:** Orchestrator (`Skill Deference` block in body — "Need post-launch CRO from real evidence? → `evaluate-landing-page` inside an existing `run-eval-loop`") + Critical Gate 2 (do NOT skip conversion rubric) + brand-system-stack convention (lp-brief is brief-time; lp-eval is post-launch).

---

### 2. Generic hypothesis

**Pattern:** Hypothesis like "This page should convert better." Not falsifiable. No specific audience, no specific objection, no specific lift target.

**Why it fails:** The 3Q rubric (Visual / Falsifiable / Uniquely Ours) gates hypothesis selection at Approval Gate 1 specifically to prevent this. A generic hypothesis cannot be tested, cannot be rejected, and cannot inform architecture or section-spec because there's nothing concrete to orient the page around.

**Instead:** "Engineering managers reject /pricing because they perceive overkill for small teams; segmenting proof by team size lifts conversion." Specific audience, specific objection, specific lift expectation, falsifiable.

**Owned by:** Hypothesis-agent (3Q rubric self-check) + Approval Gate 1 (user picks A/B/C from scored candidates; generic candidates score 0/3 or 1/3 and get rejected at gate) + Hypothesis-rubric reference (`hypothesis-rubric.md`).

---

### 3. Inlining the shared skill chain

**Pattern:** Duplicating the project's `_prompts.md` content (e.g., `growth/page-redesigns/_prompts.md` § Phase A — Hero Build) into every brief. Brief balloons to 700+ lines repeating chain content.

**Why it fails:** Project skill chains are operational documents — they change as the team's process evolves. Inlining them into every brief means every chain update requires manual re-sync across every existing brief. Drift is inevitable.

**Instead:** Reference by section header — "See `growth/page-redesigns/_prompts.md` § Phase A — Hero Build" — and add page-specific overrides only. Critical Gate 5 (Do NOT inline the full skill chain) and brand-voice critic G6 (250-500 envelope) both catch this.

**Owned by:** Section-spec-agent (self-check on Skill Chain section format) + Critical Gate 5 + brand-voice critic G6 (envelope FAIL catches the bloat downstream effect).

---

### 4. Stale or fake proof

**Pattern:** Logo grid from 2023, testimonials with no source, "Trusted by 1000+ teams" with no link. Brief includes placeholder testimonials, stock-photo headshots, or pretend numbers.

**Why it fails:** Stale or fake proof is detected by users — the page loses trust IMMEDIATELY when a reader recognizes a stock-smile or a stale customer logo. The fix is more expensive than getting it right at brief-time. Critical Gate 6 (Do NOT inject placeholder testimonials, fake logos, or pretend numbers) is explicit on this.

**Instead:** "Delete cell if not real" — every proof element has a verifiable source listed in brief. Stale (>12 month) proof flagged for replacement or "delete cell if not real" notation. Asset-slot fallbacks for missing proof: "Logo grid, 6 cells × 60px — delete cell if not real."

**Owned by:** Section-spec-agent (proof section self-check) + Asset-slot-agent (every slot has fallback spec) + Conversion critic CP-09 (Strategic Social Proof Hierarchy — FAIL on placeholder/fake/unsourced elements per source's authenticity requirements) + Critical Gate 6.

---

### 5. Ignoring sacred elements

**Pattern:** Brief proposes new logo treatment for "freshness." Or glassmorphic hero overlay on a "matte / no glass" brand. Or "Unlock seamless leverage" hero copy on a brand whose voice forbids those words.

**Why it fails:** Sacred elements are RAILS, not options. They exist because the brand stakeholders made deliberate choices that signal identity, and breaking those choices for a single page erodes the system. Inside-the-rails creativity only.

**Instead:** Read sacred elements from brand_digest (brand-anchor-agent surfaces them from BRAND.md). List every sacred element under "What NOT to Do" in the brief. Verify hand-off blocks lift sacred verbatim. Hand-off DO NOT blocks must list every sacred element.

**Owned by:** Brand-anchor-agent (surface sacred elements from brand_digest) + Section-spec-agent (respect sacred in layout/visual decisions) + Asset-slot-agent (every generative slot includes Sacred Elements line) + Critical Gate 3 (Do NOT propose changing sacred elements) + Brand-voice critic G1 (sacred 4/4 required — non-negotiable — auto-FAIL on single violation) + G7 (asset slot brand compliance) + G8 (hand-off verbatim compliance).

---

### 6. No objection handling

**Pattern:** Brief has hero, features, CTA — no rebuttal of the audience's stated objections. ICP research lists 3 top objections; the brief addresses 0.

**Why it fails:** Audience objections that go unaddressed at the page level get raised in support tickets, sales calls, and abandoned carts. The page is the cheapest place to handle them. Skipping objection handling shifts cost down-funnel.

**Instead:** The brief MUST address the top 1–2 ICP objections explicitly. Section-spec includes an objection-handling section (or weaves objection rebuttals into existing sections — value-prop, features, FAQ). Evidence-anchor-agent surfaces ICP top 3 objections; section-spec-agent picks which to address.

**Owned by:** Evidence-anchor-agent (ICP top 3 objections in evidence digest) + Section-spec-agent (objection handling in spec) + Conversion critic Cross-Cutting Check (≥2 ICP VoC phrases used in copy slots).

---

### 7. Brief too short

**Pattern:** Under 250 lines. Designer asks 5 follow-up questions about under-specified sections, missing asset fallbacks, vague CTA copy.

**Why it fails:** Insufficient depth means the designer (or coding agent, or Claude Design) cannot execute without filling in gaps with guesses. Every guess is a divergence from the brief. Result: page ships off-spec, not because the brief was wrong but because it was incomplete.

**Instead:** Spec everything: every section, every slot, every fallback. Use the section-templates.md as a checklist — Hero, Value prop, Social proof, Features, Objection, FAQ, CTA — each has its own conversion-checklist. Critical Gate 4 (Do NOT exceed the brief length envelope — under 250 = insufficient depth) and brand-voice critic G6 catch this.

**Owned by:** Section-spec-agent (use section-templates.md as a checklist) + Critical Gate 4 + Brand-voice critic G6 (envelope 250-500 — under 250 = FAIL — insufficient depth).

---

### 8. Brief too long

**Pattern:** Over 500 lines. Designer skims; misses critical spec. The brief contains every conceivable detail, no prioritization.

**Why it fails:** Above the envelope ceiling, the brief stops being read in full. Critical spec gets buried; downstream operators miss the load-bearing constraints; the result ships missing the parts that mattered.

**Instead:** Cite the shared chain instead of duplicating; cap section spec at the conversion-checklist gates. If the brief has Implementation Prompt content inline, move it to `handoff-implementation.md` companion (which is the convention — keeps brief.md within envelope). Critical Gate 4 + brand-voice critic G6 + always-emitted handoff companion all support this.

**Owned by:** Section-spec-agent (compress when re-dispatched) + Handoff-agent (companion file extraction) + Critical Gate 4 + Brand-voice critic G6 (envelope 250-500 — over 500 = FAIL — bloat).

---

### 9. Hero copy violating voice

**Pattern:** "Unlock seamless leverage to drive next-level outcomes." Passes 4-U on paper (Useful + Unique + Urgent + Ultra-specific) but fails brand voice rules ("leverage", "unlock", "seamless", "next-level" all forbidden).

**Why it fails:** The conversion critic and brand-voice critic are intentionally parallel-not-sequential. Hitting one rubric while violating the other is a structural failure — the page is brand-bad even if it converts (which erodes trust over time anyway).

**Instead:** Hero copy slots must pass both rubrics. Section-spec-agent reads brand_digest forbidden-vocab list and rejects candidates that contain any. Brand-voice critic G2 (Forbidden Vocabulary) auto-FAILs on a single hit in any user-facing copy slot.

**Owned by:** Section-spec-agent (read brand_digest forbidden-vocab; reject violating candidates) + Brand-voice critic G2 (Forbidden Vocabulary — FAIL if ≥1 forbidden word appears in copy slots, hand-off prompts, or anywhere user-facing).

---

### 10. Coding-agent inventing asset URLs

**Pattern:** Implementation prompt is emitted without the verbatim Asset Placeholder Rule → coding agent fills `<img>` tags with hallucinated Unsplash URLs (`images.unsplash.com/photo-{guess}...`) that 404 or load wrong imagery.

**Why it fails:** Coding agents have strong priors on stock-photo URL patterns. Without an explicit verbatim instruction, they will guess URLs that look correct but don't resolve. Result: page ships with broken `<img>` tags or wildly off-brand imagery.

**Instead:** Handoff-agent lifts the Asset Placeholder Rule verbatim from `references/handoff-formats.md` into every implementation prompt, plus an "Invent or substitute asset URLs" entry in the DO NOT block. Slots that lack a render route (`pending-media-skill`) are spec'd with the placeholder fallback (solid color) and re-rendered when the appropriate media-briefing skill ships.

**Owned by:** Handoff-agent (lift Asset Placeholder Rule verbatim from `handoff-formats.md`) + Brand-voice critic G8b (Implementation Prompt Compliance — Asset Placeholder Rule lifted verbatim + "Invent or substitute asset URLs" ban present in DO NOT block + closing rule verbatim).

---

### 11. Implementation-prompt sacred-creep

**Pattern:** Coding agent adds noise overlay, custom cursor, or preloader for "polish" when brand_digest doesn't declare them. Implementation prompt's CORE SETUP & GLOBALS lists "Awwwards tricks" that nobody asked for.

**Why it fails:** Every undeclared treatment is sacred drift — it changes the brand expression without going through brand-system. The next page in the project inherits the drift; eventually the brand becomes "whatever the last coding agent thought looked cool."

**Instead:** CORE SETUP & GLOBALS in the implementation prompt lists ONLY treatments brand_digest explicitly declares. Every other "Awwwards trick" is sacred drift and gets caught by the brand-voice critic.

**Owned by:** Handoff-agent (CORE SETUP & GLOBALS scope to brand_digest declarations only) + Brand-voice critic G1 (sacred 4/4 — catches drift in handoff DO NOT blocks via G8) + G8 (Hand-Off Verbatim Compliance).

---

### 12. Implementation-prompt stack mismatch

**Pattern:** Emitting a Vanilla JS prompt for a Next.js project, or a React component tree for a static site. Coding agent reads the prompt and builds the wrong stack output.

**Why it fails:** The user has to throw away the coding-agent output and re-do it in the correct stack. Wasted compute, wasted user time, broken trust in the brief.

**Instead:** Handoff-agent runs stack detection (check `package.json`, framework configs like `next.config.{js,ts}`, `astro.config.{js,ts}`, `svelte.config.{js,ts}`, `vite.config.{js,ts}`) at write time before composing the prompt. Never asks the user — the repo is the source of truth. Falls back to pure HTML/CSS/Vanilla JS when no framework detected.

**Owned by:** Handoff-agent (stack detection at write time, before composing prompt) + frontmatter `target_handoff` (declares specialty targets but stack auto-detection is always-on for `handoff-implementation.md`).

---

## Section 2 — Cross-cutting marketing-stack patterns (4)

### 13. Upstream context skipped — brand artifacts missing → NEEDS_CONTEXT

**Pattern:** User invokes lp-brief without running `create-brand` first. BRAND.md and DESIGN.md absent. lp-brief proceeds anyway by inventing brand context.

**Why it fails:** Without brand artifacts, the brief defaults to generic brand-shaped content (warm/trustworthy/professional voice; safe palette; generic surface language). Every downstream skill (design-brief, copywriting, coding agent) inherits the genericness. Critical Gate 1 (Do NOT generate a brief without brand artifacts) is explicit.

**Instead:** Hard gate fires BEFORE any cold-start questioning. Missing BRAND.md or DESIGN.md → return NEEDS_CONTEXT immediately, recommend `create-brand`. If either >60 days stale, warn and ask before proceeding. lp-brief is the canonical example of "hard gates before any cold-start question" pattern.

**Owned by:** Orchestrator (Pre-Dispatch hard gates — fires BEFORE Cold Start questioning) + Critical Gate 1 (Do NOT generate a brief without brand artifacts → return NEEDS_CONTEXT).

---

### 14. Cross-stack contract drift

**Pattern:** Downstream skill (design-brief reading Asset Slots; coding agents reading Implementation Prompt companion; lp-eval reading loop-local strategy artifacts that reference brief.md) updates its expected lp-brief schema in isolation without updating lp-brief's frontmatter or body section structure. Two versions of "what brief.md contains" exist.

**Why it fails:** Schema drift produces silent breakage — downstream skill consumes a field that no longer exists, or misses a field that was renamed. Symptoms appear weeks later when "the design-brief is producing assets for slots that aren't in the latest brief" or "the coding agent is missing the (BUG FIX) callouts."

**Instead:** Schema changes require atomic update of `format-conventions.md` + lp-brief SKILL.md Artifact Templates + every downstream caller. lp-brief playbook lists current downstream callers + lp-eval coordination contract. Bump lp-brief `version` major when the schema changes.

**Owned by:** Operator (during refactor + new-feature work) + lp-brief playbook §"Cross-stack contract" listing + format-conventions.md §"Cross-stack contract".

---

### 15. Polish-chain misroute

**Pattern:** User invokes `humanize` on the brief itself ("make the brief sound less AI-written") or on a hand-off prompt block. Polish chain runs on what is supposed to be a structured operational document.

**Why it fails:** lp-brief OUTPUT defines page strategy; humanize/vn-tone INPUT consumes USER-FACING copy. Running humanize on the brief recursively redefines what "brief" means — sections become prose paragraphs, structured rubric blocks get prose-ified, etc. Downstream skills can no longer parse the brief.

**Instead:** humanize and vn-tone run on **published copy** that flowed THROUGH the brief (e.g., the final hero copy after the brief was executed). They do NOT run on brief.md itself. If brief copy candidates read AI-flavored, re-dispatch section-spec-agent with feedback in cycle 2 of the critic gate — don't post-process the brief.

**Owned by:** Orchestrator (chain position note in playbook — lp-brief is upstream of humanize/vn-tone for final-copy polish, not a peer) + Skill Chain section in brief (step 4: "humanize — final pass on any AI-generated body copy" runs AFTER implementation, not on the brief itself).

---

### 16. Downstream eval-loop violation

**Pattern:** lp-brief output gets used as input to a freshly-scaffolded eval-loop, but the eval-loop never gets a `program.md` or measurement baseline. Later, `evaluate-landing-page` is invoked → returns NEEDS_CONTEXT because the loop is empty.

**Why it fails:** Cross-skill coordination requires the eval-loop to be properly scaffolded BEFORE lp-eval can measure anything. lp-brief produces strategy/execution artifacts; the eval-loop owns measurement plumbing. Skipping the loop scaffolding step breaks the downstream evaluation.

**Instead:** When the brief is intended for an eval-loop cycle, scaffold the loop with `/run-eval-loop` FIRST (writes program.md, context.md, results.tsv). Then run lp-brief and copy the brief into the loop's `strategy/` directory. Then run lp-eval after launch. The Skill Chain section in brief.md step 5 explicitly names this: "[post-launch] collect analytics/recordings/experiment notes → run `evaluate-landing-page` inside the page's eval loop, then feed the resulting eval into next `lp-brief --rev=N`."

**Owned by:** Orchestrator (Skill Chain section formats the loop-coordination expectation in every brief) + lp-eval Critical Gate 1 (existing eval loop required — returns NEEDS_CONTEXT if `program.md` missing, recommends `/run-eval-loop`).

---

## Cross-references

- For agent-side gate ownership: see `agents/conversion-critic-agent.md` (CP-01 → CP-13 — 11 hard-gate CPs + CP-06 PAS as NOTE-grade + CP-10 cognitive bias as NOTE-only + Cross-Cutting Checks + Scoring Patterns Per CP + Tier Excuses + Cycle Logic) and `agents/brand-voice-critic-agent.md` (G1 Sacred / G2 Forbidden Vocabulary / G3 Preferred Phrasing / G4 Surface Language Match / G5 Token Discipline / G6 Brief Envelope / G7 Asset Slot Brand Compliance / G8 Hand-Off Verbatim Compliance / G8b Implementation Prompt Compliance + Sacred Element Detection + Voice Forbidden Vocab Detection + Token Discipline + Envelope Math).
- For procedural correctness: see `procedures/dispatch-mechanics.md` (Layer 1/1.5/2/3/3.5/4/5 dispatch tables + 3 Approval Gate user-response handling) and `procedures/pre-dispatch.md` (hard gates fire BEFORE any cold-start questioning — catches pattern 13).
- For format-side correctness: see `format-conventions.md` (frontmatter schema + 14 body sections + full artifact template byte-identical + companion file conventions + brief envelope rules — catches patterns 3, 7, 8, 14).
- For domain catalogs: `conversion-principles.md` (CP-01 → CP-13 detail), `section-templates.md` (per-section templates with conversion-checklist), `handoff-formats.md` (Asset Placeholder Rule canonical source), `failure-modes.md` (page-level failures the critics watch for).
