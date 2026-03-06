import { SearchInput } from '../SearchInput'

export interface SearchFiltersProps {
  search?: string
  status?: string
  priority?: string
  assignedTo?: string
  onSearchChange?: (value: string) => void
  onStatusChange?: (value: string | null) => void
  onPriorityChange?: (value: string | null) => void
  onAssignedToChange?: (value: string | null) => void
  onClearFilters?: () => void
  statusOptions?: Array<{ value: string; label: string }>
  priorityOptions?: Array<{ value: string; label: string }>
  assigneeOptions?: Array<{ value: string; label: string }>
}

/**
 * Search and filter controls for tables with URL state persistence support.
 * Integrates with useTable hook for basic client-side filtering.
 *
 * @example
 * ```tsx
 * const { search, status, priority, setSearch, setStatus, setPriority, clearAllFilters } = useSearchFilters()
 *
 * <SearchFiltersComponent
 *   search={search}
 *   status={status}
 *   priority={priority}
 *   onSearchChange={setSearch}
 *   onStatusChange={setStatus}
 *   onPriorityChange={setPriority}
 *   onClearFilters={clearAllFilters}
 *   statusOptions={[
 *     { value: 'backlog', label: 'Backlog' },
 *     { value: 'in-progress', label: 'In Progress' },
 *     { value: 'done', label: 'Done' },
 *   ]}
 *   priorityOptions={[
 *     { value: 'low', label: 'Low' },
 *     { value: 'medium', label: 'Medium' },
 *     { value: 'high', label: 'High' },
 *   ]}
 * />
 * ```
 */
export function SearchFiltersComponent({
  search = '',
  status,
  priority,
  assignedTo,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onAssignedToChange,
  onClearFilters,
  statusOptions = [],
  priorityOptions = [],
  assigneeOptions = [],
}: SearchFiltersProps) {
  const activeFilterCount = [search, status, priority, assignedTo].filter(
    (v) => v
  ).length

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Search
        </label>
        <SearchInput
          value={search}
          placeholder="Search by title..."
          onSearchChange={onSearchChange}
        />
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Status
          </label>
          <select
            value={status || ''}
            onChange={(e) =>
              onStatusChange(e.target.value ? e.target.value : null)
            }
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Priority
          </label>
          <select
            value={priority || ''}
            onChange={(e) =>
              onPriorityChange(e.target.value ? e.target.value : null)
            }
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="">All Priorities</option>
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned To Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Assigned To
          </label>
          <select
            value={assignedTo || ''}
            onChange={(e) =>
              onAssignedToChange(e.target.value ? e.target.value : null)
            }
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="">All Assignees</option>
            {assigneeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Status Bar */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded p-3">
          <span className="text-sm text-slate-300">
            <span className="font-semibold text-blue-400">
              {activeFilterCount}
            </span>{' '}
            filter{activeFilterCount !== 1 ? 's' : ''} applied
          </span>
          <button
            onClick={onClearFilters}
            className="text-sm text-slate-400 hover:text-slate-300 transition-colors underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
