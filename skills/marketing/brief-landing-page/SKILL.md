---
name: brief-landing-page
description: "Generates a campaign-grade brief for a high-converting landing page or redesign — hypothesis, surface rhythm, section-by-section spec, asset slots, copy candidates, hand-off prompts, and a built-in conversion-principles gate. Output is ready to hand to Claude Design, a Figma designer, or brief-graphic. Use when planning or redesigning a conversion page. Not for post-launch CRO analysis from analytics (use evaluate-landing-page in an eval-loop), non-conversion pages like blogs or docs hubs, or spec'ing a single visual asset (use brief-graphic)."
argument-hint: "[page route or campaign name, e.g. '/pricing' or 'q3-launch-lp']"
allowed-tools: Read Edit Write Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$2-4"
---

# Landing Page Brief — Orchestrator

*Communication — Step between strategy and design. Coordinates evidence anchoring, hypothesis generation, architecture, per-section specification, asset slotting, conversion gating, and hand-off prompt composition into a single approved brief.*

**Core Question:** "Could a designer (or Claude Design) build the right page from this brief without a single follow-up question?"

> Why this skill exists, philosophy, methodology, principles, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates — Read First

- **Do NOT generate a brief without brand artifacts.** Missing `brand/BRAND.md` or `brand/DESIGN.md` → return `NEEDS_CONTEXT`. Brief depends on tokens, voice rules, sacred elements.
- **Do NOT skip the conversion rubric.** Every section spec is gated by this skill's local conversion-principles rules (4-U headline, message match, CTA psychology, social proof placement, objection handling, form-field discipline). Brand-good but conversion-bad = failure.
- **Do NOT propose changing sacred elements.** Logo geometry, primary palette anchor, tagline wording, signature treatments are "do not touch" rails, not options.
- **Do NOT exceed the brief length envelope.** Useful brief is 250–500 lines. <250 = insufficient depth (designer asks follow-ups). >500 = bloat (designer skims, misses spec). Critic enforces.
- **Do NOT inline the full skill chain.** If project has a shared chain doc (e.g., `growth/page-redesigns/_prompts.md`), reference by section header; add page-specific overrides only.
- **Do NOT inject placeholder testimonials, fake logos, or pretend numbers.** If a proof asset isn't real, spec it ("Customer logo grid, 6 cells × 60px") and note "delete cell if not real" — never fabricate.

## Inputs

| Artifact | Required? | What it provides |
|----------|-----------|------------------|
| Page route or campaign name (e.g. `/pricing`, `q3-launch-lp`) — current state if page exists (URL/screenshot/code) | **required** | Subject of the brief |
| `brand/BRAND.md` | **required** (NEEDS_CONTEXT if absent) | Voice, archetype, sacred elements, lexicon rules |
| `brand/DESIGN.md` | **required** (NEEDS_CONTEXT if absent) | Palette, typography, surface language, motion tokens |
| Existing page state (URL/screenshot/code), if redesigning | optional but recommended | What exists today; page-state signals inform the redesign but do not block the brief |
| Post-launch evidence (analytics, heatmaps, experiment notes), if available | optional | Stronger evidence for redesign hypotheses; absent evidence is labeled as assumption |
| `research/icp-research.md` | optional | Objections + VoC for copy candidates |
| `research/product-context.md` | optional | Product accuracy in features/proof |
| `.forsvn/artifacts/mkt/campaign-plan.md` | optional | Traffic source, awareness stage, role in funnel |
| `.forsvn/artifacts/meta/records/targets-*.md` | optional | Conversion target informs CTA aggressiveness |

## Output

`.forsvn/artifacts/mkt/lp-brief/[slug]/brief.md` — single main artifact, structured per the template below.

