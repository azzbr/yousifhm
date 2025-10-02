'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  Search,
  Eye,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  User,
  Phone,
  Mail
} from 'lucide-react'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

interface Booking {
  id: string
  bookingNumber: string
  status: BookingStatus
  scheduledDate: string
  timeSlot: string
  finalPrice?: number
  notes?: string
  createdAt: string
  service: {
    name: string
    category: string
  }
  technician?: {
    user: {
      name: string
      phone?: string
    }
  }
  address: {
    area: string
    block: string
    road: string
    building: string
  }
  review?: {
    overallRating: number
    comment?: string
  }
}

type FilterStatus = 'all' | 'upcoming' | 'completed' | 'cancelled' | 'pending'

export default function CustomerBookings() {
  const { data: session } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'status' | 'service'>('date-desc')

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterAndSortBookings()
  }, [bookings, filter, searchQuery, sortBy])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customer/bookings')

      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
      console.error('Bookings fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortBookings = () => {
    let filtered = [...bookings]

    // Apply status filter
    if (filter !== 'all') {
      switch (filter) {
        case 'upcoming':
          filtered = filtered.filter(booking =>
            ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'].includes(booking.status) &&
            new Date(booking.scheduledDate) >= new Date()
          )
          break
        case 'completed':
          filtered = filtered.filter(booking => booking.status === 'COMPLETED')
          break
        case 'cancelled':
          filtered = filtered.filter(booking => ['CANCELLED', 'REFUNDED'].includes(booking.status))
          break
        case 'pending':
          filtered = filtered.filter(booking => booking.status === 'PENDING')
          break
      }
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.address.area.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
        case 'date-asc':
          return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        case 'status':
          return a.status.localeCompare(b.status)
        case 'service':
          return a.service.name.localeCompare(b.service.name)
        default:
          return 0
      }
    })

    setFilteredBookings(filtered)
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100 border-green-200'
      case 'CONFIRMED': case 'ASSIGNED': case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'PENDING': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'CANCELLED': case 'REFUNDED':
        return 'text-red-600 bg-red-100 border-red-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED': case 'REFUNDED': return <XCircle className="w-4 h-4" />
      case 'PENDING': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatPrice = (price?: number) => {
    return price ? `BHD ${price.toFixed(3)}` : 'Quote pending'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage and track all your service requests</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/services"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book New Service
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all' as const, label: 'All Bookings', count: bookings.length },
                { key: 'upcoming' as const, label: 'Upcoming', count: bookings.filter(b => ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'].includes(b.status) && new Date(b.scheduledDate) >= new Date()).length },
                { key: 'completed' as const, label: 'Completed', count: bookings.filter(b => b.status === 'COMPLETED').length },
                { key: 'pending' as const, label: 'Pending', count: bookings.filter(b => b.status === 'PENDING').length },
                { key: 'cancelled' as const, label: 'Cancelled', count: bookings.filter(b => ['CANCELLED', 'REFUNDED'].includes(b.status)).length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="status">Status</option>
                <option value="service">Service</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading bookings</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchBookings}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.service.name}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {booking.service.category.replace('_', ' ')}
                        </p>
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">
                          {booking.status.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">{formatDate(booking.scheduledDate)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-1" />
                        {booking.timeSlot}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {booking.address.area}, Building {booking.address.building}
                      </div>

                      {booking.technician && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          {booking.technician.user.name}
                        </div>
                      )}

                      {(booking.status === 'COMPLETED' && booking.finalPrice) && (
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {formatPrice(booking.finalPrice)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Link>

                      {booking.status === 'COMPLETED' && !booking.review && (
                        <Link
                          href={`/dashboard/bookings/${booking.id}?review=true`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Leave Review
                        </Link>
                      )}

                      {booking.status === 'COMPLETED' && booking.review && (
                        <div className="inline-flex items-center px-3 py-2 text-sm text-green-600">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          Review Submitted
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking number */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Booking #{booking.bookingNumber} • Created {formatDate(booking.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : "You haven't booked any services yet"
                }
              </p>
              {(!searchQuery && filter === 'all') && (
                <Link
                  href="/services"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Services
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
