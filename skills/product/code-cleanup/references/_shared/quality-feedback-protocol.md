<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

# Quality Feedback Protocol

Cross-skill feedback loop for turning measured outcomes, reviewer findings, and operator overrides into reusable skill memory without polluting canonical artifacts.

## When To Use

Apply this protocol after:

- An eval-loop cycle writes a `keep`, `discard`, `watch`, or `blocked` result.
- A critic gate is overridden by the operator.
- A fresh-eyes review finds a repeatable rubric gap.
- A humanize pass is used on a skill-produced artifact that still has named entities, claims, URLs, numbers, or formatting constraints.
- A research artifact has been consumed by multiple downstream loops or contradicted by downstream evidence.

## Learning Promotion To Experience

Promote a loop learning into `skills-resources/experience/` only when the evidence is strong enough to reuse across sessions.

Promotion criteria:

1. The source result is `keep`, not `watch`, `discard`, or `blocked`.
2. The evidence is either three consecutive `keep` ratings across separate cycles OR one `keep` finding with explicit operator confirmation that it is reusable.
3. The evaluation has a named metric source, measurement window, and confidence note.
4. The learning describes a reusable pattern, not a one-off execution detail.
5. The learning names its scope: audience, offer, channel, product surface, or brand context.
6. The target experience domain is explicit.

Domain routing:

| Learning Type | Experience File |
|---|---|
| Audience behavior, objections, language | `skills-resources/experience/audience.md` |
| Offer economics, pricing, buying trigger | `skills-resources/experience/business.md` |
| Product mechanism, claim boundary, feature proof | `skills-resources/experience/product.md` |
| Brand voice, trust pattern, taboo | `skills-resources/experience/brand.md` |
| Goal, metric, channel result, campaign rule | `skills-resources/experience/goals.md` |

Append format:

```markdown
## YYYY-MM-DD - [dimension key]

Source: [loop/eval artifact path]
Confidence: high | medium
Applies when: [scope]
Learning: [one reusable sentence]
Do not apply when: [known boundary]
```

Do not promote weak, confounded, or single-anecdote findings. Keep them in the loop's `learnings.md`.

## Quality Dashboard

Maintain a living dashboard when a project has repeated evals or reviewer findings. Full schema and helper usage live in `references/_shared/quality-dashboard-spec.md`.

```text
.agents/skill-artifacts/meta/records/quality-dashboard.json
```

Suggested shape:

```json
{
  "updated": "YYYY-MM-DD",
  "skills": {
    "skill-name": {
      "invocations": 12,
      "critic_pass": 8,
      "critic_fail": 3,
      "done_with_concerns": 1,
      "avg_rewrite_cycles": 0.7,
      "avg_rubric_score": "52/70",
      "dominant_fail_dimension": "claim substantiation"
    }
  },
  "loops": {
    "loop-slug": {
      "latest_cycle": 3,
      "latest_status": "keep",
      "primary_metric": "conversion_rate",
      "latest_value": "3.4%",
      "quality_risk": "low | medium | high",
      "next_action": "one sentence"
    }
  },
  "rubrics": {
    "skill-name:dimension": {
      "overrides": 2,
      "last_review": "YYYY-MM-DD",
      "action": "watch | revise | extract-shared-rubric"
    }
  }
}
```

Create the dashboard when any of these thresholds are met:

- a second eval-loop result exists in the project;
- a critic override is logged;
- a fresh-eyes review finds a repeated rubric or post-humanize regression issue;
- the user asks for quality tracking.

After creation, update it on every eval-loop result, critic override, and fresh-eyes report that changes a skill/rubric/loop quality signal. Do not create it for a single isolated successful run with no quality finding.

Use the helper when possible:

```bash
bun scripts/update-quality-dashboard.ts --skill ad-copy --invocations 1 --critic-pass 1
```

## Cross-Skill Feedback

When an evaluator repeatedly finds an upstream construction issue, preserve the signal in the smallest durable place:

1. **One loop only:** keep it in that loop's `learnings.md`.
2. **Reusable audience/offer/product truth:** promote to `skills-resources/experience/`.
3. **Rubric gap shared across skills:** update or create a shared rubric in `references/_shared/shared-critic-rubrics.md`.
4. **Skill-specific construction flaw:** propose a targeted SKILL.md or agent edit for the producing skill; do not silently mutate the skill during an eval run.

