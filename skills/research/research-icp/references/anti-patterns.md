# Anti-Patterns — icp-research

> 12 named anti-patterns that kill audience-research validity. Each includes detection, why it fails, the fix, and the agent responsible for catching it (verified against `agents/critic-agent.md` Rewrite Routing Table). Critic-load reference — re-read before any output ships. The first 7 are the canonical body anti-patterns from the original SKILL.md, expanded with detection + bad/good examples + ownership; the remaining 5 are cross-cutting failures caught at the orchestrator or operator level.

---

## 1. Guessing Personas Without Evidence

**What it is:** Inventing "Sarah, 34, EM" because it sounds right, without VoC quotes or brief details to back it.

**Detection:**
- Persona demographics include specific names/ages with no source for those specifics.
- Pain Profile entries lack Quote sub-fields, OR Quote sub-fields are paraphrased rather than verbatim with attribution.
- Persona reads like a marketing-deck template (round numbers, archetypal job title, generic frustrations).

**Why it fails:** Critical Gate 1 explicitly forbids guessed personas. 13+ downstream skills consume this artifact; a guessed persona seeds wrong messaging, wrong channels, wrong product decisions across all 4 stacks.

**Fix:** persona-agent builds from product context + brief; pain-analysis-agent validates every pain claim against VoC quotes. If brief is too thin to anchor demographics, return `NEEDS_CONTEXT` and recommend the user run `discover` for scope clarification first.

**Owned by:** persona-agent (generation) + critic-agent (Gate 1 catch — flags unattributed quotes; Gate 6 catch — flags persona-count violations that often correlate with guessing).

---

## 2. Skipping Habitat Mapping for Speed

**What it is:** Dropping habitat-agent because "we know they're on Reddit" or because Route A (Quick ICP) feels faster.

**Detection:**
- Artifact has empty Habitat Map section without the Route A "skipped per Route A" annotation.
- Habitat Map entries use platform-only language (`Reddit`, `LinkedIn`) without naming the specific community.

**Why it fails:** IMC planning (campaign-plan downstream) needs specific community names with density + engagement type. "They're on LinkedIn" doesn't tell campaign-plan which group, which hashtag, which content type. Without this, channel selection becomes guesswork.

**Fix:** Use Route A (Quick ICP) explicitly when speed > depth — Route A's `format-conventions.md` annotation makes the omission visible to downstream skills. Don't silently omit habitat mapping in Route B.

**Owned by:** habitat-agent (generation) + critic-agent (Gate 2 catch — habitat specificity).

---

## 3. Fabricating VoC Quotes

**What it is:** Generating plausible quotes when research returns thin results.

