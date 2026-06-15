<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Anti-Patterns — Design-Brief

> Failure modes the orchestrator + critic-agent guard against. Re-read before any brief ships.

[ANTI-PATTERN] — load at critic dispatch + at orchestrator pre-write + at Approval Gate 1 framing.

---

## Section 1 — Process & Approval-Gate Anti-Patterns

### 1. Skipping the brief approval gate

**Symptom:** Going straight to image-gen prompt or designer spec without presenting the 3 candidate briefs at Approval Gate 1.

**Why it fails:** Image-gen credits are real money. Designer time is real hours. A misaligned concept that bypasses Gate 1 silently produces a render that doesn't match what the user wanted — the user sees the render, says "no, not this," and the orchestrator has to restart from concept-agent anyway. Skipping the gate adds one full cycle of wasted work.

**Fix:** Approval Gate 1 is non-optional. Brief-synth-agent produces 3 candidates, orchestrator STOPs and presents them, user picks A/B/C (or revise / switch route / stop). Layer 2 dispatches ONLY after explicit selection. No collapsed "I'll go with A unless you say otherwise" — explicit pick required.

**Owned by:** orchestrator (Approval Gate 1 STOP) + Critical Gate "Do NOT skip the brief approval gate".

---

### 2. Skipping the brief acceptance gate

**Symptom:** Writing `docs/forsvn/artifacts/marketing/design-briefs/[slug].md` after Layer 3 critic PASS without presenting the assembled brief + critic report at Approval Gate 2.

**Why it fails:** Critic PASS is necessary but not sufficient — critic scores the brief against the rubric, but the user owns "is this what I asked for." Gate 2 is the user's last chance to revise before the brief ships to a downstream renderer. Skipping it ships briefs the user didn't validate; ASSETS.md auto-tick fires; downstream tools start consuming a brief the user hasn't seen.

**Fix:** Approval Gate 2 is non-optional. Critic PASS → STOP, present assembled brief + critic report, await user "Approve" / "Revise X" / "Reject". Only "Approve" triggers artifact write + ASSETS.md tick. "Revise" = 1 cycle of re-dispatch; "Reject" = save as `[slug]-rejected.md` + exit BLOCKED.

**Owned by:** orchestrator (Approval Gate 2 STOP) + Critical Gate "Do NOT skip the brief approval gate" (covers both gates).

---

### 3. Treating the brief as a render

**Symptom:** Writing a fluffy concept paragraph ("A modern, vibrant design that captures the spirit of innovation") and calling it done.

**Why it fails:** The brief's job is to eliminate downstream ambiguity. A vague brief produces drift regardless of how good the renderer is. Downstream tools don't have access to the user's intent — they have access only to the brief.

**Fix:** Every field must be specific enough that a downstream tool / designer can execute without follow-up. Platform Spec table has 8 required rows. Concept has Visual Direction (3-5 specific lines: mood, composition, palette emphasis, type role, motion). References cite specific URLs / named brands / artworks — never copy, only direction. Downstream Handoff Block carries lens / lighting / mood / era / composition / color cast for image-gen; layout grid + tokens for vector; spec sheet + open questions for designer.

**Owned by:** brief-synth-agent (specificity discipline) + critic-agent (rubric scoring catches vague concepts via low Hierarchy / Composition scores).

---

## Section 2 — Brand & Token Anti-Patterns

### 4. Inventing tokens

**Symptom:** Using a color or font not in DESIGN.md because it "fits the mood" or "matches the campaign."

**Why it fails:** DESIGN.md is the source of truth for what the brand looks like. Inventing tokens — even when they're tasteful — fragments the visual identity and shows up as drift the next time the same asset type renders against actual DESIGN.md tokens. Multiple briefs inventing different "complementary" colors produce a brand that doesn't visually cohere.

**Fix:** Every visual decision traces to DESIGN.md. If DESIGN.md is incomplete for this asset's needs (e.g., illustration style, motion easing for an animated banner), flag it in the brief and ask the user — either expand DESIGN.md (re-run `create-brand` Route B) or accept the limitation. Do not silently fill the gap.

