---
name: brief-shortform
description: "Produces production-ready briefs for short-form video — hook, shot list, on-screen text, audio plan, caption, CTA, aspect, length — covering live-action and motion-graphic modes, with cross-platform tailoring (1 hero + max 2 variants per run). Reads the matching short-form-research catalog. Use to turn a video angle into a shootable brief. Not for static visual assets (use brief-graphic), organic social copy (use write-social), or paid ad creative. Brand voice: see create-brand. Audience: see research-icp."
argument-hint: "[angle or topic] [--platforms tiktok,reels,...] [--brand-mode founder|company]"
allowed-tools: Read Edit Write Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$2-4 (single platform) / $4-8 (1 hero + 2 variants)"
---

# Short-Form Brief — Orchestrator

*Production-grade brief for one short-form asset. Reads the per-platform research catalog and turns an angle into a hero brief plus optional per-platform variants — each producible without follow-up questions.*

**Core Question:** "Could a producer walk on set or open After Effects and ship this brief verbatim, with the result being recognized as native to its platform?"

> Why this skill exists, philosophy, methodology, principles, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

---

## Critical Gates — Read First

Non-negotiable constraints before dispatching any agent:

1. **Soft-required: `research-shortform` artifact.** Missing → warn but proceed (briefs lack current trend signals; flag in artifact frontmatter). Stale beyond 30d trends or 180d mechanics → recommend re-run; user can override.
2. **Hard cap: 1 hero + max 2 variants per invocation.** More platforms → re-invoke. Cost discipline.
3. **Hard cap: brand_mode is `founder` OR `company` — no `hybrid`.** User picks per-brief.
4. **No fabricated VoC.** Every quote in the brief traces to `research/icp-research.md`. Cold-start audience hint accepted but flagged in artifact.
5. **Generic content fails.** Critic gate enforces specificity at four axes (hook, production, algorithm-fit, brand-fit). Two cycles max, then ship `done_with_concerns` with concerns pinned.
6. **Variants are TRUE RECUTS, not caption-resizes.** `platform-tailor-agent` rebuilds hook + audio + caption + CTA per platform; orchestrator rejects caption-only resizing.

---

## Quality Gate

Critic agent verifies before delivery (all four PASS required, max 2 rewrite cycles):

- [ ] Hook clears platform's hook window from research; visual + verbal + text triad simultaneous; 3Q test passes; archetype tagged
- [ ] Every shot/scene has timing (seconds), framing, action, on-screen text, audio sync; audio names a track or VO direction; production notes filled
- [ ] Brief aligns with target platform's algorithmic preferences from research catalog (completion thresholds, hold rates, audio rules, captions, watermarks)
- [ ] Caption + verbal lines use VoC phrases from ICP; voice matches BRAND.md archetype; no generic founder/company tropes

Full 4-sub-critic rubric (Hook / Production / Algorithm-fit / Brand-fit) + binary verdicts + format-fit test + 13-row Rewrite Routing Table live in `agents/critic-agent.md`.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — load research artifact + ICP + BRAND.md context, check freshness windows (trends >30d → recommend `research-shortform` re-run; mechanics >180d → strong recommend).

| Artifact | Source | Required? |
|---|---|---|
| `.forsvn/artifacts/research/short-form-research/[slug].md` | research-shortform | Soft-required (Critical Gate 1) — proceeds without it but flags `trend_signals_stale` |
| `research/icp-research.md` | research-icp | Soft-required (Critical Gate 4) — proceeds with cold-start hint but flags `voc_source: cold-start-hint` |
| `brand/BRAND.md` | create-brand | Recommended — brand_mode inference + voice archetype |
| `.forsvn/artifacts/mkt/campaign-plan.md` | plan-campaign | Optional — inherits theme/dates/CTAs if `[slug]` matches |

---

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** angle, platforms (1-3), brand_mode (founder | company), production_mode (auto | live-action | motion-graphic | mixed), market, optional campaign tie-in.

Full read-order + Warm Start + Cold Start (5-question bundled) + write-back map + hard-block conditions + VN auto-routing for polish chain: `references/procedures/pre-dispatch.md` [PROCEDURE].

