<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
title: Playbook Ref Template — structural template for per-skill references/playbook.md
lifecycle: canonical
status: stable
produced_by: meta-skills (authored once; consumed by every Phase 2 refactor)
provenance:
  authored_for: implementation-roadmap v6 locked-decision #9 (playbook voice via refs, not body bloat)
  authored_at: 2026-05-16
consumers: every skill being refactored in Phase 2 (currently 34 of 35 skills)
load_class: PLAYBOOK
---

# Playbook Ref Template

**Locked decision #9 from `implementation-roadmap/README.md`: SKILL.md bodies stay lean (router); team wisdom lives in `references/playbook.md` and supplemental refs with explicit load-class tags so agents load by need and humans read by choice.**

This template defines what goes in `references/playbook.md` for any skill, the **load-class tag convention** for cite hooks, and the voice guide that keeps playbook content teachable instead of bureaucratic.

---

## What `references/playbook.md` is FOR

It's the **teachable curriculum** for a skill — what a senior practitioner would tell a new teammate to read on day one before touching the skill. It is NOT:

- Execution procedure (those live in `references/procedures/`)
- Worked examples (those live in `references/examples/`)
- Critic anti-patterns (those live in `references/anti-patterns.md` or shared refs)
- The skill's contract (that's in SKILL.md frontmatter + body decision tree)

The body is for execution. The playbook is for understanding *why the body executes that way.*

---

## Required structure

A skill's `references/playbook.md` has these sections, in this order:

```markdown
---
title: <Skill Name> Playbook
lifecycle: canonical
status: stable
produced_by: <skill-name>
load_class: PLAYBOOK
---

# <Skill Name> Playbook

## Why this skill exists
1-3 paragraphs. The problem this skill solves. The pain it removes. What the world looks like
without it.

## Methodology
The core approach. Named techniques (e.g., "PAS framework," "Three-Question Test,"
"Argument Engineering"). Brief, opinionated. ≤3 paragraphs.

## Principles
3-7 bulleted principles that drive every decision the skill makes. Examples:
- "Specificity beats abstraction every time"
- "Stop-power before clarity in the first sentence"
- "Auto-fail on missing brand context; never paper over"

## History / origin (optional)
When/why this skill was created. Notable past failures it was built to prevent.
Helps future maintainers understand which rules are load-bearing vs. cargo-cult.

## When NOT to use this skill
The narrower the skill, the more important this section. Names the adjacent skills
the operator should use instead.

## Further reading
Links to deeper material — academic frameworks, books, internal post-mortems,
the meta-skills refs this playbook cites.
```

**Length target: 100-200 lines.** Shorter is fine if the skill is narrow. Longer suggests methodology bloat — split into sub-playbooks under `references/playbook/` instead.

---

## Load-class tag convention

Body pointers carry a load-class tag so agents know **when** to load the file and humans know **why** the file exists. The tag goes in the body cite, in brackets, immediately after the path.

| Tag | Meaning | When loaded |
|---|---|---|
| `[PLAYBOOK]` | Read to learn | Humans on cold-start; agents on cold-start if no playbook in conversation context yet |
| `[PROCEDURE]` | Load when branch fires | Per-invocation, branch-gated |
| `[EXAMPLE]` | Load when triangulating to target | When agent needs a concrete anchor |
| `[ANTI-PATTERN]` | Load when critic fires | At critique time only |

### Citation patterns

**In SKILL.md body — playbook cite (top of file):**

```
[Read `references/playbook.md` [PLAYBOOK] to understand why this skill does what it does.]
```

**Branch-gated procedure cite:**

```
If audience is cold traffic, load `references/procedures/cold-audience.md` [PROCEDURE].
If audience is warm retargeting, load `references/procedures/warm-audience.md` [PROCEDURE].
```

**Example cite (during agent reasoning):**

```
Mirror the structure in `references/examples/example-3-hero-section.md` [EXAMPLE]
when the brief is a landing-page hero.
```

**Anti-pattern cite (in critic agent prompts):**

```
Score per rubric. Auto-fail conditions in `references/anti-patterns.md` [ANTI-PATTERN].
```