Always written alongside `brief.md`:
- `.forsvn/artifacts/mkt/lp-brief/[slug]/handoff-implementation.md` — paste-ready prompt for any coding agent (Claude Code / Cursor / Codex / Opus / Gemini / GPT). Stack auto-detected from repo (frameworks → that stack; no framework → pure HTML/CSS/Vanilla JS, single index.html). Motion stack from `brand/DESIGN.md` (silent → GSAP+ScrollTrigger+Lenis). Includes verbatim Asset Placeholder Rule so coding agents never invent stock-photo URLs.

Optional companions if `target_handoff` lists them:
- `.forsvn/artifacts/mkt/lp-brief/[slug]/handoff-claude-design.md` — verbatim prompt block for claude.ai/design
- `.forsvn/artifacts/mkt/lp-brief/[slug]/handoff-figma.md` — design spec for designer in Figma
- `.forsvn/artifacts/mkt/lp-brief/[slug]/handoff-designer.md` — narrative brief for human designer

Per-slot artifacts (written by downstream media-briefing skills, not by lp-brief itself):
- `.forsvn/artifacts/mkt/lp-brief/[slug]/asset-slots/{slot-id}.prompt.md` — per-asset generation prompt (written by `brief-graphic` today; future media-briefing skills like motion-brief / 3d-brief / video-brief as they ship). Slots with `route: pending-media-skill` have no prompt file yet — the implementation prompt renders them as solid-color placeholders until a media-briefing skill catches up.

## Quality Gate

Two critics run in parallel before delivery, both binary PASS/FAIL:

- **Conversion critic** scores brief against `references/conversion-principles.md` (CP-01 → CP-13). Full rubric and gate logic in `agents/conversion-critic-agent.md`.
- **Brand-voice critic** scores sacred-element compliance, voice rules, surface language, token discipline, brief envelope (250–500 lines). Full rubric in `agents/brand-voice-critic-agent.md`.

Verdict logic: see `## Layer 5: Critic Gate` below.

## Chain Position

Previous: `plan-campaign` (optional — campaign context), `create-brand` (required) | Next: `brief-graphic` per asset slot (optional), then implementation (Claude Design / image-gen / human designer)

**Re-run triggers:** post-launch performance evidence, BRAND.md/DESIGN.md update, ICP refresh, traffic source pivot. Increment `--rev=N`.

### Skill Deference

- **Need post-launch CRO from real evidence?** → `evaluate-landing-page` inside an existing `run-eval-loop`. This skill can read prior evals when producing the next brief, but does not pretend best-practice review is optimization.
- **Single visual asset spec, not whole page?** → `brief-graphic`.
- **No brand?** → `create-brand` first.
- **Need only headline variations?** → `write-copy`.
- **Non-LP page (blog, docs, navigation hub)?** → Out of scope. Conversion rubric doesn't apply.
- **Programmatic-SEO templates (industries/:slug, workflows/:slug, compare/:vs:)?** → **Out of scope for v1.** Targets single-purpose conversion pages (tier 1). Programmatic templates need a different rubric (template-fillability, slug-coverage, dedup) and would dilute the conversion-critic. Future skill.

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Evidence-Anchor Agent | 1 (parallel) | `agents/evidence-anchor-agent.md` | Pulls signals from page state, ICP, campaign context, prior briefs, and any post-launch evidence |
| Brand-Anchor Agent | 1 (parallel) | `agents/brand-anchor-agent.md` | Pulls relevant tokens, sacred elements, voice rules from BRAND.md + DESIGN.md |
| Hypothesis Agent | 1.5 (after L1) | `agents/hypothesis-agent.md` | Generates 3 hypothesis candidates with 3Q rubric (Visual / Falsifiable / Unique) |
| Architecture Agent | 2 (after hypothesis approved) | `agents/architecture-agent.md` | Surface rhythm + section list + ASCII diagram + scroll velocity plan |
| Section-Spec Agent | 3 (after architecture approved) | `agents/section-spec-agent.md` | Per-section spec — copy slots, layout, motion, asset slots, conversion-checklist embed |
| Asset-Slot Agent | 3.5 (after section-spec — consumes its slot references) | `agents/asset-slot-agent.md` | Named asset slots with file paths, dimensions, formats, fallbacks, generation prompt templates |
| Hand-Off Agent | 4 (after L3) | `agents/handoff-agent.md` | Composes Claude Design / Figma / designer hand-off prompt block |
| Conversion Critic | 5 (parallel) | `agents/conversion-critic-agent.md` | Scores brief against this skill's local conversion-principles rubric |
| Brand-Voice Critic | 5 (parallel) | `agents/brand-voice-critic-agent.md` | Scores brand fidelity + voice + envelope |

