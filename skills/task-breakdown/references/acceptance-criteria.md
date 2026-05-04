# Acceptance Criteria Templates

Templates and examples for writing clear, verifiable acceptance criteria by task type. Every criterion should pass the 5-second rule: can someone read it and know exactly what to verify?

**Note on "ONE testable thing" vs acceptance criteria:** A task changes ONE thing but can have multiple criteria that verify different aspects of that thing. "Create login" changes one thing (authentication) but tests valid credentials, invalid credentials, and session creation.

---

## The 5-Second Rule

Read the acceptance criterion. Within 5 seconds, you should know:
1. What action to take
2. What result to expect
3. Whether it passed or failed

**Passes the rule:**
> Submit signup form with valid email/password. User appears in Supabase Auth dashboard. Confirmation email arrives in inbox.

**Fails the rule:**
> User registration works correctly and handles all edge cases.

---

## Database / Schema Tasks

### Template
```
[Migration action] → [verify structure]. [Constraint test] → [expected error/behavior].
[If migrating data] → [verify data integrity with count or spot check].
[Rollback] → [previous state restored].
```

### Examples

**New table:**
> Run migration. `users` table exists with columns: id (uuid, PK), email (varchar, unique), created_at (timestamptz, default now()). Insert duplicate email fails with unique constraint violation.

**Add column with backfill:**
> Run migration. `projects` table has `workspace_id` column (uuid, FK to workspaces). All existing projects have workspace_id set to default workspace. No null values in workspace_id.

**Add index:**
> Run migration. Queries filtering orders by user_id sorted by created_at complete in <100ms for 10k+ rows. Query plan shows index scan, not sequential scan.

**Seed data:**
> Run seed script. Database contains 50 users, 200 projects, 1000 tasks. No constraint violations. Seed is idempotent. Running twice doesn't duplicate data.

---

## API Endpoint Tasks

### Template
```
[HTTP method] [path] with [valid input] → [status code] + [response shape].
[HTTP method] [path] with [invalid input] → [error status] + [error message].
[Auth requirement] → [401/403 behavior].
```

### Examples

**Create resource:**
> POST /api/projects with `{ name: "Test", description: "..." }` and valid auth token returns 201 with `{ data: { id, name, description, createdAt } }`. Without auth token returns 401. With missing name returns 422 with validation error on `name` field.

**List with pagination:**
> GET /api/projects?page=1&limit=10 with valid auth returns 200 with `{ data: [...], pagination: { page: 1, limit: 10, total, totalPages } }`. Returns only projects belonging to authenticated user. Empty array (not error) when user has no projects.

**Update resource:**
> PATCH /api/projects/:id with `{ name: "Updated" }` and valid auth returns 200 with updated project. Updating another user's project returns 403. Non-existent id returns 404. Invalid id format returns 400.

**Delete resource:**
> DELETE /api/projects/:id with valid auth returns 204. Project no longer appears in GET /api/projects. Associated tasks are also deleted (cascade). Deleting non-existent project returns 404.

**Webhook endpoint:**
> POST /api/webhooks/stripe with valid Stripe signature returns 200. With invalid signature returns 400. payment_intent.succeeded event creates payment record in database. Duplicate event (same idempotency key) doesn't create duplicate record.

---

## UI Component Tasks

### Template
```
[Component] renders [content] with [data state].
[User interaction] → [visible result].
[Empty/loading/error state] → [appropriate display].
[Responsive] → [behavior at breakpoint].
[Accessibility] → [keyboard/screen reader behavior].
```

### Examples

**Data display component:**
> Task list renders all tasks for current user with title, due date, and status badge. Completed tasks show strikethrough styling. Empty state shows "No tasks yet" with create button. Loading state shows visual feedback, not a blank screen.

**Interactive form:**
> Create project form has name (required) and description (optional) fields. Submit with valid data creates project and redirects to project page. Submit with empty name shows inline "Name is required" error without page reload. Submit button shows spinner during API call and is disabled to prevent double submission.

**Modal/dialog:**
> Delete confirmation modal appears on delete button click. Shows project name in confirmation text. "Cancel" closes modal with no side effects. "Delete" calls API, closes modal, removes project from list. If API fails, modal stays open with error message.

**Responsive layout:**
> Dashboard shows 3-column grid on desktop (>1024px), 2-column on tablet (768-1024px), single column on mobile (<768px). Navigation collapses to hamburger menu on mobile. All interactive elements have minimum 44x44px touch targets on mobile.

**Accessible component:**
> All form fields have associated labels (not just placeholder text). Tab order follows visual order. Error messages are announced by screen readers (aria-live region). Dropdown menu is keyboard navigable with arrow keys and closes on Escape.

---

## Integration Tasks

### Template
```
[Service A] triggers [action in Service B] → [end-to-end result].
[Data flows] from [source] to [destination] with [expected transformation].
[Failure in Service B] → [graceful handling in Service A].
```

### Examples

