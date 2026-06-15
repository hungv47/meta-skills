# Orchestration — plan-campaign

> Agent manifest, three routes (A quick / B full / C called), full Quality Gate checklist + soft-check details, single-agent fallback. Load at Layer 1 dispatch entry alongside `dispatch-mechanics.md`.

[PROCEDURE]

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Pillar Agent | 1 | `agents/pillar-agent.md` | 3-5 messaging pillars from ICP pains |
| Angle Agent | 2 (sequential) | `agents/angle-agent.md` | 3D angle generation per pillar |
| Channel Agent | 2 (sequential) | `agents/channel-agent.md` | 9-channel evaluation with habitat-informed selection + per-channel execution briefs |
| Timeline Agent | 2 (sequential) | `agents/timeline-agent.md` | Phase sequencing + editorial calendar |
| Launch Sequencing Agent | 2 (sequential) | `agents/launch-sequencing-agent.md` | ORB Framework channel activation order |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Alignment, scoring rigor, completeness |

This skill is **primarily sequential** — each agent depends on the previous. Pillar-agent is the only Layer 1 agent. The value of multi-agent here is specialist focus, critic gate, and single-agent fallback — not parallelism.

### Shared references loaded by agents at dispatch

- `references/3d-angle-framework.md` (angle-agent)
- `references/channel-strategy.md` (channel-agent)
- `references/platform-channels.md` (channel-agent — conditional, when Social media is selected)
- `references/distribution-models/clipping-and-live.md` (channel-agent — conditional)
- `references/examples.md` (5 worked examples across verticals)
- `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver}.md`

---

## Routes

Three routes — Route A (quick), Route B (full), Route C (called by another skill).

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

ROUTE C (called by another skill — brief-landing-page, write-outreach, write-ad):
  1. Read existing docs/forsvn/artifacts/marketing/campaign-plan.md if available
  2. If not available OR stale (>30d), run Route B
  3. Return plan to calling skill
```

Spawn mechanics, orchestrator-written sections (Growth Motion / Foundation / Channel Execution Briefs / offline notes), Layer 1+2 dispatch tables, critic gate + rewrite loop with named re-dispatch, chain position, re-run triggers, skill deference: see [`dispatch-mechanics.md`](./dispatch-mechanics.md).

---

## Quality Gate — full checklist

Before delivering, the **critic agent** verifies:

- [ ] Growth motion explicitly stated (PLG / SLG / Hybrid)
- [ ] 3-5 pillars, each with ICP evidence
- [ ] 3+ angles per pillar, each passing 3Q test and scored ≥15/25
- [ ] All 9 channels evaluated (selected or explicitly skipped with rationale)
- [ ] Each selected channel has ONE specific angle (not a content category)
- [ ] Channel selection based on ICP habitat data AND growth motion alignment
- [ ] Channel execution briefs present for every selected channel
- [ ] Offline channels (if selected) include compliance and execution notes
- [ ] Timeline has 3 phases with realistic cadence (matched to declared team capacity)
- [ ] Launch sequence follows ORB (Owned → Rented → Borrowed)
- [ ] Budget allocation present per selected channel (when budget tier declared)

Full 11-row Quality Gate Checklist + 4 Internal Consistency Checks + 9-row Rewrite Routing live in [`../../agents/critic-agent.md`](../../agents/critic-agent.md). Max 2 rewrite cycles per critic verdict.

### Soft check — Social-media grounding

When **Social media** is a selected channel, its Channel Execution Brief should be grounded in `references/platform-channels.md` → the `references/_shared/platform-intelligence/` catalog (§2 Format Constraints, §3 Algorithm Signals, §6 CTA Placement Norms). An ungrounded Social-media brief — or one grounded in a stale (>90-day) catalog file — ships `done_with_concerns`, flagged in the artifact. It never blocks the plan.

### Soft check — Creative-direction inheritance

When `docs/forsvn/canonical/marketing/CREATIVE-DIRECTION.md` exists, the `## Creative Direction` section must **inherit and tune** it, not re-derive or contradict it: cite the house CD + version, carry its movements/light/palette unchanged, and express only campaign-specific deltas (movement lead, season, platform emphasis, hero concept, per-channel cues). A campaign art call that contradicts a house-CD element (new palette, off-world light, a betrayed house anti-pattern) ships `done_with_concerns` with the conflict named. When no house CD exists, the section is a one-line deferral note ("run `create-brand` to add the house layer") and the plan ships `done_with_concerns`. Never fabricate a brand world in the campaign plan. Never blocks.

---

## Single-agent fallback

If multi-agent dispatch is unavailable (no Agent tool, `--fast` mode, or orchestrator-internal mode), execute the chain sequentially in-context using the same logic each agent would apply. Ships as `DONE_WITH_CONCERNS` with a note: "Ran in single-agent mode; rerun with multi-agent dispatch for critic gate + named-agent rewrite loop." Full steps: `dispatch-mechanics.md` § "Single-agent fallback".
