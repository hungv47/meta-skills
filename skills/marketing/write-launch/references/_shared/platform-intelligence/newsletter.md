<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: newsletter
schema_version: 2
pack_type: launch-channel
last_verified: 2026-06-20
verifier: hungv47
status: draft
source_basis: "Email-deliverability standards (SPF/DKIM/DMARC, sender reputation), ESP documentation (Mailchimp/ConvertKit/Beehiiv guidance), and CAN-SPAM/GDPR consent rules, synthesized with practitioner own-list + sponsored-placement launch structure. Per-claim categorical tiers inline; convention-level tactics tagged [pattern-derived]. URL-level ledger not maintained — promote on re-verify."
summary: "Newsletter launch playbook: warm the sending domain + authenticate (SPF/DKIM/DMARC), lead the first send plaintext-style to your most-engaged segment with ONE CTA — deliverability is the channel, not the copy."
---

# Platform Intelligence — Newsletter

> **Pack contract v2.** Authoring source for a *playbook pack* consuming skills load + narrate
> (`write-launch`, `write-social`, `plan-campaign`, the launch chains). Skills cite this pack + its
> `last_verified` date, never hard-code the tactics. Validate: `bun skills/bin/validate-packs.ts --strict`.

Practitioner-grade reference for the **newsletter** channel — both **own-list sends** (you own the
audience) and **sponsored placements** (you rent someone else's). The channel's hard truth: **email is
won or lost on deliverability, not copy** — the best subject line can't save a send that lands in spam.

---

## 0. When NOT to Launch Here  *(channel-fit veto)*

The channel-fit veto `plan-campaign` reads as a real **no**. When the campaign matches a condition, the
newsletter channel is skipped with the cited reason unless the operator records an override.

- **No existing list AND no budget for a sponsored placement** — newsletter is a *retention/owned*
  channel; it cannot manufacture a cold audience. With neither a list nor placement budget, the right
  first move is audience-building (organic/social/SEO), not a send. **Wrong channel.**
- **A cold, unconsented list (bought / scraped)** — sending to non-opted-in addresses tanks sender
  reputation, triggers spam complaints, and violates CAN-SPAM/GDPR. **Never; legally and technically a bad fit.**
- **A brand-new sending domain with no warm-up runway** — a never-used domain blasting thousands on day
  one is the textbook spam signal; if the launch can't wait ~2–4 weeks to warm, use a different channel
  or an established sub-brand domain. [pattern-derived]
- **A purely visual / impulse-buy launch** — if the offer needs rich motion or live urgency (a flash
  drop), email's plaintext-first deliverability constraints fight the creative; social/paid fits better.
- **One-off announcement with no follow-up intent** — newsletter compounds with cadence; a single
  fire-and-forget blast under-uses the channel and risks the reputation hit for little return.

---

## 1. Launch Angles & Hook Taxonomy

Minimum 3 *launch angles* (the newsletter equivalent of video hooks — how the send earns the open + the
click). Each: definition · identifying signal · why it fits inbox behavior · best for.

### Angle 1 — Own-send announcement (list → launch)
- **Definition:** a direct send to your owned list announcing the launch.
- **Identifying signal:** subject names the outcome or the news, not the product ("Your invoices, paid 2× faster" not "Introducing Acme 2.0").
- **Why it fits:** owned-list opens are driven by sender familiarity + subject relevance; a benefit-led subject beats a brand-led one because the inbox preview is the whole ad. [pattern-derived]
- **Best for:** you have an engaged list (≥ a few hundred opens); warm audience.

### Angle 2 — Founder-story / behind-the-build
- **Definition:** a personal, plaintext-style note from the founder on *why* the thing exists.
- **Identifying signal:** first-person, single-column, few/no images, one link; reads like a 1:1 email.
- **Why it fits:** plaintext-style sends from a person clear spam filters more easily (low image/link ratio) AND get higher reply rates, which *improves* sender reputation (engagement is a ranking signal). [pattern-derived]
- **Best for:** founder-led brands, early lists, high-trust B2B.

### Angle 3 — Sponsored placement (rent the audience)
- **Definition:** a paid ad slot inside another newsletter your ICP already reads.
- **Identifying signal:** a native-feeling blurb (matches the host's voice) + one tracked link, not a banner.
- **Why it fits:** you inherit the host's deliverability + trust; the native blurb out-converts a display banner because it rides the host's editorial credibility.
- **Best for:** no list yet, or scaling beyond your own; pick hosts by audience overlap, not raw size.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Numeric over prose.

| Constraint | Value | Reference |
|---|---|---|
| Subject line length | ~30–50 chars (front-load; mobile truncates ~33–41) | ESP guidance (secondary) |
| Preview/preheader text | ~40–100 chars; never leave it blank (clients pull body text) | ESP docs (primary) |
| Plaintext fallback | **required** — every HTML send needs a multipart text alternative | RFC/ESP (primary) |
| Image-to-text ratio | text-dominant; avoid image-only sends (spam signal) | deliverability standard (secondary) |
| Links in first send | few (1 primary CTA; ≤~3 total); link-heavy first sends look like spam | [pattern-derived] |
| List-unsubscribe | one-click unsubscribe header **required** (Gmail/Yahoo bulk-sender rules) | Gmail sender rules (primary) |
| Authentication | SPF + DKIM + DMARC must pass; required for bulk senders | Gmail/Yahoo 2024 rules (primary) |
| Send size ramp (new domain) | warm-up: start ~tens/day to engaged users, double every few days | [pattern-derived] |
| Spam-complaint rate | keep < ~0.1% (Gmail threshold); > 0.3% throttles delivery | Gmail sender rules (primary) |

---

## 3. Deliverability & Algorithm Signals (Ranked by Impact)

Mailbox providers rank inbox-vs-spam on these — strongest first. This is the channel's real "algorithm."

1. **Authentication (SPF / DKIM / DMARC)** — pass/fail per send. *Why:* bulk senders to Gmail/Yahoo are rejected or spam-foldered without all three (2024 rules). *Lever:* set DNS records before the first send; verify with a mail-tester. *Tier:* primary (platform-stated).
2. **Sender reputation (domain + IP)** — a rolling score from engagement + complaints + spam-trap hits. *Why:* a poor reputation spam-folders even authenticated mail. *Lever:* warm the domain, send to engaged users first, prune hard bounces. *Tier:* primary.
3. **Recipient engagement (opens / clicks / replies)** — provider reads these as "wanted mail." *Why:* high engagement lifts inbox placement; low engagement decays it. *Lever:* send to your most-engaged segment first on a launch; sunset dormant addresses. *Tier:* secondary (provider-confirmed direction, exact weights unpublished).
4. **Spam-complaint rate** — % marking "spam." *Why:* > ~0.3% throttles; > 0.1% is a warning. *Lever:* only consented lists, obvious unsubscribe, set frequency expectations. *Tier:* primary.
5. **Hard-bounce / spam-trap rate** — invalid or trap addresses. *Why:* trap hits signal a bought/old list and crater reputation. *Lever:* never buy lists; re-verify before a big send. *Tier:* primary.
6. **List-unsubscribe header + low friction** — one-click present. *Why:* required by bulk-sender rules; a missing/hard unsubscribe drives spam-marks instead. *Tier:* primary.

---

## 4. Anti-Patterns

Each: pattern · penalty · detection rule (a critic can apply) · source tier.

- **Buying / scraping a list** — *Penalty:* spam-trap hits + complaints crater domain reputation; legal exposure (CAN-SPAM/GDPR). *Detection:* the list has no documented opt-in source, or was acquired as a file. *Tier:* primary.
- **No plaintext fallback / image-only send** — *Penalty:* spam-foldered; unreadable with images off. *Detection:* the send has no multipart text alternative, or text length ≈ 0 with ≥1 image. *Tier:* primary.
- **Link-heavy / link-shortener first send on a cold domain** — *Penalty:* spam classifier flags it; reputation hit. *Detection:* > ~3 links, or a public URL-shortener, in a first/early send. *Tier:* [pattern-derived].
- **No domain warm-up before a large blast** — *Penalty:* the volume spike from a never-used domain reads as spam; mass spam-foldering. *Detection:* first-ever send size ≫ tens, no ramp schedule. *Tier:* [pattern-derived].
- **Missing one-click unsubscribe** — *Penalty:* bulk-sender-rule violation → throttle; recipients hit "spam" instead. *Detection:* no `List-Unsubscribe` header. *Tier:* primary.
- **Misleading subject / `RE:`/`FWD:` fakery** — *Penalty:* complaint spike + CAN-SPAM violation. *Detection:* subject implies a reply/forward that didn't happen, or doesn't match the body. *Tier:* primary.

"Write a great subject line" is a fortune cookie — every row above is a detection rule a critic runs before the send.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic: warm the domain + authenticate, then send the first launch email plaintext-style to your MOST-ENGAGED segment with ONE CTA — deliverability + engagement on the first send set the reputation that carries every later send.**

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Authenticate the domain | T-14d | Set SPF, DKIM, DMARC DNS records; verify with a mail-tester | all three pass; mail-tester ≥ ~9/10 |
| 2 | Warm the sending domain | T-14d→T-2d | Send small volumes to your most-engaged users, ramping daily | no reputation flags; opens normal |
| 3 | Segment the list | T-3d | Build the "most-engaged" segment (opened/clicked recently); suppress dormant + unverified | a clean engaged segment isolated |
| 4 | Draft plaintext-first | T-2d | Founder-note style: one column, ≤3 links, ONE primary CTA, preheader filled | passes spam-tester; renders images-off |
| 5 | Seed-test deliverability | T-1d | Send to a seed inbox set (Gmail/Outlook/Yahoo); confirm inbox placement | lands in Primary/Inbox, not Promotions/Spam |
| 6 | Launch send — engaged segment first | T-0 | Send to the engaged segment; watch opens/complaints live | open rate ≥ baseline; complaints < 0.1% |
| 7 | Expand to the rest | T+1–2d | If reputation held, send to the broader list (still suppressing dormant) | no deliverability decay on the wider send |
| 8 | Sponsored placements (parallel) | T-7d→T+0 | Book ≥1 host newsletter with ICP overlap; native blurb + 1 tracked link | tracked clicks ≥ host's quoted CTR floor |

---

## 6. Timing & Cadence

- **Best send window:** weekday mornings in the recipient's timezone tend to peak for B2B; test against your own open-time data rather than trusting a global "best time." [pattern-derived]
- **Decision window:** an email's fate is mostly set in the first few hours (opens + early complaints drive reputation for the next send); there's no "leaderboard," but a bad first send poisons the next one.
- **Cadence:** newsletter compounds — a launch should sit inside a *sustained* rhythm (e.g., a predictable weekly/biweekly send), not a one-off. Set frequency expectations at signup; sudden frequency spikes drive unsubscribes + complaints.

---

## 7. CTA / Conversion Norms

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| One primary text link, mid-body | a focused launch send (single ask) | competing with 3+ other links → diluted clicks | [pattern-derived] |
| Repeated CTA (top + bottom) | longer founder-story sends | short notes (feels pushy) | [pattern-derived] |
| Button (HTML) | HTML-styled sends with images on | plaintext-first sends (a bare URL is safer for deliverability) | ESP guidance (secondary) |
| P.S. line | founder-note angle (the P.S. is among the most-read lines) | corporate/templated sends | [pattern-derived] |
| Sponsored-placement blurb link | one tracked link in a native blurb | a banner/display unit (lower CTR than native) | [pattern-derived] |

One ask per send. A launch email asking for a signup AND a share AND a reply converts none of them well.

---

## 8. Open Questions / Known Unknowns

- Exact mailbox-provider reputation weights (engagement vs complaints vs traps): not published; direction is provider-confirmed, magnitudes are practitioner estimates.
- Provider-specific warm-up ramps (Gmail vs Outlook vs Yahoo): documented in broad strokes only; the safe ramp here is conservative `[pattern-derived]`.
- "Best send time": genuinely list-specific — the global figures are weak priors; trust your own open-time cohort once you have one.
- Sponsored-placement CTR benchmarks: vary widely by niche + host; treat a host's quoted number as a claim to verify against a small first buy.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-20 | Initial draft — newsletter launch-channel pack (K4) | hungv47 |
