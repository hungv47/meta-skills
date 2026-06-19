---
name: write-launch
description: "The complete native launch-day copy bundle for ONE launch channel (Product Hunt, Reddit, any channel with a launch-channel pack): tagline/title, description, anchor narrative, notify + cross-post copy, metadata — pack-driven, with the pack's §4 hard guards enforced (PH no vote-ask; Reddit founder disclosure + 9:1). Single-channel; 5-dim critic. Not single social posts (write-social), the run-of-show (plan-campaign), gallery assets (brief-graphic), or post-launch reads (measure-results)."
argument-hint: "<topic-or-brief-path> <channel> [--variants N] [--goal feedback|signups|awareness|velocity] [--polish-chain humanmaxxing|vn-tone|none]"
allowed-tools: Read Write Bash Grep Glob
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.60-1.80"
---

# Launch Copy — Orchestrator

3 agents (launch-copywriter → guard-checker → critic) emit a launch channel's **complete native copy bundle** from its `launch-channel` playbook pack, with the pack's §4 hard guards enforced. Capability: [`routing.yaml`](routing.yaml). Agents + dispatch + rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Does this bundle earn the launch — every native copy piece the channel needs, clearing every §2 cap and §4 hard guard, engineered to *earn* first-window velocity (never beg)? A launch is a **bundle, not a post** — the reason this is a separate emitter from `write-social`.

## Critical Gates — load first

Full detail: [`references/procedures/critical-gates.md`](references/procedures/critical-gates.md).

1. **Single-channel per artifact** — multi-channel = re-invoke per channel (the launch chain fans out).
2. **Pack-bound or transparent degrade** — load the channel's `launch-channel` pack and narrate it (legibility). No pack → general principles only, stated as such; never fake channel tailoring.
3. **Brand mode required** (`founder` / `company`) — no silent default.
4. **Hard guards are publish-blocking** — the pack's §4 guards (PH: no vote-ask anywhere; Reddit: founder disclosure + 9:1 + sub-rule/flair fit) are non-negotiable. A breach unresolved in 1 guard-check revision = `GUARD_FAIL` → `status: blocked`, critic NOT dispatched.

## Before Starting

Apply `references/_shared/before-starting-check.md`. Then:

| Artifact | Source | Required? |
|---|---|---|
| `references/_shared/platform-intelligence/[channel].md` | the pack | **Hard for tailoring** — else gate 2 degrade |
| `brand/BRAND.md` | create-brand | **Hard** — `brand_mode` |
| `research/icp-research.md` + `product-context.md` | research-icp | Rec — audience + voice + the differentiator |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | Opt — run-of-show + channel pick |

Mode per `references/_shared/mode-resolver.md`. `--fast` → guard loop = 0; `--deep` → MAX 2. **`--fast` does NOT skip Cold Start, the hard guards, or the gates.** Pre-Dispatch: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

## Quality Gate — 5 dimensions

Full rubric + per-channel calibration + Discrimination Test: [`references/rubric.md`](references/rubric.md).

- [ ] Angle fit / clarity (identifier + anchor match a pack §1 angle)
- [ ] Format + hard-guard compliance (§2 caps AND §4 guards — a guard breach scores 0)
- [ ] Velocity-earning structure (earns first-window velocity per §3/§5; never a vote-ask)
- [ ] Channel-native voice / culture fit (reads native, not a press release)
- [ ] Bundle completeness + coherence (all components present + run-of-show consistent)

Pass total ≥35/50 AND no dim 0. **Discrimination test every cycle.**

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/launch/[channel]-[YYYY-MM-DD]-[slug].md`. **Lifecycle:** `pipeline`.
- **Frontmatter (16):** verbatim schema (adds legibility `pack_verified` + `applied_tactics` + `guard_status`) → [`references/format-conventions.md`](references/format-conventions.md).
- **Body (in order):** Launch bundle (channel components) · **Legibility block** ([convention](references/_shared/legibility-convention.md)) · **Why this works** ([convention](references/_shared/why-this-works-convention.md)) · Critic verdict (6-row table) · Anti-patterns triggered (`- None` if empty).

Side effects + consumed-by + cross-stack contract: [`references/procedures/artifact-contract.md`](references/procedures/artifact-contract.md).

## Routing + Dispatch

Graph + fallback + polish + mode: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md). **Guard-check bounce:** PASSED → critic; REVISION_REQUIRED → copywriter ONCE; second → `GUARD_FAIL` (`status: blocked`, no critic).

## Chain Position

**Prev:** `plan-campaign` (launch path) / `research-icp` / greenfield. **Next:** `publish-social` (distribute) → `measure-results` (post-launch read → pack write-back). The launch-copy step for a `launch-channel` pack — `write-social` owns it for the 5 social feed platforms. **Re-run:** new channel, voice shift, angle A/B, underperformance.

**Deference:** single social post (tweet / LinkedIn / TikTok caption) → `write-social`; run-of-show / channel pick / timing → `plan-campaign`; gallery / OG asset brief → `brief-graphic`; distributing finished copy → `publish-social`; post-launch results → `measure-results`; VN polish → `polish-vn`; AI-tell stripping → `humanmaxxing`.

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) — 10 patterns (6 launch-craft + 4 cross-cutting). Re-read before ship.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet (populate via the slow-update workflow — references/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — full bundle emitted, every §2 cap + §4 guard clear, critic ≥35, variant_count delivered.
- **DONE_WITH_CONCERNS** — critic 25-34 OR any dim <4 OR verdict `fail` (FAIL ships annotated) OR pack stale.
- **BLOCKED** — `GUARD_FAIL` (a §4 breach unresolved in 1 revision); brand_mode unresolved; no pack + operator declines the degrade.
- **NEEDS_CONTEXT** — no channel, topic, brand voice, or `brand/BRAND.md`; recommend `plan-campaign` or `create-brand`.

## Execution

Registry-gated fork (category `publish`): Brief-only polish if flagged; Assisted/Direct need a verified engine. No auto-publish — review is human-owned. [execution-fork.md](references/_shared/execution-fork.md); record `execution_mode`.

## Worked Example

Product Hunt founder-voice walkthrough (Cold Start → dispatch → no-vote-ask guard → critic PASS) + a Reddit value-first contrast: [`references/examples/launch-walkthrough.md`](references/examples/launch-walkthrough.md).
