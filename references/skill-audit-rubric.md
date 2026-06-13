---
title: Skill Audit Rubric — static scoring dimensions + scorecard schema for the critic-gate harness
lifecycle: canonical
status: stable
produced_by: world-class-plugin program U5 (2026-06-11 plan, R8/R9)
provenance:
  anchors_on: 2026-06-05 plan KTD-4 net-new-skill Quality Standard (multi-agent orchestration, critic gate + rubric, anti-patterns, worked example, routing registration, budget tier, trigger evals)
  extracted_at: 2026-06-11
consumers: _dev/eval/critic-gate.ts (scoring engine), _dev/eval/audit-stack.ts (U6 cohort report), the full-stack audit disposition report
load_class: PLAYBOOK
---
<!-- lint:reference-ok-file audit rubric describing per-skill structure to score; all paths exemplary -->

# Skill Audit Rubric

**The static rubric the critic-gate harness scores every skill against. Seven scored dimensions, each 0–2, computed by deterministic structural analysis — presence, measurement, and cross-surface registration — not LLM judgment.** The harness is `_dev/eval/critic-gate.ts`; the U6 full-stack audit runs on its JSON scorecards unchanged.

**Rubric v2 (2026-06-12, wave-2 U3)** adds six **advisory dimensions** (A1–A6, § "Advisory dimensions") for 2026 best-practices conformance. Advisory dimensions are flag-only: they never enter `points`/`max`/`pass`, never fail the floor, and travel in an additive `advisory` block on the same `skill-audit-scorecard/v1` schema. The scored D1–D7 contract is unchanged.

Every dimension anchors on the net-new-skill **Quality Standard** (2026-06-05 plan, KTD-4; restated in `skills/CLAUDE.md` § "Quality Standard"): multi-agent orchestration, critic gate with a quantitative rubric, anti-patterns section, worked example, routing registration, budget tier, trigger evals. A skill that would not clear the bar for *adding* it today should not score clean when *auditing* it.

---

## Scope and cohort

The audit cohort is every skill under `skills/{meta,research,marketing,product}/` **except vendored skills** (currently `product/build-ios-apps`, the sole intentional quality-bar exception). Vendored skills are classed **VENDORED** and excluded from structural scoring — the harness detects them and emits `disposition_hint: "VENDORED"` with no dimension scores. Detection: the vendored marker (an `attribution:` frontmatter field or `BUDGET_EXCEPTION` comment containing "vendored"), or the hardcoded vendored id list.

---

## Scoring scale

Each dimension scores **0 / 1 / 2**:

| Score | Meaning |
|---|---|
| **2** | Complete — all checks for the dimension pass |
| **1** | Partial — the dimension is present but at least one check fails |
| **0** | Missing — the dimension is structurally absent |

Dimensions carry an `applicable` flag. A dimension that does not apply to a skill (e.g. tool-ask coverage outside the producing/briefing family) is marked `applicable: false` and **excluded from both numerator and denominator** — it never inflates or deflates the total.

**Total:** `points / max` over applicable dimensions, reported as a percent.

**Pass floor** (the harness exit-code threshold):

- `percent ≥ 65`, AND
- **no applicable dimension scored 0.**

A zero on any applicable dimension means a Quality Standard pillar is structurally missing — that is always at least an IMPROVE finding, regardless of the average. `--json` mode always exits 0 (report mode); the pass verdict travels in the payload.

---

## Dimensions

### D1. `effectiveness` — effectiveness vs stated promise

Does the body deliver the capability the `description` promises? Static proxies (an LLM judge is out of scope for this harness):

| Check | id | Passes when |
|---|---|---|
| Description–body coherence | `coherence` | ≥ 45% of significant terms (≥5 chars, stopwords removed, sibling-skill names in "Not for …" routing clauses removed) from the frontmatter `description` appear in the SKILL.md body |
| Worked example present | `worked_example` | A `Worked Example` heading in the body, or a populated `references/examples/` or `references/_examples/` directory, or a standalone example file (`references/examples.md`, `references/example-*.md`), or a body link into an `examples/`/`_examples/` path. *(Widened 2026-06-12 per wave-1 disposition report §4.3.1 — sibling conventions in live use were under-detected.)* |
| Orchestration declared | `orchestration` | `routing.yaml` has an `orchestration:` block, or the body declares sub-agent/orchestrator structure, or an `agents/` directory exists |

