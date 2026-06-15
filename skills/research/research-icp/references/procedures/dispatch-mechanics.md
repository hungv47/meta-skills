# Procedure — Dispatch Mechanics (icp-research)

> Load at Layer 1 dispatch entry. Encodes the 6-step Dispatch Protocol (how to spawn each sub-agent), the Single-agent fallback, the Layer 1 + Layer 2 spawn details, the Critic Gate FAIL routing, the post-write side effects, the chain position, and the skill deference table.

---

## How to spawn a sub-agent (6 steps)

For each agent dispatched below, use the **Agent tool** with a prompt built as follows:

1. **Read** the agent instruction file (e.g., `agents/persona-agent.md`) — include FULL content in the Agent prompt.
2. **Append** brief and context after instructions.
3. **Resolve paths to absolute**: replace relative paths with absolute paths rooted at this skill's directory (e.g., `references/voice-of-customer.md` → `/path/to/icp-research/references/voice-of-customer.md`). Tell agent: "Read reference file at [absolute path] for domain knowledge."
4. **Pass upstream artifacts by content, not path**: orchestrator reads `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` first, then includes relevant excerpts (product, buyer, problem, differentiator) in context. Sub-agents do NOT read artifacts directly — orchestrator curates.
5. If **feedback** exists (critic FAIL cycle), append at end with header "## Critic Feedback — Address Every Point".
6. **Include load-class tags on cited refs** so agents under `--fast` know which refs are skip-eligible. PLAYBOOK + EXAMPLE refs are skip-eligible under `--fast`; PROCEDURE + ANTI-PATTERN refs are NOT.

---

## Single-agent fallback

If multi-agent dispatch unavailable (no Agent tool, single-agent runtime, context constraints), execute each agent's instructions sequentially in-context:

- **Layer 1:** Run each agent's instructions one at a time — persona, VoC collection, habitat mapping.
- **Layer 2:** Apply pain analysis to Layer 1 outputs, then decision psychology, then synthesis.
- **Critic:** Self-evaluate using critic-agent quality gate.
- Produce the complete artifact as if all agents had run.

Output quality is equivalent — multi-agent pattern optimizes parallelism and focus, not capability.

---

## Layer 1: Parallel Research Agents

Spawn **IN PARALLEL** (multiple Agent tool calls in one message). All three Layer 1 agents are independent — they read product context + brief, produce isolated outputs, and don't depend on each other.

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| Persona Agent | `agents/persona-agent.md` | brief + product context | — |
| VoC Collector Agent | `agents/voc-collector-agent.md` | brief + product context | `references/voice-of-customer.md` [data catalog], `references/customer-interviews.md` [data catalog] |
| Habitat Agent | `agents/habitat-agent.md` | brief + product context | `references/habitat-mapping.md` [data catalog] |

**Quick ICP (Route A):** Dispatch only persona-agent + voc-collector-agent. Skip habitat-agent. After Layer 1, orchestrator holds all outputs (persona cards, VoC library, [habitat map if Route B]) ready for Layer 2.

**Layer 1 merge step:** No transformation. Orchestrator concatenates the 2-3 outputs into a single "Layer 1 context" object that gets passed to Layer 2 sequentially.

---

## Layer 2: Sequential Analysis Chain

Dispatch **ONE AT A TIME, IN ORDER** via Dispatch Protocol. Each receives the previous agent's output (plus relevant Layer 1 outputs) as `upstream`.

```
pain-analysis-agent → decision-psychology-agent → synthesis-agent → critic-agent
```

| Step | Agent | Instruction File | Receives |
|------|-------|-----------------|----------|
| 1 | Pain Analysis Agent | `agents/pain-analysis-agent.md` | persona-agent output + voc-collector-agent output |
| 2 | Decision Psychology Agent | `agents/decision-psychology-agent.md` | pain-analysis-agent output |
| 3 | Synthesis Agent | `agents/synthesis-agent.md` | ALL upstream: persona + VoC + habitat + pain + psychology |
| 4 | Critic Agent | `agents/critic-agent.md` | synthesis-agent output |

**Quick ICP (Route A):** Skip decision-psychology-agent. Pain-analysis feeds directly to synthesis (with no `decision_psychology` input), then critic. Critic still runs all 10 gates but Gate 4 (Decision Psychology Specificity) automatically PASSes with an "empty per Route A" note.

---

## Critic Gate

Critic returns one of two verdicts:

### PASS
Artifact meets all 10 quality gates. Deliver synthesis output to `docs/forsvn/canonical/research/ICP.md`. Run post-write side effects (below).

### FAIL
Critic returns:
- Which gate failed and what's wrong (per the 10-gate Quality Gate Criteria in `agents/critic-agent.md`).
- Specific fix instructions.
- Which agent to re-dispatch (per the Rewrite Routing Table — see critic-agent.md for the canonical mapping).

**Rewrite loop:**

1. Read failure report.
2. Re-dispatch ONLY the named agent(s) with critic feedback as `feedback` input.
3. If fix affects downstream agents (e.g., voc-collector re-runs → pain-analysis + synthesis must re-run too), re-run chain from fixed agent forward.
4. Run modified output back through critic.
5. **Max 2 rewrite cycles.** After 2 failures, deliver with annotations and flag: "ICP scored below quality gate — manual review recommended on [specific sections]."

