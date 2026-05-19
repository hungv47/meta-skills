# Platform Touchpoints — Surface Catalog

> Exhaustive inventory of the surfaces a product can occupy on every major platform. A **flow touches a surface** when the user can enter, advance, or receive feedback for that flow via that surface. Use this catalog at Step 0 to enumerate which surfaces a flow will occupy, then require the structure, wireframe, and edge-case agents to map each selected surface explicitly.

## How to use this file

1. **At interview time:** Ask the user to pick platforms, then for each platform pick surfaces from the lists below. Nothing on this list is optional-by-default — a surface is either in scope (must be mapped) or explicitly out of scope (noted in the artifact).
2. **At structure-mapping time:** For every selected surface, define the entry trigger, the pre-state data loaded, the screens or controls shown, and the handoff back into the main flow.
3. **At wireframing time:** Render a mini-frame at the surface's native dimensions (see each platform section for typical widths / line budgets).
4. **At edge-case time:** Walk the per-surface failure modes listed under each surface.

Each surface entry below follows the same shape:

- **Surface** — name as users / docs know it
- **Entry triggers** — user actions that bring the flow in via this surface
- **Typical flow role** — whether this surface starts flows, advances flows, or just surfaces state
- **Native dimensions** — rough wireframe size when it makes sense
- **Edge states to check** — surface-specific failure modes beyond the standard five

---

## macOS

Native dimensions guidance: main window 60–100 chars wide; menu-bar dropdown 28–36; notification banner 36–44; widget 2x2 ≈ 28x10, 4x2 ≈ 44x10, 4x4 ≈ 44x22; Dock tile badge is glyph-only.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Dock tile (click) | Click / keyboard Cmd+Tab land | Start / resume | App not running (cold launch), badge stuck stale, bounce when attention-required is ignored |
| 2 | Dock tile (right-click menu) | Right-click / two-finger click | Start a sub-flow from a menu item | Custom items missing if background agent not running; "Options → Open at Login" state drift |
| 3 | Dock tile badge | Passive (shows count or dot) | Surface state only | Badge not clearing after read; badge out of sync with server |
| 4 | App menu (menu bar, own app) | Top menu bar while app focused | Advance (Edit/View/Window commands, keyboard shortcuts) | Grayed items with no tooltip explaining why; command palette alternative missing |
| 5 | Menu bar extra (NSStatusItem) | Click status icon top-right | Start / quick-action without focusing the app | App terminated → icon gone; icon on external display hidden; Control Center displacing it; light/dark mode glyph drift |
| 6 | Notification Center | Passive; click to advance | Start / resume a flow at the exact point of a notification | Grouped notifications hiding detail; notification tapped while app not running; do-not-disturb mode |
| 7 | Spotlight results | Cmd+Space query | Start at a deep entry (document, command, App Intent) | Stale index after rename; App Intents unavailable on older OS; no fallback if indexer paused |
| 8 | Services menu | Menu → App Name → Services, or right-click | Advance — take selected text/file into your flow | Service not registered; selection type unsupported; service runs but target app not launched |
| 9 | Share extension | Share button in any app | Start a flow with payload from another app | Payload type unsupported; sandbox failure; extension invalidated by OS memory pressure |
| 10 | Action extension | "Open in" menu, markup tools | Advance — modify a file and return | Return path ambiguous; file locked; iCloud sync pending |
| 11 | Quick Look preview | Spacebar on a file | Surface state only | Plugin crash → blank preview; file mid-download |
| 12 | Widget (Notification Center / Desktop) | Passive; tap interactive element | Surface state; sometimes start a flow | Widget stale (background refresh throttled); Low Power Mode; small variant data overflow |
| 13 | Finder extension (sync status / context menu) | Passive badges + right-click menu | Start a sub-flow from a file's context | User disabled extension in Settings → Privacy & Security → Extensions; badges out of sync |
| 14 | Shortcuts app / App Intents | User-invoked Shortcut, voice via Siri | Start headlessly with parameters | Intent parameter resolution failure; permission prompt during automation |
| 15 | URL scheme / Universal Link | Click a link in browser / another app | Start at a deep location | Scheme not registered; Universal Link fell back to web; required auth not present |
| 16 | Handoff / Continuity | Handoff icon in Dock / Cmd+Tab | Resume a flow from another Apple device | State missing on handoff; version skew between devices |
| 17 | Cmd+Tab / Mission Control | Keyboard / trackpad | Return to an in-flight flow | Multiple windows of same app; hidden windows not in switcher |
| 18 | First launch / permissions prompts | Install → open | Start onboarding | User denies screen recording / accessibility / file access → which screens are reachable? |
| 19 | Background agent / Login item | Passive | Support long-running state outside UI | Agent killed by user; agent stuck; onboarding never ran because app was only the login item |
| 20 | Full Screen / Split View / Stage Manager | Window management | Flow adapts layout | Title bar hidden; modal covering both split panes; Stage Manager auto-minimize |
| 21 | Touch Bar (legacy, MacBook Pro 2016–2021) | Passive | Advance — contextual controls | Touch Bar disabled in Settings; legacy Intel only |
| 22 | Drag-and-drop from Finder / another app | Passive | Start / advance — accept dropped payload | Unsupported type; multi-item drop; cross-space drop |
| 23 | Global keyboard shortcut (app-registered) | Passive | Start / advance — hotkey anywhere | Conflict with another app's hotkey; accessibility permission revoked |
| 24 | Command palette (in-app, Cmd+K) | Passive | Start any sub-flow by name | Empty-state first-use; rank drift after usage |

