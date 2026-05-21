---
name: humanize
description: "Strips AI tells, injects brand voice, and compresses existing text so it reads human-written — targets 15%+ word reduction with zero idea loss, and can run a detector-resistance pass for high-stakes content. Use as a terminal polish pass on AI-drafted copy that sounds robotic or generic. Not for writing new copy from scratch (use write-copy); for brand voice of record, see create-brand."
argument-hint: "[content file or text]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "2.0.0"
  budget: standard
  estimated-cost: "$0.15-0.40"
---

# Humanize & Compress — Orchestrator

*Communication — Horizontal. Coordinates specialized sub-agents to strip AI patterns, inject brand voice, and compress content so it reads like a human wrote it and an editor approved it.*

**Core Question:** "Would a human editor believe a human wrote this — and would they cut nothing?"

> Why this skill exists, philosophy, methodology, principles, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates — Read First

1. **Do NOT skip the pattern scan.** Step 2 (strip) needs the diagnosis. Without it, strip-agent is guessing.
2. **ZERO em dashes in final output.** Absolute prohibition. No exceptions, no edge cases. Every em dash becomes a comma, period, or parentheses.
3. **Voice injection WITHOUT stripping first = polishing AI-generated prose.** Strip always comes first. The soul-injection agent receives clean text, not AI-patterned text.
4. **Content type matters.** Documentation gets a lighter touch than marketing copy. Check the Content Type Calibration table before dispatching.
5. **Detector resistance is structural, not lexical.** Pangram-style classifiers can catch synonym-swapped prose. For high-stakes public content, prior detector failures, or explicit detector-sensitive requests, use the detector-resistance pass after the normal critic and record the threshold used.

## Quality Gate
Before delivering, the **critic agent** verifies:
- [ ] Zero Hard Tell patterns from the 47-pattern checklist
- [ ] At most 2 Soft Tell patterns in the entire piece
- [ ] No clusters of 3+ high-frequency AI vocabulary words in any paragraph
- [ ] At least 15% word reduction from original
- [ ] No unique ideas, data, examples, or nuance removed (check against original)
- [ ] Read aloud with no stumbles, no robotic rhythm
- [ ] Every paragraph contains at least one concrete fact, number, or named example
- [ ] Detector-resistance proxy passes for high-stakes public content, or external detector status is recorded (`not_run`, `proxy_pass`, `pangram_pass`, `proxy_fail`, `pangram_fail`)
- [ ] If Pangram or another classifier is available and `detector_mode: pangram`, the output meets the configured probability threshold from `references/detector-resistance.md`; otherwise the critic records `pangram_fail`
- [ ] Protected tokens from upstream skills are preserved verbatim

### Absolute Prohibitions (zero tolerance, no exceptions)
These patterns are so strongly associated with AI that a single instance ruins credibility:
1. **No em dashes (---).** Replace every em dash with a comma, period, or parentheses. Restructure the sentence if needed. Zero em dashes in final output.
2. **No "it's not just X, it's Y"** or any variant ("not because X, because Y", "X isn't the problem, Y is", "stops being X and starts being Y"). State the positive claim directly.
3. **No rhetorical questions as hooks.** Never use "Why?", "The best part?", "Sound familiar?", "So what does this mean?" or any standalone question designed to create false suspense. State the point.
4. **No colons in prose.** Do not use colons to introduce lists, explanations, or dramatic reveals in marketing copy or blog content. Restructure into natural sentences.
5. **No "actually" as emphasis.** "X that actually Y" is an AI tell. Delete "actually" or rewrite the sentence.
6. **No filler context phrases.** "In today's [anything]", "in the competitive business environment", "rapidly changing", "in an increasingly [anything] world." Delete the entire phrase or sentence.
7. **No emojis.** Not in any content type.
8. **No unsourced 47 or 73.** These are known LLM number biases. Any instance of 47 or 73 in the output must have a cited real-world source. If the number was generated, replace with actual data or remove entirely.
9. **No staccato taglines.** "Your X, Y'd" ("Your Workflows, Mapped") and "X. Y." ("Analytics. Simplified.") are fragmentary headline constructions so overused by AI they are an instant fingerprint. Rewrite with a specific claim that communicates something real.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — load brand voice + content type, identify any prior humanize artifact for the same slug, check freshness windows on voice adjectives (>30d → recommend `research-icp` re-run).

| Artifact | Source | Required? |
|---|---|---|
| `brand/BRAND.md` | brand-system | Recommended — voice rules + lexicon |
| `research/product-context.md` | icp-research | Recommended — voice adjectives + audience register |
| `.forsvn/artifacts/mkt/content/[slug].md` | upstream | Optional — if polishing a prior artifact, extract source skill from frontmatter |
| `.forsvn/experience/brand.md` | (any skill) | Optional — `Voice — adjectives` key if user previously persisted |

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** target voice (adjectives or brand ref), compression target (light/moderate/heavy), register preservation (keep formal vs neutralize), detector mode (none/proxy/pangram), protected tokens (Route C only).

