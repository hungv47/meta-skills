# App Store Screenshot Pipeline

Author an in-app screen as HTML, render to PNG, composite into a real device frame with marketing copy. Outputs upload directly to App Store Connect.

## CRITICAL RULES

1. **Use this kit. Do not invent your own status bar, device frame, or layout.** Substitutes will misalign.
2. **Do not modify the status bar PNGs in `assets/`.**
3. **Produce both iPhone AND iPad screenshots.** iOS apps default to universal (`TARGETED_DEVICE_FAMILY = "1,2"`); App Store Connect rejects universal submissions missing the iPad set. Only skip the iPad set when the source explicitly targets iPhone only (`= "1"`).
4. **`app_screenshot:` MUST live under `assets:`, never under `variables:`.** The compositor only applies the device frame to entries in `assets:`. Putting an image path under `variables:` substitutes the literal path string into the template — no frame, no image processing.
5. **`app_screenshot:` MUST be a basename**, not a path. Place the HTML in the working directory and reference it as `screen.html`, never `./screen.html` or `dir/screen.html`.

## Workflow

1. **Author each in-app screen as HTML — for BOTH iPhone and iPad.** For each slide, copy `templates/app_screen_iphone_scaffold.html` AND `templates/app_screen_ipad_scaffold.html`, set `<html data-theme="light">` or `data-theme="dark"` per the user's app theme, and fill `<div class="app-content">` with the app UI. The iPad layout typically uses more horizontal space than the iPhone — design accordingly.

2. **Write the screenshot config YAML** referencing each app screen by its HTML basename in `app_screenshot:`, and the marketing template by basename in `template:` (e.g. `marketing_iphone_hero.html`). See `config.example.yaml` for the canonical shape.

3. **Run one command:**
   ```bash
   ./ios-cli screenshots generate config.yaml
   ```
   The CLI renders each HTML to a PNG, composites it inside the device frame on the marketing template, and writes the final PNGs to the YAML's `output_dir`.

4. **Upload each rendered PNG** with `./ios-cli publish upload-screenshot --file <path> --device-type <APPLE_TYPE>` and append the returned URL to the production metadata `screenshots[]`.

For multiple slides per device, add more entries under `screenshots:` in the YAML — App Store Connect requires 3-10 screenshots per device-type per locale.

## Output dimensions

| Device | Pixels | App Store Connect device type |
|---|---|---|
| iPhone | 1320×2868 | `IPHONE_69` |
| iPad   | 2064×2752 | `IPAD_PRO_3GEN_129` |

App Store Connect auto-scales these baselines down to all smaller iPhone/iPad sizes. Ship one set per device family; don't ship multiple iPhone or iPad variants.

## Files

The templates, status-bar PNGs, and `config.example.yaml` ship inside the `ios-cli` binary; reference them by basename in the YAML. Available basenames:

```
templates/
├── marketing_iphone_hero.html         text top, device bottom
├── marketing_iphone_side.html         text left + 3 stats, device right rotated
├── marketing_iphone_feature_top.html  device top, text + 6 chips bottom
├── marketing_ipad_hero.html
├── marketing_ipad_side.html
├── marketing_ipad_feature_top.html
├── app_screen_iphone_scaffold.html    status bar + content slot + home indicator
└── app_screen_ipad_scaffold.html
assets/                                status bar PNGs (light/dark, iPhone/iPad)
config.example.yaml
```

Pick the marketing template that fits the slide's purpose: `_hero` for the headline opener, `_side` for stats-with-rotated-device, `_feature_top` for chip-grid feature lists.

## Marketing background

The shipped templates use placeholder gradients. For each app, read the source, pull the brand's primary + one accent color, and replace the gradient stops in the marketing template's `body { background: ... }`. Use muted variants (lower saturation, darker lightness) — the background frames the device, doesn't compete with it. The headline `<span class="accent">` gradient must use the same two colors. Keep the same palette across all slides for one app.

## Layout constants

iPhone:

| | value |
|---|---|
| Headline | max 2 lines, 13vw, line-height 1.12 |
| Subtitle | max 3 lines, 5vw, line-height 1.28 |
| Device — hero | width 65vw, bottom 3% |
| Frame | iPhone 16 Pro Max — Black Titanium — Portrait |

iPad:

| | value |
|---|---|
| Headline | max 2 lines, 9vw, line-height 1.12 |
| Subtitle | max 2 lines, 4vw, line-height 1.28 |
| Device — hero | width 63vw, bottom 3% |
| Device — side | width 65vw, right -15%, rotate 5deg |
| Device — feature_top | width 70vw, top 0% |
| Frame | iPad Pro 13 — M4 — Space Gray — Portrait |

These guarantee no collision between text and device at maximum text density. If a user request requires deviating, recompute the device width: `device_height_max = canvas_height − bottom_inset − text_block_height − buffer`, then `device_width = device_height_max / frame_aspect` (frame aspect = 2.041 iPhone, 1.304 iPad).

## Theme switching

Set `<html data-theme="dark">` on the scaffold. The status bar swaps to the dark PNG, the home indicator turns white, and the dark body styles take over. Match the user's app theme.

## Line breaks in headlines / subtitles

Use `<br>` inside the YAML value for line breaks. `\n` is treated as literal text — `subtitle: "Line one.<br>Line two."` renders as two visible lines.
