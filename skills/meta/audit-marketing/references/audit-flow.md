---
title: Audit-Marketing — AUDIT flow
lifecycle: canonical
status: stable
produced_by: audit-marketing
load_class: PROCEDURE
---

# AUDIT flow — one-shot, metricless, NEVER fixes

`/forsvn audit [target]` = `/audit-marketing audit [target]`. Produces a severity-grouped "reads like AI?" report. Side-effect-free except writing the report artifact. **It never edits the audited artifact and never writes `verdicts.tsv`.**

## Steps

1. **Resolve target.** A named artifact path, or — empty arg — the whole `docs/forsvn/artifacts/**/*.md` tree. `scan.ts` accepts a file, a directory, or a glob.

2. **Run the deterministic scanner** (the only detector — never re-implement detection):
   ```bash
   bun skills/forsvn-slop/scan.ts <target> --json
   ```
   Parse the `forsvn-slop-scan/v1` envelope: `{ schema, register, results: [{ file, findings, counts, regions }], totals: {block,warn,nit}, ok }`. Each finding carries `antipattern` (the `mkt-*` id), `name`, `severity` (`block|warn|nit`), `tier` (`regex|heuristic|llm`), `line`, `snippet`, `evidence` (measured proof — e.g. `"3 hype verbs: unlock, supercharge, elevate"`), `fixSkill`. Exit code: `2` iff any `block` (default) — informational here; the report does not gate.
   - The scanner is **zero-LLM** (it runs only the 45 deterministic regex|heuristic rules; the 10 `tier:'llm'` rules never fire from it). If the S6 LLM-critic agent exists, optionally run it for taste/trend rules and merge; if absent, **deterministic-only is a complete, authoritative run** — set `advisory_tier_run: false` and note "advisory (LLM-critic) tier not run."

3. **Dedupe** (only when the S6 critic ran): the scanner result is canonical. Drop any critic candidate whose `(antipattern, file, line ±2)` already fired, OR whose family already has a deterministic finding on the same structural unit (hook / CTA / section) — the taxonomy's "gated to fire only when the deterministic rules did NOT already flag."

4. **Triage** via [`noise-filter.md`](noise-filter.md): Layer-1 real-vs-fake (drop FP-guard exemptions — see below), then Layer-2 Accepted | Rejected | Deferred. For a pure `audit`, "Accepted" = the real findings (none are fix-attempted); cross-artifact rules with no paired artifact in scope → **Deferred** (human-review note), never a confident finding.

5. **Noise gate.** ≥5 findings and 0 `block` → collapse the nits to a single Rejected line and re-state the verdict (a wall of nits with no substantive finding is itself an audit failure).

6. **Emit the report** ([`report-template.md`](report-template.md)). Lead with the brutally-honest **`Reads like AI? — PASS | FAIL`** verdict + the single loudest named tell. Group findings **`block` → `warn` → `nit`**. Each finding: `` `[severity] mkt-ruleId` `` · section/line · the `evidence` snippet · `→ fix with /fixSkill`. A denylist finding (`mkt-claim-fabricated-precision` or the locked-brand-token analog) renders in the BLOCK group under a **⛔ Finalize blocked** banner. End with the directive footer: imperative ("Handle the BLOCK findings before this ships") + the FP-judgment clause (a finding is not automatically a defect — quotes / legal / intentional bad-examples / user-confirmed choices can be valid) + the rolled-up `Run: /forsvn polish <target>`.

7. **Write the report** to `docs/forsvn/artifacts/meta/records/[date]-audit-marketing-<slug>.md` (passes `validate-artifacts --strict`). **Completion: DONE** iff zero findings across all targets, else **DONE_WITH_CONCERNS** (the normal case). STOP — no fixes, no `verdicts.tsv` write.

## FP guards (Layer-1 — do not flag)

The scanner's own guards already exempt most of these, but the triage must not re-introduce them: parenthetical em-dashes inside a **quote/testimonial**; genuine **regulated-industry legal disclaimers** (by register); known acronyms in all-caps/emoji rules (API/SaaS/CRM/AI/B2B); an intentional **bad-example / fixture block** that documents slop. Authority is asymmetric — a confident false flag erodes trust faster than a missed nit.
