# Agent Manifest — measure-results

Sequential 4-agent graph. Each agent is a fresh dispatch; state passes forward as the structured output of the prior.

| # | Agent | File | In | Out |
|---|---|---|---|---|
| 1 | Metric Ingest | [`../agents/metric-ingest-agent.md`](../agents/metric-ingest-agent.md) | raw results + channel | normalized metrics table + Gaps |
| 2 | Diagnosis | [`../agents/diagnosis-agent.md`](../agents/diagnosis-agent.md) | metrics + channel pack + hypotheses | attribution table + keep/drop/test + hypothesis verdicts |
| 3 | Pack Feedback | [`../agents/pack-feedback-agent.md`](../agents/pack-feedback-agent.md) | diagnosis + channel pack | 3 write-back drafts (pack changelog · performance row · hosted feed) |
| 4 | Critic | [`../agents/critic-agent.md`](../agents/critic-agent.md) | the read + the 3 drafts | verdict; on PASS the write-backs commit |

## Dispatch
- **Default (multi):** all 4 in sequence; the critic gates the write-back.
- **`--fast` (single):** Ingest + Diagnosis inline, skip the trend layer; Pack Feedback + Critic still run (the write-back + gate are never skipped).
- **Revision:** Critic FAIL → one cycle back to Diagnosis (attribution weak) or Pack Feedback (write-back wrong). Second FAIL → BLOCKED.

## The 5-dimension rubric
Lives in [`rubric.md`](rubric.md): Attribution · Falsifiability · Honesty · Actionability · Write-back fidelity. Pass ≥35/50, no dim 0.

## Pack grounding (legibility)
The Diagnosis + Pack Feedback agents load the channel pack via the soft client first (`references/_shared/hosted-pack-client.md`): a Pro client diagnoses against the *current* pack; a free client against the build-time mirror. Either way the read narrates `pack_verified` (legibility convention).
