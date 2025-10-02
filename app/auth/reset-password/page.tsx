'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
           'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const onSubmitResetPassword = async (data: ResetPasswordFormData) => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: data.password
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset password')
      }

      setSuccess(true)

      // Redirect to sign in after a delay
      setTimeout(() => {
        router.push('/auth/signin?message=password-reset-success')
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.')
      console.error('Reset password error:', err)
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
              Password Reset Successful
            </h2>
            <p className="text-gray-600 mt-2">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Password Set</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your new password is now active. For security reasons, make sure to:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Use a strong, unique password</li>
              <li>• Enable two-factor authentication if available</li>
              <li>• Never share your password with others</li>
            </ul>
          </div>

          {/* Redirect Info */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Redirecting to sign in page in a few seconds...
            </p>
          </div>

          {/* Manual Navigation */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Error Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 mt-2">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>

          {/* Error Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Request New Reset Link
            </Link>
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
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-6">
            Set New Password
          </h2>
          <p className="text-gray-600 mt-2">
            Enter a strong, secure password for your account
          </p>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit(onSubmitResetPassword)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 characters with uppercase, lowercase, and number
              </p>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                  Updating Password...
                </>
              ) : (
                <>
                  Reset Password
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back to Forgot Password */}
        <div className="text-center">
          <Link href="/auth/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Password Reset
          </Link>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Password Security</h3>
              <p className="text-sm text-blue-700 mt-1">
                Choose a strong password that you haven't used elsewhere. Your account security depends on it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
