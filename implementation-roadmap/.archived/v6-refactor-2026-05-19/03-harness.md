# The Harness — Measurement Tool

The single most important deliverable of Phase 1. Without numbers, every refactor decision is vibes. The harness eliminates vibes.

---

## Why instrument

Three questions we cannot answer today, but must answer per skill before refactoring:

1. **How many tokens does this skill actually load by default?** (body + always-loaded refs)
2. **Which references get loaded lazily, and which always load?** (the leak detector)
3. **Does each spawned sub-agent demonstrably change the output?** (critic ROI)

And after refactoring, three confirmation questions:

4. **Did default token load drop?** (the win we're chasing)
5. **Did the artifact contract hash change?** (the regression we're avoiding)
6. **Did blind output diff degrade vs. baseline?** (the quality floor)

The harness measures all six.

---

## Scope — what the harness is, and isn't

**Is:**
- A wrapper that instruments a single skill invocation
- A JSON-emitting logger of token loads, agent calls, artifact outputs, and timing
- An aggregator that produces per-skill reports across multiple invocations
- A diff tool that compares pre-refactor vs. post-refactor runs of the same input

**Is not:**
- A full evals platform (we have `eval-loop` for product-eval loops)
- A test runner for skill output quality (that's blind operator diff, see [`05-acceptance.md`](./05-acceptance.md))
- A replacement for the critic gates inside skills
- A CI tool (yet — Phase 7 may promote it)

---

## Architecture choice

Two viable implementation patterns. Pick at start of Phase 1 after a 30-min spike, not now.

### Option A: Claude Code hook-based observer (preferred)

A `PreToolUse` + `PostToolUse` hook in `~/.claude/settings.json` (scoped to skill invocation context) that logs every tool call to `.agents/skill-artifacts/meta/records/harness/<date>-<skill>-<run-id>.json`.

**Pros:** zero changes to skill source; observes real invocations as they happen; works with any skill.

**Cons:** hook scope must be careful (don't log every Claude Code session); requires teaching the hook to recognize which calls are skill-internal vs. unrelated; harder to capture "tokens loaded into context" (hooks see tool calls, not context loads).

### Option B: Wrapper script that drives an agent

`bun meta-skills/scripts/harness/runner.ts --skill <name> --input <path-to-input-file>` spawns a Claude Code session via the SDK with logging enabled, invokes the skill once, captures everything.

**Pros:** full control; can measure context size directly; deterministic.

**Cons:** doesn't observe organic invocations; requires the runner to fully simulate how a real user would invoke the skill; ~10x more code than option A.

### Decision protocol for Phase 1

1. Spike option A first (~1 hour). If hook telemetry includes enough signal (tool calls + their content sizes), commit to A.
2. If A can't see context loads (i.e., we can't distinguish "agent read this file as part of skill invocation" from "agent read this file for unrelated reason"), fall back to B.
3. Document the choice in `meta-skills/scripts/harness/README.md` with a one-paragraph rationale.

---

## Per-invocation output schema

Whichever implementation wins, the JSON output schema is fixed:

```json
{
  "run_id": "01HKQ7...ULID",
  "timestamp": "2026-05-16T14:32:01Z",
  "skill": "discover",
  "stack": "meta-skills",
  "skill_version": "<from plugin.json>",

  "mode": {
    "resolved": "standard",
    "source": "auto-resolver",
    "resolver_reasoning": "input is single-topic, no production stakes"
  },

  "input": {
    "user_prompt_chars": 247,
    "user_prompt_hash": "sha256:...",
    "referenced_artifact_paths": []
  },

  "context_load": {
    "skill_md_lines": 696,
    "skill_md_chars": 28403,
    "always_loaded_refs": [
      { "path": "references/question-bank.md", "lines": 412, "chars": 18207 }
    ],
    "lazy_loaded_refs": [
      { "path": "references/operator-playbooks/cold-start.md", "loaded_at_step": 3, "lines": 78, "chars": 3204 }
    ],
    "total_default_chars": 46610,
    "total_with_lazy_chars": 49814
  },

  "agents_spawned": [
    {
      "name": "scope-guard-agent",
      "spawned_at_step": 2,
      "input_chars": 8412,
      "output_chars": 1124,
      "output_changed_main_thread": true
    },
    {
      "name": "critic-agent",
      "spawned_at_step": 5,
      "input_chars": 12047,
      "output_chars": 642,
      "output_changed_main_thread": false
    }
  ],

  "critic_gate": {
    "fired": true,
    "changes_made": ["tightened CTA", "removed hedging in section 2"],
    "changed_main_thread": true
  },

  "output_artifacts": [
    {
      "path": ".agents/skill-artifacts/meta/specs/foo.md",
      "lifecycle": "pipeline",
      "frontmatter_hash": "sha256:...",
      "section_header_hash": "sha256:...",
      "contract_hash": "sha256:..."
    }
  ],

  "wall_time_ms": 47210,
  "tool_calls": 23,

  "harness_version": "0.1.0"
}
```

### Field rationale

- **`run_id`** — ULID for sortable uniqueness; one row per invocation.
- **`skill_version`** — pulled from the stack's `plugin.json`; baselines drift if skill versions change.
- **`mode.resolver_reasoning`** — once mode-resolver lands (see [`04-protocol.md`](./04-protocol.md)), this captures the auto-resolution rationale for audit.
- **`context_load.always_loaded_refs`** vs **`lazy_loaded_refs`** — the leak detector. Refs that load on every run regardless of branch belong in the body; refs that load conditionally are doing their job.
- **`agents_spawned[].output_changed_main_thread`** — the critic-ROI signal. If false across 3+ runs, that agent is overhead.
- **`output_artifacts[].contract_hash`** — composite hash of frontmatter shape + section header order. Used for regression detection per [`02-constraints.md`](./02-constraints.md).

---

## Aggregator output

`bun meta-skills/scripts/harness/report.ts --skill <name>` reads all JSON files for a skill and emits a markdown report:

```markdown
# Harness report — discover

## Sample size
- 8 invocations across 2026-05-17 to 2026-05-22
- Modes: 3 fast, 4 standard, 1 deep

## Context load
- SKILL.md body: 696 lines (28,403 chars)
- Always-loaded refs: 1 file, 412 lines (18,207 chars)
- **Total default load: 46,610 chars (~12k tokens) on every invocation**
- Lazy-loaded refs (avg): 1.4 files per run

## Critic ROI
- scope-guard-agent: fired 8/8, changed output 7/8 (88%) — KEEP
- critic-agent: fired 8/8, changed output 2/8 (25%) — REVIEW

## Artifact contract stability
- Frontmatter hash: stable across all 8 runs
- Section header hash: stable across all 8 runs

## Recommendations
- Move question-bank.md to lazy-load (only 3/8 runs needed full bank)
- Review critic-agent's rubric — 25% change rate suggests over-triggering
- Body diet target: 250 lines (current 696)
```

---

## File layout

```
meta-skills/scripts/harness/
├── README.md           # invocation docs + architecture-choice rationale
├── runner.ts           # observer (option A) or wrapper (option B)
├── report.ts           # aggregator
├── diff.ts             # pre/post-refactor comparison
├── schema.ts           # JSON output schema (typed)
└── lib/
    ├── hash.ts         # contract-hash + frontmatter-hash logic
    └── parse.ts        # SKILL.md parser (count lines, detect refs)

.agents/skill-artifacts/meta/records/harness/
├── inputs/             # frozen input prompts used as harness fixtures
│   ├── discover-01.md
│   ├── discover-02.md
│   └── ...
└── <date>-<skill>-<run-id>.json   # one per invocation
```

---

## Inputs corpus

Each skill needs **at least 3 frozen input fixtures** for repeatable harness runs. These live at `.agents/skill-artifacts/meta/records/harness/inputs/<skill>-NN.md`. Selection criteria:

- 1 minimal input (≤3 sentences, no artifact refs) — tests fast-mode auto-resolution
- 1 standard input (single-topic, ~1 paragraph, may reference 1 artifact) — tests default mode
- 1 stretch input (cross-domain, refs multiple artifacts, has production stakes) — tests deep-mode auto-resolution

Pull these from real past invocations where possible (search operator's history). Otherwise synthesize and label `[synthetic]` in the file. Don't refactor a skill until its 3 fixtures exist.

---

## Pre/post-refactor diff procedure

For each refactored skill:

1. Run harness on all 3 fixtures with current SKILL.md → save as `pre-refactor/`.
2. Capture the literal output (artifact file content) of each run.
3. Refactor.
4. Run harness on the same 3 fixtures with new SKILL.md → save as `post-refactor/`.
5. `bun meta-skills/scripts/harness/diff.ts --skill <name>` → emits comparison:
   - Context load: % change
   - Critic ROI: changes per agent
   - **Contract hashes:** MUST match (if changed, refactor is broken unless it's an intentional contract change with downstream eval skill updated atomically)
   - **Output diff:** rendered side-by-side for blind operator review

The blind operator review is the hard quality gate. See [`05-acceptance.md`](./05-acceptance.md).

---

## Phase 1 deliverables — definition of done

- [ ] `meta-skills/scripts/harness/README.md` documents the architecture choice + invocation
- [ ] `runner.ts` produces valid JSON matching the schema above for at least one real skill invocation
- [ ] `report.ts` aggregates 3+ runs into the markdown format above
- [ ] `diff.ts` compares pre/post and surfaces contract hash mismatches
- [ ] Schema is typed in `schema.ts` and imported by all three commands
- [ ] At least 3 input fixtures exist for `eval-loop` (the first skill we'll refactor)
- [ ] Harness has run against `eval-loop` end-to-end at least once, output committed to `.agents/skill-artifacts/meta/records/harness/` as the baseline
- [ ] [`progress.md`](./progress.md) updated: phase 1 → ✅; phase 2 → ⏳ next

---

## Anti-patterns to avoid in harness implementation

- **Don't measure what you don't use.** If a field in the schema isn't consumed by `report.ts` or `diff.ts`, drop it.
- **Don't add a UI.** Markdown reports + JSON files are the interface. No web dashboard, no CLI menus.
- **Don't make it cross-platform fancy.** Bun on macOS is the runtime. Targeting Linux/Windows is future work.
- **Don't try to handle every edge case in v0.1.** If `runner.ts` can't parse some skill's output format, log a warning and skip — don't crash. We refine as we use it.
