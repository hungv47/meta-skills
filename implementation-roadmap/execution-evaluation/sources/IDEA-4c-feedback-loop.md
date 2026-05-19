# Feedback Loop Architecture

> **STATUS: SUPERSEDED** (2026-05-16). Execution plan moved to `ROADMAP.md` §6 (E6). Architecture diagrams retained for reference.

## The Goal

Skills should get better over time. When a skill runs for the second time, it should produce better output than the first time — because it reads what it produced before and how that performed.

## Current Problem

```
┌─────────────┐     ┌─────────────┐
│  Skill Run 1 │────→│  Artifact   │
└─────────────┘     └─────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │  Real World │
                    │  (outside)  │
                    └─────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │  Eval Data  │  ← stays in loop folder
                    └─────────────┘

┌─────────────┐
│  Skill Run 2 │────→ starts fresh, no context from Run 1
└─────────────┘
```

## Target Architecture

```
┌─────────────┐     ┌─────────────┐
│  Skill Run N│────→│  Artifact   │
└─────────────┘     └─────────────┘
       ▲                    │
       │                    ▼
       │             ┌─────────────┐
       │             │  Real World │
       │             │  (outside)  │
       │             └─────────────┘
       │                    │
       │                    ▼
       │             ┌─────────────┐
       │             │  Eval Data  │
       │             └─────────────┘
       │                    │
       │         ┌──────────┴──────────┐
       │         ▼                    ▼
       │  ┌────────────┐     ┌──────────────┐
       │  │experience/ │     │ Quality      │
       │  │ domain.md  │     │ Dashboard    │
       │  └────────────┘     └──────────────┘
       │         │                    │
       └─────────┴────────────────────┘
           Next skill invocation reads all three
```

## What Needs to Change

### 1. Create the `experience/` Directory

This is the highest-priority gap. The AGENTS.md root doc specifies `.agents/experience/{domain}.md` but skills reference `skills-resources/experience/`. Neither exists on disk.

**Resolution:** Pick one path and make it canonical.

**Recommendation:** Use `skills-resources/experience/` — it's already what the eval-loop skill references (SKILL.md line 60, line 216) and it keeps all cross-skill knowledge in the `skills-resources/` tree.

**Structure:**
```
skills-resources/experience/
├── README.md
├── content.md        # What copy/messaging works for this audience
├── product.md        # What product positioning resonates
├── audience.md       # Behavioral insights from eval data
├── patterns.md       # Reusable patterns discovered across runs
└── business.md       # Business constraints, pricing, funnel insights
```

**Seed content:** Empty directories with README explaining the purpose. Content accumulates as eval loops promote findings.

**Implementation:** Create directories + README. Update AGENTS.md to reference the canonical `skills-resources/experience/` path.

### 2. Promote Eval Findings to `experience/`

The eval-loop skill already documents this (line 216). The problem is it doesn't happen in practice because:

- No `experience/` directory exists to promote TO
- No criteria for what qualifies as "high-confidence keep"

**Add to quality-feedback-protocol.md:**
- **Promotion criteria:** ≥3 consecutive "keep" ratings in results.tsv across separate cycles, or a single finding with explicit operator confirmation ("this is reusable")
- **Format:** a dated entry in the relevant `experience/{domain}.md` file with backlink to the originating eval cycle report
- **Don't promote:** "discard" items even once; "watch" items only after they resolve to "keep"

### 3. Skills Read `experience/` Before Invocation

The pre-dispatch protocol already reads `experience/` as a warm-start signal. But since the directory doesn't exist, this step is a no-op.

**What needs to change:** Nothing architecturally — the read loop exists. The gap is just the data. Once skills populate `experience/`, the pre-dispatch protocol automatically loads it.

### 4. Quality Dashboard

Create a lightweight quality dashboard that tracks per-skill quality trends.

**Location:** `skills-resources/meta/loops/quality-dashboard/`

**Format:** A simple `dashboard.tsv` with columns:
- date
- skill
- invocation_count
- critic_pass_count
- critic_fail_count
- avg_rewrite_cycles
- avg_rubric_score

**Implementation:** Add a reference doc `meta-skills/references/quality-dashboard-spec.md` with the schema and update instructions. The eval-loop skill's "create or update quality dashboard" step should write to this file.

### 5. Cross-Skill Learning Propagation

Currently, findings from `lp-eval` (landing page conversion data) don't reach `lp-brief` or `short-form-brief` or `ad-copy`. A conversion insight about the pricing page should benefit every skill that touches pricing copy.

**How to fix:**
- When a high-confidence finding is promoted to `experience/content.md` or `experience/audience.md`, it's automatically available to ALL skills via the pre-dispatch read.
- Tag findings with relevant skill domains so the pre-dispatch filter can surface relevant ones.
- Example: "Pricing page converts 2x better with annual billing highlighted" → tagged `content`, `pricing` → loaded when ANY content or pricing skill runs next.

### 6. Artifact Traceability

Every artifact should link back to its source skill run and forward to its eval data.

**Implementation:** Add a `provenance` section to each artifact's frontmatter:

```yaml
provenance:
  skill: lp-brief
  run_date: 2026-05-14
  input_artifacts:
    - research/icp-research.md
    - research/product-context.md
  output_eval:
    - skills-resources/marketing/loops/pricing-page-redesign/evals/2026-06-01-cycle-1.md
```

This makes it possible to trace: "this artifact was created by lp-brief → it was evaluated → the eval found X → the next lp-brief run should read both."

## Implementation Sequencing

| Step | What | Effort | Dependencies |
|---|---|---|---|
| 1 | Create `skills-resources/experience/` with README + empty domain files | Low | None |
| 2 | Update AGENTS.md to fix canonical path | Low | Step 1 |
| 3 | Add promotion criteria to quality-feedback-protocol.md | Low | Step 1 |
| 4 | Create quality-dashboard-spec.md reference | Low | None |
| 5 | Add provenance frontmatter to artifact templates | Medium | Core skills |
| 6 | Implement promotion pipeline in eval-loop | Medium | Steps 1-3 |
| 7 | Add cross-skill tagging to experience/ entries | Medium | Step 6 |

Steps 1-4 can run in parallel. Steps 5-7 depend on the foundation.
