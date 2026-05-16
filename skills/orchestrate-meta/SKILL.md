---
name: orchestrate-meta
description: "Cross-stack orchestrator. The top-level entry point when you don't know which stack to use. Reads project state, parses your ask, and either routes you to the right stack-orchestrator (`/orchestrate-research`, `/orchestrate-marketing`, `/orchestrate-product`) or proposes a meta-skill that wraps around your current work (discover for scoping, eval-loop for measurable improvement loops, agents-panel for multi-perspective decisions, task-breakdown for decomposition, fresh-eyes for post-implementation review). Use when you're not sure which domain your task belongs to, or when you need a process skill (scoping, loop setup, debate, decomposition, review) rather than a domain skill. Not for executing work itself — it routes. Renamed from `start-meta` in v3.0.0."
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
    - refactored_at: 2026-05-16
      refactored_for: implementation-roadmap v6 Phase 1E+ (router body-diet + playbook ref + chain hardening)
      body_before: 297
      body_after: 128
      body_delta_pct: -56.9
      note: body-only line counts (frontmatter excluded). Total file 399 → 225.
promptSignals:
  phrases:
    - "where do i start"
    - "what should i do"
    - "i don't know which skill"
    - "which skill should i use"
    - "help me figure out where to start"
    - "what skill should i use"
    - "start"
    - "begin"
    - "guide me"
    - "i'm new here"
  allOf:
    - [where, start]
    - [what, skill, use]
    - [which, skill, use]
  anyOf:
    - "where do i start"
    - "guide me"
    - "i'm new"
    - "scope this"
    - "decompose"
    - "review my work"
    - "debate this"
    - "multiple perspectives"
    - "eval loop"
    - "improvement loop"
  noneOf: []
  minScore: 4
