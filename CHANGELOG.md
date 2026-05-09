# Meta Skills — Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning is [SemVer](https://semver.org/spec/v2.0.0.html) — major.minor.patch.

This file tracks stack-level releases. SKILL.md files describe current behavior; this file documents what changed and when.

---

## [3.1.2] - 2026-05-10

REB-4 ships: stack canonizes the `` ! `<cmd>` `` script-interpolation convention from the WorkOS Skills-at-Scale workshop, plus 3 retrofits inside `meta-skills/`. Slash-command bodies that previously asked Claude to "go figure out X" now embed deterministic shell output inline — no spin-up, no model-side variance, deterministic base instead of speculation.

### Added
- **`meta-skills/CLAUDE.md` — new §"Skill-Authoring Patterns" section** canonizing the `` ! `<cmd>` `` convention. Covers when to use (Pre-Dispatch context surfacing, state-detection prose, sub-agent prompt-building) and when NOT to (non-deterministic data, SKILL.md content read by sub-agents via Read tool, slow / side-effecting / unsafe commands, cross-platform-fragile flags). Worked example shows substitution semantics. Source: Skills at Scale workshop (Nick Nisi & Zack Proser, WorkOS DX). First entry under what's intended to be a growing skill-authoring patterns section.

### Changed
- **`cleanup-artifacts/SKILL.md` Pre-Dispatch §Warm Start** — manifest-snapshot placeholder replaced with two `` ! `find` `` interpolations (total artifact count + 90d-stale count) + one `` ! `git log` `` for manifest mtime. Operator no longer derives `[N artifacts, M stale, K orphan]` by hand.
- **`orchestrate-meta/SKILL.md` Step 1 Cross-Stack State Detection** — three interpolations land BEFORE the manifest read: artifacts-by-domain count via `find | awk | uniq -c`, top-level canonical-folder presence (research/brand/architecture) via shell loop, last 5 commits via `git log`. Free-standing disk snapshot even when manifest is stale or missing.
- **`fresh-eyes/SKILL.md` Pre-Dispatch §Warm Start** — `[N files / diff vs main]` placeholder replaced with `` ! `git log --oneline main..HEAD` `` (commits in range) + `` ! `git diff --stat main...HEAD` `` (file change summary). Diff range visible inline before reviewer dispatch.

### Notes
- All commands are macOS+Linux portable: `find` with `-name`/`-type f`/`-mtime` portable subset, `wc -l | tr -d ' '` to handle macOS leading-whitespace, POSIX `awk -F/`, `sort | uniq -c | sort -rn`, portable `git log` formats. No `stat -f`/`stat -c` (fragmentation), no GNU-only flags. All wrapped with `2>/dev/null || echo "..."` graceful fallback.
- **Skipped retrofits with rationale** (audit doc at `.agents/skill-artifacts/meta/records/2026-05-10-bang-backtick-retrofit-audit.md`):
  - **3 sibling orchestrate-* skills** (research/marketing/product) — structurally identical to orchestrate-meta. Re-entry condition = next-touch enrichment session in each stack. Lift the 3-line block from orchestrate-meta Step 1; same `find | awk | uniq -c` pattern. Avoids 4-stack ceremony for ~3-line additions per skill. Adversarial check ("real lift verified at ≥2 spots") already met by cleanup-artifacts + orchestrate-meta + fresh-eyes (3 spots).
  - **`cold-outreach`** — roadmap REB-4 named it as candidate but the adversarial check explicitly says "SKIP for skills that don't read deterministic data — this isn't a hammer." Cold-outreach signal-extraction is web-data (LinkedIn posts, GitHub activity, company news) — not deterministic local data. Bang-backtick would force-fit. Existing 7-question Cold-Start questionnaire is the right surface for prospect-signal collection.
- Slash-command interpolation only renders when invoked as `/<skill-name>`. Sub-agents that read these SKILL.md files via the Read tool see literal `! \`...\`` text — no execution. Each retrofit includes a trailing one-paragraph note pointing readers to `meta-skills/CLAUDE.md` §"Skill-Authoring Patterns" for semantics.

