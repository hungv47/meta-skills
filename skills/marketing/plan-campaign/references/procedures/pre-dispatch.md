# Pre-Dispatch Procedure — Campaign-Plan

> Full read order, Warm/Cold Start templates, Write-back map, Growth Motion → Channel Priority reference, --fast behavior.

[PROCEDURE] — load at orchestrator entry, before Layer 1 dispatch.

Canonical Pre-Dispatch pattern (read first): [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) [PROCEDURE]. Below is the campaign-plan-specific instantiation.

---

## Needed dimensions

Six dimensions drive plan production. Pre-Dispatch resolves each from pipeline artifacts, experience/, or Cold Start question:

| # | Dimension | What it drives | Resolves from |
|---|---|---|---|
| 1 | **Product** (what it does, who pays) | Pillar pain-grounding, angle relevance, channel offer fit | `research/product-context.md`, `docs/forsvn/experience/product.md` |
| 2 | **Audience primary persona** (role + company size + 1-2 pains) | Pillar derivation, angle 3D framework, channel habitat selection | `research/icp-research.md`, `docs/forsvn/experience/audience.md` |
| 3 | **Campaign goal** (what 90 days needs to achieve) | Angle bank prioritization, channel weighting, timeline phase emphasis | `docs/forsvn/experience/goals.md` (Goals — current campaign focus) — usually Cold Start (campaign goals shift fast) |
| 4 | **Growth motion** (PLG / SLG / Hybrid) | Channel priority weighting (see table below) — **load-bearing for channel-agent** | `docs/forsvn/experience/business.md` (Business — growth motion) |
| 5 | **Duration + cadence** (e.g., 60 days, 3 posts/week) | Timeline shape, capacity-vs-cadence sanity check | `docs/forsvn/experience/goals.md` (Goals — campaign cadence) — usually Cold Start |
| 6 | **Constraints** (team size, budget tier, channels off-limits) | Cadence calibration, channel skip decisions, budget-type column in execution briefs | `docs/forsvn/experience/business.md` (Business — team + budget) |

---

## Read order

1. **Pipeline artifacts** (highest priority):
   - `research/product-context.md` → product (1)
   - `research/icp-research.md` → audience (2), habitats, VoC quotes, awareness levels
   - `docs/forsvn/artifacts/meta/sketches/prioritize-*.md` → strategic initiatives (optional, alignment only — campaign-plan does not gate on prioritize output)

