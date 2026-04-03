# Skill Registry

> Compiled reference for navigate. Maps intents to skills, disambiguates confusable pairs, and provides pre-built workflow templates.

## Intent → Skill Quick Reference

| "I want to..." | Run this | Not this |
|----------------|----------|----------|
| Understand my audience | `/icp-research` | `/market-research` (that's landscape, not audience) |
| See what competitors do | `/market-research` | `/icp-research` (that's YOUR audience, not competitors) |
| Figure out why metric X is declining | `/problem-analysis` | `/market-research` (that's landscape, not diagnosis) |
| Decide what to build next | `/solution-design` | `/discover` (that clarifies HOW, not WHAT) |
| Set growth targets | `/funnel-planner` | `/experiment` (that tests, not targets) |
| Test an idea before going all-in | `/experiment` | `/funnel-planner` (that sets targets, not tests) |
| Write a headline / CTA / tagline | `/copywriting` | `/content-create` (that's full assets, not craft) |
| Create a social post / email / blog | `/content-create` | `/copywriting` (that's craft, not format) |
| Plan a marketing campaign | `/imc-plan` | `/content-create` (that writes assets, not strategy) |
| Audit a landing page for conversion | `/lp-optimization` | `/copywriting` (that writes, not audits) |
| Improve search rankings | `/seo` | `/content-create` (SEO is discovery, not creation) |
| Make AI text sound human | `/humanize` | `/copywriting` (that writes new, not polishes) |
| Track what marketing works | `/attribution` | `/funnel-planner` (that sets targets, not tracks) |
| Design a brand identity | `/brand-system` | `/user-flow` (that's UX, not brand) |
| Map screens and user journeys | `/user-flow` | `/brand-system` (that's visual, not flow) |
| Clarify a vague idea into a spec | `/discover` | `/system-architecture` (that designs, not clarifies) |
| Scope a task before building | `/discover` | `/system-architecture` (that designs, not scopes) |
| Design tech stack + DB schema | `/system-architecture` | `/task-breakdown` (that decomposes, not designs) |
| Break work into buildable tasks | `/task-breakdown` | `/system-architecture` (that designs, not decomposes) |
| Clean up messy code | `/code-cleanup` | `/task-breakdown` (that plans new work, not cleans) |
| Generate docs from code | `/technical-writer` | `/discover` (that writes specs, not docs) |
| Have agents debate a decision | `/agent-room` (debate mode) | `/agent-room` poll (that polls independently, not debates) |
| Get consensus from multiple perspectives | `/agent-room` (poll mode) | `/agent-room` debate (that debates, not polls) |
| Verify code/output quality | `/review-chain` | `/code-cleanup` (that refactors, not reviews) |
| See what artifacts exist / what's stale | `/navigate status` | — |
| Figure out what to do next | `/navigate [your goal]` | — |

---

## Disambiguation: Commonly Confused Skills

### icp-research vs. market-research
- **icp-research:** YOUR audience — personas, pain points, VoC quotes, habitats
- **market-research:** THE market — competitors, sizing, trends, whitespace
- **Rule:** "Who are we selling to?" → icp-research. "What does the market look like?" → market-research.
- **Both needed?** Yes — they run in parallel and feed independently into solution-design.

### copywriting vs. content-create
- **copywriting:** CRAFT quality — headlines, hooks, CTAs with rubric scoring and annotations
- **content-create:** ASSET production — full carousel, thread, email, blog in platform-native format
- **Rule:** Polished headline → copywriting. Complete LinkedIn carousel → content-create.
- **Together:** content-create often calls copywriting internally for key lines.

### discover vs. system-architecture vs. task-breakdown
- **discover:** Clarify WHAT to build (conversational discovery, optionally saves spec.md)
- **system-architecture:** Design HOW to build it (tech stack, schema, API → system-architecture.md)
- **task-breakdown:** Decompose into STEPS (granular tasks with acceptance criteria → tasks.md)
- **Rule:** Unclear idea → discover (conversation) → system-architecture → task-breakdown. Or if it's simple: discover → build directly.
- **discover is interactive** — asks questions conversationally during the session.

### solution-design vs. funnel-planner vs. experiment
- **solution-design:** WHAT initiatives to pursue (ICE scoring, prioritization)
- **funnel-planner:** WHAT numbers to hit (backward from revenue to traffic)
- **experiment:** HOW to validate before committing (A/B, pilot, cohort)
- **Rule:** solution-design picks the bets → funnel-planner sets the targets → experiment tests the bets.

### lp-optimization vs. copywriting (for landing pages)
- **lp-optimization:** AUDIT an existing page for conversion problems (hero, CTA, trust, UX)
- **copywriting:** WRITE new landing page copy from scratch
- **Rule:** Page exists and underperforms → lp-optimization. Building a new page → copywriting.

### humanize vs. copywriting
- **humanize:** POLISH existing text — strip AI patterns, inject voice, compress
- **copywriting:** WRITE new text from scratch with craft quality
- **Rule:** Text already written but sounds robotic → humanize. Need new copy → copywriting.

### attribution vs. funnel-planner
- **attribution:** MEASURE what marketing is working (map activities to outcomes)
- **funnel-planner:** SET targets (model funnel stages, define success metrics)
- **Rule:** "What should our conversion targets be?" → funnel-planner. "Which channels are driving conversions?" → attribution.

### agent-room debate vs. agent-room poll
- **debate:** Agents READ each other's responses and ARGUE across rounds. Produces convergence through disagreement.
- **poll:** Agents work INDEPENDENTLY with varied framings. Produces consensus through aggregation.
- **Rule:** Trade-off decision with no clear answer → debate. Need to filter hallucinations / find the mode → poll.

### review-chain vs. code-cleanup
- **review-chain:** CHECK quality — spawn a fresh-eyes reviewer, then resolve issues found. Does not restructure.
- **code-cleanup:** RESTRUCTURE code — refactor for readability, remove dead code, simplify. Changes structure.
- **Rule:** "Is this code correct?" → review-chain. "Make this code cleaner." → code-cleanup.
- **Together:** code-cleanup first (restructure), then review-chain (verify the restructuring didn't break anything).

---

## Pre-Built Workflow Templates

### Template 1: Full Product Launch
**Trigger phrases:** "launch", "new product", "go to market", "build and ship"
**Skills (16 steps):**
```
Phase 1 — Foundation:
  /icp-research → product-context.md

Phase 2 — Research (parallel):
  /market-research → market-research.md     ┐ run simultaneously
  /problem-analysis → problem-analysis.md   ┘

Phase 3 — Strategy:
  /solution-design → solution-design.md

Phase 4 — Planning (parallel):
  /brand-system → design/brand-system.md    ┐
  /imc-plan → mkt/imc-plan.md              ┘ run simultaneously
  /funnel-planner → targets.md

Phase 5 — Design:
  /user-flow → design/user-flow.md

Phase 6 — Spec & Architecture:
  /discover (interactive conversation)
  /system-architecture → system-architecture.md

Phase 7 — Build:
  /task-breakdown → tasks.md
  (execution — build the tasks, /review-chain after critical tasks)

Phase 8 — Ship:
  /ship → ship-report.md
  /deploy-verify → deploy-verify-report.md

Phase 9 — Content:
  /content-create → mkt/content/*.md
  /copywriting → mkt/content/*.copy.md
  /humanize → mkt/content/*.humanized.md

Phase 10 — Optimize:
  /lp-optimization → mkt/lp-optimization.md
  /seo → mkt/seo-*.md

Phase 11 — Validate:
  /experiment → experiment-*.md
  /attribution → mkt/attribution.md
```

### Template 2: Content Campaign
**Trigger phrases:** "content campaign", "marketing campaign", "launch content"
**Skills (7 steps):**
```
Phase 1: /icp-research → product-context.md
Phase 2: /imc-plan → mkt/imc-plan.md
Phase 3: /content-create → mkt/content/*.md
Phase 4: /copywriting → mkt/content/[slug].copy.md
Phase 5: /humanize → mkt/content/*.humanized.md
Phase 6: /seo ai → mkt/seo-ai.md (if organic channel)
Phase 7: /attribution → mkt/attribution.md
```

### Template 3: Technical Build
**Trigger phrases:** "build the app", "implement", "code it", "ship it"
**Skills (7 steps):**
```
Phase 1: /discover (interactive conversation — optionally saves spec.md)
Phase 2: /system-architecture → system-architecture.md
Phase 3: /task-breakdown → tasks.md
Phase 4: (execution — build the tasks)
Phase 5: /code-cleanup + /technical-writer (parallel)
Phase 6: /ship → ship-report.md
Phase 7: /deploy-verify → deploy-verify-report.md
```

### Template 3b: Rigorous Technical Build
**Trigger phrases:** "build carefully", "high-quality build", "production-ready", "rigorous"
**Skills (9 steps):**
```
Phase 1: /discover (interactive — surface assumptions, align on approach)
Phase 2: /system-architecture → system-architecture.md
Phase 3: /review-chain → verify architecture
Phase 4: /task-breakdown → tasks.md
Phase 5: (execution — build the tasks, /review-chain after each critical task)
Phase 6: /code-cleanup + /technical-writer (parallel)
Phase 7: /review-chain → final verification
Phase 8: /ship → ship-report.md
Phase 9: /deploy-verify → deploy-verify-report.md
```

### Template 3c: Architecture Decision
**Trigger phrases:** "debate the tech stack", "which approach", "compare options", "agents debate"
**Skills (3 steps):**
```
Phase 1: /discover scope → scope the decision
Phase 2: /agent-room debate → meta/agent-room-report.md
Phase 3: /system-architecture → system-architecture.md (informed by debate)
```

### Template 4: Strategy Sprint
**Trigger phrases:** "strategy", "what should we build", "prioritize", "diagnose"
**Skills (5 steps):**
```
Phase 1: /icp-research → product-context.md
Phase 2: /market-research + /problem-analysis (parallel)
Phase 3: /solution-design → solution-design.md
Phase 4: /funnel-planner → targets.md
Phase 5: /experiment → experiment-*.md
```

### Template 5: Landing Page
**Trigger phrases:** "landing page", "conversion page", "sales page"
**Skills (5 steps):**
```
Phase 1: /icp-research → product-context.md
Phase 2: /brand-system → design/brand-system.md
Phase 3: /copywriting → mkt/content/*.copy.md
Phase 4: /lp-optimization → mkt/lp-optimization.md
Phase 5: /humanize → mkt/content/*.humanized.md
```

---

## Parallel Track Mappings

Skills that can run simultaneously (no shared dependencies):

| Parallel Pair | Why Parallel | Common Phase |
|--------------|-------------|-------------|
| `market-research` + `problem-analysis` | Both consume `product-context.md` independently, both feed `solution-design` | Research |
| `brand-system` + `imc-plan` | Both consume `product-context.md` + `icp-research.md`, no dependency on each other | Planning |
| `brand-system` + `funnel-planner` | Both consume `solution-design.md`, no dependency on each other | Planning |
| `lp-optimization` + `seo` | Both audit the same assets from different angles (conversion vs. search) | Optimization |
| `code-cleanup` + `technical-writer` | Both are standalone horizontal skills, no shared artifacts | Quality |
| `icp-research` + `market-research` | Both are entry-point research skills with no shared dependencies | Foundation |

These mappings are encoded in each skill's `routing.parallel-with` frontmatter field and should be used by navigate when constructing workflow phases.

---

## Skill Inventory by Stack

### Research (6 skills)
| Skill | Position | Complexity | Interactive | Produces |
|-------|----------|------------|-------------|----------|
| icp-research | foundation | heavy | no | product-context.md, mkt/icp-research.md |
| market-research | pipeline | heavy | no | market-research.md |
| problem-analysis | pipeline | heavy | no | problem-analysis.md |
| solution-design | pipeline | heavy | no | solution-design.md |
| funnel-planner | pipeline | medium | no | targets.md |
| experiment | pipeline | medium | no | experiment-[name].md |

### Marketing (8 skills)
| Skill | Position | Complexity | Interactive | Produces |
|-------|----------|------------|-------------|----------|
| brand-system | pipeline | heavy | no | design/brand-system.md |
| imc-plan | pipeline | heavy | no | mkt/imc-plan.md |
| content-create | pipeline | heavy | no | mkt/content/[slug].md |
| copywriting | horizontal | heavy | no | mkt/content/[slug].copy.md |
| lp-optimization | horizontal | medium | no | mkt/lp-optimization.md |
| seo | horizontal | heavy | no | mkt/seo-[mode].md |
| attribution | pipeline | medium | no | mkt/attribution.md |
| humanize | horizontal | medium | no | mkt/content/[slug].humanized.md |

### Product (6 skills)
| Skill | Position | Complexity | Interactive | Produces |
|-------|----------|------------|-------------|----------|
| user-flow | pipeline | medium | no | design/user-flow.md |
| system-architecture | pipeline | heavy | no | system-architecture.md |
| code-cleanup | horizontal | heavy | no | cleanup-report.md |
| technical-writer | horizontal | medium | no | (writes to project) |
| ship | pipeline | medium | no | ship-report.md |
| deploy-verify | pipeline | light | no | deploy-verify-report.md |

### Meta (5 skills)
| Skill | Position | Complexity | Interactive | Produces |
|-------|----------|------------|-------------|----------|
| discover | horizontal | medium | **yes** | spec.md (optional) |
| agent-room | horizontal | heavy | no | meta/agent-room-report.md |
| task-breakdown | pipeline | medium | no | tasks.md |
| review-chain | horizontal | medium | no | meta/review-chain-report.md |
| navigate | utility | medium | no | workflow-plan.md |

Meta-skills are domain-agnostic process wrappers — they compose with any skill in any stack.

---

## Dependency Graph (Canonical)

Artifacts are optional save-points, not mandatory gates. Conversation context from the current session is equally valid as a file on disk.

```
product-context.md ← /icp-research
├→ market-research.md ← /market-research ─┐
├→ problem-analysis.md ← /problem-analysis ┤
│                                           ├→ solution-design.md ← /solution-design
│                                           │   ├→ targets.md ← /funnel-planner → experiment-*.md
│                                           │   ├→ mkt/imc-plan.md ← /imc-plan → mkt/content/ → mkt/*.humanized.md
│                                           │   └→ system-architecture.md ← /system-architecture
│                                           │       └→ tasks.md ← /task-breakdown
│                                           │           └→ (execute) → review-chain → /ship → /deploy-verify
├→ /discover (conversation context or spec.md) ──→┘
├→ design/brand-system.md ← /brand-system
└→ design/user-flow.md ← /user-flow ──→ system-architecture.md, tasks.md
```

Horizontal skills (copywriting, lp-optimization, seo, humanize, attribution, code-cleanup, technical-writer, agent-room, review-chain) can be called at any point — they read upstream artifacts but don't block downstream skills.

> **Note:** agent-room and review-chain are domain-agnostic process wrappers that compose with any skill in any stack.
