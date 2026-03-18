import { useMemo, useState, useCallback } from 'react'
import { groupNotifications } from '../utils/groupNotifications'
import { useNotifications, type UseNotificationsOptions } from './useNotifications'
import type { NotificationGroup } from '../utils/groupNotifications'

/**
 * State management for expanded groups
 */
interface ExpandedGroupsState {
  [groupId: string]: boolean
}

/**
 * Return type for useGroupedNotifications hook
 */
export interface UseGroupedNotificationsReturn {
  // Grouped notification data
  groups: NotificationGroup[]

  // Group interaction
  toggleGroupExpanded: (groupId: string) => void
  expandAllGroups: () => void
  collapseAllGroups: () => void

  // Mark as read actions
  markGroupAsRead: (groupId: string) => Promise<void>
  markAllGroupsAsRead: () => Promise<void>

  // Original hook state for compatibility
  unreadCount: number
  isLoading: boolean
  error: Error | null

  // Dismiss actions from underlying hook
  dismissNotification: (id: string) => void
}

/**
 * Hook that provides grouped notifications on top of the useNotifications hook.
 *
 * Automatically collapses consecutive notifications from the same source,
 * with support for expanding/collapsing groups and batch mark-as-read.
 *
 * Features:
 * - Pure data transformation (groups consecutive notifications by source)
 * - Expand/collapse state management per group
 * - Mark-group-as-read delegates to underlying useNotifications mutations
 * - Single-item groups are always expanded for better UX
 * - Fully typed with TypeScript generics
 *
 * @param options - Options to pass to the underlying useNotifications hook
 * @returns Grouped notifications with interaction methods
 */
export function useGroupedNotifications(options: UseNotificationsOptions = {}): UseGroupedNotificationsReturn {
  const notifications = useNotifications(options)
  const [expandedGroups, setExpandedGroups] = useState<ExpandedGroupsState>({})

  // Compute groups from flat notifications
  const groups = useMemo(() => {
    const grouped = groupNotifications(notifications.notifications)

    // Apply expanded state from local state
    // Single-item groups are always expanded
    return grouped.map((group) => ({
      ...group,
      isExpanded: group.count === 1 ? true : expandedGroups[group.id] ?? false,
    }))
  }, [notifications.notifications, expandedGroups])

  /**
   * Toggle expand/collapse state for a specific group
   */
  const toggleGroupExpanded = useCallback((groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }, [])

  /**
   * Expand all groups
   */
  const expandAllGroups = useCallback(() => {
    const allExpanded: ExpandedGroupsState = {}
    groups.forEach((group) => {
      allExpanded[group.id] = true
    })
    setExpandedGroups(allExpanded)
  }, [groups])

  /**
   * Collapse all groups (except single-item ones)
   */
  const collapseAllGroups = useCallback(() => {
    const allCollapsed: ExpandedGroupsState = {}
    groups.forEach((group) => {
      if (group.count > 1) {
        allCollapsed[group.id] = false
      }
    })
    setExpandedGroups(allCollapsed)
  }, [groups])

  /**
   * Mark all notifications in a group as read
   */
  const markGroupAsRead = useCallback(
    async (groupId: string) => {
      const group = groups.find((g) => g.id === groupId)
      if (!group) return

      const unreadIds = group.notifications.filter((n) => !n.read).map((n) => n.id)
      if (unreadIds.length === 0) return

      if (unreadIds.length === 1) {
        notifications.markAsRead(unreadIds[0])
      } else {
        await notifications.markMultipleAsRead(unreadIds)
      }
    },
    [groups, notifications]
  )

  /**
   * Mark all notifications in all groups as read
   */
  const markAllGroupsAsRead = useCallback(async () => {
    const allUnreadIds = groups
      .flatMap((group) => group.notifications.filter((n) => !n.read).map((n) => n.id))

    if (allUnreadIds.length === 0) return

    if (allUnreadIds.length === 1) {
      notifications.markAsRead(allUnreadIds[0])
    } else {
      await notifications.markMultipleAsRead(allUnreadIds)
    }
  }, [groups, notifications])

  return {
    // Grouped data
    groups,

    // Group interactions
    toggleGroupExpanded,
    expandAllGroups,
    collapseAllGroups,

    // Mark as read
    markGroupAsRead,
    markAllGroupsAsRead,

    // State from underlying hook
    unreadCount: notifications.unreadCount,
    isLoading: notifications.isLoading,
    error: notifications.error,

    // Actions
    dismissNotification: notifications.dismissNotification,
  }
}

export type UseGroupedNotificationsReturn = ReturnType<typeof useGroupedNotifications>
