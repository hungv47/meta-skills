---
kind: artifacts-root
lifecycle: pipeline
read-by: skills resuming prior work
written-by: every generative skill
---

# `docs/forsvn/artifacts/` — Work Product

One-shot skill outputs. Organized by **initiative**, then by **skill** — never by date alone.

## Layout

```
artifacts/
├── <initiative-slug>/
│   ├── <skill-name>/
│   │   └── YYYY-MM-DD-<artifact-slug>.md
│   └── ...
└── _scratch/        # one-off outputs not tied to an initiative
```

Examples:

```
artifacts/
├── q2-launch/
│   ├── brand-system/2026-05-19-brand-v1.md
│   ├── copywriting/2026-05-20-hero-headlines.md
│   └── lp-brief/2026-05-21-pricing-page.md
└── _scratch/
    └── 2026-05-19-meta-ad-tagline-experiment.md
```

## Initiative Slug Convention

Kebab-case, short, descriptive. Examples: `q2-launch`, `pricing-redesign`, `cold-outreach-may`. `/forsvn` proposes a slug when an initiative is first identified and confirms with the user.

## File Naming

`YYYY-MM-DD-<artifact-slug>.md` — date in filename so `ls -la` is meaningful and collisions are impossible.

## Frontmatter Contract

Every artifact under `docs/forsvn/artifacts/` carries:

```yaml
---
initiative: <slug>
skill: <skill-name>
created: YYYY-MM-DD
status: draft | done | done_with_concerns | blocked | needs_context
inputs:
  - <path to context file, prior artifact, or research source>
---
```

`status:` powers the dashboard. `inputs:` powers provenance and lets resume operations rebuild the dependency chain.

## What Does NOT Live Here

- Loop strategy / execution / eval artifacts → `loops/<slug>/`
- Evaluation snapshots → `evals/`
- Canonical brand / architecture / research → project root (`brand/`, `architecture/`, `research/`)
- Resume metadata → `routing/`
