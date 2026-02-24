# I2 Implementation Plan

## Current Status: 📋 PLANNING

**Last Updated:** 2026-02-21  
**Phase:** Gap Analysis & Spike Complete  
**Next:** Ready to begin Phase 1 implementation

---

## Initiative Overview

Replace SimpleBlockEditor with TipTap-based implementation to deliver "Notion-grade" writing experience as specified in M1.5.

**Key Documents:**
- [README.md](README.md) - Initiative overview and acceptance criteria
- [GAP-ANALYSIS.md](GAP-ANALYSIS.md) - Detailed comparison of spec vs current implementation
- [SPIKE.md](SPIKE.md) - Technical approach and task breakdown

---

## Implementation Phases

### ✅ Phase 0: Analysis (COMPLETE)
- [x] Create initiative structure
- [x] Complete gap analysis
- [x] Document critical issues
- [x] Create technical spike
- [x] Define success metrics

### 📋 Phase 1: Read-Only Rendering (3-5 days)
**Goal:** Display nodes in TipTap without editing

- [ ] Install/configure TipTap
- [ ] Create TipTapNodeEditor component
- [ ] Implement nodesToTipTapJSON converter
- [ ] Define custom schema with nodeId
- [ ] Test rendering all block types
- [ ] Verify nested structures

**Completion Criteria:**
- All exploration nodes render correctly
- Node IDs preserved and accessible
- No editing functionality yet (read-only)

### 📋 Phase 2: Write-to-Store Sync (3-5 days)
**Goal:** Editing in TipTap updates document store

- [ ] Implement tiptapJSONToNodes converter
- [ ] Create diff and sync functions
- [ ] Wire editor.on('update') handler
- [ ] Prevent infinite update loops
- [ ] Test all editing operations sync to store
- [ ] Verify persistence works

**Completion Criteria:**
- Typing updates store
- Enter/Backspace modify store correctly
- No sync loops
- Changes persist across reload

### 📋 Phase 3: M1.5 Behaviors (3-5 days)
**Goal:** All spec behaviors working

