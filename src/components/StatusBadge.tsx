import type { AgentStatus } from '../types/agent'

interface StatusBadgeProps {
  status: AgentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'idle':
        return 'bg-gray-600 text-gray-100'
      case 'working':
        return 'bg-blue-600 text-blue-100'
      case 'blocked':
        return 'bg-red-600 text-red-100'
      case 'completed':
        return 'bg-green-600 text-green-100'
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
    >
      <span className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`} />
      {status}
    </span>
  )
}

function getStatusDotColor(status: AgentStatus): string {
  switch (status) {
    case 'idle':
      return 'bg-gray-400'
    case 'working':
      return 'bg-blue-300'
    case 'blocked':
      return 'bg-red-300'
    case 'completed':
      return 'bg-green-300'
  }
}
