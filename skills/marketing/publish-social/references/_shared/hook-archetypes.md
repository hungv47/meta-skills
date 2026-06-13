<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: shared-reference
schema_version: 1
last_verified: 2026-06-12
verifier: internal
status: stable
---

# Hook Archetypes

Hook patterns for short-form video. Six base archetypes (mined from deleted content-create + Hook Writing Framework). Hook agent picks 3 from research catalog's per-platform menu.

<!-- lint:reference-ok describes how consumers cite this file, not literal paths from here -->
> Promoted from `brief-shortform/references/` to the canonical layer (audit wave 2, 2026-06-12): every `references/platform-intelligence/*.md` file cites these six base archetypes via `../hook-archetypes.md`, so the content is cross-stack, not skill-local. Consumers (including `brief-shortform`) receive it as `references/_shared/hook-archetypes.md` via `sync-skill-support`.

---

## Six Base Archetypes

| Archetype | Definition | Identifying signal | Best for |
|---|---|---|---|
| **Credential flash** | Speaker establishes credential in 0–1.5s | "After 3 years of…" / "I run [thing]" / "We built [thing]" | Founder mode, B2B, thought leadership |
| **Pattern interrupt** | Visual or verbal disruption — unexpected cut, sudden action | Cut-on-action 0-1s, verbal "wait, what?" / "stop" | TikTok, attention-economy niches |
| **Question hook** | Direct question to viewer in first frame | "What if your [thing] was…" / "Have you ever…" | Problem-aware audience |
| **Pre-reveal tease** | Promise without delivering yet | "I'll show you in a sec, but first…" / curtain-up framing | How-to / tutorial |
| **Contrarian claim** | Provocative inversion of common wisdom | "Stop doing X" / "X is killing your Y" | Hot takes, founder commentary |
| **Data point** | Surprising statistic in opening | "70% of teams…" / "I made $X in Y days" | Data-driven audiences, B2B |

---

## Video-Specific Adaptations

Short-form video hooks differ from text hooks because the triad (visual + verbal + text) hits in the opening second. Each archetype above adapts:

### Credential flash (video)
- **Visual:** MCU eye-level, speaker turning to camera mid-action
- **Verbal:** "After [N years/months] of [activity]…"
- **Text overlay:** ≤5 words, often the punchline ("POV: Standups deleted")
- **Audio:** VO + sub-music drops at 0:00

### Pattern interrupt (video)
- **Visual:** Hard cut at 0:01-0:02, framing change (ECU → MCU or vice-versa)
- **Verbal:** "Wait —" / "Stop." / "Don't —"
- **Text overlay:** Single bold word ("STOP") or short imperative
- **Audio:** Beat hit on the cut

### Question hook (video)
- **Visual:** MCU eye-level, direct address
- **Verbal:** Question in ≤8 words, answered later in video
- **Text overlay:** Mirror the question in 3-5 words
- **Audio:** Light-touch — VO carries

### Pre-reveal tease (video)
- **Visual:** Close-up on the unseen result (covered, blurred, cropped)
- **Verbal:** "I'll show you, but first…"
- **Text overlay:** Tease text ("Wait for it" / "0:18")
- **Audio:** Curiosity-build music swell

### Contrarian claim (video)
- **Visual:** MCU eye-level OR ECU pointed object (the thing being inverted)
- **Verbal:** "Stop [common advice]" / "[Common wisdom] is wrong"
- **Text overlay:** The inversion as bold statement
- **Audio:** Confident tone, music drop

### Data point (video)
- **Visual:** Number on screen at 0:00 (large, animated stamp)
- **Verbal:** "[Number] [unit] [audience] [surprising fact]"
- **Text overlay:** The number, oversized
- **Audio:** Sharp beat hit on the number

---

## 3Q Test (run on every variation)

1. **Visual?** Can the reader picture it? (Specific frame description = pass)
2. **Falsifiable?** Is it true or false? (Specific claim = pass; vague generality = fail)
3. **Uniquely ours?** Could a competitor say the same thing? (No = pass; yes = fail)

All 3 pass = keep. Any fail = rewrite.

---

## Hook Window Targets (per platform — from research catalog)

| Platform | Hook window | Implication for triad |
|---|---|---|
| TikTok | 1-2s | Triad hits in opening second; pattern interrupt at 0:03 |
| Reels | 3s drop-off zone | Triad must escalate through 0:03, not just hit at 0:00 |
| Shorts | swipe-decision in 1-2s | Loop tease in opening visual to enable replay-rate signal |
| X video | 3-5s | Slightly more breathing room; tweet text continues hook |
| LinkedIn | 3s (65% retention determinacy) | Professional pacing; hook can be thoughtful, not punchy |

---

## Anti-Patterns (any of these = auto-FAIL on hook critic)

- **AI slop openers:** "Hey guys", "In today's world", "Are you tired of", "Today I want to talk about", "Let me tell you", "Have you been struggling with"
- **Generic hooks:** "Strong hook here", "Compelling opener about X" (placeholder)
- **Triad without alignment:** visual is product UI, verbal is founder credential, text is generic question — they don't reinforce
- **Burying the lead:** "First, let me tell you a story…" — viewers swipe before the hook lands
- **Single-archetype variations:** all 3 hooks using the same archetype defeats the alternatives' purpose

---

## Worked example (TikTok founder mode)

Recommended (Credential flash):
- Visual: MCU eye-level, speaker turns from monitor to camera at 0:01, kitchen-lit office
- Verbal: "After 3 years of remote standups…"
- Text overlay: "POV: Standups deleted. Output ↑"
- Audio: Original VO + sub-music drop 0:00
- Archetype: Credential flash (8/12 in TikTok sample for this niche)
- 3Q: V✓ F✓ U✓
- VoC anchor: "Standup is theater, not signal"

Alternative A (Pattern interrupt):
- Visual: ECU on phone alarm 0:00, jump-cut to MCU speaker at 0:02
- Verbal: "Wait — your standup is at 9 AM?"
- Text overlay: "STOP."
- Audio: Beat hit on jump-cut
- Archetype: Pattern interrupt (5/12 in TikTok sample)
- 3Q: V✓ F✓ U✓
- VoC anchor: "I dread Mondays"

Alternative B (Contrarian claim):
- Visual: MCU eye-level, speaker pointing at imaginary calendar
- Verbal: "Stop running standups."
- Text overlay: "Standup is theater."
- Audio: Confident tone, music drop
- Archetype: Contrarian claim (4/12 in TikTok sample)
- 3Q: V✓ F✓ U✓
- VoC anchor: "Standup is theater, not signal"
