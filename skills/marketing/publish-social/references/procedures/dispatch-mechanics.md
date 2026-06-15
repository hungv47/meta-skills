# Dispatch Mechanics — publish-social

> How orchestrator routes work between formatter-agent and critic-agent. Mirrors D11/D14 production-skill pattern.

## Layer Sequence

The layer order depends on the resolved mode. **Export / draft** modes (D16 / D17) keep the critic-after-emission order; **publish** mode (D18) moves the critic before the action — a live post cannot be fixed afterward.

### Export / draft modes (D16 / D17)

```
Layer 1 (Pre-Dispatch):   read inputs + probe credentials + resolve mode
Layer 2 (Formatter):      formatter-agent emits bundle
Layer 2.5 (Confirm gate): D17 single-confirm gate — only if a browser-automation draft route resolved
Layer 2.6 (Automation):   automation-agent draft route — only if gate confirmed
Layer 3 (Critic):         critic-agent scores dims 1–7; PASS / FAIL  (FAIL → re-dispatch formatter, max 2)
Layer 4 (Delivery):       return bundle root + mode summary + next-step instruction
```

### Publish mode (D18) — see § Publish Layer

```
Layer 1 (Pre-Dispatch):   resolve --mode=publish + dry_run flag
Layer 2 (Formatter):      format every post + write export-mode bundle as the abort fallback
Layer 3 (Critic):         critic-agent scores dims 1–7 — CONTENT GATE before any live action
                           FAIL → re-dispatch formatter (max 2); persistent FAIL → BLOCKED
Layer 3.5 (Publish gate): two-stage confirmation gate (publish-confirmation-gate.md)
                           aborted → export-mode bundle, nothing posted
Layer 3.6 (Publish):      Typefully schedule-immediate for X + automation-agent publish for the 8
Layer 4 (Delivery):       orchestrator Self-Check applies dim 8 → finalize manifest → deliver
```

`--mode=publish --dry-run` stops after Layer 3 and prints the publish plan — Layers 3.5 / 3.6 never run.

Sequential, single-pass per layer. No parallel agents. Mirrors D11 produce-asset + D14 produce-video, with the D17 automation layer and D18 publish layer inserted.

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
4. Scores dims 1–7 with falsifiable evidence. (Dim 8 is orchestrator-applied post-publish — see § Publish Layer.)
5. Returns verdict (PASS / FAIL) + scores + fix instructions if FAIL.

Output: verdict + scores object (dims 1–7) + fix-instructions array (empty if PASS).

## Critic-Loop (FAIL handling)

Max 2 re-dispatch cycles. Each cycle:

1. Critic returns FAIL with per-dim scores + fix instructions per platform.
2. Orchestrator passes fix-instructions to formatter as `feedback` parameter.
3. Formatter re-formats failing platforms only (other platforms preserved).
4. Critic re-scores.

After 2 cycles still FAILing:
- Orchestrator surfaces FAIL to operator with all critic feedback.
- Operator can: (a) override critic (log via `scripts/log-critic-override.ts`), (b) edit write-social upstream + re-run, (c) accept partial bundle and proceed manually.

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

## Publish Layer (D18)

`--mode=publish` is the only mutating mode. The orchestrator owns the publish layer — the formatter only formats and returns (it never dispatches publish), because the critic content gate must run between formatting and any live action.

### Order

1. **Pre-Dispatch** resolves `--mode=publish` (+ `dry_run` flag). Auto-detect never reaches publish — `--mode=publish` is explicit opt-in.
2. **Formatter** formats every post, resolves per-platform publish routes (X → `typefully-publish`; 8 → `browser-automation-publish`; uncredentialed → export), writes the **export-mode bundle to disk as the abort fallback**, returns.
3. **Critic content gate** — critic-agent scores dims 1–7. FAIL → re-dispatch formatter (max 2 cycles); persistent FAIL → return `BLOCKED`, the gate never fires. The operator is never asked to confirm copy that did not pass the rubric.
4. **If `dry_run`** → print the publish plan (every post body, target account, per-platform route) and exit. Layers 3.5 / 3.6 do not run; manifest carries `dry_run: true`, `confirmation_result: dry_run`, all `publish_result_per_platform` = `not_attempted`.
5. **Two-stage confirmation gate** (`publish-confirmation-gate.md`) — Stage 1 review → Stage 2 typed `PUBLISH`. Abort at either stage (or timeout) → fall back to the export-mode bundle from step 2; nothing posts; `confirmation_result` = `aborted_stage1` / `aborted_stage2` / `timeout`.
6. **Publish** — Typefully schedule-immediate for X; automation-agent in `mode=publish` (Send) for the credentialed non-X platforms, sequential, 3s pacing. Per-platform failure → `fallback-draft` (Send-step failure, content composed) or `fallback-export` (earlier failure / captcha). Other platforms continue.
7. **Delivery** — orchestrator runs the dim-8 Self-Check (below), writes `publish_result_per_platform` + `post_url`s + the final 8-dim score into the manifest, and emits per-platform delete instructions for every `published` row.

### Orchestrator dim-8 Self-Check (post-publish, before delivery)

The critic-agent does not score dim 8 (its checks are post-publish). The orchestrator applies them mechanically and writes the dim-8 score into the manifest's 8-dim table:

- [ ] Transcript order: critic PASS verdict precedes the Stage-1 gate prompt precedes any publish/Send log line. Inversion → dim 8 auto-fail.
- [ ] Two-stage gate logged: Stage-1 `y/N` + Stage-2 typed token both present; `confirmation_result == "confirmed"` only when Stage 2 received the literal `PUBLISH`.
- [ ] Every `publish_result_per_platform[p].status == "published"` has `confirmation_result == "confirmed"`. Otherwise → dim 8 auto-fail.
- [ ] `dry_run: true` runs have zero `published` rows. Otherwise → dim 8 auto-fail.
- [ ] Reason-class enum compliance on every `failed:*`.
- [ ] Compute the final aggregate `/80`; full gate = aggregate ≥ 56/80 AND every dim ≥ 6.

A dim-8 auto-fail means posts went live un-gated or un-vetted — the posts are already public. Record `status: done_with_concerns`, keep every `post_url` + delete instructions in the manifest, and file a bug report. Do not re-dispatch (nothing to fix — it already happened).

## Parallel Considerations (v1: none)

v1 publish-social runs strictly sequential. v2+ candidates:

- **Per-platform parallel formatter:** each platform formatted independently → merge to bundle. Worth it for 9-platform runs; not for 2-3-platform runs. Defer until throughput surfaces as a constraint.
- **Critic dims parallel:** dim 1 (char-cap) + dim 5 (scheduler-format) + dim 6 (anti-pattern) are independent → could parallelize. Dim 2 (media) + dim 3 (CTA) + dim 4 (hashtags) depend on per-platform context. Modest gain; not v1.

## D8 Critic-Override Log (NOT wired in v1)

Production skills (publish-social, produce-asset, produce-video) do NOT wire `scripts/log-critic-override.ts` by default. The override-log is for eval-skill overrides (evaluate-landing-page, evaluate-ad).

**Exception:** if operator overrides publish-social critic FAIL repeatedly on the same dim → operator can manually invoke `scripts/log-critic-override.ts --skill publish-social --dimension <N> --reason <text>` to surface a rubric-revision signal.

## Cross-Skill Routing

After delivery, orchestrator may emit a soft next-skill prompt:

- If bundle delivered AND `evaluate-content` exists → "evaluate-content can score this bundle's downstream engagement vs the write-social brief's hypothesis; consider running after publishing."
- If bundle delivered AND `run-pipeline` exists with a current loop → "results.tsv slot available; consider appending after publishing + measurement window."

These are prompts, not auto-invocations. Operator decides.

## Error Surface

Common error patterns:

| Error | Cause | Resolution |
|---|---|---|
| `NEEDS_CONTEXT: write-social artifact missing` | Pre-dispatch hard-block | Run write-social first |
| `NEEDS_CONTEXT: brand/BRAND.md missing` | Pre-dispatch hard-block | Run create-brand first |
| `BLOCKED: --mode=publish critic FAIL after 2 cycles` | Critic content gate failed twice on a publish run | Operator edits write-social upstream + re-runs; the gate never fired, nothing posted |
| `BLOCKED: --mode=publish — no credentials for any platform` | Publish requested but neither Typefully key nor any session cookie present | Configure credentials (see `platform-credentials.md`) OR run `--mode=export` |
| publish aborted at the confirmation gate | Operator declined Stage 1 or Stage 2 (or timeout) | Export-mode bundle shipped; re-run `--mode=publish` when ready, or `--mode=draft` for drafts |
| `FAIL: critic dim 1 char-cap exceeded on X` | Formatter didn't thread-split | Re-dispatch (auto, max 2) or operator edits |
| `FAIL: critic dim 5 scheduler-format unparseable` | Bug in formatter; CSV malformed | Re-dispatch with fix instructions |
| `FAIL: critic dim 6 credential leak detected` | Formatter wrote a credential value into an emitted file | Critical bug; orchestrator halts immediately; no re-dispatch |
| `Typefully API error: 401` | TYPEFULLY_API_KEY invalid or expired | Surface error code (not key); roll back X to export-mode |
| `Typefully API error: 429` | Rate-limited | Wait, retry, OR roll back X to export-mode |

## Self-Check Before Delivery

Orchestrator verifies before Layer 4:

- [ ] Manifest exists with 16-field frontmatter
- [ ] Per-platform draft exists for every target platform
- [ ] All 4 scheduler-import files exist
- [ ] README exists with per-platform instructions
- [ ] Mode Summary in manifest matches actual mode run per platform
- [ ] Credentials Detected in manifest is binary only (no values)
- [ ] Verification Checklist in manifest covers every target platform
- [ ] Generation provenance per D8 contract written into manifest frontmatter
- [ ] No credential value greppable in any emitted file
- [ ] All emitted files UTF-8 without BOM
- [ ] (publish runs) dim-8 Self-Check applied — see § Publish Layer; `publish_result_per_platform` + `post_url`s written; per-platform delete instructions present for every `published` row

## Performance Ledger (export-time write)

At export (every mode — `export` / `draft` / `publish`), append one `status: exported` row **per target platform** to `.forsvn/performance/ledger.tsv` before the bundle ships. This anchors post↔artifact attribution so `evaluate-content`'s metric-ingest can later join measured metrics back to the producing write-social artifact. Append-only; credential-safety (Critical Gate 3) is unaffected. Procedure + column schema: [`performance-ledger.md`](performance-ledger.md).
