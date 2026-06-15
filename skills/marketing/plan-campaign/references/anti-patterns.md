# Anti-Patterns — Campaign-Plan

> Failure modes the orchestrator + critic-agent guard against. Re-read before any plan ships.

[ANTI-PATTERN] — load at critic dispatch and at orchestrator pre-write.

---

## Section 1 — Strategy & Pillar Anti-Patterns

### 1. Channel-first planning

**Symptom:** "We need TikTok content" / "Let's do a podcast." Channel chosen before pillars, audience, or habitat data.

**Why it fails:** Channels chosen from what's trendy or what the team likes have no grounding in where the ICP actually is. ICP density on TikTok might be Low — the content runs, performs, and converts nobody.

**Fix:** Start with habitat maps from `research/icp-research.md`. If ICP density on a channel is Low, deprioritize it regardless of what's trendy. Channel-agent enforces this; the orchestrator should not override.

**Owned by:** channel-agent (habitat-justification check) + critic-agent (Habitat alignment criterion).

---

### 2. Angles without pillar connection

**Symptom:** Orphan angles in the Angle Bank that don't trace back to any pillar in the Pillars table.

**Why it fails:** Angles untethered from pillars produce surface-level content that doesn't reinforce a strategic theme. The plan reads as "10 random good ideas" instead of "4 pillars × 3 angles each."

**Fix:** Every angle row in the Angle Bank names its parent pillar. No exceptions. Angle-agent enforces; critic-agent traces every angle to a pillar.

**Owned by:** angle-agent (Pillar column required) + critic-agent (Internal Consistency Check: Pillar → Angle trace).

---

### 3. Identical messages across channels

**Symptom:** Same headline / same text / same hook on LinkedIn, X, Email, and the blog.

**Why it fails:** Each channel has native format expectations. The LinkedIn audience expects long-form professional context; X expects a punchy one-liner with a thread option; Email expects a personal-feeling open. Same text everywhere violates all three.

**Fix:** Each channel gets ONE specific angle adapted to its native format. The Angle Bank produces multiple angles per pillar precisely so each channel gets a tailored choice. Channel-agent matches angle Class (Shareable / Searchable / Conversational / Authoritative) to channel.

**Owned by:** channel-agent (one specific angle per channel) + critic-agent (Channel specificity criterion).

---

### 4. Too many pillars

**Symptom:** 7 pillars, each at 14% of content allocation. "We have a lot to say."

**Why it fails:** 7 pillars dilute the message — the audience hears 7 different themes, none of which lands. The brand reads as unfocused; the team chases 7 directions of content production simultaneously.

**Fix:** 3-5 pillars. If you can't cut to 5, you haven't committed to a strategy. Pillar-agent enforces the count gate; critic-agent fails any plan above 5.

**Owned by:** pillar-agent (3-5 pillar cap) + critic-agent (Pillar count criterion).

---

### 5. Timeline without capacity check

**Symptom:** 10 pieces/week for a 2-person team. "We'll figure it out."

**Why it fails:** Over-scheduling guarantees missed deadlines, which guarantees pillars get skipped, which guarantees the plan stops representing reality by week 3. The plan becomes shelfware.

**Fix:** Match cadence to actual team size declared in Pre-Dispatch. Realistic baselines: 3 pieces/week for 1 person, 5-7 for 2, 10+ for 3+. Timeline-agent enforces; critic-agent fails capacity-mismatched plans.

**Owned by:** timeline-agent (capacity fit check) + critic-agent (Capacity fit criterion).

---

## Section 2 — Process & Dispatch Anti-Patterns

### 6. Generating angles before pillars

**Symptom:** Orchestrator dispatches angle-agent in parallel with pillar-agent (or before it).

**Why it fails:** Angles need pillars as input. Without pillars, angle-agent makes up its own themes — which won't trace back to ICP evidence and won't survive critic-gate's Internal Consistency Check 1.

