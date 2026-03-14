import { useMemo, useState, useCallback } from 'react'
import type { SprintTask } from '../types/sprint'
import { useTable } from '../hooks/useTable'
import { TaskDependencyBadge } from './TaskDependencyBadge'
import { useTasks } from '../hooks/useTasks'
import { TaskStatusBadge, TaskPriorityIndicator } from './StatusIndicators'

export interface SprintTaskTableProps {
  tasks: SprintTask[]
  isLoading?: boolean
  enableBulkSelect?: boolean
  selectedTaskIds?: Set<string>
  onSelectionChange?: (selectedIds: Set<string>) => void
}

export function SprintTaskTable({
  tasks,
  isLoading,
  enableBulkSelect = false,
  selectedTaskIds = new Set(),
  onSelectionChange,
}: SprintTaskTableProps) {
  const { data: allTasks = [] } = useTasks()
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    title: true,
    status: true,
    assignee: true,
    priority: true,
    blockedBy: false,
  })

  const { sortedAndFilteredData, handleSort, handleFilter, filterValue, sortKey, sortOrder } =
    useTable({
      data: tasks,
      initialSortKey: 'title',
    })

  // Create a map of task IDs to titles for blocked by display
  const taskTitleMap = useMemo(() => {
    const map: Record<string, string> = {}
    allTasks.forEach((task) => {
      map[task.id] = task.title
    })
    return map
  }, [allTasks])

  const handleTaskToggle = useCallback(
    (taskId: string) => {
      const newSelection = new Set(selectedTaskIds)
      if (newSelection.has(taskId)) {
        newSelection.delete(taskId)
      } else {
        newSelection.add(taskId)
      }
      onSelectionChange?.(newSelection)
    },
    [selectedTaskIds, onSelectionChange]
  )

  const handleSelectAll = useCallback(() => {
    if (selectedTaskIds.size === sortedAndFilteredData.length && selectedTaskIds.size > 0) {
      // Deselect all if all currently visible tasks are selected
      onSelectionChange?.(new Set())
    } else {
      // Select all visible (filtered) tasks
      const allTaskIds = new Set(sortedAndFilteredData.map((t) => t.id))
      onSelectionChange?.(allTaskIds)
    }
  }, [selectedTaskIds, sortedAndFilteredData, onSelectionChange])

  const columns = useMemo(() => {
    const baseColumns = [
      { key: 'title' as const, label: 'Title' },
      { key: 'status' as const, label: 'Status' },
      { key: 'assignee' as const, label: 'Assignee' },
      { key: 'priority' as const, label: 'Priority' },
      { key: 'blockedBy' as const, label: 'Blocked By' },
    ]
    return baseColumns.filter((col) => visibleColumns[col.key] !== false)
  }, [visibleColumns])

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 h-12 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No tasks in this sprint</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Input and Column Toggle */}
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Filter tasks..."
          value={filterValue}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 flex-1"
        />
        <button
          onClick={() =>
            setVisibleColumns((prev) => ({
              ...prev,
              blockedBy: !prev.blockedBy,
            }))
          }
          className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded hover:border-slate-600 transition-colors"
          aria-label="Toggle Blocked By column"
        >
          {visibleColumns.blockedBy ? '✓ Blocked By' : 'Blocked By'}
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              {enableBulkSelect && (
                <th key="select" className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    aria-label="Select all tasks"
                    checked={selectedTaskIds.size > 0 && selectedTaskIds.size === sortedAndFilteredData.length}
                    indeterminate={selectedTaskIds.size > 0 && selectedTaskIds.size < sortedAndFilteredData.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort(column.key)}
                    className="text-slate-300 hover:text-white font-medium flex items-center gap-1 group"
                  >
                    {column.label}
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {sortKey === column.key && (sortOrder === 'asc' ? '↑' : '↓')}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedAndFilteredData.map((task) => (
              <tr
                key={task.id}
                className={`hover:bg-slate-800/50 transition-colors ${
                  selectedTaskIds.has(task.id) ? 'bg-slate-800/30' : ''
                }`}
              >
                {enableBulkSelect && (
                  <td className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      aria-label={`Select task ${task.title}`}
                      checked={selectedTaskIds.has(task.id)}
                      onChange={() => handleTaskToggle(task.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <span className="text-white">{task.title}</span>
                </td>
                <td className="px-4 py-3">
                  <TaskStatusBadge status={task.status} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-300">{task.assignee}</span>
                </td>
                <td className="px-4 py-3">
                  <TaskPriorityIndicator priority={task.priority} showIcon={true} size="sm" />
                </td>
                {visibleColumns.blockedBy && (
                  <td className="px-4 py-3">
                    {task.dependsOn && task.dependsOn.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {task.dependsOn.map((blockerTaskId) => (
                          <TaskDependencyBadge
                            key={blockerTaskId}
                            taskId={blockerTaskId}
                            taskTitle={taskTitleMap[blockerTaskId] || 'Unknown Task'}
                            isBlocked={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-400">
        Showing {sortedAndFilteredData.length} of {tasks.length} tasks
      </div>
    </div>
  )
}
