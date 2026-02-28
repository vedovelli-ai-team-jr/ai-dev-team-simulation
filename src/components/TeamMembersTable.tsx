import { useState, useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'

interface TeamMember {
  id: string
  name: string
  role: string
  status: 'active' | 'inactive' | 'away'
  tasksCompleted: number
  performanceScore: number
}

const mockData: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    role: 'Frontend Developer',
    status: 'active',
    tasksCompleted: 24,
    performanceScore: 4.8,
  },
  {
    id: '2',
    name: 'Bob Smith',
    role: 'Backend Developer',
    status: 'active',
    tasksCompleted: 19,
    performanceScore: 4.5,
  },
  {
    id: '3',
    name: 'Carol Davis',
    role: 'Frontend Developer',
    status: 'away',
    tasksCompleted: 15,
    performanceScore: 4.2,
  },
  {
    id: '4',
    name: 'David Wilson',
    role: 'DevOps Engineer',
    status: 'active',
    tasksCompleted: 12,
    performanceScore: 4.6,
  },
  {
    id: '5',
    name: 'Emma Brown',
    role: 'QA Engineer',
    status: 'inactive',
    tasksCompleted: 8,
    performanceScore: 4.0,
  },
  {
    id: '6',
    name: 'Frank Miller',
    role: 'Backend Developer',
    status: 'active',
    tasksCompleted: 21,
    performanceScore: 4.7,
  },
  {
    id: '7',
    name: 'Grace Lee',
    role: 'Frontend Developer',
    status: 'active',
    tasksCompleted: 27,
    performanceScore: 4.9,
  },
  {
    id: '8',
    name: 'Henry Taylor',
    role: 'QA Engineer',
    status: 'away',
    tasksCompleted: 10,
    performanceScore: 4.1,
  },
]

const columnHelper = createColumnHelper<TeamMember>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue()
      const statusStyles: Record<string, string> = {
        active: 'bg-green-100 text-green-800',
        away: 'bg-yellow-100 text-yellow-800',
        inactive: 'bg-gray-100 text-gray-800',
      }
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
  }),
  columnHelper.accessor('tasksCompleted', {
    header: 'Tasks Completed',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('performanceScore', {
    header: 'Performance Score',
    cell: (info) => {
      const score = info.getValue()
      return `${score.toFixed(1)}/5.0`
    },
  }),
]

export function TeamMembersTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const filteredData = useMemo(() => {
    return mockData.filter((member) => {
      if (roleFilter && member.role !== roleFilter) return false
      if (statusFilter && member.status !== statusFilter) return false
      return true
    })
  }, [roleFilter, statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const uniqueRoles = Array.from(new Set(mockData.map((m) => m.role)))
  const uniqueStatuses = Array.from(new Set(mockData.map((m) => m.status)))

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Roles</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="text-gray-400">
                        {header.column.getIsSorted() === 'asc' && ' ↑'}
                        {header.column.getIsSorted() === 'desc' && ' ↓'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No team members found matching the selected filters.
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-600">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} team members
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: table.getPageCount() }).map((_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  table.getState().pagination.pageIndex === i
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
