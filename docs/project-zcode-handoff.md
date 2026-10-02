# GenOffice Project — ZCode Implementation Handoff

Status: implementation-ready handoff
Reference application: the Microsoft Project desktop application installed on the developer's machine
Target app: **GenOffice Project**
Target location: `apps/project` plus only the shared packages/integration points actually required
Repository source of truth: this repository

## 1. Mission

Build a first-class Microsoft Project-compatible project-management desktop application inside GenOffice, using the locally installed Microsoft Project application as the behavioral and visual reference.

The goal is an **independent reimplementation of the observable product experience**, not extraction or reuse of Microsoft's proprietary source code, binaries, internal APIs, trademarks, or proprietary artwork.

The result must feel like another native GenOffice application and must be launchable from the existing GenOffice shell alongside Docs, Sheets, Slides, PDF, Markdown, and HTML.

Do not modify existing Office apps merely to make the Project prototype work. Reuse shared packages where they are genuinely shared concerns.

## 2. Non-negotiable source-of-truth order

When making an implementation decision, use this precedence:

1. Existing code in this repository.
2. Observable behavior of the Microsoft Project desktop build installed on the developer's machine.
3. Tests and fixtures produced from that reference behavior.
4. Public interoperability/file-format specifications and documentation, where needed.
5. General assumptions.

Do not treat generated summaries, previous agent claims, screenshots without reproducible traces, or documentation in this repository as proof that a feature exists or works.

Before declaring a Project feature implemented, inspect the actual reference application and record:
- the starting state;
- exact user actions;
- visible result;
- persisted result after save/reopen;
- error/blocking behavior;
- keyboard shortcuts where observable;
- resizing/zoom behavior where relevant.

Create a small reference ledger under `docs/project/reference/` containing the observations and test IDs. Prefer screenshots plus concise action traces over prose-only descriptions.

## 3. Reference-app reconnaissance

The first implementation phase is reconnaissance, not coding.

Use the locally installed Microsoft Project desktop application. The exact installed build is the reference; do not substitute Project for the web unless the installed product explicitly launches it.

Use whatever native desktop inspection/automation facilities are available in the ZCode environment (for example OS accessibility/UI inspection, input automation, screenshots, window inspection, or equivalent). Do not assume browser automation can inspect a native Windows application.

Capture a feature inventory covering at least:

### Shell / chrome
- application title and document title behavior;
- window controls, menus, ribbon, tabs and contextual tabs;
- quick-access controls;
- status bar;
- tooltips/screentips;
- dialogs, flyouts, context menus;
- keyboard accelerators and common shortcuts;
- zoom and window-resize behavior.

### Core project workflow
- create blank project;
- project information/settings;
- project start/end date;
- calendars and working/non-working time;
- create, edit, delete, reorder and indent/outdent tasks;
- summary tasks and task hierarchy;
- milestones;
- duration and date editing;
- automatic/manual scheduling behavior, where applicable;
- task constraints;
- task calendars;
- predecessors/successors and dependency types;
- lag/lead;
- task notes/details;
- task progress / % complete;
- remaining/actual duration/date behavior;
- recurring tasks, if present;
- custom fields, if present;
- project summary task.

### Views
Identify every meaningful view visible in the installed build, especially:
- Gantt Chart;
- task sheet/table views;
- timeline;
- resource-oriented views;
- calendar views;
- network/relationship views;
- task usage/resource usage views;
- split/combined views;
- filters/groups;
- sort;
- zoom/time-scale controls.

For each view, record its columns/fields, row interactions, selection behavior, context menus, and how view changes affect editing.

### Resources
- people/resources/material/cost resources as supported;
- resource calendars;
- rates/costs/overtime if supported;
- assignments;
- allocation/over-allocation indicators;
- leveling/resource balancing behavior if supported.

### Scheduling / analysis
- dependency-driven scheduling;
- working-time calculations;
- summary-task rollups;
- critical path behavior;
- slack/float;
- baselines;
- progress calculations;
- project statistics;
- what changes immediately versus only after recalculation.

### File/open/save/export
First inspect what the installed app actually supports:
- native project-file extensions;
- import formats;
- export formats;
- save/save-as behavior;
- recent files;
- recovery/autosave behavior;
- prompts on close when dirty;
- print/page setup/PDF output.

Do not assume native .mpp support is trivial. Treat native file compatibility as a separate engineering problem with explicit tests and a documented compatibility boundary.

