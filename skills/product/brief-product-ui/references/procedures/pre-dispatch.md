# Pre-Dispatch — Read Order + Dimensions

Cited by `SKILL.md` "Pre-Dispatch" section. Apply the canonical Pre-Dispatch protocol
(`../_shared/pre-dispatch-protocol.md`). brief-product-ui has a **mandatory intake gate** —
a parseable `map-user-flow` artifact must exist — that fires **before** any Pre-Dispatch
question. Gate logic and rationale are in `../procedures/gates-and-rubric.md` § "Why the
intake gate precedes Before Starting". A skill that designs screens the flow never declared is
inventing product, not specifying it.

## Needed dimensions

- **feature** — the scope being designed (screen set, flow segment, or single surface)
- **map-user-flow artifact path** — REQUIRED; resolved from `.forsvn/index/manifest.json`
  or provided explicitly; absent → `NEEDS_CONTEXT`, recommend `/map-user-flow`
- **target surfaces** — read directly from the flow artifact; never re-asked
- **brand source** — house FORSVN tokens (`brand/DESIGN.md`), named brand (e.g. Conquis),
  or cold-start hint (primary accent + background + type stack)
- **target build engine** — design tool (Figma, Stitch), coding agent, or portable spec only
- **constraints** — platform (macOS, iOS, web), density preference (compact / default /
  spacious), accessibility level (WCAG AA or AAA)

## Read order

1. **Intake gate:** confirm a `map-user-flow` artifact exists and is parseable. If absent,
   emit `NEEDS_CONTEXT` and stop — do not interview for screen content.
2. **Pipeline:** `../procedures/gates-and-rubric.md` for the 8-CP critic rubric and all 5
   critical gates — read before any Layer 1 dispatch.
3. **Experience:** `docs/forsvn/experience/{product,design,goals}.md` for project-level design
   history and prior decisions.
4. **Brand + tokens:** `brand/DESIGN.md` (tokens, spacing, elevation scale) and
   `brand/BRAND.md` (voice, component naming conventions).

## Before-Starting checklist (applied after the intake gate)

Per `../_shared/before-starting-check.md`:

0. **Mode resolution** — `budget: deep`. Mode-resolver (`../_shared/mode-resolver.md`)
   applies canonical heuristics. `--fast` flag collapses Layer 1 only. Safety gates
   supersede `--fast` — the intake gate, brand check, and spec-not-render gate always fire.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches
   canonical inventory.
2. Read `.forsvn/index/manifest.json` for the flow artifact path + any prior spec files at
   this slug + cross-artifact staleness.
3. Read `docs/forsvn/experience/{product,design,goals}.md`.

## Warm Start

When a `map-user-flow` artifact and DESIGN tokens already exist:

1. Auto-scan `.forsvn/index/manifest.json` for the latest flow file at the matching slug and
   any `brief-product-ui` spec for the same slug.
2. Resolve brand source from prior `brief-product-ui` frontmatter or, if absent, default to
   the house DESIGN.md tokens.
3. Read target surfaces from the flow artifact directly — do not prompt again.
4. Confirm resolved values to the operator in one line; proceed without a question round.

## Cold Start

Ask ≤ 5 questions, only for genuinely missing dimensions:

1. Feature / scope (if not in the invocation)
2. Brand source — house tokens, named brand, or colour hints (if DESIGN.md absent)
3. Target build engine (if not specified)
4. Density + accessibility level (if constraints absent)
5. Platform (if not inferrable from the flow)

If the flow itself is missing → emit `NEEDS_CONTEXT` (recommend `/map-user-flow`) and stop.
Do not interview around a missing flow. Do not ask about target surfaces — read them from
the flow.

## Write-back

After resolving all dimensions, append a context entry to `docs/forsvn/experience/` per
`../_shared/pre-dispatch-protocol.md` § write-back rules. Record: flow artifact path,
resolved surfaces, brand source, build engine, constraints, and any design decisions locked
in this session. This prevents the same questions from firing on the next `/brief-product-ui`
run for the same feature.
