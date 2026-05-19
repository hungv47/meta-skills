# Stack — Meta-Skills

**Repo:** `meta-skills/`
**Skills:** 7
**Total body lines (baseline):** 3,166
**Average body lines:** 452
**Refactor phase:** Phase 3 (after harness build in Phase 1 and meta audit in Phase 2)
**Order rationale:** Foundational — feeds every other stack. Small surface (lowest blast radius if pattern fails). `eval-loop` is canary because it owns the artifacts↔evals contract.

---

## Refactor order

Locked. Don't reorder without operator approval.

| # | Skill | Body lines | Classification | Why this slot |
|---|---|---|---|---|
| 1 | **eval-loop** | 269 | structural | Smallest body, validates pattern doesn't break the simplest case. Owns artifacts↔evals contract — best canary. |
| 2 | **cleanup-artifacts** | 440 | structural | Procedure-heavy, low creative ambiguity. Tests procedure-extraction pattern. |
| 3 | **orchestrate-meta** | 399 | router | Should end up THINNEST (target ≤150 lines). Validates router pattern. |
| 4 | **agents-panel** | 382 | structural | Standalone debate/poll, well-defined contract. |
| 5 | **fresh-eyes** | 503 | structural | Review skill, has its own critic — careful with critic-on-critic ROI. |
| 6 | **task-breakdown** | 477 | structural | Procedure-heavy with 4 specialized refs already. Test of ref consolidation. |
| 7 | **discover** | 696 | mixed (structural + creative) | **Largest body in stack.** Refactor with proven pattern. Mixed because cold-start question logic is structural; output framing is creative. |

---

## Per-skill notes

### 1. eval-loop (269 lines)

**Current state:**
- Body: 270 lines / 10,746 chars (already lean-ish)
- References: only `_shared/` (quality-feedback-protocol, eval-loop-spec, quality-dashboard-spec, shared-critic-rubrics, manifest-spec)
- Scripts: update-quality-dashboard.ts, manifest-sync.ts, append-loop-result.ts, scaffold-eval-loop.ts
- Agents: scope-guard, metric-designer, critic, loop-architect

**Baseline runs (2026-05-16, pre-refactor):**

| Run | Fixture | Path taken | Tool calls | Refs (chars) | Sub-agents | Artifacts | Wall |
|---|---|---|---:|---:|---:|---:|---:|
| 1 | minimal | fast (scaffold + return NEEDS_CONTEXT) | 9 | 1 (11,948) | 1 | 4 stubs (TBD) | 318s |
| 2 | standard | Layer-1 + Critic, skip Scope Guard | 17 | 4 (11,837) | 4 | 4 (program+context filled) | 249s |
| 3 | stretch | Layer-1 + Scope Guard + Critic, custom results.tsv | 23 | 2 (5,032) | 5 | 4 (status=blocked) | 177s |

Report: `.agents/skill-artifacts/meta/records/harness/baseline/eval-loop/baseline-report.md`. All 12 artifact contract hashes STABLE across the matrix.

**Refactor watch-outs (post-baseline, evidence-grounded):**

