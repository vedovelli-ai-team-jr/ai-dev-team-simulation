import { useState, useEffect } from 'react'

interface ConflictBannerProps {
  hasConflict: boolean
  onViewConflict: () => void
  entityType?: 'task' | 'sprint'
}

export function ConflictBanner({
  hasConflict,
  onViewConflict,
  entityType = 'task',
}: ConflictBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  // Reset dismissed state when a new conflict is detected
  useEffect(() => {
    if (hasConflict) {
      setIsDismissed(false)
    }
  }, [hasConflict])

  if (!hasConflict || isDismissed) {
    return null
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <p className="text-sm text-yellow-800">
          This {entityType} was updated by someone else while you were editing.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onViewConflict}
          className="px-3 py-1 text-sm font-medium text-yellow-700 bg-white border border-yellow-300 rounded hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          View Conflict
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-yellow-600 hover:text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
          aria-label="Dismiss conflict banner"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
