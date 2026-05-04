# Dependency Patterns

Common task dependency patterns, how to identify them, and how to handle them in a task breakdown.

---

## Core Patterns

### Linear Chain

A strict sequence where each task requires the previous one.

```
Task 1 → Task 2 → Task 3 → Task 4
```

**When it appears:** Setup flows, migration sequences, feature builds that layer on top of each other.

**Example:**
```
Task 1: Database schema for users        (depends: none)
Task 2: User registration endpoint        (depends: 1)
Task 3: Login with session creation        (depends: 2)
Task 4: Protected dashboard page           (depends: 3)
```

**Risk:** Long chains are fragile. A block on Task 2 stops everything downstream.

**Mitigation:** Find tasks that don't actually depend on the previous one. Can Task 4's layout be built with a mock auth context? If so, break the chain.

---

### Fan-Out (One-to-Many)

One task unblocks multiple independent tasks.

```
        ┌→ Task 2
Task 1 ─┼→ Task 3
        └→ Task 4
```

**When it appears:** After foundational setup, after schema creation, after core infrastructure.

**Example:**
```
Task 1: Project schema + CRUD API          (depends: none)
Task 2: Project list page                  (depends: 1)
Task 3: Project settings panel             (depends: 1)
Task 4: Project export to CSV              (depends: 1)
```

**Benefit:** Maximum parallelism. Three agents or engineers can work simultaneously after Task 1 ships.

**Tip:** Actively seek fan-out opportunities. They're the fastest way to compress timelines.

---

### Fan-In (Many-to-One)

Multiple tasks must complete before a downstream task can start.

```
Task 2 ─┐
Task 3 ─┼→ Task 5
Task 4 ─┘
```

**When it appears:** Integration tasks, end-to-end tests, features that combine multiple subsystems.

**Example:**
```
Task 2: Stripe checkout session endpoint   (depends: 1)
Task 3: Order creation with line items     (depends: 1)
Task 4: Email notification on purchase     (depends: 1)
Task 5: End-to-end purchase flow test      (depends: 2, 3, 4)
```

**Risk:** Fan-in is a bottleneck. If any upstream task is late, the downstream task is blocked.

**Mitigation:** Keep fan-in tasks minimal in scope. They should only verify integration, not add new logic.

---

### Diamond Dependency

A fan-out followed by a fan-in, forming a diamond shape.

```
        ┌→ Task 2 ─┐
Task 1 ─┤          ├→ Task 4
        └→ Task 3 ─┘
```

**When it appears:** Common in feature builds where a foundation enables parallel work that converges in a UI or integration layer.

**Example:**
```
Task 1: Auth middleware + user context      (depends: none)
Task 2: User profile API endpoint           (depends: 1)
Task 3: User avatar upload endpoint         (depends: 1)
Task 4: Profile settings page (shows profile + avatar) (depends: 2, 3)
```

**Risk:** Task 4 can't start until both branches complete. If Task 3 has issues, the whole diamond stalls.

**Tip:** Check if Task 4 can be split. Can the profile display ship without avatar upload? If yes, remove the diamond.

---

### External Dependencies

Tasks that require something outside the codebase: API keys, third-party accounts, human approvals, infrastructure provisioning.

```
[Human: create Stripe account] → Task 3: Integrate Stripe SDK
[Human: provision database]    → Task 1: Database schema
[Human: approve design]       → Task 6: Build final UI
```

**Rule:** External dependencies go in Prerequisites, never buried inside a task.

**Bad:**
```
## Task 5: Send transactional emails
Outcome: Users receive welcome email on signup
Acceptance: Register → email arrives in inbox
```
(Where does the Resend API key come from? Who sets it up?)

**Good:**
```
## Prerequisites
- Resend API key in .env.local (RESEND_API_KEY)

## Task 5: Send transactional emails
Depends on: 2
Human action: Verify RESEND_API_KEY is set in .env.local
Outcome: Users receive welcome email on signup
Acceptance: Register → email arrives in inbox
```

