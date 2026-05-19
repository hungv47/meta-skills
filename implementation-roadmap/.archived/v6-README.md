# Skill Stack v6 — Refactor + Chain Build-out (Merged Program)

**Mission:** evolve the 35-skill stack into a leaner, deeper, more connected system — by (a) trimming default-loaded tokens via body-diet + lazy refs, (b) hardening the artifact↔eval chain that connects skills into a measurable system, (c) layering in 15 quality upgrades + 9 new skills + 11 eval-infrastructure pieces, and (d) making every skill a teachable playbook humans can learn from.

**Status (2026-05-19):** Refactor track **retired to [`done/v6-refactor-2026-05-19/`](./done/v6-refactor-2026-05-19/)**. 35/35 skills refactored + pushed to `refactor/v2.0` branch (aggregate -55.6% body lines, 14,364 → 6,376). Gate 1 PASS on 105/105 fixtures (static+structural); 10/14 marketing skills runtime-validated. Branch sits unmerged on remote — not pushed to `main`, not released. 6 of 7 Phase 3 items (propagation tagging, experience seed, release prep) intentionally deferred — will keep improving from here. `execution-evaluation/` catalog of 46+ open ideas stays active.

---

## How to resume — read in this order

Any agent (fresh Claude, teammate, future-you) picking this up MUST:

1. **This README** — program root.
2. **[`done/v6-refactor-2026-05-19/progress.md`](./done/v6-refactor-2026-05-19/progress.md)** — retired refactor track. Final state, decision log, what shipped.
3. **[`done/v6-refactor-2026-05-19/01-why.md`](./done/v6-refactor-2026-05-19/01-why.md)** through **[`05-acceptance.md`](./done/v6-refactor-2026-05-19/05-acceptance.md)** — refactor rationale + protocol + acceptance gates (archived, still readable).
4. **[`execution-evaluation/ideas.md`](./execution-evaluation/ideas.md)** + **[`execution-evaluation/sources/briefs.md`](./execution-evaluation/sources/briefs.md)** — open idea catalog (46+ items). Reference for what's NOT yet built.
5. **[`canonical-paths.md`](./canonical-paths.md)** — still-active 57-artifact inventory + lifecycle taxonomy.
6. Archived stack-by-stack notes: **[`done/v6-refactor-2026-05-19/stacks/`](./done/v6-refactor-2026-05-19/stacks/)** and full handoff log at **[`done/v6-refactor-2026-05-19/handoff.md`](./done/v6-refactor-2026-05-19/handoff.md)**.

---

## Locked decisions (2026-05-16, from operator)

These are not up for re-litigation in a fresh session. If you disagree after reading the rationale, raise it with the operator before deviating.

| # | Decision | Why |
|---|---|---|
| 1 | **Quality bar: extremely high** — blind operator diff is the hard gate, not critic-score parity | Critic-score is gameable; blind review catches subtle quality drift |
| 2 | **Audit then refactor, skill by skill within each stack** | Atomic units of risk |
| 3 | **Harness measures, vibes don't** | All cost / contract / ROI claims need data |
| 4 | **Proactive mode-resolution + user confirm** | Lower friction than `--fast` flagging; safer than defaulting deep |
| 5 | **Creative skills get looser scaffolding** | Strict rubrics on creative skills produce house-style slop |
| 6 | **Artifacts ↔ evals contract is sacred** | Frontmatter / section changes must be atomic with downstream eval updates |
| 7 | **Self-containment via `_shared/` duplication** | `npx skills add --skill X` ships only X's folder |
| 8 | **NEW — Merged scope** (2026-05-16): refactor + execution-evaluation are one program | Single root prevents 4 parallel agents diverging on the same chain |
| 9 | **NEW — Playbook voice via refs, not body bloat** (2026-05-16): SKILL.md bodies stay lean (router); team wisdom lives in `references/playbook.md` and supplemental refs with load-class tags | Preserves cost win, makes the stack a teachable curriculum |
| 10 | **NEW — Staggered parallel execution** (2026-05-16): meta + product stack agents run in parallel after Phase 1 ships; research + marketing follow once protocol is stress-tested at 2x | Bounded coordination risk; double throughput; revertable to sequential if messy |

