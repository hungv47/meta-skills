# Anti-Patterns — prioritize

> 8 named anti-patterns that kill initiative quality + ranking validity. Each includes detection, why it fails, the fix, and the agent responsible for catching it. Critic-load reference — re-read before any output ships.

---

## 1. Generic Initiatives

**What it is:** Initiatives phrased as categories rather than specific mechanics — "Improve SEO", "Optimize onboarding", "Better email marketing".

**Detection:**
- The mechanic is a goal restated, not a sequence of actions.
- The initiative would help ANY company, not specifically yours.
- The "because" clause is missing or doesn't name the root cause.

**Why it fails:** Generic initiatives can't be executed — they require a second round of "OK, but what specifically?" which the prioritize ICE rigor was supposed to have already done.

**Fix:** Every initiative must describe a specific mechanic tied to a specific root cause. Run the **anti-generic test:** delete the root cause reference from the hypothesis — does the initiative still make sense for any company? If yes, rewrite.

**Owned by:** initiative-generator-agent (generation) + critic-agent (catch).

---

## 2. Untethered Ideas

**What it is:** Initiatives that sound good but don't actually connect to the confirmed root cause.

**Detection:**
- Hypothesis "because" clause omits the root cause reference.
- The initiative addresses a different metric than the one diagnose flagged.
- The initiative is a generic best practice that would be true regardless of root cause.

**Bad example:**
> If we add Intercom live chat, then activation improves, because users get help faster.
>
> (Diagnose said root cause was paid targeting quality, not activation friction.)

**Good example:**
> If we restore the pre-Q1 targeting + add converters lookalike, then paid conversion returns to ≥3%, because the current broad targeting brings visitors outside our ICP (root cause: targeting quality).

**Fix:** Every hypothesis must reference the root cause in the "because" clause. The root-cause anchor prevents brainstorm drift into a generic growth playbook.

**Owned by:** initiative-generator-agent + unconventional-agent (generation) + critic-agent (Gate 1 catch).

---

## 3. All-Small or All-Large Effort Mix

**What it is:** The initiative list skews entirely toward quick wins (all S) or all heavy lifts (all L).

**Detection:**
- Effort column shows only one or two effort sizes across 5+ initiatives.
- The merge step's effort-mix check fails (<2 Small, <2 Medium, or <1 Large).

**Why it fails:**
- All-Small: misses structural fixes that compound.
- All-Large: stalls momentum; the team ships nothing for weeks.

**Fix:** Enforce effort mix at the Layer 1.5 merge step — ≥2 Small, ≥2 Medium, ≥1 Large across the combined standard + unconventional list. If the mix fails, re-dispatch initiative-generator-agent with the specific gap.

**Owned by:** Layer 1.5 merge step.

---

## 4. "Everything Is a 6" Scoring

**What it is:** All ICE scores cluster between 5 and 7 — the ranking becomes meaningless.

**Detection:**
- ICE totals within ±3 of each other across all initiatives.
- 3+ initiatives sharing the same ICE total.
- The Forced Ranking and the ICE-sorted ranking disagree by more than 2 positions on most initiatives.

**Why it fails:** When scores don't differentiate, the cut line is arbitrary — the team ships whatever's loudest, not what's highest-impact.

**Fix:** Force-rank BEFORE scoring (Critical Gate 2). The #1 rank sets the ICE ceiling — if you ranked it #1, its ICE should be highest. ice-scoring-agent's differentiation rule (no more than 2 sharing a total) forces re-scoring if the spread is too tight.

**Owned by:** ranking-agent (force-rank first) + ice-scoring-agent (differentiation check) + critic-agent (Gates 6-7 catch — Differentiated scores + Force-rank ceiling).

---

## 5. Naked Scores Without Evidence

**What it is:** ICE scores without one-sentence evidence in the Key Evidence column.

**Detection:**
- Key Evidence column empty or has placeholder text.
- Score justifications cite "team consensus" or "we think" rather than data.
- The same evidence is reused across multiple initiatives.

**Why it fails:** Political scoring. The loudest voice wins; the data loses.

**Fix:** Every score needs a one-sentence citation in the Key Evidence column — what data, case study, or reasoning supports this number. Lead with the dimension + score (e.g., "I:8 — paid is 60% of traffic, old targeting converted at 3.5% vs 1.2% now").

**Owned by:** ice-scoring-agent + critic-agent (Gate 5 catch — Evidence-backed ICE).

---

## 6. Too Many Initiatives Above Cut Line

**What it is:** More than 3 initiatives marked Proceed.

**Detection:**
- Decisions table has 4+ Proceed rows.
- Cut line declaration says "5 initiatives proceeding" — automatic fail.

