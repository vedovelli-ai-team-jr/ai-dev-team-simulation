import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { useToast } from './Toast'
import { FormField } from './Form/FormField'
import type { Task, UpdateTaskInput, TaskStatus, TaskPriority } from '../types/task'

interface FormFields {
  title: string
  status: TaskStatus
  team: string
  sprint: string
  priority: TaskPriority
  storyPoints: number
  estimatedHours?: number
}

interface EditTaskFormProps {
  task: Task
}

export const EditTaskForm = ({ task }: EditTaskFormProps) => {
  const router = useRouter()
  const { showToast } = useToast()
  const { mutate, isPending } = useUpdateTask()

  const form = useForm<FormFields>({
    defaultValues: {
      title: task.title,
      status: task.status,
      team: task.team,
      sprint: task.sprint,
      priority: task.priority,
      storyPoints: task.storyPoints,
      estimatedHours: task.estimatedHours,
    },
    onSubmit: async ({ value }) => {
      try {
        const data: UpdateTaskInput = {
          title: value.title,
          status: value.status,
          team: value.team,
          sprint: value.sprint,
          priority: value.priority,
          storyPoints: value.storyPoints,
          estimatedHours: value.estimatedHours,
        }

        mutate(
          { id: task.id, data },
          {
            onSuccess: () => {
              showToast('Task updated successfully!', 'success')
              router.navigate({ to: '/' })
            },
            onError: (error) => {
              showToast(
                error.message || 'Failed to update task',
                'error'
              )
            },
          }
        )
      } catch (error) {
        showToast('An error occurred', 'error')
      }
    },
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Task</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-6 bg-slate-800 p-8 rounded-lg"
        >
          <form.Field
            name="title"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Task title is required'
                }
                if (value.trim().length < 3) {
                  return 'Task title must be at least 3 characters'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <FormField label="Task Title">
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter task title"
                  disabled={isPending}
                />
              </FormField>
            )}
          </form.Field>

          <form.Field
            name="status"
            validators={{
              onBlur: ({ value }) => {
                if (!value) {
                  return 'Status is required'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <FormField label="Status">
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value as TaskStatus)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  disabled={isPending}
                >
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </FormField>
            )}
          </form.Field>

          <form.Field
            name="team"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Team is required'
                }
                if (value.trim().length < 2) {
                  return 'Team name must be at least 2 characters'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <FormField label="Team">
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter team name"
                  disabled={isPending}
                />
              </FormField>
            )}
          </form.Field>

          <form.Field
            name="sprint"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Sprint is required'
                }
                if (value.trim().length < 2) {
                  return 'Sprint name must be at least 2 characters'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <FormField label="Sprint">
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter sprint name"
                  disabled={isPending}
                />
              </FormField>
            )}
          </form.Field>

          <form.Field
            name="priority"
            validators={{
              onBlur: ({ value }) => {
                if (!value) {
                  return 'Priority is required'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <FormField label="Priority">
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value as TaskPriority)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  disabled={isPending}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </FormField>
            )}
          </form.Field>

          <form.Field
            name="storyPoints"
            validators={{
              onBlur: ({ value }) => {
                if (typeof value !== 'number' || value < 0) {
                  return 'Story points must be a positive number'
                }
                if (value > 100) {
                  return 'Story points cannot exceed 100'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <FormField label="Story Points">
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min="0"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter story points"
                  disabled={isPending}
                />
              </FormField>
            )}
          </form.Field>

          <form.Field
            name="estimatedHours"
            validators={{
              onBlur: ({ value }) => {
                if (value !== undefined && value !== null) {
                  if (typeof value !== 'number' || value < 0) {
                    return 'Estimated hours must be a positive number'
                  }
                  if (value > 1000) {
                    return 'Estimated hours cannot exceed 1000 hours'
                  }
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <FormField label="Estimated Hours (Optional)">
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min="0"
                  step="0.5"
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined
                    field.setValue(value)
                  }}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter estimated hours"
                  disabled={isPending}
                />
              </FormField>
            )}
          </form.Field>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              {isPending ? 'Updating...' : 'Update Task'}
            </button>
            <button
              type="button"
              onClick={() => router.navigate({ to: '/' })}
              disabled={isPending}
              className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