**Owned by:** brand-anchor-agent (token pull from DESIGN.md only) + brief-synth-agent (token check) + critic-agent (Brand fidelity rubric dimension — score 1 means tokens trace; lower scores cite the invention).

---

### 5. Stock-AI defaults

**Symptom:** Default purple-blue gradient. Centered isolated subject on white. Glassmorphism. Faux-3D bevels. Corporate Memphis / Alegria illustrations. Generic isometric tech illustration. Neon outlines on dark / Linear-clone aesthetic. Vaporwave default. Abstract blob shapes.

**Why it fails:** LLMs trained on AI-generated imagery regress toward these patterns silently. They feel "designer-ish" but they're the AI-image equivalent of "delve" / "tapestry" / em-dash overuse — a signal that the asset wasn't actually art-directed, just defaulted. They alienate users who can spot AI-generated visuals at a glance.

**Fix:** Critic-agent runs the 13-pattern Generic-AI-Aesthetic Detector from `references/visual-rubric.md` § "Generic-AI-Aesthetic Detector". Score 0-3 per pattern (max 39). Thresholds: 0-7 clean / 8-15 DONE_WITH_CONCERNS / 16+ auto-FAIL. Concept-agent's job at Layer 1 is to propose 3 distinct concepts that don't lean on these patterns; if a concept relies on them, score it down BEFORE Approval Gate 1 — the gate is the user-facing checkpoint but the agents own the floor.

**Owned by:** concept-agent (proposes non-default directions) + critic-agent (Generic-AI-Aesthetic Detector — 13 patterns, threshold-based FAIL).

---

### 6. Generic-photo prompts

**Symptom:** "Modern office, professional, 4k, hyperrealistic." Looks like every other AI-stock-photo on the internet.

**Why it fails:** Generic prompts produce generic outputs. They land in the same visual neighborhood every other lazy AI prompt lands in. The asset looks AI-generated because the prompt was AI-generic.

**Fix:** Image-gen prompts MUST be specific — lens (50mm / 35mm / 85mm), lighting (golden-hour side light / overcast soft / harsh midday), mood (editorial calm / kinetic urgency / nostalgic), era (late-90s film / 70s editorial / contemporary), composition (off-center subject, leading lines, rule-of-thirds), color cast (warm shadow tones / cool highlights / desaturated). Prompt-craft-agent enforces this floor in `references/prompt-patterns.md`.

**Owned by:** prompt-craft-agent (specificity floor on every prompt) + critic-agent (Generic-AI-Aesthetic Detector catches generic prompts that produced default-AI outputs).

---

### 7. Ignoring safe zones

**Symptom:** Designing edge-to-edge for Instagram and losing the CTA to the crop. Designing a YouTube thumbnail that reads at 1080p preview but is illegible at the 100px feed thumbnail.

**Why it fails:** Platform crop behavior is non-negotiable. Instagram crops feed previews to square; CTA at the bottom edge gets clipped. YouTube renders thumbnails at multiple sizes; text smaller than the platform's thumb-stop floor is invisible in the feed.

