# Milestone 1 — Reference Without Duplication

**Status:** Active

**Owner:** Project

**Last updated:** 2026-01-15

---

## 1) Claim Being Proved

> Users can reuse and evolve knowledge **without copying it**, and never lose trust in where content comes from.

---

## 2) Why This Is Hard / Non-Obvious

* Most tools treat reuse as copy-paste, creating silent forks
* Editing in one place typically breaks trust elsewhere
* Users fear “cleaning up” because it erases history
* Live references are rare and often fragile or confusing

---

## 3) Scope

### In scope (capabilities)

* Addressable document nodes with stable IDs
* Live transclusion (lift) from Exploration into Spec
* Editing lifted content mutates the source node
* Explicit duplication with provenance (intentional fork)
* Provenance visibility without visual noise

### Out of scope (explicit non-goals)

* AI/chat features
* Normalization or drift enforcement
* Collaboration or permissions
* Rich text formatting

---

## 4) Key Flows (happy path)

**Flow A: Lift without duplication**

1. User writes content in Exploration
2. User lifts node into Spec
3. Spec renders live reference
4. User edits in Spec
5. Exploration updates immediately

**Flow B: Intentional duplication**

1. User duplicates a node
2. New node is created with provenance
3. User edits duplicate freely
4. Source remains unchanged

---

## 5) Proof Criteria (What “Done” Means)

* [ ] A user can edit content from Spec and see Exploration update instantly
* [ ] The UI makes it clear when content is referenced vs duplicated
* [ ] It is impossible to accidentally fork content via lift
* [ ] Users can always navigate to the source of lifted content

---

## 6) Invariants & Guardrails

**Authoritative sources**

* `README.md`
* `.github/copilot-instructions.md`
* ADR-0001

**Must hold during this milestone**

* Reference over duplication
* Exploration owns canonical content
* Reversibility by default

---

## 7) UX Notes (Tone & Anti-Patterns)

### UX tone

* Calm
* Structural
* Trust-oriented

### Anti-patterns to avoid

* Copy-paste reuse without lineage
* Card-based spec layouts
* Final-looking UI in Exploration

---

## 8) Data / Architecture Notes (Minimal)

* Domain supports transclusion via `sourceNodeId`
* Duplicate creates new node with provenance metadata
* View state remains separate from document data

---

## 9) Deliverables

* Exploration outline editor
* Spec document view with transclusions
* Lift action
* Duplicate action with provenance
* Minimal provenance UI

---

## 10) Follow-ups / Next Milestone Dependencies

* Unblocks Milestone 2 (Scoped AI Exploration)
* Establishes foundation for normalization and history

---

## Appendix

### Open questions

* How visible should provenance be by default?
* When should duplication be discouraged vs allowed?
