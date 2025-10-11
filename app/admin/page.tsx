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

function AdminDashboard() {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h3>
          <p className="text-gray-500 mt-2">Fetching your business insights</p>
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
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: stats?.totalBookings ? '+12.5%' : 'Getting started',
      changeType: stats?.totalBookings ? 'increase' : 'neutral'
    },
    {
      title: 'Pending Jobs',
      value: stats?.pending?.toString() || '0',
      icon: AlertCircle,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      change: stats?.pending ? 'Needs assignment' : 'All clear',
      changeType: stats?.pending ? 'warning' : 'neutral'
    },
    {
      title: 'Active Services',
      value: stats?.assigned?.toString() || '0',
      icon: Clock,
      gradient: 'from-indigo-500 to-purple-500',
      bg: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      change: stats?.assigned ? 'In progress' : 'None active',
      changeType: 'neutral'
    },
    {
      title: 'Completed Jobs',
      value: stats?.completed?.toString() || '0',
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      change: stats?.completed ? '+8.2%' : 'Growing',
      changeType: 'increase'
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
    <div className="space-y-6 lg:space-y-8">

      {/* Hero Stats Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon

            return (
              <div key={index} className={`${stat.bg} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-70" />
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium text-white text-opacity-90">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                </div>
                <p className={`text-xs font-medium ${
                  stat.changeType === 'increase' ? 'text-green-200' :
                  stat.changeType === 'decrease' ? 'text-red-200' :
                  stat.changeType === 'warning' ? 'text-yellow-200' :
                  'text-white text-opacity-70'
                }`}>
                  {stat.change}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Revenue & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-70" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-100">Total Revenue</p>
            <p className="text-3xl font-bold mb-2">BD {((stats?.totalRevenue || 0) / 100).toFixed(2)}</p>
            <p className="text-xs text-green-200">+15.3% from last month</p>
          </div>
        </div>

        {/* Average Rating Card */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-100">Average Rating</p>
            <p className="text-3xl font-bold mb-2">4.8</p>
            <p className="text-xs text-yellow-200">Based on 50+ reviews</p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">New Booking</span>
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Add Technician</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-all">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      #{booking.bookingNumber}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      {booking.service.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {booking.contact.firstName} {booking.contact.lastName} • {new Date(booking.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No bookings yet</p>
                <p className="text-gray-400 text-xs mt-1">Start building your business!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-sm">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Assign Pending Jobs</span>
            </button>
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-sm">
              <Users className="w-5 h-5" />
              <span className="font-medium">Add New Technician</span>
            </button>
            <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-sm">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">View All Bookings</span>
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

export default AdminDashboard