2. **Experience substrate** (fills gaps pipeline doesn't cover):
   - `docs/forsvn/experience/{product,audience,business,goals}.md` for any dimension not covered by pipeline artifacts

3. **Freshness check:** If `date` field on pipeline artifacts is **>30 days**, warn and recommend re-running upstream — audience and pains evolve. The plan can ship anyway as `DONE_WITH_CONCERNS` with a stale-ICP flag (the user explicitly overrides).

4. **Detect intent mismatch:** if user input contains "CAC / LTV / target / conversion rate / per-channel number" language, surface the deference recommendation BEFORE dispatching: route to `plan-funnel` or run both in sequence (campaign-plan picks channels, funnel-planner sets per-channel numbers).

---

## Warm Start (most dimensions resolvable)

When 4+ of 6 dimensions resolve from artifacts/experience, emit:

```
Found:
- product → "[1-line summary from product-context.md]"
- audience → "[primary persona from research-icp.md]"
- growth motion → "[PLG / SLG / Hybrid from experience/business.md]"

Need before dispatching:
- Campaign goal — acquire leads / drive trial signups / launch a feature / awareness?
- Duration + cadence — e.g., "60 days, 3 posts/week"
- Any constraints — team size, budget tier, channels off-limits?

Answer in one response. I'll confirm and dispatch.
```

When **all six** dimensions are resolvable (rare on first run, common after experience/ has been seeded), skip the inline probes and just summarize, asking "Override or proceed?"

---

## Cold Start (3+ dimensions missing)

When 3 or more of 6 dimensions are unresolvable from artifacts AND experience/, emit:

```
Campaign-plan turns audience + product + offer into a 90-day plan with pillars,
angles, channels, and timeline. To make it specific to you, I need a few things.
(For richer output later, run `research-icp` first — but I can work from your
answers now.)

1. **Product** in one sentence — what does it do, who pays for it?
2. **Audience** — primary buyer (role + company size + top 1-2 pain points)
3. **Campaign goal** — acquire leads / drive trial signups / launch a feature /
   warm cold leads / awareness?
4. **Growth motion** — does the product sell itself with free trial or signup
   (PLG), require sales conversations or paid performance (SLG), or both
   (Hybrid)?
5. **Duration + constraints** — campaign window (30/60/90 days), cadence
   (posts per week), team size, budget tier, channels off-limits.

Answer 1-5 in one response. I'll confirm and dispatch.
```

---

## Write-back map

After Cold Start answers land, append each Q+A to experience/ before dispatching:

| Question | File | Key |
|---|---|---|
| 1. Product | `product.md` | `Product — one-line` |
| 2. Audience | `audience.md` | `Audience — primary persona` + `Audience — pain points (primary)` |
| 3. Campaign goal | `goals.md` | `Goals — current campaign focus` |
| 4. Growth motion | `business.md` | `Business — growth motion` |
| 5. Duration + constraints | `business.md` | `Business — team + budget` and `goals.md` `Goals — campaign cadence` |

Future skill invocations (campaign-plan re-run, lp-brief, cold-outreach, ad-copy, seo, short-form-brief, funnel-planner) read these keys at Warm Start time and skip re-asking.

---

## Reference — Growth Motion → Channel Priority

Used by channel-agent to weight the 9-channel evaluation. Available to the orchestrator at Pre-Dispatch confirm time regardless of how growth motion was resolved (warm-start lookup or cold-start answer):

| Motion | Channel Priority (high-to-low) |
|--------|---------|
| **PLG** | Search engines/AEO, Forums/Communities, Social media (organic), Mailbox (onboarding), Store/Listing platforms, Bounty/Info platforms |
| **SLG** | Search engines/AEO (paid), Social media (paid), Mailbox (outbound), SMS, IRL (events/OOH), News |
| **Hybrid** | Blend both — designate primary motion per audience segment in the Growth Motion section |

This is the **priority lens**, not a hard mapping. Channel-agent still consults habitat data — if PLG-recommended Forums show Low ICP density, the channel skips with rationale. If SLG-recommended IRL shows High density at a relevant trade event, it slots in regardless of motion.

---

## Context to pass to all agents

After Pre-Dispatch resolves, the orchestrator assembles a context block passed to every dispatched agent:

1. **Growth motion** — drives channel weighting (PLG / SLG / Hybrid)
2. **Campaign goal** — what success looks like (drives angle prioritization + timeline phase emphasis)
3. **ICP summary** — persona, pains, habitats, awareness levels (drives pillar derivation + channel habitat alignment)
4. **VoC quotes** — top 3-5 buyer-language phrases (drives angle hook authenticity + critic gate "Pillar evidence" check)
5. **Constraints** — team size, budget, timeline, channels off-limits (drives cadence calibration + channel-execution-brief budget-type column)

Every agent receives this block as the `context` field in its input contract. The orchestrator does NOT improvise additions — these 5 fields are the contract.

---

## --fast behavior

`--fast` flag (or "fast mode" / "quick pass" phrase in the same turn) short-circuits the multi-agent chain:

| Layer | Standard (deep) | --fast |
|---|---|---|
| Pre-Dispatch | Cold Start runs (still asks 5 questions when context missing — `--fast` does NOT skip Cold Start) | Same |
| Layer 1 | pillar-agent (3-5 pillars) | Inline pillar extraction (3 pillars, not 5) |
| Layer 2 | angle-agent + channel-agent + timeline-agent + launch-sequencing-agent (sequential) | Single inline pass (2 angles per pillar, top 2-3 channels only, 3-phase timeline, ORB sequence inline) |
| Critic gate | critic-agent dispatched with full rubric, max 2 rewrite cycles | Inline self-check against critic-agent's Quality Gate Checklist; no rewrite loop |
| Output | Full artifact with all sections + execution briefs | Compressed artifact (Pillars + Angle Bank + Channel Assignments + Timeline + Launch Sequence; execution briefs trimmed to 1-line each) |

**`--fast` does NOT skip:**
- Cold Start (`marketing-skills/CLAUDE.md` § "Complexity Routing": "`--fast` does NOT skip Cold Start")
- Critical Gates 1-6 (growth motion before channels, all 9 channels evaluated, pillars before angles, channels from habitat, capacity-fit, stale ICP warning)
- Artifact frontmatter contract (`format-conventions.md` § "Frontmatter — required fields")

Skill ends with: "Ran in --fast mode; rerun without the flag for full critique + execution briefs."

---

## Confirm-and-dispatch beat

After Warm Start probe answers (or Cold Start full response), emit a one-paragraph summary and confirm:

```
Confirmed for dispatch:
- Product: [resolved]
- Audience: [resolved]
- Campaign goal: [resolved]
- Growth motion: [PLG / SLG / Hybrid + 1-line rationale]
- Duration + cadence: [resolved]
- Constraints: [resolved]

Dispatching pillar-agent (Layer 1). Will sequence angle → channel → timeline → launch → critic.
```

If the user stays silent past one beat, dispatch. If the user corrects, update experience/ before dispatching.

## Performance Grounding (pre-generation)

When weighting channels and drafting per-channel execution briefs, ground each selected channel on the operator's own history:

```bash
bun scripts/query-performance.ts <channel> --json   # per selected channel
```

Obey the emitted `empty | sparse | sufficient` state + `guidance` — sparse data never shifts budget weighting (two posts are not a trend). Own data informs which channels/angles work for *this* account; it never becomes a prescriptive angle list (U12), and a brand floor always outranks it. Full read contract: [`../_shared/performance-grounding.md`](../_shared/performance-grounding.md).

**Then emit the Recall line** in each selected channel's execution brief (required output): state that channel's own-data result with its real `n` + the `empty/sparse/sufficient` state, and read the channel pack's `## Open Questions` to name **one** unknown as the experiment that channel's run probes — see [`../_shared/performance-grounding.md`](../_shared/performance-grounding.md) § *The recall line*. The recall is shown in the brief, not just obeyed; never fabricate `n` on an empty/sparse store, and drop the open-question part if the pack has none.
