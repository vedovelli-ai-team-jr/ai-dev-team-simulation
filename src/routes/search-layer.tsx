import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState, useEffect } from 'react'
import { SearchFiltersComponent } from '../components/SearchFilters'
import { SimpleTable, type SimpleTableColumn } from '../components/SimpleTable/SimpleTable'
import { useSearchFilters } from '../hooks/useSearchFilters'
import type { Task } from '../types/task'

// Mock task data generator
function generateMockTasks(count: number): Task[] {
  const statuses = ['backlog', 'in-progress', 'in-review', 'done'] as const
  const priorities = ['low', 'medium', 'high'] as const
  const assignees = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']

  const tasks: Task[] = []

  for (let i = 0; i < count; i++) {
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60))

    tasks.push({
      id: `TASK-${String(i + 1).padStart(4, '0')}`,
      title: `Task ${i + 1}: Sample implementation task`,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      team: 'Engineering',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      storyPoints: Math.floor(Math.random() * 13) + 1,
      sprint: 'Sprint 1',
      order: i,
      estimatedHours: Math.floor(Math.random() * 40) + 4,
      createdAt: createdDate.toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return tasks
}

export const Route = createFileRoute('/search-layer')({
  component: SearchLayerPage,
})

function SearchLayerPage() {
  const {
    search,
    status,
    priority,
    assignedTo,
    sortBy,
    sortOrder,
    setSearch,
    setStatus,
    setPriority,
    setAssignedTo,
    setSorting,
    clearAllFilters,
    hasActiveFilters,
  } = useSearchFilters()

  const [tasks] = useState<Task[]>(() => generateMockTasks(50))
  const [isLoading] = useState(false)

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks]

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.id.toLowerCase().includes(searchLower)
      )
    }

    if (status) {
      result = result.filter((task) => task.status === status)
    }

    if (priority) {
      result = result.filter((task) => task.priority === priority)
    }

    if (assignedTo) {
      result = result.filter((task) => task.assignee === assignedTo)
    }

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        let aVal: any = a[sortBy as keyof Task]
        let bVal: any = b[sortBy as keyof Task]

        // Handle null/undefined
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return sortOrder === 'asc' ? 1 : -1
        if (bVal == null) return sortOrder === 'asc' ? -1 : 1

        // String comparison
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const cmp = aVal.localeCompare(bVal)
          return sortOrder === 'asc' ? cmp : -cmp
        }

        // Numeric comparison
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
        }

        // Fallback
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    } else {
      // Default sort by date descending if no sort specified
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })
    }

    return result
  }, [tasks, search, status, priority, assignedTo, sortBy, sortOrder])

  // Extract unique values for filter dropdowns
  const uniqueAssignees = useMemo(() => {
    const assignees = new Set(tasks.map((t) => t.assignee))
    return Array.from(assignees)
      .sort()
      .map((assignee) => ({
        value: assignee,
        label: assignee,
      }))
  }, [tasks])

  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'in-review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ]

  // Table columns configuration
  const columns: SimpleTableColumn<Task>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          backlog: 'text-slate-400',
          'in-progress': 'text-blue-400',
          'in-review': 'text-purple-400',
          done: 'text-green-400',
        }
        return <span className={statusColors[status] || 'text-slate-300'}>{status}</span>
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (priority: string) => {
        const priorityColors: Record<string, string> = {
          low: 'bg-blue-900 text-blue-200',
          medium: 'bg-yellow-900 text-yellow-200',
          high: 'bg-red-900 text-red-200',
        }
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[priority] || ''}`}>
            {priority}
          </span>
        )
      },
    },
    {
      key: 'assignee',
      label: 'Assigned To',
      sortable: true,
    },
    {
      key: 'storyPoints',
      label: 'Story Points',
      sortable: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">Search Layer MVP</h1>
          <p className="text-slate-400 text-lg">
            Search and filter tasks with URL state persistence. Filters are bookmarkable and shareable.
          </p>
        </div>

        {/* Search & Filters Section */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <SearchFiltersComponent
            search={search}
            status={status}
            priority={priority}
            assignedTo={assignedTo}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
            onAssignedToChange={setAssignedTo}
            onClearFilters={clearAllFilters}
            statusOptions={statusOptions}
            priorityOptions={priorityOptions}
            assigneeOptions={uniqueAssignees}
          />
        </div>

        {/* Sort Controls */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-300">Sort by:</label>
              <select
                value={sortBy || 'createdAt'}
                onChange={(e) => setSorting(e.target.value, sortOrder)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Default (Date)</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="storyPoints">Story Points</option>
              </select>
              <button
                onClick={() => setSorting(sortBy || 'createdAt', sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded text-white text-sm transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>
            <p className="text-sm text-slate-400">
              {filteredAndSortedTasks.length} of {tasks.length} tasks
            </p>
          </div>
        </div>

        {/* Results Info */}
        {hasActiveFilters && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              📍 {filteredAndSortedTasks.length} result{filteredAndSortedTasks.length !== 1 ? 's' : ''} found
              {' • '}
              <button
                onClick={clearAllFilters}
                className="underline hover:text-blue-100 transition-colors"
              >
                Clear all filters
              </button>
            </p>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Tasks</h2>
          <SimpleTable
            data={filteredAndSortedTasks}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No tasks match your filters"
          />
        </div>

        {/* State Display */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">URL State</h2>
          <div className="bg-slate-900 rounded p-4">
            <pre className="text-xs text-slate-300 overflow-auto max-h-48">
              {JSON.stringify(
                {
                  search,
                  status,
                  priority,
                  assignedTo,
                  sortBy,
                  sortOrder,
                },
                null,
                2
              )}
            </pre>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            💡 Try copying the URL from the address bar and opening it in a new tab. Your filters will be preserved!
          </p>
        </div>
      </div>
    </div>
  )
}
