# M1 MILESTONE — Setup & Investigation

**Initiative:** I0 Adopt Mode  
**Phases:** 0-1 (Intake + Environment Baseline, Project Investigation Spike)  
**Estimated Time:** 30-60 minutes  
**Goal:** Establish baseline understanding of the codebase and get environment working

---

## Objectives

### Phase 0: Intake + Environment Baseline
- Establish known-good starting baseline
- Get basic environment dependencies working
- Document initial project state

### Phase 1: Project Investigation Spike  
- Understand existing codebase structure
- Map out routes, components, and data flows
- Identify key architectural patterns

---

## Acceptance Criteria

**Environment Ready:**
- [ ] Project dependencies install successfully (`npm install`)
- [ ] Basic development server can start (even if app doesn't fully work)
- [ ] No immediate environment/dependency blocking errors
- [ ] Development tools (IDE, Git) are configured

**Codebase Understanding:**
- [ ] Framework and build system identified (React/Next/Vite/etc.)
- [ ] Entry points and routing approach documented
- [ ] Key routes mapped out (/, /dashboard, /profile, etc.)
- [ ] Data sources identified (hardcoded, JSON, APIs, etc.)
- [ ] Component structure and patterns understood

**Documentation Created:**
- [ ] ROUTE_MAP.md created with key routes and their purposes (*see [../I00-template-examples/ROUTE_MAP.md](../I00-template-examples/ROUTE_MAP.md) for template*)
- [ ] DATA_MAP.md created with data sources and requirements (*see [../I00-template-examples/DATA_MAP.md](../I00-template-examples/DATA_MAP.md) for template*)
- [ ] Initial PRODUCT_SOT.md updated with project understanding
- [ ] Current state and issues documented in PLAN.md progress notes

---

## Key Tasks

### Investigation Tasks
- [ ] Examine package.json to understand tech stack and dependencies
- [ ] Trace application entry point (main.tsx, App.tsx, etc.)
- [ ] Map out routing structure and key screens
- [ ] Identify data requirements by examining components
- [ ] Document current data sources (hardcoded arrays, JSON files, broken APIs)
- [ ] Note any obvious broken functionality or missing pieces

### Documentation Tasks  
- [ ] Create ROUTE_MAP.md with route inventory (*use [../I00-template-examples/ROUTE_MAP.md](../I00-template-examples/ROUTE_MAP.md) as template*)
- [ ] Create DATA_MAP.md with data source analysis (*use [../I00-template-examples/DATA_MAP.md](../I00-template-examples/DATA_MAP.md) as template*)
- [ ] Update PRODUCT_SOT.md with initial project understanding
- [ ] Document findings in PLAN.md progress notes

### Environment Tasks
- [ ] Run `npm install` and resolve any dependency issues
- [ ] Try `npm run dev` and document what works/breaks
- [ ] Set up any required environment variables (even if placeholder)
- [ ] Ensure basic development workflow is functional

---

## Deliverables

**Documentation:**
- ROUTE_MAP.md - Key routes and their current state (*template available in I00-template-examples/*)
- DATA_MAP.md - Data sources and requirements analysis (*template available in I00-template-examples/*)
- Updated PRODUCT_SOT.md - Initial project understanding
- PLAN.md progress notes - Investigation findings

**Working Environment:**
- Dependencies installed successfully
- Development server can start (even if app has issues)
- Basic development workflow established

---

## Success Metrics

- Can start development server without environment blocking errors
- Have clear understanding of app structure and data needs
- Documentation provides roadmap for stability work in M2
- No more than 1-2 major unknowns remain about the codebase architecture

---

## Common Issues & Solutions

**Dependency conflicts:** Focus on getting *something* to run, even with warnings
**Complex routing:** Document main user paths, don't map every edge case  
**Unclear data flow:** Trace from UI components backward to data sources
**Missing environment:** Create placeholder .env files with dummy values

---

## Milestone Complete When

- ✅ Environment baseline established (dependencies install, server starts)
- ✅ Codebase architecture understood and documented
- ✅ Route map and data requirements captured
- ✅ Ready to begin stability work in M2 with clear understanding of what needs fixing