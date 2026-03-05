import { useUsersQuery } from './queries/useUserQuery'

/**
 * Hook for fetching all users.
 * This is a convenience wrapper around useUsersQuery for backward compatibility.
 *
 * @deprecated Use useUsersQuery from './queries/useUserQuery' instead for better caching and invalidation
 * @returns Array of users with loading and error states
 */
export function useUsers() {
  return useUsersQuery()
}
