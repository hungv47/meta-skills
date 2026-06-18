---
title: Copywriting — Format Conventions
lifecycle: canonical
status: stable
produced_by: copywriting
load_class: PROCEDURE
---

# Format Conventions

**Load when:** any Layer 1 or Layer 2 agent composes artifact content OR critic-agent verifies format/annotation compliance. These conventions are enforced by critic-agent (annotation presence + V/F/U score format + Pre-Writing block format).

---

## Date format

Frontmatter `date:` field uses ISO 8601 (`YYYY-MM-DD`) for machine-readable consistency with the rest of the artifact ecosystem.

## Slug derivation

Slug is derived from `surface + brief-keyword`:

- **Format:** `[brief-keyword]-[surface-shorthand]` (e.g., `statuszero-landing`, `acme-pricing`, `mercury-email-subject`)
- **Surface shorthands:** `landing`, `home`, `pricing`, `feature`, `about`, `email`, `email-subject`, `headline`, `cta`, `tagline`, `social-post`
- **Version suffix on re-run:** `-v2`, `-v3`, etc. (e.g., `statuszero-landing-v2.copy.md`)

The slug propagates to the single artifact file `[slug].copy.md` (Route A standalone) OR is embedded inline when called by another skill (Route C).

## Frontmatter field order (Artifact Template)

Per the Artifact Template block in SKILL.md body. Required fields in this order:

```yaml
skill: write-copy
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
```

For Route C (called by `brief-landing-page` / `plan-campaign`), `version` may carry the calling skill's version semantics (e.g., `version: lp-brief-v2`); orchestrator sets at compile time.

For Route B with full artifact, the body adds operational metadata (Date / Skill / Audience / Awareness Stage / Traffic Source) as a `**bold:**` block immediately after the H1 — this is descriptive prose, not frontmatter, and not parsed by downstream skills.

## Output file structure (1 file per run, Route A/B)

Single artifact file at `docs/forsvn/artifacts/marketing/content/`:

| File | Content | Consumer |
|------|---------|----------|
| `[slug].copy.md` | H1 title + descriptive metadata block + Pre-Writing 5-item block + Key Lines (Route A) OR section-by-section copy (Route B) + A/B Variants (Route B only) + Why This Works block | Human (writer/marketer), `brief-landing-page` (Route C — reads pre_writing.unique_mechanism + key_lines.*.score for next-section refinements), `plan-campaign` (Route C — reads surface + audience for campaign coherence) |

The `## Why This Works` block sits **after** the copy / variants and **before** the `## Verdict` (the critic header stays last), per [`_shared/why-this-works-convention.md`](_shared/why-this-works-convention.md): the bet (falsifiable) + 2-4 load-bearing choices — the lead mechanism, the angle, the proof — each traced to a product-fit source (`ICP.md` pain/VoC, `PRODUCT-CONTEXT.md` positioning), Competitor-Swap-clean. This is the deliverable-level product-fit rationale, distinct from the per-line V/F/U annotations. No ICP foundation → the convention's Absent state (general principles only; no fabricated pain/VoC).

**Route C exception:** no standalone artifact file written by copywriting in Route C — calling skill embeds the copy + annotations directly in its own artifact.

## Pre-Writing block format

The Pre-Writing block immediately follows the descriptive metadata, in this exact order:

```markdown
## Pre-Writing

1. **Talking to:** [audience + current belief]
2. **Shift to:** [desired belief after reading]
3. **Only we can say:** [unique proof/angle]
4. **Unique Mechanism:** [proprietary how that makes the offer different and better]
5. **Traffic context:** [what they already know]
```

5 items, numbered, **bold** field labels. critic-agent verifies Pre-Writing block presence + 5 items + field-label match.

## Key Lines block format

Each key line in the Key Lines section follows this exact format:

```markdown
### [Line Type: Headline / Hook / CTA / Tagline / Subject Line]

**Selected:** "[winning line]"
  Rule: [which principle]. Score: V:[n] F:[n] U:[n].
  Cut alternative: "[runner-up]" — [why cut].

**Alternative A:** "[second option]"
  Rule: [principle]. Score: V:[n] F:[n] U:[n].

**Alternative B:** "[third option]"
  Rule: [principle]. Score: V:[n] F:[n] U:[n].
```

- **Line type:** Headline / Hook / CTA / Tagline / Subject Line / Sub-head / Social-Proof statement
- **Selected** is the winning line (always present)
- **Cut alternative** is the highest-scoring runner-up (always present — single-best-without-runner-up reads as no-comparison)
- **Alternative A and B** are the next 2 alternatives (top 2-3 alternatives total surfaced; hook-agent / cta-agent generate 3-5 internally, top 2-3 surfaced)
- **Rule** cites the principle that drove the choice (e.g., "Specificity formula", "Curiosity gap", "Direct promise")
- **Score V:[n] F:[n] U:[n]** — 1-5 scale per dimension (V=Visual, F=Falsifiable, U=Uniquely-Ours); critic-agent verifies all three present + integer 1-5

## V/F/U scoring format

Frontmatter does NOT carry an aggregate score (scores are per-line, not per-piece). Critic-agent's PASS verdict header shows:

```markdown
## Verdict: PASS

### Overall Score
Average V/F/U across all key lines: [n.n]
```

Where:
- **V** = Visual (can the reader picture it? 1=abstract, 5=concrete sensory image)
- **F** = Falsifiable (could a fact-checker verify it? 1=vague claim, 5=specific verifiable number)
- **U** = Uniquely-Ours (could a competitor sign it? 1=any competitor, 5=only us could say this)

PASS threshold: average ≥3.5 across all key lines AND no single dimension <3.0 on any individual line. FAIL otherwise.

## A/B Variants block format (Route B only)

variant-agent's A/B alternatives appear as a single H2 section at the end of the artifact:

```markdown
## A/B Variants

### Hero — Variant B
[Variant copy]
**Hypothesis:** [what's being tested vs the selected hero]
**Test priority:** [high/medium/low]

### Final CTA — Variant B
[Variant copy]
**Hypothesis:** [what's being tested vs the selected final CTA]
**Test priority:** [high/medium/low]
```

variant-agent prioritizes high-leverage sections (hero, final CTA, primary social-proof) for A/B; mid-page sections get variants only if a specific hypothesis exists.

## Re-run convention

On re-run for the SAME slug: rename existing artifact to `[slug].copy.v[N].md` (increment N) and write fresh `[slug].copy.md`. Prior versions stay on disk for diff/comparison; latest is always the unversioned filename.

For NEW surface (different slug) — write fresh `[slug].copy.md`; no version increment.

## When critic catches a format violation

Critic FAIL on format/annotation issues:
- **Missing Pre-Writing block** → re-dispatch the orchestrator with format-conventions.md cite (orchestrator should have assembled Pre-Writing from pre-writing input; if missing, that's an orchestrator bug, not an agent bug)
- **Missing V/F/U scores** → re-dispatch the agent that owns the key line (hook-agent / cta-agent / etc.) with feedback "every key line requires V/F/U scores per format-conventions.md"
- **Missing Cut alternative** → re-dispatch the agent that owns the key line — agents already generate 3-5 internally; surfacing top runner-up is mandatory
- **Missing A/B Variants section (Route B)** → re-dispatch variant-agent
- **Scoring format wrong** (e.g., `4/5` instead of `V:4 F:5 U:3`) → orchestrator-side normalization; do NOT consume a critic rewrite cycle on format-only normalization