---

## [3.1.1] - 2026-05-10

REB-5 Wave 1 ships: `discover` gains explicit anti-sycophancy rules and an always-recommend rule. Body-only edit to `discover/SKILL.md` Communication Discipline section. The 5 BAD-vs-GOOD pushback patterns from REB-5a were already shipped in an earlier release; this patch closes the remaining gaps.

REB-1 (3.1.0) gave `discover` the *content* spine (operator-playbooks); REB-5 Wave 1 gives it the *posture*. Wave 2 (4-mode framework, mandatory output sections, idea-critic agent) gated on operator evaluation after ≥2 real Wave-1 sessions per the REB-5 risk plan.

### Changed
- **`discover/SKILL.md` (3.1.0 → 3.1.1)** — Communication Discipline section gains 3 named rules:
  - **Banned phrases** — verbatim list of 5 sycophantic hedges never to emit (`interesting approach` · `many ways to think about this` · `you might want to consider` · `that could work` · `I can see why you'd think that`). Closes REB-5a.
  - **Take a position on every answer** — codifies the "what evidence would change my mind" requirement. Two sentences mandatory: position + falsifier. If you can't name what would change your mind, your position isn't a position. Closes REB-5a.
  - **Always recommend while asking** — every AskUserQuestion (and equivalent chat-format question) must carry an LLM-recommended answer with a one-line reason. Asking without recommending is offloading thinking onto the user. Closes REB-5b. (Previously implicit in pacing bullets at line 257; now an explicit named rule.)

### Notes
- REB-5c / 5d / 5e (4-mode framework, mandatory artifact output sections, idea-critic agent) are Wave 2 — gated on operator running ≥2 real discover sessions with Wave 1 and deciding PROCEED / PARTIAL / SKIP per T61. Wave 2 has cross-skill coordination cost (mode framework affects orchestrate-meta routing; mandatory output sections affect downstream consumers like task-breakdown). Don't pay that tax until Wave 1 has earned it.
- Sources: `garrytan/gstack/office-hours` §Anti-Sycophancy Rules + §Pushback Patterns; `mattpocock/skills/skills/productivity/grill-me` ("For each question, provide your recommended answer").
- The 5 BAD-vs-GOOD pushback patterns named in REB-5a were already present in `discover/SKILL.md` lines 198-220 prior to this patch — this release does not add them, only the missing banned-phrases / take-position / always-recommend rules.

---

## [3.1.0] - 2026-05-09

REB-1 ships: `discover` gains a 9-doc operator-playbook reference catalog, and SKILL.md routes to it during Step 1 Context Gathering. Mirrors the `platform-intelligence/` pattern from `short-form-brief` — practitioner-grade frames with `last_verified` frontmatter, named-cohort sourcing, and explicit pushback patterns the skill cites by name.

The catalog gives `discover` a knowledge spine for pushing back from named playbooks ("the DTC $100M frame says X — your direction conflicts because Y") rather than asking generic interview questions. North star per stated direction: discover should act like the best business operator/CEO on the planet.

