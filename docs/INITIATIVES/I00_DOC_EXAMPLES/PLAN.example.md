# I00 Template Examples — Plan Documentation Patterns

**Learning note:** This PLAN.example.md demonstrates best practices for initiative planning and progress tracking. This is a **template example** - your actual first initiative planning happens in **I0/PLAN.md**.

## How to use PLAN.md effectively

**Key sections every plan should have:**
- Tasks: Specific, actionable items with completion tracking
- Decisions: Important choices made during implementation, with reasoning
- Risks: Identified risks and how you'll address them
- Progress notes: Timeline narrative of what happened, when, and why
- Done when: Clear completion signals that align with README acceptance criteria

**Common patterns that work:**
- Break tasks into 1-4 hour chunks
- Log decisions as they're made (don't wait until the end)
- Update progress notes regularly, especially when blocked
- Use "Done when" to verify you've met all acceptance criteria

---

## Example: Original I0 execution (repo skeleton)

*This shows how a real initiative was planned and tracked*

### Tasks
- [x] Add `/docs/PRODUCT_SOT.md` (filled)
- [x] Add `/docs/ARCHITECTURE.md`
- [x] Add `/docs/INITIATIVES/I0–I4` stubs
- [x] Add `/templates/base` and `/templates/supabase` directories with initial files
- [x] Add `/.instructions.md` and `/README.extend.md`

### Decisions
**Template structure:** Chose base bundle (core framework) + optional supabase bundle
*Reasoning:* Allows progressive adoption - users get docs/structure immediately, add DB later

**Conflict policy:** Default skip, optional rename
*Reasoning:* Safety first - never overwrite existing user files without explicit opt-in  

**Supabase integration approach:** Progressive setup with doctor/setup scripts for guided onboarding
*Reasoning:* Reduces friction; makes Supabase optional but easy to adopt

### Risks
**Over-scoping templates:** Keep v1 minimal
*Mitigation:* Focus on essential files only; avoid feature creep in initial templates

**Template maintenance burden:** Templates will need updates as core evolves  
*Mitigation:* Establish clear versioning strategy; keep templates as simple as possible

### Progress notes
**Feb 6, 2026:** Completed template backbone creation
- Created `/templates/base/` with core framework files (.instructions.md, PRODUCT_SOT.md, ARCHITECTURE.md, initiative templates)
- Created `/templates/supabase/` with full Supabase integration (config, migrations, scripts, documentation)
- Templates are ready for CLI implementation in I1
- All acceptance criteria verified complete

### Done when
- [x] Skeleton committed and readable by humans + agents
- [x] Base template bundle provides clear framework structure
- [x] Supabase template bundle enables progressive setup
- [x] All acceptance criteria from README.md met