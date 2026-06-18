# State Snapshot — Step 1

## Preferred: enter the workspace over MCP

If the `forsvn` MCP server is connected (the `mcp__forsvn__enter_workspace` tool is
available), call it **first**. `enter_workspace` returns the project's TRUTH (canonical),
OUTPUT (artifacts), and MEMORY (experience) plus the graph-derived `next` step — the same
context the disk walk below produces, read from the manifest index instead of globbing, and
it marks the session as oriented (clearing the cold-state guard banner). Loading context and
"entering the workspace" are the **same act**. When you take this path, set
`context-loaded-via: mcp` in the routing record (dispatch.md § "Routing record format").

## Fallback: inline disk snapshot

When the MCP server is unavailable (no `mcp__forsvn__*` tools) — the common case until the
binary is installed — fall back to this disk snapshot. Graceful degradation per KTD6: same
information, derived from the filesystem; set `context-loaded-via: filesystem`.

Render this disk snapshot inline at every `/forsvn` invocation. The shell-bang fires at slash-command time:

```
Context root:
! `[ -d .forsvn ] && echo "  .forsvn/ exists" || echo "  .forsvn/ not yet scaffolded — will bootstrap"`

Product context:
! `f=docs/forsvn/canonical/product/PRODUCT-CONTEXT.md; [ -f "$f" ] && grep -E "^(status|decision_state|date):" "$f" | sed 's/^/  /' || echo "  (no PRODUCT-CONTEXT.md — will autodraft on dispatch)"`

Foundation evidence (ICP — for the Step 4.5 pre-flight):
! `f=docs/forsvn/canonical/research/ICP.md; if [ -f "$f" ]; then echo "  ICP.md ✓ — $(grep -m1 'Confidence Summary' "$f" | sed 's/.*Confidence Summary:[* ]*//') · ≈$(grep -c 'Quote:' "$f") sourced quotes"; else echo "  ICP.md ✗ — no audience/VoC evidence (output leans generic; /research-icp builds it)"; fi`

Last session:
! `[ -f .forsvn/routing/last-session.md ] && grep -E "^(timestamp|intent|status|next-action):" .forsvn/routing/last-session.md | sed 's/^/  /' || echo "  (no prior session)"`

Active initiatives:
! `[ -f .forsvn/routing/initiatives.md ] && awk '/^\|.*active.*\|/' .forsvn/routing/initiatives.md | head -5 || echo "  (none)"`

Canonical sources:
! `for f in brand/BRAND.md research/icp-research.md research/market-research.md architecture/system-architecture.md; do [ -f "$f" ] && echo "  $f ✓" || echo "  $f ✗"; done`

Recent artifacts:
! `find docs/forsvn/artifacts -mindepth 3 -name "*.md" -type f -mtime -7 2>/dev/null | head -5 | sed 's/^/  /' || echo "  (none in last 7 days)"`
```