### Added
- **`discover/references/operator-playbooks/` — 9 new reference docs.**
  - **Operator-craft (load on every non-trivial discover invocation, regardless of domain — these are stance, not domain knowledge):**
    - `ceo-cognitive-patterns.md` (484 lines) — 18 named cognitive instincts (Bezos one-way/two-way doors · Grove paranoid scanning · Munger inversion · Jobs focus-as-subtraction · Horowitz people-first / wartime-vs-peacetime · Hastings talent density · Bezos 70%-info / regret minimization · Chesky/Graham founder-mode · Altman willfulness / leverage · Rams hierarchy-as-service / subtraction default · plus narrative coherence, courage accumulation, edge-case paranoia, design-for-trust). Each with named operator + cognitive move + when-it-fires + worked example + counter-cases. Source: `garrytan/gstack/plan-ceo-review`.
    - `yc-six-forcing-questions.md` (371 lines) — Q1-Q6 demand-reality framework (would-they-be-upset · what-they-do-now · name-the-actual-human · narrowest-wedge · observation-and-surprise · 3-year-essentialness) with smart routing by product stage (pre-product / has users / paying customers / pure infra) and intrapreneurship adaptation. Source: `garrytan/gstack/office-hours`.
    - `minimalist-entrepreneur.md` (389 lines) — 8 principles (Community First / Start Manual / Build As Little As Possible / Sell Before Scale / Spend Time Before Money / Profitability Goal / Grow At Speed Of Customers / Build The House You Want To Live In) + 8-question decision rubric + processize-before-productize thesis + red-flags / green-flags rubric (≥2 red OR <2 green → push back hard before generating alternatives) + Validated / Needs-more / Pivot verdict. Sources: `slavingia/skills/{processize,minimalist-review,validate-idea}`.
  - **Founder-domain (load on product-context match):**
    - `consumer-app-growth.md` (225 lines) — Channel sequencing $0→$50M with budget thresholds; marketing-before-building; 3-second consumer rule. Sources: Jibran (Lightreel, 60M views), Cali playbook-app-growth + playbook-influencer, Zach Yadegari.
    - `dtc-brand-100m.md` (210 lines) — TAM check ("water bottles, not hamster water bottles"); marketing = ≥30% of revenue; CAC/LTV first-purchase profitability; Meta-as-king (2026); 5+ year horizon. Source: Sean Frank (Ridge).
    - `b2b-saas-bootstrap.md` (207 lines) — Sales-led for B2B (not self-serve); EGC non-negotiable; warm-outbound-first; AEO + AI search; pricing-as-fastest-lever. Source: Yasser Elsaid (Chatbase, $9M ARR).
    - `second-time-founder-discipline.md` (222 lines) — Distribution-before-product; lawyer-first; ruthless feature-killing; no deck until asked 3x; term-sheet humility. Sources: Will Henry + Timon Zimmermann + Chip Actual commenters.
    - `pricing-defaults.md` (228 lines) — Opinionated no-free-tier prior with explicit carve-outs (early-stage feedback, freemium soft paywall, two-sided platforms, vocab/learning apps, free trials vs. permanent free tiers). Source: pie6k + comment thread.
    - `ai-era-discoverability.md` (155 lines) — Ship `/pricing.md`, `/docs.md`, content-negotiated `text/markdown` mirrors so LLM agents parse cleanly. Source: Zeno Rocha (Resend).

  Each doc carries: `last_verified: 2026-05-09` frontmatter, `sources` block with primary/secondary tier, opinionated rules with verbatim source quotes, counter-cases (carve-outs), worked Pushback Patterns (Trigger / BAD / GOOD / Source), Anti-Patterns with detection rules, and required Open Questions section. 90-day staleness flag rides the same pattern as `platform-intelligence/`.

### Changed
- **`discover/SKILL.md` (3.0.0 → 3.1.0)** — Step 1 Context Gathering now loads operator-craft frames on every non-trivial invocation (skipped only on Light-depth trivial scoping) and matches founder-domain frames against product-context via the trigger table. Step 6 Clarity Check gains a **playbook-citation self-check**: before asking "ready to build?", verify the recommendation cited at least one applicable frame when one was loaded. References section enumerates the new 9-doc catalog. `routing.consumes` adds `references/operator-playbooks/*.md`.

### Notes
- REB-1 entry in `.agents/skill-artifacts/meta/roadmap.md` (lines 666–807) drove this build. T45 (6 founder-domain), T46 (3 operator-craft), T47 (SKILL.md routing) all closed in this minor.
- North star per the roadmap: REB-1 is *content* (what discover loads); REB-5 (deferred to a separate Wave 1 / Wave 2 cycle) is *structure* (how discover loads and uses content). Together they form operator-grade discover. Either can ship first.
- Source-fetch caveat: `garrytan/gstack/{plan-ceo-review,office-hours}` SKILL.md files live at the repo root, NOT under `skills/`. Caveat captured for future re-verification work.

