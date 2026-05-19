---
name: orchestrate-research
description: "Stack orchestrator for research-skills. Reads what's already done in `research/` and `.agents/skill-artifacts/`, parses your intent, and proposes the next 1–3 skills in the research pipeline (icp-research → market-research / diagnose → prioritize → funnel-planner). Use when you don't know which research skill to invoke, or want a guided run through the full audience/market/strategy workflow. Not for executing the work itself — it routes to the skill that does. Not for cross-stack workflows (use orchestrate-meta or invoke skills directly). Renamed from `start-research` in v3.0.0."
argument-hint: "[free-form ask, or empty to be guided]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
  budget: fast
  estimated-cost: "$0.03-0.10"
  refactor_history:
    - refactored_at: 2026-05-17
      refactored_for: implementation-roadmap v6 Phase 2 Wave 2 (router body-diet + playbook ref + chain hardening, mirrors orchestrate-product post-refactor structure)
      body_before: 240
      body_after: 131
      body_delta_pct: -45.4
      note: |
        Body-only line counts (frontmatter excluded). Total file 309 → 207.
        Additive parity with sibling routers (orchestrate-meta + orchestrate-product, both shipped wave-1) — flagged by fresh-eyes round 1:
          * Rule 11 wrap-around `/fresh-eyes` suggestion (net-new in this skill; sibling parity).
          * Short-form-research promoted from `consumes`-only to first-class Step 2 intent row + Step 3 rule 7 (baseline router could not explicitly recommend it; capability was implicit).
          * `/discover` added as Step 2 intent row + rule 12 cross-route exception (genuinely net-new vs baseline, which had zero `/discover` mention anywhere; matches sibling routers orchestrate-meta + orchestrate-product wave-1 which both accept `/discover` as a routing destination).
          * Stale-day thresholds (icp/market 90, diagnose/prioritize/targets 60, short-form 30) documented in state-map-template per manifest's `stale_after_days` defaults — documents existing behavior; not net-new.
promptSignals:
  phrases:
    - "where do i start with research"
    - "i want to research"
    - "help me plan research"
    - "what skill should i use for research"
    - "start research"
    - "begin research"
    - "research workflow"
  allOf:
    - [where, start, research]
    - [what, skill, research]
  anyOf:
    - "research workflow"
    - "research pipeline"
    - "guide me through research"
  noneOf:
    - "code review"
    - "marketing campaign"
    - "landing page"
  minScore: 5
