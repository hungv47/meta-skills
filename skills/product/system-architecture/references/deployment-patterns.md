# Deployment Patterns

## Environment Variables

### Standard Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/db
DATABASE_URL_UNPOOLED=postgresql://... # For migrations

# Auth
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
# OR
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://yourapp.com

# Payments
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Services
RESEND_API_KEY=re_...
CLOUDINARY_URL=cloudinary://...
POSTHOG_API_KEY=phc_...

# App
NEXT_PUBLIC_APP_URL=https://yourapp.com
NODE_ENV=production
```

### Environment Management

```
.env # Default values, committed (no secrets)
.env.local # Local overrides, NOT committed
.env.development # Development-specific
.env.production # Production-specific (on server only)
```

---

## Vercel Deployment

### Project Setup

1. Connect GitHub repository
2. Configure build settings:
 - Framework: Next.js (auto-detected)
 - Build Command: `npm run build`
 - Output Directory: `.next`
3. Add environment variables
4. Enable preview deployments for PRs

### vercel.json Configuration

```json
{
 "git": {
 "deploymentEnabled": {
 "main": true,
 "develop": true
 }
 },
 "headers": [
 {
 "source": "/(.*)",
 "headers": [
 { "key": "X-Frame-Options", "value": "DENY" },
 { "key": "X-Content-Type-Options", "value": "nosniff" }
 ]
 }
 ],
 "redirects": [
 {
 "source": "/old-page",
 "destination": "/new-page",
 "permanent": true
 }
 ]
}
```

---

## Docker Deployment

### Dockerfile for Next.js

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json./
RUN npm ci

# Rebuild source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules./node_modules
COPY..
RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
 app:
 build:.
 ports:
 - "3000:3000"
 environment:
 - DATABASE_URL=postgresql://postgres:password@db:5432/app
 - REDIS_URL=redis://redis:6379
 depends_on:
 - db
 - redis

 db:
 image: postgres:15-alpine
 volumes:
 - postgres_data:/var/lib/postgresql/data
 environment:
 - POSTGRES_USER=postgres
 - POSTGRES_PASSWORD=password
 - POSTGRES_DB=app

 redis:
 image: redis:7-alpine
 volumes:
 - redis_data:/data

volumes:
 postgres_data:
 redis_data:
```

---

## CI/CD with GitHub Actions

### Main Workflow

```yaml
#.github/workflows/ci.yml
name: CI/CD

on:
 push:
 branches: [main, develop]
 pull_request:
 branches: [main]

env:
 NODE_VERSION: '20'

jobs:
 lint-and-test:
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v4

 - name: Setup Node.js
 uses: actions/setup-node@v4
 with:
 node-version: ${{ env.NODE_VERSION }}
 cache: 'npm'

 - name: Install dependencies
 run: npm ci

 - name: Run linter
 run: npm run lint

 - name: Run type check
 run: npm run type-check

 - name: Run tests
 run: npm test

 build:
 needs: lint-and-test
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v4

 - name: Setup Node.js
 uses: actions/setup-node@v4
 with:
 node-version: ${{ env.NODE_VERSION }}
 cache: 'npm'

 - name: Install dependencies
 run: npm ci

 - name: Build
 run: npm run build
 env:
 DATABASE_URL: ${{ secrets.DATABASE_URL }}

 deploy-preview:
 needs: build
 if: github.event_name == 'pull_request'
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v4

 - name: Deploy to Vercel Preview
 uses: amondnet/vercel-action@v25
 with:
 vercel-token: ${{ secrets.VERCEL_TOKEN }}
 vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
 vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

 deploy-production:
 needs: build
 if: github.ref == 'refs/heads/main'
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v4

 - name: Deploy to Vercel Production
 uses: amondnet/vercel-action@v25
 with:
 vercel-token: ${{ secrets.VERCEL_TOKEN }}
 vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
 vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
 vercel-args: '--prod'
```

### Database Migrations

```yaml
#.github/workflows/migrations.yml
name: Database Migrations

on:
 push:
 branches: [main]
 paths:
 - 'prisma/migrations/**'

jobs:
 migrate:
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v4

 - name: Setup Node.js
 uses: actions/setup-node@v4
 with:
 node-version: '20'
 cache: 'npm'

 - run: npm ci

 - name: Run migrations
 run: npx prisma migrate deploy
 env:
 DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## Monitoring & Observability

### Error Tracking (Sentry)

```typescript
// sentry.client.config.ts
import * as Sentry from 'practitioner source/nextjs';

Sentry.init({
 dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
 tracesSampleRate: 1.0,
 environment: process.env.NODE_ENV,
 integrations: [
 new Sentry.Replay({
 maskAllText: true,
 blockAllMedia: true,
 }),
 ],
 replaysSessionSampleRate: 0.1,
 replaysOnErrorSampleRate: 1.0,
});
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
 const checks = {
 status: 'ok',
 timestamp: new Date().toISOString(),
 uptime: process.uptime(),
 database: await checkDatabase(),
 redis: await checkRedis(),
 };

 const allHealthy = Object.values(checks).every(v => v !== 'error');

 return Response.json(checks, {
 status: allHealthy ? 200 : 503
 });
}

async function checkDatabase() {
 try {
 await db.$queryRaw`SELECT 1`;
 return 'ok';
 } catch {
 return 'error';
 }
}

async function checkRedis() {
 try {
 await redis.ping();
 return 'ok';
 } catch {
 return 'error';
 }
}
```

### Logging

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
 level: process.env.LOG_LEVEL || 'info',
 transport: process.env.NODE_ENV === 'development'
 ? { target: 'pino-pretty' }
 : undefined,
 base: {
 env: process.env.NODE_ENV,
 },
});

// Usage
logger.info({ userId, action: 'login' }, 'User logged in');
logger.error({ err, userId }, 'Failed to process payment');
```