---

## Scope — the 78 work items

The merged program covers four parallel tracks:

| Track | Items | Source |
|---|---|---|
| **A. Body diet + chain hardening** | 35 skills refactored (body trim, lazy refs, playbook refs, artifact-graph audit) | [`refactor/`](./refactor/) |
| **B. Quality upgrades to existing skills** | 15 items: copywriting (6), ad-copy (6), icp-research (3) | [`execution-evaluation/briefs.md`](./execution-evaluation/briefs.md) Layer 2 |
| **C. New skills** | 9 new: ai-seo, programmatic-seo, asset-produce, social-publish, video-produce, ad-eval, content-eval, campaign-eval, extract-service-layer | briefs.md Layer 3 |
| **D. Eval infrastructure + code quality + external** | 19 items: experience/, context file, dashboard, provenance frontmatter, critic introspection, fresh-eyes upgrades, Pangram, human-review gate | briefs.md Layers 1, 4, 5, 6 |

Total: 78 items. Track A is the largest (35); Track D is the most cross-cutting.

---

## Phase plan

### Phase 0 — Restructure (THIS PHASE, ~1 session)

Single root. Merged scope reflected. Paused work flagged.

- [x] Master README at `implementation-roadmap/README.md` (this file)
- [ ] `refactor/progress.md` updated: merged scope, paused cleanup-artifacts, stagger topology
- [ ] `refactor/04-protocol.md` updated: remove no-parallel anti-pattern, add playbook-refs step, add chain-hardening lever

### Phase 1 — Foundational, sequential (3-4 sessions)

These produce the shared primitives the parallel stack agents will call. Doing them first is what *makes* parallel safe.

**1A. Shared-scaffolding sprint** — lock canonical sources + verify sync:
- `_shared/mode-resolver.md` (canonical: `meta-skills/skills/orchestrate-meta/`)
- `_shared/anti-sycophancy.md` (canonical: `meta-skills/skills/agents-panel/`)
- `_shared/artifact-contract-template.md` (canonical: `meta-skills/skills/eval-loop/`)
- `_shared/thin-critic-rubric.md` (canonical: `marketing-skills/skills/copywriting/`)
- `_shared/playbook-ref-template.md` (NEW canonical: `meta-skills/skills/orchestrate-meta/`) — the structural template every skill's `references/playbook.md` follows
- Verify `scripts/sync-skill-support.mjs` works bidirectionally

**1B. Canonical artifact graph** — one short file at `implementation-roadmap/canonical-paths.md`:
- Inventory every artifact path produced by every skill
- Reconcile against `agent-skills/CLAUDE.md` lifecycle taxonomy
- **Fix** `.agents/experience/` vs `skills-resources/experience/` split (briefs.md §1.3)
- Reconcile `brand/`, `research/`, `_biz-ops/brand/conquis/` umbrella-vs-project ownership
- Define `provenance:` frontmatter standard (briefs.md §4.6)
- Mandatory input to every stack agent in Phase 2

**1C. Layer-1 context infrastructure**:
- 12-section product-marketing context file schema + acquisition script (briefs.md §1.1)
- Create `experience/` directory at canonical location from 1B (briefs.md §1.2)
- Add "before starting" check pattern to skill template — adopted by each skill during Phase 2 refactor

**1D. Layer-4 eval-plumbing specs** (formats/contracts only; per-skill wiring in Phase 2):
- Rubric-on-disk pattern (§4.1) — generalizable template
- Quality dashboard spec (§4.2)
- Critic-introspection protocol (§4.3)
- Promotion criteria for experience/ (§4.4)
- Cross-skill learning propagation tagging (§4.5)
- Rubric-revision triggers (§4.10)
- Autoresearch loop spec (§4.11)

