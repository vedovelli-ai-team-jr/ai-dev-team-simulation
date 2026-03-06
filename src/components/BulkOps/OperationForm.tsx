import { useForm } from '@tanstack/react-form'

interface OperationFormProps {
  operationType: 'update-settings' | 'assign-tasks'
  onSubmit: (data: Record<string, unknown>) => void
  isLoading?: boolean
}

export function OperationForm({ operationType, onSubmit, isLoading }: OperationFormProps) {
  const form = useForm({
    defaultValues: {
      ...(operationType === 'update-settings'
        ? {
            status: 'idle',
            capacity: '5',
          }
        : {
            taskId: '',
            taskName: '',
            priority: 'medium',
          }),
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      {operationType === 'update-settings' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Status
            </label>
            <form.Field
              name="status"
              children={(field) => (
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="idle">Idle</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity (tasks)
            </label>
            <form.Field
              name="capacity"
              children={(field) => (
                <input
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              )}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task ID
            </label>
            <form.Field
              name="taskId"
              children={(field) => (
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter task ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name
            </label>
            <form.Field
              name="taskName"
              children={(field) => (
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter task name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <form.Field
              name="priority"
              children={(field) => (
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              )}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
      >
        {isLoading ? 'Processing...' : 'Continue'}
      </button>
    </form>
  )
}
