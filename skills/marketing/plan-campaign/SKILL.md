---
name: plan-campaign
description: "Builds an integrated marketing plan — growth motion, messaging pillars, per-channel angles across all 9 channels, content calendar, budget allocation, and a phased go-to-market timeline. Use when you need a campaign strategy or GTM plan grounded in ICP research. Not for setting numeric funnel targets (use plan-funnel), search-channel strategy (use optimize-seo), or landing-page architecture (use brief-landing-page)."
argument-hint: "[product or campaign to plan]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.1.0"
  budget: deep
  estimated-cost: "$1-3"
---

# IMC Plan — Orchestrator

*Communication — Step 2 of 4. Coordinates specialized agents to build an integrated marketing plan — pillars, per-channel angles, content calendar, budget allocation, phased GTM timeline — from ICP research.*

**Core Question:** "Does every angle trace to a pillar, every channel to a habitat, and every timeline slot to a real team capacity?"

> Why this skill exists, philosophy, methodology, principles, scope boundary, when NOT to use, what it pulls from elsewhere, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates — Read First

- **Declare growth motion (PLG / SLG / Hybrid) BEFORE selecting channels.** PLG favors community/SEO/forums; SLG favors paid/email/IRL/SMS.
- **Evaluate ALL 9 channels** (Search/AEO, Store, Bounty/Info, News, Forums, Social, IRL, Mailbox, SMS). Offline produces strategy + creative briefs.
- **Pillars before angles.** Orphan angles fail the anti-generic test.
- **No channel assignment without habitat data** from ICP research. No habitat → interview for it.
- **Match cadence to declared team capacity.** Over-scheduling guarantees missed deadlines.
- **Stale ICP (>30 days)** → recommend `research-icp` re-run (soft gate).
- **Inherit house creative direction; never re-derive or contradict it.** When `CREATIVE-DIRECTION.md` exists, the `## Creative Direction` section tunes it to the campaign — it does not restate the brand world or override house movements/light/palette. Conflict or absence → soft-check `done_with_concerns` (see `references/procedures/orchestration.md`).

## Quality Gate

Critic verifies (top items shown; full 11-row checklist + 4 Internal Consistency Checks + soft check live in [`references/procedures/orchestration.md`](references/procedures/orchestration.md)):

- [ ] Growth motion explicitly stated (PLG / SLG / Hybrid)
- [ ] 3-5 pillars, each with ICP evidence
- [ ] 3+ angles per pillar, each passing 3Q test and scored ≥15/25
- [ ] All 9 channels evaluated (selected or explicitly skipped with rationale)
- [ ] Each selected channel has ONE specific angle + execution brief
- [ ] Budget allocation present per selected channel (when budget tier declared)
- [ ] Phased timeline (3 phases) with cadence matched to team capacity
- [ ] Launch sequence follows ORB (Owned → Rented → Borrowed)

Max 2 rewrite cycles per critic verdict. **Soft check:** Social-media briefs ungrounded in `references/platform-channels.md` (or in a >90-day-stale catalog) ship `done_with_concerns` — never blocks.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — load context + check freshness (>30d → recommend `research-icp` re-run, soft gate).

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | research-icp | Recommended — positioning + accuracy + unique mechanism |
| `research/icp-research.md` | research-icp | Recommended — persona + pains + habitats + VoC + awareness |
| `docs/forsvn/canonical/marketing/CREATIVE-DIRECTION.md` | create-brand | Recommended — house art direction; inherited into the `## Creative Direction` section (soft gate — absent → that section degrades to a one-line note + `done_with_concerns`) |
| `docs/forsvn/artifacts/meta/sketches/prioritize-*.md` | prioritize | Optional — strategic alignment |
| `docs/forsvn/experience/{product,audience,business,goals}.md` | any | Optional — keys fill gaps from prior runs |

## Pre-Dispatch

