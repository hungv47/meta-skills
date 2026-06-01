<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: Brand-System Anti-Patterns
lifecycle: canonical
status: stable
produced_by: brand-system
load_class: ANTI-PATTERN
---

# Brand-System Anti-Patterns

> Re-read before any artifact ships. 21 patterns total — organized as: 13 brand-system pipeline patterns (Section 1), 4 cross-cutting marketing-stack patterns (Section 2), 2 narrative-tension patterns (Section 3), and 2 brand-kit board patterns (Section 4). Ownership column cites which agent's checklist catches it (named criteria from `agents/critic-agent.md` — no integer "Gate N" references because the critic uses criterion names, not numbers).

## Section 1 — Brand-system pipeline patterns (13)

### 1. Aesthetics without strategy

**Pattern:** Picking colors or fonts because they "look nice" without tracing back to archetype and positioning. Visual choices have no strategy justification in the change log.

**Why it fails:** Brand systems work because every visible decision is a deliberate consequence of who the brand is for. Untraceable aesthetic choices fragment the brand identity — six months later nobody remembers why the primary is teal, and the next person reaches for "let's update it."

**Instead:** Every visual choice traces to archetype + positioning in BRAND.md. Visual-agent runs parallel with strategy-agent so the visual decision is already grounded in the brand brief. Critic-agent enforces this via the "Strategy-to-visual traceability" dimension in the Scoring Rubric (FAIL when visual choices have no strategy justification).

**Owned by:** Visual-agent (self-check) + Critic-agent ("Strategy-to-visual traceability" dimension, 1-5 score; threshold ≥3.5 average).

---

### 2. Generic values

**Pattern:** Values like "Innovation, quality, integrity" listed without tradeoffs. They guide nothing because every competitor could claim the same.

**Why it fails:** Values are decision-tools. A value that has no opposite isn't a value — it's a platitude. When two product decisions conflict (ship-fast vs ship-polished), generic values don't break the tie.

**Instead:** Use "X over Y" format where Y is a legitimate alternative someone else would optimize for: "transparency over comfort," "speed over polish," "depth over breadth." Each value's opposite must be a legitimate alternative.

**Owned by:** Strategy-agent (self-check) + Critic-agent ("Values have real tradeoffs" criterion in BRAND.md Quality Gate Checklist — FAIL if values are generic).

---

### 3. Archetype confusion

**Pattern:** Selecting contradictory archetypes (Outlaw + Ruler, Hero + Innocent, Caregiver + Outlaw). Primary and secondary fight each other.

**Why it fails:** Archetype is a coherence tool. Contradictory archetypes produce visually + verbally contradictory output downstream (e.g., Caregiver primary with aggressive sharp-radius typography). The 70/30 blend should ADD nuance, not contradict.

**Instead:** Primary and secondary should complement each other. The secondary adds nuance: Caregiver (70%) + Explorer (30%) = warm support with new-horizons flavor. Caregiver + Outlaw doesn't work — they want opposite outcomes.

**Owned by:** Personality-agent (self-check) + Critic-agent ("Archetype consistency" Scoring Rubric dimension — FAIL when archetype contradicted by visual/verbal choices).

---

### 4. Voice without examples

**Pattern:** "We're friendly" listed as voice attribute without a concrete Do/Don't example from a real brand context. Empty adjectives.

**Why it fails:** Copywriters consume BRAND.md voice. Without examples they default to their own interpretation of "friendly" — which never matches what the brand strategist meant. The downstream cost is rewrite cycles forever.

**Instead:** Every voice attribute has Do/Don't examples using real brand contexts (error messages, success messages, marketing headlines, support replies). Missing examples = critic FAIL.

**Owned by:** Voice-agent (self-check) + Critic-agent ("Voice attributes are actionable" criterion in BRAND.md Quality Gate Checklist — FAIL when missing examples).

---

### 5. Token soup

**Pattern:** Creating 40+ semantic tokens when ~20 covers an entire component library. Tokens like `--subtle-muted-foreground-alt` proliferating.

**Why it fails:** A token system becomes unmaintainable past a certain size. Engineers can't remember which token to reach for; designs drift because two near-identical tokens exist for the same use. The 3-layer architecture (primitive → semantic → component) breaks down when the semantic layer is too granular.

**Instead:** Keep the semantic layer tight (~17-20 tokens). If inventing `--subtle-muted-foreground-alt`, the system is too granular. Add component tokens for genuine specialization, not semantic tokens.

