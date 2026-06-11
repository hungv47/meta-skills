---
description: Diagnose the FORSVN install — report which of the three layers (review surface, MCP contract, Proof collab) are live and what's missing, each with a one-line fix. Use when /forsvn:review or :collab isn't working, or to confirm a fresh install is usable, not just installed.
argument-hint: (none)
allowed-tools: Bash(bun:*), Read
---

# FORSVN — doctor

Run the layered health check and relay it to the operator:

```bash
bun "${CLAUDE_PLUGIN_ROOT}/forsvn-preview/bin/forsvn-doctor.ts" --json
```

Parse the JSON: `checks[]` (`name`, `ok`, `detail`, `fix?`) and `tiers`
(`review surface`, `MCP contract`, `Proof collab` → booleans). Report:

- **Which tiers are live.** The **review surface** (Bun + git + the bundled
  `_html` assets) is the base experience; **MCP contract** (`forsvn-mcp`) and **Proof collab** (forsvn-mcp +
  Node 18+ + a valid `FORSVN_PROOF_DIR`) are opt-in — their absence is normal if
  the operator only wants review.
- **What to fix.** For each failing check, relay its `fix` verbatim (e.g.
  `cargo install --path crates/forsvn-mcp`, `bun proof-setup.ts`). Don't invent
  remediations beyond what the tool reports.

This is read-only — it diagnoses, it never installs or registers anything.
