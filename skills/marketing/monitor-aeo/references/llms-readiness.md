---
last_verified: 2026-06-13
verifier: audit-wave2
churn: high
---

# llms.txt + AI Crawler Readiness

> The technical-readiness surface this skill owns. Bing/IndexNow checks live alongside in `readiness-agent`; this ref focuses on the AI-specific layer: `llms.txt`, `llms-full.txt`, and AI crawler access posture.

The wider SEO technical audit (Core Web Vitals, hreflang, schema, indexation, canonicalization) belongs to `optimize-seo` Route A. The boundary: this skill checks what AI-search surfaces specifically need; `optimize-seo` checks what classic search needs.

---

## `/llms.txt` — purpose and structure

`/llms.txt` is a proposed convention (initially by Jeremy Howard / Answer.AI) for a site to publish a curated, LLM-friendly summary of itself at the well-known path `/llms.txt`. It's not (yet) an RFC; it's a community standard that some AI products do respect and others don't.

**Minimal valid structure:**

```markdown
# [Project / company name]

> [One-sentence summary describing what the site is]

[Optional: a paragraph or two of context explaining the scope and audience]

## Docs

- [Page title](https://example.com/docs/page): one-line description

## Examples

- [Example title](https://example.com/examples/foo): one-line description

## Optional

- [Anything that's not core but useful]: one-line description
```

**Structural checks `readiness-agent` runs:**

| Check | Pass criterion |
|---|---|
| Path | served at exactly `/llms.txt` (root, not nested) |
| Content-Type | `text/plain; charset=utf-8` or `text/markdown` |
| H1 present | first line of content starts with `# ` |
| Blockquote summary | a `> ` line within the first 5 lines |
| `## Docs` section | present (other sections optional) |
| Link validity | every link in `## Docs` returns 200 (sample 5 if list > 20) |
| Length | < 8 KB recommended; > 16 KB is `partial` (some consumers truncate) |

---

## `/llms-full.txt` — purpose and structure

The "full" companion: concatenated canonical-page markdown for the entire site (or the docs subset). Designed to be ingestable in one fetch by an LLM that wants the whole picture without crawling every page.

**Structural checks:**

| Check | Pass criterion |
|---|---|
| Path | served at `/llms-full.txt` |
| Content-Type | `text/plain` or `text/markdown` |
| Begins with | the same H1 + blockquote summary as `/llms.txt` |
| Followed by | per-page sections, each starting with the page H1 and including the canonical URL |
| Length | the per-fetch token cost is the trade-off; many sites cap at 200 KB |

`llms-full.txt` is optional. Its absence is `missing` from a maximalist readiness lens, but operators with very large doc sets may legitimately ship only `llms.txt` + good per-page chunking.

---

## AI crawler access — robots.txt parsing

`readiness-agent` parses `robots.txt` against the canonical user-agent list in `provider-matrix.md`. The relevant patterns:

**Full block:**
```
User-agent: GPTBot
Disallow: /
```
→ status: `missing` (AEO-readiness lens)

**Path-scoped block (acceptable):**
```
User-agent: GPTBot
Disallow: /admin/
Disallow: /api/
```
→ status: `ready` (public content still crawlable)

**Allow-list with default disallow (acceptable):**
```
User-agent: GPTBot
Allow: /docs/
Allow: /blog/
Disallow: /
```
→ status: `partial` (only allow-listed content crawlable; note coverage)

**No directive (default allow):**
```
# nothing about GPTBot
```
→ status: `ready` (crawler defaults to allow when not named)

---

## Cloudflare / WAF rate-limiting

A crawler that's allowed in `robots.txt` may still be rate-limited or blocked by upstream infrastructure (Cloudflare Bot Management, AWS WAF, Vercel firewall). `readiness-agent` cannot detect this from robots alone — it requires the operator to supply the WAF rule export OR a sample of crawler-named requests showing 403/429 responses in server logs.

When operator hasn't supplied WAF context: tag crawler `ready` based on robots.txt but note "WAF posture not checked — supply WAF rules or server-log sample of crawler responses for full check."

---

## When to surface `missing` as actionable vs operator-decision

Crawlers commonly blocked intentionally (operator decision, not a gap):

- CCBot — Common Crawl indexes broadly; some operators block for non-AEO reasons (privacy, scraping concerns)
- Bytespider — many non-CN operators block ByteDance entirely
- Diffbot — commercial knowledge-graph scraper; some operators block as a paywall move
- Applebot-Extended — recent addition; some operators leave at default disallow

`readiness-agent` reports these as `missing` from the AEO-readiness lens but the resolves-with column reads `unblock if [provider] access desired (operator decision — some intentionally block)` so the operator can decide whether to act.

Crawlers a healthy AEO posture should NOT block:

- GPTBot (training)
- OAI-SearchBot (retrieval)
- PerplexityBot (retrieval)
- ClaudeBot (retrieval)
- Google-Extended (Gemini training)

Blocking any of these and wanting AI citations is contradiction; `readiness-agent` surfaces this as a hard `missing`.

---

## IndexNow

IndexNow is a Microsoft-led submission protocol (also adopted by Yandex, Naver) for pushing URL changes to search engines without waiting for re-crawl. Bing announced experimental ingestion of IndexNow signals for AI Overview / Copilot retrieval refresh.

**Minimum implementation:**

1. Generate a per-site key (random string, 8-128 chars)
2. Place a `{key}.txt` file at root containing just the key (or at `/[key].txt` mapped from `robots.txt`)
3. Submit URL changes via `POST https://api.indexnow.org/IndexNow` or the Bing equivalent

`readiness-agent` checks:

- Key file presence at root
- Submission log (if operator-supplied) shows recent submissions
- Robots.txt declares the key location (recommended)

Absent IndexNow doesn't block AEO — most providers don't use it. But operators targeting Bing-backed surfaces (Copilot, Bing Generative Search) get faster refresh with it.

---

## Quick-reference status logic

| Signal | `ready` | `partial` | `missing` |
|---|---|---|---|
| `/llms.txt` presence | live, valid structure | live but structure deviation | 404 / 5xx |
| `/llms-full.txt` presence | live, structurally valid | live but truncated/stale | 404 (acceptable if `llms.txt` covers needs) |
| Crawler X access | not blocked, no WAF issue | path-scoped allow, or WAF rate-limit | full disallow |
| Bing Webmaster verification | verified | verified but sitemap stale | not verified |
| IndexNow key | present, declared in robots | present but not declared | missing |
| Sitemap freshness (Bing crawl) | last crawl < 60 days | 60-180 days | > 180 days |
