# Contributing to Compound

This document defines **how documentation, scripts, and migrations are added and maintained** in the Compound repository.

Its purpose is to:

* keep the project coherent as it scales
* prevent silent drift in invariants
* ensure changes are reversible, auditable, and agent-safe

All contributors (human or AI) must follow these rules.

---

## Canonical Sources of Truth

1. **`README.md`**

   * Product constitution
   * Non-negotiable invariants
   * Mental model

2. **`.github/copilot-instructions.md`**

   * Agent behavior contract
   * Enforcement of invariants in generated code

If a change conflicts with either, it must be escalated via an ADR.

---

## Documentation Structure

All documentation (other than `README.md`) lives under `docs/`.

### Required directories

* `docs/architecture/`

  * Domain model explanations
  * Store boundaries
  * Data flow diagrams (text-first)

* `docs/design/`

  * Design prompts
  * UX principles
  * Component-level decisions

* `docs/decisions/`

  * Architecture Decision Records (ADRs)
  * One decision per file

* `docs/agents/`

  * Agent prompts
  * Task templates
  * Checklists for Copilot / other agents

Avoid duplicating content already defined in `README.md`.
Link to it instead.

---

## Writing Documentation

Documentation must:

* explain **why** a decision exists
* explain **how** it should be applied
* avoid restating invariants in new words

Documentation must **not**:

* redefine product truth
* introduce alternate terminology
* describe hypothetical future features without context

If documentation changes an invariant or introduces a new global rule:

* update `README.md`
* add an ADR under `docs/decisions/`

---

## Scripts (`/scripts`)

Scripts are used for one-off or maintenance tasks (data transforms, checks, migrations, audits).

### Rules

* All scripts live in `scripts/`
* Prefer **Node/TypeScript scripts** over bash
* Scripts must be:

  * deterministic
  * versioned
  * auditable

### Script requirements

Each script must:

* document what it does at the top of the file
* support a dry-run mode when destructive
* log actions taken
* fail loudly on unexpected state

Avoid embedding large shell commands directly in `package.json`.
Instead, reference scripts:

```json
{
  "scripts": {
    "migrate:local": "tsx scripts/migrate-local.ts"
  }
}
```

---

## Persistence & Migrations (Local-First)

Compound is **local-first**. Persisted data structures must be treated as long-lived.

### Schema versioning

* All persisted documents must include a `schemaVersion`
* Any breaking change to persisted data requires a migration

### Local migrations

* Local (IndexedDB) migrations live in:

  * `src/persistence/migrations/`
* Migrations must be:

  * ordered
  * idempotent
  * reversible when possible

### Backend migrations (future)

* Database migrations will live in `migrations/`
* Local migrations should mirror backend migrations conceptually
* Do **not** introduce backend assumptions early

---

## Architecture Decision Records (ADRs)

Use ADRs to record decisions that affect:

* invariants
* domain model
* persistence strategy
* editor behavior

### ADR format

File name:

```
ADR-YYYYMMDD-short-title.md
```

Required sections:

* Context
* Decision
* Alternatives Considered
* Consequences
* Follow-ups

ADRs are immutable records. Amend with a new ADR, not edits.

---

## Contribution Checklist

Before merging changes:

* [ ] Invariants in `README.md` are preserved
* [ ] No content duplication where references are required
* [ ] Document data is separate from view state
* [ ] Scripts are safe and documented
* [ ] Migrations include schema version handling
* [ ] New global rules are backed by an ADR

---

## Guiding Principle

> Compound compounds because it remembers why decisions were made.

If a contribution erases context, provenance, or reversibility, it does not belong.
