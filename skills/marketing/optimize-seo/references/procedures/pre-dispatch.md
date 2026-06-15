# Procedure — Pre-Dispatch (SEO)

> Load when entering `/optimize-seo` Cold or Warm Start. Captures the full read order, dimensions, Cold/Warm prompts, write-back map, chain position, and IMC-coordination logic.

Wraps the canonical Pre-Dispatch protocol at `references/_shared/pre-dispatch-protocol.md` with seo-specific dimensions.

---

## Needed dimensions

seo needs four dimensions resolved before agent dispatch:

1. **Mode** — `audit` | `ai` | `programmatic` | `competitor` | `aso` (or `full` → Route E, which splits into two artifacts)
2. **Site or property** — domain (audit/ai/programmatic/competitor) OR app store listing / marketplace URL (aso)
3. **Audience** — primary buyer + search behavior; resolves from `research/icp-research.md` if present
4. **Geographic + language scope** — US-en / global-en / multi-language / specific market (e.g., "VN, north dialect, Tiếng Việt")

If any dimension is missing AND not resolvable from artifacts/experience → Cold Start. If all four are resolvable → Warm Start summary + optional probe.

---

## Read order

Before asking, read in this sequence and announce what's resolved:

1. **Pipeline artifacts:**
   - `research/icp-research.md` → audience + search behavior (resolves Q3)
   - `docs/forsvn/artifacts/marketing/campaign-plan.md` → pillars + angles (informs Q1 mode + IMC coordination)
   - `research/product-context.md` → category + product context (informs Q2 site type if domain not supplied)

2. **Experience substrate:**
   - `docs/forsvn/experience/audience.md` → search behavior + geo + language (resolves Q3 + Q4 if previously written)
   - `docs/forsvn/experience/product.md` → product context (informs Q2)
   - `docs/forsvn/experience/business.md` → market scope (informs Q4 if geo previously declared)

3. **Manifest check:**
   - `.forsvn/index/manifest.json` → check for stale `icp-research.md` / `campaign-plan.md` (>30 days → recommend re-running upstream)

---

## Warm Start prompt

When mode + site supplied AND audience resolves from artifacts/experience:

```
Found:
- mode → "[audit | ai | programmatic | competitor | aso]"
- site → "[domain or app store URL]"
- audience → "[from research-icp.md / experience/audience.md]"

Need before dispatching: geographic + language scope (US-en / global / specific)?
```

If geo+language ALSO resolves from experience → skip probe and dispatch directly with a one-line confirmation: "All four dimensions resolved from artifacts. Dispatching [Route X] for [mode]."

---

## Cold Start prompt

When mode unclear OR site not supplied OR no audience context anywhere:

```
seo runs in 5 modes (audit / ai / programmatic / competitor / aso) — each dispatches different agents. Pick the mode first:

1. **Mode** — pick one:
   - **audit** — technical foundations + Core Web Vitals + on-page review
   - **ai** — AI/agent engine optimization (LLMs as discovery channel)
   - **programmatic** — page templates for high-volume keyword targeting
   - **competitor** — comparison content + share-of-voice analysis
   - **aso** — App Store Optimization (Apple App Store + Google Play + G2/Capterra/Product Hunt)
2. **Site or property** — domain (for audit/ai/programmatic/competitor)
   OR app store listing URL (for aso).
3. **Audience** — primary buyer + their search behavior. Or point me at
   `research/icp-research.md` if it exists.
4. **Geographic + language scope** — US-en / global-en / multi-language /
   specific market (e.g., "VN, north dialect, Tiếng Việt").

Answer 1-4 in one response. I'll dispatch the agents for that mode.
```

---

## Write-back map

After Cold Start answers received, persist learnings to experience substrate per the canonical Write-back protocol:

| Q | File | Key |
|---|---|---|
| 3. Audience (if novel / not from research-icp) | `audience.md` | `Audience — search behavior` |
| 4. Geo + language | `audience.md` | `Audience — geo + language scope` |
| 1. Mode | (run-specific, NOT persisted — operator may switch modes per invocation) |
| 2. Site | (run-specific, NOT persisted — domain may vary per invocation) |

**VN auto-routing rule:** if Q4 declares a Vietnamese market AND the artifact will produce user-facing prose (Findings narrative, Priority Actions, Next Step), flag in the Cold Start ack: "VN-market detected — will recommend `polish-vn` polish pass on the artifact's user-facing prose before delivery." See `anti-patterns.md` § "VN-market output without vn-tone."

---

## Chain Position

- **Upstream:** `research-icp` (canonical audience), `plan-campaign` (content pillars + angles), `research-market` (competitive context)
- **Downstream:** `write-copy` (writes the actual page-level copy SEO defines), content production / site updates / engineering implementation
- **Re-run triggers:** quarterly for Technical Audit, monthly for AI SEO, after Google core updates, when entering new keyword territories (operator judgment)
- **Position:** horizontal — invokable independently or post-IMC

---

## Skill Deference

| Situation | Defer to |
|---|---|
| Production copy for comparison pages or SEO-targeted content | `write-copy` (after SEO defines structure/keywords) |
| Content pillar prioritization from market signals | `plan-campaign` (SEO supplies search-demand inputs) |
| Conversion-focused landing-page construction | `brief-landing-page` (marketing-skills) |
| Post-launch landing-page evaluation inside an eval-loop | `evaluate-landing-page` (marketing-skills) |

---

## Coordination with IMC Plan

When `docs/forsvn/artifacts/marketing/campaign-plan.md` exists, seo and the IMC coordinate by pillar:

| Situation | Who Leads | How They Coordinate |
|-----------|----------|-------------------|
| Pillar has search demand | SEO leads topic | IMC provides angles/audience language; SEO provides keyword clusters/structure |
| Pillar is novel/contrarian | IMC leads topic | IMC creates shareable content; SEO optimizes related informational queries |
| Content needs both reach types | Both | Tag angles Searchable/Shareable in IMC; SEO optimizes searchable for AI+traditional |
| Competitor comparisons | IMC leads prioritization | IMC picks which/when; SEO owns technical optimization (schema, structure, internal linking) |

**Rule:** Don't let SEO keyword data override IMC audience insights (or vice versa). Best content addresses real audience pain (IMC) AND has search demand (SEO). On conflict, audience pain wins — non-search channels can promote great content, but ranking can't make irrelevant content convert.

---

## Before Starting (after Pre-Dispatch resolved)

### Step 0: Product Context
Resolve `id:product-context` if present (`find-artifacts --resolve product-context`). If `icp-research.md` or `campaign-plan.md` `date` fields exceed 30 days, recommend re-running upstream — stale audience data weakens strategy.

### Required Artifacts
| Artifact | Source | If Missing |
|----------|--------|------------|
| `icp-research.md` | icp-research | **RECOMMENDED.** Audience search behavior drives strategy. Proceed without is allowed but less targeted. |

### Optional Artifacts
| Artifact | Source | Benefit |
|----------|--------|---------|
| `campaign-plan.md` | campaign-plan | Content pillars inform topic clusters |
| `product-context.md` | icp-research | Product positioning context |

---

## --fast mode

Per `references/_shared/mode-resolver.md`:

- **`--fast` does NOT skip Cold Start.** If mode, site, audience, or geo+language is unresolved → still ask the bundled Cold Start questions. `--fast` only bypasses multi-agent orchestration AFTER context is resolved.
- **`--fast` execution:** single-agent (foundations-agent for audit, ai-presence-agent for ai, etc.) writes the artifact directly; no Layer 2 (no prioritization-agent, no critic-agent); ends with "Ran in --fast mode; rerun without the flag for full critique."
- **`--fast` does NOT skip Critical Gates 1-4** — they're enforced by the single agent's self-check, not by the critic.