**Detection:**
- Quotes that sound suspiciously perfect, use marketing language, or read like the AI wrote them.
- Quotes lacking specific community attribution (`Reddit` instead of `r/ExperiencedDevs`).
- No date or context provided where relevant.
- Multiple quotes with similar cadence/vocabulary suggest single-source authorship (the agent's).

**Why it fails:** Critical Gate 1 explicitly forbids fabricated quotes. Downstream skills (ad-copy, copywriting, social-copy) lift quotes directly into messaging — fabricated quotes become public claims the product can't defend.

**Bad example:**
> Quote: "This tool changed how our entire engineering org operates." — Twitter

**Good example:**
> Quote: "I spend more time telling people what I did than actually doing it." — r/ExperiencedDevs, comment thread on PR review tooling, 2025-11-14

**Fix:** voc-collector-agent documents gaps honestly. If VoC search returns <15 quotes, flag confidence LOW, recommend user provide customer quotes, support tickets, or sales call notes. Don't backfill with fabrications.

**Owned by:** voc-collector-agent (generation) + critic-agent (Gate 1 catch — VoC Evidence Integrity; Gate 5 catch — Quote Volume & Coverage).

---

## 4. Too Many Personas

**What it is:** 3+ personas because research surfaced distinct segments.

**Detection:**
- Artifact has 3, 4, or more `## Persona N:` sections.
- Segment overlap is high (two personas share 60%+ of pain points, habitat, or decision psychology).

**Why it fails:** Critical Gate 3 explicitly caps at 2. 13+ downstream skills lose focus when given 4 personas; campaign-plan can't allocate budget, copywriting can't pick a target reader, ad-copy can't write a single primary message.

**Fix:** Force-rank to 2 max by revenue potential. Document who was cut and why in an optional Segment Rationale section. If the segments genuinely don't merge (two distinct buyers with no overlap), return `BLOCKED` per Completion Status and ask user for scope decision.

**Owned by:** persona-agent (generation — should refuse to emit 3+) + critic-agent (Gate 6 catch — automatic FAIL).

---

## 5. Platform-Level Habitat Mapping

**What it is:** "They're on LinkedIn" without naming the group, hashtag, or content type.

**Detection:**
- Habitat Map Community column says `LinkedIn feed`, `Twitter`, or `Reddit` without a subreddit/hashtag/group name.
- Density assigned as `H` for an entire platform (impossible — density is per-community, not per-platform).
- Engagement type is "various" or "mixed" rather than `Lurker` / `Engager` / `Creator`.

**Why it fails:** Critical Gate 2. Specifically: campaign-plan reads density + engagement type to pick primary vs secondary channels. "LinkedIn — H — various" gives no signal; "LinkedIn #engineeringmanagement feed — M — Creator" gives a clear signal that this audience CREATES content there (which means a thought-leadership content plan, not a paid ads plan).

**Fix:** habitat-agent enforces "named community" requirement at generation. Every entry names a specific community per `references/habitat-mapping.md` taxonomy.

**Owned by:** habitat-agent (generation) + critic-agent (Gate 2 catch).

---

## 6. Recycling Stale Research

**What it is:** Reusing personas and VoC without re-validation.

**Detection:**
- `docs/forsvn/canonical/research/ICP.md` date is >90 days old AND product has shipped meaningful changes since.
- Re-run requested but skill returns prior artifact unchanged (Route C cache-hit) without prompting user.
- `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` date is >30 days old AND skill proceeds without warning (Critical Gate 4 violation).

**Why it fails:** Markets shift, competitors launch, pain points evolve. Stale research produces messaging that misses where the audience is NOW. The product-context.md staleness gate exists because the product-context schema (price, model, differentiator) changes faster than the audience profile — running icp-research against stale product-context.md ships a persona for a product that no longer exists.

**Fix:** Critical Gate 4 — Stale product context (>30 days) → recommend re-running upstream (icp-research itself, since it's the canonical producer). If user proceeds, note "stale product context" in artifact header. For general re-run decisions (>90 days, audience pivot, market entry), operator judgment applies per `procedures/pre-dispatch.md` § "Staleness check on prior icp-research."

**Owned by:** orchestrator (Critical Gate 4 emission) + persona-agent (re-run scope check).

---

## 7. Ignoring Critic FAIL

**What it is:** Delivering a failed artifact because "close enough."

**Detection:**
- Critic returned FAIL but artifact shipped with no rewrite attempt.
- Artifact shipped after 2 rewrite cycles without the "ICP scored below quality gate — manual review recommended on [specific sections]" annotation.

**Why it fails:** The 10 quality gates exist because the 13+ downstream skills depend on them. Shipping a FAILed artifact silently propagates the defect — campaign-plan plans against thin VoC, ad-copy claims pain points that weren't evidenced.

**Fix:** Re-dispatch named agent with critic feedback. Max 2 cycles per `procedures/dispatch-mechanics.md`. If still FAIL after 2, deliver with Known Issues annotation that names the specific gate(s) and section(s) needing manual review.

**Owned by:** orchestrator (rewrite-loop enforcement) + critic-agent (Rewrite Routing Table).

---

## 8. Hallucinating Personas Under `--fast`

**What it is:** Treating `--fast` as authorization to skip Cold Start and invent product/buyer/pains from a one-line input.

**Detection:**
- `--fast` flag used + Cold Start questions never emitted + persona shipped despite no auto-scan signal.
- Persona demographics specific (age, role, company size) when input was `--fast "B2B SaaS"`.

**Why it fails:** Per `procedures/pre-dispatch.md` § "Cold Start STILL fires under `--fast`": `--fast` skips orchestration weight (no habitat-agent, no decision-psychology-agent, no rewrite loop), but it does NOT skip the correctness floor. Critical Gate 1 (VoC or interview evidence only) is a safety gate that supersedes `--fast`.

**Fix:** If `--fast` invoked with thin context, run auto-scan first; if auto-scan also returns thin signal, emit Cold Start anyway. If user explicitly refuses to answer Cold Start under `--fast`, return `NEEDS_CONTEXT` per Completion Status.

**Owned by:** orchestrator (Pre-Dispatch enforcement) — neither critic-agent nor persona-agent catches this; it's an orchestration-level integrity check.

---

## 9. Skipping the Canonical Product-Context Mirror

**What it is:** Writing Q1 (Product) to `experience/product.md` but NOT updating `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`.

**Detection:**
- Post-write side effects fire but `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` Product section is empty or stale.
- Downstream skills (campaign-plan, brand-system, copywriting) report `NEEDS_CONTEXT` because they read product-context.md and find nothing.

**Why it fails:** icp-research is THE canonical producer of `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md`. The Write-back map (in `procedures/pre-dispatch.md`) explicitly mirrors Q1 to both `experience/product.md` (skill-internal) AND `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` (cross-stack). Skipping the canonical mirror defeats the foundational role — 13+ downstream skills read PRODUCT-CONTEXT.md as their single source of truth on product.

**Fix:** Post-write side effects mandatory on PASS — both writes happen as a transaction. If the canonical write fails (file permissions, path resolution), the experience write should also abort.

**Owned by:** orchestrator post-write step in `procedures/dispatch-mechanics.md`. Note: critic-agent does NOT catch this — gates inspect the in-context artifact body, not on-disk side-effect files.

---

## 10. Persisting Q5 (Route)

**What it is:** Writing the route selection (Q5 — Quick ICP vs Full ICP) to `experience/audience.md` as if it were stable user-profile state.

**Detection:**
- `experience/audience.md` has a `Route — last selected` or similar key.
- Subsequent skill invocations pre-fill route from experience without asking.

**Why it fails:** Route is per-invocation choice. The user may want Full ICP this run and Quick ICP next run depending on time pressure and depth needed. Persisting it pollutes experience with routing state that should reset each invocation. The original SKILL.md is explicit: Q5 is `(routing only, not persisted)`.

**Fix:** Write-back map in `procedures/pre-dispatch.md` writes Q1-Q4 to experience; Q5 is omitted. Adding Q5 would be net-new behavior.

**Owned by:** orchestrator post-write step.

---

## 11. Cross-stack contract drift

**What it is:** Renaming a section in the Artifact Template, reordering Persona / Top 3 Emotional Drivers / Red Flags / Next Step, changing the Habitat Map 5-column schema, or substituting field names without atomic update of downstream consumers.

**Detection:**
- `docs/forsvn/canonical/research/ICP.md` body has sections in unexpected order or with renamed headers.
- Downstream skill output references a section name that doesn't exist in the artifact (e.g., campaign-plan asks "where is the Decision Psychology section?" — section was renamed to "Buyer Psychology").
- Habitat Map columns differ from `format-conventions.md` schema.

**Why it fails:** 13+ downstream consumers (campaign-plan, brand-system, copywriting, lp-brief, design-brief, ad-copy, cold-outreach, short-form-research, short-form-brief, humanmaxxing, seo, social-copy, vn-tone) read this artifact's structure. A schema change ripples — silent drift means consumers either fail or substitute defaults.

**Drift modes:**
- Renaming `## Persona N:` to `## Segment N:`.
- Reordering `Pain Profile` / `Decision Psychology` / `Habitat Map` within a persona.
- Changing Habitat Map columns (`Platform | Community | Density | Engagement | Role`).
- Substituting `H / M / L` density values with `High / Medium / Low`.
- Removing `Next Step` block.

**Fix:** Operator review against `references/format-conventions.md` before shipping any schema change. The 10-gate critic inspects CONTENT within the schema but does NOT inspect schema drift — that's an operator-level integration check. If schema-drift catching matters more in the future, an additional critic gate could be added (out of scope for the current refactor).

**Owned by:** operator review (no agent catches this in the current 10-gate critic).

---

## 12. Goals/Audience write-back skipped or partial

**What it is:** Q1-Q4 don't get appended to `experience/{product,audience}.md` after PASS, OR Q5 (Route) gets persisted by mistake.

**Detection:**
- Artifact ships PASS but `experience/product.md` has no new entry for product one-liner.
- `experience/audience.md` has a `Route — last selected` entry (Q5 should NEVER persist).
- Subsequent skill invocations re-ask for buyer / pains / geo because experience is empty.

**Why it fails:** Without persistence, 13+ downstream skills (campaign-plan, brand-system, ...) re-ask the user for the same audience context icp-research already gathered. Wrong persistence (Q5) pollutes experience with stale routing state.

**Fix:** Post-write side effects mandatory on PASS — append Q1 (Product) to `experience/product.md` AND mirror to `docs/forsvn/canonical/product/PRODUCT-CONTEXT.md` (canonical); append Q2 (Buyer) + Q3 (Pains) + Q4 (Geo) to `experience/audience.md`. Q5 (Route) is NOT persisted — lives only in this run's routing decision.

**Owned by:** orchestrator post-write step in `procedures/dispatch-mechanics.md`. Note: critic-agent does NOT catch this — gates inspect the artifact body, not on-disk side-effect files. Operator-level integration check.
