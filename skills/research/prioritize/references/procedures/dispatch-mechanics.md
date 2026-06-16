# Procedure — Dispatch Mechanics (prioritize)

> Load when SKILL.md routes to Layer 1 dispatch. Encodes Route A / Route B mechanics, Layer 1 / 1.5 / 2 spawn details, the merge step, critic gate routing, single-agent fallback, and the Out-of-Scope Persistence write-back.

---

## Route Selection (the decision tree)

| Trigger | Route | Why |
|---|---|---|
| Default — any non-trivial solution design | **A — Full Analysis** | Default route; unconventional scan adds asymmetric upside at parallel cost |
| User has identified candidate approaches; speed > breadth; OR `--fast` flag | **B — Quick Design** | Skip unconventional-agent; user wants ranking, not generation |

Echo the chosen route in the Warm Start summary (per `pre-dispatch.md`). Operator can override before dispatch.

---

## Route A — Full Analysis (default)

Dispatch graph:

```
Layer 1:        research-agent
                     ↓
Layer 1.5:      initiative-generator-agent + unconventional-agent (parallel)
                     ↓ merge + user feedback gate
Layer 2:        ranking-agent → ice-scoring-agent → cut-line-agent → critic-agent
```

### Layer 1 — research-agent

| Field | Value |
|---|---|
| **Input** | Problem statement + validated root cause from `diagnose-*.md` + gap percentages + constraints (from Constraint Interview) + prior attempts |
| **References to attach** | `references/_shared/hypothesis-framework.md` (use Framing B — Predictive); `references/initiative-types.md` |
| **Expected output** | Validated root cause restatement, 3-6 case studies with quantified results, unconventional tactic scan, constraint summary |

### Layer 1.5 — parallel spawn

Both agents spawn simultaneously after research-agent returns.

**initiative-generator-agent**

| Field | Value |
|---|---|
| **Input** | research-agent output (case studies, validated root cause, constraints) |
| **References to attach** | `references/_shared/hypothesis-framework.md`; `references/initiative-types.md`; `references/initiative-planning.md`; `references/churn-playbook.md` (only if root cause is churn) |
| **Expected output** | 5-10 standard initiatives with hypotheses, mechanics, effort sizing (S/M/L), anti-generic checks |

**unconventional-agent**

| Field | Value |
|---|---|
| **Input** | research-agent output |
| **References to attach** | `references/initiative-types.md` |
| **Expected output** | 2-4 unconventional initiatives with risk assessments |

### Layer 1.5 Merge + user feedback gate

After both agents return:

1. Combine standard + unconventional initiatives into a single numbered list (5-14 total).
2. **Verify effort mix:** ≥2 Small, ≥2 Medium, ≥1 Large across the combined list. If fails → re-dispatch initiative-generator-agent with the specific gap (e.g., "need 1 more Medium-effort initiative"). Max 1 re-dispatch.
3. **Present to user:** *"Which resonate? Any to cut immediately? Any that spark a different idea?"* Wait for feedback before proceeding.
4. Incorporate user feedback (cuts + additions + reframings) before passing to Layer 2.

The user feedback gate is non-skippable in Route A. It's the moment the operator's judgment enters before the scoring orchestration locks the ranking. Skipping it means the ICE scores reflect agent priors, not operator intent.

### Layer 2 — sequential dispatch

Run one at a time; each consumes the previous output.

**Step 1: ranking-agent**

| Field | Value |
|---|---|
| **Input** | Merged initiative list + user feedback |
| **References to attach** | `references/ice-scoring-rubric.md` |
| **Interview prompt** | *"If you could only do ONE of these, which would it be? And after that one?"* |
| **Expected output** | Strict 1-through-N forced ranking with one-sentence reasoning per rank |

**Step 2: ice-scoring-agent**

| Field | Value |
|---|---|
| **Input** | ranking-agent output + initiative list |
| **References to attach** | `references/ice-scoring-rubric.md` |
| **Expected output** | ICE scores (I, C, E each 1-10) with evidence citations in Key Evidence column; differentiation check (no more than 2 initiatives sharing the same total) |

**Step 3: cut-line-agent**

| Field | Value |
|---|---|
| **Input** | ice-scoring-agent output |
| **References to attach** | `references/initiative-planning.md` |
| **Interview prompt** | *"How many can you execute well simultaneously?"* |
| **Expected output** | Proceed/Park/Kill decisions per initiative, capacity assessment, Proceed validation (owner + target metric + baseline + kill criteria for each Proceed) |

**Step 4: critic-agent**

