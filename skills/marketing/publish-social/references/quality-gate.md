# Quality Gate — 8-Dim Critic Rubric

Critic-agent enforces the rubric (`agents/critic-agent.md`). For export/draft it runs before delivery; for `--mode=publish` it runs as the **content gate before the confirmation gate** — a live post cannot be fixed after the fact.

## Per-dimension checklist

- [ ] **Platform Char-Cap Compliance** (dim 1) — every per-platform variant within its hard limit
- [ ] **Media Spec Compliance** (dim 2) — aspect / file size / format per platform; media URLs cross-checked against produce-asset/video manifests
- [ ] **CTA Visibility** (dim 3) — CTA before each platform's algorithm-truncation point (X 280 / LinkedIn ~210 / IG ~125 / TikTok ~150)
- [ ] **Hashtag-Rules Per Platform** (dim 4) — count + position match convention (IG ≤30 / LinkedIn 3-5 / X 1-2 / Threads 1-3)
- [ ] **Scheduler-Format Validation** (dim 5) — Typefully JSON / Buffer / Hootsuite / generic CSVs all parse cleanly + match target schemas
- [ ] **Anti-Pattern Compliance** (dim 6) — no shadowban triggers · no policy-violating copy · no broken Unicode · no credential leakage (`_KEY`/`_TOKEN`/`_SECRET` grep returns zero)
- [ ] **Browser-Automation Safety** (dim 7, D17) — confirmation gate ran · no auto-submit without confirmation · no cookie values in any log · no captcha-bypass · no screenshots captured
- [ ] **Live-Publish Safety** (dim 8, D18) — for `--mode=publish`: critic ran before the gate · two-stage gate logged · every published row confirmation-backed · dry-run posted nothing (orchestrator-applied post-publish)

## Pass / fail mechanics

**Pass:** aggregate ≥56/80 AND every per-dim ≥6.

Critic FAIL → re-dispatch formatter (or automation for dim 7) for the failing platform(s) with feedback (max 2 cycles). Persistent FAIL on a `--mode=publish` run → `BLOCKED`, the confirmation gate never fires.

Full rubric: [`rubric.md`](rubric.md).
