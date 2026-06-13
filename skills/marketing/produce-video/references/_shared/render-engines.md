<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Render Engines — what actually turns a prompt/brief into pixels

**The stack does not render.** Brief skills emit briefs; `produce-asset` / `produce-video`
emit **render-ready prompts + a manifest**. Pixels come from an engine *you* connect, via
the `execution-fork.md` Assisted/Direct path. **There is no `/produce-graphic` verb** — do
not look for one, do not promise one. This file names the engines that exist, what each
needs to be live, and the no-daemon fallback that always works.

Pair with `capability-preflight.md` (batch-probe these before choosing) and
`execution-fork.md` (the Brief-only/Assisted/Direct gate + the render→check→accept loop).

---

## Supported engines (each: what it needs + how to verify + fallback)

Every entry carries a **Prerequisites** line — install / running / keyed / verify /
fallback. The pre-flight probes these as a batch; never assume one is live.

### OpenDesign (`open-design` MCP / `od` CLI) — design / image
- **Needs:** the local OpenDesign daemon running (`pnpm tools-dev`).
- **Verify:** `get_active_context` (MCP) or `od status --json` responds.
- **Down →** the daemon isn't started → run `pnpm tools-dev`, or fall back to
  hand-authored SVG → headless render (below).

### Paper (`paper` MCP) — design / image
- **Needs:** Paper desktop running **and a file open** (an empty canvas is not a target).
- **Verify:** `get_basic_info` returns artboards.
- **Down →** running but no file open → open the target file, or skip the Paper route.

### Gemini image generation (`ce-gemini-imagegen`) — image
- **Needs:** `GEMINI_API_KEY` set in the environment (presence only; value never read).
- **Verify:** the key is present (the pre-flight reports set/unset, not the value).
- **Down →** key unset → set it, or fall back to the headless render.

### Headless HTML + local `@font-face` — image (the always-available fallback)
- **Needs:** nothing but a browser/devtools screenshot tool and the brand fonts on disk
  (`@font-face` pointing at local files — no webfont network dependency).
- **How:** author the asset as a self-contained HTML file using DESIGN.md tokens + the
  brand `@font-face` block, then screenshot it (a connected devtools/browser tool) at the
  asset's target aspect. Reproducible, no design daemon, no API key.
- **This is the floor.** When every other engine is down, this still produces a real
  render to score against the brief. Promote a reusable harness for it rather than
  improvising the screenshot bridge each time.
- **Font prerequisite:** the brand display + mono fonts must be on disk for fidelity. A
  missing brand font (it falls back to a system face and silently goes off-brand) is a
  pre-flight blocker, not a runtime surprise — the harness checks the `@font-face` files
  resolve before rendering.

> No rasterizer on PATH (no rsvg / inkscape / sharp)? The headless HTML route needs none —
> the browser *is* the rasterizer. Reach for a CLI rasterizer only for pure SVG→PNG with no
> HTML/CSS involved.

---

## Video engines (the `video` category — what `produce-video` routes to)

Same contract as the image engines: each names what it needs, the cheap liveness probe, and
the named fallback. `produce-video` is tool-agnostic — it emits the bundle (manifest +
per-shot prompts + scaffolds + a post-production stage) and **routes** a script to whichever
of these is connected via the `execution-fork.md` Assisted/Direct path. It never holds a key.
Lane-selection logic lives in the `produce-video` skill (its `production-lanes` reference).

**The video floor is the code-render lane.** Remotion / HyperFrames need only Node — no
cloud key, deterministic, brand-tokenizable. When even that isn't wanted, the bundle
degrades to **Brief-only** (the always-runnable handoff). No dead ends.

### House lanes — deterministic, brand-tokenizable, no cloud key

#### Remotion (`remotion` skill / `npx remotion`) — code-render
- **Needs:** Node + the emitted `remotion/scaffold.tsx`; ffmpeg for trims. No API key.
- **Verify:** `npx remotion studio` boots / `npx remotion still <id> --frame=30` renders one frame; `command -v ffmpeg`.
- **Down →** Node/ffmpeg missing → install, or fall back to HyperFrames / Brief-only.

#### HyperFrames (`hyperframes` skill / `npx hyperframes`) — code-render
- **Needs:** Node 22+; a `DESIGN.md` (HyperFrames **hard-gates** generic color — strongest brand floor of the lane); headless Chrome (bundled). No API key.
- **Verify:** `npx hyperframes lint && npx hyperframes validate` pass.
- **Down →** no `DESIGN.md` → supply brand tokens, or fall back to Remotion / Brief-only.

#### text-to-lottie (`text-to-lottie` skill) — code-render (vector, not film)
- **Needs:** Node + the degit player project. **Outputs Lottie JSON, not mp4** — pair with a Remotion `<Lottie>` layer or an exporter for film output. No API key.
- **Verify:** `node -e "JSON.parse(require('fs').readFileSync('public/lottie.json'))"`; player canvas renders non-blank.
- **Down →** for a rendered clip use Remotion/HyperFrames instead; Lottie is for a looping UI asset.