- [ ] Enter/Backspace behaviors
- [ ] Markdown shortcuts (#, ##, -)
- [ ] Paste multi-paragraph
- [ ] Undo/redo testing
- [ ] Arrow navigation testing

**Completion Criteria:**
- All M1.5 editing behaviors work
- Keyboard navigation feels natural
- No visual jank

### 📋 Phase 4: Lifting & Semantic Scope (2-3 days)
**Goal:** Lifting works from TipTap

- [ ] Update keyboard shortcuts for TipTap
- [ ] Detect cursor position in TipTap
- [ ] Test lifting all block types
- [ ] Verify scope resolution unchanged

**Completion Criteria:**
- ⌘+Shift+L works from any position
- Semantic scope resolution correct
- Lifted content renders in Spec

### 📋 Phase 5: Custom Node Views (2-3 days)
**Goal:** Blocks render with custom React components

- [ ] Create NodeBlockView
- [ ] Create HeadingBlockView
- [ ] Create BulletBlockView
- [ ] Add hover affordances
- [ ] Wire inline actions (Lift, Jump)

**Completion Criteria:**
- Custom styling applied
- Hover shows provenance
- Inline actions work

### 📋 Phase 6: Transclusion in Spec (2-3 days)
**Goal:** Spec renders transcluded content correctly

- [ ] Create TransclusionBlockView
- [ ] Implement inline editing
- [ ] Wire edits to update source
- [ ] Implement jump to source
- [ ] Test real-time updates

**Completion Criteria:**
- Transcluded content renders
- Editing updates source in Exploration
- Jump to source works perfectly

### 📋 Phase 7: Polish & Testing (3-5 days)
**Goal:** Production-ready quality

- [ ] Performance profiling (100, 1000 nodes)
- [ ] Edge case testing
- [ ] Keyboard shortcut verification
- [ ] Accessibility baseline
- [ ] Bug fixes
- [ ] Remove SimpleBlockEditor

**Completion Criteria:**
- Zero critical/high bugs
- Performance targets met
- All edge cases handled
- SimpleBlockEditor deleted

---

## Tasks by Week

### Week 1 (Feb 21-27)
- [ ] Phase 1: Read-Only Rendering (complete)
- [ ] Phase 2: Write-to-Store Sync (start)

### Week 2 (Feb 28 - Mar 6)
- [ ] Phase 2: Write-to-Store Sync (complete)
- [ ] Phase 3: M1.5 Behaviors (complete)
- [ ] Phase 4: Lifting (start)

### Week 3 (Mar 7-13)
- [ ] Phase 4: Lifting (complete)
- [ ] Phase 5: Custom Node Views (complete)
- [ ] Phase 6: Transclusion (complete)

### Week 4 (Mar 14-20)
- [ ] Phase 7: Polish & Testing (complete)
- [ ] Final QA
- [ ] Documentation
- [ ] Ship ✅

---

## Decisions Log

### Decision 1: Use TipTap (not Lexical)
**Date:** 2026-02-21  
**Context:** Need to choose rich text editor  
**Decision:** TipTap (ProseMirror-based)  
**Reasoning:**
- Already installed in dependencies
- Battle-tested (Notion, Confluence use ProseMirror)
- Excellent TypeScript support
- Strong community and docs
- Y.js integration for future collaboration

**Alternatives Considered:**
- Lexical (newer, less mature)
- ProseMirror directly (too complex)
- Continue with SimpleBlockEditor (rejected: can't deliver quality)

### Decision 2: Bidirectional Sync (not One-Way)
**Date:** 2026-02-21  
**Context:** How to handle TipTap ↔ Store communication  
**Decision:** Bidirectional sync with loop prevention  
**Reasoning:**
- Allows external updates (e.g., AI adding nodes)
- Preserves store as source of truth
- Enables persistence
- Loop prevention via isSyncing flag

**Alternatives Considered:**
- TipTap as source of truth (rejected: loses store benefits)
- One-way sync (rejected: can't handle external updates)

### Decision 3: Custom Node Views for Blocks
**Date:** 2026-02-21  
**Context:** How to render provenance and affordances  
**Decision:** Use TipTap NodeViews with React components  
**Reasoning:**
- Allows custom styling per block
- Enables hover affordances
- Supports inline actions (Lift, Jump)
- Maintains TipTap editing benefits

**Alternatives Considered:**
- CSS-only styling (rejected: insufficient for actions)
- Separate overlay UI (rejected: harder to maintain)

---

## Risks & Mitigations

### 🔴 High Risk: Sync Loop
**Description:** TipTap update triggers store update, which triggers TipTap update, infinite loop  
**Impact:** App freezes, data corruption  
**Mitigation:** `isSyncing` flag, transaction filtering, debouncing  
**Status:** Planned for Phase 2

### 🟡 Medium Risk: Performance with Large Docs
**Description:** 1000+ nodes might cause slowdown  
**Impact:** Poor UX, laggy typing  
**Mitigation:** Profile early, lazy rendering, virtual scrolling if needed  
**Status:** Will assess in Phase 7

### 🟡 Medium Risk: Node ID Preservation
**Description:** TipTap operations might lose node IDs  
**Impact:** Broken references, lost transclusions  
**Mitigation:** Enforce nodeId in schema, test after every operation  
**Status:** Will enforce in Phase 1

### 🟢 Low Risk: Custom Node Views Complexity
**Description:** React inside ProseMirror can be tricky  
**Impact:** Bugs, maintenance burden  
**Mitigation:** Start simple, use TipTap helpers, refer to docs  
**Status:** Acceptable risk

---

## Progress Notes

### 2026-02-21: Initiative Created
- Completed gap analysis
- Identified 15 gaps (5 blocking)
- Root cause: textarea-per-block architecture
- Created technical spike with 7 phases
- Estimated 2-3 weeks implementation
- Ready to begin Phase 1

---

## Blockers

*None currently*

---

## Dependencies

### Internal
- Blocks: M2 (Scoped AI Exploration)
- Blocks: M3 (Normalization)
- Blocks: All future milestones

### External
- TipTap v3 (already installed)
- Existing stores (document, view, navigation) - no changes needed
- Existing semantic-lift.ts - will reuse

---

## Success Metrics

| Metric | Current (SimpleBlockEditor) | Target (TipTap) | How to Measure |
|--------|----------------------------|-----------------|----------------|
| Arrow Nav Speed | ~150ms (focus jump) | < 10ms | DevTools Performance |
| Enter/Backspace | ~100ms (DOM recreate) | < 50ms | DevTools Performance |
| Multi-block Selection | ❌ Not possible | ✅ Works | Manual test |
| Undo/Redo Depth | ~10 (per-block) | 100+ | Test undo 100x |
| Paste Accuracy | 0% (plain text only) | 100% | Paste from Notion |
| Focus Jumps | ~5 per minute | 0 | User observation |

---

## Done When

This initiative is complete when:

✅ All 7 implementation phases completed  
✅ All acceptance criteria met (see README.md)  
✅ All success metrics hit targets  
✅ Zero critical/high bugs  
✅ User acceptance testing passed  
✅ SimpleBlockEditor removed from codebase  
✅ Documentation updated  
✅ M1.5 can be confidently marked "COMPLETE"  

**Ship Date Target:** March 20, 2026

---

## Next Steps

1. **Immediate:** Begin Phase 1 (Read-Only Rendering)
   - Create `TipTapNodeEditor.tsx` component
   - Implement `nodesToTipTapJSON()` converter
   - Wire into ExplorationView

2. **This Week:** Complete Phases 1 & 2
   - Render all node types
   - Implement bidirectional sync
   - Test editing updates store

3. **Next Week:** Complete Phases 3 & 4
   - Port M1.5 behaviors
   - Enable semantic lifting

4. **Week 3:** Complete Phases 5 & 6
   - Custom node views
   - Transclusion in Spec

5. **Week 4:** Phase 7 & Ship
   - Polish, testing, bug fixes
   - Remove SimpleBlockEditor
   - Ship to users

---

## References

- M1.5 Spec: `docs/INITIATIVES/I1-foundation/milestones/m1.5-writing-surface-foundation.md`
- Gap Analysis: [GAP-ANALYSIS.md](GAP-ANALYSIS.md)
- Technical Spike: [SPIKE.md](SPIKE.md)
- README Invariants: `../../README.md`
- Node Types: `src/domain/types.ts`
- TipTap Docs: https://tiptap.dev/docs