Canonical Pre-Dispatch (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** product, audience persona (role + size + 1-2 pains), campaign goal (90-day outcome), growth motion (drives channel weighting + budget allocation), duration + cadence, constraints (team size, budget tier, channels off-limits).

Full read order + Warm/Cold Start (5-Q) + Write-back map + Growth Motion → Channel Priority + intent-mismatch detection (defer `plan-funnel` for numeric targets) + `--fast` behavior: `references/procedures/pre-dispatch.md` [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — `budget: deep`; `--fast` collapses Layer 2 sequential into single inline pass (3 pillars not 5, 2 angles/pillar, top 2-3 channels, 3-phase timeline + ORB inline, no rewrite loop). **`--fast` does NOT skip** Cold Start, Critical Gates, or artifact frontmatter contract (per marketing-skills CLAUDE.md "Safety gates supersede `--fast`").
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

---

## Agents + Routing

6 sub-agents (pillar / angle / channel / timeline / launch-sequencing / critic) across Layer 1 solo → Layer 2 sequential → critic gate. Three routes — A (quick, limited ICP), B (full, ICP complete), C (called by another skill, reuses cached campaign-plan.md or runs Route B if stale).

Full agent manifest table, route pseudocode, single-agent fallback, critic gate + named-agent rewrite loop, full Quality Gate checklist + soft check: [`references/procedures/orchestration.md`](references/procedures/orchestration.md) [PROCEDURE].

Spawn mechanics, orchestrator-written sections (Growth Motion / Foundation / Channel Execution Briefs / offline notes), chain position, re-run triggers, skill deference: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load both at Layer 1 dispatch entry.

---

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/campaign-plan.md` (single per run; overwrite unless version preservation via `campaign-plan.v[N].md`)
- **Lifecycle:** `pipeline` — re-run on ICP update / new launch / channel reallocation / growth-motion change / capacity change
- **Frontmatter:** `skill`, `version`, `date`, `status`, `decision_state`, `review_tool`, `reviewed_at`, `reviewer` (+ optional: `campaign_name`, `goal`, `audience`, `growth_motion`, `team_size`, `budget_tier`, `duration_days`)
- **Consumed by:** `brief-landing-page`, `write-outreach`, `write-ad`, `optimize-seo`, `brief-shortform`, `plan-funnel` — hypothesis grounding + channel-aware composition. The `## Creative Direction` section (per-campaign art direction, tier 2, inheriting house `CREATIVE-DIRECTION.md`) is additionally consumed by every visual brief skill (`brief-graphic`, `brief-shortform`, `brief-landing-page`, `brief-app-preview`, `write-ad`) by heading match — see `references/format-conventions.md` "Creative Direction section"
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter — required fields" + § "Body section order" — downstream jumps by heading match


Full template + per-field rules: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

---

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any plan ships. Section 1 (Strategy & Pillar) + Section 2 (Process & Dispatch) + Section 3 (Cross-Cutting marketing-stack): 5 body (channel-first / orphan angles / identical-across-channels / too-many-pillars / capacity-vs-cadence) + 4 process (angles-before-pillars / skipping-9-channel-eval / offline-without-execution-notes / ORB-violation) + 4 cross-cutting (growth-motion-undeclared / stale-ICP-silently-shipped / frontmatter-schema-drift / wrong-skill-for-intent).

---

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


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

Route B end-to-end (B2B SaaS PM tool — PLG, 60 days, 500 trial signups, 4 pillars + 12 angles + 5 selected + 4 skipped + 3-phase timeline + 5-phase ORB launch + critic PASS cycle 1) + cycle-2 FAIL hypothetical + Route C snippet: [`references/examples/campaign-walkthrough.md`](references/examples/campaign-walkthrough.md) [EXAMPLE].

---

## References

- `references/{playbook, format-conventions, anti-patterns}.md`
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics, orchestration}.md` [PROCEDURE]
- **Example:** `references/examples/campaign-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents): `references/{3d-angle-framework, channel-strategy, growth-play-patterns, platform-channels, examples}.md`, `references/distribution-models/clipping-and-live.md`. `growth-play-patterns.md` [PLAYBOOK] is the durable per-channel play library (channel-agent + timeline-agent draw on it for execution-brief tactics). `platform-channels.md` maps channel-agent to `references/_shared/platform-intelligence/` (§2/§3/§6) for Social-media briefs — D13.B.
- **Shared:** `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, marketing-foundations}.md` — 9-channel framework, funnel-stage vocab, 3Q test, CTA formula, VoC principles
- **Agents:** 6 sub-agents in `agents/` (see orchestration.md § Agent Manifest); `critic-agent.md` holds the canonical 11-row Quality Gate Checklist
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills"
