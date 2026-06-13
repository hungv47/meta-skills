---
kind: routing-root
lifecycle: snapshot
read-by: /forsvn (resume)
written-by: /forsvn (every invocation)
---

# `.forsvn/routing/` — `/forsvn` Resume Metadata + Intent History

Every `/forsvn` invocation writes a routing record here. On subsequent invocations, `/forsvn` reads the most recent record to offer resume.

## Files

```
routing/
├── last-session.md      # most recent invocation, overwritten each time
├── history/
│   └── YYYY-MM-DD-HHMMSS-<intent-tag>.md   # append-only intent log
├── initiatives.md       # living index of active initiatives
└── execution-profile.json   # session execution profile (model, single-vs-multi, tool targets) — created at runtime; shape owned by the plugin's shared `execution-policy.md` reference
```

## `last-session.md` Schema

```markdown
---
timestamp: YYYY-MM-DD HH:MM:SS
intent: <classified user intent>
initiative: <slug or empty>
routed-to: /<skill-name>
status: dispatched | awaiting-user | completed | abandoned
next-action: <one line — what /forsvn expects on resume>
---

## Conversation Summary
<2-3 lines of what the user asked and what was decided>

## Open Questions
- <unresolved items the user didn't answer>

## Artifacts Produced This Session
- <path>
```

## History Append

Every invocation also drops a copy into `history/`. Lets `/forsvn` build the intent timeline without parsing git log.

## Initiatives Index

`initiatives.md` is a living table:

```markdown
| Slug | Started | Status | Last Activity | Next Step |
|---|---|---|---|---|
| q2-launch | 2026-05-19 | active | 2026-05-19 (lp-brief) | run copywriting on hero |
| pricing-test | 2026-04-12 | paused | 2026-04-20 | awaiting traffic data |
```

Updated by `/forsvn` whenever an initiative is created, advanced, paused, or completed.

## Resume Decision Rule

On invocation, `/forsvn` reads `last-session.md`:
- If `status: awaiting-user` AND timestamp < 7 days → offer resume as default.
- If `status: dispatched` AND `routed-to` skill produced an artifact → offer to evaluate or iterate.
- Otherwise → fresh classification.

User can always type "new" to skip resume.
