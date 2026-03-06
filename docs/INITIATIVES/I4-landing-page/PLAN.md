# I4 Implementation Plan

Implementation plan for adding a landing page to the Compound app with React Router.

---

## Tasks

### Phase 1: Routing Setup
- [ ] Install `react-router-dom` dependency
- [ ] Create `src/routes.tsx` with route configuration
- [ ] Create `src/pages/LandingPage.tsx` (landing route component)
- [ ] Create `src/pages/WorkspacePage.tsx` (wraps existing App logic)
- [ ] Update `src/main.tsx` to wrap app with `RouterProvider`
- [ ] Update `src/App.tsx` to handle routing structure
- [ ] Test navigation: `/` → `/app` and back
- [ ] Verify existing functionality works at `/app`

### Phase 2: Verify No Regressions
- [ ] Test ExplorationView renders correctly at `/app`
- [ ] Test SpecView renders correctly at `/app`
- [ ] Verify all Zustand stores hydrate from IndexedDB
- [ ] Test keyboard shortcuts still work in workspace
- [ ] Test ThreadPanel opens/closes correctly
- [ ] Verify node editing, lifting, folding all work
- [ ] Test ViewSwitcher between Exploration and Spec
- [ ] Document any breaking changes (should be zero)

### Phase 3: Landing Nav Component
- [ ] Create `src/components/landing/LandingNav.tsx`
- [ ] Add "Compound" logo text (left side)
- [ ] Add nav links: Features, Concepts, GitHub
- [ ] Add dual CTAs: "Get Started" (solid) → `/app`, "View on GitHub" (ghost)
- [ ] Implement mobile Sheet hamburger menu
- [ ] Add scroll detection for frosted glass effect
- [ ] Test responsive behavior at all breakpoints
- [ ] Add keyboard navigation support
- [ ] Ensure ARIA labels for accessibility

### Phase 4: Hero Section
- [ ] Create `src/components/landing/Hero.tsx`
- [ ] Write headline: reference README "Product North Star"
- [ ] Write subheadline: explain document-first, local-first
- [ ] Add primary CTA: "Start Building Knowledge" → `/app`
- [ ] Add secondary CTA: scroll to #concepts
- [ ] Optional: Add "Early Access" badge component
- [ ] Add subtle fade-in animation on mount
- [ ] Test responsive typography scaling
- [ ] Use semantic HTML (h1 for headline)

### Phase 5: Core Concepts Section
- [ ] Create `src/components/landing/CoreConcepts.tsx`
- [ ] Design 3-column grid (responsive stack on mobile)
- [ ] Concept 1: Document-first (icon: FileText)
  - "Knowledge lives in documents, not chats"
  - Explain: documents are graphs of addressable nodes
- [ ] Concept 2: Reference over duplication (icon: Link)
  - "Reuse happens by reference, never copy"
  - Explain: transclusions stay live and editable
- [ ] Concept 3: Exploration ≠ Authority (icon: Layers)
  - "Messy exploration and authoritative spec never fork"
  - Explain: Spec is composed of references to Exploration