**Owned by:** Token-architect-agent (self-check) + Critic-agent ("Token system correctness" Scoring Rubric dimension — FAIL on convention violations).

---

### 6. Skipping semantic layer

**Pattern:** Components reference primitives directly (`oklch(0.546 0.214 259)` or `--primary-500`) instead of semantic tokens (`var(--primary)`).

**Why it fails:** Defeats the whole point of the three-layer system. Theme swaps (light → dark, white-label re-skin) become find-and-replace nightmares because primitive references don't update.

**Instead:** Always reference semantic tokens. The chain is Primitive → Semantic → Component. Components ONLY consume semantic tokens; semantic tokens ONLY consume primitives.

**Owned by:** Component-token-agent (self-check) + Critic-agent ("Token correctness" criterion in DESIGN.md Quality Gate Checklist).

---

### 7. Mismatched bg/fg pairs

**Pattern:** `bg-primary text-primary` instead of `bg-primary text-primary-foreground`. Engineers reach for the obvious-looking name and ship contrast failures.

**Why it fails:** The bg/fg pair convention exists precisely so contrast is correct by default. Breaking it makes every component a contrast-audit liability.

**Instead:** Every semantic color role is a pair. Base = background. `-foreground` = text on that surface. `--primary` + `--primary-foreground`, `--card` + `--card-foreground`, `--popover` + `--popover-foreground`.

**Owned by:** Token-architect-agent (self-check) + Accessibility-agent + Critic-agent ("Bg/fg convention used consistently" criterion in DESIGN.md Quality Gate Checklist).

---

### 8. Dark mode as inversion

**Pattern:** Producing dark mode by swapping black/white, inverting lightness on primitives. Unusable surface hierarchy results.

**Why it fails:** True dark mode is a deliberate redesign: surface hierarchy uses near-blacks not pure black, primary lightness shifts up (teal-600 → teal-400) to maintain perceived brightness, saturation reduces, shadows become inset glows. Mechanical inversion produces hostile screens.

**Instead:** Deliberate surface hierarchy (background → card → popover, each step lighter on dark, darker on light). Reduced saturation in dark mode. Shifted primary lightness for contrast against dark backgrounds.

**Owned by:** Token-architect-agent + Accessibility-agent + Critic-agent ("Complete color palette tables per theme" + "All semantic tokens have values for every theme" criteria in DESIGN.md Quality Gate Checklist).

---

### 9. Dispatching all agents for Quick Brand

**Pattern:** Running Route A (Quick Brand for MVP) but dispatching all 8 agents anyway because "more is better." Defeats the purpose of Route A.

**Why it fails:** Route A exists for MVPs — fast brand foundation that can ship in 30 minutes, not 3 hours. Adding archetype + voice + tokens + components + accessibility + critic full-mode makes Route A indistinguishable from Route B, while still missing the DESIGN.md output that justifies the full pipeline.

**Instead:** Quick Brand uses only strategy + visual (color + typography only, logo deferred) + critic (coherence check on strategy-to-visual only). No archetype analysis, no tokens, no components, no accessibility audit, no ASSETS.md, no Visual Renderings.

**Owned by:** Orchestrator (Route Selection step — confirms Route A scope at Pre-Dispatch resolution before dispatching Layer 1).

---

### 10. Inventing ASSETS.md rows

**Pattern:** Adding checklist rows for assets not traceable to BRAND.md / DESIGN.md / `platform-surfaces.md`. "We'll need a holiday logo variant" added to inventory without spec.

