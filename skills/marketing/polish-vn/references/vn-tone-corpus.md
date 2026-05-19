# Vietnamese Tone Corpus — Register Reference

> Annotated corpus of Vietnamese writing registers, compiled from live samples scraped from representative publications and forums. Used by `polish-vn` agents to diagnose input register, set target register, and rewrite translated text so it reads naturally.

**Core principle:** Vietnamese register is carried almost entirely by **pronouns, sentence-final particles, vocabulary choice (Sino-Vietnamese vs. native), and sentence rhythm**. A single wrong pronoun ruins the whole register. A missing particle makes the sentence sound translated-from-English.

**Scope:** Four primary registers + two subvariants. Each entry gives: when to use it, the pronoun system, particle inventory, vocabulary/slang markers, rhythm, typography, real annotated examples, and the typical translation artifacts a post-translation polish must fix.

---

## Register 1 — Báo chí (Professional News / Formal Editorial)

**When to use:** News articles, press releases, whitepapers, investor updates, legal/compliance copy, official announcements, government/enterprise communications, long-form journalism. The default for any content that needs to feel institutionally credible.

**Sources surveyed:** vnexpress.net, baochinhphu.vn, znews.vn (pattern-matched). Two sub-flavors below.

### 1a. VnExpress-style (news report)
Cleanest, most-translatable register. Third person, impersonal, precise time/place markers, neutral diction.

### 1b. Chinhphu.vn-style (government/formal doc)
Heavier Sino-Vietnamese load, longer nominal phrases, ritual openers ("đồng chí", "kính thưa"), decree-style noun stacking.

### Pronouns
- **Self:** none (no first-person). Where authorship is marked, use "tác giả", "phóng viên", "chúng tôi" (editorial plural) — never "mình" or "tôi".
- **Reader:** none (no direct address). Never "bạn", never "các bạn", never "anh em".
- **Third parties:** full name + title on first mention, then shortened form ("Tổng thống Trump" → "ông Trump"). Honorifics **ông / bà** are required for adults; skipping them sounds disrespectful.

### Sentence-final particles
**None.** Zero `ạ`, `nhé`, `nhỉ`, `nha`, `à`, `đấy`, `ấy`. Particles instantly downgrade the register to conversational.

### Vocabulary
- Heavy Sino-Vietnamese: `tăng cường`, `triển khai`, `thúc đẩy`, `khẩn trương`, `phối hợp`, `phê duyệt`, `đồng bộ`, `chỉ đạo`.
- Formal verbs of speech: `cho biết`, `tuyên bố`, `khẳng định`, `nhấn mạnh`, `nêu rõ`. Never `nói` alone in a news lede.
- Quantities precise: `hơn 75 m`, `14-17/4`, `ít nhất 25 người`, `kéo dài 32 giờ`.
- Attribution required: `theo các chuyên gia`, `theo Guardian`, `WSJ dẫn báo cáo`, `hãng giám sát hàng hải Lloyd's List ghi nhận`.

### Rhythm
Long sentences (20–40 words) with multiple clauses linked by `khi`, `sau khi`, `trong khi`, `nhằm`, `theo`. Ledes pack who-what-when-where into one sentence.

### Typography
- No emoji, no exclamation marks, no all-caps emphasis.
- **Scare quotes** `"..."` for loaded phrases or direct quoted fragments: `"đình trệ"`, `"hành vi cướp biển"`, `"bất hợp pháp"`.
- Em dashes are not typical — use comma or new sentence.

### Real examples (from live scrape)

> **VnExpress:** "Tổng Bí thư, Chủ tịch nước Tô Lâm và phu nhân sáng nay rời Hà Nội, lên đường thăm cấp nhà nước đến Trung Quốc ngày 14-17/4."
>
> *Notes:* Full title + name, precise time ("sáng nay"), precise date ("14-17/4"), single compound verb ("rời Hà Nội, lên đường thăm"). No first person, no particles.