- **CRITICAL (unchanged):** this skill defines the contract that all eval-producing skills implement. Body-diet must preserve the artifact contract spec verbatim or update every downstream skill atomically.
- **Refs ARE already lazy.** Every ref loaded in 0–33% of runs, never 100%. The "Reference" section in the body is honestly lazy-loaded — no body-diet leak here. Don't move refs around; they're already correctly placed.
- **eval-loop-spec.md is 11,948 chars — larger than the SKILL.md body (10,746).** When loaded, it more than doubles context. Audit for duplication with the body's "Output", "Inputs", "Artifact Requirements", and "Pre-Dispatch" sections. If overlap exists, consolidate into the ref and shrink the body.
- **Sub-agent ROI is unproven.** All 4 agents fired across runs (scope-guard in deep only). The harness's USE rate doesn't measure output-changed-main-thread (v0.2 work). Before dropping any agent, run the Gate-3 blind-diff per `05-acceptance.md`. Best candidates for ROI scrutiny: scope-guard (fired only in deep — does its boundary check materially change Critic's verdict?) and the Layer-1 split (would a single "loop-designer" agent producing both contract + measurement plan be equivalent?).
- **Pre-Dispatch section is heavy.** ~30 lines covering manifest read, warm-start template, cold-start question bundle. Cold-start bundle could move to `_shared/cold-start-questions.md` (cross-skill canonical). Warm-start template could move to `_shared/warm-start-template.md`.
- **The 5-gate "Critical Gates" preamble is non-negotiable** (load-bearing safety). Keep verbatim.
- **The "Output" code block** (the directory tree) and the **"Artifact Requirements" frontmatter block** are contract — keep verbatim; cite from `_shared/eval-loop-spec.md` only if the spec contains the same content.

**Measurement gap discovered:**
- The harness records `mode_resolved` from the marker, which defaults to `standard` when `--mode` is omitted. All 3 baseline runs are labeled `standard` even though they exercised different complexity paths. Diff partition needs to use `--by-notes` substring or `fixture_kind` field, not `mode_resolved`. Documented for v0.2 harness work.
- Session-cache effect: run 3 shows only 2 refs loaded because agent files from run 2 stayed in conversation context (the agent didn't Read them again). Cold-start ref counts will be higher than baseline shows. Note in any cross-session comparison.

**Body target:** 200 lines (already close — needs ~25% body trim).

**Trim candidates (concrete):**
- Pre-Dispatch warm/cold start blocks → `_shared/` (~25 lines)
- Output code blocks duplicated in eval-loop-spec.md → cite ref (~15 lines if duplication confirmed)
- Inline shell snippets in body → keep (operators reference them) but check formatting density

**Fixtures (committed at `.agents/skill-artifacts/meta/records/harness/inputs/eval-loop-{minimal,standard,stretch}.md`):**
- minimal: `Scaffold an eval loop for tracking my landing page conversion rate.`
- standard: TikTok 6-week 3-sec hold rate loop with 3 metrics + 1 upstream artifact ref
- stretch: Q3 launch cross-platform (TikTok + Reels) coordination loop, 5 upstream artifacts, custom results.tsv schema, hard pre-launch positioning constraint

**Expected outcome (unchanged):** smallest refactor in meta. If THIS skill can't get to ≤200 lines without regression, our targets are wrong and the whole protocol needs adjustment. Use this as the protocol's reality check.

---

### 2. cleanup-artifacts (440 lines)

**Current state:**
- Body: 441 lines / 22,299 chars (~5,575 tokens default load — HIGH)
- References: `cleanup-rules.md` (246 lines / ~11,900 chars), `_shared/pre-dispatch-protocol.md`, `_shared/manifest-spec.md`
- Agents: `cleanup-runner.md` (319 lines) — documented as the single execution agent
- Scripts: 5 .ts files inside `cleanup-artifacts/scripts/` that are ALSO duplicated at `meta-skills/scripts/` (manifest-sync, scaffold-eval-loop, etc.) — flag for source-of-truth audit
- Classification: structural (procedural classification work)

**Baseline runs (2026-05-16, pre-refactor):**

| Run | Fixture | Path taken | Tool calls | Refs (chars) | Sub-agents | Artifacts | Status | Wall |
|---|---|---|---:|---:|---:|---:|---|---:|
| 1 | minimal (single subdir dry-run) | NEEDS_CONTEXT short-circuit (manifest missing + scope nonexistent) | 5 | 0 | 0 | 1 | NEEDS_CONTEXT | 50s |
| 2 | standard (full dry-run) | Classify + critic spot-check + report | 7 | 1 (11,904 — `cleanup-rules.md`) | 0 | 1 | DONE | 75s |
| 3 | stretch (30d threshold + excludes + experience write-back) | Classify + experience write-back; critic SKIPPED (0 non-KEEP candidates) | 7 | 1 (4,666 — `cleanup-rules.md` partial, session-cache hit) | 0 | 2 | DONE | 60s |

Report: `.agents/skill-artifacts/meta/records/harness/baseline/cleanup-artifacts/baseline-report.md`. All 4 artifact contract hashes STABLE.

**Refactor watch-outs (post-baseline, evidence-grounded):**

- **`cleanup-runner.md` (319 lines) is NEVER loaded across all 3 runs (under harness telemetry).** The 3 run JSONs show `refs_read_in_order` with zero entries for `cleanup-runner.md` — `[]` on run 1, only `cleanup-rules.md` on runs 2 + 3. The SKILL.md body inlines the runner's procedure verbatim (Execution Flow at lines 170–183, Confirmation Gate at 226–251, Critical Safety Rules at 256–266 — all duplicating cleanup-runner.md's Steps 1–9). The orchestrator has no reason to Read the agent file because the body already contains the procedure. **Caveat:** harness measures `Read` tool events only. If the Skill tool framework auto-loads `agents/*.md` files at skill-invocation time without going through Read, the harness would not see it — verify before deletion (run cleanup-artifacts once with debug instrumentation, or grep the skill-runner internals for any `agents/` auto-include). **Refactor decision:** either (a) delete `cleanup-runner.md` and remove all SKILL.md cites to it, or (b) actually dispatch via Agent tool (would require adding Agent to `allowed-tools`, currently `Read Grep Glob Bash Edit`). Recommendation: (a) — single-agent skills shouldn't have a separate "agent" file; the orchestrator IS the agent.
- **`_shared/pre-dispatch-protocol.md` and `_shared/manifest-spec.md` are NEVER loaded (under harness telemetry — same caveat as above).** SKILL.md lines 105–162 inline the full warm-start + cold-start templates that `pre-dispatch-protocol.md` already specifies, so the cite at line 107 is dead-cite — the body re-teaches what the ref teaches. Run 1's NEEDS_CONTEXT branch DID emit the Cold-Start question bundle, proving the procedure was followed; it just was followed from-body, not from-ref. Trim target confirmed: move templates to `_shared/` and keep only the cite + skill-specific dimensions in the body. Same body-duplication likely applies to `manifest-spec.md` cite; spot-check the body for manifest-schema duplication.
- **Body 441 lines is HIGH for a single-agent procedural skill.** Default load ~5,575 tokens before any ref reads. Strong body-diet target. Concrete trim candidates:
  - The full Pre-Dispatch warm/cold-start templates (~50 lines) — extract to `_shared/cold-start-questions.md` (cross-skill canonical with eval-loop / discover) and cite
  - The "Worked Example" section (~50 lines) — examples belong in `references/`, not body
  - The "Report Template" markdown block (~55 lines) — also reference material, not body
  - The "Confirmation Gate" example pseudo-output (~25 lines) — cite cleanup-rules.md or move to runner agent (if kept)
- **`scripts/` duplication — sync-generated copies, NOT byte-identical.** `cleanup-artifacts/scripts/` contains 5 .ts files mirroring `meta-skills/scripts/` (manifest-sync, scaffold-eval-loop, etc.). The skill-packaged copies are produced by `scripts/sync-skill-support.mjs` at the umbrella root — each carries a `// GENERATED SUPPORT FILE. Do not edit here. Run \`node scripts/sync-skill-support.mjs\` from the agent-skills repo root.` header and the only diffs are (a) that header and (b) `meta-skills/references/X.md` → `references/_shared/X.md` path-rewrites for self-contained `npx skills add` installs. Canonical source: `meta-skills/scripts/`. **Refactor decision:** this is intentional packaging — don't prune. Optional improvement: add a `cleanup-artifacts/scripts/README.md` pointer that says "generated by sync-skill-support.mjs; edit the canonical source at `meta-skills/scripts/`" so the next auditor doesn't re-flag the duplication.
- **HARD-NEVER list assumes `roadmap.md` / `tasks.md` exist.** Tested project has neither. Documentation should say "if present" so the runner doesn't imply they're missing files.
- **Default scope excludes `skills-resources/loops/`.** Operators reasonably mention loop scaffolds as "clutter" but the default scope misses them. **Refactor decision:** either expand default scope to walk both paths when both exist, OR document the two-scope pattern.

**Behavior findings (8 watch-outs surfaced by the skill's own classification work — already captured in run 2 + run 3 reports, listed here for refactor consideration):**

1. **ORPHAN over-classification on harness JSON.** `manifest-sync.ts` indexes `*.md` only; harness JSON output (every run produces a `.json`) is intentionally outside the manifest. Current rule ("no manifest entry → ORPHAN") flags every harness JSON as ORPHAN even when it's the canonical output of an active program. Fix: carve out `.agents/skill-artifacts/meta/records/harness/**/*.json` from the ORPHAN rule, OR extend manifest-sync to index `.json` with a `kind: run-record` carve-out.
2. **Slug-only ULID matches are HIGH-signal but the rule downgrades them to "potential reference."** Zero full-path matches but 6 slug-only matches (run-id ULID substring) in a single scan — ULIDs have very low collision risk, so a match is almost-certainly a real reference. Add confidence axis to slug matches based on entropy (ULIDs and ≥8-char kebab-case = full-signal; common words = low-signal).
3. **HARD-NEVER list assumes session anchors exist.** See above watch-out.
4. **Default scope excludes `skills-resources/loops/`.** See above watch-out.
5. **Experience write-back is a SIDE EFFECT that fires on every invocation including `--dry-run`.** Stretch run wrote `.agents/experience/technical.md` despite `--dry-run` mode. Either defer experience writes until `--apply` succeeds, OR document explicitly that experience writes happen regardless of mode.
6. **Excludes apply at classification, not at walk.** Report should distinguish "didn't see it" from "saw + KEEP-by-exclusion" so operators have an accurate count of what's actually in scope.
7. **Threshold knob has no effect on young artifact trees.** Cosmetic finding — not a bug, but the stretch fixture's "30d threshold" was a no-op in this 2-day-old tree. No refactor action.
8. **No `--exclude` CLI flag for one-off runs.** Excludes come only from `.agents/experience/technical.md`. To exclude something for just this run, the operator has to persist it then plan to clean it up. Add `--exclude <pattern>` for run-scoped exclusion.

**Body target:** ≤200 lines. Realistic given the trim candidates above (Pre-Dispatch templates, Worked Example, Report Template, Confirmation Gate pseudo-output all go to refs).

**Fixtures (committed at `.agents/skill-artifacts/meta/records/harness/inputs/cleanup-artifacts-{minimal,standard,stretch}.md`):**
- minimal: single subdir dry-run (`.agents/skill-artifacts/meta/sketches/`) — exercised NEEDS_CONTEXT branch
- standard: full `.agents/skill-artifacts/` dry-run default threshold — exercised full classify + critic spot-check
- stretch: full dry-run + 30d threshold + 3 excluded paths + experience write-back — exercised excludes + experience side-effect (NOT the `--apply` confirmation flow, which requires interactive operator turns and doesn't compose with a measurement run; that branch stays untested in baseline)

---

### 3. orchestrate-meta (399 lines)

**Current state:**
- Body: 399 lines (for a ROUTER, this is too much)
- References: `workflow-graph.md` + `_shared/`
- Classification: pure router — should be the thinnest in the stack

**Refactor watch-outs:**
- A router's body should be: decision tree → pick sub-skill → invoke. Anything else is bloat.
- The workflow-graph belongs in `workflow-graph.md`, not in body.
- If body still has "how to invoke each sub-skill" instructions — that's per-skill knowledge that the sub-skill itself should own.

**Body target:** ≤150 lines.

**Fixtures needed:**
- minimal: "help me plan X" (one-domain meta task)
- standard: "I have a bug + need to decide priorities" (multi-skill chain)
- stretch: full meta workflow across discover → diagnose → prioritize → task-breakdown

**Side-effect:** if this refactor goes well, it establishes the pattern for `orchestrate-product`, `orchestrate-research`, `orchestrate-marketing` — all 3 should be near-identical structure post-refactor.

---

### 4. agents-panel (382 lines)

**Current state:**
- Body: 382 lines
- References: only `_shared/`
- Classification: structural (well-defined debate/poll modes)

**Refactor watch-outs:**
- Two modes (debate, poll) — each could be a sub-ref loaded by branch.
- Standalone vs. invoked-as-sub-routine — the body should handle the dispatch but the mode-specific procedures move to refs.
- This skill is invoked BY other skills as a sub-routine — its output contract matters for callers. Document the contract explicitly.

**Body target:** ≤200 lines.

**Fixtures needed:**
- minimal: 2-agent debate on a tiny question
- standard: 5-agent poll on a 1-paragraph problem
- stretch: 7-agent debate with explicit dissent rounds

---

### 5. fresh-eyes (503 lines)

**Current state:**
- Body: 503 lines
- References: only `_shared/`
- Classification: structural (post-implementation review with defined rounds)

**Refactor watch-outs:**
- Auto-triggers for security/data-mutation code — that trigger logic stays in body (safety gate).
- Max 2 rounds enforced — that loop logic stays in body.
- The CHECKLIST of what to review goes to a ref (anti-pattern lists, common-failure catalog).
- **Watch:** this skill has its OWN critic role implicitly (it IS a critic). Don't add a critic on top of a critic without strong ROI evidence — high risk of theater.

**Body target:** ≤200 lines.

**Fixtures needed:**
- minimal: review a single function change
- standard: review a full PR diff (~200 lines)
- stretch: review a security-sensitive change that should auto-trigger deep review

---

### 6. task-breakdown (477 lines)

**Current state:**
- Body: 477 lines
- References: 4 specialized refs already (`acceptance-criteria.md`, `dependency-patterns.md`, `execution-protocol.md`, `sizing-examples.md`) + `_shared/`
- Classification: structural

**Refactor watch-outs:**
- Has 4 refs already — good structure. Most likely failure mode: body re-explains what refs already say. Diet aggressively.
- Specifically: if `acceptance-criteria.md` exists, body should NOT teach how to write acceptance criteria. It should say "see acceptance-criteria.md."
- Sizing examples are inline and in `sizing-examples.md`? Check duplication.

**Body target:** ≤180 lines (refs are doing the heavy lifting).

**Fixtures needed:**
- minimal: break down a single feature into tasks
- standard: break down a system-architecture artifact into tasks with dependencies
- stretch: break down a multi-feature roadmap into a sequenced backlog

---

### 7. discover (696 lines) — LAST

**Current state:**
- Body: 696 lines (largest in meta stack)
- References: `example-contracts.md`, `question-bank.md`, `operator-playbooks/` (folder)
- Classification: mixed — cold-start questioning is structural; framing/synthesis is creative

**Refactor watch-outs:**
- This is the BIGGEST body to cut. Save it for last — apply patterns proven on the prior 6 skills.
- Has 3 ref kinds already (question-bank, example-contracts, operator-playbooks) — likely refs are RIGHT but body duplicates them.
- The `question-bank.md` is 412 lines — verify it loads LAZILY (only on cold-start branches), not always.
- `operator-playbooks/` folder suggests already-good branching — body should ROUTE to a playbook per use-case, not embed playbook logic.
- Creative side: the synthesis output (the spec or scope contract) needs the looser-rubric treatment per [`04-protocol.md`](./04-protocol.md) Step 3.

**Body target:** ≤250 lines (mixed classification gets slightly higher ceiling).

**Fixtures needed:**
- minimal: 3-question scoping for a clear request
- standard: ~10-question discovery for a moderately ambiguous request
- stretch: full multi-round interview for a cold-start with no prior artifacts

**Expected outcome:** the largest absolute body-line reduction in the program (~450 lines saved if we hit target). Validates that the protocol scales to the hardest cases.

---

## Phase 2 — Meta audit (before any refactor)

After harness is built in Phase 1, run audit pass on all 7 skills:

```bash
for skill in eval-loop cleanup-artifacts orchestrate-meta agents-panel fresh-eyes task-breakdown discover; do
  for kind in minimal standard stretch; do
    bun meta-skills/scripts/harness/runner.ts --skill $skill --input .agents/skill-artifacts/meta/records/harness/inputs/$skill-$kind.md
  done
  bun meta-skills/scripts/harness/report.ts --skill $skill > .agents/skill-artifacts/meta/records/harness/baseline/$skill-report.md
done
```

Update the "Per-skill notes" sections above with actual baseline numbers. THEN start refactoring in order.

---

## Shared-refs introduced in meta refactor

The meta refactor establishes shared refs that propagate to all 4 stacks via sync mechanism:

- `references/_shared/mode-resolver.md` — canonical lives in `orchestrate-meta`, syncs everywhere
- `references/_shared/anti-sycophancy.md` — canonical lives in `agents-panel` (the skill whose existence depends most on it), syncs everywhere
- `references/_shared/artifact-contract-template.md` — canonical lives in `eval-loop`, syncs to all brief-producing skills

Before Phase 3 ships its first refactored skill, the sync mechanism MUST be verified working (per [`02-constraints.md`](./02-constraints.md) section 2). If no sync script exists, write it as part of Phase 1 wrap-up.

---

## Stack completion criteria

Meta stack is "done" when:

- [ ] All 7 skills shipped at status `shipped` in [`progress.md`](./progress.md)
- [ ] Average body lines for meta stack ≤200 (down from 452, ~55% reduction)
- [ ] All 7 skills have 3 fixtures committed
- [ ] All 3 shared refs canonical sources established and syncing
- [ ] No critic-gate retained without measured ROI ≥30%
- [ ] `meta-skills/CHANGELOG.md` has entries for each refactor
- [ ] `meta-skills` GitHub Releases published per skill (or one batched per the cadence in `RELEASING.md`)
- [ ] Umbrella `marketplace.json` bumped (likely minor — significant change)
- [ ] Handoff log entry: "Meta stack refactor complete"
