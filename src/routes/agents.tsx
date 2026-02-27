import { createFileRoute } from '@tanstack/react-router'
import { AgentsList } from '../components/AgentsList'

export const Route = createFileRoute('/agents')({
  component: AgentsPage,
})

function AgentsPage() {
  return <AgentsList />
}
