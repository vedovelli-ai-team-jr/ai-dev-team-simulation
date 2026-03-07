import { AgentStatusBadge } from '../AgentStatusBadge/AgentStatusBadge'
import type { AgentAvailability } from '@/types/agent'

export interface AgentTableRowProps {
  agent: AgentAvailability
  onRowClick?: (agent: AgentAvailability) => void
}

function getPerformanceTier(successRate: number): 'high' | 'medium' | 'low' {
  if (successRate >= 80) return 'high'
  if (successRate >= 60) return 'medium'
  return 'low'
}

function getPerformanceColor(tier: 'high' | 'medium' | 'low') {
  switch (tier) {
    case 'high':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPerformanceLabel(tier: 'high' | 'medium' | 'low') {
  switch (tier) {
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    case 'low':
      return 'Low'
  }
}

export function AgentTableRow({
  agent,
  onRowClick,
}: AgentTableRowProps) {
  const performanceTier = getPerformanceTier(agent.metadata.errorRate)

  return (
    <tr
      onClick={() => onRowClick?.(agent)}
      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
        onRowClick ? 'cursor-pointer' : ''
      }`}
    >
      <td className="px-4 py-4 text-sm font-medium text-slate-900">
        {agent.name}
      </td>
      <td className="px-4 py-4">
        <AgentStatusBadge status={agent.status} />
      </td>
      <td className="px-4 py-4 text-sm text-slate-700">
        {agent.currentTaskId || '—'}
      </td>
      <td className="px-4 py-4 text-sm text-slate-700">
        {agent.metadata.tasksCompleted}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-slate-900">
        {agent.metadata.tasksInProgress}
      </td>
      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(performanceTier)}`}
        >
          {getPerformanceLabel(performanceTier)}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-slate-600">
        {new Date(agent.statusChangedAt).toLocaleTimeString()}
      </td>
    </tr>
  )
}
