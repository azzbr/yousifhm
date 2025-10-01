'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Star, Camera } from 'lucide-react'

const reviewSchema = z.object({
  overallRating: z.number().min(1).max(5),
  qualityRating: z.number().min(1).max(5),
  timelinessRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5),
  valueRating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
  positives: z.string().max(500).optional(),
  improvements: z.string().max(500).optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  serviceName: string
  technicianName?: string
  onSubmit: (review: ReviewFormData) => void
}

const StarRating = ({
  rating,
  onRatingChange,
  label
}: {
  rating: number
  onRatingChange: (rating: number) => void
  label: string
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            type="button"
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ReviewModal({
  isOpen,
  onClose,
  bookingId,
  serviceName,
  technicianName,
  onSubmit
}: ReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallRating: 0,
      qualityRating: 0,
      timelinessRating: 0,
      communicationRating: 0,
      valueRating: 0,
      comment: '',
      positives: '',
      improvements: ''
    }
  })

  const watchedRatings = watch()

  const handleFormSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)

    try {
      await onSubmit(data)
      setIsSubmitted(true)

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        reset()
      }, 2000)
    } catch (error) {
      console.error('Review submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Rate Your Service Experience
              </h3>
              <p className="text-sm text-gray-600">
                Help others find great service providers in Bahrain
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Success message */}
          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Thank you for your review!
                  </h3>
                  <p className="text-sm text-green-700">
                    Your feedback helps improve our service quality.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isSubmitted && (
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Service Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{serviceName}</h4>
                {technicianName && (
                  <p className="text-sm text-gray-600">Technician: {technicianName}</p>
                )}
              </div>

              {/* Overall Rating */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Overall Rating *
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={watchedRatings.overallRating || 0}
                    onRatingChange={(rating) => setValue('overallRating', rating)}
                    label=""
                  />
                </div>
                <div className="flex justify-center mt-2 space-x-4 text-xs">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`font-medium ${
                      star <= (watchedRatings.overallRating || 0)
                        ? 'text-yellow-600'
                        : 'text-gray-400'
                    }`}>
                      {star === 1 && 'Poor'}
                      {star === 2 && 'Fair'}
                      {star === 3 && 'Good'}
                      {star === 4 && 'Very Good'}
                      {star === 5 && 'Excellent'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Ratings */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-900">Detailed Feedback</h5>

                <StarRating
                  rating={watchedRatings.qualityRating || 0}
                  onRatingChange={(rating) => setValue('qualityRating', rating)}
                  label="Service Quality"
                />

                <StarRating
                  rating={watchedRatings.timelinessRating || 0}
                  onRatingChange={(rating) => setValue('timelinessRating', rating)}
                  label="Timeliness"
                />

                <StarRating
                  rating={watchedRatings.communicationRating || 0}
                  onRatingChange={(rating) => setValue('communicationRating', rating)}
                  label="Communication"
                />

                <StarRating
                  rating={watchedRatings.valueRating || 0}
                  onRatingChange={(rating) => setValue('valueRating', rating)}
                  label="Value for Money"
                />
              </div>

              {/* Written Feedback */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Written Review (Optional)
                  </label>
                  <textarea
                    {...register('comment')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Share your experience... what went well? Any suggestions?"
                  />
                  {errors.comment && (
                    <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What went well? (Optional)
                  </label>
                  <textarea
                    {...register('positives')}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="What did you particularly appreciate?"
                  />
                  {errors.positives && (
                    <p className="mt-1 text-sm text-red-600">{errors.positives.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas for Improvement (Optional)
                  </label>
                  <textarea
                    {...register('improvements')}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Any constructive feedback to help us improve?"
                  />
                  {errors.improvements && (
                    <p className="mt-1 text-sm text-red-600">{errors.improvements.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || watchedRatings.overallRating === 0}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

              {/* Privacy Note */}
              <p className="text-xs text-gray-500 text-center">
                Reviews are moderated before publishing. Personal information remains private.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
