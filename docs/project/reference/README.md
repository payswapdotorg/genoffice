# Microsoft Project reference investigation

## Scope and status

This package records an initial evidence-backed slice from the Microsoft Project
desktop application installed on this Windows machine. The investigated
executable was `C:\Program Files\Microsoft Office\root\Office16\WINPROJ.EXE`.
The observed product is Project Standard 2024, version `16.0.20326.20142`;
details and provenance are in [`build.json`](./build.json).

The current evidence covers product/build metadata, the initial blank-project
workspace, its visible task/Gantt/timeline composition, a partial accessibility
tree, and a calendar weekday snapshot. It does **not** constitute a complete
product archaeology or a clone-ready specification. Critical scheduling,
editing, persistence, error, and resource semantics remain unknown.

## Method

- Read installed-product and Office Click-to-Run registry metadata, executable
  version fields, Windows OS metadata, and the current process culture.
- Inspected Project Standard's native window and UI Automation tree.
- Captured a blank-project screenshot at 1936x1048.
- Read the new-project defaults and weekday flags from a local Project
  automation evidence snapshot; these values are reported only for that
  captured session.
- Avoided treating application labels, prior implementation behavior, or
  undocumented assumptions as proof of scheduling semantics.

Some raw exploratory files in the local `evidence/` working folder include
account or recent-file UI metadata and are intentionally not part of the
shareable evidence set. The sanitized records here contain no account identity.

## Inventory

- Machine-readable observation records: 4
- Controlled task-scheduling experiments meeting the complete
  before/action/after/reopen bar: 0
- Portable Project fixture files: 0
- Shareable screenshots: 1 baseline workspace screenshot
- Directly observed areas: installed build, blank-project startup, primary
  Gantt workspace, task-grid headers, timeline presence, visible ribbon groups,
  status-bar view shortcuts, Standard calendar weekday flags.

## Package map

- [`observations.json`](./observations.json): machine-readable evidence ledger.
- [`capability-matrix.json`](./capability-matrix.json): verified and untested
  capability status.
- [`implementation-contract.md`](./implementation-contract.md): bounded
  observable contract with observation IDs.
- [`acceptance-tests.md`](./acceptance-tests.md): currently supportable checks
  and explicitly pending tests.
- [`visual-acceptance.md`](./visual-acceptance.md): baseline workspace regions
  and screenshot reference.
- [`unresolved/questions.md`](./unresolved/questions.md): prioritized
  investigation backlog.
- [`screenshots/`](./screenshots/): sanitized screenshot for this evidence
  slice.
- [`evidence/`](./evidence/): sanitized UI-control and calendar snapshots.

## What another implementation agent can rely on

Only statements marked `observed` in `observations.json` and linked to the
evidence listed for them. The task mode visible in the screenshot is a captured
UI state, not a universal setting guarantee. The weekday flags do not establish
working-hour shifts, holidays, date inclusivity, or dependency calculations.

## Still unknown

The exact task edit/insert/delete and hierarchy interactions; all four link
types and lag/lead; calendar work hours and exceptions; manual versus automatic
scheduling transitions; Project views and their editability; resources,
assignments, baseline/progress calculations; keyboard/undo semantics; file
formats and round-trips; error prompts; and Project Options/add-in state.

Until those experiments are performed and persisted with reproducible
before/action/after evidence, this package must not be presented as complete.
