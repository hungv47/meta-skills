<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
title: Thin Critic Rubric — minimal critic gate pattern for standard-tier skills
lifecycle: canonical
status: stable
produced_by: meta-skills (authored once; consumed by skills with lightweight critic gates)
provenance:
  extracts_from: marketing-skills/skills/copywriting/SKILL.md § "Quality Gate" (8-bullet checklist pattern), contrast with references/_shared/shared-critic-rubrics.md (full multi-dim library)
  extracted_at: 2026-05-16
consumers: skills with budget=standard that need a critic gate but not the full rubric library
load_class: PLAYBOOK
---

# Thin Critic Rubric

**The lightweight critic gate pattern. Three dimensions, a checklist, and explicit auto-fail conditions. For skills that need a critic gate but don't need the [full multi-dim rubric library](shared-critic-rubrics.md).**

Use thin when the critic's job is "does this clear a floor?" not "score this on 6 calibrated dimensions." A thin critic is fast, deterministic, and pairs naturally with `standard`-budget skills. When in doubt, start thin and escalate to the full library only when the floor-check stops catching real failures.

---

## When thin is the right shape

**Use thin when ALL apply:**
- Skill budget is `standard` (or `fast` with critic explicitly retained)
- The artifact's quality bar is well-defined as a small set of binary or 3-tier checks
- Operator wants critic verdict in ≤2 lines (PASS / REVISE / BLOCK) not a 6-dim scorecard
- The skill runs ≥3 times per week in steady state (cost of full critic per-run is non-trivial)

**Use the [full rubric library](shared-critic-rubrics.md) instead when ANY apply:**
- Skill budget is `deep` and quality is the primary value
- Claims / protected tokens / audience-fit need to be scored on calibrated tiers
- Multiple skill outputs need cross-comparison ranking (rubric scores enable sort)
- The skill ships to multiple operators with different bars (calibrated rubric travels)

---

## The thin pattern (3-dim rubric + checklist + auto-fail)

A thin critic has three parts:

### Part 1 — Three dimensions (always 3, never more)

Pick the three dimensions that *most* matter for the artifact type. Default trio for content/copy:

| Dim | What it checks | Pass threshold |
|---|---|---|
| **Specificity** | Concrete nouns, named entities, numbers, proof — no abstract filler | 0 abstract-filler instances |
| **Stop-power** | Pattern-interrupt, hook strength, scroll-stop signal in first sentence | ≥1 specific pattern-break per opener |
| **Alignment** | Brand voice + audience fit + claim accuracy match upstream contracts | 0 voice drift, 0 unsourced claims |

For non-content artifacts, swap dimensions but keep the count at 3. Examples:
- Code artifact: **Correctness** / **Reuse-of-existing** / **No-bloat**
- Brief artifact: **Hypothesis-clarity** / **Audience-specific** / **Falsifiable-success-criterion**
- Eval artifact: **Metric-soundness** / **Sample-sufficient** / **Counterfactual-considered**

**Why exactly 3?** Two dimensions miss too much. Four+ dimensions start to overlap and inflate PASS-with-caveats verdicts. Three forces sharpness without combinatorial scoring overhead.

### Part 2 — Checklist (concrete pass conditions)