**1E. Re-canary on `cleanup-artifacts`** — apply the merged protocol (1A+1B+1C+1D primitives, playbook-refs pattern, chain hardening) to validate end-to-end before unleashing parallel stack agents.

### Phase 2 — Staggered parallel execution (~6-10 sessions)

**Wave 1:** meta-skills agent + product-skills agent run in parallel after Phase 1 closes.
- Meta (6 remaining: cleanup-artifacts already done in 1E, then orchestrate-meta, agents-panel, fresh-eyes, task-breakdown, discover + 1 new layer-4 item: critic-consensus mode)
- Product (6 skills + 1 new skill: extract-service-layer + Layer-5 fresh-eyes upgrades + code-cleanup structural extraction)
- Validation: cross-stack contract collisions (none expected — meta and product don't share artifact contracts), shared-ref sync stability (the real test of 1A's sync mechanism).

**Wave 2:** research-skills agent + marketing-skills agent launch after Wave 1 ships (or sooner if Wave 1 proves clean at 50% completion).
- Research (8 skills + Layer-2 icp-research upgrades + eval-for-research-artifacts)
- Marketing (14 skills + Layer-2 copywriting/ad-copy upgrades + 8 new skills + Pangram + human-review gates)
- **Mandatory coordination at cross-stack boundaries:**
  - `short-form-brief` (mkt) ↔ `short-form-research` (research) ↔ `short-form-eval` (research) — atomic 3-skill batch; both agents pause and coordinate
  - All `orchestrate-*` skills follow the meta template (proven in Wave 1)

