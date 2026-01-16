Below is a **single, cohesive Milestone 1.5 Build Prompt** you can drop into an agentic coding workflow or hand directly to an engineer. It is written to be **executable**, **testable**, and **unambiguous**, with explicit behaviors, constraints, and acceptance criteria.

---

# Milestone 1.5 — Build Prompt

**Title:** Establish a Trustworthy Writing Substrate with Lift + Abstraction Navigation

## Objective

Build a Notion-grade writing surface that allows users to write continuously in **Exploration** and **Spec** documents, lift semantic sections via keyboard-first gestures, and move between abstraction levels without breaking flow.

The system must eliminate the need for explicit “create node” actions and make lifting feel inevitable and safe.

---

## Core Concepts (Do Not Deviate)

### Two document types

1. **Exploration Document**

   * Messy, provenance-rich workspace
   * Holds all raw writing, turnaround loops, and exploration
2. **Spec Document**

   * Curated, readable source of truth
   * Composed of:

     * authored blocks (written directly in Spec)
     * lifted/transclusion blocks (references to Exploration nodes)

Both documents share the **same editor substrate**.

---

## Data Model Requirements

### Block (Node)

Each block must have:

* `id` (stable, never reused)
* `type`: paragraph | h1 | h2 | h3 | bullet | todo | transclusion
* `content` (text)
* `parentId` (null for root)
* `children[]` (ordered)
* `sourceRef?` (only for transclusion blocks: `{ docId, nodeId }`)

### Guarantees

* Blocks are addressable.
* Spec blocks that are lifted reference Exploration blocks by ID.
* Editing lifted content updates the source block.

---

## Editor Substrate (Critical)

### Writing must feel continuous

* No explicit “Create Node” button in normal usage.
* Typing creates blocks automatically.
* Autosave is implicit and reliable.

### Required editing behaviors

Implement these exactly:

#### Enter

* Creates a new block below the current block.
* In bullets/headings: continues same block type.
* Enter on an empty styled block exits to a paragraph.

#### Backspace

* At start of block: merges with previous block.
* On empty block: deletes block.
* On empty heading/bullet: converts to paragraph before deletion when appropriate.

#### Paste

* Multi-paragraph paste → multiple paragraph blocks.
* Pasted lists → bullet blocks where possible.

#### Selection

* Caret placement between blocks must be reliable.
* Multi-block selection must be supported.

#### Undo / Redo

* ⌘Z / ⌘⇧Z
* Block-aware and trustworthy.

---

## Lift Mechanics (Locked Rules)

### Semantic lift rule

> **Lifting always lifts the entire semantic scope of the current block, including all children.**

Cursor position inside the block does not matter.

#### Scope resolution

* H1 → until next H1
* H2 → until next H2 within same H1
* H3 → until next H3 within same H2
* Bullet → its nested bullet subtree
* Paragraph → itself (and children if applicable)

### Lift behavior

* Lifted content is inserted into the Spec document as transclusion blocks.
* Source content remains in Exploration.
* No duplication.

### Shortcut

* **Lift semantic scope:** ⌘ + ⇧ + L

### Feedback

* Subtle confirmation (“Lifted to Spec”).
* Optional auto-navigation to Spec (configurable later).

---

## Navigation: Abstraction, Not Tabs

### Principle

Navigation reflects **abstraction level**, not document count.

### Shortcuts

* **Go up to Spec:** ⌘ + =
* **Go down to Exploration/source:** ⌘ + -

### Behavior

* Preserve last caret position per document.
* Maintain a navigation stack:

  * From Spec, ⌘+- returns to the originating Exploration context.
* From lifted content in Spec:

  * **Jump to source:** ⌘ + ↩
  * Scroll + highlight source block in Exploration.

---

## View Switcher (Keyboard-First)

### Purpose

Provide fast access to primary views without breaking flow.

### Shortcut

* **Open/Close View Switcher:** ⌘ + K

  * (⌘ + ? may be supported as an alias if no conflicts)

### Behavior

* Displays:

  * Exploration
  * Spec
  * (Optional for 1.5) Tasks, Conversations
* Keyboard navigation:

  * ↑ / ↓ to select
  * Enter to open
  * Esc to close
* Visual affordance:

  * Small FAB or bottom menu icon
  * Low visual weight

---

## Visual Treatment for Lifted Content (Spec Only)

### Principle

Lifted-ness is discoverable, not persistent.

### States

* **Active typing:** no special background or decoration.
* **Hover or idle:**

  * show ONE subtle affordance:

    * either a thin left-edge indicator
    * or a right-gutter icon
* Clicking affordance:

  * jumps to source in Exploration
  * highlights source block briefly

Avoid cards, heavy backgrounds, or constant labels.

---

## Explicit Non-Goals (Do Not Build)

* No drag-and-drop block reordering
* No slash-command menus beyond minimal markdown shortcuts
* No collaboration or permissions
* No advanced task metadata
* No normalization/drift UI (engine may exist silently)
* No databases or collections

---

## Acceptance Tests (Must Pass)

1. A user can write 1,000+ words in Exploration without touching a “create node” control.
2. A user can write framing text directly in Spec.
3. ⌘⇧L lifts the correct semantic scope even when invoked mid-paragraph.
4. ⌘+= and ⌘+- switch between Spec and Exploration without losing cursor position.
5. Lifted content in Spec can be edited and updates the source.
6. Lifted content is visually discoverable but not noisy.
7. A first-time user can type immediately without instructions.

---

## Implementation Guidance (Non-Prescriptive)

* Use a mature block editor (e.g., ProseMirror/Tiptap or Lexical).
* Map editor blocks directly to your node graph.
* Keep lift logic independent of UI rendering.
* Treat Spec transclusions as block types, not embeds.

---

## Definition of Done

Milestone 1.5 is complete when the product feels like **a real place to write**, not a demo of lifting mechanics—and when lifting feels like a natural extension of writing, not a special operation.

---

If you want, next we can:

* break this into a **task-level engineering checklist**, or
* write a **companion prompt for a coding agent** that includes test cases and edge scenarios, or
* adapt this into a **README-style internal build spec** for collaborators.
