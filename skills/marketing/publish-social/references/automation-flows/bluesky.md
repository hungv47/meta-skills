# Bluesky — automation flow

> Session-cookie-driven compose-box-fill via Bluesky web client. Bluesky has NO native drafts feature (as of vintage) — flow fills the compose box and stops before Post; operator hits Post manually.

**Last verified:** 2026-05-19
**Maturity:** HIGH. Bluesky's open AT Protocol means the surface is operator-friendly; bot-detection minimal.
**Expected duration:** 5-10 seconds per "draft"

## Pre-Requirements

- `session_cookies_by_platform.bluesky` non-empty (Bluesky web session token).
- Bluesky account active.
- `drafts_by_platform.bluesky` carries: body (≤300 chars), media refs (optional), alt-text (REQUIRED per Bluesky community norm if media included).

## Login State Assumption

Cookies provide. First navigation expected at `https://bsky.app/`. Login redirect = abort.

## Navigation + Fill Sequence

| Step | Action | Selector / URL | Success Indicator | Failure → reason-class |
|---|---|---|---|---|
| 1 | Navigate | `https://bsky.app/` | Feed loaded | `login_challenge` |
| 2 | Click "New post" / compose | Compose button (FAB on mobile-style layout) | Compose modal opens | `selector_drift` |
| 3 | Fill body | Type into compose textarea | Body text matches | `selector_drift` |
| 4 | (Optional) Attach media + alt-text | Upload → alt-text input → fill | Media preview + alt-text saved | `selector_drift` |
| 5 | **STOP before Post.** Leave compose modal OPEN. | (no action) | Modal still open with body filled | `unknown` if accidentally closed |
| 6 | Capture state | Manifest notes "compose modal filled; operator hits Post manually" | State captured | `unknown` |

## Selector Notes

Bluesky web client is React-based with stable selectors (smaller team, slower UI churn). Verified 2026-05-19.

## Special Constraints

- **No native drafts feature.** Bluesky doesn't save unposted compose-box state. Flow fills the box → stops → operator finishes Post action. If operator closes the modal without Post, content is lost.
- **Operator confirmation BEFORE flow runs is critical** — once the flow runs and stops mid-compose, the operator has limited time before the modal closes or session times out. The single-confirm gate (Critical Gate 7) ensures this is intentional.
- **Char cap 300.** Tight; flow trusts D16 char validation.
- **Alt-text required for accessibility.** If media + no alt-text, abort with `failed:unknown` (reason: alt_text_missing).
- **No native thread-chain.** Reply-to-self chains exist but are out of v1 scope.

## Why No Draft on Bluesky

Other platforms (LinkedIn, IG, FB) have drafts as a first-class feature. Bluesky doesn't. v1 alternatives considered:

1. **Use AT Protocol to create a draft post via API.** Cleaner long-term but adds AT Protocol auth scope (JWT + DID), out of v1 session-cookie pattern.
2. **Just emit export-mode for Bluesky (Markdown draft).** Operator opens Bluesky → composes from scratch using the Markdown reference.
3. **Fill compose box and stop.** Saves operator the typing step; operator still hits Post.

v1 chose option 3 as the closest to the "draft" semantic that other platforms provide. D17.next or D18 may switch to AT Protocol API for cleaner draft semantics.

## Anti-Patterns

- **No accidental Post.** Flow MUST NOT click the Post button. Critical Gate 7 + critic dim 7 enforce.
- **No long-running modal.** If automation completes step 5 but operator doesn't return within 5 minutes, the modal may auto-close; v1 doesn't prevent this.

## Draft URL Pattern

N/A. Compose modal lives at `https://bsky.app/` (no per-draft URL). Manifest tells operator: "Your Bluesky compose modal is open with the post filled. Click Post to publish."

## Publish Variant (D18)

> `--mode=publish` runs steps 1–4 above unchanged, then **clicks Post** — the step the draft "flow" deliberately stops short of. Reached only after the orchestrator's two-stage confirmation gate returns `confirmed`.

| Step | Action | Selector | Success indicator | Failure → reason-class |
|---|---|---|---|---|
| 5′ (replaces draft step 5 "STOP before Post") | Click **"Post"** | the compose modal's primary "Post" button | Compose modal closes; post appears in feed | `selector_drift` |
| 6′ | Capture live post URL | Open the new post from the user's profile; read URL | `post_url` captured | `unknown` |

**post_url pattern:** `https://bsky.app/profile/<handle>/post/<rkey>`

**On Send failure:** body is composed but unsent → because Bluesky has no native drafts, there is no draft-Save fallback action; the failure goes straight to `fallback-export` (operator composes from `platforms/bluesky.md`). No Send retry. Captcha at any point → `fallback-export`.

**Publish-specific note:** publish is the *natural* action for Bluesky — the draft flow's "fill and STOP" is the awkward case, not this one. D18 publish mode resolves Bluesky cleanly: the flow composes and Posts in one pass, no half-finished modal left for the operator. Alt-text-required-for-media still holds (`failed:unknown`, reason `alt_text_missing`, if media has no alt-text).

## Confidence Notes

v1 confidence: MEDIUM-HIGH. Selectors stable; bot-detection minimal. Main risk: operator forgets to return to the modal in time.

## What Goes Wrong (operator-facing)

- **Modal auto-closes:** if operator delays returning, content lost — operator pastes from `platforms/bluesky.md` to re-fill.
- **Session expired:** uncommon but possible — abort with `login_challenge`.
- **Selector drift:** Bluesky is small but UI does evolve; quarterly check expected.