> **VnExpress:** "Hãng giám sát hàng hải Lloyd's List ghi nhận lưu thông hàng hải qua eo biển Hormuz đã 'đình trệ' sau khi Tổng thống Trump ra lệnh phong tỏa."
>
> *Notes:* Attribution first ("Hãng... ghi nhận"), scare-quoted loaded phrase ("đình trệ"), temporal clause ("sau khi..."), full title on Trump.

> **VnExpress:** "Mỹ điều tàu chiến qua eo biển Hormuz để mở đường cho chiến dịch rà phá mìn, trong khi Iran dọa sẽ 'xử lý nghiêm' tàu quân sự ở đây."
>
> *Notes:* Compound sentence with contrast ("trong khi"), verb choice `điều` (formal: to deploy) not `gửi`, scare quote on threat.

> **Chinhphu.vn:** "Đại hội đại biểu toàn quốc lần thứ XIV của Đảng đặt ra yêu cầu nghị quyết không chỉ đúng, mà phải được thực hiện bằng hành động quyết liệt, hiệu quả thực chất, kiên quyết chống hình thức, không để xảy ra 'độ trễ' nghị quyết."
>
> *Notes:* Heavy nominal stacking ("hiệu quả thực chất", "kiên quyết chống hình thức"), parallel "không chỉ X, mà phải Y" construction (this is the **only** place this construction belongs in VN — it is a formal editorial device, not to be used in casual writing where it sounds pompous).

### Translation giveaways to fix
- **First person singular:** any `tôi` or `mình` in a news lede. Rewrite impersonally.
- **Direct reader address:** "bạn sẽ thấy rằng...", "hãy tưởng tượng..." — remove entirely; state the claim.
- **English sentence punctuation:** em dashes, bullet lists inside prose. Convert to clause chains.
- **Weak verbs:** `làm`, `có`, `nói`. Upgrade to `thực hiện`, `tồn tại`, `cho biết`.
- **Missing attribution:** unsourced claim. Add `theo...`.
- **Wrong title register:** "Trump nói..." without `ông`. Always `ông Trump nói...` on reintroduction.

---

## Register 2 — Semi-Casual ("Anh em" / tech community / reflective blogger)

**When to use:** Product blogs, developer docs for Vietnamese audiences, community posts, long-form essays, hobby content, tutorials, SaaS onboarding emails to engaged users. The "warm explainer" voice. This is the **default fallback** when the content is neither institutional nor slangy.

**Sources surveyed:** tinhte.vn (tech community), spiderum.com (essayist subvariant), otofun.net main forum (auto tech).

### 2a. Tinhte-style (tech community, "mình + anh em")
Bloggy, hands-on, English loanwords OK. Writer is `mình`, reader collective is `anh em`.

### 2b. Spiderum-style (essayist, "tôi" or "mình")
Reflective, first-person essay. Longer sentences, more literary vocabulary. Writer is `tôi` (formal-essayist) or `mình` (warm-essayist).

### Pronouns
- **Self:** `mình` (default semi-casual) or `tôi` (essayist, slightly more formal-literary). Never `em` here — that's deferential-bro register (Register 3).
- **Reader (singular):** `bạn` ("you", neutral-warm). Rarely `các bạn` for plural.
- **Reader (collective/community):** `anh em` ("fellow members", warm, masculine-default but inclusive in practice). Tinhte's signature.
- **Third parties:** dropped titles OK for foreign brands ("Apple vừa phát hành iOS 26.5..."), keep titles for Vietnamese officials.

### Sentence-final particles
Light use — the register's warmth comes from here.
- `nhé` — soft suggestion/reminder ("nhớ tận dụng các tính năng này nha")
- `nha` — Southern variant of `nhé`, friendlier
- `luôn` — emphatic "straightaway, right there" ("thấy đã lắm luôn")
- `đấy` / `ấy` — soft "you know"
- Rare `ạ` — only when addressing a senior figure deferentially

### Vocabulary
- Mixed Sino-Vietnamese + native, leans toward native when possible: `xài` not `sử dụng`, `dùng` not `vận dụng`.
- English loanwords allowed for tech/brand/culture terms: `DIY`, `gaming`, `camera`, `webcam`, `router`, `beta`.
- Colloquial intensifiers: `cực`, `siêu`, `đã lắm`, `ngon lành`, `thiệt sự`.
- Hobby/affection markers: `bộ môn`, `xài thử`, `trên tay` ("hands-on with...").

