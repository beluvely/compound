# Phase 1: Read-Only Rendering - Completion Checklist

**Date:** 2026-02-23  
**Status:** 🟢 Ready for Validation

---

## Visual Validation Checklist

Open **localhost:5174** (or 5173) and verify the following:

### Typography Hierarchy

- [ ] **H1** "Testing TipTap Integration"
  - Font size: ~30px (largest heading)
  - Font weight: Bold (600)
  - Color: Near-black (oklch 9%)
  - Spacing: No top margin, 1rem bottom margin

- [ ] **H2** "Heading 2 Test"
  - Font size: ~24px (medium heading)
  - Font weight: Bold (600)
  - Color: Near-black (oklch 9%)
  - Spacing: 2rem top margin, 0.75rem bottom margin

- [ ] **H3** "Heading 3 Test"
  - Font size: ~20px (smallest heading)
  - Font weight: Bold (600)
  - Color: Near-black (oklch 9%)
  - Spacing: 1.5rem top margin, 0.5rem bottom margin

- [ ] **Paragraphs**
  - Font size: ~16px (base size)
  - Font weight: Normal (400)
  - Color: Medium gray (oklch 30%)
  - Spacing: 0.75rem top/bottom margins

### List Structure ⭐ **KEY FIX**

- [ ] **Bullet List** appears as **ONE** unified list with:
  - "First bullet point"
  - "Second bullet point"
  
- [ ] **NOT** two separate lists

- [ ] Bullets are **visible** (disc style)

- [ ] List items have proper indentation (~1.625rem left padding)

- [ ] List item text color is medium gray (oklch 30%)

### DOM Structure Validation

Open browser DevTools (F12) → Elements tab:

- [ ] Inspect H1 → has `data-node-id="seed-1"`

- [ ] Inspect first paragraph → has `data-node-id="seed-2"`

- [ ] Inspect H2 → has `data-node-id="seed-3"`

- [ ] Inspect `<ul>` → has `data-node-ids='["seed-4","seed-5"]'` (JSON array)

- [ ] Inspect first `<li>` paragraph → has `data-node-id="seed-4"`

- [ ] Inspect second `<li>` paragraph → has `data-node-id="seed-5"`

- [ ] Inspect H3 → has `data-node-id="seed-6"`

- [ ] Inspect last paragraph → has `data-node-id="seed-7"`

### Expected HTML Structure

```html
<div class="prose max-w-none ...">
  <h1 data-node-id="seed-1">Testing TipTap Integration</h1>
  
  <p data-node-id="seed-2">This is a paragraph block...</p>
  
  <h2 data-node-id="seed-3">Heading 2 Test</h2>
  
  <!-- ⭐ ONE unified list -->
  <ul data-node-ids='["seed-4","seed-5"]'>
    <li>
      <p data-node-id="seed-4">First bullet point</p>
    </li>
    <li>
      <p data-node-id="seed-5">Second bullet point</p>
    </li>
  </ul>
  
  <h3 data-node-id="seed-6">Heading 3 Test</h3>
  
  <p data-node-id="seed-7">Another paragraph to test...</p>
</div>
```

---

## Technical Validation

### Code Quality

- [x] No TypeScript errors in `tiptap-sync.ts`
- [x] No TypeScript errors in `NodeBlockExtension.ts`
- [x] No TypeScript errors in `TipTapNodeEditor.tsx`
- [x] Dev server compiles successfully
- [x] Hot reload works correctly

### Functionality

- [ ] TipTap editor renders on page load
- [ ] All 7 seed nodes display correctly
- [ ] Consecutive list nodes group into single `<ul>`
- [ ] Node IDs preserved in DOM attributes
- [ ] Editor is **read-only** (cannot edit yet - Phase 2)
- [ ] "TipTap (Phase 1)" toggle button works
- [ ] Can switch between TipTap and SimpleBlockEditor views

### Data Flow

- [x] `createSeedDocument()` populates store on first load
- [x] `nodesToTipTapJSON()` converts nodes to TipTap format
- [x] List grouping logic detects consecutive list nodes
- [x] `nodeIds` array stored on `<ul>` element
- [x] Individual `nodeId` stored on each `<li>` paragraph

---

## Known Issues / Limitations

### ✅ Fixed in This Phase

- ~~Tailwind Typography plugin incompatibility~~ → Resolved with custom CSS
- ~~List nodes create separate `<ul>` elements~~ → Resolved with grouping logic
- ~~No typography styling~~ → Resolved with prose classes

### ⚠️ Deferred to Later Phases

- **Nested Lists:** Current implementation handles flat lists only
  - Will be addressed in Phase 3 or 5 when implementing nested structures
  
- **List Item Reordering:** Cannot track if items move within list
  - Will be addressed in Phase 2 when implementing bidirectional sync

- **Transclusion Rendering:** Not tested in SpecView yet
  - Will be addressed in Phase 6

---

## Phase 1 Success Criteria

All criteria must be met to mark Phase 1 as complete:

- [x] ✅ TipTap integration working
- [x] ✅ Custom extensions with nodeId support
- [x] ✅ nodesToTipTapJSON() converter implemented
- [ ] ✅ All node types render correctly (verify visually)
- [ ] ✅ Consecutive lists group into single `<ul>` (verify visually)
- [x] ✅ Typography hierarchy correct (H1 > H2 > H3 > P)
- [ ] ✅ Node IDs accessible in DOM (verify in DevTools)
- [x] ✅ Read-only mode enforced (editable=false)
- [x] ✅ No TypeScript errors
- [x] ✅ Dev server stable

---

## Ready for Phase 2?

Once all checkboxes above are ✅, Phase 1 is complete.

**Phase 2 will enable:**
- Editing content (typing, deleting, formatting)
- Bidirectional sync (TipTap → Store)
- Enter/Backspace behaviors
- Markdown shortcuts
- Undo/redo

**Estimated Phase 2 Duration:** 3-5 days
