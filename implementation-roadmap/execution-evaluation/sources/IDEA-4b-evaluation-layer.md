# Evaluation Layer (Autoresearch)

> **STATUS: SUPERSEDED** (2026-05-16). Execution plan moved to `ROADMAP.md` §5 (E5). Source material retained for reference.

## The Gap

The eval-loop scaffold exists and works, but the evaluation layer has gaps:

| What exists | What's missing |
|---|---|
| `eval-loop` scaffold (program.md, context.md, results.tsv, learnings.md) | No standalone quality dashboard file |
| `short-form-eval` skill | `short-form-eval/references/rubric.md` is empty — no rubric on disk |
| `lp-eval` skill | No `ad-eval`, `content-eval`, `campaign-eval` skills |
| Shared critic rubrics at `meta-skills/references/shared-critic-rubrics.md` | No critic-introspection protocol (operator overrides of critic FAIL aren't logged) |
| Quality-feedback-protocol at `meta-skills/references/quality-feedback-protocol.md` | No automated rubric revision trigger |

## Phase 1: Fill Existing Gaps

### 1.1 Create `short-form-eval/references/rubric.md`

The rubric exists conceptually in the short-form-eval SKILL.md (4-dimension provisional rubric) but needs to be extracted to a reference file following the shared-rubrics pattern.

**What goes in it:**
- 4 dimensions with definitions and scoring criteria (0-10)
- Falsifiability guidelines per dimension
- Example of a strong score justification vs weak
- Revision protocol (mandatory after cycle 2-3)

**Location:** `marketing-skills/skills/short-form-eval/references/rubric.md`

### 1.2 Create quality dashboard reference

The eval-loop skill and quality-feedback-protocol reference a "create or update the quality dashboard" step but no standalone dashboard definition exists.

**What goes in it:**
- Per-skill tracking: invocations, critic PASS/FAIL count, avg rewrite cycles, avg rubric scores
- Simple JSON blob format — not a database, just a append-only TSV or JSON file
- Location in a new eval loop: `skills-resources/meta/loops/quality-dashboard/`

**Implementation:** Add to `meta-skills/references/quality-dashboard-spec.md` as a separate reference doc.

### 1.3 Add critic-introspection protocol

When an operator overrides a critic FAIL (i.e., accepts output that the critic rejected), the system should record:

- Which skill + which run
- Which critic dimension failed
- Operator's reason (if given)
- Timestamp

After >3 overrides for the same dimension without a rubric revision, flag the critic for recalibration.

**Implementation:** Add a section to `meta-skills/references/shared-critic-rubrics.md` and add a data file at `skills-resources/meta/critic-overrides.tsv`.

## Phase 2: New Evaluators

### 2.1 Ad Eval (`ad-eval`)

**What it evaluates:** Published Meta ad campaigns (cold-traffic and retargeting).

**Measurable metrics:**
- CTR (click-through rate)
- CPA (cost per acquisition)
- ROAS (return on ad spend)
- Frequency / saturation signals
- Creative fatigue indicators

**How it works:**
- Reads the ad-copy artifact that was used to create the ads
- User inputs real campaign results (CTR, CPA, spend, conversions)
- Scores the creative performance against the brief's hypothesis
- Writes evaluation to the campaign's eval-loop workspace

**Location:** `marketing-skills/skills/ad-eval/`

### 2.2 Content Eval (`content-eval`)

**What it evaluates:** Published marketing copy (landing page sections, email sequences, website copy).

**Measurable metrics:**
- Engagement rate (time on page, scroll depth)
- Click-through to next action
- Conversion rate (if trackable)
- Qualitative: audience surveys or feedback

**How it works:**
- Reads the copywriting or lp-brief artifact used
- User inputs real engagement/conversion data
- Scores copy effectiveness against the brief's hypotheses
- Writes to the relevant eval-loop

**Location:** `marketing-skills/skills/content-eval/`

### 2.3 Campaign Eval (`campaign-eval`)

**What it evaluates:** Multi-channel campaign performance.

**Measurable metrics:**
- Total reach / impressions
- Lead volume and quality
- Revenue attributed
- CAC (customer acquisition cost)
- Channel-level breakdown

**How it works:**
- Reads the campaign-plan artifact
- User inputs multi-channel results
- Scores channel performance, messaging effectiveness, budget allocation
- Recommends budget reallocation for next cycle
- Writes to the campaign eval-loop

**Location:** `marketing-skills/skills/campaign-eval/`

## Phase 3: Autoresearch-Inspired Improvement Protocol

Adopt the Karpathy "autoresearch" pattern for all evaluation loops:

```
1. Run skill → produce artifact (brief, copy, plan)
2. Execution happens (outside stack or via production layer)
3. Collect real results (user provides metrics)
4. Evaluation skill scores output against results
5. EVAL OUTPUTS get promoted:
   - High-confidence findings → experience/domain.md
   - Low-confidence → stay in loop learnings.md
   - Quality metrics → quality dashboard
6. Next skill invocation reads:
   - Previous artifacts (what was produced)
   - Previous eval data (how it performed)
   - Current context (what's new)
7. Skill generates improved output based on all of the above
```

### Key constraint

Evaluation skills do NOT require full automation. The user provides real-world metrics. The eval skill's job is to interpret those metrics against the brief's hypotheses and extract actionable learnings. If the user has no metrics, the eval doesn't run.

### Rubric revision trigger

Each eval skill should flag its own rubric for revision when:
- >3 consecutive scores are within 1 point of each other (rubric not discriminating)
- Operator overrides critic >3 times for the same dimension
- New platform feature changes what's measurable (e.g., TikTok removes swipe-up)
