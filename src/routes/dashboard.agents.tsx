import { createFileRoute } from '@tanstack/react-router'
import { AgentsDashboard } from '../pages/dashboard/AgentsDashboard'

export const Route = createFileRoute('/dashboard/agents')({
  component: () => <AgentsDashboard />,
})
