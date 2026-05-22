---
title: Humanmaxxing Playbook
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: PLAYBOOK
---

# Humanmaxxing Playbook

## Why this skill exists

AI-generated content fails in three predictable ways that no amount of "better prompting" fixes without targeted work: it reads like AI wrote it (pattern fingerprints), it sounds like nobody wrote it (no voice), and it says too much with too little (bloat). This orchestrator fixes all three in order — detect, strip, voice, compress, verify — through a six-agent pipeline where each agent owns one job.

Classifier-era detectors (Pangram, GPTZero, and successors) add a fourth failure mode: text can look clean to a human but still preserve the semantic + structural fingerprint of LLM output. Humanmaxxing therefore changes argument shape, rhythm, specificity, and register when the content type warrants it. It does not try to "evade" detectors through tricks; it makes the text genuinely more authored, more specific, and less template-shaped.

This skill is the polish-chain endpoint for English output across the marketing stack. Upstream skills that produce EN prose (`write-copy`, `write-ad`, `write-outreach`, `brief-landing-page`, `create-brand`, `brief-graphic`, `plan-campaign`, `brief-shortform`) auto-route to humanmaxxing when their pipelines call for AI-pattern cleanup. humanmaxxing itself does NOT route back — it's the terminus, sibling to `polish-vn` for Vietnamese.

## Why this skill exists at all

Six failure modes it prevents:

1. **Em-dash and rhetorical-question fingerprints.** "It's not just X, it's Y." "Why?" as a standalone hook. These are SO strongly LLM-associated that a single instance ruins credibility. Critical Gate 2 + critic Pass 1 + Absolute Prohibitions 1-3 enforce zero-tolerance.
2. **Voice-less clean prose.** Stripping AI patterns without injecting voice produces text that's correct but personality-free. Critic dimension scoring on Authenticity + Trust dimensions catches this — Route B's soul-injection-agent is the answer.
3. **Surface compression that kills specificity.** Cutting a data point to save 8 words is the opposite of what compression should do. Critical Gate + Anti-Patterns enforce Depth Preservation Rules from `conciseness-rules.md`.
4. **Detector-resistance theater.** Running "humanmax" once and assuming the output passes Pangram. Critic Detector-Resistance Verification + threshold table in `detector-resistance.md` enforce actual classifier checks (when available) or proxy checklist (when not), with explicit `detector_status` recorded.
5. **Voice cosplay.** Injecting a personality that doesn't match the brand. Voice-extractor-agent reads `brand/BRAND.md` + `product-context.md` for voice adjectives; voice adjectives are constraints, not suggestions.
6. **Short-outbound over-compression.** Cold email / DM / Meta-ad-copy / Upwork proposal text is typically 4-6 sentences with a named entity + number doing heavy lifting. Compressing further strips the thing that earns the reply. Content Type Calibration table caps short-outbound compression at 0-10% and enforces `protected_tokens` verbatim preservation.

The structural answer is the **5-dimension critic rubric** (in `agents/critic-agent.md`) — Directness / Rhythm / Trust / Authenticity / Density, each 0-10, PASS at ≥35/50 AND zero Absolute Prohibition violations.

## Philosophy

The text becomes more human by becoming more specific, more rhythmically varied, more concrete, and more constrained — not by "removing AI words" or sprinkling synonyms. Generic word swaps don't fool detectors; structural authenticity does.

Strip-agent only subtracts. Soul-injection-agent only adds. Compression-agent only condenses. Critic-agent only verifies. Each step has one job because combining them produces worse results — when an agent both edits AND verifies, it can't see its own failures.

**Specific > Generic > Clean > Sterile.** A text with one AI tell + three specific data points beats a text with zero AI tells + three generic claims.

## Methodology

**Six-agent pipeline, deliberate.** Layer 1 parallel (pattern-scanner + voice-extractor) → user checkpoint → Layer 2 sequential (strip → soul-injection → compression → critic). Each layer has a different focus (detect / fix-add-condense / verify). Combining them produces worse results.

**Diagnostic gates the polish.** Pattern-scanner produces a violation log + compression estimate + Hard/Soft Tell counts. Voice-extractor produces a voice profile + sterility assessment + injection opportunities. The orchestrator surfaces this to the user before dispatching Layer 2 — if the user wants to override specific keeps (e.g., "keep this Soft Tell — domain term"), they pass `user_directives` to strip-agent.

**Three routes by text shape.** Route A (Quick — text under 200 words, pattern removal only). Route B (Full — 200+ words, full strip + voice + compression). Route C (called by another skill — orchestrator-to-orchestrator, calling skill passes context + protected_tokens).

