import { useEffect, useRef, useState } from 'react'
import type { Notification } from '../types/notification'
import { useNotifications } from './useNotifications'

/**
 * Toast message to be rendered
 */
export interface Toast {
  id: string
  notification: Notification
  createdAt: number
}

/**
 * Options for configuring toast behavior
 */
export interface UseToastNotificationsOptions {
  /** Duration in milliseconds before auto-dismiss (default: 4000 = 4s) */
  autoDismissMs?: number
  /** Maximum number of toasts visible at once (default: 3) */
  maxVisible?: number
}

/**
 * Hook to detect newly-arrived notifications and render them as toast messages
 *
 * Features:
 * - Subscribes to useNotifications polling cycle
 * - Detects newly-arrived notifications by comparing IDs
 * - Auto-dismisses after configurable duration (default 4s)
 * - Limits concurrent visible toasts (default 3, queues older ones)
 * - Provides manual dismiss via dismissToast(id)
 * - Prevents duplicate toasts for same notification ID
 */
export function useToastNotifications(options: UseToastNotificationsOptions = {}) {
  const {
    autoDismissMs = 4000,
    maxVisible = 3,
  } = options

  const { notifications } = useNotifications()
  const [toasts, setToasts] = useState<Toast[]>([])
  const previousNotificationIdsRef = useRef<Set<string>>(new Set())
  const toastTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Track new notifications and create toast entries
  useEffect(() => {
    const currentNotificationIds = new Set(notifications.map((n) => n.id))
    const previousIds = previousNotificationIdsRef.current

    // Find newly arrived notifications (in current but not in previous)
    const newNotifications = notifications.filter(
      (n) => !previousIds.has(n.id)
    )

    // Add toast entries for new notifications
    if (newNotifications.length > 0) {
      setToasts((prev) => {
        const updated = [...prev]

        // Add new toast entries
        for (const notification of newNotifications) {
          // Skip if toast already exists for this notification
          if (!updated.some((t) => t.id === notification.id)) {
            updated.push({
              id: notification.id,
              notification,
              createdAt: Date.now(),
            })
          }
        }

        // Keep only the most recent maxVisible toasts
        if (updated.length > maxVisible) {
          const removed = updated.slice(0, updated.length - maxVisible)
          // Clear auto-dismiss timeouts for removed toasts
          for (const toast of removed) {
            const timeout = toastTimeoutsRef.current.get(toast.id)
            if (timeout) {
              clearTimeout(timeout)
              toastTimeoutsRef.current.delete(toast.id)
            }
          }
          return updated.slice(updated.length - maxVisible)
        }

        return updated
      })
    }

    // Update previous notification IDs
    previousNotificationIdsRef.current = currentNotificationIds
  }, [notifications, maxVisible])

  // Set up auto-dismiss timeouts for new toasts
  useEffect(() => {
    for (const toast of toasts) {
      // Skip if timeout already set
      if (!toastTimeoutsRef.current.has(toast.id)) {
        const timeout = setTimeout(() => {
          dismissToast(toast.id)
        }, autoDismissMs)

        toastTimeoutsRef.current.set(toast.id, timeout)
      }
    }
  }, [toasts, autoDismissMs])

  /**
   * Manually dismiss a toast by ID
   */
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))

    const timeout = toastTimeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      toastTimeoutsRef.current.delete(id)
    }
  }

  /**
   * Clear all visible toasts
   */
  const clearAllToasts = () => {
    // Clear all timeouts
    for (const timeout of toastTimeoutsRef.current.values()) {
      clearTimeout(timeout)
    }
    toastTimeoutsRef.current.clear()

    // Clear all toasts
    setToasts([])
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      for (const timeout of toastTimeoutsRef.current.values()) {
        clearTimeout(timeout)
      }
      toastTimeoutsRef.current.clear()
    }
  }, [])

  return {
    toasts,
    dismissToast,
    clearAllToasts,
  }
}

export type UseToastNotificationsReturn = ReturnType<typeof useToastNotifications>
