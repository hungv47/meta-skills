# Per-Skill Refactor Protocol

The exact steps to refactor one skill. Repeat for every skill in the order specified in the relevant `stacks/` file. No shortcuts — each step protects against a specific failure mode named below.

---

## Pre-flight check (before touching any skill)

- [ ] Harness exists and runs (see [`03-harness.md`](./03-harness.md))
- [ ] [`progress.md`](./progress.md) reflects current phase
- [ ] Working tree clean (`git status` shows no uncommitted changes in the relevant submodule)
- [ ] On `main` branch in the relevant submodule (NOT detached HEAD from umbrella update)

If any of the above are false → fix before starting. Don't refactor on a dirty tree; you'll lose the ability to revert cleanly.

---

## Step 1 — Pick the input fixtures

Before audit, you need 3 inputs the skill will be run against (per [`03-harness.md`](./03-harness.md)). For each skill:

- **Minimal fixture:** ≤3 sentences, no artifact references. Tests fast-mode auto-resolution.
- **Standard fixture:** single-topic, ~1 paragraph, may reference 1 artifact. Tests default mode.
- **Stretch fixture:** cross-domain, refs multiple artifacts, has production stakes. Tests deep-mode auto-resolution.

Pull from real operator history first (search `.agents/skill-artifacts/` for past invocations of this skill, or `git log` the artifact directory). Synthesize only if no real example exists, and label `[synthetic]` in the fixture filename.

Save fixtures at `.agents/skill-artifacts/meta/records/harness/inputs/<skill>-{minimal,standard,stretch}.md` with frontmatter:

```yaml
---
skill: <name>
fixture_kind: minimal | standard | stretch
source: real | synthetic
captured: YYYY-MM-DD
---
```

**Failure mode this prevents:** refactoring against vibes inputs that don't represent real usage; ending up with a skill that handles edge cases the operator doesn't actually hit.

---

## Step 2 — Audit (capture baseline)

Run harness on all 3 fixtures with the **current, unchanged** SKILL.md.

```bash
bun meta-skills/scripts/harness/runner.ts --skill <name> --input .agents/skill-artifacts/meta/records/harness/inputs/<skill>-minimal.md
bun meta-skills/scripts/harness/runner.ts --skill <name> --input .agents/skill-artifacts/meta/records/harness/inputs/<skill>-standard.md
bun meta-skills/scripts/harness/runner.ts --skill <name> --input .agents/skill-artifacts/meta/records/harness/inputs/<skill>-stretch.md
```

Then:

```bash
bun meta-skills/scripts/harness/report.ts --skill <name>
```

Save outputs per the locked convention (operator-approved 2026-05-16, matches current practice):

| Artifact | Path |
|---|---|
| Run JSON (machine, hook-produced) | `.agents/skill-artifacts/meta/records/harness/<date>-<skill>-<run-id>.json` |
| Per-run skill report (human-readable summary) | `.agents/skill-artifacts/meta/records/<date>-<skill>-<descriptor>.md` (use slug prefix `harness-baseline-` for baseline runs, `harness-postrefactor-` for validation runs) |
| Aggregator report (cross-fixture summary) | `.agents/skill-artifacts/meta/records/harness/baseline/<skill>/baseline-report.md` |
| Loop scaffolds created during runs | `skills-resources/loops/harness-{baseline,postrefactor}-<initiative>/` |

Update [`progress.md`](./progress.md): skill status → `audited`. Note the baseline numbers in the skill row.

**Failure mode this prevents:** refactoring without a measurement to compare against; "I think it's better" with no proof.

---

## Step 3 — Classify (structural vs. creative)

Decide which bucket the skill belongs to. This determines how aggressive the body-diet can be.

### Structural skills

Procedural rigor is the value. Examples: `system-architecture`, `task-breakdown`, `fresh-eyes`, `code-cleanup`, `machine-cleanup`, `cleanup-artifacts`, `eval-loop`, `funnel-planner`.

**Refactor pattern:**
- Body diet is aggressive — target ≤200 lines
- Procedure goes into specific named refs (e.g., `references/sizing-protocol.md`, `references/dependency-rules.md`)
- Critic loads the **full rubric** — strict scoring is the point
- Anti-pattern lists become checklist refs loaded at critique time

