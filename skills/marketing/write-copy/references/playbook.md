---
title: Copywriting Playbook
lifecycle: canonical
status: stable
produced_by: copywriting
load_class: PLAYBOOK
---

# Copywriting Playbook

## Why this skill exists

Most copy fails for one reason: it's generic. Headlines that could run for any competitor, CTAs that say "Learn More," social-proof that says "trusted by leading companies." The skill exists to make every key line **visual** (the reader can picture it), **falsifiable** (a fact-checker could verify it), and **uniquely ours** (a competitor couldn't sign it without lying). When all three pass, copy stops the scroll and moves the reader.

The orchestrator separates concerns: hook-agent owns headlines, body-agent owns persuasive architecture (Problem→Solution→How It Works OR 6 Necessary Beliefs), cta-agent owns asks, social-proof-agent owns credibility, voice-agent strips AI patterns, psychology-agent fires emotional triggers + Authenticity filter, zero-risk-agent removes conversion barriers, critic-agent scores V/F/U per key line + trigger density 3-4 + Authenticity. PASS or FAIL with specific re-dispatch routing.

## Philosophy

Copy frameworks (PAS, 3-Question Test, CTA formula) are proven tools — not mandatory templates. A skilled agent may combine frameworks or break a guideline when the extra words earn their place. Construction starts with **Argument Engineering**: define the belief sequence, proof burden, Unique Mechanism, and competitor contrast before choosing words. The test is: does this stop the scroll and move the reader? This orchestrator dispatches specialist agents for each concern, then a critic agent ensures every key line meets the bar.

**Three-Question Test is the floor, not the ceiling.** V/F/U scoring 3-4-3 (avg ≥3.3) is a PASS, but the bar for "great copy" is 4-5-4 (avg ≥4.3). Critic FAILs anything below average 3.5 OR any single dimension below 3.0. The rubric is asymmetric: a piece can be very visual and very falsifiable but lose entirely on Uniqueness ("we increase productivity by 30%" — any competitor could sign it).

**Competitor Swap Test catches generic claims.** Mentally swap your brand name for a competitor's in every key line. If the line still makes sense, you haven't said anything specific. Rewrite. This is critic-agent's structural auto-fail for Uniqueness — independent of V/F/U scores.

**Emotional triggers are necessary but not sufficient.** Pieces firing 3-4 triggers (Identity Validation, Status Signaling, Tribal Belonging, Productive Discomfort, Curiosity Gap, Aspiration+Believability) read as emotionally compelling. 0-2 reads as informational. 5-6 reads as guru-energy. But trigger count doesn't substitute for V/F/U — a piece firing 4 triggers weakly still FAILs.

## Methodology

