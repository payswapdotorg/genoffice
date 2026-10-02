# MP-ACC-001 — Initial Gantt accessibility summary

**Source:** native Windows UI Automation tree inspection of the blank Project1
workspace. The profile/account control is deliberately omitted.

- The main document exposes a `DataGrid` named `Gantt Chart`.
- A secondary `DataGrid` named `Sub view` is present in the window tree.
- The timeline is exposed as a custom control named `Timeline`.
- The timeline child exposes a bar with accessible start/finish text for the
  blank project.
- The bottom status region is exposed as a `StatusBar`; it includes text for
  Ready/new-task mode and controls for Gantt Chart, Task Usage, Team Planner,
  Resource Sheet, Blank Report, and zoom.
- Grid cell roles/values were not reliably exposed as individual accessible
  children in the captured tree. More focused cell-editing inspection is
  required.

**Evidence:** `MP-UI-001`, `MP-UI-002`; local raw UIA tree is not included
because exploratory captures also contain account metadata.
