---
title: Agents-Panel — Debate Walkthrough
lifecycle: canonical
status: stable
produced_by: agents-panel
load_class: EXAMPLE
---

# Worked Example — 3-Agent Debate with Mind-Change

**Load when:** the orchestrator needs a concrete anchor for what good debate output looks like — especially the synthesis section, where mind-changes and unresolved disagreements should be called out separately.

---

**Operator:** "Debate: should we use a monorepo or polyrepo for our 4-service backend? 3 agents, 3 rounds."

## Round 1 — Opening positions

**Agent 1 (Architect):**
- POSITION: Monorepo
- REASONING: Shared types prevent drift; atomic cross-service changes; tooling is mature (Bun workspaces, Turborepo); 4 services is small enough that the monorepo overhead is negligible
- PROPOSAL: Single repo with `services/{a,b,c,d}` + shared `packages/{types,utils}` folder
- CONCERNS: CI matrix gets complex; bad commits can break all services at once

**Agent 2 (Pragmatist):**
- POSITION: Polyrepo
- REASONING: Each service has its own deploy cadence; CI stays simple per repo; new engineers onboard faster; failure blast radius is one service
- PROPOSAL: 4 separate repos + 1 shared-types repo published to internal npm
- CONCERNS: Shared-types repo becomes a bottleneck; cross-service changes require coordinated PRs

**Agent 3 (Critic):**
- POSITION: Monorepo, but with strict per-service CI gates
- REASONING: Shared-types-as-separate-repo always rots in practice; cross-service refactors are common in pre-PMF startups; the "blast radius" concern is real but solvable with branch protection rules per service path
- PROPOSAL: Monorepo with path-filtered CI (Turborepo or Nx) + CODEOWNERS per service
- CONCERNS: Tooling complexity; requires discipline to maintain path-filtering rules

## Round 2 — Debate

**Agent 1 (Architect):**
- AGREEMENTS: Critic's path-filtering point is right — that's the missing piece in my Round 1 proposal
- DISAGREEMENTS: Pragmatist's "deploy cadence" concern doesn't justify polyrepo; mono can deploy per service with the right CI
- REFINED PROPOSAL: Monorepo + Turborepo + CODEOWNERS + path-filtered CI (matches Critic's refinement)
- CONFIDENCE: 9

**Agent 2 (Pragmatist):**
- AGREEMENTS: Architect + Critic are right that shared-types-as-separate-repo creates real friction. My Round 1 proposal underweighted this.
- DISAGREEMENTS: Still concerned about onboarding — monorepos have steeper local-dev setup
- REFINED PROPOSAL: Monorepo, but with a documented "hello world" path so new engineers don't have to load the whole graph mentally on day 1
- CONFIDENCE: 7 (changed from polyrepo; conceding the design but flagging the onboarding cost)

**Agent 3 (Critic):**
- AGREEMENTS: Pragmatist's onboarding concern is real; needs explicit mitigation
- DISAGREEMENTS: None significant — convergence is happening
- REFINED PROPOSAL: Monorepo + Turborepo + CODEOWNERS + path-filtered CI + a `docs/onboarding.md` with the "one-service local dev" path
- CONFIDENCE: 9

## Round 3 — Convergence check

All three agents now at confidence 8+ with aligned proposals. Early convergence triggered; Round 3 skipped.

## Synthesis

**Consensus:**
- Monorepo wins for 4-service backend at this size
- Turborepo (or Nx) for path-filtered CI
- CODEOWNERS per service to limit blast radius
- Onboarding doc with a "one-service local dev" path

**Key mind-change:**
- Pragmatist conceded polyrepo after Round 1 — the shared-types friction was the decisive argument. This is a strong signal: when an agent with a directly opposing initial position changes their mind, the converged answer is likely correct.

**Unresolved Risks:**
- CI tooling complexity (all 3 agents flagged); needs explicit decision on Turborepo vs Nx vs custom Bun scripts before implementation
- Path-filtering rules need ongoing discipline; recommend a quarterly audit

**Recommended action:**
- Adopt monorepo + Turborepo + CODEOWNERS + path-filtered CI. Spike Turborepo vs Nx in 1 day before committing. Write onboarding doc as part of the migration.

---

## What this example illustrates

- **Mind-changes are strong signals.** Pragmatist's Round 2 concession was the decisive moment — the synthesis can call this out explicitly.
- **Early convergence saves a round.** Round 3 was skipped because all agents hit confidence 8+ with aligned proposals; the bill is cheaper, the synthesis is the same.
- **Unresolved risks ≠ blocked.** Even on consensus, the synthesis names the risks the consensus didn't fully resolve (CI tool choice, path-filtering discipline). Status is still DONE; the risks live in the report for the operator.
- **The Critic's refinement (path-filtered CI) became the synthesis spine.** Constructive criticism that adds missing pieces is more valuable than blanket opposition. Reflect this in the synthesis.
