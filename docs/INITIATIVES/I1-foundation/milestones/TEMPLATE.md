# Milestone Template — Compound

> **Purpose:** Milestones in Compound are **claims we must prove**, not feature checklists.
> This template keeps milestones small, testable, and resistant to scope creep.

---

## Title

**Milestone X: <short name>**

**Status:** Draft | Active | Complete | Archived

**Owner:** <name/handle>

**Last updated:** YYYY-MM-DD

---

## 1) Claim Being Proved

> In one sentence, what becomes *obviously true* after this milestone ships?

Example format:

* “Users can ________ without ________.”
* “The system can ________ while preserving ________.”

---

## 2) Why This Is Hard / Non-Obvious

* What fails in existing tools?
* What user behavior or system constraint makes this difficult?
* What is the main risk or uncertainty?

Keep to 3–6 bullets.

---

## 3) Scope

### In scope (capabilities)

List capabilities (not UI components).

*
*
*

### Out of scope (explicit non-goals)

Be strict. This prevents scope creep.

*
*
*

---

## 4) Key Flows (happy path)

Write 1–3 flows. Each flow is a sequence of user intents.

**Flow A: <name>**
1.
2.
3.

**Flow B: <name>**
1.
2.
3.

---

## 5) Proof Criteria (What “Done” Means)

These are experiential checks—what we can observe in a demo or test.

* [ ] A user can ________ in under __ minutes without guidance.
* [ ] The UI makes it clear that ________.
* [ ] It is difficult/impossible to accidentally ________.
* [ ] The system preserves ________ even when ________.

---

## 6) Invariants & Guardrails

Link to the invariant sources and list the relevant ones.

**Authoritative sources**

* `README.md` (product invariants)
* `.github/copilot-instructions.md` (agent enforcement)
* Relevant ADR(s):

## **Must hold during this milestone**

*
*

---

## 7) UX Notes (Tone & Anti-Patterns)

### UX tone

* Calm / workbench / briefing / etc.

### Anti-patterns to avoid

*
*

---

## 8) Data/Architecture Notes (Minimal)

Only note what must change in the domain model, stores, or persistence.

* Domain changes:
* Store changes:
* Persistence/migrations:

---

## 9) Deliverables

Keep deliverables implementation-oriented.

* Components:
* Store/actions:
* Tests (if any):
* Docs updates (if any):

---

## 10) Follow-ups / Next Milestone Dependencies

* Depends on:
* Unblocked by:
* Next milestones impacted:

---

## Appendix (Optional)

### Open questions

*

### References

* Links to designs, Figma frames, demos, or recordings
