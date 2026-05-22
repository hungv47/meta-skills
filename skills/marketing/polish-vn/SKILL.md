---
name: polish-vn
description: "Polishes already-translated Vietnamese text so it reads natively in a target register (báo chí, semi-casual, bro, or pop-marketing) — fixes pronoun drift, missing particles, literal idioms, passive-voice calques, typography, and corporate translationese. Post-translation polish pass only; does NOT translate from other languages. Use on translated Vietnamese copy that reads stiff or foreign. Not for tone work on English or other languages (use humanmaxxing), or writing new Vietnamese copy from scratch (use write-copy)."
argument-hint: "[vietnamese text or file path] [--register bao-chi|semi-casual|bro|pop-marketing]"
allowed-tools: Read Grep Glob Bash WebFetch
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.08-0.20"
---

# Vietnamese Tone Polish — Orchestrator

*Communication — Horizontal. Runs a three-agent pipeline (diagnose → polish → critic) to transform translated Vietnamese into natural, register-correct prose.*

**Core Question:** "Would a native Vietnamese writer of this target register write this exact text themselves — and would a native reader stumble anywhere?"

> Why this skill exists, philosophy, methodology, principles, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

---

## Critical Gates — Read First

1. **Input must be Vietnamese.** This skill does not translate. If the input is English or any other language, STOP and tell the user to translate first (using `humanmaxxing` if it needs tone work in source language, or their preferred MT).
2. **Target register must be specified.** One of `bao-chi` / `semi-casual` / `bro` / `pop-marketing`. If ambiguous from context, ask the user before dispatching.
3. **Do NOT change facts.** Polishing means form, not content. Numbers, names, dates, quoted statements, claims, and named examples must survive the rewrite intact.
4. **Register is pair-locked.** The polisher picks one pronoun pair (self ↔ reader) at the start and holds it to the end. Drift is the #1 translation giveaway — catching it is the critic's primary gate.

## Quality Gate

Before delivering, the **critic agent** verifies:
- [ ] Zero Hard Tells from the 28-pattern catalog in `references/translation-artifacts.md`
- [ ] Pronoun pair held throughout (no drift)
- [ ] Particle density in target range (0% for báo chí, 15–25% for casual/pop/bro)
- [ ] Every number, name, date, and named example from original is preserved
- [ ] Typography normalized (no em dashes, no Oxford comma before `và`, no title case, no smart quotes, dates in DD/MM/YYYY)
- [ ] Read-aloud: no stumbles for a native reader
- [ ] Total critic score ≥28/36

### Absolute Prohibitions (zero tolerance)
These violate core register conventions so reliably that a single instance breaks the polish:
1. **No em dashes `—`.** VN is not English. Use comma, period, parentheses, or restructure.
2. **No `quý khách` / `quý vị`** outside explicit corporate formal notices. Pop and semi-casual use `bạn`; bro uses the subvariant's pronoun; báo chí uses no reader-address.
3. **No title-case VN headlines.** Sentence case only, proper nouns capitalized.
4. **No particles in `bao-chi`.** Zero `ạ`, `nhé`, `nhỉ`, `nha`, `đấy`. Báo chí is particle-free.
5. **No pronoun pair drift.** Whatever pair opens the text must close it. Mid-text drift is auto-FAIL.
6. **No dropped facts.** If the original has a number, name, or claim, the polished version has it too.
7. **No cliché stack.** Never two of `giải pháp toàn diện`, `trải nghiệm đột phá`, `tối ưu hóa`, `chuyển đổi số`, `hành trình` in the same paragraph. The polisher's job is to delete these when stacked.
8. **No literal idiom calques.** `Vào cuối ngày`, `đi về phía trước`, `nghĩ bên ngoài chiếc hộp`, `kẻ thay đổi trò chơi` — instant FAIL if any survive.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — load brand voice + register-mapping experience, identify target register via priority order before dispatching diagnostic.

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | icp-research | Recommended — brand voice → register inference (Register Resolution priority 2) |
| `.forsvn/artifacts/mkt/content/[slug].md` | upstream | Optional — if polishing a prior artifact, extract register from frontmatter if present |
| `.forsvn/experience/brand.md` | (any skill) | Optional — `Brand — VN target register` key if user previously persisted a default |

---

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** target register (báo chí / semi-casual / bro / pop-marketing), dialect (north / south / neutral), subvariant (only if bro: bro-otofun / bro-voz).

Full read-order + Register Resolution priority (4 levels) + Warm/Cold Start prompts + Pre-Writing Assembly + write-back map + hard-block conditions: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

---

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — auto-downgrade for ≤3 sentences AND no prior artifacts (rare for this skill since polish input is usually multi-sentence); `--fast` flag skips Layer 1 (diagnostic) + Layer 2 critic (single-pass polisher only). **`--fast` does NOT skip Register Resolution or Critical Gates 1-4 + Absolute Prohibitions 1-8.**

---

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Diagnostic | 1 (single) | `agents/diagnostic-agent.md` | Scans for translation artifacts, assesses register gap, produces violation log with priority fixes |
| Polisher | 2 (sequential) | `agents/polisher-agent.md` | Applies register-correct rewriting based on violation log; preserves meaning and structure |
| Critic | 2 (final) | `agents/critic-agent.md` | Three-pass audit, 36-point scoring, PASS/FAIL with specific re-dispatch feedback |

---

## Routing + Dispatch