**9-agent orchestration, Layer 1 parallel + Layer 2 sequential.** Layer 1: hook + body + cta + social-proof run in parallel (4 Agent tool calls in one message). Merge step is deterministic (no creative synthesis — slot each agent's output into the page template by ownership table). variant-agent then generates A/B alternatives for high-leverage sections. Layer 2: voice → psychology → zero-risk → critic run sequentially, each receiving the previous agent's full output.

**Three routes by surface.** Route A — Single key line (headline / hook / CTA / tagline / subject line; dispatches ONE Layer 1 agent + critic). Route B — Full-page copy (Layer 1 parallel + Merge + variant + Layer 2 sequential + critic). Route C — Called by another skill (lp-brief or campaign-plan for inline copy; orchestrator picks which Layer 1 agent(s) the caller needs).

**Two narrative architectures for full-page (Route B).** body-agent chooses one based on awareness stage + traffic source:
- **Awareness-building** (Problem → Solution → How It Works) — for problem-aware or solution-aware traffic; classic SaaS landing structure
- **Direct-response 6 Necessary Beliefs** (Problem / Mechanism / Superiority / Proof / Fit / Opportunity) — for cold or unaware traffic that needs full persuasion arc; mechanism-led, harder to write but higher conversion when proof is strong

Merge Step preserves whichever architecture body-agent chose — do NOT force Direct-Response output back into Awareness-building slots.

**Two-cycle rewrite cap.** Critic FAIL → re-dispatch named agent(s) with feedback (max 2 cycles). Cycle 2 FAIL → ship `DONE_WITH_CONCERNS` with critic annotations + the specific line-level issues that didn't resolve. The 2-cycle cap exists because each additional cycle past 2 has lower expected improvement than annotating + surfacing to user.

## Principles

- **V/F/U scoring is per-line, not per-piece.** Every key line (headline, hook, CTA, tagline, subject, sub-head, social-proof statement) gets scored 1-5 on Visual / Falsifiable / Uniquely-Ours. Average ≥3.5 PASS; below 3.0 on any single dimension FAIL regardless of average.
- **Argument Engineering before word-choice.** Pre-Dispatch resolves audience + the one shift + Unique Mechanism + belief sequence BEFORE any agent dispatches. Skipping these produces generic copy that scores well on V/F but fails on U.
- **Hook is the anchor.** When hook-agent's headline contradicts body-agent's framing, body adjusts to align with hook (not vice versa). The hook is what the reader sees first; the body's job is to deliver on the hook's promise.
- **Trigger density 3-4 for persuasion-heavy copy.** 0-2 reads as informational (FAIL → psychology-agent adds primary lever). 5-6 reads as guru-energy (FAIL → psychology-agent cuts lowest-load-bearing trigger). 3-4 is the band where emotional compulsion lands without theatrics.
- **Authenticity filter is binary.** Per critic-agent.md: is this true / would you say it in person / is the emotion proportional / does it serve the reader / specific over generic / is proof present. Any "no" → FAIL, route to voice-agent. No partial credit.
- **CTA follows formula:** [action verb] + [what they get]. "Learn More" / "Click Here" / "Submit" are zero-information CTAs that critic auto-fails. cta-agent.md enforces the formula + variant per placement (hero / mid-page / final) with risk-reversal at conversion points.
- **3-5 variations per key line, top 2-3 alternatives surfaced.** Single-best output without alternatives leaves the user (or A/B testing layer) with no comparable options. hook-agent and cta-agent generate internally; variant-agent generates cross-section alternatives for Route B.
- **Annotation is the contract.** Every key line in the artifact carries: rule that drove the choice, cut alternative + why-cut, V/F/U score. Without annotation, the artifact is just copy — not a teachable / iteratable artifact. critic-agent enforces annotation presence.
- **The artifact IS the contract.** 4-field frontmatter + Pre-Writing 5-item block + Key Lines structure + A/B Variants section follow a fixed schema per `format-conventions.md`. Schema changes require atomic update of calling-skill consumers (lp-brief, campaign-plan).

## Page-Specific Guidance

| Page | Key Principle |
|------|--------------|
| **Homepage** | What you do in one sentence. Primary use case, not every feature. |
| **Landing Page** | One goal, one CTA. Match headline to traffic source. Remove nav. |
| **Pricing** | Lead with value, not price. Anchor with most popular plan. |
| **Feature** | Lead with outcome ("Track time in one click"), not feature name. |
| **About** | Founding story. What you believe. Team photos + real context. |

## When NOT to use this skill

- **Need page architecture (not just copy).** Use `brief-landing-page` — that's hypothesis + section-spec + asset-slots + handoff prompts, not text per-section. copywriting can run via Route C on individual sections after brief-landing-page produces the architecture.
- **Need full campaign orchestration.** Use `plan-campaign` first to lock channel mix + sequencing, then copywriting per touchpoint via Route C.
- **Content reads as AI-generated post-PASS.** Use `humanmaxxing` as terminal polish-chain (sibling-pattern to cold-outreach's terminal humanmaxxing call). copywriting's Authenticity filter catches some AI patterns but is not equivalent to humanmaxxing's 47-pattern catalog.
- **Vietnamese source language.** Use `polish-vn` (sibling polish-chain for VN). copywriting is English-only — its frameworks and references are EN-specific.
- **Blog posts / thought leadership / docs.** copywriting is optimized for persuasive surfaces (landing pages, emails, ads, CTAs). For blog/article/docs, use the upstream content brief skill + humanmaxxing for AI-pattern cleanup; copywriting's emotional-triggers framework is over-applied for non-persuasion content.
- **Social media post / carousel / Reels caption.** Use `write-social` — platform-native char limits, CTA placement vs algorithm truncation, hook archetype catalog. copywriting's frameworks don't enforce platform constraints.

## What This Skill Pulls From Elsewhere

- **practitioner — lead-magnet stack** (creator-economy playbook, 2024-2025): 5-element lead-magnet post structure (hook + identity → value → curiosity → proof → CTA) + 4-layer FOMO sequence inside Element 5 (social-proof → scarcity → loss-aversion → urgency). → `references/lead-magnet-stack.md`. Used by hook-agent (lead-magnet posts) + social-proof-agent (FOMO layer 1-2) + cta-agent (lead-magnet CTAs only).
- **practitioner — belief-disruption** (TOF ragebait + persuasion frameworks, 2024-2025): 5-step belief-disruption structure for problem-unaware audiences (identity claim → contrarian disruption → tribal belonging → discomfort → call). → `references/belief-disruption.md`. Used by psychology-agent (TOF copy only) + hook-agent (problem-unaware audience).
- **practitioner — emotional triggers** (DR copywriting + content-creator psychology, 2020-2025): 6-lever framework — Identity Validation / Status Signaling / Tribal Belonging / Productive Discomfort / Curiosity Gap / Aspiration+Believability — with density gate (3-4 = strong, 0-2 = weak, 5-6 = guru-energy). → `references/emotional-triggers.md`. Used by psychology-agent (primary owner) + hook-agent (TOF/lead-magnet hooks) + critic-agent (trigger density gate + Authenticity filter).
- **practitioner — discovery story** (DR sales-letter craft, decade-spanning canon — Halbert, Sugarman, Forsythe): the discovery-story social-proof arc for mechanism-led trust building (problem → search → discovery → mechanism → result → offer). → `references/discovery-story.md`. Used by social-proof-agent for high-stakes persuasion pages where mechanism-led trust matters more than testimonial-stack.
- **canonical — headline formulas** (DR copywriting canon — Caples, Schwartz, Halbert, Sugarman, Carlton, Halbert): formula catalog (How-To, List, Question, Direct, Negative, Curiosity, Specificity, Promise, Story, Command). → `references/headline-formulas.md`. Used by hook-agent (primary reference).
- **canonical — research workflow** (DR copywriting canon — Halbert "The Boron Letters", Sugarman "The Adweek Copywriting Handbook"): 4-phase argument research SOP (Research Doc → Avatar & Offer Brief → Belief Engineering → Unique Mechanism). → `references/research-workflow.md`. Used by hook-agent + body-agent + Pre-Dispatch to identify missing upstream context.

## History / origin

- **v1.0.0 — initial release.** 9-agent orchestration (hook + body + cta + social-proof parallel → variant → voice → psychology → zero-risk → critic sequential). 3 routes (A single-line / B full-page / C called-by-other-skill). 8-bullet Quality Gate. V/F/U rubric with average ≥3.5 PASS, per-dim ≥3.0 floor. Two narrative architectures (Awareness-building, Direct-Response 6 Necessary Beliefs).
- **v2.0.0 — major bump.** Added Argument Engineering as Pre-Dispatch foundation (Unique Mechanism + belief sequence + audience + the one shift as required dimensions). Added 7-question Cold Start (added Unique Mechanism + belief sequence Qs). Added emotional-triggers density gate (3-4 target) + Authenticity filter to critic. Added Discovery Story social-proof arc reference. Added belief-disruption TOF reference for problem-unaware audiences. Added lead-magnet-stack reference for TOF posts. Added research-workflow as Pre-Dispatch read order step 1.
- **v6 Phase 2 Wave 1 refactor (May 18, 2026, still v2.0.0):** body trimmed 538 → ≤230 lines (at creative target). 5 new refs: playbook + format-conventions + procedures/pre-dispatch + procedures/dispatch-mechanics + examples/write-copy-walkthrough. New anti-patterns.md (5 orchestrator-level + 4 pipeline-level + 4 cross-cutting marketing-stack rows — net-new since baseline had only 5 trailing one-liners). Existing `agents/{hook, body, cta, social-proof, variant, voice, psychology, zero-risk, critic}-agent.md` + `references/{headline-formulas, page-sections, emotional-triggers, belief-disruption, lead-magnet-stack, research-workflow, discovery-story}.md` UNCHANGED (these ARE the skill's domain data and behavior). Before-Starting + Artifact Contract blocks added per Step 7.5 pattern. **Cross-stack contract preserved BYTE-IDENTICAL** (per vn-tone-slot + humanmaxxing-slot + cold-outreach-slot learning: no clarifying parentheticals, no nested-heading promotions, no rubric-explanation paragraphs added during refactor): 9-agent Manifest table, 8-bullet Quality Gate, both narrative section-order tables (Awareness-building + Direct-Response 6 Necessary Beliefs preserved in dispatch-mechanics.md), Routes A/B/C step counts, 4-tier Completion Status verdicts. No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Warm/Cold Start prompts (7-question Cold Start), write-back (6 questions), Pre-Writing Assembly, hard-block conditions, `--fast` behavior
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — Routes A/B/C, Layer 1 parallel, Merge Step (both narrative section-order tables + assembly rules + conflict resolution), variant-agent post-merge, Layer 2 sequential, single-agent fallback, critic gate + rewrite loop, chain position, skill deference
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — 5 orchestrator-level + 4 pipeline-level + 4 cross-cutting marketing-stack failure modes (skipping pre-writing, dispatching all for single line, ignoring critic FAIL, wrong-agent re-dispatch, >2 cycles, voice-too-early, psychology trigger-density miss, zero-risk over-application, variant gratuity, Route C context drop, brand-system absent, humanmaxxing chain skipped, schema drift)
- [`format-conventions.md`](format-conventions.md) [PROCEDURE] — Artifact Template (4-field frontmatter + Pre-Writing 5-item block + Key Lines structure with V/F/U scores + A/B Variants section + re-run convention)
- [`examples/write-copy-walkthrough.md`](examples/write-copy-walkthrough.md) [EXAMPLE] — end-to-end Route B walkthrough (StatusZero landing page, EM audience, LinkedIn ads cold traffic, full Layer 1 + Merge + Variant + Layer 2 + critic PASS) + Route A single-key-line variant + Route C called-by-lp-brief snippet
- [`headline-formulas.md`](headline-formulas.md) — canonical headline formula catalog (hook-agent)
- [`page-sections.md`](page-sections.md) — page section types + templates + testimonial selection (body-agent, social-proof-agent)
- [`emotional-triggers.md`](emotional-triggers.md) — 6-lever framework + density gate (psychology-agent, hook-agent, critic-agent)
- [`belief-disruption.md`](belief-disruption.md) — TOF ragebait 5-step structure for problem-unaware audiences (psychology-agent, hook-agent)
- [`lead-magnet-stack.md`](lead-magnet-stack.md) — 5-element lead-magnet post + 4-layer FOMO sequence (hook-agent, social-proof-agent, cta-agent)
- [`research-workflow.md`](research-workflow.md) — 4-phase argument research SOP (Pre-Dispatch read order step 1)
- [`discovery-story.md`](discovery-story.md) — Discovery Story social-proof arc for mechanism-led trust building
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec the procedure inherits from
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (this skill is `budget: deep`; `--fast` collapses Layer 1 parallel to sequential, skips variant-agent + psychology-agent + zero-risk-agent in Layer 2, but Critical Gates STILL enforced and Cold Start STILL fires when context missing)
