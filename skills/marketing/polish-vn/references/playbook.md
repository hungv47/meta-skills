---
title: VN-Tone Playbook
lifecycle: canonical
status: stable
produced_by: vn-tone
load_class: PLAYBOOK
---

# VN-Tone Playbook

## Why this skill exists

Machine-translated and non-native Vietnamese fails in four predictable ways that no amount of "more context" can fix without targeted work: wrong pronoun pair for the register, missing sentence-final particles that carry casual warmth, literal idiom calques that land as nonsense, and corporate translationese that stacks abstract nouns the way English does. These are not creative-writing problems — they're register-mechanics problems. The polisher's job is to operate on form, never on content, and to do it inside a register the user has explicitly named (or is willing to confirm).

This skill is the polish-chain endpoint for Vietnamese output across the marketing stack. Upstream skills that produce VN prose (`brief-shortform`, `write-social`, `write-copy`, `write-ad`, `write-outreach`, `optimize-seo`, `brief-landing-page`, `create-brand`, `brief-graphic`, `plan-campaign`) auto-route to `polish-vn` whenever `market = VN` per their Pre-Dispatch wiring. vn-tone itself does NOT route back — it's the terminus.

## Why this skill exists at all

Five failure modes it prevents:

1. **MT-default corporate stiffness.** "Quý khách thân mến!" / "Chúng tôi rất hân hạnh chào đón quý khách" — MT systems default to corporate-formal regardless of brand voice. Critical Gate 2 + critic Pass 2 force register resolution upfront, then enforce the chosen register through pronoun-pair holding.
2. **Pronoun pair drift.** Opening with `chúng tôi ↔ quý khách`, switching to `mình ↔ bạn` mid-paragraph, ending with no pronouns at all. Absolute Prohibition #5 + critic auto-FAIL on any drift make this binary, not graded.
3. **Cliché stack.** `Giải pháp toàn diện`, `trải nghiệm đột phá`, `tối ưu hóa`, `chuyển đổi số`, `hành trình` — corporate-translationese fingerprints. Absolute Prohibition #7 forbids stacking two in one paragraph; polisher's job is to delete them when stacked, not polish around them.
4. **English typography intrusion.** Em dashes (`—`), Oxford commas before `và`, title-case headlines, smart quotes. These are English habits that signal "translated" instantly. Absolute Prohibition #1 + critic Typography Pass enforce typography correctness as a binary gate.
5. **Fact alteration disguised as polish.** "Improving flow" by quietly cutting a number, rewording a quoted statement, or dropping a named example. Critical Gate 3 + critic Meaning Preservation Pass treat this as auto-FAIL. Polish is form-only.

The structural answer is the **36-point critic rubric** (in `agents/critic-agent.md`) — three passes (Hard Tells binary / Register Consistency / Read-Aloud Naturalness) plus Meaning Preservation + Typography Correctness. PASS = ≥28/36 AND Hard Tells cleared = 1. Any single Hard Tell remaining = auto-FAIL regardless of total score.

## Philosophy

Vietnamese register is carried almost entirely by **pronouns, sentence-final particles, vocabulary choice (Sino-Vietnamese vs. native), and sentence rhythm**. A single wrong pronoun ruins the whole register. A missing particle makes the sentence sound translated-from-English.

The polisher operates on form, not content. Meaning is preserved unconditionally — numbers, names, dates, quoted statements, claims, and named examples must survive intact. If the original has a fact, the polished version has the same fact.

Register is pair-locked. The polisher picks one pronoun pair (self ↔ reader) at the start and holds it to the end. Drift is the #1 translation giveaway — catching it is the critic's primary gate.

**Form > vibes > "creative interpretation".** Every fix cites a rule from `translation-artifacts.md` (28-pattern catalog) or `vn-tone-corpus.md` (register profiles). No vibes-based polishing; no vibes-based criticism.

## Methodology

**Three-agent pipeline, deliberate.** Diagnostic → Polish → Critic. Each pass has a different focus (detect / fix / verify). Combining them produces worse results because the polisher rewrites by vibes instead of working off a violation log, and the critic re-diagnoses instead of verifying.

**Diagnostic gates the polish.** The diagnostic agent produces a violation log + register-gap assessment + rewrite-scope estimate (light / moderate / heavy). The orchestrator surfaces this to the user before dispatching the polisher — if the user wants to override specific Hard Tells (e.g., "keep `quý khách` — luxury brand directive"), they pass `user_directives` to the polisher. This gates the polish on user-confirmed intent, not autopilot.

**Critic is verification, not re-diagnosis.** The critic trusts the diagnostic log as the baseline and verifies the polisher's output against it. The critic does NOT re-run the diagnostic; that's scope creep.

**Two-cycle rewrite cap.** If the critic FAILs cycle 1, polisher re-dispatched with critic feedback as `feedback` input. If cycle 2 also FAILs, return the polisher's best attempt with critic annotations + `DONE_WITH_CONCERNS` status. The transparency IS the value.

**Single market per artifact.** vn-tone is Vietnamese-only by definition. Multi-market campaigns re-run the skill per market (and upstream skills like `research-shortform` enforce the same single-market rule).

## Principles

