<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: showhn
schema_version: 2
pack_type: launch-channel
last_verified: 2026-06-19
verifier: claude
status: draft
source_basis: "Per-claim categorical citations inline (HN guidelines + the official Show HN rules page news.ycombinator.com/showhn.html + maker-cohort consensus). HN does not publish its ranking formula; the front-page algorithm is upvotes/time with a gravity decay + flag/penalty weighting — ranking claims tagged secondary (cohort) unless HN-stated."
summary: "Show HN launch playbook: a factual 'Show HN:' title linking to something people can actually try, a first comment that says what it is + why you built it + invites feedback, and graciously answering every reply in the first hours — early upvote velocity with no vote-ask and no marketing-speak is what reaches the front page."
---

# Platform Intelligence — Hacker News / Show HN (launch channel)

Practitioner-grade reference for **launching on Hacker News via a Show HN post** — consumed by
`plan-campaign`, `write-launch`, `publish-social`, and the launch chains to ground the title, the
first comment, the front-page ranking signals, format compliance, and the anti-patterns that get a
post flagged, penalized, or killed. **Not generic "post on HN" advice.** Every claim is an operating
lever.

Show HN is a **launch-channel pack**, not a content-feed pack: the unit of work is a *launch post*
that lives or dies in its first hours. A Show HN starts on the `/newest` page and only reaches the
front page if it earns early upvote velocity faster than gravity decays it — so this pack is
dominated by its **Playbook (§5)** and **Timing (§6)**, with hooks reframed as the **title + first
comment** (§1).

Two things every consuming skill must respect:

1. **HN is allergic to marketing.** The audience is technical and skeptical; superlatives,
   hype, and press-release voice get a post flagged and tank it. The title is factual and literal —
   what the thing is, not why it's amazing (§4 hard guard).
2. **You cannot ask for upvotes — and you cannot ring votes.** Soliciting upvotes (anywhere) and
   coordinated/IP-clustered voting are detected and nullified; the account and post are penalized.
   The whole playbook *earns* velocity by being genuinely interesting and answerable (§4 hard guard).

When this doc's `last_verified` exceeds 90 days, `validate-packs.ts` warns and the consuming critic
flags `DONE_WITH_CONCERNS` — HN periodically retunes flagging/penalty behavior; re-verify before a
real launch.

---

## 0. When NOT to Launch Here

> **Channel-fit veto.** `plan-campaign` reads this section as a real *"don't launch here."* When the
> campaign's product, ICP, goal, or growth motion matches a condition below, the channel is **vetoed**
> (skipped, with the cited reason) unless the operator records an explicit override. This is the
> marketer who says *no* — better an honest "wrong channel" than a flagged-off post.

- **It's not something people can try** — a landing page, waitlist, or "request a demo" gets flagged off; HN wants a usable thing.
- **Non-technical product or audience** — HN is developers; a consumer-lifestyle or non-technical-B2B product gets little signal and harsh comments.
- **You can't withstand blunt technical criticism** or won't be present to answer hard questions for hours.
- **Pure promotion** with no genuine "here's the interesting thing I made" — HN punishes marketing-speak.
- **Closed product with no inspectable demo** before a skeptical-of-claims audience — the value isn't verifiable, so it won't earn votes.

---

## 1. Launch Angles (Hook Taxonomy, reframed for Show HN)

On a feed platform a hook stops the scroll; on Show HN the **angle** is the framing of the title +
the first comment that earns the click into your thing and the upvote from a skeptical technical
reader. Minimum 3 HN-native angles. These overlap the six base archetypes
(`../hook-archetypes.md`) only in surface — HN punishes the clickbait shapes that work elsewhere.

### Angle 1 — The literal "Show HN:" title (what it is, for whom, in plain words)

- **Definition:** The title is `Show HN: [the thing] — [plain description of what it does]`, ≤80
  chars, no adjectives of praise, no metaphor. An HN reader decides in <2s whether it's worth a click.
- **Identifying signal:** Title parses as a factual noun phrase; states the category/job; contains no
  superlative ("fast", "simple", "open-source" are factual descriptors and fine; "revolutionary",
  "best", "amazing" are not); links directly to a usable thing, not a waitlist.
