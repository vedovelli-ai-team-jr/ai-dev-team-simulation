import type { TaskPriority } from '../../types/sprint'

/**
 * TaskPriorityIndicator - Icon + text priority level indicator
 * Never signals priority by color alone - always includes text label
 *
 * Usage examples:
 * ```tsx
 * <TaskPriorityIndicator priority="high" />
 * <TaskPriorityIndicator priority="low" showIcon={true} />
 * <TaskPriorityIndicator priority="medium" size="lg" />
 * ```
 */

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; icon: string; color: string; ariaLabel: string }
> = {
  'low': {
    label: 'Low',
    icon: '↓',
    color: 'text-slate-400',
    ariaLabel: 'Low priority',
  },
  'medium': {
    label: 'Medium',
    icon: '→',
    color: 'text-yellow-400',
    ariaLabel: 'Medium priority',
  },
  'high': {
    label: 'High',
    icon: '↑',
    color: 'text-red-400',
    ariaLabel: 'High priority',
  },
}

export interface TaskPriorityIndicatorProps {
  priority: TaskPriority
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'inline' | 'stacked'
  className?: string
}

export function TaskPriorityIndicator({
  priority,
  showIcon = true,
  size = 'md',
  variant = 'inline',
  className = '',
}: TaskPriorityIndicatorProps) {
  const config = PRIORITY_CONFIG[priority]

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div
      className={`flex ${variant === 'stacked' ? 'flex-col' : 'flex-row'} items-center gap-1.5 ${className}`}
      role="img"
      aria-label={config.ariaLabel}
    >
      {showIcon && (
        <span
          className={`font-bold ${config.color} flex-shrink-0 ${iconSizeClasses[size]}`}
          aria-hidden="false"
        >
          {config.icon}
        </span>
      )}
      <span className={`font-medium ${sizeClasses[size]} text-slate-200`}>{config.label}</span>
    </div>
  )
}
