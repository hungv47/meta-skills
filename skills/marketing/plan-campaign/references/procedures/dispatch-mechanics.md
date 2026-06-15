# Dispatch Mechanics — Campaign-Plan

> How to spawn sub-agents, single-agent fallback, Layer 1 / Layer 2 sequential chain, orchestrator-written sections, critic gate + rewrite loop, chain position, skill deference.

[PROCEDURE] — load at Layer 1 dispatch entry.

---

## How to spawn a sub-agent

The orchestrator spawns each sub-agent by:

1. **Read** the agent instruction file — include its FULL content in the Agent prompt (no excerpts; agents need their complete role + input contract + output contract + domain instructions + self-check).
2. **Append** the context block (5 fields from Pre-Dispatch: growth motion, campaign goal, ICP summary, VoC quotes, constraints) AND the upstream agent's output (when not Layer 1).
3. **Resolve file paths to absolute:** replace any relative path in the agent's reference list with the absolute path the agent will actually read. Agents don't navigate; they read the path you give them.
4. **Pass upstream artifacts by content:** orchestrator reads `docs/forsvn/artifacts/` files itself, includes relevant excerpts inline. Do not pass file paths and hope the agent reads them — the agent has limited tool access by design.
5. **Append critic feedback** if it exists, under a `## Critic Feedback — Address Every Point` heading. Agents will not address feedback they didn't receive.

---

## Single-agent fallback

If multi-agent dispatch is unavailable (no Agent tool, `--fast` mode, or orchestrator-internal mode), execute the chain sequentially in-context using the same logic each agent would apply:

1. **Pillar extraction** — read ICP research, extract 3-5 strategic themes from pains + aspirations + workarounds + buying criteria. Each pillar names its ICP evidence.
2. **Angle generation per pillar** — apply the 3D framework (Hook Type × Awareness × Emotional Trigger) from `references/3d-angle-framework.md`. Score 0-25, cut below 15.
3. **Channel assignment per angle** — evaluate all 9 channels against habitat data + growth motion + angle Class. Select with one specific angle per channel; skip with rationale. Produce execution briefs for selected channels (per `format-conventions.md` § "Channel Execution Briefs table").
4. **Timeline phasing** — 3 phases (Pre-launch → Launch → Sustain). Cadence matched to declared team size. Pillar rotation across weeks.
5. **Launch sequencing** — ORB Framework (Internal → Email alpha → Partner posts → Public launch → PR + paid).
6. **Self-evaluate** against the critic-agent rubric (11-item Quality Gate Checklist + 4 Internal Consistency Checks from `agents/critic-agent.md`). FAIL → revise the named upstream step.

Single-agent fallback ships as `DONE_WITH_CONCERNS` with a note: "Ran in single-agent mode; rerun with multi-agent dispatch for critic gate + named-agent rewrite loop."

---

## Orchestrator-written sections

Three sections are written by the orchestrator inline (no agent dispatched):

1. **Growth Motion** — determined in Pre-Dispatch (Step 0), written directly into the artifact BEFORE Layer 1 dispatches. Drives channel-agent's habitat-weighting input — must exist before Layer 2.
2. **Foundation** (Core message + Awareness distribution) — assembled by the orchestrator after pillar-agent returns. The pillars + their stage distribution drive both fields.
3. **Channel Execution Briefs** — assembled by the orchestrator after channel-agent returns, using channel-agent's output (channel assignments + habitat data) to populate the briefs table with Objective / Tactic / Budget Type / Success Metric / Owner / First Milestone per channel. Offline-channel execution notes (IRL / SMS / OOH) also written inline by the orchestrator from channel-agent output.

Do NOT dispatch a separate agent for these. The orchestrator's read of the upstream output IS the work.

---

## Layer 1 — Pillar Foundation

Dispatch **pillar-agent alone**. It produces the pillar table that all downstream agents need.

| Agent | Instruction File | Pass These Inputs | Reference Files |
|-------|-----------------|-------------------|-----------------|
| Pillar Agent | `agents/pillar-agent.md` | brief + ICP research summary + VoC + 5-field context block | — |

Wait for completion. Pillar output becomes input for ALL Layer 2 agents.

Pillar-agent has no parallelism — it's solo in Layer 1 because every Layer 2 agent depends on its output. Do NOT dispatch angle-agent or channel-agent in parallel with pillar-agent.

---

## Layer 2 — Sequential Strategy Chain

Dispatch **ONE AT A TIME, IN ORDER**. Each receives the previous agent's output.

```
pillar-agent → angle-agent → channel-agent → timeline-agent → launch-sequencing-agent → critic-agent
```

