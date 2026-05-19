# File Structure Patterns

## Next.js 14 (App Router)

```
project-root/
├── app/ # Next.js 14 app router
│ ├── (auth)/ # Auth routes group (layout shared)
│ │ ├── login/page.tsx # Login page
│ │ └── register/page.tsx # Registration page
│ ├── (dashboard)/ # Protected routes group
│ │ ├── layout.tsx # Dashboard shell with sidebar
│ │ ├── page.tsx # Dashboard home
│ │ ├── settings/page.tsx # User settings
│ │ └── projects/
│ │ ├── page.tsx # Projects list
│ │ └── [id]/page.tsx # Project detail
│ ├── api/ # API routes
│ │ ├── auth/ # Auth endpoints
│ │ ├── projects/ # Projects CRUD
│ │ └── webhooks/ # Webhook handlers
│ ├── layout.tsx # Root layout (providers, fonts)
│ └── page.tsx # Landing page
│
├── components/
│ ├── ui/ # shadcn components (button, dialog, etc.)
│ ├── layouts/ # Layout components (sidebar, nav)
│ ├── features/ # Feature-specific components
│ │ ├── projects/ # Project-related components
│ │ ├── auth/ # Auth forms, modals
│ │ └── dashboard/ # Dashboard widgets
│ └── shared/ # Shared components (loading, error)
│
├── lib/
│ ├── db/ # Database client and queries
│ │ ├── client.ts # Prisma/Drizzle client
│ │ ├── schema.ts # Database schema
│ │ └── queries/ # Reusable queries
│ ├── api/ # API client for frontend
│ │ └── client.ts # Fetch wrapper with auth
│ ├── auth/ # Auth utilities
│ ├── validations/ # Zod schemas
│ └── utils.ts # Shared utilities
│
├── stores/ # Zustand stores
│ ├── user-store.ts # User state
│ ├── project-store.ts # Projects state
│ └── ui-store.ts # UI state (modals, sidebar)
│
├── hooks/ # Custom React hooks
│ ├── use-project.ts # Project CRUD hooks
│ ├── use-auth.ts # Auth hooks
│ └── use-debounce.ts # Utility hooks
│
├── types/ # TypeScript types
│ ├── database.ts # Database types
│ ├── api.ts # API request/response types
│ └── index.ts # Shared types
│
├── public/ # Static assets
│ ├── images/
│ └── fonts/
│
└── config/
 ├── site.ts # Site metadata, URLs
 └── constants.ts # App constants
```

### What Each Part Does

`app/`: Next.js 14 app directory. Each folder is a route. Route groups with `()` share layouts but don't add URL segments.

`components/ui/`: Base UI components from shadcn. Copied into project and fully customizable.

`components/features/`: Feature-specific components that combine UI components. Each feature gets its own folder.

`lib/db/`: All database access goes here. Never query DB directly from components or API routes.

`lib/api/`: Client-side API wrapper. Handles auth tokens, error handling, request formatting.

`stores/`: Global state management. Keep stores small and focused. Most state should be server state (TanStack Query).

`hooks/`: Reusable logic. Hooks should be pure functions that compose smaller hooks.

---

## Express/Node.js API

```
project-root/
├── src/
│ ├── index.ts # App entry point
│ ├── server.ts # Express server setup
│ │
│ ├── routes/ # Route definitions
│ │ ├── index.ts # Route aggregator
│ │ ├── auth.routes.ts # Auth endpoints
│ │ ├── users.routes.ts # User endpoints
│ │ └── projects.routes.ts # Project endpoints
│ │
│ ├── controllers/ # Request handlers
│ │ ├── auth.controller.ts
│ │ ├── users.controller.ts
│ │ └── projects.controller.ts
│ │
│ ├── services/ # Business logic
│ │ ├── auth.service.ts
│ │ ├── users.service.ts
│ │ └── projects.service.ts
│ │
│ ├── models/ # Database models
│ │ ├── user.model.ts
│ │ └── project.model.ts
│ │
│ ├── middleware/ # Express middleware
│ │ ├── auth.middleware.ts
│ │ ├── error.middleware.ts
│ │ └── validation.middleware.ts
│ │
│ ├── utils/ # Utilities
│ │ ├── logger.ts
│ │ ├── errors.ts
│ │ └── helpers.ts
│ │
│ ├── types/ # TypeScript types
│ │ └── index.ts
│ │
│ └── config/ # Configuration
│ ├── database.ts
│ └── env.ts
│
├── tests/
│ ├── unit/
│ └── integration/
│
└── prisma/ # If using Prisma
 └── schema.prisma
```

---

## Python (FastAPI/Flask)

```
project-root/
├── src/
│ ├── __init__.py
│ ├── main.py # App entry point
│ │
│ ├── api/ # API routes
│ │ ├── __init__.py
│ │ ├── deps.py # Dependencies (auth, db)
│ │ └── v1/
│ │ ├── __init__.py
│ │ ├── auth.py
│ │ ├── users.py
│ │ └── projects.py
│ │
│ ├── core/ # Core configuration
│ │ ├── __init__.py
│ │ ├── config.py # Settings
│ │ └── security.py # Auth utilities
│ │
│ ├── models/ # SQLAlchemy models
│ │ ├── __init__.py
│ │ ├── user.py
│ │ └── project.py
│ │
│ ├── schemas/ # Pydantic schemas
│ │ ├── __init__.py
│ │ ├── user.py
│ │ └── project.py
│ │
│ ├── services/ # Business logic
│ │ ├── __init__.py
│ │ └── user_service.py
│ │
│ └── utils/ # Utilities
│ └── __init__.py
│
├── tests/
│ ├── __init__.py
│ ├── conftest.py
│ └── test_api/
│
├── alembic/ # Database migrations
│ └── versions/
│
├── pyproject.toml
└──.env.example
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `UserCard.tsx` |
| Utilities | camelCase | `formatDate.ts`, `parseUrl.ts` |
| Constants | UPPER_SNAKE | `API_URL`, `MAX_RETRIES` |
| Hooks | camelCase with use prefix | `useAuth.ts`, `useProjects.ts` |
| Types | PascalCase | `User`, `ProjectResponse` |
| API routes | internal | `/api/user-profiles` |
| Files | kebab-case or camelCase | `user-service.ts` |
