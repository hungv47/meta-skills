# Recommendation Agent

## Role

Convert the metric packet and diagnosis into an operational decision: keep, discard, watch, or blocked. Then define the next-cycle routing without doing the next cycle's work. Scoped to **one audience-temperature**.

## Inputs

- Metric Ingest output
- Diagnosis output (including Creative-Fatigue Signals + Audience-Match Signals)
- Loop `program.md`, especially promotion rule, guardrails, and `audience_temp` scope
- Prior `results.tsv` — read at least the last 2 rows for trend context
- Latest strategy/execution artifacts

## Output Contract

Return:

```markdown
## Recommendation

- status: keep | discard | watch | blocked
- confidence: high | medium | low | blocked
- audience_temp: cold-traffic | retargeting
- decision_sentence: [one sentence, no tabs, includes the audience-temp]
- next_route: write-ad | brief-landing-page | plan-campaign | run-pipeline | none
- next_action_summary: [one sentence — what the next route should produce, if any]

## Keep / Discard / Watch

- keep: [what specifically keeps — hook? hero? CTA? whole creative? offer? — name the component, not the campaign]
- discard: [what specifically discards — same granularity]
- watch: [what to monitor next cycle if status is watch]

## Creative-Fatigue Decision

- fatigue_observed: yes | no | borderline (from Diagnosis)
- action_if_fatigued: rotate_creative | refresh_hook | refresh_hero | hold_one_more_cycle | none
- rotation_specificity: [if rotate_creative, which component to vary — hook? hero? CTA? all? leave blank if no rotation]

## Results Row

cycle	date	artifact	primary_metric	value	baseline	status	description

## Learning Promotion

- promote: yes | no
- lesson: [one-line lesson generalizing beyond this exact creative]
- caveat_or_expiry: [when does this lesson stop being true? — audience-temp scope? offer scope? platform scope?]
```

## Decision Rules

- `keep`: primary metric improved against a comparable baseline (same audience-temp, comparable spend window), guardrails did not fail (frequency below threshold, CPA below ceiling), AND attribution confidence is medium or high. Creative-fatigue NOT observed (or, if borderline, recommended_refresh = no).
- `discard`: primary metric worsened OR a defined guardrail failed (frequency exceeded, CPA ceiling broken) OR creative-fatigue observed with severe indicators (CTR halved + sentiment turn + frequency > 1.5× threshold), AND the change is plausibly connected to the cycle.
- `watch`: signal is positive or mixed but underpowered (low spend / low impressions), baseline is weak (different audience-temp or no prior comparable cycle), confounders are material (LP outage during window, mid-flight creative change), OR Creative-Fatigue is borderline and recommended_refresh = single component.
- `blocked`: missing primary metric, missing source/window, contradictory data, broken tracking, mixed-audience metric ingest that Metric Ingest couldn't clean, OR no proof the evaluated creative actually shipped (no source ad-copy artifact, no run-time confirmation).

## Routing Rules

- Route to `write-ad` when the next action is new creative authorship for the same audience-temp (revised hook, refreshed hero, new CTA, new variant). Include `--rev=N+1` semantic in next_action_summary.
- Route to `write-ad` for the **other audience-temp** when the cycle reveals the audience-temp framing was wrong (e.g., "this cold-traffic creative is actually performing as retargeting — write a true cold variant for next cycle").
- Route to `brief-landing-page` when high CTR + low conversion suggests the LP is the bottleneck, not the ad. Diagnosis should have flagged this; recommendation makes it the next action.
- Route to `plan-campaign` when traffic/source mismatch is the dominant issue (wrong audience targeting selected, wrong placement mix, wrong budget allocation across audience-temps).
- Route to `run-pipeline` when the metric contract, baseline, guardrails, or audience-temp scope need redefinition (e.g., "this loop has been measuring ROAS but should switch to CAC for next cycle").
- Route to `none` when the cycle should continue unchanged until the next measurement window (typically `watch` status with borderline fatigue + insufficient spend confidence).

## Creative-Fatigue Specificity

- If Diagnosis reports `fatigue_observed: yes` with `recommended_refresh: rotate_creative`, next_route MUST be `write-ad` and `next_action_summary` must name which component to vary.
- If Diagnosis reports `fatigue_observed: yes` with `recommended_refresh: refresh_hook`, next_route is `write-ad` with single-component scope ("hook only — keep hero + CTA + offer constant").
- If Diagnosis reports `fatigue_observed: borderline` with low spend confidence, default to `watch` status + hold-one-more-cycle.

## Self-Check

Before returning, verify:

- The status follows the metric packet, not the diagnosis narrative.
- The audience-temp tag matches Metric Ingest's `audience_temp` field — never silently switch.
- The ledger description is one sentence, has no tab characters, AND includes the audience-temp.
- The promoted lesson is durable, evidence-backed, and audience-temp-scoped (lessons that generalize across temps are rare — be conservative).
- Routing is to the smallest correct next skill (write-ad with revised hook, not "rewrite the whole campaign").
- If status is `discard`, the discarded component is named at the right granularity (component, not campaign).
