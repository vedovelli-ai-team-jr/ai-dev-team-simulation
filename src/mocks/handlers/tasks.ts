import { http, HttpResponse } from 'msw'
import type { Task } from '../../types/domain'

const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design system architecture',
    description: 'Plan the system structure',
    status: 'in_progress',
    assignedAgentId: 'agent-1',
    sprintId: 'sprint-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Research dependencies',
    description: 'Investigate available libraries',
    status: 'in_progress',
    assignedAgentId: 'agent-4',
    sprintId: 'sprint-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Set up build pipeline',
    description: 'Configure CI/CD',
    status: 'pending',
    assignedAgentId: null,
    sprintId: 'sprint-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const taskHandlers = [
  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    let filtered = mockTasks
    if (status) {
      filtered = mockTasks.filter((t) => t.status === status)
    }
    return HttpResponse.json(filtered)
  }),

  http.get('/api/tasks/:id', ({ params }) => {
    const task = mockTasks.find((t) => t.id === params.id)
    if (!task) {
      return HttpResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    return HttpResponse.json(task)
  }),

  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const task = mockTasks.find((t) => t.id === params.id)
    if (!task) {
      return HttpResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const body = (await request.json()) as Partial<Task>
    Object.assign(task, { ...body, updatedAt: new Date().toISOString() })
    return HttpResponse.json(task)
  }),
]
