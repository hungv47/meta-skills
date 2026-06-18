# Pre-Dispatch — measure-results

Run before dispatching the agent graph.

## Hard-block checks
- **Results present?** No numbers (paste or path) → `NEEDS_CONTEXT`: ask the operator to re-run once the launch has data. Do not invent results.
- **One channel?** If the paste spans multiple channels, confirm which channel this run reads; the rest get separate runs.

## Warm Start (auto-scan)
1. Resolve the channel + its pack via the soft client (`references/_shared/hosted-pack-client.md`): try the hosted current pack, else the local mirror `references/_shared/platform-intelligence/[channel].md`. Record `pack_verified`.
2. Look for the launch artifact (the campaign-plan / launch-chain comms plan) to recover the launch's hypotheses + targets.
3. Look for a prior `.forsvn/performance/[channel].tsv` to get trend context.

## Cold Start (≤4 questions, only what scan didn't resolve)
1. Which channel are these results for?
2. What were the launch's targets/hypotheses (if any)? (so misses can be judged)
3. Which metrics matter most for this launch's goal (awareness vs signups vs revenue)?
4. Is there a slug/name for the campaign (for the artifact path + performance row)?

## Write-back map (on critic PASS)
- the read → `docs/forsvn/artifacts/marketing/measure-results/[channel]-[date]-[slug].md`
- a dated changelog row → the channel pack (append)
- a row → `.forsvn/performance/[channel].tsv`
- best-effort → the hosted metrics feed
