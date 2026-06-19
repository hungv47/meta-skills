# Procedure — Artifact Contract (write-launch)

> Load when emitting the final launch bundle OR when a downstream consumer (polish chain, publish-social, measure-results, eval-loop) needs the schema. The 16-field frontmatter + 5-section body + 5-dim critic verdict table are **load-bearing cross-stack contract**: schema changes require atomic update of every consumer.

---

## Path + lifecycle

- **Path:** `docs/forsvn/artifacts/marketing/launch/[channel]-[YYYY-MM-DD]-[slug].md`
- **Lifecycle:** `pipeline` — regenerated on re-run for the same (channel, topic) tuple. Variant exploration uses suffixed slugs.

## Frontmatter (16 fields, verbatim, in order)

`type` · `channel` · `date` · `slug` · `brand_mode` · `goal` · `variant_count` · `brief_source` · `platform_intel_version` · `pack_verified` · `applied_tactics` · `guard_status` · `critic_score` · `critic_verdict` · `status` · `polish_chain_applied`.

Per-field semantics + enum values: [`../format-conventions.md`](../format-conventions.md).

## Required body sections (in order)

1. **Launch bundle** — the channel-instantiated components: Primary identifier (one `### Primary identifier` block per variant; count = `variant_count`) · Descriptor · Anchor narrative · Amplification · Channel metadata + compliance.
2. **Legibility block** — which pack was loaded, its `last_verified` date, and the **specific** tactics applied; or the transparent-degrade statement when no pack covers the channel. Format + the three states: [`../_shared/legibility-convention.md`](../_shared/legibility-convention.md).
3. **Why this works** — the product-fit rationale block (the falsifiable bet + 2-4 load-bearing choices traced to ICP/VoC/positioning), distinct from the channel-fit Legibility block: [`../_shared/why-this-works-convention.md`](../_shared/why-this-works-convention.md).
4. **Critic verdict** — 6-row table: 5 dim rows + total.
5. **Anti-patterns triggered** — explicit `- None` if empty. Each entry references the pattern by name from [`../anti-patterns.md`](../anti-patterns.md).

## Side effects (mandatory on PASS / DONE_WITH_CONCERNS / FAIL)

**NOT performed on GUARD_FAIL or NEEDS_CONTEXT.**

1. Write artifact at the path above.
2. Experience write-back per `./pre-dispatch.md` Write-back map:
   - Q1 (channel) — routing-only, NOT persisted.
   - Q2 (topic-or-brief) → `experience/content.md`.
   - Q3 (brand_mode) → `experience/brand.md` IF novel.
   - Q4 (audience) → `experience/audience.md` IF `research/icp-research.md` absent AND supplied via Cold Start.
   - Q5 (goal) → `experience/goals.md`.
   - Skip-if-exists: never overwrite an existing experience entry without `--update-experience`.
3. Run `bun scripts/manifest-sync.ts` to register the artifact in `.forsvn/index/manifest.json`.

## Consumed by

- **`humanmaxxing` + `polish-vn`** (polish chain) — read `### Descriptor` + `### Anchor narrative` + `### Amplification`, rewrite in place, **preserve the primary-identifier variants**, update `polish_chain_applied`.
- **`publish-social`** — reads the amplification copy + on-channel components to render the distribution drafts (it does not itself emit launch-channel native copy).
- **`measure-results`** — reads `channel` + `applied_tactics` + `critic_verdict` to score the real result against the same pack and write a dated entry back (closes the loop).
- **`run-pipeline`** — reads `critic_score` + `critic_verdict` + `goal` + `channel`, appends a row to `results.tsv`.

## Cross-stack contract (load-bearing)

The 16-field frontmatter + 5-section body + 5-dim critic verdict table + Anti-patterns-triggered listing convention together form a stable interface. Drift = silent consumer breakage. Any schema change MUST, atomically in one PR:

1. Update `../format-conventions.md` § "Frontmatter schema" + § "Required body sections".
2. Update polish-chain (`humanmaxxing`, `polish-vn`) readers.
3. Update `publish-social` + `measure-results` readers.
4. Update `run-pipeline` row-extractor.
