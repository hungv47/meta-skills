<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Platform Surfaces Reference

Canonical surface catalog for the platforms a brand can ship on. **Single source of truth** — when a platform adds or deprecates a surface, update here, not in the agent specs.

**Read by:**
- `strategy-agent` — pulls the **Brand expression surfaces** table per declared platform into `BRAND.md → Digital Touchpoints → Platform-Specific Surfaces`
- `visual-agent` — pulls the **Icon specifications** block per declared platform into `DESIGN.md → Platform Icon Specifications`

## Declared-platform canonical list (matches SKILL.md Step 0)

Web / PWA · iOS/iPadOS · Android · macOS · Windows · Linux desktop · watchOS · Wear OS · tvOS · CarPlay / Android Auto · Browser extension · CLI / terminal · Email (BIMI) · Embedded app (Slack / Notion / Discord / Microsoft Teams / Linear / GitHub)

**Register separation rule:** The **Brand expression surfaces** column describes how the brand *feels and expresses itself* at each surface (mood, motion cue, color role, chrome density) — never geometry. The **Icon specifications** block owns all geometry (pixel sizes, safe zones, formats, state variants, pitfalls). Agents must not cross registers.

**Emission rule:** Agents emit one subsection per declared platform, in declared order. Undeclared platforms are absent — not empty, not TBD, absent.

---

## iOS / iPadOS

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| Home screen icon (light / dark / tinted) | how the brand reads as a glyph at icon scale; mood shift from light → dark → tinted mode |
| App Library group tile | brand legibility inside the grouped stack at tiny scale |
| Spotlight search result | icon + title rendering |
| Launch screen (storyboard) | color, logo placement, motion handoff to first screen |
| Tab bar glyphs | SF Symbol vs custom, fill / stroke state convention |
| Navigation bar / toolbar | title weight, large-title treatment, blur material |
| Widgets (small, medium, large, extra-large) | layout, density, accent usage per size |
| Lock screen complications (iOS 16+) | rectangular, circular, inline treatments |
| Live Activities / Dynamic Island | compact, minimal, expanded presentations |
| Notifications (standard + expanded) | icon, attachment, accent color |
| Control Center module | glyph treatment |
| Share sheet icon | mono vs color |
| Context menu preview | radius, shadow, blur material |
| Siri / Shortcuts / App Intents | confirmation dialog chrome, parameter summary style |
| Haptic + sound signature | which moments earn which intensity |

### Icon specifications (visual-agent → DESIGN.md)

- **Master:** 1024×1024, PNG, no transparency, no pre-applied corner mask (iOS applies the squircle).
- **Safe zone:** critical geometry within the centered 824×824 region; no edge-touching detail.
- **Variants (iOS 18+):** light, dark (darker base, preserved accent), tinted (single-channel grayscale — design with a value hierarchy that survives flattening).
- **Derivatives:** 180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20 (iPhone + iPad + Settings + Notifications + Spotlight).
- **Pitfalls:** text ≤60pt reads; no photographic detail that breaks ≤40pt; test light + dark + tinted side-by-side before shipping.

---

## macOS

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| App icon | photorealistic vs abstract mood, multi-size legibility character |
| Dock icon (active / inactive / bounce / badge) | dot indicator aesthetic, badge color role, attention bounce motion cue |
| Menu bar / status item | mono silhouette personality — what brand glyph reads at menu bar scale under auto-invert; active vs inactive affordance |
| Finder integrations | document icon per file type, Quick Look preview chrome, Services menu label |
| Window chrome | title bar material, traffic-light alignment, toolbar density, sidebar material, inspector/detail panel |
| Notification banner / alert | icon rendering, accent color |
| Notification Center widget | density, glanceable state |
| About panel | hero art, credits typography, version chrome |
| Dock menu | icon treatment inside contextual menu |
| Launchpad grid | icon rendering alongside Apple stock icons |
| Spotlight metadata | icon + preview card |
| Share extension | mono icon |
| Sound signature | launch, notification, error tones |

