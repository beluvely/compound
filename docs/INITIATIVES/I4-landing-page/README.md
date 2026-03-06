# I4 — Compound Landing Page

**Purpose:** Build a polished landing page for Compound as a new route in the existing Vite + React app. The landing page will serve as the public-facing entry point, with the current workspace views behind an `/app` route.

---

## Outcome

A production-ready landing page at `/` that introduces Compound to new users, with the existing document workspace accessible at `/app`. The landing page should feel like a real product — polished, purposeful, and aligned with Compound's core philosophy.

The implementation will:
- Add React Router for client-side routing
- Create landing page components at `/` 
- Move current workspace to `/app`
- Maintain all existing functionality (no regressions)
- Use existing stack (Vite, React, shadcn/ui, Tailwind)

## Scope

### In-scope
- **Routing setup**
  - Add React Router Dom to existing app
  - Landing page at `/`
  - Current workspace at `/app`
  - Maintain all existing Zustand state and functionality
  
- **Navigation system**
  - Sticky navbar with mobile-responsive hamburger menu (shadcn Sheet)
  - "Compound" logo + nav links + dual CTAs (Get Started / Sign In)
  - Frosted glass scroll effect
  - Link to `/app` for "Get Started" CTA
  
- **Hero section**
  - Headline reflecting Compound's philosophy ("Where thinking, structure, and AI stay aligned")
  - Subheadline explaining document-first, local-first workspace
  - Primary CTA → `/app` and secondary CTA → features
  - Optional badge for "Early Access" or "Beta"
  
- **Core concepts section**
  - 3-column grid explaining key principles:
    - Document-first (knowledge lives in documents, not chats)
    - Reference over duplication (transclusions, not copies)
    - Exploration ≠ Authority (messy workbench + clean spec)
  - Each card: icon (lucide-react), title, description
  
- **Features showcase**
  - Highlight key differentiators:
    - Addressable nodes
    - AI scoped to document context
    - Reversible interactions (fold/focus/lift)
    - Provenance-first
  - Use existing shadcn Card components
  
- **CTA band**
  - "Start Building Knowledge" → route to `/app`
  - Secondary emphasis on local-first, no lock-in
  
- **Footer**
  - Links: GitHub, Docs (placeholder), About
  - Simple, minimal layout
  
- **Integration with existing app**
  - No regressions to current ExplorationView/SpecView
  - Existing stores (document, view, chat, spec) unchanged
  - Existing keyboard shortcuts preserved
  - Maintain hydration from IndexedDB
  
- **Design constraints**
  - Use existing Tailwind config and CSS variables
  - Grayscale aesthetic matching Compound's posture
  - Mobile-first, fully responsive
  - Subtle animations (no flashy effects)
  - Accessible markup

### Explicitly out-of-scope (for I4)
- Authentication/authorization system
- User onboarding flow
- Analytics or tracking
- Waitlist/email capture form
- Pricing information (Compound is local-first)
- Multi-language support
- Custom illustrations (use lucide icons)
- Video demos or screenshots
- Changelog or blog integration

## Acceptance criteria

### A) Routing & Integration (required)
- [ ] React Router Dom installed and configured
- [ ] Landing page renders at `/`
- [ ] Existing workspace accessible at `/app`
- [ ] No regressions: all existing features work at `/app`
- [ ] Direct navigation to `/app` works (hydrates stores correctly)
- [ ] Browser back/forward navigation works
- [ ] All existing Zustand stores function unchanged
- [ ] Keyboard shortcuts preserved in `/app` view

### B) Landing Page Components (required)
- [ ] All landing components in `src/components/landing/`:
  - `LandingNav.tsx` (sticky, frosted glass effect, CTAs link to `/app`)
  - `Hero.tsx` (Compound-specific messaging, CTA → `/app`)
  - `CoreConcepts.tsx` (3 key principles with icons)
  - `Features.tsx` (differentiators grid)
  - `CtaBand.tsx` ("Start Building Knowledge" → `/app`)
  - `LandingFooter.tsx` (minimal links)
- [ ] All components use existing shadcn/ui components (Button, Card, Sheet)
- [ ] No new dependencies beyond `react-router-dom`

