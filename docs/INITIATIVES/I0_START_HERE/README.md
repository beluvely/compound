# I0 — Adopt Mode: Stabilize + Supabase Quick Win

**This is your FIRST ACTUAL INITIATIVE.** Execute this to stabilize your imported codebase.
*For examples and templates, see I00-template-examples/ directory.*

---

**Purpose:** This is the FOUNDATIONAL initiative that every team should run first when adopting the agentic core system. Take any AI-generated or imported codebase (Figma Make export, v0/Cursor starter, random template) and make it **stable, runnable, and ready for real backend work**.

This initiative has two quick wins:
1) **Stability Win:** `npm run dev` works reliably (dummy data OK)
2) **Supabase Win:** Supabase connected + basic Auth flow works (real backend starts)

It also produces a durable planning artifact:
- **PRODUCT_SOT.md** (product source of truth) created/updated from what we learn.

---

## Outcome
A stable, runnable application with Supabase auth integration and a clear roadmap for progressive backend implementation.

## Scope
### In-scope
- Make the project run locally (`npm run dev`)
- Fix dependency/runtime errors blocking startup
- Introduce a minimal **backend adapter seam**
- Establish Supabase connection + Auth baseline
- Produce PRODUCT_SOT and follow-on plan

### Explicitly out-of-scope (for I0)
- Full refactor into ideal architecture
- Complex RBAC, invites, org switching (unless already present)
- Billing/Stripe
- Production-grade testing suite
- Performance optimization
- Full schema design for the entire app

## Acceptance criteria

### A) Stability Win (required)
- [ ] Project installs dependencies without manual hacks
- [ ] `npm run dev` starts without crashing
- [ ] App renders at least one "home" route/screen
- [ ] Critical runtime errors are fixed or isolated behind feature flags
- [ ] Data dependencies are satisfied via **dummy adapters** if needed

### B) Supabase Quick Win (required)
- [ ] Supabase project created and linked via environment vars
- [ ] Auth baseline implemented (sign-in/out + session detection)
- [ ] **Intelligent schema analysis completed** based on codebase patterns
- [ ] **Contextually appropriate database schema** implemented (not just generic profiles)
- [ ] Schema includes proper RLS policies and relationships for detected app type
- [ ] A "logged in / logged out" UI state is visible in the app
- [ ] No service-role keys in the client; only anon key used client-side

### C) Planning Outputs (required)
- [ ] `docs/PRODUCT_SOT.md` created/updated with validated info
- [ ] `docs/INITIATIVES/I0/PLAN.md` includes a short follow-on plan for:
  - converting dummy data → Supabase tables (only for core entities)
  - phasing based on the project goal (avoid overbuilding)

---

## Primary artifacts created/updated (outputs)

**Required files**
- `docs/PRODUCT_SOT.md`
- `docs/INITIATIVES/I0/README.md` (this doc or a short wrapper)
- `docs/INITIATIVES/I0/PLAN.md`
- `docs/INITIATIVES/I0/REPORT.md`
- `.instructions.md` (if missing)

**Recommended**
- `docs/INITIATIVES/I0/ROUTE_MAP.md`
- `docs/INITIATIVES/I0/DATA_MAP.md`

---

## Milestone structure

### Phase 0 — Intake + Environment Baseline (30–60 min)
**Goal:** establish a known-good starting baseline.

**Steps**
1. Confirm runtime + tooling:
   - Node version
   - package manager (npm/pnpm)
   - OS
2. Install and run:
   - `npm install`
   - `npm run dev`
3. Capture failures exactly:
   - error messages
   - stack traces
   - failing commands

**Outputs**
- Baseline notes in `I0/REPORT.md`:
  - what worked / what failed
  - exact error output (short excerpts)
  - immediate hypotheses

---

### Phase 1 — Project Investigation Spike (60–120 min)
**Goal:** understand what you have before changing it.

**Investigate & capture**
- Framework / runtime assumptions (Vite? Next? router?)
- Entry points (`main.tsx`, `App.tsx`, routes)
- Data flow pattern (fetch? local state? mock JSON?)
- Auth assumptions (none? local? external provider?)
- Build constraints (env vars, config files)

**Route Map**
Document:
- key routes/screens
- which ones are required for a "demoable" app

**Data Map**
Document:
- what data is needed for those screens
- current source (hardcoded? mock file? API?)

**Outputs**
- `I0/ROUTE_MAP.md` (short)
- `I0/DATA_MAP.md` (short)
- Update `PRODUCT_SOT.md` "Core concepts" and "Irreducible entities" sections

