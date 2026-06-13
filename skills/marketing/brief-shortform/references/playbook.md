---
title: Short-Form Brief Playbook
lifecycle: canonical
status: stable
produced_by: short-form-brief
load_class: PLAYBOOK
---

# Short-Form Brief Playbook

## Why this skill exists

Short-form video is a production discipline, not a writing discipline. The gap between "we have an angle" and "a producer can shoot/animate this" is where most short-form content dies — vague hooks, missing timing, "use trending music," generic CTAs. The brief is the contract between research and production. A brief that names the hook archetype, timed every shot to the second, specified a named track or VO direction, and bound every caption line to a VoC phrase from ICP can be executed without a single follow-up question. Anything less wastes a shoot day or a motion-graphic session.

This skill replaces "give me a TikTok idea" with a production-ready document. Hero + 2 variants per invocation by default — variants are TRUE RECUTS (rebuilt hook archetype, audio rule, caption norm, CTA placement per platform from the research catalog), never caption-resized clones. The variant default is cost + craft discipline (critic attention per variant thins past 2; extend past it only with a surfaced warning); the recut rule is craft.

Specificity is the unit of value. "Hand pulls latch on case, latch click audible at 0:03–0:05, MCU framing" beats "show product." Every shot, scene, and line earns its place because the producer can act on it.

## Why this skill exists at all

Six failure modes it prevents:

1. **Brief-as-vibes.** "Make it punchy, founder-y, tight." A producer can't shoot vibes. Critical Gate 5 + critic Production sub-critic force specific timing (`0:03–0:05`), specific framing (ECU/CU/MCU/etc.), specific actions (verb + object, no "show product"), and specific audio (named track or VO direction, not "use trending music").
2. **Caption-only "variants."** Same hero brief with a longer caption marketed as a "Reels variant" or "Shorts variant." Critical Gate 6 + critic Algorithm-fit sub-critic auto-FAIL caption-only recuts; platform-tailor-agent rebuilds hook + audio + caption + CTA per platform from the research catalog.
3. **Fabricated VoC.** Made-up audience quotes ("our users say...") that don't trace to `research/icp-research.md`. Critical Gate 4 + critic Brand-fit sub-critic require every quote to trace to ICP; cold-start hint is permitted but flagged.
4. **Generic founder/company tropes.** "Hey guys," "in today's world," "we're excited to announce." These are auto-FAIL on critic Brand-fit; the anti-patterns catalog enumerates the full ban list. Brand mode (founder vs. company) drives voice; mixing modes mid-brief is auto-FAIL.
5. **Format-fit ambiguity (viral-but-no-convert vs. converts-but-no-views).** Either the product is pasted on top of the format (viewer enjoys, scrolls, never connects to the app) OR the integration is so heavy the piece reads as an ad and gets skipped before payoff. Critic Brand-fit's format-fit test asks one binary question: is the product the punchline of the format, or pasted on top?
6. **Stale research that masks decay.** Trends decay in 14d (warn 30d); platform mechanics shift quarterly (warn 90d/180d). Critical Gate 1 + critic Algorithm-fit sub-critic require the brief to bet on patterns from a fresh-window short-form-research artifact; stale beyond windows → flag in artifact frontmatter as `done_with_concerns`.

The structural answer is the **4-sub-critic gate** (in `agents/critic-agent.md`) — every sub-critic FAIL routes to a specific source agent per the 13-row routing table, max 2 cycles.

## Philosophy

The brief is the contract between research and production. Specificity is the unit of value. A producer should never need to ask follow-up questions to execute.

Per-platform variants are craft, not parameter-tweaking. A LinkedIn cut isn't a TikTok with longer captions — it's a re-thought hook archetype, audio rule, caption norm, and CTA placement, all from the research catalog.

Brand mode and market drive the voice and polish chain; they're not cosmetic. Founder content sounds nothing like company content; making one prompt handle both produces blandness. Polish chain auto-routes per (market, brand_mode) — VN founder gets vn-tone, EN company gets none, etc.

**Specific > Generic > Comprehensive > Vibes.** Every shot earns its place because the producer can act on it.

## Methodology

**1 hero + 2 variants per invocation (soft default).** More platforms → re-invoke, or extend past the default with a surfaced cost+craft warning (critic attention per variant thins past 2). The default is cost + craft discipline; the recut rule is craft. A hero is the canonical brief for the highest-leverage platform; variants are TRUE RECUTS for adjacent platforms (not caption resizes).

**Research-anchored bets, not generic advice.** Every recommendation in the brief traces to a per-platform finding in the short-form-research catalog (hook archetype, audio rule, length sweet spot, caption norm, CTA placement). Critic Algorithm-fit sub-critic verifies the bet matches the catalog.

**VoC is non-negotiable.** Every quoted audience line in the brief traces to `research/icp-research.md`. Cold-start hint accepted but flagged in artifact frontmatter as `voc_source: cold-start-hint`.

**Brand mode is exclusive.** founder OR company per brief — no hybrid. User picks per-invocation. Voice and polish chain are derived from brand mode, not configurable mid-brief.

**Polish chain auto-routes by (market, brand_mode).** vn-tone for VN founder (spoken-line + full body) and VN company (full body); humanmaxxing for EN founder (spoken-line); none for EN company. Other markets flag `polish-chain-extension-needed`.

## Principles

