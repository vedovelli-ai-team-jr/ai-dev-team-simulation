import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { AgentCapacityMetrics } from '../../types/capacity'

interface CapacityWarningBannerProps {
  criticalAgents: AgentCapacityMetrics[]
}

export function CapacityWarningBanner({ criticalAgents }: CapacityWarningBannerProps) {
  const navigate = useNavigate()
  const [isDismissed, setIsDismissed] = useState(false)

  if (criticalAgents.length === 0 || isDismissed) {
    return null
  }

  const handleViewTasks = (agentId: string) => {
    navigate({
      to: '/dashboard/tasks',
      search: { assignee: agentId },
    })
  }

  return (
    <div className="sticky top-0 z-40 bg-red-50 border-b-2 border-red-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🚨</span>
              <h3 className="font-bold text-red-900">
                {criticalAgents.length} agent{criticalAgents.length !== 1 ? 's' : ''} over capacity
              </h3>
            </div>

            <div className="space-y-2">
              {criticalAgents.slice(0, 3).map((agent) => (
                <div key={agent.agentId} className="flex items-center justify-between bg-white rounded px-3 py-2 border border-red-200">
                  <div>
                    <p className="font-medium text-red-900">{agent.name}</p>
                    <p className="text-sm text-red-700">
                      {agent.tasksAssigned} / {agent.maxCapacity} tasks ({agent.utilizationPct.toFixed(0)}%)
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewTasks(agent.agentId)}
                    className="text-sm font-medium text-red-600 hover:text-red-900 underline flex-shrink-0"
                  >
                    View Tasks →
                  </button>
                </div>
              ))}
            </div>

            {criticalAgents.length > 3 && (
              <p className="text-sm text-red-700 mt-2 font-medium">
                +{criticalAgents.length - 3} more agent{criticalAgents.length - 3 !== 1 ? 's' : ''} over capacity
              </p>
            )}
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-red-600 hover:text-red-900 text-xl leading-none flex-shrink-0 pt-1"
            aria-label="Dismiss warning"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
