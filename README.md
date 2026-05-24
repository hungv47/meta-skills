# Agent Skills

![Agent Skills](./assets/banners/forsvn-skills.png)

**43 composable skills that turn an AI coding agent into a product team — research, marketing, product, and meta-process, all from one install.**

Call any skill by verb (`/research-icp`, `/write-copy`, `/architect-system`, `/review-work`) or let the front door route for you (`/forsvn`). Skills chain — each one reads what earlier skills left behind, so output compounds the more you use the stack.

![The Agent Skills stack — four skill domains feed a central .forsvn artifact store, which feeds manifest, loops, and review](./assets/banners/forsvn-skills-systemmap.svg)

## What to expect

- **43 skills, 4 domains.** Research (8) · Marketing (21) · Product (7) · Meta (7).
- **One install, every editor.** Claude Code plugin or `npx skills add` for Cursor, Codex, Windsurf, Gemini CLI, VS Code.
- **A single front door.** `/forsvn` reads your project state, asks ≤2 questions if needed, and routes you to the right skill (or resumes a prior initiative).
- **Context compounds.** Skills write artifacts to `.forsvn/`, `research/`, `brand/`, `architecture/`. Every downstream skill reads them automatically — no copy-paste, no re-asking.
- **Quality gates built in.** Most skills run multi-agent orchestration behind a critic gate. `/review-work` adds a fresh-eyes pass before you ship.

## Install

**Claude Code:**

```
/plugin marketplace add hungv47/meta-skills
/plugin install forsvn-skills
```

**Other editors** (Cursor, Codex, Windsurf, Gemini CLI, VS Code) — either CLI works:

```bash
npx plugins add hungv47/meta-skills         # install via plugins CLI
npx skills add hungv47/meta-skills          # install via skills CLI
```

Useful flags (both CLIs):

```bash
npx skills add hungv47/meta-skills -g                   # install globally
npx skills add hungv47/meta-skills --skill write-copy   # cherry-pick one
npx skills add hungv47/meta-skills --list               # see what's available
```

Run `npx plugins --help` or `npx skills --help` for the full command surface (`list`, `update`, `remove`, `find`). Requires Node 18+.

> **Plugin name:** the Claude plugin is `forsvn-skills`. The repository URL stays `github.com/hungv47/meta-skills` so existing links keep working.

## Quick start

1. Install (above).
2. Type `/forsvn` and describe what you're trying to do — vague is fine.
3. Or call any skill directly by verb (`/research-icp "B2B PM SaaS for agencies"`).

You don't have to memorize skill names. Plain English ("help me figure out who we're building for", "this codebase has accumulated cruft") routes to the right skill via your editor's slash-command picker.

## The four domains

Each domain folder has a README with the full per-skill spec. Or run `/forsvn` to be routed automatically.

### Research — understand the market and decide what to do

> [`skills/research/`](./skills/research/) · 8 skills

`research-icp` · `research-market` · `diagnose` · `prioritize` · `plan-funnel` · `research-shortform` · `research-platform` · `evaluate-shortform`

### Marketing — create, optimize, and measure marketing

> [`skills/marketing/`](./skills/marketing/) · 21 skills

`create-brand` · `plan-campaign` · `brief-landing-page` · `brief-graphic` · `brief-shortform` · `brief-app-preview` · `write-copy` · `write-ad` · `write-outreach` · `write-social` · `optimize-seo` · `monitor-aeo` · `humanmaxxing` · `polish-vn` · `produce-asset` · `produce-video` · `publish-social` · `evaluate-ad` · `evaluate-campaign` · `evaluate-content` · `evaluate-landing-page`

### Product — design and build software

> [`skills/product/`](./skills/product/) · 7 skills

`map-user-flow` · `architect-system` · `clean-code` · `clean-machine` · `write-docs` · `build-ios-apps` · `extract-service`

### Meta — discover, debate, decompose, verify

> [`skills/meta/`](./skills/meta/) · 7 skills

`forsvn` (front door) · `discover` · `debate-agents` · `run-eval-loop` · `breakdown-tasks` · `review-work` · `clean-artifacts`

## Where outputs land

`.forsvn/` is the canonical state root. Three top-level folders hold canonical records the team owns long-term:

- `research/` — audience and market of record (`product-context.md`, `icp-research.md`, `market-research.md`)
- `brand/` — brand identity of record (`BRAND.md`, `DESIGN.md`, `ASSETS.md`)
- `architecture/` — system blueprint of record (`system-architecture.md`)

Everything else lives under `.forsvn/{context,experience,artifacts,loops,evals,routing,dashboard}/`. Every artifact carries frontmatter (`skill`, `version`, `date`, `status`) for traceability.

## Tips

- **Run `/research-icp` first when starting any marketing work.** It writes `research/product-context.md` — the foundation 13+ downstream skills read. Skip it and they all re-ask you for audience details.
- **Answer Pre-Dispatch questions in one reply.** Skills bundle 3–7 context questions per dispatch so they can run parallel sub-agents. Answer all at once to save a re-prompt round.
- **Run `/review-work` before shipping.** Auto-triggers on security and data-mutation work. Run it manually on copy, briefs, and architecture docs.
- **Install globally for the meta layer.** `/forsvn`, `/discover`, `/run-eval-loop`, `/debate-agents`, `/breakdown-tasks`, `/review-work` are useful in every project — `npx skills add hungv47/meta-skills -g`.

## Migrating from pre-2.0 (4-plugin install)

If you previously installed `research-skills`, `marketing-skills`, `product-skills`, or the standalone `meta-skills` plugin, remove and reinstall — every skill is preserved under the consolidated `forsvn-skills` umbrella:

```bash
npx skills remove research-skills marketing-skills product-skills meta-skills
npx skills add hungv47/meta-skills
```

Claude Code plugin marketplace users:

```
/plugin marketplace remove agent-skills
/plugin marketplace add hungv47/meta-skills
/plugin install forsvn-skills
```

The four source repos are archived on GitHub. Pre-2.0 history lives in [GitHub releases](https://github.com/hungv47/meta-skills/releases) (tagged `v1.x`).

## Changelog & license

- [CHANGELOG.md](./CHANGELOG.md) — releases from v2.0 onward
- [GitHub releases](https://github.com/hungv47/meta-skills/releases) — full release history
- MIT
