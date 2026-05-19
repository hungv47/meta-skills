# Dispatch Mechanics — publish-social

> How orchestrator routes work between formatter-agent and critic-agent. Mirrors D11/D14 production-skill pattern.

## Layer Sequence

```
Layer 1 (Pre-Dispatch):  orchestrator reads inputs + probes credentials + resolves mode
                          │
                          ▼
Layer 2 (Formatter):     formatter-agent emits bundle (manifest + per-platform drafts + 4 scheduler-imports + README)
                          │
                          ▼
Layer 3 (Critic):        critic-agent scores 6 dims; PASS / FAIL verdict
                          │
                       PASS │ FAIL
                          │   └─→ re-dispatch formatter with specific feedback (max 2 cycles)
                          ▼
Layer 4 (Delivery):      return bundle root + mode summary + next-step instruction
```

Sequential, single-pass per layer. No parallel agents. Mirrors D11 produce-asset + D14 produce-video.

## Layer 1: Pre-Dispatch

See [`pre-dispatch.md`](pre-dispatch.md). Outcomes:

- PROCEED → continue to Layer 2
- NEEDS_CONTEXT → return without writing bundle
- BLOCKED → return without writing bundle

## Layer 2: Formatter Dispatch

Single formatter-agent invocation with the full input contract:

```
formatter_input = {
  write_social_artifact: <path or loaded>,
  brand_voice: <loaded from brand/BRAND.md>,
  produce_asset_manifest: <object or null>,
  produce_video_manifest: <object or null>,
  target_platforms: <array of platform slugs>,
  mode_override: <null | "export" | "draft" | "publish">,
  credentials_state: <binary detection object>,
  feedback: null
}
```

Formatter:
1. Runs mode resolution.
2. For each target platform, formats body per `references/platforms/[platform].md`.
3. Emits all 4 scheduler-import files.
4. Calls Typefully Draft API (Route B only).
5. Writes manifest + README.

Output: bundle root path + emitted file count.

## Layer 3: Critic Dispatch

Single critic-agent invocation with:

```
critic_input = {
  write_social_artifact: <same>,
  brand_voice: <same>,
  produce_asset_manifest: <same>,
  produce_video_manifest: <same>,
  bundle: { manifest, per_platform[], scheduler_imports[], readme },
  mode_per_platform: <resolved by formatter>,
  feedback: null
}
```

Critic:
1. Parses all 4 scheduler-import files (dim 5 auto-fail check first).
2. Greps every emitted file for credential patterns (dim 6 auto-fail check).
3. Counts chars per platform vs hard caps (dim 1 auto-fail check).
4. Scores each of 6 dims with falsifiable evidence.
5. Returns verdict (PASS / FAIL) + scores + fix instructions if FAIL.

Output: verdict + scores object + fix-instructions array (empty if PASS).

## Critic-Loop (FAIL handling)

Max 2 re-dispatch cycles. Each cycle:

1. Critic returns FAIL with per-dim scores + fix instructions per platform.
2. Orchestrator passes fix-instructions to formatter as `feedback` parameter.
3. Formatter re-formats failing platforms only (other platforms preserved).
4. Critic re-scores.

After 2 cycles still FAILing:
- Orchestrator surfaces FAIL to operator with all critic feedback.
- Operator can: (a) override critic (log via `scripts/eval/log-critic-override.ts`), (b) edit write-social upstream + re-run, (c) accept partial bundle and proceed manually.

## Layer 4: Delivery

On PASS:

1. Update manifest status: `done` (or `done_with_concerns` if critic returned score 6-7 on any dim).
2. Return bundle root path.
3. Return Mode Summary (X = Typefully URL / X = export / LinkedIn = export / ...).
4. Return next-step instruction matched to detected route.

On FAIL after 2 cycles:

1. Update manifest status: `blocked` OR `done_with_concerns` (if operator overrides).
2. Return critic feedback + bundle path (partial bundle is still on disk).
3. Surface log-critic-override option to operator.

## Parallel Considerations (v1: none)

v1 publish-social runs strictly sequential. v2+ candidates:

- **Per-platform parallel formatter:** each platform formatted independently → merge to bundle. Worth it for 9-platform runs; not for 2-3-platform runs. Defer until throughput surfaces as a constraint.
- **Critic dims parallel:** dim 1 (char-cap) + dim 5 (scheduler-format) + dim 6 (anti-pattern) are independent → could parallelize. Dim 2 (media) + dim 3 (CTA) + dim 4 (hashtags) depend on per-platform context. Modest gain; not v1.

## D8 Critic-Override Log (NOT wired in v1)

Production skills (publish-social, produce-asset, produce-video) do NOT wire `scripts/eval/log-critic-override.ts` by default. The override-log is for eval-skill overrides (evaluate-landing-page, evaluate-ad).

**Exception:** if operator overrides publish-social critic FAIL repeatedly on the same dim → operator can manually invoke `scripts/eval/log-critic-override.ts --skill publish-social --dimension <N> --reason <text>` to surface a rubric-revision signal.

## Cross-Skill Routing

After delivery, orchestrator may emit a soft next-skill prompt:

- If bundle delivered AND `evaluate-content` exists → "evaluate-content can score this bundle's downstream engagement vs the write-social brief's hypothesis; consider running after publishing."
- If bundle delivered AND `run-eval-loop` exists with a current loop → "results.tsv slot available; consider appending after publishing + measurement window."

These are prompts, not auto-invocations. Operator decides.

## Error Surface

Common error patterns:

| Error | Cause | Resolution |
|---|---|---|
| `NEEDS_CONTEXT: write-social artifact missing` | Pre-dispatch hard-block | Run write-social first |
| `NEEDS_CONTEXT: brand/BRAND.md missing` | Pre-dispatch hard-block | Run create-brand first |
| `BLOCKED: --mode=publish deferred to D18` | Pre-dispatch mode check | Wait for D18 OR omit `--mode=publish` |
| `BLOCKED: --mode=draft for [linkedin] deferred to D17` | Pre-dispatch mode check | Wait for D17 OR use export mode |
| `FAIL: critic dim 1 char-cap exceeded on X` | Formatter didn't thread-split | Re-dispatch (auto, max 2) or operator edits |
| `FAIL: critic dim 5 scheduler-format unparseable` | Bug in formatter; CSV malformed | Re-dispatch with fix instructions |
| `FAIL: critic dim 6 credential leak detected` | Formatter wrote a credential value into an emitted file | Critical bug; orchestrator halts immediately; no re-dispatch |
| `Typefully API error: 401` | TYPEFULLY_API_KEY invalid or expired | Surface error code (not key); roll back X to export-mode |
| `Typefully API error: 429` | Rate-limited | Wait, retry, OR roll back X to export-mode |

## Self-Check Before Delivery

Orchestrator verifies before Layer 4:

- [ ] Manifest exists with 12-field frontmatter
- [ ] Per-platform draft exists for every target platform
- [ ] All 4 scheduler-import files exist
- [ ] README exists with per-platform instructions
- [ ] Mode Summary in manifest matches actual mode run per platform
- [ ] Credentials Detected in manifest is binary only (no values)
- [ ] Verification Checklist in manifest covers every target platform
- [ ] Generation provenance per D8 contract written into manifest frontmatter
- [ ] No credential value greppable in any emitted file
- [ ] All emitted files UTF-8 without BOM
