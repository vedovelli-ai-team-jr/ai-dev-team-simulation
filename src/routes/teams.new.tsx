import { createFileRoute } from '@tanstack/react-router'
import { TeamCreateForm } from '../components/TeamCreateForm'

export const Route = createFileRoute('/teams/new')({
  component: TeamCreateForm,
})
