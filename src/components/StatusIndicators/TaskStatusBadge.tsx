import type { TaskStatus } from '../../types/sprint'

/**
 * TaskStatusBadge - Reusable status indicator for task status
 *
 * Usage examples:
 * ```tsx
 * <TaskStatusBadge status="done" />
 * <TaskStatusBadge status="in-progress" size="lg" />
 * <TaskStatusBadge status="backlog" variant="outline" />
 * ```
 */

const STATUS_CONFIG: Record<TaskStatus, { label: string; bgColor: string; textColor: string }> = {
  'backlog': {
    label: 'Backlog',
    bgColor: 'bg-slate-500/20',
    textColor: 'text-slate-200',
  },
  'in-progress': {
    label: 'In Progress',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-200',
  },
  'in-review': {
    label: 'In Review',
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-200',
  },
  'done': {
    label: 'Done',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-200',
  },
}

export interface TaskStatusBadgeProps {
  status: TaskStatus
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline'
  className?: string
}

export function TaskStatusBadge({
  status,
  size = 'md',
  variant = 'solid',
  className = '',
}: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  }

  const variantClasses =
    variant === 'outline'
      ? `border border-slate-400 bg-transparent ${config.textColor}`
      : `${config.bgColor} ${config.textColor}`

  return (
    <span
      className={`inline-block rounded font-medium whitespace-nowrap ${sizeClasses[size]} ${variantClasses} ${className}`}
      role="status"
      aria-label={`Task status: ${config.label}`}
    >
      {config.label}
    </span>
  )
}
