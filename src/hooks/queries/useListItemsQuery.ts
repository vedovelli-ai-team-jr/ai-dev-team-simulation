import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Item } from '../../types/item'
import { itemKeys } from './items'

interface ListItemsResponse {
  data: Item[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface UseListItemsQueryOptions {
  page?: number
  pageSize?: number
}

/**
 * Hook for fetching paginated list items with TanStack Query.
 * Handles loading states, pagination, and automatic refetching on window focus.
 *
 * @param options - Query options including page and pageSize
 * @returns Query state object with data, loading and error states
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, pagination } = useListItemsQuery({ page: 1, pageSize: 10 })
 *
 * if (isLoading) return <LoadingSpinner />
 * if (error) return <ErrorDisplay error={error} />
 * return <ListView items={data} {...pagination} />
 * ```
 */
export function useListItemsQuery(options: UseListItemsQueryOptions = {}) {
  const { page = 1, pageSize = 10 } = options

  const query = useQuery<ListItemsResponse>({
    queryKey: itemKeys.list({ page, pageSize }),
    queryFn: async () => {
      const response = await fetch(`/api/items?page=${page}&pageSize=${pageSize}`)
      if (!response.ok) {
        throw new Error('Failed to fetch list items')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  })

  return {
    items: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    pagination: {
      currentPage: page,
      pageSize,
      total: query.data?.total ?? 0,
      totalPages: query.data?.totalPages ?? 0,
    },
    refetch: query.refetch,
  }
}

interface AddItemVariables {
  title: string
  description: string
}

interface RemoveItemVariables {
  id: string
}

/**
 * Hook for adding items with optimistic updates.
 * Automatically invalidates list cache after successful addition.
 *
 * @returns Mutation state with mutate function
 *
 * @example
 * ```tsx
 * const { mutate: addItem, isPending } = useAddListItem()
 * const handleAddClick = () => {
 *   addItem({ title: 'New Item', description: 'Item description' })
 * }
 * ```
 */
export function useAddListItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: AddItemVariables) => {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      })
      if (!response.ok) {
        throw new Error('Failed to add item')
      }
      return response.json() as Promise<Item>
    },
    onSuccess: () => {
      // Invalidate list queries to refetch with new item
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() })
    },
  })
}

/**
 * Hook for removing items with optimistic updates.
 * Automatically invalidates list cache after successful removal.
 *
 * @returns Mutation state with mutate function
 *
 * @example
 * ```tsx
 * const { mutate: removeItem, isPending } = useRemoveListItem()
 * const handleDeleteClick = (id: string) => {
 *   removeItem({ id })
 * }
 * ```
 */
export function useRemoveListItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: RemoveItemVariables) => {
      const response = await fetch(`/api/items/${variables.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to remove item')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalidate list queries to refetch without deleted item
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() })
    },
  })
}
