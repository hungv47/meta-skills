# Brief 06 — Operator Quality and Integrations

## Goal

Improve the agent's engineering closeout and add external integrations only where they strengthen an already-working local loop.

## Review Workflow

Upgrade `fresh-eyes` into a stronger post-edit closeout workflow, likely renamed `review-work`.

Capabilities:
- detect review target from git state
- run tests and review in parallel where practical
- filter noisy review output through an actionable-only pass
- fix accepted findings
- rerun relevant checks
- produce a final report with accepted/rejected findings

The highest-leverage part is noise filtering. Review tools often produce too much; the agent should surface what matters.

## Code Cleanup and Service Extraction

Add a dedicated service extraction pattern.

Options:
- new `extract-service` skill
- structural extraction mode inside `clean-code`

The pattern:
- find repeated operational mechanics
- separate orchestration/domain rules from shared mechanics
- extract one block
- replace one caller
- verify
- migrate remaining callers one by one

Use this when code repeats SDK/API/file-system logic across handlers or actions.

## Pangram and Detector-Aware Writing

Pangram is relevant to the human writing work but should not block the local writing loop.

Desired integration:
- optional Pangram API command when credentials exist
- regression fixtures for humanmaxxing outputs
- high-stakes detector mode
- failure should return concerns, not infinite rewrite loops

Core insight: simple rewriting does not evade strong classifiers. Humanmaxxing must change structure, specificity, rhythm, and register.

## External Platform Integrations

Add external integrations after export/manual mode works.

Possible integrations:
- Typefully/X
- LinkedIn browser/API
- Instagram/TikTok/YouTube APIs
- Figma MCP
- image generation APIs
- HyperFrames/Remotion
- Pangram

Each integration needs:
- credential detection
- clear fallback
- no secret leakage
- explicit confirmation before external side effects

## Acceptance Checks

- Review closeout can identify actionable findings without drowning the user.
- Service extraction produces a stepwise migration plan with verification at each caller.
- Pangram is optional and never blocks basic writing improvements.
- Missing external credentials degrade to export/manual instructions.
- No integration publishes, posts, deletes, or mutates external state without explicit confirmation.
