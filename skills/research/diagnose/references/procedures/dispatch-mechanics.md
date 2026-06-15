# Procedure — Dispatch Mechanics (diagnose)

> Load when SKILL.md routes to Layer 1 dispatch. Encodes Route A / Route B mechanics, Layer 1 / 2 spawn details, the merge step, the Data Gathering Pause (interactive checkpoint — non-skippable), critic gate routing, single-agent fallback, Inconclusive Handling rules, chain position, and skill deference.

---

## Route Selection (the decision tree)

| Trigger | Route | Why |
|---|---|---|
| Default — non-trivial metric decline or strategic problem | **B — Full Analysis** | Default per original SKILL.md; runs L1 parallel (tree-builder + external-check) → L2 sequential (hypothesis → data-mapper → Data Gathering Pause → verdict → critic) |
| User provides data inline AND problem is clearly internal AND user CONFIRMS skipping external scan | **A — Quick Diagnosis** | All 3 conditions required per original Route A semantics; preserves Critical Gate 2 (operator must explicitly waive external-factor scan) |
| `--fast` flag or "fast mode" phrasing | **chosen route** with critic gate collapsed to single pass | Mode-resolver downgrade applies WITHIN the chosen route; does NOT auto-trigger Route A (would silently bypass Critical Gate 2) |

Echo the chosen route after the Cold Start confirmation (per `pre-dispatch.md`). Operator can override.

---

## Route A — Quick Diagnosis

Use when the user has a single clear hypothesis they want validated, not full root-cause discovery.

```
hypothesis-agent → data-mapper-agent → Data Gathering Pause → verdict-agent → critic-agent
```

**Skipped vs Route B:** tree-builder-agent + external-check-agent + L1 merge.

**When Route A is wrong:** if mid-dispatch hypothesis-agent surfaces that the user's stated hypothesis is one of several plausible causes, abort Route A and escalate to Route B. Don't ship a Quick Diagnosis that confirms a wrong hypothesis when the tree would have found the actual cause.

---

## Route B — Full Analysis (default)

Dispatch graph:

```
Layer 1 (parallel):  tree-builder-agent + external-check-agent
         ↓ merge
Layer 2 (sequential): hypothesis-agent → data-mapper-agent → [Data Gathering Pause] → verdict-agent → critic-agent
```

### Layer 1 — parallel spawn

Both agents spawn simultaneously after Cold Start completes.

**tree-builder-agent**

| Field | Value |
|---|---|
| **Input** | Problem statement (Metric is current instead of target), gap size, timeline, inflection point |
| **References to attach** | `references/watanabe-framework.md`, `references/logic-tree-examples.md` |
| **Expected output** | Logic tree (Math/Issue/Yes-No type chosen per problem shape), MECE check, branch summary; 2-3 levels with ≥3 leaf nodes |

**external-check-agent**

| Field | Value |
|---|---|
| **Input** | Problem statement, timeline, industry, product type, known competitors |
| **References to attach** | `research/product-context.md` (if available) |
| **Expected output** | 6-factor assessment (competitor, market/seasonal, platform/algorithm, regulatory, technology, macro-economic), each with WebSearch evidence (Confirmed / Possible / Ruled Out) |

### Layer 1 — Merge step

After both agents return:

1. If external-check-agent found **Confirmed or Possible** external factors → add an "External Factors" branch to the tree.
2. If all external factors were **Ruled Out** → note this in the analysis and proceed with the internal tree as-is.
3. Pass the merged tree + external factor assessment to hypothesis-agent.

### Layer 2 — Sequential dispatch

Run one at a time; each consumes the previous output.

**Step 1: hypothesis-agent**

| Field | Value |
|---|---|
| **Input** | Merged L1 output (tree + external factors) |
| **References to attach** | `references/_shared/hypothesis-framework.md` (use Framing A — Diagnostic), `references/logic-tree-examples.md` |
| **Expected output** | If/Then/Because hypotheses for every leaf, ranked by testability (speed-to-data × potential-gap-explained) |

**Step 2: data-mapper-agent**

| Field | Value |
|---|---|
| **Input** | Ranked hypotheses from hypothesis-agent |
| **References to attach** | `references/logic-tree-examples.md` |
| **Expected output** | Data requirement table — deciding data point, confirming evidence, rejecting evidence, source (Tool → Report → Metric), owner, availability |

**Step 3: Data Gathering Pause — INTERACTIVE CHECKPOINT, do NOT skip**

Present the data requirements to the user:

> *"Share what you found for each hypothesis — data, screenshots, reports, CSVs, or describe what you saw."*

Handling:
- If user provides data files → read and analyze them directly. Do NOT ask the user to summarize data you can read yourself.
- If user hasn't gathered data yet:
  - Use WebSearch for publicly available evidence: `"[competitor] launch [date range]"`, `"[industry] [metric] trend [year]"`, `"[tool name] outage [date]"`
  - Point them to the specific sources listed in the data map
  - Offer to search for any data that might be publicly available
- **Do NOT proceed to verdict-agent without evidence.** Verdicts without data are speculation. If no data is available after a sincere attempt → BLOCKED per Completion Status.

**Step 4: verdict-agent**

| Field | Value |
|---|---|
| **Input** | Data map + gathered evidence from user or WebSearch |
| **Expected output** | Verdict per hypothesis (Confirmed/Rejected/Inconclusive), root cause statement with gap percentages summing to ~100%, next step routing |

