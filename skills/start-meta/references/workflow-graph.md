# Cross-Stack Workflow Graph

Canonical pipeline definition for cross-stack orchestration. `start-meta` reads this for routing decisions across all 4 plugins.

---

## The Cross-Stack Pipeline

```
                    /start-meta  (top-level entry)
                          │
             ┌────────────┼────────────┬───────────────┐
             ↓            ↓            ↓               ↓
       /start-research  /start-marketing  /start-product   process skills:
             │            │            │               │   ├ /discover
             ↓            ↓            ↓               │   ├ /agents-panel
       (research        (marketing   (product          │   ├ /task-breakdown
        skills)          skills)     skills)           │   └ /fresh-eyes
                                                       │
                                                  (wraps around
                                                  any stack's work)

Cross-stack data flow:
  research/product-context.md   ←── created by icp-research; read by 12+ skills
  research/icp-research.md      ←── read by marketing + cross-stack skills
  research/market-research.md   ←── read by prioritize, campaign-plan
  brand/BRAND.md, DESIGN.md     ←── read by lp-brief, design-brief, copywriting, short-form-brief
  .agents/prioritize.md         ←── read by system-architecture, campaign-plan
  .agents/spec.md               ←── read by system-architecture, task-breakdown
  architecture/system-arch.md   ←── read by task-breakdown
  .agents/product/flow/*        ←── read by system-architecture, task-breakdown
```

**Key insight:** every stack's first artifact is the foundation for every other stack. `research/product-context.md` (from icp-research) is the most-consumed file in the entire system.

---

## The 4 Process Skills (meta-skills, domain-agnostic)

### discover

- **Job:** conversational discovery — clarifies WHAT to build through adaptive conversation (3-5 Qs to multi-round).
- **Produces:** `.agents/spec.md` (optional)
- **Consumes:** `research/product-context.md`, `.agents/product/flow/*.md`
- **When to recommend:** scope is unclear; user has a vague idea; "what should we build". Upstream of any non-trivial work in any stack.
- **Cost:** $0.03–0.10 · 0 agents (single-agent conversational) · fast budget

### agents-panel

- **Job:** multi-agent debate or consensus poll. N agents argue (debate mode) OR independently analyze + aggregate (poll mode).
- **Produces:** `.agents/meta/agents-panel-report.md` (ephemeral)
- **Consumes:** nothing
- **When to recommend:** complex decision needs multiple perspectives. "Which framework should we use?" "Is this LP design strong?" "Should we sunset feature X?"
- **Cost:** $0.15–0.50 · 3–10 agents · standard budget · ~5 min

### task-breakdown

- **Job:** decompose spec/architecture into buildable tasks with acceptance criteria, dependencies, implementation order.
- **Produces:** `.agents/tasks.md`
- **Consumes:** `.agents/spec.md`, `architecture/system-architecture.md`, `.agents/product/flow/*.md`
- **When to recommend:** spec OR architecture exists; user is about to build. Hard-gated.
- **Cost:** $0.15–0.50 · 5 agents · standard budget · ~5 min

### fresh-eyes

- **Job:** post-implementation independent review. Chain: Implement → Review → Resolve. Max 2 rounds.
- **Produces:** `.agents/meta/fresh-eyes-report.md` (ephemeral)
- **Consumes:** nothing (reads code/artifacts directly)
- **When to recommend:** implementation done; user wants second opinion. Auto-suggest after security-sensitive code, data-mutation code, or critical artifacts (system-architecture, brand-system, lp-brief).
- **Cost:** $0.15–0.50 · 2 agents · standard budget · ~3 min

---

## Domain Classification Rules

When parsing user intent, classify into one of:

