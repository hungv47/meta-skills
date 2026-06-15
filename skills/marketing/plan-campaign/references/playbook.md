# Playbook — Campaign-Plan

> Why this skill exists, philosophy, methodology, principles, scope boundary, when NOT to use, what it pulls from elsewhere, history.

[PLAYBOOK] — read once at first invocation; re-read when scope feels off.

## Why this skill exists

Most marketing plans fail before they ship — not because the channels are wrong, but because the **pillars aren't grounded in ICP evidence**, the **angles don't trace back to a pillar**, the **channels weren't chosen from habitat data**, or the **cadence outruns the team's capacity**. Campaign-plan exists to convert ICP research into an integrated communication strategy that survives contact with execution: every angle traces to a pillar, every channel to a habitat, every timeline slot to a real team capacity.

## Core philosophy

**Frameworks are proven defaults, not mandatory templates.**

The 3D Angle framework, the Pillar Type taxonomy, the 9-channel evaluation, the ORB launch sequence — they all reduce the search space and surface the cuts most plans miss. They do not produce strategy. The orchestrator + agents apply them against the specific ICP + product + growth motion at hand; when the data contradicts the default, the data wins.

When ICP research provides habitat maps, use them. When it doesn't, **gather the data before planning channels** — never assign channels from marketer preference.

## Methodology

The campaign-plan orchestrator is primarily **sequential** — each agent depends on the previous. Multi-agent value here is in **specialist focus + critic gate + single-agent fallback**, not parallelism.

```
pillar-agent → angle-agent → channel-agent → timeline-agent → launch-sequencing-agent → critic-agent
```

- **Pillars (3-5)** — strategic themes derived from ICP pains, aspirations, workarounds, and buying criteria. Each pillar names its evidence source.
- **Angles (3+ per pillar)** — generated via the 3D framework (Hook Type × Awareness × Emotional Trigger), scored 0-25, cut below 15.
- **Channels (all 9 evaluated)** — Search/AEO, Store/Listing, Bounty/Info, News, Forums/Communities, Social, IRL (OOH/Events/POS), Mailbox, SMS. Each gets a select/skip decision with habitat justification. Offline channels (IRL, SMS, OOH) produce execution briefs for physical execution.
- **Timeline (3 phases)** — Pre-launch (problem content) → Launch (transformation + proof) → Sustain (trust + social). Cadence matched to team capacity.
- **Launch sequence (ORB)** — Owned → Rented → Borrowed channel activation order so paid + earned amplify what owned has already validated.
- **Critic gate** — verifies pillar-angle-channel-timeline-launch alignment, scoring rigor, capacity fit. Max 2 rewrite cycles.

## Three guiding principles

1. **Growth motion before channels.** PLG (product drives acquisition) vs SLG (outbound/performance drives acquisition) vs Hybrid determines channel weighting before habitat data is even consulted.
2. **Pillars before angles.** Angles without a parent pillar are untethered and fail the anti-generic test. The pillar-agent must complete before angle-agent dispatches.
3. **Habitat before assignment.** Channels chosen from ICP density data, not from what's trendy. No habitat data → gather it before planning.

## Scope boundary

**In scope:** integrated marketing plans — pillars, angles, 9-channel evaluation + execution briefs, 3-phase timeline + editorial calendar, ORB launch sequence. Both PLG and SLG growth motions. Online + offline channels (IRL, SMS, OOH produce strategy + creative briefs for physical execution, not the physical execution itself).

**Out of scope:**
- **Numeric targets (CAC, LTV, conversion rates, channel-CPL)** → use `plan-funnel`. Campaign-plan picks channels and cadence; funnel-planner sets the numbers each channel must hit.
- **Per-page conversion architecture** → use `brief-landing-page`. Campaign-plan picks landing pages as a channel; lp-brief designs their structure.
- **SEO keyword strategy + technical audit** → use `optimize-seo`. Campaign-plan can pick "Search engines" as a channel; seo turns that into a keyword tree + audit + execution plan.
- **Per-touch outbound composition** → use `write-outreach`. Campaign-plan can pick "Mailbox" as a channel; cold-outreach composes the actual touches.
- **Per-asset short-form video brief** → use `brief-shortform`. Campaign-plan can include "Social media" with video as a format; short-form-brief turns each hero into a production-ready brief.
- **Per-ad creative for paid Meta** → use `write-ad`. Campaign-plan can pick "Social media (paid)"; ad-copy composes the actual ads per audience-temperature.

