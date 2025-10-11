'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Camera,
  Edit3
} from 'lucide-react'

interface TechnicianProfile {
  id: string
  email: string
  name: string | null
  phone: string | null
  image?: string
  specialization: string[]
  availability: boolean
  experienceYears: number | null
  rating: number | null
  completedJobs: number
  totalEarnings: number
}

export default function TechnicianProfile() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<TechnicianProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  // Redirect if not authenticated or not technician
  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any)?.role !== 'TECHNICIAN') {
      redirect('/auth/signin?callbackUrl=/technician/profile')
    }
  }, [session, status])

  useEffect(() => {
    if (!session) return

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/technician/profile')
        const data = await response.json()

        if (data.success) {
          setProfile(data.profile)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'TECHNICIAN') {
    return null // Will redirect
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
        <div className="relative px-6 pb-6">
          {/* Profile Photo */}
          <div className="flex items-center justify-center -mt-16 mb-4">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name || 'Technician'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.name || 'Technician'}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {profile.phone}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{profile.completedJobs}</p>
              <p className="text-sm text-gray-600">Jobs Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{profile.rating?.toFixed(1) || 'N/A'}</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{profile.experienceYears || 0}</p>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">BD {profile.totalEarnings / 100}</p>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <Edit3 className="w-4 h-4" />
              <span>{editing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={profile.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={profile.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                {profile.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Work Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.specialization?.length > 0 ? (
                  profile.specialization.map((spec, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {spec}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No specializations set</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <p className="text-gray-900">{profile.experienceYears || 0} years</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability Status
              </label>
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  profile.availability ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className={profile.availability ? 'text-green-700' : 'text-red-700'}>
                  {profile.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      (profile.rating || 0) > i
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-lg font-semibold">
                {(profile.rating || 0).toFixed(1)} / 5.0
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {profile.completedJobs}
              </div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-xs text-gray-500">Successfully completed</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                BD {profile.totalEarnings / 100}
              </div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-xs text-gray-500">Lifetime earnings</p>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <h3 className="text-lg font-semibold mb-4">Save Changes?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save these profile changes?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement save logic
                  setEditing(false)
                  alert('Profile updated successfully!')
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
