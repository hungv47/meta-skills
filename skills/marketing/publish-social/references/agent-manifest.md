# Publish-Social Agent Manifest

Loaded by the orchestrator when entering route dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Formatter | 1 | `agents/formatter-agent.md` | Per-platform formatting + scheduler-import file emission + Typefully API draft when credentials present. |
| Automation | 2 | `agents/automation-agent.md` | Browser-automation for 8 non-X platforms via agent-browser — drafts (D17) OR live Send (D18 `--mode=publish`). Per-platform sequential with 3s pacing. |
| Critic | 3 | `agents/critic-agent.md` | 8-dim rubric: char-caps · media specs · CTA visibility · hashtag rules · scheduler-format validation · anti-pattern compliance · browser-automation safety · live-publish safety (dim 8 orchestrator-applied). |

## Routes

Per-platform auto-detect probes credentials at invocation. It resolves only to `export` or `draft` — **never `publish`** (Critical Gate 1). Every route ends formatter → critic → write bundle.

### Route A — no credentials

Formatter-agent runs export-mode for all 9 platforms → critic (dims 1-7) → write bundle.

### Route B — Typefully key

X via Typefully Draft API (draft IDs + URLs), other 8 export-mode → critic → write bundle.

### Route C — browser-automation cookies (D17)

```
formatter (format every draft + write export-mode fallback)
  → confirmation gate (per-platform 80-char preview + single confirm)
       decline / timeout → roll back to export for draft-route platforms
  → automation-agent (sequential, 3s pacing, per-platform export fallback on failure)
  → critic (dim 7 = automation safety)
  → write bundle
```

### Route D — `--mode=publish` (D18)

No credentials → BLOCKED. Else:

```
formatter (resolve publish routes + write export fallback)
  → critic content gate (dims 1-7)
       persistent FAIL → BLOCKED, gate never fires
  → if --dry-run: print plan, exit
  → two-stage confirmation gate
       Stage 1: review every full post body
       Stage 2: type word `PUBLISH`
       abort / timeout → export bundle, nothing posted
  → publish (Typefully schedule-immediate for X, automation-agent Send for the 8)
       per-platform failure → fallback-draft / export
  → orchestrator applies dim 8
```

**Critic moves before the action for publish because a live post cannot be fixed afterward.**

## Pattern Catalogs (consumed by named agents)

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/scheduler-formats.md` | formatter | Typefully JSON / Buffer / Hootsuite / generic CSV schemas. |
| `references/platforms/{platform}.md` | formatter | Per-platform format rules — char caps, hashtag conventions, CTA position. |
| `references/platform-credentials.md` | orchestrator | Auth contract — Typefully key + session_cookies fields. |
| `references/automation-flows/{platform}.md` | automation | Per-platform browser flow (8 files; X uses Typefully instead). |
| `references/confirmation-gate.md` | orchestrator, Route C | D17 single-confirm draft protocol. |
| `references/publish-confirmation-gate.md` | orchestrator, Route D | D18 two-stage publish gate (Stage 1 review + Stage 2 `PUBLISH` typed confirm). |
| `references/session-cookie-export.md` | operator-facing | How to export session cookies from each platform. |
| `references/rubric.md` | critic | 8 dims × 0-10 scoring. |
| `references/anti-patterns.md` | critic | 17 patterns: 7 publish-social-specific + 3 D17 browser-automation + 3 D18 live-publish + 4 cross-cutting. |

Full per-route dispatch logic: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
