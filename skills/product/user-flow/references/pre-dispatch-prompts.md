---
title: User-Flow — Pre-Dispatch Prompts
lifecycle: canonical
status: stable
produced_by: user-flow
load_class: PROCEDURE
---

# Pre-Dispatch Prompts

**Load when:** Pre-Dispatch step fires. The mandatory **platforms + surfaces gate** sits inside the question set — no Layer 1 dispatch until Q3 and Q4 are explicit. Emit verbatim; one round-trip resolution.

---

## Warm Start

Fires when product-context + prior flow files exist AND target platforms are inferable from project history (`skills-resources/experience/technical.md`).

```
Found:
- product/audience → "[from product-context.md]"
- prior flows → "[list of .agents/skill-artifacts/product/flow/*.md]"
- typical platform set → "[from experience/technical.md]"

Need before dispatching: feature name + goal + platform set + primary surface per platform.
(Platform set is the mandatory gate — must be explicit, no "cross-platform".)
```

If operator confirms platforms inline → proceed. If operator's platform list differs from `technical.md` → write-back updated set after dispatch.

## Cold Start

Fires when no upstream context (no product-context, no prior flows, no inferable platforms).

```
user-flow maps a feature into structure, edge cases, and platform-native
wireframes. The mandatory gate is platforms+surfaces — without explicit
enumeration, wireframe size, entries, and edge states all become guesses.

1. **Feature/flow name** — what's being mapped? (E.g., "checkout", "onboarding".)
2. **Role + goal** — who's using it (role, technical skill, frequency)
   and what's the single user goal this flow serves?
3. **Platforms** — explicit list from this catalog ONLY:
   `macOS`, `iOS`, `iPadOS`, `Android`, `Windows`, `web-desktop`,
   `web-mobile`, `watchOS`, `tvOS`, `visionOS`, `CarPlay`, `Android Auto`, `Linux`.
   "Cross-platform" is rejected.
4. **Surfaces per platform + primary** — for each platform you listed, name
   the surfaces (from `references/platform-touchpoints.md` catalog) and
   designate the *one* primary surface (drives default wireframe size).
   E.g., "iOS: app + widget + Live Activity, primary=app".
5. **Constraints** — authentication (logged in / guest / role-based),
   business rules forcing specific paths, minimum OS versions.

Answer 1-5 in one response. Q3 + Q4 are gates — no Layer 1 dispatch until both are explicit.
```

## Write-back rules

After Cold Start resolves, persist only durable context:

| Q | File | Key | Rule |
|---|---|---|---|
| 2. Role | `skills-resources/experience/audience.md` | `Audience — [feature] persona` | Only if novel (not already in audience.md) |
| 3. Platforms | `skills-resources/experience/technical.md` | `Technical — supported platforms` | Durable across flows; update on new platforms |
| 5. Min OS versions | `skills-resources/experience/technical.md` | `Technical — min OS versions` | Durable across flows |

Feature name (Q1), goal (Q2), surfaces per flow (Q4), and per-flow constraints (Q5 except OS minimums) are project-specific — live in the flow file itself, not persisted to experience.

## Context to pass to all agents

After Pre-Dispatch resolves, the orchestrator builds a brief containing: product · user · goal · slug · platform list · surface matrix · cross-platform channels · primary surface per platform · min OS versions · constraints. This brief is appended to every agent dispatch in Layer 1, Layer 2a, and Layer 2b.

## Safety gate (under `--fast`)

`--fast` skips multi-agent dispatch but does NOT skip Pre-Dispatch. The mandatory platforms+surfaces gate fires regardless — wireframe size and edge states cannot be inferred without it. If `--fast` invocation arrives with no resolvable platform signal AND no prior `technical.md` entry, Pre-Dispatch still fires the platforms+surfaces gate before dispatch. Mode-resolver's `safety-gates-supersede-fast` clause is the contract.

Critical Gates (the 7 gates in SKILL body) also fire under `--fast`. Single-Agent Fallback executes the 6 agents' instructions sequentially in-context, but every gate runs.
