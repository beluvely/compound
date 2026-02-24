# M1.5 Editor Fix: TipTap Integration Spike

**Initiative:** I2 - M1.5 Editor Foundation Gap Analysis & Fix  
**Spike Date:** 2026-02-21  
**Estimated Effort:** 2-3 weeks  
**Risk Level:** Medium

---

## 🎯 Spike Goal

Define a detailed technical approach for replacing SimpleBlockEditor with a TipTap-based implementation that delivers "Notion-grade" writing experience while maintaining the existing node graph architecture.

---

## 📐 Technical Approach

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ExplorationView / SpecView               │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │           TipTapNodeEditor Component               │   │
│  │                                                     │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │         TipTap EditorContent                 │ │   │
│  │  │  (ProseMirror under the hood)                │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  Custom Node Views:                                │   │
│  │  • NodeBlockView (paragraph)                       │   │
│  │  • HeadingBlockView (h1/h2/h3)                     │   │
│  │  • BulletBlockView (nested lists)                  │   │
│  │  • TransclusionBlockView (for Spec)                │   │
│  └────────────────────────────────────────────────────┘   │
│                          ↕                                  │
│            Bidirectional Sync Layer                        │
│                          ↕                                  │
│  ┌────────────────────────────────────────────────────┐   │
│  │          Document Store (Zustand)                  │   │
│  │                                                     │   │
│  │  exploration.nodesById[id] = {                     │   │
│  │    id, type, content, children, meta, ...          │   │
│  │  }                                                  │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

#### 1. **TipTap as Rich Text Layer**
- Handles all cursor, selection, undo/redo logic
- Provides natural arrow navigation (no manual focus management)
- Built-in markdown shortcuts
- Extensible via custom extensions

#### 2. **Custom Node Views for Block Rendering**
- Each block type gets a custom Node View
- Node Views render our Node data while TipTap handles interaction
- Allows: 
  - Custom styling per block type
  - Provenance indicators
  - Inline actions (lift, etc.)

#### 3. **Bidirectional Sync**
```typescript
// Store → TipTap (initialization)
const tiptapJSON = nodesToTipTapJSON(exploration.nodesById, exploration.rootIds)
editor.commands.setContent(tiptapJSON)

// TipTap → Store (on change)
editor.on('update', ({ editor }) => {
  const tiptapJSON = editor.getJSON()
  const updatedNodes = tiptapJSONToNodes(tiptapJSON)
  syncNodes(updatedNodes) // Diff and update store
})
```

#### 4. **Preserve Node IDs**
- TipTap nodes will have `attrs.nodeId` matching our Node.id
- Enables stable references for lifting/transclusion
- Sync layer uses nodeId to match TipTap state to store state

---

## 🔧 Implementation Phases

### Phase 1: Read-Only Rendering (3-5 days)

**Goal:** Display nodes in TipTap without editing

**Tasks:**
- [ ] Install/configure TipTap dependencies
- [ ] Create `TipTapNodeEditor.tsx` component
- [ ] Implement `nodesToTipTapJSON()` converter
  - [ ] Handle paragraph nodes
  - [ ] Handle heading nodes (H1/H2/H3)
  - [ ] Handle list nodes (bullets with nesting)
  - [ ] Preserve node IDs in attrs
- [ ] Create custom TipTap Document extension
  - [ ] Define schema for our block types
  - [ ] Add `nodeId` attribute to all block types
- [ ] Test rendering in ExplorationView (read-only)
- [ ] Test rendering in SpecView (read-only, transcluded nodes)
- [ ] Verify all node types display correctly
- [ ] Verify nested structures render
- [ ] Verify provenance metadata accessible

**Success Criteria:**
✅ All exploration nodes render in TipTap
✅ Headings styled correctly (H1/H2/H3)
✅ Bullet lists show nesting visually
✅ Node IDs preserved and accessible

**Risks:**
- TipTap JSON schema mismatch with our node structure
- Nested bullets rendering incorrectly

---

### Phase 2: Write-to-Store Sync (3-5 days)

**Goal:** Editing in TipTap updates the document store

**Tasks:**
- [ ] Implement `tiptapJSONToNodes()` converter
  - [ ] Parse TipTap JSON to Node[]
  - [ ] Preserve node IDs during parse
  - [ ] Handle text content changes
  - [ ] Handle block type changes
  - [ ] Handle structure changes (nesting, reordering)
