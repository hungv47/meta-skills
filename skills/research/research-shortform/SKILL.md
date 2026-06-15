---
name: research-shortform
description: "Discovers what's working right now on short-form video platforms (TikTok, Instagram Reels, YouTube Shorts; X and LinkedIn video by opt-in) for a given topic and market — mines hook archetypes, trending audio, and platform mechanics into a sourced per-platform catalog. Use before briefing short-form content, to find current viral patterns, or to refresh stale platform intelligence. Not for long-form video (parked) or static visuals (use brief-graphic); for audience research, see research-icp."
argument-hint: "[topic or angle]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch Write
metadata:
  version: "1.0.1"
  budget: deep
  estimated-cost: "$3-6 (default 3 platforms) / $5-10 (--all)"
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
   Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory.
2. Read `.forsvn/index/manifest.json` — check for prior short-form-research artifacts under (topic, market) for warm-start eligibility.
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, read order, Cold/Warm prompts, write-back map all there.

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/research-research-shortform-<YYYY-MM-DD>-<slug>.md` (flat v2 grammar; one artifact per topic+market+platform-set)
- **Lifecycle:** `pipeline` (per `research-skills/CLAUDE.md`; canonical-paths.md notes this is borderline-canonical — consumed cross-stack — but pipeline classification preserved verbatim for backwards-compat; refresh trigger handled by freshness windows, not manifest archival)
- **Frontmatter fields:** `skill`, `type`, `status`, `date`, `stack` (=research), `review_surface` (=md — pipeline defaults to `decision_state: not_required`), `topic`, `market`, `platforms_analyzed`, `platform_mechanics_date`, `mechanics_sources_verified[]`, `trend_signals_date`, `sample_size_per_platform`, `icp_referenced` (full schema in Output Artifact Structure below; cross-stack v2 contract in [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md))
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

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — covers orphan claims, multi-market mixing, sample-size dishonesty, stale mechanics, generic recommendations, critic-loop overrun, cross-stack contract drift, and 8 more failure modes.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


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
- [`references/_shared/confidence-labeling.md`](references/_shared/confidence-labeling.md) [PROCEDURE] — canonical H/M/L confidence label + L-resolution rule; the claim-level certainty tag layered on the sample-size flags
- [`references/scout-protocol.md`](references/scout-protocol.md) — per-platform sourcing protocol
- [`references/platforms/`](references/platforms/) — per-platform research playbooks (tiktok, instagram-reels, youtube-shorts, twitter-video, linkedin-video, _comparison)
- `research-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
