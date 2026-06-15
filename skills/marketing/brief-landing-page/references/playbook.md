---
title: LP-Brief Playbook
lifecycle: canonical
status: stable
produced_by: lp-brief
load_class: PLAYBOOK
---

# LP-Brief Playbook

## Why this skill exists

lp-brief is the page-level orchestrator between strategy and design — it produces a campaign-grade landing-page brief (hypothesis, surface rhythm, section-by-section spec, asset slots, copy candidates, hand-off prompts) that a designer (or Claude Design, or coding agent) can execute without follow-up questions. The brief has a built-in conversion-principles gate (CP-01 → CP-14) that scores the brief at brief-time, so the page is *built* right rather than waiting for a separate heuristic audit pass after launch.

The orchestrator coordinates 9 specialized sub-agents across 5 layers + 3 approval gates: **Layer 1 parallel** (evidence-anchor + brand-anchor) lays the signal foundation; **Layer 1.5** generates 3 hypothesis candidates with the 3Q rubric (Visual / Falsifiable / Uniquely Ours); **Approval Gate 1** picks one. **Layer 2** produces architecture (surface rhythm + section list + ASCII diagram + scroll velocity); **Approval Gate 2** approves it. **Layer 3** writes the per-section spec; **Layer 3.5** materializes named asset slots (consumes section-spec slot IDs — sequential, not parallel, to prevent ID drift). **Layer 4** composes hand-off prompts (always emits `handoff-implementation.md`; optionally `handoff-claude-design.md` / `handoff-figma.md` / `handoff-designer.md`). **Layer 5** runs 2 critics in parallel (conversion + brand-voice); **Approval Gate 3** is the user's final say.

This skill is the canonical producer of `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/brief.md` + always-emitted `handoff-implementation.md`. Per-asset generation prompts at `asset-slots/[slot-id].prompt.md` are written by downstream media-briefing skills (`brief-graphic` today; future motion-brief / 3d-brief / video-brief as they ship).

## Why this skill exists at all

Six failure modes it prevents:

1. **Designer asks 5 follow-up questions.** A brief under 250 lines typically under-specifies sections, asset slots, and conversion gates. brand-voice critic G6 gates on completeness (headline candidates + CTA copy + conversion checklist per section), WARNs under 250, hard-FAILs under ~200; the conversion critic enforces per-section conversion-checklist completeness.
2. **Designer skims; misses critical spec.** Briefs over 500 lines bloat past the readable envelope. brand-voice critic G6 WARNs over 500 and hard-FAILs over ~700. Project skill-chain content is REFERENCED by section header, never inline-duplicated.
3. **Brand-good but conversion-bad output.** A brief that respects sacred + voice but ignores CP-01 (4-U headline), CP-02 (above-fold value), CP-03 (CTA first-person), CP-04 (5-field form maximum), CP-05 (message match), CP-08 (benefit-first), CP-09 (social proof authenticity), CP-11 (trust signal clustering), or CP-13 (3-second test) ships a beautiful page that doesn't convert. Conversion critic FAILs and re-dispatches section-spec.
4. **Conversion-good but brand-bad output.** A brief that hits every CP gate but proposes new logo treatment, glassmorphic hero overlay on a "matte" brand, or "Unlock seamless leverage" hero copy violates sacred and voice rules. Brand-voice critic G1 (sacred 4/4 required, non-negotiable) auto-FAILs and re-dispatches section-spec or asset-slot or brand-anchor.
5. **Coding agent invents asset URLs.** Implementation prompt without the verbatim Asset Placeholder Rule → coding agent fills `<img>` tags with hallucinated Unsplash URLs that 404 or load wrong imagery. Brand-voice critic G8b enforces the Asset Placeholder Rule verbatim + "Invent or substitute asset URLs" ban in the DO NOT block + closing rule verbatim ("Write production-ready, flawless code. Do not truncate. Do not use placeholder copy or invented imagery.").
6. **Heuristic-review-as-CRO drift.** Treating a brief teardown as "post-launch optimization" — the brief is *construction-time best-practice gating*, not measurement-driven optimization. Anti-patterns explicitly flag this; the skill defers post-launch CRO to `evaluate-landing-page` inside an existing eval-loop.

