import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import type { AgentCapacityMetrics } from '../../types/capacity'

interface CapacityAdjustmentFormProps {
  agent: AgentCapacityMetrics
  onSubmit: (agentId: string, newCapacity: number) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

interface FormData {
  capacity: number
}

export function CapacityAdjustmentForm({
  agent,
  onSubmit,
  onCancel,
  isLoading = false,
}: CapacityAdjustmentFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      capacity: agent.maxCapacity,
    },
    onSubmit: async (values) => {
      setError(null)
      setSuccess(false)

      // Validation
      if (values.capacity < agent.tasksAssigned) {
        setError(`Capacity cannot be lower than current assigned tasks (${agent.tasksAssigned})`)
        return
      }

      if (values.capacity < 1 || values.capacity > 100) {
        setError('Capacity must be between 1 and 100')
        return
      }

      try {
        await onSubmit(agent.agentId, values.capacity)
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          onCancel?.()
        }, 1500)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update capacity')
      }
    },
  })

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      <h3 className="font-semibold text-slate-900 mb-4">
        Adjust Capacity — {agent.name}
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field
          name="capacity"
          validators={{
            onBlur: (value) => {
              if (value < 1 || value > 100) {
                return 'Capacity must be between 1 and 100'
              }
              return undefined
            },
          }}
          children={(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 mb-2">
                New Capacity (Max Tasks)
              </label>
              <input
                id={field.name}
                type="number"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(parseInt(e.target.value, 10) || 0)}
                onBlur={field.handleBlur}
                min="1"
                max="100"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
              />
              {field.state.meta.errors && (
                <p className="text-sm text-red-600 mt-1">{field.state.meta.errors.join(', ')}</p>
              )}
              <p className="text-xs text-slate-600 mt-2">
                Current: {agent.maxCapacity} | Assigned: {agent.tasksAssigned} | Available: {Math.max(0, agent.maxCapacity - agent.tasksAssigned)}
              </p>
            </div>
          )}
        />

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-800">✓ Capacity updated successfully</p>
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Capacity'}
          </button>
        </div>
      </form>
    </div>
  )
}
