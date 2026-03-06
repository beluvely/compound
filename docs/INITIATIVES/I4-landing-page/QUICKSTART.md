# I4 Quick Start Guide

This file provides the essential commands and setup steps to add a landing page to the Compound app.

---

## Prerequisites

- Existing Compound project (this repo)
- Node.js 18+ installed
- npm or pnpm
- Code editor (VS Code recommended)

---

## Initial Setup Commands

```bash
# 1. Install React Router
npm install react-router-dom

# 2. Verify existing shadcn components are installed
# (Button, Card, Sheet should already exist from previous work)
# If not:
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add sheet

# 3. Start dev server
npm run dev
```

---

## Project Structure to Create

```
src/
├── components/
│   └── landing/               ← CREATE THIS FOLDER
│       ├── LandingNav.tsx     ← CREATE
│       ├── Hero.tsx           ← CREATE
│       ├── CoreConcepts.tsx   ← CREATE
│       ├── Features.tsx       ← CREATE
│       ├── CtaBand.tsx        ← CREATE
│       └── LandingFooter.tsx  ← CREATE
├── pages/                     ← CREATE THIS FOLDER
│   ├── LandingPage.tsx        ← CREATE (composes landing components)
│   └── WorkspacePage.tsx      ← CREATE (wraps existing App logic)
├── routes.tsx                 ← CREATE (routing config)
├── App.tsx                    ← MODIFY (add router)
└── main.tsx                   ← MODIFY (wrap with RouterProvider)
```

**DO NOT MODIFY** (protected files):
- `stores/*` — All Zustand stores
- `app/ExplorationView.tsx`
- `app/SpecView.tsx`  
- `components/editor/*`
- `components/chat/*`
- `stores/hydrate.ts`
- `hooks/useKeyboardShortcuts.ts`

---

## First Implementation Steps

### 1. Set up routing infrastructure

Create `src/routes.tsx`:
```tsx
import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { WorkspacePage } from './pages/WorkspacePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <WorkspacePage />,
  },
])
```

### 2. Update main.tsx

```tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
```

### 3. Create WorkspacePage.tsx

Move existing App.tsx logic here (wraps ExplorationView/SpecView).

### 4. Create LandingPage.tsx

Compose all landing components.

### 5. Follow PLAN.md phases sequentially

---

## Development Workflow

1. **Create landing component** in `src/components/landing/`
2. **Import into LandingPage.tsx**
3. **Test at `http://localhost:5173/`** (landing)
4. **Test at `http://localhost:5173/app`** (workspace)
5. **Verify no regressions** in workspace
6. **Test navigation** between routes
7. **Move to next component**

---

## Testing Checklist (Do Continuously)

**Landing page (`/`):**
- [ ] Renders without errors
- [ ] All CTAs link to `/app`
- [ ] Response at mobile/tablet/desktop
- [ ] Smooth scroll works
- [ ] Keyboard navigation works
- [ ] No hardcoded colors

**Workspace (`/app`):**
- [ ] All existing features work
- [ ] Stores hydrate from IndexedDB
- [ ] Keyboard shortcuts work
- [ ] ExplorationView renders
- [ ] SpecView renders
- [ ] Thread panel works
- [ ] No console errors

**Navigation:**
- [ ] `/` → `/app` (click Get Started)
- [ ] `/app` → `/` (browser back)
- [ ] Direct navigate to `/app` works
- [ ] No page reloads (client-side routing)

---

## Common Issues & Solutions

**Issue:** Stores don't hydrate when navigating to `/app`  
**Solution:** Ensure `WorkspacePage.tsx` calls `hydrateStoresFromIndexedDb()` in `useEffect`

**Issue:** Keyboard shortcuts trigger on landing page  
**Solution:** Wrap shortcut registration in route check (only on `/app`)

**Issue:** React Router 404 on refresh  
**Solution:** This is expected in dev. For production, configure server to redirect all routes to index.html

**Issue:** Landing page components not styled correctly  
**Solution:** Verify Tailwind is scanning `src/components/landing/**/*.tsx` in `tailwind.config.ts`

---

## Content Guidelines

When writing copy for landing components:

**DO:**
- Pull from README.md verbatim (invariants, core concepts)
- Use Compound's vocabulary: nodes, transclusions, provenance, lift, fold
- Be technical and precise
- Explain the mental model (document-first, references not duplication)

**DON'T:**
- Use generic SaaS marketing language ("Transform your workflow")
- Over-promise ("10x your productivity")
- Use vague aspirational language
- Copy from other landing pages

**Examples:**
- ✅ "Knowledge lives in documents, not chats"
- ❌ "Supercharge your note-taking"
- ✅ "Reuse happens by reference, never duplication"
- ❌ "Work smarter, not harder"

---

## Routing Structure

```
/            → LandingPage (public, explains Compound)
/app         → WorkspacePage (existing app functionality)
/app/*       → (future) Sub-routes within workspace if needed
```

Future routes (out of scope for I4):
- `/docs` — Documentation
- `/examples` — Example documents
- `/about` — About page

---

## Progress Tracking

Update docs daily:
- **REPORT.md** — what was built, decisions made, challenges
- **PLAN.md** — check off completed tasks
- **README.md** — verify acceptance criteria as you go

---

## Definition of Done

See [README.md](./README.md) acceptance criteria. All checkboxes must be complete.

Key milestones:
1. Routing works (no regressions)
2. All 6 landing components built
3. Copy reflects README.md invariants
4. Mobile responsive
5. Lighthouse 90+ accessibility
6. Demo to someone who "gets it"

---

## Questions or Blockers?

Document in REPORT.md under "Challenges & Solutions" section.
