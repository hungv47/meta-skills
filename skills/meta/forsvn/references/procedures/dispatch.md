# Dispatch — Steps 4 & 5

## Step 4 — Load context + dispatch

Before dispatching:

1. **Product context.** If `.forsvn/context/product-context.md` is missing AND the routed skill needs it (marketing, product, research) → autodraft from `README.md`, `brand/BRAND.md`, `research/*.md`, `package.json`. Mark `status: draft`. Tell the user: "Autodrafted product context. Review before treating as canonical." Drafts are usable; do not block dispatch.
2. **Experience.** Grep `.forsvn/experience/*.md` for keywords matching the intent. Surface anything relevant: "You previously said X — still applies?"
3. **Initiative slug.** New → propose a kebab-case slug, user confirms. Resuming → use existing slug.

Then print the hand-off:

```
→ /<skill-name>

Why: <one line>
Reads: <key context files>
Writes: .forsvn/artifacts/<initiative>/<skill>/...
```

Operator types the slash command. `/forsvn` does NOT auto-invoke.

## Step 5 — Persist routing record

Write `.forsvn/routing/last-session.md` (overwrite) and append a copy to `.forsvn/routing/history/YYYY-MM-DD-HHMMSS-<intent-tag>.md`.

```markdown
---
timestamp: YYYY-MM-DD HH:MM:SS
intent: <classified intent>
initiative: <slug or empty>
routed-to: /<skill-name or empty if summary>
status: dispatched | awaiting-user | completed | abandoned
next-action: <one line>
---

## Conversation Summary
<2-3 lines>

## Open Questions
- <unresolved items>

## Artifacts Produced This Session
- <paths, or "none yet">
```

Update `.forsvn/routing/initiatives.md` if a new initiative was created or status changed.

## Bootstrap (first run)

If `.forsvn/` does not exist at the project root:

1. `mkdir -p .forsvn/{context,experience,artifacts,loops,evals,routing,dashboard}`.
2. Copy templates from this skill's `templates/` dir.
3. Add `.forsvn/` to `.gitignore` only if the user confirms — some track their context, others don't.
4. Tell the user: "Scaffolded `.forsvn/`. Your shared context will live there."

Then run the normal 5-step flow.
