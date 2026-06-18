# Format Conventions — event-runofshow

## Artifact frontmatter (10 fields — v3 contract)

```yaml
skill: event-runofshow
version: 1
date: YYYY-MM-DD
stack: marketing
type: execution
id: runofshow-<event>-<slug>
review_surface: md
status: done | done_with_concerns | blocked | needs_context
event_type: webinar | launch-event | ama | demo-day | talk | hybrid
keywords: [run-of-show, event, <event_type>, live]
```

Conforms to `references/_shared/artifact-contract-template.md`.

## Body sections (in order)

1. **`## Event`** — goal (the one outcome) · cast · platform/tech · total runtime · date.
2. **`## Run of Show`** — the master table:

   | Start | Dur | Segment | Owner | Content beats | Cue (verbal · tech · trigger) | Fallback |
   |---|---|---|---|---|---|---|

   Durations MUST sum to the total runtime (state the sum + the buffer).
3. **`## Pre-Show Checklist`** — everything true before "live" (mics, demo account, slides, backup recording, link in chat).
4. **`## Contingency Playbook`** — one fallback per SPOF: demo breaks · guest no-show · tech/stream fails · silent Q&A (3 seeded questions) · overrun (which segment compresses).
5. **`## Critic Verdict`** — 6-row table (5 dims + total).

## Rules
- Times are explicit clock offsets (`0:00`, `0:12`), not "early/mid/late".
- The final segment is the CTA/ask, never trailing logistics.
- One owner per row; name speaker + tech-driver when different.