## 4. Product architecture

Follow the repository's existing Electron/electron-vite app pattern.

Expected structure:

- `apps/project/`
  - Electron main process
  - preload bridge
  - renderer
  - shared/types
  - tests
  - app-local styles/assets
- `packages/project-engine/` (create only if justified)
  - canonical project domain model
  - scheduling/calculation engine
  - dependency graph
  - calendar/time calculations
  - baseline/progress calculations
  - deterministic commands/transactions
- `packages/project-format/` (create only if justified)
  - import/export codecs/adapters
  - native project-file compatibility boundary
  - interoperable XML/CSV/other formats supported by the reference
- reuse `@genoffice/ui`, `@genoffice/i18n`, `@genoffice/electron-utils`, `@genoffice/project-store`, and other existing packages only where their APIs actually fit.

Do not duplicate shared infrastructure that already exists.

Follow the repo's Electron security boundary:
- renderer has no unrestricted Node.js/filesystem access;
- privileged work goes through validated IPC;
- user-supplied/AI-generated commands are validated before execution;
- writes are atomic where the existing suite expects atomicity;
- no arbitrary JavaScript execution as a feature implementation shortcut.

## 5. Canonical domain model

The Project app must have a canonical internal model independent of the renderer.

At minimum model:

- Project
- Task
- Task hierarchy / summary task
- Task scheduling mode
- Milestone
- Calendar
- Calendar exception / working-time rule
- Dependency
- Resource
- Resource calendar
- Assignment
- Baseline
- Project metadata
- View configuration
- Filter / sort / group state where persistence is required

Use stable IDs for every project entity. Do not use rendered row position as identity.

The scheduling engine must be deterministic and testable without Electron or React.

Core invariants must include:
- no invalid dependency cycles unless the reference explicitly permits them;
- child/summary relationships remain consistent;
- dates respect working calendars where applicable;
- dependency changes propagate predictably;
- edits are transactional;
- undo/redo operates on semantic operations, not DOM mutations;
- serialization/deserialization preserves semantic values;
- recalculation is deterministic.

## 6. UI target

Build the renderer around the reference application's actual interaction model.

The primary workspace should support a high-density project-management layout rather than a generic dashboard.

The likely central composition is:
- ribbon/top command area;
- task grid/table;
- Gantt/timeline canvas;
- optional timeline/secondary pane;
- status bar;
- context menus and detail dialogs.

However, the installed reference application is authoritative. Do not invent an alternate UX merely because it is easier to implement.

Visual parity must cover:
- proportions;
- spacing;
- typography hierarchy;
- iconography using independently sourced/created icons;
- selection states;
- hover/pressed/disabled states;
- grid density;
- row heights;
- date-scale styling;
- dependency arrows;
- milestone rendering;
- critical-path/baseline visual treatment where supported;
- dialogs and menus;
- light/dark/system themes.

Do not paste proprietary Microsoft assets into the repository.

Follow `CLAUDE.md` theme rules exactly. Chrome colors use semantic tokens; authored document/project content stays independent of theme remapping.

## 7. Interaction parity

The app is not complete when it merely resembles the reference.

For each implemented workflow, verify:
1. pointer interaction;
2. keyboard interaction where the reference supports it;
3. focus behavior;
4. selection behavior;
5. undo/redo;
6. dirty-state behavior;
7. save/reopen;
8. error states;
9. resize/zoom;
10. accessibility labels/roles for important controls.

Examples of mandatory end-to-end journeys:

### Journey A — create a usable plan
Create project -> set project dates -> create task hierarchy -> set durations -> add dependencies -> inspect Gantt -> save -> close -> reopen -> verify identical semantics.

### Journey B — edit a live plan
Open project -> edit duration/date/dependency -> verify schedule recalculation -> undo -> redo -> save -> reopen.

### Journey C — resource planning
Create resource(s) -> assign to tasks -> inspect resource/task views -> change assignment -> verify rollups and indicators.

### Journey D — baseline/progress
Create baseline -> change task progress/dates -> inspect baseline/current comparison -> save/reopen.

### Journey E — file compatibility
Open a supported reference file -> inspect semantics -> make a change -> save as supported format -> reopen -> compare semantic model.

## 8. File compatibility strategy

Do not start by promising perfect .mpp parity.

