# Procedure — Dispatch Mechanics (funnel-planner)

> Load when SKILL.md routes to Layer 1 dispatch (or Route C fast bump). Encodes Route A / Route B / Route C mechanics, Layer 1 parallel + Layer 2 sequential spawn details, critic gate routing, single-agent fallback, and post-write side effects.

---

## Route Selection (the decision tree)

| Trigger | Route | Why |
|---|---|---|
| `--deep` flag OR 3+ initiatives spanning 2+ funnel models (e.g., PLG self-serve + SLG enterprise in one campaign) | **A — Full Analysis** | Different baselines and sensitivities apply to different initiatives; parallel L1 + stress-test cost is justified |
| Default: known/quickly-inferable funnel model, 1-2 initiatives, baselines available or industry-benchmark substitutable | **B — Standard Path** | Modal target-setting; skip the agents that add value only on multi-funnel work |
| ALL of: input ≤3 sentences AND single initiative AND prior `targets-*.md` exists for the same initiative | **C — Fast Bump** | Auto-downgrade for "bump the conversion target on X to Y%" asks where the rigor is already on file |
| `--fast` flag or "fast mode" phrasing | **C — Fast Bump** if conditions met, else **B** with critic-gate skipped | Mode-resolver forces collapse; falls back to B if C conditions fail (e.g., no prior file) |

Echo the chosen route in the Warm Start summary (per `pre-dispatch.md`). Operator can override before dispatch.

---

## Route A — Full Analysis

Dispatch graph:

```
Layer 1 (parallel):  model-selection-agent + baseline-collector-agent
         ↓ merge
Layer 2 (sequential): target-setter-agent → sanity-check-agent → stress-test-agent → critic-agent
```

### Layer 1 spawn — model-selection-agent

| Field | Value |
|---|---|
| **Input** | Business profile (type, stage, sales cycle, revenue model, growth motion), initiatives from `prioritize.md` |
| **References to attach** | `references/funnel-models.md` (PLG Funnel, SLG Funnel, AARRR, AIDA, TOFU-MOFU-BOFU) |
| **Expected output** | Growth motion classification (PLG/SLG/Hybrid), selected funnel model, stage definitions, initiative-to-stage mapping, channel-to-stage mapping for active channels (from the 9-channel reference in `playbook.md`) |

### Layer 1 spawn — baseline-collector-agent

| Field | Value |
|---|---|
| **Input** | Initiatives with their target metrics, user-provided data, prior `targets-*.md` if present |
| **References to attach** | `references/benchmarks.md`, `references/unit-economics.md` |
| **Expected output** | Baselines with sources and confidence (high/med/low), benchmark context per metric, unit economics snapshot (LTV, CAC, ratio, payback) |

### Layer 1 — Merge step

