import { useForm } from '@tanstack/react-form'
import { useState, useEffect } from 'react'

interface Agent {
  id: string
  name: string
}

interface TaskFormProps {
  onTaskCreated: () => void
}

interface TaskFormValues {
  title: string
  description: string
  assignedAgent: string
  priority: 'low' | 'medium' | 'high'
  dueDate: string
}

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    // Fetch available agents
    const mockAgents: Agent[] = [
      { id: '1', name: 'Frontend Developer' },
      { id: '2', name: 'Backend Developer' },
      { id: '3', name: 'DevOps Engineer' },
      { id: '4', name: 'QA Engineer' },
    ]
    setAgents(mockAgents)
  }, [])

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      assignedAgent: '',
      priority: 'medium' as const,
      dueDate: '',
    } satisfies TaskFormValues,
    onSubmit: async (values) => {
      setSubmitError(null)
      setSubmitSuccess(false)

      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          throw new Error('Failed to create task')
        }

        setSubmitSuccess(true)
        form.reset()
        onTaskCreated()

        // Clear success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000)
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred',
        )
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {/* Title Field */}
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => (!value ? 'Title is required' : undefined),
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Task title"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-400 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Description Field */}
      <form.Field
        name="description"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Description is required' : undefined,
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Task description"
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-400 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Assigned Agent Field */}
      <form.Field
        name="assignedAgent"
        validators={{
          onChange: ({ value }) => (!value ? 'Agent is required' : undefined),
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium mb-2">
              Assigned Agent *
            </label>
            <select
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-400 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Priority Field */}
      <form.Field name="priority">
        {(field) => (
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value as any)
              }}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        )}
      </form.Field>

      {/* Due Date Field */}
      <form.Field
        name="dueDate"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'Due date is required'
            const date = new Date(value)
            if (isNaN(date.getTime())) return 'Invalid date'
            return undefined
          },
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium mb-2">
              Due Date *
            </label>
            <input
              name={field.name}
              type="date"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-400 text-sm mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Success Message */}
      {submitSuccess && (
        <div className="p-3 bg-green-900 border border-green-700 rounded text-green-100">
          Task created successfully!
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="p-3 bg-red-900 border border-red-700 rounded text-red-100">
          {submitError}
        </div>
      )}

      {/* Submit Button */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded font-medium transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