---

### Phase 2 — Stability Win (dummy data acceptable) (60–180 min)
**Goal:** get `npm run dev` stable and rendering key screens.

**Rules**
- Prefer minimal changes that unblock runtime
- Avoid large refactors
- Introduce seams rather than rewriting logic

**Recommended approach: add a backend adapter seam**
Create:
- `src/lib/backend/` (or similar)
- a small interface that screens call for data/auth

Example:
- `getSession()`
- `signIn()`
- `signOut()`
- `getCurrentUser()`
- `list<Entity>()`

**Dummy mode**
If screens need data, back the adapter with dummy data first:
- local arrays
- JSON fixtures
- simple in-memory store

**Outputs**
- App runs locally, key routes render
- `I0/REPORT.md` updated with:
  - what changed
  - what remains unstable
  - remaining risks

---

### Phase 3 — Supabase Quick Win + Intelligent Schema (90–240 min)
**Goal:** Supabase connected, Auth working, and contextually appropriate database schema implemented.

**Enhanced Schema Setup**
1. **Analyze existing codebase for patterns**
   - Parse TypeScript interfaces and React components
   - Detect app type (blog, ecommerce, saas, social, etc.)
   - Identify data entities and relationships

2. **Generate contextual database schema**
   - Blog apps → posts, categories, tags, comments, authors
   - E-commerce → products, orders, customers, categories, reviews
   - SaaS → organizations, subscriptions, team_members
   - Social → posts, followers, likes, messages, feeds
   - Generic → enhanced profiles with detected extensions

**Steps**
1. Create Supabase project
2. Add env vars
3. Run intelligent schema analysis: `npx @new-medium/core supabase:analyze`
4. Review and confirm suggested schema
5. Generate migration files with RLS policies
6. Implement Supabase client in: `src/lib/supabase/client.ts`
7. Implement Auth baseline + schema-appropriate data operations
8. Update backend adapter to use real tables instead of dummy data

**Schema Deliverables**
- Migration files with contextually appropriate tables
- RLS policies configured for detected app patterns
- TypeScript types generated for database schema
- Example queries for common operations
- Backend adapter updated to use real database operations

**Outputs**
- Auth works end-to-end
- **Contextual database schema** implemented and operational
- **Backend adapter migrated** from dummy data to real Supabase operations
- `I0/REPORT.md` includes:
  - Supabase setup notes
  - Schema analysis results and rationale
  - App type detected and schema decisions made
  - How to reproduce setup
  - Screenshots optional

---

### Phase 4 — Output the follow-on implementation plan (30–60 min)
**Goal:** produce a phased path from dummy → real backend, without overbuilding.

**Principle**
Only model what matters for the project goal.

**Plan format**
In `I0/PLAN.md`, include:

1) **Core entities**
- 2–4 irreducible entities only  
  (e.g., `org`, `project`, `item`, `profile`)

2) **Phase 1: Replace dummy data for one entity**
- choose a single screen + data flow
- design the table + RLS
- implement read path
- verify UI works

3) **Phase 2: Expand to the next entity**
- same pattern
- keep scope tight

4) **Phase 3+: Optional enhancements (only if needed)**
- org switching
- roles
- invites
- audits/logs

**Outputs**
- `I0/PLAN.md` complete
- `PRODUCT_SOT.md` updated with:
  - goals / non-goals
  - core entities
  - assumptions and open questions

---

## Agent usage (how to run I0 with an agent)

If using agentic partners, run I0 as:
1) Investigator pass → produces ROUTE_MAP + DATA_MAP + gaps
2) Implementer pass → fixes runtime + introduces adapter seam
3) Supabase pass → connects env + auth baseline
4) QA/Refactor pass → confirms stability + updates REPORT + PLAN + PRODUCT_SOT

---

## Risks & mitigations (common)
- **Dependency conflicts:** pin versions minimally; avoid major upgrades in I0
- **Missing env vars:** centralize env checking and fail with helpful errors
- **Router mismatch:** avoid moving routes; wrap existing structure
- **Over-refactor temptation:** stop after stability + auth quick win

---

## Exit criteria checklist (copy/paste)
- [ ] `npm install` succeeds
- [ ] `npm run dev` works
- [ ] home route renders
- [ ] backend adapter seam exists
- [ ] Supabase env vars wired
- [ ] auth quick win works
- [ ] PRODUCT_SOT created/updated
- [ ] I0 REPORT written
- [ ] I0 PLAN written