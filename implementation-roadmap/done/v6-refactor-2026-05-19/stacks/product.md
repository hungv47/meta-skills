# Stack — Product-Skills

**Repo:** `product-skills/`
**Skills:** 6
**Total body lines (baseline):** 2,530
**Average body lines:** 422
**Refactor phase:** Phase 4 (after meta stack ships in Phase 3)
**Order rationale:** Small surface, mostly structural skills. Outputs are inspectable (code, docs, flows). Lowest creative ambiguity in the stack. Second after meta because patterns transfer cleanly.

---

## Refactor order

| # | Skill | Body lines | Classification | Why this slot |
|---|---|---|---|---|
| 1 | **orchestrate-product** | 321 | router | Apply the orchestrate-meta pattern (already proven in Phase 3). Should be near-identical structure. |
| 2 | **code-cleanup** | 356 | structural | Has 5 golden rules as hard safety gate — verify they stay in body. |
| 3 | **system-architecture** | 389 | structural | Tech-stack decision logic in body, schemas/examples to refs. |
| 4 | **machine-cleanup** | 430 | structural | Auth + confirmation safety gates stay in body; per-target rules → refs. |
| 5 | **user-flow** | 516 | mixed (mostly structural, framing creative) | Platform-specific touchpoint specs → refs by platform. |
| 6 | **docs-writing** | 518 | mixed (structural format, creative voice) | Multiple modes (README, ship-log, release-notes) — refs by mode. |

---

## Per-skill notes

### 1. orchestrate-product (321 lines)

**Refactor watch-outs:**
- Should mirror `orchestrate-meta` post-refactor structure exactly. If they end up structurally different, one of them has body bloat that should've been cut.
- Workflow-graph belongs in `references/workflow-graph.md`.
- Sub-skill invocation knowledge should be minimal — defer to each sub-skill's own SKILL.md.

**Body target:** ≤150 lines.

**Fixtures needed:**
- minimal: "build feature X" with clear scope
- standard: "redesign module Y" requiring architecture + flow + breakdown
- stretch: "ship product Z" full lifecycle invocation

---

### 2. code-cleanup (356 lines)

**Refactor watch-outs:**
- **CRITICAL:** the 5 golden rules are a hard safety gate per CLAUDE.md. They MUST stay in body. Do not move them to a ref.
- Per-language refactor heuristics → `references/refactor-by-language.md`.
- Anti-pattern catalog → `references/anti-patterns.md` (loaded at critique time).
- Output artifact: `.agents/skill-artifacts/meta/records/[date]-cleanup-<slug>.md` — preserve contract.

**Body target:** ≤200 lines (safety gates take some lines).

**Fixtures needed:**
- minimal: clean one file
- standard: clean a module (multi-file)
- stretch: clean a feature area with cross-cutting concerns

---

### 3. system-architecture (389 lines)

**Refactor watch-outs:**
- The decision logic (when to use Postgres vs. SQLite, when REST vs. GraphQL, etc.) is the value — keep it discoverable in body.
- Worked examples of past architectures → `references/examples/`.
- Tech-stack matrices → `references/tech-stack-matrix.md`.
- Output: `architecture/system-architecture.md` (canonical) — preserve frontmatter strictly.

**Body target:** ≤200 lines.

**Fixtures needed:**
- minimal: pick a stack for a CRUD app
- standard: design schema + API for a defined feature
- stretch: full architecture for a multi-service product

---

### 4. machine-cleanup (430 lines)

**Refactor watch-outs:**
- Auth + per-deletion confirmation flow are safety gates — stay in body.
- Per-target classification rules (dotfolders, caches, etc.) → `references/targets/` (one ref per target type).
- Risk assessment heuristics → `references/risk-assessment.md`.

**Body target:** ≤200 lines.

**Fixtures needed:**
- minimal: audit `~/.cache/`
- standard: full machine audit, dry-run report
- stretch: full machine audit + interactive cleanup of multiple targets

---

### 5. user-flow (516 lines)

**Refactor watch-outs:**
- Platform-native touchpoint specs (iOS Live Activity, macOS menu bar, Android widgets, etc.) are the bulky content — refs by platform: `references/platforms/ios.md`, `.../android.md`, `.../macos.md`, etc. Load only the platform the flow targets.
- Output: `.agents/skill-artifacts/product/flow/<flow-name>.md` + auto-generated `index.md` — preserve auto-gen logic.
- Body keeps: the multi-step flow decomposition logic, decision/transition modeling primitives.

**Body target:** ≤250 lines (mixed gets slight bump).

**Fixtures needed:**
- minimal: single-screen flow
- standard: multi-screen flow with platform touchpoints
- stretch: cross-platform flow (iOS + macOS coordination)

---

### 6. docs-writing (518 lines)

**Refactor watch-outs:**
- Multiple modes (README, API ref, setup, runbook, ship-log, release-notes) — each becomes a ref: `references/modes/readme.md`, `.../release-notes.md`, etc. Body picks one based on user request.
- Ship-log writes to `research/product-context.md` (canonical) — preserve contract.
- Release-notes mode enforces RELEASING.md conventions — that enforcement logic is structural, stays in body or a dedicated ref.

**Body target:** ≤220 lines.

**Fixtures needed:**
- minimal: write a README for a small package
- standard: ship-log entry for a feature release
- stretch: full API reference + setup guide

---

## Phase 4 — Product audit (before any refactor)

After meta stack ships, run audit on all 6 product skills:

```bash
for skill in orchestrate-product code-cleanup system-architecture machine-cleanup user-flow docs-writing; do
  for kind in minimal standard stretch; do
    bun meta-skills/scripts/harness/runner.ts --skill $skill --input .agents/skill-artifacts/meta/records/harness/inputs/$skill-$kind.md
  done
  bun meta-skills/scripts/harness/report.ts --skill $skill > .agents/skill-artifacts/meta/records/harness/baseline/$skill-report.md
done
```

Then refactor in the order listed.

---

## Cross-stack dependencies

Product-skills depend on these meta-skills shared refs (synced from meta stack post-refactor):

- `_shared/mode-resolver.md` — every skill
- `_shared/anti-sycophancy.md` — `code-cleanup`, `user-flow`, `docs-writing`
- `_shared/artifact-contract-template.md` — `system-architecture`, `user-flow`, `docs-writing` (anything producing a canonical artifact)

If meta sync mechanism breaks → product refactor blocks. Verify before starting Phase 4.

---

## Stack completion criteria

Product stack is "done" when:

- [ ] All 6 skills shipped at status `shipped` in [`progress.md`](./progress.md)
- [ ] Average body lines for product stack ≤200 (down from 422, ~52% reduction)
- [ ] All 6 skills have 3 fixtures committed
- [ ] All shared refs syncing from meta stack
- [ ] No critic-gate retained without measured ROI ≥30%
- [ ] `product-skills/CHANGELOG.md` has entries for each refactor
- [ ] `product-skills` GitHub Releases published
- [ ] Umbrella `marketplace.json` bumped
- [ ] Handoff log entry: "Product stack refactor complete"