**Two-cycle rewrite cap.** Critic FAIL → re-dispatch named agent(s) with feedback (max 2 cycles). Cycle 2 FAIL → ship `DONE_WITH_CONCERNS` with critic annotations.

**Detector-resistance is structural, not lexical.** Pangram-style classifiers can catch synonym-swapped prose. For high-stakes public content, prior detector failures, or explicit detector-sensitive requests, run the detector-resistance pass AFTER the normal critic and record the threshold used. Default thresholds: marketing/thought-leadership `human_probability >= 0.95`; admissions/applications/compliance-sensitive `>= 0.99` when a real classifier is available.

## Principles

- **Absolute Prohibitions are binary.** 9 patterns so strongly AI-associated that a single instance auto-FAILs critic Pass 1. No exceptions, no judgment calls. Em dashes, "it's not just X, it's Y," rhetorical question hooks, colons in prose, "actually" as emphasis, filler context phrases, emojis, unsourced 47/73, staccato taglines.
- **15% word reduction floor (Route B).** Quality Gate enforces "At least 15% word reduction from original" — bloat is part of the AI fingerprint and compression IS the fix.
- **Zero idea loss.** Compression cuts filler, not facts. Every paragraph contains at least one concrete fact, number, or named example. Critic dimension Density scores this directly.
- **Protected tokens are verbatim.** When called by `write-outreach` or `write-ad` with `protected_tokens`, every named entity + number + URL + proof point must appear verbatim in final output. Protected-token regression runs in Detector-Resistance Verification.
- **Content Type Calibration is the lever.** The 8 content-type register profiles (`human-writing-stylebook.md`) each set strip intensity, voice, compression, and register. Landing-page sections and ads get full treatment; documentation gets a light touch (10-15%, accuracy over personality); cold DMs get near-zero compression (0-10%, specificity is already load-bearing); academic and white-paper inherit the docs register at 5-10% (Hard Tells only). The further from marketing, the lighter the touch.
- **Strip first, voice second, compress third, critic fourth.** Pipeline order is load-bearing. Voice injection on AI-patterned text = polishing AI-generated prose. Compression before voice = killing the rhythm the soul-injection agent wanted to install.
- **Critic dimensions cite a re-dispatch target.** Directness FAIL → strip-agent. Rhythm/Authenticity FAIL → soul-injection-agent. Trust FAIL → soul-injection or strip (depending on cause). Density FAIL → soul-injection (add specificity) or revert compression. Each failure routes to the agent that owns that dimension.
- **The artifact IS the contract.** Frontmatter (8 fields) + body sections (Humanization Summary 10-row table + Change Log 4-col + Humanmaxxed content) follow a fixed schema. Schema changes require atomic update of any upstream caller that reads humanmaxxing output.

## When NOT to use this skill

- **Need new copy from scratch.** Use `write-copy` with voice directives. humanmaxxing polishes existing text; it does not generate.
- **Source text is Vietnamese.** Use `polish-vn` (sibling polish-chain for VN). humanmaxxing is English-only — its AI-pattern catalog is EN-specific (em dashes, rhetorical question hooks in English, "actually" as English emphasis, etc.).
- **Conversion-focused landing page.** Use `brief-landing-page` — that's page architecture, not text polish. humanmaxxing can run on individual sections after brief-landing-page produces them.
- **Content already passed copywriting's Seven-Sweeps.** Use Route C (skip pattern-scanner, dispatch compression + critic only). Full Route B would re-process patterns that copywriting already cleaned.
- **Audio/video transcripts as content type.** Edge case — transcripts have native disfluencies that look like "voice" but actually are speech-to-text artifacts. Transcript polishing is a different skill (currently parked); humanmaxxing would over-clean.
- **Academic / research papers needing peer review.** Use the lightest Content Type Calibration (5-10% compression, Hard Tells only). Heavy stripping kills the precision academic readers expect.

## History / origin

