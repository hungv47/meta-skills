# Polish Chain

Language polish routing matrix. Applied as Layer 2 post-critic step — runs vn-tone or humanmaxxing on the spoken-line section based on (market, brand_mode).

---

## Routing Matrix

| Market | Brand mode | Polish chain | Scope |
|---|---|---|---|
| VN | founder | `polish-vn` | spoken-line section + full body |
| VN | company | `polish-vn` | full body |
| EN | founder | `humanmaxxing` | spoken-line section |
| EN | company | none | n/a — default brand voice |
| Other | any | flag `polish-chain-extension-needed` | n/a |

---

## What Counts as "Spoken-Line Section"

The polish chain applies to text that will be heard or read aloud:

- **Hook verbal line** (from hook-agent's recommended variation)
- **VO direction copy** if the brief specifies VO
- **On-camera lines** in the storyboard (where the talent speaks)
- **NOT the on-screen text overlay** (that's typographic, not spoken)
- **NOT the caption** (that's read silently — different polish discipline)

---

## How the Polish Chain Runs

After critic-agent PASSes the brief:

1. Orchestrator extracts the spoken-line section content
2. Invokes the relevant polish skill (`polish-vn` or `humanmaxxing`) on that content
3. Replaces the spoken-line section in the brief with the polished version
4. Brief is delivered with `polish_chain_applied: [vn-tone | humanmaxxing | none]` in frontmatter

The polish chain does NOT re-dispatch craft agents. It's a finishing pass over already-PASSed content.

---

## Why Polish Routing Matters for Founder Mode

EN founder VO scripts that read AI-cadenced are the most common failure mode for short-form briefs. Standard symptoms:
- Em-dashes where humans use commas or periods
- Tricolons ("not just X, but Y, and Z") in casual speech
- Over-balanced sentences
- "It's not X — it's Y" formula
- Smart-quotes inserted by tooling

`humanmaxxing` strips these patterns specifically for the spoken-line section. The brief's caption and other text can stay in default voice; only the spoken layer needs the polish.

---

## VN-Specific Notes

VN polish is more invasive because direct EN→VN translation produces:
- Pronoun drift ("bạn" vs. "anh/chị" vs. "mình" — must lock per piece)
- Missing particles ("ạ", "nhé", "đấy" — register-specific)
- Literal idioms (English idioms translated word-for-word)
- Passive-voice calques ("được" overused)
- Corporate translationese

`polish-vn` polishes for the target register specified in `voc-extraction-agent`'s output: `casual / pro / bro / báo chí / semi-casual / pop-marketing`.

For VN founder mode, the entire body often benefits from polish (hook + storyboard spoken lines + caption). For VN company mode, the body suffices (caption + on-screen text).

---

## Extension Path

For markets not in the matrix (e.g., Japanese, Indonesian, Spanish):

1. Identify a polish skill if one exists for that language/register
2. Add to the routing matrix
3. Document the spoken-line scope and any market-specific failure modes

Until then, briefs flagged `polish-chain-extension-needed` ship without polish — a known limitation surfaced in `done_with_concerns`.

---

## Anti-Patterns

- **Skipping polish on EN founder mode.** Spoken VO often reads AI-cadenced; this is the highest-leverage polish step in the entire pipeline.
- **Running polish before critic-agent PASS.** Polish on broken content amplifies broken content.
- **Polishing the caption when polish chain is "spoken-line section."** Caption has its own discipline; over-polish makes it sound spoken when it should read.
- **Forgetting to flag `polish-chain-extension-needed`** for non-VN/EN markets. Producer needs to know the brief shipped without polish.
