# Project reference ledger

This ledger points to the empirical Microsoft Project desktop reference records
in [`docs/project/reference/`](./project/reference/). Those records distinguish
directly observed behavior from untested areas; they are not a claim of feature
parity.

## Verified reference

- The installed product is Microsoft Project Standard 2024, Click-to-Run, x64,
  version `16.0.20326.20142` (observation `MP-BUILD-001`).
- The reference opens a ribbon-based Gantt Chart workspace with an integrated
  timeline and split task/Gantt panes (observations `MP-UI-001` and
  `MP-UI-002`).
- The visible task-table columns in the captured blank workspace include Task
  Mode, Task Name, Duration, Start, Finish, Predecessors, Resource Names, and
  Add New Column (`MP-UI-002`).
- The observed new-task indicator reads “New Tasks: Manually Scheduled” in the
  captured blank-project state (`MP-UI-002`). This is a state observation, not
  proof of how all task-creation paths behave.
- An automation snapshot of a new `Project1` reported the `Standard` calendar
  and Monday-Friday as working weekdays, with Saturday and Sunday nonworking
  (`MP-CAL-001`). Work-hour shifts were not established by that snapshot.

## Evidence quality and gaps

The build metadata, screenshot, sanitized control inventory, and calendar
snapshot are recorded with evidence provenance in the reference package. The
current package is an initial verified slice: no task-edit, dependency,
hierarchy, undo/redo, file round-trip, resource, baseline, error, or complete
view experiments have yet met the required before/action/after/reopen bar.
Those areas remain explicitly unknown rather than inferred from generic Project
knowledge or from the GenOffice implementation.

See [`implementation-contract.md`](./project/reference/implementation-contract.md)
for the bounded behavior that can currently be relied on, and
[`unresolved/questions.md`](./project/reference/unresolved/questions.md) for
the remaining investigation backlog.
