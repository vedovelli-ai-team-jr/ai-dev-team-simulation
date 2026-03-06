import { useAgents } from '../../hooks/useAgents'
import { Spinner } from '../Spinner'

interface AgentSelectorProps {
  selectedAgentIds: string[]
  onSelectionChange: (agentIds: string[]) => void
}

export function AgentSelector({ selectedAgentIds, onSelectionChange }: AgentSelectorProps) {
  const { data: agents = [], isPending } = useAgents()

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(agents.map((agent) => agent.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectAgent = (agentId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedAgentIds, agentId])
    } else {
      onSelectionChange(selectedAgentIds.filter((id) => id !== agentId))
    }
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  const isAllSelected = agents.length > 0 && selectedAgentIds.length === agents.length
  const isIndeterminate = selectedAgentIds.length > 0 && selectedAgentIds.length < agents.length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          id="select-all"
          checked={isAllSelected}
          ref={(input) => {
            if (input) {
              input.indeterminate = isIndeterminate
            }
          }}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4 rounded cursor-pointer"
        />
        <label htmlFor="select-all" className="font-medium cursor-pointer">
          Select all agents ({agents.length})
        </label>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50">
            <input
              type="checkbox"
              id={`agent-${agent.id}`}
              checked={selectedAgentIds.includes(agent.id)}
              onChange={(e) => handleSelectAgent(agent.id, e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor={`agent-${agent.id}`} className="flex-1 cursor-pointer">
              <div className="font-medium">{agent.name}</div>
              <div className="text-sm text-gray-600">
                {agent.role} • {agent.status}
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-600">
        {selectedAgentIds.length} of {agents.length} agents selected
      </div>
    </div>
  )
}
