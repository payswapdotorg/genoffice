import { describe, expect, it } from 'vitest'
import { addDependency, addTask, createProject, deleteTask, recalculateProject } from './index'

describe('project-engine', () => {
  it('propagates task dates through dependency chains', () => {
    const project = createProject('Launch plan')
    const withTask = addDependency(project, project.tasks[0].id, project.tasks[1].id, 'FS', 0)
    const updated = recalculateProject(withTask)
    const first = updated.tasks[0]
    const second = updated.tasks[1]

    expect(new Date(second.start).getTime()).toBeGreaterThanOrEqual(new Date(first.start).getTime())
  })

  it('respects lagged finish-to-start dependencies', () => {
    const project = createProject('Lag plan')
    const first = project.tasks[0]
    const second = addTask(project, { name: 'Second task', duration: 4, start: first.start })
    const withDependency = addDependency(second, first.id, second.tasks[1].id, 'FS', 3)
    const updated = recalculateProject(withDependency)

    const expectedStart = new Date(`${first.start}T00:00:00Z`)
    expectedStart.setUTCDate(expectedStart.getUTCDate() + first.duration + 3)
    expect(updated.tasks[1].start).toBe(expectedStart.toISOString().slice(0, 10))
  })

  it('removes a task and its dependent links without leaving stale references', () => {
    const project = createProject('Remove task')
    const extraTask = addTask(project, { name: 'Follow up', duration: 2, start: project.tasks[0].start })
    const withDependency = addDependency(extraTask, project.tasks[0].id, extraTask.tasks[1].id, 'FS', 0)
    const cleaned = deleteTask(withDependency, extraTask.tasks[1].id)

    expect(cleaned.tasks.some((task) => task.id === extraTask.tasks[1].id)).toBe(false)
    expect(cleaned.dependencies.every((dependency) => dependency.successorId !== extraTask.tasks[1].id)).toBe(true)
  })

  it('preserves a round-trip serialization contract', () => {
    const project = createProject('Round-trip')
    const serialized = JSON.stringify(project)
    const parsed = JSON.parse(serialized)

    expect(parsed.name).toBe(project.name)
    expect(parsed.tasks).toHaveLength(project.tasks.length)
  })
})
