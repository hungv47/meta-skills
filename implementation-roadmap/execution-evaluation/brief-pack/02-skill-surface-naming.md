# Brief 02 — Skill Surface, Naming, and Routing

## Goal

Make the skill layer easier for humans and agents to navigate: verb-first names, clean frontmatter, short `SKILL.md` bodies, references for depth, and backward-compatible aliases.

## Naming Rule

Skills should be verbs first: action before object.

Examples:
- `brand-system` → `create-brand`
- `design-brief` → `brief-graphic`
- `short-form-brief` → `brief-shortform`
- `lp-brief` → `brief-landing-page`
- `campaign-plan` → `plan-campaign`
- `market-research` → `research-market`
- `icp-research` → `research-icp`
- `ad-copy` → `write-ad`
- `copywriting` → `write-copy`
- `social-copy` → `write-social`
- `cold-outreach` → `write-outreach`
- `asset-produce` → `produce-asset`
- `video-produce` → `produce-video`
- `social-publish` → `publish-social`
- `ad-eval` → `evaluate-ad`
- `content-eval` → `evaluate-content`
- `campaign-eval` → `evaluate-campaign`
- `fresh-eyes` → `review-work`
- `code-cleanup` → `clean-code`
- `extract-service-layer` → `extract-service`

Open decision: `/forsvn` is branded and not verb-first. Keep it as the core exception unless the user chooses `/navigate-forsvn`.

## Migration Policy

Do not break old names in the first pass.

Recommended:
- create new verb-first names
- keep old names as aliases
- update `/forsvn` routing to prefer new names
- add deprecation notes only after aliases are verified
- preserve artifact provenance so old skill names still resolve in historical files

## SKILL.md Cleanup

Audit every skill body.

Rules:
- `SKILL.md` should be a concise operating procedure.
- Deep methodology goes in `references/`.
- Repeatable mechanics go in `scripts/`.
- Frontmatter should support routing, not carry long instruction payloads.
- Remove duplicated critic instructions where shared rubrics exist.
- Keep action steps concrete enough for coding agents.

## Frontmatter Audit

Review fields like:
- `name`
- `description`
- `argument-hint`
- `allowed-tools`
- `metadata`
- `promptSignals`
- `routing`

Keep only fields that improve discovery, routing, safety, or execution. Frontmatter is loaded often; bloated frontmatter is product debt.

## `/forsvn` Routing Metadata

Each skill should expose enough metadata for `/forsvn` to decide:
- what intent it handles
- what inputs it needs
- what artifacts it reads
- what artifacts it writes
- whether it can run without user confirmation
- whether it is advisory, generative, production, evaluation, or review

## Acceptance Checks

- Users can call old names and new names during migration.
- `/forsvn` routes to verb-first names internally.
- Skill files are shorter and easier to scan.
- Methodology is still available in references.
- No artifact path is silently changed without migration handling.
