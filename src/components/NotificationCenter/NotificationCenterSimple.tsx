import { useState, useRef, useEffect, useCallback } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import type { Notification } from '../../types/notification'

/**
 * NotificationCenterSimple Component
 *
 * Bell icon → Dropdown panel with notification list.
 * Uses the useNotifications hook directly from FAB-179.
 *
 * Features:
 * - Bell icon button with unread count badge
 * - Dropdown panel that opens on click
 * - List of notifications with type icons and timestamps
 * - Mark-as-read on click
 * - Mark-all-as-read button
 * - Empty state, loading state, and error state
 * - Full accessibility (ARIA roles, keyboard navigation)
 * - Click outside to close
 * - Escape key to close
 */
export function NotificationCenterSimple() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLButtonElement>(null)

  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    error,
    markAsRead,
    markMultipleAsRead,
  } = useNotifications()

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !bellRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close panel on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        bellRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleMarkAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
    if (unreadIds.length > 0) {
      await markMultipleAsRead(unreadIds)
    }
  }, [notifications, markMultipleAsRead])

  const handleNotificationClick = (id: string) => {
    markAsRead(id)
  }

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={bellRef}
        onClick={togglePanel}
        className="relative inline-flex items-center justify-center w-10 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? 'notification-panel' : undefined}
      >
        {/* Bell Icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full transform translate-x-1 -translate-y-1"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          id="notification-panel"
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[600px]"
          role="dialog"
          aria-labelledby="notification-panel-title"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2
                id="notification-panel-title"
                className="text-lg font-semibold text-gray-900"
              >
                Notifications
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close notifications panel"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mark All as Read Button */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors"
                aria-label="Mark all notifications as read"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              // Loading State
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500">Loading notifications...</p>
                </div>
              </div>
            ) : isError ? (
              // Error State
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <svg
                  className="w-12 h-12 text-red-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-900 font-medium mb-1">Failed to load notifications</p>
                <p className="text-gray-600 text-sm text-center mb-4">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </p>
              </div>
            ) : notifications.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <svg
                  className="w-12 h-12 text-gray-300 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V5a2 2 0 00-2-2H6a2 2 0 00-2 2v8"
                  />
                </svg>
                <p className="text-gray-900 font-medium">No notifications yet</p>
                <p className="text-gray-500 text-sm">You're all caught up!</p>
              </div>
            ) : (
              // Notification List
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <NotificationItemSimple
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleNotificationClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Simple notification item component
 */
function NotificationItemSimple({
  notification,
  onMarkAsRead,
}: {
  notification: Notification
  onMarkAsRead: (id: string) => void
}) {
  const isUnread = !notification.read
  const timestamp = new Date(notification.timestamp)
  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  let timeString = ''
  if (diffMins < 1) {
    timeString = 'just now'
  } else if (diffMins < 60) {
    timeString = `${diffMins}m ago`
  } else if (diffHours < 24) {
    timeString = `${diffHours}h ago`
  } else {
    timeString = `${diffDays}d ago`
  }

  const getTypeIcon = () => {
    const iconClass = 'w-5 h-5 flex-shrink-0'

    switch (notification.type) {
      case 'assignment_changed':
      case 'task_assigned':
      case 'task_reassigned':
        return (
          <svg className={`${iconClass} text-blue-500`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        )
      case 'sprint_updated':
      case 'sprint_started':
      case 'sprint_completed':
        return (
          <svg className={`${iconClass} text-green-500`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
          </svg>
        )
      case 'deadline_approaching':
        return (
          <svg className={`${iconClass} text-red-500`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.5a1 1 0 002 0V7z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className={`${iconClass} text-gray-400`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 014 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <button
      onClick={() => {
        if (isUnread) {
          onMarkAsRead(notification.id)
        }
      }}
      type="button"
      className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 flex gap-3 ${
        isUnread ? 'bg-blue-50' : 'bg-white opacity-80'
      }`}
      role="article"
      aria-label={`${notification.message}${isUnread ? ' - unread' : ''}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{getTypeIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium break-words ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">{timeString}</p>
      </div>

      {/* Unread Indicator */}
      {isUnread && (
        <div
          className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"
          aria-label="Unread"
          aria-hidden="true"
        />
      )}
    </button>
  )
}
