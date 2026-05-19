---
title: Short-Form Research — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: short-form-research
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** critic agent fires (5-rubric gate) OR re-dispatch heuristic kicks in (critic FAIL routes to named source agent). Re-read before any output ships as `done` or `done_with_concerns`.

---

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Orphan numerical claims | "70% of top-performing TikToks open with a question" — without a source URL or video ID, this is fabricated even if accurate. Pollutes brief skill with unauditable "research." | Inline-cite every numerical claim: `"70% completion threshold ([TikTok Creator Portal — Algorithm Updates, last_updated 2026-04-12](url))"`. Orphan claims fail critic rubric #1 → re-dispatch source agent. |
| Mixing VN and US findings in one artifact | Cultural patterns are not averageable. VN TikTok and US TikTok diverge on hook archetype, sound preference, CTA tolerance. "Average" creates a brief that fits neither. | Single market per artifact. Multi-market campaigns re-run the skill per market. Hard rule, no exceptions. |
| Sample-size dishonesty | Reporting n=4 as "the pattern" without LOW_SAMPLE flag. Downstream brief reads it as a strong bet, lays content on weak evidence. | Declare per-platform: OK (n≥8) / LOW_SAMPLE (n=3-7) / INSUFFICIENT_DATA (n<3). INSUFFICIENT_DATA = no pattern claims, only observed examples. Flag propagates downstream. |
| Stale mechanics passing as fresh | "TikTok rewards 7-second hold" — accurate in 2023, outdated by Q2 2024 algorithm shift. Frontmatter shows recent `date:` but `platform_mechanics_date:` is 180+ days. | Two timestamps, two windows. `trend_signals_date` (14d/30d warn) AND `platform_mechanics_date` (90d/180d warn). `mechanics_sources_verified[]` lists actual doc URLs + their `last_updated` dates. Critic rubric #4 checks both. |
| Generic recommendations that aren't platform-specific | "Strong hook in first 3 seconds" — true everywhere, useful nowhere. If the recommendation could be moved to another platform's section unchanged, it's not a recommendation, it's a platitude. | Critic rubric #3: every recommendation must be platform-specific (would NOT survive copy-paste to another platform). Re-dispatch pattern-extractor + synthesis. |
| Running audio-trend-agent for non-applicable platforms | YouTube Shorts uses original audio more than trending sounds; X/LinkedIn rarely use audio trends at all. Running the agent produces an empty section and wastes tokens. | Conditional dispatch: `audio-trend-agent` runs only if `tiktok` or `reels` is in scope. Synthesis omits the Trending Audio section otherwise. |
| Skipping ICP without flagging | Running with cold-start hint but artifact doesn't say so. Downstream brief assumes audience is well-grounded, lays campaign on shaky ground. | Audience Fit section either references ICP or explicitly declares "no ICP — using cold-start hint" with the hint text included. Critic rubric #5. |
| Looping the critic past 2 cycles | Trying for PASS forever when the underlying data is genuinely thin (LOW_SAMPLE everywhere, no doc URLs available). Burns tokens for a result that won't improve. | Hard cap at 2 cycles. After cycle 2, ship `done_with_concerns` with failed rubrics pinned at top of artifact. The transparency IS the value. |
| Adding net-new platforms beyond the 5-cap | Adding YouTube Long, Snapchat Spotlight, etc. mid-run because operator asked. Each platform doubles research time + cost. | Hard cap is 5. If operator wants a 6th, refuse and surface the cap. Research depth per platform > breadth across platforms. |
| Re-pulling for the same topic+market inside the freshness window | Wasting cost on a re-run when warm-start would have caught it. | Warm-start scan in Pre-Dispatch is mandatory. If an artifact exists for (topic, market) and `trend_signals_date` is <14d AND `platform_mechanics_date` is <90d, default to mode (a) "use existing." |
| Cross-stack contract drift | Adding new frontmatter fields or body sections without updating `brief-shortform` (consumer) + `evaluate-shortform` (cycle scorer). Silent schema drift breaks downstream parsers. | Output Artifact Structure is the cross-stack contract. Schema changes require atomic update of both consumers — never ship a one-sided schema change. Flag to operator before changing. |
| Treating critic rubric as scoring noise | Critic FAIL → ignore and ship anyway. Defeats the entire 5-rubric gate. | Critic FAIL → re-dispatch named source agent with feedback. If FAIL persists past cycle 2, ship `done_with_concerns` with failed rubrics pinned. The gate is load-bearing — never silently bypassed. |
| Recommendations that aren't bets | "Hook should be attention-grabbing" — true, useless. The catalog's job is to give the brief skill concrete patterns to bet on. | Every recommendation should be falsifiable + specific: archetype name, timing (0-1.5s vs 0-3s), sample size, source examples. If you can't bet against it, it's not a recommendation. |
| Skipping competitor seeds when offered | Operator provided 5 competitor handles in Cold Start Q5, scout ignores them and pulls top performers from default search. Wastes a high-value signal. | Scout protocol: seed list is the priority cohort. Default search supplements only after seed cohort is exhausted. See `scout-protocol.md`. |
| Confusing trend signals with platform mechanics | Putting "trending sound: X" into a 90-day-window context, or treating "70% completion threshold" as a 14-day decay item. Wrong window = wrong refresh cadence. | Trend signals = creator behaviors (hooks, sounds, formats). Platform mechanics = algorithm rules (thresholds, ranking factors, eligibility). Separate timestamps, separate windows, separate refresh triggers. |
