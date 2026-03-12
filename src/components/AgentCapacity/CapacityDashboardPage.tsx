import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useMemo, useState } from 'react'
import type { AgentCapacityMetrics } from '../../types/capacity'
import { AgentCapacityCard } from './AgentCapacityCard'
import { CapacityAdjustmentForm } from './CapacityAdjustmentForm'
import { CapacityWarningBanner } from './CapacityWarningBanner'

interface CapacityDashboardPageProps {
  agents: AgentCapacityMetrics[]
  isLoading?: boolean
  onAdjustCapacity?: (agentId: string, newCapacity: number) => Promise<void>
}

type FilterLevel = 'all' | 'warning' | 'critical'

export function CapacityDashboardPage({
  agents,
  isLoading = false,
  onAdjustCapacity,
}: CapacityDashboardPageProps) {
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
  const [adjustingAgent, setAdjustingAgent] = useState<string | null>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  // Filter agents based on search and warning level
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.agentId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilter =
        filterLevel === 'all' ||
        (filterLevel === 'warning' && (agent.warningLevel === 'warning' || agent.warningLevel === 'critical')) ||
        (filterLevel === 'critical' && agent.warningLevel === 'critical')

      return matchesSearch && matchesFilter
    })
  }, [agents, searchQuery, filterLevel])

  // Calculate summary metrics
  const summary = useMemo(() => {
    const totalAgents = agents.length
    const criticalCount = agents.filter((a) => a.warningLevel === 'critical').length
    const warningCount = agents.filter((a) => a.warningLevel === 'warning').length
    const atRiskCount = criticalCount + warningCount
    const avgUtilization = agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.utilizationPct, 0) / agents.length) : 0

    return { totalAgents, atRiskCount, avgUtilization, criticalCount }
  }, [agents])

  // Get critical agents for banner
  const criticalAgents = useMemo(() => {
    return agents.filter((a) => a.warningLevel === 'critical')
  }, [agents])

  // Virtual scroll setup
  const virtualizer = useVirtualizer({
    count: filteredAgents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    measureElement: typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1 ? (element) => element?.getBoundingClientRect().height : undefined,
    overscan: 10,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-8">
        <CapacityWarningBanner criticalAgents={criticalAgents} />

        <div>
          <h1 className="text-3xl font-bold text-slate-100">Agent Capacity Dashboard</h1>
          <p className="text-slate-400 mt-2">Manage and monitor agent workload capacity</p>
        </div>

        {/* Summary Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-700/30 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Filter Skeleton */}
        <div className="h-12 bg-slate-700/30 rounded-lg animate-pulse" />

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-700/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <CapacityWarningBanner criticalAgents={criticalAgents} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Agent Capacity Dashboard</h1>
        <p className="text-slate-400 mt-2">Manage and monitor agent workload capacity</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-medium">Total Agents</p>
          <p className="text-3xl font-bold text-slate-100 mt-2">{summary.totalAgents}</p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-medium">At Risk</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{summary.atRiskCount}</p>
          <p className="text-xs text-slate-500 mt-1">
            {summary.criticalCount} critical
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-medium">Avg Utilization</p>
          <p className="text-3xl font-bold text-slate-100 mt-2">{summary.avgUtilization}%</p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm font-medium">Capacity Level</p>
          <p className={`text-lg font-bold mt-2 ${summary.avgUtilization > 95 ? 'text-red-400' : summary.avgUtilization > 80 ? 'text-yellow-400' : 'text-green-400'}`}>
            {summary.avgUtilization > 95 ? 'Critical' : summary.avgUtilization > 80 ? 'Warning' : 'Healthy'}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search agents by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-800/40 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterLevel === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/40 border border-slate-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterLevel('warning')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterLevel === 'warning' ? 'bg-yellow-600 text-white' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/40 border border-slate-700'}`}
          >
            At Risk
          </button>
          <button
            onClick={() => setFilterLevel('critical')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterLevel === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/40 border border-slate-700'}`}
          >
            Critical
          </button>
        </div>
      </div>

      {/* Main Content Area - Virtualized */}
      {adjustingAgent ? (
        <div className="max-w-md">
          <CapacityAdjustmentForm
            agent={agents.find((a) => a.agentId === adjustingAgent)!}
            onSubmit={async (agentId, newCapacity) => {
              await onAdjustCapacity?.(agentId, newCapacity)
              setAdjustingAgent(null)
            }}
            onCancel={() => setAdjustingAgent(null)}
          />
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">
            {searchQuery || filterLevel !== 'all' ? 'No agents match your filters' : 'No agents available'}
          </p>
        </div>
      ) : (
        <div
          ref={parentRef}
          style={{
            height: '600px',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              height: `${totalSize}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualItem) => {
              const agent = filteredAgents[virtualItem.index]
              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    <AgentCapacityCard
                      agent={agent}
                      isExpanded={expandedAgent === agent.agentId}
                      onExpand={(id) => setExpandedAgent(expandedAgent === id ? null : id)}
                      onAdjustClick={(id) => setAdjustingAgent(id)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
