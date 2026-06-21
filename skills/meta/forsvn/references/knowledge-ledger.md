# Knowledge Ledger — `.forsvn/memory/knowledge.json` (A7)

The knowledge ledger is a cache of **project facts each with provenance**, loaded at `/forsvn`
dispatch so the front door never re-asks what is already on disk and never re-runs a fresh producer
for a fact it already knows. It generalizes the one-step `.forsvn/routing/last-session.md`
warm-handoff to whole-project knowledge. Built and read by `bin/knowledge.ts` (logic in
`bin/lib/knowledge.ts`).

**The ledger is a cache, never a source of truth.** Disk wins on every conflict — `refresh`
re-derives from the on-disk artifacts and overwrites the ledger. A stale high-stakes fact (>30 days)
is re-derived, not trusted. Reuse is **always narrated**, never silent.

## Provenance-or-nothing (the hard rule)

Every fact MUST carry `source` + `confidence` + `date`. A fact is derived **only** from an on-disk
source (the producer's artifact). **A fact with no on-disk source is not written** — there is no
empty, guessed, or fabricated fact in the ledger. `bin/knowledge.ts --check` fails any fact missing
its provenance.

## Schema

```jsonc
// .forsvn/memory/knowledge.json  (net-new; machine-state cache, regenerable, never hand-edited)
{
  "version": 1,
  "generated": "YYYY-MM-DD HH:MM:SS",
  "facts": {
    "icp_present":              { "value": true,  "source": "research-icp",   "confidence": "H", "date": "2026-06-10" },
    "brand_ratified":           { "value": true,  "source": "create-brand",   "confidence": "M", "date": "2026-05-28" },
    "product_context_ratified": { "value": false, "source": "research-icp",   "confidence": "L", "date": "2026-05-26" },
    "last_campaign":            { "value": "x-2026-06-15-run-ph-launch", "source": "run-launch", "confidence": "H", "date": "2026-06-15" },
    "known_competitors":        { "value": ["a", "b"], "source": "research-market",   "confidence": "M", "date": "2026-05-20" }
  }
}
```

- `value` — `boolean | string | string[]`. A present fact is a truthy boolean or a non-empty payload.
- `source` — the producing capability / scaffolder that put the fact on disk (the provenance).
- `confidence` — `H | M | L`.
- `date` — `YYYY-MM-DD`, the on-disk source's own `date:` frontmatter (or, when absent, its mtime).

### Facts and their on-disk sources

| Fact key | On-disk source | Producer (`source`) | High-stakes |
|---|---|---|---|
| `icp_present` | `docs/forsvn/canonical/research/ICP.md` | `research-icp` | yes |
| `product_context_ratified` | `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` (ratified `decision_state`) | `research-icp` | yes |
| `brand_ratified` | `docs/forsvn/canonical/marketing/BRAND.md` (ratified `decision_state`) | `create-brand` | yes |
| `known_competitors` | `docs/forsvn/canonical/research/MARKET.md` | `research-market` | yes |
| `last_campaign` | most recent `docs/forsvn/artifacts/marketing/launch/*.md` (by mtime) | `run-launch` | no |

Producers are the **real** capability ids that write each artifact (the
[capability index](../../../../references/capability-index.json) `outputs.artifacts`): `research-icp`
produces **both** `ICP.md` and `PRODUCT-CONTEXT.md`. Never invent a provenance string.

Ratification reads the artifact's real `decision_state`, whose legal enum is the
[reviewable-artifact contract](../../../../references/reviewable-artifact-contract.md)'s:
`pending | approved | denied | suggested | not_required` (there is **no** `accepted`). A fact is
ratified iff `decision_state` is a settled human state — `approved` (a human reviewed and accepted
it) or `not_required` (no human gate applies, e.g. the live `BRAND.md` is a `not_required` pointer
to the `_ops` brand vault). `pending` / `denied` / `suggested` → **unratified** (e.g. the live
`PRODUCT-CONTEXT.md` is `decision_state: pending`, awaiting re-ratification → `false`). An
absent/unrecognized `decision_state` normalizes to `not_required` per the contract → ratified.
Ratification reads `decision_state`, **not** just `status:` — a `status: done` + `decision_state:
pending` artifact is an unratified draft, not a ratified fact (same rule as the Step 4.5 pre-flight).

## CLI

```ts
// bin/knowledge.ts  (logic: bin/lib/knowledge.ts)
knowledge refresh         // rescan disk → write knowledge.json (provenance per fact, atomic write)
knowledge get <key>       // print one fact {value,source,confidence,date}, or "absent" (stale high-stakes → absent)
knowledge show            // human-readable fact table
knowledge --check         // schema + provenance validation (CI exit code)
// Rule: disk beats ledger on conflict; a stale high-stakes fact (>30d) → re-derive; reuse narrated.
```

## Load at dispatch

The front door reads the ledger in Step 4 (load context) and uses it to **skip re-asking** a fact
already on disk and to **skip re-inserting a producer** (A5) whose fact is present with adequate
confidence — narrating the reuse:

```
Reusing icp_present (from research-icp, 2026-06-10, confidence H) — not re-running.
```

`getFact` returns `undefined` for a stale high-stakes fact (>30d) so dispatch re-derives it instead
of trusting the cache. `reuseDecision(ledger, key)` returns `{ skip, narration }` — it skips only
when the fact is present, fresh, and meets the minimum confidence (default `M`); otherwise the
producer runs.

## Machine-state

`.forsvn/memory/` is **machine-state** — regenerable and gitignored (the repo `.gitignore` lists
`.forsvn/memory/` explicitly, alongside the other enumerated `.forsvn/` run-state paths; `.forsvn/`
is otherwise tracked, so the entry is required for the ledger to stay out of git). It is exempt from
the artifact contract (`check-artifact-home` / `validate-artifacts` never walk it). Never hand-edit
`knowledge.json`; `bin/knowledge.ts refresh` is the only writer.
