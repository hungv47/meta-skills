# Frameworks: Personalization Signals

The 4-level system + signal catalogue. Adapted from coreyhaines/cold-email with additions from the framework services playbook.

## The 4-Level Personalization System

Personalization exists on a gradient. Higher levels require more work but drive exponentially better reply rates.

| Level | Source | Effort | Signal strength | Example |
|-------|--------|--------|-----------------|---------|
| **Level 1 — Firmographic** | Company data (industry, size, funding) | Low (mass-pull) | 1 | "Saw [Company] is in B2B SaaS." |
| **Level 2 — Role-based** | Job title, team composition | Low (mass-pull) | 2 | "As VP of Sales at a 200-person SaaS..." |
| **Level 3 — Event-triggered** | Recent event (funding, hiring, launch, public post from company) | Medium (trigger-tracking tools) | 3 | "Saw Acme closed Series B." |
| **Level 4 — Individual-authored** | Something the specific person said/wrote/did publicly | High (manual research per prospect) | 4-5 | "Your LinkedIn post about attribution — the 'activity not outcomes' line." |

**The rule:** Level 3 or higher is required for a viable cold email in 2026. Level 1-2 alone = spam pattern-match from the reader.

## Signal Catalogue by Level

### Level 4-5 (Individual-Authored)

The gold standard. These signals tie your outreach to THIS person specifically.

| Signal | Where to find | Example use |
|--------|---------------|-------------|
| Recent LinkedIn post | LinkedIn profile, activity tab | Reference the specific point, quote if possible |
| Twitter/X thread | Twitter profile, last 30 days | Reply publicly or reference in DM/email |
| Podcast appearance | Podcast directories, Google | "Your point on [guest show] about [X] landed" |
| Conference talk | YouTube, event pages | "Your talk at [event] on [specific slide/point]" |
| Written blog / newsletter | Their substack/blog | "Your post on [specific topic] — the framing on [X]" |
| GitHub commits (for dev personas) | GitHub profile | "Saw your PR to [repo] doing [specific thing]" |
| Slack/Discord messages (if public) | Public community archives | "Your message in [community] about [X]" |
| Public code review comments | GitHub, GitLab | "Your comment on [PR] suggesting [X] — same thing bit us" |

**Key rule:** Must be within the last 30 days, ideally 14. Older signals read as "they scraped my profile and strung together whatever looked relevant."

### Level 3 (Event-Triggered)

The floor for viable outreach. Generic firmographic + event timing.

| Signal | Trigger tools | Example use |
|--------|---------------|-------------|
| Funding round | Crunchbase, PitchBook, manual news | "Saw the Series B — congrats. Usually at this stage..." |
| Hiring signal | LinkedIn jobs, company careers page, BuiltIn | "Noticed you're hiring a 3rd BDR — usually means..." |
| Product launch | Product Hunt, company blog, Twitter | "Saw the launch of [product] last week" |
| Tech-stack change | BuiltWith, Wappalyzer, job posts mentioning tools | "Saw you added [tool] to the stack" |
| Acquisition / M&A | News, company announcements | "Saw the [company] acquisition" |
| Executive hire/departure | LinkedIn, news | "Saw [name] just joined as [role]" |
| Customer case study published | Company blog, case study pages | "Saw the [customer] case study — the [specific claim]" |
| Opening a new market / region | Job posts, company announcements | "Saw you're hiring in [new region]" |

**Key rule:** Event should be within 30 days. The cost of waiting reduces trigger relevance.

### Level 2 (Role-Based)

**Not enough on its own.** Combine with Level 3 or 4. Useful for framing pain/context.

| Signal | Example |
|--------|---------|
| Title + company stage | "As VP Sales at a Series B SaaS, the [specific pain] usually starts at..." |
| Team composition inferred | "With 3 SDRs and no ops hire yet..." |
| Tenure in role | "Six months into the [role] — probably at the ' I see what's broken' phase" |

### Level 1 (Firmographic)

**Almost useless alone.** A signal of "we have your company data" — reader pattern-matches to spam.

Don't build messages on Level 1 alone. Use it only as context inside a higher-level signal.

## Signal Evaluation Rubric

Before using a signal, ask:

1. **Freshness:** Is it within 30 days?
2. **Specificity:** Does it reference a detail that's true ONLY of this person / company?
3. **Relevance:** Does it connect naturally to the problem you solve?
4. **Removal test:** If I cut the sentence that uses this signal, does the rest of the email still make sense? (If YES, the signal is decorative.)

A signal that passes 3 of 4 is usable. Passing 2 or fewer = too weak; switch to Q→V→A pain-first framing.

## High-Signal Research Patterns

### For B2B SaaS / Services targets

1. **LinkedIn activity tab first** (last 30 days of posts, comments, reactions)
2. **Twitter/X profile** (last 30 days)
3. **Their company's recent news** (press releases, case studies, announcements)
4. **Job posts on their careers page** (hiring signals reveal priorities)
5. **Podcast appearances** (Google: "[name] podcast" site:apple.com OR site:spotify.com)

### For indie hackers / solo founders

1. **Build-in-public tweets / threads**
2. **Indie Hackers profile and posts**
3. **Their product on Product Hunt** (recent launches, comments)
4. **Public roadmap / changelog**

### For technical personas (engineers, CTOs)

1. **GitHub profile** (recent commits, starred repos, PRs)
2. **Blog / personal site** (recent writing)
3. **Conference talks / YouTube** (recent speaking)
4. **Stack Overflow activity** (rare but high-signal)

## Signal Research Time Budget

Spend 5-10 minutes per prospect max for Level 4 research. If you can't find anything individual-authored in that time:

- Drop to Level 3 (event-triggered). If that exists, use it.
- If only Level 1-2 is available, either skip this prospect OR use Q→V→A pain-first framing without faking a signal.

**Mass-send with fake personalization is worse than mass-send without it.** Fake specificity reads as template-fill; absent specificity reads as batch. The latter is recoverable; the former destroys trust.

## Anti-Patterns

- **Fake specificity.** "Saw your recent success at [company]" when nothing specific was seen. Readers pattern-match instantly.
- **Stacking signals.** "I saw you're hiring AND you published a case study AND you got Series B funding..." — pick the strongest ONE.
- **Generic paraphrase of a specific post.** If they said "attribution is broken," don't paraphrase to "interested in attribution." Quote them or pick a different signal.
- **Signals older than 60 days.** Context is dead. Looks like scraped data strung together.
- **Signals that aren't real personalization.** "I noticed you are a Director of Marketing" — that's firmographic + role, not Level 3+. Don't frame it as specific.
- **Signals that don't connect to your ask.** "Saw you won a Best Place to Work award. Anyway, want to talk about our API?" — the signal and the ask are unrelated.
