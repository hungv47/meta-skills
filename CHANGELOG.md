# Meta Skills — Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning is [SemVer](https://semver.org/spec/v2.0.0.html) — major.minor.patch.

This file tracks stack-level releases. SKILL.md files describe current behavior; this file documents what changed and when.

---

## [5.0.1] - 2026-05-12

Adds a human-readable artifact selection index generated from the manifest.

### Added
- `manifest-sync` now writes `.agents/artifact-index.md` alongside `.agents/manifest.json`. The index separates active artifacts from archived history and shows why each artifact exists, when to use it, status, and lineage.
- Manifest entries now carry richer selection metadata when frontmatter provides it: `title`, `purpose`, `lifecycle`, `use_when`, `do_not_use_when`, `supersedes`, `superseded_by`, `upstream`, `downstream`, and `decision_status`.
- `manifest-spec.md` documents the richer frontmatter contract and clarifies that `.agents/artifact-index.md` is generated infrastructure, not a skill output.

### Fixed
- `schema_version` now stays numeric even when artifact frontmatter uses non-numeric human versions such as `pruned-2`.

Review records: `.agents/skill-artifacts/meta/records/2026-05-12-fresh-eyes-artifact-index-system.md` and `.agents/skill-artifacts/meta/records/2026-05-12-cleanup-artifact-index-system.md`

---

## [5.0.0] - 2026-05-12

Stack-major cut coordinated across the 4-stack marketplace to mark the post-tier-discipline stable era. No meta-skill removed or renamed; no API breaking change. The cross-stack orchestrator declares itself fast-tier. Major bump signals the alignment, not breakage.

### Changed
- `orchestrate-meta` budget reclassified standard → fast; body declares it is a pure router (no agent dispatch, no critic gate).

Full review: `.agents/skill-artifacts/meta/records/2026-05-12-fresh-eyes-tier-discipline-phase-ab.md`

---

## [3.2.3] - 2026-05-11

Three consistency fixes to the §Skill-Authoring Patterns section that landed in 3.2.2. Independent review caught format-spec slips and an attribution inconsistency.

### Documentation fixes (no behavioral change)
- **Description-as-router now has a When-NOT-to-use block** for format parity with sibling pattern entries (the sanity-check loop is for new skills, renames, and sibling-collision risk — not routine audits of stable descriptions).
- **N-with vs. N-without eval entry attribution unified.** The body sentence previously credited "WorkOS's Next.js installer" while the Source line credited "Nick Nisi" — now both say "Nick Nisi's Next.js installer skill (shipped as part of WorkOS's `workos install` CLI)."
- **Over-prescribing anti-pattern adds a "When to flag this risk" line** before Detection signals, for format parity with the other six pattern entries that all carry an explicit when-to-use guidance.
- **Filler line cut** from the over-prescribing anti-pattern ("Same risk applies to any future skill that hits the prescription wall" was a restatement of the prior sentence).

---

## [3.2.2] - 2026-05-11

`CLAUDE.md` §Skill-Authoring Patterns grows from one entry to seven. Five patterns plus one anti-pattern, all sourced from the WorkOS Skills at Scale workshop. The section is reference material for anyone authoring or reviewing a new skill in this stack — fresh-eyes review and new-skill scaffolding can now cite a canonical pattern by name instead of reasoning from first principles each time.

### New patterns

- **Description-as-router** — the `description` frontmatter field is the runtime routing logic, not docs. Write it dense with the acronyms, verbs, and product names that should trigger the skill. Sanity-check by feeding the description back to Claude with "given this, when would you load me?" before merging.
- **Progressive disclosure** — keep `SKILL.md` thin (router + references map); split heavy domain content into `references/*.md` that load conditionally. Canonizes a pattern already in use across `short-form-brief`, `copywriting`, and `discover`.
- **Confidence-scoring gate** — before high-stakes output (architecture, irreversible commits, scope-altering specs), have the skill score its own understanding 0–100 across five dimensions and refuse to proceed below ≥95. Pairs with the existing multi-agent + critic gate; doesn't replace it.
- **Audience-detection branching** — branch skill behavior on `` ! `git config user.email` `` and commit-count signals (peer to the bang-backtick convention added in 3.1.2). Forward-leaning for the current solo-operator stack; today's marginal applicability.
- **Eval methodology — N-with vs. N-without** — run the same task N times with the skill loaded and N times without; only ship if accuracy goes up with it. Without this, additive enrichment can silently regress quality — WorkOS's Next.js installer dropped accuracy ~30% before this eval caught it.

