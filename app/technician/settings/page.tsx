'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
  Bell,
  Clock,
  Globe,
  Lock,
  Save,
  ToggleLeft,
  ToggleRight,
  Smartphone,
  MapPin
} from 'lucide-react'

export default function TechnicianSettings() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
    urgentJobsAlert: false,
    dailyDigest: false,

    // Availability settings
    maxJobsPerDay: 5,
    autoAcceptJobs: false,
    weekendWork: false,

    // Preference settings
    language: 'en',
    theme: 'light',
    timezone: '+03:00', // Bahrain UTC+3

    // Security settings
    twoFactorEnabled: false,
    sessionTimeout: 30
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Redirect if not authenticated or not technician
  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any)?.role !== 'TECHNICIAN') {
      redirect('/auth/signin?callbackUrl=/technician/settings')
    }
  }, [session, status])

  useEffect(() => {
    if (!session) return
    setLoading(false) // Set to false immediately for demo
  }, [session])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Settings saved successfully!')
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'TECHNICIAN') {
    return null // Will redirect
  }

  const ToggleSwitch = ({ checked, onChange, label }: {
    checked: boolean,
    onChange: (value: boolean) => void,
    label: string
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your preferences and account settings</p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive new job assignments via email</p>
              </div>
              <ToggleSwitch
                checked={settings.emailNotifications}
                onChange={(value) => handleSettingChange('emailNotifications', value)}
                label="Email Notifications"
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-600">Get urgent job updates via text message</p>
              </div>
              <ToggleSwitch
                checked={settings.smsNotifications}
                onChange={(value) => handleSettingChange('smsNotifications', value)}
                label="SMS Notifications"
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-600">Browser notifications for important updates</p>
              </div>
              <ToggleSwitch
                checked={settings.pushNotifications}
                onChange={(value) => handleSettingChange('pushNotifications', value)}
                label="Push Notifications"
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Urgent Jobs Alert</h3>
                <p className="text-sm text-gray-600">Immediate notifications for emergency jobs</p>
              </div>
              <ToggleSwitch
                checked={settings.urgentJobsAlert}
                onChange={(value) => handleSettingChange('urgentJobsAlert', value)}
                label="Urgent Jobs Alert"
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Daily Digest</h3>
                <p className="text-sm text-gray-600">Summary of your daily performance</p>
              </div>
              <ToggleSwitch
                checked={settings.dailyDigest}
                onChange={(value) => handleSettingChange('dailyDigest', value)}
                label="Daily Digest"
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Work Availability</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="py-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Jobs Per Day
              </label>
              <select
                value={settings.maxJobsPerDay}
                onChange={(e) => handleSettingChange('maxJobsPerDay', parseInt(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={3}>3 jobs</option>
                <option value={5}>5 jobs</option>
                <option value={8}>8 jobs</option>
                <option value={10}>10 jobs</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Auto-Accept Jobs</h3>
                <p className="text-sm text-gray-600">Automatically accept non-urgent job assignments</p>
              </div>
              <ToggleSwitch
                checked={settings.autoAcceptJobs}
                onChange={(value) => handleSettingChange('autoAcceptJobs', value)}
                label="Auto-Accept Jobs"
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Weekend Work</h3>
                <p className="text-sm text-gray-600">Accept job assignments on weekends</p>
              </div>
              <ToggleSwitch
                checked={settings.weekendWork}
                onChange={(value) => handleSettingChange('weekendWork', value)}
                label="Weekend Work"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="py-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="ar">العربية (Arabic - Coming Soon)</option>
              </select>
            </div>

            <div className="py-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode (Coming Soon)</option>
              </select>
            </div>

            <div className="py-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="+03:00">Bahrain (UTC+3)</option>
                <option value="+04:00">UAE (UTC+4)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium flex items-center space-x-2 mx-auto disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving Settings...' : 'Save All Changes'}</span>
          </button>
          <p className="text-sm text-gray-500 mt-2">
            All settings are saved automatically and synced across devices
          </p>
        </div>
      </div>
    </div>
  )
}
