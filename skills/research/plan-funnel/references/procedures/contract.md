# Procedure — Artifact Contract (plan-funnel)

> Load when writing the targets artifact. Encodes the path grammar, lifecycle, frontmatter schema, required/optional sections, side effects, and cross-stack OUTPUT contract.

---

## Path

`docs/forsvn/artifacts/meta-plan-funnel-<YYYY-MM-DD>-targets-<slug>.md` (flat v2 grammar; one per initiative-set; re-run renames prior with `.v[N]` suffix).

## Lifecycle

`snapshot` (per `agent-skills/CLAUDE.md` taxonomy).

## Frontmatter fields

- `skill` — `plan-funnel`
- `version` — integer, increment on re-run
- `date` — ISO-8601
- `status` — per Completion Status block in SKILL.md
- `stack` — `meta`
- `review_surface` — `none` (snapshot lifecycle defaults to `decision_state: not_required`)

Full v2 schema lives in `references/_shared/artifact-contract-template.md`.

## Required sections (in order — cross-stack contract)

1. **Funnel Stages** — model + stage definitions used
2. **Target Table** — per-stage targets with baseline, improvement factor, justification, confidence, sensitivity band
3. **Channel → Funnel Stage Map** — which channels drive which stages (channel-mix x stage-mix)
4. **Three-Outcome Validation** — Business / Brand / Community coverage with N/A justifications
5. **Validation** — anti-pattern scan results, stress-test outcomes, critic gate pass/fail
6. **Baselines** — sourced rates with timestamp + confidence

Full schemas (column headers, value formats, citation grammar) live in `references/format-conventions.md`.

## Optional sections (append only when applicable)

- **Aspirational Target Flags** — targets above the calibration band, with explicit rationale
- **Pricing Health Signals** — LTV:CAC gaps, payback period warnings
- **Known Issues** — when status = `done_with_concerns`, pin gate failures here
- **Change Log** — on re-run, what shifted vs prior version

## Side effects

Append to `experience/business.md` per the write-back map in `procedures/pre-dispatch.md`:

- Baselines (sourced rates, traffic numbers, conversion rates)
- Growth motion (PLG / SLG / Hybrid)
- Unit economics snapshot (LTV, CAC, payback, gross margin)

Stable user-profile state worth carrying forward. Mandatory on PASS or `done_with_concerns`.

## Consumed by

- `plan-campaign` — channel-level execution; reads Channel → Funnel Stage Map and Target Table
- Downstream measurement — `run-pipeline` dashboards when one exists
- Future `plan-funnel` re-runs — delta detection against prior `targets-*.md`

## Cross-stack OUTPUT contract

**Target Table column schema + section order are load-bearing for downstream consumers.** Schema changes require atomic update of `plan-campaign` and `run-pipeline` (per `anti-patterns.md` row "Cross-stack contract drift"). Never silently drift the column order or rename columns without coordinating the downstream readers.
