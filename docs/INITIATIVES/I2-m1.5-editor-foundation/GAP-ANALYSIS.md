# M1.5 Gap Analysis: Spec vs Implementation

**Analysis Date:** 2026-02-21  
**Initiative:** I2 - M1.5 Editor Foundation Gap Analysis & Fix  
**Analyst:** Compound Development Team

---

## Executive Summary

The M1.5 milestone was marked as "complete" with the following implementation:
- **Editor**: SimpleBlockEditor (custom textarea-per-block)
- **Status**: Functionally complete but **poor user experience**
- **Critical Gap**: Not "Notion-grade" as specified

**Recommendation:** Replace SimpleBlockEditor with TipTap-based implementation to deliver the promised experience.

---

## 🎯 Spec Requirements vs Implementation

### 1. Core Editor Behaviors

| Requirement | Spec | Implementation | Status | Gap Severity |
|-------------|------|----------------|--------|--------------|
| **Enter creates block below** | ✅ Required | ✅ Implemented | ⚠️ PARTIAL | **HIGH** |
| **Backspace at start merges** | ✅ Required | ✅ Implemented | ⚠️ PARTIAL | **HIGH** |
| **Multi-paragraph paste** | ✅ Required | ❌ Not implemented | ❌ MISSING | **MEDIUM** |
| **List paste → bullets** | ✅ Required | ❌ Not implemented | ❌ MISSING | **MEDIUM** |
| **Block-aware undo/redo** | ✅ Required | ⚠️ Per-textarea only | ⚠️ PARTIAL | **HIGH** |
| **Click-to-place caret** | ✅ Required | ⚠️ Works within block only | ⚠️ PARTIAL | **CRITICAL** |
| **Arrow navigation** | ✅ Implicit | ⚠️ Focus jumps | ❌ BROKEN | **CRITICAL** |

#### Gap Details:

**Enter (⚠️ PARTIAL - HIGH severity)**
- **Spec**: "Creates new block below, continues type for bullets/headings"
- **Implementation**: Works but recreates DOM, causing visual jank
- **Issue**: Cursor position jumping, focus management complexity
- **User Impact**: Feels unnatural, interrupts writing flow

**Backspace (⚠️ PARTIAL - HIGH severity)**  
- **Spec**: "Merges with previous block"
- **Implementation**: Deletes node, recreates DOM
- **Issue**: Content merge works but destroys/recreates textareas
- **User Impact**: Cursor position lost, undo history broken

**Paste (❌ MISSING - MEDIUM severity)**
- **Spec**: "Multi-paragraph paste → multiple blocks, List paste → bullets"
- **Implementation**: Not implemented (pastes as plain text into current block)
- **Issue**: Requires parsing pasted content
- **User Impact**: Can't paste formatted content from other apps

**Undo/Redo (⚠️ PARTIAL - HIGH severity)**
- **Spec**: "Block-aware, reliable"
- **Implementation**: Browser's native textarea undo (per-block only)
- **Issue**: No cross-block undo, no store-level history
- **User Impact**: Can't undo block creation/deletion/merge

**Click-to-place caret (⚠️ PARTIAL - CRITICAL severity)**
- **Spec**: "Works between blocks"
- **Implementation**: Only works within individual textareas
- **Issue**: Can't click between blocks to position cursor
- **User Impact**: Breaks fundamental editing expectations

**Arrow navigation (❌ BROKEN - CRITICAL severity)**
- **Spec**: Implicit requirement for "Notion-grade" experience
- **Implementation**: Manual focus jumping between textareas
- **Issue**: 
  - Perceptible delay (>100ms)
  - Cursor position management fragile
  - Doesn't work across collapsed/expanded blocks
  - No natural text selection across blocks
- **User Impact**: **MOST CRITICAL GAP** - Feels janky, not production-ready

---

### 2. Block Types

| Block Type | Spec | Implementation | Status | Gap Severity |
|------------|------|----------------|--------|--------------|
| **Paragraph** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |
| **H1/H2/H3** | ✅ Required | ⚠️ Data model only | ⚠️ PARTIAL | **MEDIUM** |
| **Bullets (nested)** | ✅ Required | ⚠️ Data model only | ⚠️ PARTIAL | **MEDIUM** |
| **TODO/checkbox** | Optional | ❌ Not implemented | ❌ MISSING | **LOW** |

#### Gap Details:

