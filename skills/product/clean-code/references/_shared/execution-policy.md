<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: Execution Policy — session execution profile (model-aware single-vs-multi)
lifecycle: canonical
status: stable
produced_by: meta-skills (authored once; consumed by every skill)
consumers: every skill that can dispatch sub-agents; the /forsvn dispatcher owns the ask
load_class: PLAYBOOK
---

# Execution Policy — the session execution profile

**Single source of truth for how a session resolves its single-vs-multi-agent execution
choice, how the running model shapes the recommended default, and how every skill
inherits that choice without re-litigating it per invocation.**

The failure this prevents: skills silently fan out to multiple sub-agents and burn
session usage regardless of the model tier the operator is paying for. The fix: one
explicit, model-aware choice per session — resolved once, written to a substrate every
skill reads, overridable per invocation.

This file owns the **ask** and the **substrate**. The tier/override mechanics it slots
into are owned by [`mode-resolver.md`](mode-resolver.md) — this policy adds a session
axis on top of that contract; it does not replace it.

---

## The substrate: `.forsvn/routing/execution-profile.json`

Session-scoped state, written by **whoever resolves the profile first** (the `/forsvn`
dispatcher, or the first leaf skill invoked directly) and read by every subsequent
dispatch. Created at runtime — never shipped in a repo, never committed as a template.

```json
{
  "model": "<detected or operator-stated model id>",
  "agents": "single" | "multi",
  "tool_targets": { "<category>": "<tool>" },
  "resolved_at": "<ISO-8601 timestamp>"
}
```

| Field | Meaning |
|---|---|
| `model` | The model this profile was resolved against. Used by the staleness rule. |
| `agents` | The session execution choice. `single` = no sub-agent fan-out; `multi` = the skill's documented orchestration. |
| `tool_targets` | Per-category tool-target choices (`design`, `video`, `image`, …). **Reserved here** — populated by the companion [`tool-target.md`](tool-target.md) fork, not by this policy. Treat unknown keys as opaque; never delete them when rewriting the file. |
| `resolved_at` | When the profile was resolved. Compared against session start for staleness. |

Why here and not elsewhere: `docs/forsvn/experience/` is durable (wrong for per-session
state); artifact frontmatter is per-artifact; env vars cannot be written back
mid-session. `.forsvn/routing/` already holds per-session routing state.

---

## Model detection

**Claude Code:** a SessionStart hook (`hooks/session-start-model.mjs`) reads the
session-start payload's `model` field and appends

```
FORSVN_SESSION_MODEL=<model>
```

to the file at `$CLAUDE_ENV_FILE`, exporting the model to the session env. When
`FORSVN_SESSION_MODEL` is present, never ask which model is running — it is known.

**Env var absent** (Codex, Cursor, hook-less or older Claude Code sessions): the model
question joins the bundled ask below. The substrate is harness-agnostic — only the
detection mechanism is Claude-Code-specific; the JSON file and the precedence rules
work identically everywhere.

---

## The one bundled ask

Fired at **first dispatch in the session** when no fresh profile exists. One
round-trip, never two:

1. **"Which model are you running?"** — only when `FORSVN_SESSION_MODEL` is absent.
2. **"Single-agent or multi-agent for this session?"** — always, with a model-aware
   recommended default pre-selected.

**Model-aware default:**

| Detected/stated model | Recommended default | Why |
|---|---|---|
| Capable/expensive tier (opus/fable-class, large frontier models) | **single** | One strong pass matches multi-agent quality at a fraction of the usage; fan-out burns budget without a quality delta. |
| Smaller/cheaper tier (haiku-class, mini/flash-class) | **multi** | Parallel perspectives + a critic pass compensate for a weaker single pass. |
| Unknown (operator declines to say) | **single** | Conservative on usage; the operator can flip to multi anytime. |

The answer is written to `execution-profile.json` immediately. Every later skill in the
session inherits it silently — the second, third, nth invocation asks **nothing**.

---

## Precedence (highest wins)

1. **Per-invocation flags/phrases** — `--fast`, upward phrases ("run this thoroughly",
   "deep mode") per `mode-resolver.md` § Override. One run only; the profile is not rewritten.
2. **Session profile** — `agents` from `execution-profile.json`.
3. **Model-aware default** — the table above, when a model is known but no profile exists yet (resolve + write the profile, don't silently apply).
4. **Skill budget default** — the skill's `budget:` tier per `mode-resolver.md`.

Auto-downgrade heuristics (`mode-resolver.md`) still apply **within multi mode** — a
multi profile never forces fan-out onto a trivially-shaped input. Under a `single`
profile they are moot (already single).

---

## Staleness — when to re-ask

Re-resolve (re-fire the bundled ask) when any of:

- `resolved_at` is **older than the current session's start** — the profile belongs to a previous session.
- `FORSVN_SESSION_MODEL` is present and **differs from the recorded `model`** — mid-stream model change.
- The file is **missing, unreadable, or malformed JSON** — re-ask, **never crash** and never guess from a corrupted profile.
- The operator explicitly asks to change it ("switch to multi-agent for this session").

When rewriting after a re-ask, preserve any `tool_targets` entries unless the operator
also changed tools.

---

## Exemption class — inherently-multi-agent skills

Skills whose *value is the fan-out* — `debate-agents`, and critic-mandatory `deep`
skills — are exempt from a literal reading of `single`. Under a `single` profile,
**"single" means skip the heavy fan-out, not the guardrails** — exactly the existing
`--fast` semantics in `mode-resolver.md` § "What `--fast` does NOT skip" (cold start,
hard safety gates, and mandatory critic checks survive; optional parallel layers
collapse). Do not re-define that contract here — cite it.

**Never silent:** when the profile forces single on a normally-deep skill, announce the
downgrade in one line, e.g.:

> Running single-agent per session profile (constrained mode — rerun with "multi" or an upward phrase for full orchestration).

---

## Harness fallback

No hook support (Codex, Cursor, plain CLI) → the ask path is the contract, not an
error path. The profile file works the same; only model detection degrades to asking.
Never treat a missing `FORSVN_SESSION_MODEL` as a failure.

---

## How a skill cites this

In the SKILL.md body, one line (adjacent to the mode-resolver cite where present):

```
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.
```

Fast-tier skills where the choice cannot change output (`forsvn`, `discover`) do not
cite this — the dispatcher owns the ask itself. Do NOT inline the ask, the default
table, or the precedence order into a skill body — cite this file.
