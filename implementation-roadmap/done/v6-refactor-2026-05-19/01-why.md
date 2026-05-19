# Why This Program Exists

## The trigger

On 2026-05-15, Matt Pocock (@mattpocockuk) posted on X:

> Long skills are such a red flag to me
> - Hard to audit (and therefore, trust)
> - Hard to edit (more text, harder to maintain)
> - Expensive to run (more text, more tokens)
> - Does too much (tries to take too much control from you)
> The shorter the skill, the better IMO

The thread surfaced two opposing positions:
- **Chris Edwards:** "long/wordy skills are often so specific they are artificially constrained and don't produce the same level of quality as simple ones."
- **Manitcor:** "I have a couple meta-skills that combine multiple skill steps. The quality of the larger skill is about 60% as good and as deep as when the steps are done one at a time."
- **ByteCrafter:** "shorter's better most of the time but the failure mode flips past a certain length. Our triage skill kept misrouting once we cut it too tight."
- **Lgvdp:** "modularize and use the main skill as a 'router'. Early models struggled and did not load subfiles, but new ones are superb at this."

The operator (us) asked: does Matt's critique land for our stack?

## The honest answer — and the reframe

**Matt is measuring the wrong thing.** The cost axis isn't *skill length on disk*; it's *default tokens loaded into the agent context per invocation*. A 2,000-line skill with a 150-line body and lazy-loaded refs is cheap. A 200-line skill that pre-loads 4 references on every run is expensive.

This reframe matters because the implied fix in Matt's framing — "make skills shorter" — would gut depth on our stack, which is what Chris Edwards's counter-argument identifies. Manitcor's data ("60% quality on combined skills") is the warning shot for us: our multi-agent depth IS the product. Don't sacrifice it for line-count optics.

## Where Matt is right *for our specific stack*

1. **Body bloat is real.** Many of our SKILL.md bodies teach procedure inline instead of routing to it. Body should be decision logic + contract; procedure belongs in references.
2. **Pre-loaded references defeat the modularization point.** If every run loads `references/foo.md` regardless of branch taken, body brevity is a lie. This is our actual leak.
3. **Critic-gate tax can be unjustified.** Anti-sycophancy is a selling point, but if a critic gate hasn't changed output across 3+ runs, it's overhead.
4. **"Does too much" hits some skills.** lp-brief, campaign-plan can turn a small ask into a heavy artifact. A simple ask gets a 4-section response instead of an inline answer.

## Where Matt is wrong *for our specific stack*

1. **He's writing for open-source, average-user skills.** Ours are owner-tuned, opinionated, premium. Constraint is the product, not a bug. The `grill-me`-style "tiny and adapts" model doesn't fit `ad-copy` or `lp-brief` — those skills exist to enforce structure (policy compliance, conversion-principles gate).
2. **Multi-agent depth is justified.** Our `deep` tier produces demonstrably better output than single-pass. The tokens are the price.
3. **Modularize + router is already our pattern.** We just don't enforce body-brevity inside it. The fix is discipline, not architecture.

## The diagnosis we're acting on

Three real problems in our stack, in order of severity:

1. **Procedure duplicated body↔refs.** Body says "follow these 8 steps to write a brief," and `references/process.md` says the same thing in more detail. The body should say "for the procedure, see `process.md`" and route there only when invocation requires it.
2. **Always-loaded refs.** A skill body that references `references/foo.md` in its opening section forces the agent to load it on every invocation, even branches that don't need it. Refs must be branch-gated.
3. **Critic-gates without measured ROI.** We spawn critic agents because the SKILL.md says so, not because we measured a quality lift. Some are real; some are theater.

Cost data we have (captured 2026-05-16):
- 35 SKILL.md files across the 4 stacks
- ~16,254 total body lines
- ~464 average body lines per skill
- 15 skills over 500 body lines
- Worst: `lp-brief` (748), `discover` (696), `brand-system` (644), `market-research` (579), `design-brief` (574)

## What we are NOT doing

Important to name what's off-limits, so the program doesn't drift:

- **Not making skills "shorter" for its own sake.** Body diet is the lever, not skill-length minimalism. Refs can be as rich as needed — they're just not always loaded.
- **Not removing critic gates by default.** Critics earn their place by demonstrably changing output (the harness measures this). Default = keep; demotion requires evidence.
- **Not chasing Matt's `grill-me` aesthetic.** Tiny + flexible is one good design point. Our point is *opinionated + premium + lazily-loaded depth*. Different niche.
- **Not consolidating skills.** Body-diet only. Renaming/merging/deleting is a separate (later) conversation if quality demands it.

## The locked decisions (and their rationale)

From the operator conversation on 2026-05-16:

| # | Decision | Why |
|---|---|---|
| 1 | Quality bar: **extremely high** (blind operator diff, not just critic-score parity) | Critic-score parity is gameable — a refactored skill can pass its own critic while producing subtly weaker output. Blind diff catches what critic misses. |
| 2 | Audit then refactor, **skill by skill** | Atomic units of risk. Don't batch refactors; don't ship a stack without per-skill validation. |
| 3 | Build a **tiny harness** | Instrumentation > vibes. Decisions about what to compress, what to keep, what's overhead — all need data. |
| 4 | Proactive mode-selection, **agent proposes user confirms** | Today `--fast` is operator-flagged. Better: skill detects input shape, proposes mode + reason, asks. Lower friction, fewer wrong-mode runs. |
| 5 | **Creative skills get looser scaffolding** | Strict rubric on copywriting/brand-system/design-brief kills the thing that makes them valuable. Refs become *opinions to consider*, critic checks *craft floor* not *house-style ceiling*. |
| 6 | **Artifacts ↔ evals contract is sacred** | Eval skills parse brief frontmatter and sections. Break the shape and the whole loop breaks. Any change is atomic (skill + downstream eval in same commit). |
| 7 | **Self-containment** via `_shared/` duplication | `npx skills add --skill X` ships only X's folder. Confirmed in README:33. Shared refs duplicate, not symlink. |

## Order of attack — and why

1. **Meta-skills first.** Foundational — feeds every other stack. Small (7 skills). Lowest visibility if regressions slip in.
2. **Product-skills second.** Small (6 skills), mostly structural. Outputs are inspectable (code, docs, flows).
3. **Research-skills third.** Reference-heavy by nature. Tests the "rich refs, lazy load" pattern.
4. **Marketing-skills last.** Largest (14 skills). Most creative-leaning. Most user-visible quality risk. Apply the pattern after it's proven 3x.

Counter-argument considered: "start with marketing because it has the most leverage." Rejected because regressions in marketing are immediately visible to the operator's external outputs; regressions in meta degrade silently. We want to validate the pattern on low-visibility skills first.

## What success looks like

Numerically:
- ≥40% reduction in total body lines (16k → ~10k)
- ≥30% reduction in default-loaded tokens per standard invocation
- Critic gates with measurable ROI retained; those without removed
- Zero regressions on blind diff for any refactored skill
- Zero broken eval-skill parses (artifact contracts preserved)

Qualitatively:
- Bodies read as decision logic, not procedure manuals
- References load only when branches require them
- Operator can audit any skill in ≤2 minutes (down from "I'd need 15 minutes to trace what this does")
- Future skill additions follow the same lean pattern by default

## See also

- [`02-constraints.md`](./02-constraints.md) — install/contract constraints that shape implementation
- [`04-protocol.md`](./04-protocol.md) — the per-skill refactor procedure
- [`05-acceptance.md`](./05-acceptance.md) — pass/fail bars