| Step | Agent | Instruction File | Receives | Reference Files |
|------|-------|-----------------|----------|-----------------|
| 1 | Angle Agent | `agents/angle-agent.md` | Pillar table + 5-field context | `references/3d-angle-framework.md` |
| 2 | Channel Agent | `agents/channel-agent.md` | Angle bank + habitat data + growth motion + 5-field context | `references/channel-strategy.md` (includes 9-Channel Framework); `references/distribution-models/clipping-and-live.md` conditionally when target demo skews male 21–30 or habitat data flags H-density live-streaming presence |
| 3 | Timeline Agent | `agents/timeline-agent.md` | Channel assignments + 5-field context | — |
| 4 | Launch Sequencing Agent | `agents/launch-sequencing-agent.md` | Timeline + 5-field context | — |
| 5 | Critic Agent | `agents/critic-agent.md` | Complete assembled plan (pillars + angles + channels + execution briefs + timeline + launch sequence) | — |

Each step is a SEPARATE Agent dispatch. Do NOT bundle two steps into one Agent call — each agent has its own role + self-check + output contract that gets diluted under bundling.

---

## Critic gate + rewrite loop

After Layer 2 step 5, the critic-agent returns one of two verdicts (per `agents/critic-agent.md` § "Output Contract"):

- **PASS** — orchestrator writes the artifact, delivers.
- **FAIL** — critic returns one or more failures, each with a named re-dispatch target (per the Rewrite Routing table in `agents/critic-agent.md`).

### Rewrite loop discipline

1. **Re-dispatch the EARLIEST failing agent** in the chain, not all of them. If pillar-agent failed, the whole chain re-runs from pillar; if only timeline failed, only timeline re-runs.
2. **Append critic feedback** as `## Critic Feedback — Address Every Point` in the re-dispatched agent's prompt.
3. **Max 2 cycles** total (cycle 1 = original; cycle 2 = re-dispatch). If cycle 2 fails, ship as `DONE_WITH_CONCERNS` with the critic's failure list in a sidecar `campaign-plan.critic-notes.md` (per `format-conventions.md` § "Critic verdict file").
4. **Do NOT silently swallow failures.** If the critic fails on a Critical Gate (growth motion missing / orphan angle / habitat-violating channel / offline channel without execution notes / capacity overrun / ORB violation), the orchestrator does NOT ship even at cycle 2 — escalate to the user with the specific failure list.

---

## Chain position

**Previous:** `research-icp` (creates `research/product-context.md` + `research/icp-research.md` — the canonical ICP record campaign-plan consumes).

**Next:**
- `brief-landing-page` (per landing page consuming the campaign's channel + angle assignment)
- `optimize-seo` (search-channel keyword + content execution)
- `write-outreach` (mailbox-channel outbound execution, per-touch composition)
- `write-ad` (paid Meta social-channel composition, per audience-temperature)
- `brief-shortform` (social-media-channel hero video brief)
- `plan-funnel` (sets per-channel numeric targets — CAC / LTV / per-channel CPL)

Campaign-plan is the **integration layer** between strategy (icp-research, prioritize) and execution (lp-brief, seo, cold-outreach, ad-copy, short-form-brief, funnel-planner). Downstream skills read `docs/forsvn/artifacts/marketing/campaign-plan.md` for context.

---

## Re-run triggers

Re-invoke plan-campaign when:

1. **ICP research is updated** — new icp-research.md (date refresh, new persona, new habitat data). Channel weighting shifts; pillars may need re-derivation.
2. **New product/campaign launches** — different goal, different audience subsegment, different growth motion. Treat as separate `campaign-plan.md` (per-product) or new version (per-campaign on same product).
3. **Channel performance data suggests reallocation** — funnel-planner outputs show a channel under-performing target by >40%. Re-run campaign-plan with the performance data in the constraints field.
4. **Growth motion changes** — PLG → Hybrid (added sales-led motion) or SLG → Hybrid (added product-led motion). Channel priority lens shifts substantially.
5. **Team capacity changes** — team size doubled, or contractor budget pulled. Cadence calibration changes.

Do NOT re-run on every minor adjustment — campaign-plan is a strategic anchor, not a tactical asset. Tactical adjustments (one new angle, one channel cadence tweak) can be edited inline in the existing artifact without a re-run.

---

## Skill deference

Before dispatching, the orchestrator checks for intent mismatch and defers:

- **"What should my CAC target be?" / "Per-channel CPL?" / "Conversion rate by channel?"** → defer to `plan-funnel`. Offer: "Run both — campaign-plan picks channels, funnel-planner sets per-channel numbers."
- **"Compare SEO pages" / "Keyword targeting" / "Site audit"** → defer to `optimize-seo`. Coordinate: "campaign-plan picks Search as a channel; `optimize-seo` turns that into a keyword tree + content structure."
- **"Landing page for this campaign"** → defer to `brief-landing-page`. Sequence: "campaign-plan first (so the page knows which channel + angle it serves), then lp-brief."
- **"Single ad" / "Single email" / "Single short-form video"** → defer to the specialist (`write-ad`, `write-outreach`, `brief-shortform`). Campaign-plan produces the integrated plan; specialists produce the tactical asset.

Deference is **explicit** — emit the defer recommendation before dispatching campaign-plan. If the user wants both, run campaign-plan first so the specialist has context.
