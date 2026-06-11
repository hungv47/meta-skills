# Design-Handoff Prompting — Opening-Prompt Protocol

> The opening prompt to a design tool sets the quality ceiling for the whole session. Everything typed after it is refinement and correction — those moves can hold the ceiling or lose it, but they rarely raise it. This catalog defines the opening prompt every design-tool hand-off block must satisfy, the edit-prompt taxonomy for follow-ups, and the Iteration Guide the brief carries.
>
> **Scope:** the four design-tool targets — `claude-design`, `pencil`, `figma`, `designer`. The coding-agent `handoff-implementation.md` already carries its own zero-ambiguity protocol (see `handoff-formats.md` § Implementation Prompt); this protocol governs the *design-tool* hand-off blocks specifically.
>
> **Use:** when handoff-agent composes a `claude-design` / `pencil` / `figma` / `designer` block, the opening of that block must clear the Required Fields checklist below, and the brief body must carry the Iteration Guide.

---

## Why the opening prompt is load-bearing

A design tool — Claude Design, a Figma generator, a coding agent driving a design surface — does not reliably carry an already-approved design system into the first page prompt. An approved brand, palette, and component library sitting in the session is *context the tool will partially ignore*: it regenerates from what the prompt says, not from what the session holds. Two consequences shape this protocol:

1. **The opening prompt must restate visual values in full** — hex, type tokens, spacing, surface rules, motion — even when `DESIGN.md` already defines them and the tool already "has" them in session. Treat the design system as un-passed until the prompt names it.
2. **A weak opening cannot be recovered by volume.** More prompts do not climb back to a ceiling the opening never set. A long correction session drifts *further* from the brief, not closer — each corrective fights to rebuild ground a stronger opening would have held. The fix is a complete opening, not more turns.

A complete opening correlates with finished output; a thin opening ("make me a landing page", a one-word confirmation, an asset swap) correlates with output that never leaves the rough stage. The hand-off block is the opening — compose it to carry the ceiling.

## Required Fields — every design-tool opening prompt

The opening block of a `claude-design` / `pencil` / `figma` / `designer` hand-off must fix all nine in place. A field left implicit is a field the tool invents.

| # | Field | Source | Lift rule |
|---|---|---|---|
| 1 | Project + page goal | brief — IMC Context + page identity | summarize |
| 2 | Audience + pains | brief — Hypothesis / evidence digest | summarize |
| 3 | Conversion hypothesis | brief — Hypothesis (Approved) | 1-line claim, verbatim |
| 4 | Brand voice constraints | brand_digest | **verbatim** — forbidden vocab + preferred phrasing |
| 5 | Exact visual values | `DESIGN.md` via brand_digest | **verbatim** — hex, type tokens + weights, spacing scale, surface rule, motion tokens |
| 6 | Section architecture | brief — Page Architecture | section list, one-line purpose each |
| 7 | Interaction + motion constraints | brief — section-spec motion + DESIGN.md | per-section motion recipe or "static" |
| 8 | What NOT to change | brief — What NOT to Do + sacred elements | **verbatim** — sacred rails |
| 9 | Output target | `target_handoff` + brief | single layout / variants / frames / code |

Fields 4, 5, and 8 are **verbatim lifts** — paraphrase is drift. Field 5 is the one most often dropped, and it is the one that decides the ceiling: see the next section.

## The visual-values rule (hard gate)

**Every design-tool opening prompt repeats the exact visual values from `DESIGN.md` — even though the design system is already built and the tool already "has" it.**

Restate, in the opening block:

- **Palette** — every hex with its token name (`#004700` primary, `#74B36B` accent, `#F5F4EE` warm-neutral background). Not "the brand palette."
- **Type** — display + body family, weights used, the size/leading scale. Not "brand typography."
- **Spacing** — the scale or rhythm the page uses. Not "consistent spacing."
- **Surface** — the architectural rule (matte / no glass / paper). Not "on-brand surfaces."
- **Motion** — duration + easing tokens, or "static" where the brief says static.

"The tool will read the design system" is the assumption that produces the thinnest output. The design system you approved is not context the tool can be trusted to apply on its own — name it in the prompt. brand-voice critic **G8** fails any design-tool hand-off block whose opening omits the visual values, even when `DESIGN.md` is otherwise referenced.

## Edit-Prompt Taxonomy — follow-up moves

After the opening, every prompt the operator types is one of five moves. Naming the move keeps the session from drifting. The brief's Iteration Guide uses this taxonomy to tell the operator which moves are safe.

| Move | What it does | When | Risk |
|---|---|---|---|
| **Scaffolding** | Builds something new from nothing | First prompt only — unless the operator is intentionally restarting | High mid-session: discards working structure |
| **Additive** | Adds one section or component to what exists | Any time a new piece is needed | Low — scoped, reversible |
| **Refinement** | Adjusts one property or one relationship | Any time | Low — the safe default for iteration |
| **Corrective** | Restores a constraint the tool broke | After the tool drifts off a locked value | Low — but a corrective means a constraint was stated too weakly; tighten the opening for next time |
| **Reset / Meta** | Asks the tool to step back and reconsider | Rarely — only with an explicit restart decision | **Highest.** The tool reads "reconsider" as "discard." |

Two rules carry the session:

- **Scaffolding belongs at the start.** After the opening, work in additive and refinement moves. A scaffolding prompt mid-session throws away the ceiling the opening set.
- **A meta prompt is a restart, not a nudge.** "Reconsider the layout", "rethink the structure", "make it feel different" — the tool discards the current direction and the session rarely recovers. If a restart is genuinely wanted, say so explicitly: `"Discard the current direction and restart from:"` followed by a full opening block. If not, use a refinement that names the one property to change.

## Iteration Guide — carried in the brief

Every brief with a design-tool `target_handoff` carries a short **Iteration Guide** in the Hand-Off section: a 5–10 line operator note that names the first two or three likely follow-up moves — classified by the taxonomy above — plus the one meta prompt to avoid for this page. It is not a script; it is a guardrail against the drift pattern. The brief body block and its format live in `format-conventions.md` § Hand-Off (Specialty Targets).

Example shape:

```
ITERATION GUIDE (after the opening prompt above)
- Refinement, expected: hero spacing — "Increase hero vertical padding ~30%."
- Additive, expected: trust row — "Add a 6-logo customer grid below the hero CTA."
- Corrective, if it drifts: surface — "Restore matte surfaces; the hero went glassy."
- Do NOT type: "Reconsider the page" / "rethink the layout" — the tool discards
  the structure. To restart, paste a full new opening block.
```

## Hard Gates

1. **No design-tool opening prompt ships without all nine Required Fields.** A missing field is invented by the tool.
2. **Visual values are repeated verbatim** in every design-tool opening prompt, regardless of whether `DESIGN.md` is available to the tool. Enforced by brand-voice critic **G8**.
3. **The Iteration Guide recommends additive / refinement / corrective only.** A restart is an explicit new opening block, never a mid-session scaffolding prompt.
4. **Meta prompts carry an explicit "discard the current direction" warning** or are not recommended at all.

Anti-patterns: `anti-patterns.md` § Section 3 — Design-handoff prompting patterns (vague premium ask, broad mid-session reset, token inference from prior context).