Full read-order + Warm/Cold Start prompts + Pre-Writing Assembly + write-back map + hard-block conditions + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — auto-downgrade for ≤3 sentences AND no prior artifacts (collapses to Route A); `--fast` flag collapses Route B → Route A regardless of text length (skip voice-extractor + soul-injection + compression; run pattern-scanner + strip + critic only) and skips Detector-Resistance Verification. **`--fast` does NOT skip Cold Start, Critical Gates 1-5, or Absolute Prohibitions 1-9.**

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Pattern Scanner | 1 (parallel) | `agents/pattern-scanner-agent.md` | Runs all 47 AI patterns, logs violations by category, estimates compression potential |
| Voice Extractor | 1 (parallel) | `agents/voice-extractor-agent.md` | Reads voice adjectives, assesses register, identifies injection opportunities |
| Strip Agent | 2 (sequential) | `agents/strip-agent.md` | Surgical removal of flagged AI patterns — subtract only, no style changes |
| Soul Injection | 2 (sequential) | `agents/soul-injection-agent.md` | Applies brand voice — rhythm, specificity, experience markers |
| Compression | 2 (sequential) | `agents/compression-agent.md` | Systematic 15-30% compression at sentence, paragraph, section levels |
| Critic | 2 (final) | `agents/critic-agent.md` | Three-pass audit, 5-dimension scoring, PASS/FAIL with re-dispatch routing |

---

## Routing + Dispatch

Three routes — Route A (short text, pattern-only), Route B (full pipeline), Route C (called by another skill).

```
ROUTE A (text < 200 words):
  1. Pre-Dispatch (per procedures/pre-dispatch.md)
  2. LAYER 1: pattern-scanner-agent only (voice-extractor skipped)
  3. LAYER 2: strip-agent → critic-agent (soul-injection + compression skipped)
  4. Critic FAIL → re-dispatch strip-agent (max 2 cycles)
  5. Deliver artifact

ROUTE B (text ≥ 200 words, full):
  1. Pre-Dispatch
  2. LAYER 1 IN PARALLEL: pattern-scanner + voice-extractor
  3. User checkpoint: present diagnosis, confirm proceed
  4. LAYER 2 SEQUENTIAL: strip → soul-injection → compression → critic
  5. Critic FAIL → re-dispatch named agent(s) (max 2 cycles)
  6. Detector-Resistance Verification (if detector_mode != none)
  7. Deliver artifact

ROUTE C (called by another skill):
  1. Pre-Dispatch: trust calling skill's pre-resolved voice + content_type + protected_tokens + detector_mode
  2. If content already passed copywriting's Seven-Sweeps: skip pattern-scanner, dispatch compression + critic only
  3. Otherwise: Layer 1 (no user checkpoint) → Layer 2
  4. Return polished text + metadata to calling skill (no standalone artifact file)
  5. Run protected-token regression if `protected_tokens` was passed
```

