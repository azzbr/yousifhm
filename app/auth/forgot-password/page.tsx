'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmitForgotPassword = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset email')
      }

      setSuccess(true)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.')
      console.error('Forgot password error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Success Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Check Your Email
            </h2>
            <p className="text-gray-600 mt-2">
              We've sent a password reset link to <strong>{getValues('email')}</strong>
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Instructions Sent</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>If an account with that email exists, you'll receive a password reset link within a few minutes.</p>
              <p>Click the link in the email to create a new password for your account.</p>
              <p className="font-medium">The link will expire in 24 hours for security reasons.</p>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Sign In
            </Link>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-6">
            Reset Your Password
          </h2>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit(onSubmitForgotPassword)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Reset Email...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Reset Email
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back to Sign In */}
        <div className="text-center">
          <Link href="/auth/signin" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </Link>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="w-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Secure Password Reset</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your password reset links expire in 24 hours and can only be used once for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
