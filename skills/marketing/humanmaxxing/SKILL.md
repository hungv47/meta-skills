---
name: humanmaxxing
description: "Strip AI tells, inject brand voice, and compress existing text so it reads human-written — 15%+ word reduction with zero idea loss + optional detector-resistance pass. Use as a terminal polish pass on AI-drafted copy that sounds robotic. Not for writing new copy from scratch (use write-copy); for brand voice of record see create-brand."
argument-hint: "[content file or text]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.15-0.40"
---

# Humanmax & Compress — Orchestrator

Polish-pipeline for **existing** AI-drafted copy: strip AI **tells**, inject brand voice, compress with zero idea **loss** so the text reads **human-written**. 6 sub-agents. Capability metadata: [`routing.yaml`](routing.yaml). Agent table + routes + calibration + detector thresholds: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Triggers:** "sounds like AI", "too robotic", "humanize this", "ai slop", or terminal call from `write-copy`/`write-ad`/`write-outreach` (Route C). **Core question:** Would a human editor believe a human wrote this, and cut nothing?

## Critical Gates — load first

Full text + `--fast` carve-outs: [`references/procedures/critical-gates.md`](references/procedures/critical-gates.md).

1. **Pattern scan first** — strip without diagnosis is guessing.
2. **ZERO em dashes** in final output.
3. **Strip before voice** — soul-injection on AI prose is polishing a turd.
4. **Content type matters** — short-outbound caps compression at 0-10% to protect tokens.
5. **Detector resistance is structural** — run detector pass for high-stakes content.

## Absolute Prohibitions — zero tolerance

A single instance = critic auto-FAIL. Full list + enforcement: [`references/procedures/absolute-prohibitions.md`](references/procedures/absolute-prohibitions.md).

Em dashes · "it's not just X, it's Y" · rhetorical-question hooks · colons in prose · "actually" as emphasis · filler context ("in today's…", "rapidly changing") · emojis · unsourced 47/73 · staccato taglines ("Your X, Y'd").

## Quality Gate

Critic-agent verifies before delivery. Full 10-item checklist + re-dispatch routing: [`references/procedures/quality-gate.md`](references/procedures/quality-gate.md).

- Zero Hard Tells · ≤2 Soft Tells · no 3+ AI-vocab clusters
- ≥15% word reduction · no-generic-long-form · zero idea loss vs. **existing** input
- Read-aloud passes · density floor (concrete fact/number/named example per paragraph)
- `detector_status` recorded (`not_run`/`proxy_pass`/`proxy_fail`/`pangram_pass`/`pangram_fail`) · Route-C protected tokens verbatim

FAIL → re-dispatch named agent (max 2 cycles, then `DONE_WITH_CONCERNS`).

## Before Starting

Apply `references/_shared/before-starting-check.md`.

| Artifact | Source | Required? |
|---|---|---|
| `brand/BRAND.md` | create-brand | Recommended — voice + lexicon |
| `research/product-context.md` | research-icp | Recommended — voice adjectives + register |
| `docs/forsvn/artifacts/marketing/content/[slug].md` | upstream | Optional — source skill from frontmatter |
| `docs/forsvn/experience/brand.md` | any | Optional — persisted `Voice — adjectives` |

## Pre-Dispatch + Mode + Routing

Canonical Pre-Dispatch (`references/_shared/pre-dispatch-protocol.md`). Dimensions: target voice, compression (light/moderate/heavy), register, detector mode (none/proxy/pangram), protected tokens (Route C). Warm/Cold Start + write-back: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode (`references/_shared/mode-resolver.md`) auto-downgrades to A for ≤3 sentences + no prior artifacts. `--fast` collapses B → A (pattern-scanner + strip + critic), skips detector verification. **Never skips Cold Start, Critical Gates, or Prohibitions.**
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

Routes — **A** (<200 words, pattern-only) · **B** (≥200 words, full pipeline) · **C** (caller-driven). Spawn mechanics: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Artifact Contract

- **Path (A/B):** `docs/forsvn/artifacts/marketing/content/[slug].humanmaxxed.md`. **Route C:** embedded in caller's artifact.
- **Lifecycle:** `pipeline` — re-run renames prior to `[slug].humanmaxxed.v[N].md`.
- **Frontmatter:** `skill`, `version`, `date`, `status`, `compression` (%), `detector_status`, `protected_tokens_preserved`.
- **Body (in order):** Humanization Summary (10-row metric table) · Change Log (Location/Original/Change/Rule) · Humanmaxxed content (H2s preserved).
- **Callers preserve** `polish_chain_applied: humanmaxxing` + `humanmaxxing_quality_score: N/50` + `humanmaxxing_detector_status` in their frontmatter.
- **Cross-stack contract:** schema changes need atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers".

Full template: [`references/format-conventions.md`](references/format-conventions.md).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 10 pipeline + 4 cross-cutting. Most common: em dash retention, voice-before-strip, surface compression, sterile output.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — patterns stripped, voice injected (Route B), compression applied, critic PASS.
- **DONE_WITH_CONCERNS** — critic flagged a dimension under threshold; annotations preserved.
- **BLOCKED** — original has structural problems beyond pattern removal (factual errors, broken logic, missing claims). Humanmax can't fix what isn't there.
- **NEEDS_CONTEXT** — voice reference unavailable for Route B; recommend `create-brand` or supply samples.

## Next Step

Send/publish. On detector fail or `DONE_WITH_CONCERNS`, re-invoke with critic feedback + tighter compression.

## Worked Example

Route B end-to-end (178 → 91 words, 49% compression, 40/50 PASS) + cycle-2 FAIL + `--fast` + Route C variants: [`references/examples/humanmaxxing-walkthrough.md`](references/examples/humanmaxxing-walkthrough.md).
