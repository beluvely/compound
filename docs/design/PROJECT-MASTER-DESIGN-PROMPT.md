# Project-Level Master Design Prompt

*(Knowledge-Coalescing Workspace · Global Invariants)*

## Role & Frame

> You are designing a knowledge-coalescing workspace for people who think, reason, and build through exploration—often with AI agents.
> 
> 
> This is not a note-taking app, a chat app, or a document editor with AI features.
> 
> It is a **stateful knowledge system** where exploration, structure, and execution remain continuously aligned.
> 

All UI, interactions, and affordances must preserve this framing.

---

## Core Product Truths (Non-Negotiable)

These truths must be legible in the UI without explanation:

1. **Knowledge accumulates**
    
    AI output is not disposable text; it becomes part of a growing, trusted system.
    
2. **Exploration and authority are distinct but connected**
    
    Messy thinking is preserved; clarity is derived, not rewritten.
    
3. **Nothing important is duplicated**
    
    Reuse happens through reference, not copy.
    
4. **Trust comes from linkage, not polish**
    
    Users trust content because they can always see where it came from.
    
5. **Drift is managed, not ignored**
    
    Language, assumptions, and models are enforced gently but consistently.
    

If a design choice weakens any of these, it is incorrect.

---

## Global Mental Model

- The product is **document-first**, not chat-first.
- Documents are **graphs of addressable nodes**, not pages.
- AI is a **collaborator inside constraints**, not a generator of throwaway prose.
- Collapse is **compression**, never deletion or archiving.
- Focus is achieved through **scoping**, not navigation.

---

## Surfaces (Conceptual, Not Navigational)

Design assumes these surfaces exist, but they are **not separate apps**:

1. **Exploration Document**
    - Owns all content
    - Holds provenance, loops, alternatives, rationale
2. **Spec Document**
    - Derived, curated view
    - Composed entirely of references to exploration nodes
3. **Lift & Provenance System**
    - Connects the two without duplication
    - Makes ownership and linkage unmistakable

No UI should imply these are forks or independent documents.

---

## Global Interaction Principles

### Editing

- Editing is inline, spatially stable, and reversible
- No modal-first workflows
- No “wizard” flows

### Visibility

- Hide noise by default, not meaning
- Provenance is always one interaction away
- System intelligence whispers; it never shouts

### Performance & Feel

- Collapse/expand feels instant
- No blocking states for thinking or reading
- All transitions feel reversible

---

## Visual & System Constraints

- **Design system**: shadcn/ui + Tailwind + lucide-react
- **Style mode**: Wireframe-Neutral (grayscale only unless overridden)
- **Information density**: High, but scannable
- **Accessibility**: WCAG 2.2 AA minimum
- **State coverage**: loading, empty, error, success are always designed

Avoid:

- Card-heavy layouts
- Overuse of color to signal importance
- Decorative AI indicators

---

## AI Behavior Constraints (Critical)

All AI outputs rendered in the UI must:

- Respect canonical vocabulary and assumptions
- Be editable like human-written text
- Never visually dominate human content
- Never appear as “final” by default

AI is a participant in the document, not an oracle.

---

## Language & Tone Guidelines

UI language should be:

- Precise
- Calm
- Non-anthropomorphic
- Contract-oriented

Avoid:

- “Magic”
- “Smart”
- “We did this for you”
- Over-celebratory copy

---

## Global Anti-Patterns (Disallowed)

- Copy-paste reuse without reference
- Chat threads detached from document nodes
- Final-looking UI for exploratory content
- Workflow metaphors (kanban, inbox) driving core experience
- Hiding system behavior behind automation

If a feature resembles:

- a task manager,
- a chat transcript viewer,
- or a WYSIWYG publishing tool,

…it is likely wrong.

---

## Evaluation Questions (Apply to Every Surface)

A design is acceptable only if:

- Users can always answer: “Where did this come from?”
- Users never fear losing context
- Long documents become *more* usable over time
- Trust increases as content accumulates
- The system scales with complexity, not against it

---

## Instruction for Downstream Prompts

When this project-level prompt is included:

> All surface-level prompts (Exploration Document, Spec Document, Lift Mechanics, Normalization, etc.) override only local behavior, never these global principles.
> 

If there is a conflict:

- **This prompt wins.**

---

## One-Sentence North Star

> A workspace where thinking, structure, and AI stay aligned as knowledge compounds over time.
>