**Third-party API integration:**
> User registration triggers welcome email via Resend. Email arrives within 30 seconds with correct user name and onboarding link. If Resend API fails, user registration still succeeds (email is non-blocking). Failed email is logged with error details.

**Service-to-service communication:**
> Creating an order in the orders service publishes event to message queue. Inventory service receives event and decrements stock. Stock count in inventory matches expected value. If inventory service is down, order still succeeds and event is retried.

**End-to-end data flow:**
> User creates task in UI. Task appears in database with correct user_id and timestamps. Task appears in task list without page reload (optimistic update or WebSocket). Editing task title in UI updates database and reflects in all connected clients.

---

## DevOps / Infrastructure Tasks

### Template
```
[Action/trigger] → [infrastructure result].
[Health check] → [expected response].
[Environment variable] → [accessible by application].
[Failure scenario] → [recovery behavior].
```

### Examples

**Deployment pipeline:**
> Push to main branch triggers GitHub Actions workflow. Build completes without errors. Application is accessible at staging URL within 5 minutes. Health endpoint `/api/health` returns 200 with `{ status: "ok", version: "<git-sha>" }`.

**Container setup:**
> `docker compose up` starts all services (app, database, redis). App responds on localhost:3000. Database is accessible and migrations run automatically. `docker compose down` stops all services cleanly.

**Environment configuration:**
> Application reads DATABASE_URL, REDIS_URL, and API_KEY from environment variables. Missing required variable causes startup failure with clear error message naming the missing variable. `.env.example` documents all required variables with placeholder values.

**Monitoring setup:**
> Application logs structured JSON to stdout. Error logs include request ID, user ID (if authenticated), and stack trace. Health endpoint returns 200 when all dependencies are connected, 503 when database is unreachable.

---

## Auth / Security Tasks

### Template
```
[Auth action] → [session/token result].
[Protected resource] without auth → [rejection].
[Role/permission check] → [access granted or denied].
[Token lifecycle] → [expiry and refresh behavior].
```

### Examples

**Login/logout:**
> POST /api/auth/login with valid credentials returns 200 with access token (15min expiry) and refresh token (7 day expiry). Invalid credentials return 401 with generic "Invalid email or password" (no hint about which field is wrong). POST /api/auth/logout invalidates current session. Subsequent requests with same token return 401.

**Role-based access:**
> Admin user can access GET /api/admin/users and sees all users. Regular user accessing same endpoint returns 403. Role is checked from token claims, not from a separate database query per request.

**Password reset:**
> POST /api/auth/forgot-password with registered email sends reset link. Link contains one-time token valid for 1 hour. POST /api/auth/reset-password with valid token and new password updates password. Old password no longer works. Used or expired token returns 400.

**Token refresh:**
> POST /api/auth/refresh with valid refresh token returns new access token. Old access token continues to work until its original expiry. Refresh with expired refresh token returns 401. After successful refresh, old refresh token is invalidated (rotation).

---

## Anti-Patterns

### Vague criteria
> "The feature works correctly"
> "Users can manage their tasks"
> "Error handling is implemented"

**Problem:** No one knows what to test. "Works correctly" means different things to everyone.

### Untestable criteria
> "Code is clean and well-organized"
> "Performance is acceptable"
> "Security best practices are followed"

**Problem:** These are subjective. What's "acceptable" performance? 100ms? 2 seconds?

**Fix:** Make it measurable. "API response time is under 200ms for p95 requests" is testable.

### Too many conditions in one criterion
> "User can sign up, log in, reset password, update profile, change avatar, and delete account"

**Problem:** If the test fails, which part broke? This is 6 tasks pretending to be one acceptance criterion.

**Fix:** One acceptance criterion per task. Each tests ONE behavior.

### Implementation-as-criteria
> "Uses React Query for data fetching with staleTime of 5 minutes"
> "Implements bcrypt with 12 salt rounds"

**Problem:** This dictates HOW, not WHAT. The agent should choose implementation. Acceptance verifies outcomes.

**Fix:** "User data loads from cache on subsequent visits without API call for 5 minutes." The agent picks the caching strategy.

### Testing the tool, not the outcome
> "Prisma migration runs successfully"
> "Jest tests pass"

**Problem:** A migration can "run successfully" and create the wrong schema. Tests can pass and miss the bug.

**Fix:** "Migration creates users table with unique email constraint. Insert duplicate email fails." Verify the actual state, not the tool's exit code.

---

## Writing Checklist

Before finalizing acceptance criteria for any task:

| Check | Question |
|-------|----------|
| Specific | Does it name the exact action and expected result? |
| Observable | Can you see/measure the result without reading code? |
| Binary | Is it clearly pass or fail, with no "sort of works"? |
| Independent | Does it test this task only, not upstream tasks? |
| Quick | Can someone verify it in under 2 minutes? |
| Outcome-focused | Does it describe WHAT, not HOW? |

**Template sentence structure:** `[Action] with [input/state] produces [observable result].`

This structure forces specificity. If you can't fill in all three parts, the criterion isn't ready.