#### Manim (`manim-video` skill / `manim`) — explainer **(deferred lane)**
- **Needs:** Python + `pip install manim` + a LaTeX install (~4GB, for `MathTex`) + ffmpeg. Heavy; install-gated. No API key.
- **Verify:** `command -v manim latex ffmpeg`.
- **Down →** not installed → Brief-only. Only stand this up when an actual math/diagram/algorithm explainer brief appears (see the `produce-video` DEFER disposition) — do not pre-install for a speculative need.

### Operator-connected lanes — stochastic, own key/account (OS-keychain only, never brokered)

These are model-driven: a STYLE/prompt steers but never locks pixels to brand tokens.
Treat the output as a render to **show → score against the brief** (the return-leg), never
as deterministic. The app never stores or brokers these keys (architecture §8/§9).

#### Vercel AI-CLI (`ai-cli` skill / `ai video`) — generative-AI
- **Needs:** `AI_GATEWAY_API_KEY` or a provider key; the `ai` binary. Gateway to many text/image-to-video models (a clean path to Higgsfield-class backends).
- **Verify:** `command -v ai`; `ai models --type video`; the gateway/provider key is present.
- **Down →** key unset → set it, or fall back to a house code-render lane.

#### Higgsfield (operator account — MCP or REST) — generative-AI
- **Needs:** a Higgsfield account: its MCP server URL (OAuth) or a Bearer token; or reach its models through AI-CLI. Text/image-to-video + consistent-character "Soul"; ~≤15s clips; paid credits.
- **Verify:** the connected MCP responds / the token resolves in the keychain.
- **Down →** not connected → AI-CLI or a house code-render lane.

#### Invideo (`mcp__claude_ai_Invideo__generate-video-from-script`) — generative-AI
- **Needs:** the Invideo MCP connected + authed. Script-to-video SaaS — hands-off, non-deterministic, no token control.
- **Verify:** the MCP tool lists + responds.
- **Down →** not connected → AI-CLI / code-render.

#### HeyGen (`heygen-avatar` + `heygen-video` skills / `heygen` CLI) — avatar / talking-head
- **Needs:** a HeyGen account: app OAuth or `HEYGEN_API_KEY` (`heygen auth login`); consumes plan credits. Presenter is model-generated — STYLE blocks steer but don't lock identity; treats the script as a concept, not verbatim.
- **Verify:** `heygen auth status` (exit 0) / the connector is present.
- **Down →** not connected → shoot a real live-action take and run it through the post lane, or Brief-only.

### Post lane — assemble · color-grade · subtitle (deterministic editor; one cloud key)

#### video-use (`video-use` skill) — post-edit
- **Needs:** `ffmpeg` + `ffprobe`; `ELEVENLABS_API_KEY` for word-level transcription (Scribe); Python deps. Cuts on word boundaries, ASC-CDL/LUT color grade, burns subtitles, **self-verifies the rendered cut**. This is the engine the bundle's `post.md` stage targets.
- **Verify:** `command -v ffmpeg ffprobe`; `ELEVENLABS_API_KEY` present.
- **Down →** no key → assemble + caption with plain `ffmpeg` (no transcript-driven cut), or hand `post.md` to DaVinci / Premiere / Final Cut; the stage names both paths.

> **Determinism summary** — house lanes (Remotion · HyperFrames · text-to-lottie · Manim)
> render your exact tokens and are the brand-safe default; operator-connected lanes
> (AI-CLI · Higgsfield · Invideo · HeyGen) are stochastic and must clear the return-leg
> before accept; `video-use` is a deterministic editor with one keyed transcription call.
> When nothing in the category is live, the run still completes as the Brief-only bundle.

---

## Render → show → iterate (the brand-critical default)

An agent cannot fully self-grade taste. For **brand-critical** visuals (hero, OG card,
launch creative), the default before accept is:

1. **Render** via the chosen engine (or the headless fallback).
2. **Show the human** — surface the actual rendered frame (screenshot → send the file),
   not a description of it.
3. **Iterate** against the brief + realized surface, then accept.

This `render → show → iterate` checkpoint is the default for brand-critical output, **not**
an improvisation. It feeds the `execution-fork.md` return-leg: the human-visual check plus
the eval/squint-test against the realized surface is what closes the loop. Off-brief
output does not get committed.

---

## What does NOT exist (so nobody waits on it)

- **No `/produce-graphic` verb.** `produce-asset` is the closest skill and it is
  **tool-agnostic by design** — it emits prompts + a manifest and holds no API keys. It
  does not render.
- **No in-stack render service / credential broker.** Engines run via the operator's own
  connected MCP / own keys (OS keychain), per the local-first invariant. The stack never
  brokers cloud credentials and adds no telemetry.