### C) Design & UX Quality (required)
- [ ] Grayscale aesthetic matching existing Compound app
- [ ] Fully responsive at sm/md/lg/xl breakpoints
- [ ] Mobile-first: hamburger menu, stacked layouts
- [ ] Smooth scroll behavior
- [ ] Subtle fade-in animations (Tailwind utilities)
- [ ] Messaging aligns with README.md invariants (document-first, reference over duplication, etc.)
- [ ] Copy emphasizes Compound's unique posture (not generic SaaS)

### D) Accessibility & Code Quality (required)
- [ ] Semantic HTML throughout (header, nav, main, section, footer)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] ARIA labels on icon-only buttons
- [ ] Focus-visible rings on interactive elements
- [ ] Keyboard navigation works for all CTAs/links
- [ ] No hardcoded colors — use existing CSS variables
- [ ] TypeScript: no `any` types, clean interfaces
- [ ] Follows existing code patterns (same as ExplorationView/SpecView)

### E) Content Quality (required)
- [ ] Hero messaging references Compound's core mental model
- [ ] Core concepts section explains: document-first, addressable nodes, reference over duplication
- [ ] Features highlight: reversibility, provenance, scoped AI, Exploration vs Spec
- [ ] Copy tone matches README: technical, opinionated, not marketing fluff
- [ ] No placeholder text — actual Compound-specific content
- [ ] Footer links to GitHub (real repo link)

---

## Primary artifacts created/updated (outputs)

**New files**
```
src/
├── components/
│   └── landing/
│       ├── LandingNav.tsx
│       ├── Hero.tsx
│       ├── CoreConcepts.tsx
│       ├── Features.tsx
│       ├── CtaBand.tsx
│       └── LandingFooter.tsx
├── pages/
│   ├── LandingPage.tsx (new route component)
│   └── WorkspacePage.tsx (wraps existing App logic)
└── routes.tsx (new routing config)
```

**Modified files**
```
src/
├── App.tsx (updated to use router)
├── main.tsx (wrap with RouterProvider)
package.json (add react-router-dom)
```

**Unchanged (protected)**
- All stores: `document.store.ts`, `view.store.ts`, `chat.store.ts`, `spec.store.ts`
- All existing components: `ExplorationView.tsx`, `SpecView.tsx`, editors, etc.
- Hydration logic: `stores/hydrate.ts`
- Keyboard shortcuts: `hooks/useKeyboardShortcuts.ts`

---

## Success metrics

**User Experience**
- Landing page clearly explains Compound's value proposition
- "Get Started" CTA leads to functional workspace
- Navigation between `/` and `/app` is instant (no page reload)
- First-time visitors understand Compound's philosophy without reading docs

**Technical Health**
- Zero regressions in existing workspace functionality
- Landing page Lighthouse score: 90+ (accessibility, performance)
- All existing tests pass (if tests exist)
- No increase in bundle size beyond react-router-dom (~10kb gzipped)

**Content Quality**
- Copy reflects README.md invariants verbatim
- No generic SaaS marketing language
- Technical users recognize Compound's unique approach immediately

---

## Related initiatives
- **I1-foundation** — Core document primitives (addressable nodes, references)
- **I2-m1.5-editor-foundation** — TipTap editor implementation
- **I3-scoped-ai-exploration** — AI chat scoped to document nodes
- Future: I5 — Public demo mode (read-only workspace showcase)
- Future: I6 — GitHub integration (import/export as markdown)

---

## Notes

**Why add a landing page now?**
- Compound needs a clear entry point for new users
- Current app assumes you understand the concepts immediately
- Landing page can explain document-first, reference over duplication, Exploration vs Spec
- Provides a stopping point before diving into the workspace

**Design philosophy:**
- The landing page should feel like an extension of the product, not marketing fluff
- Copy should be technical and precise, not aspirational
- Use Compound's own vocabulary: nodes, transclusions, provenance, lift
- Avoid: "Transform your workflow", "10x your productivity", "AI-powered" (unless specific)

**Routing approach:**
- Use React Router for minimal footprint (no Next.js needed)
- Keep `/` for landing, `/app` for workspace
- Future: `/docs`, `/examples`, `/about` as needed
- No server-side routing required — Compound is local-first

**Content inspiration:**
- README.md (invariants, core concepts, vocabulary)
- Product North Star: "Where thinking, structure, and AI stay aligned"
- Differentiators vs notes apps: no markdown blobs, references not duplication
- Differentiators vs chat apps: documents first, AI is scoped to context

**Key principle:** 
The landing page is *documentation as interface*. It should teach the mental model before users touch the workspace.
