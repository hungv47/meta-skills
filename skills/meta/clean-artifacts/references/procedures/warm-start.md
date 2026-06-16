# Warm Start prompt (clean-artifacts)

Emitted when scope is clear from invocation. The two `` ! `<cmd>` `` lines below are inline shell interpolation — when `/clean-artifacts` is invoked as a slash command, Claude Code substitutes the command output before the LLM sees the prompt. **Interpolation fires ONLY from SKILL.md slash invocation; NOT from refs.** That is why the prompt block lives in SKILL.md body, not here. This file documents the prompt for reference only.

```
Found:
- scope → "[full docs/forsvn/artifacts/ | <subpath>]"
- artifact disk snapshot →
  ! `find docs/forsvn/artifacts -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' '` files on disk;
  ! `find docs/forsvn/artifacts -name "*.md" -type f -mtime +90 2>/dev/null | wc -l | tr -d ' '` older than 90d
- manifest last touched →
  ! `git log -1 --format='%cr' .forsvn/index/manifest.json 2>/dev/null | grep . || echo 'untracked or no git history'`
- excluded paths from experience → "[list or none]"

Mode defaults to --dry-run (preview only). Threshold defaults to 90 days.
Override (e.g., --apply, --threshold-days 30) or proceed?
```
