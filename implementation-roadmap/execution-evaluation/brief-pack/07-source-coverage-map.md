# Brief 07 — Source Coverage Map

## Rule

Treat every item below as unimplemented until the implementation agent proves otherwise by inspecting the repo.

Ignore `STATUS: COMPLETE`, `SUPERSEDED`, or similar labels inside source files. They are stale planning metadata.

## `sources/IDEA-2.md`

Covered in:
- `03-capability-upgrades.md`
- `05-evaluation-learning-loop.md`
- `06-operator-quality-integrations.md`

Ideas to preserve:
- Pangram-aware human writing and detector regression
- Unique Mechanism for copywriting
- 6 Necessary Beliefs
- Argument Engineering
- Discovery Story
- Shared copy/ad research workflow
- Meta 4-step filtering process
- Message Transmutation
- Advertorial pre-lander / Chad Funnel
- AI UGC VSSL
- Contrast Principle
- Variable Subtraction
- Eval learnings promoted into experience
- Quality dashboard
- Post-humanize regression checks
- Research artifact evaluation
- Critic override logging
- Shared rubrics
- Critic consensus mode for high-stakes outputs

## `sources/IDEA-3.md`

Covered in:
- `06-operator-quality-integrations.md`
- `02-skill-surface-naming.md`

Ideas to preserve:
- New or renamed service extraction skill
- Structural extraction mode for code cleanup
- Fresh-eyes closeout workflow
- Target auto-detection from git state
- Parallel test/review
- Review noise filtering
- Fix/rerun iteration protocol
- Final report convention

## `sources/IDEA-4.md`

Covered in:
- `04-production-layer.md`
- `05-evaluation-learning-loop.md`
- `01-foundation-forsvn-state.md`

Ideas to preserve:
- Production/execution layer
- Evaluation layer
- Feedback loop architecture
- Strategy → execution → evaluation loop as one system

## `sources/IDEA-4a-execution-production.md`

Covered in:
- `04-production-layer.md`

Ideas to preserve:
- `produce-asset`
- `publish-social`
- `produce-video`
- human review gate
- export/draft/publish modes
- safe fallback when credentials or tools are missing
- preview-first production

## `sources/IDEA-4b-evaluation-layer.md`

Covered in:
- `05-evaluation-learning-loop.md`

Ideas to preserve:
- short-form eval rubric on disk
- quality dashboard spec
- critic introspection protocol
- `evaluate-ad`
- `evaluate-content`
- `evaluate-campaign`
- Karpathy-style autoresearch loop
- rubric revision triggers
- manual metric entry as first-class path

## `sources/IDEA-4c-feedback-loop.md`

Covered in:
- `01-foundation-forsvn-state.md`
- `05-evaluation-learning-loop.md`

Ideas to preserve:
- canonical experience directory
- eval finding promotion rules
- skills reading experience before invocation
- quality dashboard
- cross-skill learning propagation
- artifact provenance frontmatter
- artifact → eval → learning → next run loop

## `sources/IDEA-5.md`

Covered in:
- `01-foundation-forsvn-state.md`
- `03-capability-upgrades.md`
- `02-skill-surface-naming.md`

Ideas to preserve:
- product-marketing context file
- 12-section shared context schema
- autodraft from README, package.json, landing pages, research, brand docs
- AI SEO
- `/pricing.md`
- `/docs/llms.txt`
- bot-by-bot robots.txt
- Seven Sweeps editing
- expert panel scoring
- ICP confidence labeling
- Digital Watering Hole methodology
- sample bias checks
- programmatic SEO taxonomy
- reference-file pattern for keeping skill bodies concise

## `sources/briefs.md`

Covered across:
- all brief-pack files

Ideas to preserve:
- original layer breakdown
- dependency map
- all deduplicated source ideas

This file is useful as a raw inventory, but the implementation agent should follow the newer brief-pack layers.

## `ideas.md`

Covered in:
- `00-executive-brief.md`
- `01-foundation-forsvn-state.md`
- `02-skill-surface-naming.md`
- `03-capability-upgrades.md`
- `05-evaluation-learning-loop.md`

Ideas to preserve:
- `/forsvn` core orchestrator
- implementation agent interview requirement
- verb-first skill naming
- `.forsvn` consolidation
- all-skill audit
- frontmatter audit
- humanmaxxing
- platform-specific content strategy
- reorganized implementation layers

## Implementation Agent Warning

Do not implement directly from source order. Source order is historical. Use the brief-pack order:

1. Decisions and `/forsvn`
2. State/artifacts
3. Naming and skill surface
4. Capability upgrades
5. Production
6. Evaluation/learning
7. Operator quality and integrations
