# Anti-Patterns

> Re-read before any output ships. Five sub-critic clusters (Grounding / Component Focus / Beat Clarity / Brand Fidelity / Platform Fit) + 4 cross-cutting marketing-stack patterns. Critic-agent maps each gate FAIL to the named re-dispatch agent.

---

## Cluster 1 — Grounding (Gate 1)

### AP-1: Invented source

**Shape:** A beat references `S07` but `assets.md` lists only S01–S05.

**Why bad:** The brief claims source it doesn't have. Downstream `produce-video` will block on missing assets; if the operator papers over it with a placeholder, the rendered video shows UI that doesn't exist in the product. App Store rejects. Onboarding viewers churn.

**Detection:** Cross-check Beat Sequence table's Source ID column against the Source Inventory's ID column. Any orphan ID → FAIL.

**Re-dispatch:** intake-validator-agent (if gap is in inventory acknowledgment) or flow-slicer-agent (if gap is in crop-map).

### AP-2: Invented UI component

**Shape:** Motion spec adds a "Live indicator" badge to B4 that doesn't appear in any source screenshot. Or the motion spec recolors an existing component to "look better."

**Why bad:** Synthesizing UI is the most expensive AI-slop failure in an app preview — the viewer notices instantly. Brand fidelity is a survivable smear, but invented UI is unsurvivable.

**Detection:** Source Token Inventory in motion-spec lists only tokens that map to DESIGN.md or sampled colors. Any color/component/asset referenced in motion specs but absent from the inventory → FAIL.

**Re-dispatch:** motion-spec-agent (immediate); intake-validator-agent (if the screenshot gap that prompted the invention is the root cause).

### AP-3: Crop rectangle outside source bounds

**Shape:** Source is 1290×2796; crop spec is `[100, 200, 1500, 600]` (width exceeds source width).

**Why bad:** The editor either truncates silently (losing the right edge) or scales the source (degrading quality). Either way the brief broke contract.

**Detection:** For each crop rect [x, y, w, h] and source resolution [W, H], verify x+w ≤ W and y+h ≤ H. Any violation → FAIL.

**Re-dispatch:** flow-slicer-agent.

---

## Cluster 2 — Component Focus (Gate 2)

### AP-4: Whole-screen tour

**Shape:** Beats B1 through B5 all use `crop_type: full-screen` with no state change between them — just different angles of the same idle home screen.

**Why bad:** App Store viewers and onboarding card readers churn on tour content in <2 seconds. The viewer learns nothing the static App Store screenshots don't already show. App preview is for proving features, not exhibiting the home screen.

**Detection:** ≥2 consecutive `full-screen` beats with no state-change verb between them → FAIL. ≥3 of 5 beats `full-screen` → FAIL regardless of state changes.

**Re-dispatch:** flow-slicer-agent.

### AP-5: Full-screen without justification

**Shape:** `crop_type: full-screen` row with the Justification cell blank or filled with "establishing shot" / "context."

**Why bad:** Full-screen is the EXCEPTION clause in Critical Gate 4. Bypassing the justification turns the exception into a fallback for slicers who couldn't pick a region.

**Detection:** Every full-screen row must have a justification matching the canonical exception clause ("the state change IS the layout settling" / "the smallest meaningful unit is the full layout" / similar). Generic justifications → FAIL.

**Re-dispatch:** flow-slicer-agent.

### AP-6: Continuity break on same affordance

**Shape:** B1 crops `[240, 1820, 810, 220]` for the CTA at rest. B2 crops `[180, 1700, 900, 360]` for the same CTA mid-press.

**Why bad:** Two crops on the same affordance with different rectangles force the editor to choose between (a) cutting between beats (interrupting continuity) or (b) interpolating crop rectangles (which destroys source-pixel fidelity). Same affordance, same rectangle.

**Detection:** When two consecutive beats reference the same source affordance, the rectangles must match exactly. Differing rectangles → FAIL.

**Re-dispatch:** flow-slicer-agent.

---

## Cluster 3 — Beat Clarity (Gate 3)

### AP-7: Tour beat / establishing beat

**Shape:** Beat with proof "introduces the dashboard" / "establishes the feature's context" / "shows the home screen."

