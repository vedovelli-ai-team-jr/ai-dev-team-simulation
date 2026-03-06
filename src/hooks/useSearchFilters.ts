import { useCallback, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

/**
 * Hook for managing search filters and sorting with URL state persistence.
 * Provides URL-synced search, status, priority, assignee filters and sorting.
 *
 * @example
 * ```tsx
 * const {
 *   search,
 *   status,
 *   priority,
 *   assignedTo,
 *   sortBy,
 *   sortOrder,
 *   setSearch,
 *   setStatus,
 *   setPriority,
 *   setAssignedTo,
 *   setSorting,
 *   clearAllFilters,
 *   hasActiveFilters,
 * } = useSearchFilters()
 *
 * // Update individual filter
 * setStatus('done')
 * // Sort by priority descending
 * setSorting('priority', 'desc')
 * // Clear everything
 * clearAllFilters()
 * ```
 */
export function useSearchFilters() {
  const navigate = useNavigate({ from: '/' })
  const searchParams = useSearch() as Record<string, unknown>

  // Parse search and filter params
  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  const status = typeof searchParams.status === 'string' ? searchParams.status : null
  const priority = typeof searchParams.priority === 'string' ? searchParams.priority : null
  const assignedTo = typeof searchParams.assignedTo === 'string' ? searchParams.assignedTo : null
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : null
  const sortOrder =
    typeof searchParams.sortOrder === 'string' ? searchParams.sortOrder : 'asc'

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!search || !!status || !!priority || !!assignedTo || !!sortBy
  }, [search, status, priority, assignedTo, sortBy])

  // Set search filter
  const setSearch = useCallback(
    (value: string) => {
      navigate({
        search: {
          ...searchParams,
          search: value || null,
        },
      })
    },
    [navigate, searchParams]
  )

  // Set status filter
  const setStatus = useCallback(
    (value: string | null) => {
      navigate({
        search: {
          ...searchParams,
          status: value,
        },
      })
    },
    [navigate, searchParams]
  )

  // Set priority filter
  const setPriority = useCallback(
    (value: string | null) => {
      navigate({
        search: {
          ...searchParams,
          priority: value,
        },
      })
    },
    [navigate, searchParams]
  )

  // Set assigned to filter
  const setAssignedTo = useCallback(
    (value: string | null) => {
      navigate({
        search: {
          ...searchParams,
          assignedTo: value,
        },
      })
    },
    [navigate, searchParams]
  )

  // Set sorting
  const setSorting = useCallback(
    (column: string, order: 'asc' | 'desc') => {
      navigate({
        search: {
          ...searchParams,
          sortBy: column,
          sortOrder: order,
        },
      })
    },
    [navigate, searchParams]
  )

  // Clear all filters and sorting
  const clearAllFilters = useCallback(() => {
    navigate({
      search: {},
    })
  }, [navigate])

  return {
    // Filter values
    search,
    status,
    priority,
    assignedTo,
    sortBy,
    sortOrder,
    // Filter setters
    setSearch,
    setStatus,
    setPriority,
    setAssignedTo,
    setSorting,
    clearAllFilters,
    hasActiveFilters,
  }
}
