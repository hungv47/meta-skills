# Absolute Prohibitions — Vietnamese Polish

Zero-tolerance violations. A single instance of any of these breaks the polish — the critic auto-FAILs and the polisher must re-dispatch.

These violate Vietnamese register conventions so reliably that no judgment call applies. Treat them as hard structural rules, not stylistic preferences.

## 1. No em dashes (`—`)

Vietnamese is not English. The em dash is an English typographic convention; in Vietnamese it reads as an unmistakable AI-translation tell.

**Use instead:** comma, period, parentheses, colon, or restructure the sentence.

## 2. No `quý khách` / `quý vị` outside explicit corporate formal notices

These ultra-formal reader-address forms only fit explicit B2B legal notices, official government communications, or corporate compliance copy.

**Use instead:**
- `pop-marketing` → `bạn`
- `semi-casual` → `bạn`
- `bro` → the subvariant's pronoun (varies — see `vn-tone-corpus.md`)
- `bao-chi` → no reader-address at all (báo chí is third-person)

## 3. No title-case VN headlines

English convention; instantly foreign in Vietnamese. Use **sentence case** only. Proper nouns stay capitalized.

WRONG: `Cách Tối Ưu Hóa Hiệu Suất Làm Việc`
RIGHT: `Cách tối ưu hóa hiệu suất làm việc`

## 4. No particles in `bao-chi`

Báo chí (journalistic) register is **particle-free**. Zero tolerance for: `ạ`, `nhé`, `nhỉ`, `nha`, `đấy`, `đó`, `thôi`, `mà`, `ấy`, `vậy`, `hả`.

Particles belong in casual / pop / bro registers. They turn báo chí into a chat message.

## 5. No pronoun pair drift

Whatever (self ↔ reader) pair opens the text must close it. Mid-text drift is auto-FAIL.

Example FAIL: opens with `mình ↔ bạn`, mid-paragraph switches to `tôi ↔ quý khách`, ends with `chúng ta`. Three pairs = three voices = obviously machine-translated.

The polisher picks one pair at start and holds it for the entire artifact.

## 6. No dropped facts

If the original has a number, name, date, named entity, claim, or quoted statement, the polished version has it too. Polishing means **form, not content**.

Facts that must survive intact: prices, percentages, dates (reformatted to DD/MM/YYYY but value-preserved), proper nouns, brand names, statistic citations, quoted speech.

## 7. No cliché stack

Never let two of the following appear in the same paragraph: `giải pháp toàn diện`, `trải nghiệm đột phá`, `tối ưu hóa`, `chuyển đổi số`, `hành trình`, `bứt phá`, `kiến tạo`, `đồng hành`, `tiên phong`, `vươn tầm`.

Each is acceptable alone in pop-marketing. Stacked, they read as corporate translationese. The polisher's job is to delete down to at most one per paragraph.

## 8. No literal idiom calques

English idioms translated word-for-word are the most reliable AI-translation tell. Auto-FAIL if any of these survive:

- `vào cuối ngày` (at the end of the day → `nói cho cùng` / `cuối cùng`)
- `đi về phía trước` (move forward → `tiến lên` / `tiếp tục`)
- `nghĩ bên ngoài chiếc hộp` (think outside the box → `nghĩ khác đi`)
- `kẻ thay đổi trò chơi` (game-changer → `bước ngoặt`)
- `chạm vào cơ sở` (touch base → `liên hệ lại`)
- `quả treo thấp` (low-hanging fruit → `dễ làm trước`)
- `chiếc bánh trên trời` (pie in the sky → `viển vông`)
- `chúng ta hãy ăn trưa` (let's do lunch → `gặp nhau trưa nay nhé`)

Full calque catalog: `references/translation-artifacts.md` § "Idiom calques".

---

**Enforcement:** All 8 prohibitions are checked by the critic agent on every run. Even one violation = FAIL regardless of the 36-point rubric score.