**Why it fails:** With >3 active initiatives, none get full attention. The team multitasks across all five, ships none well, and 6 weeks later restarts with no learnings.

**Fix:** Force the ≤3 constraint at the cut-line-agent step. Parked initiatives have their turn after the current batch ships. If the team genuinely has capacity for >3 simultaneous initiatives (rare — typically requires a dedicated owner per initiative + no shared dependencies), document the capacity explicitly in the Cut line statement.

**Owned by:** cut-line-agent + critic-agent (Gate 8 catch — Cut line ≤3).

---

## 7. Missing Kill Criteria

**What it is:** Proceed initiatives without a "stop if" threshold.

**Detection:**
- Kill Criteria column empty or generic ("stop if not working").
- No metric + threshold + duration triplet.

**Why it fails:** Initiatives without kill criteria run forever. The team sinks 8 weeks into a Proceed that should have been killed at week 2.

**Bad example:**
> Stop if not working

**Good example:**
> Stop if paid conversion <2% after 10 days

**Fix:** Every Proceed needs a specific (metric, threshold, duration) triplet that triggers a stop. cut-line-agent enforces this in its output contract.

**Owned by:** cut-line-agent + critic-agent (Gate 9 catch — Proceed validation).

---

## 8. Skipping the Unconventional Scan

**What it is:** Running Route B (no unconventional-agent) when Route A was warranted — only considering standard approaches when the root cause may need asymmetric leverage.

**Detection:**
- The artifact has zero unconventional initiatives despite the root cause being structural (e.g., differentiated competitor, market saturation, brand-perception issue).
- The user did NOT explicitly request Route B / `--fast` / "speed matters."
- The initiative list reads as a generic playbook with no novel mechanics.

**Why it fails:** The 1-in-5 unconventional initiative that ships becomes the differentiator. Skipping the scan systematically de-selects the most leveraged options.

**Fix:** Default to Route A unless the operator explicitly justifies Route B. The unconventional scan's parallel cost is low; the expected value of asymmetric initiatives is high.

**Owned by:** Route Selection (in `procedures/dispatch-mechanics.md`). Note: the 9-point critic gate does NOT catch this — there is no "Route A was used when warranted" gate. Operator review is the final check before shipping; if a critical unconventional initiative would have surfaced, the operator should escalate to Route A and re-dispatch.

---

## Cross-stack contract drift (not in numbered list — operator review responsibility)

The Phase 1 initiative format (`Hypothesis / Mechanic / Target Metric / Anti-generic check`), the ICE Scoring table column schema (`Rank | Initiative | I | C | E | ICE | Key Evidence`), and the Decisions table column schema (`Initiative | Decision | Owner | Target Metric (Baseline) | Kill Criteria`) are cross-stack contracts consumed by funnel-planner (`Target Metric` feeds the Target Table baseline), campaign-plan (`Decision = Proceed` filters which initiatives need a campaign brief), and system-architecture (`Mechanic` feeds the technical scoping).

**Drift modes:**
- Renaming a column in either table.
- Reordering columns.
- Adding columns without an atomic update of downstream consumers.
- Omitting the `Anti-generic check` row in Phase 1.
- Omitting the `Cut line:` declaration after the Decisions table.

**Owned by:** operator review against `references/format-conventions.md` before shipping any schema change. Note: the 9-point critic gate does NOT catch schema drift — Gate 8 is "Cut line ≤3" and Gate 9 is "Proceed validation" (owner/baseline/kill criteria), neither inspects column schemas. If schema-drift catching matters more, that's a future enhancement to add a 10th gate.

---

## Out-of-Scope persistence skipped

**What it is:** Kill decisions don't get written to `docs/forsvn/artifacts/meta/out-of-scope/[name].md`.

**Detection:**
- Decisions table has Kill rows but the out-of-scope directory has no corresponding files.
- Files exist but don't match the canonical 4-line format (Decided / Context / Decision / Revisit if).

**Why it fails:** Future sessions re-debate settled decisions. `discover` and `orchestrate-*` skills read the out-of-scope directory before recommending workflows; missing files mean the kills don't show up in their context, and the same dead initiative gets re-generated next quarter.

**Fix:** cut-line-agent (or the orchestrator post-write) writes one file per Kill in the canonical format. Mandatory on PASS or done_with_concerns. The file format spec lives in `references/format-conventions.md` § "Out-of-Scope file format."

**Owned by:** Post-write side effects (in `procedures/dispatch-mechanics.md`). Note: the 9-point critic gate does NOT catch this — Gate 9 is "Proceed validation" (owner/baseline/kill criteria), which inspects the artifact body, not on-disk side-effect files. Out-of-Scope file writes are an orchestrator post-write responsibility; missing writes are caught at the operator/integration level, not by the critic.
