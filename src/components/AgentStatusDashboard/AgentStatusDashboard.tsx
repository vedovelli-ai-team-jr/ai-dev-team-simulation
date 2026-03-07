import { useMemo, useState, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import type { AgentAvailability } from '@/types/agent'
import { useAgents } from '@/hooks/useAgents'
import { AgentStatusCard } from '../AgentStatusCard/AgentStatusCard'
import { AgentTableRow } from '../AgentTableRow/AgentTableRow'

export interface AgentStatusDashboardProps {
  onAgentClick?: (agent: AgentAvailability) => void
  pollIntervalMs?: number
}

export function AgentStatusDashboard({
  onAgentClick,
  pollIntervalMs = 30000,
}: AgentStatusDashboardProps) {
  const { data: agents = [], isLoading, error } = useAgents(
    {},
    { refetchInterval: pollIntervalMs }
  )

  const [sorting, setSorting] = useState<SortingState>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Calculate status summary
  const statusSummary = useMemo(() => {
    return {
      idle: agents.filter((a) => a.status === 'idle').length,
      active: agents.filter((a) => a.status === 'active').length,
      busy: agents.filter((a) => a.status === 'busy').length,
      offline: agents.filter((a) => a.status === 'offline').length,
    }
  }, [agents])

  // Filter agents based on status and search
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.capabilities.some((cap) =>
          cap.toLowerCase().includes(searchQuery.toLowerCase())
        )
      return matchesStatus && matchesSearch
    })
  }, [agents, statusFilter, searchQuery])

  // Define columns for the table
  const columns: ColumnDef<AgentAvailability>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Agent Name',
        size: 180,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
      },
      {
        accessorKey: 'currentTaskId',
        header: 'Current Task',
        size: 200,
      },
      {
        accessorKey: 'metadata.tasksCompleted',
        header: 'Completed',
        size: 100,
      },
      {
        accessorKey: 'metadata.tasksInProgress',
        header: 'In Progress',
        size: 100,
      },
      {
        accessorKey: 'metadata.errorRate',
        header: 'Performance',
        size: 120,
      },
      {
        accessorKey: 'statusChangedAt',
        header: 'Last Updated',
        size: 150,
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredAgents,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const { rows } = table.getRowModel()

  // Loading state
  if (isLoading && agents.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
          <p className="text-slate-600 font-medium">Loading agent status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agent Status</h2>
          <p className="text-sm text-slate-600 mt-1">
            Monitor agent availability and workload
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Auto-refreshing
          </div>
        )}
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AgentStatusCard
          status="idle"
          count={statusSummary.idle}
          icon={
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <AgentStatusCard
          status="active"
          count={statusSummary.active}
          icon={
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
        />
        <AgentStatusCard
          status="busy"
          count={statusSummary.busy}
          icon={
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <AgentStatusCard
          status="offline"
          count={statusSummary.offline}
          icon={
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-800 font-medium">
            Error loading agents: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      )}

      {/* Filter Controls */}
      <div className="space-y-4 sm:flex sm:gap-4 sm:space-y-0">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search agents by name or capability..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="idle">Idle</option>
            <option value="active">Working</option>
            <option value="busy">Waiting</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Agent Table */}
      {filteredAgents.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-12">
          <div className="text-center">
            <p className="text-slate-600 font-medium">No agents found</p>
            {searchQuery && (
              <p className="text-sm text-slate-500 mt-1">
                Try adjusting your search criteria
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 overflow-x-auto bg-white">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100 border-b border-slate-300">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSorted = header.column.getIsSorted()
                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-semibold text-slate-700 bg-slate-100 border-b border-slate-300 cursor-pointer hover:bg-slate-200 transition-colors"
                        style={{ width: `${header.getSize()}px` }}
                        onClick={header.column.getToggleSortingHandler()}
                        role="columnheader"
                        aria-sort={
                          isSorted
                            ? isSorted === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {isSorted && (
                            <span className="text-xs">
                              {isSorted === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row) => (
                <AgentTableRow
                  key={row.id}
                  agent={row.original}
                  onRowClick={onAgentClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Stats */}
      <div className="text-xs text-slate-600 flex justify-between items-center">
        <span>
          Showing {rows.length} agent{rows.length !== 1 ? 's' : ''}
        </span>
        <span>Last update: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
