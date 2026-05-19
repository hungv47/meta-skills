---
title: VN-Tone — End-to-End Walkthrough (Route A, pop-marketing register)
lifecycle: canonical
status: stable
produced_by: vn-tone
load_class: EXAMPLE
---

# VN-Tone — End-to-End Walkthrough

**Load when:** an operator (human or agent) wants a complete trace of how a Vietnamese polish gets produced — Pre-Dispatch → Layer 1 diagnostic → user checkpoint → Layer 2 polisher → critic PASS → deliver.

This walkthrough covers Route A (operator slash-command). Route B (called by another skill) follows the same Layer 1 + Layer 2 mechanics but skips the user checkpoint and returns the polished text directly to the calling skill instead of writing a standalone artifact.

---

## Scenario

- **Input:** A SaaS onboarding email, machine-translated from English to Vietnamese, 4 sentences, ~75 words.
- **Operator invocation:** `/polish-vn --register pop-marketing` with paste of the original text.
- **Resolved dimensions after Pre-Dispatch:**
  - Target register: `pop-marketing` (from `--register` arg, priority 1)
  - Dialect: `neutral` (default)
  - Brand glossary: "Acme" preserved as brand name
  - Source language: `en` (informational only)

---

## Original (Input)

> "Quý khách thân mến! Chúng tôi rất hân hạnh chào đón quý khách đến với Acme — giải pháp toàn diện cho hành trình chuyển đổi số của quý khách. Trong những tuần tới, chúng tôi sẽ gửi cho quý khách một loạt các email để giúp quý khách tối ưu hóa trải nghiệm của mình. Hãy nhấp vào đây để bắt đầu!"

---

## Layer 1 — Diagnostic Output (abridged)

**Register gap:** Currently stiff corporate formal (`chúng tôi ↔ quý khách`, zero particles, cliché-stacked). Target is pop-marketing (`chúng mình ↔ bạn`, light particles, emotive). **Heavy rewrite needed.**

**Hard Tells found (10 instances across 6 rule types):**

