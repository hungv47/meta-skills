<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Component Patterns Reference

Patterns that work. Each pattern specifies which semantic tokens it consumes, so every component stays connected to the design system.

## Token Consumption Map

Quick reference: which semantic tokens each component type uses.

| Component | Background | Foreground | Border | Other |
|-----------|-----------|-----------|--------|-------|
| Page | `--background` | `--foreground` | — | — |
| Card | `--card` | `--card-foreground` | `--border` | `--radius` |
| Button (primary) | `--primary` | `--primary-foreground` | — | `--radius`, `--ring` |
| Button (secondary) | `--secondary` | `--secondary-foreground` | — | `--radius` |
| Button (destructive) | `--destructive` | `--destructive-foreground` | — | `--radius` |
| Button (outline) | `--background` | `--foreground` | `--input` | `--radius`, `--accent` (hover) |
| Button (ghost) | transparent | `--foreground` | — | `--accent` (hover) |
| Input | `--background` | `--foreground` | `--input` | `--ring` (focus), `--radius` |
| Select/Dropdown | `--popover` | `--popover-foreground` | `--border` | `--radius` |
| Badge (default) | `--primary` | `--primary-foreground` | — | `--radius` |
| Badge (secondary) | `--secondary` | `--secondary-foreground` | — | `--radius` |
| Badge (outline) | transparent | `--foreground` | `--border` | `--radius` |
| Alert | `--background` | `--foreground` | `--border` | `--radius` |
| Toast | `--background` | `--foreground` | `--border` | `--radius` |
| Dialog | `--background` | `--foreground` | `--border` | `--radius` |
| Popover | `--popover` | `--popover-foreground` | `--border` | `--radius` |
| Sidebar | `--sidebar` | `--sidebar-foreground` | `--sidebar-border` | sidebar tokens |
| Table row (hover) | `--muted` | `--foreground` | `--border` | — |
| Muted text | — | `--muted-foreground` | — | — |
| Placeholder | — | `--muted-foreground` | — | — |
| Disabled state | `--muted` | `--muted-foreground` | — | opacity: 0.5 |

## Navigation Patterns

### Top Navigation Bar
**When**: Marketing sites, dashboards, most web apps
**Structure**: Logo left, nav center or right, CTAs far right
**Tokens**: bg-background, text-foreground, border-b border-border
**Mobile**: Hamburger menu or bottom nav

### Side Navigation
**When**: Complex apps with many sections, admin panels
**Collapsed width**: 64px (icons only)
**Expanded width**: 240-280px
**Tokens**: bg-sidebar, text-sidebar-foreground, border-r sidebar-border
**Active item**: bg-sidebar-primary text-sidebar-primary-foreground
**Hover item**: bg-sidebar-accent text-sidebar-accent-foreground
**Mobile**: Slide-out drawer

### Bottom Tab Bar (Mobile)
**When**: Mobile apps with 3-5 primary destinations
**Max items**: 5 (4 is safer)
**Active state**: Filled icon + label, text-primary
**Inactive**: Outline icon, text-muted-foreground

### Breadcrumbs
**When**: Deep hierarchies, e-commerce categories
**Separator**: / or > or chevron
**Tokens**: text-muted-foreground for inactive, text-foreground for current
**Truncation**: Show first, last, and ellipsis for middle

## Card Patterns

### Content Card
**Purpose**: Display preview of content, clickable to detail
**Tokens**: bg-card text-card-foreground border rounded-[var(--radius)]
**Elements**: Image (optional), title, description (text-muted-foreground), metadata, action
**Sizing**: Consistent height in grids, variable in lists

### Action Card
**Purpose**: Present choice or entry point
**Tokens**: bg-card text-card-foreground, hover bg-accent
**Elements**: Icon or illustration, title, brief description, CTA
**Interaction**: Entire card clickable or specific CTA

