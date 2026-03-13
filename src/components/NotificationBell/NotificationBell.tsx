import { useRef, useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { NotificationList } from '../NotificationList/NotificationListBell'

/**
 * NotificationBell displays a bell icon with an unread count badge
 * that opens a dropdown panel showing the notification list
 */
export function NotificationBell() {
  const { unreadCount, notifications, isLoading, markAsRead, markMultipleAsRead } = useNotifications()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)

  // Handle closing panel on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false)
      }
    }

    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isPanelOpen])

  // Handle Escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isPanelOpen) {
        setIsPanelOpen(false)
      }
    }

    if (isPanelOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      return () => {
        document.removeEventListener('keydown', handleEscapeKey)
      }
    }
  }, [isPanelOpen])

  const badgeLabel = unreadCount > 9 ? '9+' : String(unreadCount)
  const ariaLabel = `Notifications (${unreadCount} unread)`

  return (
    <div ref={bellRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        aria-label={ariaLabel}
        aria-expanded={isPanelOpen}
        aria-haspopup="true"
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {badgeLabel}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isPanelOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-96 overflow-hidden flex flex-col">
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={() => {
              const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
              if (unreadIds.length > 0) {
                markMultipleAsRead(unreadIds)
              }
            }}
            onClose={() => setIsPanelOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
