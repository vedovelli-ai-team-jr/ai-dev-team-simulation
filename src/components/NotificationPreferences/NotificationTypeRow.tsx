/**
 * Single notification type preference row with toggle, frequency, and channel controls
 */

import type { NotificationTypePreference, NotificationFrequency, NotificationChannel } from '../../types/notification-preferences'

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  assignment_changed: 'Assignment Changed',
  sprint_updated: 'Sprint Updated',
  task_reassigned: 'Task Reassigned',
  deadline_approaching: 'Deadline Approaching',
  task_assigned: 'Task Assigned',
  task_unassigned: 'Task Unassigned',
  sprint_started: 'Sprint Started',
  sprint_completed: 'Sprint Completed',
  comment_added: 'Comment Added',
  status_changed: 'Status Changed',
  agent_event: 'Agent Event',
  performance_alert: 'Performance Alert',
}

interface NotificationTypeRowProps {
  type: string
  preference: NotificationTypePreference
  onChange: (preference: NotificationTypePreference) => void
}

export function NotificationTypeRow({ type, preference, onChange }: NotificationTypeRowProps) {
  const handleToggle = () => {
    onChange({
      ...preference,
      enabled: !preference.enabled,
    })
  }

  const handleFrequencyChange = (frequency: NotificationFrequency) => {
    onChange({
      ...preference,
      frequency,
    })
  }

  const handleChannelToggle = (channel: NotificationChannel) => {
    const channels = preference.channels.includes(channel)
      ? preference.channels.filter((c) => c !== channel)
      : [...preference.channels, channel]

    onChange({
      ...preference,
      channels,
    })
  }

  return (
    <div className="border-b border-slate-200 py-4 last:border-b-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
        {/* Type label and toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            role="switch"
            aria-checked={preference.enabled}
            aria-label={`Toggle ${NOTIFICATION_TYPE_LABELS[type]}`}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              preference.enabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preference.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <label className="text-sm font-medium text-slate-700 min-w-max cursor-pointer">
            {NOTIFICATION_TYPE_LABELS[type]}
          </label>
        </div>

        {/* Frequency selector */}
        <div className="flex gap-2">
          {(['instant', 'daily', 'off'] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => handleFrequencyChange(freq)}
              disabled={!preference.enabled}
              aria-label={`${NOTIFICATION_TYPE_LABELS[type]} frequency: ${freq}`}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                preference.frequency === freq
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              } ${!preference.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {freq.charAt(0).toUpperCase() + freq.slice(1)}
            </button>
          ))}
        </div>

        {/* Channel toggles */}
        <div className="flex gap-3">
          {(['in-app', 'email'] as const).map((channel) => (
            <button
              key={channel}
              onClick={() => handleChannelToggle(channel)}
              disabled={!preference.enabled}
              role="switch"
              aria-checked={preference.channels.includes(channel)}
              aria-label={`${NOTIFICATION_TYPE_LABELS[type]} via ${channel}`}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                preference.channels.includes(channel) ? 'bg-green-600' : 'bg-slate-300'
              } ${!preference.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preference.channels.includes(channel) ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
