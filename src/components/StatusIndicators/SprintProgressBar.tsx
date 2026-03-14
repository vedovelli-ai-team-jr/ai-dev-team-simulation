/**
 * SprintProgressBar - Animated progress indicator for sprint completion
 *
 * Usage examples:
 * ```tsx
 * <SprintProgressBar completedCount={12} totalCount={20} />
 * <SprintProgressBar completedCount={5} totalCount={10} showLabel={true} />
 * <SprintProgressBar completedCount={8} totalCount={8} animated={false} />
 * ```
 */

export interface SprintProgressBarProps {
  completedCount: number
  totalCount: number
  showLabel?: boolean
  showPercentage?: boolean
  animated?: boolean
  height?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SprintProgressBar({
  completedCount,
  totalCount,
  showLabel = true,
  showPercentage = true,
  animated = true,
  height = 'md',
  className = '',
}: SprintProgressBarProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const isComplete = completedCount >= totalCount && totalCount > 0

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const fillColor = isComplete ? 'bg-green-500' : 'bg-blue-500'
  const animationClass = animated ? 'transition-all duration-500 ease-out' : ''

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Progress bar container */}
      <div
        className={`w-full ${heightClasses[height]} bg-slate-700 rounded-full overflow-hidden border border-slate-600`}
        role="progressbar"
        aria-label="Sprint completion progress"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Fill */}
        <div
          className={`${fillColor} ${heightClasses[height]} rounded-full ${animationClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Labels */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {showLabel && (
            <span className="text-slate-300">
              {completedCount}/{totalCount} tasks
            </span>
          )}
          {showPercentage && (
            <span className={`font-medium ${isComplete ? 'text-green-400' : 'text-blue-400'}`}>
              {percentage}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
