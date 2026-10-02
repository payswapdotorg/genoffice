import { useMemo, useState } from 'react'
import {
  addDependency,
  addTask,
  createProject,
  recalculateProject,
  type Project,
} from '@genoffice/project-engine'

const DAY_MS = 24 * 60 * 60 * 1000

function addDays(value: string, amount: number): string {
  const date = new Date(`${value}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

function daysBetween(start: string, end: string): number {
  const diff = new Date(`${end}T00:00:00Z`).getTime() - new Date(`${start}T00:00:00Z`).getTime()
  return Math.max(0, diff / DAY_MS)
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

function getTaskEnd(task: { start: string; duration: number }): string {
  const endDate = new Date(`${task.start}T00:00:00Z`)
  endDate.setUTCDate(endDate.getUTCDate() + task.duration)
  return endDate.toISOString().slice(0, 10)
}

function initialProject(): Project {
  return recalculateProject(createProject('GenOffice launch plan'))
}

export default function App(): React.JSX.Element {
  const [project, setProject] = useState<Project>(() => initialProject())
  const [taskName, setTaskName] = useState('New task')
  const [taskDuration, setTaskDuration] = useState(3)
  const [taskOffset, setTaskOffset] = useState(3)
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')
  const [predecessorId, setPredecessorId] = useState<string>('')

  const selectedTask = project.tasks.find((task) => task.id === selectedTaskId) ?? project.tasks[0]
  const timelineDays = useMemo(() => {
    const start = new Date(`${project.startDate}T00:00:00Z`)
    const lastDate = project.tasks.reduce((latest, task) => {
      const endDate = new Date(`${getTaskEnd(task)}T00:00:00Z`)
      return endDate > latest ? endDate : latest
    }, new Date(start.getTime()))

    const totalDays = Math.max(7, Math.ceil((lastDate.getTime() - start.getTime()) / DAY_MS) + 2)
    return Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(start)
      date.setUTCDate(start.getUTCDate() + index)
      return date
    })
  }, [project])

  const taskStats = useMemo(() => {
    const active = project.tasks.filter((task) => !task.milestone).length
    const totalDuration = project.tasks.reduce((sum, task) => sum + task.duration, 0)
    const lastDate = project.tasks.reduce((latest, task) => {
      const endDate = new Date(`${getTaskEnd(task)}T00:00:00Z`)
      return endDate > latest ? endDate : latest
    }, new Date(`${project.startDate}T00:00:00Z`))
    return { active, totalDuration, finalDate: lastDate }
  }, [project])

  const handleAddTask = () => {
    const name = taskName.trim()
    if (!name) return

    setProject((current) => {
      const next = addTask(current, {
        name,
        duration: Math.max(1, taskDuration),
        start: addDays(current.startDate, taskOffset),
      })
      return recalculateProject(next)
    })
  }

  const handleLinkDependency = () => {
    if (!selectedTaskId || !predecessorId || selectedTaskId === predecessorId) return

    setProject((current) => {
      const next = addDependency(current, predecessorId, selectedTaskId, 'FS', 0)
      return recalculateProject(next)
    })
  }

  const handleReset = () => {
    const resetProject = initialProject()
    setProject(resetProject)
    setSelectedTaskId(resetProject.tasks[0]?.id ?? '')
    setPredecessorId(resetProject.tasks[1]?.id ?? resetProject.tasks[0]?.id ?? '')
  }

  return (
    <div className="project-app">
      <header className="project-header">
        <div>
          <div className="eyebrow">GenOffice</div>
          <h1>{project.name}</h1>
        </div>
        <div className="project-summary">
          <span>{project.tasks.length} tasks</span>
          <span>{taskStats.active} active</span>
          <span>{taskStats.totalDuration}d</span>
        </div>
      </header>

      <div className="toolbar">
        <label className="field">
          <span>Task name</span>
          <input value={taskName} onChange={(event) => setTaskName(event.target.value)} />
        </label>
        <label className="field compact">
          <span>Duration</span>
          <input
            type="number"
            min={1}
            value={taskDuration}
            onChange={(event) => setTaskDuration(Number(event.target.value) || 1)}
          />
        </label>
        <label className="field compact">
          <span>Offset</span>
          <input
            type="number"
            min={0}
            value={taskOffset}
            onChange={(event) => setTaskOffset(Number(event.target.value) || 0)}
          />
        </label>
        <button type="button" onClick={handleAddTask}>
          Add task
        </button>
        <button type="button" className="secondary" onClick={handleReset}>
          Reset demo
        </button>
      </div>

      <div className="project-layout">
        <section className="task-grid">
          <div className="dependency-panel">
            <label className="field">
              <span>Predecessor</span>
              <select
                value={predecessorId}
                onChange={(event) => setPredecessorId(event.target.value)}
              >
                {project.tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Successor</span>
              <select
                value={selectedTask?.id ?? ''}
                onChange={(event) => setSelectedTaskId(event.target.value)}
              >
                {project.tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="secondary" onClick={handleLinkDependency}>
              Link task
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Start</th>
                <th>Duration</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((task) => (
                <tr
                  key={task.id}
                  className={selectedTask?.id === task.id ? 'selected-row' : ''}
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <td>{task.name}</td>
                  <td>{formatDate(task.start)}</td>
                  <td>{task.duration}d</td>
                  <td>{task.percentComplete}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="gantt-panel">
          <div className="panel-header">
            <strong>Schedule</strong>
            <span>{formatDate(project.startDate)} → {formatDate(taskStats.finalDate.toISOString().slice(0, 10))}</span>
          </div>

          <div className="timescale">
            {timelineDays.map((date, index) => (
              <span key={`${date.toISOString()}-${index}`} className="timescale-cell">
                {formatDate(date.toISOString().slice(0, 10))}
              </span>
            ))}
          </div>

          <div className="gantt-rows">
            {project.tasks.map((task) => {
              const offset = daysBetween(project.startDate, task.start)
              const width = Math.max(task.duration * 44, task.milestone ? 24 : 36)
              const left = offset * 44

              return (
                <div key={task.id} className="gantt-row">
                  <span className="gantt-label">{task.name}</span>
                  <div className="gantt-track">
                    <div
                      className={`gantt-bar ${task.milestone ? 'milestone' : ''}`}
                      style={{ left, width }}
                    >
                      <span>{task.milestone ? 'M' : `${task.duration}d`}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