**Why bad:** A beat that establishes is a beat that doesn't prove. Every beat in an app preview must prove an action or a state change; "establishing" is implicit in B1 (the resting frame) and never needs its own beat.

**Detection:** Proof column contains "introduces," "establishes," "shows off," "displays," "looks at" → FAIL.

**Re-dispatch:** interaction-storyboard-agent.

### AP-8: Compound action in one beat

**Shape:** Beat with verb "tap+drag" or "type-then-save" — two user actions collapsed into one beat row.

**Why bad:** The brain registers one change per beat. Compound actions either get cut to single-action beats by the editor (re-introducing the work) or rendered with one of the actions invisible (losing the proof).

**Detection:** Verb column contains "+", "then," "and," or multiple canonical verbs → FAIL.

**Re-dispatch:** interaction-storyboard-agent.

### AP-9: Hold beat without internal motion

**Shape:** Beat with verb "hold," 6 seconds long, no description of what's moving inside the held state.

**Why bad:** A static hold > 4s is dead time. App Store viewers churn; onboarding cards skip. Either there's visible internal motion (counter, tide, progress bar) or the hold collapses to ≤2s.

**Detection:** Verb is "hold," duration > 4s, no internal-motion phrase in the proof column → FAIL.

**Re-dispatch:** interaction-storyboard-agent.

### AP-10: Caption that pitches the feature

**Shape:** Caption on B2 reads "Get back hours every week with surge mode."

**Why bad:** Captions are beat-scoped, not feature-scoped. A caption that pitches the feature lifecycle-wide is a marketing line, not a beat label. App Store policy treats forward-looking performance phrases as forbidden claims.

**Detection:** Caption contains forward-looking verbs ("save," "improve," "boost") or comparative superlatives ("fastest," "best," "most"). OST scan in platform-format-agent fires on this — fix in interaction-storyboard.