**Per-stack agent operating rules** (hard, non-negotiable):
1. Run the exact eval-loop-proven 10-step protocol (`refactor/04-protocol.md`)
2. Use the locked shared refs from 1A (don't re-canonicalize)
3. Use the artifact paths from `canonical-paths.md` (don't redecide)
4. Use the Layer-1 context contract from 1C
5. Apply the playbook-ref pattern (see below) — don't bloat SKILL.md bodies
6. **Stop and coordinate** at cross-stack contract boundaries
7. Commit in submodule; signal root coordinator for umbrella pointer bump
8. End session with a `refactor/handoff.md` entry following the template

### Phase 3 — Final integration (~2-3 sessions)

- Cross-skill learning propagation wiring (briefs.md §4.5)
- Pangram integration (§6.1) + post-humanize regression generalization (§4.7)
- Human-review gate on production skills (§6.2)
- Full-stack regression sweep via harness
- Seed `experience/` from any historical loop data
- CHANGELOGs + GitHub Releases per stack + marketplace MINOR or MAJOR bump
- Move `implementation-roadmap/` → `implementation-roadmap/done/v6-<date>/` as durable documentation

---

## The playbook-ref pattern (locked decision #9)

**Problem:** if SKILL.md bodies stay router-thin, humans can't read them as a curriculum. If they bloat to include team wisdom, cost wins evaporate.

**Solution:** body stays lean. Curated team wisdom lives in supplemental references with explicit load-class tags so agents load by need and humans read by choice.

```
skills/<name>/
├── SKILL.md                    # body: contract + decision tree + routes + safety gates + status
└── references/
    ├── playbook.md             # NEW — curated wisdom: why this skill exists, methodology, principles, history
    ├── examples/               # worked examples for triangulation
    │   └── example-N.md
    ├── procedures/             # branch-specific step-by-step (agent loads to execute)
    │   └── <branch>.md
    ├── anti-patterns.md        # critic load
    └── _shared/                # synced shared refs (mode-resolver, anti-sycophancy, etc.)
```

**Body pointers carry a load-class tag:**

| Tag | Meaning | When loaded |
|---|---|---|
| `[PLAYBOOK]` | Read to learn | Humans on cold-start; agents on cold-start if no playbook in conversation context yet |
| `[PROCEDURE]` | Load when branch fires | Per-invocation, branch-gated |
| `[EXAMPLE]` | Load when triangulating to target | When agent needs a concrete anchor |
| `[ANTI-PATTERN]` | Load when critic fires | At critique time only |

**Body line targets (now soft, not hard):**
- Structural: ≤200 lines (was hard target; cost is now the hard gate via harness)
- Creative: ≤300 lines (same)
- Routers: ≤150 lines (same)

If a body lands at 230 lines because the decision tree carries one-line "why this branch matters" annotations that make the skill teachable — **that's a good outcome.** The harness measures cost; let it gate.

**Anti-pattern:** never duplicate playbook wisdom in body. The body's job is to route; the playbook's job is to teach. If a body teaches, refactor the teaching into the playbook.

---

## Quality gates (unchanged from 05-acceptance.md)

A refactor ships when ALL pass:

- **Gate 1 (harness):** ≥30% default-load reduction, contract hashes unchanged, no <30% ROI critic retained
- **Gate 2 (eyeball):** every required section present, ordering preserved, no stub sections
- **Gate 3 (blind operator diff):** refactored scores ≥ baseline on every dimension across 2 of 3 fixtures
- **Gate 4 (contract integrity):** downstream eval skill runs without error, historical evals replay comparably
- **Gate 5 (self-containment):** `npx skills add --skill X` works end-to-end
- **Gate 6 (docs):** progress.md updated, CHANGELOG entry, GitHub Release, handoff log

NEW Gate 7 (chain hardening — added by the merge):
- **Gate 7 (artifact graph):** `produced_by:` + `lifecycle:` + `provenance:` frontmatter present and matches `canonical-paths.md`; contract block names every downstream consumer

---

## Cross-stack coordination map

The chain has these cross-stack contracts. Touch atomically:

| Contract | Producer | Consumer(s) | Coordination |
|---|---|---|---|
| `short-form-research` catalog | research/short-form-research | mkt/short-form-brief, research/short-form-eval | Wave-2 atomic 3-skill batch |
| `lp-brief` artifact | mkt/lp-brief | mkt/lp-eval | Within marketing — one agent owns both |
| `ad-copy` artifact | mkt/ad-copy | mkt/ad-eval (NEW), humanize as terminal pass | Within marketing |
| `copywriting` / `cold-outreach` artifacts | mkt | humanize (terminal pass) + content-eval (NEW) | Within marketing |
| `campaign-plan` | mkt | campaign-eval (NEW) | Within marketing |
| `icp-research`, `market-research` (canonical at `research/`) | research | every creative marketing skill | Read-only contract; preserve frontmatter strictly |
| `brand/BRAND.md` + `brand/DESIGN.md` | external (human-curated) | every creative marketing skill | Read-only; never overwrite |
| `_shared/*` synced refs | meta canonical | every stack | Phase 1A sync mechanism handles |

If any contract field needs to change mid-refactor: stop, raise to operator, coordinate atomically.

---

## Out-of-scope guardrails

If a thought drifts here, write it to `refactor/progress.md` "Deferred ideas" and keep moving:

- Renaming/merging/deleting existing skills (additions OK per Track C; removals require separate scope)
- Migrating to a different plugin format
- Touching `syncthis/` or `npx skills` CLI behavior
- Touching external (non-in-repo) skills (Impeccable, Vercel plugins, etc.) — per `agent-skills/CLAUDE.md` scope rule
- Auto-pushing during the program — operator-initiated only

---

## Resume checklist (use at session start)

- [ ] Read this README
- [ ] Read `refactor/progress.md` → know current phase + current skill in flight
- [ ] Read the latest entry in `refactor/handoff.md`
- [ ] Check `git status` in umbrella + relevant submodule — confirm clean tree before changes
- [ ] If starting per-skill refactor: read the relevant `refactor/stacks/<stack>.md`
- [ ] If starting Phase 1 work: read the matching brief in `execution-evaluation/briefs.md`
- [ ] End session with a `refactor/handoff.md` entry following the template