The structural answer is the **dual-critic gate** (conversion-critic: 14 CP-IDs scoring 11 hard-gates + 3 NOTE-only — CP-06, CP-10, CP-14; brand-voice-critic: 9 gates G1-G8b with sacred + envelope auto-FAIL). Both run in parallel at Layer 5; verdict is binary PASS/FAIL per critic; max 2 rewrite cycles; cycle-2 residual FAILs ship as DONE_WITH_CONCERNS with concerns pinned at top of brief.md (no silent failure).

## Philosophy

Brand fidelity > aesthetic novelty. Conversion craft > visual flair. Specificity > flexibility. Designer executes, doesn't interpret.

By the time lp-brief is invoked, WHY (hypothesis) and WHO (audience) should be stable — the brief turns those into HOW (architecture + section spec + asset slots) precise enough for execution. The conversion rubric is internalized here so the page is *built* right rather than fixed after launch. Sacred elements are rails, not options.

Three approval gates are intentional — hypothesis selection, architecture approval, and final brief acceptance — because the user owns 3 decisions that the orchestrator should not silently make: (1) which hypothesis to pursue, (2) whether the architecture serves the hypothesis, (3) whether to ship the brief or revise/kill.

The artifact IS the contract — a 14-section body schema with a 12-field frontmatter consumed by downstream coding agents, designers, and (indirectly via eval-loops) by `evaluate-landing-page` cycles. Schema changes require atomic update across all callers.

## Methodology

**Five-layer orchestration with three user gates, deliberate.**

- **Layer 1 (parallel):** evidence-anchor-agent + brand-anchor-agent. Evidence-anchor pulls signals from page state, ICP, campaign context, prior briefs, and any post-launch evidence. Brand-anchor pulls tokens, sacred elements, voice rules from BRAND.md + DESIGN.md. Both run simultaneously because they consume the same brief and produce non-overlapping digests.
- **Layer 1.5:** hypothesis-agent receives both digests + page tier + campaign context. Outputs 3 candidates, each scored 3Q (Visual / Falsifiable / Uniquely Ours).
- **Approval Gate 1:** user picks A / B / C, or asks to revise, or kills all.
- **Layer 2:** architecture-agent receives approved hypothesis + digests + tier. Outputs surface rhythm + section list + ASCII diagram + scroll velocity plan.
- **Approval Gate 2:** user approves / revises (max 1 revise cycle) / rejects (back to Layer 1.5 OR exit BLOCKED).
- **Layer 3:** section-spec-agent writes per-section spec — copy slots (with rubric-scored candidates), layout, motion, asset slot references, conversion-checklist embed per section.
- **Layer 3.5:** asset-slot-agent runs *after* section-spec (sequential, not parallel) because slot IDs originate in section-spec's per-section asset references. Parallel execution would guarantee ID drift.
- **Layer 4:** handoff-agent composes hand-off prompt blocks. Always emits `handoff-implementation.md` (universal coding-agent prompt; stack auto-detected at write time; falls back to pure HTML/CSS/Vanilla JS; motion stack from DESIGN.md or GSAP+ScrollTrigger+Lenis default; verbatim Asset Placeholder Rule from `references/handoff-formats.md`). Optionally emits `handoff-{claude-design,figma,designer}.md` per `target_handoff`.
- **Layer 5 (parallel):** conversion-critic + brand-voice-critic run in parallel against the assembled brief. Both return binary PASS/FAIL with per-FAIL `fix direction` naming the responsible agent (section-spec for copy/structure, asset-slot for asset, handoff for hand-off-only, brand-anchor for digest correction). Max 2 cycles total.
- **Approval Gate 3:** user sees the brief preview + critic merge. Approve → write artifacts to `docs/forsvn/artifacts/marketing/brief-landing-page/[slug]/`. Revise X → re-dispatch named layer (1 cycle). Reject → save as `rejected.md`, exit BLOCKED.

**Three routes by page state.**

- **Route A — Fresh LP** (no existing page). Standard pipeline. Layer 1 evidence-anchor pulls signals from ICP + campaign context only.
- **Route B — Existing LP redesign** (evidence-anchored). Same dispatch as Route A, but Layer 1 evidence-anchor reads current page state and any post-launch evidence (analytics/heatmaps/experiment notes). Hypothesis anchored in page-state gaps. "What Changed from rev N-1" section becomes mandatory when a prior brief exists.
- **Route C — Re-run with `--rev=N`.** Reads prior brief at `v[N-1]/brief.md`, runs Layer 1 to diff prior brief against fresh inputs, continues Route A/B from Layer 1.5. New brief at `v[N]/brief.md`; prior versions preserved.

