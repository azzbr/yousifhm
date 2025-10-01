'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Phone,
  Calendar
} from 'lucide-react'

interface Booking {
  id: string
  bookingNumber: string
  status: string
  scheduledDate: string
  createdAt: string
  estimatedPrice: number | null
  finalPrice: number | null
  notes: string | null
  client: {
    id: string
    name: string
    email: string
    phone: string
  }
  technician: {
    user: {
      name: string
    }
  } | null
  service: {
    id: string
    name: string
    category: string
  }
  pricingOption: {
    id: string
    name: string
    price: number
    duration: number
  } | null
  address: {
    area: string
    building: string
    block: string
  }
  contact: {
    firstName: string
    lastName: string
    phone: string
  }
  payment: {
    amount: number
    status: string
  } | null
}

interface Technician {
  id: string
  user: {
    name: string
  }
}

export default function AdminBookings() {
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null)

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      redirect('/auth/signin?callbackUrl=/admin/bookings')
    }
  }, [session, status])

  // Fetch data
  useEffect(() => {
    if (!session) return

    const fetchData = async () => {
      try {
        const [bookingsRes, techniciansRes] = await Promise.all([
          fetch('/api/admin/bookings'),
          fetch('/api/admin/technicians') // We'll need to create this endpoint
        ])

        const [bookingsData, techniciansData] = await Promise.all([
          bookingsRes.json(),
          techniciansRes.json()
        ])

        if (bookingsData.success) {
          setBookings(bookingsData.bookings || [])
        }

        if (techniciansData.success) {
          setTechnicians(techniciansData.technicians || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  const handleStatusUpdate = async (bookingId: string, newStatus: string, technicianId?: string, notes?: string) => {
    setUpdatingBookingId(bookingId)

    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
          technicianId,
          notes
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setBookings(bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        ))
        alert('Booking updated successfully!')
      } else {
        alert('Failed to update booking: ' + data.message)
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update booking')
    } finally {
      setUpdatingBookingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-purple-100 text-purple-800'
      case 'PENDING':
        return 'bg-orange-100 text-orange-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  // Filter and search bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const matchesSearch = searchTerm === '' ||
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return null // Will redirect
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="mt-2 text-gray-600">
            View and manage all customer bookings
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by booking number, customer, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Bookings ({filteredBookings.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{booking.bookingNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(booking.scheduledDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {booking.address.area}, {booking.address.building}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.client.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {booking.client.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.service.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.pricingOption?.name} - {booking.pricingOption?.duration}min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.technician?.user?.name || 'Unassigned'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        BD {((booking.finalPrice || booking.estimatedPrice || 0) / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        {booking.status === 'PENDING' && (
                          <button
                            onClick={() => {
                              const technicianId = prompt('Enter technician ID:')
                              if (technicianId) {
                                handleStatusUpdate(booking.id, 'ASSIGNED', technicianId)
                              }
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            disabled={updatingBookingId === booking.id}
                          >
                            {updatingBookingId === booking.id ? '...' : 'Assign'}
                          </button>
                        )}
                        {(booking.status === 'ASSIGNED' || booking.status === 'CONFIRMED') && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'IN_PROGRESS')}
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700"
                            disabled={updatingBookingId === booking.id}
                          >
                            {updatingBookingId === booking.id ? '...' : 'Start'}
                          </button>
                        )}
                        {booking.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                            disabled={updatingBookingId === booking.id}
                          >
                            {updatingBookingId === booking.id ? '...' : 'Complete'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg">No bookings found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === 'PENDING').length}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === 'ASSIGNED' || b.status === 'IN_PROGRESS').length}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === 'COMPLETED').length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">
            BD {((bookings.reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0)) / 100).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>
    </div>
  )
}