---

## iOS / iPadOS

Native dimensions: home screen widget 2x2 ≈ 158pt, 4x2 ≈ 338pt, 4x4 ≈ 338pt sq; lock-screen accessory widget ~50pt wide; Dynamic Island compact/expanded; notification 38ch-ish wide. iPad differs: keyboard-and-trackpad, window scenes, Apple Pencil.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Home Screen icon | Tap app icon | Start / resume | Cold launch state-restoration fail; icon badge lag |
| 2 | Home Screen widget (small/medium/large/XL) | Passive view; tap region | Surface state; start a deep entry | Widget data stale (refresh budget exhausted); widget configuration lost |
| 3 | Lock Screen widget (iOS 16+ inline / circular / rectangular) | Passive; tap to enter with Face ID | Start at a glanceable context | Tiny character budget; redacted mode when locked; Focus filter excluded |
| 4 | Live Activity / Dynamic Island | Passive view; tap to expand | Surface real-time state (timer, delivery, call) | 8h-12h ceiling; app backgrounded too long; budget exceeded → auto-dismissed |
| 5 | Dynamic Island compact / minimal / expanded | Passive + long-press | Advance — peek / full controls | Designs for minimal + compact + expanded must all exist |
| 6 | Notification (banner / lock screen / list) | Push or local | Start / resume at notification context | Notification tapped while app killed; grouped under thread; Focus mode filtered |
| 7 | Notification action button | Long-press / expand | Advance without opening the app | Handler not registered; background processing timeout |
| 8 | Control Center custom control (iOS 18+) | Add from Control Center editor | Quick-action launch | Control disabled; variant mismatch; requires authentication |
| 9 | Today View widget (legacy iOS swipe-right) | Swipe right on lock / home | Same as home widget (older OS) | OS deprecation ongoing |
| 10 | Spotlight search result | Swipe down, search | Start at document / shortcut / handoff / in-app content | Index missing; CoreSpotlight permission; donated activity missing |
| 11 | Siri / App Intents / Shortcuts | Voice / typed / Shortcut run | Start headlessly with parameters | Clarification dialog; parameter resolution failure; in-app confirmation required |
| 12 | Focus mode filter | Passive — filters what the app shows | Reshapes state, not a flow entry | App data hidden when user in other Focus; correct filter registration |
| 13 | Universal Link / URL scheme | Tap a link | Start at deep location | App not installed → App Store fallback; Universal Link fell back to web |
| 14 | App Clip | Scan / NFC / link / Maps listing | Start a tiny flow without full install | 15MB budget; no background capabilities; "Open App" upgrade path |
| 15 | Share sheet / Share extension | System share button from other apps | Start a flow with payload | Payload type unsupported; sandbox limits |
| 16 | Action extension | Markup / Photos editing | Advance — edit and return | Return-state payload shape |
| 17 | Document Provider / Files app | Pick from Files | Start with external document | iCloud download pending; permissions prompt |
| 18 | Keyboard extension (custom IME) | User selects keyboard | Advance — input helper | Full Access not granted → no network |
| 19 | internal | Tap PiP / leave app during video | Advance — continue consuming media | Background audio blocked; PiP dismissed on app termination |
| 20 | AirDrop | Receive share | Start flow with incoming payload | Contacts-only mode; payload incompatible |
| 21 | Handoff | Handoff banner on other device | Resume | State missing; unauthenticated target device |
| 22 | CarPlay scene | Plug in / wireless | Start a limited CarPlay flow | Template-only UI; no arbitrary views; voice-first expectation |
| 23 | iPad multitasking (Split View / Slide Over / Stage Manager) | Multi-window gestures | Flow spans multiple scenes / windows | Compact vs regular size class; external-display scene |
| 24 | Apple Pencil input | Scribble, handwriting, hover (iPad Pro M2+) | Advance — pen-first interaction | Hover not available on older Pencils; tool picker persistence |
| 25 | External keyboard / trackpad (iPad) | Pair + use | Advance — keyboard shortcuts, pointer hover | `.keyboardShortcut` coverage; pointer hover states |
| 26 | Background modes (push / fetch / audio / location) | internal | Support state outside the UI | iOS kill budget; BGAppRefreshTask throttling |
| 27 | App Store listing (subtitle, promo text, screenshots) | Pre-install discovery | Pre-flow: where the user decides to install | Screenshot not matching onboarding; A/B test mismatch |
| 28 | First-run onboarding / permission prompts | First launch | Start | Denied tracking / notifications / camera / location → recovery paths for each |
| 29 | Messages app extension / sticker pack | In iMessage | Advance — share in conversation | iMessage-only; recipient without extension |