---

## Routing Logic

### Route A: Fresh LP (no existing page)

```
Step 0 → L1 (evidence-anchor ∥ brand-anchor) → L1.5 (hypothesis) → ★ Gate 1
       → L2 (architecture) → ★ Gate 2
       → L3 (section-spec) → L3.5 (asset-slot) → L4 (handoff)
       → L5 (conversion-critic ∥ brand-voice-critic) → critic merge → ★ Gate 3
       → write brief.md + handoff/* + asset-slots/* to .forsvn/artifacts/mkt/lp-brief/[slug]/
```

Per-layer dispatch tables (Layer 1 / Layer 1.5 / Layer 2 / Layer 3 / Layer 3.5 / Layer 4 with Pass-These-Inputs + Reference-Files columns) + Approval Gate user-response handling for all 3 gates + single-agent fallback live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

### Route B: Existing LP redesign (evidence-anchored)

Existing page redesign. Requires current page state (URL/screenshot/code) when available, and consumes analytics/heatmaps/experiment notes if the user has them. No separate heuristic audit blocks the brief.

Same dispatch as Route A, but Layer 1 evidence-anchor reads current page state and any post-launch evidence. Hypothesis anchored in page-state gaps, audience objections, and evidence ("rev N -> rev N+1: what changed and why"). Architecture and section spec address the strongest signals explicitly. "What Changed from rev N-1" section becomes mandatory when a prior brief exists.

### Route C: Re-run with `--rev=N`

```
1. Read prior brief at .forsvn/artifacts/mkt/lp-brief/[slug]/v[N-1]/brief.md
2. Read fresh inputs (page-state/evidence notes, new ICP)
3. Run Layer 1 — diff prior brief against fresh inputs
4. Hypothesis-agent receives "what's new since rev N-1" context
5. Continue Route A/B from Layer 1.5
6. Save new brief at .forsvn/artifacts/mkt/lp-brief/[slug]/v[N]/brief.md, preserve prior versions
```

---

## Pre-Dispatch

This skill has **hard gates** before any cold-start questioning — brand artifacts gate routing. Cold-start questions are bundled after gates pass. Approval Gates 1/2/3 (mid-flow user reviews) are separate from Pre-Dispatch and happen after Layer 1.5 / Layer 2 / Layer 5. Full Pre-Dispatch protocol pattern: `references/_shared/pre-dispatch-protocol.md`.

### Hard gates (before any questioning)

1. **Brand artifacts.** `brand/BRAND.md` AND `brand/DESIGN.md` must be present. If either missing → return **NEEDS_CONTEXT**, recommend `create-brand`. If either >60 days stale, warn and ask before proceeding.
2. **Route classification.** No existing page → Route A. Existing page or prior brief → Route B. Absence of analytics is not a blocker; label assumptions clearly and rely on conversion-principles + ICP signals.

If hard gates pass, proceed to Pre-Dispatch flows.

### Needed dimensions
- Page identity — route + name (always supplied as input — not asked)
- Tier — conversion-primary (hero LP, /pricing, /services) or conversion-secondary (/about, /story). Programmatic out of scope.
- Hypothesis intent — what's this page trying to prove?
- Goal — leads / signups / purchases / demos
- Route (A or B) — already resolved by hard gates above

