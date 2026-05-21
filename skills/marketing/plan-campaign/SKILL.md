---
name: plan-campaign
description: "Builds an integrated marketing plan — growth motion, messaging pillars, per-channel angles across all 9 channels, content calendar, budget allocation, and a phased go-to-market timeline. Use when you need a campaign strategy or GTM plan grounded in ICP research. Not for setting numeric funnel targets (use plan-funnel), search-channel strategy (use optimize-seo), or landing-page architecture (use brief-landing-page)."
argument-hint: "[product or campaign to plan]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "8.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# IMC Plan — Orchestrator

*Communication — Step 2 of 4. Coordinates specialized agents to turn ICP research into an integrated marketing communication strategy.*

**Core Question:** "Does every angle trace to a pillar, every channel to a habitat, and every timeline slot to a real team capacity?"

> Why this skill exists, philosophy, methodology, principles, scope boundary, when NOT to use, what it pulls from elsewhere, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates — Read First

- **Identify the growth motion BEFORE selecting channels.** PLG (product drives acquisition), SLG (outbound/performance drives acquisition), or Hybrid. The motion determines channel priorities — PLG favors community/SEO/forums, SLG favors paid/email/IRL/SMS.
- **Evaluate ALL 9 channels, not just digital.** The full channel map: Search engines/AEO, Store/Listing platforms, Bounty/Info platforms, News, Forums/Communities, Social media, IRL (OOH/Events/POS), Mailbox, SMS. Offline channels (IRL, SMS) produce strategy docs and creative briefs for physical execution.
- **Do NOT generate angles before pillars.** Angles are derived PER PILLAR. Without pillars, angles are untethered and fail the anti-generic test.
- **Do NOT assign channels without habitat data.** Channel selection comes from ICP research habitat maps, not marketer preference. No habitat data → interview for it.
- **Do NOT schedule 10 pieces/week for a 2-person team.** Match cadence to actual capacity. Over-scheduling guarantees missed deadlines.
- **Stale ICP research (>30 days) produces misaligned plans.** Recommend re-running `research-icp` before proceeding.

## Quality Gate

Before delivering, the **critic agent** verifies:
- [ ] Growth motion explicitly stated (PLG / SLG / Hybrid)
- [ ] 3-5 pillars, each with ICP evidence
- [ ] 3+ angles per pillar, each passing 3Q test and scored ≥15/25
- [ ] All 9 channels evaluated (selected or explicitly skipped with rationale)
- [ ] Each selected channel has ONE specific angle (not a content category)
- [ ] Channel selection based on ICP habitat data AND growth motion alignment
- [ ] Channel execution briefs present for every selected channel
- [ ] Offline channels (if selected) include compliance and execution notes
- [ ] Timeline has 3 phases with realistic cadence
- [ ] Launch sequence follows ORB (Owned → Rented → Borrowed)

Full 11-row Quality Gate Checklist + 4 Internal Consistency Checks + 9-row Rewrite Routing: [`agents/critic-agent.md`](agents/critic-agent.md). Max 2 rewrite cycles per critic verdict.

**Soft check (DONE_WITH_CONCERNS, not FAIL):** when **Social media** is a selected channel, its Channel Execution Brief should be grounded in `references/platform-channels.md` → the `references/platform-intelligence/` catalog (§2 Format Constraints, §3 Algorithm Signals, §6 CTA Placement Norms). An ungrounded Social-media brief — or one grounded in a stale (>90-day) catalog file — ships `done_with_concerns`, flagged in the artifact. It never blocks the plan.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — load product-context.md + icp-research.md + optional prioritize sketch + check freshness (>30d → recommend `research-icp` re-run, soft gate).

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | icp-research | Recommended — product positioning + accuracy constraints + unique mechanism |
| `research/icp-research.md` | icp-research | Recommended — primary persona + pains + habitats + VoC + awareness levels |
| `.forsvn/artifacts/meta/sketches/prioritize-*.md` | prioritize | Optional — alignment with strategic initiatives |
| `.forsvn/experience/{product,audience,business,goals}.md` | (any skill) | Optional — keys fill dimension gaps from prior runs |

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** product (what it does, who pays), audience primary persona (role + company size + 1-2 pains), campaign goal (what 90 days needs to achieve), growth motion (PLG / SLG / Hybrid — drives channel weighting), duration + cadence (e.g., 60 days, 3 posts/week), constraints (team size, budget tier, channels off-limits).

