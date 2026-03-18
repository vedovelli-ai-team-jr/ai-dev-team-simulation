import { ReactNode } from 'react'

export interface OnboardingStepProps {
  id: string
  icon?: string
  title: string
  description: string
  children?: ReactNode
  isActive?: boolean
  isCompleted?: boolean
  canSkip?: boolean
  onComplete?: () => void | Promise<void>
  onSkip?: () => void | Promise<void>
  isLoading?: boolean
}

export function OnboardingStep({
  icon,
  title,
  description,
  children,
  isActive = false,
  isCompleted = false,
  canSkip = false,
  onComplete,
  onSkip,
  isLoading = false,
}: OnboardingStepProps) {
  return (
    <div
      className={`rounded-lg border-2 p-6 transition-all ${
        isActive
          ? 'border-blue-500 bg-blue-50/5'
          : isCompleted
            ? 'border-green-500/30 bg-green-50/5'
            : 'border-slate-700 bg-slate-900/50'
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="text-3xl">{icon}</div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-slate-400 mt-1">{description}</p>
            </div>
          </div>

          {isCompleted && (
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {children && (
        <div className="mb-6">
          {children}
        </div>
      )}

      {/* Action Buttons */}
      {isActive && !isCompleted && (
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={onComplete}
            disabled={isLoading}
            className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Completing...' : 'Continue'}
          </button>

          {canSkip && (
            <button
              onClick={onSkip}
              disabled={isLoading}
              className="mt-4 px-6 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      )}
    </div>
  )
}
