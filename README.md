# Conquistador

Conquistador turns product context and performance evidence into finished, channel-native marketing
work. The complete plugin gives users one default teammate and installs a compact set of capabilities
that Conquistador invokes privately. Each outcome skill is also self-contained for operators who want
only one capability.

## Status

- Local dogfood: available.
- Public install: unavailable while the repository identity is unresolved.

## Install the complete plugin locally

From Claude Code, add this monorepo and install the plugin:

```text
/plugin marketplace add /absolute/path/to/forsvn
/plugin install conquistador
```

For Codex, Cursor, Claude Code, and other hosts supported by the generic skills installer:

```text
npx skills add /absolute/path/to/forsvn/skills --skill '*'
```

Inspect discovery without installing:

```text
npx skills add /absolute/path/to/forsvn/skills --list
```

The complete plugin contains no required hook, command, MCP server, router process, Bun service, Rust
binary, or desktop application.

## Install one outcome skill

Select one self-contained skill when the complete teammate is unnecessary:

```text
npx skills add /absolute/path/to/forsvn/skills --skill write-copy
```

Other supported outcomes include research and positioning, channel research, brand, campaign and paid
media, funnel modeling, creative and render-ready briefs, social and short-form work, outreach,
long-form writing, search, conversion, measurement, Vietnamese, product-flow mapping, and
implementation-ready product UI briefs. Use `--list` as the source of truth instead of relying on a
hardcoded count.

## Hosts and the skills installer

The generic `skills` installer (the `skills` CLI shipped under that name) targets the agent
directories a host is configured to accept, and the destination depends on scope:

- **Project scope (default):** installs into the current project's skill directory so only that
  project sees the skill.
- **Global scope (`--global` / `-g`):** installs user-level so the skill is available across projects.
  The CLI auto-detects project vs. global when no scope flag is given; pass a scope flag to make it
  explicit and non-interactive.
- **Agent targeting (`--agent <agents>`, `*` for all):** the installer only writes into the agent
  directories you name (for example Claude Code, Cursor, and others it supports). If a host is not in
  the supported agent set, the installer cannot place it there.
- **Copy vs. symlink (`--copy`):** the default is a symlink into the agent directory; `--copy` copies
  files instead, which is useful when you want a self-contained install independent of this checkout.

The complete plugin keeps its existing install paths (Claude Code `/plugin …` and Codex plugin
manifests). The generic `skills` installer is an alternative for hosts those plugin formats do not
cover.

### Non-interactive target install

Invoked from the repository root's package directory (`skills/`), a non-interactive complete-capability
install to all supported agents is:

```text
npx skills add /absolute/path/to/forsvn/skills --skill '*' --agent '*' --copy --yes
```

A single, self-contained outcome skill installed non-interactively to all agents:

```text
npx skills add /absolute/path/to/forsvn/skills --skill write-copy --agent '*' --yes
```

`--yes` skips confirmation and `--global` (or the absence of a project context) controls scope; `--skill`
and `--agent` make the target unambiguous. Confirm the result with `skills list --json` (or `skills ls`).

### Discovery as the source of truth

Do not rely on a hardcoded skill count in scripts or prose. Use the installer's own discovery:

```text
npx skills add /absolute/path/to/forsvn/skills --list
```

`--list` reports the skills the installer would discover for this package (run inside a CLI that accepts
the interactive picker, or combine with `--yes` for a non-interactive run). Treat that output, plus
`skills list --json` for what is actually installed on a host, as authoritative rather than any count in
this or other files.

## Versioning and update checks

Each skill carries a `metadata.version` in its `SKILL.md` frontmatter, and the package keeps one version
per skill in [`VERSIONS.md`](VERSIONS.md) with first-public-release semantics. A skill's frontmatter is
its authoritative version; `VERSIONS.md` must match it and is the package-wide reference.

The manual update-check path is:

1. List what is installed on a host: `skills list --json`.
2. Compare each installed skill's `metadata.version` against the matching row in
   [`VERSIONS.md`](VERSIONS.md) in the source package.
3. To apply a newer version, re-run the installer for that skill from this package
   (`--skill <name> --yes`), or `git pull` this package and re-run. Updates are installed by the host;
   the agent never fetches updates at runtime.

This versioning adds no required runtime and no fetch-on-open behavior; it only records versions and a
manual reference so installed users and scripts can verify which version they hold without calling the
network.


## Use

Ask in plain language:

```text
Use Conquistador to turn this product into a focused Product Hunt launch package.
```

```text
Make this LinkedIn draft sound like us and make the product matter.
```

```text
Here are the launch results. Tell me what to keep, drop, and test next.
```

Conquistador handles four jobs internally:

- launch or grow this;
- create or improve this;
- map or specify the product experience;
- learn from these results.

Complete-plugin users do not select skills, agents, modes, routers, plans, or review tools.

## Workspace agents

Slack cannot install a repository skill by itself. Use a workspace agent that supports uploaded skills
or instructions, attach the Conquistador contract and required outcome skills, then connect that agent
to Slack through the host's supported integration. The workspace host owns identity, channel access,
memory, tools, and approval state.

Buzz has no package install path verified by this repository. Use the skill folders only behind an
ACP-compatible agent that Buzz can address. Do not claim room history, publishing tools, or durable
memory unless the actual Buzz deployment supplies them.

In either host, if the integration cannot enforce approval before a send, publish, spend, or external
write, Conquistador must stop at a ready-to-use draft.

The portable package source is:

```text
skills/
  conquistador/
    SKILL.md
    capabilities.md
    channels/
    standards/
    adapters/
    examples/

  <outcome-skill>/
    SKILL.md
    agents/openai.yaml
```

## Licensing

The portable agent package is MIT-licensed under [`LICENSE`](LICENSE).

The desktop and Rust experiments in the parent monorepo are not part of this package and are
not covered by this license.