- **Hard Tells are binary.** Any single Hard Tell remaining = auto-FAIL regardless of total score. Pass 1 of the critic is a gate, not a scoring dimension.
- **Pronoun pair is non-negotiable.** Drift is the #1 MT giveaway. Pair held = 10/10 on critic Pass 2; one drift = 6; two drifts = 3; three or more = 0 and auto-FAIL the pass gate.
- **Particle density is range-bound.** Báo chí: 0% (any particle = auto-FAIL Absolute Prohibition #4). Casual/pop/bro: 15–25% range. Over-injection (every sentence ending `nha`) is as wrong as zero.
- **Subvariants are non-interchangeable.** `bro-otofun` (Hanoi cụ-mợ, "em + cụ") and `bro-voz` (Voz ae-thím, "mình + ae") are distinct speech communities. Mixing them in one piece = critic auto-FAIL.
- **Polish is form-only.** Touching facts, numbers, or named examples to "improve flow" is auto-FAIL on Meaning Preservation. Preserve every factual anchor; flag rather than cut.
- **Loanwords calibrate by register.** `API`, `webhook`, `gaming`, `router` are fine in semi-casual tech. Drop in báo chí; keep in semi-casual/pop where natural. No blanket overscrubbing.
- **The artifact IS the contract.** Frontmatter (8 fields) + body sections (Polish Summary table + Change Log table + Polished Text + Status block) follow a fixed schema. Schema changes require atomic update of any consumer that reads vn-tone output (currently the upstream skill that auto-routed in for polish).

## When NOT to use this skill

- **Source text is in English.** vn-tone does not translate. Run `humanmaxxing` on the English first if it needs AI-pattern removal, translate with your preferred MT (or use `write-copy` with VN voice directives for new VN copy), then run vn-tone on the result.
- **Source text is in any other non-Vietnamese language.** Same as above — translate first.
- **New Vietnamese copy from scratch.** Use `write-copy` with VN voice directives. vn-tone polishes existing VN text; it does not generate.
- **A/B variants of already-polished text.** Use `write-copy` variant agent. vn-tone is a single-pass polish, not a multi-variant generator.
- **English tone work.** Use `humanmaxxing` for EN AI-pattern stripping and voice injection. humanmaxxing is to EN what vn-tone is to VN.
- **Mixed-language text (Vinglish, code-switching).** Edge case — flag to user. Default behavior is to polish the VN portions and preserve the EN portions as loanwords (per loanword principle); if the user wants the EN portions converted, that's a translation job, not a polish job.

## History / origin

- **v1.0.0 — initial release.** 3-agent orchestration (diagnostic → polisher → critic). 4-register catalog (báo chí / semi-casual / bro / pop-marketing) with 2 subvariants (bro-otofun / bro-voz). Built on a live-scraped corpus from VnExpress, Chinhphu.vn, Tinhte, Spiderum, Otofun, Voz, Kenh14 (annotated in `vn-tone-corpus.md`). 28-pattern translation-artifact catalog (`translation-artifacts.md`) covering pronoun failures, particle failures, idiom calques, grammar calques, corporate translationese, typography errors, number/date format errors. 36-point critic rubric with Hard Tells as binary gate.
- **v6 Phase 2 Wave 1 refactor (May 18, 2026, still v1.0.0):** body trimmed 508 → 201 lines (-60.4%; under ≤230 creative target by 29 lines). Fresh-eyes flagged 2 CRITICALs + 2 MAJORs on byte-identical contract drift (Completion Status verdicts + Quality Gate lead + Absolute Prohibitions heading level); all 4 reverted inline to restore strict byte-identity per body-diet-only rule. Contract clarifications deferred to a future v6.3.0 behavior-fix bundle. 5 new refs: playbook + format-conventions + anti-patterns (NEW — extracted 11 patterns from body + 4 cross-cutting marketing-stack rows) + procedures/pre-dispatch + procedures/dispatch-mechanics. New examples/vn-tone-walkthrough.md (extracted from body's Worked Example § Route A). Existing `agents/{diagnostic,polisher,critic}-agent.md` + `references/{vn-tone-corpus,translation-artifacts}.md` UNCHANGED (these ARE the skill's domain data and behavior). Before-Starting + Artifact Contract blocks added per Step 7.5 pattern. **Cross-stack contract preserved BYTE-IDENTICAL:** 4 Critical Gates, 8 Absolute Prohibitions, 7-bullet Quality Gate, 3-agent Manifest, 4-tier Completion Status, Artifact Template frontmatter + body sections, 4 registers + 2 subvariants, 36-point critic rubric thresholds (PASS ≥28/36 AND Hard Tells = 1). No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Register Resolution priority, Warm/Cold start prompts, Pre-Writing Assembly, write-back map, `--fast` behavior
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — Route A vs Route B, Layer 1 diagnostic + user checkpoint, Layer 2 sequential polisher → critic, single-agent fallback, critic gate + rewrite loop
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — 11 polishing failure modes + 4 cross-cutting marketing-stack patterns
- [`format-conventions.md`](format-conventions.md) [PROCEDURE] — artifact frontmatter, Polish Summary table format, Change Log format, typography rules
- [`examples/vn-tone-walkthrough.md`](examples/vn-tone-walkthrough.md) [EXAMPLE] — end-to-end Route A walkthrough (pop-marketing register, SaaS onboarding email, MT-translated, 4 sentences)
- [`vn-tone-corpus.md`](vn-tone-corpus.md) — 4 registers + 2 subvariants with pronouns / particles / vocabulary / rhythm / typography / annotated live samples (read by all 3 agents)
- [`translation-artifacts.md`](translation-artifacts.md) — 28 EN→VN translation giveaways across 10 categories (Hard/Soft severity, fix rules; read by diagnostic + polisher + critic)
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec the procedure inherits from
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (this skill is `budget: standard`; `--fast` collapses to single-pass polisher with critic skipped, but Critical Gates 1-4 STILL enforced and Register Resolution STILL fires when register is missing)
