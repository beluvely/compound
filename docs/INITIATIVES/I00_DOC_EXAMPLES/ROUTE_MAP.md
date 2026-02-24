# ROUTE_MAP — Application Route Analysis

This document maps the key routes/screens in the application and their current status.

---

## Navigation Structure

### Primary Routes
| Route | Screen/Component | Status | Required for Demo |
|-------|------------------|---------|-------------------|
| `/` | Home/Landing | [Working/Broken/Missing] | Yes |
| `/dashboard` | Main Dashboard | [Working/Broken/Missing] | Yes |
| `/profile` | User Profile | [Working/Broken/Missing] | No |
| `/settings` | App Settings | [Working/Broken/Missing] | No |
| `/auth/login` | Sign In | [Working/Broken/Missing] | Yes |

### Secondary Routes  
| Route | Screen/Component | Status | Required for Demo |
|-------|------------------|---------|-------------------|
| `/[entity]` | [Entity] List | [Working/Broken/Missing] | [Yes/No] |
| `/[entity]/new` | Create [Entity] | [Working/Broken/Missing] | [Yes/No] |
| `/[entity]/[id]` | [Entity] Detail | [Working/Broken/Missing] | [Yes/No] |

---

## Route Dependencies

### Routes that need data:
- **[Route]**: Needs [entity] data from [current source]
- **[Route]**: Needs [entity] data from [current source]

### Routes that work standalone:
- **[Route]**: Static content, no data dependencies
- **[Route]**: Client-side only logic

---

## Framework-specific notes

**Router:** [React Router / Next.js / Vue Router / etc.]
**Route definition location:** [pages/, src/routes/, etc.]
**Dynamic routing pattern:** [file-based / config-based]

---

## Priority for stabilization

### Must work for demo:
1. [Essential route 1]
2. [Essential route 2]
3. [Essential route 3]

### Can be fixed later:
1. [Secondary route 1]
2. [Secondary route 2]

---

## Current blockers

**Route issues found:**
- [Route]: [Specific error/issue]
- [Route]: [Specific error/issue]

**Missing routes needed:**
- [Route]: [Why needed]

---

## Notes for backend adapter

Routes that will need backend integration:
- **[Route]**: Will call `get[Entity]()` and `create[Entity]()`
- **[Route]**: Will call `getCurrentUser()` and `updateProfile()`