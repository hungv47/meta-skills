# Playbook — Why Prioritize Exists

> Load this when you want to teach the skill to a new operator, when you're deciding whether to run this skill at all, or when initiatives are coming out generic and you need to recalibrate.

---

## Core Question

> **"What's the highest-impact thing we can do about this?"**

Prioritize is Strategy Step 2 of 4. It sits between `diagnose` (the validated root cause) and `plan-funnel` (the numeric targets). Its single job: generate initiatives anchored to the root cause, rank them with evidence-backed ICE scoring, and draw a defensible cut line so the team can ship ≤3 things instead of debating 10.

---

## Why this skill exists at all

Three failure modes it prevents:

1. **Generic growth-playbook drift.** Without root-cause anchoring, every brainstorm devolves into "improve SEO / optimize onboarding / improve activation" — initiatives that would help ANY company and therefore do nothing specific for yours. The anti-generic test (Critical Gate 3) is the structural fix.
2. **"Everything is a 6" scoring theatre.** When 10 initiatives all score ICE 6, the ranking is meaningless and the team ships whatever's loudest. Force-ranking BEFORE scoring (Critical Gate 2) creates differentiation; the rank sets the ceiling, not the reverse.
3. **Capacity overcommitment.** Teams routinely "approve" 7 initiatives, ship 0 well. The ≤3-above-cut-line rule (Critical Gate 4) forces the conversation about what gets parked.

The structural answer is the hard-gate on `diagnose-*.md`. Without a validated root cause, every initiative is untethered. That's why this skill cannot Cold Start — it refuses to substitute interview for the diagnostic rigor.

---

## Philosophy

Initiatives must clear the **anti-generic test**: delete the root cause reference from the hypothesis. If the initiative still makes sense for any company, it's generic. Rewrite or kill.

ICE scoring is **evidence-backed, not political**:
- **Impact (1-10):** how much does this move the target metric? Cite baseline + comparable case study + confidence.
- **Confidence (1-10):** how sure are you it'll work? Cite evidence (Wayback, prior data, vendor case study, A/B benchmark — NOT vibes).
- **Effort (1-10, INVERSE — higher = easier):** how hard to ship? Cite person-weeks + dependencies + unknowns.

Scores without one-sentence evidence in the **Key Evidence** column are political. Reject them.

---

## When NOT to use this skill

- **No validated root cause.** Run `diagnose` first. Hard gate enforced — skill returns NEEDS_CONTEXT. Initiative ranking against an unvalidated hypothesis is theatre.
- **HOW to build, not WHAT to pursue.** That's `discover`. Prioritize chooses *which* initiative; discover scopes *how* to deliver it.
- **Technical architecture for a chosen initiative.** That's `architect-system` (product-skills). Prioritize doesn't design the build.
- **Numeric target-setting on prioritized initiatives.** That's `plan-funnel`. Prioritize is upstream — it produces the ranked list that funnel-planner sets targets against.
- **"Help me decide between two options."** Use inline judgment + the ICE rubric. Don't dispatch the full orchestration for a 2-option decision.
- **Backlog grooming.** Backlog management is `breakdown-tasks` territory. Prioritize is for strategy-level option selection, not engineering ticket triage.

---

## The forced-ranking ceiling

Force-ranking before scoring is the single most important mechanic in this skill. It works because:

- Asking "if you could only do ONE, which?" forces a real comparison.
- The #1 rank sets the ICE ceiling — if #1 gets ICE 25, nothing else can score higher.
- When the ranking and the scoring disagree (e.g., #3-ranked initiative gets a higher ICE than #1), the disagreement IS the signal — usually the ranker over-weighted intuition or the scorer under-weighted execution risk. The critic flags this.

Skip the rank, and ICE scores cluster between 5 and 7. Force the rank, and the spread becomes diagnostic.

---

## The ≤3 cut-line rule

More than 3 active initiatives means none get full attention. The cut-line-agent enforces this regardless of how many score above an arbitrary threshold.

- **Proceed** — top initiatives by ICE, capped at 3 (or fewer if team capacity is tight). Each gets owner + target metric + kill criteria.
- **Park** — high-scoring initiatives that can wait until current batch ships. Revisit explicit.
- **Kill** — low ICE OR redundant with a Proceed initiative OR fails effort/capacity. Written to `docs/forsvn/artifacts/meta/out-of-scope/` so future sessions don't re-debate.

The cut-line is where Strategy turns into Execution. Don't dilute it.

---

## Churn special case

If `diagnose-*.md` identifies churn as the root cause, the initiative-generator-agent loads `references/churn-playbook.md` automatically. This adds 5 churn-specific initiative archetypes (cancel-flow optimization, dunning, health-score onboarding, exit-reason mapping, retention-pricing test) that wouldn't surface from a generic brainstorm.

Three additional churn refs co-load:
- `references/churn-cancel-flow-templates.md` — cancel-flow email + dunning sequences
- `references/churn-health-score-guide.md` — health-score implementation + calibration

This is the only routed-by-root-cause behavior in the skill. Other root causes (acquisition, activation, monetization) use the generic `initiative-types.md` + `initiative-planning.md` only.

---

## Unconventional scan — when to skip

The unconventional-agent (Layer 1.5 parallel) produces 2-4 asymmetric/non-obvious tactics. It's part of Route A (default).

Skip it (Route B) only when:
- The user has already identified approaches and wants ranking, not generation.
- Time-critical AND user confirms skipping the asymmetric scan.
- The problem space is well-understood with clear standard solutions and the user wants execution velocity over option breadth.

Default behavior is "always include unconventional" because the cost is low (one parallel agent) and the upside is occasional — most unconventional initiatives get parked or killed, but the 1-in-5 that ships becomes the differentiator.

---

## Out-of-scope persistence — why kills are written to disk

After every run, the cut-line-agent's Kill decisions are persisted to `docs/forsvn/artifacts/meta/out-of-scope/[kebab-name].md`. Each file carries:

- **Decided:** date
- **Context:** root cause + goal that prompted this analysis
- **Decision:** Killed because [reason from Kill criteria]
- **Revisit if:** condition that would change the decision (e.g., "team grows to 5+", "root cause shifts to retention")

This prevents future sessions from re-debating settled decisions. `discover` and `orchestrate-*` skills are supposed to read this directory before recommending workflows or asking about features already rejected. The contract is load-bearing — don't skip the write.

---

## Skill deference

| Situation | Defer to |
|---|---|
| diagnose-*.md missing | `diagnose` (hard gate) |
| User wants HOW to build a chosen initiative | `discover` |
| User wants technical architecture for a Proceed initiative | `architect-system` (product-skills) |
| User wants numeric targets on Proceed initiatives | `plan-funnel` (Next Step in artifact) |
| User wants execution task list | `breakdown-tasks` |

---

## When the critic returns FAIL

Max 2 rewrite cycles. The critic's report names the specific gate (1 of 9), the fix, and the agent to re-dispatch. Read the routing table in `agents/critic-agent.md` Failure Routing section if unsure which agent owns the gate.

After 2 FAIL cycles → deliver with a "Known Issues" section listing unresolved gate failures. Don't loop indefinitely. The escape valve preserves momentum; the operator can re-run with a sharper input if the critic was right.

---

## Refactor history

- **2026-05-18 (v6 Phase 2 Wave 2):** body refactored 435 → 113 lines (-74.0%, 322 lines saved — second-largest absolute in v6 program after discover's 383). 6 new refs: this playbook, `procedures/pre-dispatch.md`, `procedures/dispatch-mechanics.md`, `format-conventions.md`, `examples/prioritize-walkthrough.md`, `anti-patterns.md` (newly extracted from body). Existing 6 data-catalog refs (ice-scoring-rubric, initiative-planning, initiative-types, churn-playbook, churn-cancel-flow-templates, churn-health-score-guide) unchanged. 7 sub-agents (`agents/`) unchanged. Cross-stack contract preserved byte-identical: 4 Critical Gates, frontmatter, Phase 1 initiative format (Hypothesis/Mechanic/Target Metric/Anti-generic check), Phase 2 Forced Ranking + ICE Scoring table schema + Decisions table schema, Cut line statement, Next Step block, Out-of-Scope Persistence file format.
- **2026-06-05 (gate-coherence fix, still v1.0.0):** unified the critic to a **9-point quality gate** — added **Gate 7 (Force-rank ceiling)** so the critic actually enforces the rank↔ICE-ceiling invariant that Critical Gate 2, this playbook's "forced-ranking ceiling" section, and the walkthrough already described it checking but no gate implemented. Pass: #1-ranked carries the highest ICE total AND force-rank order agrees with ICE order (no item >2 positions off without justification); FAIL routes to `ranking-agent` (rank is the tiebreaker) or `ice-scoring-agent`. Renumbered Cut line ≤3 → Gate 8 and Proceed validation → Gate 9; swept the count model across SKILL.md, `agents/critic-agent.md`, `anti-patterns.md`, `examples/prioritize-walkthrough.md`, `procedures/dispatch-mechanics.md`, `format-conventions.md`; corrected the `anti-patterns.md` "Gate N catch" references that had drifted onto the walkthrough's divergent numbering, and replaced the walkthrough's invented Catalog-B critic table with the canonical 9 gates. No behavior added beyond making the SoT-promised ceiling check fire (mirrors brief-landing-page CP-14 wire-in `f29b95c` + research-icp `545b358`). Deterministic coherence fix, no rollout; skill `metadata.version` unchanged.