- [ ] Create sync strategy
  - [ ] Diff algorithm: compare TipTap tree vs store tree
  - [ ] Update changed nodes only (don't recreate all)
  - [ ] Handle new nodes (Enter creates block)
  - [ ] Handle deleted nodes (Backspace merges/deletes)
  - [ ] Handle moved nodes (drag-and-drop, future)
- [ ] Wire up `editor.on('update')` handler
  - [ ] Debounce to avoid update storms
  - [ ] Batch updates for performance
  - [ ] Prevent infinite update loops (sync → update → sync)
- [ ] Add transaction filtering
  - [ ] Detect store-initiated changes (skip sync)
  - [ ] Detect user-initiated changes (trigger sync)
- [ ] Test basic editing
  - [ ] Type text → updates store
  - [ ] Change block type → updates store
  - [ ] Enter creates node in store
  - [ ] Backspace deletes/merges in store
- [ ] Verify persistence
  - [ ] Changes save to IndexedDB
  - [ ] Reload preserves edits

**Success Criteria:**
✅ Typing updates `node.content.value`
✅ Changing block type updates `node.content.type`
✅ Enter creates new node in store
✅ Backspace removes node from store
✅ No infinite update loops
✅ Changes persist across reload

**Risks:**
- Update loops (sync triggers update triggers sync)
- Performance with large documents (100+ nodes)
- Race conditions between user edits and store updates

---

### Phase 3: M1.5 Behaviors (3-5 days)

**Goal:** Port all M1.5 spec behaviors to TipTap

**Tasks:**

#### 3.1 Enter/Backspace Behaviors
- [ ] Configure TipTap hard break extension
- [ ] Test Enter in paragraph → new paragraph
- [ ] Test Enter in heading → new paragraph (exits heading)
- [ ] Test Enter in bullet → new bullet (continues list)
- [ ] Test Enter on empty styled block → exits to paragraph
- [ ] Test Backspace at start → merges with previous
- [ ] Test Backspace on empty block → deletes block
- [ ] Verify node creation/deletion syncs to store

#### 3.2 Markdown Shortcuts
- [ ] Test `#` + space → H1
- [ ] Test `##` + space → H2
- [ ] Test `###` + space → H3
- [ ] Test `-` + space → bullet list
- [ ] Test `[ ]` + space → checkbox (optional)
- [ ] Verify shortcuts work mid-document
- [ ] Verify undo after shortcut works

#### 3.3 Paste Behavior
- [ ] Test paste plain text → single block
- [ ] Test paste multi-paragraph → multiple blocks
- [ ] Test paste from Notion → preserve structure
- [ ] Test paste from Google Docs → clean formatting
- [ ] Test paste list → bullet blocks
- [ ] Verify pasted nodes sync to store

#### 3.4 Undo/Redo
- [ ] Test TipTap built-in undo/redo
- [ ] Test undo after Enter (deletes new block)
- [ ] Test undo after Backspace (restores deleted block)
- [ ] Test undo after paste (removes pasted blocks)
- [ ] Test undo after markdown shortcut (reverts type)
- [ ] Test redo for all above
- [ ] Consider: Store-level undo for lift/delete operations

#### 3.5 Keyboard Navigation
- [ ] Test arrow keys navigate naturally
- [ ] Test Shift+arrow selects across blocks
- [ ] Test Cmd+arrow (start/end of line/document)
- [ ] Test Tab in bullet list (indent)
- [ ] Test Shift+Tab in bullet list (outdent)
- [ ] Verify no focus jumping
- [ ] Verify cursor position stable

**Success Criteria:**
✅ All M1.5 behaviors work identically to spec
✅ No visual jank or delays
✅ Undo/redo feel natural
✅ Markdown shortcuts work consistently
✅ Paste feels intelligent

**Risks:**
- TipTap default behaviors conflict with our requirements
- Custom extensions needed for edge cases

---

### Phase 4: Lifting & Semantic Scope (2-3 days)

**Goal:** Semantic lifting works from TipTap

**Tasks:**
- [ ] Update `useKeyboardShortcuts.ts` to work with TipTap
  - [ ] Detect cursor position in TipTap (not textarea)
  - [ ] Get current node ID from TipTap selection
  - [ ] Call existing `resolveSemanticScope()`
- [ ] Test ⌘+Shift+L in paragraph
- [ ] Test ⌘+Shift+L in heading (lifts scope)
- [ ] Test ⌘+Shift+L in bullet (lifts subtree)
- [ ] Test ⌘+Shift+L mid-word (works regardless of cursor)
- [ ] Verify scope resolution still correct
- [ ] Verify toast notification works
- [ ] Test lifted content renders in Spec

**Success Criteria:**
✅ ⌘+Shift+L works from any cursor position
✅ Semantic scope resolution unchanged
✅ Lifted content appears in Spec correctly

**Risks:**
- Cursor position detection in TipTap different from textareas
- Selection API might need custom handling

---

### Phase 5: Custom Node Views (2-3 days)

**Goal:** Render blocks with custom React components

**Tasks:**
- [ ] Create `NodeBlockView` (paragraph with provenance)
- [ ] Create `HeadingBlockView` (styled headings)
- [ ] Create `BulletBlockView` (nested list rendering)
- [ ] Create `TransclusionBlockView` (for Spec, lifted content)
- [ ] Add hover affordances to Node Views
  - [ ] Show provenance on hover
  - [ ] Show "Lift" button (Exploration only)
  - [ ] Show "Jump to source" (Spec only)
- [ ] Wire up inline actions
  - [ ] Click "Lift" → lift this node
  - [ ] Click "Jump" → navigate to source
- [ ] Test custom styling applies
- [ ] Test hover states work
- [ ] Test inline actions work

**Success Criteria:**
✅ Block types render with custom React components
✅ Styling matches design system (grayscale)
✅ Hover affordances appear correctly
✅ Inline actions trigger correct behavior

**Risks:**
- Node Views complexity (React inside ProseMirror)
- Performance with many custom views (100+ blocks)

---

### Phase 6: Transclusion in Spec (2-3 days)

**Goal:** Spec view renders transcluded content from Exploration

**Tasks:**
- [ ] Update SpecView to use TipTapNodeEditor
- [ ] Implement transclusion Node View
  - [ ] Renders source node content (read-only)
  - [ ] Shows provenance indicator
  - [ ] Allows inline editing (updates source)
  - [ ] Shows "Jump to source" button
- [ ] Test rendering transcluded paragraph
- [ ] Test rendering transcluded heading
- [ ] Test rendering transcluded bullet list
- [ ] Test editing transcluded content
  - [ ] Edits update source node in Exploration
  - [ ] Exploration view updates in real-time
- [ ] Test ⌘+Enter jump to source
  - [ ] Navigates to Exploration
  - [ ] Highlights source block
  - [ ] Positions cursor in source

**Success Criteria:**
✅ Transcluded content renders correctly
✅ Editing transcluded content updates source
✅ Jump to source works perfectly
✅ Hover affordances show provenance

**Risks:**
- Two-way binding between Spec and Exploration might cause update loops
- Cursor position after jump needs careful handling

---

### Phase 7: Polish & Testing (3-5 days)

**Goal:** Production-ready, bug-free experience

**Tasks:**

#### Performance
- [ ] Profile TipTap with 100 nodes
- [ ] Profile TipTap with 1000 nodes
- [ ] Optimize sync algorithm if needed
- [ ] Add virtual scrolling if performance degrades
- [ ] Measure: < 50ms for all interactions

#### Edge Cases
- [ ] Test empty document (auto-create first block?)
- [ ] Test document with 1 node
- [ ] Test document with 1000+ nodes
- [ ] Test deeply nested bullets (5+ levels)
- [ ] Test very long paragraphs (1000+ words)
- [ ] Test rapid typing (no dropped characters)
- [ ] Test paste large content (10+ paragraphs)
- [ ] Test undo/redo 50+ times
- [ ] Test switching views while editing

#### Keyboard Shortcuts
- [ ] Verify all shortcuts still work
- [ ] Test ⌘+K (view switcher)
- [ ] Test ⌘+= / ⌘+- (nav)
- [ ] Test ⌘+Shift+L (lift)
- [ ] Test ⌘+Enter (jump)
- [ ] Test shortcuts don't conflict with TipTap

#### Accessibility
- [ ] Test keyboard-only navigation
- [ ] Test screen reader (basic)
- [ ] Test focus indicators visible
- [ ] Test ARIA labels present

#### Bugs & Regressions
- [ ] Verify persistence still works
- [ ] Verify all stores still sync
- [ ] Verify provenance tracking intact
- [ ] Verify semantic lift unchanged
- [ ] Verify view switching works
- [ ] Verify toast notifications work

**Success Criteria:**
✅ Zero known bugs
✅ Performance meets targets
✅ All edge cases handled gracefully
✅ Accessibility baseline met

---

## 📦 Dependencies & Setup

### New Dependencies (already installed)
```json
{
  "@tiptap/core": "^3.x",
  "@tiptap/react": "^3.x",
  "@tiptap/starter-kit": "^3.x",
  "@tiptap/extension-document": "^3.x",
  "@tiptap/extension-paragraph": "^3.x",
  "@tiptap/extension-text": "^3.x",
  "@tiptap/extension-heading": "^3.x",
  "@tiptap/extension-bullet-list": "^3.x",
  "@tiptap/extension-list-item": "^3.x",
  "@tiptap/extension-placeholder": "^3.x",
  "@tiptap/pm": "^3.x"
}
```

### Configuration
```typescript
// src/components/editor/TipTapNodeEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
// ... custom extensions
```

---

## 🗂️ File Structure

### New Files
```
src/
  components/
    editor/
      TipTapNodeEditor.tsx              # Main TipTap wrapper
      extensions/
        NodeBlockExtension.ts           # Custom Document/Block schema
        SemanticLiftExtension.ts        # Handle ⌘+Shift+L
      node-views/
        NodeBlockView.tsx               # Paragraph node view
        HeadingBlockView.tsx            # Heading node view
        BulletBlockView.tsx             # List node view
        TransclusionBlockView.tsx       # Spec transclusion view
  lib/
    tiptap-sync.ts                      # Bidirectional sync utils
      - nodesToTipTapJSON()
      - tiptapJSONToNodes()
      - diffNodes()
      - syncNodes()
```

### Modified Files
```
src/
  app/
    ExplorationView.tsx                 # Use TipTapNodeEditor
    SpecView.tsx                        # Use TipTapNodeEditor
  components/
    common/
      NodeEditor.tsx                    # Update or remove
  hooks/
    useKeyboardShortcuts.ts             # Update for TipTap
```

### Removed Files
```
src/
  components/
    editor/
      SimpleBlockEditor.tsx             # Delete or archive
```

---

## 🧪 Testing Strategy

### Unit Tests (future)
- `tiptap-sync.ts` converters
- `resolveSemanticScope()` with TipTap nodes
- Diff algorithm

### Integration Tests (manual for now)
- Full writing flow (type → save → reload)
- Lift operation end-to-end
- View switching with cursor preservation
- Paste operations

### User Acceptance Testing
- [ ] Can write 1000+ words without issues
- [ ] Arrow keys feel natural (no delay)
- [ ] Markdown shortcuts work every time
- [ ] Lifting feels instant
- [ ] Spec editing updates Exploration visibly
- [ ] No crashes or data loss

---

## 📊 Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Arrow Nav Speed** | < 10ms | Chrome DevTools Performance |
| **Enter/Backspace Speed** | < 50ms | Chrome DevTools Performance |
| **Sync Latency** | < 100ms | Time from TipTap update to store update |
| **Undo/Redo Depth** | 100+ actions | Test undo 100 times, verify stack |
| **Large Doc Performance** | 1000 nodes, < 50ms interactions | Create 1000-node doc, measure typing |
| **Zero Focus Jumps** | 0 | Qualitative: can't detect focus changes |
| **Paste Accuracy** | 100% | Paste from Notion/GDocs, verify structure |

---

## ⚠️ Risks & Mitigations

### High Risk: Sync Loop (TipTap ↔ Store)

**Risk:** Update from store triggers TipTap update, which triggers store update, infinite loop

**Mitigation:**
```typescript
let isSyncing = false

editor.on('update', ({ editor }) => {
  if (isSyncing) return // Skip if update came from store
  
  isSyncing = true
  const nodes = tiptapJSONToNodes(editor.getJSON())
  syncNodes(nodes)
  isSyncing = false
})

// When updating from store:
isSyncing = true
editor.commands.setContent(tiptapJSON)
isSyncing = false
```

### Medium Risk: Performance with Large Docs

**Risk:** 1000+ nodes cause slowdown

**Mitigation:**
- Lazy rendering (only render visible blocks)
- Virtual scrolling (react-window)
- Debounce sync (100ms)
- Profile early, optimize incrementally

### Medium Risk: Node ID Preservation

**Risk:** TipTap operations lose node IDs

**Mitigation:**
- Enforce `nodeId` in schema (required attribute)
- Test ID preservation after every operation
- Add validation in sync layer

### Low Risk: Custom Node Views Complexity

**Risk:** React inside ProseMirror is complex

**Mitigation:**
- Start with simple views (no state)
- Use TipTap's NodeViewWrapper helpers
- Refer to TipTap docs/examples frequently

---

## 📋 Detailed Task Checklist

### Phase 1: Read-Only Rendering (3-5 days)
- [ ] 1.1: Install TipTap dependencies
- [ ] 1.2: Create `TipTapNodeEditor.tsx` scaffold
- [ ] 1.3: Implement `nodesToTipTapJSON()` for paragraphs
- [ ] 1.4: Implement `nodesToTipTapJSON()` for headings
- [ ] 1.5: Implement `nodesToTipTapJSON()` for bullets
- [ ] 1.6: Add `nodeId` attribute to TipTap schema
- [ ] 1.7: Create custom Document extension
- [ ] 1.8: Test rendering 10 paragraphs
- [ ] 1.9: Test rendering headings (H1/H2/H3)
- [ ] 1.10: Test rendering nested bullets (3 levels)
- [ ] 1.11: Verify node IDs accessible in TipTap state
- [ ] 1.12: Wire TipTapNodeEditor into ExplorationView
- [ ] 1.13: Test full document renders (100+ nodes)

### Phase 2: Write-to-Store Sync (3-5 days)
- [ ] 2.1: Implement `tiptapJSONToNodes()` for paragraphs
- [ ] 2.2: Implement `tiptapJSONToNodes()` for headings
- [ ] 2.3: Implement `tiptapJSONToNodes()` for bullets
- [ ] 2.4: Create `diffNodes()` comparison function
- [ ] 2.5: Create `syncNodes()` store updater
- [ ] 2.6: Wire `editor.on('update')` handler
- [ ] 2.7: Add sync loop prevention (isSyncing flag)
- [ ] 2.8: Add debouncing (100ms)
- [ ] 2.9: Test typing updates store
- [ ] 2.10: Test Enter creates node in store
- [ ] 2.11: Test Backspace deletes node in store
- [ ] 2.12: Test no infinite loops (log count)
- [ ] 2.13: Test persistence (reload preserves changes)

### Phase 3: M1.5 Behaviors (3-5 days)
- [ ] 3.1: Test Enter in paragraph → new paragraph
- [ ] 3.2: Test Enter in heading → exits to paragraph
- [ ] 3.3: Test Enter in bullet → continues list
- [ ] 3.4: Test Backspace at start → merges blocks
- [ ] 3.5: Test Backspace on empty → deletes block
- [ ] 3.6: Test `#` space → H1
- [ ] 3.7: Test `##` space → H2
- [ ] 3.8: Test `###` space → H3
- [ ] 3.9: Test `-` space → bullet
- [ ] 3.10: Test paste plain text
- [ ] 3.11: Test paste multi-paragraph
- [ ] 3.12: Test paste from Notion
- [ ] 3.13: Test undo after Enter
- [ ] 3.14: Test undo after Backspace
- [ ] 3.15: Test undo after markdown shortcut
- [ ] 3.16: Test redo for all above
- [ ] 3.17: Test arrow navigation (no delay)
- [ ] 3.18: Test Shift+arrow selection
- [ ] 3.19: Test Tab/Shift+Tab in bullets

### Phase 4: Lifting & Semantic Scope (2-3 days)
- [ ] 4.1: Update `useKeyboardShortcuts` for TipTap
- [ ] 4.2: Get current node ID from TipTap selection
- [ ] 4.3: Test ⌘+Shift+L in paragraph
- [ ] 4.4: Test ⌘+Shift+L in heading
- [ ] 4.5: Test ⌘+Shift+L in bullet
- [ ] 4.6: Test mid-word lifting
- [ ] 4.7: Verify scope resolution correct
- [ ] 4.8: Verify toast shows block count
- [ ] 4.9: Test lifted content in Spec

### Phase 5: Custom Node Views (2-3 days)
- [ ] 5.1: Create `NodeBlockView.tsx` scaffold
- [ ] 5.2: Create `HeadingBlockView.tsx`
- [ ] 5.3: Create `BulletBlockView.tsx`
- [ ] 5.4: Add hover affordances (border, badge)
- [ ] 5.5: Add "Lift" button (Exploration)
- [ ] 5.6: Add "Jump to source" button (Spec)
- [ ] 5.7: Test hover shows provenance
- [ ] 5.8: Test click "Lift" works
- [ ] 5.9: Test click "Jump" works
- [ ] 5.10: Verify styling matches design system

### Phase 6: Transclusion in Spec (2-3 days)
- [ ] 6.1: Create `TransclusionBlockView.tsx`
- [ ] 6.2: Implement read-only rendering of source
- [ ] 6.3: Add inline edit mode (click to edit)
- [ ] 6.4: Wire edits to update source node
- [ ] 6.5: Test editing transcluded paragraph
- [ ] 6.6: Test Exploration updates in real-time
- [ ] 6.7: Implement ⌘+Enter jump to source
- [ ] 6.8: Test navigation to Exploration
- [ ] 6.9: Test source highlight appears
- [ ] 6.10: Test cursor positioned in source

### Phase 7: Polish & Testing (3-5 days)
- [ ] 7.1: Profile with 100 nodes
- [ ] 7.2: Profile with 1000 nodes
- [ ] 7.3: Optimize if > 50ms interactions
- [ ] 7.4: Test empty document
- [ ] 7.5: Test 1-node document
- [ ] 7.6: Test deeply nested bullets (5+ levels)
- [ ] 7.7: Test very long paragraph (1000+ words)
- [ ] 7.8: Test rapid typing (no dropped chars)
- [ ] 7.9: Test paste 50-paragraph document
- [ ] 7.10: Test undo/redo 100 times
- [ ] 7.11: Test switching views while editing
- [ ] 7.12: Verify all shortcuts work
- [ ] 7.13: Test keyboard-only navigation
- [ ] 7.14: Verify focus indicators visible
- [ ] 7.15: Run full regression test suite

---

## 🎯 Definition of Done

This spike is complete when:

✅ All 7 phases have detailed task breakdown  
✅ Risk assessment complete with mitigations  
✅ File structure defined  
✅ Testing strategy documented  
✅ Success metrics defined  

Implementation is complete when:

✅ All tasks in all phases completed  
✅ All success criteria met  
✅ All M1.5 spec requirements delivered  
✅ Zero CRITICAL or HIGH severity bugs  
✅ Performance targets met  
✅ User acceptance testing passed  
✅ SimpleBlockEditor removed from codebase  
✅ Documentation updated  

---

## 📚 References

- TipTap Docs: https://tiptap.dev/docs
- ProseMirror Guide: https://prosemirror.net/docs/guide/
- M1.5 Spec: `docs/INITIATIVES/I1-foundation/milestones/m1.5-writing-surface-foundation.md`
- Gap Analysis: `docs/INITIATIVES/I2-m1.5-editor-foundation/GAP-ANALYSIS.md`
- Node Types: `src/domain/types.ts`

---

## 💬 Open Questions

1. **Should we keep SimpleBlockEditor as fallback?**
   - **Recommendation**: No, remove after TipTap is stable. Maintaining two editors is complexity burden.

2. **Virtual scrolling for large docs?**
   - **Recommendation**: Profile first, add only if needed. TipTap handles 1000+ nodes well.

3. **Store-level undo for lift/delete operations?**
   - **Recommendation**: Phase 2 feature. TipTap undo handles editing; store undo handles structure.

4. **Collaboration support in Phase 1?**
   - **Recommendation**: No. Focus on single-user. Y.js integration is separate milestone (future).

---

**Next Step:** Begin Phase 1 implementation →
