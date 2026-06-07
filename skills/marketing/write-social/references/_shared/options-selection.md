<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Options-Selection — the variant-presentation + regenerate + cap contract

**The standard way a brief/produce/write skill presents more than one candidate
output, lets the operator steer (pick / swap / get more), and decides how many to
make.** Replaces ad-hoc per-skill variant prose with one shared contract, so the
operator meets the same affordance everywhere and each skill body stays under its
budget cap.

Skills cite this file instead of inlining the rules. The producing skill applies it;
the human always owns the choice. This contract governs **how options are offered**,
not **what an engine renders** — the terminal render/publish choice is
[`execution-fork.md`](execution-fork.md); the upstream live-drive choice is
[`tool-redirect.md`](tool-redirect.md).

---

## First: which interaction mode is this skill?

"Present → pick → give me more" is **one** of three shapes. Wiring the wrong one is
the common error — a skill that delivers an A/B set is not "picking one and
discarding the rest." Classify before citing:

| Mode | The operator… | "More" means | Example |
|---|---|---|---|
| **SELECTION** | sees N candidates, **picks 1**, the rest are discarded | regenerate the candidate pool | `brief-graphic` Gate 1 (3 concepts → pick 1 → 1 brief) |
| **DELIVERY** | receives a **set delivered together** (all ship) | add or swap members of the set | `brief-shortform` per-platform recuts · `write-ad` hero+A/B · `write-social` hook variants |
| **VERBATIM** | receives a **single canonical output**, no variation by design | re-run the pipeline on an input change (NOT output variation) | `produce-asset` (Gate 4 copy-to-render verbatim) |

A skill cites this contract once and names its mode + cap tier in the map below.

---

## Presentation format

For SELECTION and DELIVERY, present candidates so the operator can choose without
reading each in full:

```markdown
**Options** (pick / swap K / "more")
- **A — {one-line differentiator}** — {what makes THIS distinct: angle, format, bet}
- **B — {one-line differentiator}** — …
- **C — {one-line differentiator}** — …
```

Each line names the **single distinguishing axis** (the angle, the variable isolated,
the platform) — not a full restatement. SELECTION lists candidates to choose among;
DELIVERY lists members of the set that ships. VERBATIM presents nothing to choose.

## Regenerate affordance

Three explicit verbs, available after the candidates are shown:

- **`more`** — produce N additional candidates (SELECTION: extend the pool · DELIVERY:
  add to the set, subject to the cap tier).
- **`swap K`** — replace candidate K with a fresh one (same constraints, new attempt).
- **`redo`** — discard all and regenerate the pool from scratch (e.g. a new brand_mode
  or angle).

Default N is the skill's own (see cap tier). **Every regenerated candidate passes the
same critic gate as the originals** — `more`/`swap`/`redo` never bypass the rubric,
the format-checker, or any hard gate. Regeneration is a new attempt, not an override.

---

## Cap policy — tiered, not blanket

How many candidates a skill makes is set by **why** its cap exists. Do not loosen a
cap whose count is load-bearing.

| Tier | Cap nature | Policy | Who |
|---|---|---|---|
| **A — soft** | arbitrary cost-discipline; the count is a budget guard, not a method | **Loosen.** Ship a default (2); `--variants N` extends it with an explicit per-candidate **cost warning**. | `brief-shortform` (default 2 recuts), `write-social` (`--variants N`) |
| **B — structural** | the count is part of the method or a downstream contract; changing it changes correctness | **Preserve.** Keep the count; document it here as a named exception. Loosening requires changing the method, not this contract. | `write-ad` (hero + 2 A/B — Variable Subtraction isolates ONE variable per variant; `critic_per_variant:{hero,a,b}` + the Meta hero/A/B publish step are the contract). `brief-graphic` Layer-1 = 3 concepts feeding the Gate-1 pick — presentation scaffolding, not an output cap |
| **C — none** | single canonical output by identity | **No cap to loosen.** The affordance is a pipeline re-run on input change, not output variation. | `produce-asset` (Gate 4 verbatim) |

**Why tiers, not a flat "loosen hero+2":** `brief-shortform`'s "max 2" is a cost guard
on a `deep`-budget skill — safe to raise. `write-ad`'s "hero + 2" is a Meta A/B test
(three distinct `angle_archetype`, one isolated variable each); raising it past the
method without generalizing `critic_per_variant` and the publish step breaks the A/B
contract. Same surface shape, opposite cap nature.

---

## Non-negotiable rules

1. **The human owns the choice.** SELECTION never auto-picks (except `--fast`, which
   collapses to a single default candidate and *says so*). The skill presents; the
   operator decides.
2. **Regeneration respects every gate.** A `more`/`swap`/`redo` candidate runs the full
   critic + format + hard gates. No "good enough, it's a regen" shortcut.
3. **Cost is honest.** Tier-A `--variants N` above the default surfaces the per-candidate
   cost (`estimated-cost` × N) before producing — no silent fan-out on a `deep` skill.
4. **Don't duplicate a native mechanism.** If a skill already implements its mode
   (`brief-graphic`'s Approval Gate 1, `write-social`'s `--variants N`), the citation
   *names* that mechanism as the implementation — it does not add a second one.
5. **Tier is declared, not inferred.** Each citing skill states its mode + tier in the
   map below so a future author doesn't miswire a DELIVERY set as a SELECTION pick.

---

## Per-skill map

| Skill | Mode | Cap tier | Note |
|---|---|---|---|
| `brief-graphic` | SELECTION | B (Layer-1 = 3 concepts, scaffolding) | Native: Approval Gate 1 ("pick 1 of 3 / request revisions / specify your own"). A "give me 3 more concepts" `more` affordance is a deferred brief-graphic-local follow-up (skill is at its BUDGET_EXCEPTION cap). |
| `brief-shortform` | DELIVERY | A (default 2 recuts) | Variants are true per-platform recuts. `--variants N` extends past 2 with a cost warning; more platforms still re-invoke for catalog freshness. |
| `write-ad` | DELIVERY | B (hero + 2 A/B) | Structural: count = Meta A/B method. **Not loosened** — would break Variable Subtraction + `critic_per_variant` + the publish step. Generalize the method first if ever needed. |
| `write-social` | DELIVERY | A (`--variants N`) | Already loosened — hook variants, operator-controlled count. Citation codifies the existing affordance. |
| `produce-asset` | VERBATIM | C (none) | No output variation by identity (Gate 4 verbatim, Gate 1 tool-agnostic). "More" = re-run the manifest on a brief change. |

---

## How a skill cites this

In the SKILL.md body, one line near where it presents variants:

```
## Options
Present variants + regenerate affordance per `references/_shared/options-selection.md`
(mode: {SELECTION|DELIVERY|VERBATIM}, cap tier: {A|B|C}).
```

That keeps the contract in one place and the skill body under its budget cap.
