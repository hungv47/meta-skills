---
name: research-shortform
description: "Discovers what's working right now on short-form video platforms (TikTok, Instagram Reels, YouTube Shorts; X video and LinkedIn video by opt-in) for a given topic and market. Produces a per-platform best-practice catalog at .forsvn/artifacts/research/short-form-research/[slug].md that short-form-brief consumes. Not for long-form video (parked) or static visual (use brief-graphic). For audience research, see research-icp; for campaign planning, see plan-campaign."
argument-hint: "[topic or angle]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch Write
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
  budget: deep
  estimated-cost: "$3-6 (default 3 platforms) / $5-10 (--all)"
  refactor_history:
    - refactored_at: 2026-05-17
      refactored_for: implementation-roadmap v6 Phase 2 Wave 2 (body-diet + playbook ref + chain hardening, mixed-classification skill)
      body_before: 274
      body_after: 145
      body_delta_pct: -47.1
      note: |
        Body-only line counts (frontmatter excluded). Total file 332 → 220.
        Cross-stack contract preserved BYTE-IDENTICAL (consumed by
        marketing/short-form-brief + research/short-form-eval):
          - 5 Critical Gates
          - 5 Quality Gate rubrics
          - Output Artifact Structure (frontmatter spec + 8 body sections)
          - Completion Status verdicts
        Agent Manifest (compacted Focus column wording but preserved all 6 agents
        + layer assignments + file paths). Per-platform reference catalogs
        (platforms/*.md) + scoring-rubrics.md + scout-protocol.md untouched.
        Bulk movement to refs:
          - Philosophy → playbook
          - Cold/Warm prompts → procedures/pre-dispatch
          - Layer 1/2 spawn tables + Dispatch Protocol mechanics + Critic Routing
            + Chain Position + Skill Deference → procedures/dispatch-mechanics
          - Format Conventions → ref
          - Failure modes → anti-patterns
promptSignals:
  phrases:
    - "what's working on tiktok"
    - "short-form trends"
    - "reels research"
    - "shorts research"
    - "tiktok patterns"
    - "viral hook research"
  allOf:
    - [short-form, research]
    - [tiktok, hook]
    - [reels, pattern]
  anyOf:
    - "trending sound"
    - "hook archetype"
    - "platform research"
    - "what's hitting"
  noneOf:
    - "long-form"
    - "youtube long"
    - "podcast"
    - "blog post"
  minScore: 6
routing:
  intent-tags:
    - short-form-research
    - platform-pattern-mining
    - hook-research
    - content-research
  position: pipeline
  lifecycle: pipeline
  produces:
    - .forsvn/artifacts/research/short-form-research/[slug].md
  consumes:
    - product-context.md
    - icp-research.md
  requires: []
  defers-to:
    - skill: research-icp
      when: "no audience context exists yet — research without ICP underperforms"
    - skill: research-market
      when: "user wants competitive landscape, not platform pattern mining"
  parallel-with:
    - market-research
  interactive: false
  estimated-complexity: heavy
---

# Short-Form Research — Orchestrator

*Pipeline skill — produces the per-platform best-practice catalog that `brief-shortform` consumes per asset.*

**Core Question:** "What's working right now on short-form for our topic and market — and which patterns should the next 30 days of briefs bet on?"

[Read `references/playbook.md` [PLAYBOOK] for why this skill exists, methodology, principles, and when NOT to use.]

---

## Critical Gates — Read First

Non-negotiable constraints before dispatching any agent:

1. **No fabricated data.** Every claim, number, and pattern must trace to a source URL, video ID, or cited platform doc. Orphan claims fail critic rubric #1.
2. **Single market per artifact.** Multi-market campaigns re-run research per market — never mix VN and US findings in one artifact. Cultural patterns are not averageable.
3. **Hard cap on platforms.** Default 3 (TikTok + Reels + Shorts). X video and LinkedIn video are explicit opt-in via `--all` or `--platforms`. Maximum ever is 5. Cost discipline.
4. **Sample-size honesty.** Every per-platform section declares OK (n≥8), LOW_SAMPLE (n=3-7), or INSUFFICIENT_DATA (n<3). LOW_SAMPLE flags carry through to brief skill warnings. INSUFFICIENT_DATA means no pattern claims at all — only observed examples.
5. **Two freshness windows.** Trend signals refresh every 14d, warn at 30d. Platform mechanics refresh every 90d, warn at 180d. Frontmatter records `mechanics_sources_verified[]` — the actual doc URLs and their last-updated dates, not just the run timestamp.

## Quality Gate

Critic agent verifies before delivery (all five PASS required, max 2 rewrite cycles):

- [ ] Every numerical claim and named pattern has a source URL or video ID
- [ ] Every per-platform section declares OK / LOW_SAMPLE / INSUFFICIENT_DATA per the N≥8 / 3-7 / <3 rule
- [ ] Every recommendation is platform-specific (could not be moved to another platform's section unchanged)
- [ ] Every cited mechanic links to a source doc with a verified `last_updated` date inside the 180d warn window
- [ ] Audience Fit section either references ICP or explicitly declares "no ICP — using cold-start hint" with the hint text included

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: deep`; `--fast` collapses to single-pass scout + synthesis with critic skipped, but Critical Gates above STILL enforced (safety supersedes `--fast`). Cold Start (Pre-Dispatch) still fires under `--fast` if topic/market are missing.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory.
2. Read `.agents/manifest.json` — check for prior short-form-research artifacts under (topic, market) for warm-start eligibility.
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Cold/Warm prompts, write-back map all there.

## Artifact Contract

- **Path:** `.forsvn/artifacts/research/short-form-research/[slug].md` (one artifact per topic+market+platform-set)
- **Lifecycle:** `pipeline` (per `research-skills/CLAUDE.md`; canonical-paths.md notes this is borderline-canonical — consumed cross-stack — but pipeline classification preserved verbatim for backwards-compat; refresh trigger handled by freshness windows, not manifest archival)
- **Frontmatter fields:** `type`, `status`, `date`, `topic`, `market`, `platforms_analyzed`, `platform_mechanics_date`, `mechanics_sources_verified[]`, `trend_signals_date`, `sample_size_per_platform`, `icp_referenced` (full schema in Output Artifact Structure below)
- **Required sections (in order):** TL;DR · Audience Fit · Per-Platform Findings · Cross-Platform Comparison · Trending Audio (conditional) · Recommendations for short-form-brief · Open Risks & Caveats · What This Research Doesn't Cover
- **Consumed by:** `brief-shortform` (marketing-skills) per-asset, reads §6 Recommendations + frontmatter sample-size flags; `evaluate-shortform` (research-skills) cycle-N scorer, reads frontmatter + §3 Per-Platform Findings to score published posts against the catalog
- **Cross-stack contract:** schema changes require atomic update of BOTH consumers — never silently drift the frontmatter or section order (per `anti-patterns.md` row "Cross-stack contract drift")

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Platform Scout | 1 (parallel — N×) | `agents/platform-scout-agent.md` | Per-platform top performers via WebSearch + WebFetch; URLs + metrics + opening 1-3s + audio + caption + CTA |
| Audience Fit Agent | 1 (parallel) | `agents/audience-fit-agent.md` | ICP / product-context / cold-start hint → register, language polish, sensitivity flags |
| Pattern Extractor | 2 (sequential) | `agents/pattern-extractor-agent.md` | Recurring hook archetypes per platform + sample-size flags |
| Audio Trend Agent | 2 (sequential, conditional) | `agents/audio-trend-agent.md` | Only if TikTok/Reels in scope; trending sounds + usage counts + decay risk |
| Synthesis Agent | 2 (sequential) | `agents/synthesis-agent.md` | Writes artifact: TL;DR, per-platform, comparison, recommendations, risks |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Five-rubric quality gate; routes rewrites; max 2 cycles |

## Routing + Dispatch

Single route — full Layer 1 + Layer 2 sequence runs every time (per-platform analysis IS the value):

```
1. Pre-Dispatch (warm-start scan + cold-start if needed) — per procedures/pre-dispatch.md
2. LAYER 1 IN PARALLEL: platform-scout × N + audience-fit-agent
3. LAYER 2 SEQUENTIAL: pattern-extractor → audio-trend (conditional) → synthesis → critic
4. Critic FAIL → re-dispatch named agent(s) (max 2 cycles); after 2, ship done_with_concerns
5. Deliver artifact
```

Mechanics (how to spawn agents, parallel/sequential tables, critic routing rules, single-agent fallback, chain position, re-run triggers, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Output Artifact Structure

`.forsvn/artifacts/research/short-form-research/[slug].md` (frontmatter shown; full template in §5 of `.forsvn/artifacts/meta/specs/short-form-research-spec.md`):

```yaml
---
type: short-form-research
status: done | done_with_concerns | blocked | needs_context
date: [YYYY-MM-DD]
topic: [free text]
market: [region or 'global']
platforms_analyzed: [list]
platform_mechanics_date: [YYYY-MM-DD]
mechanics_sources_verified:
  - source: [name]
    url: [url]
    last_updated: [YYYY-MM-DD]
trend_signals_date: [YYYY-MM-DD]
sample_size_per_platform:
  tiktok: { n: [int], flag: OK | LOW_SAMPLE | INSUFFICIENT_DATA }
  reels: { ... }
  shorts: { ... }
icp_referenced: yes | no — using cold-start audience hint
---
```

**Body sections (in order):**
1. TL;DR — top 5 platform-tagged recommendations
2. Audience Fit
3. Per-Platform Findings (TikTok → Reels → Shorts → opt-in others)
4. Cross-Platform Comparison table
5. Trending Audio (TikTok + Reels only, conditional)
6. Recommendations for short-form-brief
7. Open Risks & Caveats
8. What This Research Doesn't Cover

Format conventions (date format, URL handling, citation pattern, sample-size flag placement, per-platform ordering, frontmatter field order, recommendation format) live in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — covers orphan claims, multi-market mixing, sample-size dishonesty, stale mechanics, generic recommendations, critic-loop overrun, cross-stack contract drift, and 8 more failure modes.

## Completion Status

Skill returns one of:

- **DONE** — all 5 critic rubrics PASS within ≤2 cycles. All requested platforms returned ≥3 entries.
- **DONE_WITH_CONCERNS** — critic loop cap reached; remaining failures are surfaceable as warnings (LOW_SAMPLE on 1+ platforms, one stale source doc beyond warn window). Concerns pinned at top of artifact.
- **BLOCKED** — WebSearch / WebFetch blocked or rate-limited; ICP read failed. Requires user action — state what's needed.
- **NEEDS_CONTEXT** — cold-start abandoned; or `audience_hint` empty AND no ICP. Defer to `research-icp`.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill exists, methodology, principles, history, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern (canonical at `references/`, synced)
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior contract
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE] — canonical Pre-Dispatch spec
- [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — this skill's Cold + Warm Start prompts + write-back map
- [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE] — Layer 1/2 spawn mechanics, critic routing, single-agent fallback, chain position, skill deference
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE] — date format, URL handling, citation, sample-size flag, per-platform ordering
- [`references/scoring-rubrics.md`](references/scoring-rubrics.md) — pattern-extractor + critic rubric definitions
- [`references/scout-protocol.md`](references/scout-protocol.md) — per-platform sourcing protocol
- [`references/platforms/`](references/platforms/) — per-platform research playbooks (tiktok, instagram-reels, youtube-shorts, twitter-video, linkedin-video, _comparison)
- `research-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
