import { useToastNotifications } from '../../hooks/useToastNotifications'
import { ToastItem } from './ToastItem'

interface ToastContainerProps {
  /** Duration in milliseconds before auto-dismiss (default: 4000 = 4s) */
  autoDismissMs?: number
  /** Maximum number of toasts visible at once (default: 3) */
  maxVisible?: number
}

/**
 * Toast notification container component
 *
 * Features:
 * - Fixed positioned container (bottom-right corner)
 * - Renders stacked ToastItem components
 * - Handles entry/exit animations (CSS transitions: slide-in from right, fade-out)
 * - Accessible with proper ARIA attributes
 * - Integrates with useToastNotifications hook
 *
 * Should be mounted at app root level (e.g., in App.tsx)
 */
export function ToastContainer({ autoDismissMs = 4000, maxVisible = 3 }: ToastContainerProps) {
  const { toasts, dismissToast } = useToastNotifications({
    autoDismissMs,
    maxVisible,
  })

  return (
    <div
      className="fixed bottom-4 right-4 z-50 pointer-events-none"
      role="alert"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            notification={toast.notification}
            onDismiss={() => dismissToast(toast.id)}
            autoDismissMs={autoDismissMs}
          />
        ))}
      </div>
    </div>
  )
}