Mechanics (how to spawn agents, single-agent fallback, Layer 1 user checkpoint details, Layer 2 sequential pipeline, critic gate + rewrite loop, Detector-Resistance Verification, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Content Type Calibration

This skill's examples are marketing-focused, but it works on any content type. Adjust the intensity of each step by content type:

| Content Type | Strip Intensity | Voice Injection | Compression Target |
|-------------|----------------|-----------------|-------------------|
| Marketing copy | Full — all 47 patterns | Full — brand voice adjectives | 20-30% |
| Blog posts / thought leadership | Full | Moderate — author voice, not brand voice | 15-25% |
| Short outbound — `content-type: "short-outbound"` (cold email, DM, proposal, Meta ad copy) | Light — AI telltales only | Full — sender voice | 0-10% (already compressed; further cuts kill specificity) |
| Documentation / technical writing | Light — focus on clarity patterns only | Minimal — accuracy over personality | 10-15% |
| Internal communications | Moderate | Light — conversational, not branded | 15-20% |
| Academic / research | Light — remove only Hard Tells | None — maintain formal register | 5-10% |

**Key principle:** The further from marketing, the lighter the touch. Documentation that sounds like a blog post is worse than documentation with a few AI tells. Short outbound (cold email, DM, Upwork proposal) is a special case: it's typically 4-6 sentences with a named entity + number doing heavy lifting — compress further and you strip the thing that earns the reply.

**Protected tokens (short-outbound only):** When called by `write-outreach` or `write-ad`, the caller passes a `protected_tokens` list of named entities and numbers that must appear verbatim in the final output. Do not paraphrase, round, or remove these.

**Detector-sensitive content:** If content is public, high-stakes, or previously flagged by a detector, set `detector_mode: proxy` unless a real detector integration is available. If `PANGRAM_API_KEY` or an operator-configured detector command exists, set `detector_mode: pangram`, apply the threshold table in `references/detector-resistance.md`, and record the actual result plus threshold. If neither exists, run the proxy checklist and record `detector_status: proxy_pass` or `proxy_fail`; use `not_run` only when detector mode is explicitly disabled or the content is low-stakes internal material.

**Default detector thresholds:** Public marketing and thought-leadership content targets `human_probability >= 0.95` or `ai_probability <= 0.05`. Admissions, applications, compliance-sensitive, and reputation-sensitive content targets `human_probability >= 0.99` or `ai_probability <= 0.01` when a real classifier is available. Policy-capped environments use the operator's stricter threshold and must record the claimed false-positive cap; do not claim compliance from a proxy-only check.

---

## Artifact Contract

- **Path (Route A/B):** `.forsvn/artifacts/mkt/content/[slug].humanized.md`
- **Path (Route C):** no standalone artifact — polished text + metadata embedded in calling skill's artifact
- **Lifecycle:** `pipeline` — one artifact per (slug, run); re-run renames to `[slug].humanized.v[N].md` and creates new with incremented version
- **Frontmatter fields:** `skill`, `version`, `date`, `status`, `compression` (%), `detector_status` (not_run / proxy_pass / proxy_fail / pangram_pass / pangram_fail), `protected_tokens_preserved` (true / false / N/A)
- **Body sections (3, in order):** Humanization Summary (10-row metric table) · Change Log (4-column table: Location / Original / Change / Rule) · Humanized content (H2 sections from original preserved as-is)
- **Consumed by:** upstream calling skill (Route C) OR human reader (Route A/B); calling skills SHOULD preserve `polish_chain_applied: humanize` + `humanize_quality_score: N/50` + `humanize_detector_status: <value>` in their own artifact frontmatter
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers (verbatim)" — never silently drift

Full template + per-section format rules (date format, typography binary gate, frontmatter + body section headers, Change Log row format, quality_score format, detector_status field values, protected_tokens_preserved field values) live in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Artifact Template

```markdown
---
skill: humanize
version: 1
date: [today's date]
status: done | done_with_concerns | blocked | needs_context
compression: [X]%
detector_status: not_run | proxy_pass | proxy_fail | pangram_pass | pangram_fail
protected_tokens_preserved: true | false
---

# Humanized: [Original Title]

## Humanization Summary

| Metric | Value |
|--------|-------|
| Words (original) | [count] |
| Words (humanized) | [count] |
| Compression | [X]% |
| AI patterns found | [count] |
| AI patterns fixed | [count] |
| Hard Tells remaining | 0 |
| Soft Tells remaining | [0-2] |
| Quality score | [X]/50 (Di:[n] R:[n] T:[n] A:[n] De:[n]) |
| Detector status | [not_run / proxy_pass / proxy_fail / pangram_pass / pangram_fail] |
| Protected tokens preserved | [yes/no/N/A] |

## Change Log

| Location | Original | Change | Rule |
|----------|----------|--------|------|
| [para/section] | "[original text]" | "[new text]" or [deleted] | Pattern #[N] / Compression / Voice |

---

[Humanized content here]
```

> On re-run: rename existing artifact to `[slug].humanized.v[N].md` and create new with incremented version.

---

## Anti-Patterns

Polish-pipeline reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships. 10 pipeline anti-patterns (skipping pattern scan, voice injection before stripping, mechanical pattern-matching, sterile output, surface compression, voice cosplay, one-pass editing, ignoring critic FAIL, destroying structure, over-compressing introductions) + 4 cross-cutting marketing-stack rows (upstream-skipped-humanize, calling skill drops protected_tokens contract, cross-stack contract drift, detector-status fabrication).

Most common in practice: em dash retention (Absolute Prohibition #1), voice injection before stripping (Critical Gate 3), surface compression (cuts data not filler), sterile clean output (soul-injection skipped or under-applied).

---

## Completion Status

Every run ends with explicit status:
- **DONE** — patterns stripped, voice injected (Route B), compression applied, critic 5-dimension PASS
- **DONE_WITH_CONCERNS** — humanized but critic flagged a dimension under threshold (voice consistency, specificity, or rhythm); annotations preserved in artifact
- **BLOCKED** — original text contains structural problems beyond pattern removal (factual errors, broken logic, missing claims); humanize cannot fix what isn't there
- **NEEDS_CONTEXT** — voice reference unavailable for Route B (no brand voice file or sample, user can't describe target voice); recommend `create-brand` or supply samples

---

## Worked Example

End-to-end Route B walkthrough (AI-generated SaaS onboarding blog post, 178 words → 91 words, 49% compression, 40/50 PASS cycle 1) + FAIL-handling cycle-2 variant + `--fast` variant + Route C variant (called by cold-outreach with protected_tokens): [`references/examples/humanize-walkthrough.md`](references/examples/humanize-walkthrough.md) [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/humanize-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch): `references/{ai-patterns, voice-injection, conciseness-rules, detector-resistance, regression-suite}.md`
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol}.md`
- **Agents:** 6 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 5-dimension rubric.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
