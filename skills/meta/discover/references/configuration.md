---
title: Discover — Configuration
lifecycle: canonical
status: stable
load_class: PROCEDURE
---

# Configuration

| Parameter | Default | Override example |
|---|---|---|
| depth | auto | "quick scope" / "deep interview" / "ask 3 questions" |
| divergence | auto (Deep + open solution space only; never Light) | "brainstorm this" / "explore options first" (force on) / "I know what I want, just clarify" (force off) |
| mode | auto-detected (Step 2.5) | "treat this as a plan review" / "fresh idea, ignore the existing spec" |
| plan-review-mode | user-picked when mode = plan-review | "expand the scope" / "hold scope, find risks" / "cut to minimum" / "cherry-pick expansions" |
| output | conversation | "save to spec" / "write a contract" / "write a handoff plan" / "save answers" |
| zones | auto (3-5) | "focus on technical risks and UX" |
| idea-critic | auto-on for idea-stage | "skip the idea critic" (records override in spec frontmatter) |
