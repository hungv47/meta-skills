# Anti-Patterns — AEO Monitor

> Failure modes specific to AEO measurement. Each pattern: detection rule, why it's wrong, bad/good example, agent ownership for critic re-dispatch.

The 8-item quality gate (in `agents/critic-agent.md`) catches the structural failures. This file enumerates the recurring failure shapes operators and agents fall into, so the critic and the producing agents can name them by id (`AP-N`).

---

## AP-1 — Fabricated zero

**Detection:** A provider/query/keyword cell reports `0%`, `0 citations`, `0 sessions`, or "not cited" when the provider-readiness ledger flagged that provider/source as `unavailable`.

**Why wrong:** A zero implies a measurement happened and returned nothing. An unavailable provider produced no measurement; conflating them turns missing input into false negative evidence.

**Bad:**
> Perplexity | 0% citation rate across all 20 queries

**Good:**
> Perplexity | unavailable | export not supplied (see provider-readiness ledger)

**Agent:** citation-monitor / geo-monitor / traffic-monitor / readiness (originating monitor)

---

## AP-2 — Single-run certainty

**Detection:** A rate (any percentage, any count-out-of-runs framing) computed from n=1.

**Why wrong:** AI provider responses are stochastic. One turn is a binary observation, not a rate. Reporting `100%` from n=1 implies stable behavior; rerunning the same query will produce different cites in many cases.

**Bad:**
> Q3 | OpenAI | 100% citation rate (1/1)

**Good:**
> Q3 | OpenAI | single-run | cited: yes (n=1, single-run — rerun for rate)

**Agent:** citation-monitor

---

## AP-3 — AEO/GEO conflation

**Detection:** Google AI Overview cites counted alongside chat-provider cites in the same metric or inventory section without surface tagging.

**Why wrong:** Different surfaces, different ranking signals, different remediation paths. Aggregating into a single "AI citation count" produces a meaningless number that no strategy work can act on.

**Bad:**
> Total AI citations: 47 (across OpenAI + Perplexity + Google AI Overview)

**Good:**
> Chat-provider citations: 34 (OpenAI + Perplexity, see §3) | Google AI Overview cites: 13 (see §4)

**Agent:** report-agent

---

## AP-4 — Subject-only matrix

**Detection:** A row reports the subject's cite status without listing the cited competitor domains for that query/keyword.

**Why wrong:** "You weren't cited" without "Obsidian was in 5/5 OpenAI runs" hides the actionable half. Cited-domain inventory is the input strategy work needs to know who to displace.

**Bad:**
> Q1 | OpenAI | subject not cited

**Good:**
> Q1 | OpenAI | subject not cited; cited: obsidian.md (5/5), notion.so (4/5), logseq.com (2/5)

**Agent:** citation-monitor + geo-monitor

---

## AP-5 — Strategy creep in the report

**Detection:** Report body contains a prescriptive verb: `rewrite`, `add`, `publish`, `launch`, `create`, `produce`, `optimize`, `fix`.

**Why wrong:** Report body is measurement only. Prescriptions are `optimize-seo`'s job, downstream of the handoff. Mixing them invites the operator to act on monitor-side recommendations that haven't been through the strategy critic gate.

**Bad (in `report.md`):**
> §6 Action: rewrite /spatial-thinking with 40-60-word answer chunks under H2s.

**Good (in `handoff-optimize-seo.md`):**
> ### Gap — Comparison-page surface missing
> Strategy question for optimize-seo: is there a comparison-page surface that explains the subject's position vs Obsidian and Notion?

**Agent:** report-agent

---

## AP-6 — Missing trend section

**Detection:** Report omits §7 entirely, OR §7 has no prior-snapshot reference but skips the `n/a — first snapshot` label.

**Why wrong:** Trend is the point of recurring measurement. A snapshot that doesn't tell you what changed is just a data dump.

**Bad:** §7 absent.

**Good first-snapshot:** §7 — `n/a — first snapshot. Trend computation activates at snapshot v2.`

**Good Nth snapshot:** §7 — `OpenAI subject cite rate: 22% → 31% (+9pp vs 2026-04-23). New top-5 competitor: roamresearch.com (was 8th). AI Overview presence on K3 flipped: absent → present.`

**Agent:** report-agent

---

## AP-7 — Handoff bloat (per-row entries)

**Detection:** `handoff-optimize-seo.md` has >15 entries OR each entry restates a single matrix row.

**Why wrong:** Strategy work needs evidence patterns, not row dumps. 30 per-query gaps overwhelm the consuming skill and obscure the actual signal.

**Bad:**
> ### Gap — Not cited on Q1
> ### Gap — Not cited on Q2
> ### Gap — Not cited on Q3
> [...28 more...]

**Good:**
> ### Gap — Comparison queries: subject absent across providers
> Evidence: AI Citations rows Q4-Q7 (4 comparison queries; 0/5 cited on OpenAI and Perplexity); cited: obsidian.md, notion.so consistently.

**Agent:** report-agent

---

## AP-8 — Provider/model under-specification

**Detection:** A row names `OpenAI` instead of `OpenAI (gpt-4o)`, or `Perplexity` instead of `Perplexity (sonar-pro)`. Date missing on a row that should carry it.

**Why wrong:** Model swaps shift citation behavior independently of subject changes. A trend that mixes gpt-3.5 → gpt-4o results is comparing two surfaces, not measuring change.

**Bad:**
> Q1 | OpenAI | yes (3/5) | cited

**Good:**
> Q1 | OpenAI (gpt-4o, 2026-05-23) | yes (3/5) | cited

**Agent:** citation-monitor / geo-monitor

---

## AP-9 — Referral framed as citation count

**Detection:** Report or handoff equates "AI referral sessions" with "AI citations" or computes a citation rate from referral volume.

**Why wrong:** Referrals are a downstream signal. Citations cause referrals, but referrals also depend on hook copy, click-through behavior, model UI changes, and attribution loss. They are not interchangeable measurements.

**Bad:**
> Perplexity citation rate: 215 sessions / 18 queries = 12 cites/query

**Good:**
> Perplexity referral sessions: 215 (date range YYYY-MM-DD → YYYY-MM-DD). See §3 AI Citations for chat-provider citation evidence; referrals are not equivalent.

**Agent:** traffic-monitor + report-agent

---

## AP-10 — Live API call attempt

**Detection:** Any agent output containing `curl https://api.openai.com`, `requests.post`, or code that purports to execute a provider query.

**Why wrong:** This skill is pure orchestration. The operator runs queries; this skill ingests results. Calling APIs from inside the skill breaks the no-credentials contract, leaks secrets, and creates an unreviewable side effect.

**Bad:** Any code block executing a provider request.

**Good:** Schema for the export the operator should supply.

**Agent:** any agent attempting it (most likely citation-monitor or geo-monitor)

---

## Cross-cutting marketing-stack patterns

The stack-wide marketing anti-patterns (hedge language, vague timelines, generic recommendations) still apply. The 8-item gate covers the AEO-specific failures; the marketing-stack cross-cutting patterns are inherited by the critic implicitly.
