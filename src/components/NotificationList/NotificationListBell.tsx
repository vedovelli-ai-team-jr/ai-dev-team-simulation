import { useMemo, useState } from 'react'
import type { Notification } from '../../types/notification'
import { NotificationItem } from './NotificationItem'

interface NotificationListProps {
  notifications: Notification[]
  isLoading: boolean
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClose: () => void
}

type FilterTab = 'all' | 'unread'

/**
 * NotificationList displays notifications with filtering and actions
 * Used in the NotificationBell dropdown panel
 */
export function NotificationList({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationListProps) {
  const [filterTab, setFilterTab] = useState<FilterTab>('all')

  // Filter notifications based on selected tab
  const filteredNotifications = useMemo(() => {
    if (filterTab === 'unread') {
      return notifications.filter((n) => !n.read)
    }
    return notifications
  }, [notifications, filterTab])

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  return (
    <div className="flex flex-col h-full">
      {/* Header with filter tabs */}
      <div className="border-b border-slate-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterTab === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterTab('unread')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterTab === 'unread'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          // Loading Skeleton
          <div className="divide-y divide-slate-200">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-4 py-3 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-slate-200 rounded mb-2 w-3/4" />
                    <div className="h-2 bg-slate-100 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          // Empty State
          <div className="flex items-center justify-center py-12 px-4">
            <div className="text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-sm text-slate-600">You're all caught up</p>
            </div>
          </div>
        ) : (
          // Notification List
          <div className="divide-y divide-slate-200">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