---

## Voice guide

The playbook is **teachable** content. Voice matters.

**Do:**
- Write in the present tense, active voice. "The skill produces X" not "X is produced by the skill."
- Use second person sparingly ("you'll often see..."). Default to "the skill" / "the operator" / "the critic agent" as subjects.
- Cite real failure modes when they shaped the methodology ("we used to score on 5 dimensions but PASS-with-caveats inflation forced us to thin").
- Name the techniques. Operators learn faster when patterns have names.
- Take a position. The playbook is opinionated — that's the value.

**Don't:**
- Hedge ("it might be useful to consider..."). State the rule.
- Restate what SKILL.md already says. The playbook explains the *why* behind body decisions; if you find yourself repeating body content, the body is doing the playbook's job (refactor the body to be thinner).
- Write generic methodology ("good copy is clear and persuasive"). If a generic statement could appear in any skill's playbook, cut it.
- Add aspirational rules. Only document what the skill actually does. If the skill *should* do X but doesn't, file an issue — don't pretend in the playbook.

---

## Worked example — copywriting playbook (sketch)

A complete copywriting playbook would have:

```markdown
## Why this skill exists
Most teams write copy by committee or template. Both produce slop. This skill imposes
Argument Engineering — define the belief sequence and proof burden before choosing words —
which is what separates copy that converts from copy that's "well-written."

## Methodology
Argument Engineering → Frameworks (PAS / 3-Question Test / CTA formula) as tools, not templates →
Critic gate with V/F/U rubric and Competitor Swap Test.

## Principles
- Specificity over abstraction (every key line passes V/F/U)
- Stop-power before clarity in the first sentence
- The Competitor Swap Test is the truth — if competitor's name works in your headline, rewrite
- 3-5 variations per key line; the second-best becomes the alternative shown

## When NOT to use
For polishing AI-sounding text → humanize. For brand voice creation → brand-system.
For landing-page architecture → lp-brief.
```

That's ~30 lines of teachable content. The full playbook would expand each section with examples, history, further reading — landing at ~150 lines.

---

## Anti-patterns (in playbook authorship)

1. **Restating SKILL.md.** If a paragraph could be lifted verbatim into the body, it's not playbook content. Refactor.
2. **Bullet-list-as-playbook.** Pure bullet lists with no narrative don't teach. Mix prose with structure.
3. **Aspirational rules.** Documenting "the skill should X" instead of "the skill does X because Y." If the rule isn't in the body, it's not real.
4. **No "why this skill exists" section.** The most important section. Without it, the playbook is just another reference doc.
5. **Naming-but-not-defining techniques.** "We use Argument Engineering" with no explanation of what it is. Either define inline or cite the source.
6. **Generic methodology.** "Good X is clear and useful" applies to anything. Cut.
7. **Missing load-class tags on body cites.** Without tags, agents don't know when to load and humans don't know why the file exists.

---

## How to wire playbook into a Phase 2 refactor

When refactoring a skill per `04-protocol.md` Step 4.5:

1. **Create `references/playbook.md`** following the required structure above.
2. **Add a top-of-body cite** in SKILL.md: `[Read references/playbook.md [PLAYBOOK] to understand why this skill does what it does.]`
3. **Move any "why" / "principles" / "methodology" content from body INTO playbook.** Body keeps only routing + contract + decision tree + safety gates.
4. **Tag all existing ref cites with load-class** ([PROCEDURE], [EXAMPLE], [ANTI-PATTERN]).
5. **Verify body line target.** Soft targets: structural ≤200, creative ≤300, routers ≤150. Cost (measured by harness) is the hard gate; line target is the soft gate.

---

## Related refs

- [[mode-resolver]] — how playbook cite firing varies by `--fast` (PLAYBOOK loads on cold start regardless; PROCEDURE/EXAMPLE/ANTI-PATTERN skipped under `--fast`)
- [[anti-sycophancy]] — voice guide reinforces no-hedging
- [[artifact-contract-template]] — frontmatter for the playbook.md file itself
- [[shared-critic-rubrics]] / [[thin-critic-rubric]] — where critic rubrics live (NOT in playbook)
