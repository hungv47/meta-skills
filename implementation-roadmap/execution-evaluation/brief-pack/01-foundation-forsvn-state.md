# Brief 01 — Foundation, `/forsvn`, and State

## Goal

Create the system backbone: a single orchestration entrypoint, a shared product context, and one canonical place for memory, artifacts, evaluations, and reusable experience.

## Why This Matters

Right now the stack behaves like a bag of good tools. The user has to know which one to call, where the inputs live, and how to carry learnings between runs. `/forsvn` should turn that into an agent operating system: understand the request, gather context, choose the path, trigger the right skills, and preserve continuity.

## `/forsvn` Core Skill

`/forsvn` is the front door for users who do not know where to start or what to do next.

It should:
- classify the user request
- ask short clarifying questions when the goal is ambiguous
- load product context, `.forsvn` state, prior artifacts, evals, and experience
- route to one skill or sequence several skills
- trigger skills when the next action is clear
- resume previous initiatives
- explain the next action briefly before dispatching

It should not replace specialist skills. Direct skill calls should keep working.

## Interview Requirement

Before coding, the implementation agent must interview the user and decide:
- Is `/forsvn` the default entrypoint or the only public entrypoint?
- Does `/forsvn` stay noun/branded despite the verb-first naming rule?
- Should it create `.forsvn/` automatically on every invocation?
- Does existing `skills-resources/` migrate into `.forsvn/`, remain canonical, or become legacy?
- What first workflow should prove the system: brand, campaign, content, eval, or code quality?

## Shared Product Context

Create a shared product-marketing context file consumed before dispatch by product and marketing skills.

Required sections:
1. Product overview
2. Target audience
3. Personas and buying roles
4. Problems and pain points
5. Competitive landscape
6. Differentiation
7. Objections and anti-personas
8. Switching dynamics
9. Customer language
10. Brand voice
11. Proof points
12. Goals

Autodraft from `README.md`, `package.json`, landing pages, existing research, and brand docs when available. User review is required before treating it as canonical.

## State and Artifact Model

Pick one canonical state root. Recommended direction: `.forsvn/` as the branded workspace, with import or compatibility for existing `skills-resources/`.

State should cover:
- product context
- artifacts by initiative and skill
- eval loops and results
- experience entries
- quality dashboard
- critic override log
- routing/resume metadata

Avoid `.agents/` for user-facing artifacts; keep it for infrastructure only.

## Experience Layer

Create reusable knowledge files:

```text
.forsvn/experience/
├── README.md
├── content.md
├── product.md
├── audience.md
├── patterns.md
└── business.md
```

High-confidence findings from eval loops get promoted here. Skills read relevant entries before starting.

## Acceptance Checks

- A vague request like "help me launch this" causes `/forsvn` to ask concise questions, then route to a concrete workflow.
- A second invocation can find previous state and resume.
- Product context is read before relevant skills ask cold-start questions.
- New artifacts land in one predictable tree.
- Existing direct skill calls still work during migration.