| Bucket | Signals | Route to |
|---|---|---|
| **research-domain** | "audience", "ICP", "personas", "competitors", "market sizing", "TAM", "diagnose", "metric decline", "prioritize", "ICE score", "funnel math", "revenue targets" | `/start-research` |
| **marketing-domain** | "brand", "voice", "design system", "campaign", "channel strategy", "copy", "headline", "tagline", "CTA", "landing page", "LP", "SEO", "keywords", "AI search", "video", "TikTok", "Reels", "Shorts", "cold email", "outreach", "humanize", "VN tone" | `/start-marketing` |
| **product-domain** | "user flow", "screen", "edge case", "tech stack", "schema", "API design", "file structure", "deployment", "code cleanup", "refactor", "dead code", "machine cleanup", "dotfolders", "README", "docs", "API ref" | `/start-product` |
| **process: scoping** | "what should we build", "scope this", "clarify requirements", "I have an idea" | `/discover` |
| **process: debate** | "debate", "multiple perspectives", "consensus", "what do experts think", "should we…" with no clear answer | `/agents-panel` |
| **process: decompose** | "break this down", "task list", "implementation order", "decompose" | `/task-breakdown` (gated) |
| **process: review** | "review my work", "second opinion", "did I miss anything", "post-implementation" | `/fresh-eyes` |
| **cross-stack** | "launch a feature", "go to market with X", "build and ship Y" — multi-domain | propose 2-3 stack orchestrators in sequence |
| **unknown** | empty, single word, ambiguous | ask scoping question |

---

## Common Cross-Stack Paths

### Path 1: Greenfield product launch

```
1. /discover                    (clarify what to build)
2. /start-research              (icp-research → market-research → prioritize)
3. /start-product               (user-flow → system-architecture)
4. /task-breakdown              (decompose architecture into tasks)
5. (build)
6. /fresh-eyes                  (review the build)
7. /start-marketing             (brand-system → campaign-plan → lp-brief → copywriting)
```

### Path 2: New marketing initiative for existing product

```
1. /start-marketing             (brand-system if missing → campaign-plan → content)
2. /fresh-eyes                  (review LP / copy)
```

### Path 3: Conversion drop investigation

```
1. /diagnose                    (root-cause the metric drop)
2. /prioritize                  (rank fixes)
3. /start-product OR /start-marketing  (depending on whether fix is product or marketing)
4. /fresh-eyes                  (review the fix)
```

### Path 4: Codebase health pass

```
1. /code-cleanup                (audit + refactor)
2. /docs-writing                (refresh docs after cleanup)
3. /fresh-eyes                  (review the cleanup)
```

`start-meta` should propose paths like these when intent spans 2+ domains, but cap at 3 hops. If the path needs 5+ hops, the project is too vague — recommend `/discover` first.

---

## Process-Skill Wrap-Around Rules

These trigger automatic suggestions in addition to the primary recommendation:

- **Before any non-trivial build with unclear scope** → suggest `/discover` upstream.
- **After any critical artifact** (system-architecture, brand-system, lp-brief, security-sensitive code, data-mutation code) → suggest `/fresh-eyes` terminal step.
- **At any decision fork** with ≥2 equally-valid options → suggest `/agents-panel` to debate.
- **Between architecture/spec and implementation** → suggest `/task-breakdown` to decompose.

These are SUGGESTIONS, not recommendations. Mention them as optional terminal steps, don't double-route.

---

## Stale Detection

`start-meta` does broader stale detection than the per-stack starters:

- Project-level mismatch: `CLAUDE.md` describes product X, but `research/product-context.md` describes product Y → flag the whole state as questionable.
- Foundation mismatch: brand voice in `brand/BRAND.md` contradicts ICP segment in `research/icp-research.md` → flag the brand as stale.
- Pipeline-skip: `.agents/prioritize.md` exists but no `research/market-research.md` upstream → unusual; surface for user awareness.

---

## Re-Entry Behavior

`/start-meta` is the most-likely starter to be re-invoked across sessions. Behavior:

1. Read `.agents/experience/meta-workflow.md` for prior breadcrumbs.
2. Read all per-stack breadcrumbs (`research-workflow.md`, `marketing-workflow.md`, `product-workflow.md`).
3. Build a "what's happened across the project" picture.
4. If the user's current ask is the same domain as last session, suggest continuing in that domain.
5. If different domain, route fresh.

---

## Anti-Patterns

- **Don't pick the specific skill yourself** when intent is single-domain. Defer to `/start-X`.
- **Don't recommend more than 3 hops** in a cross-stack path.
- **Don't suggest `/discover` defensively** when user has clear intent.
- **Don't suggest `/fresh-eyes` for trivial work** (small bug fix, README tweak).
- **Don't auto-invoke.** Always print `/skill-name`.
