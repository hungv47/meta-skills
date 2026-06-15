---
title: Short-Form Research Playbook
lifecycle: canonical
status: stable
produced_by: short-form-research
load_class: PLAYBOOK
---

# Short-Form Research Playbook

**Worked example:** [`examples/shortform-research-walkthrough.md`](examples/shortform-research-walkthrough.md) — a full sourced per-platform catalog run end to end, with the brief-shortform handoff.

## Why this skill exists

Short-form video platforms (TikTok, Reels, Shorts, plus X video and LinkedIn video by opt-in) move algorithmically — what worked 60 days ago may not work today. Briefs written from stale intuition produce content that misses the platform's current rewarded behaviors (hook archetype, opening-second pacing, sound trends, CTA placement). This skill replaces "intuition + last-year's-best-practice doc" with a per-platform, per-market, per-topic catalog of what's actually working *right now* — sourced from observable performers with citations, not made up by the model.

The catalog isn't a survey. It's a **catalog of bets**. The downstream consumer (`brief-shortform`) reads this artifact to choose specific recommendations per asset ("TikTok hook should be credential-flash archetype in 0–1.5s — 8/12 in this sample"), not generic advice ("strong hooks matter"). Specificity is the contract.

Two windows decay at different rates:
- **Trend signals** decay fast — 14-day windows are deliberate. A trending sound from 30 days ago is already a tired echo.
- **Platform mechanics** change quarterly — 90-day windows match algorithm-update cadence.

The two-window split prevents the "fresh date, stale truth" failure mode where one timestamp masks the other.

## Methodology

**Catalog of bets, not a survey.** The artifact's job is to give the brief skill concrete patterns to bet on, with sample-size honesty about how strong each bet is. A pattern claimed at n=12 (OK) carries different weight than the same pattern at n=4 (LOW_SAMPLE) — both are reportable, neither is averageable, and downstream consumers see the flag.

**Citation is non-negotiable.** Every numerical claim, every named pattern, every cited mechanic has a source URL (video ID or platform doc) with a `last_updated` date inside the freshness window. Orphan claims fail critic rubric #1 and re-dispatch to the source agent.

**Single market per artifact.** Cultural patterns are not averageable. VN TikTok and US TikTok diverge on hook archetype, sound preference, and CTA tolerance. Multi-market campaigns re-run the skill per market — never mix findings in one artifact.

**Hard platform cap.** Default 3 (TikTok + Reels + Shorts). X video and LinkedIn video are explicit opt-in via `--all` or `--platforms`. Maximum ever is 5. The cap is cost discipline — research depth per platform matters more than platform breadth.

**Per-platform sections are non-fungible.** If a recommendation in the TikTok section would still be true if pasted into the Reels section, the recommendation is too generic and fails critic rubric #3. Platform specificity is the value.

## Principles

- **Sample-size honesty over sample-size pretense.** Declare OK (n≥8) / LOW_SAMPLE (n=3-7) / INSUFFICIENT_DATA (n<3) per platform. INSUFFICIENT_DATA means no pattern claims — only observed examples. Pretending n=4 is "enough" pollutes downstream briefs.
- **Two freshness windows, two timestamps.** `trend_signals_date` (14d/30d warn) AND `platform_mechanics_date` (90d/180d warn). Frontmatter records both. `mechanics_sources_verified[]` lists the actual doc URLs and their last-updated dates — not just the run timestamp.
- **ICP is soft-required.** Research without ICP underperforms — the audience-fit-agent flags `NEEDS_CONTEXT` and the brief skill downstream sees the flag. Operator can override (cold-start hint) but the warning persists.
- **Critic gate is 5 rubrics, 2-cycle cap.** PASS = ship `done`. FAIL → re-dispatch named agents with feedback. After 2 cycles, ship `done_with_concerns` with failed rubrics pinned at top of artifact. Don't loop forever.
- **Conditional dispatch for audio.** `audio-trend-agent` runs only if TikTok or Reels is in scope. YouTube Shorts uses original audio more often; X/LinkedIn rarely use audio trends. Running it for non-applicable platforms wastes tokens and produces empty sections.
- **The artifact IS the contract.** Output artifact frontmatter + body section order are consumed downstream by `brief-shortform` (per-asset) and `evaluate-shortform` (cycle-N scoring against the catalog). Contract changes require atomic updates to both consumers — never silently drift the schema.

## When NOT to use this skill

- **Long-form video** (15+ min YouTube, podcasts, full courses) — different platforms, different mechanics, different decay rates. Parked.
- **Static visual** (images, carousels, infographics) — use `brief-graphic`.
- **Per-asset brief** (specific hook, shot list, captions for one piece) — use `brief-shortform` (marketing-stack); it consumes this catalog as input.
- **Audience research** (who buys, why) — use `research-icp`. This skill assumes audience is known or will run with a cold-start hint.
- **Competitive landscape mapping** (TAM/SAM/SOM, competitor positioning) — use `research-market`. This skill mines patterns within platform feeds, not market dynamics.

## History / origin

- **v1.0.0 — initial release.** 6-agent orchestration (platform-scout × N parallel + audience-fit + pattern-extractor + audio-trend conditional + synthesis + critic). Two-window freshness model + sample-size flag system + 5-rubric critic gate established at launch.
- **v6 Phase 2 Wave 2 refactor (May 17, 2026, still v1.0.0):** body trimmed 274 → 145 lines (-47.1%; under ≤250 mixed-classification target). 5 new refs: playbook + anti-patterns + format-conventions + procedures/pre-dispatch + procedures/dispatch-mechanics (the largest extraction — Layer 1/2 tables, Critic Routing, Chain Position, Skill Deference). Before-Starting check + Artifact Contract block added per Step 7.5. **Cross-stack contract preserved byte-identical:** 5 Critical Gates, 5 Quality Gate rubrics, Output Artifact Structure (frontmatter + 8 body sections), Completion Status verdicts. Agent Manifest (Focus column wording compacted; all 6 agents + layers + paths + load-bearing semantics preserved). Per-platform reference catalogs (`platforms/*.md`) + scoring-rubrics.md + scout-protocol.md unchanged. No version bump — refactor lands on the research-skills 2.0 base as a commit, not a release. Fresh-eyes round 1 (generalist agent) PASS-WITH-FIXES: 1 CRITICAL (net-new `format-conventions.md` "Recommendation format" §6 schema contradicting synthesis-agent template — deleted entirely) + 2 MAJOR (numeric anti-pattern cross-refs without table numbers — replaced with name slugs; this history line itself incorrectly said "4 new refs" — corrected to 5) fixed inline.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — Cold + Warm Start prompts + write-back map
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`format-conventions.md`](format-conventions.md) — date format, URL handling, citation format, per-platform ordering
- [`scoring-rubrics.md`](scoring-rubrics.md) — pattern-extractor + critic rubric definitions
- [`scout-protocol.md`](scout-protocol.md) — per-platform sourcing protocol
- [`platforms/`](platforms/) — per-platform research playbooks (tiktok, instagram-reels, youtube-shorts, twitter-video, linkedin-video, _comparison)
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec the procedure inherits from
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (this skill is `budget: deep`; `--fast` collapses to single-pass scout+synthesis with critic skipped, but Critical Gates still enforced)