### Icon specifications (visual-agent → DESIGN.md)

- **Master:** 1024×1024 with the squircle **baked into the artwork** (macOS does NOT mask).
- **Internal padding:** ~10% each side — do not fill the full 1024.
- **Derivatives:** 1024, 512, 256, 128, 64, 32, 16 — **design distinctly at 32 and 16** (do not just downscale).
- **Menu bar / status item:** monochrome **template image** at 22×22 @1x / 44×44 @2x, pure black + alpha — macOS auto-inverts for light/dark menu bar.
- **Document icons:** per file type the app owns, paired with the app icon.
- **Pitfalls:** no drop shadows (macOS adds its own); no embedded glyph at 16; every derivative re-optimized.

---

## Android

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| Adaptive launcher icon | foreground-vs-background brand split aesthetic; how the mono themed variant survives Material You recoloring |
| App drawer / search result | icon legibility at small size |
| Notification icon | mono silhouette personality at notification scale |
| Splash screen (Android 12+) | icon, background, brand-moment duration |
| Home screen widgets | resize behavior, Material You tint handling |
| App shortcuts / pinned shortcuts | static + dynamic icon set |
| Quick Settings tile | mono icon, on/off state |
| Status / system bar theming | accent contribution, light vs dark content, edge-to-edge handling |
| Material You dynamic color | how brand color survives palette extraction from user's wallpaper |
| internal | compact chrome |
| Notification channels | per-channel icon + accent color |

### Icon specifications (visual-agent → DESIGN.md)

- **Adaptive icon:** foreground 108×108dp with safe zone 66×66dp center + background 108×108dp. System masks to circle, squircle, teardrop, etc.
- **Themed icon (Material You):** monochrome silhouette, single-channel.
- **Legacy icon:** 512×512 fallback for pre-Oreo.
- **Notification icon:** white-on-transparent silhouette, 24×24dp.
- **Play Store feature graphic:** 1024×500.
- **Pitfalls:** foreground must read when masked to any shape; no edge detail in the outer 21dp ring; themed variant cannot depend on color.

---

## Windows

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| Taskbar icon | resting, hover, active-window state, progress overlay, badge |
| Start menu pinned icon (Windows 11) / Live Tile (UWP — legacy) | how the brand reads in the pinned-icon grid; if shipping UWP, live-tile content aesthetic |
| Jump list | icon + task labels |
| Title bar | Mica / Acrylic material choice, caption button style, immersive/titlebar-less mode |
| System tray icon | light / dark theme auto-switch |
| Notification toast | icon, hero image, action buttons |
| Action Center summary | icon + accent |
| Widget Board tile | layout, density |
| File Explorer integration | document icon, overlay icon for cloud/sync state |
| Lock screen (UWP) | badge + detailed status |

### Icon specifications (visual-agent → DESIGN.md)

- **Modern stack (Windows 11 / WinUI 3 / MSIX — default):** Store logos 50×50, 150×150, 300×300; app icon multi-size 16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 80, 96, 256 packaged via MSIX.
- **Legacy UWP Live Tiles (only if shipping UWP):** 71×71, 150×150, 310×150 (wide), 310×310 (large). Deprecated in Windows 11 Start menu — do not design for Live Tiles unless the product explicitly targets Win10 UWP.
- **Taskbar / Start pinned:** 44×44, 32×32, 24×24, 16×16 — **design distinctly at 24 and 16**.
- **Badge / status overlay:** monochrome when applied to a running taskbar icon.
- **Pitfalls:** test on light + dark taskbar; do not rely on transparency for silhouette; do not invest in Live Tile design for new Win11 products.

---

## Linux desktop

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
|.desktop entry icon | how the brand reads across GNOME / KDE / XFCE shells |
| System tray (AppIndicator / KStatusNotifier) | mono variant, theme inheritance |
| GNOME / KDE window chrome | header-bar style, CSD vs SSD handling |
| Notification (libnotify) | icon + accent |
| Flatpak / Snap store listing | tile, screenshots, banner |

