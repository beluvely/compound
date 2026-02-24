# ARCHITECTURE — Compound

*This document can be parsed by `core` CLI to intelligently configure tech stack and environment*

## Tech Stack Decisions

*Use specific technology names for automatic detection and configuration*

### Frontend
- **Framework**: Vite + React 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4 (grayscale wireframe-neutral design)
- **UI Components**: shadcn/ui (Radix UI primitives, installed as source)
- **State Management**: Zustand (multiple stores: document, view, spec)
- **Editor**: TipTap (ProseMirror wrapper for rich text)
- **Icons**: lucide-react

### Backend & Database
- **Database**: None (client-side only, Phase 1)
- **Persistence**: IndexedDB via idb-keyval (local-first)
- **Authentication**: None (local-only documents, Phase 1)
- **API Layer**: None (no server, Phase 1)
- **Real-time**: None (no collaboration yet, Phase 1)

### Deployment & Environment
- **Platform**: Vercel (or any static host)
- **Environment**: SPA (single-page application)
- **CDN**: Vercel Edge (default)
- **Build Output**: Static assets only (no SSR)

### Development Tools
- **Bundler**: Vite 7
- **Testing**: None yet (Vitest + React Testing Library planned)
- **Linting**: ESLint 9 + Prettier
- **Type Checking**: TypeScript 5.9 (strict mode)

## Environment Configuration

*List required environment variables - these will be auto-generated in .env.example*

```env
# Phase 1: No environment variables required (local-only)
# Future phases may add:
# VITE_OPENAI_API_KEY=your-key (for AI integration, M2)
# VITE_SYNC_ENDPOINT=your-sync-url (for server sync, future)
```

## System Architecture

### Core Components

**Domain Layer** (`src/domain/`):
- `types.ts`: Core type definitions (Node, Document, SpecBlock, ViewState, Provenance)

**State Layer** (`src/stores/`):
- `document.store.ts`: Exploration document CRUD (nodes, structure, provenance)
- `spec.store.ts`: Spec document management (lifted references, transclusions)
- `view.store.ts`: UI state (selection, focus, collapsed nodes)
- `persistence.ts`: IndexedDB save/load logic
- `hydrate.ts`: State initialization from persisted data

**UI Layer** (`src/components/`):
- `ui/`: shadcn/ui components (Button, Card, Toast)
- `editor/`: TipTap-based block editors (BlockEditor, SimpleBlockEditor)
- `common/`: Shared components (NodeEditor, SpecBlockRenderer)
- `navigation/`: ViewSwitcher for Exploration/Spec toggle

**Application Layer** (`src/app/`):
- `ExplorationView.tsx`: Main view for messy, provenance-rich exploration
- `SpecView.tsx`: Derived, reference-based authoritative document

**Libraries** (`src/lib/`):
- `semantic-lift.ts`: Lift operation logic (create references, validate)
- `utils.ts`: Utility functions (cn, formatters)

**Hooks** (`src/hooks/`):
- `useKeyboardShortcuts.ts`: Global keyboard navigation

### Data Flow

**Creating Content**:
1. User types in Exploration view (TipTap editor)
2. Editor onChange → `documentStore.updateNodeContent(nodeId, content)`
3. Zustand updates `exploration.nodesById[nodeId]`
4. Persistence layer debounces and saves to IndexedDB

**Lifting to Spec**:
1. User selects node in Exploration, clicks "Lift"
2. `specStore.createTransclusion(sourceNodeId)` creates SpecBlock with reference
3. SpecView renders transclusion by reading source node from documentStore
4. Edits in Spec update source node; both views stay in sync

**Fold/Focus**:
1. User collapses node or focuses subtree
2. `viewStore.toggleCollapsed(nodeId)` or `viewStore.setFocusedRoot(nodeId)`
3. View state updates (ephemeral, not persisted)
4. Components re-render with filtered/collapsed nodes hidden

### Integration Points
**External APIs:**
- None in Phase 1 (local-only)
- **Future (M2)**: OpenAI API for scoped AI exploration
- **Future (Later)**: Sync service for multi-device persistence

## Security & Performance

### Security Considerations
- No authentication (local-only, single-user)
- Data lives entirely in browser (IndexedDB)
- No network requests (Phase 1)
- No server-side processing or storage

### Performance Requirements
- **Initial load**: < 1s for documents with 1000 nodes
- **Fold/expand**: < 100ms (pure view state change)
- **Node edit**: < 50ms to reflect in UI
- **Persistence**: Debounced saves (500ms) to avoid blocking edits
- **Scalability target**: 10,000 nodes without performance degradation

### Key Performance Strategies
- Zustand for efficient, granular state updates
- Virtual scrolling for large node lists (future optimization)
- Lazy rendering of collapsed subtrees (DOM not created)
- Debounced persistence to avoid write amplification
- Indexed lookups via `nodesById` map (O(1) node access)

---

## 🤖 Working with AI Agents

This architecture document is structured for `core` CLI intelligence:

```bash
# Use this architecture to create an intelligent project
core create my-project --parse-architecture docs/ARCHITECTURE.md

# The CLI will:
# ✅ Auto-detect optimal tech stack configuration
# ✅ Generate appropriate .env.example with detected variables
# ✅ Select correct preset (base vs supabase) based on choices
# ✅ Configure build tools and development environment
```

**Agent Development Workflow:**
1. Share this architecture with your development agent for technical context
2. Use the generated project structure as implementation foundation  
3. Reference environment variables for configuration setup
4. Update this document as technical decisions evolve

**Core CLI Commands:**
```bash
# Create project from this architecture
core create my-app --parse-architecture docs/ARCHITECTURE.md

# Add to existing project (coming in Phase 3)
core --docs --parse-architecture docs/ARCHITECTURE.md
```