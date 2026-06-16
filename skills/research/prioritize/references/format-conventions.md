# Format Conventions — prioritize Artifact

> Load when writing the output artifact. Encodes the canonical artifact template (frontmatter + Phase 1 initiative format + Phase 2 ranking/scoring/decisions + Next Step), the ICE Scoring table column schema (cross-stack contract), the Decisions table column schema, and the Out-of-Scope file format.

---

## Artifact path

`docs/forsvn/artifacts/meta/sketches/prioritize-[YYYY-MM-DD].md`

On re-run: rename existing artifact to `prioritize.v[N].md` (increment N from the highest existing version) and create new at incremented version. Never overwrite.

---

## Frontmatter (required)

```yaml
---
skill: prioritize
version: [N]                          # increment on re-run
date: [YYYY-MM-DD]
status: done | done_with_concerns | blocked | needs_context
---
```

**Field semantics:**
- `version`: integer, 1 on first run, increment on every subsequent run for the same root cause.
- `date`: artifact creation date, ISO-8601. Drives the 30-day staleness check on downstream consumers (funnel-planner reads `date` to decide whether to re-run upstream).
- `status`: per the Completion Status block in SKILL.md.

---

## Body structure (in order — cross-stack contract)

The artifact opens with a header (`# Solution Design` + `**Root Cause:**`) then has two top-level phases plus a Next Step. Downstream consumers (funnel-planner, campaign-plan, system-architecture) parse by section header — renaming or reordering breaks the contract.

### Header block

```markdown
# Solution Design

**Root Cause:** [from diagnose.md — verbatim, including gap percentages if multi-cause]
```

### Phase 1: Initiatives

```markdown
## Phase 1: Initiatives

### 1. [Name] — Effort: [S | M | L]
**Hypothesis:** If [action], then [outcome], because [root cause connection].
**Mechanic:** [Specific steps — what you'd actually do, in order]
**Target Metric:** [metric]
**Anti-generic check:** [Why this only works for our specific root cause]
```

**Per-initiative format rules (cross-stack contract):**

| Field | Required | Notes |
|---|---|---|
| `### [N]. [Name]` | yes | Numbered 1-through-N matching the eventual force ranking |
| `— Effort: [S | M | L]` | yes | Single letter; S = days, M = 1-3 weeks, L = 1+ month |
| `**Hypothesis:** If X, then Y, because Z` | yes | The because clause MUST reference the root cause (anti-generic check) |
| `**Mechanic:** [steps]` | yes | Concrete actions; not "improve X" or "optimize Y" |
| `**Target Metric:** [metric]` | yes | Single metric per initiative; matches what funnel-planner will set targets against |
| `**Anti-generic check:** [why this only works for our root cause]` | yes | Delete the root cause from the hypothesis — does the initiative still make sense? If yes, rewrite. |

**Count:** 5-10 standard initiatives (from initiative-generator-agent) + 2-4 unconventional (from unconventional-agent, Route A only). Total 5-14 typical.

### Phase 2: Prioritization

Three sub-sections in this order.

#### Forced Ranking (gut + evidence)

```markdown
### Forced Ranking (gut + evidence)

1. [Name] — most promising because [reason]
2. [Name]
3. [Name]
...
```

One line per initiative, ranked 1-through-N. The #1 entry must include a reason; #2 onward may stop at the name (reason optional).

#### ICE Scoring

```markdown
### ICE Scoring

| Rank | Initiative | I | C | E | ICE | Key Evidence |
|------|-----------|---|---|---|-----|-------------|
| 1 | [Name] | [score] | [score] | [score] | [sum] | [One-sentence evidence for top-scoring dimension] |
| 2 | ... | ... | ... | ... | ... | ... |
```

**Column rules (cross-stack contract — do not change without atomic update of consumers):**

| Column | Type | Notes |
|---|---|---|
| Rank | integer | 1-through-N, matches Forced Ranking |
| Initiative | string | Verbatim from Phase 1 (`### N. [Name]`) |
| I | integer 1-10 | Impact — how much this moves the target metric |
| C | integer 1-10 | Confidence — how sure this will work; needs evidence in Key Evidence |
| E | integer 1-10 | Effort INVERSE (higher = easier) — scored on AI-assisted effort, not human-team weeks; per `references/ice-scoring-rubric.md` |
| ICE | integer | Sum of I + C + E (max 30) |
| Key Evidence | string | One-sentence citation for the top-scoring dimension (e.g., "I:8 — paid is 60% of traffic, old targeting converted at 3.5% vs 1.2% now") |

**Differentiation rule:** no more than 2 initiatives may share the same ICE total. If 3+ share a total, ice-scoring-agent must re-score with sharper differentiation.

#### Decisions

```markdown
### Decisions

| Initiative | Decision | Owner | Target Metric (Baseline) | Kill Criteria |
|------------|----------|-------|-------------------------|---------------|
| [Name] | Proceed | [Person] | [Metric]: [current] | Stop if [metric] < [threshold] after [duration] |
| [Name] | Park | — | — | — |
| [Name] | Kill | — | — | Reason: [why] |
```