---

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — auto-downgrade for ≤3 sentences AND no prior artifacts (rare for this skill given the input shape); `--fast` flag skips Layer 2 (no critic, no platform-tailor) and runs Layer 1 + 1.5 single-pass via single-agent fallback. **`--fast` does NOT skip Cold Start or Critical Gates 1-6.**

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Format Agent | 1 (parallel) | `agents/format-agent.md` | Locks aspect / length / safe zones / file specs per platform from research catalog |
| VoC Extraction Agent | 1 (parallel) | `agents/voc-extraction-agent.md` | Pulls 3-5 buyer phrases + register + sensitivity flags from ICP |
| Production Mode Agent | 1 (parallel) | `agents/production-mode-agent.md` | Resolves live-action vs. motion-graphic; outputs production-notes template |
| Hook Agent | 1.5 (parallel) | `agents/hook-agent.md` | Visual + verbal + text triad in 0–3s; 3 variations; 3Q test; archetype menu from research catalog |
| Storyboard Agent | 1.5 (parallel) | `agents/storyboard-agent.md` | Shot list (live-action) or scene list (motion-graphic) with timing, framing, action — includes on-screen text choreography |
| Audio Agent | 1.5 (parallel) | `agents/audio-agent.md` | Track choice (named, from research's audio-trend) OR VO direction with sync points |
| Copy Pack Agent | 1.5 (parallel) | `agents/copy-pack-agent.md` | Caption + hashtags + CTA per platform native conventions |
| Platform Tailor Agent | 2 (sequential, conditional) | `agents/platform-tailor-agent.md` | TRUE RECUT for variants — rebuilds hook + audio + caption + CTA per platform |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Four sub-critics (hook / production / algorithm-fit / brand-fit); routes failures back; max 2 cycles |

---

## Routing + Dispatch

Single route — the skill always runs Layer 1 + Layer 1.5 + Layer 2. Multi-platform invocations add `platform-tailor-agent` in Layer 2.

```
1. Pre-Dispatch (warm-start scan + cold-start if needed) — per procedures/pre-dispatch.md
2. LAYER 1 IN PARALLEL: format-agent, voc-extraction-agent, production-mode-agent
3. LAYER 1.5 IN PARALLEL (after Layer 1): hook-agent, storyboard-agent, audio-agent, copy-pack-agent
4. LAYER 2 SEQUENTIAL:
   - platform-tailor-agent (only if multi-platform — produces variants)
   - critic-agent (4-sub-critic gate; FAIL → re-dispatch named source agent)
5. Critic FAIL → re-dispatch (max 2 cycles); after cycle 2, ship done_with_concerns
6. Apply polish chain (vn-tone | humanmaxxing | none) per market + brand_mode on spoken-line section
7. Deliver hero + variants
```

Mechanics (how to spawn agents, parallel/sequential tables, single-agent fallback, critic routing, polish chain table, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Artifact Contract

- **Hero path:** `.forsvn/artifacts/mkt/short-form-brief/[slug]/brief.md`
- **Variant path:** `.forsvn/artifacts/mkt/short-form-brief/[slug]/variants/[platform].md`
- **Lifecycle:** `pipeline` — one artifact per (angle, platform-set, market); re-run on angle/platform/market pivot
- **Frontmatter fields:** `type`, `role`, `status`, `review_state`, `review_tool`, `reviewed_at`, `reviewer`, `date`, `slug`, `angle`, `brand_mode`, `production_mode`, `market`, `hero_platform`, `variants[]`, `research_artifact`, `research_trend_signals_date`, `research_mechanics_date`, `campaign_tie_in`, `critic_passes[]`, `critic_loop_count`, `polish_chain_applied` (full schema in Output Artifact Structure below)
- **Hero body sections (15, in order):** TL;DR for the Producer · What This Brief Bets On · Audience & Voice · Format Specification · Hook · Storyboard · On-Screen Text Choreography · Audio Plan · Caption · CTA · Production Notes · What NOT To Do · Success Criteria · Variant Roadmap · Review Gate
- **Variant body sections:** What Changed From Hero · Hook · Storyboard delta · Audio Plan · Caption · CTA
- **Consumed by:** human producers / video editors / motion designers (no further skill chain at v1)
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers (verbatim)" — never silently drift. The four review fields + `## Review Gate` heading are additive and orthogonal — consumers match sections by heading, so adding them does not affect downstream readers.
- **Review:** This `pipeline` artifact carries the review machinery but `review_state` defaults to `not_required` — most runs are regenerable drafts. The `## Review Gate` block and review fields ship in the template so the operator or a loop can opt a run into review by setting `review_state: pending`. Field semantics: [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md); review procedure: [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md). Review machinery applies to the hero `brief.md` only — not the per-platform `variants/[platform].md` files.

Full template + per-section format rules (date format, timing format, framing tags, archetype tagging, VoC exact-quote rule, variant "What Changed" guard) live in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Output Artifact Structure (frontmatter spec)

`.forsvn/artifacts/mkt/short-form-brief/[slug]/brief.md` (hero) — full template lives in `.forsvn/artifacts/meta/short-form-brief-spec.md` §5.1. Frontmatter:

```yaml
---
type: short-form-brief
role: hero
status: done | done_with_concerns | blocked | needs_context
review_state: not_required # pending | approved | rejected | changes_requested | not_required
review_tool: roughdraft    # roughdraft | inline | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
date: [YYYY-MM-DD]
slug: [slug]
angle: [free text]
brand_mode: founder | company
production_mode: live-action | motion-graphic | mixed
market: [region]
hero_platform: tiktok | reels | shorts | x | linkedin
variants: [list]
research_artifact: .forsvn/artifacts/research/short-form-research/[slug].md
research_trend_signals_date: [YYYY-MM-DD]
research_mechanics_date: [YYYY-MM-DD]
campaign_tie_in: [slug or null]
critic_passes: [hook, production, algorithm-fit, brand-fit]
critic_loop_count: [1 | 2]
polish_chain_applied: vn-tone | humanmaxxing | none
---
```

The four `review_state` / `review_tool` / `reviewed_at` / `reviewer` fields are the human-review layer per [`references/_shared/reviewable-artifact-contract.md`](references/_shared/reviewable-artifact-contract.md). This is a `pipeline` artifact → `review_state` defaults to `not_required`; an operator or eval loop can opt a run into review by setting it `pending` and following [`references/_shared/roughdraft-review-protocol.md`](references/_shared/roughdraft-review-protocol.md). These fields and the `## Review Gate` body section apply to the **hero `brief.md`** only — not the per-platform `variants/[platform].md` files.

`variants/[platform].md` template starts with "What Changed From Hero" — guards against caption-only resizing (per `format-conventions.md`).

---

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships. Five sub-critic clusters (Hook / Production / Algorithm-fit / Brand-fit / Variant) + 5 soft anti-patterns + 6 cross-cutting marketing-stack rows (VN auto-routing, polish-chain on FAIL, hard-cap erosion, cross-stack contract drift, mixed production-mode transition principle).

Most common in practice: AI slop openers ("Hey guys"), vague action verbs ("show product"), caption-only variant resizing, missing VoC in caption first-line, generic founder/company tropes.

---

## Completion Status

- **DONE** — all 4 critics PASS within ≤2 cycles. Hero + all requested variants produced.
- **DONE_WITH_CONCERNS** — loop cap reached; remaining FAILs surfaceable as warnings. Concerns pinned at top of artifact.
- **BLOCKED** — research stale beyond windows AND user declined re-run; ICP read fails; WebSearch/WebFetch blocked when verifying audio.
- **NEEDS_CONTEXT** — required inputs missing (no research AND user declined to proceed; no BRAND.md AND brand_mode unresolvable). State which upstream skill provides what's missing.

---

## Worked Example

End-to-end walkthrough (Pre-Dispatch warm-start → Layer 1 parallel → Layer 1.5 parallel → Layer 2 platform-tailor + critic PASS → polish chain → deliver; plus FAIL-handling cycle 2 variant + `--fast` variant): [`references/examples/short-form-brief-walkthrough.md`](references/examples/short-form-brief-walkthrough.md) [EXAMPLE].

Two condensed reference briefs in different (market, brand_mode, platform) combinations: [`references/_examples/example-1-vn-founder-tiktok.md`](references/_examples/example-1-vn-founder-tiktok.md), [`references/_examples/example-2-us-company-reels-shorts.md`](references/_examples/example-2-us-company-reels-shorts.md).

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/short-form-brief-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by craft agents at dispatch, not orchestrator): `references/{hook-archetypes, storyboard-grammar, caption-cta-rules, production-modes, success-criteria-templates, polish-chain}.md`
- **Platform intelligence** (loaded by format-agent + platform-tailor-agent): `references/_shared/platform-intelligence/{tiktok, reels, shorts, linkedin, x, youtube}.md` — canonical at top-level `references/platform-intelligence/` (D13)
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol}.md`
- **Marketing foundations:** `references/_shared/marketing-foundations.md` — canonical 9-channel framework, funnel-stage vocabulary, 3Q content test, CTA formula, VoC principles
- **Agents:** 9 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 4-sub-critic gate + 13-row Rewrite Routing Table.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
