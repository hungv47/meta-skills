# Task Sizing Examples

Practical examples of right-sized vs wrong-sized tasks. A well-sized task changes ONE testable thing and takes 5-30 minutes of agent implementation time.

---

## Too Big: Split These

Tasks that hide multiple independent concerns. The tell: acceptance criteria need "and" between unrelated conditions.

### 1. "Build the authentication system"

Split into:
- User registration with email/password
- Login with session/token creation
- Protected route middleware
- Password reset flow
- Email verification

Why: Each piece is independently testable and shippable. Login doesn't need password reset to work.

### 2. "Create CRUD for projects"

Split into:
- Database schema for projects with constraints
- Create project endpoint (POST)
- List/get project endpoints (GET)
- Update project endpoint (PATCH)
- Delete project with cascade handling (DELETE)

Why: Each HTTP method has different validation, error cases, and response shapes. Testing all at once makes failures ambiguous.

### 3. "Integrate Stripe payments"

Split into:
- Stripe SDK setup with test keys
- Create checkout session endpoint
- Webhook handler for payment_intent.succeeded
- Store payment record in database
- Display payment status in UI

Why: Webhook handling alone has enough complexity (signature verification, idempotency) to be its own task.

### 4. "Build the dashboard page"

Split into:
- Dashboard layout with navigation shell
- Stats summary cards with data fetching
- Recent activity feed component
- Charts/graphs for key metrics

Why: Each section has independent data sources and failure modes. The layout can ship with placeholder content.

### 5. "Set up CI/CD pipeline"

Split into:
- GitHub Actions workflow for linting and type checking
- Test runner in CI with coverage reporting
- Build step with artifact caching
- Deploy to staging on PR merge
- Deploy to production on release tag

Why: Linting in CI works without deploy. Each stage has its own config and failure modes.

### 6. "Add multi-tenancy support"

Split into:
- Tenant table and relationship to users
- Row-level security policies per tenant
- Tenant context middleware (extract from subdomain/header)
- Scope all queries to current tenant
- Tenant admin management UI

Why: RLS policies alone need careful testing. Mixing with UI work makes failures impossible to isolate.

### 7. "Build real-time notifications"

Split into:
- Notification data model and storage
- WebSocket connection setup
- Server-side event publishing on triggers
- Client-side notification display component
- Mark-as-read and notification preferences

Why: WebSocket infrastructure is independent from notification business logic.

### 8. "Implement search functionality"

Split into:
- Search index setup (Postgres full-text or Elasticsearch)
- Search API endpoint with query parsing
- Search results UI with highlighting
- Filters and faceted search
- Search analytics tracking

Why: The index setup and API are backend-only tasks; UI and analytics are separate concerns.

---

## Too Small: Combine These

Tasks that aren't independently meaningful. The tell: you'd never demo or test one without the other.

### 1. "Create Button component" + "Add onClick handler to Button"

Combine into: **Interactive Button component with click handling and visual states**

Why: A button without click handling isn't testable in any meaningful way.

### 2. "Add email field to form" + "Add email validation"

Combine into: **Email input with format validation and error display**

Why: An unvalidated field has no acceptance criteria worth testing.

### 3. "Create users table" + "Add index on users.email"

Combine into: **Users table with unique email constraint and query-optimized indexes**

Why: The index is part of the schema design, not a separate deliverable.

### 4. "Install React Query" + "Create useUser hook"

Combine into: **User data fetching with caching and loading/error states**

Why: Installing a library isn't a task. The outcome is the data-fetching behavior.

### 5. "Add TypeScript types for API response" + "Create API client function"

Combine into: **Typed API client for [resource] with request/response contracts**

Why: Types without usage aren't testable. The client function is the deliverable.

### 6. "Create .env.example file" + "Add DATABASE_URL to config"

Combine into: **Environment configuration with database connection and documented env vars**

Why: Config setup is one concern. Splitting it creates artificial dependencies.

### 7. "Add loading spinner component" + "Show spinner during data fetch"

Combine into: **Loading state handling for [feature] with visual feedback**

Why: A spinner component in isolation isn't worth verifying. The loading UX is the task.

### 8. "Create error boundary" + "Add error fallback UI"

Combine into: **Error boundary with user-facing fallback and error reporting**

Why: An error boundary without a fallback UI is half-done. Test them together.

---

## Just Right: The Sweet Spot

Each of these changes ONE testable thing with clear pass/fail criteria.

### 1. Database schema task
**"Database stores user records with unique emails and timestamps"**
- Acceptance: Insert two users with same email fails with constraint violation. Created_at auto-populates.
- Stack: Any ORM/migration tool (Prisma, Drizzle, raw SQL)

### 2. API endpoint task
**"API returns paginated list of projects for authenticated user"**
- Acceptance: GET /api/projects with valid token returns `{ data: [...], pagination: { page, total } }`. Without token returns 401.
- Stack: Next.js API routes, Express, Bun.serve

### 3. React component task
**"Task list renders with completion toggle and optimistic updates"**
- Acceptance: Click checkbox toggles done state immediately. On API failure, reverts with error toast.
- Stack: React, Next.js, any state management

### 4. Auth middleware task
**"Protected routes reject unauthenticated requests and extract user context"**
- Acceptance: Request without token returns 401. Valid token populates `req.user` with userId and role.
- Stack: Express middleware, Next.js middleware, Bun.serve routes

### 5. DevOps task
**"Application deploys to staging on push to main branch"**
- Acceptance: Push commit to main triggers GitHub Actions workflow. App is accessible at staging URL within 5 minutes.
- Stack: GitHub Actions, Docker, Vercel, Fly.io

### 6. Integration task
**"Email sends on successful user registration via Resend"**
- Acceptance: Register new user triggers welcome email. Resend dashboard shows delivery. Failed send doesn't block registration.
- Stack: Resend, SendGrid, any email provider

### 7. Data migration task
**"Existing projects migrate to include workspace_id foreign key"**
- Acceptance: Migration runs without data loss. All existing projects assigned to default workspace. Rollback restores previous state.
- Stack: Prisma migrate, Drizzle kit, Knex migrations

### 8. Security task
**"Rate limiting prevents brute force on login endpoint"**
- Acceptance: 6th login attempt within 1 minute returns 429 with retry-after header. Limit resets after window expires.
- Stack: Any rate-limiting middleware or Redis-based solution

---

## Quick-Reference Sizing Checklist

Before finalizing a task, check:

| Question | If Yes |
|----------|--------|
| Does acceptance have multiple unrelated conditions? | Split into separate tasks |
| Would you change multiple files for different reasons? | Split by concern |
| Could two engineers work on parts simultaneously? | Split into parallel tasks |
| Is there only one way to verify it? | Good size |
| Can an agent finish it in under 30 minutes? | Good size |
| Is the failure cause obvious when it breaks? | Good size |
| Would you never test this in isolation? | Combine with its dependent |
| Is this just installing/configuring a tool? | Combine with first usage |
| Is the "task" really just a code change with no behavior? | Combine with the behavior it enables |

**Rule of thumb:** If you can describe the task's acceptance criteria in one sentence without "and" joining unrelated things, the size is right.
