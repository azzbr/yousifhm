'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Home, LogIn } from 'lucide-react'
import { Suspense } from 'react'

function AuthErrorPageContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Authentication service is not properly configured. Please contact the administrator.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to access this resource.'
      case 'Verification':
        return 'Email verification failed. The token may be invalid or expired.'
      case 'CredentialsSignin':
        return 'Invalid credentials. Please check your email and password.'
      case 'EmailSignin':
        return 'Failed to send email. Please try again later.'
      case 'OAuthSignin':
        return 'Failed to sign in with the selected provider.'
      case 'OAuthCallback':
        return 'OAuth callback URL error.'
      case 'OAuthCreateAccount':
        return 'Failed to create account with the selected provider.'
      case 'EmailCreateAccount':
        return 'Failed to create account with email.'
      case 'Callback':
        return 'Callback URL verification failed.'
      case 'OAuthAccountNotLinked':
        return 'This account is not linked. Please sign in with the correct provider.'
      case 'EmailSignInError':
        return 'Could not send verification email. Please try again.'
      case 'SessionRequired':
        return 'You must be signed in to access this page.'
      default:
        return 'An authentication error occurred. Please try again or contact support.'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Error Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Error
            </h2>

            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">
                {getErrorMessage(error)}
              </p>
            </div>

            {/* Error Details for Debugging */}
            {error && (
              <div className="bg-gray-50 p-3 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-500 mb-1">Error Code:</p>
                <code className="text-sm text-red-600 font-mono">{error}</code>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Try Sign In Again
              </Link>

              <Link
                href="/"
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            If this error persists, please try using the demo accounts or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AuthErrorPageContent />
    </Suspense>
  )
}
