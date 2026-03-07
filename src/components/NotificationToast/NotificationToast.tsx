import { useEffect, useState } from 'react'
import { XCircleIcon, CheckCircleIcon, ExclamationIcon, InformationCircleIcon } from '@heroicons/react/solid'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

interface NotificationToastProps {
  id: string
  message: string
  type?: NotificationType
  autoDismiss?: number
  onDismiss: (id: string) => void
}

const getIcon = (type: NotificationType) => {
  const iconProps = { className: 'w-5 h-5' }
  switch (type) {
    case 'success':
      return <CheckCircleIcon {...iconProps} />
    case 'error':
      return <XCircleIcon {...iconProps} />
    case 'warning':
      return <ExclamationIcon {...iconProps} />
    case 'info':
    default:
      return <InformationCircleIcon {...iconProps} />
  }
}

const getColorClasses = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return 'bg-emerald-50 border-emerald-200 text-emerald-900'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-900'
    case 'warning':
      return 'bg-amber-50 border-amber-200 text-amber-900'
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 text-blue-900'
  }
}

const getIconColorClasses = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return 'text-emerald-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-amber-500'
    case 'info':
    default:
      return 'text-blue-500'
  }
}

export function NotificationToast({
  id,
  message,
  type = 'info',
  autoDismiss = 5000,
  onDismiss,
}: NotificationToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (autoDismiss === 0) return

    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        onDismiss(id)
      }, 300)
    }, autoDismiss)

    return () => clearTimeout(timer)
  }, [id, autoDismiss, onDismiss])

  return (
    <div
      className={`
        pointer-events-auto mb-3 flex items-start gap-3 rounded-lg border px-4 py-3
        transition-all duration-300 ease-out
        ${getColorClasses(type)}
        ${isExiting ? 'translate-x-[400px] opacity-0' : 'translate-x-0 opacity-100'}
        animate-slide-in
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`flex-shrink-0 mt-0.5 ${getIconColorClasses(type)}`}>
        {getIcon(type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => {
            onDismiss(id)
          }, 300)
        }}
        className="flex-shrink-0 ml-2 text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
