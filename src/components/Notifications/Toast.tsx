import { useEffect, useState } from 'react'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastProps {
  id: string
  message: string
  variant?: ToastVariant
  autoDismiss?: number
  onDismiss: (id: string) => void
}

const getIcon = (variant: ToastVariant) => {
  switch (variant) {
    case 'success':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'error':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'info':
    default:
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      )
  }
}

const getColorClasses = (variant: ToastVariant): string => {
  switch (variant) {
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

const getIconColorClasses = (variant: ToastVariant): string => {
  switch (variant) {
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

/**
 * Toast Component
 *
 * Displays a temporary notification alert with auto-dismiss capability.
 *
 * Features:
 * - Auto-dismiss after configurable timeout (default 4 seconds)
 * - Animated entry/exit with CSS transitions
 * - Support for different variants (info, success, warning, error)
 * - Accessible with ARIA live regions
 * - Manual dismiss button
 */
export function Toast({
  id,
  message,
  variant = 'info',
  autoDismiss = 4000,
  onDismiss,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (autoDismiss === 0) return

    const timer = setTimeout(() => {
      setIsExiting(true)
      const exitTimer = setTimeout(() => {
        onDismiss(id)
      }, 300)

      return () => clearTimeout(exitTimer)
    }, autoDismiss)

    return () => clearTimeout(timer)
  }, [id, autoDismiss, onDismiss])

  return (
    <div
      className={`
        pointer-events-auto mb-3 flex items-start gap-3 rounded-lg border px-4 py-3
        transition-all duration-300 ease-out
        ${getColorClasses(variant)}
        ${isExiting ? 'translate-x-[400px] opacity-0' : 'translate-x-0 opacity-100'}
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`flex-shrink-0 mt-0.5 ${getIconColorClasses(variant)}`}>
        {getIcon(variant)}
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
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
