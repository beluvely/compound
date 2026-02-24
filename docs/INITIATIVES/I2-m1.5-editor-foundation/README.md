# I2 — M1.5 Editor Foundation Gap Analysis & Fix

## Outcome
Deliver a production-ready, Notion-grade writing experience by fixing the M1.5 editor implementation. Replace the current textarea-based block editor with a proper rich text editor (TipTap) that provides smooth arrow navigation, natural Enter/Backspace behavior, and seamless editing across multiple blocks.

## Context
M1.5 was marked as "complete" with SimpleBlockEditor (textarea-per-block), but this implementation doesn't deliver the promised Notion-grade experience:
- Arrow navigation between blocks is janky (focus jumping)
- Text selection doesn't flow naturally across blocks
- Enter/Backspace operations recreate DOM elements
- No multi-block selection or natural text flow

This gap blocks M2 (Scoped AI Exploration) because users won't tolerate poor editing combined with AI complexity.

## Scope
**What is included:**
- Gap analysis: Current M1.5 implementation vs specification
- Spike: Detailed technical plan for TipTap integration
- TipTap ↔ Node graph bidirectional sync implementation
- Natural keyboard navigation (arrows, Enter, Backspace)
- Markdown shortcuts (#, ##, -, etc.)
- Semantic scope lifting with proper cursor handling
- Block-aware undo/redo

**What is NOT included:**
- AI integration (M2)
- Node state tracking (M4)
- Collaboration features
- Mobile responsiveness

## Non-scope
- Real-time collaboration
- Version history (M5)
- Advanced formatting (tables, embeds)
- Plugin/extension system

## Acceptance criteria
- [ ] Arrow keys navigate naturally across blocks without focus jumps
- [ ] Enter/Backspace feel identical to Notion or Google Docs
- [ ] Multi-block text selection works smoothly
- [ ] Markdown shortcuts work consistently (# for heading, etc.)
- [ ] Semantic lifting (⌘+Shift+L) works from any cursor position
- [ ] Undo/redo respects block boundaries
- [ ] No visual jank when editing (DOM stability)
- [ ] Performance: Documents with 100+ blocks remain responsive (<50ms interactions)
- [ ] Gap analysis document completed
- [ ] Spike document with implementation plan completed

## Success Metrics
- Time to navigate between blocks: <10ms (imperceptible)
- User can write for 30+ minutes without noticing "blocks"
- Zero DOM recreations during normal editing
- Lift operation works 100% of the time regardless of cursor position

## Timeline
- **Gap Analysis**: 1-2 days
- **Spike/Planning**: 2-3 days
- **Implementation**: 1-2 weeks
- **Testing/Polish**: 3-5 days

**Total estimate**: 3-4 weeks

## Risks & Mitigations
- **Risk**: TipTap integration is more complex than anticipated
  - **Mitigation**: Start with read-only rendering, add editing incrementally
- **Risk**: Node graph ↔ TipTap sync creates bugs
  - **Mitigation**: Write comprehensive sync tests, use TipTap's transaction system
- **Risk**: Performance degrades with large documents
  - **Mitigation**: Lazy rendering, virtual scrolling if needed

## Dependencies
- Blocks M2 (Scoped AI Exploration)
- Blocks M3 (Normalization)
- Required for all future milestones

## Next Steps
1. Complete gap analysis (compare spec vs implementation)
2. Create spike document with technical approach
3. Prototype TipTap → Node sync (read-only)
4. Implement bidirectional sync
5. Port all M1.5 behaviors to TipTap implementation