## When NOT to use

- The user asks for one tactical asset (an ad, a single landing page, an email). Use the specialist skill directly — campaign-plan creates the integrated plan; it does not produce specialist deliverables.
- ICP research is missing AND the user can't provide enough context for a Cold Start to land. Recommend `research-icp` first; campaign-plan is downstream of it.
- The user wants a budget allocation across channels with target numbers attached. Pair with `plan-funnel` — campaign-plan picks the channels and weighting; funnel-planner sets the per-channel targets.
- The user wants a single-channel deep-dive (e.g., "build me a TikTok content strategy"). Use the specialist skill (`brief-shortform`, `write-social`); campaign-plan's value is the 9-channel evaluation + integration, not a single-channel plan.

## What it pulls from elsewhere

- `research/product-context.md` — product positioning, accuracy constraints, unique mechanism, proof points (from `research-icp`)
- `research/icp-research.md` — primary persona, pains, habitats, VoC quotes, awareness levels (from `research-icp`)
- `docs/forsvn/artifacts/meta/sketches/prioritize-*.md` — strategic initiatives (optional, alignment only; from `prioritize` in research-skills)
- `docs/forsvn/experience/{product,audience,business,goals}.md` — persisted answers from prior Cold Starts across the stack
- `references/3d-angle-framework.md` — angle generation methodology (loaded by angle-agent)
- `references/channel-strategy.md` — 9-channel framework + habitat-to-channel mapping (loaded by channel-agent)
- `references/distribution-models/clipping-and-live.md` — Whop/Zagged clipping ecosystem + Jubilee format (loaded by channel-agent conditionally when target demo skews male 21-30 or habitat data flags live-streaming density)
- `references/examples.md` — 5 complete worked examples across verticals (B2B SaaS, DTC, agency, B2B service, consumer marketplace)

## What downstream skills pull from plan-campaign

- `brief-landing-page` (Route C) — reads campaign context for hypothesis grounding
- `write-outreach` (Route C) — reads campaign goal + ICP summary for personalization
- `optimize-seo` — coordinates on keyword targeting + content structure for the Search channel
- `write-ad` (Route B) — reads ICP summary + offer + creative-format for paid social composition
- `brief-shortform` — reads campaign goal + pillar context for hero video angle
- `plan-funnel` — reads channel mix + cadence to set per-channel numeric targets

The artifact at `docs/forsvn/artifacts/marketing/campaign-plan.md` is the shared reference these skills check before generating their own deliverables.

## History / origin

| Version | Date | Slot | Note |
|---|---|---|---|
| 8.0.0 → 8.0.0 | 2026-05-18 | v6 Phase 2 Wave 1 — marketing-stack slot 10/14 | Body 470 → ~210 (-55%) + 5 new refs (playbook + format-conventions + procedures/pre-dispatch + procedures/dispatch-mechanics + examples/campaign-walkthrough) + new anti-patterns.md (5 from body + 4 cross-cutting marketing-stack rows). Cross-stack contract preserved BYTE-IDENTICAL: 6 Critical Gates, 10-item Quality Gate (orchestrator-side; canonical 11-row + 9-row Rewrite Routing live in critic-agent.md), 6-agent Manifest, Routes A/B/C, Pre-Dispatch (6 needed dimensions + Warm/Cold templates + 5-row Write-back map + Growth Motion → Channel Priority table), Layer 1 + Layer 2 dispatch tables, Artifact Template (4-field frontmatter + Foundation/Pillars/Angle Bank/Channel Assignments/Channel Execution Briefs/Timeline/Launch Sequence sections), Completion Status 4-tier. Structural: nested `### Artifact Template` under new `## Artifact Contract` H2 wrapper per marketing-stack sibling-parity convention (matches ad-copy slot 9 + copywriting slot 8 + cold-outreach slot 7 + humanmaxxing slot 6 + vn-tone slot 5 + short-form-brief slot 4 + seo slot 3). |
