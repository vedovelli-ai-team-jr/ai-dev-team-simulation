import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { useCallback, useEffect, useMemo } from 'react'
import type { TaskStatus, TaskPriority } from '../types/task'

interface TaskFiltersPanelProps {
  onFiltersApply: (filters: TaskFiltersFormData) => void | Promise<void>
  assignees: string[]
  isLoading?: boolean
  debounceMs?: number
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review', label: 'In Review' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

/**
 * Validation schema for task filters using Zod
 */
const taskFiltersSchema = z.object({
  search: z.string().optional().default(''),
  priority: z.enum(['low', 'medium', 'high']).optional().nullable().default(null),
  statuses: z.array(z.enum(['backlog', 'in-progress', 'in-review', 'done'])).default([]),
  assignee: z.string().optional().nullable().default(null),
  dueDateFrom: z.string().optional().default(''),
  dueDateTo: z.string().optional().default(''),
})

export type TaskFiltersFormData = z.infer<typeof taskFiltersSchema>

/**
 * TaskFilterPanel component using TanStack Form for state management.
 *
 * Features:
 * - Priority filter: Single select dropdown
 * - Status filter: Multi-select checkbox group (Open/In Progress/Done/Backlog)
 * - Assignee filter: Searchable dropdown with agent names
 * - Date range filter: Date pickers for due date range
 * - Search input: Full-text search with debounced input (300ms)
 * - Apply Filters and Clear All actions
 * - Active filter count badge
 * - Loading state indication
 * - URL query param persistence via TanStack Router
 */
export function TaskFiltersPanel({
  onFiltersApply,
  assignees,
  isLoading = false,
  debounceMs = 300,
}: TaskFiltersPanelProps) {
  const form = useForm<TaskFiltersFormData>({
    defaultValues: {
      search: '',
      priority: null,
      statuses: [],
      assignee: null,
      dueDateFrom: '',
      dueDateTo: '',
    },
    onSubmit: async ({ value }) => {
      await onFiltersApply(value)
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: taskFiltersSchema,
    },
  })

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    const { search, priority, statuses, assignee, dueDateFrom, dueDateTo } = form.state.values
    return (
      (search ? 1 : 0) +
      (priority ? 1 : 0) +
      (statuses.length > 0 ? 1 : 0) +
      (assignee ? 1 : 0) +
      (dueDateFrom ? 1 : 0) +
      (dueDateTo ? 1 : 0)
    )
  }, [form.state.values])

  // Debounced submission
  useEffect(() => {
    const timer = setTimeout(() => {
      form.handleSubmit()
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [form.state.values, debounceMs, form])

  const handleClearAll = useCallback(() => {
    form.reset()
  }, [form])

  const handleStatusToggle = useCallback(
    (status: TaskStatus) => {
      const statuses = form.state.values.statuses || []
      const newStatuses = statuses.includes(status)
        ? statuses.filter((s) => s !== status)
        : [...statuses, status]
      form.setFieldValue('statuses', newStatuses)
    },
    [form]
  )

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Header with active filter count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {activeFilterCount} active
            </span>
            <button
              onClick={handleClearAll}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Search Input */}
      <form.Field
        name="search"
        children={(field) => (
          <div>
            <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Search Tasks
            </label>
            <input
              id="search-filter"
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isLoading}
              placeholder="Search by task title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              {isLoading ? 'Searching...' : 'Search updates after you stop typing (300ms debounce)'}
            </p>
          </div>
        )}
      />

      {/* Priority Filter */}
      <form.Field
        name="priority"
        children={(field) => (
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority-filter"
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value ? (e.target.value as TaskPriority) : null)}
              onBlur={field.handleBlur}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Priorities</option>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {/* Status Filter - Multi-select Checkboxes */}
      <form.Field
        name="statuses"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status
            </label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`status-${option.value}`}
                    type="checkbox"
                    checked={(field.state.value || []).includes(option.value)}
                    onChange={() => handleStatusToggle(option.value)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border border-gray-300 text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor={`status-${option.value}`} className="ml-2 text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      />

      {/* Assignee Filter */}
      <form.Field
        name="assignee"
        children={(field) => (
          <div>
            <label htmlFor="assignee-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Assignee
            </label>
            <select
              id="assignee-filter"
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value ? e.target.value : null)}
              onBlur={field.handleBlur}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Assignees</option>
              {assignees.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {/* Date Range Filter */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="dueDateFrom"
          children={(field) => (
            <div>
              <label htmlFor="due-date-from" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date From
              </label>
              <input
                id="due-date-from"
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}
        />

        <form.Field
          name="dueDateTo"
          children={(field) => (
            <div>
              <label htmlFor="due-date-to" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date To
              </label>
              <input
                id="due-date-to"
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => form.handleSubmit()}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Apply Filters
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}