### Stats Card
**Purpose**: Display key metrics
**Elements**: Label (text-muted-foreground), large number (text-card-foreground font-bold), trend indicator, comparison
**Layout**: Number prominent, context secondary

### Profile Card
**Purpose**: Display person or entity info
**Elements**: Avatar, name, role (text-muted-foreground), actions
**Variants**: Horizontal (list), vertical (grid)

## Form Patterns

### Single Column Forms
**When**: Most cases. Faster completion, fewer errors.
**Field width**: Match expected input length
**Labels**: Top-aligned for efficiency, text-sm font-medium text-foreground

### Multi-Column Forms
**When**: Related fields that belong together (first/last name, city/state/zip)
**Caution**: Don't create arbitrary columns. Increases cognitive load.

### Input States

```
INPUT STATE MAP
---------------
Default: border-input bg-background text-foreground
Focus: ring-2 ring-ring ring-offset-2 ring-offset-background
Hover: border with slightly increased contrast
Disabled: bg-muted text-muted-foreground opacity-50 cursor-not-allowed
Error: border-destructive text-destructive (for message)
Success: border-green-500 (optional checkmark)
```

### Inline Validation
**Trigger**: On blur (not on every keystroke)
**Success**: Subtle checkmark or green border
**Error**: border-destructive + descriptive message below (text-xs text-destructive)
**Position**: Message directly below the field

### Progressive Disclosure
**When**: Complex forms with conditional fields
**Pattern**: Show fields only when relevant based on previous answers

## Modal & Dialog Patterns

### Confirmation Dialog
**Purpose**: Confirm destructive or important actions
**Tokens**: bg-background text-foreground border rounded-[var(--radius)]
**Structure**: Title, brief description (text-muted-foreground), Cancel (left, secondary), Confirm (right)
**Confirm button**: Matches action severity — bg-destructive for delete, bg-primary for confirm
**Overlay**: bg-black/80 (dark scrim)

### Information Modal
**Purpose**: Display detailed info without leaving context
**Max width**: 600px for content-focused
**Close**: X button top-right + click outside
**Tokens**: bg-background, overlay bg-black/80

### Form Modal
**Purpose**: Quick data entry without full page navigation
**Max width**: 480-560px
**Submission**: Clear primary CTA (bg-primary), Cancel as ghost button

### Full-Screen Modal
**When**: Complex multi-step processes, mobile
**Close**: Always visible, top-left or top-right
**Progress**: Show steps if multi-stage

## List Patterns

### Simple List
**Elements**: Title, optional secondary text (text-muted-foreground)
**Interaction**: Tap/click entire row
**Dividers**: border-border, subtle or none
**Hover**: bg-accent

### Complex List Item
**Elements**: Avatar/icon, title, description (text-muted-foreground), metadata, actions
**Actions**: Inline buttons (ghost/outline variants) or overflow menu
**Swipe actions**: Mobile-only, reveal on swipe

### Data Table
**When**: Comparing multiple items with many attributes
**Header**: text-muted-foreground font-medium, bg-muted
**Sorting**: Click column header
**Selection**: Checkbox column if bulk actions needed
**Row hover**: bg-muted
**Pagination**: Bottom, show current range and total
**Borders**: border-border between rows

## Empty States

**Purpose**: Guide users when content doesn't exist yet

**Structure**:
1. Illustration or icon (text-muted-foreground)
2. Headline explaining the state (text-foreground font-semibold)
3. Brief description (text-muted-foreground text-sm)
4. Primary CTA to resolve (bg-primary text-primary-foreground)

**Tone**: Helpful, not apologetic. Don't say "Sorry, nothing here."

## Loading States

### Skeleton Screens
**When**: Initial page load, content-heavy areas
**Pattern**: bg-muted shapes matching content layout
**Animation**: Subtle shimmer or pulse, respects prefers-reduced-motion
**Radius**: Match the component's border radius

