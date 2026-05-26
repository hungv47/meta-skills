---
name: humanmaxxing
description: "Strip AI tells, inject brand voice, and compress existing text so it reads human-written — 15%+ word reduction with zero idea loss + optional detector-resistance pass. Use as a terminal polish pass on AI-drafted copy that sounds robotic. Not for writing new copy from scratch (use write-copy); for brand voice of record see create-brand."
argument-hint: "[content file or text]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "2.2.0"
  budget: standard
  estimated-cost: "$0.15-0.40"
---

# Humanmax & Compress — Orchestrator

Coordinates 6 sub-agents to strip AI patterns, inject brand voice, and compress content so it reads like a human wrote it and an editor approved it. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 3 routes + content-type calibration + detector-resistance thresholds: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Would a human editor believe a human wrote this — and would they cut nothing?

## Critical Gates — load first

1. **Do NOT skip the pattern scan.** Step 2 (strip) needs the diagnosis. Without it, strip-agent is guessing.
2. **ZERO em dashes in final output.** Absolute prohibition. No exceptions. Every em dash → comma, period, or parentheses.
3. **Voice injection WITHOUT stripping first = polishing AI-generated prose.** Strip always comes first. Soul-injection receives clean text, not AI-patterned text.
4. **Content type matters.** Documentation gets a lighter touch than marketing copy. Check the Content Type Calibration table in `agent-manifest.md` before dispatching.
5. **Detector resistance is structural, not lexical.** Pangram-style classifiers catch synonym-swapped prose. For high-stakes public content, prior detector failures, or explicit detector-sensitive requests, use the detector-resistance pass after the normal critic and record the threshold used.

## Absolute Prohibitions — zero tolerance

A single instance ruins credibility:

1. **No em dashes (—).** Every em dash → comma / period / parentheses. Restructure if needed.
2. **No "it's not just X, it's Y"** or variants ("not because X, because Y", "X isn't the problem, Y is", "stops being X and starts being Y"). State the positive claim directly.
3. **No rhetorical questions as hooks.** "Why?", "The best part?", "Sound familiar?", "So what does this mean?" — state the point.
4. **No colons in prose.** Not in marketing copy or blog content. Restructure into natural sentences.
5. **No "actually" as emphasis.** "X that actually Y" — delete "actually" or rewrite.
6. **No filler context phrases.** "In today's …", "in the competitive business environment", "rapidly changing", "in an increasingly … world." Delete the entire phrase or sentence.
7. **No emojis.** Any content type.
8. **No unsourced 47 or 73.** Known LLM number biases. Any 47 / 73 must cite a real-world source or be replaced/removed.
9. **No staccato taglines.** "Your X, Y'd" / "X. Y." Rewrite with a specific claim.

## Quality Gate

Critic-agent verifies before delivery:

- [ ] Zero Hard Tell patterns from the 47-pattern checklist
- [ ] At most 2 Soft Tell patterns in the entire piece
- [ ] No clusters of 3+ high-frequency AI vocabulary words in any paragraph
- [ ] ≥15% word reduction from original
- [ ] No-generic-long-form (long-form types only): output cannot lose another 40% of its words without losing a unique idea, datum, example, or nuance
- [ ] No unique ideas, data, examples, or nuance removed (check against original)
- [ ] Read aloud with no stumbles, no robotic rhythm
- [ ] Every paragraph contains at least one concrete fact, number, or named example
- [ ] Detector-resistance proxy passes for high-stakes public content, or external detector status recorded (`not_run` · `proxy_pass` · `pangram_pass` · `proxy_fail` · `pangram_fail`)
- [ ] If Pangram or another classifier is available and `detector_mode: pangram`, the output meets the configured probability threshold from `references/detector-resistance.md`; otherwise the critic records `pangram_fail`
- [ ] Protected tokens from upstream skills are preserved verbatim

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Recommended context:

