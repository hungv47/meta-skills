---
title: Platform Evidence Research — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: research-platform
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** critic-agent fires (5-rubric gate) OR a re-dispatch heuristic kicks in (critic FAIL routes to a named source agent). Re-read before any output ships as `done` or `done_with_concerns`.

---

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Fabricated metric | A number with no `source_type` and no `measured_at` — "our X engagement is around 3%". Plausible or not, it is fabricated, and it pollutes every downstream skill with an unauditable "fact". | Every metric traces to a tagged evidence source with a measurement date. A number you cannot source is an Evidence Gap, never a value. Critic rubric #1. |
| Source-type laundering | Tagging a public-page view count, or a benchmark range, as `owned_analytics` because the stronger tag makes the artifact look more authoritative. | Source-type is fixed by where the datum actually came from. A public figure is `public_metrics`; a benchmark is benchmark-agent's context, never the account's evidence. Critic rubric #2. |
| Fake precision on a CONSTRAINED platform | Reporting a precise TikTok reach or a per-video Instagram retention curve when the platform exposes neither to the operator at that granularity. | Check `platforms/[platform].md` for the availability tier and what the platform actually exposes. CONSTRAINED platforms get honest, coarse evidence — or NO_EVIDENCE. |
| Coverage-flag inflation | Calling a platform MEASURED off a single screenshot, so the artifact looks complete. Downstream reads it as solid and builds on sand. | Apply the threshold mechanically: MEASURED needs owned-grade core metrics or ≥3 items across ≥2 source types. One source, however rich, is PARTIAL. Critic rubric #3. |
| Recommending into the dark | Writing a recommendation for a NO_EVIDENCE platform — "post more on Instagram" — when no Instagram evidence exists. | NO_EVIDENCE platforms carry zero recommendations. Only a "what to export" gap note. The gate is not negotiable. Critic rubric #3 + #4. |
| Generic recommendation | "Improve your hooks", "be more consistent" — true everywhere, tied to no metric, falsifiable nowhere. It is an opinion wearing a recommendation's clothes. | Every recommendation names a platform, a specific move, and the metric it should change, with the four-part attribution. If it could be pasted onto any account unchanged, it fails. Critic rubric #4. |
| Stale evidence masked as current | A metric measured 70 days ago presented in the table with no freshness flag, so a downstream skill treats it as this month's reality. | Every datum carries `measured_at`; every item past its window is flagged `warn`/`stale` in-table AND named in Open Risks. Two windows, two timestamps. Critic rubric #5. |
| `measured_at` stamped with today's date | Dating a March screenshot 2026-05-22 because that is when it was pasted. The freshness logic then thinks two-month-old data is fresh. | `measured_at` is when the *source* measured the metric — read it off the export's date range. If genuinely unknown, intake at confidence L with a `scope_note` saying so. |
| Benchmark smuggled in as the account's evidence | Putting a "typical engagement rate" range into a Per-Platform Evidence metrics table as if it were the account's number. | Benchmarks live in the `vs. benchmark` column and benchmark-agent's context only. They interpret an owned number; they never become one. |
| Confidence inflation | A confidence-H recommendation built on confidence-L evidence, or on a PARTIAL platform. The artifact projects certainty the evidence cannot support. | Confidence is bounded: by the coverage flag (PARTIAL → max M), by the weakest cited datum, and by freshness (stale drops one level). Critic rubric #4. |
| Interpreting at intake | evidence-intake-agent writing "strong engagement" instead of transcribing "2.4%". The interpretation hides the number and pre-empts the benchmark comparison. | Intake transcribes and tags. Interpretation happens in synthesis (against a benchmark) and recommendation — never at intake. |
| Re-judging a datum in synthesis | synthesis-agent changing a confidence label or source-type because it "seems" stronger or weaker than intake said. | Tags are set once, at intake, and carried forward verbatim. Synthesis assembles; it does not re-judge. Only the critic can route a tag back for correction. |
| Looping the critic past 2 cycles | Chasing a PASS forever when the evidence is genuinely thin (PARTIAL everywhere, exports the operator cannot produce). Burns spend for a result that will not improve. | Hard cap at 2 cycles. After cycle 2, ship `done_with_concerns` with failed rubrics pinned. The transparency IS the value. |
| Treating NO_EVIDENCE as failure | Padding a NO_EVIDENCE platform with benchmark numbers and guesses so the artifact does not "look empty". | A NO_EVIDENCE flag is the skill working correctly. It tells a consumer what is unknown and tells the operator what to export. Honesty beats coverage. |
| Cross-stack contract drift | Adding a frontmatter field or body section without updating the consumers (`write-social`, `optimize-seo`, `research-shortform`, `evaluate-content`, `evaluate-shortform`, `publish-social`). Silent schema drift breaks downstream parsers. | The frontmatter schema + 8 body sections + source-type tags + coverage flags + recommendation attribution are the cross-stack contract. Schema changes require atomic update of consumers — flag to the operator before changing. |
| Confusing this skill with research-shortform | Mining public viral patterns and calling it platform evidence — or measuring owned accounts and calling it trend research. | `research-platform` measures the operator's own accounts; `research-shortform` discovers what's working in the wild. Different evidence, different question. See `playbook.md` § Distinction. |