### New anti-pattern

- **Over-prescribing in already-strong domains** — a skill that prescribes 20+ rules in a domain Claude is already 90th-percentile at will reduce accuracy. The model defers to the rules and ignores its own (often-better) defaults. The entry calls out `humanize` (currently 47 patterns, near the cliff) as the observable stack risk and ties pattern growth past ~55 to the N-with vs. N-without eval gate.

### Notes

- All entries follow the same shape as the bang-backtick entry shipped in 3.1.2: heading + one-paragraph what + when-to-use + when-not-to-use + source attribution.
- No skill body changes. No contract changes for downstream consumers. Pure additive CLAUDE.md reference content.

---

## [3.2.1] - 2026-05-11

Documentation and wiring fixes for `discover` after the 3.2.0 release. Polish on the new plan-review mode, idea-critic gate, and mandatory spec sections so they're easier to read and behave as documented.

### Behavioral change worth knowing about
- **The idea-critic gate now fires reliably on idea-stage sessions.** A previously-listed skip condition pointed to a "premise-check greenlight signal" that wasn't actually emitted anywhere, so the gate could be bypassed inconsistently. Removed. The gate still skips for plan-review mode, an explicit `skip the idea critic` override, and trivial Light-depth scoping — those three cover the cases that mattered.

### Documentation fixes (no behavioral change)
- **§Step 2.7 dispatch now spells out all three Input Contract fields** the idea-critic agent expects (`idea-statement`, `context-gathered`, `mode`). Previous wording only said "the user's idea-statement plus context-gathered" without describing how to assemble `context-gathered` from §Step 1's findings or that `mode` is the literal string `idea-stage`.
- **§Step 2.7 PUSH_BACK handling names the agent's `## Push-Back Routing` output section directly**, so you don't need to round-trip into `agents/idea-critic.md` to know which section to read.
- **Step 6 Verdict and Step 7 Verdict are the same verdict** — stated once in conversation, recorded once in the saved spec. Added a "Single verdict, two surfaces" bridge line so this reads cleanly instead of looking like two separate outputs.
- **§Step 7 Light-depth exception is front-loaded** at the top of "Save point formats" rather than buried beneath the heavyweight `MANDATORY` template. Depth gating is now visible before the template, not after it.
- **Idea-critic agent Self-Check notes the De Morgan equivalence** between its PROCEED rule ("fewer than 2 red AND at least 2 green") and its PUSH_BACK rule ("≥2 red OR <2 green"). Both were stated independently; the inline note flags them as equivalent.
- **`routing.consumes` no longer lists `agents/idea-critic.md`.** That field enumerates input data the orchestrator reads, not sub-agents it dispatches. Now matches how `agents-panel` and `task-breakdown` document their own sub-agents (inline at the dispatch site + in §References).
- **`workflow-graph.md` cost band for `discover`** changed from "0–1 agents" to "1 agent (idea-critic, conditional on idea-stage; skipped on plan-review and Light-depth scoping)". Reads cleaner; matches sibling-entry style.

---

## [3.2.0] - 2026-05-11

`discover` skill gains plan-review mode, an idea-critic gate, and mandatory output sections in saved specs. Largest behavioral change to `discover` since launch. Builds on 3.1.1's anti-sycophancy + always-recommend rules.

