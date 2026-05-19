---
title: System-Architecture — Worked Example
lifecycle: canonical
status: stable
produced_by: system-architecture
load_class: EXAMPLE
---

# Worked Example: SaaS Invoicing Tool

**Load when:** triangulating to a target — operator wants to know what a full architecture pass looks like end-to-end with all 7 agents, or the orchestrator needs an anchor for output shape + critic decisions.

---

## Invocation

```
/system-architecture
> I need architecture for a SaaS invoicing tool. Small businesses send
> invoices, clients pay online. Need Stripe integration.
```

## Orchestrator gathers context

- **Users:** business owners (send invoices), clients (view/pay)
- **Scale:** ~500 businesses, ~2000 invoices/month at launch (5,000/month at 12 months target)
- **Integrations:** Stripe for payments, SendGrid for email
- **Constraints:** small team (2 full-stack engineers), fast launch needed (8 weeks)
- **Compliance:** none beyond standard data hygiene
- **Deployment:** greenfield

Warm Start short-circuit because spec is in the invocation + scale derivable from "small businesses" framing. Operator confirmed without override.

## Layer 1 (parallel)

**`stack-selection-agent`** recommends:
- **Framework:** Next.js 14 (App Router) — operator's "fast launch" + small team favors batteries-included.
- **DB:** Supabase Postgres — Auth + RLS + Storage in one provider; PGLite for tests.
- **Auth:** Clerk — Stripe integration is first-class via metadata + webhooks; cheaper than rolling own.
- **Payments:** Stripe (constraint)
- **Email:** Resend over SendGrid — better DX, similar pricing, native React Email integration.
- **Hosting:** Vercel
- **Trade-off documented:** Supabase RLS vs. application-layer auth → picked RLS for the scale (avoid an auth bug becoming a data leak); flagged the migration cost if scale demands a separate auth service later.

**`infrastructure-agent`** plans:
- Vercel for hosting (preview deploys per PR)
- GitHub Actions for CI (typecheck + tests + lint)
- Sentry for error tracking
- Vercel Analytics for product analytics
- Stripe webhook endpoint with signature verification + replay protection
- Env var list: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SENTRY_DSN`, `NEXT_PUBLIC_APP_URL` (10 vars total — complete list per Critical Gate 4)

## Layer 2 (sequential)

**`schema-agent`** designs:
- `businesses` (id, name, stripe_customer_id, owner_clerk_id, created_at) — index on `owner_clerk_id`
- `clients` (id, business_id, email, name, created_at) — index on `(business_id, email)`
- `invoices` (id, business_id, client_id, amount_cents, currency, status, stripe_payment_intent_id, due_date, created_at) — indexes on `(business_id, status)` + `stripe_payment_intent_id`
- `payments` (id, invoice_id, stripe_charge_id, amount_cents, paid_at) — index on `stripe_charge_id`
- RLS policies: business owners see only their own data; public access via signed link only.

**`api-agent`** maps:
- `POST /api/invoices` (business_owner) — create invoice + Stripe payment intent
- `GET /api/pay/:token` (public, signed token) — invoice + Stripe checkout session
- `POST /api/webhooks/stripe` (stripe_signature header) — payment.succeeded / payment.failed → update invoice.status
- `POST /api/webhooks/clerk` (clerk_signature header) — user.created → create business
- `GET /api/invoices` (business_owner) — list w/ filter by status
- All endpoints covered per Critical Gate 2 (every user-facing feature → endpoint).

**`integration-agent`** designs:
- File structure: Next.js App Router conventions (`app/(auth)`, `app/(dashboard)`, `app/api/`, `lib/`, `db/`, `emails/`)
- Stripe checkout flow: server-side intent creation → client redirect → webhook confirms → email
- Resend integration: React Email template per email type (invoice-sent, payment-received, payment-failed)
- Dependency classification (per `dependency-classification.md`): Supabase = Local-substitutable (PGLite), Clerk = True external (mock at boundary), Stripe = True external, Resend = True external, Sentry = True external.

**`scaling-agent`** validates:
- Bottleneck at 10x: PDF generation in webhook handler (synchronous; will timeout at scale). Recommend: move to background job (Vercel Cron + Upstash Queue) post-launch.
- Webhook failure modes traced: Stripe retries 3× over 3 days; idempotency key on `stripe_payment_intent_id` prevents double-update. Acceptable.
- DB at 100x: pg_stat_statements check at scale; current schema sound for projected query patterns.

## Critic review

PASS — all 8 quality gates pass:
1. Tech rationale: ✓ (every choice has alternatives + trade-off documented)
2. API for every feature: ✓ (5 endpoints cover all flows)
3. Schema covers entities: ✓ (businesses, clients, invoices, payments — all spec'd entities)
4. Env var list complete: ✓ (10 vars)
5. File structure matches conventions: ✓ (Next.js App Router)
6. Auth covers all roles: ✓ (business_owner via Clerk; public via signed token)
7. ≥1 trade-off documented: ✓ (Supabase RLS vs. app-layer auth)
8. Every dependency classified: ✓ (5 deps, all classified)

## Artifact saved

`architecture/system-architecture.md` with all 12 sections + §12a STRIDE (5 critical flows) + §12b OWASP scan + §12d Not Flagged log. §12c skipped (no LLM/AI in this system).

`status: done`. No Open Questions (revision-loop never triggered).

## Lessons embedded

- **Why Supabase over a separate Postgres + Auth split:** small team + 8-week launch + need for RLS made the bundled choice correct despite the lock-in cost. Documented trade-off so a future team can revisit if scale shifts.
- **Why Resend over SendGrid despite operator naming SendGrid:** stack-selection-agent's job is to recommend the best fit, not silently rubber-stamp operator's stated choice. Surfaced the alternative + rationale; operator can override.
- **Why webhook idempotency on `stripe_payment_intent_id` not `webhook_event_id`:** Stripe retries the same payment intent under different event IDs in failure cases. Keying on payment_intent_id is correct.
- **Why PDF generation flagged but not redesigned in v1:** scaling-agent identifies it as the 10x bottleneck but doesn't force a redesign now — premature optimization. Documented as a known limit; v2 architecture pass would address.
