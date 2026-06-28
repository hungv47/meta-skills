# Launch Chain Spec — the per-channel launch runtime

The contract for `run-launch`: the 7-step chain, the per-step pack binding, the
**unwired-leaf transparent degrade**, the gate rules, and the bundle artifact. Canonical
design: the generic per-channel launch chain (U11) in `/forsvn`'s `chains/marketing.md §
Launch chains`; D-7 (the launch runner, not skill clones) and D-8 (legible, not autopilot).

> **Model-invocation.** `run-launch` stays human-invoked (`disable-model-invocation: true`) — it
> orchestrates a *channel launch*, not a generic plan. Generic model-driven execution of an approved
> `plan.md` goes through the **`run-plan`** executor (A4), which auto-advances non-publish steps within
> the A6 governor envelope and STOPS at every publish gate. Don't flip this flag for that.

`run-launch` is the runnable form of that doc-only chain. It **orchestrates** the existing
leaf skills around one channel's `launch-channel` pack and assembles ONE coherent bundle —
it never re-implements a leaf's work (orchestrate, don't fuse), and it never auto-publishes.

---

## The 7-step chain (+ the 4b outreach sub-step)

```
research-icp ─▶ plan-campaign ─▶ brief-graphic/brief-shortform ─▶ write-launch | write-social
                                                                          │
                                                       4b ─▶ write-outreach (hunter / supporter)
                                                                          │
   measure-results ◀── publish-social ◀──────────────────────────────────┘
        │
        └── writes the result back into the channel pack (loop closed)
```

Each step binds to the channel pack's own sections and **narrates** the tactics it applied
(legibility convention). `write-launch` runs the copy step for a `launch-channel` pack;
`write-social` runs it for a social **feed** channel (one post). Neither is cloned per
channel — the depth lives in the pack (D-6). Step **4b** (`write-outreach`) is a clearly-numbered
sub-step of the copy stage: the launch needs personalized hunter/supporter/co-maker outreach
*built on* the launch angle from step 4, so it sits between Launch copy (4) and Comms plan (5).

| # | Step | Leaf skill | Binds to (pack §) | Gate |
|---|---|---|---|---|
| 1 | Audience | `research-icp` (skip if `research/product-context.md` present) | — | — |
| 2 | Plan / run-of-show | `plan-campaign` (launch path) — **+ runner reads pack §5/§6 directly** (see Degrade) | §5 Playbook · §6 Timing | **review gate** |
| 3 | Asset brief | `brief-graphic` (or `brief-shortform` for a video channel) | §1 Angles · §2 Format | **review gate** |
| 4 | Launch copy | `write-launch` (launch-channel) \| `write-social` (social feed) | §1 · §2 caps · §4 hard guards · §5 anchor | **review gate** |
| 4b | Hunter / supporter outreach | `write-outreach` — **+ runner reads pack §5/§8 directly** (see Degrade) | §5 outreach steps (1/4/7) · §8 hunter-reach | **review gate** |
| 5 | Comms plan | the `plan-campaign` launch-day run-of-show artifact — **+ runner reads pack §5 timings** (see Degrade) | §5 timings | **review gate** |
| 6 | Publish | `publish-social` — **+ runner re-asserts pack §4 guards + §7 CTA** (see Degrade) | §7 CTA · §4 hard guards | **fork + review gate (no auto-publish)** |
| 7 | Measure | `measure-results` | writes a dated entry back into §9 / §5 | — |

A step is implemented by its leaf skill — the orchestrator never inlines the work. The
runner owns sequencing, the pack narration, the per-step legibility + the bet, and the
bundle. Single-responsibility skills stay independently critic-gated; the merge happens here.

---

## Transparent degrade — the unwired leaves (load-bearing)

The launch chain is, as of S3.1, only **partly wired**: only the copy step's emitter
(`write-launch`) actually binds a `launch-channel` pack. The other pack-bound steps do **not**
yet bind it:

- **`plan-campaign`** binds `_shared/platform-intelligence/` only for *social-media* briefs
  (§2/§3/§6 via its `platform-channels.md`, D13.B). It does **not** read a `launch-channel`
  pack's §5 Playbook / §6 Timing.
- **`write-outreach`** (step 4b) drafts individual outreach (email / LinkedIn / DM) from its
  own craft packs (channels / frameworks / modes). It does **not** read a `launch-channel`
  pack's §5 outreach steps (build the support list · line up co-makers/hunter · notify) or §8
  hunter-reach notes — it is wired as a *chain step* (it emits its own typed artifact), but it
  does not bind the launch pack.
- **`publish-social`** carries the legibility frontmatter (`pack_verified` / `applied_tactics`)
  but nothing binds a launch pack's §7 CTA norms or §4 hard guards at publish.

So at steps **2, 4b, 5, and 6** the runner does **not** silently assume a binding that isn't
there. It **reads the channel pack's §5/§6/§8/§4/§7 directly** to narrate the run-of-show, the
outreach plan, and re-assert the guards, and **says so** in the Legibility block:

```
- Step 2 (plan): plan-campaign does not yet bind the launch pack — run-launch read
  `producthunt` §5 (10-step run-of-show) + §6 (12:01 PT window) directly to sequence the plan.
- Step 4b (outreach): write-outreach does not bind the launch pack — run-launch read
  `producthunt` §5 steps 1/4/7 (support list · co-makers/hunter · notify, never a vote-ask)
  + §8 (residual hunter-reach unknown) directly to scope the outreach; write-outreach drafted it.
- Step 6 (publish): publish-social does not yet bind the launch pack — run-launch re-asserted
  §4 (no vote-ask) + §7 (news-framed CTA) against the cross-post copy before the gate.
