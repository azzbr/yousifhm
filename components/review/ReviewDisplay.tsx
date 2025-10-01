'use client'

import { useEffect, useState } from 'react'
import { Star, User, MessageCircle, ThumbsUp } from 'lucide-react'

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
  verifiedJob: boolean
  helpful: number
  createdAt: string
  booking: {
    service: {
      name: string
    }
    technician: {
      user: {
        name: string
      }
    }
  }
}

interface ReviewStats {
  _avg: {
    overallRating: number | null
    qualityRating: number | null
    timelinessRating: number | null
    communicationRating: number | null
    valueRating: number | null
  }
  _count: {
    id: number
  }
}

interface ReviewDisplayProps {
  serviceId: string
  limit?: number
}

const RatingStars = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
  const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className={`ml-1 text-${size === 'sm' ? 'xs' : 'sm'} font-medium`}>
        {rating}
      </span>
    </div>
  )
}

const TrustBadge = ({
  rating,
  count,
  overallRating
}: {
  rating: number
  count: number
  overallRating: number
}) => {
  const badgeText = (() => {
    if (overallRating >= 4.5) return "Excellent"
    if (overallRating >= 4.0) return "Very Good"
    if (overallRating >= 3.5) return "Good"
    if (overallRating >= 3.0) return "Fair"
    return "Needs Improvement"
  })()

  const badgeColor = (() => {
    if (overallRating >= 4.5) return "bg-green-100 text-green-800 border-green-200"
    if (overallRating >= 4.0) return "bg-blue-100 text-blue-800 border-blue-200"
    if (overallRating >= 3.5) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-orange-100 text-orange-800 border-orange-200"
  })()

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${badgeColor}`}>
      <Star className="w-3 h-3 mr-1" />
      {badgeText} ({count} reviews)
    </div>
  )
}

export default function ReviewDisplay({ serviceId, limit = 5 }: ReviewDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?serviceId=${serviceId}&limit=${limit}`)
        const data = await response.json()

        if (data.success) {
          setReviews(data.reviews || [])
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [serviceId, limit])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (daysAgo === 0) return 'Today'
    if (daysAgo === 1) return 'Yesterday'
    if (daysAgo < 7) return `${daysAgo} days ago`
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`

    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gray-200 rounded-full h-8 w-8"></div>
            <div>
              <div className="bg-gray-200 h-4 w-32 mb-1"></div>
              <div className="bg-gray-200 h-3 w-24"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-200 h-3 w-full"></div>
            <div className="bg-gray-200 h-3 w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats || reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No reviews yet for this service.</p>
        <p className="text-sm text-gray-400 mt-1">Be the first to review!</p>
      </div>
    )
  }

  const avgRating = stats._avg.overallRating || 0

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
            <TrustBadge
              rating={avgRating}
              count={stats._count.id}
              overallRating={avgRating}
            />
          </div>
          <div className="text-right">
            <div className="flex items-center justify-center text-3xl font-bold text-blue-600 mb-2">
              {avgRating.toFixed(1)}
              <Star className="w-8 h-8 ml-2 text-yellow-400 fill-current" />
            </div>
            <p className="text-sm text-gray-600">
              Based on {stats._count.id} review{(stats._count.id !== 1) ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Detailed Ratings */}
        {stats._avg.qualityRating && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quality:</span>
              <RatingStars rating={Math.round(stats._avg.qualityRating)} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Timeliness:</span>
              <RatingStars rating={Math.round(stats._avg.timelinessRating || 0)} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Communication:</span>
              <RatingStars rating={Math.round(stats._avg.communicationRating || 0)} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Value:</span>
              <RatingStars rating={Math.round(stats._avg.valueRating || 0)} size="sm" />
            </div>
          </div>
        )}
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {review.booking.service.name}
                  </p>
                  {review.booking.technician?.user?.name && (
                    <p className="text-xs text-gray-600">
                      Technican: {review.booking.technician.user.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <RatingStars rating={review.overallRating} />
                <div className="flex items-center justify-end space-x-1 text-xs text-gray-500 mt-1">
                  {review.verifiedJob && (
                    <>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Verified purchase</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Comment */}
              {review.comment && (
                <div className="flex space-x-2">
                  <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              )}

              {/* Positives */}
              {review.positives && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-900">
                    <strong>What went well:</strong> {review.positives}
                  </p>
                </div>
              )}

              {/* Improvements */}
              {review.improvements && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-900">
                    <strong>Suggestions:</strong> {review.improvements}
                  </p>
                </div>
              )}

              {/* Review Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>{formatDate(review.createdAt)}</span>
                <div className="flex items-center space-x-4">
                  {review.helpful > 0 && (
                    <span className="flex items-center">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {review.helpful} helpful
                    </span>
                  )}
                  <span>Verified review</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Link */}
      {reviews.length >= limit && (
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all {stats._count.id} reviews →
          </button>
        </div>
      )}
    </div>
  )
}

// Compact version for service cards
export function ReviewSummary({
  serviceId,
  size = 'compact'
}: {
  serviceId: string
  size?: 'compact' | 'full'
}) {
  const [stats, setStats] = useState<ReviewStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/reviews?serviceId=${serviceId}&limit=1`)
        const data = await response.json()

        if (data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch review stats:', error)
      }
    }

    fetchStats()
  }, [serviceId])

  if (!stats || stats._count.id === 0) {
    return size === 'compact' ? (
      <div className="text-xs text-gray-500">No reviews yet</div>
    ) : (
      <div className="flex items-center space-x-1 text-sm text-gray-500">
        <Star className="w-4 h-4 text-gray-300" />
        <span>No reviews</span>
      </div>
    )
  }

  const avgRating = stats._avg.overallRating || 0

  if (size === 'compact') {
    return (
      <div className="flex items-center space-x-1">
        <RatingStars rating={Math.round(avgRating)} size="sm" />
        <span className="text-xs text-gray-500">({stats._count.id})</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <RatingStars rating={avgRating} />
      <span className="text-sm text-gray-600">
        {stats._count.id} review{(stats._count.id !== 1) ? 's' : ''}
      </span>
    </div>
  )
}
