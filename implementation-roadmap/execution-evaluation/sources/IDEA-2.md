# Skill Improvements — Research Findings

> **STATUS: COMPLETE** (2026-05-15). Section 1 has one remaining external task (Pangram API). Section 2 fully implemented. Section 3 fully implemented. See `ROADMAP.md` §1 for the remaining Pangram tasks. Do not re-implement anything in this file.

## 1. Humanize Skill: Pangram Research

### What Pangram Is

Founded in 2024 by ex-Google and ex-Tesla ML engineers (Max Spero, Bradley Emi). Raised $4M seed from ScOp, Script Capital, Cadenza, Haystack VC. Independently validated as the most accurate AI detector on the market by University of Chicago Booth and University of Maryland.

### How It Works

- **Not perplexity/burstiness-based** — uses a proprietary deep learning classifier trained on millions of documents (both human and AI)
- Trained via hard negative mining and active learning on diverse datasets
- **Continuously retrained** on new models (GPT-5, Claude, Gemini, DeepSeek, etc.)
- Detects across 20+ languages including Vietnamese
- Traditional language model architecture: tokenize → embeddings → neural network → classifier head → prediction

### Performance (UChicago BFI Working Paper No. 2025-116)

| Metric | Pangram | GPTZero | Originality.ai | RoBERTa (open-source) |
|---|---|---|---|---|
| False positive rate | ~0–0.8% | 0–2.4% | 0–2.2% | 30.6–77.8% |
| Cost per true positive | baseline | 3x more expensive | 2x more expensive | N/A |

Pangram is the **only** detector that meets stringent policy caps (0.5% FPR) without degrading detection capability.

### Critical Finding: Humanizer Resistance

Pangram **explicitly claims to detect humanized text** — AI text processed by tools attempting to evade detection. The UChicago study confirmed this: Pangram's false negative rate remained low even after passages were run through StealthGPT. Other detectors (GPTZero) saw FNR spike to ~50%+ after humanization.

**Implication:** Simple rewriting / synonym-swapping approaches won't evade Pangram. The humanize skill must adopt fundamentally different strategies — structural reorganization, variable sentence construction, introduction of authentic human-like inconsistency, and avoidance of LLM-typical patterns at the semantic level rather than the lexical level.

### Next Steps for Humanize

1. Acquire Pangram API access for programmatic testing
2. Build a regression test suite that scores humanize output against Pangram
3. Research detection-evasion techniques that work on classifier-based (not perplexity-based) detectors:
   - Structural variance (non-linear argument flow, digressions, asides)
   - Authentic specificity (real anecdotes, concrete details unique to the claimed context)
   - Inconsistent formality register (not uniformly polished)
   - Typographic and grammatical imperfections placed strategically
4. Implement a critic gate that runs Pangram on output and loops until score drops below threshold
5. Consider multi-pass approach: generate → humanize → restructure → rephrase with variable temperature

---

## 2. Ad/Copy Skills — Playbook Application Plan

### Source Material

5 playbooks found in `ideas/playbooks/`:

| Playbook | Focus | Relevance |
|---|---|---|
| `FOUNDATIONAL_DOCS_ENGINEERING_PLAYBOOK.md` | Argument Engineering, Unique Mechanism, 6 Necessary Beliefs | **High** — direct copy craft methodology |
| `META_ALGORITHM_MASTERY_PLAYBOOK.md` | 4-Step Filtering, Total Value Equation, Creative is Targeting | **High** — ad-copy strategist depth |
| `AI_ADS_SCALE_PLAYBOOK.md` | Message Transmutation, AI Creative Stack | **Medium** — ad format+transmutation concepts |
| `MARKETING_MASTERY_PLAYBOOK.md` | Contrast, Clarity > Aesthetics, Variable Subtraction | **Medium** — strategic heuristics |
| `AI_MONEY_PRINTING_PLAYBOOK.md` | Speed-to-Data, Chad Funnel, 24h Feedback Loop | **Low** — more about product validation than copy |

### Application Plan

#### A. Copywriting Skill Upgrades

