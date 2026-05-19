# Brief 04 — Production Layer

## Goal

Close the gap between strategy and real output. The stack should not stop at briefs. It should produce assets, videos, and publish-ready or draft social posts with human approval.

## Production Principle

Every production skill must have:
- an export/manual fallback
- a preview before finalization
- explicit human approval before publishing or marking final
- artifact provenance
- safe handling for missing credentials or unavailable tools

No first version should require external APIs to be useful.

## `produce-asset`

Former idea: `asset-produce`.

Takes a graphic/design brief and creates visual assets.

Inputs:
- design brief artifact
- target platforms
- brand assets
- copy to render
- color/type tokens

Possible routes:
- image generation
- Figma MCP
- programmatic SVG/vector rendering

Quality gate:
- aspect ratio
- safe zones
- legibility
- color fidelity
- no hallucinated logos or brand marks

Output:
- platform-named files under the canonical artifact tree
- preview and approval state

## `produce-video`

Former idea: `video-produce`.

Takes a short-form brief and produces a preview-quality video first.

Routes:
- HyperFrames
- Remotion
- browser recording
- TTS and caption tooling when available

Quality gate:
- duration matches brief
- captions are readable
- CTA is visible
- audio timing is acceptable
- final render requires approval

Fallback:
- generate a complete render script and asset manifest when the runtime is unavailable.

## `publish-social`

Former idea: `social-publish`.

Takes social copy and media artifacts and prepares or publishes platform posts.

Modes:
- `export` — local publish-ready file, no credentials
- `draft` — platform draft, requires auth
- `publish` — live post, requires explicit confirmation

Platform priority:
1. X/Twitter via Typefully or API
2. LinkedIn via browser/API
3. Instagram
4. YouTube
5. TikTok

Hard rule: never publish live without explicit current-session confirmation.

## Future Production Surfaces

Ad creation and landing page placement are valid later surfaces, but first pass should focus on asset, video, and social because they map cleanly from existing briefs.

## Acceptance Checks

- A design brief can become a real preview image or exportable asset package.
- A short-form brief can become a preview video or complete render script.
- Social copy can become a publish-ready file without credentials.
- Draft/publish modes fail safely when auth is missing.
- Human approval is mandatory before final publish/final asset state.