**Fix:** Platform Spec table is mandatory and includes safe zones (px from edges, platform-specific) + type scale (mobile readability floor, min px at 1x) + contrast (thumb-stop, WCAG ratio min for asset's smallest text on its actual background). brief-synth-agent pulls these from `references/platform-modules.md` and lays them out in the brief; critic-agent fails any brief that doesn't visibly respect them.

**Owned by:** brief-synth-agent (Platform Spec table mandatory, all 8 rows) + critic-agent (Format fit rubric dimension — explicit platform crop + mobile readability check).

---

## Section 3 — Cross-Cutting (Marketing-Stack)

### 8. Treating Claude Design output as brand-system input

**Symptom:** Running claude.ai/design first to "explore the brand direction," then feeding that exploration into brand-system as ground truth.

**Why it fails:** Claude Design generates aesthetic exploration — it produces visually interesting outputs but they're not anchored to the brand's strategic positioning, audience, or competitive landscape. Using them as brand-system input inverts the dependency chain (brand-system should anchor design exploration, not the other way around) and silently encodes whatever defaults Claude Design produced as if they were brand commitments.

**Fix:** Claude Design output is downstream of design-brief, not upstream of brand-system. Sequence: brand-system → design-brief (with brand anchors) → Claude Design (executing the brief). If the user wants exploration before brand commitment, that's brand-system Route A territory (positioning + voice + archetype + sacred elements) — design exploration follows the strategy.

**Owned by:** orchestrator (Hard Gate enforces brand artifacts present BEFORE any concept generation) + design-brief Critical Gate "Do NOT invent tokens".

---

### 9. Hard gate bypass under `--fast`

**Symptom:** User invokes `/brief-graphic --fast` without BRAND.md present. Orchestrator interprets `--fast` as "skip the gate" and proceeds with cold-start questions about brand voice.

**Why it fails:** `--fast` is a complexity-routing flag (skip orchestration heavy lift), not a safety-gate-bypass flag. design-brief is hard-gated on brand artifacts because the entire output (palette pull, sacred elements, typography selection) depends on them. Without BRAND.md + DESIGN.md, the brief is fabricated — it produces what looks like a brief but isn't grounded in the brand. Per marketing-skills CLAUDE.md: "Safety gates supersede `--fast`."

**Fix:** Hard gate fires regardless of `--fast`. Missing brand artifacts → NEEDS_CONTEXT, recommend `create-brand`. `--fast` collapses Layer 1 parallel + Layer 1.5 brief-synth into single inline pass, reduces 3 candidate briefs to 1, skips Approval Gate 1 (single concept; user reviews at Gate 2 only), no rewrite loop on critic. `--fast` does NOT skip: hard gate, Approval Gate 2, critic-agent (single-pass scoring still runs), Generic-AI-Aesthetic Detector.

**Owned by:** orchestrator (Pre-Dispatch hard gate fires first, before mode resolution) + marketing-skills CLAUDE.md § "Complexity Routing" ("Safety gates supersede `--fast`").

---

### 10. Brief schema drift (frontmatter or section order)

**Symptom:** Orchestrator renames `downstream_route` → `route`, adds an undocumented `priority` field, drops the Hierarchy section "because the Concept covers it."

**Why it fails:** `docs/forsvn/artifacts/marketing/design-briefs/[slug].md` is read by downstream image-gen tools (Claude Design / Midjourney / Imagen / DALL·E), vector tools (Pencil / Figma), human designers (reading the Designer-Handoff Spec block), AND lp-brief (when the brief was invoked from a landing-page slot). Schema drift breaks downstream consumers silently — they jump to a section by frontmatter check or heading match, the check fails, they fall back to defaults, the user sees a render disconnected from the brief.

**Fix:** Frontmatter rules + body section order are the contract per `format-conventions.md`. Schema changes require atomic update of `format-conventions.md` in the same commit. No silent additions, no field renames, no section drops.

**Owned by:** orchestrator (artifact write step) + format-conventions.md (contract).

---

### 11. Wrong skill for intent — render request

**Symptom:** User asks "make me an IG post about pricing" → orchestrator dispatches design-brief, produces a brief, hands user the brief, user is confused ("I asked for the post, not a brief for the post").

**Why it fails:** design-brief is brief-only by design — rendering happens downstream. Users expecting a render get the wrong artifact. The brief is correct work; it just doesn't answer what the user actually wanted.

**Fix:** Pre-Dispatch detects "make / create / render / generate" verb + asset noun → emits "design-brief produces the BRIEF for the asset; the BRIEF then feeds Claude Design / Midjourney / Imagen / DALL·E / Pencil / Figma / a human designer who actually renders it. Proceed with brief, or are you looking for direct rendering (route to an image-gen tool yourself)?" Same intent classification for "redesign this page" → route to `brief-landing-page`; "design our brand identity" → route to `create-brand`.

**Owned by:** orchestrator (Pre-Dispatch intent classification) + Skill Deference list in SKILL.md.

---

## Cross-skill ownership note

Patterns #8-11 mirror the cross-cutting marketing-stack convention established by ad-copy slot 9 / copywriting slot 8 / cold-outreach slot 7 / campaign-plan slot 10 — same rationale (artifact-schema drift breaks downstream consumers silently; intent-routing missteps cost the user a second invocation; hard-gate bypass under `--fast` violates the safety contract).
