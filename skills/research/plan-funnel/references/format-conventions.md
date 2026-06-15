# Format Conventions — funnel-planner Artifact

> Load when writing the output artifact. Encodes the canonical artifact template (frontmatter + header block + 6 numbered body sections), the Target Table column schema (cross-stack contract — consumed by campaign-plan and downstream measurement), the Channel→Stage Map schema, the Three-Outcome Validation table, and the Validation/Baselines blocks.

---

## Artifact path

`docs/forsvn/artifacts/meta/records/targets-[YYYY-MM-DD].md`

On re-run: rename existing artifact to `targets.v[N].md` (increment N from the highest existing version) and create new at incremented version. Never overwrite.

---

## Frontmatter (required)

```yaml
---
skill: plan-funnel
version: [N]                          # increment on re-run
date: [YYYY-MM-DD]
status: done | done_with_concerns | blocked | needs_context
---
```

**Field semantics:**
- `version`: integer, 1 on first run, increment on every subsequent run for the same initiative-set.
- `date`: artifact creation date, ISO-8601. Drives the 30-day staleness check on downstream consumers.
- `status`: per the Completion Status block in SKILL.md.

---

## Body sections (in order — schema is the cross-stack contract)

The artifact opens with a header block, then 6 numbered sections in the order below. Downstream consumers (campaign-plan, eval-loop, future funnel-planner re-runs) parse by section header — renaming or reordering breaks the contract.

### Header block (always, before section 1)

```markdown
# Targets

**Growth Motion:** [PLG / SLG / Hybrid]
**Funnel Model:** [PLG Funnel / SLG Funnel / AARRR / AIDA / TOFU-MOFU-BOFU]
**Primary Model:** [if Hybrid — which model is primary for target-setting; omit otherwise]
```

### 1. Funnel Stages

Stage definitions from the selected model, with initiative-to-stage mapping. Always a table.

```markdown
## Funnel Stages

| Stage | Definition | Key Metric | Mapped Initiatives |
|-------|------------|------------|-------------------|
| [e.g. Visitor] | [How users enter this stage] | [e.g. Unique visitors] | [Which initiatives target this stage] |
```

### 2. Target Table — the load-bearing schema

```markdown
## Target Table

| Initiative | Metric | Baseline | Benchmark (Good) | Target | Variance vs. Benchmark | Justification | Owner |
|-----------|--------|----------|-------------------|--------|----------------------|---------------|-------|
| [Name] | [Metric] | [Current] | [Industry ref] | [Goal] | [+X% above benchmark or within range] | [Why achievable — cite evidence] | [Person] |
```

**Column rules (cross-stack contract — do not change without atomic update of consumers):**

| Column | Type | Notes |
|---|---|---|
| Initiative | string | Verbatim from `prioritize-*.md` |
| Metric | string | The thing being moved (e.g., "Paid visitor signup rate") |
| Baseline | number + unit | Current value. Zero "TBD" allowed (Critical Gate 1). |
| Benchmark (Good) | range or number + source | E.g., "3-5% (B2B SaaS median)". Cite source in `references/benchmarks.md` |
| Target | number + unit | The goal. Must satisfy 70% test. |
| Variance vs. Benchmark | "+X%" or "within range" | Flag any target >1.5x above good-tier benchmark — requires explicit Aspirational Target justification |
| Justification | string | Baseline + improvement factor + reasoning. Cite evidence (case study, prior data, change scenario). |
| Owner | string | One named person. "The team" / a department / "TBD" → orphan target, fail. |

**Aspirational flag:** if Variance > 50% above good-tier benchmark, add a row below the table:
> "[Initiative] target requires significantly above-average performance. Justification: [why your situation is different]."

### 3. Channel → Funnel Stage Map

Which channels from the 9-channel map (see `playbook.md`) drive which funnel stages. **Include only channels active in your strategy.**

```markdown
## Channel → Funnel Stage Map

| Channel | Primary Stage | Secondary Stage | Key Metric | Budget Type |
|---------|--------------|-----------------|------------|-------------|
| [e.g. Search engines] | [e.g. Impression → Click] | [e.g. Lead] | [e.g. CTR, CPL] | [Paid / Organic / Both] |

**9-Channel Reference:** Search engines/GEO, Store/Listing platforms, Bounty/Info platforms, News, Forums/Communities, Social media, IRL (OOH/Events/POS), Mailbox (email), SMS.
```

**Rule:** if a channel is used differently than the default tactic (e.g., paid Reddit ads vs. organic forum engagement), create separate rows.

Reference: `references/funnel-models.md` for typical stage assignments by growth motion.

### 4. Three-Outcome Validation — Business / Brand / Community

Both PLG and SLG motions feed three outcomes. This section checks coverage; gaps are flagged but not blocking.