### Inline Spinners
**When**: Button actions, small updates
**Size**: Proportional to context
**Position**: Replace button text or icon
**Color**: Matches the button's foreground token

### Progress Bars
**When**: Uploads, long processes with measurable progress
**Track**: bg-muted
**Fill**: bg-primary
**Show percentage**: Only if accurate

### Full-Screen Loaders
**When**: Critical blocking processes (payment processing)
**Caution**: Use sparingly. Most loads shouldn't block everything.

## Feedback Patterns

### Toast Notifications
**When**: Non-critical feedback that doesn't require action
**Duration**: 3-5 seconds, auto-dismiss
**Position**: Top-right (web) or bottom (mobile)
**Tokens**: bg-background text-foreground border rounded-[var(--radius)]
**Actions**: Optional dismiss or single action (text-primary)
**Variants**: Default, success (with green icon), error (with red icon), warning

### Alert Banners
**When**: Persistent information affecting the experience
**Position**: Top of content area
**Tokens**: bg-background text-foreground border-l-4
**Severity border**: border-l-primary (info), border-l-destructive (error), border-l-yellow-500 (warning)
**Dismissible**: Sometimes (informational yes, critical no)

### Inline Feedback
**When**: Direct response to specific action
**Position**: Near the action that triggered it
**Success**: text-green-600, check icon
**Error**: text-destructive, alert icon

## Onboarding Patterns

### Welcome Modal
**When**: First-time users
**Content**: Value proposition + primary first action
**Tokens**: Standard dialog tokens
**Skip option**: Always available (ghost button)

### Tooltip Tour
**When**: Explaining complex UI on first use
**Rules**: Max 5 steps, clear progress, easy exit
**Tokens**: bg-popover text-popover-foreground
**Trigger**: Auto on first visit or user-initiated help

### Progressive Onboarding
**When**: Complex products with learning curve
**Pattern**: Reveal features as user demonstrates readiness
**Avoid**: Overwhelming new users with everything at once

### Empty State Guidance
**When**: User lands on feature with no data
**Pattern**: Explain benefit + single clear CTA (bg-primary)

## Error Patterns

### Inline Field Errors
**Position**: Below the field
**Tokens**: text-destructive text-xs
**Content**: Specific, actionable (not just "Invalid input")
**Timing**: On blur or submit, never during typing
**Icon**: Optional small alert icon before text

### Page-Level Errors
**When**: Something went wrong affecting the whole page
**Tokens**: bg-destructive/10 text-destructive border-destructive
**Pattern**: Clear message + recovery action (bg-primary button)
**Avoid**: Technical jargon, error codes alone

### 404 / Not Found
**Elements**: Clear message, search option, link to home (text-primary)
**Tone**: Helpful, light (can be playful)

### Server Error (500)
**Elements**: Apologetic message, try again option (bg-primary), support contact
**Tone**: Serious but reassuring

## Mobile-Specific Patterns

### Pull to Refresh
**When**: Lists that update frequently
**Indicator**: Spinner at top (text-muted-foreground)
**Haptics**: Subtle feedback on trigger

### Infinite Scroll
**When**: Content feeds, search results
**Trigger**: Near bottom of viewport
**Loading**: Skeleton items at bottom
**End state**: Clear "end of list" indicator (text-muted-foreground text-sm)

### Swipe Actions
**When**: Common actions on list items
**Direction**: Right for positive (archive), left for destructive (delete)
**Destructive swipe**: bg-destructive text-destructive-foreground
**Positive swipe**: bg-primary text-primary-foreground
**Confirmation**: Required for destructive actions

### Bottom Sheets
**When**: Actions or filters in context
**Tokens**: bg-background text-foreground rounded-t-[var(--radius)]
**Heights**: Snap to partial and full
**Handle**: bg-muted w-10 h-1 rounded-full (drag indicator)
**Dismiss**: Swipe down or tap scrim (bg-black/80)