**Headings (⚠️ PARTIAL - MEDIUM severity)**
- **Spec**: "Markdown shortcuts (# for H1, ## for H2, etc.)"
- **Implementation**: Data model supports, but UI uses manual detection, no visual styling in editor
- **Issue**: Hacky markdown shortcut detection in SimpleBlockEditor
- **User Impact**: Works but feels inconsistent

**Bullets (⚠️ PARTIAL - MEDIUM severity)**
- **Spec**: "Nested bullets, continues type on Enter"
- **Implementation**: Data model supports children, but no nesting UI
- **Issue**: No visual indent, no tab/shift-tab for nesting
- **User Impact**: Can't create nested lists naturally

---

### 3. Lifting & Semantic Scope

| Requirement | Spec | Implementation | Status | Gap Severity |
|-------------|------|----------------|--------|--------------|
| **⌘+⇧+L lifts scope** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |
| **Works mid-block** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |
| **Semantic resolution** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |
| **Toast confirmation** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |

#### Gap Details:
**No gaps** - This is the best-implemented part of M1.5.

---

### 4. Navigation & View Switching

| Requirement | Spec | Implementation | Status | Gap Severity |
|-------------|------|----------------|--------|--------------|
| **⌘+K view switcher** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |
| **⌘+= go to Spec** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |
| **⌘+- go to Exploration** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |
| **Preserve cursor position** | ✅ Required | ❌ Not implemented | ❌ MISSING | **MEDIUM** |
| **Navigation stack** | ✅ Required | ⚠️ Store exists, not used | ⚠️ PARTIAL | **MEDIUM** |
| **⌘+↩ jump to source** | ✅ Required | ❌ Not implemented | ❌ MISSING | **MEDIUM** |
| **Up/down in switcher** | ✅ Required | ❌ Not implemented | ❌ MISSING | **LOW** |

#### Gap Details:

**Cursor position preservation (❌ MISSING - MEDIUM severity)**
- **Spec**: "Preserve last caret position per doc"
- **Implementation**: Store has `cursorPositions` but not wired up
- **Issue**: No cursor tracking, no restoration
- **User Impact**: Lose place when switching views

**Jump to source (❌ MISSING - MEDIUM severity)**
- **Spec**: "⌘+↩ jumps to and highlights source in Exploration"
- **Implementation**: Shortcut registered but no implementation
- **Issue**: No focus management for jump behavior
- **User Impact**: Can't quickly navigate to source context

---

### 5. Visual Affordances

| Requirement | Spec | Implementation | Status | Gap Severity |
|-------------|------|----------------|--------|--------------|
| **Minimal by default** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |
| **Provenance on hover** | ✅ Required | ✅ Implemented | ✅ COMPLETE | None |
| **Jump to source action** | ✅ Required | ⚠️ UI exists, no action | ⚠️ PARTIAL | **MEDIUM** |
| **Source highlight** | ✅ Required | ❌ Not implemented | ❌ MISSING | **MEDIUM** |

#### Gap Details:
**Mostly complete** - Hover affordances work well, just missing action wiring.

---

## 🔴 Critical Issues Summary

### 1. **CRITICAL: Textarea-per-block Architecture** 
**Root Cause of Most Gaps**

The decision to use SimpleBlockEditor (textarea-per-block) creates fundamental limitations:

**Problems:**
- Each block is a separate DOM element with separate focus
- Arrow navigation requires manual focus management → feels janky
- Text selection can't flow across blocks
- Click-to-place caret only works within blocks
- Enter/Backspace recreate DOM → breaks undo, causes jank
- Paste can't be parsed intelligently
- No natural multi-block operations

**Why This Happened:**
- TipTap integration was attempted but abandoned (see `BlockEditor.tsx` marked UNUSED)
- SimpleBlockEditor was a quick workaround to get functionality working
- Implementation marked "complete" without UX testing

**Impact:**
- ❌ Fails "Notion-grade" requirement
- ❌ Users notice they're editing "blocks" instead of a document
- ❌ Blocks M2 (AI) and all future milestones

---

### 2. **CRITICAL: Arrow Navigation**
**Current Experience**: Perceptible delay, focus jumping, cursor position issues

**Spec Requirement (implicit)**: "Notion-grade writing experience"

