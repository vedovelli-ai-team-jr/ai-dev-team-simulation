import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useMemo } from 'react'
import type { Agent, AgentStatus } from '../types/agent'
import { useAgents } from '../hooks/useAgents'

const columnHelper = createColumnHelper<Agent>()

const statusColors: Record<AgentStatus, string> = {
  thinking: 'agent-status-thinking bg-blue-500',
  idle: 'agent-status-idle bg-gray-400',
  error: 'agent-status-error bg-red-500',
}

export function AgentsList() {
  const { data: agents = [], isLoading, isError, error } = useAgents()
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => <span className="text-sm text-gray-300">{info.getValue()}</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue()
          const colorClass = statusColors[status]
          return (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
              <span className="text-sm capitalize">{status}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor('currentTask', {
        header: 'Current Task',
        cell: (info) => {
          const task = info.getValue()
          return (
            <span className="text-sm text-gray-400">
              {task || <span className="italic text-gray-500">-</span>}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: () => (
          <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors">
            View
          </button>
        ),
      }),
    ],
    []
  )

  const table = useReactTable({
    data: agents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    overscan: 10,
  })

  const virtualRows = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-400">Loading agents...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-400">Error: {error?.message || 'Failed to load agents'}</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Agents</h1>
        <p className="text-sm text-gray-400 mt-1">{agents.length} agents active</p>
      </div>

      <div
        ref={tableContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          height: 'calc(100% - 72px)',
        }}
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-slate-800 border-b border-gray-700 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-200 uppercase tracking-wide"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <tr
                  key={row.id}
                  className="border-b border-gray-700 hover:bg-slate-700/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
