import type { Notification } from '../types/notification'

/**
 * Represents a group of consecutive notifications from the same source
 */
export interface NotificationGroup {
  id: string
  /** Unique identifier for the source (agentId, sprintId, taskId, etc.) */
  sourceId: string
  /** Display name of the source */
  sourceName: string
  /** Type of the source (agent, sprint, task, deadline, etc.) */
  sourceType: string
  /** Number of notifications in this group */
  count: number
  /** Whether this group is currently expanded */
  isExpanded: boolean
  /** The individual notifications in this group */
  notifications: Notification[]
  /** Timestamp of the most recent notification */
  timestamp: string
  /** Whether any notification in the group is unread */
  hasUnread: boolean
}

/**
 * Extract the source identifier from a notification.
 * Determines what constitutes the "source" for grouping purposes.
 *
 * Rules:
 * - assignment_changed: group by agentId (from relatedId)
 * - sprint_updated: group by sprintId (from relatedId)
 * - task_reassigned: group by taskId (from relatedId)
 * - deadline_approaching: group by taskId (from relatedId)
 * - other types: group by eventType/notificationType
 */
function getSourceIdentifier(notif: Notification): { sourceId: string; sourceType: string } {
  // For structured event types, use relatedId as the source
  if (notif.eventType && notif.relatedId) {
    // Extract the type prefix from relatedId (e.g., 'agent-1' -> 'agent')
    const typePrefix = notif.relatedId.split('-')[0] || 'unknown'

    return {
      sourceId: notif.relatedId,
      sourceType: notif.eventType,
    }
  }

  // Fallback: group by notification type
  return {
    sourceId: notif.type,
    sourceType: notif.type,
  }
}

/**
 * Extract a human-readable source name from a notification.
 * Used for display in the collapsed group header.
 */
function getSourceName(notif: Notification): string {
  // Try to extract agent name from message if it's an assignment
  if (notif.eventType === 'assignment_changed') {
    const match = notif.message.match(/(?:assigned to|from) (Agent [\w\s]+|[\w\s]+)(?:\s|$)/)
    if (match?.[1]) {
      return match[1]
    }
    const agentMatch = notif.message.match(/(Alice|Bob|Charlie|Diana|Eve|Frank|Grace|Henry|Ivan|Julia)/)
    if (agentMatch?.[1]) {
      return agentMatch[1]
    }
  }

  // For sprint updates, extract sprint name
  if (notif.eventType === 'sprint_updated') {
    const match = notif.message.match(/(Sprint \d+)/)
    if (match?.[1]) {
      return match[1]
    }
  }

  // For task-related notifications, try to extract task name
  if (notif.eventType === 'task_reassigned' || notif.eventType === 'deadline_approaching') {
    const match = notif.message.match(/"([^"]+)"/)
    if (match?.[1]) {
      return `Task: ${match[1]}`
    }
  }

  // Fallback: use type
  return notif.type
}

/**
 * Group consecutive notifications by their source.
 * Notifications are grouped if they are consecutive AND from the same source.
 *
 * This is a pure function with no side effects.
 *
 * @param notifications - Flat list of notifications to group
 * @returns Array of notification groups with expand/collapse state
 */
export function groupNotifications(notifications: Notification[]): NotificationGroup[] {
  if (notifications.length === 0) {
    return []
  }

  const groups: NotificationGroup[] = []
  let currentGroup: Notification[] = []
  let currentSourceId: string | null = null

  // Process each notification
  for (const notif of notifications) {
    const { sourceId } = getSourceIdentifier(notif)

    // Start a new group if source changed
    if (sourceId !== currentSourceId && currentGroup.length > 0) {
      // Save previous group if it has 2+ items, otherwise expand single items
      const groupNotifications = currentGroup
      const sourceId = getSourceIdentifier(groupNotifications[0]).sourceId
      const sourceType = getSourceIdentifier(groupNotifications[0]).sourceType
      const sourceName = getSourceName(groupNotifications[0])

      groups.push({
        id: `group-${sourceId}-${Date.now()}-${Math.random()}`,
        sourceId,
        sourceName,
        sourceType,
        count: groupNotifications.length,
        isExpanded: groupNotifications.length === 1, // Single items are always expanded
        notifications: groupNotifications,
        timestamp: groupNotifications[0].timestamp,
        hasUnread: groupNotifications.some((n) => !n.read),
      })

      currentGroup = []
    }

    // Add notification to current group
    currentGroup.push(notif)
    currentSourceId = sourceId
  }

  // Don't forget the last group
  if (currentGroup.length > 0) {
    const groupNotifications = currentGroup
    const sourceId = getSourceIdentifier(groupNotifications[0]).sourceId
    const sourceType = getSourceIdentifier(groupNotifications[0]).sourceType
    const sourceName = getSourceName(groupNotifications[0])

    groups.push({
      id: `group-${sourceId}-${Date.now()}-${Math.random()}`,
      sourceId,
      sourceName,
      sourceType,
      count: groupNotifications.length,
      isExpanded: groupNotifications.length === 1, // Single items are always expanded
      notifications: groupNotifications,
      timestamp: groupNotifications[0].timestamp,
      hasUnread: groupNotifications.some((n) => !n.read),
    })
  }

  return groups
}

/**
 * Get all notification IDs from a group
 */
export function getGroupNotificationIds(group: NotificationGroup): string[] {
  return group.notifications.map((n) => n.id)
}
