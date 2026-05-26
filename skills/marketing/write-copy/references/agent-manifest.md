# Write-Copy Agent Manifest

Loaded by the orchestrator when entering Layer 1 dispatch (Route B) or when
the critic re-dispatches a named agent.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Hook Agent | 1 (parallel) | `agents/hook-agent.md` | Headlines, hooks, taglines, subject lines — Argument Engineering lead plus 3-5 variations with 3Q scoring |
| Body Agent | 1 (parallel) | `agents/body-agent.md` | Problem / Solution / How It Works or 6 Necessary Beliefs architecture |
| CTA Agent | 1 (parallel) | `agents/cta-agent.md` | CTA variations per placement with risk reversal |
| Social Proof Agent | 1 (parallel) | `agents/social-proof-agent.md` | Testimonials, stats, logos, credibility signals, Discovery Story |
| Variant Agent | 1.5 (post-merge) | `agents/variant-agent.md` | A/B alternatives for key sections |
| Voice Agent | 2 (sequential) | `agents/voice-agent.md` | Clarity + brand voice consistency, AI slop removal |
| Psychology Agent | 2 (sequential) | `agents/psychology-agent.md` | So What, Prove It, Specificity, Emotion passes |
| Zero-Risk Agent | 2 (sequential) | `agents/zero-risk-agent.md` | Barrier removal, guarantees, exit grace |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Rubric scoring, 3Q test, annotation, PASS/FAIL routing |

## Shared References (read by multiple agents)

| Reference | Consumed by | Notes |
|---|---|---|
| `references/headline-formulas.md` | hook-agent | Includes objection-to-hook patterns. |
| `references/page-sections.md` | body-agent, social-proof-agent | Section-order tables and narrative-vs-direct-response variants. |
| `references/emotional-triggers.md` | psychology-agent, hook-agent, critic-agent | Trigger-density rubric. |
| `references/belief-disruption.md` | psychology-agent, hook-agent | TOF only. |
| `references/lead-magnet-stack.md` | hook + social-proof + cta | DM-capture mechanics for lead-magnet posts. |
| `references/lifecycle-sequences.md` | body + cta | Abandoned-cart / post-purchase / win-back patterns. |
| `references/research-workflow.md` | Pre-Dispatch step 1 | |
| `references/discovery-story.md` | social-proof-agent | Mechanism-led trust. |
| `references/seven-sweeps.md` | voice + psychology + critic (`--seven-sweeps` / `--high-stakes`) | Names which agents own each sweep, defines back-checking protocol, canonical word-level-cut list, optional Expert Panel Scoring high-stakes mode. |

## Routing — Three Routes

```text
ROUTE A (single key line):
  1. Pre-Dispatch (per references/procedures/pre-dispatch.md)
  2. Dispatch ONE agent (hook-agent OR cta-agent)
  3. Dispatch: critic-agent
  4. Critic FAIL -> re-dispatch the original agent with feedback (max 2 cycles)
  5. Deliver annotated key lines

ROUTE B (full-page copy):
  1. Pre-Dispatch
  2. LAYER 1 — IN PARALLEL: hook + body + cta + social-proof
  3. MERGE — assemble into page structure
     (Awareness-building OR Direct-Response narrative per body-agent)
  4. Dispatch: variant-agent (on merged output)
  5. LAYER 2 — SEQUENTIAL: voice -> psychology -> zero-risk -> critic
  6. Critic FAIL -> re-dispatch named agent(s) with feedback (max 2 cycles)
  7. Deliver final artifact

ROUTE C (called by brief-landing-page or plan-campaign):
  1. Pre-Dispatch: read context from calling skill's artifacts
  2. Dispatch the Layer 1 agent(s) the caller named
  3. Dispatch: critic-agent
  4. Return annotated output to calling skill (no standalone artifact)
```

Full dispatch mechanics (how to spawn agents, single-agent fallback, Layer 1
parallel dispatch, Merge Step with both narrative section-order tables +
assembly rules + conflict resolution, variant-agent post-merge, Layer 2
sequential pipeline, critic gate + rewrite loop, chain position, skill
deference) live in
[`references/procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