Full read order + Warm/Cold Start templates (5-question Cold Start) + Write-back map (5 rows → product/audience/goals/business) + Growth Motion → Channel Priority reference + intent-mismatch detection (defer to `plan-funnel` for numeric targets) + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — this skill is `budget: deep`; `--fast` flag collapses Layer 2 sequential chain into single inline pass (3 pillars not 5, 2 angles per pillar, top 2-3 channels only, 3-phase timeline + ORB inline, no rewrite loop). **`--fast` does NOT skip** Cold Start, Critical Gates 1-6, or the artifact frontmatter contract (per marketing-skills CLAUDE.md "Safety gates supersede `--fast`").

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Pillar Agent | 1 | `agents/pillar-agent.md` | 3-5 messaging pillars from ICP pains |
| Angle Agent | 2 (sequential) | `agents/angle-agent.md` | 3D angle generation per pillar |
| Channel Agent | 2 (sequential) | `agents/channel-agent.md` | 9-channel evaluation with habitat-informed selection + execution briefs |
| Timeline Agent | 2 (sequential) | `agents/timeline-agent.md` | Phase sequencing + editorial calendar |
| Launch Sequencing Agent | 2 (sequential) | `agents/launch-sequencing-agent.md` | ORB Framework channel activation order |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Alignment, scoring rigor, completeness |

**Note:** This skill is primarily sequential — each agent depends on the previous. Pillar-agent is the only Layer 1 agent. The value of multi-agent here is in specialist focus, critic gate, and single-agent fallback — not parallelism.

### Shared References

- **Domain catalogs** (loaded by agents at dispatch): `references/3d-angle-framework.md` (angle-agent), `references/channel-strategy.md` (channel-agent), `references/platform-channels.md` (channel-agent — conditional, when Social media is a selected channel), `references/distribution-models/clipping-and-live.md` (channel-agent — conditional), `references/examples.md` (5 worked examples across verticals)
- **Shared:** `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver}.md`

---

## Routing + Dispatch

Three routes — Route A (quick plan when ICP data is limited), Route B (full plan), Route C (called by another skill).

```
ROUTE A (quick plan — MVP or startup, limited ICP data):
  1. Pre-Dispatch (per procedures/pre-dispatch.md)
  2. Dispatch pillar-agent (3 pillars, not 5)
  3. Dispatch angle-agent (2 angles per pillar)
  4. Dispatch channel-agent (top 2-3 channels only)
  5. Dispatch critic-agent
  6. FAIL → re-dispatch (max 2 cycles)
  7. Deliver — timeline and launch sequence done by orchestrator inline

ROUTE B (full plan — ICP research complete, campaign launch):
  1. Pre-Dispatch (per procedures/pre-dispatch.md)
  2. LAYER 1: Dispatch pillar-agent (solo)
  3. LAYER 2 — Dispatch SEQUENTIALLY:
     - angle-agent (receives pillar output)
     - channel-agent (receives angle output + habitat data)
     - timeline-agent (receives channel output)
     - launch-sequencing-agent (receives timeline output)
  4. Dispatch critic-agent (receives complete plan)
  5. FAIL → re-dispatch named agent(s) with feedback (max 2 cycles)
  6. Deliver artifact

ROUTE C (called by another skill — lp-brief, cold-outreach, ad-copy):
  1. Read existing .forsvn/artifacts/mkt/campaign-plan.md if available
  2. If not available OR stale (>30d), run Route B
  3. Return plan to calling skill
```

