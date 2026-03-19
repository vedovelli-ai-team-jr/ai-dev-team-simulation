interface OnboardingProgressBarProps {
  current: number
  total: number
  label?: string
}

export function OnboardingProgressBar({ current, total, label }: OnboardingProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-200">{label}</span>
          <span className="text-sm text-slate-400">
            {current} of {total}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentage */}
      <div className="text-right text-xs text-slate-400">{percentage}% complete</div>
    </div>
  )
}
