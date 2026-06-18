---
name: clean-artifacts
description: "Audit + groom `docs/forsvn/artifacts/` — classify every file (KEEP/STALE/ORPHAN/LEGACY/EPHEMERAL), surface references + risk. On `--apply` archives candidates behind per-category confirmation (moves to dated archive, never deletes). Not for cleaning code (use clean-code) or machine state (use clean-machine)."
argument-hint: "[scope path | --dry-run | --apply | --threshold-days N]"
allowed-tools: Read Grep Glob Bash Edit
user-invocable: true
disable-model-invocation: true
metadata:
  version: "1.1.0"
  budget: standard
  estimated-cost: "$0.05-0.20"
---

# Cleanup Artifacts — Orchestrator

Single-agent — orchestrator IS the runner; critic in-procedure. Audit + groom `docs/forsvn/artifacts/`: classify every file, surface refs + risk, archive non-KEEP on `--apply`. **Never deletes.** Metadata: [`routing.yaml`](routing.yaml). Methodology / when-not-to-use: [`references/playbook.md`](references/playbook.md).

**Core question:** load-bearing, or cruft from weeks ago?

## Critical Gates — load first

1. **MOVE, never delete.** `mv` into `docs/forsvn/artifacts/.archive/[YYYY-MM-DD]/`. `--purge-archive` (v1 out of scope) is the only deletion path.
2. **HARD-NEVER refused.** Canonical (`brand/`, `research/`, `architecture/`); VCS (`.git/`, `.gitmodules`, submodules); infra (`.forsvn/index/manifest.json`); append-only (`docs/forsvn/experience/`); anchors (`docs/forsvn/artifacts/meta/{roadmap,tasks}.md`).
3. **`--dry-run` default.** No move without `--apply` + per-category confirm.
4. **Critic gate non-negotiable.** Grep 5 random STALE/ORPHAN refs across `docs/forsvn/artifacts/`, `brand/`, `research/`, `architecture/`. Live ref → escalate (no prompt), refs surfaced.
5. **Manifest-sync.** Re-run `bun scripts/manifest-sync.ts` after any move.

## Before Starting + Pre-Dispatch

Apply `references/_shared/{before-starting-check, pre-dispatch-protocol, mode-resolver}.md`. `budget: standard`; `--fast` bypasses prompts — **Critical Gates supersede `--fast`**. Read `.forsvn/index/{manifest.json,artifact-index.md}` + `docs/forsvn/experience/technical.md` (prior excludes). Manifest missing/stale (>1d) → `NEEDS_CONTEXT`. Dimensions: scope, mode, threshold (90d), excludes.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

### Warm Start ([`procedure`](references/procedures/warm-start.md))

`` ! `<cmd>` `` interpolation fires ONLY from SKILL.md slash invocation (not refs) — that is why this prompt stays in body.

```
Found:
- scope → "[full docs/forsvn/artifacts/ | <subpath>]"
- disk → ! `find docs/forsvn/artifacts -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' '` files;
  ! `find docs/forsvn/artifacts -name "*.md" -type f -mtime +90 2>/dev/null | wc -l | tr -d ' '` older than 90d
- manifest last touched → ! `git log -1 --format='%cr' .forsvn/index/manifest.json 2>/dev/null | grep . || echo 'untracked or no git history'`
- excluded paths → "[list or none]"

Default --dry-run, threshold 90d. Override (e.g., --apply, --threshold-days 30) or proceed?
```

### Cold Start (no scope hint)

[`procedure`](references/procedures/cold-start.md) — 4-question prompt, persist excludes to `docs/forsvn/experience/technical.md`.

## Decision Tree

Canonical: [`references/procedures/runner.md`](references/procedures/runner.md). Phases: sanity-check → walk (skip `.git/`, `node_modules/`, `.archive/`, excludes, symlinks) → classify per [`cleanup-rules.md`](references/cleanup-rules.md) order **HARD-NEVER → LEGACY → EPHEMERAL → KEEP → STALE → ORPHAN** → critic gate → candidate table w/ risk tier (TIER-1 gitignored / TIER-2 tracked-clean / TIER-3 tracked-dirty / HARD-NEVER; **TIER-3 NEVER moved**) → dry-run report OR apply per-category prompts → `mv` to archive → manifest-sync → write report (order matters). Critic-FAIL walkthrough: [`references/examples/escalation-walkthrough.md`](references/examples/escalation-walkthrough.md). Report: [`references/report-template.md`](references/report-template.md).

## Classification Vocabulary

Full taxonomy: [`references/cleanup-rules.md`](references/cleanup-rules.md).

| Class | Meaning | Default |
|---|---|---|
| **KEEP** | manifest fresh, recently consumed, OR canonical/anchor | Leave |
| **STALE** | manifest entry > threshold AND no recent consumer | ARCHIVE; confirm |
| **ORPHAN** | no manifest entry; producing skill removed; hand-created + abandoned | ARCHIVE; confirm |
| **LEGACY** | frontmatter `status: superseded`/`archived` OR `lifecycle: ephemeral` | ARCHIVE (strong) |
| **EPHEMERAL** | matches known ephemeral pattern | ARCHIVE (strong) |

**HARD-NEVER overrides:** emit `KEEP (hard-never)` regardless of mtime/manifest state.

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/meta/records/[YYYY-MM-DD]-cleanup-artifacts-<slug>.md` (dated, immutable). **Lifecycle:** `snapshot`. **Consumer:** operator audit trail.
- **Frontmatter:** `skill` · `produced_by` · `version` · `date` · `status` · `mode` · `scope` · `threshold_days` · `total_candidates` · `total_archived` · `critic_gate` · `provenance`.
- **Template:** [`references/report-template.md`](references/report-template.md).
- **Side effect:** `docs/forsvn/artifacts/.archive/[YYYY-MM-DD]/...` on `--apply`; manifest re-sync after any move.

## Configuration + Anti-Patterns

Params + v1-out-of-scope flags: [`references/configuration.md`](references/configuration.md). Anti-patterns: [`references/anti-patterns.md`](references/anti-patterns.md) — re-read before EPHEMERAL on a dated record, `find -L`, or per-file prompts.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — critic passed, confirmations resolved, files moved (or dry-run written), manifest-sync clean, zero TIER-3 surprises, zero declined categories.
- **DONE_WITH_CONCERNS** — applied but flagged: TIER-3 surfaced (skipped), category declined, or tracked files moved. Report enumerates.
- **BLOCKED** — critic found live refs on `--apply`; HARD-NEVER violation; or scope missing.
- **NEEDS_CONTEXT** — manifest missing/corrupt. Recommend `bun scripts/manifest-sync.ts`.

## Next Step

Operator reviews dry-run report; if comfortable, re-invoke `--apply` and walk per-category prompts. Commit archive + manifest-sync diff.
