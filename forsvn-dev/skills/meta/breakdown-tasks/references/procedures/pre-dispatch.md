# Pre-Dispatch — breakdown-tasks

Procedural detail extracted from SKILL.md. Builds on the canonical contract at [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md).

**Needed dimensions:** source (architecture / spec / conversation), scope mode (FULL / LOCKED / MINIMAL), autonomy bias (mostly AFK / mixed / mostly HITL), audience (AI agent / human dev / mixed).

## Warm Start

(Architecture or spec exists; scope clear from upstream.)

```
Found:
- architecture → "[1-line summary]"
- declared scope → "[FULL | LOCKED | MINIMAL, from spec or conversation]"

Proceeding with these. Override scope mode or autonomy bias, or proceed?
```

## Cold Start

(No upstream artifacts, no session context.)

```
task-breakdown decomposes work into buildable tasks with stable IDs, deps,
acceptance criteria, and autonomy classification. Before I dispatch:

1. **Source** — paste the architecture/spec, name a file path, or describe
   the work in 2-3 paragraphs. Defer to `/discover` first if requirements
   are still fuzzy — task-breakdown won't conduct an interview.
2. **Scope mode** — FULL (capture everything), LOCKED (build exactly what's
   spec'd, flag gaps but don't add), or MINIMAL (actively cut to MVP)?
3. **Autonomy bias** — mostly AFK, mixed, or mostly HITL?
4. **Audience** — AI agents, human devs, or both?

Answer 1-4 in one response. I'll decompose.
```

## Write-back

None. Task lists are project-specific, not user-profile — no `experience/` dimension persisted.
