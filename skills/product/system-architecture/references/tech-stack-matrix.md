# Tech Stack Decision Matrix

Quick reference for choosing tech stacks based on project type and requirements.

## Frontend Frameworks

| Stack | Best For | Pros | Cons | Cost |
|-------|----------|------|------|------|
| **Next.js** | Full-stack apps, SEO-critical | SSR, great DX, Vercel integration | Can be overkill for simple SPAs | Free tier on Vercel |
| **React + Vite** | SPAs, rapid prototyping | Fast, flexible, huge ecosystem | No SSR out of box | Free hosting options |
| **Remix** | Data-heavy apps, complex forms | Excellent form handling, nested routing | Smaller ecosystem than Next | Free tier available |
| **Astro** | Content sites, blogs, docs | Fast, partial hydration, MD support | Less interactive by default | Free |
| **SvelteKit** | Small bundles, high performance | Minimal JS, great DX | Smaller ecosystem | Free |

## Backend Frameworks

| Stack | Best For | Pros | Cons | Performance |
|-------|----------|------|------|-------------|
| **Next.js API Routes** | Monolith, same team frontend/backend | Single codebase, easy deployment | Couples frontend/backend | Good |
| **Express.js** | APIs, microservices, flexibility | Mature, huge middleware ecosystem | Unopinionated, need structure | Good |
| **Fastify** | High performance Node APIs | Fast, schema validation built-in | Smaller ecosystem than Express | Excellent |
| **FastAPI (Python)** | Data science, ML integration | Auto docs, type hints, async | Python performance limits | Good |
| **tRPC** | TypeScript fullstack, type safety | E2E type safety, no codegen | Couples frontend/backend | Excellent |

## Databases

| DB | Best For | Pros | Cons | Scale Complexity |
|----|----------|------|------|------------------|
| **PostgreSQL** | Most apps, relational data | Robust, mature, great for complex queries | Learning curve for optimization | Medium |
| **MongoDB** | Rapid iteration, flexible schema | Fast to start, easy to change schema | Can get messy at scale | Medium |
| **Supabase** | PostgreSQL + Auth + Realtime | All-in-one, generous free tier | Vendor lock-in | Low |
| **PlanetScale** | MySQL at scale | Branching, easy scaling | MySQL limitations | Low |
| **Turso** | Edge SQLite | Fast, distributed, cheap | New, smaller ecosystem | Low |

## Hosting Platforms

| Platform | Best For | Pros | Cons | Cost Model |
|----------|----------|------|------|-----------|
| **Vercel** | Next.js, frontend-heavy | Zero config, great DX, edge functions | Can get expensive at scale | internal |
| **Railway** | Fullstack, databases, Docker | Simple, good free tier, DB included | Less global than Vercel | internal |
| **Fly.io** | Global apps, low latency | Edge deployment, Docker support | Steeper learning curve | internal |
| **Render** | Simple deployments | Easy, good free tier | Slower cold starts on free | internal |
| **Cloudflare Pages** | Static + serverless | Fast, cheap, generous free tier | CF Workers constraints | Very cheap |

## Authentication

| Service | Best For | Pros | Cons | Price |
|---------|----------|------|------|-------|
| **Clerk** | Modern apps, social auth | Best DX, prebuilt UI, orgs | Most expensive | $25/mo start |
| **Supabase Auth** | PostgreSQL apps | Free, integrated with DB | Basic UI | Free tier |
| **Auth0** | Enterprise, compliance | Mature, feature-rich | Complex pricing, heavy | $23/mo start |
| **Lucia** | Self-hosted, full control | Free, lightweight, TypeScript | More work to implement | Free |
| **NextAuth.js** | Next.js apps | Free, flexible | More setup needed | Free |

## File Storage

| Service | Best For | Pros | Cons | Price |
|---------|----------|------|------|-------|
| **Cloudinary** | Images, transformations | Auto optimization, transformations | Expensive at scale | Free tier |
| **UploadThing** | Simple uploads, Next.js | Easy, type-safe, generous free tier | Newer service | Free tier |
| **AWS internal** | Large scale, cheap storage | Cheap at scale, reliable | Complex pricing, setup | internal |
| **Vercel Blob** | Small files, Next.js apps | Simple, integrated | Expensive for large files | internal |

## Headless CMS

| CMS | Best For | Pros | Cons | Price |
|-----|----------|------|------|-------|
| **Strapi** | Self-hosted, customizable | Open-source, full control, REST + GraphQL, plugin ecosystem | Needs hosting, more setup | Free (self-hosted) |
| **Sanity** | Real-time collaboration | GROQ queries, real-time, great studio | Learning curve, costs at scale | Free tier |
| **Contentful** | Enterprise, large teams | Mature, good DX, extensive integrations | Expensive, complex pricing | $300/mo start |
| **Payload** | Code-first, TypeScript | TypeScript native, self-hosted, flexible | Newer, smaller community | Free (self-hosted) |
| **Directus** | Database-first, existing DBs | Wraps existing DBs, open-source | Less opinionated | Free (self-hosted) |

## Common Stack Combinations

### Rapid MVP (Get to market fast)
```
Frontend: Next.js
Backend: Next.js API routes
Database: Supabase (PostgreSQL + Auth)
Hosting: Vercel
File Storage: UploadThing
```
**Why:** Single codebase, minimal config, generous free tiers, fast deployment

### High Performance App
```
Frontend: React + Vite
Backend: Fastify or tRPC
Database: PostgreSQL (PlanetScale or Supabase)
Hosting: Fly.io or Railway
Cache: Upstash Redis
```
**Why:** Optimized for speed, scalable, good DX

### Content-Heavy Site
```
Frontend: Astro or Next.js
Database: PostgreSQL or MongoDB
Hosting: Vercel or Cloudflare Pages
CMS: Strapi, Sanity, or Contentful
```
**Why:** Excellent SEO, fast page loads, content management (Strapi for self-hosted control, Sanity/Contentful for managed)

### Real-time Application
```
Frontend: Next.js or SvelteKit
Backend: Node.js + Socket.io or Supabase Realtime
Database: PostgreSQL
Hosting: Railway or Fly.io
```
**Why:** WebSocket support, real-time subscriptions

### Mobile-First PWA
```
Frontend: Next.js or Remix
State: React Query + Zustand
Database: PostgreSQL
Hosting: Vercel
Offline: Workbox service workers
```
**Why:** Progressive enhancement, offline support, mobile-optimized

## Decision Framework

Ask these questions to narrow down:

1. **Team skill set?**
 - TypeScript strong → Next.js/tRPC
 - Python background → FastAPI + React
 - Want simplest → Supabase stack

2. **Performance critical?**
 - Yes → Fastify/tRPC, Fly.io, caching layer
 - No → Next.js full stack, Vercel

3. **Budget constraints?**
 - Tight → Maximize free tiers (Vercel, Supabase, Railway)
 - Flexible → Choose best tools (Clerk, PlanetScale)

4. **Scale expectations?**
 - <10k users → Any modern stack works
 - 10k-100k → Focus on caching, DB optimization
 - 100k+ → Consider microservices, CDN, dedicated DB

5. **Dev speed priority?**
 - Critical → Next.js + Supabase (fastest to production)
 - Important → Choose based on team expertise
 - Not critical → Optimize for performance/cost

## Anti-Patterns to Avoid

- Don't use microservices for MVPs (premature optimization)
- Don't build auth from scratch (use existing solutions)
- Don't use MongoDB if you have complex relations (use PostgreSQL)
- Don't use serverless for long-running tasks (use dedicated servers)
- Don't use GraphQL unless you have a strong reason (REST is simpler)
