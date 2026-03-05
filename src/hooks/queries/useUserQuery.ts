import { useQuery } from '@tanstack/react-query'
import type { User } from '../../types/user'
import { userKeys } from './users'
import { useQueryCache } from './useQueryCache'
import { useCallback } from 'react'

/**
 * Hook for fetching a single user by ID with TanStack Query.
 * Provides loading and error states, automatic caching, and refetch capabilities.
 *
 * @param userId - The ID of the user to fetch
 * @returns User data with loading, error, and refetch states
 *
 * @example
 * ```tsx
 * const { data: user, isLoading, error, refetch } = useUserQuery(userId)
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error: {error.message}</div>
 * return <div>{user?.name}</div>
 * ```
 */
export function useUserQuery(userId: string | undefined) {
  const query = useQuery<User>({
    queryKey: userKeys.detail(userId ?? ''),
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch user ${userId}`)
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2,
    enabled: !!userId, // Only run query if userId is provided
  })

  const { invalidateExact } = useQueryCache()

  const invalidateUser = useCallback(() => {
    if (userId) {
      invalidateExact(userKeys.detail(userId))
    }
  }, [userId, invalidateExact])

  return {
    ...query,
    invalidate: invalidateUser,
  }
}

/**
 * Hook for fetching all users with TanStack Query.
 * Provides loading and error states, automatic caching, and refetch capabilities.
 *
 * @returns Array of users with loading and error states
 *
 * @example
 * ```tsx
 * const { data: users, isLoading, error } = useUsersQuery()
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error: {error.message}</div>
 * return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>
 * ```
 */
export function useUsersQuery() {
  const query = useQuery<User[]>({
    queryKey: userKeys.list(),
    queryFn: async () => {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2,
  })

  const { invalidateAndRefetch } = useQueryCache()

  const invalidateUsers = useCallback(() => {
    invalidateAndRefetch(userKeys.lists())
  }, [invalidateAndRefetch])

  return {
    ...query,
    invalidate: invalidateUsers,
  }
}
