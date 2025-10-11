'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Clock,
  DollarSign,
  CheckCircle,
  Play,
  AlertTriangle,
  User,
  Calendar as CalendarIcon,
  Building2
} from 'lucide-react'

interface Job {
  id: string
  bookingNumber: string
  status: string
  scheduledDate: string
  service: {
    name: string
    category: string
  }
  pricingOption: {
    name: string
    price: number
    duration: number
  }
  address: {
    area: string
    building: string
    block: string
  }
  contact: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
  notes: string | null
  finalPrice: number | null
  createdAt: string
}

export default function TechnicianDashboard() {
  const { data: session, status } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingJobId, setUpdatingJobId] = useState<string | null>(null)

  // Redirect if not authenticated or not technician
  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any)?.role !== 'TECHNICIAN') {
      redirect('/auth/signin?callbackUrl=/technician/dashboard')
    }
  }, [session, status])

  useEffect(() => {
    if (!session) return

    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/technician/jobs')
        const data = await response.json()

        if (data.success) {
          setJobs(data.jobs || [])
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [session])

  const handleJobUpdate = async (jobId: string, newStatus: string, notes?: string) => {
    setUpdatingJobId(jobId)

    try {
      const response = await fetch('/api/technician/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          status: newStatus,
          notes
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setJobs(jobs.map(job =>
          job.id === jobId ? { ...job, status: newStatus } : job
        ))
        alert(`Job ${newStatus.toLowerCase()} successfully!`)
      } else {
        alert('Failed to update job: ' + data.message)
      }
    } catch (error) {
      console.error('Job update error:', error)
      alert('Failed to update job')
    } finally {
      setUpdatingJobId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4" />
      case 'ASSIGNED':
        return <Play className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'TECHNICIAN') {
    return null // Will redirect
  }

  const pendingJobs = jobs.filter(job => job.status === 'ASSIGNED')
  const activeJobs = jobs.filter(job => job.status === 'IN_PROGRESS')
  const completedJobs = jobs.filter(job => job.status === 'COMPLETED')

  return (
    <div className="max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Jobs</p>
                <p className="text-3xl font-bold text-blue-600">{pendingJobs.length}</p>
                <p className="text-xs text-gray-500 mt-1">Ready to start</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-yellow-600">{activeJobs.length}</p>
                <p className="text-xs text-gray-500 mt-1">In progress</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Play className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed This Month</p>
                <p className="text-3xl font-bold text-green-600">{completedJobs.length}</p>
                <p className="text-xs text-gray-500 mt-1">Finished jobs</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-sm text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Monthly Earnings</h2>
              <p className="text-green-100 text-sm">From completed jobs this month</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                BD {completedJobs.reduce((sum, job) => sum + (job.finalPrice || 0), 0) / 100}
              </div>
              <p className="text-green-100 text-sm">
                From {completedJobs.length} completed jobs
              </p>
            </div>
          </div>
        </div>

        {/* Jobs Sections */}
        <div className="space-y-6">
          {/* Pending Jobs */}
          {pendingJobs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Ready to Start ({pendingJobs.length})
                </h3>
                <p className="text-sm text-gray-600">Jobs assigned to you - ready for work</p>
              </div>
              <div className="divide-y divide-gray-200">
                {pendingJobs.map(job => (
                  <div key={job.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          #{job.bookingNumber}
                        </h4>
                        <p className="text-gray-600">{job.service.name}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1">Ready to Start</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {new Date(job.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.address.area}, {job.address.building}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        BD {(job.finalPrice || job.pricingOption.price) / 100}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{job.contact.firstName} {job.contact.lastName}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <a
                            href={`tel:${job.contact.phone}`}
                            className="text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {job.contact.phone}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJobUpdate(job.id, 'IN_PROGRESS')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        disabled={updatingJobId === job.id}
                      >
                        <Play className="w-4 h-4" />
                        <span>{updatingJobId === job.id ? 'Starting...' : 'Start Job'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Jobs */}
          {activeJobs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  In Progress ({activeJobs.length})
                </h3>
                <p className="text-sm text-gray-600">Jobs you're currently working on</p>
              </div>
              <div className="divide-y divide-gray-200">
                {activeJobs.map(job => (
                  <div key={job.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          #{job.bookingNumber}
                        </h4>
                        <p className="text-gray-600">Started: {new Date().toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1">In Progress</span>
                      </span>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Job Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Service:</strong> {job.service.name}</p>
                          <p><strong>Time Estimate:</strong> {job.pricingOption.duration} mins</p>
                        </div>
                        <div>
                          <p><strong>Customer:</strong> {job.contact.firstName} {job.contact.lastName}</p>
                          <p><strong>Phone:</strong> <a href={`tel:${job.contact.phone}`} className="text-blue-600 hover:underline">{job.contact.phone}</a></p>
                        </div>
                      </div>
                    </div>

                    {job.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-yellow-900 mb-1">Special Instructions</p>
                        <p className="text-sm text-yellow-800">{job.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const notes = prompt('Any completion notes?')
                          handleJobUpdate(job.id, 'COMPLETED', notes || undefined)
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        disabled={updatingJobId === job.id}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{updatingJobId === job.id ? 'Completing...' : 'Mark Complete'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Jobs */}
          {jobs.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Assigned</h3>
                <p className="text-gray-600">
                  You're not assigned to any jobs right now. Admin will assign new jobs as they come in.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Check back later or contact admin if you think this is an error.
                </p>
              </div>
            </div>
          )}
        </div>
    </div>
  )
}
