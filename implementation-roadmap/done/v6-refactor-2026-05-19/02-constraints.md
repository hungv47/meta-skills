# Constraints — Install Model & Artifacts/Evals Contract

These are the non-negotiable facts of how skills ship and how outputs flow. Every refactor decision must satisfy these. If you discover a constraint that contradicts this file, update the file BEFORE acting on it — don't let drift accumulate.

---

## 1. How `npx skills add` actually works

**The operator initially thought:** `npx skills add` only adds the root SKILL.md, so everything must bundle inside SKILL.md.

**Actual behavior** (from `agent-skills/README.md:33`):

> "Single-skill installs are self-contained. Shared scripts and references that a skill needs are packaged into that skill under `scripts/` and `references/_shared/`, so `npx skills add --skill <name>` does not depend on sibling folders being installed."

**What this means:**

- `npx skills add hungv47/<stack>` copies the **entire stack folder** (all skills, plus their `agents/`, `references/`, `scripts/`).
- `npx skills add hungv47/<stack> --skill <name>` copies **only that one skill's folder**, complete with its `agents/`, `references/`, `scripts/`.
- A skill folder is whatever lives under `<stack>/skills/<skill-name>/` — all of it ships.
- The CLI is `@hungv47/syncthis` published as `npx skills`. Source: `syncthis/src/`.

**Implication for the refactor:**

The body-diet + lazy-reference pattern works end-to-end. We can move procedure into `references/foo.md` and rely on the agent loading it when needed at runtime. The reference file ships with the skill.

---

## 2. The self-containment rule

A skill cannot reference files outside its own folder. Specifically:

- ❌ `references/_shared/foo.md` → `../../other-skill/references/foo.md` (cross-skill import)
- ✅ `references/_shared/foo.md` → the file lives inside this skill's folder

Shared content (e.g., `marketing-foundations.md`, platform-intelligence catalogs, critic rubrics) must be **physically duplicated** into each consuming skill's `references/_shared/` folder. This is already the convention. The `.generated-support` marker file (e.g., `research-skills/skills/short-form-eval/references/_shared/platform-intelligence/.generated-support`) indicates the file was synced from a canonical source elsewhere.

**Sync mechanism status:** there's an existing pattern but **the script that performs the sync needs verification** before Phase 3. Open question for the next agent: find the script (likely something in `meta-skills/scripts/` or a top-level `scripts/`), verify it handles bidirectional updates correctly, and document its invocation in [`03-harness.md`](./03-harness.md). If no script exists, building one is a sub-task of Phase 1.

**Implication for the refactor:**

- When body-diet pulls content into a reference, decide if that content is skill-specific (lives in `references/foo.md`) or stack-shared (lives in `references/_shared/foo.md` and gets synced).
- Stack-shared refs introduce a sync dependency — only use when 2+ skills genuinely need the same content. Otherwise, prefer skill-specific.

---

## 3. The artifacts ↔ evals contract

This is the most fragile coupling in the stack. Break it and the evaluation loop breaks silently.

### How it works today

1. **Brief skills** produce artifacts at deterministic paths:
   - `lp-brief` → `.agents/skill-artifacts/mkt/lp-brief/<slug>/brief.md`
   - `short-form-brief` → `.agents/skill-artifacts/mkt/short-form-brief/<slug>.md`
   - `ad-copy` → `.agents/skill-artifacts/mkt/ad-copy/<audience-temp>-<date>-<slug>.md`
   - `copywriting` → `.agents/skill-artifacts/mkt/content/<slug>.copy.md`
   - (full inventory: see relevant SKILL.md "Produces" line)

2. **Artifacts declare frontmatter** that downstream consumers depend on:
   - `lifecycle:` (one of: canonical, loop, loop-context, strategy, execution, evaluation, learning, pipeline, decision, snapshot, ephemeral)
   - `status:` (one of: done, done_with_concerns, blocked, needs_context)
   - `produced_by:` (the skill that wrote it)
   - Plus skill-specific fields (e.g., `audience_temp`, `loop_slug`)

3. **Loop programs** at `skills-resources/loops/<slug>/program.md` reference artifact paths and declare expected evals.

4. **Eval skills** (lp-eval, short-form-eval) read:
   - The original brief artifact (path + frontmatter + specific sections)
   - The published result (URL, content)
   - The matching catalog reference (e.g., `short-form-eval` reads the `short-form-research` catalog)

   ...and write:
   - `skills-resources/loops/<slug>/evals/<date>-cycle-N.md`
   - Append to `skills-resources/loops/<slug>/results.tsv`

5. **`learnings.md`** is the distilled output — promoted lessons that feed future briefs.

### Why this matters for the refactor