---

## [3.0.1] - 2026-05-09

Fresh-eyes review of v3.0.0 caught the symmetric gap to marketing-skills@4.0.0: the new skill was on disk but not in the plugin manifest.

### Fixed
- **plugin.json `skills` array was missing `cleanup-artifacts`** — installed copies of meta-skills@3.0.0 would not have surfaced the new skill (skill files on disk but not in the manifest). Added `./skills/cleanup-artifacts/` to the array. **Load-bearing fix.**
- `orchestrate-meta/references/workflow-graph.md` did not list cleanup-artifacts — the cross-stack orchestrator could not route users to it. Added a 5th process-skill catalog entry, an `process: cleanup` row in the Domain Classification Rules table, and updated "The 4 Process Skills" → "The 5 Process Skills". Also fixed stale `/start-X` reference in the anti-patterns section to `/orchestrate-X`.
- `meta-skills/CLAUDE.md` Process Flow diagram did not include cleanup-artifacts; v5 → v6 migration history entry added covering the orchestrate-meta rename + cleanup-artifacts introduction.
- plugin.json description updated to enumerate cleanup-artifacts; added `cleanup`, `hygiene` keywords.

### Notes
- The fresh-eyes report driving this patch is at `.agents/skill-artifacts/meta/records/2026-05-09-fresh-eyes-marketplace-2.0.0.md` (local-only).
- v3.0.0 was pushed remotely before these gaps surfaced. Anyone who ran `/plugin install meta-skills@3.0.0` would not have received `cleanup-artifacts` in the install. v3.0.1 corrects this.

---

## [3.0.0] - 2026-05-08

### BREAKING
- Renamed `start-meta` → `orchestrate-meta`. The skill scans existing artifacts and continues mid-pipeline; the orchestration role now reads explicitly in the slash command. No backward-compat alias — single-rev cutover.
- Update any `/start-meta` invocations in your workflows to `/orchestrate-meta`.

### Added
- New skill `cleanup-artifacts` — closes the long-open hygiene gap (T4/T6 in the stack roadmap). Single-agent meta-skill (standard budget) that audits the `.agents/` artifact tree and grooms it without ever deleting. Classifies every artifact as KEEP / STALE / ORPHAN / LEGACY / EPHEMERAL per `references/cleanup-rules.md`, runs a mandatory critic gate (5-random spot-check for live cross-references across `.agents/`, `brand/`, `research/`, `architecture/`), and — on `--apply` — MOVES confirmed candidates to `.agents/skill-artifacts/.archive/[YYYY-MM-DD]/` behind explicit per-category operator confirmation. Default mode is `--dry-run`. Critic FAIL or HARD-NEVER attempt → `BLOCKED` with no destructive action.
- HARD-NEVER guarantees in `cleanup-artifacts`: refuses to touch `brand/`, `research/`, `architecture/`, `.git/`, submodule dirs, `.agents/manifest.json`, `.agents/experience/`, `tasks.md`, or `roadmap.md` even on explicit operator request inside the skill.
- `cleanup-artifacts/references/cleanup-rules.md` — full classification taxonomy with per-class file-pattern examples, ephemeral pattern list (`*-candidates.md`, `*-rejected.md`, `*-draft.md`, `scratch-*`, undated `fresh-eyes-report.md` / `agents-panel-report.md` pre-T33 leftovers), reference-detection grep patterns (full-path + basename + slug), risk-tier rules (TIER-1 gitignored / TIER-2 tracked-clean / TIER-3 tracked-dirty refused), and manifest-driven freshness decision tree.
- `cleanup-artifacts/agents/cleanup-runner.md` — the single execution agent (walk → classify → critic → prompt → move → manifest-sync) with anti-patterns and self-check.
- Side effect: `cleanup-artifacts` re-runs `bun meta-skills/scripts/manifest-sync.ts` after any actual move so the manifest reflects new disk state.

### Changed
- `meta-skills/CLAUDE.md` — Skills table updated (4 → 5) to include `cleanup-artifacts`; Artifacts table now lists its dated snapshot path.