Below the 3-dim rubric, a 5-8 item checklist of pass conditions. Each item is binary (pass/fail), explicit, and verifiable in seconds. Example (copywriting's gate, abridged):

```
Quality Gate — PASS requires ALL:
- [ ] Every key line passes Three-Question Test (visual? falsifiable? uniquely ours?)
- [ ] Rubric avg ≥3.5 across V/F/U for all key lines
- [ ] Competitor Swap Test passed (swap in competitor name — copy still works → rewrite)
- [ ] CTA follows formula: [action verb] + [what they get] (not "Learn More")
- [ ] Every headline contains concrete nouns or specific numbers
- [ ] 3-5 variations generated per key line; top 2-3 presented
```

Checklist items operationalize the rubric. The rubric is "what we score on"; the checklist is "what we verify before we score."

### Part 3 — Auto-fail conditions (non-negotiable)

A short list (3-5 items) of conditions where the critic skips scoring and returns BLOCK immediately:

- Missing required input (brand context, audience definition, prior cycle context for loops)
- Protected token violation (a name / price / URL / claim was changed or dropped)
- Hard policy gate failure (claims compliance, safety check)
- Frontmatter contract violation per `artifact-contract-template.md`

Auto-fails are how the critic refuses to play "PASS-with-caveats" theater on broken inputs. If an auto-fail fires, no PASS is possible — operator fixes the upstream issue or the skill is the wrong tool.

---

## Worked example — copywriting's thin critic

The full quality gate already implements this pattern. Annotated mapping:

```
Quality Gate                                    | Thin Critic part
-----------------------------------------------|------------------
Three-Question Test (visual / falsifiable      | Dim 1: Specificity
  / uniquely ours)                              |
Hook + body airtight argument                  | Dim 2: Stop-power + Alignment
Rubric V/F/U avg ≥3.5                          | Threshold for Dim 1
Competitor Swap Test                           | Checklist item
CTA formula                                    | Checklist item
Concrete nouns or specific numbers             | Checklist item (operationalizes Dim 1)
3-5 variations per key line                    | Checklist item (process gate)
```

The 8-bullet checklist isn't 8 dimensions — it's 3 dimensions scored via 8 verifiable conditions.

---

## Verdict format

Every thin critic returns exactly one of:

- **PASS** — all 3 dimensions hit threshold, all checklist items checked, no auto-fail. Ship.
- **REVISE** — ≥1 dimension below threshold OR ≥1 checklist item failed. Critic names which + why; skill iterates.
- **BLOCK** — auto-fail fired. Critic refuses to score; surface to operator with the violated condition.

Do not invent verdicts like `PASS_WITH_CAVEATS`, `CONDITIONAL_PASS`, or `PASS_BUT_MONITOR`. Those are sycophancy in verdict clothing — see [[anti-sycophancy]] § "PASS-with-caveats inflation."

---

## How skills cite this ref

**In SKILL.md "Quality Gate" or "Critic" section:**

```
Critic gate per `references/_shared/thin-critic-rubric.md`. Three dimensions:
1. <dim 1 name> — <threshold>
2. <dim 2 name> — <threshold>
3. <dim 3 name> — <threshold>

Checklist:
- [ ] <condition 1>
- [ ] <condition 2>
...

Auto-fail: <condition>, <condition>, <condition>.
Verdict: PASS / REVISE / BLOCK only.
```

**Do NOT** invent a 4th or 5th dimension. If the trio doesn't catch a real failure mode, escalate to the full rubric library — don't bloat thin.

---

## Anti-patterns

1. **Dimension creep.** Thin is 3 dimensions; if you find yourself adding a 4th, either fold it into an existing dim or escalate to the full library. The discipline is what makes thin fast.
2. **PASS-with-caveats verdict.** If caveats matter, the verdict is REVISE. Caveats inside a PASS are how mediocre work ships.
3. **Auto-fail as checklist item.** Auto-fail is severance, not a soft check. Listing "claims compliance" inside the 6-item checklist means it gets evaluated like any other item; promoting it to auto-fail means a violation stops the critic cold.
4. **Checklist without rubric.** Pure checklist with no dimensions = a checkbox dance; can't compare quality across runs. Rubric without checklist = "score on dim 1" with no verifiable criteria. Always both.
5. **Critic in a `fast`-tier skill without explicit retention.** `--fast` skips critic gates by default. If a skill needs the critic even in fast mode, the SKILL.md must state "critic gate retained under --fast because <reason>" — and the gate must be cheap enough to honor that.
6. **Re-running the critic when REVISE is returned.** The critic verdict is the verdict. If the skill loops back through the critic after REVISE without fixing the named issue, that's gaming. Fix the issue first.

---

## Related refs

- [[shared-critic-rubrics]] — full multi-dim rubric library (escalate to this when thin isn't catching real failures)
- [[anti-sycophancy]] — why PASS-with-caveats inflation is the failure mode to watch
- [[quality-feedback-protocol]] — how thin-critic verdicts feed back into the quality dashboard
- [[mode-resolver]] — what `--fast` does (and does not) skip vs. the critic gate
