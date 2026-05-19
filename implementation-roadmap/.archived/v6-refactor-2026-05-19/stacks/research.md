# Stack — Research-Skills

**Repo:** `research-skills/`
**Skills:** 8
**Total body lines (baseline):** 3,589
**Average body lines:** 449
**Refactor phase:** Phase 5 (after product stack ships in Phase 4)
**Order rationale:** Reference-heavy by nature — refs are the value (methodology, frameworks, reference data). Different problem shape than meta/product: question is less "extract procedure from body" and more "ensure rich refs load lazily on the right branch." Tests the protocol on its hardest dimension.

---

## Refactor order

| # | Skill | Body lines | Classification | Why this slot |
|---|---|---|---|---|
| 1 | **orchestrate-research** | 309 | router | Apply orchestrate-meta pattern (proven). |
| 2 | **short-form-research** | 332 | mixed (structural collection, creative synthesis) | Pre-publish catalog, lowest stakes. Validates ref-heavy lazy-load. |
| 3 | **short-form-eval** | 358 | structural | Eval skill — contract-sensitive. Reads from short-form-research; refactor together if contracts touch. |
| 4 | **funnel-planner** | 443 | structural | Numeric target-setting after prioritization, clear procedure. |
| 5 | **prioritize** | 495 | structural | ICE scoring + tradeoff analysis. |
| 6 | **diagnose** | 533 | structural | Root-cause analysis, hypothesis testing logic. |
| 7 | **icp-research** | 540 | creative (persona narrative) + structural (interview synthesis) | Highest creative content in research stack. Refs become opinions/examples. |
| 8 | **market-research** | 579 | structural (analysis frameworks) | Largest in stack. Lots of framework refs likely. |

---

## Per-skill notes

### 1. orchestrate-research (309 lines)

**Refactor watch-outs:**
- Mirror orchestrate-meta + orchestrate-product post-refactor structure.
- Should be the thinnest router pattern.

**Body target:** ≤150 lines.

**Fixtures:**
- minimal: "research X" with clear question
- standard: full research workflow (icp + market)
- stretch: cross-cutting research → diagnose → prioritize chain

---

### 2. short-form-research (332 lines)

**Refactor watch-outs:**
- Per-platform catalog logic — refs by platform (`references/platforms/tiktok.md`, etc.). Load only platforms user requested.
- Output: `.agents/skill-artifacts/research/short-form-research/[slug].md` — consumed by `short-form-brief` (different stack — marketing) and `short-form-eval` (this stack). Contract is HIGH-risk; touch with care.
- This is the canary for ref-heavy refactoring. If we can lazy-load platform refs cleanly here, the pattern scales.

**Body target:** ≤200 lines.

**Fixtures:**
- minimal: TikTok-only catalog for one topic
- standard: TikTok + Reels + Shorts catalog for a clearly-defined topic
- stretch: all 5 platforms (incl. X + LinkedIn opt-in) for a multi-topic catalog

**Side note on contract:** the artifact at `.agents/skill-artifacts/research/short-form-research/[slug].md` is consumed by `marketing-skills/short-form-brief` AND `research-skills/short-form-eval`. The contract spans stacks. Refactor with both downstream consumers visible.

---

### 3. short-form-eval (358 lines)

**Refactor watch-outs:**
- Reads short-form-brief output (marketing stack) + short-form-research catalog (this stack) + published post URL.
- v0.1 rubric is provisional with mandatory revision after cycle 2-3 — that revision logic might already be in body. Keep it.
- Writes to `skills-resources/loops/[slug]/evals/<date>-cycle-N.md` + appends `results.tsv` — HIGH-risk contract.

**Body target:** ≤200 lines.

**Fixtures:**
- minimal: 1 post evaluation
- standard: cycle-2 evaluation with rubric application
- stretch: cycle-3+ evaluation with rubric revision

---

### 4. funnel-planner (443 lines)

**Refactor watch-outs:**
- Numeric target-setting — formulas and conversion-rate benchmarks → `references/benchmarks/` by industry/channel.
- Decision logic for which funnel stages to plan → body.

**Body target:** ≤200 lines.

**Fixtures:**
- minimal: single-stage target setting
- standard: full TOFU→BOFU funnel for a defined channel
- stretch: multi-channel funnel with cross-channel attribution assumptions

---

### 5. prioritize (495 lines)

**Refactor watch-outs:**
- ICE scoring framework + AI-assisted effort table (from CLAUDE.md "Effort Compression") → refs.
- Brainstorming patterns → `references/option-generation.md`.
- Output: `.agents/skill-artifacts/meta/sketches/prioritize-*.md` — preserve path.

**Body target:** ≤200 lines.

**Fixtures:**
- minimal: prioritize 3 options for a clear goal
- standard: prioritize 8 initiatives across multiple constraints
- stretch: prioritize a 20-item backlog with dependencies

---

### 6. diagnose (533 lines)

