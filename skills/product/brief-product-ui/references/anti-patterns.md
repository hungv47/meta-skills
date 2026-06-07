# Anti-Patterns — Brief-Product-UI

10-pattern catalog. Re-read before ship. The first 6 are skill-specific and each maps to the
checkpoint (CP-NN) that catches it; the last 4 are cross-cutting stack patterns, each caught by a
stack mechanism (critic / schema / mode-resolver / re-run trigger) rather than a single CP.

| # | Anti-pattern | Why it fails | Catch |
|---|---|---|---|
| 1 | **Invented screens** — a screen/state with no trace to the source flow | Designs product the flow never declared; un-buildable against the contract | CP-01 → screen-inventory-agent |
| 2 | **Rendering instead of speccing** — calling an image-gen / design API to produce pixels | Destroys the skill's identity (it's a spec emitter); duplicates the external renderers | CP-08 → handoff-agent; `--render`/`--api` → BLOCKED (orchestrator pre-dispatch gate) |
| 3 | **Raw hex/px** — `#1a1a1a` / `padding: 16px` not bound to a DESIGN token | A design tool can't map raw values to the system; brand drift | CP-03 → token-application-agent |
| 4 | **Per-screen component one-offs** — re-inventing a card/button per screen instead of a reuse map | Explodes the component count; inconsistent UI; un-systematic handoff | CP-02 → component-system-agent |
| 5 | **"Show error" hand-waving** — a state named but not visually specified | The build surface has to invent the empty/loading/error treatment | CP-05 → layout-state-agent |
| 6 | **Skipped accessibility floor** — no contrast/focus-order/touch-target/reduced-motion | Ships an inaccessible spec; expensive to retrofit | CP-06 → layout-state-agent |
| 7 | **Sycophancy** — declaring the spec done without running the critic gate | The 8-CP rubric is the quality contract; skipping it ships unverified work | full critic pass required |
| 8 | **Artifact-contract drift** — sections/frontmatter not matching `format-conventions.md` | Breaks downstream consumers (architect-system, forsvn preview) and validate-artifacts | `format-conventions.md` schema |
| 9 | **Mode misuse** — letting `--fast` skip the intake gate or the critic | Safety gates supersede `--fast`; a fast run still grounds in the flow and passes the critic | `_shared/mode-resolver.md` |
| 10 | **Stale upstream** — designing against an outdated/superseded `map-user-flow` | The spec drifts from the real flow; re-run on flow changes | re-run trigger (Chain Position) |

## When the critic FAILs

The critic returns failing CP-IDs with a fix + named agent per
[`procedures/gates-and-rubric.md`](procedures/gates-and-rubric.md) § "Critic FAIL handling." Re-dispatch
that agent with the feedback; max 2 cycles; after 2 FAILs ship `DONE_WITH_CONCERNS` with annotations.
