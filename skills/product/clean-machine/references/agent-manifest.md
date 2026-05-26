# Clean-Machine Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| dotfolder-scanner-agent | 1 (parallel) | `agents/dotfolder-scanner-agent.md` | `$HOME/.*` survey — identify owning tool, classify (active/abandoned/orphan/empty), flag auth state. |
| runtime-scanner-agent | 1 (parallel) | `agents/runtime-scanner-agent.md` | Language toolchains — `.rustup`, `.cargo`, `go/`, `google-cloud-sdk/` — and whether user actively writes that language. |
| cache-scanner-agent | 1 (parallel) | `agents/cache-scanner-agent.md` | XDG `.cache/`, `.npm/_cacache`, `.bun/install/cache`, `.cargo/registry` — pure regenerable reclaim. |
| package-inventory-agent | 1 (parallel) | `agents/package-inventory-agent.md` | Globals across npm/brew/bun/cargo/go/pipx — flag duplicates (e.g., `codex` installed via 3 channels) and unused. |
| orphan-detection-agent | 2 (sequential) | `agents/orphan-detection-agent.md` | Cross-references Layer 1 outputs — sibling folders left behind (`.cache/codex-runtimes` after `.codex` removed), broken symlinks, dangling shell-rc references. |
| safe-nuke-agent | 3 (interactive) | `agents/safe-nuke-agent.md` | Executes deletions — process-check first, fixes shell-rc side effects, verifies post-state. |
| critic-agent | 3 (final) | `agents/critic-agent.md` | Golden rules compliance, no user-data deletion, no auth surprise. |

## Execution Layers

```text
Layer 1 (parallel — survey only, no changes):
  dotfolder-scanner-agent ────┐
  runtime-scanner-agent ──────┤── scan simultaneously
  cache-scanner-agent ────────┤
  package-inventory-agent ────┘

Layer 2 (sequential — analysis):
  orphan-detection-agent ─────── correlates Layer 1 outputs

Layer 3 (interactive — execution):
  safe-nuke-agent ──────────── per-target: surface findings → confirm with user → execute
    → critic-agent ───────────── final golden rules review
```

## Dispatch Protocol

1. **Triage** — determine scope from user intent (see Routing Rules below).
2. **Layer 1 dispatch** — send brief to relevant scanner agents in parallel. Each returns markdown report with classified targets per [`classification-vocabulary.md`](classification-vocabulary.md). Tool ownership uses [`tool-ownership-map.md`](tool-ownership-map.md) (canonical) + [`tool-ownership-heuristics.md`](tool-ownership-heuristics.md) (cascade).
3. **Layer 2 orphan correlation** — cross-references Layer 1 outputs; emits unified "candidates for removal" list with confidence levels.
4. **Layer 3 interactive execution** — `safe-nuke-agent` walks the candidate list **one target at a time**:
   - Surface what it is, why it's a candidate, what user loses if removed (auth re-login, settings, data).
   - Surface risks (running processes, shell-rc references, irreversible data) per the 6 Critical Gates.
   - Recommend with reasoning.
   - **Wait for explicit user confirmation** for that target.
   - Execute with side-effect fixes.
   - Track reclaim.
5. **Critic review** — checks golden rules. FAIL → restore from backup and report per [`anti-patterns.md`](anti-patterns.md) "When the critic FAILs."
6. **Assembly** — compile report per [`report-template.md`](report-template.md). Save to `.forsvn/artifacts/meta/records/machine-cleanup-[date]-<slug>.md`.

## Routing Rules

| Condition | Route |
|---|---|
| User says "clean my home dir" | dotfolder-scanner → orphan-detection → safe-nuke → critic |
| User says "free up disk space" | cache-scanner + dotfolder-scanner → orphan-detection → safe-nuke → critic |
| User says "audit my globals" / "package cleanup" | package-inventory only → safe-nuke → critic |
| User says "remove unused languages" | runtime-scanner → safe-nuke → critic |
| User says "fresh start" / "clean everything" | All four scanners → orphan-detection → safe-nuke → critic |
| User points at a specific folder | Skip Layer 1 broad scan; safe-nuke runs against that folder's classification |
| Critic FAIL | Restore last backup, surface what was wrong, ask user how to proceed |
| Session reclaim >10GB | Generate interim summary, ask if user wants to continue |

## Pattern Catalogs (consumed by named agents)

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/classification-vocabulary.md` | all scanners | 7-class taxonomy + decision tree. |
| `references/tool-ownership-map.md` | dotfolder + runtime + cache scanners | Canonical folder pattern → owning tool → install method → known data dirs. |
| `references/tool-ownership-heuristics.md` | scanners | Cross-reference signals + tool-verification cascade for unknown tools. |
| `references/auth-credential-patterns.md` | safe-nuke, critic | Filename patterns the critic fails fast on. |
| `references/anti-patterns.md` | critic | "When NOT to nuke" + critic-FAIL handling + bulk-action triggers. |
| `scripts/inventory.sh` | all Layer 1 scanners | One-shot inventory output — sizes + mtimes + globals + running processes + broken symlinks + shell-rc misreferences. Shared to avoid redundant `du`/`ls`. |

Single-Agent Fallback mechanics: same 6 Critical Gates fire; classification + ownership identification + auth/process/side-effect surface + confirmation + nuke + verify + save artifact.

Full mechanics + critic-FAIL handling + bulk-action pause triggers: [`anti-patterns.md`](anti-patterns.md).
