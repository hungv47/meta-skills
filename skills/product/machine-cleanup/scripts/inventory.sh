#!/usr/bin/env bash
# inventory.sh — One-shot machine inventory for machine-cleanup scanners.
#
# Outputs a single newline-delimited report with sections so that all four
# Layer 1 scanners can share its output instead of each running their own
# `du`/`ls` sweeps.
#
# Sections (each starts with `=== <NAME> ===` line):
#   DOTFOLDERS         — every $HOME/.* dir with size + mtime + auth-hint
#   USER_DIRS          — $HOME top-level non-dot entries (Desktop, Downloads, etc.)
#   CACHES             — known cache locations with size
#   RUNTIMES           — language toolchain dirs with size + recent activity
#   PACKAGES_NPM       — `npm ls -g --depth=0`
#   PACKAGES_BREW      — `brew list --formula` and `brew list --cask`
#   PACKAGES_BUN       — top-level deps from ~/.bun/install/global/package.json
#   PACKAGES_CARGO     — `cargo install --list`
#   PACKAGES_GO        — non-LSP binaries in $GOPATH/bin
#   PACKAGES_PIPX      — `pipx list --short`
#   PROCESSES          — running AI/dev processes
#   BROKEN_SYMLINKS    — broken symlinks at depth ≤ 4
#   SHELL_RC_DANGLERS  — lines in *.rc files referencing missing paths
#
# Usage:
#   bash scripts/inventory.sh > /tmp/machine-cleanup-inventory.txt

set -u

HOME_DIR="${HOME:-$(eval echo ~$USER)}"

section() { echo; echo "=== $1 ==="; }

# ---------- DOTFOLDERS ----------
section "DOTFOLDERS"
for d in "$HOME_DIR"/.*; do
  base=$(basename "$d")
  [[ "$base" == "." || "$base" == ".." ]] && continue
  [[ ! -d "$d" ]] && continue
  size=$(du -sh "$d" 2>/dev/null | cut -f1)
  mtime=$(stat -f "%Sm" -t "%Y-%m-%d" "$d" 2>/dev/null)
  # Auth hint: any filename matching common auth patterns
  auth_hint=""
  if find "$d" -maxdepth 3 \( \
       -name "auth.json" -o -name "credentials*" -o -name "tokens*" \
    -o -name "*token*" -o -name "session*" -o -name ".env" \
    -o -name "client_secret*" -o -name "hosts.yml" \
    -o -name "id_rsa*" -o -name "id_ed25519*" \) \
    -type f -print -quit 2>/dev/null | grep -q .; then
    auth_hint="[AUTH]"
  fi
  printf "%-32s %8s  %s  %s\n" "$base" "$size" "$mtime" "$auth_hint"
done

