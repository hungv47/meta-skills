# Format Conventions — diagnose Artifact

> Load when writing the output artifact. Encodes the canonical artifact template (frontmatter + 3-phase body + Next Step), the Logic Tree code-fence convention, the External Factor Scan 6-row table, the hypothesis format (If/Then/Because + Deciding data / Source / Owner / Confirming / Rejecting / Potential gap explained), the Verdict Table column schema (cross-stack contract), and the Root Cause Statement format.

---

## Artifact path

`docs/forsvn/canonical/research/DIAGNOSE.md`

Canonical singleton — the current diagnosis of record. On re-run: overwrite `DIAGNOSE.md` in place and increment `version`. Never create a `.v[N].md` sibling — prior runs live in git history.

---

## Frontmatter (required)

```yaml
---
skill: diagnose
version: [N]                          # increment on re-run
date: [YYYY-MM-DD]
status: done | done_with_concerns | blocked | needs_context
stack: research
review_surface: none
id: diagnose
type: canonical
keywords: [diagnose, root-cause, hypothesis-tree, metric-decline, if-then-because]
---
```

**Field semantics:**
- `version`: integer, 1 on first run, increment on every subsequent run (overwrite in place — the singleton holds the latest diagnosis only).
- `date`: artifact creation date, ISO-8601. Drives the 30-day staleness check on downstream consumers (prioritize reads `date` to decide whether to recommend re-diagnosis).
- `status`: per the Completion Status block in SKILL.md.
- `id`: stable `diagnose` — consumers resolve it via `find-artifacts --resolve diagnose`; never changes.

---

## Body structure (in order — cross-stack contract)

The artifact opens with a header (`# Problem Analysis`) then has three top-level phases plus a Next Step. Downstream consumers (prioritize, funnel-planner, campaign-plan, system-architecture) parse by phase header — renaming or reordering breaks the contract.

### Header block

```markdown
# Problem Analysis
```

### Phase 1: Problem Definition

Four sub-sections in this order.

#### Problem Statement

```markdown
## Phase 1: Problem Definition

### Problem Statement

[Metric] is [current] instead of [target], a gap of [X%/X units].
Started: [when]. Inflection point: [if known].
```

**Format rule (cross-stack contract):** the single sentence must follow `[Metric] is [current] instead of [target]` exactly. Critical Gate 1 fails the artifact if the statement is missing either number.

#### Logic Tree

```markdown
### Logic Tree

[Tree type: Math / Issue / Yes-No]

​```
[Problem statement]
├── [Branch 1]
│   ├── [Leaf 1a]
│   ├── [Leaf 1b]
│   └── [Leaf 1c]
├── [Branch 2]
│   ├── [Leaf 2a]
│   └── [Leaf 2b]
└── [Branch 3]
    ├── [Leaf 3a]
    └── [Leaf 3b]
​```
```

**Format rules:**
- Tree type explicitly labeled (Math / Issue / Yes-No) per `references/watanabe-framework.md`.
- 2-3 levels with ≥3 leaf nodes (Critic Gate 2 enforces).
- Box-drawing characters (`├──`, `│`, `└──`) — preserved verbatim from original. Plain ASCII alternatives break downstream parsers that expect this format.
- Each leaf is a testable cause (Critic Gate 3) — not a restatement of the problem.

#### MECE Check

```markdown
### MECE Check

- Mutually Exclusive: [confirm no overlaps]
- Collectively Exhaustive: [confirm no gaps]
```

#### External Factor Scan

```markdown
### External Factor Scan

| Factor | Finding | Status |
|--------|---------|--------|
| Competitor launch | [result] | Confirmed / Ruled Out / Possible |
| Market/seasonal shift | [result] | [status] |
| Platform/algorithm change | [result] | [status] |
| Regulatory/policy change | [result] | [status] |
| Technology change | [result] | [status] |
| Macro-economic conditions | [result] | [status] |
```

**Format rule:** all 6 rows present even if all are "Ruled Out". Omitting rows breaks Critical Gate 2 ("Do NOT skip external factors"). Status values are `Confirmed` / `Ruled Out` / `Possible` only — no other strings.

### Phase 2: Hypotheses (Ranked by Testability)

```markdown
## Phase 2: Hypotheses (Ranked by Testability)

### 1. [Short name] — Priority: HIGH
**If** [cause], **then** [observable evidence], **because** [mechanism].
- **Deciding data:** [specific data point]
- **Source:** [Tool → Report → Metric]
- **Owner:** [person/team]
- **Confirming:** [what you'd see if true]
- **Rejecting:** [what you'd see if false]
- **Potential gap explained:** ~X%
```

**Format rules (cross-stack contract — every hypothesis must include all 6 sub-fields):**

| Field | Required | Notes |
|---|---|---|
| `### N. [Short name] — Priority: HIGH / MEDIUM / LOW` | yes | Numbered 1-through-N matching the testability ranking |
| `**If** X, **then** Y, **because** Z` | yes | All three clauses present (Critic Gate 5); "then" names a specific metric (Gate 6); "because" names a mechanism |
| `**Deciding data:** [data point]` | yes | Single data point that confirms or rejects this hypothesis |
| `**Source:** [Tool → Report → Metric]` | yes | Full path (Critic Gate 7); "check analytics" fails the gate |
| `**Owner:** [person/team]` | yes | Named person or team |
| `**Confirming:** [what you'd see if true]` | yes | Specific observable |
| `**Rejecting:** [what you'd see if false]` | yes | Falsifiability requirement |
| `**Potential gap explained:** ~X%` | yes | Estimate of how much of the gap this hypothesis would account for if Confirmed |

