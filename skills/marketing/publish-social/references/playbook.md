# Playbook — publish-social

> Methodology, when to use, when NOT to use, integration-aware mode narrative.

**Worked example:** [`examples/publish-bundle-walkthrough.md`](examples/publish-bundle-walkthrough.md) — write-social copy → per-platform bundle + scheduler-import files + the `exported` ledger row.

## Why this skill exists

write-social produces platform-formatted copy; nothing carries the copy + media into the operator's scheduling workflow. Operators copy-paste into Buffer / Hootsuite / Typefully / IG / X by hand — error-prone (char caps, hashtag rules, missing CTA) + tedious (9 platforms × manual paste = 30 min of busywork per campaign).

publish-social automates the formatting + scheduler-handoff. Bundles everything: per-platform Markdown drafts (for native paste), four scheduler-import files (for tool import), README with step-by-step. If credentials present for Typefully, X goes draft route directly via the Typefully API — no paste at all.

## Integration-aware mode narrative

The skill picks the highest non-publish mode available at invocation without operator-mode-selection friction:

| Operator state | What runs | What the operator does next |
|---|---|---|
| No credentials configured | All 9 platforms in export-mode | Imports the matching scheduler-import file (Buffer CSV / Hootsuite CSV / Typefully JSON / generic CSV) into their scheduler tool; sets schedule inside the scheduler |
| `TYPEFULLY_API_KEY` set | X goes Typefully Draft API (drafts created in Typefully account); other 8 platforms in export-mode | Reviews X drafts at Typefully URLs in `typefully.json`; imports scheduler-import file for the other 8 |
| `--mode=export` forced | All 9 platforms in export-mode regardless of credentials | Same as no-credentials path |
| `--mode=draft` | Per-platform draft: X → Typefully API; the 8 non-X → browser-automation draft if session cookies present (D17); else export | Reviews drafts in each platform's UI; hits Send manually; export-mode platforms imported via scheduler file |
| `--mode=publish` (D18) | Live posting for all 9, behind the two-stage confirmation gate | Reviews every full post body at the gate → types `PUBLISH` → posts go live; manifest records each `post_url` |
| `--mode=publish --dry-run` (D18) | Prints the publish plan; posts nothing | Reviews the plan; re-runs without `--dry-run` when ready |

**Why auto-detect never picks publish:** brief 04 § publish-social Hard Rule states "never publish live without explicit current-session confirmation." Auto-detect cannot satisfy "current-session confirmation" — that requires an interactive prompt the operator answers in the same session. D18 built that gate (the two-stage confirmation gate); auto-detect still never resolves to publish — `--mode=publish` is explicit opt-in only.

## When to use

- After `write-social` produces platform-formatted copy and operator wants drafts/scheduler-ready files
- After `produce-asset` / `produce-video` produces media manifests and operator wants them attached to drafts
- For campaign rollouts across 2+ platforms where manual paste would lose 30+ min
- When the operator has a Typefully account and wants X drafts auto-created

## When NOT to use

- Single-platform single-post (just paste it manually — overhead of skill > value)
- When write-social hasn't run yet (defer to write-social first)
- When the operator wants to publish live but hasn't reviewed the copy — run `--mode=publish --dry-run` first, or `--mode=draft` to stage drafts for review
- When media is in a non-standard format the produce-* skills don't emit (skill expects produce-asset / produce-video manifest schemas; hand-curated media works but cross-check is weakened)

## Methodology

### Step 1: Pre-dispatch context resolution

formatter-agent reads:
- write-social artifact → body copy per platform, hook archetype, CTA, hashtag set, media references
- brand/BRAND.md → voice rules, sacred elements (sanity check, not source of body copy)
- produce-asset manifest (optional) → image / carousel media slot paths + aspect / size
- produce-video manifest (optional) → video shot paths + duration / aspect
- Credentials state (binary detection)

Validation: all required inputs present, target_platforms derivable, mode resolution clean.

### Step 2: Mode resolution

Run the table in `agents/formatter-agent.md` § Mode Resolution. Returns one mode per target platform. If any BLOCKED, return BLOCKED without writing files.

### Step 3: Per-platform formatting

