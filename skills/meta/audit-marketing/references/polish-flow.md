---
title: Audit-Marketing — POLISH flow
lifecycle: canonical
status: stable
produced_by: audit-marketing
load_class: PROCEDURE
---

# POLISH flow — audit → fix → re-verify, human-owned, max 2 rounds

`/forsvn polish [target]` = `/audit-marketing polish [target]`. Runs AUDIT, then for each Accepted finding dispatches its mapped fixer and passes a conservative re-verify gate. **Lands every edit as `decision_state: pending` — never approved.** There is no accept-tool on the agent channel; the human approves on `/forsvn:review`.

## Steps

1. **Run AUDIT** ([`audit-flow.md`](audit-flow.md) steps 1–5) to get the triaged **Accepted** findings. Zero Accepted → nothing to fix; write the report, Completion DONE.

2. **Extract `protected_tokens`** from the artifact, deterministically (no LLM — reuse the same regex shapes the scanner uses): `{ numbers: [...], urls: [...], entities: [...], ctas: [...] }` — every number/percentage/price/date, every URL, every brand/proper-noun entity (BRAND.md tokens), every CTA verb-phrase in a button/CTA slot. This is the contract the re-verify gate enforces survives the fix.

3. **Route each Accepted finding to its fixer** via [`fix-routing.md`](fix-routing.md). The finding already carries `fixSkill` from the registry — that is authoritative; the category table is its documented mirror, used only if `fixSkill` is absent. **Group findings by `fixSkill`** so each fixer runs ONCE over the artifact (not once per finding). Cross-artifact / structural-only findings route to a `human-review` note, never a fixer.

4. **Snapshot the artifact** (for section-scoped rollback). **Dispatch each fixer** via the Skill tool (Route C — embedded, caller-driven), passing `protected_tokens`. Each fixer emits its Change Log `{ Location, Original, Change, Rule }`. The fixers already support Route C + protected tokens — reuse verbatim; add no fix code here.

5. **RE-VERIFY GATE** ([`reverify-gate.md`](reverify-gate.md)) — for the fixer's output:
   - **(a) score + rule:** re-run `scan.ts --json` → the severity-weighted score (`3·block + 2·warn + 1·nit`) is **strictly lower** AND the firing `antipattern` is gone AND **no NEW finding** appeared (the fixer-introduces-a-new-tell guard).
   - **(b) Post-Humanize Regression Check** ([`_shared/quality-feedback-protocol.md`](_shared/quality-feedback-protocol.md) — the 5 checks): entities/URLs/numbers/prices/dates/claims/citations unchanged; specificity not dropped; CTA + format unchanged; mandatory caveats preserved; `protected_tokens` ⊆ post-fix tokens.
   - **(c) original critic gate** (if the artifact had one) still passes.
   - **PASS all → `accepted_fixed`.** **FAIL any → roll back THAT SECTION** (not the whole artifact — don't discard good fixes in the same round) and re-state the finding **`accepted_deferred` ("Attempted, Rolled Back")**.

6. **Loop (max 2 rounds).** Round 2 = re-run AUDIT fresh on the round-1 output; attempt only newly-Accepted findings NOT already rolled back, plus any fixer-introduced finding. After round 2 STOP: remaining Accepted → Deferred, **Completion DONE_WITH_CONCERNS** + an operator flag ("won't clean in 2 rounds — possible structural issue the fixers can't solve: no spine / no proof"). Never a 3rd round.

7. **Land + report.** Write the artifact with `decision_state: pending` (NEVER approved). Write the report with `score_before` / `score_after` / `rounds` in the **frontmatter** (not `verdicts.tsv`). The human approves on `/forsvn:review`, where forsvn-preview writes the `verdicts.tsv` row carrying the rule ids in its reserved `dimensions_flagged` column.

## Completion

- **DONE** — all Accepted findings `accepted_fixed` + verified.
- **DONE_WITH_CONCERNS** — some rolled back to Deferred, or the 2-round cap was hit.
- **BLOCKED** — a denylist finding (`mkt-claim-fabricated-precision` / locked-brand-token analog) is unresolved after 2 rounds. The other eight `block`-severity rules do NOT escalate to BLOCKED.
