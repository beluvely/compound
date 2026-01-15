# Compound

**Compound** is a document-first, local-first knowledge workspace where exploration, structure, and AI stay aligned as understanding compounds over time.

Compound is not a note app, a chat app, or a task manager with AI.
It is a **knowledge system with contracts**.

---

## Product North Star

> A workspace where thinking, structure, and AI stay aligned as knowledge compounds safely over time.

If a feature weakens this promise, it is incorrect.

---

## Core Mental Model

* Knowledge lives in **documents**, not chats.
* Documents are **graphs of addressable nodes**, not markdown blobs.
* Exploration and authority are **distinct but connected**.
* Reuse happens by **reference**, never duplication.
* Trust comes from **provenance and linkage**, not polish.

Everything in Compound should make these truths legible without documentation.

---

## The Two Core Surfaces

### 1. Exploration

The Exploration surface is the **workbench**.

It is intentionally:

* Messy
* Verbose
* Provenance-rich
* Safe for incomplete thinking

It holds:

* Turnaround loops
* Alternatives and dead ends
* AI conversations scoped to nodes
* The full rationale behind decisions

Nothing here is assumed to be final.

### 2. Spec

The Spec surface is the **derived source of truth**.

It is:

* Calm
* Readable
* Opinionated
* Continuously up to date

The Spec is **not written directly**.
It is composed entirely of **references (transclusions)** to nodes in Exploration.

Editing lifted content edits the source.

---

## Non-Negotiable Invariants

These invariants override all local feature decisions.

1. **Document-first**

   * The document is the primary state container
   * Chat and AI are views scoped to document nodes

2. **Addressable nodes**

   * Every block has a stable ID
   * No content exists without an owning node

3. **Reference over duplication**

   * Reuse content via references, never copy
   * Transclusions remain live and editable

4. **Exploration ≠ Authority**

   * Messy exploration and authoritative spec never fork

5. **Reversibility by default**

   * Collapse, focus, lift, and filter never destroy data
   * Destructive actions must be undoable

If code or UI violates these, it is wrong.

---

## Core Concepts & Vocabulary

These terms are used consistently across product, code, and prompts.

* **Node** — an addressable block of content
* **Document** — a graph of nodes
* **Loop** — a turnaround loop capturing AI-driven exploration
* **Lift** — reference a node into the Spec
* **Reference / Transclusion** — a live pointer to a source node
* **Fold** — collapse/compress content without loss
* **Focus** — temporarily scope the document view
* **Normalize** — enforce canonical language or assumptions
* **Provenance** — the traceable origin of content

Avoid inventing alternative names.

---

## Architectural Posture

Compound is built **editor-first** and **local-first**.

* Source of truth lives locally in a document model
* State is explicit, serializable, and inspectable
* Server sync, auth, and collaboration are additive—not foundational

Design as if:

* documents will live for years
* users will revisit decisions long after context fades
* complexity will increase, not decrease

---

## UX Principles

* Inline editing over modals
* Collapse hides noise, never meaning
* Provenance is always available, never noisy by default
* AI assists inside constraints, never as an oracle
* System intelligence whispers; it does not shout

Avoid:

* Card-heavy layouts
* Final-looking UI for exploratory content
* Workflow metaphors driving core experience

---

## Contribution Rules (Humans & Agents)

When adding or changing code:

* Preserve node identity and references
* Do not copy content where a reference is intended
* Keep document data separate from view state
* Encode interaction semantics in code, not comments
* If requirements conflict with invariants, call it out explicitly

This applies equally to:

* human contributors
* AI coding assistants

---

## One-Line Truth

> Exploration owns the knowledge. The Spec states the position. Compound keeps them aligned.

---

## Status

This repository is intentionally early.

Expect:

* iteration
* refactoring
* sharp edges

Do **not** expect:

* throwaway architecture
* disposable AI output
* silent duplication

Compound is designed to compound.

---

## Technical Setup

For development setup, tooling, and conventions, see:

**[docs/SETUP.md](docs/SETUP.md)**
