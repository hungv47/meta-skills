# Procedure — Critical Gates (write-launch)

> Load before Pre-Dispatch. These four gates are non-negotiable; violations triggered downstream (anti-patterns, GUARD_FAIL escalation, polish-chain divergence) trace back here.

---

## 1. Single-channel per artifact

Multi-channel launch = re-invoke with a different `channel` argument. Launch angles (§1) and hard guards (§4) are channel-specific — a Product Hunt category-killer tagline and a Reddit value-first title are not interchangeable, and a bundle that blends them is optimal for neither. The launch chain (and, later, `run-launch`) fans out: `plan-campaign` selects the channels, then this skill runs once per channel, each grounded in its own pack.

## 2. Pack-bound or transparent degrade

The bundle MUST load the channel's `launch-channel` pack (`references/_shared/platform-intelligence/[channel].md`) and narrate it in the Legibility block. When **no pack** covers the channel, write on general launch principles and SAY SO — `pack_verified: none`, empty `applied_tactics`, and the legibility-convention's Absent statement. **Never fake channel tailoring** (legibility Hard Rule 2). A stale pack (>90d or `status: stale`) narrates with the ⚠ stale flag and downgrades the run to `DONE_WITH_CONCERNS`.

## 3. Brand mode required (`founder` OR `company`)

Either `brand/BRAND.md` declares the mode OR the operator answers the Cold Start brand-mode question. **No silent default.** Founder mode shapes the anchor narrative (a first-person founder story is the PH/Reddit highest-leverage move); company mode shifts voice. If Pre-Dispatch can't resolve it and Cold Start is skipped (`--fast` mis-applied), the dispatch BLOCKS with `NEEDS_CONTEXT` pointing to `create-brand`.

## 4. Hard guards are publish-blocking

The pack's §4 hard guards — Product Hunt: **no vote-ask** in any component; Reddit: **founder disclosure** + value-stands-alone + sub-rule/flair fit — are non-negotiable. Unlike a format cap (which underperforms), a hard-guard breach gets the launch **removed, downranked, or the account banned**. The guard-checker bounces a breach to the copywriter ONCE (`## Guard-Checker Feedback`); a breach that remains on the re-check = `GUARD_FAIL`: the artifact ships `status: blocked`, `critic_score: null`, and the critic is NOT dispatched.

**Mode interaction:**
- `--fast` → guard-check revision loop = 0 cycles. First hard-guard breach = `GUARD_FAIL` immediately. The guard-check itself STILL runs — `--fast` never skips the guard.
- `--deep` → guard-check revision loop = MAX 2 cycles. Third breach still escalates.

---

## Cross-references

- Anti-Pattern catalog (per-pattern detection rule + agent ownership): [`../anti-patterns.md`](../anti-patterns.md).
- Dispatch mechanics (guard-check bounce, single-agent fallback, polish-chain handoff): [`./dispatch-mechanics.md`](./dispatch-mechanics.md).
- Mode resolver (tier definitions, `--fast` / `--deep` mechanics, safety-gate floor): [`../_shared/mode-resolver.md`](../_shared/mode-resolver.md).
- Legibility (the pack-narration contract + the three states): [`../_shared/legibility-convention.md`](../_shared/legibility-convention.md).
