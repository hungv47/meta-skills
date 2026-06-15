# FORSVN

![FORSVN — turn your coding agent into a full product team](./assets/banners/forsvn-hero-anim.svg)

**Turn your coding agent into a full product team — composable skills across research, marketing, product, and process, from one install.**

Call any skill by verb (`/research-icp`, `/write-copy`, `/architect-system`, `/review-work`) or let the front door route for you (`/forsvn`). Skills chain — each one reads what earlier skills left behind, so output compounds the more you use the stack.

![The FORSVN stack — four skill domains feed a central .forsvn artifact store, which feeds manifest, loops, and review](./assets/banners/forsvn-skills-systemmap.svg)

## Install

Pick the path that matches what you want.

### Claude Code (canonical) — skills + the review surface

One install. **`forsvn`** carries the skills (the `/forsvn` front door) *and* the bundled review surface — preview any draft as a themed, on-brand page and approve / deny / request changes via `/forsvn:review` (the agent drafts, you decide).

```
/plugin marketplace add hungv47/meta-skills
/plugin install forsvn            # skills + /forsvn front door + /forsvn:review|collab|doctor
```

**The review surface needs [Bun](https://bun.sh)** (`curl -fsSL https://bun.sh/install | bash`) — it's a small localhost CLI driven by `/forsvn:review`. The skills themselves need nothing beyond your agent.

The review surface is one-shot approve/deny/request-changes. The richer **turn-by-turn human↔agent collaborative editing** (Proof-backed) is a separate opt-in tier that additionally needs the `forsvn-mcp` server and the Proof SDK; it is documented in the app repo's collaborative-docs runbook.

### Other agents (Cursor, Codex, Windsurf, Gemini CLI, VS Code) — skills

Just the skills, plain Markdown output, no review surface.

```bash
npx skills add hungv47/meta-skills
```

Useful flags:

```bash
npx skills add hungv47/meta-skills -g                   # install globally
npx skills add hungv47/meta-skills --skill write-copy   # cherry-pick one
npx skills add hungv47/meta-skills --list               # see what's available
```

> `npx plugins` / `npx skills` are a **third-party** CLI (the `claude-plugins` registry); they resolve through their own index, not this repo's `marketplace.json`. For Claude Code prefer the built-in `/plugin marketplace add` above. Run `npx skills --help` for the full surface (`list`, `update`, `remove`, `find`). Requires Node 18+.

> **Renamed from `forsvn-skills` → `forsvn` (v1.2.0).** If you installed the old name, remove and reinstall: `npx skills remove forsvn-skills` (or `/plugin marketplace remove` in Claude Code), then install `forsvn` above. The repository URL stays `github.com/hungv47/meta-skills`, so existing links keep working.

> **`forsvn-preview` is now a module inside `forsvn`, not a separate plugin.** Its commands re-namespace under the single plugin: `/forsvn-preview:review` → `/forsvn:review`, `/forsvn-preview:collab` → `/forsvn:collab`, `/forsvn-preview:doctor` → `/forsvn:doctor`. There is no `/forsvn-preview:*` alias — the command prefix is the plugin name. If you previously installed `forsvn-preview` separately, remove it (`/plugin marketplace remove`) and use the bundled commands; one `/plugin install forsvn` now carries both the skills and the review surface.

## Quick start

1. Install (above).
2. Type `/forsvn` and describe what you're trying to do — vague is fine.
3. Or call any skill directly by verb (`/research-icp "B2B PM SaaS for agencies"`).

You don't have to memorize skill names. Plain English ("help me figure out who we're building for", "this codebase has accumulated cruft") routes to the right skill via your editor's slash-command picker.

## What you can do with it

A few of the things `/forsvn` routes to — type any of these in plain English:

<table>
<tr>
<td width="50%"><img src="./assets/showcase/usecase-01-research.png" alt="Research — Help me figure out who we're building for and what to ship first. → ICP profile · market scan · first-ship shortlist"></td>
<td width="50%"><img src="./assets/showcase/usecase-02-product.png" alt="Product — Turn this rough idea into a clear product brief and a task list. → user flow · product brief · ranked tasks"></td>
</tr>
<tr>
<td><img src="./assets/showcase/usecase-03-marketing.png" alt="Marketing — Write launch copy and a landing page that sound like our brand. → brand voice · landing page · launch copy"></td>
<td><img src="./assets/showcase/usecase-04-product.png" alt="Product — Audit this codebase for dead code and refactor the messy parts. → dead-code report · refactor plan"></td>
</tr>
<tr>
<td><img src="./assets/showcase/usecase-05-marketing.png" alt="Marketing — Plan a go-to-market campaign for our next release. → GTM plan · channels · campaign brief"></td>
<td></td>
</tr>
</table>

## What to expect

- **Four domains.** Research · Marketing · Product · Meta.
- **One install, every editor.** Claude Code plugin or `npx skills add` for Cursor, Codex, Windsurf, Gemini CLI, VS Code.
- **A single front door.** `/forsvn` reads your project state, asks ≤2 questions if needed, and routes you to the right skill (or resumes a prior initiative).
- **Context compounds.** Skills write artifacts into the `.forsvn/` data model (canonical truth · working output · experience, each by stack). Every downstream skill reads them automatically — no copy-paste, no re-asking.
- **Quality gates built in.** Most skills run multi-agent orchestration behind a critic gate. `/review-work` adds a fresh-eyes pass before you ship.

## The four domains

Each domain folder has a README with the full per-skill spec. Or run `/forsvn` to be routed automatically.

### Research — understand the market and decide what to do

![Research](./assets/banners/domain-research.png)

> [`skills/research/`](./skills/research/)

`research-icp` · `research-market` · `diagnose` · `prioritize` · `plan-funnel` · `research-shortform` · `research-platform` · `evaluate-shortform`

### Marketing — create, optimize, and measure marketing

![Marketing](./assets/banners/domain-marketing.png)

> [`skills/marketing/`](./skills/marketing/)

`create-brand` · `plan-campaign` · `brief-landing-page` · `brief-graphic` · `brief-shortform` · `brief-app-preview` · `write-copy` · `write-ad` · `write-outreach` · `write-social` · `optimize-seo` · `monitor-aeo` · `preview-og` · `humanmaxxing` · `polish-vn` · `produce-asset` · `produce-video` · `publish-social` · `evaluate-ad` · `evaluate-asset` · `evaluate-campaign` · `evaluate-content` · `evaluate-landing-page` · `evaluate-outreach` · `evaluate-seo`

### Product — design and build software

![Product](./assets/banners/domain-product.png)

> [`skills/product/`](./skills/product/)

`map-user-flow` · `architect-system` · `clean-code` · `clean-machine` · `write-docs` · `build-ios-apps` · `extract-service`

### Meta — discover, debate, decompose, verify

![Meta](./assets/banners/domain-meta.png)

> [`skills/meta/`](./skills/meta/)

`forsvn` (front door) · `discover` · `debate-agents` · `run-pipeline` · `breakdown-tasks` · `review-work` · `clean-artifacts`

## Where outputs land

`.forsvn/` is the canonical state root — the project's data model, organized as **three layers, each by stack** (`meta · research · marketing · product`):

- `canonical/<stack>/` — **TRUTH**: curated records the team owns long-term (`ARCHITECTURE`, `USER-FLOW`, `MASTER-PLAN`, `BRAND`, `DESIGN`, `ICP`, `MARKET`), UPPERCASE, edited in place
- `artifacts/<stack>/` — **KNOWLEDGE**: working skill output, `<skill>-<date>-<slug>.md`
- `experience/<stack>/` — **MEMORY**: append-only learnings; prevents re-asking

Plus `index/` (the manifest API + human index), `context/`, `routing/`, and `performance/` — the operator-fed channel-performance store (post snapshots + publish ledger; **data, not artifacts** — exempt from the artifact contract; see [`references/performance-data.md`](./references/performance-data.md)). Every artifact carries frontmatter — `skill, version, date, status, stack, review_surface` + the instruction core `id, type, keywords` — for greppable discovery and traceability.

**The marketing loop closes on your own data.** The producers (`write-social`, `write-ad`, `brief-shortform`, `plan-campaign`) ground each generation in your channel history before they write: an empty store falls back to platform-intelligence priors ("no own data yet"), a sparse one treats your numbers as anecdote, and a sufficient one lets your own data win account-specific calls while priors keep platform mechanics. `publish-social` logs a ledger row at export and `evaluate-content` imports the real metrics, so the store fills as you ship — and a brand floor always outranks the data (a top performer that's off-brand is recorded as "performs but violates floor — not adopted," never copied).

## Tips

- **Run `/research-icp` first when starting any marketing work.** It writes `research/product-context.md` — the foundation downstream skills read. Skip it and they all re-ask you for audience details.
- **Answer Pre-Dispatch questions in one reply.** Skills bundle 3–7 context questions per dispatch so they can run parallel sub-agents. Answer all at once to save a re-prompt round.
- **Run `/review-work` before shipping.** Auto-triggers on security and data-mutation work. Run it manually on copy, briefs, and architecture docs.
- **Install globally for the meta layer.** `/forsvn`, `/discover`, `/run-pipeline`, `/debate-agents`, `/breakdown-tasks`, `/review-work` are useful in every project — `npx skills add hungv47/meta-skills -g`.

## Session execution policy

The first skill you run in a session asks **one bundled question**: single-agent or multi-agent execution. The default is model-aware — a capable model runs single-agent; a smaller model fans out to multiple sub-agents. Your answer persists in `.forsvn/routing/execution-profile.json` and every skill in the session inherits it, so you're never re-asked. Precedence: per-invocation flags (`--fast`, etc.) > session profile > model default > the skill's budget default. Where the harness supports hooks, the model is detected automatically and the ask is skipped.

## Tool targets

Tool-agnostic by default: briefs and render-ready prompts work anywhere. When a producing/briefing skill binds a brief, it asks once **which tool the output should target** (per category — design, video, animation, image, audio) and tunes capabilities + prompt syntax for it. The choice persists per category in the session execution profile, and engines already bound for live-drive inherit silently — you're never asked twice.

## Performance & invocation reliability

Claude Code reserves a **skill-listing budget** — by default `skillListingBudgetFraction: 0.01` (1% of the context window) for all installed skills' descriptions. The full stack alone is ≈ 2.7% of a 200k-token context, and most users run it alongside other plugins. On overflow, the least-used skills' **descriptions collapse to name-only**, which degrades *auto-selection* (Claude picking a skill without being asked).

- **Explicit invocation always works.** Skill *names* are never dropped — `/<skill-name>` or `Skill(forsvn:<name>)` resolves even under a full budget. Only description-driven auto-selection degrades.
- **Power-user config** (`settings.json`) to keep auto-selection sharp with the full stack:
  ```json
  {
    "skillListingBudgetFraction": 0.025,
    "skillOverrides": { "rarely-used-skill": "name-only" }
  }
  ```
- **Diagnose:** `/doctor` shows whether the budget is overflowing and which skills are affected; `claude plugin details` shows the always-on vs on-invoke token cost.
- **Audit the stack's footprint:** `bun _dev/audit-skill-listing.ts` reports the listing cost and the `skillListingBudgetFraction` needed to list every skill.

A `UserPromptSubmit` hook (`hooks/user-prompt-submit-skill-router.mjs`, suggestion-only) ships with the plugin to nudge auto-selection under budget pressure — it never auto-invokes a skill.

### Local dev / dogfood (skip the marketplace cache)

To run skills live from a working copy (Claude Code v2.1.157+) without the published marketplace cache going stale, symlink the repo's `skills/` into your project's `.claude/skills/` so edits load immediately:

```bash
ln -s "$(pwd)/skills/skills" .claude/skills   # auto-loads the skills; no /plugin install
```

This loads the **skills** live for fast iteration on skill content. It does **not** load the plugin's auto-discovered `hooks/` (e.g. the suggestion router) — those load only when Claude Code discovers the plugin root (`.claude-plugin/plugin.json` + sibling `hooks/`). To dogfood hook changes, install the plugin from the local repo as a marketplace (`/plugin marketplace add <path-to>/skills` → `/plugin install forsvn`) and reload, or use the published marketplace path below.

Keep the marketplace install (`/plugin install forsvn`) as the path for end users — it carries URL continuity and `.publicignore` fencing.

## Inside Codex

FORSVN ships a `.codex-plugin/` manifest, so inside Codex it renders a full card — logo, brand color, an attractive description, and clickable **preview prompts** that drop you straight into a use case. Same skills, native-feeling surface.

## About

FORSVN turns your coding agent into a full product team. Composable skills span research, marketing, product, and process — each reads what earlier skills left behind, so output compounds the more you use the stack. One install works across Claude Code, Cursor, Codex, Windsurf, Gemini CLI, and VS Code.

This repo is the public mirror; the source of truth lives in [`forsvn-com/forsvn`](https://github.com/forsvn-com/forsvn).

## Changelog & license

- [CHANGELOG.md](./CHANGELOG.md) — releases
- [GitHub releases](https://github.com/hungv47/meta-skills/releases) — full release history
- MIT
