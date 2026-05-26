---
name: write-social
description: "Platform-native social copy (hook variants + body + CTA + format spec) for tiktok, reels, shorts, x, linkedin. Single-platform per artifact. 5-dim rubric. Not for paid-ad copy (use write-ad), landing-page copy (use write-copy), short-form video briefs with storyboards (use brief-shortform), or long-form articles. Vietnamese polish: polish-vn. AI-tell cleanup: humanmaxxing."
argument-hint: "<topic-or-brief-path> <platform> [--variants N] [--polish-chain humanmaxxing|vn-tone|none] [--goal awareness|engagement|click|save|share]"
allowed-tools: Read Write Bash Grep Glob
metadata:
  version: "1.1.0"
  budget: standard
  estimated-cost: "$0.50-1.50"
---

# Social Copy — Orchestrator

Dispatches 3 specialist agents (copywriter → format-checker → critic) to generate platform-native social copy with enforced limits, hook archetype compliance, and rubric scoring. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + dispatch graph + 5-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Does this copy stop the scroll, clear all platform limits, and earn the click — on THIS platform?

## Critical Gates — load first

1. **Single-platform per artifact.** Multi-platform = re-invoke with a different `platform` argument. Tier 1 hook archetypes are platform-specific; compromise copy across platforms is optimal for none.
2. **Single-market per artifact.** Multi-market campaigns re-run per market. Vietnamese-market copy auto-routes through `polish-vn` via `--polish-chain vn-tone`.
3. **Brand mode required.** Either `brand/BRAND.md` declares the mode OR operator answers Q3 in Cold Start. No silent default — defaulting silently triggers Anti-Pattern #5 (Brand-Voice Ignored) at critic time.
4. **Max 1 format-check revision loop.** Two consecutive REVISION_REQUIRED = FORMAT_FAIL escalated to user. Looping until copy fits typically masks brief-vs-platform mismatch.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode resolution** ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)). `budget: standard`. `--fast` collapses format-check revision loop to ZERO (single-pass; hard-cap violation → FORMAT_FAIL immediately); `--deep` bumps revision loop to MAX 2 cycles. Critic gate is single-pass at baseline. **`--fast` does NOT skip Cold Start, hallucinating audience or brand_mode (Anti-Pattern #5 floor).**
- Read `.forsvn/index/manifest.json` — find any prior `.forsvn/artifacts/mkt/copy/[platform]-*-[slug].md` for this topic + platform (variant exploration signal) and any `brief-shortform` or `plan-campaign` artifact this run might follow.
- Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) — auto-scan (`research/icp-research.md` + `brand/BRAND.md` + `experience/`), then Warm/Cold Start. 5-question Cold Start: platform / topic-or-brief / brand-mode / audience / goal.

## Quality Gate — 5 dimensions

Full rubric + per-platform calibration + Discrimination Test: [`references/agent-manifest.md`](references/agent-manifest.md) § 5-Dim Critic Rubric. Domain rubric: [`references/rubric.md`](references/rubric.md).

- [ ] Hook scroll-stop strength (Tier 1 / Tier 2 archetypes per platform-intel §1)
- [ ] Char/word limit compliance (hard caps + soft visible-window per platform-intel §2)
- [ ] CTA placement vs algorithm truncation (X / LinkedIn; TikTok/Reels/Shorts default 10)
- [ ] Pattern-interruption density (per-platform; LinkedIn over-density penalty)
- [ ] Format compliance (correct surface for goal — post vs thread vs carousel vs vertical-video caption)

Pass total ≥35/50 AND no dim 0. **Discrimination test runs every cycle.**

## Artifact Contract