```markdown
## Three-Outcome Validation

| Outcome | Metric(s) | Current | Target | Status |
|---------|-----------|---------|--------|--------|
| **Business** | [Revenue, conversion, unit economics] | [value] | [value] | [Covered / Gap] |
| **Brand** | [Branded search volume, social mentions, NPS, share of voice] | [value] | [value] | [Covered / Gap / N/A] |
| **Community** | [Active members, engagement rate, UGC volume, forum activity] | [value] | [value] | [Covered / Gap / N/A] |
```

**Status definitions:**
- **Covered** — metrics exist with baselines and targets
- **Gap** — outcome is relevant but no metrics defined. Recommend adding before execution.
- **N/A** — outcome is legitimately out of scope for this business. **Justify:** e.g., "B2B enterprise with no user community — Community is N/A. Brand is tracked via branded search only."

**Hard rule:** Business must always be Covered (no exceptions). Brand and Community may be N/A with justification — this is not a failure. Gaps without justification are flagged in the Validation section.

### 5. Validation

Always present. Three sub-sections.

```markdown
## Validation

### Anti-Patterns: [None detected / List any found + fixes]
### 70% Test: [Pass/fail per target — name the target + the 70% threshold + whether hitting it is meaningful]
### LTV:CAC Check: [Ratio] — [Healthy / Flag]
```

If LTV:CAC <3:1 and acquisition targets are present → status downgrades to `done_with_concerns` minimum (or `BLOCKED` if economics are catastrophic), per Critical Gate 4 in SKILL.md.

### 6. Baselines

Always present. Stable user-profile state — these numbers feed the next cycle's measurement and the experience/business.md write-back.

```markdown
## Baselines

Every target in this table is also the baseline for downstream measurement. Keep these numbers authoritative — if the underlying metric drifts >20%, update this table before reusing baselines elsewhere. Stale baselines produce misleading lift targets.
```

This paragraph is verbatim. Don't paraphrase — downstream skills grep for the phrase "baseline for downstream measurement."

---

## Optional sections (append only when applicable)

### Aspirational Target Flags (only if any target >1.5x above good-tier benchmark)

```markdown
## Aspirational Target Flags

| Initiative | Target | Good Benchmark | Variance | Justification for Outperformance |
|-----------|--------|---------------|----------|--------------------------------|
| [Name] | [Target] | [Benchmark] | [+X% above] | [Why your situation enables this] |
```

### Pricing Health Signals (only if revenue targets involved and signals exist)

```markdown
## Pricing Health Signals

| Signal | Finding | Action |
|--------|---------|--------|
| [Conversion rate >40% / Churn <3% / etc.] | [What the data shows] | [Recommended action] |
```

### Known Issues (only if critic FAIL loops hit cap and status is `done_with_concerns`)

```markdown
## Known Issues

[List the critic's last-cycle verdict verbatim, the gates that failed, the agent that owns each, and the reason the loop stopped.]
```

### Change Log (only on re-run)

```markdown
## Change Log

- [YYYY-MM-DD] [What changed and why — e.g., "Bumped Restore Paid Targeting target from 3.0% to 3.5% per Q3 measurement showing baseline already recovered to 1.6%."]
```

---

## Date format

ISO-8601 (`YYYY-MM-DD`). Never `MM/DD/YYYY` or relative ("last Tuesday").

## Number format

- **Percentages:** one decimal place by default (`3.2%`, `40.0%`), no trailing zeros for whole numbers (`5%` not `5.0%`).
- **Currency:** prefix symbol (`$120`), thousands separator (`$1,800`), no decimals for whole amounts.
- **Ratios:** `X:1` form (`15:1`, `3:1`).
- **Counts:** thousands separator (`200`, `10,000`).

## Citation format (in Justification column)

Inline parenthetical:
> "Was 3.5% before targeting change; conservative recovery with lookalike audience (prior Q1 benchmark)"

Cite the source where the evidence lives — prior artifact path, internal dashboard, or `references/benchmarks.md` table row. Don't fabricate URLs.

## Cycle index agreement

If the artifact is consumed by an eval-loop:
- `version` in frontmatter = the cycle index in `.forsvn/loops/[slug]/results.tsv`
- Date in filename = artifact creation date (NOT the cycle measurement date)

---

## Anti-patterns in formatting

- **Renaming columns in the Target Table.** Cross-stack contract breaks; downstream consumers skip rows.
- **Reordering body sections.** Same problem — consumers parse by header order.
- **Omitting the Channel → Funnel Stage Map section.** Even if empty for a Route C bump, include the section with "No channel changes this cycle."
- **Skipping the Three-Outcome Validation table.** Critical Gate 6 — every funnel must account for all three outcomes (with N/A + justification permitted).
- **Free-form Justification column.** Every cell must include baseline + improvement factor + reasoning. "Because we're going to try harder" is not a justification.
- **"TBD" anywhere in the Baseline column.** Critical Gate 1 — zero TBDs. Use benchmark + low-confidence flag if no user data.
