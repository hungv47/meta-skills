# Worked Example — one dispatch, end to end

The observed-failure case from the 2026-06-11 plan (U3 trigger eval), shown as a correct run.

**Operator:** "brief the landing page first, then build"

## Step 1 — State snapshot

Disk snapshot rendered inline (state-snapshot.md shell-bang). `.forsvn/` exists; `brand/BRAND.md` present.

## Step 2 — Resume check

`.forsvn/routing/last-session.md` is stale (9 days) → classify fresh.

## Step 3 — Classify

"landing page" hits the marketing row of the intent table → read `references/chains/marketing.md`. Chain rule: pre-launch LP construction → `brief-landing-page` (post-launch CRO with analytics evidence would be `evaluate-landing-page` inside an existing loop — not this ask). One confident candidate → no clarifying question spent. Brand-gate check: `brand/BRAND.md` exists → no `create-brand` detour.

## Step 4 — Record BEFORE invoke

`.forsvn/routing/last-session.md` written first:

```yaml
status: dispatched
dispatched-by: forsvn
intent: "brief the landing page first, then build"
skill: brief-landing-page
initiative: landing-page-launch
```

Session execution profile resolved (fresh `execution-profile.json` exists → inherited, no ask).

## Step 5 — Announce + invoke

> → Dispatching /brief-landing-page — pre-launch LP construction intent; brand system present.

Skill-tool invocation with the operator's framing as args. The leaf warm-starts: it skips pre-dispatch steps 1–2 (the dispatcher already grepped experience/ and loaded product context) and probes only LP-specific gaps (page route + tier, hypothesis).

## Quality Gate self-check (thin rubric instantiation)

- [x] Classification — matched a chain rule; no coin-flip.
- [x] Sequencing — record written before the Skill call.
- [x] Announcement — one line, names the leaf and the why.

**Completion:** DONE — classified intent, wrote routing record, announced + invoked the leaf.

## The failure this example pins against

Loading context and *printing* "you could run /brief-landing-page" without invoking it — the pre-U3 contract. Auto-dispatch with announcement is the contract; silent dispatch and hand-off-and-stop are both anti-patterns (`references/anti-patterns.md`).