### Icon specifications (visual-agent → DESIGN.md)

- **Master:** 512 SVG.
- **PNG fallbacks:** 16, 22, 24, 32, 48, 64, 128, 256, 512 in the Freedesktop hicolor theme.
- **Symbolic icon:** 16 monochrome SVG for tray / notifications, theme-recolorable.
- **Pitfalls:** the symbolic variant must survive recoloring by the user's theme.

---

## Web / PWA

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| Favicon set | brand glyph character at 16 — does it survive the smallest scale? |
| Browser theme-color | which brand color tints the mobile browser chrome in light vs dark |
| PWA manifest | install-name wording, shortcut set, start_url brand moment |
| Install prompt / add-to-home banner | icon + name rendering across browsers |
| Twitter / X card (summary_large_image) | variant if different from OG |
| oEmbed / link-preview fallback | when OG is missing |
| BIMI (Gmail / Outlook sender logo) | verified SVG logo, VMC cert path |
| Browser tab loading state | favicon animation vs static |
| 404 / error / maintenance pages | illustration + voice-of-visual |
| Cookie / consent banner | material, chrome, button hierarchy |

### Icon specifications (visual-agent → DESIGN.md)

- **Required set:** 16, 32, 48 (favicon.ico multi-res), 180 (apple-touch-icon), 192, 512 (manifest).
- **Maskable:** separate 512 with safe zone at 80% center — browsers mask to platform shape.
- **SVG master:** single-source SVG favicon with media-query for light/dark.
- **theme-color meta:** declared for light + dark so mobile browser chrome tints correctly.
- **Pitfalls:** non-maskable icon on Android looks shrunken; maskable without safe zone clips.

---

## watchOS

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| App icon (watch face grid) | circular crop, reduced detail vs iOS icon |
| Complications | how the brand shows up across watch face complication slots — glanceable brand moment per shape |
| Watch face accent | how brand renders on user's active face |
| Smart Stack widget | compact brand moment |
| Notification long-look | header icon + accent |

### Icon specifications (visual-agent → DESIGN.md)

- **Canvas:** 1088×1088, circular crop applied at render.
- **Complication shape taxonomy:** circular (small), rectangular (wide), inline (glyph), graphic circular, graphic corner, graphic rectangular — each tuned, not downscaled.
- **Pitfalls:** no text on icon; geometry must survive circular mask; reduced detail vs iOS icon.

---

## Wear OS

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| Launcher icon | circular mask |
| Tiles | 1-2 swipe views, essential brand moment |
| Complications | ambient vs active state |
| Notifications | round + square device variants |

### Icon specifications (visual-agent → DESIGN.md)

- Adaptive foreground + background, masked to circle.
- **Tile icons:** simplified glyphs, 24dp on-device render.

---

## tvOS

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| Layered app icon (parallax) | depth storytelling — which brand elements live in foreground vs background, what motion reveals |
| Top shelf | featured content treatment |
| Focus state | how brand renders under focus ring glow |
| Splash / launch | cinematic vs flat |

### Icon specifications (visual-agent → DESIGN.md)

- **Layered icon:** 3-5 PNG layers with explicit z-order for parallax; 1920×720 top-shelf image.
- **Pitfalls:** no text in lower layers; edges must bleed past safe area so parallax shift doesn't expose a seam.

---

## CarPlay / Android Auto

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| Simplified app icon | high-contrast silhouette for arm's-length rendering |
| Templates | list / grid / map / now-playing chrome |
| Voice confirmation UI | accent + glyph |

### Icon specifications (visual-agent → DESIGN.md)

- **Simplified silhouette** — high-contrast, no inner detail; designed for 108×108 glanceable rendering at arm's length.

---

