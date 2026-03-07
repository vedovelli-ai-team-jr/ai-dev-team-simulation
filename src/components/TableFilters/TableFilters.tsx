import React, { useCallback } from 'react'

export interface FilterOption {
  value: string
  label: string
}

export interface TableFiltersProps {
  filters: Record<string, string | null | undefined>
  onFilterChange: (key: string, value: string | null) => void
  onClear: () => void
  filterConfig: Array<{
    key: string
    label: string
    options: FilterOption[]
  }>
}

/**
 * Table filter UI component using controlled form inputs.
 * Syncs filter state with URL search params via onFilterChange callback.
 *
 * @example
 * ```tsx
 * const [filters, setFilters] = useState({})
 * const handleNavigate = (key, value) => {
 *   navigate({ search: { ...filters, [key]: value || undefined } })
 * }
 *
 * <TableFilters
 *   filters={filters}
 *   onFilterChange={handleNavigate}
 *   onClear={() => navigate({ search: {} })}
 *   filterConfig={[
 *     {
 *       key: 'status',
 *       label: 'Status',
 *       options: [
 *         { value: 'backlog', label: 'Backlog' },
 *         { value: 'done', label: 'Done' }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export function TableFilters({
  filters,
  onFilterChange,
  onClear,
  filterConfig,
}: TableFiltersProps) {
  const hasActiveFilters = Object.values(filters).some((v) => v !== null && v !== undefined)

  const handleSelectChange = useCallback(
    (key: string, value: string) => {
      onFilterChange(key, value || null)
    },
    [onFilterChange]
  )

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        {filterConfig.map(({ key, label, options }) => (
          <div key={key} className="flex flex-col gap-1">
            <label
              htmlFor={`filter-${key}`}
              className="text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            <select
              id={`filter-${key}`}
              value={filters[key] || ''}
              onChange={(e) => handleSelectChange(key, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}
