'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  DollarSign,
  Star,
  Search,
  Filter,
  Download,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle
} from 'lucide-react'

interface CompletedJob {
  id: string
  bookingNumber: string
  completedAt: string
  service: {
    name: string
    category: string
  }
  pricingOption: {
    price: number
  }
  contact: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
  address: {
    area: string
    building: string
    block: string
  }
  finalPrice: number
  notes?: string
}

export default function TechnicianHistory() {
  const { data: session, status } = useSession()
  const [jobs, setJobs] = useState<CompletedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalEarnings: 0,
    averageRating: 0
  })

  // Redirect if not authenticated or not technician
  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any)?.role !== 'TECHNICIAN') {
      redirect('/auth/signin?callbackUrl=/technician/history')
    }
  }, [session, status])

  useEffect(() => {
    if (!session) return

    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/technician/history')
        const data = await response.json()

        if (data.success) {
          setJobs(data.jobs || [])
          setStats(data.stats || { totalJobs: 0, totalEarnings: 0, averageRating: 0 })
        }
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [session])

  // Filter jobs based on search and date
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' ||
      job.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.service.name.toLowerCase().includes(searchTerm.toLowerCase())

    const completedDate = new Date(job.completedAt)
    const now = new Date()

    let matchesDate = true
    switch (dateFilter) {
      case 'week':
        matchesDate = completedDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        matchesDate = completedDate.getMonth() === now.getMonth() && completedDate.getFullYear() === now.getFullYear()
        break
      case '3months':
        matchesDate = completedDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        matchesDate = true
    }

    return matchesSearch && matchesDate
  })

  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      ['Booking Number', 'Date Completed', 'Service', 'Customer', 'Phone', 'Earnings', 'Address'].join(','),
      ...filteredJobs.map(job => [
        `"${job.bookingNumber}"`,
        `"${new Date(job.completedAt).toLocaleDateString()}"`,
        `"${job.service.name}"`,
        `"${job.contact.firstName} ${job.contact.lastName}"`,
        `"${job.contact.phone}"`,
        `"BD ${(job.finalPrice / 100).toFixed(2)}"`,
        `"${job.address.area}, ${job.address.building}"`
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `job-history-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your job history...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'TECHNICIAN') {
    return null // Will redirect
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Job History</h1>
          <p className="text-gray-600">View and manage your completed work</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalJobs}
              </div>
              <p className="text-sm text-gray-600">Total Jobs Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                BD {stats.totalEarnings / 100}
              </div>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.averageRating?.toFixed(1) || 'N/A'}
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
              />
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="week">Past Week</option>
                <option value="month">This Month</option>
                <option value="3months">Past 3 Months</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        #{job.bookingNumber}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(job.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{job.service.name}</p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-2xl font-bold text-green-600">
                      BD {job.finalPrice / 100}
                    </p>
                    <p className="text-sm text-gray-500">Earned</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{job.contact.firstName} {job.contact.lastName}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <a
                          href={`tel:${job.contact.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {job.contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Completed: {new Date(job.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{job.address.area}, {job.address.building}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        <span>BD {job.pricingOption.price / 100} (agreed rate)</span>
                      </div>
                      {stats.averageRating && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                          <span>Rated {stats.averageRating?.toFixed(1)}/5.0</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {job.notes && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Completion Notes</p>
                    <p className="text-sm text-blue-800">{job.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || dateFilter !== 'all' ? 'No jobs match your filters' : 'No completed jobs yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || dateFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Complete your first job to see it here'}
              </p>
              {(searchTerm || dateFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setDateFilter('all')
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
