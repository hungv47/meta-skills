# Agent Manifest — research-platform

5 agents across 2 layers.

| Agent | Layer | Role | Input | Output |
|-------|-------|------|-------|--------|
| [evidence-intake-agent](../agents/evidence-intake-agent.md) × N | L1 (parallel) | Normalize operator-supplied + public evidence for ONE platform into the evidence schema; tag every datum with source-type + `measured_at` + confidence; assign the coverage flag | brief + supplied evidence + platform | Per-platform evidence record |
| [benchmark-agent](../agents/benchmark-agent.md) | L1 (parallel) | Establish external baselines per platform (platform-typical metric ranges + current algorithm context) so owned numbers read against a reference, not in a vacuum | brief + platforms in scope | Per-platform benchmark context |
| [synthesis-agent](../agents/synthesis-agent.md) | L2 (sequential) | Assemble the artifact — Evidence Base, Per-Platform Evidence, Cross-Platform Comparison, risks — from intake + benchmark outputs | all L1 outputs | Artifact draft (all sections except Recommendations) |
| [recommendation-agent](../agents/recommendation-agent.md) | L2 (sequential) | Derive ranked recommendations; each names platform, evidence source, freshness window, confidence; gated by the per-platform coverage flag | synthesis draft + benchmark context | Recommendations section |
| [critic-agent](../agents/critic-agent.md) | L2 (final) | 5-rubric quantitative gate — citation, source-type honesty, coverage-flag accuracy, recommendation completeness, freshness; routes failures to the named agent | full merged artifact | PASS or FAIL with rewrite routing |

## Dispatch sequence

```
1. Pre-Dispatch (warm-start scan + evidence-intake prompt) — per procedures/pre-dispatch.md
2. LAYER 1 IN PARALLEL: evidence-intake-agent × N (one per platform) + benchmark-agent
3. LAYER 2 SEQUENTIAL: synthesis → recommendation → critic
4. Critic FAIL → re-dispatch named agent(s) with feedback (max 2 cycles); after cycle 2, ship done_with_concerns
5. Side effects: write artifact, run manifest-sync, experience write-back
```

`--fast` collapses to a single-pass intake + synthesis with the critic skipped — Critical Gates still enforced.

Spawn mechanics, parallel/sequential tables, critic routing, single-agent fallback, chain position, re-run triggers, skill deference: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