For each target platform:
1. Read `references/platforms/[platform].md` for char cap / hashtag rules / media spec / CTA position / line-break conventions.
2. Convert write-social body to platform-native format (e.g., split X body into thread; convert IG hashtag set to caption-bottom or first-comment stack; map LinkedIn paragraphs to literal-newline format).
3. Cross-check media references against produce-asset / produce-video manifests if provided.
4. Validate char count vs hard cap; throw NEEDS_CONTEXT if exceeded (formatter cannot trim without operator input — that's an editorial call).
5. Emit `platforms/[platform].md` with the 7-field frontmatter + body sections.

### Step 4: Scheduler-import emission

Always emit all 4 scheduler-import files (Typefully JSON / Buffer CSV / Hootsuite CSV / generic CSV). Schemas in `references/scheduler-formats.md`. Files include ALL target platforms (even those not supported by every scheduler — README clarifies which scheduler covers which platform).

### Step 5: Typefully API draft (Route B only)

If `credentials_state.typefully == true` AND X in target_platforms:
1. POST to Typefully Draft API with X body.
2. Capture returned `draft_id` + `share_url`.
3. Augment `typefully.json` with `api_response` block.
4. On error, fall back to Route A for X; log error code (not key) in manifest.

### Step 6: Manifest + README emission

Manifest carries Mode Summary + Credentials Detected (binary, no values) + Bundle Files + Next Step + Verification Checklist.

README carries per-platform instructions + scheduler-import file map + setup pointer.

### Step 7: Critic-agent dispatch

Critic pass scores dims 1–7. For export / draft the critic runs after emission; for `--mode=publish` it runs **before** the two-stage confirmation gate as the content gate (a live post cannot be fixed afterward). Dim 8 (Live-Publish Safety) is applied by the orchestrator's post-publish Self-Check, not the critic. FAIL → re-dispatch formatter for failing platform(s) (max 2 cycles); persistent publish-run FAIL → BLOCKED. PASS twice with operator override → log via `scripts/log-critic-override.ts` (per D8 contract; production skill but uses eval-skill logging mechanism for override audit trail).

### Step 8: Delivery

Return bundle root path + Mode Summary line + next-step instruction matched to detected route (per-route operator copy: `procedures/next-step.md`).

## History

- **v1.0 (D16, 2026-05-19)** — initial slice. Export + Typefully API draft. 9 platforms. 4 scheduler formats. Auto-detect.
- **v1.1 (D17, 2026-05-19)** — browser-automation drafts for 8 non-X platforms (LinkedIn / IG / FB / TikTok / YT / Threads / Bluesky / Reddit) via session-cookie auth + agent-browser. Adds: automation-agent + 8 platform-flow refs + session-cookie-export.md + confirmation-gate.md. Adds Critical Gate 7 (confirmation gate). Adds critic dim 7 (Browser-Automation Safety; rubric becomes 7 dims × 0-10). Adds 3 anti-patterns (silent auto-submit / cookie leakage / captcha-bypass attempts). Schema in `.forsvn/credentials/platforms.json` extends with `session_cookies` field per platform. Per-platform fallback to D16 export-mode on automation failure (single attempt; no retries; no captcha solve). Manifest gains `confirmation_result` + `automation_result_per_platform` fields. Per-platform draft frontmatter gains `draft_url` + `automation_result` fields.
- **v1.2 (D18, 2026-05-19)** — `--mode=publish` live posting for all 9 platforms (X via Typefully schedule-immediate; the 8 non-X via browser-automation Send — each automation-flow ref gains a `## Publish Variant`). Two-stage current-session confirmation gate (`references/publish-confirmation-gate.md`): Stage 1 reviews every full post body → Stage 2 requires the typed word `PUBLISH`. For publish the critic runs BEFORE the gate (content cannot be fixed once live); rubric extends to 8 dims (dim 8 = Live-Publish Safety, orchestrator-applied post-publish; pass gate ≥ 56/80). `--dry-run` prints the publish plan and posts nothing. Rollback = the gate aborts cleanly before anything posts; once live, the manifest records each `post_url` + per-platform delete instructions (no automated un-publish). Per-platform publish failure → fallback to draft (cookies present) or export. 3 anti-patterns added (#15 publish without two-stage confirm / #16 publish on critic FAIL / #17 dry-run that posts). 1 new ref + 8 modified files; no new skill (plugin.json unchanged). Closes D18 + Workstream C.

## Related skills

- **Upstream:** `write-social` (per-platform copy), `produce-asset` (image media), `produce-video` (video media), `create-brand` (brand tokens)
- **Downstream (future):** `evaluate-content` (eval loop for engagement vs brief hypothesis); `evaluate-campaign` (cross-platform campaign aggregation)
- **Parallel:** none in v1 (publish-social is terminal in the content production chain — next step is platform-side analytics)

## Cross-cutting

- D8 contract: generation-provenance frontmatter; future `evaluate-content` reads `input_artifacts` to ground scoring
- D11 / D14 precedent: 2-agent (formatter / prompt-author + critic), sequential, export-mode v1
- D13 cross-skill ref: `references/_shared/platform-intelligence/` mirror used by per-platform refs for the 5 platform-intelligence-backed platforms