---

## Identifying Hidden Dependencies

Hidden dependencies are the most common source of task failure. Look for these patterns:

| Signal | Hidden Dependency | Fix |
|--------|-------------------|-----|
| Task mentions an env var not in Prerequisites | External setup needed | Add to Prerequisites |
| Task uses a library not installed yet | Setup/install task missing | Add setup task or bundle with first usage |
| Task assumes a UI component exists | Earlier task didn't create it | Add dependency or create shared component task |
| Task writes to a table not in the schema | Schema task is missing or incomplete | Review schema task scope |
| Task calls an API endpoint defined in a later task | Circular or misordered dependency | Reorder tasks |
| Task requires "admin" role but no role system exists | Auth/role system not decomposed | Add role system task before this one |

### The "Blank Slate" Test

For each task, imagine starting with only what its declared dependencies produce. Can you complete it? If you'd need to look at another task's output or ask "wait, where does X come from?", there's a hidden dependency.

---

## Dependency Visualization

Use ASCII DAGs in task documents for complex dependency graphs.

### Simple Format
```
1 (setup)
├─ 2 (schema)
│  ├─ 4 (CRUD API)
│  └─ 5 (seed data)
├─ 3 (auth)
│  └─ 6 (protected routes)
└─ 7 (deploy config)

Integration: 8 (depends: 4, 5, 6)
```

### Table Format (for linear reviews)
```
| Task | Depends On | Unblocks  | Parallel With |
|------|------------|-----------|---------------|
| 1    | --          | 2, 3, 7   | --             |
| 2    | 1          | 4, 5      | 3, 7          |
| 3    | 1          | 6         | 2, 7          |
| 4    | 2          | 8         | 3, 5, 6, 7    |
| 5    | 2          | 8         | 3, 4, 6, 7    |
| 6    | 3          | 8         | 2, 4, 5, 7    |
| 7    | 1          | --         | 2, 3, 4, 5, 6 |
| 8    | 4, 5, 6    | --         | 7             |
```

---

## Common Mistakes and Fixes

### Mistake 1: Everything depends on Task 1
```
Task 1 → Task 2
Task 1 → Task 3
Task 1 → Task 4
Task 1 → Task 5
Task 1 → Task 6
```
**Problem:** Task 1 becomes a massive bottleneck. Often means Task 1 is too big.

**Fix:** Split Task 1 into independent foundations. Schema setup and auth setup can be separate tasks if they don't share state.

### Mistake 2: Circular dependency
Task 5 says "depends on 7" and Task 7 says "depends on 5."

**Fix:** One of them doesn't truly depend on the other. Find the shared foundation and extract it as a new task.

### Mistake 3: Unnecessary sequential ordering
```
Task 3: Build header component     (depends: 2)
Task 4: Build footer component     (depends: 3)
```
**Problem:** Footer doesn't need header. These are parallel.

**Fix:** Both depend on Task 2 (layout shell), not on each other.

### Mistake 4: Missing the integration task
Five tasks fan out from Task 1, but nothing ties them together.

**Fix:** Add an explicit integration/smoke-test task that depends on all branches and verifies the pieces work together.

---

## When to Break a Dependency vs. Accept It

**Break it when:**
- The dependency is on implementation detail, not on output (use an interface/mock instead)
- The downstream task can work with a stub or placeholder
- Breaking it enables meaningful parallelism (saves calendar time)

**Accept it when:**
- The dependency is on actual data or state (schema must exist before queries)
- Breaking it would require more work than the serial wait costs
- The upstream task is small and low-risk (will definitely ship quickly)

**Guideline:** If the upstream task takes under 10 minutes and has no uncertainty, a serial dependency is fine. If it's risky or slow, find ways to decouple.

**Never break a dependency if it would create a cycle.** If breaking A→B creates B→A (or a longer cycle), extract a third task C that both A and B depend on, then re-evaluate the graph.
