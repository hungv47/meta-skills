# Format Conventions — Design Referral

[PROCEDURE] — artifact template, frontmatter, the K-factor math block schema. Loaded at artifact-assembly time.

## Output path

```
docs/forsvn/artifacts/marketing/design-referral/[loop-type]-[date]-[slug].md
```

`[loop-type]` ∈ `collaborative-native | double-sided | one-sided | milestone`. Pipeline lifecycle — re-run on incentive change, measured-K update, or unit-economics shift.

## Frontmatter (required — validate-artifacts --strict)

```yaml
---
skill: design-referral
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: md
id: design-referral-<slug>
type: pipeline
keywords: [referral, viral-loop, k-factor, <loop-type>, growth]
decision_state: not_required
review_tool: inline
reviewed_at:
reviewer:
loop_type:                    # collaborative-native | double-sided | one-sided | milestone
projected_k:                  # number — the computed K = i × c
cpau:                         # number — cost per acquired user
cac_to_beat:                  # number — the paid CAC the loop displaces
critic_total:                 # integer /42 — consumed by measure-results
---
```

The four base required + the two v2 mandatories (`stack`, `review_surface`) + the v3 instruction core (`id`, `type`, `keywords`). `loop_type`, `projected_k`, `cpau`, `cac_to_beat`, `critic_total` are skill-specific selection fields `measure-results` reads to test projected-vs-measured.

## Body section order

1. `## Loop Type & Trigger`
2. `## Loop Steps` (the invite→convert→re-enter table with drop-off risks)
3. `## K-Factor Math` (the i × c block — load-bearing)
4. `## Cycle Time`
5. `## Incentive Design`
6. `## Incentive Economics` (CPAU vs CAC + payback)
7. `## Mechanic` (share prompt + invite + referee landing + the falsifiable claim)
8. `## Fraud & Abuse Guards`
9. `## Critic Scorecard` (6-dim table + total + hard-gate checklist)
10. `## Rationale` (assembly notes + any DONE_WITH_CONCERNS flags)

## K-factor math block schema (load-bearing — measure-results reads it)

The `## K-Factor Math` section MUST contain, each on its own line:
- `i` (invites per active user) + its basis label
- `c` (conversion per invite) + its basis label
- `K = i × c` with the product computed
- the interpretation band (viral / assist / marginal / kill)

A K stated without the i and c decomposition is a contract violation — the critic FAILs it.

## Cross-stack contract

Schema changes require an atomic update of this file's "K-factor math block schema" + "Frontmatter" sections AND the `measure-results` consumer (it reads `projected_k`, `cpau`, `cac_to_beat`, `critic_total` to compare projected against measured).