**Refactor watch-outs:**
- 5-whys / hypothesis testing logic → body (it's the core skill).
- Common failure patterns → `references/failure-patterns.md`.
- Per-domain diagnostic playbooks (eg. conversion drop, latency regression) → `references/playbooks/`.

**Body target:** ≤220 lines.

**Fixtures:**
- minimal: diagnose a clear metric drop with one variable
- standard: diagnose a multi-cause regression
- stretch: diagnose a systemic issue with conflicting signals

---

### 7. icp-research (540 lines) — creative-leaning

**Refactor watch-outs:**
- **Creative refactor pattern applies** (per [`04-protocol.md`](./04-protocol.md) Step 3).
- Persona narrative is creative — refs become voice/style examples, not rules.
- Interview synthesis methodology is structural — strict refs (jobs-to-be-done framework, switch interview techniques).
- Output: `research/icp-research.md` (canonical, top-level) — preserve frontmatter strictly.
- Critic for the persona narrative side: thin rubric (check craft floor, not house-style); critic for the synthesis side: full rubric (factual accuracy, evidence cited).

**Body target:** ≤280 lines (creative gets bump, mixed adds more).

**Fixtures:**
- minimal: synthesize 1 interview transcript into persona
- standard: synthesize 5 transcripts + survey data
- stretch: full ICP build from cold (multiple sources, segment hypothesis testing)

---

### 8. market-research (579 lines) — largest in stack

**Refactor watch-outs:**
- TAM/SAM/SOM sizing methodology → `references/sizing-methodology.md`.
- Competitive analysis frameworks → `references/frameworks/` (multiple).
- Whitespace identification logic → `references/whitespace-patterns.md`.
- Output: `research/market-research.md` (canonical) — preserve frontmatter strictly.

**Body target:** ≤220 lines.

**Fixtures:**
- minimal: competitive scan of a small market
- standard: full TAM/SAM/SOM + competitive landscape
- stretch: cross-segment analysis with whitespace identification + entry strategy

---

## Phase 5 — Research audit (before any refactor)

```bash
for skill in orchestrate-research short-form-research short-form-eval funnel-planner prioritize diagnose icp-research market-research; do
  for kind in minimal standard stretch; do
    bun meta-skills/scripts/harness/runner.ts --skill $skill --input .agents/skill-artifacts/meta/records/harness/inputs/$skill-$kind.md
  done
  bun meta-skills/scripts/harness/report.ts --skill $skill > .agents/skill-artifacts/meta/records/harness/baseline/$skill-report.md
done
```

---

## Cross-stack dependencies

Research-skills depend on:

- `_shared/mode-resolver.md` (from meta) — every skill
- `_shared/anti-sycophancy.md` (from meta) — esp. `diagnose`, `prioritize`, `icp-research`
- Output of `icp-research`/`market-research` consumed by every marketing skill — preserve canonical frontmatter strictly

Cross-stack contract (the share-with-marketing one):
- `short-form-research`'s catalog at `.agents/skill-artifacts/research/short-form-research/[slug].md` consumed by `marketing-skills/short-form-brief`. **Refactor that contract atomically with the marketing-side consumer.**

---

## Creative-skill ref pattern (used heavily in this stack)

For `icp-research` (and later `copywriting`, `brand-system`, etc. in marketing):

```markdown
## references/voice-examples.md

**Load when:** [skill] enters narrative-synthesis phase.
**Use as:** opinions and examples to triangulate from. Output need not conform exactly.

---

### Voice example 1 — direct, low-affect
[example output]

### Voice example 2 — warm, narrative
[example output]

### Voice example 3 — analytical, evidence-forward
[example output]

---

**Note to agent:** these are illustrative ranges, not a closed set. Match the brief's voice axis, not the closest example.
```

Contrast with structural ref pattern:

```markdown
## references/sizing-methodology.md

**Load when:** market-research enters TAM/SAM/SOM phase.
**Use as:** authoritative procedure. Follow steps in order.

---

### Step 1 — define the addressable market
[procedure]

### Step 2 — apply geographic and segment filters
[procedure]
...
```

Both patterns enforce lazy-loading. Tone is different. Critic load is different.

---

## Stack completion criteria

Research stack is "done" when:

- [ ] All 8 skills shipped at status `shipped` in [`progress.md`](./progress.md)
- [ ] Average body lines for research stack ≤220 (down from 449, ~51% reduction)
- [ ] All 8 skills have 3 fixtures committed
- [ ] Creative-skill ref pattern documented + used in `icp-research`
- [ ] Cross-stack contract with `short-form-brief` preserved (verified by harness)
- [ ] No critic-gate retained without measured ROI ≥30%
- [ ] `research-skills/CHANGELOG.md` has entries for each refactor
- [ ] `research-skills` GitHub Releases published
- [ ] Umbrella `marketplace.json` bumped
- [ ] Handoff log entry: "Research stack refactor complete"
