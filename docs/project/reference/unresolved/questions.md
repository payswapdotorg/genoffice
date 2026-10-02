# Unresolved reference questions

Every item below is open; do not substitute general Project knowledge for a
controlled observation. Resolve P0 items before treating the reference
specification as implementation-ready.

## P0 — core product behavior

1. **Task entry/edit/delete/order:** Which keyboard and pointer actions commit
   cell edits? What are the exact initial values, insertion positions, dirty
   state, and undo boundaries?
2. **Task scheduling mode:** Does the blank-grid status text mean all inserted
   tasks begin manually scheduled? How does Auto Schedule alter dates and
   dependency propagation?
3. **Durations and dates:** What does `1d` mean, how are finishes displayed,
   and how do starts on weekends or nonworking dates normalize?
4. **Hierarchy:** How do indent/outdent create summary tasks; how are nested
   summaries, duration, finish, and percent-complete rolled up?
5. **Dependencies:** Measure FS/SS/FF/SF, lag/lead units, multiple links,
   link edits/deletion, cycles, and constraint conflicts.
6. **Save/open:** Which formats are supported, what state survives round trips,
   and what prompts/errors appear on close, open, or invalid input?
7. **Undo/redo:** Identify mutation boundaries, view-state effects, and redo
   invalidation after a new edit.

## P1 — important scheduling/product areas

1. Standard working-hour shifts, holidays, calendar exceptions, task/resource
   calendars, and time zones.
2. Resource categories, rates, assignments, work/cost calculations,
   over-allocation, and leveling.
3. Baselines, multiple baseline slots, actuals, remaining work/duration,
   critical path, and slack.
4. All exposed views, fields, filtering/grouping/sorting, view editing, and
   zoom/time-scale behavior.
5. Project Information, working-time, task-information, and resource dialogs;
   enabled-state prerequisites and error handling.

## P2 — secondary areas

- Reports, advanced styling, custom fields, links/notes, print/export, templates,
  tooltips, contextual tabs, and add-in/option configuration.
- Accessibility roles/states and keyboard accelerators for controls outside
  the initial Gantt workspace.
