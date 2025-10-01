'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react'

interface DashboardStats {
  pending: number
  assigned: number
  completed: number
  totalRevenue: number
  totalBookings: number
}

interface RecentBooking {
  id: string
  bookingNumber: string
  status: string
  scheduledDate: Date
  service: {
    name: string
  }
  contact: {
    firstName: string
    lastName: string
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      redirect('/auth/signin?callbackUrl=/admin')
    }
  }, [session, status])

  useEffect(() => {
    if (!session) return

    const fetchDashboardData = async () => {
      try {
        const [statsResponse, bookingsResponse] = await Promise.all([
          fetch('/api/admin/bookings?limit=5'),
          fetch('/api/admin/bookings?limit=5&status=pending')
        ])

        const [statsData, bookingsData] = await Promise.all([
          statsResponse.json(),
          bookingsResponse.json()
        ])

        if (statsData.success) {
          setStats(statsData.stats)
          setRecentBookings(statsData.bookings?.slice(0, 5) || [])
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return null // Will redirect
  }

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings?.toString() || '0',
      icon: Calendar,
      color: 'blue',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      title: 'Pending Assignments',
      value: stats?.pending?.toString() || '0',
      icon: AlertCircle,
      color: 'yellow',
      change: 'Needs attention',
      changeType: 'neutral'
    },
    {
      title: 'Active Jobs',
      value: stats?.assigned?.toString() || '0',
      icon: Clock,
      color: 'blue',
      change: 'Being serviced',
      changeType: 'neutral'
    },
    {
      title: 'Completed This Month',
      value: stats?.completed?.toString() || '0',
      icon: CheckCircle,
      color: 'green',
      change: '+8.2%',
      changeType: 'increase'
    },
    {
      title: 'Total Revenue',
      value: `BD ${((stats?.totalRevenue || 0) / 100).toFixed(2)}`,
      icon: DollarSign,
      color: 'green',
      change: '+15.3%',
      changeType: 'increase'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      icon: Star,
      color: 'yellow',
      change: 'Excellent',
      changeType: 'neutral'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100'
      case 'ASSIGNED':
        return 'text-blue-600 bg-blue-100'
      case 'IN_PROGRESS':
        return 'text-orange-600 bg-orange-100'
      case 'CONFIRMED':
        return 'text-purple-600 bg-purple-100'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100'
      case 'CANCELLED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Overview of your handyman business operations
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            yellow: 'text-yellow-600 bg-yellow-100',
            red: 'text-red-600 bg-red-100',
            purple: 'text-purple-600 bg-purple-100'
          }[stat.color]

          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${colorClasses}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' :
                    stat.changeType === 'decrease' ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                  <TrendingUp className="w-4 h-4 text-gray-400 mx-auto mt-1" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700">
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      #{booking.bookingNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.service.name} - {booking.contact.firstName} {booking.contact.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No bookings yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>New Booking</span>
            </button>

            <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Add Technician</span>
            </button>

            <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Assign Pending Jobs</span>
            </button>

            <button className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats ? ((stats.completed / Math.max(stats.totalBookings, 1)) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats ? Math.round((stats.totalRevenue || 0) / Math.max(stats.totalBookings, 1)) : 0}
            </div>
            <p className="text-sm text-gray-600">Average Job Value</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats ? Math.round(stats.totalBookings / 30) : 0}
            </div>
            <p className="text-sm text-gray-600">Daily Bookings</p>
          </div>
        </div>
      </div>
    </div>
  )
}