### Creative skills

Refs are *opinions and examples* to inform, not rules to conform to. Examples: `copywriting`, `brand-system`, `design-brief`, `lp-brief`, `ad-copy`, `cold-outreach`, `social-copy`, `short-form-brief`, `humanize`, `vn-tone`, `icp-research` (persona narrative side).

**Refactor pattern:**
- Body diet is moderate — target ≤300 lines
- Refs are clustered by *direction* (e.g., `references/voice-axes.md`, `references/hook-archetypes.md`) — operator/agent picks one to follow per invocation
- Body explicitly says: **"refs inform; output need not conform exactly."**
- Critic loads a **thinner rubric** — checks craft floor (clarity, no AI tells, hits brief), not house-style ceiling
- Keep at least one example per ref so the agent has a target to triangulate from
- Hard safety gates stay strict regardless (e.g., `ad-copy` policy + claim substantiation; `design-brief` accessibility minimums)

### Mixed skills

Some have both modes. `lp-brief` is structural in its conversion-principles gate and section spec, creative in its copy candidates and asset slots. `seo` is structural in compliance rules and creative in title/meta variant generation.

For mixed: structural sections follow structural rules; creative sections follow creative rules; the body routes between them via clear branches. Document the split explicitly in the SKILL.md frontmatter:

```yaml
classification: mixed
structural_sections: [conversion-gate, section-spec]
creative_sections: [copy-candidates, asset-slots]
```

Update [`progress.md`](./progress.md) skill row with the classification.

**Failure mode this prevents:** applying strict scaffolding to creative skills and producing house-style-conformant slop; applying creative looseness to structural skills and losing precision.

---

## Step 4 — Body diet

The actual refactor work. The body becomes:

1. **When to use** (the frontmatter description, lifted into a paragraph) — keep current
2. **Decision tree** — flowchart in markdown or prose. The branches determine which references load.
3. **Mode resolver** — see "Step 5" below; one inline call to load `references/_shared/mode-resolver.md` if not already in body
4. **Per-branch routing** — for each decision-tree leaf, the body says: "load `references/X.md` and follow it." That's the routing; the procedure lives in the ref.
5. **Artifact contract block** — the explicit per-[`02-constraints.md`](./02-constraints.md) block declaring output path, frontmatter fields, required sections, downstream consumers.
6. **Status declaration** — DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT (per CLAUDE.md completion protocol)

**Body line targets:**
- Structural: ≤200 lines
- Creative: ≤300 lines
- Routers (`orchestrate-*`): ≤150 lines

**What moves OUT of body, into refs:**
- Multi-step procedures
- Worked examples (move to `references/examples/`)
- Anti-pattern lists (move to `references/anti-patterns.md`, load at critique time)
- Full rubric specs (move to `references/rubric.md`, load when critic fires)
- Long anti-sycophancy preambles (move to `references/_shared/anti-sycophancy.md` — duplicate via sync)

**What STAYS in body:**
- The decision tree itself
- Hard safety gates (e.g., `ad-copy` policy refusal logic) — strict gates run on every invocation
- The artifact contract
- Mode-resolver entry point

**Failure mode this prevents:** body that re-teaches what refs already teach; refs that never get loaded because all the procedure is in body; agent confusion from contradictory body↔ref content.

---

## Step 4.5 — Playbook reference extraction (added 2026-05-16 with merge)

Per [`../README.md`](../README.md) locked decision #9 (playbook voice via refs, not body bloat): every refactored skill produces a `references/playbook.md` capturing the team's curated wisdom about the skill.

**What goes in `playbook.md`:**

- **Why this skill exists** — the problem it was built to solve, the alternatives considered, the position taken
- **Methodology** — the principles the skill enforces and the reasoning behind them
- **Worked examples** — annotated showing the skill's reasoning, not just outputs (light examples; heavy ones go in `references/examples/`)
- **History** — load-bearing prior decisions, deprecations, "we tried X, learned Y" (with dates)
- **When to reach for this skill vs. a sibling** — disambiguation against adjacent skills

