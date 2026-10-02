# Reference-derived acceptance tests

These checks reproduce only behavior already supported by observation records.
They are not a complete acceptance suite.

## AT-UI-001 — Blank Gantt workspace

**Given** Microsoft Project Standard 2024 version `16.0.20326.20142` is
launched on the recorded Windows environment.

**When** a blank project is opened.

**Then**

- the document opens in a Gantt Chart workspace;
- the task table, chart timescale, and timeline strip are visible together;
- the initial workspace matches the regions recorded in `MP-UI-001` and
  `MP-UI-002`.

**Evidence:** `screenshots/MP-UI-001.png`.

## AT-CAL-001 — Standard calendar weekday flags

**Given** a fresh Project1 is created in the captured automation session.

**When** the Standard calendar weekday `Working` flags are read.

**Then** Monday through Friday report working and Saturday/Sunday report
nonworking.

**Boundary:** This does not assert working hours, holiday exceptions, or
date-scheduling outcomes. **Evidence:** `MP-CAL-001`.

## Required but pending

Task CRUD and ordering; summary hierarchy; milestones; task modes; FS/SS/FF/SF
links and lag/lead; conflicting constraints/cycles; calendar work hours and
exceptions; save/reopen and supported file formats; undo/redo; resources and
assignments; baselines/progress; keyboard navigation; and error handling.
Concrete expected values must be added only after isolated reference
experiments establish them.
