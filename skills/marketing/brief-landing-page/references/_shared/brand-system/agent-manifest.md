<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Create-Brand Agent Manifest

Loaded by the orchestrator when entering Layer 1 dispatch (Route B) or when the
critic re-dispatches a named agent.

## Agents

| Agent | Layer | File | Routes to | Focus |
|---|---|---|---|---|
| Strategy Agent | 1 (parallel) | `agents/strategy-agent.md` | BRAND.md | Purpose, mission, vision, values, positioning, competitive landscape, brand narrative (origin/naming), product-specific sections, digital touchpoints. |
| Personality Agent | 1 (parallel) | `agents/personality-agent.md` | BRAND.md | Jungian archetype (70/30 blend), personality traits, touchpoint-level emotional journey. |
| Voice Agent | 1 (parallel) | `agents/voice-agent.md` | BRAND.md | Voice attributes (Do/Don't), tone range (3 key contexts), primary tagline with V/F/U score. |
| Visual Agent | 1 (parallel) | `agents/visual-agent.md` | Both | Logo → BRAND.md. Visual atmosphere, color system, per-theme palettes, typography, imagery, surfaces, shadows, z-index, do's/don'ts → DESIGN.md. |
| Token Architect Agent | 2 (sequential) | `agents/token-architect-agent.md` | DESIGN.md | 3-layer W3C token system, semantic map, radius-to-archetype, per-theme token tables. |
| Component Token Agent | 2 (sequential) | `agents/component-token-agent.md` | DESIGN.md | Button 6 variants, input specs, card specs, product-specific components, named animations with physics values, motion tokens. |
| Accessibility Agent | 2 (sequential) | `agents/accessibility-agent.md` | DESIGN.md | WCAG AA contrast, touch targets, dark mode audit, focus states. |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Both | Cross-element coherence, BRAND.md narrative quality, DESIGN.md AI-readability, PASS/FAIL. |

## Routes

### Route A — Quick Brand (MVP)

Step 0 pre-dispatch → Layer 1 parallel (strategy-agent + visual-agent — color + typography only, logo deferred) → critic-agent (strategy↔visual coherence only) → re-dispatch on FAIL (max 2 cycles) → deliver Quick Brand artifact.

Quick Brand scope: Purpose/mission/vision, core values, positioning, primary color + neutrals, display + body font, basic type hierarchy. Target platforms still captured at intake. Defers: archetype, voice/tone, full visual identity, token architecture, components, accessibility, dark mode, Visual Renderings, per-platform Digital Touchpoints.

### Route B — Full Brand System

Step 0 pre-dispatch → Layer 1 parallel (strategy + personality + voice + visual) → Merge → Layer 2 sequential (token-architect → component-token → accessibility) → critic-agent → Step 8.5 ASSETS.md projection → Step 9 Visual Renderings (optional) → Step 10 deliver. Re-dispatch named agents on critic FAIL (max 2 cycles). Layer 1 strictly before Layer 2.

## Layer ordering rules

- **Coherence check before Layer 2.** Verify archetype selected by personality-agent aligns with visual-agent choices. Caregiver archetype + sharp/aggressive typography → resolve before dispatching Layer 2.
- **Palette ownership.** Visual-agent is authoritative for color choices and theme palette values. Token-architect systematizes them into the 3-layer architecture (primitive → semantic → component) and adds missing infrastructure tokens (`--popover`, `--popover-foreground`). On conflict, visual-agent wins.
- **Accessibility hand-back.** Accessibility-agent runs after shadow tokens are set. It owns the audit, NOT the fix. If audit demands changes to upstream values (shadow color failing contrast against its surface, primary lightness failing 3:1 against `--primary-foreground`), it reports the failing pair to the critic, which fails the gate and re-dispatches the upstream owner — visual-agent (shadows/colors), token-architect (semantic values), or component-token (component-level overrides).

## Pattern Catalogs (consumed by named agents)

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/brand-archetypes.md` | personality | 12 Jungian archetypes + blend rules. |
| `references/brand-voice.md` | voice | Voice attributes, tone-range conventions. |
| `references/narrative-tension.md` | strategy, personality, critic | 5 tension dimensions + 4 FAIL gates (NT-Q1 through NT-Q4). |
| `references/visual-identity.md` | visual | Atmosphere, color systems, imagery direction. |
| `references/token-architecture.md` | token-architect | 3-layer W3C token system. |
| `references/token-templates.md` | token-architect | Per-theme token table templates. |
| `references/component-tokens.md` | component-token | Button / input / card variants. |
| `references/component-patterns.md` | component-token | Product-specific component patterns. |
| `references/typography-psychology.md` | visual, critic | Type-to-personality coherence. |
| `references/color-emotion.md` | visual, critic | Color-to-emotion coherence. |
| `references/implementation-rules.md` | all | Implementation-level rules for downstream consumers. |
| `references/platform-surfaces.md` | strategy, visual | Per-platform Digital Touchpoints catalog. |
| `references/ai-slop-detection.md` | critic | 0-1 clean / 2-3 review / 4+ regenerate. |
| `references/assets-inventory.md` | Step 8.5 (deterministic) | Emission rules + per-platform templates. |
| `references/paper-artboard-templates.md` | Step 9a | 5 artboard templates (Color, Type, Spacing, UI, Logo). |
| `references/artboard-generation.md` | Step 9a | Paper MCP generation flow. |
| `references/brand-kit-rendering.md` | Step 9d, critic | One-board visual argument + 5 logo concept methods + BK-G1-G9 FAIL gates. |
| `references/artifact-templates.md` | Step 10 | Full BRAND.md / DESIGN.md / ASSETS.md templates. |

## Critic gate routing

PASS → proceed to ASSETS.md projection (Step 8.5), then optional Visual Renderings (Step 9). FAIL → re-dispatch named agent(s) with critic feedback. Max 2 rewrite cycles. After 2 failures, deliver with critic annotations and flag to user.

Full per-step dispatch tables + spawn mechanics: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