| Change | From (current) | To (new) | Source Playbook |
|---|---|---|---|
| Pre-dispatch dimension | audience, one shift, unique proof, traffic source | **+ Unique Mechanism** as required pre-writing field | Foundational Docs §2 |
| Body agent framing | Problem → Solution → How It Works | **6 Necessary Beliefs** architecture as alternative body structure | Foundational Docs §3 |
| Hook agent methodology | 3-Question Test (V/F/U) + headline formulas | **+ Argument Engineering**: build hook as lead of an airtight logical case, not a word-choice exercise | Foundational Docs §1 |
| Research phase | Read icp-research + product-context | **+ AI-Driven Research workflow** (avatar sheet → offer brief → belief extraction) as pre-dispatch step | Foundational Docs §4 |
| Critic dimension | V/F/U + competitor swap + CTA formula | **+ UM distinctness check**: does the copy hinge on a proprietary mechanism, or could any competitor run it unchanged? | Foundational Docs §2 |
| Social proof agent | Testimonials, stats, logos | **+ Discovery Story** as an alternative social-proof pattern (narrative arc that builds trust) | AI Ads Scale §2 |

**Rationale:** The copywriting skill's current methodology (3Q test, V/F/U scoring) is strong for verification but weak for *construction*. Argument Engineering and 6 Necessary Beliefs provide a construction-side framework that generates higher-quality raw material before the critic gate refines it.

#### B. Ad-Copy Skill Upgrades

| Change | From (current) | To (new) | Source Playbook |
|---|---|---|---|
| Strategist agent depth | Angle archetype selection from practitioner refs | **+ 4-Step Filtering Process awareness**: strategist explains *how Meta ranks* each variant (Retrieval → Light Ranking → Heavy Ranking → Auction) and optimizes for each stage | Meta Algorithm §1–2 |
| Strategist agent | Single angle archetype per variant | **+ Message Transmutation** framework: picks variant format by transmutation type (AI UGC / Native Static / AI Animation) | AI Ads Scale §5 |
| Composer — cold-traffic | Standard primary text + headline + description | **+ Advertorial pre-lander pattern**: cold-traffic variants optionally structured as "Chad Funnel" advertorials that install beliefs before showing price | Money Printing §4 |
| Composer — UGC | repurposed-ugc format | **+ AI UGC VSSL framework** ("I was just like you, but worse") as a dedicated cold-traffic variant structure | AI Ads Scale §5A |
| Hook criteria | Pattern-interrupt, no generic openers | **+ Contrast Principle**: the hook should break the *specific competitor pattern* in the vertical (identify competitor hooks → do polar opposite) | Marketing Mastery §1 |
| Critic — Pattern-Interruption dim | Variants must be genuinely distinct | **+ Contrast Ratio** check: does each variant stand out from competitors in this vertical, not just from each other? | Marketing Mastery §1 |
| Strategist — cold-traffic | Practitioner refs already deep | **+ Variable Subtraction**: when cold-traffic results are ambiguous, the strategist recommends isolating 1 variable (creative vs funnel vs offer) instead of changing all 3 | Marketing Mastery §5 |

**Rationale:** The ad-copy skill already has strong Meta-platform intelligence (retargeting cold-traffic pinouts, Andromeda awareness). The gaps are in *algorithm mechanics* (strategist should understand *why* Creative is Targeting at the retrieval level) and in *format diversity* (the copy is solid but all variants follow the same structural template).

#### C. Cross-Cutting: Foundational Docs Research Workflow

Both skills benefit from a shared research methodology. Create a new reference:

**`marketing-skills/skills/copywriting/references/research-workflow.md`** (shared by ref from ad-copy too):

1. **Phase 1 — Research Doc**: Use Deep Research to compile 6+ pages of intelligence on product, market, competition
2. **Phase 2 — Avatar & Offer Brief**: Define the "who" (psychographic depth, levels of awareness) and "what" (offer architecture)
3. **Phase 3 — Belief Engineering**: Extract the 6 Necessary Beliefs required for conversion
4. **Phase 4 — Unique Mechanism**: Identify the proprietary "how" that differentiates

This replaces ad-hoc research with a repeatable SOP that both skills consume.

### Implementation Priority

1. **High —** Add Unique Mechanism as pre-dispatch dimension to copywriting (low effort, high impact on headline/distinctness)
2. **High —** Add 6 Necessary Beliefs as body-agent alternative structure in copywriting (moderate effort, transforms output quality)
3. **Medium —** Deepen ad-copy strategist with 4-Step Filtering Process + Total Value Equation (primarily docs/awareness, minimal code change)
4. **Medium —** Add Contrast Principle to ad-copy hook criteria (adds one critic dim check)
5. **Low —** Advertorial pre-lander pattern for cold-traffic (new agent or composer-mode, careful not to bloat)
6. **Low —** Create shared research-workflow reference doc (useful but dependent on higher-priority changes landing first)