Full read order + Warm/Cold Start prompts + 4-question Cold Start template + Write-back map + Project-Specific Workflows + Context-to-Pass + hard-block conditions + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — `--fast` collapses Layer 1/1.5/2/3/3.5/4 to single-agent execution per layer (no parallelism), skips Layer 5 critic dispatch (critics noted as "skipped under --fast"). **`--fast` does NOT skip Hard Gates (brand artifacts present), 3 Approval Gates (user-facing contract), or Critical Gates 1-6 (no brief without brand artifacts; no skipping conversion rubric; no proposing sacred-element changes; no exceeding 250-500 envelope; no inlining shared skill chain; no placeholder testimonials).**

---

## Dispatch Protocol

Canonical dispatch mechanics (how to spawn a sub-agent: read agent file FULL content + append context + resolve paths absolute + pass upstream artifacts by content + append critic feedback on FAIL) + single-agent fallback (Approval gates remain — single-agent mode does not bypass user gates) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

---

## Layer 1 → 1.5 (parallel foundation → hypothesis)

Layer 1 dispatches evidence-anchor + brand-anchor IN PARALLEL; outputs feed Layer 1.5 (hypothesis-agent → 3 candidates scored 3Q: Visual / Falsifiable / Uniquely Ours, against `references/hypothesis-rubric.md`). Full per-agent Pass-These-Inputs + Reference-Files tables in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

---

## Approval Gate 1 — Hypothesis Selection

**STOP.** Present 3 hypothesis candidates:

```
## Hypothesis Candidates

### A. [Title]
**Claim:** [single sentence — falsifiable]
**3Q score:** Visual [Y/N] / Falsifiable [Y/N] / Unique [Y/N] = N/3
**Why this:** [argument tied to evidence signals or audience signals]
**Risk:** [main concern]

### B. [Title]
[same structure]

### C. [Title]
[same structure]

**Pick one (A/B/C), revise, or kill all.**
```

User responses:
- "A" / "B" / "C" → proceed to Layer 2 with that hypothesis
- "Revise X" → re-dispatch hypothesis-agent with feedback
- "None of these" → ask one clarifying question, regenerate
- "Stop" → save candidates, exit BLOCKED

---

## Layer 2: Architecture

Architecture-agent receives approved hypothesis + brand digest + evidence digest + tier; outputs surface rhythm plan + section list + ASCII diagram + scroll velocity notes (where eye accelerates/decelerates/pauses), against `references/surface-rhythm.md` + `references/section-templates.md`. Full dispatch table in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

---

## Approval Gate 2 — Architecture Approval

**STOP.** Present architecture:

```
## Page Architecture — [Hypothesis Title]

### Surface Rhythm
[3–5 line description of scroll experience: fast/slow/pause beats]

### Section List
1. Hero — [purpose + key message]
2. [section name] — [purpose]
...

### ASCII Page Diagram
[Visual schematic of section stacking, asset positioning, scroll velocity]

### Scroll Velocity Plan
[Where the eye accelerates / decelerates / pauses, tied to conversion gates]

**Approve, revise, or reject.**
```

User responses:
- "Approve" → proceed to Layer 3
- "Revise X" → re-dispatch architecture-agent with feedback (max 1 revise cycle here)
- "Reject" → return to Layer 1.5 to pick a different hypothesis OR exit BLOCKED

---

## Layer 3 → 3.5 → 4 (section spec → asset slots → handoff)

**Layer 3:** section-spec-agent writes per-section spec — copy slots, layout, motion, asset slot references, conversion-checklist embed.

**Layer 3.5:** asset-slot-agent runs **after** section-spec (sequential, not parallel) because slot IDs originate in section-spec's per-section asset references. Parallel execution would guarantee ID drift.

**Layer 4:** handoff-agent receives full assembled brief + `target_handoff` (specialty targets, may be null) + detected_stack (framework + motion library, auto-detected from repo at write time). Always emits `handoff-implementation.md` (universal coding-agent prompt block for Claude Code / Cursor / Codex / Opus / Gemini / GPT — stack auto-detected; falls back to pure HTML/CSS/Vanilla JS; motion stack from `brand/DESIGN.md` or GSAP+ScrollTrigger+Lenis default; contains verbatim Asset Placeholder Rule so coding agents never invent stock-photo URLs). Optionally emits one additional `handoff-{target}.md` per `target_handoff` entry.

