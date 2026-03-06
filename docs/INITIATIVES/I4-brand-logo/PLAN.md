# I4 — Brand Logo: Implementation Plan

## Tasks

### Design exploration
- [x] Review product principles and vocabulary in README.md
- [x] Explore visual metaphors for "compounding knowledge"
- [x] Sketch 3-5 logo concepts aligned with design principles
- [x] Select one concept for refinement

### Asset creation
- [x] Create icon/mark SVG (optimized, accessible)
- [x] Create wordmark SVG (proper text rendering)
- [x] Create full logo SVG (icon + wordmark lockup)
- [x] Create grayscale/neutral variants
- [x] Create dark mode variants
- [x] Create monochrome variants

### Favicon generation
- [x] Generate favicon.ico (multi-size)
- [x] Generate favicon-16x16.png
- [x] Generate favicon-32x32.png
- [x] Generate apple-touch-icon.png (180x180)
- [x] Update index.html with favicon links

### Integration
- [x] Add logo assets to `/public/logo/` directory
- [x] Integrate full logo in application header/ViewSwitcher
- [x] Test dark mode variants
- [x] Verify logo renders correctly at different sizes
- [x] Update page title/meta if needed

### Documentation
- [x] Create LOGO_USAGE.md with guidelines
- [x] Document which variant to use when
- [x] Provide export sizing recommendations
- [x] Add logo file naming convention
- [x] Update main README with logo if appropriate

## Decisions

**Logo concept: Three stacked layers**
Chose a visual metaphor of three stacked, translucent layers to represent knowledge compounding over time. Each layer represents a stage: foundation knowledge (bottom), accumulated understanding (middle), and current active work (top). Vertical connection lines suggest addressability and linkage—aligned with Compound's document-first, reference-based architecture.

**Grayscale-only palette**
Staying true to the "calm clarity" principle, the logo uses only grayscale values with varying opacity. This ensures it works in any context without color conflicts and feels at home in an editor-first environment.

**SVG-first approach**
Created all assets as SVG for scalability, small file sizes, and easy theming. This aligns with modern web practices and ensures the logo looks crisp at any size.

**Reusable Header component**
Created a Header component that includes the logo and can be reused across views (Exploration, Spec). This ensures consistent branding without duplication.

## Risks

**Risk: Logo feels generic or disconnected from product**
Mitigation: Ground all design exploration in product principles from README.md. Test logo against the "One-Line Truth" — does it visually support "Exploration owns the knowledge. The Spec states the position. Compound keeps them aligned"?

**Risk: Logo doesn't scale well to small sizes (favicon)**
**March 6, 2026:** Logo system implemented and integrated
- Created logo concept: three stacked layers representing knowledge compounding
- Generated all SVG assets (icon, wordmark, full logo) with light/dark variants
- Created optimized favicon.svg for small sizes
- Updated index.html with new favicon and improved page title
- Created reusable Header component with logo integration
- Integrated logo in ExplorationView and SpecView headers
- Updated ViewSwitcher to show logo and brand name
- Created comprehensive LOGO_USAGE.md documentation
- Created preview.html for visual testing
- All acceptance criteria met ✓t favicon at 16x16 early in process.

**Risk: Wordmark typography conflicts with app typography**
Mitigation: Either use app's font (simple) or ensure wordmark font is tonally aligned. Prefer grayscale-neutral to avoid color conflicts.

**Risk: Over-engineering the logo system**
Mitigation: Start minimal. One icon, one wordmark, grayscale + dark mode. Additional variants only if genuinely needed.

## Progress notes

[Daily/weekly progress updates, blockers encountered, solutions found]

## Done when

- Logo is visible in the application header
- All required asset files are in `/public/logo/` with clear naming
- Favicon appears correctly in browser tabs
- LOGO_USAGE.md provides clear guidance on variant usage
- Logo visually aligns with product principles (calm clarity, document-first)
- All acceptance criteria from README are met
