import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Task } from '../types/domain'

interface UseTasksFilter {
  status?: Task['status']
}

export function useTasks(filter?: UseTasksFilter) {
  return useQuery<Task[]>({
    queryKey: ['tasks', filter?.status || 'all'],
    queryFn: async () => {
      const url = new URL('/api/tasks', window.location.origin)
      if (filter?.status) {
        url.searchParams.set('status', filter.status)
      }
      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      return response.json()
    },
    staleTime: 5000,
    refetchInterval: 15000,
  })
}

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch task')
      }
      return response.json()
    },
    staleTime: 5000,
    refetchInterval: 15000,
    enabled: !!id,
  })
}

export function useInvalidateTasks() {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    invalidateByStatus: (status: Task['status']) =>
      queryClient.invalidateQueries({ queryKey: ['tasks', status] }),
  }
}