### Notes
- `cleanup-artifacts` mirrors the proven `machine-cleanup` pattern (per-target classification, risk surfacing, explicit confirmation, MOVE-not-delete) but at the project artifact-tree level instead of the developer's machine. Operator chose option (b) full meta-skill over (c) helper script + start-* hook (resolved 2026-05-08 PM s3, see `.agents/skill-artifacts/meta/roadmap.md` §"Hygiene & Process Skills").
- v1 of `cleanup-artifacts` only moves; an explicit `--purge-archive` flag and `--paranoid` per-file mode are deliberate v2 candidates with re-entry conditions documented in `SKILL.md` §"Future Work".

---

## [2.3.3] - 2026-05-08

Behavioral fix completion — close the remaining body-vs-frontmatter contradictions and stale path references that v2.3.2 missed (caught by the v2.3.2 fresh-eyes review pass).

### Fixed

- `agents-panel/SKILL.md` Edge Cases "Existing report" entry — was still saying `Overwrite — these are ephemeral analysis artifacts`, directly contradicting the Report section's "Do NOT overwrite prior decisions" instruction. Now declares dated/immutable accumulation per lifecycle: decision.
- `agents-panel/SKILL.md` Report section slug example — changed from `2026-05-08-content-stack-direction.md` to `2026-05-08-agents-panel-content-stack-direction.md` to match the convention already established on disk (existing decisions files all use `[date]-agents-panel-<topic>.md`). Path scheme now explicit: `[YYYY-MM-DD]-agents-panel-<slug>.md`.
- `agents-panel/SKILL.md` sub-routine wording (lines 86, 131) — "agents-panel is ephemeral" replaced with sub-routine-scoped wording that doesn't conflict with the new lifecycle: decision classification for standalone invocations.
- `fresh-eyes/SKILL.md` Pre-Dispatch Write-back note — was still saying `Reviews are ephemeral — overwrite the previous report each run`, contradicting the rest of the file. Now points to the Output section's dated-snapshot path convention.
- `meta-skills/skills/start-meta/references/workflow-graph.md` — every old `.agents/{meta,tasks,spec,prioritize,targets,diagnose,product,mkt}/...` reference (including agents-panel and fresh-eyes Produces lines) migrated to the `.agents/skill-artifacts/...` taxonomy. "(ephemeral)" classifications corrected to "lifecycle: decision / snapshot."
- `meta-skills/references/manifest-spec.md` — staleness defaults table and any other path references migrated to the new taxonomy.
- `meta-skills/README.md` — agents-panel and fresh-eyes Produces lines updated to dated paths.

### Notes

This patch closes the rest of the body-vs-frontmatter contradictions the v2.3.2 fresh-eyes pass surfaced. v2.3.2 fixed 5 of 7 affected locations; v2.3.3 closes the remaining 2 in-SKILL.md contradictions plus 2 reference files (workflow-graph.md, manifest-spec.md) that had been overlooked. No new contract surface — implementation aligns with the already-declared lifecycle taxonomy.

Same pattern as v2.3.2: the v1.5.0 T33 pass updated frontmatter `routing.produces` declarations but left body write instructions and reference docs stale. v2.3.2 + v2.3.3 close the gap.

---

## [2.3.2] - 2026-05-08

Behavioral fix — close pre-existing body-vs-frontmatter mismatch in `agents-panel` and `fresh-eyes` SKILL.md files exposed by the v2.3.1 fresh-eyes review pass.

### Fixed

