# Procedure — Artifact Contract (write-social)

> Load when emitting the final copy artifact OR when a downstream consumer (polish chain, eval-loop, operator publish) needs the schema. The 13-field frontmatter + 6-section body + 5-dim critic verdict table are **load-bearing cross-stack contract**: schema changes require atomic update of polish-chain + eval-loop + operator-workflow consumers.

---

## Path + lifecycle

- **Path:** `docs/forsvn/artifacts/marketing/copy/[platform]-[YYYY-MM-DD]-[slug].md`
- **Lifecycle:** `pipeline` — regenerated on re-run for the same (platform, topic) tuple. Variant exploration uses suffixed slugs (e.g., `-variant-b`).

## Frontmatter (15 fields, verbatim, in order)

`type` · `platform` · `date` · `slug` · `brand_mode` · `goal` · `variant_count` · `brief_source` · `platform_intel_version` · `pack_verified` · `applied_tactics` · `critic_score` · `critic_verdict` · `status` · `polish_chain_applied`.

Per-field semantics + enum values: [`../format-conventions.md`](../format-conventions.md).

## Required body sections (in order)

1. **Hook variants** — one `### Variant [A|B|C]` block per variant. `variant_count` frontmatter field must match the number of blocks.
2. **Body** — main post copy. Single block; no sub-headings for X / TikTok / Reels / Shorts. LinkedIn allows internal line breaks but no markdown headings.
3. **CTA** — single line. Type (interest-question / direct-ask / save-prompt / share-prompt / link) determined by `goal`.
4. **Format spec** — surface-specific render notes (vertical-video caption length, X thread split, LinkedIn first-3-lines visible-window).
5. **Legibility block** — which platform pack was loaded, its `last_verified` date, and the **specific** tactics applied; or the transparent-degrade statement when no pack covers the platform (`pack_verified: none`, empty `applied_tactics`, no tailored claim). Format + the three states: [`../_shared/legibility-convention.md`](../_shared/legibility-convention.md).
6. **Critic verdict** — 6-row table: 5 dim rows + total. Each dim row: dimension name, score (0-10), one-line justification.
7. **Anti-patterns triggered** — explicit `- None` if empty. Each entry references the pattern ID from [`../anti-patterns.md`](../anti-patterns.md).

## Side effects (mandatory on PASS / DONE_WITH_CONCERNS / FAIL)

**NOT performed on FORMAT_FAIL or NEEDS_CONTEXT.**

1. Write artifact at path above.
2. Experience write-back per `./pre-dispatch.md` Write-back map:
   - Q1 (platform) — routing-only, NOT persisted.
   - Q2 (topic-or-brief) → `experience/content.md` as a content event.
   - Q3 (brand_mode) → `experience/brand.md` IF novel for the project.
   - Q4 (audience) → `experience/audience.md` IF `research/icp-research.md` absent AND audience supplied via Cold Start.
   - Q5 (goal) → `experience/goals.md`.
   - Skip-if-exists semantics: never overwrite an existing experience entry without an explicit `--update-experience` flag.
3. Run `bun scripts/manifest-sync.ts` to register the new artifact in `.forsvn/index/manifest.json`.

## Consumed by

- **`humanmaxxing` + `polish-vn`** (polish chain) — read `## Body` + `## CTA`, rewrite in place, **preserve Hook variants for A/B comparability**, update `polish_chain_applied` frontmatter.
- **`run-pipeline`** — reads `critic_score` + `critic_verdict` + `goal` + `platform` from frontmatter, appends a row to `results.tsv`.
- **Operator publish workflow** — reads selected variant + format spec to render the actual post.

## Cross-stack contract (load-bearing)

The 13-field frontmatter + 6-section body + 5-dim critic verdict table + Anti-patterns triggered listing convention together form a stable interface. Drift = silent consumer breakage. Any schema change MUST:

1. Update `../format-conventions.md` § "Frontmatter field order".
2. Update polish-chain (`humanmaxxing`, `polish-vn`) artifact-reader code.
3. Update `run-pipeline` row-extractor.
4. Update operator-workflow renderer.

All four atomic in a single PR.
