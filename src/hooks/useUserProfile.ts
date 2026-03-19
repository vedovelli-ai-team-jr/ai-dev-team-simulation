import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UserProfileInput, UserProfileResponse } from '../types/forms/user'
import { useMutationWithRetry } from './useMutationWithRetry'

/**
 * Configuration options for useUserProfile hook
 */
export interface UseUserProfileOptions {
  /** Enable automatic refetch on window focus (default: true) */
  refetchOnWindowFocus?: boolean
}

/**
 * Fetch and manage user's profile
 *
 * Features:
 * - Caches profile with 5min stale time
 * - Update mutation with optimistic updates
 * - Error handling with 409 conflict detection
 * - Exponential backoff retry logic
 * - Automatic refetch on window focus
 */
export function useUserProfile(options: UseUserProfileOptions = {}) {
  const {
    refetchOnWindowFocus = true,
  } = options

  const queryClient = useQueryClient()

  // Query to fetch profile
  const query = useQuery<UserProfileResponse, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile', {
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`)
      }

      return response.json() as Promise<UserProfileResponse>
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Mutation for updating profile
  const updateMutation = useMutationWithRetry<UserProfileResponse, Partial<UserProfileInput>>({
    mutationFn: async (updates) => {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as any
        const error = new Error(
          errorData.error || `Failed to update user profile: ${response.statusText}`
        )
        ;(error as any).status = response.status
        ;(error as any).code = errorData.code
        throw error
      }

      return response.json() as Promise<UserProfileResponse>
    },
    onMutate: async (updates) => {
      // Cancel any pending requests
      await queryClient.cancelQueries({ queryKey: ['userProfile'] })

      // Snapshot previous data
      const previousData = queryClient.getQueryData<UserProfileResponse>(['userProfile'])

      // Optimistically update
      if (previousData) {
        const optimisticData: UserProfileResponse = {
          ...previousData,
          name: updates.name ?? previousData.name,
          email: updates.email ?? previousData.email,
          bio: updates.bio ?? previousData.bio,
          avatarUrl: updates.avatarUrl ?? previousData.avatarUrl,
          role: updates.role ?? previousData.role,
          updatedAt: new Date().toISOString(),
        }
        queryClient.setQueryData(['userProfile'], optimisticData)
      }

      return { previousData }
    },
    onError: (_error, _variables, context) => {
      // Rollback to previous data on error
      if (context?.previousData) {
        queryClient.setQueryData(['userProfile'], context.previousData)
      }
    },
    onSuccess: (data) => {
      // Update cache with server response
      queryClient.setQueryData(['userProfile'], data)
    },
  })

  return {
    // Query data and status
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Mutation functions and status
    updateProfile: updateMutation.mutate,
    updateProfileAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    updateSuccess: updateMutation.isSuccess,

    // Utilities
    refetch: query.refetch,
    reset: () => {
      queryClient.setQueryData(['userProfile'], undefined)
    },
  }
}

export type UseUserProfileReturn = ReturnType<typeof useUserProfile>