**Re-dispatch:** interaction-storyboard-agent (with platform-format-agent's specific phrase).

---

## Cluster 4 — Brand Fidelity (Gate 4)

### AP-11: Synthetic gradient on caption or pointer

**Shape:** Pointer color is `radial-gradient(#00FFFF, #FF00AA)` — a synthetic neon gradient with no DESIGN.md mapping.

**Why bad:** App previews from amateur tools love synthetic glow. Real product UI doesn't have it. Adding it destroys the believability — the viewer registers "AI demo," not "real product."

**Detection:** Pointer / caption / mask color includes gradient functions OR colors absent from Source Token Inventory → FAIL.

**Re-dispatch:** motion-spec-agent.

### AP-12: Recoloring the source

**Shape:** B3 dim overlay in the source is `rgba(20, 30, 60, 0.8)` (a deep navy). Motion spec changes it to `rgba(80, 30, 100, 0.8)` for "more brand consistency."

**Why bad:** The source IS the brand. If the screenshot is navy dim and the brand book is navy, the preview is navy verbatim. Re-shading betrays the source.

**Detection:** Any motion-spec color value applied to a source-native component differs from the source-sampled color → FAIL.

**Re-dispatch:** motion-spec-agent.

### AP-13: Wrong-platform pointer

**Shape:** App Store iOS preview uses a desktop cursor-arrow as the pointer. App Store Mac preview uses a finger glyph.

**Why bad:** Mismatched pointer reads as a different product running on a different device. App Store reviewers may reject.

**Detection:** Pointer style ≠ platform's pointer-style row in motion-spec-agent's Pointer Glyph Rules table → FAIL.

**Re-dispatch:** motion-spec-agent.

### AP-14: Caption font incongruent with source

**Shape:** Source UI is set in SF Pro / Inter / a defined brand sans. Caption uses Helvetica "because it's more professional."

**Why bad:** Type IS brand. A different caption font reads as "the captions were added by someone else."

**Detection:** Caption typeface differs from DESIGN.md type token OR from source-sampled type when cold-start → FAIL.

**Re-dispatch:** motion-spec-agent.

---

## Cluster 5 — Platform Fit (Gate 5)

### AP-15: Surface length violation

**Shape:** Total length 35s for an App Store iOS preview (window: 15-30s).

**Why bad:** Upload step rejects. Brief is unshippable.

**Detection:** total_length_seconds outside the surface's length window → FAIL.

**Re-dispatch:** platform-format-agent (which routes to interaction-storyboard-agent for beat trimming or expansion).

### AP-16: Performance claim in caption (OST scan miss)

**Shape:** Caption B5 reads "The fastest focus tool you'll ever try." OST scan passed it.

**Why bad:** App Store policy forbids performance claims, comparative superlatives, and forward-looking promises. All surfaces inherit this rule because the brief might be repurposed.

**Detection:** Caption matches any pattern in platform-format-agent's Forbidden Phrases scan → FAIL.

**Re-dispatch:** platform-format-agent (which routes to interaction-storyboard-agent with the offending phrase).

### AP-17: Caption band collides with platform UI

**Shape:** TikTok variant has caption band at very bottom, where TikTok's own UI (creator handle, sound link, like/comment chrome) overlays.

**Why bad:** Captions become unreadable. Viewers register UI clutter, not a clean preview.

**Detection:** Caption band geometry intersects with the platform's known UI region (TikTok lower-third, iOS home-bar safe area, Mac menu region) → FAIL.

**Re-dispatch:** platform-format-agent.

### AP-18: Aspect mismatch

**Shape:** Social surface targeting TikTok with aspect 16:9.

**Why bad:** TikTok requires 9:16. The video gets either letterboxed (looking amateur) or scaled (degrading quality).

**Detection:** Aspect lock ≠ surface's required aspect → FAIL.

**Re-dispatch:** platform-format-agent.

---

## Cross-cutting (4)

### AP-19: Cross-stack contract drift

**Shape:** `brief.md` frontmatter adds a new field but `format-conventions.md` § Frontmatter wasn't updated; `produce-video`'s handoff schema also missed the update.

**Why bad:** Consumers parse the schema. New fields without atomic update break the consumer silently — the new field is ignored or treated as invalid.

**Detection:** Any frontmatter / body-section / handoff column change → verify the cross-stack contract checkpoints in `format-conventions.md` §8.

**Re-dispatch:** orchestrator (process-level fix; not a single-agent issue).

### AP-20: Brand-system absent → token fabrication

**Shape:** `brand_source: cold-start-hint` but the motion spec lists tokens by token name (`color.accent`) as if BRAND.md was loaded.

**Why bad:** Cold-start runs sample from source, not from named tokens. Listing named tokens fabricates a brand system that wasn't supplied.

**Detection:** brand_source is cold-start-hint AND Source Token Inventory contains DESIGN.md-style token names (period-separated paths) → FAIL.

**Re-dispatch:** motion-spec-agent.

### AP-21: Skill-deference miss

**Shape:** Operator asked for a "TikTok video about our new feature." Skill produced an app-preview brief with surface=social, but the intent was angle-driven content (`brief-shortform` territory).

**Why bad:** Wrong skill produced the artifact. App-preview's component-level beats can't capture the algorithmic angle work `brief-shortform` does.

**Detection:** Pre-dispatch should catch this — if the operator's input language emphasizes hook, retention, audio, founder/company persona, and platform mechanics over UI proof, the right skill is `brief-shortform`. Pre-dispatch should defer.

**Re-dispatch:** orchestrator (defer to `brief-shortform` and re-run from there).

### AP-22: Artifact schema drift across runs

**Shape:** A re-run of the same slug produces a `brief.md` with a different section ordering or different frontmatter field set than the prior run.

**Why bad:** Downstream consumers (produce-video, review tooling) match by heading and field. Drift breaks consumers silently.

**Detection:** Frontmatter field order / body section ordering differs from `format-conventions.md` §1 → FAIL.

**Re-dispatch:** orchestrator (process-level fix).

---

## Most common in practice

From observing this pattern across the broader stack:

1. **Whole-screen tours (AP-4) + idle "establishing" beats (AP-7)** — the twin failures of "we don't know what to crop, so we'll show everything."
2. **Captions that pitch the feature (AP-10)** — the most common OST-scan hit.
3. **Synthetic glow / gradient (AP-11)** — the most visible brand-fidelity failure.
4. **Compound actions in one beat (AP-8)** — the most common beat-clarity failure.
5. **App Store length / aspect / performance-claim violations (AP-15, 16, 18)** — the most common platform-fit failures.

Critic agent's order of scoring matches this frequency: Gate 5 (platform fit) is scored first because it's the most likely cause of unshippable briefs.
