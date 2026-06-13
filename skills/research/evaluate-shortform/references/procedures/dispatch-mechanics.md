---
title: Short-Form Eval — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: short-form-eval
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** Layer 1 or Layer 2 dispatch begins. Mechanics for spawning sub-agents per the orchestrator's Agent Manifest.

---

## How to spawn a sub-agent

For each agent dispatched, use the **Agent tool** with a prompt built as follows:

1. **Read** the agent instruction file — include FULL content in the Agent prompt
2. **Append** brief, post-URL fetched content, and the matched catalog excerpt as context
3. **Resolve paths to absolute**: replace relative reference paths with absolute paths rooted at this skill's directory
4. **Pass references by excerpt**: orchestrator reads `references/rubric.md` once and includes the relevant dimension's body in eval-runner-agent's context — sub-agents do not re-read
5. If **feedback** exists (critic FAIL cycle), append at end with header "## Critic Feedback — Address Every Point"

## Single-agent fallback

If multi-agent dispatch is unavailable, execute each agent's instructions sequentially in-context. Output quality is equivalent — multi-agent pattern optimizes parallelism, not capability.

## Layer 1: Parallel Hook Check + Rubric Run

Spawn **IN PARALLEL** (multiple Agent tool calls in one message).

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| Hook Strength Agent | `agents/hook-strength-agent.md` | `{ post_url, brief_excerpt, catalog_hook_archetypes }` | `references/rubric.md` (dimension: hook-strength-vs-platform-intel) |
| Eval Runner Agent | `agents/eval-runner-agent.md` | `{ post_url, brief, catalog_excerpt, cycle_index }` | `references/rubric.md` (full) |

## Layer 2: Sequential Pattern + Critic

Run sequentially. Each agent receives all upstream outputs.

| Agent | Instruction File | Inputs | Reference Files |
|-------|-----------------|--------|-----------------|
| Pattern Extractor | `agents/pattern-extractor-agent.md` | All Layer 1 outputs | `references/rubric.md` (dimension: pattern-log-entry-shape) |
| Critic Agent | `agents/critic-agent.md` | Pattern Extractor output + raw Layer 1 outputs | `references/rubric.md`, `references/anti-patterns.md` |

## Critic Routing

Critic returns one of:

- **PASS** → write artifact as `done`
- **FAIL with named sections** → re-dispatch the source agent(s) with feedback. Common routes:
  - Citation FAIL → back to eval-runner or hook-strength (capture missing URL/screenshot reference)
  - Score-justification FAIL → eval-runner (rewrite justification to be falsifiable)
  - Pattern-block-shape FAIL → pattern-extractor (re-author with claim/evidence/refutability/expiry shape)
  - Cycle-1-weighting FAIL → eval-runner + pattern-extractor (rebalance prose vs score)

**Loop cap:** 2 cycles. After cycle 2, ship `done_with_concerns` with failed rubrics pinned at top of artifact.

## Post-write side effects

After the critic returns PASS (or cycle 2 ships `done_with_concerns`):

1. Write artifact to `.forsvn/loops/[slug]/evals/[YYYY-MM-DD]-cycle-N.md`.
2. Append row to `.forsvn/loops/[slug]/results.tsv` via `bun scripts/append-loop-result.ts` (validates header schema; rejects schema drift).
3. Call `bun scripts/manifest-sync.ts` so `.forsvn/index/manifest.json` indexes the new cycle artifact.

Skipping step 2 breaks the loop's ledger; skipping step 3 makes the cycle invisible to future state-detection by `forsvn` and `forsvn`. Both are mandatory.

## Chain Position

Previous: `brief-shortform` (marketing-skills, the brief whose post is being scored) and `research-shortform` (the catalog whose patterns are the reference)
Next: pattern-log entries are read by future `research-shortform` re-runs and (eventually) by gap-gate analysis.

**Re-run triggers:**
- New post published from the same brief tier — run a fresh cycle
- Cycle 2-3 boundary — operator runs the rubric revision pass (v0.1 → v0.2)
- Catalog refresh in `research-shortform` — re-score prior cycles against the new reference (optional)

## Skill deference

- No platform-intel catalog exists → `research-shortform` first (BLOCKED if missing — eval against missing reference is meaningless)
- Pre-publish brief authoring → `brief-shortform` (different job, marketing-skills)
- Multi-post campaign rollup → out of scope for v0.1; one post per cycle
- No loop workspace → `run-pipeline` to create one first
