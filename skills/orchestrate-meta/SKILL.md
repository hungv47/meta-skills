---
name: orchestrate-meta
description: "Cross-stack orchestrator. The top-level entry point when you don't know which stack to use. Reads project state, parses your ask, and either routes you to the right stack-orchestrator (`/orchestrate-research`, `/orchestrate-marketing`, `/orchestrate-product`) or proposes a meta-skill that wraps around your current work (discover for scoping, agents-panel for multi-perspective decisions, task-breakdown for decomposition, fresh-eyes for post-implementation review). Use when you're not sure which domain your task belongs to, or when you need a process skill (scoping, debate, decomposition, review) rather than a domain skill. Not for executing work itself — it routes. Renamed from `start-meta` in v3.0.0."
argument-hint: "[free-form ask, or empty to be guided]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
  budget: fast
  estimated-cost: "$0.03-0.10"
promptSignals:
  phrases:
    - "where do i start"
    - "what should i do"
    - "i don't know which skill"
    - "help me figure out where to start"
    - "what skill should i use"
    - "start"
    - "begin"
    - "guide me"
    - "i'm new here"
  allOf:
    - [where, start]
    - [what, skill, use]
  anyOf:
    - "where do i start"
    - "guide me"
    - "i'm new"
    - "scope this"
    - "decompose"
    - "review my work"
    - "debate this"
    - "multiple perspectives"
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
    - .agents/experience/meta-workflow.md
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
    - .agents/experience/*.md
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
    - skill: task-breakdown
      when: "a spec / architecture is done and needs to be decomposed into tasks"
    - skill: fresh-eyes
      when: "implementation is done and needs an independent review"
  parallel-with: []
  interactive: true
  estimated-complexity: low
---

# Orchestrate Meta

*Meta — Cross-stack orchestrator. The top-level entry point when you don't know where to start.*

**Core Job:** read project state, parse your ask, route to the right stack-orchestrator OR the right meta-skill.

**Core Question:** "Is this a domain task (research / marketing / product) or a process task (scope / debate / decompose / review)?"

This skill does NOT execute work. It is a router. The actual work is done by the skill it routes you to (which may itself be a router, like `/orchestrate-research`).

---

## When To Use

- You just installed the full agent-skills stack and don't know what to type.
- Your ask doesn't clearly belong to one domain ("I want to launch a new product feature" — could be research, product, marketing, or all three).
- You need a process skill: scope something with `discover`, debate a decision with `agents-panel`, decompose work with `task-breakdown`, review work with `fresh-eyes`.
- You want a quick read of "what's been done across the whole project."

## When NOT To Use

- You already know your domain — go straight to `/orchestrate-research`, `/orchestrate-marketing`, or `/orchestrate-product`.
- You already know your skill — invoke it directly.

---

## How It Works

**Tier note (`metadata.budget: fast`):** This is a pure router — no sub-agent dispatch, no critic gate. The body below runs in-line: read state, parse intent, propose next skill, await user confirmation. No `agents/` directory, no L1/L2 layers, no rewrite cycles. The premium-orchestration substrate (multi-agent + critic) lives in the skills this router proposes; running it here would be theater.

1. **Cross-stack state detection** — silently read `research/`, `brand/`, `architecture/`, `.agents/`, and `.agents/experience/*.md` to build a picture of the whole project.
2. **Domain classification** — parse the user's ask. Classify as: research / marketing / product / cross-stack / process.
3. **Routing decision** — either defer to a stack-orchestrator (`/start-X`) or propose a specific meta-skill.
4. **User confirmation** — print hand-off command. Never auto-invoke.

---

## Step 1: Cross-Stack State Detection

**Disk snapshot** (rendered inline when `/orchestrate-meta` is invoked — see `meta-skills/CLAUDE.md` §"Skill-Authoring Patterns" for the inline-shell-interpolation convention):

```
Artifacts by domain:
! `[ -d .agents/skill-artifacts ] && find .agents/skill-artifacts -mindepth 2 -name "*.md" -type f 2>/dev/null | awk -F/ '{print $3}' | sort | uniq -c | sort -rn | grep . || echo "  (no .agents/skill-artifacts/ yet)"`

Top-level canonical folders present:
! `found=0; for d in research brand architecture; do [ -d "$d" ] && { echo "  $d/ ✓"; found=1; }; done; [ $found -eq 0 ] && echo "  (none yet)" || true`

Last 5 commits in this repo:
! `git log --oneline -5 2>/dev/null | grep . || echo "no git history"`
```

The `! \`...\`` lines run at slash-command invocation time and substitute the command output — so the orchestrator starts from concrete state instead of speculating about what's on disk.

Then read `.agents/manifest.json` for the structured detail — it's the canonical state index, single file, all artifact metadata in one parse. If missing or clearly stale (check `updated_at`), regenerate it:

```bash
bun ${SKILLS_ROOT:-.claude/skills}/meta-skills/scripts/manifest-sync.ts
```

**Status-aware lookup:** for each artifact entry in `manifest.artifacts`, read `status` and `stale` to qualify the state map:

| Manifest signal | State map value |
|---|---|
| `status: done`, `stale: false` | ✅ done |
| `status: done_with_concerns` | ⚠️ done-with-concerns — surface the concern in routing output |
| `status: blocked` or `needs_context` | treat as missing |
| `stale: true` | ✅ done (stale) — propose refresh as an option, don't block |
| `frontmatter_present: false` | ✅ done (legacy, no frontmatter) — quality unknown, suggest refresh |

**Experience block:** `manifest.experience` tracks `.agents/experience/{domain}.md` files separately. The `entries` count per domain is a heuristic for "how much context has been gathered" — a domain with 7 entries is well-covered; one with 1 entry barely is.

See [`../../references/manifest-spec.md`](../../references/manifest-spec.md) for the full contract.

**Path reference / filesystem fallback** — used only when `.agents/manifest.json` doesn't exist (fresh project) or sync hasn't been run:

| Path | What it tells you |
|---|---|
| `CLAUDE.md` (project) | Project name, stack, conventions. |
| `research/product-context.md` | Cross-stack foundation exists. |
| `research/icp-research.md`, `research/market-research.md` | Research stack progress. |
| `brand/BRAND.md`, `brand/DESIGN.md` | Marketing stack foundation. |
| `architecture/system-architecture.md` | Product stack architecture done. |
| `.agents/skill-artifacts/product/flow/index.md` + flow files | Product flows mapped. |
| `.agents/skill-artifacts/meta/specs/*.md` | Spec exists from `discover`. |
| `.agents/skill-artifacts/meta/tasks.md` | Tasks decomposed from `task-breakdown`. |
| `.agents/skill-artifacts/meta/records/diagnose-*.md`, `.agents/skill-artifacts/meta/sketches/prioritize-*.md`, `.agents/skill-artifacts/meta/records/targets-*.md` | Research mid-pipeline outputs. |
| `.agents/skill-artifacts/mkt/campaign-plan.md` + `.agents/skill-artifacts/mkt/content/`, `.agents/skill-artifacts/mkt/lp-brief/`, etc. | Marketing artifacts. |
| `.agents/skill-artifacts/meta/records/cleanup-*.md`, `.agents/skill-artifacts/meta/records/machine-cleanup-*.md` | Cleanup audits. |
| `.agents/skill-artifacts/meta/decisions/[date]-*.md`, `.agents/skill-artifacts/meta/records/[date]-fresh-eyes-*.md` | Meta-skill artifacts (dated, immutable — lifecycle: decision / snapshot). |
| `.agents/experience/*.md` | All cold-start answers across stacks. |
| `.agents/experience/meta-workflow.md` | Prior `/orchestrate-meta` breadcrumb. |
| `.agents/skill-artifacts/meta/records/learned-rules.md` | Behavior corrections from prior sessions. |

Build a cross-stack state map:

```
research:
  product-context: done | partial | missing
  icp:             done | partial | missing
  market:          done | partial | missing
  diagnose:        done | not run
  prioritize:      done | partial | missing
  targets:         done | partial | missing

marketing:
  brand:           done | partial | missing
  campaign:        done | partial | missing
  content:         [list of slugs]
  lp:              [audit / brief / both / neither]
  seo:             [list of modes]
  short-form:      [list of slugs]
  outreach:        [list of slugs]

product:
  spec:            done | partial | missing
  flows:           [list]
  architecture:    done | partial | missing
  tasks:           done | partial | missing
  code-cleanup:    done | not run
  docs:            [skim]

meta:
  panel-reports:   [count, latest mtime]
  fresh-eyes:      [count, latest mtime]
  learned-rules:   [count]
```

**Project-fit check:** if `CLAUDE.md` describes a B2B SaaS but `research/icp-research.md` describes a consumer app, flag the mismatch. State may be from a different project.

---

## Step 2: Domain Classification

Parse the user's argument. Classify into one of these:

| User says | Classification | Route to |
|---|---|---|
| "audience", "ICP", "competitors", "market", "diagnose", "prioritize", "targets", "funnel" | research | `/orchestrate-research` |
| "brand", "campaign", "copy", "headline", "landing page", "LP", "SEO", "video", "TikTok", "cold email", "outreach", "humanize", "VN tone" | marketing | `/orchestrate-marketing` |
| "user flow", "tech stack", "architecture", "schema", "API", "code", "refactor", "machine cleanup", "docs", "README" | product | `/orchestrate-product` |
| "scope this", "clarify", "what should we build", "requirements" | process | `/discover` |
| "debate this", "multiple perspectives", "poll", "consensus", "what do experts think" | process | `/agents-panel` |
| "decompose", "task list", "break down", "implementation order", "tasks" | process | `/task-breakdown` |
| "review my work", "second opinion", "did I miss anything", "post-implementation review" | process | `/fresh-eyes` |
| Ambiguous, multi-domain, or "I want to launch a new product" | cross-stack | propose 2–3 stack orchestrators in sequence |
| Empty | unknown | ask scoping question |

**If empty**, ask:

> "What are you trying to do? Pick the closest match:
>
> 1. Understand my customers / market / problem (research)
> 2. Build brand / campaigns / content (marketing)
> 3. Design a feature / system / flow (product)
> 4. Scope something vague (`discover`)
> 5. Debate a decision (`agents-panel`)
> 6. Decompose work into tasks (`task-breakdown`)
> 7. Review work I just did (`fresh-eyes`)
> 8. I'm not sure — show me what's been done so far"

Option 8 prints the cross-stack state map and asks again.

---

## Step 3: Routing Decision

**Domain routing:**

1. **Single-domain intent** → defer to that stack's orchestrator. "Looks like a research task — run `/orchestrate-research`." Don't try to do `/orchestrate-research`'s job here.
2. **Process intent** → propose the specific meta-skill (`/discover`, `/agents-panel`, `/task-breakdown`, `/fresh-eyes`) with rationale.
3. **Cross-stack intent** ("launch a new product feature") → propose a 2-3 step path:
   - Step 1: `/orchestrate-research` (verify ICP exists; if no, run icp-research)
   - Step 2: `/orchestrate-product` (design feature: flows + architecture)
   - Step 3: `/orchestrate-marketing` (positioning + LP + content for launch)
   - Optional terminal: `/fresh-eyes` after each.

**Process-skill rules:**

4. **`discover`** — recommend when scope is genuinely unclear. Don't recommend if user has clear intent — they'll find it patronizing.
5. **`agents-panel`** — recommend when user explicitly wants debate, OR when multiple equally-valid options surface in routing and user wants help deciding.
6. **`task-breakdown`** — recommend when spec.md OR system-architecture.md exists AND user is about to build. Hard-gated on at least one upstream artifact.
7. **`fresh-eyes`** — recommend when user is finishing implementation OR has just produced a critical artifact (e.g., system-architecture, brand-system, lp-brief).

**Wrap-around suggestions:**
- After ANY recommendation that touches security-sensitive code, data-mutation code, or critical artifacts, mention `/fresh-eyes` as a terminal step.
- Before any non-trivial build, mention `/discover` as upstream if scope is unclear.

---

## Step 4: Present + Confirm

Output format for **single-domain**:

```
## Where you are (cross-stack snapshot)

Research:   icp ✅ · market ❌ · prioritize ❌
Marketing:  brand ❌ · campaign ❌ · content (none)
Product:    spec ❌ · flows (none) · architecture ❌
Meta:       no reports yet

## What you asked

"I want to figure out who my customers are" → research domain.

## Recommended: route to /orchestrate-research

Why: this is a research-domain task. /orchestrate-research will read the
research-stack state and propose the next skill (likely icp-research).

→  /orchestrate-research
```

Output format for **cross-stack**:

```
## What you asked

"I want to launch a new product feature" → cross-stack (research + product + marketing).

## Recommended path

1. /orchestrate-research        → verify audience clarity for the feature
2. /orchestrate-product         → design flows + architecture
3. /orchestrate-marketing       → positioning, LP, content for launch
   (optional /fresh-eyes after each artifact)

Each /orchestrate-X is its own router; you'll get sub-recommendations from each.

→  Run /orchestrate-research first.
```

Output format for **process skill**:

```
## What you asked

"I just finished implementing the auth migration — can you review it?"
→ process intent: post-implementation review.

## Recommended: /fresh-eyes

Why: post-implementation independent review. Runs an independent
agent against your changes, returns issues + severity.

Cost: ~$0.15-0.50 · Duration: ~3 min · Produces: .agents/skill-artifacts/meta/records/[date]-fresh-eyes-<slug>.md

→  /fresh-eyes
```

---

## Step 5: Persist + Hand Off

Append to `.agents/experience/meta-workflow.md`:

```markdown
## Session 2026-05-06

- Read state: cross-stack snapshot
- User intent: research-domain (audience clarity)
- Recommended: /orchestrate-research
- User confirmed: yes
```

Print:

> Run `/orchestrate-research` next. Re-run `/orchestrate-meta` if your task shifts to a different domain.

Exit.

---

## Pipeline Reference

For the canonical cross-stack pipeline, decision rules, and per-skill catalog, see [`./references/workflow-graph.md`](./references/workflow-graph.md).

---

## Anti-Patterns

- **Don't ignore the manifest** — always read `.agents/manifest.json` first; per-path filesystem scans are a fallback, not the default.
- **Don't duplicate work of /orchestrate-research, /orchestrate-marketing, /orchestrate-product.** When intent is single-domain, route there. Don't pick the specific skill yourself.
- **Don't lecture about all 24 skills.** Show only what's relevant to the user's ask + state.
- **Don't auto-invoke.** Always print `/skill-name` for the user to type.
- **Don't recommend `discover` defensively** when the user has clear intent. That's patronizing.
- **Don't recommend `task-breakdown` without a spec or architecture upstream.** It's hard-gated.
- **Don't recommend more than 3 hops** in a cross-stack path. If it needs 5+, surface that the project is too vague and recommend `discover` first.

---

## Output

- **Inline only.**
- **Side effect:** appends one entry to `.agents/experience/meta-workflow.md`.

## Status

Ends with one of:
- `DONE` — recommendation given, hand-off printed.
- `BLOCKED` — couldn't read project state.
- `NEEDS_CONTEXT` — empty ask + state too sparse to infer. Ask scoping question.
