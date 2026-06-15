# Procedure — Dispatch Mechanics (App-Preview Brief)

> Load at Layer 1 dispatch entry. Covers how to spawn agents, the parallel/sequential table, single-agent fallback, critic routing, chain position, and skill-deference enforcement.

Wraps the canonical dispatch protocol with app-preview-specific layers and gate enforcement.

---

## Layer table

| Layer | Agents | Mode | Hard gate before next layer |
|---|---|---|---|
| 0 (Pre-Dispatch) | (orchestrator) | sequential | All 6 dimensions resolved OR `NEEDS_CONTEXT` returned |
| 1 | intake-validator-agent | sequential | Gate verdict PROCEED (else `NEEDS_CONTEXT` / `BLOCKED`) |
| 1.5 | flow-slicer-agent, interaction-storyboard-agent, motion-spec-agent | parallel | All three outputs returned |
| 2a | platform-format-agent | sequential | Surface Compliance Check all-PASS (else re-route) |
| 2b | critic-agent | sequential | PASS verdict OR 2nd FAIL → done_with_concerns |

The skill always runs Layer 0 → 1 → 1.5 → 2a → 2b. There is no single-route variation; multi-surface invocations re-invoke the whole chain per surface.

---

## Spawning agents

Each agent runs via the Agent tool with subagent_type=`general-purpose` (or a domain-specialized subagent if available). The orchestrator passes:

| Field | Source |
|-------|--------|
| `brief` | The pre-writing object's brief field |
| `context` | Aggregated upstream outputs + relevant reference excerpts |
| `references` | Absolute paths to the reference files the agent's frontmatter declares |
| `feedback` | Critic feedback when re-dispatching (else null) |

The agent's output is the `## [Section Name]` body + `## Change Log`. Orchestrator captures both, threads the section into the artifact, and the Change Log into the run log (not persisted in the artifact).

---

## Parallel dispatch (Layer 1.5)

The three Layer 1.5 agents run in parallel via three concurrent Agent calls in a single message. They share:

- The intake-validator-agent's PROCEED output (Source Inventory, Feature Promise, Flow Order, Target Surface, Brand Source)
- Brand/ICP excerpts read at pre-dispatch (when available)

They do NOT share with each other during parallel work. The orchestrator collects all three outputs before Layer 2.

If one agent fails (returns `[BLOCKED]` or an error), the other two complete; the orchestrator re-dispatches the failed agent once at the next opportunity, then escalates if it fails again.

---

## Sequential dispatch (Layer 2)

Layer 2a (`platform-format-agent`) runs first because it locks surface constraints that the critic verifies. If `platform-format-agent` returns a Surface Compliance Check with FAILs, the orchestrator routes them back per the agent's named re-dispatch (typically `interaction-storyboard-agent` for caption / length / aspect rewrites, or `motion-spec-agent` for caption-band / pointer rewrites) BEFORE invoking the critic.

Layer 2b (`critic-agent`) runs only after Layer 2a is clean. The critic's 5-gate verdict determines:

- PASS → write artifacts, return `DONE`
- FAIL (cycle 1) → re-dispatch named agent per Rewrite Routing Table, then re-run platform-format-agent (because the change may have affected surface compliance), then re-run critic
- FAIL (cycle 2) → write artifacts with concerns pinned, return `DONE_WITH_CONCERNS`

Max 2 critic cycles is a hard cap.

---

## Single-agent fallback (`--fast`)

When the operator passes `--fast`, the orchestrator collapses to a single agent that produces the full brief in one pass:

```
1. Pre-Dispatch (Cold Start STILL RUNS — `--fast` doesn't skip context resolution)
2. Single-agent: writes Source Inventory + Feature Promise + Crop Map + Beat Sequence + Motion Spec + Platform Spec + Handoff in one output
3. NO critic (Layer 2b skipped)
4. Surface Compliance Check STILL RUNS (Critical Gate 5 is non-negotiable)
5. Write artifacts; return `DONE_WITH_CONCERNS` with a `fast-mode-no-critic` flag
```

`--fast` is for known-good repeats where the operator has already shipped briefs for similar features and just needs a quick variant. First-time briefs for a new feature should run the full pipeline.