**Fix:** Strict sequential dispatch — pillar-agent solo in Layer 1; angle-agent receives pillar output as upstream context in Layer 2. The Routing Logic code-fences in SKILL.md enforce this; the orchestrator does NOT improvise the order.

**Owned by:** orchestrator (Routing Logic discipline).

---

### 7. Skipping the 9-channel evaluation

**Symptom:** Channel Assignments table lists 3 channels with no mention of the other 6. "We don't do OOH" / "SMS isn't relevant."

**Why it fails:** Skipping channels without a stated rationale means the channel-agent didn't actually evaluate them — the skip is a guess, not a decision. Some skipped channels (especially Mailbox, Bounty/Info platforms) are high-leverage for specific motions and would have been selected if evaluated.

**Fix:** All 9 channels appear in the artifact — either as a Channel Assignments row OR with an explicit skip rationale ("Skipped: ICP density Low" / "Skipped: budget below threshold" / "Skipped: regulatory restriction"). Channel-agent enforces; critic-agent fails any plan missing a channel entirely.

**Owned by:** channel-agent (full 9-channel evaluation required) + orchestrator (pre-write anti-drift check per `format-conventions.md` § "Anti-drift checks"). No dedicated critic-agent gate row exists for "all 9 evaluated" — enforcement is upstream at channel-agent + format-conventions.

---

### 8. Offline channels without execution notes

**Symptom:** IRL / SMS / OOH appear in Channel Assignments with a Cadence value but no execution notes (vendor, compliance, capture method).

**Why it fails:** Online channels (Search, Social, Mailbox-email) have implicit execution patterns the team already knows. Offline channels don't — without vendor selection, lead capture method, compliance specs, the channel appears in the plan but never ships.

**Fix:** When IRL, SMS, or OOH appear in Channel Assignments, the Channel Execution Briefs table MUST be followed by per-channel execution notes (per `format-conventions.md` § "Offline channel execution notes"). Channel-agent produces them; orchestrator writes them inline; critic-agent fails any plan missing them.

**Owned by:** channel-agent (offline execution notes required) + orchestrator (writes notes inline from channel-agent output) + format-conventions.md "Offline channel execution notes" requirement. No dedicated critic-agent gate row exists for offline-execution-notes specifically — enforcement is upstream at channel-agent + format-conventions.

---

### 9. ORB sequence violation

**Symptom:** Launch Sequence opens with PR + paid (Day 0), no internal / alpha / partner phase.

**Why it fails:** PR + paid amplify what owned has already validated. Launching with PR before owned channels have any signal means amplifying an unvalidated message — the message bounces, the campaign reads as inauthentic, the team can't iterate fast enough mid-flight.

**Fix:** ORB Framework — Owned → Rented → Borrowed. Internal (T-4w) → Email alpha (T-2w) → Partner posts (T-1w) → Public launch (Day 0) → PR + paid (T+1w). Launch-sequencing-agent enforces; critic-agent fails out-of-order sequences.

**Owned by:** launch-sequencing-agent (ORB enforcement) + critic-agent (ORB compliance criterion in Quality Gate Checklist).

---

## Section 3 — Cross-Cutting (Marketing-Stack)

### 10. Plan written without growth motion declared

**Symptom:** Pillars + angles + channels appear in the artifact but the Growth Motion section is empty or says "Mixed/TBD."

**Why it fails:** Growth motion (PLG / SLG / Hybrid) drives channel weighting and cadence assumptions across the entire plan. Without it, channel-agent's habitat-to-channel mapping has no weighting input — the resulting channel mix is biased toward whichever channels look "popular" in the habitat data, not which match the acquisition model.

**Fix:** Growth Motion section is written by the orchestrator inline in Step 0 (after Pre-Dispatch resolves the dimension). It appears in the artifact BEFORE Layer 1 dispatches. Pre-Dispatch BLOCKS on missing growth motion — Cold Start question 4 is mandatory; Warm Start probes when business.md doesn't already carry it.