- `agents-panel/SKILL.md` line 313 (Report section) — body prose was instructing agents to write to flat undated `.agents/skill-artifacts/meta/agents-panel-report.md`, contradicting both the skill's own `routing.produces: skill-artifacts/meta/decisions/[date]-*.md` frontmatter declaration and the `lifecycle: decision` taxonomy (dated, immutable per `agent-skills/CLAUDE.md` §"Artifact Placement"). Now writes to `.agents/skill-artifacts/meta/decisions/[YYYY-MM-DD]-<slug>.md` with explicit naming-convention guidance.
- `fresh-eyes/SKILL.md` Output section + Step 7 + Edge Cases + Output Files table — body prose was writing to flat undated `.agents/skill-artifacts/meta/fresh-eyes-report.md` and explicitly described the artifact as "ephemeral process artifacts, not archives" + "Previous reports are overwritten." Contradicted both the skill's own `routing.produces: skill-artifacts/meta/records/fresh-eyes-*.md` frontmatter and the `lifecycle: snapshot` taxonomy (dated, immutable). Now writes to `.agents/skill-artifacts/meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md`; reports accumulate as audit trail; operator prunes via cleanup-artifacts when needed.
- `fresh-eyes/SKILL.md` Learned rules instruction (line 155) — path `.agents/skill-artifacts/meta/learned-rules.md` migrated to `.agents/skill-artifacts/meta/records/learned-rules.md` per CLAUDE.md taxonomy (learned-rules belong in `records/` subdir, not flat at `meta/` root).
- `discover/SKILL.md` line 120 — same `learned-rules.md` path migration.
- `start-meta/SKILL.md` state-detection table (line 160) — `agents-panel-report.md` + `fresh-eyes-report.md` flat paths replaced with `decisions/[date]-*.md` + `records/[date]-fresh-eyes-*.md` glob patterns; misleading "(ephemeral)" classification corrected to "(dated, immutable — lifecycle: decision / snapshot)."
- `start-meta/SKILL.md` cost panel (line 317) — fresh-eyes Produces line updated to dated path.
- `start-meta/SKILL.md` learned-rules row — `records/` subdir added.

### Notes

This is a real behavioral fix, not just doc cleanup. The v1.5.0 T33 pass updated `routing.produces` frontmatter declarations to the new lifecycle taxonomy but left body write instructions stale. The v1.5.1 fresh-eyes review caught the contradiction between body prose and frontmatter. Patch bump because the fix changes runtime behavior (where files are written, whether they accumulate or overwrite) — but it aligns the implementation with the already-declared contract; no new contract surface.

Caught and dogfooded simultaneously: the fresh-eyes review report itself was written to the new dated-snapshot path (`.agents/skill-artifacts/meta/records/2026-05-08-fresh-eyes-claude-md-migration.md`) per the new contract.

---

## [2.3.1] - 2026-05-08

CLAUDE.md doc cleanup — align stack-level documentation with the new `.agents/skill-artifacts/` taxonomy shipped in v2.3.0 and across the umbrella as marketplace 1.5.0.

### Changed

- `meta-skills/CLAUDE.md` Manifest Spec, Artifacts, and Learned Rules sections — paths migrated to lifecycle-shaped substructure:
  - `agents-panel` artifact path: `.agents/meta/agents-panel-report.md` → `.agents/skill-artifacts/meta/decisions/[date]-<slug>.md` (lifecycle: decision — dated, immutable)
  - `fresh-eyes` artifact path: `.agents/meta/fresh-eyes-report.md` → `.agents/skill-artifacts/meta/records/[date]-fresh-eyes-<slug>.md` (lifecycle: snapshot)
  - `discover` spec path: `.agents/spec.md` → `.agents/skill-artifacts/meta/specs/<slug>.md`
  - `task-breakdown` tasks path: `.agents/tasks.md` → `.agents/skill-artifacts/meta/tasks.md` (session anchor)
  - Learned rules: `.agents/meta/learned-rules.md` → `.agents/skill-artifacts/meta/records/learned-rules.md`
- Artifacts table Notes column updated — `agents-panel` and `fresh-eyes` are no longer "ephemeral, overwritten each run"; they're dated decision/snapshot records under the new lifecycle taxonomy.

### Notes

Doc-only patch — no SKILL.md or skill-behavior changes.

---

## [2.3.0] - 2026-05-08

`fresh-eyes` simplification dimension hardening + T33 path migration.

### Changed

