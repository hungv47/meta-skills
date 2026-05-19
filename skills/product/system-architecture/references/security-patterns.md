# Security Patterns

Reference catalog for the scaling-agent's security review section. Covers threat modeling (STRIDE), OWASP Top 10 architecture-level checks, LLM/AI security, and false-positive exclusion rules.

## STRIDE Threat Model

For each component or data flow in the system, evaluate these six threat categories:

| Category | Question | Example Threat |
|----------|----------|---------------|
| **Spoofing** | Can an attacker pretend to be someone else? | Forged JWT, stolen API key, session hijack |
| **Tampering** | Can an attacker modify data in transit or at rest? | Modified request body, tampered database record, MITM |
| **Repudiation** | Can a user deny performing an action? | No audit log for deletions, unsigned transactions |
| **Information Disclosure** | Can an attacker access data they shouldn't? | Exposed stack traces, leaked PII in logs, verbose error messages |
| **Denial of Service** | Can an attacker make the system unavailable? | Unbounded queries, missing rate limits, resource exhaustion |
| **Elevation of Privilege** | Can an attacker gain higher access than intended? | Missing role checks, IDOR, broken access control |

### How to Apply

For each critical data flow (auth, payments, data mutations, file uploads):
1. Name the flow
2. Check each STRIDE category
3. For each applicable threat: describe the attack vector and the architectural mitigation
4. Mark as MITIGATED (design handles it) or UNMITIGATED (needs attention)

## OWASP Top 10 — Architecture-Level Checks

These are architecture-level questions, not code-level scanning. Check the system design against each:

| # | Category | Architecture Question |
|---|----------|---------------------|
| A01 | Broken Access Control | Does every API endpoint enforce role-based access? Is there a centralized auth middleware? |
| A02 | Cryptographic Failures | Are secrets stored in env vars (not code)? Is data encrypted at rest and in transit? |
| A03 | Injection | Does the stack use parameterized queries or an ORM? Are user inputs validated at the boundary? |
| A04 | Insecure Design | Were abuse cases considered during design? Are there rate limits on sensitive operations? |
| A05 | Security Misconfiguration | Are default credentials changed? Are error messages generic in production? Are unnecessary services disabled? |
| A06 | Vulnerable Components | Are dependencies audited? Is there a process for security updates? |
| A07 | Authentication Failures | Is there brute-force protection? Are sessions invalidated on logout? Is MFA supported for sensitive ops? |
| A08 | Software/Data Integrity | Are CI/CD pipelines secured? Are dependencies verified (lockfiles, checksums)? |
| A09 | Logging/Monitoring Failures | Are auth events logged? Are logs tamper-resistant? Is there alerting on anomalies? |
| A10 | Server-Side Request Forgery | Do any endpoints fetch user-provided URLs? Are internal service URLs restricted? |

## LLM/AI Security Checklist

Apply this section ONLY when the system uses AI models, LLMs, or processes AI-generated content.

### Prompt Injection

| Risk | Check |
|------|-------|
| Direct injection | Can user input reach the system prompt? Are system and user messages separated? |
| Indirect injection | Can retrieved content (RAG, web scraping, email) contain instructions the model will follow? |
| Jailbreaking | Are there guardrails against the model being instructed to ignore its instructions? |

### Output Safety

| Risk | Check |
|------|-------|
| Unsafe rendering | Is AI-generated content rendered as HTML without sanitization? (XSS via AI output) |
| Code execution | Can AI-generated code be executed without sandboxing? |
| Data exfiltration | Can the model be tricked into including sensitive data in its output? |

### Tool/Function Calling

| Risk | Check |
|------|-------|
| Unauthorized actions | Do AI tool calls go through the same auth/permission checks as user actions? |
| Input validation | Are tool call arguments validated before execution? |
| Scope limits | Can the AI call tools outside its intended scope? Are destructive operations gated? |

### Cost Amplification

| Risk | Check |
|------|-------|
| Unbounded generation | Are there token limits on AI requests? |
| Loop attacks | Can a user trigger infinite AI-to-AI loops? |
| Billing exposure | Is AI spend capped per user/request? |

## False-Positive Exclusion Rules

These are established patterns that should NOT be flagged as security issues. They prevent wasted time on non-findings.

### Definitively Not Vulnerabilities

1. **UUIDs are unguessable** — Don't flag UUID-based resource URLs as missing authorization if the UUID itself is the access token (e.g., shareable links).
2. **React/Angular/Vue are XSS-safe by default** — These frameworks auto-escape output. Only flag `dangerouslySetInnerHTML`, `v-html`, or `[innerHTML]`.
3. **Environment variables are trusted input** — Don't flag process.env reads as "unsanitized input." Env vars are server-controlled.
4. **ORMs prevent SQL injection by default** — Prisma, Drizzle, SQLAlchemy, ActiveRecord use parameterized queries. Only flag raw SQL construction.
5. **HTTPS is assumed in production** — Don't flag HTTP URLs in development configs. Flag only production configurations without TLS.
6. **Publishable API keys are public by design** — Stripe publishable keys, Firebase client config, etc. are intentionally client-side.
7. **Test fixtures are not secrets** — API keys, passwords, and tokens in test files are test data, not leaked credentials.
8. **`pull_request_target` without checkout is safe** — Only flag if the workflow checks out the PR ref (`actions/checkout` with `ref: ${{ github.event.pull_request.head.sha }}`).

### Context-Dependent (Flag Only With Evidence)

9. **Rate limiting** — Don't flag missing rate limits on internal APIs. Only flag on public-facing auth endpoints and payment endpoints.
10. **CORS configuration** — `Access-Control-Allow-Origin: *` is fine for public APIs. Only flag on authenticated endpoints.
11. **Cookie settings** — Missing `Secure` flag is only an issue in production, not development.
12. **Error messages** — Detailed errors in development mode are fine. Only flag verbose errors in production config.
13. **File uploads** — Don't flag file upload endpoints as inherently dangerous. Flag only if there's no file type/size validation.

### Never Flag

14. **DoS/resource exhaustion** — Unless it's LLM spend amplification, resource exhaustion is an ops concern, not a security finding.
15. **Test-only code** — Vulnerabilities in test helpers, fixtures, and mocks are not production risks.
16. **Archived/disabled CI workflows** — Only audit active workflows.
17. **Race conditions without concrete exploit** — "Theoretically, if two requests hit simultaneously..." is not a finding without a specific attack scenario.
18. **Missing hardening** — Absence of a security feature (e.g., no CSP header) is a hardening recommendation, not a vulnerability. Report separately.

## Confidence Gating

When producing security findings in the architecture review:

| Confidence | Action |
|------------|--------|
| 8-10/10 | Include as a finding with full detail |
| 5-7/10 | Include with caveat: "UNCERTAIN — verify this is a real risk" |
| 1-4/10 | Suppress — do not include in the report |

Every finding must include a **concrete attack scenario** — a step-by-step description of how an attacker would exploit it. If you can't describe the attack, the confidence should be <5.