## 3. Self-Improvement (Eval System)

### Current Architecture

The eval system has **5 layers**, which is unusually sophisticated:

| Layer | Scope | Mechanism |
|---|---|---|
| **Pre-Dispatch** | Before any work | Read artifacts → check experience/ → Warm Start (summary+override) or Cold Start (bundled Qs) → persist to experience/ |
| **Critic Gate** | Within a single skill run | Multi-agent pipeline → final critic agent → binary PASS/FAIL → max 2 rewrite cycles → re-dispatch named agent(s) with specific feedback |
| **Fresh-Eyes Review** | Post-implementation | Independent reviewer (no sunk-cost bias) → resolver → self-regulation gate (max 2 loops) → written report |
| **Eval Loop** | Cross-cycle measurable initiatives | Scaffolded workspace (`program.md`/`context.md`/`results.tsv`/`learnings.md`) → surface-specific evaluators → keep/discard/watch/blocked ledger |
| **Learned Rules** | Cross-session | User corrections captured as rules, capped at ~50, read before dispatch |

### What's Strong

- **Domain-specific critic rubrics** (not generic 1-5 scales) — falsifiable justifications, auto-fail structural checks, specificity floors
- **Confidence scoring integrated with rewrite routing** — findings below 5/10 suppressed, 5-7/10 caveated
- **Self-regulation gates** prevent oscillation (>30% modification or >10 findings stops the loop)
- **Staleness awareness** — manifest entries carry `stale_after_days`, experience entries >30 days trigger warnings
- **Falsifiability as first principle** — every score justification must be refutable by future data
- **Post-humanize regression detection** in cold-outreach (reverts if specificity drops ≥2 points after humanize pass)
- **70/30 observation/scoring weighting** for cycle 1 to prevent premature rubric lock-in

### Gaps Identified

1. **No cross-skill feedback from critics** — `lp-eval` findings don't propagate back to `lp-brief`'s SKILL.md
2. **Eval-loop learnings don't reach experience/** — high-confidence learnings stay in loop folders, invisible to other skills
3. **No aggregate quality metrics** — no dashboard for critic FAIL rates, average rewrite cycles, rubric-score distributions
4. **Learned-rules system is flat** — no priority scoring, no auto-archiving based on staleness, no dedup when rules are absorbed into SKILL.md
5. **No automated rubric revision signal** — rubrics manually revised at cycle 2-3 with no trigger for earlier revision based on critic mis-calibration
6. **No critic consensus testing** — no skill uses parallel critics with different rubrics to surface disagreement
7. **Terminal humanize regression is skill-specific** — only cold-outreach guards against humanize stripping specificity
8. **No eval for research artifacts** — ICP, market research have no systematic quality measurement
9. **Critic-agent instructions repeated per skill** — no shared rubric references, making cross-skill consistency harder
10. **No "ignored critic" metric** — when operator overrides a critic FAIL, the critic has no self-correction loop

### Recommendations