### Added
- **Plan-review mode with 4 sub-modes** (`SKILL.md` §Step 2.5). When you bring an existing plan, spec, or sketch instead of a blank-slate idea, `discover` now detects this and asks which posture to take: **SCOPE EXPANSION** (push the scope up), **SELECTIVE EXPANSION** (hold the baseline, surface expansions for cherry-pick), **HOLD SCOPE** (make it bulletproof without changing scope), or **SCOPE REDUCTION** (cut to minimum-viable). The chosen mode locks for the session — no silent drift between expansion and reduction. You can switch modes explicitly. When EXPANSION or REDUCTION is picked, the skill recommends whichever serves your stated outcome, not whichever is smaller (AI compresses implementation time, so the rewrite often wins).
- **Idea-critic gate** (`SKILL.md` §Step 2.7 + new `agents/idea-critic.md`). On idea-stage sessions, a sub-agent scores your idea against 5 red flags (no workarounds exist · can't name 10 specific people who'd use this · only friends validate it · the problem itself needs educating · you're outside the community feeling the pain) and 5 green flags (people paying for inferior alternatives · a small group already manually loves a wedge of this · the community is actively complaining · you can name the customer and pain crisply · you're scratching your own itch). Threshold: ≥2 red OR <2 green = the gate pushes back with cited flags and routing questions before `discover` continues to coverage zones or alternatives generation. The gate re-runs at most once after your clarifying answers; if it still pushes back, the skill recommends pausing to gather evidence but you can override and proceed (recorded in the saved spec's frontmatter as `done_with_concerns`).
- **Mandatory sections in saved specs** (`SKILL.md` §Step 7). Every spec save now includes: **Premise Challenge** (right problem · outcome vs proxy · do-nothing baseline · what partially solves this already · how this will reach users), **Dream State Mapping** (a CURRENT → THIS PLAN → 12-MONTH IDEAL three-column view that forces forward-time thinking before locking architecture), **Implementation Alternatives** (minimum 2-3 distinct approaches with effort/risk/pros/cons; if you lock to one option, the spec must explain the hard constraint), **Temporal Interrogation** (Hour 1 / Hour 2-3 / Hour 4-5 / Hour 6+ ambiguities the implementer will hit at each stage — resolve them in the spec, not during build), and **Verdict** (idea-stage maps to VALIDATED / NEEDS_MORE_VALIDATION / PIVOT; plan-review maps to BUILD_AS_PROPOSED / CHERRY-PICK_EXPANSIONS / EXPAND_BEYOND_PROPOSED / HOLD_AS_PROPOSED / HOLD_WITH_RISK_NOTES / CUT_TO_MINIMUM / CUT_AGGRESSIVELY). Light-depth saves (clear task, well-defined scope) keep the prior compact format via `light_spec: true` — the heavyweight sections are for medium/deep work where strategic calls are being made. Scope-locking contracts are unchanged.
- **`agents/` subdirectory** under `discover/`. First sub-agent for what was previously a single-agent skill.
- **Configuration knobs:** `mode` (auto-detected; override with "treat this as a plan review" or "fresh idea, ignore the existing spec"), `plan-review-mode` (picked when mode is plan-review), and `idea-critic` (auto-on for idea-stage; override with "skip the idea critic").

### Changed
- **§Step 6 Clarity Check** gains a 4th item: explicit Verdict before "ready to build?" Every `discover` session now ends on a clear decisional output, not just "is the conversation done?"
- **Configuration table** now lists `mode`, `plan-review-mode`, and `idea-critic`.
- **`orchestrate-meta` workflow-graph** — `discover` entry rewritten to surface both modes. New "process: plan-review" routing row catches signals like "review my plan", "audit this spec", "should we expand or cut this", and pasted structured plans. Cost band adjusted from $0.03–0.10 to $0.03–0.15 to reflect the optional idea-critic dispatch.
- **README** — `discover` section rewritten to cover both modes, the new mandatory output sections, and the idea-critic gate.

### Compatibility
- No breaking changes. `task-breakdown` reads `.agents/skill-artifacts/meta/specs/*.md` the same way — the new mandatory sections are additive and downstream consumers ignore what they don't need.
- Existing `/discover` invocations continue to work unchanged on idea-stage sessions.
- Old specs without the new frontmatter fields (`mode`, `plan-review-mode`, `light_spec`) continue to parse — these are new fields, not required-on-read.

---

## [3.1.3] - 2026-05-10

Fixes a silent-failure bug in the inline shell snippets that 3.1.2 introduced. Without this patch, the warm-start summaries in `cleanup-artifacts`, `orchestrate-meta`, and `fresh-eyes` would render blank in projects without the expected files instead of showing a useful fallback message.

### Fixed
- **`! `cmd 2>/dev/null || echo fallback`` silent-failure pattern across the 3 retrofitted SKILL.md files.** The `||` operator keys on exit code, not on empty stdout. When the target file or directory is missing, `find ... 2>/dev/null` and `git log <untracked-or-empty-range>` exit 0 with empty stdout, so the fallback never fired and the warm-start rendered blank. Reproduced in this repo (`.agents/manifest.json` is gitignored locally; `git log -1 .agents/manifest.json` returned exit 0 with empty output) and on a fresh project (no `.agents/skill-artifacts/` directory). The fix: pipe through `grep .` (forces non-zero on empty input) or front-gate on `[ -d X ] && ...`. Five interpolations updated:
  - `cleanup-artifacts/SKILL.md` — manifest mtime line.
  - `orchestrate-meta/SKILL.md` — artifacts-by-domain line + last-5-commits line.
  - `fresh-eyes/SKILL.md` — diff range line + diff stat line.
- **`orchestrate-meta/SKILL.md` canonical-folder loop** emitted whitespace-only output when none of `research/`, `brand/`, or `architecture/` were present (the fresh-project case where the signal matters most). Loop now tracks a `found` state and emits `(none yet)` when no canonical folder is detected.

### Changed
- **`meta-skills/CLAUDE.md` §"Skill-Authoring Patterns" Read-tool semantic claim tightened.** Previous text was an overstatement; replaced with a precisely-scoped explanation: the Claude Code slash-command preprocessor handles `!`-prefixed lines at slash-command invocation time only, and Read tool returns file bytes as-is. Added an actionable corollary for sub-agent prompt-builders: run the command in the orchestrator and inline the output into the sub-agent's prompt — don't expect the sub-agent's read of the SKILL.md to interpolate.

### Notes
- Verified end-to-end: each fixed interpolation re-tested in 3 cases (missing dir, empty dir, populated dir; missing branch, empty range, real diff; no canonical folders, 1 of 3 canonical folders). All cases now produce useful output instead of blank lines.

---

## [3.1.2] - 2026-05-10

Inline shell interpolation convention (`` ! `<cmd>` ``) canonized as a stack-wide skill-authoring pattern, plus three retrofits inside `meta-skills/`. Slash-command bodies that previously asked Claude to "go figure out X" now embed deterministic shell output inline, so the orchestrator starts from a real snapshot instead of speculating.

### Added
- **`meta-skills/CLAUDE.md` §"Skill-Authoring Patterns" section** canonizing the `` ! `<cmd>` `` convention. Covers when to use it (Pre-Dispatch context surfacing, state-detection, sub-agent prompt-building) and when not to (non-deterministic data, SKILL.md content read by sub-agents via Read tool, slow/side-effecting/unsafe commands, cross-platform-fragile flags). Worked example shows substitution semantics. Source: Skills at Scale workshop (Nick Nisi & Zack Proser, WorkOS DX).

### Changed
- **`cleanup-artifacts/SKILL.md` Pre-Dispatch warm start** — manifest-snapshot placeholder replaced with two `` ! `find` `` interpolations (total artifact count + 90d-stale count) and one `` ! `git log` `` for manifest mtime. No more deriving `[N artifacts, M stale, K orphan]` by hand.
- **`orchestrate-meta/SKILL.md` Step 1 Cross-Stack State Detection** — three interpolations now render before the manifest read: artifacts-by-domain count, top-level canonical-folder presence (research/brand/architecture), and last 5 commits. The skill has a free-standing disk snapshot even when the manifest is stale or missing.
- **`fresh-eyes/SKILL.md` Pre-Dispatch warm start** — `[N files / diff vs main]` placeholder replaced with `` ! `git log --oneline main..HEAD` `` and `` ! `git diff --stat main...HEAD` ``. Diff range is visible inline before reviewer dispatch.

### Notes
- All commands are macOS+Linux portable: `find` with `-name`/`-type f`/`-mtime` portable subset, `wc -l | tr -d ' '` for macOS leading-whitespace, POSIX `awk -F/`, portable `git log` formats. No GNU-only flags. All wrapped with `2>/dev/null || echo "..."` graceful fallback.
- **Skipped retrofits with reasoning:**
  - **The three sibling `orchestrate-*` skills** (research/marketing/product) — structurally identical to `orchestrate-meta`. The retrofit is a ~3-line lift that should land in each stack's next enrichment session rather than as a 4-stack ceremony.
  - **`cold-outreach`** — was a named candidate but skipped on principle: it reads web data (LinkedIn posts, GitHub activity, company news), not deterministic local data. The bang-backtick pattern is for deterministic local commands, not network calls. The existing 7-question cold-start questionnaire is the right surface for prospect-signal collection.
- Inline shell interpolation only renders when a SKILL.md file is invoked as a slash command. Sub-agents that read these SKILL.md files via the Read tool see literal `! \`...\`` text — no execution. Each retrofit includes a trailing note pointing readers to `meta-skills/CLAUDE.md` §"Skill-Authoring Patterns" for the semantics.

---

## [3.1.1] - 2026-05-10

`discover` gains anti-sycophancy rules and an always-recommend rule in its Communication Discipline section. Where 3.1.0 gave `discover` its content spine (the operator-playbooks catalog), this release gives it the posture: no hedging, no asking-without-recommending, and a falsifier required on every position.

### Changed
- **Three named rules added to `discover/SKILL.md` Communication Discipline:**
  - **Banned phrases** — a verbatim list of 5 sycophantic hedges the skill will never emit: `interesting approach`, `many ways to think about this`, `you might want to consider`, `that could work`, `I can see why you'd think that`.
  - **Take a position on every answer** — every substantive answer must carry both a position and a falsifier (what evidence would change my mind). If you can't name what would flip the position, it isn't a position.
  - **Always recommend while asking** — every AskUserQuestion (and equivalent chat-format question) must carry a recommended answer with a one-line reason. Asking without recommending offloads thinking onto the user; the skill won't do that anymore.

### Notes
- Sources: `garrytan/gstack/office-hours` §Anti-Sycophancy Rules + §Pushback Patterns; `mattpocock/skills/skills/productivity/grill-me` ("For each question, provide your recommended answer").
- The 5 BAD-vs-GOOD pushback patterns referenced in this section's pacing bullets were already present in `discover/SKILL.md` prior to this patch — this release fills in the missing rules around them, not the patterns themselves.

---

## [3.1.0] - 2026-05-09

`discover` gains a 9-doc operator-playbook reference catalog at `discover/references/operator-playbooks/`, loaded during Step 1 Context Gathering. The catalog gives `discover` a knowledge spine for pushing back from named playbooks ("the DTC $100M frame says X — your direction conflicts because Y") rather than asking generic interview questions. Mirrors the `platform-intelligence/` pattern from `short-form-brief`: practitioner-grade frames with `last_verified` frontmatter, named-cohort sourcing, and explicit pushback patterns the skill cites by name.

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
- **`discover/SKILL.md`** — Step 1 Context Gathering now loads operator-craft frames on every non-trivial invocation (skipped only for Light-depth trivial scoping) and matches founder-domain frames against product-context via a trigger table. Step 6 Clarity Check gains a playbook-citation self-check: before asking "ready to build?", the skill verifies that its recommendation cited at least one applicable frame when one was loaded. References section enumerates the 9-doc catalog.

### Notes
- Source-fetch caveat: `garrytan/gstack/{plan-ceo-review,office-hours}` SKILL.md files live at the repo root, not under `skills/`. Captured here for future re-verification.

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