routing:
  intent-tags:
    - cross-stack-orchestration
    - workflow-routing
    - top-level-entry-point
    - meta-orchestration
  position: orchestrator
  lifecycle: pipeline
  produces:
    - skills-resources/experience/meta-workflow.md
  side-effects:
    - manifest-sync
  consumes:
    - research/product-context.md
    - research/icp-research.md
    - research/market-research.md
    - brand/BRAND.md
    - brand/DESIGN.md
    - architecture/system-architecture.md
    - .agents/skill-artifacts/meta/specs/*.md
    - .agents/skill-artifacts/meta/records/diagnose-*.md
    - .agents/skill-artifacts/meta/sketches/prioritize-*.md
    - .agents/skill-artifacts/meta/records/targets-*.md
    - .agents/skill-artifacts/meta/tasks.md
    - .agents/skill-artifacts/product/flow/*.md
    - .agents/skill-artifacts/mkt/**/*.md
    - .agents/skill-artifacts/meta/**/*.md
    - skills-resources/experience/*.md
    - CLAUDE.md
  requires: []
  defers-to:
    - skill: orchestrate-research
      when: "intent is in the research domain (audience, market, diagnosis, prioritization, targets)"
    - skill: orchestrate-marketing
      when: "intent is in the marketing domain (brand, campaign, copy, LP, SEO, outreach)"
    - skill: orchestrate-product
      when: "intent is in the product domain (flows, architecture, code, machine, docs)"
    - skill: discover
      when: "scope or requirements are unclear before any other skill can run"
    - skill: agents-panel
      when: "a complex decision needs multiple perspectives or consensus"
    - skill: eval-loop
      when: "a measurable initiative needs a strategy/execution/evaluation workspace and results ledger"
    - skill: task-breakdown
      when: "a spec / architecture is done and needs to be decomposed into tasks"
    - skill: fresh-eyes
      when: "implementation is done and needs an independent review"
  parallel-with: []
  interactive: true
  estimated-complexity: low
---

# Orchestrate Meta — Router

*Meta — Cross-stack router. Reads project state, parses your ask, points at the right next skill. Does NOT execute work; that's the skill it routes you to.*

**Core Question:** "Is this a domain task (research / marketing / product) or a process task (scope / debate / decompose / review)?"

[Read `references/playbook.md` [PLAYBOOK] to understand why this skill does what it does — methodology, principles, when NOT to use.]

## When To Use

- Just installed the stack; don't know what to type.
- Ask doesn't clearly belong to one domain ("I want to launch a new product feature" — could be research, product, marketing, or all three).
- Need a process skill: scope (`discover`), measurable loop (`eval-loop`), debate (`agents-panel`), decompose (`task-breakdown`), review (`fresh-eyes`).

## When NOT To Use

- You already know your domain — go straight to `/orchestrate-research`, `/orchestrate-marketing`, or `/orchestrate-product`.
- You already know your skill — invoke it directly.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode declaration** — this skill is `budget: fast` with no escalation path (no sub-agents, no critic gate, no `--apply`-style modes). The mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) resolves to `fast` and runs. No emit-and-wait prompt — there's no meaningful mode to escalate to. The resolver's load-bearing job here is enforcing "safety gates don't skip under `--fast`": state snapshot still runs; routing still produces a hand-off; no auto-invoke regardless.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify this skill's output path matches the canonical inventory.
2. Read `.agents/manifest.json` + `.agents/artifact-index.md` (meta-skill foundation files).
3. `skills-resources/experience/*.md` files are read as **state input** (per `routing.consumes`) — not as cold-start dimension resolution. This skill IS the entry point that produces `skills-resources/experience/meta-workflow.md`, so Pre-Dispatch's experience-dimension read doesn't apply.
4. If `.agents/manifest.json` is missing AND no filesystem fallback paths exist (fresh project) → use the empty-ask fallback in [`references/output-formats.md`](references/output-formats.md) [PROCEDURE] Format 4 to scope.

## Artifact Contract

- **Path:** `skills-resources/experience/meta-workflow.md` (append-only breadcrumb log)
- **Lifecycle:** `pipeline` (⚠️ canonical-paths.md flags this as a lifecycle violation — orchestrate-* workflow state should move to `meta/orchestrator-state/` per Phase 2 cleanup; current behavior preserved verbatim for backwards-compat)
- **Frontmatter fields:** none required on the file itself; each append is timestamped + decision-tagged
- **Required sections per append:** `## Session YYYY-MM-DD` heading + bullet list (Read state / User intent / Recommended / User confirmed)
- **Consumed by:** future `/orchestrate-meta` invocations (precedent), operator (breadcrumb history). No machine consumer parses this today.
- **Side effect:** appends one block; no overwrite, no delete.

## Decision Tree (the routing core)

### Step 1 — Cross-stack state snapshot

Render the disk snapshot inline. Shell-bang interpolation fires at slash-command invocation per `meta-skills/CLAUDE.md` §"Inline shell interpolation":

```
Artifacts by domain:
! `[ -d .agents/skill-artifacts ] && find .agents/skill-artifacts -mindepth 2 -name "*.md" -type f 2>/dev/null | awk -F/ '{print $3}' | sort | uniq -c | sort -rn | grep . || echo "  (no .agents/skill-artifacts/ yet)"`

Evidence loops:
! `find .agents/skill-artifacts/mkt/loops .agents/skill-artifacts/product/loops .agents/skill-artifacts/research/loops -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sed 's#^#  #' | sort | grep . || echo "  (no loops yet)"`

Top-level canonical folders present:
! `found=0; for d in research brand architecture; do [ -d "$d" ] && { echo "  $d/ ✓"; found=1; }; done; [ $found -eq 0 ] && echo "  (none yet)" || true`

Last 5 commits:
! `git log --oneline -5 2>/dev/null | grep . || echo "no git history"`
```

Then read `.agents/manifest.json` (canonical). If missing or stale (>24h per `updated_at`), run `bun scripts/manifest-sync.ts` first. Build the structured state map per [`references/state-map-template.md`](references/state-map-template.md) [PROCEDURE] (manifest signal interpretation, filesystem fallback paths, project-fit check all live there).

### Step 2 — Classify the ask

Parse the user's argument into one of these:

| User says | Classification | Route to |
|---|---|---|
| "audience", "ICP", "competitors", "market", "diagnose", "prioritize", "targets", "funnel" | research | `/orchestrate-research` |
| "brand", "campaign", "copy", "headline", "landing page", "LP", "SEO", "video", "TikTok", "cold email", "outreach", "humanize", "VN tone" | marketing | `/orchestrate-marketing` |
| "user flow", "tech stack", "architecture", "schema", "API", "code", "refactor", "machine cleanup", "docs", "README" | product | `/orchestrate-product` |
| "scope this", "clarify", "what should we build", "requirements" | process | `/discover` |
| "debate this", "multiple perspectives", "poll", "consensus" | process | `/agents-panel` |
| "decompose", "task list", "break down", "implementation order" | process | `/task-breakdown` |
| "review my work", "second opinion", "did I miss anything" | process | `/fresh-eyes` |
| "improvement loop", "track metric", "experiment ledger" | process | `/eval-loop` |
| Ambiguous, multi-domain, or "I want to launch a new product feature" | cross-stack | propose 2–3 stack orchestrators in sequence |
| Empty | unknown | emit Format 4 scoping prompt |

### Step 3 — Apply routing rules

- **Single-domain** → defer to the stack orchestrator. Don't pick the specific skill yourself.
- **Process intent** → propose the specific meta-skill with one-line rationale.
- **Cross-stack** → propose a 2-3 step chain (max 3 hops; ≥5 means project too vague → recommend `/discover` first).
- **`task-breakdown` is hard-gated** — only recommend if `meta/specs/*.md` OR `architecture/system-architecture.md` exists upstream.
- **Wrap-around:** if the recommendation touches security/auth/data-mutation/critical artifacts, append `(optional /fresh-eyes after)`.
- **`discover` defensively** is patronizing when intent is clear — only recommend for genuinely unclear scope.

For the full per-skill catalog + decision rules, see [`references/workflow-graph.md`](references/workflow-graph.md).

### Step 4 — Present + confirm

Emit one of the four formats in [`references/output-formats.md`](references/output-formats.md) [PROCEDURE]: single-domain (Format 1), cross-stack (Format 2), process-skill (Format 3), or empty-ask scoping fallback (Format 4). Never auto-invoke; always print `→  /skill-name` for the operator to type.

### Step 5 — Persist + hand off

Append to `skills-resources/experience/meta-workflow.md`:

```markdown
## Session YYYY-MM-DD
- Read state: <one-line summary>
- User intent: <classification>
- Recommended: /<skill>
- User confirmed: <yes / pending / redirected>
```

Then print the hand-off line and exit. Operator types the next slash command.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before emitting any recommendation that smells off — long cross-stack chain, defensive `/discover`, picking a specific skill instead of routing to the orchestrator.

## Completion Status

- **DONE** — recommendation given, hand-off printed, breadcrumb appended.
- **BLOCKED** — couldn't read project state (manifest missing AND no fallback paths AND fresh-project bootstrap unclear).
- **NEEDS_CONTEXT** — empty ask + state too sparse to infer. Emit Format 4 scoping prompt and exit (operator re-runs with answer).

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill exists, methodology, principles, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern (canonical at `meta-skills/references/`, synced)
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior contract
- [`references/state-map-template.md`](references/state-map-template.md) [PROCEDURE] — manifest signals + filesystem fallback paths + state map structure
- [`references/output-formats.md`](references/output-formats.md) [PROCEDURE] — the 4 output shapes (single-domain, cross-stack, process-skill, scoping fallback)
- [`references/workflow-graph.md`](references/workflow-graph.md) — full cross-stack pipeline + per-skill catalog
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`references/_shared/manifest-spec.md`](references/_shared/manifest-spec.md) — manifest contract Step 1 reads
- `agent-skills/CLAUDE.md` §"Artifact Placement" — lifecycle taxonomy this skill writes against (umbrella dependency, not shipped under `npx skills add --skill orchestrate-meta` standalone install; the lifecycle this skill emits — `pipeline`, with the ⚠️ flag noted in Artifact Contract — is documented inline above; consult the umbrella for the full 11-row table — no separate link needed)
