// proof-client — typed client for the Proof agent bridge (U5).
//
// Shapes are grounded in the U1 spike (_spike/FINDINGS.md), not the upstream
// docs (which omit response schemas). Auth: ops carry a Bearer token —
// ownerSecret for the operator, a scoped non-owner token for agents.

export interface CreateInput {
  markdown: string;
  title: string;
  role?: "viewer" | "commenter" | "editor";
  ownerId?: string;
}

export interface CreateResult {
  slug: string;
  docId?: string;
  url?: string;
  ownerSecret?: string;
  accessToken?: string;
  accessRole?: string;
}

export class ProofError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message);
    this.name = "ProofError";
  }
}

const STALE_CODE = "PROJECTION_STALE";

export class ProofClient {
  constructor(private readonly baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async req(method: string, path: string, opts: { body?: unknown; bearer?: string; accept?: string } = {}): Promise<{ status: number; text: string; json: any }> {
    const headers: Record<string, string> = {};
    if (opts.body !== undefined) headers["content-type"] = "application/json";
    if (opts.bearer) headers["authorization"] = `Bearer ${opts.bearer}`;
    if (opts.accept) headers["accept"] = opts.accept;
    const res = await fetch(this.baseUrl + path, {
      method,
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    });
    const text = await res.text();
    let json: any;
    try { json = JSON.parse(text); } catch { /* non-json (e.g. text/markdown) */ }
    return { status: res.status, text, json };
  }

  async createDocument(input: CreateInput): Promise<CreateResult> {
    const r = await this.req("POST", "/documents", {
      body: { role: "commenter", ...input },
    });
    if (r.status !== 200 || !r.json?.slug) {
      throw new ProofError(`createDocument failed: ${r.status} ${r.text.slice(0, 200)}`, r.status, r.json?.code);
    }
    return r.json as CreateResult;
  }

  /** Byte-faithful full-doc export (spike: GET /d/:slug + Accept: text/markdown). */
  async exportMarkdown(slug: string, accessToken?: string): Promise<string> {
    const q = accessToken ? `?token=${encodeURIComponent(accessToken)}` : "";
    const r = await this.req("GET", `/d/${slug}${q}`, { accept: "text/markdown" });
    if (r.status !== 200) throw new ProofError(`exportMarkdown failed: ${r.status}`, r.status);
    // text/markdown returns raw; a json variant nests it under .markdown.
    return typeof r.json?.markdown === "string" ? r.json.markdown : r.text;
  }

  /** Operator-facing readiness gate for `open`: poll a non-mutating endpoint
   *  until the doc's projection-backed surface responds, so `open` doesn't print
   *  "ready" / launch the editor mid-build (the immediately-after-create
   *  PROJECTION_STALE window, _spike/FINDINGS.md §Readiness race). The agent ops
   *  path below retries STALE independently — this is belt + braces for the human.
   *  Bounded by the deadline, never throws: stale responses — and thrown fetch
   *  rejections, treated as transiently stale — are retried until the deadline
   *  (worst case: a flapping loopback polls the full window before proceeding);
   *  an auth/other response just means we can't probe this way, so we proceed
   *  rather than block. */
  async waitReady(slug: string, deadlineMs = 30_000): Promise<boolean> {
    const deadline = Date.now() + deadlineMs;
    for (;;) {
      let stale: boolean;
      try {
        const r = await this.req("GET", `/documents/${slug}/events/pending?limit=1`);
        if (r.status === 200) return true;
        stale = r.status === 409 || r.json?.code === STALE_CODE;
      } catch {
        // A thrown fetch rejection (loopback dropped the connection mid-probe) is
        // treated like a transient not-ready response so no error escapes.
        stale = true;
      }
      if (!stale || Date.now() >= deadline) return false;
      await new Promise((res) => setTimeout(res, 300));
    }
  }

  /** POST /ops with automatic retry on the PROJECTION_STALE window (high variance:
   *  observed 17ms–>10s depending on the repair worker; 30s is a safe ceiling). */
  private async ops(slug: string, op: Record<string, unknown>, bearer?: string, retryStaleMs = 30_000): Promise<any> {
    const deadline = Date.now() + retryStaleMs;
    for (;;) {
      const r = await this.req("POST", `/documents/${slug}/ops`, { body: op, bearer });
      if (r.status === 200 && r.json?.success) return r.json;
      const code = r.json?.code;
      if (code === STALE_CODE && Date.now() < deadline) {
        await new Promise((res) => setTimeout(res, 400));
        continue;
      }
      throw new ProofError(`ops ${String(op.type)} failed: ${r.status} ${r.text.slice(0, 200)}`, r.status, code);
    }
  }

  /** Agent suggestion (suggest-only path; never accept/reject from here). */
  async suggest(slug: string, args: { quote: string; content: string; kind?: string }, by: string, bearer?: string): Promise<any> {
    return this.ops(slug, { type: "suggestion.add", by, kind: args.kind ?? "replace", quote: args.quote, content: args.content }, bearer);
  }

  async comment(slug: string, args: { quote: string; text: string }, by: string, bearer?: string): Promise<any> {
    return this.ops(slug, { type: "comment.add", by, quote: args.quote, text: args.text }, bearer);
  }
}