If a brief skill's body-diet inadvertently:
- Drops a frontmatter field → eval skill fails to parse
- Renames a section header → eval skill can't find the expected content
- Changes the output path → loop programs point at nothing
- Changes the rubric a critic uses → eval scores aren't comparable to historical runs

...the loop is broken. Silently. The eval skill may still run and produce output, but it's scoring against a shifted target.

### The contract preservation rule

**Every refactored brief-producing skill must:**

1. Declare its artifact contract explicitly at the top of the refactored SKILL.md:
   ```markdown
   ## Artifact contract
   - Path: <exact path with placeholders>
   - Frontmatter fields: <list>
   - Required sections: <list of section headers>
   - Consumed by: <list of downstream skills>
   ```

2. Pass the harness's **contract-hash check** — hash of frontmatter shape + section headers must match pre/post unless the change is intentional and atomic with the downstream eval skill update.

3. If the change IS intentional, both the brief skill and the eval skill ship in the same commit, with the contract change noted in the commit message and in [`progress.md`](./progress.md)'s decision log.

### Brief-producing skills (sorted by eval-coupling risk)

| Skill | Output path | Consumed by | Risk |
|---|---|---|---|
| `lp-brief` | `.agents/skill-artifacts/mkt/lp-brief/<slug>/brief.md` | `lp-eval` | HIGH — full eval loop |
| `short-form-brief` | `.agents/skill-artifacts/mkt/short-form-brief/<slug>.md` | `short-form-eval` | HIGH — full eval loop |
| `ad-copy` | `.agents/skill-artifacts/mkt/ad-copy/<...>.md` | (no automated eval yet) | MEDIUM — has explicit `.critic-score.md` sidecar |
| `copywriting` | `.agents/skill-artifacts/mkt/content/<slug>.copy.md` | (no automated eval) | LOW |
| `cold-outreach` | `.agents/skill-artifacts/mkt/cold-outreach/<slug>.md` | (no automated eval) | LOW |
| `humanize`, `vn-tone` | `.agents/skill-artifacts/mkt/content/<slug>.humanized.md` | (no automated eval) | LOW |
| `design-brief` | `.agents/skill-artifacts/mkt/design-briefs/<slug>.md` | (no automated eval) | LOW |
| `campaign-plan` | varies | (no automated eval) | LOW |
| `social-copy` | `.agents/skill-artifacts/mkt/copy/<platform>-<date>-<slug>.md` | (no automated eval) | LOW |

For HIGH-risk skills, refactor with the corresponding eval skill open in another tab. Touch both atomically if either contract field needs to change.

---

## 4. The lifecycle taxonomy (don't redefine)

Every artifact declares `lifecycle:` in frontmatter. This determines where it lives and how it behaves. The taxonomy is fixed in `agent-skills/CLAUDE.md`. Do not extend or redefine during the refactor.

| lifecycle | path pattern | mutability |
|---|---|---|
| canonical | `brand/`, `architecture/`, `research/` (top-level) | Edited in place by humans |
| loop | `skills-resources/loops/<slug>/program.md` | Operating contract |
| loop-context | `skills-resources/loops/<slug>/context.md` | Local assumptions |
| strategy | `skills-resources/loops/<slug>/strategy/` | Plans, hypotheses |
| execution | `skills-resources/loops/<slug>/execution/` | Marketing/content assets |
| evaluation | `skills-resources/loops/<slug>/evals/` | Metric snapshots |
| learning | `skills-resources/loops/<slug>/learnings.md` | Promoted lessons |
| pipeline | `.agents/skill-artifacts/<domain>/` | One-time skill output |
| decision | `.agents/skill-artifacts/meta/decisions/` | Dated immutable |
| snapshot | `.agents/skill-artifacts/meta/records/` | Dated record / living registry |
| ephemeral | `.agents/skill-artifacts/.archive/` | Cleanup target |

If a refactor seems to require a new lifecycle category → stop and flag to operator. Don't extend the taxonomy without explicit approval.

---

## 5. The complexity-routing budget tiers (in scope to refine)

Every skill declares a `budget` tier in frontmatter: `fast` / `standard` / `deep`. Defined in `agent-skills/CLAUDE.md`. Currently `--fast` is operator-flagged. The refactor will add proactive mode-resolution per [`04-protocol.md`](./04-protocol.md) — but the three tiers themselves are fixed. Don't introduce a new tier.

---

## 6. What the refactor must NOT change

- Skill names (no renames)
- Skill folder paths
- Artifact frontmatter field names (without atomic downstream update)
- Artifact paths
- The lifecycle taxonomy
- The 3 budget tiers
- The `_shared/` ref convention
- The `agents/` subagent convention

If a refactor seems to require changing any of these → stop, document the friction in [`progress.md`](./progress.md), and raise with operator.