**Column rules (cross-stack contract):**

| Column | Type | Notes |
|---|---|---|
| Initiative | string | Verbatim from Phase 1 |
| Decision | enum: Proceed / Park / Kill | Exact casing matters — downstream consumers grep these strings |
| Owner | string OR `—` | Named person for Proceed; `—` for Park and Kill |
| Target Metric (Baseline) | `[Metric]: [value]` OR `—` | Required for Proceed; `—` for Park and Kill |
| Kill Criteria | string OR `—` | For Proceed: `Stop if [metric] [op] [threshold] after [duration]`. For Kill: `Reason: [why]`. For Park: `—` |

**Cut line declaration (mandatory line after the Decisions table):**

```markdown
**Cut line:** [N] initiatives proceeding. Team capacity: [context].
```

`[N]` must be ≤3 (Critical Gate 4). If >3 would be needed, force the cut — additional initiatives Park, not Proceed.

### Next Step

```markdown
## Next Step

Run `plan-funnel` to set numeric targets for the proceeding initiatives.
If any "Proceed" initiative requires a technical build, also run `architect-system` (from the `forsvn-dev` package) with these initiatives as context.
```

This block is **verbatim** — downstream `forsvn` and `plan-funnel` grep these phrases to detect chain handoff.

---

## Optional sections (append only when applicable)

### Known Issues (only if critic FAIL loops hit cap and status is `done_with_concerns`)

```markdown
## Known Issues

[List the critic's last-cycle verdict verbatim, the 9-point gates that failed, the agent that owns each, and the reason the loop stopped.]
```

### Revisited Out-of-Scope (only if reconsidering a prior Kill)

```markdown
## Revisited Out-of-Scope

- **[Initiative Name]** — previously killed on [date] because [reason]. Revisited because [Revisit-if condition triggered or operator override]. New decision: [Proceed / Park / re-Kill with updated reason].
```

### Change Log (only on re-run)

```markdown
## Change Log

- [YYYY-MM-DD] [What changed and why — e.g., "Re-ran after diagnose updated root cause from 'targeting quality' to 'landing-page-message mismatch'. 3 prior Proceeds re-evaluated; 1 moved to Park."]
```

---

## Out-of-Scope file format (per Kill, separate file)

Each Kill decision in the Decisions table produces one file at `docs/forsvn/artifacts/meta/out-of-scope/[kebab-case-name].md`:

```markdown
# [Initiative Name]
**Decided:** [YYYY-MM-DD]
**Context:** [root cause and goal that prompted this analysis]
**Decision:** Killed because [reason from Kill criteria]
**Revisit if:** [condition that would change the decision — e.g., "team grows to 5+", "root cause shifts to retention"]
```

**Filename:** kebab-case of the initiative name, no date suffix (one file per initiative, NOT one per kill). On re-Kill, append a `**Revisited:** [date]` line; don't create a v2 file.

**Why the format matters:** `discover` and `orchestrate-*` skills read this directory before recommending workflows. The 4 frontmatter-ish lines (Decided, Context, Decision, Revisit if) are grepped — schema drift breaks the read.

---

## Date format

ISO-8601 (`YYYY-MM-DD`). Never `MM/DD/YYYY` or relative ("last Tuesday").

## Number format

- **ICE scores:** integers 1-10 (no decimals). `0` is never valid; `10` is rare and requires extraordinary evidence.
- **ICE total:** integer sum (max 30).
- **Percentages (in baselines/kill criteria):** one decimal place by default (`3.2%`, `40.0%`), no trailing zeros for whole numbers (`5%` not `5.0%`).
- **Currency:** prefix symbol (`$120`), thousands separator (`$1,800`), no decimals for whole amounts.

## Citation format (in Key Evidence column)

Lead with the dimension + score, then the one-sentence justification:
> "I:8 — paid is 60% of traffic, old targeting converted at 3.5% vs 1.2% now"

Cite source where possible: Wayback Machine for historical evidence, vendor case study with URL, internal dashboard reference, or prior artifact path.

---

## Anti-patterns in formatting

- **Renaming columns in the ICE Scoring or Decisions table.** Cross-stack contract breaks; downstream consumers skip rows.
- **Reordering Phase 1 / Phase 2 / Next Step.** Same problem — consumers parse by section order.
- **Omitting the Cut line statement.** Cut line is the strategic signal; omitting it leaves downstream funnel-planner without the constraint context.
- **Missing Anti-generic check on any initiative.** Critical Gate 3 fails the artifact.
- **Decimals in ICE scores.** Integers only; "7.5" is not a valid score.
- **Kill rows without Reason: prefix in Kill Criteria column.** Out-of-Scope file write parses the Reason; missing it breaks the persistence.
- **Verbatim Next Step block paraphrased.** Downstream chain detection greps the literal "Run `plan-funnel`" phrase.
- **Skipping Out-of-Scope file writes for Kills.** The Decisions table marks the decision; the per-Kill file IS the long-lived record. Both are required.
