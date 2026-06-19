---
type: rubric
skill: write-launch
version: "0.1"
date: 2026-06-19
status: active
---

# Launch Copy Critic Rubric

5 dimensions × 0–10 = 50 total.
**Pass threshold:** ≥ 35 AND no individual dimension scores 0.
**Done with concerns:** 25–34 OR any individual dimension below 4.
**Fail:** < 25.

Each dimension is falsifiable. "Is the tagline good?" is not a threshold. "Does the tagline match a Tier-1 launch angle from the pack §1 and parse as '[category] for [audience]' in ≤60 chars?" is.

A **§4 hard-guard breach** (vote-ask anywhere, undisclosed founder on Reddit, cold link-drop, sub-rule breach) forces **Dimension 2 to 0** — a launch that breaks the platform's rules is not shippable on craft alone.

---

## Dimension 1 — Angle Fit / Clarity (0–10)

Scored against `references/_shared/platform-intelligence/[channel].md` §1 Launch Angles.

| Score | Threshold |
|---|---|
| 8–10 | Primary identifier AND anchor narrative each match a named §1 launch angle with a specific, verifiable variant, AND the identifier is clarity-over-cleverness (PH: "[category] for [audience]"; Reddit: a standalone value claim). |
| 5–7 | Matches a §1 angle but execution is generic, OR the identifier leans clever/opaque where the channel rewards clarity. |
| 1–4 | No §1 angle match; identifier is a category cliché or pure wordplay. |
| 0 | No recognizable launch framing — the identifier could be a random product description; no anchor angle. |

**No-pack mode:** score the craft of clarity + story structure and note the absent channel calibration in the reasoning (cap at 7 — you cannot verify channel-angle fit without the pack).

---

## Dimension 2 — Format + Hard-Guard Compliance (0–10)

§2 Format Constraints + §4 hard guards from the pack. **Re-scan every component for the hard guards** — do not trust that guard-checker caught everything.

| Score | Threshold |
|---|---|
| 10 | Every component within all §2 hard caps AND every §4 hard guard clear (verified: zero vote-ask in any component; founder disclosure present on Reddit; value stands alone; sub-rule/flair fit). |
| 7–9 | Within hard caps and guards clear; one soft issue (first comment slightly outside 80–150 words; missing posting-window note). |
| 1–6 | A format cap exceeded (tagline >60 / title >300) but no hard-guard breach. |
| 0 | **Any §4 hard-guard breach present** — a vote-ask in any component, undisclosed founder, cold link-drop, or a sub-rule/flair breach. Flag the guard-checker miss in the Change Log. |

---

## Dimension 3 — Velocity-Earning Structure (0–10)

Scored against §3 Ranking Signals + the §5 highest-leverage tactic. Velocity is **earned, never asked**.

| Score | Threshold |
|---|---|
| 10 | The bundle concentrates genuine first-window engagement per §3/§5 with **zero** vote-ask. PH: pinned founder-comment (the §3.2 comment signal) + notify-don't-beg + co-maker reach. Reddit: a genuine question + reply-readiness + right-sub fit feeding first-hour upvotes (§3.1) + comment depth (§3.2). |
| 5–7 | A velocity mechanism is present but weak — flat notify copy, anchor narrative with no reply hook, or a generic cross-post. |
| 1–4 | No velocity mechanism; the bundle posts and hopes. |
| 0 | The velocity "plan" is a vote-ask / vote-ring (also a Dimension-2 zero). |

---

## Dimension 4 — Channel-Native Voice / Culture Fit (0–10)

Does it read as a real participant native to the channel, respecting its culture?

| Score | Threshold |
|---|---|
| 10 | Reads as a genuine maker/participant. PH: a person, not a press release; the first comment is first-person and specific. Reddit: value-first, non-defensive, sub-appropriate tone; disclosed founder who sounds like a community member, not a marketer. |
| 5–7 | Serviceable but slightly press-release / generic-promo; would not get removed but would not stand out as native. |
| 1–4 | Corporate-promo voice; culture-blind (e.g., a salesy Reddit post in a value-first sub). |
| 0 | Would read as spam to the community (pure pitch, no value, no disclosure). |

---

## Dimension 5 — Bundle Completeness + Coherence (0–10)

All channel-native components present AND mutually consistent.

| Score | Threshold |
|---|---|
| 10 | Every native component present (primary identifier, descriptor, anchor narrative, amplification, metadata) AND mutually consistent — tagline, description, and anchor tell the same story; metadata aligns with the §6 run-of-show / window. |
| 5–7 | All present but one inconsistency (tagline promises X, description pitches Y; cross-post tone clashes with the first comment). |
| 1–4 | A non-load-bearing component missing or thin (no metadata; no cross-post). |
| 0 | A load-bearing component missing — no anchor narrative (PH first comment / Reddit value lead), the "half a launch" failure. |

---

## Pass Logic

```
total = D1 + D2 + D3 + D4 + D5

if total >= 35 AND no individual dimension == 0:
 verdict = pass

elif (total >= 25 AND total <= 34) OR any_dimension < 4:
 verdict = done_with_concerns

elif total < 25:
 verdict = fail
```

**Edge case — single zero:** if one dimension scores 0 and total is 40, verdict is `done_with_concerns` (not `pass`). A §4 hard-guard breach (Dimension 2 = 0) can never ship as `pass`.

---

## Discrimination Test

On every critic run, the critic agent MUST verify this rubric discriminates between a strong and a weak launch bundle.

**Weak brief definition:** a vague product + generic copy with a vote-ask. Example: "Check out our new app! Please upvote us on Product Hunt today 🙏" — the vote-ask alone forces Dimension 2 = 0; no §1 angle; no anchor narrative.

**Test:**
- Weak brief estimated score MUST be < 25.
- Strong brief (the actual submission, if it passed guard-check) MUST score ≥ 35 if genuinely strong.
- If BOTH score in the same zone, the rubric is under-calibrated. Flag: "RUBRIC INTEGRITY WARNING: discrimination test failed. Review Dimension [X]."

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-06-19 | Initial version, 5 dimensions, launch-channel calibrated (S3.1). |
