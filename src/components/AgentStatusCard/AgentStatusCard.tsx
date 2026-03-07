import type { AgentAvailabilityStatus } from '@/types/agent'

export interface AgentStatusCardProps {
  status: AgentAvailabilityStatus
  count: number
  icon?: React.ReactNode
}

function getCardStyles(status: AgentAvailabilityStatus) {
  switch (status) {
    case 'idle':
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        textColor: 'text-gray-700',
        numberColor: 'text-gray-900',
        badgeBg: 'bg-gray-100',
      }
    case 'active':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        textColor: 'text-blue-700',
        numberColor: 'text-blue-900',
        badgeBg: 'bg-blue-100',
      }
    case 'busy':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        textColor: 'text-yellow-700',
        numberColor: 'text-yellow-900',
        badgeBg: 'bg-yellow-100',
      }
    case 'offline':
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        textColor: 'text-gray-700',
        numberColor: 'text-gray-900',
        badgeBg: 'bg-gray-100',
      }
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        textColor: 'text-gray-700',
        numberColor: 'text-gray-900',
        badgeBg: 'bg-gray-100',
      }
  }
}

function getStatusLabel(status: AgentAvailabilityStatus) {
  switch (status) {
    case 'idle':
      return 'Idle'
    case 'active':
      return 'Working'
    case 'busy':
      return 'Waiting'
    case 'offline':
      return 'Offline'
    default:
      return status
  }
}

export function AgentStatusCard({
  status,
  count,
  icon,
}: AgentStatusCardProps) {
  const styles = getCardStyles(status)
  const label = getStatusLabel(status)

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-lg p-4 sm:p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${styles.textColor}`}>
            {label}
          </p>
          <p className={`text-2xl sm:text-3xl font-bold mt-2 ${styles.numberColor}`}>
            {count}
          </p>
        </div>
        {icon && (
          <div className={`${styles.badgeBg} p-2 rounded-lg`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