- [ ] Use shadcn Card components
- [ ] Use lucide-react icons
- [ ] Add smooth scroll anchor (#concepts)

### Phase 6: Features Section
- [ ] Create `src/components/landing/Features.tsx`
- [ ] Design features grid (3-col → 1-col responsive)
- [ ] Feature 1: Addressable nodes (every block has stable ID)
- [ ] Feature 2: Scoped AI (chat bound to document nodes, not standalone)
- [ ] Feature 3: Reversible interactions (fold/focus/lift never destroy data)
- [ ] Feature 4: Provenance (traceable origin of content)
- [ ] Add icons for each feature (lucide-react)
- [ ] Use existing shadcn Card components
- [ ] Test mobile layout stacking

### Phase 7: CTA Band
- [ ] Create `src/components/landing/CtaBand.tsx`
- [ ] Write headline: "Start Building Knowledge"
- [ ] Write subtext: "Local-first. No lock-in. Your data stays yours."
- [ ] Add CTA button → `/app`
- [ ] Subtle background treatment (muted gray)
- [ ] Test responsive padding and sizing
- [ ] Ensure contrast in light/dark modes (if dark mode exists)

### Phase 8: Landing Footer
- [ ] Create `src/components/landing/LandingFooter.tsx`
- [ ] Left: "Compound" logo text
- [ ] Center: Links (GitHub, Docs placeholder, About placeholder)
- [ ] Right: © 2026
- [ ] Test mobile collapse (stack vertically)
- [ ] Add subtle top border
- [ ] Keep minimal (not multi-column heavy)

### Phase 9: Landing Page Composition
- [ ] Compose all components in `src/pages/LandingPage.tsx`
- [ ] Order: LandingNav → Hero → CoreConcepts → Features → CtaBand → Footer
- [ ] Add smooth scroll behavior (CSS or ScrollToOptions)
- [ ] Implement fade-in animations on scroll (intersection observer or CSS)
- [ ] Test full page flow from top to bottom
- [ ] Verify all CTAs navigate to `/app` correctly
- [ ] Test scroll anchors (#concepts, #features work)

### Phase 10: Content Review
- [ ] Review all copy against README.md invariants
- [ ] Ensure technical precision (no marketing fluff)
- [ ] Verify vocabulary: nodes, transclusions, provenance, lift, fold, focus
- [ ] Check tone: opinionated, technical, not aspirational
- [ ] Ensure "document-first" explained clearly
- [ ] Ensure "reference over duplication" explained with examples
- [ ] Ensure "Exploration vs Spec" distinction is clear

### Phase 11: Styling & Consistency
- [ ] Audit all components for hardcoded colors
- [ ] Replace with Tailwind CSS variable classes
- [ ] Match grayscale aesthetic of existing app
- [ ] Ensure spacing is consistent (use theme spacing scale)
- [ ] Test visual hierarchy (no competing elements)
- [ ] Verify frosted glass nav effect works on scroll
- [ ] Check that landing page feels cohesive with workspace

### Phase 12: Accessibility Audit
- [ ] Run Lighthouse accessibility audit (target: 90+)
- [ ] Verify semantic HTML hierarchy
- [ ] Test keyboard-only navigation through entire page
- [ ] Verify ARIA labels on all icon-only buttons
- [ ] Test focus-visible rings on all interactive elements
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Fix any identified accessibility issues

### Phase 13: Responsive Design Validation
- [ ] Test at 375px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1024px (laptop)
- [ ] Test at 1440px (desktop)
- [ ] Fix any layout breaks at intermediate sizes
- [ ] Verify no horizontal scroll at any breakpoint
- [ ] Test hamburger menu on mobile (open/close)
- [ ] Test on actual mobile device (iOS Safari, Chrome Android)

### Phase 14: Integration Testing
- [ ] Test: Land on `/` → Click "Get Started" → Workspace loads
- [ ] Test: Direct navigate to `/app` → Workspace loads correctly
- [ ] Test: `/app` → Browser back → Landing page
- [ ] Test: `/app` → Manual navigate to `/` → Landing page
- [ ] Verify stores hydrate correctly on all navigation paths
- [ ] Verify keyboard shortcuts only active in `/app`
- [ ] Test thread panel only appears in `/app`
- [ ] Confirm zero console errors or warnings

### Phase 15: Polish & Final QA
- [ ] Remove any console logs or debug code
- [ ] Run TypeScript strict mode check (no errors)
- [ ] Run ESLint and fix any warnings
- [ ] Test `npm run dev` starts without issues
- [ ] Test `npm run build` succeeds
- [ ] Check bundle size increase (should be minimal)
- [ ] Final visual polish (spacing, alignment, typography)
- [ ] Ensure all links work (GitHub, etc.)

---

## Decisions

**Routing library choice:**
- **React Router** (vs TanStack Router, Wouter): Chose React Router for maturity, documentation, and wide adoption. Minimal footprint, client-side only (no SSR needed for local-first app).

**Routing structure:**
- **`/` = Landing, `/app` = Workspace**: Clean separation. Landing explains concepts, workspace is where work happens. Future: `/docs`, `/examples` can be added.

**Component naming:**
- Prefix landing components with "Landing" (`LandingNav` vs `Navbar`) to avoid confusion with potential workspace navigation components.

**Content approach:**
- Pull directly from README.md invariants rather than rewriting. The landing page is *documentation as interface*.
- Copy should teach the mental model: document-first, addressable nodes, reference over duplication, Exploration vs Spec.

**Animation philosophy:**
- Subtle fade-ins only, using Tailwind's `animate-in` utilities or simple CSS transitions.
- No flashy effects — Compound is serious software, not a marketing site.

**No dark mode toggle on landing:**
- Landing page respects system preference (via existing Tailwind dark: variants).
- No explicit toggle on landing page (that's for power users in workspace).

---

## Risks

**Risk: Routing breaks existing hydration logic**
- *Mitigation:* Test hydration thoroughly at `/app`. Ensure stores load before rendering workspace. Use `useEffect` to hydrate on mount if needed.

**Risk: Increased bundle size from react-router-dom**
- *Mitigation:* React Router is ~10kb gzipped, minimal impact. Use code splitting if needed (lazy load workspace route).

**Risk: Mobile menu doesn't work well on small screens**
- *Mitigation:* Use existing shadcn Sheet component (already battle-tested). Test on real devices early.

**Risk: Landing page messaging doesn't resonate (too technical)**
- *Mitigation:* Compound's target audience IS technical. Embrace precision over accessibility to casual users. Those who get it will love it.

**Risk: Navigation between routes feels janky**
- *Mitigation:* Use `<Link>` from react-router-dom (client-side nav, no page reload). Test navigation UX carefully.

**Risk: Existing keyboard shortcuts conflict with landing page**
- *Mitigation:* Only register shortcuts when on `/app` route. Use route-aware hooks or wrap shortcut registration in conditional.

---

## Progress notes

**[Date]:** PLAN.md updated for in-app landing page
- Revised from Next.js template to Vite + React Router integration
- Broke down into 15 phases focusing on routing, components, and integration
- Identified risks around hydration, bundle size, and keyboard shortcuts
- Content approach: pull from README.md invariants, teach mental model

---

## Done when

- [ ] All 15 phases completed and tasks checked off
- [ ] All acceptance criteria in README.md verified and checked
- [ ] Landing page accessible at `/`
- [ ] Workspace accessible at `/app` with zero regressions
- [ ] All existing functionality works (stores, shortcuts, threading)
- [ ] Lighthouse accessibility score 90+
- [ ] No TypeScript errors, no build warnings
- [ ] Navigation between routes is instant and smooth
- [ ] Copy accurately reflects README.md invariants
- [ ] Mobile responsive at all breakpoints
- [ ] Successfully demoed to at least one person who "gets it"

---

## Future extensions (out of scope for I4)

These are intentionally deferred:
- Public demo mode (I5): Read-only workspace with example document
- Docs site integration (I6): Separate `/docs` route with guides
- Examples library (I7): `/examples` with templates
- GitHub import (I8): Load document from GitHub markdown
- Onboarding tutorial (I9): First-time user walkthrough
