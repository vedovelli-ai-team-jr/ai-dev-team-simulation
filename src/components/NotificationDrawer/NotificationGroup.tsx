import { useState } from 'react'
import type { Notification } from '../../types/notification'
import { NotificationItem } from './NotificationItem'

interface NotificationGroupProps {
  title: string
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  isInitiallyExpanded?: boolean
}

export function NotificationGroup({
  title,
  notifications,
  onMarkAsRead,
  isInitiallyExpanded = true,
}: NotificationGroupProps) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded)

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div>
      {/* Group Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200 sticky top-0 bg-white z-10"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full flex-shrink-0">
              {Math.min(unreadCount, 99)}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Group Content */}
      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}