- `fresh-eyes/SKILL.md` lines 175-184 — replaced the one-line "Simplification" review category with an enumerated symptom list at parity with peer dimensions (Security, Edge cases). Adds 6 concrete sub-bullets: redundancy/duplication, unnecessary wrappers, dead branches, over-defensive validation, hand-rolled stdlib equivalents, manual loops where map/filter/reduce reads cleaner. Goal is parity with peer dimensions, not elevation — simplification stays at #3 of 6.
- All 5 SKILL.md files (`agents-panel`, `discover`, `fresh-eyes`, `start-meta`, `task-breakdown`) — frontmatter `description`, `routing.produces`, `routing.consumes`, and inline body references updated to the new `.agents/skill-artifacts/meta/` lifecycle taxonomy:
  - `.agents/meta/agents-panel-report.md` → `.agents/skill-artifacts/meta/decisions/[date]-*.md`
  - `.agents/meta/fresh-eyes-report.md` → `.agents/skill-artifacts/meta/records/fresh-eyes-*.md`
  - `.agents/meta/learned-rules.md` → `.agents/skill-artifacts/meta/records/learned-rules.md`
  - `.agents/meta/out-of-scope/` → `.agents/skill-artifacts/meta/out-of-scope/`
  - `.agents/spec.md` → `.agents/skill-artifacts/meta/specs/*.md`
  - `.agents/tasks.md` → `.agents/skill-artifacts/meta/tasks.md`
  - Cross-stack refs in `start-meta` (`.agents/product/`, `.agents/mkt/`, etc.) updated.
- All 5 SKILL.md files declare `routing.lifecycle:` — `decision` (agents-panel), `spec` (discover), `snapshot` (fresh-eyes), `pipeline` (start-meta orchestrator, task-breakdown).

### Notes

`fresh-eyes` simplification edit: load-bearing only — preserves dimension order, resolver hedge ("where genuinely simpler"), confidence rules, and SIMPLIFICATIONS schema. T33 path migration: mechanical churn, no behavioral changes.

Minor bump (not patch) because the fresh-eyes simplification hardening is a meaningful behavior change — reviewer prompt now enumerates symptoms it previously caught only inconsistently.

---

## [2.2.0] - 2026-05-07

Manifest spec + sync script — derived `.agents/manifest.json` state index. `start-meta` reads manifest first.

### Added

- `references/manifest-spec.md` — canonical contract for `.agents/manifest.json`, the derived state index that lets every skill in the stack discover, evaluate, and collaborate around artifacts without re-scanning the filesystem. Defines artifact frontmatter contract (`skill`, `version`, `date`, `status`, optional `stale_after_days` + `summary`), the manifest schema (artifacts + experience maps), Read/Write protocols for consumers and producers, status-aware consumption rules, and per-artifact-type staleness defaults.
- `scripts/manifest-sync.ts` — Bun TypeScript sync script (~170 lines, no deps). Walks `.agents/`, `research/`, `brand/`, `architecture/`, parses frontmatter, computes per-artifact staleness, counts experience entries, writes `.agents/manifest.json`. Idempotent, self-healing — running twice produces identical output. Skills call it as their last step after producing an artifact.

### Changed

- `start-meta` SKILL.md — Step 1 (Cross-Stack State Detection) now reads `.agents/manifest.json` first with a status-aware lookup table (`done`, `done_with_concerns`, `blocked`/`needs_context`, `stale`, `frontmatter_present: false`). Per-path filesystem scan demoted to fallback for fresh projects. Anti-pattern entry added: "Don't ignore the manifest." Added `side-effects: [manifest-sync]` to the skill's routing block.
- `CLAUDE.md` — added "Manifest Spec" section pointing skill authors at the contract and frontmatter obligations.

---

## [2.1.0] - 2026-05-06

Cross-stack orchestrator added.

### Added

