---
title: Anti-Patterns — produce-video
lifecycle: canonical
status: stable
produced_by: produce-video
provenance:
  extracted_from: implementation-roadmap/execution-evaluation/brief-pack/04-production-layer.md § Anti-patterns + sources/IDEA-4a-execution-production.md § 2 produce-video Anti-patterns
  extracted_at: 2026-05-19
load_class: ANTI-PATTERN
---

# Anti-Patterns — produce-video

**Re-read before any bundle ships. The 6 orchestrator-level patterns + 3 app-preview-mode patterns + 4 cross-cutting marketing-stack rows cover the failure modes brief 04 + WS4 explicitly named, plus the cross-stack drift risks every production skill carries.**

The shared production-skill anti-pattern catalog — the orchestrator-level set + the 4 cross-cutting rows — is canonical in [`_shared/production-pattern.md`](_shared/production-pattern.md) § 7; the rows below are the produce-video-specific instances (Anti-pattern 6, shot-duration padding, and Anti-patterns 7-9, app-preview mode, are produce-video-only).

---

## Orchestrator-level (produce-video specific)

### 1. Skipping the brief read

**Pattern:** Generating per-shot prompts from operator chat-context instead of the brief-shortform artifact (or schema-compliant hand-written video-brief). Common when the operator describes the video verbally and the orchestrator skips the file-read.

**Why it fails:** brief-shortform encodes hook, shot list, on-screen text choreography, audio plan, caption, CTA, aspect, length as a CONTRACT. Skipping it means the bundle may pass critic Gate 1 (schema fields present) while violating the actual brief.

**Fix:** Critical Gate "Inputs" in SKILL.md. If `source_brief` cannot be located on disk AND no hand-written video-brief is supplied, return `NEEDS_CONTEXT` and defer to `brief-shortform`. Never reconstruct the brief from chat.

---

### 2. Hallucinating logos or brand marks

**Pattern:** When `brand/BRAND.md` references a logo asset that doesn't exist on disk, prompt-author writes a "logo intro animation" or "brand-mark close" the runtime interprets as "invent a logo." Worse on motion-graphic productions where logo treatments feel natural.

**Why it fails:** A fabricated logo that ships into a campaign is brand-damaging and hard to recall — and harder to spot in motion than in static. Critic Gate 2 auto-FAILs.

**Fix:** Placeholder rule — when a brand asset is missing, the per-shot prompt explicitly instructs the runtime to use a SOLID-COLOR BLOCK of the brand's primary color, NOT to invent a logo. The DO NOT list in every per-shot prompt enforces.

---

### 3. Silent aspect-ratio overrides

**Pattern:** Runtime (Remotion `<Composition>` with default `width`/`height`; HyperFrames composition without `aspect-ratio` CSS; image-gen CLI without aspect param) defaults to 16:9 or 1:1 and the rendered video doesn't match the brief.

**Why it fails:** A 16:9 render for a TikTok (9:16) slot is unusable. The brief encodes platform-specific aspect as a hard requirement.

**Fix:** Every per-shot prompt's "Renderer Hints" section (when populated) names the aspect explicitly per runtime; the canonical `manifest.md` carries `aspect` in frontmatter; HyperFrames + Remotion scaffolds both derive width/height from `aspect`. Anti-pattern DO NOT list explicitly forbids aspect overrides.

---

### 4. On-screen text synonymizing

**Pattern:** Runtime (or prompt-author on a rewrite cycle) "improves" on-screen text strings — "Stop guessing" → "Stop second-guessing" — because the synonym "punches more."

**Why it fails:** The brief's on-screen text is approved upstream (by brief-shortform's hook + copy-pack agents + critic). Runtime is a typesetter, not a copywriter. Synonymized text fails brand-voice review and may invalidate paid-distribution policy compliance that was approved on the verbatim string.

**Fix:** Critic Gate 1 is exact character match (whitespace + punctuation included). Auto-FAIL on any substitution. The DO NOT list in every per-shot prompt explicitly forbids substitution.

---

### 5. Render-mode misroute

**Pattern:** Operator passes `--publish` / `--render` / `--auto-run` to produce-video v1; orchestrator silently falls through to export-mode without flagging the deferred behavior.