routing:
  intent-tags:
    - research-orchestration
    - workflow-routing
    - stack-entry-point
    - research-guide
  position: orchestrator
  lifecycle: pipeline
  produces:
    - skills-resources/experience/research-workflow.md
  side-effects:
    - manifest-sync
  consumes:
    - research/product-context.md
    - research/icp-research.md
    - research/market-research.md
    - .agents/skill-artifacts/meta/records/[date]-diagnose-[slug].md
    - .agents/skill-artifacts/meta/sketches/prioritize-[slug].md
    - .agents/skill-artifacts/meta/records/targets-[slug].md
    - skills-resources/experience/*.md
  requires: []
  defers-to:
    - skill: icp-research
      when: "no audience clarity yet — entry point of the research pipeline"
    - skill: market-research
      when: "audience clear, market landscape unclear"
    - skill: diagnose
      when: "known problem or metric decline to root-cause"
    - skill: prioritize
      when: "options landscape needs ranking"
    - skill: funnel-planner
      when: "revenue model needs numeric targets"
  parallel-with: []
  interactive: true
  estimated-complexity: low
---

# Orchestrate Research — Router

*Meta — Stack orchestrator. Reads research-stack state, parses your ask, points at the right next skill. Does NOT execute work; that's the skill it routes you to.*

**Core Question:** "Given what's in `research/` and `.agents/skill-artifacts/`, plus what you just asked, what's the highest-leverage research skill to run next?"

[Read `references/playbook.md` [PLAYBOOK] to understand why this skill does what it does — methodology, principles, when NOT to use.]

## When To Use

- Just installed research-skills and don't know what to type.
- Mid-project and forget which skill is next.
- Vague need ("understand my market", "figure out who buys this", "why are conversions tanking") and want guided routing.
- Resuming across sessions — re-running `/orchestrate-research` re-reads state and resumes from the next step.

## When NOT To Use

- You already know which skill to run.
- Task is cross-stack (e.g., research → marketing → product) — use `/orchestrate-meta` or compose conversationally.
- You want execution rather than routing.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode declaration** — this skill is `budget: fast` with no escalation path (no sub-agents, no critic gate, no `--apply`-style modes). The mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) resolves to `fast` and runs. No emit-and-wait prompt — there's no meaningful mode to escalate to. The resolver's load-bearing job here is enforcing "safety gates don't skip under `--fast`": state snapshot still runs; routing still produces a hand-off; no auto-invoke regardless.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify this skill's output path matches the canonical inventory.
2. Read `.agents/manifest.json` + `.agents/artifact-index.md` (research-skill foundation files).
3. `skills-resources/experience/*.md` files are read as **state input** (per `routing.consumes`) — not as cold-start dimension resolution. This skill IS the entry point that produces `skills-resources/experience/research-workflow.md`, so Pre-Dispatch's experience-dimension read doesn't apply.
4. If `.agents/manifest.json` is missing AND no filesystem fallback paths exist (fresh project) → use the empty-ask fallback in [`references/output-formats.md`](references/output-formats.md) [PROCEDURE] Format 4 to scope.

## Artifact Contract

- **Path:** `skills-resources/experience/research-workflow.md` (append-only breadcrumb log)
- **Lifecycle:** `pipeline` (⚠️ canonical-paths.md flags this as a lifecycle violation — orchestrate-* workflow state should move to `meta/orchestrator-state/` per Phase 2 cleanup; current behavior preserved verbatim for backwards-compat)
- **Frontmatter fields:** none required on the file itself; each append is timestamped + decision-tagged
- **Required sections per append:** `## Session YYYY-MM-DD` heading + bullet list (Read state / User intent / Recommended / User confirmed)
- **Consumed by:** future `/orchestrate-research` invocations (precedent + re-entry detection), operator (breadcrumb history). No machine consumer parses this today.
- **Side effect:** appends one block; no overwrite, no delete.

## Decision Tree (the routing core)

### Step 1 — Research-stack state snapshot

Render the disk snapshot inline. Shell-bang interpolation fires at slash-command invocation per `CLAUDE.md` §"Inline shell interpolation":

```
Artifacts by domain:
! `[ -d .agents/skill-artifacts ] && find .agents/skill-artifacts -mindepth 2 -name "*.md" -type f 2>/dev/null | awk -F/ '{print $3}' | sort | uniq -c | sort -rn | grep . || echo "  (no .agents/skill-artifacts/ yet)"`

Top-level canonical folders present:
! `found=0; for d in research brand architecture; do [ -d "$d" ] && { echo "  $d/ ✓"; found=1; }; done; [ $found -eq 0 ] && echo "  (none yet)" || true`

Last 5 commits in this repo:
! `git log --oneline -5 2>/dev/null | grep . || echo "no git history"`
```

Then read `.agents/manifest.json` (canonical). If missing or stale (>24h per `updated_at`), run `bun scripts/manifest-sync.ts` first. Build the structured state map per [`references/state-map-template.md`](references/state-map-template.md) [PROCEDURE] (manifest signal interpretation, filesystem fallback paths, state-map structure, stale-detection rules, project-fit check, re-entry behavior all live there).

### Step 2 — Classify the ask

Parse the user's argument into one of these:

| User says | Classification | Pipeline position |
|---|---|---|
| "understand my customer", "who buys this", "personas", "voice of customer" | audience-research | `/icp-research` |
| "market sizing", "TAM/SAM/SOM", "competitors", "market landscape", "whitespace" | market-mapping | `/market-research` |
| "why is X dropping", "root cause", "metric decline", "diagnose this problem" | problem-diagnosis | `/diagnose` |
| "what should we build", "prioritize features", "ICE score", "options ranking" | option-ranking | `/prioritize` (hard-gated on upstream) |
| "revenue targets", "funnel math", "how much traffic do I need", "unit economics" | target-setting | `/funnel-planner` (hard-gated on prioritize) |
| "research short-form for X platform", "TikTok trends", "what's working on Reels" | short-form-research | `/short-form-research` (standalone per-platform) |
| "scope this", "clarify requirements", "what should we build" | discovery | `/discover` (meta) |
| Empty or ambiguous | unknown | emit Format 4 scoping prompt |

### Step 3 — Apply routing rules

Apply in order; first match wins:

1. **Audience-foundation gate:** any audience-or-strategy intent AND no `research/product-context.md` → propose `/icp-research` first. Rationale: 13+ downstream skills consume this artifact; skipping produces hollow output everywhere.
2. **ICP done + market intent** → `/market-research`. Rationale: with audience defined, market landscape becomes targeted (which segment owns which competitor, etc.).
3. **ICP done + diagnose intent** → `/diagnose`. NOTE: requires a specific problem statement; if user says "things feel off," push back and ask for a metric before routing (per anti-patterns).
4. **ICP + (market OR diagnose) done + prioritize intent** → `/prioritize`. Rationale: it consumes both upstream artifacts and is hard-gated on them.
5. **Prioritize done + targets intent** → `/funnel-planner`. Rationale: hard-gated on prioritize.md.
6. **ICP done + ambiguous intent** → propose 2 options (typically `/market-research` and `/diagnose`) with one-line rationale each. Let operator pick (per output-formats Format 1 variant).
7. **Short-form-research intent** → `/short-form-research` as standalone (Format 1) with platform argument. Never bundle into the audience/market/strategy pipeline.
8. **No clear intent + everything done** → research stack exhausted. Recommend `/orchestrate-marketing` or `/orchestrate-product` (Format 3).
9. **Stale ICP** (warn-but-don't-block per state-map-template): include staleness warning, offer refresh, route forward if operator chooses.
10. **Skip-rules:** operator explicitly says "I just want X" without upstream → respect it, route to X, include the quality-drop caveat line in the recommendation.
11. **Wrap-around:** recommendations gating high-stakes downstream work (e.g., prioritize feeding a launch) → append `(optional /fresh-eyes after)`.
12. **Don't cross-route** outside `/discover` — marketing/product/other meta-skills go through `/orchestrate-meta`.

### Step 4 — Present + confirm

Emit one of the four formats in [`references/output-formats.md`](references/output-formats.md) [PROCEDURE]: single-route (Format 1), combined-path (Format 2), cross-stack process route (Format 3), or empty-ask scoping fallback (Format 4). Never auto-invoke; always print `→  /skill-name` for the operator to type.

### Step 5 — Persist + hand off

Append to `skills-resources/experience/research-workflow.md`:

```markdown
## Session YYYY-MM-DD
- Read state: <one-line summary>
- User intent: <classification>
- Recommended: /<skill>
- User confirmed: <yes / pending / redirected>
```

Then print the hand-off line and exit. Operator types the next slash command.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before emitting any recommendation that smells off — routing past missing ICP, recommending hard-gated skills without upstream, defaulting to `/icp-research` on empty ask, bundling short-form-research into the pipeline.

## Completion Status

- **DONE** — recommendation given, hand-off printed, breadcrumb appended.
- **BLOCKED** — couldn't read project state (manifest missing AND no fallback paths AND fresh-project bootstrap unclear).
- **NEEDS_CONTEXT** — empty ask + state too sparse to infer. Emit Format 4 scoping prompt and exit (operator re-runs with answer).

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill exists, methodology, principles, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern (canonical at `references/`, synced)
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior contract
- [`references/state-map-template.md`](references/state-map-template.md) [PROCEDURE] — manifest signals + filesystem fallback paths + state map structure + stale detection + re-entry
- [`references/output-formats.md`](references/output-formats.md) [PROCEDURE] — the 4 output shapes (single-route, combined-path, cross-stack-process, scoping fallback)
- [`references/workflow-graph.md`](references/workflow-graph.md) — full research-stack pipeline + per-skill catalog + decision rules
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`references/_shared/manifest-spec.md`](references/_shared/manifest-spec.md) [PROCEDURE] — manifest contract Step 1 reads
- `research-skills/CLAUDE.md` §"Manifest Spec" + §"Complexity Routing" — stack-level conventions this skill inherits
