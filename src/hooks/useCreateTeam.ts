import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface CreateTeamInput {
  name: string
  description: string
  memberCount: number
}

export interface Team extends CreateTeamInput {
  id: string
  createdAt: string
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTeamInput) => {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create team')
      }

      return response.json() as Promise<Team>
    },
    onSuccess: (newTeam) => {
      // Optimistic update: add the new team to the cache
      queryClient.setQueryData(['teams'], (oldData: Team[] = []) => [
        ...oldData,
        newTeam,
      ])
    },
  })
}