**Why it fails:** v1 export-mode is explicit per Critical Gate 1 in SKILL.md. Silent fall-through means the operator thinks they invoked a render step and may never run the scaffolds through their runtime.

**Fix:** Return `BLOCKED` with a one-line "render/publish modes deferred to v2; v1 is export-mode only — run the chosen scaffold through your runtime (hyperframes preview / npx remotion preview / image-gen CLI per vercel-ai-cli.md)." No silent fall-throughs.

---

### 6. Padding shot durations to hit length targets

**Pattern:** Brief says "60s total, 5 shots at 10s each = 50s." Prompt-author silently extends shot 5 to 20s to hit the 60s target. Or splits shot 3 into 3a + 3b.

**Why it fails:** The brief's shot timing is calibrated against platform retention curves (hook in first 1s, peak at shot 2-3, CTA reveal at shot N-1 → shot N). Padding distorts the curve. Splitting introduces transitions the brief didn't approve.

**Fix:** Critic Gate 1 check: `SUM(scenes[*].duration_seconds) == manifest.length_seconds` exactly. If brief math doesn't sum, return `NEEDS_CONTEXT` and ask the brief layer (brief-shortform) to fix the brief's shot timing. Never silently re-distribute.

---

## App-preview-mode patterns (added in WS4)

### 7. Inventing UI elements not present in the source screenshot

**Pattern:** App-preview mode. The handoff says "B3 reveal: dim overlay rises, tide appears" with `source_screenshot: screenshots/03-active.png`. Prompt-author writes a Visual Prompt that adds a glowing border, a confetti burst, or "a subtle highlight indicating success" — none of which are in the source screenshot. The runtime renders these as composited overlays, producing footage that misrepresents the product UI.

**Why it fails:** App-preview's promise is that the rendered video is a faithful demonstration of the product. Invented UI elements are footage fraud — they show behavior the product doesn't actually have. App Store / onboarding surfaces have rejection policies for misleading captures; the legal risk compounds the brand risk. Critic Gate 5 auto-FAILs.

**Fix:** Visual Prompt sections describe ONLY composition operations on the real screenshot — crop, mask transform, interaction overlay (pointer + caption-band). No "add," "introduce," "show a," "indicate" verbs. The DO NOT list in every per-shot prompt includes "do not add visual elements absent from the source screenshot." When the brief calls for a result-state that isn't in the supplied screenshots, return `NEEDS_CONTEXT` and ask `brief-app-preview` for the missing state screenshot.

---

### 8. Custom interaction verbs or mask transforms (vocabulary expansion)

**Pattern:** App-preview mode. The handoff uses a canonical verb (`tap`, `reveal`, `hold`), but the prompt-author "improves" it in the per-shot prompt — `tap` becomes "pulse-tap," `reveal` becomes "swoop-in," `static` mask becomes "subtle drift." Or vice versa: a fresh prompt-author run on the same handoff invents `glitch-transition` because it feels more energetic.

**Why it fails:** The canonical 10-verb set + 6-transform set are calibrated against the brief-app-preview Gate 3 vocabulary and the runtime scaffolds' implementation. Custom verbs/transforms have no implementation contract — the HyperFrames and Remotion scaffolds don't know how to map "pulse-tap" to a deterministic motion spec. Critic Gate 6 auto-FAILs. Worse: vocabulary drift is contagious — once one custom verb ships, future prompt-authors will treat it as precedent.

**Fix:** Verb-set + transform-set lock. Every `interaction_verb` is one of the 10; every `mask_transform` is one of the 6. The DO NOT list in every per-shot prompt cites the canonical sets explicitly. When the handoff itself contains a non-canonical verb, the brief is broken — return `NEEDS_CONTEXT` and defer to `brief-app-preview` (its Gate 3 should have caught it).

---

### 9. Synthetic pointer or caption-band effects (gradient / glow / neon)

**Pattern:** App-preview mode. The handoff specifies `pointer: solid-circle 64px @ (430, 110) accent`. Prompt-author writes `pointer color: radial-gradient(#0F4C5C, #00FFFF)` or "add a soft glow around the pointer for visibility" or "caption-band fades from accent to translucent gradient." The runtime renders synthetic effects that DON'T match the brand's actual visual language.

