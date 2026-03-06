# Compound Logo Usage Guidelines

This document provides guidance on when and how to use the Compound logo system.

## Logo Assets

All logo files are located in `/public/logo/`:

### Icon/Mark
- `icon.svg` — Standalone symbol (light mode)
- `icon-dark.svg` — Standalone symbol (dark mode)
- Use when: Limited space, favicon, or when the wordmark is redundant

### Wordmark
- `wordmark.svg` — Text treatment (light mode)
- `wordmark-dark.svg` — Text treatment (dark mode)
- Use when: Horizontal space available, emphasizing brand name

### Full Logo
- `full-logo.svg` — Icon + wordmark lockup (light mode)
- `full-logo-dark.svg` — Icon + wordmark lockup (dark mode)
- Use when: Maximum brand visibility needed (marketing, headers, landing pages)

### Favicon
- `/public/favicon.svg` — Optimized for small sizes (16x16 to 32x32)

## Design Concept

The Compound logo represents **knowledge compounding over time** through three stacked layers:

- **Bottom layer (lightest):** Foundation knowledge
- **Middle layer (medium):** Accumulated understanding  
- **Top layer (darkest):** Current, active work

The vertical connection lines suggest addressability and linkage between layers—reflecting Compound's document-first, reference-based architecture where knowledge nodes build on each other.

## Usage Rules

### When to Use Which Variant

**Icon/Mark:**
- Application UI (headers, navigation)
- Favicons and app icons
- Social media profile images
- Anywhere space is limited (<100px width)

**Wordmark:**
- Marketing copy and documentation
- Footer attribution
- When brand recognition through text is important

**Full Logo:**
- Application launch screens
- Marketing materials and presentations
- Documentation headers
- First-time user experiences

### Light vs. Dark Mode

- Use `-dark` variants on dark backgrounds (#1a1a1a or darker)
- Use standard variants on light backgrounds (#ffffff or lighter)
- Test contrast: logo should be clearly visible without overwhelming the interface

## Sizing Recommendations

### Minimum Sizes
- **Icon:** 16x16px (favicon)
- **Full logo:** 240px width
- **Wordmark:** 180px width

### Optimal Sizes
- **App header icon:** 32x32px or 40x40px
- **Full logo (hero/marketing):** 320px width
- **Documentation header:** 240-280px width

## Color Palette

The logo uses grayscale values aligned with Compound's calm, neutral aesthetic:

**Light mode:**
- Top layer: `#404040`
- Middle layer: `#404040` at 70% opacity
- Bottom layer: `#404040` at 40% opacity
- Connections: `#404040` at 30%/20% opacity

**Dark mode:**
- Top layer: `#E5E5E5`
- Middle layer: `#CCCCCC` at 70% opacity
- Bottom layer: `#CCCCCC` at 40% opacity
- Connections: `#E5E5E5` at 30%/20% opacity

## What NOT to Do

❌ Don't add drop shadows or effects
❌ Don't rotate or distort the logo
❌ Don't change the layer opacity values
❌ Don't add colors (keep grayscale)
❌ Don't place on busy backgrounds without adequate contrast
❌ Don't use wordmark fonts for body copy (it's display only)

## File Naming Convention

All logo files follow this pattern:
```
{type}[-variant].svg
```

Examples:
- `icon.svg` (default/light)
- `icon-dark.svg` (dark mode variant)
- `full-logo.svg` (default/light)
- `wordmark-dark.svg` (dark mode variant)

## Integration Examples

### React Component (Icon)
```tsx
<img 
  src="/logo/icon.svg" 
  alt="Compound" 
  className="w-8 h-8"
/>
```

### Header with Full Logo
```tsx
<Header 
  title="Exploration"
  subtitle="Workbench for thinking"
  showLogo={true}
/>
```

### Favicon in HTML
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

## Updates and Modifications

If the logo needs updating:
1. Edit the SVG files directly in `/public/logo/`
2. Maintain the three-layer stacked concept
3. Preserve grayscale palette
4. Test at 16x16px (favicon size)
5. Update this document with any new usage rules

---

**Questions or issues?** See the initiative docs at `docs/INITIATIVES/I4-brand-logo/`
