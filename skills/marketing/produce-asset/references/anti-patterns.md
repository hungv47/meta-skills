---
title: Anti-Patterns — produce-asset
lifecycle: canonical
status: stable
produced_by: produce-asset
provenance:
  extracted_from: implementation-roadmap/execution-evaluation/brief-pack/04-production-layer.md § Anti-patterns + sources/IDEA-4a-execution-production.md § 1 Anti-patterns
  extracted_at: 2026-05-19
load_class: ANTI-PATTERN
---

# Anti-Patterns — produce-asset

**Re-read before any prompt or manifest ships. The 5 orchestrator-level patterns + 4 cross-cutting marketing-stack rows cover the failure modes brief 04 explicitly named, plus the cross-stack drift risks every production skill carries.**

The shared production-skill anti-pattern catalog — the orchestrator-level set + the 4 cross-cutting rows — is canonical in [`_shared/production-pattern.md`](_shared/production-pattern.md) § 7; the rows below are the produce-asset-specific instances.

---

## Orchestrator-level (produce-asset specific)

### 1. Skipping the brief read

**Pattern:** Generating prompts from operator chat-context instead of the brief-graphic artifact. Common when the operator describes the asset verbally and the orchestrator skips the file-read.

**Why it fails:** Brief-graphic encodes aspect, safe zones, copy, brand tokens, anti-patterns as a CONTRACT. Skipping it means the prompt may pass critic Gate 4 (copy verbatim from chat-context) while violating the actual brief.

**Fix:** Critical Gate "Inputs" in SKILL.md. If `source_brief` cannot be located on disk, return `NEEDS_CONTEXT` and defer to `brief-graphic`. Never reconstruct the brief from chat.

---

### 2. Hallucinating logos or brand marks

**Pattern:** When `brand/BRAND.md` references a logo asset that doesn't exist on disk, prompt-author generates a "logo placeholder description" the renderer interprets as "make up a logo."

**Why it fails:** Brand-mark fidelity is the highest-risk failure mode in image generation. A fabricated logo that ships into a campaign is brand-damaging and hard to recall. Critic Gate 2 auto-FAILs.

**Fix:** Placeholder rule — when a brand asset is missing, the prompt explicitly instructs the renderer to use a SOLID-COLOR BLOCK of the brand's primary color, NOT to invent a logo. The DO NOT list in every prompt enforces.

---

### 3. Silent aspect-ratio overrides

**Pattern:** Renderer (especially Midjourney without `--ar`, DALL·E without explicit size param) defaults to its house aspect (often 1:1) and the rendered asset doesn't match the brief.

**Why it fails:** The brief encodes platform-specific aspect (9:16 for IG Story, 1.91:1 for OG card). A 1:1 render for an IG Story slot is unusable.

**Fix:** Every prompt's "Platform Spec" section states the aspect verbatim AND the "Anti-Patterns" DO NOT list explicitly forbids aspect overrides. The required **Engine Dialect** section includes the bound engine's aspect syntax (`--ar 9:16`, `size`/`aspectRatio` param) to defend against the default.

---

### 4. Copy synonymizing

**Pattern:** Renderer (or prompt-author on a rewrite cycle) "improves" copy strings — "Get started" → "Begin your journey" — because the synonym "flows better."

**Why it fails:** The brief's copy is approved upstream (by copywriting skill + brand-voice critic). Renderer is a typesetter, not a copywriter. Synonymized copy fails brand-voice review and may invalidate paid-ad policy compliance that was approved on the verbatim string.

**Fix:** Critic Gate 4 is exact character match (whitespace + punctuation included). Auto-FAIL on any substitution. The DO NOT list in every prompt explicitly forbids substitution.

---

### 5. Render-mode misroute

**Pattern:** Operator passes `--publish` or `--api-render` to produce-asset v1; orchestrator silently falls through to export-mode without flagging the deferred behavior.

**Why it fails:** v1 export-mode is explicit per Critical Gate 1 in SKILL.md. Silent fall-through means the operator thinks they invoked a publish step and may not run the prompt through their chosen renderer.

**Fix:** Return `BLOCKED` with a one-line "publish / api-render modes deferred to v2; v1 is export-mode only — run the emitted prompts through your chosen renderer manually." No silent fall-throughs.

---

## Cross-cutting marketing-stack rows

### Cross-stack contract drift

**Pattern:** produce-asset's manifest or per-slot prompt schema diverges from what downstream consumers (future evaluate-content / evaluate-ad) expect. Common when a single skill is refactored in isolation without ripple coordination.

**Why it fails:** Future eval skills will read produce-asset frontmatter (`provenance.input_artifacts`, slot list) to ground scoring. Schema drift means the eval can't find its inputs.

**Fix:** Schema changes to `references/format-conventions.md` require atomic update of any downstream consumer that reads produce-asset artifacts. Until evaluate-content / evaluate-ad exist, this risk is theoretical — but the contract discipline should be in place now per `references/_shared/manifest-spec.md`.

---

### brand-system absent → token fabrication

**Pattern:** `brand/BRAND.md` or `brand/DESIGN.md` is missing or thin. Rather than returning `NEEDS_CONTEXT`, prompt-author fabricates brand tokens (invents hex values, makes up token names) to fill the prompt template.

**Why it fails:** Fabricated tokens look authoritative in the prompt but don't match the project's real brand. Renderer produces off-brand output.

**Fix:** Critical Gate "Inputs" in SKILL.md. Brand files are REQUIRED; missing → `NEEDS_CONTEXT` and defer to `create-brand`. Never proceed with fabricated tokens.

---

### Skill-deference miss (no upstream brief)

**Pattern:** Operator invokes produce-asset directly without ever running brief-graphic. produce-asset tries to generate a prompt from chat-context.

**Why it fails:** Without the brief, there's no spec to honor. Anti-pattern 1 (skipping brief read) is the symptom; this is the upstream cause.

**Fix:** `defers-to: brief-graphic` in frontmatter. SKILL.md Inputs section flags the brief as REQUIRED. If missing → `NEEDS_CONTEXT`, defer.

---

### Artifact schema drift

**Pattern:** SKILL.md says one frontmatter shape, `references/format-conventions.md` says another, prompt-author-agent emits a third. Three sources of truth, all subtly different.

**Why it fails:** `manifest-sync.ts` indexes from frontmatter; drift breaks the index. Critic gates check schema; drift means critic FAILs on technically-correct prompts.

**Fix:** `references/format-conventions.md` is the single source of truth for schema. SKILL.md cites it; prompt-author-agent reads it; critic-agent validates against it. Schema changes happen in format-conventions.md FIRST, then propagate to citing files in the same commit.