**Two-cycle critic rewrite cap.** Cycle 1 FAIL → re-dispatch per critic's `fix direction` field (orchestrator does not hardcode failure→agent mappings; critics emit per-FAIL routing). Cycle 2 residual FAIL → DONE_WITH_CONCERNS, concerns pinned at top of brief.md AND in frontmatter `critic_scores`. User sees both reports at Approval Gate 3 and ships consciously.

## Principles

- **Critical Gates are binary.** 6 gates so load-bearing that violation = NEEDS_CONTEXT or auto-FAIL before delivery. (1) No brief without brand artifacts. (2) No skipping conversion rubric. (3) No proposing changes to sacred elements. (4) No breaching the brief envelope — completeness-gated, hard limits ~200/~700, 250-500 typical. (5) No inlining the full skill chain. (6) No injecting placeholder testimonials, fake logos, or pretend numbers.
- **Hard gates fire before any cold-start questioning.** Brand artifacts missing → NEEDS_CONTEXT immediately, before asking the user the 4 cold-start questions. Brand artifacts >60 days stale → warn before proceeding.
- **The 250-500 line envelope is the typical band; completeness is the gate.** Brand-voice critic G6 checks every section carries its headline candidates, CTA copy where applicable, and a conversion checklist. Outside 250-500 = WARN; hard FAIL only under ~200 (insufficient depth — designer asks follow-ups) or over ~700 (bloat — designer skims). The envelope assumes well-spaced markdown — empty lines count.
- **Per-FAIL routing comes from critics, not from the orchestrator.** Each FAIL includes `fix direction` naming the responsible agent. Orchestrator follows that direction; do not assume failure-class → agent mappings.
- **DONE_WITH_CONCERNS is the floor.** No silent FAIL outputs. Every critic concern visible in the artifact, pinned at top.
- **Sacred elements are rails, not options.** Inside-the-rails creativity only. G1 (sacred) auto-FAILs on a single violation — non-negotiable.
- **Asset placeholders, never inventions.** Slots without a render route (`pending-media-skill`) are spec'd with placeholder fallback (solid color, "delete cell if not real") and re-rendered when the appropriate media-briefing skill ships. Coding agents NEVER invent stock-photo URLs.
- **Always-emitted implementation prompt + optional specialty hand-offs.** `handoff-implementation.md` is the universal default for any frontier coding agent; specialty `handoff-{claude-design,figma,designer}.md` files are supplements for projects that also use a design tool or human designer.
- **The artifact IS the contract.** 12-field frontmatter + 14 body sections (Concerns / IMC Context / Hypothesis Approved / What Changed / Page Architecture / Section-by-Section Spec / Asset Slots / What NOT to Do / Implementation Prompt / Hand-Off / Pre-flight Checklist / Skill Chain / Launch Plan / Results / Why This Works). Schema changes require atomic update across upstream callers + downstream consumers.

## When NOT to use this skill

- **Need post-launch CRO from real evidence.** Use `evaluate-landing-page` inside an existing `run-pipeline`. lp-brief can read prior evals when producing the next brief, but does not pretend best-practice review is optimization.
- **Single visual asset spec, not whole page.** Use `brief-graphic` — per-asset brief, consumes BRAND.md + DESIGN.md.
- **No brand defined yet.** Use `create-brand` FIRST. Hard gate fires — lp-brief returns NEEDS_CONTEXT when BRAND.md or DESIGN.md is missing.
- **Need only headline variations.** Use `write-copy` — voice consumer, not page architect.
- **Non-LP page (blog, docs, navigation hub).** Out of scope. Conversion rubric doesn't apply — different rubric needed (info-density, scannability, link-density).
- **Programmatic-SEO templates (industries/:slug, workflows/:slug, compare/:vs:).** Out of scope for v1. Targets single-purpose conversion pages (tier 1). Programmatic templates need a different rubric (template-fillability, slug-coverage, dedup) and would dilute the conversion-critic. Future skill.