# ---------- USER_DIRS ----------
section "USER_DIRS"
for d in "$HOME_DIR"/*; do
  [[ ! -d "$d" ]] && continue
  base=$(basename "$d")
  size=$(du -sh "$d" 2>/dev/null | cut -f1)
  mtime=$(stat -f "%Sm" -t "%Y-%m-%d" "$d" 2>/dev/null)
  printf "%-32s %8s  %s\n" "$base" "$size" "$mtime"
done

# ---------- CACHES ----------
section "CACHES"
caches=(
  "$HOME_DIR/.cache"
  "$HOME_DIR/.npm/_cacache"
  "$HOME_DIR/.npm/_npx"
  "$HOME_DIR/.bun/install/cache"
  "$HOME_DIR/.cargo/registry/cache"
  "$HOME_DIR/.cargo/registry/index"
  "$HOME_DIR/.cargo/registry/src"
  "$HOME_DIR/Library/Caches/Homebrew"
  "$HOME_DIR/.gradle/caches"
  "$HOME_DIR/.m2/repository"
  "$HOME_DIR/Library/Caches/pnpm"
  "$HOME_DIR/.local/share/pnpm/store"
  "$HOME_DIR/.yarn/cache"
)
for c in "${caches[@]}"; do
  if [[ -d "$c" ]]; then
    size=$(du -sh "$c" 2>/dev/null | cut -f1)
    printf "%-60s %8s\n" "${c#$HOME_DIR/}" "$size"
  fi
done

# Per-tool cache subdirs in ~/.cache/
if [[ -d "$HOME_DIR/.cache" ]]; then
  echo "  --- ~/.cache/ subdirs ---"
  for d in "$HOME_DIR"/.cache/*; do
    [[ ! -d "$d" ]] && continue
    base=$(basename "$d")
    size=$(du -sh "$d" 2>/dev/null | cut -f1)
    printf "  %-58s %8s\n" "$base" "$size"
  done
fi

# ---------- RUNTIMES ----------
section "RUNTIMES"
runtimes=(
  "$HOME_DIR/.cargo:Rust cargo"
  "$HOME_DIR/.rustup:Rust toolchain"
  "$HOME_DIR/.bun:Bun"
  "$HOME_DIR/go:Go GOPATH"
  "$HOME_DIR/google-cloud-sdk:Google Cloud SDK"
  "$HOME_DIR/.foundry:Foundry (Solidity)"
  "$HOME_DIR/.local/share/pnpm:pnpm"
  "$HOME_DIR/.deno:Deno"
)
for r in "${runtimes[@]}"; do
  path="${r%%:*}"
  label="${r#*:}"
  if [[ -d "$path" ]]; then
    size=$(du -sh "$path" 2>/dev/null | cut -f1)
    mtime=$(stat -f "%Sm" -t "%Y-%m-%d" "$path" 2>/dev/null)
    printf "%-30s %8s  %s  (%s)\n" "${path#$HOME_DIR/}" "$size" "$mtime" "$label"
  fi
done

# ---------- PACKAGES_NPM ----------
section "PACKAGES_NPM"
if command -v npm >/dev/null 2>&1; then
  npm ls -g --depth=0 2>/dev/null | tail -n +2
else
  echo "(npm not on PATH)"
fi

# ---------- PACKAGES_BREW ----------
section "PACKAGES_BREW"
if command -v brew >/dev/null 2>&1; then
  echo "--- formulas ---"
  brew list --formula 2>/dev/null
  echo "--- casks ---"
  brew list --cask 2>/dev/null
else
  echo "(brew not on PATH)"
fi

# ---------- PACKAGES_BUN ----------
section "PACKAGES_BUN"
if [[ -f "$HOME_DIR/.bun/install/global/package.json" ]]; then
  python3 -c "
import json, sys
try:
  d = json.load(open('$HOME_DIR/.bun/install/global/package.json'))
  for k, v in d.get('dependencies', {}).items():
    print(f'{k}@{v}')
except Exception as e:
  print(f'(failed to read bun globals: {e})')
" 2>/dev/null
else
  echo "(no bun globals package.json)"
fi

# ---------- PACKAGES_CARGO ----------
section "PACKAGES_CARGO"
if command -v cargo >/dev/null 2>&1; then
  cargo install --list 2>/dev/null | head -50
else
  echo "(cargo not on PATH)"
fi

# ---------- PACKAGES_GO ----------
section "PACKAGES_GO"
GOBIN="${GOBIN:-$HOME_DIR/go/bin}"
if [[ -d "$GOBIN" ]]; then
  for f in "$GOBIN"/*; do
    [[ ! -f "$f" ]] && continue
    base=$(basename "$f")
    case "$base" in
      gopls|dlv|staticcheck|goimports|golangci-lint|gofumpt|gomodifytags)
        echo "$base [LSP/IDE-tooling — excluded from user binaries]"
        ;;
      *)
        echo "$base"
        ;;
    esac
  done
else
  echo "(no $GOBIN)"
fi

# ---------- PACKAGES_PIPX ----------
section "PACKAGES_PIPX"
if command -v pipx >/dev/null 2>&1; then
  pipx list --short 2>/dev/null
else
  echo "(pipx not installed)"
fi

# ---------- PROCESSES ----------
section "PROCESSES"
pgrep -fl -i "claude|codex|cursor|warp|ghostty|kiro|trae|kimi|antigravity|gemini|copilot|snaply|pencil|factory|browseruse|opencode|devin|mole" 2>/dev/null \
  | grep -vE "grep|shell-snapshots|VERCEL_PLUGIN" \
  | head -40

# ---------- BROKEN_SYMLINKS ----------
section "BROKEN_SYMLINKS"
find "$HOME_DIR" -maxdepth 4 -type l ! -exec test -e {} \; -print 2>/dev/null | head -50

# ---------- SHELL_RC_DANGLERS ----------
section "SHELL_RC_DANGLERS"
RC_FILES=(
  "$HOME_DIR/.zshenv"
  "$HOME_DIR/.zshrc"
  "$HOME_DIR/.zprofile"
  "$HOME_DIR/.zlogin"
  "$HOME_DIR/.bashrc"
  "$HOME_DIR/.bash_profile"
  "$HOME_DIR/.profile"
  "$HOME_DIR/.tcshrc"
  "$HOME_DIR/.config/fish/config.fish"
)
for rc in "${RC_FILES[@]}"; do
  [[ ! -f "$rc" ]] && continue
  # Find lines that look like sourcing (`.` or `source`) and reference a path
  while IFS= read -r line; do
    # Extract anything that looks like a path (starts with $HOME, ~, or /)
    refs=$(echo "$line" | grep -oE '("?(\$HOME|~|/)[^" \t)]+)' || true)
    [[ -z "$refs" ]] && continue
    while IFS= read -r ref; do
      [[ -z "$ref" ]] && continue
      ref="${ref#\"}"
      ref="${ref%\"}"
      ref="${ref/#\$HOME/$HOME_DIR}"
      ref="${ref/#\~/$HOME_DIR}"
      if [[ ! -e "$ref" ]]; then
        echo "$rc → references missing: $ref"
        echo "  line: $line"
      fi
    done <<< "$refs"
  done < <(grep -nE '^\s*(\.|source)\s+' "$rc" 2>/dev/null)
done

echo
echo "=== END OF INVENTORY ==="