Score: 3/3 checks → 2 · 1–2/3 → 1 · 0/3 → 0.

### D2. `critic` — rubric/critic completeness

Does the skill define its own critic gate with a quantitative rubric? The harness records the source as `critic_rubric_source`:

- **`own`** — the skill has a critic/quality-gate section (or a critic agent, or instantiates [`thin-critic-rubric.md`](thin-critic-rubric.md) / imports from [`shared-critic-rubrics.md`](shared-critic-rubrics.md)) **with quantitative teeth** (a `- [ ]` checklist, numeric thresholds, score scales, or auto-fail conditions).
- **`thin-fallback`** — the skill defines **no critic gate at all**; the harness scores it against the thin rubric's three structural parts (3-dim rubric / checklist / auto-fail) instead. **The fallback is itself a finding** — it is recorded in `findings` and the dimension cannot score 2.

| Check | id | Passes when |
|---|---|---|
| Gate present | `gate_present` | A critic/quality-gate heading, a `*critic*` file under `agents/`, or a rubric-reference cite exists |
| Quantitative rubric | `quantitative` | ≥3 checklist items, or numeric thresholds (≥/score-scale/avg), or explicit auto-fail conditions — found in the SKILL.md body **or one `load:` hop away** (the files the skill's own `routing.yaml` `load.always` / `load.when[].read` declare, plus `agents/*critic*.md` files). *(One-hop scan added 2026-06-12 per wave-1 §4.3.2 — the stack's progressive-disclosure pattern keeps teeth in `references/`/agent files; the harness used to scan body only.)* |
| Anti-patterns section | `anti_patterns` | An Anti-Patterns heading in the body or a `references/**/anti-patterns.md` file |

Score: all 3 → 2 · gate present but a check fails → 1 · no gate (thin-fallback) → 0 (or 1 when anti-patterns still exist — partial quality machinery without a gate).

### D3. `interrogation` — interrogation depth

Does the skill run a real cold-start, with its questions registered? Anchors on [`pre-dispatch-protocol.md`](pre-dispatch-protocol.md).

| Check | id | Passes when |
|---|---|---|
| Own pre-dispatch machinery | `own_predispatch` | A `references/**/pre-dispatch.md` procedure file, or a Pre-Dispatch/Cold-Start body section naming its needed dimensions/questions |
| Registry entry | `registry` | The skill's **current id** appears as a `**<id>**` entry in `pre-dispatch-protocol.md` § "Per-Skill Question Registry" |

Score: `own_predispatch` → 2 (registry is corroborating, not required — the registry is known to carry pre-rename name drift; a current-id miss is recorded as an informational finding, not a failure) · only a bare protocol cite → 1 · no pre-dispatch surface at all → 0.

### D4. `tool_ask` — tool-ask coverage

Applies only to the producing/briefing family that the stack's own contracts already bind:

- **Execution-fork family** (must cite [`execution-fork.md`](execution-fork.md), per the §4 target set enforced by `_dev/verify-fork-rollout.ts`): `brief-landing-page`, `brief-graphic`, `produce-asset`, `brief-shortform`, `produce-video`, `write-social`, `publish-social`, `write-ad`.
- **Tool-redirect family** (must cite [`tool-redirect.md`](tool-redirect.md)): `brief-product-ui`, `map-user-flow`.

All other skills: `applicable: false`. (The U2 tool-target rollout will extend this family; extend the harness map when it lands.)

| Check | id | Passes when |
|---|---|---|
| Required cite present | `required_cite` | The family's required reference is cited in the SKILL.md body |
| Execution section | `execution_section` | (Execution-fork family only) an `## Execution` section exists |

Score: all applicable checks → 2 · cite missing but some tool-fork language present → 1 · nothing → 0.

### D5. `budget` — budget compliance

Measurement matches `_dev/audit-skill-budget.ts`: body = SKILL.md minus frontmatter; tokens ≈ chars ÷ 4; caps per [`mode-resolver.md`](mode-resolver.md) § "Compactness caps" (fast 800 / standard 1500 / deep 2500).

