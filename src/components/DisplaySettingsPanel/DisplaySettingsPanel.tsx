import { useState, useEffect } from 'react'

interface DisplayPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'es' | 'pt' | 'fr' | 'de'
  timezone: string
}

interface DisplaySettingsPanelProps {
  onSave?: () => void
}

export function DisplaySettingsPanel({ onSave }: DisplaySettingsPanelProps) {
  const [preferences, setPreferences] = useState<DisplayPreferences>({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('displayPreferences')
    if (saved) {
      try {
        setPreferences(JSON.parse(saved))
      } catch {
        // Keep defaults if parsing fails
      }
    }
  }, [])

  const handleChange = (key: keyof DisplayPreferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate saving to backend
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Save to localStorage
      localStorage.setItem('displayPreferences', JSON.stringify(preferences))

      // Apply theme if changed
      if (preferences.theme !== 'system') {
        document.documentElement.classList.toggle('dark', preferences.theme === 'dark')
      }

      setHasUnsavedChanges(false)
      setSuccessMessage('Display preferences updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
      onSave?.()
    } finally {
      setIsLoading(false)
    }
  }

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'pt', label: 'Português' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ]

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney',
  ]

  const themes = [
    { value: 'light', label: '☀️ Light' },
    { value: 'dark', label: '🌙 Dark' },
    { value: 'system', label: '🖥️ System' },
  ] as const

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleChange('theme', theme.value)}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                preferences.theme === theme.value
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">Language</label>
        <select
          value={preferences.language}
          onChange={(e) => handleChange('language', e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Timezone Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">Timezone</label>
        <select
          value={preferences.timezone}
          onChange={(e) => handleChange('timezone', e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isLoading}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