- **Path:** `.forsvn/artifacts/mkt/copy/[platform]-[YYYY-MM-DD]-[slug].md`.
- **Lifecycle:** `pipeline` — regenerated on re-run.
- **Frontmatter (13 fields, verbatim):** `type` · `platform` · `date` · `slug` · `brand_mode` · `goal` · `variant_count` · `brief_source` · `platform_intel_version` · `critic_score` · `critic_verdict` · `status` · `polish_chain_applied`.
- **Required body sections (in order — cross-stack contract):** Hook variants (one `### Variant [A|B|C]` block per variant) · Body · CTA · Format spec · Critic verdict (6-row table) · Anti-patterns triggered (explicit `- None` if empty).
- **Side effects (mandatory on PASS / DONE_WITH_CONCERNS / FAIL — NOT on FORMAT_FAIL or NEEDS_CONTEXT):** write artifact path · experience write-back per `procedures/pre-dispatch.md` Write-back map (Q1 routing-only; Q2 → `experience/content.md`; Q3 → `experience/brand.md` IF novel; Q4 → `experience/audience.md` IF icp-research absent AND audience supplied; Q5 → `experience/goals.md`. Q1 is NOT persisted. Q4 skip-if-exists) · run `bun scripts/manifest-sync.ts`.
- **Consumed by:** `humanmaxxing` + `polish-vn` (polish chain — read `## Body` + `## CTA`, rewrite in place, preserve Hook variants for A/B comparability, update `polish_chain_applied`) · `run-eval-loop` (frontmatter `critic_score` + `critic_verdict` + `goal` + `platform` → `results.tsv`) · operator publish workflow.
- **Cross-stack contract:** 13-field frontmatter + 6-section body + 5-dim critic verdict table + Anti-patterns triggered listing convention are load-bearing — schema changes require atomic update of polish-chain + eval-loop + operator-workflow consumers.

Full schema + per-field semantics: [`references/format-conventions.md`](references/format-conventions.md).

## Routing + Dispatch

Single sequential graph (copywriter → format-checker → critic). No route branching. Dispatch graph + single-agent fallback + format-check bounce + FORMAT_FAIL escalation + polish-chain handoff + mode-resolver interaction: [`references/agent-manifest.md`](references/agent-manifest.md) + [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

**Format-check bounce (load-bearing summary):** PASS → critic. REVISION_REQUIRED → bounce to copywriter ONCE with named violations under `## Format-Checker Feedback — Address Every Violation` header. Second REVISION_REQUIRED → FORMAT_FAIL escalated to user; artifact ships `status: blocked`; critic NOT dispatched.

## Chain Position

**Previous:** `brief-shortform` (locks platform/hook/audience/goal) OR `plan-campaign` (social cadence) OR none (greenfield Cold Start). **Next:** `humanmaxxing` / `polish-vn` (polish chain, optional) OR direct operator publish.

**Horizontal role:** invoked at any stage of the marketing pipeline. NOT foundational — it's a leaf-node producer.

**Re-run triggers:** new platform target, brand voice shift, hook A/B variant exploration, post-publish underperformance.

**Skill deference:** Paid Meta / Google / LinkedIn ad → `write-ad`. Full video brief + storyboard → `brief-shortform`. Landing-page copy → `write-copy`. Long-form (LinkedIn articles, Substack, blog) → `write-copy` or `optimize-seo`. Vietnamese polish → `polish-vn`. AI-pattern stripping → `humanmaxxing`.

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before output ships — 14-pattern catalog (10 from original + 4 cross-cutting: polish-chain routed on FAIL/FORMAT_FAIL, multi-platform in one invocation, VN-market without vn-tone, cross-stack contract drift). Per-pattern detection rule + platform calibration + agent ownership inline.

## Completion Status

- **DONE** — copy generated, all format limits passed, critic score ≥35, variant_count hooks delivered.
- **DONE_WITH_CONCERNS** — copy delivered; critic score 25-34 OR individual dimension below 4 OR critic verdict `fail` (FAIL artifacts ship with annotations per locked decision); concerns annotated.
- **BLOCKED** — FORMAT_FAIL (two consecutive REVISION_REQUIRED); platform not in supported set; brief contradicts brand_mode with no resolution.
- **NEEDS_CONTEXT** — no brief, no topic, no brand voice, no `experience/` entries, no `brand/BRAND.md`; recommend `brief-shortform` or `create-brand` first.

## Worked Example

End-to-end LinkedIn founder-voice walkthrough (Cold Start → 3-agent dispatch → critic 44/50 PASS → artifact assembly → polish-chain decision): [`references/examples/social-walkthrough.md`](references/examples/social-walkthrough.md). 10 per-platform strong/weak examples: [`references/examples.md`](references/examples.md).