The Rewrite Routing Table in `agents/critic-agent.md` is authoritative:

| Gate Failure | Re-dispatch to |
|---|---|
| Gate 1 — VoC Evidence Integrity | voc-collector-agent |
| Gate 2 — Habitat Specificity | habitat-agent |
| Gate 3 — Emotional Driver Traceability | synthesis-agent |
| Gate 4 — Decision Psychology Specificity | decision-psychology-agent |
| Gate 5 — Quote Volume & Coverage | voc-collector-agent |
| Gate 6 — Persona Constraint | persona-agent |
| Gate 7 — Brief Alignment | persona-agent + orchestrator (scope error — may need full re-dispatch) |

**Multiple failures (3+ gates):** Recommend orchestrator re-run from the failing layer rather than patching individual agents.

---

## Post-write side effects (mandatory on PASS or done_with_concerns)

After critic PASSes (or artifact ships with done_with_concerns annotations):

1. **Write `docs/forsvn/canonical/research/ICP.md`** with frontmatter (skill, version, date, status, stack: research, review_surface: html, id: icp-research, type: canonical, keywords) + body per `format-conventions.md` Artifact Template.
2. **Write or update `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`** with the 8-section schema per `format-conventions.md` Step 0 Product Context. On re-run with prior context, update in place; on first run, create.
3. **Experience write-back** per `pre-dispatch.md` Write-back map:
   - Q1 (Product) → append to `experience/product.md` AND ensure `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` Product section reflects it (canonical mirror).
   - Q2 (Buyer) → append to `experience/audience.md` as `Audience — primary persona`.
   - Q3 (Pains) → append to `experience/audience.md` as `Audience — pain points (primary)`.
   - Q4 (Geo) → append to `experience/audience.md` as `Audience — geo focus`.
   - Q5 (Route) → NOT persisted (routing-only).
4. **Versioning:** On re-run, overwrite prior `docs/forsvn/canonical/research/ICP.md` in place and increment the integer `version:` (prior versions live in git history — no `.v[N].md` siblings under `canonical/`). Update `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` in place similarly.

**BLOCK does NOT trigger write-back.** Partial runs that fail at the synthesis layer (e.g., critic FAIL after 2 cycles + operator deems Known Issues too severe to ship) do not persist canonical state. The previous `docs/forsvn/canonical/research/ICP.md` (if any) remains the source of truth.

---

## Chain Position

**Previous:** none (foundational skill) OR any skill needing audience context (Route C — called by another skill).

**Next:** `plan-campaign`, `create-brand` (marketing-skills). Both consume `docs/forsvn/canonical/research/ICP.md` + `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`.

**Foundational role:** Creates `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`, used by 13+ downstream skills across all 4 stacks (comms, strategy, prod, design). Run first for significantly better downstream output. The recommended starting point per `research-skills/CLAUDE.md`.

**Re-run triggers (operator judgment):** Audience pivot, new market entry, major product changes, or quarterly for active products.

---

## Skill Deference

| Situation | Defer to |
|---|---|
| Competitive analysis / market sizing | `research-market` |
| Campaign planning from personas | `plan-campaign` |
| Brand identity using audience data | `create-brand` |
| Diagnose a business problem (not audience) | `diagnose` |

---

## Mode-resolver interaction

`metadata.budget: deep` → modal path is Route B (Full ICP).

- `--fast` flag or "fast mode" phrasing → Route A (Quick ICP) IF sufficient context exists for Warm Start (skips habitat-agent + decision-psychology-agent); critic gate collapses to single pass (no rewrite loop). Cold Start STILL fires when context is missing — `--fast` does not authorize hallucinating personas (Critical Gate 1 floor).
- `--deep` flag or "thorough analysis" phrasing → Route B with critic loop max 2 cycles. (Same as default but reinforces willingness to iterate.)
- Otherwise: Route B is default.

Echo the chosen route at the end of the Cold Start / Warm Start confirmation. Operator can override before dispatch.

---

## Anti-patterns in dispatch

- **Dispatching Layer 2 before Layer 1 fully completes.** Layer 2 agents need ALL Layer 1 outputs in context — partial dispatch corrupts pain analysis (which needs persona + VoC) and synthesis (which needs everything).
- **Skipping the critic gate on `--fast`.** `--fast` collapses critic to a single pass; it does NOT skip the critic entirely. Without the critic, the 10 quality gates are unenforced and Critical Gate 1 / 2 / 3 violations ship silently.
- **Re-dispatching the wrong agent on critic FAIL.** Use the Rewrite Routing Table in `agents/critic-agent.md` verbatim. Sending a "Habitat Specificity" failure to voc-collector-agent wastes a rewrite cycle.
- **Forcing a 3rd rewrite cycle.** Max 2 per the original SKILL.md. After 2 FAILs, ship with annotations — don't loop indefinitely.
- **Skipping the post-write canonical mirror.** Q1 (Product) writes to BOTH `experience/product.md` AND `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`. Skipping the latter leaves downstream skills reading a stale or empty product-context, defeating the foundational role.
