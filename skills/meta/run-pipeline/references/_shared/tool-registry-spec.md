<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Tool Registry — Schema & Contract

**The capability catalog that powers the closed-loop execution fork.** Discovery-first,
read-only, local. Source of record for what `build-tool-registry.ts` emits, what
`forsvn-mcp list_tools` returns, and what the desktop Settings → Tools pane reads.

Canonical design: [`docs/forsvn/canonical/product/CLOSED-LOOP.md`](../../docs/forsvn/canonical/product/CLOSED-LOOP.md) §3.

---

## Two surfaces, one source

| Consumer | Surface | Shape |
|---|---|---|
| Humans + greppable agents | `docs/forsvn/canonical/meta/TOOL-REGISTRY.md` (`type: registry`) | rendered tables by category |
| Agents / skills / desktop | `.forsvn/index/tools.json` (sibling to `manifest.json`) | machine index |
| Skills at fork-time | `forsvn-mcp list_tools(category)` | reads `tools.json`, filters |

Both surfaces are **derived** from one discovery pass. Re-run after connecting an MCP
server or setting an API key: `bun skills/bin/build-tool-registry.ts`.

The canonical filename is UPPERCASE (`TOOL-REGISTRY.md`) to satisfy the by-stack
layered grammar (`lint-artifact-paths` requires `[A-Z]` canonical names); its stable
`id` is `tool-registry`.

---

## `tools.json` schema (version 1)

```jsonc
{
  "version": 1,                       // schema version (TOOLS_SCHEMA_VERSION)
  "generated_at": "<ISO-8601>",       // VOLATILE — excluded from --check diffs
  "generator": "build-tool-registry",
  "root": "~/path/to/project",        // home-relativized
  "categories": ["research","design","image","video","publish","analytics"],
  "engines": [ <EngineEntry>, ... ],
  "unmapped_servers": [ { "name": "node_repl", "normalized": "node-repl", "sources": [...] } ],
  "sources_scanned": [ { "path": "~/.claude.json (global)", "exists": true, "server_count": 6 } ]
}
```

### EngineEntry

| Field | Type | Meaning |
|---|---|---|
| `name` | kebab slug | canonical engine identity (stable) |
| `category` | enum | primary category (display grouping) |
| `categories` | enum[] | every category it serves — `list_tools(cat)` matches this |
| `capabilities` | string[] | what it can do (`text-to-image`, `scrape`, …) |
| `auth` | `none \| env \| oauth \| mcp-connected` | how it authenticates; `mcp-connected` is set at discovery when found as a connected MCP server |
| `status` | `verified \| unconfigured \| error` | **v1 is always `unconfigured`** — present ≠ live |
| `discovered` | bool | found connected (MCP server present, or an env key set) |
| `discovery_sources` | string[] | which config sources declared its MCP server |
| `env_keys` | string[] | env vars that power it (when `auth: env`) |
| `env_present` | bool \| null | ≥1 `env_keys` set in the current process (null when no env keys); **values never read** |
| `env_keys_present` | string[] | which keys were present — **names only, never values** |
| `docs_url` | string | setup docs |
| `cost_hint` | `free \| low \| medium \| high \| n/a` | rough cost |
| `latency_hint` | `instant \| fast \| seconds \| minutes \| n/a` | rough latency |
| `preferred` | bool | operator's default for the category (v1: always false) |

The fixed `categories` enum (anti-sprawl, CLOSED-LOOP §11 R1) and the seed engine
catalog live in [`skills/bin/lib/tool-catalog.ts`](../bin/lib/tool-catalog.ts). Adding an
engine there lets discovery *recognise* it; it does not connect anything.

---

## Discovery model (§3.1) — read-only, local, no network

1. **Enumerate connected MCP servers** by reading agent config files (KEYS only — the
   server names — never the values, which can hold credentials):
   - project `<root>/.mcp.json`
   - `~/.config/mcp/servers.json` (the syncthis-managed unified config)
   - `~/.claude.json` — global `mcpServers` + the per-project block for this root
   - **installed plugins** — `~/.claude/plugins/installed_plugins.json` maps each plugin to
     its `installPath`; we read that plugin's `.mcp.json` / `mcp.json` / `.claude-plugin/plugin.json`
     `mcpServers` for server-name KEYS. This source is **catalog-match-only** and tagged
     `dropUnmatched`: a name that maps to a catalog engine surfaces (provenance `plugin:<id>`);
     non-catalog plugin servers are **dropped, not** added to `unmapped_servers` (avoids dumping
     the 200+ unrelated servers a large install declares). **"Installed" ≠ "live"** — these stay
     `status: unconfigured` like every other engine (§3.2). **Hard limit:** claude.ai connectors
     (Gmail/Notion/Canva) are remote OAuth with no local server def, so they cannot be discovered
     locally — `claudeAiMcpEverConnected` is a bare flag only.
