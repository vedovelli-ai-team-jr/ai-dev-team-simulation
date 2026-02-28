import { http, HttpResponse } from 'msw'

interface Task {
  id: string
  title: string
  description: string
  assignedAgent: string
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
}

const taskStore: Task[] = []
let taskIdCounter = 1

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  http.post('/api/tasks', async ({ request }) => {
    try {
      const body = await request.json() as Omit<Task, 'id' | 'createdAt'>

      const newTask: Task = {
        id: String(taskIdCounter++),
        ...body,
        createdAt: new Date().toISOString(),
      }

      taskStore.push(newTask)

      return HttpResponse.json(newTask, { status: 201 })
    } catch {
      return HttpResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
  }),

  http.get('/api/tasks', () => {
    return HttpResponse.json({ tasks: taskStore })
  }),
]
