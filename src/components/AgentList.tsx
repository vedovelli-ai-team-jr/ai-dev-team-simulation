import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import type { Agent } from '../types/agent'
import { StatusBadge } from './StatusBadge'

interface AgentListProps {
  agents: Agent[]
  isLoading: boolean
}

export function AgentList({ agents, isLoading }: AgentListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: agents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  })

  if (isLoading && agents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-400">Loading agents...</p>
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-400">No agents available</p>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-screen overflow-y-auto border border-slate-700 rounded-lg bg-slate-800"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const agent = agents[virtualItem.index]

          return (
            <div
              key={agent.id}
              data-index={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <AgentRow agent={agent} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AgentRow({ agent }: { agent: Agent }) {
  return (
    <div className="border-b border-slate-700 px-6 py-4 hover:bg-slate-700/50 transition-colors">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        <div>
          <p className="font-semibold text-white">{agent.name}</p>
          <p className="text-xs text-slate-400">{agent.id}</p>
        </div>

        <div className="hidden sm:block">
          <span className="inline-block px-3 py-1 bg-slate-700 rounded text-sm text-slate-200">
            {agent.role}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={agent.status} />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm text-slate-300 truncate">{agent.currentTask}</p>
        </div>

        <div className="hidden lg:block">
          <p className="text-xs text-slate-400 truncate">{agent.output}</p>
        </div>
      </div>
    </div>
  )
}
