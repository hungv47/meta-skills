---
title: Discover — Step 1 Context Gathering
lifecycle: canonical
status: stable
produced_by: discover
load_class: PROCEDURE
---

# Step 1 — Context Gathering

**Load when:** beginning a discover session (Step 1 of Execution). The orchestrator scans context silently before asking any questions. A few minutes max — this narrows the question set, NOT a separate research step.

---

## Scan targets

- **Codebase**: `package.json`, schemas, entry points, relevant existing implementations (Glob/Grep/Read — not a separate agent)
- **Artifacts**: `docs/forsvn/artifacts/` for existing specs, architecture docs, product context
- **Experience docs**: `docs/forsvn/experience/{domain}.md` for answers from prior sessions
- **Learned rules**: `docs/forsvn/artifacts/meta/records/learned-rules.md` for behavior corrections
- **Out-of-scope decisions**: `docs/forsvn/artifacts/meta/out-of-scope/` — don't re-ask about rejected approaches unless user raises them
- **Project conventions**: skim `CLAUDE.md`

**Rule:** anything found here is a question you don't ask. Step 1 EARNS the user's time by not wasting it on already-answered questions.

## Operator-craft stance load (every non-trivial invocation, regardless of domain)

Read these three before the first question — they shape *how* you push back, not *what* you ask:

- [`../operator-playbooks/ceo-cognitive-patterns.md`](../operator-playbooks/ceo-cognitive-patterns.md) — 18 named instincts (Bezos / Grove / Munger / Jobs / Horowitz / Hastings / Altman / Rams). Stance, not checklist.
- [`../operator-playbooks/yc-six-forcing-questions.md`](../operator-playbooks/yc-six-forcing-questions.md) — Q1-Q6 demand-reality framework with smart routing by product stage.
- [`../operator-playbooks/minimalist-entrepreneur.md`](../operator-playbooks/minimalist-entrepreneur.md) — processize-before-productize, sell-before-scale, red/green-flags rubric.

**Skip the stance load when:** Trivial scoping (clear task, existing codebase, well-defined scope per Adaptive Depth row 1) — the playbooks earn their token cost on Medium/Deep work where the user is making strategic calls.

## Founder-domain frame load (only when product-context matches)

Match the product-context against these frames; load the matching one:

| Trigger | Frame |
|---|---|
| Consumer mobile/web app, app-store distribution, $0→$50M growth questions | [`../operator-playbooks/consumer-app-growth.md`](../operator-playbooks/consumer-app-growth.md) |
| Physical product / DTC e-commerce / Shopify-stack brand | [`../operator-playbooks/dtc-brand-100m.md`](../operator-playbooks/dtc-brand-100m.md) |
| B2B SaaS for human/team users (not pure infra) | [`../operator-playbooks/b2b-saas-bootstrap.md`](../operator-playbooks/b2b-saas-bootstrap.md) |
| Founder has shipped before; second-time discipline questions | [`../operator-playbooks/second-time-founder-discipline.md`](../operator-playbooks/second-time-founder-discipline.md) |
| Pricing / monetization questions, free-tier debate | [`../operator-playbooks/pricing-defaults.md`](../operator-playbooks/pricing-defaults.md) |
| AI agent discoverability, LLM-readable docs/pricing surfaces | [`../operator-playbooks/ai-era-discoverability.md`](../operator-playbooks/ai-era-discoverability.md) |

**Match by job-shape, not keyword.** A B2B-SaaS founder asking pricing questions loads BOTH `b2b-saas-bootstrap.md` AND `pricing-defaults.md`. No match → no founder-domain frame loaded; the operator-craft stance covers it.

**Staleness flag:** If a frame's `last_verified` exceeds 90 days, flag it inline ("frame may be stale; verify before relying on numeric thresholds") but still apply the stance.

## Playbook-citation self-check (Step 6 pairing)

The frames exist to be *used*, not just read. The Step 6 Clarity Check explicitly verifies: did the recommendation cite at least one applicable operator-playbook frame when one was loaded? If a founder-domain frame was loaded but no rule from it surfaced in the recommendation, you've ignored loaded context. Either cite the relevant rule, explain why the frame doesn't apply here, or revisit the recommendation.
