# Stack — Marketing-Skills

**Repo:** `marketing-skills/`
**Skills:** 14
**Total body lines (baseline):** 6,969
**Average body lines:** 498
**Refactor phase:** Phase 6 (after research stack ships in Phase 5)
**Order rationale:** Largest stack, most creative-leaning, biggest external visibility (operator's marketing outputs are user-facing). Apply pattern only after it's proven 3x on smaller stacks. Most refactor regression risk; most leverage if it works.

---

## Refactor order

Grouped by classification, lowest-risk first within each group.

### Phase 6a — Routers + structural (lowest risk)

| # | Skill | Body lines | Classification | Why this slot |
|---|---|---|---|---|
| 1 | **orchestrate-marketing** | 356 | router | Apply orchestrate-* pattern (now proven across 3 stacks). |
| 2 | **seo** | 558 | structural (compliance-driven) | Hard rules dominate. Refactor as structural skill. |
| 3 | **lp-eval** | 303 | structural | Eval skill reading lp-brief output. Contract-sensitive. Touch with care. |

### Phase 6b — Creative skills (the heart of the stack)

| # | Skill | Body lines | Classification | Why this slot |
|---|---|---|---|---|
| 4 | **social-copy** | 301 | creative | Platform-specific char limits = structural; copy generation = creative. Smallest creative — start here. |
| 5 | **vn-tone** | 508 → 201 (-60.4%) | creative | **SHIPPED 2026-05-18 (marketing-stack slot 5).** Post-translation polish. 4 registers + 2 subvariants preserved byte-identical. |
| 6 | **humanize** | 545 → 230 (-57.8%) | creative | **SHIPPED 2026-05-18 (marketing-stack slot 6).** AI-pattern stripping; EN polish-chain endpoint (sibling to vn-tone for VN). 47-pattern catalog + 9 Absolute Prohibitions + detector-resistance + protected_tokens contract preserved byte-identical. |
| 7 | **short-form-brief** | 371 → 183 (-50.7%) | creative | **SHIPPED 2026-05-18 (marketing-stack slot 4).** Reads short-form-research catalog. Cross-stack contract preserved byte-identical. |
| 8 | **cold-outreach** | 537 | creative | Per-channel craft refs. |
| 9 | **copywriting** | 538 | creative | Horizontal skill — many surfaces. Refs by surface type. |
| 10 | **ad-copy** | 516 | creative + hard safety gate | Policy compliance + claim substantiation MUST stay in body as hard gates. |

### Phase 6c — Mixed and largest (highest risk)

| # | Skill | Body lines | Classification | Why this slot |
|---|---|---|---|---|
| 11 | **campaign-plan** | 470 | structural orchestration + creative direction | Complex. Refactor after creative pattern is proven on simpler skills. |
| 12 | **design-brief** | 574 | creative (asset design) | Per-platform asset specs → refs. |
| 13 | **brand-system** | 644 | creative (3-artifact output: BRAND.md, DESIGN.md, ASSETS.md) | Most creative skill in stack. Refs are *opinions*. |
| 14 | **lp-brief** | 748 | **mixed; largest body in entire stack** | Conversion-principles gate (structural) + copy candidates (creative) + asset slots (creative). Most complex refactor. Save for last. |

---

## Per-skill notes

### 1. orchestrate-marketing (356 lines)

Mirror orchestrate-* pattern. Workflow-graph to ref. Body ≤150 lines.

Fixtures: minimal (one campaign asset), standard (full campaign), stretch (multi-campaign with cross-skill chain).

---

### 2. seo (558 lines)

**Watch-outs:**
- Compliance rules (E-E-A-T, structured data, internal linking) — structural, keep in body or strict ref.
- Variant generation (titles, metas) — creative side, use looser ref pattern.
- Body target: ≤230 lines (mixed).

---

### 3. lp-eval (303 lines)

**Watch-outs:**
- Reads `lp-brief` output. HIGH-risk contract.
- Refactor in tandem with `lp-brief` if any contract field needs to move.
- Body target: ≤200 lines.

---

### 4. social-copy (301 lines)

**Watch-outs:**
- Already smallest creative skill — good baseline.
- Per-platform spec (char limits, CTA placement) → `references/platforms/<platform>.md`.
- Hook archetypes → `references/hook-archetypes.md` (creative — examples, not rules).
- Output: `.agents/skill-artifacts/mkt/copy/[platform]-[date]-[slug].md` — preserve.
- Body target: ≤220 lines.

---

### 5. vn-tone (508 lines)

**Watch-outs:**
- 4 registers (báo chí, semi-casual, bro, pop-marketing) → refs per register.
- Common Vietnamese translation traps (pronoun drift, particles, idioms, passive calques) → `references/translation-traps.md`.
- Body target: ≤230 lines (creative + multi-register).

---

### 6. humanize (545 lines)

**Watch-outs:**
- AI-pattern catalog (em-dashes, "delve", listicle structure, etc.) → `references/ai-patterns.md`.
- Compression heuristics → `references/compression.md`.
- 15% word reduction target stays in body (it's the contract).
- Body target: ≤230 lines.

---

### 7. short-form-brief (371 lines)

**Watch-outs:**
- Reads `short-form-research` catalog (cross-stack contract — preserved per research stack refactor).
- Hook/shot/text/audio/caption/CTA spec → refs by component.
- Live-action vs. motion-graphic production modes → refs by mode.
- 1 hero + max 2 variants — that constraint stays in body.
- Body target: ≤230 lines.

---

### 8. cold-outreach (537 lines)

**Watch-outs:**
- Per-channel craft (email, LinkedIn, Twitter, iMessage, platform proposals) → refs per channel.
- Signal-based personalization templates → `references/personalization.md`.
- Reply-to-inbound mode vs. first-touch compose mode → branch in body, refs per mode.
- Body target: ≤240 lines.

---

### 9. copywriting (538 lines)

**Watch-outs:**
- Horizontal skill — many surfaces (headlines, hooks, CTAs, taglines, section copy).
- Refs by surface type: `references/surfaces/headline.md`, `.../cta.md`, etc.
- Rubric for scoring stays — it's the differentiator. But thin it per creative-skill pattern (craft floor not house-style).
- Body target: ≤240 lines.

---

### 10. ad-copy (516 lines)

**Watch-outs:**
- **CRITICAL:** policy refusal logic + claim substantiation = HARD safety gates. STAY IN BODY.
- Audience-temperature framing (warm vs. cold) → branch with per-temp refs.
- Char-cap enforcement → body (structural).
- 7-dimension rubric → ref (loaded when critic fires).
- Output: `.agents/skill-artifacts/mkt/ad-copy/[audience-temp]-[date]-[slug].md` (+ `.rationale.md` + `.critic-score.md`) — preserve all 3 file outputs.
- Body target: ≤260 lines (safety gates take space).

---

### 11. campaign-plan (470 lines)

**Watch-outs:**
- Multi-skill orchestrator + strategic plan in one.
- Distribution model refs (clipping-and-live, paid, organic, partnership) → `references/distribution-models/` (already exists in some form per CHANGELOG).
- Calendar logic stays in body.
- Body target: ≤230 lines.

---

### 12. design-brief (574 lines)

**Watch-outs:**
- Per-asset-type specs (IG carousel, YouTube thumbnail, OOH, etc.) → refs per asset type.
- Image-gen prompt template → `references/imagegen-prompt-template.md`.
- Designer-handoff template → `references/designer-handoff-template.md`.
- Accessibility minimums = hard gate — stay in body.
- Output: `.agents/skill-artifacts/mkt/design-briefs/[slug].md` — preserve.
- Body target: ≤260 lines.

---

### 13. brand-system (644 lines)

**Watch-outs:**
- **Creative refactor pattern fully applies** — refs are opinions, not rules.
- 3 artifacts produced: BRAND.md, DESIGN.md, ASSETS.md — each has its own contract.
- Refs by component: `references/voice-archetypes.md`, `.../palette-systems.md`, `.../component-tokens.md`.
- ASSETS.md has auto-scan checkbox logic — preserve.
- Body target: ≤280 lines.

---

### 14. lp-brief (748 lines) — LARGEST IN ENTIRE STACK

**Watch-outs:**
- **HIGHEST RISK refactor in the entire program.** Save for last in marketing. Apply patterns proven across 13 prior skills.
- Mixed classification — declare in frontmatter:
  ```yaml
  classification: mixed
  structural_sections: [conversion-gate, section-rhythm, asset-slots]
  creative_sections: [copy-candidates, hand-off-prompts]
  ```
- Conversion-principles gate = HARD STRUCTURAL — stays in body or strict ref.
- Section rhythm = structural — strict spec ref.
- Copy candidates = creative — looser rubric.
- Hand-off prompts (to Claude Design, Figma, design-brief) = creative — looser rubric.
- Output: `.agents/skill-artifacts/mkt/lp-brief/[slug]/brief.md` — consumed by `lp-eval`. HIGH-risk contract. Refactor with `lp-eval` open simultaneously.
- Body target: ≤300 lines (largest mixed skill gets ceiling bump).

**Fixtures:**
- minimal: single-section CTA optimization brief
- standard: full landing page brief for a defined product
- stretch: full redesign brief for an existing LP with conversion data

---

## Phase 6 — Marketing audit (before any refactor)

```bash
for skill in orchestrate-marketing seo lp-eval social-copy vn-tone humanize short-form-brief cold-outreach copywriting ad-copy campaign-plan design-brief brand-system lp-brief; do
  for kind in minimal standard stretch; do
    bun meta-skills/scripts/harness/runner.ts --skill $skill --input .agents/skill-artifacts/meta/records/harness/inputs/$skill-$kind.md
  done
  bun meta-skills/scripts/harness/report.ts --skill $skill > .agents/skill-artifacts/meta/records/harness/baseline/$skill-report.md
done
```

42 harness runs (14 skills × 3 fixtures). Largest audit phase in the program. Budget a full session.

---

## Cross-stack dependencies (most complex of any stack)

Marketing-skills consume:

- `_shared/mode-resolver.md` (from meta) — every skill
- `_shared/anti-sycophancy.md` (from meta) — every creative skill especially
- `marketing-foundations.md` (already at `marketing-skills/shared/`) — canonical channel/funnel/quality vocabulary; sync into each skill's `references/_shared/`
- `research/icp-research.md` — copywriting, ad-copy, cold-outreach, brand-system, lp-brief, design-brief, campaign-plan
- `research/market-research.md` — campaign-plan, brand-system (positioning), lp-brief
- `brand/BRAND.md` + `brand/DESIGN.md` (canonical) — every creative skill; voice/visual ground truth
- `.agents/skill-artifacts/research/short-form-research/[slug].md` — short-form-brief (cross-stack contract from research)

Cross-stack contracts (refactor atomically if touched):
- `lp-brief` → `lp-eval` (within marketing)
- `short-form-brief` reads `short-form-research` catalog (cross-stack with research)
- `humanize` runs as terminal pass for `ad-copy` and `cold-outreach` — its output contract matters

---

## Creative ↔ structural split — explicit rubric thinning

For every creative skill in this stack, the critic agent's loaded rubric must be the THIN variant. Authoritative thin-rubric template:

```markdown
## Thin critic rubric (creative skills)

Score on craft floor only. Range 1–5.

1. **Clarity** — can the target reader parse this on first read?
2. **No AI tells** — no em-dash overuse, no "delve", no listicle structure where prose would serve, no validation padding.
3. **Hits the brief** — does it answer what was asked? (NOT: does it follow house style.)
4. **Restraint** — would removing X chars make it better, worse, or no change?

Pass = all 4 ≥ 3. Anything below 3 is a hard fail; flag for revision.

DO NOT score on:
- Conformance to house-style examples
- Tone match to a reference doc unless tone match was an explicit brief input
- Word choice preferences when the meaning is equivalent

The agent is creative within the brief. Score craft, not conformance.
```

This thin rubric lives at `references/_shared/thin-critic-rubric.md`, canonical source `marketing-skills/skills/copywriting/` (the most-foundational creative skill), synced to every other creative skill in this stack and `icp-research` in research stack.

---

## Stack completion criteria

Marketing stack is "done" when:

- [ ] All 14 skills shipped at status `shipped` in [`progress.md`](./progress.md)
- [ ] Average body lines for marketing stack ≤230 (down from 498, ~54% reduction)
- [ ] All 14 skills have 3 fixtures committed
- [ ] Thin critic rubric established and synced to all creative skills
- [ ] All cross-stack contracts preserved (verified by harness against research stack outputs)
- [ ] No critic-gate retained without measured ROI ≥30%
- [ ] `marketing-skills/CHANGELOG.md` has entries for each refactor
- [ ] `marketing-skills` GitHub Releases published
- [ ] Umbrella `marketplace.json` bumped (likely MINOR — large change)
- [ ] Handoff log entry: "Marketing stack refactor complete"

---

## Stack completion = program completion

Marketing is the last stack. When it ships, Phase 6 closes and Phase 7 (final regression sweep + program release) begins. See [`05-acceptance.md`](./05-acceptance.md) "Done definition for the entire program" for Phase 7 deliverables.
