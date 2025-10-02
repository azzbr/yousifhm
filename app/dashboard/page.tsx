'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface BookingSummary {
  total: number
  upcoming: number
  completed: number
  pending: number
}

interface RecentBooking {
  id: string
  bookingNumber: string
  service: {
    name: string
  }
  scheduledDate: string
  timeSlot: string
  status: string
  technician?: {
    user: {
      name: string
    }
  }
}

export default function CustomerDashboard() {
  const { data: session } = useSession()
  const [bookingSummary, setBookingSummary] = useState<BookingSummary>({
    total: 0,
    upcoming: 0,
    completed: 0,
    pending: 0
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/customer/dashboard')
      if (response.ok) {
        const data = await response.json()
        setBookingSummary(data.summary || bookingSummary)
        setRecentBookings(data.recentBookings || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'CONFIRMED': return 'text-blue-600 bg-blue-100'
      case 'IN_PROGRESS': return 'text-yellow-600 bg-yellow-100'
      case 'PENDING': return 'text-orange-600 bg-orange-100'
      case 'CANCELLED': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED': return <XCircle className="w-4 h-4" />
      case 'PENDING': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {(session?.user as any)?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your handyman services today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookingSummary.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{bookingSummary.upcoming}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{bookingSummary.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{bookingSummary.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/services"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Book a Service</p>
                <p className="text-sm text-gray-600">Schedule new handyman work</p>
              </div>
            </Link>

            <Link
              href="/dashboard/addresses"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Addresses</p>
                <p className="text-sm text-gray-600">Update your locations</p>
              </div>
            </Link>

            <Link
              href="/dashboard/bookings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Bookings</p>
                <p className="text-sm text-gray-600">Check all your appointments</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link
                href="/dashboard/bookings"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {recentBookings.length > 0 ? (
              recentBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">
                              {booking.status.toLowerCase().replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.service.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(booking.scheduledDate).toLocaleDateString()}
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4 mr-1" />
                            {booking.timeSlot}
                            {booking.technician && (
                              <>
                                <span className="mx-2">•</span>
                                {booking.technician.user.name}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-2">No bookings yet</p>
                <Link
                  href="/services"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Book your first service →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
