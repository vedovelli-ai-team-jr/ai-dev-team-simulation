import { ReactNode, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { UserProfileForm } from '../UserProfileForm'
import { NotificationPreferencesForm } from '../NotificationPreferencesForm/NotificationPreferencesForm'
import { DisplaySettingsPanel } from '../DisplaySettingsPanel/DisplaySettingsPanel'
import { useUserProfile } from '../../hooks/useUserProfile'
import type { UserProfileInput } from '../../types/forms/user'

type SettingsTab = 'notifications' | 'profile' | 'display'

interface SettingsLayoutProps {
  children?: ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const location = useLocation()
  const [conflictError, setConflictError] = useState<string | null>(null)
  const { profile, isLoading: isLoadingProfile, updateProfile, isUpdating } = useUserProfile()

  const handleProfileSubmit = async (data: UserProfileInput) => {
    try {
      setConflictError(null)
      await new Promise((resolve, reject) => {
        updateProfile(data, {
          onError: (error: any) => {
            if (error.status === 409) {
              setConflictError(
                'Your profile was modified by another user. Please refresh and try again.'
              )
            }
            reject(error)
          },
          onSuccess: () => {
            resolve(null)
          },
        })
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  const tabs: Array<{
    id: SettingsTab
    label: string
    icon: string
    href: string
  }> = [
    { id: 'notifications', label: 'Notifications', icon: '🔔', href: '/settings/notifications' },
    { id: 'profile', label: 'Profile', icon: '👤', href: '/settings/profile' },
    { id: 'display', label: 'Display', icon: '⚙️', href: '/settings/display' },
  ]

  const getActiveTab = (): SettingsTab => {
    const pathname = location.pathname
    const segment = pathname.split('/').filter(Boolean)[1]

    if (segment === 'notifications') return 'notifications'
    if (segment === 'profile') return 'profile'
    if (segment === 'display') return 'display'
    return 'notifications'
  }

  const activeTab = getActiveTab()

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your preferences and account settings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-700 mb-6">
          <div className="flex gap-0 -mb-px">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.href}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          {/* Conflict Error Alert */}
          {conflictError && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{conflictError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-sm font-medium text-red-700 hover:text-red-600 mt-1"
                  >
                    Refresh page
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
              {isLoadingProfile ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-slate-400">Loading profile...</div>
                </div>
              ) : profile ? (
                <UserProfileForm
                  initialData={profile}
                  onSubmit={handleProfileSubmit}
                  isLoading={isUpdating}
                />
              ) : (
                <div className="text-slate-400">Failed to load profile</div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
              <NotificationPreferencesForm />
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Display Settings</h2>
              <DisplaySettingsPanel />
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
