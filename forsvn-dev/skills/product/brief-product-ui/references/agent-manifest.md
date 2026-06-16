# Brief-Product-UI Agent Manifest

Loaded by the orchestrator at dispatch entry. Source of truth for the **agent roster**;
the critic's rubric SoT is [`procedures/gates-and-rubric.md`](procedures/gates-and-rubric.md).

## Agents (7)

| Agent | Layer | File | Single focus |
|---|---|---|---|
| Intake Validator | 0 (gate) | `agents/intake-validator-agent.md` | Hard gate: a parseable `map-user-flow` artifact is present; DESIGN/BRAND tokens located or `brand_source: cold-start-hint` flagged. Blocks all downstream work if the flow is missing. |
| Screen Inventory | 1 (∥) | `agents/screen-inventory-agent.md` | Flow → enumerated screen + state list. **No invented screens** — every entry traces to a flow screen/state/edge. |
| Component System | 1 (∥) | `agents/component-system-agent.md` | Component taxonomy + cross-screen reuse map + composition hierarchy. Bounded primitive count. |
| Token Application | 1 (∥) | `agents/token-application-agent.md` | DESIGN/BRAND tokens → per-surface, per-state application decisions. No raw hex/px. Honors brand rules or flags cold-start. |
| Layout & State | 2 (seq) | `agents/layout-state-agent.md` | Per-surface grid / spacing rhythm / density / responsive behavior **and** per-component state set (default/hover/active/focus/disabled) + motion + empty/loading/error visual treatments. |
| Handoff | 3 (seq) | `agents/handoff-agent.md` | Upstream tool-redirect choice + terminal execution-fork block + a buildable prompt per target engine. **Spec, never a render.** |
| Critic | 4 (gate) | `agents/critic-agent.md` | Runs the 8-checkpoint rubric (CP-01…CP-08), binary PASS/FAIL each. Produces feedback; re-dispatches named agents. Max 2 rewrite cycles. |

**Why 7 agents:** the three Layer-1 concerns (what screens, what components, what tokens) are
independent and parallelize cleanly; layout + state are one sequential concern (state visuals
depend on the layout they sit in); handoff is terminal; the critic is the gate. Splitting layout
from state, or token from component, adds merge collision risk without adding coverage — the
8-CP critic enforces both halves regardless of agent boundaries. `--fast` collapses Layer 1 to a
single-pass agent per `references/_shared/mode-resolver.md`; **the intake gate and the critic
never collapse.**

## Dispatch Graph

```
intake-validator-agent (hard gate: flow present + parseable; tokens located/flagged)
  → L1 ∥ { screen-inventory-agent · component-system-agent · token-application-agent }
  → Merge (orchestrator assembles the three into one working spec)
  → layout-state-agent  (grid/spacing/density/responsive + per-state visual treatments)
  → handoff-agent       (tool-redirect upstream + execution-fork terminal + per-engine prompt)
  → critic-agent        (8-CP rubric)
       PASS → write artifact (review_surface: html, decision_state: pending)
       FAIL → re-dispatch named agent(s) with feedback (max 2 cycles) →
              after 2 FAILs ship status: DONE_WITH_CONCERNS with critic annotations
```

## Input Contract (every agent)

Per `agents/_template.md`: `brief`, `pre-writing` (feature, flow path, brand source, target
engine), `upstream` (null for Layer-1 parallel agents; the merged spec for layout/handoff/critic),
`references` (absolute paths the orchestrator resolves), `feedback` (null until a critic rewrite).