1. **Promote eval-loop learnings to experience/** — high-confidence reusable learnings should propagate to `experience/content.md` or a new `experience/patterns.md`
2. **Add lightweight quality dashboard** — track per-skill: invocations vs. critic PASS/FAIL, avg rewrite cycles, avg rubric scores (even 10-line JSON blob)
3. **Generalize post-humanize regression check** — extract from cold-outreach into a shared pattern applied by all skills that go through humanize
4. **Create eval for research artifacts** — lightweight poll via agents-panel after N downstream consumptions
5. **Add critic-introspection protocol** — log operator overrides of critic FAIL; flag critics with >3 overrides without rubric revision
6. **Extract shared critic rubrics into references/** — follow short-form-eval's model where rubric lives in `references/rubric.md` and critics reference it
7. **Add critic-consensus mode for high-stakes outputs** — when budget is `deep` and output is irreversible, dispatch two critics with different rubrics and flag disagreements to operator

---

## Implementation Status (as of 2026-05-15)

### Section 1: Humanize — Pangram Research

| Action | Status | Evidence |
|---|---|---|
| Pangram-aware detector resistance | ✅ Built | Dedicated `references/detector-resistance.md`, critic-agent awareness, optional verification pass |
| FPR / false positive rate concept | ✅ Done | `detector-resistance.md`, `humanize/SKILL.md`, and critic-agent now define probability thresholds, false-positive posture, and high-stakes FAIL handling |
| Regression test suite vs Pangram | ⚠️ Scaffolded | `references/regression-suite.md` has fixture shape and threshold fields; live Pangram regression still requires API credentials |
| Critic gate that loops until score drops | ✅ Done | High-stakes `detector_mode: pangram` failures are critic FAIL; two failed verification cycles return `DONE_WITH_CONCERNS` rather than looping indefinitely |

### Section 2: Ad/Copy Skills — Playbook Application

| Action | Status | Evidence |
|---|---|---|
| **Copywriting**: Unique Mechanism | ✅ Done | Core concept in SKILL.md, cold-start questions, body architecture |
| **Copywriting**: 6 Necessary Beliefs | ✅ Done | Direct-Response narrative mode in body-agent |
| **Copywriting**: Argument Engineering | ✅ Done | Surfaced in SKILL.md philosophy, quality gate, agent manifest, and belief-sequence pre-dispatch |
| **Copywriting**: Discovery Story | ✅ Done | Dedicated `references/discovery-story.md` |
| **Shared**: Research workflow doc | ✅ Done | `references/research-workflow.md` consumed by both copywriting and ad-copy |
| **Ad-copy**: Message Transmutation | ✅ Done | Dedicated `references/message-transmutation.md` |
| **Ad-copy**: Variable Subtraction | ✅ Done | In message-transmutation ref + SKILL.md debugging table |
| **Ad-copy**: AI UGC VSSL | ✅ Done | In message-transmutation ref |
| **Ad-copy**: Advertorial Pre-Lander | ✅ Done | In message-transmutation ref |
| **Ad-copy**: Contrast Principle | ✅ Done | Surfaced in SKILL.md construction framing and composer/critic checks |
| **Ad-copy**: 6 Necessary Beliefs | ✅ Done | Added to SKILL.md, strategist, composer, critic, rubric, and message-transmutation reference for cold demand/advertorial paths |
| **Ad-copy**: 4-Step Filtering Process | ✅ Done | Strategist assigns Retrieval / Light Ranking / Heavy Ranking / Auction per variant with Total Value Equation explanation |
| **Ad-copy**: Chad Funnel | ✅ Done | Added as message-transmutation variant with native ad → advertorial → product/PDP → signup/order handoff |

### Section 3: Self-Improvement (Eval System)

| Recommendation | Status | Evidence |
|---|---|---|
| 1. Promote eval-loop learnings to experience/ | ✅ Done | `quality-feedback-protocol.md` promotion criteria + `eval-loop` integration + `bootstrap-experience.ts` |
| 2. Lightweight quality dashboard | ✅ Done | `quality-dashboard-spec.md` + `update-quality-dashboard.ts` helper |
| 3. Generalize post-humanize regression check | ✅ Done | `quality-feedback-protocol.md` shared post-humanize regression check + `humanize` protected-token/detector gates |
| 4. Evaluate research artifacts via agents-panel | ✅ Protocol done | `quality-feedback-protocol.md` research artifact evaluation triggers and output placement |
| 5. Critic-introspection protocol | ✅ Done | `quality-feedback-protocol.md` critic override log + dashboard rubric override handling |
| 6. Extract shared critic rubrics into references/ | ✅ Done | `meta-skills/references/shared-critic-rubrics.md` exists |
| 7. Critic-consensus mode for high-stakes outputs | ✅ Done | `quality-feedback-protocol.md` consensus protocol and high-stakes routing |

### What's left to do

Implementation work from this roadmap is complete. External follow-ups remain:

1. Acquire Pangram API access and wire a project-specific detector command.
2. Run live detector regression fixtures once credentials exist.
3. Build future surface-specific evaluators (`ad-eval`, `email-eval`, campaign evaluator) when those loops exist.

### Cross-references

- Eval system gaps tracked in detail in `IDEA-4b-evaluation-layer.md`
- Feedback loop architecture (experience/, quality dashboard, critic-introspection) in `IDEA-4c-feedback-loop.md`