**Actual Behavior**:
```
User presses ArrowDown at end of block
  ↓
SimpleBlockEditor.handleKeyDown detects position
  ↓
Finds next textarea in DOM
  ↓
Calls textarea.focus()
  ↓
Sets cursor position manually
  ↓
User sees: 100ms+ delay, cursor jump, visual jank
```

**Expected Behavior (Notion/Google Docs)**:
```
User presses ArrowDown
  ↓
Cursor moves down one line
  ↓
User sees: <10ms, seamless, no awareness of blocks
```

**Why This Matters**: This is the #1 thing users will notice immediately. Writing flow is broken.

---

### 3. **HIGH: No Cross-Block Operations**

**Missing**:
- Multi-block text selection (shift+arrow across blocks)
- Drag-to-select text across multiple blocks
- Cut/copy/paste across blocks
- Undo/redo across block boundaries

**Why**: Textarea-per-block architecture makes these impossible without complex custom logic.

---

## ✅ What IS Working Well

### Navigation & Shortcuts
- ⌘+K view switcher: **Excellent**
- ⌘+= / ⌘+- abstraction navigation: **Works perfectly**
- Toast notifications: **Clear and helpful**
- View Switcher UI: **Clean, low-weight**

### Data Model & Stores
- Node graph architecture: **Solid foundation**
- Semantic scope resolution: **Correctly implemented**
- Lift operation: **Works flawlessly**
- Provenance tracking: **Data model is ready**

### Spec View
- Transclusion rendering: **Clean**
- Hover affordances: **Subtle and discoverable**
- Inline editing of lifted content: **Works**

---

## 📊 Gap Severity Matrix

| Severity | Count | Items |
|----------|-------|-------|
| **CRITICAL** | 2 | Arrow navigation, Click-to-place caret |
| **HIGH** | 3 | Enter behavior, Backspace behavior, Undo/redo |
| **MEDIUM** | 8 | Paste, Headings, Bullets, Cursor preservation, Navigation stack, Jump to source, Source highlight, Jump action |
| **LOW** | 2 | TODO blocks, Switcher keyboard nav |

**Total Gaps**: 15  
**Blocking Gaps (CRITICAL + HIGH)**: 5

---

## 🎯 Root Cause Analysis

### Primary Root Cause
**Textarea-per-block architecture** chosen for speed of implementation

### Contributing Factors
1. TipTap integration attempted but abandoned without clear reason
2. No UX testing before marking "complete"
3. Implementation focused on functionality over feel
4. Spec didn't explicitly test for "feels like Notion" (subjective but critical)

### Why It Matters
- SimpleBlockEditor can NEVER deliver "Notion-grade" experience
- All 5 blocking gaps stem from this architectural choice
- Incremental fixes won't solve fundamental limitation

---

## 💡 Recommended Solution

### Replace SimpleBlockEditor with TipTap

**Why TipTap:**
- Built on ProseMirror (battle-tested, used by Notion, Dropbox Paper, Confluence)
- Native support for block-level operations
- Natural arrow navigation, text selection, undo/redo
- Extensible node views for custom block rendering
- Collaboration-ready (Y.js integration for future)
- Strong TypeScript support

**Effort Estimate:**
- Read-only rendering (Nodes → TipTap JSON): 2-3 days
- Bidirectional sync (TipTap → updateNodeContent): 3-5 days
- Port M1.5 behaviors (shortcuts, lifting, etc.): 3-5 days
- Testing & polish: 3-5 days
- **Total**: 2-3 weeks

**Risk**: Medium (TipTap is well-documented, community is active)

---

## 📋 Next Steps

See `SPIKE.md` for detailed implementation plan and task breakdown.

---

## Appendix: Code References

### Current Implementation
- `src/components/editor/SimpleBlockEditor.tsx` - Textarea-based editor (405 lines)
- `src/components/editor/BlockEditor.tsx` - TipTap wrapper (UNUSED, 180 lines)
- `src/lib/semantic-lift.ts` - Scope resolution (works well)
- `src/hooks/useKeyboardShortcuts.ts` - Shortcuts (works well)

### Stores
- `src/stores/document.store.ts` - Node CRUD (solid)
- `src/stores/navigation.store.ts` - View state (good foundation)
- `src/stores/view.store.ts` - Selection/focus (needs expansion)

### Views
- `src/app/ExplorationView.tsx` - Uses SimpleBlockEditor
- `src/app/SpecView.tsx` - Transclusion rendering (good)
