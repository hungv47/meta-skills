---
title: Platform Evidence Research — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: research-platform
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** Layer 1 or Layer 2 dispatch begins. Mechanics for spawning sub-agents per the orchestrator's Agent Manifest.

---

## How to spawn a sub-agent

For each agent dispatched, use the **Agent tool** with a prompt built as follows:

1. **Read** the agent instruction file — include its FULL content in the Agent prompt
2. **Append** the brief, context, and (for Layer 2 agents) the concatenated upstream outputs
3. **Resolve paths to absolute**: replace relative reference paths with absolute paths rooted at this skill's directory
4. **Pass supplied evidence by excerpt**: the orchestrator holds the operator's pasted exports; it routes each platform's evidence only to that platform's evidence-intake-agent instance — sub-agents do not re-read the conversation
5. If **feedback** exists (a critic FAIL cycle), append it at the end under the header "## Critic Feedback — Address Every Point"

## Single-agent fallback

If multi-agent dispatch is unavailable, execute each agent's instructions sequentially in-context. Output quality is equivalent — the multi-agent pattern optimizes parallelism, not capability. The Critical Gates and the 5-rubric critic still apply.

## Layer 1: Parallel Intake + Benchmark

Spawn **IN PARALLEL** (multiple Agent tool calls in one message).

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| evidence-intake-agent × N | `agents/evidence-intake-agent.md` | `{ platform, account_scope, metrics_window_date, algorithm_context_date }` + that platform's supplied evidence + any `prior_eval` excerpts | `references/platforms/[platform].md`, `references/evidence-protocol.md`, `references/_shared/confidence-labeling.md` |
| benchmark-agent | `agents/benchmark-agent.md` | `{ platforms, account_scope, algorithm_context_date, niche_hint }` | `references/platforms/[platform].md` for each in-scope platform |

**Number of evidence-intake instances** = count of in-scope platforms (1–5). A platform the operator supplied no evidence for still gets an instance — it returns a `NO_EVIDENCE` record with a populated Evidence Gaps section. Do not silently drop it.

## Layer 2: Sequential Synthesis → Recommendation → Critic

Run sequentially. Each agent receives all upstream outputs.

| Agent | Instruction File | Inputs | Reference Files |
|-------|-----------------|--------|-----------------|
| synthesis-agent | `agents/synthesis-agent.md` | All evidence-intake records + benchmark context | `references/platforms/`, `references/format-conventions.md` |
| recommendation-agent | `agents/recommendation-agent.md` | The synthesis-agent artifact (TL;DR + Recommendations still placeholders) | `references/scoring-rubrics.md`, `references/_shared/confidence-labeling.md` |
| critic-agent | `agents/critic-agent.md` | The complete artifact from recommendation-agent | `references/scoring-rubrics.md`, `references/anti-patterns.md` |

synthesis-agent writes every section except the TL;DR and Recommendations, leaving both as placeholders. recommendation-agent fills those two and returns the complete artifact. critic-agent gates the whole.

## Critic Routing

Critic returns one of:

- **PASS** → deliver the artifact as `done`
- **FAIL with named rubrics** → re-dispatch the source agent(s) with feedback. Routes:
  - Rubric 1 (Evidence Citation) FAIL → synthesis-agent (re-attach tags) OR evidence-intake-agent (capture missing provenance)
  - Rubric 2 (Source-Type Honesty) FAIL → evidence-intake-agent
  - Rubric 3 (Coverage-Flag Accuracy) FAIL → evidence-intake-agent (re-flag) + recommendation-agent (if a NO_EVIDENCE platform carried a recommendation)
  - Rubric 4 (Recommendation Completeness) FAIL → recommendation-agent
  - Rubric 5 (Freshness) FAIL → synthesis-agent (surface the flags) OR evidence-intake-agent (missing `measured_at`)

**Loop cap:** 2 cycles. After cycle 2, ship `done_with_concerns` with the failed rubrics' evidence pinned at the top of the artifact.

## Post-write side effects

On PASS or `done_with_concerns`, the orchestrator:

1. Writes the artifact to `docs/forsvn/artifacts/research/platform-evidence/[slug].md`
2. Runs `bun scripts/manifest-sync.ts` so the artifact indexes into `.forsvn/index/`
3. Writes back to `docs/forsvn/experience/content.md` per the Pre-Dispatch Write-back map

## Chain Position

Previous: `research-icp` (optional — supplies the niche/audience context for benchmark cohorts); `run-pipeline` / `evaluate-*` (optional — their eval artifacts feed `prior_eval` evidence).

Next: `write-social`, `optimize-seo`, `research-shortform`, `evaluate-content`, `evaluate-shortform`, `publish-social` — each reads Per-Platform Evidence + Recommendations to ground a decision in measured performance.

**Re-run triggers:**
- `metrics_window_date` >60d old (warn — performance numbers have decayed)
- `algorithm_context_date` >180d old (warn — platform-mechanic context has decayed)
- New evidence available (a fresh analytics export, a completed eval cycle)
- Account-scope change, or a platform added to the operator's mix

**Skill deference:**
- "What's working in the wild" (public hook/format discovery) → `research-shortform`
- Competitive landscape, market sizing → `research-market`
- Audience research → `research-icp`
- Scoring one published post/campaign against its brief → `evaluate-content` / `evaluate-shortform` (their output can feed back as `prior_eval`)
