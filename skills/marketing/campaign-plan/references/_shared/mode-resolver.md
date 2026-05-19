<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
title: Mode Resolver — execution-tier contract for skill invocations
lifecycle: canonical
status: stable
produced_by: meta-skills (authored once; consumed by every skill)
provenance:
  extracted_from: agent-skills/CLAUDE.md § "Complexity Routing"
  extracted_at: 2026-05-16
consumers: every skill that branches behavior by budget or honors `--fast`
load_class: PLAYBOOK
---

# Mode Resolver

**Single source of truth for how `fast` / `standard` / `deep` resolves at invocation time, what `--fast` does (and does not) skip, and how upward/downward overrides interact.**

Every skill declares a `budget` tier in its frontmatter. This file defines what that tier *means at execution* and how the operator's flags / phrases / context shape the resolved mode. Skills cite this file rather than re-explaining the contract.

---

## Budget tiers (what each tier dispatches)

| Budget | Execution | Skills at this tier |
|--------|-----------|---------------------|
| **fast** | Single-agent, no sub-agent spawning, no critic gate. Respond directly. | `discover`, all `orchestrate-*` (meta, research, marketing, product) |
| **standard** | Reduced orchestration. Essential agents only, one critic pass. Skip optional refinement agents. | `humanize`, `vn-tone`, `design-brief`, `user-flow`, `docs-writing`, `agents-panel`, `task-breakdown`, `fresh-eyes`, `cleanup-artifacts`, `social-copy`, `short-form-eval`, `funnel-planner` |
| **deep** | Full orchestration as documented. All layers, all agents, full critic gate. | `copywriting`, `ad-copy`, `campaign-plan`, `brand-system`, `seo`, `lp-brief`, `lp-optimization`, `cold-outreach`, `short-form-brief`, `system-architecture`, `code-cleanup`, `machine-cleanup`, `diagnose`, `icp-research`, `market-research`, `prioritize`, `short-form-research` |

A skill's `budget:` field is its **default tier** — never a ceiling, never a floor. Auto-downgrade heuristics and operator overrides shift the resolved mode at invocation.

---

## Auto-downgrade heuristics (apply before dispatching agents)

- Input is ≤3 sentences AND doesn't reference prior artifacts AND skill budget is not `deep` → treat as `fast`.
- Single-topic request with clear scope and no cross-domain needs → cap at `standard`.
- References multiple artifacts, is cross-domain, or is ambiguous → use full skill tier.

These are heuristics, not rules. Operator overrides win (next section).

---

## Override — bidirectional escape hatches

Auto-downgrade is heuristic; the operator's intent wins. Both directions are available on any tier.

**Upward (force deeper).** Phrases like "run this thoroughly", "full analysis", "deep mode" → ignore auto-downgrade and use the full documented skill tier even on trivially-shaped input.

**Downward (force faster — `/skill --fast`).** `--fast` flag on the slash command, OR phrases "fast mode", "quick pass", "skip the orchestration" anywhere in the same turn → force **single-agent execution regardless of skill budget and auto-downgrade**. No sub-agents, no critic gate, no rewrite loops, no warm-start Pre-Dispatch interrogation. The skill produces its core deliverable in one pass.

End-of-response acknowledgement when `--fast` fired:
> Ran in --fast mode; rerun without the flag for full critique.

Use `--fast` when you want a first pass and accept reduced rigor (no critic, no rubric scoring, no multi-perspective).

---

## What `--fast` does NOT skip

`--fast` skips orchestration weight, not correctness floor. Two contracts are inviolable:

**1. Cold Start.** When no context is resolvable from artifacts or `skills-resources/experience/`, the skill still asks its bundled cold-start questions. `--fast` only bypasses multi-agent orchestration *after* context is resolved — it does not authorize hallucinating against missing audience / business / brand decisions.

**2. Safety gates.** Hard-gated skills enforce gates regardless of `--fast`. Examples of hard gates that supersede the flag:
- `design-brief` / `lp-brief` → brief-without-brand-system block
- `ad-copy` → policy + claim-substantiation format-checker
- `user-flow` → platforms + surfaces required
- `code-cleanup` → 5 golden rules

The contract is **"skip the heavy lift, not the guardrails."** A skill that quietly drops its safety gate when `--fast` fires is broken — file it as a bug.

---

## Load-class behavior under `--fast`

Per the [playbook-ref pattern](playbook-ref-template.md), body cites carry load-class tags. `--fast` shapes which classes load:

| Load class | Behavior under `--fast` |
|---|---|
| `[PLAYBOOK]` | Still loads on cold start (humans + cold agents need the "why"). Skipped on warm start under `--fast` (agent already has context). |
| `[PROCEDURE]` | Skipped under `--fast` — the procedure is what `--fast` is bypassing. Skill produces deliverable in one pass instead. |
| `[EXAMPLE]` | Skipped under `--fast` — examples are triangulation anchors, costs more than they're worth in fast mode. |
| `[ANTI-PATTERN]` | Skipped under `--fast` because critic gate is skipped (anti-patterns load at critique time). |

If a skill body has cites without load-class tags, `--fast` treats them as `[PROCEDURE]` (skipped). Tag your cites or they get skipped.

---

## Conflict resolution

| Conflict | Resolution | Why |
|---|---|---|
| `--fast` on a `fast`-tier skill | No-op | Skill already runs single-agent |
| `--fast` + "run thoroughly" same turn | `--fast` wins | Explicit flag beats prose phrase |
| `--fast` + `--deep` (two explicit flags) | `--fast` wins | Downward bias on conflicting explicit signals; opt back into depth by re-invoking without `--fast` |
| Operator says "fast" but skill is in a safety-gated branch | Safety gate fires; rest of skill runs `--fast` | See "What `--fast` does NOT skip" |

---

## How skills cite this ref

**In SKILL.md body** (when execution branches by mode):

```
[See `references/_shared/mode-resolver.md` for the --fast contract and what it does NOT skip.]
```

**In SKILL.md "Pre-Dispatch" sections** (when warm vs cold-start paths differ):

```
Mode resolution per `_shared/mode-resolver.md`: if `--fast` flag or phrase detected,
skip Layer-2 dispatch but still run Cold Start questions if context isn't resolvable.
```

**Do NOT inline the contract.** The point of this ref is single-source-of-truth. If you find yourself copying tier definitions or the `--fast` rules into a SKILL.md body, replace with a cite.

---

## Anti-patterns

1. **Silent mode flip.** Skill resolves to `fast` and dispatches differently but never tells the operator. Always echo the resolved mode in the first response line when it differs from the skill's default budget.
2. **Safety-gate erosion.** `--fast` branch quietly skips a hard gate "because it's faster." Hard gates are non-negotiable — `--fast` doesn't authorize bypass.
3. **Cold Start skipped in warm-start illusion.** Skill assumes context is present because the operator's prompt is long. Length ≠ resolved context. Run the cold-start check against `skills-resources/experience/` and artifacts, not against prompt verbosity.
4. **Auto-downgrade applied after dispatch.** Heuristics are pre-dispatch only. Once agents are spawned, the resolved mode is locked.
5. **Re-litigating tier on every invocation.** The skill's `budget:` frontmatter is the default. Heuristics + flags shift it per-invocation. Don't change the frontmatter to "fix" misroutes — fix the heuristic application instead.

---

## Related refs

- [[pre-dispatch-protocol]] — what each tier does for the Pre-Dispatch interrogation step
- [[shared-critic-rubrics]] — critic gate that `--fast` skips
- [[quality-feedback-protocol]] — how `--fast` runs report their reduced-rigor status
