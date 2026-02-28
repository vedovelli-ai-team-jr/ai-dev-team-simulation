import { useEffect, useState } from 'react'

interface Task {
  id: string
  title: string
  description: string
  assignedAgent: string
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
}

export function TaskQueue() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/tasks')
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }
        const data = await response.json()
        setTasks(data.tasks || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900 text-red-100'
      case 'medium':
        return 'bg-yellow-900 text-yellow-100'
      case 'low':
        return 'bg-green-900 text-green-100'
      default:
        return 'bg-slate-700 text-slate-100'
    }
  }

  if (isLoading) {
    return <div className="text-slate-400">Loading tasks...</div>
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>
  }

  if (tasks.length === 0) {
    return <div className="text-slate-400">No tasks yet. Create one to get started.</div>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-slate-700 rounded p-4 border border-slate-600"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          <p className="text-slate-300 text-sm mb-3">{task.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
            <div>
              <span className="font-medium">Agent:</span> {task.assignedAgent}
            </div>
            <div>
              <span className="font-medium">Due:</span> {task.dueDate}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
