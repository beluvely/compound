# Milestone 4 — Decisions, Rollups, and Executive Views

**Status:** Draft

**Owner:** Project

**Last updated:** 2026-01-15

---

## 1) Claim Being Proved

> A single underlying document can support both **thinking** and **execution** because important content can be tagged and rolled up into clean, audience-specific views without moving or duplicating it.

---

## 2) Why This Is Hard / Non-Obvious

* Most systems force content to be reorganized into separate artifacts (docs, tickets, wikis)
* Tagging often becomes heavy taxonomy work or devolves into noise
* Executive views usually require rewriting or manual curation
* Rollups can accidentally create duplicated “sources of truth”

---

## 3) Scope

### In scope (capabilities)

* System tags become functional: `decision`, `open_question`, `risk`, `assumption`, `todo`
* Lightweight tagging UX on any node (inline, fast)
* Rollup views that aggregate tagged nodes without moving them:

  * Decisions
  * Open Questions
  * Risks
  * Assumptions
  * Todos
* Each rollup item retains:

  * provenance (source path)
  * jump to source
  * ability to edit source content
* Minimal “resolution” states for certain tags (non-blocking):

  * Open question: open/resolved
  * Todo: open/done

### Out of scope (explicit non-goals)

* Full task management (owners, due dates, kanban)
* Automated extraction of decisions/questions from text
* Cross-document rollups
* Permissions / sharing

---

## 4) Key Flows (happy path)

**Flow A: Mark a decision and review later**

1. User writes a paragraph in Exploration
2. User tags it as `decision`
3. User opens Decisions rollup
4. The decision appears with source path + jump-to-source
5. User edits the decision; the source updates

**Flow B: Track open questions to closure**

1. User tags a node as `open_question`
2. Rollup shows it as open
3. Later, user resolves it (toggle)
4. Rollup updates without moving or duplicating the node

**Flow C: Executive scan**

1. Stakeholder opens rollups
2. Scans Decisions + Risks in minutes
3. Jumps to source for details only when needed

---

## 5) Proof Criteria (What “Done” Means)

* [ ] A user can scan Decisions/Open Questions/Risks in under 60 seconds for a medium doc
* [ ] Rollups never feel like “another place to maintain content”
* [ ] Editing from a rollup always edits the source node
* [ ] Tagging remains lightweight and non-taxonomic
* [ ] Users never ask “which one is the real decision list?”

---

## 6) Invariants & Guardrails

**Authoritative sources**

* `README.md`
* `.github/copilot-instructions.md`
* ADR-0001

**Must hold during this milestone**

* No duplication: rollups are views, not exports
* Addressable nodes remain the unit of truth
* Provenance is always available

---

## 7) UX Notes (Tone & Anti-Patterns)

### UX tone

* Light
* Scannable
* Executive-friendly without feeling like a project manager

### Anti-patterns to avoid

* Kanban metaphors or inbox metaphors
* Heavy filters, complex saved views, or taxonomy trees
* “Tag as workflow state” that blocks normal writing

---

## 8) Data / Architecture Notes (Minimal)

* Tags are stored on nodes (system + optional custom)
* Rollups are computed views (selectors), not stored documents
* Resolution state can be stored as lightweight node metadata per tag

---

## 9) Deliverables

* Inline tag UI (add/remove system tags)
* Rollup view screens (Decisions, Open Questions, Risks, Assumptions, Todos)
* Provenance display in rollups (path + jump)
* Resolution toggles for open_question/todo

---

## 10) Follow-ups / Next Milestone Dependencies

* Depends on Milestones 1–3
* Unblocks Milestone 5 (History, Snapshots, and Trust)

---

## Appendix

### Open questions

* Should rollups show transcluded spec items differently than exploration nodes?
* How should “resolved” state be represented without feeling like workflow?