Mechanics (how to spawn agents, single-agent fallback, orchestrator-written sections — Growth Motion / Foundation / Channel Execution Briefs / offline execution notes, Layer 1 + Layer 2 dispatch tables, critic gate + rewrite loop with named re-dispatch, chain position, re-run triggers, skill deference): [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Artifact Contract

- **Path:** `.forsvn/artifacts/mkt/campaign-plan.md` (single artifact per run; overwrite on re-run unless version preservation requested via `campaign-plan.v[N].md` rename)
- **Lifecycle:** `pipeline` — re-run on ICP update / new campaign launch / channel performance reallocation / growth motion change / team capacity change
- **Frontmatter fields:** `skill`, `version`, `date`, `status` (+ optional: `campaign_name`, `goal`, `audience`, `growth_motion`, `team_size`, `budget_tier`, `duration_days`)
- **Consumed by:** `brief-landing-page`, `write-outreach`, `write-ad`, `optimize-seo`, `brief-shortform`, `plan-funnel` — they read campaign context for hypothesis grounding + channel-aware composition
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter — required fields" + § "Body section order" — never silently drift; downstream consumers jump to sections by heading match

Full template + per-field format rules (frontmatter rules, body section order, table schemas, slug pattern, re-run convention, anti-drift checks): [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Artifact Template

```markdown
---
skill: plan-campaign
version: 1
date: [today's date]
status: done | done_with_concerns | blocked | needs_context
---

# IMC Plan: [Campaign / Product Name]

**Date:** [today]
**Skill:** campaign-plan
**Goal:** [campaign objective]
**Audience:** [primary persona]

## Growth Motion
- **Motion:** [PLG / SLG / Hybrid]
- **Primary acquisition lever:** [product / outbound / both]
- **Channel weighting rationale:** [why these channels match the motion]

## Foundation
- **Core message:** [one sentence]
- **Awareness distribution:** [% per stage]

## Pillars
| # | Pillar | Type | % | Stage | Evidence |
|---|--------|------|---|-------|---------|
| 1 | ... | ... | ... | ... | ... |

## Angle Bank
| # | Angle | Hook | Stage | Trigger | Score | Class | Pillar |
|---|-------|------|-------|---------|-------|-------|--------|
| 1 | ... | ... | ... | ... | ... | ... | ... |

## Channel Assignments
| Channel | Type | Angle | Role | Cadence |
|---------|------|-------|------|---------|
| ... | ... | ... | ... | ... |

**9-Channel Evaluation:** For each channel, the channel-agent assesses relevance and produces a select/skip decision. Channels: Search engines/AEO, Store/Listing platforms, Bounty/Info platforms, News, Forums/Communities, Social media, IRL (OOH/Events/POS), Mailbox, SMS.

## Channel Execution Briefs

For each selected channel, a mini-brief with actionable next steps:

| Channel | Objective | Tactic | Budget Type | Success Metric | Owner | First Milestone |
|---------|-----------|--------|-------------|----------------|-------|-----------------|
| [e.g. Search engines] | [e.g. Capture intent traffic] | [e.g. Google Search ads + SEO content] | [Paid + Organic] | [CTR, CPL] | [Person] | [e.g. First campaign live by W2] |

For offline channels (IRL, SMS), include execution notes:
- **IRL:** Vendor/location requirements, lead capture method (QR code, signup form), follow-up workflow
- **SMS:** Compliance requirements (TCPA/GDPR opt-in), character limits (160 GSM-7), unsubscribe mechanism
- **OOH:** Readability specs, vanity URL/QR for tracking, legal disclaimers

## Timeline
| Week | Phase | Channel | Angle | Format | Status |
|------|-------|---------|-------|--------|--------|
| W1 | ... | ... | ... | ... | Planned |

## Launch Sequence
| Phase | Timing | Channels | Action |
|-------|--------|----------|--------|
| Internal | T-4w | ... | ... |

> On re-run: rename existing artifact to `campaign-plan.v[N].md` and create new with incremented version.
```

---

## Anti-Patterns

Section 1 (Strategy & Pillar) + Section 2 (Process & Dispatch) + Section 3 (Cross-Cutting marketing-stack): [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any plan ships. 5 from body (channel-first / orphan angles / identical-across-channels / too-many-pillars / capacity-vs-cadence) + 4 process (angles-before-pillars / skipping-9-channel-eval / offline-without-execution-notes / ORB-violation) + 4 cross-cutting (growth-motion-undeclared / stale-ICP-silently-shipped / frontmatter-schema-drift / wrong-skill-for-intent).

---

## Completion Status

Every run ends with explicit status:
- **DONE** — pillars + angles + channels + timeline + launch sequence written, critic PASS
- **DONE_WITH_CONCERNS** — plan complete but with capacity-vs-cadence mismatch or thin habitat data; flagged in artifact
- **BLOCKED** — ICP and product context incompatible (different audiences imply different campaigns); needs user scope decision
- **NEEDS_CONTEXT** — `research/icp-research.md` and `research/product-context.md` missing; recommend `research-icp` first

## Next Step

Run `brief-landing-page` for any campaign landing pages, `optimize-seo` for search-channel execution, `write-outreach` for outbound.

---

## Worked Example

End-to-end Route B walkthrough (B2B SaaS async-first PM tool — PLG, 60 days, 500 trial signups, 4 pillars + 12 angles + 5 selected channels + 4 skipped with rationale + 3-phase timeline + 5-phase ORB launch + critic PASS cycle 1) + cycle-2 FAIL hypothetical + Route C snippet (called by lp-brief): [`references/examples/campaign-walkthrough.md`](references/examples/campaign-walkthrough.md) [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/campaign-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch): `references/{3d-angle-framework, channel-strategy, platform-channels, examples}.md`, `references/distribution-models/clipping-and-live.md`. `platform-channels.md` maps channel-agent to the `references/platform-intelligence/` catalog (§2/§3/§6) for Social-media channel execution briefs — D13.B.
- **Shared:** `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, clipping-and-live}.md`
- **Marketing foundations:** `references/_shared/marketing-foundations.md` — canonical 9-channel framework, funnel-stage vocabulary, 3Q content test, CTA formula, VoC principles
- **Agents:** 6 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 11-row Quality Gate Checklist + 9-row Rewrite Routing + 4 Internal Consistency Checks.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
