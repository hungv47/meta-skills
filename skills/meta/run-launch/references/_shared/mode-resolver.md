<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

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
| **fast** | Single-agent, no sub-agent spawning, no critic gate. Respond directly. | `forsvn`, `discover` |
| **standard** | Reduced orchestration. Essential agents only, one critic pass. Skip optional refinement agents. | `humanmaxxing`, `polish-vn`, `brief-graphic`, `map-user-flow`, `write-docs`, `debate-agents`, `breakdown-tasks`, `review-work`, `clean-artifacts`, `write-social`, `evaluate-shortform`, `plan-funnel`, `run-pipeline`, `event-runofshow`, `produce-ooh`, `design-minigame`, `measure-results` |
| **deep** | Full orchestration as documented. All layers, all agents, full critic gate. | `write-copy`, `write-ad`, `plan-campaign`, `create-brand`, `optimize-seo`, `brief-landing-page`, `evaluate-landing-page`, `write-outreach`, `brief-shortform`, `architect-system`, `clean-code`, `clean-machine`, `diagnose`, `research-icp`, `research-market`, `prioritize`, `research-shortform` |

A skill's `budget:` field is its **default tier** — never a ceiling, never a floor. Auto-downgrade heuristics and operator overrides shift the resolved mode at invocation.

---

## Compactness caps (SKILL.md body, by tier)

SkillOpt's empirical finding (arXiv:2605.23904v2 §4.4): trained skills are uniformly compact — final `best_skill.md` ranges from 379 to 1,995 tokens with **median ~920**. Bloated skill bodies are not a sign of effort; they are a signal that procedural rules and reference material have not been separated. Each tier carries a body-token cap that `_dev/audit-skill-budget.ts --enforce-caps` enforces in the pre-merge gate.

| Budget | Body cap (estimated tokens, chars ÷ 4) | Rationale |
|---|---:|---|
| **fast** | 800 | A single-agent, one-pass skill should fit on one screen. If a `fast` skill needs more than 800 tokens of body, either it is not actually `fast` (re-classify) or content belongs in `references/`. |
| **standard** | 1,500 | One critic pass, reduced orchestration. Procedural rules + critic checklist + completion contract should fit comfortably. |
| **deep** | 2,500 | Full orchestration, multi-agent. Caps the orchestrator body, NOT sub-agent prompts or reference docs. If a `deep` skill exceeds the cap, the next refactor extracts the longest section into `references/`. |

**What the cap measures.** Body chars (excluding frontmatter) divided by 4. Same heuristic the existing `audit-skill-budget.ts` already reports.

**What the cap does NOT measure.** Token cost of `references/`-cited material (loaded on demand), agent prompts (separate files), routing.yaml (separate surface). The cap is the on-trigger context cost when a skill activates and its SKILL.md body is read into the model context — that is the cost paid every invocation.

**Exception protocol.** A skill that legitimately exceeds its cap must document the exception inside the SKILL.md body with a `<!-- BUDGET_EXCEPTION: <reason> -->` comment immediately under the H1. The pre-merge gate logs exceptions but does not fail on them. Repeat offenders become refactor targets.

---

## Auto-downgrade heuristics (apply before dispatching agents)

- Input is ≤3 sentences AND doesn't reference prior artifacts AND skill budget is not `deep` → treat as `fast`.
- Single-topic request with clear scope and no cross-domain needs → cap at `standard`.
- References multiple artifacts, is cross-domain, or is ambiguous → use full skill tier.

These are heuristics, not rules. Operator overrides win (next section).

---

## Session execution profile — the model axis

The session carries an explicit single-vs-multi-agent choice with a model-aware default,
resolved once per session and inherited by every dispatch. Owner of the ask, the
substrate (`.forsvn/routing/execution-profile.json`), model detection, staleness, and
the exemption class: `execution-policy.md` (same references/ dir; `_shared/` mirror in
consuming skills). This file stays the owner of tiers, `--fast`, and auto-downgrade.

**Where the profile sits in precedence** (highest wins):

1. Per-invocation flags/phrases — `--fast` and upward phrases (next section). One run only; never rewrites the profile.
2. Session profile — `agents: single|multi` from `execution-profile.json`.
3. Model-aware default — capable/expensive model → single; smaller model → multi (table in `execution-policy.md`).
4. Skill `budget:` default — the tier table above.

Reconciliation: a `single` profile has the same execution semantics as `--fast`'s
single-agent collapse — **"skip the heavy lift, not the guardrails"** (see "What
`--fast` does NOT skip"). Auto-downgrade heuristics apply only within `multi` mode;
under `single` they are moot. An upward phrase outranks a `single` profile for that
one invocation — announce it, don't rewrite the profile.

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

**1. Cold Start.** When no context is resolvable from artifacts or `docs/forsvn/experience/`, the skill still asks its bundled cold-start questions. `--fast` only bypasses multi-agent orchestration *after* context is resolved — it does not authorize hallucinating against missing audience / business / brand decisions.

**2. Safety gates.** Hard-gated skills enforce gates regardless of `--fast`. Examples of hard gates that supersede the flag:
- `brief-graphic` / `brief-landing-page` → brief-without-brand-system block
- `write-ad` → policy + claim-substantiation format-checker
- `map-user-flow` → platforms + surfaces required
- `clean-code` → 5 golden rules

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
3. **Cold Start skipped in warm-start illusion.** Skill assumes context is present because the operator's prompt is long. Length ≠ resolved context. Run the cold-start check against `docs/forsvn/experience/` and artifacts, not against prompt verbosity.
4. **Auto-downgrade applied after dispatch.** Heuristics are pre-dispatch only. Once agents are spawned, the resolved mode is locked.
5. **Re-litigating tier on every invocation.** The skill's `budget:` frontmatter is the default. Heuristics + flags shift it per-invocation. Don't change the frontmatter to "fix" misroutes — fix the heuristic application instead.

---

## Related refs

- [[execution-policy]] — the session execution profile: the bundled ask, the substrate, model detection, staleness, exemptions
- [[pre-dispatch-protocol]] — what each tier does for the Pre-Dispatch interrogation step
- [[shared-critic-rubrics]] — critic gate that `--fast` skips
- [[quality-feedback-protocol]] — how `--fast` runs report their reduced-rigor status
