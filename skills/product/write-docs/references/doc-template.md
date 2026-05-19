# Documentation Template

Use this structure when generating product documentation. Adapt sections based on what the codebase reveals.

---

## Template Structure

```markdown
# [Product Name]

[One sentence describing what this product does and who it's for.]

## What It Does

[2-3 paragraphs explaining the product's purpose, the problem it solves, and its core value. Write as if explaining to someone who has never seen the product.]

### Core Capabilities

[List 3-5 main features with brief explanations. Focus on user benefits, not technical implementation.]

**[Feature Name]**
[What users can do with this feature and why it matters.]

## Getting Started

### Requirements

[List what users need before they can use the product. Include system requirements, accounts, permissions, or dependencies.]

### First-Time Setup

[Step-by-step instructions for initial configuration. Number each step and include expected outcomes.]

1. [Action to take]
 - Expected result: [What users should see]

2. [Next action]
 - Expected result: [What users should see]

## How to Use [Product Name]

### [Primary Workflow Name]

[Describe the main thing users will do with this product. Walk through the complete flow.]

**To [accomplish main task]:**

1. [First step with specific UI element or action]
2. [Second step]
3. [Continue until workflow complete]

**What happens next:** [Explain the result and any follow-up actions]

### [Secondary Workflow Name]

[Repeat pattern for additional key workflows]

## Features Reference

### [Feature Category]

#### [Specific Feature]

**Purpose:** [Why this feature exists]

**How it works:** [Brief explanation of behavior]

**To use this feature:**
1. [Steps]
2. [Steps]

**Tips:**
- [Useful information for getting more value]
- [Common patterns or best practices]

## Common Tasks

### [Task Name]

**When to use:** [Situation that triggers this need]

**Steps:**
1. [Action]
2. [Action]

[Repeat for 5-10 most common tasks based on codebase analysis]

## Troubleshooting

### [Common Issue]

**Symptoms:** [What users experience]

**Cause:** [Why this happens]

**Solution:** [How to fix it]

[Derive issues from error handling code, validation logic, and edge cases in the implementation]

## Configuration Options

| Setting | Purpose | Default | Valid Values |
|---------|---------|---------|--------------|
| [name] | [what it controls] | [default] | [options] |

[Populate from config files, environment variables, and settings patterns in code]

## Glossary

**[Term]:** [Plain language definition based on how the codebase uses this concept]

[Include terms that appear frequently in the UI or that users need to understand]
```

---

## Writing Guidelines

**Voice and Tone**
- Active voice over passive
- Direct and concise
- Friendly but professional
- Confident without being condescending

**Bad:** "The document can be exported by clicking the export button."
**Good:** "Click Export to download your document."

**Explaining Concepts**
- Start with what something does, then how
- Use analogies for complex ideas
- Provide concrete examples
- Avoid jargon unless defining it

**Describing UI**
- Name exact buttons, menus, and fields
- Describe visual indicators and feedback
- Include expected states and transitions
- Note where things are located

**Step-by-Step Instructions**
- Number each action
- One action per step
- Include expected outcomes
- Specify exact UI elements to interact with

---

## Extracting Content from Code

Map code patterns to documentation content:

| Code Pattern | Documentation Section |
|--------------|----------------------|
| README, package descriptions | What It Does |
| CLI args, environment vars | Configuration Options |
| Error handling, validation | Troubleshooting |
| Route definitions | Features Reference |
| Component state logic | How to Use workflows |
| Types/models with comments | Glossary |
| Setup scripts, migrations | Getting Started |
| Tests with descriptions | Common Tasks |
