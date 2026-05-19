# Auth & Credential Patterns

> Filename and content patterns that indicate auth state.
> Used by scanners to flag load-bearing folders, and by the critic agent to verify Rule 2 (no auth surprise).

---

## Filename patterns (high confidence)

A folder containing any of these filenames is auth-bearing:

```
auth.json
auth.toml
auth.yml
credentials.json
credentials
config.toml (in tool dirs that store tokens — verify by content)
tokens.json
tokens.txt
*_tokens.json
*-tokens.json
session.json
session-*.json
*-session.json
cookies.sqlite
cookies.json
cookies.db
keychain.json
.netrc
hosts.yml (gh CLI token store)
client_info.json (OAuth client registration)
client_secret*.json (OAuth client secret)
*_client_info.json
*_code_verifier.txt (PKCE)
oauth*.json
refresh_token*
access_token*
identity.json
api_keys.json
.env (often holds API keys)
.env.local
.env.*
secrets.yml
```

## Content patterns (medium confidence)

If a JSON/YAML/TOML file in the folder contains any of these keys, it's auth-bearing:

```
access_token
refresh_token
id_token
api_key
api_token
client_secret
private_key
secret_access_key
session_token
bearer
authorization
authToken
oauth_token
Bearer eyJ (JWT in Authorization header)
```

## JWT detection

A file's first content bytes starting with `eyJ` (base64-encoded JSON `{"`) is almost certainly a JWT. Treat the file as auth.

## SSH private keys

These are SEVERE — never auto-recommend deletion:

```
id_rsa
id_ed25519
id_ecdsa
id_dsa
*.pem (in.ssh/)
*.key (in.ssh/)
known_hosts
authorized_keys
```

## GPG keys

Also SEVERE — never auto-recommend deletion:

```
~/.gnupg/
~/.gnupg/pubring.kbx
~/.gnupg/private-keys-v1.d/
```

## Cloud provider credentials

| Provider | Path | internal |
|---|---|---|
| AWS | `~/.aws/credentials` | `aws configure` |
| GCP (ADC) | `~/.config/gcloud/application_default_credentials.json` | `gcloud auth application-default login` |
| GCP (gcloud) | `~/.config/gcloud/credentials.db` (SQLite) | `gcloud auth login` |
| Azure | `~/.azure/` | `az login` |
| Cloudflare | `~/.wrangler/`, `~/.config/.wrangler/` | `wrangler login` |
| Doppler | `~/.doppler/` | `doppler login` |
| 1Password | `~/.config/op/` | `op signin` |
| Vault | `~/.vault-token` | `vault login` |
| Linear | `~/.config/linear-cli/` | `linear auth` |
| Notion (CLI) | various | `notion auth` (varies by package) |

## OAuth state vs API keys

- **OAuth refresh tokens** can usually be re-obtained by re-running the login flow — annoying but not destructive.
- **Long-lived API keys** (e.g., raw OpenAI/Anthropic/Vercel API keys in `.env` or stored configs) are *replaceable but require user action*. Surface explicitly: "you'll need to copy a new key from the dashboard."
- **Private keys** (SSH, GPG, RSA, etc.) are usually irreplaceable without re-issuing certificates / re-pairing. Treat as SEVERE.

## What to surface to the user before nuke

For each auth-bearing folder being removed, the safe-nuke-agent's per-target walk MUST include:

1. The auth artifact's filename and what kind of credential it is.
2. Whether the credential is OAuth (re-auth flow), API key (manual paste from dashboard), or private key (severe).
3. The exact re-auth command, or the URL where they get the new key.

Example:

> Folder: `~/.context7/` — contains `credentials.json` (OAuth refresh token for Context7).
> Re-auth command: `npx ctx7@latest login`
> If you nuke this, your next `ctx7` call will return 401 until you log in again.

---

## When credentials are SAFE to nuke

In all other cases, ask. But these are usually fine to nuke if the user is doing a fresh-start:

- Stale OAuth tokens (expired by date, refresh likely revoked anyway)
- Per-MCP-server OAuth state in `~/.mcp-auth/` (auto re-flows on next MCP server connect)
- Tool-specific `auth.json` for tools the user no longer has installed
