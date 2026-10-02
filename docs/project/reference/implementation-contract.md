# Observable implementation contract (initial evidence slice)

This contract is deliberately bounded. It reflects only the installed desktop
build evidence linked to observation IDs below, not assumptions about generic
Microsoft Project or claims derived from the GenOffice implementation.

## 1. Reference build

Microsoft Project Standard 2024, Click-to-Run, x64, version/build
`16.0.20326.20142`, on Windows 11 Pro build 26200; current process culture
`en-US` (`MP-BUILD-001`).

## 2. Core entities

No persisted entity schema has yet been empirically established. The blank UI
exposes task-oriented columns, but their underlying persistence fields and
relationships have not been tested (`MP-UI-002`).

## 3. Core state model

A newly displayed blank document is titled `Project1` and opens in a Gantt
Chart workspace (`MP-UI-001`). No save/reopen or dirty-state behavior is
currently part of the contract.

## 4. Task semantics

The blank task table visibly includes Task Mode, Task Name, Duration, Start,
Finish, Predecessors, Resource Names, and Add New Column (`MP-UI-002`). In the
captured state, the status bar says `New Tasks: Manually Scheduled`; this does
not prove the mode used by every creation route or how dates respond to edits.
Creation, editing, deletion, movement, constraints, notes, and progress are
unknown.

## 5. Hierarchy semantics

Unknown. The ribbon has Indent and Outdent controls, but no resulting behavior
or summary rollups have been measured (`MP-UI-002`).

## 6. Dependency semantics

Unknown. A Predecessors column and Link Tasks/Unlink Tasks ribbon controls are
visible; link types, lag/lead, propagation, cycle handling, and undo behavior
have not been experimentally established (`MP-UI-002`).

## 7. Calendar semantics

The new-project automation snapshot named the project calendar `Standard`.
Sunday and Saturday reported nonworking; Monday through Friday reported
working (`MP-CAL-001`). No work shifts, exceptions, or date arithmetic
semantics are established.

## 8. Scheduling semantics

Unknown beyond the calendar weekday flags (`MP-CAL-001`). Do not derive finish
inclusivity, duration units, task mode rules, or dependency calculations from
the UI labels.

## 9. Resource semantics

Unknown. A Resource tab, Resource Names field, and Resource Sheet view shortcut
are visible (`MP-UI-002`), but no resource or assignment experiment has been
performed.

## 10. Baseline/progress semantics

Unknown. The Task ribbon shows percentage-complete controls (`MP-UI-002`), but
their effect and persistence were not tested.

## 11. View behavior

The initial view is Gantt Chart and the status-bar shortcuts include Task
Usage, Team Planner, Resource Sheet, and Blank Report (`MP-UI-001`,
`MP-UI-002`). No other view has been activated or characterized.

## 12. Gantt behavior

The blank view has a task table at left, a dated chart/timescale at right, a
timeline strip above, and horizontal/vertical scroll affordances
(`MP-UI-001`, `MP-UI-002`). Bar geometry and editing gestures are unknown.

## 13. Command behavior

Only labels and grouping are observed for the visible Task ribbon. Enabled
states, prerequisites, dialogs, mutations, recalculation, and persistence
remain untested (`MP-UI-002`).

## 14. Keyboard behavior

Unknown. No keyboard action is included in the verified evidence slice.

## 15. File behavior

Unknown. Supported extensions and import/export behavior have not been tested.

## 16. Save/reopen semantics

Unknown. No controlled project save/reopen round trip has been verified.

## 17. Error behavior

Unknown. No safe error condition has been deliberately triggered and recorded.

## 18. Undo/redo semantics

Unknown. Undo and Redo controls are visible in the Quick Access Toolbar, but
operation boundaries and behavior have not been tested (`MP-UI-002`).

## 19. Accessibility observations

The native UI Automation tree identifies the task chart as a DataGrid named
Gantt Chart and exposes a timeline and status-bar controls. See
[`accessibility/MP-ACC-001.md`](./accessibility/MP-ACC-001.md).

## 20. Known unknowns

See [`unresolved/questions.md`](./unresolved/questions.md); all untested P0 and
P1 areas remain blockers to a high-fidelity clone specification.

## 21. Compatibility boundaries

The application build is identified, but no file compatibility boundary has
been empirically established. No proprietary Project internals were
reverse-engineered.

## 22. Acceptance tests

Only the baseline workspace and Standard weekday-flag observations are
currently supportable. See [`acceptance-tests.md`](./acceptance-tests.md).