- **v1.0.0 — initial release.** 6-agent orchestration (pattern-scanner + voice-extractor parallel → strip + soul-injection + compression + critic sequential). 47-pattern AI catalog (`ai-patterns.md`) across 8 categories. 5-dimension critic rubric. 3 routes (A/B/C).
- **v2.0.0 — major bump.** Added Content Type Calibration 6-row table. Added Detector-Resistance Verification with Pangram integration + threshold table (`detector-resistance.md`). Added protected_tokens contract for short-outbound callers. Added regression suite (`regression-suite.md`). 9 Absolute Prohibitions formalized (added "no colons in prose," "no actually as emphasis," "no filler context phrases," "no unsourced 47 or 73," "no staccato taglines").
- **v2.1.0 — WS5 human-writing stylebook (May 22, 2026).** New `references/human-writing-stylebook.md` [STYLEBOOK]: human-writing doctrine, the four forum-derived rules (short paragraphs, fewer formal transitions, concrete lived detail, less balanced two-sidedness), 8 content-type register profiles (forum comment, founder post, cold DM, blog, docs, ad, landing-page section, internal memo), the imperfection lever (opt-in per profile, never typos), and the no-generic-long-form gate (fails long-form output that could lose 40% of its words with no meaning loss). SKILL.md Content Type Calibration expanded 6 → 8 rows with a Register Profile column; Quality Gate gains the no-generic-long-form check. Wired into voice-extractor (profile selection), soul-injection (register + forum rules + imperfection lever, new technique #7), compression (self-applied gate), and critic (gate verification, folded into compression verification). The em-dash ban stays blanket — Absolute Prohibition #1 is unchanged. The four domain catalogs (`ai-patterns`, `voice-injection`, `conciseness-rules`, `detector-resistance`) are unchanged; the stylebook is a new doctrine layer that organizes and cross-references them. WS5 of the incremental-reviewable-artifacts program.
- **v6 Phase 2 Wave 1 refactor (May 18, 2026, still v2.0.0):** body trimmed 545 → 230 lines (-57.8%; at ≤230 creative target). 5 new refs: playbook + format-conventions + anti-patterns (NEW — extracted 10 patterns from body + 4 cross-cutting marketing-stack rows) + procedures/pre-dispatch + procedures/dispatch-mechanics. New examples/humanmaxxing-walkthrough.md (extracted from body's Worked Example § Route B). Existing `agents/{pattern-scanner, voice-extractor, strip, soul-injection, compression, critic}-agent.md` + `references/{ai-patterns, voice-injection, conciseness-rules, detector-resistance, regression-suite}.md` UNCHANGED (these ARE the skill's domain data and behavior). Before-Starting + Artifact Contract blocks added per Step 7.5 pattern. **Cross-stack contract preserved BYTE-IDENTICAL** (per vn-tone-slot learning: no clarifying parentheticals, no nested-heading promotions, no rubric-explanation paragraphs added during refactor): 5 Critical Gates, 9 Absolute Prohibitions (nested `###` under Quality Gate), 10-bullet Quality Gate, 6-agent Manifest, Content Type Calibration 6-row table, Detector-Resistance Verification section with thresholds, Artifact Template (8-field frontmatter + Humanization Summary 10 rows + Change Log 4-col), 4-tier Completion Status, 3 Routes (A/B/C). No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Warm/Cold Start prompts, Pre-Writing Assembly, write-back map, `--fast` behavior
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — Route A/B/C, Layer 1 parallel + user checkpoint, Layer 2 sequential, single-agent fallback, critic gate + rewrite loop, Detector-Resistance Verification
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — 10 pipeline failure modes + 4 cross-cutting marketing-stack patterns
- [`human-writing-stylebook.md`](human-writing-stylebook.md) [STYLEBOOK] — human-writing doctrine, forum-derived rules, 8 content-type register profiles, the imperfection lever, the no-generic-long-form gate
- [`format-conventions.md`](format-conventions.md) [PROCEDURE] — artifact frontmatter, Humanization Summary table format, Change Log format, detector_status field values
- [`examples/humanmaxxing-walkthrough.md`](examples/humanmaxxing-walkthrough.md) [EXAMPLE] — end-to-end Route B walkthrough (blog post, 178 → 91 words, 49% compression, 40/50 PASS)
- [`ai-patterns.md`](ai-patterns.md) — 47 AI writing patterns across 8 categories + high-frequency vocabulary (read by pattern-scanner + strip + critic)
- [`voice-injection.md`](voice-injection.md) — voice adjective framework, rhythm, specificity, personality injection (read by voice-extractor + soul-injection)
- [`conciseness-rules.md`](conciseness-rules.md) — compression techniques at sentence/paragraph/section + Depth Preservation Rules (read by compression-agent)
- [`detector-resistance.md`](detector-resistance.md) — Pangram-aware structural/semantic protocol + proxy checklist + threshold table
- [`regression-suite.md`](regression-suite.md) — fixture protocol for protected-token, specificity, compression, and detector/proxy regressions
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec the procedure inherits from
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (this skill is `budget: standard`; `--fast` collapses to Route A even on 200+ word text, but Critical Gates 1-5 + Absolute Prohibitions 1-9 STILL enforced and Cold Start STILL fires when voice/context is missing)
