import { useQuery } from '@tanstack/react-query'
import type { Agent } from '../types/domain'

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents')
      if (!response.ok) {
        throw new Error('Failed to fetch agents')
      }
      return response.json()
    },
    staleTime: 5000,
    refetchInterval: 15000,
  })
}

export function useAgent(id: string) {
  return useQuery<Agent>({
    queryKey: ['agents', id],
    queryFn: async () => {
      const response = await fetch(`/api/agents/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch agent')
      }
      return response.json()
    },
    staleTime: 5000,
    refetchInterval: 15000,
    enabled: !!id,
  })
}