**What does NOT go in `playbook.md`:**

- Branch-specific procedures (those go in `references/procedures/<branch>.md`, loaded only when that branch fires)
- The contract / frontmatter spec (stays in body — it's load-bearing on every run)
- Critic rubrics (live in `_shared/thin-critic-rubric.md` or skill-specific rubric refs)
- Anti-pattern lists (live in `references/anti-patterns.md`, loaded at critique time)

**Body pointer convention — load-class tags:**

Every reference cited in the body carries a tag so the agent knows when to load it:

| Tag | Meaning | Loaded when |
|---|---|---|
| `[PLAYBOOK]` | Read to learn / internalize | Cold-start if no playbook in conversation context; humans read freely |
| `[PROCEDURE]` | Load when branch fires | Per-invocation, branch-gated |
| `[EXAMPLE]` | Load when triangulating to target | Agent needs a concrete anchor |
| `[ANTI-PATTERN]` | Load when critic fires | At critique time only |

Example body pointer:

```markdown
For the why and the operating philosophy of this skill, see `references/playbook.md` [PLAYBOOK].
For the cold-start interview protocol, load `references/procedures/cold-start.md` [PROCEDURE] when no prior context exists.
```

**Source material for `playbook.md`:**

When refactoring an existing skill, source `playbook.md` content from:

1. Existing SKILL.md body sections that read as "essay about the skill" (not procedure)
2. CHANGELOG entries that capture *why* things changed
3. Git log of the skill's directory
4. Operator-stated rationale captured in `progress.md` decision log
5. Synthesize fresh if the wisdom exists only in operator's head — flag to operator for review

**Body line targets become soft, not hard.** The harness measures cost directly; line targets were a proxy. If a body lands at 230 lines because the decision tree carries one-line "why this branch matters" annotations that make the skill teachable — that's a good outcome. The cost gate (Gate 1) is the hard one.

**Failure mode this prevents:** SKILL.md bodies bloated with team-wisdom essays (loses cost win); OR machine-thin bodies with nowhere for curated wisdom to live (loses the team curriculum value).

---

## Step 5 — Mode-resolver wiring

Replace the existing `--fast` / `--deep` flag handling with proactive auto-resolution + user confirm.

Each refactored skill loads `references/_shared/mode-resolver.md` (a ~30-line ref shipped with every skill via the sync mechanism) at invocation entry. The resolver classifies input on three axes:

| Axis | Signal | Mode push |
|---|---|---|
| Input depth | ≤3 sentences, no artifact refs | → `fast` |
| Cross-domain | refs multiple skills / domains | → `deep` |
| Stakes | mentions launch / publish / production / customer-facing | → `deep` |
| Default | otherwise | → skill's declared budget |

Skill then emits ONE line and waits:

```
Resolved mode: standard (input is single-topic, no production stakes mentioned). Run as standard? [Y / fast / deep]
```

- User typing `Y` or pressing enter → run standard
- User typing `fast` / `deep` → override
- `--fast` / `--deep` flags on the original prompt → bypass the prompt entirely, run with flag
- Hard safety gates (per CLAUDE.md "Safety gates supersede `--fast`") still enforced regardless

The mode-resolver ref must live at `references/_shared/mode-resolver.md` in EVERY skill — duplicated via the sync mechanism. Single source of truth lives at `meta-skills/skills/orchestrate-meta/references/_shared/mode-resolver.md` and is synced to all others. (Establishing this as canon is part of Phase 1 wrap-up.)

**Failure mode this prevents:** operator has to remember `--fast` for every quick question; skills run deep on inputs that didn't need it (wasting tokens); skills run fast on production work and produce shallow output (wasting trust).

---

## Step 6 — Critic-gate ROI audit

For each sub-agent the skill spawns (look in `agents/` folder for the list):

1. From the baseline harness data (step 2), check `agents_spawned[].output_changed_main_thread` rate.
2. **If ≥50%** → keep as-is.
3. **If 30–49%** → demote: critic fires only when triggered by specific conditions (e.g., "fire only if output exceeds X length" or "fire only on stretch fixtures"). Document the trigger in the agent's `.md` file.
4. **If <30%** → remove or merge with another agent. Document the removal in [`progress.md`](./progress.md)'s decision log with the baseline data as evidence.

Removing a critic is a one-way door — re-add only if a post-refactor regression makes the case. Don't reflexively keep critics "just in case."

**Failure mode this prevents:** carrying critic-gate overhead from skill v1.0 forward into v3.0 when the underlying model has improved enough that the critic is now a no-op.

---

## Step 7 — Reference modularization

For each procedure that moved out of body in step 4:

1. Decide skill-specific vs. shared:
   - **Skill-specific:** lives at `references/<name>.md`
   - **Shared (used by 2+ skills):** lives at `references/_shared/<name>.md` AND has a sync source documented in `.generated-support`

2. For shared refs, the canonical source lives in **one specific skill's `references/_shared/`** — the others get synced copies. Convention: the most-foundational consumer owns it.
   - Example: `mode-resolver.md` canonical = `orchestrate-meta`
   - Example: `marketing-foundations.md` canonical = `marketing-skills/shared/` (or one designated skill)

3. Each ref must be **self-contained** — it can be read standalone without needing other refs loaded simultaneously.

4. Each ref has a clear header indicating when the body loads it:

```markdown
# question-bank.md
**Load when:** discover skill enters cold-start mode and needs the full question inventory.
**Owner:** meta-skills/skills/discover/
```

**Failure mode this prevents:** silent drift between shared-ref copies across skills; refs that assume context only the body has loaded.

---

## Step 7.5 — Artifact graph hardening (added 2026-05-16 with merge)

The merged v6 program treats the artifact↔eval chain as a first-class refactor concern (operator principle #2: "we care deeply about system, chaining, how skills connected together through a system consists of artifacts and results"). Every refactored skill must leave the chain more legible than it found it.

**Per-skill checklist (do during refactor, not after):**

1. **Verify the output path matches `canonical-paths.md`** (the artifact path inventory produced in Phase 1B). If they differ, the path is wrong, not the inventory — coordinate with operator before changing the artifact contract.

2. **Confirm artifact frontmatter includes:**

```yaml
---
lifecycle: <one of: canonical | loop | loop-context | strategy | execution | evaluation | learning | pipeline | decision | snapshot | ephemeral>
status: <one of: done | done_with_concerns | blocked | needs_context>
produced_by: <this skill's name>
provenance:
  skill: <this skill's name>
  run_date: <YYYY-MM-DD>
  input_artifacts:
    - <path to upstream artifact>
  output_eval:                        # optional — present if this artifact has a defined downstream eval
    - <path to eval workspace>
---
```

3. **Update the body's `## Artifact contract` block** to name every downstream consumer explicitly. Format:

```markdown
## Artifact contract

- **Path:** `<exact path from canonical-paths.md>`
- **Lifecycle:** <from taxonomy>
- **Frontmatter fields:** <list>
- **Required sections:** <list of section headers>
- **Consumed by:** <comma-separated list of downstream skills and what they read>
- **Eval workspace (if any):** `<path>`
```

4. **For HIGH-risk pairs (brief skill → eval skill), verify the downstream eval still parses + scores comparably.** Replay one historical eval cycle from `skills-resources/loops/*/evals/` against the refactored output. If scores diverge meaningfully without an intentional rubric change, the contract drifted silently — diagnose before shipping.

5. **Cross-skill learning propagation tagging** (if `experience/` is wired per Phase 1C): tag the artifact with the domain(s) that should pick it up on future cross-skill loads. Example: `tags: [pricing, content]` on a pricing-page brief means any content-or-pricing skill running next will see it surfaced.

**Gate 7 (added to acceptance criteria):** artifact graph hardening must pass before ship. See [`05-acceptance.md`](./05-acceptance.md) Gate 7.

**Failure mode this prevents:** the chain rotting silently — artifacts produced with stale frontmatter, downstream skills reading paths that drifted, eval loops scoring against shifted targets. The refactor is the cheapest moment to retrofit provenance; doing it later is a separate sweep.

---

## Step 8 — Post-refactor validation

Run the harness on the same 3 fixtures, now against the refactored SKILL.md.

```bash
bun meta-skills/scripts/harness/runner.ts --skill <name> --input .agents/skill-artifacts/meta/records/harness/inputs/<skill>-minimal.md
# (repeat for standard, stretch)

bun meta-skills/scripts/harness/diff.ts --skill <name>
```

The diff command compares pre-refactor vs. post-refactor. **Must show:**

- ✅ Default token load DOWN (target: ≥30% reduction)
- ✅ Critic gates with <30% ROI REMOVED
- ✅ **Contract hashes UNCHANGED** (unless intentional, atomic with downstream eval skill update)
- ✅ Side-by-side output diffs ready for blind operator review

If any of the above fails → fix or revert. Do not ship.

Update [`progress.md`](./progress.md): skill status → `validated`.

---

## Step 9 — Blind operator diff

The hard quality gate. See [`05-acceptance.md`](./05-acceptance.md) for the full procedure. Summary:

- Operator reviews pre/post outputs WITHOUT knowing which is which
- Operator scores both 1–5 on the dimensions relevant to the skill
- Refactored version must score ≥ baseline on every dimension AND ≥ baseline overall

If operator says "the new one is worse," it's worse. No appeals. Revert and re-attempt with the failure mode documented in [`progress.md`](./progress.md).

---

## Step 10 — Ship

Atomic commit pattern (per `agent-skills/CLAUDE.md` git workflow):

1. Inside the submodule:
   ```bash
   cd <stack>-skills
   git checkout main && git pull
   git add skills/<name>/
   git commit -m "refactor(<name>): body-diet to <N> lines, lazy-load refs, <other changes>"
   git push
   ```

2. Bump the per-stack `plugin.json` version + add `CHANGELOG.md` entry per `RELEASING.md`. Use `docs-writing` skill release-notes mode if helpful.

3. Cut a GitHub Release on the stack repo with the CHANGELOG entry.

4. Inside the umbrella (agent-skills root):
   ```bash
   cd ..
   git add <stack>-skills
   git commit -m "Bump <stack>-skills to <short-sha>: refactor <name>"
   bun scripts/bump-marketplace.ts patch "Refactor <name>: body-diet + lazy refs"
   git add .claude-plugin/marketplace.json README.md
   git commit -m "Bump marketplace version for <name> refactor"
   git push
   ```

5. Update [`progress.md`](./progress.md): skill status → `shipped`. Append before/after numbers.

**Failure mode this prevents:** stale umbrella pointer; users not seeing the refactor in `/plugin marketplace update`; CHANGELOG drift.

---

## Rollback procedure

If a regression is discovered AFTER ship (operator notices in production use):

1. Revert the skill commit inside the submodule: `git revert <sha> && git push`
2. Bump the stack version (patch) with a CHANGELOG entry calling out the revert
3. Bump the umbrella pointer
4. Bump the marketplace version
5. Update [`progress.md`](./progress.md): skill status → `reverted`. Document the failure mode under the decision log.
6. Open a new fixture in `.agents/skill-artifacts/meta/records/harness/inputs/<skill>-regression-N.md` capturing the input that exposed the regression
7. Retry the refactor with the new fixture in the corpus

Don't be precious. A revert with documentation is success. A "we'll fix it next time" without revert is technical debt.

---

## Anti-patterns to avoid mid-refactor

- **Refactoring 2+ skills in parallel within the SAME stack.** A single stack agent works one skill at a time end-to-end. Cross-stack parallelism (different submodules, different agents) is now the default under the staggered topology — see [`../README.md`](../README.md) "Phase 2 — Staggered parallel execution" for the coordination rules.
- **Editing body and refs in the same commit when the body change was supposed to be "just routing."** If body lines went down because procedure moved to a ref, the ref content should be unchanged from what was extracted. New ref CONTENT is a separate commit.
- **Loosening the artifact contract to enable a "cleaner" refactor.** If the contract change is real, do it atomically with the downstream eval skill update. Otherwise leave it alone.
- **Skipping the blind operator diff because "the diff command shows it's the same."** The diff command shows machine-comparable shape; blind review catches subtle quality drift the machine can't see.
- **Adding new functionality during the refactor.** This is body-diet only. New features are a separate workstream.
