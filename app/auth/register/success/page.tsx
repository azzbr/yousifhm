'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle,
  Mail,
  ArrowRight,
  Home,
  Calendar,
  Shield
} from 'lucide-react'

export default function RegistrationSuccessPage() {
  const router = useRouter()
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    // Simulate sending welcome email (could be real in production)
    const timer = setTimeout(() => {
      setEmailSent(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Bahrain Handyman!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. You're now ready to book and manage handyman services.
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {/* Email Confirmation */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${emailSent ? 'bg-green-100' : 'bg-blue-100'}`}>
                <Mail className={`w-4 h-4 ${emailSent ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {emailSent ? 'Welcome email sent!' : 'Sending welcome email...'}
                </p>
                <p className="text-xs text-gray-600">
                  {emailSent
                    ? 'Check your inbox for account details and next steps'
                    : 'Please wait while we send your welcome email'
                  }
                </p>
              </div>
              {emailSent ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Account Features */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Your Account Features
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  Book appointments with verified technicians
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-blue-600" />
                  Track booking status and history
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Home className="w-4 h-4 mr-2 text-blue-600" />
                  Manage multiple addresses and favorites
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/services"
            className="w-full flex justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Services
          </Link>
        </div>

        {/* Additional Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-500">
              Contact our support team
            </Link>
          </p>

          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Bahrain Handyman
          </Link>
        </div>
      </div>
    </div>
  )
}
