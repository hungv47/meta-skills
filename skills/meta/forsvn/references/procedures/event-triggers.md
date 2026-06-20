# Event triggers — git push = marketing (C6)

Hook the moment the operator already has ("I shipped, I want eyes on it") instead of waiting for them to
remember to do marketing. Two flows, both **suggestion-only** and built **over existing producers** —
no new skills, and the **publish-gate is absolute** (drafts land `decision_state: pending`; publish /
spend / external actions always stop for a human, hard-coded).

The portable path is **typing `/forsvn`** after a ship (or the morning digest). The opt-in git hook
(`hooks/git-marketing-suggest.mjs`) is a Claude-Code/agent accelerator only — it prints the same nudge
on a feature push, never load-bearing.

## Flow 1 — Post-push next-move

Trigger: the operator says "I shipped X" / "just pushed" / "what should I post", OR the opt-in hook
fired on a feature push.

1. **Read what shipped.** `git log --oneline` since the last release/main (or the diff/changelog the
   operator names). Summarize the feature in one line.
2. **Propose 2–3 distribution moves**, each naming the **existing producer** (no new skill):
   - **Changelog tweet** → `/write-social` (announce the change).
   - **Community reply** → `/write-social` (a relevant Reddit / HN / X thread — native, not a promo).
   - **Changelog / PH update line** → `/write-launch` (launch-channel update).
3. **Ground each in recall where data exists** — run `query-performance` for the channel; if there's
   own-data, let it color the angle (anecdote-weight when below the floor), else priors only.
4. **Draft each as a reviewable artifact** through its producer (the normal Step-5 dispatch). Every draft
   is `decision_state: pending` — a draft to review, never a publish.
5. **Stop at the publish gate.** Publishing any move routes through the human gate (`publish-social`'s
   registry-gated fork / the launch chain's never-auto-publish rule). The flow drafts + suggests; it
   never posts.

## Flow 2 — Morning growth standup

Trigger: "growth standup" / "morning digest" / a daily `/forsvn` tag.

Read **yesterday's** signal and turn it into one move:

1. `query-verdicts.ts` over `.forsvn/learning/verdicts.tsv` (C2/L1) — yesterday's decisions: what was
   approved / denied and why (the `decision_reason` tallies).
2. `query-performance` recall — yesterday's channel metrics where the operator fed them.
3. Synthesize one digest line: **"yesterday's X did Y; today's move is Z"** — Z is a single named
   producer move (e.g. `/write-social`), drafted on request, never auto-run.

Both flows: one tag in, a reviewable draft (or a digest) out — and the publish gate always stops for a
human.
