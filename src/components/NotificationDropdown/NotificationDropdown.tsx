import { useEffect, useRef } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

/**
 * Loading skeleton component for notification items
 */
function NotificationSkeleton() {
  return (
    <div className="px-4 py-3 border-b animate-pulse">
      <div className="flex gap-3">
        <div className="w-2 h-2 bg-slate-200 rounded-full mt-1 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mb-4 text-4xl">✨</div>
      <h3 className="text-slate-900 font-medium mb-1">You're all caught up!</h3>
      <p className="text-sm text-slate-500">No notifications yet</p>
    </div>
  )
}

/**
 * NotificationDropdown displays a panel with recent notifications
 * Appears below the notification bell icon
 */
export function NotificationDropdown({
  isOpen,
  onClose,
  className = '',
}: NotificationDropdownProps) {
  const {
    notifications,
    isLoading,
    markAsRead,
    markMultipleAsRead,
  } = useNotifications()

  const dropdownRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.read)
      .map((n) => n.id)

    if (unreadIds.length > 0) {
      await markMultipleAsRead(unreadIds)
    }
  }

  return (
    <>
      {/* Backdrop for focus containment */}
      <div className="fixed inset-0 z-40" ref={dropdownRef} />

      {/* Dropdown Panel */}
      <div
        ref={panelRef}
        className={`absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-[600px] flex flex-col ${className}`}
        role="region"
        aria-label="Notifications"
      >
        {/* Header */}
        <div className="border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
          {notifications.length > 0 && !isLoading && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              aria-label="Mark all notifications as read"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && notifications.length === 0 ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
