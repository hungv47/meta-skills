<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Failure Modes — Visual

Catalog of common failure modes for visual creative. Used by concept-agent (avoid in concepts), brief-synth-agent (note in briefs), and critic-agent (score against).

---

## Generic-AI Aesthetic Patterns (the existential failure modes)

### 1. Default purple-blue gradient

**What it looks like:** Linear or radial gradient from purple (#6B46C1, #8B5CF6) to blue (#3B82F6) to teal/pink. Often used as background. Almost every Stable Diffusion 1.x output had this.

**Why it fails:** Universally signals "AI-generated stock-look." Brand fidelity drops to zero — every brand becomes the same brand.

**Fix:** Use the brand_digest palette anchor. If a gradient is needed, use brand-defined gradients only.

### 2. Centered isolated subject on white

**What it looks like:** Single subject (product, person, object) dead-center on a flat white or barely-textured background. Drop shadow. No environmental context.

**Why it fails:** Stock-photo composition. Pre-AI, this was Getty Images. Post-AI, it's Midjourney's default fallback when prompted vaguely.

**Fix:** Either (a) add environmental context, off-center per rule of thirds, OR (b) commit to flat editorial composition with type as primary element (not subject-on-white).

### 3. Stock 3D bevels / faux-3D

**What it looks like:** Inflated-rubber 3D look — soft beveled edges, glossy plastic surface, "Pixar-but-corporate." The Apple-skeuomorphism revival from ~2022.

**Why it fails:** Trend-chase aesthetic. Will date the asset within 6 months. Reads as derivative.

**Fix:** Flat or subtle dimensional cues (1 elevation max). If the brand archetype is "playful, kinetic," consider editorial 3D photography (Wes Anderson-flat, dioramic) — never inflated-rubber.

### 4. Faux-glass / glassmorphism (uninvited)

**What it looks like:** Frosted-glass panels with backdrop blur, often layered over busy backgrounds. The Apple Vision Pro / iOS aesthetic.

**Why it fails:** Strong style signal. If DESIGN.md doesn't specify glass, using it imports a different brand's identity.

**Fix:** Only use if DESIGN.md explicitly calls for it. Default to opaque surfaces.

### 5. AI-uncanny photo

**What it looks like:** Six-fingered hands, melted text, wax skin, impossible architecture (stairs to nowhere, parallel walls converging), uncanny eyes.

**Why it fails:** Damages credibility. One uncanny detail and the asset reads as "fake" — even if 99% is fine.

**Fix:** Either (a) avoid prompts featuring hands, complex text, full faces unless the model handles them well (Imagen 3 > Midjourney > DALL·E for hands), OR (b) use post-processing to fix or crop out problem areas.

### 6. "Hyperrealistic 4k 8k masterpiece" prompt language

**What it looks like:** The prompt itself contains "ultra detailed, 4k, 8k, hyperrealistic, masterpiece, trending on artstation, breathtaking, award winning."

**Why it fails:** These tokens are the AI-stock-prompt fingerprint. Models trained on tagged datasets associate them with the most generic outputs in their training set.

**Fix:** Specific lens, light, era, mood, composition. Prompt-craft-agent enforces this.

### 7. Flat-illustration "Corporate Memphis"

**What it looks like:** Cartoony characters with disproportionate limbs, simplified geometric shapes, pastel palette, the "Alegria" style popularized by Facebook / Slack / Notion ~2018-2021.

**Why it fails:** Was once a brand voice, now a no-voice. Every B2B SaaS used it. The aesthetic became invisible.

**Fix:** Either (a) commit to a distinctive illustration style with clear personality (editorial line work, painterly, riso-print), OR (b) use photography or typography instead.

### 8. Default-app icon look

**What it looks like:** Rounded-square gradient + single centered glyph. Looks like every iOS app icon ever.

**Why it fails:** No brand specificity.

**Fix:** Brand-specific shape language from DESIGN.md.

---

## Brand-Drift Patterns

### B1. Token approximation

**What it looks like:** Using #006633 when DESIGN.md says #004700. Using a font that's "close to" Geist Sans.

**Why it fails:** Tokens are the brand. Approximation drifts the system over time across many assets.

**Fix:** uses tokens by name. Use the exact hex. If a font isn't available, halt and flag — don't substitute.

### B2. Sacred element creep

**What it looks like:** Logo at 48px instead of mandated 60px. Tagline reworded from "Waiting is a trap. Move forward." to "Stop waiting. Start moving." for a "punchier" ad.

**Why it fails:** Sacred elements are the brand's spine. Drift compounds; in 12 months you have 12 different taglines.

**Fix:** Brand-anchor-agent surfaces sacred elements; critic-agent gates on them at 4/4.

### B3. Voice violation in copy

**What it looks like:** "Leverage powerful tools to seamlessly unlock your potential." For a brand whose BRAND.md forbids leverage / powerful / seamlessly / unlock.

**Why it fails:** Same as B1 but in language. The asset reads as a different brand.

**Fix:** Copy-anchor-agent runs voice-compliance check; critic agent re-verifies.

### B4. Aesthetic genre drift

**What it looks like:** Brand archetype is "restrained editorial." Asset is glassmorphic neon-cyber.

**Why it fails:** The asset is at war with the brand system.

**Fix:** Concept-agent must respect archetype. Critic-agent flags archetype mismatch.

---

## Accessibility Failure Modes

### A1. Insufficient contrast

**What it looks like:** Body text at #74B36B on #FAFAFA — 2.4:1 contrast. Fails WCAG AA (need ≥4.5:1).

**Why it fails:** Unreadable for low-vision users; legally exposes the brand in some jurisdictions.

**Fix:** Critic-agent calculates contrast on actual text/bg pair. Spec uses contrast pairs from DESIGN.md.

### A2. Text in images without alt

**What it looks like:** Critical CTA text rendered as part of the image. No alt text spec'd in the brief.

**Why it fails:** Screen readers skip it. Email clients block the image. Search indexing misses it.

**Fix:** Brief includes alt text spec for any text-in-image. Email designs always have an HTML/text fallback.

### A3. Color-only signaling

**What it looks like:** "Click the green button." Red error / green success with no icon or label.

**Why it fails:** Colorblind users miss the signal entirely.

**Fix:** Color + icon + label combination for any state signaling.

---

## Format Failure Modes

### F1. Unsafe-zone violations

**What it looks like:** Critical CTA in the bottom 250px of an Instagram Story (covered by UI). Logo in the top-right that gets cropped by LinkedIn's profile-pic overlay.

**Why it fails:** Content gets clipped or covered by platform UI.

**Fix:** Asset-types.md has safe zones per platform. Brief and critic both check.

### F2. Wrong aspect for crop behavior

**What it looks like:** Designing a 16:9 banner for Instagram feed (auto-crops to 4:5 in some surfaces, losing left/right content).

**Why it fails:** Asset gets re-cropped by the platform; intended composition lost.

**Fix:** Design at the platform's primary in-feed aspect, even if the upload spec accepts wider.

### F3. File-size cap blown

**What it looks like:** 2 MB OG image. Twitter cuts the share-card preview off because file > 500 KB.

**Why it fails:** Asset not delivered to viewer. Worst-case failure.

**Fix:** Asset-types.md lists caps. Render-time compression to fit.

### F4. Color profile mismatch

**What it looks like:** DCI-P3 image displayed on sRGB-only browser; oversaturated colors.

**Why it fails:** Asset doesn't look as designed on the majority of devices.

**Fix:** sRGB unless brand explicitly uses wider gamut.

### F5. Print at 72dpi

**What it looks like:** Sending a 1080x1080 px Instagram post to a billboard printer.

**Why it fails:** Massively pixelated at print scale.

**Fix:** 300dpi minimum for print. Re-render at print spec; never up-res screen assets.

---

## Composition Failure Modes

### C1. No focal point

**What it looks like:** Multiple equal-weight elements competing for attention. Eye doesn't know where to land.

**Why it fails:** Message lost in 1-second preview scan.

**Fix:** Brief specifies focal point + supporting + tertiary hierarchy.

### C2. Crowded edges

**What it looks like:** Text or critical elements pushed against the frame edge.

**Why it fails:** Reads as cramped; risks crop-off on platforms.

**Fix:** Safe zone padding from asset-types.md.

### C3. Symmetric-but-dead

**What it looks like:** Perfect dead-center symmetric layout with no rhythm.

**Why it fails:** Reads as a template; no kinetic energy.

**Fix:** Asymmetric balance via rule of thirds, golden ratio, or intentional weight imbalance with negative space.

### C4. Type at base size everywhere

**What it looks like:** All text at 18px. No hierarchy.

**Why it fails:** Eye can't distinguish headline from body from caption.

**Fix:** DESIGN.md type scale; brief specifies which slot uses which token.

---

## How critic-agent uses this catalog

For each item above, critic-agent scores 0–3 in the corresponding rubric dimension (or generic-AI section). Multiple low scores compound to FAIL. Single 0/3 in a sacred dimension (brand fidelity, sacred elements) is automatic FAIL on cycle 1.