- A2 (`quý khách` × 5) — wrong formality register for "you"
- E3 (`giải pháp toàn diện`, `hành trình chuyển đổi số`, `tối ưu hóa`) — dead corporate clichés stacked (3 instances, 1 paragraph → Absolute Prohibition #7)
- F1 (em dash) — typography intrusion
- D7 (`sẽ gửi`) — unnecessary future marker
- B1 (`Hãy nhấp` — bare imperative with no softener)
- D5 (`một loạt các` — redundant plural)

**Priority fixes:**

1. Replace `chúng tôi ↔ quý khách` with `chúng mình ↔ bạn` — fixes 5 violations in one pass.
2. Kill the cliché stack — rewrite Acme intro around what the product actually does.
3. Add softeners on the CTA.

---

## User Checkpoint (Route A only)

"Found 10 Hard Tell instances (6 rule types), 2 Soft Tells. Biggest issues: wrong pronoun pair (5×), corporate cliché stack, bare imperative CTA. Heavy rewrite recommended. Proceed?"

User confirms — no `user_directives` overrides.

---

## Layer 2 — Polisher Output

**Polished Text:**

> "Bạn ơi, chào mừng bạn đến với Acme nha! Chúng mình sẽ đồng hành cùng bạn để làm việc nhanh và gọn hơn. Mấy tuần tới bạn sẽ nhận được một chuỗi email nhỏ, chỉ bạn cách khai thác hết mọi thứ hay ho của Acme. Nhấn vào đây để bắt đầu liền!"

**Change Log (abridged):**

| Location (P-S ref) | Before | After | Rule |
|---|---|---|---|
| P1-S1 | "Quý khách thân mến!" | "Bạn ơi, ... nha!" | A2, particle add |
| P1-S2 | "Chúng tôi rất hân hạnh chào đón quý khách" | "chào mừng bạn" | A2, I2 (throat-clearing) |
| P1-S2 | "— giải pháp toàn diện cho hành trình chuyển đổi số của quý khách" | "Chúng mình sẽ đồng hành cùng bạn để làm việc nhanh và gọn hơn" | F1 (em dash), E3 (dead corporate cliché stack), I1 (noun stack → verb) |
| P1-S3 | "sẽ gửi cho quý khách một loạt các email" | "bạn sẽ nhận được một chuỗi email nhỏ" | D7 (future marker kept for genuine near-future), D5 (redundant plural), pronoun pair |
| P1-S3 | "giúp quý khách tối ưu hóa trải nghiệm của mình" | "chỉ bạn cách khai thác hết mọi thứ hay ho" | A2, E1/E4 (sinify → pop intensifier) |
| P1-S4 | "Hãy nhấp vào đây để bắt đầu!" | "Nhấn vào đây để bắt đầu liền!" | B1 (imperative softened via native verb + urgency adverb + `!`), native `nhấn` |

---

## Critic Output (3-pass + Meaning + Typography = 36-point rubric)

- **Pass 1 (Hard Tells):** All 10 instances cleared. **Score: 1** (binary gate passed).
- **Pass 2 (Register Consistency):** `chúng mình ↔ bạn` held across all 4 sentences. Particle density: `nha` = 1/4 sentences (25%) — at the target ceiling, within range. Note: `ơi` in `Bạn ơi` is a mid-sentence vocative, not a sentence-final particle, so does not count toward density. **Score: 10/10.**
- **Pass 3 (Read-aloud):** No stumbles. Rhythm varied (7/12/19/10 words). One experience anchor missing (`Dùng Acme là thấy ngay...` would add warmth) — minor. **Score: 9/10.**
- **Meaning preservation:** All claims intact (welcome, email series, CTA). **Score: 10/10.**
- **Typography:** em dash removed, sentence case, no smart quotes. **Score: 5/5.**

**Total: 35/36. PASS.**

---

## Final Artifact

```markdown
---
skill: polish-vn
version: 1
date: 2026-04-15
status: done
target_register: pop-marketing
subvariant: null
dialect: neutral
critic_score: 35
---

# VN Tone Polish: Acme Onboarding Email

## Polish Summary

| Metric | Value |
|---|---|
| Original words | 75 |
| Polished words | 59 |
| Hard Tells found | 10 |
| Hard Tells fixed | 10 |
| Soft Tells fixed | 2 |
| Pronoun pair | chúng mình ↔ bạn |
| Particle density | 25% (1/4 sentences — at target ceiling, within range) |
| Critic score | 35/36 |
| Cycles used | 1 |

## Change Log

[full change log table per format-conventions.md § "Change Log row format"]

## Polished Text

Bạn ơi, chào mừng bạn đến với Acme nha! Chúng mình sẽ đồng hành cùng bạn để làm việc nhanh và gọn hơn. Mấy tuần tới bạn sẽ nhận được một chuỗi email nhỏ, chỉ bạn cách khai thác hết mọi thứ hay ho của Acme. Nhấn vào đây để bắt đầu liền!

## Status

**DONE** — Register pair `chúng mình ↔ bạn` held across all 4 sentences. Particle density at 25% (target ceiling). All 10 Hard Tell instances (6 rule types) cleared. Meaning preserved. One minor experience anchor missing (could add `Dùng thử là thấy ngay...` for warmth) — flagged but not blocking.
```

---

## FAIL-handling variant (cycle 1 FAIL → cycle 2 PASS)

Same scenario, but cycle 1 critic returns FAIL on Pass 2:

- Pronoun drift detected: P1-S2 polished version uses `mình` (singular) while P1-S1 established `chúng mình` (brand plural). One drift = 6/10 on Pass 2.
- Other passes clean; total 30/36 but Pass 2 drift = critic FAIL per gate rule.

**Critic feedback:**

| Issue | Location | What to fix | Re-dispatch to |
|---|---|---|---|
| Pronoun pair drift `chúng mình` → `mình` | P1-S2 | Restore `chúng mình` consistently. The brand-voice pair established in S1 holds throughout. | polisher-agent |

Polisher re-dispatched (cycle 2). Returns with `chúng mình` consistent. Critic re-runs:

- Pass 2 re-evaluated: pair held throughout → 10/10. Total: 35/36. **PASS.**

If cycle 2 had ALSO failed → ship `DONE_WITH_CONCERNS` with the remaining failure(s) pinned in the Status block; critic_score reflects the cycle-2 total; Cycles used = 2 in Polish Summary.

---

## `--fast` variant

Same scenario, operator invokes `/polish-vn --register pop-marketing --fast`:

- Pre-Dispatch resolves register (Critical Gates supersede `--fast`)
- Layer 1 (diagnostic) SKIPPED — no violation log, no user checkpoint
- Polisher runs single-pass in-context (single-agent fallback per dispatch-mechanics.md), polishing by direct register-knowledge rather than off a diagnostic log
- Critic SKIPPED — no 36-point rubric, no rewrite loop, no PASS/FAIL gate
- Output: polished text + abbreviated Polish Summary (no Change Log, no critic_score) + Status `done_with_concerns` (marked because critic verification was skipped)
- Trailing line: `Ran in --fast mode; rerun without the flag for full diagnostic + critic verification.`

`--fast` is for "I trust the polish, just clean it up quickly" — not for shipping to production-grade content where the critic gate is load-bearing.
