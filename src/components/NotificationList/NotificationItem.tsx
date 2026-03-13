import {
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  Zap,
} from 'lucide-react'
import type { Notification } from '../../types/notification'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onClose: () => void
}

/**
 * Get icon component based on notification type
 */
function getNotificationIcon(type: Notification['type']): JSX.Element {
  switch (type) {
    case 'assignment_changed':
    case 'task_assigned':
      return <UserCheck className="w-4 h-4" />
    case 'sprint_updated':
    case 'sprint_started':
    case 'sprint_completed':
      return <CheckCircle2 className="w-4 h-4" />
    case 'deadline_approaching':
      return <Clock className="w-4 h-4" />
    case 'task_reassigned':
      return <UserCheck className="w-4 h-4" />
    case 'status_changed':
      return <CheckCircle2 className="w-4 h-4" />
    case 'performance_alert':
      return <AlertCircle className="w-4 h-4" />
    case 'agent_event':
      return <Zap className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

/**
 * Get icon color based on notification type
 */
function getIconColor(type: Notification['type']): string {
  switch (type) {
    case 'assignment_changed':
    case 'task_assigned':
    case 'task_reassigned':
      return 'text-blue-500'
    case 'sprint_updated':
    case 'sprint_started':
    case 'sprint_completed':
      return 'text-green-500'
    case 'deadline_approaching':
      return 'text-amber-500'
    case 'status_changed':
      return 'text-purple-500'
    case 'performance_alert':
      return 'text-red-500'
    case 'agent_event':
      return 'text-yellow-500'
    default:
      return 'text-slate-500'
  }
}

/**
 * Format timestamp as relative time (e.g., "2 minutes ago")
 */
function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`

  return date.toLocaleDateString()
}

/**
 * NotificationItem displays a single notification with type icon, message, and timestamp
 */
export function NotificationItem({
  notification,
  onMarkAsRead,
  onClose,
}: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
    // TODO: Navigate based on relatedId when routing is needed
    onClose()
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Unread Indicator */}
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 flex-shrink-0" aria-label="Unread" />
        )}
        {notification.read && (
          <div className="w-2 h-2 flex-shrink-0" />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {/* Type Icon */}
            <div className={`flex-shrink-0 mt-0.5 ${getIconColor(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>

            {/* Message and Timestamp */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${
                  notification.read ? 'text-slate-700' : 'font-medium text-slate-900'
                }`}
              >
                {notification.message}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {getRelativeTime(notification.timestamp)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
