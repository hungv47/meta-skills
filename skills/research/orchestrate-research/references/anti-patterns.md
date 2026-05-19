---
title: Orchestrate-Research — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: orchestrate-research
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** the router is about to make a recommendation that smells off — routing past a missing ICP foundation, recommending `prioritize` or `funnel-planner` without upstream artifacts, routing `diagnose` against a vague "things feel off" ask, bundling `short-form-research` into the pipeline. Re-read at any moment of doubt.

---

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Ignoring the manifest | Filesystem scans miss `status` / `stale` / `frontmatter_present` signals that change classification | Read `.agents/manifest.json` first; filesystem fallback only when manifest missing or fresh project |
| Routing past missing ICP foundation | 13+ downstream skills consume `research/product-context.md`; skipping it produces hollow output everywhere | When intent is audience-or-strategy and ICP is missing → propose `/icp-research` first; surface the gap in the "Where you are" snapshot |
| Silently defaulting to `/icp-research` on empty ask | Empty ask + no state could mean any of 5+ different intents — defaulting steals the operator's decision | Emit Format 4 scoping prompt and wait for explicit intent |
| Recommending `/prioritize` without upstream artifacts | `prioritize` is hard-gated on its Pre-Dispatch; will block immediately. Worse: if operator overrides the gate, prioritize relies on whatever's in the prompt and produces ICE scores without evidence | Recommend the upstream skill (`/diagnose` or `/market-research`) first. If operator insists, route to `/prioritize` BUT include the quality-drop caveat |
| Recommending `/funnel-planner` without prioritization | `funnel-planner` is hard-gated on prioritize.md. Same failure mode as above | Route to `/prioritize` first; respect operator override with the caveat line |
| Routing `/diagnose` against a vague ask ("things feel off") | `diagnose` needs a specific metric or symptom; generic input produces generic verdicts | Push back and ask for a metric ("which number is moving the wrong way?") before routing. Do NOT route to diagnose on vibes |
| Bundling `short-form-research` into the audience/market/strategy pipeline | It's a per-platform research cycle that feeds the marketing stack's short-form chain — different lifecycle, different consumer | Route to it as Format 1 single-route with platform argument; flag the cross-stack handoff to marketing-side `/short-form-brief` if relevant |
| Treating `market-research` and `diagnose` as sequential | They're siblings that consume ICP independently. Forcing both into a chain inflates effort when operator's ask only needs one | Pick the one matching intent. Recommend both only when the ask explicitly spans landscape + a specific problem |
| Auto-invoking the next skill | Removes operator's redirect chance + audit trail | Always print `→  /skill-name` for operator to type |
| Recommending `/discover` defensively | Patronizing when operator has clear intent | Reserve `/discover` for genuinely unclear scope — empty ask + no state, or contradictory inputs that need scoping before any research skill can engage |
| Cross-routing to marketing or product skills directly | This router is research-only; cross-stack work belongs to `/orchestrate-meta` or the destination stack orchestrator | When research stack is exhausted, recommend `/orchestrate-marketing` or `/orchestrate-product` (Format 3). Never recommend a specific marketing/product skill |
| Recommending more than 3 skills | Operator wants the next step, not a catalog | Pick one primary route; mention at most one alternative with its trigger condition. For combined-path, cap at 3 hops |
| Skipping the state snapshot | Same words mean different things depending on what's built — "understand my market" with ICP done routes differently than with ICP missing | Always run Step 1 state detection before Step 2 classification |
| Lecturing about all 8 research skills | Operator wants the next step, not a tour | Show only what's relevant to the ask + state |
| Treating "I'm not sure" as a request for the catalog | Operator wants to be unblocked, not given a guided tour | Print the research-stack state snapshot + emit Format 4 scoping fallback |
| Re-recommending the skill that just ran | Breadcrumb shows the last hand-off; if the operator returned without running it, ask why before re-recommending — they may have hit a blocker | Read `skills-resources/experience/research-workflow.md` last entry; if the recommended skill is the same, surface "you didn't run X last time — was there a blocker?" |
| Forcing ICP refresh on stale-but-not-broken context | 91-day-old ICP is not categorically wrong — staleness is a heuristic. Forcing rerun before market-research wastes the operator's time on context that's still 95% accurate | Warn, offer refresh, route forward if operator chooses ("Your ICP is 4 months old. Refresh first or proceed?") |
| Routing without checking project-fit | State may be from a different project (wrong directory, stale clone); a B2B SaaS CLAUDE.md with a consumer-app ICP is a mismatch that pollutes every downstream skill | Project-fit check in Step 1; surface mismatch in routing output and ask before routing onward |
