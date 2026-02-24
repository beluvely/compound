# PRD — Compound

*This document can be parsed by `core` CLI to intelligently generate project structure and features*

## Project Overview
**Brief description**: A document-first, local-first knowledge workspace where exploration, structure, and AI stay aligned as knowledge compounds over time.

**Project Type**: Desktop-first web application (SPA) for knowledge work

## User Stories

*Format user stories as "As a [role], I want [goal] so that [benefit]" for optimal parsing*

As a researcher, I want to capture AI-assisted exploration in addressable nodes so that I can reuse and reference content without copy-paste.

As a product manager, I want to lift valuable exploration nodes into a clean Spec document so that I can maintain an authoritative view without losing provenance.

As a technical writer, I want to edit lifted content and have changes propagate to the source so that exploration and spec stay aligned.

As a knowledge worker, I want to fold/focus large documents without losing content so that complexity doesn't reduce usability.

As a team lead, I want to trace any spec statement back to its exploration context so that I can understand the rationale behind decisions.

## Functional Requirements

*List specific features and capabilities - these will be extracted as project features*

- **Addressable Nodes**: Every block has a stable ID; content cannot exist without an owning node
- **Exploration Document**: Users write, think, and collaborate with AI in a messy, provenance-rich surface
- **Spec Document**: Composed entirely of live references (transclusions) to Exploration nodes
- **Lift Operation**: Create a reference from Spec to an Exploration node; editing either updates the source
- **Fold/Collapse**: Hide subtrees or verbose content without deleting; pure view-state operation
- **Focus Mode**: Temporarily scope document view to a single root and its subtree
- **Provenance Tracking**: Every node has metadata indicating origin (user, derived, AI, etc.)
- **Inline Editing**: All editing happens in place, spatially stable, no modals
- **Local-first Persistence**: All data stored in IndexedDB; no server dependency
- **View State Separation**: Document data (nodes, structure) is separate from view state (collapsed, focused)
- **Keyboard Navigation**: Primary actions accessible via keyboard shortcuts

## Technical Requirements

*Mention specific technologies to influence automatic tech stack selection*

- **Frontend**: React 19 with TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (grayscale, wireframe-neutral)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: lucide-react
- **Editor**: TipTap (ProseMirror-based rich text editing)
- **State Management**: Zustand (document store, view store, spec store)
- **Persistence**: IndexedDB via idb-keyval (local-first)
- **Backend**: None (Phase 1)
- **Database**: None (client-side only)
- **Authentication**: None (local-only, Phase 1)
- **Real-time**: None (no collaboration, Phase 1)

## Success Metrics

*Define measurable outcomes*

- **Zero duplication**: >90% of Spec content comes from references, not copies
- **Instant provenance**: Users can trace content origin within 2 interactions
- **Scales with complexity**: 1000+ node documents remain responsive (<100ms interactions)
- **Long-term viability**: Users return to projects after weeks without losing context

## Roadmap

*Structure as phases for automatic initiative generation*

- **M1 - Reference Without Duplication**: Addressable nodes, Exploration/Spec surfaces, lift operation, transclusion rendering
- **M1.5 - Writing Surface Foundation**: TipTap integration, block types, keyboard shortcuts, inline editing
- **M2 - Scoped AI Exploration**: AI conversations scoped to nodes, turnaround loops, provenance capture
- **M3 - Normalization & Drift Awareness**: Canonical vocabulary, assumption tracking, drift detection
- **M4 - Decisions & Rollups**: Decision nodes, rollup views, executive summaries for long documents
- **M5 - History & Trust**: Snapshots, version history, confidence scoring based on provenance age

---

## 🤖 Working with AI Agents

This PRD is structured to work with the `core` CLI intelligence:

```bash
# Use this PRD to create an intelligent project
core create my-project --parse-prd docs/PRD.md --parse-architecture docs/ARCHITECTURE.md

# The CLI will:
# ✅ Extract user stories and convert to features
# ✅ Detect tech stack requirements and select optimal preset
# ✅ Generate contextual project structure
# ✅ Convert roadmap phases to actionable initiatives
```

**Agent Collaboration Tips:**
1. Share this PRD with your development agent for context
2. Use the generated initiatives as task breakdowns
3. Reference the extracted features for implementation guidance
4. Update this document as requirements evolve