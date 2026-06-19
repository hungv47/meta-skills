# Procedure — Pre-Dispatch (icp-research)

> Load when SKILL.md routes to Pre-Dispatch. Encodes the foundational-skill auto-scan + Cold/Warm Start contract, the read order, the 5-question prompts, and the Write-back map (preserved verbatim from original SKILL.md — icp-research IS the canonical producer of `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`). Canonical Pre-Dispatch spec lives in [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) — this file is the icp-research-specific overlay.

---

## icp-research as foundational skill

icp-research is the **canonical producer of `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`** — the cross-stack record 13+ downstream skills read. This means Pre-Dispatch does double duty:

1. **Gather context** for icp-research's own dispatch (persona, VoC, habitat).
2. **Seed the canonical PRODUCT-CONTEXT.md** that every downstream skill will consume.

Pre-Dispatch answers feed BOTH outputs. Layer 1 agents flesh them out further during dispatch.

---

## Read order (in order)

1. **Auto-scan first** (skill-specific — icp-research is the only stack skill that does this aggressively): README.md, marketing site, pricing page, /docs, package.json. Extract product / buyer / pricing / voice signals to fill in what you can BEFORE asking. The point is to convert as many Cold Start questions as possible into Warm Start confirmations.
2. **Pipeline (optional):** existing `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` if present (re-run case). If found AND date is fresh (<30 days), this is a Warm Start with Q1-Q4 pre-populated — confirm + ask only about gaps + route. If found AND date is stale (>30 days), warn the user per Critical Gate 4 — operator decides whether to proceed or re-run.
3. **Experience (read, don't ask):** `docs/forsvn/experience/product.md` (Product one-liner if persisted by a prior skill) + `docs/forsvn/experience/audience.md` (primary persona / pain points / geo focus if persisted by a prior skill).

After scan + read, present findings and ask only about the gaps.

---

## Warm Start (rich auto-scan or re-run with existing artifact)

Emit a confirmation prompt that summarizes what was scanned + asks only about uncovered gaps:

```
Auto-scan / existing context found:
- product → "[1-line]"
- buyer → "[role + size]"
- pains → "[top 1-2]"

Need before dispatching: geo focus (US / EU / global / specific) and route
(Quick ICP / Full ICP)?
```

The Warm Start prompt is intentionally short — most fields are already inferred. The two questions that almost always need explicit answers are geo focus (signals not always in README) and route (operator preference, not derivable from artifacts).

---

## Cold Start (no scan signal, no prior context — default for greenfield)

Emit one bundled prompt with 5 numbered questions:

```
icp-research builds the canonical product-context + audience profile that
13+ downstream skills read. To start:

1. **Product** — one sentence: what it does, who pays for it.
2. **Primary buyer** — role + company size + B2B/B2C.
3. **Top 1-2 pains** they articulate (verbatim if possible).
4. **Geo focus** — US / EU / global / specific.
5. **Route** — Quick ICP (single persona, fast) or Full ICP (full personas +
   habitats + decision psychology)?

Answer 1-5 in one response. I'll auto-scan README + marketing + pricing pages
to enrich, then dispatch Layer 1.
```

If the user answers without enough signal to define product or buyer (e.g., "B2B SaaS for developers" with no further specificity), return `NEEDS_CONTEXT` per Completion Status — recommend the interview sub-flow (discover skill) before invoking icp-research agents.

---

## Cold Start STILL fires under `--fast`

Cold Start is a safety floor for icp-research. Under `--fast`:

- Orchestration collapses: skip habitat-agent + decision-psychology-agent (Route A semantics — Quick ICP).
- Critic gate collapses to single pass (no max-2 rewrite loop).
- BUT the 5-question Cold Start STILL fires when context is missing. `--fast` does not authorize hallucinating personas — that would defeat Critical Gate 1 (VoC or interview evidence only). If product + buyer + pains can be inferred from auto-scan alone, the Warm Start path applies (no questions); otherwise Cold Start fires.

This matches the canonical mode-resolver contract: `--fast` skips orchestration weight, not the correctness floor.

---

## Write-back map (preserved verbatim from original SKILL.md)

After Pre-Dispatch answers come in AND auto-scan completes, populate `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` (canonical artifact) and the per-domain experience files:

| Q | File | Key |
|---|---|---|
| 1. Product | `product.md` (also `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` as canonical) | `Product — one-line` |
| 2. Buyer | `audience.md` | `Audience — primary persona` |
| 3. Pains | `audience.md` | `Audience — pain points (primary)` |
| 4. Geo | `audience.md` | `Audience — geo focus` |
| 5. Route | (routing only, not persisted) |

This write-back IS in the original SKILL.md (lines 211-219) and IS preserved here verbatim. The key insight: **Q1 writes to TWO places** — the per-domain `experience/product.md` (skill-internal) AND the canonical `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` (cross-stack record). Q2-Q4 write only to `experience/audience.md`. Q5 (route) is routing-only — it informs which agents get dispatched but doesn't persist.

**Pre-Dispatch is NOT the only producer of PRODUCT-CONTEXT.md.** Pre-Dispatch SEEDS the file with the 8-section schema (per `format-conventions.md` and the canonical 12-section spec at `references/_shared/product-marketing-context-schema.md`). Layer 1 agents + Step 0 dispatch then enrich it with differentiator, social proof, voice, primary CTA, canonical terminology. The file ships as part of the icp-research artifact bundle.

---

## Required + Optional artifacts table

Embedded in body for visibility (this section is a re-cite, not the source — `format-conventions.md` is the source for the artifact contract):

| Artifact | Source | If Missing |
|----------|--------|------------|
| `PRODUCT-CONTEXT.md` | icp-research | **INTERVIEW** for 8 product dimensions, save to `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`. |

| Artifact | Source | Benefit |
|----------|--------|---------|
| `diagnose.md` | diagnose (hungv47/research-skills) | Problem context sharpens audience research |

The `INTERVIEW` action means: if `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` is missing AND Cold Start can't fill all 8 dimensions, dispatch the interview sub-flow (or recommend the user run `discover` first). icp-research is the canonical producer, so the interview IS the skill's own Cold Start when context is empty.

---

## Route Selection

Route is set by Q5 (user choice) or auto-inferred from intent + context:

| Trigger | Route | Why |
|---|---|---|
| User says "Quick ICP" OR `--fast` with sufficient context (Warm Start) | **A — Quick ICP** | Skips habitat-agent + decision-psychology-agent. Artifact has empty Habitat Map + Decision Psychology sections — noted as limitation in artifact header. |
| Default — full audience research | **B — Full ICP** | All 3 Layer 1 agents (persona + VoC + habitat) → all 3 Layer 2 agents (pain + psychology + synthesis) → critic. |
| Invoked by another skill (campaign-plan, brand-system, copywriting, ...) | **C — Called by Another Skill** | Read context from caller's artifacts. Check `docs/forsvn/canonical/research/ICP.md`: Fresh (<30 days) → return existing; Stale (>30 days) → warn caller, recommend re-run; Missing → run Route B. |

Echo the chosen route at the end of the Warm/Cold Start confirmation. Operator can override before dispatch.

---

## Staleness check on prior icp-research

Original SKILL.md "Re-run triggers" (line 96): "Audience pivot, new market entry, major product changes, or quarterly for active products." These are **operator-judgment** triggers — not automated emissions.

For `PRODUCT-CONTEXT.md` staleness, Critical Gate 4 applies: if Date field is >30 days, warn user and recommend re-running upstream (icp-research itself, since it's the canonical producer). Operator decides whether to proceed; if they do, note "stale product context" in the new artifact's header.

Do NOT auto-emit a "WARNING: prior ICP.md is N days old" message on general re-run. Operator decides when re-research is warranted.

---

## Anti-patterns in Pre-Dispatch

- **Skipping auto-scan to save time.** icp-research's auto-scan is what makes the Warm Start path possible. Without it, every fresh repo defaults to Cold Start, frustrating the operator. Always scan first.
- **Hallucinating product context when Cold Start answers are thin.** If the user says "B2B SaaS" with no further specificity, return `NEEDS_CONTEXT` and recommend `discover` first. Don't fabricate a persona from a one-line product description.
- **Writing to product.md / audience.md / docs/forsvn/canonical/product/PRODUCT-CONTEXT.md BEFORE the artifact ships.** Write-back happens after Layer 1 + Layer 2 dispatch completes AND critic PASSes (or done_with_concerns ships). Partial runs that BLOCK should not persist canonical state.
- **Persisting Q5 (Route).** Route is routing-only — it informs dispatch but never writes to experience/. Adding a `Route — last selected` key to audience.md would be net-new behavior.
- **Auto-emitting staleness warnings on re-run.** Only Critical Gate 4 (>30-day PRODUCT-CONTEXT.md) auto-warns. General re-run staleness is operator judgment.
- **Running Cold Start under `--fast` without honoring it.** Cold Start fires under `--fast` regardless when context is missing — `--fast` only collapses orchestration after context is resolved.

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter research_icp
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
