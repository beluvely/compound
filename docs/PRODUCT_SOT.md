# PRODUCT_SOT — Compound

*This document can be parsed by `core` CLI to extract product vision and strategic goals*

## Vision Statement

Compound is a document-first, local-first knowledge workspace where exploration, structure, and AI stay aligned as understanding compounds over time. It enables knowledge workers to capture messy exploration, derive authoritative specs from it, and maintain trust through provenance—without duplication or forking.

**Primary Value**: Transform ephemeral AI-assisted thinking into a durable, traceable knowledge system that grows more valuable over time.

## Target Users
- **Primary**: Knowledge workers (researchers, engineers, designers) who think through writing and regularly work with AI assistants
- **Secondary**: Product teams and strategic thinkers who need to maintain alignment between exploratory work and authoritative documentation
- **Tertiary**: Technical writers and documentation maintainers who need provenance tracking for long-lived documents

## Goals & Objectives

*Structure goals clearly for automatic extraction and initiative generation*

- **Goal 1**: Enable users to capture and organize AI-assisted exploration without losing context or provenance
- **Goal 2**: Derive authoritative documents (Spec) from exploratory work through references, not duplication
- **Goal 3**: Make documents more usable as they grow in size and complexity over time
- **Goal 4**: Ensure all content is addressable, traceable, and reversibly transformable

## Success Metrics

*Define quantifiable outcomes for tracking*

- **User Engagement**: Users return to documents for weeks/months without losing context
- **Content Quality**: 90%+ of Spec content comes from references (not copy-paste)
- **Technical Performance**: Documents with 1000+ nodes remain instantly responsive
- **User Satisfaction**: Users can answer "where did this come from?" for any content within one interaction

## Problem We're Solving

**Current State Problems**:
- AI-assisted work produces throwaway text that's disconnected from knowledge systems
- Copy-paste between exploration and documentation creates drift and version conflicts
- Large documents become unusable as they grow; users lose context and provenance
- Chat interfaces don't preserve spatial, structural thinking or enable reuse
- No clear boundary between "thinking" and "decided" content

**Root Cause**: Existing tools treat knowledge as either ephemeral (chat) or final (published docs), with no system for managing the evolution from exploration to authority while preserving linkage.

## Solution Approach

**Core Workflow** (Minimum Viable Flow):
1. User writes and explores in Exploration Document (human + AI collaboration)
2. User "lifts" valuable nodes into Spec Document (creating live references)
3. User edits content in Spec; changes propagate to source node in Exploration
4. User can always trace Spec content back to its provenance and rationale

## Competitive Landscape

**Similar Solutions**:
- **Notion/Obsidian**: Great for structured notes, but block references are limited and exploration/authority aren't distinct surfaces
- **Chat interfaces (ChatGPT, Claude)**: Strong for exploration, but output is ephemeral and not reusable in a knowledge system
- **Roam Research**: Bidirectional linking, but no concept of "authority" vs "exploration" and heavy on navigation
- **Google Docs + Comments**: Strong for collaboration, but no addressable nodes, no AI scoping, copy-paste culture

**Our Differentiation**: Only system with distinct Exploration/Spec surfaces bound by live references, addressable nodes with provenance, and AI interactions scoped to document nodes (not detached chats).

## Strategic Priorities

*These will be converted to initiatives automatically*

- **Phase 1 (Foundation - M1)**: Reference-based reuse, addressable nodes, basic Exploration/Spec surfaces
- **Phase 2 (AI Integration - M2)**: Scoped AI exploration, turnaround loops, provenance tracking
- **Phase 3 (Normalization - M3)**: Drift detection, canonical vocabulary enforcement, assumption tracking
- **Phase 4 (Rollups - M4)**: Decisions, rollups, executive views for long-lived documents
- **Phase 5 (History - M5)**: History, snapshots, and trust mechanisms for time-based confidence

---

## 🤖 Working with AI Agents

This SOT document is structured for `core` CLI intelligence:

```bash
# Use this SOT to create an intelligent project  
core create my-project --parse-sot docs/PRODUCT_SOT.md

# The CLI will:
# ✅ Extract strategic goals and convert to trackable features
# ✅ Generate initiative structure from strategic priorities
# ✅ Create context-aware documentation
# ✅ Establish success metrics framework
```

**Agent Collaboration Workflow:**
1. **Planning Phase**: Share this SOT with your agent for product context
2. **Development Phase**: Reference goals and success metrics for feature prioritization
3. **Validation Phase**: Use success metrics to validate implementation decisions
4. **Iteration Phase**: Update this document as product strategy evolves

**Product Development Commands:**
```bash
# Create product-driven project structure
core create my-app --parse-sot docs/PRODUCT_SOT.md --parse-prd docs/PRD.md

# Generate initiatives from strategic priorities  
npm run i:add --report strategic-analysis

# Track progress against success metrics
# (Use generated initiative structure for milestone tracking)
```

**Key Sections for Agent Context:**
- **Vision Statement** → Overall product direction
- **Goals & Objectives** → Development priorities  
- **Success Metrics** → Definition of done criteria
- **Strategic Priorities** → Implementation roadmap

## Goals
- Make AI-assisted work durable and traceable instead of disposable
- Eliminate duplication while enabling seamless reuse across exploration and authority
- Scale document usability with complexity (more content = more usable, not less)

## Anti-goals
- Building a chat interface or task manager with AI features
- Creating a publishing platform or presentation tool
- Implementing collaborative editing or real-time sync (Phase 1)
- Supporting unstructured markdown blobs instead of addressable nodes

## Non-goals (v1)
- Real-time collaboration or multiplayer editing
- Server sync or cloud storage
- Mobile apps or responsive mobile design
- Import/export for other note-taking formats
- Plugin/extension ecosystem

## Core concepts
- **Node**: Addressable block of content with stable ID, type, provenance, and metadata
- **Document**: Graph of nodes (not a markdown blob); Exploration owns all content
- **Lift**: Creating a live reference from Spec to a node in Exploration (not copy-paste)
- **Transclusion**: Live pointer that renders content from source node; edits propagate
- **Provenance**: Traceable origin of content (user-created, derived, AI-generated)
- **Fold/Focus**: View-state only operations that hide noise without destroying data
- **Loop**: Turnaround loop capturing AI-driven exploration scoped to a node

## Key constraints
- Local-first: Data lives in browser (IndexedDB); no server dependency
- Editor-first: Writing and thinking happen inline, not in modals or wizards
- Reversible by default: No operation destroys data; all transformations are undoable
- Stable IDs: Every node has a permanent ID; references survive restructuring
- Grayscale UI: Wireframe-neutral design to avoid premature polish

## Success metrics
- Time to answer "where did this come from?": < 2 interactions
- Percentage of Spec content that is transcluded (not duplicated): > 90%
- Documents remain usable with 1000+ nodes (measured by fold/focus latency)
- User retention on multi-week projects (knowledge compounds vs decays)

## Open questions / assumptions
- ASSUMPTION: Users work on long-lived projects (weeks to months), not daily notes
- ASSUMPTION: AI collaboration is integral to exploration, not an afterthought
- QUESTION: How aggressively should normalization suggest canonical vocabulary in v1?
- QUESTION: What is the minimum viable AI integration for M2 (scoped chat? inline suggestions?)?