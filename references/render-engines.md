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