**Why it fails:** ASSETS.md is a derived projection, not a creative brief. Inventing rows turns the inventory into a wishlist; the auto-scan starts showing false-`[ ]` (item not produced because there's no spec); the team chases ghost requirements.

**Instead:** Every row cites its spec (BRAND.md §N / DESIGN.md §N / platform-surfaces.md §N). If you can't point to the spec, the asset doesn't belong in the inventory. To add inventory items, FIRST add the spec to BRAND.md / DESIGN.md.

**Owned by:** Orchestrator (Step 8.5 substep 2 + 4 + self-check substep "No invented rows" — every row traces to `references/assets-inventory.md` templates) + Critic-agent ("No invented assets — every row traces to upstream spec" criterion in ASSETS.md Quality Gate Checklist).

---

### 11. Overwriting human `[~]` or `[!]` markers in ASSETS.md

**Pattern:** Re-running brand-system, and the auto-scan resets in-progress + blocked rows to `[ ]` (because no file exists yet). Human-owned status erased.

**Why it fails:** `[~]` (in progress) and `[!]` (blocked) markers are how the team tracks WORK STATE — that someone is actively producing this asset, or that it's waiting on an external dependency. Erasing them on re-run loses real coordination data.

**Instead:** Auto-scan ONLY flips `[ ]` ↔ `[x]` based on file existence. `[~]` and `[!]` are human-owned and preserved verbatim across re-runs. Step 8.5 substep 4 ("Merge human markers") overlays preserved markers onto fresh inventory AFTER the auto-scan.

**Owned by:** Orchestrator (Step 8.5 substep 1 — load prior state + substep 4 — merge human markers) + Critic-agent ("Prior `[~]` and `[!]` markers preserved from previous run" criterion in ASSETS.md Quality Gate Checklist).

---

### 12. Silently dropping ASSETS.md rows when a platform is un-declared

**Pattern:** User removes "Android" from Pre-Dispatch Q6 on re-run. Step 8.5 silently deletes all Android rows from ASSETS.md. Tracking state lost.

**Why it fails:** Maybe the team built Android assets that are still useful for partner / port distribution. Maybe "removed" was a typo. Silent deletion is destructive and irreversible.

**Instead:** Dropped-platform rows move to `## Orphaned (platform no longer declared)` on emit. User can review before losing status. If genuinely dropped, the user deletes the Orphaned block on the next run. If re-added, the rows return to the active platform block.

**Owned by:** Orchestrator (Step 8.5 substep 1 — load prior state + note dropped platforms + write Orphaned block in substep 6).

---

### 13. Round-tripping Claude Design exports into `brand/`

**Pattern:** Claude Design produces interactive prototypes, slides, one-pagers, HTML/PPTX/Canva exports. User saves them into `brand/BRAND.md` / `brand/DESIGN.md` / `brand/ASSETS.md`. Spec corrupted.

**Why it fails:** Claude Design output is **derivative presentation**, not source of truth. It re-renders from the source spec on each visit. Saving renderings INTO the source means: (a) spec now contains both spec content + presentation content (mixed registers); (b) next re-render produces stale output because Claude Design re-reads the corrupted source; (c) versioning breaks because spec changes are interleaved with rendering changes.

**Instead:** Claude Design exports go to a separate location (`presentations/`, a Claude Design folder, a Canva account). To update the spec, re-run brand-system. Claude Design re-renders from the updated source on the next session.

**Owned by:** Orchestrator (Step 9b handoff message explicitly warns + Step 9 framing — "The spec is canonical. Renderings are derivative.").

---

## Section 2 — Cross-cutting marketing-stack patterns (4)

### 14. Upstream context skipped — generic archetype output

**Pattern:** User invokes brand-system directly without running `research-icp` first. No audience data exists. Strategy-agent defaults to generic archetype + values + voice ("we serve customers who value quality and innovation").

**Why it fails:** Brand without audience research → generic archetypes. The output looks brand-shaped but says nothing specific because nothing specific was input. Six months later the team realizes the brand doesn't differentiate, and every downstream skill (copywriting, ad-copy, design-brief) inherits the genericness.

**Instead:** Pre-Dispatch flags missing `research/product-context.md` + missing `research/icp-research.md` and STRONGLY recommends running `research-icp` first. If user proceeds anyway (e.g., greenfield with no customers yet), the Pre-Dispatch Cold Start gathers product + audience + competitive data inline; critic still scores against the same rubric.

**Owned by:** Orchestrator (Pre-Dispatch hard-recommendation when both research artifacts absent) + Critical Gate 4 (stale upstream data >30 days → recommend re-running `research-icp`).

---

### 15. Cross-stack contract drift

**Pattern:** Downstream skill (copywriting, ad-copy, design-brief) updates its expected BRAND.md / DESIGN.md schema in isolation without updating brand-system's frontmatter or section structure. Two versions of "what BRAND.md contains" exist in the codebase.

**Why it fails:** Schema drift produces silent breakage — downstream skill consumes a field that no longer exists, or misses a field that was renamed. Symptoms appear weeks later when "the voice in this campaign doesn't match the brand book" or "the design-brief is producing components that don't exist in DESIGN.md."

**Instead:** Schema changes require atomic update of `format-conventions.md` + brand-system SKILL.md Artifact Templates + every downstream caller that reads the changed field. brand-system playbook lists current downstream callers (10 skills). Bump brand-system `version` major when the schema changes.

**Owned by:** Operator (during refactor + new-feature work) + brand-system playbook §"Cross-stack contract" listing.

---

### 16. Polish-chain misroute

**Pattern:** User invokes `humanmaxxing` or `polish-vn` on BRAND.md output ("make the voice section sound less AI-written"). Polish chain runs on what is supposed to be the canonical voice definition.

**Why it fails:** brand-system OUTPUT defines voice; humanmaxxing/vn-tone INPUT consumes voice. Running humanmaxxing on the voice definition itself recursively redefines what "voice" means. The downstream caller (copywriting) then reads a polished version of "what should be unpolished spec."

**Instead:** humanmaxxing and vn-tone run on **content** that REFERENCES brand-system voice (blog posts, ad copy, cold-outreach emails). They do NOT run on BRAND.md itself. If BRAND.md voice section reads "AI-written," re-dispatch voice-agent with feedback in cycle 2 of the critic gate — don't post-process the spec.

**Owned by:** Orchestrator (chain position note — brand-system is upstream of humanmaxxing/vn-tone, not a peer) + critic-agent ("No copywriting scope creep" criterion catches blog-post-style prose in BRAND.md).

---

### 17. Undeclared platforms padded

**Pattern:** User declares "iOS + web" at Pre-Dispatch Q6. Strategy-agent or visual-agent pads BRAND.md / DESIGN.md / ASSETS.md with Android + Windows + watchOS subsections "because most apps have them."

**Why it fails:** Three-way platform-set equivalence (declared platforms ≡ BRAND.md Digital Touchpoints platforms ≡ DESIGN.md Platform Icon Specifications platforms ≡ ASSETS.md platform blocks) breaks. Critic-agent FAILs the cross-file coherence check. ASSETS.md auto-scan produces dozens of false-`[ ]` rows the team chases as "missing work."

**Instead:** Declared platforms are the SINGLE source of truth. Strategy-agent + visual-agent + Step 8.5 all gate on the same list. Undeclared platforms MUST NOT appear in any file. If the user is unsure, Pre-Dispatch disambiguation rules force enumeration ("mobile app" → iOS, Android, or both? "desktop app" → native or Electron? cross-platform shell → enumerate host OSes).

**Owned by:** Orchestrator (Pre-Dispatch Q6 disambiguation + Context to Pass to All Agents block) + Critic-agent ("ASSETS.md platform blocks === BRAND.md Digital Touchpoints platforms === DESIGN.md Platform Icon Specifications platforms (same set, same order)" criterion in cross-file Quality Gate Checklist).

---

---

## Section 3 — Narrative-tension patterns (2)

### 18. Persona the operator cannot sustain

**Pattern:** BRAND.md promises a public register — "ships in public weekly," "always-on community engagement," "contrarian takes daily" — that the actual operator(s) cannot sustain at the brand's stated cadence for years. Within 12 months the brand quietly stops doing the thing it promised.

**Why it fails:** A brand built on a persona that the team cannot perform decays into either silence (the promise stops being met) or burnout (the team meets the promise at unsustainable personal cost). Both outcomes erode trust faster than under-promising would have. The audience can verify cadence — quarterly posts vs. promised weekly posts is visible from the outside.

**Instead:** Strategy-agent runs the Tension 2 check (`references/narrative-tension.md` § Public persona sustainability) before committing the brand to any cadence-bound persona. Name the operator and the cadence in the Change Log: `Persona: creator-led, founder-driven, monthly newsletter + day-of support — operator-confirmed.` Narrow the promise to what the operator's track record supports.

**Owned by:** Strategy-agent (Narrative Tension Ownership domain instruction + Self-Check) + Critic-agent (NT-Q1 FAIL gate — "Does the brand demand a persona the operator cannot sustain?" — re-dispatches strategy-agent + voice-agent if needed).

---

### 19. Retrofitted hero's journey

**Pattern:** Personality-agent or strategy-agent imports an adversity arc the brief doesn't actually support — "we almost went broke," "the founder rebuilt from zero," "tough times taught us resilience" — because founder-origin stories sell. The struggle is hand-wavy, undated, and disconnected from what the brand currently does differently.

**Why it fails:** Audiences detect costume-drama adversity within two paragraphs. The brand burns trust on first contact because the manufactured arc reads as marketing artifact, not lived experience. A brand can be excellent without trauma — the retrofit makes it less credible, not more. Worse, retrofitted struggle often *also* exploits audience pain (NT-Q4 collision), styling the audience's challenges as the operator's voice.

**Instead:** Personality-agent applies Tension 3 (`references/narrative-tension.md` § Progress through struggle — when true) **only when the brief contains a specific, dated, owned arc**. If the brief doesn't contain such an arc, the brand's character is written without one. The Change Log explicitly states `Struggle arc: not applicable — brand earns trust through [capability / track record / credentials], not adversity rhetoric.`

**Owned by:** Personality-agent (Narrative Tension Ownership domain instruction + Self-Check) + Critic-agent (NT-Q4 FAIL gate — "Is the narrative exploiting pain instead of earning trust?" — re-dispatches personality-agent and strategy-agent when Origin Story is the offender).

---

## Section 4 — Brand-kit board patterns (2)

### 20. Brand decisions invented at the board layer

**Pattern:** Visual-agent producing a Step 9d brand-kit board introduces a *new* color, font, accent, or logo variant that doesn't exist in `brand/DESIGN.md` or `brand/BRAND.md` because "it looks better on the board." The board becomes a parallel source of truth; downstream renders use board-only values that won't appear in production.

**Why it fails:** Brand-kit boards are derivative artifacts (see anti-pattern #13 for the related Claude Design version). When a board introduces brand decisions, the spec stops being canonical — re-running brand-system regenerates DESIGN.md without the board-only choices, then the next board contradicts the previous one. The team ends up with two divergent palettes / type stacks, and nobody is sure which is real.

**Instead:** Every color, font, and logo treatment in the board traces to an existing BRAND.md / DESIGN.md section. If a panel needs a value that's not in DESIGN.md, route the gap *back* to visual-agent's primary Layer-1 output — update DESIGN.md FIRST, then re-spec the board against the updated source. Boards live under `brand/artboards/`, never inside `brand/BRAND.md` or `brand/DESIGN.md`.

**Owned by:** Visual-agent (Domain Instructions § Brand-Kit Board Output + Self-Check "No new brand decisions in the board") + Critic-agent (BK-G1 FAIL gate — re-dispatches visual-agent to update DESIGN.md before re-spec'ing the board).

---

### 21. Generic AI-glow palette default

**Pattern:** Brand-kit board reaches for a purple-blue gradient ("AI glow") in panel backgrounds, logo treatment, atmospheric panels — because the product is "tech" or "AI" — without the strategy actually demanding it. The board becomes indistinguishable from every other AI-product brand deck.

**Why it fails:** Purple-blue gradient is the single most over-used visual signal for "AI / tech / futuristic" and has fully saturated as a trope. Boards using it without strategic justification telegraph "we let the tool default decide our brand's aesthetic." Audiences (and investors, hiring candidates, design-aware customers) read the cliché immediately — the brand reads less premium for using it, not more.

**Instead:** Visual mode is selected from the 8-mode menu in `references/brand-kit-rendering.md` based on **archetype + product category**. The Voice mode is the only one where purple-blue lilac glow has a defensible home (Voice AI + Caregiver/Sage/Lover archetypes). Every other mode uses its declared palette posture. Critic-agent BK-G4 FAILs purple-blue gradient applied without justification in any panel.

**Owned by:** Visual-agent (Domain Instructions § Brand-Kit Board Output + Self-Check "No purple-blue AI-glow unless strategy demands it") + Critic-agent (BK-G4 FAIL gate) + `references/ai-slop-detection.md` (canonical slop checklist already names this as a top slop signal).

---

## Cross-references

- For agent-side gate ownership: see `agents/critic-agent.md` (13 BRAND.md gates + 6 narrative-tension gates + 13 DESIGN.md gates + 9 brand-kit board gates + 4 cross-file gates + 6-row Cross-Element Coherence Matrix + 7-dimension Scoring Rubric + Rewrite Routing table — all use criterion names, not integer "Gate N" references).
- For procedural correctness: see `procedures/dispatch-mechanics.md` (Step 8.5 substep semantics catch patterns 10-12) and `procedures/pre-dispatch.md` (Q6 disambiguation catches pattern 17).
- For format-side correctness: see `format-conventions.md` (Lexicon Rules + Font Loading & Licensing + Forbidden Icons block requirements catch upstream agent misses).
- For narrative-tension framework: see `references/narrative-tension.md` (5 dimensions + 4 critic questions — owns patterns 18-19).
- For brand-kit board framework: see `references/brand-kit-rendering.md` (one-board visual argument + 5 logo methods + 8 visual modes + 10 board anti-patterns including the canonical version of patterns 20-21).
