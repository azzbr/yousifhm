'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Mail, Smartphone, Bell, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const notificationSchema = z.object({
  emailNotifications: z.object({
    bookingConfirmations: z.boolean(),
    bookingUpdates: z.boolean(),
    bookingReminders: z.boolean(),
    promotionalOffers: z.boolean(),
    newsletter: z.boolean(),
    reviews: z.boolean()
  }),
  smsNotifications: z.object({
    bookingConfirmations: z.boolean(),
    urgentAlerts: z.boolean(),
    statusUpdates: z.boolean()
  }),
  appNotifications: z.object({
    newMessages: z.boolean(),
    bookingStatus: z.boolean(),
    promotions: z.boolean()
  }),
  marketingConsent: z.boolean()
})

type NotificationFormData = z.infer<typeof notificationSchema>

export default function CustomerSettings() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty }
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: {
        bookingConfirmations: true,
        bookingUpdates: true,
        bookingReminders: true,
        promotionalOffers: false,
        newsletter: false,
        reviews: true
      },
      smsNotifications: {
        bookingConfirmations: true,
        urgentAlerts: true,
        statusUpdates: false
      },
      appNotifications: {
        newMessages: true,
        bookingStatus: true,
        promotions: false
      },
      marketingConsent: false
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customer/settings')

      if (!response.ok) {
        // If no settings exist yet, use defaults
        if (response.status === 404) {
          setLoading(false)
          return
        }
        throw new Error('Failed to fetch settings')
      }

      const data = await response.json()

      // Set form values from API response
      if (data.settings) {
        const { emailNotifications, smsNotifications, appNotifications, marketingConsent } = data.settings
        setValue('emailNotifications', emailNotifications)
        setValue('smsNotifications', smsNotifications)
        setValue('appNotifications', appNotifications)
        setValue('marketingConsent', marketingConsent)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
      console.error('Settings fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitSettings = async (data: NotificationFormData) => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/customer/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save settings')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
      console.error('Settings save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const EmailToggle = ({ field, label, description }: {
    field: keyof NotificationFormData['emailNotifications'],
    label: string,
    description: string
  }) => (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          {...register(`emailNotifications.${field}`)}
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label className="font-medium text-gray-700">{label}</label>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  )

  const SMSToggle = ({ field, label, description }: {
    field: keyof NotificationFormData['smsNotifications'],
    label: string,
    description: string
  }) => (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          {...register(`smsNotifications.${field}`)}
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label className="font-medium text-gray-700">{label}</label>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-gray-600 mt-1">Control how and when you receive notifications</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <div className="text-sm font-medium text-green-800">
              Settings saved successfully!
            </div>
          </div>
        )}

        {/* Main Settings Form */}
        <form onSubmit={handleSubmit(onSubmitSettings)} className="space-y-6">
          {/* Email Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <Mail className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Manage email alerts and updates</p>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <EmailToggle
                field="bookingConfirmations"
                label="Booking Confirmations"
                description="Receive emails when bookings are confirmed or scheduled"
              />
              <EmailToggle
                field="bookingUpdates"
                label="Booking Updates"
                description="Get notified about changes to your existing bookings"
              />
              <EmailToggle
                field="bookingReminders"
                label="Booking Reminders"
                description="Receive reminders for upcoming appointments"
              />
              <EmailToggle
                field="reviews"
                label="Review Requests"
                description="Get notified when you can leave reviews for completed services"
              />
              <div className="border-t pt-4">
                <EmailToggle
                  field="promotionalOffers"
                  label="Promotional Offers"
                  description="Receive emails about special offers and discounts"
                />
                <EmailToggle
                  field="newsletter"
                  label="Newsletter"
                  description="Subscribe to our monthly newsletter with tips and updates"
                />
              </div>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <Smartphone className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-600">Text message alerts for important updates</p>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <SMSToggle
                field="bookingConfirmations"
                label="Booking Confirmations"
                description="Receive SMS confirmations for new bookings"
              />
              <SMSToggle
                field="urgentAlerts"
                label="Urgent Alerts"
                description="Emergency notifications that require immediate attention"
              />
              <SMSToggle
                field="statusUpdates"
                label="Status Updates"
                description="Daily summary of booking status changes"
              />

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> SMS notifications may incur additional charges and are sent to your registered phone number only.
                </p>
              </div>
            </div>
          </div>

          {/* App/Browser Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <Bell className="w-5 h-5 text-orange-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">In-App Notifications</h3>
                <p className="text-sm text-gray-600">Browser notifications and dashboard alerts</p>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      {...register('appNotifications.newMessages')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">New Messages</label>
                    <p className="text-gray-500">Notifications for technician messages</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      {...register('appNotifications.bookingStatus')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">Booking Status Changes</label>
                    <p className="text-gray-500">Alerts when your booking status updates</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      {...register('appNotifications.promotions')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">Promotional Notifications</label>
                    <p className="text-gray-500">Limited promotions and platform updates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Marketing */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Privacy & Marketing</h3>
              <p className="text-sm text-gray-600">Control how your data is used</p>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    {...register('marketingConsent')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Marketing Communications</label>
                  <p className="text-gray-500 mb-2">
                    Allow Bahrain Handyman to send you marketing communications about our products and services.
                    You can unsubscribe at any time.
                  </p>
                  <p className="text-xs text-gray-400">
                    Your privacy is important. We only use your data as permitted by our Privacy Policy and applicable law.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-gray-500">
              Changes are saved automatically when you submit
            </div>
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Notification Best Practices</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• We respect your communication preferences and never spam</li>
                <li>• Important booking information is always sent, regardless of your settings</li>
                <li>• You can change these settings anytime in your dashboard</li>
                <li>• For assistance, contact our support team</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
