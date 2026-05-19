# Ship Log Template

Use this structure when generating a ship log (product context snapshot). The ship log is written for two audiences simultaneously: a non-technical person who wants to understand what the app does, and a coding agent that needs context for its next task.

---

## Template Structure

```markdown
---
skill: docs-writing
mode: ship-log
version: 1
date: {{today}}
status: current
---

# [Product Name]

[One paragraph: what this app does, who it's for, and the core problem it solves. Write as if explaining to a friend who isn't technical.]

## What This App Does

[2-3 paragraphs in plain language. No jargon. A non-technical person should be able to read this and explain it to someone else. Cover: what problem it solves, who uses it, what makes it different.]

## Features

[List every user-facing feature. For each one, describe what it does and how a user interacts with it. Write from the user's perspective — "you can..." not "the system provides..."]

### [Feature Name]

**What it does:** [Plain-language description of the feature's purpose]

**How to use it:** [Step-by-step from the user's perspective — what they click, type, or see]

**Why it matters:** [What problem this solves or what value it provides]

[Repeat for every user-facing feature]

## Tech Stack

[List the technologies used with a brief purpose for each. Group by layer.]

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | [framework] | [what it handles] |
| Backend | [framework/runtime] | [what it handles] |
| Database | [database] | [what it stores] |
| Hosting | [platform] | [where it runs] |
| [Other] | [tool/service] | [what it does] |

### Key Architecture Decisions

[2-5 bullet points on notable architecture choices and WHY they were made. These help coding agents understand constraints.]

## Shipping History

[Timeline of significant changes. Derived from git history. Focus on user-facing changes, not internal refactors. Most recent first.]

| Date | What Shipped | Impact |
|------|-------------|--------|
| [pattern-derived] | [What changed in plain language] | [What users can now do differently] |

### Milestones

[3-5 key milestones in the project's life — initial launch, major pivots, significant feature additions]

## Current State

### What's Working
[Bullet list of features/flows that are stable and in production]

### In Progress
[What's actively being built or improved — helps agents avoid conflicts]

### Known Limitations
[Honest list of what doesn't work well, known bugs, or intentional scope boundaries]

## How It All Fits Together

[1-2 paragraphs describing the main user flow from start to finish. "A user signs up, then... which leads to... and finally..." This gives both humans and agents a mental model of the product.]

## For Coding Agents

[Section specifically for AI coding agents. Include:]

### Project Structure
[Key directories and what they contain — just enough to orient, not a full file tree]

### Important Patterns
[Conventions the codebase follows that an agent should match — naming, file organization, error handling approach]

### What to Watch Out For
[Gotchas, non-obvious dependencies, things that break if changed carelessly]
```

---

## Writing Guidelines for Ship Logs

**The dual-audience rule:** Every section must work for both audiences. A non-technical reader should understand WHAT and WHY. A coding agent should understand WHAT and HOW.

**Plain language first:** Default to explaining things simply. Add technical detail in parentheses or in the "For Coding Agents" section only.

- Bad: "The app uses a pub/sub pattern with Redis for real-time event propagation"
- Good: "Updates appear instantly for all users (real-time sync via Redis pub/sub)"

**Features from the user's chair:** Describe every feature as the user experiences it, not as the developer built it.

- Bad: "REST API with CRUD endpoints for task management"
- Good: "You can create, edit, and organize tasks into projects. Changes save automatically."

**Shipping history from git, not memory:** Extract history from `git log`, not from what someone remembers. Focus on commits/PRs that changed user-facing behavior. Skip internal refactors, dependency bumps, and CI fixes.

**Current state must be honest:** The "Known Limitations" section exists for a reason. An agent that doesn't know about a limitation will try to build on a broken foundation.

**Tech stack with purpose:** Never list a technology without explaining why it's there. "React" is not useful. "React — handles the UI, using server components for fast initial load" is useful.

---

## Extracting Content from Code for Ship Logs

| Code Pattern | Ship Log Section |
|--------------|-----------------|
| package.json name + description | Product name, What This App Does |
| README.md, landing page copy | What This App Does |
| Route definitions, page components | Features catalog |
| package.json dependencies | Tech Stack |
| Dockerfile, vercel.json, infra configs | Tech Stack (Hosting layer) |
| `git log --oneline` | Shipping History |
| `git tag` | Milestones |
| TODO comments, GitHub issues | In Progress, Known Limitations |
| Error handlers, edge cases | Known Limitations, What to Watch Out For |
| Directory structure | Project Structure |
| Naming patterns, shared utilities | Important Patterns |

---

## Merge Strategy

The orchestrator (SKILL.md Route D) owns the merge decision and passes a `merge-mode` to the writer-agent. The writer-agent does NOT decide the strategy — it follows what it receives:

- `preserve-marketing` → keep existing icp-research sections under `## Market Context`, add ship log sections below
- `overwrite` → write full ship log from scratch (orchestrator already renamed old file)
- `create` → no existing file, write full ship log from scratch
