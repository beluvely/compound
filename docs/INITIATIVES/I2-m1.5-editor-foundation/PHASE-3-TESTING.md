# Phase 3: M1.5 Behaviors - Testing & Validation

**Date:** 2026-02-23  
**Status:** 🟡 In Progress

---

## Testing Approach

Phase 3 is primarily about **validating** that TipTap's built-in behaviors work correctly with our node sync architecture. Most features come from TipTap StarterKit, but we need to ensure they integrate properly.

---

## 3.1 Enter/Backspace Behaviors

### Enter Key Tests

| Test Case | Expected Behavior | Status | Notes |
|-----------|-------------------|--------|-------|
| Enter in paragraph (middle) | Split paragraph → create 2 nodes | ⏳ | Need to verify node split |
| Enter in paragraph (end) | Create new paragraph below | ✅ | Working |
| Enter in heading | Exit heading → create paragraph | ⏳ | Test |
| Enter in empty heading | Delete heading → create paragraph | ⏳ | Test |
| Enter in bullet | Create new bullet item | ⏳ | Test |
| Enter in empty bullet | Exit list → create paragraph | ⏳ | Test |
| Enter at start of line | Create empty paragraph above | ⏳ | Test |

### Backspace Key Tests

| Test Case | Expected Behavior | Status | Notes |
|-----------|-------------------|--------|-------|
| Backspace at start of paragraph | Merge with previous paragraph | ⏳ | Test |
| Backspace at start of heading | Convert to paragraph | ⏳ | Test |
| Backspace in empty paragraph | Delete paragraph | ⏳ | Test |
| Backspace at start of bullet | Outdent or exit list | ⏳ | Test |
| Backspace in empty bullet | Delete bullet item | ⏳ | Test |

### Node Sync Validation

- [ ] Enter creates new node with unique ID
- [ ] Backspace merge removes node from store
- [ ] Backspace delete removes node from store
- [ ] rootIds array updates correctly
- [ ] Changes persist to IndexedDB

---

## 3.2 Markdown Shortcuts

### Heading Shortcuts

| Shortcut | Expected Result | Status | Notes |
|----------|-----------------|--------|-------|
| `# ` | Convert to H1 | ⏳ | Test (TipTap built-in) |
| `## ` | Convert to H2 | ⏳ | Test (TipTap built-in) |
| `### ` | Convert to H3 | ⏳ | Test (TipTap built-in) |
| `#### ` | Convert to paragraph (no H4) | ⏳ | Test |

### List Shortcuts

| Shortcut | Expected Result | Status | Notes |
|----------|-----------------|--------|-------|
| `- ` | Convert to bullet list | ⏳ | Test (TipTap built-in) |
| `* ` | Convert to bullet list | ⏳ | Test (TipTap built-in) |
| `1. ` | Convert to ordered list | ⏳ | Test (disabled for now) |

### Inline Formatting

| Shortcut | Expected Result | Status | Notes |
|----------|-----------------|--------|-------|
| `**text**` | Bold | ⏳ | Test (TipTap built-in) |
| `*text*` or `_text_` | Italic | ⏳ | Test (TipTap built-in) |
| `` `text` `` | Inline code | ⏳ | Test (TipTap built-in) |
| `~~text~~` | Strikethrough | ⏳ | Test (TipTap built-in) |

### Undo After Shortcuts

- [ ] Type `# Hello` → H1 → `Cmd+Z` → reverts to `# Hello`
- [ ] Type `- Item` → bullet → `Cmd+Z` → reverts to `- Item`

---

## 3.3 Paste Behavior

### Paste Tests

| Paste Source | Expected Behavior | Status | Notes |
|--------------|-------------------|--------|-------|
| Plain text (single line) | Single paragraph | ⏳ | Test |
| Plain text (multi-line) | Multiple paragraphs | ⏳ | Test |
| Rich text (bold/italic) | Preserve formatting | ⏳ | Test |
| HTML (headings + paragraphs) | Multiple typed nodes | ⏳ | Test |
| HTML (list) | Bullet list nodes | ⏳ | Test |
| From Notion | Preserve structure | ⏳ | Test manually |
| From Google Docs | Clean formatting | ⏳ | Test manually |
| From Word | Clean formatting | ⏳ | Test manually |

### Node Creation Validation

- [ ] Pasted paragraphs create separate nodes
- [ ] Each node gets unique ID
- [ ] rootIds updates with new nodes
- [ ] Nodes sync to store correctly
- [ ] Auto-save persists pasted content

---

## 3.4 Undo/Redo

### Basic Undo/Redo

