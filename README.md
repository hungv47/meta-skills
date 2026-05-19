# Agent Skills

![Agent Skills](./assets/banners/forsvn-skills.png)

> **Agent Skills 2.0 — single-plugin consolidation.** The four previously-separate plugins (`research-skills`, `marketing-skills`, `product-skills`, `meta-skills`) collapse into **one** `meta-skills` install carrying all 35 skills. The umbrella `agent-skills` repo and the three sibling repos are archived.
>
> **Install:** `/plugin marketplace add hungv47/meta-skills` (Claude Code) or `npx skills add hungv47/meta-skills` (other editors).

A composable skill stack for [AI agents](https://agentskills.io/home) that chains together — from problem diagnosis to shipped code. 35 skills across meta (process), research, marketing, and product domains.

Skills pass context through conversation and artifacts in `.agents/skill-artifacts/`, with measurable initiatives isolated in `skills-resources/loops/[slug]/`. Cross-session knowledge accumulates at `skills-resources/experience/`. Downstream skills read conversation context or artifacts automatically, so output compounds as you move through the stack.

## Install

Single plugin, all 35 skills. Works with Claude Code's plugin system, or the editor-agnostic [`skills` CLI](https://skills.sh) (Cursor, Codex, Windsurf, Gemini CLI, VS Code).

### Via Claude Code plugin marketplace

```
/plugin marketplace add hungv47/meta-skills
/plugin install meta-skills
```

### Via `skills` CLI (recommended for non-Claude editors)

```bash
npx skills add hungv47/meta-skills
```

Requires Node.js 18+.

### Install a single skill

Cherry-pick any of the 35 skills with `--skill`:

```bash
npx skills add hungv47/meta-skills --skill copywriting
npx skills add hungv47/meta-skills --skill icp-research
npx skills add hungv47/meta-skills --skill system-architecture
npx skills add hungv47/meta-skills --skill fresh-eyes
```

Single-skill installs are self-contained — shared scripts and references the skill needs are packaged with it, so `--skill <name>` doesn't depend on sibling skills being installed.

Cherry-pick multiple skills in a single call:

```bash
npx skills add hungv47/meta-skills --skill copywriting humanize fresh-eyes
```

List what's available without installing:

```bash
npx skills add hungv47/meta-skills --list
```

### Target a specific editor

```bash
npx skills add hungv47/meta-skills --agent claude-code
npx skills add hungv47/meta-skills --agent claude-code cursor
```

### Install globally

Make all 35 skills available in every project on your machine:

```bash
npx skills add hungv47/meta-skills -g
```

### Other operations

```bash
npx skills list                          # list installed skills
npx skills update                        # update to latest versions
npx skills remove                        # interactive remove by skill name
npx skills find copywriting              # search the skills registry
```

Run `npx skills --help` for the full command reference.

### Migrating from pre-2.0 (4-plugin) install

If you previously installed any of `research-skills`, `marketing-skills`, `product-skills`, or the standalone `meta-skills` plugin, remove them and reinstall the consolidated plugin — every skill is preserved:

```bash
npx skills remove research-skills marketing-skills product-skills meta-skills
npx skills add hungv47/meta-skills
```

Or for Claude Code plugin marketplace users:

```
/plugin marketplace remove agent-skills
/plugin marketplace add hungv47/meta-skills
/plugin install meta-skills
```

The 4 source repos (`research-skills`, `marketing-skills`, `product-skills`, `agent-skills` umbrella) are archived on GitHub.

## Getting Started

### Fastest path

```bash
npx skills add hungv47/meta-skills -g    # install all 35 skills globally
```

If you're not sure where to start, run `/orchestrate-meta` — it reads cross-stack project state and routes you to a stack-orchestrator (`/orchestrate-research`, `/orchestrate-marketing`, `/orchestrate-product`) or to a process skill (`/discover`, `/agents-panel`, `/task-breakdown`, `/fresh-eyes`).

### Stack orchestrators (don't know which skill to invoke?)

Each stack ships with a `/orchestrate-<stack>` orchestrator that reads what's already in `.agents/skill-artifacts/`, `research/`, and `brand/`, parses your free-form ask, and proposes the next 1–3 skills with rationale + cost + duration. Use these as the entry point when you're new to the stack or returning mid-project:

```
/orchestrate-research      # who's the audience? market landscape? prioritization? targets?
/orchestrate-marketing     # brand foundation? campaign? copy? LP? SEO? video? outreach?
/orchestrate-product       # user flow? architecture? code cleanup? machine cleanup? docs?
/orchestrate-meta          # cross-stack — routes to the right /orchestrate-* or process skill
```

Each orchestrator never auto-invokes — it always prints the recommended `/skill-name` for you to type, after showing you the rationale. Re-running `/orchestrate-*` after a skill completes resumes the workflow.

### How invocation works

Every installed skill becomes a slash command in your editor:

```
/icp-research "B2B project management SaaS for agencies"
/system-architecture "team dashboard with real-time status"
/discover "vague idea I want to flesh out"
/fresh-eyes
```

You don't have to remember names. Type a plain-English request and your agent reads the available skills and proposes the right one. Saying *"help me figure out who we're building for"* surfaces `/icp-research`. Saying *"this codebase has accumulated cruft"* surfaces `/code-cleanup`.

### Pre-Dispatch: skills ask once, remember forever

Most skills bundle 3–7 context questions in a single message before dispatching their sub-agents. Answer all the questions in one reply — the skill is gathering enough context to run multiple agents in parallel.

Answers persist to `skills-resources/experience/{domain}.md` (product, audience, brand, business, goals, technical). The next skill in the same project reads from this file and skips re-asking. First skill in a project costs 1–2 minutes of setup; everything downstream skips straight to work.

### Where outputs land

Most skills write to `.agents/skill-artifacts/`. Three folders are top-level because they're canonical records the team owns long-term:

- `research/` — audience and market records (`product-context.md`, `icp-research.md`, `market-research.md`)
- `brand/` — brand identity of record (`BRAND.md`, `DESIGN.md`, `ASSETS.md`)
- `architecture/` — system blueprint of record (`system-architecture.md`, schemas, ADRs)

Everything else lives under `.agents/skill-artifacts/` with domain subfolders. Measurable work goes into a loop: `skills-resources/loops/[slug]/` co-locates strategy, execution, evals, `results.tsv`, and promoted learnings for one initiative. One-shot audits, briefs, specs, decisions, and reports live under `.agents/skill-artifacts/mkt/`, `.agents/skill-artifacts/product/`, `.agents/skill-artifacts/research/`, or `.agents/skill-artifacts/meta/`. Durable Q&A context lives separately in `skills-resources/experience/`.

## Full Pipeline

End-to-end pipeline: meta process wrappers compose with research pipeline skills, product skills (pipeline + horizontal), and marketing skills (pipeline + horizontal).

**35 skills total**: 8 research + 14 marketing + 6 product + 7 meta. Each stack includes a `/orchestrate-<stack>` orchestrator that reads project state and routes to the right skill. Research and product pipelines run in sequence; marketing has a pipeline plus horizontal skills (copywriting, humanize, vn-tone) that apply at any stage. Meta skills are domain-agnostic process wrappers that compose with any skill. Measurable initiatives can be wrapped in `/eval-loop`, the single scaffold/ledger entrypoint for autoresearch-style keep/discard cycles. Surface-specific eval skills still do the scoring. Short-form video pipeline: `short-form-research` (research-skills) → `short-form-brief` + `social-copy` (marketing-skills) → `short-form-eval` (research-skills, closes the loop). Landing-page loop: `eval-loop` (meta-skills) → `lp-eval` (marketing-skills) for post-launch scoring.

## Skill Stacks

### Research — understand your market and decide what to do

![Research Skills](./assets/banners/research-skills.png)

> 8 skills in [`skills/research/`](./skills/research/) (incl. `/orchestrate-research`)

```
icp-research → market-research + diagnose → prioritize → funnel-planner
short-form-research → .agents/skill-artifacts/research/short-form-research/[slug].md (consumed by short-form-brief)
```

| Skill | What it does | Use when... |
|-------|-------------|-------------|
| `icp-research` | Builds ideal customer profiles — demographics, pain points, jobs-to-be-done, segmentation | You're entering a new market, launching a product, or need to understand who you're building for |
| `market-research` | Maps competitive landscape, TAM/SAM/SOM sizing, whitespace opportunities | You need to size an opportunity, understand competitors, or find market gaps |
| `diagnose` | Structured diagnosis — logic trees, hypotheses, root cause analysis | A metric dropped, something broke, or you need to figure out *why* before jumping to solutions |
| `prioritize` | Generates strategic options, scores trade-offs with ICE, recommends a path | The problem is clear and you need to decide *what* to build or pursue |
| `funnel-planner` | Backward funnel modeling — revenue goals to traffic, conversions, unit economics | You need numeric targets: "how much traffic do we need to hit $X ARR?" |
| `short-form-research` | Per-platform best-practice catalog — pulls hook archetypes, format constraints, algorithm signals, anti-patterns into `.agents/skill-artifacts/research/short-form-research/[slug].md` (consumed by short-form-brief) | You're starting a video pipeline and need fresh research grounding hooks/formats/signals across tiktok/reels/shorts/x/linkedin |
| `short-form-eval` | Closes the feedback loop — scores published short-form posts against the original brief, logs patterns, flags platform-signal staleness | You've published a video and want to know what the brief got right vs. what surprised you |

### Marketing — create, optimize, and measure marketing

![Marketing Skills](./assets/banners/marketing-skills.png)

> 14 skills in [`skills/marketing/`](./skills/marketing/) (incl. `/orchestrate-marketing`)

```
brand-system
  ↓
campaign-plan
  ↓
  ├─ lp-brief (per page; owns conversion best practices) → design-brief (per asset slot)
  ├─ eval-loop → lp-eval (post-launch page evidence)
  ├─ seo (per mode)
  ├─ ad-copy (per audience temperature)
  └─ cold-outreach (per touch)

Horizontal: copywriting, humanize, vn-tone — invoked at any stage.
```

| Skill | What it does | Use when... |
|-------|-------------|-------------|
| `brand-system` | Brand identity — color palettes, typography, design tokens, voice, visual language | You need a visual identity system before creating any marketing materials |
| `campaign-plan` | Channel strategy, positioning, content calendar, budget allocation, GTM timelines | You're planning a campaign or go-to-market and need to decide where, when, and how much |
| `copywriting` | Headlines, hooks, CTAs, taglines, full-page section copy with scoring | You need persuasive copy for any surface — landing pages, ads, emails, product UI |
| `lp-brief` | Campaign-grade landing-page brief — hypothesis, architecture, per-section spec, conversion gate, asset slots, hand-off prompts | You're creating or revising a landing page and need a brief precise enough for a designer or AI tool to execute |
| `lp-eval` | Post-launch landing-page evaluation — metric ingest, diagnosis, keep/discard/watch/blocked row, learning promotion | A launched landing page has analytics, experiment results, or metric notes and needs a loop-local decision |
| `design-brief` | Per-asset graphic-design brief with platform-aware specs (aspect, safe zones, type scale, contrast, file format) and downstream handoff (image-gen prompt / vector-tool spec / designer-handoff) | You need a brief for a single visual asset (IG carousel, OG image, banner ad, YT thumbnail, OOH, etc.) — rendering happens downstream |
| `seo` | Technical audit, AI/AEO optimization, programmatic SEO, ASO | You want more organic traffic — search, AI answers, or app store visibility |
| `humanize` | Strips AI patterns, injects brand voice, compresses for density | You have AI-generated text that sounds robotic and needs to read human |
| `vn-tone` | Polishes translated Vietnamese into a native register (báo chí, semi-casual, bro, or pop-marketing) | You have Vietnamese copy that reads translated/robotic or needs register alignment |
| `ad-copy` | Meta paid-ad copy for retargeting or cold traffic — hero + 2 variants with char-cap, policy, claim, voice, and critic gates | You're shipping Facebook/Instagram ads and need audience-temperature-specific creative copy |
| `cold-outreach` | Cold email / DM / proposal composition with signal-based personalization, channel-specific craft, rubric scoring, terminal humanize pass | You're writing first-touch outbound or replies to inbound responses and want it to read like a sharp human, not a template |
| `short-form-brief` | Per-asset short-form video brief — hook, shot list, on-screen text, audio plan, caption, CTA, aspect, length. Hard cap: 1 hero + 2 platform variants per invocation. Brand modes: founder / company. Polish chain auto-routes per (market, brand_mode) | You're producing a TikTok / Reels / Shorts / X / LinkedIn video and need a production-ready brief tied to platform-intelligence + ICP voice |
| `social-copy` | Platform-native social copy — A/B hook variants, body, CTA. Char-limit + CTA-truncation enforced; 5-dim critic rubric (hook strength / char-word limit / CTA placement / pattern-interrupt density / format compliance) | You need ready-to-publish copy for tiktok / reels / shorts / x / linkedin from a brief or topic |

### Product — design and build software

![Product Skills](./assets/banners/product-skills.png)

> 6 skills in [`skills/product/`](./skills/product/) (incl. `/orchestrate-product`)

| Skill | What it does | Use when... |
|-------|-------------|-------------|
| `user-flow` | Maps screens, decisions, transitions, edge cases, and error states | You're designing a feature and need to think through every screen and path |
| `system-architecture` | Technical blueprints — tech stack, database schema, API design, file structure, deployment, security review (STRIDE + OWASP + LLM security), dependency classification | You know what to build and need to decide *how* — the technical design |
| `code-cleanup` | Structural audit, AI slop removal (code-level + frontend/visual), dead code, unused assets, refactoring | Your codebase has accumulated cruft and needs a quality pass |
| `machine-cleanup` | Audits and cleans your dev machine — dotfolders, caches, language toolchains, package-manager globals — with risk surfacing (auth, processes, shell-rc) and per-target confirmation | Your machine has accumulated years of toolchains, caches, and SDKs and you want to reclaim disk safely |
| `docs-writing` | READMEs, API references, setup guides, runbooks from existing code. Ship log mode writes product context to `research/product-context.md`. Sync mode for post-change doc updates | You have a codebase and need documentation generated or updated after changes |

### Meta — discover, debate, decompose, verify

![Meta Skills](./assets/banners/meta-skills.png)

> 7 skills in [`skills/meta/`](./skills/meta/) (incl. `/orchestrate-meta`)

| Skill | What it does | Use when... |
|-------|-------------|-------------|
| `discover` | Conversational discovery — adapts from quick scoping (3-5 questions) to deep interviews | You have a vague idea or clear task and want alignment before building |
| `agents-panel` | Multi-agent discussion rooms — debate (argue in rounds) or consensus polling | You're facing a complex decision and want multiple perspectives |
| `eval-loop` | Creates or resumes a measurable improvement workspace with `program.md`, `context.md`, `strategy/`, `execution/`, `evals/`, `results.tsv`, and `learnings.md` | You want a campaign, page, ad set, email sequence, social series, or content motion to improve over measured cycles |
| `task-breakdown` | Decomposes work into granular, testable tasks with acceptance criteria | Work is too big to just start — needs decomposition first |
| `fresh-eyes` | Fresh-eyes review — implement, review, resolve. Max 2 rounds | You've built something and want an independent quality check |
| `cleanup-artifacts` | Audits + grooms `.agents/skill-artifacts/` — classifies KEEP/STALE/ORPHAN/LEGACY/EPHEMERAL, archives behind explicit per-category confirmation. Never deletes | `.agents/skill-artifacts/` has gone junk-drawer or you're prepping for a release |

Meta-skills are domain-agnostic process wrappers. They compose with any skill in any stack.

## When to Use What

Not sure which skill to run? Find your situation:

| Situation | Run this |
|-----------|----------|
| "Who are we building for?" | `/icp-research` |
| "How big is this market?" | `/market-research` |
| "Why did this metric drop?" | `/diagnose` |
| "What should we build?" | `/prioritize` |
| "How much traffic do we need?" | `/funnel-planner` |
| "We need a brand identity" | `/brand-system` |
| "Plan the launch campaign" | `/campaign-plan` |
| "Write better headlines / CTAs / taglines" | `/copywriting` |
| "Our landing page isn't converting and we have analytics" | `/lp-eval` |
| "Brief a landing page or redesign" | `/lp-brief` |
| "Brief a single graphic-design asset (carousel / OG / thumbnail / banner)" | `/design-brief` |
| "We need more organic traffic" | `/seo` |
| "Write Meta ad copy for retargeting or cold traffic" | `/ad-copy` |
| "Write a cold email / DM / proposal" | `/cold-outreach` |
| "This reads like AI wrote it" | `/humanize` |
| "Polish Vietnamese that sounds translated" | `/vn-tone` |
| "Create an autoresearch-style loop for this campaign/page/content series" | `/eval-loop` |
| "Where should strategy, execution, evals, and learnings live for this measurable initiative?" | `/eval-loop` |
| "Map the screens for this feature" | `/user-flow` |
| "Design the technical system" | `/system-architecture` |
| "This codebase needs cleanup" | `/code-cleanup` |
| "Generate docs from the code" | `/docs-writing` |
| "Write a product snapshot for agents" | `/docs-writing --ship-log` |
| "Update docs after this change" | `/docs-writing --sync` |
| "Scope this before building" | `/discover` |
| "Help me think through this idea" | `/discover` |
| "Break this into tasks" | `/task-breakdown` |
| "Debate this decision" | `/agents-panel` |
| "Verify this output" | `/fresh-eyes` |

## Worked Examples: Artifact Flow in Practice

Real workflows are 3-6 skills, not 16. Each example below is a chain users actually run end-to-end in one session.

### Example 1: Research → Marketing Pipeline

```
/icp-research "B2B project management SaaS for agencies"
  └─ writes research/product-context.md (personas, pain points, JTBD)
  └─ writes research/icp-research.md (full audience analysis)

/campaign-plan "Q3 launch campaign"
  ├─ reads research/product-context.md (audience)
  ├─ reads research/icp-research.md (personas)
  └─ writes .agents/skill-artifacts/mkt/campaign-plan.md (channels, calendar, budget)

/lp-brief "Q3 launch landing page"
  ├─ reads research/product-context.md (voice, audience language)
  ├─ reads brand/BRAND.md + brand/DESIGN.md (visual language, lexicon)
  ├─ reads .agents/skill-artifacts/mkt/campaign-plan.md (campaign hypothesis, conversion targets)
  └─ writes .agents/skill-artifacts/mkt/lp-brief/q3-launch/brief.md + asset-slots/*.prompt.md

/design-brief "hero image for q3-launch (slot: hero-image)"
  ├─ reads brand/DESIGN.md (palette, typography, sacred elements)
  ├─ reads .agents/skill-artifacts/mkt/lp-brief/q3-launch/asset-slots/hero-image.md (slot spec)
  └─ writes .agents/skill-artifacts/mkt/design-briefs/q3-launch-hero.md (concept + platform spec + image-gen prompt)
```

Each downstream skill produces richer output because it inherits upstream context. The design-brief output references audience pain points from icp-research, messaging pillars from campaign-plan, and the conversion hypothesis from lp-brief — without the user repeating any of it.

### Example 2: Product Pipeline

```
/discover "build a team dashboard with real-time project status"
  └─ conversation produces key decisions (scope, tech choices, edge cases)
  └─ optionally writes .agents/skill-artifacts/meta/specs/<slug>.md (if user asks to save; includes FAILURE conditions)

/user-flow "team dashboard"
  ├─ reads .agents/skill-artifacts/meta/specs/<slug>.md (if saved) or conversation context
  └─ writes .agents/skill-artifacts/product/flow/team-dashboard.md (screens, transitions, platform-surface matrix, edge states)

/system-architecture "team dashboard"
  ├─ reads .agents/skill-artifacts/meta/specs/<slug>.md (requirements)
  ├─ reads .agents/skill-artifacts/product/flow/*.md (every flow file; screens and surface matrix inform API design)
  └─ writes architecture/system-architecture.md (stack, schema, API, deployment)

/task-breakdown
  ├─ reads architecture/system-architecture.md (what to build)
  ├─ reads .agents/skill-artifacts/product/flow/*.md (UX requirements per task across every flow)
  └─ writes .agents/skill-artifacts/meta/tasks.md (ordered tasks with acceptance criteria)

(build tasks) → /fresh-eyes
```

### Example 3: Multi-Perspective Decision

```
/agents-panel "debate: should we build a Chrome extension or a web app?"
  ├─ spawns 3 agents (Architect, Pragmatist, Critic)
  ├─ 3 rounds of structured debate
  └─ writes .agents/skill-artifacts/meta/decisions/[date]-<slug>.md (consensus, splits, recommendation)
```

### Example 4: Diagnose a Declining Metric

```
/diagnose "checkout conversion dropped 30% over the last 6 weeks"
  ├─ reads research/product-context.md (audience baseline)
  ├─ Layer 1 parallel: tree-builder + external-check
  ├─ Layer 2 sequential: hypothesis → data-mapper → verdict → critic
  └─ writes .agents/skill-artifacts/meta/records/diagnose-*.md (root cause + evidence + ranked hypotheses)

/prioritize "checkout fixes from diagnose output"
  ├─ reads .agents/skill-artifacts/meta/records/diagnose-*.md (which causes to address)
  ├─ reads research/product-context.md (audience constraints)
  └─ writes .agents/skill-artifacts/meta/sketches/prioritize-*.md (ICE-scored fix list with cut line)

/funnel-planner "set checkout recovery targets"
  ├─ reads .agents/skill-artifacts/meta/sketches/prioritize-*.md (initiatives → metrics)
  └─ writes .agents/skill-artifacts/meta/records/targets-*.md (numeric targets for traffic, CR, revenue)
```

### Example 5: Brief and Revise a Landing Page

```
/lp-brief "/pricing redesign"
  ├─ reads brand/BRAND.md + brand/DESIGN.md (visual + voice)
  ├─ reads research/product-context.md + research/icp-research.md (audience pain language)
  ├─ uses page state / analytics notes if provided
  └─ writes .agents/skill-artifacts/mkt/lp-brief/pricing/brief.md + asset-slots/*.prompt.md

/design-brief "hero illustration for pricing (slot: hero-image)"
  ├─ reads brand/DESIGN.md + .agents/skill-artifacts/mkt/lp-brief/pricing/asset-slots/hero-image.md
  └─ writes .agents/skill-artifacts/mkt/design-briefs/pricing-hero.md (concept + image-gen prompt)

/copywriting "rate the hero copy candidates from the brief"
  ├─ reads .agents/skill-artifacts/mkt/lp-brief/pricing/brief.md (copy candidates inline)
  └─ writes .agents/skill-artifacts/mkt/content/pricing-hero.copy.md (alternatives + rationale)
```

### Example 6: Write a Cold Outbound Sequence

```
/icp-research "founders of seed-stage B2B AI startups"
  └─ writes research/product-context.md + research/icp-research.md (audience, signals, voice)

/cold-outreach "first-touch email to founders of seed AI startups, channel: email"
  ├─ reads research/product-context.md + research/icp-research.md (audience signals)
  ├─ Layer 1: signal-analyst → strategist + proof-selector in parallel
  ├─ Layer 2: composer → voice-auditor → critic → terminal humanize
  └─ writes .agents/skill-artifacts/mkt/cold-outreach/founder-touch1.md + .rationale.md + .critic-score.md

/cold-outreach "reply to: <prospect's response asking about pricing>"
  ├─ reads .agents/skill-artifacts/mkt/cold-outreach/founder-touch1.md (prior touch context)
  └─ writes .agents/skill-artifacts/mkt/cold-outreach/founder-reply1.md (reply + rationale + score)
```

## Tips for Effective Use

**Start with `/discover` for vague work.** "Build something cool" gets nowhere. `/discover` interviews you in 3–8 questions and produces a concrete spec other skills can run on.

**Run `/icp-research` before any marketing work.** It writes `research/product-context.md` — the foundation artifact 13+ downstream skills consume. Skip it and every downstream skill re-asks you for audience details.

**Chain skills, don't one-shot.** A 5-skill chain (icp-research → diagnose → prioritize → campaign-plan → copywriting) produces sharper output than running copywriting alone, because each downstream skill inherits real upstream context. The Worked Examples above show real chains.

**Run `/fresh-eyes` before shipping.** Security-sensitive code and data-mutation work auto-trigger it. Run it manually on marketing copy, briefs, and architecture docs — it catches what you can't see after staring at a draft.

**Let artifacts compound.** `.agents/skill-artifacts/` and the canonical folders (`research/`, `brand/`, `architecture/`) accumulate across sessions. After a month you have prioritize history, target docs, every copy variant, every design brief — all version-stamped, all referenceable. Don't delete them.

**Edit artifact frontmatter when reality changes.** If `research/product-context.md` says you serve agencies but you've pivoted to enterprise, edit the file directly. Skills read whatever's there now — they don't lock to the original session.

**Answer Pre-Dispatch questions in one reply.** When a skill asks 5 questions in one message, answer all 5 in one response. The skill is bundling so it can dispatch parallel sub-agents — answering one at a time forces it to re-prompt and slows everything down.

**Use horizontal skills late, not early.** `humanize`, `vn-tone`, `copywriting` apply to outputs from any pipeline skill. Run them as a polish pass after the pipeline produces a draft, not as a starting point.

**Override skill recommendations when you have context.** Skills auto-detect the right path (e.g., `design-brief` auto-routes to image-gen vs. vector-tool). If you know better, override with flags or correct in the conversation.

**Install `meta-skills` globally.** They're domain-agnostic. `/discover`, `/eval-loop`, `/agents-panel`, `/task-breakdown`, `/fresh-eyes` are useful in every project on your machine — `npx skills add hungv47/meta-skills -g` is the install most people regret skipping.

## How Skills Communicate

Skills pass data through markdown files in `.agents/skill-artifacts/`, canonical folders, and measurable loop folders:

| Artifact | Produced by | Consumed by |
|----------|------------|-------------|
| `product-context.md` | `icp-research`, `docs-writing --ship-log` | 13+ skills across all stacks |
| `market-research.md` | `market-research` | `prioritize` |
| `.agents/skill-artifacts/meta/records/diagnose-*.md` | `diagnose` | `prioritize` |
| `.agents/skill-artifacts/meta/sketches/prioritize-*.md` | `prioritize` | `campaign-plan`, `system-architecture`, `funnel-planner` |
| `.agents/skill-artifacts/meta/records/targets-*.md` | `funnel-planner` | — (terminal until measurement skill exists) |
| `brand/BRAND.md`, `brand/DESIGN.md`, `brand/ASSETS.md` | `brand-system` | Visual decisions in `lp-brief`, `design-brief`, `humanize`, `copywriting` |
| `.agents/skill-artifacts/mkt/campaign-plan.md` | `campaign-plan` | `lp-brief`, `seo`, `cold-outreach`, `copywriting` |
| `.agents/skill-artifacts/mkt/content/[slug].copy.md` | `copywriting` | `humanize`, `vn-tone`, `design-brief` (copy-anchor) |
| `.agents/skill-artifacts/mkt/content/[slug].humanized.md` | `humanize` | `vn-tone` |
| `.agents/skill-artifacts/mkt/content/[slug].vn-tone.md` | `vn-tone` | — (terminal) |
| `.agents/skill-artifacts/mkt/seo-[mode].md` | `seo` | `copywriting`, `lp-brief` |
| `.agents/skill-artifacts/mkt/lp-brief/[slug]/brief.md` + `asset-slots/*.prompt.md` | `lp-brief` | `design-brief` (per slot) + external designer / image-gen |
| `skills-resources/loops/[slug]/evals/[date]-cycle-N.md` | `lp-eval` | `results.tsv`, `learnings.md`, next-cycle `lp-brief` |
| `.agents/skill-artifacts/mkt/design-briefs/[slug].md` | `design-brief` | External image-gen / vector-tool / human designer |
| `.agents/skill-artifacts/mkt/cold-outreach/[slug].md` | `cold-outreach` | — (terminal) |
| `.agents/skill-artifacts/product/flow/<flow-name>.md` + `.agents/skill-artifacts/product/flow/index.md` | `user-flow` | `system-architecture`, `task-breakdown` |
| `.agents/skill-artifacts/meta/specs/<slug>.md` | `discover` (optional) | `system-architecture`, `task-breakdown` |
| `skills-resources/loops/[slug]/program.md` + `context.md` | `eval-loop` | Strategy, execution, and evaluation skills for that measurable initiative |
| `skills-resources/loops/[slug]/strategy/*.md` | Strategy skills (`campaign-plan`, `lp-brief`, etc.) | Execution and evaluation skills in the same loop |
| `skills-resources/loops/[slug]/execution/*.md` | Execution skills | Evaluation skills and future strategy cycles |
| `skills-resources/loops/[slug]/evals/*.md` + `results.tsv` | Evaluation skills | Future strategy/execution cycles; `learnings.md` promotion |
| `system-architecture.md` | `system-architecture` | `task-breakdown` |
| `.agents/skill-artifacts/meta/tasks.md` | `task-breakdown` | Task execution |
| `.agents/skill-artifacts/meta/records/cleanup-*.md` | `code-cleanup` | — (terminal) |
| `.agents/skill-artifacts/meta/decisions/[date]-<slug>.md` | `agents-panel` | — (lifecycle: decision — dated, immutable) |
| `.agents/skill-artifacts/meta/records/[date]-fresh-eyes-<slug>.md` | `fresh-eyes` | — (lifecycle: snapshot — dated, immutable) |

Every markdown artifact includes frontmatter with `skill`, `version`, `date`, and `status` fields for traceability. `scripts/manifest-sync.ts` indexes `.agents/skill-artifacts/`, `skills-resources/loops/`, `research/`, `brand/`, and `architecture/`.

## Architecture

Most skills use a **two-layer multi-agent orchestration** pattern:

```
SKILL.md (Orchestrator)
  ├─ Layer 1: Parallel specialists ──── run concurrently
  ├─ Merge Step ──────────────────────── assemble outputs
  ├─ Layer 2: Sequential refiners ───── run in order
  └─ Critic Agent ────────────────────── PASS / FAIL (max 2 cycles)
```

**~150 specialized agents** across domain skills. Meta-skills use additional patterns: **dynamic agent spawning** (`agents-panel`, `fresh-eyes`) and **conversation-first discovery** (`discover`).

## Releases

Update an existing install:

```bash
npx skills update                                  # via skills CLI
# or
/plugin marketplace update meta-skills && /plugin update meta-skills    # via Claude Code
```

Fresh install (full stack):

```bash
npx skills add hungv47/meta-skills
# or
/plugin marketplace add hungv47/meta-skills && /plugin install meta-skills
```

Cherry-pick a single skill:

```bash
npx skills add hungv47/meta-skills --skill copywriting
```

Release notes: [`CHANGELOG.md`](./CHANGELOG.md). All 35 skills release in lockstep under one version number, with `[meta]` / `[research]` / `[marketing]` / `[product]` prefixes on stack-scoped entries.

Pre-2.0 history lives in the archived repos: [research-skills](https://github.com/hungv47/research-skills/blob/main/CHANGELOG.md), [marketing-skills](https://github.com/hungv47/marketing-skills/blob/main/CHANGELOG.md), [product-skills](https://github.com/hungv47/product-skills/blob/main/CHANGELOG.md), [meta-skills v1.x](https://github.com/hungv47/meta-skills/commits/main).

## Changelog

- [meta-skills/CHANGELOG.md](./CHANGELOG.md) — consolidated changelog from v2.0 onward
- [GitHub releases](https://github.com/hungv47/meta-skills/releases) — full release history

## License

MIT