```

This is the honest state, not a workaround: fully wiring `plan-campaign` / `publish-social`
to launch packs is **S3.2 / S3.3**, out of scope for the runner. The runner never *rewires*
those leaves — it narrates the gap and reads the pack itself so the launch is still grounded.
Step 4b is the same shape: `write-outreach` is dispatched as a real chain step (its emitter gap
is closed — S3.4), and the runner reads the pack's outreach §§ directly to ground it.

If **no pack** covers the channel at all, every step degrades to general launch principles and
says so (`pack_verified: none`, empty `applied_tactics`) — it does not fake channel tailoring.

---

## Gate rules

1. **Stop at every gate; never auto-publish.** Steps 2–6 (including the 4b outreach sub-step)
   each pause for the human review gate;
   their output is written `decision_state: pending` (architecture §9.2 — humans own approval
   in v0). The runner enforces this, not the leaf. The **publish** step (6) hands to
   `publish-social`, which runs the registry-gated execution fork (`_shared/execution-fork.md`,
   `list_tools(publish)`) and stops — Direct mode does **not** auto-approve, and the runner
   never auto-publishes (D-8).
2. **Pack-resolved + legible at every step.** Resolve the pack once (soft client), narrate
   `pack_verified`, and at each bound step name the specific §N tactic applied (legibility
   Hard Rule 3 — tactics, not vibes). The unwired steps degrade transparently (above).
3. **Close the loop.** Step 7 (`measure-results`) writes the result back into the channel pack
   so the next launch compounds. A run that stops at publish with no measure handoff is **open**
   — flag `DONE_WITH_CONCERNS`. The runner forks **no new store**: `measure-results` owns the
   pack write-back + `.forsvn/performance/[channel].tsv`.

---

## The bundle artifact (run-launch owns)

One **run record** at `docs/forsvn/artifacts/marketing/launch/[channel]-[YYYY-MM-DD]-run-[slug].md`
(`lifecycle: pipeline`) — distinct from `write-launch`'s copy bundle (`[channel]-[date]-[slug].md`),
which it links. Carries:

- **The run-of-show table** — the 7 steps (+ the 4b outreach sub-step) above, each with the leaf
  dispatched, the pack §N it bound (or "degrade — read pack directly"), a link to that step's
  artifact, and the gate/status.
- **A Current step pointer** — the single source of "where are we" for resume.
- **The Legibility block** — `pack_verified`, the applied tactics per step, and the explicit
  degrade lines for the unwired steps.
- **The Why-this-works block** — the launch's bet + the 2–4 product-fit choices (ICP/brand).
- **The critic verdict** (5-row table) + any anti-patterns triggered.

**Resumability:** to resume, read **Current step** + the latest per-step artifacts. State lives
in the bundle + the leaves' own artifacts — no database, no new loop tree.

---

## Signature artifact set — the "complete native bundle" contract (U4)

A `launch-channel` pack declares the **signature outputs** that channel's launch must produce; the
emitter gap (D-6/D-7) is any signature output the kit cannot yet emit as a reviewable artifact. The
bundle is **complete or honestly flagged**: every signature artifact is either emitted by a chain
step or carries an explicit `unwired` ledger line — **never silently missing** (the U2 coverage
guarantee, applied to the launch bundle). Reference channel (`producthunt`, the channel deepest in
knowledge):

| Signature artifact | Pack § | Chain step | Typed reviewable? | Status |
|---|---|---|---|---|
| Tagline (≤60 chars) | §1 Angle 1 · §2 | 4 (`write-launch`) | yes (own artifact) | wired |
| Pinned first maker-comment (80–150w) | §1 Angle 2 · §5 | 4 (`write-launch`) | yes (own artifact) | wired |
| Gallery brief (demo-GIF slot 1) | §1 Angle 3 · §2 | 3 (`brief-graphic`) | yes (own artifact) | wired |
| Launch-day run-of-show | §5 · §6 | 2 (`plan-campaign`) | yes (own artifact) | wired |
| Hunter / supporter outreach | §5 · §8 | 4b (`write-outreach`) | yes (own artifact) | wired |

The `unwired-*` status is the honest emitter-gap mechanism: when the kit cannot yet emit a
signature artifact as a reviewable, the row carries an `unwired-<id>` line rather than dropping it.
**As of FOR-46 / U4 both open PH emitter gaps are closed** — every reference-channel signature
artifact is now `wired` to a chain step *and* a typed reviewable artifact:

- **Typed signature subtypes (S3.5) — closed.** Tagline + first maker-comment used to ride
  *inside* `write-launch`'s copy bundle only. They now ALSO emit as two individually-typed
  reviewable **sidecar** artifacts next to the bundle (`signature: ph-tagline` /
  `ph-first-comment`, `type: execution`) — an additive, optional `signature` subtype on the
  artifact contract (operator-ratified, since the contract is a canonical SoT; it adds a
  dedicated field, not a new `type` enum value — the `review_tool: proof` precedent).
- **Hunter outreach step (S3.4) — closed.** `write-outreach` is now chain step **4b**, emitting
  its own typed reviewable outreach artifact (`docs/forsvn/artifacts/marketing/write-outreach/`).
  The runner reads the pack §5/§8 outreach lines directly to ground it (transparent degrade —
  write-outreach does not bind the launch pack; see § Degrade).

A future gap is reopened by flipping a row back to `unwired-<id>` (and named in this prose);
closing it = wire the leaf as a chain step (or add the subtype) + flip the row to `wired`.
`_dev/validate-launch-kit.ts` fails if a signature artifact is dropped from this ledger or a row
carries an unrecognized status — so a gap can never become silent.