**`--fast` does NOT skip:**
- Cold Start (still resolves all 6 dimensions)
- Critical Gates 1-6 (hard gates fire regardless of mode)
- Surface Compliance Check (unshippable briefs never ship)
- OST performance-claim scan

---

## Critic routing on FAIL

The critic's Rewrite Routing Table (canonical in `agents/critic-agent.md`):

| Gate failed | Re-dispatch | Rationale |
|---|---|---|
| 1 (grounding) | intake-validator OR flow-slicer | Invented UI originates either in intake (missing source acknowledged) or slicer (crop without source) |
| 2 (component focus) | flow-slicer | Crop selection is slicer's contract |
| 3 (beat clarity) | interaction-storyboard | Beat sequencing + action-verb + proof live in storyboard |
| 4 (brand fidelity) | motion-spec | Color / radius / type / pointer specs are motion-spec's contract |
| 5 (platform fit) | platform-format | Surface compliance is platform-format's whole job |
| Multi-gate | each gate's named agent (parallel re-dispatch) | Cycle count is round-level, not per-agent |

On re-dispatch, the named agent receives:
- The original brief
- The full context the agent had on the first pass
- The CRITIC FEEDBACK as `feedback` field (must address every point)

The agent prepends a `## Feedback Response` section to its output before its standard section. The orchestrator strips the response section before threading into the artifact (it's for the critic's verification, not the editor's reading).

---

## Skill-deference enforcement at Layer 0

The orchestrator scans the operator's prompt at pre-dispatch for skill-deference triggers:

| Prompt contains | Defer to | Stop dispatch |
|---|---|---|
| "TikTok", "Reels", "Shorts", "hook variations", "angle" (without screenshots) | `brief-shortform` | YES |
| "render", "publish", "produce the video" | `produce-video` (or `publish-social`) | YES |
| "logo", "brand kit", "design system" | `create-brand` | YES |
| "Instagram carousel", "static image", "blog hero" | `brief-graphic` | YES |
| ≥2 distinct feature names | (operator splits, re-invokes per feature) | YES |
| Surface is none of the 4 canonical | (operator picks one) | YES |

If any trigger fires, return `NEEDS_CONTEXT` (or `BLOCKED` for render/publish requests) with the recommended sibling skill named.

---

## Cross-stack contract checkpoints (re-stated for the dispatch path)

When a craft agent's output changes the brief's structure, the orchestrator checks:

- Did `brief.md` frontmatter gain or lose a field? → verify `format-conventions.md` §1; check `produce-video`'s schema extension
- Did `handoff-produce-video.md` column set change? → verify `produce-video`'s prompt-author-agent expects the new columns
- Did `crop-map.md` notation change? → verify `interaction-grammar.md` § Crop rectangle notation matches

These checkpoints fire BEFORE writing the artifact. If a checkpoint fails, the orchestrator escalates rather than writing inconsistent artifacts.

---

## Artifact write order

```
1. Validate Layer 2b PASS (or cycle-2 FAIL with concerns)
2. Write docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/crop-map.md
3. Write docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/assets.md
4. Write docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/handoff-produce-video.md
5. Write docs/forsvn/artifacts/marketing/app-preview-brief/[slug]/brief.md  (last — pulls section content from the three siblings)
6. Update .forsvn/index/manifest.json
7. Return DONE / DONE_WITH_CONCERNS with the path
```

`brief.md` is written last because its body sections reference the sibling files (§ Crop / Mask Plan pulls from crop-map.md, § Handoff to produce-video references handoff-produce-video.md, § Source Inventory pulls from assets.md). Writing siblings first guarantees the cross-references resolve.

---

## Mode resolution at Layer 0

Per `references/_shared/mode-resolver.md`:

- **`deep` (default, this skill's budget):** Full Layer 0 → 1 → 1.5 → 2a → 2b chain
- **Auto-downgrade to `standard`:** ≤3 sentences in the operator prompt AND no prior artifacts for this slug. Result: still runs the full chain (this skill has no truly-standard mode; 6 agents is the lean version).
- **`--fast` (operator override):** single-agent fallback (see above)

Upward overrides ("be thorough," "ultrareview this") do not exist for this skill — `deep` is already the ceiling. Treat upward phrases as confirmation that `deep` is the right mode.