After both agents return (run in parallel — don't sequence):

1. Combine model selection (stages + mapping) with baselines (numbers + benchmarks).
2. Verify every initiative has BOTH a funnel stage mapping AND a numeric baseline.
3. If any initiative is missing a baseline → re-dispatch `baseline-collector-agent` with the specific gap as feedback. Max 1 re-dispatch.
4. Pass merged output to `target-setter-agent`.

### Layer 2 — Sequential dispatch

Run one at a time; each consumes the previous output.

**Step 1: target-setter-agent**
- **Input:** Merged L1 output (model + baselines)
- **References to attach:** `references/benchmarks.md`, `references/unit-economics.md`
- **Expected output:** Target table with improvement factors and justifications (one per initiative), LTV:CAC check, pricing health signals (if revenue targets involved)

**Step 2: sanity-check-agent**
- **Input:** target-setter-agent output
- **References to attach:** `references/anti-patterns.md`
- **Expected output:** Anti-pattern scan — 6 checks with pass/fail per target (subset of the 10-pattern catalog: vanity, feature factory, sandbagging, orphan owner, input traps, ignoring unit economics)
- **If BLOCKING failures:** re-dispatch `target-setter-agent` with the specific fixes; re-run sanity-check on the updated targets. Max 1 fix cycle before proceeding.

**Step 3: stress-test-agent**
- **Input:** Sanity-checked targets
- **References to attach:** `references/stress-tests.md`
- **Expected output:** 4 stress tests per target with pass/fail and recommendations (revenue connection, 70% test, ownership, measurement)

**Step 4: critic-agent**
- **Input:** Complete merged analysis (model + baselines + targets + sanity + stress)
- **Expected output:** PASS or FAIL against the 4-point quality gate (numeric baselines, justified targets, 70% test, LTV:CAC). FAIL routes specifically per the table in `agents/critic-agent.md`.

---

## Route B — Standard Path (default for most invocations)

Modal target-setting: known or quickly-inferable funnel model, 1-2 initiatives, baselines available or industry-benchmark substitutable.

```
target-setter-agent → sanity-check-agent → critic-agent
```

**Skipped vs Route A:** `model-selection-agent`, `baseline-collector-agent`, `stress-test-agent`.

**Why these can be skipped on modal work:** `target-setter-agent` handles model and baseline inference inline (it's already reading `product-context.md` + `prioritize.md` + the unit-economics/benchmarks refs). The three skipped agents add value on multi-funnel and high-stakes work; on the modal single-funnel case they're theatre and burn budget.

**When Route B is wrong:** if mid-dispatch `target-setter-agent` flags that it can't infer the model or baselines confidently, abort and escalate to Route A. Don't ship a hollow Route B artifact.

---

## Route C — Fast Bump (auto-downgrade)

Conditions (ALL must hold):
- Input is ≤3 sentences
- Single initiative
- Prior `docs/forsvn/artifacts/meta/records/targets-*.md` exists for the same initiative

```
target-setter-agent (read prior targets-*.md, apply delta, write — no critic gate)
```

**Behavior:**
1. `target-setter-agent` reads prior targets file inline (no L1 dispatch).
2. Apply the requested delta (e.g., "bump conversion target from 3% to 4%").
3. Update the existing artifact in place; rename old to `targets.v[N].md`; write new at incremented version.
4. Critic gate SKIPPED — the rigor is already on file from the prior full run.
5. Append change log entry to artifact explaining the delta + reason.

**If any condition fails** (no prior file, multi-initiative, structural change to the funnel) → fall back to Route B.

**Under `--fast` with Route C conditions met:** ship in single pass. Suffix the report with `"Ran in --fast / Route C mode; rerun without the flag for full critique."`

---

## Critic Gate (Routes A + B only)

**Max 2 rewrite cycles.** If the critic returns FAIL:

1. Read the critic's failure report — it names the specific gate, the fix, and the agent to re-dispatch.
2. Re-dispatch ONLY the named agent(s) with the critic's feedback as input.
3. Re-merge if Layer-2 agents downstream of the re-dispatched one need fresh input.
4. Send the updated complete analysis back to `critic-agent`.
5. **If FAIL again after 2 cycles** → deliver the artifact with a `## Known Issues` section listing unresolved gate failures + the critic's last verdict verbatim. Status becomes `done_with_concerns`, never silent PASS.

Failure routing table (canonical version lives in `agents/critic-agent.md`):

| Gate Failed | Agent to Re-dispatch |
|---|---|
| Numeric baselines | `baseline-collector-agent` |
| Justified targets | `target-setter-agent` |
| 70% test | `stress-test-agent` (re-evaluate) then `target-setter-agent` (adjust) |
| LTV:CAC | `baseline-collector-agent` (if data missing) OR `target-setter-agent` (if targets create unhealthy economics) |

---

## Single-Agent Fallback

If the full orchestration is unnecessary (single metric, user already has baseline + benchmark + obvious improvement factor), you may run target-setting inline without dispatching agents — apply the same 4-point quality gate (numeric baseline, justification, 70% test, LTV:CAC) before delivering.

**When the fallback is appropriate:** user pastes "Conversion is 2%, want to go to 3%, here's the baseline (current month) and the change I'm making (new landing page). Set the target." That's a single decision; orchestration is theatre.

**When it's not:** multi-initiative requests, missing baselines, unclear funnel model, or anything that would have triggered Route A.

---

## Post-write side effects

After the artifact is written to `docs/forsvn/artifacts/meta/records/targets-[date].md`:

1. **Re-name** any prior `targets-*.md` for the same initiative-set to `targets.v[N].md` (increment N from the highest existing version). Never overwrite a prior run silently.
2. **Append to `experience/business.md`** per the Write-back map in `pre-dispatch.md`. Baselines, growth motion (if confirmed/changed), unit economics snapshot, channel mapping. Stable user-profile state worth carrying forward.

Both side effects are mandatory on PASS or `done_with_concerns`. Skip on `BLOCKED` / `NEEDS_CONTEXT` (no artifact to index).

(Manifest sync + eval-loop results.tsv append are pipeline-wide responsibilities per `research-skills/CLAUDE.md` § "Manifest Spec" — funnel-planner's body-diet refactor preserves the original SKILL.md scope, which did not include these calls. Deferred to v6.3.0 behavior-fix bundle, alongside the related `manifest-sync.ts` invocation-path bug.)

---

## Chain Position

| Previous | This skill | Next |
|---|---|---|
| `prioritize` (hard-gated upstream — produces the ranked initiative list) | **funnel-planner** | `plan-campaign` (consumes targets to plan channel-level execution); downstream measurement (eval-loop dashboards) when a loop exists for the initiative |

**Re-run triggers:**
- Baselines shift >20% from current target-table values → re-run to recalibrate
- Measurement cycles conclude with new data → re-run to apply learnings
- Quarterly cadence regardless of drift → re-run for staleness hygiene
- Growth motion changes (e.g., PLG company adds an enterprise SLG arm) → re-run with new funnel model

---

## Skill deference

| If user asks for | Defer to |
|---|---|
| "Help me set goals" (no initiatives) | `prioritize` |
| "What channels should we run?" | `plan-campaign` (consumes funnel-planner output) |
| "Why did conversion drop?" | `diagnose` (root-cause, not forward target) |
| "What's our TAM?" | `research-market` |
| "Build the brief for this campaign" | `plan-campaign` → per-asset skills (short-form-brief, design-brief, etc.) |

---

## Anti-patterns in dispatch

- **Running Route A when Route B would do.** Burns ~3x the budget for no quality gain on modal work. Use the Route Selection table.
- **Skipping the merge step in Layer 1.** Dispatching target-setter with partial L1 output produces targets without baselines — exactly what the skill exists to prevent.
- **Letting critic FAIL loops run >2 cycles.** Compounding rewrites stop converging. Ship `done_with_concerns` and surface the gate failures to the operator.
- **Skipping post-write side effects.** No manifest-sync → downstream skills can't find the artifact. No experience write-back → next session re-asks the growth motion.
- **Running Route C without a prior `targets-*.md` for the same initiative.** Fast Bump assumes prior rigor on file; without it, the bump is arbitrary. Fall back to Route B.
