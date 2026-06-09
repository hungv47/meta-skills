---
title: Cold Outreach Playbook
lifecycle: canonical
status: stable
produced_by: cold-outreach
load_class: PLAYBOOK
---

# Cold Outreach Playbook

## Why this skill exists

Cold outbound fails for one reason most of the time: the message reads like template, not like a sharp colleague who noticed something specific. "I came across your LinkedIn profile and wanted to reach out because we help companies like yours leverage..." — the reader pattern-matches to spam in three seconds. The skill exists to make every sentence earn its place, the personalization actually connect, and the proof do real work (not "trusted by leading B2B SaaS companies").

The orchestrator separates strategy from craft: specialists pick angle/signal/proof/CTA in parallel, composer drafts with channel rules, voice-auditor strips vendor-speak, critic scores a 5-dimension rubric, `humanmaxxing` is the terminal pass for AI tells. Output is ready-to-send + rationale — not a draft to rewrite.

## Philosophy

Cold outreach is not template-filling. It's writing as a sharp colleague who noticed something relevant — the reader's world dominates, not yours. Every sentence must earn its place. Frameworks (O→P→P→A, Q→V→A, framework's 4-step) are tools, not mandates. Test: would YOU reply to this?

**The remove-the-opener test.** If you removed the personalized first sentence, would the rest of the email still make sense? If yes, the personalization isn't doing work — it's decoration. Critic dimension Signal Connection enforces this directly.

**One proof beats ten features.** Named client + named metric (Ramp + "cut close time 9→4 days") beats a feature dump every time. Specificity Floor requires ≥2 verifiable specifics in the body — pure generic-flavor claims ("great work in the SaaS space") don't count.

**You > me ratio.** Reader's world, not yours. "you/your" counts dominate "I/we/our." First sentence after salutation does NOT start with "I" or "My." Critic dimension You>Me catches sender-first framing.

## Methodology

**8-agent orchestration, two-stage Layer 1 by design.** Signal-analyst runs solo first (Layer 1a) because strategist's framework selection and proof-selector's tie-breaking both consume `signal_strength` (1-5). Running 1a and 1b in parallel would force guessing. Layer 1b (strategist + proof-selector) then runs in parallel. Layer 2 (composer → voice-auditor → critic) runs sequentially with feedback loops to composer on critic FAIL.

**Diagnostic gates the strategy.** Signal strength is the lever: weak signal (1-2) → strategist defaults to pain-first instead of trigger-first; critic weights Signal Connection more strictly. Strong signal (4-5) → strategist anchors on the trigger as the opener; proof-selector picks the proof that most tightly connects to that trigger.

**Three routes by intent.** Route A — Compose (first-touch or follow-up, slug `-t1`/`-t2`/`-t3`/etc.). Route B — Reply (user pastes inbound, classifier types it as one of 9 reply types). Route C — Called by another skill (`plan-campaign` invokes per touch in a broader campaign).

**Two-cycle rewrite cap.** Critic FAIL → re-dispatch FULL Layer 2 chain (composer → voice-auditor → critic) with feedback (max 2 cycles). Never feed critic a raw composer draft without voice-auditor between. Cycle 2 FAIL → surface scorecard + best draft to user with explicit blocker.

**Terminal humanmaxxing with specificity regression.** After critic PASS, humanmaxxing runs with `content-type: "short-outbound"` (Light strip, Full voice, 0-10% compression) + `protected_tokens` listing every named entity + number from the critic-approved draft. Post-humanmaxxing, re-run critic's Specificity dim only. Drops ≥2 OR any named entity/number absent → revert to critic-approved draft. **Automatic, not judgment** — AI-sounding cold email is the biggest failure mode, regression protects against humanmaxxing silently stripping the specificity anchor.

## Principles

- **Mode + channel + target + signal + proof are non-negotiable inputs.** Mode + channel + target + proof have Missing-Input Hard Blocks (BLOCK if missing). Signal can be missing with weak-signal flag (strategist defaults to pain-first; critic weights Signal Connection more strictly). Prior_touches required for touch 2+ — BLOCK if missing.
- **One ask per message, low-friction in touch 1.** "Quick 30-min call?" in touch 1 is too expensive for zero trust. Default to interest-question CTAs ("Worth a 1-line reply?"), resource offers, or no-pitch connection notes. Tier-4 calendar CTAs only after established interest.
- **One proof per message.** proof-selector picks ONE primary + ONE backup. Feature dumps read as desperation. Named case study > named logo + metric > specific claim > generic. Voice-auditor cuts lists; critic Specificity Floor auto-fails generic claim soup.
- **You > me ratio enforced structurally.** First sentence after salutation does NOT start with "I" or "My." you/your-count must exceed I/we/our-count. Critic dimension You>Me applies auto-fail when violated.
- **Banned-phrase catalog is binary.** `references/anti-patterns.md` lists ~50 zero-tolerance phrases ("I hope this email finds you well", "leverage", "synergy", "best-in-class", "Re:" fake threads, etc.). Voice-auditor strips on sight; critic auto-fails if any survive.
- **Reply route hard-gates "no".** Never argue with a clear "not interested" / "no thanks" / "take me off your list." Breakup mode is default for firm not-interesteds. Critic auto-fails any reply that re-pitches after clear rejection, regardless of dim scores. Hostile inbound → response ≤2 lines.
- **Humanmaxxing runs ONCE.** Running humanmaxxing twice strips specificity and drifts toward generic. Terminal pass is exactly one call with `protected_tokens` + post-humanmaxxing Specificity regression.
- **The artifact IS the contract.** 3 files per run (`[slug].md` + `[slug].rationale.md` + `[slug].critic-score.md`) with 9-field frontmatter (`skill`, `version`, `date`, `status`, `channel`, `mode`, `touch`, `route`, `critic_total`). Schema changes require atomic update of `format-conventions.md` so the convention IS the contract.

## Scope Boundary

**In scope:**
- First-touch compose: email / LinkedIn (DM + connection note) / Twitter/X (reply + DM) / iMessage / SMS / platform proposals (Upwork, Fiverr, similar)
- Reply to inbound (objection handling + next-touch)
- Multi-touch coherence via optional `prior-touches` input
- Modes: services-sell (consulting/agency) / saas-sell / partnership-sell / community-sell

**Out of scope:**
- Sourcing, list-building, scraping (your tool stack)
- Multi-touch sequence as a single artifact (compose one at a time)
- Sequence diagnosis / A-B testing (future skill — `outbound-diagnose`)
- Fundraise outreach (VC/warm-intro norms differ); hiring outreach (candidate-sourcing differs)
- Sending / tracking / inbox warmup (Instantly, Lemlist, Smartlead layer)
- Voice memos, cold-call scripts
- Lifecycle / nurture / drip sequences (warm, consent-based, different craft)

## What This Skill Pulls From Elsewhere

- **coreyhaines/cold-email** (Claude skill by Corey Haines, ex-Baremetrics growth): structural frameworks (O→P→P→A), 4-level personalization, subject-line discipline, breakup protocol. → `references/frameworks/structures.md`, `references/frameworks/personalization-signals.md`, `references/channels/email.md`.
- **kostja94/cold-start-strategy** (Claude skill): "demand-signal outreach" — read posts/comments for expressed need rather than guessing pain. → `references/channels/twitter.md`, `references/channels/platform-proposals.md`.
- **practitioner — Make More Money** (YouTube, AI Automation Agency playbook, 2023-2024): services-mode defaults — audit/loom-teardown CTAs, revenue-tied problems, value-based positioning, Upwork as legit top-of-funnel. → `references/modes/services.md`, `references/channels/platform-proposals.md`. Specific artifacts: "Loom Teardown" template, "$10k/month Upwork Playbook" series.
- **framework — four-step cold outreach** (practitioner framework attributed to Andrei Saraev): personalization → who-am-I → offer → CTA, 7 Cialdini-mapped levers, verbatim $15M template, offer-formula equation. Strategist picks this in preference to `structures.md` when the message is touch 1 to a stranger with zero pre-existing trust. → `references/frameworks/saraev-four-step.md`.

## When NOT to use this skill

- **Need landing-page headline / tagline / ad CTA.** Use `write-copy` — writing craft, not outbound.
- **Multi-channel campaign across paid/owned/earned.** Use `plan-campaign` first, then this skill for the touches.
- **No persona, or ICP stale (>30d).** Use `research-icp` first — outbound without a persona produces generic outbound.
- **Sequence underperforming, need diagnosis.** Not this skill — future `outbound-diagnose` (not yet built).
- **Lifecycle / nurture / drip / transactional email.** NOT this skill. Those are warm, consent-based, different craft (subject-line discipline, deliverability, unsubscribe compliance).

## History / origin

- **v1.0.0 — initial release.** 8-agent orchestration (signal-analyst solo → strategist + proof-selector parallel → composer → voice-auditor → critic → terminal humanmaxxing). 5-dimension critic rubric (Peer voice, Signal connection, CTA friction, You>me ratio, Specificity) with Specificity Floor of ≥2 verifiable specifics. 9 channels (email, linkedin-dm, linkedin-connection, twitter-reply, twitter-dm, imessage, sms, upwork-proposal, other-platform). 4 modes (services-sell, saas-sell, partnership-sell, community-sell). 9 reply classifications. Routes A (compose) + B (reply) + C (called by campaign-plan).
- **v6 Phase 2 Wave 1 refactor (May 18, 2026, still v1.0.0):** body trimmed 537 → ≤230 lines (-57%+, at creative target). 5 new refs: playbook + format-conventions + procedures/pre-dispatch + procedures/dispatch-mechanics + examples/write-outreach-walkthrough.md. Extended anti-patterns.md with Orchestrator-Level Anti-Patterns section (9 rows from body) + Cross-Cutting Marketing-Stack Anti-Patterns section (4 rows: protected_tokens contract, post-humanmaxxing regression, campaign-plan Route C context, artifact schema drift). Existing `agents/{signal-analyst, strategist, proof-selector, composer, voice-auditor, critic, reply-classifier, reply-composer}.md` + `references/channels/{email, linkedin, twitter, imessage, platform-proposals}.md` + `references/modes/{services, saas, partnership, community}.md` + `references/frameworks/{structures, personalization-signals, ctas, objections, saraev-four-step}.md` + `references/proof-types.md` UNCHANGED (these ARE the skill's domain data and behavior). Before-Starting + Artifact Contract blocks added per Step 7.5 pattern. **Cross-stack contract preserved BYTE-IDENTICAL** (per vn-tone-slot + humanmaxxing-slot learning: no clarifying parentheticals, no nested-heading promotions, no rubric-explanation paragraphs added during refactor): 5-dim critic rubric wording, Specificity Floor of ≥2, 8-agent Manifest table, 3 Routes (A/B/C), Route A 10-step + Route B 7-step + Route C 3-step procedures, Reply Route rubric substitutions ("Signal connection" → "Tone match", "CTA friction" → "Next step clarity"), Missing-Input Hard Blocks (6 conditions), Artifact Frontmatter (10 fields), 4-tier Completion Status verdicts. No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Warm/Cold Start prompts (7-question Cold Start), Missing-Input Hard Blocks, Pre-Writing Assembly, write-back map, `--fast` behavior
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — Routes A/B/C, Layer 1a + 1b two-stage strategy, Merge Step, Layer 2 sequential, single-agent fallback, critic gate + rewrite loop, Terminal humanmaxxing + specificity regression, Reply Route Agent Flow
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — banned phrases catalog (~50 zero-tolerance), reply killers, structural anti-patterns, orchestrator-level (9 rows), cross-cutting marketing-stack (4 rows), when-to-bend-the-rules guidance
- [`format-conventions.md`](format-conventions.md) [PROCEDURE] — artifact frontmatter (10 fields), 3-file output structure, slug derivation, channel/mode/touch/route field values, critic_total format
- [`examples/write-outreach-walkthrough.md`](examples/write-outreach-walkthrough.md) [EXAMPLE] — end-to-end Route A walkthrough (services-sell, email touch 1 to a named target, signal-strength 4, O→P→P→A framework, critic PASS cycle 1 at 44/50, terminal humanmaxxing with `protected_tokens`, post-humanmaxxing regression passes)
- [`channels/`](channels/) — 5 per-channel craft refs (email, linkedin, twitter, imessage, platform-proposals)
- [`modes/`](modes/) — 4 per-mode defaults (services, saas, partnership, community)
- [`frameworks/`](frameworks/) — framework refs: `structures` (message shape by signal strength), `cold-email-frameworks` (named body arcs + the seniority/profile/warmth selector), `personalization-signals`, `ctas`, `objections`, `saraev-four-step`
- [`proof-types.md`](proof-types.md) — proof hierarchy (named case study > named logo + metric > specific claim > generic)
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec the procedure inherits from
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (this skill is `budget: deep`; `--fast` collapses Layer 1b parallel to sequential and skips post-humanmaxxing regression, but Critical Gates + Missing-Input Hard Blocks STILL enforced and Cold Start STILL fires when context missing)