- **Pattern examples A:** "Show HN: A CLI that turns a git repo into a dependency graph" — literal,
  states exactly what it is. [pattern-derived from front-page Show HNs]
- **Pattern examples B:** "Show HN: I built a self-hosted read-later app (open source)" — first-person,
  factual, the one differentiator in parentheses. [pattern-derived]
- **Engagement-signal rationale:** HN's front page is a dense list of literal titles; comprehension
  speed drives the click that precedes the upvote, and a hype word invites a flag instead of a click.
- **Best for:** dev tools, infra, anything technical in a known category. Default angle.

### Angle 2 — The "why I built this" first comment (the author's note)

- **Definition:** The *first comment* (posted by you, immediately) carries the context the title
  can't: what it is, the itch you scratched, the interesting technical decision, and an explicit
  feedback ask. It is the HN analogue of the PH pinned maker comment.
- **Identifying signal:** First comment is 80–200 words, first-person, names a real motivation, posted
  within ~1 min of submitting, ends in a genuine question ("curious what people use for X today") —
  never "upvote us."
- **Pattern examples A:** "I kept losing an afternoon a week to [X], so I built this over a few
  weekends. The interesting part was [technical detail]. It's rough around [Y] — would love to hear
  how others handle [Z]." [pattern-derived; the dominant front-page author-comment shape]
- **Pattern examples B:** A "here's the architecture + what I'd do differently" comment that invites
  the technical debate HN loves. [pattern-derived]
- **Engagement-signal rationale:** Comments are a first-class signal and a magnet; a substantive
  author note invites *replies*, and an author who answers every reply compounds thread velocity in
  the decisive early hours.
- **Best for:** founder/indie brand_mode, projects with a genuine technical story. **Highest-leverage angle.**

### Angle 3 — The "try it without signing up" demo (the thing is the pitch)

- **Definition:** The link goes straight to something the reader can use *right now* — a live demo, a
  playground, a repo with a one-line run, a binary — with no signup wall, no "request access".
- **Identifying signal:** The destination lets an HN reader experience the core action in under a
  minute; if it's a repo, the README's first screen shows how to run it; no email-gate before value.
- **Pattern examples A:** A hosted playground URL where you can paste input and see output immediately.
  [pattern-derived; gate-free Show HNs out-convert waitlist ones]
- **Pattern examples B:** "Show HN: [tool] (GitHub)" linking a repo with a copy-paste quickstart at
  the top. [pattern-derived]
- **Engagement-signal rationale:** HN readers reward things they can poke at; a signup wall kills the
  try-rate, and "I couldn't even try it" is a top-voted critical comment that buries a launch.
- **Best for:** anything demoable in a browser or a single command; open-source projects.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Prefer numeric.