**Owned by:** orchestrator (Pre-Dispatch resolution + inline write of Growth Motion section before Layer 1) + Critical Gate "Identify the growth motion BEFORE selecting channels" (body) + orchestrator-side Quality Gate body bullet "Growth motion explicitly stated". Note: the canonical 11-row Quality Gate Checklist in `critic-agent.md` does not include a "Growth motion stated" criterion — it's an orchestrator-side body-Quality-Gate bullet only. Critic-agent enforces downstream consequences (channel selection alignment, ORB compliance) which assume growth motion was resolved.

---

### 11. Stale ICP research with no warning

**Symptom:** Orchestrator reads `research/icp-research.md` dated 4 months ago, uses it verbatim, ships a plan grounded in stale pains + outdated VoC.

**Why it fails:** ICPs evolve — pains shift as the market changes, VoC language drifts, habitat density rebalances quarterly. A plan grounded in stale ICP is misaligned from the first week.

**Fix:** Pre-Dispatch reads the `date` field on pipeline artifacts. >30 days → orchestrator emits "ICP research is N days old. Recommend re-running `research-icp` before this plan. Proceed anyway?" The user can override (and the artifact ships as `DONE_WITH_CONCERNS` with a stale-ICP flag); the orchestrator does NOT silently ship.

**Owned by:** orchestrator (Pre-Dispatch freshness check) + Critical Gate "Stale ICP research (>30 days) produces misaligned plans".

---

### 12. Cross-stack contract drift in artifact frontmatter

**Symptom:** Orchestrator renames `status` → `state`, adds an undocumented `phase` field, drops the `version` field "because it's always 1."

**Why it fails:** `docs/forsvn/artifacts/marketing/campaign-plan.md` is read by `brief-landing-page`, `write-outreach`, `write-ad`, `optimize-seo`, `brief-shortform`, and `plan-funnel`. Schema drift breaks downstream consumers silently — they jump to a section by frontmatter check, the check fails, they fall back to scaffolded defaults, the user sees a plan-disconnected output.

**Fix:** Frontmatter rules in `format-conventions.md` § "Frontmatter — required fields" are the contract. Schema changes require atomic update of `format-conventions.md` in the same commit. No silent additions, no field renames.

**Owned by:** orchestrator (artifact write step) + format-conventions.md (contract).

---

### 13. Plan generated when funnel-planner is the right tool

**Symptom:** User asks "what should my CAC target be per channel?" Orchestrator dispatches campaign-plan, produces a 9-channel evaluation, no CAC numbers anywhere.

**Why it fails:** Campaign-plan picks channels and cadence — it does NOT set numeric targets. The user gets a plan that doesn't answer their actual question; they re-invoke with `plan-funnel` 10 minutes later.

**Fix:** Pre-Dispatch detects "CAC / LTV / target / conversion rate / per-channel number" language → emits "Sounds like you want numeric targets, not channel strategy. Route to `plan-funnel` instead, or run both (campaign-plan picks channels, funnel-planner sets per-channel numbers)?" Same-skill deference applies for tactical-asset requests (single ad → `write-ad`, single page → `brief-landing-page`, single touch → `write-outreach`).

**Owned by:** orchestrator (Pre-Dispatch intent classification) + Skill Deference list in SKILL.md.

---

## Cross-skill ownership note

Pattern #10 (growth motion) is enforced at multiple checkpoints (Pre-Dispatch → orchestrator inline write → critic-agent gate) because it's load-bearing for downstream agent dispatch — the channel-agent's behavior changes based on motion, so resolving it late causes Layer 2 rework.

Patterns #12-13 mirror the cross-cutting marketing-stack convention established by ad-copy slot 9 / copywriting slot 8 / cold-outreach slot 7 — same rationale (artifact-schema drift breaks downstream consumers silently; intent-routing missteps cost the user a second invocation).