Example: if `lp-eval` repeatedly finds that `lp-brief` produces weak proof placement, log the pattern in the loop, promote the reusable proof rule to experience if evidence is strong, and open a skill-improvement note for `lp-brief` rather than burying the issue in the evaluator output.

## Post-Humanize Regression Check

Any skill that runs `humanize` on a generated artifact must preserve meaning before accepting the rewrite.

Required checks:

1. Named entities, product names, URLs, legal disclaimers, numbers, prices, dates, claims, and citations are unchanged unless the user explicitly requested edits.
2. Specificity did not drop: concrete mechanisms, proof points, and audience details remain present.
3. CTA and deliverable format are unchanged.
4. Compression did not remove mandatory caveats or substantiation.
5. If the original had a critic score or rubric pass, the humanized output still satisfies the same pass/fail gate.

If a protected token is missing, rerun humanize with protected-token instructions or revert that section. Never accept a smoother rewrite that weakens the underlying argument or factual contract.

## Research Artifact Evaluation

Canonical research files are not scored by generic taste rubrics. Evaluate them through downstream usefulness.

Trigger a research artifact review when any of these happen:

- Three or more downstream strategy/execution artifacts cite the same research finding.
- Two or more loop evals contradict the same ICP, market, or problem assumption.
- A user flags that research-driven outputs feel off-target.
- A major market shift makes the research stale.

Review output belongs in:

- The relevant loop's `evals/` folder when the evidence comes from one measurable initiative.
- `.agents/skill-artifacts/research/evals/` when the evaluation spans multiple loops or canonical research artifacts.

Update canonical `research/` only as a separate, explicit revision after the evidence is accepted.

## Critic Override Log

When the operator overrides a critic or asks to ship despite a failed dimension, log it here if the project has repeated quality work:

```text
.agents/skill-artifacts/meta/records/critic-overrides.md
```

Entry format:

```markdown
## YYYY-MM-DD - [skill] - [dimension]

Artifact: [path]
Critic verdict: [fail/pass-with-concerns]
Operator decision: [ship/revise/ignore]
Reason: [one sentence]
Follow-up: [none | watch metric | revise rubric | extract shared rubric]
```

If the same skill dimension is overridden three times with valid operator reasoning, treat the rubric as miscalibrated and revise it.

## Shared Critic Rubric Extraction

Extract a shared rubric when the same quality dimension appears in three or more skills with materially identical checks.

Good candidates:

- Claim substantiation
- Protected-token preservation
- Pattern-interruption specificity
- Audience specificity
- Proof strength
- Mechanism distinctness

Bad candidates:

- Vague "quality" or "polish" checks
- Domain-specific judgment that loses precision when generalized
- Anything that only exists in one skill

Shared rubrics should live in `references/_shared/shared-critic-rubrics.md` and be referenced from skill-specific critics. Keep the domain-specific application in the skill.

## Learned-Rules Hygiene

The learned-rules file is for active behavioral corrections, not an append-only junk drawer.

When a review or eval loop touches learned rules:

1. Mark whether the rule is `active`, `absorbed`, `stale`, or `duplicate`.
2. If a rule has been absorbed into a SKILL.md, agent file, or shared reference, mark it `absorbed` and cite the destination path.
3. If two rules say the same thing, keep the more specific one and mark the other `duplicate`.
4. If a rule has not applied in 90 days and no longer matches current repo structure, mark it `stale`.
5. Keep high-priority safety and routing rules even if old.

Do not auto-delete learned rules during normal skill execution. Archive or prune only when the user asks for cleanup.

## Critic Consensus

Use critic consensus for high-stakes artifacts: legal/compliance-sensitive copy, paid acquisition with meaningful spend, security/data changes, public announcements, or canonical research updates.

Minimum pattern:

1. Primary critic evaluates against the skill rubric.
2. Second critic evaluates only the highest-risk dimensions.
3. Resolver compares disagreements and records the decision.

If critics disagree on a hard gate, do not average scores. Resolve the specific dimension or return `DONE_WITH_CONCERNS` / `BLOCKED`.
