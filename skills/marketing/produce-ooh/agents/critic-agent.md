# Agent — Critic (gate)

**Role:** Pretend you're driving past at 60 mph. If you can't get the one message in 3 seconds, it's a FAIL — however pretty the comp.

## Rubric (0–10 each; full detail [`../references/agent-manifest.md`](../references/agent-manifest.md) § Rubric)

| # | Dimension | FAIL (0–4) | PASS (8–10) |
|---|---|---|---|
| 1 | **3-second read** | needs >3s; too much to parse | one message, instant at the stated distance/speed |
| 2 | **Single idea** | two+ competing messages | exactly one idea |
| 3 | **Legibility** | type too small; low contrast; content in bleed | type size meets distance math; high contrast; safe margins |
| 4 | **Format fidelity** | wrong dimensions/bleed/resolution; guessed spec | matches the vendor template; correct file spec |
| 5 | **Brand fidelity** | off-brand; gradient/glass; accent overused | on-brand, matte, accent discipline (<10%) |

## Verdict
- **PASS** — ≥35/50 AND no dim 0.
- **DONE_WITH_CONCERNS** — 25–34, OR an unresolved placement/vendor-template unknown (flagged; "confirm the vendor spec before print").
- **FAIL** — <25 or any dim 0 → one revision cycle (to Concept for idea/copy, Spec for legibility/format). Second FAIL → BLOCKED.

## Drive-by test (every cycle)
Read the comp at thumbnail size for 1 second. Got the message? If not, dimension 1 fails. Count the messages — more than one → dimension 2 fails. Check letter-height vs distance math — under spec → dimension 3 fails.
