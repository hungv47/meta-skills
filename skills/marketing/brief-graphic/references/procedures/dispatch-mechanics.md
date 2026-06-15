# Dispatch Mechanics — Design-Brief

> Layer 1 parallel + Layer 1.5 brief-synth + Approval Gate 1 (3-candidate selection) + Layer 2 route-dependent handoff + Layer 3 critic + Approval Gate 2 (acceptance) + rewrite loop + chain position + skill deference.

[PROCEDURE] — load at Layer 1 dispatch entry.

---

## How to spawn a sub-agent

The orchestrator spawns each sub-agent by:

1. **Read** the agent instruction file — include its FULL content in the Agent prompt.
2. **Append** the context block (`route`, `target_tool`, `platform_module`, plus role-specific inputs per the Layer tables below) AND any upstream agent's output.
3. **Resolve file paths to absolute:** replace relative paths with absolute paths the agent will actually read.
4. **Pass upstream artifacts by content:** orchestrator reads `docs/forsvn/artifacts/` files itself, includes relevant excerpts inline.
5. **Append critic feedback** if it exists, under `## Critic Feedback — Address Every Point`.

---

## Single-agent fallback

If multi-agent dispatch is unavailable (no Agent tool, `--fast` mode collapses, or orchestrator-internal mode), execute the chain sequentially in-context:

1. **Brand anchor pull** — read BRAND.md + DESIGN.md, extract relevant tokens for asset type, list sacred elements + lexicon (per brand-anchor-agent's role).
2. **Concept generation** — produce 3 distinct concept directions for the asset (or 1 under `--fast`) per concept-agent's role + `references/asset-types.md`.
3. **Copy anchor** — resolve in-asset copy from write-copy artifact OR interview user (per copy-anchor-agent's role).
4. **Brief synthesis** — merge anchor + concepts + copy + route + platform module into 3 candidate briefs (or 1 under `--fast`).
5. **Approval Gate 1** — STOP, present, await selection (skipped under `--fast`).
6. **Layer 2 handoff** — produce route-specific block (image-gen prompts / vector grid / designer spec / per-format prompts).
7. **Critic** — self-apply the 8-dimension Visual Rubric + 13-pattern Generic-AI-Aesthetic Detector + platform-fit check.
8. **Approval Gate 2** — STOP, present brief + critic, await acceptance.
9. **Write artifact** + tick ASSETS.md row (literal path match).

Single-agent fallback ships as `DONE_WITH_CONCERNS` with a note: "Ran in single-agent mode; rerun with multi-agent dispatch for parallel Layer 1 + 3-concept variety + named-agent rewrite loop."

---

## Layer 1 — Parallel Foundation

Spawn **IN PARALLEL**; outputs feed Layer 1.5:

| Agent | Instruction File | Pass These Inputs | Reference Files |
|-------|-----------------|-------------------|-----------------|
| Brand-Anchor Agent | `agents/brand-anchor-agent.md` | full BRAND.md + DESIGN.md + asset request | — |
| Concept Agent | `agents/concept-agent.md` | asset request + brand digest + route + target_tool + platform_module | `references/asset-types.md`, `references/platform-modules.md`, `references/failure-modes.md` |
| Copy-Anchor Agent | `agents/copy-anchor-agent.md` | asset request + copywriting artifact (if any) + brand voice rules | — |

All three return before Layer 1.5 dispatches. If one fails, retry once; if it fails twice, exit BLOCKED with the failed agent named.

---

## Layer 1.5 — Brief Synthesis

| Agent | Instruction File | Pass These Inputs | Reference Files |
|-------|-----------------|-------------------|-----------------|
| Brief Synthesizer | `agents/brief-synth-agent.md` | brand anchor + 3 concepts + copy + route + platform module + asset request | `references/asset-types.md`, `references/platform-modules.md` |

Output: 3 candidate briefs, each with concept name, visual direction, hierarchy, platform spec (resolved against the module), copy placement, failure modes to avoid.

Under `--fast`: brief-synth produces 1 brief instead of 3 (concept-agent already collapsed to 1 concept in single-pass mode).

---

## Approval Gate 1 — Brief Selection

**STOP and present** the 3 candidate briefs. Do not proceed to image-gen prompt or designer spec.

Format:

```
## Brief Candidates

### A. [Concept Name]
[Visual direction, mood, references — 3-5 lines]
**Why this:** [argument]
**Risk:** [main concern]

### B. [Concept Name]
...

### C. [Concept Name]
...

**Pick one (A/B/C), request revisions, or specify your own direction.**
```

User responses:
- **"A" / "B" / "C"** → proceed with that brief to Layer 2.
- **"Revise X"** → re-dispatch concept-agent with feedback, regenerate, re-present.
- **"None of these"** → ask one clarifying question, regenerate.
- **"Switch route to X"** → re-dispatch brief-synth with the new route. If concept-agent's tool-feasibility for that concept was RETHINK on the new route, re-run concept-agent first.
- **"Stop"** → save as `docs/forsvn/artifacts/marketing/design-briefs/[slug]-candidates.md`, exit BLOCKED.

Under `--fast`: Approval Gate 1 is SKIPPED (only 1 candidate exists; user reviews at Gate 2 only).

---

## Layer 2 — Downstream Handoff Augmentation

Dispatch ONE agent based on downstream route:

| Route | Agent | Output addition |
|-------|-------|--------|
| `image-gen` | `agents/prompt-craft-agent.md` | Image-gen prompt block (primary + 2 variants) appended to brief |
| `vector-tool` | (none — brief-synth-agent already wrote the vector spec block at Layer 1.5) | — |
| `designer-handoff` | `agents/figma-spec-agent.md` | Designer-handoff spec block appended to brief |
| `template-pack` | `agents/prompt-craft-agent.md` per format | Per-format prompt blocks |

`vector-tool` is intentionally a no-op at Layer 2 — the vector spec block (layout grid + token references + multi-format crops) is part of brief-synth's output, not a separate agent dispatch.

`template-pack` dispatches prompt-craft N times (once per platform variant); each invocation receives its variant's aspect ratio + safe zone + size cap baked into the prompt.

---

## Layer 3 — Critic Gate

| Agent | Instruction File | Receives |
|-------|-----------------|----------|
| Critic Agent | `agents/critic-agent.md` | Approved brief + Layer 2 output + platform module |

Critic produces an inline rubric report:

- **Rubric scores (8 dimensions, max 4 each):** Brand fidelity / Sacred respected / Hierarchy / Composition / Typography / Contrast / Format fit / CTA clarity (N/A allowed for Typography + CTA when not applicable).
- **Generic-AI-Aesthetic Detector (13 patterns, 0-3 each, max 39):** thresholds 0-7 clean (PASS available) / 8-15 DONE_WITH_CONCERNS at most / 16+ auto-FAIL re-dispatch Layer 2 with feedback.
- **Verdict:** PASS / FAIL / DONE_WITH_CONCERNS.

### Critic gate + rewrite loop

| Verdict | Orchestrator action |
|---|---|
| **PASS** | Proceed to Approval Gate 2. |
| **FAIL** | Re-dispatch the relevant Layer 2 agent OR brief-synth with critic feedback. Max 2 rewrite cycles total (cycle 1 = original; cycle 2 = re-dispatch). After 2 failures, deliver with critic annotations as `DONE_WITH_CONCERNS` at Gate 2. |
| **DONE_WITH_CONCERNS** | Proceed to Approval Gate 2; concerns are documented in the brief frontmatter for the user. |

Under `--fast`: critic runs single-pass (no rewrite loop). FAIL → deliver as DONE_WITH_CONCERNS with critic notes; user can rerun without `--fast` for the rewrite loop.

---

## Approval Gate 2 — Brief Acceptance

**STOP and present** the assembled brief + critic report.

Format:

```
## [Asset Name] — Design Brief — [Downstream route]

**Concept:** [name selected at Gate 1]
**Critic:** [PASS / DONE_WITH_CONCERNS]
**Score:** [/40 with sub-scores]

[Brief preview — concept, anchors, platform spec, copy placement, failure modes, handoff block]

[Critic notes — concerns to monitor]

**Approve to write artifact, revise, or reject.**
```

User responses:
- **"Approve"** →
  1. Write `docs/forsvn/artifacts/marketing/design-briefs/[slug].md`.
  2. **ASSETS.md auto-tick:** if the brief's asset path is a literal string match for a `brand/ASSETS.md` row's path field (never auto-tick on slug or asset-type heuristic), flip `[ ]` → `[x]` and append a date stamp. No match → skip; design-brief doesn't own ASSETS.md row creation (that's brand-system).
  3. Status DONE.
- **"Revise X"** → re-dispatch brief-synth or Layer 2 agent with feedback (1 cycle), re-present.
- **"Reject"** → save as `docs/forsvn/artifacts/marketing/design-briefs/[slug]-rejected.md` with a `Rejection Notes` block, exit BLOCKED.

Approval Gate 2 fires regardless of `--fast` — user acceptance is non-optional. Per anti-pattern #2.

---

## Chain position

**Previous:**
- `create-brand` — REQUIRED. Hard gate on `brand/BRAND.md` + `brand/DESIGN.md`.
- `brief-landing-page` — OPTIONAL. When design-brief is invoked from a landing-page asset slot, lp-brief passes the slot spec via `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/asset-slots/[slot-id].md`.
- `write-copy` — OPTIONAL. When in-asset copy is supplied separately via `docs/forsvn/artifacts/marketing/content/[slug].copy.md`.

**Next:**
- External rendering — `image-gen` route → Claude Design / Midjourney / Imagen / DALL·E / Ideogram / Veo / Suno. `vector-tool` route → Pencil / Figma. `designer-handoff` route → human designer with the Figma spec block. `template-pack` route → multi-format renderer ingesting per-format prompts.
- `brand/ASSETS.md` — auto-tick (literal path match) on DONE.
- `brief-landing-page` consumes design-brief output back when the brief was for a landing-page slot.

design-brief is the **bridge** between brand strategy (brand-system) and visual execution (downstream tools). It does NOT render; it produces the brief that downstream tools render against.

---

## Re-run triggers

Re-invoke brief-graphic when:

1. **BRAND.md or DESIGN.md updates** — brand anchors changed; previous brief is anchored to old tokens.
2. **New asset row in ASSETS.md** — brand-system added a row that needs a brief.
3. **lp-brief slot needs an explicit per-asset brief** — lp-brief invokes design-brief with the slot spec.
4. **Campaign launch** — new asset needed for campaign-plan's selected channels.
5. **Render dissatisfaction** — downstream tool produced something the user doesn't want; re-brief with revised concept or switch route.

Do NOT re-run for minor prompt tweaks on the same brief — those are post-render iteration on the renderer, not brief-level changes.

---

## Skill deference

Before dispatching, the orchestrator checks for intent mismatch and defers:

- **"Design our brand identity" / "Create our brand"** → defer to `create-brand`. design-brief consumes brand artifacts; it does NOT produce them. Sequence: `create-brand` first, then design-brief per asset.
- **"Write the headline for this ad"** → defer to `write-copy`. design-brief composes the asset around copy; it does NOT write headlines or CTAs. Sequence: `write-copy` first or in parallel, then design-brief consumes the copy artifact.
- **"Redesign this landing page"** → defer to `brief-landing-page`. design-brief is per-asset; lp-brief is per-page. lp-brief can route to brief-graphic per asset slot when the page-level architecture is decided.
- **"Render this for me"** → defer to the downstream renderer. design-brief is brief-only. Per anti-pattern #11.

Deference is **explicit** — emit the defer recommendation before dispatching design-brief. If the user wants both, run the upstream skill first so design-brief has artifacts to anchor against.
