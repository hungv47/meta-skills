# Artifact Contract — prioritize

Full contract for the `prioritize` artifact. Loaded at write time by the orchestrator (or `format-conventions.md` consumer pass).

## Path + Lifecycle

- **Path:** `docs/forsvn/artifacts/meta-prioritize-<YYYY-MM-DD>-<slug>.md` (flat v2 grammar; one file per root cause; re-run renames prior file with `.v[N]` suffix)
- **Lifecycle:** `sketch` (per `agent-skills/CLAUDE.md` taxonomy)
- **Review surface:** `none` — `sketch` lifecycle defaults to `decision_state: not_required`

## Frontmatter (v2 schema)

Required fields: `skill`, `version` (integer, increment on re-run), `date` (ISO-8601), `status` (per Completion Status in SKILL.md), `stack` (=meta), `review_surface` (=none).

Full v2 schema: [`references/_shared/artifact-contract-template.md`](../_shared/artifact-contract-template.md).

## Required Body Sections (in order — cross-stack contract)

1. **Phase 1 — Initiatives:** 5-10 standard + 2-4 unconventional, each with Hypothesis / Mechanic / Target Metric / Anti-generic check
2. **Phase 2 — Forced Ranking** (strict 1-through-N)
3. **Phase 2 — ICE Scoring table** (no >2 sharing a total)
4. **Phase 2 — Decisions table** (Proceed / Park / Kill per initiative)
5. **Cut line declaration** (≤3 above)
6. **Next Step block**

Optional sections (append only when applicable): Known Issues · Revisited Out-of-Scope · Change Log.

Full schemas for each section live in [`references/format-conventions.md`](../format-conventions.md).

## Side Effects (mandatory on PASS or done_with_concerns)

Per `procedures/dispatch-mechanics.md`:

- **Out-of-Scope persistence:** Write one file per Kill to `docs/forsvn/artifacts/meta/out-of-scope/[kebab-name].md`. Format preserved verbatim from original SKILL.md: `Decided / Context / Decision / Revisit if`.
- **Versioning:** Rename any prior `prioritize-*.md` for the same root cause to `prioritize.v[N].md`.
- **Experience write-back: NONE.** Original SKILL.md explicitly states: "prioritize doesn't seed dimensions to experience/ — initiatives are project-specific tactics, not stable user-profile state." Preserved verbatim.

## Consumers

- `plan-funnel` — reads Target Metric per Proceed initiative; feeds Target Table baselines
- `plan-campaign` — Decision = Proceed filters which initiatives need campaign briefs
- `architect-system` — Mechanic per Proceed feeds technical scoping
- Future `prioritize` re-runs — revisited Out-of-Scope detection

## Cross-Stack OUTPUT Contract (load-bearing)

Schema changes to any of these require atomic update of consumers (per `anti-patterns.md` row "Cross-stack contract drift"):

- Phase 1 initiative format
- ICE Scoring table schema
- Decisions table schema
- Cut line statement
- Next Step block
- Out-of-Scope file format