## Browser extension

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| Toolbar action icon | mono vs color state personality; how the brand reads in the browser chrome strip |
| Badge | count, text, color |
| Popup chrome | material, dimensions, host-theme inheritance |
| Options / settings page | full-page brand identity |
| Context menu entry | glyph + label |
| Onboarding tab | first-run brand moment |
| Store listing (Chrome Web Store / AMO / Edge Add-ons / Safari) | tile, banner, screenshots |

### Icon specifications (visual-agent → DESIGN.md)

- **Toolbar action:** 16, 32, 48, 128 — design at 16 first, then add detail upward.
- **Badge:** plan color + max 4-char text rendering across Chrome / Firefox / Safari / Edge.
- **Disabled state:** grayscale or desaturated variant.
- **Store listing tile:** per store (440×280 Chrome, 128 square AMO, etc. — let the store spec lead here).

---

## CLI / terminal

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| ASCII / Unicode banner | startup signature at ≤80 col + compact ≤40 col |
| Color palette (ANSI-safe) | primary + accent + semantic in 16-color + 256-color modes |
| Prompt glyph + decoration | if the tool owns a prompt |
| Progress indicators | spinner / bar character set |
| Help text hierarchy | bold, dim, color convention |
| Error output | icon character, color, tone |

### Icon specifications (visual-agent → DESIGN.md)

- **ASCII / Unicode banner:** ≤80 col full, ≤40 col compact variant.
- **ANSI color palette:** primary and accent mapped to 256-color-safe hex approximations; 16-color fallback for classic terminals; monochrome fallback for piped output.

---

## Email (BIMI)

### Brand expression surfaces (strategy-agent → BRAND.md)

Beyond the universal Email row in the Universal Surfaces table, when email is a first-class declared channel:

| Surface | Brand expression |
|---------|------------------|
| Sender avatar (BIMI) | verified SVG logo render in Gmail / Outlook |
| Header / lockup zone | hero band, logo placement |
| Typography with web-safe fallbacks | heading + body fallback chains |
| CTA buttons (bulletproof) | rendering in Outlook desktop + Dark Mode inboxes |
| Transactional vs marketing variants | chrome differences |
| Footer chrome | unsubscribe, address, social lockup |

### Icon specifications (visual-agent → DESIGN.md)

- **Logo:** SVG Tiny P/S profile, square canvas, no raster fallbacks inside the SVG.
- **Safe zone:** centered circle crop (BIMI clients render round).
- **Pitfalls:** VMC certificate required for Gmail; logo must be trademark-registered.

---

## Embedded app (Slack / Notion / Discord / Microsoft Teams / Linear / GitHub)

### Per-host rule

If the user declared multiple hosts (e.g., Slack + Notion), **repeat this subsection per host with host-specific surface names**:
- Slack: Block Kit blocks, slash commands, home tab, unfurls
- Notion: database embeds, widget callouts, block previews
- Discord: slash commands, embeds, app directory
- Microsoft Teams: adaptive cards, messaging extensions
- Linear: command palette, issue previews
- GitHub: checks UI, PR comments, marketplace listing

Do not emit one generic table spanning all hosts.

### Brand expression surfaces (strategy-agent → BRAND.md)

| Surface | Brand expression |
|---------|------------------|
| Host directory / marketplace listing | how the brand tile reads next to competitors in the host's store |
| Bot / integration avatar | small-size legibility, mood inside host's DM list |
| In-context card / block rendering | chrome restraint inside host's UI — when to match host, when to signal our brand |
| Command autocomplete entry | glyph + label style |
| Modal / workflow UI | host theme inheritance vs brand assertion |

### Icon specifications (visual-agent → DESIGN.md)

- Host-specific — defer to host's published icon guidelines (Slack: 512 square with transparent bg; Notion: 280 square; Discord: 512 PNG/JPEG; Teams: 192 + 32 small; Linear: 512 square; GitHub: 400 square).
- **Rule:** design the mark such that it's recognizable at the smallest required size across declared hosts.
