# Tech Stack Patterns

## Stack Recommendations by Use Case

### MVP / Startup Stack

```
Frontend:
- Framework: Next.js 14 - Server components, built-in routing, Vercel deployment
- State: Zustand - Simple, no boilerplate, great DX
- UI: shadcn/ui + Tailwind - Accessible components, highly customizable
- Data Fetching: TanStack Query - Caching, optimistic updates, auto-refetch

Backend:
- Runtime: Node.js - Same language as frontend, huge ecosystem
- Framework: Next.js API routes - Collocated with frontend, easy deployment
- Validation: Zod - Type-safe, runtime validation

Database:
- Primary: PostgreSQL (Supabase) - Relational data, built-in auth, real-time
- Cache: Redis (Upstash) - Session storage, rate limiting

Infrastructure:
- Hosting: Vercel - Zero-config Next.js deployment, edge functions
- Files: Cloudinary - Image transformations, optimization
- Email: Resend - Developer-friendly, good deliverability

Auth: Clerk - Full auth solution, social providers, org support
Payments: Stripe - Industry standard, great DX
Analytics: PostHog - Self-hosted option, product analytics + feature flags
```

### Enterprise SaaS Stack

```
Frontend:
- Framework: Next.js 14 (App Router)
- State: TanStack Query + Zustand
- UI: Radix UI + Tailwind
- Forms: React Hook Form + Zod

Backend:
- Framework: Next.js API Routes or separate Express/Fastify
- ORM: Prisma or Drizzle
- Queue: BullMQ with Redis
- Search: Meilisearch or Typesense

Database:
- Primary: PostgreSQL (Neon or Supabase)
- Cache: Redis (Upstash)
- Blob Storage: internal or Cloudflare R2

Infrastructure:
- Hosting: Vercel or AWS (ECS/Lambda)
- CDN: Cloudflare
- Monitoring: Sentry + Datadog

Auth: Clerk or Auth.js
Payments: Stripe
Email: Resend or SendGrid
```

### Real-time Application Stack

```
Frontend:
- Framework: Next.js or Remix
- Real-time: Supabase Realtime or Ably
- State: Zustand with subscriptions

Backend:
- WebSockets: Supabase Realtime or Socket.io
- Pub/Sub: Redis
- Background Jobs: Inngest or Trigger.dev

Database:
- Primary: Supabase (PostgreSQL with real-time)
- Cache: Redis for presence/state
```

## Technology Comparison Tables

### Frontend Frameworks

| Framework | Best For | Pros | Cons |
|-----------|----------|------|------|
| Next.js | Full-stack apps | SSR, API routes, great DX | Learning curve, Vercel lock-in |
| Remix | Data-heavy apps | Forms, nested routes | Smaller ecosystem |
| Vite + React | SPAs | Fast builds, simple | No SSR built-in |
| Astro | Content sites | Performance, islands | Less for apps |

### State Management

| Library | Best For | Pros | Cons |
|---------|----------|------|------|
| TanStack Query | Server state | Caching, mutations | Learning curve |
| Zustand | Client state | Simple, small | Less structure |
| Jotai | Atomic state | Flexible, small | Requires planning |
| Redux Toolkit | Complex state | Predictable, middleware | Boilerplate |

### Databases

| Database | Best For | Pros | Cons |
|----------|----------|------|------|
| Supabase | MVPs | Auth, real-time, storage | PostgreSQL only |
| PlanetScale | Scale | Branching, serverless | MySQL syntax |
| Neon | Serverless | Branching, PostgreSQL | Newer |
| MongoDB Atlas | Documents | Flexible schema | Not relational |

### Authentication

| Provider | Best For | Pros | Cons |
|----------|----------|------|------|
| Clerk | Full solution | UI components, orgs | Cost at scale |
| Auth.js | internal | Free, flexible | More work |
| Supabase Auth | Supabase users | Integrated | Supabase only |
| Firebase Auth | Firebase stack | Easy setup | Firebase lock-in |

### Hosting

| Platform | Best For | Pros | Cons |
|----------|----------|------|------|
| Vercel | Next.js | Zero config, edge | Expensive at scale |
| Railway | Full stack | Easy, good DX | Less control |
| Render | Various | Simple, free tier | Slower deploys |
| AWS | Enterprise | Full control | Complexity |
| Fly.io | Global | Edge, containers | Learning curve |

### Headless CMS

| CMS | Best For | Pros | Cons |
|-----|----------|------|------|
| Strapi | Self-hosted, customizable | Open-source, REST + GraphQL, plugins | Needs hosting |
| Sanity | Real-time, collaboration | GROQ, real-time studio | Learning curve |
| Contentful | Enterprise teams | Mature, integrations | Expensive |
| Payload | Code-first TypeScript | internal | Newer |

## Common Integration Patterns

### Stripe Integration

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 apiVersion: '2023-10-16',
});

// Create checkout session
export async function createCheckoutSession(priceId: string, userId: string) {
 return stripe.checkout.sessions.create({
 mode: 'subscription',
 payment_method_types: ['card'],
 line_items: [{ price: priceId, quantity: 1 }],
 success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
 cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
 client_reference_id: userId,
 });
}
```

### Email with Resend

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
 await resend.emails.send({
 from: 'noreply@yourapp.com',
 to: email,
 subject: 'Welcome to App',
 html: `<p>Hello ${name}, welcome!</p>`,
 });
}
```

### File Upload with Cloudinary

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: third-party cohort): Promise<string> {
 const result = await cloudinary.uploader.upload(
 `data:image/png;base64,${file.toString('base64')}`,
 { folder: 'uploads' }
 );
 return result.secure_url;
}
```
