import { createColumnHelper } from '@tanstack/react-table'
import type { Task } from '../../mocks/handlers'

const columnHelper = createColumnHelper<Task>()

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100 text-blue-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'high':
      return 'bg-red-100 text-red-800'
  }
}

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    case 'done':
      return 'bg-green-100 text-green-800'
  }
}

export const columns = [
  columnHelper.accessor('name', {
    header: 'Task Name',
    cell: (info) => info.getValue(),
    size: 300,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue()
      return (
        <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(status)}`}>
          {status.replace('-', ' ')}
        </span>
      )
    },
    size: 150,
  }),
  columnHelper.accessor('priority', {
    header: 'Priority',
    cell: (info) => {
      const priority = info.getValue()
      return (
        <span className={`px-3 py-1 rounded text-sm font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      )
    },
    size: 120,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created Date',
    cell: (info) => {
      const date = new Date(info.getValue())
      return date.toLocaleDateString()
    },
    size: 150,
  }),
]
