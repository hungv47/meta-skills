<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Hosted Pack/Context Client (open-core soft client)

**Status:** canonical cross-stack contract. **Implements:** plan U9 (client integration + graceful
degrade). **Pairs with:** [`platform-intelligence/CONTRACT.md`](platform-intelligence/CONTRACT.md),
[`legibility-convention.md`](legibility-convention.md). **CLI:** `skills/bin/forsvn-hosted.ts`.

## The invariant this enforces

**A license check NEVER sits on a skill execution path.** A pack-consuming skill is *always* able
to run on its **local build-time mirror** + **local canonical docs**. The hosted client only answers
*"do I have a key to call the API?"* — never *"am I allowed to run the skill."* The gate is the
**absence of a key**, not a permission check. This is the whole open-core design: forking the
Markdown yields a client that simply always takes the local path.

## Pack loading (the default + the upgrade)

Every pack-consuming skill loads its channel pack like this:

1. **Default (free / no key):** read the local mirror at
   `references/_shared/platform-intelligence/<platform>.md` <!-- lint:reference-ok mirror destination in consumers, not a file at source --> (or the source at
   `references/platform-intelligence/<platform>.md`). This snapshot **ages** — its `last_verified`
   is the build-time date. This is the entire free experience; it works offline, forever.
2. **Upgrade (Pro / key present):** before reading the mirror, call
   ```
   bun skills/bin/forsvn-hosted.ts pack <platform> --local-verified <mirror last_verified>
   ```
   - prints the **current** pack to stdout (and `HOSTED <platform> (current, verified <date>)` to
     stderr) when entitled AND the server pack is fresher → use it, and narrate that fresher date.
   - prints `LOCAL <reason>` to stderr and nothing to stdout otherwise (`no_key`, `snapshot_current`,
     `unreachable`, `refused`, `no_pack`) → fall back to the local mirror. **Exit code is always 0.**

The skill never has to branch on entitlement — `LOCAL …` ⇒ read the mirror; pack body on stdout ⇒
use it. API down, key revoked, or no key all collapse to the same safe local path with no nag and no
run impact.

## Context loading (brand brain)

Same shape for the brand-context brain (U7):
```
bun skills/bin/forsvn-hosted.ts context [key]
```
- entitled → injects the account's brand/ICP/campaign context (synced across agents — set it in one
  agent, get it in another).
- no key / unreachable → `LOCAL <reason>`; the skill falls back to local `docs/forsvn/canonical/<stack>/`
  (BRAND/ICP/MARKET). No behavioral difference except *where* the context came from.

## Legibility ties in

What gets narrated (per `legibility-convention.md`) reflects the source actually used:
- **hosted current pack** → `pack_verified` = the fetched (fresher) date; narrate "current pack from
  the freshness pipeline."
- **local mirror** → `pack_verified` = the mirror's build-time date; on Pro, if the served pack was
  stale too, say so.

## Status / doctor

`bun skills/bin/forsvn-hosted.ts status` → `free / local-only` or `Pro (<plan>) — credits …`. Used
by `/forsvn:doctor` and the legibility narration to state, honestly, which client the user is on.

## Config

- `FORSVN_API_KEY` env, or a key file the desktop app writes post-activation
  (`~/.config/forsvn/credentials.json` `{ "api_key": "fsk_…" }`, or the macOS app-support dir).
- `FORSVN_API_BASE` env overrides the API base (default `https://api.forsvn.com`; for self-host/testing).

The key is written by the **app** after Polar checkout + activation. Skills only *read* it. No skill
ever prompts for payment or a key — money enters at the app (build-spec §1).