---

## Android

Native dimensions: home widget cells 1x1 ~70dp up to 4x5; notification 40dp rows; quick settings tile square; app shortcut list of 4; bubble floating 60dp.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Launcher icon / app drawer | Tap | Start / resume | Cold launch; launcher icon adaptive-icon monochrome (Android 13+) |
| 2 | Home screen widget (resizable grid) | Tap interactive element | Surface state + start flow | Widget size classes 1x1..5x5; ConfigurationActivity failing |
| 3 | Quick Settings tile | Pull down, tap tile | Quick-action toggle or launch | Tile state out of sync; one-shot tiles |
| 4 | Notification (channel) | Push / local | Start / resume | Channel-level disable; notification not grouped correctly; heads-up suppressed |
| 5 | Notification action / reply | Reply inline, action button | Advance without opening | Broadcast receiver cold-start; direct-reply RemoteInput empty |
| 6 | Notification bubble (Android 11+) | User bubbles a conversation | Advance — floating conversation | Bubble permission denied; shortcut required |
| 7 | Notification shade persistent (foreground service) | Passive | Surface state for long-running tasks | Android 14 foreground service type enforcement; user dismisses service |
| 8 | Lock screen notification | Passive + tap | Start / resume after unlock | Secret / private / public visibility levels |
| 9 | Always-On Display / Ambient Display | Passive — shows notification icon | Surface state | Limited color palette; AOD mode variance across OEMs |
| 10 | Share sheet target | Receive share from other app | Start with payload | Shortcut pinning in share sheet; preview rendering |
| 11 | Deep link (App Link / intent filter) | Tap link | Start at deep location | Verified App Links failing → browser fallback; intent disambiguator |
| 12 | App shortcut — static / dynamic / pinned | Long-press icon; pinned to launcher | Start at sub-flow entry | Max 4 shown; shortcut disabled (user revoked, version upgrade) |
| 13 | Assistant / App Actions / Shortcuts | Google Assistant / manual | Headless start with params | BII (Built-in Intents) match failure; fulfillment fallback |
| 14 | Android Auto screen | Plug in / wireless | Limited driving-mode UI | Template catalogue only; voice input expected |
| 15 | Wear OS companion tile / notification | Passive | Surface state + tap to phone | Standalone vs tethered app |
| 16 | internal | auto on home button during video | Advance — media playback | PiP aspect-ratio constraint; only one PiP at a time |
| 17 | Multi-window / split-screen / foldable posture | System gesture | Flow adapts | Unfold / fold event; secondary display; Samsung Flex Mode |
| 18 | Universal input — Keyboard / IME integration | Soft/hard keyboard visible | Advance | IME adjusting layout; hardware keyboard shortcuts |
| 19 | Accessibility service (app's own, if any) | Enabled in Accessibility settings | Surface-wide overlay | Over-sensitive privacy warning; AccessibilityService kill |
| 20 | Settings slices (Slices API) | Settings / Assistant surfaces app slice | Surface state remotely | Slice provider permission; deprecated on newer OS tiers |
| 21 | Background work (WorkManager / AlarmManager / foreground service) | System schedule | Support state | Doze + App Standby buckets; exact-alarm permission (Android 12+) |
| 22 | Samsung Edge panel / OEM extensions | Swipe from edge | Quick-action entry | OEM-specific; not on all devices |
| 23 | Google Play Store listing + Play Instant | Pre-install discovery / instant-play | internal | Store A/B test; Play Instant 10MB base cap |
| 24 | First-run permission prompts | Install + open | Start | Denied POST_NOTIFICATIONS (Android 13+), location, camera, exact alarm, foreground service type |
| 25 | Live wallpaper | User sets app as wallpaper | Passive state surface | Limited touch events |

---

## Windows (10 / 11)

Native dimensions: main window 60–120 chars; toast 35–45 chars wide, 3 lines; taskbar jump-list ~12 items; system tray flyout 30–40 chars; widget small/medium/large similar to macOS.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Start menu (Pinned / Recommended / All apps) | Start / search / click | Start / resume | Pinned position lost on reset; Recommended privacy off |
| 2 | Taskbar — running icon | Click | Resume | Multiple windows merged / ungrouped; icon hidden in overflow |
| 3 | Taskbar — jump list | Right-click icon | Start sub-flow from recent / tasks | Jump list cleared by privacy setting; frequent vs recent drift |
| 4 | Taskbar — thumbnail preview | Hover | Surface state | Disabled by user; DWM composition off (rare) |
| 5 | System tray (notification area) | Click tray icon | Quick-action / status | Auto-hide behavior; icon missing after explorer restart; light/dark drift |
| 6 | Toast / Action Center notification | Push / local | Start at notification context | Focus Assist suppressing; user disabled channel; expiration |
| 7 | Widgets board (Windows 11) | Click widgets icon | Surface state; tap deep link | Widget permission; WebView2 runtime missing |
| 8 | Live Tile (Windows 10 legacy) | Passive | Surface state | Deprecated path on Win11 |
| 9 | File Explorer context menu / shell extension | Right-click file | Start flow from file | Win11 overflow "Show more options"; ext not registered |
| 10 | File Explorer cloud files / sync provider | Passive badges | Surface sync state | Hydration state (online-only vs always-available); sync conflict |
| 11 | Share target (Share contract) | Share button | Start with payload | UWP / packaged app requirement |
| 12 | Snap Layouts / Snap Groups (Windows 11) | Hover maximize, Win+Z | Window arrangement | App doesn't advertise snap layouts; too-small min size |
| 13 | Virtual desktops | Win+Tab | Resume on correct desktop | State drifting across desktops |
| 14 | Run / Command Palette (Win+R) | Power-user keyboard entry | Start by protocol / path | URI handler not registered |
| 15 | URI protocol handler | Link click from browser / another app | Deep entry | User denied "Always allow"; protocol hijacked by another app |
| 16 | Background Task / Windows Service | System schedule | Support state | Service stopped; permission elevation needed |
| 17 | Lock screen notifications | Passive | Surface state | Detailed vs brief status slot |
| 18 | Xbox Game Bar widget | Win+G | In-game quick actions | Only on gaming flows |
| 19 | Windows Hello / login-time behavior | User sign-in | Start after auth | Biometrics opt-out; passwordless fallback |
| 20 | Microsoft Store listing | internal | internal | Store cert; family-account restriction |
| 21 | Keyboard shortcuts (global + in-app) | Key press | Advance | Conflict with OS-reserved; accessibility layer |
| 22 | Drag-and-drop from Explorer / other apps | Drop payload | Start / advance | Async drop; multi-file drop with mixed types |

---

## Web — Desktop browser

Native dimensions: 1024–1600 wide typical; 60–100 chars for ASCII proxy.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Browser tab (title, favicon, unread in title) | Passive | Surface state | Title truncation; favicon 404 |
| 2 | Address bar / URL routing | Paste URL, back/forward | Start / resume at deep location | Direct-hit deep links without auth session; auth-redirect loops |
| 3 | SEO / social preview (OG tags) | Organic search / shared link | internal | OG cache stale; crawler-only content drift |
| 4 | Web Push notification | Post permission-grant, server push | Start at notification context | Permission denied / revoked; service worker unregistered |
| 5 | PWA install (desktop) | `beforeinstallprompt` | Transition to app-like surface | Criteria not met (no SW / manifest); installed but icon missing |
| 6 | PWA window controls overlay / standalone | Installed PWA launch | Start in app-shell mode | Title bar custom; light/dark theme-color |
| 7 | Web Share (navigator.share) | Click share | Advance / exit | Not supported in some desktop browsers (Chromium on Windows OK, Firefox partial) |
| 8 | Badging API | Passive | Surface unread count | Desktop-only, installed PWA only |
| 9 | File System Access API | User picks file/dir | Advance | User revokes permission mid-session |
| 10 | Clipboard API | User copies / pastes | Advance | Permissions for read; async clipboard |
| 11 | Drag-and-drop from OS | Drop payload | Start / advance | DataTransfer type fallback |
| 12 | Background Sync / Periodic Sync | internal | Support state | Chromium-only; site engagement threshold |
| 13 | Service worker offline shell | Passive | Surface offline state | Cache outdated; update-available banner |
| 14 | OAuth redirect / popup | Auth provider return | Advance past auth gate | Popup blocked; state param mismatch |
| 15 | Embedded iframe / widget (third-party site) | Parent page loads | Start as a child surface | Sandbox attributes; postMessage origin mismatch |
| 16 | Browser extension (if product ships one) | User installs extension | Start / advance | Manifest V3 service-worker suspension; host permissions |
| 17 | Right-click context menu (custom) | internal | Advance — in-page menu | Conflict with browser default menu; long-press on touch laptops |
| 18 | Keyboard shortcuts in-app | Key press | Advance | OS/browser shortcut collision; screen-reader mode |

---

## Web — Mobile browser

Mobile-specific surfaces that desktop web doesn't have.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Add to Home Screen (iOS Safari, Android Chrome) | User-initiated share menu | Transition to PWA surface | iOS Safari criteria differ; splash screen mismatch |
| 2 | Installed PWA (standalone) | Tap home icon | Start app-shell | iOS Safari state loss on background kill |
| 3 | internal | Swipe at top | Advance — refresh state | Conflict with custom scroll containers |
| 4 | Back button (Android hardware / gesture) | System back | Retreat | History-API misuse → trapped user |
| 5 | Touch gestures (swipe, long-press, pinch) | Finger input | Advance | Gesture conflict with browser; accessibility large-touch |
| 6 | Safe area insets (notch / home indicator) | Passive layout | Layout only | `env(safe-area-inset-*)` missing; landscape rotation |
| 7 | Web Push (iOS 16.4+ installed PWA; Android Chrome) | Permission + push | Start at notification | iOS only when PWA installed |
| 8 | Mobile Share API | Share button | Advance / exit | Widely supported on mobile |
| 9 | Mobile viewport / orientation change | Rotate | Layout re-flow | Keyboard open viewport shrink; dynamic viewport units |

---

## watchOS

Native dimensions: 41mm ~176pt, 45mm ~198pt, 49mm Ultra ~205pt. Glanceable-first.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Complication (watch face) | Tap / glance | Start — deep link into app | Family variance (corner, circular, rectangular, modular); refresh budget |
| 2 | Smart Stack widget | Relevance-based surfacing | Surface state | Relevance signals wrong → not surfaced |
| 3 | App launcher (honeycomb / list) | User opens | Start | Rarely used; most entry via complication |
| 4 | Notification (short look / long look) | Push | Start at notification | Short-look custom UI; long-look fallback layout |
| 5 | Digital Crown input | Rotate in-app | Advance | Focus + crown binding misroute |
| 6 | Force touch (deprecated) / Action button (Ultra) | Press | internal | Device-specific; programmable for Ultra only |
| 7 | Workout / Activity / HealthKit | Passive sensor-driven | Support state | HealthKit permission denied; background workout session limits |
| 8 | Siri watch face slot | Relevance | Surface actionable entry | Donation pattern required |

---

## tvOS

Focus-based nav. 1920x1080 or 4K; safe-area padding critical.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Top Shelf (home-screen expansion) | Hover app icon on home | Pre-flow preview | Data stale; per-user personalization; content rating |
| 2 | Focus engine navigation | D-pad / remote swipe | Advance | Missing focusable element; focus trap; parallax icon off |
| 3 | Siri Remote search | Voice / type | Start at search result | Voice recognition failure; privacy mode |
| 4 | Universal Search | Apple TV OS-wide search | Pre-flow entry to app content | Indexed activities out of date |
| 5 | Profiles / family Apple ID | Switch account | Restart state-per-user | Profile change mid-flow |

---

## visionOS

Spatial: windows, volumes, immersive spaces. Input: eye + hand + voice.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Window (2D floating) | Open from Home View | Start / resume | Multi-window orchestration; tab-bar vs ornament |
| 2 | Volume (3D object in shared space) | Open volumetric scene | Advance — 3D interaction | Scale limits; collision with another app's content |
| 3 | Immersive space (full / mixed / progressive) | User enters immersive mode | Start — full immersion | Boundary guardian; user leaves immersion unexpectedly |
| 4 | Ornaments (toolbars attached to windows) | Passive | Advance — controls | Ornament occlusion in stereo |
| 5 | Eye + tap input | Look + pinch | Advance | Accessibility alternate input; gaze drift |
| 6 | Hand tracking gestures | Hand in view | Advance | Out-of-view tracking loss; gesture disambiguation |
| 7 | Sharing to another Vision Pro (SharePlay spatial) | Invite | Multi-user advance | State-sync drift |

---

## CarPlay / Android Auto

Template-based, voice-first, heavily restricted.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | CarPlay scene (template categories: audio, messaging, navigation, parking, quick-food, EV charging, driving task) | Plug in / wireless | Start — limited-template flow | Not allowed to render custom views; 20s task-complexity caps |
| 2 | CarPlay Dashboard widget | Dashboard space | Surface state | Limited height; only for certain categories |
| 3 | Android Auto templates (message, media, navigation, POI) | Connect | Start — template flow | Same template categories restriction |
| 4 | Voice intent fulfillment in car | Siri / Assistant | Headless advance | Driving-mode UX: no text input; confirmation via voice |

---

## Linux (GNOME / KDE / Electron-style apps)

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Applications menu (.desktop file) | User launches | Start |.desktop file missing `Exec=` / `Icon=`; Flatpak / Snap confinement |
| 2 | System tray / AppIndicator / StatusNotifier | Click tray icon | internal | GNOME needs extension for tray; KDE native |
| 3 | Desktop notifications (libnotify / D-Bus) | Push | Start / resume | User disabled notifications; persistence varies per DE |
| 4 | DBus services / intents | Other apps call via DBus | Headless start | DBus name collision; sandbox blocks DBus (Flatpak) |
| 5 | Global menu (GNOME / KDE Plasma with Unity stub) | Top bar | Advance | Not universally supported |
| 6 | Keyboard shortcuts | Key press | Advance | DE-level shortcut collisions; Wayland vs X11 permissions |
| 7 | Drag-and-drop via Nautilus / Dolphin | Drop payload | Start / advance | Wayland portal for cross-app DnD |

---

## Cross-platform channels

Not a platform — channels the product may reach across any OS.

| # | Surface | Entry triggers | Typical flow role | Edge states |
|---|---------|---------------|-------------------|-------------|
| 1 | Email (transactional / magic link / notification digest) | Open email, click CTA | Start / resume | Deep link fallback for desktop / mobile; expired link; email in spam |
| 2 | SMS (2FA, transactional alerts) | Receive SMS | Start / advance | Carrier filtering; country format |
| 3 | Push notification (unified abstraction across iOS / Android / web / desktop) | Server push | Start / advance | Per-platform permission / delivery diffs; silent push |
| 4 | In-app messaging (via the product's own channels) | internal | Advance | Rate limiting; channel overlap |
| 5 | Third-party chat integrations (Slack, Teams, Discord bot) | Chat message | Start / advance | Bot DM scope; organizational policies |
| 6 | Calendar invite / ICS attachment | Open in calendar | Advance | Calendar mismatch with email account |
| 7 | System clipboard (across apps on same device) | Paste | Advance | Paste permission on iOS/iPadOS, web focus requirement |
| 8 | OS-level "share with contacts" | Share sheet | Advance | Contacts sync required |

---

## Using this catalog at the interview

Required prompts at Step 0 — the orchestrator must answer **all four** before dispatching Layer 1:

1. **Target platforms** — pick one or more from: macOS · iOS · iPadOS · Android · Windows · web-desktop · web-mobile · watchOS · tvOS · visionOS · CarPlay · Android Auto · Linux. *"Cross-platform"* is not an acceptable answer — list every platform it ships on.
2. **Per-platform surfaces in scope** — for each selected platform, pick every surface from the catalog that will carry this flow. Surfaces not picked are explicitly out of scope.
3. **Cross-platform channels in scope** — pick any channel from the Cross-platform table that the flow uses (email, SMS, push, calendar, etc.).
4. **Primary surface per platform** — which one surface is the flow's main entry on that platform (used to pick the default wireframe size).

Record the answers in the artifact's "Target Platforms & Surfaces" matrix. If the user says "all surfaces" or similar, push back — the enumeration exists because a flow that tries to occupy every surface fails all of them.

---

## Reference notes

- iOS / iPadOS surfaces follow Apple's developer docs for widgets, Live Activities, App Intents, App Clips, extensions, Focus filters. Exact APIs change per major OS — verify for the target minimum OS version when the flow is implemented.
- Android surfaces follow AOSP and Jetpack docs; OEM-specific surfaces (Samsung Edge, Xiaomi MIUI controls) are flagged but not universal.
- macOS NSStatusItem / menu-bar-extra guidance assumes modern SwiftUI `MenuBarExtra` (macOS 13+) or AppKit NSStatusItem.
- Windows UWP / Win32 / packaged-MSIX paths differ — the "Share target" and some widget/tile surfaces require packaged identity.
- When in doubt about an API, fetch current docs via Context7 rather than memorizing signatures.
