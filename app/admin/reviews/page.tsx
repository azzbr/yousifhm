'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
  Star,
  CheckCircle,
  XCircle,
  MessageCircle,
  ThumbsUp,
  Eye,
  EyeOff,
  User,
  Calendar as CalendarIcon,
  AlertTriangle
} from 'lucide-react'

interface Review {
  id: string
  overallRating: number
  qualityRating: number
  timelinessRating: number
  communicationRating: number
  valueRating: number
  comment: string | null
  positives: string | null
  improvements: string | null
  published: boolean
  moderationNotes: string | null
  verifiedJob: boolean
  helpful: number
  createdAt: string
  booking: {
    service: {
      name: string
      category: string
    }
    technician: {
      user: {
        name: string
      }
    }
  }
}

export default function AdminReviews() {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'published'>('pending')
  const [moderatingReviewId, setModeratingReviewId] = useState<string | null>(null)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      redirect('/auth/signin?callbackUrl=/admin/reviews')
    }
  }, [session, status])

  useEffect(() => {
    if (!session) return

    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/admin/reviews')
        const data = await response.json()

        if (data.success) {
          setReviews(data.reviews || [])
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [session])

  const handleReviewAction = async (
    reviewId: string,
    action: 'approve' | 'deny',
    notes?: string
  ) => {
    setModeratingReviewId(reviewId)

    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId,
          action,
          notes
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setReviews(reviews.map(review =>
          review.id === reviewId
            ? {
                ...review,
                published: action === 'approve',
                moderationNotes: notes
              }
            : review
        ))

        alert(`Review ${action}d successfully!`)
      } else {
        alert('Failed to moderate review: ' + data.message)
      }
    } catch (error) {
      console.error('Review moderation error:', error)
      alert('Failed to moderate review')
    } finally {
      setModeratingReviewId(null)
    }
  }

  const getStatusColor = (published: boolean) => {
    if (published) return 'text-green-600 bg-green-100'
    return 'text-yellow-600 bg-yellow-100'
  }

  const getStatusIcon = (published: boolean) => {
    return published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />
  }

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 font-medium">{rating}</span>
    </div>
  )

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'pending') return !review.published
    if (filterStatus === 'published') return review.published
    return true
  })

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Review Moderation</h1>
          <p className="mt-2 text-gray-600">
            Review and moderate customer feedback before publishing
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredReviews.filter(r => !r.published).length} pending reviews
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {reviews.filter(r => !r.published).length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {reviews.filter(r => r.published).length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1)
              : '0.0'}
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {(['all', 'pending', 'published'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' && `All (${reviews.length})`}
            {status === 'pending' && `Pending (${reviews.filter(r => !r.published).length})`}
            {status === 'published' && `Published (${reviews.filter(r => r.published).length})`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {review.booking.service.name}
                      </h3>
                      {review.booking.technician?.user?.name && (
                        <span className="text-sm text-gray-500">
                          by {review.booking.technician.user.name}
                        </span>
                      )}
                    </div>
                    <RatingStars rating={review.overallRating} />
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(review.published)}`}>
                      {getStatusIcon(review.published)}
                      <span className="ml-1">{review.published ? 'Published' : 'Pending'}</span>
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Rating Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Quality:</span>
                    <RatingStars rating={review.qualityRating} />
                  </div>
                  <div>
                    <span className="text-gray-600">Timeliness:</span>
                    <RatingStars rating={review.timelinessRating} />
                  </div>
                  <div>
                    <span className="text-gray-600">Communication:</span>
                    <RatingStars rating={review.communicationRating} />
                  </div>
                  <div>
                    <span className="text-gray-600">Value:</span>
                    <RatingStars rating={review.valueRating} />
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-3">
                  {review.comment && (
                    <div>
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="w-4 h-4 text-gray-500 mt-1" />
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  )}

                  {review.positives && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-900 font-medium">
                        ✅ What went well: {review.positives}
                      </p>
                    </div>
                  )}

                  {review.improvements && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-900 font-medium">
                        💡 Suggestions: {review.improvements}
                      </p>
                    </div>
                  )}
                </div>

                {/* Moderation Notes */}
                {review.moderationNotes && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-gray-600 font-medium">Moderation Notes: {review.moderationNotes}</p>
                  </div>
                )}

                {/* Verification Badge */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    {review.verifiedJob && (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Verified service completion</span>
                      </>
                    )}
                    {review.helpful > 0 && (
                      <span className="flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {review.helpful} helpful
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  {!review.published && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReviewAction(review.id, 'deny', 'Inappropriate content')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                        disabled={moderatingReviewId === review.id}
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Deny</span>
                      </button>
                      <button
                        onClick={() => handleReviewAction(review.id, 'approve')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                        disabled={moderatingReviewId === review.id}
                      >
                        {moderatingReviewId === review.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-white"></div>
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        <span>Approve</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterStatus === 'pending' ? 'No pending reviews' : 'No reviews found'}
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'pending'
                ? 'All reviews have been moderated'
                : 'Try changing the filter to see different reviews'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
