'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, Key, Save } from 'lucide-react'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(8, 'Phone number must be at least 8 digits')
    .regex(/^(\+973)?[0-9]{8}$/, 'Please enter a valid Bahrain phone number'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional()
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false
  }
  return true
}, {
  message: "Current password is required to change password",
  path: ["currentPassword"],
}).refine((data) => {
  if (data.newPassword) {
    if (data.newPassword.length < 8) {
      return false
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.newPassword)) {
      return false
    }
  }
  return true
}, {
  message: "New password must be at least 8 characters with uppercase, lowercase, and number",
  path: ["newPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  verified: boolean
  createdAt: string
}

export default function CustomerProfile() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customer/profile')

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      const profile = data.profile

      setUserProfile(profile)

      // Set form values
      setValue('name', profile.name)
      setValue('email', profile.email)
      setValue('phone', profile.phone)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
      console.error('Profile fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitProfile = async (data: ProfileFormData) => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          ...(data.newPassword && {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
          })
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const result = await response.json()

      // Update local state
      setUserProfile(result.profile)

      alert('Profile updated successfully!')

      // Clear password fields
      setValue('currentPassword', '')
      setValue('newPassword', '')

    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update profile')
      console.error('Profile update error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
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
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
            <p className="text-sm text-gray-600">Update your personal details and contact information</p>
          </div>

          <form onSubmit={handleSubmit(onSubmitProfile)} className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Used for login and notifications</p>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phone')}
                  type="tel"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+973 XXXX XXXX"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Bahrain format (+973 XXXX XXXX)</p>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Change */}
            <div className="border-t pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
              <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('currentPassword')}
                      type="password"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('newPassword')}
                      type="password"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Info */}
            {userProfile && (
              <div className="border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Account Type:</span>
                    <span className="ml-2 text-gray-600 capitalize">{userProfile.role.toLowerCase()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 ${userProfile.verified ? 'text-green-600' : 'text-orange-600'}`}>
                      {userProfile.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Member Since:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(userProfile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="text-sm text-gray-500">
                * Required fields
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <div className="flex">
            <Key className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Security Information</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your personal information is encrypted and secure</li>
                <li>• Password changes take effect immediately</li>
                <li>• For account deletion or data export, please contact support</li>
                <li>• We use your email and phone for booking confirmations only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
