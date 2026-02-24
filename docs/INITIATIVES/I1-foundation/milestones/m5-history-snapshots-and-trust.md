# Milestone 5 — History, Snapshots, and Trust

**Status:** Draft

**Owner:** Project

**Last updated:** 2026-01-15

---

## 1) Claim Being Proved

> Knowledge can evolve over time **without rewriting history**, because changes are traceable, reviewable, and preservable as trusted snapshots.

---

## 2) Why This Is Hard / Non-Obvious

* Editing live documents often erases how decisions were reached
* Versioning systems are usually heavy, developer-centric, or opaque
* Snapshots frequently become forks or outdated copies
* Users fear making changes that might invalidate past understanding

---

## 3) Scope

### In scope (capabilities)

* Node-level history (lightweight diffs over time)
* Clear indication that nodes have changed since last view
* Ability to view prior versions of a node (read-only)
* Immutable Spec snapshots ("Spec v1", "Spec v2", etc.)
* Snapshot provenance linking back to live nodes
* Restore or branch from history without breaking references

### Out of scope (explicit non-goals)

* Git-like branching or merge conflict resolution
* Per-character diff visualizations
* Compliance-grade audit logging
* Multi-user attribution or permissions

---

## 4) Key Flows (happy path)

**Flow A: Inspect change history**

1. User notices a node has changed
2. User opens node history
3. User scans prior versions and timestamps
4. User returns to current view without disruption

**Flow B: Create a Spec snapshot**

1. User reaches a stable moment
2. User creates a Spec snapshot
3. Snapshot becomes read-only
4. Snapshot remains navigable and citable

**Flow C: Restore confidence**

1. User compares current Spec to a snapshot
2. User understands what changed and why
3. User continues editing without fear of loss

---

## 5) Proof Criteria (What “Done” Means)

* [ ] Users can confidently edit without fear of losing past context
* [ ] Snapshots never feel like forks or alternate truths
* [ ] It is always clear which view is live vs historical
* [ ] History inspection is fast and non-disruptive
* [ ] Trust in the system increases as documents age

---

## 6) Invariants & Guardrails

**Authoritative sources**

* `README.md`
* `.github/copilot-instructions.md`
* ADR-0001

**Must hold during this milestone**

* Live references remain intact
* Snapshots are immutable
* History never overwrites canonical content

---

## 7) UX Notes (Tone & Anti-Patterns)

### UX tone

* Reassuring
* Calm
* Transparent

### Anti-patterns to avoid

* Complex version trees
* Fear-inducing warnings
* Treating snapshots as editable documents

---

## 8) Data / Architecture Notes (Minimal)

* Operations log or version metadata stored locally
* Snapshots reference node IDs, not copied content
* History storage designed for future sync

---

## 9) Deliverables

* Node history viewer
* Snapshot creation action
* Snapshot list and navigation
* Visual distinction between live and snapshot views

---

## 10) Follow-ups / Next Milestone Dependencies

* Depends on Milestones 1–4
* Enables collaboration, sync, and compliance features later

---

## Appendix

### Open questions

* How many historical versions should be retained by default?
* Should snapshots be manually named or auto-generated?
