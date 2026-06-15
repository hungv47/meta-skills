# Procedure — Pre-Dispatch (diagnose)

> Load when SKILL.md routes to Pre-Dispatch. Encodes the always-cold-start contract, the read order, the Cold Start prompt, the Write-back map (Q1-Q4 → goals.md, preserved verbatim from original SKILL.md), and the route-selection conditions. Canonical Pre-Dispatch spec lives in [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) — this file is the diagnose-specific overlay.

---

## Diagnose always cold-starts

Unlike most stack skills, diagnose **always cold-starts** even when context is partially resolvable. The reason: diagnose IS the diagnostic interview — the 4 questions (metric / current / target / tried) ARE the work. Warm-starting from cached partial context would mean the orchestrator hallucinates a problem statement that was never fully specified.

The only "warm" path is **re-run after metric shift** — when `DIAGNOSE.md` already exists (resolve `id:diagnose` via `find-artifacts --resolve diagnose`), the new run reads it for context but still asks for fresh metric/current/target values (the whole point of re-running is the numbers changed).

---

## Read order (in order)

1. **Canonical (optional):** prior `docs/forsvn/canonical/research/DIAGNOSE.md` if re-running (resolve `id:diagnose` via `find-artifacts --resolve diagnose`). Carries the prior tree structure + verdicts as context for the new run; doesn't replace the new Cold Start.
2. **Pipeline (optional):** `research/product-context.md` — business profile (type, stage, sales cycle). Improves logic-tree calibration (tree-builder-agent picks tree type informed by business model).
3. **Experience (read, don't ask):** `docs/forsvn/experience/goals.md` for prior metric history (does this metric have a baseline already? prior target?).

(Note: original SKILL.md read order is just these 3 items. `research/market-research.md` is NOT in the original read order; if competitive context is needed for the external-check-agent, the agent fetches it during its own dispatch — not pre-loaded here. Adding it as a pre-load step would be net-new behavior.)

---

## Cold Start (default — always fires)

Emit one bundled prompt with 4 numbered questions:

```
diagnose traces a metric gap to root causes via MECE logic tree, hypothesis
validation, and verdict scoring. The diagnostic depends on numeric specifics:

1. **Metric** — name it precisely. ("Trial-to-paid conversion" beats "conversion".)
2. **Current value + measurement period** — e.g., "3.2% over the last 90 days, n=1,400 trials".
3. **Target + deadline** — e.g., "5% by end of Q2".
4. **What you've tried** — 1-2 things, with outcome if known. Helps the tree
   skip already-falsified branches.

Answer 1-4 in one response. I'll build the logic tree and dispatch agents.
```

If the user answers without the metric/current/target triad, return `NEEDS_CONTEXT` per Completion Status — don't dispatch agents on a vague problem ("things aren't going well" without numbers).

---

## Write-back map (preserved verbatim from original SKILL.md)

After dispatch completes AND artifact ships PASS or done_with_concerns:

| Q | File | Key |
|---|---|---|
| 1. Metric | `goals.md` | `Goals — diagnostic metric: [name]` |
| 2. Current | `goals.md` | `Goals — baseline: [metric]` |
| 3. Target | `goals.md` | `Goals — target: [metric]` |
| 4. Tried | (not persisted — diagnostic-specific, lives in diagnose.md) |

This write-back IS in the original SKILL.md (lines 125-132) and IS preserved here verbatim. Q1-Q3 are stable user-profile state (the metric being tracked + its baseline + its target). Q4 (what's been tried) is diagnostic-specific and lives in the snapshot artifact only.

---

## Route Selection

| Trigger | Route | Why |
|---|---|---|
| Default — non-trivial metric decline or strategic problem | **B — Full Analysis** | Default route per the original SKILL.md; runs L1 parallel (tree-builder + external-check) → L2 sequential (hypothesis → data-mapper → Data Gathering Pause → verdict → critic) |
| User provides data inline AND problem is clearly internal AND user CONFIRMS skipping external scan | **A — Quick Diagnosis** | All 3 conditions required per original Route A semantics (preserves Critical Gate 2 — operator must explicitly waive external-factor scan; never auto-waived) |
| `--fast` flag or "fast mode" phrasing | **chosen route** with critic gate collapsed to single pass | Mode-resolver downgrade applies WITHIN the chosen route; does NOT auto-trigger Route A (would bypass Critical Gate 2). Cold Start still fires (always) |
| `--deep` flag or "thorough analysis" phrasing | **B** with critic loop max 2 cycles | Default route reinforced |

Echo the chosen route at the end of the Cold Start confirmation, after the user answers Q1-4. Operator can override before dispatch.

---

## Staleness check on prior diagnose

Original SKILL.md "Re-run triggers" (line 99): "When the metric shifts significantly, when new data surfaces that could change verdicts, or when a prioritize initiative is killed." These are **operator-judgment** triggers — not automated emissions.

Do NOT auto-emit a "WARNING: prior DIAGNOSE.md is N days old" message on re-run. Operator decides when re-diagnosis is warranted; auto-emission would be net-new behavior.

---

## Mode-resolver interaction

`metadata.budget: deep` → modal path is Route B (per `dispatch-mechanics.md`).

- `--fast` flag or "fast mode" phrasing → collapse critic gate to single pass WITHIN whatever route is chosen (B by default). Does NOT auto-trigger Route A — that requires explicit operator confirmation of external-scan skip per Critical Gate 2. Cold Start STILL fires (the safety floor — diagnose can't hallucinate the problem statement).
- `--deep` flag or "thorough analysis" phrasing → Route B with critic loop max 2 cycles. (Same as default but reinforces willingness to iterate.)
- Otherwise: Route B is default.

The route is chosen after Cold Start (after user answers Q1-4). Echo the chosen route in the confirmation. Operator can override.

---

## Anti-patterns in Pre-Dispatch

- **Warm-starting when prior context is partial.** Diagnose ALWAYS cold-starts. The 4 questions ARE the work; skipping them means hallucinating the problem statement.
- **Dispatching without metric+current+target triad.** NEEDS_CONTEXT per Completion Status; ask the user before invoking agents. Never substitute defaults like "let's assume current is 50%".
- **Skipping the staleness check on prior diagnose.md.** A 6-month-old root cause against this-quarter metrics produces fiction.
- **Writing to goals.md BEFORE the artifact ships.** Write-back happens after the artifact is committed and critic PASSes (or done_with_concerns ships). Partial runs that BLOCK should not persist baselines.
- **Persisting Q4 (Tried).** Q4 is diagnostic-specific and lives in the snapshot artifact only — not in goals.md. The original SKILL.md is explicit about this.
- **Running Cold Start under `--fast` without honoring it.** Cold Start fires under `--fast` regardless — `--fast` only collapses orchestration after problem statement is resolved.