### Rhythm
Mixed. Opening sentences often declarative-personal ("Mình đang dùng X", "Hồi tôi còn..."). Body alternates short punchy sentences with longer explanatory ones. Paragraphs are scannable (2–4 sentences each).

### Typography
- Occasional exclamation marks when genuine ("đã lắm!").
- Emoji allowed but sparing — 0–2 per post, usually as visual labels not every sentence.
- Scare quotes less common than báo chí.

### Real examples

> **Tinhte:** "Mình đang dựng một cái toilet ngoài trời. Sếp thích làm bằng gỗ mà sợ bục chân. Và đây là giải..."
>
> *Notes:* `mình` self-reference, casual domestic framing ("Sếp thích" = wife's preference, winking masculine register), short declarative chain.

> **Tinhte:** "Chào anh em, tiếp nối bài viết khi nào cần vệ sinh máy lạnh thì nay mình lên thêm bài hướng dẫn anh em muốn tự làm luôn nhé."
>
> *Notes:* Ritual opener `Chào anh em`, continuity marker `tiếp nối`, self as `mình`, collective `anh em`, soft close `nhé`. This single sentence is the perfect Tinhte voice signature.

> **Tinhte:** "Nếu đang dùng Android thì bạn nhớ tận dụng các tính năng này nha"
>
> *Notes:* Conditional `Nếu... thì...`, direct address `bạn` (singular), soft imperative via `nhớ + nha`. Southern variant `nha`.

> **Tinhte:** "Mình đang dùng loại vít đuôi cá có cánh này, thiệt sự thấy đã lắm."
>
> *Notes:* Personal endorsement rhythm. `thiệt sự` = sincere intensifier, `đã lắm` = satisfying-colloquial. Impossible to back-translate into formal register.

> **Spiderum:** "tôi viết những dòng này chẳng phải để bêu rếu ai hay tiêu cực về chính mình. Tôi viết để thấu hiểu bản thân và kết..."
>
> *Notes:* `tôi` (essayist-literary, more distant than `mình`), `chẳng phải... hay...` (literary negation), reflective stance.

> **Spiderum:** "Hôm rồi, mình chợt đọc được một ý trên mạng: trưởng thành là khi mình học cách yêu thương bản thân..."
>
> *Notes:* `mình` here (warmer than `tôi`), temporal hook `Hôm rồi`, reflective connector `chợt`.

### Translation giveaways to fix
- **No self-pronoun when the English has "I/we":** add `mình` or `tôi`.
- **Wrong self-pronoun:** `em` (deferential) in a tech blog → wrong register. Use `mình`.
- **Reader address via `quý khách` / `quý vị`:** overly formal (that's corporate-speak, Register 4 brand voice at most). Use `bạn` or `anh em`.
- **Missing softeners:** English "Remember to X" becomes "Hãy nhớ X" (stiff). Prefer "Nhớ X nha" or "X nhé".
- **Literal "you can see that...":** `bạn có thể thấy rằng` sounds translated. Prefer `có thể thấy` (impersonal) or `anh em sẽ thấy` (collective).
- **Bare conjunctions without topic markers:** add `thì` after conditional `Nếu...` — "Nếu X, Y" → "Nếu X thì Y".

---

## Register 3 — Bro (Forum Casual)

**When to use:** Community forum posts, in-group messaging app copy, casual social content where the audience self-identifies as the in-group ("vozers", "otofuners", car enthusiasts, gamers, etc.), user-generated content tone, comedy/meme copy. **Rare for brand-authored content** — brands that try this register usually fail and sound cringe.

**Sources surveyed:** otofun.net/forums/quan-cafe-otofun (Hanoi, older male skew), voz.vn/f/chuyen-tro-linh-tinh (younger, more slang, IT-skewed).

### 3a. Otofun / "cụ-mợ" variant (Hanoi, older, deferential-bro)
The writer humbles themselves to `em`, the reader is elevated to `cụ` (male elder) or `mợ` (female). Deferential in form, intimate in function — like Southern US "sir/ma'am" in a friend group. Older, Northern, auto-club heritage.

### 3b. Voz / "ae-thím" variant (younger, irreverent, IT-skewed)
Writer is `mình` or `tôi`, reader is `ae` (anh em, abbreviated), `các bác`, or ironically `các thím` (literally "aunts" — used ironically for male users). Heavy abbreviation, English code-switch, crude humor tolerated.

### Pronouns

**Otofun subvariant:**
- **Self:** `em` (humble-bro; you are younger, the reader is elder). Occasionally `nhà cháu` for extra humility-joke.
- **Reader:** `cụ` (M) / `mợ` (F) / `các cụ` / `các cụ mợ` / `các bác`.
- Works as matched pair: `em` ↔ `cụ`. Mixing `mình` with `cụ` is off.

**Voz subvariant:**
- **Self:** `mình`, `tôi`, `em` (context-dependent; `em` is when asking elders)
- **Reader:** `ae` / `anh em` / `các bác` / `các thím` (ironic) / `fen` (slang for "fan/friend")
- Self-reference as `vozer` / `cozer` is in-group marker.

### Sentence-final particles
Heavy use.
- `ạ` — Otofun signature deferential-polite: `các cụ nhỉ ạ`, `em hỏi ngu ạ`.
- `nhỉ` — soliciting agreement: `các cụ nhỉ?`
- `nhé` / `nha` — soft
- `đấy` / `đó` — emphasis
- `á` / `á à` — surprise

### Vocabulary
- **Otofun-specific slang:** `buôn dưa lê` (gossip), `xả stress`, `lên xe` (log in), `Funland` (off-topic category), `em hỏi ngu`, `lão`, `các cụ`, `nhà cháu`.
- **Voz-specific slang:** `phắc boi`, `vozer`, `cozer`, `fen`, `thím`, `ngon`, `chất`, `IT trâu`, `thợ gõ mã nguồn`, `tâm sự`, `than thở`.
- **Shared:** `kinh nghiệm`, `tâm sự`, `vỡ nợ`, `lười`, `tung`, `xịt`.
- **Abbreviations:** `ko` (không), `ae` (anh em), `dc` (được), `vs` (với), `m` (mày/mình), `b` (bạn), `t` (tôi/tao).
- English code-switch is frequent and unapologetic: "rep", "reply", "drama", "fail", "chill".

### Rhythm
Question-heavy. Forums are mostly "em xin hỏi..." / "bác nào biết..." / "có ai từng..." openers. Sentence length varies wildly from single-phrase ("Chất!") to run-on rants.

### Typography
- Emoji tolerated, occasional.
- ALL CAPS for emphasis occurs but not mandatory.
- Scare quotes often around in-group terms or ironic phrases.
- Typos and dropped diacritics tolerated — sometimes deliberate for speed or comic effect.

### Real examples — Otofun subvariant

> "Các bác đang nhập hàng Trung Quốc cho em hỏi: dạo này đi chính ngạch có bị khó không?"
>
> *Notes:* `Các bác` (respectful-bro), `em hỏi` (humble self), colloquial `dạo này`, direct question. This is the canonical Otofun information-request opener.

> "Mấy cụ mợ cư dân HH, VP Linh Đàm đã nhận được phiếu thu thập thông tin chưa ạ?"
>
> *Notes:* `Mấy cụ mợ` (collective), specific local context ("HH, VP Linh Đàm" = Linh Đàm apartment complex), `chưa ạ?` final-particle combo is textbook.

> "Cụ nào thích tự sửa đồ sinh hoạt gia đình vào ủng hộ em"
>
> *Notes:* `Cụ nào... vào ủng hộ em` = "whichever of you elder-bros is into X, come support me" — a classic thread-invitation formula.

> "Quy trình mua bán xe máy cũ giờ thực hiện như thế nào các cụ nhỉ?"
>
> *Notes:* Terminal `các cụ nhỉ?` turns a statement into solicitation-of-opinion.

> "Em xin hỏi các cụ về camera 360 cho ô tô"
>
> *Notes:* Ritual opener `Em xin hỏi`. Every forum post follows this frame.

### Real examples — Voz subvariant

> "Xét nghiệm đống này gần 700k đắt không ae?"
>
> *Notes:* `ae` (anh em abbreviated), `đống này` (casual "this bunch"), omitted subject, direct-price-question register.

> "Có bác nào sự nghiệp học hành rực rỡ nhưng đi làm lại lận đận không?"
>
> *Notes:* `Có bác nào... không?` = "is there any bro who...?" — canonical poll-opener. `rực rỡ` / `lận đận` is literary-bro pairing.

> "Anh em ở Nhật vào tâm sự nhỉ 2.0"
>
> *Notes:* Long-running thread naming convention (`2.0` = sequel). `vào tâm sự nhỉ` = "come chat eh".

> "Vozer - cuộc sống nhàm chán của một thợ gõ mã nguồn lâu năm, IT, kỹ sư phần mềm, thợ code"
>
> *Notes:* `vozer` self-identification, `thợ gõ mã nguồn` is Voz in-joke for "code monkey" (literally "source-code typing worker"), multi-label listing is Voz thread-title style.

### Translation giveaways to fix
- **Wrong pronoun pair:** `tôi` + `bạn` in a bro-register post = instant formal vibe. Switch to `em + cụ` (Otofun) or `mình + ae` (Voz).
- **Missing `ạ` in question-requests:** "Cụ nào biết?" → "Cụ nào biết ạ?" in Otofun.
- **No abbreviation at all:** Voz register without any `ko`, `ae`, `dc` reads overly prim. Accept at least a few.
- **Too clean typography:** if input has zero diacritic slips and perfect punctuation, it reads robotic. Very mild relaxation is authentic.
- **Brand voice leaking:** never use `quý khách`, `quý vị`, `chúng tôi`. The narrator is a peer, not a company.
- **Clichés from corporate translation:** `giải pháp toàn diện`, `trải nghiệm đột phá` → forbidden. Use concrete verbs.

---

## Register 4 — Pop / Lifestyle / Brand Marketing

**When to use:** Consumer marketing copy, brand landing pages, social media posts for young/mass audiences, entertainment news, push notifications, viral content, e-commerce product descriptions, influencer-adjacent campaigns, any B2C content targeting <35yo.

**Sources surveyed:** kenh14.vn (young pop/entertainment/lifestyle), shopee/momo/tiki marketing voice (pattern-matched), beatvn-style viral. This register has the **loudest** dialectal variation — Northern pop writes differently from Southern pop — but the macro-features below are shared.

### Pronouns
- **Self (brand voice):** `chúng mình` (warm plural, Shopee/MoMo/Tiki signature), `chúng tôi` (slightly more corporate), sometimes no self-reference at all (headline-driven copy).
- **Self (viral/article writer):** `mình` or dropped.
- **Reader:** `bạn` (default, warm-neutral), `các bạn` (plural-warm), `bạn ơi` (call-out softener). Never `anh em` here — that's bro register. Never `quý khách` (overly formal).

### Sentence-final particles
- `nhé` / `nha` (Southern) — soft prompt/reassurance. Very common in marketing copy.
- `luôn` — urgency/emphasis: `Mua ngay luôn!`
- `á` — Southern cute-emphasis.
- `ơi` — vocative call-out: `Bạn ơi, sắp hết hàng rồi!`

### Vocabulary
- **Emotive intensifiers:** `cực kỳ`, `siêu`, `xịn`, `chất`, `đỉnh`, `đã đời`, `mê tít`, `cực mê`, `hot hit`, `đỉnh chóp`, `xịn xò`, `auto` (as adjective).
- **Viral/meme terms:** `kinh điển`, `huyền thoại`, `gây bão`, `viral`, `hot trend`, `mùa này`, `hack não`, `chữa lành`.
- **English loanwords normalized:** `deal`, `sale`, `freeship`, `review`, `check-in`, `pose`, `outfit`, `look`, `vibe`, `mood`, `style`, `gu`.
- **Listicle openers:** `Top 5`, `3 cách`, `5 lý do`, `9 siêu công trình`.
- **Clickbait devices:** scare quotes for viral terms, ellipsis-teasers, question headlines, colons for subtitle contrast.

### Rhythm
Short and punchy for headlines (one-line hooks). Body opens with emotive/curiosity-gap sentence, then fact. Sentence length stays under 25 words in body copy. Lists are frequent.

### Typography
- **Emoji allowed and expected** in social copy — 1–3 per post, used as visual labels.
- **Scare quotes** for viral in-group terms: `"bệnh content"`, `"meo meo"`, `"hot hit"`.
- **Colon subtitle headlines:** `[Main hook]: [Subtitle reveal]`.
- Exclamation marks OK but rationed.
- Hashtags at end of social posts.

### Real examples

> **Kenh14:** "Justin Bieber tại Coachella 2026: Khi Hoàng tử nhạc Pop không còn nợ thế giới này bất cứ điều gì"
>
> *Notes:* Colon-subtitle headline, `Khi X không còn Y` = poetic-pop construction, capitalized epithet `Hoàng tử nhạc Pop`.

> **Kenh14:** "Kỷ nguyên của 'Bệnh Content': Tôi đăng bài, nên tôi tồn tại"
>
> *Notes:* `Kỷ nguyên của [scare-quote term]` = trend-labeling frame, inverted Descartes quote = literate-pop intellectualism.

> **Kenh14:** "Nhận diện hội 'meo meo' - nỗi ám ảnh ở các quán cà phê 'hot hit': 1 ly nước, chục bộ đồ, trăm kiểu pose hớ hênh phiền nhiễu"
>
> *Notes:* Classic Kenh14 rage-bait structure: `[viral in-group term]` + `nỗi ám ảnh` + `[location]` + three-clause rhythmic list (1/chục/trăm).

> **Kenh14:** "3 loại cá 'bẩn nhất chợ', ít dinh dưỡng, tiềm ẩn độc tố nhưng nhiều người Việt lại cực mê"
>
> *Notes:* Listicle (`3 loại`), superlative scare-quote (`'bẩn nhất chợ'`), trinity-rhythm body (`ít... tiềm ẩn... cực mê`), contrastive payoff (`nhưng... lại`).

> **Kenh14:** "Không logo, không hàng hiệu: Công thức mặc đẹp của hội 'old money' hóa ra chỉ đơn giản thế này"
>
> *Notes:* `Không X, không Y:` negative-parallel hook, English loanword `'old money'` in scare quotes, reveal-tease `hóa ra chỉ... thế này`.

### Brand-marketing subvariant (Shopee/MoMo/Tiki-style)
Same macro-register as pop, but with explicit brand voice. Signature markers:
- `chúng mình` (Shopee/MoMo) instead of `chúng tôi`.
- Emoji-heavy push notifications: 🔥 ⚡ 🎁.
- Urgency without panic: `Sắp hết!`, `Chỉ hôm nay`, `Còn 2h`.
- `bạn` as reader, never `quý khách`.
- Short commanding CTAs: `Săn deal ngay`, `Xem ngay`, `Đặt liền tay`.

Pattern example (synthesized from brand notification conventions):
> "Bạn ơi, chúng mình vừa cập nhật loạt deal mới cực hot 🔥 Săn ngay kẻo lỡ nha!"

### Translation giveaways to fix
- **Corporate translation residue:** `Quý khách hàng thân mến` → replace with `Bạn ơi` or drop entirely.
- **Too-long headline:** 25+ word English headlines → break into `[Hook]: [Subtitle]` format.
- **Flat intensifiers:** English "amazing", "incredible" → `cực xịn`, `đỉnh chóp`, `gây bão`, NOT `tuyệt vời` (that's corporate-flat).
- **Missing emotion cue:** pop copy without at least one emotive word reads dead. Inject `mê tít`, `chất`, `đã`, `đỉnh`.
- **Literal English sentence structure:** "You won't believe..." → `Không thể tin nổi...` is a direct calque that works, but `Hóa ra...` is more native.
- **Oxford-comma-style lists:** English "X, Y, and Z" → VN uses `X, Y và Z` (no comma before và) or `X, Y, Z` (asyndetic).
- **Missing scare quotes on viral terms:** any English borrowing used as a trend label should be in quotes.

---

## Subvariants and dialect notes

### North vs. South lexical swaps (both acceptable per region)

| Concept | Northern | Southern |
|---|---|---|
| this | `này` | `nè` |
| ok/sure | `nhé` | `nha` |
| a bit | `một tí`, `chút` | `chút xíu`, `chút` |
| uncle (stranger) | `bác` | `chú` |
| to use | `dùng` | `xài` |
| pork belly | `ba chỉ` | `ba rọi` |
| fall/drop | `ngã` | `té` |
| watermelon | `dưa hấu` | `dưa hấu` (same) |
| cost | `mất` | `tốn` |

For national brand copy, default to **neutral** — avoid strongly regional markers unless the brand is explicitly regional. Southern `nha` is becoming the default pop-casual particle even for Northern audiences under 25.

### Sentence-final particle cheat sheet

| Particle | Register | Function |
|---|---|---|
| `ạ` | internal | Marks speaker as junior to addressee. Used in questions/statements to elders. |
| `nhé` | Semi-casual, pop | Soft suggestion/reminder. Northern default. |
| `nha` | Semi-casual, pop | Same as `nhé` but warmer, Southern, now national-pop default. |
| `nhỉ` | Semi-casual, bro | Solicits agreement — "right?" "eh?" |
| `đấy` / `đó` | internal | Mild emphasis — "it is so" |
| `luôn` | All casual | Urgency/immediacy — "straight away" |
| `à` | All casual | Surprise/realization |
| `ơi` | All casual | Vocative call-out |
| `với` (end) | Bro, pop | Inclusive request — "too" (rare — use sparingly) |

**None of these belong in Register 1 (báo chí).** Every one of them is fine in Registers 2–4 with frequency calibrated to the sub-register.

### Pronoun pair cheat sheet (self ↔ reader)

| Pair | Register | Vibe |
|---|---|---|
| (none) ↔ (none) | Báo chí | Institutional, distant |
| `chúng tôi` ↔ (none) | Báo chí editorial / formal brand | internal |
| `mình` ↔ `bạn` | internal | Warm blogger |
| `mình` ↔ `anh em` | Semi-casual tech | Community insider |
| `tôi` ↔ (self) | Essayist | Reflective monologue |
| `em` ↔ `cụ/mợ/bác` | Bro (Otofun) | internal |
| `mình` / `tôi` ↔ `ae/thím/bác` | Bro (Voz) | Peer-irreverent (`tôi` in reflective/sardonic Voz posts) |
| `chúng mình` ↔ `bạn` | Pop/brand marketing | internal |
| `chúng tôi` ↔ `quý khách` | Corporate formal | Stiff — avoid unless required |

**Mixing pairs across registers is the #1 translation artifact.** A post that opens with `chúng tôi` and then switches to `mình` mid-paragraph reads like machine translation spliced with blog voice. Pick a pair and hold it through the whole piece.

---

## Quick-reference register decision tree

```
Is the content an official announcement, news, or institutional doc?
 → Register 1 (báo chí). No self, no reader, no particles.
Is it a product blog, tutorial, or long-form essay for engaged users?
 → Register 2 (semi-casual). mình + bạn or mình + anh em. Light particles.
Is it for a specific in-group community that self-identifies (vozers, otofuners, gamers)?
 → Register 3 (bro). Match the community's specific pronoun pair. Heavy particles.
Is it consumer marketing, pop entertainment, or mass-social content for <35yo?
 → Register 4 (pop/brand). chúng mình + bạn. Emotive, emoji-OK, scare-quoted viral terms.
```

When ambiguous between 1 and 2, default to 1 (safer). When ambiguous between 2 and 4, match the brand voice. When ambiguous between 3 and anything else — stay out of 3 unless the writer is genuinely in the in-group. Register 3 from an outsider reads as cringe cosplay.