Two routes — Route A for slash-command invocation, Route B for upstream skill auto-routing (e.g., `brief-shortform` / `write-social` / `write-copy` / `write-ad` etc. when `market = VN`).

```
ROUTE A (slash command):
  1. Pre-Dispatch (warm-start scan + cold-start if needed) — per procedures/pre-dispatch.md
  2. LAYER 1: diagnostic-agent → present diagnosis to user → user checkpoint (proceed / review-first)
  3. LAYER 2 SEQUENTIAL: polisher-agent → critic-agent
  4. Critic FAIL → re-dispatch polisher (max 2 cycles); after cycle 2, ship done_with_concerns
  5. Deliver artifact

ROUTE B (called by another skill):
  1. Pre-Dispatch: trust calling skill's pre-resolved register / dialect / subvariant
  2. If content already passed prior VN polish: skip diagnostic, dispatch polisher + critic only
  3. Otherwise: Layer 1 (no user checkpoint) → Layer 2
  4. Return polished text + metadata to calling skill (no standalone artifact file)
```

Mechanics (how to spawn agents, single-agent fallback, Layer 1 user checkpoint details, Layer 2 sequential pipeline, critic gate + rewrite loop, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Artifact Contract

- **Path (Route A):** `.forsvn/artifacts/mkt/content/[slug].vn-tone.md`
- **Path (Route B):** no standalone artifact — polished text + metadata embedded in calling skill's artifact
- **Lifecycle:** `pipeline` — one artifact per (slug, register, polish run); re-run renames to `[slug].vn-tone.v[N].md` and creates new with incremented version
- **Frontmatter fields:** `skill`, `version`, `date`, `status`, `target_register`, `subvariant` (null if not bro), `dialect`, `critic_score` (full schema in Artifact Template below)
- **Body sections (4, in order):** Polish Summary (8-row metric table) · Change Log (4-column table: Location / Before / After / Rule) · Polished Text · Status (DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT)
- **Consumed by:** upstream calling skill (Route B) OR human reader (Route A); calling skills SHOULD preserve `polish_chain_applied: vn-tone` + `critic_score: N/36` in their own artifact frontmatter
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers (verbatim)" — never silently drift

Full template + per-section format rules (date format DD/MM/YYYY in content vs ISO 8601 in frontmatter, pronoun-pair table per register, particle density per register, typography rules, Change Log row format) live in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Artifact Template

```markdown
---
skill: polish-vn
version: 1
date: [today's date]
status: done | done_with_concerns | blocked | needs_context
target_register: [bao-chi | semi-casual | bro | pop-marketing]
subvariant: [if applicable: bro-otofun | bro-voz]
dialect: [north | south | neutral]
critic_score: [N]/36
---

# VN Tone Polish: [Original Title or Slug]

## Polish Summary

| Metric | Value |
|---|---|
| Original words | [count] |
| Polished words | [count] |
| Hard Tells found | [count] |
| Hard Tells fixed | [count] |
| Soft Tells fixed | [count] |
| Pronoun pair | [self ↔ reader] |
| Particle density | [actual %] (target [range]) |
| Critic score | [N]/36 |
| Cycles used | [1 or 2] |

## Change Log

| Location | Before | After | Rule |
|---|---|---|---|
| [P-S ref] | "[original]" | "[polished]" | [rule ID] |

## Polished Text

[Full rewritten Vietnamese text here]

## Status

**[DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT]**

[If DONE_WITH_CONCERNS: list the remaining Soft Tells and why they were kept. If BLOCKED: state what's missing. If NEEDS_CONTEXT: state what upstream skill would provide it.]
```

> On re-run: rename existing artifact to `[slug].vn-tone.v[N].md` and create new with incremented version.

---

## Anti-Patterns

Polish-pipeline reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships. 11 pipeline anti-patterns (polishing before diagnosing, guessing register, cross-contaminating subvariants, particle over-injection, clichés left standing, preserving em dashes, scope creep, register cosplay, ignoring critic FAIL, one-pass polishing, loanword overscrub) + 4 cross-cutting marketing-stack rows (upstream-skipped-vn-tone, calling-skill-drops-schema, contract drift, multi-market polish in one artifact).

Most common in practice: pronoun pair drift (auto-FAIL on critic Pass 2), em dash retention (Absolute Prohibition #1), cliché stack survival (Absolute Prohibition #7), particle over-injection (every sentence ending `nha`).

---

## Completion Status

Every run ends with explicit status:
- **DONE** — register hit cleanly, all Hard Tells fixed, critic 36-point PASS
- **DONE_WITH_CONCERNS** — register polished but Soft Tells remain or critic score 30-34 (below ceiling but above floor); concerns annotated for user review
- **BLOCKED** — original text contains untranslatable claims or structural problems beyond register polish (e.g., factually broken passages); fix upstream first
- **NEEDS_CONTEXT** — target register not specified and not derivable from brand voice; ask user (báo chí / semi-casual / bro / pop-marketing) before dispatching

---

## Worked Example

End-to-end Route A walkthrough (Pre-Dispatch warm-start → Layer 1 diagnostic + user checkpoint → Layer 2 polisher → critic 35/36 PASS → deliver; plus cycle-2 FAIL-handling variant + `--fast` variant): [`references/examples/vn-tone-walkthrough.md`](references/examples/vn-tone-walkthrough.md) [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/vn-tone-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by all 3 agents at dispatch): `references/{vn-tone-corpus, translation-artifacts}.md`
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol}.md`
- **Agents:** 3 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 36-point rubric.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