- `start-meta` — Cross-stack orchestrator and top-level entry point. Reads project state across `research/`, `brand/`, `architecture/`, `.agents/`, and `.agents/experience/*.md`, classifies the user's intent into research / marketing / product / process / cross-stack, and either defers to a stack orchestrator (`/start-research`, `/start-marketing`, `/start-product`) or proposes a process meta-skill (`discover`, `agents-panel`, `task-breakdown`, `fresh-eyes`). For genuinely cross-stack work (e.g., "launch a new product feature"), proposes a 2–3 hop path with one-line rationale per step — capped at 3 hops; longer paths surface that the project is too vague and recommend `/discover` first. Never auto-invokes — always prints the `/skill-name` for the user to type. Persists a breadcrumb to `.agents/experience/meta-workflow.md`. Standard budget, ~$0.10–0.30 per run. Pipeline catalog lives in `references/workflow-graph.md`.

### Migration note (re-litigation of `navigate`)

`start-meta` revisits territory that v3 → v4 retired (`navigate`, with Status + Orchestrate modes). The unlock conditions are explicit: (1) per-stack scoping — each `/start-X` only knows its own pipeline; `start-meta` only routes between stacks, not within them; (2) user-invoked entry point — anti-runaway guard restated in every starter; never auto-invokes; (3) state detection + bundled scoping question + foundation gating — jobs the ambient agent router doesn't do. Empirical risk acknowledged: if users only invoke `/start-X` on first install and never mid-project, the orchestration premise is hollow and these become read-once skills. Adoption needs to be tracked.

### Changed

- Plugin `keywords` extended with `cross-stack` to surface the meta-orchestrator capability.

---

## [1.0.0] - 2026-05-05

Initial public release. Process-layer skills that wrap around any domain skill — improving input quality, decision quality, or output quality.

### Added

**Skills (4)**

- `discover` — Conversational discovery, adaptive depth (3-5 questions for clear tasks, multi-round interviews for vague ideas). Optional `.agents/spec.md` save. Cross-stack — invoked before any non-trivial build.
- `agents-panel` — Multi-perspective debate (3 agents × 3 rounds) or poll (10 agents × 1 pass) on a specific decision. Standalone or sub-routine for other skills hitting complex forks.
- `task-breakdown` — Decomposes architecture/spec into buildable tasks with stable IDs, deps, acceptance criteria, autonomy classification (AFK / HITL). Produces `.agents/tasks.md`. Execution protocol for downstream consumers ships separately at `references/execution-protocol.md`.
- `fresh-eyes` — Independent post-implementation review with dynamic agent spawning (reviewer + resolver). Auto-triggers for security, auth, crypto, money, PII.

**Architectural patterns**

- **Pre-Dispatch protocol** — canonical spec at `references/pre-dispatch-protocol.md` governing every skill in the stack (and across research/marketing/product). Cold Start (3-7 bundled questions, one round-trip) when context is missing; Warm Start (summary + optional probe) when artifacts/experience cover what's needed. `discover` exempt — IS the multi-round interview.
- **Experience layer** (`.agents/experience/{domain}.md`) — append-only Q&A substrate written by every skill on cold-start, read before asking. Domains flexible (product, audience, business, brand, goals are starters; new domains added when topics are orthogonal). Most-recent-wins read; append-only write preserves audit trail across user pivots.
- **Status protocol** — every skill emits explicit `DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT` status. Artifact frontmatter `status:` field uses the same values. Mandated by root `CLAUDE.md`.
- **Multi-agent orchestration** — every skill except `discover` uses Layer 1 (parallel) → Layer 2 (sequential) → Critic gate (PASS/FAIL with max 2 rewrite cycles).
- **Learned rules** — `.agents/meta/learned-rules.md` accumulates user corrections across sessions; meta-skills read relevant rules before dispatching.

**Cross-stack capabilities**

- `agents-panel` can be invoked as a sub-routine by any skill hitting a multi-perspective decision point (typical callers: `prioritize`, `system-architecture`, `discover`).
- `task-breakdown` consumes `architecture/system-architecture.md`, `.agents/spec.md`, `.agents/product/flow/*.md` from product-skills.
- `fresh-eyes` runs after any domain skill — system-architecture, task-breakdown, code-cleanup, raw implementation.