Full per-agent Pass-These-Inputs + Reference-Files tables in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

---

## Layer 5: Critic Gate (parallel)

Conversion-critic + brand-voice-critic run in parallel against the full brief. Orchestrator merges reports. Full per-critic Pass-These-Inputs + Reference-Files tables in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

**Verdict logic** (max 2 cycles total). Critics return binary PASS/FAIL; NOTEs are advisory and don't change the verdict.

| Cycle 1 outcome | Action |
|-----------------|--------|
| Both PASS | DONE — write brief |
| Mixed or both FAIL | Re-dispatch each agent named in failing critics' Failures Summary `fix direction` field. (Critics emit per-FAIL routing — orchestrator does not hardcode it.) Combine feedback per receiving agent. Cycle 2. |

| Cycle 2 outcome | Action |
|-----------------|--------|
| Both PASS | DONE — write brief |
| Either or both FAIL | DONE_WITH_CONCERNS — write brief with all FAIL notes pinned at **top** of `brief.md` under `## Concerns` above body. Critic scores in frontmatter. User sees failing reports at Approval Gate 3 and decides: ship, revise manually, or kill. |

DONE_WITH_CONCERNS is the floor. No silent FAIL outputs — every critic concern visible in the artifact.

**Per-FAIL routing comes from critics, not this table.** Each FAIL includes `fix direction` naming the responsible agent (section-spec for copy/structure/checklist, asset-slot for asset, handoff for hand-off-only, brand-anchor for digest correction). Orchestrator follows that direction; do not assume failure-class → agent mappings.

---

## Approval Gate 3 — Final Brief Acceptance

**STOP.** Present the full brief + critic merge.

```
## Brief: [Page Slug] [rev N if applicable]

[Brief preview: hypothesis title, section count, asset slot count, hand-off target]

## Critics
- **Conversion:** [PASS / DONE_WITH_CONCERNS / FAIL] — [score]
- **Brand-voice:** [PASS / DONE_WITH_CONCERNS / FAIL] — [score]

[Concerns to monitor, if any]

**Approve, request revisions, or reject.**
```

User responses:
- "Approve" → write brief to `.forsvn/artifacts/mkt/lp-brief/[slug]/brief.md` (with version subfolder if rev), status DONE
- "Revise X" → re-dispatch named layer with feedback (1 cycle)
- "Reject" → save as `.forsvn/artifacts/mkt/lp-brief/[slug]/rejected.md`, exit BLOCKED

---

## Artifact Contract

