export type DependencyType = 'FS' | 'SS' | 'FF' | 'SF'

export interface ProjectTask {
  id: string
  name: string
  duration: number
  start: string
  parentId?: string
  percentComplete: number
  milestone: boolean
}

export interface Dependency {
  id: string
  predecessorId: string
  successorId: string
  type: DependencyType
  lag: number
}

export interface Project {
  id: string
  name: string
  startDate: string
  tasks: ProjectTask[]
  dependencies: Dependency[]
}

const WORKDAY_MS = 24 * 60 * 60 * 1000
const WORKDAY_SHIFT = 1

function isoDateToDate(value: string): Date {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ISO date: ${value}`)
  }
  return date
}

function dateToIso(date: Date): string {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    .toISOString()
    .slice(0, 10)
}

function addDays(value: string, amount: number): string {
  const date = isoDateToDate(value)
  date.setUTCDate(date.getUTCDate() + amount)
  return dateToIso(date)
}

function maxDate(left: string, right: string): string {
  return isoDateToDate(left) > isoDateToDate(right) ? left : right
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function sortByStart(tasks: ProjectTask[]): ProjectTask[] {
  return [...tasks].sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0))
}

export function createProject(name = 'New project'): Project {
  const startDate = dateToIso(new Date())
  const taskA: ProjectTask = {
    id: 'task-1',
    name: 'Kickoff',
    duration: 2,
    start: startDate,
    percentComplete: 0,
    milestone: false,
  }
  const taskB: ProjectTask = {
    id: 'task-2',
    name: 'Requirements',
    duration: 3,
    start: addDays(startDate, 2),
    percentComplete: 0,
    milestone: false,
    parentId: taskA.id,
  }
  const taskC: ProjectTask = {
    id: 'task-3',
    name: 'Delivery milestone',
    duration: 0,
    start: addDays(startDate, 6),
    percentComplete: 100,
    milestone: true,
  }

  return {
    id: 'project-1',
    name,
    startDate,
    tasks: [taskA, taskB, taskC],
    dependencies: [{ id: 'dep-1', predecessorId: taskA.id, successorId: taskB.id, type: 'FS', lag: 0 }],
  }
}

export function addTask(project: Project, input: Partial<ProjectTask> & Pick<ProjectTask, 'name'>): Project {
  const nextId = `task-${project.tasks.length + 1}`
  const task: ProjectTask = {
    id: nextId,
    name: input.name,
    duration: input.duration ?? 1,
    start: input.start ?? project.startDate,
    parentId: input.parentId,
    percentComplete: clamp(input.percentComplete ?? 0, 0, 100),
    milestone: input.milestone ?? false,
  }
  return { ...project, tasks: [...project.tasks, task] }
}

export function updateTask(project: Project, taskId: string, patch: Partial<ProjectTask>): Project {
  return {
    ...project,
    tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)),
  }
}

export function deleteTask(project: Project, taskId: string): Project {
  const nextTasks = project.tasks.filter((task) => task.id !== taskId)
  const nextDependencies = project.dependencies.filter(
    (dependency) => dependency.predecessorId !== taskId && dependency.successorId !== taskId,
  )
  return recalculateProject({ ...project, tasks: nextTasks, dependencies: nextDependencies })
}

export function addDependency(
  project: Project,
  predecessorId: string,
  successorId: string,
  type: DependencyType = 'FS',
  lag = 0,
): Project {
  const dep: Dependency = {
    id: `dep-${project.dependencies.length + 1}`,
    predecessorId,
    successorId,
    type,
    lag,
  }
  return {
    ...project,
    dependencies: [...project.dependencies, dep],
  }
}

export function removeDependency(project: Project, dependencyId: string): Project {
  return {
    ...project,
    dependencies: project.dependencies.filter((dependency) => dependency.id !== dependencyId),
  }
}

export function recalculateProject(project: Project): Project {
  const workingProject = {
    ...project,
    tasks: project.tasks.map((task) => ({ ...task })),
    dependencies: project.dependencies.map((dep) => ({ ...dep })),
  }

  const tasks = new Map(workingProject.tasks.map((task) => [task.id, task]))

  function getTaskEnd(task: ProjectTask): string {
    if (task.milestone) return task.start
    return addDays(task.start, task.duration)
  }

  for (const task of sortByStart(workingProject.tasks)) {
    const incoming = workingProject.dependencies.filter((dep) => dep.successorId === task.id)
    const earliestStart = incoming.reduce((latest, dependency) => {
      const predecessor = tasks.get(dependency.predecessorId)
      if (!predecessor) return latest

      const predecessorStart = predecessor.start
      const predecessorEnd = getTaskEnd(predecessor)
      const laggedStart = addDays(predecessorStart, dependency.lag)
      const laggedEnd = addDays(predecessorEnd, dependency.lag)

      switch (dependency.type) {
        case 'SS':
          return maxDate(latest, laggedStart)
        case 'FF':
          return maxDate(latest, laggedEnd)
        case 'SF':
          return maxDate(latest, laggedStart)
        case 'FS':
        default:
          return maxDate(latest, laggedEnd)
      }
    }, workingProject.startDate)

    if (task.milestone) {
      task.duration = 0
    }

    task.start = earliestStart
  }

  for (const task of workingProject.tasks) {
    if (task.parentId) {
      const parent = tasks.get(task.parentId)
      if (parent) {
        parent.start = parent.start < task.start ? parent.start : parent.start
      }
    }
  }

  for (const parentTask of workingProject.tasks) {
    if (parentTask.parentId) continue
    const children = workingProject.tasks.filter((task) => task.parentId === parentTask.id)
    if (children.length === 0) continue
    const earliest = children.reduce((min, child) => (child.start < min ? child.start : min), parentTask.start)
    const latest = children.reduce((max, child) => {
      const endDate = addDays(child.start, child.duration)
      return endDate > max ? endDate : max
    }, parentTask.start)
    parentTask.start = earliest
    parentTask.duration = Math.max(1, Math.round((isoDateToDate(latest).getTime() - isoDateToDate(earliest).getTime()) / WORKDAY_MS) + 1)
  }

  return workingProject
}

export function serializeProject(project: Project): string {
  return JSON.stringify(project, null, 2)
}

export function deserializeProject(raw: string): Project {
  const parsed = JSON.parse(raw) as Project
  return recalculateProject(parsed)
}

export function formatDateRange(task: Pick<ProjectTask, 'start' | 'duration'>): string {
  return `${task.start} → ${addDays(task.start, task.duration)}`
}

export const defaultProject = createProject
