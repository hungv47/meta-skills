# Write-Docs Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| scanner-agent | 1 (parallel) | `agents/scanner-agent.md` | Maps project structure, file-importance ranking, existing docs inventory. |
| concept-extractor-agent | 1 (parallel) | `agents/concept-extractor-agent.md` | Reads key files, extracts features, setup requirements, error patterns. |
| audience-profiler-agent | 1 (parallel) | `agents/audience-profiler-agent.md` | Identifies audience, calibrates vocabulary and depth. |
| writer-agent | 2 (sequential) | `agents/writer-agent.md` | Writes documentation from extracted concepts for the profiled audience. |
| staleness-checker-agent | 2 (sequential) | `agents/staleness-checker-agent.md` | Compares documentation against current codebase for accuracy. |
| critic-agent | 2 (final) | `agents/critic-agent.md` | Quality gate review, audience calibration check, staleness integration. |

## Execution Layers

```
Layer 1 (parallel):
  scanner-agent ──────────────┐
  concept-extractor-agent ────┤── run simultaneously
  audience-profiler-agent ────┘

Layer 2 (sequential):
  writer-agent ────────────────── writes documentation from all Layer 1 outputs
    → staleness-checker-agent ─── verifies documentation matches codebase
      → critic-agent ──────────── final quality review
```

## Dispatch Protocol

1. **Layer 1 dispatch** — send brief to all three Layer 1 agents in parallel.
2. **Writer dispatch** — send all Layer 1 outputs to `writer-agent`. It produces documentation following [`doc-template.md`](doc-template.md) (or the route-specific template in Routes D + E), calibrated for the audience.
3. **Staleness check** — send writer output + codebase facts to `staleness-checker-agent`. Verifies every claim in the docs matches the current codebase.
4. **Critic review** — send documentation + staleness results to `critic-agent`. Default + Routes A/B/C/audit apply the 6 standard critical gates; Routes D + E apply mode-specific gates.
5. **Revision loop** — critic FAIL → re-dispatch affected agents per [`anti-patterns.md`](anti-patterns.md). Max 2 rounds.
6. **Save** — write documentation to the route-specified path.

## Routing Rules

| Condition | Route |
|---|---|
| User specifies audience | audience-profiler uses it directly (no inference needed) |
| User says "document this" (no type) | audience-profiler defaults to User Guide (developers) or README (library) |
| User says "audit docs" / "check documentation" / "are docs up to date" | **Audit mode** — see [`modes/audit.md`](modes/audit.md); skip writer-agent |
| User says "sync docs", "update docs", or `--sync` | **Route C: Post-Change Sync** — see [`modes/sync.md`](modes/sync.md) |
| User says "ship log", "product context", "what does this app do", or `--ship-log` | **Route D: Ship Log** — see [`modes/ship-log.md`](modes/ship-log.md); writes canonical `research/product-context.md` with merge-mode check |
| User says "release notes", "changelog entry", "what changed in this version", or `--release-notes <version>` | **Route E: Release Notes** — see [`modes/release-notes.md`](modes/release-notes.md); CHANGELOG entry + convention-enforcing critic gates |
| Monorepo detected | scanner-agent identifies package boundaries; writer produces per-package docs |
| Critic PASS | Save and deliver |
| Critic FAIL | Re-dispatch cited agents with feedback (max 2 rounds) |

## 6 Standard Critical Gates

Default route + README + User Guide + API Reference + Config Guide + Tutorial + Audit + Sync routes share these gates. Routes D (Ship Log) + E (Release Notes) REPLACE these with their own — see the respective mode refs.

1. Every user-facing feature has a documentation section.
2. Setup steps are numbered with expected outcomes after each step.
3. A new user could follow Getting Started independently without reading source code.
4. Code examples compile/run — no pseudocode unless explicitly labeled.
5. Configuration options list defaults and valid values.
6. Troubleshooting covers errors visible in the codebase's error handling.

## Single-Agent Fallback

Used when mode-resolver downgrades to `fast` (small project <20 files, context-constrained, or `--fast`):

1. Skip multi-agent dispatch.
2. Scan project structure; identify key files using the 7-rank importance system (see [`playbook.md`](playbook.md)).
3. Read 5-10 highest-ranked files.
4. Determine audience (developer / end-user / operator).
5. Write documentation following [`doc-template.md`](doc-template.md).
6. Cross-check env vars, setup steps, API endpoints against code.
7. Run Critical Gates as self-review.
8. Save per [`report-template.md`](report-template.md).

The 6 standard critical gates fire in fallback mode regardless — safety contract is mode-independent. Route-specific gates (D + E) also fire when those routes are invoked under `--fast`.

## Pattern Catalogs

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/doc-template.md` | writer (default route) | Default writer-template. |
| `references/ship-log-template.md` | writer (Route D) | Ship-log writer-template. |
| `references/modes/{sync,ship-log,release-notes,audit}.md` | orchestrator, critic | Per-mode dispatch + critic-gate variants. |
| `references/report-template.md` | orchestrator (assembly) | Frontmatter + lifecycle by doc-type + filename + version-increment. |
| `references/anti-patterns.md` | critic | 7-pattern catalog + route-specific patterns + critic-FAIL handling. |
| `references/pre-dispatch-prompts.md` | orchestrator (Pre-Dispatch) | Warm + Cold prompts + route-locked Pre-Dispatch variants. |

Full mechanics: per-mode refs under [`modes/`](modes/).