2. **Map** each discovered server name to a catalog engine (normalize → alias → match).
   Unmatched servers from the config files go to `unmapped_servers` (nothing silently dropped);
   unmatched servers from the plugin source are dropped per the `dropUnmatched` rule above.
3. **Probe declared `env_keys` for PRESENCE** in the current process env — never log,
   write, or read the value.
4. **Emit** both surfaces.

This adds no network surface and ships without violating any v0 non-goal.

## Verification model (§3.2) — separate, operator-initiated

`status: verified` requires a successful cheapest-possible liveness probe (a 1-token
model ping / MCP `list_tools` / analytics `whoami`). It is **operator-initiated** from
Settings, **never automatic on launch** (no surprise network calls), and cached with a
timestamp. **Not implemented in Registry v1** — every engine stays `unconfigured`.

---

## How skills consume it (§3.4)

At the execution fork (§4) a skill calls `list_tools(category)`:

- **0 verified** → offer **Brief-only** only, naming the engines the operator *could*
  connect (everything in the category with `discovered: false` or `status != verified`).
- **≥1 verified** → offer **Brief-only + Assisted/Direct**, defaulting to the category's
  `preferred` engine.

In Registry v1 nothing is `verified`, so the fork is always Brief-only — degrading
cleanly, no dead ends. Skills keep their engine-specific prompt tuning; the registry only
says *what is available*.

---

## Target-tool catalog — what an output can TARGET (tool-target fork)

The brief-binding tool-target fork ([`tool-target.md`](tool-target.md)) offers a
per-category list of tools an output can **target** — prompt-dialect / capability tuning
of the brief, **not** execution and **not** liveness. This catalog is the single source
for those names; skills never hardcode their own lists. Entries are deliberately short
and **extensible** — add a name when a skill learns its prompt dialect. Listing a target
implies no discovery, no `EngineEntry`, and no `status`.

| Category | Target tools (extensible) |
|---|---|
| `design` | Figma · Open Design · Paper · Stitch · generic HTML/CSS (coding agent) |
| `video` | Veo · Sora · Runway · CapCut · Remotion · HyperFrames |
| `animation`* | Lottie · Rive · GSAP |
| `image` | Midjourney · gpt-image (DALL·E) · Gemini imagegen (Imagen) · Ideogram |
| `audio`* | ElevenLabs · Suno |

Every category additionally offers **tool-agnostic** — the current generic brief,
unchanged — as the first-class, pre-checked default.

\* `animation` and `audio` are **target-only categories**: valid keys in the session
profile's `tool_targets` map, deliberately NOT added to the fixed `categories` enum
(anti-sprawl, CLOSED-LOOP §11 R1) — no `EngineEntry`, no discovery pass, no schema
change. Where a target name matches a catalog engine (`figma`, `open-design`, `paper`,
`stitch`, `veo`, `sora`, `remotion`, `hyperframes`, `midjourney`, `dall-e`, `imagen`,
`ideogram`), it is the same tool; targets without an engine entry (Runway, CapCut,
Lottie, Rive, GSAP, ElevenLabs, Suno, gpt-image) are prompt-dialect targets only.

---

## Idempotence + the gate

`build-tool-registry.ts --check` regenerates in memory and diffs against disk with the
volatile `generated_at` (json) and `date:` (md frontmatter) normalized — so it flags a
**content** drift (a newly-connected server), not a timestamp. The create-`date:` is
preserved across re-runs so daily runs don't churn frontmatter or trip the stale check.

`bun skills/_dev/verify-registry.ts` is the proof-of-completion (N/N). The registry
artifact also conforms to the v3 artifact contract (`validate-artifacts --strict`) and is
indexed by `manifest-sync` as `type: registry`.
