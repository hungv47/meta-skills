# User Experience & Design

## 14. Visual Hierarchy F-Pattern

**Rule**: Eyes scan in F-shape pattern

### The F-Pattern

Users scan web pages in an F-shaped pattern:
1. **First horizontal line**: Top of the page (headline area)
2. **Second horizontal line**: Slightly below (subheadline)
3. **Vertical line**: Left side of the page (scanning down)

### Optimization Strategy

- Put conversions in the natural reading path
- Optimize for natural scanning patterns
- Guide eyes to CTAs strategically
- Important elements in top-left and left side
- Use visual weight to direct attention

### F-Pattern Optimization Checklist

- [ ] Headline placed in top-left (first horizontal scan)
- [ ] Subheadline directly below headline (second horizontal scan)
- [ ] CTA on left side (vertical scan path)
- [ ] Key benefits listed along left margin
- [ ] Visual elements support (not disrupt) the pattern
- [ ] Secondary CTAs lower on the page

### Visual Weight Tools

- **Size**: Larger elements draw attention first
- **Color**: Contrasting colors stand out
- **Contrast**: High contrast = high attention
- **Whitespace**: Isolated elements command focus
- **Images**: Faces and directional cues guide eyes

---

## 15. Mobile Thumb Zone

**Rule**: CTAs where thumbs naturally rest

### Thumb Zone Mapping

Mobile screens have three zones:
1. **Easy zone** (bottom center): Most accessible
2. **OK zone** (sides, middle): Reachable with stretch
3. **Hard zone** (top, corners): Requires grip adjustment

### Mobile Optimization Rules

- No stretching required for primary CTA
- Primary CTA in easy thumb reach (bottom center)
- Consider right-handed majority (slight right bias)
- Test on actual devices, not just responsive views

### Mobile Optimization Checklist

- [ ] CTA buttons minimum 44x44px (Apple HIG standard)
- [ ] Adequate spacing between clickable elements (8px minimum)
- [ ] Forms optimized for mobile keyboards (correct input types)
- [ ] Text readable without zooming (16px minimum)
- [ ] Fast load time on mobile networks (under 3 seconds)
- [ ] Sticky CTA for long pages
- [ ] Touch targets don't overlap

### Mobile Form Optimization

```html
<!-- Use appropriate input types -->
<input type="email"> <!-- Shows email keyboard -->
<input type="tel"> <!-- Shows number pad -->
<input type="url"> <!-- Shows URL keyboard -->
```

### Mobile-Specific Considerations

- 60%+ of traffic is mobile
- Scrolling is natural (don't fear long pages)
- Tap targets need generous sizing
- Avoid hover-dependent interactions
- Test on multiple device sizes

---

## 16. White Space = Focus

**Rule**: Empty space makes CTAs impossible to miss

### Why White Space Works

- Crowded layouts confuse users
- White space creates visual hierarchy
- Isolated elements command attention
- Reduces cognitive load
- Increases perceived value

### Strategic White Space Usage

- Group related elements together
- Separate sections with breathing room
- Generous padding around CTAs
- Clear separation of content blocks
- Focus on one element at a time

### White Space Checklist

- [ ] Generous padding around CTAs (40px+ on all sides)
- [ ] Clear space between sections (60-100px)
- [ ] Line height 1.5-1.7 for readability
- [ ] Margins on content containers
- [ ] No cluttered areas competing for attention
- [ ] Hero section has breathing room

### White Space Anti-Patterns

❌ Elements touching with no padding
❌ Multiple CTAs crowded together
❌ Text blocks with tight line spacing
❌ Sidebar distractions near CTA
❌ Background patterns that reduce contrast

### Spacing Guidelines

| Element | Minimum Spacing |
|---------|-----------------|
| CTA button padding | 40px all sides |
| Section breaks | 60-100px |
| Paragraph spacing | 1em |
| Line height | 1.5-1.7 |
| Form field spacing | 20px |

---

## Page Load Performance

**Rule**: Every second of delay costs 7% conversions

### Speed Requirements

- Load time under 3 seconds (ideally under 2)
- First contentful paint under 1.5 seconds
- Time to interactive under 3 seconds

### Speed Optimization Checklist

- [ ] Compress and optimize images (WebP format)
- [ ] Minimize HTTP requests
- [ ] Enable browser caching
- [ ] Use CDN for assets
- [ ] Minify CSS and JavaScript
- [ ] Lazy load below-fold images
- [ ] Remove unused code and plugins

### Testing Tools

- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse (Chrome DevTools)

---

## Accessibility Considerations

Accessible design improves conversions for everyone:

- [ ] Color contrast meets WCAG AA standards
- [ ] Form labels clearly associated with inputs
- [ ] Error messages are clear and helpful
- [ ] Focus states visible for keyboard users
- [ ] Alt text on meaningful images
- [ ] Logical heading hierarchy (H1, H2, H3)

---

## Signup Flow Optimization

Signup flows are a special case of landing page conversion — the form IS the page. These rules apply to any signup, registration, or account creation flow.

### Progressive Profiling

Ask only what you need at signup. Defer everything else.

| Step | Ask For | Why |
|------|---------|-----|
| Signup | Email only (or email + password) | Minimize friction at highest-dropout point |
| Onboarding | Name, role | Needed to personalize experience |
| First value moment | Company, team size | Needed for product configuration |
| third-party cohort | Everything else | User is now invested |

**The 3-Field Threshold:** More than 3 visible fields at signup → must use progressive profiling (multi-step) or progressive disclosure.

**Field cost quantification:**

| Field Count | Conversion Impact |
|-------------|------------------|
| 1-3 fields | Baseline (optimal) |
| 4-6 fields | 10-25% reduction |
| 7+ fields | 25-50%+ reduction |

Each additional field above 3 costs approximately 5-10% conversion. Use this data when stakeholders push for more fields — the cost is quantifiable, not just "best practice."

**Field-level analytics** (essential, not optional):
- Track completion rate per field (where do people abandon?)
- Track error rate per field (which fields cause the most mistakes?)
- Track time per field (which fields slow people down?)

These three metrics pinpoint exactly which field to fix or remove — without them, form optimization is guesswork.

### Value-First Principle

Show product value before asking for account creation. The user should understand what they get before they give anything.

**Pattern:**
1. Let them see/try the product (demo, preview, free tool)
2. Hit a value moment ("Your report is ready")
3. Gate the value ("Create an account to download")

Anti-pattern: Leading with a registration wall before the user understands the product.

### Signup Form UX Rules

- **Don't clear form fields on error** — preserve user input, highlight only the field that failed
- **Inline validation** — validate as the user moves between fields, not on submit
- **Specific error messages** — "Password must be 8+ characters" not "Invalid password"
- **Show password toggle** — reduces password errors by 75%
- **Auto-focus first field** on page load
- **Disable submit button** until required fields are valid (with clear indication of what's missing)

### Social Auth Placement

- Place social auth buttons (Google, Microsoft, SSO) **above** the email/password form
- For B2B: Google and Microsoft sign-in should be prominent (most companies use these)
- Label: "Continue with Google" not "Sign up with Google" (lower commitment language)
- Show a clear "OR" divider between social auth and email form

### Mobile Signup Specs

- [ ] All touch targets ≥44px height
- [ ] Appropriate keyboard types (`type="email"` for email, `type="tel"` for phone)
- [ ] Single-column layout (no side-by-side fields on mobile)
- [ ] Sticky CTA button at bottom of viewport for long forms
- [ ] Auto-capitalize off for email fields
- [ ] Input padding ≥12px for comfortable tapping
