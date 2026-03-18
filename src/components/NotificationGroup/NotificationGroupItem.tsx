import { useState } from 'react'
import type { NotificationGroup } from '../../utils/groupNotifications'

interface NotificationGroupItemProps {
  group: NotificationGroup
  onToggleExpand: (groupId: string) => void
  onMarkGroupAsRead: (groupId: string) => Promise<void>
  onDismiss?: (notificationId: string) => void
  isLoading?: boolean
}

/**
 * Component that displays a single notification group.
 * Shows a collapsed summary when collapsed, or expanded list when expanded.
 * Supports mark-as-read and dismiss actions.
 */
export function NotificationGroupItem({
  group,
  onToggleExpand,
  onMarkGroupAsRead,
  onDismiss,
  isLoading = false,
}: NotificationGroupItemProps) {
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false)

  const handleMarkAsRead = async () => {
    setIsMarkingAsRead(true)
    try {
      await onMarkGroupAsRead(group.id)
    } finally {
      setIsMarkingAsRead(false)
    }
  }

  // Count unread notifications in group
  const unreadCount = group.notifications.filter((n) => !n.read).length

  return (
    <div className="notification-group border-b border-gray-200 last:border-b-0">
      {/* Group header / collapsed view */}
      <div className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
        {/* Expand toggle button - only show if group has 2+ items */}
        {group.count > 1 && (
          <button
            onClick={() => onToggleExpand(group.id)}
            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 transition-colors"
            aria-label={group.isExpanded ? 'Collapse group' : 'Expand group'}
          >
            <svg
              className={`w-4 h-4 transition-transform ${group.isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Unread indicator dot */}
        {group.hasUnread && <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />}

        {/* Group summary */}
        <div className="flex-grow min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{group.sourceName}</div>

          {group.count > 1 && (
            <div className="text-xs text-gray-600">
              {group.count} {group.sourceType === 'assignment_changed' ? 'tasks assigned' : 'notifications'}
            </div>
          )}

          {group.count === 1 && (
            <div className="text-sm text-gray-700 truncate">{group.notifications[0].message}</div>
          )}
        </div>

        {/* Count badge when collapsed */}
        {group.count > 1 && !group.isExpanded && (
          <div className="flex-shrink-0 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {group.count}
          </div>
        )}

        {/* Mark as read button */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAsRead}
            disabled={isMarkingAsRead || isLoading}
            className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Mark as read"
          >
            {isMarkingAsRead ? 'Marking...' : 'Mark read'}
          </button>
        )}
      </div>

      {/* Expanded view - show individual notification items */}
      {group.isExpanded && group.count > 1 && (
        <div className="bg-gray-50 border-t border-gray-200">
          {group.notifications.map((notif) => (
            <div key={notif.id} className="px-6 py-2 border-t border-gray-200 first:border-t-0 flex items-start gap-3">
              {/* Unread indicator for individual item */}
              {!notif.read && <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-blue-500 rounded-full" />}

              {/* Notification content */}
              <div className="flex-grow min-w-0">
                <div className="text-sm text-gray-900">{notif.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(notif.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {/* Dismiss button for individual notification */}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(notif.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Dismiss"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