- **Path:** `.forsvn/artifacts/mkt/lp-brief/[slug]/brief.md` (versioned re-runs: `v[N]/brief.md` for `--rev=N`)
- **Always-emitted companion:** `handoff-implementation.md` (universal coding-agent prompt, stack auto-detected at write time)
- **Optional companions:** `handoff-{claude-design,figma,designer}.md` per `target_handoff`
- **Per-slot artifacts** (written by downstream `brief-graphic`, not lp-brief): `asset-slots/{slot-id}.prompt.md`
- **Lifecycle:** `pipeline` — versioned re-runs preserve prior versions
- **Frontmatter:** 13 fields (skill / version / date / status / page_route / tier / rev / hypothesis_title / target_handoff / brand_anchors / sacred_respected / critic_scores / shared_skill_chain / **provenance** — generation-variant, required so `evaluate-landing-page` can ground scoring on `input_artifacts` and `scripts/eval/promote-to-experience.ts` can walk `output_eval` to validate the artifact → eval → learning chain) — see [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE] and [`references/_shared/artifact-contract-template.md § provenance: — two variants`](references/_shared/artifact-contract-template.md)
- **Body:** 14 sections (Title heading block / Concerns / IMC Context / Hypothesis Approved / What Changed from rev N-1 / Page Architecture / Section-by-Section Spec / Asset Slots / What NOT to Do / Implementation Prompt / Hand-Off / Pre-flight Checklist / Skill Chain / Launch Plan + Results + Why This Works)
- **Envelope:** 250-500 lines enforced strictly by brand-voice critic G6 (under 250 = insufficient depth FAIL; over 500 = bloat FAIL)
- **Cross-stack contract:** consumed by human designers + coding agents + `brief-graphic` (per slot) + indirectly by `evaluate-landing-page` cycles (when brief referenced from loop's `strategy/` directory). Schema changes require atomic update across upstream callers (campaign-plan) + downstream consumers (design-brief, coding agents, lp-eval) — never silently drift.

Full 205-line artifact template byte-identical + per-section format rules + companion file conventions: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

> Re-run with `--rev=N`: write to `.forsvn/artifacts/mkt/lp-brief/[slug]/v[N]/brief.md`, preserve prior versions.

---

## Worked Examples

See `references/examples.md` — three end-to-end walkthroughs (Route A fresh LP, Route B evidence-anchored redesign, Route C `--rev=N` with mixed-critic verdict).

---

## Anti-Patterns

Pipeline reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any brief ships. 12 lp-brief-specific patterns (pretending heuristic review is CRO, generic hypothesis, inlining shared skill chain, stale or fake proof, ignoring sacred elements, no objection handling, brief too short, brief too long, hero copy violating voice, coding-agent inventing asset URLs, implementation-prompt sacred-creep, implementation-prompt stack mismatch) + 4 cross-cutting marketing-stack rows (upstream context skipped → NEEDS_CONTEXT, cross-stack contract drift, polish-chain misroute, downstream eval-loop violation).

Most common in practice: ignoring sacred elements (Critical Gate 3 + Brand-voice critic G1 sacred 4/4 auto-FAIL), brief too long (Critical Gate 4 + G6 envelope), coding-agent inventing asset URLs (G8b Implementation Prompt Compliance — Asset Placeholder Rule verbatim), hero copy violating voice (G2 Forbidden Vocabulary single-hit FAIL).

---

## Completion Status Protocol

- **DONE** — both critics PASS (cycle 1 or 2), brief approved, artifacts written
- **DONE_WITH_CONCERNS** — after 2 cycles, ≥1 critic still FAIL or mixed; concerns pinned at top of brief.md AND in frontmatter. User sees both reports at Approval Gate 3 and ships consciously.
- **BLOCKED** — user rejected at a gate or required input missing mid-flow
- **NEEDS_CONTEXT** — BRAND.md or DESIGN.md missing; cannot proceed

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE] — full 205-line artifact template byte-identical + companion file conventions
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Examples:** `references/examples.md` — Route A + Route B + Route C worked walkthroughs
- **Domain catalogs** (loaded by agents at dispatch): `references/{conversion-principles, section-templates, surface-rhythm, hypothesis-rubric, handoff-formats, failure-modes}.md` + `references/conversion/` subdir (6 source files: core-principles, advanced-psychology, social-proof-trust, ux-design, testing-optimization, implementation-checklist)
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric, brand-system/*, design-brief/*}.md`
- **Marketing foundations:** `references/_shared/marketing-foundations.md` — canonical 9-channel framework, funnel-stage vocabulary, 3Q content test, CTA formula, VoC principles
- **Agents:** 9 sub-agents in `agents/` — see Agent Manifest above. `conversion-critic-agent.md` holds the canonical CP-01 → CP-13 scoring rubric + Cross-Cutting Checks + Scoring Patterns Per CP + Tier Excuses + Cycle Logic. `brand-voice-critic-agent.md` holds the canonical G1-G8b gates + Sacred Element Detection + Voice Forbidden Vocab Detection + Token Discipline + Envelope Math.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
