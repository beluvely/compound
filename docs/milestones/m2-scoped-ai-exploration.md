# Milestone 2 — Scoped AI Exploration

**Status:** Draft

**Owner:** Project

**Last updated:** 2026-01-15

---

## 1) Claim Being Proved

> Users can explore ideas with AI **without conversation drift**, because all AI interaction is scoped, editable, and packaged inside the document.

---

## 2) Why This Is Hard / Non-Obvious

* Chat-based tools encourage linear, disposable conversations
* AI output often lives outside the document that triggered it
* Users lose decisions, rationale, and alternatives over time
* Conversations grow noisy and unreadable as projects scale

---

## 3) Scope

### In scope (capabilities)

* Node-scoped AI chat (no global threads)
* Turnaround Loops as first-class document nodes
* Loops that collapse/expand cleanly inside Exploration
* AI output that can be inserted as real document nodes
* Editable AI output with provenance metadata

### Out of scope (explicit non-goals)

* Free-floating or global chat history
* Treating AI output as final by default
* Automated decision-making or task execution
* Normalization rule enforcement (scaffold only)

---

## 4) Key Flows (happy path)

**Flow A: Scoped exploration**

1. User selects a document node
2. User opens “Chat about this”
3. AI responses appear scoped to that node
4. Conversation remains local and contextual

**Flow B: Package into loop**

1. User finishes an exploratory exchange
2. User packages the exchange into a Turnaround Loop
3. Loop is inserted into the document
4. Loop collapses into a single row when not needed

**Flow C: Promote AI output**

1. User selects an AI response
2. User inserts it into the document
3. New node is created with AI provenance
4. Node behaves like any other document content

---

## 5) Proof Criteria (What “Done” Means)

* [ ] Chat cannot exist without a document node context
* [ ] Turnaround Loops feel like packaging, not transcripts
* [ ] AI output is editable and structurally equivalent to human text
* [ ] Long documents remain scannable despite AI usage
* [ ] Users never ask “where did this conversation go?”

---

## 6) Invariants & Guardrails

**Authoritative sources**

* `README.md`
* `.github/copilot-instructions.md`
* ADR-0001

**Must hold during this milestone**

* Document-first (chat is a view, not a container)
* Reference over duplication
* Reversibility by default

---

## 7) UX Notes (Tone & Anti-Patterns)

### UX tone

* Workbench
* Exploratory
* Non-performative

### Anti-patterns to avoid

* Chat UIs that dominate the screen
* Conversation histories detached from content
* Card-based loop presentation

---

## 8) Data / Architecture Notes (Minimal)

* Loops may initially store transcript as plain text
* AI-inserted nodes must include provenance metadata
* Normalization status may default to `unknown`

---

## 9) Deliverables

* Node-scoped chat UI
* Turnaround Loop node rendering
* Loop collapse/expand behavior
* “Insert into document” action from AI output
* Minimal provenance indicators for AI content

---

## 10) Follow-ups / Next Milestone Dependencies

* Depends on Milestone 1 (reference without duplication)
* Unblocks Milestone 3 (Normalization & Drift Awareness)

---

## Appendix

### Open questions

* Should loops be editable inline or via focused view?
* How much AI context should be shown by default?