- **Specificity floor.** Every shot has timing (seconds), framing (ECU/CU/MCU/MS/MLS/LS/WS/EWS), action (verb + object), on-screen text (word-for-word + position + timing), and audio sync. Vague verbs like "show product" or "transition" auto-FAIL on critic Production.
- **Hook triad is simultaneous.** Visual + verbal + text hit in 0–1s, not spread over 3s. Three variations per brief, each tagged with a research-catalog archetype, each passing the 3Q test (Visual / Falsifiable / Uniquely-ours).
- **Variants are true recuts.** `platform-tailor-agent` rebuilds hook + audio + caption + CTA per platform from the research catalog. Caption-only resizing auto-FAILs the variant.
- **No fabricated VoC, no fabricated mechanics.** Every quote traces to ICP; every cited mechanic traces to research catalog's `mechanics_sources_verified[]`.
- **Critic gate is 4 sub-critics, 2-cycle cap.** Hook / Production / Algorithm-fit / Brand-fit. Binary PASS/FAIL per sub-critic; all four must PASS for overall PASS. FAIL → re-dispatch named source agent with specific feedback. After 2 cycles, ship `done_with_concerns` with concerns pinned at top of brief.
- **The artifact IS the contract.** Hero + variants follow a fixed frontmatter schema and 14-section body. Schema changes require atomic updates to any consumer (currently human producers + editors; no downstream skill consumes today, but the contract still matters for `evaluate-shortform` if that skill expands to scoring against briefs).

## When NOT to use this skill

- **Static visual** (carousels, infographics, single images) — use `brief-graphic`.
- **Long-form video** (15+ min YouTube, podcasts, full courses) — different platforms, different mechanics. Parked.
- **Paid ad creative** (Meta retargeting, cold-traffic ads) — use `write-ad` (Meta policy + claim substantiation + char-cap discipline are different gates). Short-form briefs can become organic-first content that later gets boosted, but the paid-ad shape is `write-ad`'s job.
- **Per-platform research catalog** (what's working on TikTok right now) — use `research-shortform`. This skill consumes the catalog; it does not produce it.
- **Audience research** (who buys, why) — use `research-icp`. This skill assumes audience is known or runs with a cold-start hint.
- **Campaign-level distribution strategy** (which platforms, which cadence, which budget split) — use `plan-campaign`. This skill produces ONE brief per invocation.

## History / origin

- **v1.0.0 — initial release.** 9-agent orchestration (format + voc-extraction + production-mode parallel → hook + storyboard + audio + copy-pack parallel → platform-tailor conditional + critic). Two-layer Layer 1 split (foundation Layer 1 → craft Layer 1.5) was deliberate — format/VoC/production-mode feed downstream craft agents. Hard caps (1 hero + 2 variants, brand_mode no hybrid) established at launch.
- **v6 Phase 2 Wave 1 refactor (May 18, 2026, still v1.0.0):** body trimmed 371 → 183 lines (-50.7%; under ≤230 mixed-classification target by 47 lines). 5 new refs: playbook + format-conventions + procedures/pre-dispatch + procedures/dispatch-mechanics + examples/brief-shortform-walkthrough. Existing `anti-patterns.md` extended with cross-cutting marketing-stack rows (VN auto-routing, polish-chain on FAIL, multi-platform discipline, cross-stack contract drift). Existing per-platform refs (`platform-intelligence/{tiktok,reels,shorts,linkedin,x,youtube}.md` + `_template.md`), per-domain refs (`hook-archetypes.md`, `storyboard-grammar.md`, `caption-cta-rules.md`, `production-modes.md`, `success-criteria-templates.md`, `polish-chain.md`), agent files (`agents/*.md`), and `_examples/example-*.md` unchanged. Before-Starting + Artifact Contract blocks added per Step 7.5 pattern. **Cross-stack contract preserved byte-identical:** 6 Critical Gates, 4-bullet Quality Gate, 9-agent Manifest, Output Artifact Structure (frontmatter + 14 body sections), Polish Chain 5-row table, Completion Status verdicts. No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Warm/Cold start prompts, write-back map, `--fast` behavior
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — Layer 1 / 1.5 / 2 spawn mechanics, single-agent fallback, critic routing, polish chain, chain position, skill deference
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes per sub-critic + cross-cutting marketing-stack patterns
- [`format-conventions.md`](format-conventions.md) [PROCEDURE] — date format, timing format, framing tags, archetype tagging, VoC exact-quote rule, variant "What Changed" guard
- [`examples/brief-shortform-walkthrough.md`](examples/brief-shortform-walkthrough.md) [EXAMPLE] — end-to-end walkthrough (Pre-Dispatch → Layer 1 + 1.5 → critic PASS → polish → deliver)
- [`_shared/hook-archetypes.md`](_shared/hook-archetypes.md), [`storyboard-grammar.md`](storyboard-grammar.md), [`caption-cta-rules.md`](caption-cta-rules.md), [`production-modes.md`](production-modes.md), [`success-criteria-templates.md`](success-criteria-templates.md), [`polish-chain.md`](polish-chain.md) — domain catalogs (loaded by craft agents at dispatch, not orchestrator)
- [`_shared/platform-intelligence/`](_shared/platform-intelligence/) — per-platform deep dives (tiktok, reels, shorts, linkedin, x, youtube) loaded by format-agent + platform-tailor-agent. Canonical at top-level `references/_shared/platform-intelligence/` (D13)
- [`_examples/example-1-vn-founder-tiktok.md`](_examples/example-1-vn-founder-tiktok.md), [`_examples/example-2-us-company-reels-shorts.md`](_examples/example-2-us-company-reels-shorts.md), [`_examples/example-3-b2b-founder-shorts-slowburn.md`](_examples/example-3-b2b-founder-shorts-slowburn.md) — additional worked examples
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec the procedure inherits from
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (this skill is `budget: deep`; `--fast` collapses to single-pass craft + critic skipped, but Critical Gates 1-6 STILL enforced and Cold Start STILL fires when angle/platforms are missing)
