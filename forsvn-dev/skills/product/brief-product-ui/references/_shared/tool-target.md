<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Tool Target — the brief-binding "which tool will this output target?" fork

**The third fork. A tool-agnostic producing/briefing skill asks — once per category per
session — which external tool its output should TARGET, then tunes the brief to that
tool: prompt dialect, parameter vocabulary, capability assumptions.** Targeting changes
what the skill *writes*, never where it runs — the skill does not drive the tool (that is
[`tool-redirect.md`](tool-redirect.md) live-drive, registry-gated on a drivable engine)
and does not execute the handoff (that is the terminal
[`execution-fork.md`](execution-fork.md)). A Midjourney prompt is not a gpt-image prompt;
a Figma-bound spec names auto-layout where a generic HTML/CSS spec doesn't — that delta
is this fork's whole job.

Skills cite this file instead of inlining the ask (same contract for all; inlining blows
the per-skill body budget). Two companions own the moving parts:
[`execution-policy.md`](execution-policy.md) owns the **substrate** (the `tool_targets`
map in `.forsvn/routing/execution-profile.json`);
[`tool-registry-spec.md`](tool-registry-spec.md) § "Target-tool catalog" owns the
**names** — the registry stays the single tool catalog; never hardcode a list in a skill.

---

## When it fires — brief-binding, materiality-gated

At **brief-binding**: the moment the skill commits to the shape of its output, before
producing. And **only when the output would materially differ by target tool**. If the
output is identical regardless of target (a strategy doc, a copy block, a flow map),
don't ask — produce the generic artifact. The fork is dormant by default, not a toll
booth.

Inheritance always comes first — the ask fires only when nothing below already answers it:

1. **Session profile.** `tool_targets[<category>]` exists and the profile is fresh
   (staleness rule: `execution-policy.md`) → **inherit silently**. Never re-ask a
   category within a session.
2. **Upstream live-drive.** A `tool-redirect.md` live-drive already bound an engine for
   this category this session → the target **is** that engine. Inherit silently and
   record it into `tool_targets[<category>]` so later skills inherit too.
3. **Nothing recorded** → ask once (the block below), write the answer to
   `tool_targets[<category>]` immediately.

Downstream, the terminal `execution-fork.md` **reuses** the recorded target as the
category's engine preference. Net rule: **one run never asks three tool questions** —
upstream redirect, target binding, and the terminal fork share one answer per category.

## The block

```markdown
## Target tool
This {brief|prompt|spec} can be tuned to the tool that will run it ({category}).
- [x] Tool-agnostic — the portable, generic {brief|spec}; runs anywhere.   (default, always)
- [ ] Target {tool A} — {one-line capability/syntax consequence}
- [ ] Target {tool B} — {one-line capability/syntax consequence}
```

Offer the category's named targets from the registry's target-tool catalog
([`tool-registry-spec.md`](tool-registry-spec.md) § "Target-tool catalog") — keep the
list short (the catalog's entries, not an exhaustive market survey). **Tool-agnostic is
first-class and pre-checked**: "just give me the brief" produces the current generic
output unchanged, and is always the right answer when the operator doesn't care.

## Cross-category independence

The choice is **per category, never global, session-scoped**:

- A `design` choice never leaks onto a `video` stage. A design+video pipeline holds two
  independent `tool_targets` entries, each asked (or inherited) at its own stage's
  brief-binding.
- Persisted in `execution-profile.json` `tool_targets` only — never in a durable config,
  never in `docs/forsvn/experience/`. Next session starts clean.
- When rewriting the profile for any other reason, preserve `tool_targets` entries
  (execution-policy.md staleness rule already mandates this).

## Three forks, one run

| | Upstream redirect ([`tool-redirect.md`](tool-redirect.md)) | **Target binding (this)** | Terminal fork ([`execution-fork.md`](execution-fork.md)) |
|---|---|---|---|
| **When** | near the skill's start, before producing | at brief-binding, before producing | after the brief/artifact is produced |
| **Question** | agnostic brief, or drive live in <tool>? | which tool should this output *target*? | Brief-only, Assisted, or Direct? |
| **Changes** | the production mode — build *inside* the tool | the brief's dialect/capability tuning | how the finished handoff is executed |
| **Gated on** | a drivable engine in the registry (live now) | output materially differing by target | engine `verified` in the registry |
| **Default** | tool-agnostic brief | tool-agnostic | Brief-only |
| **Persists** | `execution_mode` + provenance engine | `tool_targets[<category>]`, session-scoped | `execution_mode` on the artifact |

Live-drive answers all three (the engine is the target is the executor). A recorded
target answers this fork and pre-seeds the terminal fork's engine preference. The
terminal fork alone never re-opens the target question.

## Recording — provenance conventions

Reuse the `execution_mode` provenance conventions, don't invent parallel ones:

- **Session:** the choice lives in `tool_targets[<category>]` (substrate:
  `execution-policy.md`).
- **Artifact:** record the bound target in the artifact's **provenance** as
  `target_tool` (the field `brief-graphic` already carries), alongside — never inside —
  `execution_mode`. `tool-agnostic` is recorded explicitly, not omitted. See
  [`artifact-contract-template.md`](artifact-contract-template.md).
- The enum stays clean: `execution_mode` says *how it ran*; `target_tool` says *what the
  output was tuned for*.

## How a skill cites this

In the SKILL.md body, near the Tooling/Execution cites, add one line:

```
At brief-binding, bind the {category} target tool — inherit `tool_targets` or ask once
per `references/_shared/tool-target.md`; tool-agnostic stays the default.
```

That keeps the contract in one place and the skill body under its budget cap. Skill-side
prompt-dialect tuning stays in the skill (it knows *how* to speak to each target); this
file only owns when to ask, what to offer, and where the answer lives.