**Count:** 3-7 hypotheses typical (Critic Gate 2: ≥3 leaf nodes → ≥3 hypotheses minimum).

### Phase 3: Root Cause Verdict

#### Verdict Table

```markdown
## Phase 3: Root Cause Verdict

### Verdict Table

| # | Hypothesis | Verdict | Evidence | Gap |
|---|-----------|---------|----------|-----|
| 1 | [Short name] | Confirmed / Rejected / Inconclusive | [Specific data cited] | ~X% |
| 2 | ... | ... | ... | ... |
```

**Column rules (cross-stack contract — do not change without atomic update of consumers):**

| Column | Type | Notes |
|---|---|---|
| # | integer | Matches Phase 2 hypothesis numbering |
| Hypothesis | string | Short name from Phase 2 |
| Verdict | enum: Confirmed / Rejected / Inconclusive | Exact casing matters — downstream consumers grep these strings |
| Evidence | string | Specific data cited (Critic Gate 9); "seems likely" fails |
| Gap | percentage | Estimated gap explained, format `~X%` |

#### Root Cause Statement

```markdown
### Root Cause Statement

**Root Cause 1 (~X% of gap):** [Cause], evidenced by [data].
[One sentence explaining the mechanism.]

**Root Cause 2 (~Y% of gap):** [Cause], evidenced by [data].
[One sentence explaining the mechanism.]

**Unexplained (~Z%):** [Description]. Next data needed: [what], from [where].
```

**Format rules:**
- Each Confirmed verdict produces one numbered Root Cause line (`**Root Cause N (~X% of gap):**`).
- Gap percentages across all Root Cause lines + Unexplained line must sum to ~100% (Critic Gate 10).
- "Unexplained" is mandatory even if 0% — write `**Unexplained (~0%):** All identified causes confirmed against the gap.`

### Next Step

```markdown
## Next Step

Run `prioritize` targeting:
1. [Root cause 1 — specific aspect to solve]
2. [Root cause 2 — specific aspect to solve]
```

This block is **verbatim** — downstream `forsvn` and `prioritize` grep the literal `"Run "` + backtick + `"prioritize"` + backtick + `" targeting:"` phrase for chain handoff detection.

---

## Optional sections (append only when applicable)

### Known Issues (only if critic FAIL loops hit cap and status is `done_with_concerns`)

```markdown
## Known Issues

[List the critic's last-cycle verdict verbatim, the 10-point gates that failed, the agent that owns each, and the reason the loop stopped.]
```

### Change Log (only on re-run)

```markdown
## Change Log

- [YYYY-MM-DD] [What changed and why — e.g., "Metric stabilized at 3.8% vs prior 3.2% baseline. Re-ran tree; Root Cause 2 now Resolved; Root Cause 1 persists."]
```

---

## Date format

ISO-8601 (`YYYY-MM-DD`). Never `MM/DD/YYYY` or relative ("last Tuesday").

## Number format

- **Percentages:** one decimal place by default (`3.2%`, `40.0%`), no trailing zeros for whole numbers (`5%` not `5.0%`).
- **Gap percentages in Verdict Table + Root Cause Statement:** `~X%` form (the tilde indicates estimate).
- **Currency:** prefix symbol (`$120`), thousands separator (`$1,800`).
- **Counts with periods:** `200 weekly signups` not `200`.

## Citation format (in Evidence column)

Cite specific data + source path. Lead with the data point, follow with the source:
> "Paid signup rate dropped 3.5% → 1.2% on May 14 per Meta Ads Manager → Performance → Conversions report"

Vague citations fail Critic Gate 9. "Seems likely" is not Confirmed. "Analytics shows X" is too vague — name the specific report.

---

## Anti-patterns in formatting

- **Renaming columns in the Verdict Table.** Cross-stack contract breaks; downstream consumers skip rows.
- **Reordering Phase 1 / Phase 2 / Phase 3 / Next Step.** Same problem — consumers parse by section order.
- **Omitting External Factor Scan rows when all are Ruled Out.** All 6 rows must be present — that's how Critical Gate 2 ("don't skip external factors") gets visible compliance.
- **Plain ASCII tree characters instead of box-drawing.** Downstream parsers expect `├──`, `│`, `└──`. Substituting `|--`, `|`, `\\__` breaks them.
- **Hypotheses missing one of the 6 sub-fields.** Each is load-bearing; partial entries fail Critic Gate 5-7.
- **Root Cause Statement without Unexplained line.** Even if 0%, write the line. Critic Gate 10 checks that percentages sum to ~100% including Unexplained.
- **Verbatim Next Step block paraphrased.** Downstream chain detection greps the literal `"Run \`prioritize\` targeting:"` phrase.
- **Verdicts like "Confirmed (?)" or "mostly Confirmed".** Enum strict: Confirmed / Rejected / Inconclusive. No qualifiers.