First determine exactly what the installed reference can open/save and which formats expose enough information for independent implementation.

Use a compatibility ladder:

Tier 1:
- one reliable native/standard interchange format that preserves the core domain model.

Tier 2:
- common import/export formats observed in the reference.

Tier 3:
- native proprietary project-file compatibility, only through an independently implemented or appropriately licensed compatibility layer.

Every format must have fixtures and round-trip tests.

If a format cannot be supported safely or completely, fail explicitly with a user-facing message rather than silently discarding project semantics.

Never perform lossy import/export while presenting the operation as lossless.

## 9. AI integration

Keep AI optional and bounded.

Project-specific AI capabilities may eventually include:
- generate task breakdown;
- suggest dependencies;
- summarize schedule risks;
- answer questions about the current project;
- suggest resource allocations;
- propose schedule changes.

AI must never directly mutate the project model without the same schema validation, preview/transaction, revision checks, and explicit approval boundaries used elsewhere in GenOffice.

Do not let AI architecture delay deterministic Project functionality.

## 10. Work allocation for ZCode

Orchestrate three workers concurrently once reconnaissance has frozen the interfaces.

### Worker 1 — Project engine
Own:
- canonical domain model;
- scheduling engine;
- dependency graph;
- calendar math;
- progress/baseline calculations;
- semantic command/transaction layer;
- unit/property/invariant tests.

Must have no dependency on React/Electron.

### Worker 2 — Project renderer
Own:
- Gantt/task-grid/timeline UI;
- ribbon/menu/dialog UI;
- view switching;
- keyboard/mouse interactions;
- visual states;
- theme compliance;
- renderer tests and screenshot/golden tests.

Consume Worker 1's stable domain APIs; do not implement a second scheduling engine in the renderer.

### Worker 3 — shell + compatibility
Own:
- `apps/project` Electron main/preload wiring;
- shell launcher integration;
- file open/save dialogs and routing;
- supported file-format adapters;
- recent-file integration;
- packaging/build integration;
- end-to-end flows;
- compatibility fixtures.

All workers must operate from the frozen contracts recorded in this document and any files added under `docs/project/`.

## 11. Orchestrator rules

ZCode is the orchestrator.

Cycle:
**inspect repository -> inspect reference -> freeze contract -> delegate -> monitor -> harvest -> review -> request changes -> re-run tests -> integrate**

Do not allow workers to invent conflicting architectures.

The orchestrator must:
- review actual diffs, not status messages;
- verify file ownership boundaries;
- reject duplicate engines;
- reject placeholder implementations;
- reject buttons that do nothing;
- reject "works" claims without executable tests;
- ensure shell integration is real;
- ensure the packaged app launches;
- run all relevant repository gates before completion.

## 12. Definition of done

GenOffice Project is complete for a release milestone only when:

- `apps/project` exists as a real sibling Office app;
- it is available from the GenOffice shell/launcher;
- it opens in its own editor surface/window using the same app architecture as the existing Office clones;
- create/open/edit/save/close works for the supported project formats;
- Gantt/task-grid/timeline workflows demonstrated by the installed reference are implemented for the frozen milestone;
- scheduling is driven by one deterministic domain engine;
- dependencies, calendars, hierarchy and core calculations are covered by automated tests;
- undo/redo and dirty-state behavior work;
- important controls have no dead actions;
- theme and i18n rules are respected;
- build/typecheck/lint/test gates pass;
- end-to-end journeys pass;
- packaged application launch has been verified;
- no claim of unsupported file-format fidelity is made.

## 13. First commit sequence

Do not begin by making a huge application commit.

Recommended progression:

1. Add this handoff and the reference-observation template.
2. Complete reconnaissance and freeze the initial compatibility matrix.
3. Add engine contracts/tests.
4. Implement the smallest end-to-end project: create -> tasks -> dependencies -> Gantt -> save -> reopen.
5. Integrate into the shell.
6. Add broader views/resources/baselines/import-export in separate milestones.
7. Add screenshot and regression gates.

Each milestone must leave the repository buildable.

## 14. Important implementation boundary

The reference application is used to learn **observable UX, workflows, and interoperability requirements**. Reimplement those behaviors independently.

Do not copy Microsoft Project binaries, decompile proprietary code for inclusion, redistribute Microsoft's assets, or make the project dependent on a locally installed copy of Microsoft Project at runtime.

GenOffice Project must remain a standalone application.
