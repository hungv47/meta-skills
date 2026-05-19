---
title: Orchestrate-Marketing — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: orchestrate-marketing
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** the router is about to make a recommendation that smells off — routing past missing ICP / brand foundation, recommending hard-gated skills (ad-copy, cold-outreach, lp-eval) without upstream, conflating lp-brief vs lp-eval, conflating copywriting vs humanize, recommending social-copy as multi-platform, recommending ad-copy without audience-temperature prompt. Re-read at any moment of doubt.

---

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Ignoring the manifest | Filesystem scans miss `status` / `stale` / `frontmatter_present` signals that change classification | Read `.agents/manifest.json` first; filesystem fallback only when manifest missing or fresh project |
| Routing past missing ICP foundation | 13+ marketing skills consume `research/product-context.md`; skipping it produces hollow output everywhere — generic copy, voice-blind ad text, audience-blind LP hypotheses | When intent is content-or-campaign and ICP is missing → defer to `/orchestrate-research` (specifically `/icp-research`); surface the gap in the "Where you are" snapshot |
| Routing past missing brand foundation | brand-system produces voice + design tokens that every content skill reads; skipping produces voice-inconsistent copy + token-blind design briefs | When intent is content / campaign / LP / ad / outreach AND no `brand/BRAND.md` exists → propose `/brand-system` first |
| Silently defaulting to `/brand-system` on empty ask | Empty ask + no state could mean any of 6+ different intents (brand / campaign / content / LP / eval / polish) — defaulting steals the operator's decision | Emit Format 4 scoping prompt and wait for explicit intent |
| Recommending `/ad-copy` without ICP | ad-copy is hard-gated on `research/icp-research.md`; will block immediately. Worse: if operator overrides, ad-copy relies on prompt-only audience signal and produces low-relevance Meta primary text | Recommend `/icp-research` (cross-stack to research-skills) first. If operator insists, route to `/ad-copy` BUT include the quality-drop caveat |
| Recommending `/cold-outreach` without ICP | Same hard-gate failure mode — cold-outreach Pre-Dispatch has Missing-Input Hard Blocks for target / proof that require ICP context | Recommend `/icp-research` first; respect operator override with the caveat line |
| Recommending `/lp-eval` without an eval-loop workspace | lp-eval is hard-gated on an existing `skills-resources/loops/[slug]/` workspace; will block on Pre-Dispatch | Recommend `/eval-loop` first to scaffold the workspace; THEN route to `/lp-eval` for post-launch scoring |
| Conflating `/lp-brief` and `/lp-eval` | lp-brief writes new page briefs (construction-time); lp-eval scores launched pages (post-launch, inside eval-loop). Routing the wrong one wastes operator time | Use intent signals: "build / redesign / new LP / hero" → lp-brief; "analytics / experiment / heatmap / GA4 / conversion changed" → lp-eval |
| Conflating `/copywriting` and `/humanize` | copywriting writes NEW copy from scratch (horizontal across surfaces); humanize strips AI patterns from EXISTING text + injects voice. They run in sequence, not in parallel | Route to copywriting for generation; mention humanize as the terminal polish step. Never present them as alternatives |
| Recommending `/social-copy` as multi-platform | social-copy is single-platform-per-invocation by design (Tier 1 hook archetypes are platform-specific; compromise copy across platforms is optimal for none) | When routing to social-copy, ALWAYS ask which platform (tiktok / reels / shorts / x / linkedin). Multi-platform = re-invoke per platform |
| Recommending `/ad-copy` without audience-temperature prompt | ad-copy is single-audience-temp-per-invocation (retargeting vs cold-traffic — different objection maps, different framing) | When routing to ad-copy, ALWAYS ask which audience-temp (retargeting / cold). Run twice for campaigns spanning both. Meta-only at v1 |
| Routing `/short-form-brief` without short-form-research catalog | short-form-brief consumes `.agents/skill-artifacts/research/short-form-research/[slug].md` (from research-skills). Routing without it produces a brief without platform-intelligence grounding | Check for matching catalog first; if missing, flag the cross-stack dependency and recommend `/short-form-research` in research-skills before `/short-form-brief` |
| Routing landing-page work to deprecated heuristic audit | The old "lp-audit" pattern (heuristic-only, no metrics) is superseded. lp-brief owns construction-time; lp-eval owns post-launch metric evidence | Always route landing-page intent to lp-brief or lp-eval per intent signal — never to a generic "audit" pattern |
| Auto-invoking the next skill | Removes operator's redirect chance + audit trail | Always print `→  /skill-name` for operator to type |
| Recommending more than 3 skills | Operator wants the next step, not a catalog | Pick one primary route; mention at most one alternative with its trigger condition. For combined-path, cap at 3 hops |
| Skipping the state snapshot | Same words mean different things depending on what's built — "I need a landing page" with brand done routes differently than with brand missing | Always run Step 1 state detection before Step 2 classification |
| Lecturing about all 14 marketing skills | Operator wants the next step, not a tour | Show only what's relevant to the ask + state |
| Treating "I'm not sure" as a request for the catalog | Operator wants to be unblocked, not given a guided tour | Print the marketing-stack state snapshot + emit Format 4 scoping fallback |
| Re-recommending the skill that just ran | Breadcrumb shows the last hand-off; if the operator returned without running it, ask why before re-recommending — they may have hit a blocker | Read `skills-resources/experience/marketing-workflow.md` last entry; if the recommended skill is the same, surface "you didn't run X last time — was there a blocker?" |
| Forcing brand refresh on stale-but-not-broken context | 181-day-old BRAND.md is not categorically wrong — staleness is a heuristic. Forcing rerun before campaign-plan wastes the operator's time on context that's still 95% accurate | Warn, offer refresh, route forward if operator chooses ("Your brand is 6 months old. Refresh first or proceed?") |
| Routing without checking project-fit | State may be from a different project (wrong directory, stale clone); a B2B SaaS CLAUDE.md with a Gen-Z Outlaw-archetype brand is a mismatch that pollutes every downstream skill | Project-fit check in Step 1; surface mismatch in routing output and ask before routing onward |
| Recommending `/humanize` or `/vn-tone` as generation skills | They're terminal polish passes — they fix existing text, not generate new. Routing them as alternatives to copywriting / social-copy / ad-copy mis-frames the operator's options | Route to a generation skill first (copywriting / social-copy / ad-copy / cold-outreach / short-form-brief). Mention humanize/vn-tone as the terminal polish step only when copy already exists or is about to be produced |
| Cross-routing to research or product skills directly | This router is marketing-only; cross-stack work belongs to `/orchestrate-meta` or the destination stack orchestrator | When marketing stack is exhausted, recommend `/orchestrate-product` or `/orchestrate-research` (Format 3). Never recommend a specific research/product skill |
| Recommending `/discover` defensively | Patronizing when operator has clear intent | Reserve `/discover` for genuinely unclear scope — empty ask + no state, or contradictory inputs that need scoping before any marketing skill can engage |