| Artifact | Source | Required? |
|---|---|---|
| `brand/BRAND.md` | create-brand | Recommended — voice rules + lexicon |
| `research/product-context.md` | research-icp | Recommended — voice adjectives + audience register |
| `.forsvn/artifacts/mkt/content/[slug].md` | upstream | Optional — if polishing a prior artifact, extract source skill from frontmatter |
| `.forsvn/experience/brand.md` | (any skill) | Optional — `Voice — adjectives` key if previously persisted |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). Needed dimensions: target voice (adjectives or brand ref), compression target (light / moderate / heavy), register preservation, detector mode (none / proxy / pangram), protected tokens (Route C only). Warm/Cold Start prompts + write-back map: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): auto-downgrade for ≤3 sentences AND no prior artifacts (collapses to Route A). `--fast` collapses Route B → Route A regardless of length (skip voice-extractor + soul-injection + compression; run pattern-scanner + strip + critic only) and skips Detector-Resistance Verification. **`--fast` does NOT skip Cold Start, Critical Gates 1-5, or Absolute Prohibitions 1-9.**

## Routing

Three routes — A (text <200 words, pattern-only), B (text ≥200 words, full pipeline), C (called by another skill — trust caller's pre-resolved context, no user checkpoint). Full route graphs + agent table: [`references/agent-manifest.md`](references/agent-manifest.md). Spawn mechanics + single-agent fallback + chain position: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Artifact Contract

- **Path (Route A/B):** `.forsvn/artifacts/mkt/content/[slug].humanmaxxed.md`
- **Path (Route C):** no standalone artifact — polished text + metadata embedded in calling skill's artifact
- **Lifecycle:** `pipeline` — one artifact per (slug, run); re-run renames prior to `[slug].humanmaxxed.v[N].md`.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `compression` (%), `detector_status` (`not_run` / `proxy_pass` / `proxy_fail` / `pangram_pass` / `pangram_fail`), `protected_tokens_preserved` (`true` / `false` / `N/A`).
- **Body (3 sections, in order):** Humanization Summary (10-row metric table) · Change Log (4-column table: Location / Original / Change / Rule) · Humanmaxxed content (H2 sections from original preserved as-is).
- **Consumed by:** upstream calling skill (Route C) OR human reader (Route A/B). Callers SHOULD preserve `polish_chain_applied: humanmaxxing` + `humanmaxxing_quality_score: N/50` + `humanmaxxing_detector_status: <value>` in their own artifact frontmatter.
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers (verbatim)" — never silently drift.

Full template + per-section format rules: [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before output ships. 10 pipeline anti-patterns (skipping pattern scan, voice injection before stripping, mechanical pattern-matching, sterile output, surface compression, voice cosplay, one-pass editing, ignoring critic FAIL, destroying structure, over-compressing introductions) + 4 cross-cutting marketing-stack (upstream-skipped-humanmaxxing, calling skill drops protected_tokens, cross-stack contract drift, detector-status fabrication).

Most common in practice: em dash retention (Absolute Prohibition #1), voice injection before stripping (Critical Gate 3), surface compression (cuts data not filler), sterile clean output (soul-injection skipped or under-applied).

## Completion Status

- **DONE** — patterns stripped, voice injected (Route B), compression applied, critic 5-dimension PASS.
- **DONE_WITH_CONCERNS** — humanmaxxed but critic flagged a dimension under threshold (voice consistency, specificity, or rhythm); annotations preserved.
- **BLOCKED** — original text has structural problems beyond pattern removal (factual errors, broken logic, missing claims). Humanmax cannot fix what isn't there.
- **NEEDS_CONTEXT** — voice reference unavailable for Route B (no brand voice file or sample, user can't describe target voice); recommend `create-brand` or supply samples.

## Worked Example

End-to-end Route B walkthrough (AI-generated SaaS onboarding blog, 178 words → 91 words, 49% compression, 40/50 PASS cycle 1) + FAIL-handling cycle-2 variant + `--fast` variant + Route C variant (called by write-outreach with protected_tokens): [`references/examples/humanmaxxing-walkthrough.md`](references/examples/humanmaxxing-walkthrough.md).