| Constraint | Value | reference |
|---|---|---|
| Title prefix | **must start `Show HN:`** | HN Show HN rules |
| Title length | ≤80 chars practical (HN truncates long titles in the list) | HN |
| Title voice | factual; **no superlatives / no editorializing / no `!`** | HN guidelines |
| URL | links to the **thing people can try** (demo/repo/app), not a blog post about it | HN Show HN rules |
| Text vs link post | link post (URL) is standard; if no URL, a text post with the link in the body | HN |
| First comment | author's note, posted immediately; 80–200 words | maker cohort |
| One submission | one Show HN per project; a second-chance repost is allowed if it got no attention (don't spam) | HN Show HN rules |
| Account | a real, non-throwaway account; new/green accounts' votes are weighted down | HN (anti-gaming) |
| "Show HN" eligibility | must be something you made that **others can play with** — not a teaser, signup page, or fundraiser | HN Show HN rules |

The constraints that bite: the **`Show HN:` prefix + a literal title** (the list and the rules both
enforce it) and **a link people can actually try** (a teaser/waitlist is the most common reason a
Show HN is flagged off).

---

## 3. Ranking Signals (Ranked by Impact)

HN does **not** publish its formula; the front-page rank is broadly `(upvotes − 1) / (age + 2)^gravity`
with flag/penalty and anti-gaming adjustments. Weights below are maker-cohort consensus (secondary)
unless marked HN-stated.

1. **Early upvote velocity off `/newest`** — upvotes in the first ~1–2 hours, against time decay,
   are what lift a post from `/newest` to the front page. *Why:* gravity decays score fast; you need
   genuine early momentum. *Lever:* submit at a high-traffic window (§6) so real readers see it on
   `/newest`; make the title + try-rate earn the vote. **Never** solicit or ring votes. *Tier:* secondary (cohort).
2. **Comment count + author engagement** — a live thread with the author answering signals a real
   launch and keeps the post ranked. *Lever:* seed the author note (Angle 2), then answer every reply
   substantively. *Tier:* secondary / HN-stated that discussion matters.
3. **Flags + penalties (negative)** — flags from users (for hype, dupes, off-topic) and software
   penalties (for too-promotional titles, voting rings) directly suppress or kill a post. *Lever:*
   factual title, real thing, no vote-ask — avoid every flag trigger (§4). *Tier:* primary (HN-stated penalties exist).
4. **Vote quality / account age** — votes from new, zero-karma, or clustered accounts are discounted
   or nullified by anti-gaming. *Lever:* reach real HN users; never a vote ring. *Tier:* secondary.
5. **Dupe detection** — a URL submitted recently can be auto-merged/deprioritized. *Lever:* don't
   re-submit the same URL repeatedly; use the sanctioned single second-chance only. *Tier:* primary (HN-stated).

Cap interpretation at these ~5. Upvote *count* alone is not the signal — **velocity − penalties**, weighted by vote quality, is.

---

## 4. Anti-Patterns

The first two rows are **hard guards**: publish-blocking. A consuming emitter (`write-launch`) must
fail the bundle if the title or any copy breaches them.

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **Asking for upvotes / vote ringing** ("upvote", "give us an upvote", coordinating votes) | Votes nullified; post + account penalized | Any copy (title, first comment, notify, cross-post) containing an upvote/vote ask; coordinated/IP-clustered voting | HN guidelines (primary) |
| **Hype / marketing-speak title** (superlatives, "revolutionary/best/amazing", `!`, editorializing) | User flags + software penalty → buried | Title contains a praise adjective, a bang, or editorial framing rather than a literal description | HN guidelines (primary) |
| **Not actually trying-able** (teaser, waitlist, signup wall, "request access") | Flagged as not a real Show HN; top comment "couldn't try it" | Destination gates the core action behind signup or is a blog post, not the thing | HN Show HN rules |
| **Post-and-ghost** (no author note, no replies) | Thread dies; reads as a drive-by | Author has not posted the note + replied within the first ~30 min | maker cohort |
| **Repost spamming** (resubmitting for votes) | Dupe penalty; moderator notice | Same URL submitted multiple times beyond the one sanctioned second chance | HN Show HN rules |
| **Arguing with critics** (defensive replies) | Thread sours; downvotes | Replies that rebut feedback instead of engaging it | maker cohort |
| **Astroturfing** (sockpuppets praising your own post) | Account ban (against HN rules) | Coordinated comments/votes from related accounts | HN guidelines (primary) |

"Don't be spammy" is not an anti-pattern. "Any title containing a superlative or a `!`, or any copy
containing the string 'upvote', fails the check" is.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** a literal `Show HN:` title on something people can try without signing
up, an immediate author note that says what it is + why you built it + asks a real question, and you
answering every reply for the first hours — this earns the early `/newest`→front-page velocity with
zero vote-ask and zero hype, which is the only thing that works on HN.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Make it try-able | T−7d → T−1d | Remove the signup wall from the core action; if a repo, put a copy-paste quickstart at the top of the README; host a demo if you can. | A stranger can experience the core action in <1 min, no email |
| 2 | Write the literal title | T−1d | `Show HN: [thing] — [what it does]`, ≤80 chars, no superlatives, no `!`. Read it as a skeptic. | Title states what it is; a skeptic can't call it hype |
| 3 | Draft the author note | T−1d | 80–200-word first comment: what it is, the itch, the interesting technical bit, a genuine feedback question. Zero vote-ask. | Reads as a person; ends in a real question |
| 4 | Pick the window | T−1d | Choose a weekday high-traffic US-morning slot (§6) so real readers see it on `/newest`. | Slot chosen in the active window, not a dead hour |
| 5 | Submit | T−0 | Submit the link with the `Show HN:` title. Do not touch votes. | Live on `/newest` |
| 6 | Post the author note | T+0:01 | Add the first comment within ~1 minute of submitting. | Author note visible at the top of the thread |
| 7 | Be present, answer everything | T+0 → T+4h | Reply to every comment within minutes; engage criticism graciously; thank, never beg. | 100% reply rate in the first hours; no defensive threads |
| 8 | Notify genuinely (no vote-ask) | T+0 → T+2h | Tell your own audience "I posted this on HN, feedback welcome" with the thread link — **never** "go upvote". | Genuine eyes on the thread without a single vote-ask |
| 9 | Cross-post as news | T+0 → all-day | Share to X/LinkedIn as "I shipped [thing], it's on HN today" linking the thing or the thread — framed as news, not a vote drive. | Reach beyond HN without a vote-ask |
| 10 | Close + measure | T+24h | Capture rank, points, comments, referral traffic, signups/stars; write the result into `measure-results` → feeds the pack. | Dated what-worked/what-failed entry; signup/star delta recorded |

This sequence is what the Show HN launch **chain** executes step-by-step, and what `write-launch` /
`publish-social` narrate ("running the Show HN literal-title + author-note playbook").

---

## 6. Timing & Cadence

- **Best post window:** weekday mornings **US Pacific–Eastern (~7–10am ET)** put a Show HN on
  `/newest` as the largest, most vote-active audience comes online — the early window that decides the
  front page. Convert from your local zone before submitting.
- **Decision window:** the first **~1–2 hours** decide whether the post escapes `/newest`; gravity
  decays score quickly, so a slow start rarely recovers. The rest of the day is for answering, not catching up.
- **Day-of-week:** Tue–Thu are highest-traffic and highest-competition. A weekend post sees less
  traffic but a thinner `/newest` — a deliberate trade for an easier climb, not a default.
- **Cadence:** a Show HN is a **one-shot** per project (one sanctioned second-chance repost if it got
  no attention). The compounding play is across *different projects / major versions* fed by the
  metrics loop — not resubmitting the same URL.

---

## 7. CTA / Conversion Norms

The HN CTA is **never** a vote-ask. Conversion = click-in → try the thing → upvote/comment → star/signup.

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| Author's first comment (feedback ask) | Posted immediately, story-led, ends in a real question → drives replies | Reads as a pitch or a vote-beg | maker cohort |
| The thing itself (try without signup) | The core action is the conversion; great projects convert on use | Gated behind signup → "couldn't try it" top comment | HN Show HN rules |
| Notify your audience ("I posted this on HN") | Frames as news, invites a genuine look | Contains "upvote/vote" → guideline violation + penalty | HN guidelines |
| Cross-post to X/LinkedIn ("shipped, it's on HN") | "I shipped [thing]" as news; links the thing or thread | Disguised vote drive ("go upvote it") | HN guidelines |
| Repo README quickstart | Converts the click into a run/star | Buried below marketing copy | maker cohort |

---

## 8. Open Questions / Known Unknowns

- HN's exact front-page formula, flag thresholds, and penalty weights are **not published** — the
  gravity-decay model and the velocity claims here are practitioner heuristics, not a cited formula.
- The precise software-penalty trigger for a "too promotional" title is opaque; "stay literal" is the
  safe heuristic, not a published rule.
- How much a green/low-karma account's submission is throttled on `/newest` is unclear; "use a real
  account with some history" is cohort advice.
- Whether the second-chance / `/pool` mechanism re-surfaces a given post is moderator-discretionary
  and not guaranteed.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-19 | Initial Show HN pack to the v2 launch-channel contract (S3.2). Draft — awaiting operator review + a live re-verify of HN flag/penalty behavior before `status: reviewed`. | claude |
