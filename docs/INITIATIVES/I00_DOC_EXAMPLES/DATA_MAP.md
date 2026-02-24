# DATA_MAP — Application Data Analysis

This document maps the data requirements and current sources across the application.

---

## Core Entities

### Primary Entities (essential for app functionality)
| Entity | Current Source | Screens Using | Backend Priority |
|--------|---------------|---------------|------------------|
| User/Profile | [Hardcoded/JSON/API] | Dashboard, Profile, Header | High - Auth dependent |
| [Entity1] | [Hardcoded/JSON/API] | [List screens] | High - Core feature |
| [Entity2] | [Hardcoded/JSON/API] | [List screens] | Medium - Secondary feature |

### Secondary Entities (nice-to-have)
| Entity | Current Source | Screens Using | Backend Priority |
|--------|---------------|---------------|------------------|
| [Entity3] | [Hardcoded/JSON/API] | [List screens] | Low - Enhancement |

---

## Data Sources Analysis

### Working data sources:
- **[Source]**: [Description, file location, what it provides]
- **[Source]**: [Description, file location, what it provides]

### Broken data sources:
- **[Source]**: [What's broken, error messages]
- **[Source]**: [What's broken, error messages]

### Missing data:
- **[Entity]**: Needed by [screens], currently shows [fallback/error]

---

## Screen Data Dependencies

### High Priority Screens (must work for demo)
**[Screen Name]**
- Data needed: [List what data this screen displays]
- Current source: [Where it gets data now]
- Fallback: [What shows when data unavailable]
- Backend calls needed: [List API calls this will need]

**[Screen Name]**  
- Data needed: [List what data this screen displays]
- Current source: [Where it gets data now]
- Fallback: [What shows when data unavailable]
- Backend calls needed: [List API calls this will need]

### Lower Priority Screens
**[Screen Name]**
- Data needed: [List what data this screen displays]
- Can be stubbed: [Yes/No and what with]

---

## Dummy Data Strategy

### Immediate dummy replacements needed:
- **[Entity]**: Replace [current broken source] with simple in-memory array
- **[Entity]**: Replace [API calls] with mock functions returning fixtures

### Data that can stay dummy for now:
- **[Entity]**: [Why it's OK to stay dummy]
- **[Entity]**: [Why it's OK to stay dummy]

---

## Backend Migration Priority

### Phase 1 (post-I0): [Entity] migration
- **Why first**: [Core to user experience / blocks other features]
- **Complexity**: [Simple/Medium/Complex]
- **Database design needed**: [Basic table / Complex relationships]

### Phase 2: [Entity] migration  
- **Why second**: [Reasoning]
- **Complexity**: [Simple/Medium/Complex]
- **Dependencies**: [Depends on Phase 1 completion]

### Phase 3+: Optional enhancements
- [Entity]: [Reasoning for later]
- [Feature]: [Reasoning for later]

---

## Notes for backend adapter design

**Required adapter methods:**
```
// Auth
getSession()
signIn(email, password)  
signOut()
getCurrentUser()

// [Entity1]
get[Entity1]List(filters?)
get[Entity1](id)
create[Entity1](data)
update[Entity1](id, data)

// [Entity2] 
get[Entity2]List(userId)
// etc.
```

**Current mock data locations:**
- [Entity]: `[file path or description]`
- [Entity]: `[file path or description]`