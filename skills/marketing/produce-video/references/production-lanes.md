# Production Lanes — produce-video

How produce-video routes a validated script to a **production path**. Loaded at pre-dispatch
(after mode detection) and surfaced in the manifest's `## Runtime Choices` section + the
Execution fork. The operator always chooses; this file is how the skill *recommends*.

## What a lane is

A **lane** is a family of engines that turn the script into pixels. produce-video stays
tool-agnostic — it emits the runtime-agnostic bundle and recommends a lane; the engines run
via the operator's own connected MCP / keys (`execution-fork.md` Assisted/Direct). Engines
and their prerequisites are catalogued in `render-engines.md` § Video engines. Lanes are a
**produce-time** dimension — they do not change the brief's `production_mode` (`n`) field.

## The five lanes

| Lane | Engines | Determinism | Use when the script is… |
|---|---|---|---|
| **code-render** | Remotion · HyperFrames · text-to-lottie | deterministic, brand-tokenized | motion-graphic / kinetic-typography / UI- or data-driven — anything that should hit exact brand tokens with no cloud key |
| **explainer** | Manim *(deferred lane)* | deterministic | math / algorithm / formal-diagram walkthrough (3Blue1Brown-style) |
| **generative** | Vercel AI-CLI · Higgsfield · Invideo | stochastic, operator-connected | cinematic b-roll / AI footage / a prompt-to-clip the house lanes can't hand-build |
| **avatar** | HeyGen | stochastic, operator-connected | a human presenter delivers the script (talking-head, pitch, update) |
| **post** *(terminal, cross-lane)* | video-use · ffmpeg | deterministic editor | assemble the generated shots, color-grade, burn subtitles, export — see `post.md` |

## Selection logic (recommend, don't decide)

produce-video derives a recommendation from the brief, then the operator confirms at the
Execution fork:

1. **Start from `production_mode`** (the brief's content nature):
   - `motion-graphic` → **code-render** (default house lane).
   - `live-action` → **avatar** (synthetic presenter), OR a real shoot the operator supplies → straight to **post**.
   - `mixed` → code-render for the graphic shots + **post** to assemble; **generative** for any b-roll the script explicitly calls out.
2. **Brand-fit is the tie-breaker.** Prefer a deterministic house lane (code-render / explainer) whenever the script *can* be hand-built — it hits exact tokens and needs no cloud key. Reach for a stochastic lane (generative / avatar) only when the script genuinely needs footage or a presenter the house lanes can't produce.
3. **Capability-preflight gates the menu.** Batch-probe the `video` category (`capability-preflight.md`): offer Assisted/Direct only for lanes whose engine is live; *name* the unconnected ones as "connect to enable." Nothing live → the bundle is Brief-only, complete and runnable. No dead ends.
4. **`post` is (almost) always in the chain.** Any multi-shot script ends in assembly + caption burn-in; a graded, subtitled export is the post lane regardless of how the shots were generated. A single-shot code-render clip may skip post.
5. **Record the choice.** Write the recommended + chosen lane into the manifest's `## Runtime Choices` section and set `execution_mode` per `execution-fork.md`.

## Per-lane prompt dialect (how a shot's Visual Prompt is consumed)

The canonical `scenes/[shot-id].md` Visual Prompt is renderer-agnostic. Each lane reads it
differently — the prompt-author tunes the per-shot **Renderer Hints** block
(`format-conventions.md` § Per-shot prompt) for the chosen lane:

- **code-render** — the Visual Prompt becomes a component spec: brand tokens → CSS/React props; motion → GSAP/Remotion interpolation. Deterministic; no model in the loop. For reusable scene blocks the operator MAY pull from a Remotion component registry — name the *capability* generically; never couple the emitted scaffold to one third-party registry.
- **explainer** — the Visual Prompt becomes a Manim scene description (equations as `MathTex`, steps as `Transform`). Deferred lane; confirm the need is genuinely Manim-shaped before standing up the LaTeX toolchain.
- **generative** — the Visual Prompt becomes the text-to-video prompt verbatim, plus aspect + duration + an explicit **"no on-screen text"** note (copy is burned in post, never generated — stochastic engines mangle text). Flag every generative shot for the return-leg.
- **avatar** — the shot's narration line becomes the presenter script (**verbatim**); the Visual Prompt collapses to a STYLE block (framing, wardrobe, background token). Pixels are not brand-exact — score on the return-leg.
- **post** — see `post.md` (the bundle stage). Consumes the rendered shots + the manifest's Audio Plan; produces the assembled, graded, captioned export.

## Non-negotiables (inherited)

- **Tool-agnostic / no keys.** produce-video recommends + scaffolds + emits prompts; it never holds a key or invokes an engine. Stochastic-lane output is operator-rendered via their own connected MCP/keys (OS keychain), per `execution-fork.md`.
- **On-screen text is verbatim and burned in post.** Never let a generative/avatar engine author copy — it paraphrases. The post lane burns the brief's exact strings (Gate 1 still applies).
- **Return-leg for stochastic lanes.** A generative/avatar render is not "done" until it is scored against the brief + realized surface (`execution-fork.md` return-leg → `evaluate-shortform`). House-lane output is deterministic and proceeds straight to the per-shot verification checklist.
