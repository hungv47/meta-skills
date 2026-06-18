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

3 agents (copywriter → format-checker → critic) generate platform-native social copy with enforced limits and rubric scoring. Capability: [`routing.yaml`](routing.yaml). Agents + dispatch + rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Does this copy stop the scroll, clear all platform limits, and earn the click — on THIS platform?

## Critical Gates — load first

Full detail: [`references/procedures/critical-gates.md`](references/procedures/critical-gates.md).

1. **Single-platform per artifact** — multi-platform = re-invoke per platform.
2. **Single-market per artifact** — VN auto-routes through `polish-vn`.
3. **Brand mode required** (`founder` / `company`) — no silent default (Anti-Pattern #5 floor).
4. **Max 1 format-check revision** at baseline — two `REVISION_REQUIRED` = `FORMAT_FAIL`.

## Before Starting

Apply `references/_shared/before-starting-check.md`. Then:

| Artifact | Source | Required? |
|---|---|---|
| `brand/BRAND.md` | create-brand | **Hard** — `brand_mode` |
| `research/icp-research.md` | research-icp | Rec — audience |
| `research/product-context.md` | research-icp | Rec — voice + proof |
| `docs/forsvn/artifacts/marketing/brief-shortform/[slug]/brief.md` | brief-shortform | Opt — Warm Start |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | Opt — cadence |

Mode per `references/_shared/mode-resolver.md`. `budget: standard`. `--fast` → format-check loop = 0; `--deep` → MAX 2. **`--fast` does NOT skip Cold Start or Critical Gates.** Check `.forsvn/index/manifest.json` for prior `marketing/copy/[platform]-*-[slug].md` or upstream `brief-shortform` / `plan-campaign`. Run Pre-Dispatch per `references/procedures/pre-dispatch.md`: auto-scan, then 5-Q Cold Start.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Quality Gate — 5 dimensions

Full rubric + per-platform calibration + Discrimination Test: [`references/agent-manifest.md`](references/agent-manifest.md) § 5-Dim Critic Rubric. Domain rubric: [`references/rubric.md`](references/rubric.md).

- [ ] Hook scroll-stop (Tier 1/2 archetypes per platform-intel §1)
- [ ] Char/word limits (hard caps + visible-window per platform-intel §2)
- [ ] CTA placement vs algorithm truncation (X/LinkedIn; TikTok/Reels/Shorts default 10)
- [ ] Pattern-interruption density (LinkedIn over-density penalty)
- [ ] Format compliance (post / thread / carousel / vertical-video caption)

Pass total ≥35/50 AND no dim 0. **Discrimination test every cycle.**

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/copy/[platform]-[YYYY-MM-DD]-[slug].md`. **Lifecycle:** `pipeline`.
- **Frontmatter (15):** verbatim schema (adds legibility `pack_verified` + `applied_tactics` to the prior 13) → [`references/format-conventions.md`](references/format-conventions.md).
- **Body (in order):** Hook variants (`### Variant [A|B|C]`) · Body · CTA · Format spec · **Legibility block** ([convention](references/_shared/legibility-convention.md)) · **Why this works** · Critic verdict (6-row table) · Anti-patterns triggered (`- None` if empty).

Side effects + consumed-by + cross-stack contract: [`references/procedures/artifact-contract.md`](references/procedures/artifact-contract.md).

## Routing + Dispatch

Single sequential graph (copywriter → format-checker → critic), no branching. Graph + fallback + polish handoff + mode interaction: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

**Format-check bounce:** PASS → critic. REVISION_REQUIRED → copywriter ONCE under `## Format-Checker Feedback — Address Every Violation`. Second → FORMAT_FAIL; ships `status: blocked`; critic NOT dispatched.

## Chain Position

**Prev:** `brief-shortform` (locks platform/hook/audience/goal) OR `plan-campaign` (cadence) OR greenfield. **Next:** see `## Execution`. **Re-run:** new platform, brand-voice shift, hook A/B, underperformance.

**Deference:** paid ad → `write-ad`; full video brief → `brief-shortform`; landing-page → `write-copy`; long-form (articles, Substack, blog) → `write-copy` or `optimize-seo`; VN polish → `polish-vn`; AI-pattern stripping → `humanmaxxing`.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 14 patterns (10 original + 4 cross-cutting: polish-chain on FAIL/FORMAT_FAIL, multi-platform, VN-market without vn-tone, cross-stack drift). Re-read before ship.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — copy generated, all format limits passed, critic ≥35, variant_count delivered.
- **DONE_WITH_CONCERNS** — delivered; critic 25-34 OR any dim <4 OR verdict `fail` (FAIL ships with annotations).
- **BLOCKED** — FORMAT_FAIL (two REVISION_REQUIRED); platform unsupported; brief contradicts brand_mode unresolved.
- **NEEDS_CONTEXT** — no brief, topic, brand voice, `experience/`, or `brand/BRAND.md`; recommend `brief-shortform` or `create-brand`.

## Execution

Offer the registry-gated fork (category `publish`) — **Brief-only**: polish (`humanmaxxing` / `polish-vn`) if flagged; **Assisted/Direct** need a verified engine. See [execution-fork.md](references/_shared/execution-fork.md); record `execution_mode`.

## Worked Example

LinkedIn founder-voice walkthrough (Cold Start → dispatch → critic 44/50 PASS → polish decision): [`references/examples/social-walkthrough.md`](references/examples/social-walkthrough.md). 10 per-platform strong/weak: [`references/examples.md`](references/examples.md).
