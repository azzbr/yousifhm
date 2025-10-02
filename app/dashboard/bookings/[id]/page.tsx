'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Car,
  Star,
  Send,
  MessageSquare
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const reviewSchema = z.object({
  overallRating: z.number().min(1).max(5),
  qualityRating: z.number().min(1).max(5).optional(),
  timelinessRating: z.number().min(1).max(5).optional(),
  communicationRating: z.number().min(1).max(5).optional(),
  valueRating: z.number().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
  positives: z.string().max(200).optional(),
  improvements: z.string().max(200).optional()
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface BookingDetails {
  id: string
  bookingNumber: string
  status: string
  scheduledDate: string
  timeSlot: string
  finalPrice?: number
  estimatedPrice?: number
  notes?: string
  internalNotes?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  service: {
    id: string
    name: string
    description: string
    category: string
  }
  technician?: {
    id: string
    user: {
      name: string
      phone?: string
    }
    rating: number
    reviewCount: number
    experienceYears: number
    hasVehicle: boolean
    certifications: string[]
  }
  address: {
    id: string
    area: string
    block: string
    road: string
    building: string
    flat?: string
    additionalInfo?: string
  }
  contact: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  review?: {
    id: string
    overallRating: number
    qualityRating?: number
    timelinessRating?: number
    communicationRating?: number
    valueRating?: number
    comment?: string
    positives?: string
    improvements?: string
    createdAt: string
  }
}

export default function BookingDetails({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)

  const showReview = searchParams.get('review') === 'true'

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallRating: 0,
      qualityRating: 0,
      timelinessRating: 0,
      communicationRating: 0,
      valueRating: 0
    }
  })

  useEffect(() => {
    fetchBookingDetails()
    if (showReview) {
      setShowReviewForm(true)
    }
  }, [params.id])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customer/bookings/${params.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch booking details')
      }

      const data = await response.json()
      setBooking(data.booking)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booking details')
      console.error('Booking details fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitReview = async (data: ReviewFormData) => {
    setSubmittingReview(true)
    try {
      const response = await fetch(`/api/customer/bookings/${params.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      const result = await response.json()

      // Refresh booking data to show the new review
      await fetchBookingDetails()
      setShowReviewForm(false)

      // Show success message
      alert('Thank you for your review! It helps other customers make informed decisions.')

    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit review')
      console.error('Review submission error:', err)
    } finally {
      setSubmittingReview(false)
    }
  }

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5" />
      case 'CANCELLED': case 'REFUNDED': return <XCircle className="w-5 h-5" />
      case 'PENDING': return <AlertCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const formatPrice = (price?: number) => {
    return price ? `BHD ${price.toFixed(3)}` : 'Quote pending'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const StarRating = ({ rating, onChange, readonly = false }: {
    rating: number,
    onChange?: (rating: number) => void,
    readonly?: boolean
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} ${readonly ? '' : 'hover:text-yellow-500 cursor-pointer'}`}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Link>

          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error || 'Booking not found'}
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  The booking you're looking for may not exist or you don't have permission to view it.
                </p>
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
        {/* Back Button */}
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Bookings
        </Link>

        {/* Booking Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Booking #{booking.bookingNumber}
              </h1>
              <p className="text-gray-600 mt-1">{booking.service.name}</p>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="ml-2 capitalize">
                {booking.status.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>{formatDate(booking.scheduledDate)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>{booking.timeSlot}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium">{formatPrice(booking.finalPrice || booking.estimatedPrice)}</span>
            </div>
          </div>
        </div>

        {/* Review Form (if applicable) */}
        {showReviewForm && booking.status === 'COMPLETED' && !booking.review && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Share Your Experience</h2>
            <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-6">
              {/* Overall Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating * (Required)
                </label>
                <StarRating
                  rating={watch('overallRating')}
                  onChange={(rating) => setValue('overallRating', rating)}
                />
                {errors.overallRating && (
                  <p className="mt-1 text-sm text-red-600">{errors.overallRating.message}</p>
                )}
              </div>

              {/* Detailed Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Quality
                  </label>
                  <StarRating
                    rating={watch('qualityRating') || 0}
                    onChange={(rating) => setValue('qualityRating', rating)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Punctuality
                  </label>
                  <StarRating
                    rating={watch('timelinessRating') || 0}
                    onChange={(rating) => setValue('timelinessRating', rating)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Communication
                  </label>
                  <StarRating
                    rating={watch('communicationRating') || 0}
                    onChange={(rating) => setValue('communicationRating', rating)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value for Money
                  </label>
                  <StarRating
                    rating={watch('valueRating') || 0}
                    onChange={(rating) => setValue('valueRating', rating)}
                  />
                </div>
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review (Optional)
                </label>
                <textarea
                  {...register('comment')}
                  rows={4}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tell others about your experience..."
                />
                {errors.comment && (
                  <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
                )}
              </div>

              {/* What you liked */}
              <div>
                <label htmlFor="positives" className="block text-sm font-medium text-gray-700 mb-2">
                  What Did You Like? (Optional)
                </label>
                <input
                  {...register('positives')}
                  type="text"
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Professional, clean work, good communication..."
                />
                {errors.positives && (
                  <p className="mt-1 text-sm text-red-600">{errors.positives.message}</p>
                )}
              </div>

              {/* Improvements */}
              <div>
                <label htmlFor="improvements" className="block text-sm font-medium text-gray-700 mb-2">
                  Areas for Improvement (Optional)
                </label>
                <input
                  {...register('improvements')}
                  type="text"
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Constructive feedback for future improvement..."
                />
                {errors.improvements && (
                  <p className="mt-1 text-sm text-red-600">{errors.improvements.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={submittingReview || watch('overallRating') === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Booking Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{booking.service.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {booking.service.category.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{booking.service.description}</p>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="font-medium">{formatPrice(booking.finalPrice || booking.estimatedPrice)}</span>
                  </div>
                  {booking.finalPrice && booking.estimatedPrice && booking.finalPrice !== booking.estimatedPrice && (
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                      <span>Estimated: {formatPrice(booking.estimatedPrice)}</span>
                      <span>Final: {formatPrice(booking.finalPrice)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Address</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900">
                    Building {booking.address.building}, {booking.address.road}
                  </p>
                  <p className="text-gray-600">
                    Block {booking.address.block}, {booking.address.area}
                  </p>
                  {booking.address.flat && (
                    <p className="text-gray-600">Flat {booking.address.flat}</p>
                  )}
                  {booking.address.additionalInfo && (
                    <p className="text-gray-600">{booking.address.additionalInfo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{booking.contact.firstName} {booking.contact.lastName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{booking.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{booking.contact.email}</span>
                </div>
              </div>
            </div>

            {/* Review (if exists) */}
            {booking.review && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Review</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Overall:</span>
                      <StarRating rating={booking.review.overallRating} readonly />
                    </div>
                  </div>

                  {booking.review.comment && (
                    <div>
                      <p className="text-sm text-gray-900 font-medium">Your Review:</p>
                      <p className="text-sm text-gray-700 mt-1">{booking.review.comment}</p>
                    </div>
                  )}

                  {booking.review.positives && (
                    <div>
                      <p className="text-sm text-gray-900 font-medium">What you liked:</p>
                      <p className="text-sm text-gray-700 mt-1">{booking.review.positives}</p>
                    </div>
                  )}

                  {booking.review.improvements && (
                    <div>
                      <p className="text-sm text-gray-900 font-medium">Areas for improvement:</p>
                      <p className="text-sm text-gray-700 mt-1">{booking.review.improvements}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Technician Sidebar */}
          <div className="space-y-6">
            {booking.technician ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Technician</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{booking.technician.user.name}</h4>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {booking.technician.rating.toFixed(1)} ({booking.technician.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  {booking.technician.user.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {booking.technician.user.phone}
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <div>{booking.technician.experienceYears} years experience</div>
                    <div className="mt-1">
                      {booking.technician.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {booking.technician.certifications.slice(0, 2).map((cert) => (
                            <span key={cert} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {cert}
                            </span>
                          ))}
                          {booking.technician.certifications.length > 2 && (
                            <span className="text-xs text-gray-500">+{booking.technician.certifications.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {booking.technician.hasVehicle && (
                    <div className="flex items-center text-sm text-green-600">
                      <Car className="w-4 h-4 mr-2" />
                      Owns service vehicle
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Technician not assigned yet</p>
              </div>
            )}

            {/* Booking Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Booked on {formatDate(booking.createdAt)}</span>
                </div>
                {booking.status !== 'PENDING' && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Status updated to {booking.status.toLowerCase().replace('_', ' ')}</span>
                  </div>
                )}
                {booking.completedAt && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Completed on {formatDate(booking.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