**3-strikes escalation:** if 3+ hypotheses are Rejected with none Confirmed or Inconclusive, the verdict-agent MUST escalate — state "cannot be determined", recommend reframing or new data. Forcing a root cause from weak evidence is a critic-FAIL trigger.

**Step 5: critic-agent**

| Field | Value |
|---|---|
| **Input** | Complete merged analysis (tree + external factors + hypotheses + data map + verdicts) |
| **Expected output** | PASS or FAIL against the 10-point quality gate documented in `agents/critic-agent.md`. FAIL routes specifically per the Failure Routing table in that file. |

---

## Critic Gate

**Max 2 rewrite cycles.** If the critic returns FAIL:

1. Read the critic's failure report — it names the specific gate (1 of 10), the fix, and the agent to re-dispatch.
2. Re-dispatch ONLY the named agent(s) with the critic's feedback.
3. Re-merge if Layer-2 agents downstream need fresh input.
4. Send the updated complete analysis back to `critic-agent`.
5. **If FAIL again after 2 cycles** → deliver the artifact with a `## Known Issues` section listing unresolved gate failures + the critic's last verdict verbatim. Status becomes `done_with_concerns`, never silent PASS.

The 10-point gate + failure routing table both live in `agents/critic-agent.md`. Don't re-encode here.

---

## Inconclusive Handling (post-verdict, pre-ship rule)

After the verdict-agent runs, check for Inconclusive verdicts. Preserved verbatim from original SKILL.md:

| Potential Gap Explained | Action |
|---|---|
| **>50%** (high-impact) | **Must resolve** before moving to prioritize. Specify: data needed, source, access barrier, timeline, owner. |
| **10-50%** (medium-impact) | **Should resolve** if data is available within 1 week. Otherwise, note as risk and proceed. |
| **<10%** (low-impact) | **Skip** — proceed to prioritize. Note as unexplained variance. |

Designing solutions around an incomplete diagnosis is expensive. A high-impact Inconclusive hypothesis that explains 50%+ of the gap means the root cause statement is missing the biggest driver — solutions will target the wrong thing.

---

## Single-Agent Fallback

If the full orchestration is unnecessary (single clear metric, hypothesis already validated by user data they're pasting, just want a verdict-shaped artifact), you may run the analysis inline without dispatching agents — apply the same 10-point quality gate before delivering.

**When the fallback is appropriate:** user pastes "Conversion dropped from 5% to 2% on June 1. Here's the cohort analysis showing the drop is concentrated in iOS Safari users. The Safari 18 release shipped May 28. Confirm root cause." That's a single decision with evidence; orchestration is theatre.

**When it's not:** any case where the tree hasn't been built (you need tree-builder-agent), external factors haven't been checked (you need external-check-agent), or data hasn't been gathered (you need the Data Gathering Pause).

---

## Post-write side effects

After the artifact is written to `docs/forsvn/canonical/research/DIAGNOSE.md`:

1. **Overwrite in place + bump `version`.** `DIAGNOSE.md` is a canonical singleton (the current diagnosis of record). On re-run, overwrite it and increment `version`; the prior run lives in git history. Never create a `.v[N].md` sibling.
2. **Goals write-back** per `procedures/pre-dispatch.md` Write-back map — Q1 (Metric), Q2 (Current), Q3 (Target) append to `experience/goals.md`. Q4 (Tried) is NOT persisted — diagnostic-specific.

Both side effects are mandatory on PASS or `done_with_concerns`. Skip on `BLOCKED` / `NEEDS_CONTEXT` (no artifact to index).

---

## Chain Position

| Previous | This skill | Next |
|---|---|---|
| (none — entry point of Strategy chain) | **diagnose** | `prioritize` (consumes root cause statement to generate ranked initiatives) |

**Re-run triggers:**
- Metric shifts significantly (e.g., gap closes or widens by >20%) → re-run; verdicts may have changed.
- New data surfaces that could change verdicts (Inconclusive resolves; external factor confirms or rules out) → re-run.
- A prioritize initiative is killed and the root cause-statement is questioned → re-run with fresh data.
- Quarterly cadence regardless of triggers → re-run for staleness hygiene.

---

## Skill deference

| If user asks for | Defer to |
|---|---|
| Scope a feature or idea | `discover` (product-skills) |
| Generate initiatives against a known root cause | `prioritize` |
| Market sizing or competitive landscape | `research-market` |
| Code-level bug | `clean-code` (product-skills) |

---

## Anti-patterns in dispatch

- **Skipping the Data Gathering Pause.** Non-skippable. Without evidence, verdicts are speculation; critic Gate 9 will FAIL.
- **Running Route A when Route B would do.** Skipping the tree+external scan in cases where multiple plausible causes exist produces confirmation bias on a wrong hypothesis. Default to B unless user is explicit.
- **Letting critic FAIL loops run >2 cycles.** Ship `done_with_concerns` and surface.
- **Skipping the staleness check on prior diagnose.md.** Old root causes against new metric values produce fiction.
- **Verdicts without external-factor consideration.** If external-check-agent found Confirmed/Possible factors but the verdict ignores them, critic Gate 4 will catch the MECE violation (missing branch). Always merge external factors into the tree before hypothesis dispatch.
- **3+ Rejected without escalation.** The verdict-agent must declare "cannot be determined" rather than force a root cause; otherwise critic-FAIL with re-dispatch.