| Check | id | Passes when |
|---|---|---|
| Tier declared | `tier_declared` | Frontmatter declares `budget: fast\|standard\|deep` (or a documented `BUDGET_EXCEPTION` marker explains why none applies) |
| Within cap | `within_cap` | Body token estimate ≤ tier cap, or a documented `BUDGET_EXCEPTION` marker |

Score: both → 2 · tier declared but over cap without exception → 1 · no tier and no exception → 0.

### D6. `redundancy` — redundancy/overlap declaration

Scored on **declaration hygiene only**. Actual overlap adjudication (the `evaluate-*` family, SEO/AEO, …) is **human judgment in the U6 disposition report — never auto-scored.** The harness lists `overlap_candidates` (siblings named in `not_when` plus same-verb-prefix siblings) as input to that judgment.

| Check | id | Passes when |
|---|---|---|
| `not_when` declared | `not_when` | `routing.yaml` `route.not_when` has ≥1 entry |
| Siblings named | `siblings_named` | ≥1 `not_when` entry (or the description's "Not for …" clause) names a sibling skill id |

Score: both → 2 · `not_when` present but no sibling named → 1 · no `not_when` → 0.

### D7. `registration` — registration hygiene

| Check | id | Passes when |
|---|---|---|
| Plugin manifest | `plugin_manifest` | The skill's path appears in `.claude-plugin/plugin.json` `skills[]` |
| Routing sidecar | `routing_yaml` | `routing.yaml` exists next to SKILL.md |
| Trigger evals | `trigger_evals` | `skills/tests/triggers/<id>.jsonl` exists and is non-empty |

Score: 3/3 → 2 · 1–2/3 → 1 · 0/3 → 0.

---

## Advisory dimensions (rubric v2 — 2026 conformance)

Six flag-only dimensions added 2026-06-12 (wave-2 plan U3, R5/R6/R7). They measure conformance with 2026 agent-skill best practices. **None of them is a hard gate**: a flagged advisory dimension is a finding for the wave-2 disposition report (operator-adjudicated), never a floor failure. Mechanical checks live in the harness; judgment checks (read-this-when link copy *quality*, content staleness) stay rubric prompts for the human audit pass.

**Harness-volatile constants.** Several checks pin numbers that come from external runtime docs, can change under us, and do not describe Codex/Cursor installs of the same plugin. That is exactly why these dimensions are advisory, not gates. Source + date beside each constant; re-verify at the next harness major:

| Constant | Value | Source | Recorded |
|---|---|---|---|
| Combined `description` + `when_to_use` cap | 1,536 chars (`maxSkillDescriptionChars`) | code.claude.com/docs/en/settings | 2026-06-12 |
| Compaction re-attach budget, per skill | first ~5k tokens of the body | code.claude.com/docs/en/skills (compaction behavior) | 2026-06-12 |
| Compaction re-attach budget, combined | ~25k tokens across all re-attached skills | code.claude.com/docs/en/skills | 2026-06-12 |
| Listing eviction order | least-used skills' descriptions collapse to name-only first, under `skillListingBudgetFraction` | code.claude.com/docs/en/settings | 2026-06-12 |

### A1. `description_trigger` — description-as-trigger quality

The frontmatter `description` is a routing trigger, not a manual. Checks (heuristic, advisory):

| Check | id | Flags when |
|---|---|---|
| No workflow summary | `no_workflow_summary` | The description narrates the skill's internal workflow (step-sequence connectives like "first … then … finally", `Step N`, or `A → B → C` chains) instead of stating when to invoke it |
| Front-loaded use case | `use_case_front_loaded` | No use/trigger cue ("use when/after/for", "when the user …", "not for …") appears **at all**, or a description longer than 600 chars buries its cue in the back half. **Recalibrated wave-2 (U5/M1):** a compact description (≤600 chars) is read in full for routing, so the house grammar — *"[what]. Use [when]. Not for [boundary]."* — with the cue mid-string is conformant, not a defect; only cue-absence or genuine length triggers a flag |
| Third person | `third_person` | First-person voice ("I …", "my …", "we …") in the description |

### A2. `listing_budget` — combined description footprint *(advisory mirror)*

Flags when `description` + `when_to_use` exceed the 1,536-char host cap. The **hard gate** for this lives in `_dev/audit-skill-listing.ts --check` (host cap 1,536 + the tighter 520-char stack cap, gated since W1-D) — this dimension only mirrors the host-cap state into the scorecard so the audit report sees it; it is not a second enforcement point.

### A3. `compaction_survival` — load-bearing content in the first ~5k tokens

After compaction the runtime re-attaches only the first ~5k tokens of a skill body (constant table above). Flags when the body exceeds ~5k tokens AND load-bearing machinery (the critic/quality-gate section or the completion-status contract) sits past the 5k boundary — i.e. the part that keeps output honest would be evicted. Bodies ≤5k tokens pass trivially (the stack's budget caps already keep almost every skill far below this).

### A4. `reference_organization` — reference depth + navigability

| Check | id | Flags when |
|---|---|---|
| One level deep | `nesting_depth` | A `references/**/*.md` file sits more than one directory level below `references/` (e.g. `references/a/b/file.md`) — current guidance keeps references one hop from SKILL.md |
| TOC in long references | `long_ref_navigable` | A non-`_shared` reference file over 100 lines has fewer than 2 markdown headings (no internal navigation surface) |

Read-this-when link *copy quality* ("**X**: see `file.md` for Y — load when Z") is judgment — audited by the human pass, not this harness.

### A5. `imperative_density` — imperative-wall detection

Flags when the body contains ≥8 ALL-CAPS `ALWAYS`/`NEVER` tokens. Walls of unexplained imperatives crowd out model judgment; rule-plus-rationale prose (lowercase "always/never … because …") does not trip this check and is the preferred form. Threshold calibrated 2026-06-12: the worst current in-cohort count is 6.

### A6. `frontmatter_levers` — frontmatter-lever adjudication input

Pure adjudication input for the wave-2 report (R7) — records state, **never flags**. Per skill it reports:

- `disable-model-invocation` — declared or not (candidate: operator-only workflows)
- `user-invocable: false` — declared or not (candidate: background-knowledge skills)
- `context: fork` — declared or not (candidate: task-shaped runners; note the naming collision with the stack's own execution-fork vocabulary)
- `${CLAUDE_SKILL_DIR}` — whether bundled `scripts/` cites in the body use the portable variable

Whether each lever *should* be applied is per-skill operator judgment in the disposition report — applied where it fits, declined with a reason where it doesn't. Never blanket-applied.

### What v2 deliberately does NOT score

No advisory dimension rewards specification density, prescription count, or rubric strictness. The U12 creativity loosening (approved 2026-06-12) is settled: a v2 finding that would re-tighten an outcome-quality rubric is auto-rejected unless it cites a brand/safety/claims floor. Leaner and more permissive skills must never score worse on A1–A6 than denser ones.

---

## Disposition classes

The scorecard feeds a per-skill **disposition** decided by the operator in U6 (the harness only ever emits the VENDORED hint — every other class is human judgment):

| Class | Meaning |
|---|---|
| **KEEP** | Clears the bar as-is; no in-wave work |
| **IMPROVE** | Stays, with named scorecard gaps to fix (the disposition must cite the failing dimension/check) |
| **MERGE** | Capability survives inside another skill; this id is absorbed (combined trigger sets, redirect stub for one release) |
| **RETIRE** | Capability removed; redirect stub for one release, all registration surfaces swept |
| **VENDORED** | Vendored upstream skill — excluded from the scoring cohort; never structurally scored, never auto-improved in place |

---

## JSON scorecard schema

`bun _dev/eval/critic-gate.ts <skill> --json` emits exactly this shape (one object, stable key order). The U6 report generator consumes it unchanged — schema changes require bumping `schema` and updating `audit-stack.ts` in the same commit.

```json
{
  "schema": "skill-audit-scorecard/v1",
  "skill": {
    "id": "write-copy",
    "stack": "marketing",
    "path": "skills/marketing/write-copy",
    "version": "1.1.0",
    "budget_tier": "deep"
  },
  "generated_at": "2026-06-11T00:00:00.000Z",
  "disposition_hint": null,
  "critic_rubric_source": "own",
  "dimensions": [
    {
      "key": "effectiveness",
      "label": "Effectiveness vs stated promise",
      "applicable": true,
      "score": 2,
      "max": 2,
      "checks": [
        { "id": "coherence", "ok": true, "detail": "31/38 significant description terms found in body (82%)" },
        { "id": "worked_example", "ok": true, "detail": "Worked Example heading present" },
        { "id": "orchestration", "ok": true, "detail": "routing.yaml orchestration block present" }
      ]
    }
  ],
  "score": { "points": 13, "max": 14, "percent": 93 },
  "floor": { "min_percent": 65, "no_zero_dimensions": true },
  "pass": true,
  "findings": [],
  "overlap_candidates": ["write-social", "write-ad", "write-outreach", "write-docs"],
  "errors": [],
  "advisory": {
    "rubric": "2026-v2",
    "note": "flag-only 2026-conformance dimensions — never part of points/max/pass",
    "dimensions": [
      {
        "key": "description_trigger",
        "label": "Description-as-trigger quality",
        "flagged": false,
        "checks": [
          { "id": "no_workflow_summary", "ok": true, "detail": "no workflow-narration pattern in description" }
        ]
      }
    ]
  }
}
```

Field contracts:

- `schema` — fixed literal `"skill-audit-scorecard/v1"`.
- `skill.id` / `skill.stack` / `skill.path` — current id, stack folder, repo-relative skill dir. `skill.version` is `metadata.version` or `null`; `skill.budget_tier` is the declared tier or `null`.
- `disposition_hint` — `"VENDORED"` for vendored skills, otherwise `null`. KEEP/IMPROVE/MERGE/RETIRE are never emitted by the harness.
- `critic_rubric_source` — `"own"` | `"thin-fallback"` | `"n/a"` (vendored).
- `dimensions[]` — all seven, in the D1–D7 order above, each with key/label/applicable/score/max/checks. For vendored skills the array is empty.
- `score` — points/max/percent computed over `applicable: true` dimensions only. Vendored: `{ "points": 0, "max": 0, "percent": null }`.
- `pass` — the floor verdict (vendored skills: `true`, they are out of cohort).
- `findings[]` — human-readable strings, one per failed check or recorded fallback/drift note.
- `overlap_candidates[]` — sibling ids for human overlap judgment; informational, never scored.
- `errors[]` — non-fatal analysis errors (unreadable routing.yaml, malformed frontmatter, …). Errors are findings, not exceptions — the harness never crashes on a malformed skill.
- `advisory` — **additive v2 extension (2026-06-12)**, still schema `skill-audit-scorecard/v1`: the scored contract above is byte-compatible; consumers that predate v2 ignore the extra key. `advisory.dimensions[]` carries the A1–A6 results (`key`/`label`/`flagged`/`checks[]`), in the A1–A6 order. Flagged advisory checks also append human-readable strings to `findings[]` prefixed `advisory/`. Advisory results never affect `score`, `floor`, or `pass`, and the golden-regression net never compares them. Vendored skills: `advisory` omitted.

---

## Anti-patterns

1. **Treating the harness verdict as the disposition.** The scorecard is evidence; the operator decides KEEP/IMPROVE/MERGE/RETIRE per skill in U6. Exit 1 means "below floor", not "retire".
2. **Auto-scoring overlap.** D6 scores *declaration hygiene*; whether two siblings should merge is adjudicated by a human reading both, with `overlap_candidates` as the shortlist.
3. **Scoring vendored skills structurally.** A vendored skill failing six dimensions is noise — it was admitted under an explicit exception policy. VENDORED short-circuits scoring.
4. **Chasing the percent instead of the zeros.** A skill at 70% with a zero on `critic` is in worse shape than one at 60% with all-1s — the floor's no-zero rule exists because each dimension is a Quality Standard pillar.
5. **Editing the schema without bumping it.** U6's report generator consumes the JSON unchanged; field renames or reorderings without a `schema` bump silently corrupt the cohort report.

---

## Related refs

- [`thin-critic-rubric.md`](thin-critic-rubric.md) — the fallback rubric for skills with no critic gate of their own
- [`shared-critic-rubrics.md`](shared-critic-rubrics.md) — the full multi-dim rubric library skills import from
- [`mode-resolver.md`](mode-resolver.md) — budget tiers + compactness caps (D5's measurement contract)
- [`pre-dispatch-protocol.md`](pre-dispatch-protocol.md) — cold-start question registry (D3)
- [`execution-fork.md`](execution-fork.md) / [`tool-redirect.md`](tool-redirect.md) — the tool-ask family contracts (D4)
