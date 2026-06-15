---
kind: experience-root
lifecycle: append-only
read-by: every skill on cold-start
written-by: every skill after answering a cold-start dimension
---

# `docs/forsvn/experience/` — Cross-Skill Q&A Substrate

Append-only knowledge layer. When a skill asks a cold-start question and the user answers, the skill appends the dimension key + answer here. Future skills read before asking.

Replaces the previously planned `docs/forsvn/experience/`. Same contract, new home.

## Files

| File | Domain | Examples of dimensions stored |
|---|---|---|
| `product.md` | product itself | platform, stage, pricing model, key features |
| `audience.md` | who you sell to | primary persona, buying role, channel preferences |
| `content.md` | content strategy | tone, hooks that worked, banned phrases |
| `business.md` | business model | revenue model, GTM motion, sales cycle length |
| `brand.md` | brand identity | voice, archetype, palette, type system |
| `goals.md` | what we're chasing | metrics targeted, quarter focus, success criteria |
| `patterns.md` | meta-learnings | strategies that recurred across initiatives |

## Append Protocol

Each entry is a dated block:

```markdown
## YYYY-MM-DD — <dimension-key>
- **Asked by:** /<skill-name>
- **Answer:** <user response, verbatim or summarized>
- **Confidence:** high | medium | low
- **Supersedes:** (link to prior entry if applicable)
```

Most recent entry per dimension key wins. Older entries kept as audit trail — never deleted.

## Read Protocol

Before asking ANY cold-start question, skills:
1. Grep `experience/*.md` for the relevant dimension key.
2. If a recent (≤30 day) high-confidence entry exists, use it. Don't re-ask.
3. If older or lower confidence, surface it as a default: "Last time you said X — still true?"
4. Only ask cold if nothing relevant exists.

See `references/pre-dispatch-protocol.md` for the per-skill question registry.

## Promotion to Pattern

Cross-cutting findings from `evals/` that recur ≥3 times get promoted to `patterns.md` by `/forsvn` or the relevant eval skill. Patterns inform future strategy without re-deriving from raw data.
