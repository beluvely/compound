# Milestone 3 — Normalization & Drift Awareness

**Status:** Draft

**Owner:** Project

**Last updated:** 2026-01-15

---

## 1) Claim Being Proved

> Accumulated knowledge can stay **semantically aligned over time** because language, assumptions, and models are gently enforced and drift is made visible.

---

## 2) Why This Is Hard / Non-Obvious

* AI outputs naturally vary wording, structure, and assumptions
* Human edits introduce subtle semantic divergence over time
* Most tools either ignore drift or enforce rigid schemas
* Over-aggressive enforcement breaks exploratory flow and trust

---

## 3) Scope

### In scope (capabilities)

* Canonical vocabulary and assumptions (v0, lightweight)
* Node-level normalization status (unknown / compliant / flagged)
* Visual drift indicators that do not block editing
* Manual accept / override with traceability
* Normalization applied consistently to AI output

### Out of scope (explicit non-goals)

* Full ontology or schema editor
* Automatic rewriting without user review
* Hard validation that blocks progress
* Cross-document normalization

---

## 4) Key Flows (happy path)

**Flow A: AI output normalization**

1. User inserts AI-generated content
2. System checks against canonical terms
3. Node is marked as `unknown` or `flagged`
4. User reviews and marks compliant or overrides

**Flow B: Human edit drift**

1. User edits an existing node
2. System detects potential drift (heuristic)
3. Subtle indicator appears on the node
4. User inspects and resolves or ignores

---

## 5) Proof Criteria (What “Done” Means)

* [ ] Users can see when content may be drifting
* [ ] Drift indicators never block editing
* [ ] Canonical terms are reused more consistently over time
* [ ] Users trust the system more as content grows
* [ ] The UI never feels punitive or noisy

---

## 6) Invariants & Guardrails

**Authoritative sources**

* `README.md`
* `.github/copilot-instructions.md`
* ADR-0001

**Must hold during this milestone**

* Exploration remains flexible and forgiving
* No duplication introduced by normalization
* Overrides are always possible and visible

---

## 7) UX Notes (Tone & Anti-Patterns)

### UX tone

* Gentle
* Advisory
* Non-authoritarian

### Anti-patterns to avoid

* Red error states for semantic issues
* Forced rewrites or auto-corrections
* Modal-heavy review flows

---

## 8) Data / Architecture Notes (Minimal)

* Normalization metadata stored on nodes
* Canonical vocabulary stored separately from nodes
* Drift detection may start heuristic/manual

---

## 9) Deliverables

* Canonical vocabulary editor (minimal)
* Node-level normalization indicators
* Manual compliance / override actions
* Normalization applied to AI insertions

---

## 10) Follow-ups / Next Milestone Dependencies

* Depends on Milestones 1 and 2
* Unblocks Milestone 4 (Decisions & Rollups)

---

## Appendix

### Open questions

* How visible should drift indicators be by default?
* Should normalization differ between Exploration and Spec?
