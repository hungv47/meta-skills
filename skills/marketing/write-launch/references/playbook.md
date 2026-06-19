# Playbook — Why Launch Copy Exists

> Load this when teaching the skill to a new operator, when deciding whether to run it at all, or when a launch underperformed and you suspect the copy was channel-blind or broke a guard.

---

## Core Question

> **"Does this bundle earn the launch — every native copy piece a channel needs, clearing every cap and every hard guard, engineered to *earn* first-window velocity (never to beg for it) — on THIS channel?"**

write-launch is a launch-channel emitter: 1 channel per artifact, 1 launch per artifact, 1–3 identifier/anchor variants. Its single job: turn a brief (from `plan-campaign` or inline) into the channel's **complete native copy bundle**, with the channel's playbook pack loaded at every step, the pack's §4 hard guards enforced, and rubric scoring. Launch channels at first ship: `producthunt`, `reddit` (and any channel with a `launch-channel` pack — Show HN and others land in S3.2).

---

## Why this skill exists at all — and why it's separate from write-social

`write-social` writes ONE social post (hook variants + body + CTA) for ONE of the 5 feed platforms (tiktok, reels, shorts, x, linkedin). A launch is a different unit: a **coordinated bundle** of copy pieces (PH: tagline + description + topics + pinned first comment + notify + cross-post; Reddit: subreddit + title + value-first body + comment seeds), governed by **publish-blocking** rules (a PH vote-ask is a guideline violation; a Reddit cold link-drop is a ban). Cramming that into write-social would break its single-post contract, overload its scroll-stop rubric, and lose the hard guards. So launch copy is its own emitter.

Five failure modes it prevents:

1. **Vote-begging.** Asking for upvotes on Product Hunt (a guideline violation + downrank) or vote manipulation on Reddit (a sitewide ban). The bundle is engineered to *earn* velocity. Captured as Anti-Pattern #1 (Vote-Ask) and Critical Gate 4.
2. **Half a launch.** A tagline with no anchor narrative — the PH first comment / Reddit value lead carries the story and the feedback ask; without it the launch is half-built. Anti-Pattern #2.
3. **Tripping the community's promo immune system.** A pitch-first, undisclosed-founder Reddit post that gets removed and banned. Anti-Pattern #3.
4. **Opaque identifiers + bundle incoherence.** A clever tagline a skimmer can't repeat; a tagline, description, and anchor that tell different stories. Anti-Patterns #4 + #5.
5. **Post-and-ghost.** No reply hook, no first-window engagement plan, velocity left to chance. Anti-Pattern #6.

The structural answer is a 3-agent dispatch (launch-copywriter → guard-checker → critic), per-channel `launch-channel` packs at `references/_shared/platform-intelligence/[channel].md`, and a 5-dimension rubric (`references/rubric.md`).

---

## Philosophy

The launch is the surface; the playbook pack is the substrate. Each `launch-channel` pack documents Launch Angles (§1), Format Constraints (§2), Ranking Signals (§3), the Anti-Patterns/hard guards (§4), the timed Playbook (§5), Timing (§6), and CTA norms (§7). The copywriter picks an angle + executes a §5 step; the guard-checker enforces caps + the hard guards (the launch's publish-blocking rules); the critic scores against the 5-dimension rubric with a discrimination test.

This is a **craft-leaning skill on the production side** (the anchor narrative — a founder's story — is voice, not a template) and **structural-plus-policy on the guard side** (caps are binary; hard guards are publish-blocking). The rubric checks the craft floor and the guard floor; it does not impose a house-style ceiling on the story.

**The legibility wedge.** Every bundle narrates which pack it loaded, when it was verified, and the specific tactics applied — or degrades transparently when no pack covers the channel. The applied expertise is *visible*, which is where the open-core wedge becomes felt (a Pro client narrates a current pack; a free client narrates an aging snapshot). The skills stay free; money never enters here.

---

## When NOT to use this skill

- **A single social post (tweet, LinkedIn post, TikTok caption).** That's `write-social` — organic single-platform feed copy.
- **The launch run-of-show, channel selection, or timing plan.** That's `plan-campaign` — this skill consumes the plan and the pack §5/§6, it doesn't author the calendar.
- **Gallery / thumbnail / OG / banner assets.** That's `brief-graphic` — write-launch notes the asset requirement (PH slot-1 demo loop) but does not brief the visual.
- **Distributing or scheduling the finished copy.** That's `publish-social` — it renders the drafts/exports from this bundle.
- **Reading post-launch results.** That's `measure-results` — it scores the real result against the same pack and writes back so the next launch compounds.
- **Multi-channel in one invocation.** Re-invoke per channel; the launch chain (and `run-launch`, S3.1) fans out.

---

## The 5-dimension rubric

Lives in `references/rubric.md`. Summary:

| # | Dimension | Scored against |
|---|---|---|
| 1 | Angle fit / clarity | pack §1 Launch Angles (clarity over cleverness) |
| 2 | Format + hard-guard compliance | pack §2 caps + §4 hard guards (a guard breach forces 0) |
| 3 | Velocity-earning structure | pack §3 Ranking Signals + §5 highest-leverage tactic (never a vote-ask) |
| 4 | Channel-native voice / culture fit | the channel's culture (PH maker tone; Reddit value-first, non-defensive) |
| 5 | Bundle completeness + coherence | all native components present + mutually consistent + run-of-show aligned |

Pass = total ≥35/50 AND no dimension scores 0. DWC = 25–34 OR any dimension below 4. Fail < 25. The critic also runs the **discrimination test** — a weak launch brief (with a vote-ask) MUST score <25; a strong bundle MUST score ≥35.

Max 1 guard-check revision loop on a violation. Two consecutive violations = GUARD_FAIL (status: blocked, no critic). No critic rewrite loop.

---

## Cross-stack contract (consumed downstream)

Output at `docs/forsvn/artifacts/marketing/launch/[channel]-[date]-[slug].md` is consumed by the polish chain (`humanmaxxing` / `polish-vn`), `publish-social` (distribution), `measure-results` (loop close + pack write-back), and `run-pipeline` (eval ledger). Schema changes require atomic update of those readers (`procedures/artifact-contract.md` § Cross-stack contract).
