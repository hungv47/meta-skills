---
name: polish-vn
description: "Polishes already-translated Vietnamese text so it reads natively in a target register (báo chí, semi-casual, bro, or pop-marketing) — fixes pronoun drift, missing particles, literal idioms, passive-voice calques, typography, and translationese. Post-translation polish only; does NOT translate from other languages. Use on translated Vietnamese copy that reads stiff or foreign. Not for tone work on English (use humanmaxxing) or writing new Vietnamese from scratch (use write-copy)."
argument-hint: "[vietnamese text or file path] [--register bao-chi|semi-casual|bro|pop-marketing]"
allowed-tools: Read Grep Glob Bash WebFetch
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.08-0.20"
---

# Vietnamese Tone Polish — Orchestrator

*Communication — Horizontal. **Terminal** polish for Vietnamese-market copy. Three-agent pipeline (diagnose → polish → critic) for register **calibration**, idiom + **cultural** reference repair, and removal of **ai-translation** tells.*

**Core Question:** "Would a native VN writer of this register write this exact text — and would a native reader stumble anywhere?"

> Why / philosophy / when NOT to use: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

---

## Critical Gates — Read First

1. **Input must be Vietnamese.** Does not translate. If English/other, STOP — translate first (`humanmaxxing` for source tone, or any MT).
2. **Target register specified.** One of `bao-chi` / `semi-casual` / `bro` / `pop-marketing`. If ambiguous, ask first.
3. **Do NOT change facts.** Form, not content. Numbers, names, dates, quotes, named examples survive intact.
4. **Register is pair-locked.** Polisher picks one pronoun pair (self ↔ reader) at start, holds to end. Drift is the #1 translation giveaway.

## Quality Gate

Critic 7-check rubric (zero Hard Tells from 28-pattern catalog · pronoun pair held · particle density in range (0% báo chí; 15–25% casual/pop/bro) · facts preserved · typography normalized · read-aloud clean · score ≥28/36). Full rubric: `agents/critic-agent.md`. Pattern catalog: [`references/translation-artifacts.md`](references/translation-artifacts.md).

**Absolute Prohibitions (any one = auto-FAIL):** em dashes · `quý khách`/`quý vị` outside formal · title-case headlines · particles in báo chí · pronoun drift · dropped facts · cliché stacks · literal idiom calques. Enforcement: [`references/procedures/absolute-prohibitions.md`](references/procedures/absolute-prohibitions.md) [PROCEDURE].

---

## Before Starting

Per `references/_shared/before-starting-check.md` — load brand voice + register-mapping experience.

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | research-icp | Recommended — brand voice → register inference |
| `docs/forsvn/artifacts/marketing/content/[slug].md` | upstream | Optional — register from frontmatter |
| `docs/forsvn/experience/brand.md` | (any) | Optional — `Brand — VN target register` key |

## Pre-Dispatch + Mode

Protocol: `references/_shared/pre-dispatch-protocol.md`. **Needed dimensions:** register · dialect (north/south/neutral) · subvariant (if bro: otofun/voz). Read-order + Register Resolution priority + Warm/Cold Start + write-back + hard-blocks: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

Per `references/_shared/mode-resolver.md` — `--fast` runs single-pass polisher only (skips diagnostic + critic). **`--fast` does NOT skip Register Resolution, Critical Gates 1-4, or Absolute Prohibitions.**
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

---

## Agents + Routing

3 sub-agents in `agents/`: **diagnostic** (L1: scan, register gap, violation log) → **polisher** (L2: register-correct rewrite) → **critic** (L2 final: 3-pass, 36-point rubric).

**Route A** (slash-command): Pre-Dispatch → diagnostic → user checkpoint → polisher → critic. FAIL → re-dispatch polisher (max 2 cycles) → deliver.
**Route B** (upstream caller — `brief-shortform` / `write-social` / `write-copy` / `write-ad` when `market = VN`): trust caller's register; if prior polish → skip diagnostic; no standalone artifact.

Spawn mechanics, fallback, checkpoint, pipeline, rewrite loop: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

---

## Artifact Contract

- **Path (A):** `docs/forsvn/artifacts/marketing/content/[slug].vn-tone.md` · **(B):** none, embedded in caller
- **Lifecycle:** `pipeline` — re-run renames to `[slug].vn-tone.v[N].md`
- **Frontmatter:** `skill`, `version`, `date`, `status`, `target_register`, `subvariant`, `dialect`, `critic_score`
- **Body (in order):** Polish Summary · Change Log · Polished Text · Status
- **Consumers:** caller (B) or human (A); callers SHOULD preserve `polish_chain_applied: vn-tone` + `critic_score: N/36`
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md`

Template + per-section format rules: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

---

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 11 pipeline + 4 cross-cutting rows. Most common: pronoun drift · em dash · cliché stack · particle over-injection.

---

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — register hit, Hard Tells fixed, critic 36-point PASS
- **DONE_WITH_CONCERNS** — Soft Tells remain or critic 30–34
- **BLOCKED** — untranslatable claims or structural problems beyond polish scope
- **NEEDS_CONTEXT** — register unspecified, not derivable from brand voice

## Next Step

Hand polished text to caller (B) or user (A). On `DONE_WITH_CONCERNS`, surface concerns before publish.

## Worked Example + References

Route A walkthrough + cycle-2 FAIL + `--fast` variant: [`references/examples/vn-tone-walkthrough.md`](references/examples/vn-tone-walkthrough.md) [EXAMPLE].

- `references/{playbook, format-conventions, anti-patterns, vn-tone-corpus, translation-artifacts}.md`
- `references/procedures/{pre-dispatch, dispatch-mechanics, absolute-prohibitions}.md`
- `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol, manifest-spec}.md`
- `agents/{diagnostic, polisher, critic}-agent.md` (critic holds 36-point rubric)