## History / origin

- **v1.0.0 — initial release.** 9-agent orchestration (evidence-anchor + brand-anchor parallel → hypothesis → approval → architecture → approval → section-spec → asset-slot → handoff → conversion-critic + brand-voice-critic parallel → approval). 3 routes (A fresh / B existing redesign / C `--rev=N`). 13 CP-IDs canonical conversion rubric (CP-01 → CP-13). 8 brand-voice gates (G1 sacred / G2 forbidden vocab / G3 preferred phrasing / G4 surface language / G5 token discipline / G6 250-500 envelope / G7 asset slot brand compliance / G8 hand-off verbatim). 3 approval gates (hypothesis selection / architecture approval / final brief acceptance). Always-emitted `handoff-implementation.md` companion + optional `handoff-{claude-design,figma,designer}.md`. Per-slot generation prompts at `asset-slots/{slot-id}.prompt.md` written by downstream `brief-graphic`.
- **v1.0.0 — G8b added (still v1).** Implementation Prompt Compliance gate (always-runs regardless of `target_handoff`) — Asset Placeholder Rule lifted verbatim from `references/handoff-formats.md`; URL-invention ban present in DO NOT block; closing rule verbatim ("Write production-ready, flawless code. Do not truncate. Do not use placeholder copy or invented imagery."); (BUG FIX) callouts present for any section-spec mechanic involving clip-path, mix-blend-mode + transform stacking, or sticky-inside-overflow patterns. Added because coding agents were inventing Unsplash URLs and shipping with broken `<img>` tags.
- **v1.0.0 — CP-14 added (still v1).** 5-Question Visitor Diagnostic appended to `conversion-principles.md` (append-only protocol) — a NOTE-grade cross-section sequence check (What is this / How does it solve my problem / Why trust you / Who else uses this / What do I do now) distinct from CP-13's hero-comprehension check. Conversion rubric is now **14 CP-IDs (CP-01 → CP-14): 11 hard gates + 3 NOTE-grade (CP-06, CP-10, CP-14)**. Wired into conversion-critic-agent (per-principle line + scoring pattern), surfaced as a NOTE not a FAIL; promote to FAIL only if the pre-launch foundation explicitly requires the diagnostic.
- **v6 Phase 2 Wave 1 refactor (May 18, 2026, still v1.0.0):** body trimmed 677 → 338 lines (-50%, 339 lines saved; 338 vs ≤300 mixed structural+creative target by 38 — accepted overage for natural floor of 9-agent / 5-layer / 3-approval-gate skill; Approval Gate 1+2+3 presentation blocks ≈56 lines must stay as bullets per design-brief slot 11 byte-identical precedent). 5 new refs: playbook + format-conventions (full 205-line artifact template extracted byte-identical + 12-field frontmatter schema + 14-section body structure + file naming + versioning + handoff companion naming + asset-slots/ path convention) + anti-patterns (NEW — extracted 11 body patterns + 4 cross-cutting marketing-stack rows) + procedures/{pre-dispatch, dispatch-mechanics}. Existing 9 agents + 7 data-catalog refs (conversion-principles, examples, failure-modes, handoff-formats, hypothesis-rubric, section-templates, surface-rhythm) + conversion/ subdir (6 source files) UNCHANGED — these ARE the skill's domain data + behavior. Before-Starting + Artifact Contract blocks added per Step 7.5 pattern. Layer 1/1.5/2/3/3.5/4 dispatch tables + 3 Approval Gate user-response handling tables EXTRACTED to dispatch-mechanics.md (body retains Routing Logic 3-route step lists + Layer 5 critic verdict logic + Approval Gate presentation blocks since those are user-facing contract). **Cross-stack contract preserved BYTE-IDENTICAL** (per vn-tone-slot + humanmaxxing-slot + brand-system-slot learnings): 6 Critical Gates, Inputs table, Output paths, dual-critic Quality Gate summary, Chain Position + Skill Deference, 9-agent Manifest, 3 Routes (A/B/C step lists), Hard gates (brand artifacts present + route classification), Pre-Dispatch needed dimensions (5), Project-Specific Workflows note, 3 Approval Gate presentation blocks (Gate 1 / Gate 2 / Gate 3), Layer 5 Critic Gate verdict logic (Cycle 1 + Cycle 2 tables), 12-field artifact frontmatter, 14-section body structure, 4-tier Completion Status Protocol. No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — hard gates (before any questioning), needed dimensions (5), read order, Warm Start prompt, Cold Start 4-question prompt, Write-back map, Project-Specific Workflows (shared chain doc vs per-page chain), Context to Pass to All Agents
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — how to spawn a sub-agent, single-agent fallback, Layer 1 parallel dispatch table, Layer 1.5 hypothesis dispatch, Layer 2 architecture dispatch, Layer 3 section-spec dispatch, Layer 3.5 asset-slot dispatch (sequential, not parallel — slot ID provenance), Layer 4 handoff dispatch, Layer 5 critic merge details + Approval Gate user-response handling for all 3 gates
- [`format-conventions.md`](format-conventions.md) [PROCEDURE] — full 205-line artifact template byte-identical, 12-field frontmatter schema, 14-section body structure, file naming (brief.md + handoff-implementation.md + optional handoff-{target}.md + per-slot asset-slots/{slot-id}.prompt.md), versioning (re-run with `--rev=N` writes to `v[N]/brief.md`, prior versions preserved), brief envelope rules (250-500 lines, well-spaced markdown, empty lines count), Concerns pinning rules for DONE_WITH_CONCERNS, IMC Context section format, Hypothesis Approved section format, Page Architecture section format (Surface Rhythm + Section List + ASCII Diagram + Scroll Velocity Plan), Section-by-Section Spec format (per-section copy candidates + rubric + visual + layout + motion + conversion-checklist), Asset Slots table format, What NOT to Do format, Implementation Prompt companion, Hand-Off specialty target format, Pre-flight Checklist, Skill Chain (per-page generation when no shared chain), Launch Plan, Results placeholder, Why This Works sanity check
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — 11 lp-brief-specific patterns (pretending heuristic review is CRO, generic hypothesis, inlining shared skill chain, stale or fake proof, ignoring sacred elements, no objection handling, brief too short, brief too long, hero copy violating voice, coding-agent inventing asset URLs, implementation-prompt sacred-creep, implementation-prompt stack mismatch) + 4 cross-cutting marketing-stack rows (upstream context skipped, cross-stack contract drift, polish-chain misroute, downstream eval-loop violation)
- [`conversion-principles.md`](conversion-principles.md) — canonical 14-principle conversion rubric (CP-01 → CP-14) read by section-spec-agent + conversion-critic-agent
- [`section-templates.md`](section-templates.md) — Hero / Value prop / Social proof / Features / Objection / FAQ / CTA section templates with conversion-checklist
- [`surface-rhythm.md`](surface-rhythm.md) — page-architecture patterns (scroll velocity, section beats, breathing room)
- [`hypothesis-rubric.md`](hypothesis-rubric.md) — 3Q scoring (Visual / Falsifiable / Uniquely Ours)
- [`handoff-formats.md`](handoff-formats.md) — Claude Design / Pencil MCP / Figma spec hand-off patterns + canonical Asset Placeholder Rule (lifted verbatim by handoff-agent into every implementation prompt)
- [`failure-modes.md`](failure-modes.md) — page-level failures (thin hero, weak CTA, no objection handling, brief bloat)
- [`examples.md`](examples.md) — 3 worked end-to-end walkthroughs (Route A fresh LP, Route B evidence-anchored redesign, Route C `--rev=N` with mixed-critic verdict)
- [`conversion/`](conversion/) subdir — 6 source files: core-principles, advanced-psychology, social-proof-trust, ux-design, testing-optimization, implementation-checklist (cited by conversion-principles.md CP-IDs)
- Shared: `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric, brand-system/*, design-brief/*}.md`
- Agents: 9 sub-agents in `agents/` — see Agent Manifest in SKILL.md. `conversion-critic-agent.md` holds the canonical CP-01 → CP-14 scoring rubric + Cross-Cutting Checks + Scoring Patterns Per CP + Tier Excuses + Cycle Logic. `brand-voice-critic-agent.md` holds the canonical G1-G8b gates + Sacred Element Detection + Voice Forbidden Vocab Detection + Token Discipline + Envelope Math
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
