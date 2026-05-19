# Translation Artifacts — EN→VN Giveaways to Strip

> The 28 most common signs that Vietnamese text was translated from English (usually by MT or by a non-native writer translating literally). Used by `diagnostic-agent` to flag, and by `polisher-agent` to fix. Severity ranked **Hard** (instant tell, must fix) or **Soft** (context-dependent, fix if register demands it).

**How to read this doc:** each entry has the English source pattern, the wrong VN output (what you'll see in translated drafts), the correct native VN version, and a one-line fix rule. Examples are drawn from common machine-translation failure modes observed across news, marketing, and SaaS copy.

---

## Category A — Pronoun & Address Failures (Hard)

### A1. Missing first-person pronoun
**EN:** "I think this is the best option."
**Wrong VN:** "Nghĩ rằng đây là lựa chọn tốt nhất." (headless)
**Right VN:** "Mình nghĩ đây là lựa chọn tốt nhất." (semi-casual) or "Chúng tôi cho rằng đây là phương án tối ưu." (brand/formal)
**Fix rule:** Never leave first person implicit in VN unless the register is báo chí (no first person at all). Semi-casual demands `mình`, essayist demands `tôi`, brand demands `chúng mình` / `chúng tôi`.

### A2. Wrong formality register for "you"
**EN:** "You'll love this feature."
**Wrong VN:** "Quý khách sẽ yêu thích tính năng này." (stiff-corporate, machine-translation default)
**Right VN:** "Bạn sẽ mê tính năng này nha." (pop) / "Anh em sẽ thích tính năng này nhé." (tech community)
**Fix rule:** `quý khách` and `quý vị` belong only in corporate formal notices (e.g., airline safety announcements). For everything else, `bạn` or a register-appropriate collective.

### A3. Pronoun pair drift within a piece
**Wrong VN:** Opening uses `chúng tôi` + `quý khách`, then mid-paragraph switches to `mình` + `bạn`, then later drops to no pronouns.
**Fix rule:** Pick one pair at the start and hold it through. Drift is the #1 MT giveaway.

### A4. Third-person title stripping
**EN:** "Trump said..." / "Putin announced..."
**Wrong VN:** "Trump nói..." / "Putin công bố..." (works in bro register only)
**Right VN (báo chí):** "Ông Trump cho biết..." / "Tổng thống Putin tuyên bố..."
**Fix rule:** Adults in news/formal context always get `ông` / `bà` / title on first mention and most reintroductions.

### A5. Literal "we" for editorial voice
**EN:** "We believe this is a turning point."
**Wrong VN:** "Chúng ta tin rằng đây là bước ngoặt." (`chúng ta` = inclusive "we" including reader — wrong)
**Right VN:** "Chúng tôi cho rằng đây là bước ngoặt." (exclusive we — speaker's side only)
**Fix rule:** `chúng tôi` = exclusive ("we, not you"). `chúng ta` = inclusive ("we, including you"). Editorial/corporate voice is almost always `chúng tôi`.

---

## Category B — Sentence-Final Particle Omissions (Hard in casual registers)

### B1. Missing softener on suggestion
**EN:** "Remember to back up your files."
**Wrong VN:** "Hãy nhớ sao lưu các tập tin của bạn." (stiff imperative)
**Right VN (semi-casual):** "Nhớ sao lưu file nha." / "Anh em nhớ backup file nhé."
**Fix rule:** Imperatives in casual registers need a closing particle (`nha`, `nhé`, `đấy`) or the softener `nhớ` + particle.

### B2. Bare question in solicitation context
**EN:** "Anyone have experience with X?"
**Wrong VN:** "Có ai có kinh nghiệm với X?" (grammatically fine but register-flat)
**Right VN (bro):** "Có bác nào từng dùng X chưa ạ?" / "AE nào biết X không?"
**Right VN (pop):** "Bạn nào đã thử X rồi nè?"
**Fix rule:** Forum-solicitation questions need the register-matched pronoun pair + a final particle.

### B3. English-style tag questions translated literally
**EN:** "It's nice, isn't it?"
**Wrong VN:** "Nó đẹp, phải không?" (awkward-literal)
**Right VN:** "Đẹp nhỉ?" (one-word + `nhỉ` = natural solicitation)
**Fix rule:** Tag questions become `nhỉ?` alone, appended to the core claim.

---

## Category C — Literal Idiom / Calque (Hard)

### C1. "At the end of the day"
**EN:** "At the end of the day, it's about trust."
**Wrong VN:** "Vào cuối ngày, điều quan trọng là sự tin tưởng." (calque — nobody says this)
**Right VN:** "Rốt cuộc, quan trọng nhất là niềm tin." / "Cuối cùng thì cái quan trọng là sự tin tưởng."
**Fix rule:** Idioms translate to *function*, not words. `Rốt cuộc` / `Cuối cùng thì` / `Nói cho cùng` covers this.

### C2. "Going forward"
**EN:** "Going forward, we'll use the new system."
**Wrong VN:** "Đi về phía trước, chúng ta sẽ dùng hệ thống mới." (nonsense-literal)
**Right VN:** "Từ nay, chúng tôi sẽ dùng hệ thống mới." / "Sắp tới..." / "Kể từ bây giờ..."
**Fix rule:** Temporal idioms need `từ nay`, `sắp tới`, `kể từ bây giờ`, `thời gian tới`.

### C3. "Best of both worlds"
**EN:** "The best of both worlds."
**Wrong VN:** "Điều tốt nhất của cả hai thế giới." (calque)
**Right VN:** "Vẹn cả đôi đường." / "Nhất cử lưỡng tiện."
**Fix rule:** Use established VN idioms. `Vẹn cả đôi đường` is the standard rendering.

### C4. "Think outside the box"
**EN:** "Think outside the box."
**Wrong VN:** "Nghĩ bên ngoài chiếc hộp." (calque — meaningless)
**Right VN:** "Nghĩ khác đi." / "Tư duy đột phá." / "Phá bỏ khuôn mẫu."
**Fix rule:** Corporate English idioms translate to the *concept* + VN phrasing.

### C5. "Game changer"
**EN:** "This is a game changer."
**Wrong VN:** "Đây là một kẻ thay đổi trò chơi." (nonsense)
**Right VN:** "Đây là bước ngoặt." / "Thay đổi cuộc chơi." (latter is becoming naturalized in pop/tech)
**Fix rule:** `Bước ngoặt` is neutral. `Thay đổi cuộc chơi` is now acceptable in pop/tech.

### C6. "Low-hanging fruit"
**Wrong VN:** "Trái cây treo thấp." (literal)
**Right VN:** "Việc dễ làm trước." / "Cái dễ xử trước."

### C7. "Touch base"
**Wrong VN:** "Chạm cơ sở." (nonsense)
**Right VN:** "Liên lạc một chút." / "Trao đổi nhanh." / "Trò chuyện tí nha."

---

## Category D — Grammatical Calques (Hard)

### D1. Passive voice overuse
**EN:** "The report was submitted by the team."
**Wrong VN:** "Báo cáo đã được nộp bởi nhóm." (grammatically possible but awkward — `bởi` is rarely natural)
**Right VN:** "Nhóm đã nộp báo cáo." (active, the VN default)
**Fix rule:** VN strongly prefers active voice. Convert passives unless the agent is unknown or unimportant.

### D2. "It is [adjective] that..."
**EN:** "It is important that everyone attends."
**Wrong VN:** "Nó là quan trọng rằng mọi người tham dự." (robotic)
**Right VN:** "Quan trọng là mọi người phải tham dự." / "Mọi người cần có mặt đầy đủ."
**Fix rule:** Drop the dummy "it" and restructure around the real subject or the predicate.

### D3. "There is / there are"
**EN:** "There are many reasons to switch."
**Wrong VN:** "Có nhiều lý do để chuyển đổi." (acceptable) / "Ở đó có nhiều lý do..." (wrong — no `ở đó`)
**Right VN:** "Có nhiều lý do để chuyển." (drop `đổi` when redundant)
**Fix rule:** `Có` alone covers "there is/are". Never `ở đó có` for existential.

### D4. Relative clauses with `mà`
**EN:** "The product that you bought yesterday..."
**Wrong VN:** "Sản phẩm mà bạn đã mua hôm qua..." (not wrong but MT-heavy)
**Right VN:** "Sản phẩm bạn mua hôm qua..." (drop `mà` when unambiguous)
**Fix rule:** Drop `mà` unless omitting it causes ambiguity. MT systems over-insert `mà`.

### D5. Definite articles → `các`, `những`
**EN:** "The users are happy."
**Wrong VN:** "Các người dùng thì hạnh phúc." (over-marked plural + filler `thì`)
**Right VN:** "Người dùng hài lòng." (VN has no definite article; plural is implied by context)
**Fix rule:** Only add `các` / `những` when plurality is genuinely ambiguous or emphatic.

### D6. Progressive aspect `đang` over-use
**EN:** "We are building the future."
**Wrong VN:** "Chúng tôi đang xây dựng tương lai." (acceptable but overused in MT)
**Right VN:** "Chúng tôi xây dựng tương lai." / "Kiến tạo tương lai." (noun-heavy tagline form)
**Fix rule:** `đang` is a real VN marker but MT over-applies it. Remove when the action is timeless/general.

### D7. Tense markers over-use
**EN:** "I will help you."
**Wrong VN:** "Tôi sẽ giúp đỡ bạn." (MT default — every future verb gets `sẽ`)
**Right VN:** "Mình giúp bạn nhé." (near-future semi-casual — no `sẽ` needed)
**Fix rule:** VN future is often zero-marked. Only keep `sẽ` for genuine distal future or emphasis.

---

## Category E — Vocabulary Register Mismatch (Soft to Hard)

### E1. Over-Sino-Vietnamese in casual contexts
**Wrong VN (casual):** "Vận dụng các giải pháp tiên tiến để tối ưu hóa trải nghiệm..."
**Right VN (casual):** "Dùng mấy cách mới để xài cho đã..."
**Fix rule:** Sino-Vietnamese is the default for news/formal. In casual, swap for native: `sử dụng` → `dùng` / `xài`, `vận dụng` → `dùng`, `tối ưu hóa` → `làm cho tốt hơn`, `trải nghiệm` → `cảm giác khi dùng`.

### E2. Under-Sino-Vietnamese in formal contexts
**Wrong VN (formal):** "Công ty làm cho sản phẩm tốt hơn vì khách hàng..."
**Right VN (formal):** "Công ty không ngừng hoàn thiện sản phẩm nhằm phục vụ khách hàng..."
**Fix rule:** Formal register demands Sino-Vietnamese compounds. Swap native verbs up: `làm` → `thực hiện`, `có` → `sở hữu` / `có được`, `cho` → `cung cấp`, `vì` → `nhằm` / `với mục đích`.

### E3. Dead corporate intensifiers
**Wrong VN:** "Giải pháp toàn diện với trải nghiệm đột phá cho hành trình chuyển đổi số." (every word is meaningless)
**Right VN:** Cut ruthlessly. State what the thing actually does.
**Fix rule:** `toàn diện`, `đột phá`, `tiên phong`, `chuyển đổi số`, `hành trình`, `giải pháp`, `tối ưu hóa` — use at most two per page and only if they carry real meaning. Most translated marketing copy stacks four or five in one sentence.

### E4. Flat intensifiers in pop register
**Wrong VN:** "Sản phẩm rất tuyệt vời."
**Right VN:** "Sản phẩm xịn xò, đỉnh của đỉnh." / "Hàng chất, đáng đồng tiền."
**Fix rule:** Pop register demands colorful intensifiers: `xịn`, `chất`, `đỉnh`, `cực mê`, `gây bão`, `mê tít`. `Tuyệt vời` reads corporate-flat.

---

## Category F — Punctuation & Typography (Hard)

### F1. Em dashes
**EN:** "The product — our flagship — ships Monday."
**Wrong VN:** "Sản phẩm — sản phẩm chủ lực — sẽ ra mắt thứ Hai." (em dashes are not native VN punctuation)
**Right VN:** "Sản phẩm chủ lực của chúng tôi sẽ ra mắt thứ Hai." (restructure) or parentheses.
**Fix rule:** VN uses parentheses or clause restructuring. Em dashes are English intrusion.

### F2. Oxford comma
**EN:** "Apples, oranges, and bananas."
**Wrong VN:** "Táo, cam, và chuối." (comma before `và` is unnatural)
**Right VN:** "Táo, cam và chuối." / "Táo, cam, chuối." (asyndetic, even more native)
**Fix rule:** Never comma before `và` in native VN.

### F3. Title case headlines
**EN:** "How To Build A Better Mousetrap"
**Wrong VN:** "Cách Để Xây Dựng Một Chiếc Bẫy Chuột Tốt Hơn" (every word capitalized = English intrusion)
**Right VN:** "Cách xây dựng bẫy chuột hiệu quả hơn" (sentence case only)
**Fix rule:** VN uses sentence case for headlines. Only proper nouns capitalized.

### F4. Quotation marks
**EN:** `"quoted text"`
**Wrong VN:** `"quoted text"` (straight quotes are fine but curly `“”` is English)
**Right VN:** `"quoted text"` or `«quoted text»` in formal settings.
**Fix rule:** Straight `"..."` is safe everywhere. Curly smart-quotes are an MT output artifact.

### F5. English ellipsis and punctuation spacing
**Wrong VN:** "Thật sự... điều đó rất quan trọng." (extra spaces)
**Right VN:** "Thật sự... điều đó rất quan trọng." (no space before punct)
**Fix rule:** VN follows continental spacing — no space before `.`, `,`, `!`, `?`. No space after opening `(` or `"`.

---

## Category G — Culturally-Loaded Words (Hard)

### G1. "Family" metaphor
**EN:** "We're a family here at Acme."
**Wrong VN:** "Chúng tôi là một gia đình tại Acme." (acceptable but reads American)
**Right VN:** Consider dropping the metaphor. VN workplace culture has `tập thể` (collective), `công ty mình`, `anh chị em trong công ty` which land differently.
**Fix rule:** Culture-specific metaphors often need **substitution**, not translation. Ask what the function is (warmth? loyalty?) and find the VN equivalent.

### G2. "Thoughts and prayers"
**Wrong VN:** "Suy nghĩ và lời cầu nguyện." (literal = meaningless)
**Right VN:** "Xin chia buồn." / "Gửi lời động viên..." / religious-specific phrasing.

### G3. "Built different"
**Wrong VN:** "Được xây dựng khác biệt." (nonsense)
**Right VN:** "Khác biệt từ gốc." / "Chất từ trong ra ngoài." / drop and substitute.

### G4. First-person testimonial with US cultural markers
**EN:** "As a busy mom of three..."
**Wrong VN:** "Là một người mẹ bận rộn của ba đứa con..." (awkward)
**Right VN:** "Mình là mẹ của ba bé, công việc bận rộn..." (natural VN flow: separate identity from state).
**Fix rule:** "Person of [role]" constructions need to be unpacked into separate clauses.

---

## Category H — Number, Date, and Unit Formatting (Hard)

### H1. Date order
**EN:** `April 14, 2026` or `4/14/2026`
**Right VN:** `14/4/2026` or `ngày 14 tháng 4 năm 2026` (formal)
**Fix rule:** VN is always day-month-year. Convert from US format.

### H2. Thousands separator
**EN:** `1,000,000` (comma as thousand separator)
**Right VN:** `1.000.000` (period as thousand separator — continental style)
**Fix rule:** Also: decimal uses comma, not period (formal). `3,5%` not `3.5%`.

### H3. Currency position
**EN:** `$5.99`
**Right VN:** `5,99 USD` / `130.000 đ` / `130k` (casual)
**Fix rule:** Currency symbol goes after number in VN. Abbreviated `k` for thousand đồng is common in pop/marketing.

### H4. Time format
**EN:** `3:00 PM`
**Right VN:** `15h` / `15:00` / `3 giờ chiều` (informal)
**Fix rule:** 24-hour default for formal, `h` suffix for compact, `giờ + time-of-day` for narrative.

---

## Category I — Inflated Corporate Translationese (Soft but Pervasive)

### I1. Stacking abstract nouns
**Wrong VN:** "Việc triển khai giải pháp sẽ mang lại sự tối ưu hóa trong hiệu suất của quy trình."
**Right VN:** "Triển khai giải pháp giúp quy trình chạy nhanh hơn."
**Fix rule:** Convert noun-stacks to verb phrases. Every abstract noun (`việc`, `sự`, `tính`, `độ`) is a candidate for removal.

### I2. Filler connectors
**Wrong VN:** "Về cơ bản thì, trên thực tế, điều quan trọng là..."
**Right VN:** "Điều quan trọng là..." (cut all three fillers)
**Fix rule:** `Về cơ bản`, `Trên thực tế`, `Có thể nói rằng`, `Điều đáng lưu ý là` are VN throat-clearing. Delete.

### I3. Redundant pairings
**Wrong VN:** "Một cách nhanh chóng và hiệu quả" (two synonyms)
**Right VN:** "Nhanh chóng." (pick one)
**Fix rule:** MT output often pairs synonyms to pad. Pick the stronger one, delete the other.

### I4. Over-explicit logical connectors
**Wrong VN:** "Bởi vì X, do đó Y, vì thế Z." (triple-marking a single cause-effect)
**Right VN:** "X nên Y. Z theo sau." (one connector is enough)
**Fix rule:** VN tolerates less explicit logic-marking than English. Drop redundant conjunctions.

---

## Category J — Voice & Personality Flatness (Soft)

### J1. Missing `mà`, `thì`, `ấy`, `đấy` — the "flavor" particles
Casual VN is held together by mid-sentence flavor particles. Translated text often omits them entirely, producing text that's grammatical but personality-free.

**Flat:** "Mình đi chợ về."
**Alive:** "Mình đi chợ về nè." / "Mình đi chợ về đấy chứ." / "Mình đang đi chợ về thì..."

**Fix rule:** In casual-pop-bro registers, ~20% of sentences should end with a flavor particle. If none appear, inject `nha`, `nhé`, `nè`, `đấy`, `luôn` where the tone demands.

### J2. Missing experience markers
**Flat:** "Sản phẩm này tốt."
**Alive:** "Mình dùng một tuần rồi, thật sự thấy ổn phết." (lived experience + evaluator)

**Fix rule:** Pop and semi-casual registers need first-person experience anchors: temporal (`một tuần rồi`), personal (`mình thấy`), hedged (`thật sự thấy`, `công nhận là`).

### J3. Missing rhythm contrast
**Flat:** Every sentence 15 words. Every sentence 15 words. Every sentence 15 words.
**Alive:** Short punch. Then a longer, more explanatory sentence that sets up context. Short again. Reset.

**Fix rule:** Vary sentence length. VN rhythm is more elastic than translated prose suggests.

---

## Severity summary

**Hard tells (always fix):**
A1, A2, A3, A4, A5, B1, B2, B3, C1–C7, D1, D2, D3, D4, D5, D6, D7, E3, F1, F2, F3, F5, G1, G2, G3, G4, H1, H2, H3, H4

**Soft tells (fix if register demands):**
E1, E2, E4, I1, I2, I3, I4, J1, J2, J3, F4

**Note on E3:** E3 (dead corporate intensifiers — `giải pháp toàn diện`, `trải nghiệm đột phá`, `tối ưu hóa`, `chuyển đổi số`, `hành trình`) is promoted to Hard because stacking two or more of these in the same paragraph is an Absolute Prohibition in `SKILL.md`. Treat single instances as Soft (context-dependent) but any stack of 2+ as Hard.

A polished piece has **zero Hard tells** and at most **two Soft tells** per 200 words.
