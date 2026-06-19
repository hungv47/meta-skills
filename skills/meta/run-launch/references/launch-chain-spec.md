# Launch Chain Spec — the per-channel launch runtime

The contract for `run-launch`: the 7-step chain, the per-step pack binding, the
**unwired-leaf transparent degrade**, the gate rules, and the bundle artifact. Canonical
design: the generic per-channel launch chain (U11) in `/forsvn`'s `chains/marketing.md §
Launch chains`; D-7 (the launch runner, not skill clones) and D-8 (legible, not autopilot).

`run-launch` is the runnable form of that doc-only chain. It **orchestrates** the existing
leaf skills around one channel's `launch-channel` pack and assembles ONE coherent bundle —
it never re-implements a leaf's work (orchestrate, don't fuse), and it never auto-publishes.

---

## The 7-step chain

```
research-icp ─▶ plan-campaign ─▶ brief-graphic/brief-shortform ─▶ write-launch | write-social
                                                                          │
   measure-results ◀── publish-social ◀──────────────────────────────────┘
        │
        └── writes the result back into the channel pack (loop closed)
```

Each step binds to the channel pack's own sections and **narrates** the tactics it applied
(legibility convention). `write-launch` runs the copy step for a `launch-channel` pack;
`write-social` runs it for a social **feed** channel (one post). Neither is cloned per
channel — the depth lives in the pack (D-6).

| # | Step | Leaf skill | Binds to (pack §) | Gate |
|---|---|---|---|---|
| 1 | Audience | `research-icp` (skip if `research/product-context.md` present) | — | — |
| 2 | Plan / run-of-show | `plan-campaign` (launch path) — **+ runner reads pack §5/§6 directly** (see Degrade) | §5 Playbook · §6 Timing | **review gate** |
| 3 | Asset brief | `brief-graphic` (or `brief-shortform` for a video channel) | §1 Angles · §2 Format | **review gate** |
| 4 | Launch copy | `write-launch` (launch-channel) \| `write-social` (social feed) | §1 · §2 caps · §4 hard guards · §5 anchor | **review gate** |
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
- **`publish-social`** carries the legibility frontmatter (`pack_verified` / `applied_tactics`)
  but nothing binds a launch pack's §7 CTA norms or §4 hard guards at publish.

So at steps **2, 5, and 6** the runner does **not** silently assume a binding that isn't
there. It **reads the channel pack's §5/§6/§4/§7 directly** to narrate the run-of-show and
re-assert the guards, and **says so** in the Legibility block:

```
- Step 2 (plan): plan-campaign does not yet bind the launch pack — run-launch read
  `producthunt` §5 (10-step run-of-show) + §6 (12:01 PT window) directly to sequence the plan.
- Step 6 (publish): publish-social does not yet bind the launch pack — run-launch re-asserted
  §4 (no vote-ask) + §7 (news-framed CTA) against the cross-post copy before the gate.
```

This is the honest state, not a workaround: fully wiring `plan-campaign` / `publish-social`
to launch packs is **S3.2 / S3.3**, out of scope for the runner. The runner never *rewires*
those leaves — it narrates the gap and reads the pack itself so the launch is still grounded.

If **no pack** covers the channel at all, every step degrades to general launch principles and
says so (`pack_verified: none`, empty `applied_tactics`) — it does not fake channel tailoring.

---

## Gate rules

1. **Stop at every gate; never auto-publish.** Steps 2–6 each pause for the human review gate;
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

- **The run-of-show table** — the 7 rows above, each with the leaf dispatched, the pack §N it
  bound (or "degrade — read pack directly"), a link to that step's artifact, and the gate/status.
- **A Current step pointer** — the single source of "where are we" for resume.
- **The Legibility block** — `pack_verified`, the applied tactics per step, and the explicit
  degrade lines for the unwired steps.
- **The Why-this-works block** — the launch's bet + the 2–4 product-fit choices (ICP/brand).
- **The critic verdict** (5-row table) + any anti-patterns triggered.

**Resumability:** to resume, read **Current step** + the latest per-step artifacts. State lives
in the bundle + the leaves' own artifacts — no database, no new loop tree.
