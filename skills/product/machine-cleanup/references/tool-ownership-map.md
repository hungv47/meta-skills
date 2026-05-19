# Tool Ownership Map

> Lookup table from folder pattern to owning tool, install methods, and known data dirs.
> Used by all scanner agents to identify the owner of an opaque dotfolder.

This list is non-exhaustive — when an unknown folder appears, scanners should:
1. Check top-level config files for self-identification
2. Search for the same name across brew/npm/bun/cargo/go global lists
3. If not found, classify as `unknown` and recommend the user inspect

---

## AI Coding Tools (the ecosystem changes monthly — update as needed)

| Folder pattern | Tool | Install methods | Companion dirs |
|---|---|---|---|
| `.claude/` | Claude Code (CLI) | brew cask `claude-code`, native installer | `.claude/skills/`, `.claude/plugins/`, `.claude/projects/` |
| `.codex/` | OpenAI Codex CLI | brew formula `codex`, brew cask `codexbar`, npm `practitioner source/codex`, bun global | `.cache/codex-runtimes/`, `~/Library/Application Support/Codex/` |
| `.cursor/` | Cursor IDE | direct download, brew cask | `.cursor/projects/`, `.cursor/extensions/`, `.cursor/skills/` |
| `.copilot/` | GitHub Copilot CLI | brew cask `copilot-cli` | `~/Library/Application Support/Copilot/` |
| `.warp/` | Warp Terminal | direct download | settings sync via account |
| `.factory/` | Factory.ai | direct download | none |
| `.codeium/` | Windsurf IDE (by Codeium) | direct download | `.codeium/windsurf/` (the actual app dir) |
| `.windsurf/` | Windsurf IDE auxiliary | — | sibling to `.codeium/windsurf/` |
| `.gemini/` | Gemini CLI | brew formula `gemini-cli`, brew cask `gemini` | `.gemini/antigravity/` (shared with Antigravity) |
| `.antigravity/` | Google Antigravity IDE | direct download | shares `.gemini/antigravity/` |
| `.t3/` | T3 Chat desktop | direct download | none |
| `.kiro/` | Kiro (AWS) | direct download | `.semantic_search/` (Kiro's embedding cache) |
| `.kimi/` `.kimi-webbridge/` | Kimi (Moonshot AI) | direct download | the webbridge is a vendored binary |
| `.trae/` | Trae IDE | direct download | `.ai_completion/` (telemetry) |
| `.snaply/` | Snaply (meeting transcription) | brew cask `snapzy`, direct download | `~/Library/Application Support/snaply/` (PRIMARY data) |
| `.pencil/` | Pencil | brew cask | none |
| `.browser-use/` | browser-use Python lib | pip / pipx | `.config/browseruse/` |
| `.agent-browser/` | agent-browser CLI (Vercel plugin) | npm `agent-browser` | `.config/agent-browser/` |
| `.agents/skill-artifacts/` | `npx skills add` install root | npm `skills` package | `~/skills-lock.json`, sibling skills/ dirs in `.cursor/`, `.claude/`, etc. |
| `.kilocode/` | Kilo Code | direct download | none |
| `.icube-remote-ssh/` | iCube Remote SSH plugin | unknown | usually empty |
| `.factory/` | Factory AI | direct download | none |

---

## Auth/Credential Folders (treat as load-bearing by default)

| Folder | Owner | Auth artifact | Re-auth command |
|---|---|---|---|
| `.aws/` | AWS CLI | `credentials`, `config` | `aws configure` |
| `.ssh/` | OpenSSH | private keys, `known_hosts` | re-generate keys (severe) |
| `.gnupg/` | GnuPG | private keyring | re-import keys (severe) |
| `.config/gh/` | GitHub CLI | `hosts.yml` (token) | `gh auth login` |
| `.config/gcloud/` | Google Cloud SDK | OAuth tokens, ADC | `gcloud auth login` |
| `.gitconfig` | Git | identity | `git config --global user.name/email` |
| `.context7/` | ctx7 CLI | OAuth refresh token | `npx ctx7@latest login` |
| `.convex/` | Convex CLI | access token | `npx convex login` |
| `.mcp-auth/` | mcp-remote OAuth proxy | per-server tokens (PKCE) | re-auth flow on next MCP use |
| `.npmrc` | npm | `:_authToken=` lines | re-paste from registry |

---

## Language Toolchains

| Toolchain dir | Pair dir | Reinstall command |
|---|---|---|
| `.cargo` + `.rustup` | — | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| `.bun` | — | `curl -fsSL https://bun.sh/install \| bash` |
| `~/go` (`$GOPATH`) | brew `go` (system toolchain) | `brew install go` |
| `google-cloud-sdk/` | `.config/gcloud/` | `brew install --cask google-cloud-sdk` or `curl https://sdk.cloud.google.com \| bash` |
| `.local/share/pnpm/` | — | `corepack enable pnpm` |
| `.foundry/` | — | `curl -L https://foundry.paradigm.xyz \| bash` (Solidity) |

---

## Cache Locations

| Pattern | Owner | Always orphan-safe to nuke? |
|---|---|---|
| `~/.cache/<tool>/` | XDG cache for `<tool>` | Yes if `<tool>` is gone, otherwise regenerates |
| `~/.npm/_cacache/` | npm | Yes — pure cache |
| `~/.npm/_npx/` | npx | Yes |
| `~/.bun/install/cache/` | bun | Yes |
| `~/.cargo/registry/{cache,index,src}/` | cargo | Yes |
| `~/Library/Caches/Homebrew/` | brew | Yes — `brew cleanup` does this |
| `~/Library/Caches/<App>/` | macOS app cache | Usually yes; some apps store login state here |
| `~/.gradle/caches/` | Gradle | Yes |
| `~/.m2/repository/` | Maven | Yes |
| `~/.cache/huggingface/` | HuggingFace | Yes — but expensive re-download (multi-GB models) |

---

## When folder name is misleading

| Folder | Surprise |
|---|---|
| `.codeium/` | Now owned by Windsurf IDE (Codeium pivoted), not the deprecated Codeium browser extension |
| `.codex/` | OpenAI's Codex CLI (2024+), not the deprecated Codex API client |
| `.local/` | Symlink shim for many XDG tools — almost always load-bearing |
| `.config/` | XDG config root — almost always load-bearing |
| `~/Library/Application Support/<App>/` | macOS PRIMARY data dir — usually larger than the dotfolder version |
