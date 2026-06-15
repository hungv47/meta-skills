# Brief-Landing-Page Agent Manifest

Loaded by the orchestrator when entering Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Evidence-Anchor Agent | 1 (parallel) | `agents/evidence-anchor-agent.md` | Pulls signals from page state, ICP, campaign context, prior briefs, and any post-launch evidence. |
| Brand-Anchor Agent | 1 (parallel) | `agents/brand-anchor-agent.md` | Pulls relevant tokens, sacred elements, voice rules from BRAND.md + DESIGN.md. |
| Hypothesis Agent | 1.5 (after L1) | `agents/hypothesis-agent.md` | Generates 3 hypothesis candidates with 3Q rubric (Visual / Falsifiable / Unique). |
| Architecture Agent | 2 (after hypothesis approved) | `agents/architecture-agent.md` | Surface rhythm + section list + ASCII diagram + scroll velocity plan. |
| Section-Spec Agent | 3 (after architecture approved) | `agents/section-spec-agent.md` | Per-section spec — copy slots, layout, motion, asset slots, conversion-checklist embed. |
| Asset-Slot Agent | 3.5 (after section-spec) | `agents/asset-slot-agent.md` | Named asset slots with file paths, dimensions, formats, fallbacks, generation prompt templates. **Sequential after section-spec** — slot IDs originate there, parallel execution would drift them. |
| Hand-Off Agent | 4 (after L3) | `agents/handoff-agent.md` | Composes Claude Design / Figma / designer / universal coding-agent hand-off prompts. |
| Conversion Critic | 5 (parallel) | `agents/conversion-critic-agent.md` | Scores brief against the local CP-01 → CP-14 conversion-principles rubric. |
| Brand-Voice Critic | 5 (parallel) | `agents/brand-voice-critic-agent.md` | Scores sacred-element compliance, voice rules, surface language, token discipline, brief envelope (250-500 lines). |

## Routes

### Route A — Fresh LP (no existing page)

```
Step 0 → L1 (evidence-anchor ∥ brand-anchor) → L1.5 (hypothesis) → ★ Gate 1
       → L2 (architecture) → ★ Gate 2
       → L3 (section-spec) → L3.5 (asset-slot) → L4 (handoff)
       → L5 (conversion-critic ∥ brand-voice-critic) → critic merge → ★ Gate 3
       → write brief.md + handoff/* + asset-slots/* to docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/
```

### Route B — Existing LP redesign (evidence-anchored)

Same dispatch as Route A, but Layer 1 evidence-anchor reads current page state and any post-launch evidence. Hypothesis anchored in page-state gaps, audience objections, and evidence ("rev N → rev N+1: what changed and why"). "What Changed from rev N-1" section becomes mandatory when a prior brief exists.

### Route C — Re-run with `--rev=N`

Read the prior brief at `v[N-1]/brief.md` + fresh inputs; run Layer 1 to diff prior-vs-fresh; pass hypothesis-agent the "what's new since rev N-1" context; continue Route A/B from Layer 1.5; save to `v[N]/brief.md`, preserving prior versions.

## Approval Gates

Three mandatory STOP points between layers — **`--fast` does NOT skip them.**

### Gate 1 — Hypothesis Selection (after L1.5)

Present 3 candidates A/B/C, each with: Title · falsifiable Claim (one sentence) · 3Q score (Visual / Falsifiable / Unique = N/3) · Why this (argument tied to evidence) · Risk. Close with *Pick one (A/B/C), revise, or kill all.*

Responses: `A`/`B`/`C` → proceed to L2 · `Revise X` → re-dispatch hypothesis-agent · `None of these` → ask one clarifying question, regenerate · `Stop` → save candidates, exit BLOCKED.

### Gate 2 — Architecture Approval (after L2)

Present Surface Rhythm (3-5 line scroll description, fast/slow/pause beats) · Section List (numbered, purpose + key message per section) · ASCII Page Diagram · Scroll Velocity Plan. Close with *Approve, revise, or reject.*

Responses: `Approve` → proceed to L3 · `Revise X` → re-dispatch architecture-agent (max 1 revise cycle) · `Reject` → return to L1.5 OR exit BLOCKED.

### Gate 3 — Final Brief Acceptance (after L5 critic merge)

Present brief preview · conversion critic verdict + score · brand-voice critic verdict + score · concerns to monitor. Close with *Approve, request revisions, or reject.*

Responses: `Approve` → write brief, status DONE · `Revise X` → re-dispatch named layer (1 cycle) · `Reject` → save as `rejected.md`, exit BLOCKED.

## Layer 5 critic verdict logic

Max 2 cycles total. Critics return binary PASS/FAIL; NOTEs are advisory.

| Cycle 1 outcome | Action |
|---|---|
| Both PASS | DONE — write brief |
| Mixed or both FAIL | Re-dispatch each agent named in failing critics' `fix direction` field. Combine feedback per receiving agent. Cycle 2. |

| Cycle 2 outcome | Action |
|---|---|
| Both PASS | DONE — write brief |
| Either or both FAIL | DONE_WITH_CONCERNS — write brief with all FAIL notes pinned at **top** of `brief.md` under `## Concerns` above body. Critic scores in frontmatter. User sees failing reports at Gate 3 and decides. |

DONE_WITH_CONCERNS is the floor. No silent FAIL outputs.

**Per-FAIL routing comes from critics, not this table.** Each FAIL includes `fix direction` naming the responsible agent (section-spec for copy/structure/checklist, asset-slot for asset, handoff for hand-off-only, brand-anchor for digest correction). Orchestrator follows; do not assume failure-class → agent mappings.

## Pattern Catalogs (consumed by named agents)

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/conversion-principles.md` | conversion-critic, section-spec | CP-01 → CP-14 canonical rubric. |
| `references/conversion/*.md` | conversion-critic | 6 source files (core-principles, advanced-psychology, social-proof-trust, ux-design, testing-optimization, implementation-checklist). |
| `references/section-templates.md` | architecture, section-spec | Hero / Problem / Solution / Proof / Objection / CTA section templates. |
| `references/surface-rhythm.md` | architecture | Scroll velocity, eye-pause, density beats. |
| `references/hypothesis-rubric.md` | hypothesis | 3Q (Visual / Falsifiable / Unique). |
| `references/handoff-formats.md` | handoff | Claude Design / Figma / designer / coding-agent prompt structures. |
| `references/design-handoff-prompting.md` | handoff, critic | Vague-adjective bans, asset-placeholder rule. |
| `references/failure-modes.md` | critic | Brand-voice critic G1-G8b gate references. |
| `references/anti-patterns.md` | critic | 12 brief-specific + 4 cross-cutting + 3 design-handoff prompting anti-patterns. |

Full per-agent Pass-These-Inputs + Reference-Files tables + Approval Gate response handling: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