| Field | Value |
|---|---|
| **Input** | Complete merged analysis (all upstream agents' outputs) |
| **Expected output** | PASS or FAIL against the 9-point quality gate documented in `agents/critic-agent.md`. FAIL routes specifically per the Failure Routing table in that file. |

---

## Route B — Quick Design

Use when the root cause is well-established, candidate approaches are identified, and speed matters.

```
research-agent → initiative-generator-agent → ranking-agent → ice-scoring-agent → cut-line-agent → critic-agent
```

**Skipped vs Route A:** `unconventional-agent`, the Layer 1.5 user feedback gate (operator already feedback-loaded into the input).

**When Route B is wrong:** if mid-dispatch initiative-generator-agent surfaces zero novel initiatives (the operator's "candidates identified" claim was empty), abort Route B and escalate to Route A. Don't ship a hollow standard-only artifact when the unconventional scan would have changed the cut line.

---

## Critic Gate

**Max 2 rewrite cycles.** If the critic returns FAIL:

1. Read the critic's failure report — it names the specific gate (1 of 9), the fix, and the agent to re-dispatch.
2. Re-dispatch ONLY the named agent(s) with the critic's feedback as input.
3. Re-merge if Layer-2 agents downstream of the re-dispatched one need fresh input.
4. Send the updated complete analysis back to `critic-agent`.
5. **If FAIL again after 2 cycles** → deliver the artifact with a `## Known Issues` section listing unresolved gate failures + the critic's last verdict verbatim. Status becomes `done_with_concerns`, never silent PASS.

The 9-point gate + failure routing table both live in `agents/critic-agent.md`. Don't re-encode here.

---

## Single-Agent Fallback

If the full orchestration is unnecessary (simple problem, ≤3 initiatives already named by the operator, ranking is the only question) you may run the analysis inline without dispatching agents. Apply the same 9-point quality gate before delivering.

**When the fallback is appropriate:** user pastes "Here are 3 initiatives — rank them and tell me which to ship first" with constraints + context already provided. That's a single decision; orchestration is theatre.

**When it's not:** any case where the initiatives are not yet named (you need initiative-generator-agent), the unconventional scan hasn't run (you need unconventional-agent), or the operator wants a defensible cut-line decision (you need cut-line-agent).

---

## Post-write side effects

After the artifact is written to `docs/forsvn/artifacts/meta/sketches/prioritize-[date].md`:

1. **Re-name** any prior `prioritize-*.md` for the same root cause to `prioritize.v[N].md` (increment N). Never overwrite silently.
2. **Out-of-Scope Persistence** (see next section) — one file per Kill decision.

Both are mandatory on PASS or `done_with_concerns`. Skip on `BLOCKED` / `NEEDS_CONTEXT` (no artifact to index, no kills to persist).

**No experience write-back.** Original SKILL.md is explicit: "prioritize doesn't seed dimensions to experience/ — initiatives are project-specific tactics, not stable user-profile state." Constraint Interview answers (per `pre-dispatch.md`) are in-context only.

---

## Out-of-Scope Persistence (load-bearing contract — preserved verbatim from original SKILL.md)

After delivering the artifact, write killed initiatives to `docs/forsvn/artifacts/meta/out-of-scope/` so future sessions don't re-analyze them.

For each initiative marked **Kill** in the Decisions table:

```markdown
# [Initiative Name]
**Decided:** [date]
**Context:** [root cause and goal that prompted this analysis]
**Decision:** Killed because [reason from Kill criteria]
**Revisit if:** [condition that would change the decision — e.g., "team grows to 5+", "root cause shifts to retention"]
```

Save as `docs/forsvn/artifacts/meta/out-of-scope/[kebab-case-name].md`. Create the directory if it doesn't exist.

**Why:** Prevents re-debating settled decisions in future sessions. `discover` and `orchestrate-*` skills read this directory before recommending workflows or asking about features already rejected. The contract is load-bearing — never skip the write.

**On re-run:** if a prior out-of-scope file exists for an initiative now under reconsideration, do NOT overwrite. Either (a) confirm the Revisit-if condition has triggered and append a `**Revisited:** [date]` line + new decision, or (b) flag to operator that the prior kill is being re-debated and ask for explicit override.

---

## Chain Position

| Previous | This skill | Next |
|---|---|---|
| `diagnose` (hard-gated upstream — produces the validated root cause) | **prioritize** | `plan-funnel` (sets numeric targets on Proceed initiatives); `architect-system` (forsvn-dev package — conditional on technical-build Proceed initiatives) |

**Re-run triggers:**
- Root cause changes (re-diagnosis) → re-run; new root cause = new initiatives.
- All "Proceed" initiatives shipped or killed → re-run; the cut-line frees up and parked initiatives may surface.
- New constraints emerge (budget cut, team change, deadline shift) → re-run; ICE Effort scores will shift.
- Quarterly cadence even without explicit triggers → re-run for staleness hygiene.

---

## Skill deference

| If user asks for | Defer to |
|---|---|
| "What's the root cause?" | `diagnose` (hard gate upstream) |
| "HOW do I build initiative X?" | `discover` |
| "Build the architecture for initiative X" | `architect-system` (forsvn-dev package) |
| "Set numeric targets on Proceed initiatives" | `plan-funnel` (Next Step in artifact) |
| "Break Proceed initiatives into tasks" | `breakdown-tasks` (forsvn-dev package) |
| "Plan a campaign for a Proceed initiative" | `plan-campaign` (marketing-skills) |

---

## Anti-patterns in dispatch

- **Running Route B when Route A would do.** Skipping the unconventional scan in cases where novel initiatives would have changed the cut-line is the most common quality regression. Default to A unless the user explicitly justifies B.
- **Skipping the Layer 1.5 user feedback gate in Route A.** This is non-skippable. The operator's judgment must enter before scoring locks the ranking.
- **Letting critic FAIL loops run >2 cycles.** Compounding rewrites stop converging. Ship `done_with_concerns` and surface to the operator.
- **Skipping Out-of-Scope Persistence on Kills.** Future sessions will re-debate the same kills. The persistence IS the long-lived record; the prioritize-*.md is the snapshot.
- **Overwriting a prior out-of-scope file silently.** If a previously-killed initiative is being re-analyzed, surface to operator first; never silently overwrite.
- **Running Single-Agent Fallback when initiatives aren't yet named.** The fallback assumes initiative generation has already happened. Use Route A or B instead.
