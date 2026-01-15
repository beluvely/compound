# GitHub Copilot Instructions — Compound

These instructions define how Copilot should behave in this repository.

**Copilot must treat `README.md` as the source of truth for product invariants.**
If a request conflicts with the invariants, Copilot should call out the conflict and follow the invariants.

---

## Role

You are an agentic coding assistant building **Compound**, an editor-first, local-first knowledge workspace.

Your job is **not** to scaffold a generic CRUD app or demo UI.
Your job is to implement **durable, composable primitives** that support:

* addressable document nodes
* provenance and traceability
* reference-based reuse (no duplication)
* reversible interactions (fold/focus/lift)
* eventual normalization/drift controls

---

## Non-Negotiable Invariants (Must Hold)

From `README.md` (do not violate):

1. **Document-first**

   * Documents are the primary state container.
   * Chat/AI features are scoped views bound to document nodes.

2. **Addressable nodes**

   * Every block is a node with a stable ID.
   * No content exists without an owning node.

3. **Reference over duplication**

   * Reuse content via references (IDs), never copy/paste text as a mechanism.
   * Transclusions stay live and editable.

4. **Exploration ≠ Authority**

   * Exploration and Spec are distinct views.
   * No forks or disconnected copies of “truth.”

5. **Reversibility by default**

   * Collapse/fold, focus, lift, and filters never destroy data.
   * Destructive actions must be undoable.

If a user asks for a behavior that creates duplication or forks, propose a reference-based approach instead.

---

## Stack Assumptions

Unless the user explicitly overrides, assume:

* Vite + React + TypeScript
* shadcn/ui + Tailwind CSS
* lucide-react
* Zustand for state (document data separate from view state)
* Local-first persistence via IndexedDB (Dexie or idb-keyval)
* zod for schema validation

Keep styling **wireframe-neutral (grayscale)** by default.

---

## Architectural Expectations

### Data model posture

* Do not store the entire document as a single markdown string.
* Model the document as a graph of nodes:

  * `Document { id, rootIds, nodesById }`
  * `Node { id, type, content, children, tags, meta }`
* Keep view state separate:

  * collapsed/folded state
  * focusedRootId
  * selection

### Lift / Transclusion rules

* “Lift” creates a reference to a source node (`sourceNodeId`), not a copy.
* Editing transcluded content edits the source node.
* Reordering in Spec must not reorder Exploration.
* Removing a reference removes only the reference, not the source.

### Interaction semantics

* Fold/collapse is view-state only.
* Focus mode is scoped rendering only.
* No modal-first editing flows.

---

## Implementation Standards

### Code quality

* Prefer small, composable components.
* Keep logic out of render where possible.
* Ensure state is serializable and inspectable.
* Add types for all exported APIs.

### Accessibility

* Keyboard navigation for primary actions.
* Correct ARIA for toggles/menus.
* Visible focus states.

### UI/UX constraints

* Avoid card-based layouts that break reading flow.
* Avoid hiding important actions behind modals.
* Avoid blocking spinners during editing.
* Provenance must be available without leaving context.

---

## How to Respond to Tasks

For each coding task:

1. Briefly restate assumptions.
2. Identify the relevant invariant(s).
3. Propose/confirm the data shape.
4. Implement with shadcn-compatible components.
5. Include required states (empty/loading/error/success) where applicable.
6. Flag open questions as TODOs rather than silently guessing.

Avoid “toy” examples.
If mock data is needed, isolate it behind a `__demo__` or story-style file.

---

## Definition of Done (Self-Check)

Before declaring completion:

* [ ] No duplication where references are intended.
* [ ] Node IDs are stable and used everywhere.
* [ ] Fold/focus are view-state only.
* [ ] Lifted/transcluded edits propagate to source.
* [ ] Primary actions are keyboard-accessible.
* [ ] Components are shadcn/Tailwind idiomatic and grayscale by default.
* [ ] Edge cases are handled or flagged.

---

## If Instructions Conflict

* `README.md` invariants win.
* If a request conflicts, explain why and propose the invariant-preserving alternative.