**Why it fails:** Brand fidelity violation by stealth. The pointer and caption-band are the only on-screen overlays in app-preview mode; they are the brand's UI vocabulary. A neon-gradient pointer reads as "AI-generated" even when the underlying UI is the real product — it breaks the immersion of "this is the actual app." Critic Gate 7 auto-FAILs. Also relevant: the `create-brand` WS9 anti-pattern #21 ("Generic AI-glow palette default") prohibits this pattern at the brand layer; the same prohibition applies here.

**Fix:** Pointers and caption-band backgrounds are SOLID colors only. Hex from `brand/DESIGN.md` (with token name) OR source-sampled hex with `(cold-start-sampled)` token name. The per-shot Brand Tokens section explicitly states "solid" or the equivalent on every shot. DO NOT list adds "do not apply gradient, glow, or neon effects to pointer or caption-band." When the brief itself specifies a synthetic effect (e.g., the motion-spec-agent shipped a gradient), the brief is broken — return `NEEDS_CONTEXT`.

---

## Cross-cutting marketing-stack rows

### Cross-stack contract drift

**Pattern:** produce-video's manifest or per-shot prompt schema diverges from what downstream consumers (future evaluate-shortform / evaluate-content) expect. Common when a single skill is refactored in isolation without ripple coordination.

**Why it fails:** Future eval skills will read produce-video frontmatter (`provenance.input_artifacts`, shot list, CTA, aspect) to ground scoring. Schema drift means the eval can't find its inputs.

**Fix:** Schema changes to `references/format-conventions.md` OR `references/video-brief-schema.md` require atomic update of every downstream consumer that reads produce-video artifacts. Until evaluate-shortform / evaluate-content read produce-video outputs, this risk is theoretical — but the contract discipline should be in place now per `references/_shared/manifest-spec.md`.

---

### brand-system absent → token fabrication

**Pattern:** `brand/BRAND.md` or `brand/DESIGN.md` is missing or thin. Rather than returning `NEEDS_CONTEXT`, prompt-author fabricates brand tokens (invents hex values, makes up token names, picks a "reasonable-looking" font) to fill the scaffold and per-shot prompts.

**Why it fails:** Fabricated tokens look authoritative in the bundle but don't match the project's real brand. Renderer produces off-brand video. Worse on video because brand-token drift compounds across shots.

**Fix:** Critical Gate "Inputs" in SKILL.md. Brand files are REQUIRED; missing → `NEEDS_CONTEXT` and defer to `create-brand`. Never proceed with fabricated tokens.

---

### Skill-deference miss (no upstream brief)

**Pattern:** Operator invokes produce-video directly without ever running brief-shortform and without supplying a schema-compliant hand-written video-brief. Produce-video tries to generate a bundle from chat-context.

**Why it fails:** Without the brief, there's no spec to honor. Anti-pattern 1 (skipping brief read) is the symptom; this is the upstream cause.

**Fix:** `defers-to: brief-shortform` in frontmatter. SKILL.md Inputs section flags the brief as REQUIRED. If missing → `NEEDS_CONTEXT`, defer. The hand-written video-brief escape hatch requires the operator to write a brief matching `references/video-brief-schema.md` — not chat-context.

---

### Artifact schema drift

**Pattern:** SKILL.md says one frontmatter shape, `references/format-conventions.md` says another, prompt-author-agent emits a third, `references/video-brief-schema.md` describes a fourth. Four sources of truth, all subtly different.

**Why it fails:** `manifest-sync.ts` indexes from frontmatter; drift breaks the index. Critic gates check schema; drift means critic FAILs on technically-correct bundles. Worse than produce-asset because produce-video has FOUR schema sources (manifest + per-shot + HyperFrames scaffold JSON + Remotion scaffold SCENES array) — all derived from one truth.

**Fix:** `references/format-conventions.md` is the single source of truth for output schema; `references/video-brief-schema.md` is the single source of truth for input. SKILL.md cites both; prompt-author-agent reads both; critic-agent validates against both. Schema changes happen in the reference files FIRST, then propagate to citing files in the same commit. HyperFrames scaffold JSON + Remotion SCENES are derivative views of the canonical manifest — they MUST be regenerated whenever the manifest changes, never edited independently.