| Action | Undo Result | Redo Result | Status |
|--------|-------------|-------------|--------|
| Type text | Remove text | Restore text | ⏳ |
| Delete text | Restore text | Delete again | ⏳ |
| Bold text | Remove bold | Apply bold | ⏳ |
| Create paragraph (Enter) | Delete paragraph | Restore paragraph | ⏳ |
| Merge paragraphs (Backspace) | Un-merge | Merge again | ⏳ |
| Markdown shortcut (`#`) | Revert to plain | Apply heading | ⏳ |
| Paste content | Remove pasted content | Restore paste | ⏳ |

### Undo Stack Validation

- [ ] `Cmd+Z` undoes last action
- [ ] `Cmd+Shift+Z` redoes last undo
- [ ] Multiple undo/redo works correctly
- [ ] Undo history preserved after typing pause
- [ ] Undo history cleared after reload (expected)

---

## 3.5 Keyboard Navigation

### Arrow Key Navigation

| Key | Expected Behavior | Status |
|-----|-------------------|--------|
| `→` | Move cursor right | ⏳ |
| `←` | Move cursor left | ⏳ |
| `↑` | Move cursor to line above | ⏳ |
| `↓` | Move cursor to line below | ⏳ |
| `Shift+→` | Extend selection right | ⏳ |
| `Shift+←` | Extend selection left | ⏳ |
| `Shift+↑` | Extend selection up | ⏳ |
| `Shift+↓` | Extend selection down | ⏳ |

### Jump Navigation

| Key Combo | Expected Behavior | Status |
|-----------|-------------------|--------|
| `Cmd+→` | Jump to end of line | ⏳ |
| `Cmd+←` | Jump to start of line | ⏳ |
| `Cmd+↑` | Jump to start of document | ⏳ |
| `Cmd+↓` | Jump to end of document | ⏳ |
| `Option+→` | Jump to next word | ⏳ |
| `Option+←` | Jump to previous word | ⏳ |

### List Navigation

| Key | Expected Behavior | Status |
|-----|-------------------|--------|
| `Tab` in bullet | Indent (nest deeper) | ⏳ |
| `Shift+Tab` in bullet | Outdent (nest shallower) | ⏳ |
| `Enter` in bullet | Create new bullet same level | ⏳ |
| `Backspace` at bullet start | Outdent or exit list | ⏳ |

### Cross-Block Selection

- [ ] Arrow keys move between blocks smoothly
- [ ] Shift+arrow selects across block boundaries
- [ ] Selection highlights properly across blocks
- [ ] Copy/paste works with multi-block selection

---

## Known Issues & Gaps

### Issues to Fix

| Issue | Severity | Description | Resolution |
|-------|----------|-------------|------------|
| TBD | TBD | (Will populate as we test) | TBD |

### TipTap Configuration Needed

**Extensions Currently Enabled:**
- ✅ Document, Text
- ✅ NodeParagraph, NodeHeading, NodeBulletList, NodeListItem
- ✅ Bold, Italic, Code, Strike
- ✅ HardBreak, HorizontalRule, Blockquote, CodeBlock
- ✅ Placeholder

**Extensions to Consider:**
- [ ] TaskList / TaskItem (for checkboxes)
- [ ] Link (for inline links)
- [ ] Image (for inline images)
- [ ] Table (for tables)

**Current Limitations:**
- No H4/H5/H6 (capped at H3 per design)
- No ordered lists (numbered lists disabled for now)
- No nested lists (coming in Phase 5)

---

## Testing Methodology

### 1. Manual Testing Checklist

Go through each test case above and mark status:
- ✅ **Working** - Feature works as expected
- ⚠️ **Partial** - Works but has issues
- ❌ **Broken** - Does not work
- ⏳ **Untested** - Not yet validated

### 2. Console Validation

For each test:
1. Open browser DevTools console
2. Watch for "TipTap update (debounced)" logs
3. Verify `convertedNodes` and `convertedRootIds` are correct
4. Check for errors or warnings

### 3. Store Inspection

After actions:
1. Check Zustand store in React DevTools
2. Verify `exploration.nodesById` has correct nodes
3. Verify `exploration.rootIds` has correct order
4. Verify node `content.type` and `content.value` are correct

### 4. Persistence Validation

After changes:
1. Wait 1 second for auto-save
2. Refresh page
3. Verify content restored correctly
4. Check IndexedDB in DevTools → Application → IndexedDB

---

## Next Steps

1. ⏳ **Run through all test cases systematically**
2. ⏳ **Document any issues found**
3. ⏳ **Fix critical issues**
4. ⏳ **Re-test after fixes**
5. ⏳ **Mark Phase 3 complete when all ✅**

---

## Phase 3 Success Criteria

- [ ] All Enter/Backspace behaviors work correctly
- [ ] All markdown shortcuts work correctly
- [ ] Paste creates proper nodes in store
- [ ] Undo/redo work for all operations
- [ ] Keyboard navigation feels natural
- [ ] No visual jank or delays
- [ ] All changes persist correctly
- [ ] No console errors during normal use

**Phase 3 is complete when all checkboxes above are ✅**
